# Portfolio content dossier

Evidence inspected October 14, 2026. This is the editorial source ledger for the pilot, not a claim that all source systems were rerun or audited in production. **U** means Joshua supplied the fact in the October 14 request or follow-up. **R** means inspected source or output. **Q** means unresolved. Repository behavior corroborates implementation; it does not establish sole authorship. Public copy uses U for personal attribution and R for technical detail. No private operational identifiers, mailbox data, client names, employment terms or credentials are reproduced here.

## Source register

### Hermes

Read-only local source at `C:/Projects/project-hermes`, commit `44fb9ec4cd2dfded09ed24cae0cd6cebdb9df376`; relevant GitHub PR metadata was checked live. That commit is on `dev` after documentation-only PR 53, and differs from the October 8 Production commit `24fdc62` (H8) only in `docs/CONTRIBUTING.md` and `supabase/seed.sql`. Links below may require repository access. Do not add these as public product/demo buttons without confirming access and approval.

- **H1 (U):** Joshua's October 14 project background: Software Engineer, Foxtrot Special Projects Group; collaboration with Brandon Hall; enumerated Hermes contributions; Phase 1 production milestone October 8, 2026; pilot support. Also represented in `src/content/projects.ts` and `experience.ts` before this pilot.
- **H2 (R):** `docs/ARCHITECTURE.md`, `src/lib/auth/session.ts`, `src/lib/gmail/thread.ts`, `src/lib/gmail/reply.ts`: application, identity, mail and record boundaries. [Source snapshot](https://github.com/FOXTROT-CO/project-hermes/tree/44fb9ec4cd2dfded09ed24cae0cd6cebdb9df376).
- **H3 (R):** [PR 40](https://github.com/FOXTROT-CO/project-hermes/pull/40), `src/lib/auth/session.ts`, `tests/auth/session-isolation.test.ts`: environment-bound sessions, domain recheck, unidentified-environment refusal. Historic test and local QA reports are evidence of that revision, not fresh production verification.
- **H4 (R):** [PR 41](https://github.com/FOXTROT-CO/project-hermes/pull/41), `src/app/api/auth/google/callback/route.ts`, `tests/auth/callback-session.test.ts`: attempts to revoke refused grants before responding; refusal persists if revocation fails. Shared grant scope can require reconnect elsewhere.
- **H5 (R):** [PR 50](https://github.com/FOXTROT-CO/project-hermes/pull/50), `src/lib/gmail/recipient.ts`, `src/lib/gmail/reply.ts`, `src/app/api/inbox/[threadId]/reply/route.ts`, `tests/gmail/reply.test.ts`, `tests/inbox/reply-composer.test.ts`: shared single-recipient selection; fresh thread read before send; mismatch returns 409 and the current conversation, including a destination that becomes absent.
- **H6 (R):** [Release PR 43](https://github.com/FOXTROT-CO/project-hermes/pull/43) merged October 5, 2026 (`769ea303e99de39fb9101a805ffec4f11fdc6d79`), the first release of the Phase 1 app to Production. Its record and the October 5 comments on issues [35](https://github.com/FOXTROT-CO/project-hermes/issues/35) and [37](https://github.com/FOXTROT-CO/project-hermes/issues/37) report automated, route-protection and refused-account checks, but leave open a normal Production sign-in, cross-environment cookie refusal and a connections-page revocation observation. This remains a historical event; the October 8 release and its acceptance are H8. **Do not describe the October 5 release as fully verified.**
- **H7 (R):** [Runbook PR 49](https://github.com/FOXTROT-CO/project-hermes/pull/49), source file inventory `docs/PILOT-RUNBOOK.md`, and `tests/logging/redaction.test.ts`: operational documentation and logging safeguards exist. Private runbook instructions and pilot identities are intentionally not copied.
- **H8 (R):** [Release PR 52](https://github.com/FOXTROT-CO/project-hermes/pull/52) merged October 8, 2026 at 18:41 UTC as `24fdc624c913210789a7a14ea7b85bef4314f2c7`. It released `dev` to Production with the recipient work (PR 50, merged to `dev` as `407fb60`) and the runbook (PR 49, `aa9fdf1`); the merge commit's tree is identical to `aa9fdf1`. GitHub records a Vercel Production deployment of that commit completing at 18:42 UTC. The records below are historical, as written by their authors:
  - PR 52's description and Brandon Hall's [merge comment](https://github.com/FOXTROT-CO/project-hermes/pull/52#issuecomment-6066684360) report 904 tests in 57 files, typecheck, lint and `preflight:full` passing on the merge head before merge. At this commit, `scripts/preflight.mjs` defines `preflight:full` as test, typecheck, lint, production build and the jsdom load check. The comment also lists 11 anonymous Production checks passing, and says the signed-in recipient line was not yet verified.
  - Brandon Hall's [readiness comment on issue 48](https://github.com/FOXTROT-CO/project-hermes/issues/48#issuecomment-6067584172) (19:35 UTC) records that, on Production, a Workspace sign-in works; the reply composer shows the correct recipient; a real reply reached only that recipient; and sign-out revokes the Google grant, so consent is asked again. It also records that Production and Preview each refuse the other's session cookie, and that a personal Google account is refused with its grant revoked. The comment says each result was confirmed in the database. Issues 35 ([close](https://github.com/FOXTROT-CO/project-hermes/issues/35#issuecomment-6067563849)) and 37 ([close](https://github.com/FOXTROT-CO/project-hermes/issues/37#issuecomment-6067563020)) were closed on this evidence.
  - Still open when checked on October 14: pilot-tracking issue [48](https://github.com/FOXTROT-CO/project-hermes/issues/48), which frames Phase 1's finish line as the pilot itself and records no outcome; it notes that a success criterion still needs agreeing. Follow-up issues [47](https://github.com/FOXTROT-CO/project-hermes/issues/47), [51](https://github.com/FOXTROT-CO/project-hermes/issues/51) and [54](https://github.com/FOXTROT-CO/project-hermes/issues/54) are also open.
  - Checked during this edit: the PR, comment, deployment and issue metadata on GitHub; and, locally, the commit ancestry, the tree comparison and `scripts/preflight.mjs`. Not rerun: tests, builds, any Production request or any signed-in session. Production results are taken from those records and were not observed. Account domains, pilot identities, secret names and data details in the records are intentionally not copied.

### Recolm

- **R1 (U):** Joshua's request and existing `src/content/projects.ts`: developed through JV Digital; confirmed scope includes listings/payment, drafts, moderation, seller dashboards/profiles, video approval, search/filtering, featured listings, expiration/relisting, SEO and maintenance. This is contribution evidence, not proof that every commit is solely his.
- **R2 (R):** `C:/Projects/recolm`, commit `526a022041011cb6d18a6666dce9cfaa536dd21f`, `lib/listing-payments.ts`, `lib/listing-publication.ts`, `prisma/schema.prisma`: listing-scoped checkout intents, ownership and draft validation. [Repository snapshot](https://github.com/JV-Digital-Corp/recolm/tree/526a022041011cb6d18a6666dce9cfaa536dd21f).
- **R3 (R):** same snapshot, `lib/seller-profile-public.ts`, `lib/seller-profile.ts`, `prisma/schema.prisma`: explicit public identity/contact model and visibility gating; account identity is not a substitute for approved public contact.
- **R4 (R):** same snapshot, `lib/listing-video-policy.ts`: public playback requires approved video and a publicly visible listing. Adjacent payment, seller-profile and video-policy test files provide focused regression evidence; not rerun in this portfolio pass.

### Local research and experiments

- **V1 (R):** `C:/Users/Joshua/OneDrive/cowork-projects/valorant-mcnair/outputs/final/final_run_summary.md`, `final_model_results.csv`, `final_temporal_validation.csv`. Frozen outputs inspected directly; no usable Git HEAD found. These take precedence over earlier experimental tables. File hashes are in `content-source-hashes.json`.
- **V2 (R):** that project's `outputs/tables/leakage_audit.txt`, `config.py`: target `win_map`; shifted historical features and coarse ordering caveat. Audit statements describe the inspected run; they are not a fresh independent leakage proof. `config.py` contains older cutoff constants, so identify the frozen split from V1 rather than inferring it from those constants.
- **A1 (R):** `C:/Users/Joshua/OneDrive/cowork-projects/auto-research-agent`: `pyproject.toml` exposes `ara = ara.cli:app`; `ara/cli.py` implements `extract`. No usable Git HEAD or remote found. This matches the supplied ARA identifiers. Do not substitute [paper-qa](https://github.com/medistopia/paper-qa), which Joshua identified as a separate project.
- **A2 (R):** `ara/ingestion/arxiv_fetcher.py`, `ara/ingestion/semantic_scholar.py`, `ara/storage/models.py`, `ara/embeddings/pipeline.py`, `ara/extraction/extractor.py`, `ara/api/main.py`, `frontend/index.html`: fetchers, SQLite-oriented ORM, embeddings, extraction, API and React/Tailwind dashboard source. `ara/scheduler/__init__.py` is only a phase placeholder, despite the README's scheduling claim and declared APScheduler dependency.
- **L1 (R):** `C:/Projects/companion`, not a Git checkout: `README.md`, `package.json`, `main.js`, `preload.js`, `whisper_transcribe.py`, `reminder-intents.js`, `test-intents.js`. Hashes identify inspected source. Personal memory, settings, session logs and conversation data were not used as portfolio evidence.
- **U2 (U):** Joshua's research/personal background in the request and `src/content/research.ts`, `people.ts`, `profile.ts`: UNG CS, ML minor, expected Spring 2027; AI Lab leadership under Prof. Mohammad Mohebi; separate research involvement with Dr. Lai Wei and Dr. Yong Wei. Existing approved collaborator relationship labels remain intact.

## Project Hermes

| Topic | Factual basis / editorial decision |
|---|---|
| Problem / users | Gmail-backed inbox and working context for Foxtrot agents; thread, contact and deal workflows (H1, H2). No measured productivity claim. |
| Role / collaborators | Joshua's Software Engineer role and implementation scope are U; Brandon Hall is a confirmed collaborator. Exact division of responsibilities is Q (H1). |
| Personally implemented | Protected sign-in, Gmail reading/replies, contacts/deals/linking, UI states and keyboard interactions, session/OAuth/logging safeguards, recipient validation, testing/release verification and operational documentation (H1). |
| Architecture / workflow | Next.js UI and server routes; Workspace identity; Gmail read/send; Supabase record context and user-scoped access; Vercel deployment. Open thread → inspect/link contact → compose → revalidate → send (H2, H5). |
| Decisions / alternatives | Environment binding in addition to separate signing secrets; revocation attempt rather than callback refusal alone; visible destination plus server recheck rather than trusting stale composer state (H3–H5). Alternatives are explained as technical comparisons, not claims about undocumented design meetings. |
| Difficulties / tradeoffs | Unknown configuration fails closed and can interrupt access. Environment classes do not isolate individual previews. Shared OAuth grant scope can require reconnect elsewhere. Changed recipients force review and another thread read; reply-all is outside this workflow (H3–H5). |
| Validation | Targeted source tests plus historical PR and issue records, including the October 8 release gate and signed-in Production verification (H3–H8). No signed-in Hermes session or Production request was made for the portfolio; H8 lists what was re-read. |
| Results / limitations | Two releases: the Phase 1 app reached Production on October 5 with checks left open (H6), and the October 8 release of `24fdc62` closed those checks and readied the pilot (H8). H1's October 8 milestone is therefore a sourced production release, not a pilot outcome; the pilot's finish line remained open (H8). Pilot support follows. Desktop-first Phase 1; not a complete Gmail replacement or autonomous agent. No adoption/revenue/time-saving numbers (H1, H2, H6, H8). |
| Status / next | Pilot support (U). Portfolio next steps are sanitized captures and a documented pilot outcome, not an invented product roadmap. |
| Links / assets | Source evidence above; approved illustrative A2-lobby artwork only. No product screenshots or private source links rendered on the public case study. |
| Questions | What work did each collaborator own, including who carried out each verification step? What documented pilot outcome, with its source, date and method, may be published? Which sanitized workflow captures may be published? |

Public narrative: `src/content/hermes-case-study.ts`. Overview/problem/workflow map to H1/H2, role to H1, decisions to H3/H4/H5, verification to H3–H7, milestone to H1, corroborated by H8. Its verification paragraph predates H8 and does not cite it; it remains accurate but conservative. Proposed portfolio next steps are editorial work authorized by this request.

Polish pass (October 14): the overview's problem and delivered cells restate H1/H2 without adoption, time-saving or impact claims; its status cell renders `projects.ts` (H1). The reply-workflow diagram maps sign-in to H2/H3, thread and send to H2/H5, contact/deal context and Supabase's role to H2, and the server recheck and changed-or-missing review path to H5. It describes the single-recipient reply only. The former role and problem sections were folded into the overview and architecture sections; their attribution caveats are kept (the lead paragraph limits the scope to Hermes within Foxtrot OS, and each decision is phrased as work Joshua contributed to). Portfolio-production commentary moved to a closing note; the illustrative-art disclosure is a label on the header image. Follow-up work for every project is planned in `project-refresh-plan.md`.

## Recolm

| Topic | Factual basis / editorial decision |
|---|---|
| Problem / users | Listing marketplace for sellers publishing listings and visitors finding them (R1). Client identity is not approved for publication. |
| Role / collaborators | Developed through Joshua's company JV Digital. Confirmed contribution scope is R1; team size, collaborators and exact ownership boundaries remain Q. |
| Personal implementation | R1's workflow list is safe to attribute. Do not infer sole ownership from the full technology stack. |
| Architecture / workflow | Next.js, Clerk, Stripe, Prisma, Neon, R2 and Hostinger (U). Saved private draft → validate ownership/content → listing-specific publish checkout; relisting is a separate checkout purpose (R2). |
| Decisions / alternatives | Persist the listing before checkout rather than collecting payment without a specific draft. Model checkout intent/purpose explicitly. Public identity/contact is supplied separately from login identity; independent controls gate exposure (R2, R3). |
| Difficulties / tradeoffs | Payment and publication need consistent listing identity across asynchronous steps. Public video needs both moderation approval and listing visibility; approval alone is insufficient (R2, R4). Product defaults must protect private account data (R3). |
| Validation | Payment, seller-profile and video-policy tests inspected as evidence inventory. No fresh Recolm suite or production verification performed. |
| Results / limits | Implementation is evidenced, commercial impact is not. No revenue, traffic, conversion or customer-count claims. |
| Status / next | Local source includes staging/indexing maintenance. Exact public release state and portfolio outcome example require Joshua's confirmation. Next case-study candidate: draft-to-paid publication and public-profile privacy. |
| Links / assets | Repository snapshot is source evidence. Client naming and product captures still require the written permissions in `assets.md`. Current art is illustrative. |
| Questions | Confirm ownership/team boundaries, public link approval, an outcome with evidence, and permission for a sanitized seller workflow capture. |

## Valorant ML

| Topic | Factual basis / editorial decision |
|---|---|
| Problem / users | Applied research into predicting a team's per-map win (`win_map`), using competitive match data. Research audience; no betting or deployment claims (U, V1, V2). |
| Role / collaborators | Joshua identifies this as his applied ML research. Specific coauthors/supervisors and their roles are Q; do not automatically attach the Wei or AI Lab relationships. |
| Personal contribution | XGBoost modeling, leakage-aware features, walk-forward evaluation, ROC AUC/Brier analysis (U). |
| Architecture / workflow | Ingest/clean → build feature bundles → train → temporal validation/audits → freeze outputs. V1 records seed 42 and commands, but the pipeline was not retrained in this pass. |
| Decisions / baselines | Compare dummy priors and logistic regression with XGBoost; evaluate by year instead of a random split (V1). Current-row outcome is excluded with shifted history (V2). |
| Difficulties / tradeoffs | Stage-level chronology and name-based tie-breaking are not exact played-at timestamps. Prior rows can include other maps from the same series. This limits temporal validity; do not call it a proven pre-series or preseason forecast (V2). |
| Validation | Frozen CSV rows corroborate the summary, with a bundle correction below. Duplicate/leakage audits are historical records, not newly rerun audits. |
| Results / limitations | Modest discrimination; performance varies across year-specific tests with different sample sizes. No confidence intervals or causal explanation established here. A decreasing AUC alone does not prove concept drift. |
| Status / next | Frozen final snapshot found. Confirm data/output sharing rights and exact timestamp strategy before a public chart or full study. |
| Links / assets | No confirmed public repository. No research chart published in this pilot. Existing illustrative art is not a result visualization. |
| Questions | Confirm dataset sharing terms, run date/version, intended prediction time, author roles, confidence intervals and whether outputs may be published. |

Verified results from V1 (research rows, **not unique matches**):

| Model / bundle | Train years | Test years | Train / test rows | ROC AUC | Brier |
|---|---|---|---|---|---|
| XGBoost F (+Perf), 33 features | 2021–2024 | 2025–2026 | 50,508 / 3,312 | 0.5939 | 0.24695 |
| Dummy_Prior F | 2021–2024 | 2025–2026 | 50,508 / 3,312 | 0.5000 | 0.25000 |
| Logistic regression A (History) | 2021–2024 | 2025–2026 | 50,508 / 3,312 | 0.5781 | 0.24673 |
| XGBoost F | 2021–2023 | 2024 | 48,300 / 2,208 | 0.6267 | 0.23816 |
| XGBoost F | 2021–2024 | 2025 | 50,508 / 2,554 | 0.6081 | 0.24290 |
| XGBoost F | 2021–2025 | 2026 | 53,062 / 758 | 0.5578 | 0.25635 |
| XGBoost A (History) | 2021–2025 | 2026 | 53,062 / 758 | 0.5691 | 0.25137 |

The supplied 2026 lead (0.5691) is **Bundle A**, not F. A single F trend must use 0.5578. F's primary Brier skill is 0.0122; its 2026 Brier is worse than the 0.25 prior baseline. F is best by primary AUC, not best across every metric: history-only logistic regression has a slightly lower primary Brier. Earlier experimental tables must retain separate run labels.

## Auto Research Agent

| Topic | Factual basis / editorial decision |
|---|---|
| Problem / users | Research discovery/retrieval experiment for small labs (U; A1 README describes intent, not confirmed adoption). |
| Role / collaborators | Joshua is listed as package author; exact personal implementation and collaborator roles still need confirmation. Package metadata alone is not contribution proof. |
| Implemented source | arXiv/Semantic Scholar fetchers, ORM records, title/abstract embeddings, cosine retrieval, structured extraction backends, API and React/Tailwind dashboard are present (A1/A2). Runtime success is not implied by source presence. |
| Workflow | Documented `ara ingest` → embeddings → `ara search`; `ara extract` selects an extraction backend and stores structured records in `extractions` (A1/A2). This is distinct from paper-qa's PDF/FAISS workflow. |
| Decisions / alternatives | Normalized embeddings permit dot-product cosine ranking. Search loads the model's embedding matrix into memory; simple for a small corpus but scales with corpus size. Extracted records are associated with paper/model, supporting skip/resume behavior (A2). |
| Difficulties / tradeoffs | External fetchers and extraction depend on service/model availability. Abstract extraction is not evidence of full-paper understanding. LLM outputs require human verification. |
| Planned vs present | APScheduler is declared, but the scheduler module is a placeholder. Do not describe scheduled ingestion as working. React/Tailwind is confirmed in the single HTML dashboard. Source includes both local Ollama and Anthropic extraction, despite the older Claude-only description (A2). |
| Validation | Test files cover storage, ingestion, embeddings and extraction. Local dependency probe failed on `pydantic_settings`; no ARA tests or API-backed extraction ran. No retrieval benchmark or relevance-quality result verified. |
| Results / status | Experiment with substantial source, no confirmed release or user metrics. |
| Links / assets | No remote URL established. No captures approved. Do not invent a repository URL or merge with paper-qa. |
| Questions / next | Confirm ownership, last working environment, a reproducible sample query/extraction, retrieval evaluation and roadmap. Resolve scheduler claim before expanding public copy. |

## Lyn Desktop Companion

| Topic | Factual basis / editorial decision |
|---|---|
| Problem / users | Experimental local desktop companion for chat and reminders (U, L1). Older-adult assistive memory was a future idea, not a deployed care product. |
| Role / collaborators | Joshua identifies the experiment; exact personal contribution, team and dates remain Q. |
| Source implementation | Electron main process and preload bridge; Ollama chat; Whisper transcription invoked through Python; Piper speech process; reminder engine and memory-related code. Source presence does not establish end-to-end reliability (L1). |
| Workflow | Renderer → preload/IPC → main-process local model or voice tool → renderer response. Intent parser can turn a phrase into a reminder specification. |
| Decisions / tradeoffs | Local inference requires installed models and adequate hardware. README documents a fast vision default and warns that a larger vision model may offload heavily on 8GB VRAM; this is a developer note, not a benchmark or minimum specification. |
| Validation | `node C:/Projects/companion/test-intents.js` passed **27/27** in this pass, including duration reminders and distinguishing prioritization from scheduling. No persisted user data was used. Voice, chat, notifications and memory were not exercised end to end. `npm test` is still a placeholder. |
| Results / limitations | A working reminder-parser demonstration is supported. No latency, care, clinical, reliability or deployment claims. README's on-demand vision description is not a privacy audit of every module. |
| Status / next | Experiment. Next: isolated test profile and sample chat/voice/reminder demonstration, model/hardware matrix and a clear account of Joshua's contribution. |
| Links / assets | No Git checkout/public URL verified. No user conversations, memory files, screen captures or logs are portfolio assets. Illustrative art only. |
| Questions | Which features are currently usable, on which machine/models? What was personally implemented? What demo data and screenshots are approved? |

## Research and personal background

U2 confirms UNG computer science with an ML minor, expected Spring 2027, AI Lab leadership under Prof. Mohammad Mohebi, and founding JV Digital. The Wei research involvement is separate. The approved collaborator labels and listing scope remain unchanged.

For the Wei research: exact problem, intended audience, project title, Joshua's responsibility, methods, architecture/workflow, decisions, validation, deliverables, outcomes and current milestone are **Q**. Prior discussions of scientific ML, materials and crystal generation are context, not proof of an assignment or result. No public project link or research asset is approved. Next step: obtain those five core facts (title, responsibilities, methods, deliverables, milestone) and an approved source; until then keep the restrained existing description.

## Extension order after pilot review

1. Review Hermes accuracy, reading depth and motion restraint. Any stronger release-verification wording cites H8, keeps H6 as the earlier release, needs Joshua's approval and implies no pilot outcome or adoption.
2. Recolm: confirm permissions/ownership, then develop draft/payment and public-identity decisions with sanitized workflow evidence.
3. Valorant ML: confirm sharing and prediction-time limits, then chart a consistent model/bundle from frozen outputs with baselines and uncertainty.
4. ARA and Lyn: reproducible demonstrations and personal contribution statements before stronger implementation or outcome claims.
5. Wei research: supplied assignment details before expanding content. Extend Projects motion to other views only after this pilot is approved.
