# Assessments

Assessments show whether a learner can apply a module's outcomes and support the result with evidence. They are self-directed, practical, and recoverable. A learner does not need an instructor, reviewer, or review bot to attempt or evaluate one.

## Rule labels

- **[Directive behavior]** identifies a claim verified against the pinned Directive release and [source baseline](../references/SOURCE-BASELINE.md).
- **[3Ci policy]** identifies a local requirement for this private curriculum or 3Ci work. It is not an upstream Directive guarantee.
- **[Course guidance]** identifies a recommended learning technique.

An assessment must not present a 3Ci preference as Directive behavior.

## Available assessment path

| Module | Assessment | Evidence | Solution |
|---|---|---|---|
| [Module 1 — What Directive Is](../curriculum/modules/01-what-directive-is.md) | The module's “Exercise” and “Self-assessment” sections | A fictional scenario classification, rationale, and outcome checklist | [Explained Module 1 solution](../solutions/module-01-what-directive-is.md) |
| Modules 2–11 | Not yet available | None required yet | Follow availability from the [curriculum map](../curriculum/README.md) |

The foundation milestone embeds Module 1 assessment in the module so the lesson, attempt, feedback, and retry path stay together. Later standalone assessments will appear in this directory and will link back to their source modules. “Not yet available” is an explicit status, not completed content.

## How to complete an assessment

1. Read the module's two to four observable outcomes.
2. Run its starting-state check.
3. If files will change, create a disposable repository through [the lab environment guide](../labs/README.md).
4. Make a good-faith first attempt before opening the explained solution. Use the assessment's suggested time, not an arbitrary course-wide timer.
5. Capture the required artifact, decision, or observation for each outcome. When an outcome runs a command, also capture the literal command, exit code, and relevant output.
6. Perform every required literal command or stated inspection exactly as written.
7. Evaluate each outcome with the rubric below.
8. Use progressive hints and recovery for only the unmet outcome.
9. Compare with the explained solution, retry, and record new evidence.
10. Record the final scratch-note or disposable-environment state as directed.

The execution path may vary when the task allows it. The outcome and evidence gates do not vary.

## Evidence standard

Each outcome needs practical evidence. Reading the lesson, completing steps, or feeling confident is not enough.

| Outcome type | Useful evidence | Insufficient evidence |
|---|---|---|
| Classification or decision | The decision, its rule, and one source or observation that supports it | A label with no rationale |
| File or state change | A narrow diff or exact artifact plus the stated validation result | “I edited the file” |
| Command use | Literal command, exit code, and the relevant passing output | A screenshot with no command or result context |
| Recovery | Original symptom, diagnosed cause, bounded recovery, and passing retry | “It worked after I tried again” |
| Explanation | A short causal account tied to the mental model and evidence | Memorized wording without an observed example |

Keep evidence small enough to review. **[3Ci policy]** Do not include credentials, client information, proprietary source, production logs, confidential issue content, full environment dumps, or unrelated repository state. Evidence stays local unless a separate authorized 3Ci process names an approved destination.

## Self-evaluation

Score each outcome independently:

- **Demonstrated:** the practical result is correct, its required command or inspection has the required result, and the explanation cites relevant evidence.
- **Nearly demonstrated:** the result is correct, but one required evidence item or part of the reasoning is missing.
- **Not yet demonstrated:** a required command or inspection fails, the result conflicts with the pinned source, or the answer depends on an unverified assumption.
- **Blocked by environment:** the required pinned tool or fixture cannot run after the documented recovery. Preserve the failure; do not misclassify it as a knowledge miss.

You are ready to continue only when every required outcome is Demonstrated. Do not average an unmet safety, authority, or lifecycle outcome into a passing total.

## Feedback policy

Useful feedback has three parts:

1. **Claim:** name the outcome or decision that is incomplete.
2. **Evidence:** cite the observed artifact, command result, or missing proof.
3. **Next action:** point to one module section, hint, recovery step, or bounded retry.

Examples:

- Useful: “Your classification names the correct tool, but it does not distinguish the product behavior from the 3Ci policy. Revisit ‘Rule labels,’ add one source for each claim, and retry Outcome 2.”
- Useful: “The artifact is correct, but the stated acceptance command exited `1`. Use the failure table for that command and retain the error before retrying.”
- Not useful: “Incorrect. Review the material.”
- Not useful: “Follow the sample exactly.” An alternate approach passes when it satisfies the same outcome, safety boundary, and required validation.

The assessment itself must contain common-miss feedback. It cannot depend on an instructor to explain what a result means.

## Hints and solutions

Progressive help follows this order:

1. restate the relevant mental model;
2. name a useful evidence surface;
3. outline a partial route without giving the final artifact; and
4. link the explained solution after the suggested first attempt.

Solutions are visible and learner-accessible. Opening one is not a failure. After comparison, retry the unmet outcome from a known state and create fresh evidence. See the [solutions policy](../solutions/README.md).

## Version or environment mismatch

If the observed Directive command or behavior differs from an assessment:

1. capture `directive --version` and the relevant `directive <verb> --help` output;
2. compare them with the [source baseline](../references/SOURCE-BASELINE.md);
3. align to the course pin or record the environment as blocked;
4. do not guess at newer syntax or silently change the expected answer.

**[Directive behavior]** claims remain scoped to the recorded release. **[3Ci policy]** may be stricter and remains labeled separately.

## Safety boundary

- Complete file-changing work only in a disposable local repository.
- Never initialize, reset, clean, or implement in this curriculum repository or a business repository.
- Use fictional data only.
- Do not add a remote, push, open a pull request, deploy, publish, release, or use production credentials.
- Prefer a fresh disposable attempt when reset targets are uncertain.

These are **[3Ci policy]** requirements for the curriculum. They do not describe every capability of Directive.

## For assessment authors

Start with [the assessment template](../templates/assessment-template.md). An assessment is learner-ready only when:

- it names two to four source-module outcomes;
- every task maps to an outcome, practical evidence, a literal command or stated inspection, and feedback;
- starting state, allowed mutations, success, failure, reset, and cleanup are observable;
- every literal command was run on every claimed platform, while command-free outcomes name a reproducible inspection;
- an expected miss leads through the documented feedback to a successful retry;
- alternate valid approaches can pass;
- Directive behavior and 3Ci policy are labeled and sourced;
- the solution is available after a suggested first attempt; and
- no instructor, proprietary data, business repository, external review bot, or production action is required.

Do not list a template with authoring markers as an available assessment.

## Navigation

- Start or resume: [curriculum map](../curriculum/README.md)
- Prepare a safe exercise environment: [disposable labs](../labs/README.md)
- Compare and retry: [solutions](../solutions/README.md)
- Author a new assessment: [assessment template](../templates/assessment-template.md)
