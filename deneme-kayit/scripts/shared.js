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

export const STATUS_LABELS_TR = {
  pending: 'Bekliyor',
  confirmed: 'Onaylandı',
  expired: 'Süresi Doldu',
  cancelled: 'İptal Edildi',
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
