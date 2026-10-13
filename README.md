# Joshua Venegas Portfolio

Interactive portfolio showcasing Joshua Venegas's software engineering, applied machine learning, and project leadership.

## Purpose

This site helps recruiters and collaborators quickly understand what Joshua builds, what he personally contributed, and how to reach him. Joshua is a University of North Georgia computer science student with a machine learning minor, an AI Lab team leader, and the founder of JV Digital.

The portfolio presents real work through case studies that cover the problem, Joshua's role, implementation decisions, evidence, and outcomes.

Featured projects:

- **Project Hermes**: a Gmail-backed workspace for agents.
- **Recolm**: a listing marketplace developed through JV Digital.
- **Valorant ML**: research involving competitive VALORANT data and predictive modeling.

Project details, links, and outcomes will be added as Joshua supplies and confirms them. Nothing on the site is placeholder marketing copy.

## Development status

**Phase 1, visual direction.** The project is scaffolded and a development-only composition study compares three background candidates. The homepage itself is not built yet.

| Phase | Status |
|-------|--------|
| 0. Repository and planning | Complete |
| 1. Visual direction decision (key art and project art) | In review: see [docs/verification/phase-1](docs/verification/phase-1/README.md) |
| 2. Milestone 1: homepage with navigation, project cards, mobile layout | Not started |
| 3 to 6. Case studies, inner pages, expanded verification, deployment | Not started |

See [docs/implementation-plan.md](docs/implementation-plan.md) for details.

## Development

Requires Node 22 and npm. Python 3 with NumPy and Pillow is only needed for the art scripts in `scripts/art`.

```
npm install
npm run dev        # http://localhost:3000; composition study at /lab/composition
npm run lint
npm run typecheck
```

## Stack

- Next.js 16 (App Router) with React 19 and TypeScript (strict)
- Tailwind CSS v4 with design tokens
- Typed content modules (Zod validation and MDX case studies are planned)
- Playwright for screenshot, keyboard, and reduced-motion verification
- No WebGL: the cinematic look comes from rendered key art and layered CSS (rationale in the implementation plan)

## Visual inspiration

The design takes its cues from the VALORANT game client's menus: a cinematic background with a single focal light, deep navy surfaces, hairline-bordered translucent panels, angular parallelogram navigation, tall lineup-style cards, and rationed teal, gold, and coral accents.

The Play lobby is the primary composition reference: an identity column at left, a raised lead card in a lineup at center, a panel stack at right, and one primary action below. The game is a reference for **visual care, not content**. The site uses an original identity built on Joshua's name, open-licensed typefaces, and original or properly licensed artwork. It contains no Riot Games assets.

## Documentation

- [docs/design.md](docs/design.md): composition, color, typography, components, motion, responsive behavior, accessibility
- [docs/implementation-plan.md](docs/implementation-plan.md): phases, Milestone 1 scope, verification
- [docs/assets.md](docs/assets.md): artwork and content needs, placement, sourcing, licensing
- [AGENTS.md](AGENTS.md): guidance for coding agents

## Disclaimer

This project is not affiliated with or endorsed by Riot Games. VALORANT is a trademark of Riot Games, Inc. Gmail is a trademark of Google LLC.
