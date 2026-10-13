# Design Specification

Status: draft for review. Nothing in this document is implemented yet.

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

Joshua supplied eleven screenshots of the VALORANT client (Collection, Career, Agents, Store, Esports, Premier, Progression). They are design references only. They stay local in `references/valorant/` (gitignored) and must never be committed or shipped.

Note: none of the supplied screenshots shows the actual Play lobby, with its party lineup and Play button. The shared chrome visible in every screenshot (top bar, Play slab, tab geometry, social rail) and the closest lobby-like compositions (Premier hub, Agents) stand in for it. An additional screenshot of the Play lobby would sharpen the homepage composition. See "Unresolved design decisions" below.

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
| 10 | Premier Hub | Warm gold-on-brown atmosphere; vertical schedule cards with a gold left-edge accent; giant centered title ("BIND") with a single gold call-to-action; roster panel at right. This is the closest reference for a hero with one primary action. |
| 11 | Progression | Missions panel and battle-pass panel; thin teal progress bars; white filled primary button; restrained use of a single hero object inside a framed panel. |

Patterns shared across all screens:

- Top bar, about 48 to 56px tall: a coral "PLAY" slab with an angled right edge at far left; icon tabs where the active tab becomes a solid off-white parallelogram with a dark icon; wallet and settings at right.
- Small uppercase breadcrumb under the bar ("COLLECTION", "CAREER").
- Persistent right social rail and a bottom-left status strip ("Party:").
- Surfaces are translucent navy over the atmospheric background, separated by hairline borders rather than shadows. Corners are square or notched, never rounded.
- Typography is condensed, uppercase, and tightly tracked for display; small spaced caps for labels.
- Accent colors are rationed: teal means selected or progress, coral means primary action or loss, gold means prestige or competitive context.

## 3. Composition

### 3.1 Concept: "The Lobby"

The homepage is staged like a lobby before a match:

- The **identity block** (name, role line, primary actions) takes the role of the Play button and party status: top-left, the first thing read.
- The **three featured projects** form the **lineup**: three tall cards standing side by side, lit by the scene, the way party members stand in the lobby.
- The **cinematic background** provides one deliberate light source that falls on the lineup, so the eye travels from the name to the work.

### 3.2 Desktop composition (reference viewport 1440 x 900)

```
+--------------------------------------------------------------------------------+
| [JV  JOSHUA VENEGAS]/ HOME  PROJECTS  EXPERIENCE  ABOUT  CONTACT    [RESUME] o o |  top bar 56px
| > HOME                                                                          |  breadcrumb 32px
|                                                   light beam                   |
|   UNG // COMPUTER SCIENCE + ML MINOR                 |||                        |
|                                              +------++------++------+          |
|   JOSHUA                                     |      ||      ||      |          |
|   VENEGAS                                    | ART  || ART  || ART  |          |
|                                              |      ||      ||      |          |
|   Role line (one sentence, confirmed facts)  |      ||      ||      |          |
|                                              |------||------||------|          |
|   [ VIEW PROJECTS ]  [ RESUME ]              |HERMES||RECOLM||VAL ML|          |
|                                              |role  ||role  ||role  |          |
|   AI Lab Team Leader | Founder, JV Digital   +------++------++------+          |
|                                                                                |
| [ CURRENTLY: confirmed status line ]                          EXPERIENCE  v    |  status strip 48px
+--------------------------------------------------------------------------------+
   ghost type "VENEGAS" sits behind everything at about 6% opacity
```

Grid: 12 columns, max content width 1360px, 24px gutters, 40px outer margin.

- Columns 1 to 5: identity block, vertically centered in the fold.
- Columns 6 to 12: lineup of three tall cards. Cards are about 2:3 (roughly 240 x 480 at 1440 wide), separated by 16px gaps.
- The background focal point (beam and brightest haze) sits behind the center card at about x = 66%, y = 30%.
- The left 40% of the background must stay low in detail and dark in value. It is the text safe zone.
- The bottom status strip mirrors the client's "Party:" strip. It holds one confirmed status line and a scroll cue to the next section.

Below the fold (Milestone 1 keeps these short):

1. **Experience snapshot**: rows styled after match-history rows, using only confirmed roles (AI Lab Team Leader at UNG, Founder of JV Digital, UNG CS student with ML minor). Dates are shown only when confirmed.
2. **About teaser**: two or three sentences and a link to About.
3. **Contact panel**: résumé, email, GitHub, LinkedIn. Only confirmed links render.
4. **Footer**: name, a disclaimer that the site is not affiliated with Riot Games, and source link.

### 3.3 Short laptop composition (1280 x 720)

Height is the constraint. Applied when the viewport is at least 1024px wide and at most 800px tall:

- Display name shrinks one step (see type scale); the role line stays at full size.
- Cards shrink to a minimum of 400px tall while keeping their title area intact; artwork crops from the top.
- Breadcrumb row merges into the top bar's lower edge (saves 32px).
- The identity block and the full height of all three cards must be visible without scrolling at 1280 x 720.

### 3.4 Mobile composition (390 x 844)

```
+-------------------------------+
| [JV]/                [=] MENU |  top bar 56px
|                               |
|     background focal crop     |
|   UNG // CS + ML MINOR        |
|   JOSHUA                      |
|   VENEGAS                     |
|   Role line                   |
|   [ VIEW PROJECTS ] [ RESUME ]|
|                               |
|   FEATURED WORK ------------- |
|   +-------------------------+ |
|   |  ART  (4:5)             | |
|   |  HERMES / role / stack  | |
|   +-------------------------+ |
|   +-------------------------+ |  cards stack vertically;
|   |  RECOLM                 | |  no horizontal carousel
|   +-------------------------+ |
+-------------------------------+
```

- The background uses a separate portrait crop with the focal point at about x = 50%, y = 22%, behind the name.
- Below the hero, the background fades to solid navy so card text never sits on busy art.
- Cards stack vertically at a 4:5 ratio and use full width minus 16px margins.
- Navigation collapses into a "Menu" button that opens a full-screen dialog with large angled list items.
- The résumé action stays visible in the hero; contact links repeat at the bottom.

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
| L2 | Volumetric light beam and haze (part of the key art, optionally enhanced with CSS gradients) |
| L3 | Ghost typography ("VENEGAS"), `aria-hidden`, about 6% opacity |
| L4 | Translucent panels and project cards |
| L5 | Chrome: top bar, status strip, focus rings, menus |

A 3 to 4% film-grain overlay sits above L2 to unify art and UI.

## 7. Components

**TopBar.** 56px tall, solid `--color-bg-deep` at 88% opacity with blur. Contains, from left to right, the BrandSlab, NavTabs, then the right-side actions: résumé button and icon links for GitHub and LinkedIn (rendered only when their URLs are confirmed).

**BrandSlab.** Coral block with an angled right edge holding the original JV monogram and "JOSHUA VENEGAS" in condensed caps. It links to Home. This is the portfolio's equivalent of the PLAY slab.

**NavTab.** Text labels (not icon-only, so the page reads clearly): Home, Projects, Experience, About, Contact. Inactive tabs show muted text. On hover, a skewed `--color-surface-raised` plate appears. The active tab (`aria-current="page"`) is a solid off-white parallelogram with dark text, mirroring the client's active tab. The skew is applied to a background pseudo-element so text stays upright and crisp.

**Breadcrumb.** Mono label with a small triangle glyph ("> HOME"), muted.

**Button.**
- `primary`: off-white fill, dark text, square corners, condensed caps (like "Upgrade Battlepass").
- `accent`: coral fill, dark text. Use only for the single main action in a view, if any.
- `outline`: 1px off-white border, transparent fill (like "View Mastery"); fill lightens on hover.
- `gold-outline`: 1px gold border, used for the résumé action.

**ProjectCard (tall).** Portrait card for the lineup.
- Structure: art (top about 62%), diagonal accent bar (gold hairline at a 14-degree cut), title in `h3`, one-line summary, role tag, up to three stack tags, and a "Case study" affordance.
- Rest state: 1px line border, surface fill, art slightly desaturated (90%).
- Hover and focus: border becomes 2px teal, a teal-soft gradient rises from the bottom (Collection's selected tile), art returns to full saturation and scales to 1.03 inside its frame, and the card lifts 4px.
- The whole card is one link, with its accessible name equal to the project title. Secondary links (repository, demo) belong on the case study page, not nested inside the card.
- Missing data (role, stack, links) is omitted, never filled with placeholder claims.

**Panel.** Translucent surface, hairline border, optional notched top-right corner, optional 2px gold top rule for leadership or prestige content.

**ExperienceRow.** Horizontal row (like a match-history row): org mark, role title, organization, dates (if confirmed), and a short contribution line. Rows use a 6% wash: teal for current roles, neutral for past ones. Coral is not used here because it reads as "defeat" in the reference.

**Tag.** Mono caps label in a 1px bordered box with tight padding.

**StatusStrip.** Bottom bar of the hero, showing one confirmed status line and a scroll cue.

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

1. **Entrance** (once per page load): top bar fades in, the identity block rises 8px and fades in, then the cards follow in a 60ms stagger. The whole sequence finishes within about 700ms. Content must be readable even if JavaScript fails; the entrance is CSS-only.
2. **Card hover and focus**: border, wash, art scale, and 4px lift over `--dur-base`.
3. **NavTab hover**: skewed plate fades in over `--dur-fast`.
4. **Ambient light** (optional, decided after the key art is approved): a very slow (20s or longer) opacity drift on the beam layer. It does not move the layout.
5. **Mobile menu**: fade plus 12px slide, `--dur-base`.

### Reduced-motion contract

Under `prefers-reduced-motion: reduce`, behavior is consistent across every component:

- No transforms of any kind: no translate, scale, or lift. Hover and focus states use only color, border, and opacity.
- No entrance sequence. Content renders in its final state immediately.
- No ambient or looping animation, and no autoplaying video.
- Remaining color and opacity transitions are at most 120ms.
- Smooth scrolling is disabled.

This is implemented once, globally, through motion tokens and a single media query block. Components never define their own reduced-motion exceptions.

## 9. Responsive behavior

| Range | Layout |
|-------|--------|
| below 640px | Mobile layout; menu dialog; stacked 4:5 cards |
| 640 to 1023px | Larger mobile layout; cards in a 2-column grid with the third spanning both columns; menu dialog |
| 1024px and up | Desktop lobby composition; inline nav tabs; three-card lineup |
| 1024px and up, height 800px or less | Short-laptop overrides (Section 3.3) |
| 1536px and up | Content capped at 1360px; background art continues to the edges |

Background art is delivered with `<picture>` art direction: a landscape crop for 1024px and wider, and a portrait crop below that. Art is never stretched. Focal positions are fixed per crop.

## 10. Accessibility

Target: WCAG 2.2 AA.

- Semantic landmarks: `header`, `nav` (labelled "Primary"), `main`, `footer`. One `h1` (the name) on the homepage.
- A "Skip to content" link is the first focusable element and is visible on focus.
- Focus indicator: 2px teal outline with a 2px offset on every interactive element. It is drawn on an unclipped wrapper so `clip-path` shapes never hide it.
- Navigation uses real links, with `aria-current="page"` on the active tab.
- The mobile menu is a modal dialog: it moves focus in on open, traps focus while open, closes with Escape, and returns focus to the Menu button.
- Text over art always sits inside a scrim or the art's dark safe zone, measured to at least 4.5:1.
- Decorative art and ghost type use `alt=""` or `aria-hidden="true"`. Project art receives meaningful alt text only when it shows real product content.
- Information is never conveyed by color alone; tags and states also carry text.
- The layout remains usable at 200% zoom and at 320px width.

## 11. Unresolved design decisions

1. **Key art direction.** Choose an environment-led, emblem-led, or portrait-led scene (see `docs/assets.md`, A1). Recommendation: emblem-led.
2. **Play lobby reference.** Optionally supply a screenshot of the actual Play lobby to refine the hero composition.
3. **Card order.** Which project leads the lineup (left or center)?
4. **Project card art approach.** Real product captures, abstract emblems, or a mix (see `docs/assets.md`, A2).
5. **Ambient motion.** Whether the beam drift ships at all; decide after the key art is evaluated in the browser.
6. **Personal VALORANT context.** Whether the Valorant ML case study should mention Joshua's own competitive play, such as rank or Premier participation. Nothing about it appears on the site unless Joshua opts in.
7. **Role line copy.** The one-sentence hero statement needs Joshua's approval.
