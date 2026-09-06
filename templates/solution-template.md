# Explained solution — {{MODULE_OR_LAB_TITLE}}

> **Authoring template — not a finished solution.** Replace every `{{...}}` authoring marker, verify the approach and evidence, and remove this notice before linking the solution.

## Solution record

| Field | Required value |
|---|---|
| Stable ID | `solution-{{MODULE_OR_LAB_STABLE_ID}}` |
| Solves | Module, lab, or assessment stable ID |
| Outcomes covered | Every outcome ID addressed by this solution |
| Status | `draft`, `learner-ready draft`, `verified`, or `retired` |
| Last verified | `YYYY-MM-DD` |
| Directive baseline | Exact package and engine versions plus the source-baseline link |
| Source exercise | Relative link to the exercise |

Claim labels used here:

- **[Directive behavior]** — verified behavior of the pinned Directive release.
- **[3Ci policy]** — a local requirement for this curriculum or 3Ci work.
- **[Course guidance]** — one useful approach, not a product guarantee.

## Before you use this solution

Spend `{{SUGGESTED_FIRST_ATTEMPT_MINUTES}}` minutes on the exercise and use its progressive hints first. Keep your artifacts, decisions, and observations so you can compare evidence rather than memory. When commands run, also keep failed commands, exit codes, and relevant output.

This is a suggestion, not an access gate. Open the solution whenever you need it. **[3Ci policy]** Solutions are available without instructor approval, private messages, or an automation unlock.

If you opened the solution before attempting the task, use it as a worked example. If the source exercise changes files, use its bounded reset or create a fresh disposable repository. For a conceptual exercise, begin with a fresh scratch note. Then complete the task without copying the final artifact or answer.

## Result summary

`{{TWO_TO_FOUR_SENTENCES_DESCRIBING_THE_SUCCESSFUL_RESULT_AND_THE_KEY_REASONING}}`

This solution is one valid route. The outcome checks, not textual similarity to this file, decide whether an alternate route is valid.

## Outcome map

| Outcome | How this solution demonstrates it | Evidence |
|---|---|---|
| `{{OUTCOME_1_ID}}` | `{{DECISION_OR_ACTION_1}}` | `{{ARTIFACT_COMMAND_OR_OUTPUT_1}}` |
| `{{OUTCOME_2_ID}}` | `{{DECISION_OR_ACTION_2}}` | `{{ARTIFACT_COMMAND_OR_OUTPUT_2}}` |
| `{{OUTCOME_3_ID_OR_REMOVE}}` | `{{DECISION_OR_ACTION_3}}` | `{{ARTIFACT_COMMAND_OR_OUTPUT_3}}` |
| `{{OUTCOME_4_ID_OR_REMOVE}}` | `{{DECISION_OR_ACTION_4}}` | `{{ARTIFACT_COMMAND_OR_OUTPUT_4}}` |

## Reasoning

### 1. Establish the controlling facts

List the facts the exercise provides and the source of each rule used.

- **[Directive behavior]** `{{VERIFIED_PRODUCT_FACT_AND_SOURCE}}`
- **[3Ci policy]** `{{LOCAL_REQUIREMENT_AND_SOURCE}}`
- **[Course guidance]** `{{OPTIONAL_TECHNIQUE_AND_WHY_IT_HELPS}}`

Do not turn a 3Ci preference into a Directive guarantee. If the result depends on a version-sensitive command, cite the pinned help output or official release source.

### 2. Choose an approach

`{{EXPLAIN_THE_DECISION_CRITERIA_AND_WHY_THIS_APPROACH_SATISFIES_THE_OUTCOMES}}`

Name at least one tempting approach that does not satisfy the task:

`{{REJECTED_APPROACH_AND_THE_SPECIFIC_GATE_OR_BOUNDARY_IT_BREAKS}}`

### 3. Predict the evidence

Before showing the commands or artifacts, state what should be observable:

- `{{PREDICTION_1}}`
- `{{PREDICTION_2}}`
- `{{PREDICTION_3_OR_REMOVE}}`

The learner can now compare the prediction with the actual output.

## Worked approach

Start from the exact starting state in the exercise. Include all required content; do not use ellipses where the learner needs a value or command to reproduce the result.

### Step 1 — {{STEP_TITLE}}

**Action**

```text
{{LITERAL_COMMAND_OR_COMPLETE_FILE_CONTENT}}
```

**Why:** `{{REASON_THIS_ACTION_SUPPORTS_AN_OUTCOME}}`

**Observe:** `{{EXPECTED_OUTPUT_OR_FILE_STATE}}`

### Step 2 — {{STEP_TITLE}}

**Action**

```text
{{LITERAL_COMMAND_OR_COMPLETE_FILE_CONTENT}}
```

**Why:** `{{REASON_THIS_ACTION_SUPPORTS_AN_OUTCOME}}`

**Observe:** `{{EXPECTED_OUTPUT_OR_FILE_STATE}}`

### Step 3 — {{STEP_TITLE_OR_REMOVE}}

Repeat the action, reason, and observation pattern only when the step contributes to an outcome.

## Acceptance evidence

Use the same commands or inspections stated in the exercise. Do not replace them with easier or merely similar checks.

| Validation or inspection | Required result | Relevant observed evidence | Outcome proved |
|---|---|---|---|
| `{{COMMAND_OR_INSPECTION_1}}` | `{{EXIT_CODE_OR_OBSERVABLE_RESULT_1}}` | `{{OBSERVED_EVIDENCE_1}}` | `{{OUTCOME_ID_1}}` |
| `{{COMMAND_OR_INSPECTION_2}}` | `{{EXIT_CODE_OR_OBSERVABLE_RESULT_2}}` | `{{OBSERVED_EVIDENCE_2}}` | `{{OUTCOME_ID_2}}` |
| `{{COMMAND_OR_INSPECTION_3_OR_REMOVE}}` | `{{EXIT_CODE_OR_OBSERVABLE_RESULT_3}}` | `{{OBSERVED_EVIDENCE_3}}` | `{{OUTCOME_ID_3}}` |

Show only the relevant output. Do not include tokens, credential details, full environment dumps, client data, proprietary code, or unrelated repository state.

## Compare with your attempt

Use the table to diagnose the smallest gap.

| Compare | Match means | Difference means | Next action |
|---|---|---|---|
| Starting state | Both attempts began from the same conditions. | The result may be an environment difference rather than a knowledge gap. | Run the starting-state recovery, then compare again. |
| Artifact or decision | Your work satisfies the same outcome. | Either your alternate is valid or one constraint differs. | Perform the stated validation; use its evidence to decide. |
| Validation or inspection | The same required result was observed. | The check or reasoning did not satisfy the same conditions. | Use the failure table below. |
| Relevant evidence | The observable evidence matches. | The product state or assumption differs. | Inspect the named source of truth; do not copy output into place. |

Write one sentence for each difference: “My result differs because `{{OBSERVED_CAUSE}}`; I will `{{BOUNDED_NEXT_ACTION}}`.”

## Valid alternatives

| Alternative | Why it also passes | Evidence required | When it would not pass |
|---|---|---|---|
| `{{ALTERNATIVE_1}}` | `{{OUTCOME_AND_GATE}}` | `{{EVIDENCE}}` | `{{BOUNDARY}}` |
| `{{ALTERNATIVE_2_OR_REMOVE}}` | `{{OUTCOME_AND_GATE}}` | `{{EVIDENCE}}` | `{{BOUNDARY}}` |

Do not reject a result only because it differs from the worked example. Do reject a result that fails an outcome, safety boundary, or required validation.

## Expected failures and recovery

### {{FAILURE_1_TITLE}}

- **Symptom:** `{{EXACT_ERROR_OR_OBSERVATION}}`
- **Cause:** `{{MECHANISM_NOT_JUST_THE_EXIT_STATUS}}`
- **Confirm:** `{{SAFE_DIAGNOSTIC}}`
- **Recover:** `{{BOUNDED_ACTION_THAT_PRESERVES_EVIDENCE_WHEN_POSSIBLE}}`
- **Retry:** `{{REQUIRED_VALIDATION_AND_PASSING_SIGNAL}}`

### {{FAILURE_2_TITLE}}

- **Symptom:** `{{EXACT_ERROR_OR_OBSERVATION}}`
- **Cause:** `{{MECHANISM_NOT_JUST_THE_EXIT_STATUS}}`
- **Confirm:** `{{SAFE_DIAGNOSTIC}}`
- **Recover:** `{{BOUNDED_ACTION_THAT_PRESERVES_EVIDENCE_WHEN_POSSIBLE}}`
- **Retry:** `{{REQUIRED_VALIDATION_AND_PASSING_SIGNAL}}`

### When the baseline differs

1. Capture `directive --version` and the relevant `directive <verb> --help` output.
2. Compare them with the course source baseline.
3. Use the version named by the course or stop and report the mismatch.
4. Do not silently rewrite the exercise around unverified newer behavior.

Any destructive recovery must target only the exact disposable lab directory or named paths. Prefer creating a fresh lab or moving the failed attempt to a temporary archive. Never prescribe a broad workspace or home-directory deletion.

## Misconceptions exposed by this exercise

| Misconception | What the evidence shows | Source |
|---|---|---|
| `{{MISCONCEPTION_1}}` | `{{CORRECT_MODEL_1}}` | `{{PINNED_SOURCE_OR_LOCAL_POLICY_1}}` |
| `{{MISCONCEPTION_2}}` | `{{CORRECT_MODEL_2}}` | `{{PINNED_SOURCE_OR_LOCAL_POLICY_2}}` |

## Retry plan

1. Preserve the failure evidence that helped you diagnose the gap.
2. For file-changing work, use the exercise's bounded reset or create a fresh disposable repository. For conceptual work, begin a fresh scratch note.
3. Retry only the unmet outcome first.
4. Perform its stated command or inspection.
5. When it passes, run the full acceptance set and record the cleanup state.

A successful retry needs new evidence. Reading the solution by itself does not demonstrate an outcome.

## Reset and cleanup

Follow the source exercise's exact reset and cleanup instructions. If the
exercise is conceptual, state that retry uses a fresh scratch note and that no
environment cleanup is required. State whether the worked solution creates any
additional process, path, or temporary artifact:

- Additional state: `{{EXACT_STATE_OR_NONE}}`
- Cleanup action: `{{RECOVERABLE_EXACT_ACTION}}`
- Cleanup evidence: `{{OBSERVABLE_RESULT}}`

The cleanup must leave this curriculum repository and all business repositories unchanged.

## Sources

| Claim | Type | Pinned source or policy | Verified date |
|---|---|---|---|
| `{{CLAIM_1}}` | Directive behavior | `{{OFFICIAL_RELEASE_FILE_HEADING_OR_HELP_COMMAND}}` | `YYYY-MM-DD` |
| `{{CLAIM_2}}` | Directive behavior | `{{OFFICIAL_RELEASE_FILE_HEADING_OR_HELP_COMMAND}}` | `YYYY-MM-DD` |
| `{{LOCAL_RULE}}` | 3Ci policy | `{{LOCAL_POLICY_SOURCE}}` | `YYYY-MM-DD` |

Link the course source baseline. Record any disagreement between prose and released behavior rather than concealing it.

## Continue

- Return to [the source exercise]({{RELATIVE_EXERCISE_PATH}}).
- Record the completion statement after all outcomes pass.
- Continue to [{{NEXT_MODULE_OR_COURSE_MAP_TITLE}}]({{NEXT_PATH}}).

## Author release check

- Replace every `{{...}}` marker and remove unused sections. Run `rg -n '\{\{[^}]+\}\}' path/to/new-solution.md`; it must print nothing.
- Cover every assessed outcome with reasoning and acceptance evidence.
- Reproduce the worked approach from a fresh disposable environment.
- Reproduce each documented failure and recovery.
- Distinguish valid alternatives from approaches that fail a gate.
- Confirm every Directive behavior and 3Ci policy claim is labeled and sourced.
- Confirm the solution is available after a suggested first attempt without instructor access.
- Confirm the solution uses only fictional data and requires no remote, deployment, credential, or proprietary source.
