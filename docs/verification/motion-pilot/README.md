# Motion and Hermes pilot verification

Verified October 14, 2026 with Playwright 1.64 and **Chromium 156.0.8078.4**, using the production build on port 3200. This report supersedes the historical lobby report only for this pilot. Chromium 153 was not rerun.

## Scope and baseline

Branch `codex/motion-hermes-pilot` starts at `e4653a2e73d7e3b989e30d18792aa74063893b6c`, the integration merge of PR 4 into `milestone-1/homepage`. Its tree matches reviewed lobby commit `36eec11`. At inspection, `main` remained at `75d18ba`; therefore the draft PR against main includes the already reviewed homepage/lobby ancestry. Review this pilot's incremental changes from `e4653a2`.

The pilot adds the lobby hierarchy stagger, Projects incoming entrance, pennant/popover polish, and the first substantial Hermes narrative. It preserves the carousel's existing interaction contract and native navigation. Other case studies and tab entrances remain outside this gate. See the [motion specification](../../motion-pilot.md) and [content dossier](../../content-dossier.md).

## Actual results

| Check | Result |
|---|---|
| `npm run lint` | Passed, no warnings |
| `npm run typecheck` | Passed |
| Production build | Passed in both final test commands |
| `npm run test:e2e` | 129 passed; 3 screenshot-file write errors; 48.0 seconds |
| `npm run test:e2e -- --last-failed --workers=1` | All 3 passed; 13.8 seconds |
| Aggregate final verification | All 132 checks passed across the full run and targeted retry |
| Contrast reports | 21 reports, zero failing samples; existing thresholds retained |
| Lyn reminder parser (separate evidence check) | 27/27 passed; no claim of end-to-end companion verification |

The three full-run failures were Windows `UNKNOWN: unknown error, open` errors writing `home-wide-default.jpg`, `home-tablet-default.jpg`, and `project-hermes-laptop.jpg`. They were not application assertions or image-decode failures. All three passed in the single-worker retry without code or assertion changes. An earlier iteration passed 132/132 before image decoding was made stricter; the table above describes the final implementation accurately.

The helper now eagerly loads and awaits decoding of every image before still captures. Visual inspection caught a missing project thumbnail in an earlier capture; strict decoding resolved it. Tests also exposed an empty streamed fallback with JavaScript disabled: known project routes now render their narrative directly after resolving their statically generated parameters. The mobile no-JavaScript test verifies narrative content and the native All projects link.

New coverage checks actual stagger timings (last completion 780ms), readable starting opacity, focus interruption, Projects navigation during a paused real CSS entrance, browser Back, persistent shell nodes, one visible view, reduced motion, and case-study scrolling. Existing keyboard, layout, glyph containment, carousel, contrast and screenshot checks remain in place. Contrast additions sample the start and midpoint of motion at desktop, compact desktop and mobile, plus scrolled Hermes text at desktop and mobile. These are sampled states, not an exhaustive proof of every frame.

## Captures and visual review

The lobby matrix covers 1920×1080, 1440×900, 1280×720, 1024×768, 768×1024 and 390×844 in default and reduced motion. Every view is captured at desktop, laptop, tablet and mobile sizes in the [lobby capture directory](../lobby/). Still captures settle fonts, image decoding and animations.

- [Six-size, two-mode review sheet](lobby-review-sheet.jpg)
- [Default lobby](lobby-default.jpg) and [reduced lobby](lobby-reduced.jpg)
- [Default Projects](projects-default.jpg) and [reduced Projects](projects-reduced.jpg)
- [Hermes desktop](../lobby/project-hermes-desktop.jpg), [tablet](../lobby/project-hermes-tablet.jpg), [mobile](../lobby/project-hermes-mobile.jpg), and [readable mobile detail sheet](hermes-mobile-detail.jpg)
- [Hermes reading-panel end, default](hermes-end-default.jpg) and [reduced](hermes-end-reduced.jpg)
- Short real-time recordings: [default motion](pilot-default.webm) and [reduced motion](pilot-reduced.webm). These capture navigation and scrolling; they are not performance benchmarks.

Visual review used the local Play lobby reference (`references/valorant/00-play-lobby.jpg`, kept outside Git), repository baseline captures, the running application, the refreshed six-size review sheet, focused compact/tablet/phone and Hermes captures, and sampled frames from the default recording. The separately mentioned conversation screenshots were not accessible. Reviewed captures retain the desktop shell, readable small-screen stacking, unclipped focus and complete project artwork. The long mobile case study scrolls as a document; desktop keeps the shell visible while its reader scrolls.

## Evidence limits and review gate

Hermes technical claims were checked against source and historical PR records; this was not a new signed-in production audit. The October 8 milestone is Joshua-supplied and distinct from the October 5 release merge. (Later correction: the October 8 production release and its recorded verification are now sourced as dossier H8.) No adoption or performance metrics were invented. No private mailbox or customer capture is included.

The frozen Valorant outputs identify 2026 AUC 0.5691 as Bundle A; the consistent Bundle F series ends at 0.5578. No chart is published pending data-sharing and prediction-time clarification. ARA source was found: the scheduler is a placeholder, and missing local dependencies prevented runtime verification. Paper-qa remains separate. The dossier records remaining authorship, permission, outcome and research questions.

Review motion restraint and Hermes accuracy before extending either pilot. No deployment, merge, new artwork or hosting configuration is part of this pass. Unrelated `src/lib/cn.ts` remains untouched and outside the commit.
