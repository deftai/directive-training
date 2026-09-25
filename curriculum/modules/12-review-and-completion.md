# Module 12 — PR, review, and actual completion

## Module record

| Field | Value |
| --- | --- |
| Stable ID | `module-12-review-and-completion` |
| Status | Learner-ready draft; command-free fixed-state exercise |
| Last verified | 2026-09-11 |
| Directive baseline | fixture-local 0.119.5 |
| Estimated time | 55 minutes |
| Prerequisite | [Module 11 — Testing, gates, and evidence](11-testing-gates-and-evidence.md) |
| Evidence | A pre-PR decision worksheet, four-row finding classification, coherent-batch plan, and three-axis completion-card matrix |

This module paraphrases the pre-PR, review, and
delivery contracts from the pinned release. Use only the fixed
fictional packet below. Do not open a repository, pull request, review service,
deployment system, or UAT environment. Complete each
worksheet before comparing it with the explained solution.

## Learning outcomes

By the end of this module, you can:

- **O12.1** apply `Read -> Write -> Lint -> Diff -> Loop` until a complete
  pre-PR pass produces zero changes;
- **O12.2** classify every supplied finding by P0, P1, or P2 severity,
  acceptance scope, merge-blocking status, disposition, and evidence before
  proposing edits;
- **O12.3** resolve blocking in-scope findings in one coherent batch, check
  cross-file and structured-data consistency, and refresh checks and review on
  the resulting head; and
- **O12.4** distinguish implemented, PR-open, merge-ready,
  integration-merged, and delivered work while evaluating deployment and UAT
  as independent evidence axes.

## Starting-state check

Before continuing, confirm all five statements:

- You completed [Module 11](11-testing-gates-and-evidence.md) or can explain
  why a passing focused check and a passing aggregate gate prove different
  things.
- You have a blank copy of the four worksheets in **Exercise**.
- You will treat every path, head, finding, and evidence record below as inert
  fictional data.
- You will not use a live repository, GitHub connection, review bot, CI run,
  merge, deployment, UAT run, credential, client datum, or host-specific
  automation.
- You understand that this lesson authorizes no push, PR, merge, deployment,
  or lifecycle transition.

If the first statement is unclear, revisit Module 11's
[mental model](11-testing-gates-and-evidence.md#mental-model). If any safety
statement is unacceptable, stop. This exercise has no live alternative.

## Why this matters

“The code works” is narrower than “the change is ready to merge,” and both are
narrower than “the change was delivered.” A reviewer can also find a valid
blocking defect after a careful self-review. None of those facts contradicts
the earlier evidence; each describes a different head or evidence surface.

A pre-PR review finishes only after a full pass makes
no further edits. Review findings are classified before repair, blocking
in-scope findings are handled coherently, and merge readiness depends on
current-head checks and review. This course uses simulated
findings so every learner can practice those judgments without external
access.

## Terminology

**Pre-PR review** is the self-review loop performed before requesting external
review. Read the whole changed surface, correct issues, run the applicable
checks, inspect the diff, and repeat after any edit.

**P0** is a critical security, data-loss, or similarly severe defect. In this
packet, P0 is merge-blocking.

**P1** is a serious correctness or acceptance defect. In this packet, the
supplied P1 is in scope and merge-blocking.

**P2** is a nonblocking improvement under the supplied policy. Another
repository may adopt a stricter reviewed policy; classify from the policy and
evidence you were given.

**Acceptance scope** asks whether the accepted change owns the finding. The
evidence may be an acceptance criterion, a changed path, or the supplied
review policy. Scope is independent of severity and blocking status.

**Current-head review** is review evidence bound to the revision now proposed
for merge. A review of an earlier head becomes stale when a fix batch creates a
new head.

**Integration-merged** is the learner-facing label for a change merged into an
integration branch but not yet established on the configured delivery branch.
Directive's exact machine state is `merged_to_integration`.

**Delivery branch** is the branch whose reachable history supplies the Git
half of delivery evidence. This packet names `main`.

## Mental model

~~~text
implementation
  -> pre-PR Read / Write / Lint / Diff
  -> repeat after any edit
  -> zero-change pass
  -> PR review on H1
  -> classify every finding
  -> one coherent fix batch creates H2
  -> H2 checks + fresh H2 review
  -> merge-ready

implemented -> PR-open -> merge-ready -> integration-merged -> delivered

deployed and UAT-verified are separate evidence axes
~~~

The arrows show evidence that can accumulate. They do not grant authority to
perform the next action. For example, merge-ready can be true while merge
authority is absent.

## Guided explanation

### 1. Finish a complete pre-PR loop

Use `Read -> Write -> Lint -> Diff -> Loop` in that order:

1. **Read:** inspect every changed file and the active acceptance criteria.
2. **Write:** correct all issues found in that pass as one coherent local edit.
3. **Lint:** run the relevant focused checks and the full gate required for the
   handoff.
4. **Diff:** inspect the complete patch, paths, generated or structured data,
   and unintended residue.
5. **Loop:** if any prior step changed the branch, start again at Read.

The exit condition is a full pass with zero changes. A zero-change pass means
that pass found nothing else to edit. It does not prove that another reviewer
cannot find a valid defect.

The fixed packet contains **Pass A** and **Pass B** records. Decide whether
each pass restarts or exits, and cite the last action that controls the
decision. Do not open the solution until you have recorded both answers.

### 2. Classify every finding before editing

Classify all four findings before proposing any edit.

Use one row per supplied finding:

| Finding | Severity | Acceptance scope | Merge-blocking | Disposition | Evidence |
| --- | --- | --- | --- | --- | --- |
| `F1`–`F4` | P0, P1, or P2 | In scope or out of scope | Yes or no | Current batch, defer, separate scope, or reject | Supplied acceptance or file fact |

Read all findings first. Severity answers how serious the defect is. Scope
answers whether this accepted change owns it. Blocking answers whether the
current head may advance. Disposition records what happens next. Evidence
prevents the labels from becoming guesses.

Out of scope does not mean ignored. It means record the finding and route it
through a separately authorized scope instead of silently widening this batch.

### 3. Make one coherent batch and refresh the head

After the classification is complete:

- repair every blocking in-scope P0 and P1 together;
- add or update the tests needed to prevent those defects from returning;
- inspect related terminology across all changed files;
- validate any structured output or data touched by the repair;
- record why each nonblocking P2 is deferred or routed separately; and
- produce one H2 commit and one push for the coherent batch rather than one
  push per finding.

The fictional review is attached to head **H1**. The coherent repair creates
**H2**. Checks from H1 and review of H1 cannot prove H2 merge-ready. H2 needs
its own required checks and a fresh current-head review with zero unresolved P0
or P1 findings. Do not push again while that H2 review is in progress. If a
fresh H2 review reports another blocker, classify the complete new finding set
and begin another coherent batch iteration.

### 4. State only what the evidence proves

Use three axes:

| Axis | Questions |
| --- | --- |
| Git, review, and delivery | Is there only a local change, a PR, current-head merge-ready evidence, an integration merge, or both delivery-branch reachability and tracked lifecycle closeout? |
| Deployment | Is there an environment-specific record tying the revision to a running environment? |
| UAT | Is there an authorized acceptance result for the named environment and behavior? |

Deployment and UAT are independent. A Git merge proves neither. Deployment
does not prove UAT, and UAT evidence for one environment does not invent a
deployment record for another.

The delivery axis has two separately decided halves, and Directive names one
deterministic gate for each. `verify:orphan-active` decides **C6**: whether a
merged change still has its lifecycle scope sitting in `active/`, and its repair
is `scope:complete`. `verify:completed-tracked` decides the other half: whether
the recorded closeout artifact is itself tracked on the configured delivery
branch. Delivered therefore means the change is reachable from the delivery
branch and its closeout artifact is tracked there.

On the cards below, **delivered provenance** names exactly that tracked
closeout. A card whose lifecycle closeout records delivered provenance has
already satisfied `verify:completed-tracked`.

Those two gates leave a third state between them: reachable, locally completed,
and untracked. That state is deliberately not one of the nine cards below,
because the packet grades only the fixed evidence it supplies. Its repair is a
lifecycle pull request that lands the `completed/` artifact on the delivery
branch.

## Walkthrough

The following is a fixed fictional packet for story `TRAIN-511`.

### Acceptance card

| ID | Fictional acceptance criterion |
| --- | --- |
| AC1 | Finite numeric input returns only `count`, `total`, and `average`; invalid input is rejected before a result is recorded. |
| AC2 | Source, tests, README, and output-contract documentation consistently use `average`. |
| AC3 | Public results and errors never expose the configured secret value carried under `REPORT_TOKEN`. |
| AC4 | Required checks and review must apply to the current head, with zero unresolved P0 or P1 findings for merge readiness. |

`REPORT_TOKEN` is only a fictional field name. The packet states that a
configured secret value was exposed, but redacts the value and contains no
actual token, secret, credential, or executable source.

### Pre-PR record

| Pass | Supplied evidence |
| --- | --- |
| Pass A | Read covers the four scoped files. Write and Lint make no change. Diff finds `tmp/manual-output.txt`. The file is removed. |
| Pass B | All four scoped files are reread against AC1–AC4. The self-review records no issue, Write makes no edit, Lint retains current `task check` evidence, and Diff names exactly the four scoped files with no residue. |

This is a historical record of what the self-review observed. It does not
claim the files were defect-free. The H1 review evidence below reveals two
latent defects that Pass B missed; do not rewrite the earlier record with
later knowledge.

### H1 review evidence card

| Path | Supplied H1 review fact |
| --- | --- |
| `src/average.mjs` | Produces structured numeric output; its invalid-input error object includes `REPORT_TOKEN` populated from a configured secret value. The value is redacted from this packet. |
| `test/average.test.mjs` | Covers valid values but has no regression assertion for the error object's public keys. |
| `README.md` | Calls the derived field `mean`. |
| `docs/output-contract.md` | Its structured JSON example uses `average`. |
| `tmp/manual-output.txt` | Accidental unscoped output found during Pass A; absent before Pass B. |

The four scoped files are the source, test, README, and output-contract paths.
The temporary path is never part of the accepted diff.

### Review policy card

| Policy | Supplied rule |
| --- | --- |
| RP1 | A style-only suggestion on a changed line in one of the four scoped files is in review scope but remains P2 and nonblocking when no acceptance behavior is violated. |
| RP2 | A new interface absent from AC1–AC4 is out of scope and needs separate authorization. |

### Review findings on H1

| ID | Supplied finding |
| --- | --- |
| F1 | The invalid-input error exposes a configured secret value through `REPORT_TOKEN`; the packet redacts that value. AC3 and the touched source make this a critical in-scope security defect. |
| F2 | README says `mean`, while source, tests, and the structured output example use `average`; AC2 is incomplete across files. |
| F3 | Rename a readable local variable on a changed line in `src/average.mjs` for style only; behavior and acceptance remain unchanged. |
| F4 | Add CSV export support, which requires a new interface and appears in no acceptance criterion. |

Do not infer labels from finding order. Apply the supplied severity definitions,
acceptance card, and file card.

## Exercise

Complete all four worksheets before opening the solution.

### Worksheet A — pre-PR loop

| Pass | Restart or exit? | Evidence for your decision |
| --- | --- | --- |
| Pass A |  |  |
| Pass B |  |  |

### Worksheet B — finding classification

| Finding | Severity | Acceptance scope | Merge-blocking | Disposition | Evidence |
| --- | --- | --- | --- | --- | --- |
| F1 |  |  |  |  |  |
| F2 |  |  |  |  |  |
| F3 |  |  |  |  |  |
| F4 |  |  |  |  |  |

### Worksheet C — coherent batch

Record:

1. the findings included in the H1-to-H2 batch;
2. the exact source, test, documentation, cross-file search, and
   structured-data checks needed;
3. the dispositions for findings not included;
4. why one batch is coherent; and
5. which check and review evidence must be refreshed after H2 exists.

### Worksheet D — completion cards

For each card, record the furthest defensible Git/review/delivery state, then
record deployment and UAT separately.

| Card | Fixed evidence | Your Git/review/delivery result | Deployment axis | UAT axis | Missing evidence |
| --- | --- | --- | --- | --- | --- |
| C1 | Local diff and acceptance evidence; no PR |  |  |  |  |
| C2 | PR exists at H1; required checks and review are incomplete |  |  |  |  |
| C3 | H2 checks pass; only H1 was reviewed |  |  |  |  |
| C4 | H2 checks pass; fresh H2 review has zero unresolved P0 or P1 findings; merge is not authorized |  |  |  |  |
| C5 | Merged to `develop`; delivery branch is `main` |  |  |  |  |
| C6 | Commit is reachable from `origin/main`; lifecycle scope remains active |  |  |  |  |
| C7 | Commit is reachable from `origin/main`; lifecycle closeout records delivered provenance |  |  |  |  |
| C8 | C7 evidence plus a deployment record tying H2 to `training-staging`; no UAT evidence |  |  |  |  |
| C9 | C7 evidence plus an authorized UAT record for `training-staging`; no deployment record |  |  |  |  |

## Completion evidence

Your attempt is complete when it contains:

- **O12.1:** the Pass A restart and Pass B zero-change exit, with the reason for
  each;
- **O12.2:** four populated finding rows with severity, acceptance scope,
  merge-blocking status, disposition, and cited evidence;
- **O12.3:** one H1-to-H2 batch containing only blocking in-scope work, explicit
  P2 dispositions, cross-file and structured-data checks, and fresh H2 check
  and review requirements; and
- **O12.4:** all nine completion cards classified on the Git/review/delivery,
  deployment, and UAT axes without overclaiming.

Retain only the worksheets in an approved private learning note. The supplied
packet itself is already on this page; no repository output is evidence for
this exercise.

## Progressive hints

1. For **O12.1**, ask whether any action in the pass changed the branch. If it
   did, the next step is Read, not exit.
2. For **O12.2**, decide scope separately from severity. Then ask whether the
   supplied policy blocks the head.
3. For **O12.3**, include only rows that are both in scope and blocking. Every
   other row still needs a disposition.
4. For **O12.4**, split each card into three columns before choosing labels.
   Reachability, lifecycle closeout, deployment, and UAT are distinct facts.
5. After a genuine first attempt, compare with the
   [explained solution](../../solutions/module-12-review-and-completion.md).

## Expected failures and recovery

| Failure | Cause | Recovery |
| --- | --- | --- |
| Pass A is treated as complete | The final cleanup edit was not followed by another Read | Restart at Read and require one complete zero-change pass |
| Editing starts after F1 is read | The remaining findings were not classified | Undo the batch plan, classify F1–F4, then rebuild the plan |
| F4 is added to H2 | Severity was confused with acceptance scope | Record a separate-scope disposition; do not expand TRAIN-511 |
| One change is pushed for each finding | Finding count was mistaken for batch structure | Group the blocking in-scope repair, tests, and consistency checks into one coherent batch |
| H1 review is cited for H2 | Review evidence was not bound to the current head | Mark H1 stale and require a fresh H2 review |
| C5 or C6 is called delivered | Integration merge or reachability was treated as the whole delivery contract | Require both delivery-branch reachability and lifecycle closeout with delivered provenance |
| A local closeout is called delivered | The `completed/` artifact was recorded but never tracked on the delivery branch | Name `verify:completed-tracked` as the deciding gate, then land the artifact through a lifecycle pull request |
| Git evidence is used for deployment or UAT | Independent evidence axes were collapsed | Mark the unsupported axis unknown and name the missing record |

Reset by making fresh blank worksheets. This command-free exercise creates no
repository or remote state and needs no cleanup.

## Common misconceptions

- “Zero-change self-review means no defect exists.” It means only that the
  completed pass found no further edit.
- “P2 means ignore it.” A P2 still needs a documented disposition.
- “Out of scope means fix it while the context is open.” Out-of-scope work
  needs separate authorization.
- “The reviewer approved H1, so H2 is reviewed.” Review evidence is
  revision-bound.
- “Merge-ready means merge now.” Readiness does not grant merge authority.
- “Merged means delivered.” The configured delivery branch and lifecycle
  closeout still matter.
- “Completed means landed.” A local `scope:complete` records lifecycle closeout;
  `verify:completed-tracked` decides whether that closeout is tracked on the
  configured delivery branch.
- “Delivered means deployed and accepted.” Deployment and UAT need their own
  evidence.

## Self-assessment

Answer without opening the solution:

1. **O12.1:** Why must Pass A restart, and what exactly makes Pass B a valid
   pre-PR exit?
2. **O12.2:** Classify F1–F4 across all five worksheet dimensions and cite one
   supplied fact for each.
3. **O12.3:** Which findings belong in H2, what consistency checks belong in
   the batch, and why is H1 review stale afterward?
4. **O12.4:** Which card first proves merge-ready? Which first proves delivery?
   Which cards prove only deployment or UAT on an independent axis?

You are ready to continue when every answer points to supplied evidence and
none requires a live system or hidden instructor judgment.

## Explained solution

After a genuine first attempt, use the
[Module 12 explained solution](../../solutions/module-12-review-and-completion.md).
Compare the reasoning and evidence boundaries, then retry only the rows that
differ.

## Navigation

- Previous: [Module 11 — Testing, gates, and evidence](11-testing-gates-and-evidence.md)
- Course map: [curriculum README](../README.md)
- Next: [Capstone — End-to-End Solo Directive Lifecycle](../capstone-end-to-end.md)

## Official sources

- [Directive source baseline](../../references/SOURCE-BASELINE.md#module-12-review-and-completion-validation)
- [Module 12 source validation notes](../../references/SOURCE-NOTES.md#module-12-source-validation)
- [Directive learner quick reference](../../references/QUICK-REFERENCE.md)
