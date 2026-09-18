# Explained solution — Module 12 review and completion

## Solution record

| Field | Value |
| --- | --- |
| Directive baseline | 0.119.2 |
| Exercise | [Module 12 — PR, review, and actual completion](../curriculum/modules/12-review-and-completion.md#exercise) |
| Evidence type | Explained fixed-state review worksheets |
| Safety boundary | No live repository, PR, review bot, CI, merge, deployment, UAT, credential, or client data |

The worked answer applies the pinned pre-PR, review,
and lifecycle contracts. Keep the packet fictional and any
learner note private and sanitized. Compare the reasons
and evidence, not only the final labels.

## Before you use this solution

Complete all four worksheets: the pre-PR decision, all four finding rows, the
coherent-batch plan, and all nine three-axis completion cards. If you opened this page early, return to
the [exercise](../curriculum/modules/12-review-and-completion.md#exercise) and
make a best attempt. Reading the answer is not outcome evidence.

## Result summary

Pass A restarts because removing the accidental file changed the branch. Pass
B is the first complete zero-change pass. F1's configured-secret exposure and
F2's cross-file mismatch are the blocking in-scope
findings and form one repair batch. F3 is recorded and deferred; F4 is recorded
for separate scope. That batch creates H2, so H1 review is stale. H2 becomes
merge-ready only after current checks and fresh H2 review show zero unresolved
P0 or P1 findings. Delivery later requires both delivery-branch reachability
and lifecycle closeout; deployment and UAT remain separate.

## Outcome map

| Outcome | Evidence in the worked answer |
| --- | --- |
| O12.1 | The Pass A and Pass B table applies every pre-PR phase and the zero-change exit |
| O12.2 | The F1–F4 table records severity, scope, blocking status, disposition, and evidence before the batch |
| O12.3 | The H1-to-H2 plan resolves F1/F2 coherently, records F3/F4, checks consistency, and refreshes H2 evidence |
| O12.4 | The C1–C9 table separates Git/review/delivery state from deployment and UAT evidence |

## Reasoning

Use this order:

1. Complete pre-PR self-review before requesting review.
2. Read every supplied finding before changing the reviewed head.
3. Decide severity and acceptance scope independently.
4. Build one repair from findings that are both in scope and blocking.
5. Record a disposition for every finding excluded from that repair.
6. Bind checks and review to the new head.
7. State the furthest Git/review/delivery result supported by evidence, then
   evaluate deployment and UAT independently.

This ordering matters. Editing after F1 but before reading F2–F4 can create a
partial batch, hide a scope question, and make review evidence harder to bind.
Calling integration-merged work delivered loses the delivery-branch and
lifecycle evidence requirements.

## Worked approach

### Pre-PR decision

| Pass | Decision | Reason |
| --- | --- | --- |
| Pass A | Restart at Read | Removing `tmp/manual-output.txt` is a branch change after Diff, so the pass cannot be the zero-change exit |
| Pass B | Exit pre-PR | Read covers all four scoped files, Write changes nothing, Lint retains current `task check` evidence, and Diff shows only the accepted paths with zero changes required |

A successful zero-change pass is bounded evidence, not a claim of
infallibility. The later F1 and F2 findings can still be valid.

### Finding classification

This table is completed before any H1 edit is proposed.

| Finding | Severity | Acceptance scope | Merge-blocking | Disposition | Evidence |
| --- | --- | --- | --- | --- | --- |
| F1 | P0 | In scope | Yes | Fix in current batch | The public error exposes the configured secret value through REPORT_TOKEN. |
| F2 | P1 | In scope | Yes | Fix in current batch | The documented output term disagrees across files. |
| F3 | P2 | In scope | No | Defer | The suggestion concerns a changed line in scoped source but violates no acceptance behavior. |
| F4 | P2 | Out of scope | No | Separate scope | CSV support is outside the acceptance criteria. |

F1 is P0 because the code path exposes a configured secret value. The packet
redacts that value and contains only the fictional field name. F2 is P1 because
AC2 is not satisfied. F3 concerns a changed line in an allowed source path, so
RP1 keeps it in review scope, but it changes no behavior or acceptance and does
not block. F4 may be useful, but it introduces a new interface that TRAIN-511
does not own.

### One coherent H1-to-H2 batch

Use one coherent batch, not one push per finding:

1. Remove the configured secret value and `REPORT_TOKEN` key from the public
   invalid-input error in `src/average.mjs`.
2. Add a regression assertion in `test/average.test.mjs` that invalid input is
   rejected and the public error keys contain no token field.
3. Replace `mean` with `average` in `README.md` so it agrees with the source,
   test, and `docs/output-contract.md` example.
4. Perform a cross-file term search for `REPORT_TOKEN`, `mean`, and `average`
   across all four scoped files.
5. Validate the structured data shape: successful output contains only
   `count`, `total`, and `average`; the public error contains no secret-shaped
   field.
6. Run the focused checks and full required gate, then complete another
   zero-change pre-PR pass.
7. Record F3 as deferred with its nonblocking rationale and F4 as separate
   scope. Do not include either in H2.
8. After the complete H1 finding set has been classified and repaired, record
   one H2 commit and one push for the batch.

The related source, regression test, documentation, cross-file term search,
and structured data validation make this one review repair. Splitting F1 and F2
into separate pushes would repeatedly invalidate head-bound evidence without
improving the scope boundary.

The batch creates H2. A review of H1 is stale after H2 exists. Required checks
must pass on H2, followed by a fresh review of H2. Do not push again while that
H2 review is in progress. Merge-ready requires zero unresolved P0 or P1
findings on that current head. If fresh H2 review reports another blocker,
classify its complete finding set and begin another coherent batch iteration.
The recorded P2 disposition remains visible without blocking under the
supplied policy.

### Completion classifications

| Card | Fixed evidence | Git/review/delivery result | Deployment axis | UAT axis | Missing evidence |
| --- | --- | --- | --- | --- | --- |
| C1 | Local diff and acceptance evidence; no PR | Implemented | Unknown | Unknown | PR and every later-state record |
| C2 | PR exists at H1; required checks and review are incomplete | PR-open; not merge-ready | Unknown | Unknown | Current checks and review, then later-state records |
| C3 | H2 checks pass; only H1 was reviewed | Not merge-ready | Unknown | Unknown | Fresh H2 review, then later-state records |
| C4 | H2 checks pass; fresh H2 review has zero unresolved P0 or P1 findings | Merge-ready | Unknown | Unknown | Merge, delivery, deployment, and UAT records |
| C5 | Merged to `develop`; delivery branch is `main` | Integration-merged; not delivered | Unknown | Unknown | `origin/main` reachability and lifecycle closeout, then deployment and UAT records |
| C6 | Commit is reachable from `origin/main`; lifecycle scope remains active | Reachable on delivery branch; not delivered | Unknown | Unknown | Lifecycle closeout with delivered provenance, then deployment and UAT records |
| C7 | Commit is reachable from `origin/main`; lifecycle closeout records delivered provenance | Delivered | Unknown | Unknown | Deployment and UAT records |
| C8 | C7 evidence plus a deployment record tying H2 to `training-staging`; no UAT evidence | Delivered | Deployed in `training-staging` | Unknown | Authorized UAT evidence for `training-staging` |
| C9 | C7 evidence plus an authorized UAT record for `training-staging`; no deployment record | Delivered | Unknown | UAT-verified in `training-staging` | Deployment record for the claimed environment |

C4 does not authorize a merge; it classifies readiness only. C5 corresponds to
the exact Directive machine-state idea `merged_to_integration`. C6 proves only
one half of delivery. C7 adds the lifecycle closeout and delivered provenance.
C8 and C9 explicitly inherit C7, so both retain the delivered result while
adding evidence on only one independent axis.

Deployment is an independent evidence axis; Git delivery does not prove it.
UAT is an independent evidence axis; Git delivery does not prove it. Likewise,
C8 does not invent UAT, and C9 does not invent deployment.

## Acceptance evidence

- **O12.1:** Pass A restarts after its cleanup change; Pass B is a full
  Read-Write-Lint-Diff pass with zero edits and current gate evidence.
- **O12.2:** F1–F4 are all classified before the batch. Each row separates
  severity from acceptance scope and records blocking status, disposition, and
  evidence.
- **O12.3:** H2 contains only F1/F2 repair work plus its necessary tests and
  consistency checks. F3/F4 remain recorded. Checks and review are rebound to
  H2.
- **O12.4:** Every C1–C9 row names Git/review/delivery, deployment, UAT, and
  missing evidence separately. C8 and C9 demonstrate independent deployment
  and UAT evidence on top of C7 delivery.

The attempt passes when your worksheets preserve these relationships. Copying
this page without your own classification is not evidence.

## Compare with your attempt

Check differences in this order:

1. Did you restart after the last edit in Pass A?
2. Did you classify all four findings before planning H2?
3. Did every row contain evidence from AC1–AC4 or the H1 file card?
4. Did H2 contain F1/F2 only, with F3/F4 dispositions still recorded?
5. Did you require checks and review from H2 rather than H1?
6. Did you require reachability and lifecycle closeout for delivery?
7. Did you record Git/review/delivery, deployment, UAT, and missing evidence in
   separate cells without inferring one axis from another?

Different wording is valid when it reaches the same evidence-bounded result.

## Valid alternatives

- F1's disposition may say “blocking security batch” instead of “Fix in
  current batch.” It must remain P0, in scope, and blocking.
- F3 may be rejected rather than deferred if the recorded rationale says the
  existing name is already sufficiently clear. It must not silently enter the
  blocking batch.
- F4 may become a new proposed story after separate authorization. It cannot be
  added to TRAIN-511 merely because it was suggested during review.
- The H2 batch may use a different order for source, test, and documentation
  edits. It must remain one coherent unit and run the same consistency checks.
- A project may name a delivery branch other than `main`; use the configured
  branch. This fixed packet names `main`.

No alternative may reuse stale review, leave a P0/P1 unresolved while claiming
merge-ready, or infer deployment or UAT from Git state.

## Expected failures and recovery

| Difference | Correction |
| --- | --- |
| Pass A exited | Restart after the temporary-file removal and complete Pass B |
| One finding is blank | Suspend the batch plan and classify F1–F4 first |
| F1 is P1 or nonblocking | Reapply the supplied critical-security definition and AC3 |
| F3 blocks merge | Reapply the supplied P2 policy and cite the absence of behavior impact |
| F4 enters H2 | Separate usefulness from acceptance scope and record a new-scope disposition |
| F1 and F2 become separate pushes | Rebuild the single source/test/docs consistency batch |
| H1 review supports H2 | Mark the review stale and require fresh H2 evidence |
| C5 or C6 is delivered | Add the missing delivery-branch or lifecycle-closeout half before using that label |
| C8 implies UAT, or C9 implies deployment | Keep the inherited C7 delivery result and mark the unsupported independent axis unknown |

## Misconceptions exposed by this exercise

Severity does not decide scope. A nonblocking finding is not an unrecorded
finding. A complete self-review can precede a valid external defect report.
Review approval is bound to a head. Merge readiness is not merge authority.
Integration merge is not delivery, and delivery is not deployment or UAT.

## Retry plan

Retry the first incorrect layer only:

1. Cover the answer and redo the Pass A/Pass B decision.
2. Reveal only the severity definitions and classify F1–F4.
3. Reveal scope and blocking columns, then finish dispositions and evidence.
4. Build the H2 batch from the blocking in-scope rows.
5. Split completion cards into Git/review/delivery, deployment, and UAT axes.

Compare again after each layer. Stop after two complete retries and record the
exact remaining ambiguity as sanitized curriculum feedback.

## Reset and cleanup

This command-free exercise creates no repository, branch, PR, cache, remote,
deployment, or UAT state. Reset by discarding the worksheet or making a fresh
blank copy. Retain only sanitized private learning evidence if permitted. No
cleanup command is required.

## Sources

- [Module 12 lesson](../curriculum/modules/12-review-and-completion.md)
- [Directive source baseline](../references/SOURCE-BASELINE.md#module-12-review-and-completion-validation)
- [Module 12 source notes](../references/SOURCE-NOTES.md#module-12-source-validation)
- [Directive learner quick reference](../references/QUICK-REFERENCE.md)

## Continue

Continue to the learner-ready
[Capstone — End-to-End Solo Directive Lifecycle](../curriculum/capstone-end-to-end.md),
or return to the [course map](../curriculum/README.md).
