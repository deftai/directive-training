# Explained solution — Lab 10: Testing, Gates, and Evidence

## Solution record

| Field | Value |
| --- | --- |
| Source | [Lab 10 — Testing, Gates, and Evidence](../labs/10-testing-gates-and-evidence.md) |
| Stable ID | `solution-lab-10-testing-gates-and-evidence` |
| Status | Available |
| Verified | 2026-09-10 on macOS/zsh |
| Directive baseline | `@deftai/directive@0.112.0`; see the [source baseline](../references/SOURCE-BASELINE.md) |

## Before you use this solution

Preserve your attempt's error and the matching evidence file. Spend about 35 minutes on the lab before comparing. If you opened this earlier, use it to identify the smallest missed outcome, then retry from a fresh guarded root.

**[3Ci policy]** Keep every command inside the supplied disposable local workflow. Do not adapt this solution to a business repository or add a remote.

## Result summary

The worked attempt added one average test, observed its intended failure, implemented average, refactored the source while the test stayed frozen, and passed literal acceptance plus forward coverage. The unchanged aggregate then failed first at `quality:record`. Updating `quality-record.json` only produced a final `PASS` with `gateDefinitionsUnchanged: true`.

The final behavior for `[2, 4, 6]` was `{ count: 3, total: 12, average: 4 }`; an empty list returned average `null`.

## Outcome map

| Outcome | Demonstrating evidence |
| --- | --- |
| **O10.1** | `red.json`, `green.json`, and `refactor.json` show exits 1, 0, 0 in order with the same post-red test digest |
| **O10.2** | `literal.json` contains separate passing `verify:ac` and forward-coverage results before `task check` |
| **O10.3** | `aggregate-failure.json` names `quality:record`; the final diff repairs `quality-record.json only`; `final.json` reports unchanged gates |
| **O10.4** | `final.json` lists exactly the test, source, and record paths; source notes limit verified execution to macOS/zsh |

## Reasoning

### 1. Preserve a meaningful comparison

Red is evidence only when the failure names the missing average behavior. After that observation, the test becomes the fixed comparison. Changing it later would make green ambiguous.

### 2. Separate evidence questions

The focused test asks whether average works. Literal acceptance asks whether the active contract's safe test/check commands run verbatim. Forward coverage asks whether source and tests correspond, plus changed-branch coverage when a report exists. The aggregate asks whether all ordered repository policy passes.

### 3. Repair the governed work

The aggregate reached `quality:record` only after the earlier checks passed. That made the incomplete record the diagnosed work defect. **[Course guidance]** The smallest valid change was the record; touching the Taskfile or verifier would have replaced the comparison rather than satisfied it.

## Worked approach

### Step 1 — Create and install

The helper created a canonical unique temporary root, branch `training/module-10`, and no remote, then installed the exact 0.112.0 package/core/content/types graph. The clean checkpoint contained the active/running story and unchanged gates.

### Step 2 — Add the red test

The instruction comment in `test/summary.test.mjs` was replaced with:

```js
test("reports an average and handles an empty list", () => {
  assert.deepEqual(summarize([2, 4, 6]), { count: 3, total: 12, average: 4 });
  assert.deepEqual(summarize([]), { count: 0, total: 0, average: null });
});
```

The red helper returned `EXPECTED_FAILURE`. Its assertion diff named the absent `average`, so the helper froze that test digest.

### Step 3 — Reach green

The first implementation retained validation and total calculation, then returned average directly:

```js
return {
  count: values.length,
  total,
  average: values.length === 0 ? null : total / values.length,
};
```

The green helper returned `PASS`, and the CLI evidence contained `average: 4`.

### Step 4 — Refactor under the frozen test

The source was changed without touching the test:

```js
const count = values.length;
const average = count === 0 ? null : total / count;
return { count, total, average };
```

The refactor helper observed a new source digest and the same passing behavior.

### Step 5 — Run contract and coverage evidence

**[Directive behavior]** The pinned literal gate accepted `npm run test:focused` and `npm run check:behavior`. It safety-refused direct `node` and arbitrary npm script forms during validation, so the supplied contract uses the released allowlist rather than a bypass. Forward coverage passed its source-to-test correspondence; without a coverage report, it did not claim changed-branch percentage evidence.

### Step 6 — Diagnose and repair the aggregate

The aggregate ran focused, literal, and forward checks before failing at `quality:record`. Only `quality-record.json` changed after that observation:

```json
{
  "schema": "3ci.training.module10.quality-record.v1",
  "status": "COMPLETE",
  "evidence": {
    "red": "EXPECTED_FAILURE",
    "green": "PASS",
    "refactor": "PASS",
    "literalAcceptance": "PASS",
    "forwardCoverage": "PASS",
    "firstFailingSubcheck": "quality:record",
    "repair": "quality-record.json only",
    "gateDefinitionsUnchanged": true
  }
}
```

The final helper reran the same aggregate and returned `PASS`.

## Acceptance evidence

- **O10.1:** `red.json` recorded exit 1 and `EXPECTED_FAILURE`; `green.json` and `refactor.json` recorded exit 0 with the same test digest.
- **O10.2:** `literal.json` recorded literal acceptance `PASS` and forward coverage `PASS` as distinct steps.
- **O10.3:** `aggregate-failure.json` recorded `firstFailingSubcheck: quality:record`; `final.json` recorded `gateDefinitionsUnchanged: true` and aggregate `PASS`.
- **O10.4:** the final changed file list was `quality-record.json`, `src/summary.mjs`, and `test/summary.test.mjs`; no remote or unsupported platform claim was added.

## Compare with your attempt

Compare in this order: temporary-root identity, exact pin, branch and remote, red assertion, frozen test digest, green source digest, refactor source digest, literal exits, forward-coverage output, first aggregate failure, one-file repair, final diff, then gate fingerprints.

Wording and local variable names may differ. The ordered observations and boundaries may not.

## Valid alternatives

- A different average implementation is valid when it returns the same results, passes the frozen test, and changes again during the refactor checkpoint.
- Additional average cases may be present in the one test added before red, provided they produce the intended meaningful failure and are not edited later.
- A manually authored complete quality record is expected; the evidence values must match the retained files exactly.

Changing the test after red, editing source after refactor, bypassing literal safety, deleting an aggregate subcheck, or weakening a verifier is not a valid alternative.

## Expected failures and recovery

### Red passes unexpectedly

Cause: the average behavior already exists or the new assertion was not added. Confirm the clean checkpoint and test diff. Use the reset helper for a fresh attempt; do not manufacture a different failure.

### Green rejects the test digest

Cause: the focused comparison changed after red. Preserve the attempt, create a fresh one, and add the complete average test before recording red.

### Literal acceptance is safety-refused

Cause: the active command changed to a direct executable or arbitrary npm script. Restore the supplied active contract from a fresh attempt. Do not change Directive's allowlist.

### Aggregate fails before the seeded record

Cause: an earlier check regressed. Read the first failure, repair that governed test/source state, rerun its stage, then retry aggregate.

### Final rejects gate integrity

Cause: a gate definition, package script, active acceptance list, or pinned framework gate file changed. Preserve the evidence and restart. A green result after comparison-method mutation is not completion proof.

## Misconceptions exposed by this exercise

- A final green run does not prove the new test ever detected the missing behavior.
- A focused test is not the active contract or the repository aggregate.
- Forward coverage with no report is not a 90 percent coverage claim.
- A safety refusal is not a failed product assertion.
- Gate maintenance requires separate approved scope; it is never an implementation-loop shortcut.

## Retry plan

1. Name the first unmet outcome and its retained evidence file.
2. Create a new attempt with the reset helper.
3. Repeat only through the checkpoint that previously failed.
4. Compare the new evidence field with this solution.
5. Continue through final only after the comparison is correct.

## Reset and cleanup

Use the lab's reset helper to create a fresh attempt while preserving the original. For cleanup, leave the attempt parent and invoke the archive helper with one explicit absolute root. The archive move is recoverable; no broad deletion is part of this exercise.

## Sources

- [Module 10 lesson](../curriculum/modules/10-testing-gates-and-evidence.md)
- [Lab 10](../labs/10-testing-gates-and-evidence.md)
- [Directive source baseline](../references/SOURCE-BASELINE.md)
- [Module 10 validation notes](../references/SOURCE-NOTES.md#module-10-source-validation)
- [Directive learner quick reference](../references/QUICK-REFERENCE.md)

## Continue

Return to the [Module 10 self-assessment](../curriculum/modules/10-testing-gates-and-evidence.md#self-assessment). Module 11 remains planned and is not learner-ready in this scope.
