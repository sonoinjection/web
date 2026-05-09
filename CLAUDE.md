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
  design-system/           ← brand assets + tokens — IMMUTABLE source of truth
  instructor_pictures/     ← original faculty photos (deprecated — see /deneme/assets/faculty/)
  deneme/                  ← marketing rebuild sandbox (preview at sonoinjection.com/deneme/)
  deneme-kayit/            ← registration sandbox (preview at sonoinjection.com/deneme-kayit/)
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
    shared.js                        ← deadline calc, validators, label dictionaries
    register.js                      ← form handler; constants on top
    admin.js                         ← table render, filters, action handlers (mock)
    mock-data.js                     ← seed registrations for admin testing
```

### Wiring constants live at the top of register.js

```js
const REGISTER_ENDPOINT = '/api/register';   // becomes a real Vercel route post-migration
const EVENT_ID = 'TODO_UUID_2026_06_20';     // becomes the events.id from Supabase
const USE_MOCK_RESPONSE = true;              // flip to false when the API is live
```

`USE_MOCK_RESPONSE === true` simulates a 500ms-delayed success without a network call. Flipping to `false` enables the real `fetch(REGISTER_ENDPOINT, …)` path.

Admin page is mock-mode only: an amber banner reads *"Mock modu — Google OAuth Vercel geçişinden sonra eklenecek."* The table reads from `scripts/mock-data.js`. Filter and per-row actions mutate the local array and re-render. No persistence.

### Adding things to /deneme-kayit/

**A new event.** Append a row to the Supabase `events` table (post-migration) with `is_active = true`. Set `EVENT_ID` in `register.js` to its `id`, or — once we support multiple active events — extend the public page to a small picker.

**A new admin email.** Append it to the allowlist in §5.

## 5. Vercel migration plan

Target stack:

- **Vercel** for hosting + serverless API routes. The two HTML sandboxes become static-rendered pages of a Next.js (or similar) app.
- **Supabase** for Postgres + Auth (Google OAuth). Schema in §9. Row-level security policies will gate the admin views; for now the allowlist is enforced at the application layer.
- **Resend** for transactional email. Four email types, see §6.

### Routes after migration

- `POST /api/register` — receive a registration, insert into `registrations` with `status = 'pending'` and `expires_at` computed via §7. Triggers email #1 (registrant) and email #2 (admins).
- `POST /api/admin/registrations/:id/confirm` — admin action; flips status to `confirmed`. DB trigger (or this handler) sends email #4.
- `POST /api/admin/registrations/:id/cancel` — admin action; flips status to `cancelled` with reason.
- `POST /api/admin/registrations/:id/reactivate` — admin action; flips an `expired` row back to `pending` and re-computes `expires_at`.
- A scheduled task / Supabase cron flips pending → expired when `expires_at` passes and triggers email #3.

### Admin allowlist (current)

Only the following emails are permitted to sign in to the admin UI. The admin page checks the authenticated email against this set on every request.

- `info@sonoinjection.com`
- `kayit@sonoinjection.com`

To add an admin: append the email to this list (and to the equivalent allowlist constant in the deployed app code). Removal is the same operation in reverse.

## 6. Four-email pipeline

All emails sent via Resend. Each event row has its own `bank_details_tr` so per-event details (price, IBAN, account holder, reference number rule) can vary.

1. **Reservation received** → registrant's email
   *Trigger:* successful `POST /api/register` insert.
   *Body:* confirms registration received, states the deadline (formatted in Turkish, see §7), embeds `bank_details_tr` from the event row, instructs them to email proof of payment.

2. **Admin notification** → all addresses in the allowlist (§5)
   *Trigger:* same insert.
   *Body:* new pending registration arrived (name, email, phone, specialty, position, institution); deep-link to the admin row.

3. **Reservation expired** → registrant's email
   *Trigger:* scheduled task that finds rows where `status = 'pending'` AND `now() > expires_at`. Update `status = 'expired'` and send.
   *Body:* deadline passed, reservation released; instructs them to re-register if still interested.

4. **Payment confirmed** → registrant's email
   *Trigger:* admin sets `status = 'confirmed'`. Either a DB trigger or the API handler dispatches.
   *Body:* confirmation, course logistics summary (date, venue, what to bring), receipt info.

## 7. Reservation clock rule

`expires_at = midnight at end of registration day (Europe/Berlin) + 48h − 1s`

Operationally: take the registration day in **Europe/Berlin** local time → compute the end-of-day boundary (00:00 of next day) → add 48 hours → subtract one second. The result lands at **23:59:59 of (registration day + 2)** in Berlin local time. The label in the user-facing copy says "CET" colloquially; the actual rule is "Europe/Berlin", which is CET (UTC+1) in winter and CEST (UTC+2) in summer — DST is automatic.

**Worked example (today's date, 2026-05-09).** A registrant submits the form at any time on **9 May 2026** (CEST = UTC+2). The deadline is **23:59:59 on 11 May 2026 CEST** = `2026-05-11T23:59:59+02:00` = `2026-05-11T21:59:59Z`. Stored as that UTC instant; rendered to the user in Turkish with the Berlin-local time and the `CEST` (or `CET` in winter) label.

Implementation lives in `deneme-kayit/scripts/shared.js::calculateDeadline`, with a sibling formatter `formatDeadlineTr` for display.

## 8. Audience and language policy

- **Physicians-only audience.** Enforced softly by:
  - The `Uzmanlık` field is a closed dropdown — *Fiziksel Tıp ve Rehabilitasyon, Ortopedi ve Travmatoloji, Romatoloji, Spor Hekimliği, Algoloji, Diğer*. No free-text profession field.
  - The `Pozisyon` field is a closed dropdown — *Uzman, Asistan*. No "student", "nurse", "marketing rep", etc.
  - All required dropdowns start with `Seçiniz` as the placeholder option.
- **Turkish only for v1.** All form copy, validation messages, success/error states, admin UI labels are Turkish. The schema's `*_tr` columns are intentionally suffixed so we can add `*_en` (and `*_de`) columns later without renaming.
- **No emoji in form copy.** Lucide line icons via CDN where icons are needed.

## 9. Database schema (Supabase, post-migration)

Authoritative reference. SQL kept inline here until we're ready for a real migration file under `db/`.

```sql
create table events (
  id              uuid primary key default gen_random_uuid(),
  title_tr        text not null,
  description_tr  text,
  event_date      date not null,
  location_tr     text not null,
  capacity        int,
  price_try       numeric(10,2),
  price_eur       numeric(10,2),
  bank_details_tr text,
  is_active       boolean not null default false,
  created_at      timestamptz not null default now()
);

create type specialty_t as enum
  ('ftr','ortopedi','romatoloji','spor_hekimligi','algoloji','diger');
create type position_t as enum ('uzman','asistan');
create type registration_status_t as enum
  ('pending','confirmed','expired','cancelled');

create table registrations (
  id                  uuid primary key default gen_random_uuid(),
  event_id            uuid not null references events(id),
  full_name           text not null,
  email               text not null,
  phone               text not null,
  specialty           specialty_t not null,
  position            position_t not null,
  institution         text not null,
  notes               text,
  status              registration_status_t not null default 'pending',
  registered_at       timestamptz not null default now(),
  expires_at          timestamptz not null,
  confirmed_at        timestamptz,
  confirmed_by        text,
  cancelled_at        timestamptz,
  cancellation_reason text,
  payment_reference   text
);

create index on registrations (event_id, status);
create index on registrations (email);
create index on registrations (expires_at) where status = 'pending';
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
  price_try,
  price_eur,
  bank_details_tr
) values (
  'Kadavrada Ultrasonografi Eşliğinde Omuz ve Alt Ekstremite Enjeksiyon Kursu',
  '2026-06-20',
  'RMK AIMES — Koç Üniversitesi Tıp Fakültesi Kampüsü, Davutpaşa Cd. No:4, Zeytinburnu/İstanbul 34010',
  true,
  null,            -- TODO: description_tr
  null,            -- TODO: capacity
  null,            -- TODO: price_try
  null,            -- TODO: price_eur
  null             -- TODO: bank_details_tr
);
```

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
- Public form submits in mock mode and shows the success state with the formatted deadline
- All required fields enforce validation; `Seçiniz` placeholders cannot be left selected
- Admin page renders the mock data, filters work, and per-row actions update the row in place
- Mock-mode banner is visible on `/deneme-kayit/admin/`
- Console is clean

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
