# Curriculum maintenance contract

This document governs the authored 3Ci Directive curriculum. It describes the
0.112.0 internal-alpha baseline and must be reviewed whenever the project pin,
how Directive behaves, course outcomes, or the publication target changes.

## Ownership and release status

- **Organizational content owner:** 3Ci engineering enablement
- **Named individual maintainer:** not yet assigned; required before MVP exit
- **Pilot learners:** at least two representative 3Ci engineers, not yet named;
  required before MVP exit
- **Course status:** pre-release internal alpha
- **Visibility:** public (`deftai/directive-training`)

The missing names do not block this foundation milestone. They do block the MVP
exit criterion and must be resolved in the proposed pilot-and-revision scope.

## Source ownership

| Concern | Authoritative source | Maintainer action |
| --- | --- | --- |
| Project identity, policy, and goals | `xbrief/PROJECT-DEFINITION.xbrief.json` | Change through approved Directive setup or project-definition workflow |
| Planned and active work | xBRIEF 0.8 lifecycle artifacts under `xbrief/` | Use lifecycle commands; activate one coherent scope at a time |
| Lesson, lab, assessment, solution, and reference prose | Authored Markdown in this repository | Edit on an authorized feature branch and validate links and learner evidence |
| Product behavior | Pinned release, tested CLI, and official same-release sources | Verify; do not let this course define upstream behavior |
| Statement traceability | `references/SOURCE-BASELINE.md` and `references/SOURCE-NOTES.md` | Update source heading, test surface, adaptation method, date, and discrepancies |
| Future wiki, Confluence, or SharePoint pages | Generated or governed publishing projection | Regenerate from repository Markdown; never repair drift only in the projection |
| Learner runtime state | Learner's disposable repository or approved private notes | Keep out of this repository and out of business repositories |

Completed training xBRIEFs record what was delivered. They do not authorize a
maintainer to create the next lesson or revise an existing one.

## Change triggers

Run a version review when any of these occurs:

- the exact `@deftai/directive` pin changes;
- installed engine and project pin no longer match;
- a taught command or gate changes output, operands, exit status, or side effects;
- an official source moves, changes meaning, or disagrees with observed behavior;
- xBRIEF schema or lifecycle behavior changes;
- a supported operating system, shell, package manager, or coding host changes;
- a learner reports a command that cannot be reproduced from written steps;
- 3Ci changes a policy overlay; or
- an internal publishing platform is selected or its rendering behavior changes.

A mutable default-branch document changing by itself is investigation input,
not sufficient reason to rewrite released-version guidance.

## Release revalidation procedure

1. Create an approved scope and a feature branch.
2. Confirm the configured remote before work. Do not use a similarly named
   framework or business repository.
3. Run the current Directive session, story-ready, and active-xBRIEF preflight
   gates. Follow any restart instruction.
4. Resolve the exact project package pin, installed engine version, official
   release tag, and commit SHA. If they cannot be aligned, stop the content
   change and record the mismatch.
5. For every taught command, run and record `directive --help`,
   `directive commands`, and `directive <verb> --help`. A rejected `--help` is a
   result to document, not permission to invent syntax.
6. Recheck each major claim against the same-release source file and heading
   named in `SOURCE-BASELINE.md`. Prefer deterministic released behavior when
   prose and command behavior disagree; record the disagreement.
7. Review all learner steps on each claimed operating-system and shell path, or
   narrow the stated support boundary. Never imply untested equivalence.
8. Update the verification date and adaptation classification. Paraphrase and
   cite. If substantial upstream material must be copied, preserve the applicable
   MIT notice and obtain the required approval.
9. Run the module's literal acceptance commands, link checks, content safety
   scan, xBRIEF conformance check, and aggregate consumer gate.
10. Review the diff for generated files, framework deposits, USER.md, caches,
    session data, credentials, client data, and unrelated scope expansion.
11. Keep completion language evidence-specific. Publication, deployment, and
    UAT each require their own authorization and evidence.

Do not fix a failing curriculum check by weakening the check solely to make it
green. Correct the content, environment, command claim, or legitimate test
cause.

## Claim-review checklist

For each version-sensitive statement, the baseline must answer:

- What exact behavior does the course claim?
- Which release tag and commit were checked?
- Which official file and heading support it?
- Which command and help surfaces were executed?
- Was the text paraphrased, adapted, or copied?
- Did observed behavior disagree with the prose or help output?
- Which module, lab, assessment, solution, glossary entry, or quick-reference
  row consumes the claim?

Use `references/SOURCE-NOTES.md` for detailed research notes. Keep
`SOURCE-BASELINE.md` small enough to audit as a manifest.

## Module readiness review

A module may be marked learner-ready only if it satisfies the repository's
[module template](../templates/module-template.md) and a maintainer can complete it from a clean stated start. In
particular, confirm:

- two to four observable outcomes and an outcome-mapped assessment;
- prerequisites, duration, terminology, and starting-state checks;
- a reproducible walkthrough and fictional hands-on exercise;
- literal acceptance evidence;
- progressive hints, expected failures, deterministic recovery, and a reset
  path where state changes;
- an explained solution available after a suggested first attempt;
- previous and next navigation plus official release-bound sources; and
- no hidden instructor action or undocumented credential.

Future labs must be run in disposable repositories. Never test a reset procedure
in this training repository or a business repository.

## Independent-learner validation

The pilot is a test of the written material, not instructor-led delivery. Each
pilot learner should record:

- start and finish time per module;
- environment, shell, package manager, coding host, and Directive version;
- checkpoints completed without help;
- hint and solution reveals;
- failures and whether the documented recovery worked;
- ambiguous words, missing evidence, and unsafe-looking instructions; and
- whether the capstone was completed without undocumented human intervention.

Remove personal, client, repository-sensitive, and production information from
pilot evidence. Convert recurring friction into an approved revision scope.

## Publishing boundary

No site or page publication is authorized by this milestone. When 3Ci selects a
wiki, Confluence, or SharePoint:

1. estimate implementation and maintenance cost for that platform;
2. define access control, navigation, link, code-block, and version-banner
   behavior;
3. define a one-way repository-to-platform publication or reconciliation path;
4. mark every published page with source revision and Directive baseline;
5. prohibit sensitive learner state from the publishing pipeline; and
6. require explicit authorization before the first publication.

Until that scope is approved, the Markdown repository is the only authored
course source.

## Milestone checks

Run the following local curriculum checks. The current active scope states the
conformance command verbatim; the npm checks are supplemental product evidence:

```text
npm run check:cold-start-readme
npm run check:modules-2-3
npm run check:modules-4-5
npm run test:modules-4-5
npm run check:module-6
node --test scripts/verify-module-6.test.mjs
npm run check:module-7
npm run test:module-7
npm run check:module-8
npm run test:module-8
npm run check:module-9
npm run test:module-9
npm run check:module-10
npm run test:module-10
npm run test:windows-install
npm run check:module-11
npm run test:module-11
npm run check:capstone
npm run test:capstone
npm run test:portability
directive verify:vbrief-conformance --project-root .
```

The milestone matrix is a least-privilege training and portability gate. Full
linked-path security validation is separate and requires an operator-approved
process that can create both file and directory symbolic links:

```text
npm run test:linked-path-safety
```

That command fails closed at its capability preflight. A capability failure
leaves full linked-path safety sign-off incomplete, but it does not prevent the
ordinary training matrix from exercising its privilege-free cases.

Pull requests that touch Labs 7, 9, or 10 also run
`.github/workflows/labs-7-9-10-platform-validation.yml` on macOS, Ubuntu, and
Windows. The Windows job must execute the substantive learner paths, not a
platform spoof or skip. Keep Windows marked candidate until both that job and a
separate learner walkthrough have evidence.

Those conditions were met for Labs 7, 9, and 10 on 2026-09-15: the Windows 2022
CI proof was green and an independent native PowerShell walkthrough completed
each published route against the exact Directive 0.112.0 graph.

Run the aggregate Directive consumer gate separately after the literal commands:

```text
task deft:check
```

The aggregate gate must not be embedded in its own literal-command list. Run
the current Directive source-provenance, encoding, link, and diff checks when
available in addition to these commands. Record the exact revision and date
with the evidence; a prior green run is not current proof.

Modules 4–5 add classification and projection-recovery evidence. The two new
focused commands supplement the active scope's literal conformance command;
they do not replace it. Lab 5's macOS/zsh execution evidence is distinct from
Module 2's native matrix. Keep Linux and native Windows unverified for Lab 5
until their own written paths have been executed.

Module 6 adds a command-free worksheet and explained solution. Its focused
checks prove required sections, outcome coverage, source-bound terminology,
safe local links, navigation, and the absence of executable shell blocks. The
learner evidence is a fictional scratch note with literal read-only inspection;
it makes no runtime, remote, deployment, or implementation-authority claim.

Module 9 adds an executable golden-path lab. Revalidate the exact 0.112.0 package graph,
clean guarded checkpoint, session/story/active-preflight order, expected focused red,
one-file `src/greeting.mjs` boundary, named/fallback behavior, patch check, retained JSON
evidence, fresh reset, and recoverable archive together. Platform support is macOS/zsh and
native Windows/PowerShell; Linux/bash remains unverified.

Module 10 adds an executable testing-and-gates lab. Revalidate the exact 0.112.0 graph,
meaningful red, frozen test digest, passing green and source-only refactor, literal `verify:ac`,
forward coverage, the seeded `quality:record` aggregate failure, the one-record repair, final
three-file diff, unchanged gate fingerprints, fresh reset, and recoverable archive together.
Platform support is macOS/zsh and native Windows/PowerShell; Linux/bash remains unverified.

Module 11 is a command-free fixed-state exercise. Revalidate the complete H1
packet, Read-Write-Lint-Diff zero-change exit, classify-before-editing order,
P0/P1/P2 severity and scope decisions, one coherent F1/F2 batch with one commit
and push, H2-bound checks and review with no push during review,
delivery-branch reachability plus lifecycle closeout, and the separate
Git/delivery, deployment, and UAT axes. It needs no platform execution or live
reviewer. Reset and recovery use a fresh scratch worksheet, not a repository
reset.

The learner-ready
[capstone](../curriculum/capstone-end-to-end.md) combines the course lifecycle
in one guarded no-remote fixture. Revalidate the exact 0.112.0 graph on Node.js
24.20.0, the full stage and evidence order, meaningful red and intentional
review-evidence aggregate failure, source-only green and P1 repair, simulated
current-product review timing, implemented/local-pass closeout boundary, fresh
reset, and separate recoverable archives. Run both capstone commands above.
The native fixture matrix proves macOS, Ubuntu, and Windows runner behavior;
record independent learner walkthrough pilots separately.

Use the [native Windows revalidation handoff](WINDOWS-REVALIDATION.md) for the
Modules 4–5 portability follow-up. Bind it to the published fix commit, preserve
the old failed attempt, and distinguish native evidence from cross-platform
unit-test inputs. The launcher guard recognizes the complete `cmd-shim@8.0.0`
programs for the exact local Directive target, with CRLF normalization only.
An unfamiliar npm launcher format must be reported and reviewed; do not replace
real launchers with the golden test fixtures or bypass the guard.

An existing clone can legitimately lack the ignored `.deft/core` payload. The
handoff selects the exact published revision first, then restores only an absent
payload from the verified 0.112.0 CLI's public headless manifest. Its helper
refuses existing deposits, preserves partial failures, and leaves tracked files
unchanged. Doctor must pass before framework-guided validation continues. The
handoff also authorizes the full suite's normal cleanup of only its new contract
fixtures; previous attempts and evidence remain protected.

Lab 5 archive now takes an explicit absolute attempt root and runs from outside
that attempt parent. Keep the learner cleanup blocks and Windows handoff aligned
with this interface. `npm run test:modules-4-5` and `npm run test:portability`
must remain privilege-free. Windows privilege-dependent symbolic-link attack fixtures live in
`npm run test:linked-path-safety`, which requires successful Node file and
directory probes. A capability failure must remain visible, state that full
safety sign-off is incomplete, and must not be converted to passing or skipped
linked-path assertions.

Fresh Lab 5 text copies use LF, and its guarded `.gitattributes` normalizes the
source JSON in Git. The checkpoint now contains nine files. Revalidate LF and
CRLF course input and source edits under both `core.autocrlf` values, including
real trailing-whitespace negatives. Never repair portability by weakening the
literal `git diff --check` gate or changing a learner's global settings. The
Windows handoff requires an executed complete candidate script, not a post-run
reconstruction, and a symlink-capable process for full safety sign-off.

- Previous: [Quick reference](../references/QUICK-REFERENCE.md)
- Next: [Source baseline](../references/SOURCE-BASELINE.md)
