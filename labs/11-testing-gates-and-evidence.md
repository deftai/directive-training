# Lab 11 — Testing, Gates, and Evidence

## Lab record

| Field | Value |
| --- | --- |
| Stable ID | `lab-11-testing-gates-and-evidence` |
| Status | Learner-ready draft |
| Suggested first attempt | 35 minutes |
| Directive baseline | `@deftai/directive@0.119.5`; see the [source baseline](../references/SOURCE-BASELINE.md) |
| Source module | [Module 11 — Testing, Gates, and Evidence](../curriculum/modules/11-testing-gates-and-evidence.md) |
| Fixture | [`fixtures/11-testing-gates-and-evidence`](fixtures/11-testing-gates-and-evidence/) |
| Verified environment | macOS/zsh; Linux/bash and Windows/PowerShell remain candidates pending native 0.119.5 evidence |

The helper retains a Windows command path, but its prior walkthrough used the old
baseline. It remains a candidate until the complete 0.119.5 gate route runs natively.

## Goal and done condition

Add average behavior test-first, retain a `red -> green -> refactor` record, run literal acceptance and forward coverage separately, diagnose the seeded aggregate failure, and repair only the governed quality record. You are done when `final.json` reports `PASS`, the diff contains three named work files, and gate-definition hashes remain unchanged.

## Fictional scenario

Northstar's local numeric-summary module returns a count and total. The active story asks for an average, including `null` for an empty sample. The repository also requires a quality record assembled from observed evidence before its aggregate gate can pass.

All names and values are fictional. No remote service, business repository, credential, deployment, or reviewer is involved.

## Environment and starting-state check

Use Node.js 20 or later, npm, Git, Task, and `uv`. Run these commands from the curriculum repository only to invoke the supplied helper; all exercise mutation occurs in the unique OS-temporary repository with no remote that it creates.

The guarded interface is `gates-lab.mjs create`, `gates-lab.mjs install`,
`gates-lab.mjs red`, `gates-lab.mjs green`, `gates-lab.mjs refactor`,
`gates-lab.mjs literal`, `gates-lab.mjs aggregate`, `gates-lab.mjs final`,
`gates-lab.mjs reset`, and `gates-lab.mjs archive`. Use only the complete paths
shown below when invoking those verbs.

```sh
set -eu
node --version
npm --version
git --version
task --version
uv --version
node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs create
```

Copy the printed absolute repository path into a task-specific variable:

```sh
export LAB11_ROOT="/absolute/path/printed/by/the/helper"
node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs guard "$LAB11_ROOT"
git -C "$LAB11_ROOT" branch --show-current
git -C "$LAB11_ROOT" remote
```

Expected: guard succeeds, the branch is `training/module-11`, and the remote command prints nothing.

## Safety boundary

The helper refuses mutation unless the target is the canonical `repo` inside one unique OS-temporary no-remote attempt, the branch is `training/module-11`, exactly one xBRIEF 0.8 story is active/running, and the exact Directive graph is 0.119.5 after install.

Stage-specific work paths are:

- before red: `test/summary.test.mjs` only;
- between red and refactor: the frozen test plus `src/summary.mjs`;
- after the seeded aggregate failure: those two files plus `quality-record.json`.

Never edit `Taskfile.yml`, `gates-lab.mjs`, `safety.mjs`, `package.json`, `scripts/verify-quality-record.mjs`, the active xBRIEF acceptance definition, or `.deft/core/`. The helper checks their fingerprints. Do not add a remote or use broad reset/clean/delete commands.

## Starting checkpoint

Install the exact release and create the named clean commit:

```sh
node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs install "$LAB11_ROOT"
git -C "$LAB11_ROOT" status --short --branch
```

Expected: the helper prints `OK: installed Directive 0.119.5`, the branch is `training/module-11`, and the worktree is clean. Installation uses a project-local npm cache and writes retained evidence outside the Git repository.

## Tasks

### Task 1 — Add the focused test and retain red

In `$LAB11_ROOT/test/summary.test.mjs`, replace the supplied instruction comment with:

```js
test("reports an average and handles an empty list", () => {
  assert.deepEqual(summarize([2, 4, 6]), { count: 3, total: 12, average: 4 });
  assert.deepEqual(summarize([]), { count: 0, total: 0, average: null });
});
```

Then run:

```sh
node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs red "$LAB11_ROOT"
```

Expected: `EXPECTED_FAILURE`. The helper retains `red.json` and freezes the focused-test digest.

### Task 2 — Implement green, then refactor under green

Change only `$LAB11_ROOT/src/summary.mjs`. First add average directly to the returned object, preserving the existing validation, count, and total behavior. Then run:

```sh
node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs green "$LAB11_ROOT"
```

Expected: `PASS`. Next refactor the same source so `count` and `average` are named local values while behavior remains unchanged:

```sh
node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs refactor "$LAB11_ROOT"
```

Expected: `PASS`. The frozen test must not change.

### Task 3 — Run literal and forward evidence

```sh
node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs literal "$LAB11_ROOT"
```

Expected: `PASS`. The helper runs the pinned `verify:ac` behavior and forward-coverage command separately and retains both results in `literal.json`.

The helper prints `PASS`. Inspect `literal.json.literalAcceptance.stdout` for the pinned
`verify:ac` PASS fragment. This is quoted evidence, not a step to type:

```text
verify:ac passed (#3284) (0 verified, 1 unverifiable) [rung=derived]
verify:ac clause walk (#3323): 0 verified, 1 unverifiable, 0 failed
  [unverifiable] clause 1 @ (no path): The focused test and numeric-summary CLI pass for an ordinary sample and an empty sample. — no artifact path bound
Literal acceptance-command gate passed (#3284/#3267): 2 command(s) run verbatim
AC-pass bank checkpoint required (finalize-on-green) (#3285)
unbounded budget — dual-stop still applies; bank is optional discipline
```

Classify that fragment:

- The two stored npm commands ran verbatim and exited 0. That is the literal-acceptance proof.
- `unverifiable` here means an acceptance sentence has no bound artifact path, not that a
  focused test failed. The clause text is Lab 11's stored Acceptance sentence.
- `[rung=derived]` and the AC-pass-bank dual-stop line are upstream 0.119.5 diagnostics, not
  Lab 11 closeout axes.

### Task 4 — Diagnose the seeded aggregate failure

```sh
node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs aggregate "$LAB11_ROOT"
```

Expected: `EXPECTED_FAILURE`, with `quality:record` as the first failing subcheck and `quality record is incomplete` in the retained output. Do not change a gate.

The starter record is incomplete. Fill it from this closed field table, then run `final`.
Do not copy a helper `finalStatus` object as the fill procedure.

| Field | Starter | Required completed value |
| --- | --- | --- |
| `status` | `INCOMPLETE` | `COMPLETE` |
| `evidence.red` | `""` | `EXPECTED_FAILURE` |
| `evidence.green` | `""` | `PASS` |
| `evidence.refactor` | `""` | `PASS` |
| `evidence.literalAcceptance` | `""` | `PASS` |
| `evidence.forwardCoverage` | `""` | `PASS` |
| `evidence.firstFailingSubcheck` | `""` | `quality:record` |
| `evidence.repair` | `""` | `quality-record.json only` |
| `evidence.gateDefinitionsUnchanged` | `false` | `true` |

The completed object matches the explained Lab 11 solution Step 6 record:

```json
{
  "schema": "3ci.training.module11.quality-record.v1",
  "status": "COMPLETE",
  "evidence": {
    "red": "EXPECTED_FAILURE",
    "green": "PASS",
    "refactor": "PASS",
    "literalAcceptance": "PASS",
    "forwardCoverage": "PASS",
    "firstFailingSubcheck": "quality:record",
    "repair": "quality-record.json only",
    "gateDefinitionsUnchanged": true
  }
}
```

Update only `$LAB11_ROOT/quality-record.json` to those required completed tokens. Then run:

```sh
node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs final "$LAB11_ROOT"
```

Expected: `PASS`.

## Checkpoints

| Checkpoint | Required observation | Retained file |
| --- | --- | --- |
| Red | Focused exit `1`; assertion names average | `red.json` |
| Green | Same test digest; focused exit `0`; `{ count: 3, total: 12, average: 4 }` | `green.json` |
| Refactor | Source digest changes; behavior and test digest stay fixed | `refactor.json` |
| Literal | Literal acceptance and forward coverage both pass | `literal.json` |
| Aggregate red | First failure is `quality:record` | `aggregate-failure.json` |
| Final | Aggregate passes; work diff has three files; gate hashes are unchanged | `final.json` |

## Literal acceptance commands

The fictional active xBRIEF stores these commands:

```text
npm run test:focused
npm run check:behavior
```

The pinned `verify:ac` runner executes these safe commands verbatim. The lab's helper invokes it through the project-local 0.119.5 binary. The aggregate `task check` is deliberately separate and broader.

The same PASS fragment lives in `literal.json.literalAcceptance.stdout`. Reuse the Task 3
quoted-evidence classification: the two npm commands are the literal-acceptance proof;
`unverifiable` means no bound artifact path on clause 1; `[rung=derived]` and the AC-pass-bank
dual-stop line are upstream 0.119.5 diagnostics.

## Evidence bundle

Evidence is outside the repository in the attempt's sibling `evidence` directory:

- `red.json` — meaningful failure and frozen test digest;
- `green.json` — passing focused behavior and first source digest;
- `refactor.json` — passing behavior after a source-only structural change;
- `literal.json` — literal-acceptance and forward-coverage exits;
- `aggregate-failure.json` — first failing subcheck and unchanged gate fingerprints;
- `final.json` — passing aggregate, final three-file diff, and `gateDefinitionsUnchanged: true`.

Review the smallest relevant fields; do not publish full environment output.

## Progressive hints

1. Red needs one assertion about the missing average behavior, not a syntax failure.
2. Green changes the source; the test digest must match `red.json`.
3. Refactor names intermediate values but must not change the returned object.
4. Fill `quality-record.json` from the Task 4 field table. The starter object is `INCOMPLETE`; the completed tokens are `COMPLETE`, `EXPECTED_FAILURE`, `PASS`, `quality:record`, `quality-record.json only`, and `gateDefinitionsUnchanged: true`.

## Expected failures and recovery

| Failure | Cause | Recovery |
| --- | --- | --- |
| `source changed before red evidence` | Implementation began before meaningful red | Preserve the attempt and use the reset helper for a fresh root |
| `focused test changed after the red checkpoint` | The comparison moved | Preserve the evidence and retry from a fresh attempt with the red test frozen |
| Literal safety refusal | The active command is not from the allowed test/check family | Use the untouched supplied active contract; do not alter the allowlist |
| Aggregate fails before `quality:record` | Focused, literal, or forward evidence regressed | Repair that work and rerun its stage before aggregate |
| `gate definition changed` | A comparison file or pinned gate changed | Preserve the attempt and start fresh; never copy the altered gate |
| Final quality mismatch | The record does not match the Task 4 field table | Repair `quality-record.json` only, using the published completed tokens; do not copy `finalStatus` from the six files |

## Reset to start

The reset route preserves the old attempt and creates a distinct guarded root:

```sh
node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs reset "$LAB11_ROOT"
```

Copy the new printed path into a new task-specific variable. The original attempt and evidence remain available for diagnosis.

## Cleanup

Cleanup is recoverable archive, not deletion. Leave the attempt parent, then pass exactly one absolute root:

```sh
cd /path/to/the/curriculum-repository
node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs archive "$LAB11_ROOT"
```

The helper moves the named attempt under the operating-system temporary `3ci-directive-lab-archive` directory. It refuses an implicit path, symlink, remote, wrong branch, or caller still inside the attempt parent.

## Native Windows PowerShell 7.4+ route

Run this from the curriculum repository. Make only the test, source, and quality-
record edits described by the corresponding steps above:

```powershell
$ErrorActionPreference = "Stop"
$CourseRoot = (Resolve-Path -LiteralPath .).Path
$Helper = Join-Path $CourseRoot "labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs"
$Launcher = Join-Path ([IO.Path]::GetTempPath()) ("3ci-lab11-launch-" + [guid]::NewGuid().ToString("N"))
[void](New-Item -ItemType Directory -Path $Launcher)
Set-Location -LiteralPath $Launcher
$LabRoot = ((& node $Helper create) | Out-String).Trim()
& node $Helper guard $LabRoot
& node $Helper install $LabRoot
# Add only the specified average test, then retain the meaningful failure.
& node $Helper red $LabRoot
# Implement the specified source behavior, then retain green and the source-only refactor.
& node $Helper green $LabRoot
& node $Helper refactor $LabRoot
& node $Helper literal $LabRoot
$Aggregate = ((& node $Helper aggregate $LabRoot) | Out-String).Trim()
if ($LASTEXITCODE -ne 0 -or $Aggregate -notmatch "EXPECTED_FAILURE") { throw "The seeded quality-record diagnosis was not retained." }
# Repair only quality-record.json from retained evidence, then verify the unchanged aggregate.
& node $Helper final $LabRoot
if ($LASTEXITCODE -ne 0) { throw "Lab 11 final verification failed." }
$EvidenceRoot = Join-Path (Split-Path -Parent $LabRoot) "evidence"
foreach ($Name in "red.json", "green.json", "refactor.json", "literal.json", "aggregate-failure.json", "final.json") {
  if (-not (Test-Path -LiteralPath (Join-Path $EvidenceRoot $Name) -PathType Leaf)) { throw "Missing $Name" }
}
$FreshRoot = ((& node $Helper reset $LabRoot) | Out-String).Trim()
& node $Helper guard $FreshRoot
Set-Location -LiteralPath $CourseRoot
$Archive = ((& node $Helper archive $LabRoot) | Out-String).Trim()
if (-not (Test-Path -LiteralPath (Join-Path $Archive "repo") -PathType Container)) { throw "Archive is incomplete." }
```

The six evidence files must preserve the ordered red/green/refactor/literal/
aggregate/final sequence, with only `quality-record.json` repaired after diagnosis.

## Explained solution

After a good-faith attempt, use the [explained Lab 11 solution](../solutions/lab-11-testing-gates-and-evidence.md). Compare decisions and evidence, then retry the unmet outcome.

## Done statement

“I retained meaningful red, green, and refactor evidence with one frozen focused test; ran literal acceptance and forward coverage separately; observed `quality:record` as the seeded aggregate failure; repaired only `quality-record.json`; and reran the unchanged aggregate to `PASS` with unchanged gate-definition hashes.”
