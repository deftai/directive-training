# Lab 10 — Implement One Bounded Greeting

## Lab record

| Field | Value |
| --- | --- |
| Stable ID | `lab-10-implementation-golden-path` |
| Supports | O10.5 readiness, O10.6 red-green, O10.7 bounded scope, O10.8 paired evidence, O10.9 recovery |
| Status | Learner-ready on macOS/zsh; Linux/bash and Windows/PowerShell remain candidates |
| Last verified | 2026-09-17 |
| Directive baseline | CLI/core/content/types `0.119.5`; [source baseline](../references/SOURCE-BASELINE.md) |
| Duration | 40–45 minutes, including install, implementation, evidence, and cleanup |
| Platforms verified | macOS/zsh local baseline-upgrade suite; go-task 3.50.0 |
| Candidate platforms | Linux/bash and Windows/PowerShell are not verified on 0.119.5 |

The helper is course tooling, not a new Directive command.

The helper retains a Windows command path, but its prior walkthrough used the old
baseline. It remains a candidate until the complete 0.119.5 implementation route runs natively.

## Goal and done condition

Implement one named-and-fallback greeting only after current readiness passes.

**Done:** `readiness.json` says `READY`; the focused check changes from the retained
expected failure to pass; only `src/greeting.mjs` differs; named and fallback CLI output is
correct; `git diff --check` passes; and `implementation.json` says `PASS`.

## Fictional scenario

Northstar Greeting is a fictional local CLI. Its active story asks for `Hello, Ada!` when a
name is supplied, `Hello, teammate!` for missing or blank input, and a clear error when an
input is not a string. The supplied implementation always returns `Hello!`.

The work is deliberately one-file. The exercise measures implementation order and evidence,
not design novelty.

## Environment and starting-state check

Use a dedicated zsh terminal at the root of this curriculum checkout. The helper creates a
unique OS-temporary repository with no remote. It does not initialize or mutate this course
repository.

```sh
set -eu
course_root="$(pwd -P)"
helper="$course_root/labs/fixtures/10-implementation-golden-path/implementation-lab.mjs"
test -f "$helper"
node --version
npm --version
git --version
task --version
uv --version
lab_root="$(node "$helper" create)"
node "$helper" guard "$lab_root"
test "$(git -C "$lab_root" branch --show-current)" = "training/module-10"
test -z "$(git -C "$lab_root" remote)"
```

The path must be canonical and look like
`<OS temp>/3ci-directive-lab10-<unique>/repo`. It must not be this curriculum checkout or
a business repository.

Install the exact pinned package graph and create the named local checkpoint:

```sh
node "$helper" install "$lab_root"
node "$helper" guard "$lab_root"
node "$lab_root/node_modules/.bin/directive" --version
git -C "$lab_root" status --short
```

**Pass:** the helper reports Directive 0.119.5, the explicit local CLI reports engine
0.119.5, and status is empty. The fixture pins CLI/core/content/types exactly.

The deposited Task surface belongs to that exact local install.
Do not substitute a newer global executable.

## Safety boundary

- Work only in the exact guarded temporary attempt.
- Only `src/greeting.mjs` is mutable after readiness. The helper, tests,
  manifest, active scope, CLI wrapper, Git metadata, and evidence contract stay unchanged.
- Keep branch `training/module-10`, exact 0.119.5 pins, one active/running
  story, and an empty remote list.
- Do not add a remote, use credentials, push, open a pull request, merge,
  deploy, publish, release, or copy business/client data.
- A guard refusal is a stop. Preserve the attempt and use reset; do not
  modify the helper or gate.

The evidence directory is beside the repository, not inside it. The helper never prints Git
credential override values and rejects path traversal, symlinked sensitive paths, Git
redirection, and a repository nested under another Git root.

## Starting checkpoint

The install verb creates a local commit named `chore: checkpoint fictional implementation
lab`. Confirm it without changing state:

```sh
node "$helper" guard "$lab_root"
git -C "$lab_root" log -1 --format='%s'
git -C "$lab_root" status --short
git -C "$lab_root" remote
```

Expected evidence: the exact checkpoint subject, empty status, and empty remote output.
Do not use `git add --all`; the helper already staged its explicit fictional fixture list.

## Tasks

### Task 1 — Establish readiness and retain the red test

From the curriculum checkout, run:

```sh
node "$helper" readiness "$lab_root"
```

This is the `implementation-lab.mjs readiness` operation. The helper guards the root, runs
`task deft:session:start`, `task deft:verify:session-ritual`,
`directive verify:story-ready`, `task deft:xbrief:preflight`, and the supplied focused test
in order.

**Checkpoint:** output is `"READY"`. Inspect the retained record:

```sh
node -e 'const e=require(process.argv[1]); console.log(e.finalStatus,e.steps.focusedTest.exitCode)' "$(dirname "$lab_root")/evidence/readiness.json"
```

Expected output is `READY 1`. A failing focused check is expected here. Do not edit before
this checkpoint.

### Task 2 — Make the smallest coherent product change

Open only `$lab_root/src/greeting.mjs`. Implement behavior inferred from the active story and
supplied test. You need a function that:

1. rejects a supplied non-string with `name must be a string`;
2. trims a supplied string;
3. substitutes `teammate` when the value is missing or blank; and
4. returns `Hello, <recipient>!`.

Keep the exported function and implement only what the test requires.
Do not edit the test to agree with the old result.

Checkpoint:

```sh
git -C "$lab_root" status --short
git -C "$lab_root" diff --name-only
```

Both views must name only `src/greeting.mjs`.

### Task 3 — Prove behavior and scope together

Run the helper's final verification:

```sh
node "$helper" verify "$lab_root"
```

This command runs the focused test, named CLI, fallback CLI, and diff check. It verifies that
the earlier readiness evidence belongs to the checkpoint and that the current patch contains
only the allowlisted file.

**Checkpoint:** output is `"PASS"` and
`$(dirname "$lab_root")/evidence/implementation.json` exists.

## Checkpoints

| Checkpoint | Observable state | How to verify | If it fails |
| --- | --- | --- | --- |
| Created | Unique guarded no-remote root on `training/module-10` | `implementation-lab.mjs create` then `guard` | Archive if safe, then create again |
| Installed | Exact graph and clean named checkpoint | `implementation-lab.mjs install "$lab_root"` | Preserve output and reset |
| Ready | Start gates pass and focused test exits `1` | `implementation-lab.mjs readiness "$lab_root"` | Preserve the stopped attempt; do not mutate |
| Implemented | Only `src/greeting.mjs` differs | `git diff --name-only` | Reset if any other path changed |
| Verified | Both evidence types pass | `implementation-lab.mjs verify "$lab_root"` | Diagnose the first failed boundary |

## Literal acceptance commands

Run these exact commands from the curriculum checkout after the edit:

```sh
node "$helper" guard "$lab_root"
npm --prefix "$lab_root" run test:focused
npm --prefix "$lab_root" run greet -- Ada
npm --prefix "$lab_root" run greet
git -C "$lab_root" diff --check
test "$(git -C "$lab_root" diff --name-only)" = "src/greeting.mjs"
node "$helper" verify "$lab_root"
```

| Command | Exit | Required signal | Outcome |
| --- | ---: | --- | --- |
| `guard` | 0 | No error | O10.5, O10.7 |
| `npm run test:focused` | 0 | Four test cases pass | O10.6, O10.8 |
| named `greet` | 0 | `Hello, Ada!` | O10.8 |
| fallback `greet` | 0 | `Hello, teammate!` | O10.8 |
| `git diff --check` | 0 | No output | O10.7, O10.8 |
| path comparison | 0 | Exact one-file equality | O10.7 |
| `verify` | 0 | `"PASS"` | O10.5–O10.9 |

Linux/bash and Windows/PowerShell remain candidate paths. The Windows/PowerShell acceptance
route appears below for native 0.119.5 revalidation.

## Evidence bundle

Keep only:

- lab stable ID, exact Directive baseline, OS, shell, and attempt date;
- `evidence/readiness.json`, including focused exit `1`;
- the narrow diff for `src/greeting.mjs`;
- `evidence/implementation.json`, including named/fallback behavior and final check exits;
- one sentence explaining why behavior and diff evidence are both necessary; and
- reset/archive status.

The two JSON files live in the attempt parent. Do not commit or upload them. Exclude tokens,
environment dumps, credentials, business code, client data, and unrelated repository state.

## Progressive hints

1. Keep readiness and implementation as two different checkpoints.
2. Read `test/greeting.test.mjs`; group its assertions into named, fallback, and invalid
   input behavior.
3. Validate type before calling `.trim()`. An optional string can then use a trimmed value or
   the fallback.
4. Final verification can fail even with green tests if another file differs.

## Expected failures and recovery

| Symptom | Cause | Safe recovery |
| --- | --- | --- |
| `readiness` reports a dirty checkpoint | A file changed before readiness | Preserve the evidence; `implementation-lab.mjs reset "$lab_root"` creates a new root. |
| The focused test exits `1` inside readiness | Intended behavior is absent | Continue only after `READY`; this failure is evidence, not a defect. |
| `verify` reports missing readiness | Final proof was attempted out of order | Preserve the attempt; reset and repeat readiness first. |
| `verify` reports another changed file | Work exceeded active scope | Do not widen the allowlist; preserve and reset. |
| Guard reports wrong branch, remote, pin, or immutable file | Safety identity drifted | Stop. Do not repair an uncertain attempt in place. |
| Install is partial | Exact local graph was not established | Preserve sanitized output; reset instead of using a global CLI. |

To create a fresh attempt while preserving the failed one:

```sh
new_lab_root="$(node "$helper" reset "$lab_root")"
node "$helper" guard "$new_lab_root"
```

This is the `implementation-lab.mjs reset` path. The original `lab_root` remains readable.

## Reset to start

Reset always means a fresh unique attempt:

```sh
new_lab_root="$(node "$helper" reset "$lab_root")"
test "$new_lab_root" != "$lab_root"
node "$helper" guard "$new_lab_root"
```

Install and run readiness in the new root. Never use a broad `git clean`, `git reset --hard`,
home-directory deletion, or workspace-root deletion as this lab's recovery.

## Cleanup

Leave the attempt parent before archiving. Pass one exact absolute root:

```sh
cd "$course_root"
archive_path="$(node "$helper" archive "$lab_root")"
test -d "$archive_path/repo"
```

This is the recoverable `implementation-lab.mjs archive` operation. Repeat separately for
each root you intentionally want to archive. Nothing is recursively deleted.

## Native Windows PowerShell 7.4+ route

Run this from the curriculum repository. After `readiness` reports `READY`, make
only the `src/greeting.mjs` edit described above, then continue with `verify`:

```powershell
$ErrorActionPreference = "Stop"
$CourseRoot = (Resolve-Path -LiteralPath .).Path
$Helper = Join-Path $CourseRoot "labs/fixtures/10-implementation-golden-path/implementation-lab.mjs"
$Launcher = Join-Path ([IO.Path]::GetTempPath()) ("3ci-lab10-launch-" + [guid]::NewGuid().ToString("N"))
[void](New-Item -ItemType Directory -Path $Launcher)
Set-Location -LiteralPath $Launcher
$LabRoot = ((& node $Helper create) | Out-String).Trim()
& node $Helper guard $LabRoot
& node $Helper install $LabRoot
& node $Helper readiness $LabRoot
if ($LASTEXITCODE -ne 0) { throw "Lab 10 readiness failed; do not edit product code." }
# Edit only (Join-Path $LabRoot "src/greeting.mjs") as specified in the implementation step.
& node $Helper verify $LabRoot
if ($LASTEXITCODE -ne 0) { throw "Lab 10 behavioral verification failed." }
$EvidenceRoot = Join-Path (Split-Path -Parent $LabRoot) "evidence"
foreach ($Name in "readiness.json", "implementation.json") {
  if (-not (Test-Path -LiteralPath (Join-Path $EvidenceRoot $Name) -PathType Leaf)) { throw "Missing $Name" }
}
$FreshRoot = ((& node $Helper reset $LabRoot) | Out-String).Trim()
& node $Helper guard $FreshRoot
Set-Location -LiteralPath $CourseRoot
$Archive = ((& node $Helper archive $LabRoot) | Out-String).Trim()
if (-not (Test-Path -LiteralPath (Join-Path $Archive "repo") -PathType Container)) { throw "Archive is incomplete." }
```

`readiness.json` must predate the one-file diff, and `implementation.json` must
record both named/fallback behavior plus the exact one-file status and diff.

## Explained solution

After a genuine first attempt, compare your work with the
[explained Lab 10 solution](../solutions/lab-10-implementation-golden-path.md). Preserve the
red evidence before reading it, then retry any unmet outcome in a new root.

## Done statement

“I established current readiness before mutation, retained the expected focused failure,
changed only `src/greeting.mjs`, produced behavioral and diff evidence, and recorded a safe
reset or archive state.”

- Lesson: [Module 10 — The Implementation Golden Path](../curriculum/modules/10-implementation-golden-path.md)
- Lab model: [Disposable lab environment](README.md)
- Sources: [Module 10 source validation](../references/SOURCE-NOTES.md#module-10-source-validation)
