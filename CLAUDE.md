# SonoInjection — Codebase Conventions

Notes for future Claude sessions working on this repo. Read this before making changes.

---

## Hard constraints

- **Static files only.** HTML, CSS, vanilla ES modules. No build step, no React, no Node, no server code. The site is hosted on GitHub Pages via the Squarespace-managed `sonoinjection.com` domain.
- The `.jsx` files under `design-system/` are **reference material, not production**. Do not import them, do not link to them. Translate their structure to static HTML when implementing.

## Repo layout

```
/                          ← currently-live "coming soon" pages (DO NOT TOUCH until swap)
  index.html               ← TR coming-soon
  index-en.html            ← EN coming-soon
  CNAME                    ← maps repo to sonoinjection.com
  README.md
  design-system/           ← brand assets + tokens — IMMUTABLE source of truth
  instructor_pictures/     ← original faculty photos (deprecated — see /deneme/assets/faculty/)
  deneme/                  ← the new site (preview at sonoinjection.com/deneme/)
```

When the new site is approved, the swap is: move `deneme/*` to repo root and replace the existing root `index.html` / `index-en.html`. Until then, **the root `index.html` and `index-en.html` are the live site — do not modify them without explicit approval.**

## /deneme/ structure

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

## How content is structured

Each HTML page sets two attributes on `<html>`:

- `data-lang="tr"` or `data-lang="en"` — selects which language fields the JS reads
- `data-base=""` (root pages) or `data-base="../"` (pages under `courses/`) — prepended to relative asset paths in render scripts

Render scripts find target containers by attribute:

- `<div data-course-grid data-limit="3"></div>` — renders the first 3 courses
- `<div data-faculty-grid></div>` — renders all faculty
- `<div data-faculty-grid data-ids="mahir-topaloglu,mert-zure"></div>` — renders specific faculty in order

## Adding things

### Adding a course

1. Add an entry to `deneme/data/courses.js`. Required fields (see existing entries for shape):
   - `id`, `slug`, `detail.{tr,en}` (path to detail page), `thumbLabel.{tr,en}`, `thumbColor`, `title.{tr,en}`, `level.{tr,en}`, `venue`, `city`, `date.{tr,en}`, `iso`, `spots`, `maxSpots`, `price` (or `null`), `joints.{tr,en}`, `description.{tr,en}` (array of HTML strings), `signature.{tr,en}`, `signatureBy.{tr,en}`, `schedule.{tr,en}` (array of `{time, type, title}`), `facultyIds`
2. Create `deneme/courses/<slug>.html` and `<slug>.en.html` for detail pages. Copy the structure of `2026-06-rmk-aimes.html` and adjust copy + schedule + faculty IDs.
3. The homepage and listing page pick up the new course automatically. No other edits needed.

### Adding a faculty member

1. Drop a square JPEG into `deneme/assets/faculty/<id>.jpeg`. Filename convention: `firstname-lastname.jpeg`, lowercase, hyphenated, ASCII (Turkish characters → English equivalents: ş→s, ı→i, etc.).
2. Add an entry to `deneme/data/faculty.js` with `id`, `photo`, `name` (TR display), `nameEn`, `title.{tr,en}`, `institution.{tr,en}`, `city.{tr,en}`, `role` (`'director'` or `'faculty'`).
3. Reference by ID in `courses.js` `facultyIds`, or let it appear automatically on the faculty page.

### Adding a language (e.g. German)

1. Add a `de` key to every multilingual field in `data/courses.js`, `data/faculty.js`, `data/strings.js`.
2. For each existing page, create the German variant: `index-de.html`, `courses-de.html`, `courses/<slug>.de.html`, etc. Copy the EN file as the starting point and translate hand-authored copy. Set `<html lang="de" data-lang="de">`.
3. Update the `nav__lang` switcher on every page to include the third language.
4. Add `de` paths to `data/courses.js` `detail.de` field.

## Styling rules

- **Use design tokens, not raw values.** All colors, spacing, font sizes, radii, shadows, and durations come from the CSS custom properties defined in `design-system/colors_and_type.css` (e.g. `var(--teal-500)`, `var(--space-6)`, `var(--shadow-2)`).
- **Exceptions** to the no-raw-hex rule: a small number of `rgba(255,255,255, 0.X)` overlays on dark sections are inlined where needed. If a new color is required, add it as a token first.
- Component classes use a loose BEM convention: `.block`, `.block__element`, `.block--modifier`. New components belong in `components.css`. Page-specific layouts go under `styles/pages/`.
- Don't add a CSS file or a stylesheet `<link>` without a clear reason. Prefer adding to `components.css`.

## Testing locally

```sh
cd /Users/denizsarikaya/SonoInjection/web/deneme
python3 -m http.server 8000
# open http://localhost:8000
```

ES module imports require a server (won't work via `file://`). Always preview through `localhost`.

Pre-commit checklist:
- Open `deneme/index.html` and `deneme/index-en.html` and check the TR↔EN switcher round-trips correctly.
- Click into the RMK AIMES course detail (TR + EN) and verify the language switcher there points to the matching detail page (not the homepage).
- Confirm the four faculty photos load on the homepage, faculty page, and course detail page.
- Open DevTools → Console — there should be no errors.

## Deployment

GitHub Pages serves the `main` branch from `/`. New commits to `main` deploy automatically. The preview lives at `sonoinjection.com/deneme/` while the coming-soon pages remain at the root.

## Voice & copy

- Course name is always written `SonoInjection` (one word, capital S and I).
- Brand voice: professional, confidence-building, second person ("you will…"). See `design-system/README.md` for full guidance.
- No emoji in production copy. Lucide line icons (inlined SVG) only.
