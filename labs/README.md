# Disposable lab environment

This guide defines the safe execution model for every hands-on exercise in the 3Ci Directive curriculum. Labs use fictional inputs in short-lived local Git repositories. A learner must be able to create, verify, reset, and clean up a lab without an instructor.

**Current status:** this guide remains the shared lab contract. The
[Module 2 disposable initialization lab](02-disposable-initialization.md) is a
learner-ready draft with local and native-matrix proof of the 0.112.0 pinned npm path on
macOS 15/zsh, Linux/bash on Ubuntu 24.04, and Windows/PowerShell 7.4+
on Windows Server 2022, dated 2026-09-07. Generic author
examples below are not substitutes for a released lab's
exact commands.

[Lab 5 — Projection drift recovery](05-projection-drift-recovery.md) is a
learner-ready draft verified on macOS/zsh only. It uses a minimal prepared
projection fixture and a guarded helper; Linux and native Windows execution
are not verified for Lab 5. Module 2's platform evidence does not transfer to it.

## Rule labels

- **[Directive behavior]** identifies a claim verified against the pinned Directive release. The current pin and evidence live in [the source baseline](../references/SOURCE-BASELINE.md).
- **[3Ci policy]** identifies a local safety or delivery requirement. It is not an upstream Directive guarantee.
- **[Course guidance]** identifies a recommended learning technique.

These labels are not interchangeable.

## Non-negotiable boundary

- **[3Ci policy]** Never initialize, reset, clean, or implement a lab in this curriculum repository.
- **[3Ci policy]** Never use a client repository, a 3Ci business repository, a production checkout, or a directory nested inside one.
- **[3Ci policy]** Use only fictional names, requirements, code, logs, and issue text supplied by the lab.
- **[3Ci policy]** Do not add a Git remote, use a credential, push, open a pull request, deploy, publish, release, or call a production service.
- **[3Ci policy]** Keep Directive cache, session, and framework-deposit state untracked.

If you cannot prove the current directory is the disposable repository named by the lab, stop. Create a new disposable directory. Do not try to make an uncertain checkout “safe enough.”

## Environment model

Each attempt has one isolated directory under the operating system's temporary area:

```text
OS temporary directory/
├── 3ci-directive-labs/
│   └── module-XX-<unique-id>/       # one active disposable Git repository
└── 3ci-directive-lab-archive/
    └── module-XX-<unique-id>/       # recoverable, inactive prior attempt
```

The lab instructions either create the fictional fixture in the active directory or copy a
named fixture read-only from this private curriculum clone. They never copy from a business
repository. A fixture must be reconstructible from checked-in instructions and fictional
data.

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

**[Directive behavior]** applies only where the course cites the pinned release. **[3Ci policy]** supplies the stricter repository and data boundaries above.

## Deterministic reset

Every lab provides Route A. It may also provide Route B when a tested, bounded
in-place reset adds value.

### Route A — fresh directory (default)

1. Preserve the failed command, exit code, relevant output, and any small diff needed for diagnosis.
2. Leave the failed directory unchanged.
3. Repeat “Create a disposable repository” with the same lab identifier.
4. Reapply the fictional fixture.
5. Run the full starting-state check.

This route replaces the attempt without deleting it. It is the safest choice when the current state or path is uncertain.

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

These routes move one exact directory; they do not permanently delete it. Use the operating system's managed temporary-file cleanup or your workstation's approved deletion process later. Review the exact archived path before permanent deletion.

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
3. Use Hint 1, then Hint 2, then Hint 3.
4. Match the symptom to the lab's recovery table.
5. Retry only the affected checkpoint.
6. If state remains uncertain, use Route A and start fresh.
7. After the suggested first attempt, open the explained solution.

No instructor or review bot is required. If the documented recovery still cannot reproduce the start state, record the environment as blocked rather than treating it as a knowledge failure.

## Lab navigation

| Resource | Availability | Use |
|---|---|---|
| This environment guide | Available | Create, verify, reset, and archive disposable attempts |
| [Module 1 — What Directive Is](../curriculum/modules/01-what-directive-is.md) | Available | Complete its embedded fictional classification exercise; it does not mutate a repository |
| [Lab 2 — Initialize a Disposable Directive Consumer](02-disposable-initialization.md) | Learner-ready draft; 0.112.0 pinned npm path verified on macOS 15/zsh, Linux/bash on Ubuntu 24.04, and Windows/PowerShell 7.4+ on Windows Server 2022 by local and native-matrix evidence | Use its exact fixture, guards, checkpoints, acceptance, reset, and archive path |
| [Module 4 — xBRIEF as Durable State](../curriculum/modules/04-xbrief-as-durable-state.md) | Available | Complete its embedded artifact-classification exercise without mutating a repository |
| [Lab 5 — Projection drift recovery](05-projection-drift-recovery.md) | Learner-ready draft; 0.112.0 pinned npm path verified on macOS 26.6.2/zsh only | Use its exact fixture, ordered tasks, evidence, fresh reset, and archive path |
| [Lab authoring template](../templates/lab-template.md) | Available to maintainers | Build a lab with tasks, checkpoints, literal gates, reset, cleanup, and a solution |
| Labs for Modules 6–11 and the capstone | Not yet available | Follow their module links from the [curriculum map](../curriculum/README.md) when released |

An entry marked “not yet available” is not completed curriculum.

## Maintainer acceptance

A lab is learner-ready only when:

- all setup, checkpoint, acceptance, reset, and cleanup commands were run on each claimed platform;
- a clean attempt and at least one recovery attempt both reach the stated done condition;
- every task maps to an observable outcome and evidence item;
- all paths and mutations stay inside a disposable repository;
- no remote, credential, client data, proprietary source, or live deployment is required;
- every Directive behavior claim cites the pinned baseline;
- every local constraint is labeled **[3Ci policy]**; and
- a learner can finish and diagnose common failures without an instructor.
