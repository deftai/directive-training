# Directive source baseline

## Bound release identity for the 0.119.5 upgrade

The implementation branch bound npm `latest` once, before any learner-baseline edit, on
2026-09-20. That frozen target is Directive 0.119.5. A later npm release is follow-up work
unless it invalidates a command surface re-probed on this branch.

| Evidence | Verified result |
| --- | --- |
| Branch start | `codex/deft-update-0.119.5` opened from `origin/master` commit `f4650085e02f8d2a32f2d3b6486d80b426c4cf37`. |
| npm target | `@deftai/directive@0.119.5`; npm `latest` and `version` both resolved to `0.119.5`. |
| Exact package graph | `@deftai/directive@0.119.5`, `@deftai/directive-core@0.119.5`, `@deftai/directive-content@0.119.5`, and `@deftai/directive-types@0.119.5`. Fixture overrides keep this four-package graph exact. |
| Package integrities | directive `sha512-3JMnNwtJmc2MLzCQif8k6wAKBuQSUSTSVc0s5c+DWxlHUoifG1jg31mcRLh9/atvoZToFHMlSmsIzeLi9RgOEg==`; core `sha512-kli0HyLcnBlTxjbs9zbt1ZnRWPDNTKP1hExTFfhS92om1uWENZKQbiLJj7960q8tzx03vITDX2KMrKXlmc+LYA==`; content `sha512-czIapjWC892OCYIcMy7Pe/vlkKZAJ1DMkPnRxZDhZpGw5EBSoWNcxrbb/VObIOCUG4D0mAhhQmfUf2+KL1UdTg==`; types `sha512-hv/SKDlwIxFzZlPmdkK+vb9xlDqmr+Sz/M3AK0pnm6W+QsvtoYyk8pZ1FChvpKS9EwvtQ+1wpA82tVjYpxkxFg==`. |
| Release tag | Annotated tag `v0.119.5`; tag object `f8054b3402881648dfc5893b5b3b8825acf83194`. |
| Release commit | `75e7d33f114b0e2e67741257813c095e74d9668f`; the peeled tag and npm `gitHead` agree for all four packages. |
| Binding probes | `npm view` resolved versions, dependency ranges, integrities, and npm `gitHead`; the GitHub API resolved the annotated tag and peeled commit; the live CLI reported `@deftai/directive-core@0.119.5`. |
| Command probes | An unpinned disposable no-remote `init --json` emitted parseable JSON and created the exact private package pin and 0.119.5 generation. Its isolated install resolved the exact four-package graph. `toolchain:check --help`, `verify:ac --help`, and `check --help` still reject `--help` with exit 2. The fixture suites exercise the remaining taught lifecycle, session, preflight, story-ready, acceptance, and check surfaces. |
| Collapse state | The live authoring CLI, package pin, tracked generation, managed guidance body, xBRIEF pin, fixtures, and current learner surfaces all target 0.119.5. The generated `AGENTS.md` opener retains `sha=0.119.4` as the last managed-body rewrite provenance because the 0.119.5 template body is byte-identical; both `deft agents:refresh --check` and `deft agents:refresh` confirm the managed body is current against the 0.119.5 deposit. Historical 0.112.0 evidence remains labeled in `SOURCE-NOTES.md` and delivery records. |
| Red checkpoint | With the root pin already refreshed but the README still on 0.119.2, `npm run test:teaching-baseline` collected 6 tests: 5 passed and 1 failed on the exact 0.119.5-versus-0.119.2 mismatch. No test was skipped. |
| Post-collapse executable checkpoint | After the 0.119.5 collapse, `npm run test:baseline-upgrade` passed all 65 tests on macOS/zsh. Linux/bash and Windows/PowerShell remain candidates pending native replay. |
| Verification date | 2026-09-20. |

This manifest fixes the curriculum's version-sensitive claims to Directive 0.119.5. It was
revalidated on 2026-09-20 and must be refreshed when the project pin changes.

## Release identity

| Evidence | Verified result |
| --- | --- |
| Consumer project pin | `package.json` has exact dev dependency `@deftai/directive: 0.119.5`. |
| Executables used for probes | The release bind used the 0.119.5 authoring CLI. The unpinned-init proof and executable fixture suites use project-local, pin-matched launchers in disposable no-remote repositories. |
| Installed packages | The disposable release probe and fixture installs resolve CLI, core, content, and types to 0.119.5. The training repository itself records a pin but intentionally contains no project-local install or lockfile. |
| Runtime version report | The live authoring CLI and disposable project-local CLI report `@deftai/directive-core@0.119.5`. |
| Consumer deposit | The tracked generation record and ignored deposit report payload, templates, skills, and docs at 0.119.5. |
| Release tag | Annotated tag `v0.119.5`; tag object `f8054b3402881648dfc5893b5b3b8825acf83194`. |
| Release commit | `75e7d33f114b0e2e67741257813c095e74d9668f`. The tag peel and npm `gitHead` agree. |
| npm artifact | Version 0.119.5; integrity `sha512-3JMnNwtJmc2MLzCQif8k6wAKBuQSUSTSVc0s5c+DWxlHUoifG1jg31mcRLh9/atvoZToFHMlSmsIzeLi9RgOEg==`. |
| Curriculum model | Current authoring uses `xBRIEFInfo.version: "0.8"` and the `xbrief/` lifecycle. |

Use the immutable [release commit][release-commit] for citations. The human-friendly
[v0.119.5 tag][release-tag] and [npm package record][npm-release] identify the same release.

## Current platform evidence

These markers describe the current 0.119.5 teaching baseline. Platform records in
`SOURCE-NOTES.md` below its historical boundary remain release history and do not promote a
current platform.

- `teaching-platform-proof:macos-zsh status=verified date=2026-09-20 evidence=baseline-upgrade-65-of-65`
- `teaching-platform-proof:linux-bash status=candidate date=2026-09-20 evidence=not-run`
- `teaching-platform-proof:windows-pwsh7 status=candidate date=2026-09-20 evidence=not-run`

## Evidence precedence

When evidence disagrees, use this order:

1. Observed behavior from the installed, pin-matched CLI or deterministic gate.
1. Source at the immutable release commit.
1. Verified 0.119.5 package/deposit bytes and hashes recorded during the
   module-specific proofs.
1. This curriculum's explanation.

The first three layers define upstream behavior. The curriculum paraphrases them; any local
practice must be explicit and cite its governing source.

Upstream source-repository docs usually show unprefixed `task <verb>` commands. This consumer
repository includes the framework Taskfile as `deft`, so its root-level spelling is
`task deft:<verb>`. Use `directive <verb>` only when `directive commands` registers that verb.

## Statement-to-source map

The source locations and uniquely named headings or labels below are exact in the pinned
release.

| Curriculum claim | Pinned source and heading |
| --- | --- |
| Directive is a repository practice layer, not a coding host, standalone skill pack, or application orchestrator. | [README.md][src-readme] — opening `What it is` summary; [docs/CATEGORY.md][src-category] — `Four-way fit table`, `What Directive is`, `What Directive is not`. |
| Directive's three pillars are shared standards, durable work state, and deterministic gates in the repository. | [docs/CATEGORY.md][src-category] — `What Directive is`; [README.md][src-readme] — opening `What it is` summary. |
| New xBRIEF writes use schema 0.8; schema 0.6 remains legacy read/migration compatibility. | [content/conventions/references.md][src-references] — `Schema Version: v0.8 (canonical write)`. |
| Deft names the company; Directive names the installed product and primary CLI, while `.deft/` remains its on-disk footprint. | [README.md][src-readme] — opening naming statement and `Getting Started`; [docs/CATEGORY.md][src-category] — `What Directive is`. |
| npm plus `directive init`, `directive update`, and `directive doctor` form the current consumer entry path. | [README.md][src-readme] — `Getting Started`, `1. Install and initialize`; [docs/CONCEPTS.md][src-concepts] — `Installer Layout`. |
| Current consumer prerequisites are Node.js 20 or newer, Git, GitHub CLI, and the selected npm/pnpm package manager; the Module 2 proof uses a supported Node.js 24 line. | [content/docs/getting-started.md][src-getting-started] — `Prerequisites`, `Installation`, `npm (canonical)`; live `directive toolchain:check --consumer --project-root .`. |
| Use `init` for a repository without a Directive footprint, `update` to reconcile an initialized consumer, and `doctor` when state is unknown or unhealthy. An `init` against an existing footprint delegates to update. | [README.md][src-readme] — `Getting Started`; [content/skills/deft-directive-setup/SKILL.md][skill-setup] — `Consumer-first default (#1813)`; [docs/CONCEPTS.md][src-concepts] — `Installer Layout`; released `init`, `update`, and `doctor` help surfaces. |
| Consumer work uses the installed CLI or the consumer project's `task deft:*` namespace; framework-maintainer tasks belong to the separate `deftai/directive` source checkout. | [content/skills/deft-directive-setup/SKILL.md][skill-setup] — `Consumer-first default (#1813)`, `Contributor / framework-maintainer path (secondary)`; [main.md][src-main] — `Publishing deft tasks in your project root`; [docs/CONCEPTS.md][src-concepts] — `Taskfile First`. |
| Authoritative xBRIEF and authored product files, tracked managed integration, and ignored reconstitutable/runtime artifacts are different classes; tracked does not mean authoritative. | [README.md][src-readme] — `What gets tracked vs ignored`; [SKILL.md][src-core-skill] — `Project Root vs Framework Internals`; [docs/CONCEPTS.md][src-concepts] — `xBRIEF Is The Durable State`, `Source Of Truth Vs Projection`. |
| Guidance is modular and loaded for the work at hand, with stronger deterministic surfaces preferred over prose. | [docs/CONCEPTS.md][src-concepts] — `Lazy Loading And Modularity`, `Rule Strength`; [README.md][src-readme] — `Rule Hierarchy`. |
| Behavior-source specificity and enforcement strength are separate axes: USER.md Personal preferences override project definition and USER.md Defaults, while deterministic checks outrank weaker prose. | [README.md][src-readme] — `Rule Hierarchy`; [SKILL.md][src-core-skill] — `Core Principle: Rule Precedence`, `File Reading Strategy (Lazy Loading)`; [docs/CONCEPTS.md][src-concepts] — `Rule Strength`. |
| Implementation authority is the conjunction of an active xBRIEF and live operator implementation intent; completed xBRIEFs are delivery records, not future authorization. | [main.md][src-main] — `xBRIEF Persistence`; [content/commands.md][src-commands] — `Scope xBRIEF Lifecycle`, `Session routing (#2176)`. |
| xBRIEF is durable project and work state; generated Markdown and codebase maps are projections. | [docs/CONCEPTS.md][src-concepts] — `xBRIEF Is The Durable State`, `Source Of Truth Vs Projection`. |
| Scope moves through proposed, pending, active, and completed states by lifecycle commands, with folder and status kept together. | [docs/CONCEPTS.md][src-concepts] — `Scope Lifecycle`; [content/commands.md][src-commands] — `Scope xBRIEF Lifecycle`. |
| The workflow has an inception phase and a recurring session phase; strategy, triage, slicing, implementation, review, and shipping can loop. | [content/docs/directive-lifecycle.md][src-lifecycle] — `The two phases`, `Stage → real surface`, `Why it loops`. |
| Session start is the ordinary re-entry point, while mutation work adds ritual, story-ready, and xBRIEF preflight gates. | [content/docs/directive-lifecycle.md][src-lifecycle] — `Resume (the usual entry, every session)`; [content/commands.md][src-commands] — `Session-start ritual (#1149)`, `Session routing (#2176)`. |
| Deterministic checks are evidence; focused checks support iteration and the full check is the merge chokepoint. | [docs/CONCEPTS.md][src-concepts] — `Quality Gates`; [content/commands.md][src-commands] — `Quality And Verification Commands`, `Gate throughput — iteration fast lane (#1704)`. |
| Pre-PR self-review follows Read, Write, Lint, Diff, and Loop; any edit restarts the pass and exit requires a complete pass with no further edits. | [deft-directive-pre-pr][skill-pre-pr] — `Loop Phases`, `Phase 1 -- Read` through `Phase 5 -- Loop`, `Exit Condition`. |
| Review findings are read and classified before editing; severity, acceptance scope, blocking status, and disposition remain explicit. | [content/coding/review.md][src-review] — `Universal Requirements`, `Severity and merge gate`, `Anti-Patterns`; [deft-directive-review-cycle][skill-review] — `Principle Authority`, Steps 1–3 and 5–6. |
| Durable edits belong in xBRIEF source; rendered specification, PRD, roadmap, and project views are regenerated. | [content/commands.md][src-commands] — `Generated Document Commands`; [docs/CONCEPTS.md][src-concepts] — `Source Of Truth Vs Projection`. |
| Preparatory strategies inform a later specification; spec-generating strategies create lifecycle artifacts. | [content/strategies/README.md][src-strategies] — `Available Strategies`, `Strategy Types`, `v0.20 Output Contract (for spec-generating strategies)`. |
| An idea can enter a bounded strategy choice, including a structured interview, and current setup can record the result directly as proposed scope; `specification.xbrief.json` is optional compatibility state, not a required intermediate artifact. | [content/docs/directive-lifecycle.md][src-lifecycle] — `Stage → real surface`; [content/strategies/interview.md][src-interview] — choice and interview sections; [deft-directive-setup][skill-setup] — current strategy dispatch and compatibility handling. |
| Testable story behavior belongs in `plan.items[].narrative.Acceptance`, ordinarily with two to five criteria plus evidence and traceability. | [deft-directive-decompose][skill-decompose] — decomposition contract; [content/vbrief/vbrief.md][src-taxonomy] — story and acceptance model; [content/verification/verification.md][src-verification] and [content/verification/plan-checking.md][src-plan-checking] — observable evidence and plan checks. |
| A vertical slice is an independently demoable, human-observable capability through the relevant layers; a tracer bullet is a narrow complete path that remains independently demonstrable and verifiable. Horizontal layer-only work is the wrong story shape. | [content/glossary.md][src-glossary-upstream] — vertical and horizontal definitions; [deft-directive-gh-slice][skill-gh-slice] — tracer-bullet slicing contract. |
| Epic decomposition produces ordered, independently verifiable stories in a dependency DAG. Story dependencies use `plan.metadata.swarm.depends_on`; phase or epic metadata may supplement them with `plan.metadata.dependencies`. | [content/vbrief/vbrief.md][src-taxonomy] — epic, story, and DAG model; [deft-directive-decompose][skill-decompose] — story boundaries and dependencies; [deft-directive-setup][skill-setup] — dependency field placement. |
| A proposed scope is reviewable candidate state, not implementation authority. Promotion, activation, and a separate live implementation instruction remain distinct lifecycle concerns. | [content/commands.md][src-commands] — `Scope xBRIEF Lifecycle`; [main.md][src-main] — `xBRIEF Persistence`. |
| `Exclusions` and `Literal inspection` are Module 6 worksheet evidence fields, not canonical xBRIEF keys. Static inspection can prove artifact shape but cannot universally prove executable behavior. | [content/skills/deft-directive-setup/SKILL.md][skill-setup] — scope construction; [content/verification/verification.md][src-verification] — evidence model. |
| Implemented, PR-open, integration-merged, and delivered are distinct; deployed and UAT-verified require separate evidence. | [content/docs/directive-lifecycle.md][src-lifecycle] — `Delivery integrity vs deploy / UAT (#3041 / #3380)`. |
| Task/CLI surfaces replace the retired Python launcher for current work. | [docs/CONCEPTS.md][src-concepts] — `Taskfile First`; [content/commands.md][src-commands] — `Command Lifecycle: retired Python launcher vs task`. |

## Beginner-path boundary

Teach `xbrief/` and schema 0.8 as current behavior. Treat `vbrief/`, schema 0.6,
`.deft/core/run`, retired Python launchers, and frozen migration procedures as legacy. Mention
them only to recognize an old project and route it to maintainer or migration guidance.

The phrase `v0.20 Output Contract` in the strategy source names a historical document-model
cutover. It does not change the current xBRIEF schema version from 0.8.

## Modules 2–3 command surfaces

The following literal probes were run against 0.119.5. Detailed exits and anomalies are in
[SOURCE-NOTES.md](./SOURCE-NOTES.md#cli-help-probes).

| Surface tested | Result used by the curriculum |
| --- | --- |
| `directive --help` | Exit 0; curated command overview. |
| `directive commands` | Exit 0; full registered-command inventory. |
| `directive init --help` | Exit 0; verified options include `--repo-root` and `--yes`. |
| `directive update --help` | Exit 0; verified update and dry-run surface. |
| `directive doctor --help` | Exit 0; verified diagnostic surface. |
| `directive toolchain:check --help` | Exit 2 after printing usage because 0.119.5 rejects `--help`; this is recorded, not hidden. |
| `directive toolchain:check --consumer --project-root .` | Exit 0 on the local macOS/zsh proof. The prior Linux and Windows matrix is historical 0.112.0 evidence, so those 0.119.5 paths remain candidates pending a native run. |
| `directive scope:record-approved-scope --help` | Exit 0; its documented `-- <xbrief-path>` form and the direct positional form both reach the operator-TTY authorization gate. |

## Modules 2–3 released disagreements

These disagreements change what the learner path can safely promise. Probe details and less
central release discrepancies remain in [SOURCE-NOTES.md](./SOURCE-NOTES.md#recorded-disagreements-and-curriculum-decisions).

| Released prose or help | Observed 0.119.5 behavior | Curriculum treatment |
| --- | --- | --- |
| The README says init creates a committed package pin. | Unpinned disposable init created a private `package.json` with exact `@deftai/directive: 0.119.5`. | Teach init ownership. The lab pre-seeds its fixture only to lock the full four-package graph before install, not to compensate for missing init behavior. |
| Prose describes a new empty directory as a scaffold. | Running Git first made the otherwise empty repository select `brownfield-install`. | Expect brownfield for this Git-first safety path; do not reinterpret it as the wrong command. |
| The project requires per-verb help checks. | `toolchain:check --help` prints usage but exits 2 with an unrecognized-argument diagnostic. | Record the defect, prove registration with `directive commands`, and use only the tested consumer form. |
| Doctor is commonly described as read-only and prose can imply a clean result. | Doctor can write ignored throttle state and can exit 0 with classified warnings. | Say it does not mutate tracked product state or remotes; preserve and classify warnings. |
| Brownfield init appends canonical ignore rules. | It added `/USER.md` and `/.deft/USER.md` in the disposable proof. | The lab still adds and proves the rules before init so personal authority never becomes trackable during the exercise. |
| A learner might expect generated integration to remain merely untracked. | Init staged most managed paths, and the default-branch hook rejected the first checkpoint on `main`. | Inspect the staged-plus-untracked union and create the disposable feature branch before init. |

Earlier release deltas, including the approved-scope separator and complete headless JSON,
remain historical in [SOURCE-NOTES.md](./SOURCE-NOTES.md). They are not current learner warnings.

## Modules 4–5 source and command boundary

Module 4 is a command-free classification exercise. It uses the release's
[artifact taxonomy][src-taxonomy], [continue checkpoint contract][src-continue], and
[0.8 schema][src-schema], interpreted with the current xBRIEF persistence rule in
[main.md][src-main]. The taxonomy retains legacy filenames and schema examples. These
lessons paraphrase the roles and use current `xbrief/`, `.xbrief.json`, and schema 0.8
authoring names; they do not reproduce old envelopes. Pinned prose disagrees on the
destination of terminal `failed` scopes, so that transition is not taught.

Module 5 uses one prepared, fictional MAP fixture. Authored architecture metadata in
`PROJECT-DEFINITION` and facts extracted from its bounded source glob feed the generated
MAP. The [renderer implementation][src-map] and [freshness implementation][src-map-fresh]
support the concrete behavior; learners do not need to inspect framework internals.

| Surface | Verified boundary at 0.119.5 |
| --- | --- |
| `directive codebase:map --project-root .` | Registered CLI renderer; exercised through the disposable fixture's explicit local binary. |
| `directive verify:codebase-map-fresh --project-root .` | Registered freshness check; existing stale output fails, but absent MAP can exit 0. The lab independently proves MAP existence and contents. |
| Per-verb `--help` for those two verbs | The flag is ignored: the renderer writes and the freshness verifier checks. These are not safe discovery commands outside a disposable probe. |
| `directive spec:render` and `directive project:render` | Registered inventory and pinned source inspected; not executed as Lab 5 exercises. |
| `task deft:roadmap:render` | Present in this consumer's Taskfile include. `roadmap:render` is not in the 0.119.5 CLI inventory; do not invent a direct CLI equivalent. |

Lab 5 has historical platform evidence in [source notes](./SOURCE-NOTES.md#modules-45-verification),
but that evidence does not establish current 0.119.5 platform support. The local macOS/zsh
baseline-upgrade run is current; Linux/bash and Windows/PowerShell remain candidates pending
their own pin-matched native replays.

## Module 6 source boundary

Module 6 is a command-free work-shaping exercise. Its fictional worksheet teaches four
observable outcomes: reshape horizontal component work into one vertical slice; trace an idea
through a bounded strategy choice, observable acceptance, and schema-0.8 proposed scope;
decompose an epic into ordered independently verifiable slices with dependency and boundary
rationale; and classify fixed mechanism-shaping facts as route, no route, or insufficient
evidence before lifecycle work begins.

The learner writes scratch notes only. The proposed artifact remains candidate state with
`plan.status: proposed`; it does not authorize implementation, promotion, or activation. The
lesson names a standalone specification file as optional compatibility state rather than a
required current setup artifact. Its `Exclusions` and `Literal inspection` columns are course
worksheet fields, not invented canonical xBRIEF keys. “Independently verifiable” is the
universal slice evidence boundary taught here; the course does not claim every slice is
independently deployable or that static inspection proves running behavior.

The O6.4 routing matrix is a curricular, human-semantic checkpoint. Directive 0.119.5 does
not compute whether a proposal is mechanism-shaped, and `scope:promote` does not fail closed
on that judgment. A passing matrix must cite the controlling supplied fact, select the
disposition, and name the safe next action; the route case also names the proposed mechanism
revision.

The pinned-source inspection and disagreements for this module are recorded in
[SOURCE-NOTES.md](./SOURCE-NOTES.md#module-6-verification). Later lifecycle execution,
implementation, review, and shipping procedures remain reserved for their own modules.

## Module 7 lifecycle validation

Module 7 executes the real 0.119.5 consumer Task lifecycle inside a unique fictional
operating-system temporary repository. The fixture has an exact CLI pin plus exact
core/content/types overrides, an ignored 0.119.5 content deposit, a feature branch, and no
remote. Its Task PATH exposes only the attempt's package launchers and individually resolved
support tools, preventing the newer global Directive from shadowing the taught release.
The lesson requires a passing O6.4 routing artifact before this executable lab; that hold is
curricular evidence, not a new lifecycle-engine gate.

| Surface | Verified 0.119.5 result |
| --- | --- |
| Local `directive xbrief:preflight --vbrief-path xbrief/proposed/<story>` | Exit `1`; proposed is not eligible for implementation. The option name retains legacy wording. |
| `task deft:xbrief:preflight` on proposed | Nonzero; go-task 3.50.0 returned `201` while preserving the child exit `1`. The wrapper value is environment evidence, not an engine contract. |
| `task deft:scope:promote` | Exit `0`; `proposed/proposed` became `pending/pending`. |
| `task deft:scope:activate` | Exit `0`; `pending/pending` became `active/running`. |
| `task deft:scope:cancel` | Exit `0`; the separate proposed story became `cancelled/cancelled`. |
| `task deft:session:start` then `task deft:verify:session-ritual` | Exits `0`, `0` under one current session ID after activation. |
| `task deft:xbrief:preflight` on active | Exit `0` after explicit current lab intent and the session gates. |
| `task deft:scope:complete` | Exit `0`; the active story became `completed/completed`. This fixture contains no product implementation, so completion is not called delivery. |

The fixture writes the expected failure before promotion, creates a different unique root for
reset, and uses an exact-parent rename into a recoverable temporary archive for cleanup. The
focused verifier checks those mechanisms and rejects remote/destructive command surfaces; it
does not execute Markdown commands. Native execution is currently bounded to macOS/zsh.
Linux/bash and Windows/PowerShell remain candidates; native Windows install stops before npm.

Probe details, exact help disagreements, platform markers, and the isolated runtime evidence
are in [SOURCE-NOTES.md](./SOURCE-NOTES.md#module-7-source-validation).

## Module 8 session and work-selection validation

Module 8 is a command-free exercise over fixed fictional state. Its behavior claims were
revalidated against the exact 0.119.5 package graph and these released content surfaces:

| Pinned 0.119.5 source | Teaching contract |
| --- | --- |
| `content/main.md` | Read-only default, mutation routing, active contract, and completed-record boundary. |
| `content/commands.md` | Cold start, re-arm and recovery, ordered-plan/queue precedence, exhaustion stop, cache, and audit surfaces. |
| `content/tasks/session.yml` | Consumer dispatch for `session:start` and `session:ready`. |
| `content/tasks/plan-sequence.yml` | Ordered-plan set, current, advance, clear, and verify surfaces. |
| `content/tasks/triage-queue.yml` | Ranked queue, per-item view, and audit-log surfaces. |

The exact state map used in the lesson is:

| Surface | 0.119.5 path or command | Authority boundary |
| --- | --- | --- |
| Ordered plan | `.deft/plan-sequence.json` and `deft plan-sequence:current` | Selects the current sequence entry; no mutation authority. |
| Ranked issue content | `.deft-cache/` and `deft triage:queue` | Ranks candidates after the plan gate permits queue use. |
| Triage audit | `xbrief/.triage-cache/candidates.jsonl` and `deft triage:audit` | Records decisions; supplies no present intent. |
| Pending scope | `xbrief/pending/` | Approved but not current. |
| Active scope | `xbrief/active/` with running status | Durable current contract; requires live implementation intent. |
| Completed scope | `xbrief/completed/` | Historical closeout; no next-work authority. |

An active ordered plan binds a bare “what next?” or “proceed” to the current sequence entry.
Labels and rank do not override it. When the plan is exhausted, selection stops until the
operator names a target or explicitly asks for queue/backlog selection. A queue result remains
a candidate; implementation requires active scope plus the operator's live implementation
instruction and passing applicable readiness gates.

Module 8's release evidence used an explicit cached 0.119.5 npm package graph.
Authoring-runtime and migration-path drift are maintainer evidence recorded in
[SOURCE-NOTES.md](./SOURCE-NOTES.md#module-8-source-validation).

## Module 9 design-critique validation

Module 9 is a command-free fixed-state practicum derived from four immutable sources at the
Directive 0.119.5 release commit `75e7d33f114b0e2e67741257813c095e74d9668f`:

| Pinned 0.119.5 source | Teaching contract |
| --- | --- |
| [Design-critique contract][src-design-critique] | One target-revision arc, independent charter and spend selection, fixed input ceilings, closed finding classes, total successor-lean takes, retry/halt boundaries, verified synthesis, and completed-arc clearance. |
| [Design-critique brief][template-design-critique] | The default critic envelope fields, including role, round, ceiling, dispatch SHA, run posture, target, audit targets, and launcher. |
| [ADR-005][adr-005] | Mechanism-shaped routing is a human semantic judgment; deterministic checks can validate recording and authority without computing the judgment. |
| [ADR-006][adr-006] | A load-bearing premise introduced by the parent after criticism needs independent substantiation rather than parent self-clearance. |

The lesson uses a fixed fictional packet for target revision `NS-INGEST-R2`. It separates an
arc from one critic round and ordinary implementation review, uses default spend `N=1` with
ceiling `9104001`, requires a total take map, and distinguishes retry, halt, verified synthesis,
later ingest, and implementation authority. Direct and compositional instruction-shaped
source text remains attributed evidence: the learner refuses its attempted effect, records a
finding, and continues the bounded critique.

No Directive command, GitHub mutation, live critic, ingest, or implementation occurs. Packet
inertness is a property of the fictional fixture and exercise procedure, not a Directive
runtime guarantee. Detailed adaptation and validation notes are in
[SOURCE-NOTES.md](./SOURCE-NOTES.md#module-9-design-critique-source-validation).

## Module 10 implementation-readiness validation

Module 10 exercises an exact CLI/core/content/types 0.119.5 package graph in a unique
operating-system temporary, no-remote repository. The fixture begins on
`training/module-10` with one active/running schema-0.8 story whose complete product
allowlist is `src/greeting.mjs`.

| Surface | Verified 0.119.5 result |
| --- | --- |
| `task deft:session:start` | Exit `0` under a fresh lab-local session ID. |
| `task deft:verify:session-ritual -- --tier=gated` | Exit `0` before product mutation. |
| `directive verify:story-ready --vbrief-path <active-story> --skip-routing` | Exit `0` for the guarded clean active story. |
| `task deft:xbrief:preflight -- <active-story>` | Exit `0` under explicit lab implementation intent. |
| Supplied focused test before edit | Exit `1`, naming intended greeting behavior. |
| Focused test and named/fallback CLI after edit | Exit `0`; `Hello, Ada!` and `Hello, teammate!`. |
| `git diff --name-only` and `git diff --check` | Exact `src/greeting.mjs` path and exit `0`. |

Readiness evidence is retained before mutation; final evidence requires the readiness
checkpoint, behavioral proof, and diff proof. Reset creates a different unique root while
preserving the failed attempt. Cleanup moves one exact guarded parent into a recoverable
temporary archive. Native execution is verified only on macOS/zsh; Linux/bash and native
Windows/PowerShell remain candidates, with the Windows stop enforced before npm. Probe
details are in
[SOURCE-NOTES.md](./SOURCE-NOTES.md#module-10-source-validation).

## Module 11 testing-and-gates validation

Module 11 exercises an exact CLI/core/content/types 0.119.5 graph in a unique
operating-system temporary, no-remote repository on `training/module-11`. One
active/running schema-0.8 story permits only the focused test, numeric-summary source,
and governed quality record; stage guards narrow those paths further.

| Surface | Verified 0.119.5 result |
| --- | --- |
| `directive commands` | Exit `0`; registered `verify:ac`, `verify:forward-coverage`, and `check`. |
| `directive verify:ac --help` | Exit `2`; the verb rejects `--help`. |
| `directive verify:forward-coverage --help` | Exit `0`; documents source-to-test existence, optional changed-branch coverage, and `--enforce`. |
| `directive check --help` | Exit `2`; the verb rejects `--help`. |
| Focused test at red, green, and refactor | Exits `1`, `0`, and `0`; the test digest stays frozen after red. |
| Literal acceptance | Direct `node` and arbitrary npm scripts are safety-refused; allowed `npm run test:*` and `npm run check:*` commands pass. |
| Forward coverage | Exit `0`; source-to-test correspondence passes and the missing-report path does not claim a coverage percentage. |
| Aggregate `task check` | First fails at seeded `quality:record`, then passes after only `quality-record.json` is completed. |
| Gate fingerprints | Taskfile, package scripts, verifier, helper, safety module, active acceptance, and pinned framework gate files remain unchanged. |

The final work diff is exactly `quality-record.json`, `src/summary.mjs`, and
`test/summary.test.mjs`. Reset creates a different unique root while preserving the old
attempt; cleanup moves one exact guarded parent to a recoverable archive. Native execution
is verified only on macOS/zsh. Linux/bash and Windows/PowerShell remain candidates; native
Windows install stops before npm. Probe details are in
[SOURCE-NOTES.md](./SOURCE-NOTES.md#module-11-source-validation).

## Module 12 review-and-completion validation

Module 12 is a command-free exercise over a fixed fictional packet. Its behavior claims
were revalidated against immutable source at the 0.119.5 release commit:

| Pinned source | Teaching contract |
| --- | --- |
| [deft-directive-pre-pr][skill-pre-pr] | Read, Write, Lint, Diff, Loop, restart after edits, and the zero-change exit. |
| [content/coding/review.md][src-review] | Read all findings, severity, merge blocking, coherent repair, and review anti-patterns. |
| [deft-directive-review-cycle][skill-review] | Classification before editing, acceptance-scope disposition, one fix batch, and current-head review. |
| [Directive lifecycle][src-lifecycle] | Implemented, PR-open, merge-ready, integration-merged, delivered, deployed, and UAT evidence boundaries. |

The learner pin, authoring runtime, and deposit all resolve to 0.119.5. Exact hashes and
adaptation notes remain in the maintainer-only source notes. The exercise implements the project's
simulated-review policy: it requires no live GitHub repository, external review bot, CI run,
merge, deployment, or UAT execution.
Exact hashes and adaptation notes are in
[SOURCE-NOTES.md](./SOURCE-NOTES.md#module-12-source-validation).

## Capstone end-to-end validation

The [learner-ready capstone](../curriculum/capstone-end-to-end.md) combines the
Module 7–12 contracts in one guarded, disposable repository. Its learner
package graph remains exactly `@deftai/directive@0.119.5` with
`@deftai/directive-core`, `@deftai/directive-content`, and
`@deftai/directive-types` also resolved to `0.119.5`.

Directive 0.119.5 imports `node:fs` `globSync`, which is unavailable before
Node.js 22. The complete Directive proof therefore requires Node.js 22 or newer.
The fictional application source is Node.js 20-compatible as a
source-level design constraint; no isolated Node.js 20 execution is claimed,
and that property does not make the full Directive lab a Node.js 20 runtime
path.

| Surface | Bounded validation contract |
| --- | --- |
| Current runtime evidence | Local macOS/zsh with Node.js `24.20.0`; the exact 65-test baseline-upgrade aggregate includes the guarded capstone fixture. Linux and Windows remain candidates pending a native 0.119.5 replay. |
| Guarded route | `CREATED → CHECKPOINT → ORIENTED → SCOPED → READY → RED → GREEN → FOCUSED → LITERAL → AGGREGATE_RED → PREPR → REVIEWED → COMPLETE`. |
| Expected failure | The outer `red` and `aggregate` helpers exit `0` and print `"EXPECTED_FAILURE"` only after retaining a nonzero nested focused or aggregate result. |
| Review timing | `pre-pr` records the seeded finding without mutation; `review` verifies repaired current-product bytes before the final commit; `close` proves those bytes are unchanged, commits them, and reruns the aggregate on that commit. |
| Completion boundary | Helper stage `COMPLETE` is not Directive lifecycle completion. The fictional xBRIEF remains `active/running`; the strongest local claim is `implemented` with `local_pass`. |
| Reset and archive | Reset creates a distinct `CREATED` attempt while preserving the prior repository and evidence. Archive moves each exact attempt parent to a recoverable OS-temporary location; neither operation emits JSON. |
| Dependency boundary | Initial package installation contacts the configured npm registry. The remaining exercise needs no instructor, Greptile, live reviewer, GitHub mutation, deployment, publication, or UAT service. |

The current local run proves the guarded fixture only on macOS/zsh with the recorded runtime.
It does not prove Linux, Windows, every shell or package manager, coding-agent integration,
or an independent learner walkthrough. Historical cross-platform jobs and the current local
fixture result are recorded separately in
[SOURCE-NOTES.md](./SOURCE-NOTES.md#capstone-source-validation).

## Deferred skill-contract validation

The following pinned files are candidates, not blanket authority for modules that have not
been authored. Re-open the exact release file and re-run its relevant commands when the
corresponding module is written.

| Curriculum area | Revalidation source |
| --- | --- |
| Implementation and quality gates | [deft-directive-build][skill-build] |
| Backlog refinement | [deft-directive-refinement][skill-refinement] |
| Parallel work allocation | [deft-directive-swarm][skill-swarm] |

## Adaptation and attribution

The authored curriculum is an original 3Ci teaching adaptation. Its explanations are
paraphrased; exact command names, paths, headings, hashes, versions, and short diagnostic
messages are retained only where precision requires them. No substantial upstream passage is
copied into the learner lessons.

Directive initialization also created tracked, upstream-derived consumer integration files,
including the managed AGENTS.md section, host adapters, hook scripts, skill redirect stubs,
and xBRIEF schemas. The complete upstream MIT notice is preserved in
[SOURCE-NOTES.md](./SOURCE-NOTES.md#upstream-mit-notice). The reconstitutable `.deft/core/`
payload remains untracked.

Directive is MIT-licensed. If a later module copies a substantial source passage or template,
mark it as copied or adapted, preserve the upstream copyright notice, and include the pinned
[MIT license][src-license]. A source link alone does not replace those license conditions for
a substantial copy.

## Revalidation trigger

Refresh this baseline when any of these occurs:

- `package.json` changes the Directive pin.
- The authoring engine or deposit version changes, or its difference from the
  learner pin is not explicitly recorded as drift.
- A module first teaches one of the deferred skill contracts.
- A tested command, help surface, source heading, or consumer Task namespace changes.

Record probe-level results, disagreements, and unresolved coverage in
[SOURCE-NOTES.md](./SOURCE-NOTES.md).

[release-commit]: https://github.com/deftai/directive/commit/75e7d33f114b0e2e67741257813c095e74d9668f
[release-tag]: https://github.com/deftai/directive/tree/v0.119.5
[npm-release]: https://www.npmjs.com/package/@deftai/directive/v/0.119.5
[src-readme]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/README.md
[src-category]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/docs/CATEGORY.md
[src-concepts]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/docs/CONCEPTS.md
[src-core-skill]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/SKILL.md
[src-main]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/main.md
[src-getting-started]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/docs/getting-started.md
[src-references]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/conventions/references.md
[src-lifecycle]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/docs/directive-lifecycle.md
[src-commands]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/commands.md
[src-strategies]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/strategies/README.md
[src-interview]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/strategies/interview.md
[src-verification]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/verification/verification.md
[src-plan-checking]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/verification/plan-checking.md
[src-review]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/coding/review.md
[src-glossary-upstream]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/glossary.md
[src-license]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/LICENSE.md
[skill-setup]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/skills/deft-directive-setup/SKILL.md
[skill-decompose]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/skills/deft-directive-decompose/SKILL.md
[skill-gh-slice]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/skills/deft-directive-gh-slice/SKILL.md
[skill-build]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/skills/deft-directive-build/SKILL.md
[skill-pre-pr]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/skills/deft-directive-pre-pr/SKILL.md
[skill-review]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/skills/deft-directive-review-cycle/SKILL.md
[skill-refinement]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/skills/deft-directive-refinement/SKILL.md
[skill-swarm]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/skills/deft-directive-swarm/SKILL.md
[src-taxonomy]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/vbrief/vbrief.md
[src-continue]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/resilience/continue-here.md
[src-schema]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/vbrief/schemas/xbrief-core-0.8.schema.json
[src-map]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/packages/core/src/codebase/map.ts
[src-map-fresh]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/packages/core/src/codebase/map-fresh.ts
[src-design-critique]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/contracts/design-critique.md
[template-design-critique]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/templates/design-critique-brief.md
[adr-005]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/docs/decisions/ADR-005-design-critique-judgment-gate.md
[adr-006]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/docs/decisions/ADR-006-parent-side-substantiation.md
