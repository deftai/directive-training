# Explained solution — Module 6: Creating Well-Shaped Work

Reshape Northstar Transit's component list into one observable preview, preserve its
proposed-state boundary, and decompose the broader disruption idea into three usable slices.

## Solution record

| Field | Value |
| --- | --- |
| Stable ID | `solution-module-06-creating-well-shaped-work` |
| Solves | `module-06-creating-well-shaped-work` |
| Outcomes covered | O6.1, O6.2, O6.3 |
| Status | `learner-ready draft; command-free` |
| Last verified | 2026-09-09 |
| Directive baseline | `@deftai/directive@0.112.0`, engine `@deftai/directive-core@0.112.0`; see the [source baseline](../references/SOURCE-BASELINE.md) |
| Source exercise | [Module 6 shaping exercise](../curriculum/modules/06-creating-well-shaped-work.md#exercise) |

Claim labels used here:

- **[Directive behavior]** — verified release behavior or convention.
- **[3Ci policy]** — a local curriculum requirement.
- **[Course guidance]** — one useful approach or fictional example.

## Before you use this solution

Spend 12–15 minutes on the exercise and open the hints one at a time. Keep your original
horizontal plan, slice record, proposed artifact, and decomposition for comparison.

This is a suggestion, not an access gate. **[3Ci policy]** You may read this solution
without an instructor, private message, account, review bot, or automation unlock.

If you opened it first, read the reasoning once, close it, and retry in a fresh scratch-note
section. There is no repository or environment to reset.

## Result summary

The first usable slice is a delayed-route preview, not a completed data or interface layer.
Its artifact shows one dispatcher the route code, delay minutes, and reason while excluding
acknowledgement, bulk views, export, and notification.

Interview is a bounded strategy choice because the behavior and exclusions need structured
answers. The resulting observable acceptance is expressed through two proposed story items. The
schema-0.8 record stays `proposed`; it is reviewable candidate state and does not grant
implementation authority.

The larger “manage service disruptions” idea is an epic. It becomes preview, acknowledge,
and export slices with an acyclic order. Each slice has its own observation and evidence,
plus a reason for its dependency and boundary.

## Outcome map

| Outcome | How this solution demonstrates it | Evidence |
| --- | --- | --- |
| O6.1 | Replaces horizontal components with one relevant-layer preview path | Completed vertical-slice record |
| O6.2 | Connects uncertainty, strategy, observable acceptance, and proposed scope without inventing authority | Strategy record, acceptance statement, and schema-0.8 JSON |
| O6.3 | Diagnoses the epic and orders three independently verifiable capabilities | Three-row decomposition with both rationales |

## Reasoning

### 1. Find the smallest human observation

The component list names possible implementation work, but none of its entries is useful to
a dispatcher alone. A preview of one delayed route is the smallest result that crosses the
relevant data, selection, formatting, and display concerns.

**[Directive behavior]** A feature has an independently demoable, human-observable sentence.
A tracer bullet is narrow and complete through the layers relevant to that sentence. It
need not include every interface, workflow, or future delivery path.

### 2. Match strategy to uncertainty

The fictional idea does not need external research. It needs decisions about the first user,
visible fields, exclusions, and evidence. Interview fits that uncertainty. This reason is
stronger than “Interview is the default,” because it states what the strategy must resolve.

**[Directive behavior]** Strategy analysis shapes artifacts. The current setup contract can
write project narratives and proposed scope directly; a standalone
`specification.xbrief.json` is optional compatibility output, not a universal prerequisite.

### 3. Separate clarity from authority

The acceptance statement is specific enough to review, but clear prose does not activate a
story. The proposed artifact remains in candidate state. Later promotion, activation, live
implementation intent, and preflight evidence are deliberately absent from this exercise.

**[Directive behavior]** The current implementation contract is active scope plus the human
operator's live instruction. Proposed-state approval is not that conjunction.

### 4. Split the epic by useful capability

The original idea contains at least preview, acknowledgement, export, and notification
journeys. It also names two interfaces. One acceptance set would either be vague or contain
too many outcomes. Preview supplies an event identity; acknowledgement consumes it; export
consumes acknowledged state. This produces an acyclic path with one observable result at
each step.

## Worked approach

### Step 1 — Record the vertical slice

This table is **[Course guidance]** evidence for the exercise, not a canonical xBRIEF shape.

| Artifact | User-visible outcome | Exclusions | Literal inspection |
| --- | --- | --- | --- |
| `northstar-delayed-route-preview` scratch record | A dispatcher previews delayed route `R-17` and sees its route code, `22 minutes late`, and `signal check` reason | Bulk route list; acknowledgement; export; notification; browser view | The artifact contains exactly `R-17`, `22 minutes late`, and `signal check`, and none of the excluded actions is claimed |

Why it is vertical: the result would require every relevant layer needed to select and show
one disruption, but no layer is treated as valuable by itself. Why it is small: one user,
one route, one display outcome, and one literal evidence set define the boundary.

### Step 2 — Trace the idea to proposed scope

#### Strategy record

| Idea | Bounded strategy choice | Reason | What the choice does not decide |
| --- | --- | --- | --- |
| Help dispatchers manage service disruptions | Interview | The first user, displayed fields, exclusions, and evidence need structured answers | Architecture, implementation approach, lifecycle activation, and permission to write |

#### Testable specification statement

> Given delayed route `R-17` with a 22-minute delay caused by `signal check`, when a
> dispatcher inspects the preview artifact, it shows the route code, delay minutes, and
> reason. It does not claim a bulk view, acknowledgement, export, notification, browser
> interface, deployment, or remote action.

The statement is observable and bounded. Its literal inspection is sufficient for this
fictional scratch artifact. A real implementation would need behavioral verification.

#### Proposed-scope artifact

```json
{
  "xBRIEFInfo": {
    "version": "0.8",
    "description": "Proposed fictional delayed-route preview"
  },
  "plan": {
    "id": "northstar.delayed-route-preview",
    "title": "Preview one delayed route",
    "status": "proposed",
    "narratives": {
      "Description": "Give one dispatcher an inspectable preview for one delayed route.",
      "UserStory": "As a dispatcher, I want one delayed-route preview so that I can see why it is late.",
      "Traces": "Fictional idea: help dispatchers manage service disruptions"
    },
    "items": [
      {
        "id": "northstar.delayed-route-preview.display",
        "title": "Show route delay details",
        "status": "proposed",
        "effort": "M",
        "narrative": {
          "Acceptance": "Given R-17 delayed 22 minutes by signal check, when a dispatcher inspects its preview, the artifact shows R-17, 22 minutes late, and signal check.",
          "Traces": "northstar.delayed-route-preview"
        }
      },
      {
        "id": "northstar.delayed-route-preview.boundary",
        "title": "Keep the preview to one route and one action",
        "status": "proposed",
        "effort": "S",
        "narrative": {
          "Acceptance": "Given the R-17 preview, inspection finds no bulk list, acknowledgement, export, notification, or browser action in the claimed behavior.",
          "Traces": "northstar.delayed-route-preview"
        }
      }
    ],
    "metadata": {
      "kind": "story",
      "swarm": {
        "readiness": "needs_refinement",
        "parallel_safe": false,
        "file_scope": [
          "fictional/preview-record.txt"
        ],
        "verify_commands": [],
        "expected_outputs": [
          "A schema-0.8 proposed-scope record with two observable acceptance items",
          "A separate preview worksheet with the stated static inspection"
        ],
        "depends_on": []
      }
    }
  }
}
```

Expected static evidence is the proposed JSON shape and the separate preview worksheet. The
trace points back to the fictional idea. **This proposal is reviewable candidate state, not
implementation authority.** Its two traced acceptance items satisfy the ordinary two-to-five
range. `needs_refinement` and the empty `verify_commands` make the command-free candidate's
implementation unreadiness explicit; a real executable scope would name focused verification.

### Step 3 — Diagnose and decompose the epic

The original idea is epic-sized because it combines multiple user actions, states,
interfaces, and delivery mechanisms. Each would need different acceptance and evidence.

| Order | Slice | Dependency rationale | Boundary rationale |
| --- | --- | --- | --- |
| 1 | Preview one delayed route — inspect code, minutes, and reason | No predecessor: one supplied fictional delay record is enough to demonstrate the preview | Includes one dispatcher and one route; excludes acknowledgement, lists, export, notification, and browser view |
| 2 | Acknowledge the previewed delay — inspect route code, actor label, and acknowledged state | Depends on slice 1 because acknowledgement consumes the visible route identity | Includes one acknowledgement record; excludes bulk actions, export, notification, and workflow assignment |
| 3 | Export one acknowledged-delay summary — inspect code, delay, reason, and acknowledgement | Depends on slice 2 because only acknowledged state belongs in this summary | Includes one local summary artifact; excludes scheduled delivery, remote upload, notification, and multi-route reporting |

Each row is independently verifiable once its declared predecessor exists. No row depends on
a later row, so the graph is acyclic. Notifications and browser behavior remain visible as
future candidate work instead of leaking into these slices.

## Acceptance evidence

| Inspection from the exercise | Required result | Worked evidence | Outcome |
| --- | --- | --- | --- |
| Horizontal-to-vertical rewrite | One person-visible preview replaces component completion | Step 1 outcome sentence | O6.1 |
| Artifact, outcome, exclusions, literal inspection | All four worksheet fields are explicit | Step 1 table | O6.1 |
| Strategy and observable specification | Choice names uncertainty and statement can be disproved | Step 2 strategy record and statement | O6.2 |
| Proposed-scope boundary | Schema is 0.8, `plan.status` is proposed, two traced acceptance items and expected evidence exist, and no implementation authority is claimed | Step 2 JSON and authority sentence | O6.2 |
| Epic diagnosis and ordered slices | Three distinct demonstrations replace the broad plan | Step 3 diagnosis and rows | O6.3 |
| Dependency and boundary rationale | Every row has both explanations and the order has no cycle | Step 3 last two columns | O6.3 |

There is no terminal output. Completion evidence is the learner's own scratch artifacts
passing these inspections.

## Compare with your attempt

| Compare | Match means | Difference means | Next action |
| --- | --- | --- | --- |
| Slice outcome | One dispatcher can demonstrate one preview | Components or multiple journeys remain | Rewrite from the observer's sentence |
| Evidence | Exact content can be inspected | “Looks correct” or step completion substitutes for proof | Name fields and excluded claims literally |
| Strategy | Choice removes a named uncertainty | A default label replaces reasoning | Add the blocking question and decision limit |
| Proposed artifact | Candidate is schema 0.8 and proposed | Scope is missing, legacy, or prematurely active | Restore the current shape and authority boundary |
| Decomposition | Each row has one result, proof, and acyclic dependency | Rows are phases, circular, or broad | Split by user action and consumed predecessor state |

Keep one correction sentence per difference: “I treated [activity] as [outcome]; the observer
can only verify [result], so I will [bounded correction].”

## Valid alternatives

| Alternative | Why it also passes | Evidence required | When it fails |
| --- | --- | --- | --- |
| Choose Discuss instead of Interview | A focused tradeoff may be the only uncertainty | Name the exact decision and return artifact | It becomes an unbounded conversation or skips proposed scope |
| Preview the disruption reason before delay minutes | Either can be the first usable observation | One user-visible outcome, explicit fields, and exclusions | It silently includes acknowledgement or bulk behavior |
| Put export before acknowledgement | A general delay report need not consume acknowledgement | State that independence and change its input/evidence | The artifact still claims “acknowledged” without slice 2 |
| Use prose instead of JSON for the worksheet | Worksheet format is course guidance | Separately retain a valid schema-0.8 proposed-scope artifact | The proposed artifact or status/authority boundary disappears |

An alternate does not pass if it requires a standalone specification file, invents an
`Exclusions` schema key, makes the proposal active, or treats a component as value.

## Expected failures and recovery

### Components remain the unit of value

- **Symptom:** The result says a model, API, or interface is complete.
- **Cause:** The implementation layer replaced the human observation.
- **Confirm:** Try to demonstrate the result to a dispatcher without later components.
- **Recover:** Keep the old row and write one “dispatcher can …” sentence in a new row.
- **Retry:** The new artifact crosses only relevant layers and has literal visible evidence.

### Proposed scope becomes permission

- **Symptom:** The record uses `running` or says approval starts implementation.
- **Cause:** Candidate quality was confused with lifecycle and live authority.
- **Confirm:** Compare the status and authority sentence with the lifecycle model.
- **Recover:** Restore `proposed`; list promotion, activation, live intent, and preflight as
  absent future commitments.
- **Retry:** O6.2 passes without any file mutation or executable claim.

### Decomposition is a renamed task sequence

- **Symptom:** Rows are “data,” “service,” and “interface,” or all rows share one final proof.
- **Cause:** Horizontal phases were numbered instead of reshaped.
- **Confirm:** Ask for a separate human-observable sentence and inspection per row.
- **Recover:** Use preview, acknowledge, and export outcomes; add only the predecessor each
  consumes.
- **Retry:** Three independent evidence sets and an acyclic order remain.

### Static evidence is overclaimed

- **Symptom:** The scratch JSON is presented as proof that an application works.
- **Cause:** Planning inspection was promoted into behavioral evidence.
- **Confirm:** Identify which executable behavior actually ran; the answer is none.
- **Recover:** Narrow the claim to “the planning artifact contains …” and name the future
  behavioral check.
- **Retry:** Worksheet completion and product behavior remain separate claims.

## Misconceptions exposed by this exercise

| Misconception | What the evidence shows | Source |
| --- | --- | --- |
| More component detail makes work vertical | Only the preview has one human-observable demo | Upstream glossary and tracer-bullet guidance |
| A separate specification file is mandatory | Current setup can emit proposed scope directly | Setup output contract |
| Proposed acceptance is implementation authority | The artifact remains candidate state | Commands and current-contract rule |
| Dependencies prevent independent verification | Rows 2 and 3 have distinct proof after their predecessors | Decomposition DAG guidance |
| Worksheet labels are schema requirements | `Exclusions` and `Literal inspection` sit outside the JSON | Verification guidance and exercise boundary |

## Self-assessment answers

1. **O6.1:** “Build query and interface” is horizontal because neither is a dispatcher
   result. The preview artifact, visible route details, named exclusions, and exact field
   inspection form one vertical outcome.
2. **O6.2:** Uncertainty about user, fields, and boundaries supports Interview. Observable
   acceptance lives in the story item's `narrative.Acceptance`. The artifact uses schema 0.8
   and proposed status. Activation, live implementation intent, and passing gates are absent.
3. **O6.3:** Multiple user actions, states, interfaces, and evidence sets make the idea an
   epic. Preview has no predecessor; acknowledgement consumes preview identity; export
   consumes acknowledged state. Each boundary excludes the next capability and remote work.
4. Static inspection proves what the scratch artifacts say. It cannot prove code responds to
   an input; a real implementation needs focused behavioral checks.

## Retry plan

1. Preserve your first attempt.
2. Start a fresh scratch-note section for the first unmet outcome.
3. Retry only its table, decision, artifact, or rationale without copying this final wording.
4. Apply the original exercise inspection.
5. Recheck O6.1, O6.2, and O6.3 before recording completion.

Improved prose alone is not evidence if the work remains horizontal, proposed state changes,
or a dependency rationale is missing.

## Reset and cleanup

- Additional state: personal scratch notes with fictional content only.
- Reset: begin a fresh note section; retain the original for comparison.
- Cleanup: keep or discard notes through your normal note-handling practice.
- Cleanup evidence: no repository, remote, credential, running process, or service changed.

The solution creates no fixture and prescribes no deletion. A repository reset is neither
needed nor authorized.

## Sources

| Claim | Type | Pinned source | Verified date |
| --- | --- | --- | --- |
| Idea/strategy loop and lifecycle surfaces | Directive behavior | [Lifecycle overview][lifecycle] | 2026-09-09 |
| Strategy categories and Interview choices | Directive behavior | [Strategy index][strategies] and [Interview][interview] | 2026-09-09 |
| Current setup output and optional specification | Directive behavior | [Setup skill][setup] | 2026-09-09 |
| Observable story acceptance, evidence, and DAG decomposition | Directive behavior | [Decompose skill][decompose], [xBRIEF taxonomy][taxonomy], and [verification][verification] | 2026-09-09 |
| Vertical feature and tracer-bullet shape | Directive behavior | [Upstream glossary][upstream-glossary] and [slicing skill][gh-slice] | 2026-09-09 |
| Proposed lifecycle and current contract | Directive behavior | [Commands][commands] and [main][main] | 2026-09-09 |
| Fictional command-free boundary and accessible solution | 3Ci policy | [Project definition](../xbrief/PROJECT-DEFINITION.xbrief.json) ProjectRules and LabModel | 2026-09-09 |

This is an original paraphrase and fictional adaptation. The pinned sources retain legacy
command, vBRIEF, specification, dependency, and path wording; the [source baseline](../references/SOURCE-BASELINE.md)
and [Module 6 verification notes](../references/SOURCE-NOTES.md#module-6-verification)
record how the course resolves those disagreements.

## Continue

- Return to [Module 6](../curriculum/modules/06-creating-well-shaped-work.md).
- Record O6.1–O6.3 only after every exercise acceptance inspection passes.
- Module 7 is planned; return to the [course map](../curriculum/README.md) rather than
  inventing lifecycle practice.

## Author release check

- Every worked artifact maps to O6.1, O6.2, or O6.3 and to the original inspections.
- The solution exposes reasoning, valid alternatives, recovery, and a fresh-note retry.
- The proposed record remains schema 0.8 and grants no implementation authority.
- Static worksheet evidence is not presented as executable product proof.
- No instructor, repository mutation, command, or remote system is required.
- Source claims and disagreements match the Module 6 source record.

[lifecycle]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/docs/directive-lifecycle.md
[strategies]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/strategies/README.md
[interview]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/strategies/interview.md
[setup]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-setup/SKILL.md
[decompose]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-decompose/SKILL.md
[taxonomy]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/vbrief/vbrief.md
[verification]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/verification/verification.md
[upstream-glossary]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/glossary.md
[gh-slice]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/skills/deft-directive-gh-slice/SKILL.md
[commands]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/commands.md
[main]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/main.md
