# Explained solution — Module 3: Authority and Context

This solution resolves the ten Northstar conflict cards by classifying each statement before
applying behavior specificity, rule strength, authorization, or operator escalation.

## Solution record

| Field | Value |
| --- | --- |
| Stable ID | `solution-module-03-authority-and-context` |
| Solves | `module-03-authority-and-context` |
| Outcomes covered | O3.1, O3.2, O3.3, O3.4 |
| Status | `learner-ready draft` |
| Last verified | 2026-09-07 |
| Directive baseline | `@deftai/directive@0.119.2`, engine `@deftai/directive-core@0.119.2`; see the [source baseline](../references/SOURCE-BASELINE.md) |
| Source exercise | [Module 3 conflict exercise](../curriculum/modules/03-authority-and-context.md#exercise) |

## Before you use this solution

Spend 12–15 minutes on the exercise and use its three hints first. Keep your original table
so you can compare the reason for each decision rather than copying the final words.

This is not an access gate. The solution is available without an instructor,
private message, review bot, credential, or automation unlock.

If you opened it first, read the mental model and result summary, close the solution, and
retry all ten cards in a fresh scratch note. The exercise is conceptual and creates no
repository or environment state.

## Result summary

The ten cards do not fit a single authority ladder. Cards A and B resolve behavior-source
specificity; D and I follow deterministic evidence; C, D, and E test the conjunction of
active scope and live implementation intent; F tests lazy loading; G keeps a product
requirement and behavior rule together; and H and J leave material choices for the operator.

The valid result cites what controls each decision. It never treats a completed scope as
future authority, makes a failing gate optional, or invents a requirement to avoid asking a
focused question.

## Outcome map

| Outcome | How this solution demonstrates it | Evidence |
| --- | --- | --- |
| O3.1 | Classifies behavior, requirement, authorization, and evidence before resolving cards | Statement-type column in the worked table |
| O3.2 | Uses project-over-Defaults, Personal-over-general, and deterministic-over-prose on separate axes | Decisions for A, B, and I |
| O3.3 | Requires active scope plus live implementation intent for authority, then evaluates passing gates separately for mutation readiness | Decisions for C, D, and E |
| O3.4 | Loads only relevant context and asks bounded questions for scope/product ambiguity | Decisions for F, H, and J |

## Reasoning

### 1. Establish the controlling facts

- `USER.md Personal` is the highest-precedence personal behavior
  source. `PROJECT-DEFINITION` overrides `USER.md Defaults` for project-scoped choices.
- Deterministic evidence is stronger than Taskfile, xBRIEF policy,
  RFC2119 instruction, or prose about the same gate-controlled action.
- Product requirements and behavior rules answer different
  questions and normally both apply.
- Implementation authority requires an active xBRIEF plus live
  implementation intent. Required gate passes separately decide whether mutation may proceed
  now. A completed xBRIEF supplies historical evidence only.
- Lazy loading begins with orientation sources and adds only the
  language, tool, strategy, or skill guidance needed for the present task.
- Scope expansion and unresolved material
  product choices go back to the operator; agents do not guess.

### 2. Choose an approach

For each card:

1. Split it into individual statements.
2. Mark each statement `B`, `R`, `A`, or `E`.
3. For behavior statements, apply source specificity and then enforcement strength.
4. For product work, preserve the active accepted requirement.
5. Test present mutation authority independently.
6. Name only the extra context needed for the next decision.
7. Ask the operator if the residue changes scope, safety, authorization, or observable product
   behavior.

The rejected approach is to place every file in one list and let the “highest” file erase all
lower statements. That would incorrectly let behavior guidance erase product acceptance,
let a live request erase a failed gate, or let project defaults override Personal policy.

### 3. Predict the evidence

A successful table should show:

- A chooses npm and B preserves the Personal ISO date format for different specificity reasons.
- C performs no mutation; D performs the gate remediation before any code; E selects new
  active work rather than reusing completed work.
- F names a small review/scope context set.
- G retains both the exit-code requirement and its test rule.
- H and J contain focused questions rather than invented answers.
- I follows the exit-1 result regardless of optimistic prose.

## Worked approach

### Step 1 — Classify and resolve every card

| Card | Statement type | Applied axis/category | Controlling source or evidence | Decision | Additional context | Operator needed? |
| --- | --- | --- | --- | --- | --- | --- |
| A | Behavior choice | Behavior-source specificity | `PROJECT-DEFINITION` overrides `USER.md Defaults` for a project-scoped package manager | Use npm for Northstar | None beyond the two cited sources | No |
| B | Behavior formatting rule | Behavior-source specificity | `USER.md Personal` is more specific than the general framework example | Record evidence dates as ISO 8601, such as `2026-09-07` | None | No |
| C | Product requirement plus authorization | Implementation authorization | Active xBRIEF supplies accepted work; live instruction explicitly withholds implementation | Summarize only; do not edit | Active scope and the requested review guidance | No |
| D | Product requirement, authorization, and evidence | Gate readiness after authority | Active scope plus live implement intent exist, but deterministic preflight exited 1 | Follow the stated remediation and rerun the same preflight; write no code until it passes | Preflight contract and its one remediation | No, unless remediation itself needs new authority |
| E | Historical requirement and vague live intent | Lifecycle authority | Completed xBRIEF has zero authority over what to build next; no active scope exists | Do not implement the old improvement. Use the authorized work-selection and lifecycle path to obtain an active contract | Work-selection/lifecycle guidance | Not yet. Inspect authorized work selection first. If it yields no approved choice: “Which proposed scope should be approved and activated for this implementation request?” |
| F | Context-selection behavior | Lazy loading | Lazy-loading contract | Read orientation sources already required, the active/proposed scope being reviewed, and applicable review guidance; defer TypeScript, GitHub, deployment, and swarm material | Only scope/review context | No |
| G | Product requirement plus behavior rule | Statement classification | Active acceptance controls observable exit 2; coding/testing rule controls method | Keep both: the implementation must return exit 2 and evidence must test it. The card alone does not authorize editing | Language/testing guidance only when implementation becomes authorized | No conflict; separate authorization may still be needed |
| H | Product requirement plus scope/authorization boundary | Scope authority | Active file scope permits only the named source and test; live request proposes broader parser work | Stop before parser edits and request a scope decision | Scope-provenance/file-scope guidance | Yes: “Should the active scope be amended to include the parser and its acceptance impact, or should I keep this change to `src/stop-code.js` and its test?” |
| I | Prose claim plus deterministic evidence | Enforcement strength | Required story-ready gate exited 1 | Treat the branch as not story-ready; follow remediation and rerun the gate | Story-ready help/contract only | No, unless remediation demands a material scope choice |
| J | Two incompatible product requirements | Product ambiguity | Neither accepted requirement is shown as later or controlling | Preserve both facts and make no format choice | The source records and any decision log that could establish chronology | Yes: “For the same input, should the accepted output be format A or format B, and may I update the superseded acceptance clause?” |

### Step 2 — State the two-axis model

A passing three-sentence explanation is:

> First classify a statement as behavior, product requirement, present authorization, or
> deterministic evidence. Resolve behavior-source specificity—`USER.md Personal`, project
> definition, `USER.md Defaults`, then applicable task/framework guidance—separately from
> enforcement strength, where a deterministic result outranks weaker prose about the same
> action. Product authority still requires its accepted active scope plus live implementation
> intent; passing required gates separately establishes implementation-mutation readiness;
> unresolved scope or product choices return to the operator.

### Step 3 — Verify the escalation questions

The required questions are bounded:

- **E, conditionally:** inspect the authorized ordered plan or ranked work-selection surface
  first. If it supplies no approved choice, ask which proposed scope should be approved and
  activated. Do not ask before using the deterministic selection source.

- **H:** choose between an explicit scope amendment for parser work and keeping the current
  implementation inside the approved two-file boundary. The question names the downstream
  acceptance impact.
- **J:** choose the observable output format and authorize correction of the superseded
  acceptance clause. The question does not ask the operator to re-explain the whole project.

Card E may also require operator input when the normal ordered plan or ranked work-selection
surface does not identify an already-approved candidate. Its question is about selecting and
activating new work, not reviving the completed record.

## Acceptance evidence

| Inspection | Required result | Relevant evidence | Outcome |
| --- | --- | --- | --- |
| Statement-type column | All cards classified; G has both requirement and behavior | Worked table | O3.1 |
| A, B, and I decisions | npm; ISO date Personal rule; obey exit 1 | Source/evidence citations | O3.2 |
| C, D, and E decisions | read-only; remediate gate; no completed-scope reuse | Explicit authority analysis | O3.3 |
| F context | Scope/review only; unrelated deep guidance deferred | Additional-context cell | O3.4 |
| H and J questions | Small unresolved choice plus consequence | Exact questions | O3.4 |
| Three-sentence model | Separate category, specificity, strength, and authorization | Step 2 | O3.1–O3.3 |

Wording may differ. The evidence is insufficient if a row merely says “higher priority” or
if it reaches the right action for the wrong authority reason.

## Compare with your attempt

| Compare | Match means | Difference means | Next action |
| --- | --- | --- | --- |
| Statement type | You resolved the correct kind of authority | A category may have been erased | Split the card into separate statements |
| Controlling source | Your reason is inspectable | “Higher” may hide a wrong axis | Name the exact section, active scope, or gate result |
| Authorization | Active scope, live intent, and gates remain distinct | A durable record or request may have been treated as sufficient alone | Re-evaluate C–E |
| Lazy context | Every loaded source answers a named question | Context was bulk-loaded or a needed contract was omitted | Re-evaluate F with one decision sentence |
| Escalation | The question isolates a material choice | The agent either guessed or asked too broadly | Rewrite H/J as a two-path decision |

Write one sentence for each difference: “My decision differed because I treated [statement]
as [old type]; the correct type/source is [new result].” Then retry only that row.

## Valid alternatives

| Alternative | Why it also passes | Evidence required | When it fails |
| --- | --- | --- | --- |
| Mark D as “authorized but not mutation-ready” | Failed required preflight blocks mutation without removing the active scope or live intent | Remediation and required rerun are explicit | It implies the gate failure removed implementation authority |
| List the core skill rather than a generic review contract for F | It may be the smallest source that defines the needed orientation/authority model | State the exact question it answers | It expands into unrelated language/deploy/swarm files |
| Escalate E after authorized work selection yields no approved choice | “Whatever is next” remains materially ambiguous only after the deterministic selection surface is exhausted | State that completed scope is not used and name the missing active contract | It skips an already-defined authorized ordered plan without inspecting it |
| Phrase H/J as open text rather than two choices | The operator can still resolve the exact material ambiguity | Both controlling facts and impact are present | It asks a vague “what should I do?” or silently recommends scope expansion |

An alternative is not valid when it changes a gate, promotes a Personal rule into product
behavior, treats `USER.md Defaults` as stronger than project policy, or supplies its own
product decision.

## Expected failures and recovery

### A total hierarchy erases statement types

- **Symptom:** every decision cites only whichever file was placed first.
- **Cause:** requirements, behavior, authorization, and evidence were ranked as if they were
  competing instances of one kind of rule.
- **Confirm:** find a row with more than one statement type, such as G.
- **Recover:** begin a fresh table and fill only the statement-type column for all ten cards.
- **Retry:** resolve A, G, and I; all three should use different reasoning paths.

### Active scope is mistaken for present permission

- **Symptom:** C implements or E revives completed work.
- **Cause:** durable work state was treated as the entire authorization contract.
- **Confirm:** quote the live instruction and lifecycle state separately.
- **Recover:** write `authority = active + live intent`; then add `passing gates` as the
  separate mutation-readiness check above a fresh authorization column.
- **Retry:** C is read-only, D waits for a gate pass, and E obtains new active work.

### Lazy loading becomes bulk reading

- **Symptom:** F loads every available language, platform, release, and swarm file.
- **Cause:** no decision question bounded the context search.
- **Confirm:** ask what present decision each file answers.
- **Recover:** retain only orientation, the scope under review, and applicable review guidance.
- **Retry:** list every deferred source and the trigger that would make it relevant later.

### When the baseline differs

1. Record the course pin and the newer project's installed Directive version.
2. Re-open the matching release's core skill, Concepts rule-strength section, main xBRIEF
   authority statement, and session-routing contract.
3. Keep this exercise on 0.119.2 or stop and report the version mismatch.
4. Do not silently combine hierarchies from different releases.

## Misconceptions exposed by this exercise

| Misconception | What the evidence shows | Source |
| --- | --- | --- |
| One file-order list resolves everything | Statement classification and two independent authority axes are required | Concepts and core skill |
| `USER.md` is one undifferentiated level | Personal always wins for personal behavior; Defaults are project-overridable fallbacks | Core skill Rule Precedence |
| Passing preflight grants scope | A pass supplies gate evidence only; active scope and live intent still bound action | Commands intent/session contracts |
| An active scope alone authorizes implementation | C remains read-only because live intent explicitly withholds mutation | main xBRIEF persistence rule |
| Completed scope is queued future work | E must use current work selection and activation | main xBRIEF persistence rule |
| More context is always safer | Irrelevant context increases conflict and drift without answering the current question | Concepts Lazy Loading |

## Retry plan

1. Keep the original table as comparison evidence.
2. Start a fresh scratch note; no repository reset is needed.
3. Retry only the unmet outcome: classification, two-axis resolution, authorization, or lazy
   context/escalation.
4. Apply the corresponding inspection row.
5. Re-check all ten cards and the three-sentence model.

A successful retry changes the cited reasoning, not merely the final action word.

## Reset and cleanup

This is a command-free exercise.

- Additional state: a personal scratch note containing fictional statements only.
- Cleanup action: none required. Retain the first attempt for comparison or discard it under
  your normal note-handling policy.
- Cleanup evidence: no repository, remote, credential, process, service, or external system
  was created or changed.

Never copy the actual contents of a shared `USER.md` into the scratch note.

## Sources

| Statement | Pinned source or policy | Verified date |
| --- | --- | --- |
| Personal/project/Defaults precedence and lazy loading | [Core skill — `Core Principle: Rule Precedence` and `File Reading Strategy (Lazy Loading)`](https://github.com/deftai/directive/blob/9038503ffac65e6d48e5ba34758c4e8e7077aba3/SKILL.md) | 2026-09-07 |
| Deterministic enforcement order | [Concepts — `Rule Strength` and `Lazy Loading And Modularity`](https://github.com/deftai/directive/blob/9038503ffac65e6d48e5ba34758c4e8e7077aba3/docs/CONCEPTS.md) | 2026-09-07 |
| Active scope plus live intent; completed-scope boundary | [main.md — xBRIEF Persistence](https://github.com/deftai/directive/blob/9038503ffac65e6d48e5ba34758c4e8e7077aba3/main.md#xbrief-persistence) | 2026-09-07 |
| Session posture and implementation intent | [Commands — `Session routing (#2176)` and `Scope xBRIEF Lifecycle`](https://github.com/deftai/directive/blob/9038503ffac65e6d48e5ba34758c4e8e7077aba3/content/commands.md) | 2026-09-07 |
| Bounded operator escalation and no shared USER.md copying | `xbrief/PROJECT-DEFINITION.xbrief.json` ProjectRules and [Module 3](../curriculum/modules/03-authority-and-context.md) | 2026-09-07 |

This solution is an original paraphrase/adaptation. See the complete
[source baseline](../references/SOURCE-BASELINE.md).

## Continue

- Return to [Module 3](../curriculum/modules/03-authority-and-context.md).
- Mark O3.1–O3.4 demonstrated only after the exercise acceptance checks pass.
- Continue to [Module 4 — xBRIEF as Durable State](../curriculum/modules/04-xbrief-as-durable-state.md).
