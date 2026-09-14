# Explained solution — End-to-End Directive Capstone

## Solution record

| Field | Value |
| --- | --- |
| Stable ID | `solution-assessment-capstone-end-to-end` |
| Supports | `CAP.1`, `CAP.2`, `CAP.3`, and `CAP.4` |
| Status | Learner-ready |
| Last verified | 2026-09-12 |
| Directive baseline | Exact `@deftai/directive@0.112.0` CLI/core/content/types graph; [source baseline](../references/SOURCE-BASELINE.md#capstone-end-to-end-validation) |
| Execution runtime | Node.js `22 or newer`; the verified matrix used `24.20.0`; Node.js 20-compatible application source is a source-level design constraint, not a separate Node.js 20 execution claim |
| Lesson | [Capstone — End-to-End Solo Directive Lifecycle](../curriculum/capstone-end-to-end.md) |
| Assessment | [Capstone assessment](../assessments/capstone-end-to-end.md) |
| Lab | [End-to-end capstone lab](../labs/capstone-end-to-end.md) |

## Before you use this solution

Spend at least 45 minutes on a genuine attempt. Preserve its root and retained
evidence before comparing. Reading or copying this answer cannot demonstrate an
outcome; after comparison, produce fresh helper-generated evidence for every
outcome you need to retry.

The source listings below are pedagogical comparisons. Apply them only inside
the exact guarded attempt root and only at the stage named. Never paste them
into this curriculum repository or a business repository.

## Result summary

The valid route preserves the fixture's stage order and independent
comparisons. A first implementation satisfies the supplied public tests, then
the zero-mutation simulated review exposes one normalized-duplicate P1. A
second source-only edit resolves it. The aggregate then passes before and after
the local commit.

The strongest final claim is `implemented` with `local_pass`. The attempt
has no PR, remote delivery, deployment, or UAT evidence, and its lifecycle
scope remains active/running. Helper stage `COMPLETE` is exercise completion,
not Directive lifecycle completion or delivery.

## Outcome map

| Outcome | Demonstration | Evidence |
| --- | --- | --- |
| `CAP.1` | Exact runtime observation, orientation, lifecycle activation, session ritual, story-ready, and preflight establish mutation readiness | Runtime note, `orientation.json`, `scope.json`, `readiness.json` |
| `CAP.2` | Meaningful red precedes the one-file green implementation; focused and literal checks pass; unchanged aggregate reaches the seeded review-evidence failure | `red.json`, `green.json`, `focused.json`, `literal.json`, `aggregate-failure.json` |
| `CAP.3` | Review records `CAP-P1-001` without editing, the learner labels classification timing as self-attested, then normalized duplicate rejection passes a fresh simulated current-product review | `pre-pr.json`, classification note, `review-resolution.json` |
| `CAP.4` | Reviewed bytes are committed unchanged, the aggregate passes on that commit, final state stays bounded, and reset plus archive are safe | `closeout.json`, state cards, repository checks, reset-and-archive note |

## Reasoning

1. Guard identity before trusting any later artifact.
2. Establish current active scope and session/preflight readiness.
3. Preserve meaningful red against the untouched supplied test.
4. Make the smallest complete one-file implementation.
5. Prove focused behavior and diff integrity separately.
6. Run stored literal acceptance before the broader aggregate.
7. Preserve the aggregate's expected review-evidence failure.
8. Record and classify the complete simulated finding before editing.
9. Repair only the scoped source and re-check the current product.
10. Run the repaired aggregate, prove the reviewed digest is unchanged, commit
    locally, rerun the aggregate on that commit, and claim only proved states.
11. Create a distinct reset attempt and archive both exact attempt roots.

This sequence rejects four tempting shortcuts: pasting the final solution before
the green/pre-PR checkpoints; changing tests or gates; treating aggregate red
as permission to weaken `review:evidence`; and treating `CLEAN` or
`COMPLETE` as remote review, merge-ready, or delivery proof.

## Predicted evidence

The helper sequence is:

~~~text
create
install <root>
orient <root>
activate <root>
ready <root>
red <root>
[write the green implementation]
green <root>
focused <root>
literal <root>
aggregate <root>
pre-pr <root>
[classify CAP-P1-001]
[write the reviewed implementation]
review <root>
close <root>
[inspect and classify]
reset <completed-root>
archive <completed-root>
archive <reset-root>
~~~

Expected outer outputs:

| Verb | Output |
| --- | --- |
| `create` | Unique absolute repository root |
| `install` | `OK: installed Directive 0.112.0` |
| `orient` | `"PASS"` |
| `activate` | `"PASS"` |
| `ready` | `"READY"` |
| `red` | `"EXPECTED_FAILURE"` |
| `green` | `"PASS"` |
| `focused` | `"PASS"` |
| `literal` | `"PASS"` |
| `aggregate` | `"EXPECTED_FAILURE"` |
| `pre-pr` | `"FINDING_RECORDED"` |
| `review` | `"PASS"` |
| `close` | `"PASS"` |
| `reset` | A different absolute repository root at `CREATED` |
| `archive` | A recoverable archive destination |

The outer `red` and `aggregate` processes exit `0` because they
successfully retain an expected inner failure. The inner exits remain nonzero
in `red.json.focused.exitCode` and
`aggregate-failure.json.aggregate.exitCode`.

## Worked approach

### 1. Establish the trusted attempt

Run the lab's Node 22-or-newer capability assertion before `create`. The helper creates a
unique OS-temporary repository on `training/capstone` with no remote.
`install` contacts the public npm registry, verifies the exact 0.112.0 graph,
deposits Directive, and creates the clean fixture checkpoint.

`orientation.json` then binds the project, branch, empty remote, exact
baseline, proposed contract, and checkpoint. `scope.json` proves the one story
moved to `xbrief/active/fictional-work-items.xbrief.json` with
`src/work-items.mjs` as its only product path. `readiness.json` proves
session start, the gated ritual, story-ready, and active-xBRIEF preflight.

### 2. Preserve meaningful red

Run `red` before editing. The correct outer output is
`"EXPECTED_FAILURE"`; inside `red.json`, the supplied focused test exits
`1`, names unimplemented work-items behavior, records no changed files, and
retains the supplied test digest.

If product source changed before this point, there is no valid red-to-green
chain. Preserve the attempt and reset instead of manufacturing the record.

### 3. Write the intentionally incomplete green implementation

At the `RED` stage, replace only the attempt's
`src/work-items.mjs` with this first version:

~~~js
function validateItems(items) {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array of work items");
  }
  for (const item of items) {
    if (!item || !/^WI-\d{3}$/.test(item.id)) {
      throw new TypeError("work-item id must use WI-NNN");
    }
    if (typeof item.title !== "string" || item.title.trim() === "") {
      throw new TypeError("work-item title must be nonempty");
    }
    if (!["open", "done"].includes(item.status)) {
      throw new TypeError("work-item status must be open or done");
    }
  }
}

export function addWorkItem(items, title) {
  validateItems(items);
  if (typeof title !== "string" || title.trim() === "") {
    throw new TypeError("title must be a nonempty title");
  }
  const highest = items.reduce(
    (value, item) => Math.max(value, Number(item.id.slice(3))),
    0,
  );
  return [
    ...items,
    {
      id: "WI-" + String(highest + 1).padStart(3, "0"),
      title: title.trim(),
      status: "open",
    },
  ];
}

export function completeWorkItem(items, id) {
  validateItems(items);
  if (typeof id !== "string" || !/^WI-\d{3}$/.test(id)) {
    throw new TypeError("id must use WI-NNN");
  }
  if (!items.some((item) => item.id === id)) {
    throw new RangeError("work item " + id + " not found");
  }
  return items.map((item) =>
    item.id === id ? { ...item, status: "done" } : { ...item },
  );
}

export function summarizeWorkItems(items) {
  validateItems(items);
  return {
    total: items.length,
    open: items.filter((item) => item.status === "open").length,
    done: items.filter((item) => item.status === "done").length,
  };
}
~~~

This is intentionally not the final answer. It must exist long enough for the
zero-change pre-PR probe to observe normalized duplicate acceptance.

Expected green observations:

- all five supplied tests pass;
- add returns `[{"id":"WI-001","title":"Capture capstone evidence","status":"open"}]`;
- complete returns the named item with `status: "done"`;
- behavior summary is `{"total":2,"open":1,"done":1}`; and
- only `src/work-items.mjs` differs.

### 4. Keep focused, literal, and aggregate evidence separate

`focused` proves the supplied test, CLI behavior, and whitespace diff.
`literal` uses the project-local `verify:ac` path to run the two commands
stored in the active xBRIEF: `npm run test:focused` and
`npm run check:behavior`.

The first `aggregate` is broader. Its inner task exits nonzero first at
`review:evidence` because no pre-PR evidence exists yet. The wrapper stores
that as `EXPECTED_FAILURE`. This result agrees with passing literal
acceptance: the checks answer different questions.

### 5. Record and classify before repair

Run `pre-pr` while the green source is still unchanged. The helper invokes the
duplicate probe, records one finding, runs a diff check, and proves the product
diff is identical before and after review.

Use this classification:

> `CAP-P1-001` is P1 because a logically duplicate work-item title is
> accepted after trimming and case folding. It is in scope because the behavior
> belongs to `addWorkItem` in the only authorized product file. It blocks this
> exercise's reviewed result and is assigned to the current repair. The
> duplicate probe exits `0` before repair, and the before/after diff digests
> match, proving review did not mutate the product.

Write that classification to the private note before editing, with
`pre-pr.json.generatedAt`, `diffDigestBefore`, and `diffDigestAfter`. This timing
is learner-authored and self-attested. The helper independently proves only that
the unresolved finding existed and the product diff stayed unchanged during
`pre-pr`; do not present either evidence source as the other.

### 6. Make the reviewed source-only repair

After `pre-pr`, replace the attempt's source with this reviewed version:

~~~js
function validateItems(items) {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array of work items");
  }
  for (const item of items) {
    if (!item || !/^WI-\d{3}$/.test(item.id)) {
      throw new TypeError("work-item id must use WI-NNN");
    }
    if (typeof item.title !== "string" || item.title.trim() === "") {
      throw new TypeError("work-item title must be nonempty");
    }
    if (!["open", "done"].includes(item.status)) {
      throw new TypeError("work-item status must be open or done");
    }
  }
}

export function addWorkItem(items, title) {
  validateItems(items);
  if (typeof title !== "string" || title.trim() === "") {
    throw new TypeError("title must be a nonempty title");
  }

  const normalizedTitle = title.trim().toLocaleLowerCase("en-US");
  if (
    items.some(
      (item) =>
        item.title.trim().toLocaleLowerCase("en-US") === normalizedTitle,
    )
  ) {
    throw new RangeError("title duplicates an existing work item");
  }

  const highest = items.reduce(
    (value, item) => Math.max(value, Number(item.id.slice(3))),
    0,
  );
  return [
    ...items,
    {
      id: "WI-" + String(highest + 1).padStart(3, "0"),
      title: title.trim(),
      status: "open",
    },
  ];
}

export function completeWorkItem(items, id) {
  validateItems(items);
  if (typeof id !== "string" || !/^WI-\d{3}$/.test(id)) {
    throw new TypeError("id must use WI-NNN");
  }
  if (!items.some((item) => item.id === id)) {
    throw new RangeError("work item " + id + " not found");
  }
  return items.map((item) =>
    item.id === id ? { ...item, status: "done" } : { ...item },
  );
}

export function summarizeWorkItems(items) {
  validateItems(items);
  return {
    total: items.length,
    open: items.filter((item) => item.status === "open").length,
    done: items.filter((item) => item.status === "done").length,
  };
}
~~~

The helper-owned probe—not a learner edit to the frozen test—confirms:

- duplicate command exits nonzero;
- stderr contains `duplicates an existing work item`;
- supplied focused tests still pass;
- `git diff --check` passes;
- the reviewed source digest differs from the green digest; and
- `review-resolution.json` records one resolved finding and literal `CLEAN`.

### 7. Close only after the reviewed bytes are stable

`review` runs before the product commit. Its
`currentHeadReview: "CLEAN"` field is a fixture schema literal for the
repaired current-product bytes, not an actual remote PR-head review.

`close` verifies that reviewed source digest is unchanged, runs the aggregate,
commits only `src/work-items.mjs`, confirms a clean worktree, and reruns the
aggregate on the resulting commit. It leaves the active xBRIEF running.

## Acceptance evidence

| Evidence | Correct result |
| --- | --- |
| Runtime note | `node --version` records the runtime; the Node.js 22 or newer assertion exits `0`; OS/shell and observed npm, Git, Task, uv, and Windows Python versions recorded |
| `orientation.json` | `PASS`; exact project, branch, empty remote, pin, proposed story, checkpoint |
| `scope.json` | `PASS`; exactly one active story and one product path |
| `readiness.json` | `READY`; session, ritual, story-ready, and preflight exit `0` |
| `red.json` | `EXPECTED_FAILURE`; nested focused exit `1`; no changes |
| `green.json` | `PASS`; source-only diff; frozen test digest; public behavior passes |
| `focused.json` | `PASS`; focused, behavior, and diff checks pass |
| `literal.json` | `PASS`; stored acceptance exits `0` |
| `aggregate-failure.json` | `EXPECTED_FAILURE`; first failing subcheck `review:evidence` |
| `pre-pr.json` plus classification note | `FINDING_RECORDED`; `CAP-P1-001` P1; `diffUnchanged: true`; learner-attested classification timing is labeled |
| `review-resolution.json` | `PASS`; one resolution; literal `currentHeadReview: CLEAN` |
| `closeout.json` | `PASS`; implemented/local pass; no shipping, deployment, or UAT claim |
| Reset-and-archive note | Distinct reset root; both old roots preserved until both exact parents move to recoverable archives |

## Completion-state answer

| Card | Correct Git/review/delivery result | Deployment axis | UAT axis | Missing evidence |
| --- | --- | --- | --- | --- |
| S1 | Implemented with local gate pass; not PR-open, merge-ready, or delivered | Not started | Not started | PR/current-head review, delivery reachability and lifecycle closeout, deployment, UAT |
| S2 | PR-open; not merge-ready | Unknown | Unknown | Current checks and review |
| S3 | Merge-ready; merge remains unauthorized | Unknown | Unknown | Merge and delivery evidence |
| S4 | Integration-merged; not delivered | Unknown | Unknown | `origin/main` reachability and lifecycle closeout |
| S5 | Reachable on delivery branch; not delivered | Unknown | Unknown | Lifecycle closeout with delivered provenance |
| S6 | Delivered | Unknown | Unknown | Deployment and UAT records |
| S7 | Delivered; deployed in `training-staging` | Deployed in `training-staging` | Unknown | Authorized UAT |
| S8 | Delivered; UAT-verified in `training-staging` | Unknown | UAT-verified in `training-staging` | Deployment record |

The capstone's exact closeout fields are:

~~~text
work.status = implemented
ship.status = not_started
ship.remote = ""
gate.status = local_pass
deployment.status = not_started
uat.status = not_started
proof_status = n/a-no-remote-claim
activeContract = xbrief/active/fictional-work-items.xbrief.json
~~~

There is no `delivery.status` or `remote.status` field. Do not invent either.

## Compare with your attempt

Compare these facts, not formatting:

1. Did every stage occur in order against one traceable attempt chain?
2. Did red precede every product edit?
3. Did only `src/work-items.mjs` change?
4. Did the first green version still expose the seeded duplicate defect?
5. Did pre-PR record the finding without changing the diff?
6. Did the reviewed version reject trimmed, case-folded duplicates with the
   required observable message?
7. Did closeout commit exactly the reviewed bytes and pass the unchanged
   aggregate on that commit?
8. Did your statement remain implemented/local-pass only?
9. Did reset create a different root, and did archive preserve both attempts?

A different implementation can be correct when all nine comparisons and every
guarded stage pass.

## Valid alternatives

Accepted alternatives include:

- a loop instead of `reduce` for the highest identifier;
- equivalent immutable `map` behavior;
- ASCII-equivalent lowercasing that passes the exact duplicate probe; and
- different formatting that passes every guarded stage.

Rejected alternatives include:

- rejecting duplicates during the green checkpoint;
- changing the supplied test, helper, Taskfile, story, policy, marker, evidence,
  or allowlist;
- an error that omits `duplicates an existing work item`;
- adding a remote or widening file scope; and
- skipping the expected aggregate diagnosis.

## Expected failures and recovery

| Symptom | Cause | Recovery |
| --- | --- | --- |
| `expected READY stage` | A stage ran out of order | If the attempt is otherwise untouched, run the required preceding stage; if state is uncertain, reset |
| Red record cannot be created | Source changed before meaningful red | Preserve the attempt and reset |
| `pre-PR ... already resolved` | Reviewed code was installed too early | Fresh attempt; retain distinct green and reviewed versions |
| Aggregate says pre-PR evidence is missing | Intended seeded failure | Preserve it, then run `pre-pr`; do not edit the gate |
| Duplicate remains accepted after repair | Normalization or rejection is incomplete | Change only source and retry `review` |
| Duplicate rejects but message differs | Required observable error is missing | Use a message containing `duplicates an existing work item` |
| Guard names another mutable path | Scope was exceeded | Preserve and reset; do not widen the allowlist |
| Reset rejects branch, remote, root, or link identity | Reset itself requires a valid attempt | Leave it untouched and use fresh `create` from a new safe launcher |
| Archive refuses | Caller is inside the parent, root is not exact/canonical, a prohibited link exists, or destination exists | Move outside and pass one exact valid root; otherwise preserve and create fresh |
| Install cannot reach npm | External package prerequisite unavailable | Preserve sanitized output; use approved registry recovery, then record environment blocked |
| Wrapper exit `0` was read as inner green | Expected-failure wrapper semantics were collapsed | Inspect the nested exit in retained JSON |

## Misconceptions exposed

- Expected-failure evidence can be captured successfully.
- A passing focused suite is not literal or aggregate proof.
- The seeded aggregate red is not a gate defect.
- A simulated local `CLEAN` value is not a PR approval.
- Helper stage `COMPLETE` is not lifecycle completion.
- Implemented is not PR-open, merge-ready, or delivered.
- Delivery is not deployment or UAT.
- Reset creates fresh state; it is not rollback.
- Archive is a recoverable move; it is not deletion.
- Reading the solution is not completion evidence.

## Retry plan

Retry with fresh helper-generated evidence. You may focus your analysis on the
unmet outcome, but the executable stage machine must replay all prerequisite
stages. Do not reuse first-attempt evidence as proof for the retry; preserve it
for comparison and recoverable archive.

Stop after two fresh complete attempts, or after the same environment failure
repeats twice without material change. Preserve the evidence and record
`Blocked by environment` instead of weakening a requirement.

No instructor decision is needed. Exact JSON fields, guarded commands, state
cards, and the non-compensating rubric own the result.

## Reset and archive

When the current root still passes identity guards, `reset` creates a unique
new uninstalled root at `CREATED` and preserves the old repository and
evidence. If branch, remote, canonical-root, or prohibited-link identity has
drifted, preserve that root and use a new launcher plus `create` instead.

After the reset drill, leave both attempt parents and archive the completed and
reset roots separately through the original course helper. Each archive is an
exact-parent rename into the OS-temporary
`3ci-directive-capstone-archive` directory. Verify both archived `repo/` and
`evidence/` directories.

Record the original root, reset root, proof they differ, both
`lab-state.json.launcherRoot` values, both archive commands, both returned
destinations, and directory checks in the private note established by the lab
as `$CAPSTONE_ASSESSMENT_NOTE` or `$CapstoneAssessmentNote`. Its dedicated
OS-temporary notes directory is outside both attempt parents, both the original
and reset launcher directories, the curriculum checkout, and business
repositories. Record the note's absolute path. Neither reset nor archive emits
JSON. Archive leaves both launcher directories in place and empty because the
note remains in the separate notes directory; leave those empty directories to
normal OS-temporary cleanup.
Retain the exact notes directory locally only until assessment or approved
review is complete. Then leave that exact OS-temporary directory to normal OS
cleanup or follow an approved private evidence-retention policy; never target a
broader temporary directory, workspace, or home recursively.
Do not use recursive deletion, broad Git cleanup, a wildcard, or an implicit
target.

## Sources

- [Capstone source validation](../references/SOURCE-NOTES.md#capstone-source-validation)
- [Directive source baseline](../references/SOURCE-BASELINE.md#capstone-end-to-end-validation)
- [Capstone lab](../labs/capstone-end-to-end.md)
- [Capstone assessment](../assessments/capstone-end-to-end.md)
- [Directive learner quick reference](../references/QUICK-REFERENCE.md)

## Continue

Return to the [capstone assessment](../assessments/capstone-end-to-end.md) and
score only fresh evidence. When all four outcomes are Demonstrated, return to
the [course map](../curriculum/README.md). Do not infer authorization to push,
open a PR, merge, publish, release, deploy, or perform UAT.
