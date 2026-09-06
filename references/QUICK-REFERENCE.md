# Directive learner quick reference

Use this as a memory aid, not as an exhaustive command reference. It describes
`@deftai/directive` 0.111.0 and xBRIEF 0.8, verified on 2026-09-05. Check
[the source baseline](SOURCE-BASELINE.md) before using it with another version.

## Mental model

Directive is a repository practice layer built around three pillars:

| Pillar | Question it answers | Typical evidence |
| --- | --- | --- |
| Shared standards | How must this work be performed? | Loaded project and task rules |
| Durable state | What project and work facts survive this chat? | Current xBRIEF sources |
| Deterministic gates | What can be checked rather than assumed? | Reproducible pass/fail output |

A coding host supplies the agent runtime. A skill supplies task-specific working
instructions. An application orchestrator coordinates product agents. None of
those is interchangeable with Directive.

## Before trusting a command

For the pinned release, inspect all three available surfaces:

```text
directive --help
directive commands
directive <verb> --help
```

Replace `<verb>` with the exact command, for example `doctor`. Record a failed
per-verb help check instead of assuming it is available. In 0.111.0,
`session:start --help` and `check --help` reject `--help`, and the lifecycle help
for `scope:promote` and `scope:activate` contains older vBRIEF-era wording. Use
current deterministic behavior and the same-release sources, and log the
disagreement. The `xbrief:preflight` help also retains `--vbrief-path` as a
legacy option name; learner examples should use the documented positional
active `xbrief/` path. See the baseline for tested exit results.

## Consumer command chooser

These command names and their help surfaces were checked against 0.111.0. Read
the exact help before using options or operands.

| Need | Begin with | Boundary |
| --- | --- | --- |
| Add Directive to a repository that is not initialized | `directive init` | Run only at the intended consumer repository root |
| Reconcile an initialized consumer project with its pin | `directive update` | Do not re-scaffold the project by hand |
| Diagnose setup or health | `directive doctor` | Follow its single recommended recovery path |
| Prove an active xBRIEF is implementation-ready | `directive xbrief:preflight` | Requires active/running scope and live implementation intent |
| Move approved work toward active state | `directive scope:promote`, then `directive scope:activate` | Use lifecycle commands, not manual file moves |

Framework-maintainer build, release, migration-internals, and package commands
are outside the core consumer course.

## Authority check

When instructions appear to conflict:

1. Stop before mutation.
2. Resolve and read USER.md in place.
3. Read the repository's AGENTS.md and framework entry guidance.
4. Read PROJECT-DEFINITION and the applicable active scope.
5. Load only the task-specific skill or reference needed now.
6. Apply the documented precedence; ask the operator only when a material choice
   remains unresolved.

Never copy USER.md into a repository. Never use chat history as a replacement
for durable project or scope state.

## Source or projection?

| Information | Authoritative source here | Examples of projections |
| --- | --- | --- |
| Project identity and policy | `xbrief/PROJECT-DEFINITION.xbrief.json` | Rendered project-definition Markdown |
| Work lifecycle and acceptance | Lifecycle files under `xbrief/` | Summaries and status views |
| Training lessons | Authored repository Markdown | Future wiki, Confluence, or SharePoint pages |
| Official Directive behavior | Pinned release, tested CLI, and official same-release sources | This course's paraphrases |
| Code structure | `plan.architecture.codeStructure` when defined | Generated codebase map |

If a projection drifts, edit its authoritative source, regenerate it with the
verified release command, and check the result. Do not hand-edit a generated
file to hide drift.

## Lifecycle and authority

```text
proposed -> pending -> active/running -> completed
    |           |             |
    +-----------+-------------+-> cancelled (when the lifecycle permits)
```

Folder position is not enough. Use the current lifecycle command, validate its
result, and require explicit implementation intent plus applicable session,
story-ready, and xBRIEF preflight gates before changing product content.
A completed scope records lifecycle closeout; it does not by itself prove
delivery or authorize the next change.

## Evidence ladder

| Claim | Minimum kind of evidence |
| --- | --- |
| Implemented | Scoped files plus current local acceptance output |
| PR-open | Pull-request URL and head revision |
| Merge-ready | Current required checks and classified review findings |
| Delivered | Change on the intended delivery branch plus lifecycle closeout |
| Deployed | Environment-specific deployment evidence |
| UAT-verified | Recorded authorized user-acceptance result |

State the narrowest claim the evidence supports. Do not use “done” to collapse
these distinct states.

## 3Ci safety overlay

The following are project policy, not universal Directive defaults:

- Keep this repository private and internal to 3Ci.
- Use fictional projects and mock data only.
- Run exercises only in disposable local or designated training repositories.
- Never use this working tree, a business repository, credentials, production
  logs, confidential issues, live deployment, or destructive remote actions for
  a lab.
- Do not push, open a pull request, merge, publish, release, or deploy without
  explicit authorization for that action.
- Treat repository Markdown as authored course source; future internal pages are
  governed projections.

## When stuck

Starting-state check → expected failure → recovery → hints in order → explained
solution → sanitized curriculum-defect report. A hidden instructor step is never
part of the path.

- Previous: [Glossary](GLOSSARY.md)
- Next: [Module 1](../curriculum/modules/01-what-directive-is.md)
