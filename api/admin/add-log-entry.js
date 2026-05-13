/* ============================================================
   POST /api/admin/add-log-entry
   Body: { registration_id, entry_type, message, metadata? }
   Used for manual admin_note and contact entries from the
   detail-modal Geçmiş timeline. Other entry_types are rejected.
   ============================================================ */

import {
  getSupabase,
  jsonError,
  parseBody,
  requireMethod,
  requireAdmin,
  trimmedString,
  logServerError,
  ConfigError,
} from '../_shared.js';
import { writeAdminNoteLog, writeContactLog } from '../_log.js';

const ALLOWED_ENTRY_TYPES = new Set(['admin_note', 'contact']);
const ALLOWED_CONTACT_METHODS = new Set(['phone', 'email', 'in_person']);
const MESSAGE_MAX = 4000;

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;
  const adminEmail = await requireAdmin(req, res);
  if (!adminEmail) return;

  const body = parseBody(req);
  if (!body) return jsonError(res, 400, 'INVALID_BODY', 'Geçersiz istek gövdesi.');

  const registration_id = trimmedString(body.registration_id);
  const entry_type      = trimmedString(body.entry_type);
  const message         = trimmedString(body.message);

  if (!registration_id || !entry_type || !message) {
    return jsonError(
      res, 400, 'MISSING_FIELDS',
      'registration_id, entry_type ve message zorunludur.',
    );
  }
  if (!ALLOWED_ENTRY_TYPES.has(entry_type)) {
    return jsonError(
      res, 400, 'INVALID_ENTRY_TYPE',
      'Bu uçtan yalnızca admin_note ve contact eklenebilir.',
    );
  }
  if (message.length > MESSAGE_MAX) {
    return jsonError(
      res, 400, 'MESSAGE_TOO_LONG',
      `Mesaj en fazla ${MESSAGE_MAX} karakter olabilir.`,
    );
  }

  let metadata = null;
  let contact_method = null;
  if (entry_type === 'contact') {
    const meta = body.metadata && typeof body.metadata === 'object' ? body.metadata : {};
    contact_method = trimmedString(meta.contact_method);
    if (!ALLOWED_CONTACT_METHODS.has(contact_method)) {
      return jsonError(
        res, 400, 'INVALID_CONTACT_METHOD',
        'Geçerli iletişim yöntemleri: phone, email, in_person.',
      );
    }
    metadata = { contact_method };
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

  // Confirm the registration exists (so we don't create orphan logs).
  const { data: reg, error: regErr } = await supabase
    .from('registrations')
    .select('id')
    .eq('id', registration_id)
    .maybeSingle();
  if (regErr) {
    logServerError('registrations.get', regErr, { registration_id });
    return jsonError(res, 500, 'REGISTRATION_FETCH_FAILED', 'Kayıt alınamadı.');
  }
  if (!reg) {
    return jsonError(res, 404, 'REGISTRATION_NOT_FOUND', 'Kayıt bulunamadı.');
  }

  let result;
  if (entry_type === 'admin_note') {
    result = await writeAdminNoteLog(supabase, {
      registration_id,
      message,
      created_by: adminEmail,
    });
  } else {
    result = await writeContactLog(supabase, {
      registration_id,
      contact_method,
      message,
      created_by: adminEmail,
    });
  }

  if (result.error) {
    return jsonError(res, 500, 'LOG_INSERT_FAILED', 'Kayıt eklenemedi.');
  }

  return res.status(200).json({ entry: result.entry });
}
