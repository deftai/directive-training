# Directive source baseline

This manifest fixes the curriculum's version-sensitive claims to Directive 0.112.0. It was
revalidated through 2026-09-09 and must be refreshed when the project pin changes.

## Release identity

| Evidence | Verified result |
| --- | --- |
| Consumer project pin | `package.json` has exact dev dependency `@deftai/directive: 0.112.0`. |
| Executables used for probes | `/Users/davidcall/.nvm/versions/node/v24.18.0/bin/directive`, resolved to the global 0.112.0 CLI package, and a disposable repository's explicit `node_modules/.bin/directive`, installed from the exact fixture pin. |
| Installed packages | The global CLI/core/content graph and the disposable repository's CLI/core/content/types graph all resolved to 0.112.0. The training repository itself records a pin but intentionally contains no project-local install or lockfile. |
| Runtime version report | `directive --version` reported `@deftai/directive-core@0.112.0`. |
| Consumer deposit | `.deft/GENERATION.json` records payload, templates, skills, and docs at 0.112.0. |
| Release tag | Annotated tag `v0.112.0`; tag object `5f30e544eedb72c313ba61934818eb49506fe61b`. |
| Release commit | `7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808`. The tag peel and npm `gitHead` agree. |
| npm artifact | Version 0.112.0; integrity `sha512-c5fOMWk2p1C/M6q8B3DrAJDjceNPeU6AvCesTA/zQAw/V+vbiPltfeo8NIBndoxRAaDtbVSQzEKnQ93f6sDS1w==`. |
| Curriculum model | Current authoring uses `xBRIEFInfo.version: "0.8"` and the `xbrief/` lifecycle. |

Use the immutable [release commit][release-commit] for citations. The human-friendly
[v0.112.0 tag][release-tag] and [npm package record][npm-release] identify the same release.

## Evidence precedence

When evidence disagrees, use this order:

1. Observed behavior from the installed, pin-matched CLI or deterministic gate.
1. Source at the immutable release commit.
1. The 0.112.0 content reconstituted under `.deft/core/`.
1. This curriculum's explanation.

The first three layers define upstream behavior. The curriculum paraphrases them and labels
any 3Ci-specific practice as 3Ci policy.

Upstream source-repository docs usually show unprefixed `task <verb>` commands. This consumer
repository includes the framework Taskfile as `deft`, so its root-level spelling is
`task deft:<verb>`. Use `directive <verb>` only when `directive commands` registers that verb.

## Claim-to-source map

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

The following literal probes were run against 0.112.0. Detailed exits and anomalies are in
[SOURCE-NOTES.md](./SOURCE-NOTES.md#cli-help-probes).

| Surface tested | Result used by the curriculum |
| --- | --- |
| `directive --help` | Exit 0; curated command overview. |
| `directive commands` | Exit 0; full registered-command inventory. |
| `directive init --help` | Exit 0; verified options include `--repo-root` and `--yes`. |
| `directive update --help` | Exit 0; verified update and dry-run surface. |
| `directive doctor --help` | Exit 0; verified diagnostic surface. |
| `directive toolchain:check --help` | Exit 2 after printing usage because 0.112.0 rejects `--help`; this is recorded, not hidden. |
| `directive toolchain:check --consumer --project-root .` | Exit 0 on the verified macOS/zsh, Linux/bash, and Windows/PowerShell consumer paths. |
| `directive scope:record-approved-scope --help` | Exit 0; its documented `-- <xbrief-path>` form and the direct positional form both reach the operator-TTY authorization gate. |

## Modules 2–3 released disagreements

These disagreements change what the learner path can safely promise. Probe details and less
central release discrepancies remain in [SOURCE-NOTES.md](./SOURCE-NOTES.md#recorded-disagreements-and-curriculum-decisions).

| Released prose or help | Observed 0.112.0 behavior | Curriculum treatment |
| --- | --- | --- |
| The README says init creates a committed package pin. | The disposable init path created no package pin. | Put and verify the exact direct pin and CLI/core/content/types overrides before init. |
| Prose describes a new empty directory as a scaffold. | Running Git first made the otherwise empty repository select `brownfield-install`. | Expect brownfield for this Git-first safety path; do not reinterpret it as the wrong command. |
| The project requires per-verb help checks. | `toolchain:check --help` prints usage but exits 2 with an unrecognized-argument diagnostic. | Record the defect, prove registration with `directive commands`, and use only the tested consumer form. |
| Doctor is commonly described as read-only and prose can imply a clean result. | Doctor can write ignored throttle state and can exit 0 with classified warnings. | Say it does not mutate tracked product state or remotes; preserve and classify warnings. |
| Brownfield init appends canonical ignore rules. | It did not add `/USER.md` or `/.deft/USER.md` to the existing ignore file. | Add those safety rules before init and prove them afterward. |
| A learner might expect generated integration to remain merely untracked. | Init staged most managed paths, and the default-branch hook rejected the first checkpoint on `main`. | Inspect the staged-plus-untracked union and create the disposable feature branch before init. |

Two 0.111.0 discrepancies are resolved in 0.112.0: the documented
`scope:record-approved-scope -- <xbrief-path>` separator is accepted, and `directive init
--headless` emits complete parseable JSON. They are recorded as release deltas in
[SOURCE-NOTES.md](./SOURCE-NOTES.md), not retained as current learner warnings.

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

| Surface | Verified boundary at 0.112.0 |
| --- | --- |
| `directive codebase:map --project-root .` | Registered CLI renderer; exercised through the disposable fixture's explicit local binary. |
| `directive verify:codebase-map-fresh --project-root .` | Registered freshness check; existing stale output fails, but absent MAP can exit 0. The lab independently proves MAP existence and contents. |
| Per-verb `--help` for those two verbs | The flag is ignored: the renderer writes and the freshness verifier checks. These are not safe discovery commands outside a disposable probe. |
| `directive spec:render` and `directive project:render` | Registered inventory and pinned source inspected; not executed as Lab 5 exercises. |
| `task deft:roadmap:render` | Present in this consumer's Taskfile include. `roadmap:render` is not in the 0.112.0 CLI inventory; do not invent a direct CLI equivalent. |

Lab 5 has its own platform evidence in [source notes](./SOURCE-NOTES.md#modules-45-verification).
Module 2's native matrix does not establish Lab 5 platform support. Linux/bash and native
Windows/PowerShell Lab 5 paths remain candidates and have no published executable path.

## Module 6 source boundary

Module 6 is a command-free work-shaping exercise. Its fictional worksheet teaches three
observable outcomes: reshape horizontal component work into one vertical slice; trace an idea
through a bounded strategy choice, observable acceptance, and schema-0.8 proposed scope; and
decompose an epic into ordered independently verifiable slices with dependency and boundary
rationale.

The learner writes scratch notes only. The proposed artifact remains candidate state with
`plan.status: proposed`; it does not authorize implementation, promotion, or activation. The
lesson names a standalone specification file as optional compatibility state rather than a
required current setup artifact. Its `Exclusions` and `Literal inspection` columns are course
worksheet fields, not invented canonical xBRIEF keys. “Independently verifiable” is the
universal slice evidence boundary taught here; the course does not claim every slice is
independently deployable or that static inspection proves running behavior.

The pinned-source inspection and disagreements for this module are recorded in
[SOURCE-NOTES.md](./SOURCE-NOTES.md#module-6-verification). Later lifecycle execution,
implementation, review, and shipping procedures remain reserved for their own modules.

## Deferred skill-contract validation

The following pinned files are candidates, not blanket authority for modules that have not
been authored. Re-open the exact release file and re-run its relevant commands when the
corresponding module is written.

| Curriculum area | Revalidation source |
| --- | --- |
| Implementation and quality gates | [deft-directive-build][skill-build] |
| Pre-PR self-review | [deft-directive-pre-pr][skill-pre-pr] |
| Review and fix cycles | [deft-directive-review-cycle][skill-review] |
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
- `.deft/GENERATION.json` no longer matches the pin.
- A module first teaches one of the deferred skill contracts.
- A tested command, help surface, source heading, or consumer Task namespace changes.

Record probe-level results, disagreements, and unresolved coverage in
[SOURCE-NOTES.md](./SOURCE-NOTES.md).

[release-commit]: https://github.com/deftai/directive/commit/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808
[release-tag]: https://github.com/deftai/directive/tree/v0.112.0
[npm-release]: https://www.npmjs.com/package/@deftai/directive/v/0.112.0
[src-readme]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/README.md
[src-category]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/docs/CATEGORY.md
[src-concepts]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/docs/CONCEPTS.md
[src-core-skill]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/SKILL.md
[src-main]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/main.md
[src-getting-started]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/docs/getting-started.md
[src-references]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/conventions/references.md
[src-lifecycle]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/docs/directive-lifecycle.md
[src-commands]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/commands.md
[src-strategies]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/strategies/README.md
[src-interview]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/strategies/interview.md
[src-verification]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/verification/verification.md
[src-plan-checking]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/verification/plan-checking.md
[src-glossary-upstream]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/glossary.md
[src-license]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/LICENSE
[skill-setup]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-setup/SKILL.md
[skill-decompose]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-decompose/SKILL.md
[skill-gh-slice]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-gh-slice/SKILL.md
[skill-build]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-build/SKILL.md
[skill-pre-pr]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-pre-pr/SKILL.md
[skill-review]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-review-cycle/SKILL.md
[skill-refinement]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-refinement/SKILL.md
[skill-swarm]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-swarm/SKILL.md
[src-taxonomy]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/vbrief/vbrief.md
[src-continue]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/resilience/continue-here.md
[src-schema]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/vbrief/schemas/xbrief-core-0.8.schema.json
[src-map]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/packages/core/src/codebase/map.ts
[src-map-fresh]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/packages/core/src/codebase/map-fresh.ts
