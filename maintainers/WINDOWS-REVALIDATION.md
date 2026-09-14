# Native Windows revalidation — Modules 4–5 and Lab 5

## Current disposition — validation paused

David directed finalization of Modules 4–5 without another Windows repair/retest
round. Do not execute this handoff again without a new explicit request. The
remaining instructions are the preserved historical assignment, not a standing
order. See [the final report disposition](../references/SOURCE-NOTES.md#final-native-report-and-implementation-disposition).

The run at `324b5f73d9e5011fff9699a84806d659ea555bc1` passed 97/101 tests,
including all nine EOL tests and the archive contract tests. Four symlink-setup
permission failures remain. Its candidate script invoked the step-6 helper from
the course root; the CRLF edit and dependent lab steps were not reached. Preserve
that adapter and the new `3ci-directive-lab05-5EsMke/repo` attempt. No further
adapter repair, host change, or replay is part of this finalization.

Lab 5's published executable path remains macOS/zsh. Windows is incomplete and
is not learner-ready; pausing validation does not turn missing evidence into a
pass or complete the PR's merge/lifecycle steps.

## Historical revalidation assignment

You are already inside Windows, and the project is already cloned. Work from the existing checkout in native PowerShell 7.4+. Do not use WSL or Git Bash for this validation.

## Assignment and authority

Revalidate the portability fixes for private repository `3Ci-Consulting/directive-training`, [PR #17](https://github.com/3Ci-Consulting/directive-training/pull/17), branch `codex/modules-4-5-implementation`.

**Do not start until the operator supplies the new, published, full 40-character line-ending-fix commit SHA.** Use the SHA from the maintainer's publication handoff. The latest Windows report tested `e881f016145405c4617d0884889bf93b7c952e23`; that revision does not contain this line-ending fix. Do not substitute it, master, or an unspecified “latest.”

The latest report validates the archive fix: both real archives and every new archive contract test passed. Its 92-test suite had 88 passes and four symlink-setup `EPERM` failures. The real lab passed after a CRLF-edit recovery; the complete candidate script was assembled afterward and parsed, not executed end-to-end. This run must prove the new deterministic source line endings with a CRLF edit and the exact unchanged `git diff --check`, retaining all native evidence.

Preserve the previous reports, harnesses, logs, and attempts: `3ci-directive-lab05-j1OQK6/repo`, `3ci-directive-lab05-XOvLwJ/repo`, and `3ci-directive-lab05-sEjlSl/repo`. Also preserve the archived `3ci-directive-lab05-1Hg1gf` and `3ci-directive-lab05-adG4tz` parents and the `modules45-windows-revalidation-aee8317d082248b185c1a842e67de642` evidence bundle. Do not reuse, repair, or archive any prior attempt with the new helper. This run needs fresh attempts created by the new checkout's original fixture.

## Authority and prerequisites

Start with the existing checkout's `README.md`, `AGENTS.md`, project definition, and local USER.md. The normal Windows shared preference path is `%APPDATA%\deft\USER.md`; never copy another host's USER.md. The active Modules 4–5 scope may be absent at the old checkout revision: read it **after** selecting the target commit, not as a prerequisite to fetching that commit.

**Bootstrap is explicitly authorized.** `.deft/core` is intentionally gitignored, so its absence in an existing clone is expected and is not a reason to abandon this run. While it is absent, remain in the README/doctor recovery path: perform only the bounded Git target selection in step 1 and the pinned payload restoration in step 2. Defer loading missing framework skills and running product checks until restoration succeeds. A prior doctor failure naming the missing payload is recovery evidence, not a new approval requirement for this authorized route.

Authorized: inspect and select the exact revision in a clean existing checkout; emit the installed, pinned CLI's public headless manifest outside the checkout; use the supplied helper to restore **only the absent `.deft/core` payload**; run unchanged tests; create an out-of-tree evidence bundle and PowerShell adapter; perform the lab's bounded disposable mutations. This is framework recovery, not a learner exercise in the course. Ordinary executing `init`/`update` is not the selected route: those commands can rewrite or stage tracked project files. The documented `init --headless` command below is allowed because it only emits the external manifest. Do not apply the manifest's root `AGENTS.md`, `package.json`, or xBRIEF scaffold entries.

Product/test/gate fixes, tracked course edits, commits, pushes, PR edits/comments, merges, lifecycle closeout, upstream issues, publishing, and deployment remain unauthorized. Greptile is disabled. Do not disable hooks or gates; if an actual runtime gate rejects an authorized bootstrap command, retain its exact error rather than inventing a bypass.

**The full-suite cleanup route is authorized for this revalidation.** Run the unchanged contract tests with their normal recursive cleanup of only the `modules45-contract-test-*` temporary fixtures they create in this run. Do not ask for that same authorization again. This does not authorize deleting previous test roots, lab attempts, reports, an existing framework deposit, or unrelated files. Do not rewrite cleanup or assertions. The restoration helper does not delete anything; retain incomplete recovery output if it fails.

Record current Windows edition/build, PowerShell, Node, npm, Git, process architecture, elevation, and file/directory symlink capability. Use the environment as configured; do not automatically elevate, enable Developer Mode, change execution policy, change Git EOL settings, install a different runtime, or modify global configuration.

Runtime comparisons are distinct: the published macOS proof used Node **24.18.0**; the previous handoff requested **24.20.0**; the previous Windows run actually used **26.8.1** with npm **11.19.0**. Report the current versions and any mismatch, not an assumed match.

If `.deft-directive-disable` is present, stop under its restart contract; this handoff does not authorize removing it. Before Git or lab commands, inspect inherited Git-redirection variable **names**, case-insensitively. If present, stop and request a clean terminal; never print values or an environment dump. Verify Node's canonical OS temporary root is outside every Git repository. Keep evidence outside the course checkout.

## 1. Bind the exact branch, PR, and commit

At the existing course root, first verify that `origin` identifies `3Ci-Consulting/directive-training` without exposing embedded credentials. Inspect `git status --short`; if it is not empty, preserve changes and stop for direction. No stash, reset, clean, force checkout, or new clone.

The following block requires the operator's new SHA. Record every native exit immediately; PowerShell's `$ErrorActionPreference` alone does not reliably stop on nonzero native exits.

```powershell
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false
$ExpectedCommit = '<operator-supplied published line-ending-fix SHA>'
$OldCommit = 'e881f016145405c4617d0884889bf93b7c952e23'
$Branch = 'codex/modules-4-5-implementation'
if ($ExpectedCommit -cnotmatch '^[0-9a-f]{40}$' -or $ExpectedCommit -eq $OldCommit) {
    throw 'BLOCKED: a new published full line-ending-fix SHA is required.'
}

git fetch origin "refs/heads/$Branch"
if ($LASTEXITCODE -ne 0) { throw 'Branch fetch failed.' }
$FetchedBranch = git rev-parse FETCH_HEAD
if ($LASTEXITCODE -ne 0) { throw 'Cannot resolve fetched branch.' }
git fetch origin 'refs/pull/17/head'
if ($LASTEXITCODE -ne 0) { throw 'PR head fetch failed.' }
$FetchedPr = git rev-parse FETCH_HEAD
if ($LASTEXITCODE -ne 0) { throw 'Cannot resolve fetched PR head.' }
if ($FetchedBranch.Trim() -ne $ExpectedCommit -or $FetchedPr.Trim() -ne $ExpectedCommit) {
    throw 'BLOCKED: branch, PR head, and supplied SHA do not match. Request a reconciled target.'
}

git switch --detach $ExpectedCommit
if ($LASTEXITCODE -ne 0) { throw 'Exact checkout failed.' }
$ActualCommit = git rev-parse HEAD
if ($LASTEXITCODE -ne 0 -or $ActualCommit.Trim() -ne $ExpectedCommit) {
    throw 'Wrong tested revision.'
}
$CourseStatus = git status --porcelain
if ($LASTEXITCODE -ne 0 -or $CourseStatus) { throw 'Checkout must be clean.' }
```

Record the supplied SHA, fetched branch SHA, fetched PR SHA, and actual HEAD in the report. Confirm the restoration helper/test, `scripts/projection-lab-eol.test.mjs`, both earlier portability regression files, and the Windows shim reference fixture exist in the committed tree. If absent, stop; do not recreate them from this handoff or copy local/uncommitted fixes across.

Read the target revision's `AGENTS.md`, project definition, and active Modules 4–5 scope now. An absent payload still routes to step 2, not to a product-test stop. Preserve the clean Git state throughout recovery.

## 2. Restore the pinned framework without changing tracked files

Skip manifest restoration if `.deft/core` already exists and passes the doctor check below. The latest Windows report retained the earlier restored payload successfully. If it exists but is broken, do not overwrite or remove it: report that distinct condition. The supplied helper handles only the earlier **absent** `.deft/core` case.

Use the already installed npm CLI from this Windows host. Resolve and verify its actual CLI/core/content/types graph; the top-level CLI version alone is insufficient because its dependencies use ranges. This phase needs no npm install or global update.

```powershell
$CourseRoot = (Get-Location).ProviderPath
$NodePath = (Get-Command node.exe -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
$NpmPath = (Get-Command npm.cmd -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
$GlobalNpmRoot = & $NpmPath root --global
if ($LASTEXITCODE -ne 0) { throw 'Cannot resolve the installed npm root.' }
$CliPackageRoot = Join-Path $GlobalNpmRoot.Trim() '@deftai/directive'
$DirectiveBin = Join-Path $CliPackageRoot 'dist/bin.js'

$PinProbe = @'
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const cliFile = path.join(process.argv[1], 'package.json');
function dependency(from, name) {
  for (const base of createRequire(from).resolve.paths(name) || []) {
    const file = path.join(base, name, 'package.json');
    if (fs.existsSync(file)) return file;
  }
  throw new Error('Missing installed package: ' + name);
}
const coreFile = dependency(cliFile, '@deftai/directive-core');
for (const [name, file] of [
  ['@deftai/directive', cliFile],
  ['@deftai/directive-core', coreFile],
  ['@deftai/directive-content', dependency(coreFile, '@deftai/directive-content')],
  ['@deftai/directive-types', dependency(coreFile, '@deftai/directive-types')],
]) {
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(pkg.name, name);
  assert.equal(pkg.version, '0.112.0', name + ' must be 0.112.0');
  console.log(name + ': ' + pkg.version);
}
const cli = JSON.parse(fs.readFileSync(cliFile, 'utf8'));
assert.equal(cli.bin.directive, './dist/bin.js');
'@
& $NodePath -e $PinProbe $CliPackageRoot
if ($LASTEXITCODE -ne 0) { throw 'Installed graph is not the required pin; do not bootstrap with it.' }
```

Use the verified installed CLI only for this framework recovery. It does not replace the lab's separately installed and guarded local CLI.

Create a unique evidence directory outside the course. The example uses the previously checked OS-temp root; if this session already has a new out-of-tree evidence directory, reuse that exact path instead.

```powershell
$EvidenceRoot = Join-Path ([IO.Path]::GetTempPath()) ('modules45-windows-revalidation-' + [guid]::NewGuid().ToString('N'))
[void][IO.Directory]::CreateDirectory($EvidenceRoot)
$ManifestPath = Join-Path $EvidenceRoot 'framework-0.112.0-manifest.json'

$CoreEntry = Get-Item -LiteralPath (Join-Path $CourseRoot '.deft/core') -Force -ErrorAction SilentlyContinue
if ($null -eq $CoreEntry) {
    & $NodePath $DirectiveBin init --headless --output $ManifestPath
    if ($LASTEXITCODE -ne 0) { throw 'Headless manifest emission failed.' }
    & $NodePath scripts/restore-validation-deposit.mjs $ManifestPath
    if ($LASTEXITCODE -ne 0) { throw 'Payload restoration failed; retain manifest and partial output.' }
} else {
    Write-Output 'Existing payload retained; checking it without restoration.'
}

$AfterBootstrap = git status --porcelain
if ($LASTEXITCODE -ne 0 -or $AfterBootstrap) { throw 'Recovery changed Git state; preserve the diff and stop.' }
& $NodePath $DirectiveBin doctor --full --project-root $CourseRoot
if ($LASTEXITCODE -ne 0) { throw 'Doctor fails; retain the existing payload and record the specific remaining checks.' }
```

The helper consumes the **public headless manifest** and restores its canonical payload; it does not substitute an alternate directory as the source of framework rules. It checks the pin, Git state, destination and manifest paths, required entrypoints, encodings, and duplicate paths before writing. It refuses an existing destination and preserves partial output on an I/O failure. Keep the emitted manifest and helper output as evidence.

Require the former hard failures—`quick-start-resolves`, `skill-paths-resolve`, `manifest-agreement`, and `install-path-consistency`—to pass. Record doctor warnings without treating them as either hard failures or permission to upgrade. Confirm `main.md`, `SKILL.md`, `QUICK-START.md`, `VERSION`, and the pinned skill paths are now readable under `.deft/core`.

Re-read the restored main instructions and the target's project instructions, resolving local USER.md in place; use the validation/read-only session route. Do not run implementation rituals that update the global CLI merely to execute the built-in tests. Honor an explicit runtime `Restart required` message if emitted; absence of `.deft/core` **before successful recovery** does not by itself require another blocked handoff or another bootstrap approval.

## 3. Check symlink capability, then revalidate the tooling

**Full safety validation requires both file and directory symlink creation through
the same Node API used by the tests.** The prior host lacked that capability.
Successful junction tests or passing coverage percentages do not replace those
assertions.

Windows supports both kinds of symlink. The usual operator-provided routes are
Developer Mode for an unelevated session, or an approved elevated session whose
token has the create-symbolic-link right. An administrator account without an
elevated process is not the same thing. Node 26.8.1's bundled libuv requests the
unprivileged-creation flag; these are real Windows symlinks, not `.lnk` shortcuts
or directory-only junctions. See [Microsoft's symlink guidance](https://blogs.windows.com/windowsdeveloper/2016/12/02/symlinks-windows-10/)
and the [Node 26.8.1 implementation](https://github.com/nodejs/node/blob/v26.8.1/deps/uv/src/win/fs.c).

The operator must provide any changed host posture separately; this assignment
does not authorize elevation or enabling Developer Mode. Run the probe in the
**same process context** that will run the tests. A passing probe in another
terminal does not establish an agent's capability. If either probe still fails,
expect incomplete safety validation; do not repeat identical runs seeking green.

Run this probe from the course root after creating `$EvidenceRoot`:

```powershell
$LinkProbeRoot = Join-Path $EvidenceRoot ('symlink-capability-' + [guid]::NewGuid().ToString('N'))
$LinkProbe = @'
const fs = require('node:fs');
const path = require('node:path');
const root = process.argv[1];
fs.mkdirSync(root);
fs.writeFileSync(path.join(root, 'file-target'), 'capability probe\n', { flag: 'wx' });
fs.mkdirSync(path.join(root, 'dir-target'));
for (const type of ['file', 'dir']) {
  try {
    fs.symlinkSync(path.join(root, type + '-target'), path.join(root, type + '-link'), type);
    console.log(type + ' symlink: PASS');
  } catch (error) {
    console.error(type + ' symlink: FAIL ' + error.code + ': ' + error.message);
    process.exitCode = 1;
  }
}
'@
& $NodePath -e $LinkProbe $LinkProbeRoot
$LinkProbeExit = $LASTEXITCODE
if ($LinkProbeExit -ne 0) {
    Write-Warning 'Full safety validation needs an operator-approved symlink-capable session. Keep running the unchanged tests and independent guarded Lab 5 replay; report the capability gap.'
}
```

Retain the probe files. Do not elevate, change Developer Mode or policy, replace
file links with junctions, or skip/alter tests to obtain green output. If this
host still lacks capability, run the checks below as written, distinguish setup
failures from executed assertions, and report the required operator action:
provide a session where both probes pass for a complete safety rerun. This does
not block the independent real-install/archive path when its own guards pass.

Run these commands separately from the course root and capture stdout, stderr, and `$LASTEXITCODE` immediately. They use Node built-ins; no course dependency installation is needed.

```powershell
node scripts/verify-cold-start-readme.mjs
node scripts/verify-modules-2-3.mjs
node scripts/verify-modules-4-5.mjs
node --test scripts/verify-symlink-capability.test.mjs
node --test scripts/linked-path-suite-boundary.test.mjs
node --test scripts/verify-text-portability.test.mjs
node --test scripts/windows-shim.test.mjs
node --test scripts/projection-lab.test.mjs
node --test scripts/projection-lab-eol.test.mjs
node --test scripts/restore-validation-deposit.test.mjs
```

Run the combined suite and coverage as separate checks. Their normal new-fixture cleanup is authorized above:

```powershell
node --test scripts/verify-symlink-capability.test.mjs scripts/linked-path-suite-boundary.test.mjs scripts/projection-lab.test.mjs scripts/projection-lab-eol.test.mjs scripts/verify-modules-4-5.test.mjs scripts/windows-shim.test.mjs scripts/verify-text-portability.test.mjs scripts/restore-validation-deposit.test.mjs
node --test --experimental-test-coverage '--test-coverage-include=labs/fixtures/05-projection-drift-recovery/*.mjs' '--test-coverage-include=scripts/verify-modules-4-5.mjs' '--test-coverage-include=scripts/restore-validation-deposit.mjs' --test-coverage-lines=90 --test-coverage-branches=90 --test-coverage-functions=90 scripts/verify-symlink-capability.test.mjs scripts/linked-path-suite-boundary.test.mjs scripts/projection-lab.test.mjs scripts/projection-lab-eol.test.mjs scripts/verify-modules-4-5.test.mjs scripts/windows-shim.test.mjs scripts/verify-text-portability.test.mjs scripts/restore-validation-deposit.test.mjs
```

Those commands are the privilege-free training and portability surface. After
the file and directory probes above both pass in the same approved process,
run the real linked-path attack fixtures separately:

```powershell
npm run test:linked-path-safety
```

Do not substitute the ordinary green suite for this full-safety command.

Report actual totals; the previous 46-test total is obsolete. Report coverage for its explicitly included files, not as whole-repository coverage. Record aggregate and per-file lines/branches/functions, command exit, every failure, and every skip.

The text tests must accept LF and CRLF while still rejecting invalid content. Do not normalize the checkout or change `core.autocrlf` to make them pass. Windows fake package graphs should use ordinary npm command shims; privilege-dependent symlink-rejection tests must execute through `test:linked-path-safety`.

If file/directory symlink creation fails with a privilege error, mark only the
linked-path safety validation incomplete and retain the preflight failure.
Continue the privilege-free training and portability commands, but do not skip
the attack fixtures into a green full-safety result or claim their assertions
ran. A separate real-install attempt may proceed only if its own prerequisites
and guards pass.

## 4. Replay the real installed Lab 5

Read the two module documents, `labs/05-projection-drift-recovery.md`, its explained solution, and both fixture helpers in full. Check Module 4's command-free artifact exercise and solution. Module 5's walkthrough is preview-only: do not generate a MAP before Lab 5 Task 1.

The published learner shell is zsh. Keep the exact PowerShell translation outside the course and retain it as evidence, labeled **candidate adaptation**. Prior adapters may be inspected if still available, but their paths are not attached script contents, and the latest complete script was only assembled and parsed after the individual commands ran. Build and syntax-check the complete candidate **before** the new replay, then execute that same file once. Retain its pre-run SHA-256, complete contents, per-command logs, and final SHA-256. Do not substitute a reconstructed script or syntax-only pass for executed end-to-end evidence, or trust old helper paths embedded in prior adapters.

Create a new attempt from the fetched original fixture:

```powershell
$FixtureHelper = Join-Path $CourseRoot 'labs/fixtures/05-projection-drift-recovery/projection-lab.mjs'
$CompletedLabRoot = & $NodePath $FixtureHelper create
if ($LASTEXITCODE -ne 0) { throw 'Create failed; do not use its output as a lab root.' }
$CompletedLabRoot = $CompletedLabRoot.Trim()
```

Check exit 0 before using the returned path. Enter only that exact root and run `node projection-lab.mjs guard`. Keep the course and fixture paths separately for reset. Every manual lab mutation must remain in the exact unique OS-temp, no-remote repository; run the guard immediately before each mutation. A failed guard stops dependent steps.

### Isolated npm installation

Translate the published `env -i` install faithfully, not as an unrestricted `npm install`:

- Resolve the existing native PowerShell and `npm.cmd` paths. Use an out-of-tree runner via `System.Diagnostics.ProcessStartInfo`, `UseShellExecute = false`, and individual `ArgumentList` entries. Launch PowerShell with `-NoProfile -NonInteractive -File`, not a constructed multiline `-Command` string.
- Clear the **child** environment only. Supply the small Windows runtime allowlist needed by this host: `SystemRoot`, `WINDIR`, `ComSpec`, `PATH`, `PATHEXT`, `TEMP`, `TMP`, `USERPROFILE`, `APPDATA`, and `LOCALAPPDATA`. Do not inherit npm configuration/authentication, proxy variables, `GIT_*`, or `NODE_OPTIONS`. Never clear or mutate the parent environment.
- Use the exact guarded lab as the child's working directory. The runner invokes the resolved `npm.cmd` with the literal `install` subcommand (`& $NpmPath install ...`), explicit `--userconfig <lab>\.npmrc`, a newly created empty out-of-tree `--globalconfig` file, `--cache <lab>\.npm-cache`, `--registry https://registry.npmjs.org/`, and `--ignore-scripts --no-audit --no-fund`.
- Capture npm's exit immediately and return it unchanged. Retain the adapter, empty config, and sanitized output. Do not use `/dev/null`, credentials, a private registry, global config changes, or an install in the course. If isolation is unavailable, stop this path.

After a successful real install, run the unchanged `guard` and `verify-pin`. All four installed packages—CLI, core, content, types—must be **0.112.0**. Record the real `.bin/directive`, `.bin/directive.cmd`, and `.bin/directive.ps1` entry types, contents, and SHA-256 hashes in private evidence. Record raw hashes and hashes after CRLF-to-LF normalization separately.

Only after those gates pass, invoke the explicit local **`.\node_modules\.bin\directive.cmd`**, starting with `--version`. The guard now checks complete recognized npm shim programs and their exact local target; an unfamiliar npm format is a failure to report. Never copy the repository's golden test shims into an installation, replace shims with symlinks, substitute a global CLI, invoke `dist/bin.js` directly, or weaken a guard.

### Required checkpoint sequence

Follow the published lab in order, translating shell syntax only. Capture each expected/actual exit and its evidence:

1. Guard, pin/version, no remote, nine-file allowlisted checkpoint (including `.gitattributes`), fictional commit identity, `lab-05-start`, and clean status. Record `git check-attr text eol -- xbrief/PROJECT-DEFINITION.xbrief.json` and `git ls-files --eol -- xbrief/PROJECT-DEFINITION.xbrief.json`; require `text: set`, `eol: lf`, and an LF index. Keep the source's initial bytes and effective attributes in private evidence. Do not pre-render a MAP.
2. Explicit local CLI top help and command registry return 0. Absent-MAP freshness returns 0 **and** an independent existence check confirms the MAP is absent.
3. Guard, then renderer `codebase:map --help` creates the MAP; freshness help returns 0. Record the generated banner, source pointer, `stop-code` row, original purpose, `src/*.js`, and count `1`. These command-specific help probes have side effects.
4. Guard, supplied `inject-drift`, then freshness returns exactly 1 with a stale-MAP diagnostic. Source diff against `lab-05-start` returns 0. Preserve that failing evidence before recovery.
5. Guard, rerender, freshness 0; the simulated note disappears and the original source purpose remains.
6. Guard, edit only `plan.architecture.codeStructure.modules[0].purpose` to `Normalize and validate fictional stop codes.` Use the exact CRLF edit block below to exercise the reported failure. Save valid UTF-8 JSON without BOM; do not alter other fields. Preserve pre/post byte evidence and the purpose-only diff. Do not edit `.gitattributes`, normalize the course checkout, or change Git whitespace/EOL settings.
7. Freshness is exactly 1 before regeneration. Guard, regenerate, freshness 0, helper `verify-result` 0. An arbitrary nonzero exit is not evidence of the intended stale condition.
8. Run all five final commands below. The MAP must exist and show its source, new purpose, unchanged glob, and count `1`; only the permitted JSON source differs from the checkpoint.
9. Fresh reset uses `$FixtureHelper create` to create a **different** root. Store that command's exact successful output as `$ResetLabRoot`; do not overwrite `$CompletedLabRoot`. The reset guards successfully, has no MAP and no remote, and preserves the completed attempt/evidence. If the first attempt passed, a second full install is unnecessary for reset proof.
10. Archive reset, then completed attempt, using the explicit outside-directory commands below. Both the caller and child must be outside each attempt parent. This is the corrected workflow, not a workaround for the old command. The helper rechecks the exact target before moving it. If a guard or move fails, retain the exact error and source/destination state; do not force, copy-and-delete, or reuse an old attempt.

### Step 6: purpose-only edit with CRLF

Insert this block at step 6 in the complete candidate, not after final acceptance.
It changes only the new disposable source and deliberately exercises CRLF output.
The fixture's source attributes must normalize the Git representation; the
whitespace gate itself stays unchanged. A fresh attempt starts with LF source.

```powershell
& $NodePath projection-lab.mjs guard
if ($LASTEXITCODE -ne 0) { throw 'Source-edit guard failed.' }
$EditPurpose = @'
const assert = require('node:assert/strict');
const fs = require('node:fs');
const file = 'xbrief/PROJECT-DEFINITION.xbrief.json';
const before = fs.readFileSync(file, 'utf8');
assert.ok(!before.startsWith('\ufeff'), 'Unexpected BOM');
const oldLine = '"purpose": "Normalize fictional stop codes."';
const newLine = '"purpose": "Normalize and validate fictional stop codes."';
assert.equal(before.split(oldLine).length, 2, 'Expected one original purpose');
const edited = before.replace(/\r\n/g, '\n').replace(oldLine, newLine);
const expected = JSON.parse(before);
expected.plan.architecture.codeStructure.modules[0].purpose = 'Normalize and validate fictional stop codes.';
assert.deepEqual(JSON.parse(edited), expected);
fs.writeFileSync(file, edited.replace(/\n/g, '\r\n'), 'utf8');
console.log('Purpose-only edit saved as UTF-8 without BOM, CRLF');
'@
& $NodePath -e $EditPurpose
if ($LASTEXITCODE -ne 0) { throw 'Purpose edit failed.' }
git diff --numstat -- xbrief/PROJECT-DEFINITION.xbrief.json
if ($LASTEXITCODE -ne 0) { throw 'Cannot capture source diff.' }
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'CRLF edit still fails the unchanged whitespace check; retain evidence and stop dependent steps.' }
```

Require a one-line addition and deletion, a purpose-only semantic diff, and exit 0
from the unchanged whitespace check. Then continue steps 7–10. LF/CRLF source-copy,
Git-configuration, and genuine trailing-whitespace negatives are covered by the
committed tests; do not reproduce them by modifying the course or old attempts.

Five final commands, each run separately from the disposable root:

```powershell
node projection-lab.mjs guard
node projection-lab.mjs verify-pin
& .\node_modules\.bin\directive.cmd verify:codebase-map-fresh --project-root .
node projection-lab.mjs verify-result
git diff --check
```

All five require exit 0. PowerShell must record `$LASTEXITCODE` immediately after each command. Use `Test-Path -LiteralPath` for independent existence assertions and check their boolean results; do not reuse a stale native exit code for PowerShell cmdlets.

### Archive both new attempts from outside

Run this only after steps 1–9, with `$CompletedLabRoot` and `$ResetLabRoot` set to
the two recorded create outputs from **this** run. Finish the lab commands and
close any other process you launched with a working directory inside these
attempts. Do not terminate unrelated processes or modify old evidence. These
commands use the original course fixture and mutate only the guarded target:

```powershell
Set-Location -LiteralPath $CourseRoot
foreach ($ArchiveTarget in @($ResetLabRoot, $CompletedLabRoot)) {
    if (-not [IO.Path]::IsPathFullyQualified($ArchiveTarget)) {
        throw 'Archive target must be the exact absolute create output.'
    }
    $ArchivedParent = & $NodePath $FixtureHelper archive $ArchiveTarget
    $ArchiveExit = $LASTEXITCODE
    if ($ArchiveExit -ne 0) {
        throw "Archive failed ($ArchiveExit); retain this attempt and report dependent archive checks as NOT RUN."
    }
    $ArchivedParent = $ArchivedParent.Trim()
    if ((Test-Path -LiteralPath $ArchiveTarget) -or
        -not (Test-Path -LiteralPath (Join-Path $ArchivedParent 'repo/package.json')) -or
        -not (Test-Path -LiteralPath (Join-Path $ArchivedParent 'evidence.md'))) {
        throw 'Archive preservation checks failed.'
    }
    if ($ArchiveTarget -eq $CompletedLabRoot -and
        -not (Test-Path -LiteralPath (Join-Path $ArchivedParent 'repo/.planning/codebase/MAP.md'))) {
        throw 'Completed MAP is missing from the archive.'
    }
    Write-Output "Archived $ArchiveTarget to $ArchivedParent"
}
```

Record both source and destination paths, exits, and preservation assertions. If
the first archive fails, the block stops; mark the second **NOT RUN**, and retain
both attempts. Unit tests separately exercise safe refusal from inside a target;
do not recreate the old inside-directory archive route as the positive workflow.

## 5. Return evidence, not repository changes

Return one Markdown report with sanitized logs and the exact candidate PowerShell adapter, all outside the checkout. Include:

- Exact SHA binding, date, complete runtime/capability record, Git EOL configuration and observed checkout EOLs, without environment values or credentials.
- Framework recovery: installed four-package pin, external manifest path, restored payload count, passing doctor integrity checks, and unchanged tracked/staged Git state. Distinguish recovery evidence from Lab 5 test evidence.
- A comparison table for framework recovery, CRLF content checks, source-edit EOL behavior, real npm shims, archive moves, and symlink capability from the `e881f0` report: fixed / still failing / blocked / not retested, with direct evidence.
- Per-command expected/actual exits and pass/fail/blocked/not-run status; actual test counts, skips, permission failures, and coverage scope/results.
- Earliest real-lab failure, minimal exact reproduction, and supported source file/line. Mark all dependent unreached steps **NOT RUN**, not passed or independently failed.
- For reached steps: installed package graph and launcher identities; checkpoint file list; both stale/recovery pairs; purpose-only diff and MAP excerpt; five final exits; reset preservation; archive or retained paths.
- Final course HEAD and `git status --short` / diff proving no authored source changes, and confirmation the previous evidence/attempts remain intact.

Use separate verdicts for **tooling/safety tests**, **real installed Lab 5**, and **published Windows learner instructions**. Overall native validation remains incomplete if any required checkpoint or safety test fails, is skipped, is blocked, or is not reached. A passing out-of-tree candidate does not publish a Windows learner path or authorize changing the course's support claim.

Stop after one run and at most one exact reproduction of each distinct failure, or 60 minutes, whichever comes first. Preserve all evidence and request new authority before fixes, environment changes, or further investigation.
