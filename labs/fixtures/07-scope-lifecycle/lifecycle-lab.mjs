import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { devNull, tmpdir } from "node:os";
import { basename, delimiter, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { assertNoGitRedirection, assertPlainTree, git, safePath, sameFileSystemEntry } from "./safety.mjs";

const fixture = dirname(fileURLToPath(import.meta.url));
const read = (path) => readFileSync(path, "utf8");
const exactVersion = "0.119.11";
const deliveryFile = "2026-01-15-fictional-delivery.xbrief.json";
const cancellationFile = "2026-01-15-fictional-cancel.xbrief.json";
const lifecycleFolders = ["proposed", "pending", "active", "completed", "cancelled"];
const archiveUsage = "Archive requires one explicit absolute canonical lab root. Run the original course helper from outside the attempt parent.";
const reclaimConfirmationRefusal = "Stop: reclaim apply requires explicit confirmation. Run reclaim to preview exact archive paths, then pass --confirm followed by only those paths.";
const reclaimTargetRefusal = "Stop: reclaim accepts only exact absolute canonical Module 7 archive destinations printed by the current preview.";
const archiveDirectoryName = "3ci-directive-lab-archive";
const archivedParentPattern = /^3ci-directive-lab07-[A-Za-z0-9]{6}$/;
const fixtureFiles = ["package.json", "lifecycle-lab.mjs", "safety.mjs"];
const gitignore = [
  "/node_modules/", "/.npm-cache/", "/.lab-tools/", "/.deft/", "/.deft-cache/",
  "/.agents/", "/.claude/", "/.codex/", "/.cursor/", "/.grok/", "/.github/",
  "/.githooks/", "/AGENTS.md", "/greptile.json", "/.prettierignore",
  "/xbrief/.deft-version", "/xbrief/.triage-cache/", "/xbrief/schemas/",
].join("\n") + "\n";

function digest(text) {
  return createHash("sha256").update(text.replace(/\r\n/g, "\n")).digest("hex");
}

function story(id, title, filename) {
  const activePath = `xbrief/active/${filename}`;
  return {
    xBRIEFInfo: { version: "0.8", description: "Fictional Module 7 lifecycle lab scope" },
    plan: {
      id,
      title,
      status: "proposed",
      narratives: {
        Description: "Observe one fictional local greeting scope without changing application code or contacting a remote.",
        UserStory: "As a learner, I want observable lifecycle state so I can distinguish approved scope from implementation authorization.",
      },
      items: [
        {
          id: "clause.1",
          title: "Observe the guarded lifecycle artifact",
          status: "pending",
          effort: "S",
          narrative: {
            Acceptance: `${activePath} exists before the fictional scope is completed.`,
          },
        },
      ],
      acceptance: {
        commands: [],
        none_stated: true,
        source_rung: "derived",
        confessions: [
          title,
          "Observe one fictional local greeting scope without changing application code or contacting a remote.",
        ],
      },
      metadata: { kind: "process", swarm: { file_scope: [activePath] } },
    },
  };
}

function writeJson(path, value, options = {}) {
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", options);
}

function readJson(path) {
  return JSON.parse(read(path));
}

function verifyManifest(root) {
  const manifest = readJson(safePath(root, "package.json"));
  assert.equal(manifest.private, true, "fixture must remain private");
  assert.equal(manifest.devDependencies?.["@deftai/directive"], exactVersion, "exact 0.119.11 pin required");
  for (const name of ["directive-core", "directive-content", "directive-types"]) {
    assert.equal(manifest.overrides?.["@deftai/" + name], exactVersion, "exact 0.119.11 overrides required");
  }
}

function locateStory(root, filename) {
  const matches = lifecycleFolders.flatMap((folder) => {
    const path = join(root, "xbrief", folder, filename);
    return existsSync(path) ? [{ folder, path }] : [];
  });
  assert.equal(matches.length, 1, `Stop: ${filename} must appear in exactly one lifecycle folder.`);
  const current = matches[0];
  const status = readJson(current.path).plan?.status;
  const expected = { proposed: "proposed", pending: "pending", active: "running", completed: "completed", cancelled: "cancelled" }[current.folder];
  assert.equal(status, expected, `Stop: ${filename} folder/status mismatch.`);
  return { folder: current.folder, status, path: current.path };
}

function commandResult(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", timeout: options.timeout ?? 60_000, ...options });
  if (result.error) throw result.error;
  assert.equal(result.signal, null, `${command} terminated by signal ${result.signal}`);
  return {
    command: [command, ...args].map((part) => part.replace(options.cwd ?? "", ".")).join(" "),
    exitCode: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

function requireSuccess(name, result) {
  assert.equal(result.exitCode, 0, `${name} failed (${result.exitCode}): ${result.stderr}${result.stdout}`);
  return result;
}

function findExecutable(nameOrNames) {
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
  const suffixes = process.platform === "win32" ? (process.env.PATHEXT ?? ".EXE;.CMD;.BAT").split(";") : [""];
  for (const name of names) {
    for (const directory of (process.env.PATH ?? "").split(delimiter).filter(Boolean)) {
      for (const suffix of suffixes) {
        for (const candidate of [join(directory, name + suffix.toLowerCase()), join(directory, name + suffix.toUpperCase())]) {
          if (existsSync(candidate)) return realpathSync(candidate);
        }
      }
    }
  }
  throw new Error(`Required executable not found: ${names.join(" or ")}`);
}

function findPythonExecutable() {
  return findExecutable(process.platform === "win32" ? ["python", "python3", "py"] : ["python3", "python"]);
}

/** Accept only platforms with a documented learner command path. */
export function assertLearnerReadyPlatform(platform = process.platform) {
  assert.ok(["darwin", "linux", "win32"].includes(platform), `Unsupported learner platform: ${platform}`);
}

function createIsolatedTools(root) {
  const directory = safePath(root, ".lab-tools");
  mkdirSync(directory, { recursive: true });
  const tools = new Map([
    ["node", realpathSync(process.execPath)],
    ["task", findExecutable("task")],
    ["npm", findExecutable("npm")],
    ["git", findExecutable("git")],
    ["python", findPythonExecutable()],
    ["uv", findExecutable("uv")],
  ]);
  try {
    tools.set("gh", findExecutable("gh"));
  } catch {
    // GitHub access is neither required nor used by this no-remote lab.
  }
  for (const [name, target] of tools) {
    const link = join(directory, process.platform === "win32" ? name + ".cmd" : name);
    if (!existsSync(link)) {
      if (process.platform === "win32") {
        assert.ok(!/[\r\n"%]/.test(target), `unsupported character in local ${name} launcher path`);
        writeFileSync(link, `@echo off\r\n"${target}" %*\r\n`);
      } else symlinkSync(target, link);
    }
  }
  return directory;
}

function withoutHostNpmConfig(overrides = {}) {
  const environment = Object.fromEntries(Object.entries(process.env).filter(([key]) => {
    const normalized = key.toLowerCase();
    return !normalized.startsWith("npm_config_") && normalized !== "npm_token" && normalized !== "node_auth_token";
  }));
  return { ...environment, ...overrides };
}

function runNpm(root, args) {
  const npmCommand = findExecutable("npm");
  const candidates = [
    process.env.npm_execpath,
    join(dirname(npmCommand), "node_modules/npm/bin/npm-cli.js"),
    join(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js"),
  ];
  const npmCli = candidates.find((candidate) => candidate && existsSync(candidate));
  return commandResult(npmCli ? process.execPath : npmCommand, npmCli ? [npmCli, ...args] : args, {
    cwd: root,
    env: withoutHostNpmConfig({
      NPM_CONFIG_USERCONFIG: join(root, ".npmrc"),
      NPM_CONFIG_GLOBALCONFIG: devNull,
      NPM_CONFIG_CACHE: join(root, ".npm-cache"),
      NPM_CONFIG_REGISTRY: "https://registry.npmjs.org/",
    }),
    timeout: 120_000,
  });
}

function runDirective(root, args, environment = withoutHostNpmConfig()) {
  return commandResult(process.execPath, [join(root, "node_modules/@deftai/directive/dist/bin.js"), ...args], {
    cwd: root,
    env: environment,
    timeout: 120_000,
  });
}

function isolatedEnv(root, sessionId) {
  const systemTools = process.platform === "win32"
    ? [dirname(findExecutable("git")), dirname(findPythonExecutable()), dirname(process.env.ComSpec ?? join(process.env.SystemRoot ?? "C:\\Windows", "System32", "cmd.exe"))]
    : ["/usr/bin", "/bin"];
  return {
    ...withoutHostNpmConfig(),
    PATH: [join(root, "node_modules/.bin"), join(root, ".lab-tools"), ...systemTools].join(delimiter),
    DEFT_SESSION_ID: sessionId,
    NPM_CONFIG_USERCONFIG: join(root, ".npmrc"),
    NPM_CONFIG_GLOBALCONFIG: devNull,
    NPM_CONFIG_CACHE: join(root, ".npm-cache"),
    NPM_CONFIG_REGISTRY: "https://registry.npmjs.org/",
  };
}

function runTask(root, taskName, args = [], sessionId = "") {
  return commandResult(findExecutable("task"), ["--silent", taskName, ...(args.length ? ["--", ...args] : [])], {
    cwd: root,
    env: isolatedEnv(root, sessionId),
  });
}

/** Create one unique no-remote OS-temp fixture. No package install occurs here. */
export function createAttempt() {
  assertNoGitRedirection();
  for (const path of ["PROJECT-DEFINITION.xbrief.json", ...fixtureFiles]) {
    assert.ok(existsSync(join(fixture, path)), "Run create from the original course fixture, not an edited attempt.");
  }
  const temporaryRoot = realpathSync(tmpdir());
  assert.equal(git(temporaryRoot, ["rev-parse", "--show-toplevel"], [0, 128]).trim(), "", "Stop: temporary parent is inside another Git repository.");
  const parent = mkdtempSync(join(temporaryRoot, "3ci-directive-lab07-"));
  const root = join(parent, "repo");
  for (const path of ["repo", "empty-template", "evidence", ...lifecycleFolders.map((folder) => `repo/xbrief/${folder}`)]) mkdirSync(join(parent, path), { recursive: true });
  for (const name of fixtureFiles) copyFileSync(join(fixture, name), safePath(root, name));
  copyFileSync(join(fixture, "PROJECT-DEFINITION.xbrief.json"), safePath(root, "xbrief/PROJECT-DEFINITION.xbrief.json"));
  writeFileSync(safePath(root, ".gitignore"), gitignore, { flag: "wx" });
  writeFileSync(safePath(root, ".gitattributes"), "/xbrief/*.json text eol=lf\n/xbrief/**/*.json text eol=lf\n", { flag: "wx" });
  writeFileSync(safePath(root, ".npmrc"), "registry=https://registry.npmjs.org/\naudit=false\nfund=false\nignore-scripts=true\n", { flag: "wx" });
  writeJson(safePath(root, `xbrief/proposed/${deliveryFile}`), story("northstar.lifecycle.delivery", "Complete the fictional greeting scope", deliveryFile), { flag: "wx" });
  writeJson(safePath(root, `xbrief/proposed/${cancellationFile}`), story("northstar.lifecycle.cancel", "Cancel an obsolete fictional scope", cancellationFile), { flag: "wx" });
  const fixtureDigests = Object.fromEntries(fixtureFiles.map((name) => [name, digest(read(join(fixture, name)))]));
  writeJson(join(parent, "lab-state.json"), { lab: "module-07", root, fixtureDigests }, { flag: "wx" });
  writeFileSync(join(parent, "evidence", "README.md"), "# Module 7 retained evidence\n\nExpected failures and successful lifecycle results are written here.\n", { flag: "wx" });
  git(root, ["init", "--template=" + join(parent, "empty-template")]);
  git(root, ["switch", "-c", "training/module-07"]);
  guardAttempt(root);
  return root;
}

/** Verify only the immutable target identity needed for reset or recoverable archive. */
function verifyAttemptIdentity(input = process.cwd()) {
  assertNoGitRedirection();
  const root = resolve(input);
  const parent = dirname(root);
  const temporaryRoot = realpathSync(tmpdir());
  assert.ok(basename(root) === "repo" && /^3ci-directive-lab07-[A-Za-z0-9]{6}$/.test(basename(parent)) && dirname(parent) === temporaryRoot, "Stop: expected the unique OS temporary lab repo for Module 7.");
  assert.ok(!lstatSync(parent).isSymbolicLink() && !lstatSync(root).isSymbolicLink(), "Stop: lab root is a symlink.");
  assert.equal(realpathSync(root), root, "Stop: lab root is not canonical.");
  assert.equal(git(parent, ["rev-parse", "--show-toplevel"], [0, 128]).trim(), "", "Stop: temporary parent is inside another Git repository.");
  const marker = readJson(safePath(parent, "lab-state.json"));
  assert.ok(marker.lab === "module-07" && marker.root === root, "Stop: lab marker mismatch.");
  for (const path of [".git", ".git/config", ".git/index", ".git/hooks", ".git/objects", ".git/refs", ".git/HEAD", ".gitattributes", ".gitignore", ".npmrc", "package.json", "xbrief", "xbrief/PROJECT-DEFINITION.xbrief.json"]) safePath(root, path);
  assert.ok(lstatSync(join(root, ".git")).isDirectory(), "Stop: expected a local .git directory.");
  assertPlainTree(root, ".git");
  const gitRoot = git(root, ["rev-parse", "--show-toplevel"]).trim();
  assert.ok(sameFileSystemEntry(root, gitRoot), "Stop: Git root differs from the lab.");
  assert.equal(git(root, ["branch", "--show-current"]).trim(), "training/module-07", "Stop: expected training/module-07.");
  assert.equal(git(root, ["remote"]).trim(), "", "Stop: lab must have no remote.");
  return { root, marker };
}

/** Verify canonical temp identity, exact pin, no remote, and lifecycle folder/status agreement. */
export function guardAttempt(input = process.cwd()) {
  const { root, marker } = verifyAttemptIdentity(input);
  for (const name of fixtureFiles) assert.equal(digest(read(safePath(root, name))), marker.fixtureDigests[name], `Stop: ${name} differs from the supplied exact 0.119.11 fixture.`);
  verifyManifest(root);
  locateStory(root, deliveryFile);
  locateStory(root, cancellationFile);
  if (existsSync(join(root, "node_modules"))) verifyInstalledGraph(root);
  if (existsSync(join(root, ".deft/core/VERSION"))) assert.match(read(join(root, ".deft/core/VERSION")), /(?:ref|tag): 'v0\.119\.11'/, "Stop: Directive deposit must be 0.119.11.");
  return root;
}

function verifyInstalledGraph(root) {
  safePath(root, "node_modules");
  for (const name of ["directive", "directive-core", "directive-content", "directive-types"]) {
    const manifest = readJson(safePath(root, `node_modules/@deftai/${name}/package.json`));
    assert.equal(manifest.version, exactVersion, `${name} must resolve to 0.119.11`);
  }
  const target = realpathSync(safePath(root, "node_modules/@deftai/directive/dist/bin.js"));
  if (process.platform !== "win32") assert.equal(realpathSync(join(root, "node_modules/.bin/directive")), target, "local Directive launcher must resolve inside this attempt");
}

/** Verify the exact installed CLI/core/content/types graph. */
export function verifyPin(root = process.cwd()) {
  guardAttempt(root);
  verifyInstalledGraph(root);
  return exactVersion;
}

/** Install the exact release, deposit its Task surface, and create a local checkpoint. */
export function installAttempt(root = process.cwd(), platform = process.platform) {
  root = guardAttempt(root);
  assertLearnerReadyPlatform(platform);
  assert.ok(!existsSync(join(root, "node_modules")), "Stop: install requires a fresh attempt; use reset after any partial install.");
  const install = runNpm(root, ["install", "--userconfig", join(root, ".npmrc"), "--globalconfig", devNull, "--cache", join(root, ".npm-cache"), "--registry", "https://registry.npmjs.org/", "--ignore-scripts", "--no-audit", "--no-fund"]);
  requireSuccess("npm install", install);
  verifyInstalledGraph(root);
  createIsolatedTools(root);
  const init = runDirective(root, ["init", "--yes", "--repo-root", root, "--json"], isolatedEnv(root, "lab-install-session"));
  requireSuccess("directive init", init);
  assert.match(read(join(root, ".deft/core/VERSION")), /(?:ref|tag): 'v0\.119\.11'/, "installed content deposit must be 0.119.11");
  writeFileSync(join(root, ".deft/USER.md"), "# User Preferences\n\n## Personal\n\n**Name**: Address the user as: **Learner**\n\n## Defaults\n\n**Coverage**: >=90% test coverage\n");
  const tracked = [
    ".gitattributes", ".gitignore", ".npmrc", "Taskfile.yml", "package.json", "package-lock.json",
    "lifecycle-lab.mjs", "safety.mjs", "xbrief/PROJECT-DEFINITION.xbrief.json",
    `xbrief/proposed/${deliveryFile}`, `xbrief/proposed/${cancellationFile}`,
  ];
  git(root, ["add", "--", ...tracked]);
  git(root, ["-c", "user.name=3Ci Lab Learner", "-c", "user.email=learner@example.invalid", "-c", "commit.gpgsign=false", "commit", "-m", "chore: checkpoint fictional lifecycle lab"]);
  guardAttempt(root);
  return root;
}

/** Execute the bounded lifecycle sequence and write retained evidence outside the repo. */
export function runLifecycle(root = process.cwd(), options = {}) {
  assert.equal(options.intent, "implement", "Run requires explicit live intent: --intent=implement.");
  root = guardAttempt(root);
  verifyPin(root);
  assert.equal(locateStory(root, deliveryFile).folder, "proposed", "Use reset: delivery scope is not at the proposed start.");
  assert.equal(locateStory(root, cancellationFile).folder, "proposed", "Use reset: cancellation scope is not at the proposed start.");
  const sessionId = randomUUID();
  const cli = join(root, "node_modules/@deftai/directive/dist/bin.js");
  const proposedPath = `xbrief/proposed/${deliveryFile}`;
  const steps = {};
  steps.proposedDirectivePreflight = commandResult(process.execPath, [cli, "xbrief:preflight", "--vbrief-path", proposedPath], { cwd: root, env: isolatedEnv(root, sessionId) });
  assert.equal(steps.proposedDirectivePreflight.exitCode, 1, "pinned proposed preflight must exit 1");
  steps.proposedTaskPreflight = runTask(root, "deft:xbrief:preflight", [proposedPath], sessionId);
  assert.notEqual(steps.proposedTaskPreflight.exitCode, 0, "Task preflight must preserve the proposed failure");
  const stateBeforePromotion = (({ folder, status }) => ({ folder, status }))(locateStory(root, deliveryFile));
  assert.deepEqual(stateBeforePromotion, { folder: "proposed", status: "proposed" }, "failed preflight must leave the delivery scope proposed");
  const evidenceRoot = safePath(dirname(root), "evidence");
  writeJson(join(evidenceRoot, "proposed-preflight.json"), {
    intent: "implement (current helper invocation only)",
    pinnedDirectiveExit: steps.proposedDirectivePreflight.exitCode,
    taskExit: steps.proposedTaskPreflight.exitCode,
    stateBeforePromotion,
    directive: steps.proposedDirectivePreflight,
    task: steps.proposedTaskPreflight,
  });
  steps.promote = requireSuccess("promote", runTask(root, "deft:scope:promote", [proposedPath], sessionId));
  assert.equal(locateStory(root, deliveryFile).folder, "pending");
  steps.activate = requireSuccess("activate", runTask(root, "deft:scope:activate", [`xbrief/pending/${deliveryFile}`], sessionId));
  assert.equal(locateStory(root, deliveryFile).folder, "active");
  steps.cancel = requireSuccess("cancel", runTask(root, "deft:scope:cancel", [`xbrief/proposed/${cancellationFile}`], sessionId));
  assert.equal(locateStory(root, cancellationFile).folder, "cancelled");
  steps.sessionStart = requireSuccess("session start", runTask(root, "deft:session:start", [`--session-id=${sessionId}`], sessionId));
  steps.sessionRitual = requireSuccess("gated ritual", runTask(root, "deft:verify:session-ritual", ["--tier=gated"], sessionId));
  steps.activePreflight = requireSuccess("active preflight", runTask(root, "deft:xbrief:preflight", [`xbrief/active/${deliveryFile}`], sessionId));
  steps.stampEvidence = requireSuccess("stamp evidence", runTask(root, "deft:scope:stamp-evidence", [`xbrief/active/${deliveryFile}`], sessionId));
  steps.complete = requireSuccess("complete", runTask(root, "deft:scope:complete", [`xbrief/active/${deliveryFile}`], sessionId));
  const final = {
    delivery: (({ folder, status }) => ({ folder, status }))(locateStory(root, deliveryFile)),
    cancellation: (({ folder, status }) => ({ folder, status }))(locateStory(root, cancellationFile)),
  };
  const evidence = {
    schema: "3ci.training.module07.lifecycle-evidence.v1",
    generatedAt: new Date().toISOString(),
    baseline: { package: "@deftai/directive", engine: exactVersion },
    environment: { platform: process.platform, shell: process.env.SHELL ? basename(process.env.SHELL) : "unknown", nativeClaim: "fixture-verified; walkthrough-candidate" },
    liveIntent: "implement (current helper invocation only; not durable future authority)",
    sessionId,
    steps,
    final,
    remote: git(root, ["remote"]).trim(),
  };
  writeJson(join(evidenceRoot, "lifecycle-run.json"), evidence);
  guardAttempt(root);
  return evidence;
}

/** Create a unique fresh attempt while preserving the named failed attempt and evidence. */
export function resetAttempt(root = process.cwd()) {
  const temporaryRoot = realpathSync(tmpdir());
  if (
    typeof root === "string" && isAbsolute(root) && resolve(root) === root &&
    dirname(root) === join(temporaryRoot, archiveDirectoryName) && archivedParentPattern.test(basename(root))
  ) verifyArchivedAttempt(root, temporaryRoot);
  else verifyAttemptIdentity(root);
  return createAttempt(); // fresh-reset
}

/** Move one explicitly named guarded attempt and its evidence to a recoverable temp archive. */
export function archiveAttempt(root) {
  assert.equal(arguments.length, 1, archiveUsage);
  assert.ok(typeof root === "string" && isAbsolute(root) && resolve(root) === root, archiveUsage);
  verifyAttemptIdentity(root);
  const parent = dirname(root);
  const cwdFromParent = relative(parent, realpathSync(process.cwd()));
  assert.ok(isAbsolute(cwdFromParent) || cwdFromParent === ".." || cwdFromParent.startsWith(".." + sep), "Stop: caller and helper must leave the attempt parent before archive.");
  const temporaryRoot = dirname(parent);
  const archive = safePath(temporaryRoot, archiveDirectoryName);
  if (!existsSync(archive)) mkdirSync(archive);
  const destination = safePath(archive, basename(parent));
  assert.ok(!existsSync(destination), "Stop: archive destination already exists.");
  renameSync(parent, destination);
  assert.ok(!existsSync(parent) && existsSync(join(destination, "repo")), "archive move did not complete");
  return destination;
}

function canonicalReclaimDirectory(input) {
  assert.ok(typeof input === "string" && isAbsolute(input) && resolve(input) === input && existsSync(input), reclaimTargetRefusal);
  const stat = lstatSync(input);
  assert.ok(stat.isDirectory() && !stat.isSymbolicLink(), "Stop: reclaim archive path is a symlink or is not a directory: " + input + ".");
  assert.equal(realpathSync(input), input, reclaimTargetRefusal);
  return input;
}

function verifyArchivedAttempt(destination, temporaryRoot) {
  const archiveRoot = join(temporaryRoot, archiveDirectoryName);
  assert.ok(
    typeof destination === "string" && isAbsolute(destination) && resolve(destination) === destination &&
      dirname(destination) === archiveRoot && archivedParentPattern.test(basename(destination)),
    reclaimTargetRefusal,
  );
  canonicalReclaimDirectory(archiveRoot);
  canonicalReclaimDirectory(destination);
  const root = canonicalReclaimDirectory(join(destination, "repo"));
  const markerPath = join(destination, "lab-state.json");
  assert.ok(existsSync(markerPath) && lstatSync(markerPath).isFile() && !lstatSync(markerPath).isSymbolicLink(), "Stop: Module 7 archive marker mismatch.");
  const marker = readJson(markerPath);
  assert.ok(marker.lab === "module-07" && marker.root === join(temporaryRoot, basename(destination), "repo"), "Stop: Module 7 archive marker mismatch.");
  const gitDirectory = join(root, ".git");
  assert.ok(existsSync(gitDirectory) && lstatSync(gitDirectory).isDirectory() && !lstatSync(gitDirectory).isSymbolicLink(), "Stop: archived Module 7 attempt lacks a plain .git directory.");
  assertPlainTree(root, ".git");
  assert.ok(sameFileSystemEntry(root, git(root, ["rev-parse", "--show-toplevel"]).trim()), "Stop: archived Git root differs from the Module 7 attempt.");
  assert.equal(git(root, ["branch", "--show-current"]).trim(), "training/module-07", "Stop: archived Module 7 attempt is on the wrong branch.");
  assert.equal(git(root, ["remote"]).trim(), "", "Stop: archived Module 7 attempt has a Git remote.");
  return destination;
}

/** List exact existing Module 7 archive destinations without creating the shared archive directory. */
export function previewReclaim(temporaryRoot = realpathSync(tmpdir())) {
  temporaryRoot = canonicalReclaimDirectory(temporaryRoot);
  const archiveRoot = join(temporaryRoot, archiveDirectoryName);
  if (!existsSync(archiveRoot)) return [];
  canonicalReclaimDirectory(archiveRoot);
  return readdirSync(archiveRoot, { withFileTypes: true })
    .filter((entry) => entry.name.startsWith("3ci-directive-lab07-"))
    .flatMap((entry) => {
      if (!entry.isDirectory() || entry.isSymbolicLink()) return [];
      try {
        return [verifyArchivedAttempt(join(archiveRoot, entry.name), temporaryRoot)];
      } catch {
        return [];
      }
    })
    .sort();
}

/** Delete only exact previewed Module 7 archives after explicit confirmation. */
export function reclaimArchives(targets, { confirmed = false, temporaryRoot = realpathSync(tmpdir()) } = {}) {
  assert.equal(confirmed, true, reclaimConfirmationRefusal);
  assert.ok(Array.isArray(targets) && targets.length > 0 && new Set(targets).size === targets.length, reclaimTargetRefusal);
  temporaryRoot = canonicalReclaimDirectory(temporaryRoot);
  const previewed = new Set(previewReclaim(temporaryRoot));
  for (const target of targets) {
    assert.ok(typeof target === "string" && isAbsolute(target) && resolve(target) === target && previewed.has(target), reclaimTargetRefusal);
  }
  for (const target of targets) {
    verifyArchivedAttempt(target, temporaryRoot);
    rmSync(target, { recursive: true });
    assert.equal(existsSync(target), false, "Stop: reclaim did not remove the confirmed Module 7 archive: " + target + ".");
  }
  return [...targets];
}

/** Dispatch one documented CLI verb. */
export function main(args = process.argv.slice(2)) {
  const [verb, root, option] = args;
  if (verb === "reclaim" && args.length === 1) return previewReclaim().join("\n");
  if (verb === "reclaim" && args[1] === "--confirm" && args.length >= 3) {
    return reclaimArchives(args.slice(2), { confirmed: true }).map((path) => "reclaimed=" + path).join("\n");
  }
  if (verb === "create" && args.length === 1) return createAttempt();
  if (verb === "guard" && args.length === 2) return guardAttempt(root);
  if (verb === "install" && args.length === 2) return `OK: installed Directive ${verifyPin(installAttempt(root))}`;
  if (verb === "run" && args.length === 3 && option === "--intent=implement") return JSON.stringify(runLifecycle(root, { intent: "implement" }).final);
  if (verb === "reset" && args.length === 2) return resetAttempt(root);
  if (verb === "archive" && args.length === 2) return archiveAttempt(root);
  throw new Error("Use: create | guard <absolute-root> | install <absolute-root> | run <absolute-root> --intent=implement | reset <absolute-live-or-archived-root> | archive <absolute-root> | reclaim [--confirm <absolute-archive>...].");
}

if (process.argv[1] && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) {
  try {
    console.log(main());
  } catch (error) {
    console.error("Lab 7 stopped: " + error.message);
    process.exitCode = 1;
  }
}
