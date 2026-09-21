# Explained solution — Scope Lifecycle and Implementation Authorization

## Solution record

| Field | Value |
| --- | --- |
| Stable ID | `solution-lab-07-scope-lifecycle` |
| Solves | [Lab 7 — Scope Lifecycle](../labs/07-scope-lifecycle.md) |
| Outcomes covered | O7.1, O7.2, O7.3, O7.4 |
| Status | Learner-ready draft for the verified macOS/zsh path |
| Last verified | 2026-09-21 |
| Directive baseline | CLI/core/content/types `0.119.5`; [source baseline](../references/SOURCE-BASELINE.md) |
| Platform limit | Linux/bash and Windows/PowerShell are candidates and are not verified or learner-ready for this lab |

The lab helper is course tooling around released commands; it is not itself a
Directive guarantee.

## Before you use this solution

Give the lab about ten minutes. Preserve the proposed preflight failure before reading on.
Use hints one at a time, then compare your evidence and reasoning with this solution.

The solution is not hidden behind an instructor. If safety, installation, or session setup
blocks you, read it immediately—but retry from a fresh attempt before claiming the outcome.

## Result summary

The pinned Directive engine rejected proposed preflight with exit `1`. The Task lifecycle
then produced `pending/pending` and `active/running`; the separate obsolete scope became
`cancelled/cancelled`. Explicit current intent preceded session start, the gated ritual, and
active preflight, all of which passed. Completion produced `completed/completed`.

Lab 7 Task 5 then checked the scope authored in Module 6 Part B. The retained
`evidence/authored-verify.txt` carried all four fields: the artifact **path**, the exact
`xbrief:verify` **command**, the **exit code** `0`, and the **result** line. That record is
adjacent Module 6 **O6.2 structural evidence** and adds no Lab 7 outcome; the authored scope
stayed `proposed/proposed`, because the four Task 5 boundary clauses in Step 5 hold at exit `0`.

The first failure and the complete run remained in the parent evidence directory. Reset
returned a different guarded root without changing the first. Cleanup, when chosen, moved an
exact guarded parent into a recoverable temporary archive. No product code or remote changed.

## Outcome map

| Outcome | Correct conclusion | Evidence |
| --- | --- | --- |
| O7.1 | Proposed scope is shaped candidate state, not implementation-ready active state. | Pinned preflight exit `1`, nonzero Task wrapper exit, unchanged proposed pair |
| O7.2 | Lifecycle commands own folder/status transitions; manual moves do not. | Task exits `0`; pending, active/running, completed, and cancelled pairs |
| O7.3 | Current authority requires active/running scope plus live implementation intent; current gates establish readiness. | `liveIntent`, then session start, ritual, and active preflight exits `0` |
| O7.4 | Recovery preserves evidence by creating a new root; archive is an exact recoverable move. | Different reset paths, readable original JSON, guarded archive path |

- **O6.2 structural evidence:** Task 5 supplies Module 6's O6.2 structural completion
  evidence and adds no Lab 7 outcome, so this map keeps four rows. Its comparison is in
  Step 5, Acceptance evidence, and question 8 below.

## Reasoning

### 1. Keep state, intent, and evidence separate

Lifecycle state is durable repository data. Live implementation
intent is a current human instruction. Session and preflight gates test readiness. These facts
work together, but none should be relabeled as another:

```text
durable current scope: active folder + running status
human authorization:  live implementation instruction now
readiness evidence:   current session ritual + applicable preflight gates
delivery evidence:    a later, separate claim surface
```

This is why a proposed story can be perfectly clear and still fail preflight, and why a
completed lifecycle exercise cannot honestly be called delivered software.

### 2. Require lifecycle commands to keep the pair coherent

In the verified sequence:

| Command role | Before | After | Exit |
| --- | --- | --- | ---: |
| Proposed preflight | `proposed/proposed` | unchanged | `1` in pinned engine |
| Promote | `proposed/proposed` | `pending/pending` | `0` |
| Activate | `pending/pending` | `active/running` | `0` |
| Cancel obsolete story | `proposed/proposed` | `cancelled/cancelled` | `0` |
| Complete delivery story | `active/running` | `completed/completed` | `0` |

The unusual `running` status in the `active/` folder is intentional. Folder and status have
different vocabularies but one governed mapping.

### 3. Interpret the two proposed-preflight exits correctly

The helper invokes both the exact local Directive binary and the consumer Task surface. The
engine exits `1`. On the verified go-task 3.50.0 host, the Task process returns `201` while
reporting its child exit `1`.

Retain both. Use `1` for the Directive 0.119.5 behavior claim. Use the
Task result as environment evidence and require only that it is nonzero on an unverified Task
version or platform. Hiding one exit loses useful diagnostic context; treating `201` as an
engine guarantee overclaims it.

### 4. Preserve failure before repair

The helper writes `proposed-preflight.json` before promotion. Later green steps therefore
cannot erase the original authorization decision. `lifecycle-run.json` then records the whole
ordered sequence, including pin, environment, intent boundary, exits, outputs, final pairs,
and the empty remote value.

This evidence lives outside the disposable repository so it cannot be staged
by lifecycle commands. It stays inside the exact marked temporary parent and moves with that
parent during archive.

## Worked approach

### Step 1 — Establish the boundary and release

Run the lab's environment block from the course root. A correct start has:

```text
.../3ci-directive-lab07-<unique>/repo
training/module-07
@deftai/directive (engine: @deftai/directive-core@0.119.5)
```

The empty `git remote` output is evidence, not missing setup. The helper verifies the exact
CLI/core/content/types graph and the deposited 0.119.5 version. Its isolated Task PATH keeps
another installed Directive version from taking precedence.

The generated workspace-local USER.md is fictional attempt state. It is ignored and never
copies the learner's shared USER.md. Directive session start reports the workspace-local path.

### Step 2 — Predict, then run with current intent

Your prediction should say that proposed preflight fails before any transition. Then invoke
the original helper exactly as the lab shows, including `--intent=implement`.

The helper refuses a missing or different intent value before lifecycle mutation. The accepted
flag is deliberately narrow: it authorizes this training invocation against these supplied
stories. It does not authorize implementation elsewhere or in a future run.

Expected first evidence fields:

```json
{
  "intent": "implement (current helper invocation only)",
  "pinnedDirectiveExit": 1,
  "taskExit": 201,
  "stateBeforePromotion": { "folder": "proposed", "status": "proposed" }
}
```

The displayed Task value is from the verified macOS/zsh/go-task environment. A different
nonzero Task wrapper result can still satisfy the candidate path if the pinned engine exit is
`1` and the diagnostic names the proposed boundary.

### Step 3 — Read the lifecycle as a sequence

Do not jump straight to `final`. Inspect each step. Promotion's output names
`proposed/ -> pending/ (status: pending)`. Activation names
`pending/ -> active/ (status: running)`. Cancellation names
`proposed/ -> cancelled/ (status: cancelled)`.

Session start must follow activation. The gated ritual must follow session start. Active
preflight must follow both, and its output should name the active story as ready for
implementation. Completion comes last and moves only the delivery story.

If your JSON does not preserve this order, the final folders are insufficient evidence for
O7.3 even if they look correct.

### Step 4 — State the narrow result

A precise statement is:

> The fictional delivery scope passed a current authorization/readiness sequence and its
> lifecycle was completed; the separate obsolete scope was cancelled. No product behavior or
> remote delivery was attempted.

“The feature shipped” is unsupported. “The preflight authorized all later work” is also
unsupported because live intent is current and scope-bounded.

### Step 5 — Verify the scope you authored (Task 5)

Write your Module 6 Part B artifact into the first attempt's `xbrief/proposed/`, then run the
supplied command. Retain all four fields from `evidence/authored-verify.txt`:

| Retained field | Worked value |
| --- | --- |
| Artifact **path** | `<first_root>/xbrief/proposed/2026-01-15-your-proposed-scope.xbrief.json` |
| Exact **command** | `node <first_root>/node_modules/.bin/directive xbrief:verify -- --format json --out <artifact path> --style scope --project-root <first_root>` |
| **Exit code** | `0` |
| **Result** | the `xbrief:verify` result line naming the checked path |

Exit `0` against that exact path is the positive structural result; exit `1` names the first
structural defect in your file. Both are complete O6.2 evidence once all four fields are kept.

Exit `0` is where a learner is most tempted to conclude the artifact is well shaped. It is not.
Lab 7 publishes four boundary clauses, and all four still hold:

- `xbrief:verify` is not a lifecycle move. Do not promote or activate your scope.
- A green structural result grants no promotion, no activation, and no implementation authority.
- `xbrief:preflight` and `doctor` are not the authoring-validity pass.
- The structural result does not prove version `0.8`, proposed status, observable acceptance,
  or traces.

The Module 6 comparison rubric proves what this surface cannot. Its long table is the
[Module 6 structural record](module-06-creating-well-shaped-work.md#structural-record); read it
there rather than treating either surface as the other.

### Step 6 — Reset without rewriting history

Run the documented reset against the first guarded root. It creates another unique proposed
fixture and returns its path. It does not move, delete, or repair the first root.

The recovery check authenticates the canonical temporary target, marker, Git root, expected
branch, and empty remote. It intentionally does not demand a complete install, unchanged
fixture digest, or coherent lifecycle state from the failed attempt.

Verify both roots and reread the first evidence. This shows recovery as isolation: a known
fresh starting point plus an intact failure record.

### Step 7 — Archive exact attempts

Leave both attempt parents and invoke archive from the course root. The helper verifies the
absolute canonical target, marker binding, Git root, branch, and empty remote. It intentionally
allows damaged package, fixture, or lifecycle state to remain damaged so the failure evidence
can be preserved. It refuses an existing destination. Only then does it rename the exact
parent under the temporary archive directory.

The original path disappears because it moved; the archive contains `repo/`, `lab-state.json`,
and `evidence/`. Record the new path. This is recoverable cleanup, not deletion.

## Acceptance evidence

| Outcome | Required evidence | Passing interpretation |
| --- | --- | --- |
| O7.1 | Proposed engine exit `1`, nonzero Task exit, diagnostic, proposed pair | The expected failure is understood and retained. |
| O7.2 | Promote, activate, cancel, complete exits `0`; final guarded files | Commands produced matching folder/status pairs. |
| O7.3 | Explicit current intent; session start, ritual, active preflight exits `0` in order | Current authority and readiness were established without conflation. |
| O7.4 | Different guarded reset root; old evidence readable; retained/archive locations | Recovery did not overwrite evidence or widen the target. |

**O6.2 structural evidence (Task 5, adjacent):** `evidence/authored-verify.txt` retains the
artifact **path**, the exact `xbrief:verify` **command**, the **exit code** `0`, and the
**result** line, and the authored record is still under `xbrief/proposed/`. Task 5 adds no
Lab 7 outcome, so this table keeps its four O7 rows, and the four Task 5 boundary clauses in
Step 5 govern how the green result may be read.

Also retain the exact 0.119.5 package graph and empty remote value. A screenshot of final
folders alone does not prove O7.1 or O7.3.

## Compare with your attempt

Ask these questions:

1. Did you predict failure, or call it an installation defect after seeing it?
2. Did you record both Task and engine exits without claiming they are the same layer?
3. Did you name promotion and activation separately?
4. Did your authorization sentence include both durable state and live intent?
5. Did your readiness sentence add session and preflight gates?
6. Did reset return a different canonical root while the first evidence remained readable?
7. Is every result still no-remote and bounded to fictional data?
8. Does your Task 5 record carry all four retained fields — the artifact **path**, the exact
   `xbrief:verify` **command**, the **exit code**, and the **result** line — and did you read
   exit `0` under the four Task 5 boundary clauses in Step 5 rather than as a well-shaped
   verdict?

A “no” on questions 1–7 identifies the smallest Lab 7 outcome to retry. A “no” on question 8
is not a Lab 7 outcome miss, because Task 5 adds no Lab 7 outcome. Re-author the artifact
against [Module 6](../curriculum/modules/06-creating-well-shaped-work.md) Part B in place, then
rerun the same `xbrief:verify` command against the same path and retain both exit codes.

## Valid alternatives

- You may keep the first and second attempts at their original paths instead of archiving them,
  if you record that retained state and follow the operator's later retention policy.
- You may write the outcome explanation in a private note or approved learning system rather
  than inside the evidence directory, provided it cites the exact JSON fields.
- A candidate platform may surface a Task wrapper exit other than `201`; preserve it and keep
  the pinned engine exit `1` requirement.

Manual file moves, global CLI substitution, deleted failure evidence, a reused reset root, or
a remote-enabled fixture are not valid alternatives.

## Expected failures and recovery

| Failure | Correct response |
| --- | --- |
| Proposed preflight failure | Keep it as O7.1 evidence; do not “fix” the gate. |
| Changed package/helper rejection | Stop and reset from the original course fixture. |
| Partial install | Preserve the failed attempt and create a fresh one. |
| Session tool or CLI precedence failure | Keep the diagnostic; restore only the supplied isolated path through a fresh attempt. |
| Folder/status mismatch | Do not hand-edit either half; reset and rerun commands. |
| Missing live-intent flag | Supply it only if you currently choose to perform this lab run. |
| Archive target refusal | Return to the course root and use the exact absolute path; never broaden the helper. |
| Task 5 exits `1` | Repair the authored record in place against Module 6 Part B, rerun the same command against the same path, and retain both exit codes. |
| Task 5 exits `0` and the scope looks ready to promote | Keep it `proposed/proposed`. Reread the four Task 5 boundary clauses in Step 5; none of them grants a lifecycle move or implementation authority. |

## Misconceptions exposed by this exercise

- Clear proposed acceptance is not implementation authorization.
- Pending is not a synonym for active.
- Active/running is durable scope state, not durable human permission.
- A gate result is evidence about its condition, not a grant of wider scope.
- Lifecycle completion and software delivery are separate claims.
- Cancellation is a preserved decision, not missing work.
- Fresh reset means new identity, not mutation until old evidence looks clean.

## Retry plan

1. Keep the failed attempt unchanged.
2. Write the unmet outcome and the exact failing evidence path.
3. Create a fresh root with the original helper.
4. Recheck branch, remote, pin, and proposed pairs.
5. Install once; do not repair a partial install.
6. Predict the failing exit and transition sequence.
7. Run only with current `--intent=implement`.
8. Re-evaluate the smallest unmet outcome.

A Task 5 miss uses none of those steps and needs no fresh root. Re-author the artifact against
[Module 6](../curriculum/modules/06-creating-well-shaped-work.md) Part B inside the same
attempt, rerun the same `xbrief:verify` command against the same path, and retain both exit
codes with the artifact path and the result line. The four Task 5 boundary clauses in Step 5
still hold once it exits `0`.

Stop after three identical no-progress failures and report a curriculum defect with sanitized
paths, versions, exits, and output. Do not loop indefinitely.

## Reset and cleanup

Reset creates a fresh attempt and preserves the first. Archive moves the exact guarded parent
to `3ci-directive-lab-archive` under the operating-system temporary directory. Neither route
uses a recursive delete.

Keep the original helper path, run from outside the attempt parents, and record every returned
root or archive path. A rejected archive leaves the source intact.

Your Task 5 artifact and its `evidence/authored-verify.txt` record — path, command, exit code,
and result — sit inside the first attempt's guarded parent, so reset leaves both untouched and
archive moves them with that exact parent. Reset is not the Task 5 repair route, and the four
Task 5 boundary clauses in Step 5 hold across both routes.

## Sources

- [Module 7 source validation](../references/SOURCE-NOTES.md#module-7-source-validation)
- [Directive source baseline](../references/SOURCE-BASELINE.md#module-7-lifecycle-validation)
- [Pinned Commands source](https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/commands.md)
- [Pinned Main source](https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/main.md)

## Continue

Return to [Module 7](../curriculum/modules/07-scope-lifecycle.md) and complete its
self-assessment from your evidence, including the Task 5 record. Then continue to
[Module 8 — Session start and authorized work selection](../curriculum/modules/08-session-and-work-selection.md).
The [course map](../curriculum/README.md) lists the rest of the path.
