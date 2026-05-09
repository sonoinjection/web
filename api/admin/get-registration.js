/* ============================================================
   GET /api/admin/get-registration?id=<uuid>
   Returns the registration row + full log timeline (desc).
   ============================================================ */

import {
  getSupabase,
  jsonError,
  requireMethod,
  trimmedString,
  logServerError,
  ConfigError,
} from '../_shared.js';

// TODO Session 3: gate by Google OAuth + ADMIN_ALLOWLIST.

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'GET')) return;

  const id = trimmedString(req.query?.id);
  if (!id) {
    return jsonError(res, 400, 'MISSING_ID', 'id parametresi zorunludur.');
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

  const { data: registration, error: regErr } = await supabase
    .from('registrations')
    .select(
      'id, event_id, first_name, last_name, email, phone, specialty, position, institution, notes, status, registered_at, confirmed_at, confirmed_by, cancelled_at, cancellation_reason, payment_reference, reminder_sent_at',
    )
    .eq('id', id)
    .maybeSingle();

  if (regErr) {
    logServerError('registrations.get', regErr, { registration_id: id });
    return jsonError(res, 500, 'REGISTRATION_FETCH_FAILED', 'Kayıt alınamadı.');
  }
  if (!registration) {
    return jsonError(res, 404, 'REGISTRATION_NOT_FOUND', 'Kayıt bulunamadı.');
  }

  const { data: log, error: logErr } = await supabase
    .from('registration_log')
    .select('id, registration_id, entry_type, message, metadata, created_by, created_at')
    .eq('registration_id', id)
    .order('created_at', { ascending: false });

  if (logErr) {
    logServerError('registration_log.list', logErr, { registration_id: id });
    return jsonError(res, 500, 'LOG_FETCH_FAILED', 'Geçmiş alınamadı.');
  }

  return res.status(200).json({
    registration,
    log: log || [],
  });
}
