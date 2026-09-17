# 05 — Sources versus projections

A generated view is useful because you can reproduce it. Find its source,
repair drift there, and prove the view reflects the intended change.

## Module record

| Field | Value |
| --- | --- |
| Stable ID | `module-05-sources-versus-projections` |
| Status | Learner-ready draft; executable lab verified on macOS/zsh; Linux and Windows candidates |
| Last content update | 2026-09-12 |
| Last verified | 2026-09-12 |
| Directive baseline | Package and engine 0.119.2; xBRIEF 0.8; [source baseline](../../references/SOURCE-BASELINE.md) |
| Estimated duration | 45–60 minutes, including Lab 5 and self-assessment |
| Prerequisites | Modules 1–4; Git, Node.js 20+, npm; zsh on macOS or PowerShell 7.4+ on Windows |

Version-sensitive product statements cite the pinned release. Local requirements name their
source, and learning advice explains its purpose.

## Learning outcomes

1. **O5.1 — Classify ownership.** Identify a generated view, its authoritative
   inputs, and the command that regenerates it.
1. **O5.2 — Repair drift.** Reject a direct generated-file fix, change the
   declared source, and regenerate the view in a disposable repository.
1. **O5.3 — Prove recovery.** Combine existence, content, freshness, and source
   evidence; reproduce the start while retaining the earlier attempt.

## Starting-state check

1. Explain the distinction between an active work contract and a saved session
   note. Revisit [Module 4](04-xbrief-as-durable-state.md) if uncertain.
1. Read [Lab 5's starting check](../../labs/05-projection-drift-recovery.md#environment-and-starting-state-check).
   Confirm its supported environment before executing commands.
1. Locate `xbrief/PROJECT-DEFINITION.xbrief.json` and
   `.planning/codebase/MAP.md` in the lab instructions. Record which path owns
   the module-purpose text and which is generated.

**Pass:** your note names the source field
`plan.architecture.codeStructure.modules[0].purpose`, the MAP path, and a
permitted disposable environment. No file changes are required yet.

**Recovery:** revisit Module 4 for artifact roles or Lab 5 for setup. Missing
a supported environment is an environment block; reading the solution does
not complete the practical outcome.

## Why this matters

A generated map looks like ordinary Markdown. Editing its sentence can make
the display look correct while leaving the source unchanged. Regeneration
then replaces the edit, and another reader may act on the older information.

The codebase MAP combines authored architecture
metadata with facts obtained by its extractor or provider. Its banner names
the source and regeneration route. It does not replace the active scope.

This course's Markdown is authored content. Future wiki or
SharePoint pages will be governed projections. A filename extension alone
cannot tell you where an edit belongs.

## Terminology

| Term | Meaning here | Do not confuse it with |
| --- | --- | --- |
| Authoritative source | Input where the intended durable change belongs | The most recently opened display |
| Projection | A view produced from declared inputs | An independently authored requirement |
| Drift | A view differs from the rendering of current inputs | Permission to expand scope |
| Freshness | Agreement between an existing view and its expected rendering | Correct product behavior or delivery |
| Recovery evidence | Failing observation, repair, and passing retry | A success message without an artifact |

## Mental model

Follow source → renderer → projection. Change meaning in the source, repeat
the renderer, and check the expected projection exists and agrees with it.

| Situation | Prediction | Evidence |
| --- | --- | --- |
| Only generated text changes | Rendering restores the original wording | Unchanged source and lost direct edit |
| Authored purpose changes | Existing MAP is stale until regenerated | Source diff; failing then passing freshness |
| MAP is missing | Freshness exit alone may not prove a view exists | Separate existence inspection |

**Limit:** this model proves reproduction and agreement, not the correctness
of requirements, permission to implement, deployment, or application behavior.

## Guided explanation

### 1. Find the owner before choosing a command

Generated artifacts have distinct owners.

| View or registry | Source | Consumer command surface |
| --- | --- | --- |
| `SPECIFICATION.md` in a full-spec project | `xbrief/specification.xbrief.json` | `directive spec:render` |
| `ROADMAP.md` | Lifecycle scope xBRIEFs | `task deft:roadmap:render` with the consumer Taskfile include |
| Project definition's `items` registry | Lifecycle scope xBRIEFs | `directive project:render` |
| `.planning/codebase/MAP.md` | Authored `codeStructure` plus extracted/provider facts | `directive codebase:map` |

**Reason:** a renderer for another artifact cannot repair this view.
`project:render` refreshes a registry inside JSON; it does not turn all project
narratives into Markdown.

**Evidence:** the released [command families][commands]. Only the MAP route
is executed in Lab 5; the other rows are source-reading examples.

The task and CLI inventories differ: the roadmap row is a namespaced Taskfile
command. It was listed by `task --list`, not by `directive commands`.

**Boundary:** a greenfield project need not contain a separate full-spec
artifact. Do not create one just because the table names it.

### 2. Inspect the banner and its actual input

The MAP has a generated banner, source
pointer, provider information, and source/artifact digest fields. The pinned
freshness verifier compares its body with an expected rendering.

**Reason:** these fields establish provenance. Copying a digest does not
prove the body is current or make a manual edit authoritative.

**Evidence:** compare the lab's generated banner and purpose row with the
matching `codeStructure` field in JSON. Its `src/*.js` module boundary keeps
the example small and reproducible.

**Boundary:** an extractor may report degraded analysis. A map is not an
exhaustive architecture model, and changing purpose prose does not implement
that behavior in the fictional source code.

### 3. Combine evidence

Directive 0.119.2 permits an absent MAP in its freshness
check. A successful freshness command therefore does not prove a MAP exists.
An existing tampered or stale MAP is rejected.

**Reason:** generated maps are optional local views in ordinary work. This
lab additionally requires producing one, so it needs existence and content
checks as well as freshness.

**Evidence:** Lab 5's `verify-result` requires the MAP, generated banner,
expected source purpose, and corresponding generated text. It complements
the released freshness command.

**Boundary:** those checks do not demonstrate deployment or code validation.

`--help` is not universally read-only: in this release,
`codebase:map --help` still renders, and the freshness verb's `--help` still
checks. Use the tested lab forms within its disposable boundary. See the
[recorded probes](../../references/SOURCE-NOTES.md).

## Walkthrough

### Goal and safe setup

Trace one purpose sentence from authored JSON to generated Markdown. Read this
walkthrough as a preview; do not run commands or create an attempt yet. In the
exercise below, complete [Lab 5](../../labs/05-projection-drift-recovery.md) once,
from setup through its ordered tasks. Task 1 needs the initial MAP to be absent.
Its minimal projection fixture is not a complete initialized consumer; session
and lifecycle execution are later topics.

### Actions and observations

1. **Lab action to observe:** render within the guarded lab with
   `./node_modules/.bin/directive codebase:map --project-root .` on zsh or
   `.\node_modules\.bin\directive.cmd codebase:map --project-root .` on PowerShell.
   **Observe:** the MAP includes “Normalize fictional stop codes.”
   **Meaning:** purpose text comes from the authored module entry.
1. **Lab action to observe:** compare the generated banner and JSON purpose.
   **Observe:** the source points to the project definition's architecture.
   **Meaning:** a durable wording change belongs in that source.
1. **Lab action to observe:** use the lab's intentional drift step, then run
   the shell-specific `verify:codebase-map-fresh --project-root .` command from the lab.
   **Observe:** exit `1` rejects the changed view.
   **Meaning:** the drift is reproducible.
1. **Checkpoint:** predict a rerender with the source unchanged, then compare
   the actual result with your prediction.

## Exercise

### Fictional scenario and task

Northstar Parcel's fixture normalizes fictional stop codes. The requested
architecture description is “Normalize and validate fictional stop codes.”
A direct MAP edit cannot preserve that intent.

Complete [Lab 5 — Projection drift recovery](../../labs/05-projection-drift-recovery.md):
identify the source, show a direct view edit is lost, edit the source, prove
staleness, regenerate, and retain passing evidence.

### Constraints and evidence to keep

- work in the lab's exact no-remote directory with its fictional
  data and allowed paths only.
- Preserve the generated banner and earlier attempt's evidence.
- Do not alter a verifier, force overwrite, or claim application behavior
  changed because architecture prose changed.
- Keep source purpose before/after, the MAP row, failed/passing freshness,
  a narrow source diff, reset/archive paths, baseline, shell, and date.

### Exercise acceptance

| Outcome | Observable condition | Literal check or inspection |
| --- | --- | --- |
| O5.1 | Correct source/view relationship | Compare JSON field, banner, and MAP row |
| O5.2 | Source edit survives regeneration; direct view edit does not | Source diff and failed-then-passing freshness |
| O5.3 | Final MAP exists and agrees; evidence survives reset | `node projection-lab.mjs verify-result`, freshness, and reset/archive record |

## Completion evidence

| Outcome | Evidence | Passing condition |
| --- | --- | --- |
| O5.1 | Source → command → view mapping | Matches actual artifacts |
| O5.2 | Drift, source edit, regeneration, final purpose | Intended source changed; final view reproducible |
| O5.3 | All literal checks and reset/archive record | No missing artifact or skipped check; earlier attempt retained |

## Progressive hints

Try for ten minutes before using hints. Open one at a time; the solution is
available whenever the written recovery does not unblock you.

<details>
<summary>Hint 1 — follow ownership</summary>

Which artifact can recreate the sentence after the view is overwritten?

</details>

<details>
<summary>Hint 2 — inspect one field</summary>

Compare `plan.architecture.codeStructure.modules[0].purpose` with the MAP's
purpose row. Preserve the module ID and path glob.

</details>

<details>
<summary>Hint 3 — order the evidence</summary>

Capture the failing check, change the source, render, and run both result and
freshness checks. Retain the source diff to explain the passing state.

</details>

## Expected failures and recovery

| Symptom | Confirm the cause | Recovery | Retry evidence |
| --- | --- | --- | --- |
| Direct edit disappears | Compare unchanged source and MAP | Edit the source and rerender | Source diff and matching row |
| Freshness passes but MAP is absent | Lab `verify-result` | Render in the guarded lab; run both checks | Existing MAP and two passing results |
| Source edit does not appear | Guard, source path, and purpose field | Correct location/source and regenerate | Matching source and generated purpose |
| Renderer refuses overwrite | Check generated banner | Preserve attempt; create a fresh one | New setup and successful render |
| Pin/platform differs | Lab pin check and environment record | Use the proved path or record an environment block | Exact package graph and supported shell |

## Common misconceptions

| Misconception | Correct model | Evidence |
| --- | --- | --- |
| All Markdown is generated | Ownership follows its source contract | These lessons are authored Markdown |
| PROJECT-DEFINITION is wholly generated | Narratives are authored; `items` can be refreshed | Module 4 classification |
| Freshness proves delivery | It checks projection agreement | Additional artifact and behavior evidence is required |
| A stale view authorizes requirement changes | Freshness and authorization are separate | Active scope plus human intent governs work |

## Self-assessment

1. **O5.1:** which file and field own the purpose, and which command produces
   its view?
1. **O5.2:** why does a direct MAP edit disappear? What proves the source
   correction survives regeneration?
1. **O5.3:** why is freshness exit `0` insufficient when the MAP is missing?
   Which additional check completes the evidence?
1. **O5.3:** how do you retry without losing the earlier failure record?

**Ready to continue:** every answer has correct evidence and every lab check
passes. **Revisit:** the result is correct but explanation incomplete.
**Retry:** a check fails, an artifact is missing, or an assumption is unproved.

## Explained solution

After a suggested first attempt, use the [Lab 5 solution](../../solutions/lab-05-projection-drift-recovery.md).
It explains the module outcomes, self-assessment, commands, recovery, and
valid alternative approaches.

## Navigation

- Previous: [Module 4 — xBRIEF as durable state](04-xbrief-as-durable-state.md)
- Course map: [Core curriculum](../README.md)
- Next: [Module 6 — Creating well-shaped work](06-creating-well-shaped-work.md)
- Resume: repeat only outcomes without passing evidence unless the baseline changed.

## Official sources

| Claim | Source | Verified date | Boundary |
| --- | --- | --- | --- |
| Generated-document ownership | [0.119.2 command families][commands] | 2026-09-07 | Commands serve different artifacts |
| MAP source and renderer | [Released MAP source][map-source] | 2026-09-07 | Maintainer traceability; learners use public CLI |
| Missing/tampered/stale MAP behavior | [Released freshness source][fresh-source] and [course probes](../../references/SOURCE-NOTES.md) | 2026-09-07 | Proof is limited to executed environments |
| Disposable-only boundary | [Lab safety policy](../../labs/README.md) | 2026-09-07 | Course requirement |

[commands]: https://github.com/deftai/directive/blob/9038503ffac65e6d48e5ba34758c4e8e7077aba3/content/commands.md
[map-source]: https://github.com/deftai/directive/blob/9038503ffac65e6d48e5ba34758c4e8e7077aba3/packages/core/src/codebase/map.ts
[fresh-source]: https://github.com/deftai/directive/blob/9038503ffac65e6d48e5ba34758c4e8e7077aba3/packages/core/src/codebase/map-fresh.ts
