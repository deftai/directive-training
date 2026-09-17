# Changelog

## [Unreleased]

### Verified

- Native Windows/PowerShell learner walkthroughs now verify the complete Lab 7,
  Lab 9, and Lab 10 paths against the exact Directive 0.112.0 graph (#78).

### Added

- An MIT license for the repository, with a README link to the license text
  (#1).
- Native Windows/PowerShell learner paths and a three-platform CI proof for
  Labs 7, 9, and 10, including the exact Directive 0.112.0 dependency graph
  and each lab's complete disposable workflow (#78).
- A dedicated fail-closed linked-path safety suite whose Windows preflight
  clearly reports missing file/directory symlink capability without requiring
  that privilege for ordinary training validation (#74).
- A learner-ready [end-to-end capstone](curriculum/capstone-end-to-end.md) with
  a guarded two-hour lab, independently assessable rubric, progressive hints,
  failure-specific recovery, reset-and-archive drill, and explained solution.
- Focused capstone verification and negative tests for the exact Directive
  0.112.0 graph, Node.js 22-or-newer runtime boundary, lifecycle/evidence order,
  gate integrity, state claims, platform provenance, navigation, recovery,
  rubric, and worked-solution contracts.
- Module 11, a command-free fixed-state pre-PR, review-finding, coherent-batch,
  current-head, and evidence-bounded completion lesson with an explained solution.
- Focused Module 11 verification and negative tests for exact Directive 0.112.0
  source evidence, review order, all-finding classification, P0/P1/P2 scope and
  blocking decisions, delivery proof, independent deployment/UAT axes, links,
  lifecycle state, and the learner-ready capstone transition.
- A decomposed and activated Module 11 story xBRIEF with approved local-build
  cost and change records, explicit sequential scope, and literal acceptance
  commands.
- Module 10, a testing-and-gates lesson, guarded disposable red-green-refactor lab,
  seeded aggregate failure, and explained solution for evidence-driven gate diagnosis.
- Focused Module 10 content and fixture tests for exact Directive 0.112.0 pins,
  ordered stage evidence, frozen-test and gate-definition fingerprints, one-record
  repair, fresh reset, and recoverable archive.
- A decomposed and activated Module 10 story xBRIEF with approved local-build cost
  and change records, explicit sequential scope, and literal acceptance commands.
- Module 9, a readiness-before-mutation lesson, guarded disposable implementation lab,
  and explained solution for the one-file test-backed golden path.
- Focused Module 9 content and fixture tests for exact Directive 0.112.0 pins, guarded
  OS-temporary no-remote setup, red-green behavior, paired evidence, fresh reset, and
  recoverable archive.
- A refined Module 9 story xBRIEF, promoted to the pending backlog, that
  separates the implementation golden path from later testing-gate and review
  work with a guarded disposable lab, explicit readiness order, one-file
  product boundary, observable evidence, dependencies, and focused verification
  contracts.
- Module 8, a command-free fixed-state lesson and explained solution for session
  posture, recovery, ordered-plan precedence, ranked-queue selection, state
  roles, and the boundary between selection and implementation authority.
- Focused Module 8 content verification with negative tests for incorrect
  posture, precedence, authority, paths, links, baseline, and future-module
  readiness claims.
- Module 7, a guarded disposable lifecycle lab, and an explained solution that
  separate proposed, pending, active/running, completed, and cancelled state
  from live implementation intent and current session/preflight readiness.
- Focused Module 7 content and fixture tests with exact Directive 0.112.0
  engine evidence, isolated Task execution, fresh reset, and recoverable archive.
- Module 6: a command-free lesson and explained solution for turning horizontal
  plans into vertical slices, tracing ideas into reviewable proposed scope, and
  decomposing epics with dependency and boundary rationale.
- Focused Module 6 content tests and shared fenced-Markdown/link verification.
- Three proposed, sequential story xBRIEFs for Modules 6–8, with explicit
  requirement coverage, dependencies, acceptance criteria, file boundaries,
  and focused verification contracts.
- Modules 4 and 5: xBRIEF artifact classification and source/projection recovery,
  with explained solutions, progressive hints, and outcome-based self-checks.
- A guarded disposable codebase-MAP lab with exact Directive 0.112.0 fixtures,
  freshness and content evidence, retained reset attempts, and local tests.
- Focused Modules 4–5 content validation and navigation through Module 5.
- LF/CRLF and native npm launcher regression tests, plus a commit-bound
  [Windows revalidation handoff](maintainers/WINDOWS-REVALIDATION.md).

### Changed

- Repository identity now matches the public `deftai/directive-training`
  remote. The stale 3Ci-private current-state is recut in the project
  xBRIEF, `AGENTS.md`, `README.md`, the curriculum maintenance contract,
  and the quick-reference safety overlay, while the remote-as-identity
  lock and the learner-safety rules stay in force (#2).

- Complete the learner-ready Module 1–11 core path and advance the course,
  Module 11, lab, assessment, solution, maintenance, and reference surfaces
  into the learner-ready capstone. Internal-alpha remains the pilot maturity
  label; it no longer means the modules are partial drafts.
- Mark Module 10 learner-ready on its verified macOS/zsh path while keeping Module 11
  planned, and advance course, lab, assessment, solution, and reference navigation.
- Mark Module 9 learner-ready on its verified macOS/zsh path while keeping Modules 10–11
  planned at that milestone, and advance course, lab, assessment, solution, and reference navigation.
- At the Module 8 milestone, mark Module 8 learner-ready while keeping Modules 9–11
  planned, and advance
  course, assessment, solution, and Module 7 forward navigation.
- Promote the validated Module 8 session-start and authorized-work-selection
  scope to the pending backlog after Modules 6–7 lifecycle completion.
- Mark Module 7 learner-ready on its verified macOS/zsh path; retain Linux/bash
  and native Windows/PowerShell as candidate paths without learner-ready claims.
- Keep the Modules 4–6 verifiers stable as later modules advance: earlier
  contracts validate their own readiness and durable forward links, not a future
  module's temporary lifecycle folder or status.
- Clarify tactical/continue artifact lifetime and distinguish project-definition
  narratives from its rendered scope registry in the learner references.
- Document projection help and missing-MAP freshness behavior. At that milestone, new lab
  platform proof was limited to macOS/zsh and Modules 8–11 remained planned.

### Fixed

- Reconcile every live root-package verifier and its focused negative tests
  with the exact `@deftai/directive` 0.119.1 authoring pin while preserving
  the curriculum's intentional 0.112.0 learner fixtures and historical record.
- Normalize repository-style fixture keys across platforms, make capstone
  negative mutations LF/CRLF-safe and exact-script-specific, and keep Labs 7,
  9, and 10 happy paths executable on their supported host lanes (#75, #76,
  #77).
- Complete the native Windows learner path across Labs 2 and 5, the capstone,
  and the candidate-only Labs 7, 9, and 10: publish the verified Lab 5
  PowerShell route, stop unsupported installs before npm, require an explicit
  capstone course root, and clarify Lab 2 readiness and CRLF warnings (#65,
  #66, #67, #68).
- Accept CRLF checkouts in the cold-start and Modules 2–3 content verifiers
  without relaxing their content assertions.
- Validate complete known Windows npm command shims and their exact local CLI
  target in Lab 5. Missing launchers, altered programs, local Node shadowing,
  and case-insensitive Git redirection remain rejected. Native Windows replay
  is still required; no new learner-ready platform claim is made.
- Make the Windows handoff select its published commit before loading new scope
  files, restore an absent ignored framework payload from the pinned public
  headless manifest without changing tracked files, and explicitly authorize
  normal cleanup of only the full suite's newly created contract fixtures.
- Require an explicit guarded Lab 5 archive target and an outside-attempt working
  directory. Update cleanup commands and Windows symlink-test prerequisites;
  retain failed attempts and all safety assertions. Native archive retest remains
  required before claiming Windows learner readiness.
- Normalize new Lab 5 text fixtures to LF and pin the source JSON's Git text
  attributes. Accept LF/CRLF purpose edits while retaining trailing-whitespace
  rejection; update the nine-file checkpoint and exact Windows CRLF replay.
