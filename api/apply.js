/* ============================================================
   api/apply.js — POST /api/apply — email-only application endpoint

   The alternative to api/register.js. No database: one email to the
   applicant AND kayit@ is the whole record, so the entire exchange
   stays in one thread.

   Because the email IS the record, sending is NOT best-effort here —
   api/register.js can shrug off a failed send because the row is
   already committed, but a failure on this path means the application
   would vanish silently. So a send failure returns 502 and the form
   tells the applicant to write to kayit@ directly.

   Trade-offs vs the Supabase pipeline: no capacity enforcement, no
   duplicate-email detection, no admin board, no audit log.

   Stable error codes: VALIDATION_ERROR, EVENT_NOT_ACTIVE, SEND_FAILED,
   INVALID_BODY, METHOD_NOT_ALLOWED.
   ============================================================ */

import {
  jsonError,
  parseBody,
  requireMethod,
  logEvent,
  logServerError,
  ADMIN_REPLY_TO,
} from './_shared.js';
import { validatePayload } from './_validate.js';
import { getEvent } from './_events.js';
import { renderApplicationEmail, sendEmail } from './_emails.js';

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

  const event = getEvent(data.event_id);
  if (!event || !event.is_active) {
    return jsonError(
      res, 400, 'EVENT_NOT_ACTIVE',
      'Bu etkinlik için başvuru şu anda mümkün değil.',
    );
  }

  const submittedAt = new Date();
  const email = renderApplicationEmail({ data, event, submittedAt });

  // Both recipients in a single send: either the thread exists for
  // everyone or it exists for no one, and the applicant is told.
  const result = await sendEmail({
    to: [data.email, ADMIN_REPLY_TO],
    replyTo: ADMIN_REPLY_TO,
    subject: email.subject,
    text: email.text,
    context: 'email.application',
  });

  if (!result.sent) {
    logServerError('apply.send_failed', new Error(result.reason || 'send failed'), {
      event_id: data.event_id,
      to: data.email,
    });
    return jsonError(
      res, 502, 'SEND_FAILED',
      `Başvurunuz gönderilemedi. Lütfen ${ADMIN_REPLY_TO} adresine doğrudan e-posta gönderin.`,
    );
  }

  logEvent('info', 'application.sent', {
    event_id: data.event_id,
    position: data.position,
  });

  return res.status(200).json({ ok: true });
}
