# Lab 10 — Testing, Gates, and Evidence

## Lab record

| Field | Value |
| --- | --- |
| Stable ID | `lab-10-testing-gates-and-evidence` |
| Status | Learner-ready draft |
| Suggested first attempt | 35 minutes |
| Directive baseline | `@deftai/directive@0.112.0`; see the [source baseline](../references/SOURCE-BASELINE.md) |
| Source module | [Module 10 — Testing, Gates, and Evidence](../curriculum/modules/10-testing-gates-and-evidence.md) |
| Fixture | [`fixtures/10-testing-gates-and-evidence`](fixtures/10-testing-gates-and-evidence/) |
| Verified environment | macOS with zsh; Linux/bash and Windows/PowerShell remain candidate paths |

## Goal and done condition

Add average behavior test-first, retain a `red -> green -> refactor` record, run literal acceptance and forward coverage separately, diagnose the seeded aggregate failure, and repair only the governed quality record. You are done when `final.json` reports `PASS`, the diff contains three named work files, and gate-definition hashes remain unchanged.

## Fictional scenario

Northstar's local numeric-summary module returns a count and total. The active story asks for an average, including `null` for an empty sample. The repository also requires a quality record assembled from observed evidence before its aggregate gate can pass.

All names and values are fictional. No remote service, business repository, credential, deployment, or reviewer is involved.

## Environment and starting-state check

Use Node.js 20 or later, npm, Git, Task, and `uv`. Run these commands from the curriculum repository only to invoke the supplied helper; all exercise mutation occurs in the unique OS-temporary repository with no remote that it creates.

The guarded interface is `gates-lab.mjs create`, `gates-lab.mjs install`,
`gates-lab.mjs red`, `gates-lab.mjs green`, `gates-lab.mjs refactor`,
`gates-lab.mjs literal`, `gates-lab.mjs aggregate`, `gates-lab.mjs final`,
`gates-lab.mjs reset`, and `gates-lab.mjs archive`. Use only the complete paths
shown below when invoking those verbs.

```sh
node labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs create
```

Copy the printed absolute repository path into a task-specific variable:

```sh
export LAB10_ROOT="/absolute/path/printed/by/the/helper"
node labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs guard "$LAB10_ROOT"
git -C "$LAB10_ROOT" branch --show-current
git -C "$LAB10_ROOT" remote
```

Expected: guard succeeds, the branch is `training/module-10`, and the remote command prints nothing.

## Safety boundary

**[3Ci policy]** The helper refuses mutation unless the target is the canonical `repo` inside one unique OS-temporary no-remote attempt, the branch is `training/module-10`, exactly one xBRIEF 0.8 story is active/running, and the exact Directive graph is 0.112.0 after install.

Stage-specific work paths are:

- before red: `test/summary.test.mjs` only;
- between red and refactor: the frozen test plus `src/summary.mjs`;
- after the seeded aggregate failure: those two files plus `quality-record.json`.

Never edit `Taskfile.yml`, `gates-lab.mjs`, `safety.mjs`, `package.json`, `scripts/verify-quality-record.mjs`, the active xBRIEF acceptance definition, or `.deft/core/`. The helper checks their fingerprints. Do not add a remote or use broad reset/clean/delete commands.

## Starting checkpoint

Install the exact release and create the named clean commit:

```sh
node labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs install "$LAB10_ROOT"
git -C "$LAB10_ROOT" status --short --branch
```

Expected: the helper prints `OK: installed Directive 0.112.0`, the branch is `training/module-10`, and the worktree is clean. Installation uses a project-local npm cache and writes retained evidence outside the Git repository.

## Tasks

### Task 1 — Add the focused test and retain red

In `$LAB10_ROOT/test/summary.test.mjs`, replace the supplied instruction comment with:

```js
test("reports an average and handles an empty list", () => {
  assert.deepEqual(summarize([2, 4, 6]), { count: 3, total: 12, average: 4 });
  assert.deepEqual(summarize([]), { count: 0, total: 0, average: null });
});
```

Then run:

```sh
node labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs red "$LAB10_ROOT"
```

Expected: `EXPECTED_FAILURE`. The helper retains `red.json` and freezes the focused-test digest.

### Task 2 — Implement green, then refactor under green

Change only `$LAB10_ROOT/src/summary.mjs`. First add average directly to the returned object, preserving the existing validation, count, and total behavior. Then run:

```sh
node labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs green "$LAB10_ROOT"
```

Expected: `PASS`. Next refactor the same source so `count` and `average` are named local values while behavior remains unchanged:

```sh
node labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs refactor "$LAB10_ROOT"
```

Expected: `PASS`. The frozen test must not change.

### Task 3 — Run literal and forward evidence

```sh
node labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs literal "$LAB10_ROOT"
```

Expected: `PASS`. The helper runs the pinned `verify:ac` behavior and forward-coverage command separately and retains both results in `literal.json`.

### Task 4 — Diagnose the seeded aggregate failure

```sh
node labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs aggregate "$LAB10_ROOT"
```

Expected: `EXPECTED_FAILURE`, with `quality:record` as the first failing subcheck and `quality record is incomplete` in the retained output. Do not change a gate.

Update only `$LAB10_ROOT/quality-record.json` to match the observed red, green, refactor, literal, forward-coverage, diagnosis, repair, and integrity evidence. Then run:

```sh
node labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs final "$LAB10_ROOT"
```

Expected: `PASS`.

## Checkpoints

| Checkpoint | Required observation | Retained file |
| --- | --- | --- |
| Red | Focused exit `1`; assertion names average | `red.json` |
| Green | Same test digest; focused exit `0`; `{ count: 3, total: 12, average: 4 }` | `green.json` |
| Refactor | Source digest changes; behavior and test digest stay fixed | `refactor.json` |
| Literal | Literal acceptance and forward coverage both pass | `literal.json` |
| Aggregate red | First failure is `quality:record` | `aggregate-failure.json` |
| Final | Aggregate passes; work diff has three files; gate hashes are unchanged | `final.json` |

## Literal acceptance commands

The fictional active xBRIEF stores these commands:

```text
npm run test:focused
npm run check:behavior
```

**[Directive behavior]** The pinned `verify:ac` runner executes these safe commands verbatim. The lab's helper invokes it through the project-local 0.112.0 binary. The aggregate `task check` is deliberately separate and broader.

## Evidence bundle

Evidence is outside the repository in the attempt's sibling `evidence` directory:

- `red.json` — meaningful failure and frozen test digest;
- `green.json` — passing focused behavior and first source digest;
- `refactor.json` — passing behavior after a source-only structural change;
- `literal.json` — literal-acceptance and forward-coverage exits;
- `aggregate-failure.json` — first failing subcheck and unchanged gate fingerprints;
- `final.json` — passing aggregate, final three-file diff, and `gateDefinitionsUnchanged: true`.

**[Course guidance]** Review the smallest relevant fields; do not publish full environment output.

## Progressive hints

1. Red needs one assertion about the missing average behavior, not a syntax failure.
2. Green changes the source; the test digest must match `red.json`.
3. Refactor names intermediate values but must not change the returned object.
4. The aggregate failure tells you which governed artifact is incomplete. Copy evidence values, not gate commands.

## Expected failures and recovery

| Failure | Cause | Recovery |
| --- | --- | --- |
| `source changed before red evidence` | Implementation began before meaningful red | Preserve the attempt and use the reset helper for a fresh root |
| `focused test changed after the red checkpoint` | The comparison moved | Preserve the evidence and retry from a fresh attempt with the red test frozen |
| Literal safety refusal | The active command is not from the allowed test/check family | Use the untouched supplied active contract; do not alter the allowlist |
| Aggregate fails before `quality:record` | Focused, literal, or forward evidence regressed | Repair that work and rerun its stage before aggregate |
| `gate definition changed` | A comparison file or pinned gate changed | Preserve the attempt and start fresh; never copy the altered gate |
| Final quality mismatch | The record does not exactly describe observed evidence | Compare the record with the six retained files and change only the incorrect field |

## Reset to start

The reset route preserves the old attempt and creates a distinct guarded root:

```sh
node labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs reset "$LAB10_ROOT"
```

Copy the new printed path into a new task-specific variable. The original attempt and evidence remain available for diagnosis.

## Cleanup

Cleanup is recoverable archive, not deletion. Leave the attempt parent, then pass exactly one absolute root:

```sh
cd /path/to/the/curriculum-repository
node labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs archive "$LAB10_ROOT"
```

The helper moves the named attempt under the operating-system temporary `3ci-directive-lab-archive` directory. It refuses an implicit path, symlink, remote, wrong branch, or caller still inside the attempt parent.

## Explained solution

After a good-faith attempt, use the [explained Lab 10 solution](../solutions/lab-10-testing-gates-and-evidence.md). Compare decisions and evidence, then retry the unmet outcome.

## Done statement

“I retained meaningful red, green, and refactor evidence with one frozen focused test; ran literal acceptance and forward coverage separately; observed `quality:record` as the seeded aggregate failure; repaired only `quality-record.json`; and reran the unchanged aggregate to `PASS` with unchanged gate-definition hashes.”
