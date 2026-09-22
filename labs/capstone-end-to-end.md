# Lab — End-to-End Solo Directive Capstone

## Lab record

| Field | Value |
| --- | --- |
| Stable ID | `lab-capstone-end-to-end` |
| Supports | `CAP.1`, `CAP.2`, `CAP.3`, `CAP.4` |
| Status | Learner-ready |
| Last verified | 2026-09-17 |
| Suggested first attempt | 45 minutes before opening the solution |
| Directive baseline | `@deftai/directive@0.119.5`; see the [source baseline](../references/SOURCE-BASELINE.md#capstone-end-to-end-validation) |
| Directive runtime | Node.js `22 or newer`; the verified local run used `24.20.0`; Node.js 20-compatible application source is a source-level design constraint, not a separate Node.js 20 execution claim |
| Fixture | [`fixtures/capstone-end-to-end`](fixtures/capstone-end-to-end/) |
| Platform evidence | Automated guarded fixture passed locally on macOS/zsh; Linux and Windows remain candidates pending native 0.119.5 evidence |

## Goal and done condition

Supervise one fictional work-items change from safe orientation through local
closeout. You are done only when all `CAP.1`–`CAP.4` evidence exists, closeout
proves the reviewed bytes were committed unchanged, the aggregate passes on
that commit, and your conclusion keeps ship, deployment, and UAT at
`not_started`. CAP.4 also requires a distinct reset root and separate
recoverable archives for the completed and reset attempt parents.

## Fictional scenario

Northstar needs immutable helpers to add, complete, and summarize fictional
work items. The supplied tests define the initial behavior. A deterministic
pre-PR probe later exposes a case-insensitive duplicate-title defect.

All data is invented. Package installation contacts the public npm registry;
after bootstrap, the evaluated lifecycle and review route needs no credential,
client information, production log, business source, remote repository,
deployment, instructor, Greptile, or other live reviewer.

## Environment and starting-state check

Use Node.js 22 or newer for the Directive proof. Record the exact runtime you
use. The current local macOS/zsh proof used Node.js `24.20.0`; that patch version
describes bounded evidence, not the Node.js learner requirement. Linux and Windows
remain candidates pending a native 0.119.5 replay.

Directive 0.119.5 imports `node:fs` `globSync`, which is unavailable before
Node.js 22. The complete Directive proof therefore requires Node.js 22 or
newer. The fictional application files remain Node.js
20-compatible as a source-level design constraint; no isolated Node.js 20 run
is claimed, and that design property does not make the full Directive lab a
Node.js 20 runtime path.

Start in the curriculum checkout root so the first command records its canonical
path. Then create a dedicated launcher and a separate private notes directory
directly under the operating-system temporary directory. Neither may already be
a Git repository, and the notes directory must remain outside both launcher
directories and both attempt parents. The helper does not assert or record
`process.version`, so the wrapper commands below must perform the Node major
version check before `create`.

### macOS and Linux

```sh
set -eu
export COURSE_ROOT="$(pwd -P)"
export CAPSTONE_HELPER="$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs"
test -f "$CAPSTONE_HELPER"
export CAPSTONE_NODE_VERSION="$(node --version)"
printf '%s\n' "$CAPSTONE_NODE_VERSION"
node -e 'const major = Number(process.versions.node.split(".")[0]); if (!Number.isInteger(major) || major < 22) process.exit(1)'
npm --version
git --version
task --version
uv --version
export CAPSTONE_LAUNCHER="$(mktemp -d "${TMPDIR:-/tmp}/3ci-capstone-launch-XXXXXX")"
cd "$CAPSTONE_LAUNCHER"
export CAPSTONE_LAUNCHER="$(pwd -P)"
export CAPSTONE_NOTES_DIR="$(mktemp -d "${TMPDIR:-/tmp}/3ci-capstone-notes-XXXXXX")"
export CAPSTONE_NOTES_DIR="$(cd "$CAPSTONE_NOTES_DIR" && pwd -P)"
export CAPSTONE_ASSESSMENT_NOTE="$CAPSTONE_NOTES_DIR/capstone-assessment-note.md"
test "$CAPSTONE_NOTES_DIR" != "$CAPSTONE_LAUNCHER"
export CAPSTONE_ROOT="$(node "$CAPSTONE_HELPER" create)"
export CAPSTONE_EVIDENCE="$(dirname "$CAPSTONE_ROOT")/evidence"
node "$CAPSTONE_HELPER" guard "$CAPSTONE_ROOT"
test "$(git -C "$CAPSTONE_ROOT" branch --show-current)" = "training/capstone"
test -z "$(git -C "$CAPSTONE_ROOT" remote)"
git -C "$CAPSTONE_ROOT" status --short --branch
```

### Windows PowerShell 7.4+

Before pasting the block, set the process environment variable
`DIRECTIVE_TRAINING_ROOT` to the absolute path of your curriculum clone.
The block fails clearly if that learner input is absent or not absolute.

```powershell
$ErrorActionPreference = "Stop"
$PSNativeCommandUseErrorActionPreference = $true
if ([string]::IsNullOrWhiteSpace($env:DIRECTIVE_TRAINING_ROOT)) {
  throw "Set DIRECTIVE_TRAINING_ROOT to the absolute curriculum clone path before running this block."
}
if (-not [IO.Path]::IsPathFullyQualified($env:DIRECTIVE_TRAINING_ROOT)) {
  throw "DIRECTIVE_TRAINING_ROOT must be an absolute path."
}
$CourseRoot = [IO.Path]::GetFullPath($env:DIRECTIVE_TRAINING_ROOT).TrimEnd([IO.Path]::DirectorySeparatorChar)
if (-not (Test-Path -LiteralPath $CourseRoot -PathType Container)) { throw "Curriculum clone not found: $CourseRoot" }
$CapstoneHelper = Join-Path $CourseRoot "labs/fixtures/capstone-end-to-end/capstone-lab.mjs"
if (-not (Test-Path -LiteralPath $CapstoneHelper -PathType Leaf)) { throw "Capstone helper not found." }
$CapstoneNodeVersion = ((& node --version | Out-String).Trim())
$CapstoneNodeVersion
& node -e 'const major = Number(process.versions.node.split(".")[0]); if (!Number.isInteger(major) || major < 22) process.exit(1)'
if ($LASTEXITCODE -ne 0) { throw "Capstone requires Node.js 22 or newer." }
npm --version
git --version
task --version
uv --version
python --version
$CapstoneLauncher = Join-Path ([IO.Path]::GetTempPath()) ("3ci-capstone-launch-" + [guid]::NewGuid().ToString("N"))
[void](New-Item -ItemType Directory -Path $CapstoneLauncher)
$CapstoneNotesDir = Join-Path ([IO.Path]::GetTempPath()) ("3ci-capstone-notes-" + [guid]::NewGuid().ToString("N"))
[void](New-Item -ItemType Directory -Path $CapstoneNotesDir)
$CapstoneNotesDir = (Resolve-Path -LiteralPath $CapstoneNotesDir).Path
$CapstoneAssessmentNote = Join-Path $CapstoneNotesDir "capstone-assessment-note.md"
if ([StringComparer]::OrdinalIgnoreCase.Equals($CapstoneNotesDir, $CapstoneLauncher)) { throw "Notes directory reused the launcher." }
Set-Location -LiteralPath $CapstoneLauncher
$CapstoneRoot = ((& node $CapstoneHelper create) | Out-String).Trim()
$CapstoneEvidence = Join-Path (Split-Path -Parent $CapstoneRoot) "evidence"
& node $CapstoneHelper guard $CapstoneRoot
if (((& git -C $CapstoneRoot branch --show-current | Out-String).Trim()) -ne "training/capstone") { throw "Wrong branch." }
if (@(& git -C $CapstoneRoot remote).Count -ne 0) { throw "Capstone must have no remote." }
git -C $CapstoneRoot status --short --branch
```

Expected: the Node major-version assertion passes. Record the printed Node value,
successful assertion, operating system and shell, and observed npm, Git, Task, uv, and—on
Windows—Python versions in the private assessment note. Confirm Task and uv
against the verified `3.50.0` and `0.11.10` context; on Windows, confirm Python
is available (`3.13.13` in the verified native environment). Guard prints the exact root;
the branch is `training/capstone`; the remote command prints no names; status
contains no product change. If any required value differs, stop and use the
matching documented environment. Do not repair the current directory into the
expected shape.

## Safety boundary

- Apply product edits only inside the unique repository root
  printed by `create`. The only learner-authored file outside an attempt is the
  private note at the exact path established above. Never edit this curriculum
  repository, a business repository, a broad workspace, or home.
- Do not add a remote, push, open a pull request, deploy,
  publish, release, or contact a live review service.
- Change only `src/work-items.mjs`. Supplied tests, Taskfile, helper, safety
  module, package files, xBRIEF acceptance, and `.deft/core/` are comparisons.
- Keep retained JSON in the sibling `evidence` directory. Do not hand-author or
  copy evidence files between attempts.
- A path, stage, fingerprint, Git redirection, symlink, or remote refusal is a
  stop signal. Use failure-specific recovery; run `reset` only while identity
  still passes. Otherwise preserve the invalid root and run `create` from a new
  safe launcher. Do not bypass the guard.

## Starting checkpoint

From the launcher directory, install the exact graph and let the helper create
the clean local checkpoint.

### macOS and Linux

```sh
node "$CAPSTONE_HELPER" install "$CAPSTONE_ROOT"
node "$CAPSTONE_HELPER" guard "$CAPSTONE_ROOT"
node "$CAPSTONE_ROOT/node_modules/@deftai/directive/dist/bin.js" --version
test "$(git -C "$CAPSTONE_ROOT" log -1 --format='%s')" = "chore: checkpoint fictional Directive capstone"
test -z "$(git -C "$CAPSTONE_ROOT" status --porcelain --untracked-files=all)"
test -z "$(git -C "$CAPSTONE_ROOT" remote)"
```

### Windows PowerShell 7.4+

```powershell
& node $CapstoneHelper install $CapstoneRoot
& node $CapstoneHelper guard $CapstoneRoot
& node (Join-Path $CapstoneRoot "node_modules/@deftai/directive/dist/bin.js") --version
if (((& git -C $CapstoneRoot log -1 --format="%s" | Out-String).Trim()) -ne "chore: checkpoint fictional Directive capstone") { throw "Checkpoint commit is missing." }
if (@(& git -C $CapstoneRoot status --porcelain --untracked-files=all).Count -ne 0) { throw "Checkpoint is not clean." }
if (@(& git -C $CapstoneRoot remote).Count -ne 0) { throw "Capstone must have no remote." }
```

Expected: `OK: installed Directive 0.119.5`, branch `training/capstone`, and a
clean worktree. Your earlier `node --version` check is the runtime evidence;
the helper verifies the exact installed Directive CLI/core/content/types graph.

## Tasks

### Task 1 — Orient, authorize, and prove readiness (`CAP.1`)

Run this verb from the launcher directory:

```sh
node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" orient "$CAPSTONE_ROOT"
```

Pause. Write the command-free `CAP-DC-01` checkpoint row into
`$CAPSTONE_ASSESSMENT_NOTE` on macOS/Linux or `$CapstoneAssessmentNote` on Windows — those
paths were set in the environment block above. Compare with curriculum CAP.1 or assessment
Task 1. Do not paste a filled assessment row into this lab. The checkpoint is command-free.

Then continue:

```sh
node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" activate "$CAPSTONE_ROOT"
node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" ready "$CAPSTONE_ROOT"
```

PowerShell uses the same verbs with
`node (Join-Path $CourseRoot "labs/fixtures/capstone-end-to-end/capstone-lab.mjs")`.

Expected helper results are `PASS` on orient, `PASS` on activate, then `READY`. Helper green
is the fixture transition. The private `CAP-DC-01` row is the CAP.1 routing evidence. Keep
`orientation.json`, `scope.json`, and `readiness.json`. Confirm the active contract is
`xbrief/active/2026-01-15-fictional-work-items.xbrief.json` and its only product path is
`src/work-items.mjs`.

### Task 2 — Preserve red/green and layered checks (`CAP.2`)

Before editing, run:

```sh
node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" red "$CAPSTONE_ROOT"
```

Expected: the helper exits `0` and prints `EXPECTED_FAILURE`; `red.json` records
the nested focused command's exit `1` and no changed files. Read the supplied
test, then implement only `$CAPSTONE_ROOT/src/work-items.mjs`. The first green
implementation must:

- validate the collection and every existing work item;
- require a nonempty trimmed title;
- allocate the next `WI-NNN` from the highest numeric suffix, not array length;
- refuse to allocate outside the bounded `WI-NNN` namespace: `WI-000` through
  `WI-999` are legal existing identifiers, an empty collection allocates
  `WI-001`, and add throws `RangeError` with the exact message
  `next work-item id would exceed WI-999` once the collection already holds
  `WI-999`, even when lower identifiers are free;
- return a new array and new item from add;
- validate the completion ID, reject a missing item, and return a new collection
  without mutating any input; and
- preserve the supplied summary behavior.

Deliberately do not reject normalized duplicate titles yet. Fixing the seeded
P1 before it is classified makes the guarded pre-PR stage stop.

```sh
node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" green "$CAPSTONE_ROOT"
node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" focused "$CAPSTONE_ROOT"
node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" literal "$CAPSTONE_ROOT"
node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" aggregate "$CAPSTONE_ROOT"
```

Expected: three `PASS` results, then `EXPECTED_FAILURE`. The aggregate evidence
must name `review:evidence` as its first failing subcheck and say pre-PR evidence
is missing. Repair the work or retained stage sequence, never a test or gate.

### Task 3 — Review without mutation, then repair (`CAP.3`)

```sh
node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" pre-pr "$CAPSTONE_ROOT"
```

Expected: `FINDING_RECORDED`. Before editing, inspect `pre-pr.json`: it must
classify exactly `CAP-P1-001` as `P1` and report `diffUnchanged: true`.

Change only `src/work-items.mjs` so `addWorkItem` rejects a title that duplicates
an existing title after trimming and case folding. Preserve immutability and all
previous behavior. Do not change the supplied test or add a regression test;
the helper's independent duplicate probe is the comparison for this seeded
finding. The observable rejection must contain the exact phrase
`title duplicates an existing work item`. Then run:

```sh
node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" review "$CAPSTONE_ROOT"
```

Expected: `PASS`; `review-resolution.json` reports `findingsResolved: 1` and
`currentHeadReview: CLEAN` for the repaired working-tree source digest. Despite
that field name, the product commit is created only by the next `close` verb.

### Task 4 — Close on evidence, then assess (`CAP.4`)

```sh
node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" close "$CAPSTONE_ROOT"
```

Expected: `PASS`. Inspect `closeout.json` and complete the
[capstone assessment](../assessments/capstone-end-to-end.md). Do not continue if
any state differs from `implemented`, `local_pass`, and the three relevant
`not_started` values. Helper stage `COMPLETE` means the lab attempt is complete;
the fictional xBRIEF intentionally remains active/running because no delivery
or lifecycle closeout occurred.

Complete the assessment's final checks, then continue through
[Reset to start](#reset-to-start) and [Cleanup](#cleanup). CAP.4 is not
demonstrated until the fresh root and both recoverable archives are recorded.

## Checkpoints

| Helper verb | Stage afterward | Helper output | Retained proof |
| --- | --- | --- | --- |
| `create` | `CREATED` | Absolute repository root | Sibling `lab-state.json`; `evidence/README.md` |
| `install` | `CHECKPOINT` | `OK: installed Directive 0.119.5` | Clean checkpoint commit; no separate install JSON |
| `orient` | `ORIENTED` | `"PASS"` | `orientation.json` (`CAP.1`) |
| — | — | command-free | private `CAP-DC-01` row in `$CAPSTONE_ASSESSMENT_NOTE` / `$CapstoneAssessmentNote` (`CAP.1`) |
| `activate` | `SCOPED` | `"PASS"` | `scope.json` (`CAP.1`) |
| `ready` | `READY` | `"READY"` | `readiness.json` (`CAP.1`) |
| `red` | `RED` | `"EXPECTED_FAILURE"` | `red.json`; nested focused exit `1` (`CAP.2`) |
| `green` | `GREEN` | `"PASS"` | `green.json` (`CAP.2`) |
| `focused` | `FOCUSED` | `"PASS"` | `focused.json` (`CAP.2`) |
| `literal` | `LITERAL` | `"PASS"` | `literal.json` (`CAP.2`) |
| `aggregate` | `AGGREGATE_RED` | `"EXPECTED_FAILURE"` | `aggregate-failure.json`; nested aggregate nonzero (`CAP.2`) |
| `pre-pr` | `PREPR` | `"FINDING_RECORDED"` | `pre-pr.json` (`CAP.3`) |
| `review` | `REVIEWED` | `"PASS"` | `review-resolution.json` (`CAP.3`) |
| `close` | `COMPLETE` | `"PASS"` | `closeout.json` (`CAP.4`) |

`reset` is not a transition on the old attempt; it creates a distinct,
uninstalled attempt at `CREATED`. `archive` preserves the existing stage while
relocating the whole attempt parent.

## Literal acceptance commands

The active fictional story stores exactly:

```text
npm run test:focused
npm run check:behavior
```

The `literal` helper invokes the pinned
`verify:ac` runner for those commands. The subsequent aggregate `task check` is
separate and broader; literal acceptance must precede it.

Inspect `literal.json.literalAcceptance.stdout` and, at close, `closeout.json.gate.currentHeadGate.stdout`.
This is quoted evidence, not a step to type:

```text
verify:ac passed (#3284) (0 verified, 1 unverifiable) [rung=derived]
verify:ac clause walk (#3323): 0 verified, 1 unverifiable, 0 failed
  [unverifiable] clause 1 @ (no path): The supplied focused tests and work-items CLI pass for add, complete, summary, invalid-input, and empty-collection cases without mutating input collections. — no artifact path bound
Literal acceptance-command gate passed (#3284/#3267): 2 command(s) run verbatim
AC-pass bank checkpoint required (finalize-on-green) (#3285)
unbounded budget — dual-stop still applies; bank is optional discipline
```

Classify that fragment:

- The two stored npm commands ran verbatim and exited 0. That is the literal-acceptance proof.
- `unverifiable` here means an acceptance sentence has no bound artifact path, not that a
  focused test failed. The clause text is the capstone work-items Acceptance sentence.
- `[rung=derived]` and the AC-pass-bank dual-stop line are upstream 0.119.5 diagnostics, not
  capstone closeout axes.


| Check | Required result | Proves |
| --- | --- | --- |
| `npm run test:focused` | Exit `0` after meaningful red | Supplied behavior contract passes |
| `npm run check:behavior` | Exit `0`; `{ "total": 2, "open": 1, "done": 1 }` | CLI behavior agrees |
| Aggregate diagnosis | Helper exits `0`; nested aggregate is nonzero first at `review:evidence` | Broader gate reached and retained the expected missing evidence |
| Repaired aggregate | Exit `0` before and after local commit | Current reviewed state passes the unchanged merge chokepoint |

## Evidence bundle

Retain these files in the attempt parent's `evidence` directory:

`orientation.json`, `scope.json`, `readiness.json`, `red.json`, `green.json`,
`focused.json`, `literal.json`, `aggregate-failure.json`, `pre-pr.json`,
`review-resolution.json`, and `closeout.json`. Also keep a private note at
`$CAPSTONE_ASSESSMENT_NOTE` on macOS/Linux or `$CapstoneAssessmentNote` on
Windows. Write the private `CAP-DC-01` row into that note between `orient` and
`activate`. This is the dedicated OS-temporary notes directory created above,
outside both attempt parents, both the original and reset launcher directories,
the curriculum checkout, and every business repository. Record the note's
absolute path, both attempts'
`lab-state.json.launcherRoot` values, both old and newly printed roots, and
each archive destination. Also record `CAPSTONE_NODE_VERSION` or
`$CapstoneNodeVersion`, the successful exact-version assertion, OS/shell, and
the observed npm, Git, Task, uv, and Windows Python versions. Reset and archive
do not emit JSON.

Keep only relevant fields and your short reasoning. Do not capture environment
dumps, tokens, credential output, unrelated repositories, or proprietary data.
Evidence stays local unless a separate authorized process names a destination.

## Progressive hints

Use one level at a time after a genuine attempt:

1. **Stage:** read the latest retained filename and name the next stage only.
2. **Comparison:** inspect the supplied test and current `src/work-items.mjs`;
   after red, the test is frozen.
3. **Implementation:** return copied arrays and copied changed objects. Allocate
   the next ID from the highest numeric suffix.
4. **Review repair:** normalize the proposed title and existing titles with
   trimming plus one stable case-folding locale, then reject a match.

After Hint 4, use the recovery table or the explained solution. No instructor
unlock is required.

## Expected failures and recovery

| Symptom | Confirm the cause | Recovery | Retry evidence |
| --- | --- | --- | --- |
| `use a dedicated temporary launcher` | Print the launcher path and confirm it is a direct temp child outside Git | Create a new correctly named launcher; do not reuse the refused target | A new guarded root |
| `expected READY stage` or another stage mismatch | Inspect which evidence files exist; do not edit them | Run the missing preceding verb, or use reset when state trust is lost | The expected next JSON file |
| `source changed before red evidence` | Compare the attempt with its clean checkpoint | Preserve the failed attempt and create a fresh reset root | New `red.json` with no changed files |
| `unexpected mutable path` | Inspect `git -C <root> status --short` | Preserve evidence; reset and change only `src/work-items.mjs` | Source-only diff |
| Aggregate fails before `review:evidence` | Read the first nonzero subcheck | Repair that governed source/stage evidence and rerun; do not edit Taskfile or verifier | `aggregate-failure.json` naming `review:evidence` |
| Pre-PR says finding already resolved | Source was repaired before classification | Preserve the attempt and reset; stop at zero-change classification first | `diffUnchanged: true` |
| Review says duplicate remains | Normalized duplicate check is absent | Change only source and rerun `review` | `currentHeadReview: CLEAN` for the current-product digest |
| Archive refuses the caller | The shell is still inside the attempt parent or root is not exact/canonical | Return to the dedicated launcher, then pass exactly the printed absolute root | Attempt moved under temp archive |

## Reset to start

Reset always creates a new unique attempt and preserves the old repository and
evidence. A completed learner must perform this drill even if no earlier failure
required it. From outside the completed attempt parent:

```sh
export COMPLETED_CAPSTONE_ROOT="$CAPSTONE_ROOT"
export RESET_CAPSTONE_ROOT="$(node "$CAPSTONE_HELPER" reset "$COMPLETED_CAPSTONE_ROOT")"
test "$RESET_CAPSTONE_ROOT" != "$COMPLETED_CAPSTONE_ROOT"
test -d "$COMPLETED_CAPSTONE_ROOT"
test -d "$(dirname "$COMPLETED_CAPSTONE_ROOT")/evidence"
node "$CAPSTONE_HELPER" guard "$RESET_CAPSTONE_ROOT"
```

```powershell
$CompletedCapstoneRoot = $CapstoneRoot
$ResetCapstoneRoot = ((& node $CapstoneHelper reset $CompletedCapstoneRoot) | Out-String).Trim()
if ($ResetCapstoneRoot -eq $CompletedCapstoneRoot) { throw "Reset reused the old root." }
if (-not (Test-Path -LiteralPath $CompletedCapstoneRoot -PathType Container)) { throw "Completed attempt was not preserved." }
if (-not (Test-Path -LiteralPath (Join-Path (Split-Path -Parent $CompletedCapstoneRoot) "evidence") -PathType Container)) { throw "Completed evidence was not preserved." }
& node $CapstoneHelper guard $ResetCapstoneRoot
```

The new root is intentionally uninstalled at `CREATED`. Old output is not proof
for the new attempt.

## Cleanup

Cleanup is a recoverable archive, not deletion. Leave both attempt parents and
archive the completed and reset roots separately:

```sh
cd "$COURSE_ROOT"
completed_archive="$(node "$CAPSTONE_HELPER" archive "$COMPLETED_CAPSTONE_ROOT")"
reset_archive="$(node "$CAPSTONE_HELPER" archive "$RESET_CAPSTONE_ROOT")"
test -d "$completed_archive/repo"
test -d "$completed_archive/evidence"
test -d "$reset_archive/repo"
test -d "$reset_archive/evidence"
```

```powershell
Set-Location -LiteralPath $CourseRoot
$CompletedArchive = ((& node $CapstoneHelper archive $CompletedCapstoneRoot) | Out-String).Trim()
$ResetArchive = ((& node $CapstoneHelper archive $ResetCapstoneRoot) | Out-String).Trim()
foreach ($Archive in @($CompletedArchive, $ResetArchive)) {
  if (-not (Test-Path -LiteralPath (Join-Path $Archive "repo") -PathType Container)) { throw "Archived repository is missing." }
  if (-not (Test-Path -LiteralPath (Join-Path $Archive "evidence") -PathType Container)) { throw "Archived evidence is missing." }
}
```

The helper moves each named attempt under the OS-temporary
`3ci-directive-capstone-archive` directory. It refuses an implicit root,
unexpected root or protected-tree symlink, reused destination, redirected Git
state, remote, protected location, or caller still inside the attempt parent.
Each attempt parent is a separate OS-temporary sibling of its launcher. Both
launchers therefore remain empty throughout, and archive leaves them untouched.
Record both `lab-state.json.launcherRoot` values and leave both empty launchers
to normal OS-temporary cleanup.

Reset and archive write no JSON record. In
`$CAPSTONE_ASSESSMENT_NOTE` or `$CapstoneAssessmentNote`, retain the original
root, fresh reset root,
proof that they differ, reset command and exit, both launcher roots, both
archive commands and returned destinations, and proof that each archived
`repo/` and `evidence/` directory exists.

Retain the exact notes directory locally only until assessment or approved
review is complete. Then leave that exact OS-temporary directory to normal OS
cleanup or follow an approved private evidence-retention policy. Never target a
broader temporary directory, workspace, or home recursively.

## Explained solution

After at least 45 minutes, compare your reasoning and artifacts with the
[complete explained solution](../solutions/capstone-end-to-end.md). Then use a
fresh reset root to produce new evidence for any unmet outcome.

## Done statement

> I demonstrated `CAP.1`–`CAP.4` against `@deftai/directive@0.119.5` on my
> recorded Node.js 22-or-newer runtime. I preserved ordered readiness,
> red/green, focused, literal,
> aggregate, zero-change review, repair, current-product review, and closeout
> evidence. The fictional work is `implemented` with `local_pass`; ship,
> deployment, and UAT are `not_started`. I created a distinct reset root,
> archived the completed and reset attempt parents separately, recorded both
> launcher roots, and touched no remote or business repository.

## Navigation

- Lesson: [Capstone — End-to-End Solo Directive Lifecycle](../curriculum/capstone-end-to-end.md)
- Assess: [Capstone evidence assessment](../assessments/capstone-end-to-end.md)
- Compare and retry: [Capstone explained solution](../solutions/capstone-end-to-end.md)
- Lab safety model: [Disposable lab environment](README.md)
- Course map: [3Ci Directive training](../curriculum/README.md)
