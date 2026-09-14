# Lab {{LAB_NUMBER}} — {{LAB_TITLE}}

> **Authoring template — not learner-ready.** Replace every `{{...}}` authoring marker, run the lab from a fresh disposable repository, and remove this notice before adding the lab to learner navigation.

## Lab record

| Field | Required value |
|---|---|
| Stable ID | `lab-{{NN}}-{{kebab-case-topic}}` |
| Supports | Module and outcome IDs that this lab evaluates |
| Status | `draft`, `learner-ready draft`, `verified`, or `retired` |
| Last verified | `YYYY-MM-DD` |
| Directive baseline | Exact package and engine versions plus a link to the source baseline |
| Duration | Setup, task, checking, and cleanup time |
| Platforms verified | macOS with zsh, Linux with bash, and Windows with PowerShell 7; remove any platform that was not tested and state the limitation |

## Goal and done condition

**Goal:** `{{ONE_PRACTICAL_RESULT_TIED_TO_THE_MODULE_OUTCOMES}}`

**Done:** the required artifacts exist, every literal acceptance command exits as stated, the evidence bundle is complete, and the cleanup state is recorded. Completing the task list without those results is not done.

## Fictional scenario

`{{A_SMALL_NON_SENSITIVE_SCENARIO_WITH_FICTIONAL_PEOPLE_ORGANIZATION_DATA_AND_REPOSITORY}}`

The scenario must work with invented data. Do not require client information, internal business source, production logs, confidential backlog items, credentials, or a live service.

## Environment and starting-state check

### Required environment

- A new disposable local repository created with [the lab environment model](../labs/README.md).
- `{{REQUIRED_RUNTIME_AND_VERSION}}`.
- `{{REQUIRED_CLI_AND_PIN}}`.
- No Git remote and no production or client credentials.

### Confirm your location

Run the platform-specific commands supplied by this lab:

```text
{{LITERAL_LOCATION_CHECK_COMMANDS}}
```

Expected evidence:

- The repository root is the unique lab directory created for this attempt.
- The path is not this curriculum repository and is not nested in a business repository.
- `git remote` prints no remote names.
- `git status --short` matches `{{EXPECTED_START_STATUS_OR_EXPLICIT_ALLOWED_DIFFERENCE}}`.

If any condition differs, stop. Do not try to make the current directory disposable. Create a new lab directory and repeat the check.

### Confirm the tools

```text
{{LITERAL_VERSION_AND_HELP_COMMANDS}}
```

**Pass:** `{{EXACT_EXPECTED_VERSION_OR_HELP_SURFACE}}`

**Recovery:** `{{INSTALL_OR_VERSION_ALIGNMENT_PATH_THAT_DOES_NOT_REQUIRE_GUESSING}}`

## Safety boundary

- Work only inside the disposable directory created for this lab. Never initialize, reset, clean, or implement inside this curriculum repository or a business repository.
- Do not add or push a remote. Do not open a pull request, deploy, publish, release, or call a production service.
- Use only the fictional data in this lab. Never paste credentials, client data, proprietary source, production logs, or confidential issue content into an artifact or evidence bundle.
- Mutations are limited to: `{{EXACT_RELATIVE_PATH_ALLOWLIST}}`.
- Product commands in this lab are claims about the pinned release only. Confirm syntax with the recorded help surface when output differs.

Stop and use the reset path if a command would cross this boundary. A surprising prompt, path, remote, or credential request is a stop signal, not an invitation to improvise.

## Starting checkpoint

Before the exercise, create or confirm the lab's named checkpoint:

The literal sequence must show the pre-stage status, prove framework deposits,
caches, session state, and USER.md are ignored, stage an explicit relative-path
allowlist, and show `git diff --cached --name-only` before the local commit. Do
not use `git add --all`.

```text
{{LITERAL_CHECKPOINT_COMMANDS}}
```

Checkpoint name: `{{CHECKPOINT_NAME}}`

Checkpoint evidence: `{{COMMAND_AND_EXPECTED_OUTPUT_THAT_IDENTIFIES_THE_CHECKPOINT}}`

The checkpoint must contain only fictional fixture data. It must be sufficient to reproduce the starting state without an instructor.

## Tasks

Each task states an outcome. You may choose the execution path unless the named technique is itself being assessed.

### Task 1 — {{TASK_1_TITLE}}

**Produce:** `{{EXACT_ARTIFACT_OR_STATE}}`

**Constraints:** `{{BOUNDARIES_OR_STATE_TO_PRESERVE}}`

**Checkpoint:** run `{{LITERAL_TASK_1_CHECK}}`. Continue only when `{{EXPECTED_TASK_1_RESULT}}`.

**Keep as evidence:** `{{TASK_1_EVIDENCE}}`

### Task 2 — {{TASK_2_TITLE}}

**Produce:** `{{EXACT_ARTIFACT_OR_STATE}}`

**Constraints:** `{{BOUNDARIES_OR_STATE_TO_PRESERVE}}`

**Checkpoint:** run `{{LITERAL_TASK_2_CHECK}}`. Continue only when `{{EXPECTED_TASK_2_RESULT}}`.

**Keep as evidence:** `{{TASK_2_EVIDENCE}}`

### Task 3 — {{TASK_3_TITLE_OR_REMOVE}}

**Produce:** `{{EXACT_ARTIFACT_OR_STATE}}`

**Constraints:** `{{BOUNDARIES_OR_STATE_TO_PRESERVE}}`

**Checkpoint:** run `{{LITERAL_TASK_3_CHECK}}`. Continue only when `{{EXPECTED_TASK_3_RESULT}}`.

**Keep as evidence:** `{{TASK_3_EVIDENCE}}`

Remove unused task sections. Do not leave a learner with an implied task or an undocumented intermediate state.

## Checkpoints

| Checkpoint | Observable state | How to verify | If it fails |
|---|---|---|---|
| Start | `{{KNOWN_START_STATE}}` | `{{LITERAL_START_CHECK}}` | Use “Reset to start” |
| After Task 1 | `{{STATE_AFTER_TASK_1}}` | `{{LITERAL_TASK_1_CHECK}}` | Use Hint 1, then Task 1 recovery |
| After Task 2 | `{{STATE_AFTER_TASK_2}}` | `{{LITERAL_TASK_2_CHECK}}` | Preserve evidence and use the matching recovery |
| Final | `{{FINAL_STATE}}` | Run every acceptance command below | Compare evidence before opening the solution |

## Literal acceptance commands

Run these commands exactly from `{{EXACT_WORKING_DIRECTORY}}`. Replace this template block with real commands before publication. Do not publish prose such as “run the tests” in place of a literal command.

### macOS and Linux

```sh
{{LITERAL_ACCEPTANCE_COMMAND_1}}
{{LITERAL_ACCEPTANCE_COMMAND_2}}
{{LITERAL_ACCEPTANCE_COMMAND_3_OR_REMOVE}}
```

### Windows PowerShell 7

```powershell
{{LITERAL_ACCEPTANCE_COMMAND_1_POWERSHELL}}
{{LITERAL_ACCEPTANCE_COMMAND_2_POWERSHELL}}
{{LITERAL_ACCEPTANCE_COMMAND_3_POWERSHELL_OR_REMOVE}}
```

| Command | Required exit code | Required output or state | Outcome proved |
|---|---:|---|---|
| `{{COMMAND_1_SHORT_NAME}}` | `0` | `{{EXACT_SIGNAL_WITH_ALLOWED_VARIATION}}` | `{{OUTCOME_ID}}` |
| `{{COMMAND_2_SHORT_NAME}}` | `0` | `{{EXACT_SIGNAL_WITH_ALLOWED_VARIATION}}` | `{{OUTCOME_ID}}` |
| `{{COMMAND_3_SHORT_NAME_OR_REMOVE}}` | `{{EXPECTED_CODE}}` | `{{EXACT_SIGNAL_WITH_ALLOWED_VARIATION}}` | `{{OUTCOME_ID}}` |

If a command returns a different result, the lab is not complete. Record the command, exit code, and relevant output. Do not hide errors, skip checks, or substitute a similar command.

## Evidence bundle

Keep the smallest evidence set that proves the outcomes:

- Lab stable ID, Directive baseline, operating system, shell, and attempt date.
- `{{FINAL_ARTIFACT_OR_NARROW_DIFF}}`.
- Each literal acceptance command, its exit code, and the relevant output.
- `{{DECISION_OR_EXPLANATION_TIED_TO_AN_OUTCOME}}`.
- Reset and cleanup status.

Do not include access tokens, environment dumps, Git credential output, client data, proprietary code, or unrelated files. Evidence may remain local unless a separate, authorized 3Ci process names an approved destination.

## Progressive hints

Spend `{{SUGGESTED_FIRST_ATTEMPT_MINUTES}}` minutes on the tasks before opening a hint. Use one level at a time.

### Hint 1 — model

`{{POINT_TO_THE_RELEVANT_MENTAL_MODEL}}`

### Hint 2 — inspection

`{{NAME_A_SAFE_COMMAND_FILE_OR_OUTPUT_TO_INSPECT}}`

### Hint 3 — partial route

`{{GIVE_A_PARTIAL_SEQUENCE_OR_EXAMPLE_WITHOUT_THE_FINISHED_ARTIFACT}}`

After Hint 3, use the failure table. The explained solution is always available after the suggested first attempt; no instructor unlock is required.

## Expected failures and recovery

| Symptom | Confirm the cause | Recovery | Evidence after retry |
|---|---|---|---|
| `{{FAILURE_1}}` | `{{SAFE_DIAGNOSTIC_1}}` | `{{BOUNDED_RECOVERY_1}}` | `{{PASS_SIGNAL_1}}` |
| `{{FAILURE_2}}` | `{{SAFE_DIAGNOSTIC_2}}` | `{{BOUNDED_RECOVERY_2}}` | `{{PASS_SIGNAL_2}}` |
| `{{FAILURE_3_OR_REMOVE}}` | `{{SAFE_DIAGNOSTIC_3}}` | `{{BOUNDED_RECOVERY_3}}` | `{{PASS_SIGNAL_3}}` |

Recovery instructions must say whether they preserve or replace the current attempt. They must not depend on an instructor, private chat, or undocumented file.

## Reset to start

The default full reset is a fresh disposable directory. Keep the failed attempt until you have copied the useful error evidence, then repeat the documented setup. This route avoids uncertain cleanup commands.

If the lab supports an in-place reset, it must provide all of the following:

1. A command that proves the current repository root and named checkpoint.
2. A literal allowlist of tracked paths to restore.
3. A preview command for each exact untracked path that will be removed.
4. A separate apply command limited to those exact paths.
5. The starting-state check to run again.

```text
{{LITERAL_BOUNDED_RESET_COMMANDS_OR_EXPLICIT_FRESH_DIRECTORY_ONLY_STATEMENT}}
```

Never publish a broad deletion, an unscoped `git clean`, a home-directory target, a workspace-root target, or a glob whose resolved paths are not shown first.

## Cleanup

Use the recoverable cleanup route in [the lab environment model](../labs/README.md): move the exact disposable directory into the operating system's temporary lab archive after recording its path and confirming that it has no remote. State every lab-specific process, container, port, or temporary artifact that must also be stopped or archived.

Lab-specific cleanup:

1. `{{STOP_EXACT_PROCESS_OR_WRITE_NONE}}`
2. `{{ARCHIVE_OR_REMOVE_EXACT_NAMED_ARTIFACT}}`
3. `{{VERIFY_NO_LAB_PROCESS_REMOTE_OR_ACTIVE_DIRECTORY_REMAINS}}`

Expected cleanup state: `{{OBSERVABLE_CLEANUP_RESULT}}`

## Explained solution

After a good-faith first attempt, compare your work with [the explained solution]({{RELATIVE_SOLUTION_PATH}}). The solution must explain its choices, show acceptance evidence, cover recovery, and describe valid alternatives. It must not only reveal final files or answers.

## Done statement

Fill this in after the acceptance and cleanup checks:

> I completed `{{LAB_STABLE_ID}}` against Directive `{{EXACT_BASELINE}}` on `{{PLATFORM_AND_SHELL}}`. All `{{COUNT}}` literal acceptance commands returned the required results. My evidence covers outcomes `{{OUTCOME_IDS}}`. The disposable repository is `{{ARCHIVED_OR_RETAINED_FOR_RETRY}}` at `{{EXACT_NON_SENSITIVE_LOCATION}}`, and it has no remote or credentials.

If any clause is not true, state the gap and return to the matching recovery step. Do not declare the lab done.

## Author release check

- Replace every `{{...}}` marker and remove unused optional sections. Run `rg -n '\{\{[^}]+\}\}' path/to/new-lab.md`; it must print nothing.
- Run the starting check, all task checkpoints, all acceptance commands, reset, and cleanup on every claimed platform.
- Confirm each command has an expected exit code and observable signal.
- Confirm the scenario and fixtures are fictional and self-contained.
- Confirm no step touches this curriculum repository, a business repository, a remote, production, or client data.
- Confirm all version-sensitive product statements and local requirements cite their sources.
- Confirm the lab and solution links work without an instructor.
