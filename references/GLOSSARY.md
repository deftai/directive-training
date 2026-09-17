# Directive training glossary

These definitions describe the course baseline: `@deftai/directive` 0.119.2
and xBRIEF schema 0.8, verified through 2026-09-12. See
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

**session recovery**
The bounded route for restoring mutation readiness after a same-worktree
interruption or stale ritual. In the teaching baseline, `deft session:ready` is
the one-shot recovery surface. Recovery restores session conditions; it does
not select work or supply implementation authority.

**active contract**
The active/running scope xBRIEF together with the human operator's live
instruction. A completed xBRIEF records prior lifecycle closeout; it does not authorize
future work.

**implementation readiness**
Current proof that repository identity, branch, working state, session ritual, active scope,
and required start gates are aligned before a product mutation. Readiness constrains when
implementation may begin; it does not prove the implementation is correct.

**focused check**
The smallest test command that directly exercises the behavior under change. A focused
check accelerates feedback but does not replace scope, diff, or aggregate evidence.

**literal acceptance**
Execution of the active xBRIEF's stored acceptance commands verbatim. It proves the declared
command set ran; it does not replace forward coverage or the repository aggregate gate.

**red-green-refactor**
An evidence sequence: observe the intended test failure, implement until the frozen test
passes, then improve the implementation while that same behavior stays green.

**gate integrity**
The rule that a failing product or process gate is repaired in the governed work or its
legitimate cause, not by weakening the comparison method solely to obtain green output.

**behavioral evidence**
Test or runtime output proving what the product does for named inputs and conditions.

**diff evidence**
Repository output proving which tracked paths changed and whether the patch is mechanically
clean. Diff evidence complements behavioral evidence; neither substitutes for the other.

## Durable state and lifecycle

**xBRIEF**
Directive's structured project and work-state format. Current course writes
use schema version 0.8. Scope records are durable; some session artifacts are
tactical or consumed during recovery. Chat history does not replace current
project or scope state.

**scope xBRIEF**
A bounded work contract containing a goal, observable acceptance, planned
items, evidence commands, and lifecycle metadata.

**proposed scope**
A reviewable scope xBRIEF candidate whose `plan.status` remains `proposed`.
Proposal records shaped work for review; it does not grant implementation
authority.

**specification**
Durable requirements describing what the product or feature must do. It shapes
scopes but is not a substitute for an active implementation contract.

**plan**
The structured object within an xBRIEF. The separate `plan.xbrief.json` file
holds tactical session planning. An ordered work-selection plan is a distinct
mechanism; neither silently expands an active scope.

**continue artifact**
Persisted recovery context in `continue.xbrief.json`, consumed on successful
resume. It helps reestablish a session but does not replace the current project
definition, active scope, or live instruction.

**proposed**
Work has been shaped for consideration but is not approved for implementation.

**promotion**
The governed lifecycle transition from `proposed/proposed` to `pending/pending`.
Promotion admits a scope to approved pending work; it does not make that scope current.

**pending**
Work has been promoted into the approved work set but is not currently active.

**activation**
The governed lifecycle transition from `pending/pending` to `active/running`.
Activation establishes the durable current scope, but live implementation intent and
applicable readiness gates remain separate requirements.

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

**lifecycle evidence**
The command, exit code, relevant output, folder/status pair, release pin, environment,
and safety-boundary facts that support a lifecycle claim. A final folder alone can omit
the expected failure or ordering needed to explain how the state was reached.

## Work shaping

**horizontal plan**
A plan organized mainly by technical layer or component, such as database,
API, and interface work. It may identify useful tasks, but it does not by
itself describe an end-to-end, human-observable capability.

**vertical slice**
A narrow end-to-end change through the relevant layers that produces an
independently demoable, human-observable capability. It must be independently
verifiable; it need not be independently deployable in every environment.

**tracer bullet**
A deliberately narrow but complete path through the relevant layers, used to
prove a capability or expose uncertainty. It remains a vertical slice only
when its result can be demonstrated and verified independently.

**epic**
A body of work too broad to be one independently verifiable story. Decompose it
into ordered slices and record why each dependency and slice boundary exists.

**decomposition DAG**
The directed acyclic graph formed by stories and their dependencies. Story
dependencies use `plan.metadata.swarm.depends_on`; phase or epic records may
also summarize relationships with `plan.metadata.dependencies`.

## Sources, projections, and proof

**source of truth**
The authoritative artifact for a fact. In this project, xBRIEF owns project and
work state, repository Markdown owns lesson text, and upstream released sources
define how Directive behaves.

**projection**
Generated or rendered output derived from a source, such as a specification
Markdown rendering, codebase map, or future internal-publishing page. Repair the
source and regenerate; do not promote the projection over its source.

**projection freshness**
Agreement of an existing view with its expected rendering. In the 0.119.2 MAP
check, absence is allowed; a task requiring a MAP must separately prove that
it exists and contains the intended result. See [Module 5](../curriculum/modules/05-sources-versus-projections.md).

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

**expected-failure capture**
A successful wrapper result that preserves an intended nested failure as
evidence. In the [capstone](../curriculum/capstone-end-to-end.md), the `red` and
first `aggregate` helper verbs exit successfully and print `EXPECTED_FAILURE`;
the retained JSON contains the nested nonzero exit.

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

**pre-PR review**
The `Read -> Write -> Lint -> Diff -> Loop` self-review performed before a PR
handoff. Any edit restarts the loop; exit requires one complete zero-change
pass.

**P0 / P1 / P2**
Review severities. In the Module 11 fixed policy, P0 is critical, P1 is a
serious correctness or acceptance defect, and P2 is nonblocking. The supplied
P0 and P1 are in scope and block; severity and acceptance scope remain separate
judgments.

**coherent fix batch**
One related repair that resolves all blocking in-scope findings, includes the
necessary tests and cross-file consistency work, records other dispositions,
and creates one reviewed head rather than one push per finding. Do not push
again while review of that head is in progress. New blocking findings start a
new classify-and-batch iteration.

**current-head review**
Review evidence bound to the revision now proposed for merge. A review of an
earlier head is stale after a fix creates a new head.

**current-product review**
Evidence bound to the current uncommitted product digest. The capstone's
simulated `currentHeadReview: CLEAN` value has this narrower meaning: closeout
must prove the reviewed bytes are unchanged, commit them, and rerun the
aggregate before any current-head gate claim is possible.

**capstone helper completion**
The fixture stage `COMPLETE`, meaning the guarded exercise sequence finished.
It does not mean the active xBRIEF was completed, the work was delivered, or a
deployment or UAT event occurred.

**ordered plan**
An operator-set short sequence that binds bare continuation language such as
“proceed” to its current entry. An active ordered plan takes precedence over the
ranked queue; exhaustion stops selection until the operator names a target or
explicitly switches to queue selection.

**ranked queue**
A cache-backed ordering of candidate backlog work used when no bounded ordered
plan takes precedence or the operator explicitly switches selection paths. It
is not inferred from a folder listing and does not authorize implementation.

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
Required current checks and current-head review support merging, with zero
unresolved P0 or P1 findings, subject to the repository's separate human or
automated merge authority.

**integration-merged**
The change is merged into an integration branch but is not yet proven reachable
from the configured delivery branch. Directive's exact machine state is
`merged_to_integration`.

**delivery branch**
The configured branch whose reachable history supplies the Git half of
delivery evidence. An integration-branch merge is not delivery-branch
reachability.

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

**local policy overlay**
A rule selected by the organization for this training or its repositories, stated with its
source so learners do not mistake it for a universal Directive default.

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
