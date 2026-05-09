# SonoInjection — Codebase Conventions

Notes for future Claude sessions working on this repo. Read this before making changes.

---

## 1. Hard constraints

- **Static today.** HTML, CSS, vanilla ES modules. No build step, no React, no Node, no server code. The site is hosted on GitHub Pages via the Squarespace-managed `sonoinjection.com` domain.
- **Vercel migration imminent.** The next phase moves the project to Vercel + Supabase + Resend (see §5). Build new code with that destination in mind: keep API endpoint URLs in named constants, keep mock data in its own file so a real Supabase fetch can drop in, don't introduce build-step dependencies that won't survive the migration.
- The `.jsx` files under `design-system/` are **reference material, not production**. Do not import them. Translate their structure to static HTML when implementing.

## 2. Repo layout

```
/                          ← currently-live "coming soon" pages (DO NOT TOUCH until swap)
  index.html               ← TR coming-soon
  index-en.html            ← EN coming-soon
  CNAME                    ← maps repo to sonoinjection.com
  README.md
  CLAUDE.md                ← this file
  package.json             ← Vercel-installed deps (@supabase/supabase-js, resend)
  design-system/           ← brand assets + tokens — IMMUTABLE source of truth
  instructor_pictures/     ← original faculty photos (deprecated — see /deneme/assets/faculty/)
  deneme/                  ← marketing rebuild sandbox (preview at sonoinjection.com/deneme/)
  deneme-kayit/            ← registration sandbox (preview at sonoinjection.com/deneme-kayit/)
  api/
    register.js            ← Vercel serverless function — POST /api/register
```

When the new marketing site is approved, the swap is: move `deneme/*` to repo root and replace the existing root `index.html` / `index-en.html`. Until then, **the root `index.html` and `index-en.html` are the live site — do not modify them without explicit approval.**

## 3. /deneme/ structure (marketing rebuild)

```
deneme/
  index.html, index-en.html          ← homepage (TR / EN)
  courses.html, courses-en.html      ← course listing
  faculty.html, faculty-en.html      ← faculty roster
  about.html, about-en.html          ← about page
  courses/
    <slug>.html, <slug>.en.html      ← one detail page per course
  styles/
    tokens.css                       ← thin re-export of design-system/colors_and_type.css
    base.css                         ← reset + element defaults
    components.css                   ← .btn, .badge, .nav, .card, .footer, etc.
    pages/
      home.css                       ← homepage-only sections
      course-detail.css              ← course detail / inner page hero / prose layout
  scripts/
    render-courses.js                ← reads data/courses.js → injects into [data-course-grid]
    render-faculty.js                ← reads data/faculty.js → injects into [data-faculty-grid]
    nav.js                           ← mobile menu toggle
  data/
    courses.js                       ← course catalogue (multilingual fields)
    faculty.js                       ← faculty roster (multilingual fields)
    strings.js                       ← UI strings used by render scripts
  assets/
    logo.svg, logo-dark.svg, favicon.svg
    faculty/<id>.jpeg                ← canonical home for portraits
```

### How content is structured

Each HTML page sets two attributes on `<html>`:

- `data-lang="tr"` or `data-lang="en"` — selects which language fields the JS reads
- `data-base=""` (root pages) or `data-base="../"` (pages under `courses/`) — prepended to relative asset paths in render scripts

Render scripts find target containers by attribute:

- `<div data-course-grid data-limit="3"></div>` — renders the first 3 courses
- `<div data-faculty-grid></div>` — renders all faculty
- `<div data-faculty-grid data-ids="mahir-topaloglu,mert-zure"></div>` — renders specific faculty in order

### Adding things to /deneme/

**A course.** Add an entry to `deneme/data/courses.js` (see existing entries for the field shape: `id`, `slug`, `detail.{tr,en}`, `thumbLabel.{tr,en}`, `title.{tr,en}`, `level.{tr,en}`, `venue`, `city`, `date.{tr,en}`, `iso`, `spots`, `maxSpots`, `price` or `null`, `joints.{tr,en}`, `description.{tr,en}` (array of HTML strings), `signature.{tr,en}`, `signatureBy.{tr,en}`, `schedule.{tr,en}`, `facultyIds`). Create `deneme/courses/<slug>.html` and `<slug>.en.html` from the existing detail-page template.

**A faculty member.** Drop a square JPEG into `deneme/assets/faculty/<id>.jpeg` (lowercase, hyphenated, ASCII: ş→s, ı→i, etc.). Add an entry to `deneme/data/faculty.js` with `id`, `photo`, `name` (TR display), `nameEn`, `title.{tr,en}`, `institution.{tr,en}`, `city.{tr,en}`, `role` (`director` | `faculty` | `coordination`). Reference by ID in a course's `facultyIds` if appropriate.

**A language (e.g. German).** Add a `de` key to every multilingual field in `data/*.js`. Create the German page variants (`index-de.html`, `courses-de.html`, etc.). Update the `nav__lang` switcher on every page.

## 4. /deneme-kayit/ structure (registration sandbox)

Two-page Turkish-only sandbox for the registration flow. Built static today; the form `POST` and admin auth get wired after the Vercel migration.

```
deneme-kayit/
  index.html                         ← public registration page (TR)
  admin/
    index.html                       ← admin protected page (TR, mock auth)
  styles/
    tokens.css                       ← thin re-export of design-system/colors_and_type.css
    base.css                         ← reset + element defaults
    components.css                   ← form, button, table, status pills, mock-mode banner
  scripts/
    shared.js                        ← validators, label dictionaries (incl. STATUS_LABELS_TR), formatters
    register.js                      ← public form handler; constants on top
    admin.js                         ← admin board: state, render, dialogs, optimistic updates
    admin-api.js                     ← thin fetch() wrappers for the 7 admin routes
```

### Wiring constants live at the top of register.js

```js
const REGISTER_ENDPOINT = '/api/register';
const EVENT_ID = '65675693-d721-47bf-b78d-244db4f3d77e';
const USE_MOCK_RESPONSE = false;
```

The frontend `POST`s the form payload to `REGISTER_ENDPOINT` and reads the JSON `{ error, code }` body on non-2xx to surface the Turkish error message in the form's error banner. `USE_MOCK_RESPONSE = true` is a local-dev fallback that simulates a 500ms-delayed success without hitting the API.

Admin page is mock-mode only: an amber banner reads *"Mock modu — Google OAuth Vercel geçişinden sonra eklenecek."* The table reads from `scripts/mock-data.js`. Filter and per-row actions mutate the local array and re-render. No persistence.

### Adding things to /deneme-kayit/

**A new event.** Append a row to the Supabase `events` table (post-migration) with `is_active = true`. Set `EVENT_ID` in `register.js` to its `id`, or — once we support multiple active events — extend the public page to a small picker.

**A new admin email.** Append it to the allowlist in §5.

## 5. Vercel migration plan

Target stack:

- **Vercel** for hosting + serverless API routes. The two HTML sandboxes become static-rendered pages of a Next.js (or similar) app.
- **Supabase** for Postgres + Auth (Google OAuth). Schema in §8. Row-level security policies will gate the admin views; for now the allowlist is enforced at the application layer.
- **Resend** for transactional email. Four email types, see §6.

### Vercel API routes

All routes live under `api/` (Vercel auto-detects). Files prefixed with `_` are helpers, not endpoints. Service-role key is required server-side.

**Public**
- `POST /api/register` — receives the public form payload. Validates, enforces capacity (`capacity − reserved_for_external`) and duplicate-email checks, inserts a `registrations` row with `status = 'applied'`, dispatches Email 1 (registrant) + Email 2 (admin), and writes the corresponding `email_sent` log entries. Email failures don't fail the request. Stable error codes: `VALIDATION_ERROR`, `EVENT_NOT_ACTIVE`, `CAPACITY_FULL`, `DUPLICATE_REGISTRATION`, `INSERT_FAILED`, `CONFIG_ERROR`, `INVALID_BODY`, `METHOD_NOT_ALLOWED`.

**Admin** — implemented in Session 1; mock auth (no OAuth gate yet — Session 3). Every log entry these routes write is stamped `created_by: 'mock-admin'`.
- `GET  /api/admin/list-events` — events sorted by `event_date desc`, each augmented with `counts` (`applied`, `paid`, `cancelled`, `refunded`, `active_count`, `total_count`).
- `GET  /api/admin/list-registrations?event_id=…` — registrations for an event + each row's most recent `registration_log` entry.
- `GET  /api/admin/get-registration?id=…` — one registration + full log timeline (desc).
- `POST /api/admin/update-status` — validates the status transition (see §9), updates the row, writes a `status_change` log, sends Email 3/5/6 if applicable, writes `email_sent` log on success.
- `POST /api/admin/update-registration` — diff-based field updates (whitelisted fields only). One `admin_note` log entry per changed field.
- `POST /api/admin/update-event` — admin-edited event metadata. Whitelisted fields only; `price_gross_try` is generated by Postgres and never accepted as input.
- `POST /api/admin/add-log-entry` — manual `admin_note` and `contact` entries from the detail-modal Geçmiş timeline.

Cron / scheduled tasks are not yet implemented. Email 4 (pre-course reminder) is the only outstanding one — it'll select rows where `status = 'confirmed'` AND `event_date - 7 days = today` AND `reminder_sent_at IS NULL`, send the email, and stamp `reminder_sent_at`.

There is **no automatic expiry** of `applied` registrations. Cancellations are admin-driven only.

### File layout under api/

```
api/
  register.js                 ← public form handler
  _shared.js                  ← Supabase + Resend client init, jsonError, parseBody, formatters
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

`api/register.js` reads these from `process.env`. Set them in Vercel project settings (Production + Preview):

- `SUPABASE_URL` — Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` — service-role key (server-only; never expose to the browser).
- `RESEND_API_KEY` — Resend API key. The `from` address `kayit@sonoinjection.com` requires the `sonoinjection.com` domain to be verified in Resend.

### Admin allowlist (current)

Only the following emails are permitted to sign in to the admin UI. The admin page checks the authenticated email against this set on every request.

- `info@sonoinjection.com`
- `kayit@sonoinjection.com`

To add an admin: append the email to this list (and to the equivalent allowlist constant in the deployed app code). Removal is the same operation in reverse.

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
  created_by      text not null,           -- admin email (or 'mock-admin' until OAuth) or 'system'
  created_at      timestamptz not null default now()
);

create index on registration_log (registration_id, created_at desc);
```

`registration_log` is append-only. Every state-changing admin action writes one or more entries; reads concatenate them into the detail-modal Geçmiş timeline.

### Admin actions write to registration_log via the Vercel API only

Admin pages do **not** write directly to Supabase from the browser. All mutations go through the routes under `api/admin/` (see §5). This keeps the validation and audit-log writes centralized server-side. RLS is currently disabled on every table — Session 3 will turn it on alongside Google OAuth.

The `created_by` column on every log entry is currently hardcoded to the literal string `'mock-admin'` for human-driven actions and `'system'` for automated events (email dispatches, cron jobs once they ship). Each admin route has a `// TODO Session 3` comment marking the swap point where this becomes the authenticated admin's email — gated by `ADMIN_ALLOWLIST` in `api/_shared.js`.

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

The `registrations.status` enum has four values: `applied`, `paid`, `cancelled`, `refunded`. The state machine is enforced server-side in `api/admin/_transitions.js` and mirrored client-side in `deneme-kayit/scripts/shared.js` for UI affordances.

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
# open http://localhost:8000/deneme/  or  http://localhost:8000/deneme-kayit/
```

ES module imports require a server (won't work via `file://`).

Pre-commit checklist for `/deneme/`:
- TR↔EN switcher round-trips on every page
- The course detail language switcher points to the sister detail page (not the homepage)
- Faculty photos load on homepage, faculty page, and course detail
- DevTools console is clean

Pre-commit checklist for `/deneme-kayit/`:
- Public form submits in mock mode and shows the success state
- All required fields enforce validation; `Seçiniz` placeholders cannot be left selected
- Admin page renders the mock data, filters work, and per-row actions update the row in place
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

GitHub Pages serves the `main` branch from `/`. New commits to `main` deploy automatically.

Live URLs:
- `sonoinjection.com` — current coming-soon pages
- `sonoinjection.com/deneme/` — marketing rebuild preview
- `sonoinjection.com/deneme-kayit/` — registration sandbox preview
- `sonoinjection.com/deneme-kayit/admin/` — admin sandbox preview

## 13. Voice & copy

- Course name is always written `SonoInjection` (one word, capital S and I).
- Brand voice: professional, confidence-building, second person ("you will…"). See `design-system/README.md`.
- No emoji in production copy. Lucide line icons (inlined SVG or CDN) only.
