# Module 3 — Authority and Context

Resolve conflicting guidance without flattening product requirements, behavior rules,
authorization, and deterministic evidence into one misleading file-order list.

## Module record

| Field | Value |
| --- | --- |
| Stable ID | `module-03-authority-and-context` |
| Status | `learner-ready draft` |
| Last content update | 2026-09-07 |
| Last verified | 2026-09-07 |
| Directive baseline | `@deftai/directive@0.119.5`, engine `@deftai/directive-core@0.119.5`; see the [source baseline](../../references/SOURCE-BASELINE.md) |
| Estimated duration | 45 minutes |
| Prerequisites | Complete [Module 2](02-installation-and-anatomy.md); understand project versus managed files and xBRIEF as durable work state |

Suggested pacing: 5 minutes for the starting check, 18 minutes for the lesson, 15 minutes
for the exercise, and 7 minutes for self-assessment and solution comparison.

## Learning outcomes

By the end of this module, you can:

- **O3.1 — Classify the statement.** Distinguish a behavior rule, product requirement,
  implementation authorization, and observed gate evidence before resolving a conflict.
- **O3.2 — Resolve authority on two axes.** Apply behavior-source specificity separately
  from deterministic rule strength, including `USER.md Personal`, `PROJECT-DEFINITION`,
  `USER.md Defaults`, task-specific guidance, and framework defaults.
- **O3.3 — Verify implementation authority.** Require both an active xBRIEF and live
  implementation intent, and stop when a deterministic gate denies the next mutation.
- **O3.4 — Load context lazily.** Select the smallest relevant language, tool, strategy, or
  skill source and ask the operator when a material ambiguity remains.

## Starting-state check

In a scratch note, label each statement with one of four codes:

- `B` — behavior rule: how work must or should be performed;
- `R` — product requirement: what the product or deliverable must do;
- `A` — authorization: whether this action is allowed now;
- `E` — evidence: an observed result from a deterministic surface.

| Statement | Your code |
| --- | --- |
| “The accepted scope requires the fictional CLI to return exit 2 for malformed input.” |  |
| “Do not place credentials in evidence.” |  |
| “Implement the approved active scope now.” |  |
| “Preflight exited 1 because the scope is proposed.” |  |

**Pass:** You classify the statements as `R`, `B`, `A`, and `E` in that order, even if the
rest of the hierarchy is not yet familiar.

**Recovery:** Re-read the four definitions and ask: does the statement define the product,
govern the method, grant present action, or report an observation? This module and exercise
are command-free. Use a personal scratch note and do not edit any repository.

> Never copy a shared `USER.md` into a training artifact. You may name the
> controlling section and paraphrase the applicable rule, but personal or organizational
> content stays at its resolved location.

## Why this matters

Many apparent conflicts are category mistakes. “The API must return JSON” and “do not log
credentials” can both apply because one defines product behavior and the other constrains how
the work is performed. An active scope can say what is accepted without authorizing a
mutation during a read-only request. A friendly sentence saying “continue” cannot turn a
failed deterministic preflight into a pass.

Agents that flatten every source into one precedence list either ignore real requirements or
invent authority. A two-axis model keeps the questions separate: what kind of statement is
this, which source governs that kind of statement, what does the gate say, and is the action
authorized now?

## Terminology

| Term | Working definition |
| --- | --- |
| **Behavior rule** | A constraint on how an agent or engineer performs work, such as branch, safety, testing, or communication rules. |
| **Product requirement** | An observable property of the project or accepted scope: what must exist or happen. |
| **Implementation authorization** | Present permission to mutate for a bounded scope. In current Directive work, it requires an active scope and live implementation intent. |
| **Deterministic evidence** | A pass/fail result produced by a command, hook, test, or policy gate from declared state. |
| **Personal preference** | A rule in the `USER.md Personal` section resolved for the current session; that resolved source is the highest-precedence behavior preference. |
| **Project definition** | `xbrief/PROJECT-DEFINITION.xbrief.json`, the durable source for project identity, policy, and project-scoped defaults. |
| **User default** | A fallback in `USER.md Defaults` used only when the project does not make the project-scoped choice. |
| **Task-specific guidance** | A language, tool, strategy, skill, or workflow contract loaded because the current task triggers it. It applies inside stronger personal, project, and deterministic boundaries. |
| **Framework default** | General behavior from `main.md` or another broad Directive source used when no more specific controlling rule applies. |
| **Lazy loading** | Reading the orientation sources first, then only the task-relevant guidance needed for the next decision. |
| **Material ambiguity** | An unresolved choice whose answer would change approved scope, safety, authorization, or observable behavior. It requires a bounded operator question. |

## Mental model

Use four questions in order:

1. **Classify:** is this a behavior rule, product requirement, authorization statement, or
   observed evidence?
2. **Resolve:** for behavior, which source is more specific, and which enforcement surface is
   stronger? For requirements, what is the approved active contract?
3. **Authorize:** do both the active xBRIEF and the live instruction authorize this mutation?
4. **Load:** what is the smallest additional source needed to act safely? If the result is
   still materially ambiguous, ask the operator.

### Axis 1: behavior-source specificity

For behavior preferences and project-scoped choices, use this
specificity order:

```text
USER.md Personal
  → PROJECT-DEFINITION
  → USER.md Defaults
  → applicable language guidance
  → applicable tool or task guidance
  → main.md framework defaults
```

`USER.md Personal` always wins for personal/custom behavior. The project definition overrides
`USER.md Defaults` for project-scoped settings such as language, package manager, coverage,
or strategy. Task-specific guidance is loaded only when its trigger applies and cannot
broaden scope or defeat stronger safety policy.

This is not a universal order for every sentence. An approved scope xBRIEF carries accepted
requirements; an active/running scope is the current contract when paired with live intent.
It should not be treated as a weak behavior suggestion merely because a broad hierarchy
diagram lists it late.

### Axis 2: enforcement strength

When two behavior surfaces speak to the same action, Directive's
rule-strength order is:

```text
deterministic check → Taskfile target → xBRIEF policy/lifecycle metadata → RFC2119 instruction → prose
```

A failing gate is not “just another opinion.” Fix the state or follow its named remediation;
do not use weaker prose to wave it through. Conversely, a passing gate proves only the
contract that gate checks. It does not grant extra scope or make a product requirement true.

### Authorization is a conjunction

Current implementation authority is:

```text
implementation authority = active xBRIEF + live implementation intent
implementation mutation may proceed now = implementation authority + passing required gates
```

- An active xBRIEF without a live implement/build instruction is durable scope, not present
  permission to implement the scoped product change.
- A live “implement” instruction without an approved active scope does not supply the missing
  contract.
- A completed xBRIEF is evidence of what was delivered, with zero authority over what to
  build next.
- A failed preflight blocks the next implementation mutation even when implementation
  authority exists. The gate constrains readiness; it is not a third source of
  implementation intent.

### Model limit

The model does not automatically resolve two equally authoritative product choices, a
requirement that conflicts with a non-negotiable safety rule, or a request that expands the
active scope. Those are material ambiguities. Preserve the facts and ask the operator instead
of inventing a tie-breaker.

## Guided explanation

### 1. Resolve USER.md rather than copying it

Session orientation resolves the applicable `USER.md` and reports
its location. The resolved path can come from an override, workspace configuration, or the
platform's user configuration. Read its `Personal` and `Defaults` sections in place. Do not
manufacture a repository copy: that would create a stale duplicate and could distribute
personal policy.

When a Personal rule conflicts with a project behavior choice, Personal wins. When only a
Defaults value conflicts with a project-scoped value, the project definition wins.

### 2. Keep requirements and behavior simultaneously

Suppose an active scope requires the fictional CLI to return a structured error and project
guidance requires tests before implementation. There is no precedence conflict: the first is
the product outcome; the second is the delivery method. The valid plan satisfies both.

If the requirement itself would violate a non-negotiable safety constraint, do not silently
drop either statement. Identify the incompatible facts and ask the operator to change or
cancel the requirement. Use a policy override only when that policy explicitly defines a
governed override path.

### 3. Let deterministic state remain external to persuasion

A preflight exit 1 is observed evidence. A prose claim such as “the scope looks active” does
not override it. Follow the gate's remediation, rerun the same gate, and retain the new exit.
This protects the process from an agent reasoning itself around the control.

### 4. Treat task guidance as scoped context

A build skill is relevant to implementation. GitHub guidance is relevant when using GitHub.
TypeScript guidance is relevant when the accepted work touches TypeScript. A Markdown-only
authority exercise does not need deployment, swarm, release, Python, or database material.

Write one sentence before loading a deep source: “I need this file to
decide [named question].” If you cannot complete the sentence, the file is probably not yet
needed.

### 5. Ask only after narrowing the ambiguity

“What should I do?” is too broad when the sources already answer most of the question. A
useful escalation states:

- the two controlling facts and their sources;
- the deterministic result, if any;
- the smallest choice that remains;
- how each option changes scope, safety, or product behavior.

That gives the operator a real decision without making them reconstruct the repository.

## Walkthrough

### Goal

Resolve a package-manager conflict and an implementation request for the fictional Northstar
project.

### Safe setup

Use only this page and a scratch note. Do not read or change a live repository.

### Actions and observations

Northstar provides these facts:

- `USER.md Defaults`: “Prefer pnpm for projects that do not choose a package manager.”
- `PROJECT-DEFINITION`: “npm is the primary package manager.”
- Active scope: “Add a `normalizeStopCode` behavior with an observable test.”
- Live instruction: “Review the scope and explain whether it is ready; do not implement.”
- Preflight evidence: exit 0.

Resolution:

1. The package-manager statements are project-scoped behavior choices. Project definition
   overrides `USER.md Defaults`, so use npm.
2. The active scope is an accepted product/work contract.
3. The live instruction is read-only. Even though the scope is active and preflight passes,
   implementation intent is absent; do not edit.
4. For this review, load the active scope and relevant preflight guidance. Do not load the
   TypeScript or swarm guidance because no implementation or parallel allocation is asked.

Checkpoint: every conclusion cites a source and a category. No step says simply “the lower
file loses.”

## Exercise

### Fictional scenario

The Northstar Route Checker team is considering a small code change. You receive ten cards.
Create a decision table with these columns:

```text
Card | Statement type | Applied axis/category | Controlling source/evidence | Decision | Additional context | Operator needed?
```

### Conflict cards

| Card | Provided state |
| --- | --- |
| A | `USER.md Defaults` prefers pnpm. `PROJECT-DEFINITION` names npm as the project's primary package manager. |
| B | `USER.md Personal` says evidence dates use ISO 8601 (`YYYY-MM-DD`). A general framework example uses a spelled-out month. |
| C | An active xBRIEF requires `normalizeStopCode` to reject whitespace-only input. The live instruction says, “Summarize this scope; do not implement.” |
| D | The same active xBRIEF exists and the live instruction now says, “Implement it,” but `xbrief:preflight` exits 1 with a stated remediation. |
| E | A completed xBRIEF describes a different normalization improvement. The live instruction says, “Build whatever is next.” No active scope identifies that improvement. |
| F | A Markdown-only review asks whether a scope is coherent. Available guidance includes Markdown, TypeScript, GitHub, deployment, swarm, and review skills. |
| G | The active requirement says the fictional CLI returns exit 2 for malformed input. A coding rule says errors require tests. |
| H | The active scope permits only `src/stop-code.js` and its test. The operator asks to also replace the CLI parser, which is outside the declared file scope. |
| I | Project prose says a branch “appears ready,” but the required deterministic story-ready gate exits 1. |
| J | Two approved product requirements prescribe incompatible output formats for the same input, and no later decision or acceptance clause resolves them. |

### Your task

1. Classify every card as behavior rule, product requirement, authorization, evidence, or a
   combination.
2. Name the controlling source or evidence; do not write only “higher priority.”
3. Name the authority axis or statement category that resolves the row.
4. Decide the next action without inventing scope or changing a gate.
5. Name the smallest additional context, if any, that lazy loading requires.
6. Mark cards that require a focused operator decision.

### Constraints

- Use only fictional facts on this page.
- Keep behavior-source specificity separate from deterministic rule strength.
- Preserve active scope plus live implementation intent as distinct requirements.
- Do not treat a completed xBRIEF as future authorization.
- Do not assume product requirements can override safety or that behavior guidance can erase
  an accepted product outcome.
- Do not edit a repository, contact an instructor, or use a review bot.

### Evidence to keep

Keep the ten-row decision table and a three-sentence explanation of the two-axis model. For
every “operator needed” row, include the exact bounded question you would ask.

### Exercise acceptance

| Outcome | Observable condition | Inspection |
| --- | --- | --- |
| O3.1 | All cards identify statement type; G explicitly keeps requirement and behavior rule together. | No row relies on file order before classification. |
| O3.2 | A resolves to project npm; B preserves the Personal ISO date rule; I follows the deterministic failure. | Each decision cites both source and axis. |
| O3.3 | C remains read-only; D stops at preflight remediation; E rejects completed-scope authority. | Active scope, live intent, and gate state are all represented. |
| O3.4 | F loads only review/scope context; H and J ask focused operator questions. | No row bulk-loads unrelated guidance or invents a product choice. |

## Completion evidence

| Evidence | Required result | Outcomes |
| --- | --- | --- |
| Ten-row decision table | Every row has type, axis/category, source/evidence, decision, context, and escalation answer | O3.1–O3.4 |
| Two-axis explanation | Separates behavior specificity from enforcement strength | O3.2 |
| Authorization explanation | States active scope plus live intent as authority, then treats required passing gates as separate mutation-readiness evidence | O3.3 |
| Focused questions | H and J name the unresolved choice and consequence | O3.4 |

You are ready to continue when every row meets the exercise acceptance conditions. No
command output or repository mutation is required.

## Progressive hints

Open one hint at a time.

<details>
<summary>Hint 1 — classify before ranking</summary>

Requirements say what to build; behavior rules constrain how; live instructions grant or
withhold current action; gate output is evidence. Some cards contain more than one type.

</details>

<details>
<summary>Hint 2 — use the two axes</summary>

For A and B, compare behavior-source specificity. For D and I, use deterministic strength.
For C, D, and E, test the active-scope-plus-live-intent conjunction.

</details>

<details>
<summary>Hint 3 — find the two escalations</summary>

One request expands the declared file scope; another leaves two equally accepted product
formats incompatible. Ask the operator only about the smallest unresolved choice. Card F
requires less reading, not more authority.

</details>

## Expected failures and recovery

| Difficulty | Mechanism | Recovery |
| --- | --- | --- |
| You rank every file before classifying statements. | A total hierarchy mixes requirements with behavior and evidence. | Add the statement-type column first; resolve each category independently. |
| You treat project definition as overriding `USER.md Personal`. | You applied the Defaults rule to Personal policy. | Separate Personal from Defaults; Personal wins for custom behavior. |
| You implement Card C because the scope is active. | You omitted live implementation intent. | Quote the read-only instruction and record “no mutation authorized.” |
| You implement Card D because intent is explicit. | You treated prose authorization as stronger than a failed gate. | Follow the gate remediation, rerun it, and require a pass. |
| You load every available file for Card F. | Lazy loading became bulk context collection. | Write the decision question, then name only the source needed to answer it. |
| You choose a parser or output format for H or J. | The remaining ambiguity changes approved scope/product behavior. | State the facts and ask the bounded operator question. |

Recovery is command-free: begin a fresh scratch table, retry only the failed row, then
re-check all ten rows. No instructor or environment cleanup is required.

## Common misconceptions

- **“USER.md always overrides everything.”** Its Personal section is highest for personal
  behavior, while Defaults are fallbacks. Neither turns a failed deterministic gate green.
- **“Project definition outranks the active scope.”** Project definition supplies project
  identity and policy; the active scope supplies accepted work requirements. Satisfy both
  unless a material conflict needs an operator decision.
- **“The active scope authorizes implementation.”** It is one half of authority. Live
  implementation intent is also required.
- **“A live request can bypass preflight.”** Authorization does not erase deterministic
  evidence; remediate and rerun the gate.
- **“Completed work is the next backlog.”** A completed xBRIEF records what was delivered and
  has zero authority over future work.
- **“Lazy loading means reading nothing until stuck.”** Orientation sources are always read;
  task-specific depth is loaded when its decision becomes relevant.
- **“Ask the operator whenever two sentences differ.”** First classify and resolve what the
  sources already decide. Escalate only the material residue.

## Self-assessment

Answer from memory, then cite the relevant model section:

1. **O3.1:** Why can a product acceptance criterion and a testing rule both control the same
   change without one overriding the other?
2. **O3.2:** `USER.md Defaults` names pnpm and project definition names npm. Which applies, and
   would the result change if the pnpm rule were in `USER.md Personal`?
3. **O3.3:** List the two conditions for implementation authority and the additional gate
   condition for mutation readiness. What does a completed xBRIEF contribute?
4. **O3.4:** You are reviewing Markdown links and will not use GitHub. Which deep guidance do
   you load, and which do you defer?
5. Write a focused question for a request that adds a second output format outside the active
   scope.

**Demonstrated:** every answer identifies category and source, keeps both authority axes
separate, and escalates only material ambiguity. **Retry needed:** an answer relies on a total
file ranking, treats completion as future authority, or bulk-loads unrelated guidance.

## Explained solution

After a suggested 12–15 minute first attempt, compare your decision table with the
[explained Module 3 solution](../../solutions/module-03-authority-and-context.md). It explains
all ten cards, accepts evidence-equivalent wording, and gives a command-free retry path. No
instructor unlock is required.

## Navigation

- Previous: [Module 2 — Installation and Project Anatomy](02-installation-and-anatomy.md)
- Course map: [Directive training](../README.md)
- Solution: [Explained Module 3 solution](../../solutions/module-03-authority-and-context.md)
- Next: [Module 4 — xBRIEF as Durable State](04-xbrief-as-durable-state.md)

## Official sources

| Claim | Pinned 0.119.5 source | Use in this module |
| --- | --- | --- |
| Personal, project, Defaults, and lazy-loading precedence | [Core skill — `Core Principle: Rule Precedence` and `File Reading Strategy (Lazy Loading)`](https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/SKILL.md) | Behavior specificity and context selection |
| Deterministic rule strength and modularity | [Concepts — `Rule Strength` and `Lazy Loading And Modularity`](https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/docs/CONCEPTS.md) | Enforcement axis |
| Active plus live authority; completed scope boundary | [main.md — xBRIEF Persistence](https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/main.md#xbrief-persistence) | Implementation authorization |
| Session routing and intent gate | [Commands](https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/commands.md) — `Session routing (#2176)`, `Scope xBRIEF Lifecycle` | Read-only versus mutation posture |

The module paraphrases and adapts these sources. It does not reproduce a shared `USER.md` or
substantial upstream prose. See the [source baseline](../../references/SOURCE-BASELINE.md).
