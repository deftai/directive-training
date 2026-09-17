# Explained solution — Lab 2: Initialize a Disposable Directive Consumer

This solution explains the detailed local macOS/zsh route and how to evaluate equivalent
learner evidence. The 0.119.2 pinned npm path is verified on macOS/zsh.
Linux/bash and Windows/PowerShell remain candidates pending native 0.119.2 evidence.

## Solution record

| Field | Value |
| --- | --- |
| Stable ID | `solution-lab-02-disposable-initialization` |
| Solves | `lab-02-disposable-initialization` |
| Outcomes covered | O2.1, O2.2, O2.3, O2.4 |
| Status | `learner-ready draft` |
| Last verified | 2026-09-17 |
| Directive baseline | `@deftai/directive@0.119.2`, engine `@deftai/directive-core@0.119.2`; see the [source baseline](../references/SOURCE-BASELINE.md) |
| Source exercise | [Lab 2](../labs/02-disposable-initialization.md) |

## Before you use this solution

Spend at least 10 minutes on the lab and open its three hints in order. Keep passing command
evidence, any actual failure evidence, and the required provided-case recovery decision. The
goal is to compare mechanisms and outcomes, not reproduce the wording below.

This is a suggestion, not an access gate. The solution is available without
an instructor, private message, review bot, credential, or automation unlock.

If you opened it first, read the reasoning, create a fresh disposable attempt, close this
file, and perform the lab from its starting-state check. Never practice the commands in this
curriculum repository or a business repository.

## Result summary

The valid route used `init` because the fictional repository had no Directive footprint,
but it expected the released `brownfield-install` classification because Git already existed.
The fixture established the exact 0.119.2 pin before installation, and every Directive
command used the explicit project-local binary. The installed Git hook resolved its `deft`
runtime from the same local `node_modules/.bin`. Git evidence separated
authoritative sources from tracked managed integration and ignored runtime or reconstitutable
state.

Doctor exited 0 with two warnings in the verified attempt. The solution records those
warnings and the recommended path; it does not redefine success as “no output.” The
provenance signpost named `directive migrate` to stamp npm provenance. Module 2 records and
classifies that recommendation but does not execute the untaught migration. The provided
fictional `E401` record supplies a deterministic recovery decision without requiring a
learner to manufacture a live failure.

## Outcome map

| Outcome | How this solution demonstrates it | Evidence |
| --- | --- | --- |
| O2.1 | Selects commands from footprint and health state and separates consumer from maintainer surfaces | Three-row chooser note plus repository-boundary answer |
| O2.2 | Installs the exact pin and initializes through the explicit local CLI inside a guarded no-remote repository | Local `--version`, init exit, root guard, empty `git remote` |
| O2.3 | Separates Git tracking from source ownership | Path classification table plus `git ls-files` and `git check-ignore` |
| O2.4 | Records doctor/toolchain results and traces the provided failure through a fresh-attempt recovery decision | Exit summary, warning classifications, five-field recovery decision |

## Reasoning

### 1. Establish the controlling facts

- `init` is the consumer entry path when no existing Directive
  footprint is present; `update` reconciles an initialized footprint; `doctor` classifies an
  unknown or unhealthy state. Sources: pinned Concepts, setup skill, and live help.
- Directive 0.119.2 classifies an otherwise empty repository with
  `.git` as brownfield. The classification does not mean the learner selected the wrong
  command.
- The released 0.119.2 init path creates an exact CLI package pin. The fixture
  seeds the exact CLI/core/content/types graph first so installation cannot resolve a mixed
  graph before the learner verifies it.
- Executable exercises use a unique temporary no-remote repository, fictional
  data, explicit paths, bounded mutation, and recoverable cleanup.
- Preserve a failed attempt and retry in a fresh directory. This keeps
  evidence and avoids guessing which generated paths are safe to erase.

The state-to-command answer is:

| State | First command | Reason |
| --- | --- | --- |
| No Directive footprint | `directive init` | Establish the consumer integration. |
| Existing recognized footprint needing reconciliation | `directive update` | Refresh managed surfaces from the pin. |
| Partial, surprising, or unknown state | `directive doctor` | Diagnose first and follow one named recovery. |

The worked repository-boundary answer is also concrete: `directive doctor` is a consumer
surface when run in the disposable Northstar consumer repository. By contrast,
`task check:framework-source` is a maintainer-only surface for the separate
`deftai/directive` source checkout; do not run or copy it into this training consumer lab.

### 2. Choose an approach

The safe order is boundary first, then version proof, then mutation: create a unique
temporary root, prove it is outside the curriculum, initialize Git, prove no remote, install
the exact fixture, prove the local binary, inspect help, initialize, inspect and checkpoint
the allowed path set, then diagnose, classify, complete the recovery decision, run acceptance,
and archive the exact parent.

A tempting but invalid approach is `npx --no-install directive init` without first proving a
local install. The recorded failed attempt showed that this can find a global executable,
which would prove neither the fixture pin nor the intended dependency graph. Another invalid
approach is `git add --all`; it bypasses inspection of the generated boundary.

### 3. Predict the evidence

Before running the verified route, the expected observations were:

- the explicit local version contains `@deftai/directive-core@0.119.2`;
- `command -v deft` resolves to the disposable repository's local binary before commit;
- init exits 0 and may say brownfield because `.git` exists;
- `.deft/core/VERSION` is present but ignored;
- doctor and the consumer toolchain check exit 0, although doctor may warn;
- `git remote` prints nothing before and after every Directive mutation;
- only the inspected tracked allowlist is committed, and the exact parent is later archived.

## Worked approach

The walkthrough below assumes the lab's complete macOS/zsh starting-state block has defined
`training_root`, `fixture`, `lab_parent`, `lab_root`, `evidence_note`,
`assert_lab_root`, and `assert_no_remote`, and that the current directory is the new Git root on
`training/module-02` containing only
`.gitignore`, `.npmrc`, and the fictional `package.json`. That linked block is part of this worked
approach; do not substitute an existing repository.

### Step 1 — Install and prove the pinned local executable

**Action:** Run the lab's complete `module_02_initialize` block on the fresh attempt. Its
first phase checks the fixture pin and installs from the public-registry `.npmrc`
with inherited `NPM_CONFIG_*` values removed from the child process. The install
uses a lab-local cache and no lifecycle scripts. It then sets `local_bin` to
the attempt's `node_modules/.bin`, prepends it to `PATH`, and proves both
`directive_path` and the resolved `deft` command are inside that exact directory. It then
checks every installed Directive package and captures the CLI version before inspecting the
version string.

**Why:** The package file is both fictional/private and exact. Testing the explicit local
path prevents a global installation from standing in for the project pin. Selecting the
local `deft` runtime also proves the installed pre-commit hook does not depend on a global
Directive installation.

**Observe:** The verified attempt installed 48 packages and reported
`@deftai/directive-core@0.119.2`. The number of packages is context, not an acceptance gate;
the exact core version is the required signal.

### Step 2 — Verify help and initialize the consumer

**Action:** Continue the same checkpoint block. It runs global help, the command inventory,
and init/update/doctor help through `directive_path`. It captures the known
`toolchain:check --help` exit without changing interactive shell options, then runs init
between two no-remote checks. The post-init assertions positively require tracked
`AGENTS.md`, `Taskfile.yml`, `.deft/GENERATION.json`, `.githooks/pre-commit`, and
`xbrief/PROJECT-DEFINITION.xbrief.json`; schema 0.8; generation 0.119.2; and
`core.hooksPath=.githooks`.

**Why:** Each taught verb is checked against the release. The known help failure is retained
as evidence instead of “fixed” by inventing a different flag. Init runs only after the root,
remote, and version are proven.

**Observe:** In the verified run, init exited 0 and selected the brownfield path. The managed
integration and ignored core deposit appeared. The tracked `.npmrc` remained the
normal-path registry contract, `.npm-cache/` remained ignored, and init did not
add a remote.

### Step 3 — Inspect and commit only the accepted path set

Use the remainder of the lab's complete `module_02_initialize` block. Directive 0.119.2 stages
many installer-managed paths during init, so the block unions the already-staged paths with
remaining untracked paths, prints every candidate, rejects anything outside the named
patterns, stages only the paths named in `trackable-files.txt`, assigns the fictional local
Git identity, rechecks the project-local `deft` lookup, commits through the installed hook,
and reruns the no-remote guard.

**Why:** The exact list printed in this attempt is the staging input. Git identity is local
and fictional; no credential or remote is involved.

**Observe:** The commit subject is
`checkpoint: initialize fictional Directive consumer`, the branch is `training/module-02`,
tracked status is clean, and the remote list is empty.

### Step 4 — Diagnose and classify

**Action:** Run the lab's `module_02_diagnose` function. It captures doctor and consumer
toolchain exits without enabling interactive `errexit`, prints both, and rechecks the
remote boundary. Use `git ls-files`, `git status --short --ignored`, and the six explicit
verbose `git check-ignore` commands listed in the lab to build the table at
`$evidence_note`, outside the attempt repository.

**Why:** Doctor and toolchain output answer different questions. Git inspection supplies
tracking evidence; source ownership supplies the anatomy classification.

**Observe:** The verified attempt recorded `doctor_exit=0 toolchain_exit=0`.
This **known false negative** appeared in 0.119.2: doctor reported
`Missing directory: xbrief/` even though `xbrief/PROJECT-DEFINITION.xbrief.json`
was present. Preserve both observations and do not create a competing xBRIEF
tree. The consumer check reported all required tools available.

A correct anatomy table looks like this:

| Path or region | Git relation | Owner | Anatomy class |
| --- | --- | --- | --- |
| `package.json` exact pin | tracked | consumer project | reconstitution anchor / authoritative dependency choice |
| `.npmrc` public-registry settings | tracked | consumer project | normal-path dependency isolation |
| `AGENTS.md` project header | tracked | consumer project | authoritative project guidance |
| `AGENTS.md` marked Directive section | tracked | Directive installer | managed integration |
| `.deft/GENERATION.json` | tracked | Directive installer | managed generation metadata |
| xBRIEF project/work file, when present | tracked | project lifecycle workflow | authoritative durable state |
| `.deft/core/` | ignored | Directive package | reconstitutable deposit |
| `.deft/.cli/` | ignored | Directive package | reconstitutable CLI adapter |
| `.deft-cache/` | ignored | local runtime | runtime cache state |
| `.npm-cache/` | ignored | npm child process | attempt-local dependency cache |
| `.deft/ritual-state.json` or `xbrief/.triage-cache/` | ignored | local runtime | session/ritual or triage runtime state |
| conceptual shared `USER.md` row | external and never copied | individual/organization | personal authority source |

The `USER.md` row is based on the project rule and its external authority class. Resolution
is taught in Module 3; do not resolve or copy its location or contents in this lab.

### Step 5 — Complete the recovery decision drill

The live verified route succeeded, so the exercise uses the supplied fictional `E401` record
instead of depending on an accidental environment failure. A correct five-field decision is:

| Field | Worked answer |
| --- | --- |
| Preserve | Keep the exact attempt path, command, exit 1, `E401`, and fictional registry host; do not capture a token, npm configuration contents, or an environment dump. |
| Diagnose | Classify the observation as registry authentication or configuration. It does not by itself prove a Directive lifecycle defect. |
| Support boundary | Use only the organization's approved npm setup; do not invent credentials or silently edit global configuration. |
| Next mutation | Leave the failed attempt intact, create a new unique attempt under the guarded temporary parent, then re-run the root and no-remote guards before installation. |
| Retry gate | Require the explicit project-local binary, Directive core 0.119.2, install exit 0, and an empty `git remote` result. |

This decision is observable, recoverable, and safe to compare without manufacturing an
authentication failure. If a real command fails, use the same fields with the actual narrow
evidence and the lab's fresh-directory reset.

## Acceptance evidence

| Validation or inspection | Required result | Relevant observed evidence | Outcome |
| --- | --- | --- | --- |
| Three-row chooser and boundary | `init`, `update`, and `doctor` tied to state; consumer and maintainer surfaces tied to their repositories | Table under Reasoning plus repository-boundary answer | O2.1 |
| Explicit local `--version` | Exit 0; exact core 0.119.2 | Exact version line | O2.2 |
| Project-local hook runtime | `deft` resolves inside the attempt; hooks path is `.githooks` | Exact resolved path and Git config | O2.2 |
| Init plus no-remote guards | Exit 0; managed integration; no remote names | Brownfield classification, generation file, empty output | O2.2 |
| Git tracking/ignore inspection | Required paths correctly classified | Tracked list, ignore matches, anatomy table | O2.3 |
| Full doctor | Exit 0 with every warning retained | Two warnings and recommended recovery recorded | O2.4 |
| Consumer toolchain check | Exit 0 | Git 2.50.1, gh 2.88.1, Node 24.18.0, npm 11.16.0, all required tools available | O2.2, O2.4 |
| Provided recovery decision | Five required fields; no forced failure or credential handling | Worked Step 5 table | O2.4 |
| Archive inspection | Exact path exists; every attempt no-remote | Printed archive path and empty remote output | O2.4 |

Your tool versions may differ while satisfying the minimum. Your Directive core version may
not: it must be exactly 0.119.2 for this course baseline.

## Compare with your attempt

| Compare | Match means | Difference means | Next action |
| --- | --- | --- | --- |
| Root and remote | Same disposable boundary | You may have tested a different risk surface | Stop and use a fresh guarded attempt |
| Local version and hook runtime | Same released behavior | A global/floating package may be running | Prove the explicit local paths, PATH precedence, and pin |
| Init classification | Brownfield is expected after `git init` | Scaffold is possible only with a different starting state | Explain the starting-state difference |
| Doctor evidence | Exits and findings are both preserved | A warning may have been hidden or the environment differs | Re-run full doctor and record classification |
| Anatomy | Ownership and Git relation are separate | Tracking may have been mistaken for authority | Rebuild the table with two evidence axes |
| Recovery decision | All five fields follow from the provided record | A live failure may have been assumed or unsafe cleanup proposed | Rework only the decision drill from the provided facts |
| Cleanup | Exact parent was moved and remains inspectable | Evidence may have been deleted or a broad path targeted | Use the archive-only route |

For each difference, write: “My result differs because [observed fact]; I will [bounded next
action].” Do not copy an expected warning into your evidence if your run did not produce it.

## Valid alternatives

| Alternative | Why it can pass | Evidence required | When it fails |
| --- | --- | --- | --- |
| Organization-approved npm mirror | It may supply the same public package through approved infrastructure | Exact local CLI/core/content 0.119.2 and no credential in evidence | The mirror resolves a different version or requires undocumented secret handling |
| Node.js 20+ version other than the verified 24 line | It satisfies Directive's consumer minimum | Toolchain check exit 0 and all lab commands pass | The runtime is unsupported by the organization or changes observed behavior |
| A different recoverable temporary archive name | The path identity is not an assessed value | Canonical exact target, source moved, target exists, no remote | The target is broad, inside the lab parent, or overwrites existing data |
| Equivalent written anatomy format | The outcomes assess classification, not table styling | Every named path has Git relation, owner, and class | It collapses tracked into authoritative or copies `USER.md` |

Using a global CLI is not an equivalent alternative because it does not prove the project
pin. Running actual `update` is also outside this lab; update can refresh and stage managed
paths and has host-integration exclusions that a beginner dry-run does not fully bound.

## Expected failures and recovery

### npm authentication rejects the install

- **Symptom:** `npm install` returns `E401` or `E403`.
- **Cause:** npm selected stale credentials or an organization registry requiring approved
  authentication. It is not a Directive lifecycle failure.
- **Confirm:** retain the status and registry hostname only. Do not print configuration,
  tokens, or an environment dump.
- **Recover:** preserve the failed directory. Follow the organization's documented npm
  setup. If an approved public-registry route exists, use an empty temporary npm user config
  only for a new attempt; do not rewrite global configuration silently.
- **Retry:** a fresh attempt creates the explicit local binary and its version reports 0.119.2.

### A global executable masks the missing local install

- **Symptom:** `directive --version` or `npx --no-install directive --version` succeeds while
  `node_modules/.bin/directive` is absent.
- **Cause:** command lookup found another host installation.
- **Confirm:** test the explicit local path.
- **Recover:** reject the version evidence, preserve the attempt, and repair the npm install
  in a fresh disposable repository.
- **Retry:** the explicit local file exists and reports the exact core version.

### Doctor reports warnings

- **Symptom:** doctor exits 0 but prints one or more warnings.
- **Cause:** health severity and process exit are separate; the release may identify a
  recovery signpost or known anomaly.
- **Confirm:** record severity, message, and single recommended action.
- **Recover:** classify the recommendation but do not run migration or another untaught
  recovery in Module 2. Complete the provided-case decision drill for required recovery
  evidence; use the fresh-directory reset only if a live command fails.
- **Retry:** exit and finding state are represented truthfully; warning-free output is not
  fabricated.

### The default-branch gate refuses the checkpoint

- **Symptom:** the commit is rejected because the current branch is `main`.
- **Cause:** Directive's installed hook applies the default branch-protection policy.
- **Confirm:** `git branch --show-current` prints `main`.
- **Recover:** do not bypass the hook. In the unborn disposable repository, switch to
  `training/module-02`, regenerate and inspect the staged-plus-untracked allowlist, then retry.
- **Retry:** the commit succeeds and the current branch is `training/module-02`.

### When the baseline differs

1. Capture the explicit local `--version`, `directive --help`, `directive commands`, and the
   relevant verb-help output.
2. Compare them with the [course baseline](../references/SOURCE-BASELINE.md).
3. Use the exact 0.119.2 fixture or stop and report the mismatch.
4. Do not silently rewrite the lab around a newer release.

## Misconceptions exposed by this exercise

| Misconception | What the evidence shows | Source |
| --- | --- | --- |
| Init always creates the package pin | 0.119.2 did not; the exact fixture pin preceded init | Source notes and released runtime |
| Empty Git means scaffold | `.git` alone selected brownfield in 0.119.2 | Released classifier and init dispatch |
| Doctor is literally zero-write | It can write ignored throttle state while leaving tracked product state and remotes unchanged | Released doctor state implementation |
| Every verb accepts `--help` | `toolchain:check --help` prints usage and exits 2 | Recorded CLI probe |
| Tracked means authoritative | Managed adapters and generation metadata are tracked projections/integration | README and Concepts |
| Ignored means safe to delete broadly | Deposits and runtime state have specific regeneration and cleanup contracts | Core skill and 3Ci safety policy |

## Retry plan

1. Preserve the smallest useful failure evidence and exact attempt path.
2. Create a new random attempt under the guarded temporary parent.
3. Retry only the unmet outcome first: command choice, local version/init, anatomy, or
   diagnostic interpretation.
4. Run that outcome's stated command or inspection.
5. When it passes, run the complete acceptance set and archive the exact parent.

Reading this solution is not completion; a new passing run plus your own recovery decision is.

## Reset and cleanup

Use the lab's fresh-directory reset and archive-only cleanup exactly. The worked solution
creates no listener, container, service, remote, or production state.

- Additional state: one or more exact attempt directories plus `evidence.md` and small
  command-output files beside them under the named temporary parent.
- Cleanup action: move that parent to the separately created exact temporary archive target.
- Cleanup evidence: original parent absent because it moved; archive target and archived
  `evidence.md` present; every attempt's `git remote` output empty; and the caller's original
  `PATH` and npm user-config selection restored (plus PowerShell error preferences on Windows).

Do not replace this route with `git reset --hard`, broad `git clean`, recursive workspace
deletion, or a home-directory target.

## Sources

| Statement | Pinned source or policy | Verified date |
| --- | --- | --- |
| Consumer install and anatomy | [README — Getting Started and tracked/ignored](https://github.com/deftai/directive/blob/9038503ffac65e6d48e5ba34758c4e8e7077aba3/README.md); [Concepts — Installer Layout](https://github.com/deftai/directive/blob/9038503ffac65e6d48e5ba34758c4e8e7077aba3/docs/CONCEPTS.md) | 2026-09-07 |
| Consumer versus maintainer boundary | [Setup skill contract](https://github.com/deftai/directive/blob/9038503ffac65e6d48e5ba34758c4e8e7077aba3/content/skills/deft-directive-setup/SKILL.md) | 2026-09-07 |
| Help, init, doctor, toolchain, package-pin, and brownfield observations | [Course source notes](../references/SOURCE-NOTES.md) tied to 0.119.2 | 2026-09-07 |
| Disposable/no-remote/archive-only practice | [Lab safety model](../labs/README.md) and project definition | 2026-09-07 |

The solution paraphrases the official sources. Exact identifiers and short diagnostic text
are retained for reproducibility.

## Continue

- Return to [Lab 2](../labs/02-disposable-initialization.md).
- Record the done statement only after all four outcomes, the recovery decision, and cleanup pass.
- Continue to [Module 3 — Authority and Context](../curriculum/modules/03-authority-and-context.md).
