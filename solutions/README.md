# Explained solutions

Solutions are part of the self-directed curriculum. They explain how and why a result satisfies the learning outcomes, how to recover from common failures, and how to judge valid alternatives. They are not instructor-only answer keys.

## Rule labels

- **[Directive behavior]** identifies a claim verified against the pinned Directive release and [source baseline](../references/SOURCE-BASELINE.md).
- **[3Ci policy]** identifies a local requirement for this curriculum or 3Ci work. It is not an upstream Directive guarantee.
- **[Course guidance]** identifies a recommended learning technique or example approach.

Every solution keeps these claim types separate.

## Available solutions

| Source | Solution | Status |
|---|---|---|
| [Module 1 — What Directive Is](../curriculum/modules/01-what-directive-is.md) | [Explained Module 1 solution](module-01-what-directive-is.md) | Available in the foundation milestone |
| [Module 2 — Installation and Project Anatomy](../curriculum/modules/02-installation-and-anatomy.md) | [Explained Lab 2 solution](lab-02-disposable-initialization.md) | Available; 0.112.0 pinned npm path verified on macOS 15/zsh, Linux/bash on Ubuntu 24.04, and Windows/PowerShell 7.4+ on Windows Server 2022 by local and native-matrix evidence |
| [Module 3 — Authority and Context](../curriculum/modules/03-authority-and-context.md) | [Explained Module 3 solution](module-03-authority-and-context.md) | Available; command-free exercise |
| Modules 4–11 and the capstone | Follow the [curriculum map](../curriculum/README.md) | Not yet available |

“Not yet available” is an explicit status. It does not represent completed or hidden content.

## When to open a solution

Each module, lab, or assessment gives a suggested first-attempt duration. Use that time to produce an artifact, decision, or failure record and to open progressive hints one at a time.

After that attempt, open the solution freely. No instructor, private message, reviewer, payment, or automation unlock is required. If you are blocked earlier, you may open it earlier; preserve the failure evidence first.

Opening a solution does not complete an outcome. Completion comes from retrying the task from a known state and producing the stated evidence.

## How to use a solution

1. Preserve your artifact, decision, and observed evidence. When the exercise runs commands, also preserve each command, exit code, and relevant output.
2. Read the solution's result summary and reasoning before copying any commands.
3. Compare starting states. A different baseline, shell, path, or fixture may explain different output.
4. Compare decisions and evidence, not wording.
5. Identify the smallest unmet outcome.
6. Use the matching recovery step.
7. For file-changing work, reset only the named lab paths or create a fresh disposable repository. For conceptual work, begin a fresh scratch note.
8. Retry the unmet outcome without copying the final artifact.
9. Perform the original acceptance commands or inspections.
10. Record the new evidence and cleanup state.

An alternate route is correct when it satisfies the same outcomes, safety boundary, and required validations. It need not match the example line for line.

## What every solution contains

A learner-ready explained solution includes:

- source exercise, stable ID, status, date, and exact Directive baseline;
- outcome-to-evidence mapping;
- controlling **[Directive behavior]** and **[3Ci policy]** claims with sources;
- the decision criteria, not only a sequence of commands;
- complete reproducible artifacts, commands, or inspection steps;
- predicted and observed evidence;
- the same commands or inspections used by the exercise;
- at least the expected failure and a bounded recovery;
- valid alternatives and the limits that would make them invalid;
- a retry plan, reset, cleanup, and next navigation.

A file that only reveals final answers is incomplete.

## Comparing evidence

Use this order:

| Compare | Question | Action when different |
|---|---|---|
| Baseline | Are package version, engine version, platform, and shell the same? | Align to the course pin or record an environment block. |
| Starting state | Did both attempts begin from the declared fixture and checkpoint? | Use the source exercise's start recovery. |
| Rule source | Is the decision based on Directive behavior, 3Ci policy, or course guidance? | Return to the cited source; do not blend claim types. |
| Artifact | Does your artifact satisfy the same observable condition? | Keep valid alternatives; change only what a gate disproves. |
| Validation or inspection | Did the exact command or stated inspection produce the required result? | Preserve the mismatch and follow its recovery. |
| Cleanup | Is the exact disposable directory archived, retained for retry, or otherwise handled as stated? | Finish the recoverable cleanup before declaring done. |

Textual similarity is not a gate. Observable outcomes are.

## Recovery policy

Solutions diagnose a failure by mechanism. “The command exited `1`” or “my classification differs” is a symptom, not a cause. A useful recovery names:

- the observed symptom;
- a safe command, source, or inspection that confirms the cause;
- a bounded repair inside the disposable repository;
- what evidence the repair preserves;
- the required retry validation and passing signal.

When file-changing state is uncertain, create a fresh disposable attempt. For
conceptual work, begin a fresh scratch note. Do not prescribe a broad deletion,
an unscoped `git clean`, `git reset --hard`, a home-directory target, a
workspace-root target, or an unresolved wildcard.

Use [the lab environment guide](../labs/README.md) for deterministic reset and recoverable cleanup.

## Version drift

**[Directive behavior]** in a solution is valid for the recorded baseline. If local output differs:

1. capture `directive --version`;
2. capture the relevant `directive <verb> --help` output;
3. compare both with [the source baseline](../references/SOURCE-BASELINE.md);
4. align to the course pin or record the attempt as blocked by environment; and
5. report the discrepancy through the repository's authorized maintenance path.

Do not silently update a solution from remembered behavior. Do not reinterpret a **[3Ci policy]** requirement as an upstream product feature.

## Safety and privacy

- **[3Ci policy]** Run solution commands only in the exercise's disposable local repository.
- **[3Ci policy]** Never run reset, cleanup, or implementation commands in this curriculum repository or a business repository.
- **[3Ci policy]** Use fictional data only. Do not copy client information, proprietary source, production logs, credentials, or confidential backlog content into an attempt or evidence note.
- **[3Ci policy]** Do not add a remote, push, open a pull request, deploy, publish, release, or contact production.

A solution must explain a safe local substitute if an upstream feature can perform a remote or destructive action.

## If the solution still does not unblock you

Work through this independent path:

1. Repeat the source exercise's location, remote, fixture, and version checks.
2. Compare the exact failure with the solution's expected failures.
3. Use a fresh disposable directory if the state cannot be explained.
4. Retry the smallest outcome and retain its full error, or revise the decision artifact when
   the exercise supplies a safe failure record instead of requiring live reproduction.
5. If the documented baseline cannot reproduce the solution, mark the environment blocked and preserve the evidence for curriculum maintenance.

Do not invent production access or use a business repository to work around a broken fixture. Environment failure is not a learner failure.

## For solution authors

Start with [the solution template](../templates/solution-template.md). Before listing a solution as available:

- run the worked approach and every applicable acceptance command or inspection from the stated starting environment;
- reproduce each documented failure when doing so is safe and intentional; for a supplied or
  unsafe-to-manufacture failure, validate its record, recovery decision, and observable retry
  gate instead;
- map every source outcome to practical evidence;
- explain the mental model and decision criteria;
- identify valid alternatives without weakening the gates;
- cite each Directive behavior claim against the pinned release;
- label every 3Ci rule as **[3Ci policy]**;
- confirm the source exercise, reset, cleanup, and next links work; and
- confirm that no instructor, proprietary data, business repository, live deployment, or external review bot is required.

Do not list a template with authoring markers as an available solution.

## Navigation

- Learn or resume: [curriculum map](../curriculum/README.md)
- Check outcomes: [assessments](../assessments/README.md)
- Prepare or reset an exercise: [disposable labs](../labs/README.md)
- Author a new solution: [solution template](../templates/solution-template.md)
