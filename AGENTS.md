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

Phase 0 (planning) is complete. Phase 1 (visual direction decision) is next. Do not build homepage components until the Phase 1 gate is approved.

## Hard rules

- **Never invent content.** No made-up accomplishments, metrics, testimonials, dates, employers, client names, or contact details. Unconfirmed fields are `null` in `src/content` and are not rendered.
- **No Riot Games or VALORANT assets** in the repository or the site: no art, icons, logos, maps, fonts, or screenshots. Reference screenshots live only in `references/` (gitignored).
- **No Gmail or Google logos** as decoration. Name Gmail in text only.
- **Do not deploy** and do not add hosting configuration without Joshua's explicit approval.
- **No secrets in Git.** Use `.env.local` (ignored) and keep `.env.example` limited to variable names.
- Stop at each phase gate and present results for review.

## Conventions

- Next.js App Router, React Server Components by default; add `"use client"` only where interaction requires it.
- TypeScript strict. Content is typed and validated with Zod in `src/content/schema.ts`.
- Tailwind CSS v4. Use the design tokens defined in `src/app/globals.css`; do not hard-code colors, durations, or font sizes in components.
- Motion uses the duration and easing tokens. The reduced-motion behavior is defined once, globally. Components must not add their own motion exceptions.
- Accessibility is part of every change: semantic landmarks, visible 2px teal focus rings that are not clipped by `clip-path`, real links for navigation, and a modal dialog for the mobile menu.
- Square corners. Angular shapes use the shared notch and skew utilities.
- Package manager: npm.

## Commands (available once the project is scaffolded)

```
npm run dev          # local development
npm run build        # production build
npm run lint
npm run typecheck
npx playwright test  # screenshots, keyboard, reduced motion
```

## Verification before requesting review

For any UI change, capture screenshots at 1440 x 900, 1280 x 720, and 390 x 844, in both default and reduced motion, and run the keyboard and reduced-motion tests. Details are in `docs/implementation-plan.md`, "Verification for Milestone 1".

## Git

- Work on a branch; open a pull request against `main`.
- Commit messages are imperative and specific (for example, "Add ProjectCard focus and selected states").
- Keep commits focused. Do not mix planning documents with application code unless the document change describes that code.
