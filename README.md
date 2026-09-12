<!-- deft:cold-start-bootstrap v1 (#2273) -->
> ## ⚡ Cold-start bootstrap (read this first)
>
> **New clone, or `deft` / `directive` won't run?** Directive runs from an npm-installed engine — there is no committed shell shim, so *you* (agent or human) are the interpreter. Work the **global-first ladder** below top-down and stop at the first rung that yields a working `directive`. The version to install is always the one pinned in the project's committed `package.json`.
>
> 1. **Already installed?** Run `directive doctor` (or the `deft` alias). If it runs, you're bootstrapped — skip the rest and follow its `Next command:`.
> 2. **Local engine.** If `.deft/.cli/<platform>` holds an intact engine at or above the `package.json` pin, use it.
> 3. **Global install (canonical).** `npm i -g @deftai/directive` (Node ≥ 20), then re-run `directive doctor`. Using pnpm? `pnpm add -g @deftai/directive` (same package, same registry) — make sure `PNPM_HOME` is on your `PATH` (`pnpm setup` if not).
> 4. **Sandbox install.** If the global npm prefix isn't writable (sandboxed environment), install into the project instead: `npm install --prefix .deft/.cli/<platform> @deftai/directive@<pinned>`. (This internal `.deft/.cli/` layout is always npm-shaped, regardless of your project's package manager.)
> 5. **Corporate mirror symptoms.** If install returns `E404` / `ETARGET`, or `@latest` silently stays behind the public release, follow the [corporate or mirrored npm registry recovery](https://github.com/deftai/directive/blob/master/content/UPGRADING.md#corporate-or-mirrored-npm-registry).
> 6. **Offline.** If the npm registry is unreachable, install from a staged tarball / vendored payload. If none exists, stage one — recovery cannot proceed without a payload.
>
> This block is always committed (never gitignored) and does **not** depend on the `.deft/core/` payload being present, so it is reachable on a fresh clone even when the vendored framework is missing. Once `directive` runs, continue with the guidance below and in `AGENTS.md`.
<!-- /deft:cold-start-bootstrap v1 -->

# directive-training

Private, self-directed Directive training for 3Ci engineers.

This repository is the authored source for the course. It is also a Directive
consumer project, but it is not the Directive framework source repository.
Future wiki, Confluence, or SharePoint pages will be governed projections of
this Markdown; they will not replace it as the source of truth.

## Start here

1. Confirm the prerequisites in the [course map](curriculum/README.md).
2. Note the current teaching baseline: `@deftai/directive` 0.112.0 with xBRIEF
   schema 0.8.
3. Complete [Module 1: What Directive Is](curriculum/modules/01-what-directive-is.md),
   [Module 2: Installation and Project Anatomy](curriculum/modules/02-installation-and-anatomy.md),
   [Module 3: Authority and Context](curriculum/modules/03-authority-and-context.md),
   [Module 4: xBRIEF as Durable State](curriculum/modules/04-xbrief-as-durable-state.md),
   [Module 5: Sources versus Projections](curriculum/modules/05-sources-versus-projections.md),
   [Module 6: Creating Well-Shaped Work](curriculum/modules/06-creating-well-shaped-work.md),
   [Module 7: Scope Lifecycle and Implementation Authorization](curriculum/modules/07-scope-lifecycle.md),
   [Module 8: Session Start and Authorized Work Selection](curriculum/modules/08-session-and-work-selection.md),
   [Module 9: The Implementation Golden Path](curriculum/modules/09-implementation-golden-path.md),
   [Module 10: Testing, Gates, and Evidence](curriculum/modules/10-testing-gates-and-evidence.md),
   and [Module 11: PR, Review, and Actual Completion](curriculum/modules/11-review-and-completion.md)
   in order.
4. Complete the [two-hour end-to-end capstone](curriculum/capstone-end-to-end.md).
5. Run command work only in the specified disposable no-remote lab:
   [Lab 2](labs/02-disposable-initialization.md) or
   [Lab 5](labs/05-projection-drift-recovery.md), or
   [Lab 7](labs/07-scope-lifecycle.md), or
   [Lab 9](labs/09-implementation-golden-path.md),
   [Lab 10](labs/10-testing-gates-and-evidence.md), or the
   [capstone lab](labs/capstone-end-to-end.md).
6. Use the [glossary](references/GLOSSARY.md) and
   [quick reference](references/QUICK-REFERENCE.md) when a term or boundary is
   unclear.
7. Use the [assessment policy](assessments/README.md) to evaluate practical
   evidence and the [solution policy](solutions/README.md) to compare and retry
   after a suggested first attempt.

The detailed [source baseline](references/SOURCE-BASELINE.md) is optional audit
evidence for maintainers and curious learners. It includes legacy and advanced
drift notes that are intentionally outside the beginner sequence.

Modules 1–11 and the capstone are implemented and learner-ready. The curriculum
remains an internal alpha until representative learner pilots complete; that
release-maturity label does not mean the authored modules are partial. Module 2's 0.112.0 pinned npm
path is verified on macOS 15/zsh, Linux/bash on Ubuntu 24.04, and
Windows/PowerShell 7.4+ on Windows Server 2022 by local and native-matrix evidence.
Modules 4, 6, 8, and 11 are command-free. Module 5's projection lab, Module 7's lifecycle lab,
Module 9's implementation lab, and Module 10's testing-and-gates lab are verified only on
macOS/zsh; Linux and native Windows have not been verified for those labs.
Module 11 uses a fixed fictional review packet and needs no lab fixture. The
guarded capstone fixture is verified on macOS, Ubuntu, and Windows runners; an
independent learner walkthrough on each environment remains a separate pilot claim.

## Safety boundary

**[3Ci policy]** Do not run learner exercises in this repository or in a 3Ci
business or client repository. When a module asks you to change files,
create the disposable repository described in [the lab model](labs/README.md).
Use only its fictional project and mock data. Never add credentials, client
information, production logs, or confidential issue content.

**[3Ci policy]** Reading the course does not authorize a push, pull request,
merge, deployment, release, or publication. Follow the explicit authorization
and policy for the repository where work is performed.

## Resume or recover

Return to the course map, find the last checkpoint for which you retained the
listed evidence, and continue with the next checkpoint. Do not commit learner
notes, caches, session state, or lab state to this training repository.

If you get stuck, work through the module's recovery section, then its hints in
order, and finally its explained solution. If the written paths disagree or do
not recover the exercise, record the page, command, sanitized output, operating
system, shell, and Directive version in this private repository's issue tracker.
That is a curriculum defect; completion must not depend on undocumented help.

## Maintainers

Project identity and work lifecycle are authoritative in `xbrief/`. Curriculum
claims are version-bound and maintained under
[the curriculum maintenance contract](maintainers/CURRICULUM-MAINTENANCE.md).
Do not edit generated publishing copies as though they were authored sources.
