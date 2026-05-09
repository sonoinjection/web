/* ============================================================
   POST /api/admin/update-status
   Body: {
     registration_id, new_status,
     reason?, payment_reference?, refund_amount?,
     informed_confirmed?, refund_completed_confirmed?,
     send_email?
   }
   Validates the transition, updates the row, writes a status_change
   log, and dispatches Email 3 / 5 / 6 if applicable.
   ============================================================ */

import {
  getSupabase,
  jsonError,
  parseBody,
  requireMethod,
  logServerError,
  logEvent,
  ADMIN_REPLY_TO,
  MOCK_ADMIN_EMAIL,
  ConfigError,
} from '../_shared.js';
import {
  validateTransition,
  transitionEmailType,
  statusChangeMessageTr,
} from './_transitions.js';
import {
  renderEmail3PaymentConfirmation,
  renderEmail5Cancellation,
  renderEmail6Refund,
  sendEmail,
} from '../_emails.js';
import {
  writeStatusChangeLog,
  writeEmailSentLog,
} from '../_log.js';

// TODO Session 3: derive the admin email from Google OAuth, gate
// by ADMIN_ALLOWLIST, and pass it into writeStatusChangeLog as
// `created_by` instead of MOCK_ADMIN_EMAIL.

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const body = parseBody(req);
  if (!body) {
    return jsonError(res, 400, 'INVALID_BODY', 'Geçersiz istek gövdesi.');
  }

  const registration_id = String(body.registration_id || '').trim();
  const new_status = String(body.new_status || '').trim();
  if (!registration_id || !new_status) {
    return jsonError(
      res, 400, 'MISSING_FIELDS',
      'registration_id ve new_status zorunludur.',
    );
  }

  const reason = body.reason ? String(body.reason).trim() : null;
  const payment_reference = body.payment_reference ? String(body.payment_reference).trim() : null;
  const refund_amount =
    body.refund_amount !== undefined && body.refund_amount !== null && body.refund_amount !== ''
      ? Number(body.refund_amount)
      : null;
  const informed_confirmed = !!body.informed_confirmed;
  const refund_completed_confirmed = !!body.refund_completed_confirmed;
  const send_email = !!body.send_email;

  if (refund_amount !== null && Number.isNaN(refund_amount)) {
    return jsonError(res, 400, 'INVALID_REFUND_AMOUNT', 'İade tutarı geçersiz.');
  }

  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    if (err instanceof ConfigError) {
      logServerError('config', err);
      return jsonError(res, 500, 'CONFIG_ERROR', 'Sunucu yapılandırma hatası.');
    }
    throw err;
  }

  // Fetch current row + event for emails.
  const { data: registration, error: regErr } = await supabase
    .from('registrations')
    .select('id, event_id, first_name, last_name, email, status')
    .eq('id', registration_id)
    .maybeSingle();

  if (regErr) {
    logServerError('registrations.get', regErr, { registration_id });
    return jsonError(res, 500, 'REGISTRATION_FETCH_FAILED', 'Kayıt alınamadı.');
  }
  if (!registration) {
    return jsonError(res, 404, 'REGISTRATION_NOT_FOUND', 'Kayıt bulunamadı.');
  }

  const validation = validateTransition(registration.status, new_status);
  if (!validation.ok) {
    return jsonError(res, 409, 'INVALID_TRANSITION', validation.reason);
  }

  // Build the status update + side-effect timestamps.
  const update = { status: new_status };
  const now = new Date().toISOString();

  if (registration.status === 'applied' && new_status === 'paid') {
    update.confirmed_at = now;
    update.confirmed_by = MOCK_ADMIN_EMAIL;
    if (payment_reference) update.payment_reference = payment_reference;
  } else if (new_status === 'cancelled') {
    update.cancelled_at = now;
    update.cancellation_reason = reason || 'Yönetici tarafından iptal edildi.';
  } else if (registration.status === 'paid' && new_status === 'refunded') {
    // Refund-specific fields are recorded only in the log metadata.
  } else if (registration.status === 'cancelled' && new_status === 'applied') {
    // Reactivation: clear cancel/confirm trail; keep payment_reference if any.
    update.cancelled_at = null;
    update.cancellation_reason = null;
    update.confirmed_at = null;
    update.confirmed_by = null;
  } else if (registration.status === 'refunded' && new_status === 'paid') {
    // Restoring to paid: re-stamp confirmation.
    update.confirmed_at = now;
    update.confirmed_by = MOCK_ADMIN_EMAIL;
  }

  const { data: updated, error: updateErr } = await supabase
    .from('registrations')
    .update(update)
    .eq('id', registration_id)
    .select(
      'id, event_id, first_name, last_name, email, phone, specialty, position, institution, notes, status, registered_at, confirmed_at, confirmed_by, cancelled_at, cancellation_reason, payment_reference, reminder_sent_at',
    )
    .single();

  if (updateErr) {
    logServerError('registrations.update_status', updateErr, {
      registration_id, new_status,
    });
    return jsonError(res, 500, 'STATUS_UPDATE_FAILED', 'Durum güncellenemedi.');
  }

  // Decide whether an email fires for this transition.
  const emailType = transitionEmailType(registration.status, new_status);
  const shouldSendEmail =
    emailType === 'email_3' ||                                  // always
    (emailType === 'email_5' && send_email) ||                  // opt-in
    (emailType === 'email_6' && send_email);                    // opt-in

  // Fetch event details only if we need to send an email.
  let eventRow = null;
  if (shouldSendEmail) {
    const { data: ev, error: evErr } = await supabase
      .from('events')
      .select('id, title_tr, event_date, location_tr')
      .eq('id', updated.event_id)
      .maybeSingle();
    if (evErr) {
      logServerError('events.fetch_for_email', evErr, { event_id: updated.event_id });
    } else {
      eventRow = ev;
    }
  }

  let emailDispatch = { sent: false, reason: null, type: emailType };

  if (shouldSendEmail && eventRow) {
    let template = null;
    if (emailType === 'email_3') {
      template = renderEmail3PaymentConfirmation({ registration: updated, event: eventRow });
    } else if (emailType === 'email_5') {
      template = renderEmail5Cancellation({ registration: updated, event: eventRow, reason });
    } else if (emailType === 'email_6') {
      template = renderEmail6Refund({
        registration: updated, event: eventRow,
        refundAmount: refund_amount, notes: reason,
      });
    }
    if (template) {
      const result = await sendEmail({
        to: updated.email,
        replyTo: ADMIN_REPLY_TO,
        subject: template.subject,
        text: template.text,
        context: `email.${emailType}`,
      });
      emailDispatch = { sent: !!result.sent, reason: result.reason || null, type: emailType };
    }
  }

  // Write status_change log entry.
  const message = statusChangeMessageTr(registration.status, new_status);
  const { entry: statusEntry } = await writeStatusChangeLog(supabase, {
    registration_id,
    old_status: registration.status,
    new_status,
    message,
    reason,
    payment_reference,
    refund_amount,
    informed_confirmed: emailType === 'email_5' || emailType === 'email_6'
      ? informed_confirmed
      : null,
    refund_completed_confirmed: emailType === 'email_6'
      ? refund_completed_confirmed
      : null,
    sent_email: emailDispatch.sent,
    created_by: MOCK_ADMIN_EMAIL,
  });

  // Write email_sent log entry if applicable.
  let emailEntry = null;
  if (emailDispatch.sent) {
    const { entry } = await writeEmailSentLog(supabase, {
      registration_id,
      email_type: emailType,
      to_address: updated.email,
      message: messageForEmailType(emailType),
    });
    emailEntry = entry;
  }

  logEvent('info', 'registration.status_changed', {
    registration_id,
    old_status: registration.status,
    new_status,
    email_sent: emailDispatch.sent,
  });

  const newLogEntries = [];
  if (emailEntry) newLogEntries.push(emailEntry);
  if (statusEntry) newLogEntries.push(statusEntry);

  return res.status(200).json({
    registration: updated,
    log_entries: newLogEntries,
    email: emailDispatch,
  });
}

function messageForEmailType(type) {
  switch (type) {
    case 'email_3': return 'Onay e-postası gönderildi';
    case 'email_5': return 'İptal e-postası gönderildi';
    case 'email_6': return 'İade e-postası gönderildi';
    default: return 'E-posta gönderildi';
  }
}
