# Module 1 — What Directive Is

Learn to identify Directive's job in an AI-assisted engineering stack and
explain how its three pillars make repository work repeatable.

## Module record

| Field | Value |
| --- | --- |
| Stable ID | `module-01-what-directive-is` |
| Status | `learner-ready draft` |
| Last content update | 2026-09-07 |
| Last verified | 2026-09-07 |
| Directive baseline | `@deftai/directive@0.112.0`, engine `@deftai/directive-core@0.112.0`; see the [source baseline](../../references/SOURCE-BASELINE.md) |
| Estimated duration | 45 minutes |
| Prerequisites | Read the [curriculum map](../README.md); be familiar with Git repositories, pull requests, tests, and at least one coding-agent host |

Suggested pacing: 3 minutes for the starting check, 15 minutes for the lesson, 5 minutes for the walkthrough, 15 minutes for the exercise, and 7 minutes for self-assessment and solution comparison.

## Learning outcomes

By the end of this module, you can:

- **O1 — Distinguish the categories.** Classify a coding-agent host, a skill pack, the Directive practice layer, and an application-agent orchestrator by the job each performs, and justify the classification with evidence.
- **O2 — Explain the Directive model.** Explain how shared standards, durable work state, and deterministic gates work together to make repository work repeatable across sessions.
- **O3 — Apply the model.** Analyze a realistic tool stack or team workflow, identify which categories and Directive pillars are present, and recommend what is missing without relying on product names or marketing terms.

## Starting-state check

Set a timer for three minutes. In a scratch note, answer these questions without looking ahead:

1. Where does the coding agent you have used actually run: an editor, a terminal, a web application, or somewhere else?
2. Name one project fact that should survive after an agent chat ends.
3. Give one example of an executable check that can return a clear pass or failure.

**Pass:** You can make a reasonable attempt at all three. Exact terminology is not required yet. Keep the note; you will revisit it at the end.

**If the check does not pass:** If question 1 is blank, review the audience and prerequisites in the [curriculum map](../README.md) before continuing. If question 2 or 3 is blank, write “not sure” and continue—the terminology and walkthrough below provide the missing model. This module requires no installation or command recovery.

> **[3Ci policy]** This module is conceptual. Do not initialize Directive or change files in this training repository, a client repository, or another business repository. Use paper or a personal, untracked scratch note. Later labs use disposable repositories and fictional data.

## Why this matters

Teams often compare AI tools as if every tool performs the same job. That leads to predictable mistakes: expecting a repository framework to provide an editor, expecting a prompt pack to preserve work state, or treating an application runtime as a software-delivery process.

Directive addresses a narrower and more durable problem: how humans and coding agents share the same repository practices even when the host, session, or contributor changes. Correctly locating Directive in the tool stack helps you decide what it can govern, what it can complement, and what must be supplied by something else.

Throughout this course, statements use three labels:

- **[Directive behavior]** — behavior grounded in the pinned official release.
- **[3Ci policy]** — an internal safety or operating rule for this curriculum and 3Ci use.
- **[Course guidance]** — a teaching recommendation, not an upstream product requirement.

## Terminology

| Term | Working definition for this course | Claim type |
| --- | --- | --- |
| **Coding-agent host** | The editor, CLI, or other environment that runs the coding agent and exposes files, tools, approvals, and conversation. | **[Directive behavior]** |
| **Skill pack** | Reusable instructions or techniques that improve how an agent handles a kind of task, usually through the host’s skill mechanism. | **[Directive behavior]** |
| **Directive practice layer** | An installable repository practice layer that gives humans and coding agents shared standards, durable work state, and automated gates. | **[Directive behavior]** |
| **Application-agent orchestrator** | Runtime code in a product that coordinates agents as part of the product’s behavior. It operates inside the application, not as the repository’s delivery practice. | **[Directive behavior]** |
| **Shared standards** | Layered, version-aware rules and guidance that contributors load for the work they are doing. | **[Directive behavior]** |
| **Durable work state** | Structured project and work records that survive chat boundaries. In current Directive projects, xBRIEF files provide this state. | **[Directive behavior]** |
| **Deterministic gate** | An executable check with an observable result. Given its declared inputs and rules, it reports pass or failure instead of depending on an agent remembering prose. | **[Directive behavior]** |
| **xBRIEF** | Directive’s current public name for structured project and work-state files. New xBRIEFs use schema version `0.8`. | **[Directive behavior]** |
| **Deft / Directive** | Deft is the company and the name used in paths and package scope; Directive is the product installed as `@deftai/directive` and run with `directive` (`deft` is also an alias). | **[Directive behavior]** |

## Mental model

**[Directive behavior]** Classify by **job and boundary**, not by whether a tool mentions “agents,” “skills,” or “workflow.” Ask these four questions:

| Question | Category |
| --- | --- |
| Where does the coding agent run and interact with files and tools? | Coding-agent host |
| What gives the agent a reusable method during a task? | Skill pack |
| What stays with the repository to align work across people, hosts, and sessions? | Directive practice layer |
| What coordinates agents while the shipped application is running? | Application-agent orchestrator |

A compact memory aid is:

> **The host runs the coding agent. A skill guides a task. Directive governs repository practice. An orchestrator coordinates agents inside an application.**

These categories are not mutually exclusive purchases. A team can use a host, add skill packs to it, and install Directive in the repository. The application that team builds might separately contain an agent orchestrator.

The model identifies a component’s job. It does not say that the component is installed correctly, that its rules are sufficient, or that its output is high quality.

## Guided explanation

### 1. A host is the execution environment

**[Directive behavior]** Directive is not an editor, terminal, chat UI, model provider, or coding-agent runtime. A coding-agent host supplies those interaction and execution surfaces. Directive feeds repository instructions and work context to a compatible host; the host still runs the agent.

Changing hosts therefore does not automatically change the repository’s accepted work or its checks. Host-specific capabilities can change, but the repository practice layer remains a separate concern.

### 2. A skill pack supplies task methodology

A skill can teach an agent a repeatable technique: diagnose before fixing, write a structured plan, or review a diff in a particular order. That is valuable, but a technique alone does not necessarily record accepted work in the repository or enforce a check after the conversation ends.

**[Directive behavior]** Directive includes skills, but it is not *only* a skill pack. Skills are one part of a larger repository deposit that also includes structured work state and executable gates.

### 3. Directive is a repository practice layer

**[Directive behavior]** Directive materializes versioned practice for a Git repository. Its current model has three reinforcing pillars:

1. **Shared standards answer “how should work be done?”** Layered guidance lets an agent load general, project, language, tool, and workflow rules as needed. Lazy loading keeps the context focused instead of placing every rule in one enormous prompt.
2. **Durable work state answers “what is true about the project and this work?”** Current projects use xBRIEF `0.8` records for project identity and scoped work. Lifecycle folders such as `proposed`, `pending`, `active`, `completed`, and `cancelled` make work status visible outside a chat transcript.
3. **Deterministic gates answer “what evidence allows the next step?”** Taskfile targets, CLI validators, hooks, tests, and CI can produce an observable pass or failure. A configured fail-closed gate stops progress when its contract is not satisfied.

The three pillars solve different failure modes:

| If this pillar is missing | Likely failure |
| --- | --- |
| Shared standards | Contributors and agents follow inconsistent practices. |
| Durable work state | Intent and progress must be reconstructed from chat or memory. |
| Deterministic gates | A written rule can be skipped without an observable failure. |

No single pillar is the whole product model. A committed instruction file is useful, but it is not by itself evidence of the complete Directive practice layer. A CI check is useful, but it does not state what work was accepted. An xBRIEF records state, but state without standards or checks does not guarantee consistent execution.

### 4. An application-agent orchestrator lives in the product runtime

An orchestrator routes messages, tools, memory, or roles among agents while an application is operating. Its boundary is the product’s runtime behavior—for example, a support application that sends a request to a classifier and then a response agent.

**[Directive behavior]** Directive may govern a coding agent's repository work. That does not turn Directive into an application-agent orchestrator. The deciding question is whether the workflow governs delivery of the repository or runs as behavior inside the shipped application.

### 5. “Deterministic” does not mean “infallible”

A deterministic gate makes the decision surface explicit and repeatable: a command evaluates declared rules and returns an observable result. It can still contain a bad rule, miss an important risk, or require human review. Determinism strengthens enforcement; it does not prove that the rule is wise or that the entire product is correct.

### 6. Directive connects inception to repeated delivery work

**[Directive behavior]** Directive’s conceptual lifecycle begins by turning a concept into a project definition and proposed scopes. Daily sessions then resume from durable state, select and refine work, implement it, verify it, and feed new learning or issues back into the next cycle. It is deliberately re-entered; it is not a one-time prompt or a pipeline that is forgotten after setup.

## Walkthrough: the Atlas Notes team

### Goal

Classify every component in a small tool stack and predict what persists when the coding-agent host changes.

### Safe setup

**[Course guidance]** Atlas Notes is a fictional command-line application. Read the scenario and use only your scratch note; do not change a repository.

### Actions and observations

1. Priya opens the repository in **Harbor Workbench**, which provides an agent chat, file editing, terminal access, and approval prompts. Harbor is the **coding-agent host**.
2. She loads **TraceSteps**, a reusable debugging procedure that tells the agent to reproduce, collect evidence, and test the cheapest disproof. TraceSteps is a **skill pack**.
3. The repository is configured with `@deftai/directive`. It contains shared instructions, xBRIEF work records, and executable checks. Directive is the **repository practice layer**.
4. Atlas Notes itself has no agent behavior in production, so there is **no application-agent orchestrator** in this example.
5. The next day, Malik uses a different coding-agent host on the same repository. The UI changes, and TraceSteps may not be installed there. The repository’s accepted xBRIEF state and its gates still provide a shared contract.

Notice the evidence used in the classification: execution surface, task methodology, repository persistence and enforcement, and application runtime. The product names did not decide the answer.

## Exercise: classify the Northstar stack

Suggested first attempt: **12–15 minutes without hints or the solution**.

Northstar Shipping Simulator is fictional. No client information, credentials, repository setup, or terminal commands are required.

Use these codes in your scratch note:

- `H` — coding-agent host
- `S` — skill pack
- `D` — Directive practice layer
- `O` — application-agent orchestrator

### Constraints

- Use only the observations in each card; do not infer an unstated installation or tool.
- Work with read-only course material and a personal scratch note.
- Do not add a Git remote, use credentials, contact an external service, or change any repository.

### Part A — Classification cards

For each card, record the code or codes and one sentence of evidence. When a card contains a stack, classify each named component rather than forcing the entire stack into one category.

| Card | Observation |
| --- | --- |
| A | **Lumen Studio** provides an editor, agent conversation, file tools, a terminal, and approval prompts. It does not define Northstar’s accepted backlog. |
| B | **MethodCards** is a set of reusable review and debugging instructions loaded by Lumen Studio. Its instructions do not create repository work records or an executable check. |
| C | The **Northstar repository** pins `@deftai/directive`, exposes shared project guidance, stores accepted work in xBRIEF `0.8` files, and runs checks that return non-zero when required conditions fail. |
| D | The shipped **RouteCrew service** routes each simulated customer request through classifier, planner, and responder agents while the service is running. |
| E | Engineer Jo uses **Lumen Studio + MethodCards + the Directive-configured Northstar repository** during one change. The shipped application in this card has no agent runtime. |
| F | The **Northstar repository workflow** uses tracked shared guidance, an active xBRIEF `0.8` scope, and required checks to govern one fictional change through review. It never receives live simulator requests. |

### Part B — Pillar diagnosis

For each team, identify the Directive pillars that are present, the pillars that are missing, one likely failure, and one corrective recommendation.

1. **Comet team:** The repository contains a shared `TEAM-RULES.md`. Work status lives only in private agent chats. Reviewers are asked to remember to run lint, but no executable workflow checks it.
2. **Aurora team:** The repository contains structured xBRIEF work records and a CI command that fails when required tests fail. Coding conventions live only in one engineer’s private prompt.

### Part C — Boundary explanation

In two or three sentences, explain why Card F is not the same category as Card D even though both descriptions coordinate work through a workflow.

### Exercise acceptance

| Outcome | Observable condition | Inspection |
| --- | --- | --- |
| O1 | At least five of six Part A cards have the correct code or code set and an evidence-based reason. | Compare each row with the explained solution after the first attempt. |
| O2 | Both Part B inventories evaluate standards, state, and gates separately and identify every missing pillar. | Check that each team has three explicit pillar findings. |
| O3 | Both recommendations address the observed gap, and Part C distinguishes repository delivery from application runtime. | Remove the fictional product names; the explanation must still work. |

## Completion evidence

Keep the following in your scratch note:

- Six Part A classifications with evidence sentences.
- Two Part B pillar inventories, failure predictions, and recommendations.
- The Part C boundary explanation.
- Your self-assessment answers from the section below.

After a first attempt, use the hints progressively. Then compare with the explained solution. A successful attempt has at least five of six Part A cards correct, identifies every missing pillar in Part B, and explains the repository-delivery versus application-runtime boundary in Part C. If you miss the threshold, follow the recovery guidance in the solution and retry only the missed items.

> **[3Ci policy]** Solutions are available for independent study after a suggested first attempt. There is no instructor-access gate. Use the solution to inspect your reasoning, not merely to copy codes.

## Progressive hints

Open one hint at a time.

<details>
<summary>Hint 1 — Start with the boundary</summary>

For every noun, ask where it operates: in the agent’s editor or CLI, in a task method, in the repository’s durable practice, or inside the running application.

</details>

<details>
<summary>Hint 2 — Test persistence and enforcement</summary>

If a method disappears with one host or conversation, it is probably a skill rather than the repository practice layer. For the two teams in Part B, separately look for a shared rule, a durable work record, and an executable pass/fail result.

</details>

<details>
<summary>Hint 3 — Use the four-question map</summary>

Editor/CLI execution points to `H`; reusable task method points to `S`; shared repository rules plus state and gates point to `D`; shipped runtime coordination points to `O`. A guided repository change remains on the delivery side of the boundary even when a coding agent performs it.

</details>

## Expected failures and recovery

| Expected difficulty | Recovery |
| --- | --- |
| You classify by words such as “agent” or “workflow.” | Underline the operating boundary in the observation, then apply the four questions from the mental model. |
| You give Card E only one code. | List each named component on its own line and classify its job independently. Categories can stack. |
| You treat written guidance as a gate. | Ask what executable surface returns failure and what next step that failure blocks. A reminder is not a deterministic gate. |
| You treat any coordinated workflow as an application orchestrator. | Ask whether the workflow governs a repository change or serves requests inside the shipped application. |
| You find only one missing pillar in Part B. | Make a three-column inventory: standards, state, gates. Require one concrete observation in every column. |
| A term still feels ambiguous after all hints. | Read the matching official source heading listed below, revise the evidence sentence, and then open the explained solution. |

## Common misconceptions

**[Directive behavior]** The corrections below restate the pinned category and concepts model.

- **“Directive is the agent.”** The coding host runs the agent; Directive supplies repository practice.
- **“A collection of skills is equivalent to Directive.”** Skills can be part of the stack, but skills alone do not establish all three pillars.
- **“An `AGENTS.md` file is the whole practice layer.”** It can carry shared guidance, but one instruction file does not by itself prove durable work state and executable gates.
- **“A checklist is a deterministic gate.”** A checklist is guidance until an executable surface reports and enforces its result.
- **“Durable state means the host remembers my conversation.”** Durable state is external to transient chat and remains inspectable by the next person or session.
- **“Every agent workflow is an application orchestrator.”** A repository-delivery workflow and shipped application-agent coordination have different boundaries.
- **“Deterministic means correct.”** It means the evaluation is explicit and repeatable for declared inputs; correctness still depends on the rule and coverage.
- **“Old names or schemas are fine for new material.”** This course uses the current public term xBRIEF and schema `0.8`; legacy formats are outside the beginner path.

## Self-assessment

Answer without reopening the guided explanation. Each item names the outcome it checks.

1. **[O1]** Complete this sentence with four distinct jobs: “A host ___; a skill pack ___; Directive ___; an application-agent orchestrator ___.”
2. **[O2]** Name the three Directive pillars. For each, state the question it answers.
3. **[O2]** Which is a deterministic gate, and why?
   - a. “Please remember to run tests.”
   - b. A configured command evaluates required tests, returns a failing exit status, and blocks the next workflow step.
   - c. A reviewer’s private checklist.
   - d. A chat message saying the change looks good.
4. **[O3]** A team changes coding-agent hosts. Its accepted scope remains in tracked xBRIEF files and its same repository checks still run. What changed, what persisted, and which category explains the persistence?
5. **[O1, O3]** A product routes live user requests among three agents, while its repository has no Directive installation. Which category is present, and which conclusion about repository practice would be unsupported?

Use the [explained solution](../../solutions/module-01-what-directive-is.md#self-assessment-key) to check your work. You have met the module outcomes when:

- **O1:** all four category jobs are distinct and based on evidence;
- **O2:** all three pillars and the pass/fail nature of a deterministic gate are accurate; and
- **O3:** both scenario answers identify the correct boundary without inferring missing evidence.

## Explained solution

Make a first attempt and use the progressive hints before opening the [Module 1 explained solution](../../solutions/module-01-what-directive-is.md). The solution explains every classification, likely wrong answers, the pillar diagnoses, and the self-assessment key.

## Navigation

- **Previous:** [Curriculum map](../README.md)
- **Next:** [Module 2 — Installation and Project Anatomy](02-installation-and-anatomy.md)
- **Course home:** [3Ci Directive Training](../../README.md)

## Official sources

This lesson paraphrases the following official sources pinned to Directive `v0.112.0`. If the project pin changes, consult the [source baseline](../../references/SOURCE-BASELINE.md) before relying on these claims.

- [README — opening category and naming summary](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/README.md) and [Getting Started](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/README.md#-getting-started)
- [Category decision aid — Four-way fit table](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/docs/CATEGORY.md#four-way-fit-table), [What Directive is](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/docs/CATEGORY.md#what-directive-is), [What Directive is not](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/docs/CATEGORY.md#what-directive-is-not), and [How the four categories relate](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/docs/CATEGORY.md#how-the-four-categories-relate)
- [Deft Key Concepts — From Vibe To Repeatable Practice](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/docs/CONCEPTS.md#from-vibe-to-repeatable-practice), [xBRIEF Is The Durable State](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/docs/CONCEPTS.md#xbrief-is-the-durable-state), [Rule Strength](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/docs/CONCEPTS.md#rule-strength), and [Quality Gates](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/docs/CONCEPTS.md#quality-gates)
- [xBRIEF References — Schema Version: v0.8 (canonical write)](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/conventions/references.md#schema-version-v08-canonical-write)
- [The Directive Lifecycle — The two phases](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/docs/directive-lifecycle.md#the-two-phases), [Stage → real surface](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/docs/directive-lifecycle.md#stage--real-surface), and [Why it loops](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/docs/directive-lifecycle.md#why-it-loops). The installed consumer copy used for verification is `.deft/core/docs/directive-lifecycle.md`.
