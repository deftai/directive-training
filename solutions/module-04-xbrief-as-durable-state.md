# Explained solution — Module 4: xBRIEF as Durable State

Classify Northstar's records by role, lifecycle, and ownership before deciding what a new
session may do.

## Solution record

| Field | Value |
| --- | --- |
| Stable ID | `solution-module-04-xbrief-as-durable-state` |
| Solves | `module-04-xbrief-as-durable-state` |
| Outcomes covered | O4.1, O4.2, O4.3, O4.4 |
| Status | `learner-ready draft` |
| Last verified | 2026-09-07 |
| Directive baseline | `@deftai/directive@0.112.0`, engine `@deftai/directive-core@0.112.0`; see the [source baseline](../references/SOURCE-BASELINE.md) |
| Source exercise | [Module 4 artifact exercise](../curriculum/modules/04-xbrief-as-durable-state.md#exercise) |

## Before you use this solution

Spend 12–15 minutes on the exercise and try one hint at a time. Keep the original table,
lifecycle verdicts, resumption note, and authorization decisions for comparison.

This is a suggestion, not an access gate. You may read the solution
without an instructor, private message, review bot, or automation unlock.

If you opened it first, use the reasoning as a worked example. Close it and retry the
cards in a fresh scratch note. There is no repository or environment to reset.

## Result summary

A–E identify five distinct roles: project identity, specification, bounded scope, tactical
plan, and interruption checkpoint. C is the current normalization scope, but the live
instruction still decides whether this session implements or only reports. Neither a
checkpoint nor an old summary proves that tests passed.

K has a lifecycle mismatch. L and M are stale generated representations of C; inspect
their source and regenerate the views rather than changing copied status text. The
project definition's authored identity in A remains a different ownership class from
its generated registry in L.

## Outcome map

| Outcome | How this solution demonstrates it | Evidence |
| --- | --- | --- |
| O4.1 | Distinguishes all artifact roles and lifetimes | Fourteen-row classification table, especially A–E |
| O4.2 | Compares folder with scope `plan.status` and separates item status | Seven lifecycle verdicts |
| O4.3 | Separates scope, resume context, historical claims, live intent, and proof | Resumption note and two live-instruction decisions |
| O4.4 | Resolves stale views through their scope source | A/L comparison and L/M repair decisions |

## Reasoning

### 1. Establish the controlling facts

- The current public format is xBRIEF under `xbrief/`, with
  `xBRIEFInfo.version: "0.8"` for new writes.
- The scope's `plan.status` must match its lifecycle folder;
  an item's status is a separate level of state.
- The current contract is active scope plus the human's live
  instruction. Required passing gates remain separate readiness evidence.
- Scope records outlive sessions; plans describe present steps;
  continue checkpoints temporarily preserve a resume point.
- Completed scope records lifecycle closeout and its evidence
  and disposition. A completed status alone does not prove delivery; explicit non-delivery
  dispositions can close the lifecycle too. F's delivery is a provided scenario fact.
- Generated registry entries and Markdown views derive from
  declared sources. Authored project narratives do not become generated merely because
  they share a JSON file with the registry.
- This exercise uses only the provided fictional cards and a scratch note;
  no repository may change.

The pinned evidence for these statements is listed in [Sources](#sources).

### 2. Choose an approach

Read each path, then the field named by the card. Classify its purpose and lifetime before
testing lifecycle or authorization. Use `plan.status` from a scope for the lifecycle
comparison; use a source pointer or generated banner for ownership.

Reject the tempting shortcut “everything under `xbrief/` is equally authoritative.” That
would let E's temporary resume point or L's generated copy override C's scope record.
Also reject “chat never matters”: historical summaries and the human's live instruction
have different roles.

### 3. Predict the evidence

A passing answer preserves C's running state despite its pending item and the completed
claims in L/M/N. It accepts G's `draft` as a published `proposed/` convention, flags I as
blocked and K as inconsistent, and keeps the two live-instruction decisions different.

## Worked approach

### Step 1 — Classify all fourteen cards

These are applications of the release rules to the fictional facts.

| Card | Artifact role | Lifetime/ownership | Evidence field or source | What it can establish | What it cannot authorize |
| --- | --- | --- | --- | --- | --- |
| A | Project definition | Durable authored identity | Path and `plan.narratives.Overview` | Northstar's purpose and project-level running state | Implementation of every registered scope |
| B | Specification | Durable design source | Specification path, accepted design, `plan.status: approved` | Project-level input/output design | Starting an unactivated scope or ignoring live intent |
| C | Scope | Durable current work contract | Active path, `plan.status: running`, whitespace rejection acceptance | Normalization work and its acceptance boundary | Extra route-count work or mutation during a read-only instruction |
| D | Tactical plan | Session-level steps | `plan.xbrief.json`, `planRef` to C, ordered steps | The intended approach for C | Changing C's requirements or claiming a step succeeded |
| E | Continue checkpoint | Temporary recovery context | Continue path, `planRef`, completed/remaining/resume fields | What the prior session recorded and where to resume inspection | Claiming a test passed, broadening C, or bypassing current state checks |
| F | Completed scope | Durable delivery record | Completed path and `plan.status: completed` | Prior route-count scope and its recorded terminal state | Selecting or authorizing the next build |
| G | Proposed scope | Durable candidate work | Proposed path and `plan.status: draft` | An unaccepted export idea | Implementation before acceptance and activation |
| H | Pending scope | Durable accepted backlog | Pending path and `plan.status: pending` | Accepted duplicate-stop work awaiting activation | Beginning implementation simply because acceptance exists |
| I | Active blocked scope | Durable in-progress record | Active path, `plan.status: blocked`, blocker narrative | Fixture work is stalled for a stated reason | Treating blocked state as mutation-ready |
| J | Cancelled scope | Durable abandoned-work record | Cancelled path and `plan.status: cancelled` | The email proposal was abandoned | Resuming it without a governed new lifecycle decision |
| K | Inconsistent scope | Durable record with invalid folder/status pairing | Active path, scope `plan.status: pending`, failed preflight | A concrete readiness defect requiring named remediation | Implementation while the mismatch remains |
| L | Generated project scope registry entry | Regenerable projection within project definition | `plan.items` pointer to C | A navigation pointer, plus evidence that copied status is stale | Declaring C complete or fixing state by editing the copy |
| M | Generated roadmap | Regenerable Markdown projection | Generated banner and declared lifecycle source | A readable but stale view of C | Overriding C or becoming a direct lifecycle-edit surface |
| N | Historical chat summary | Conversation context, not maintained work state | Old summary with no test or lifecycle evidence | What an earlier summary claimed | Proving completion, selecting the next scope, or overriding current instruction |

**Observe:** A–E have five purposes even though xBRIEFs share a `plan` object. L is
generated even though it lives in JSON. This authored solution remains Markdown source
for the curriculum; its extension does not make it a generated view.

### Step 2 — Check seven lifecycle verdicts

| Card | Folder | Scope `plan.status` | Verdict and reason |
| --- | --- | --- | --- |
| C | `active/` | `running` | Consistent. A pending item records unfinished detail inside an active scope; it does not set scope state. |
| F | `completed/` | `completed` | Consistent terminal completion record. Historical standing does not grant future implementation authority. |
| G | `proposed/` | `draft` | Consistent candidate. The pinned convention permits both `draft` and `proposed` in this folder. |
| H | `pending/` | `pending` | Consistent accepted backlog. It still awaits activation. |
| I | `active/` | `blocked` | Consistent but blocked. It stays in `active/`; the blocker remains explicit. |
| J | `cancelled/` | `cancelled` | Consistent abandoned scope record. |
| K | `active/` | `pending` | Inconsistent. Scope state belongs with accepted pending work, and preflight reports the mismatch. |

For K, record the mismatch and follow its governed lifecycle remediation when authorized
in a real task. Do not manually move the file or change its status in this exercise.
Neither choosing a convenient folder nor ignoring the failed gate is valid recovery.

### Step 3 — Follow the generated views to C

L points to C. M declares lifecycle scopes as its source. C says `running`, and neither
card supplies evidence that C's state is wrong. The correct recovery proposal is:

1. Inspect C and confirm its current status and acceptance evidence.
2. Leave source state unchanged when correct. If a real source correction were needed,
   obtain the appropriate scope/lifecycle authority first.
3. Regenerate the project scope registry and roadmap from their declared sources.
4. Inspect both generated entries again; they must agree with C's running state.

This is a conceptual proposal, not an executed repair. Do not claim regeneration ran.
A's authored overview remains intact; refreshing registry entries does not replace project
identity with whatever the scope titles happen to say.

### Step 4 — Write the resumption note

One valid three-sentence note is:

> C is the active, running normalization scope and requires rejection of whitespace-only
> input; its pending item remains unfinished work. D gives the tactical steps and E records
> that a test was written but remains to be run, so the new session must inspect current
> state and obtain test evidence before claiming acceptance. F records completed route-count
> work and N is an unsupported historical summary; neither selects the next build or
> overrides C and the human's live instruction.

The note need not copy these words. It must distinguish a reported resume point from
verified product evidence.

### Step 5 — Apply the live instruction

| Instruction | Decision | Evidence and boundary |
| --- | --- | --- |
| 1: inspect and explain; do not implement | Report only. No implementation is authorized. | C remains active, but live intent is explicitly read-only. Explain L/M drift and K's mismatch without repairing them. |
| 2: implement normalization scope C; required gates passed | Implementation of C may proceed. | Active C plus live implementation intent establish authority; stated gate passes establish readiness. Implement whitespace-only rejection and the scoped work needed to prove it. Do not activate G/H, resume F/J, or repair unrelated I/K. |

The exercise itself remains command-free. Instruction 2 is a fictional authorization
case to classify, not a request for the learner to implement Northstar.

## Acceptance evidence

| Inspection from the exercise | Required result | Worked evidence | Outcome |
| --- | --- | --- | --- |
| A–E classification | Five roles with path and field evidence | Step 1 | O4.1 |
| C and F–K lifecycle verdicts | C/F/G/H/J consistent, I consistent but blocked, K inconsistent | Step 2 | O4.2 |
| Pending item versus scope status | C remains running; K has scope-level mismatch | C/K reasons in Step 2 | O4.2 |
| Resumption note | C remains current, D/E provide context, F/N do not grant future authority, test proof missing | Step 4 | O4.3 |
| Two live instructions | Report only versus bounded C implementation after gates | Step 5 | O4.3 |
| L/M recovery and A/L ownership | Inspect C and regenerate; preserve authored identity | Step 3 and A/L rows | O4.4 |

There is no terminal output to capture. Completion evidence consists of the learner's own
table, verdicts, note, and decisions passing these same inspections.

## Compare with your attempt

| Compare | Match means | Difference means | Next action |
| --- | --- | --- | --- |
| Artifact role | You located the right kind of state | A path or field was overgeneralized | Reclassify A–E by the question each answers |
| Lifecycle | You compared scope state with folder | An item status or synonym misled you | Revisit C, G, and K separately |
| Resumption note | You kept work, context, and proof distinct | A saved statement became an unverified success claim | Rewrite the claim with its exact evidence limit |
| Authorization | The live instruction bounds C | Active or historical state became permission by itself | Re-evaluate the two live instructions |
| Projection ownership | You followed copies to source | A generated entry became the editing target | Revisit A/L/M and name each source |

For each difference, keep one correction sentence: “I treated [card] as [old role]; its
path and [field] establish [correct role], so I will [bounded correction].”

## Valid alternatives

| Alternative | Why it also passes | Evidence required | When it fails |
| --- | --- | --- | --- |
| Call D session-durable instead of temporary | Steps are saved for the session, distinct from scope authority | `planRef`, tactical purpose, and no scope expansion | It treats D as the accepted scope itself |
| Call L a generated field within an authoritative artifact | Ownership is correctly resolved at field level | A's narratives and L's registry have separate sources | It labels all of `PROJECT-DEFINITION` disposable or all authored |
| Describe E as persisted recovery context | A stored checkpoint can survive an interruption without being permanent scope | Temporary/consumed lifetime and current-state verification | It claims checkpoints are never stored or cannot help resume |
| Use prose paragraphs instead of a wide table | Format is not the outcome | Every card has all six classification fields | An evidence field, authority limit, or card is omitted |

Reject any alternate that treats K as ready, says a test passed without evidence, or uses
direct edits to L/M as the durable fix.

## Expected failures and recovery

### File container is confused with artifact purpose

- **Symptom:** A, B, C, and D are all called tactical plans because they contain `plan`.
- **Cause:** Shared JSON structure was mistaken for one work role.
- **Confirm:** Compare each filename with the kind of content the card describes.
- **Recover:** Retain the old table and rewrite only A–E's role and purpose cells.
- **Retry:** All five roles are distinct and each cites a path plus a field.

### State is read from the wrong level

- **Symptom:** C is called pending, G invalid, or K active and ready.
- **Cause:** An item status, an assumed vocabulary, or the folder alone replaced scope state.
- **Confirm:** Write C's item status and scope `plan.status` separately; compare G against
  the published folder table; retain K's failed preflight evidence.
- **Recover:** Rebuild the seven lifecycle verdicts without changing the fictional cards.
- **Retry:** C and G are consistent; K is inconsistent; I remains explicitly blocked.

### A stored claim becomes proof or permission

- **Symptom:** E/N proves tests passed, F becomes next work, or Instruction 1 implements C.
- **Cause:** Storage was treated as sufficient authority and evidence.
- **Confirm:** Quote what E reports, F's completed status, and Instruction 1's limit.
- **Recover:** Rewrite the note with one sentence each for scope, context/proof, and
  historical claims; then decide both live-instruction cases again.
- **Retry:** No invented test result, no revived completed work, and Instruction 1 is report-only.

### Generated copies receive the repair

- **Symptom:** L/M is hand-edited to agree with a preferred story.
- **Cause:** Readable or tracked output was mistaken for source.
- **Confirm:** Follow the pointer/banner back to C and compare its status.
- **Recover:** Propose source inspection and regeneration, preserving correct source state.
- **Retry:** The proposed new registry/roadmap inspection would show C as running; A
  remains authored identity.

### When the baseline differs

This conceptual exercise requires no installed runtime. Record the version of any alternate
reference you used, reopen the pinned 0.112.0 sources, and retry the affected classifications.
Do not mix old schema examples or newer lifecycle behavior into this exercise. The taxonomy
contains legacy names and schema snippets; the release's main guidance supplies current
xBRIEF 0.8 authoring names. Pinned prose disagrees about the terminal failure destination;
this exercise makes no claim about failure-transition mechanics.

## Misconceptions exposed by this exercise

| Misconception | What the evidence shows | Source |
| --- | --- | --- |
| An xBRIEF always has the same durable authority | D and E have session/recovery purposes, while C carries scope | Artifact taxonomy and Continue-Here |
| Project running means every scope is active | A's project state and H's pending scope are distinct | Taxonomy — project definition and scope lifecycle |
| `draft` and `proposed` require separate folders | Both belong to the proposed convention | Taxonomy folder table and 0.8 status schema |
| Historical chat has the same role as live intent | N cannot authorize work; Instruction 1 constrains present action | main — xBRIEF Persistence |
| A generated registry cannot live inside a source artifact | A and L share a file but have different ownership | Project-definition regeneration contract |

## Self-assessment answers

1. **Specification, scope, and plan:** Specification describes project design; scope
   defines a bounded unit with acceptance and lifecycle; tactical plan describes present
   execution steps. The shared `plan` container does not erase these roles. B, C, and D
   supply the evidence.
2. **Lifecycle:** `draft` belongs in `proposed/`, `blocked` in `active/`, and `cancelled`
   in `cancelled/`. C's pending item is unfinished detail under a running scope. K's own
   `plan.status: pending` conflicts with its active folder, as its failed preflight confirms.
3. **Checkpoint:** E establishes the prior session's recorded resume point and scope
   reference. A new session verifies current project/scope state, live intent, applicable
   gates, and the actual test result before claiming completion.
4. **Live intent and historical chat:** Instruction 1 withholds implementation without
   erasing C's durable active state. N is an old summary with no present lifecycle or test
   proof; the author's confidence does not make it the current contract.
5. **Mixed ownership:** Project narratives such as A's Overview are authored identity;
   registry entries such as L derive from scopes. Inspect C, preserve its correct running
   state, regenerate L/M, and inspect agreement. Do not repair L alone.

## Retry plan

1. Preserve your first attempt.
2. Start a fresh scratch note for the failed outcome.
3. Retry its specific cards or decisions without copying the worked answer.
4. Apply the same exercise acceptance inspection.
5. Recheck all four outcomes before recording completion.

Improved wording alone is not evidence if the authority, lifecycle, or ownership error remains.

## Reset and cleanup

- Additional state: one personal scratch note with fictional content only.
- Cleanup action: no environment cleanup is required. Retain the note for comparison or
  discard it through your normal note-handling practice.
- Cleanup evidence: no repository, remote, credential, running process, or service changed.

The worked solution creates no additional file or fixture. Retry uses a fresh note, not a
repository reset.

## Sources

| Statement | Pinned source or policy | Verified date |
| --- | --- | --- |
| Five artifact roles and generated views | [Concepts — xBRIEF Is The Durable State][concepts] | 2026-09-07 |
| Current 0.8 format; current contract; completed boundary | [main — xBRIEF Persistence][main] | 2026-09-07 |
| Closeout and delivery evidence are distinct | [Lifecycle — Delivery integrity vs deploy / UAT][lifecycle] | 2026-09-07 |
| Scope/plan/checkpoint lifetimes, status convention, identity versus registry | [Artifact taxonomy — File Taxonomy, Coexistence, PROJECT-DEFINITION][taxonomy] | 2026-09-07 |
| Draft/proposed and approved/pending vocabulary | [xBRIEF 0.8 schema][schema] | 2026-09-07 |
| Folder/status consistency and generated registry/roadmap | [Commands — Scope xBRIEF Lifecycle and Generated Document Commands][commands] | 2026-09-07 |
| Checkpoint contents, scope reference, consumed-on-resume lifetime | [Continue-Here][continue] | 2026-09-07 |
| Fictional-only work and available solutions | [Project definition](../xbrief/PROJECT-DEFINITION.xbrief.json) ProjectRules and LabModel | 2026-09-07 |

This is an original paraphrase and fictional adaptation. Legacy taxonomy spelling is
normalized against the release's explicit main rule; no schema 0.6 example is used for new
authoring. See the [source baseline](../references/SOURCE-BASELINE.md) for release identity
and recorded disagreements.

## Continue

- Return to [Module 4](../curriculum/modules/04-xbrief-as-durable-state.md).
- Record O4.1–O4.4 demonstrated after every exercise acceptance row passes.
- Continue to [Module 5 — Sources versus Projections](../curriculum/modules/05-sources-versus-projections.md).

## Author release check

- Every card, lifecycle verdict, and assessed outcome has explained evidence.
- Recovery starts from each named misconception and returns to the original acceptance check.
- Valid alternatives preserve authority and source ownership.
- The solution requires no instructor action, repository mutation, shell, or external system.
- The source pin and disagreements match the module's source record.

[concepts]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/docs/CONCEPTS.md#xbrief-is-the-durable-state
[main]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/main.md#xbrief-persistence
[taxonomy]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/vbrief/vbrief.md
[schema]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/vbrief/schemas/xbrief-core-0.8.schema.json
[commands]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/commands.md
[continue]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/resilience/continue-here.md
[lifecycle]: https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/docs/directive-lifecycle.md
