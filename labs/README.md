# Disposable lab environment

This guide defines the safe execution model for every hands-on exercise in the 3Ci Directive curriculum. Labs use fictional inputs in short-lived local Git repositories. A learner must be able to create, verify, reset, and clean up a lab without an instructor.

**Current status:** this guide remains the shared lab contract. The
[Module 2 disposable initialization lab](02-disposable-initialization.md) is a
learner-ready draft with current local proof of the 0.119.9 pinned fixture on
Windows/PowerShell. Published macOS/zsh, Linux/bash, and Windows/PowerShell walkthroughs
remain candidates. Generic author
examples below are not substitutes for a released lab's
exact commands.

[Lab 5 — Projection drift recovery](05-projection-drift-recovery.md) is a
learner-ready draft whose 0.119.9 fixture is verified on Windows/PowerShell.
It uses a minimal prepared projection fixture and a guarded helper;
Published shell walkthroughs and Linux and macOS execution are candidates for Lab 5. Historical platform evidence does not
transfer to the 0.119.9 baseline.

[Lab 7 — Scope lifecycle](07-scope-lifecycle.md) is a learner-ready draft
whose 0.119.9 fixture is verified on Windows/PowerShell. It uses an exact 0.119.9 package graph, isolated Task
PATH, guarded no-remote fixture, preserved failure evidence, fresh reset, and
recoverable archive. Published shell walkthroughs remain candidates.

[Lab 10 — Implementation golden path](10-implementation-golden-path.md) is a
learner-ready draft whose 0.119.9 fixture is verified on Windows/PowerShell. It retains readiness-before-mutation,
focused red-green behavior, a one-file product diff, paired evidence, fresh reset, and
recoverable archive. Published shell walkthroughs remain candidates.

[Lab 11 — Testing, gates, and evidence](11-testing-gates-and-evidence.md) is a
learner-ready draft whose 0.119.9 fixture is verified on Windows/PowerShell. It retains ordered red-green-refactor,
literal, forward-coverage, seeded aggregate-failure, final, and unchanged-gate evidence.
Published shell walkthroughs remain candidates.

## Non-negotiable boundary

- Never initialize, reset, clean, or implement a lab in this curriculum repository.
- Never use a client repository, a 3Ci business repository, a production checkout, or a directory nested inside one.
- Use only fictional names, requirements, code, logs, and issue text supplied by the lab.
- Do not add a Git remote, use a credential, push, open a pull request, deploy, publish, release, or call a production service.
- Keep Directive cache, session, and framework-deposit state untracked.

If you cannot prove the current directory is the disposable repository named by the lab, stop. Create a new disposable directory. Do not try to make an uncertain checkout “safe enough.”

## Environment model

Each attempt has one isolated directory under the operating system's temporary area.
Recoverable archives have three deliberately different identity classes:

```text
OS temporary directory/
├── 3ci-directive-module-02.<unique>/          # live Module 2 parent
├── 3ci-directive-lab05-<unique>/repo          # representative live shared-lab shape
├── 3ci-directive-capstone-<unique>/repo        # live capstone shape
├── 3ci-directive-module-02-archive.<unique>/
│   └── lab-parent/                  # one complete Module 2 parent
├── 3ci-directive-lab-archive/
│   ├── 3ci-directive-lab05-<unique>/
│   ├── 3ci-directive-lab07-<unique>/
│   ├── 3ci-directive-lab10-<unique>/
│   └── 3ci-directive-lab11-<unique>/
└── 3ci-directive-capstone-archive/
    └── 3ci-directive-capstone-<unique>/
```

Module 2 reclaims the unique archive root itself. Labs 5, 7, 10, and 11
reclaim only children of the shared lab archive whose module prefix matches the
invoked helper. The capstone reclaims only capstone children of its separate
archive. A helper never crosses these classes.

The lab instructions either create the fictional fixture in the active directory or copy a
named fixture read-only from this curriculum clone. They never copy from a business
repository. A fixture must be reconstructible from checked-in instructions and fictional
data.

## Disk capacity and ENOSPC recovery

Capacity is an environment prerequisite, not a fixed course number. On a
representative successful run, measure the fully installed current attempt and
one fully installed reset attempt on the same temporary volume. Then measure
the reset attempt's `.npm-cache` and `node_modules`; use the larger as
conservative npm extraction slack. Required headroom is:

```text
current attempt + one reset attempt + npm extraction slack
```

Before a first run, estimate from a recorded representative successful run on
the same environment class. A matching record must name its date, pinned
Directive version and package graph, filesystem, OS and architecture, runtime,
registry route, and all three measured terms.

If there is no matching record, use an approved bootstrap run on the intended
temporary volume: first reclaim or clear that volume through the documented
process, record its starting free bytes, then run one current install and one
reset install while monitoring free space after every command. Stop immediately
on `ENOSPC` and use the recovery below. The bootstrap does not verify the
capacity prerequisite until both installed trees and extraction slack have been
measured. If there is no matching record and no approved bootstrap volume with
recoverable headroom, remain environment-blocked until the workstation owner
provides one. Never treat a missing path as zero.

For Labs 5, 7, 10, 11, and the capstone, measure each attempt parent so its
marker and evidence are included. For Module 2, measure the two individual
`attempt-*` roots because they share one parent. These commands make the
measurement repeatable after the representative reset has been installed:

```sh
du -sk "$CURRENT_TREE" "$RESET_TREE"
du -sk "$RESET_ROOT/.npm-cache" "$RESET_ROOT/node_modules"
```

```powershell
function Get-LabTreeBytes([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) { throw "Measure only an existing installed tree: $Path" }
  $sum = (Get-ChildItem -LiteralPath $Path -File -Recurse -Force |
    Measure-Object -Property Length -Sum).Sum
  if ($null -eq $sum) { return 0 }
  return [int64]$sum
}
$CurrentBytes = Get-LabTreeBytes $CurrentTree
$ResetBytes = Get-LabTreeBytes $ResetTree
$NpmSlackBytes = [Math]::Max(
  (Get-LabTreeBytes (Join-Path $ResetRoot '.npm-cache')),
  (Get-LabTreeBytes (Join-Path $ResetRoot 'node_modules'))
)
$RequiredBytes = $CurrentBytes + $ResetBytes + $NpmSlackBytes
$RequiredBytes
```

Record the three measured terms with the environment evidence. Filesystem,
runtime, registry route, and package graph affect them, so there is no universal
20 GB minimum.

`ENOSPC` or “no space left on device” is an environment stop. Do not retry
`create`, `reset`, or Route A while the volume is full: each can require a new
directory and npm extraction space. Each executable helper instead supports:

```text
node <helper> reclaim
node <helper> reclaim --confirm <exact-older-archive-path-printed-by-preview>
```

The first command is read-only, creates no archive directory, and is safe when
the volume has no writable space. If it prints nothing, there is no helper-owned
archive to reclaim; remain environment-blocked until an operator makes space.
Review the output, then confirm only exact older archive destinations it
printed. Apply revalidates immediately before deletion and refuses a live
attempt, this curriculum clone, a repository with a remote, a symlink, an
identity mismatch, a relative path, or a path from another archive class.
An invalid matching entry is omitted instead of blocking other valid archive
destinations; confirming that omitted path is still refused.

After capacity returns, archive the live failed parent with the lab's
same-volume `archive` rename. Then use `reset <validated-archive-destination>`
or the lab's documented `create` path to allocate the fresh attempt.

The live failed parent here is one whose `create` command completed and printed
its repository root. `create` does not run package installation, so an ENOSPC
from the later `install` leaves the marker and Git identity that `archive`
validates even when the package tree is partial. If `create` itself stops before
returning a root, do not guess a temporary path or pass a partial directory to
`archive`; it contains no package-install payload. Reclaim a valid older archive
and, after capacity returns, rerun the documented `create` path. An approved OS
temporary cleanup can retire that incomplete launcher later.

Module 2 also seeds a reset sibling transactionally. If that seed stops before
Git initialization completes, the helper removes only the exact unpublished
sibling that it just created and preserves the previous valid marker. The
printed previous root can then be archived and reclaimed normally. If the
helper reports that rollback itself could not complete, do not archive the
parent; use the approved temporary-file cleanup on the named incomplete sibling
first.

Reclaim removes the confirmed archive and its contained cache only.
It never deletes a live cache. Every npm cache remains attempt-local.
Empty launcher directories are negligible bookkeeping and are not the primary remedy.

## Create a disposable repository

Replace `module-XX` with the lab identifier. These blocks show the required
shape for authors; a released lab must supply and verify the exact block for the
learner's shell.

### macOS or Linux with zsh/bash

```sh
LAB_PARENT="${TMPDIR:-/tmp}/3ci-directive-labs"
mkdir -p "$LAB_PARENT"
LAB_PARENT="$(cd "$LAB_PARENT" && pwd -P)"
LAB_DIR="$(mktemp -d "$LAB_PARENT/module-XX.XXXXXX")"
cd "$LAB_DIR"
LAB_DIR="$(pwd -P)"
git init
git switch -c training/module-XX
git rev-parse --show-toplevel
git remote
```

The final command must print nothing. The repository-root command must print the same canonical path stored in `LAB_DIR`.

Run these guards:

```sh
test "$(git rev-parse --show-toplevel)" = "$LAB_DIR"
test -z "$(git remote)"
```

Both commands must exit `0`. Also inspect the printed path. It must be the unique directory under `3ci-directive-labs`, not this course or a business checkout.

### Windows with PowerShell 7.4+

```powershell
$labParent = Join-Path ([System.IO.Path]::GetTempPath()) "3ci-directive-labs"
[void](New-Item -ItemType Directory -Force -Path $labParent)
$labParent = (Resolve-Path -LiteralPath $labParent).Path
$labDir = Join-Path $labParent ("module-XX-" + [guid]::NewGuid().ToString("N"))
[void](New-Item -ItemType Directory -Path $labDir)
Set-Location -LiteralPath $labDir
$labDir = (Resolve-Path -LiteralPath $labDir).Path
git init
git switch -c training/module-XX
git rev-parse --show-toplevel
git remote
```

The final command must print nothing. Run these guards:

```powershell
$repoRoot = (Resolve-Path -LiteralPath (git rev-parse --show-toplevel)).Path
if ($repoRoot -ne $labDir) { throw "Stop: current repository is not the disposable lab." }
if (@(git remote).Count -ne 0) { throw "Stop: disposable lab must not have a remote." }
```

Also inspect `$labDir`. It must be the unique directory under `3ci-directive-labs`, not this course or a business checkout.

## Apply the lab fixture

After the location guards pass, follow the lab's exact scaffold commands. A conforming lab:

- creates every required file from fictional content;
- names the allowed mutation paths;
- states the expected initial `git status --short` output;
- does not depend on an unpublished file, private chat, or instructor action;
- pins required runtime and Directive versions; and
- provides separate commands when zsh/bash and PowerShell 7.4+ syntax differs.

Do not improvise with a real repository when fixture setup fails. Preserve the error, use the documented fixture recovery, or create a new attempt.

## Record the starting checkpoint

When the lab asks for a Git checkpoint, use its exact checkpoint name and file
allowlist. Do not use `git add --all`. A released lab must provide literal,
platform-verified commands that perform this sequence:

1. show `git status --short` before staging;
2. prove that `.deft/core/`, `.deft/.cli/`, `.deft-cache/`, session state, and
   USER.md are ignored;
3. stage only the explicit fictional fixture and allowed Directive consumer
   artifacts named by the lab;
4. show `git diff --cached --name-only` and stop if any path falls outside that
   allowlist;
5. create the local checkpoint with the exact fictional identity named by the lab (for
   example, `3Ci Lab Learner <learner@example.invalid>`); and
6. verify the named checkpoint and the expected clean or documented working
   state.

The lab template requires those literal commands. This environment model does
not provide generic staging commands because the safe allowlist depends on the
fixture and released Directive layout.

If the lab uses another checkpoint, its instructions must name it. Never assume `lab-start` exists.

## Start check before every mutation

Run the lab's full starting-state check. At minimum, retain this evidence:

| Check | Passing evidence | Recovery |
|---|---|---|
| Repository identity | `git rev-parse --show-toplevel` resolves to the unique lab directory | Stop and create a new disposable repository |
| Remote boundary | `git remote` has no output | Do not remove a remote from an uncertain checkout; create a new lab |
| Working state | `git status --short` matches the lab's declared start | Use the lab's bounded reset or start again |
| Baseline | The installed Directive package and engine match the module record | Follow that lab's **Confirm the tools** recovery; if it is missing, the lab is not learner-ready |
| Fixture | The lab-specific start command exits `0` with the named signal | Use fixture recovery, then repeat all checks |

A start check is a gate. Reading the commands or seeing a plausible path is not a pass.

## During the lab

- Keep one active attempt per directory.
- Capture only the commands, exit codes, narrow output, and diffs that prove the learning outcomes.
- Before any file-changing command, confirm that its targets are inside the lab's relative-path allowlist.
- Use `directive --help`, `directive commands`, and `directive <verb> --help` when the lab tells you to confirm a version-sensitive command.
- Stop if output requests credentials, names a remote action, or points outside the lab.

Statements about Directive apply only where the course cites the pinned release.
The course's local requirements supply the stricter repository and data boundaries above.

## Deterministic reset

Every lab provides Route A. It may also provide Route B when a tested, bounded
in-place reset adds value.

### Route A — fresh directory (default)

1. Preserve the failed command, exit code, relevant output, and any small diff needed for diagnosis.
2. Leave the failed directory unchanged.
3. Repeat “Create a disposable repository” with the same lab identifier.
4. Reapply the fictional fixture.
5. Run the full starting-state check.

This route replaces the attempt without deleting it. It is the safest choice when the current state or path is uncertain, except during an `ENOSPC` / no-space-left environment stop. Route A allocates another tree, so reclaim must restore capacity first.

### Route B — bounded in-place reset (only when the lab supplies it)

The lab must name the starting checkpoint and every path that reset changes. The reset sequence must:

1. print the repository root and confirm the named checkpoint;
2. show `git status --short` and a narrow diff before changing anything;
3. restore only an explicit list of tracked relative paths;
4. preview every exact untracked path before removal;
5. remove only those exact paths after the preview matches; and
6. rerun the full starting-state check.

For example, a lab may preview and remove its one fictional output:

```sh
git clean -nd -- artifacts/fictional-result.json
git clean -fd -- artifacts/fictional-result.json
```

The second command is permitted only if the preview lists exactly that lab-owned path. A lab must never prescribe an unscoped `git clean`, `git reset --hard`, a recursive workspace deletion, a home-directory target, or a wildcard whose resolved paths were not reviewed.

## Recoverable cleanup

Cleanup deactivates the exact lab directory and preserves it briefly for recovery. First, run `git rev-parse --show-toplevel` and `git remote` again. Stop if the root differs from the recorded lab path or if any remote appears.

### macOS or Linux with zsh/bash

```sh
(
  set -eu
  CURRENT_ROOT="$(git rev-parse --show-toplevel)"
  test "$CURRENT_ROOT" = "$LAB_DIR"
  test -z "$(git remote)"
  test "$(dirname "$LAB_DIR")" = "$LAB_PARENT"
  cd "$LAB_PARENT"
  LAB_ARCHIVE="${TMPDIR:-/tmp}/3ci-directive-lab-archive"
  mkdir -p "$LAB_ARCHIVE"
  LAB_ARCHIVE="$(cd "$LAB_ARCHIVE" && pwd -P)"
  LAB_NAME="$(basename "$LAB_DIR")"
  test ! -e "$LAB_ARCHIVE/$LAB_NAME"
  mv -- "$LAB_DIR" "$LAB_ARCHIVE/"
  test ! -e "$LAB_DIR"
  test -d "$LAB_ARCHIVE/$LAB_NAME"
  printf 'Archived lab at %s/%s\n' "$LAB_ARCHIVE" "$LAB_NAME"
)
ARCHIVE_STATUS=$?
if test "$ARCHIVE_STATUS" -eq 0; then cd "$LAB_PARENT" || ARCHIVE_STATUS=$?; fi
if test "$ARCHIVE_STATUS" -eq 0; then unset LAB_DIR; fi
test "$ARCHIVE_STATUS" -eq 0
```

### Windows with PowerShell 7.4+

```powershell
$repoRoot = (Resolve-Path -LiteralPath (git rev-parse --show-toplevel)).Path
if ($repoRoot -ne $labDir) { throw "Stop: current repository is not the recorded disposable lab." }
if (@(git remote).Count -ne 0) { throw "Stop: disposable lab must not have a remote." }
if ((Split-Path -Parent $labDir) -ne $labParent) { throw "Stop: lab path left the temporary lab parent." }
Set-Location -LiteralPath $labParent
$labArchive = Join-Path ([System.IO.Path]::GetTempPath()) "3ci-directive-lab-archive"
[void](New-Item -ItemType Directory -Force -Path $labArchive)
$labArchive = (Resolve-Path -LiteralPath $labArchive).Path
$archivedPath = Join-Path $labArchive (Split-Path -Leaf $labDir)
if (Test-Path -LiteralPath $archivedPath) { throw "Stop: archive destination already exists." }
Move-Item -LiteralPath $labDir -Destination $archivedPath
if (Test-Path -LiteralPath $labDir) { throw "Stop: original lab path still exists after archive." }
if (-not (Test-Path -LiteralPath $archivedPath -PathType Container)) { throw "Stop: archived lab was not found." }
Write-Output "Archived lab at $archivedPath"
Remove-Variable labDir
```

These routes move one exact directory; they do not permanently delete it. For the six executable helpers, the bounded `reclaim` preview and exact confirmed apply above are the sanctioned in-course way to retire an older helper archive. For other labs, use the operating system's managed temporary-file cleanup or your workstation's approved deletion process later. Never substitute a broad temporary-directory deletion for either route.

A lab that starts a process, container, or local service must name an exact stop command and a command that proves the process stopped. “Close anything you started” is not sufficient.

## Evidence and privacy

The standard evidence bundle contains:

- lab stable ID and attempt date;
- Directive package and engine versions;
- operating system and shell;
- outcome-to-artifact mapping;
- literal acceptance commands, exit codes, and relevant output;
- failure, recovery, and retry evidence when applicable; and
- the final active, archived, or retained-for-retry state.

Keep evidence narrow. Do not record tokens, credential-manager output, full environment dumps, client information, proprietary source, production logs, or unrelated Git state. Evidence stays local unless an authorized 3Ci process names a destination.

## Independent recovery order

When a lab does not behave as documented:

1. Confirm the repository path, remote boundary, shell, runtime, and Directive baseline.
2. Read the exact error. Keep the command and exit code.
3. If the error is `ENOSPC` or “no space left on device,” stop before any Route A, `reset`, or `create`. Run the matching helper's read-only reclaim preview and confirm only an exact older archive if one is available. If a completed `create` printed the failed live root, archive the failed live parent after capacity returns and then reset. If `create` stopped before returning a root, do not guess a path; rerun `create` after reclaim restores capacity, as described above. Restart this order at step 1 with the fresh root.
4. For any other error, use Hint 1, then Hint 2, then Hint 3.
5. Match the symptom to the lab's recovery table.
6. Retry only the affected checkpoint.
7. If non-ENOSPC state remains uncertain, use Route A and start fresh.
8. After the suggested first attempt, open the explained solution.

No instructor or review bot is required. If the documented recovery still cannot reproduce the start state, record the environment as blocked rather than treating it as a knowledge failure.

## Lab navigation

| Resource | Availability | Use |
|---|---|---|
| This environment guide | Available | Create, verify, reset, and archive disposable attempts |
| [Module 1 — What Directive Is](../curriculum/modules/01-what-directive-is.md) | Available | Complete its embedded fictional classification exercise; it does not mutate a repository |
| [Lab 2 — Initialize a Disposable Directive Consumer](02-disposable-initialization.md) | Learner-ready draft; 0.119.9 fixture verified on Windows; published shell walkthroughs candidate | Use its exact fixture, guards, checkpoints, acceptance, reset, and archive path |
| [Module 4 — xBRIEF as Durable State](../curriculum/modules/04-xbrief-as-durable-state.md) | Available | Complete its embedded artifact-classification exercise without mutating a repository |
| [Lab 5 — Projection drift recovery](05-projection-drift-recovery.md) | Learner-ready draft; 0.119.9 fixture verified on Windows; published shell walkthroughs candidate | Use its exact fixture, ordered tasks, evidence, fresh reset, and archive path |
| [Lab 7 — Scope lifecycle](07-scope-lifecycle.md) | Learner-ready draft; 0.119.9 fixture verified on Windows; published shell walkthroughs candidate | Use its guarded no-remote fixture, Task-driven transitions, retained evidence, fresh reset, and recoverable archive |
| [Lab 10 — Implementation golden path](10-implementation-golden-path.md) | Learner-ready draft; 0.119.9 fixture verified on Windows; published shell walkthroughs candidate | Use its guarded no-remote fixture, readiness-before-mutation sequence, one-file diff, paired evidence, fresh reset, and recoverable archive |
| [Lab 11 — Testing, gates, and evidence](11-testing-gates-and-evidence.md) | Learner-ready draft; 0.119.9 fixture verified on Windows; published shell walkthroughs candidate | Use its guarded no-remote fixture, frozen focused test, ordered stage evidence, seeded aggregate failure, fresh reset, and recoverable archive |
| [Module 6 — Creating well-shaped work](../curriculum/modules/06-creating-well-shaped-work.md) | Available; command-free exercise | Complete its embedded vertical-slice worksheet; no lab fixture is required |
| [Module 8 — Session start and authorized work selection](../curriculum/modules/08-session-and-work-selection.md) | Available; command-free fixed-state exercise | Complete its embedded request-card matrix; no lab fixture is required |
| [Module 9 — Design-critique arcs and verified synthesis](../curriculum/modules/09-design-critique-arcs.md) | Available; command-free fixed-state practicum | Complete its embedded fictional critique packet; Module 9 has no lab fixture |
| [Module 12 — PR, review, and actual completion](../curriculum/modules/12-review-and-completion.md) | Available; command-free fixed-state exercise | Use the embedded fictional review packet and completion cards; Module 12 has no lab fixture |
| [Lab authoring template](../templates/lab-template.md) | Available to maintainers | Build a lab with tasks, checkpoints, literal gates, reset, cleanup, and a solution |
| [Capstone — End-to-End Solo Directive Lifecycle](capstone-end-to-end.md) | Learner-ready; guarded 0.119.9 fixture verified on Windows with one POSIX-only skip; published walkthroughs candidate | Use its exact two-hour orientation-to-local-closeout route, retained evidence, fresh reset drill, and recoverable archive of both attempts |

## Maintainer acceptance

A lab is learner-ready only when:

- all setup, checkpoint, acceptance, reset, and cleanup commands were run on each claimed platform;
- a clean attempt and at least one recovery attempt both reach the stated done condition;
- every task maps to an observable outcome and evidence item;
- all paths and mutations stay inside a disposable repository;
- no remote, credential, client data, proprietary source, or live deployment is required;
- every version-sensitive product statement cites the pinned baseline;
- every local constraint is explicit and cites its source; and
- a learner can finish and diagnose common failures without an instructor.
