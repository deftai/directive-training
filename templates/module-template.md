# {{MODULE_NUMBER}} — {{MODULE_TITLE}}

> **Authoring template — not learner-ready.** Replace every `{{...}}` authoring marker, verify every command and claim, and remove this notice before linking the module from learner navigation. A file that still contains an authoring marker is a draft, not completed curriculum.

## Module record

| Field | Required value |
|---|---|
| Stable ID | `module-{{NN}}-{{kebab-case-topic}}` — do not reuse or renumber after publication |
| Status | `draft`, `learner-ready draft`, `verified`, or `retired` |
| Last content update | `YYYY-MM-DD` |
| Last verified | `YYYY-MM-DD` — content, commands, and source baseline checked together |
| Directive baseline | Exact package and engine versions; replace `{{RELATIVE_SOURCE_BASELINE_PATH}}` with the destination-relative source-baseline path |
| Estimated duration | One realistic range that includes the exercise and self-check |
| Prerequisites | Prior modules, tools, and knowledge; write `None beyond course prerequisites` when none apply |

Use these labels whenever the module makes a rule or product claim:

- **[Directive behavior]** means behavior verified against the pinned Directive release or its official sources.
- **[3Ci policy]** means a local requirement for this private curriculum or 3Ci work. It is not upstream Directive behavior.
- **[Course guidance]** means a recommended learning technique or example. It is neither a product guarantee nor a 3Ci rule.

Do not blend the labels. If a sentence contains more than one kind of claim, split it into separate sentences.

## Learning outcomes

By the end of this module, you can:

1. `{{OBSERVABLE_OUTCOME_1}}`
2. `{{OBSERVABLE_OUTCOME_2}}`
3. `{{OBSERVABLE_OUTCOME_3_OR_REMOVE}}`
4. `{{OBSERVABLE_OUTCOME_4_OR_REMOVE}}`

Keep two to four outcomes. Start each outcome with an observable verb such as *classify*, *create*, *run*, *compare*, *diagnose*, or *explain with evidence*. Avoid outcomes such as “understand” or “be familiar with” unless an observable action follows them.

## Starting-state check

Complete this check before reading the main lesson. It should take no more than five minutes.

1. Confirm the prerequisite modules or knowledge: `{{PREREQUISITE_CHECK}}`.
2. Confirm the required tool or version: `{{VERSION_OR_HELP_CHECK}}`.
3. If the module changes files, confirm that the working directory is the disposable lab repository named by the exercise. It must not be this curriculum repository or any business repository.
4. Produce the starting evidence: `{{EXPECTED_STARTING_EVIDENCE}}`.

**Pass:** `{{OBSERVABLE_PASS_CONDITION}}`

**If the check does not pass:**

- A missing prerequisite → follow `{{PREREQUISITE_RECOVERY_LINK_OR_ACTION}}`, then repeat the check.
- A version mismatch → use the course baseline and the current released help surface. Do not guess from remembered syntax.
- The wrong working directory → stop. Follow the disposable lab setup at `{{RELATIVE_LAB_GUIDE_PATH}}`, then repeat the location check.
- A different failure → capture the command, exit code, and complete error text. Use the recovery table below before opening the solution.

## Why this matters

`{{TWO_TO_FOUR_SHORT_PARAGRAPHS_CONNECTING_THE_TOPIC_TO_SAFE_INDEPENDENT_DELIVERY}}`

Separate product facts from local expectations. Example structure:

- **[Directive behavior]** `{{VERIFIED_PRODUCT_FACT}}`
- **[3Ci policy]** `{{LOCAL_EXPECTATION_AND_REASON}}`
- **[Course guidance]** `{{WHEN_THE_TECHNIQUE_IS_USEFUL}}`

## Terminology

| Term | Meaning in this module | Claim type | Do not confuse it with |
|---|---|---|---|
| `{{TERM_1}}` | `{{PLAIN_LANGUAGE_DEFINITION}}` | Directive behavior / 3Ci policy / course guidance | `{{NEARBY_TERM}}` |
| `{{TERM_2}}` | `{{PLAIN_LANGUAGE_DEFINITION}}` | Directive behavior / 3Ci policy / course guidance | `{{NEARBY_TERM}}` |
| `{{TERM_3_OR_REMOVE}}` | `{{PLAIN_LANGUAGE_DEFINITION}}` | Directive behavior / 3Ci policy / course guidance | `{{NEARBY_TERM}}` |

Define a term on first use. Use the same term for the same concept throughout the module.

## Mental model

State one compact model that helps the learner predict behavior instead of memorizing commands.

`{{MENTAL_MODEL_IN_ONE_OR_TWO_SENTENCES}}`

Then test the model with one contrast:

| Situation | What the model predicts | Evidence the learner can inspect |
|---|---|---|
| `{{SITUATION_A}}` | `{{PREDICTION_A}}` | `{{FILE_COMMAND_OR_OUTPUT_A}}` |
| `{{SITUATION_B}}` | `{{PREDICTION_B}}` | `{{FILE_COMMAND_OR_OUTPUT_B}}` |

Name the limit of the model: `{{WHAT_THIS_MODEL_DOES_NOT_CLAIM}}`.

## Guided explanation

Teach the smallest set of ideas needed for the outcomes. Use short sections in this pattern.

### 1. {{CONCEPT_NAME}}

**Claim:** **[Directive behavior / 3Ci policy / Course guidance]** `{{ONE_CLEAR_CLAIM}}`

**Reason:** `{{WHY_THE_CLAIM_MATTERS}}`

**Evidence:** `{{PINNED_SOURCE_HELP_OUTPUT_OR_LOCAL_POLICY_LINK}}`

**Boundary:** `{{WHAT_THE_CLAIM_DOES_NOT_MEAN}}`

### 2. {{CONCEPT_NAME}}

Repeat the claim, reason, evidence, and boundary pattern. Add sections only when they support a stated outcome.

## Walkthrough

The walkthrough demonstrates the mental model before the independent exercise.

### Goal

`{{ONE_OBSERVABLE_WALKTHROUGH_RESULT}}`

### Safe setup

State the working directory and allowed mutation boundary. If files change, use a fictional disposable repository created through the lab model at `{{RELATIVE_LAB_GUIDE_PATH}}`. Never require a learner to modify this curriculum repository or a business repository.

### Actions and observations

1. **Action:** `{{EXACT_ACTION_OR_LITERAL_COMMAND}}`
   **Observe:** `{{EXPECTED_OUTPUT_OR_FILE_STATE}}`
   **Meaning:** `{{HOW_THE_OBSERVATION_SUPPORTS_THE_MENTAL_MODEL}}`
2. **Action:** `{{EXACT_ACTION_OR_LITERAL_COMMAND}}`
   **Observe:** `{{EXPECTED_OUTPUT_OR_FILE_STATE}}`
   **Meaning:** `{{HOW_THE_OBSERVATION_SUPPORTS_THE_MENTAL_MODEL}}`
3. **Checkpoint:** `{{A_COMMAND_OR_INSPECTION_THAT_PROVES_THE_WALKTHROUGH_RESULT}}`

If output varies by shell or host, give separate verified macOS/Linux and PowerShell 7 blocks. Do not imply that one untested command is portable.

## Exercise

### Fictional scenario

`{{NON_SENSITIVE_SCENARIO_WITH_NO_CLIENT_NAMES_SYSTEMS_LOGS_OR_BACKLOG_DATA}}`

### Your task

`{{AN_INDEPENDENT_TASK_THAT_REQUIRES_THE_LEARNER_TO_APPLY_THE_OUTCOMES}}`

### Constraints

- Work only inside the named disposable repository or with read-only course material.
- Do not add a Git remote, use credentials, deploy, publish, release, or contact a production service.
- Preserve `{{STATE_OR_ARTIFACT_THAT_MUST_NOT_CHANGE}}`.
- You may choose your method unless a specific method is itself part of the learning outcome.

### Evidence to keep

- `{{ARTIFACT_OR_DIFF}}`
- `{{COMMAND_AND_RELEVANT_OUTPUT}}`
- `{{SHORT_WRITTEN_EXPLANATION_OR_CLASSIFICATION}}`

### Exercise acceptance

| Outcome | Observable condition | Literal check or inspection |
|---|---|---|
| `{{OUTCOME_1_ID}}` | `{{FALSIFIABLE_RESULT}}` | `{{EXACT_COMMAND_OR_FILE_PATH}}` |
| `{{OUTCOME_2_ID}}` | `{{FALSIFIABLE_RESULT}}` | `{{EXACT_COMMAND_OR_FILE_PATH}}` |
| `{{OUTCOME_3_ID_OR_REMOVE}}` | `{{FALSIFIABLE_RESULT}}` | `{{EXACT_COMMAND_OR_FILE_PATH}}` |

Step completion is not evidence. The observed result is evidence.

## Completion evidence

You have completed the module only when every retained outcome has evidence.

| Outcome | Evidence you must be able to show | Passing condition |
|---|---|---|
| `{{OUTCOME_1_ID}}` | `{{PRACTICAL_EVIDENCE}}` | `{{PASS_CONDITION}}` |
| `{{OUTCOME_2_ID}}` | `{{PRACTICAL_EVIDENCE}}` | `{{PASS_CONDITION}}` |
| `{{OUTCOME_3_ID_OR_REMOVE}}` | `{{PRACTICAL_EVIDENCE}}` | `{{PASS_CONDITION}}` |

Record command names, exit codes, and the small part of output that proves the claim. Do not capture secrets, client data, full environment dumps, or unrelated repository content.

## Progressive hints

Try the exercise for `{{SUGGESTED_FIRST_ATTEMPT_MINUTES}}` minutes before using a hint. Open one hint at a time.

### Hint 1 — choose a direction

`{{CONCEPTUAL_NUDGE_WITHOUT_NAMING_THE_ANSWER}}`

### Hint 2 — narrow the evidence surface

`{{FILE_HELP_COMMAND_OR_OBSERVATION_TO_INSPECT}}`

### Hint 3 — outline the approach

`{{ORDERED_APPROACH_OR_PARTIAL_EXAMPLE_WITHOUT_THE_FINAL_ARTIFACT}}`

If Hint 3 does not unblock you, compare your captured failure with the recovery table. The explained solution remains available; no instructor approval is required.

## Expected failures and recovery

| Symptom | Likely cause | Confirm with | Recovery | Retry evidence |
|---|---|---|---|---|
| `{{FAILURE_1}}` | `{{CAUSE_1}}` | `{{SAFE_DIAGNOSTIC}}` | `{{BOUNDED_RECOVERY}}` | `{{PASS_SIGNAL}}` |
| `{{FAILURE_2}}` | `{{CAUSE_2}}` | `{{SAFE_DIAGNOSTIC}}` | `{{BOUNDED_RECOVERY}}` | `{{PASS_SIGNAL}}` |
| `{{FAILURE_3_OR_REMOVE}}` | `{{CAUSE_3}}` | `{{SAFE_DIAGNOSTIC}}` | `{{BOUNDED_RECOVERY}}` | `{{PASS_SIGNAL}}` |

Recovery must preserve the learner's evidence when possible. Any destructive recovery must name the exact disposable target, offer a preview or recoverable route, and never use a broad workspace or home-directory deletion.

## Common misconceptions

| Misconception | Correct model | How to disprove it |
|---|---|---|
| `{{MISCONCEPTION_1}}` | `{{CORRECTION_1}}` | `{{SOURCE_OR_OBSERVATION_1}}` |
| `{{MISCONCEPTION_2}}` | `{{CORRECTION_2}}` | `{{SOURCE_OR_OBSERVATION_2}}` |
| `{{MISCONCEPTION_3_OR_REMOVE}}` | `{{CORRECTION_3}}` | `{{SOURCE_OR_OBSERVATION_3}}` |

## Self-assessment

Answer without reopening the lesson. Then verify against your evidence and the explained solution.

1. `{{QUESTION_THAT_REQUIRES_EXPLANATION_OR_CLASSIFICATION}}`
2. `{{QUESTION_THAT_REQUIRES_A_PRACTICAL_DECISION}}`
3. `{{QUESTION_THAT_REQUIRES_RECOVERY_OR_BOUNDARY_REASONING}}`

Use this result:

- **Ready to continue:** every answer cites correct evidence and every exercise check passes.
- **Revisit one section:** the result is correct but the explanation or evidence is incomplete.
- **Retry the exercise:** an acceptance check fails or the result depends on an unverified assumption.

Confidence alone is not completion evidence.

## Explained solution

After the suggested first attempt, use [the explained solution]({{RELATIVE_SOLUTION_PATH}}). The solution must explain its reasoning, show evidence, cover recovery, and accept alternate approaches that satisfy the same outcomes. It must not be a concealed instructor-only answer key.

## Navigation

- Previous: [{{PREVIOUS_MODULE_TITLE}}]({{PREVIOUS_MODULE_PATH}})
- Course map: [Core curriculum]({{RELATIVE_COURSE_MAP_PATH}})
- Next: [{{NEXT_MODULE_TITLE_OR_EXPLICIT_NOT_YET_AVAILABLE_LABEL}}]({{NEXT_MODULE_PATH_OR_COURSE_MAP}})
- Resume point: begin at the first outcome without passing evidence; do not repeat evidence you already retained unless the baseline changed.

## Official sources

Every Directive behavior claim must trace to the pinned release. Prefer released behavior and deterministic help output when prose disagrees.

| Claim supported | Source type | Pinned source, command, or heading | Verified date | Notes or disagreement |
|---|---|---|---|---|
| `{{CLAIM_1}}` | Directive behavior | `{{OFFICIAL_RELEASE_FILE_HEADING_OR_HELP_COMMAND}}` | `YYYY-MM-DD` | `{{NONE_OR_EXPLICIT_DISAGREEMENT}}` |
| `{{CLAIM_2}}` | Directive behavior | `{{OFFICIAL_RELEASE_FILE_HEADING_OR_HELP_COMMAND}}` | `YYYY-MM-DD` | `{{NONE_OR_EXPLICIT_DISAGREEMENT}}` |
| `{{LOCAL_RULE}}` | 3Ci policy | `{{LOCAL_POLICY_SOURCE}}` | `YYYY-MM-DD` | Not an upstream Directive guarantee |

Also link the course source baseline at `{{RELATIVE_SOURCE_BASELINE_PATH}}` and any relevant glossary entries. Do not cite remembered behavior, package internals outside the consumer path, or this module itself as authority for Directive behavior.

## Author release check

Before changing the status from `draft`:

- Confirm there are two to four observable outcomes.
- Remove every `{{...}}` marker and every optional row that is not used. Run `rg -n '\{\{[^}]+\}\}' path/to/new-module.md`; it must print nothing.
- Run every literal learner command from a fresh disposable environment on each claimed platform.
- Confirm all completion evidence maps to an outcome.
- Follow each recovery path from the failure state it claims to repair.
- Verify every Directive behavior claim against the recorded baseline.
- Confirm every 3Ci rule is labeled **[3Ci policy]**.
- Check all navigation and solution links.
- Confirm a learner can finish without an instructor, proprietary data, production access, or undocumented steps.
