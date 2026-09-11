<!-- deft:template -->
<!-- Purpose: current Module 11 and capstone cost estimate with prior curriculum estimates retained -->

# Cost & Budget Estimate

## Current scope — Module 11 and capstone (2026-09-10)

Currency: **USD**. This scope completes the core course with a 55-minute Module
11 lesson and simulated review exercise, then adds a two-hour disposable
end-to-end capstone with a guarded fictional fixture, checkpoints, progressive
hints, reset and cleanup, an evidence rubric, and an explained solution. It
introduces no hosting service, paid account, publishing platform, production
runtime, credential, learner-facing remote operation, or live review-bot
dependency.

### TL;DR

For one private curriculum repository using existing 3Ci tooling, the expected
incremental monthly service band is **low $0 / typical $0 / high $0**. The
meaningful cost is approximately **48–80 hours** of focused command
revalidation, lesson and exercise authoring, disposable fixture construction,
safety and recovery testing, source tracing, validation, and review. Ongoing
maintenance attributable to these final two course units is approximately
**2–4 hours per month**.

### Assumptions and scale considerations

- The scale assumption is one private curriculum repository, one local
  simulated-review exercise, and one disposable capstone attempt per learner,
  using existing 3Ci GitHub, coding-agent, workstation, Node.js, npm, and
  GitHub Actions access.
- Module 11 uses deterministic simulated findings so a learner can classify,
  batch, resolve, and verify review work without depending on a live review
  bot.
- The capstone creates only a unique OS-temporary fictional repository,
  configures no remote, and provides bounded reset and cleanup paths. It must
  not mutate this training repository or any business repository.
- The project remains pinned to Directive 0.112.0 for learner-facing claims;
  the installed 0.114.0 authoring engine is used only to identify and record
  drift.
- macOS, Linux, and Windows claims require independent execution evidence;
  unexecuted paths remain explicitly candidate or unsupported.
- Publishing, paid services, business-repository exercises, a release-pin
  change, real remote review or merge actions, and production deployment are
  excluded and require a new estimate.

### What you will need to sign up for

No new account is expected. Contributors use the existing private 3Ci GitHub
organization, approved coding-agent access, Git, Node.js 20 or later, npm, and
the repository's existing GitHub Actions capability.

### Hosting, infrastructure, and third-party fees

None are expected for this scope. Both exercises run from authored repository
content and disposable local repositories with no configured remote. The work
does not deploy, publish, use a paid external service, or require Greptile.

### Monthly band

- **Low** _(quiet month)_: about **$0 per month**
- **Typical** _(one private repository and ordinary learner attempts)_: about
  **$0 per month**
- **High** _(heavier use within the same approved boundary)_: about **$0 per
  month**

The $0 band depends on existing 3Ci tooling access. Separately billed CI or
agent usage, paid publishing, remote lab infrastructure, or real hosted review
services would change the boundary and require a new estimate.

### Build and maintenance time

- **Directive 0.112.0 review and closeout command revalidation**: about
  **6–10 hours**
- **Module 11 lesson, simulated review exercise, completion-state practice,
  and explained solution**: about **14–22 hours**
- **Guarded capstone fixture, starting-state checks, reset, and cleanup**:
  about **12–20 hours**
- **Capstone walkthrough, checkpoints, hints, evidence rubric, and solution**:
  about **10–16 hours**
- **Focused verifiers, negative tests, navigation, source trace, portability
  evidence, and review**: about **6–12 hours**
- **Total build**: about **48–80 hours**
- **Maintenance**: about **2–4 hours per month**, plus focused revalidation
  after a material Directive release

### Decision recorded — current scope

- **Decision**: Build
- **Date**: 2026-09-10
- **Recorded by**: David
- **Selection**: Option 1, Build
- **Confirmation**: “1”
- **Boundary**: Local Module 11 and capstone implementation after the
  active-story and change-proposal gates pass. This decision does not authorize
  a release-pin change, push, pull-request creation, merge, deployment,
  publication, branch deletion, or worktree removal.

## Prior scope — Module 10 (2026-09-10)

Currency: **USD**. Module 10 adds one Markdown lesson, one guarded disposable
Node.js red-green-refactor lab, a seeded aggregate-gate failure, an explained
solution, source trace and navigation updates, and focused validation with
negative tests. It introduces no hosting service, paid account, publishing
platform, production runtime, credential, learner-facing remote operation, or
live review-bot dependency.

### TL;DR

For one private curriculum repository using existing 3Ci tooling, the expected
incremental monthly service band is **low $0 / typical $0 / high $0**. The
meaningful cost is approximately **24–44 hours** of focused command
revalidation, guarded fixture and lab construction, lesson and solution
authoring, source tracing, validation, and review. Ongoing maintenance
attributable to this module is approximately **1–2 hours per month**.

### Assumptions and scale considerations

- The scale assumption is one private curriculum repository and one disposable
  local red-green-refactor lab attempt per learner, using existing 3Ci GitHub,
  coding-agent, workstation, Node.js, npm, and GitHub Actions access.
- The lab creates only a unique OS-temporary repository, configures no remote,
  and uses fictional data. It must demonstrate a failing test, the narrow
  product repair, refactoring under green tests, literal acceptance, and a
  seeded aggregate-gate failure repaired in the work rather than the gate.
- The project remains pinned to Directive 0.112.0 for learner-facing claims;
  the installed 0.114.0 authoring engine is used only to identify and record
  drift.
- macOS, Linux, and Windows claims require independent execution evidence;
  unexecuted paths remain explicitly candidate or unsupported.
- Publishing, paid services, business-repository exercises, a release-pin
  change, Module 11, and the capstone are excluded and require a new estimate.

### What you will need to sign up for

No new account is expected. Contributors use the existing private 3Ci GitHub
organization, approved coding-agent access, Git, Node.js 20 or later, npm, and
the repository's existing GitHub Actions capability.

### Hosting, infrastructure, and third-party fees

None are expected for this scope. The lab runs only in a disposable local
repository with no remote, and repository validation uses existing GitHub
Actions access. It does not deploy, publish, use a paid external service, or
require Greptile.

### Monthly band

- **Low** _(quiet month)_: about **$0 per month**
- **Typical** _(one private repository and ordinary learner attempts)_: about
  **$0 per month**
- **High** _(heavier use within the same approved boundary)_: about **$0 per
  month**

The $0 band depends on existing 3Ci tooling access. Separately billed CI or
agent usage, new paid accounts, publication, or remote lab infrastructure would
change the boundary and require a new estimate.

### Build and maintenance time

- **Directive 0.112.0 gate and command revalidation**: about **4–8 hours**
- **Guarded fixture, red-green-refactor flow, and seeded gate failure**: about
  **8–14 hours**
- **Lesson, explained solution, navigation, and source trace**: about **6–10
  hours**
- **Focused verifier, negative tests, portability evidence, and review**:
  about **6–12 hours**
- **Total build**: about **24–44 hours**
- **Maintenance**: about **1–2 hours per month**, plus focused revalidation
  after a material Directive release

### Decision recorded — prior scope

- **Decision**: Build
- **Date**: 2026-09-10
- **Recorded by**: David
- **Selection**: Option 1, Build
- **Confirmation**: “1”
- **Boundary**: Module 10 local implementation after its active-story and
  change-proposal gates pass. This decision does not authorize a release-pin
  change, Module 11 implementation, push, pull-request creation, merge,
  deployment, publication, branch deletion, or worktree removal.

## Prior scope — Module 9 (2026-09-10)

Currency: **USD**. Module 9 adds one Markdown lesson, one guarded disposable
Node.js implementation lab, a fictional fixture, an explained solution, source
trace and navigation updates, and focused validation with negative tests. It
introduces no hosting service, paid account, publishing platform, production
runtime, credential, learner-facing remote operation, or live review-bot
dependency.

### TL;DR

For one private curriculum repository using existing 3Ci tooling, the expected
incremental monthly service band is **low $0 / typical $0 / high $0**. The
meaningful cost is approximately **24–48 hours** of focused command
revalidation, guarded fixture and lab construction, lesson and solution
authoring, source tracing, validation, and review. Ongoing maintenance
attributable to this module is approximately **1–2 hours per month**.

### Assumptions and scale considerations

- The scale assumption is one private curriculum repository and one disposable
  local implementation lab attempt per learner, using existing 3Ci GitHub,
  coding-agent, workstation, Node.js, npm, and GitHub Actions access.
- The lab creates only a unique OS-temporary repository, configures no remote,
  uses fictional data, and permits product mutation only in
  `src/greeting.mjs` after readiness evidence passes.
- The project remains pinned to Directive 0.112.0 for learner-facing claims;
  the installed 0.114.0 authoring engine is used only to identify and record
  drift.
- macOS, Linux, and Windows claims require independent execution evidence;
  unexecuted paths remain explicitly candidate or unsupported.
- Publishing, paid services, business-repository exercises, a release-pin
  change, Modules 10–11, and the capstone are excluded and require a new
  estimate.

### What you will need to sign up for

No new account is expected. Contributors use the existing private 3Ci GitHub
organization, approved coding-agent access, Git, Node.js 20 or later, npm, and
the repository's existing GitHub Actions capability.

### Hosting, infrastructure, and third-party fees

None are expected for this scope. The lab runs only in a disposable local
repository with no remote, and repository validation uses existing GitHub
Actions access. It does not deploy, publish, use a paid external service, or
require Greptile.

### Monthly band

- **Low** _(quiet month)_: about **$0 per month**
- **Typical** _(one private repository and ordinary learner attempts)_: about
  **$0 per month**
- **High** _(heavier use within the same approved boundary)_: about **$0 per
  month**

The $0 band depends on existing 3Ci tooling access. Separately billed CI or
agent usage, new paid accounts, publication, or remote lab infrastructure would
change the boundary and require a new estimate.

### Build and maintenance time

- **Directive 0.112.0 readiness and command revalidation**: about **4–8
  hours**
- **Guarded fixture and disposable implementation lab**: about **8–16 hours**
- **Lesson, explained solution, navigation, and source trace**: about **6–12
  hours**
- **Focused verifier, negative tests, portability evidence, and review**:
  about **6–12 hours**
- **Total build**: about **24–48 hours**
- **Maintenance**: about **1–2 hours per month**, plus focused revalidation
  after a material Directive release

### Decision recorded — prior scope

- **Decision**: Build
- **Date**: 2026-09-10
- **Recorded by**: David
- **Selection**: Option 1, Build
- **Confirmation**: “1”
- **Boundary**: Module 9 implementation after explicit confirmation of
  `/deft:directive:change module-9-curriculum`. This cost decision does not
  itself authorize a release-pin change, Module 10 or 11 implementation,
  deployment, publication, branch deletion, or worktree removal.

## Prior scope — Module 8 (2026-09-10)

Currency: **USD**. Module 8 adds one Markdown lesson built from fixed fictional
request cards and state snapshots, an explained solution, source trace and
navigation updates, and focused validation with negative tests. It introduces
no hosting service, paid account, publishing platform, production runtime,
credential, live GitHub backlog access, or learner-facing remote operation.

### TL;DR

For one private curriculum repository using existing 3Ci tooling, the expected
incremental monthly service band is **low $0 / typical $0 / high $0**. The
meaningful cost is approximately **16–32 hours** of focused command
revalidation, lesson and exercise authoring, source tracing, validation, and
review. Ongoing maintenance attributable to this module is approximately
**1–2 hours per month**.

### Assumptions and scale considerations

- The scale assumption is one private curriculum repository and one
  self-directed fixed-state exercise per learner, using existing 3Ci GitHub,
  coding-agent, workstation, Node.js, and npm access.
- Learners use only sanitized fictional request cards and state snapshots. No
  exercise reads a live GitHub backlog, Directive cache, audit log, or
  confidential repository.
- The project remains pinned to Directive 0.112.0 for learner-facing claims;
  the installed 0.114.0 engine is used only to identify and record drift.
- Publishing, paid services, live remote exercises, a release-pin change,
  Modules 9–11, and the capstone are excluded and require a new estimate.

### What you will need to sign up for

No new account is expected. Contributors use the existing private 3Ci GitHub
organization, approved coding-agent access, Git, Node.js 20 or later, npm, and
the repository's existing validation capability.

### Hosting, infrastructure, and third-party fees

None are expected for this scope. The exercise is authored Markdown with fixed
fictional state and does not deploy, publish, contact a learner repository, or
use a paid external service.

### Monthly band

- **Low** _(quiet month)_: about **$0 per month**
- **Typical** _(one private repository and ordinary learner attempts)_: about
  **$0 per month**
- **High** _(heavier use within the same approved boundary)_: about **$0 per
  month**

The $0 band depends on existing 3Ci tooling access. Publication, separately
billed automation, new paid accounts, or live remote training infrastructure
would change the boundary and require a new estimate.

### Build and maintenance time

- **Directive 0.112.0 session and work-selection revalidation**: about **3–6
  hours**
- **Lesson, fixed request cards, state snapshots, and decision matrix**: about
  **6–12 hours**
- **Explained solution, navigation, glossary, and source trace**: about **3–6
  hours**
- **Focused verifier, negative tests, conformance, and review**: about **4–8
  hours**
- **Total build**: about **16–32 hours**
- **Maintenance**: about **1–2 hours per month**, plus focused revalidation
  after a material Directive release

### Decision recorded — prior scope

- **Decision**: Build
- **Date**: 2026-09-10
- **Recorded by**: David
- **Selection**: Option 1, Build
- **Confirmation**: “built it”
- **Boundary**: Module 8 local implementation and the confirmed
  `/deft:directive:change module-8-curriculum` proposal. This decision does
  not authorize Modules 9–11, live backlog access, push, pull-request
  creation, merge, branch deletion, worktree removal, deployment, or
  publication.

## Prior scope — Module 7 (2026-09-09)

Currency: **USD**. Module 7 adds one Markdown lesson, one guarded disposable
lifecycle lab, a fictional fixture, an explained solution, source trace and
navigation updates, and focused validation with negative and portability tests.
It introduces no hosting service, paid account, publishing platform, production
runtime, credential, or learner-facing remote operation.

### TL;DR

For one private curriculum repository using existing 3Ci tooling, the expected
incremental monthly service band is **low $0 / typical $0 / high $0**. The
meaningful cost is approximately **30–46 hours** of focused source checking,
lesson and lab authoring, safety validation, platform evidence, and review.
Ongoing maintenance attributable to this module is approximately **2–3 hours
per month**.

### Assumptions and scale considerations

- The scale assumption is one private curriculum repository and one disposable
  local lab attempt per learner, using existing 3Ci GitHub, coding-agent,
  workstation, Node.js, npm, and GitHub Actions access.
- The lab creates only unique temporary repositories, configures no remote, and
  uses fictional data. Reset and cleanup remain bounded to the named lab root.
- macOS, Linux, and Windows claims require independent execution evidence;
  unexecuted paths remain explicitly candidate or unsupported.
- Publishing, paid services, business-repository exercises, a Directive
  release-pin change, Modules 8–11, and the capstone are excluded and require a
  new estimate.

### What you will need to sign up for

No new account is expected. Contributors use the existing private 3Ci GitHub
organization, approved coding-agent access, Git, Node.js 20 or later, npm, and
the repository's existing GitHub Actions capability.

### Hosting, infrastructure, and third-party fees

None are expected for this scope. The lab runs only in disposable local
repositories and must not contact a remote. Repository validation uses existing
GitHub Actions access and does not deploy or publish anything.

### Monthly band

- **Low** _(quiet month)_: about **$0 per month**
- **Typical** _(one private repository and ordinary learner attempts)_: about
  **$0 per month**
- **High** _(heavier use within the same approved boundary)_: about **$0 per
  month**

The $0 band depends on existing 3Ci tooling access. Separately billed CI usage,
new paid platform accounts, publication, or remote lab infrastructure would
change the boundary and require a new estimate rather than silently raising the
high band.

### Build and maintenance time

- **Directive 0.112.0 lifecycle and preflight revalidation**: about **4–7
  hours**
- **Lesson, disposable fixture, and lifecycle lab**: about **12–18 hours**
- **Safety guard, reset, cleanup, solution, and navigation**: about **6–9
  hours**
- **Focused verifier, negative tests, platform evidence, and review**: about
  **8–12 hours**
- **Total build**: about **30–46 hours**
- **Maintenance**: about **2–3 hours per month**, plus focused revalidation
  after a material Directive release

### Decision point — prior scope

1. **Build** -- accept the cost and start the build phase.
2. **Rescope** -- keep building but reduce cost first.
3. **No-build** -- stop here and record the reason.
4. **Skip** -- skip the cost phase and record a short reason.

### Decision recorded — prior scope

- **Decision**: Build
- **Date**: 2026-09-09
- **Recorded by**: David
- **Selection**: Option 1, Build
- **Boundary**: Module 7 local implementation only. A build decision does not
  authorize push, pull-request creation, merge, branch deletion, worktree
  removal, deployment, publication, Module 8, or any remote learner-lab action.

## Prior scope — Module 6 (2026-09-09)

Currency: **USD**. Module 6 adds one command-free Markdown lesson, a fictional
vertical-slice exercise, an explained solution, source trace updates,
navigation updates, and focused validation with negative tests. It introduces
no hosting service, paid account, publishing platform, runtime application, or
learner-facing remote operation.

### TL;DR

For one private curriculum repository using existing 3Ci tooling, the expected
incremental monthly service band is **low $0 / typical $0 / high $0**. The
meaningful cost is approximately **16–26 hours** of focused authoring, source
checking, validation, and review. Ongoing maintenance attributable to this
module is approximately **1–2 hours per month**.

### Assumptions and scale considerations

- Existing private GitHub, coding-agent, workstation, Node.js, npm, and
  GitHub Actions access remain available under current 3Ci arrangements.
- The work remains command-free and uses only fictional planning scenarios.
- Native platform labs, publishing, paid services, Modules 7–11, the capstone,
  and a Directive release-pin change are excluded and require a new estimate.

### Build and maintenance time

- **Directive 0.112.0 claim revalidation**: about **2–4 hours**
- **Lesson and vertical-slice exercise**: about **6–10 hours**
- **Explained solution, navigation, and source trace**: about **3–5 hours**
- **Focused verifier, negative tests, and review**: about **5–7 hours**
- **Total build**: about **16–26 hours**
- **Maintenance**: about **1–2 hours per month**, plus focused revalidation
  after a material Directive release

### Decision recorded — prior scope

- **Decision**: Build
- **Date**: 2026-09-09
- **Recorded by**: David
- **Selection**: Option 1, Build
- **Boundary**: Module 6 local implementation and the confirmed
  `/deft:change module-6-curriculum` proposal. This decision does not authorize
  Modules 7–8, push, pull-request creation, merge, branch deletion, worktree
  removal, deployment, or publication.

## Prior scope — Modules 4–5 (2026-09-07)

Currency: **USD**. That work added two Markdown lessons, explained solutions,
one guarded disposable projection lab, and focused validation. It introduced
no new hosting service, paid account, publishing platform, or runtime
application. Existing workstation, agent-access, and private repository costs
remained under their existing arrangements; metered internal usage was not
estimated here.

For one private curriculum repository and local fictional lab attempts, the
incremental monthly service band was **low $0 / typical $0 / high $0**, assuming
existing tooling access. Those were scope assumptions, not vendor quotes.
Human-equivalent authoring, source checking, lab verification, and review was
estimated at roughly **24–40 hours**; an agent-assisted run was not a
measurement of that human effort. Ongoing content maintenance was estimated at
approximately **1–3 hours per month**, with a new estimate after a release or
scope change.

The executable Lab 5 path was bounded to macOS/zsh. Native Linux/Windows proof,
publishing, paid services, and Modules 6–11 were outside that implementation.
Re-estimate before introducing any remaining item or changing the release pin.

### Decision recorded — prior scope

- **Decision**: Build
- **Date**: 2026-09-07
- **Recorded by**: agent:codex, from David's explicit implementation request
- **Request**: “pull the latest master and proceed to implement the next two
  modules once the lifecycle closeout running in the other session is complete”
- **Boundary**: Local Modules 4–5 implementation after verified upgrade
  closeout. This record does not assert a separate cost-estimate approval or
  authorization for remote publishing, paid purchases, PR creation, or merge.

## Historical estimate — Modules 2–3

The remainder records an earlier scope and its prior decision. It does not
replace the current Module 11 and capstone estimate or any prior module
estimate above.

> All figures are in **US dollars (USD)**. These are loose ranges, not
> guarantees. Re-estimate if the approved scope or service assumptions change.

## TL;DR

The approved Modules 2-3 scope is expected to add **$0 per month** in hosting
or service charges. It creates private Markdown, disposable local lab material,
and a small cross-platform validation workflow; it does not publish or run an
application. The meaningful cost is about **36-56 hours** of authoring,
platform verification, review, and correction time. A later wiki, Confluence,
or SharePoint implementation is not included.

## Assumptions

- 3Ci already provides the private GitHub repository, coding-agent access,
  GitHub Actions allowance, and ordinary engineering workstations used for
  this work.
- The released `@deftai/directive` package, Node.js toolchain, and GitHub-hosted
  macOS, Linux, and Windows validation do not require a new project-specific
  paid account under 3Ci's current agreements.
- This estimate covers only `Modules 2-3: Installation, Project Anatomy,
  Authority, and Context`.
- The scope includes two complete self-directed modules, one executable
  disposable lab, two explained solutions, source revalidation, a small
  platform matrix, navigation updates, and focused content checks.
- No website, LMS, publication connector, external API, deployment, production
  service, live review bot, or business-repository exercise is created.
- If 3Ci's existing GitHub or coding-agent agreements meter this work
  separately, that internal amount is unknown and should be confirmed with the
  relevant account owner.

## What you will need to sign up for

No new account is required under the assumptions above. Contributors need
access to the existing private 3Ci GitHub organization, an approved
coding-agent host, Git, Node.js 20 or later, npm, and the repository's existing
GitHub Actions capability.

## Hosting, infrastructure, and third-party fees

None are expected for this scope. The validation matrix uses the repository's
existing GitHub Actions allowance and operates only on generated disposable
test repositories. It does not deploy, publish, add a remote to a learner lab,
configure a user-managed secret or write-capable token, or persist a Git
credential. GitHub supplies its ephemeral read token to the immutable checkout
and Node setup actions.

## Monthly band

Scale assumption: one private Markdown-first curriculum repository, two
additional core modules, one disposable setup lab, one small three-operating-
system validation matrix, no runtime application, and no publishing system.

- **Low** _(quiet month)_: about **$0 per month** in incremental service costs
- **Typical** _(active authoring and review)_: about **$0 per month** in
  incremental service costs
- **High** _(heavier work within the same approved boundary)_: about **$0 per
  month** in incremental service costs

## Scope changes that require a new estimate

- Selecting and publishing to a wiki, Confluence, or SharePoint
- Buying licenses or adding a paid publication connector
- Adding hosted learner services, an LMS, analytics, video, or external APIs
- Adding native platform infrastructure outside existing GitHub-hosted runners
- Expanding beyond Modules 2-3 or changing the pinned Directive release

## Build & maintenance time

These figures describe focused work, not a price quote.

- **Source and command revalidation**: about **6-10 hours**
- **Module 2, disposable lab, and explained solution**: about **14-22 hours**
- **Module 3, authority exercise, and explained solution**: about **10-14 hours**
- **Cross-platform proof, navigation, checks, and review**: about **6-10 hours**
- **Total build**: about **36-56 hours**
- **Ongoing maintenance attributable to Modules 2-3**: about **2-5 hours per
  month**, plus a focused revalidation after a material Directive release

## Prior decision

David selected **Build** on 2026-09-05 for `Self-Directed Curriculum
Foundation and Module 1 Pilot`. That decision covered only the completed first
milestone and does not authorize this expanded scope.

## Decision point

The recorded decision below governs the Modules 2-3 build phase.

### Decision recorded

- **Decision**: Build
- **Date**: 2026-09-05
- **Recorded by**: David
- **Reason**: David accepted the Modules 2-3 cost expectation and selected the
  build phase.

---

_This estimate is a snapshot. Revisit it before a material scope change or any
internal publishing implementation._
