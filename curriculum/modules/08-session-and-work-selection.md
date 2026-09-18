# Module 8 — Session start and authorized work selection

## Module record

| Field | Value |
| --- | --- |
| Directive baseline | 0.119.2 |
| Estimated time | 45 minutes |
| Prerequisite | [Module 7 — Scope lifecycle and implementation authorization](07-scope-lifecycle.md) |
| Exercise model | Command-free analysis of fixed fictional state |
| Evidence | A completed decision matrix with one reason per decision |

This module describes the pinned release named above.
Use only the fictional cards and snapshots on this page; use no
live GitHub backlog, cache, repository, or client data.
Make each decision before reading the explained solution.

## Learning outcomes

By the end of this module, you can:

- **O8.1** classify a request as read-only orientation or mutation, then choose
  cold session start or same-worktree recovery;
- **O8.2** apply ordered-plan precedence, ranked-queue selection, and the
  exhausted-plan stop;
- **O8.3** map the ordered plan, ranked cache, pending scope, audit log, active
  scope, completed scope, and live implementation intent to their exact roles;
  and
- **O8.4** record enough evidence to explain a safe selection or stop without
  reading live project state.

## Starting-state check

Before continuing, confirm all four statements:

- You can explain why an active/running xBRIEF is necessary but not sufficient
  for implementation.
- You can distinguish a completed lifecycle record from current authority.
- You have a blank copy of the decision matrix in **Exercise**.
- You will use the fixed fictional state below and will not inspect local
  Directive state, GitHub, or another repository.

If either of the first two statements is unclear, revisit
[Module 7](07-scope-lifecycle.md#mental-model). If the final statement is not
acceptable, stop; this exercise has no live-state alternative.

## Why this matters

A session can be correctly aligned yet select the wrong work. It can also select
the right work without having authority to change anything. These are different
failures.

Read-only orientation and mutation use different
ceremony. An active ordered plan changes what a bare “proceed” means. A ranked
queue suggests candidate work only when the plan gate permits it. The training exercise separates those judgments so a learner never
needs access to a confidential backlog.

## Terminology

**Read-only posture** means inspecting or explaining state without changing
product or governed project files.

**Mutation posture** means preparing to change product or governed project
files. It requires current session ceremony and the applicable start gates.

**Cold session start** is the full mutation-session route used when ritual state
is missing, invalid, bound to another worktree, or otherwise not reusable.

**Session recovery** restores mutation readiness in the same worktree after
staleness or interruption. The one-shot recovery surface is
`deft session:ready`; a permitted direct re-arm is `deft session:start
--rearm`.

**Ordered plan** is an operator-set short sequence whose current entry controls
a bare “what next?” or “proceed.” Its canonical state file is
`.deft/plan-sequence.json`.

**Ranked queue** is a cache-backed ordering of candidate backlog work exposed by
`deft triage:queue`. The unified issue-content cache lives under
`.deft-cache/`.

**Audit log** is the append-only triage decision record exposed by
`deft triage:audit`. Its 0.119.2 canonical path is
`xbrief/.triage-cache/candidates.jsonl`.

## Mental model

Use four questions in order:

1. **Posture:** Is the request read-only or does it ask for mutation?
2. **Selection:** Does an active ordered plan bind the request, has that plan
   ended, or did the operator explicitly ask for queue selection?
3. **Authority:** Is the selected target covered by an active scope plus live
   implementation intent?
4. **Readiness:** Have the current session, story, scope, branch, and other
   applicable gates passed?

~~~text
request + fixed state
        |
        v
posture -> selection path -> target or stop
                                |
                                v
              active scope + live implementation intent
                                |
                                v
                      applicable gates -> mutate
~~~

Selection is not authority. Authority is not readiness. A deterministic gate
does not widen either one.

## Guided explanation

### 1. Choose the session posture

| Request signal | Posture | Session route |
| --- | --- | --- |
| Orientation only | Read-only | Load the required authority sources; do not run mutation ceremony |
| Implement, build, or change governed files | Mutation | Cold `session:start` when state is missing or invalid, then gated ritual |
| Resume mutation in the same worktree after a compact or stale ritual | Mutation | `session:ready` or an allowed `session:start --rearm`, then re-check gates |
| Write only disposable, allowlisted scratch notes | Assist, when project rules permit | Keep the write inside the approved scratch boundary |

Read-only work does not need the mutation ritual.
Mutation does. Recovery is valid only when its same-worktree and continuity
conditions hold; otherwise use the cold route.

### 2. Apply work-selection precedence

Use this order:

1. If `.deft/plan-sequence.json` is active, resolve
   `deft plan-sequence:current`. A bare “proceed” means only that entry.
   **Do not inspect or select the ranked queue.**
2. If the ordered plan is exhausted, stop until an operator target or explicit
   queue selection is supplied.
3. If no ordered plan is active and the operator asks for backlog selection,
   `deft triage:queue` may rank cache-backed candidates.
4. Treat the selected queue item as a candidate. Acceptance, lifecycle state,
   and implementation authority still have to be established.

An explicit “what’s the queue?” can switch selection modes. A nearby high-ranked
item, a remembered issue, or a `continuationOrder` field cannot silently do so.

### 3. Map each state surface to one job

| Surface | Canonical state or view | Role | Does it authorize mutation? |
| --- | --- | --- | --- |
| Ordered plan | `.deft/plan-sequence.json` / `deft plan-sequence:current` | Binds bare continuation language to the current sequence entry | No |
| Ranked cache | `.deft-cache/` / `deft triage:queue` | Supplies a ranked candidate view after the plan gate permits queue use | No |
| Pending scope | `xbrief/pending/` | Records approved work that is not current | No |
| Audit log | `xbrief/.triage-cache/candidates.jsonl` / `deft triage:audit` | Preserves triage decisions and their order | No |
| Active scope | `xbrief/active/` with `plan.status: running` | Supplies the durable current implementation contract | Not alone |
| Completed scope | `xbrief/completed/` | Preserves historical lifecycle closeout | No |
| Live implementation intent | The operator's current build or implement instruction | Supplies present human intent for the bounded active target | Only together with active scope |

The authority conjunction is **active scope + live implementation intent**.
Current readiness additionally requires the applicable gates.

### 4. Preserve a compact decision record

For each request, record:

- the request card and snapshot identifier;
- posture and session route;
- selection surface and selected target, or “none”;
- authority result and missing condition;
- next safe action; and
- one sentence citing the controlling fact.

This record is enough to review the reasoning. Do not copy cache entries or
issue bodies into it.

## Walkthrough

The following is fixed fictional state, not a representation of this training
repository.

### Snapshot 1 — active ordered plan

| Surface | Fictional value |
| --- | --- |
| Ordered plan | Active: `TRAIN-208` current, then `TRAIN-209`, then stop |
| Ranked queue | `TRAIN-311` rank 1; `TRAIN-208` rank 4 |
| Scope state | `TRAIN-208` active/running; `TRAIN-209` pending; `TRAIN-311` proposed |
| Session state | Same worktree; gated ritual marked stale after a context compact |
| Audit log | Prior acceptance of `TRAIN-208`; no action for `TRAIN-311` |

Request card: **“Proceed with the plan and implement the current item.”**

Reasoning:

1. “Implement” makes this mutation posture.
2. The active plan selects `TRAIN-208`, even though another item ranks first.
3. The active `TRAIN-208` scope plus the live implementation instruction
   supplies bounded authority.
4. The stale same-worktree ritual requires session recovery, followed by the
   applicable story and xBRIEF gates.

### Snapshot 2 — exhausted ordered plan

| Surface | Fictional value |
| --- | --- |
| Ordered plan | Active record, all entries completed, current entry absent |
| Ranked queue | `TRAIN-412` rank 1 |
| Scope state | `TRAIN-400` completed; `TRAIN-412` proposed |
| Session state | No mutation session requested |
| Audit log | `TRAIN-412` has no accept decision |

Request card: **“Proceed.”**

The plan is exhausted, so stop until an operator target or explicit queue
selection exists. Do not infer `TRAIN-412` from rank 1, and do not treat the
completed `TRAIN-400` scope as reusable authority.

## Exercise

Use only Snapshots 1 and 2. Complete the matrix before opening the solution.

### Request cards

- **Case A — Snapshot 1:** “Explain which item ‘proceed’ would select. Do not
  change anything.”
- **Case B — Snapshot 1:** “Proceed with the plan and implement the current
  item.”
- **Case C — Snapshot 2:** “Proceed.”
- **Case D — Snapshot 2:** “What’s the queue? Recommend the first candidate,
  but do not implement it.”

### Decision matrix

| Case | Posture | Session route | Selection path | Target or stop | Authority result | Next safe action | Controlling fact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A |  |  |  |  |  |  |  |
| B |  |  |  |  |  |  |  |
| C |  |  |  |  |  |  |  |
| D |  |  |  |  |  |  |  |

Then label each statement **true** or **false**:

1. A ranked cache entry is an instruction to implement.
2. An active scope alone authorizes mutation.
3. A pending scope may be selected as current because it ranks above an active
   ordered-plan entry.
4. An audit record explains a past triage decision but does not create present
   intent.
5. A completed scope is standing authority for follow-on changes.

## Completion evidence

Retain one private, sanitized worksheet containing:

- **O8.1:** all four posture and session-route decisions;
- **O8.2:** the selected target or stop for every case, including the
  ordered-plan and exhausted-plan reasons;
- **O8.3:** all seven state-surface roles and five true/false answers; and
- **O8.4:** a next-safe-action and controlling-fact sentence for each case,
  without live backlog content.

Completion means the matrix is internally consistent and can be compared with
the solution. Reading the solution alone is not evidence.

## Progressive hints

1. First underline the verbs in each request. “Explain” and “recommend” are not
   implementation verbs.
2. Ignore the queue whenever Snapshot 1's active plan controls a bare
   continuation request.
3. For Snapshot 2, “rank 1” is irrelevant until the operator explicitly asks
   for the queue.
4. Separate “which target?” from “may I mutate it?”
5. If mutation is authorized but ritual state is stale in the same worktree,
   choose recovery before implementation.

## Expected failures and recovery

| Failure | Why it happens | Recovery |
| --- | --- | --- |
| Case A starts a mutation session | Orientation was confused with implementation | Reclassify from the request's explicit “do not change” boundary |
| Case B selects `TRAIN-311` | Rank was allowed to override the active plan | Return to the ordered-plan current entry |
| Case C selects `TRAIN-412` | Exhaustion was treated as automatic queue fallback | Stop and name the missing operator target or explicit queue request |
| Case D claims implementation authority | Recommendation was confused with authorization | Keep the result read-only and list the missing active scope and live intent |
| A completed scope is reused | Record authority was confused with present authority | Treat it as historical evidence and require a new current contract |

If the supplied facts seem contradictory, cite the exact conflict and stop.
Do not resolve a fictional inconsistency by consulting live state.

## Common misconceptions

- “Proceed” always means the top queue item. It does not when an ordered plan is
  active, and exhaustion fails closed.
- A queue item is approved work. It is only a ranked candidate until the
  governed intake and lifecycle steps say otherwise.
- Session readiness grants scope authority. It only proves session conditions.
- Active scope alone is enough. Present live implementation intent is also
  required.
- Completed means reusable. Completed scopes are records of what closed.

## Self-assessment

Answer without looking at the solution:

1. **O8.1:** Why does Case A avoid mutation ceremony while Case B needs session
   recovery?
2. **O8.2:** What blocks `TRAIN-311` in Case B, and what blocks
   `TRAIN-412` in Case C?
3. **O8.3:** Which two inputs form implementation authority, and what distinct
   evidence do the ranked cache and audit log supply?
4. **O8.4:** What is the smallest safe record that lets another reviewer audit
   your decision without access to live state?

You are ready to continue when each answer cites a supplied request or snapshot
fact rather than intuition.

## Explained solution

After a genuine attempt, compare your matrix with the
[explained Module 8 solution](../../solutions/module-08-session-and-work-selection.md).
If any cell differs, use the retry plan there and repeat only the affected case.

## Navigation

- Previous: [Module 7 — Scope lifecycle and implementation authorization](07-scope-lifecycle.md)
- Course map: [Directive training course map](../README.md)
- Next: [Module 9 — Design-critique arcs and verified synthesis](09-design-critique-arcs.md)

## Official sources

- [Maintained Directive source baseline](../../references/SOURCE-BASELINE.md#module-8-session-and-work-selection-validation)
- [Module 8 source validation notes](../../references/SOURCE-NOTES.md#module-8-source-validation)
- [Quick reference](../../references/QUICK-REFERENCE.md)
