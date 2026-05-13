/* ============================================================
   POST /api/admin/update-registration
   Body: { registration_id, fields: { first_name?, last_name?,
           email?, phone?, specialty?, position?, institution?, notes? } }
   Diff-based: only writes columns whose values changed. Each
   changed field becomes a registration_log admin_note entry.
   ============================================================ */

import {
  getSupabase,
  jsonError,
  parseBody,
  requireMethod,
  requireAdmin,
  trimmedString,
  logServerError,
  logEvent,
  ConfigError,
} from '../_shared.js';
import { writeFieldChangeLog } from '../_log.js';

const ALLOWED_FIELDS = [
  'first_name', 'last_name', 'email', 'phone',
  'specialty', 'position', 'institution', 'notes',
];

const SPECIALTY_VALUES = [
  'ftr', 'ortopedi', 'romatoloji', 'spor_hekimligi', 'algoloji', 'diger',
];
const POSITION_VALUES = ['uzman', 'asistan'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTES_MAX = 1000;

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;
  const adminEmail = await requireAdmin(req, res);
  if (!adminEmail) return;

  const body = parseBody(req);
  if (!body) return jsonError(res, 400, 'INVALID_BODY', 'Geçersiz istek gövdesi.');

  const registration_id = trimmedString(body.registration_id);
  if (!registration_id) {
    return jsonError(res, 400, 'MISSING_FIELDS', 'registration_id zorunludur.');
  }
  if (!body.fields || typeof body.fields !== 'object') {
    return jsonError(res, 400, 'MISSING_FIELDS', 'fields nesnesi zorunludur.');
  }

  // Whitelist + per-field validation.
  const errors = [];
  const proposed = {};
  for (const [key, raw] of Object.entries(body.fields)) {
    if (!ALLOWED_FIELDS.includes(key)) {
      errors.push(`${key} alanı güncellenemez`);
      continue;
    }
    if (key === 'notes') {
      if (raw === null || raw === undefined || raw === '') {
        proposed.notes = null;
      } else if (typeof raw !== 'string') {
        errors.push('Notlar geçersiz');
      } else if (raw.length > NOTES_MAX) {
        errors.push(`Notlar en fazla ${NOTES_MAX} karakter olabilir`);
      } else {
        proposed.notes = raw.trim();
      }
      continue;
    }
    const v = trimmedString(raw);
    if (!v) {
      errors.push(`${key} boş olamaz`);
      continue;
    }
    if (key === 'email') {
      if (!EMAIL_RE.test(v)) errors.push('Geçerli bir e-posta adresi girin');
      else proposed.email = v.toLowerCase();
    } else if (key === 'specialty') {
      if (!SPECIALTY_VALUES.includes(v)) errors.push('Geçerli bir uzmanlık değeri girin');
      else proposed.specialty = v;
    } else if (key === 'position') {
      if (!POSITION_VALUES.includes(v)) errors.push('Geçerli bir pozisyon değeri girin');
      else proposed.position = v;
    } else {
      proposed[key] = v;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: `Form geçersiz: ${errors.join('; ')}`,
      code: 'VALIDATION_ERROR',
      details: errors,
    });
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

  // Fetch current row to compute diff.
  const { data: current, error: regErr } = await supabase
    .from('registrations')
    .select('id, first_name, last_name, email, phone, specialty, position, institution, notes')
    .eq('id', registration_id)
    .maybeSingle();

  if (regErr) {
    logServerError('registrations.get', regErr, { registration_id });
    return jsonError(res, 500, 'REGISTRATION_FETCH_FAILED', 'Kayıt alınamadı.');
  }
  if (!current) {
    return jsonError(res, 404, 'REGISTRATION_NOT_FOUND', 'Kayıt bulunamadı.');
  }

  // Build the actual diff: only fields that changed.
  const diff = {};
  for (const [key, value] of Object.entries(proposed)) {
    if ((current[key] ?? null) !== (value ?? null)) {
      diff[key] = value;
    }
  }

  if (Object.keys(diff).length === 0) {
    // Nothing to do; return the row unchanged.
    return res.status(200).json({ registration: current, log_entries: [], unchanged: true });
  }

  const { data: updated, error: updateErr } = await supabase
    .from('registrations')
    .update(diff)
    .eq('id', registration_id)
    .select(
      'id, event_id, first_name, last_name, email, phone, specialty, position, institution, notes, status, registered_at, confirmed_at, confirmed_by, cancelled_at, cancellation_reason, payment_reference, reminder_sent_at',
    )
    .single();

  if (updateErr) {
    logServerError('registrations.update_fields', updateErr, { registration_id, fields: Object.keys(diff) });
    return jsonError(res, 500, 'UPDATE_FAILED', 'Kayıt güncellenemedi.');
  }

  // One log entry per changed field.
  const logEntries = [];
  for (const [field, newValue] of Object.entries(diff)) {
    const { entry } = await writeFieldChangeLog(supabase, {
      registration_id,
      field,
      old_value: current[field] ?? null,
      new_value: newValue ?? null,
      created_by: adminEmail,
    });
    if (entry) logEntries.unshift(entry); // newest first
  }

  logEvent('info', 'registration.fields_updated', {
    registration_id,
    fields: Object.keys(diff),
  });

  return res.status(200).json({
    registration: updated,
    log_entries: logEntries,
  });
}
