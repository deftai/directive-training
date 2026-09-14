# Lab 5 — Repair Projection Drift Through Its Source

## Lab record

| Field | Value |
| --- | --- |
| Stable ID | `lab-05-projection-drift-recovery` |
| Supports | Module 5 outcomes O5.1 (ownership), O5.2 (recovery), O5.3 (evidence and reset) |
| Status | Learner-ready draft for verified macOS/zsh and Windows/PowerShell paths |
| Last verified | 2026-09-12 |
| Directive baseline | `@deftai/directive@0.112.0` and core/content/types 0.112.0; [source baseline](../references/SOURCE-BASELINE.md) |
| Duration | 30–35 minutes, including checks, retry, and archive |
| Platforms verified | macOS 26.6.2/zsh 5.9; Windows/PowerShell 7.4+ path verified on Windows 11 with PowerShell 7.6.5, Node.js 26.8.1, npm 11.19.0, plus a learner report on PowerShell 7.6.6 |
| Other platforms | Linux/bash is not verified for this lab; no Linux learner command path is claimed |

Version-sensitive statements cite the pinned release. Local requirements name their source,
and learning techniques explain their purpose.

## Goal and done condition

Repair an incorrectly edited codebase map, then change its authoritative description and
regenerate the map. Keep evidence of both expected failures and successful retries.

**Done:** all five final acceptance commands pass; your explanation identifies the source
and projection; a fresh reset preserves the earlier attempt; and both attempts have a
recorded archive or retained-for-recovery state.

## Fictional scenario

Northstar Stop Codes is fictional. Its single JavaScript file supplies input for a codebase
map. The first description says “Normalize fictional stop codes.” The requested description
is “Normalize and validate fictional stop codes.”

This is an architecture-description exercise. You are not implementing validation code.
The fixture is a prepared projection exercise, not a fully initialized Directive consumer.
It supplies a pinned CLI, xBRIEF source, and a local Git checkpoint; it does not call
`directive init`, install host hooks, or create implementation scopes.

## Environment and starting-state check

Complete Modules 2–4 first. Open a dedicated zsh terminal or PowerShell 7.4+ session at this
curriculum repository's root. The first helper reads course fixtures and creates a new
repository in the operating system temporary directory. It does not initialize or edit the
curriculum checkout. Use the command blocks for your shell throughout the lab.

### Create the exact disposable fixture

```sh
set -eu
course_root="$(pwd -P)"
fixture_dir="$course_root/labs/fixtures/05-projection-drift-recovery"
test -f "$fixture_dir/projection-lab.mjs"
node --version
npm --version
git --version
lab_root="$(node "$fixture_dir/projection-lab.mjs" create)"
cd "$lab_root"
test "$(pwd -P)" = "$lab_root"
node projection-lab.mjs guard
git remote
git status --short
```

Windows/PowerShell 7.4+:

```powershell
if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required' }
$Lab05OriginalErrorActionPreference = $ErrorActionPreference
$Lab05OriginalNativePreference = $PSNativeCommandUseErrorActionPreference
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
$CourseRoot = (Resolve-Path -LiteralPath '.').Path
$FixtureDir = Join-Path $CourseRoot 'labs/fixtures/05-projection-drift-recovery'
if (-not (Test-Path -LiteralPath (Join-Path $FixtureDir 'projection-lab.mjs') -PathType Leaf)) {
  throw "fixture not found: $FixtureDir"
}
node --version
npm.cmd --version
git --version
$LabRoot = (& node (Join-Path $FixtureDir 'projection-lab.mjs') create | Out-String).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Lab 5 fixture creation failed' }
Set-Location -LiteralPath $LabRoot
if ((Resolve-Path -LiteralPath '.').Path -ne $LabRoot) { throw 'working directory differs from the recorded lab root' }
node projection-lab.mjs guard
git remote
git status --short
```

**Pass:** the printed root ends with `3ci-directive-lab05-<unique-id>/repo` under the OS
temporary directory. `git remote` prints nothing. Status lists only `.gitattributes`, `.gitignore`, `.npmrc`,
`package.json`, `projection-lab.mjs`, `safety.mjs`, `src/`, and `xbrief/` as untracked
fixture files. The helper rejects a temporary parent already inside another Git repository.

Fresh copied text uses LF endings even when the course checkout uses CRLF. The
attempt's `.gitattributes` keeps the project JSON normalized in Git, so LF or CRLF
editor saves do not become whitespace errors by themselves. This changes only the
new disposable fixture, not the course checkout or global Git settings.

The attempt's parent also contains `lab-state.json` (the original fixture snapshot used by
guards), `evidence.md`, and an empty Git template directory. Keep your notes in
`../evidence.md`. That snapshot is a reset/checking aid; the working
`xbrief/PROJECT-DEFINITION.xbrief.json` remains the source for the map.

### Install and verify the pin

This lab uses only the public npm package registry. The child install gets
a minimal environment, the lab's npm configuration, and a lab-local cache. It does not
change your shell environment, global npm configuration, or credentials. If your environment
requires an authenticated registry or proxy, stop and retain the failure; that setup is
outside this verified path.

```sh
node projection-lab.mjs guard
env -i PATH="$PATH" HOME="$HOME" npm install --userconfig "$PWD/.npmrc" --globalconfig /dev/null --cache "$PWD/.npm-cache" --ignore-scripts --no-audit --no-fund
node projection-lab.mjs verify-pin
test -x ./node_modules/.bin/directive
./node_modules/.bin/directive --version
```

Windows/PowerShell 7.4+:

```powershell
node projection-lab.mjs guard
node -e 'const { spawnSync } = require("node:child_process"); const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^npm_config_/i.test(key))); const result = spawnSync("npm.cmd", ["install", "--userconfig", ".npmrc", "--globalconfig", "NUL", "--cache", ".npm-cache", "--ignore-scripts", "--no-audit", "--no-fund"], { env, stdio: "inherit", shell: true }); process.exit(result.status ?? 1)'
if ($LASTEXITCODE -ne 0) { throw 'isolated npm install failed' }
node projection-lab.mjs verify-pin
if (-not (Test-Path -LiteralPath '.\node_modules\.bin\directive.cmd' -PathType Leaf)) {
  throw 'project-local Directive CLI is missing'
}
& .\node_modules\.bin\directive.cmd --version
```

**Pass:** the helper prints `OK: CLI/core/content/types 0.112.0`; the explicit local CLI
reports core 0.112.0. The fixture pins the CLI and overrides its core, content, and types
packages to 0.112.0. Package-count and npm notices can vary; they are not acceptance evidence.
Do not follow an npm notice to upgrade the lab's tooling.

**Recovery:** a path, pin, or installation mismatch means stop. Preserve the failed
command, exit, and sanitized error in the parent evidence note, then use “Reset to start.”
Do not substitute a global executable or install in this course repository.

## Safety boundary

- Mutations stay in the exact disposable attempt. Never initialize, reset,
  or implement in the training repository or any business repository.
- Use no remote, push, PR, deployment, publishing, credentials, or client data.
- Setup may create the fixture, local package install/cache, Git metadata,
  and the named parent evidence/marker files. The learner's only authored exercise change is
  the `purpose` string in `xbrief/PROJECT-DEFINITION.xbrief.json`.
- The helper's `inject-drift` verb deliberately inserts one labeled fault
  into `.planning/codebase/MAP.md`. This is a supplied failure state, not a recommended edit.
  Subsequent MAP writes belong to the released renderer.
- Leave `.gitattributes`, fixture helpers, source globs, projection paths, source JavaScript,
  pin, and gates unchanged. Run `guard` immediately before each mutation.

The helper checks canonical real paths, source/output ancestors, Git metadata, the original
source shape, and an empty remote. It refuses symlinked mutation targets. It is a local
exercise guard, not protection against another process concurrently replacing files.
It also rejects inherited Git repository/configuration redirection variables before creating
or guarding an attempt, so the later standalone Git commands use the visible repository.
If it names such a variable, open a fresh terminal without that override; never print its value.

## Starting checkpoint

```sh
node projection-lab.mjs guard
node projection-lab.mjs checkpoint
git show --no-patch --oneline lab-05-start
git status --short
```

Windows/PowerShell 7.4+:

```powershell
node projection-lab.mjs guard
node projection-lab.mjs checkpoint
git show --no-patch --oneline lab-05-start
git status --short
```

The helper prints pre-stage status and verbose ignore evidence, then stages exactly:

```text
.gitattributes
.gitignore
.npmrc
package-lock.json
package.json
projection-lab.mjs
safety.mjs
src/stop-code.js
xbrief/PROJECT-DEFINITION.xbrief.json
```

It prints and verifies that staged list before the local commit. The checkpoint uses the
fictional identity `3Ci Lab Learner <learner@example.invalid>` and tag `lab-05-start`.
There is no `git add --all`. Framework/runtime paths, installed packages, npm cache, MAP,
and USER.md are ignored; the shared USER.md is never read or copied. Final status is empty.
If an unexpected staged or untracked file appears, preserve the attempt and reset.

## Tasks

### Task 1 — Identify source and projection

Read `xbrief/PROJECT-DEFINITION.xbrief.json` in your editor. Find
`plan.architecture.codeStructure.modules[0]` and its `purpose` and `pathGlobs`.
The glob `src/*.js` matches the one supplied fictional file. It excludes the generated map.

The following 0.112.0 help probes have side effects:
`codebase:map --help` **writes the MAP**, and `verify:codebase-map-fresh --help` **runs the
check** instead of displaying help. Probe them only here, after the guard. Do not assume
that an arbitrary command's `--help` is read-only.

```sh
node projection-lab.mjs guard
./node_modules/.bin/directive --help
./node_modules/.bin/directive commands
./node_modules/.bin/directive verify:codebase-map-fresh --help
test ! -e .planning/codebase/MAP.md
node projection-lab.mjs guard
./node_modules/.bin/directive codebase:map --help
test -f .planning/codebase/MAP.md
./node_modules/.bin/directive verify:codebase-map-fresh --help
```

Windows/PowerShell 7.4+:

```powershell
node projection-lab.mjs guard
& .\node_modules\.bin\directive.cmd --help
& .\node_modules\.bin\directive.cmd commands
& .\node_modules\.bin\directive.cmd verify:codebase-map-fresh --help
if (Test-Path -LiteralPath '.planning/codebase/MAP.md') { throw 'MAP should still be absent' }
node projection-lab.mjs guard
& .\node_modules\.bin\directive.cmd codebase:map --help
if (-not (Test-Path -LiteralPath '.planning/codebase/MAP.md' -PathType Leaf)) { throw 'MAP was not written' }
& .\node_modules\.bin\directive.cmd verify:codebase-map-fresh --help
```

**Observe:** top help and the command registry exit 0. The first freshness probe also
exits 0 even though no MAP exists. The renderer probe then reports `Codebase MAP written`;
the final freshness probe reports `OK: generated codebase MAP is fresh`.

An absent MAP is advisory in this release. A freshness exit 0 alone
does not prove that a useful map exists. Final acceptance adds existence, banner, source,
purpose, matched-file count, and diff checks.

Open the MAP in your editor. Record its generated banner, source pointer, the `stop-code`
row, purpose, `src/*.js`, and file count `1`. The default provider's
`AST-FREE-HEURISTICS` and `PROVIDER-FALLBACK` signals describe limited extraction and the
absence of an external provider; they do not make this one-module fixture stale.

Keep an ownership table: project JSON = authored intent; JavaScript = observed repository
input; MAP = generated projection; parent snapshot/checkpoint = recovery evidence.

### Task 2 — Recover the supplied direct-edit fault

```sh
node projection-lab.mjs guard
node projection-lab.mjs inject-drift
set +e
./node_modules/.bin/directive verify:codebase-map-fresh --project-root .
projection_status=$?
set -e
test "$projection_status" -eq 1
git diff --exit-code lab-05-start -- xbrief/PROJECT-DEFINITION.xbrief.json
```

Windows/PowerShell 7.4+:

```powershell
node projection-lab.mjs guard
node projection-lab.mjs inject-drift
$Lab05ExpectedFailurePreference = $PSNativeCommandUseErrorActionPreference
try {
  $PSNativeCommandUseErrorActionPreference = $false
  & .\node_modules\.bin\directive.cmd verify:codebase-map-fresh --project-root .
  $ProjectionStatus = $LASTEXITCODE
} finally {
  $PSNativeCommandUseErrorActionPreference = $Lab05ExpectedFailurePreference
}
if ($ProjectionStatus -ne 1) { throw "expected stale-MAP exit 1; got $ProjectionStatus" }
git diff --exit-code lab-05-start -- xbrief/PROJECT-DEFINITION.xbrief.json
```

**Observe:** the MAP ends with `SIMULATED DIRECT EDIT`. Freshness exits 1 with a stale-MAP
diagnostic. The source diff check exits 0: no source fact changed.

Write one sentence rejecting direct MAP editing as the repair. Keep the expected failing
exit before regenerating from the unchanged source:

```sh
node projection-lab.mjs guard
./node_modules/.bin/directive codebase:map --project-root .
./node_modules/.bin/directive verify:codebase-map-fresh --project-root .
```

Windows/PowerShell 7.4+:

```powershell
node projection-lab.mjs guard
& .\node_modules\.bin\directive.cmd codebase:map --project-root .
& .\node_modules\.bin\directive.cmd verify:codebase-map-fresh --project-root .
```

**Checkpoint:** both commands exit 0; the simulated note disappears, and the original
purpose remains. The diagnostic may suggest `task codebase:map`, its upstream spelling.
This prepared fixture uses the verified explicit local CLI spelling above.

### Task 3 — Change the source and prove propagation

Run `node projection-lab.mjs guard`. In your editor, open only the disposable
`xbrief/PROJECT-DEFINITION.xbrief.json`. Replace this exact line:

```json
"purpose": "Normalize fictional stop codes.",
```

with:

```json
"purpose": "Normalize and validate fictional stop codes.",
```

Save valid JSON. Do not change other fields or manually update the MAP. This visible source
edit is the independent learner task; the helper does not perform it for you.
Use UTF-8 without a BOM. LF and CRLF line endings are both accepted for the source
edit; actual trailing spaces or tabs are still errors under `git diff --check`.

```sh
node projection-lab.mjs guard
git diff -- xbrief/PROJECT-DEFINITION.xbrief.json
set +e
./node_modules/.bin/directive verify:codebase-map-fresh --project-root .
projection_status=$?
set -e
test "$projection_status" -eq 1
node projection-lab.mjs guard
./node_modules/.bin/directive codebase:map --project-root .
./node_modules/.bin/directive verify:codebase-map-fresh --project-root .
node projection-lab.mjs verify-result
```

Windows/PowerShell 7.4+ (make the source edit in your editor before this block):

```powershell
node projection-lab.mjs guard
git diff -- xbrief/PROJECT-DEFINITION.xbrief.json
$Lab05ExpectedFailurePreference = $PSNativeCommandUseErrorActionPreference
try {
  $PSNativeCommandUseErrorActionPreference = $false
  & .\node_modules\.bin\directive.cmd verify:codebase-map-fresh --project-root .
  $ProjectionStatus = $LASTEXITCODE
} finally {
  $PSNativeCommandUseErrorActionPreference = $Lab05ExpectedFailurePreference
}
if ($ProjectionStatus -ne 1) { throw "expected stale-MAP exit 1; got $ProjectionStatus" }
node projection-lab.mjs guard
& .\node_modules\.bin\directive.cmd codebase:map --project-root .
& .\node_modules\.bin\directive.cmd verify:codebase-map-fresh --project-root .
node projection-lab.mjs verify-result
```

**Checkpoint:** the pre-render freshness check exits 1 because source and output differ.
After rendering, freshness and the helper both exit 0. The map's module row contains the
new purpose, `src/*.js`, and file count `1`. Only the project JSON differs from the checkpoint.
This proves the description propagated, not that validation behavior was implemented.

## Checkpoints

| State | Evidence | Required result |
| --- | --- | --- |
| Start | Guard, pin proof, `lab-05-start`, status | Correct temp root, 0.112.0 graph, no remote, clean tracked state |
| Supplied fault | Freshness plus unchanged source diff | Freshness 1; source diff 0 |
| Fault recovery | Renderer and freshness | Both 0; simulated note removed |
| Source change | Narrow source diff and freshness | Purpose-only diff; freshness 1 before rendering |
| Final | All commands below | Five exits 0 and the new purpose in an existing MAP |

## Literal acceptance commands

Run exactly from the current disposable repository root:

```sh
node projection-lab.mjs guard
node projection-lab.mjs verify-pin
./node_modules/.bin/directive verify:codebase-map-fresh --project-root .
node projection-lab.mjs verify-result
git diff --check
```

Windows/PowerShell 7.4+:

```powershell
node projection-lab.mjs guard
node projection-lab.mjs verify-pin
& .\node_modules\.bin\directive.cmd verify:codebase-map-fresh --project-root .
node projection-lab.mjs verify-result
git diff --check
```

| Command | Exit | Required signal | Outcome |
| --- | ---: | --- | --- |
| `guard` | 0 | Canonical recorded temporary root; no remote or changed source boundary | O5.3 |
| `verify-pin` | 0 | CLI/core/content/types all 0.112.0 | O5.3 |
| Released freshness command | 0 | `OK: generated codebase MAP is fresh` | O5.2–O5.3 |
| `verify-result` | 0 | `OK: source edit, existing MAP, and bounded diff` | O5.1–O5.3 |
| `git diff --check` | 0 | No whitespace error | O5.3 |

Neither helper output nor released freshness replaces the other. The helper proves this
exercise's source change, meaningful existing output, and file boundary. Directive compares
the generated content with what its current renderer expects. Your ownership and recovery
explanations remain required evidence.

## Evidence bundle

Keep these in `../evidence.md` before cleanup:

- Lab ID, date, exact version report, OS, shell, and created repository path.
- Ownership table and why a projection-only edit cannot persist a source requirement.
- Both freshness failures: one after the supplied fault and one after the source edit.
- Renderer/retry exits and all five final acceptance exits.
- The purpose-only diff, generated banner/source pointer, new module purpose, and count `1`.
- Fresh reset path, preservation evidence, and final archive paths or any retained failure.

Do not record tokens, environment dumps, unrelated files, or real repository content.

## Progressive hints

Try for eight minutes before using hints. Open one at a time.

<details>
<summary>Hint 1 — ownership</summary>

The generated banner names a source. Ask which field expresses human intent and which file
is recreated from it.

</details>

<details>
<summary>Hint 2 — inspect one row</summary>

Compare the project's first module purpose with the map's `stop-code` row. The source glob
must remain `src/*.js`, and the matched-file count must remain one.

</details>

<details>
<summary>Hint 3 — sequence the evidence</summary>

Keep the stale exit first. Regenerate from the source and rerun the same gate. For the new
description, change only the source purpose before repeating that sequence.

</details>

## Expected failures and recovery

| Symptom | Confirm | Recovery | Retry evidence |
| --- | --- | --- | --- |
| Guard rejects a root, remote, or symlink | Read the exact guard error; do not follow the unexpected path | Preserve this attempt; create a fresh one using the original course fixture | New guard exits 0 |
| npm needs authentication or a proxy | Keep only the error code and registry host | Stop this environment path; do not supply credentials or change global settings | Verified public-registry installation in a fresh permitted environment |
| Version differs | Explicit local version and `verify-pin` | Fresh reset with the exact fixture pin; do not use global CLI fallback | Both match 0.112.0 |
| Freshness says fresh but MAP is absent | `test -f .planning/codebase/MAP.md` fails | Run the guarded renderer; do not declare done from freshness alone | Renderer, freshness, and final result check pass |
| JSON cannot be parsed, source shape changed, or globs changed | Guard names the mismatch | Preserve evidence; undo only your editor change if its exact effect is known, or start fresh | Guard passes and purpose-only diff is visible |
| Whitespace check fails after a source edit | Retain `git diff --check` output and inspect the named line | Remove only the accidental trailing spaces/tabs from your edit; keep `.gitattributes` and Git settings unchanged. An EOL-only failure needs maintainer investigation, not a bypass | Guard, rerender after any source-byte change, freshness and original whitespace check all pass |
| MAP is stale after simulated edit or source edit | Released freshness exits 1 | Guard, render, rerun the same check | Freshness exits 0 |
| MAP remains stale immediately after rendering | Inspect source globs and compare the starting fixture | Preserve the failure and reset; never widen the glob to include the whole repository | Bounded `src/*.js` fixture has one file and freshness passes |
| Helper rejects unexpected staged/untracked files or other source changes | Read the printed status/diff | Preserve evidence and reset; do not force-stage or weaken the helper | Clean checkpoint or purpose-only final diff |

Expected stale exits are part of the exercise. Any other exit means the relevant checkpoint
has not passed. The helpers do not erase a broken attempt.

## Reset to start

The supported reset is a new directory; there is no in-place destructive reset.
Keep the original attempt and evidence unchanged, then run:

```sh
previous_lab_root="$lab_root"
lab_root="$(node "$fixture_dir/projection-lab.mjs" create)"
test "$lab_root" != "$previous_lab_root"
test -f "$previous_lab_root/../evidence.md"
cd "$lab_root"
node projection-lab.mjs guard
test ! -e .planning/codebase/MAP.md
git remote
```

Windows/PowerShell 7.4+:

```powershell
$PreviousLabRoot = $LabRoot
$LabRoot = (& node (Join-Path $FixtureDir 'projection-lab.mjs') create | Out-String).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Lab 5 reset fixture creation failed' }
if ($LabRoot -eq $PreviousLabRoot) { throw 'reset must create a distinct lab root' }
if (-not (Test-Path -LiteralPath (Join-Path (Split-Path -Parent $PreviousLabRoot) 'evidence.md') -PathType Leaf)) {
  throw 'previous evidence is missing'
}
Set-Location -LiteralPath $LabRoot
node projection-lab.mjs guard
if (Test-Path -LiteralPath '.planning/codebase/MAP.md') { throw 'fresh reset must not contain a MAP' }
git remote
```

This demonstrates reset without deleting evidence. Repeat install, checkpoint, and the
exercise in this new root if retrying an unmet outcome. If the first attempt already passed,
the new root and no-MAP check are sufficient reset evidence; archive this unused reset
attempt too. A fresh attempt does not inherit the earlier green output.

## Cleanup

No servers, ports, containers, or background processes are started. Cleanup archives the exact
attempt parent, including repository, npm cache, marker, and evidence; nothing is recursively
deleted. Archive only after recording useful evidence.

Archive from the course directory, passing the exact absolute attempt root. Both
the caller and helper must be outside the attempt parent when it moves. Windows
locks a process's current directory; archiving from inside it is not portable.
The helper repeats all target guards before the move and refuses an existing
destination. It does not change the caller's directory or delete any files.

After the reset demonstration, guard the new attempt, leave it, and archive it:

```sh
node projection-lab.mjs guard
cd "$course_root"
archived_reset="$(node "$fixture_dir/projection-lab.mjs" archive "$lab_root")"
test ! -e "$lab_root"
test -f "$archived_reset/repo/package.json"
```

Windows/PowerShell 7.4+:

```powershell
node projection-lab.mjs guard
Set-Location -LiteralPath $CourseRoot
$ArchivedReset = (& node (Join-Path $FixtureDir 'projection-lab.mjs') archive $LabRoot | Out-String).Trim()
if ($LASTEXITCODE -ne 0) { throw 'reset attempt archive failed' }
if (Test-Path -LiteralPath $LabRoot) { throw 'reset attempt still exists at its old path' }
if (-not (Test-Path -LiteralPath (Join-Path $ArchivedReset 'repo/package.json') -PathType Leaf)) {
  throw 'archived reset package is missing'
}
```

Then archive the earlier completed attempt:

```sh
cd "$previous_lab_root"
node projection-lab.mjs guard
cd "$course_root"
archived_completed="$(node "$fixture_dir/projection-lab.mjs" archive "$previous_lab_root")"
test ! -e "$previous_lab_root"
test -f "$archived_completed/evidence.md"
test -f "$archived_completed/repo/.planning/codebase/MAP.md"
```

Windows/PowerShell 7.4+:

```powershell
Set-Location -LiteralPath $PreviousLabRoot
node projection-lab.mjs guard
Set-Location -LiteralPath $CourseRoot
$ArchivedCompleted = (& node (Join-Path $FixtureDir 'projection-lab.mjs') archive $PreviousLabRoot | Out-String).Trim()
if ($LASTEXITCODE -ne 0) { throw 'completed attempt archive failed' }
if (Test-Path -LiteralPath $PreviousLabRoot) { throw 'completed attempt still exists at its old path' }
if (-not (Test-Path -LiteralPath (Join-Path $ArchivedCompleted 'evidence.md') -PathType Leaf)) {
  throw 'completed evidence is missing from the archive'
}
if (-not (Test-Path -LiteralPath (Join-Path $ArchivedCompleted 'repo/.planning/codebase/MAP.md') -PathType Leaf)) {
  throw 'completed MAP is missing from the archive'
}
$ErrorActionPreference = $Lab05OriginalErrorActionPreference
$PSNativeCommandUseErrorActionPreference = $Lab05OriginalNativePreference
```

Keep the printed/archive variable paths in your private completion note. The destination
is the OS temporary `3ci-directive-lab-archive` directory. Do not run the active-attempt
helper against archived files. If an old attempt's guard fails, leave it intact as
`retained for recovery` and state why; do not remove a remote or repair unknown paths.
If a move still fails, preserve its error and both paths' observed state. Do not
force the move or replace it with copy-and-delete; record the attempt as retained.

## Explained solution

After the suggested first attempt, compare with the [explained Lab 5 solution](../solutions/lab-05-projection-drift-recovery.md).
It explains both stale states, meaningful existence checks, alternatives, and reset.
No instructor unlock is needed.

## Done statement

Replace the bracketed values with the actual operating system and shell used for the
successful run.

> I completed lab-05-projection-drift-recovery against Directive 0.112.0 on [actual OS and
> version] using [actual shell and version]. Both expected stale states returned 1, and all five final acceptance
> commands returned 0. My evidence covers O5.1–O5.3. Reset created a new guarded repository
> and preserved prior evidence. Both attempt locations and their archive/retained states are
> recorded. No remote, credentials, or business repository was used.

State any unsupported clause as a gap. The course repository remains unchanged by lab work.

Sources: [Module 5](../curriculum/modules/05-sources-versus-projections.md),
[source baseline](../references/SOURCE-BASELINE.md), and the pinned
[command reference](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/commands.md)
under “Project And Architecture Commands.” The
[lab environment contract](README.md) defines the 3Ci safety policy.
