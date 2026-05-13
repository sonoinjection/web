/* ============================================================
   GET /api/admin/list-registrations?event_id=<uuid>
   Returns registrations for the event, plus the most recent
   registration_log entry for each row (or null if none).
   ============================================================ */

import {
  getSupabase,
  jsonError,
  requireMethod,
  requireAdmin,
  trimmedString,
  logServerError,
  ConfigError,
} from '../_shared.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'GET')) return;
  const adminEmail = await requireAdmin(req, res);
  if (!adminEmail) return;

  const event_id = trimmedString(req.query?.event_id);
  if (!event_id) {
    return jsonError(res, 400, 'MISSING_EVENT_ID', 'event_id parametresi zorunludur.');
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

  const { data: registrations, error: regErr } = await supabase
    .from('registrations')
    .select(
      'id, event_id, first_name, last_name, email, phone, specialty, position, institution, notes, status, registered_at, confirmed_at, confirmed_by, cancelled_at, cancellation_reason, payment_reference, reminder_sent_at',
    )
    .eq('event_id', event_id)
    .order('registered_at', { ascending: false });

  if (regErr) {
    logServerError('registrations.list', regErr, { event_id });
    return jsonError(res, 500, 'REGISTRATIONS_LIST_FAILED', 'Başvurular alınamadı.');
  }

  const ids = (registrations || []).map((r) => r.id);
  let logsByRegistration = new Map();

  if (ids.length > 0) {
    const { data: logs, error: logErr } = await supabase
      .from('registration_log')
      .select('id, registration_id, entry_type, message, metadata, created_by, created_at')
      .in('registration_id', ids)
      .order('created_at', { ascending: false });

    if (logErr) {
      logServerError('registration_log.list', logErr, { event_id });
      // Soft fail: still return registrations without log info.
    } else {
      // First-seen wins because we ordered desc → that's the most recent.
      for (const entry of logs || []) {
        if (!logsByRegistration.has(entry.registration_id)) {
          logsByRegistration.set(entry.registration_id, entry);
        }
      }
    }
  }

  const enriched = (registrations || []).map((r) => ({
    ...r,
    latest_log: logsByRegistration.get(r.id) || null,
  }));

  return res.status(200).json({ registrations: enriched });
}
