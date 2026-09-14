# Directive source notes

These notes preserve the probe results behind [SOURCE-BASELINE.md](./SOURCE-BASELINE.md).
They are maintainer evidence, not a learner command reference.

## Verification context

- Current-baseline verification date: 2026-09-12. Runtime proofs below retain
  their original execution dates; each module section states its own source,
  content-contract, and runtime evidence boundary.
- Host used: macOS with zsh and Node.js 24.18.0.
- Project direct pin: `@deftai/directive` 0.112.0 in `devDependencies`.
- The training project had no project-local `node_modules` or lockfile; its exact direct pin
  is a reconstitution anchor, not proof of a local install.
- Historical learner-baseline executable context: Modules 2–6 used a then-current global
  CLI that reported 0.112.0; later executable learner proofs used disposable repositories'
  explicit pin-matched binaries. No global path from those proofs is assumed current.
- Historical learner-baseline installed package graph: CLI, core engine, content, and types
  resolved to 0.112.0 on each applicable learner-proof graph.
- Historical learner-baseline deposit proof: reconstituted surfaces reported 0.112.0. This
  is preserved evidence, not a description of the current authoring deposit.
- Current authoring context: during Module 11 validation, the default unqualified
  shell CLI reported engine 0.114.0. Final authoring gates explicitly selected the NVM-managed CLI,
  which reported engine 0.116.0, to match the current 0.116.0 deposit for that Module 11
  pass. Capstone authoring now reports CLI/engine and deposit 0.117.0. These versions are
  authoring-runtime context, not learner-behavior evidence.
- Official tag: `v0.112.0`; peeled commit and npm `gitHead`:
  `7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808`.
- The complete macOS/zsh Module 2 rehearsal used two unique disposable, no-remote Git
  repositories under one operating-system temporary parent. The fresh reset attempt installed
  the exact fixture graph, ran every help and initialization check, committed the inspected
  allowlist, passed literal acceptance, and archived both attempts.
- Native 0.112.0 pull-request matrix run
  [34080818120](https://github.com/3Ci-Consulting/directive-training/actions/runs/34080818120)
  used Node.js 24.20.0 on `macos-15`, `ubuntu-24.04`, and `windows-2022`; all three
  jobs passed at exact candidate head `3f2f996bcfb53c4361cc5c5e949d9c9cd2c83a39`.

## Historical 0.112.0 learner-baseline version and provenance probes

These rows preserve the 2026-09-07 learner-baseline probe set. They are not a
current authoring-environment report.

| Probe | Exit | Result |
| --- | ---: | --- |
| Read the exact value from `package.json` | 0 | `@deftai/directive: 0.112.0` under `devDependencies`. |
| `directive --version` | 0 | Reported engine `@deftai/directive-core@0.112.0`. |
| Read the installed CLI package manifest | 0 | CLI package version 0.112.0. |
| `npm ls -g --depth=1` for the package graph | 0 | CLI, content, and core resolved to 0.112.0. |
| Read `.deft/GENERATION.json` and `.deft/core/VERSION` | 0 | Deposit surfaces say 0.112.0 and tag `v0.112.0`; `VERSION` identifies a content-package deposit. |
| `git ls-remote` for `refs/tags/v0.112.0` and its peel | 0 | Tag object `5f30e544eedb72c313ba61934818eb49506fe61b`; commit `7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808`. |
| `npm view @deftai/directive@0.112.0` | 0 | Version, tarball integrity, repository, and `gitHead` resolved; `gitHead` matched the tag peel. |

The CLI help banner displays `Directive v0.112`, without the patch component. Use package
metadata, `directive --version`, and the deposit generation record for the exact 0.112.0 pin.

## CLI help probes

Every row was executed from the consumer project root. `In top help` means the curated
`directive --help` summary names the verb. `Registered` means `directive commands` names it.

| Verb probe | In top help | Registered | Verb help result |
| --- | :---: | :---: | --- |
| `directive init --help` | Yes | Yes | Exit 0; printed init options. |
| `directive update --help` | Yes | Yes | Exit 0; printed update options. |
| `directive doctor --help` | Yes | Yes | Exit 0; printed doctor options. |
| `directive toolchain:check --help` | No | Yes | Exit 2; printed usage after `toolchain-check: unrecognized argument: --help`. |
| `directive xbrief:preflight --help` | No | Yes | Exit 0; printed the current xBRIEF verb with a legacy `--vbrief-path` option name. |
| `directive scope:promote --help` | Yes | Yes | Exit 0; printed a stale Task/vBRIEF-oriented help card. |
| `directive scope:activate --help` | No | Yes | Exit 0; printed a stale Task/vBRIEF-oriented help card. |
| `directive scope:record-approved-scope --help` | No | Yes | Exit 0; printed the current usage with the documented `-- <xbrief-path>` form. |
| `directive session:start --help` | Yes | Yes | Exit 2; `session_start: unrecognized argument: --help`. |
| `directive check --help` | Yes | Yes | Exit 2; `check: unrecognized argument: --help`. |
| `directive verify:vbrief-conformance --help` | No | Yes | Exit 0; printed accepted flags including `--project-root PATH`. |

Additional observations:

- `directive --help` exited 0. It is a curated starting view, not the full registry.
- `directive commands` exited 0 and supplied the authoritative registration inventory.
- `directive help session:start` and `directive help check` exited 0 but returned only global
  help. They did not provide verb-specific help.
- Help-card branding varies: doctor prints `Usage: deft doctor`, xBRIEF preflight examples use
  `deft`, and scope lifecycle cards use `task` even when invoked through `directive`.
- The dash aliases `scope-promote` and `scope-activate` returned the same stale help cards as
  their colon spellings. `session-start --help` returned the same exit-2 rejection.
- The conformance help line was:
  `usage: verify_vbrief_conformance [--all | --staged] [--project-root PATH] [--allow-list PATH] [--quiet]`.

Do not teach that every `directive <verb> --help` succeeds. Start with `directive --help`, use
`directive commands` to confirm registration, then test help for each verb before publishing
its syntax.

## Disposable consumer runtime proof

The 2026-09-07 macOS/zsh proof `local-0.112.0-disposable-project-local-hook-full` used a fresh
operating-system temporary parent, two Git repositories with no remotes, the fictional Module
2 fixture, and the explicit project-local CLI and hook runtime. The first attempt stopped
after the guarded Git start; the second exercised the complete learner path as a
fresh-directory reset. Neither attempt initialized or mutated the training working tree.

| Probe | Exit | Relevant result |
| --- | ---: | --- |
| `npm install --ignore-scripts --no-audit --no-fund` with an empty temporary npm user config | 0 | Added 48 packages; CLI, core, and content resolved through the fixture's exact 0.112.0 pin and overrides. |
| Fixture and installed-graph assertions | 0 | `private: true`; the direct CLI pin and CLI/core/content/types installed package versions were all exactly 0.112.0. |
| `./node_modules/.bin/directive --version` | 0 | Reported engine `@deftai/directive-core@0.112.0`. |
| Project-local hook-runtime assertions | 0 | `PATH` selected the disposable attempt's `node_modules/.bin/deft` before init and commit; `core.hooksPath` was exactly `.githooks`. |
| Top help, command inventory, and init/update/doctor help | 0 each | Every ordinarily supported help probe completed through the explicit local binary. |
| `toolchain:check --help` diagnostic probe | 2, expected | Printed the recorded `unrecognized argument: --help` diagnostic; the result was asserted rather than suppressed. |
| `./node_modules/.bin/directive init --yes --repo-root .` | 0 | Classified the Git-initialized directory as brownfield and created the consumer integration. |
| Seven `git check-ignore` assertions | 0 each | Core, CLI adapter, cache, ritual, triage-cache, shared-USER, and dependency examples were ignored. |
| Staged-plus-untracked allowlist and checkpoint | 0 | Inspected 138 unique paths, positively required the initialized anchors after staging, rejected no unexpected path, and committed through the local hook on `training/module-02` as disposable local commit `9e27626075148d7f56b8b0fa772306120c53709b`. |
| `./node_modules/.bin/directive doctor --full --project-root .` | 0 | Reported two warnings: the canonical npm provenance/migrate signpost and a missing `xbrief/` directory despite an xBRIEF envelope. Warnings were recorded rather than treated as failure. |
| `./node_modules/.bin/directive toolchain:check --consumer --project-root .` | 0 | Reported Git 2.50.1, GitHub CLI 2.88.1, Node.js 24.18.0, npm 11.16.0, and “All required tools available.” |
| Literal clean/root/branch/remote acceptance | 0 | Both tracked diffs and complete porcelain status were empty; the canonical Git root matched the recorded attempt; branch remained `training/module-02`; remotes remained empty. |
| Fresh-directory reset and archive loop | 0 | Preserved both disposable attempts, moved their exact parent to a new temporary archive, and resolved each archived Git root before confirming both remote lists were empty. |

### Native platform matrix proof

Current-baseline pull-request run
[34080818120](https://github.com/3Ci-Consulting/directive-training/actions/runs/34080818120)
used the 0.112.0 fixture, pinned actions, Node.js 24.20.0, temporary no-remote repositories,
and the same version, help, init, anatomy, checkpoint, doctor, toolchain, acceptance, reset,
and archive assertions on each bounded runner. It completed successfully at exact candidate
head `3f2f996bcfb53c4361cc5c5e949d9c9cd2c83a39`.

| Proof marker | Bounded environment | Job evidence | Result |
| --- | --- | --- | --- |
| `macos-zsh` | GitHub `macos-15`; zsh | [job 101615602233](https://github.com/3Ci-Consulting/directive-training/actions/runs/34080818120/job/101615602233) | Passed in 24 seconds. |
| `linux-bash` | GitHub `ubuntu-24.04`; bash | [job 101615602154](https://github.com/3Ci-Consulting/directive-training/actions/runs/34080818120/job/101615602154) | Passed in 33 seconds. |
| `windows-pwsh7` | GitHub `windows-2022`; PowerShell 7.4+ gate | [job 101615602190](https://github.com/3Ci-Consulting/directive-training/actions/runs/34080818120/job/101615602190) | Passed in 71 seconds. |

An earlier 0.111.0 run
[34040433466](https://github.com/3Ci-Consulting/directive-training/actions/runs/34040433466)
exposed a curriculum-command defect on Windows: `Get-Command deft` returned both `deft.cmd`
and the extensionless shim, and coercing both paths broke the local-runtime comparison. The
workflow and all learner Windows checks now select the first application in PATH explicitly;
the subsequent passing 0.111.0 run
[34040576589](https://github.com/3Ci-Consulting/directive-training/actions/runs/34040576589)
first verified the correction, and the current passing Windows job confirms it remains fixed
under 0.112.0. This was not a disagreement with the pinned product.

This current evidence is bounded to those runner labels, shells, the npm fixture path, and
the pinned 0.112.0 graph. It does not verify pnpm, other operating-system images, or coding-host
integration. The workflow required no user-managed secret, write permission, persisted
credential, or remote mutation; GitHub supplied its ephemeral read token to the official
checkout and Node setup actions.

The first disposable attempt failed `npm install` with `E401` because the host's ordinary npm
configuration contained stale authentication. No credential value was captured. A fresh
attempt with an empty temporary npm user config proved the public-registry path. Learner
guidance first preserves the approved organizational registry configuration; it uses a fresh
attempt and the organization's documented npm recovery when authentication is required.

The first attempt also showed that `npx --no-install directive` can fall through to a global
binary when a local install is missing. Module 2 therefore invokes the exact
`node_modules/.bin/directive` (`directive.cmd` on Windows) and proves that file exists.

Platform proof markers consumed by the focused verifier:

- `platform-proof:macos-zsh status=verified date=2026-09-07 evidence=local-0.112.0-disposable-project-local-hook-full+gha-run-34080818120`
- `platform-proof:linux-bash status=verified date=2026-09-07 evidence=gha-run-34080818120`
- `platform-proof:windows-pwsh7 status=verified date=2026-09-07 evidence=gha-run-34080818120`

PowerShell 7.6.5 on the macOS host supplied syntax inspection only. The bounded
`windows-2022` job above proves the 0.112.0 baseline natively; the macOS-host inspection is
separate and is not counted as native Windows evidence.

## Modules 4–5 verification

This extension uses the unchanged 0.112.0 release identity above. Source inspection and
local probes ran on 2026-09-07 with macOS/zsh and Node.js 24.18.0. The upgrade's native
Module 2 matrix is separate evidence, not Lab 5 coverage.

Module 4's fictional cards and explained answers were reviewed against the current main
xBRIEF rule, deposited taxonomy, 0.8 schema, command contract, and continue checkpoint
contract. The taxonomy has legacy naming/schema examples; the course adapts the artifact
roles to current xBRIEF 0.8, without copying legacy envelopes. Taxonomy and Concepts prose
disagree about terminal `failed` destinations; the exercise makes no claim about that
transition. A completed folder/status alone is not proof of delivery: the learner must
inspect the recorded disposition and evidence.

| Module 5 probe | Exit / result | Teaching consequence |
| --- | --- | --- |
| `directive commands` | 0; contains `codebase:map`, `verify:codebase-map-fresh`, `spec:render`, and `project:render`; omits `roadmap:render`. | Use only registered direct CLI forms. |
| `task --list` | 0; includes `deft:roadmap:render` along with the other projection tasks. | Roadmap is shown as a consumer Taskfile command, not a direct CLI command. |
| `directive codebase:map --help` | 0; rendered MAP instead of help. | Unknown help flag is ignored; never recommend this as read-only discovery. The probe's own generated output was not retained in the curriculum. |
| `directive verify:codebase-map-fresh --help` | 1 when the probe MAP was stale; performed verification rather than showing help. | Help is not a safe no-op for this verb either. |
| Read installed 0.112.0 map and freshness implementation | Missing MAP returns no freshness errors; existing output is compared with newly rendered content. | Require a separate MAP existence/content check, plus the released freshness check. |

The Module 5 command table's specification and registry rows are source/inventory
inspection, not claims of executable lab proof. The fictional lab changes one architecture
description; it does not implement new application behavior. See the module for the
immutable source links and the lab for guarded, project-local commands.

During lab authoring, the first result assertion expected an individual source filename
inside MAP. That expectation failed. The expected output was independently re-derived
from the released renderer implementation and its observed module table: MAP provides the
module's authored glob and matched-file count, not a filename list. The final helper checks
the requested purpose, `src/*.js`, and count `1`, alongside exact source JSON and diff
boundaries. The released renderer and freshness gate were not modified.

Review also found that a plain checkpoint tag can inherit a signing requirement. The lab
now disables tag signing for that single local command, with a regression test using
`tag.gpgSign=true`. It does not alter the learner's global Git configuration.

### Disposable Lab 5 runtime proof

Proof `local-0.112.0-lab05-full-AZ7LaE` completed on macOS 26.6.2 (build 25G83),
zsh 5.9 arm64, Node.js 24.18.0, npm 11.16.0, and Git 2.50.1 (Apple Git-155).
The final helper created attempt `3ci-directive-lab05-AZ7LaE/repo` under the OS temporary
root. Its isolated public-registry install resolved CLI/core/content/types to exactly
0.112.0. Runtime proof used the real installed packages, not unit-test package fixtures.

| Runtime checkpoint | Observed result |
| --- | --- |
| Guard, install, graph verification, and eight-file local checkpoint | All exit 0; fictional local identity, lightweight checkpoint tag, no remote. |
| Absent-MAP freshness help probe | Exit 0; separate absence check proves there is still no MAP. |
| Renderer help probe and subsequent freshness help probe | Renderer writes MAP and exits 0; verifier checks the new MAP and exits 0. |
| Supplied MAP-only drift | Freshness 1; source diff 0. Rendering unchanged source restores original purpose and freshness 0. |
| Learner's purpose-only source edit | Freshness 1 before render; renderer and freshness 0 afterward. |
| Five literal final commands | Guard 0, pin 0, released freshness 0, result 0, whitespace diff 0. |
| Meaningful output | Existing generated MAP names its source; the `stop-code` row has the requested new purpose, `src/*.js`, and file count `1`. |
| Fresh reset | Distinct `3ci-directive-lab05-AJBaKH/repo`; old evidence retained, new guard 0, MAP absent, no remote. |
| Archive | Both exact parents moved to OS-temp `3ci-directive-lab-archive`; old roots absent, completed evidence/MAP and reset package present. |

The local evidence note is retained inside the completed archive as
`3ci-directive-lab05-AZ7LaE/evidence.md`. This maintained table preserves the substantive
results without making a machine-specific temporary path a required curriculum link.
No business repository, external Git remote, credentials, running service, deployment,
or recursive deletion was used. The implementation checkout was not initialized as a lab.

Lab-specific proof markers consumed by the focused verifier:

- `lab05-platform-proof:macos-zsh status=verified date=2026-09-07 evidence=local-0.112.0-lab05-eol-BcQ9WF`
- `lab05-platform-proof:linux-bash status=candidate date=2026-09-07 evidence=not-run`
- `lab05-platform-proof:windows-pwsh7 status=verified date=2026-09-12 evidence=local-0.112.0-lab05-windows-iUxLAC+issue-65`

### Native Windows revalidation and archive follow-up

The operator supplied a native report for exact commit
`373389eea62baeb1c694e4bb00db7dccbe848847` on 2026-09-07. The reported environment
was Windows 11 Home ARM64 build 26200, PowerShell 7.6.5, Node.js 26.8.1,
npm 11.19.0, and Git 2.54 for Windows, with CRLF checkout conversion enabled.
This is supplied native evidence, not execution on the maintainer's macOS host.

- The supplied SHA, remote branch, PR head, and detached checkout matched. The bounded
  recovery restored 412 payload files from the 419-file manifest, left Git clean, and
  passed doctor and the read-only session entry. Bootstrap was no longer a launch blocker.
- All three text/content verifiers passed. The suite reported 82 of 87 tests passing,
  with zero skips. Four tests failed while creating file/directory symlinks with `EPERM`;
  one failed when archiving from inside the attempt. Passing coverage thresholds did
  not make that failed test run green.
- Real installed 0.112.0 npm launchers passed validation. Both stale states, both
  recoveries, all five final commands, and a distinct fresh reset passed. Both archive
  attempts failed with `EPERM`; the completed, reset, and earlier attempts were retained.
- The pasted PowerShell adapter covered isolated installation only. Complete replay
  scripts and raw command logs are required in the next handoff; the pasted adapter
  alone does not establish a reproducible full replay.

The approved fix makes archive require an explicit canonical absolute target and refuses
to run while the caller is inside its parent. The original course helper and calling
shell must both run outside the tree being moved. Identity, path, no-remote, symlink,
no-overwrite, and preservation guards remain in place. There is no internal directory
change, forced move, copy-and-delete fallback, or host-setting change.

Regression tests first reproduced the old explicit-target rejection and unsafe inside-cwd
behavior. The revised 92-test suite passes locally with zero failures or skips. Combined
coverage is 99.49% lines, 97.00% branches, and 100% functions across the two Lab 5 helpers,
Modules 4–5 verifier, and deposit-restoration helper, with explicit 90% thresholds.
The archive helper itself has 100% line, 98.61% branch, and 100% function coverage.
All nine revised PowerShell blocks parse. The literal symlink probe and both archive
commands also execute successfully through PowerShell on macOS; this is not Windows proof.

Fresh proof `local-0.112.0-lab05-archive-cQbiqQ` ran the complete published macOS/zsh
lab with the real pinned package graph. Both expected stale exits were 1, both recoveries
and all five final commands were 0, and fresh reset preserved prior evidence. The two
revised archive commands exited 0 from the course directory. Both old roots were absent;
the completed evidence and MAP hashes were unchanged. The completed `cQbiqQ` and reset
`ZGFUzB` attempt parents remain under the OS-temp `3ci-directive-lab-archive` directory.
The retained replay log SHA-256 is
`e8e242f56870c9d00658089e9f1daab8422645b23e4ab02e51647191cd470c1d`.
The tested helper SHA-256 is
`4dc22df437a3d5bba4395a9d5077eecc9e895ba114eed75f02d5c064eafbac7d`.

At that handoff, Windows remained a candidate pending native archive replay.
Complete safety validation additionally requires successful Node file- and directory-symlink
creation probes in the approved Windows session. If that capability is absent, preserve
the actual failures and continue the independent guarded lab, but do not claim full safety
coverage or learner readiness. No test assertion or platform gate was weakened.

### Native archive confirmation and source line endings

The next supplied native report bound expected SHA, branch, PR, and detached HEAD
to `e881f016145405c4617d0884889bf93b7c952e23`. On the same Windows 11 Home ARM64,
PowerShell 7.6.5, Node 26.8.1, npm 11.19.0, Git 2.54.0.windows.1 host:

- Both real outside-directory archives and every new archive test passed. The
  completed `1Hg1gf` and reset `adG4tz` parents were retained in the temp archive.
- The existing restored deposit passed doctor without another restore; content
  portability checks and the real 0.112.0 npm launchers stayed green.
- The combined suite reported 88/92 passing, four failures, zero skips. All four
  failures occurred while creating file/directory symlinks, before their intended
  rejection assertions. Reported coverage was 99.49% lines, 96.97% branches, and
  100% functions over the included files; the suite still exited 1.
- Both intended stale/recovery pairs, final checks, reset, and archives completed,
  but the first literal `git diff --check` returned 2 for trailing whitespace on
  a CRLF purpose line. A bounded edit recovery and regeneration produced final
  exit 0. Those are recovered results, not an uninterrupted first-pass success.
- The complete PowerShell script was assembled from executed commands afterward
  and parsed only. Its filename in the report is not an attached script or proof
  that the assembled file itself ran end-to-end.

Source inspection found an EOL-policy mismatch: fixture copies retained checkout
CRLF bytes, and the checkpoint helper passed `core.autocrlf=false` when staging,
while the literal final Git command inherited the host configuration. The report
does not justify assigning the failure solely to the candidate editor. The
approved follow-up normalizes fresh text copies and uses fixed source attributes
in the disposable fixture; it does not relax whitespace checking or alter the
course checkout's EOL policy.

The full Windows safety result remains incomplete until both Node symlink probes
and the unchanged tests pass in the same approved process context. Windows does
support file and directory symlinks: Developer Mode permits unprivileged creation
by supporting applications, and an appropriately privileged elevated process is
another route. Node 26.8.1's bundled libuv enables that unprivileged-creation flag.
Sources: [Microsoft symlink guidance](https://blogs.windows.com/windowsdeveloper/2016/12/02/symlinks-windows-10/)
and [Node 26.8.1's Windows filesystem implementation](https://github.com/nodejs/node/blob/v26.8.1/deps/uv/src/win/fs.c).
These prerequisites do not authorize changing host settings or replacing symlink
tests with junctions. The new line-ending behavior still requires native replay.

On 2026-09-14 the validation contract was split at the privilege boundary.
`test:modules-4-5` and `test:portability` now contain only ordinary training and
portability cases. `test:linked-path-safety` owns the Windows privilege-dependent
file/directory symbolic-link attack fixtures and retains the fail-closed capability preflight.
This lets a standard Windows learner complete the course without elevation while
preserving a distinct, non-skippable full-safety sign-off surface.

The regression first reproduced the native shape before product changes:
CRLF course copies with `core.autocrlf=true` and a CRLF purpose edit produced
plain `git diff --check` exit 2 on source line 22, despite a 1/1 numstat.
An LF edit against a CRLF checkpoint instead produced 39/39 line churn.
The fix copies all five fixture text files as LF and checkpoints a ninth file,
`.gitattributes`, with a narrow `text eol=lf` rule for the editable JSON.
The guard rejects changed rules, symlinks, and effective attribute overrides.

The revised six-file suite passes locally: 101 tests, zero failures or skips.
Explicit 90% line/branch/function thresholds pass at 99.49% / 97.01% / 100%
across the two lab helpers, Modules 4–5 verifier, and recovery helper.
The projection helper itself has 100% / 98.63% / 100% coverage.
The eight combinations of LF/CRLF course copies, `core.autocrlf=true/false`,
and LF/CRLF edits all pass the exact plain Git whitespace command with a
purpose-only 1/1 diff. Genuine trailing spaces and tabs still return 2 in
every combination. No global or course Git setting changes are needed.

Fresh proof `local-0.112.0-lab05-eol-BcQ9WF` ran the complete macOS/zsh path
with the real installed 0.112.0 graph. Both stale checks returned 1, both
recoveries and all five final commands returned 0, and the nine-file checkpoint
had an LF source/index. Fresh reset and both outside-directory archives passed;
the completed `BcQ9WF` and reset `d7Lvv5` parents are retained in the OS-temp
archive with the completed evidence and MAP hashes unchanged.

A separate real-install attempt `Qcksac` executed the current literal CRLF edit
block under PowerShell 7.6.5 on macOS. It produced UTF-8 without BOM, CRLF working
bytes, LF index bytes, and exactly one added/deleted purpose line. The unchanged
whitespace check passed before regeneration; freshness then returned the expected
1, recovery and all five final checks returned 0, and archiving preserved the
attempt. This tests the PowerShell edit block on macOS, not the complete native
Windows candidate. All ten handoff PowerShell blocks parse.

The executed scripts and logs remain in `/private/tmp/lab05-eol-proof-kUyMFDrf`.
The helper SHA-256 before and after both runs was
`7eb072c959c682e0dfe94034e1f6ccb8049f721928e57477b7d2397593016b0c`.
The exact PowerShell edit script SHA-256 before and after execution was
`e6fdb77238f99000859d46f9165aa5813eb317205bb7d3bc0006e8833202b2ea`.
The complete LF replay log SHA-256 is
`ab517d0a1148f9987f16f466007c05635f60fd5ce82cf2495ffc09aa259804c1`;
the PowerShell CRLF log SHA-256 is
`2e0bfc46b8174d7e6e067c13546b421471fdcf3773e34dfd0a6cc8ab40929202`.

### Final native report and implementation disposition

The final supplied report bound the branch, PR, and detached checkout to
`324b5f73d9e5011fff9699a84806d659ea555bc1`. It reported 97/101 tests passing,
four failures during symlink setup, and zero skips. All nine EOL tests and the
archive contract tests passed natively. Doctor, content checks, real installed
0.112.0 launchers, the nine-file LF checkpoint, and the first stale/recovery pair
also passed. These results confirm the bounded fixes, not complete Windows support.

The attached complete candidate set the parent PowerShell location to the course
root, while earlier subprocesses used the disposable root as their working
directory. At candidate line 357 it invoked relative `projection-lab.mjs guard`
directly, without changing the parent location. Node returned `MODULE_NOT_FOUND`
before the helper or CRLF edit ran. The second stale/recovery pair, final five
checks, reset, and real archives were not run. This adapter error does not
establish a new fixture defect. The unchanged candidate's pre/post SHA-256 was
`6952b710e43a608f70c1d6d1c6e94934b96ba0d111068407c095c7e1b89aa7da`.
The new `3ci-directive-lab05-5EsMke/repo` attempt and all earlier evidence were
retained; the course remained clean at the tested SHA.

David then directed finalizing the modules and moving on instead of continuing
the Windows repair/retest loop. Finalization therefore uses the already verified
macOS/zsh Lab 5 path and unchanged acceptance criteria. Windows validation is
paused and incomplete, not waived or passed. No further adapter fix, replay,
host configuration change, test skip, or gate change is part of this batch.
The [Windows handoff](../maintainers/WINDOWS-REVALIDATION.md) is retained as a
historical assignment. Implementation completion is separate from merge and
post-merge scope closeout; the active scope records that delivery boundary.

### Reported native Windows learner walkthrough

A later learner report in issue 65 supersedes the earlier command-path disposition without
retroactively changing the incomplete maintainer test run above. On 2026-09-12 the learner
reported completing the full Lab 5 sequence with PowerShell 7.6.6, Node.js 26.8.1, and npm
11.19.0: create, guard, isolated `npm.cmd` install, pin verification, checkpoint, both stale
exit-1 observations and recoveries, all five final checks, fresh reset, and both archives.

Proof `local-0.112.0-lab05-windows-iUxLAC` independently replayed that route on Windows 11
build 26200 with PowerShell 7.6.5, Node.js 26.8.1, and npm 11.19.0. The real pinned install,
checkpoint, both stale/recovery pairs, all five final checks, distinct reset, and both
outside-directory archives passed. The completed `iUxLAC` and reset `dYHJI7` attempts remain
under the OS-temp `3ci-directive-lab-archive` directory.

The course now publishes that PowerShell 7.4+ route and requires the done statement to record
the learner's actual OS and shell. This bounded proof is not an automated Windows matrix
result and does not claim that the host's separate symlink-capability tests pass.

### Local tooling verification

The original implementation's `npm run test:modules-4-5` passed all 46 tests, with none skipped. These include 32 content
contract tests and 14 fixture/safety tests. An additional Node.js built-in coverage run
over `labs/fixtures/05-projection-drift-recovery/*.mjs` and
`scripts/verify-modules-4-5.mjs`, with 90% line/branch/function thresholds, passed:

| Tooling source | Lines | Branches | Functions |
| --- | ---: | ---: | ---: |
| `projection-lab.mjs` | 95.98% | 96.67% | 100% |
| `safety.mjs` | 96.61% | 91.67% | 100% |
| `verify-modules-4-5.mjs` | 98.55% | 95.60% | 100% |
| Combined | 97.27% | 95.43% | 100% |

This coverage measures the course tooling, not the installed Directive engine or inert
fictional JavaScript input. `deft coverage:hotspots` could not consume the Node report:
it expects `coverage/coverage-final.json`. The actual Node report and explicit thresholds
above provide the coverage evidence; no engine coverage claim is made.

The inherited Git-redirection regression verifies that unsafe caller overrides are refused
before attempt creation or inspection. Error messages report variable names, not values.
Negative tests also cover foreign roots, symlinks, remotes, pins, extra files, malformed
scope inputs, missing MAP, source changes outside the permitted field, and unsafe commands
in learner Markdown.

The declared literal command is `directive verify:vbrief-conformance --project-root .`.
The configured rapid `task deft:check` executes that command successfully; it is not a
substitute for the supplemental curriculum checks or the live lab proof. The framework's
prose-clause walk remains advisory/unverifiable because this inherited scope has no
`plan.metadata.swarm.file_scope`. The independent content review and lab evidence address
those clauses; no scope digest, operator approval, or verifier result was invented.
Scope provenance likewise reports an existing migration warning for the active scope's
missing approved digest. Branch and test-boundary checks pass. Forward-coverage reports
zero recognized new source files, so it is not counted as coverage evidence for these
`.mjs` additions.

## Module 6 verification

This command-free extension uses the same exact Directive 0.112.0 package pin and immutable
release commit recorded above. The relevant deposited sources were re-read on 2026-09-09;
the lesson introduces no executable learner lab, runtime-platform claim, remote action, or
implementation-authority claim.

| Deposited source inspected | Module 6 contract checked |
| --- | --- |
| `.deft/core/docs/directive-lifecycle.md` | The idea/strategy loop, recurring lifecycle surfaces, and the distinction between shaping and later delivery. |
| `.deft/core/strategies/README.md` | Preparatory and spec-generating strategy categories; historical v0.20 terminology is not treated as the current schema. |
| `.deft/core/strategies/interview.md` | Bounded interview choices, follow-up structure, and review-before-lifecycle handling. |
| `.deft/core/skills/deft-directive-setup/SKILL.md` | Recorded-strategy dispatch, direct proposed-scope creation, optional compatibility specification, and dependency-field placement. |
| `.deft/core/skills/deft-directive-decompose/SKILL.md` | Story sizing, two-to-five acceptance criteria, observable evidence, traces, and dependency-aware decomposition. |
| `.deft/core/vbrief/vbrief.md` | Epic/story hierarchy, acceptance placement under `plan.items[].narrative.Acceptance`, and dependency-DAG semantics. |
| `.deft/core/verification/verification.md` | Evidence proves outcomes rather than completed steps; static and behavioral evidence have different limits. |
| `.deft/core/verification/plan-checking.md` | Acceptance is checked for testability, observability, evidence, and traceability. |
| `.deft/core/glossary.md` | A vertical slice is independently demoable and human-observable; horizontal layer work is the wrong story shape. |
| `.deft/core/skills/deft-directive-gh-slice/SKILL.md` | A tracer bullet is a narrow complete path through relevant layers that remains independently demonstrable and verifiable. |
| `.deft/core/commands.md` | Proposed, pending, active, and completed lifecycle states and their distinct transition surfaces. |
| `.deft/core/main.md` | The current implementation contract is active xBRIEF plus live operator instruction; completed scope is historical state. |

### Teaching decisions and evidence boundary

- The idea path is taught as `idea -> bounded strategy choice -> testable/observable
  acceptance -> schema-0.8 proposed-scope artifact`. A current setup can create proposed
  scope directly; `specification.xbrief.json` is compatibility-only and optional.
- The proposed artifact keeps `plan.status: proposed`. It is reviewable candidate state,
  not approval, activation, preflight, or implementation authority.
- Testable behavior belongs in `plan.items[].narrative.Acceptance`, with two to five
  criteria plus evidence and traces for the story examples.
- A vertical slice produces one independently demoable, human-observable capability through
  the relevant layers. “Independently verifiable” is required; “independently deployable” is
  not asserted as a universal definition.
- Epic decomposition produces ordered, independently verifiable stories. Story dependencies
  use `plan.metadata.swarm.depends_on`; phase or epic records may supplement them with
  `plan.metadata.dependencies`.
- `Exclusions` and `Literal inspection` are explicitly course worksheet evidence fields, not
  canonical xBRIEF keys. Literal inspection proves the recorded artifact shape; it does not
  substitute for executable evidence when a later scope claims running behavior.

### Module 6 source disagreements

| Source disagreement | Curriculum decision |
| --- | --- |
| Strategy prose still shows deprecated `/deft:run:*` forms, while Commands uses `/deft:directive:run:*`. | Name the discrepancy in maintainer evidence; do not teach either invocation in this command-free module. |
| Strategy material retains `vBRIEF` and `v0.20 Output Contract` wording. | Teach current xBRIEF schema 0.8 and treat v0.20 as historical document-model terminology. |
| Older setup wording can imply that `specification.xbrief.json` is required. | Follow the current setup contract: it is optional compatibility state and proposed scopes can be produced directly. |
| Interview prose can read as though approval immediately promotes work. | Keep the interview result reviewable; approval, promotion, activation, and live implementation intent remain separate. |
| Generic dependency examples use `plan.metadata.dependencies`, while current story dispatch uses the swarm-specific field. | Put story dependencies in `plan.metadata.swarm.depends_on`; reserve the generic field as a phase/epic supplement. |
| The GitHub slicing skill assumes a `SPECIFICATION.md` input in part of its flow. | Use its tracer-bullet definition only; do not invent a required Markdown specification artifact. |
| Some vBRIEF prose retains legacy plan paths. | Teach lifecycle files under `xbrief/` and schema 0.8 only. |
| Curated top-level `--help` omits some registered surfaces. | Source this command-free lesson from the pinned files; do not infer absence or invent command syntax from curated help. |
| Upstream examples use unprefixed `task`, while this consumer exposes framework tasks as `task deft:*`. | Preserve the consumer namespace in maintainer checks; Module 6 itself runs no learner commands. |

The content verifier rejects missing O6.1–O6.3 mappings, missing worksheet fields or lesson
sections, stale/ranged pins, unsafe shell blocks, broken or escaping local links, unfinished
markers, broken Module 7 navigation, and any loss of the proposed-state authority boundary.
It reuses the fenced-code-aware Markdown and link utilities from the Modules 4–5
verifier so the two contracts evaluate local links consistently. It validates stable
forward navigation to learner-ready Module 7 without owning Module 7's temporary lifecycle
folder or status.

## Module 7 source validation

Module 7 was validated on 2026-09-09 against the exact local
`@deftai/directive@0.112.0` package graph in the guarded Lab 7 fixture. The global
`directive` on this host reports engine 0.113.0 and was intentionally excluded. The helper's
isolated Task PATH resolved the local 0.112.0 `deft`/`directive` launchers while admitting
only individually resolved support tools.

| Source or runtime surface | Evidence used |
| --- | --- |
| `.deft/core/commands.md` — Scope xBRIEF Lifecycle | Folder/status transitions, session routing, live implementation intent, and preflight boundaries. |
| `.deft/core/main.md` — xBRIEF Persistence | Active xBRIEF plus live operator instruction is the current implementation contract; completed scope is historical. |
| `.deft/core/tasks/scope.yml` | Consumer Task dispatch for promote, activate, complete, and cancel. |
| `.deft/core/tasks/xbrief.yml` | Consumer Task dispatch for xBRIEF preflight and the retained `--vbrief-path` engine option. |
| `.deft/core/tasks/session.yml` | Consumer Task dispatch for session start. |
| `directive commands` and lifecycle help cards | Command registration and operand/help boundaries at 0.112.0. |
| `npm run test:module-7` | Guard, reset, archive, exact pin, proposed failure, transitions, session ritual, active preflight, completion, cancellation, and no-remote assertions. |

### Exact observed lifecycle results

| Event | Exit | State/result |
| --- | ---: | --- |
| Local pinned proposed preflight | `1` | Diagnostic says only active scope is eligible; story remained `proposed/proposed`. |
| Proposed preflight through go-task 3.50.0 | `201` | Task preserved the child exit `1`; the wrapper exit is not generalized. |
| Promote | `0` | `pending/pending` |
| Activate | `0` | `active/running` |
| Cancel separate story | `0` | `cancelled/cancelled` |
| Session start | `0` | Current session ID claimed the disposable worktree. |
| Gated session ritual | `0` | Fresh gated ritual. |
| Active preflight | `0` | Ready-for-implementation result after current lab intent and session gates. |
| Complete | `0` | `completed/completed`; no product or delivery claim. |

The run wrote `proposed-preflight.json` before promotion and
`lifecycle-run.json` after final-state verification. Both records include command, exit,
stdout, stderr, exact engine baseline, environment, current-intent boundary, final pairs,
and empty remote. Tests moved only their own exact marked temporary parents into the
recoverable temporary archive; they did not delete them.

### Module 7 platform evidence

`lab07-platform-proof:macos-zsh status=verified date=2026-09-09 evidence=native-pinned-lifecycle-test`

`lab07-platform-proof:linux-bash status=candidate date=2026-09-09 evidence=not-run`

`lab07-platform-proof:windows-pwsh7 status=candidate date=2026-09-09 evidence=not-run`

On 2026-09-14 the native Windows automated helper test completed the exact
0.112.0 install and governed lifecycle with no skipped cases. The marker remains
candidate until a separate learner walkthrough is recorded.

The macOS run used Node.js 24.18.0, npm 11.16.0, Git 2.50.1, zsh 5.9, and
go-task 3.50.0. Linux/bash and native Windows/PowerShell require independent execution before
their markers or learner-facing status may become verified.

### Module 7 source disagreements

| Disagreement or environment edge | Curriculum decision |
| --- | --- |
| Scope help cards and Task descriptions say `vBRIEF` and show `vbrief/` paths. | Teach schema-0.8 `xbrief/` paths from the current lifecycle sources and observed behavior. |
| `xbrief:preflight` retains `--vbrief-path` internally. | Learner-facing Task examples use positional `xbrief/` paths; runtime evidence records the released engine option exactly. |
| `session:start --help` and `verify:session-ritual --help` exit `2` as unrecognized help requests. | Use `directive commands`, pinned source, and the exercised consumer Task forms; do not invent per-verb flags. |
| The pinned engine returns `1`, while go-task returned `201` for the same proposed preflight failure. | Treat `1` as the engine contract and preserve the nonzero wrapper exit with Task version/environment attribution. |
| A newer global Directive can shadow the course pin through the deposited Task engine. | The fixture constructs a bounded PATH whose `deft` and `directive` resolve to the attempt's 0.112.0 launchers. |
| `scope:complete` succeeds for the fixture's lifecycle-only story with no acceptance items. | State explicitly that this demonstrates lifecycle mechanics only and proves no implemented or delivered product behavior. |

The read-only Module 7 verifier rejects missing outcomes, broken local links, unsafe learner
commands, weakened guards, missing exact pins, wrong Task ordering, lost pre-promotion
evidence, reused reset roots, non-recoverable cleanup, unsupported platform promotion,
stale navigation, and active-scope/project-registry disagreement. It does not execute fixture
or Markdown commands.

## Module 8 source validation

Validation date: 2026-09-10. The pulled authoring worktree used engine 0.114.0 and deposit
0.114.0. The course remains pinned to 0.112.0, so released behavior was checked through an
explicit 0.112.0 runtime and its cached CLI/core/content/types package graph. No learner
exercise read the training repository's live queue, cache, or issue state.

### Pinned sources inspected

| Exact 0.112.0 package surface | Result |
| --- | --- |
| `@deftai/directive-content/main.md` | Confirmed read-only default, mutation ritual, active-contract conjunction, and completed-record boundary. |
| `@deftai/directive-content/commands.md` | Confirmed session recovery, ordered-plan precedence, explicit queue escape, exhaustion stop, and cache/audit roles. |
| `@deftai/directive-content/tasks/session.yml` | Confirmed `session:start` and `session:ready` registration. |
| `@deftai/directive-content/tasks/plan-sequence.yml` | Confirmed ordered-plan command family and `.deft/plan-sequence.json`. |
| `@deftai/directive-content/tasks/triage-queue.yml` | Confirmed queue/show/audit consumer Task dispatch. |
| `@deftai/directive-core/dist/triage/queue/constants.js` and `dist/triage/cache-path.js` | Confirmed `.deft-cache/` plus `xbrief/.triage-cache/candidates.jsonl`. |

### Runtime and command probes

| Probe | Exit | Observed result |
| --- | ---: | --- |
| `directive --version` in the authoring worktree | `0` | Reported engine 0.114.0. |
| Read `.deft/GENERATION.json` after update | `0` | Reported deposit 0.114.0. |
| `npx --yes --package=@deftai/directive@0.112.0 directive --version` | `0` | Reported the explicit 0.112.0 runtime: `@deftai/directive-core@0.112.0`. |
| Explicit 0.112.0 `directive commands` | `0` | Registered `session:start`, `session:ready`, `verify:session-ritual`, the plan-sequence family, `triage:queue`, and `triage:audit`. |
| Explicit 0.112.0 `directive session:start --help` | `2` | `session_start: unrecognized argument: --help`. |
| Explicit 0.112.0 `directive plan-sequence:current --help` | `2` | `unknown flag: --help`. |
| Explicit 0.112.0 `directive triage:queue --help` | `2` | `triage_queue: unrecognized argument: --help`. |
| Explicit 0.112.0 `directive verify:session-ritual --help` | `2` | `verify_session_ritual: unrecognized argument: --help`. |

The 0.112.0 and 0.114.0 relevant command inventories agree for the Module 8 surfaces.
The newer inventory additionally includes `verify:subagent-steer`, which is outside this
lesson and was not backported into the teaching contract.

### Recorded disagreements and environment edges

| Observation | Curriculum decision |
| --- | --- |
| Relevant per-verb `--help` requests exit `2` even though the verbs are registered. | Use `directive commands` plus exact released source; record the help rejection and do not invent flags. |
| The current authoring engine/deposit are 0.114.0 while the project pin and course baseline are exact 0.112.0. | Use explicit 0.112.0 runtime/source evidence for behavior and mention 0.114.0 only as authoring drift. |
| Current `deft migrate:preflight` expects `.deft/core/xbrief/schemas`, while the refreshed 0.114.0 deposit contains `.deft/core/vbrief/schemas`. | Record the 0.114.0 packaging/path mismatch as unresolved environment drift. Do not change the gate or teach it as 0.112.0 behavior. |
| Direct `npm pack` requests for separately named 0.112.0 content/core packages returned mirror `E404`, while the already cached exact package graph remained readable and the explicit runtime ran. | Cite the cached exact graph and executable version proof; do not claim a fresh standalone package download. |

The Module 8 verifier is read-only. It checks lesson and solution structure, exact baseline,
outcome evidence, posture, precedence, state paths and roles, source records, lifecycle
registry agreement, local links, and durable forward navigation. Its negative tests mutate only
temporary copies and reject instructions to inspect live project state.

## Module 9 source validation

Validation date: 2026-09-10. The authoring worktree reported engine 0.114.0 and deposit
0.114.0. Those values describe authoring drift only. Learner behavior was exercised with an
exact 0.112.0 graph for CLI/core/content/types in the guarded disposable fixture.

### Pinned sources and runtime evidence

| Surface | Observed result |
| --- | --- |
| Exact 0.112.0 `directive commands` | Registered `session:start`, `verify:session-ritual`, `verify:story-ready`, `xbrief:preflight`, and `check`. |
| Lab install and `directive --version` | Installed the exact 0.112.0 graph and reported engine 0.112.0. |
| `verify:story-ready` on the clean active story | Exit `0` with one active/running xBRIEF and one-file placement metadata. |
| Gated session ritual and active preflight | Exit `0` before product mutation. |
| Supplied focused test before edit | Exit `1`, proving the named behavior was absent. |
| Focused test after the one-file edit | Exit `0`; named, fallback, invalid-input, and fifty ordinary-name cases passed. |
| CLI and diff evidence | `Hello, Ada!`, `Hello, teammate!`, exact `src/greeting.mjs` diff, and clean patch check. |

The pinned story needed structured `intended_placement` metadata as well as `file_scope` for
the released story-ready/preflight path. The current 0.114.0 migration preflight expects
`.deft/core/xbrief/schemas`, while the refreshed deposit exposes the older
`.deft/core/vbrief/schemas` path; that packaging drift was recorded and not taught as
0.112.0 behavior. Gates, policy, and deposits were not edited to hide it.

Platform evidence:

- `module09-platform-proof:macos-zsh status=verified`
- `module09-platform-proof:linux-bash status=candidate`
- `module09-platform-proof:windows-powershell status=candidate`

On 2026-09-14 the native Windows automated helper test completed readiness,
the bounded one-file implementation, behavioral/diff evidence, and recovery with
the exact 0.112.0 graph. Independent learner sign-off remains outstanding.

The Module 9 verifier checks lesson/lab/solution structure, exact baseline, readiness order,
guard and one-file scope language, outcomes, evidence names, source records, package scripts,
links, and durable forward navigation through learner-ready Modules 10–11. Negative tests mutate only OS-temporary copies. The
fixture suite additionally executes guard rejection, exact pinning, expected red, final
behavior, narrow diff, fresh reset, and recoverable archive on the verified host.

## Module 10 source validation

Validation date: 2026-09-10. The authoring worktree reported engine 0.114.0 and deposit
0.114.0. Those values describe authoring drift only. Learner behavior was exercised with an
exact 0.112.0 graph for CLI/core/content/types in the guarded disposable fixture.

### Pinned sources and runtime evidence

| Surface | Observed result |
| --- | --- |
| `directive --version` through the isolated package | Exit `0`; reported engine 0.112.0. |
| Exact 0.112.0 `directive commands` | Exit `0`; registered `verify:ac`, `verify:forward-coverage`, and `check`. |
| `directive verify:ac --help` | Exit `2`; `verify_ac: unrecognized argument: --help`. |
| `directive verify:forward-coverage --help` | Exit `0`; listed project-root, staged/head, allow-list, coverage-report, enforce, and quiet options. |
| `directive check --help` | Exit `2`; `check: unrecognized argument: --help`. |
| Guarded fixture install | Installed the exact 0.112.0 package/core/content/types graph, restored its immutable local Taskfile, and created a clean checkpoint on `training/module-10` with no remote. |
| Focused red | Exit `1`; the assertion diff named missing `average` behavior, then the helper froze the test digest. |
| Focused green and refactor | Exit `0` twice; `{ count: 3, total: 12, average: 4 }` remained stable while the source digest changed for refactor. |
| Literal acceptance | Direct `node src/summary.mjs 2 4 6` and arbitrary `npm run summary` were safety-refused; the test/check family commands in the supplied active contract passed. |
| Forward coverage | Exit `0`; source-to-test correspondence passed. No coverage report existed, so no changed-branch percentage was claimed. |
| Seeded aggregate failure | Focused, literal, and forward checks passed before `quality:record` failed with `quality record is incomplete`. |
| Bounded repair and final aggregate | Only `quality-record.json` changed after diagnosis; the same aggregate passed and gate fingerprints were unchanged. |

The literal allowlist observations are released 0.112.0 behavior. The current 0.114.0
authoring engine was not substituted into the learner fixture. The aggregate is intentionally
separate from the root story's literal acceptance list so it cannot recursively invoke itself.
No Taskfile, verifier, policy, package script, active acceptance definition, or framework
deposit was changed to clear a failure.

Platform evidence:

- `module10-platform-proof:macos-zsh status=verified`
- `module10-platform-proof:linux-bash status=candidate`
- `module10-platform-proof:windows-powershell status=candidate`

On 2026-09-14 the native Windows automated helper test completed red, green,
refactor, literal acceptance, aggregate diagnosis, quality-record repair, and
final verification with the exact 0.112.0 graph and no skipped cases. Independent
learner sign-off remains outstanding.

The Module 10 verifier checks lesson/lab/solution structure, exact baseline, evidence order,
gate-integrity language, outcome coverage, source records, package scripts, links, lifecycle
registry agreement, and learner-ready Module 11 navigation. Negative tests mutate only OS-temporary
copies. The fixture suite additionally executes identity and remote guards, exact pinning,
red-green-refactor sequencing, test freeze, literal and forward gates, the expected aggregate
failure, the one-record repair, final aggregate, fresh reset, and recoverable archive.

### Native Windows candidate-platform stop

On 2026-09-12, direct CLI checks on Windows 11 build 26200 with PowerShell 7.6.5 and
Node.js 26.8.1 created guarded attempts for Labs 7, 9, and 10, then invoked each helper's
`install` verb. All three exited `1` with the intended native Windows candidate-platform
message before creating `node_modules` or `.npm-cache`; none emitted `npm.cmd EINVAL`.
Each untouched attempt then archived successfully. This proves the early learner-facing
stop, not Windows learner readiness for those labs.

## Module 11 source validation

Validation date: 2026-09-11. The learner baseline remains 0.112.0. During Module
11 validation, the default unqualified shell CLI reported engine 0.114.0. Final
authoring gates explicitly selected the NVM-managed CLI, which reported engine
0.116.0, to match the current 0.116.0 deposit for that Module 11 pass. Current
capstone authoring reports CLI/engine and deposit 0.117.0. These authoring values describe drift
only; they are not substituted for the pinned learner contract.

### Immutable source evidence

All hashes below are SHA-256 over bytes at release commit
`7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808`.

| Pinned source | SHA-256 | Contract used by Module 11 |
| --- | --- | --- |
| `content/skills/deft-directive-pre-pr/SKILL.md` | `f60a8eaee395cc65d550b95fab6da8348817de023c3f63accebfbdfc88eeea42` | `Loop Phases`, Read through Loop, restart after edits, and the zero-change exit condition. |
| `content/skills/deft-directive-review-cycle/SKILL.md` | `ff0337151f6f545999367df87a307c3892707df79ffdadeb06c6ef2c10f15082` | Principle authority, read/classify before editing, acceptance-scope disposition, one fix batch, and current-head re-review. |
| `content/coding/review.md` | `f00e769f61d6be1494294d334c30983b07716bcc41584524424069f7e0d3b8bf` | Universal review requirements, P0/P1/P2 severity and merge gate, and review anti-patterns. |
| `content/docs/directive-lifecycle.md` | `14ea6bfd92cc8d49bdce173206f4d73670e24c87abdb0bf620b6bbe218799c52` | Delivery integrity versus deployment and UAT, including the integration-merge boundary. |

The first three current 0.117.0 deposit files differ from the pinned hashes. In
particular, the newer pre-PR skill moves aggregate-gate placement and the
review material contains newer policy and adapter mechanics. The lifecycle
source remains byte-identical for the cited delivery boundary. Module 11
teaches the pinned 0.112.0 contract only.

### Exercise adaptation and safety

The fixed packet paraphrases the four sources and supplies fictional H1/H2
evidence. It contains one in-scope P0 configured-secret-value exposure, one
in-scope P1 cross-file contract mismatch, one nonblocking P2, and one
out-of-scope P2.
The learner classifies all four before proposing a coherent F1/F2 batch, then
requires checks and review bound to H2.

The exercise implements the project ReviewModel with simulated findings. It
uses no live review bot, GitHub repository, CI run, merge, deployment, UAT,
credential value, client data, or host automation. Greptile is disabled for
this project, so no Greptile adapter, confidence, polling, or status behavior is
part of the learner path.

The Module 11 verifier checks the fixed packet, blank pre-PR worksheet and
phase order, unique semantic classification rows, contradiction rejection,
coherent batching, current-product evidence, three independent completion
axes, source records, navigation, lifecycle registry, exact package scripts,
and the learner-ready capstone transition. Its negative tests mutate only
unique OS-temporary copies of repository content. Because the exercise is
command-free, it makes no platform-runtime claim.

## Capstone source validation

Validation date: 2026-09-12. The
[learner-ready capstone](../curriculum/capstone-end-to-end.md) preserves the
exact `@deftai/directive@0.112.0` learner graph. The complete Directive proof
uses Node.js `24.20.0`. The fictional application source remains Node.js
20-compatible as a source-level design constraint based on source review; no
isolated Node.js 20 execution or workflow job is claimed.

### Fixture and evidence sources

The fixture helper owns guarded creation, identity checks, strict stage
transitions, evidence generation, fresh reset, and recoverable archive. The
fixture test exercises direct entry, shell-independent argument handling,
command parsing, guarded no-remote creation, unsafe-root refusal, path safety,
reset/archive behavior, and the full local rehearsal. A fresh local run on
2026-09-12 passed 8/8 tests.

The fixture Taskfile keeps the fictional story's literal acceptance commands
(`npm run test:focused` and `npm run check:behavior`) separate from the
aggregate `check` task. The aggregate runs focused tests, literal acceptance,
forward coverage, and `review:evidence` in that order. The workflow runs only
the fixture suite on the three named native images with Node.js `24.20.0`,
Task `3.50.0`, uv `0.11.10`, and Python `3.13.13` on Windows.

### Immutable fixture provenance

Fixture PR [#48](https://github.com/3Ci-Consulting/directive-training/pull/48)
was squash-merged on 2026-09-12. Its head was
`4f8ca7e36723e094ed1a19aa9593f01c0b798cdf`; the merge commit was
`1ad4c23f03498af745eec972e7c3f5a63b97d4b4`. A same-session probe reported
these successful checks:

| Check | Image or boundary | Evidence |
| --- | --- | --- |
| `macos-node24` | `macos-15` | [GitHub Actions job 103507813471](https://github.com/3Ci-Consulting/directive-training/actions/runs/34676736925/job/103507813471) |
| `linux-node24` | `ubuntu-24.04` | [GitHub Actions job 103507813395](https://github.com/3Ci-Consulting/directive-training/actions/runs/34676736925/job/103507813395) |
| `windows-node24` | `windows-2022` | [GitHub Actions job 103507813491](https://github.com/3Ci-Consulting/directive-training/actions/runs/34676736925/job/103507813491) |
| `no-mixed-core-and-app` | repository boundary | [GitHub Actions job 103507813463](https://github.com/3Ci-Consulting/directive-training/actions/runs/34676736936/job/103507813463) |

- `capstone-platform-proof:macos-node24 status=verified date=2026-09-12 evidence=gha-run-34676736925-job-103507813471`
- `capstone-platform-proof:linux-node24 status=verified date=2026-09-12 evidence=gha-run-34676736925-job-103507813395`
- `capstone-platform-proof:windows-node24 status=verified date=2026-09-12 evidence=gha-run-34676736925-job-103507813491`

This matrix proves the fixture implementation on those bounded runners. It
does not claim that an independent learner completed the written walkthrough,
nor does it generalize to other operating-system images, shells, package
managers, or coding-agent hosts.

### Semantic boundary retained in the learner material

- The outer `red` and `aggregate` helper processes exit `0` and print
  `"EXPECTED_FAILURE"` when the intended inner command fails; the nested
  evidence carries the nonzero exit.
- `pre-pr` records `CAP-P1-001` without editing. `review` checks the
  repaired current-product bytes before the final commit, and `close` proves
  the bytes are unchanged before committing and rerunning the aggregate.
- Helper stage `COMPLETE` is not Directive lifecycle completion. The fictional
  scope remains `active/running`, and closeout records only
  `implemented`/`local_pass`.
- Reset creates a different fresh root and preserves earlier evidence. Archive
  is a recoverable move of one exact attempt parent. Neither reset nor archive
  emits JSON, and both attempts' launcher roots and residual launcher
  directories remain named OS-temporary cleanup items.
- Installation contacts the configured npm registry; no instructor, Greptile,
  live reviewer, remote mutation, deployment, publication, or UAT service is
  required after that prerequisite.

## Source-file verification

Hashes are SHA-256 over file bytes at the peeled release commit.

| Pinned source | SHA-256 | Consumer-deposit result |
| --- | --- | --- |
| `README.md` | `10d14274e9e2a6ebe1d49ff85141eaf1c086e7bca9614ed9ce8d2db60f30c0f6` | Source-repository-only; not in `.deft/core/`. |
| `docs/CATEGORY.md` | `5ac68491bfc455188ed3beffe8e398f3ed29e4d273dfb8c7b12306fe22d035c3` | Source-repository-only; not in `.deft/core/`. |
| `docs/CONCEPTS.md` | `20fe9d9a0ab72c9922b7c4fb22ed6944f41d73c7730b25347c41af9c27c79161` | Source-repository-only; not in `.deft/core/`. |
| `content/conventions/references.md` | `a07578a13eeb1bfb20f10d08aff4e71549a63e3f7585bb5be9d32827d2ebaf98` | Reconstituted at `.deft/core/conventions/references.md` with the deposit marker and one relative-link rewrite; deposited hash `1a31bb6c4406189acbf1bb95c1832f55389bfe300e190a5946f60025366435d4`. |
| `content/docs/directive-lifecycle.md` | `14ea6bfd92cc8d49bdce173206f4d73670e24c87abdb0bf620b6bbe218799c52` | Byte-identical at `.deft/core/docs/directive-lifecycle.md`. |
| `content/coding/review.md` | `f00e769f61d6be1494294d334c30983b07716bcc41584524424069f7e0d3b8bf` | Current 0.117.0 deposit differs; Module 11 uses the immutable release bytes. |
| `content/skills/deft-directive-pre-pr/SKILL.md` | `f60a8eaee395cc65d550b95fab6da8348817de023c3f63accebfbdfc88eeea42` | Current 0.117.0 deposit differs; Module 11 uses the immutable release bytes. |
| `content/skills/deft-directive-review-cycle/SKILL.md` | `ff0337151f6f545999367df87a307c3892707df79ffdadeb06c6ef2c10f15082` | Current 0.117.0 deposit differs; only its universal review boundary is adapted. |
| `content/commands.md` | `eb012055fe7c3d410016e5e8ee386dc232de997dd9d57ba245125b25d6f45c50` | Current 0.117.0 deposit differs; deposited hash `a181ef68c78de1808450cb5e4a3b432a24e0505d8423f200859e0c2a19308e7b`. Learner claims use the pinned source. |
| `content/strategies/README.md` | `e21090a90ca0ed3c4b324afebef53392292a4e43e86e2b9ea74a1058659de8aa` | Current 0.117.0 deposit differs; deposited hash `59c3d08371ffaafad8881736a61cdb561abb88b0eea403b68193fa185a8db03f`. Learner claims use the pinned source. |
| `LICENSE` | `4322170c478362f7beb21558b4585f706a8b9e8d22fbda53f81d90f9aebfaeb5` | Notice text matches `.deft/core/LICENSE.md`; the deposited copy adds a Markdown heading marker. |

An earlier reconstitution comparison found two strategy-file rewrites: a
`deft:deposit-link-rewrite` marker and one relative example link. The current
0.117.0 deposit has a different hash and was not substituted for pinned learner
evidence; any new teaching claim from that current file requires a fresh
content comparison.

## Recorded disagreements and curriculum decisions

| Surface disagreement | Curriculum decision |
| --- | --- |
| `scope:promote --help` and `scope:activate --help` describe vBRIEF files and `vbrief/` example paths even though current sources define xBRIEF as canonical. | Teach `xbrief/` and xBRIEF 0.8. Use the help card only for flags until upstream wording changes. |
| 0.111.0 rejected the `--` separator advertised by `scope:record-approved-scope --help`; 0.112.0 accepts it. Both separator and direct-positional probes reached the expected operator-TTY authorization refusal in the agent shell. | Teach the documented `-- <xbrief-path>` form for 0.112.0. Treat [deftai/directive#4203](https://github.com/deftai/directive/issues/4203) as resolved release history, not a current workaround. |
| `xbrief:preflight --help` names the current verb but retains `--vbrief-path` as an option alias. | Prefer the documented positional active `xbrief/` path in learner examples; record the legacy option name rather than treating it as the current data model. |
| The strategy README uses deprecated `/deft:run:*` forms, while `content/commands.md` names `/deft:directive:run:*` as canonical. | Teach the namespaced `/deft:directive:run:*` form and label the shorter form legacy. Revalidate when strategy modules are authored. |
| The strategy README's `v0.20 Output Contract` section still says "scope vBRIEFs" in places. | Explain that v0.20 names the document-model cutover; current authoring is xBRIEF schema 0.8. |
| The release README says some `.deft/core/run` verbs remain available, while Concepts and Commands call the Python launcher retired and the npm deposit contains no launcher. | Follow observed deposit behavior and Commands: teach `directive`, `deft`, or `task`; omit `.deft/core/run` from the beginner path. |
| `session:start --help` and `check --help` reject `--help`, although the project requires per-verb help verification. | Record the rejection, use `directive commands` plus pinned source, and never invent flags. |
| `directive --help` omits registered verbs including `scope:activate`, `xbrief:preflight`, and `verify:vbrief-conformance`. | Treat top help as curated. Use `directive commands` for registry coverage. |
| Upstream source docs use unprefixed `task` commands; this consumer's include is named `deft`. | Teach consumer forms such as `task deft:check`, `task deft:scope:promote`, and `task deft:scope:activate`. |
| `task --list` descriptions for the two scope lifecycle tasks also retain vBRIEF wording. | Use the task names as executable surfaces, but take current terminology and paths from the xBRIEF sources. |
| The release README says `init` creates a committed package pin, but the shipped 0.112.0 init path did not call the available pin-writing primitive and the disposable probe received no automatic pin. | Put and verify the exact `@deftai/directive: 0.112.0` pin in `package.json` before init; do not promise that init creates it. |
| Released prose describes a new empty directory as a scaffold, but 0.112.0 treats `.git` alone as sufficient for `brownfield-install`. | A lab that runs `git init` first expects the brownfield label. Scaffold classification requires a disposable non-Git directory. |
| `doctor` is described as read-only, but a normal run writes ignored throttle metadata. | Describe doctor as non-mutating to tracked product state and remotes, not as performing zero filesystem writes. |
| A 0.111.0 `update --dry-run` probe formatted planned deletions as past-tense `Removed:` entries. A current-state 0.112.0 probe exited 0, reported `No dest mutations recorded`, and changed no files. | Treat dry-run output as a plan. The old wording was not reproduced because the 0.112.0 target had no pending deletion. |
| 0.111.0 `directive init --headless` emitted truncated JSON; the 0.112.0 probe exited 0 and emitted a complete 6,420,515-byte document parsed successfully by `JSON.parse`. | Record the defect as resolved in 0.112.0. Headless init remains outside the beginner path because Modules 1–3 do not teach automation installation. |
| Brownfield init appended many canonical ignore entries to an existing `.gitignore` but did not append `/USER.md` or `/.deft/USER.md`; the resulting `git check-ignore USER.md` exited 1. | The lab writes those two safety entries before init and proves them afterward. Continue teaching that shared USER.md is resolved and read in place, never copied or committed. |
| Init staged most installer-managed paths, and the installed branch hook refused the first local checkpoint on the unborn `main` branch. | The lab creates `training/module-02` before init, then validates the union of already-staged and untracked paths. It does not bypass the branch gate or assume all generated files remain untracked. |

Legacy verbs remain registered, including `vbrief:activate`, `vbrief:preflight`, and
`vbrief:validate`. Registration preserves compatibility; it does not make them current
beginner guidance.

## Adaptation record

Current source-evidence status: **paraphrased and adapted**. Exact identifiers and short
unrecognized-argument messages are copied for diagnostic precision. The learner lesson
does not copy substantial upstream prose. Directive initialization did create tracked,
upstream-derived consumer integration files, so the full notice below covers those files.
Upstream copyright is
`Copyright (c) 2025-2026 Jonathan "visionik" Taylor`; the governing license is MIT and is
linked from the baseline.

## Upstream MIT notice

The following notice is copied from `LICENSE` at the pinned release commit:

```text
MIT License

Copyright (c) 2025-2026 Jonathan "visionik" Taylor
https://deft.md

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Checks run and unresolved evidence

Completed checks:

- Matched the direct package pin, installed CLI/core/content versions, and deposit generation.
- Resolved the official annotated tag and peeled commit through local git and remote refs.
- Matched the npm `gitHead` to the peeled release commit and recorded artifact integrity.
- Verified every source path and cited heading or label used for Modules 2–3 at the release
  commit.
- Compared the preserved MIT notice byte-for-byte with `LICENSE` at the release commit.
- Compared the four deposited source files byte-for-byte and explained the two files with deposit rewrites.
- Executed global help, full command inventory, and each listed verb-help probe.
- Executed the exact project-local disposable consumer path on macOS/zsh, including guarded
  reset, help probes, init, positive anatomy/generation/schema/hook assertions, seven ignore
  assertions, a 138-path allowlist, a feature-branch checkpoint through the project-local
  `deft` hook runtime, full doctor, toolchain check, literal clean-state acceptance, and
  archive verification for both no-remote attempts.
- Revalidated the setup skill's consumer-first and contributor-boundary sections for Modules
  2–3, plus the core skill's authority and lazy-loading sections.
- Confirmed the consumer `task deft:*` namespace through `Taskfile.yml` and `task --list`.
- Confirmed the six deferred skill-contract files exist at the release commit.

Unresolved or deliberately deferred evidence:

- pnpm, coding-host integration, and operating-system or shell versions outside the recorded
  local and GitHub-hosted runner bounds remain unproved. Do not generalize the three successful
  matrix jobs beyond their explicit npm, image, shell, Node.js, and Directive versions.
- The repository has no lockfile or project-local install. The exact direct pin and the exact
  global packages were verified, but a future install's full dependency graph is not locked
  here.
- The release tag was resolved but no cryptographic tag signature was present or verified.
- Build, refinement, and swarm procedure details beyond the bounded curriculum excerpts
  remain deferred until their modules are authored and revalidated. Pre-PR and review-cycle
  behavior used by Module 11 is now revalidated at the immutable 0.112.0 commit. Setup and
  authority material needed for Modules 2–3 and the setup/decomposition claims used by
  Module 6 were revalidated in their respective passes.
