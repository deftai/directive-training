# Module 2 — Installation and Project Anatomy

Choose the correct consumer command, initialize Directive in a disposable repository, and
explain which resulting files are authoritative, managed, ignored, or reconstitutable.

## Module record

| Field | Value |
| --- | --- |
| Stable ID | `module-02-installation-and-anatomy` |
| Status | `learner-ready draft` |
| Last content update | 2026-09-07 |
| Last verified | 2026-09-07 |
| Directive baseline | `@deftai/directive@0.119.5`, engine `@deftai/directive-core@0.119.5`; see the [source baseline](../../references/SOURCE-BASELINE.md) |
| Platform status | 0.119.5 path verified on macOS/zsh; Linux/bash and Windows/PowerShell are candidates pending native evidence |
| Estimated duration | 60 minutes |
| Prerequisites | Complete [Module 1](01-what-directive-is.md); know basic Git and terminal navigation; have Node.js 20 or newer, Git, GitHub CLI, and npm |

Suggested pacing: 5 minutes for the starting check, 20 minutes for the lesson, 25 minutes
for the disposable lab, and 10 minutes for evidence review and self-assessment.

## Learning outcomes

By the end of this module, you can:

- **O2.1 — Choose the command and boundary.** Select `directive init`, `directive update`,
  or `directive doctor` from observed repository state, explain why the other choices are
  not the first action, and distinguish consumer command surfaces from framework-maintainer
  surfaces.
- **O2.2 — Initialize a consumer safely.** Install the exact course pin and initialize it
  through the project-local CLI in a unique disposable, no-remote Git repository.
- **O2.3 — Classify the anatomy.** Distinguish authoritative project sources, tracked
  managed integration, ignored runtime state, and reconstitutable deposits.
- **O2.4 — Diagnose and recover.** Treat `doctor` and the consumer toolchain check as
  evidence, trace a provided or observed failure through one named recovery, and preserve
  the failed attempt instead of applying broad cleanup.

## Starting-state check

Before opening a terminal for the lab, answer these questions in a scratch note:

1. Does the repository you intend to use contain any Directive footprint, such as
   `AGENTS.md`, `Taskfile.yml`, `.deft/GENERATION.json`, or `xbrief/`?
2. What exact path proves that the repository is disposable?
3. What should `git remote` print before a lab mutation?
4. Which file will carry the exact `@deftai/directive` pin?

Then run only these read-only environment checks from a neutral terminal directory:

```text
node --version
npm --version
git --version
gh --version
```

**Pass:** Node reports version 20 or newer, the other commands report versions, and your
answers name an operating-system temporary path, no remote output, and `package.json`.

**Recovery:** If a tool is absent, use your organization's approved installation path. If
the intended repository is not clearly disposable or `git remote` would name a remote, do
not adapt it for this exercise. Use the fresh-directory setup in the lab.

> Never run this module's initialization, reset, or cleanup commands in the
> training repository, a client repository, or another business repository. The linked lab
> creates a fictional repository under the operating system's temporary directory.

## Why this matters

Initialization changes repository integration: it adds shared guidance, xBRIEF schemas,
hooks, host adapters, and metadata, and it reconstitutes an ignored framework deposit. A
command that is safe in a disposable lab can be disruptive in the wrong repository.

The goal is therefore not to memorize one installation command. It is to make a bounded
decision from visible state, run the exact released consumer surface, and understand the
files well enough to preserve their ownership boundaries. That model makes recovery more
reliable than deleting whatever looks unfamiliar.

## Terminology

| Term | Working definition |
| --- | --- |
| **Consumer project** | An application or content repository that installs and uses Directive but is not the `deftai/directive` source repository. |
| **Directive footprint** | Evidence that Directive has already integrated a repository, such as `.deft/GENERATION.json`, the managed `AGENTS.md` section, Taskfile integration, or xBRIEF schemas. |
| **Project pin** | The exact `@deftai/directive` version recorded in the consumer's `package.json`; it anchors reconstitution. |
| **Deposit** | The versioned framework content materialized under `.deft/core/`. It is ignored and can be recreated from the pin. |
| **Managed integration** | Tracked files or sections that Directive owns or refreshes, such as its `AGENTS.md` section, Taskfile include, adapters, schemas, and generation metadata. |
| **Runtime state** | Local cache, session, ritual, occupancy, or diagnostic state that should not become durable project source. |
| **Authoritative source** | The file that humans and agents edit to change a durable project fact, requirement, or authored product. |
| **Reconstitutable** | Safe to regenerate from a named tracked anchor; not synonymous with unimportant or safe to hand-edit. |
| **Brownfield init** | The 0.119.5 route used when the target already contains Git or application signals. An otherwise empty `git init` repository takes this route. |

## Mental model

Use this loop:

> **Observe → choose → pin → isolate → initialize → diagnose → classify → preserve evidence.**

### Command chooser

| Observed state | First command | Why |
| --- | --- | --- |
| No Directive footprint in the intended consumer repository | `directive init` | Materialize the consumer integration. An existing application is still a valid init target. |
| Existing, recognizable Directive footprint that needs reconciliation with its pin | `directive update` | Refresh the managed integration; do not manually re-scaffold it. `init` detects an existing footprint and delegates, but `update` states the intent clearly. |
| State is unknown, incomplete, or unhealthy | `directive doctor` | Classify the condition and follow its one primary next action before choosing a mutating recovery. |

`doctor` does not repair tracked product state by default and does
not change a remote, but 0.119.5 can write ignored diagnostic throttle metadata. Call it a
diagnostic, not a promise of zero filesystem writes.

In 0.119.5, `.git` alone makes an otherwise empty directory take
the brownfield route. That label is expected in this module's lab because the safety check
creates the Git repository first.

### Anatomy is about ownership, not just Git status

| Class | Typical examples | How to treat it |
| --- | --- | --- |
| Authoritative project/work source | `xbrief/PROJECT-DEFINITION.xbrief.json`, lifecycle xBRIEFs, authored application or curriculum files | Edit through the owning workflow; these carry durable intent or product content. |
| Tracked managed integration | Directive-managed part of `AGENTS.md`, `Taskfile.yml`, host adapters, hooks, xBRIEF schemas, `.deft/GENERATION.json` | Track changes, but refresh through Directive rather than hand-maintaining generated sections. |
| Ignored local/runtime state | `.deft-cache/`, session and ritual state, `xbrief/.triage-cache/` | Keep local and untracked; inspect only when its role is relevant. |
| Ignored reconstitutable deposit | `.deft/core/`, `.deft/.cli/` | Recreate from the project pin with the supported setup/update path. Do not modify as product source. |
| External personal authority | The resolved shared `USER.md` | Read from its resolved location. Never copy it into or distribute it with a consumer repository. |
| Reconstitution anchor | Exact Directive pin in `package.json` | Track and review it; it identifies which released consumer deposit to recreate. |

A file can be tracked without being authoritative. `AGENTS.md` is also a mixed-ownership
file: its project header is consumer-authored, while its marked Directive section is managed.
Likewise, an ignored file can be operationally important without becoming durable project
truth.

## Guided explanation

### 1. Verify the command surface before using it

The release exposes a curated help page and a larger registry. The
course verified these exact probes:

```text
directive --help
directive commands
directive init --help
directive update --help
directive doctor --help
directive toolchain:check --help
```

The first five probes exit 0. The last command is a recorded 0.119.5 defect: it prints
usage but exits 2 with `toolchain-check: unrecognized argument: --help`. Confirm the verb in
`directive commands`, record the disagreement, and use the verified consumer form:

```text
directive toolchain:check --consumer --project-root .
```

Do not generalize the defect into permission to guess syntax. It is evidence that published
examples need release-specific verification.

> **Warning — command-specific help may have side effects.** In 0.119.5,
> `codebase:map --help` writes a MAP and `verify:codebase-map-fresh --help`
> runs the freshness check instead of showing ordinary usage. Probe an unknown
> verb only in a guarded disposable repository, and read its release-specific
> note before assuming `--help` is read-only.

### 2. Pin before initialization

The unpinned 0.119.5 disposable probe confirmed that init creates a private
`package.json` with the exact Directive pin. The lab still starts with a fictional private
manifest so its full CLI/core/content/types graph is locked before installation:

```json
"@deftai/directive": "0.119.5"
```

It installs that package and invokes the explicit project-local executable. This prevents a
missing local install from silently falling through to an unrelated global executable.

### 3. Keep consumer and maintainer commands on their own sides

An application or training repository is a Directive consumer.
Its supported entry surfaces are the installed `directive` CLI (also exposed as `deft`) and
its namespaced consumer tasks such as `task deft:doctor` or `task deft:check`.

The separate `deftai/directive` source repository has contributor instructions, an
unprefixed root Taskfile, package workspaces, and maintainer tasks. Those are for framework
development. Do not copy maintainer commands into a consumer lesson merely because both
repositories mention Directive.

### 4. Interpret health output rather than chasing a silent screen

`directive doctor --full --project-root .` can exit 0 and still print warnings. A warning is
classified evidence, not automatically a failed lab and not permission to run every possible
fix. Record:

1. the command and exit code;
2. each warning or error classification;
3. the single recommended next action;
4. whether the action is within the disposable boundary.

Treat this 0.119.5 result as a **known false negative**: in the verified macOS
run, doctor reported `Missing directory: xbrief/` even though
`xbrief/PROJECT-DEFINITION.xbrief.json` was present. Retain the warning and the
contradictory path evidence, but do not create a second xBRIEF tree or claim
the warning proves the directory is absent.

### 5. Recovery begins with a fresh, preserved attempt

When setup fails, leave that exact disposable directory intact long enough
to retain the command, exit code, and relevant output. Create a second unique temporary
directory and repeat the starting check. This avoids `git reset --hard`, broad `git clean`,
and uncertain recursive deletion.

The recorded first probe failed npm authentication because of stale host configuration. The
second probe used a fresh attempt and isolated public-registry configuration. In
organization-managed work, preserve approved registry settings and use the documented registry
support path; never paste credentials into course evidence.

## Walkthrough

### Goal

Choose the first command for four fictional Northstar Route Checker repositories without
changing any repository.

### Safe setup

Use a scratch note. These are fictional observations; do not reproduce them in a business
repository.

### Actions and observations

| Repository observation | First action | Reason |
| --- | --- | --- |
| A new Node repository has `package.json` but no Directive footprint. | Verify the pin and run `directive init`. | Existing application code makes it brownfield, but it is still an uninitialized consumer. |
| `.deft/GENERATION.json`, a managed `AGENTS.md` section, and `Taskfile.yml` exist; the team changed the exact pin. | Run `directive update`. | The project is initialized and needs managed reconciliation. |
| `AGENTS.md` exists but generation metadata is absent and the operator does not know whether setup finished. | Run `directive doctor`. | The state is ambiguous; diagnosis should name one recovery. |
| A developer cloned `deftai/directive` to change its packages. | Stop and use the contributor guidance in that source repository. | This is a maintainer checkout, not a consumer init target. |

Checkpoint: for every row, your reason should cite observed state, not the command you happen
to remember.

## Exercise

Complete [Lab 2 — Initialize a Disposable Directive Consumer](../../labs/02-disposable-initialization.md).
It uses the fictional Northstar Route Checker fixture and never adds a Git remote.

### Fictional scenario

Northstar needs a clean training repository in which a future team can build a route-checking
CLI. Your task is only to establish and inspect the Directive consumer practice layer. There
is no client, production service, deployment, or real backlog.

### Your task

1. Create and guard a unique temporary Git repository.
2. Install and prove the exact 0.119.5 project-local CLI.
3. Verify help, initialize, run doctor and the consumer toolchain check.
4. Classify the resulting files and record the evidence bundle.
5. Trace the lab's provided failure record through a deterministic recovery decision.
6. Archive the exact disposable attempt using the lab's recoverable cleanup.

### Constraints

- Work only in the disposable path created by the lab.
- Keep `git remote` empty.
- Stage only the inspected allowlist; never use `git add --all`.
- Do not push, publish, deploy, use credentials, or use real organizational or client data.
- Do not treat a doctor warning as either success or failure without its classification.

### Evidence to keep

Keep the recorded lab root, baseline, command/exit summary, pre-stage and staged path lists,
artifact-classification table, doctor findings, recovery decision, no-remote proof, and final
archive path. Do not keep environment dumps, token output, or unrelated files.

### Exercise acceptance

| Outcome | Observable condition | Inspection |
| --- | --- | --- |
| O2.1 | Your chooser note names `init`, `update`, and `doctor` for the correct observed states, and your boundary answer distinguishes a consumer surface from a maintainer-only surface. | Compare with the walkthrough and solution reasoning. |
| O2.2 | The explicit local binary reports core 0.119.5; init and toolchain check exit 0 in the guarded no-remote repository. | Use the lab's literal acceptance commands. |
| O2.3 | Your table includes at least two authoritative/anchor, two tracked-managed, two ignored-runtime, and two ignored-reconstitutable examples; it also identifies external `USER.md` and mixed ownership in `AGENTS.md`. | Compare each example with Git inspection and the source baseline. |
| O2.4 | Doctor output is recorded by severity and recommendation; the provided failure is traced through evidence preservation, a fresh-directory recovery, and an observable retry gate. | Inspect the evidence bundle and archive state. |

## Completion evidence

| Evidence | Required result | Outcomes |
| --- | --- | --- |
| Command chooser and repository boundary | Every choice follows observed footprint/health state, and the consumer/maintainer distinction is explicit. | O2.1 |
| Local version and init record | Explicit local CLI reports 0.119.5; repository remains no-remote. | O2.2 |
| Anatomy table | Durable source, managed tracked, ignored runtime, and reconstitutable examples are correctly separated. | O2.3 |
| Diagnostic/recovery record | Exit codes, findings, the completed recovery decision drill, and final archive path are present. | O2.4 |

You are ready to continue when all four rows are demonstrated. Current local evidence verifies
the 0.119.5 pinned npm path on macOS/zsh. Linux/bash and Windows/PowerShell remain candidates
pending a pin-matched native replay. This evidence does not prove pnpm, other operating-system
images, or coding-host integration.

## Progressive hints

Open one hint at a time after a good-faith attempt.

<details>
<summary>Hint 1 — choose from state</summary>

No footprint points to init; a recognizable existing footprint points to update; uncertainty
or damage points to doctor. “Brownfield” describes the target, not a different top-level
command.

</details>

<details>
<summary>Hint 2 — inspect ownership separately from tracking</summary>

Make two columns first: “who owns this?” and “does Git track this?” Then derive the anatomy
class. `AGENTS.md` needs two rows because its project header and marked managed section have
different owners.

</details>

<details>
<summary>Hint 3 — prove the executable and boundary</summary>

Check for `node_modules/.bin/directive` (or `directive.cmd`) before invocation, run its
`--version`, and re-run `git remote` after init. If any path or remote differs, preserve the
attempt and use the fresh-directory reset.

</details>

## Expected failures and recovery

| Symptom | Likely mechanism | Bounded recovery |
| --- | --- | --- |
| `npm install` returns `E401` or another authentication error. | npm is using a stale or required registry configuration. | Record only the error code and registry host, never a token. Preserve the attempt. Use the organization's approved npm setup, then create a fresh attempt. |
| `npx --no-install directive` reports a version even though the local package is absent. | The launcher fell through to another executable on the host. | Do not use that result. Prove and invoke the explicit project-local binary. |
| Init says `brownfield` in an otherwise empty repository. | `.git` is a brownfield signal in 0.119.5. | Continue; the lab expects this classification. |
| Doctor exits 0 with warnings. | Health classification can be non-fatal. | Record the warning and single recommended action; do not weaken or skip the check. |
| `directive toolchain:check --help` exits 2. | The released verb rejects the uniform help flag. | Record the known disagreement, confirm registration with `directive commands`, and use the tested consumer invocation. |
| Unexpected files or a remote appear. | The starting boundary or environment differs from the fixture. | Stop mutations, preserve evidence, and create a new unique temporary attempt. Do not clean the surprising repository. |
| Init prints generic instructions to push or open a PR. | The installer is describing a normal delivery path, not this lab's authorization. | Do not follow them. The course's no-remote lab boundary remains controlling. |

## Common misconceptions

- **“`init` is only for an empty greenfield project.”** It is also the consumer entry path
  for an existing application that has no Directive footprint.
- **“Running `init` twice is the normal update path.”** The CLI can delegate, but `update`
  expresses reconciliation of an initialized consumer directly.
- **“Doctor must print no warnings to pass.”** Exit status and classified findings are
  separate evidence. Warnings can describe a valid next action or a released anomaly.
- **“Tracked files are all authoritative.”** Managed projections and integrations can be
  tracked; their source and ownership determine how they change.
- **“Ignored means disposable by any command.”** Ignored runtime and deposit files still
  have specific owners and supported regeneration paths.
- **“The consumer should run the framework source repository's tasks.”** Consumer and
  maintainer surfaces belong to different repository boundaries.

## Self-assessment

Answer without opening the solution, then cite the section or evidence that supports each
answer.

1. **O2.1:** A repository has a partial managed `AGENTS.md` section and no one knows whether
   initialization finished. Which command comes first, and why?
2. **O2.2:** Why does the lab prove `node_modules/.bin/directive` before init rather than rely
   on a command found elsewhere on `PATH`?
3. **O2.3:** Classify `xbrief/PROJECT-DEFINITION.xbrief.json`, `.deft/GENERATION.json`,
   `.deft/core/`, and the resolved external `USER.md`.
4. **O2.4:** Doctor exits 0 with one warning. What evidence must you retain before deciding
   whether to act?
5. **O2.1:** Name one consumer command surface and one maintainer-only surface. Explain the
   repository boundary between them.

**Demonstrated:** all five questions correctly demonstrate the four outcomes, the boundary
answer is explicit, and the lab acceptance evidence passes. **Retry needed:** any answer
depends only on memory, uses a global executable as proof of the pin, or proposes broad
cleanup.

## Explained solution

After a suggested 15-minute first attempt, use the
[explained Lab 2 solution](../../solutions/lab-02-disposable-initialization.md). It includes
the exact command route, expected evidence, the provided authentication-failure decision
drill, and a safe retry route. No instructor unlock is required.

## Navigation

- Previous: [Module 1 — What Directive Is](01-what-directive-is.md)
- Course map: [Directive training](../README.md)
- Lab: [Initialize a Disposable Directive Consumer](../../labs/02-disposable-initialization.md)
- Next: [Module 3 — Authority and Context](03-authority-and-context.md)

## Official sources

| Claim | Pinned 0.119.5 source or observed surface | Use in this module |
| --- | --- | --- |
| Consumer install and layout | [README — Getting Started](https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/README.md#getting-started); [Concepts — Installer Layout](https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/docs/CONCEPTS.md#installer-layout) | Command chooser and deposit model |
| Consumer prerequisites | [Getting started — Prerequisites](https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/docs/getting-started.md#prerequisites) | Tool starting check |
| Consumer versus contributor route | [Setup skill contract](https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/content/skills/deft-directive-setup/SKILL.md) | Repository boundary |
| Tracked and ignored surfaces | [README — Getting Started](https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/README.md#getting-started); [core skill — Project Root vs Framework Internals](https://github.com/deftai/directive/blob/75e7d33f114b0e2e67741257813c095e74d9668f/SKILL.md) | Artifact classification |
| Literal CLI behavior | `directive --help`, `directive commands`, and each verb help/runtime probe recorded in [source notes](../../references/SOURCE-NOTES.md#cli-help-probes) | Version-specific syntax and disagreements |

All explanations are paraphrased or adapted. Exact command names, paths, versions, and short
diagnostic fragments are retained for reproducibility. See the complete
[source baseline](../../references/SOURCE-BASELINE.md).
