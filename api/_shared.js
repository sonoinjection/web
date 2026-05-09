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

// ── Formatters (server-side; mirrors deneme-kayit/scripts/shared.js) ──
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
export const ADMIN_ALLOWLIST = [
  'info@sonoinjection.com',
  'kayit@sonoinjection.com',
];
// TODO Session 3: replace 'mock-admin' with the authenticated admin's
// email (Google OAuth via Supabase Auth, gated by ADMIN_ALLOWLIST).
export const MOCK_ADMIN_EMAIL = 'mock-admin';

export const ADMIN_PANEL_URL = 'https://sonoinjection.com/deneme-kayit/admin/';
