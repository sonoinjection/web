# SonoInjection — Codebase Conventions

Notes for future Claude sessions working on this repo. Read this before making changes.

---

## 1. Hard constraints

- **Hosted on Vercel** at `sonoinjection.com` (DNS apex `A 76.76.21.21`, `www` `CNAME cname.vercel-dns.com`). Static HTML/CSS/JS for the marketing site and registration form; serverless functions under `api/` for the registration endpoint and admin board. Supabase Postgres for data, Resend for transactional email.
- **No build step.** Vanilla ES modules in the browser, ESM in Node (`"type": "module"` in `package.json`). Keep the no-build constraint unless we explicitly adopt a framework.
- The `.jsx` files under `design-system/` are **reference material, not production**. Do not import them. Translate their structure to static HTML when implementing.

## 2. Repo layout

```
/                          ← Vercel deploys from main; marketing site served from /
  README.md
  CLAUDE.md                ← this file
  package.json             ← Vercel-installed deps (@supabase/supabase-js, resend)
  package-lock.json        ← committed for deterministic Vercel installs
  vercel.json              ← `{}` — no custom routing
  design-system/           ← brand assets + tokens — IMMUTABLE source of truth
  instructor_pictures/     ← legacy faculty photos (deprecated — see /assets/faculty/)
  index.html, index-en.html, about*.html, courses*.html, faculty*.html
  courses/                 ← per-course detail pages (TR + EN)
  styles/  data/  assets/  ← marketing CSS, data, photos. See §3.
  scripts/                 ← browser render scripts AND Node-only diagnostics. See §3 / §11.
  kayit/                   ← public registration form (TR) + shared CSS/JS. See §4.
  deneme-kayit/
    admin/                 ← admin board (TR, magic-link auth). URL deliberately kept
                             off /kayit/ as soft gating. Internal CSS/JS load from
                             /kayit/. See §4.
  api/                     ← Vercel serverless functions
    register.js            ← POST /api/register
    _shared.js _emails.js _log.js
    admin/
      _transitions.js
      list-events.js  list-registrations.js  get-registration.js
      update-status.js  update-registration.js  update-event.js
      add-log-entry.js
```

`index.html` and `index-en.html` are the canonical homepage, served directly from the apex. Production launched on Vercel at `sonoinjection.com` on 2026-05-09 (legacy GitHub-Pages-era root coming-soon pages and the `CNAME` file removed at the same time); the `/deneme/` sandbox prefix was retired and its content promoted to root, and `/deneme-kayit/` was renamed to `/kayit/`, on 2026-05-10. `/deneme-kayit/admin/` was deliberately left in place as URL gating for the admin board (alongside the magic-link auth — see §4/§5).

## 3. Marketing site structure

```
index.html, index-en.html            ← homepage (TR / EN)
courses.html, courses-en.html        ← course listing
faculty.html, faculty-en.html        ← faculty roster
about.html, about-en.html            ← about page
courses/
  <slug>.html, <slug>.en.html        ← one detail page per course
styles/
  tokens.css                         ← thin re-export of design-system/colors_and_type.css
  base.css                           ← reset + element defaults
  components.css                     ← .btn, .badge, .nav, .card, .footer, etc.
  pages/
    home.css                         ← homepage-only sections
    course-detail.css                ← course detail / inner page hero / prose layout
scripts/
  render-courses.js                  ← reads data/courses.js → injects into [data-course-grid]
  render-faculty.js                  ← reads data/faculty.js → injects into [data-faculty-grid]
  nav.js                             ← mobile menu toggle
  event-availability.js              ← live "X kontenjan kaldı" badge on course detail pages
data/
  courses.js                         ← course catalogue (multilingual fields)
  faculty.js                         ← faculty roster (multilingual fields)
  strings.js                         ← UI strings used by render scripts
assets/
  logo.svg, logo-dark.svg, favicon.svg
  faculty/<id>.jpeg                  ← canonical home for portraits
  hero/hero-{1..6}.jpeg              ← homepage hero photo-stack carousel
```

### Homepage hero photo stack

The right side of the dark hero on `index.html` and `index-en.html` is a CSS-only crossfading carousel — six photos under `assets/hero/`, ~6 seconds each, 36-second loop. All animation is keyframe-driven (`@keyframes hps-rotate` in `styles/pages/home.css`), no JS. The carousel hides itself below 900px viewport so the headline gets full width on mobile, and falls back to a single static photo for `prefers-reduced-motion`. To swap photos, replace files in place keeping the `hero-1.jpeg` … `hero-6.jpeg` filenames; to change count, update both the `.hps-pN` rules and the keyframe percentages so the timing still divides evenly. Originally adapted from a React/Vite handoff (`HeroPhotoStack.jsx`) — that JSX is not in the repo because the static build is the source of truth.

### How content is structured

Each HTML page sets two attributes on `<html>`:

- `data-lang="tr"` or `data-lang="en"` — selects which language fields the JS reads
- `data-base=""` (root pages) or `data-base="../"` (pages under `courses/`) — prepended to relative asset paths in render scripts

Render scripts find target containers by attribute:

- `<div data-course-grid data-limit="3"></div>` — renders the first 3 courses
- `<div data-faculty-grid></div>` — renders all faculty
- `<div data-faculty-grid data-ids="mahir-topaloglu,mert-zure"></div>` — renders specific faculty in order

### Adding things to the marketing site

**A course.** Add an entry to `data/courses.js` (see existing entries for the field shape: `id`, `slug`, `detail.{tr,en}`, `thumbLabel.{tr,en}`, `title.{tr,en}`, `level.{tr,en}`, `venue`, `city`, `date.{tr,en}`, `iso`, `spots`, `maxSpots`, `price` or `null`, `joints.{tr,en}`, `description.{tr,en}` (array of HTML strings), `signature.{tr,en}`, `signatureBy.{tr,en}`, `schedule.{tr,en}`, `facultyIds`). Create `courses/<slug>.html` and `<slug>.en.html` from the existing detail-page template.

**A faculty member.** Drop a square JPEG into `assets/faculty/<id>.jpeg` (lowercase, hyphenated, ASCII: ş→s, ı→i, etc.). Add an entry to `data/faculty.js` with `id`, `photo`, `name` (TR display), `nameEn`, `title.{tr,en}`, `institution.{tr,en}`, `city.{tr,en}`, `role` (`director` | `faculty` | `coordination`). Reference by ID in a course's `facultyIds` if appropriate.

**A language (e.g. German).** Add a `de` key to every multilingual field in `data/*.js`. Create the German page variants (`index-de.html`, `courses-de.html`, etc.). Update the `nav__lang` switcher on every page.

## 4. /kayit/ structure (registration form) and /deneme-kayit/admin/ (admin board)

Public registration page is served from `/kayit/`; the admin board stays at `/deneme-kayit/admin/` as soft URL gating, layered with magic-link auth (see below). Both pages share the same CSS and the same `scripts/` directory under `/kayit/` — the admin HTML at `/deneme-kayit/admin/index.html` loads its stylesheets and `admin.js` via absolute paths under `/kayit/`.

```
kayit/
  index.html                         ← public registration page (TR)
  styles/
    tokens.css                       ← thin re-export of design-system/colors_and_type.css
    base.css                         ← reset + element defaults
    components.css                   ← form, button, table, status pills, auth overlay
  scripts/
    shared.js                        ← validators, label dictionaries (incl. STATUS_LABELS_TR), formatters
    register.js                      ← public form handler; constants on top
    auth.js                          ← Supabase Auth browser wrapper (magic link)
    admin.js                         ← admin board: state, render, dialogs, optimistic updates, auth gate
    admin-api.js                     ← thin fetch() wrappers for the 7 admin routes; attaches Bearer token

deneme-kayit/
  admin/
    index.html                       ← admin protected page (TR, magic-link auth);
                                       loads CSS and admin.js from /kayit/.
```

### Wiring constants live at the top of register.js

```js
const REGISTER_ENDPOINT = '/api/register';
const EVENT_ID = '65675693-d721-47bf-b78d-244db4f3d77e';
const USE_MOCK_RESPONSE = false;
```

The frontend `POST`s the form payload to `REGISTER_ENDPOINT` and reads the JSON `{ error, code }` body on non-2xx to surface the Turkish error message in the form's error banner. `USE_MOCK_RESPONSE = true` is a local-dev fallback that simulates a 500ms-delayed success without hitting the API.

### Admin authentication (magic link)

Admins sign in by entering their email on the admin overlay; Supabase emails a one-click sign-in link. After clicking, the browser receives a JWT (session persisted via Supabase JS), and every request to `/api/admin/*` carries `Authorization: Bearer <token>`. Server-side, `requireAdmin()` in `api/_shared.js` validates the token via `supabase.auth.getUser(token)` and rejects any email not in `ADMIN_ALLOWLIST`. The authenticated email becomes `created_by` on every `registration_log` row (and `confirmed_by` on status changes).

Browser-side Supabase config (URL + anon publishable key) is served by `/api/auth-config`, which reads `SUPABASE_URL` and `SUPABASE_ANON_KEY` from env. The anon key is public-by-design — access control lives in `requireAdmin()`.

Adding an admin = append the email to `ADMIN_ALLOWLIST` in `api/_shared.js` and redeploy. The list is case-insensitive (the gate lowercases before comparing).

### Adding things to /kayit/

**A new event.** Append a row to the Supabase `events` table with `is_active = true`. Set `EVENT_ID` in `kayit/scripts/register.js` to its `id`, or — once we support multiple active events — extend the public page to a small picker.

**A new admin email.** Append it to `ADMIN_ALLOWLIST` in `api/_shared.js` (also documented in §5). Any email type works — Workspace, personal Gmail, anything — since magic links go via Supabase Auth's SMTP, not Google OAuth.

## 5. Vercel runtime (API routes, env, allowlist)

Stack:

- **Vercel** for hosting + serverless API routes. Static HTML at the apex and under `/kayit/` is served directly; routes under `api/` are auto-detected as serverless functions.
- **Supabase** for Postgres + Auth (magic-link email). Schema in §8. Access control is enforced at the application layer by `requireAdmin()` checking `ADMIN_ALLOWLIST` (see §4). RLS stays disabled — adding it is a future hardening step but not required for two-admin scale.
- **Resend** for transactional email. Four email types, see §6.

### Vercel API routes

All routes live under `api/` (Vercel auto-detects). Files prefixed with `_` are helpers, not endpoints. Service-role key is required server-side.

**Public**
- `POST /api/register` — receives the public form payload. Validates, enforces capacity (`capacity − reserved_for_external`) and duplicate-email checks, inserts a `registrations` row with `status = 'applied'`, dispatches Email 1 (registrant) + Email 2 (admin), and writes the corresponding `email_sent` log entries. Email failures don't fail the request. Stable error codes: `VALIDATION_ERROR`, `EVENT_NOT_ACTIVE`, `CAPACITY_FULL`, `DUPLICATE_REGISTRATION`, `INSERT_FAILED`, `CONFIG_ERROR`, `INVALID_BODY`, `METHOD_NOT_ALLOWED`.

**Admin** — every route runs `requireAdmin(req, res)` first (validates the Bearer JWT, rejects emails not in `ADMIN_ALLOWLIST`). The returned email is stamped as `created_by` on every log write and `confirmed_by` on status changes.
- `GET  /api/admin/list-events` — events sorted by `event_date desc`, each augmented with `counts` (`applied`, `paid`, `cancelled`, `refunded`, `active_count`, `total_count`).
- `GET  /api/admin/list-registrations?event_id=…` — registrations for an event + each row's most recent `registration_log` entry.
- `GET  /api/admin/get-registration?id=…` — one registration + full log timeline (desc).
- `POST /api/admin/update-status` — validates the status transition (see §9), updates the row, writes a `status_change` log, sends Email 3/5/6 if applicable, writes `email_sent` log on success.
- `POST /api/admin/update-registration` — diff-based field updates (whitelisted fields only). One `admin_note` log entry per changed field.
- `POST /api/admin/update-event` — admin-edited event metadata. Whitelisted fields only; `price_gross_try` is generated by Postgres and never accepted as input.
- `POST /api/admin/add-log-entry` — manual `admin_note` and `contact` entries from the detail-modal Geçmiş timeline.

**Auth bootstrap**
- `GET /api/auth-config` — returns `{ supabaseUrl, supabaseAnonKey }` from env so the admin browser can construct a Supabase Auth client without hardcoding values. Anon key is public-by-design.

Cron / scheduled tasks are not yet implemented. Email 4 (pre-course reminder) is the only outstanding one — it'll select rows where `status = 'confirmed'` AND `event_date - 7 days = today` AND `reminder_sent_at IS NULL`, send the email, and stamp `reminder_sent_at`.

There is **no automatic expiry** of `applied` registrations. Cancellations are admin-driven only.

### File layout under api/

```
api/
  register.js                 ← public form handler
  auth-config.js              ← public GET → {supabaseUrl, supabaseAnonKey} for the admin browser
  _shared.js                  ← Supabase + Resend client init, requireAdmin(), formatters, ADMIN_ALLOWLIST
  _emails.js                  ← email templates (1, 2, 3, 5, 6) + sendEmail()
  _log.js                     ← registration_log writers
  admin/
    _transitions.js           ← status enum + ALLOWED_TRANSITIONS + TR labels
    list-events.js
    list-registrations.js
    get-registration.js
    update-status.js
    update-registration.js
    update-event.js
    add-log-entry.js
```

### Required environment variables

Set these in Vercel project settings (Production + Preview). Mirror them in a local `.env.local` (gitignored) for the diagnostic scripts in §11.

- `SUPABASE_URL` — Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` — service-role key (server-only; used by every server function via `getSupabase()`).
- `SUPABASE_ANON_KEY` — Supabase anon/publishable key. Public-by-design; served to the admin browser via `/api/auth-config` so it can construct a Supabase Auth client.
- `RESEND_API_KEY` — Resend API key. The `from` address `kayit@sonoinjection.com` requires the `sonoinjection.com` domain to be verified in Resend.

### Admin allowlist (current)

Only the following emails are permitted to sign in to the admin UI. `requireAdmin()` in `api/_shared.js` checks the authenticated email (case-insensitive) against this set on every admin request.

- `info@sonoinjection.com`
- `kayit@sonoinjection.com`

To add an admin: append the email to `ADMIN_ALLOWLIST` in `api/_shared.js` and redeploy. Any email host works — Workspace, personal Gmail, etc. — since auth is magic-link, not Google OAuth. Removal is the same operation in reverse.

## 6. Email pipeline

All emails sent via Resend. Each event row has its own `bank_details_tr` so per-event details (price, IBAN, account holder, reference number rule) can vary. Templates live in `api/_emails.js` and are dispatched via `sendEmail()`.

1. **Registration received** → registrant's email
   *Trigger:* successful `POST /api/register` insert (immediate).
   *Body:* confirms the registration was received, embeds the per-event pricing breakdown (net price, KDV at `kdv_rate`, gross total — formatted per §7's Turkish number conventions) and `bank_details_tr` from the event row, instructs them to email proof of payment to `kayit@sonoinjection.com`.

2. **Admin notification** → `kayit@sonoinjection.com`
   *Trigger:* same insert (immediate).
   *Body:* new pending registration arrived (name, email, phone, specialty, position, institution); deep-link to the admin row.

3. **Payment confirmation** → registrant's email
   *Trigger:* admin transitions `applied → paid` via `POST /api/admin/update-status`. Always sent (no opt-out).
   *Body:* confirmation, course logistics summary (date, venue), reminder that a pre-course reminder follows.

4. **Pre-course reminder** → registrants whose `status = 'paid'` *(not yet implemented)*
   *Trigger:* a daily cron / scheduled task that finds rows where `status = 'paid'` AND `event_date - 7 days = today` AND `reminder_sent_at IS NULL`. After sending, sets `reminder_sent_at = now()` so the row is gated against re-sends. Idempotent.

5. **Cancellation notice** → registrant's email — **opt-in**
   *Trigger:* admin transitions `applied → cancelled` or `paid → cancelled` with the *"Katılımcıya iptal e-postası gönder."* checkbox ticked.
   *Body:* short acknowledgement; includes the admin-supplied reason if provided.

6. **Refund notice** → registrant's email — **opt-in**
   *Trigger:* admin transitions `paid → refunded` with the *"Katılımcıya iade e-postası gönder."* checkbox ticked.
   *Body:* refund acknowledgement; includes the refund amount (Turkish-formatted) and notes if provided.

**No automatic expiry.** `applied` registrations stay applied until an admin manually transitions them. Cancellations and refunds are admin-driven only.

## 7. Audience and language policy

- **Physicians-only audience.** Enforced softly by:
  - Name is collected as two separate fields — *Ad* (`first_name`) and *Soyad* (`last_name`) — both required, both validated as non-empty trimmed strings client-side and server-side.
  - The `Uzmanlık` field is a closed dropdown — *Fiziksel Tıp ve Rehabilitasyon, Ortopedi ve Travmatoloji, Romatoloji, Spor Hekimliği, Algoloji, Diğer*. No free-text profession field.
  - The `Pozisyon` field is a closed dropdown — *Uzman, Asistan*. No "student", "nurse", "marketing rep", etc.
  - All required dropdowns start with `Seçiniz` as the placeholder option.
- **Turkish only for v1.** All form copy, validation messages, success/error states, admin UI labels are Turkish. The schema's `*_tr` columns are intentionally suffixed so we can add `*_en` (and `*_de`) columns later without renaming.
- **No emoji in form copy.** Lucide line icons via CDN where icons are needed.

### Turkish number formatting

Monetary values render with Turkish locale grouping (`.` thousands separator, `,` decimal) and the suffix ` TL`. Always two fraction digits.

```js
function formatTRY(value) {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ' TL';
}
// formatTRY(25000)      → "25.000,00 TL"
// formatTRY(25000.5)    → "25.000,50 TL"
// formatTRY(1234567.89) → "1.234.567,89 TL"
```

Do **not** use `Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })` — its symbol placement and abbreviation (`₺25.000,00` or `25.000,00 ₺`) is inconsistent across runtimes. The decimal+suffix form above is the canonical SonoInjection presentation.

Pricing breakdowns in Email 1 use this formatter for `price_net_try`, the KDV amount, and `price_gross_try`. Any future UI surface that displays pricing (course detail enrol card, admin table, invoice receipts) uses the same formatter.

## 8. Database schema (Supabase)

Authoritative reference. SQL kept inline here until we're ready for a real migration file under `db/`. The schema below is the **current applied state** — `reminder_sent_at` and `reserved_for_external` were added via manual `ALTER` (see "Applied migrations" below).

```sql
create table events (
  id                     uuid primary key default gen_random_uuid(),
  title_tr               text not null,
  description_tr         text,
  event_date             date not null,
  location_tr            text not null,
  capacity               int,
  reserved_for_external  int not null default 0,    -- seats held off-platform; effective online capacity = capacity - reserved_for_external
  price_net_try          numeric(10,2),             -- KDV-exclusive net price in TRY
  kdv_rate               numeric(5,2)  not null default 20.00,  -- VAT rate in percent (20.00 = 20%)
  price_gross_try        numeric(10,2) generated always as (
    round(price_net_try * (1 + kdv_rate / 100), 2)
  ) stored,                                         -- KDV-inclusive gross; auto-computed by Postgres
  price_eur              numeric(10,2),             -- optional EUR equivalent for international participants
  bank_details_tr        text,
  is_active              boolean not null default false,
  created_at             timestamptz not null default now()
);

create type specialty_t as enum
  ('ftr','ortopedi','romatoloji','spor_hekimligi','algoloji','diger');
create type position_t as enum ('uzman','asistan');
create type registration_status_t as enum
  ('applied','paid','cancelled','refunded');
-- Default for new rows is 'applied'. Allowed transitions are documented
-- in §9 and enforced server-side by api/admin/_transitions.js.

create table registrations (
  id                  uuid primary key default gen_random_uuid(),
  event_id            uuid not null references events(id),
  first_name          text not null,
  last_name           text not null,
  email               text not null,
  phone               text not null,
  specialty           specialty_t not null,
  position            position_t not null,
  institution         text not null,
  notes               text,
  status              registration_status_t not null default 'pending',
  registered_at       timestamptz not null default now(),
  expires_at          timestamptz,                    -- LEGACY: nullable; not enforced; kept for backward compatibility
  confirmed_at        timestamptz,
  confirmed_by        text,
  cancelled_at        timestamptz,
  cancellation_reason text,
  payment_reference   text,
  reminder_sent_at    timestamptz                       -- set when email #4 (pre-course reminder) fires; gates re-sends
);

create index on registrations (event_id, status);
create index on registrations (email);
create index on registrations (last_name);
create index on registrations (event_id, status) where reminder_sent_at is null;

create type registration_log_entry_type_t as enum
  ('status_change','admin_note','contact','email_sent','system');

create table registration_log (
  id              uuid primary key default gen_random_uuid(),
  registration_id uuid not null references registrations(id) on delete cascade,
  entry_type      registration_log_entry_type_t not null,
  message         text,
  metadata        jsonb,
  created_by      text not null,           -- authenticated admin email (set by requireAdmin) or 'system'
  created_at      timestamptz not null default now()
);

create index on registration_log (registration_id, created_at desc);
```

`registration_log` is append-only. Every state-changing admin action writes one or more entries; reads concatenate them into the detail-modal Geçmiş timeline.

### Admin actions write to registration_log via the Vercel API only

Admin pages do **not** write directly to Supabase from the browser. All mutations go through the routes under `api/admin/` (see §5). This keeps validation and audit-log writes centralized server-side. RLS stays disabled — auth is enforced at the application layer by `requireAdmin()` in `api/_shared.js`, which validates the Bearer JWT and gates on `ADMIN_ALLOWLIST`.

`created_by` on every log entry is the authenticated admin's email returned by `requireAdmin()`. `'system'` is reserved for automated events (email dispatches by `api/register.js`, cron jobs once they ship).

### Applied migrations

These have already been applied to the live Supabase database manually. Tracked here so the schema block above stays self-explanatory and so a future migration file under `db/` can be reconstructed from history.

```sql
-- 2026-05-09 — split full_name into first_name + last_name (table was empty)
alter table registrations drop column full_name;
alter table registrations add column first_name text not null;
alter table registrations add column last_name  text not null;

-- 2026-05-09 — pre-course reminder + external-seat tracking
alter table registrations add column reminder_sent_at timestamptz;
alter table events        add column reserved_for_external int not null default 0;

-- 2026-05-09 — pricing restructure: net price + KDV rate, generated gross
alter table events drop column price_try;
alter table events add column price_net_try   numeric(10,2);
alter table events add column kdv_rate        numeric(5,2) not null default 20.00;
alter table events add column price_gross_try numeric(10,2)
  generated always as (round(price_net_try * (1 + kdv_rate / 100), 2)) stored;

-- 2026-05-09 — drop NOT NULL on expires_at so api/register.js can
-- insert without supplying a value (column is legacy per §6).
alter table registrations alter column expires_at drop not null;

-- 2026-05-09 — schema rebuild for Session 1 admin board
-- registration_status_t enum: pending|confirmed|expired|cancelled  →  applied|paid|cancelled|refunded
-- registrations table truncated and rebuilt with the new enum default.
-- registration_log table added (see §8) for the audit timeline.
-- (Rebuild was performed manually in Supabase since registrations was
-- empty; documented here for traceability.)
```

### Seed (the only event for v1)

```sql
insert into events (
  title_tr,
  event_date,
  location_tr,
  is_active,
  description_tr,
  capacity,
  price_net_try,
  price_eur,
  bank_details_tr
) values (
  'Kadavrada Ultrasonografi Eşliğinde Omuz ve Alt Ekstremite Enjeksiyon Kursu',
  '2026-06-20',
  'RMK AIMES — Koç Üniversitesi Tıp Fakültesi Kampüsü, Davutpaşa Cd. No:4, Zeytinburnu/İstanbul 34010',
  true,
  null,            -- TODO: description_tr
  null,            -- TODO: capacity
  null,            -- TODO: price_net_try (price_gross_try computed automatically; kdv_rate defaults to 20.00)
  null,            -- TODO: price_eur
  null             -- TODO: bank_details_tr
);

-- The seed only specifies price_net_try; price_gross_try is computed by
-- the generated column. kdv_rate defaults to 20.00 unless overridden.
```

## 9. Admin actions and status transitions

The `registrations.status` enum has four values: `applied`, `paid`, `cancelled`, `refunded`. The state machine is enforced server-side in `api/admin/_transitions.js` and mirrored client-side in `kayit/scripts/shared.js` for UI affordances.

| From → To | Action label (TR) | Email triggered | Gating in dialog | Log entries written |
|---|---|---|---|---|
| `applied` → `paid` | **Ödeme Onayla** | Email 3 (always) | "Ödemenin alındığını teyit ediyorum." checkbox required | `status_change` + `email_sent` |
| `applied` → `cancelled` | **İptal Et** | Email 5 (opt-in) | "Katılımcı haberdar edildi." checkbox required; "İptal e-postası gönder." optional | `status_change` (+ `email_sent` if opted in) |
| `paid` → `cancelled` | **İptal Et** | Email 5 (opt-in) | same as above | same as above |
| `paid` → `refunded` | **İade Et** | Email 6 (opt-in) | "Katılımcı haberdar edildi." AND "Banka tarafında tamamlandı." both required; "İade e-postası gönder." optional; refund amount and notes optional | `status_change` (+ `email_sent` if opted in) |
| `cancelled` → `applied` | **Yeniden Aktive Et** | none | reason input optional | `status_change` only |
| `refunded` → `paid` | **Yeniden Aktive Et** | none | reason input optional | `status_change` only |

Any transition not in the table is rejected with HTTP 409 + code `INVALID_TRANSITION` and a Turkish message naming the offending pair.

### Log entry types

| `entry_type` | Used for | `metadata` shape |
|---|---|---|
| `status_change` | Every status transition | `{ old_status, new_status, reason?, payment_reference?, refund_amount?, informed_confirmed?, refund_completed_confirmed?, sent_email }` |
| `admin_note` | Manual notes from the detail-modal "+ Not Ekle" button. Also used by `update-registration.js` for per-field change records (`metadata.kind = 'field_change'`, `field`, `old_value`, `new_value`). | varies |
| `contact` | "+ İletişim Kaydı Ekle" dialog | `{ contact_method: 'phone' \| 'email' \| 'in_person' }` |
| `email_sent` | Automated; written whenever an email is dispatched | `{ email_type, to_address }` |
| `system` | Reserved for automated events with no explicit category (cron runs, etc.) | varies |

When an admin action both changes status and dispatches an email (Email 3/5/6), `update-status.js` writes **two** log entries — one `status_change` and one `email_sent` — both visible in the detail timeline.

## 10. Styling rules

- **Use design tokens, not raw values.** All colors, spacing, font sizes, radii, shadows, and durations come from the CSS custom properties in `design-system/colors_and_type.css` (e.g. `var(--teal-500)`, `var(--space-6)`, `var(--shadow-2)`).
- **Exceptions.** A small number of `rgba(255,255,255, 0.X)` overlays on dark sections are inlined where needed. If a new color is required, add it as a token first.
- Component classes use loose BEM: `.block`, `.block__element`, `.block--modifier`. New shared components belong in `components.css`. Page-specific layouts go under `styles/pages/`.
- Don't add a CSS file or stylesheet `<link>` without a clear reason. Prefer extending `components.css`.

## 11. Testing locally

```sh
cd /Users/denizsarikaya/SonoInjection/web
python3 -m http.server 8000
# open http://localhost:8000/  or  http://localhost:8000/kayit/  or  http://localhost:8000/deneme-kayit/admin/
```

ES module imports require a server (won't work via `file://`).

Pre-commit checklist for the marketing site:
- TR↔EN switcher round-trips on every page
- The course detail language switcher points to the sister detail page (not the homepage)
- Faculty photos load on homepage, faculty page, and course detail
- DevTools console is clean

Pre-commit checklist for `/kayit/` and `/deneme-kayit/admin/`:
- Public form submits and shows the success state (against the real API or with `USE_MOCK_RESPONSE = true`)
- All required fields enforce validation; `Seçiniz` placeholders cannot be left selected
- Admin page renders Supabase data, filters work, and per-row actions update the row in place
- Mock-mode banner is visible on `/deneme-kayit/admin/`
- Console is clean

### Diagnostic scripts (when /api/register misbehaves)

When the production API returns a 500 with no helpful Vercel logs, reproduce the failing call locally against the real Supabase:

1. Pull the production env into a local file: `vercel env pull .env.local` (or paste `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` by hand). The file is gitignored.
2. Run one of the scripts under `scripts/`:
   - `node --env-file=.env.local scripts/test-event-fetch.js` — verifies the events row exists and the URL/key are valid.
   - `node --env-file=.env.local scripts/test-register-insert.js` — runs the same insert payload `api/register.js` writes, with a synthetic email; cleans up on success. Surfaces the raw Postgres error (e.g. constraint violations) that the function masks behind `INSERT_FAILED`.

Each script prints the full Supabase response (`data`, `error` with all enumerable properties, HTTP status). Errors come back with a Postgres `code` like `23502` (not-null violation) or `23503` (foreign-key violation) that points directly at the offending column / table.

## 12. Deployment

Vercel auto-deploys every push to `main` on the `sonoinjection/web` GitHub repo. Production target is `sonoinjection.com`.

DNS (Squarespace, backed by Google Cloud DNS):
- Apex `A` → `76.76.21.21` (Vercel anycast)
- `www` `CNAME` → `cname.vercel-dns.com.`
- Google Workspace `MX` records and Resend's `send.` subdomain TXT/CNAME records are left in place — do not touch them when editing DNS.

GitHub Pages is decommissioned (`Settings → Pages → Source: None`).

Live URLs:
- `sonoinjection.com` — marketing site (TR + EN), served directly from `/`
- `sonoinjection.com/kayit/` — public registration form
- `sonoinjection.com/deneme-kayit/admin/` — admin board (magic-link auth via Supabase + `ADMIN_ALLOWLIST`; URL deliberately kept off `/kayit/` as soft gating)
- `sonoinjection.com/api/*` — serverless functions (`register`, `admin/*`)

## 13. Voice & copy

- Course name is always written `SonoInjection` (one word, capital S and I).
- Brand voice: professional, confidence-building, second person ("you will…"). See `design-system/README.md`.
- No emoji in production copy. Lucide line icons (inlined SVG or CDN) only.
