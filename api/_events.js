/* ============================================================
   api/_events.js — event catalogue for the email-only pipeline
   api/register.js reads events from Supabase; api/apply.js has no
   database, so it reads them from here. Keyed by course slug, which
   is what kayit/scripts/register.js sends as event_id on that path.

   Prices here are KDV-INCLUSIVE totals in USD — that is what the
   application email quotes. (The Supabase pipeline's events table stores
   a net TRY price instead and derives its gross in Postgres; the email
   templates handle either.)

   Keep in sync with data/courses.js.
   ============================================================ */

export const EVENTS = {
  '2027-01-rmk-aimes': {
    id: '2027-01-rmk-aimes',
    is_active: true,
    title_tr: 'Kadavrada Ultrasonografi Eşliğinde Lomber Bölge ve Fasya Plan Enjeksiyonları Kursu',
    title_en: 'Cadaveric Ultrasound-Guided Lumbar Region and Fascial Plane Injection Course',
    event_date: '2027-01-17',
    location_tr: 'RMK AIMES — Koç Üniversitesi Hastanesi, Davutpaşa Cd. No:4, Zeytinburnu/İstanbul',
    location_en: 'RMK AIMES — Koç University Hospital, Davutpaşa Cd. No:4, Zeytinburnu/İstanbul, Türkiye',
    kdv_rate: 20,
    // Quoted per physician in USD, KDV included. The lira equivalent is
    // worked out at confirmation time and sent with the bank details, so
    // no exchange rate is frozen here.
    price_gross_usd: 1125,
    early_bird_price_gross_usd: 1000,
    early_bird_deadline: '2026-11-15',
  },
};

// null if unknown. Returned as-is: the prices here are already the
// totals the email quotes, so nothing needs deriving.
export function getEvent(id) {
  return EVENTS[id] || null;
}
