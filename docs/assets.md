# Asset Plan

Status: draft for review. No final assets exist yet.

This document lists every asset the portfolio needs, where each one appears, its specifications, sourcing options, and licensing constraints. The cinematic background (A1) and project card art (A2) are **early visual decisions**. They are made in Phase 1 of `docs/implementation-plan.md`, before homepage components are built.

## Why artwork comes first

The reference screens get their quality from rendered or painted art: volumetric light, atmospheric haze, depth of field, and a clear focal subject. CSS gradients and procedural SVG can reproduce the UI geometry (tabs, notches, rules, frames) and can enhance lighting. They cannot replace a key art image. Therefore:

- The homepage is designed around a **real image** with a defined composition, not around decoration that we hope will look cinematic.
- Procedural SVG and CSS are limited to UI geometry, the grain overlay, and optional light enhancement on top of the key art.
- If no final art exists when Milestone 1 starts, a **stand-in image** may be used only if it matches the approved composition (focal position, value structure, safe zones). The stand-in is clearly labelled in `src/content` and in this file.

## Hard licensing rules

- Do not use any Riot Games or VALORANT assets: agent art, maps, weapon skins, icons, logos, the "V" mark, UI screenshots, sounds, or Riot's typefaces. The reference screenshots in `references/` are local-only and gitignored.
- Do not use Google or Gmail logos as decoration. Gmail may be named in text only, following Google's brand guidelines.
- Every asset needs a recorded source and license in the inventory below before it ships.
- Client work (Recolm) is shown only with written permission recorded in the inventory.

## A1. Cinematic background (key art)

**Placement.** Full-bleed homepage background (layers L1 and L2 in `docs/design.md`). A darker, blurred derivative can be reused as the backdrop for inner page headers.

**Composition requirements.**

| Requirement | Desktop crop (landscape) | Mobile crop (portrait) |
|-------------|--------------------------|------------------------|
| Master size | 3840 x 2160 | 1290 x 2796 |
| Focal point | x about 66%, y about 30% (behind the center project card) | x about 50%, y about 22% (behind the name) |
| Text safe zone | Left 40%: dark, low detail, mostly navy | Bottom 60%: fades to solid `#0B1220` |
| Light source | One vertical or slightly angled beam from the top, warm gold core with a cool haze falloff | Same beam, cropped |
| Value structure | Roughly 80% of the frame in dark values; the brightest values only near the focal point | Same |
| Palette | Navy and blue-black base; gold highlights; small teal practical lights; coral only as a tiny accent, if at all | Same |
| Depth | At least three readable planes (foreground silhouette or floor, mid-ground subject, far haze) | Same |

**Direction options** (decision required):

1. **Emblem-led (recommended).** A sculptural, original JV monogram or abstract emblem standing under the beam in a hazy architectural space. This is a direct analogue of the Rank Legacy emblem. It can be fully owned when produced in Blender, needs no photoshoot, and reads as "identity" without competing with the project cards.
2. **Environment-led.** An original architectural or lab-like space with no central object; the beam lands on the floor behind the lineup. Simpler to produce, but it risks feeling generic.
3. **Portrait-led.** A professionally lit photo of Joshua (teal or coral rim light), cut out and placed in the scene like an agent in the lobby. It is the most personal option, but it needs a photoshoot and careful compositing. It also competes with the project cards for focus, so the portrait may work better on the About page.

**Sourcing options.**

| Option | Ownership | Notes |
|--------|-----------|-------|
| Self-render in Blender | Full | Recommended for emblem-led. Use Eevee or Cycles with volumetrics; export EXR, then grade. The `.blend` master stays outside Git or in Git LFS. |
| Commission an artist | Full, by contract | Highest ceiling. Needs a written license transfer or exclusive usage grant. |
| Licensed stock (Unsplash, Pexels, Adobe Stock) | License only | Good for environment-led. Requires heavy color grading. Check that the license allows web use without attribution or with attribution in the footer. |
| AI image generation | Varies by tool and terms | Joshua's decision. It needs a record of the tool's commercial terms, and generated output may not be copyrightable. It is not recommended as the final hero for a portfolio about original work, but it is acceptable for quick composition studies in Phase 1. |

**Delivery.** AVIF and WebP at 1920w and 2880w (desktop) and 828w and 1290w (mobile), served through `<picture>` with art direction. Target under 350 KB for the desktop 1920w AVIF. Provide a low-quality blur placeholder.

## A2. Project card art

**Placement.** The art area of each tall ProjectCard on the homepage (2:3 on desktop, 4:5 on mobile), reused as the case study header art.

**Requirements.**

- Master 1200 x 1800 (2:3). The key subject sits in the central 70% width and upper 60% height, so it survives the 4:5 mobile crop and the title overlay at the bottom.
- Same lighting language as A1: dark base, single light direction (from the top), consistent grade across all three cards.
- Exports: AVIF and WebP at 480w and 900w. Target under 120 KB each.

**Approach options** (decision required):

1. **Real product captures (recommended where available).** Actual screenshots of Hermes and Recolm, framed at a slight angle on a graded navy backdrop. This is the strongest evidence for recruiters. It requires that the screenshots contain no private data (emails, user names), and for Recolm it requires client permission.
2. **Abstract project emblems.** An original symbol per project, rendered in the A1 style. Use this when screenshots are unavailable or private.
3. **Mixed.** Captures where possible and emblems elsewhere, unified by the same backdrop and grade.

**Per project.**

| Project | Preferred art | Constraint |
|---------|---------------|------------|
| Project Hermes | Real UI capture of the agent workspace | Redact any real Gmail content; no Gmail logo |
| Recolm | Real listing UI capture | Requires client permission (unknown) |
| Valorant ML | Original charts or plots from the research, styled in the site palette | No Riot art, maps, or logos; dataset source and terms must be confirmed |

## A3. Brand marks

| Asset | Spec | Placement | Source |
|-------|------|-----------|--------|
| JV monogram | SVG, single color, readable at 20px | BrandSlab, favicon, OG image | Design original (angular cut, about 14-degree geometry) |
| Wordmark | "JOSHUA VENEGAS" in Barlow Condensed 700 | BrandSlab | Typeset; no custom file needed |
| Favicon set | `icon.svg`, 32px PNG, 180px Apple touch icon | `src/app` metadata | Derived from the monogram |
| Open Graph image | 1200 x 630 PNG | Social previews | Composed from A1 plus name; can be generated with `next/og` |

## A4. Documents and photography

| Asset | Status | Placement |
|-------|--------|-----------|
| Résumé PDF | **Missing**, needs Joshua | `public/resume/joshua-venegas-resume.pdf`; linked from the top bar, hero, and Contact |
| Headshot | **Missing**, optional | About page; also needed if portrait-led key art is chosen |
| Project screenshots | **Missing** | Case study pages (evidence sections) |
| Architecture diagrams | **Missing** | Case study pages; can be produced as original SVG |

## A5. Typography and icons

| Asset | License | Notes |
|-------|---------|-------|
| Barlow Condensed | SIL OFL 1.1 | Display; self-hosted through `next/font/google` |
| Inter | SIL OFL 1.1 | Body and UI |
| JetBrains Mono | SIL OFL 1.1 | Labels and metadata |
| Lucide icons | ISC | UI icons (menu, arrow, external link, download) |
| Simple Icons | CC0 (brand marks remain trademarks of their owners) | GitHub and LinkedIn marks, following each brand's guidelines |

## A6. Textures and generated decoration

| Asset | Source | Notes |
|-------|--------|-------|
| Film grain | Generated (SVG `feTurbulence` exported to a tiled PNG) | 3 to 4% opacity overlay; fully owned |
| Hairline frame lines, notches, beam enhancement | CSS and inline SVG | UI geometry only; not a substitute for A1 |

## Content needed from Joshua

These are not art, but the design depends on them. Nothing below will be invented.

- Résumé PDF and permission to publish it.
- Public contact method (email or form), plus GitHub and LinkedIn URLs to display.
- Dates for the AI Lab team leader role and the founding of JV Digital, if they should be shown.
- Expected graduation date, if it should be shown.
- For each project: problem, Joshua's role, team size, stack, key implementation decisions, evidence (repository, demo, screenshots, write-up), and outcomes. Outcomes must be real; omit metrics that cannot be supported.
- Recolm: written client permission to name the client and show screenshots.
- Valorant ML: data source and its terms, whether the work is public, and whether results can be shared.
- Approval of the one-sentence hero role line.

## Asset inventory

Update this table as assets are produced or sourced. An asset ships only when its license column is filled.

| ID | Asset | Status | Source | License | Notes |
|----|-------|--------|--------|---------|-------|
| A1-desktop | Key art, landscape | Not started | TBD | TBD | Direction decision pending |
| A1-mobile | Key art, portrait | Not started | TBD | TBD | |
| A2-hermes | Hermes card art | Not started | TBD | TBD | |
| A2-recolm | Recolm card art | Not started | TBD | TBD | Client permission pending |
| A2-valml | Valorant ML card art | Not started | TBD | TBD | |
| A3-monogram | JV monogram SVG | Not started | Original | Owned | |
| A4-resume | Résumé PDF | Missing | Joshua | Owned | |
