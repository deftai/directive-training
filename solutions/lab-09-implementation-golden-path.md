# Explained solution — Lab 9 Implementation Golden Path

## Solution record

| Field | Value |
| --- | --- |
| Stable ID | `solution-lab-09-implementation-golden-path` |
| Solves | `lab-09-implementation-golden-path` |
| Outcomes covered | O9.1, O9.2, O9.3, O9.4, O9.5 |
| Result | `Hello, Ada!`; only `src/greeting.mjs` changed |
| Status | Learner-ready draft for the verified macOS/zsh path |
| Last verified | 2026-09-10 |
| Directive baseline | CLI/core/content/types `0.119.2`; [source baseline](../references/SOURCE-BASELINE.md) |
| Source exercise | [Lab 9](../labs/09-implementation-golden-path.md) |

## Before you use this solution

Spend about ten minutes on the lab after preserving the expected focused failure. Keep the
attempt and evidence so you can compare observations, not memory. This is advice, not an
access gate.

Run this approach only in the exact guarded fictional attempt. Do not paste
the answer into this curriculum checkout or a business repository. Do not add a remote or
perform a remote delivery action.

## Result summary

The successful route establishes readiness on a clean checkpoint, observes focused red,
and then changes one function in one allowlisted file. The final proof combines focused and
CLI behavior with an exact one-file diff and a clean patch check.

The implementation validates input before trimming it, uses `teammate` when no usable name
exists, and reports `name must be a string` for a provided non-string. A different
implementation is valid if it preserves the same behavior, boundary, and evidence.

## Outcome map

| Outcome | Demonstration | Evidence |
| --- | --- | --- |
| O9.1 | Current session, story, and active-preflight gates ran before mutation | `readiness.json` says `READY` and records four zero exits |
| O9.2 | Supplied focused test moved from expected exit `1` to exit `0` after one coherent edit | readiness and implementation records |
| O9.3 | The active scope and working diff contain only `src/greeting.mjs` | `diff.files` equals the one-file allowlist |
| O9.4 | Tests/CLI prove behavior while Git proves patch shape | `Hello, Ada!`, `Hello, teammate!`, focused pass, path list, diff check |
| O9.5 | A stopped attempt is preserved and reset creates a different unique root | old evidence remains; new root passes guard |

## Reasoning

### 1. Establish the controlling facts

- At 0.119.2, the fixture's session ritual, story-ready check, and
  active xBRIEF preflight must pass before its implementation phase.
- The active file scope is the complete mutation boundary: only
  `src/greeting.mjs` may change in this no-remote lab.
- Retain the focused red first so the later green supports a causal
  implementation claim rather than merely reporting a currently passing test.

The tests are product expectations, not editable suggestions. The helper and evidence
contract are also outside the active product scope.

### 2. Choose an approach

Validate the optional input first. Then trim a string, choose the trimmed value or
`teammate`, and format the response. This keeps all required behavior within the exported
function and avoids changing the CLI adapter.

A tempting shortcut is to change `test/greeting.test.mjs` to expect `Hello!`. That makes a
test green by discarding the active acceptance behavior, changes an unauthorized file, and
breaks gate integrity.

### 3. Predict the evidence

Before final verification, expect:

- four focused test cases to pass, including fifty ordinary fictional names;
- named CLI output `Hello, Ada!` and fallback output `Hello, teammate!`;
- Git status and diff to name only `src/greeting.mjs`; and
- `git diff --check` to exit `0` with no output.

## Worked approach

### Step 1 — Establish readiness

From the curriculum checkout, with `helper` and `lab_root` defined as in the lab:

```sh
node "$helper" guard "$lab_root"
node "$helper" readiness "$lab_root"
```

Observe `"READY"`. The retained `readiness.json` records the exact 0.119.2 baseline, clean
checkpoint, branch, active contract, empty remote, green start gates, and focused exit `1`.

**Why:** this is the complete pre-mutation evidence for O9.1 and the red half of O9.2.

### Step 2 — Edit only the allowed implementation

Replace the contents of `$lab_root/src/greeting.mjs` with:

```js
export function greeting(name) {
  assertName(name);
  const recipient = name?.trim() || "teammate";
  return `Hello, ${recipient}!`;
}

function assertName(name) {
  if (name !== undefined && typeof name !== "string") {
    throw new TypeError("name must be a string");
  }
}
```

The optional chain is safe only after validation. A blank string trims to an empty value and
selects the fallback. Ordinary names retain their text.

Confirm scope before running final proof:

```sh
git -C "$lab_root" status --short
git -C "$lab_root" diff --name-only
```

Both outputs identify only `src/greeting.mjs`.

### Step 3 — Run the literal behavior and diff checks

```sh
npm --prefix "$lab_root" run test:focused
npm --prefix "$lab_root" run greet -- Ada
npm --prefix "$lab_root" run greet
git -C "$lab_root" diff --check
node "$helper" verify "$lab_root"
```

The test exits `0`; the two CLI invocations print the predicted strings; the diff check has
no output; and the helper prints `"PASS"`.

## Acceptance evidence

| Validation | Required result | Relevant observed evidence | Outcome |
| --- | --- | --- | --- |
| `implementation-lab.mjs readiness` | Exit `0`, `"READY"` | four green start gates, focused exit `1` | O9.1, O9.2 |
| `npm run test:focused` | Exit `0` | four cases pass, zero fail | O9.2, O9.4 |
| named and fallback CLI | Exit `0` | `Hello, Ada!`; `Hello, teammate!` | O9.4 |
| `git diff --name-only` | One exact path | `src/greeting.mjs` | O9.3 |
| `git diff --check` | Exit `0` | no output | O9.3, O9.4 |
| `implementation-lab.mjs verify` | Exit `0`, `"PASS"` | `implementation.json` ties proof to readiness | O9.1, O9.2, O9.3, O9.4, O9.5 |

## Compare with your attempt

| Compare | Match means | Difference means | Next action |
| --- | --- | --- | --- |
| Readiness order | Mutation began after `READY` | The attempt lacks implementation readiness | Preserve and reset |
| Function behavior | All specified inputs match | One behavior branch is incomplete | Inspect the first focused failure |
| Changed path | Only the active allowlist differs | Scope was exceeded | Preserve and reset rather than widening |
| Paired evidence | Behavior and diff proof both pass | The result proves only one dimension | Run the missing literal check |

Write one sentence about the smallest difference. Repair only that unmet outcome in a fresh
attempt when the safety identity or scope is uncertain.

## Valid alternatives

| Alternative | Why it passes | Required evidence | When it fails |
| --- | --- | --- | --- |
| Explicit `if` branches instead of optional chaining | Same input and output contract in the same file | All focused/CLI/diff checks | It changes another file or misses blank input |
| A small local normalization helper | Keeps validation readable within the allowlisted file | Exact one-file diff and all behavior | It changes the exported API or expands scope |

Committing the lab edit is unnecessary. Adding a test is not an acceptable alternative
because the supplied test is immutable in this exercise.

## Expected failures and recovery

### Readiness refuses a dirty checkpoint

- **Symptom:** `readiness` reports that the clean checkpoint is required.
- **Cause:** a file changed before authorization and start gates were recorded.
- **Confirm:** `git -C "$lab_root" status --short`.
- **Recover:** preserve the attempt and run `implementation-lab.mjs reset "$lab_root"`.
- **Retry:** install, confirm empty status, then require `"READY"` before editing.

### Focused behavior remains red

- **Symptom:** the named, fallback, invalid-input, or ordinary-name case fails.
- **Cause:** the one-file implementation is incomplete or validates after unsafe string use.
- **Confirm:** read the first failed assertion and the current narrow diff.
- **Recover:** edit only `src/greeting.mjs`; do not change the test or helper.
- **Retry:** run the full focused command until all four cases pass.

### Final proof rejects the diff

- **Symptom:** verify says implementation may change only `src/greeting.mjs`.
- **Cause:** another tracked path differs from the checkpoint.
- **Confirm:** `git -C "$lab_root" status --short` and `git diff --name-only`.
- **Recover:** preserve the attempt; reset when the extra mutation makes state uncertain.
- **Retry:** repeat the golden path and final verify in the new guarded root.

### Baseline or safety identity differs

Capture the version or guard message without credentials. Do not substitute a different
Directive version, remove a remote from an uncertain checkout, change branch expectations,
or edit the helper. Preserve and reset.

## Misconceptions exposed by this exercise

| Misconception | Evidence-based correction | Source |
| --- | --- | --- |
| “Red authorizes the edit.” | Red is useful only after current readiness establishes the safe start. | [Module 9](../curriculum/modules/09-implementation-golden-path.md#readiness-before-mutation) |
| “Green means done.” | Focused green lacks path and patch proof; final verification requires both. | [Lab acceptance](../labs/09-implementation-golden-path.md#literal-acceptance-commands) |
| “A tiny extra cleanup is harmless.” | The active contract names an exact one-file scope. | [Lab safety boundary](../labs/09-implementation-golden-path.md#safety-boundary) |
| “Reset should erase failure.” | The helper creates a new attempt and retains the original evidence. | [Lab reset](../labs/09-implementation-golden-path.md#reset-to-start) |

## Retry plan

1. Preserve the original readiness, failure, and diff evidence.
2. Run `implementation-lab.mjs reset "$lab_root"` to create another unique root.
3. Install the exact graph and obtain `READY` before any edit.
4. Implement the unmet behavior in only `src/greeting.mjs`.
5. Run every literal acceptance command and compare both JSON records.

## Reset and cleanup

Reset does not alter the old root:

```sh
new_lab_root="$(node "$helper" reset "$lab_root")"
node "$helper" guard "$new_lab_root"
```

Archive one explicitly named attempt only after leaving its parent:

```sh
cd "$course_root"
node "$helper" archive "$lab_root"
```

Both operations are bounded and recoverable. Neither performs broad deletion.

## Sources

- [Lab 9](../labs/09-implementation-golden-path.md)
- [Module 9](../curriculum/modules/09-implementation-golden-path.md)
- [Source baseline](../references/SOURCE-BASELINE.md#module-9-implementation-readiness-validation)
- [Source notes](../references/SOURCE-NOTES.md#module-9-source-validation)

## Continue

Return to [Module 9 self-assessment](../curriculum/modules/09-implementation-golden-path.md#self-assessment).
Module 10 remains planned; do not infer learner readiness from its placeholder map entry.
