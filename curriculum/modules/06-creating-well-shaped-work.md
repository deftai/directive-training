# Module 6 — Creating Well-Shaped Work

Turn a horizontal activity list into a small end-to-end outcome, trace it into reviewable
proposed scope, and split an epic into ordered slices with observable evidence.

## Module record

| Field | Value |
| --- | --- |
| Stable ID | `module-06-creating-well-shaped-work` |
| Status | `learner-ready draft; command-free` |
| Last content update | 2026-09-09 |
| Last verified | 2026-09-09 |
| Directive baseline | `@deftai/directive@0.112.0`, engine `@deftai/directive-core@0.112.0`; see the [source baseline](../../references/SOURCE-BASELINE.md) |
| Estimated duration | 50–60 minutes |
| Prerequisites | Complete [Module 5's](05-sources-versus-projections.md) conceptual outcomes; its practical outcome may remain environment-blocked as documented in the [course map](../README.md) |

Suggested pacing: 5 minutes for the starting check, 15 for the explanation and
walkthrough, 20 for the exercise, and 10–20 for evidence and solution comparison. This
exercise is command-free on macOS, Linux, or Windows. Use only a personal scratch note;
no CLI, repository, service, or account is required.

Claim labels used here:

- **[Directive behavior]** — behavior or convention verified against the pinned release.
- **[3Ci policy]** — a requirement of this private curriculum.
- **[Course guidance]** — a learning technique or fictional example.

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
0.112.0 course sources, not an installed version on your computer.

**[3Ci policy]** Keep the exercise fictional and in a scratch note. Do not inspect a real
backlog, client requirement, repository, or shared `USER.md`. Do not run a command or make
a remote change.

## Why this matters

A plan can look thorough while postponing value. “Build the model, then the service, then
the interface” creates horizontal layers whose integration risk stays hidden until the
end. Completion of a layer does not show that anyone can use the capability.

**[Directive behavior]** Directive describes a feature as an independently demoable,
human-observable capability. A narrow tracer-bullet slice crosses the relevant layers and
can be demonstrated or verified on its own. Evidence checks the outcome, not whether a
list of implementation steps was marked complete.

**[Course guidance]** Start with one observation a person could make. Name the smallest
artifact that carries that result, what the slice excludes, and the literal inspection
that would disprove a false completion claim.

**[3Ci policy]** A planning exercise may require explicit worksheet fields beyond the
xBRIEF schema. Those fields improve learning evidence; they are not invented canonical
xBRIEF keys.

## Terminology

| Term | Meaning in this module | Claim type | Do not confuse it with |
| --- | --- | --- | --- |
| Idea | An unshaped need or opportunity that still contains uncertainty | Directive behavior | An approved implementation scope |
| Strategy | A bounded approach for reducing the relevant uncertainty or generating work artifacts | Directive behavior | Automatic authorization to build |
| Testable specification statement | A concise behavior statement with observable conditions and evidence | Course guidance | A required standalone specification file |
| Horizontal plan | Work grouped by component or technical layer instead of a usable outcome | Directive behavior | A vertical slice |
| Vertical slice | An independently demoable, human-observable capability crossing every layer relevant to that outcome | Directive behavior | A promise that every slice is independently deployable |
| Proposed scope | A schema-0.8 lifecycle record shaped for review, with `plan.status: proposed` | Directive behavior | Active/running work |
| Epic | Work too broad to be one independently buildable and verifiable story | Directive behavior | A long task list inside one story |
| Dependency rationale | Why a slice must follow another slice, or why it has no predecessor | Course guidance | An excuse to make all slices one batch |
| Boundary rationale | Why the slice includes and excludes specific behavior | Course guidance | A canonical xBRIEF field name |

## Mental model

**[Course guidance]** Move from uncertainty to evidence:

```text
idea → bounded strategy → observable statement → proposed scope → vertical slices
```

The arrows shape a candidate. They do not activate it. A proposed scope remains on the
review side of the lifecycle until a separate governed decision promotes and activates it.

| Situation | What the model predicts | Evidence to inspect |
| --- | --- | --- |
| A plan names five components but no person-visible result | It is horizontal and hides integration risk | Outcome sentence and relevant-layer path |
| A proposed record has clear acceptance | It is reviewable, but not implementation authority | Schema version, `plan.status`, active scope, and live instruction |
| One scope contains several user journeys and shared prerequisites | It is probably epic-sized | Independent demonstrations, acceptance sets, and dependency graph |

The limit: a static planning artifact can prove clarity and internal consistency. It cannot
prove executable behavior. When implementation exists, behavioral checks must provide that
proof.

## Guided explanation

### 1. Choose a strategy for the uncertainty

**[Directive behavior]** An idea enters an iterative strategy-analysis loop. Preparatory
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

**[Directive behavior]** Story acceptance belongs at the item level and should contain
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

**[Directive behavior]** A vertical feature has a one-sentence human-observable demo.
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

**[Directive behavior]** Current lifecycle moves through `proposed/`, `pending/`,
`active/`, and `completed/`. Promotion and activation are separate commitments. Product
implementation requires an active/running scope, the human operator's live implementation
instruction, and passing applicable preflight gates.

An approved planning conversation can produce a proposed candidate without authorizing a
write. `plan.status: proposed` is intentionally visible evidence of that boundary. Do not
change it to `running` to make an exercise feel more complete.

Evidence: [scope lifecycle commands][commands], [setup's stop-at-proposed boundary][setup],
and [the current-contract rule][main].

### 5. Turn an epic into a dependency graph

**[Directive behavior]** Epic or phase records preserve broad planning context. Executable
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

#### Part C — decompose the epic

Explain why the original idea is epic-sized. Create three ordered independently verifiable
slices. Use this exact header:

| Order | Slice | Dependency rationale | Boundary rationale |
| --- | --- | --- | --- |
| 1–3 | User-visible result plus its literal evidence | Why it follows a predecessor, or why none is needed | What stays in and what remains out |

Every row needs its own observable outcome and inspection. Dependencies must form an acyclic
order. Do not use “everything depends on everything” or hide multiple outcomes inside one row.

### Constraints

- **[3Ci policy]** Work only with this fictional scenario and a personal scratch note.
- Keep this training repository and every business repository unchanged.
- Do not run a CLI, open a terminal exercise, create a lifecycle file, contact a remote,
  promote or activate scope, or implement any behavior.
- Preserve `plan.status: proposed` and the proposal authority sentence.
- Treat static inspection as evidence for this worksheet only, not as proof of executable
  application behavior.

### Evidence to keep

- The vertical-slice table with artifact, user-visible outcome, exclusions, and literal
  inspection.
- The strategy decision, testable specification statement, and proposed-scope artifact.
- The three-row ordered decomposition with dependency and boundary rationale for every slice.
- Your original horizontal plan and first attempt, so comparison evidence survives retry.

### Exercise acceptance

| Outcome | Observable condition | Inspection |
| --- | --- | --- |
| O6.1 | One end-to-end preview slice replaces the component list. | The retained row names an artifact, one user-visible outcome, at least three exclusions, and a literal inspection. |
| O6.2 | The idea traces through one justified strategy and observable acceptance into schema-0.8 proposed scope. | The artifact has `xBRIEFInfo.version: 0.8`, `plan.status: proposed`, two to five item-level acceptance criteria with evidence and traces, and the explicit no-implementation-authority boundary. |
| O6.3 | The epic becomes three ordered independently verifiable slices. | Every row has a distinct outcome and inspection plus dependency and boundary rationale; the order is acyclic. |

## Completion evidence

| Outcome | Evidence to show | Passing condition |
| --- | --- | --- |
| O6.1 | Vertical-slice worksheet and original horizontal plan | The slice produces one human-observable preview and excludes adjacent capabilities. |
| O6.2 | Strategy decision, specification statement, and proposed-scope artifact | Strategy is bounded; acceptance is observable; schema is 0.8; status remains proposed; authority is not invented. |
| O6.3 | Three-row decomposition and epic diagnosis | Each slice is independently verifiable after its declared predecessors and has both rationales. |

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

## Expected failures and recovery

| Symptom | Likely cause | Confirm with | Recovery | Retry evidence |
| --- | --- | --- | --- | --- |
| The slice is “build the service.” | A component was mistaken for a user-visible outcome. | Ask who can demonstrate what. | Rewrite from the dispatcher's observation, then list relevant layers only. | One demo sentence and literal fields. |
| The worksheet includes preview, acknowledge, export, and notify. | The epic was renamed rather than sliced. | Count distinct user actions and evidence sets. | Keep preview; move other outcomes into later rows. | One outcome in O6.1 and three in O6.3. |
| The proposed artifact says `running`. | Clear acceptance was mistaken for activation. | Compare status with the authority sentence. | Restore `proposed`; record later lifecycle decisions as absent. | O6.2 inspection passes without implementation permission. |
| The strategy choice says only “Interview is default.” | The choice is not tied to uncertainty. | Name the question the strategy must answer. | State the uncertainty, reason, and what the choice does not decide. | A bounded four-part strategy record. |
| Every decomposition row depends on every other row. | Ordering was described without a DAG. | Follow the arrows and look for a cycle. | Give row 1 no predecessor and each later row only the prerequisite it consumes. | One acyclic order with a rationale per edge. |

Preserve the failed attempt. Retry only the unmet outcome in a fresh section of your note,
then recheck all three acceptance rows. No repository reset or cleanup is required.

## Common misconceptions

| Misconception | Correct model | How to disprove it |
| --- | --- | --- |
| A detailed component plan is a set of vertical slices. | A slice has one independently demoable, human-observable result. | Try to write a demo sentence for “data layer complete.” |
| A standalone specification file is required before proposed scope. | Current greenfield setup may write narratives and proposed scopes directly; the compatibility file is optional. | Inspect the pinned setup output paths. |
| Approval of a proposal authorizes implementation. | Proposed scope is candidate state; current implementation needs active scope plus live intent and gates. | Compare `proposed` with the current-contract rule. |
| Independently verifiable means no dependencies. | A slice may depend on a predecessor while keeping its own outcome and proof. | Verify acknowledgement after a preview supplies the event identity. |
| Exclusions and literal inspection are required xBRIEF keys. | They are explicit course worksheet evidence in this exercise. | Compare the worksheet with the schema and story acceptance fields. |
| Static inspection proves a future program works. | It proves only this planning artifact's contents. | Name the behavioral test still required after implementation. |

## Self-assessment

Answer without reopening the lesson, then compare with your retained evidence and the
explained solution.

1. **O6.1:** Why is “build the query and interface” horizontal? State one vertical outcome,
   its artifact, exclusions, and literal inspection.
2. **O6.2:** Which uncertainty supports your strategy choice? Where does the observable
   acceptance live, which schema/status does the proposal use, and what authority is absent?
3. **O6.3:** What made the original scenario epic-sized? Read your three rows in order and
   explain every dependency and boundary rationale.
4. Why can static inspection complete this command-free worksheet but not prove executable
   product behavior?

- **Ready to continue:** O6.1, O6.2, and O6.3 each have passing retained evidence.
- **Revisit one section:** the outcome is right but a field, rationale, or authority limit is
  missing.
- **Retry the exercise:** any row remains horizontal, proposed state becomes active, a cycle
  exists, or success depends on an unverified claim.

Confidence alone is not completion evidence.

## Explained solution

After a suggested first attempt, use the [explained solution](../../solutions/module-06-creating-well-shaped-work.md).
It provides complete fictional artifacts, reasoning, valid alternatives, recovery, and a
bounded retry. **[3Ci policy]** No instructor, review bot, account, or automation unlock is
required.

## Navigation

- Previous: [Module 5 — Sources versus Projections](05-sources-versus-projections.md)
- Course map: [Core curriculum](../README.md)
- Next: Module 7 — Scope Lifecycle and Implementation Authorization is planned; return to
  the [course map](../README.md).
- Resume point: retry the first outcome without passing evidence; retain outcomes already
  demonstrated unless the course baseline changes.

## Official sources

| Claim supported | Source type | Pinned source and heading | Verified date | Notes or disagreement |
| --- | --- | --- | --- | --- |
| Idea-to-strategy loop and lifecycle surfaces | Directive behavior | [Lifecycle — inception and stage surfaces][lifecycle] | 2026-09-09 | Original course paraphrase |
| Preparatory versus spec-generating strategies and Interview choice | Directive behavior | [Strategy categories][strategies] and [Interview choices][interview] | 2026-09-09 | Strategy prose retains deprecated slash-command and vBRIEF wording |
| Current greenfield output and optional compatibility specification | Directive behavior | [Setup — current output contract][setup] | 2026-09-09 | New setup does not require `specification.xbrief.json` |
| Story acceptance, evidence, traces, and decomposition DAG | Directive behavior | [Decompose skill][decompose], [xBRIEF taxonomy][taxonomy], and [verification guidance][verification] | 2026-09-09 | Story dependencies use `swarm.depends_on`; phase/epic metadata may supplement it |
| Vertical capability and tracer-bullet shape | Directive behavior | [Glossary — feature and vertical slice][upstream-glossary] and [GitHub slicing guidance][gh-slice] | 2026-09-09 | Independently demoable/verifiable, not universally independently deployable |
| Proposed lifecycle and current implementation contract | Directive behavior | [Commands — scope lifecycle][commands] and [main — xBRIEF Persistence][main] | 2026-09-09 | Proposal remains candidate state |
| Fictional, command-free exercise and explicit worksheet evidence | 3Ci policy | [Project definition](../../xbrief/PROJECT-DEFINITION.xbrief.json) LabModel and ProjectRules | 2026-09-09 | Worksheet fields are not canonical schema keys |

This lesson is an original paraphrase and fictional teaching adaptation. See the
[source baseline](../../references/SOURCE-BASELINE.md), [Module 6 verification notes](../../references/SOURCE-NOTES.md#module-6-verification),
and [glossary](../../references/GLOSSARY.md).

## Author release check

- O6.1–O6.3 each have exercise, completion, self-assessment, and solution evidence.
- The walkthrough and exercise are fictional, command-free, and inspectable from the stated
  starting facts.
- The proposal remains schema 0.8 and proposed; no implementation authority is implied.
- Every epic slice has its own outcome, evidence, dependency rationale, and boundary rationale.
- Version-sensitive claims trace to the immutable 0.112.0 release and recorded disagreements.
- Navigation and local source links pass the focused content verifier.
- An independent learner pilot remains a separate course milestone.

[lifecycle]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/docs/directive-lifecycle.md
[strategies]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/strategies/README.md
[interview]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/strategies/interview.md
[setup]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-setup/SKILL.md
[decompose]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-decompose/SKILL.md
[taxonomy]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/vbrief/vbrief.md
[verification]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/verification/verification.md
[plan-checking]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/verification/plan-checking.md
[upstream-glossary]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/glossary.md
[gh-slice]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-gh-slice/SKILL.md
[commands]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/commands.md
[main]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/main.md
