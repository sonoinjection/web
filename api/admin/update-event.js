/* ============================================================
   POST /api/admin/update-event
   Body: { event_id, fields: { ...whitelisted... } }
   Whitelisted fields:
     title_tr, description_tr, event_date, location_tr,
     capacity, reserved_for_external, price_net_try, kdv_rate,
     bank_details_tr, is_active.
   price_gross_try is computed by Postgres; never accepted as input.
   ============================================================ */

import {
  getSupabase,
  jsonError,
  parseBody,
  requireMethod,
  trimmedString,
  logServerError,
  logEvent,
  ConfigError,
} from '../_shared.js';

// TODO Session 3: gate by Google OAuth + ADMIN_ALLOWLIST.

const ALLOWED_FIELDS = [
  'title_tr',
  'description_tr',
  'event_date',
  'location_tr',
  'capacity',
  'reserved_for_external',
  'price_net_try',
  'kdv_rate',
  'bank_details_tr',
  'is_active',
];

const TEXT_REQUIRED  = new Set(['title_tr', 'location_tr']);
const TEXT_OPTIONAL  = new Set(['description_tr', 'bank_details_tr']);
const INT_NULLABLE   = new Set(['capacity']);
const INT_REQUIRED   = new Set(['reserved_for_external']);
const NUM_NULLABLE   = new Set(['price_net_try']);
const NUM_REQUIRED   = new Set(['kdv_rate']);
const DATE_REQUIRED  = new Set(['event_date']);
const BOOL_REQUIRED  = new Set(['is_active']);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  const body = parseBody(req);
  if (!body) return jsonError(res, 400, 'INVALID_BODY', 'Geçersiz istek gövdesi.');

  const event_id = trimmedString(body.event_id);
  if (!event_id) {
    return jsonError(res, 400, 'MISSING_FIELDS', 'event_id zorunludur.');
  }
  if (!body.fields || typeof body.fields !== 'object') {
    return jsonError(res, 400, 'MISSING_FIELDS', 'fields nesnesi zorunludur.');
  }

  const errors = [];
  const proposed = {};

  for (const [key, raw] of Object.entries(body.fields)) {
    if (!ALLOWED_FIELDS.includes(key)) {
      errors.push(`${key} alanı güncellenemez`);
      continue;
    }
    if (TEXT_REQUIRED.has(key)) {
      const v = trimmedString(raw);
      if (!v) errors.push(`${key} boş olamaz`);
      else proposed[key] = v;
    } else if (TEXT_OPTIONAL.has(key)) {
      if (raw === null || raw === undefined || raw === '') {
        proposed[key] = null;
      } else if (typeof raw !== 'string') {
        errors.push(`${key} geçersiz`);
      } else {
        proposed[key] = raw.trim();
      }
    } else if (INT_NULLABLE.has(key)) {
      if (raw === null || raw === undefined || raw === '') {
        proposed[key] = null;
      } else {
        const n = Number(raw);
        if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) {
          errors.push(`${key} geçersiz`);
        } else {
          proposed[key] = n;
        }
      }
    } else if (INT_REQUIRED.has(key)) {
      const n = Number(raw);
      if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) {
        errors.push(`${key} geçersiz`);
      } else {
        proposed[key] = n;
      }
    } else if (NUM_NULLABLE.has(key)) {
      if (raw === null || raw === undefined || raw === '') {
        proposed[key] = null;
      } else {
        const n = Number(raw);
        if (!Number.isFinite(n) || n < 0) errors.push(`${key} geçersiz`);
        else proposed[key] = n;
      }
    } else if (NUM_REQUIRED.has(key)) {
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0) errors.push(`${key} geçersiz`);
      else proposed[key] = n;
    } else if (DATE_REQUIRED.has(key)) {
      const v = trimmedString(raw);
      if (!DATE_RE.test(v)) {
        errors.push(`${key} formatı YYYY-MM-DD olmalıdır`);
      } else {
        proposed[key] = v;
      }
    } else if (BOOL_REQUIRED.has(key)) {
      proposed[key] = !!raw;
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: `Form geçersiz: ${errors.join('; ')}`,
      code: 'VALIDATION_ERROR',
      details: errors,
    });
  }

  if (Object.keys(proposed).length === 0) {
    return jsonError(res, 400, 'NO_FIELDS', 'Güncellenecek alan yok.');
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

  const { data: updated, error: updateErr } = await supabase
    .from('events')
    .update(proposed)
    .eq('id', event_id)
    .select(
      'id, title_tr, description_tr, event_date, location_tr, capacity, reserved_for_external, price_net_try, kdv_rate, price_gross_try, bank_details_tr, is_active, created_at',
    )
    .single();

  if (updateErr) {
    logServerError('events.update', updateErr, { event_id, fields: Object.keys(proposed) });
    return jsonError(res, 500, 'EVENT_UPDATE_FAILED', 'Etkinlik güncellenemedi.');
  }
  if (!updated) {
    return jsonError(res, 404, 'EVENT_NOT_FOUND', 'Etkinlik bulunamadı.');
  }

  logEvent('info', 'event.updated', {
    event_id,
    fields: Object.keys(proposed),
  });

  return res.status(200).json({ event: updated });
}
