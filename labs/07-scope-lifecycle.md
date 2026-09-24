# Lab 7 — Observe Scope Lifecycle and Implementation Authorization

## Lab record

| Field | Value |
| --- | --- |
| Stable ID | `lab-07-scope-lifecycle` |
| Supports | O7.1 proposed failure, O7.2 lifecycle transitions, O7.3 current readiness, O7.4 evidence and recovery, plus Module 6 O6.2 structural completion evidence in Task 5 |
| Status | Learner-ready on macOS/zsh; Linux/bash and Windows/PowerShell remain candidates |
| Last verified | 2026-09-17 |
| Directive baseline | CLI/core/content/types `0.119.5`; [source baseline](../references/SOURCE-BASELINE.md) |
| Duration | 45–50 minutes, including install, prediction, evidence review, your own scope check, reset, and archive |
| Platforms verified | macOS/zsh local baseline-upgrade suite; go-task 3.50.0 |
| Candidate platforms | Linux/bash and Windows/PowerShell are not verified on 0.119.5 |

The helper is course tooling; it does not add a new Directive feature.

The helper retains a Windows command path, but its prior walkthrough used the old
baseline. It remains a candidate until the complete 0.119.5 lifecycle route runs natively.

## Goal and done condition

Observe a real fail-closed proposed preflight, lifecycle-command transitions, the current
session gates, active preflight success, completion, and cancellation inside one fictional
no-remote repository.

**Done:** **O7.1** has the retained proposed failure; **O7.2** has folder/status evidence for
every transition; **O7.3** has explicit live intent followed by successful session and active
preflight gates; and **O7.4** has a different fresh reset root plus a retained or archived
original attempt.

Task 5 adds no Lab 7 outcome. It is the adjacent practical step that supplies Module 6's O6.2
structural completion evidence: a positive `xbrief:verify` result against the exact
proposed-scope artifact you authored in Module 6.

## Fictional scenario

Northstar Lifecycle Lab is fictional. One scope represents completing a greeting exercise;
a second represents obsolete work that should be cancelled. The helper intentionally makes
no application edit. The observable product of this exercise is lifecycle evidence, not a
shipping claim.

Two minimal schema-0.8 scope records begin in `xbrief/proposed/` with
`plan.status: proposed`. Both stay exactly where the lab put them. In Task 5 you add a third
record of your own; it is checked, never promoted. Their lack of product acceptance items is intentional: the lab
isolates lifecycle behavior and avoids pretending that a lifecycle completion proves a
software feature was delivered.

## Environment and starting-state check

Use a dedicated zsh terminal at the root of this curriculum repository. Complete Modules
1–6 first. Confirm the course checkout is only the source of the helper:

```sh
set -eu
course_root="$(pwd -P)"
helper="$course_root/labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs"
test -f "$helper"
node --version
npm --version
git --version
task --version
uv --version
python_command=
for python_name in python3 python; do
  python_search=$PATH
  while [ -n "$python_search" ]; do
    case "$python_search" in
      *:*)
        python_directory=${python_search%%:*}
        python_search=${python_search#*:}
        ;;
      *)
        python_directory=$python_search
        python_search=
        ;;
    esac
    [ -n "$python_directory" ] || continue
    python_candidate="$python_directory/$python_name"
    if [ -e "$python_candidate" ]; then
      python_command="$python_candidate"
      break 2
    fi
  done
done
if [ -z "$python_command" ]; then
  printf '%s\n' "Python is required for the Lab 7 isolated PATH." >&2
  exit 1
fi
"$python_command" --version
lab_root="$(node "$helper" create)"
node "$helper" guard "$lab_root"
test "$(git -C "$lab_root" branch --show-current)" = "training/module-07"
test -z "$(git -C "$lab_root" remote)"
```

**Pass:** `lab_root` is an absolute canonical path ending in a unique
`3ci-directive-lab07-<id>/repo` under the operating-system temporary directory. The branch
is `training/module-07`; the remote list is empty; both fictional stories are proposed.

The parent contains `lab-state.json` and `evidence/`. The marker binds the exact repository
root and fixture digests. The evidence directory is outside Git so lifecycle commands cannot
accidentally stage it.

Install the exact package graph and deposit its Task surface:

```sh
node "$helper" guard "$lab_root"
node "$helper" install "$lab_root"
node "$lab_root/node_modules/.bin/directive" --version
test -f "$lab_root/Taskfile.yml"
test -f "$lab_root/.deft/core/VERSION"
test -z "$(git -C "$lab_root" remote)"
```

**Pass:** install reports Directive 0.119.5 and the explicit local CLI reports engine
0.119.5. The helper uses the public npm registry, a lab-local cache, ignored runtime paths,
and a fictional local Git identity. It never changes the course checkout or global npm
configuration.

If install is partial, preserve its sanitized output and use the reset section. Do not use a
global Directive as a substitute; another version on `PATH` is exactly the ambiguity this
fixture excludes.

## Safety boundary

- Every mutation must stay inside the exact guarded temporary root or its
  named parent evidence directory.
- The fixture must remain private, on `training/module-07`, with no remote
  and exact CLI/core/content/types 0.119.5 pins.
- Do not use a business repository, client data, credentials, production
  logs, a remote action, deployment, publication, or release.
- Run `guard` before install, lifecycle execution, reset, or archive. A
  rejected guard is a stop, not a request to weaken the helper.
- Keep the supplied helper, safety module, package manifest, project
  definition, and story records unchanged. The exercise is observation, not fixture repair.
- Your Task 5 artifact is the only file you author. Write it inside the guarded root, keep
  `--out` inside that root, and do not promote or activate it.
- Treat your own artifact as untrusted input to the CLI: fictional content only, no client
  data, credentials, or paths outside the guarded attempt.

The guard rejects inherited Git redirection variables, noncanonical paths, symlinked
sensitive paths, a foreign marker, multiple story copies, folder/status disagreement, a
changed pin or helper, the wrong branch, and any remote. It reads Git override names but
never prints their values.

The local Task environment admits only this attempt's package launchers plus individually
resolved `node`, `task`, `npm`, `git`, `python`, `uv`, and optional `gh` tools. The helper
resolves Python as `python3` then `python` on macOS/Linux and as `python`, `python3`, then
`py` on Windows before it constructs the isolated `PATH`. It requires presence only and
does not compare a Python version. Do not treat Python as a generic
prerequisite for Directive verification. The course requires it specifically
because the Labs 7, 10, and 11 helpers construct isolated `PATH`s and the capstone
constructs `isolatedEnv`. This prevents a newer
global Directive in the same shell from silently replacing the pinned engine. No GitHub
operation is performed.

## Starting checkpoint

Before the lifecycle run, predict the sequence in private notes:

| Step | Folder/status before | Expected exit | Why |
| --- | --- | ---: | --- |
| Pinned proposed preflight | `proposed/proposed` | `1` | Proposed work is not active. |
| Task proposed preflight | unchanged | nonzero | The Task wrapper preserves the engine failure. |
| Promote | `proposed/proposed` | `0` | Creates `pending/pending`. |
| Activate | `pending/pending` | `0` | Creates `active/running`. |
| Cancel separate story | `proposed/proposed` | `0` | Creates `cancelled/cancelled`. |
| Session start and gated ritual | delivery remains `active/running` | `0`, `0` | Establishes current session readiness. |
| Active preflight | `active/running` | `0` | The named durable scope passes after live intent and session gates. |
| Complete | `active/running` | `0` | Creates `completed/completed`. |
| Authored-scope structural verify (Task 5) | your record stays `proposed/proposed` | `0` | Verify reads structure and is not a lifecycle move. |

The pinned engine's proposed preflight exit is `1`. On the verified
host, go-task 3.50.0 exposes the failing Task invocation as `201`; treat that as Task runner
evidence, not a cross-platform Directive engine promise.

## Tasks

### Task 1 — Observe the expected proposed failure

The single run command performs the complete bounded sequence, but it writes the proposed
failure evidence before promotion. The flag is a deliberate, live instruction for this
invocation:

```sh
node "$helper" guard "$lab_root"
node "$helper" run "$lab_root" --intent=implement
```

Before pressing Enter, say what the flag does not mean: it is not
standing permission for another attempt, another scope, product code, or a remote action.

Open `../evidence/proposed-preflight.json` relative to `lab_root`. Confirm:

- `pinnedDirectiveExit` is `1`;
- `taskExit` is nonzero;
- `stateBeforePromotion` is `proposed/proposed`;
- both command outputs name the proposed/active boundary; and
- the file was written before the recorded promotion.

The pinned 0.119.5 proposed-preflight stderr is:

```text
xBRIEF is in xbrief/proposed/ -- only xbrief/active/ (or legacy vbrief/active/) is eligible for implementation.
  Expected: `task xbrief:preflight -- xbrief/active/<story>.xbrief.json` (legacy: `task vbrief:preflight -- <path>`).
  Run `task scope:activate -- xbrief/proposed/2026-01-15-fictional-delivery.xbrief.json` (or legacy `task vbrief:activate -- {path}`) before spawning an implementation agent.
```

Classify that output:

- The eligibility clause is correct: proposed work is not active.
- The next-command line is `ACTIVATE_HINT`. It substitutes the rejected proposed path into a
  pending-only verb, so it is inapplicable from `proposed/`.

Keep the lab's next move as `task deft:scope:promote` on the proposed file, then
`task deft:scope:activate` on the pending file. Do not follow the printed activate-on-proposed
hint.

This is **O7.1**. Do not reduce the result to “a command failed”; explain the authorization
fact it detected.

### Task 2 — Trace the Task-driven transitions

Open `../evidence/lifecycle-run.json`. Follow these keys in order:

```text
steps.promote
steps.activate
steps.cancel
steps.sessionStart
steps.sessionRitual
steps.activePreflight
steps.complete
```

Each successful step has exit `0`. Compare the repository to `final`:

```sh
test -f "$lab_root/xbrief/completed/2026-01-15-fictional-delivery.xbrief.json"
test -f "$lab_root/xbrief/cancelled/2026-01-15-fictional-cancel.xbrief.json"
node "$helper" guard "$lab_root"
test -z "$(git -C "$lab_root" remote)"
```

This establishes **O7.2**. The helper invokes the real consumer Task names from the pinned
deposit; it does not simulate file moves.

### Task 3 — Explain current readiness

Use the evidence ordering, not memory. Write one sentence with all components:

> The delivery scope was active/running, this invocation carried live implementation intent,
> the session start and gated ritual passed, and only then did active xBRIEF preflight pass.

This is **O7.3**. Notice that the successful preflight output says “ready for
implementation,” not “implemented” or “delivered.” The later completion is a lifecycle
exercise with no product edit.

### Task 4 — Prove fresh recovery

Create a new root while preserving the old attempt:

```sh
first_root="$lab_root"
second_root="$(node "$helper" reset "$first_root")"
test "$second_root" != "$first_root"
node "$helper" guard "$first_root"
node "$helper" guard "$second_root"
test -f "$(dirname "$first_root")/evidence/lifecycle-run.json"
```

The second attempt is fresh and uninstalled. The first is intact, including its successful
and failing evidence. This is the reset half of **O7.4**.

### Task 5 — Author and structurally verify your own proposed scope

The four tasks above observe supplied records. This one consumes the schema-0.8 proposed-scope
artifact you wrote in [Module 6](../curriculum/modules/06-creating-well-shaped-work.md) Part B.
It is the structural half of Module 6's O6.2 completion evidence and the only step in this lab
where you author a file. Both supplied scopes stay untouched; yours is a third record.

Write your Module 6 artifact into the installed first attempt with your editor, then check it:

```sh
evidence="$(dirname "$first_root")/evidence"
authored="$first_root/xbrief/proposed/2026-01-15-your-proposed-scope.xbrief.json"
authored_command="node $first_root/node_modules/.bin/directive xbrief:verify -- --format json --out $authored --style scope --project-root $first_root"
node "$helper" guard "$first_root"
test -f "$authored"
set +e
node "$first_root/node_modules/.bin/directive" xbrief:verify -- --format json --out "$authored" --style scope --project-root "$first_root" > "$evidence/authored-verify.txt" 2>&1
authored_exit=$?
set -e
printf 'path=%s\ncommand=%s\nexit=%s\n' "$authored" "$authored_command" "$authored_exit" >> "$evidence/authored-verify.txt"
test "$authored_exit" -eq 0
node "$helper" guard "$first_root"
```

Retain four things from `evidence/authored-verify.txt`: the artifact **path**, the exact
**command**, the **exit code**, and the **result** line. The record persists all four, so a green
run is still complete O6.2 evidence. Exit `0` against that exact path is the positive structural
result; exit `1` names the first structural defect in your file.

The `set +e` / `set -e` pair is the same expected-failure idiom Lab 5 uses. This shell runs under
`set -eu`; without that window a structural defect would end the shell before `authored_exit` is
read, and the failure evidence you are required to keep would be lost.

Read the boundary before you continue, and do not cross it:

- `xbrief:verify` is not a lifecycle move. Do not promote or activate your scope.
- A green structural result grants no promotion, no activation, and no implementation authority.
- `xbrief:preflight` and `doctor` are not the authoring-validity pass. Preflight asks whether a
  lifecycle record is ready to be worked; doctor probes the install and environment.
- The structural result does not prove the version is `0.8`, the status is `proposed`, the
  acceptance is observable, or the traces exist. Module 6's comparison rubric proves those, and
  the two surfaces stay separate.

This step is not graded on command choice, invocation, output reading, or recovery; the command
is supplied verbatim. It supplies Module 6 **O6.2** evidence and adds no Lab 7 outcome.

## Checkpoints

Stop and compare at these points:

1. **Boundary checkpoint:** canonical root, exact pin, feature branch, empty remote.
2. **Expected-failure checkpoint:** pinned exit `1` and nonzero Task exit are retained before
   lifecycle mutation.
3. **Transition checkpoint:** folder/status pairs match the completed and cancelled results.
4. **Readiness checkpoint:** live intent precedes session gates and active preflight success.
5. **Recovery checkpoint:** two different roots exist and the first evidence remains readable.
6. **Authoring checkpoint:** your own record verified structurally, stayed in `proposed/`, and
   both supplied scopes are still the ones the lab created.

If a checkpoint fails, do not continue to make later green output conceal it.

## Literal acceptance commands

Run these from the course root with `helper`, `first_root`, `second_root`, and `authored`
still set:

```sh
node "$helper" guard "$first_root"
test -f "$(dirname "$first_root")/evidence/proposed-preflight.json"
test -f "$(dirname "$first_root")/evidence/lifecycle-run.json"
test -f "$first_root/xbrief/completed/2026-01-15-fictional-delivery.xbrief.json"
test -f "$first_root/xbrief/cancelled/2026-01-15-fictional-cancel.xbrief.json"
test -z "$(git -C "$first_root" remote)"
node "$helper" guard "$second_root"
test -f "$(dirname "$first_root")/evidence/authored-verify.txt"
test -f "$authored"
node "$first_root/node_modules/.bin/directive" xbrief:verify -- --format json --out "$authored" --style scope --project-root "$first_root"
```

- **O7.1:** the first two evidence files contain the expected proposed failure.
- **O7.2:** the completed and cancelled files pass the guard's folder/status check.
- **O7.3:** the lifecycle JSON records live intent, session gates, then active preflight.
- **O7.4:** both distinct roots pass their guards and the first evidence remains intact.
- **O6.2 structural evidence:** the last two commands exit `0`, your artifact is still under
  `xbrief/proposed/`, and the retained record names its path, command, exit code, and result.

These commands do not install the second attempt or contact a remote.

## Evidence bundle

Retain:

- the exact `lab_root` and `second_root` paths;
- `evidence/proposed-preflight.json` with both failure exit surfaces;
- `evidence/lifecycle-run.json` with baseline, environment, ordered commands, outputs, exits,
  final pairs, live-intent boundary, and empty remote value;
- `evidence/authored-verify.txt` with the artifact path, exact command, exit code, and result;
- your prediction table and four outcome explanations; and
- the retained or archive location for each attempt.

Sanitize local usernames or filesystem prefixes before sharing evidence. Keep exit codes,
versions, lifecycle filenames, statuses, and diagnostics intact.

## Progressive hints

1. The first failure is expected; inspect `pinnedDirectiveExit` before searching for a fix.
2. Promotion makes work pending. Activation makes the pending work current and running.
3. Search the JSON for `liveIntent`, then compare the positions of the three session/preflight
   steps.
4. Reset returns a new path. If the path did not change, do not accept it as recovery.
5. If Task 5 exits `1`, read the first reported defect literally. It names a field and a type,
   not a judgment about your shaping.

## Expected failures and recovery

| Symptom | Interpretation | Recovery |
| --- | --- | --- |
| Proposed engine preflight exits `1` | Expected O7.1 behavior. The eligibility clause is correct (proposed is not active). The next-command line is `ACTIVATE_HINT` substituting the rejected proposed path into a pending-only verb, so it is inapplicable from `proposed/`. | Preserve the failure. Promote the proposed file, then activate the pending file. Do not run activate on the proposed path. |
| Task failure exit differs from `201` | Task version or platform may wrap the child differently | Require nonzero and retain the Task version; keep engine exit `1` as the pinned contract. |
| Guard reports changed fixture or pin | Supplied boundary drifted | Preserve the attempt; reset from the original course helper. |
| Guard reports a remote | The no-remote boundary is broken | Do not let the helper repair it. Preserve the config and use a fresh attempt. |
| Install stops partway | Package graph is incomplete | Preserve output and reset; do not retry in place. |
| Session start names a newer CLI | PATH isolation is missing or edited | Preserve evidence and reset; do not widen the accepted versions. |
| Gated ritual fails | Mutation readiness was not established | Preserve the named prerequisite and reset; do not skip the ritual. |
| Archive refuses current directory | Your shell is inside the attempt parent | Return to the course root and retry the exact absolute root. |
| Task 5 reports `invalid JSON` | The authored artifact does not parse | Repair it in place, rerun the same command against the same path, and retain both exit codes. |
| Task 5 reports `narrative.Acceptance must be a string, got list` | Acceptance was written as a list | Give each item one Acceptance string; add items rather than list entries. |
| Task 5 reports `missing required top-level key` | The record lacks `xBRIEFInfo` | Add the envelope from the Module 6 worksheet; do not invent other keys. |
| Task 5 exits `0` but the record says `running` | Structure passed; the rubric did not | Restore `proposed`. The structural surface never inspects status, and a green result grants no authority. |

## Reset to start

Always use the original course helper, not the copy inside a possibly changed attempt:

```sh
fresh_root="$(node "$helper" reset "$first_root")"
test "$fresh_root" != "$first_root"
node "$helper" guard "$fresh_root"
```

Reset never mutates or removes the old attempt. Install the fresh root only if you choose to
repeat the lifecycle. A partial install is evidence; do not convert it into an unknown state
through incremental repair.

For recovery, reset authenticates only the exact canonical temporary target, marker binding,
Git root, `training/module-07` branch, and empty remote. It deliberately does not require a
healthy package graph, fixture digest, or lifecycle pair before preserving the old attempt
and creating a new one.

## Cleanup

Cleanup is recoverable archive, not deletion. From the course root, pass exactly one explicit
absolute canonical repository path:

```sh
first_archive="$(node "$helper" archive "$first_root")"
second_archive="$(node "$helper" archive "$second_root")"
test -d "$first_archive/repo"
test -d "$second_archive/repo"
```

The helper rechecks the same exact target identity, branch, and no-remote boundary used for
recovery. It does not require damaged package or lifecycle state to look healthy before
preserving it. It refuses a caller anywhere inside the attempt parent and an existing
destination, then moves the exact parent—repository, marker, and evidence—under
`3ci-directive-lab-archive` in the operating-system temporary directory. Record the archive
paths. The archive remains recoverable until an operator applies their normal retention
policy outside this course.

## Native Windows PowerShell 7.4+ route

Run this from the curriculum repository. It covers starting state, execution,
acceptance, fresh reset, and recoverable archive without spoofing the platform:

```powershell
$ErrorActionPreference = "Stop"
$CourseRoot = (Resolve-Path -LiteralPath .).Path
$Helper = Join-Path $CourseRoot "labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs"
$Launcher = Join-Path ([IO.Path]::GetTempPath()) ("3ci-lab07-launch-" + [guid]::NewGuid().ToString("N"))
[void](New-Item -ItemType Directory -Path $Launcher)
Set-Location -LiteralPath $Launcher
$LabRoot = ((& node $Helper create) | Out-String).Trim()
& node $Helper guard $LabRoot
& node $Helper install $LabRoot
& node $Helper run $LabRoot --intent=implement
if ($LASTEXITCODE -ne 0) { throw "Lab 7 lifecycle execution failed." }
$EvidenceRoot = Join-Path (Split-Path -Parent $LabRoot) "evidence"
foreach ($Name in "proposed-preflight.json", "lifecycle-run.json") {
  if (-not (Test-Path -LiteralPath (Join-Path $EvidenceRoot $Name) -PathType Leaf)) { throw "Missing $Name" }
}
$Authored = Join-Path $LabRoot "xbrief/proposed/2026-01-15-your-proposed-scope.xbrief.json"
if (-not (Test-Path -LiteralPath $Authored -PathType Leaf)) { throw "Write your Module 6 proposed scope to $Authored first." }
$Cli = Join-Path $LabRoot "node_modules/@deftai/directive/dist/bin.js"
$AuthoredRecord = Join-Path $EvidenceRoot "authored-verify.txt"
$AuthoredCommand = "node $Cli xbrief:verify -- --format json --out $Authored --style scope --project-root $LabRoot"
$Lab07ExpectedFailurePreference = $PSNativeCommandUseErrorActionPreference
try {
  $PSNativeCommandUseErrorActionPreference = $false
  & node $Cli xbrief:verify -- --format json --out $Authored --style scope --project-root $LabRoot *> $AuthoredRecord
  $AuthoredExit = $LASTEXITCODE
} finally {
  $PSNativeCommandUseErrorActionPreference = $Lab07ExpectedFailurePreference
}
Add-Content -LiteralPath $AuthoredRecord -Value "path=$Authored", "command=$AuthoredCommand", "exit=$AuthoredExit"
if ($AuthoredExit -ne 0) { throw "Authored scope failed structural verification. See $AuthoredRecord." }
$FreshRoot = ((& node $Helper reset $LabRoot) | Out-String).Trim()
if ([StringComparer]::OrdinalIgnoreCase.Equals($FreshRoot, $LabRoot)) { throw "Reset reused the original root." }
& node $Helper guard $FreshRoot
Set-Location -LiteralPath $CourseRoot
$FirstArchive = ((& node $Helper archive $LabRoot) | Out-String).Trim()
$SecondArchive = ((& node $Helper archive $FreshRoot) | Out-String).Trim()
foreach ($Archive in $FirstArchive, $SecondArchive) {
  if (-not (Test-Path -LiteralPath (Join-Path $Archive "repo") -PathType Container)) { throw "Archive is incomplete." }
}
```

The lifecycle record must show proposed preflight refusal, promotion, activation,
session readiness, active preflight, completion, and cancellation in order. The Windows route
invokes the pinned CLI entry point directly because the `.bin` launcher differs by platform.

## Explained solution

After about ten minutes of genuine work, compare your evidence with the
[explained solution](../solutions/lab-07-scope-lifecycle.md). Opening it is never instructor-
gated; reading it alone does not complete an outcome.

## Done statement

Use this form without widening the claim:

> **O7.1** proposed preflight failed with pinned exit 1 and retained Task failure evidence;
> **O7.2** Task lifecycle transitions produced matching completed and cancelled pairs;
> **O7.3** current intent, session gates, and active preflight passed in order; **O7.4** a
> fresh root preserved the original evidence and both attempts are retained or recoverably
> archived. My own Module 6 proposed scope passed `xbrief:verify` at a retained path with a
> retained command, exit code, and result, and stayed in `proposed/`. No remote or product
> implementation occurred, and no structural result granted lifecycle authority.

That claim stops at local lifecycle closeout. This lab has no remote, so it claims no
leftover completion and no tracked closeout: whether a recorded `completed/` artifact is
itself tracked on a configured delivery branch is decided by `verify:completed-tracked`,
which [Module 12](../curriculum/modules/12-review-and-completion.md) covers. That gate reads a
remote delivery tip, so it is not part of this no-remote sequence and you do not run it here.
