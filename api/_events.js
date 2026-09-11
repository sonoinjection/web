/* ============================================================
   api/_events.js — event catalogue for the email-only pipeline
   api/register.js reads events from Supabase; api/apply.js has no
   database, so it reads them from here. Keyed by course slug, which
   is what kayit/scripts/register.js sends as event_id on that path.

   Prices are net (KDV-exclusive); getEvent() derives the gross the
   same way the Postgres generated column does — round(net * (1 +
   kdv/100), 2) — so both pipelines render identical figures.

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
    // Quoted in USD (1.000 / 1.125 USD KDV dahil), frozen to TRY at
    // USD/TRY 48,4688 on 2026-09-09, rounded to the nearest 500 TL gross.
    price_net_try: 45416.67,
    early_bird_price_net_try: 40416.67,
    early_bird_deadline: '2026-11-15',
  },
};

function grossOf(net, kdvRate) {
  if (net === null || net === undefined) return null;
  return Math.round(Number(net) * (1 + Number(kdvRate) / 100) * 100) / 100;
}

// Returns a row shaped like the Supabase `events` row the email
// templates expect, gross columns included. null if unknown.
export function getEvent(id) {
  const event = EVENTS[id];
  if (!event) return null;
  return {
    ...event,
    price_gross_try: grossOf(event.price_net_try, event.kdv_rate),
    early_bird_price_gross_try: grossOf(
      event.early_bird_price_net_try, event.kdv_rate,
    ),
  };
}
