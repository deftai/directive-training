# Capstone — End-to-End Solo Directive Lifecycle

## Capstone record

| Field | Value |
| --- | --- |
| Stable ID | `capstone-end-to-end` |
| Status | Learner-ready |
| Estimated time | 120 minutes |
| Directive baseline | `@deftai/directive@0.119.5`; see the [source baseline](../references/SOURCE-BASELINE.md#capstone-end-to-end-validation) |
| Directive runtime | Node.js `22 or newer`; the verified local macOS run used `24.20.0` |
| Application compatibility | Node.js 20-compatible source is a source-level design constraint; no isolated Node.js 20 execution is claimed |
| Prerequisite | [Module 12 — PR, Review, and Actual Completion](modules/12-review-and-completion.md) |
| Practical work | [End-to-end capstone lab](../labs/capstone-end-to-end.md) |
| Assessment | [Capstone evidence assessment](../assessments/capstone-end-to-end.md) |
| Explained solution | [Capstone explained solution](../solutions/capstone-end-to-end.md) |

The guarded fixture has local macOS/zsh evidence. Linux, Windows, and independent learner
walkthrough validation remain separate candidate claims.

## Learning outcomes

By the end of the capstone you can:

- **CAP.1:** route a mechanism-shaped proposal, recognize when design-critique
  evidence is not bind-ready, and prove safe repository identity, exact runtime
  and release identity, active-scope authorization, and mutation readiness before
  editing product code;
- **CAP.2:** preserve meaningful red and green evidence, then run focused checks,
  literal acceptance, and the separate aggregate gate in the required order;
- **CAP.3:** perform a zero-change pre-PR review, classify `CAP-P1-001` before
  editing, repair it coherently, and re-review the current product bytes; and
- **CAP.4:** make an evidence-bounded closeout statement, distinguish every
  delivery axis, create a fresh reset attempt, and archive both attempts safely.

All four outcomes are required. A strong result in one does not compensate for
an unmet safety, lifecycle, or evidence outcome.

## Starting-state check

Before starting, confirm all of the following:

1. You completed Modules 1–12 or can produce their completion evidence.
2. Node.js reports major version 22 or newer for the Directive proof. Record the
   exact version you use; the verified platform matrix used `v24.20.0`.
3. You know the absolute path to this curriculum checkout, but your shell is in
   a new dedicated launcher under the operating-system temporary directory.
4. The launcher is not a Git repository, the curriculum repository, a home or
   workspace root, or a business repository.
5. You will use only the fictional Northstar data supplied by the fixture.

The application exercise itself remains Node.js 20-compatible as a source-level
design constraint; no isolated Node.js 20 run is claimed. The full proof needs
Node.js 22 or newer because pinned Directive 0.119.5 imports `globSync` from
`node:fs`. Patch version `24.20.0` describes the verified local macOS/zsh run,
not a learner requirement.

If any check differs, stop before `create`. Use the matching recovery in the
[lab](../labs/capstone-end-to-end.md#expected-failures-and-recovery).

## Why this matters

Modules isolate individual decisions. Real delivery work requires the decisions
to stay coherent across one lifecycle: authority must precede mutation, tests
must precede implementation, narrow evidence must precede broad claims, and a
review must describe the current product state.

The capstone is deliberately local and no-remote. It proves supervision of one
fictional implementation through local gates. It cannot prove that a pull
request exists, that a change is merge-ready or delivered, or that anything was
deployed or accepted in UAT.

## Terminology

- **Attempt root:** the unique `repo` created inside one OS-temporary capstone
  parent. Every mutable exercise file is below this exact root.
- **Retained evidence:** JSON written beside, not inside, the attempt repository.
- **Stage:** one guarded transition in `CREATED -> CHECKPOINT -> ORIENTED ->
  SCOPED -> READY -> RED -> GREEN -> FOCUSED -> LITERAL -> AGGREGATE_RED ->
  PREPR -> REVIEWED -> COMPLETE`.
- **Zero-change review:** an inspection that proves the product diff was identical
  before and after classification.
- **Current-product proof:** a re-review of the repaired working-tree bytes;
  earlier review evidence is stale. The helper commits those exact bytes only
  during closeout, then reruns the aggregate on the resulting Git head.
- **Evidence-bounded closeout:** a statement whose delivery axes say only what
  the observed artifacts prove.

## Mental model

Treat the capstone as four proof packets:

```text
CAP.1 route + bind-readiness check + safe + authorized + ready
  -> CAP.2 meaningful red/green + focused + literal + aggregate diagnosis
  -> CAP.3 zero-change review + classify + repair + current-state review
  -> CAP.4 local closeout + fresh reset + recoverable archive
```

Each arrow is a stop gate. Later output cannot repair missing earlier evidence.
The helper checks stage order, file fingerprints, the exact release graph, Git
identity, remotes, and the one-file product boundary independently of this prose.

## Guided explanation

### CAP.1 — establish authority before mutation

`create` makes one no-remote repository on `training/capstone`. `install`
deposits the exact 0.119.5 graph and creates a clean checkpoint. `orient` records
project, branch, remote, pin, proposed contract, and checkpoint.

Before `activate`, complete this command-free recognition checkpoint in your
private `capstone-assessment-note.md`. It does not run a live arc or alter the
guarded fixture.

Fixed card `CAP-DC-01` describes target revision `CAP-DC-R1`. The revision
changes how untrusted issue text is assembled into an implementation envelope,
so it is mechanism-shaped. Its proposed successor lean still contains
`audit:cap-trust-boundary reading=asserted`. A
`design-critique:ingest-ready` catalog chip is present, but there is no
admitted completed-arc record citing the latest accepted lean.

Copy this exact header and write one evidence-bounded row:

| Card ID | Controlling fact | Route decision | Target revision | Bind readiness | Safe next action | Authority boundary |
| --- | --- | --- | --- | --- | --- | --- |

The row passes only when it routes `CAP-DC-R1`, says `not bind-ready`, requires
an independent audit of `audit:cap-trust-boundary` and the missing admitted
completed-arc record, and states that neither the ingest-ready catalog chip nor a proposed
synthesis authorizes activation or implementation. This card is separate from
the capstone fixture's story. The correct answer demonstrates that you would
hold `CAP-DC-R1`; it does not block the later, independently authorized fixture
steps.

After recording the row, `activate` promotes and activates the fixture's one
story, then commits that lifecycle state.

`ready` runs session start, the gated ritual,
story-ready, and active-xBRIEF preflight through the pinned local CLI. A passing
readiness record means the named story is active and the current session may
begin the bounded edit; it does not authorize a remote action.

### CAP.2 — keep the evidence layers separate

`red` must observe the supplied focused test failing for missing work-items
behavior while the source and test are untouched. After changing only
`src/work-items.mjs`, `green` proves the same test now passes. `focused` adds the
behavior check and whitespace check.

`literal` runs the two commands stored in the active xBRIEF. `aggregate` then
runs the broader Task gate separately. Its first run must fail at
`review:evidence`; that expected failure proves the aggregate reached the seeded
review boundary. Changing the Taskfile, test, verifier, acceptance list, or
framework deposit would replace the comparison and is not a repair.

### CAP.3 — classify before editing and review the current state

`pre-pr` performs a zero-change review and records one supplied finding:
`CAP-P1-001`, severity `P1`. The green implementation accepts a work-item title
that duplicates an existing title after trimming and case folding.

Classify the finding before editing. Then make one coherent source-only repair.
`review` verifies duplicate rejection, the frozen tests, the permitted diff,
and a `CLEAN` review of the repaired current-product digest. Its evidence field
is named `currentHeadReview`, but no product commit exists yet. `close` proves
the reviewed digest is unchanged before committing it and rerunning the
aggregate on the resulting head. The earlier review does not cover the new
source digest.

### CAP.4 — close only the axes proved

`close` runs the repaired aggregate, commits the fictional source change, and
runs the aggregate again on that current commit. Its record says:

- work: `implemented`;
- ship: `not_started`;
- gate: `local_pass`;
- deployment: `not_started`;
- UAT: `not_started`; and
- proof status: `n/a-no-remote-claim`.

Do not relabel that state as PR-open, merge-ready, delivered,
deployed, or UAT-verified. Those claims need independent remote or environment
evidence that this capstone intentionally does not create.

`COMPLETE` is the lab helper's terminal stage, not Directive lifecycle
completion. The fictional xBRIEF remains active/running because the no-remote
exercise does not merge or perform delivery closeout.

## Walkthrough

Use the [lab](../labs/capstone-end-to-end.md) for literal platform commands.
The conceptual sequence is fixed even when your editor differs:

1. Create and install a guarded attempt; retain the clean checkpoint.
2. Orient the guarded fixture, then complete the command-free `CAP-DC-01`
   routing and bind-readiness row before any activation.
3. Confirm that `CAP-DC-R1` is not bind-ready, then return to the separate
   fixture story, activate it, and pass readiness before any product edit.
4. Record meaningful red; implement only `src/work-items.mjs`; record green.
5. Run focused checks, then literal acceptance, then the aggregate diagnosis.
6. Run a zero-change pre-PR review and classify `CAP-P1-001` as P1.
7. Repair duplicate-title behavior in the same source file and re-review.
8. Close with local-only state axes and inspect `closeout.json`.
9. Use `reset` to prove a fresh attempt preserves the completed one, then leave
   both attempt parents and archive each exact root recoverably.

At every step, compare the expected stage and evidence filename before moving on.

## Exercise

Complete the [end-to-end capstone lab](../labs/capstone-end-to-end.md). Budget
about 20 minutes for setup and orientation, 45 minutes for red/green and gates,
30 minutes for review and repair, and 25 minutes for assessment and cleanup.

Spend at least 45 minutes on a genuine first attempt before reading the
[explained solution](../solutions/capstone-end-to-end.md). The solution is
always available; no instructor or review service unlock is required.

## Completion evidence

| Outcome | Required evidence |
| --- | --- |
| **CAP.1** | A private `CAP-DC-01` row routes `CAP-DC-R1` as `not bind-ready`, requires the unresolved independent audit and missing admitted completed-arc record, and denies activation or implementation authority to the ingest-ready catalog chip; a private runtime observation plus `orientation.json`, `scope.json`, and `readiness.json` identify the exact Node and Directive pins, OS/shell, no remote, active contract, clean checkpoints, and passing readiness gates |
| **CAP.2** | `red.json`, `green.json`, `focused.json`, `literal.json`, and `aggregate-failure.json` show the required order, frozen test, separate gate layers, and `review:evidence` diagnosis |
| **CAP.3** | `pre-pr.json` records `CAP-P1-001` as P1 with `diffUnchanged: true`; a private note labels the learner's classification timing as self-attested; `review-resolution.json` records one resolution and the helper field `currentHeadReview: CLEAN` for the repaired working-tree digest |
| **CAP.4** | `closeout.json` reports `implemented`, `local_pass`, and every unperformed remote/environment axis as `not_started`; a private `capstone-assessment-note.md` identifies both attempt roots, both launcher roots, and both archive destinations |

The [assessment rubric](../assessments/capstone-end-to-end.md) evaluates each
row independently. Reading a solution, showing stale output, or presenting an
unexplained final green result does not demonstrate an outcome.

## Progressive hints

Reveal one hint only after checking the preceding evidence file:

1. **Model:** name the current stage and the single question its next command answers.
2. **Inspection:** compare the attempt's sibling `evidence` directory with the
   stage list; do not edit a missing evidence file by hand.
3. **Boundary:** before green, only `src/work-items.mjs` may differ. Before the
   review repair, the product diff must remain unchanged.
4. **Partial route:** preserve the ordered verbs `red -> green -> focused ->
   literal -> aggregate -> pre-pr -> review -> close`.

After Hint 4, use failure-specific recovery. If the attempt's comparison files
changed, use a fresh reset rather than trying to reconstruct trusted state.

## Expected failures and recovery

| Symptom | Meaning | Bounded recovery |
| --- | --- | --- |
| Create refuses the location | The launcher is missing, broad, linked, in Git, or inside the curriculum | Create a new dedicated OS-temporary launcher and retry `create` |
| A verb reports `expected ... stage` | A transition was skipped or repeated out of order | Read the stage and retained files; run only the required preceding verb, or reset to a fresh attempt |
| Red reports the wrong failure | The baseline, source, test, or working directory changed | Preserve the attempt; reset and reproduce the untouched meaningful failure |
| Green or focused rejects a mutable path | A supplied test, gate, scope, or unrelated file changed | Preserve the evidence and restart; copy only your source reasoning, never the altered comparison |
| Aggregate does not fail at `review:evidence` | An earlier focused, literal, coverage, or integrity check is red | Repair the first failing governed work; do not edit the aggregate definition |
| Pre-PR says the P1 is already resolved | Editing occurred before classification | Preserve the attempt and use a fresh reset so classification precedes repair |
| Review remains red | Duplicate-title rejection is missing or unobservable | Change only the source, rerun the review verb, and retain the new current-state evidence |
| Closeout claims a remote state | The conclusion exceeds the no-remote evidence | Correct the assessment statement; do not manufacture remote evidence |

## Common misconceptions

- “Active scope means push is authorized.” It authorizes only the bounded local edit.
- “A green focused test means the aggregate will pass.” Each gate answers a different question.
- “The expected aggregate failure should be removed.” It is the diagnostic checkpoint.
- “A clean pre-commit review is already Git-head evidence.” It covers the
  current product bytes; closeout must prove those bytes are unchanged, commit
  them, and rerun the aggregate on the resulting head.
- “A local commit is delivered.” Delivery requires reachability and lifecycle evidence on a delivery branch.
- “Reading the worked source demonstrates skill.” Only a fresh attempt with new evidence does.

## Self-assessment

- **CAP.1:** Can you show the `CAP-DC-01` row captured before activation, explain
  why `CAP-DC-R1` is `not bind-ready`, name both the unresolved independent
  audit and missing completed-arc record, reject chip/synthesis authority, and
  then point to exact repository, branch, remote, pin, active story, and
  readiness evidence captured before the first product edit?
- **CAP.2:** Can you show meaningful red then green, distinguish focused from
  literal and aggregate checks, and explain why `review:evidence` is expected?
- **CAP.3:** Can you distinguish the helper-attested zero-change finding from
  your self-attested classification timing, and prove that the repaired
  current-product digest—not the earlier state—was reviewed clean before those
  unchanged bytes were committed?
- **CAP.4:** Can you state exactly which delivery axes are proved, create a
  distinct reset root, and archive both named attempts without overwriting or
  broadly deleting either one?

Continue only when all four answers cite the named retained artifacts.

## Explained solution

After a good-faith first attempt, compare with the
[capstone explained solution](../solutions/capstone-end-to-end.md). Compare
reasoning, stage order, evidence values, and state boundaries. Then create a
fresh attempt and retry only the unmet outcome before rerunning the full route.

## Navigation

- Previous: [Module 12 — PR, Review, and Actual Completion](modules/12-review-and-completion.md)
- Practice: [End-to-end capstone lab](../labs/capstone-end-to-end.md)
- Assess: [Capstone evidence assessment](../assessments/capstone-end-to-end.md)
- Course map: [curriculum README](README.md)

## Official sources

- [Directive source baseline](../references/SOURCE-BASELINE.md#capstone-end-to-end-validation)
- [Capstone source validation notes](../references/SOURCE-NOTES.md#capstone-source-validation)
- [Directive learner quick reference](../references/QUICK-REFERENCE.md)
- [Directive training glossary](../references/GLOSSARY.md)
