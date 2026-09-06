<!-- deft:template -->
<!-- Purpose: pre-build cost estimate for the approved Modules 2-3 curriculum scope -->

# Cost & Budget Estimate

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
