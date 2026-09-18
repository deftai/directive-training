# Module 11 — Testing, Gates, and Evidence

## Module record

| Field | Value |
| --- | --- |
| Stable ID | `module-11-testing-gates-and-evidence` |
| Status | Learner-ready draft |
| Estimated time | 65 minutes |
| Directive baseline | `@deftai/directive@0.119.2`; see the [source baseline](../../references/SOURCE-BASELINE.md) |
| Prerequisite | [Module 10 — The Implementation Golden Path](10-implementation-golden-path.md) |
| Practical work | [Lab 11 — Testing, Gates, and Evidence](../../labs/11-testing-gates-and-evidence.md) |

## Learning outcomes

By the end of this module you can:

- **O11.5:** preserve an ordered `red -> green -> refactor` evidence trail and explain why the focused test freezes after red;
- **O11.6:** distinguish a focused check, literal acceptance, forward coverage, and the aggregate gate by the question each answers;
- **O11.7:** diagnose the first failing subcheck and repair the work, not the gate, while retaining gate-definition hashes; and
- **O11.8:** pair behavioral, sequence, diff, and gate-integrity evidence without overstating unexecuted platforms or future modules.

## Starting-state check

Before continuing, confirm that you completed Module 10 or can explain its readiness sequence. This module assumes you already know why an active scope, live implementation intent, and passing start gates precede product mutation.

Run file-changing exercises only through the supplied helper. It creates a unique OS-temporary no-remote repository; do not initialize or edit the curriculum repository for the exercise.

## Why this matters

A green focused test is valuable but narrow. It does not prove that the declared acceptance commands ran, that new source has a test partner, or that the repository's complete quality gate passes. Treating every green signal as interchangeable produces weak evidence and makes failures harder to diagnose.

A failing gate is evidence about the work. Preserve it, find the first failing subcheck, and change the governed work only. Never weaken a Taskfile, verifier, policy, test threshold, or required check merely to turn the result green.

## Terminology

- **Focused check:** the smallest test command that directly exercises the behavior under change.
- **Literal acceptance:** execution of the active xBRIEF's stored commands verbatim through `task deft:verify:ac -- <active-xbrief>`.
- **Forward coverage:** the source-to-test correspondence check plus available changed-branch coverage evidence from `directive verify:forward-coverage --project-root .`.
- **Aggregate gate:** the repository's fail-fast quality entry point, normally `task check`.
- **Gate integrity:** the rule that a failed gate is repaired in the product, process artifact, or evidence under test rather than in the comparison mechanism.
- **Red-green-refactor:** observe the intended test failure, implement until it passes, then improve the implementation while the same test remains green.

## Mental model

The evidence surfaces nest, but they are not substitutes:

```text
focused behavior -> literal acceptance -> forward coverage -> aggregate gate
       red/green       declared commands     test linkage      merge chokepoint
```

Use `red -> green -> refactor` as an event sequence:

1. Red proves the new test can detect the missing behavior.
2. Green proves the smallest implementation satisfies that frozen test.
3. Refactor proves structure can improve without changing the behavior.
4. Literal acceptance proves the declared commands, not a remembered substitute.
5. Forward coverage checks source-to-test correspondence and any available changed-branch report.
6. The aggregate gate runs the repository's complete ordered policy.

## Guided explanation

### Focused tests answer one behavior question

`npm run test:focused` shortens feedback while implementing. Read its assertion message before editing; red is useful only when it names the intended missing behavior. An import error or wrong-directory failure is not the red evidence this exercise asks for.

After the expected red result, freeze the focused test. Editing both the test and implementation until they agree destroys the independent comparison.

### Literal acceptance answers a contract question

On the pinned release, `task deft:verify:ac -- <active-xbrief>` reads the active contract and runs its accepted command list verbatim. Direct `node` commands and arbitrary npm scripts are safety-refused by the 0.119.2 literal-command allowlist; the lab therefore uses the allowed test/check script families. A safety refusal is not a product failure and must not be relabeled as one.

### Forward coverage answers a correspondence question

`directive verify:forward-coverage --project-root . --head` checks that new source has an allowed test partner. If no coverage report is available, the changed-branch half is skipped; that skip does not erase the source-to-test check and is not a claim of 90 percent coverage.

### The aggregate gate answers the repository question

`task check` is broader than any one command. The lab's aggregate runs focused behavior, literal acceptance, forward coverage, then the governed quality-record check. It intentionally reaches the last subcheck and fails because the record is still `INCOMPLETE`.

Capture that first failing subcheck. Do not rewrite the aggregate, delete a subcheck, loosen an assertion, or change the active acceptance list. Update only `quality-record.json` from evidence already observed, then rerun the unchanged aggregate.

### Gate hashes make integrity reviewable

The helper records and rechecks gate-definition hashes for the Taskfile, package scripts, quality verifier, helper, safety module, pinned framework gate files, and active acceptance definition. A final green result is rejected if any comparison mechanism changed.

## Walkthrough

Suppose the numeric summary already returns `count` and `total`.

1. Add a focused test for `average`; observe exit `1` and an assertion mentioning `average`.
2. Implement the smallest average calculation; observe the same test exit `0`.
3. Extract `count` and `average` variables; observe the frozen test stay green.
4. Run literal acceptance and forward coverage separately; retain both exit values.
5. Run `task check`; retain the quality-record failure and its position.
6. Populate only the governed record from the retained evidence.
7. Rerun `task check`; verify the gate-definition hashes are unchanged.

That sequence proves more than a final screenshot because it includes the meaningful failure, ordering, repair boundary, and rerun.

## Exercise

Complete [Lab 11](../../labs/11-testing-gates-and-evidence.md). Suggested first attempt: 35 minutes before opening the [explained solution](../../solutions/lab-11-testing-gates-and-evidence.md).

Do not skip directly to the seeded aggregate failure. The helper accepts stages only in order and preserves evidence outside the disposable repository.

## Completion evidence

- **O11.5:** `red.json`, `green.json`, and `refactor.json` show the expected exit sequence and one unchanged focused-test digest after red.
- **O11.6:** `literal.json` identifies separate passing literal-acceptance and forward-coverage results before the aggregate run.
- **O11.7:** `aggregate-failure.json` names `quality:record` as the first failing subcheck; `final.json` reports unchanged gate-definition hashes and a passing aggregate.
- **O11.8:** the final diff contains only `test/summary.test.mjs`, `src/summary.mjs`, and `quality-record.json`; the platform record labels only macOS/zsh verified.

## Progressive hints

1. Ask which single question the current command answers; do not infer the other evidence surfaces.
2. Compare the stage ledger with the Git diff and the focused-test digest.
3. In the aggregate output, read from the top and name the first nonzero subcheck before editing anything.
4. The final repair is data in one governed JSON record. No gate file needs modification.

## Expected failures and recovery

| Symptom | Meaning | Bounded recovery |
| --- | --- | --- |
| Red exits `0` | The test does not prove missing average behavior | Restore the attempt or add the exact average assertions before continuing |
| Red mentions import or syntax failure | The failure is not the intended behavioral red | Fix only the test setup, rerun red, and preserve the first meaningful assertion failure |
| Green says the focused test changed | The comparison moved after red | Preserve the attempt, create a fresh reset attempt, and freeze the test after a meaningful red |
| Literal acceptance reports a safety refusal | A stored command is outside the pinned allowlist | Use the supplied contract; do not bypass or widen the allowlist |
| Aggregate fails before `quality:record` | An earlier evidence surface is not green | Repair that governed work, rerun its focused command, then retry the aggregate |
| Final reports a gate-definition change | The comparison mechanism changed | Preserve the attempt and restart from the clean checkpoint; do not copy the altered gate |

## Common misconceptions

- “The focused test passed, so the story is done.” It proves one behavior only.
- “Literal acceptance and `task check` are synonyms.” Literal acceptance is one product-first component; the aggregate includes additional gates.
- “Forward coverage proves the global coverage target.” It proves correspondence and, only when a report exists, evaluates changed branches.
- “A broken gate can be fixed by editing its command.” That is gate weakening unless changing the gate is the independently approved product work.
- “Only the final green run matters.” Without the meaningful red and unchanged comparison, the evidence cannot distinguish implementation from accommodation.

## Self-assessment

- **O11.5:** Can you show red, green, and refactor exits in order and prove the test digest stayed fixed after red?
- **O11.6:** Can you state the distinct question answered by the focused check, literal acceptance, forward coverage, and aggregate gate?
- **O11.7:** Can you name the first failing subcheck, justify the one-file repair, and show unchanged gate-definition hashes?
- **O11.8:** Can you present the final three-file diff and label macOS/zsh verified while leaving Linux/bash and Windows/PowerShell as candidates?

You are ready to continue only when all four answers are supported by retained evidence.

## Explained solution

After a good-faith attempt, compare your evidence with the [explained Lab 11 solution](../../solutions/lab-11-testing-gates-and-evidence.md). Then retry any unmet outcome from a fresh guarded attempt.

## Navigation

- Previous: [Module 10 — The Implementation Golden Path](10-implementation-golden-path.md)
- Practice: [Lab 11 — Testing, Gates, and Evidence](../../labs/11-testing-gates-and-evidence.md)
- Next: [Module 12 — PR, review, and actual completion](12-review-and-completion.md)
- Course map: [curriculum README](../README.md)

## Official sources

- [Directive source baseline](../../references/SOURCE-BASELINE.md)
- [Module 11 validation notes](../../references/SOURCE-NOTES.md#module-11-source-validation)
- [Directive learner quick reference](../../references/QUICK-REFERENCE.md)
- [Directive training glossary](../../references/GLOSSARY.md)
