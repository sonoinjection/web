/* ============================================================
   events.js — per-course wiring and hero copy for the registration forms

   Two courses can take applications at the same time. Each one gets its
   own page (/kayit/ and /kayit-mart/), but both pages load the same CSS
   and the same scripts from /kayit/ — only the course differs, and it
   lives here rather than in either page.

   A page declares which course it is with a data attribute on <html>:

     <html data-event="2027-03-rmk-aimes">

   Anything unrecognised (or missing) falls back to DEFAULT_EVENT, so
   /kayit/ keeps working exactly as before even without the attribute.

   To open registration for another course: add an entry below, create
   the page that points at it, and add the same slug to api/_events.js
   with is_active: true. Both halves are required — the endpoint rejects
   a slug it does not know with EVENT_NOT_ACTIVE.
   ============================================================ */

// Two pipelines exist; `endpoint` and `eventId` belong together because
// they use different event identifiers.
//
//   '/api/apply'    — email-only, no database. eventId is the course
//                     slug, resolved from api/_events.js.
//   '/api/register' — Supabase pipeline. eventId is the events-table
//                     UUID. Needs a live Supabase project.
export const EVENTS = {
  '2027-01-rmk-aimes': {
    endpoint: '/api/apply',
    eventId: '2027-01-rmk-aimes',
    // Supabase values, kept here for the flip back:
    //   endpoint: '/api/register',
    //   eventId: '65675693-d721-47bf-b78d-244db4f3d77e',
    strings: {
      tr: {
        docTitle: 'Kayıt — Kadavrada Ultrasonografi Eşliğinde Lomber Bölge ve Fasya Plan Enjeksiyonları Kursu — SonoInjection',
        event: {
          date: '17 Ocak 2027',
          title: 'Kadavrada Ultrasonografi Eşliğinde Lomber Bölge ve Fasya Plan Enjeksiyonları Kursu',
          venue: 'RMK AIMES, İstanbul',
          address: 'Koç Üniversitesi Hastanesi, Davutpaşa Cd. No:4, Zeytinburnu/İstanbul 34010',
        },
      },
      en: {
        docTitle: 'Registration — Cadaveric Ultrasound-Guided Lumbar Region and Fascial Plane Injection Course — SonoInjection',
        event: {
          date: 'January 17, 2027',
          title: 'Cadaveric Ultrasound-Guided Lumbar Region and Fascial Plane Injection Course',
          venue: 'RMK AIMES, Istanbul',
          address: 'Koç University Hospital, Davutpaşa Cd. No:4, Zeytinburnu/İstanbul 34010, Türkiye',
        },
      },
    },
  },

  '2027-03-rmk-aimes': {
    endpoint: '/api/apply',
    eventId: '2027-03-rmk-aimes',
    strings: {
      tr: {
        docTitle: 'Kayıt — 27 Mart 2027 — Kadavrada Ultrasonografi Eşliğinde Lomber Bölge ve Fasya Plan Enjeksiyonları Kursu — SonoInjection',
        event: {
          date: '27 Mart 2027',
          title: 'Kadavrada Ultrasonografi Eşliğinde Lomber Bölge ve Fasya Plan Enjeksiyonları Kursu',
          venue: 'RMK AIMES, İstanbul',
          address: 'Koç Üniversitesi Hastanesi, Davutpaşa Cd. No:4, Zeytinburnu/İstanbul 34010',
        },
      },
      en: {
        docTitle: 'Registration — March 27, 2027 — Cadaveric Ultrasound-Guided Lumbar Region and Fascial Plane Injection Course — SonoInjection',
        event: {
          date: 'March 27, 2027',
          title: 'Cadaveric Ultrasound-Guided Lumbar Region and Fascial Plane Injection Course',
          venue: 'RMK AIMES, Istanbul',
          address: 'Koç University Hospital, Davutpaşa Cd. No:4, Zeytinburnu/İstanbul 34010, Türkiye',
        },
      },
    },
  },
};

export const DEFAULT_EVENT = '2027-01-rmk-aimes';
export const USE_MOCK_RESPONSE = false;
export const MOCK_LATENCY_MS = 500;

// The slug the current page declares, or the default if it declares
// nothing recognisable. Never returns null — a form with no course is
// worse than a form on the wrong one, which is visible on screen.
export function getEventConfig() {
  const slug = document.documentElement.dataset.event;
  return EVENTS[slug] || EVENTS[DEFAULT_EVENT];
}
