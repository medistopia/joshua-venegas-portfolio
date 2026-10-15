# Design Specification

Status: Phase 1 approved. Candidate A (Atrium) is the visual direction, and its current background is an interim asset until final-resolution art is produced. Milestone 1 (homepage) builds on this document.

This document defines the visual system and homepage composition for Joshua Venegas's portfolio. The design is inspired by the VALORANT client's menu screens. It is an original identity built on Joshua's name, and it uses no Riot Games artwork, logos, icons, fonts, or screenshots in the shipped interface.

## 1. Design intent

The portfolio should feel like a carefully built game client lobby but read like a professional document. A recruiter should be able to answer three questions within ten seconds of landing:

1. Who is this, and what does he build? (Name, role line, affiliations.)
2. What is the best evidence? (Three featured projects, one click from the homepage.)
3. How do I get the résumé or get in touch? (Persistent résumé and contact actions.)

The game-client language supports these goals. It does not replace them. Specifically:

- No fake game statistics. Ranks, XP, levels, or "skill bars" must not be invented. Gamified structure (tabs, lineups, panels) is allowed; gamified numbers are not, unless they are real and sourced.
- Every visual flourish must leave text contrast and scanning speed intact.

## 2. Reference analysis

Twelve reference screenshots of the VALORANT client are available: the Play lobby (00) plus eleven other menu screens (01 to 11). These are the only references counted here; each one was inspected directly. They are design references only. They stay local in `references/valorant/` (gitignored) and must never be committed or shipped.

An earlier draft of this document said that no Play lobby screenshot had been supplied. That was wrong: the lobby image existed in the local image cache but had not been attached to the planning conversation. It is now reference 00 and the **primary reference for the homepage composition**.

### 2.1 Primary reference: the Play lobby (00)

| Element | Observation | Portfolio use |
|---------|-------------|---------------|
| Lineup | Five tall pennant-shaped slots across the center. The middle slot (the player's card) is raised, brighter, and framed; flanking slots start lower and recede in depth. Center card is about 1:2.3 including its level badge. | Three-card lineup: Recolm, Hermes (raised lead), Valorant ML. |
| Card anatomy | Level badge centered on the top edge; full-height art; a teal "Ready" bar; name in gold; inner chevron line and gold corner accents at the pointed base. | Index badge on top edge, art area, teal rule on the lead card, title, chevron line at the base. |
| Left column | Event title in large condensed type at top-left, then a stacked mode card and option rows. | Identity block: eyebrow, name, headline, résumé and contact actions. |
| Right column | Stack of image-backed news tiles in decreasing height. | Panel stack: Experience, About, Contact, each with one confirmed line. |
| Primary action | A single coral "Find Match" button centered below the lineup, framed by a thin outline. | One coral "Explore projects" action below the lineup. |
| Atmosphere | Near-black base, gold diagonal light streaks behind the lineup, gold corner diagonals, and a faint emblem under the center card. | Dark architectural scene, one warm light behind the lead card, a subtle JV emblem behind the lineup. |
| Chrome | Off-white "PLAY" slab (active state), icon tabs, wallet, social rail, "Party:" strip at bottom-left. | Coral brand slab, text tabs, résumé action, "Currently" status strip. |

### 2.2 Supporting references

| # | Screen | What to learn from it |
|---|--------|-----------------------|
| 1 | Collection | Dense grid of tiles with 1px low-opacity borders; selected tile uses a teal border plus a teal-tinted gradient fill; centered condensed uppercase section headings; tall player card (about 1:2.5) with a gold notched chevron base. |
| 2 | Career / Rank Overview | Three-column layout: framed left panel, central focal object (triangle), stacked right panels with small uppercase headers and thin divider rules. Sub-navigation tabs with an underline for the active tab. |
| 3 | Career / Rank Legacy | Strongest focal-point example: one emblem under vertical top-down light beams, huge display type ("V26 // ACT VI") offset left, and thin horizontal frame lines that create depth bands. |
| 4 | Career / Accolades | Hexagonal tiles; inactive items fade to low opacity instead of disappearing; small count badges attached to tile edges. |
| 5 | Agents | Character art as the focal subject at center, giant ghosted name typography behind it, saturated atmospheric background, info panel at right with icon tabs, and an outlined secondary button ("View Mastery"). |
| 6 | Career / Overview | Tall portrait cards with a diagonal colored accent bar and a level badge; match-history rows tinted coral (defeat) or teal (victory). Shows how semantic color can be applied as low-opacity row washes. |
| 7 | Store | Featured banner with a 2px teal frame, large condensed title, white filled price button, and carousel progress bars; row of four offer cards with diagonal-stripe backgrounds; category buttons beneath. |
| 8 | Career / Map Rating | Left list of image-backed rows; quadrant stat tiles; honest empty states ("--", "still calibrating") instead of fake values. This is useful for missing content. |
| 9 | Esports | Black and gold palette; large logotype left; schedule rows ("Next up") with dense, aligned metadata. Shows how gold can lead without becoming garish. |
| 10 | Premier Hub | Warm gold-on-brown atmosphere; vertical schedule cards with a gold left-edge accent; giant centered title ("BIND") with a single gold call-to-action; roster panel at right. |
| 11 | Progression | Missions panel and battle-pass panel; thin teal progress bars; white filled primary button; restrained use of a single hero object inside a framed panel. |

Patterns shared across all screens:

- Top bar, about 48 to 56px tall: a "PLAY" slab with an angled right edge at far left (coral on other screens, off-white when the Play tab is active); icon tabs where the active tab becomes a solid off-white parallelogram with a dark icon; wallet and settings at right.
- Small uppercase breadcrumb under the bar ("COLLECTION", "CAREER").
- Persistent right social rail and a bottom-left status strip ("Party:").
- Surfaces are translucent navy over the atmospheric background, separated by hairline borders rather than shadows. Corners are square or notched, never rounded.
- Typography is condensed, uppercase, and tightly tracked for display; small spaced caps for labels.
- Accent colors are rationed: teal means selected or progress, coral means primary action or loss, gold means prestige or competitive context.

## 3. Composition

The homepage is the lobby shell in Section 3.6. Sections 3.1 to 3.4 describe Milestone 1's first homepage (a hero, lineup, and panel stack with sections below the fold) and are kept as the record of that design; where they differ from Section 3.6, Section 3.6 applies. The lineup order rules in Section 3.5 still hold.

### 3.1 Concept: "The Lobby"

The homepage is staged like the Play lobby (reference 00):

- The **identity block** (eyebrow, name, headline, résumé and contact actions) takes the place of the lobby's left column: top-left, the first thing read.
- The **three featured projects** form the **lineup** at center: **Recolm** (left), **Project Hermes** (center, raised lead card), **Valorant ML** (right). In the document, the lineup is an ordered list by priority (Hermes, Recolm, Valorant ML); desktop CSS places Hermes in the center (see Section 3.5).
- A **panel stack** at right mirrors the lobby's news tiles: Experience, About, Contact.
- One coral **"Explore projects"** action sits centered below the lineup, where "Find Match" sits in the lobby.
- The **cinematic background** is a dark architectural scene with one warm light source that lands behind the lead card, plus a subtle original JV emblem behind the lineup. The emblem stays subordinate: about 20% opacity, mostly hidden by the cards, with only its upper portion visible above them.

Headline (approved): "I build practical software and applied machine learning systems."

### 3.2 Desktop composition (reference viewport 1440 x 900)

```
+----------------------------------------------------------------------------------+
| [JV JOSHUA VENEGAS]/ [HOME] PROJECTS EXPERIENCE ABOUT CONTACT          [RESUME]* |  top bar 56px
|                                  warm key light                                  |
|                              /\  (emblem top, faint)                             |
|                     +-02-+ +--01--+ +-03-+                                       |
| UNG // CS + ML MINOR |    | |      | |    |                         +----------+  |
|                      |ART | | ART  | |ART |                         |EXPERIENCE|  |
| JOSHUA               |    | |      | |    |                         +----------+  |
| VENEGAS              |----| |======| |----|   (lead card: teal rule) |ABOUT     |  |
|                      |RECOLM |HERMES| |VALORANT ML                  +----------+  |
| I build practical    |    | |      | |    |                         |CONTACT   |  |
| software and applied  \  /  |      |  \  /                          +----------+  |
| ML systems.            \/    \    /    \/                                         |
| [RESUME]* [CONTACT] [ABOUT]   \  /                                                |
|                          [ EXPLORE PROJECTS ]                                     |
| CURRENTLY  University of North Georgia, computer science ...                     |  status strip 40px
+----------------------------------------------------------------------------------+
```

\* Résumé actions render only once Joshua approves a published résumé. Until then they are omitted, not disabled.

Grid (1280px and up): three columns inside a 1440px max width with 40px outer padding and 24px gaps: identity `minmax(300px, 360px)`, lineup `minmax(0, 1fr)`, panel stack `minmax(176px, 200px)`.

Compact desktop (1024 to 1279px): two columns, identity `300px` and lineup `minmax(0, 1fr)`, with the three panel tiles in one row beneath both. Three columns do not fit here: at 1100px the lineup column would be about 500px wide, while 520px-tall cards need about 740px.

Card proportions (one rule for every desktop size):

- **Every desktop card is 1:2** (width is half the height), including its pennant point.
- The lead card height is `--card-h = min(clamp(400px, 100svh - 320px, 520px), (lineup column width - 24px) / 1.38)`. The second term keeps the whole lineup (lead 0.5, two flanks 0.44 each, two 12px gaps) inside its column at any width; the lineup section is a CSS size container, so the width comes from `cqw`.
- The fold never hides overflow. If content is taller than the viewport, the fold grows and the page scrolls.
- Flanking cards are 88% of the lead card's height, still 1:2, and start 6% of `--card-h` lower, so they read as set back, as in the lobby.
- Resulting sizes: at 1440 x 900, the lead card is 260 x 520 and the flanks are 229 x 458. At 1280 x 720, the lead card is 200 x 400 and the flanks are 176 x 352.
- Cards are separated by 12px. The art area is the top 56% of each card; the title block sits below a rule (teal on the lead card, hairline on the flanks).

Light and safe zones:

- The key light lands behind the lead card, at about x = 56% of the viewport (the lineup's center) and above the card tops.
- The left 38% of the background is darkened by a fixed scrim and must stay low in detail. It is the text safe zone.
- The panel stack sits on translucent surfaces, so moderate detail behind it is acceptable.
- The bottom status strip mirrors the client's "Party:" strip and holds one confirmed status line.

Below the fold (Milestone 1 keeps these short):

1. **Experience snapshot**: rows styled after match-history rows, using only confirmed roles (AI Lab Team Leader, Founder of JV Digital, UNG computer science student with an ML minor). Dates and the AI Lab's host organization are shown only when confirmed.
2. **About teaser**: two or three sentences and a link to About.
3. **Contact panel**: résumé, email, GitHub, LinkedIn. Only confirmed links render.
4. **Footer**: name, a disclaimer that the site is not affiliated with Riot Games, and source link.

### 3.3 Short laptop composition (1280 x 720)

Height is the constraint. Applied when the viewport is at least 1024px wide and at most 800px tall:

- The display name shrinks one step (see type scale); the headline shrinks from 20px to 18px.
- Cards follow the `--card-h` rule above (lead 200 x 400 at 1280 x 720), keeping the 1:2 ratio. Card text sizes follow the card's own width (container queries), not the viewport height, so small cards get the smaller title and summary at any viewport.
- Outer padding drops to 32px.
- The identity block, all three full cards, and the "Explore projects" action must be visible without scrolling at 1280 x 720.

### 3.4 Mobile composition (390 x 844)

```
+-------------------------------+
| [JV JOSHUA VENEGAS]/   [MENU] |  top bar 56px
|   key light + small emblem    |  art band, about 96px
|   UNG // CS + ML MINOR        |
|   JOSHUA                      |
|   VENEGAS                     |
|   I build practical software  |
|   and applied ML systems.     |
|   [ CONTACT ] [ ABOUT ]       |
|                               |
|   FEATURED WORK               |
|   +----------01-------------+ |
|   |  ART                    | |  cards stack vertically
|   |  PROJECT HERMES         | |  in priority order (4:5);
|   +-------------------------+ |  no horizontal carousel
+-------------------------------+
```

- The background uses a separate portrait crop. The key light and a small emblem sit in a short art band (about 96px) under the top bar; the Phase 1 study used about 27% of the viewport height, which delayed the name and the first card.
- Below the band, a scrim fades the art to solid navy so text never sits on the bright part of the beam. Contrast is verified behind each line of text (Section 10).
- Cards stack vertically in priority order: Hermes, Recolm, Valorant ML, at a 4:5 ratio, full width minus 16px margins.
- The panel stack and status strip are desktop-only. On mobile, the same destinations follow the lineup as the Experience, About, and Contact sections, and the menu links to each page.

### 3.5 Lineup order across layouts

The lineup is an ordered list in priority order: Hermes, Recolm, Valorant ML. This order drives mobile layout, keyboard order, and the screen reader reading order on every viewport. On desktop, CSS `order` places the cards Recolm, Hermes, Valorant ML from left to right, so Hermes sits in the raised center position. Keyboard focus on desktop therefore moves from the lead card to the left card and then to the right card, which matches the visual hierarchy (the raised, framed lead card reads first). Index badges show the priority numbers (Hermes 01, Recolm 02, Valorant ML 03), so the desktop row reads 02, 01, 03 and the focus sequence is visible.
- Navigation collapses into a "Menu" button that opens a full-screen dialog with large angled list items.
- The résumé action stays visible in the hero; contact links repeat at the bottom.

### 3.6 Lobby shell (approved, implemented)

Joshua's review of Milestone 1 asked for the homepage to become a full-screen menu shell that follows the reference's panel placement and hierarchy. He approved the desktop composition in October 2026; the shell, its views, and the tablet and mobile versions are built on it. Results: `docs/verification/lobby/README.md`.

**The shell.** The top bar, the collaborator rail (1024px and up), and the background persist across every view (`src/app/(site)/layout.tsx`). The navigation controls the main stage: each tab is a real link to its own URL, so views are linkable and browser Back works, and the stage between the top bar and the rail is replaced. From 1024px the shell is exactly one viewport tall and `main` scrolls on its own when a view is taller; nothing hides overflow. Below 1024px the page scrolls normally and the footer follows.

| Area | Treatment |
|------|-----------|
| Top navigation | Compact JV slab (monogram only from 1024px; the name stays in the accessible name), then icon-and-label tabs: house, briefcase, badge, person, envelope. The icons are an original set (`src/components/icons/Icons.tsx`). The selected tab keeps the light angled plate. Below 1024px: the full brand slab and the Menu dialog, whose links carry the same icons. |
| Upper-left feature | Image-led "Currently working on" carousel bleeding into the top-left corner, with its right edge cut on the diagonal and traced by gold rules. Slides: Project Hermes (linking to its case study), and the research with Dr. Lai Wei and Dr. Yong Wei. Each slide's text sits on a dark backing (`scrim-text`) that covers the title, description, link, and controls and fades out before the art. Arrows, diamond indicators, and a labelled Pause/Play control. It rotates every 8 seconds (Section 8); inactive slides are `inert`. |
| Left utility panel | Eyebrow, name (`--text-display-m`, 40px; the page's `h1`), roles on separate lines, headline, then About and Contact rows. The résumé row appears once confirmed. |
| Center stage | Three art-led pennants, Hermes leading. Flanks are 0.9 of the lead and tuck 16px behind it. Each card shows artwork, a short context label, and the title; summaries live in the project view. Explore projects sits beneath. |
| Right feature column | Three promotional tiles sized to the lead pennant (the first one taller): the Hermes Phase 1 release, the AI Lab role, and education. |
| Far-right rail | Collaborators: Brandon Hall, Dr. Lai Wei, Dr. Yong Wei, Prof. Mohammad Mohebi, each listed with their approval. Initials stand in for portraits. Each opens a popover (a labelled dialog anchored beside the rail) with the relationship and any confirmed links. There is no online status. |

**Lobby sizes.** The lead height is `--pennant-h = min(clamp(400px, 100svh - reserve, 540px), (stage width + 32px) / 1.4)`, where the row is a lead 0.5 x height wide and two flanks 0.45 x height that tuck 16px behind it. The lobby (`.lobby` in `src/app/globals.css`) is the size container, so the pennants and the tile column resolve the same value; the stage width is written in container units as the lobby's content width less the other columns and gaps.

| Range | Lobby layout |
|-------|--------------|
| 1280px and up | Three columns: feature and identity (300px), stage, tiles (208px), with 32px gaps. Reserve 300px. At 1440 x 900 the lead is 270 x 540; at 1280 x 720, 210 x 420. |
| 1024 to 1279px | Feature and identity (280px) beside the stage; the tiles form one row beneath both. Reserve 440px, so the tile row fits. The carousel keeps its 248px height (the Project Hermes description runs to five lines in this column) with a smaller slide title, and the gap above the About and Contact rows tightens to 16px. |
| 640 to 1023px | One column: feature, identity, the seated pennant row (Recolm, Hermes, Valorant ML), tiles in a row of three, then a collaborator section. |
| below 640px | One column: feature, identity, pennants stacked at 4:5 in priority order (Hermes first), tiles stacked, then the collaborator section. |

**Views.** Every view other than the lobby dims the background further so long text reads over a quiet hall.

| View | Content |
|------|---------|
| Projects (`/projects`) | "Select a project": all five projects as pennants in priority order (featured work, then the two experiments), Hermes selected. |
| Case study (`/projects/[slug]`) | From 1024px, a project list on the left and a reading panel that scrolls inside the shell, so the navigation stays visible. The panel holds the banner art, description, status, milestones, collaborators, Joshua's contributions (or, for experiments, what the experiment involves), the stack, and an in-progress note. Below 1024px the article comes first and the list follows. |
| Experience (`/experience`) | Roles as match-history rows (organization, team when confirmed, role, detail, and a list of Joshua's confirmed work where he has supplied one), and a research column with the research involving Dr. Lai Wei and Dr. Yong Wei (details in progress) and a link to Valorant ML. |
| About (`/about`) | The about paragraphs, interests, education with expected graduation, roles, and, from 1024px, the "About this site" note with the Riot Games disclaimer and source link (the footer carries it below 1024px). |
| Contact (`/contact`) | Confirmed contact channels in a panel; with none confirmed, a status line. |

Rules carried over: small labels over artwork sit on a dark plate, every line of text passes the strict per-line contrast check, and every line of text stays inside its own box (the glyph containment check that catches a heading running behind a card).

Content and layout are separate: facts live in `src/content`, and `src/components/lobby/config.ts` decides what appears where, with which art and label.

## 4. Color

Original palette, tuned to the references but not copied from Riot's brand values.

| Token | Value | Use |
|-------|-------|-----|
| `--color-bg` | `#0B1220` | Page base (deep navy) |
| `--color-bg-deep` | `#070C16` | Vignette edges, footer |
| `--color-surface` | `rgba(18, 28, 43, 0.72)` | Panels over art (with 12px backdrop blur where supported) |
| `--color-surface-solid` | `#121C2B` | Panels on plain backgrounds; fallback when blur is unsupported |
| `--color-surface-raised` | `#1A2638` | Hover surface, menus |
| `--color-line` | `rgba(237, 234, 227, 0.14)` | Hairline borders and rules |
| `--color-line-strong` | `rgba(237, 234, 227, 0.32)` | Hover borders |
| `--color-text` | `#EDEAE3` | Primary text (warm off-white) |
| `--color-text-muted` | `#9AA6B8` | Secondary text, labels |
| `--color-gold` | `#C9A55C` | Prestige details: rules, index numbers, leadership markers |
| `--color-gold-soft` | `rgba(201, 165, 92, 0.18)` | Gold washes |
| `--color-teal` | `#3DD6C4` | Selected, focus, progress, active tab underline |
| `--color-teal-soft` | `rgba(61, 214, 196, 0.14)` | Selected card fill |
| `--color-coral` | `#F05A5E` | Brand slab, single primary action per view |
| `--color-coral-soft` | `rgba(240, 90, 94, 0.16)` | Rare emphasis washes |

Rules:

- **Coral** appears at most twice per view: the JV brand slab and, optionally, one primary call to action.
- **Teal** carries state (focus, selected, active), never decoration.
- **Gold** is thin: 1 to 2px rules, small caps labels, index numerals, and notch details. It is never a large fill.
- All text and background pairs must meet WCAG 2.2 AA (4.5:1 for body text, 3:1 for large text and UI boundaries). Estimated ratios on `--color-bg`: text about 16:1, muted about 7:1, gold about 8:1, teal about 11:1, coral about 5.7:1. Verify them with a contrast checker once implemented.

## 5. Typography

All fonts are open-licensed (SIL OFL) and self-hosted through `next/font`. VALORANT's typefaces are not used.

| Role | Family | Weights | Treatment |
|------|--------|---------|-----------|
| Display | Barlow Condensed | 600, 700 | Uppercase, line-height 0.88, tracking -0.01em |
| Body and UI | Inter | 400, 500, 600 | Sentence case, line-height 1.6 |
| Labels and metadata | JetBrains Mono | 500 | Uppercase, 0.75rem, tracking 0.12em |

Type scale (fluid, `clamp()`):

| Token | Size | Short-height override | Use |
|-------|------|-----------------------|-----|
| `display-xl` | `clamp(3.5rem, 8vw, 8rem)` | `clamp(3rem, 6.5vw, 6rem)` | Hero name |
| `display-l` | `clamp(2.5rem, 5vw, 4.5rem)` | n/a | Page titles |
| `h2` | `2rem` condensed 700 caps | n/a | Section headings |
| `h3` | `1.5rem` condensed 600 caps | n/a | Card titles |
| `body-l` | `1.125rem` | n/a | Hero role line |
| `body` | `1rem` | n/a | Default copy (max 65ch) |
| `small` | `0.875rem` | n/a | Card meta, captions |
| `label` | `0.75rem` mono caps | n/a | Eyebrows, breadcrumb, tags |

Section headings follow the Collection screen: condensed caps with a 1px rule extending to the right, or centered over a grid.

## 6. Spacing, geometry, and layering

- Base unit 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Panel padding: 24px desktop, 16px mobile.
- Corners: square. Angularity comes from **parallelogram tabs** (about 14 degrees), **notched corners** (12px diagonal cut, via `clip-path`), and **angled slab edges**.
- Borders: 1px `--color-line`; 2px teal for selected; 1px gold for prestige details.
- No drop shadows on panels. Depth comes from translucency, blur, and value contrast.
- Minimum interactive target: 44 x 44px.

Depth layers (back to front):

| Layer | Content |
|-------|---------|
| L0 | Base navy gradient and vignette |
| L1 | Key art environment (far plane, slightly soft) |
| L2 | Volumetric light beam and haze (part of the key art), plus fixed scrims that protect the text safe zone |
| L3 | JV emblem (original SVG, `aria-hidden`, about 20% opacity) behind the lineup, lit by a gold-to-transparent gradient |
| L4 | Translucent panels and project cards |
| L5 | Chrome: top bar, status strip, focus rings, menus |

A 7% film-grain overlay (overlay blend) sits above L2 to unify art and UI. The emblem replaces the ghost typography proposed in the first draft; ghost type may still be used on inner page headers.

## 7. Components

**TopBar.** 56px tall, solid `--color-bg-deep` at 85% opacity with blur. Contains, from left to right, the BrandSlab, NavTabs, then the résumé button (rendered only once a résumé is confirmed). Below 1024px, the Menu button replaces the tabs.

**BrandSlab.** Coral block with an angled right edge holding the original JV monogram and "JOSHUA VENEGAS" in condensed caps. It links to Home. This is the portfolio's equivalent of the PLAY slab.

**NavTab.** An original icon beside each text label (never icon-only, so the page reads clearly): Home, Projects, Experience, About, Contact. Inactive tabs show muted text. On hover, a skewed `--color-surface-raised` plate appears. The active tab (`aria-current="page"`) is a solid off-white parallelogram with dark text, mirroring the client's active tab. The skew is applied to a background pseudo-element so text stays upright and crisp.

**Breadcrumb.** Mono label with a small triangle glyph ("> HOME"), muted.

**Button.**
- `primary`: off-white fill, dark text, square corners, condensed caps (like "Upgrade Battlepass").
- `accent`: coral fill, dark text. Use only for the single main action in a view, if any.
- `outline`: 1px off-white border, transparent fill (like "View Mastery"); fill lightens on hover.
- `gold-outline`: 1px gold border, used for the résumé action.

**Pennant.** The lobby shell's project card (`src/components/lobby/Pennant.tsx`): artwork across the whole card under a bottom scrim, a rule, a gold context label, and the title, ending in a chevron point. Variants: `lead` and `flank` in the lobby row (sized from `--pennant-h`, Section 3.6) and `grid` in the Projects view (4:5, and 1:2 from 1280px); the selected card has the light border, teal rule, and gold chevron. Below 640px every variant is a full-width 4:5 card. The whole card is one link named by the title and described by the label. Hover and focus turn the border, rule, and chevron teal, zoom the art inside its frame, and lift the card, all through the motion tokens.

**ProjectCard (tall, Milestone 1's first homepage; replaced by Pennant).** Pennant-shaped card for the lineup (reference 00).
- Proportions: 1:2 on desktop (see Section 3.2), 4:5 on mobile. The base comes to a point 28px deep, with an inner chevron line (gold on the lead card, hairline on the flanks).
- Structure: index badge centered on the top edge (the featured-order number: Hermes 01, Recolm 02, Valorant ML 03), art (top 56%), a rule (teal on the lead card), context label in gold when confirmed (for example "JV Digital"), title in `h3`, one-line summary, and a "View project" cue at the bottom. The cue shows only when the card is at least 240px wide and 440px tall, so it never collides with a long summary (at 1440 x 900 that is the lead card; on mobile and tablet, every card). Title and summary step down on cards narrower than 300px and 210px.
- Missing art uses a clearly labelled placeholder: the art area is lit by a warm glow from the top (echoing the key light) over a faint hatch, and holds an empty dashed capture frame with gold corner ticks, a "Placeholder" label, and what is pending ("Product capture pending", or "Research chart pending. No data shown." with empty axes). Placeholders never imitate a product interface.
- Rest state: 1px border (light on the lead card, hairline on the flanks), solid surface fill.
- Hover and focus: the border, rule, chevron, and cue turn teal, a teal-soft gradient rises from the bottom (Collection's selected tile), the art scales to 1.03 inside its frame, and the card lifts 4px. The focus ring is a 2px teal rectangle 4px outside the card, drawn on the link itself, so the pennant clip never cuts it.
- The whole card is one link, with its accessible name equal to the project title and its description equal to the summary. Secondary links (repository, demo) belong on the case study page, not nested inside the card.
- Missing data (role, stack, links) is omitted, never filled with placeholder claims.

**Panel.** Translucent surface, hairline border, optional notched top-right corner, optional 2px gold top rule for leadership or prestige content.

**ExperienceRow.** Horizontal row (like a match-history row): org mark, role title, organization, dates (if confirmed), and a short contribution line. Rows use a 6% wash: teal for current roles, neutral for past ones. Coral is not used here because it reads as "defeat" in the reference.

**Tag.** Mono caps label in a 1px bordered box with tight padding.

**CollaboratorRail and CollaboratorStrip.** The rail is a 56px column at the far right from 1024px, in every view: a vertical "Collaborators" heading and one initials button per person. Below 1024px the same people appear as a two-column strip of name-and-context buttons at the end of the lobby. Each button opens a popover (`popover="auto"`, a labelled dialog): anchored to the left of the rail with CSS anchor positioning, centered on smaller screens. It shows the context, name, relationship, any confirmed links, and a Close button; Escape and an outside click also close it.

**ViewFrame.** The frame for views other than the lobby (`src/components/views/ViewFrame.tsx`): a gold kicker, the view's `h1` at `--text-display-m`, an optional intro, and translucent panels. It marks the view so the background dims.

**MobileMenu.** Full-screen dialog with angled list items at `display-l` size, a close button, and contact links at the bottom.

## 8. Motion

Motion is subtle and purposeful. All values are tokens.

| Token | Value | Use |
|-------|-------|-----|
| `--dur-fast` | 120ms | Color and border changes |
| `--dur-base` | 200ms | Hover lifts, tab plates |
| `--dur-slow` | 480ms | Entrance sequence |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Default |

Planned motion:

1. **Entrance pilot** (October 14): identity, priority-ordered pennants and highlights use a CSS-only 8px rise with 60ms stagger, ending at 780ms. Opacity starts at 0.92 to preserve readability. Top bar, rail and backdrop remain steady. Focus within cancels an entrance immediately. The entrance can replay when the lobby is restored; no persistent suppression flag is used. Exact scope and values are in `motion-pilot.md`.
2. **Card hover and focus**: border, wash, art scale, and 4px lift over `--dur-base`.
3. **NavTab hover**: skewed plate fades in over `--dur-fast`.
4. **Ambient light** (optional, decided after the key art is approved): a very slow (20s or longer) opacity drift on the beam layer. It does not move the layout.
5. **Mobile menu**: fade plus 12px slide, `--dur-base`.
6. **"Currently working on" rotation**: the carousel advances every 8 seconds with a cross-fade over `--dur-base`. It holds while the pointer is over it, while keyboard focus is inside it, and while the page is hidden. Pause stops it; choosing a slide with an arrow or indicator also stops it until the visitor presses Play. Under reduced motion it starts paused, and a slide change is the 120ms cross-fade alone. Only visitor-initiated changes are announced to screen readers ("Slide 2 of 2: Research").

The October 14 pilot adds a 200ms, 4px incoming Projects frame and a 160ms, 4px collaborator-popover entrance. Shared tokens, readable opacity and focus cancellation are specified in `motion-pilot.md`. Other views do not gain transitions yet. Ambient motion is deferred for this pilot after visual review of the existing beam.

Hermes now has a substantial typed narrative in the existing scrolling reader: problem, role, workflow, three engineering decisions, verification, milestone/limits and next steps. The other four project pages keep their existing limited scope. Sources and claim boundaries are in `content-dossier.md`.

### Reduced-motion contract

Reduced motion removes **animated movement**. It does not remove design. Under `prefers-reduced-motion: reduce`, behavior is consistent across every component:

Removed:

- Movement on interaction: no hover lift, no art zoom, no sliding menus. State changes happen in place.
- The entrance sequence's travel. Content renders in its final position immediately.
- Ambient and looping animation (including any beam drift), and autoplaying video. The carousel starts paused; the visitor can still press Play.
- Smooth scrolling.

Preserved:

- Static layout: the same composition, sizes, and positions as default motion, including the set-back flanking cards.
- Angled geometry: the brand slab, parallelogram tabs, notched panels, pennant cards, and chevron lines. These are static shapes (`clip-path` and SVG), not motion, and they are never flattened.
- Static transforms used for layout or shape (for example centering offsets or a skewed tab plate) remain; only transforms that animate are removed.
- Hover and focus feedback through color, border, and opacity, with transitions of 120ms or less.

Implementation: components animate movement only through the `--move-lift`, `--move-rise`, and `--move-zoom` tokens. A single media query in `src/app/globals.css` sets them to no movement and disables keyframe animations. Components never define their own reduced-motion exceptions.

## 9. Responsive behavior

| Range | Layout |
|-------|--------|
| below 640px | One column; Menu dialog; pennants stacked at 4:5 in priority order; tiles stacked; collaborator strip; footer |
| 640 to 1023px | One column with the seated pennant row and a row of three tiles; Menu dialog; collaborator strip; footer |
| 1024 to 1279px | The one-viewport shell with tabs and the collaborator rail; the lobby's feature and identity sit beside the stage, with the tiles in one row beneath |
| 1280px and up | The full lobby: feature and identity, stage, and tiles in three columns |

Lobby sizes and the views at each range are in Section 3.6. From 1024px the shell is one viewport tall and the stage scrolls inside it when a view is taller (for example the Projects grid at 1024 x 768), so nothing is clipped.

Background art is delivered with `<picture>` art direction: a landscape crop for 1024px and wider, and a portrait crop below that. Art is never stretched. Focal positions are fixed per crop.

## 10. Accessibility

Target: WCAG 2.2 AA.

- Semantic landmarks: `header`, `nav` (labelled "Primary"), `main`, `footer`. One `h1` (the name) on the homepage.
- A "Skip to content" link is the first focusable element and is visible on focus.
- Focus indicator: 2px teal outline with a 2px offset on every interactive element. It is drawn on an unclipped wrapper so `clip-path` shapes never hide it.
- Navigation uses real links, with `aria-current="page"` on the active tab.
- The mobile menu is a modal dialog: it moves focus in on open, traps focus while open, closes with Escape, and returns focus to the Menu button.
- Text over art always sits inside a scrim or the art's dark safe zone. Contrast is verified at the actual text positions: for every rendered line of text in the first viewport, the test compares the text color against every background pixel inside that line's box (captured with text hidden) and requires the minimum to reach 4.5:1 (3:1 for large text). This is a strict worst case, unlike the Phase 1 safe-zone measurement, which used the 98th-percentile luminance of the whole safe-zone box.
- Decorative art and the emblem use `alt=""` or `aria-hidden="true"`. Project art receives meaningful alt text only when it shows real product content.
- Information is never conveyed by color alone; tags and states also carry text.
- The layout remains usable at 200% zoom and at 320px width.

## 11. Unresolved design decisions

Decided:

- Background direction: dark architectural scene, subtle JV emblem, one warm light (Phase 1).
- **Candidate A, Atrium**, approved as the homepage direction. Its current background is an interim asset; final resolution is handled during refinement.
- Desktop lineup: Recolm, Hermes (lead), Valorant ML. Document and mobile order: Hermes first (Section 3.5).
- Mobile art band reduced to about 96px.
- The Experience, About, and Contact tiles and the subtle JV emblem stay.
- Headline and card art approach (real captures where available, original research charts for Valorant ML, labelled placeholders otherwise).
- **Lobby shell** (Section 3.6), approved by Joshua in October 2026. It replaces the first homepage, including its below-the-fold sections, panel stack, and status strip.
- The AI-generated lobby art on the pennants, carousel, and tiles ships for now and will be replaced as product captures and owned art become available (`docs/assets.md`, A2-lobby).
- The four collaborators agreed to be listed.
- **Carousel rotation**, approved by Joshua in October 2026, with the pause rules in Section 8.

Still open:

1. **Final key art source.** Whether the approved scene ships as upscaled AI-generated art (with its licensing caveats), is redrawn or commissioned to match, or is replaced by an improved owned render.
2. **Ambient motion.** Whether the beam drift ships at all.
3. **Personal VALORANT context.** Whether the Valorant ML case study mentions Joshua's own competitive play. Nothing about it appears unless Joshua opts in.
