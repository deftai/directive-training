# Explained solution — Scope Lifecycle and Implementation Authorization

## Solution record

| Field | Value |
| --- | --- |
| Stable ID | `solution-lab-07-scope-lifecycle` |
| Solves | [Lab 7 — Scope Lifecycle](../labs/07-scope-lifecycle.md) |
| Outcomes covered | O7.1, O7.2, O7.3, O7.4 |
| Status | Learner-ready draft for the verified macOS/zsh path |
| Last verified | 2026-09-09 |
| Directive baseline | CLI/core/content/types `0.112.0`; [source baseline](../references/SOURCE-BASELINE.md) |
| Platform limit | Linux/bash and native Windows/PowerShell are candidates and are not verified or learner-ready for this lab |

Claims use **[Directive behavior]**, **[3Ci policy]**, and **[Course guidance]**. The lab
helper is course tooling around released commands; it is not itself a Directive guarantee.

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

## Reasoning

### 1. Keep state, intent, and evidence separate

**[Directive behavior]** Lifecycle state is durable repository data. Live implementation
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

**[Directive behavior]** In the verified sequence:

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

**[Course guidance]** Retain both. Use `1` for the Directive 0.112.0 behavior claim. Use the
Task result as environment evidence and require only that it is nonzero on an unverified Task
version or platform. Hiding one exit loses useful diagnostic context; treating `201` as an
engine guarantee overclaims it.

### 4. Preserve failure before repair

The helper writes `proposed-preflight.json` before promotion. Later green steps therefore
cannot erase the original authorization decision. `lifecycle-run.json` then records the whole
ordered sequence, including pin, environment, intent boundary, exits, outputs, final pairs,
and the empty remote value.

**[3Ci policy]** This evidence lives outside the disposable repository so it cannot be staged
by lifecycle commands. It stays inside the exact marked temporary parent and moves with that
parent during archive.

## Worked approach

### Step 1 — Establish the boundary and release

Run the lab's environment block from the course root. A correct start has:

```text
.../3ci-directive-lab07-<unique>/repo
training/module-07
@deftai/directive (engine: @deftai/directive-core@0.112.0)
```

The empty `git remote` output is evidence, not missing setup. The helper verifies the exact
CLI/core/content/types graph and the deposited 0.112.0 version. Its isolated Task PATH keeps
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

### Step 5 — Reset without rewriting history

Run the documented reset against the first guarded root. It creates another unique proposed
fixture and returns its path. It does not move, delete, or repair the first root.

The recovery check authenticates the canonical temporary target, marker, Git root, expected
branch, and empty remote. It intentionally does not demand a complete install, unchanged
fixture digest, or coherent lifecycle state from the failed attempt.

Verify both roots and reread the first evidence. This shows recovery as isolation: a known
fresh starting point plus an intact failure record.

### Step 6 — Archive exact attempts

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

Also retain the exact 0.112.0 package graph and empty remote value. A screenshot of final
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

Any “no” identifies the smallest outcome to retry.

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

Stop after three identical no-progress failures and report a curriculum defect with sanitized
paths, versions, exits, and output. Do not loop indefinitely.

## Reset and cleanup

Reset creates a fresh attempt and preserves the first. Archive moves the exact guarded parent
to `3ci-directive-lab-archive` under the operating-system temporary directory. Neither route
uses a recursive delete.

Keep the original helper path, run from outside the attempt parents, and record every returned
root or archive path. A rejected archive leaves the source intact.

## Sources

- [Module 7 source validation](../references/SOURCE-NOTES.md#module-7-source-validation)
- [Directive source baseline](../references/SOURCE-BASELINE.md#module-7-lifecycle-validation)
- [Pinned Commands source](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/commands.md)
- [Pinned Main source](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/main.md)

## Continue

Return to [Module 7](../curriculum/modules/07-scope-lifecycle.md) and complete its
self-assessment from your evidence. Module 8 remains planned; use the
[course map](../curriculum/README.md) rather than assuming a future filename is ready.
