# 3Ci Directive training course map

This is the navigation source for a twelve-hour, self-directed path: ten hours
of core modules followed by a two-hour disposable capstone. The current
internal-alpha milestone makes Modules 1–11 learner-ready drafts. Module 2's 0.112.0 pinned npm
path is verified on macOS 15/zsh, Linux/bash on Ubuntu 24.04, and Windows/PowerShell
7.4+ on Windows Server 2022 by local and native-matrix evidence. Modules 4 and 6
are command-free; Modules 8 and 11 are also command-free and use fixed fictional state.
Module 5's projection lab and Module 7's lifecycle lab are verified only on macOS/zsh;
their Linux and native Windows paths are not verified. Modules 9 and 10 have executable labs
verified only on macOS/zsh. The capstone remains planned until its files contain
substantive, verified content.

## Audience and prerequisites

This course is for 3Ci software engineers who already understand Git, GitHub,
branches, pull requests, terminals, tests, and normal software delivery. You
should have used at least one coding-agent host. You do not need prior knowledge
of Directive, xBRIEF, Directive strategies or skills, session posture, or
deterministic gates.

For command-based modules you will need:

- Node.js 20 or newer;
- Git and GitHub CLI;
- npm as the primary package manager, with pnpm differences called out where
  they matter;
- macOS or Linux with zsh or Bash, or Windows with PowerShell 7.4 or newer; and
- Codex, Claude Code, or Cursor for host-specific notes. The core instruction is
  host-neutral.

**[3Ci policy]** Do not install or initialize lab tooling in this training
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
| 01 | [What Directive is](modules/01-what-directive-is.md) | 45 min | Learner-ready draft | Classify tools and scenarios by responsibility |
| 02 | [Installation and project anatomy](modules/02-installation-and-anatomy.md) | 60 min | Learner-ready draft; 0.112.0 pinned npm path verified on macOS 15/zsh, Linux/bash on Ubuntu 24.04, and Windows/PowerShell 7.4+ on Windows Server 2022 by local and native-matrix evidence | Initialize and inspect a disposable consumer repository |
| 03 | [Authority and context](modules/03-authority-and-context.md) | 45 min | Learner-ready draft | Resolve conflicting sample rules |
| 04 | [xBRIEF as durable state](modules/04-xbrief-as-durable-state.md) | 45 min | Learner-ready draft; command-free | Classify project and work-state artifacts |
| 05 | [Sources versus projections](modules/05-sources-versus-projections.md) | 50 min | Learner-ready draft; lab verified on macOS/zsh only | Repair projection drift through its source |
| 06 | [Creating well-shaped work](modules/06-creating-well-shaped-work.md) | 55 min | Learner-ready draft; command-free | Turn a horizontal plan into a vertical slice |
| 07 | [Scope lifecycle and implementation authorization](modules/07-scope-lifecycle.md) | 65 min | Learner-ready draft; lab verified on macOS/zsh only | Fail, promote, activate, establish current readiness, complete, and cancel |
| 08 | [Session start and authorized work selection](modules/08-session-and-work-selection.md) | 45 min | Learner-ready draft; command-free fixed-state exercise | Trace posture and intake decisions |
| 09 | [The implementation golden path](modules/09-implementation-golden-path.md) | 70 min | Learner-ready draft; lab verified on macOS/zsh only | Implement one test-backed active scope |
| 10 | [Testing, gates, and evidence](modules/10-testing-gates-and-evidence.md) | 65 min | Learner-ready draft; lab verified on macOS/zsh only | Red-green-refactor and diagnose a gate failure |
| 11 | [PR, review, and actual completion](modules/11-review-and-completion.md) | 55 min | Learner-ready draft; command-free fixed-state exercise | Resolve simulated findings and classify completion evidence |

The times total ten hours. Exercise time is included. Different hosts may add a
small setup cost, but host-specific mechanics must not change the core outcomes.

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
  and recognize an epic that needs decomposition.

### Phase C: authorize and implement

- **07 — Scope lifecycle and implementation authorization:** use lifecycle
  commands for proposed, pending, active, completed, and cancelled work; connect
  active/running state and explicit intent to mutation authority.
- **08 — Session start and authorized work selection:** distinguish read-only
  orientation from mutation-ready work; recover sessions; apply ordered-plan
  precedence and ranked queue selection; distinguish cache, audit log, and
  accepted backlog.
- **09 — The implementation golden path:** begin on a clean feature branch with
  an active contract; pass story and xBRIEF preflight; implement only the
  smallest coherent change.
- **10 — Testing, gates, and evidence:** use focused checks, literal acceptance
  commands, forward coverage, and the aggregate gate without weakening a gate
  to make a failure disappear.

### Phase D: review and close

- **11 — PR, review, and actual completion:** self-review before a PR; classify
  findings before editing; batch coherent fixes; require current evidence; and
  distinguish implemented, PR-open, merge-ready, delivered, deployed, and
  UAT-verified.

## Capstone

The planned two-hour capstone uses one disposable fictional repository. A
learner will independently orient, establish active scope, pass preflight,
implement a tested behavior, run focused and aggregate checks, conduct pre-PR
review, handle a simulated review, and make an evidence-based closeout decision.
**[3Ci policy]** The capstone will not use a business repository, real
deployment, or destructive remote action.

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

After Module 10, continue to [Module 11](modules/11-review-and-completion.md).
After Module 11, stop at the course map because the capstone remains planned. A
learner without the verified Lab 5, Lab 7, Lab 9, or Lab 10 environment can
read the corresponding concepts, but must retain an environment-blocked practical outcome
instead of treating an unexecuted candidate platform as verified.
