# Lobby shell: verification

The homepage is now the lobby shell that Joshua approved as a desktop composition (`docs/design.md`, Section 3.6). The top bar, collaborator rail, and background persist, and the navigation swaps the lobby, Projects, case study, Experience, About, and Contact views at their own URLs. Everything here is produced by `npm run test:e2e` against a production build (Chromium).

| Lobby, 1440 x 900 | Lobby, 1280 x 720 |
|---|---|
| ![Lobby at 1440 x 900](home-desktop-default.jpg) | ![Lobby at 1280 x 720](home-laptop-default.jpg) |

| Lobby, 1024 x 768 | Case study, 1440 x 900 |
|---|---|
| ![Lobby at 1024 x 768](home-compact-default.jpg) | ![Project Hermes at 1440 x 900](project-hermes-desktop.jpg) |

| Tablet, 768 x 1024 (full page) | Mobile, 390 x 844 (full page) |
|---|---|
| ![Lobby on tablet](home-tablet-default-full.jpg) | ![Lobby on mobile](home-mobile-default-full.jpg) |

Also captured:

- The lobby at 1920 x 1080 (`home-wide-*`), in default and reduced motion at every size.
- On desktop, pennant hover and focus, the second carousel slide, and the Brandon Hall popover. On mobile, a collaborator popover and the menu.
- Each view (`projects-*`, `project-hermes-*`, `experience-*`, `about-*`, `contact-*`) at 1440 x 900, 1280 x 720, 768 x 1024, and 390 x 844.

The side-by-side with the Play lobby reference is kept locally only, because the reference is Riot artwork.

## Results: 112 of 112 tests pass

- **Layout** (`layout.spec.ts`, 17 lobby sizes from 1920 x 1080 to 320 x 640, plus every view at six sizes):
  - From 1024px, the document is exactly one viewport tall. In the lobby, `main` does not overflow, so every pennant, tile, the name, and Explore projects sit between the top bar and the bottom edge. Taller views scroll inside `main`; nothing is hidden with `overflow: hidden`.
  - The pennants are seated Recolm, Hermes, Valorant ML from 640px. The flanks are 0.9 of the lead and tuck 16px behind it, and the lead is at least 400px tall. From 1280px the tile column is exactly as tall as the lead pennant.
  - Below 640px, the pennants stack in priority order with Hermes first, after the name.
  - **Glyph containment:** every rendered line of text, measured from its text range rather than its element box, stays inside its nearest block and inside the viewport. The name's ink also ends before the first pennant, which is the check that was missing when "VENEGAS" ran behind Recolm.
  - There is no horizontal scrolling at any size.
- **Keyboard** (`keyboard.spec.ts`):
  - The skip link comes first. The lobby's tab order runs: brand, tabs, the carousel link and controls, About and Contact, the pennants (Hermes first), Explore projects, the tiles, then the four collaborators. Every stop has an unclipped 2px teal ring.
  - The carousel arrows change the slide, and the hidden slide is `inert`.
  - A collaborator popover opens with Enter, shows the relationship, and fits the viewport. It has no online status, and Escape closes it and returns focus to its button.
  - Each tab replaces the stage, marks itself `aria-current="page"`, and keeps the rail; browser Back walks the views in reverse.
  - The case study scrolls inside its reading panel (End key) while the top bar stays fully visible.
  - The mobile menu traps focus, closes with Escape, restores focus, and navigates. A collaborator in the mobile strip opens a centered popover.
- **Reduced motion** (`reduced-motion.spec.ts`): no animation runs after load. Hovering or focusing the tabs, pennants, Explore projects, tiles, a collaborator, or a carousel arrow changes no geometry, and no transition lasts over 120ms. The clip-path shapes and the layout match default motion. The entrance finishes within one second, and the content is readable without JavaScript.
- **Text contrast** (`contrast.spec.ts`): the minimum WCAG ratio between each rendered line's color and every background pixel in its box, with glyphs hidden. Lines scrolled out of a panel are cropped to what is on screen. Zero failures across all 16 runs:

| View and size | Lines | Lowest line |
|---|---|---|
| Lobby, 1920 / 1440 / 1280 | 47 each | "View Project Hermes", 5.68:1 |
| Lobby, 1024 x 768 | 45 | "View Project Hermes", 6.72:1 |
| Lobby, tablet / mobile | 20 each | 7.52:1 / 6.02:1 |
| Project Hermes, desktop / mobile | 49 / 19 | 6.62:1 / 7.15:1 |
| Experience, desktop / mobile | 34 / 26 | "Research" label, 5.06:1 / 6.95:1 |
| Projects, About, Contact | 9 to 37 | 6.47:1 or higher |

Two issues these tests caught, both fixed:

- **The tile column was sized against the viewport.** The tiles sat outside the stage's size container, so at 1280 x 1024 they were 97px shorter than the lead pennant. The lobby is now the container, and `--pennant-h` is written against its columns.
- **The "Research" label failed contrast at 4.06:1.** It sat in the light shaft on Experience. The background dim for views other than the lobby went from 60% to 70%.

## Content shown, and what stays unset

Every visible fact comes from `src/content`. Unset fields are not rendered.

- **Roles:** Software Engineer at Foxtrot, in the Special Projects Group (the title from the offer letter; its compensation, terms, and listed systems are not recorded); AI Lab team leader under Prof. Mohammad Mohebi; founder of JV Digital; UNG computer science with an ML minor, expected Spring 2027.
- **Case studies:** each shows the description, status, milestones, collaborators, Joshua's own contributions (or, for the two experiments, what the experiment involves), and the stack, with a "Full case study in progress" note. No metrics, outcomes, or claims beyond what Joshua supplied.
- **Research:** "Research with Dr. Lai Wei and Dr. Yong Wei", marked as details in progress. The title, responsibilities, methods, deliverables, and milestone are unset.
- **Collaborators:** Brandon Hall, Dr. Lai Wei, Dr. Yong Wei, and Prof. Mohammad Mohebi, each of whom agreed to be listed. Initials only; there are no portraits, biographies, links, or online status.
- **Not shown:** résumé, email, GitHub, LinkedIn, role dates, outcomes, and the Recolm client's name (pending written permission).

## Artwork

The pennant, carousel, tile, and case study images are the A2-lobby art (`docs/assets.md`), approved to ship for now. Before deployment, the generating tool's terms and Joshua's acceptance of the copyright caveat still need to be recorded. The images are illustrative and contain no interfaces, data, logos, or game imagery.

## Not built

- Carousel rotation. It is manual; a slow rotation that pauses on hover and focus is an open decision (`docs/design.md`, Section 11).
- Full case studies (Phase 3), which need the content listed in `docs/assets.md`.
