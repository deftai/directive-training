# Capstone assessment — End-to-End Directive Change

## Assessment record

| Field | Value |
| --- | --- |
| Stable ID | `assessment-capstone-end-to-end` |
| Assesses | `CAP.1`, `CAP.2`, `CAP.3`, and `CAP.4` |
| Status | Learner-ready |
| Last verified | 2026-09-17 |
| Directive baseline | `@deftai/directive@0.119.2`; engine, content, and types `0.119.2`; [source baseline](../references/SOURCE-BASELINE.md#capstone-end-to-end-validation) |
| Execution runtime | Node.js `22 or newer`; the verified local macOS run used `24.20.0`; Node.js 20-compatible application source is a source-level design constraint, not a separate Node.js 20 execution claim |
| Suggested duration | 105–120 minutes, including evidence review, reset, and recoverable archive |
| Suggested first attempt | 45 minutes before opening the explained solution |
| Attempt conditions | Open-book; guarded disposable local repositories; fictional data only; no remote |
| Source exercise | [Capstone lab](../labs/capstone-end-to-end.md) |
| Explained solution | [Capstone explained solution](../solutions/capstone-end-to-end.md) |

The guarded fixture suite ran locally on macOS/zsh with Node.js 24.20.0. Linux and Windows
remain candidates pending native 0.119.2 evidence; no independent learner walkthrough is
inferred from this run.

This assessment requires no instructor, private answer, Greptile result, live
reviewer, GitHub mutation, deployment, or UAT environment. Initial package
installation does contact the configured public npm registry. If that
prerequisite remains unavailable after documented recovery, record
`Blocked by environment`; do not convert it into a knowledge failure.

## Purpose

Prove that you can supervise one bounded Directive-managed change from safe
orientation through truthful local closeout. The assessment measures ordered
authorization, test-backed implementation, distinct quality evidence,
review-response discipline, state classification, and recoverable handling of
an attempt. It does not measure memorized wording, textual similarity to the
worked solution, or access to a live delivery service.

Reading or copying the explained solution is not completion evidence.

## Outcomes and evidence map

| Outcome | Observable outcome | Required practical work | Primary evidence | A miss points to |
| --- | --- | --- | --- | --- |
| `CAP.1` — Establish safe orientation and implementation authorization | Exact guarded identity and runtime, one active/running scope, a current session ritual, and successful story-ready and xBRIEF preflight before product mutation | Advance the untouched attempt through orientation, activation, and readiness in order | Runtime observation in `capstone-assessment-note.md`, `orientation.json`, `scope.json`, `readiness.json`, active xBRIEF, branch/remote/status observations | Modules 7–9 and the orientation hints below |
| `CAP.2` — Implement test-first and prove layered gates | Meaningful red precedes the only `src/work-items.mjs` change; frozen tests, focused behavior, literal acceptance, and diff evidence pass; the first aggregate reaches the seeded review-evidence failure without gate edits | Produce red, green, focused, literal, and expected aggregate-diagnosis evidence | `red.json`, `green.json`, `focused.json`, `literal.json`, `aggregate-failure.json`, source diff | Modules 9–10 and the implementation hints below |
| `CAP.3` — Review, classify, repair, and re-check the current product | Zero-mutation review records `CAP-P1-001` before editing; one source-only repair rejects normalized duplicates; the supplied test stays frozen; simulated current-product review passes | Run pre-PR, classify the finding, make one coherent repair, and run review resolution | `pre-pr.json`, learner classification note, `review-resolution.json`, green and reviewed source versions | Module 11 and the review hints below |
| `CAP.4` — State completion truthfully and recover safely | Closeout commits the reviewed bytes and passes the aggregate on that commit; delivery axes are classified separately; reset creates a distinct root; both attempts are archived recoverably | Close the attempt, complete state cards, perform the reset drill, and archive both exact roots | `closeout.json`, state-card answers, final Git observations, reset-and-archive note | Module 11 and the closeout hints below |

## Preserve and avoid

- Preserve the exact Directive 0.119.2 package graph, supplied
  test, Taskfile, helper, evidence verifier, project definition, active story
  contract, control deposits, `training/capstone` branch, and empty remote list.
- Before readiness and meaningful red, make no product edit.
- After red, limit product mutation to `src/work-items.mjs`.
- Keep helper-generated evidence in the sibling `evidence` directory; do not
  commit or upload it.
- Do not add a remote, push, open a PR, merge, complete the active lifecycle
  scope, deploy, publish, release, or manufacture UAT.
- Do not edit a test, helper, gate, policy, allowlist, evidence record, or stage
  marker to obtain a passing result.
- Do not add a duplicate-title regression test. The protected helper probe is
  the independent comparison for the supplied review finding.

## Assessment tasks

### Task 1 — Establish readiness before mutation (`CAP.1`)

Run `install`, `orient`, `activate`, and `ready` in the lab's exact
order. Retain the three outcome evidence files and confirm that the source
still has its starting digest when readiness is recorded.

Stop if the root, branch, remote, package graph, active contract, allowlist,
session ritual, story-ready check, preflight, or readiness evidence differs.

### Task 2 — Produce green and diagnose the broader gate (`CAP.2`)

Before editing, run `red` and confirm that `red.json` retains the intended
nested test failure with no changed product file. Then implement only the
visible work-item contract and run `green`, `focused`, `literal`, and
`aggregate`. Treat the aggregate's seeded
`review:evidence` failure as diagnostic success; do not change the Taskfile,
verifier, acceptance commands, test, or policy.

The first green version must not reject normalized duplicate titles. That
behavior belongs to the later classified repair.

### Task 3 — Resolve the simulated review (`CAP.3`)

Run `pre-pr` before changing the green implementation. Classify
`CAP-P1-001` as P1, in scope, blocking for this exercise, and
`repair in current batch`, citing the observed duplicate behavior. Add
trimmed, case-folded duplicate rejection only in `src/work-items.mjs`, then
run `review`.

Write the classification in the private note before the repair and include
`pre-pr.json.generatedAt`, `diffDigestBefore`, and `diffDigestAfter`. The
classification timing is learner-authored and self-attested; the helper
independently attests that the finding existed and the product diff stayed
unchanged during `pre-pr`.

The fixture field `currentHeadReview: "CLEAN"` is a literal schema value.
Here it describes the repaired working-tree product digest before the final
commit, not a remote PR-head review or merge-ready proof.

### Task 4 — Close, classify, reset, and archive (`CAP.4`)

Run `close`. Inspect the local commit and each state axis, complete the state
cards, and run the final literal checks. Then use `reset` to create a distinct
fresh root while preserving the completed attempt. Archive the completed and
reset attempts separately and record their destinations.

Helper stage `COMPLETE` means the exercise sequence finished. The fictional
xBRIEF remains active/running; no delivery lifecycle closeout occurs.

## Required evidence manifest

Keep your reasoning, finding classification, state-card answers, and recovery
disposition in the private note whose path the lab established as
`$CAPSTONE_ASSESSMENT_NOTE` on macOS/Linux or `$CapstoneAssessmentNote` on
Windows. Its dedicated OS-temporary notes directory is outside both attempt
parents, both the original and reset launcher directories, the curriculum
checkout, and every business repository. Record its absolute path; do not
commit or upload it.

Retain that exact notes directory locally only until assessment or approved
review is complete. Then leave that exact OS-temporary directory to normal OS
cleanup or follow an approved private evidence-retention policy; never target a
broader temporary directory, workspace, or home recursively.

| Artifact or observation | Exact passing evidence |
| --- | --- |
| `capstone-assessment-note.md` — runtime observation | `node --version` records the runtime; the Node.js 22 or newer major-version assertion exited `0`; OS and shell are named; observed npm, Git, Task, and uv versions are recorded; Windows evidence also records Python |
| `orientation.json` | Schema `3ci.training.capstone.orientation-evidence.v1`; `finalStatus: PASS`; project `Northstar Work Items Capstone`; branch `training/capstone`; empty remote; proposed contract `xbrief/proposed/2026-01-15-fictional-work-items.xbrief.json`; baseline engine `0.119.2`; version command exit `0` |
| `scope.json` | `finalStatus: PASS`; transition from the proposed path to `xbrief/active/2026-01-15-fictional-work-items.xbrief.json`; allowed files exactly `["src/work-items.mjs"]`; promote and activate exit `0`; lifecycle checkpoint recorded |
| `readiness.json` | `finalStatus: READY`; checkpoint matches `scope.json`; active contract and allowlist match; `sessionStart`, `sessionRitual`, `storyReady`, and `activePreflight` each exit `0` |
| `red.json` | `finalStatus: EXPECTED_FAILURE`; `changedFiles` empty; nested focused exit `1`; output names the missing work-items behavior; test digest retained |
| `green.json` | `finalStatus: PASS`; changed files exactly `["src/work-items.mjs"]`; test digest equals the red digest; focused, add, and complete probes exit `0`; add returns `WI-001 / Capture capstone evidence / open`; complete returns `done` |
| `focused.json` | `finalStatus: PASS`; focused, behavior, and diff-check commands exit `0`; behavior result is `{"total":2,"open":1,"done":1}` |
| `literal.json` | `finalStatus: PASS`; stored literal acceptance exits `0` |
| `aggregate-failure.json` | `finalStatus: EXPECTED_FAILURE`; nested aggregate exit is nonzero; `firstFailingSubcheck: review:evidence`; output includes `pre-PR review evidence is missing` |
| `pre-pr.json` | `finalStatus: FINDING_RECORDED`; exactly one `CAP-P1-001` P1 finding on `src/work-items.mjs`; duplicate probe exit `0`; diff check exit `0`; before/after digests match; `diffUnchanged: true` |
| `capstone-assessment-note.md` — classification | Before repair, the learner records `pre-pr.json.generatedAt`, both matching diff digests, and a self-attested classification: `CAP-P1-001` is P1, in scope, blocking under the exercise, and assigned to the current repair; the reason cites the duplicate probe and source boundary |
| `review-resolution.json` | `finalStatus: PASS`; `findingsResolved: 1`; literal `currentHeadReview: CLEAN`; duplicate probe nonzero with `duplicates an existing work item`; focused and diff checks exit `0`; source digest differs from green |
| `closeout.json` | `finalStatus: PASS`; work `implemented`; recorded commit equals current `HEAD`; gate `local_pass`; both aggregate records exit `0`; ship, deployment, and UAT `not_started`; empty remote; active contract unchanged; `proof_status: n/a-no-remote-claim` |
| Evidence-chain checks | Every helper JSON has its expected `schema` and a `generatedAt` value in the same sibling evidence directory; readiness checkpoint equals the scope checkpoint; green test digest equals the red digest; pre-PR diff digests match; reviewed source digest differs from green; final `lab-state.json` has stage `COMPLETE` and `productCheckpoint` equal to `closeout.json.work.commit` |
| Final repository state | Guard passes before archive; branch is `training/capstone`; status and remote are empty; final commit changes only `src/work-items.mjs`; active xBRIEF is still `running` |
| `capstone-assessment-note.md` — recovery disposition | Reset root differs from the completed root and preserves its evidence; both exact attempt parents move to recoverable archives; both attempts' `lab-state.json.launcherRoot` values are named; both residual launcher directories are empty; the note path is outside them |

The outer `red` and `aggregate` helper invocations succeed when they capture
the expected inner failure. Their process exit is therefore `0`, and they
print `"EXPECTED_FAILURE"`. The nonzero exit that matters is stored in
`red.json.focused.exitCode` or
`aggregate-failure.json.aggregate.exitCode`. An unexpected helper stop exits
nonzero and begins with `Capstone stopped:`.

## Final literal checks

Before reset and archive, use the variables established by the lab:

~~~sh
node "$CAPSTONE_HELPER" guard "$CAPSTONE_ROOT"
git -C "$CAPSTONE_ROOT" branch --show-current
git -C "$CAPSTONE_ROOT" remote
git -C "$CAPSTONE_ROOT" status --porcelain
git -C "$CAPSTONE_ROOT" show --name-only --format= HEAD
npm --prefix "$CAPSTONE_ROOT" run test:focused
npm --prefix "$CAPSTONE_ROOT" run check:behavior
~~~

~~~powershell
& node $CapstoneHelper guard $CapstoneRoot
git -C $CapstoneRoot branch --show-current
git -C $CapstoneRoot remote
git -C $CapstoneRoot status --porcelain
git -C $CapstoneRoot show --name-only --format= HEAD
npm --prefix $CapstoneRoot run test:focused
npm --prefix $CapstoneRoot run check:behavior
~~~

Required observations:

- guard exits `0`;
- branch is `training/capstone`;
- remote and porcelain status print nothing;
- the final commit path list contains only `src/work-items.mjs`;
- focused tests exit `0`; and
- behavior output ends with `{"total":2,"open":1,"done":1}`.

Do not rerun `close`; the stage machine correctly rejects a second close
after `COMPLETE`.

## State cards

Fill every blank before comparing with the solution.

| Card | Fixed evidence | Git/review/delivery result | Deployment axis | UAT axis | Missing evidence |
| --- | --- | --- | --- | --- | --- |
| S1 | Capstone `closeout.json` and empty remote |  |  |  |  |
| S2 | A PR exists for the exact commit, but current checks and review are incomplete |  |  |  |  |
| S3 | Exact PR head has required checks and fresh review with zero unresolved P0/P1; merge authority is absent |  |  |  |  |
| S4 | Commit merged to `develop`; configured delivery branch is `main` |  |  |  |  |
| S5 | Commit is reachable from `origin/main`; lifecycle scope remains active |  |  |  |  |
| S6 | Commit is reachable from `origin/main`; lifecycle closeout records delivered provenance |  |  |  |  |
| S7 | S6 plus a deployment record for `training-staging`; no UAT record |  |  |  |  |
| S8 | S6 plus authorized UAT for `training-staging`; no deployment record |  |  |  |  |

## Written reasoning prompts

1. Cite `literal.json` and `aggregate-failure.json` to explain why passing
   literal acceptance and an expected aggregate failure are consistent.
2. Explain why `currentHeadReview: "CLEAN"` is only the fixture's simulated
   current-product result and why the final capstone is implemented but not
   PR-open, merge-ready, or delivered.
3. Explain when `reset` is valid, when a new `create` is required instead,
   and why archive is recoverable retention rather than deletion.
4. Separate helper-attested facts from the learner-attested classification
   timing, and explain why neither may be silently presented as the other.

## Self-evaluation rubric

| Result | Evidence standard |
| --- | --- |
| **Demonstrated** | Every required result for the outcome is present, fresh, tied to the same implementation-attempt chain, and supported by the required reasoning; learner self-attestation is labeled rather than presented as helper-generated proof. |
| **Nearly demonstrated** | The governed result is correct, but one required evidence field or explanation is absent. |
| **Not yet demonstrated** | A stage is missing or reordered, a required inner command fails unexpectedly, a protected artifact changed, evidence comes from another attempt, or the state claim exceeds its proof. |
| **Blocked by environment** | The exact runtime or registry prerequisite remains unavailable after documented recovery. Preserve the failure; do not score it as a knowledge miss. |

The assessment is complete only when `CAP.1`, `CAP.2`, `CAP.3`, and
`CAP.4` are each **Demonstrated**. The criteria are non-compensating: no
stronger result, extra artifact, final green gate, or copied solution can offset
a missing readiness step, meaningful red, unchanged gate, pre-edit review
record, fresh repair evidence, truthful state classification, or bounded
reset-and-archive disposition. `Blocked by environment` is not a pass, and no
numeric average is used.

A protected-file edit, added remote, wrong branch, fabricated evidence, or
lifecycle/delivery overclaim invalidates the affected attempt instead of merely
lowering a score.

## Feedback and bounded recovery

| Observed evidence | Feedback and next action |
| --- | --- |
| Source changed before `red.json` | CAP.2 lacks ordered evidence. CAP.1 is also unmet only when its readiness evidence is missing or stale. Preserve the attempt and use reset if identity remains valid; otherwise create a fresh root. |
| `red` printed `"EXPECTED_FAILURE"` but was marked failed | Inspect the nested focused exit. The wrapper succeeded by retaining the intended failure. |
| Aggregate was “fixed” by changing Taskfile or verifier | Gate integrity was broken. Preserve the attempt and start fresh; do not copy the changed gate. |
| Final reviewed implementation existed before `pre-pr` | The helper cannot record the seeded finding after it is fixed. Start fresh and preserve distinct green and reviewed versions. |
| A duplicate regression test was added | The test is protected and outside file scope. Use the helper-owned duplicate probe and reset. |
| `COMPLETE` was labeled delivered | Inspect `closeout.json`: implemented/local pass, no ship, active contract, no remote. Retry CAP.4. |
| Solution was read before original evidence existed | Reading is not evidence. Reset to a fresh attempt, replay prerequisites, and generate new evidence. |
| Registry install remains unavailable | Preserve sanitized install output and mark `Blocked by environment`; do not substitute an unverified global CLI. |

## Progressive hints

Reveal only one level for the unmet outcome at a time.

<details>
<summary>CAP.1 — Hint 1</summary>

CAP.1 ends at `READY`. Confirm its retained evidence while the product source
still has the starting digest.
</details>

<details>
<summary>CAP.1 — Hint 2</summary>

Inspect `orientation.json`, `scope.json`, and `readiness.json`. Do not edit any
of them.
</details>

<details>
<summary>CAP.1 — Hint 3</summary>

The CAP.1 helper order is `orient -> activate -> ready`.
</details>

<details>
<summary>CAP.2 — Hint 1</summary>

Meaningful red is CAP.2's first evidence. Tests, path inspection, literal
acceptance, and the aggregate then answer different questions.
</details>

<details>
<summary>CAP.2 — Hint 2</summary>

Inspect `red.json`, `green.json`, `focused.json`, `literal.json`, and
`aggregate-failure.json`.
</details>

<details>
<summary>CAP.2 — Hint 3</summary>

The first aggregate must stop at missing `review:evidence`; that is the
expected diagnosis, not permission to edit the gate.
</details>

<details>
<summary>CAP.3 — Hint 1</summary>

Record the duplicate behavior without changing the product diff.
</details>

<details>
<summary>CAP.3 — Hint 2</summary>

Compare the trimmed proposed title and every trimmed existing title using the
same stable case fold.
</details>

<details>
<summary>CAP.3 — Hint 3</summary>

Only `src/work-items.mjs` receives the repair. The rejection text must contain
`duplicates an existing work item`.
</details>

<details>
<summary>CAP.4 — Hint 1</summary>

Split Git/review/delivery, deployment, and UAT into independent evidence axes.
</details>

<details>
<summary>CAP.4 — Hint 2</summary>

Read `closeout.json` literally, including `activeContract` and
`proof_status`.
</details>

<details>
<summary>CAP.4 — Hint 3</summary>

The result is implemented with a local pass only. Then prove fresh reset and
recoverable archive for both exact roots.
</details>

After the final hint, compare with the
[explained solution](../solutions/capstone-end-to-end.md).

## Retry, reset, and archive

A successful retry requires new helper-generated evidence. If the attempt still
has its guarded identity, reset creates a distinct root:

~~~sh
new_capstone_root="$(node "$CAPSTONE_HELPER" reset "$CAPSTONE_ROOT")"
test "$new_capstone_root" != "$CAPSTONE_ROOT"
test -d "$CAPSTONE_ROOT"
node "$CAPSTONE_HELPER" guard "$new_capstone_root"
~~~

~~~powershell
$NewCapstoneRoot = ((& node $CapstoneHelper reset $CapstoneRoot) | Out-String).Trim()
if ($NewCapstoneRoot -eq $CapstoneRoot) { throw "Reset reused the old root." }
if (-not (Test-Path -LiteralPath $CapstoneRoot -PathType Container)) { throw "Old attempt is missing." }
& node $CapstoneHelper guard $NewCapstoneRoot
~~~

The old repository and evidence remain. The new root begins at `CREATED`, so
replay its prerequisites in order even when only one outcome is being rescored.

If branch, remote, canonical-root, or prohibited-symlink identity has drifted,
do not call reset on that invalid root. Preserve its exact path and create a new
attempt from a new dedicated launcher.

Archive only from outside each attempt parent and through the original course
helper:

~~~sh
cd "$COURSE_ROOT"
archive_path="$(node "$CAPSTONE_HELPER" archive "$CAPSTONE_ROOT")"
test -d "$archive_path/repo"
test -d "$archive_path/evidence"
~~~

~~~powershell
Set-Location -LiteralPath $CourseRoot
$ArchivePath = ((& node $CapstoneHelper archive $CapstoneRoot) | Out-String).Trim()
if (-not (Test-Path -LiteralPath (Join-Path $ArchivePath "repo") -PathType Container)) { throw "Archived repository is missing." }
if (-not (Test-Path -LiteralPath (Join-Path $ArchivePath "evidence") -PathType Container)) { throw "Archived evidence is missing." }
~~~

Archive each attempt separately. This is a recoverable move, not deletion. The
archive verbs leave both the original and reset launcher directories in place
and empty because the note lives in the separate notes directory. Record both
launchers from the attempts' `lab-state.json.launcherRoot` values in
`$CAPSTONE_ASSESSMENT_NOTE` or `$CapstoneAssessmentNote`. Never use broad
`git clean`, `git reset --hard`, recursive home/workspace deletion, an
unresolved wildcard, or an implicit target.

Stop after two fresh complete attempts, or after the same environment failure
repeats twice without material change. Preserve the evidence and use
`Blocked by environment`.

## Completion statement

Complete every bracket from your own current evidence:

> I completed `assessment-capstone-end-to-end` against
> `@deftai/directive@0.119.2` and engine `0.119.2`. `CAP.1`–`CAP.4`
> are Demonstrated by the orientation/scope/readiness,
> red/green/focused/literal/aggregate, pre-PR/review-resolution, and closeout
> evidence from one guarded implementation attempt, plus a distinct reset
> attempt and both archive records. The final
> Git/review/delivery state is implemented with a local passing gate; I do not
> claim PR-open, merge-ready, delivered, deployed, or UAT-verified. The archived
> disposable roots are `[completed destination]` and `[reset destination]`,
> and every remote observation was empty.

## Navigation

- Lesson: [Capstone — End-to-End Solo Directive Lifecycle](../curriculum/capstone-end-to-end.md)
- Lab: [End-to-end capstone lab](../labs/capstone-end-to-end.md)
- Compare and retry: [Capstone explained solution](../solutions/capstone-end-to-end.md)
- Assessment policy: [Assessments](README.md)
- Course map: [3Ci Directive training](../curriculum/README.md)
