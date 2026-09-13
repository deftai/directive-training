# Explained solution — Projection Drift Recovery

## Solution record

| Field | Value |
| --- | --- |
| Stable ID | `solution-lab-05-projection-drift-recovery` |
| Solves | [Lab 5 — Projection drift recovery](../labs/05-projection-drift-recovery.md) |
| Outcomes covered | O5.1, O5.2, O5.3 |
| Status | Learner-ready draft for macOS/zsh and Windows/PowerShell 7.4+ paths |
| Last verified | 2026-09-12 |
| Directive baseline | CLI/core/content/types 0.112.0; [source baseline](../references/SOURCE-BASELINE.md) |
| Verified environment | macOS 26.6.2/zsh 5.9; Windows 11/PowerShell 7.6.5, Node.js 26.8.1, npm 11.19.0, plus a learner report on PowerShell 7.6.6 |
| Platform limit | Linux/bash is not verified for this lab |

Claims use **[Directive behavior]**, **[3Ci policy]**, and **[Course guidance]** as defined in
the lab. The fixture and helper are course tooling, not new Directive features.

## Before you use this solution

Try the tasks for about eight minutes and use one hint at a time. Keep your ownership table,
diff, commands, exits, and observations. This is a suggested learning route, not an access
gate: the solution is available whenever you need it, without an instructor.

If you read it first, use the worked approach to orient, then create a fresh attempt through
the original course fixture and complete the task from your own evidence.

## Result summary

The authoritative JSON changes one module purpose. The generated map then displays that
purpose and the same one-file source boundary. Both a projection-only fault and the later
source change produce a freshness exit 1 before regeneration and exit 0 afterward.

This result proves projection recovery and propagation of an architecture description.
It does not prove that stop-code validation has been implemented. The JavaScript fixture is
unchanged, and no implementation scope, remote, PR, deployment, or publishing action occurs.

## Outcome map

| Outcome | Decision or action | Evidence |
| --- | --- | --- |
| O5.1 | Identify authored intent, observed source, generated output, and checkpoint evidence | Ownership table plus source pointer and purpose-only diff |
| O5.2 | Recover a supplied direct edit; change source purpose and regenerate | Two stale exits 1, two renderer/retry passes, final new purpose |
| O5.3 | Establish a pinned bounded environment, verify useful output, reset, and archive | Five final passes, separate existence/content proof, new reset root, preserved evidence |

## Reasoning

### 1. Establish the controlling facts

- **[Directive behavior]** The map banner points to
  `xbrief/PROJECT-DEFINITION.xbrief.json plan.architecture.codeStructure`.
- **[Directive behavior]** The renderer combines authored module intent with observed files
  matched by `src/*.js`. The fixture matches one fictional JavaScript file.
- **[Directive behavior]** A present MAP is compared against the current expected rendering.
  An absent MAP is advisory and returns success in 0.112.0.
- **[3Ci policy]** All exercise mutations remain in the unique no-remote temporary attempt.
  The learner changes only its declared source purpose.
- **[Course guidance]** The simulated direct edit supplies a reproducible failure without
  making accidental corruption a prerequisite.

### 2. Choose an approach

Use the generated banner to find ownership. Regenerate the supplied bad MAP from unchanged
source, then change the requested source field and regenerate again. Never copy a desired
sentence directly into the MAP as the final repair.

Changing the renderer or freshness gate would change the test instead of satisfying this
exercise. Deleting the MAP would exploit the advisory missing-output rule while failing the
lab's meaningful-output check. Widening `src/*.js` to the whole repository would abandon
the declared source boundary and can pull generated artifacts into the extraction input.

### 3. Predict the evidence

| Event | Source purpose | MAP state | Freshness |
| --- | --- | --- | ---: |
| Before first render | Original | Absent | 0; advisory absence, not completion |
| Initial render | Original | Matches source | 0 |
| Supplied direct edit | Original | Contains unsupported note | 1 |
| Regenerate unchanged source | Original | Unsupported note removed | 0 |
| Learner edits source | New | Still shows original | 1 |
| Regenerate changed source | New | Displays new purpose | 0 |

The source diff distinguishes the two stale states. The first has no source change; the
second has exactly the requested purpose change. A stale result by itself does not identify
which mechanism occurred.

## Worked approach

### Step 1 — Create and checkpoint the exact fixture

Run the lab's complete “Environment and starting-state check” and “Starting checkpoint”
blocks. These blocks are the setup contract; do not substitute an existing consumer repository.

The helper creates only a unique temporary attempt, copies the named fictional fixture with LF endings,
initializes local Git with an empty template, and creates the exercise branch. It checks the
repository identity, empty remote, canonical paths, source shape, and symlink boundaries.
The scoped npm invocation leaves your caller and global configuration unchanged.

Expected outputs include:

```text
OK: CLI/core/content/types 0.112.0
@deftai/directive (engine: @deftai/directive-core@0.112.0)
OK: lab-05-start checkpoint
```

The checkpoint prints all nine accepted files, including `.gitattributes`, before committing. Framework deposits,
caches, session state, USER.md, node_modules, and the generated MAP remain untracked or
absent. The ignored MAP is still meaningful output; Git tracking does not determine ownership.

### Step 2 — Read the ownership evidence

Run the exact Task 1 probes from the lab, including its guard before the renderer help probe.
The released `codebase:map --help` writes a MAP; `verify:codebase-map-fresh --help` executes
freshness. The latter first reports fresh with no MAP present. Keep that observation as a
limit of the gate, not permission to treat all missing output as success.

Your ownership table should explain:

| Artifact | Role | What changing it would mean |
| --- | --- | --- |
| `xbrief/PROJECT-DEFINITION.xbrief.json`, module `purpose` | Authored architecture intent | A durable description change supplied to the renderer |
| `src/stop-code.js` | Observed repository input | An application/source change, outside this exercise's requested edit |
| `.planning/codebase/MAP.md` | Generated projection | Temporary output that regeneration replaces |
| `lab-05-start` and parent `lab-state.json` | Checkpoint and original fixture evidence | An explanation of the exercise's initial conditions, not a new map source |
| Parent `evidence.md` | Learner proof | Your decisions, observations, and cleanup record |

The map's `stop-code` row initially shows “Normalize fictional stop codes.”, `src/*.js`,
and file count `1`. Its generated banner and source pointer establish the ownership boundary.

### Step 3 — Diagnose the supplied projection-only edit

Run `node projection-lab.mjs guard` and `node projection-lab.mjs inject-drift` in the
disposable root. The latter appends a clearly labeled simulated note and leaves source intact.
Use the lab's Task 2 block to capture freshness exit 1 without terminating the dedicated shell.

Expected diagnostic:

```text
Error: generated codebase MAP is stale; run `task codebase:map` to refresh ...
```

The real diagnostic includes your actual temporary MAP path, not the ellipsis shown here.
The source diff command returns 0. Thus, the mismatch came from output tampering.

A correct written answer is:

> The MAP is a generated view. Its unsupported note has no matching source change, so I
> will regenerate it from the declared source and retain the stale result as evidence.

Run the same guarded renderer and freshness commands from Task 2. The simulated note
disappears. This restores the original description without editing source or weakening a gate.

### Step 4 — Edit the authoritative description

After the guard passes, use your editor to replace only the `purpose` value in the
disposable project JSON:

```diff
-            "purpose": "Normalize fictional stop codes.",
+            "purpose": "Normalize and validate fictional stop codes.",
```

This change is intentionally visible and authored by the learner. The fixture helper never
makes it for you. Keep the source glob, projection destination, metadata, and JavaScript intact.

Keep `.gitattributes` unchanged. It normalizes the source JSON's Git representation,
so an LF or CRLF editor save can express the same purpose-only patch. Save UTF-8
without BOM; trailing spaces and tabs still fail the original whitespace check.

Use Task 3's pre-render freshness block. Expected exit: 1. This time the source changed
while the MAP still describes the previous intent.

Then run:

```sh
node projection-lab.mjs guard
./node_modules/.bin/directive codebase:map --project-root .
./node_modules/.bin/directive verify:codebase-map-fresh --project-root .
node projection-lab.mjs verify-result
```

The renderer reports the actual MAP path. Freshness reports `OK: generated codebase MAP is
fresh`. The helper reports `OK: source edit, existing MAP, and bounded diff`.

The final module row contains “Normalize and validate fictional stop codes.” with
`src/*.js` and file count `1`. No individual file-name list is promised by this release's
MAP format; the fixture path, bounded glob, and matched-file count supply that evidence.

## Acceptance evidence

Run the lab's five literal final commands, unchanged:

```sh
node projection-lab.mjs guard
node projection-lab.mjs verify-pin
./node_modules/.bin/directive verify:codebase-map-fresh --project-root .
node projection-lab.mjs verify-result
git diff --check
```

| Validation | Required result | Why it is needed | Outcome |
| --- | --- | --- | --- |
| Guard | 0; recorded canonical temp root | Bounds the environment and source/output paths | O5.3 |
| Pin verification | 0; CLI/core/content/types 0.112.0 | Binds claims to the taught release | O5.3 |
| Released freshness | 0; fresh MAP message | Compares present output with the current expected rendering | O5.2–O5.3 |
| Exercise result | 0; existing MAP and bounded diff message | Requires meaningful output, exact source change, and no unexpected nonignored files | O5.1–O5.3 |
| Diff check | 0; no whitespace error | Checks the narrow authored patch | O5.3 |

Also retain both earlier stale exits 1 and the source/projection reasoning. A screenshot of
the final green output alone loses the recovery evidence.

### Module 5 self-assessment answers

1. **O5.1:** `xbrief/PROJECT-DEFINITION.xbrief.json` owns the
   `plan.architecture.codeStructure.modules[0].purpose` field. The verified local
   `directive codebase:map --project-root .` command produces its MAP view.
2. **O5.2:** the direct edit disappears because it is absent from the source used to render
   the map. The purpose-only source diff, new purpose in the regenerated module row, and
   passing freshness check prove the source correction propagates.
3. **O5.3:** absent MAP output is advisory in 0.112.0, so a freshness exit 0 can accompany
   no file. `node projection-lab.mjs verify-result` adds required existence, generated
   banner, source pointer, new purpose, bounded glob/file count, and diff checks.
4. **O5.3:** keep the earlier attempt and `../evidence.md`; create a new unique directory
   through the original course fixture. Prove the roots differ and the old evidence still
   exists before retrying. Archive only the exact guarded attempts after recording evidence.
   Leave each attempt first, then invoke the original course helper with
   `archive` and that attempt's absolute root. The helper checks the target again;
   running from the course directory does not authorize course mutations.

## Compare with your attempt

| Compare | Match | Difference and next action |
| --- | --- | --- |
| Baseline and root | Exact pinned local packages in the guarded temp root | Repeat setup/pin recovery |
| Ownership | Source intent and generated view are separated | Revisit the banner and source pointer |
| First stale state | MAP fault; unchanged source diff | Verify the simulated fault was injected before source editing |
| Second stale state | Purpose-only source diff; pre-render stale output | Recheck the order of edit, check, and render |
| Final proof | Existing meaningful MAP plus freshness and bounded diff | Run the missing original acceptance check |
| Reset/cleanup | New root, old evidence retained, both dispositions recorded | Finish the source lab's exact reset/archive steps |

## Valid alternatives

| Alternative | Why it passes | Boundary |
| --- | --- | --- |
| Use any local editor for the source change | The same JSON purpose and narrow diff result | Do not change globs, helper code, or the projection directly |
| Reformat whitespace without changing other JSON values | The helper compares JSON values, and the diff is still confined to source | `git diff --check` must pass; keep the change easy to explain |
| Different wording in the ownership explanation | The same roles and evidence can be explained in many ways | Must cite the actual banner/source and distinguish recovery evidence from authority |
| Keep an unsafe or broken prior attempt for recovery | Preserves evidence when its guard cannot pass | State the retained path and failure; do not claim it was archived |

Changing the requested purpose wording does not satisfy this particular exercise's exact
acceptance. That is the lab's fictional requirement, not a Directive-wide wording restriction.

## Expected failures and recovery

### “Fresh” with no output

- **Symptom:** freshness returns 0 but the MAP file is missing.
- **Cause:** 0.112.0 deliberately treats absent MAPs as advisory.
- **Confirm:** `test -f .planning/codebase/MAP.md` fails.
- **Recover:** run the guarded renderer.
- **Retry:** freshness and `verify-result` both pass with meaningful output present.

### Source edit leaves a stale view

- **Symptom:** source purpose is new; MAP purpose is original; freshness exits 1.
- **Cause:** the changed source has not been projected.
- **Confirm:** inspect the purpose-only source diff and map row.
- **Recover:** guard, render from the source, and rerun the same freshness command.
- **Retry:** new purpose appears, one source file remains matched, and the helper passes.

### Guard, pin, or installation failure

- **Symptom:** a command names an unexpected root, remote, symlink, source shape, or version;
  npm may instead report an authentication/configuration error.
- **Cause:** the environment differs from the provided fixture or verified public-registry path.
- **Confirm:** retain the exact command, exit, and sanitized diagnostic.
- **Recover:** preserve the old attempt and create a fresh one from the original course
  fixture. Do not remove a remote, repair an unknown symlink, use global CLI fallback, or
  supply credentials.
- **Retry:** a new starting check passes before any new exercise mutation.

### Baseline differs

Use the lab's explicit local `--version` and package-graph check. The known map-help probes
belong only in the guarded disposable root because they have side effects. Do not guess
syntax from a newer version or run these help probes in a business repository.

### Whitespace check fails after editing the source

Retain the diagnostic and inspect the indicated line. Remove only accidental
trailing spaces/tabs in your edit, then guard, regenerate, and rerun the same
checks. The fresh fixture supports LF and CRLF source edits through its fixed
attributes; do not weaken `git diff --check`, edit those attributes, or change
Git configuration. If line endings alone still cause a failure, preserve the
source bytes, effective attributes, index EOL, and error for the maintainer.

### Archive refuses a working directory or the move fails

- **Symptom:** the helper asks you to leave the attempt parent, or a rename reports
  `EPERM` / an open-directory error.
- **Cause:** the caller or another process can hold a directory open; Windows
  prevents moving a process's current directory. A permission error alone does
  not identify every possible lock holder.
- **Recover:** use the lab's outside-directory archive commands with the exact
  absolute target. Do not change directories inside the helper to hide the error.
- **Evidence:** require exit 0, source absence, and preserved destination files.
  If the documented move fails, retain the attempt and diagnostic without a force
  retry, deletion, or a claimed archive success.

## Misconceptions exposed by this exercise

| Misconception | Evidence-based correction |
| --- | --- |
| “Every tracked file is a source, and ignored files do not matter.” | The ignored MAP still needs freshness and content proof; tracking and ownership are separate. |
| “Editing the generated file updates durable intent.” | Regeneration removes the simulated note because it has no corresponding source change. |
| “A passing gate proves the entire outcome.” | Freshness can pass with no MAP; the exercise result adds required existence and meaning. |
| “A new architecture description implements behavior.” | The JavaScript input remains unchanged; only a description and its projection changed. |
| “Help is always read-only.” | This release's map-help probe actually writes a MAP. |
| “Reset means erasing mistakes.” | A fresh attempt leaves the earlier evidence intact. |

## Retry plan

1. Keep the original failure record and relevant narrow diff.
2. Follow the source lab's fresh-directory reset.
3. Repeat its pin, guard, and checkpoint steps if retrying the exercise.
4. Complete only the unmet reasoning or recovery step first.
5. Run all five original acceptance commands, then record reset and cleanup state.

Reading this solution alone is not completion evidence.

## Reset and cleanup

Use the source lab's exact “Reset to start” and “Cleanup” blocks. They create a new OS-temp
repository and prove the earlier evidence still exists, then move each exact attempt parent
to `3ci-directive-lab-archive`.

- Additional solution state: none beyond the source lab's fixture, install/cache, MAP, and
  evidence note.
- No server, port, container, or background process needs stopping.
- No global environment restoration is needed: the install environment is child-local.
- The archive retains repository and evidence without recursive deletion. The active path
  is absent afterward; the named archive contains the expected files.
- If a prior guard cannot pass, record that attempt as retained for recovery. Do not conceal
  the gap or apply broad cleanup.

## Sources

| Claim | Type | Verified source |
| --- | --- | --- |
| Authored structure, default extraction, generated MAP, and freshness | Directive behavior | Pinned [command reference](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/content/commands.md), “Project And Architecture Commands”; observed 0.112.0 renderer and freshness commands |
| Source authority and projection boundary | Directive behavior | Pinned [Concepts](https://github.com/deftai/directive/blob/7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808/docs/CONCEPTS.md), “Source Of Truth Vs Projection” |
| Side-effecting help and advisory absent MAP | Directive behavior | Disposable 0.112.0 probes recorded in [source notes](../references/SOURCE-NOTES.md) |
| Disposable paths, no credentials/remotes, recoverable reset | 3Ci policy | [Lab environment contract](../labs/README.md) and [Lab 5](../labs/05-projection-drift-recovery.md) |

The macOS behavior claims were verified on 2026-09-07; a native Windows replay and separate
learner walkthrough were recorded on 2026-09-12. Explanations are original teaching
adaptations; exact names, commands, and short output fragments retain the released spelling.

## Continue

- Return to [Lab 5](../labs/05-projection-drift-recovery.md) and retain its done statement.
- Complete the self-assessment in [Module 5](../curriculum/modules/05-sources-versus-projections.md).
- Use the [course map](../curriculum/README.md) for the next available module.
