# Explained Solution — Module 1: What Directive Is

Compare your classification evidence with a worked answer, then retry only the
outcomes that your evidence does not yet demonstrate.

## Solution record

| Field | Value |
| --- | --- |
| Stable ID | `solution-module-01-what-directive-is` |
| For module | [`module-01-what-directive-is`](../curriculum/modules/01-what-directive-is.md) |
| Outcomes covered | O1, O2, O3 |
| Status | `learner-ready draft` |
| Last content update | 2026-09-06 |
| Last verified | 2026-09-06 |
| Directive baseline | `@deftai/directive@0.111.0`, engine `@deftai/directive-core@0.111.0`; see the [source baseline](../references/SOURCE-BASELINE.md) |
| Source exercise | [Classify the Northstar stack](../curriculum/modules/01-what-directive-is.md#exercise-classify-the-northstar-stack) |

## Before you use this solution

Spend 12–15 minutes on the [exercise](../curriculum/modules/01-what-directive-is.md#exercise-classify-the-northstar-stack) before reading further. If you are stuck, use the module’s three progressive hints in order. Then compare your **reasoning and evidence**, not only your category codes.

> **[3Ci policy]** The solution is intentionally available without an instructor. A suggested first attempt is part of the learning method, not an access restriction.

## Result summary

The evidence-based classifications are A = `H`, B = `S`, C = `D`, D = `O`, E = `H + S + D`, and F = `D`. Comet has shared standards but lacks durable work state and deterministic gates; Aurora has state and a gate but lacks shared standards. The deciding method is always the component's job and operating boundary, not its name or use of the word “workflow.”

## Outcome map

| Outcome | How the solution demonstrates it | Evidence |
| --- | --- | --- |
| O1 | Explains all six category decisions and common wrong answers. | Part A classifications and rationales. |
| O2 | Inventories each Directive pillar independently. | Part B tables and self-assessment items 2–3. |
| O3 | Diagnoses missing capabilities and applies the runtime boundary. | Part B recommendations, Part C, and self-assessment items 4–5. |

## Part A — Classification cards

### Card A — Lumen Studio

**Answer: `H` — coding-agent host.**

Lumen supplies the place where the agent runs: an editor, conversation, file tools, terminal, and approval surface. The observation explicitly says it does not define the accepted backlog, so there is no evidence that Lumen owns durable repository work state.

Common wrong answers:

- **`D`:** File access and approval prompts do not make a tool a repository practice layer. Look for shared standards, durable work state, and gates that remain with the repository.
- **`O`:** Lumen runs a coding agent for an engineer; it does not coordinate agents as behavior inside the shipped Northstar application.

### Card B — MethodCards

**Answer: `S` — skill pack.**

MethodCards provides reusable review and debugging methods inside the host. The card rules out repository work records and executable checks, so it does not demonstrate the wider Directive practice-layer job.

Common wrong answers:

- **`H`:** A method loaded by a host is not the environment that runs the agent.
- **`D`:** A useful technique is only one part of repository practice. It does not establish durable state or deterministic gates.

### Card C — the Directive-configured Northstar repository

**Answer: `D` — Directive practice layer.**

The evidence names all three pillars: shared project guidance, durable xBRIEF `0.8` work records, and executable checks with a failing result. The package pin identifies the installed product, while the observations establish the job it performs.

Common wrong answers:

- **`S`:** Directive includes skills, but the described state and gates go beyond session methodology.
- **`H`:** Nothing in the card provides an agent UI or execution environment.
- **`H + D`:** The repository is configured for Directive, but the card does not name a host. Do not infer a component that is not in evidence.

### Card D — RouteCrew service

**Answer: `O` — application-agent orchestrator.**

RouteCrew coordinates classifier, planner, and responder agents while the shipped service handles requests. The operating boundary is application runtime, which is the decisive evidence.

Common wrong answers:

- **`D`:** Application-runtime coordination alone does not imply Directive. There is no evidence of repository standards, xBRIEF state, or delivery gates.
- **`H`:** The service routes application work among agents; it is not described as an engineer-facing coding environment.

### Card E — Jo’s combined environment

**Answer: `H + S + D`.**

- Lumen Studio is the host (`H`).
- MethodCards supplies task methods (`S`).
- The Directive-configured repository supplies shared practice, state, and gates (`D`).

There is no `O` because the card explicitly says the shipped application has no agent runtime. This card demonstrates that the categories can complement one another.

Common wrong answers:

- **Only `D`:** That ignores the separately named execution and methodology components.
- **`H + S + D + O`:** Do not add a category merely because the stack contains an agent. An orchestrator requires application-runtime evidence.

### Card F — Northstar repository delivery

**Answer: `D` — the Directive practice-layer job.**

The observations establish all three pillars: tracked shared guidance, durable active xBRIEF state, and required checks. The workflow governs one repository change through review, so its boundary is software-delivery work around the repository. It does not run as part of the simulator's behavior and is not an application-agent orchestrator.

A coding-agent host will execute the agent, but the card asks you to classify the **repository workflow**, not the unstated host underneath it. `D` is therefore the evidence-backed answer.

Common wrong answers:

- **`O`:** A coordinated workflow is not the test. Ask whether it serves live application requests or governs repository delivery.
- **`H`:** A delivery workflow is not itself the editor or CLI running the coding agent.
- **`S`:** The workflow may use skills, but the described job is repository-level work coordination under the practice layer.

## Part B — Pillar diagnosis

### Comet team

| Pillar | Finding | Evidence |
| --- | --- | --- |
| Shared standards | Present, though only minimally | `TEAM-RULES.md` is shared in the repository. |
| Durable work state | Missing | Work status exists only in private chats and will not reliably survive session or contributor changes. |
| Deterministic gates | Missing | Reviewers receive a reminder, but no executable surface returns failure or blocks progress. |

Likely failure: a new agent or teammate must reconstruct accepted work from incomplete chat history, and lint can be skipped without a visible red gate.

Corrective recommendation: record accepted work in structured repository state and configure an executable check that reports failure when required validation is not satisfied. A real adoption would use the Directive installation and lifecycle taught in later modules; this exercise only requires the conceptual diagnosis.

Common wrong-answer feedback:

- If you marked durable state present because `TEAM-RULES.md` is tracked, separate **standards** from **work state**. The file preserves a rule, not the status and acceptance of a specific work item.
- If you marked gates present because a reviewer checks the list, remember that human review can be valuable without being deterministic. The card provides no executable result.

### Aurora team

| Pillar | Finding | Evidence |
| --- | --- | --- |
| Shared standards | Missing | Coding conventions live in one engineer’s private prompt. |
| Durable work state | Present | Structured xBRIEF records persist in the repository. |
| Deterministic gates | Present | CI runs a command and fails on unmet test requirements. |

Likely failure: different engineers or hosts can apply conflicting coding conventions even though they agree on work status and tests.

Corrective recommendation: move the applicable team and project guidance to the repository’s shared, version-aware instruction surfaces so contributors can load the same standards.

Common wrong-answer feedback:

- If you marked standards present because one engineer has a detailed prompt, ask whether the next contributor can discover and load it from the shared project context.
- If you called CI a complete Directive installation, avoid inferring the whole product from two pillars. The exercise gives evidence for state and gates, not a complete installation history.

## Part C — Boundary explanation

A strong answer says:

> Card F governs a change and review in a repository, so its boundary is delivery practice. Card D coordinates agents while the shipped service handles a request, so its boundary is application runtime. The word “workflow” is not the classifier; the job and operating boundary are.

If your answer relied only on “Directive is Card F” or “RouteCrew is Card D,” rewrite it without product names. You should still be able to classify both from the observed jobs.

## Self-assessment key

### 1. Four distinct jobs — O1

A complete answer is: **A host runs the coding agent; a skill pack guides a task; Directive governs shared repository practice; an application-agent orchestrator coordinates agents inside the running application.** Equivalent wording is correct when all four jobs remain distinct.

Feedback:

- If “runs agents” appears for both host and orchestrator, add the boundary: engineer-facing coding environment versus shipped application runtime.
- If skill pack and Directive sound identical, add Directive’s durable state and deterministic gates.

### 2. Three pillars — O2

- **Shared standards:** “How should contributors and agents do the work?”
- **Durable work state:** “What is true about the project and the accepted work beyond this chat?”
- **Deterministic gates:** “What executable evidence allows or blocks the next step?”

The wording can vary, but the three questions must remain separate.

### 3. Deterministic gate — O2

**Answer: b.** It describes an executable evaluation, an observable failing status, and an enforced consequence. The other choices are prose, private guidance, or an unsupported assertion. They may help a team, but they are not deterministic gates.

### 4. Host change — O3

The agent UI and host-specific capabilities changed. The tracked xBRIEF scope and repository checks persisted. The **Directive practice layer** explains that repository-level continuity; the scenario does not prove that host-specific skills also carried over.

### 5. Live three-agent product — O1, O3

The present category is an **application-agent orchestrator**. It would be unsupported to conclude that the repository also has Directive, shared repository standards, xBRIEF state, or deterministic delivery gates. Application-runtime coordination provides no evidence about repository practice.

## Outcome rubric

You have demonstrated the module outcomes when all of these are true:

| Outcome | Evidence of mastery |
| --- | --- |
| O1 | You classify all four jobs without using names as the reason and score at least five of six Part A cards correctly. |
| O2 | You name all three pillars, explain the distinct question each answers, and identify why self-assessment item 3 is the only gate. |
| O3 | You find every missing pillar in Part B and distinguish repository delivery from application runtime in Parts C and self-assessment items 4–5. |

## Recovery path

If you have not met the rubric:

1. Mark only the items you missed; do not restart the whole module.
2. For a category miss, write four columns—execution environment, task method, repository practice, application runtime—and place the observed evidence in exactly one or more columns.
3. For a pillar miss, inventory standards, work state, and executable gates separately. Never use one artifact as evidence for a different pillar without explaining how it performs both jobs.
4. Re-answer the missed item without product names.
5. Compare again. If your rationale now names the job, boundary, and observed evidence, the recovery is complete.

If the same distinction remains unclear after two attempts, reread the module’s [mental model](../curriculum/modules/01-what-directive-is.md#mental-model) and the pinned official [What Directive is not](https://github.com/deftai/directive/blob/750b79f6ed343393e42142f419dfb0591cca5a21/docs/CATEGORY.md#what-directive-is-not) section, then try one new example from your own tooling.

## Source note

The reasoning in this solution uses the same pinned official source headings listed in the module’s [Official sources](../curriculum/modules/01-what-directive-is.md#official-sources). It adds no new Directive behavior. The scenario names and organizations are fictional.

## Navigation

- **Back to module:** [Module 1 — What Directive Is](../curriculum/modules/01-what-directive-is.md)
- **Next:** [Module 2 — Installation and Project Anatomy](../curriculum/modules/02-installation-and-anatomy.md)
- **Course home:** [3Ci Directive Training](../README.md)
