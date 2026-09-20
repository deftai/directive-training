# Module 6 — Creating Well-Shaped Work

Turn a horizontal activity list into a small end-to-end outcome, trace it into reviewable
proposed scope, split an epic into ordered slices with observable evidence, and make the
required route / no route / insufficient-evidence decision before lifecycle authorization.

## Module record

| Field | Value |
| --- | --- |
| Stable ID | `module-06-creating-well-shaped-work` |
| Status | `learner-ready draft; command-free` |
| Last content update | 2026-09-17 |
| Last verified | 2026-09-17 |
| Directive baseline | `@deftai/directive@0.119.5`, engine `@deftai/directive-core@0.119.5`; see the [source baseline](../../references/SOURCE-BASELINE.md) |
| O6.2 structural check | Lab 7 Task 5, an adjacent practical step in a disposable guarded repository; this module stays command-free |
| Estimated duration | 50–60 minutes |
| Prerequisites | Complete [Module 5's](05-sources-versus-projections.md) conceptual outcomes; its practical outcome may remain environment-blocked as documented in the [course map](../README.md) |

Suggested pacing: 5 minutes for the starting check, 15 for the explanation and
walkthrough, 20 for the exercise, and 10–20 for evidence and solution comparison. This
exercise is command-free on macOS, Linux, or Windows. Use only a personal scratch note;
no CLI, repository, service, or account is required. The structural check for O6.2 runs
later, in [Lab 7](../../labs/07-scope-lifecycle.md) Task 5, against the exact artifact you
write here.

## Learning outcomes

By the end of this module, you can:

- **O6.1 — Shape a vertical slice.** Turn a fictional horizontal component plan into one
  end-to-end slice and record its artifact, user-visible outcome, exclusions, and literal
  inspection.
- **O6.2 — Trace idea to proposed scope.** Record a bounded strategy choice, a
  testable/observable specification statement, and a schema-0.8 proposed-scope artifact
  while preserving the boundary that a proposal is not implementation authority.
- **O6.3 — Decompose an epic.** Recognize work that is too broad for one story, create an
  ordered set of independently verifiable slices, and give dependency and boundary
  rationale for every slice.
- **O6.4 — Route a proposed mechanism safely.** For three fixed fictional fact patterns,
  identify the controlling fact, choose `route`, `no route`, or `insufficient evidence`,
  and name the safe next action; when routing, identify the proposed mechanism revision
  that becomes the critique target.

## Structural evidence for O6.2

The outcome wording above is unchanged. What changed is the evidence that completes O6.2 and
the vehicle that produces it.

O6.2 already requires a schema-0.8 proposed-scope artifact. The course used to complete it by
static inspection of a scratch note, so nothing ever checked whether the file you wrote parses
and carries the required lifecycle-record fields.

### Named vehicle recut

The worksheet below stays command-free. The structural check is an **adjacent practical lab
step**: [Lab 7](../../labs/07-scope-lifecycle.md) Task 5 consumes the exact artifact you write
in Part B, inside the disposable guarded temporary repository Lab 7 already creates. No command
enters this worksheet, and Lab 7 keeps both of its supplied scope records; your artifact is a
third record beside them.

The rejected alternative was to revise this module's command-free contract and build it a
guarded environment of its own. Lab 7 already has one, so the adjacent step is the cheaper
vehicle and the module's safety boundary is untouched.

### The command and its evidence

Lab 7 runs this against its pinned local install:

`directive xbrief:verify -- --format json --out <your artifact path> --style scope --project-root <lab root>`

Retain four things: the artifact **path**, the exact **command**, its **exit code**, and its
**result**. Exit `0` against that exact path is the positive structural result. Exit `1` names
the first structural defect in your file.

`xbrief:preflight` and `doctor` are not the authoring-validity pass. Preflight answers whether
a lifecycle record is ready to be worked; doctor probes the install and environment. Neither
reads your artifact as a question about authoring validity.

### What each evidence surface proves

| Surface | Proves | Does not prove |
| --- | --- | --- |
| `xbrief:verify` | The file parses, carries `xBRIEFInfo`, and carries `plan.title`, `plan.status`, and correctly typed `plan.items[].narrative` fields | That the version is `0.8`, that the status is `proposed`, that acceptance is observable, that traces exist, or that authority is bounded |
| Module 6 comparison rubric | Bounded strategy, observable acceptance, traces, schema `0.8`, `plan.status: proposed`, and the absence of implementation authority | That the file parses or conforms to the lifecycle-record structure |

The two surfaces are separate and neither substitutes for the other. A green structural result
grants no promotion, no activation, and no implementation authority; `xbrief:verify` is not a
lifecycle move.

### Why no new outcome

Command choice, invocation, output interpretation, and recovery are not assessed here. The
command is supplied verbatim and acts only as the assessor for the artifact O6.2 already
requires, so no outcome is added or recut. A later revision that grades which command a learner
picks, how they read its diagnostics, or how they recover from a red result must add its own
outcome first.

## Starting-state check

In a personal scratch note, classify each statement as a usable outcome or a horizontal
activity:

1. “Create the data model, service, interface, documentation, and tests.”
2. “A dispatcher can preview one delayed route and see its delay reason.”
3. “The API layer is complete.”

Then answer: does a well-written proposed scope authorize implementation?

**Pass:** Statement 2 is the only user-visible outcome. Statements 1 and 3 describe
components or activity without an end-to-end observation. A proposed scope is reviewable
candidate state and does not authorize implementation.

**Recovery:** Revisit [Module 5's source-and-evidence model](05-sources-versus-projections.md#mental-model).
Rewrite each activity as “a person can observe …” and retry. This module uses the pinned
0.119.5 course sources, not an installed version on your computer.

Keep the exercise fictional and in a scratch note. Do not inspect a real
backlog, client requirement, repository, or shared `USER.md`. Do not run a command or make
a remote change.

## Why this matters

A plan can look thorough while postponing value. “Build the model, then the service, then
the interface” creates horizontal layers whose integration risk stays hidden until the
end. Completion of a layer does not show that anyone can use the capability.

Directive describes a feature as an independently demoable,
human-observable capability. A narrow tracer-bullet slice crosses the relevant layers and
can be demonstrated or verified on its own. Evidence checks the outcome, not whether a
list of implementation steps was marked complete.

Start with one observation a person could make. Name the smallest
artifact that carries that result, what the slice excludes, and the literal inspection
that would disprove a false completion claim.

A planning exercise may require explicit worksheet fields beyond the
xBRIEF schema. Those fields improve learning evidence; they are not invented canonical
xBRIEF keys.

## Terminology

| Term | Meaning in this module | Do not confuse it with |
| --- | --- | --- |
| Idea | An unshaped need or opportunity that still contains uncertainty | An approved implementation scope |
| Strategy | A bounded approach for reducing the relevant uncertainty or generating work artifacts | Automatic authorization to build |
| Testable specification statement | A concise behavior statement with observable conditions and evidence | A required standalone specification file |
| Horizontal plan | Work grouped by component or technical layer instead of a usable outcome | A vertical slice |
| Vertical slice | An independently demoable, human-observable capability crossing every layer relevant to that outcome | A promise that every slice is independently deployable |
| Proposed scope | A schema-0.8 lifecycle record shaped for review, with `plan.status: proposed` | Active/running work |
| Epic | Work too broad to be one independently buildable and verifiable story | A long task list inside one story |
| Dependency rationale | Why a slice must follow another slice, or why it has no predecessor | An excuse to make all slices one batch |
| Boundary rationale | Why the slice includes and excludes specific behavior | A canonical xBRIEF field name |
| Mechanism-shaped routing | A human-semantic decision about whether a concrete proposed mechanism needs design critique before lifecycle authorization | A keyword check or a result computed by `scope:promote` |
| Controlling supplied fact | The specific fact in a fixed scenario that justifies its disposition | Repeating `route`, `no route`, or `insufficient evidence` without reasoning |
| Proposed mechanism revision | The identifier of the revision a `route` row sends to design critique, such as `NS-INGEST-R2` | A redesign sentence describing how that mechanism should change |

## Mental model

Move from uncertainty to evidence, then make the routing decision before lifecycle movement:

```text
idea → bounded strategy → observable statement → vertical slices → proposed scope
                                                                      ↓
                                                route / no route / insufficient evidence
```

The arrows shape a candidate. They do not activate it. A proposed scope remains on the
review side of the lifecycle until the routing decision is supported and a separate governed
decision promotes and activates it.

| Situation | What the model predicts | Evidence to inspect |
| --- | --- | --- |
| A plan names five components but no person-visible result | It is horizontal and hides integration risk | Outcome sentence and relevant-layer path |
| A proposed record has clear acceptance | It is reviewable, but not implementation authority | Schema version, `plan.status`, active scope, and live instruction |
| One scope contains several user journeys and shared prerequisites | It is probably epic-sized | Independent demonstrations, acceptance sets, and dependency graph |
| A proposal names a new authority or untrusted-input mechanism | Route its concrete revision before lifecycle authorization | Controlling fact, disposition, target revision, and safe next action |
| A request names a pain but no proposed mechanism | The routing judgment lacks evidence | Missing mechanism, target revision, or authority-boundary fact |

The limit: a static planning artifact can prove clarity and internal consistency. It cannot
prove executable behavior. When implementation exists, behavioral checks must provide that
proof.

## Guided explanation

### 1. Choose a strategy for the uncertainty

An idea enters an iterative strategy-analysis loop. Preparatory
strategies gather information and return to the strategy gate; spec-generating strategies
produce project and lifecycle artifacts. Interview is the ordinary default for a new
project, while Research, Discuss, Probe, and Map address different information gaps.

Choose one strategy and one reason. For example, choose Interview when the desired behavior
and boundaries still need structured answers. Choose Research only when external facts are
the blocking uncertainty. The choice does not decide the implementation, approve scope, or
remove later human decisions.

Current greenfield setup can record approved narratives and schema-0.8 proposed scopes
without creating `xbrief/specification.xbrief.json`. That compatibility artifact is
optional. A testable specification statement can live in a story item's
`plan.items[].narrative.Acceptance`; do not invent a required standalone file.

Evidence: the pinned [lifecycle overview][lifecycle], [strategy categories][strategies],
[interview choices][interview], and [setup output contract][setup].

### 2. Write acceptance as an observable result

Story acceptance belongs at the item level and should contain
roughly two to five concrete criteria, expected evidence, focused verification, and traces.
“Complete the interface” is activity. “Given one delayed route, the preview shows its route
code and delay reason” is observable.

A useful statement identifies the starting condition, the action or inspection, and the
result. It also excludes a nearby behavior so reviewers can tell whether the scope widened.
Static inspection is valid evidence for this command-free worksheet. It would not replace a
behavioral test for executable product behavior.

Evidence: [story decomposition][decompose], [xBRIEF story readiness][taxonomy], [verification
truths][verification], and [specific plan checks][plan-checking].

### 3. Replace horizontal layers with one vertical path

A vertical feature has a one-sentence human-observable demo.
Horizontal work such as “database layer complete” is the wrong unit when it cannot produce
that demonstration. A tracer bullet is narrow but complete through every layer relevant to
its outcome.

Consider this horizontal plan:

- define a disruption record;
- build a route query;
- add a formatter;
- add a display;
- write documentation and tests.

One vertical slice is: “A dispatcher previews one delayed route and sees its code, minutes
late, and delay reason.” The slice may touch a record, query, formatter, display, and test,
but each touch exists to prove that one outcome. Bulk views, acknowledgements, exports, and
notifications remain excluded.

Evidence: the pinned [feature and vertical-slice glossary][upstream-glossary] and
[tracer-bullet slicing guidance][gh-slice].

### 4. Keep proposal separate from implementation authority

Current lifecycle moves through `proposed/`, `pending/`,
`active/`, and `completed/`. Promotion and activation are separate commitments. Product
implementation requires an active/running scope, the human operator's live implementation
instruction, and passing applicable preflight gates.

An approved planning conversation can produce a proposed candidate without authorizing a
write. `plan.status: proposed` is intentionally visible evidence of that boundary. Do not
change it to `running` to make an exercise feel more complete.

Evidence: [scope lifecycle commands][commands], [setup's stop-at-proposed boundary][setup],
and [the current-contract rule][main].

### 5. Turn an epic into a dependency graph

Epic or phase records preserve broad planning context. Executable
concurrent work should be story-shaped: observable acceptance, expected evidence, narrow
file scope, focused verification, traces, and resolvable dependency IDs. Dependencies form
a directed acyclic graph, not a circular list.

For story scopes, ordering IDs belong in `plan.metadata.swarm.depends_on`. A phase or epic
may additionally use `plan.metadata.dependencies`. The exercise's written dependency and
boundary rationales explain the graph; they are course evidence, not dedicated required
schema keys.

A slice can depend on an earlier capability and still be independently verifiable once that
predecessor exists. “Independent” means it has its own observable result and evidence, not
that it shares no foundation and not that it must be deployed alone.

Evidence: [epic and story taxonomy][taxonomy], [decomposition workflow][decompose], and
[setup dependency placement][setup].

### 6. Make the semantic routing decision before lifecycle movement

Not every proposed scope needs a design-critique arc. Route when the supplied facts identify
a concrete proposed mechanism whose authority, untrusted-input, identity, concurrency, or
shared-state behavior needs adversarial design judgment. Use `no route` when the facts bound
the work to an ordinary change without such a mechanism. Use `insufficient evidence` when a
pain is named but no mechanism or target revision is available to judge.

Directive 0.119.5 records the judgment and its clearance shape; it does not compute whether
work is mechanism-shaped or score the reason. `scope:promote` is not fail-closed on that
semantic judgment. This course therefore requires a self-checkable routing artifact before
the Module 7 lifecycle lab. The artifact is curricular evidence, not a new Directive gate.

A safe routing answer always cites the controlling supplied fact and names the next action.
The route row also names the proposed mechanism revision. A keyword by itself proves none of
those relationships.

Evidence: the pinned [design-critique gate][design-critique-contract],
[ADR-005 judgment boundary][adr-005], and the project definition's self-directed evidence
contract.

## Walkthrough

### Goal

Reshape a fictional component plan into one outcome record and trace it to a proposed story.

### Safe setup

Read only the Northstar Transit facts below. Use a personal scratch note. The names and paths
are fictional examples; do not create them in this repository or a business repository.

### Actions and observations

1. **Action:** Replace “record, query, formatter, display, tests” with “A dispatcher previews
   one delayed route and sees its code, minutes late, and delay reason.”
   **Observe:** The sentence names a person-visible result.
   **Meaning:** Relevant layers now serve one outcome instead of becoming separate releases.
2. **Action:** Choose Interview because desired behavior and exclusions still need structured
   answers. Write the acceptance statement: “Given delayed route `R-17`, when a dispatcher
   opens its preview, the artifact shows `R-17`, `22 minutes late`, and `signal check`; bulk
   views, acknowledgement, export, and notification are absent.”
   **Observe:** The statement is falsifiable by literal inspection.
   **Meaning:** Strategy choice and acceptance remove named uncertainties without granting
   implementation authority.
3. **Action:** Record a schema-0.8 proposed-scope artifact with ID
   `northstar.delayed-route-preview`, one item carrying that acceptance, and
   `plan.status: proposed`.
   **Observe:** The record is reviewable candidate state.
   **Meaning:** Shaping is complete; promotion, activation, live intent, and implementation
   evidence are deliberately absent.
4. **Checkpoint:** The scratch note contains one artifact, one user-visible outcome, four
   exclusions, and the literal inspection of the three displayed values. It states that the
   proposal is not implementation authority.
5. **Action:** Inspect fact pattern `M6-ROUTE-01`. Record that `NS-INGEST-R2` changes
   untrusted-input handling and clearance recognition, choose `route`, name the revision,
   and hold promotion, activation, and implementation pending design critique.
   **Observe:** The answer connects one supplied fact to one disposition and safe action.
   **Meaning:** Routing is evidence-backed human judgment, not a keyword or lifecycle status.

## Exercise

### Fictional scenario

Northstar Transit has an idea: “Help dispatchers manage service disruptions.” A draft team
plan contains these horizontal activities:

- design a disruption record;
- add route and alert queries;
- build preview and acknowledgement services;
- add terminal and browser interfaces;
- add export and notification support;
- document and test everything.

The plan contains several person-visible capabilities and cannot be verified as one small
story. Use only these facts; do not research transit systems or substitute a real backlog.

### Your task

#### Part A — shape one vertical slice

Choose the smallest useful preview outcome. Create a worksheet with this exact header:

| Artifact | User-visible outcome | Exclusions | Literal inspection |
| --- | --- | --- | --- |
| Your named scratch artifact | One sentence a dispatcher could demonstrate | At least three nearby behaviors left out | Exact fields or statements a reviewer checks |

The `Exclusions` and `Literal inspection` labels are course worksheet evidence. They are not
canonical xBRIEF keys. Your slice must cross only the layers relevant to its one outcome.

#### Part B — trace the idea into proposed scope

Record a bounded strategy choice, why it matches the remaining uncertainty, and what it does
not decide. Then write one testable/observable specification statement for the slice.

Create a proposed-scope artifact in your scratch note. It must name:

- `xBRIEFInfo.version: 0.8`;
- one story ID and title;
- `plan.status: proposed`;
- two to five acceptance criteria under `plan.items[].narrative.Acceptance`;
- expected static evidence and a trace back to the fictional idea for every criterion; and
- the explicit sentence: “This proposal is reviewable candidate state, not implementation authority.”

Do not add a required `specification.xbrief.json`, an `Exclusions` schema key, or an active
status. This is a schema-0.8 proposed-scope artifact, not a live work request.

Keep this artifact. Lab 7 Task 5 runs the structural check against this exact file. You do not
run a command here.

#### Part C — decompose the epic

Explain why the original idea is epic-sized. Create three ordered independently verifiable
slices. Use this exact header:

| Order | Slice | Dependency rationale | Boundary rationale |
| --- | --- | --- | --- |
| 1–3 | User-visible result plus its literal evidence | Why it follows a predecessor, or why none is needed | What stays in and what remains out |

Every row needs its own observable outcome and inspection. Dependencies must form an acyclic
order. Do not use “everything depends on everything” or hide multiple outcomes inside one row.

#### Part D — route the proposed work

Use only these three fixed fictional fact patterns:

- **`M6-ROUTE-01`:** proposal `NS-INGEST-R2` changes how untrusted issue text enters an
  agent envelope and changes how clearance is recognized. A concrete proposed mechanism
  revision exists.
- **`M6-NOROUTE-01`:** one existing error-message phrase changes. Behavior, authority,
  parser inputs, and gates stay unchanged.
- **`M6-INSUFFICIENT-01`:** “make agent intake safer” names a pain but supplies no mechanism,
  target revision, or authority-boundary change.

Complete this exact matrix:

| Fact pattern ID | Controlling supplied fact | Disposition | Proposed mechanism revision | Safe next action |
| --- | --- | --- | --- | --- |
| `M6-ROUTE-01` |  |  |  |  |
| `M6-NOROUTE-01` |  |  |  |  |
| `M6-INSUFFICIENT-01` |  |  |  |  |

All three rows are required and non-compensating. A row passes only when it:

1. cites the fact-pattern ID and names a scenario-specific controlling fact;
2. uses exactly one disposition: `route`, `no route`, or `insufficient evidence`;
3. names a safe next action that follows from that fact; and
4. for `route`, names the proposed mechanism revision.

A row does not pass when it merely repeats a disposition keyword, leaves the controlling
fact implicit, or says only “review later.” The route row must hold promotion, activation,
and implementation pending the design-critique decision. The insufficient-evidence row must
name the missing mechanism or target evidence and require re-evaluation after it is supplied.

### Constraints

- Work only with this fictional scenario and a personal scratch note.
- Keep this training repository and every business repository unchanged.
- Do not run a CLI, open a terminal exercise, create a lifecycle file, contact a remote,
  promote or activate scope, or implement any behavior while completing this worksheet. The
  structural check belongs to Lab 7 Task 5 and runs inside its disposable guarded repository.
- Preserve `plan.status: proposed` and the proposal authority sentence.
- Do not run a design critique or treat the routing artifact as implementation authority.
- Treat static inspection as evidence for this worksheet only, not as proof of executable
  application behavior.

### Evidence to keep

- The vertical-slice table with artifact, user-visible outcome, exclusions, and literal
  inspection.
- The strategy decision, testable specification statement, and proposed-scope artifact.
- The Lab 7 Task 5 structural record for that artifact: its path, the exact command, the exit
  code, and the result.
- The three-row ordered decomposition with dependency and boundary rationale for every slice.
- The completed O6.4 routing matrix, including the route row's proposed mechanism revision.
- Your original horizontal plan and first attempt, so comparison evidence survives retry.

### Exercise acceptance

| Outcome | Observable condition | Inspection |
| --- | --- | --- |
| O6.1 | One end-to-end preview slice replaces the component list. | The retained row names an artifact, one user-visible outcome, at least three exclusions, and a literal inspection. |
| O6.2 | The idea traces through one justified strategy and observable acceptance into schema-0.8 proposed scope. | The artifact has `xBRIEFInfo.version: 0.8`, `plan.status: proposed`, two to five item-level acceptance criteria with evidence and traces, and the explicit no-implementation-authority boundary. |
| O6.3 | The epic becomes three ordered independently verifiable slices. | Every row has a distinct outcome and inspection plus dependency and boundary rationale; the order is acyclic. |
| O6.4 | The three fixed fact patterns receive evidence-backed route, no-route, or insufficient-evidence dispositions. | Every row cites its controlling fact and safe next action; the route row names `NS-INGEST-R2`; no row relies on presence or keywords alone. |

## Completion evidence

| Outcome | Evidence to show | Passing condition |
| --- | --- | --- |
| O6.1 | Vertical-slice worksheet and original horizontal plan | The slice produces one human-observable preview and excludes adjacent capabilities. |
| O6.2 | Strategy decision, specification statement, proposed-scope artifact, and the Lab 7 Task 5 structural record naming the artifact path, the exact command, the exit code, and the result | Strategy is bounded; acceptance is observable; schema is 0.8; status remains proposed; authority is not invented; and `xbrief:verify` exits `0` against that exact artifact path. A green structural result grants no promotion, activation, or implementation authority. |
| O6.3 | Three-row decomposition and epic diagnosis | Each slice is independently verifiable after its declared predecessors and has both rationales. |
| O6.4 | Three-row route / no route / insufficient-evidence matrix | All rows satisfy the published semantic rubric; the route row identifies `NS-INGEST-R2` and holds lifecycle movement pending critique. |

Reading the solution is not completion. Your retained artifacts must satisfy every inspection.

## Progressive hints

Try the exercise for 12–15 minutes before opening a hint. Open one at a time.

<details>
<summary>Hint 1 — begin with the observer</summary>

Ignore the component nouns. Finish this sentence: “A dispatcher can … and can see ….” Choose
one result that can be inspected without acknowledgement, export, or notification.

</details>

<details>
<summary>Hint 2 — keep the proposal on the review side</summary>

Interview fits when the desired behavior and exclusions still need answers. Put the
observable statement in one item's acceptance, retain `plan.status: proposed`, and say what
the record cannot authorize.

</details>

<details>
<summary>Hint 3 — order by usable capability</summary>

Try preview → acknowledge → export acknowledged summary. Give each row its own inspection.
Name exactly what the predecessor provides and exactly which next behavior stays outside.

</details>

<details>
<summary>Hint 4 — separate no route from not enough evidence</summary>

Choose `no route` only when the supplied facts positively bound the change away from a new
mechanism. If the proposed mechanism or target revision is absent, choose `insufficient
evidence`, name what is missing, and require the routing decision to be repeated.

</details>

## Expected failures and recovery

| Symptom | Likely cause | Confirm with | Recovery | Retry evidence |
| --- | --- | --- | --- | --- |
| The slice is “build the service.” | A component was mistaken for a user-visible outcome. | Ask who can demonstrate what. | Rewrite from the dispatcher's observation, then list relevant layers only. | One demo sentence and literal fields. |
| The worksheet includes preview, acknowledge, export, and notify. | The epic was renamed rather than sliced. | Count distinct user actions and evidence sets. | Keep preview; move other outcomes into later rows. | One outcome in O6.1 and three in O6.3. |
| The proposed artifact says `running`. | Clear acceptance was mistaken for activation. | Compare status with the authority sentence. | Restore `proposed`; record later lifecycle decisions as absent. | O6.2 inspection passes without implementation permission. |
| The strategy choice says only “Interview is default.” | The choice is not tied to uncertainty. | Name the question the strategy must answer. | State the uncertainty, reason, and what the choice does not decide. | A bounded four-part strategy record. |
| Every decomposition row depends on every other row. | Ordering was described without a DAG. | Follow the arrows and look for a cycle. | Give row 1 no predecessor and each later row only the prerequisite it consumes. | One acyclic order with a rationale per edge. |
| The routing row says only `route`. | The disposition keyword replaced semantic evidence. | Ask which supplied fact changes a mechanism and what happens next. | Add the scenario-specific fact, target revision, and bounded safe action. | The full `M6-ROUTE-01` row passes every rubric clause. |
| “Make intake safer” is marked `no route`. | Missing evidence was mistaken for evidence of absence. | Look for a proposed mechanism and target revision. | Choose `insufficient evidence`, name both missing facts, and require re-evaluation. | The row stops without inventing a mechanism or advancing lifecycle. |
| `xbrief:verify` reports `invalid JSON`. | The artifact was hand-edited into a non-parsing state. | Re-read the reported position in your own file. | Repair the JSON, rerun the same command against the same path, and retain both exit codes. | Exit `0` on the unchanged artifact path. |
| `xbrief:verify` reports `narrative.Acceptance must be a string, got list`. | Acceptance was written as a list instead of one string. | Compare your item narrative with the worked solution. | Give each item one Acceptance string; add items rather than list entries. | Exit `0` with two to five items. |
| `xbrief:verify` exits `0` while the record says `running`. | A structural pass was mistaken for rubric completion. | Compare the two evidence surfaces. | Restore `proposed`; the structural surface never inspected status. | Both surfaces pass separately. |
| The route row proceeds to promotion. | Routing was confused with clearance or implementation authority. | Compare the safe action with the proposal boundary. | Keep the scope proposed and hold promotion, activation, and implementation pending critique. | The safe action names every held transition. |

Preserve the failed attempt. Retry only the unmet outcome in a fresh section of your note,
then recheck all four acceptance rows. No repository reset or cleanup is required.

## Common misconceptions

| Misconception | Correct model | How to disprove it |
| --- | --- | --- |
| A detailed component plan is a set of vertical slices. | A slice has one independently demoable, human-observable result. | Try to write a demo sentence for “data layer complete.” |
| A standalone specification file is required before proposed scope. | Current greenfield setup may write narratives and proposed scopes directly; the compatibility file is optional. | Inspect the pinned setup output paths. |
| Approval of a proposal authorizes implementation. | Proposed scope is candidate state; current implementation needs active scope plus live intent and gates. | Compare `proposed` with the current-contract rule. |
| Independently verifiable means no dependencies. | A slice may depend on a predecessor while keeping its own outcome and proof. | Verify acknowledgement after a preview supplies the event identity. |
| Exclusions and literal inspection are required xBRIEF keys. | They are explicit course worksheet evidence in this exercise. | Compare the worksheet with the schema and story acceptance fields. |
| Static inspection proves a future program works. | It proves only this planning artifact's contents. | Name the behavioral test still required after implementation. |
| Directive decides whether a proposal is mechanism-shaped. | The semantic call is human judgment; 0.119.5 records its shape but does not compute it. | Compare the supplied facts with the design-critique Stop 1 boundary. |
| A green `xbrief:verify` means the proposal is approved. | It proves parse and lifecycle-record structure only. | Read the command's own note that verify is not a lifecycle move, then check that nothing was promoted. |
| `no route` and `insufficient evidence` are interchangeable. | `no route` is a supported negative decision; insufficient evidence means the decision cannot yet be made. | Ask whether a concrete mechanism and target revision were supplied. |

## Self-assessment

Answer without reopening the lesson, then compare with your retained evidence and the
explained solution. Items 1-4 name the outcome whose Completion-evidence row scores them;
item 5 is ungraded practice with no Completion-evidence row to join.

1. **O6.1:** Why is “build the query and interface” horizontal? State one vertical outcome,
   its artifact, exclusions, and literal inspection.
2. **O6.2:** Which uncertainty supports your strategy choice? Where does the observable
   acceptance live, which schema/status does the proposal use, and what authority is absent?
   Which path, command, exit code, and result prove your artifact's structure, and what does a
   green structural result still not grant?
3. **O6.3:** What made the original scenario epic-sized? Read your three rows in order and
   explain every dependency and boundary rationale.
4. **O6.4:** For each fixed fact-pattern ID, name the controlling fact, disposition, and
   safe next action. Which field/value pair fills the route row's revision cell —
   `Proposed mechanism revision` = `NS-INGEST-R2` — and which lifecycle actions remain on
   hold?
5. *Ungraded practice.* Why can static inspection complete this command-free worksheet but
   not prove executable product behavior? No Completion-evidence row scores this item.

- **Ready to continue:** O6.1, O6.2, O6.3, and O6.4 each have passing retained evidence.
- **Revisit one section:** the outcome is right but a field, rationale, or authority limit is
  missing.
- **Retry the exercise:** any row remains horizontal, proposed state becomes active, a cycle
  exists, or success depends on an unverified claim.

Confidence alone is not completion evidence.

## Explained solution

After a suggested first attempt, use the [explained solution](../../solutions/module-06-creating-well-shaped-work.md).
It provides complete fictional artifacts, the worked O6.4 semantic matrix, reasoning, valid
alternatives, recovery, and a bounded retry. The
[self-assessment key](../../solutions/module-06-creating-well-shaped-work.md#self-assessment-key)
answers the five items above. It explains answers; the Completion evidence table remains
the instrument that scores this module. No instructor, review bot, account, or automation
unlock is required.

## Navigation

- Previous: [Module 5 — Sources versus Projections](05-sources-versus-projections.md)
- Course map: [Core curriculum](../README.md)
- Next: [Module 7 — Scope Lifecycle and Implementation Authorization](07-scope-lifecycle.md)
- Resume point: retry the first outcome without passing evidence; retain outcomes already
  demonstrated unless the course baseline changes.

## Official sources

| Statement supported | Pinned source and heading | Verified date | Notes or disagreement |
| --- | --- | --- | --- |
| Idea-to-strategy loop and lifecycle surfaces | [Lifecycle — inception and stage surfaces][lifecycle] | 2026-09-09 | Original course paraphrase |
| Preparatory versus spec-generating strategies and Interview choice | [Strategy categories][strategies] and [Interview choices][interview] | 2026-09-09 | Strategy prose retains deprecated slash-command and vBRIEF wording |
| Current greenfield output and optional compatibility specification | [Setup — current output contract][setup] | 2026-09-09 | New setup does not require `specification.xbrief.json` |
| Story acceptance, evidence, traces, and decomposition DAG | [Decompose skill][decompose], [xBRIEF taxonomy][taxonomy], and [verification guidance][verification] | 2026-09-09 | Story dependencies use `swarm.depends_on`; phase/epic metadata may supplement it |
| Vertical capability and tracer-bullet shape | [Glossary — feature and vertical slice][upstream-glossary] and [GitHub slicing guidance][gh-slice] | 2026-09-09 | Independently demoable/verifiable, not universally independently deployable |
| Proposed lifecycle and current implementation contract | [Commands — scope lifecycle][commands] and [main — xBRIEF Persistence][main] | 2026-09-09 | Proposal remains candidate state |
| Mechanism-shaped judgment is semantic and recorded rather than computed | [Design-critique contract — Stop 1][design-critique-contract] and [ADR-005][adr-005] | 2026-09-17 | `scope:promote` does not fail closed on this judgment; O6.4 is a curriculum hold |
| Fictional, command-free exercise and explicit worksheet evidence | [Project definition](../../xbrief/PROJECT-DEFINITION.xbrief.json) LabModel and ProjectRules | 2026-09-09 | Worksheet fields are not canonical schema keys |

This lesson is an original paraphrase and fictional teaching adaptation. See the
[source baseline](../../references/SOURCE-BASELINE.md), [Module 6 verification notes](../../references/SOURCE-NOTES.md#module-6-verification),
and [glossary](../../references/GLOSSARY.md).

## Author release check

- O6.1–O6.4 each have exercise, completion, self-assessment, and solution evidence.
- O6.4 has the fixed three-row packet, non-compensating semantic rubric, fully worked
  solution, and a required Module 7 starting-state handoff.
- The walkthrough and exercise are fictional, command-free, and inspectable from the stated
  starting facts.
- The proposal remains schema 0.8 and proposed; no implementation authority is implied.
- O6.2 completion evidence names the artifact path, command, exit code, and result of its
  structural check, and the vehicle recut is stated as the Lab 7 Task 5 adjacent step.
- Every epic slice has its own outcome, evidence, dependency rationale, and boundary rationale.
- Version-sensitive claims trace to the immutable 0.119.5 release and recorded disagreements.
- Navigation and local source links pass the focused content verifier.
- An independent learner pilot remains a separate course milestone.

[lifecycle]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/docs/directive-lifecycle.md
[strategies]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/strategies/README.md
[interview]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/strategies/interview.md
[setup]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/skills/deft-directive-setup/SKILL.md
[decompose]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/skills/deft-directive-decompose/SKILL.md
[taxonomy]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/vbrief/vbrief.md
[verification]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/verification/verification.md
[plan-checking]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/verification/plan-checking.md
[upstream-glossary]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/glossary.md
[gh-slice]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/skills/deft-directive-gh-slice/SKILL.md
[commands]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/commands.md
[main]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/main.md
[design-critique-contract]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/contracts/design-critique.md#stop-1--gate
[adr-005]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/docs/decisions/ADR-005-design-critique-judgment-gate.md
