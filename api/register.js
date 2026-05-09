/* ============================================================
   api/register.js — public registration endpoint
   Validates the form payload, enforces capacity + duplicate-email
   checks, inserts a row with status = 'applied', and dispatches
   Email 1 (registrant) and Email 2 (admin). DB write is the source
   of truth — email failures are logged but do not fail the request.
   ============================================================ */

import {
  getSupabase,
  jsonError,
  parseBody,
  trimmedString,
  requireMethod,
  logEvent,
  logServerError,
  ADMIN_REPLY_TO,
  ConfigError,
} from './_shared.js';
import {
  renderEmail1Registration,
  renderEmail2AdminNotification,
  sendEmail,
} from './_emails.js';
import { writeEmailSentLog } from './_log.js';

const SPECIALTY_VALUES = [
  'ftr', 'ortopedi', 'romatoloji', 'spor_hekimligi', 'algoloji', 'diger',
];
const POSITION_VALUES = ['uzman', 'asistan'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTES_MAX = 1000;

// ── Validation ────────────────────────────────────────────────
function validatePayload(body) {
  const errors = [];

  const requireText = (key) => {
    const v = trimmedString(body[key]);
    if (!v) errors.push(`${key} alanı zorunludur`);
    return v;
  };

  const first_name  = requireText('first_name');
  const last_name   = requireText('last_name');
  const email       = requireText('email');
  const phone       = requireText('phone');
  const institution = requireText('institution');
  const event_id    = requireText('event_id');
  const specialty   = trimmedString(body.specialty);
  const position    = trimmedString(body.position);

  if (email && !EMAIL_RE.test(email)) {
    errors.push('Geçerli bir e-posta adresi girin');
  }
  if (!specialty || !SPECIALTY_VALUES.includes(specialty)) {
    errors.push('Geçerli bir uzmanlık değeri girin');
  }
  if (!position || !POSITION_VALUES.includes(position)) {
    errors.push('Geçerli bir pozisyon değeri girin');
  }

  let notes = null;
  if (body.notes !== undefined && body.notes !== null && body.notes !== '') {
    if (typeof body.notes !== 'string') {
      errors.push('Notlar geçersiz');
    } else if (body.notes.length > NOTES_MAX) {
      errors.push(`Notlar en fazla ${NOTES_MAX} karakter olabilir`);
    } else {
      notes = body.notes.trim();
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      first_name,
      last_name,
      email: email.toLowerCase(),
      phone,
      institution,
      event_id,
      specialty,
      position,
      notes,
    },
  };
}

// ── Handler ───────────────────────────────────────────────────
export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const body = parseBody(req);
  if (!body) {
    return jsonError(res, 400, 'INVALID_BODY', 'Geçersiz istek gövdesi.');
  }

  const validation = validatePayload(body);
  if (!validation.ok) {
    return res.status(400).json({
      error: `Form geçersiz: ${validation.errors.join('; ')}`,
      code: 'VALIDATION_ERROR',
      details: validation.errors,
    });
  }
  const data = validation.data;

  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    if (err instanceof ConfigError) {
      logServerError('config', err);
      return jsonError(
        res, 500, 'CONFIG_ERROR',
        'Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.',
      );
    }
    throw err;
  }

  // 1) Verify event exists and is active.
  const { data: event, error: eventErr } = await supabase
    .from('events')
    .select(
      'id, title_tr, event_date, location_tr, capacity, reserved_for_external, price_net_try, kdv_rate, price_gross_try, bank_details_tr, is_active',
    )
    .eq('id', data.event_id)
    .maybeSingle();

  if (eventErr) {
    logServerError('events.fetch', eventErr, { event_id: data.event_id });
    return jsonError(
      res, 500, 'EVENT_LOOKUP_FAILED',
      'Etkinlik bilgisi alınamadı. Lütfen daha sonra tekrar deneyin.',
    );
  }
  if (!event || !event.is_active) {
    return jsonError(
      res, 400, 'EVENT_NOT_ACTIVE',
      'Bu etkinlik için kayıt şu anda mümkün değil.',
    );
  }

  // 2) Capacity check (skip if capacity is null → unlimited).
  //    Active count = applied + paid (those occupy seats).
  if (event.capacity !== null && event.capacity !== undefined) {
    const reserved = Number(event.reserved_for_external) || 0;
    const effectiveCapacity = Number(event.capacity) - reserved;

    const { count, error: countErr } = await supabase
      .from('registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', event.id)
      .in('status', ['applied', 'paid']);

    if (countErr) {
      logServerError('registrations.count', countErr, { event_id: event.id });
      return jsonError(
        res, 500, 'CAPACITY_CHECK_FAILED',
        'Kontenjan bilgisi alınamadı. Lütfen daha sonra tekrar deneyin.',
      );
    }

    if ((count ?? 0) >= effectiveCapacity) {
      return jsonError(
        res, 409, 'CAPACITY_FULL',
        'Üzgünüz, bu kontenjan dolu. Lütfen kayit@sonoinjection.com ile iletişime geçin.',
      );
    }
  }

  // 3) Duplicate-registration check (same email + event_id; status applied|paid).
  const { data: existing, error: dupErr } = await supabase
    .from('registrations')
    .select('id')
    .eq('event_id', event.id)
    .eq('email', data.email)
    .in('status', ['applied', 'paid'])
    .limit(1);

  if (dupErr) {
    logServerError('registrations.duplicate_check', dupErr, { event_id: event.id });
    return jsonError(
      res, 500, 'DUPLICATE_CHECK_FAILED',
      'Kayıt kontrolü yapılamadı. Lütfen daha sonra tekrar deneyin.',
    );
  }
  if (existing && existing.length > 0) {
    return jsonError(
      res, 409, 'DUPLICATE_REGISTRATION',
      'Bu e-posta adresi ile bu etkinliğe zaten kayıt yapılmış. Sorularınız için kayit@sonoinjection.com.',
    );
  }

  // 4) Insert the row. status = 'applied' (was 'pending' under the
  //    old enum; CLAUDE.md §8 documents the new enum).
  const insertPayload = {
    event_id: event.id,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    specialty: data.specialty,
    position: data.position,
    institution: data.institution,
    notes: data.notes,
    status: 'applied',
  };

  const { data: inserted, error: insertErr } = await supabase
    .from('registrations')
    .insert(insertPayload)
    .select('id, registered_at')
    .single();

  if (insertErr) {
    logServerError('registrations.insert', insertErr, {
      event_id: event.id,
      email: data.email,
    });
    return jsonError(
      res, 500, 'INSERT_FAILED',
      'Kayıt oluşturulamadı. Lütfen daha sonra tekrar deneyin.',
    );
  }

  // 5) Best-effort email dispatch + email_sent log entries.
  const registeredAt = inserted.registered_at
    ? new Date(inserted.registered_at)
    : new Date();

  const email1 = renderEmail1Registration({ data, event });
  const email2 = renderEmail2AdminNotification({ data, event, registeredAt });

  const email1Result = await sendEmail({
    to: data.email,
    replyTo: ADMIN_REPLY_TO,
    subject: email1.subject,
    text: email1.text,
    context: 'email.registrant.email1',
  });
  if (email1Result.sent) {
    await writeEmailSentLog(supabase, {
      registration_id: inserted.id,
      email_type: 'email_1_registration',
      to_address: data.email,
      message: 'Rezervasyon e-postası gönderildi',
    });
  }

  const email2Result = await sendEmail({
    to: ADMIN_REPLY_TO,
    // Replying to the admin notification should land in the registrant's inbox.
    replyTo: data.email,
    subject: email2.subject,
    text: email2.text,
    context: 'email.admin.email2',
  });
  if (email2Result.sent) {
    await writeEmailSentLog(supabase, {
      registration_id: inserted.id,
      email_type: 'email_2_admin_notification',
      to_address: ADMIN_REPLY_TO,
      message: 'Yönetici bildirim e-postası gönderildi',
    });
  }

  logEvent('info', 'registration.created', {
    registration_id: inserted.id,
    event_id: event.id,
    specialty: data.specialty,
    position: data.position,
  });

  return res.status(200).json({
    success: true,
    registration_id: inserted.id,
  });
}
