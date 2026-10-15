# Polish pass: Hermes overview and ambient light

Verified October 14, 2026 with Playwright 1.64 and **Chromium 156.0.8078.4** against the production build on port 3200. Chromium 153 was not run in this environment.

## Scope and baseline

Branch `cursor/hermes-overview-ambient` starts at `cab57f1`, the head of the unmerged pilot branch `codex/motion-hermes-pilot` (draft PR 5), and its draft PR targets that branch so the diff is this pass alone. The pilot's own verification is in [`../motion-pilot/README.md`](../motion-pilot/README.md). The unrelated local `src/lib/cn.ts` is untouched and outside the commits.

This pass adds:

- A Hermes **overview** (problem, role and collaboration, what was delivered, status, and three linked decision summaries) and an original **reply-workflow diagram** in HTML and CSS, with a text description. The narrative was consolidated around them; the h2 outline keeps nine narrative sections and Stack.
- One **ambient light** on the lobby with its own **Pause/Play** control (`../../motion-pilot.md`).
- [`../../project-refresh-plan.md`](../../project-refresh-plan.md), a plan only; no project repository was touched and no result or chart was published.

## Actual results

| Check | Result |
|---|---|
| `npm run lint` | Passed, no warnings |
| `npm run typecheck` | Passed |
| Production build | Passed in every test command |
| `npm run test:e2e`, first full run | 152 passed, 53.8 seconds (before the last change: one attribution sentence in the Hermes overview) |
| `npm run test:e2e`, final full run on the finished code | 151 passed; 1 Windows file-write error; 1.1 minutes |
| `npx playwright test --last-failed --workers=1` | 1 passed, unchanged |
| Aggregate on the finished code | All 152 checks passed across the final run and the targeted retry |
| Brightest-state contrast | 4 reports (`../lobby/contrast-ambient-peak-*.json`), zero failing samples |

The final run's failure was `UNKNOWN: unknown error, open` while writing `contrast-project-hermes-mobile.json`: the operating system refused to open the report file. This is the same environment error class the pilot recorded. The test's assertions had not failed, and it passed alone without code or assertion changes.

The suite grew from 132 to 152 checks. Existing assertions are kept. Three helpers changed to accommodate a looping animation without weakening them:

- `settle()` awaits only animations that end.
- The "entrance sequence finishes within one second" test excludes the infinite ambient loop.
- The lobby tab-order list gains the new control after the primary tabs (27 stops instead of 26).

## New coverage

- **Ambient** (`tests/e2e/ambient.spec.ts`):
  - Exactly one `ambient-light` animation runs: 24s, infinite, opacity only. Text, navigation, cards and focusable controls keep identical boxes while it runs.
  - Pause and Play work from the keyboard (Enter and Space), and the paused frame does not advance.
  - Background and carousel controls are independent in both directions.
  - A hidden page pauses the light and leaves the visitor's choice unchanged; a visitor's pause survives the page being hidden and shown.
  - Leaving the lobby removes the animation and its `visibilitychange` listener (instrumented counts 0, 2, 0). Returning keeps the paused choice.
  - Reduced motion: no control, no animation, opacity 0, no forbidden motion.
  - Below 1024px (tablet, mobile): no rendered layer and no control.
  - Without JavaScript: no control, no animation.
- **Hermes** (`tests/e2e/case-study.spec.ts`), at 1440 x 900 and 390 x 844:
  - Overview is the first h2 and carries its four terms.
  - Each decision link, by pointer or keyboard, updates the hash and brings its section into view. On desktop the reader scrolls while the document and the top bar stay put.
  - The figure has six numbered steps with their systems, the review path inside step 5, the legend, and the text description.
  - Desktop: three columns, with the loop's arms within 2px of the centers of steps 4 and 5, and the inline review copy kept for assistive technology. Mobile: one ordered column with the review path visible in step 5. No horizontal overflow at either size.
- **Contrast at the brightest ambient state** (`tests/e2e/contrast.spec.ts`): wide, desktop, laptop and compact, default motion, with the light paused at the midpoint of its cycle (opacity 1). Every first-viewport text line is measured on both carousel slides, and the five carousel graphics plus the new control's icon are held to 3:1. The lowest ratios match the reduced-motion lobby reports exactly (desktop 6.84:1 for 4.5:1; laptop 4.04:1 for 3:1 large text; compact 6.91:1). The light sits under the scrims and opaque panels, so it never lowers the worst case. The new control measures 16.39:1.
- The existing layout spec continues to check glyph containment, the one-viewport fit and no horizontal scroll for the Hermes view at six sizes, and the Hermes reading-contrast spec now includes the overview and diagram sections.

## Captures and visual review

- Ambient light at rest and at its brightest: [desktop rest](lobby-desktop-rest.jpg) / [peak](lobby-desktop-peak.jpg), [laptop rest](lobby-laptop-rest.jpg) / [peak](lobby-laptop-peak.jpg), [compact rest](lobby-compact-rest.jpg) / [peak](lobby-compact-peak.jpg), and [reduced motion](lobby-desktop-reduced.jpg).
- Hermes: [overview, desktop](hermes-overview-desktop.jpg), [overview, mobile](hermes-overview-mobile.jpg), [workflow, desktop](hermes-workflow-desktop.jpg), [workflow, mobile](hermes-workflow-mobile.jpg).
- [Default-motion recording](ambient-hermes-default.webm) (18 seconds, real time): about eight seconds of the lobby as the light rises, Pause and Play, then the Hermes overview, the Recipient recheck link, and the diagram. Frames sampled at 1, 9 and 15 seconds and at the end were inspected. It is not a performance benchmark.

The suite also refreshes the shared lobby and pilot captures in [`../lobby/`](../lobby/) and [`../motion-pilot/`](../motion-pilot/). Default-motion lobby stills catch the light at whatever point of its cycle the capture happens to land on. Review covered the desktop, laptop and compact lobby at rest and at peak, and the Hermes overview and diagram at 1440, 1280, 768 and 390px. During review the 768px loop's text overflowed a fixed-height box; the loop was changed to size to its content. Inner views keep their static dimmed hall.

## Limits

- The ambient light is lobby-only from 1024px. Below that the hall art is a short band behind the carousel, so the layer is not rendered.
- The control appears after hydration. Under reduced motion the light stays at its static state and the control is hidden; reduced-motion visitors cannot opt in.
- The visitor's pause is remembered across client navigation within a visit, not across reloads.
- Hermes claims still rest on source and historical records (dossier H1–H7). No new signed-in or production audit was performed, and no adoption, time-saving or impact claim is made.
- Firefox, WebKit and screen-reader passes remain Phase 5 work.
- No merge, deployment, new artwork or hosting configuration.
