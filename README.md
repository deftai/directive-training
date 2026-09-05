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
