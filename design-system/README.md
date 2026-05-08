# SonoInjection Design System

## Brand Overview

**SonoInjection** — *Sono + Injection + Academy*

SonoInjection is a premium hands-on ultrasound cadaver injection course for musculoskeletal pathologies. Targeted at physiatrists (PM&R), orthopedic surgeons, and physiotherapists, the program blends rigorous anatomical precision with real-world procedural confidence. Participants rotate through cadaveric stations guided by expert instructors, mastering ultrasound-guided injection techniques for joints and soft tissues.

**Brand name rationale:** Short, 3-syllable name (SO-no-in-JEK-shun) that reads naturally in:
- 🇹🇷 Turkish: "SO-no-in-JEK-shun" — phonetically natural
- 🇩🇪 German: "moo-ZO-na" — natural with voiced s
- 🇬🇧 English: "SO-no-in-JEK-shun" — natural

**Sources:** No external Figma, codebase, or slide deck was provided. This design system was created from scratch based on the product brief.

---

## CONTENT FUNDAMENTALS

### Voice & Tone
- **Professional and precise**, never cold. SonoInjection speaks like an expert colleague, not a corporation.
- **Confidence-building.** Language emphasizes skill gain, precision, and clinical relevance. "You will master…" not "Participants may learn…"
- **Concise and purposeful.** No fluff. Every word earns its place.
- **International-neutral English.** Avoids idioms that don't translate well. Clean, direct prose.

### Casing & Grammar
- Course name: **SonoInjection** (always all-caps)
- Headings: Title Case for section headers, Sentence case for body headings
- No emoji in formal contexts (course materials, certificates, invitations)
- Abbreviations spelled out on first use: Musculoskeletal (MSK), Physical Medicine & Rehabilitation (PM&R)

### Person & Perspective
- **Second-person "you"** in course marketing and participant materials: "You will perform…"
- **First-person plural "we"** for the SonoInjection team in faculty bios and communications
- Avoid passive voice where possible

### Copy Examples
> "Practice precision. Build confidence. Treat with certainty."

> "SonoInjection brings together expert faculty and real cadaveric anatomy to accelerate your ultrasound-guided injection skills."

> "From shoulder to ankle — you will leave SonoInjection ready to inject with accuracy."

---

## VISUAL FOUNDATIONS

### Color Philosophy
SonoInjection's palette draws from the visual world of diagnostic ultrasound: the deep near-black background of an ultrasound screen, the teal/cyan echo highlights, warm amber for human warmth, and clean white for clinical clarity.

- **Navy** `#0C1B33` — Primary background, headers, dominant surfaces. Deep, authoritative.
- **Teal** `#0AADA8` — Primary brand accent. Echoes ultrasound imaging hues.
- **Amber** `#E8A84A` — Human warmth accent. Used sparingly for highlights, CTAs.
- **Slate** family — Neutral midtones for body copy, borders, cards.
- **White/Off-white** `#F7F9FC` — Clean backgrounds, cards, breathing room.

### Typography
- **Display:** Space Grotesk — geometric, precise, medical-grade authority. Used for hero headings, section titles.
- **Body:** DM Sans — open, warm, highly legible for body text, labels, UI.
- **Mono:** JetBrains Mono — data, statistics, course codes, accreditation numbers.
- Scale follows a Major Third (1.25×) modular system.
- Line height: 1.5× for body, 1.1–1.2× for display.
- Letter spacing: slightly tracked (+0.02em) for uppercase labels.

### Spacing System
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
- Section padding: 96px vertical, 64px horizontal (desktop)

### Background Approach
- **Hero:** Deep navy `#0C1B33` with subtle ultrasound-wave SVG pattern overlay (low opacity teal lines)
- **Sections:** Alternates between white `#F7F9FC` and very light slate `#EEF1F6`
- **Dark sections:** Navy for feature callouts and testimonials
- No gradient backgrounds (clean, clinical)
- Subtle grain texture (5% opacity) on dark hero sections for tactility

### Cards
- Background: `#FFFFFF`, border: `1px solid #E2E8F0`, border-radius: `12px`
- Box shadow: `0 2px 12px rgba(12,27,51,0.08)`
- Hover: shadow lifts to `0 8px 32px rgba(12,27,51,0.14)`, translate -2px
- Padding: 32px

### Animation & Interaction
- Easing: `cubic-bezier(0.25, 0.1, 0.25, 1)` (ease) for most transitions
- Duration: 200ms hover states, 300ms page transitions, 500ms for large reveals
- No bouncy/springy animations — clinical precision
- Hover states: slight shadow lift + subtle translate-y(-2px) for cards
- Button press: scale(0.97) for 100ms
- No heavy scroll-triggered animations; subtle fade-in on scroll acceptable

### Borders & Radius
- Buttons: `border-radius: 8px`
- Cards: `border-radius: 12px`
- Pills/badges: `border-radius: 999px`
- Input fields: `border-radius: 8px`
- Large hero containers: `border-radius: 16px`

### Imagery
- Clinical, documentary photography style — real cadaver labs, ultrasound probe in hand, focused clinicians
- Color grade: slightly cool-neutral, not oversaturated
- No stock photography clichés (no fake smiling doctors)
- Medical diagrams: clean line-art style in navy/teal palette
- No grain on photographs; grain only on dark hero backgrounds

### Iconography Approach
- Line icons, 1.5px stroke weight, rounded caps and joins
- Lucide Icons (CDN) as primary system — see ICONOGRAPHY section
- Icon sizes: 16px inline, 20px UI, 24px feature icons, 48px hero icons

### Shadows (Elevation System)
- Level 0: no shadow (flat)
- Level 1: `0 1px 4px rgba(12,27,51,0.06)` — resting cards
- Level 2: `0 2px 12px rgba(12,27,51,0.08)` — default cards
- Level 3: `0 8px 32px rgba(12,27,51,0.14)` — hover/raised
- Level 4: `0 16px 48px rgba(12,27,51,0.20)` — modals, dropdowns

### Use of Transparency & Blur
- Glass/blur effects only for overlaid navigation on hero sections
- `backdrop-filter: blur(12px)` with `rgba(12,27,51,0.6)` tint
- Sparingly — only when content beneath warrants it

---

## ICONOGRAPHY

SonoInjection uses **Lucide Icons** (https://lucide.dev) via CDN for all UI iconography. Lucide provides clean 1.5px stroke, 24×24 viewBox SVG icons that match the brand's precise, uncluttered aesthetic.

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
```

Key icons in use:
- `stethoscope` — medical context
- `scan-line` — ultrasound scanning
- `syringe` — injection procedures
- `user-check` — certified participants
- `calendar` — scheduling
- `map-pin` — location
- `award` — accreditation/certificate
- `book-open` — curriculum
- `users` — faculty/community
- `check-circle` — learning outcomes

No emoji used in brand contexts. No custom hand-rolled SVG illustrations — placeholders used instead.

Logos and brand marks are in `assets/`.

---

## FILE INDEX

```
README.md                     ← This file (brand overview + guidelines)
SKILL.md                      ← Agent skill invocation file
colors_and_type.css           ← CSS custom properties (design tokens)

assets/
  logo.svg                    ← SonoInjection wordmark + icon
  logo-dark.svg               ← Reversed (white) wordmark
  favicon.svg                 ← Favicon mark

preview/
  color-primary.html          ← Primary palette swatches
  color-neutral.html          ← Neutral/slate palette
  color-semantic.html         ← Semantic color roles
  type-display.html           ← Display type specimens
  type-body.html              ← Body + mono specimens
  type-scale.html             ← Full type scale
  spacing-tokens.html         ← Spacing scale + tokens
  elevation-shadows.html      ← Shadow elevation levels
  buttons.html                ← Button states
  badges-tags.html            ← Badges, tags, pills
  form-inputs.html            ← Form fields + states
  cards.html                  ← Card components
  navigation.html             ← Nav bar component
  logo-usage.html             ← Logo variants + clear space

ui_kits/
  website/
    README.md                 ← Website kit overview
    index.html                ← Interactive website prototype
    Header.jsx                ← Nav + hero header
    CourseCard.jsx            ← Course listing card
    FacultyCard.jsx           ← Faculty bio card
    ScheduleBlock.jsx         ← Schedule/agenda block
    Footer.jsx                ← Footer component
```
