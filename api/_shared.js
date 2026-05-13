/* ============================================================
   api/_shared.js — server-side helpers used by every route
   Underscore prefix keeps Vercel from treating this as a route.
   ============================================================ */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// ── Clients ───────────────────────────────────────────────────
let _supabase = null;
let _resend = null;

export function getSupabase() {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new ConfigError('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing');
  }
  _supabase = createClient(url, key, { auth: { persistSession: false } });
  return _supabase;
}

export function getResend() {
  if (_resend) return _resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Caller should treat this as a soft failure — DB writes still succeed.
    return null;
  }
  _resend = new Resend(apiKey);
  return _resend;
}

export class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
  }
}

// ── Response helpers ──────────────────────────────────────────
export function jsonError(res, status, code, message, extra = {}) {
  return res.status(status).json({ error: message, code, ...extra });
}

// ── Body parsing ──────────────────────────────────────────────
export function parseBody(req) {
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return null; }
  }
  return body && typeof body === 'object' ? body : null;
}

export function trimmedString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function requireFields(body, names) {
  const missing = [];
  for (const name of names) {
    const v = trimmedString(body[name]);
    if (!v) missing.push(name);
  }
  return missing;
}

// ── Formatters (server-side; mirrors kayit/scripts/shared.js) ──
const TR_NUMBER = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatTRY(value) {
  if (value === null || value === undefined) return null;
  return `${TR_NUMBER.format(Number(value))} TL`;
}

export function formatEventDateTr(dateValue) {
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

export function formatRegisteredAtCet(d) {
  const datetime = new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Berlin',
  }).format(d);
  const longName = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    timeZoneName: 'long',
  }).formatToParts(d).find((p) => p.type === 'timeZoneName').value;
  const tz = longName.includes('Summer') ? 'CEST' : 'CET';
  return `${datetime} (${tz})`;
}

// ── Structured logging ────────────────────────────────────────
export function logEvent(level, context, extra = {}) {
  const payload = {
    level,
    timestamp: new Date().toISOString(),
    context,
    ...extra,
  };
  const line = JSON.stringify(payload);
  if (level === 'error') console.error(line); else console.log(line);
}

export function logServerError(context, err, extra = {}) {
  logEvent('error', context, {
    error_message: err?.message || String(err),
    error_code: err?.code,
    ...extra,
  });
}

// ── Method gate ───────────────────────────────────────────────
export function requireMethod(req, res, method) {
  if (req.method !== method) {
    res.setHeader('Allow', method);
    jsonError(res, 405, 'METHOD_NOT_ALLOWED', 'Yöntem desteklenmiyor.');
    return false;
  }
  return true;
}

// ── Constants ─────────────────────────────────────────────────
export const ADMIN_FROM_EMAIL = 'SonoInjection <kayit@sonoinjection.com>';
export const ADMIN_REPLY_TO = 'kayit@sonoinjection.com';

// Admin allowlist: only these emails may sign in to /deneme-kayit/admin/.
// Append entries (any email — Workspace, personal Gmail, etc.) to grant
// access; remove + redeploy to revoke. Matches lowercase.
export const ADMIN_ALLOWLIST = new Set([
  'info@sonoinjection.com',
  'kayit@sonoinjection.com',
]);

export const ADMIN_PANEL_URL = 'https://sonoinjection.com/deneme-kayit/admin/';

// ── Admin auth gate ───────────────────────────────────────────
// Validates the Bearer JWT on the request, then checks the user's
// email against ADMIN_ALLOWLIST. On any failure it writes the
// JSON error response and returns null — callers should bail out:
//
//   const adminEmail = await requireAdmin(req, res);
//   if (!adminEmail) return;
//
// On success returns the authenticated lowercase email string,
// which is the value to use as `created_by` on log writes and
// `confirmed_by` on status changes.
export async function requireAdmin(req, res) {
  const header = req.headers?.authorization || req.headers?.Authorization || '';
  const match = /^Bearer\s+(.+)$/i.exec(String(header).trim());
  if (!match) {
    jsonError(res, 401, 'AUTH_REQUIRED', 'Oturum bulunamadı. Lütfen tekrar giriş yapın.');
    return null;
  }
  const token = match[1];

  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    if (err instanceof ConfigError) {
      logServerError('config', err);
      jsonError(res, 500, 'CONFIG_ERROR', 'Sunucu yapılandırma hatası.');
      return null;
    }
    throw err;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user?.email) {
    logEvent('info', 'admin.auth_invalid_token', { reason: error?.message || 'no_user' });
    jsonError(res, 401, 'AUTH_INVALID', 'Oturum geçersiz veya süresi dolmuş. Lütfen tekrar giriş yapın.');
    return null;
  }

  const email = String(data.user.email).toLowerCase();
  if (!ADMIN_ALLOWLIST.has(email)) {
    logEvent('warn', 'admin.auth_forbidden', { email });
    jsonError(res, 403, 'AUTH_FORBIDDEN', 'Bu e-posta yönetici listesinde yok.');
    return null;
  }

  return email;
}
