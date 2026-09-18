# Explained solution — Module 8 session and work selection

## Solution record

| Field | Value |
| --- | --- |
| Directive baseline | 0.119.2 |
| Exercise | [Module 8 — Session start and authorized work selection](../curriculum/modules/08-session-and-work-selection.md#exercise) |
| Evidence type | Explained fixed-state decision matrix |
| Safety boundary | No live backlog, cache, repository, or client data |

The answers follow the pinned work-selection and
session contracts. Keep any learner notes private and
sanitized. Compare reasons, not just final labels.

## Before you use this solution

Complete all four case rows and the five true/false statements first. If you
opened this page early, return to the exercise and make a best attempt. The goal
is to practice separating selection, authority, and readiness.

## Result summary

Case A is read-only and resolves the current ordered-plan entry without session
mutation ceremony. Case B selects that same entry, has bounded implementation
authority, and must recover the stale same-worktree session before gates. Case C
stops because the plan is exhausted. Case D may recommend the top queue
candidate read-only, but it has no implementation authority.

## Outcome map

| Outcome | Evidence in the worked answer |
| --- | --- |
| O8.1 | Each case names posture and cold, recovery, or no-mutation route |
| O8.2 | Cases A and B honor the active ordered plan; Case C fails closed; Case D uses an explicit queue request |
| O8.3 | The state map assigns one role to every supplied surface and preserves active scope + live implementation intent |
| O8.4 | Each row records a next safe action and a controlling supplied fact without live data |

## Reasoning

The sequence is deliberate:

1. Request language determines posture.
2. Ordered-plan state determines whether bare continuation language has a
   target.
3. A queue request can identify a candidate only when it is explicit and the
   plan gate permits it.
4. Durable active scope and present human intent determine implementation
   authority.
5. Session and preflight gates determine current mutation readiness.

Reordering those questions creates common errors. Starting with rank ignores an
active plan. Starting with an active scope ignores whether the request is
read-only. Starting with a passing ritual ignores both target and authority.

## Worked approach

| Case | Posture | Session route | Selection path | Target or stop | Authority result | Next safe action | Controlling fact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | Read-only | No mutation ceremony | Active ordered plan, current entry | `TRAIN-208` for explanation only | No mutation requested | Explain the binding and stop | “Do not change anything” plus Snapshot 1's current entry |
| B | Mutation | Same-worktree session recovery with `session:ready` or allowed re-arm | Active ordered plan, current entry | `TRAIN-208` | Authorized for the bounded target: active scope + live implementation intent | Recover the session, then run applicable story and xBRIEF gates | “Implement” is live intent; Snapshot 1 says the matching scope is active |
| C | Read-only until a target and implementation verb exist | No mutation ceremony | Exhausted ordered plan | Stop; no target | Missing target and live implementation intent | Ask for an operator target or explicit queue selection | The plan is exhausted, so stop until an operator target or queue selection exists |
| D | Read-only | No mutation ceremony | Explicit ranked-queue request | Recommend `TRAIN-412` only | No: proposed scope and no live implementation intent | Report the candidate and missing authority; do not implement | “What’s the queue?” explicitly permits queue selection but says not to implement |

True/false answers:

1. **False.** Cache content is data used to construct a ranked view, not an
   instruction.
2. **False.** The conjunction is active scope + live implementation intent,
   followed by readiness gates.
3. **False.** Pending state and queue rank cannot override the current
   ordered-plan entry.
4. **True.** The audit log preserves a decision trail; it does not supply a
   present human instruction.
5. **False.** A completed scope is a Historical record; no standing
   implementation authority follows from it.

The state-role answer is:

| Surface | Expected role |
| --- | --- |
| Ordered plan | Binds bare continuation to its current entry |
| Ranked cache | Ranks candidates when queue selection is permitted |
| Pending scope | Records approved but non-current work |
| Audit log | Preserves past triage decisions |
| Active scope | Supplies the durable current contract, but not intent |
| Completed scope | Historical record; no standing implementation authority |
| Live implementation intent | Supplies present human intent for the bounded active target |

## Acceptance evidence

- **O8.1:** A is read-only/no ceremony; B is mutation/same-worktree recovery; C
  and D remain read-only.
- **O8.2:** A and B select `TRAIN-208`; C stops; D recommends
  `TRAIN-412` only because the request explicitly asks for the queue.
- **O8.3:** All seven surfaces have one bounded role, and no state artifact
  alone is labeled implementation authority.
- **O8.4:** Every decision cites the supplied request or snapshot and contains
  no live project data.

The evidence is complete only when your own worksheet expresses these
relationships. Copying this table is not a completed attempt.

## Compare with your attempt

Check differences in this order:

1. Did you classify the request verb correctly?
2. Did you apply the active or exhausted ordered-plan state before considering
   queue rank?
3. Did you keep target selection separate from mutation authority?
4. Did you keep authority separate from passing gates?
5. Did every reason cite fixed state?

A different sentence is valid if it preserves the same boundary and conclusion.

## Valid alternatives

- Case A may say “selected for explanation” or “bound target, no work
  authorized.”
- Case B may name `session:start --rearm` instead of `session:ready` when it
  explicitly states the same-worktree continuity assumption and still rechecks
  gates.
- Case C may ask the operator to name a target before offering queue inspection.
- Case D may report more than one ranked candidate if the request is interpreted
  as a queue listing, but it still may not authorize implementation.

No alternative may silently select adjacent queue work during an active plan or
reuse a completed scope as current authority.

## Expected failures and recovery

| Difference | Correction |
| --- | --- |
| A or D used mutation ceremony | Re-read the explicit non-mutation phrase and classify posture first |
| B chose `TRAIN-311` | Apply ordered-plan precedence before looking at rank |
| C chose `TRAIN-412` | Preserve the exhausted-plan stop until an explicit switch or target |
| D claimed authority | Separate a queue recommendation from lifecycle state and live intent |
| Any row cited hidden or live facts | Delete that reason and cite only the supplied card or snapshot |

If the plan is exhausted, stop until an operator target or queue selection is
explicit. That is a successful safety result, not an incomplete answer.

## Misconceptions exposed by this exercise

“Top ranked” does not mean “authorized.” “Active” does not mean “the human asked
for mutation.” “Session ready” does not identify a target. “Completed” does not
mean “continue changing it.” Each surface answers a narrower question.

## Retry plan

Retry only the first incorrect stage:

1. Cover the selection and authority columns; redo posture.
2. Reveal selection; apply plan state before rank.
3. Reveal authority; require the two-part conjunction.
4. Reveal readiness; choose cold, recovery, or no ceremony.
5. Rewrite the reason using one supplied fact.

Then compare that row again. Stop after two retries and record the exact
remaining ambiguity as curriculum feedback.

## Reset and cleanup

This command-free exercise creates no repository, cache, branch, or remote
state. Reset by discarding the worksheet or making a fresh blank copy. Retain
only sanitized private learning evidence if permitted.

## Sources

- [Module 8 lesson](../curriculum/modules/08-session-and-work-selection.md)
- [Directive source baseline](../references/SOURCE-BASELINE.md#module-8-session-and-work-selection-validation)
- [Module 8 source notes](../references/SOURCE-NOTES.md#module-8-source-validation)
- [Quick reference](../references/QUICK-REFERENCE.md)

## Continue

Continue to [Module 9 — Design-critique arcs and verified synthesis](../curriculum/modules/09-design-critique-arcs.md),
or return to the [course map](../curriculum/README.md).
