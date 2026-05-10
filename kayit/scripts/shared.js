/* ============================================================
   shared.js — pure helpers used by both registration and admin
   No DOM references; no I/O. Safe to import from any page.
   ============================================================ */

const TZ = 'Europe/Berlin';

/* ── Reservation deadline ──────────────────────────
   Rule: midnight at end of registration day (Europe/Berlin)
         + 48h − 1s. Lands at 23:59:59 of (reg day + 2) Berlin.
   See CLAUDE.md §7.
   ────────────────────────────────────────────────── */
export function calculateDeadline(registeredAt = new Date()) {
  // Get the registration day in Berlin local calendar.
  const dateInTz = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(registeredAt);
  const [y, m, d] = dateInTz.split('-').map(Number);

  // First, build a Date for "23:59:59 on (day + 2)" treated as UTC.
  // Then figure out the Berlin offset at that moment and adjust.
  const target = new Date(Date.UTC(y, m - 1, d + 2, 23, 59, 59));

  const partsBerlin = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(target);
  const get = (k) => partsBerlin.find((p) => p.type === k).value;

  // Re-anchor "what Berlin sees" as a UTC Date for offset arithmetic.
  const berlinAsUtc = new Date(Date.UTC(
    +get('year'), +get('month') - 1, +get('day'),
    +get('hour'), +get('minute'), +get('second'),
  ));
  const offsetMs = berlinAsUtc.getTime() - target.getTime();

  // The final UTC instant whose Berlin rendering equals (y, m-1, d+2, 23, 59, 59).
  return new Date(target.getTime() - offsetMs);
}

/* ── Turkish-formatted deadline ────────────────────
   Renders e.g. "11 Mayıs 2026 23:59 (CEST)".
   ────────────────────────────────────────────────── */
export function formatDeadlineTr(deadline) {
  const dateTime = new Intl.DateTimeFormat('tr-TR', {
    timeZone: TZ,
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: false,
  }).format(deadline);

  return `${dateTime} (${tzAbbreviation(deadline)})`;
}

/* CET / CEST, derived from the long timezone name so DST is automatic. */
function tzAbbreviation(date) {
  const longName = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    timeZoneName: 'long',
  }).formatToParts(date).find((p) => p.type === 'timeZoneName').value;
  return longName.includes('Summer') ? 'CEST' : 'CET';
}

/* ── Validators (soft, client-side) ────────────────
   Strong validation lives on the server post-migration.
   ────────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// E.164-ish: optional leading +, 7–15 digits total. Spaces/dashes ignored.
const PHONE_RE = /^\+?\d{7,15}$/;

export function isValidEmail(s) {
  return typeof s === 'string' && EMAIL_RE.test(s.trim());
}

export function isValidPhone(s) {
  if (typeof s !== 'string') return false;
  const stripped = s.replace(/[\s\-()]/g, '');
  return PHONE_RE.test(stripped);
}

export function isNonEmpty(s) {
  return typeof s === 'string' && s.trim().length > 0;
}

/* ── Label dictionaries (Turkish) ──────────────────
   Used by the admin table to render enum values.
   ────────────────────────────────────────────────── */
export const SPECIALTY_LABELS_TR = {
  ftr: 'Fiziksel Tıp ve Rehabilitasyon',
  ortopedi: 'Ortopedi ve Travmatoloji',
  romatoloji: 'Romatoloji',
  spor_hekimligi: 'Spor Hekimliği',
  algoloji: 'Algoloji',
  diger: 'Diğer',
};

export const POSITION_LABELS_TR = {
  uzman: 'Uzman',
  asistan: 'Asistan',
};

// Mirrors api/admin/_transitions.js::STATUS_LABELS_TR.
// Status enum: applied | paid | cancelled | refunded.
export const STATUS_LABELS_TR = {
  applied: 'Başvurdu',
  paid: 'Ödendi',
  cancelled: 'İptal',
  refunded: 'İade',
};

export const ENTRY_TYPE_LABELS_TR = {
  status_change: 'Durum değişikliği',
  admin_note: 'Yönetici notu',
  contact: 'İletişim kaydı',
  email_sent: 'E-posta',
  system: 'Sistem',
};

export const CONTACT_METHOD_LABELS_TR = {
  phone: 'Telefon',
  email: 'E-posta',
  in_person: 'Yüz yüze',
};

// Allowed transitions, mirroring the server-side state machine.
export const ALLOWED_TRANSITIONS = {
  applied:   ['paid', 'cancelled'],
  paid:      ['cancelled', 'refunded'],
  cancelled: ['applied'],
  refunded:  ['paid'],
};

// (oldStatus, newStatus) → action label.
export const TRANSITION_ACTION_LABELS_TR = {
  'applied→paid':       'Ödeme Onayla',
  'applied→cancelled':  'İptal Et',
  'paid→cancelled':     'İptal Et',
  'paid→refunded':      'İade Et',
  'cancelled→applied':  'Yeniden Aktive Et',
  'refunded→paid':      'Yeniden Aktive Et',
};

/* ── Datetime formatters (admin table) ─────────────
   ────────────────────────────────────────────────── */
export function formatDateTimeTr(value) {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: TZ,
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: false,
  }).format(d);
}

/* ── Long-form Turkish date for event dates ────────
   "20 Haziran 2026" — anchored in Europe/Istanbul.
   ────────────────────────────────────────────────── */
export function formatEventDateTr(dateValue) {
  if (!dateValue) return '';
  const datePart = String(dateValue).slice(0, 10);
  const [y, m, d] = datePart.split('-').map(Number);
  if (!y || !m || !d) return '';
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Europe/Istanbul',
  }).format(date);
}

/* ── Currency (TRY) ────────────────────────────────
   See CLAUDE.md §7 — tr-TR + " TL", never the
   { style: 'currency' } form (inconsistent symbol placement).
   ────────────────────────────────────────────────── */
const TR_NUMBER = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatTRY(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return `${TR_NUMBER.format(n)} TL`;
}

/* ── HTML escape (used by admin renderers) ─────────
   ────────────────────────────────────────────────── */
export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}
