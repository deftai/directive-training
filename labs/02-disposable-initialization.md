# Lab 2 — Initialize a Disposable Directive Consumer

Install the course-pinned Directive release in a fictional, no-remote repository, initialize
it, inspect its anatomy, and preserve evidence without touching a business repository.

## Lab record

| Field | Value |
| --- | --- |
| Stable ID | `lab-02-disposable-initialization` |
| Supports | Module 2 outcomes O2.1, O2.2, O2.3, and O2.4 |
| Status | `learner-ready draft`; 0.119.5 path verified on macOS/zsh; Linux/bash and Windows/PowerShell are candidates pending native evidence |
| Last verified | 2026-09-20 |
| Directive baseline | `@deftai/directive@0.119.5`, engine `@deftai/directive-core@0.119.5`; see the [source baseline](../references/SOURCE-BASELINE.md) |
| Estimated duration | 25–35 minutes |
| Fixture | [Fictional Northstar package](fixtures/02-disposable-initialization/package.json) |

The guarded 0.119.5 path passed the local macOS/zsh baseline-upgrade suite. The earlier
Linux and Windows matrix is historical 0.112.0 evidence and does not promote those current
paths. These bounds do not prove pnpm, other images, or coding-host integration.

## Goal and done condition

You are done when the project-local CLI reports Directive 0.119.5; init, doctor, and the consumer toolchain check return the expected exits; the repository remains no-remote; the anatomy and five-field recovery evidence pass; and cleanup archives the exact lab parent and restores its temporary CLI/npm shell state.

This demonstrates O2.1–O2.4 without creating application code, a remote, pull request, deployment, or published artifact.

## Fictional scenario

Northstar Route Checker is a fictional future JavaScript route-validation tool; this lab establishes only its disposable repository practice, using mock identity and no customer or route data.

## Environment and starting-state check

### Required environment

- Node.js 20 or newer; the verified local 0.119.5 run used 24.20.0.
- npm, Git, GitHub CLI, and either zsh, bash, or PowerShell 7.4 or newer.
- A local clone of this private curriculum repository, used only to read the fixture.
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

### macOS/zsh — verified locally; Linux/bash — candidate

Start in a neutral terminal directory. In a separate command, export
`DIRECTIVE_TRAINING_ROOT` with the absolute path of your private curriculum
clone. The block below reads and validates that learner-supplied value; it does
not replace it with an authoring placeholder.

```sh
module_02_original_path="$PATH"
if test "${NPM_CONFIG_USERCONFIG+x}" = x; then
  module_02_had_npm_userconfig=1
  module_02_original_npm_userconfig="$NPM_CONFIG_USERCONFIG"
else
  module_02_had_npm_userconfig=0
  module_02_original_npm_userconfig=""
fi

module_02_start() {
  test -n "${DIRECTIVE_TRAINING_ROOT:-}" || {
    echo "DIRECTIVE_TRAINING_ROOT must be set to the absolute curriculum clone path" >&2
    return 2
  }
  training_root="$(cd "$DIRECTIVE_TRAINING_ROOT" && pwd -P)" || {
    echo "could not resolve the curriculum clone" >&2
    return 2
  }
  fixture="$training_root/labs/fixtures/02-disposable-initialization/package.json"
  test -f "$fixture" || { echo "fixture not found: $fixture" >&2; return 2; }

  temp_root="$(cd "${TMPDIR:-/tmp}" && pwd -P)" || return 2
  lab_parent="$(mktemp -d "$temp_root/3ci-directive-module-02.XXXXXX")" || return 2
  lab_parent="$(cd "$lab_parent" && pwd -P)" || return 2
  case "$lab_parent" in
    "$temp_root"/3ci-directive-module-02.*) ;;
    *) echo "unsafe lab parent: $lab_parent" >&2; return 2 ;;
  esac

  ancestor="$lab_parent"
  while :
  do
    if test -e "$ancestor/.git"; then
      echo "temporary parent is inside another Git repository" >&2
      return 2
    fi
    test "$ancestor" = / && break
    ancestor="$(dirname "$ancestor")" || return 2
  done

  lab_root="$(mktemp -d "$lab_parent/attempt-01.XXXXXX")" || return 2
  lab_root="$(cd "$lab_root" && pwd -P)" || return 2
  evidence_note="$lab_parent/evidence.md"
  : >"$evidence_note" || return 2

  assert_lab_root() {
    current_root="$(pwd -P)" || return 2
    test "$current_root" = "$lab_root" || {
      echo "working directory differs from recorded lab root" >&2
      return 2
    }
    case "$lab_root" in
      "$lab_parent"/attempt-*) ;;
      *) echo "unsafe lab root: $lab_root" >&2; return 2 ;;
    esac
    case "$lab_root" in
      "$training_root"|"$training_root"/*)
        echo "lab is inside the curriculum clone" >&2
        return 2
        ;;
    esac
  }

  assert_no_remote() {
    assert_lab_root || return 2
    test -e .git || { echo ".git is missing" >&2; return 2; }
    git_root="$(git rev-parse --show-toplevel)" || return 2
    git_root="$(cd "$git_root" && pwd -P)" || return 2
    test "$git_root" = "$lab_root" || {
      echo "Git root differs from recorded lab root" >&2
      return 2
    }
    remote_output="$(git remote)" || return 2
    test -z "$remote_output" || {
      echo "the disposable repository has a Git remote" >&2
      return 2
    }
  }

  cd "$lab_root" || return 2
  assert_lab_root || return 2
  git init --initial-branch=main || return 2
  git switch -c training/module-02 || return 2
  assert_no_remote || return 2
  cp "$fixture" package.json || return 2
  printf 'node_modules/\n/.npm-cache/\n/USER.md\n/.deft/USER.md\n' > .gitignore || return 2
  printf 'registry=https://registry.npmjs.org/\naudit=false\nfund=false\nignore-scripts=true\n' > .npmrc || return 2
  git status --short || return 2
  printf 'lab_root=%s\nevidence_note=%s\n' "$lab_root" "$evidence_note"
}

if module_02_start; then
  echo "module_02_start=ready"
else
  module_02_start_exit=$?
  printf 'module_02_start=failed exit=%s; preserve any created path and use recovery\n' \
    "$module_02_start_exit" >&2
fi
```

Required starting status, in lexical order:

```text
?? .gitignore
?? .npmrc
?? package.json
```

No other path may appear. Continue only after `module_02_start=ready`. Keep the recorded paths, saved `module_02_original_*` values, and guard functions in the same terminal session; failures return control so recovery values remain available.
`git branch --show-current` must print `training/module-02`.

### Windows/PowerShell 7.4+ — candidate pending native evidence

Before pasting the block, set the process environment variable
`DIRECTIVE_TRAINING_ROOT` to the absolute path of your private curriculum clone.
The block fails clearly if that learner input is absent.

```powershell
if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required' }
$Module02OriginalPath = $env:PATH
$Module02HadNpmUserConfig = $null -ne (Get-Item Env:NPM_CONFIG_USERCONFIG -ErrorAction SilentlyContinue)
$Module02OriginalNpmUserConfig = $env:NPM_CONFIG_USERCONFIG
$Module02OriginalErrorActionPreference = $ErrorActionPreference
$Module02OriginalNativePreference = $PSNativeCommandUseErrorActionPreference
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
if ([string]::IsNullOrWhiteSpace($env:DIRECTIVE_TRAINING_ROOT)) {
  throw 'Set DIRECTIVE_TRAINING_ROOT to the absolute curriculum clone path before running this block.'
}
$TrainingRoot = [IO.Path]::GetFullPath($env:DIRECTIVE_TRAINING_ROOT).TrimEnd([IO.Path]::DirectorySeparatorChar)
$Fixture = Join-Path $TrainingRoot 'labs/fixtures/02-disposable-initialization/package.json'
if (-not (Test-Path -LiteralPath $Fixture -PathType Leaf)) { throw "fixture not found: $Fixture" }

$TempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd([IO.Path]::DirectorySeparatorChar)
$LabParent = Join-Path $TempRoot ('3ci-directive-module-02.' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $LabParent | Out-Null
$LabParent = [IO.Path]::GetFullPath($LabParent).TrimEnd([IO.Path]::DirectorySeparatorChar)
if (-not $LabParent.StartsWith($TempRoot + [IO.Path]::DirectorySeparatorChar + '3ci-directive-module-02.')) {
  throw "unsafe lab parent: $LabParent"
}

$Ancestor = Get-Item -LiteralPath $LabParent
while ($null -ne $Ancestor) {
  if (Test-Path -LiteralPath (Join-Path $Ancestor.FullName '.git')) {
    throw 'temporary parent is inside another Git repository'
  }
  $Ancestor = $Ancestor.Parent
}

$LabRoot = Join-Path $LabParent ('attempt-01.' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $LabRoot | Out-Null
$LabRoot = [IO.Path]::GetFullPath($LabRoot).TrimEnd([IO.Path]::DirectorySeparatorChar)
$EvidenceNote = Join-Path $LabParent 'evidence.md'
[IO.File]::WriteAllText($EvidenceNote, '', [Text.UTF8Encoding]::new($false))

function Assert-LabRoot {
  $Current = [IO.Path]::GetFullPath((Get-Location).Path).TrimEnd([IO.Path]::DirectorySeparatorChar)
  if ($Current -ne $LabRoot) { throw "working directory differs from recorded lab root" }
  if (-not $LabRoot.StartsWith($LabParent + [IO.Path]::DirectorySeparatorChar + 'attempt-')) {
    throw "unsafe lab root: $LabRoot"
  }
  if ($LabRoot -eq $TrainingRoot -or $LabRoot.StartsWith($TrainingRoot + [IO.Path]::DirectorySeparatorChar)) {
    throw 'lab is inside the curriculum clone'
  }
}

function Assert-NoRemote {
  Assert-LabRoot
  if (-not (Test-Path -LiteralPath (Join-Path $LabRoot '.git'))) { throw '.git is missing' }
  $GitRoot = (& git rev-parse --show-toplevel | Out-String).Trim()
  if ($LASTEXITCODE -ne 0) { throw 'could not resolve the Git root' }
  $GitRoot = [IO.Path]::GetFullPath($GitRoot).TrimEnd([IO.Path]::DirectorySeparatorChar)
  if ($GitRoot -ne $LabRoot) { throw 'Git root differs from recorded lab root' }
  $Remotes = @(git remote)
  if ($LASTEXITCODE -ne 0) { throw 'could not inspect Git remotes' }
  if ($Remotes.Count -ne 0) { throw 'the disposable repository has a Git remote' }
}

Set-Location $LabRoot
Assert-LabRoot
git init --initial-branch=main
if ($LASTEXITCODE -ne 0) { throw 'git init failed' }
git switch -c training/module-02
if ($LASTEXITCODE -ne 0) { throw 'feature branch creation failed' }
Assert-NoRemote
Copy-Item -LiteralPath $Fixture -Destination (Join-Path $LabRoot 'package.json')
[IO.File]::WriteAllText((Join-Path $LabRoot '.gitignore'), "node_modules/`n/.npm-cache/`n/USER.md`n/.deft/USER.md`n", [Text.UTF8Encoding]::new($false))
[IO.File]::WriteAllText((Join-Path $LabRoot '.npmrc'), "registry=https://registry.npmjs.org/`naudit=false`nfund=false`nignore-scripts=true`n", [Text.UTF8Encoding]::new($false))
git status --short
"lab_root=$LabRoot"
"evidence_note=$EvidenceNote"
"module_02_start=ready"
```

Required status:

```text
?? .gitignore
?? .npmrc
?? package.json
```

Keep the variables and functions in the same PowerShell session. Store written evidence only
at `$EvidenceNote`, beside the attempt and outside its Git working tree.
Continue only after PowerShell prints `module_02_start=ready`.
`git branch --show-current` must print `training/module-02`.

## Safety boundary

- Work only in the exact `lab_root` or `$LabRoot`; never initialize, reset, clean, or implement in this curriculum or a business repository.
- Keep `git remote` empty; do not push, open a pull request, deploy, release, publish, or call production.
- Do not put tokens, credentials, environment dumps, client data, proprietary code, production logs, or confidential issues in commands or evidence.
- Mutations are limited to the exact temporary parent, its Git metadata, fixture files, dependency state, Directive integration/runtime state, and adjacent evidence lists.
- Stop if the root guard fails, a remote appears, the pin differs from 0.119.5, or a command requests unexpected credentials or external action.

## Starting checkpoint

This checkpoint proves the local executable, help surfaces, initialization,
ignore rules, and inspected staging allowlist before committing the fictional
start; it never uses `git add --all`. The normal install uses the tracked
public-registry `.npmrc`, a lab-local cache, and a child environment without
inherited `NPM_CONFIG_*` values. The provided E401 exercise remains a written
decision drill; do not weaken this isolation to manufacture it.

### macOS/zsh or Linux/bash

```sh
module_02_initialize() {
  assert_no_remote || return 2
  node -e 'const p=require("./package.json"); const o=p.overrides||{}; if(p.private!==true || p.devDependencies?.["@deftai/directive"]!=="0.119.5" || ["@deftai/directive-content","@deftai/directive-core","@deftai/directive-types"].some((n)=>o[n]!=="0.119.5")) process.exit(2)' || return 2
  env -i PATH="$PATH" HOME="$HOME" npm install --userconfig "$lab_root/.npmrc" --globalconfig /dev/null --cache "$lab_root/.npm-cache" --ignore-scripts --no-audit --no-fund || return 2
  assert_no_remote || return 2

  local_bin="$lab_root/node_modules/.bin"
  directive_path="$local_bin/directive"
  test -x "$directive_path" || { echo "project-local Directive CLI is missing" >&2; return 2; }
  test -x "$local_bin/deft" || { echo "project-local Deft hook runtime is missing" >&2; return 2; }
  export PATH="$local_bin:$PATH"
  hash -r
  resolved_deft="$(command -v deft)" || return 2
  test "$resolved_deft" = "$local_bin/deft" || {
    echo "deft does not resolve to the disposable repository" >&2
    return 2
  }

  node -e 'for (const n of ["@deftai/directive","@deftai/directive-content","@deftai/directive-core","@deftai/directive-types"]) { if(require("./node_modules/"+n+"/package.json").version!=="0.119.5") process.exit(2) }' || return 2
  version_output="$("$directive_path" --version)" || return 2
  printf '%s\n' "$version_output"
  case "$version_output" in
    *'@deftai/directive-core@0.119.5'*) ;;
    *) echo "wrong Directive version" >&2; return 2 ;;
  esac
  "$directive_path" --help >/dev/null || return 2
  "$directive_path" commands >/dev/null || return 2
  "$directive_path" init --help >/dev/null || return 2
  "$directive_path" update --help >/dev/null || return 2
  "$directive_path" doctor --help >/dev/null || return 2

  if "$directive_path" toolchain:check --help >"$lab_parent/toolchain-help.txt" 2>&1; then
    toolchain_help_exit=0
  else
    toolchain_help_exit=$?
  fi
  test "$toolchain_help_exit" -eq 2 || return 2
  grep -F 'unrecognized argument: --help' "$lab_parent/toolchain-help.txt" || return 2

  assert_no_remote || return 2
  "$directive_path" init --yes --repo-root . || return 2
  assert_no_remote || return 2

  for required_tracked_path in \
    AGENTS.md \
    Taskfile.yml \
    .deft/GENERATION.json \
    .githooks/pre-commit \
    .npmrc \
    xbrief/PROJECT-DEFINITION.xbrief.json
  do
    test -f "$required_tracked_path" || {
      echo "required initialized path is missing: $required_tracked_path" >&2
      return 2
    }
  done
  node -e 'const g=require("./.deft/GENERATION.json"); if(g.contentVersion!=="0.119.5" || g.surfaces?.payload!=="0.119.5") process.exit(2)' || return 2
  node -e 'const x=require("./xbrief/PROJECT-DEFINITION.xbrief.json"); if(x.xBRIEFInfo?.version!=="0.8") process.exit(2)' || return 2
  hooks_path="$(git config --get core.hooksPath)" || return 2
  test "$hooks_path" = ".githooks" || {
    echo "unexpected Git hooks path: $hooks_path" >&2
    return 2
  }

  git status --short || return 2
  for ignored_path in \
    .deft/core/VERSION \
    .deft/.cli/example \
    .deft-cache/example \
    .deft/ritual-state.json \
    xbrief/.triage-cache/candidates.jsonl \
    USER.md \
    .npm-cache/example \
    node_modules/example
  do
    git check-ignore -q -- "$ignored_path" || return 2
  done

  cached_files="$lab_parent/cached-files.txt"
  untracked_files="$lab_parent/untracked-files.txt"
  trackable_files="$lab_parent/trackable-files.txt"
  git diff --cached --name-only >"$cached_files" || return 2
  git ls-files --others --exclude-standard >"$untracked_files" || return 2
  LC_ALL=C sort -u "$cached_files" "$untracked_files" >"$trackable_files" || return 2
  test -s "$trackable_files" || return 2
  cat "$trackable_files" || return 2

  while IFS= read -r relative_path
  do
    case "$relative_path" in
      .agents/*|.claude/*|.codex/*|.cursor/*|.deft/GENERATION.json|.deft/approved-scope/*|.gitattributes|.githooks/*|.github/*|.gitignore|.grok/*|.npmrc|.prettierignore|AGENTS.md|Taskfile.yml|greptile.json|package.json|package-lock.json|xbrief/*) ;;
      *) echo "unexpected trackable path: $relative_path" >&2; return 2 ;;
    esac
  done <"$trackable_files"

  assert_no_remote || return 2
  git add --pathspec-from-file="$trackable_files" || return 2
  for required_tracked_path in \
    AGENTS.md \
    Taskfile.yml \
    .deft/GENERATION.json \
    .githooks/pre-commit \
    .npmrc \
    xbrief/PROJECT-DEFINITION.xbrief.json
  do
    git ls-files --error-unmatch -- "$required_tracked_path" >/dev/null 2>&1 || {
      echo "required initialized path is not staged: $required_tracked_path" >&2
      return 2
    }
  done
  git diff --cached --name-only || return 2
  git config user.name 'Northstar Training Learner' || return 2
  git config user.email 'learner@northstar.invalid' || return 2
  resolved_deft="$(command -v deft)" || return 2
  test "$resolved_deft" = "$local_bin/deft" || return 2
  git commit -m 'checkpoint: initialize fictional Directive consumer' || return 2
  git rev-parse HEAD || return 2
  assert_no_remote || return 2
}

if module_02_initialize; then
  echo "module_02_initialize=ready"
else
  module_02_initialize_exit=$?
  printf 'module_02_initialize=failed exit=%s; preserve this attempt and use recovery\n' \
    "$module_02_initialize_exit" >&2
fi
```

If the allowlist rejects a path, preserve the attempt and compare that path with the pinned source notes; do not widen the list, and continue only after `module_02_initialize=ready`.

### Windows/PowerShell 7.4+

```powershell
Assert-NoRemote
node -e 'const p=require("./package.json"); const o=p.overrides||{}; if(p.private!==true || p.devDependencies?.["@deftai/directive"]!=="0.119.5" || ["@deftai/directive-content","@deftai/directive-core","@deftai/directive-types"].some((n)=>o[n]!=="0.119.5")) process.exit(2)'
node -e 'const { spawnSync } = require("node:child_process"); const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^npm_config_/i.test(key))); const result = spawnSync("npm.cmd", ["install", "--userconfig", ".npmrc", "--globalconfig", "NUL", "--cache", ".npm-cache", "--ignore-scripts", "--no-audit", "--no-fund"], { env, stdio: "inherit", shell: true }); process.exit(result.status ?? 1)'
if ($LASTEXITCODE -ne 0) { throw 'isolated npm install failed' }
Assert-NoRemote

$LocalBin = [IO.Path]::GetFullPath((Join-Path $LabRoot 'node_modules/.bin'))
$env:PATH = $LocalBin + [IO.Path]::PathSeparator + $env:PATH
$DirectivePath = [IO.Path]::GetFullPath((Join-Path $LocalBin 'directive.cmd'))
$DeftPath = [IO.Path]::GetFullPath((Join-Path $LocalBin 'deft.cmd'))
if (-not (Test-Path -LiteralPath $DirectivePath -PathType Leaf)) { throw 'project-local Directive CLI is missing' }
if (-not (Test-Path -LiteralPath $DeftPath -PathType Leaf)) { throw 'project-local Deft hook runtime is missing' }
$ResolvedDeft = [IO.Path]::GetFullPath((Get-Command deft -CommandType Application -All -ErrorAction Stop | Select-Object -First 1).Source)
if ($ResolvedDeft -ne $DeftPath) { throw "deft does not resolve to the disposable repository: $ResolvedDeft" }
node -e 'for (const n of ["@deftai/directive","@deftai/directive-content","@deftai/directive-core","@deftai/directive-types"]) { if(require("./node_modules/"+n+"/package.json").version!=="0.119.5") process.exit(2) }'
& $DirectivePath --version
& $DirectivePath --help | Out-Null
& $DirectivePath commands | Out-Null
& $DirectivePath init --help | Out-Null
& $DirectivePath update --help | Out-Null
& $DirectivePath doctor --help | Out-Null

$ToolchainHelpPath = Join-Path $LabParent 'toolchain-help.txt'
$PSNativeCommandUseErrorActionPreference = $false
try {
  & $DirectivePath toolchain:check --help *> $ToolchainHelpPath
  $ToolchainHelpExit = $LASTEXITCODE
} finally {
  $PSNativeCommandUseErrorActionPreference = $true
}
if ($ToolchainHelpExit -ne 2) { throw "expected toolchain help exit 2; got $ToolchainHelpExit" }
if (-not (Select-String -LiteralPath $ToolchainHelpPath -SimpleMatch 'unrecognized argument: --help')) {
  throw 'expected 0.119.5 toolchain help diagnostic is missing'
}

Assert-NoRemote
& $DirectivePath init --yes --repo-root .
if ($LASTEXITCODE -ne 0) { throw 'directive init failed' }
Assert-NoRemote

$RequiredTrackedPaths = @(
  'AGENTS.md',
  'Taskfile.yml',
  '.deft/GENERATION.json',
  '.githooks/pre-commit',
  '.npmrc',
  'xbrief/PROJECT-DEFINITION.xbrief.json'
)
foreach ($RequiredTrackedPath in $RequiredTrackedPaths) {
  if (-not (Test-Path -LiteralPath $RequiredTrackedPath -PathType Leaf)) {
    throw "required initialized path is missing: $RequiredTrackedPath"
  }
}
node -e 'const g=require("./.deft/GENERATION.json"); if(g.contentVersion!=="0.119.5" || g.surfaces?.payload!=="0.119.5") process.exit(2)'
node -e 'const x=require("./xbrief/PROJECT-DEFINITION.xbrief.json"); if(x.xBRIEFInfo?.version!=="0.8") process.exit(2)'
$HooksPath = (& git config --get core.hooksPath | Out-String).Trim()
if ($LASTEXITCODE -ne 0 -or $HooksPath -ne '.githooks') { throw "unexpected Git hooks path: $HooksPath" }

git status --short
$IgnoredPaths = @(
  '.deft/core/VERSION',
  '.deft/.cli/example',
  '.deft-cache/example',
  '.deft/ritual-state.json',
  'xbrief/.triage-cache/candidates.jsonl',
  'USER.md',
  '.npm-cache/example',
  'node_modules/example'
)
foreach ($IgnoredPath in $IgnoredPaths) {
  git check-ignore -q -- $IgnoredPath
  if ($LASTEXITCODE -ne 0) { throw "expected ignored path: $IgnoredPath" }
}

$TrackableFilesPath = Join-Path $LabParent 'trackable-files.txt'
$TrackableFiles = @(
  @(git diff --cached --name-only)
  @(git ls-files --others --exclude-standard)
) | Sort-Object -Unique
if ($LASTEXITCODE -ne 0 -or $TrackableFiles.Count -eq 0) { throw 'no trackable files found' }
[IO.File]::WriteAllLines($TrackableFilesPath, $TrackableFiles, [Text.UTF8Encoding]::new($false))
$TrackableFiles | ForEach-Object { Write-Output $_ }
$AllowedPath = '^(\.agents/|\.claude/|\.codex/|\.cursor/|\.deft/GENERATION\.json$|\.deft/approved-scope/|\.gitattributes$|\.githooks/|\.github/|\.gitignore$|\.grok/|\.npmrc$|\.prettierignore$|AGENTS\.md$|Taskfile\.yml$|greptile\.json$|package\.json$|package-lock\.json$|xbrief/)'
foreach ($RelativePath in $TrackableFiles) {
  if ($RelativePath -notmatch $AllowedPath) { throw "unexpected trackable path: $RelativePath" }
}

Assert-NoRemote
git add --pathspec-from-file=$TrackableFilesPath
if ($LASTEXITCODE -ne 0) { throw 'explicit staging failed' }
foreach ($RequiredTrackedPath in $RequiredTrackedPaths) {
  git ls-files --error-unmatch -- $RequiredTrackedPath | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "required initialized path is not staged: $RequiredTrackedPath" }
}
git diff --cached --name-only
git config user.name 'Northstar Training Learner'
git config user.email 'learner@northstar.invalid'
$ResolvedDeft = [IO.Path]::GetFullPath((Get-Command deft -CommandType Application -All -ErrorAction Stop | Select-Object -First 1).Source)
if ($ResolvedDeft -ne $DeftPath) { throw 'project-local Deft hook runtime is no longer first on PATH' }
git commit -m 'checkpoint: initialize fictional Directive consumer'
if ($LASTEXITCODE -ne 0) { throw 'checkpoint commit failed' }
git rev-parse HEAD
Assert-NoRemote
```

Checkpoint name: `checkpoint: initialize fictional Directive consumer`.

Checkpoint evidence: `git log -1 --format=%s` prints `checkpoint: initialize fictional Directive consumer`, the branch is `training/module-02`, the staged-plus-untracked list contains only accepted paths, and `git remote` remains empty.

## Tasks

### Task 1 — Explain the command choice

**Produce:** at `$evidence_note` on Unix or `$EvidenceNote` on Windows, write one sentence
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
module_02_diagnose() {
  assert_no_remote || return 2
  if "$directive_path" doctor --full --project-root .; then
    doctor_exit=0
  else
    doctor_exit=$?
  fi
  if "$directive_path" toolchain:check --consumer --project-root .; then
    toolchain_exit=0
  else
    toolchain_exit=$?
  fi
  printf 'doctor_exit=%s toolchain_exit=%s\n' "$doctor_exit" "$toolchain_exit"
  assert_no_remote || return 2
  test "$doctor_exit" -eq 0 && test "$toolchain_exit" -eq 0
}

if module_02_diagnose; then
  echo "module_02_diagnose=ready"
else
  module_02_diagnose_exit=$?
  printf 'module_02_diagnose=failed exit=%s; keep the recorded exits and use recovery\n' \
    "$module_02_diagnose_exit" >&2
fi
```

On Windows/PowerShell 7.4+:

```powershell
Assert-NoRemote
$PSNativeCommandUseErrorActionPreference = $false
try {
  & $DirectivePath doctor --full --project-root .
  $DoctorExit = $LASTEXITCODE
  & $DirectivePath toolchain:check --consumer --project-root .
  $ToolchainExit = $LASTEXITCODE
} finally {
  $PSNativeCommandUseErrorActionPreference = $true
}
"doctor_exit=$DoctorExit toolchain_exit=$ToolchainExit"
Assert-NoRemote
if ($DoctorExit -ne 0 -or $ToolchainExit -ne 0) { throw 'diagnosis did not pass; use the recorded exits for recovery' }
```

**Checkpoint:** both exits are 0. Warnings may remain; record them exactly enough to identify
the classification and recommendation, without copying unrelated environment data.

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

**Produce:** at `$evidence_note` on Unix or `$EvidenceNote` on Windows, write a four-column
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

Use these safe inspections:

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

Each `git check-ignore -v` command must exit 0 and print the matching ignore source, pattern,
and exact path. A missing line is failed evidence; do not substitute a different path without
first reconciling it with the pinned baseline.

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

Run these from the recorded disposable repository root while the variables and guard functions remain defined in the current terminal session.

### macOS and Linux

```sh
module_02_accept() {
  assert_no_remote || return 2
  node -e 'const p=require("./package.json"); const o=p.overrides||{}; if(p.private!==true || p.devDependencies?.["@deftai/directive"]!=="0.119.5" || ["@deftai/directive-content","@deftai/directive-core","@deftai/directive-types"].some((n)=>o[n]!=="0.119.5")) process.exit(2)' || return 2
  node -e 'for (const n of ["@deftai/directive","@deftai/directive-content","@deftai/directive-core","@deftai/directive-types"]) { if(require("./node_modules/"+n+"/package.json").version!=="0.119.5") process.exit(2) }' || return 2
  resolved_deft="$(command -v deft)" || return 2
  test "$resolved_deft" = "$local_bin/deft" || return 2
  test "$(git config --get core.hooksPath)" = ".githooks" || return 2
  version_output="$("$directive_path" --version)" || return 2
  printf '%s\n' "$version_output"
  case "$version_output" in
    *'@deftai/directive-core@0.119.5'*) ;;
    *) echo "wrong Directive version" >&2; return 2 ;;
  esac
  "$directive_path" doctor --full --project-root . || return 2
  "$directive_path" toolchain:check --consumer --project-root . || return 2
  git diff --quiet || return 2
  git diff --cached --quiet || return 2
  status_output="$(git status --porcelain --untracked-files=all)" || return 2
  test -z "$status_output" || return 2
  git check-ignore -q -- .deft/core/VERSION || return 2
  assert_no_remote || return 2
  test "$(git branch --show-current)" = 'training/module-02' || return 2
}

if module_02_accept; then
  echo "module_02_accept=PASS"
else
  module_02_accept_exit=$?
  printf 'module_02_accept=FAIL exit=%s\n' "$module_02_accept_exit" >&2
fi
```

### Windows PowerShell 7.4+

```powershell
Assert-NoRemote
if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required' }
node -e 'const p=require("./package.json"); const o=p.overrides||{}; if(p.private!==true || p.devDependencies?.["@deftai/directive"]!=="0.119.5" || ["@deftai/directive-content","@deftai/directive-core","@deftai/directive-types"].some((n)=>o[n]!=="0.119.5")) process.exit(2)'
node -e 'for (const n of ["@deftai/directive","@deftai/directive-content","@deftai/directive-core","@deftai/directive-types"]) { if(require("./node_modules/"+n+"/package.json").version!=="0.119.5") process.exit(2) }'
$ResolvedDeft = [IO.Path]::GetFullPath((Get-Command deft -CommandType Application -All -ErrorAction Stop | Select-Object -First 1).Source)
if ($ResolvedDeft -ne $DeftPath) { throw 'deft does not resolve to the disposable repository' }
$HooksPath = (& git config --get core.hooksPath | Out-String).Trim()
if ($LASTEXITCODE -ne 0 -or $HooksPath -ne '.githooks') { throw 'unexpected Git hooks path' }
$VersionOutput = (& $DirectivePath --version | Out-String)
if ($LASTEXITCODE -ne 0 -or $VersionOutput -notmatch '@deftai/directive-core@0\.119\.5') { throw 'wrong Directive version' }
& $DirectivePath doctor --full --project-root .
if ($LASTEXITCODE -ne 0) { throw 'doctor failed' }
& $DirectivePath toolchain:check --consumer --project-root .
if ($LASTEXITCODE -ne 0) { throw 'consumer toolchain check failed' }
git diff --quiet
if ($LASTEXITCODE -ne 0) { throw 'unstaged tracked changes remain' }
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) { throw 'staged changes remain' }
$StatusOutput = @(git status --porcelain --untracked-files=all)
if ($LASTEXITCODE -ne 0) { throw 'could not inspect repository status' }
if ($StatusOutput.Count -ne 0) { throw 'tracked or untracked changes remain' }
git check-ignore -q -- .deft/core/VERSION
if ($LASTEXITCODE -ne 0) { throw 'core deposit is not ignored' }
Assert-NoRemote
if ((git branch --show-current) -ne 'training/module-02') { throw 'wrong lab branch' }
```

| Validation | Required exit/result | Observable signal | Outcomes |
| --- | --- | --- | --- |
| Exact local version | 0 | Contains `@deftai/directive-core@0.119.5` | O2.2 |
| Full doctor | 0 | Health summary plus any classified warnings and one recommendation | O2.4 |
| Consumer toolchain check | 0 | `All required tools available` | O2.2, O2.4 |
| Git boundary checks | 0 | Clean tracked index, `.deft/core` ignored, no remote names | O2.2, O2.3 |
| Written chooser/boundary/anatomy inspections | All required rows present | State-based choices, consumer/maintainer boundary, and evidence-backed classifications | O2.1, O2.3 |
| Recovery decision drill | All five fields present | Provided failure traced to preserved evidence, approved support, a fresh guarded attempt, and an observable retry gate | O2.4 |

If a required command differs, retain its command, exit, and relevant output; do not substitute a global CLI, omit a warning, or weaken a check.

## Evidence bundle

Keep the smallest bundle that proves the outcomes:

- stable ID, attempt date, operating system, shell, Node/npm versions, and Directive baseline;
- exact `lab_root`/`$LabRoot`, outside-repository evidence-note path, checkpoint commit,
  and final archive path;
- command chooser with reasons (O2.1);
- local version, init, doctor, toolchain, and no-remote results with exit codes (O2.2/O2.4);
- pre-stage and staged path lists plus the anatomy table (O2.3);
- five-field recovery decision for the provided fictional failure (O2.4);
- reset, archive, and restored shell-environment state.

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

The successful order is: guard → no remote → install exact pin → prove local CLI → verify
help → init → prove ignored paths → inspect allowed files → stage exact file list → commit →
doctor → toolchain → classify → recovery decision drill → archive.

After Hint 3, use the recovery table or the explained solution. No instructor unlock is
required.

## Expected failures and recovery

| Symptom | Confirm the cause | Recovery | Evidence after retry |
| --- | --- | --- | --- |
| `npm install` returns `E401`/`E403` | Record the status and registry host only; do not print config or tokens | Preserve the attempt. Restore the organization-approved registry/auth setup, then start a fresh attempt. If an approved public-registry route exists, use a fresh temporary npm config rather than editing global state. | Local binary exists and reports 0.119.5 |
| Local binary is missing but another `directive` runs | Test the exact `node_modules/.bin` path | Do not accept the global result. Correct the install in a fresh attempt and use the explicit path. | Exact local path and version both pass |
| Init reports `brownfield-install` | Confirm `.git` exists | Continue. This is expected released behavior for the lab's Git-first safety path. | Init exits 0 and managed integration appears |
| Checkpoint commit is refused on `main` | Run `git branch --show-current`; the branch gate protects the default branch | Preserve the gate. Switch the unborn lab repository to `training/module-02`, re-inspect the complete staged-plus-untracked allowlist, then retry the commit. | Commit succeeds on `training/module-02` |
| Checkpoint commit prints `warning: LF will be replaced by CRLF` | Confirm the host uses `core.autocrlf=true`, then check the commit exit code and `git log -1 --format=%s` | Treat the line-ending notice as an expected warning, not a failed checkpoint. Do not change global Git configuration or bypass the hook. | Exit code is 0, the checkpoint subject is exact, and tracked status is clean |
| Toolchain help exits 2 | Inspect `toolchain-help.txt` for the known unrecognized argument | Record the 0.119.5 defect; verify registration with `commands`, then run the tested consumer form. | Consumer toolchain command exits 0 |
| Doctor exits 0 with warnings | Record severity and recommended action | Treat the result as evidence and classify the recommendation. Do not execute migration or another untaught recovery in this module. Use Task 4's provided failure for the required recovery decision. | Exit and warnings are both represented accurately |
| Init prints generic push, PR, or merge next steps | The installer is describing an ordinary repository lifecycle, not granting this lab remote authority | Do not follow those steps. Re-run the no-remote guard and continue only with the local lab. | `git remote` remains empty |
| Allowlist rejects a path | Read the exact path and compare with the pinned baseline | Stop. Preserve the attempt and verify version/source drift before amending any allowlist. | A fresh attempt contains only expected paths |
| Root guard or no-remote check fails | Print only the canonical lab path and remote names | Stop every mutation. Preserve the directory; start from a new temporary parent. | Guard and empty-remote checks pass before retry |

Recoveries replace the attempt unless explicitly marked “continue”; none depends on an instructor or hidden file.

If your organization confirms that the public npm registry is an approved recovery route,
isolate that route in the fresh attempt without editing global npm state:

```sh
npm_config="$(mktemp "$lab_parent/npmrc-attempt-02.XXXXXX")"
: > "$npm_config"
export NPM_CONFIG_USERCONFIG="$npm_config"
npm config get registry
```

On PowerShell 7.4+, use:

```powershell
$NpmConfig = Join-Path $LabParent ('npmrc-attempt-02.' + [guid]::NewGuid().ToString('N'))
[IO.File]::WriteAllText($NpmConfig, '', [Text.UTF8Encoding]::new($false))
$env:NPM_CONFIG_USERCONFIG = $NpmConfig
npm config get registry
```

The printed registry host must match the route your organization approved. Do not record npm
configuration contents or credentials.

## Reset to start

If a live command fails, this lab uses a fresh-directory reset only. Task 4 satisfies the
required recovery outcome without forcing a live failure. Do not run `git reset --hard`,
`git clean`, or a recursive deletion.

1. Record the failed `lab_root`/`$LabRoot`, command, exit, and relevant output.
2. Leave the failed attempt in place.
3. From the same guarded temporary parent, create `attempt-02` with a new random suffix.
4. Re-run the complete environment and starting-state setup against that new exact path.
5. Re-run the root and no-remote guards before the first mutation.

On Unix, create the replacement from outside the failed repository:

```sh
module_02_new_attempt() {
  cd "$lab_parent" || return 2
  lab_root="$(mktemp -d "$lab_parent/attempt-02.XXXXXX")" || return 2
  lab_root="$(cd "$lab_root" && pwd -P)" || return 2
  cd "$lab_root" || return 2
  assert_lab_root || return 2
}

if module_02_new_attempt; then
  echo "module_02_new_attempt=ready"
else
  module_02_new_attempt_exit=$?
  printf 'module_02_new_attempt=failed exit=%s\n' "$module_02_new_attempt_exit" >&2
fi
```

On Windows/PowerShell 7.4+:

```powershell
Set-Location $LabParent
$LabRoot = Join-Path $LabParent ('attempt-02.' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $LabRoot | Out-Null
$LabRoot = [IO.Path]::GetFullPath($LabRoot).TrimEnd([IO.Path]::DirectorySeparatorChar)
Set-Location $LabRoot
Assert-LabRoot
```

Then repeat the lab setup beginning with `git init`. The failed attempt remains available for
comparison.

## Cleanup

Cleanup is recoverable: move the exact lab parent into a new operating-system temporary
archive. Do not delete it. This lab starts no process, container, listener, or remote service.

### macOS or Linux

```sh
module_02_archive() {
  assert_no_remote || return 2
  cd "$lab_parent" || return 2
  cd .. || return 2
  archive_root="$(mktemp -d "$temp_root/3ci-directive-module-02-archive.XXXXXX")" || return 2
  archive_root="$(cd "$archive_root" && pwd -P)" || return 2
  archive_target="$archive_root/lab-parent"
  test ! -e "$archive_target" || return 2
  mv -- "$lab_parent" "$archive_target" || return 2
  test -d "$archive_target" || return 2
  test ! -e "$lab_parent" || return 2
  test -f "$archive_target/evidence.md" || {
    echo "archived evidence note is missing" >&2
    return 2
  }
  attempt_count=0
  for archived_attempt in "$archive_target"/attempt-*
  do
    test -d "$archived_attempt" || { echo "no archived attempts found" >&2; return 2; }
    test -e "$archived_attempt/.git" || { echo "archived attempt lacks .git" >&2; return 2; }
    archived_git_root="$(git -C "$archived_attempt" rev-parse --show-toplevel)" || return 2
    archived_git_root="$(cd "$archived_git_root" && pwd -P)" || return 2
    archived_path="$(cd "$archived_attempt" && pwd -P)" || return 2
    test "$archived_git_root" = "$archived_path" || return 2
    archived_remotes="$(git -C "$archived_attempt" remote)" || return 2
    test -z "$archived_remotes" || { echo "archived attempt has a remote" >&2; return 2; }
    attempt_count=$((attempt_count + 1))
  done
  test "$attempt_count" -ge 1 || return 2
  printf 'archived=%s\narchived_evidence=%s\n' "$archive_target" "$archive_target/evidence.md"
}

module_02_restore_environment() {
  PATH="$module_02_original_path" || return 2
  export PATH
  hash -r
  if test "$module_02_had_npm_userconfig" -eq 1; then
    NPM_CONFIG_USERCONFIG="$module_02_original_npm_userconfig" || return 2
    export NPM_CONFIG_USERCONFIG
  else
    unset NPM_CONFIG_USERCONFIG
  fi
}

module_02_archive_exit=0
if module_02_archive; then
  echo "module_02_archive=PASS"
else
  module_02_archive_exit=$?
  printf 'module_02_archive=FAIL exit=%s\n' "$module_02_archive_exit" >&2
fi
module_02_restore_exit=0
if module_02_restore_environment; then
  echo "module_02_environment_restore=PASS"
else
  module_02_restore_exit=$?
  printf 'module_02_environment_restore=FAIL exit=%s\n' "$module_02_restore_exit" >&2
fi
test "$module_02_archive_exit" -eq 0 && test "$module_02_restore_exit" -eq 0
```

The loop fails unless it finds and verifies every archived `attempt-*` repository.

### Windows PowerShell 7.4+

```powershell
try {
  Assert-NoRemote
  Set-Location ([IO.Path]::GetTempPath())
  $ArchiveRoot = Join-Path ([IO.Path]::GetTempPath()) ('3ci-directive-module-02-archive.' + [guid]::NewGuid().ToString('N'))
  New-Item -ItemType Directory -Path $ArchiveRoot | Out-Null
  $ArchiveTarget = Join-Path $ArchiveRoot 'lab-parent'
  if (Test-Path -LiteralPath $ArchiveTarget) { throw "archive target already exists: $ArchiveTarget" }
  Move-Item -LiteralPath $LabParent -Destination $ArchiveTarget
  if (-not (Test-Path -LiteralPath $ArchiveTarget -PathType Container)) { throw 'archive move failed' }
  if (Test-Path -LiteralPath $LabParent) { throw 'original lab parent still exists after archive move' }
  $ArchivedEvidenceNote = Join-Path $ArchiveTarget 'evidence.md'
  if (-not (Test-Path -LiteralPath $ArchivedEvidenceNote -PathType Leaf)) { throw 'archived evidence note is missing' }
  $ArchivedAttempts = @(Get-ChildItem -LiteralPath $ArchiveTarget -Directory | Where-Object { $_.Name -like 'attempt-*' })
  if ($ArchivedAttempts.Count -eq 0) { throw 'no archived attempts found' }
  foreach ($ArchivedAttempt in $ArchivedAttempts) {
    if (-not (Test-Path -LiteralPath (Join-Path $ArchivedAttempt.FullName '.git'))) {
      throw "archived attempt lacks .git: $($ArchivedAttempt.FullName)"
    }
    $ArchivedGitRoot = (& git -C $ArchivedAttempt.FullName rev-parse --show-toplevel | Out-String).Trim()
    if ($LASTEXITCODE -ne 0) { throw "could not resolve archived Git root: $($ArchivedAttempt.FullName)" }
    $ArchivedGitRoot = [IO.Path]::GetFullPath($ArchivedGitRoot).TrimEnd([IO.Path]::DirectorySeparatorChar)
    if ($ArchivedGitRoot -ne $ArchivedAttempt.FullName) { throw 'archived Git root differs from attempt path' }
    $ArchivedRemotes = @(git -C $ArchivedAttempt.FullName remote)
    if ($LASTEXITCODE -ne 0) { throw "could not inspect archived remotes: $($ArchivedAttempt.FullName)" }
    if ($ArchivedRemotes.Count -ne 0) { throw "archived attempt has a remote: $($ArchivedAttempt.FullName)" }
  }
  "archived=$ArchiveTarget"
  "archived_evidence=$ArchivedEvidenceNote"
} finally {
  $env:PATH = $Module02OriginalPath
  if ($Module02HadNpmUserConfig) {
    $env:NPM_CONFIG_USERCONFIG = $Module02OriginalNpmUserConfig
  } else {
    [Environment]::SetEnvironmentVariable('NPM_CONFIG_USERCONFIG', $null, [EnvironmentVariableTarget]::Process)
  }
  $ErrorActionPreference = $Module02OriginalErrorActionPreference
  $PSNativeCommandUseErrorActionPreference = $Module02OriginalNativePreference
}
```

Expected cleanup state: the original lab parent path no longer exists because it was moved;
the printed archive path exists; each attempted repository has no remote; and this training
repository and all business repositories are unchanged. The caller's original `PATH`, npm
user-config selection, and PowerShell error preferences are restored. Retain or remove the
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
> operating system and shell. The explicit local version, doctor, consumer toolchain, Git
> boundary, chooser, anatomy, and recovery-decision checks passed and cover O2.1–O2.4. The
> exact disposable parent is archived at my recorded temporary archive path. Every attempt
> has no remote and contains no credential or sensitive data. My original shell environment
> is restored.

If any sentence is false, record the gap and retry only the corresponding outcome.
