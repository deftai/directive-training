# Directive source baseline

This manifest fixes the curriculum's version-sensitive claims to Directive 0.111.0. It was
verified on 2026-09-05 and must be refreshed when the project pin changes.

## Release identity

| Evidence | Verified result |
| --- | --- |
| Consumer project pin | `package.json` has exact dev dependency `@deftai/directive: 0.111.0`. |
| Executable used for probes | `/opt/homebrew/bin/directive`, resolved to the global 0.111.0 CLI package. |
| Installed packages | `@deftai/directive`, `@deftai/directive-core`, and `@deftai/directive-content` are all 0.111.0. |
| Runtime version report | `directive --version` reported `@deftai/directive-core@0.111.0`. |
| Consumer deposit | `.deft/GENERATION.json` records payload, templates, skills, and docs at 0.111.0. |
| Release tag | Annotated tag `v0.111.0`; tag object `00115182c859e96d0fe6f168f118fff3ad1a807f`. |
| Release commit | `750b79f6ed343393e42142f419dfb0591cca5a21`. The tag peel and npm `gitHead` agree. |
| npm artifact | Version 0.111.0; integrity `sha512-l/7/yvNs6hFgb0NGCLHFf7KROYWeNFNvhTSQSIfHmlrld14GarAEK2/ikQbsrhpUGC0STz76iJ4wK3grhW+lKQ==`. |
| Curriculum model | Current authoring uses `xBRIEFInfo.version: "0.8"` and the `xbrief/` lifecycle. |

Use the immutable [release commit][release-commit] for citations. The human-friendly
[v0.111.0 tag][release-tag] and [npm package record][npm-release] identify the same release.

## Evidence precedence

When evidence disagrees, use this order:

1. Observed behavior from the installed, pin-matched CLI or deterministic gate.
1. Source at the immutable release commit.
1. The 0.111.0 content reconstituted under `.deft/core/`.
1. This curriculum's explanation.

The first three layers define upstream behavior. The curriculum paraphrases them and labels
any 3Ci-specific practice as 3Ci policy.

Upstream source-repository docs usually show unprefixed `task <verb>` commands. This consumer
repository includes the framework Taskfile as `deft`, so its root-level spelling is
`task deft:<verb>`. Use `directive <verb>` only when `directive commands` registers that verb.

## Claim-to-source map

The heading names below are exact in the pinned release.

| Curriculum claim | Pinned source and heading |
| --- | --- |
| Directive is a repository practice layer, not a coding host, standalone skill pack, or application orchestrator. | [README.md][src-readme] — `TL;DR`; [docs/CATEGORY.md][src-category] — `Four-way fit table`, `What Directive is`, `What Directive is not`. |
| Directive's three pillars are shared standards, durable work state, and deterministic gates in the repository. | [docs/CATEGORY.md][src-category] — `What Directive is`; [README.md][src-readme] — `TL;DR`. |
| New xBRIEF writes use schema 0.8; schema 0.6 remains legacy read/migration compatibility. | [content/conventions/references.md][src-references] — `Schema Version: v0.8 (canonical write)`. |
| Deft names the company and on-disk footprint; Directive names the installed product and primary CLI. | [README.md][src-readme] — `Deft & Directive (naming)`; [docs/CATEGORY.md][src-category] — `What Directive is`. |
| npm plus `directive init`, `directive update`, and `directive doctor` form the current consumer entry path. | [README.md][src-readme] — `Getting Started`, `1. Install and initialize`; [docs/CONCEPTS.md][src-concepts] — `Installer Layout`. |
| Guidance is modular and loaded for the work at hand, with stronger deterministic surfaces preferred over prose. | [docs/CONCEPTS.md][src-concepts] — `Lazy Loading And Modularity`, `Rule Strength`; [README.md][src-readme] — `Rule Hierarchy`. |
| xBRIEF is durable project and work state; generated Markdown and codebase maps are projections. | [docs/CONCEPTS.md][src-concepts] — `xBRIEF Is The Durable State`, `Source Of Truth Vs Projection`. |
| Scope moves through proposed, pending, active, and completed states by lifecycle commands, with folder and status kept together. | [docs/CONCEPTS.md][src-concepts] — `Scope Lifecycle`; [content/commands.md][src-commands] — `Scope xBRIEF Lifecycle`. |
| The workflow has an inception phase and a recurring session phase; strategy, triage, slicing, implementation, review, and shipping can loop. | [content/docs/directive-lifecycle.md][src-lifecycle] — `The two phases`, `Stage → real surface`, `Why it loops`. |
| Session start is the ordinary re-entry point, while mutation work adds ritual, story-ready, and xBRIEF preflight gates. | [content/docs/directive-lifecycle.md][src-lifecycle] — `Resume (the usual entry, every session)`; [content/commands.md][src-commands] — `Session-start ritual (#1149)`, `Session routing (#2176)`. |
| Deterministic checks are evidence; focused checks support iteration and the full check is the merge chokepoint. | [docs/CONCEPTS.md][src-concepts] — `Quality Gates`; [content/commands.md][src-commands] — `Quality And Verification Commands`, `Gate throughput — iteration fast lane (#1704)`. |
| Durable edits belong in xBRIEF source; rendered specification, PRD, roadmap, and project views are regenerated. | [content/commands.md][src-commands] — `Generated Document Commands`; [docs/CONCEPTS.md][src-concepts] — `Source Of Truth Vs Projection`. |
| Preparatory strategies inform a later specification; spec-generating strategies create lifecycle artifacts. | [content/strategies/README.md][src-strategies] — `Available Strategies`, `Strategy Types`, `v0.20 Output Contract (for spec-generating strategies)`. |
| Implemented, PR-open, integration-merged, and delivered are distinct; deployed and UAT-verified require separate evidence. | [content/docs/directive-lifecycle.md][src-lifecycle] — `Delivery integrity vs deploy / UAT (#3041 / #3380)`. |
| Task/CLI surfaces replace the retired Python launcher for current work. | [docs/CONCEPTS.md][src-concepts] — `Taskfile First`; [content/commands.md][src-commands] — `Command Lifecycle: retired Python launcher vs task`. |

## Beginner-path boundary

Teach `xbrief/` and schema 0.8 as current behavior. Treat `vbrief/`, schema 0.6,
`.deft/core/run`, retired Python launchers, and frozen migration procedures as legacy. Mention
them only to recognize an old project and route it to maintainer or migration guidance.

The phrase `v0.20 Output Contract` in the strategy source names a historical document-model
cutover. It does not change the current xBRIEF schema version from 0.8.

## Deferred skill-contract validation

The following pinned files are candidates, not blanket authority for modules that have not
been authored. Re-open the exact release file and re-run its relevant commands when the
corresponding module is written.

| Curriculum area | Revalidation source |
| --- | --- |
| Setup and project definition | [deft-directive-setup][skill-setup] |
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

[release-commit]: https://github.com/deftai/directive/commit/750b79f6ed343393e42142f419dfb0591cca5a21
[release-tag]: https://github.com/deftai/directive/tree/v0.111.0
[npm-release]: https://www.npmjs.com/package/@deftai/directive/v/0.111.0
[src-readme]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/README.md
[src-category]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/docs/CATEGORY.md
[src-concepts]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/docs/CONCEPTS.md
[src-references]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/content/conventions/references.md
[src-lifecycle]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/content/docs/directive-lifecycle.md
[src-commands]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/content/commands.md
[src-strategies]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/content/strategies/README.md
[src-license]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/LICENSE
[skill-setup]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/content/skills/deft-directive-setup/SKILL.md
[skill-build]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/content/skills/deft-directive-build/SKILL.md
[skill-pre-pr]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/content/skills/deft-directive-pre-pr/SKILL.md
[skill-review]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/content/skills/deft-directive-review-cycle/SKILL.md
[skill-refinement]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/content/skills/deft-directive-refinement/SKILL.md
[skill-swarm]: https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/content/skills/deft-directive-swarm/SKILL.md
