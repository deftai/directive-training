<!-- deft:template -->
<!-- Purpose: current Module 6 cost estimate with prior curriculum estimates retained -->

# Cost & Budget Estimate

## Current scope — Module 6 (2026-09-09)

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

### Decision recorded — current scope

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
replace either the current Module 6 estimate or the prior Modules 4–5 estimate
above.

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
