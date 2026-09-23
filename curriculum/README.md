# 3Ci Directive training course map

This is the navigation source for a 13-hour-15-minute (795-minute), self-directed path:
11 hours 15 minutes (675 minutes) of core modules followed by a two-hour disposable capstone. Modules 1–12 and
the capstone are implemented and learner-ready. The course remains an internal
alpha pending representative learner pilots; that maturity label is separate
from authored-content completeness. The 0.119.5 executable path is verified locally on
macOS/zsh. Modules 4, 6, 8, 9, and 12 are command-free and use fixed fictional state where
applicable. Linux/bash and Windows/PowerShell remain candidates pending pin-matched
native evidence; independent walkthrough pilot evidence remains separate.

## Audience and prerequisites

This course is for 3Ci software engineers who already understand Git, GitHub,
branches, pull requests, terminals, tests, and normal software delivery. You
should have used at least one coding-agent host. You do not need prior knowledge
of Directive, xBRIEF, Directive strategies or skills, session posture, or
deterministic gates.

For command-based modules you will need:

- Node.js 20 or newer for the core modules; the capstone Directive proof
  requires Node.js 22 or newer because the pinned release uses `fs.globSync`;
- Git and GitHub CLI;
- npm as the primary package manager, with pnpm differences called out where
  they matter;
- Task and uv for executable lifecycle labs; the capstone matrix uses Task
  3.50.0 and uv 0.11.10;
- a resolvable Python interpreter on every supported operating system before
  Module 1. Labs 7, 10, 11, and the capstone require it because their helpers
  construct an isolated `PATH`. Windows resolves `python`, `python3`, then
  `py`; macOS and Linux resolve `python3`, then `python`;
- macOS or Linux with zsh or Bash, or Windows with PowerShell 7.4 or newer; and
- Codex, Claude Code, or Cursor for host-specific notes. The core instruction is
  host-neutral.

This course-entry Python check is presence-only. It sets no minimum or exact
learner version. Python 3.13.13 is verified Windows candidate-environment
evidence, not a learner requirement.

Do not install or initialize lab tooling in this training
repository. Each lab that changes files supplies a disposable starting
repository and reset path.

## How to take the course

Complete the core modules in numeric order. Each completed module begins with a
starting-state check and ends with observable evidence. Save that evidence in
your disposable lab or approved private learning notes, not in this repository.

Use this recovery order whenever you are blocked:

1. Re-run the module's starting-state check.
2. Match the failure to **Expected failures and recovery**.
3. Reveal the progressive hints one at a time.
4. After a genuine first attempt, compare with the explained solution.
5. If the documented paths still fail, report a curriculum defect using the
   sanitized evidence described in the root README.

No step requires a live demonstration or an instructor's private knowledge.

## Core path

| ID | Module | Time | Status | Primary practice |
| --- | --- | ---: | --- | --- |
| 01 | [What Directive is](modules/01-what-directive-is.md) | 45 min | Learner-ready | Classify tools and scenarios by responsibility |
| 02 | [Installation and project anatomy](modules/02-installation-and-anatomy.md) | 60 min | Learner-ready; 0.119.5 path verified on macOS/zsh; Linux and Windows candidates | Initialize and inspect a disposable consumer repository |
| 03 | [Authority and context](modules/03-authority-and-context.md) | 45 min | Learner-ready | Resolve conflicting sample rules |
| 04 | [xBRIEF as durable state](modules/04-xbrief-as-durable-state.md) | 45 min | Learner-ready; command-free | Classify project and work-state artifacts |
| 05 | [Sources versus projections](modules/05-sources-versus-projections.md) | 50 min | Learner-ready; lab verified on macOS/zsh; Linux and Windows candidates | Repair projection drift through its source |
| 06 | [Creating well-shaped work](modules/06-creating-well-shaped-work.md) | 55 min | Learner-ready; command-free | Shape vertical slices and route proposed mechanisms with evidence |
| 07 | [Scope lifecycle and implementation authorization](modules/07-scope-lifecycle.md) | 65 min | Learner-ready; lab verified on macOS/zsh; Linux and Windows candidates | Fail, promote, activate, establish current readiness, complete, and cancel |
| 08 | [Session start and authorized work selection](modules/08-session-and-work-selection.md) | 45 min | Learner-ready; command-free fixed-state exercise | Trace posture and intake decisions |
| 09 | [Design-critique arcs and verified synthesis](modules/09-design-critique-arcs.md) | 75 min | Learner-ready; command-free fixed-state practicum | Route a mechanism-shaped proposal, fill an N=1 envelope, map findings, and decide bind or halt |
| 10 | [The implementation golden path](modules/10-implementation-golden-path.md) | 70 min | Learner-ready; lab verified on macOS/zsh; Linux and Windows candidates | Implement one test-backed active scope |
| 11 | [Testing, gates, and evidence](modules/11-testing-gates-and-evidence.md) | 65 min | Learner-ready; lab verified on macOS/zsh; Linux and Windows candidates | Red-green-refactor and diagnose a gate failure |
| 12 | [PR, review, and actual completion](modules/12-review-and-completion.md) | 55 min | Learner-ready; command-free fixed-state exercise | Resolve simulated findings and classify completion evidence |

The times total 11 hours 15 minutes (675 minutes). Exercise time is included. Different hosts may add a
small setup cost, but host-specific mechanics must not change the core outcomes.
Including the two-hour capstone, the full path is 13 hours 15 minutes (795 minutes).

## Module sequence and outcomes

### Phase A: orient

- **01 — What Directive is:** distinguish Directive from coding hosts, skill
  packs, and application-agent orchestrators; explain shared standards, durable
  state, and deterministic gates.
- **02 — Installation and project anatomy:** select `init`, `update`, or
  `doctor`; distinguish consumer and maintainer surfaces; identify tracked,
  ignored, authoritative, and reconstitutable artifacts.
- **03 — Authority and context:** resolve USER.md, PROJECT-DEFINITION,
  task-specific guidance, and framework defaults; separate behavior rules from
  product requirements; explain lazy loading.

### Phase B: understand durable work

- **04 — xBRIEF as durable state:** identify project definition,
  specification, scope, plan, continue, and lifecycle artifacts; explain why
  chat history is not authoritative work state.
- **05 — Sources versus projections:** distinguish xBRIEF sources from rendered
  Markdown and codebase-map projections; recover safely from drift.
- **06 — Creating well-shaped work:** turn an idea into a bounded strategy choice,
  observable acceptance statements, and proposed scope; write vertical slices
  and recognize an epic that needs decomposition; route a proposed mechanism from
  supplied facts without inventing authority.

### Phase C: authorize and implement

- **07 — Scope lifecycle and implementation authorization:** use lifecycle
  commands for proposed, pending, active, completed, and cancelled work; connect
  active/running state and explicit intent to mutation authority.
- **08 — Session start and authorized work selection:** distinguish read-only
  orientation from mutation-ready work; recover sessions; apply ordered-plan
  precedence and ranked queue selection; distinguish cache, audit log, and
  accepted backlog.
- **09 — Design-critique arcs and verified synthesis:** route a named target revision;
  bind charter, spend, and evidence ceiling; adjudicate findings and parent premises;
  and distinguish retry, halt, synthesis, ingest, and implementation authority.
- **10 — The implementation golden path:** begin on a clean feature branch with
  an active contract; pass story and xBRIEF preflight; implement only the
  smallest coherent change.
- **11 — Testing, gates, and evidence:** use focused checks, literal acceptance
  commands, forward coverage, and the aggregate gate without weakening a gate
  to make a failure disappear.

### Phase D: review and close

- **12 — PR, review, and actual completion:** self-review before a PR; classify
  findings before editing; batch coherent fixes; require current evidence; and
  distinguish implemented, PR-open, merge-ready, delivered, deployed, and
  UAT-verified.

## Capstone

The learner-ready [two-hour capstone](capstone-end-to-end.md) uses one guarded,
disposable fictional repository. A learner first routes a fixed mechanism-shaped
proposal and recognizes that an unresolved audit blocks bind, then independently orients, establishes
active scope, passes readiness gates, preserves red/green evidence, runs focused
and literal checks before the separate aggregate, classifies and resolves a
simulated review finding, and makes an evidence-bounded closeout decision.
Use its [lab](../labs/capstone-end-to-end.md),
[assessment](../assessments/capstone-end-to-end.md), and
[explained solution](../solutions/capstone-end-to-end.md).
The capstone does not use a business repository, remote
mutation, real deployment, or destructive cleanup.

## Future advanced electives

These are intentionally outside the beginner path and are not MVP blockers:

- Brownfield adoption and upgrades
- Backlog refinement and reconciliation
- Swarm-ready decomposition
- Worktrees and multi-agent allocation
- Dispatch contracts and model routing
- Review monitors and merge-path ownership
- Bounded autonomy and dual stops
- Decisions and provenance
- Feedback and continuous improvement
- Host and runtime operations
- Release and deployment workflows
- Directive framework-maintainer internals

Learners should complete one solo lifecycle before taking a swarm elective.

## Progress and validation

A module is complete only when you can produce its stated evidence and answer
its outcome-mapped self-assessment. A solution can confirm or correct your
reasoning, but reading it is not evidence by itself.

The later independent-learner pilot validates the material rather than changing
the delivery model: representative engineers will use only the written course,
hints, recovery paths, and solutions. Their friction becomes revision input.

- Previous: [Repository start](../README.md)
- Next: [Module 1 — What Directive is](modules/01-what-directive-is.md)

After Module 11, continue to [Module 12](modules/12-review-and-completion.md).
After Module 12, continue to the [end-to-end capstone](capstone-end-to-end.md). A
learner without the verified Lab 5, Lab 7, Lab 10, or Lab 11 environment can
read the corresponding concepts, but must retain an environment-blocked practical outcome
instead of treating an unexecuted candidate platform as verified.
