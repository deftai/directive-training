# Module 4 — xBRIEF as Durable State

Identify which artifact holds project identity, requirements, current work, tactical steps,
or a recovery point, and explain what that artifact can authorize.

## Module record

| Field | Value |
| --- | --- |
| Stable ID | `module-04-xbrief-as-durable-state` |
| Status | `learner-ready draft` |
| Last content update | 2026-09-07 |
| Last verified | 2026-09-07 |
| Directive baseline | `@deftai/directive@0.119.5`, engine `@deftai/directive-core@0.119.5`; see the [source baseline](../../references/SOURCE-BASELINE.md) |
| Estimated duration | 45–55 minutes |
| Prerequisites | Complete [Module 3](03-authority-and-context.md); distinguish product requirements, live authorization, and gate evidence |

Suggested pacing: 5 minutes for the starting check, 15 for the lesson and walkthrough,
20 for the exercise, and 10 for solution comparison. This is a command-free exercise on
macOS, Linux, or Windows; no CLI, shell, repository, or service setup is needed.

## Learning outcomes

By the end of this module, you can:

- **O4.1 — Classify artifacts.** Identify the roles of `PROJECT-DEFINITION`, specification,
  scope, plan, and continue xBRIEFs using their path and contents.
- **O4.2 — Read lifecycle state.** Match scope folders to `plan.status`, identify a mismatch,
  and explain why a folder name alone cannot prove readiness.
- **O4.3 — Preserve the current contract.** Distinguish durable scope from session plans,
  checkpoints, historical chat, and completed records; require active scope plus live
  implementation intent before product implementation.
- **O4.4 — Locate the authored source.** Separate authored project narratives and scope
  data from generated registry entries and Markdown views.

## Starting-state check

In a personal scratch note, answer these three questions:

1. An active scope exists, but the live request says “explain this only.” May an agent
   implement it?
2. A completed scope describes a useful feature. Does it authorize building that feature again?
3. A required preflight failed. Does “please implement” turn that failure into a pass?

**Pass:** Your three answers are “no,” with these reasons: live implementation intent is
absent; completed work has no authority over the next build; required gate evidence still
controls mutation readiness.

**Recovery:** Revisit [Module 3's authorization model](03-authority-and-context.md#authorization-is-a-conjunction),
then retry in a fresh note. This module uses the stated 0.119.5 course baseline, not the
version installed on your computer. If your reference copy uses another release, reopen
the pinned sources at the end of this page before comparing claims.

Use only the fictional evidence below. Do not inspect or copy a real
project's private scope, chat, or shared `USER.md`. Keep every repository unchanged.

## Why this matters

A chat can contain an idea, a rejected alternative, and a confident completion claim in
the same conversation. A new session needs a smaller, inspectable answer to “what is the
project?” and “what work is active?”

xBRIEF stores structured project and work state outside the
conversation. Scope records preserve accepted work across sessions. A tactical plan and
an interruption checkpoint help resume that work, but serve shorter purposes. Generated
views help people read the sources; they do not replace the sources.

Ask two separate questions about any artifact: “What does this
record describe?” and “What authority does it have now?” A durable record can answer the
first question well while granting no new action.

## Terminology

| Term | Meaning in this module |
| --- | --- |
| xBRIEF | Structured JSON used for Directive project and work state; current new writes use schema 0.8. |
| Durable scope | A work record that persists across sessions, with requirements, acceptance, and lifecycle state. |
| Tactical plan | The session's steps and progress: how to carry out already-scoped work now. |
| Continue checkpoint | A temporary recovery record naming completed work, remaining work, decisions, hazards, and a resume point. |
| Lifecycle | The relationship between a scope's state and its folder under `xbrief/`. |
| Projection | A generated representation of another source, such as a roadmap or registry entry. |
| Current contract | The active xBRIEF together with the human operator's live instruction; both constrain the present work. |

## Mental model

Read the project definition for identity, the specification for
design, the scope for accepted work, the plan for current steps, and the checkpoint for
resuming those steps. Follow a generated view back to its source before proposing a change.

| Situation | Prediction | Evidence to inspect |
| --- | --- | --- |
| A new session must resume an accepted feature. | Scope supplies the work contract; plan and checkpoint supply the current position. | Scope path, `plan.status`, acceptance, and checkpoint scope reference |
| A chat summary proposes another feature after the first one completed. | The summary does not create an active contract for the new feature. | Completed record, current active scope, and live instruction |
| A project registry entry disagrees with its scope. | The registry can be stale; inspect the scope before refreshing the view. | Registry source pointer and referenced scope state |

The limit: a plausible record is not proof that product behavior works. Tests, observed
results, and required gate evidence still matter. This module teaches classification;
later lifecycle modules teach governed transitions and their gates.

## Guided explanation

### 1. Read the five artifact roles

These are project-relative paths. The operational filenames are
singular; dated scope files live in lifecycle folders.

| Artifact | Question it answers | Authority and lifetime |
| --- | --- | --- |
| `xbrief/PROJECT-DEFINITION.xbrief.json` | What is this project, and which project choices apply? | Durable identity, policy, and architecture; authored narratives coexist with a generated scope registry. |
| `xbrief/specification.xbrief.json`, when present | What is the project design and requirement set? | Durable specification source; its Markdown export is a view. |
| `xbrief/active/YYYY-MM-DD-descriptive-slug.xbrief.json`, or another lifecycle folder | What bounded work is proposed, accepted, in progress, or terminal? | Durable scope and acceptance; only an active contract paired with live intent supports present implementation. |
| `xbrief/plan.xbrief.json`, when present | How will this session perform the scoped work? | Session-level tactical steps and progress; it does not broaden the scope. |
| `xbrief/continue.xbrief.json`, when present | Where did the interrupted session stop? | Temporary resume checkpoint, consumed after successful resume; it does not replace durable scope. |

The file named `plan.xbrief.json` is not the same thing as the JSON object named `plan`.
Each xBRIEF role uses a `plan` object. Read the filename, purpose, and fields together
before classifying it.

Plans and checkpoints reference the scope they concern through
`planRef` when scopes exist. A reference connects records; it does not duplicate the
scope's acceptance or confer new permission. Not every project has a separate
specification, tactical plan, or checkpoint at every moment. Do not create missing
artifacts merely to make a directory match a diagram.

Evidence: the pinned [Concepts artifact inventory][concepts], [xBRIEF persistence rule][main],
and [artifact taxonomy][taxonomy]. The taxonomy retains legacy names in some examples;
use the current `xbrief/`, `.xbrief.json`, and 0.8 spelling stated by the release's main
guidance. Legacy schema examples are not templates for new work.

### 2. Separate scope state from item state

The scope's top-level `plan.status` describes its lifecycle.
The folder must agree with that status. The following published folder/status conventions
cover this module's exercise:

| Scope folder | Scope `plan.status` values used here | Meaning |
| --- | --- | --- |
| `xbrief/proposed/` | `draft`, `proposed` | Candidate work that has not entered the accepted backlog |
| `xbrief/pending/` | `approved`, `pending` | Accepted work awaiting activation |
| `xbrief/active/` | `running`, `blocked` | Work in progress; a blocker does not move it into a separate folder |
| `xbrief/completed/` | `completed` | Terminal closeout record with evidence and disposition; no authority over the next build |
| `xbrief/cancelled/` | `cancelled` | Abandoned or rejected scope retained as a record |

The first two rows contain pairs, not additional folders. The pinned taxonomy permits
`draft` in `proposed/` and `approved` in `pending/`; current training scopes use
`proposed` before promotion, while promotion writes `pending` and activation writes
`running`. Do not diagnose a `proposed/` scope as broken merely because an older example
uses `draft`. The 0.8 schema includes both words.

An item's `status` tracks that item. For example, a running scope can still contain a
pending task. An item's completed status does not prove that the whole scope completed.
Likewise, `PROJECT-DEFINITION`'s own `plan.status: running` describes the project; it
does not make every registered scope active.

Use governed lifecycle operations to keep state, paths, and
references consistent. Do not move files by hand. Implementation preflight requires
both `active/` and `plan.status: running`; `active/` with `pending` is a mismatch, and
`active/` with `blocked` is not ready for implementation. These classifications do not
authorize a recovery mutation by themselves.

Evidence: [taxonomy — lifecycle folders][taxonomy], the [0.8 schema][schema], and
[Commands — Scope xBRIEF Lifecycle][commands]. Terminal `failed` is also a schema value,
but pinned prose disagrees about its destination. Failure-transition mechanics are outside
this module; do not infer them from this teaching table or an overview diagram.

### 3. Persist the work without turning memory into authority

A scope remains useful when the original chat is unavailable.
Its requirements and acceptance can be inspected by a later session. A checkpoint
preserves a resume point; a tactical plan preserves current steps. Neither can authorize
an unrelated addition or override the active scope and live instruction.

For example, a checkpoint may record “next: inspect the empty-input test.” That tells a
new session where to resume after checking current state. It does not prove the test still
exists or permit implementing when the live request is read-only.

A completed scope records lifecycle closeout with its evidence
and disposition. Closeout can record delivery or an explicit non-delivery outcome; the
folder or status alone does not prove the work shipped. It has zero authority over what
to build next. Historical chat and conversation summaries also cannot supply
missing current work state. This does not make the human's live instruction irrelevant:
the current contract explicitly includes it. If that instruction conflicts with the active
scope, preserve both facts and resolve the conflict before implementing.

Evidence: [main — xBRIEF Persistence][main], [Lifecycle — Delivery integrity vs deploy /
UAT][lifecycle], and [Continue-Here — checkpoint contents and lifecycle][continue].

### 4. Classify ownership at the field level

A `.json` extension does not mean every field is an authored
source. `PROJECT-DEFINITION` mixes durable authored project narratives with an `items`
registry refreshed from lifecycle scopes. A scope's title or lifecycle state comes from
its scope record, not a manually altered registry copy.

| Field or file | Read it for | Where a durable correction belongs |
| --- | --- | --- |
| `PROJECT-DEFINITION` project narratives | Project identity and choices | The approved project-definition authoring workflow |
| `PROJECT-DEFINITION` scope registry in `plan.items` | A generated index of scopes | Referenced scope source, followed by registry regeneration |
| Scope title, acceptance, and lifecycle state | Work contract and current state | The approved scope workflow; lifecycle state uses governed transitions |
| Generated `ROADMAP.md` | A readable outlook on lifecycle work | Scope sources, followed by regeneration |
| Generated `SPECIFICATION.md` | A readable specification export | Its declared xBRIEF source, followed by regeneration |
| Authored course Markdown | The learner explanation | This repository's approved curriculum authoring workflow |

The last row is authored course content; the other rows describe project state or generated
projections.
The generated banner or declared source determines ownership. Do not infer it from the
extension or whether Git tracks the file. Module 5 applies this boundary to a generated
codebase map.

Evidence: [Commands — Generated Document Commands][commands], [taxonomy — project
definition regeneration][taxonomy], and the [curriculum maintenance contract](../../maintainers/CURRICULUM-MAINTENANCE.md#source-ownership).

## Walkthrough

### Goal

Decide what a new session can learn from the fictional Northstar Route Checker's files.

### Safe setup

Read only these fictional facts and use a scratch note. No working directory or repository
is required; the named paths are examples, not instructions to open local files.

### Actions and observations

Northstar has a project definition describing a local route-checking CLI. Its scope is
`xbrief/active/2026-09-07-normalize-stop-code.xbrief.json`, with `plan.status: running`
and acceptance requiring rejection of whitespace-only stop codes. Its checkpoint says
the rejection test was written but has not run. The live request is “Review the saved
state and report what remains; do not implement.”

1. **Action:** Classify the project definition and active scope.
   **Observe:** One describes the project; the other names a bounded behavior and its
   acceptance. **Meaning:** Project identity and current work are separate records.
2. **Action:** Compare the checkpoint with the scope.
   **Observe:** The checkpoint gives a resume point and an unverified test claim.
   **Meaning:** Resume context helps locate work; it does not prove acceptance.
3. **Action:** Read the live instruction before proposing a mutation.
   **Observe:** It asks for a report and prohibits implementation.
   **Meaning:** Report the unverified test state. An active scope does not defeat the
   read-only request.
4. **Checkpoint:** Your note names all three artifact roles and says “report only;
   acceptance is not yet proven.” No file changed.

## Exercise

### Fictional scenario

Northstar's next session receives these artifact cards. They are complete facts for a
classification exercise, not complete JSON files to install or execute. Every xBRIEF
card uses `xBRIEFInfo.version: "0.8"`.

| Card | Provided artifact and contents |
| --- | --- |
| A | `xbrief/PROJECT-DEFINITION.xbrief.json`: `plan.narratives.Overview` says Northstar is a local, fictional route-checking CLI; project `plan.status` is `running`. |
| B | `xbrief/specification.xbrief.json`: accepted design says the CLI accepts a stop code and reports valid or invalid; `plan.status` is `approved`. |
| C | `xbrief/active/2026-09-07-normalize-stop-code.xbrief.json`: scope `plan.status` is `running`; acceptance rejects whitespace-only input; one item is `pending`. |
| D | `xbrief/plan.xbrief.json`: `planRef` points to C; steps are write a rejection test, run it, implement normalization, then rerun the tests. |
| E | `xbrief/continue.xbrief.json`: `planRef` points to C; completed work says the test was written, remaining work says run it, and the resume point names that test. |
| F | `xbrief/completed/2026-09-01-add-route-count.xbrief.json`: scope `plan.status` is `completed`; it records a delivered route-count feature. |
| G | `xbrief/proposed/2026-09-07-export-routes.xbrief.json`: scope `plan.status` is `draft`; the export idea is not accepted. |
| H | `xbrief/pending/2026-09-07-reject-duplicate-stops.xbrief.json`: scope `plan.status` is `pending`; accepted work has not been activated. |
| I | `xbrief/active/2026-09-07-load-fixtures.xbrief.json`: scope `plan.status` is `blocked`; a narrative explains that required fictional fixture data is missing. |
| J | `xbrief/cancelled/2026-09-02-email-route-report.xbrief.json`: scope `plan.status` is `cancelled`; the email idea was abandoned. |
| K | `xbrief/active/2026-09-07-sort-route-codes.xbrief.json`: scope `plan.status` is `pending`; required implementation preflight reports a folder/status mismatch. |
| L | A `PROJECT-DEFINITION` registry entry in `plan.items` points to C but says its status is `completed`; C still says `running`. |
| M | `ROADMAP.md` has a generated banner and names lifecycle scope xBRIEFs as its source; its row for C also says `completed`. |
| N | An old chat summary says “route-count is next; normalization is done.” It provides no current test evidence or lifecycle update. |

This is an inspection inventory, not an instruction to activate multiple scopes or repair
the deliberately inconsistent examples.

### Your task

1. Make a 14-row table with these columns:

   ```text
   Card | Artifact role | Lifetime/ownership | Evidence field or source | What it can establish | What it cannot authorize
   ```

2. For C and F–K, add a lifecycle verdict: consistent, consistent but blocked, or
   inconsistent. Explain why the pending item inside C is not a scope mismatch.
3. Resolve L and M. Name the durable source to inspect and whether to edit the registry
   or roadmap directly. Describe the recovery conceptually; run no command.
4. Write a three-sentence resumption note using C, D, E, F, and N. Distinguish accepted
   work, resume context, missing evidence, and historical claims.
5. Evaluate these two live instructions separately:

   - **Instruction 1:** “Inspect these artifacts and explain the current state. Do not implement.”
   - **Instruction 2:** “Implement the normalization scope C.” Required session, story, and
     preflight gates for C have passed. No conflicting requirement is present.

   State whether implementation is allowed and its exact scope boundary in each case.

### Constraints

- Work only with these fictional cards and a personal scratch note.
- Keep the training repository and every business repository unchanged.
- Do not initialize a project, move a lifecycle file, edit a registry, run a gate, or contact
  an instructor or review bot for this exercise.
- Keep file role, scope status, item status, live intent, and evidence separate.
- Do not infer a passed test from a checkpoint, old chat, or generated view.

### Evidence to keep

Keep the classification table, seven lifecycle verdicts for C and F–K, L/M source-and-repair
decisions, the three-sentence resumption note, and the two authorization decisions. Keep
your first attempt so that a corrected explanation has comparison evidence.

### Exercise acceptance

| Outcome | Observable condition | Inspection |
| --- | --- | --- |
| O4.1 | A–E identify project definition, specification, scope, tactical plan, and checkpoint respectively. | Table names each role and cites its path plus a relevant field. |
| O4.2 | C and F–J are consistent; I is blocked; K is inconsistent. C's pending item does not change its running scope. | Seven lifecycle verdicts use scope `plan.status`, not an item or folder alone. |
| O4.3 | The note preserves C as current work, treats D/E as resume context, and rejects F/N as future authority. Instruction 1 allows no implementation; Instruction 2 permits only C after the stated gates. | Note and decisions name scope, live intent, and missing test evidence separately. |
| O4.4 | L/M follow their pointers back to C; no direct generated edit is proposed. A's authored narrative remains distinct from L's registry. | Decisions name source inspection, governed source correction if needed, and regeneration. |

## Completion evidence

| Outcome | Evidence to show | Passing condition |
| --- | --- | --- |
| O4.1 | Fourteen-row artifact table | Every card has a role, lifetime/ownership, source, limit, and evidence. |
| O4.2 | Seven lifecycle verdicts | No false mismatch for G's `draft` or C's pending item; K is rejected. |
| O4.3 | Resumption note and two authorization decisions | Durable state, temporary context, live authority, and proof remain distinct. |
| O4.4 | L/M repair decisions and A/L ownership comparison | Scope C controls registry/roadmap status; authored narratives are not replaced by rendering. |

Reading the solution is not completion. Your retained answers must satisfy these inspections.

## Progressive hints

Try the exercise for 12–15 minutes before opening a hint. The solution remains available
whenever you need it.

<details>
<summary>Hint 1 — classify the question each record answers</summary>

Ask whether the card describes identity, design, bounded work, current steps, a resume
point, a generated copy, or a historical statement. A `plan` object occurs in several roles.

</details>

<details>
<summary>Hint 2 — compare the same level of state</summary>

Use the scope's own `plan.status` for the lifecycle verdict. Separate C's scope status from
its item status. Follow L's pointer before believing its copied status.

</details>

<details>
<summary>Hint 3 — separate three kinds of evidence</summary>

C defines accepted normalization; E says where to resume; neither proves the test passed.
Now read each live instruction literally. For L/M, identify source, generation, and the
new inspection that would demonstrate agreement.

</details>

## Expected failures and recovery

| Symptom | Likely cause | Confirm with | Recovery | Retry evidence |
| --- | --- | --- | --- | --- |
| Every card with `plan` is called the tactical plan. | JSON container name was confused with file role. | Compare A, C, and D paths and purpose. | Classify by the question each record answers. | A–E have five distinct roles. |
| G is called invalid, or C is called pending. | A status synonym or nested item was mistaken for scope state. | Read the lifecycle table and C's exact field levels. | Record folder and top-level scope status separately. | G and C are consistent; K is not. |
| The note says normalization passed. | A checkpoint or old summary was promoted into test proof. | E says run the test; N has no result. | Record “test completion not proven.” | Note keeps the missing evidence explicit. |
| Instruction 1 starts implementation. | Active scope was treated as permission by itself. | Quote the live read-only request. | Separate current scope from current action. | Instruction 1 is report-only. |
| L or M is edited directly. | A generated copy was mistaken for source. | Follow L's pointer and M's banner. | Inspect C, describe source correction only if needed, then regeneration. | Both projections follow C's running state. |

Preserve your first answer, retry the failed row in a new note, then recheck the whole
acceptance table. No repository reset or environment cleanup is required.

## Common misconceptions

| Misconception | Correct model | How to disprove it |
| --- | --- | --- |
| Every xBRIEF is permanent project authority. | Scope is durable; plans are session-level and checkpoints are temporary recovery aids. | Compare C, D, and E purposes. |
| A completed record selects the next build or proves shipment by itself. | Completed scope records closeout and its evidence/disposition; current work needs an active contract plus live intent. | F explicitly states delivery; its status alone would not prove it. |
| Chat can never matter. | Historical chat is not maintained work state; the human's live instruction is part of the current contract. | Compare N with Instruction 1. |
| All JSON is source and all Markdown is generated. | Ownership depends on the field and source declaration. | Compare A/L and generated M with this authored lesson. |
| A file in `active/` is ready to implement. | It may be blocked or inconsistent; readiness also depends on live intent and gates. | Compare C, I, and K. |

## Self-assessment

Answer without reopening the lesson, then compare with the explained solution.

1. Why do a specification, scope, and tactical plan remain different artifacts even when
   all contain a `plan` object?
2. Which scope folders hold `draft`, `blocked`, and `cancelled`? Why is C's pending item
   different from K's pending `plan.status`?
3. What can E establish after an interruption, and what must a new session still verify?
4. Why can Instruction 1 prohibit implementation while C remains active? Why does N not
   become authoritative simply because it is written by an earlier agent?
5. Which part of `PROJECT-DEFINITION` is authored project identity, which part is a
   generated scope registry, and where would you correct L's stale status?

- **Ready to continue:** all five explanations cite correct evidence and every exercise
  acceptance row passes.
- **Revisit one section:** decisions are right but the artifact role or reasoning is missing.
- **Retry the exercise:** any answer invents authority, proof, or a direct generated edit.

## Explained solution

After a suggested first attempt, use the [explained solution](../../solutions/module-04-xbrief-as-durable-state.md).
It includes every card, lifecycle verdict, self-assessment answer, and a retry route.
The [self-assessment key](../../solutions/module-04-xbrief-as-durable-state.md#self-assessment-key)
answers the five items above. It explains answers; the Completion evidence table remains
the instrument that scores this module.
No instructor approval or automation unlock is required.

## Navigation

- Previous: [Module 3 — Authority and Context](03-authority-and-context.md)
- Course map: [Core curriculum](../README.md)
- Next: [Module 5 — Sources versus Projections](05-sources-versus-projections.md)
- Resume point: retry the first outcome without passing evidence; retain the outcomes
  already demonstrated unless the course baseline changes.

## Official sources

| Statement supported | Pinned source and heading | Verified date | Notes |
| --- | --- | --- | --- |
| Five artifact roles and generated views | [Concepts — xBRIEF Is The Durable State][concepts] | 2026-09-07 | Current public xBRIEF paths |
| Current 0.8 writes; active scope plus live instruction; completed boundary | [main — xBRIEF Persistence and Schema version: v0.8][main] | 2026-09-07 | Explicit current authoring rule controls legacy examples |
| Completion and delivery evidence are distinct | [Lifecycle — Delivery integrity vs deploy / UAT][lifecycle] | 2026-09-07 | Explicit non-delivery dispositions can close a lifecycle |
| Artifact lifetimes, `planRef`, lifecycle vocabulary, project narrative/registry ownership | [Artifact taxonomy — File Taxonomy, Coexistence, and PROJECT-DEFINITION][taxonomy] | 2026-09-07 | Legacy names/schema examples normalized against current main rule; failure-transition destination is not taught |
| Draft/proposed and approved/pending are schema values | [xBRIEF 0.8 core schema][schema] | 2026-09-07 | Scope status and item status are different field levels |
| Lifecycle consistency and generated registry refresh | [Commands — Scope xBRIEF Lifecycle and Generated Document Commands][commands] | 2026-09-07 | Contextual source evidence, not learner commands in this module |
| Checkpoint contents and temporary lifetime | [Continue-Here — Continue Checkpoint Contents and Lifecycle][continue] | 2026-09-07 | Resume aids do not replace current state verification |
| Fictional-only, command-free work and available solutions | [Project definition](../../xbrief/PROJECT-DEFINITION.xbrief.json) ProjectRules and LabModel | 2026-09-07 | Local course rules |

This lesson is an original paraphrase and fictional teaching adaptation. See the
[source baseline](../../references/SOURCE-BASELINE.md) and [glossary](../../references/GLOSSARY.md).

## Author release check

- Four outcomes have explicit exercise and solution evidence.
- The walkthrough, card decisions, recovery, and self-assessment are inspectable from the
  stated fictional starting state; no shell behavior or live environment is claimed.
- Source claims use the immutable 0.119.5 release and disclose the legacy taxonomy wording.
- Navigation and source links are part of the curriculum's content verification.
- An independent learner pilot remains a separate course milestone.

[concepts]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/docs/CONCEPTS.md#xbrief-is-the-durable-state
[main]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/main.md#xbrief-persistence
[taxonomy]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/vbrief/vbrief.md
[schema]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/vbrief/schemas/xbrief-core-0.8.schema.json
[commands]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/commands.md
[continue]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/resilience/continue-here.md
[lifecycle]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/docs/directive-lifecycle.md
