# Module 7 — Scope Lifecycle and Implementation Authorization

## Module record

| Field | Value |
| --- | --- |
| Stable ID | `module-07-scope-lifecycle` |
| Status | Learner-ready draft; executable lab verified on macOS/zsh |
| Last verified | 2026-09-09 |
| Directive baseline | `@deftai/directive@0.112.0`, engine `@deftai/directive-core@0.112.0`; see the [source baseline](../../references/SOURCE-BASELINE.md) |
| Duration | 65 minutes, including the disposable lab |
| Prerequisites | Modules 1–6; Node.js 20+, npm, Git, Task, `uv`, and a dedicated terminal |
| Native platform evidence | macOS/zsh verified; Linux/bash and Windows/PowerShell are candidates, not learner-ready claims |

Claims are labeled **[Directive behavior]**, **[3Ci policy]**, or **[Course guidance]**.
The first describes the pinned release, the second a local safety rule, and the third a
teaching technique.

## Learning outcomes

By the end of this module, you can:

- **O7.1 — Diagnose authorization state:** predict and explain why a proposed scope fails
  xBRIEF preflight.
- **O7.2 — Use lifecycle commands:** move fictional scopes through
  `proposed -> pending -> active/running -> completed` and into `cancelled`, always keeping
  folder and `plan.status` aligned.
- **O7.3 — Establish current implementation readiness:** distinguish lifecycle state from
  live implementation intent, then require the session ritual and active-scope preflight
  before an implementation mutation.
- **O7.4 — Preserve evidence and recover safely:** retain the expected failure, start a fresh
  attempt after drift, and archive only an explicitly named guarded lab root.

## Starting-state check

Without running a command, classify each statement as true or false:

1. A well-shaped proposed xBRIEF is approved to implement.
2. Moving a file into `active/` by hand is equivalent to activation.
3. An active/running scope remains standing authority in a later conversation.
4. A successful xBRIEF preflight proves that the work was delivered.

All four are false. If any felt true, reread [Module 4](04-xbrief-as-durable-state.md) and
[Module 6](06-creating-well-shaped-work.md) before entering the lab.

**[Course guidance]** Write one sentence for each false statement. This exposes the exact
boundary you need to observe rather than turning the module into command memorization.

## Why this matters

Well-shaped work is still only candidate work. A repository needs a durable answer to
“which scope is current?” and a live answer to “did the operator ask for implementation
now?” Confusing those questions produces two common failures: starting unapproved work, or
treating an old completed record as permission for a new change.

**[Directive behavior]** The lifecycle file records durable state. The current
implementation contract is an active/running xBRIEF plus the operator's live implementation
instruction. Deterministic gates then establish readiness. No single file, chat message, or
green check substitutes for the whole conjunction.

**[3Ci policy]** In this course, lifecycle commands run only in the supplied fictional,
no-remote, operating-system temporary repository. The lesson does not authorize a push,
pull request, merge, deployment, publication, or change in a business repository.

## Terminology

| Term | Meaning in this module |
| --- | --- |
| Promotion | The lifecycle command moves a proposed scope to `pending/` and sets `plan.status` to `pending`. |
| Activation | The lifecycle command moves a pending scope to `active/` and sets `plan.status` to `running`. |
| Live implementation intent | A current human instruction to implement the bounded active scope; it is not stored standing permission. |
| Session ritual | The current session checks that establish aligned, gated mutation readiness. |
| xBRIEF preflight | The fail-closed check that the named scope is in `active/`, is `running`, and satisfies its applicable contract checks. |
| Lifecycle evidence | Command, exit, relevant output, folder, status, pin, environment, and safety-boundary facts that support a state claim. |
| Cancellation | A recorded terminal choice not to proceed in the scope's current form; the file moves to `cancelled/` with status `cancelled`. |
| Completion | Lifecycle closeout into `completed/`; not, by itself, proof of delivery, deployment, or UAT. |

## Mental model

```text
shaped candidate       approved queue         current durable scope       historical record
proposed/proposed  ->  pending/pending   ->   active/running          ->  completed/completed
      |                      |                         |
      +----------------------+-------------------------+-> cancelled/cancelled

implementation authority = active/running scope + live implementation intent
mutation readiness        = authority + required current deterministic gates
delivery                  = separate evidence; completion alone does not prove it
```

The two values on each lifecycle node are folder and `plan.status`. Treat disagreement as a
defect, not as a judgment call about which half “really” wins.

## Guided explanation

### 1. Proposed is reviewable, not runnable

**[Directive behavior]** `proposed/` holds shaped work for consideration. At 0.112.0,
preflight against the fictional proposed story exits `1` in the pinned Directive engine and
prints that only `active/` is eligible. On the verified host, go-task 3.50.0 wraps that child
failure as process exit `201`. Both are retained: the engine exit is the release-bound claim;
the task exit is runner/environment evidence.

Changing the status text or moving the file manually would evade the lifecycle operation's
validation and audit behavior. Use the command surface.

### 2. Promotion and activation answer different questions

**[Directive behavior]** Promotion means “approved into pending work.” Activation means
“this is the current running scope.” The consumer Task spellings are:

```text
task deft:scope:promote -- xbrief/proposed/<scope>.xbrief.json
task deft:scope:activate -- xbrief/pending/<scope>.xbrief.json
```

The 0.112.0 help and Task descriptions retain some `vBRIEF` wording. That is a recorded
documentation disagreement, not permission to use the legacy model. New course writes use
`xbrief/` and schema 0.8.

### 3. Active state is necessary, not sufficient

**[Directive behavior]** An active/running scope supplies the durable half of the current
contract. The operator's live implementation instruction supplies the human-intent half.
The lab makes that instruction explicit with `--intent=implement`, which applies only to the
current helper invocation and is recorded as such.

**[Course guidance]** Think in three rows:

| Question | Evidence | If missing |
| --- | --- | --- |
| Is this the bounded current scope? | Exactly one named `active/` file with status `running` | Do not implement. |
| Did the operator request implementation now? | Live implementation instruction | Stay read-only. |
| Are current start gates green? | Session start, gated ritual, and active xBRIEF preflight | Recover the failing gate before mutation. |

A gate tests a condition; it does not expand scope or invent human permission.

### 4. Completion and cancellation preserve history

**[Directive behavior]** `scope:complete` closes an active scope as
`completed/completed`. `scope:cancel` preserves a no-longer-wanted scope as
`cancelled/cancelled`. Neither outcome should be imitated by deletion or manual movement.

**[Course guidance]** In the lab, the completion story has no product edit or remote delivery.
Its completion proves the lifecycle mechanism, not that software shipped. This deliberate
limit keeps lifecycle state separate from the evidence ladder taught later.

### 5. Evidence must survive recovery

An expected failure is useful only if it remains inspectable. The lab writes proposed
preflight evidence outside the repository but inside the guarded attempt parent before
promotion. Reset creates a new unique attempt; it does not repair or overwrite the old one.
Cleanup is a recoverable archive move of the exact guarded parent, never a recursive delete.

## Walkthrough

Read [Lab 7](../../labs/07-scope-lifecycle.md) before opening a terminal. Predict this event
sequence and then compare it with the retained JSON:

| Event | Expected folder/status | Expected exit |
| --- | --- | ---: |
| Pinned preflight while proposed | `proposed/proposed` | `1` |
| Task preflight while proposed | unchanged | nonzero; `201` on verified go-task 3.50.0 |
| Promote | `pending/pending` | `0` |
| Activate | `active/running` | `0` |
| Cancel the separate obsolete story | `cancelled/cancelled` | `0` |
| Start session and run gated ritual | delivery story remains `active/running` | `0`, then `0` |
| Active preflight after live intent and gates | `active/running` | `0` |
| Complete | `completed/completed` | `0` |

The helper isolates the Task PATH so another installed Directive version cannot silently
replace the fixture's exact 0.112.0 engine. It still exposes the required `node`, `task`,
`npm`, `git`, and `uv` executables.

## Exercise

Complete the full [disposable lifecycle lab](../../labs/07-scope-lifecycle.md). Before you
run it, copy the prediction table above into private notes and add two columns: “observed
exit” and “evidence path.”

Your written explanation must answer:

1. Why did the proposed scope fail even though it was well-shaped? (**O7.1**)
2. What did promotion change that activation did not, and vice versa? (**O7.2**)
3. Why did `active/running` not eliminate the need for live implementation intent and the
   session gates? (**O7.3**)
4. How did reset and archive retain evidence without widening the mutation target? (**O7.4**)

Do not add product code to the fictional repository. The exercise is the lifecycle itself.

## Completion evidence

- **O7.1:** `evidence/proposed-preflight.json` records pinned engine exit `1`, the nonzero
  Task result, and the unchanged proposed folder/status pair.
- **O7.2:** `evidence/lifecycle-run.json` records successful Task transitions and final
  `completed/completed` plus `cancelled/cancelled` outcomes.
- **O7.3:** the evidence orders `sessionStart`, `sessionRitual`, and `activePreflight` after
  explicit current intent; all exit `0`.
- **O7.4:** a second unique reset root exists while the first evidence remains readable, and
  each retained attempt has either its original path or a recorded recoverable archive path.

## Progressive hints

1. Compare folder and status as one pair; do not inspect only the JSON status.
2. Approval into pending and selection as current active work are separate transitions.
3. Put durable scope, live human intent, and deterministic readiness on three separate lines.
4. If the result drifted, do not reverse lifecycle files manually. Preserve evidence and use
   the helper's fresh reset.

## Expected failures and recovery

| Failure | Meaning | Recovery |
| --- | --- | --- |
| Proposed preflight exits `1` | Expected fail-closed behavior, O7.1 evidence | Preserve the output; continue only through promotion and activation. |
| Task preflight exits a wrapper-specific nonzero | Task preserved the child failure | Record both exits; do not claim the wrapper code is part of Directive's engine contract. |
| Guard rejects the root | Path, marker, Git identity, branch, pin, helper, or no-remote boundary drifted | Stop. Keep the attempt and create a fresh one. |
| Install is partial or version differs | The taught release is not established | Preserve output; reset. Do not substitute a global CLI. |
| Session ritual fails | Current mutation readiness is absent | Preserve the diagnostic; reset or repair only the named prerequisite in the disposable attempt. |
| Story is in two folders or folder/status disagree | Lifecycle integrity is broken | Preserve the attempt; reset. Do not hand-move it into a passing shape. |
| Archive refuses | Target is noncanonical, foreign, inside the caller's current parent, or already archived | Leave the source intact; move outside the parent and retry the exact absolute root. |

## Common misconceptions

- “Approved scope” does not always mean active scope; pending work is approved but not current.
- Active state does not turn a past operator instruction into standing permission.
- Preflight passing does not prove implementation, review, merge, delivery, deployment, or UAT.
- Completed does not automatically mean delivered.
- Cancellation is evidence, not failure to keep the repository tidy.
- A Task wrapper's exit code is not automatically the engine's exit-code contract.

## Self-assessment

1. **O7.1:** What exact folder/status and exit prove the proposed failure?
2. **O7.2:** Name the command and resulting pair for promotion, activation, completion, and
   cancellation.
3. **O7.3:** State the implementation-authority conjunction and the additional readiness
   gates in one sentence.
4. **O7.4:** Explain why a new unique root and an exact-parent archive are safer than fixing
   or recursively deleting the first attempt.

You are ready for Module 8 only when all four answers cite your retained evidence, not just
the expected table.

## Explained solution

After a genuine first attempt of about ten minutes, compare your evidence with the
[explained Lab 7 solution](../../solutions/lab-07-scope-lifecycle.md). If you open it sooner,
retain the failure first and retry in a fresh attempt.

## Navigation

- Previous: [Module 6 — Creating Well-Shaped Work](06-creating-well-shaped-work.md)
- Course map: [3Ci Directive training](../README.md)
- Practice: [Lab 7 — Scope Lifecycle](../../labs/07-scope-lifecycle.md)
- Next: Module 8 — Session Start and Authorized Work Selection is planned and not yet learner-ready.

## Official sources

| Claim | Type | Source | Checked |
| --- | --- | --- | --- |
| Lifecycle transitions and consumer Task forms | Directive behavior | [Commands — Scope xBRIEF Lifecycle][commands] | 2026-09-09 |
| Active contract plus live operator instruction | Directive behavior | [Main — xBRIEF Persistence][main] | 2026-09-09 |
| Session routing and gated ritual | Directive behavior | [Commands — Session routing and ritual][commands] | 2026-09-09 |
| Release-specific runtime exits and Task wrapper result | Observed evidence | [Module 7 source validation](../../references/SOURCE-NOTES.md#module-7-source-validation) | 2026-09-09 |

[commands]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/commands.md
[main]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/main.md
