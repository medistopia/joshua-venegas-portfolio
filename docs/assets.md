# Asset Plan

Status: Phase 1 in review. Study art exists for three background candidates; no final assets exist yet.

This document lists every asset the portfolio needs, where each one appears, its specifications, sourcing options, and licensing constraints. The cinematic background (A1) and project card art (A2) are **early visual decisions**, made in Phase 1 of `docs/implementation-plan.md` before homepage components are built.

## Why artwork comes first

The reference screens get their quality from rendered or painted art: volumetric light, atmospheric haze, depth of field, and a clear focal subject. CSS gradients and SVG reproduce the UI geometry (tabs, notches, rules, pennant cards) and can protect text with scrims. They do not replace a key art image. Phase 1 confirmed this: the code-rendered candidate (C) is clean and fully owned, but it reads as graphic rather than cinematic next to the two painterly candidates.

## Hard licensing rules

- Do not use any Riot Games or VALORANT assets: agent art, maps, weapon skins, icons, logos, the "V" mark, UI screenshots, sounds, or Riot's typefaces. The reference screenshots in `references/` are local-only and gitignored.
- Do not use Google or Gmail logos as decoration. Gmail may be named in text only, following Google's brand guidelines.
- Every asset needs a recorded source and license in the inventory below before it ships.
- AI-generated images are allowed for composition studies. Shipping one requires Joshua's explicit decision, a record of the generating tool's terms, and acceptance that the output may not be protected by copyright.
- Client work (Recolm) is shown only with written permission recorded in the inventory.

## What can be produced with the tools available now

Blender, purchased art, and commissions are **not** prerequisites. This is what the current toolset (Cursor image generation, Python with NumPy and Pillow, SVG, CSS, and Playwright) can and cannot deliver:

| Asset | Can produce now? | Notes |
|-------|------------------|-------|
| Composition-study key art | Yes | Done: candidates A and B (AI-generated) and C (Python render). |
| Final-resolution key art, AI route | Partly | The image tool outputs about 1280 x 720 (and 720 x 1280). The desktop hero needs at least 2880 x 1620 for sharp display on high-density screens. Upscaling is possible but soft; regenerating the same scene consistently is unreliable. |
| Final-resolution key art, owned route | Yes, at lower fidelity | `scripts/art/render_backdrop.py` renders any size and is fully owned and reproducible, but it reads less cinematic and needs more work to match A or B. |
| JV monogram and emblem | Yes (draft) | `src/components/brand/Monogram.tsx`. Needs Joshua's review before it becomes the brand mark. |
| Favicon set and Open Graph image | Yes | Derived from the monogram (and approved art) with `next/og`; planned for Phase 5. |
| Grain texture, UI geometry, labelled placeholders | Yes | Already used in the study. |
| Valorant ML research charts | Only with real data | Charts can be generated in the site palette once Joshua provides results or data. Nothing is drawn from invented numbers. |
| Hermes and Recolm product captures | Only with Joshua's go-ahead | Possible with Playwright against running builds, but each needs a working local or hosted environment, sanitized data (no real email content or user names), and, for Recolm, client permission. |
| Résumé, contact links, headshot | No | These come from Joshua. |

## A1. Cinematic background (key art)

**Decided direction.** A dark architectural scene with atmospheric depth and **one warm light source** that lands behind the lead project card, with a subtle original JV emblem behind the lineup. The emblem stays subordinate to the lineup: it is an SVG layer at about 20% opacity, mostly hidden by the cards, so it is identical across candidates and never baked into the art.

**Placement.** Full-bleed homepage background (layers L1 and L2 in `docs/design.md`). A darker, blurred derivative can back the inner page headers.

**Composition requirements.**

| Requirement | Desktop crop (landscape) | Mobile crop (portrait) |
|-------------|--------------------------|------------------------|
| Final master size | At least 2880 x 1620 | At least 1290 x 2796 |
| Focal point | x about 56% (lineup center), above the card tops | x about 50%, y about 13% (top art band) |
| Text safe zone | Left 38%: dark and low in detail; a fixed scrim adds protection | Below about 24% of the height: fades to solid `#0B1220` |
| Light source | One warm beam from above; gold core with a cool haze falloff | Same beam, cropped into the top band |
| Value structure | About 80% of the frame in dark values; the brightest values only near the focal point | Same |
| Palette | Navy and blue-black base, warm gold light, small teal rim lights; no coral | Same |
| Depth | At least three planes: floor, mid-ground light and architecture, far haze | Same |
| Contrast | Hero text at least 4.5:1 against the 98th-percentile background luminance in the safe zone (measured by `scripts/art/measure_safe_zone.py`) | Same |

**Phase 1 candidates.** Previews and measurements are in `docs/verification/phase-1/README.md`.

| Candidate | Source | Strengths | Weaknesses |
|-----------|--------|-----------|------------|
| A. Atrium | AI-generated (Cursor image tool) | Vertical skylight shaft frames the lead card; strong depth from angled fins with teal rim light; best contrast on every viewport | 1280 x 720 source is soft at 1440 wide; licensing decision needed |
| B. Gallery | AI-generated (Cursor image tool) | Diagonal beam echoes the lobby's gold streaks; dramatic reflective floor | Light source sits at the upper right over the Valorant ML card and panel stack, not behind the lead card; mobile eyebrow contrast is marginal |
| C. Procedural hall | `scripts/art/render_backdrop.py` | Fully owned, any resolution, exact control of the focal point | Graphic rather than cinematic; the beam is mostly hidden behind the lead card; the mobile eyebrow fails contrast (3.4:1) as rendered |

**Paths to a final A1 asset** (decision required):

1. Ship the approved AI-generated scene after upscaling, with its terms recorded. Fastest, but softest and least certain on licensing.
2. Use the approved candidate as a brief for an artist or a photographer, or for a later Blender render, if Joshua chooses to invest in one. Highest quality; optional.
3. Improve the procedural renderer toward the approved candidate's lighting (wider haze, a visible shaft above the cards, more surface texture). Fully owned; quality ceiling is lower.

**Delivery.** AVIF and WebP at 1920w and 2880w (desktop), 828w and 1290w (mobile), through `<picture>` art direction. Target under 350 KB for the 1920w desktop AVIF.

## A2. Project card art

**Decided approach.** Real product captures where available; original research charts for Valorant ML; clearly labelled composition placeholders for anything missing. Placeholders never imitate a product interface.

**Placement.** The art area of each ProjectCard (top 56% of the card), reused as case study header art.

**Requirements.**

- The art area is about 0.9:1 on desktop (260 x 291 on the 1440 x 900 lead card) and about 1.4:1 on mobile (the top of a 4:5 card). Supply a **1800 x 1800 master** with the key subject inside the central 60% so both crops work.
- Captures are framed on a dark navy backdrop with the same warm, top-down light as A1, and graded consistently across all three cards.
- Exports: AVIF and WebP at 600w and 1200w. Target under 120 KB each.

**Per project.**

| Project | Planned art | Status | Constraint |
|---------|-------------|--------|------------|
| Recolm (left) | Real listing UI capture | Missing. The Recolm repository's `public/listing-photos` are listing showcase images, not captures of the product UI. | Client permission required before any capture is published |
| Project Hermes (center, lead) | Real UI capture of the agent workspace | Missing | Redact any real email content; no Gmail logo |
| Valorant ML (right) | Original chart or plot from the research, in the site palette | Missing | Needs real results or data; data source terms must be confirmed; no Riot art, maps, or logos |

## A3. Brand marks

| Asset | Spec | Placement | Status |
|-------|------|-----------|--------|
| JV monogram | SVG, single color, readable at 20px | Brand slab, favicon, Open Graph image | Draft in `src/components/brand/Monogram.tsx` |
| JV emblem | Monogram inside a faceted frame, lit gradient | Behind the lineup (L3) | Draft, same file (`variant="emblem"`) |
| Wordmark | "JOSHUA VENEGAS" in Barlow Condensed 700 | Brand slab | Typeset; no file needed |
| Favicon set | `icon.svg`, 32px PNG, 180px Apple touch icon | App metadata | Planned (Phase 5) |
| Open Graph image | 1200 x 630 PNG | Social previews | Planned (Phase 5) |

## A4. Documents and photography

| Asset | Status | Placement |
|-------|--------|-----------|
| Résumé PDF | Needs Joshua's approval to publish | `public/resume/joshua-venegas-resume.pdf`; linked from the top bar, hero, and Contact |
| Headshot | Missing, optional | About page |
| Project screenshots | Missing | Case study evidence sections |
| Architecture diagrams | Missing | Case studies; can be produced as original SVG once the architecture is described |

## A5. Typography and icons

| Asset | License | Notes |
|-------|---------|-------|
| Barlow Condensed | SIL OFL 1.1 | Display; self-hosted through `next/font/google` |
| Inter | SIL OFL 1.1 | Body and UI |
| JetBrains Mono | SIL OFL 1.1 | Labels and metadata |
| Lucide icons | ISC | UI icons (menu, arrow, external link, download), when needed |
| Simple Icons | CC0 (brand marks remain trademarks of their owners) | GitHub and LinkedIn marks, following each brand's guidelines |

## A6. Textures and generated decoration

| Asset | Source | Notes |
|-------|--------|-------|
| Film grain | Inline SVG `feTurbulence` (the `grain` utility in `src/app/globals.css`) | 7% overlay; fully owned |
| Scrims, hairlines, notches, pennant shapes | CSS and inline SVG | UI geometry only; not a substitute for A1 |

## Content needed from Joshua

Nothing below will be invented.

- Approval to publish the résumé PDF.
- Public contact method (email or form), plus GitHub and LinkedIn URLs to display.
- The AI Lab's host organization and the dates for that role and for JV Digital, if they should be shown.
- For each project: problem, Joshua's role, team size, stack, key implementation decisions, evidence (repository, demo, screenshots, write-up), and real outcomes.
- Recolm: written client permission to name the client and show screenshots.
- Valorant ML: results or data for the charts, the data source and its terms, and whether the work can be shared.

## Asset inventory

An asset ships only when its license column is filled and Joshua has approved it.

| ID | Asset | Status | Source | License | Notes |
|----|-------|--------|--------|---------|-------|
| A1-study-a | Atrium, desktop and mobile | Study only | Cursor image tool | Pending decision | `public/art/study/candidate-a-*` |
| A1-study-b | Gallery, desktop and mobile | Study only | Cursor image tool | Pending decision | `public/art/study/candidate-b-*` |
| A1-study-c | Procedural hall, desktop and mobile | Study only | `scripts/art/render_backdrop.py` | Owned | `public/art/study/candidate-c-*` |
| A1-final | Key art, both crops | Not started | Depends on the A1 decision | TBD | |
| A2-recolm | Recolm card art | Missing | Capture | TBD | Client permission pending |
| A2-hermes | Hermes card art | Missing | Capture | Owned once captured | Sanitize data |
| A2-valml | Valorant ML chart | Missing | Generated from real results | Owned | Data terms pending |
| A3-monogram | JV monogram and emblem | Draft | Original | Owned | Needs Joshua's review |
| A4-resume | Résumé PDF | Awaiting approval | Joshua | Owned | |
