# AGENTS.md

Instructions for Cursor, Codex, and other coding agents working in this repository.

## Project

Personal portfolio for Joshua Venegas: a University of North Georgia computer science student with a machine learning minor, an AI Lab team leader, and the founder of JV Digital. The visual direction is inspired by the VALORANT client's menu screens. The site is an original identity, not a copy of the game.

## Sources of truth

Read these before changing anything:

- `docs/design.md`: composition, tokens, components, motion, accessibility.
- `docs/implementation-plan.md`: phases, the current milestone, and verification.
- `docs/assets.md`: artwork, licensing, and the content Joshua still needs to supply.

If a change conflicts with these documents, update the document in the same pull request, or ask first.

## Current status

Phase 1 is approved: candidate A (Atrium) is the visual direction, and its background is an interim asset until final-resolution art is produced. The composition study at `/lab/composition` (development only) remains for reference; its results are in `docs/verification/phase-1/README.md`. The study's `src/app/lab/composition/_components` are throwaway and must not be imported by real pages.

Milestone 1 became the lobby shell after Joshua's review: he approved its desktop composition, and the shell, its views (Projects, case studies, Experience, About, Contact), and the tablet and mobile versions are implemented and in review (`docs/design.md`, Section 3.6; results in `docs/verification/lobby/README.md`). The first homepage's results remain in `docs/verification/milestone-1/README.md`. Do not start Phase 3 (full case studies) until Joshua approves the shell.

Facts live in `src/content` and carry no layout fields. `src/components/lobby/config.ts` decides what appears where. A project's stack is never a list of accomplishments: only `contributions` describe Joshua's own work.

The lineup is an ordered list in priority order (Hermes, Recolm, Valorant ML); desktop CSS places it as Recolm, Hermes, Valorant ML (`docs/design.md`, Section 3.5).

The primary composition reference is the Play lobby (`references/valorant/00-play-lobby.jpg`, local only).

## Hard rules

- **Never invent content.** No made-up accomplishments, metrics, testimonials, dates, employers, client names, or contact details. Unconfirmed fields are `null` in `src/content` and are not rendered.
- **No Riot Games or VALORANT assets** in the repository or the site: no art, icons, logos, maps, fonts, or screenshots. Reference screenshots live only in `references/` (gitignored).
- **No Gmail or Google logos** as decoration. Name Gmail in text only.
- **Do not deploy** and do not add hosting configuration without Joshua's explicit approval.
- **No secrets in Git.** Use `.env.local` (ignored) and keep `.env.example` limited to variable names.
- Stop at each phase gate and present results for review.

## Conventions

- Next.js 16.4 App Router with Cache Components enabled, React Server Components by default; add `"use client"` only where interaction requires it. Check `node_modules/next/dist/docs/` before using an API (see the block at the end of this file).
- TypeScript strict. Content is typed in `src/content` (Zod validation arrives with Milestone 1).
- Tailwind CSS v4. Use the design tokens defined in `src/app/globals.css`; do not hard-code colors, durations, or font sizes in components.
- Motion uses the duration and easing tokens, and any movement uses the `--move-*` tokens. Reduced motion removes movement only; static layout and angled geometry stay. It is defined once in `src/app/globals.css`; components must not add their own motion exceptions.
- Lobby pennants are sized from `--pennant-h`, which is written against the lobby grid's columns (`docs/design.md`, Section 3.6). Change both together.
- From 1024px the shell is one viewport tall and `main` scrolls; never hide overflow to make a view fit.
- Accessibility is part of every change: semantic landmarks, visible 2px teal focus rings that are not clipped by `clip-path`, real links for navigation, and a modal dialog for the mobile menu.
- Square corners. Angular shapes use the shared notch and skew utilities.
- Package manager: npm.

## Commands

```
npm run dev                    # local development
npm run build                  # production build
npm run lint
npm run typecheck              # next typegen, then tsc
npm run test:e2e               # production build on port 3200, then the Playwright specs
npm run capture:composition    # Phase 1 captures (dev server on port 3100)
python scripts/art/render_backdrop.py     # regenerate candidate C art
python scripts/art/measure_safe_zone.py   # quick p98 screening of hero contrast (approximate)
python scripts/art/contact_sheet.py       # comparison sheets
```

The Playwright specs in `tests/e2e` write screenshots and contrast results to `docs/verification/lobby/`.

## Verification before requesting review

For any UI change, run `npm run test:e2e`: it captures the lobby at 1920 x 1080, 1440 x 900, 1280 x 720, 1024 x 768, 768 x 1024, and 390 x 844 in both default and reduced motion, and every view at desktop, laptop, tablet, and mobile sizes. It also runs the layout (one-viewport fit and glyph containment), keyboard, reduced-motion, and text-contrast tests. Review the screenshots before requesting review. Details are in `docs/implementation-plan.md`, "Verification for Milestone 1".

## Git

- Work on a branch; open a pull request against `main`.
- Commit messages are imperative and specific (for example, "Add Pennant focus and selected states").
- Keep commits focused. Do not mix planning documents with application code unless the document change describes that code.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
