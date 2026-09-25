# Module 10 — The Implementation Golden Path

## Module record

| Field | Value |
| --- | --- |
| Stable ID | `module-10-implementation-golden-path` |
| Status | Learner-ready draft; executable lab verified on macOS/zsh |
| Last verified | 2026-09-10 |
| Directive baseline | fixture-local `@deftai/directive@0.119.5`, engine `@deftai/directive-core@0.119.5`; see the [source baseline](../../references/SOURCE-BASELINE.md) |
| Duration | 70 minutes, including the disposable lab |
| Prerequisites | Modules 1–9; Node.js 20+, npm, Git, Task, `uv`, and a dedicated zsh terminal |
| Native platform evidence | macOS/zsh verified; Linux/bash and Windows/PowerShell are candidates |

## Learning outcomes

By the end of this module, you can:

- **O10.5 — Establish readiness:** prove clean branch, active scope, current session ritual,
  story readiness, and xBRIEF preflight before a product mutation.
- **O10.6 — Follow a red-green path:** retain the focused failure, make the smallest
  coherent change, and rerun the focused check.
- **O10.7 — Respect bounded scope:** change only the product file allowed by the active
  contract and stop when repository identity, branch, remote, or scope differs.
- **O10.8 — Produce two kinds of proof:** distinguish behavioral evidence from diff evidence
  and retain both.
- **O10.9 — Recover without weakening:** diagnose a failed readiness or implementation gate,
  preserve the attempt, and use a fresh reset instead of bypassing the gate.

## Starting-state check

Before reading the walkthrough, answer these questions:

1. Can a failing focused test justify editing before the session and scope gates pass?
2. Does a passing test prove that only the authorized file changed?
3. Does a clean diff prove the intended behavior works?
4. Should a learner change a gate when the product does not satisfy it?

All four answers are **no**. A focused red test describes the desired behavior, but
readiness must authorize the mutation first. Behavioral and diff evidence answer different
questions. A failed gate is diagnostic evidence, not permission to weaken the check.

If any answer was yes, write the evidence that would disprove it.
Then continue to the mental model.

## Why this matters

Implementation is where a sound scope can still drift. A developer may begin from a dirty
branch, treat a plausible task as authorized, change extra files, or stop after one green
test. The golden path makes each boundary observable.

At the pinned release, session start, the gated session ritual,
story readiness, and active xBRIEF preflight establish current process readiness. They do
not write the product change.

This exercise runs only in its guarded fictional repository. It authorizes
no remote, push, pull request, merge, deployment, publication, release, or business-repository
mutation.

## Terminology

| Term | Meaning here |
| --- | --- |
| Implementation readiness | Current evidence that repository, branch, session, active contract, and required start gates are aligned before mutation. |
| Focused check | The smallest test command that directly exercises the behavior being changed. |
| Smallest coherent change | The least product edit that completely satisfies the named behavior without unrelated cleanup. |
| Behavioral evidence | Output from tests or the CLI proving what the software does. |
| Diff evidence | Repository output proving which tracked paths changed and that the patch is mechanically clean. |
| Gate integrity | Repair the product or prerequisite under test; do not edit the gate solely to make red appear green. |

## Mental model

```text
clean guarded start
  -> current readiness
  -> retain focused red
  -> smallest coherent allowed edit
  -> focused green
  -> behavior proof + diff proof
```

The arrows are ordered. Evidence from a later stage cannot repair a missing earlier stage.

| Observation | What it proves | What it does not prove |
| --- | --- | --- |
| `npm run test:focused` exits `0` | Named, fallback, invalid-input, and ordinary-name behavior passes | Only the allowed path changed |
| `git diff --check` exits `0` | The patch has no whitespace errors | The behavior is correct |
| `git diff --name-only` prints one allowed file | The tracked patch stays in scope | The test ran or passed |

## Guided explanation

### Readiness before mutation

Readiness is a sequence, not a feeling. In the lab helper, these checks occur while the
fixture is still identical to its named checkpoint:

```text
task deft:session:start -- --session-id=<current-session-id>
task deft:verify:session-ritual -- --tier=gated
directive verify:story-ready --vbrief-path xbrief/active/fictional-greeting.xbrief.json --skip-routing
task deft:xbrief:preflight -- xbrief/active/fictional-greeting.xbrief.json
npm run test:focused
```

The first four must exit `0`. The supplied focused check must exit `1`, proving the intended
behavior is not already implemented. The helper writes `readiness.json` only after it
observes that entire order on a clean checkpoint.

In prose, the exact sequence is `task deft:session:start -- --session-id=<current-session-id>`,
`task deft:verify:session-ritual -- --tier=gated`,
`directive verify:story-ready --vbrief-path xbrief/active/fictional-greeting.xbrief.json --skip-routing`,
`task deft:xbrief:preflight -- xbrief/active/fictional-greeting.xbrief.json`, and
`npm run test:focused`. Final patch proof includes `git diff --check`.

The active/running contract and live implementation instruction
supply authority; current gates establish readiness. A prior green session or completed
story is not a substitute.

### A useful red test is bounded evidence

A red test is useful when it fails for the intended behavior. In the fixture, the test asks
for a named greeting, a fallback greeting, a clear non-string error, and fifty ordinary
fictional names. The starting implementation always returns `Hello!`, so the focused suite
fails before any edit.

Read the failure, test, active acceptance statement, and one-file
allowlist together. Do not expand the task into refactoring the CLI, test suite, manifest,
or framework files.

### Implement the smallest coherent change

The active scope permits only `src/greeting.mjs`. A coherent change handles all specified
cases in that file: trim a string, use `teammate` for missing or blank input, and reject a
provided non-string. Partial work that makes one assertion green is small but not coherent.

Only the exact allowlisted product file may differ from the checkpoint.
If another path changes, stop and preserve the attempt. Do not widen the scope after the
fact to legitimize an unrelated edit.

### Pair behavior with diff evidence

After the edit, run the focused test and both CLI examples. Then inspect the path list and
run `git diff --check`. These form complementary proof:

- behavioral evidence: focused tests and exact `Hello, Ada!` / `Hello, teammate!` output;
- diff evidence: only `src/greeting.mjs` differs and `git diff --check` exits `0`.

The helper writes `implementation.json` only when both kinds pass and the earlier readiness
record matches the attempt checkpoint.

### Stop on boundary drift

The guard rejects a non-temporary root, changed branch, added remote, version drift,
multiple active stories, altered immutable fixture, expanded file list, or invalid evidence.
This is a safe stop. It is not a puzzle to solve by modifying the helper.

Prefer the reset verb. It creates a new unique attempt while leaving
the failed attempt and its evidence intact. Archive later moves one explicitly named attempt
parent to a recoverable temporary archive.

## Walkthrough

Read [Lab 10](../../labs/10-implementation-golden-path.md) before using a terminal. Predict
the following checkpoints:

| Checkpoint | Expected state |
| --- | --- |
| Create | Unique OS-temporary no-remote Git repository on `training/module-10` |
| Install | Exact CLI/core/content/types 0.119.5 graph and clean local checkpoint |
| Readiness | Four start gates green; focused test red; `readiness.json` says `READY` |
| Implement | Only `src/greeting.mjs` differs |
| Verify | Focused and CLI behavior green; diff check green; `implementation.json` says `PASS` |
| Reset/archive | Failed evidence preserved; exact attempt moved recoverably when requested |

Notice that implementation starts only after the readiness row. Moving the edit upward
would change the lesson from a golden path into a demonstration of premature mutation.

## Exercise

Complete the [disposable Module 10 lab](../../labs/10-implementation-golden-path.md). Keep a
short evidence note that answers:

1. Which readiness results support **O10.5**?
2. What exact focused failure and later pass support **O10.6**?
3. How did the active file scope and final path list support **O10.7**?
4. Which observations are behavioral evidence and which are diff evidence for **O10.8**?
5. What must you do if a guard or gate stops the attempt, demonstrating **O10.9**?

The product change is intentionally tiny. The learning work is keeping the order, boundary,
and proof precise.

## Completion evidence

- **O10.5:** `readiness.json` names the clean checkpoint, active scope, empty remote, branch,
  exact 0.119.5 baseline, and four successful start gates.
- **O10.6:** the readiness record retains focused exit `1`; the final record retains focused
  exit `0` after the smallest coherent change.
- **O10.7:** the active scope and final diff each list only `src/greeting.mjs`.
- **O10.8:** `implementation.json` records the named and fallback CLI strings plus the
  one-file diff and successful `git diff --check`.
- **O10.9:** the original stopped attempt remains intact while reset returns a different
  unique root, or archive records the recoverable destination.

## Progressive hints

1. Do not open the implementation file first. Establish the guarded start and readiness.
2. Compare the test's three behavior classes with the active acceptance statement.
3. One function can normalize the optional string after validating its type.
4. If the behavior passes but final verification stops, inspect the changed-path list before
   inspecting the assertions.

## Expected failures and recovery

| Failure | Meaning | Recovery |
| --- | --- | --- |
| Readiness rejects a dirty checkpoint | A product mutation or other change occurred too early | Preserve the attempt; reset to a fresh unique root and repeat the order. |
| Focused test exits `1` during readiness | Expected starting evidence | Retain it; implement only after `readiness.json` says `READY`. |
| Focused test still fails after the edit | The product behavior is incomplete | Read the first assertion and repair only `src/greeting.mjs`; do not edit the test. |
| Guard rejects a remote, branch, pin, or path | The attempt no longer satisfies its safety identity | Stop; preserve it and use a fresh reset. |
| Final verify reports another changed path | The diff exceeds active scope | Preserve evidence; start a fresh attempt rather than widening the allowlist. |
| Archive refuses | The target is ambiguous or the caller is still within its parent | Leave it intact; move outside the parent and pass the exact absolute root. |

## Common misconceptions

- A failing test does not authorize a mutation.
- A passing focused test does not prove scope compliance.
- A one-line edit is not coherent if required fallback or error behavior is missing.
- Changing a test, helper, policy, or allowlist solely to get green breaks gate integrity.
- Reset means a new attempt here; it does not erase the failure that teaches recovery.
- A local passing lab does not authorize a PR, remote, or business-repository action.

## Self-assessment

1. **O10.5:** Put the five readiness observations in order and explain why the focused red
   belongs after the four green start gates.
2. **O10.6:** Explain how the retained red and later green demonstrate a test-backed change.
3. **O10.7:** Name the only mutable product path and two different places that prove it.
4. **O10.8:** Give one behavioral observation and one diff observation; state why neither can
   replace the other.
5. **O10.9:** Describe the safe response to an unexpected remote or out-of-scope diff without
   weakening any gate.

You are ready to continue when each answer cites the retained lab evidence.

## Explained solution

After a genuine first attempt, compare with the [explained Lab 10 solution](../../solutions/lab-10-implementation-golden-path.md).
Use it to diagnose the smallest gap, then retry from a known state.

## Navigation

- Previous: [Module 9 — Design-Critique Arcs and Verified Synthesis](09-design-critique-arcs.md)
- Course map: [Directive training](../README.md)
- Practice: [Lab 10 — Implementation Golden Path](../../labs/10-implementation-golden-path.md)
- Next: [Module 11 — Testing, Gates, and Evidence](11-testing-gates-and-evidence.md)

## Official sources

| Statement | Source | Checked |
| --- | --- | --- |
| Session routing and gated ritual | [Directive commands][commands] | 2026-09-10 |
| Story readiness and active preflight | [Directive commands][commands] | 2026-09-10 |
| Gate integrity | [Directive main][main] | 2026-09-10 |
| Exact runtime observations | [Module 10 source validation](../../references/SOURCE-NOTES.md#module-10-source-validation) | 2026-09-10 |

[commands]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/commands.md
[main]: https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/main.md
