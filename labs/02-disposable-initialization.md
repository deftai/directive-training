# Lab 2 — Initialize a Disposable Directive Consumer

Install the course-pinned Directive release in a fictional, no-remote repository, initialize
it, inspect its anatomy, and preserve evidence without touching a business repository.

## Lab record

| Field | Value |
| --- | --- |
| Stable ID | `lab-02-disposable-initialization` |
| Supports | Module 2 outcomes O2.1, O2.2, O2.3, and O2.4 |
| Status | `learner-ready draft`; 0.119.5 path verified on macOS/zsh; Linux/bash and Windows/PowerShell are candidates pending native evidence |
| Last verified | 2026-09-21 |
| Directive baseline | fixture-local `@deftai/directive@0.119.5`, engine `@deftai/directive-core@0.119.5`; see the [source baseline](../references/SOURCE-BASELINE.md) |
| Estimated duration | 25–35 minutes |
| Fixture | [Fictional Northstar package](fixtures/02-disposable-initialization/package.json) driven by the [stateless lab helper](fixtures/02-disposable-initialization/init-lab.mjs) |

The guarded 0.119.5 path passed the local macOS/zsh baseline-upgrade suite. The earlier
Linux and Windows matrix is historical 0.112.0 evidence and does not promote those current
paths. These bounds do not prove pnpm, other images, or coding-host integration.

## Goal and done condition

You are done when the project-local CLI reports Directive 0.119.5; init, doctor, and the consumer toolchain check return the expected exits; the repository remains no-remote; `module_02_accept=PASS` re-reads those executable checks; the written chooser, anatomy, and five-field recovery rows match the explained solution and the evidence bundle; and cleanup archives the exact lab parent.

This demonstrates O2.1–O2.4 without creating application code, a remote, pull request, deployment, or published artifact.

## Fictional scenario

Northstar Route Checker is a fictional future JavaScript route-validation tool; this lab establishes only its disposable repository practice, using mock identity and no customer or route data.

## Environment and starting-state check

### Required environment

- Node.js 20 or newer; the verified local 0.119.5 run used 24.20.0.
- npm, Git, GitHub CLI, and either zsh, bash, or PowerShell 7.4 or newer.
- A local clone of this curriculum repository, used only to read the fixture and run
  the lab helper. The public `deftai/directive-training` checkout is a valid
  `DIRECTIVE_TRAINING_ROOT` for that purpose. Do not point `LAB_ROOT` at the curriculum
  checkout; `LAB_ROOT` is the printed disposable attempt.
- Access to the public npm registry for `@deftai/directive@0.119.5`. The normal
  path uses a project-local public-registry `.npmrc`; if organizational policy requires a
  different approved route, stop and use the recovery boundary instead.

First run:

```text
node --version
npm --version
git --version
gh --version
```

**Pass:** every command exits 0 and Node reports 20 or newer. If a command is missing, use
your organization's approved tool installation path before continuing.

### How this lab runs

Every command block below runs in its own shell. Nothing is carried between blocks: no shell
functions, no unexported variables, no live session. Each block re-derives the whole lab from
two values you supply and one course helper that re-reads its own state from disk.

| Value | What it is | Where it comes from |
| --- | --- | --- |
| `DIRECTIVE_TRAINING_ROOT` | Absolute path of your curriculum clone | You export it once, in a separate command |
| `LAB_ROOT` | The single absolute attempt root | Printed by the first block; you export it once, in a separate command |

The helper lives at `labs/fixtures/02-disposable-initialization/init-lab.mjs` inside the
curriculum clone. Its verbs are `create`, `guard`, `install`, `diagnose`, `accept`, `reset`,
`archive`, and `recovery-npmrc`. Every verb after `create` takes that one absolute root and
nothing else, so a coding-agent host that starts a fresh shell per block runs this lab
exactly as written.

This also means different things can go wrong, and the lab keeps them apart on purpose:

| Refusal text | What it means | What to do |
| --- | --- | --- |
| `Paste refusal: …` | A block could not find the helper because `DIRECTIVE_TRAINING_ROOT` is unset or wrong | Re-export the curriculum clone path and re-run the block |
| `lab-02: Usage refusal: …` | The helper ran but received no absolute root, or a relative one | Re-export `LAB_ROOT` with the path `create` printed and re-run the block |
| `lab-02: Runtime refusal: …` | A project-local binary is missing or not executable | Re-install into a fresh attempt; never accept a host-global binary instead |
| `lab-02: Stop: …` | A safety boundary failed: wrong root, a remote, a changed pin | Stop mutating. Preserve the attempt and use the recovery table |

Only `Stop:` is a boundary failure. A missing paste is never a boundary failure.

### macOS/zsh — verified locally; Linux/bash — candidate

In a separate command, export `DIRECTIVE_TRAINING_ROOT` with the absolute path of your
curriculum clone. The block below reads and validates that learner-supplied value; it
does not replace it with an authoring placeholder.

```sh
set -eu
helper=""
if test -n "${DIRECTIVE_TRAINING_ROOT:-}"; then
  helper="$DIRECTIVE_TRAINING_ROOT/labs/fixtures/02-disposable-initialization/init-lab.mjs"
fi
test -n "$helper" || { echo "Paste refusal: DIRECTIVE_TRAINING_ROOT must be set to the absolute curriculum clone path; this is a missing paste, not a boundary stop" >&2; exit 2; }
test -f "$helper" || { echo "Paste refusal: no helper file at $helper; this is a missing paste, not a boundary stop" >&2; exit 2; }
lab_root="$(node "$helper" create)"
printf 'lab_root=%s\n' "$lab_root"
echo "module_02_start=ready"
```

Now export that exact printed path, in a separate command, as `LAB_ROOT`. Every later block
reads it and nothing else.

```sh
set -eu
helper=""
if test -n "${DIRECTIVE_TRAINING_ROOT:-}"; then
  helper="$DIRECTIVE_TRAINING_ROOT/labs/fixtures/02-disposable-initialization/init-lab.mjs"
fi
test -n "$helper" || { echo "Paste refusal: DIRECTIVE_TRAINING_ROOT must be set to the absolute curriculum clone path; this is a missing paste, not a boundary stop" >&2; exit 2; }
test -f "$helper" || { echo "Paste refusal: no helper file at $helper; this is a missing paste, not a boundary stop" >&2; exit 2; }
lab_root="${LAB_ROOT:-}"
node "$helper" guard "$lab_root"
git -C "$lab_root" status --short
git -C "$lab_root" branch --show-current
```

Required starting status, in lexical order:

```text
?? .gitignore
?? .npmrc
?? package.json
```

No other path may appear. Continue only after `module_02_start=ready` and a clean guard.
`git branch --show-current` must print `training/module-02`.

The helper wrote the attempt's public-registry npm configuration for you. Read it once so you
know what the install is isolated to:

```text
registry=https://registry.npmjs.org/
audit=false
fund=false
ignore-scripts=true
```

The evidence note is `evidence.md` in the attempt's parent directory, beside the attempt and
outside its Git working tree. The marker file `lab-state.json` sits next to it and records the
attempt root and the fixture digest. It deliberately records no caller `PATH` and no npm user
configuration: nothing about the shell that created the attempt is replayed into a later one.

### Windows/PowerShell 7.4+ — candidate pending native evidence

Before pasting the block, set the process environment variable
`DIRECTIVE_TRAINING_ROOT` to the absolute path of your curriculum clone.
The block fails clearly if that learner input is absent.

```powershell
if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required' }
$Module02OriginalErrorActionPreference = $ErrorActionPreference
$Module02OriginalNativePreference = $PSNativeCommandUseErrorActionPreference
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
try {
  $Helper = ''
  if (-not [string]::IsNullOrWhiteSpace($env:DIRECTIVE_TRAINING_ROOT)) {
    $Helper = Join-Path $env:DIRECTIVE_TRAINING_ROOT 'labs/fixtures/02-disposable-initialization/init-lab.mjs'
  }
  if ([string]::IsNullOrWhiteSpace($Helper)) { throw 'Paste refusal: set DIRECTIVE_TRAINING_ROOT to the absolute curriculum clone path; this is a missing paste, not a boundary stop' }
  if (-not (Test-Path -LiteralPath $Helper -PathType Leaf)) { throw "Paste refusal: no helper file at $Helper; this is a missing paste, not a boundary stop" }
  $LabRoot = (& node $Helper create | Out-String).Trim()
  "lab_root=$LabRoot"
  "module_02_start=ready"
} finally {
  $ErrorActionPreference = $Module02OriginalErrorActionPreference
  $PSNativeCommandUseErrorActionPreference = $Module02OriginalNativePreference
}
```

Set `$env:LAB_ROOT` to the printed path in a separate command, then run
`node $Helper guard $env:LAB_ROOT` followed by `git -C $env:LAB_ROOT status --short`.
Required status:

```text
?? .gitignore
?? .npmrc
?? package.json
```

Continue only after PowerShell prints `module_02_start=ready`.
`git -C $env:LAB_ROOT branch --show-current` must print `training/module-02`.

## Safety boundary

- Work only in the exact `LAB_ROOT` the helper printed; never initialize, reset, clean, or implement in this curriculum or a business repository.
- Keep `git remote` empty; do not push, open a pull request, deploy, release, publish, or call production.
- Do not put tokens, credentials, environment dumps, client data, proprietary code, production logs, or confidential issues in commands or evidence.
- Mutations are limited to the exact temporary parent, its Git metadata, fixture files, dependency state, Directive integration/runtime state, and adjacent evidence lists.
- Stop if the helper prints `Stop:` — the root guard failed, a remote appeared, the pin differs from 0.119.5, or a command requested unexpected credentials or external action.
- A `Paste refusal:` or `Usage refusal:` is not a boundary stop. The helper inspected nothing and mutated nothing; re-export the missing value and re-run the same block unchanged.

## Starting checkpoint

This checkpoint proves the local executable, help surfaces, initialization,
ignore rules, and inspected staging allowlist before committing the fictional
start; it never uses `git add --all`. The normal install uses the tracked
public-registry `.npmrc`, a lab-local cache, and a child environment without
inherited `NPM_CONFIG_*` values. The provided E401 exercise remains a written
decision drill; do not weaken this isolation to manufacture it.

### macOS/zsh or Linux/bash

```sh
set -eu
helper=""
if test -n "${DIRECTIVE_TRAINING_ROOT:-}"; then
  helper="$DIRECTIVE_TRAINING_ROOT/labs/fixtures/02-disposable-initialization/init-lab.mjs"
fi
test -n "$helper" || { echo "Paste refusal: DIRECTIVE_TRAINING_ROOT must be set to the absolute curriculum clone path; this is a missing paste, not a boundary stop" >&2; exit 2; }
test -f "$helper" || { echo "Paste refusal: no helper file at $helper; this is a missing paste, not a boundary stop" >&2; exit 2; }
lab_root="${LAB_ROOT:-}"
node "$helper" guard "$lab_root"
node "$helper" install "$lab_root"
test -x "$lab_root/node_modules/.bin/directive" || { echo "project-local Directive CLI is missing" >&2; exit 2; }
test -x "$lab_root/node_modules/.bin/deft" || { echo "project-local Deft hook runtime is missing" >&2; exit 2; }
"$lab_root/node_modules/.bin/directive" --version
git -C "$lab_root" log -1 --format=%s
node "$helper" guard "$lab_root"
```

**Pass:** `install` prints `module_02_install=ready` with the checkpoint commit, both explicit
project-local launchers exist and are executable, the version line contains
`@deftai/directive-core@0.119.5`, and the checkpoint subject is exact. The two `test -x`
checks are the learner-visible O2.2 proof: `$lab_root/node_modules/.bin/directive` and
`$lab_root/node_modules/.bin/deft` are the exact paths that must answer, never a host-global
`directive` or `deft` found on `PATH`.

### Windows/PowerShell 7.4+

```powershell
if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required' }
$Module02OriginalErrorActionPreference = $ErrorActionPreference
$Module02OriginalNativePreference = $PSNativeCommandUseErrorActionPreference
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
try {
  $Helper = ''
  if (-not [string]::IsNullOrWhiteSpace($env:DIRECTIVE_TRAINING_ROOT)) {
    $Helper = Join-Path $env:DIRECTIVE_TRAINING_ROOT 'labs/fixtures/02-disposable-initialization/init-lab.mjs'
  }
  if ([string]::IsNullOrWhiteSpace($Helper)) { throw 'Paste refusal: set DIRECTIVE_TRAINING_ROOT to the absolute curriculum clone path; this is a missing paste, not a boundary stop' }
  if (-not (Test-Path -LiteralPath $Helper -PathType Leaf)) { throw "Paste refusal: no helper file at $Helper; this is a missing paste, not a boundary stop" }
  & node $Helper guard $env:LAB_ROOT
  & node $Helper install $env:LAB_ROOT
  $DirectivePath = Join-Path $env:LAB_ROOT 'node_modules/.bin/directive.cmd'
  $DeftPath = Join-Path $env:LAB_ROOT 'node_modules/.bin/deft.cmd'
  if (-not (Test-Path -LiteralPath $DirectivePath -PathType Leaf)) { throw 'project-local Directive CLI is missing' }
  if (-not (Test-Path -LiteralPath $DeftPath -PathType Leaf)) { throw 'project-local Deft hook runtime is missing' }
  & $DirectivePath --version
  & git -C $env:LAB_ROOT log -1 --format=%s
  & node $Helper guard $env:LAB_ROOT
} finally {
  $ErrorActionPreference = $Module02OriginalErrorActionPreference
  $PSNativeCommandUseErrorActionPreference = $Module02OriginalNativePreference
}
```

### What `install` runs for you

The helper is not hiding the lesson; it runs these exact commands, one fresh child process
each, so read them as the taught route. This is quoted evidence, not a step to type:

```text
npm install --userconfig <root>/.npmrc --globalconfig /dev/null --cache <root>/.npm-cache --ignore-scripts --no-audit --no-fund
directive --version
directive --help
directive commands
directive init --help
directive update --help
directive doctor --help
directive toolchain:check --help
directive init --yes --repo-root .
git check-ignore -q -- <each ignored probe path>
git diff --cached --name-only
git ls-files --others --exclude-standard
git add --pathspec-from-file=<parent>/trackable-files.txt
git ls-files --error-unmatch -- <each required tracked path>
git commit -m 'checkpoint: initialize fictional Directive consumer'
```

Every child runs under `env -i PATH="$PATH" HOME="$HOME"`, so an nvm-class `node` and `npm`
stay reachable while host variables such as `DEFT_HOOKS_PREFER_GLOBAL` and inherited
`NPM_CONFIG_*` credentials cannot cross into the lab. The npm child keeps the lab's own
`--userconfig` / `--globalconfig` / `--cache` isolation on top of that base. The commit child
additionally puts `<root>/node_modules/.bin` first on that `PATH` so the installed pre-commit
hook reaches this attempt's `deft` — and the helper refuses before the spawn when that local
`deft` is absent or not executable, rather than falling through to a global one.

If the staging allowlist rejects a path, preserve the attempt and compare that path with the
pinned source notes; do not widen the list, and continue only after
`module_02_install=ready`.

Checkpoint name: `checkpoint: initialize fictional Directive consumer`.

Checkpoint evidence: `git log -1 --format=%s` prints `checkpoint: initialize fictional Directive consumer`, the branch is `training/module-02`, the staged-plus-untracked list contains only accepted paths, and `git remote` remains empty.

## Tasks

### Task 1 — Explain the command choice

**Produce:** at `evidence.md` beside the attempt, write one sentence
explaining why this repository used `init`, one state that would instead select `update`,
and one state that would first select `doctor`. Add one consumer command surface and one
framework-maintainer-only surface, then state which repository each belongs to.

**Constraints:** cite observed footprint or health state. Do not use “because the lab said
so” as the reason.

**Checkpoint:** `git log -1 --format=%s` prints the named checkpoint, your note accounts
for all three commands, and the consumer/maintainer repository boundary is explicit.

**Keep as evidence:** the three state-to-command decisions and repository-boundary answer (O2.1).

### Task 2 — Diagnose the initialized consumer

**Produce:** a short result record containing the command, exit code, relevant output, each
doctor finding's severity, and the one recommended next action.

On macOS/Linux:

```sh
set -eu
helper=""
if test -n "${DIRECTIVE_TRAINING_ROOT:-}"; then
  helper="$DIRECTIVE_TRAINING_ROOT/labs/fixtures/02-disposable-initialization/init-lab.mjs"
fi
test -n "$helper" || { echo "Paste refusal: DIRECTIVE_TRAINING_ROOT must be set to the absolute curriculum clone path; this is a missing paste, not a boundary stop" >&2; exit 2; }
test -f "$helper" || { echo "Paste refusal: no helper file at $helper; this is a missing paste, not a boundary stop" >&2; exit 2; }
lab_root="${LAB_ROOT:-}"
node "$helper" diagnose "$lab_root"
```

On Windows/PowerShell 7.4+:

```powershell
if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required' }
$Module02OriginalErrorActionPreference = $ErrorActionPreference
$Module02OriginalNativePreference = $PSNativeCommandUseErrorActionPreference
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
try {
  $Helper = ''
  if (-not [string]::IsNullOrWhiteSpace($env:DIRECTIVE_TRAINING_ROOT)) {
    $Helper = Join-Path $env:DIRECTIVE_TRAINING_ROOT 'labs/fixtures/02-disposable-initialization/init-lab.mjs'
  }
  if ([string]::IsNullOrWhiteSpace($Helper)) { throw 'Paste refusal: set DIRECTIVE_TRAINING_ROOT to the absolute curriculum clone path; this is a missing paste, not a boundary stop' }
  if (-not (Test-Path -LiteralPath $Helper -PathType Leaf)) { throw "Paste refusal: no helper file at $Helper; this is a missing paste, not a boundary stop" }
  & node $Helper diagnose $env:LAB_ROOT
} finally {
  $ErrorActionPreference = $Module02OriginalErrorActionPreference
  $PSNativeCommandUseErrorActionPreference = $Module02OriginalNativePreference
}
```

`diagnose` runs these two commands and writes their captured output beside the attempt as
`doctor-full.txt` and `toolchain-consumer.txt`:

```text
directive doctor --full --project-root .
directive toolchain:check --consumer --project-root .
```

**Checkpoint:** the helper prints `doctor_exit=0 toolchain_exit=0`. Warnings may remain; record
them exactly enough to identify the classification and recommendation, without copying
unrelated environment data. Read them from the printed `doctor_report` path.

The healthy doctor banner also prints these two lines as expected output, not as classified
warnings:

```text
Pre-cutover: none -- project is on the current vBRIEF document model.
xBrief migration: none -- xbrief active, vbrief removed.
```

This banner's "vBRIEF" names post-pre-cutover document-model state. Learner-facing files stay
xBRIEF 0.8, and new course writes stay `xbrief/` schema 0.8.

The pin-matched 0.119.5 replay prints one named warning, the provenance check
`canonical-vendored-npm-signpost`:

```text
⚠ canonical-vendored-npm-signpost: Canonical-vendored install (.deft/core/) is not yet
npm-managed. Post-freeze upgrades run via npm: install the engine with
`npm i -g @deftai/directive@latest`, then run `directive migrate` to stamp provenance.
```

Its single recommended next action is a host-global engine install followed by a provenance
migration. The block below is quoted evidence, not a step — do not run it:

```text
npm i -g @deftai/directive@latest
directive migrate
```

**Boundary verdict:** outside this lab, on two counts. `npm i -g` mutates host-global state
outside the disposable temporary parent, and `@latest` would move the install off the 0.119.5
course pin. Record the check id, the message, the recommended action, and this verdict; then
refuse the action and continue.

Record what your own run printed, not what this page predicts. Diagnostic severity does not
follow from a warning count, so do not use one as your pass condition, and do not copy a
warning your run did not produce.

**Keep as evidence:** version, both exits, toolchain pass, doctor classifications, and empty remote (O2.2, O2.4).

### Task 3 — Classify the repository anatomy

**Produce:** at `evidence.md` beside the attempt, write a four-column
table: `path`, `tracked/ignored/external`,
`owner`, and `anatomy class`.

Inspect at least these paths:

```text
package.json
.npmrc
AGENTS.md project header
AGENTS.md managed section
.deft/GENERATION.json
.deft/core/
.deft-cache/
.npm-cache/
xbrief/ or its schemas if present
USER.md (conceptual external row; do not resolve or copy it in this lab)
```

Use these safe inspections, each run with `git -C "$lab_root"`:

```text
git ls-files
git status --short --ignored
git check-ignore -v -- .deft/core/VERSION
git check-ignore -v -- .deft/.cli/example
git check-ignore -v -- .deft-cache/example
git check-ignore -v -- .deft/ritual-state.json
git check-ignore -v -- xbrief/.triage-cache/candidates.jsonl
git check-ignore -v -- .npm-cache/example
git check-ignore -v -- USER.md
```

Each of the seven `git check-ignore -v` commands must exit 0 and print the matching ignore
source, pattern, and exact path. A missing line is failed evidence; do not substitute a
different path without first reconciling it with the pinned baseline.

**Checkpoint:** your table includes at least two authoritative or anchor examples, two tracked
managed examples, two ignored runtime examples, and two ignored reconstitutable examples. It
also includes a conceptual external `USER.md` row based on the project rule—not its location
or contents—and separate rows for the two ownership regions of `AGENTS.md`. This
demonstrates O2.3.

**Keep as evidence:** only the table and narrow supporting Git output; never copy shared `USER.md` contents.

### Task 4 — Trace the provided recovery case

This is a deterministic decision drill. Do not manufacture an authentication failure, change
global npm configuration, or create a failed repository for this scenario.

| Provided fact | Fictional observation |
| --- | --- |
| Attempt | Fictional `attempt-failed.northstar` under the recorded guarded temporary parent |
| Command | `npm install --ignore-scripts --no-audit --no-fund` |
| Result | Exit 1 with `E401` from `registry.northstar.invalid` |
| Refusal class | A `Stop:` from inside the install. The helper received a valid absolute root and ran, so this is not a `Paste refusal` or a `Usage refusal`, and re-exporting a value would change nothing |
| Boundary | The root guard passed and `git remote` printed nothing |
| Sensitive data | No token, npm configuration contents, or environment dump was captured |

**Produce:** add a recovery decision to the evidence note with these five fields:

1. the exact attempt path and narrow failure evidence to preserve;
2. the likely mechanism: registry authentication or configuration, not proof of a Directive
   lifecycle defect;
3. the required support boundary: use only the organization's approved npm setup;
4. the next safe mutation: leave the attempt intact, create a new unique attempt under the
   guarded parent, and re-run the root and no-remote guards before installation; and
5. the retry gate: the explicit project-local binary exists, reports Directive core 0.119.5,
   install exits 0, and `git remote` remains empty.

**Checkpoint:** all five fields follow from the provided facts, no credential handling is
invented, and no broad cleanup or global configuration edit is proposed. Compare the record
with the explained solution. This demonstrates O2.4 even when the live setup succeeds on its
first attempt.

**Keep as evidence:** the provided facts and five-field decision, not a forced failure or fabricated retry.

## Checkpoints

The starting checkpoint, task checkpoints, literal acceptance table, and archive verification form the lab checkpoints. On failure, preserve the attempt and use the matching recovery; retry only the unmet outcome in a fresh guarded attempt without broadening staging, weakening a check, or forcing a live failure.

## Literal acceptance commands

Run this block in any shell. It needs only the curriculum clone path and the one printed
attempt root; no earlier block's shell state has to still exist.

### macOS and Linux

```sh
set -eu
helper=""
if test -n "${DIRECTIVE_TRAINING_ROOT:-}"; then
  helper="$DIRECTIVE_TRAINING_ROOT/labs/fixtures/02-disposable-initialization/init-lab.mjs"
fi
test -n "$helper" || { echo "Paste refusal: DIRECTIVE_TRAINING_ROOT must be set to the absolute curriculum clone path; this is a missing paste, not a boundary stop" >&2; exit 2; }
test -f "$helper" || { echo "Paste refusal: no helper file at $helper; this is a missing paste, not a boundary stop" >&2; exit 2; }
lab_root="${LAB_ROOT:-}"
node "$helper" accept "$lab_root"
```

### Windows PowerShell 7.4+

```powershell
if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required' }
$Module02OriginalErrorActionPreference = $ErrorActionPreference
$Module02OriginalNativePreference = $PSNativeCommandUseErrorActionPreference
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
try {
  $Helper = ''
  if (-not [string]::IsNullOrWhiteSpace($env:DIRECTIVE_TRAINING_ROOT)) {
    $Helper = Join-Path $env:DIRECTIVE_TRAINING_ROOT 'labs/fixtures/02-disposable-initialization/init-lab.mjs'
  }
  if ([string]::IsNullOrWhiteSpace($Helper)) { throw 'Paste refusal: set DIRECTIVE_TRAINING_ROOT to the absolute curriculum clone path; this is a missing paste, not a boundary stop' }
  if (-not (Test-Path -LiteralPath $Helper -PathType Leaf)) { throw "Paste refusal: no helper file at $Helper; this is a missing paste, not a boundary stop" }
  & node $Helper accept $env:LAB_ROOT
} finally {
  $ErrorActionPreference = $Module02OriginalErrorActionPreference
  $PSNativeCommandUseErrorActionPreference = $Module02OriginalNativePreference
}
```

`accept` prints `module_02_accept=PASS` only after every row below holds. It re-reads the
attempt from disk and runs these exact checks:

```text
directive --version
directive doctor --full --project-root .
directive toolchain:check --consumer --project-root .
git diff --quiet
git diff --cached --quiet
git status --porcelain --untracked-files=all
git check-ignore -q -- .deft/core/VERSION
git branch --show-current
git remote
```

| Validation | Required exit/result | Observable signal | Outcomes |
| --- | --- | --- | --- |
| Exact local version | 0 | Contains `@deftai/directive-core@0.119.5` | O2.2 |
| Full doctor | 0 | Health summary plus any classified warnings and one recommendation | O2.4 |
| Consumer toolchain check | 0 | `All required tools available` | O2.2, O2.4 |
| Git boundary checks | 0 | Clean tracked index, `.deft/core` ignored, no remote names | O2.2, O2.3 |
| Project-local runtime election | 0 | `deft` resolves inside `$lab_root/node_modules/.bin`, never host-global | O2.2 |

`module_02_accept=PASS` is that executable re-read only. Score the written chooser,
mixed-ownership anatomy table, and five-field recovery decision by comparing your
`evidence.md` with the [explained Lab 2 solution](../solutions/lab-02-disposable-initialization.md)
and the evidence bundle, using Module 2's inspection path for O2.1, O2.3, and O2.4.

If a required command differs, retain its command, exit, and relevant output; do not substitute a global CLI, omit a warning, or weaken a check.

## Evidence bundle

Keep the smallest bundle that proves the outcomes:

- stable ID, attempt date, operating system, shell, Node/npm versions, and Directive baseline;
- exact `LAB_ROOT`, outside-repository evidence-note path, checkpoint commit,
  and final archive path;
- command chooser with reasons (O2.1);
- local version, init, doctor, toolchain, and no-remote results with exit codes (O2.2/O2.4);
- pre-stage and staged path lists plus the anatomy table (O2.3);
- five-field recovery decision for the provided fictional failure (O2.4);
- reset and archive results.

Do not include tokens, npm configuration contents, Git credential output, full environment
dumps, client data, proprietary source, or unrelated logs. Keep the bundle local unless a
separate authorized 3Ci process names a destination.

## Progressive hints

Spend at least 10 minutes on the lab before opening a hint. Open one level at a time.

### Hint 1 — model

Command selection follows observed state: absent footprint → init; recognizable existing
footprint → update; ambiguous/unhealthy state → doctor. Artifact classification needs both
Git status and ownership.

### Hint 2 — inspection

Prove the executable with the explicit path, not `PATH` lookup. Use `git ls-files` for tracked
paths and `git check-ignore -v` for ignored paths. Split `AGENTS.md` at the marked managed
section.

### Hint 3 — partial route

The successful order is: `create` → export `LAB_ROOT` → `guard` → `install` (which installs
the exact pin, proves the local CLI, verifies help, initializes, proves ignored paths,
inspects allowed files, stages the exact file list, and commits) → `diagnose` → classify →
write the chooser, anatomy table, and five-field recovery decision → `accept` (executable
re-read) → `archive`. Compare the written rows with the explained solution and the evidence
bundle; helper PASS does not attest them.

After Hint 3, use the recovery table or the explained solution. No instructor unlock is
required.

## Expected failures and recovery

| Symptom | Confirm the cause | Recovery | Evidence after retry |
| --- | --- | --- | --- |
| `npm install` returns `E401`/`E403` | Record the status and registry host only; do not print config or tokens | Preserve the attempt. Restore the organization-approved registry/auth setup, then start a fresh attempt. If an approved public-registry route exists, use a fresh temporary npm config rather than editing global state. | Local binary exists and reports 0.119.5 |
| Local binary is missing but another `directive` runs | Test the exact `node_modules/.bin` path | Do not accept the global result. Correct the install in a fresh attempt and use the explicit path. | Exact local path and version both pass |
| Init reports `brownfield-install` | Confirm `.git` exists | Continue. This is expected released behavior for the lab's Git-first safety path. | Init exits 0 and managed integration appears |
| Checkpoint commit is refused on `main` | Run `git branch --show-current`; the branch gate protects the default branch | Preserve the gate. Create a fresh attempt so the helper switches the unborn repository to `training/module-02`, then re-run `install`. | Commit succeeds on `training/module-02` |
| Checkpoint commit prints `warning: LF will be replaced by CRLF` | Confirm the host uses `core.autocrlf=true`, then check the commit exit code and `git log -1 --format=%s` | Treat the line-ending notice as an expected warning, not a failed checkpoint. Do not change global Git configuration or bypass the hook. | Exit code is 0, the checkpoint subject is exact, and tracked status is clean |
| Toolchain help exits 2 | Inspect `toolchain-help.txt` beside the attempt for the known unrecognized argument | Record the 0.119.5 defect; verify registration with `commands`, then run the tested consumer form. | Consumer toolchain command exits 0 |
| Doctor exits 0 with warnings | Record severity and recommended action | Treat the result as evidence and classify the recommendation. Do not execute migration or another untaught recovery in this module. Use Task 4's provided failure for the required recovery decision. | Exit and warnings are both represented accurately |
| Init prints generic push, PR, or merge next steps | The installer is describing an ordinary repository lifecycle, not granting this lab remote authority | Do not follow those steps. Re-run `guard` and continue only with the local lab. | `git remote` remains empty |
| Allowlist rejects a path | Read the exact path and compare with the pinned baseline | Stop. Preserve the attempt and verify version/source drift before amending any allowlist. | A fresh attempt contains only expected paths |
| A block prints `Paste refusal:` or `lab-02: Usage refusal:` | Read which value is missing: the curriculum clone path, or the one printed attempt root | Nothing was inspected and nothing was mutated, so this is not a root-guard failure. Re-export `DIRECTIVE_TRAINING_ROOT` or `LAB_ROOT` and re-run the same block unchanged. | The same block prints its normal result |
| A block prints `lab-02: Runtime refusal:` | Test the exact `node_modules/.bin` path named in the message | Do not put a host-global binary on `PATH` to satisfy it. Re-install into a fresh attempt. | The named local launcher exists and is executable |
| A block prints `lab-02: Stop:` for the root guard or the no-remote check | Print only the canonical lab path and remote names | Stop every mutation. Preserve the directory; start from a new temporary parent with `create`. | Guard and empty-remote checks pass before retry |

Recoveries replace the attempt unless explicitly marked “continue”; none depends on an instructor or hidden file.

If your organization confirms that the public npm registry is an approved recovery route,
isolate that route in the fresh attempt without editing global npm state:

```sh
set -eu
helper=""
if test -n "${DIRECTIVE_TRAINING_ROOT:-}"; then
  helper="$DIRECTIVE_TRAINING_ROOT/labs/fixtures/02-disposable-initialization/init-lab.mjs"
fi
test -n "$helper" || { echo "Paste refusal: DIRECTIVE_TRAINING_ROOT must be set to the absolute curriculum clone path; this is a missing paste, not a boundary stop" >&2; exit 2; }
test -f "$helper" || { echo "Paste refusal: no helper file at $helper; this is a missing paste, not a boundary stop" >&2; exit 2; }
lab_root="${LAB_ROOT:-}"
node "$helper" recovery-npmrc "$lab_root"
```

On PowerShell 7.4+, use:

```powershell
if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required' }
$Module02OriginalErrorActionPreference = $ErrorActionPreference
$Module02OriginalNativePreference = $PSNativeCommandUseErrorActionPreference
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
try {
  $Helper = Join-Path $env:DIRECTIVE_TRAINING_ROOT 'labs/fixtures/02-disposable-initialization/init-lab.mjs'
  if (-not (Test-Path -LiteralPath $Helper -PathType Leaf)) { throw "Paste refusal: no helper file at $Helper; this is a missing paste, not a boundary stop" }
  & node $Helper recovery-npmrc $env:LAB_ROOT
} finally {
  $ErrorActionPreference = $Module02OriginalErrorActionPreference
  $PSNativeCommandUseErrorActionPreference = $Module02OriginalNativePreference
}
```

The helper derives the probe file's parent from the printed root, writes an empty npm user
configuration there, and runs `npm config get registry` against it. The printed registry host
must match the route your organization approved. Do not record npm configuration contents or
credentials.

## Reset to start

If a live command fails, this lab uses a fresh-directory reset only. Task 4 satisfies the
required recovery outcome without forcing a live failure. Do not run `git reset --hard`,
`git clean`, or a recursive deletion.

1. Record the failed `LAB_ROOT`, command, exit, and relevant output.
2. Leave the failed attempt in place.
3. From the same guarded temporary parent, create the next attempt.
4. Export the newly printed root as `LAB_ROOT`.
5. Re-run `guard` before the first mutation.

```sh
set -eu
helper=""
if test -n "${DIRECTIVE_TRAINING_ROOT:-}"; then
  helper="$DIRECTIVE_TRAINING_ROOT/labs/fixtures/02-disposable-initialization/init-lab.mjs"
fi
test -n "$helper" || { echo "Paste refusal: DIRECTIVE_TRAINING_ROOT must be set to the absolute curriculum clone path; this is a missing paste, not a boundary stop" >&2; exit 2; }
test -f "$helper" || { echo "Paste refusal: no helper file at $helper; this is a missing paste, not a boundary stop" >&2; exit 2; }
lab_root="${LAB_ROOT:-}"
next_root="$(node "$helper" reset "$lab_root")"
printf 'lab_root=%s\n' "$next_root"
node "$helper" guard "$next_root"
```

On Windows/PowerShell 7.4+:

```powershell
if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required' }
$Module02OriginalErrorActionPreference = $ErrorActionPreference
$Module02OriginalNativePreference = $PSNativeCommandUseErrorActionPreference
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
try {
  $Helper = Join-Path $env:DIRECTIVE_TRAINING_ROOT 'labs/fixtures/02-disposable-initialization/init-lab.mjs'
  if (-not (Test-Path -LiteralPath $Helper -PathType Leaf)) { throw "Paste refusal: no helper file at $Helper; this is a missing paste, not a boundary stop" }
  $NextRoot = (& node $Helper reset $env:LAB_ROOT | Out-String).Trim()
  "lab_root=$NextRoot"
  & node $Helper guard $NextRoot
} finally {
  $ErrorActionPreference = $Module02OriginalErrorActionPreference
  $PSNativeCommandUseErrorActionPreference = $Module02OriginalNativePreference
}
```

Then repeat the lab from the starting checkpoint against the new root. The failed attempt
remains available for comparison, and `archive` verifies every attempt in the parent.

## Cleanup

Cleanup is recoverable: move the exact lab parent into a new operating-system temporary
archive. Do not delete it. This lab starts no process, container, listener, or remote service.
Nothing has to be restored in your shell, because no block ever changed your `PATH` or your
npm user configuration.
Each PowerShell block restores the two error-action preferences it sets in its own
`finally`, so an interactive session is left exactly as it was found.

### macOS or Linux

```sh
set -eu
helper=""
if test -n "${DIRECTIVE_TRAINING_ROOT:-}"; then
  helper="$DIRECTIVE_TRAINING_ROOT/labs/fixtures/02-disposable-initialization/init-lab.mjs"
fi
test -n "$helper" || { echo "Paste refusal: DIRECTIVE_TRAINING_ROOT must be set to the absolute curriculum clone path; this is a missing paste, not a boundary stop" >&2; exit 2; }
test -f "$helper" || { echo "Paste refusal: no helper file at $helper; this is a missing paste, not a boundary stop" >&2; exit 2; }
lab_root="${LAB_ROOT:-}"
node "$helper" archive "$lab_root"
```

### Windows PowerShell 7.4+

```powershell
if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required' }
$Module02OriginalErrorActionPreference = $ErrorActionPreference
$Module02OriginalNativePreference = $PSNativeCommandUseErrorActionPreference
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
try {
  $Helper = Join-Path $env:DIRECTIVE_TRAINING_ROOT 'labs/fixtures/02-disposable-initialization/init-lab.mjs'
  if (-not (Test-Path -LiteralPath $Helper -PathType Leaf)) { throw "Paste refusal: no helper file at $Helper; this is a missing paste, not a boundary stop" }
  & node $Helper archive $env:LAB_ROOT
} finally {
  $ErrorActionPreference = $Module02OriginalErrorActionPreference
  $PSNativeCommandUseErrorActionPreference = $Module02OriginalNativePreference
}
```

`archive` refuses to run while your shell is inside the attempt parent, then moves the parent,
confirms the archived evidence note, and verifies that every archived `attempt-*` repository
still has its own Git root and no remote.

Expected cleanup state: the original lab parent path no longer exists because it was moved;
the printed archive path exists; each attempted repository has no remote; and this training
repository and all business repositories are unchanged. Retain or remove the
archive later only through your normal local-data policy.

## Explained solution

After a good-faith first attempt, compare your route and evidence with the
[explained solution](../solutions/lab-02-disposable-initialization.md). It covers the known
0.119.5 warnings, provided authentication-failure decision drill, global-fallback hazard, and
valid alternate evidence. The solution is immediately available; no instructor or bot is
required.

## Done statement

Fill this in only after acceptance and cleanup:

> I completed `lab-02-disposable-initialization` against Directive 0.119.5 on my recorded
> operating system and shell. The explicit local version, doctor, consumer toolchain, and Git
> boundary checks passed as `module_02_accept=PASS`. The written chooser, anatomy, and
> five-field recovery rows match the explained solution and the evidence bundle and cover
> O2.1–O2.4. The exact disposable parent is archived at my recorded temporary archive path.
> Every attempt has no remote and contains no credential or sensitive data. Every block ran
> in its own shell against the one printed attempt root.

If any sentence is false, record the gap and retry only the corresponding outcome.
