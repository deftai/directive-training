# Changelog

## [Unreleased]

### Fixed

- The capstone work-item identifier namespace is now bounded and stated. Both
  worked `addWorkItem` listings in `solutions/capstone-end-to-end.md` and the
  derived CI rehearsal implementation in `scripts/capstone-lab.test.mjs` refuse
  at the bound instead of allocating `WI-1000` from a valid collection whose
  highest identifier is `WI-999` — an identifier the module's own
  `/^WI-\d{3}$/` validator rejects on the next add, complete, or summary call.
  After `validateItems` and the highest-suffix calculation, and before the new
  item is constructed, `addWorkItem` throws
  `RangeError("next work-item id would exceed WI-999")`. Allocation still runs
  max-suffix + 1, an empty collection still allocates `WI-001`, `WI-000`
  remains a legal existing identifier, and refusal is monotonic rather than
  gap-filling: add refuses once the collection holds `WI-999` even when lower
  identifiers are free. Lab Task 2 (`CAP.2`) now states that contract on the
  green list, the supplied focused suite carries a sixth frozen test that
  proves the `RangeError` and an unchanged input collection alongside the
  retained 50-item ordinary-range test, and `scripts/verify-capstone.mjs`
  pins the guard as condition-plus-throw — so an ineffective condition around
  the right message still fails — on the lab, both listings,
  `Valid alternatives`, the supplied test, and the rehearsal copy, with
  mutation coverage. `scripts/verify-capstone.test.mjs` also executes both
  worked listings and the derived rehearsal pair at the boundary, so the
  contract is proved by running the authored bytes rather than only by
  matching them (#36).

### Verified

- Native Windows/PowerShell learner walkthroughs now verify the complete Lab 7,
  Lab 9, and Lab 10 paths against the exact Directive 0.112.0 graph (#78).

### Changed

- Lab 2 now runs from a coding-agent host. Every command block executes in its own
  shell against one course-relative helper path plus the single printed absolute
  attempt root, so the nine shell functions and the carried variables that made
  every block after the first fail at `assert_no_remote` with `command not found`
  are gone. `labs/fixtures/02-disposable-initialization/init-lab.mjs` exposes
  `create`, `guard`, `install`, `diagnose`, `accept`, `reset`, `archive`, and
  `recovery-npmrc`, each re-deriving its state from disk. Helper-spawned children
  run under the governing `env -i PATH="$PATH" HOME="$HOME"` base with the npm
  credential strip layered on top, npm children keep Lab 2's `--userconfig` /
  `--globalconfig` / `--cache` isolation, and hook-runtime children prepend the
  printed root's `node_modules/.bin` and refuse before the spawn when that local
  `deft` is missing or not executable. Fence-level and in-helper refusals are now
  worded so a missing printed-root paste never reads as the safety boundary
  tripping. The Modules 2-3 content contract and its three-platform validation
  workflow follow the same helper path the lab teaches, and the Lab 2 solution
  reports seven verbose `git check-ignore` commands rather than six (#18).

### Added

- Executable structural verification for Module 6's O6.2 proposed-scope artifact.
  Module 6 stays command-free and O6.2 keeps its shaping and artifact outcome; the
  named vehicle recut is an adjacent practical step, Lab 7 Task 5, which runs
  `xbrief:verify` against the exact learner-authored file inside the existing
  disposable guarded repository. O6.2 completion evidence now retains the artifact
  path, the exact command, the exit code, and the result; Task 5 brackets the check
  with `set +e` / `set -e` so a failing structural run keeps its evidence under the
  lab's `set -eu` shell, and the PowerShell route writes the same durable record.
  Structural proof and the Module 6 comparison rubric stay separate surfaces,
  `xbrief:preflight` and `doctor` are refused as the authoring-validity pass,
  both Lab 7 supplied scopes are kept,
  path, the exact command, the exit code, and the result. Structural proof and the
  Module 6 comparison rubric stay separate surfaces, `xbrief:preflight` and `doctor`
  are refused as the authoring-validity pass, both Lab 7 supplied scopes are kept,
  and a green structural result grants no promotion, activation, or implementation
  authority (#20).
- A required design-critique learning path with a scored Module 6 routing gate,
  a command-free Module 9 practicum, capstone checkpoint, explained solution,
  and focused positive and negative verification (#4).
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

- The core learner path now names the leftover-completion gates. Glossary
  **delivered** requires lifecycle closeout recorded *and* tracked on the
  configured delivery branch. Module 12's delivery axis maps
  `verify:orphan-active` to card C6, repaired by `scope:complete`, and
  `verify:completed-tracked` to the deliberately uncarded reachable, locally
  completed, untracked state, repaired by a lifecycle pull request. Module 7 §4
  and the Lab 7 Done statement point forward to that gate without adding a
  remote-capable command, and the quick reference gains a separate
  leftover-completion block — outside the Module 7 no-remote Task sequence —
  naming both verifiers with their preconditions and `swarm:finalize-cohort`
  once as an advanced option this course never invokes. The nine-card lock,
  O12.4, the Module 12 solution table, and the frozen C7 `Delivered` key are
  unchanged (#22).
- Upgrade the complete Directive teaching baseline from 0.119.2 to the verified
  0.119.5 release across authoring metadata, curriculum, solutions, six
  disposable fixtures, workflows, verifiers, and maintainer evidence.
- The learner-ready core now runs through twelve modules, with implementation,
  testing, and review taught as Modules 10–12 and protected historical and
  lifecycle identities left unchanged (#4).
- Upgrade the current Directive teaching baseline from the inherited mixed
  0.112.0/0.119.1 state to the verified 0.119.2 release across curriculum,
  disposable labs, validation, workflows, and maintainer evidence (#3).
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

- Define the closed Module 9 finding classes `blocks-the-design`,
  `sharpens-framing`, and `footnote` in the module Terminology table before
  Artifact 3, as source-bound restatements of the pinned critic method, with
  the residual-disagreement clause, an F2 misclassification recovery row that
  classifies the as-written draft, a solution compare row, and verifier
  assertions that read each class's own meaning cell (including the
  `sharpens-framing` can-bind condition) with mutation tests for swapped and
  weakened definitions (#17).
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
- Stop teaching `Missing directory: xbrief/` as a 0.119.5 doctor known false
  negative in Module 2, Lab 2, and the Lab 2 solution. The pinned engine cannot
  emit that string. Lab 2 Task 2 now teaches the warning a pin-matched init
  really prints — `canonical-vendored-npm-signpost` — with its check id,
  message, recommended host-global action in a non-executable fence, and the
  out-of-boundary verdict. O2.4 stays classify-and-boundary-judge of whatever
  appeared and no longer scores a warning count. `verify-modules-2-3` now
  rejects the dead string and any learner-executable global install, `@latest`
  tag, or `directive migrate`. `SOURCE-NOTES.md` records a dedicated 0.119.5
  Lab 2 doctor-warning replay and labels the 0.112.0 two-warning proof
  historical; the Modules 2–3 CI jobs capture doctor output, assert the
  expected warning set, and run the focused content contract (#19).
- Close three review findings on the same change. The learner-command guard now
  rejects option-first npm forms (`npm --global install`, `npm -g install`,
  `--location=global`) and `env`-wrapped invocations, and carries a case table
  covering every supported variant plus the lab's legitimate `--globalconfig`
  installs. The platform lanes assert the doctor warning *identity* set through
  one shared `scripts/assert-doctor-warning-set.mjs`, which binds the check id
  to a real warning row and rejects any other warning identity, with a replay
  suite in CI. The issue-19 scope brief records its plan and acceptance against
  the 0.119.5 baseline the change implements (#19).
- Remove a hidden strengthening in the Module 6 Part D routing matrix. The
  published rubric asks the learner to name the routed revision, but the
  solution cell and `scripts/verify-module-6.mjs` required a Module 9
  clearance sentence the learner has not been taught. The route row's
  `Proposed mechanism revision` cell is now the identifier `NS-INGEST-R2`,
  the verifier asserts that exact value and rejects a redesign sentence,
  `Not applicable.` remains the non-route fill, and Module 6 Terminology,
  the self-assessment key, and the glossary define the column as an
  identifier (#16).
- Make the four shipped self-assessment keys findable and joinable. All four now
  use `## Self-assessment key` at `h2`, including the Lab 5 key that was an `h3`
  nested under `## Acceptance evidence`, and Modules 4, 5, and 6 link to them by
  `#self-assessment-key` fragment in the same change. Module 4's five items carry
  O4.1, O4.2, O4.3, O4.3, and O4.4 so each joins an existing Completion-evidence
  row, and Module 3 item 5 and Module 6 item 5 are marked ungraded practice
  because neither has a row to join. Completion evidence remains the scoring
  instrument; the keys explain answers. `npm run test:content` now runs
  `scripts/verify-modules-2-3.mjs`. Module 1 is excluded leftover: its items are
  tagged, but its Completion evidence has no outcome-id rows and its scoring
  lives in an in-section block (#15).
