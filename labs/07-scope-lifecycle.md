# Lab 7 — Observe Scope Lifecycle and Implementation Authorization

## Lab record

| Field | Value |
| --- | --- |
| Stable ID | `lab-07-scope-lifecycle` |
| Supports | O7.1 proposed failure, O7.2 lifecycle transitions, O7.3 current readiness, O7.4 evidence and recovery |
| Status | Learner-ready draft for the verified macOS/zsh path |
| Last verified | 2026-09-09 |
| Directive baseline | CLI/core/content/types `0.112.0`; [source baseline](../references/SOURCE-BASELINE.md) |
| Duration | 35–40 minutes, including install, prediction, evidence review, reset, and archive |
| Platforms verified | macOS 26.6.2, zsh 5.9, Node.js 24.18.0, npm 11.16.0, Git 2.50.1, go-task 3.50.0 |
| Candidate platforms | Linux/bash and native Windows/PowerShell are not verified or learner-ready for this lab |

The helper is course tooling; it does not add a new Directive feature.

On the native Windows candidate path, `create` and `guard` remain available for safe
inspection, but `install` stops before invoking npm with the learner-facing candidate-platform message above. Preserve
that attempt and continue on a verified environment; an `npm.cmd EINVAL` error is not the
intended platform boundary.

## Goal and done condition

Observe a real fail-closed proposed preflight, lifecycle-command transitions, the current
session gates, active preflight success, completion, and cancellation inside one fictional
no-remote repository.

**Done:** **O7.1** has the retained proposed failure; **O7.2** has folder/status evidence for
every transition; **O7.3** has explicit live intent followed by successful session and active
preflight gates; and **O7.4** has a different fresh reset root plus a retained or archived
original attempt.

## Fictional scenario

Northstar Lifecycle Lab is fictional. One scope represents completing a greeting exercise;
a second represents obsolete work that should be cancelled. The helper intentionally makes
no application edit. The observable product of this exercise is lifecycle evidence, not a
shipping claim.

Two minimal schema-0.8 scope records begin in `xbrief/proposed/` with
`plan.status: proposed`. Their lack of product acceptance items is intentional: the lab
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

**Pass:** install reports Directive 0.112.0 and the explicit local CLI reports engine
0.112.0. The helper uses the public npm registry, a lab-local cache, ignored runtime paths,
and a fictional local Git identity. It never changes the course checkout or global npm
configuration.

If install is partial, preserve its sanitized output and use the reset section. Do not use a
global Directive as a substitute; another version on `PATH` is exactly the ambiguity this
fixture excludes.

## Safety boundary

- Every mutation must stay inside the exact guarded temporary root or its
  named parent evidence directory.
- The fixture must remain private, on `training/module-07`, with no remote
  and exact CLI/core/content/types 0.112.0 pins.
- Do not use a business repository, client data, credentials, production
  logs, a remote action, deployment, publication, or release.
- Run `guard` before install, lifecycle execution, reset, or archive. A
  rejected guard is a stop, not a request to weaken the helper.
- Keep the supplied helper, safety module, package manifest, project
  definition, and story records unchanged. The exercise is observation, not fixture repair.

The guard rejects inherited Git redirection variables, noncanonical paths, symlinked
sensitive paths, a foreign marker, multiple story copies, folder/status disagreement, a
changed pin or helper, the wrong branch, and any remote. It reads Git override names but
never prints their values.

The local Task environment admits only this attempt's package launchers plus individually
resolved `node`, `task`, `npm`, `git`, `uv`, and optional `gh` tools. This prevents a newer
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
test -f "$lab_root/xbrief/completed/fictional-delivery.xbrief.json"
test -f "$lab_root/xbrief/cancelled/fictional-cancel.xbrief.json"
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

## Checkpoints

Stop and compare at these points:

1. **Boundary checkpoint:** canonical root, exact pin, feature branch, empty remote.
2. **Expected-failure checkpoint:** pinned exit `1` and nonzero Task exit are retained before
   lifecycle mutation.
3. **Transition checkpoint:** folder/status pairs match the completed and cancelled results.
4. **Readiness checkpoint:** live intent precedes session gates and active preflight success.
5. **Recovery checkpoint:** two different roots exist and the first evidence remains readable.

If a checkpoint fails, do not continue to make later green output conceal it.

## Literal acceptance commands

Run these from the course root with `helper`, `first_root`, and `second_root` still set:

```sh
node "$helper" guard "$first_root"
test -f "$(dirname "$first_root")/evidence/proposed-preflight.json"
test -f "$(dirname "$first_root")/evidence/lifecycle-run.json"
test -f "$first_root/xbrief/completed/fictional-delivery.xbrief.json"
test -f "$first_root/xbrief/cancelled/fictional-cancel.xbrief.json"
test -z "$(git -C "$first_root" remote)"
node "$helper" guard "$second_root"
```

- **O7.1:** the first two evidence files contain the expected proposed failure.
- **O7.2:** the completed and cancelled files pass the guard's folder/status check.
- **O7.3:** the lifecycle JSON records live intent, session gates, then active preflight.
- **O7.4:** both distinct roots pass their guards and the first evidence remains intact.

These commands do not install the second attempt or contact a remote.

## Evidence bundle

Retain:

- the exact `lab_root` and `second_root` paths;
- `evidence/proposed-preflight.json` with both failure exit surfaces;
- `evidence/lifecycle-run.json` with baseline, environment, ordered commands, outputs, exits,
  final pairs, live-intent boundary, and empty remote value;
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

## Expected failures and recovery

| Symptom | Interpretation | Recovery |
| --- | --- | --- |
| Proposed engine preflight exits `1` | Expected O7.1 behavior | Preserve it; the run continues through governed transitions. |
| Task failure exit differs from `201` | Task version or platform may wrap the child differently | Require nonzero and retain the Task version; keep engine exit `1` as the pinned contract. |
| Guard reports changed fixture or pin | Supplied boundary drifted | Preserve the attempt; reset from the original course helper. |
| Guard reports a remote | The no-remote boundary is broken | Do not let the helper repair it. Preserve the config and use a fresh attempt. |
| Install stops partway | Package graph is incomplete | Preserve output and reset; do not retry in place. |
| Session start names a newer CLI | PATH isolation is missing or edited | Preserve evidence and reset; do not widen the accepted versions. |
| Gated ritual fails | Mutation readiness was not established | Preserve the named prerequisite and reset; do not skip the ritual. |
| Archive refuses current directory | Your shell is inside the attempt parent | Return to the course root and retry the exact absolute root. |

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
> archived. No remote or product implementation occurred.
