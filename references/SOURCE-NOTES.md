# Directive source notes

These notes preserve the probe results behind [SOURCE-BASELINE.md](./SOURCE-BASELINE.md).
They are maintainer evidence, not a learner command reference.

## Verification context

- Verification date: 2026-09-05.
- Host used: macOS with zsh and Node.js 24.18.0.
- Project direct pin: `@deftai/directive` 0.111.0 in `devDependencies`.
- Project-local `node_modules` and a lockfile were absent.
- Executed CLI: global `/opt/homebrew/bin/directive`.
- Installed CLI, core engine, and content package: 0.111.0 each.
- Reconstituted deposit generation: 0.111.0 on all recorded surfaces.
- Official tag: `v0.111.0`; peeled commit and npm `gitHead`:
  `750b79f6ed343393e42142f419dfb0591cca5a21`.

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
- Verified all seven required behavior-source paths and exact headings at the release commit.
- Compared the preserved MIT notice byte-for-byte with `LICENSE` at the release commit.
- Compared the four deposited source files byte-for-byte and explained the two files with deposit rewrites.
- Executed global help, full command inventory, and each listed verb-help probe.
- Confirmed the consumer `task deft:*` namespace through `Taskfile.yml` and `task --list`.
- Confirmed the six deferred skill-contract files exist at the release commit.

Unresolved or deliberately deferred evidence:

- Linux, Windows, bash, PowerShell, project-local npm, and pnpm execution were not probed in
  this pass. Do not claim cross-platform verification from the macOS results.
- The repository has no lockfile or project-local install. The exact direct pin and the exact
  global packages were verified, but a future install's full dependency graph is not locked
  here.
- The release tag was resolved but no cryptographic tag signature was present or verified.
- Setup, build, pre-PR, review-cycle, refinement, and swarm procedure details remain deferred
  until their curriculum modules are authored and revalidated.
