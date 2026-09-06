# Directive source notes

These notes preserve the probe results behind [SOURCE-BASELINE.md](./SOURCE-BASELINE.md).
They are maintainer evidence, not a learner command reference.

## Verification context

- Verification dates: 2026-09-05 and 2026-09-06.
- Host used: macOS with zsh and Node.js 24.18.0.
- Project direct pin: `@deftai/directive` 0.111.0 in `devDependencies`.
- The training project had no project-local `node_modules` or lockfile; its exact direct pin
  is a reconstitution anchor, not proof of a local install.
- Executed CLI: global `/opt/homebrew/bin/directive`.
- Installed CLI, core engine, and content package: 0.111.0 each.
- Reconstituted deposit generation: 0.111.0 on all recorded surfaces.
- Official tag: `v0.111.0`; peeled commit and npm `gitHead`:
  `750b79f6ed343393e42142f419dfb0591cca5a21`.
- The complete macOS/zsh Module 2 rehearsal used two unique disposable, no-remote Git
  repositories under one operating-system temporary parent. The fresh reset attempt installed
  the exact fixture graph, ran every help and initialization check, committed the inspected
  allowlist, passed literal acceptance, and archived both attempts.
- Authorized GitHub Actions run
  [34040576589](https://github.com/3Ci-Consulting/directive-training/actions/runs/34040576589)
  repeated the guarded path with Node.js 24.20.0 on `macos-15`, `ubuntu-24.04`, and
  `windows-2022`; all three native jobs passed at head
  `4c73458f1586259359f4ca3d7be4d614d6908cd2`.

## Version and provenance probes

| Probe | Exit | Result |
| --- | ---: | --- |
| Read the exact value from `package.json` | 0 | `@deftai/directive: 0.111.0` under `devDependencies`. |
| `directive --version` | 0 | Reported engine `@deftai/directive-core@0.111.0`. |
| Read the installed CLI package manifest | 0 | CLI package version 0.111.0. |
| `npm ls -g --depth=1` for the package graph | 0 | CLI, content, and core resolved to 0.111.0. |
| Read `.deft/GENERATION.json` and `.deft/core/VERSION` | 0 | Deposit surfaces say 0.111.0 and tag `v0.111.0`; `VERSION` identifies a content-package deposit. |
| `git ls-remote` for `refs/tags/v0.111.0` and its peel | 0 | Tag object `00115182c859e96d0fe6f168f118fff3ad1a807f`; commit `750b79f6ed343393e42142f419dfb0591cca5a21`. |
| `npm view @deftai/directive@0.111.0` | 0 | Version, tarball integrity, repository, and `gitHead` resolved; `gitHead` matched the tag peel. |

The CLI help banner displays `Directive v0.111`, without the patch component. Use package
metadata, `directive --version`, and the deposit generation record for the exact 0.111.0 pin.

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
| `directive scope:record-approved-scope --help` | No | Yes | Exit 2; printed usage that advertises a `--` separator, although the released command rejects that separator. |
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

The 2026-09-06 macOS/zsh proof `local-disposable-project-local-hook-full` used a fresh
operating-system temporary parent, two Git repositories with no remotes, the fictional Module
2 fixture, and the explicit project-local CLI and hook runtime. The first attempt stopped
after the guarded Git start; the second exercised the complete learner path as a
fresh-directory reset. Neither attempt initialized or mutated the training working tree.

| Probe | Exit | Relevant result |
| --- | ---: | --- |
| `npm install --ignore-scripts --no-audit --no-fund` with an empty temporary npm user config | 0 | Added 48 packages; CLI, core, and content resolved through the fixture's exact 0.111.0 pin and overrides. |
| Fixture and installed-graph assertions | 0 | `private: true`; the direct CLI pin and CLI/core/content/types installed package versions were all exactly 0.111.0. |
| `./node_modules/.bin/directive --version` | 0 | Reported engine `@deftai/directive-core@0.111.0`. |
| Project-local hook-runtime assertions | 0 | `PATH` selected the disposable attempt's `node_modules/.bin/deft` before init and commit; `core.hooksPath` was exactly `.githooks`. |
| Top help, command inventory, and init/update/doctor help | 0 each | Every ordinarily supported help probe completed through the explicit local binary. |
| `toolchain:check --help` diagnostic probe | 2, expected | Printed the recorded `unrecognized argument: --help` diagnostic; the result was asserted rather than suppressed. |
| `./node_modules/.bin/directive init --yes --repo-root .` | 0 | Classified the Git-initialized directory as brownfield and created the consumer integration. |
| Seven `git check-ignore` assertions | 0 each | Core, CLI adapter, cache, ritual, triage-cache, shared-USER, and dependency examples were ignored. |
| Staged-plus-untracked allowlist and checkpoint | 0 | Inspected 138 unique paths, positively required the initialized anchors after staging, rejected no unexpected path, and committed through the local hook on `training/module-02` as local commit `a0839aff1063e9ebd6ee0757ffdf27ad49de5445`. |
| `./node_modules/.bin/directive doctor --full --project-root .` | 0 | Reported two warnings: the canonical npm provenance/migrate signpost and a missing `xbrief/` directory despite an xBRIEF envelope. Warnings were recorded rather than treated as failure. |
| `./node_modules/.bin/directive toolchain:check --consumer --project-root .` | 0 | Reported Git 2.50.1, GitHub CLI 2.88.1, Node.js 24.18.0, npm 11.16.0, and “All required tools available.” |
| Literal clean/root/branch/remote acceptance | 0 | Both tracked diffs and complete porcelain status were empty; the canonical Git root matched the recorded attempt; branch remained `training/module-02`; remotes remained empty. |
| Fresh-directory reset and archive loop | 0 | Preserved both disposable attempts, moved their exact parent to a new temporary archive, and resolved each archived Git root before confirming both remote lists were empty. |

### Native platform matrix proof

Authorized pull-request run
[34040576589](https://github.com/3Ci-Consulting/directive-training/actions/runs/34040576589)
used the checked-in workflow, its pinned actions, Node.js 24.20.0, temporary no-remote
repositories, and the same version, help, init, anatomy, checkpoint, doctor, toolchain,
acceptance, reset, and archive assertions on each bounded runner.

| Proof marker | Bounded environment | Job evidence | Result |
| --- | --- | --- | --- |
| `macos-zsh` | GitHub `macos-15`; zsh | [job 101506460259](https://github.com/3Ci-Consulting/directive-training/actions/runs/34040576589/job/101506460259) | Passed in 19 seconds. |
| `linux-bash` | GitHub `ubuntu-24.04`; bash | [job 101506460227](https://github.com/3Ci-Consulting/directive-training/actions/runs/34040576589/job/101506460227) | Passed in 29 seconds. |
| `windows-pwsh7` | GitHub `windows-2022`; PowerShell 7.4+ gate | [job 101506460109](https://github.com/3Ci-Consulting/directive-training/actions/runs/34040576589/job/101506460109) | Passed in 71 seconds. |

The preceding run
[34040433466](https://github.com/3Ci-Consulting/directive-training/actions/runs/34040433466)
exposed a curriculum-command defect on Windows: `Get-Command deft` returned both `deft.cmd`
and the extensionless shim, and coercing both paths broke the local-runtime comparison. The
workflow and all learner Windows checks now select the first application in PATH explicitly;
the passing Windows job above verifies that correction. This was not a Directive behavior
disagreement.

This evidence is bounded to those runner labels, shells, the npm fixture path, and the pinned
0.111.0 graph. It does not verify pnpm, other operating-system images, or coding-host
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

- `platform-proof:macos-zsh status=verified date=2026-09-06 evidence=local-disposable-project-local-hook-full+gha-run-34040576589`
- `platform-proof:linux-bash status=verified date=2026-09-06 evidence=gha-run-34040576589`
- `platform-proof:windows-pwsh7 status=verified date=2026-09-06 evidence=gha-run-34040576589`

PowerShell 7.6.5 on the macOS host supplied syntax inspection only. Native Windows evidence
comes from the bounded `windows-2022` job above; the macOS inspection is not counted twice.

## Source-file verification

Hashes are SHA-256 over file bytes at the peeled release commit.

| Pinned source | SHA-256 | Consumer-deposit result |
| --- | --- | --- |
| `README.md` | `f101b72f1b9b20c400ddd6b39793332d56ced989aebe82817df0eb5f8bcef9e3` | Source-repository-only; not in `.deft/core/`. |
| `docs/CATEGORY.md` | `5b98ec4fd10c6197578d47231074fc1f14410275ca8ba285f8778d1e01001ebd` | Source-repository-only; not in `.deft/core/`. |
| `docs/CONCEPTS.md` | `20fe9d9a0ab72c9922b7c4fb22ed6944f41d73c7730b25347c41af9c27c79161` | Source-repository-only; not in `.deft/core/`. |
| `content/conventions/references.md` | `a07578a13eeb1bfb20f10d08aff4e71549a63e3f7585bb5be9d32827d2ebaf98` | Reconstituted at `.deft/core/conventions/references.md` with the deposit marker and one relative-link rewrite; deposited hash `1a31bb6c4406189acbf1bb95c1832f55389bfe300e190a5946f60025366435d4`. |
| `content/docs/directive-lifecycle.md` | `14ea6bfd92cc8d49bdce173206f4d73670e24c87abdb0bf620b6bbe218799c52` | Byte-identical at `.deft/core/docs/directive-lifecycle.md`. |
| `content/commands.md` | `86371bed0e2e7e6c34a5aabbb5adfab071da01e0c680cd68ec7c3e79136b2a39` | Byte-identical at `.deft/core/commands.md`. |
| `content/strategies/README.md` | `e21090a90ca0ed3c4b324afebef53392292a4e43e86e2b9ea74a1058659de8aa` | Reconstituted at `.deft/core/strategies/README.md` with deposit-only rewrites. |
| `LICENSE` | `4322170c478362f7beb21558b4585f706a8b9e8d22fbda53f81d90f9aebfaeb5` | Notice text matches `.deft/core/LICENSE.md`; the deposited copy adds a Markdown heading marker. |

The reconstituted strategy file differs in two known ways: it adds a
`deft:deposit-link-rewrite` marker and changes one example link from
`../strategies/interview.md` to `interview.md`. The headings and teaching claims used by this
baseline are otherwise unchanged.

## Recorded disagreements and curriculum decisions

| Surface disagreement | Curriculum decision |
| --- | --- |
| `scope:promote --help` and `scope:activate --help` describe vBRIEF files and `vbrief/` example paths even though current sources define xBRIEF as canonical. | Teach `xbrief/` and xBRIEF 0.8. Use the help card only for flags until upstream wording changes. |
| `scope:record-approved-scope --help` advertises a `--` separator that the released command rejects with `scope_record_approved_scope: unrecognized argument: --`. | For 0.111.0, pass the xBRIEF path directly without the separator. The upstream defect is tracked in [deftai/directive#4203](https://github.com/deftai/directive/issues/4203). |
| `xbrief:preflight --help` names the current verb but retains `--vbrief-path` as an option alias. | Prefer the documented positional active `xbrief/` path in learner examples; record the legacy option name rather than treating it as the current data model. |
| The strategy README uses deprecated `/deft:run:*` forms, while `content/commands.md` names `/deft:directive:run:*` as canonical. | Teach the namespaced `/deft:directive:run:*` form and label the shorter form legacy. Revalidate when strategy modules are authored. |
| The strategy README's `v0.20 Output Contract` section still says "scope vBRIEFs" in places. | Explain that v0.20 names the document-model cutover; current authoring is xBRIEF schema 0.8. |
| The release README says some `.deft/core/run` verbs remain available, while Concepts and Commands call the Python launcher retired and the npm deposit contains no launcher. | Follow observed deposit behavior and Commands: teach `directive`, `deft`, or `task`; omit `.deft/core/run` from the beginner path. |
| `session:start --help` and `check --help` reject `--help`, although the project requires per-verb help verification. | Record the rejection, use `directive commands` plus pinned source, and never invent flags. |
| `directive --help` omits registered verbs including `scope:activate`, `xbrief:preflight`, and `verify:vbrief-conformance`. | Treat top help as curated. Use `directive commands` for registry coverage. |
| Upstream source docs use unprefixed `task` commands; this consumer's include is named `deft`. | Teach consumer forms such as `task deft:check`, `task deft:scope:promote`, and `task deft:scope:activate`. |
| `task --list` descriptions for the two scope lifecycle tasks also retain vBRIEF wording. | Use the task names as executable surfaces, but take current terminology and paths from the xBRIEF sources. |
| The release README says `init` creates a committed package pin, but the shipped 0.111.0 init path did not call the available pin-writing primitive and the disposable probe received no automatic pin. | Put and verify the exact `@deftai/directive: 0.111.0` pin in `package.json` before init; do not promise that init creates it. |
| Released prose describes a new empty directory as a scaffold, but 0.111.0 treats `.git` alone as sufficient for `brownfield-install`. | A lab that runs `git init` first expects the brownfield label. Scaffold classification requires a disposable non-Git directory. |
| `doctor` is described as read-only, but a normal run writes ignored throttle metadata. | Describe doctor as non-mutating to tracked product state and remotes, not as performing zero filesystem writes. |
| `update --dry-run` says no changes are written but formats planned deletions as past-tense `Removed:` entries. | Call the output a proposed plan. A 2026-09-06 probe confirmed the named backup remained after dry-run. |
| `directive init --headless` exited 0 but emitted truncated, invalid JSON in the observed 0.111.0 run. | Keep headless init outside the beginner path and do not use its stdout as evidence until the defect is resolved and reverified. |
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
- Build, pre-PR, review-cycle, refinement, and swarm procedure details remain deferred until
  their curriculum modules are authored and revalidated. Setup and authority material needed
  for Modules 2–3 was revalidated in this pass.
