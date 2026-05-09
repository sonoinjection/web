/* ============================================================
   api/register.js — Vercel serverless function
   Receives a public registration, validates, inserts a pending row
   into Supabase, and dispatches Email 1 (registrant) and Email 2
   (admin) via Resend. See CLAUDE.md §5–§8 for the contract.
   ============================================================ */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// ── Config ────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const FROM_EMAIL = 'SonoInjection <kayit@sonoinjection.com>';
const ADMIN_EMAIL = 'kayit@sonoinjection.com';
const ADMIN_PANEL_URL = 'https://sonoinjection.com/deneme-kayit/admin/';

// ── Enum-to-label maps (Turkish display) ──────────────────────
const SPECIALTY_LABELS = {
  ftr: 'Fiziksel Tıp ve Rehabilitasyon',
  ortopedi: 'Ortopedi ve Travmatoloji',
  romatoloji: 'Romatoloji',
  spor_hekimligi: 'Spor Hekimliği',
  algoloji: 'Algoloji',
  diger: 'Diğer',
};

const POSITION_LABELS = {
  uzman: 'Uzman',
  asistan: 'Asistan',
};

const SPECIALTY_VALUES = Object.keys(SPECIALTY_LABELS);
const POSITION_VALUES = Object.keys(POSITION_LABELS);

// ── Validation ────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTES_MAX = 1000;

function trimmedString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

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

// ── Formatters ────────────────────────────────────────────────
const TR_NUMBER = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatTRY(value) {
  if (value === null || value === undefined) return null;
  return `${TR_NUMBER.format(Number(value))} TL`;
}

function formatEventDateTr(dateValue) {
  if (!dateValue) return '';
  // Postgres `date` columns return as 'YYYY-MM-DD'. Anchor at noon UTC
  // so the date doesn't drift when rendered in Europe/Istanbul.
  const datePart = String(dateValue).slice(0, 10);
  const [y, m, d] = datePart.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Istanbul',
  }).format(date);
}

function formatRegisteredAtCet(d) {
  const datetime = new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Berlin',
  }).format(d);

  // Resolve CET vs CEST from the long timezone name (DST-aware).
  const longName = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    timeZoneName: 'long',
  }).formatToParts(d).find((p) => p.type === 'timeZoneName').value;
  const tz = longName.includes('Summer') ? 'CEST' : 'CET';
  return `${datetime} (${tz})`;
}

// ── Structured logging ────────────────────────────────────────
function logEvent(level, context, extra = {}) {
  const payload = {
    level,
    timestamp: new Date().toISOString(),
    context,
    ...extra,
  };
  // Vercel collects stdout/stderr from serverless functions. Emitting
  // a single JSON line per event keeps logs grep-able and structured.
  const line = JSON.stringify(payload);
  if (level === 'error') console.error(line); else console.log(line);
}

function logError(context, err, extra = {}) {
  logEvent('error', context, {
    error_message: err?.message || String(err),
    error_code: err?.code,
    ...extra,
  });
}

// ── Email templates ───────────────────────────────────────────
function renderRegistrantEmail({ data, event }) {
  const fullName = `${data.first_name} ${data.last_name}`;
  const subject = 'SonoInjection Rezervasyonunuz Alındı';

  const lines = [];
  lines.push(`Sayın ${fullName},`);
  lines.push('');
  lines.push(`${event.title_tr} etkinliği için rezervasyonunuz alındı.`);
  lines.push('');
  lines.push(`Tarih: ${formatEventDateTr(event.event_date)}`);
  lines.push(`Yer: ${event.location_tr}`);
  lines.push('');

  const hasNetPrice =
    event.price_net_try !== null && event.price_net_try !== undefined;

  if (hasNetPrice) {
    const net = formatTRY(event.price_net_try);
    const gross = formatTRY(event.price_gross_try);
    const kdvAmount = formatTRY(
      Number(event.price_gross_try) - Number(event.price_net_try),
    );
    const kdvRateInt = Math.round(Number(event.kdv_rate));

    lines.push(`Kurs Ücreti (KDV Hariç): ${net}`);
    lines.push(`KDV (%${kdvRateInt}): ${kdvAmount}`);
    lines.push(`Toplam (KDV Dahil): ${gross}`);
    lines.push('');

    if (event.bank_details_tr) {
      lines.push(
        `Rezervasyonunuzu kesinleştirmek için lütfen ${gross} tutarında havale gerçekleştirin:`,
      );
      lines.push('');
      lines.push(event.bank_details_tr);
      lines.push('');
      lines.push(`Açıklama: ${fullName} - SonoInjection`);
    } else {
      lines.push('Banka bilgileri en kısa sürede iletilecektir.');
    }
  } else {
    lines.push(
      'Kurs ücreti ve banka bilgileri en kısa sürede tarafınıza iletilecektir.',
    );
  }

  lines.push('');
  lines.push('Ödemenizi aldıktan sonra 24 saat içinde onay e-postası göndereceğiz.');
  lines.push('');
  lines.push('Sorularınız için: kayit@sonoinjection.com');
  lines.push('');
  lines.push('Saygılarımızla,');
  lines.push('SonoInjection Ekibi');

  return { subject, text: lines.join('\n') };
}

function renderAdminEmail({ data, event, registeredAt }) {
  const fullName = `${data.first_name} ${data.last_name}`;
  const subject = `[SonoInjection] Yeni Rezervasyon - ${fullName}`;

  const lines = [];
  lines.push('Yeni bir rezervasyon alındı:');
  lines.push('');
  lines.push(`Ad Soyad: ${fullName}`);
  lines.push(`E-posta: ${data.email}`);
  lines.push(`Telefon: ${data.phone}`);
  lines.push(`Uzmanlık: ${SPECIALTY_LABELS[data.specialty]}`);
  lines.push(`Pozisyon: ${POSITION_LABELS[data.position]}`);
  lines.push(`Kurum: ${data.institution}`);
  lines.push(`Notlar: ${data.notes || '—'}`);
  lines.push('');
  lines.push(`Etkinlik: ${event.title_tr}`);
  lines.push(`Rezervasyon tarihi: ${formatRegisteredAtCet(registeredAt)}`);
  lines.push('');
  lines.push(`Admin paneli: ${ADMIN_PANEL_URL}`);

  return { subject, text: lines.join('\n') };
}

// ── Response helpers ──────────────────────────────────────────
function jsonError(res, status, code, message) {
  return res.status(status).json({ error: message, code });
}

// ── Handler ───────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonError(res, 405, 'METHOD_NOT_ALLOWED', 'Yöntem desteklenmiyor.');
  }

  // Parse the body (Vercel auto-parses JSON; be defensive otherwise).
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== 'object') {
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

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    logError('config', new Error('Supabase environment variables missing'));
    return jsonError(
      res,
      500,
      'CONFIG_ERROR',
      'Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.',
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // 1) Verify event exists and is active.
  const { data: event, error: eventErr } = await supabase
    .from('events')
    .select(
      'id, title_tr, event_date, location_tr, capacity, reserved_for_external, price_net_try, kdv_rate, price_gross_try, bank_details_tr, is_active',
    )
    .eq('id', data.event_id)
    .maybeSingle();

  if (eventErr) {
    logError('events.fetch', eventErr, { event_id: data.event_id });
    return jsonError(
      res,
      500,
      'EVENT_LOOKUP_FAILED',
      'Etkinlik bilgisi alınamadı. Lütfen daha sonra tekrar deneyin.',
    );
  }
  if (!event || !event.is_active) {
    return jsonError(
      res,
      400,
      'EVENT_NOT_ACTIVE',
      'Bu etkinlik için kayıt şu anda mümkün değil.',
    );
  }

  // 2) Capacity check (skip if capacity is null → unlimited).
  if (event.capacity !== null && event.capacity !== undefined) {
    const reserved = Number(event.reserved_for_external) || 0;
    const effectiveCapacity = Number(event.capacity) - reserved;

    const { count, error: countErr } = await supabase
      .from('registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', event.id)
      .in('status', ['pending', 'confirmed']);

    if (countErr) {
      logError('registrations.count', countErr, { event_id: event.id });
      return jsonError(
        res,
        500,
        'CAPACITY_CHECK_FAILED',
        'Kontenjan bilgisi alınamadı. Lütfen daha sonra tekrar deneyin.',
      );
    }

    if ((count ?? 0) >= effectiveCapacity) {
      return jsonError(
        res,
        409,
        'CAPACITY_FULL',
        'Üzgünüz, bu kontenjan dolu. Lütfen kayit@sonoinjection.com ile iletişime geçin.',
      );
    }
  }

  // 3) Duplicate-registration check (same email + event_id, status pending|confirmed).
  const { data: existing, error: dupErr } = await supabase
    .from('registrations')
    .select('id')
    .eq('event_id', event.id)
    .eq('email', data.email)
    .in('status', ['pending', 'confirmed'])
    .limit(1);

  if (dupErr) {
    logError('registrations.duplicate_check', dupErr, { event_id: event.id });
    return jsonError(
      res,
      500,
      'DUPLICATE_CHECK_FAILED',
      'Kayıt kontrolü yapılamadı. Lütfen daha sonra tekrar deneyin.',
    );
  }
  if (existing && existing.length > 0) {
    return jsonError(
      res,
      409,
      'DUPLICATE_REGISTRATION',
      'Bu e-posta adresi ile bu etkinliğe zaten kayıt yapılmış. Sorularınız için kayit@sonoinjection.com.',
    );
  }

  // 4) Insert the row. expires_at is legacy and may be null per CLAUDE.md §6.
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
    status: 'pending',
  };

  const { data: inserted, error: insertErr } = await supabase
    .from('registrations')
    .insert(insertPayload)
    .select('id, registered_at')
    .single();

  if (insertErr) {
    logError('registrations.insert', insertErr, {
      event_id: event.id,
      email: data.email,
    });
    return jsonError(
      res,
      500,
      'INSERT_FAILED',
      'Kayıt oluşturulamadı. Lütfen daha sonra tekrar deneyin.',
    );
  }

  // 5) Best-effort email dispatch. DB row already exists; failures are
  //    logged but don't fail the request.
  if (RESEND_API_KEY) {
    const resend = new Resend(RESEND_API_KEY);
    const registeredAt = inserted.registered_at
      ? new Date(inserted.registered_at)
      : new Date();

    const registrant = renderRegistrantEmail({ data, event });
    const admin = renderAdminEmail({ data, event, registeredAt });

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.email,
        replyTo: ADMIN_EMAIL,
        subject: registrant.subject,
        text: registrant.text,
      });
    } catch (err) {
      logError('email.registrant', err, {
        registration_id: inserted.id,
        event_id: event.id,
      });
    }

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        // For the admin notification, replying should land at the
        // registrant's inbox so a human can answer them directly.
        replyTo: data.email,
        subject: admin.subject,
        text: admin.text,
      });
    } catch (err) {
      logError('email.admin', err, {
        registration_id: inserted.id,
        event_id: event.id,
      });
    }
  } else {
    logError(
      'config',
      new Error('RESEND_API_KEY missing — emails not sent'),
      { registration_id: inserted.id },
    );
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
