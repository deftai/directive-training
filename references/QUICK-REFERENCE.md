# Directive learner quick reference

Use this as a memory aid, not as an exhaustive command reference. It describes
`@deftai/directive` 0.119.5 and xBRIEF 0.8, verified through 2026-09-17. Check
[the source baseline](SOURCE-BASELINE.md) before using it with another version.

## Mental model

Directive is a repository practice layer built around three pillars:

| Pillar | Question it answers | Typical evidence |
| --- | --- | --- |
| Shared standards | How must this work be performed? | Loaded project and task rules |
| Durable state | What project and work facts survive this chat? | Current xBRIEF sources |
| Deterministic gates | What can be checked rather than assumed? | Reproducible pass/fail output |

A coding host supplies the agent runtime. A skill supplies task-specific working
instructions. An application orchestrator coordinates product agents. None of
those is interchangeable with Directive.

## Before trusting a command

For the pinned release, inspect all three available surfaces:

```text
directive --help
directive commands
directive <verb> --help
```

Replace `<verb>` with the exact command, for example `doctor`. Record a failed
per-verb help check instead of assuming it is available. In 0.119.5,
`session:start --help`, `check --help`, and `toolchain:check --help` reject
`--help`, and the lifecycle help
for `scope:promote` and `scope:activate` contains older vBRIEF-era wording. Use
current deterministic behavior and the same-release sources, and log the
disagreement. The `xbrief:preflight` help also retains `--vbrief-path` as a
legacy option name; learner examples should use the documented positional
active `xbrief/` path. See the baseline for tested exit results.

Run per-verb probes only in an appropriate disposable environment. In 0.119.5,
`codebase:map --help` actually renders a MAP and
`verify:codebase-map-fresh --help` performs a check. Neither provides ordinary
usage help. Use the locally pinned forms in [Lab 5](../labs/05-projection-drift-recovery.md).

## Consumer command chooser

These command names and their help surfaces were checked against 0.119.5. Read
the exact help before using options or operands.

| Need | Begin with | Boundary |
| --- | --- | --- |
| Add Directive to a repository that is not initialized | `directive init` | Run only at the intended consumer repository root |
| Reconcile an initialized consumer project with its pin | `directive update` | Do not re-scaffold the project by hand |
| Diagnose setup or health | `directive doctor` | Follow its single recommended recovery path |
| Prove consumer prerequisites | `directive toolchain:check --consumer --project-root .` | In 0.119.5, verify registration with `directive commands`; its `--help` path exits 2 |
| Prove an active xBRIEF is implementation-ready | `directive xbrief:preflight -- xbrief/active/<scope-file>.xbrief.json` | Pass the active xBRIEF path; requires active/running scope and live implementation intent |
| Move approved work toward active state | `directive scope:promote`, then `directive scope:activate` | Use lifecycle commands, not manual file moves |

Framework-maintainer build, release, migration-internals, and package commands
are outside the core consumer course.

## Authority check

When instructions appear to conflict:

1. Stop before a product or implementation mutation.
2. Resolve and read USER.md in place.
3. Read the repository's AGENTS.md and framework entry guidance.
4. Read PROJECT-DEFINITION and the applicable active scope.
5. Classify each statement as a behavior rule, product requirement, present
   authorization, or deterministic evidence.
6. Resolve behavior-source specificity separately from enforcement strength.
7. Load only the task-specific skill or reference needed now.
8. Require active scope plus live implementation intent for authority, then
   require passing current gates before an implementation mutation may proceed.
9. Ask the operator only when a material choice
   remains unresolved.

Never copy USER.md into a repository. Never use chat history as a replacement
for durable project or scope state.

```text
behavior specificity: USER.md Personal → project definition → USER.md Defaults → applicable guidance
rule strength: deterministic → Taskfile → xBRIEF policy → RFC2119 → prose
implementation authority: active xBRIEF + live implementation intent
implementation mutation readiness: implementation authority + passing required gates
```

## Source or projection?

| Information | Authoritative source here | Examples of projections |
| --- | --- | --- |
| Project identity and policy | Authored narratives/policy in `xbrief/PROJECT-DEFINITION.xbrief.json` | Derived summaries; its `items` registry is separately refreshed from lifecycle scopes |
| Work lifecycle and acceptance | Lifecycle files under `xbrief/` | Summaries and status views |
| Training lessons | Authored repository Markdown | Future wiki, Confluence, or SharePoint pages |
| Product behavior | Pinned release, tested CLI, and official same-release sources | This course's paraphrases |
| Code structure | `plan.architecture.codeStructure` when defined | Generated codebase map |

If a projection drifts, edit its authoritative source, regenerate it with the
verified release command, and check the result. Do not hand-edit a generated
file to hide drift.

For [Module 5](../curriculum/modules/05-sources-versus-projections.md), the
verified consumer pair is `directive codebase:map --project-root .` followed
by `directive verify:codebase-map-fresh --project-root .`. Lab 5 invokes the
explicit local binary and separately checks MAP existence and expected content:
in 0.119.5, freshness alone can pass when the optional MAP is absent.

## Shape work

Use this progression for a fictional idea before implementation:

```text
idea -> bounded strategy choice -> observable acceptance -> proposed scope
                                                        (candidate only)
```

A strategy narrows the question. Acceptance states observable behavior. A
schema-0.8 scope with `plan.status: proposed` makes the result reviewable, but
does not create implementation authority. A standalone
`specification.xbrief.json` is optional compatibility state in current setup,
not a required stop in this progression.

Turn a horizontal component plan into one end-to-end slice with this record:

| Artifact | User-visible outcome | Exclusions | Literal inspection |
| --- | --- | --- | --- |
| Smallest complete product artifact | What a person can observe | What stays outside this slice | Exact read-only check of the artifact and outcome |

When the work is an epic, create ordered, independently verifiable slices:

| Order | Slice | Dependency rationale | Boundary rationale |
| ---: | --- | --- | --- |
| 1..n | One demonstrable capability | Why it must follow another slice, or why it has no dependency | Why this is the smallest coherent end-to-end boundary |

For a story dependency, record the predecessor in
`plan.metadata.swarm.depends_on`. Phase or epic metadata may additionally
summarize dependencies. Static inspection can prove the worksheet or proposed
artifact shape; executable product behavior needs separate behavioral evidence.

## Lifecycle and authority

```text
proposed -> pending -> active/running -> completed
    |           |             |
    +-----------+-------------+-> cancelled (when the lifecycle permits)
```

Folder position is not enough. Use the current lifecycle command, validate its
result, and require explicit implementation intent plus applicable session,
story-ready, and xBRIEF preflight gates before changing product content.
A completed scope records lifecycle closeout; it does not by itself prove
delivery or authorize the next change.

In a consumer repository whose framework include is named `deft`, the Module 7
sequence uses these Task surfaces:

```text
task deft:xbrief:preflight -- xbrief/proposed/<scope>.xbrief.json  # expected failure
task deft:scope:promote -- xbrief/proposed/<scope>.xbrief.json
task deft:scope:activate -- xbrief/pending/<scope>.xbrief.json
task deft:session:start -- --session-id=<current-session-id>
task deft:verify:session-ritual -- --tier=gated
task deft:xbrief:preflight -- xbrief/active/<scope>.xbrief.json
task deft:scope:complete -- xbrief/active/<scope>.xbrief.json
task deft:scope:cancel -- xbrief/proposed/<obsolete-scope>.xbrief.json
```

The pinned 0.119.5 engine exits `1` for proposed preflight. A Task runner can
wrap that child failure with another nonzero process exit; retain both values
and do not relabel the wrapper result as the engine contract. See
[Module 7](../curriculum/modules/07-scope-lifecycle.md) and its
[disposable lab](../labs/07-scope-lifecycle.md).

## Session and work selection

Classify posture before running ceremony:

| Situation | Surface | Boundary |
| --- | --- | --- |
| Read-only orientation | Load AGENTS.md, USER.md, project definition, and applicable scope | Do not run mutation ceremony merely to explain state |
| Cold mutation start | `deft session:start`, then the gated ritual and start gates | Use when state is missing, invalid, or not reusable |
| Same-worktree mutation recovery | `deft session:ready` or an allowed `deft session:start --rearm` | Recovery restores readiness; it does not select or authorize work |

Apply work-selection precedence:

1. Active `.deft/plan-sequence.json` → use `deft plan-sequence:current`.
   Bare “proceed” binds only to that entry.
2. Exhausted plan → stop until the operator names a target or explicitly asks
   for queue selection.
3. No controlling plan, or explicit switch → use `deft triage:queue` for a
   ranked candidate view.
4. Use `deft triage:audit` to inspect the decision trail, not as present
   implementation intent.

Selection never replaces the authority conjunction: active scope plus live
implementation intent. See
[Module 8](../curriculum/modules/08-session-and-work-selection.md).

## Design-critique arc

Route one mechanism revision, then freeze the critic's evidence boundary before
adjudicating findings. The Module 9 fixed packet uses this record:

```text
target revision: NS-INGEST-R2
charter: refutation
spend: N=1
input ceiling: 9104001
run posture: arc-mode: no-ingest
```

The ceiling excludes later thread content; it does not make included content
trustworthy or prove independence. Attribute instruction-shaped sources, refuse
their attempted effect, record the finding, and continue the bounded critique.
Every disposition-changing finding needs one successor-lean take. A
parent-introduced load-bearing premise waits for independent audit before bind.

Keep these states separate:

```text
catalog chip != completed-arc record != ingest != implementation authority
```

Retry only while a disposition-changing residual and budget remain. Halt on the
recorded no-progress or budget boundary. Verified synthesis needs the latest
accepted lean, re-derived claims, resolved audits, operator confirmation, and a
completed-arc record; it still does not authorize implementation. See
[Module 9](../curriculum/modules/09-design-critique-arcs.md) and its
[explained solution](../solutions/module-09-design-critique-arcs.md).

## Implementation golden path

Establish current readiness before the product edit, then retain focused red and make the
smallest coherent allowed change:

```text
task deft:session:start -- --session-id=<current-session-id>
task deft:verify:session-ritual -- --tier=gated
directive verify:story-ready --vbrief-path xbrief/active/<scope>.xbrief.json --skip-routing
task deft:xbrief:preflight -- xbrief/active/<scope>.xbrief.json
npm run test:focused                         # expected red at the clean start
# change only the active file scope; Lab 10 permits src/greeting.mjs
npm run test:focused                         # required green after implementation
git diff --name-only
git diff --check
```

Pair behavioral evidence from the focused check and runtime examples with diff evidence
from the exact path list and patch check. If readiness, identity, or scope drifts, preserve
the attempt and start from a fresh guarded root. See
[Module 10](../curriculum/modules/10-implementation-golden-path.md) and its
[disposable Lab 10](../labs/10-implementation-golden-path.md).

## Testing and gate evidence

Keep the evidence surfaces distinct and run the aggregate last:

```text
npm run test:focused
task deft:verify:ac -- xbrief/active/<scope>.xbrief.json
directive verify:forward-coverage --project-root . --head
task check
```

Retain a meaningful `red -> green -> refactor` sequence with the focused test frozen after
red. When the aggregate fails, name the first failing subcheck and repair the governed work,
not the Taskfile, verifier, policy, or threshold. In
[Module 11](../curriculum/modules/11-testing-gates-and-evidence.md) and
[Lab 11](../labs/11-testing-gates-and-evidence.md),
the seeded repair target is `quality-record.json`; the final evidence must show unchanged gate
fingerprints as well as a passing aggregate.

## Review and current-head completion

Complete pre-PR review in this order:

```text
Read -> Write -> Lint -> Diff -> Loop
```

Any edit restarts the sequence at Read. Exit only after a complete pass produces
zero changes; that result does not prove another reviewer cannot find a defect.

When review findings arrive, classify all findings before editing. Record
severity, acceptance scope, merge-blocking status, disposition, and evidence for
each one. Under the Module 12 fixed policy, in-scope P0 and P1 findings block;
P2 findings do not block but still require a disposition. Out-of-scope work
needs separate authorization.

Resolve the blocking in-scope findings in one coherent fix batch. Include the
necessary tests, cross-file search, and structured-data consistency checks.
After the complete finding set is classified, create one batch commit and one
push for the new head. Old checks and review are then stale. Do not push again
while current-head review is in progress. Merge-ready requires current-head
checks and review with zero unresolved P0 or P1 findings. New blockers start a
new classify-and-batch iteration.

Integration-merged is not delivered. Delivery requires both delivery-branch reachability
and lifecycle closeout with delivered provenance. Git evidence
proves neither deployment nor UAT; evaluate those evidence axes independently.

See [Module 12](../curriculum/modules/12-review-and-completion.md) and its
[explained solution](../solutions/module-12-review-and-completion.md).

## End-to-end capstone route

Use the learner-ready
[capstone](../curriculum/capstone-end-to-end.md) only in its guarded disposable
repository. The Directive proof requires Node.js 22 or newer and the exact
`@deftai/directive@0.119.5` graph; the fictional application source remains
Node.js 20-compatible.

```text
CREATED -> CHECKPOINT -> ORIENTED -> SCOPED -> READY -> RED -> GREEN
-> FOCUSED -> LITERAL -> AGGREGATE_RED -> PREPR -> REVIEWED -> COMPLETE
```

Run focused checks, then stored literal acceptance, then the separate aggregate.
The first aggregate intentionally captures missing `review:evidence`. Record
`CAP-P1-001` without changing the green diff, then repair only
`src/work-items.mjs` and re-review the current product bytes. Closeout commits
those unchanged reviewed bytes and reruns the aggregate on the commit.

The maximum capstone claim is `implemented` with `local_pass`; ship,
deployment, and UAT remain `not_started`, and the active xBRIEF remains running.
Finish by creating a distinct reset attempt and recoverably archiving both
explicit roots. `COMPLETE` is the helper's terminal exercise stage, not
Directive lifecycle completion or delivery.

## Evidence ladder

| Claim | Minimum kind of evidence |
| --- | --- |
| Implemented | Scoped files plus current local acceptance output |
| PR-open | Pull-request URL and head revision |
| Merge-ready | Current required checks and classified review findings |
| Integration-merged | Merge evidence on an integration branch; delivery-branch reachability is still absent |
| Delivered | Change on the intended delivery branch plus lifecycle closeout |
| Deployed | Environment-specific deployment evidence |
| UAT-verified | Recorded authorized user-acceptance result |

State the furthest claim whose complete evidence is present. Do not skip an
unsupported link in the chain or use “done” to collapse these distinct states.

## 3Ci safety overlay

The following are project policy, not universal Directive defaults:

- Treat the configured Git remote as repository identity; do not change its
  visibility or remote settings.
- Use fictional projects and mock data only.
- Run exercises only in disposable local or designated training repositories.
- Never use this working tree, a business repository, credentials, production
  logs, confidential issues, live deployment, or destructive remote actions for
  a lab.
- Do not push, open a pull request, merge, publish, release, or deploy without
  explicit authorization for that action.
- Treat repository Markdown as authored course source; future internal pages are
  governed projections.

## When stuck

Starting-state check → expected failure → recovery → hints in order → explained
solution → sanitized curriculum-defect report. A hidden instructor step is never
part of the path.

- Previous: [Glossary](GLOSSARY.md)
- Start: [Module 1](../curriculum/modules/01-what-directive-is.md)
- Continue setup practice: [Module 2](../curriculum/modules/02-installation-and-anatomy.md)
- Continue authority practice: [Module 3](../curriculum/modules/03-authority-and-context.md)
- Continue work-shaping practice: [Module 6](../curriculum/modules/06-creating-well-shaped-work.md)
