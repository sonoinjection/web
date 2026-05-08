---
name: sonoinjection-design
description: Use this skill to generate well-branded interfaces and assets for SonoInjection, an ultrasound-guided cadaver injection course for musculoskeletal pathologies targeting physiatrists, orthopedic surgeons, and physiotherapists. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick Reference

**Brand name:** SonoInjection (always all-caps)
**Full form:** Sono + Injection + Academy
**Pronunciation:** SO-no-in-JEK-shun (Turkish/German), SO-no-in-JEK-shun (English)

**Primary colors:**
- Navy: `#0c1b33` — dark backgrounds, headings
- Teal: `#0aada8` — brand accent, CTAs, links
- Amber: `#e8a84a` — warm accent, highlight CTAs

**Fonts:**
- Display: Space Grotesk (Google Fonts)
- Body: DM Sans (Google Fonts)
- Mono: JetBrains Mono (Google Fonts)

**Key design rules:**
- No gradient backgrounds (clean, clinical)
- No emoji in formal contexts
- 4px spacing base unit
- Cards: 12px radius, shadow-2 resting, shadow-3 hover
- Buttons: 8px radius
- Always use `text-wrap: pretty` for body text
- Nav is sticky, 64px tall

**Assets:** `assets/logo.svg`, `assets/logo-dark.svg`, `assets/favicon.svg`
**CSS tokens:** `colors_and_type.css`
**UI kit:** `ui_kits/website/index.html`
