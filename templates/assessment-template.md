# Assessment {{ASSESSMENT_NUMBER}} — {{ASSESSMENT_TITLE}}

> **Authoring template — not learner-ready.** Replace every `{{...}}` authoring marker and remove this notice before listing the assessment as available. This template is not a completed assessment.

## Assessment record

| Field | Required value |
|---|---|
| Stable ID | `assessment-{{NN}}-{{kebab-case-topic}}` |
| Assesses | Module and outcome IDs |
| Status | `draft`, `learner-ready draft`, `verified`, or `retired` |
| Last verified | `YYYY-MM-DD` |
| Directive baseline | Exact package and engine versions plus the source-baseline link |
| Suggested duration | One realistic range, including evidence review |
| Attempt conditions | Open-book or closed-note, permitted tools, and disposable environment requirement |
| Explained solution | Relative path to the learner-accessible solution |

Use claim labels consistently:

- **[Directive behavior]** — verified behavior of the pinned Directive release.
- **[3Ci policy]** — a local expectation for this course or 3Ci work.
- **[Course guidance]** — advice about how to learn or attempt the assessment.

## Purpose

`{{WHAT_THE_ASSESSMENT_PROVES_AND_WHY_THE_EVIDENCE_IS_USEFUL}}`

This assessment measures practical outcomes. It does not measure confidence, memorized wording, attendance, or whether a learner followed one preferred path.

## Before you begin

1. Read the assessed outcomes below.
2. Create or confirm the named disposable repository if the assessment changes files.
3. Run `{{STARTING_STATE_CHECK}}`.
4. Keep a small evidence record with artifacts, observations, and written decisions. When the assessment runs commands, also keep their exit codes and relevant output.
5. Plan a first attempt of at least `{{SUGGESTED_FIRST_ATTEMPT_MINUTES}}` minutes before opening the solution.

**[3Ci policy]** Never perform the assessment in this curriculum repository or a business repository. Use only fictional data. Do not use credentials, production access, client information, proprietary source, production logs, or confidential backlog content.

## Outcomes and evidence map

Every assessed outcome must map to a practical task, falsifiable evidence, and useful feedback.

| Outcome ID | Observable outcome | Practical task | Evidence artifact | Literal validation or inspection | Feedback on a miss |
|---|---|---|---|---|---|
| `{{OUTCOME_1_ID}}` | `{{OUTCOME_1}}` | `{{TASK_1}}` | `{{EVIDENCE_1}}` | `{{EXACT_CHECK_1}}` | `{{SECTION_RECOVERY_OR_RETRY_1}}` |
| `{{OUTCOME_2_ID}}` | `{{OUTCOME_2}}` | `{{TASK_2}}` | `{{EVIDENCE_2}}` | `{{EXACT_CHECK_2}}` | `{{SECTION_RECOVERY_OR_RETRY_2}}` |
| `{{OUTCOME_3_ID_OR_REMOVE}}` | `{{OUTCOME_3}}` | `{{TASK_3}}` | `{{EVIDENCE_3}}` | `{{EXACT_CHECK_3}}` | `{{SECTION_RECOVERY_OR_RETRY_3}}` |
| `{{OUTCOME_4_ID_OR_REMOVE}}` | `{{OUTCOME_4}}` | `{{TASK_4}}` | `{{EVIDENCE_4}}` | `{{EXACT_CHECK_4}}` | `{{SECTION_RECOVERY_OR_RETRY_4}}` |

Keep only two to four outcomes. Do not add an assessment item that cannot point to one of them.

## Fictional work sample

### Scenario

`{{SELF_CONTAINED_FICTIONAL_SCENARIO}}`

### Provided state

`{{FILES_INPUTS_CONSTRAINTS_AND_EXPECTED_START_STATE}}`

### Required result

`{{ONE_COHERENT_RESULT_THE_LEARNER_MUST_PRODUCE}}`

### Preserve and avoid

- Preserve: `{{STATE_THAT_MUST_REMAIN_UNCHANGED}}`.
- Limit mutations to: `{{EXACT_RELATIVE_PATH_ALLOWLIST}}`.
- Do not add a remote, publish, deploy, or contact an external service.
- Do not infer missing business context. All facts needed to finish must be present in this assessment or linked learner material.

## Assessment tasks

### 1. {{PRACTICAL_TASK_TITLE}}

`{{EXACT_TASK_PROMPT_WITH_AN_OBSERVABLE_OUTPUT}}`

Keep: `{{EVIDENCE_TO_CAPTURE}}`

### 2. {{PRACTICAL_TASK_TITLE}}

`{{EXACT_TASK_PROMPT_WITH_AN_OBSERVABLE_OUTPUT}}`

Keep: `{{EVIDENCE_TO_CAPTURE}}`

### 3. {{PRACTICAL_TASK_TITLE_OR_REMOVE}}

`{{EXACT_TASK_PROMPT_WITH_AN_OBSERVABLE_OUTPUT}}`

Keep: `{{EVIDENCE_TO_CAPTURE}}`

Task wording may permit alternate methods. The validations below own the result.

## Literal validation or inspection

Every outcome needs an exact, reproducible validation. Use the command section
when execution is part of the outcome. For a command-free conceptual outcome,
remove the platform command blocks and use the inspection section instead.

### Command-based validation (remove if command-free)

Run the commands exactly from `{{WORKING_DIRECTORY}}`.

#### macOS and Linux

```sh
{{LITERAL_VALIDATION_COMMAND_1}}
{{LITERAL_VALIDATION_COMMAND_2}}
{{LITERAL_VALIDATION_COMMAND_3_OR_REMOVE}}
```

#### Windows PowerShell 7

```powershell
{{LITERAL_VALIDATION_COMMAND_1_POWERSHELL}}
{{LITERAL_VALIDATION_COMMAND_2_POWERSHELL}}
{{LITERAL_VALIDATION_COMMAND_3_POWERSHELL_OR_REMOVE}}
```

| Check | Required exit code | Passing signal | Outcome |
|---|---:|---|---|
| `{{CHECK_1}}` | `0` | `{{OUTPUT_OR_STATE_1}}` | `{{OUTCOME_1_ID}}` |
| `{{CHECK_2}}` | `0` | `{{OUTPUT_OR_STATE_2}}` | `{{OUTCOME_2_ID}}` |
| `{{CHECK_3_OR_REMOVE}}` | `{{EXPECTED_CODE}}` | `{{OUTPUT_OR_STATE_3}}` | `{{OUTCOME_3_ID}}` |

A similar command is not a substitute for a stated literal check. If a check fails, retain its command, exit code, and relevant output.

### Command-free inspection (remove if command-based)

| Inspection | Required observable condition | Evidence to retain | Outcome |
|---|---|---|---|
| `{{INSPECTION_1}}` | `{{OBSERVABLE_CONDITION_1}}` | `{{INSPECTION_EVIDENCE_1}}` | `{{OUTCOME_1_ID}}` |
| `{{INSPECTION_2}}` | `{{OBSERVABLE_CONDITION_2}}` | `{{INSPECTION_EVIDENCE_2}}` | `{{OUTCOME_2_ID}}` |

Perform each inspection exactly as stated. If an observation differs, preserve
the artifact and reasoning that expose the mismatch.

## Written reasoning prompts

Use one to three short prompts to test decisions that command output cannot prove.

1. `{{EXPLAIN_A_DECISION_AND_CITE_OBSERVED_EVIDENCE}}`
2. `{{DISTINGUISH_DIRECTIVE_BEHAVIOR_FROM_3CI_POLICY}}`
3. `{{DESCRIBE_A_SAFE_RECOVERY_FOR_A_GIVEN_FAILURE_OR_REMOVE}}`

Each acceptable answer must name the relevant evidence or source. Avoid trivia that a learner can answer without applying the module.

## Evidence submission

Create a local evidence note that contains:

- assessment stable ID and attempt date;
- Directive package and engine baseline;
- platform and shell when commands or environment behavior are relevant;
- each outcome ID with its artifact or written answer;
- each required validation and its result, including exit code and relevant output when a command ran;
- any failure encountered, recovery taken, and retry result;
- final cleanup or retained-sandbox status.

Do not capture secrets or unrelated repository data. Unless a separate authorized 3Ci process names an approved destination, the evidence stays local.

## Self-evaluation rubric

Evaluate each outcome independently.

| Result | Evidence standard | Next action |
|---|---|---|
| **Demonstrated** | The practical result is correct, the required command or inspection has the required result, and the explanation cites relevant evidence. | Continue. |
| **Nearly demonstrated** | The result is correct, but evidence or reasoning is incomplete. | Capture the missing evidence or revisit the named concept; do not redo unrelated work. |
| **Not yet demonstrated** | A required command or inspection fails, the result contradicts the source baseline, or the answer relies on an assumption. | Use the feedback map and recovery path, then retry that outcome. |
| **Blocked by environment** | The required tool or baseline cannot run even after the documented recovery. | Preserve the exact failure and stop. Do not score the outcome as a knowledge miss. |

The overall result is **ready to continue** only when every required outcome is Demonstrated. Do not average away an unmet safety or lifecycle outcome.

## Feedback map

Useful feedback names the claim, the evidence, and the next action.

| Observed evidence | Feedback | Recovery or study target | Retry scope |
|---|---|---|---|
| `{{COMMON_MISS_1}}` | “`{{WHAT_IS_WRONG_AND_WHY}}`” | `{{MODULE_SECTION_OR_RECOVERY_1}}` | `{{ONLY_THE_AFFECTED_OUTCOME}}` |
| `{{COMMON_MISS_2}}` | “`{{WHAT_IS_WRONG_AND_WHY}}`” | `{{MODULE_SECTION_OR_RECOVERY_2}}` | `{{ONLY_THE_AFFECTED_OUTCOME}}` |
| `{{VALID_ALTERNATIVE}}` | “This differs from the example but satisfies `{{OUTCOME_AND_GATE}}`.” | None | None |
| Environment failure | “The evidence does not yet distinguish setup failure from a knowledge gap.” | Starting-state recovery | Repeat the starting check, then retry the affected task |

Avoid feedback such as “incorrect,” “review the material,” or “try again” without naming the mismatch and a bounded next action.

## Progressive help and solution

1. Re-read only the outcome and its passing evidence.
2. Inspect the matching module section.
3. Use the assessment's first progressive hint: `{{HINT_1}}`.
4. Use the narrower hint: `{{HINT_2}}`.
5. After the suggested first attempt, open [the explained solution]({{RELATIVE_SOLUTION_PATH}}).

The solution is learner-accessible. No instructor, reviewer, or automation unlock is required. Comparing with a solution does not erase the attempt; the learner still retries the unmet outcome and records new evidence.

## Completion statement

> I completed `{{ASSESSMENT_STABLE_ID}}` against Directive `{{EXACT_BASELINE}}`. Outcomes `{{OUTCOME_IDS}}` are Demonstrated by `{{EVIDENCE_SUMMARY}}`. All `{{VALIDATION_COUNT}}` required validations returned the required results. The environment state is `{{CLEANUP_OR_SCRATCH_STATE}}`.

If that statement is not fully supported, record the specific outcome as Nearly demonstrated, Not yet demonstrated, or Blocked by environment.

## Author release check

- Replace every `{{...}}` marker and remove unused optional rows. Run `rg -n '\{\{[^}]+\}\}' path/to/new-assessment.md`; it must print nothing.
- Keep two to four outcomes and map every task, check, evidence item, and feedback path to them.
- Use practical work rather than recall-only questions.
- Run every literal command on every claimed platform. For a command-free outcome, test the stated inspection and retain its evidence.
- Test at least one expected miss and confirm the feedback leads to a successful retry.
- Confirm alternate correct approaches can pass.
- Confirm Directive behavior and 3Ci policy are separate and sourced.
- Confirm the learner can attempt, evaluate, recover, and continue without an instructor.
- Confirm no task requires business repositories, proprietary data, credentials, live deployment, or an external review bot.
