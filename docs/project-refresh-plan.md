# Project refresh plan

Written October 14, 2026 from `content-dossier.md` (source IDs such as H1 and V1 refer to it). This is a plan for later work in each project's own repository or data folder. Nothing here was run during the portfolio polish pass, no project repository was changed, and no new result, chart or capture is published. Each case study is updated only after its step below produces evidence and Joshua approves the public wording.

Rules for every project:

- Keep **old outputs** and **new runs** apart. A frozen output is cited as frozen, with its file; a new run gets its own run ID, date, commit and environment, and never replaces the frozen row silently.
- Label every number with its model or configuration, split and sample, and never join results from different configurations into one trend.
- Separate **automated coverage** (tests that run in a command) from **manual or end-to-end checks** (a person on a named machine), and record which was done.
- Personal attribution comes from Joshua (U in the dossier); source presence corroborates implementation but does not prove authorship.
- No secrets, personal data, mailbox content, customer data or private identifiers in any artifact. Use synthetic data.

## Valorant ML

**Evidence baseline.** Frozen outputs in `valorant-mcnair/outputs/final/` (`final_run_summary.md`, `final_model_results.csv`, `final_temporal_validation.csv`; hashes in `content-source-hashes.json`), read directly (V1). The summary records seed 42 and the commands; there is no usable Git HEAD. The leakage audit and `config.py` (V2) describe shifted historical features for the `win_map` target and a coarse ordering caveat; `config.py` carries older cutoff constants, so the frozen split is taken from V1, not from those constants. Rows are research rows, not unique matches. The historical distinctions are fixed:

| Configuration | Split | ROC AUC | Brier | Status |
|---|---|---|---|---|
| XGBoost Bundle F (+Perf), 33 features | Train 2021–2024, test 2025–2026 (50,508 / 3,312 rows) | 0.5939 | 0.24695 | Frozen output; the reference baseline below |
| XGBoost Bundle F | Train 2021–2025, test 2026 (53,062 / 758 rows) | 0.5578 | 0.25635 | Frozen; Bundle F's 2026 temporal AUC |
| XGBoost Bundle A (History) | Train 2021–2025, test 2026 (53,062 / 758 rows) | 0.5691 | 0.25137 | Frozen; **Bundle A**, never part of a Bundle F series |

Bundle F's temporal series is 2024: 0.6267, 2025: 0.6081, 2026: 0.5578. A decreasing AUC alone does not prove concept drift, and F's 2026 Brier is worse than the 0.25 prior.

**Unresolved.** Dataset source and sharing terms; the run date and code version that produced the frozen outputs; the intended prediction time (before the series, or before each map); author and supervisor roles; confidence intervals; whether outputs may be published.

**Next steps, in order.**

1. *Reproduce the frozen baseline.* Put the project under Git, capture the environment (Python and library versions, lock file), and rerun the recorded commands with seed 42. Compare the reproduced Bundle F 2021–2024 / 2025–2026 row with the frozen row. Record the reproduction under its own run ID; if it differs, document the difference rather than overwriting the frozen file.
2. *Inspect chronology and leakage.* Establish what ordering key the features use (stage-level dates and name-based tie-breaking are not played-at timestamps), whether history rows can include other maps of the same series, and whether every shifted feature uses only rows strictly before the chosen prediction time. Fix the prediction time explicitly. Rerun the duplicate and leakage audits as new, dated checks.
3. *Compare any new model against the identified baseline.* Only after steps 1 and 2: evaluate a candidate against XGBoost Bundle F (train 2021–2024, test 2025–2026, AUC 0.5939, Brier 0.24695) and the dummy-prior and Bundle A logistic-regression baselines, with the same splits, rows, feature-availability rule, seed protocol and metrics. If step 2 changes the features or ordering, rebuild the baseline under the corrected conditions first and label it as a new baseline.

**Validation.** Reproduction tolerance stated before the run; automated tests asserting that no feature reads a row at or after the prediction time; per-year results reported with their sample sizes; bootstrap confidence intervals for AUC and Brier; one configuration per chart.

**Artifacts for an updated case study.** Repository commit and environment lock; a dated run log; a results table keyed by run ID, bundle and split; the corrected leakage audit; a written data-sharing statement; author roles. A chart of one consistent configuration only after sharing approval.

## Auto Research Agent

**Evidence baseline.** Source in `auto-research-agent` with no usable Git HEAD or remote (A1). `pyproject.toml` exposes `ara = ara.cli:app`, and `ara/cli.py` implements `extract`. Present: arXiv and Semantic Scholar fetchers, a SQLite-oriented ORM, title/abstract embeddings with cosine ranking, extraction backends for local Ollama and Anthropic, a FastAPI API and a single-file React/Tailwind dashboard (A2). Test files cover storage, ingestion, embeddings and extraction, but none ran: the local dependency probe failed on `pydantic_settings`. **The scheduler is a placeholder** (`ara/scheduler/__init__.py`), despite the README and the declared APScheduler dependency. It is a separate project from paper-qa.

**Unresolved.** Joshua's personal implementation and any collaborators; the last working environment; a reproducible sample query and extraction; whether retrieval quality has ever been evaluated; the roadmap.

**Next steps.**

1. *Working installation.* Put the source under Git, create a fresh virtual environment, pin dependencies (resolving `pydantic_settings`), and record the Python version. Run the existing test files and record which pass.
2. *Smoke test each stage* with a small fixed corpus and no paid keys: ingest a bounded arXiv query; build embeddings; run `ara search` for a query whose relevant papers are known; run `ara extract` with the local Ollama backend and confirm records land in `extractions` and are skipped on rerun; call the API's search and paper endpoints; load the dashboard against that database.
3. *Possible future work: scheduling.* Implement scheduled ingestion with APScheduler and verify it with a test that registers the job and runs it against a mocked fetcher. Until that exists, correct the README rather than describing scheduling as working.

**Validation.** A pass/fail checklist with logs for each stage; network calls mocked or recorded for repeatable tests; a small hand-labelled query set before any retrieval-quality claim; extracted records spot-checked by a person, since LLM output needs verification.

**Artifacts for an updated case study.** Commit and verified install instructions; the smoke-test transcript; an approved dashboard capture on public papers; a contribution statement; a statement of what is planned versus present.

## Lyn Desktop Companion

**Evidence baseline.** Source in `C:/Projects/companion`, not a Git checkout (L1): Electron main process and preload bridge, Ollama chat, Whisper transcription through Python, Piper speech, a reminder engine and memory-related code. **Existing automated coverage** is the reminder intent parser only: `node test-intents.js` passed 27/27 in the pilot, including duration reminders and telling prioritization apart from scheduling. `npm test` is a placeholder. **Untested end to end:** reminders being stored, firing and notifying; memory and persona behavior; voice input and output; chat; vision. No personal memory, settings, logs or conversations were used.

**Unresolved.** Which features work today, on which machine and models; Joshua's personal contribution; which modules implement memory and persona, and how they are meant to be separated; approved demo data and screenshots.

**Next steps.**

1. *Isolated test profile.* Run the app against a temporary user-data directory seeded with synthetic data, so no personal data is read or written. Put the source under Git and point `npm test` at `test-intents.js` plus the new tests.
2. *Reminders.* With a fake clock, check that a parsed reminder is persisted, survives a restart and fires its notification at the due time.
3. *Memory and persona separation.* After identifying the modules, check that writing or clearing a memory leaves the persona configuration unchanged, that changing the persona leaves stored memories unchanged, and that each is stored where documented.
4. *Voice.* A fixed synthetic WAV through the Whisper path yields the expected transcript; Piper produces audio of non-zero length for a fixed sentence. Record model names, versions and hardware.

**Validation.** Report automated results and manual end-to-end checks separately, with the machine and model matrix for each manual run. Keep the README's 8GB VRAM vision note as a developer note, not a benchmark.

**Artifacts for an updated case study.** Commit; test report; a short demonstration on synthetic data; the model and hardware matrix; a contribution statement; approved screenshots with no personal data.

## Recolm

**Evidence baseline.** Source at commit `526a022041011cb6d18a6666dce9cfaa536dd21f` (R2–R4): listing-scoped checkout intents and ownership/draft validation (`lib/listing-payments.ts`, `lib/listing-publication.ts`), a public seller identity separate from login identity with visibility gating (`lib/seller-profile-public.ts`, `lib/seller-profile.ts`), and public video only for approved video on a publicly visible listing (`lib/listing-video-policy.ts`). Payment, seller-profile and video-policy tests exist but were not rerun. Joshua's contribution scope is R1, through JV Digital; it does not establish sole ownership. The client name is not approved for publication.

**Unresolved.** Ownership and team boundaries; release state and public link approval; an outcome with evidence; written permission for sanitized captures and client naming (`assets.md`).

**Next steps: one focused workflow verification pass.** At a pinned commit, run the payment, seller-profile and video-policy tests. Then, on staging with Stripe in test mode and a synthetic seller: save a private draft; confirm validation blocks an incomplete or foreign draft; complete the listing-specific publish checkout and confirm the same listing is published; run a relist as its own checkout purpose; confirm the public profile shows only the approved public identity and contact; confirm a video stays private until it is approved and its listing is public.

**Validation.** Test results tied to the commit; a staging checklist with the listing identity traced through checkout and publication; no production data.

**Artifacts for an updated case study.** Written permissions; sanitized captures with synthetic data (draft editor, checkout handoff, seller dashboard, public profile); an original draft-to-paid publication diagram; a contribution statement; any outcome only with its evidence.

## Project Hermes

**Evidence baseline.** H1–H7. The October 8, 2026 Phase 1 production milestone and Joshua's contribution scope are user-supplied (H1); the release code merged October 5 (H6), and its record lists open production checks and a partially verified revocation observation. The case study's technical claims map to source and historical PRs; no new signed-in or production audit was performed.

**Unresolved.** What marked October 8 acceptance; which remaining production checks closed, with evidence; the division of work with Brandon Hall; which sanitized workflow and outcome may be published.

**Next steps (portfolio, not product).** Request Foxtrot's approval for sanitized product captures made with a synthetic mailbox: the thread view, the contact and deal rail, the composer showing its destination, and the changed-recipient review state. Agree a documented pilot outcome that Foxtrot is willing to publish, with its source, date and method.

**Validation.** Written approval; a review of every capture for personal or customer data; an outcome statement that cites its source. No adoption, time-saving or impact figure without that statement.

**Artifacts for an updated case study.** Approved captures; the outcome statement; a clarified release chronology; the confirmed division of responsibilities.

## Wei research

**Evidence baseline.** Joshua's separate research involvement with Dr. Lai Wei and Dr. Yong Wei (U2) and the approved collaborator labels. Earlier discussion of scientific ML, materials and crystal generation is context, not evidence of an assignment or result.

**Unresolved, and left unresolved until supplied:**

- Project title.
- Joshua's responsibilities.
- Methods.
- Deliverables.
- Current milestone.

Also needed: an approved source or link, and permission for any research asset.

**Next step.** Obtain those facts from Joshua (and, where appropriate, Dr. Lai Wei and Dr. Yong Wei). Until then the existing restrained description stays, and no experiment or result is proposed here.

## Suggested order

1. Hermes and Recolm permissions, since they only need approvals and one verification pass.
2. Valorant ML reproduction and chronology inspection, before any new modeling.
3. Auto Research Agent installation and smoke test; Lyn test profile and reminder, memory and voice checks.
4. Wei research once its five facts are supplied.
