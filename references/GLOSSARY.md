# Directive training glossary

These definitions describe the course baseline: `@deftai/directive` 0.112.0
and xBRIEF schema 0.8, verified through 2026-09-07. See
[SOURCE-BASELINE.md](SOURCE-BASELINE.md) before applying them to another
release.

## Core system terms

**Directive**
A repository practice layer for AI-assisted engineering. It supplies shared
standards, durable project and work state, and deterministic gates. It does not
replace a coding host, application-specific agent system, Git, or human
authority.

**consumer project**
A project that installs and follows Directive. This training repository is a
consumer project. It is not the `deftai/directive` framework source repository.

**framework source repository**
The upstream repository where Directive itself is built and maintained. Its
maintainer commands and internal implementation are outside the core learner
path.

**project pin**
The exact `@deftai/directive` version recorded in a consumer project's
`package.json`. It is the reconstitution anchor; a recorded pin is not proof
that a matching project-local package is currently installed.

**managed integration**
Tracked files or marked sections refreshed by Directive, such as its AGENTS.md
section, Taskfile include, host adapters, hooks, schemas, and generation
metadata. Managed and tracked does not automatically mean authoritative source.

**reconstitutable deposit**
Ignored framework content such as `.deft/core/` that can be recreated from the
project pin. Reconstitutable does not mean safe to hand-edit or delete broadly.

**coding-agent host**
The environment in which an agent runs, such as Codex, Claude Code, or Cursor.
The host supplies model and tool access; Directive supplies repository practice
and gates.

**skill**
A lazily loaded operating contract for a particular kind of work. A skill tells
an agent how to perform that work within Directive's rules. A skill pack is not
a general-purpose agent host.

**strategy**
A structured approach for shaping or reasoning about work, such as an
interview. A strategy helps develop the work definition; it does not by itself
authorize implementation.

**application-agent orchestrator**
Software that coordinates agents inside a product or business workflow.
Directive governs engineering work around a repository; it is not the runtime
orchestrator for the application being built.

## Authority and context

**authority hierarchy**
Two related axes used after classifying a statement. For behavior-source
specificity, `USER.md Personal` wins, PROJECT-DEFINITION overrides `USER.md
Defaults`, and applicable task/framework guidance supplies narrower defaults.
For enforcement strength, deterministic checks precede Taskfile targets,
xBRIEF policy, RFC 2119 instructions, and prose. Product requirements and
present implementation authorization remain separate questions; do not infer a
single total file order.

**USER.md**
The shared user-preference file resolved by Directive for the current platform.
It is read in place. A consumer project must not replace, copy, distribute, or
commit it.

**PROJECT-DEFINITION**
The authoritative xBRIEF artifact for a project's identity, goals, policies,
boundaries, and durable project decisions.

**behavior rule**
An instruction governing how work is performed, such as a safety or branch
rule. It is different from a product requirement describing what to build.

**product requirement**
An observable property the accepted project or scope must deliver. It normally
coexists with behavior rules that constrain how the work is performed.

**implementation authorization**
Present permission to implement a bounded product change: active scope plus the
human operator's live implementation intent. Required deterministic gate passes
are a separate readiness condition before implementation mutation may proceed.

**material ambiguity**
An unresolved choice that would change scope, safety, authorization, or
observable product behavior. Narrow the conflict to its controlling facts, then
ask the operator rather than inventing a tie-breaker.

**lazy loading**
Loading detailed guidance only when the current work needs it. The repository's
entry instructions route the agent to the relevant skill or reference instead
of placing the entire framework in every prompt.

**session posture**
The level of action currently authorized. Read-only orientation may inspect
state. Mutation-ready work additionally requires explicit implementation intent
and the current release's session and preflight gates.

**active contract**
The active/running scope xBRIEF together with the human operator's live
instruction. A completed xBRIEF records prior lifecycle closeout; it does not authorize
future work.

## Durable state and lifecycle

**xBRIEF**
Directive's structured, durable project and work-state format. Current course
writes use schema version 0.8. Chat history can help explain a session, but it is
not the durable source of truth.

**scope xBRIEF**
A bounded work contract containing a goal, observable acceptance, planned
items, evidence commands, and lifecycle metadata.

**specification**
Durable requirements describing what the product or feature must do. It shapes
scopes but is not a substitute for an active implementation contract.

**plan**
Durable structure for intended work and policy. An ordered plan can constrain
work selection; it does not silently expand an active scope.

**continue artifact**
Durable handoff state that lets a later session resume without treating chat
history as authority.

**proposed**
Work has been shaped for consideration but is not approved for implementation.

**pending**
Work has been promoted into the approved work set but is not currently active.

**active / running**
Work is the current implementation scope. Active state is necessary but not
sufficient: live implementation intent and passing preflight are also required.

**completed**
The scope lifecycle is closed with its recorded evidence and disposition. A
completed state can record delivery or a non-delivery closeout; the folder name
alone is not delivery-branch evidence. It is a historical record, not standing
authority for more changes.

**cancelled**
The scope will not proceed in its present form. Cancellation preserves the
record instead of disguising the transition as a manual file deletion.

**lifecycle command**
A Directive command that performs a state transition and its validation. Use it
instead of manually moving lifecycle files.

## Sources, projections, and proof

**source of truth**
The authoritative artifact for a fact. In this project, xBRIEF owns project and
work state, repository Markdown owns lesson text, and upstream released sources
own official Directive behavior.

**projection**
Generated or rendered output derived from a source, such as a project-definition
Markdown rendering, codebase map, or future internal-publishing page. Repair the
source and regenerate; do not promote the projection over its source.

**gate**
A deterministic check that returns evidence about a required condition. A gate
does not grant broader authority than the scope and human instruction provide.

**preflight**
A start gate run before implementation. In this baseline, the gated session
ritual, story-ready check, and xBRIEF preflight are separate surfaces for session
freshness, branch and active-work readiness, and scope/intent invariants. Run all
that apply; no one surface proves the whole start contract.

**aggregate gate**
The project's full required check surface, run after focused iteration checks.
When it fails, fix the work or its legitimate cause; do not weaken the gate
merely to obtain a passing result.

**acceptance criterion**
An observable condition that must be true for scoped work to be accepted.
Strong criteria state evidence a learner or reviewer can actually inspect.

**evidence**
Current, reproducible output or an inspectable artifact supporting a claim.
Activity alone—editing files or running a command—is not proof that an outcome
was achieved.

**forward coverage**
Evidence that changed behavior is exercised by tests on the feature branch.
It complements focused checks and the aggregate gate.

## Work selection and delivery states

**ranked queue**
The accepted backlog ordered for selection when no bounded ordered plan takes
precedence. It is not inferred from a folder listing.

**cache**
Local, reconstitutable data used to support fast work selection or tooling. It
is not automatically the source of product requirements.

**audit log**
A record of actions or decisions. It can prove what happened, but it is not the
same thing as an accepted backlog or active contract.

**implemented**
The scoped change exists locally and has the claimed local evidence.

**PR-open**
A pull request exists. This alone does not mean review is complete or the change
is safe to merge.

**merge-ready**
Required current checks and reviews support merging, subject to the repository's
human or automated merge authority.

**delivered**
The accepted change is present on the intended delivery branch and its lifecycle
closeout is recorded.

**deployed**
The delivered change is running in the claimed environment. A merge is not
deployment evidence.

**UAT-verified**
Authorized user-acceptance evidence confirms behavior in the stated acceptance
environment. UAT and deployment are separate evidence axes; neither state alone
proves the other.

## 3Ci training terms

**disposable repository**
A temporary local repository or designated per-learner training repository that
can be reset without affecting this course repository or any business system.

**3Ci policy overlay**
A rule selected by 3Ci for this training or its repositories, clearly labeled
so learners do not mistake it for a universal Directive default.

**independent-learner pilot**
A validation exercise in which representative engineers complete the material
using only documented instructions, hints, recovery, and solutions. It does not
change the course from self-directed to instructor-led.

## Legacy note

vBRIEF, schema 0.6, retired Python launchers, `.deft/core/run`, and frozen
migration-only workflows are legacy. They are intentionally excluded from the
beginner path. Encountering legacy wording in a released help surface is a
version-drift finding to record, not a reason to teach the older model.

- Previous: [Course map](../curriculum/README.md)
- Next: [Quick reference](QUICK-REFERENCE.md)
