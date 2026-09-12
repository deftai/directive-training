import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  readdirSync,
  realpathSync,
  renameSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { devNull, tmpdir } from "node:os";
import { basename, delimiter, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { assertNoGitRedirection, assertPlainTree, git, safePath, sameFileSystemEntry } from "./safety.mjs";

const fixture = dirname(fileURLToPath(import.meta.url));
const courseRoot = realpathSync(resolve(fixture, "../../.."));
const read = (path) => readFileSync(path, "utf8");
const exactVersion = "0.112.0";
const storyFile = "fictional-work-items.xbrief.json";
const proposedStoryPath = `xbrief/proposed/${storyFile}`;
const activeStoryPath = `xbrief/active/${storyFile}`;
const sourcePath = "src/work-items.mjs";
const testPath = "test/work-items.test.mjs";
const allowedProductFiles = [sourcePath];
const archiveUsage = "Archive requires one explicit absolute canonical capstone root. Run the original course helper from outside the attempt parent.";
const fixtureFiles = [
  "Taskfile.yml",
  "capstone-lab.mjs",
  "package.json",
  "safety.mjs",
  "scripts/verify-evidence.mjs",
  "src/cli.mjs",
  sourcePath,
  testPath,
];
const immutableFiles = fixtureFiles.filter((path) => path !== sourcePath);
const controlTreePaths = [".deft/core", ".githooks", ".lab-tools"];
const controlFilePaths = [".git/config", "AGENTS.md"];
const learnerPreferences = "# User Preferences\n\n## Personal\n\n**Name**: Address the user as: **Learner**\n\n## Defaults\n\n**Coverage**: >=90% test coverage\n";
const gitignore = [
  "/node_modules/", "/.npm-cache/", "/.lab-tools/", "/.deft/", "/.deft-cache/",
  "/.agents/", "/.claude/", "/.codex/", "/.cursor/", "/.grok/", "/.github/",
  "/.githooks/", "/AGENTS.md", "/greptile.json", "/.prettierignore",
  "/xbrief/.deft-version", "/xbrief/.triage-cache/", "/xbrief/schemas/",
].join("\n") + "\n";
const stageOrder = [
  "CREATED",
  "CHECKPOINT",
  "ORIENTED",
  "SCOPED",
  "READY",
  "RED",
  "GREEN",
  "FOCUSED",
  "LITERAL",
  "AGGREGATE_RED",
  "PREPR",
  "REVIEWED",
  "COMPLETE",
];

function digest(text) {
  return createHash("sha256").update(text.replace(/\r\n/g, "\n")).digest("hex");
}

function rawDigest(value) {
  return createHash("sha256").update(value).digest("hex");
}

function treeDigest(root, relativePath, { allowLinks = false } = {}) {
  const hash = createHash("sha256");
  const base = safePath(root, relativePath);
  const visit = (path, name) => {
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) {
      assert.ok(allowLinks, `Stop: protected control tree contains a symlink: ${name}.`);
      hash.update(`L\0${name}\0${readlinkSync(path)}\0`);
      return;
    }
    if (stat.isDirectory()) {
      hash.update(`D\0${name}\0${stat.mode & 0o777}\0`);
      for (const entry of readdirSync(path).sort()) visit(join(path, entry), `${name}/${entry}`);
      return;
    }
    assert.ok(stat.isFile(), `Stop: protected control tree contains a special file: ${name}.`);
    const content = readFileSync(path);
    hash.update(`F\0${name}\0${stat.mode & 0o777}\0${content.length}\0`);
    hash.update(content);
  };
  visit(base, relativePath);
  return hash.digest("hex");
}

function optionalTreeDigest(root, path) {
  return existsSync(join(root, path)) ? treeDigest(root, path, { allowLinks: path === ".lab-tools" }) : null;
}

function optionalFileDigest(root, path) {
  return existsSync(join(root, path)) ? rawDigest(readFileSync(safePath(root, path))) : null;
}

function writeJson(path, value, options = {}) {
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", options);
}

function readJson(path) {
  return JSON.parse(read(path));
}

function story() {
  return {
    xBRIEFInfo: { version: "0.8", description: "Fictional Northstar work-items capstone story" },
    plan: {
      id: "northstar.capstone.work-items",
      title: "Complete the fictional work-items library",
      status: "proposed",
      narratives: {
        Description: "Implement one immutable work-items source file test-first, preserve every supplied gate, and classify the resulting local evidence precisely.",
        UserStory: "As a Northstar teammate, I want to add, complete, and summarize work items so that a small fictional backlog remains useful without hidden mutation.",
        QualityGate: "Run literal acceptance before the aggregate task check; repair the scoped source or retained evidence, never tests or gate definitions.",
      },
      items: [
        {
          id: "northstar.capstone.work-items.behavior",
          title: "Add, complete, and summarize immutable work items",
          status: "pending",
          effort: "S",
          narrative: {
            Acceptance: "The supplied focused tests and work-items CLI pass for add, complete, summary, invalid-input, and empty-collection cases without mutating input collections.",
          },
        },
      ],
      acceptance: {
        commands: ["npm run test:focused", "npm run check:behavior"],
        none_stated: false,
        source_rung: "derived",
      },
      metadata: {
        kind: "story",
        file_scope: allowedProductFiles,
        intended_placement: {
          schema: "deft.scope.intended_placement.v1",
          files: allowedProductFiles,
          module_boundary: "One fictional immutable work-items implementation file",
        },
      },
    },
  };
}

function storyContract(value) {
  return {
    id: value.plan.id,
    title: value.plan.title,
    narratives: value.plan.narratives,
    items: value.plan.items,
    acceptance: {
      commands: value.plan.acceptance?.commands,
      none_stated: value.plan.acceptance?.none_stated,
      source_rung: value.plan.acceptance?.source_rung,
    },
    file_scope: value.plan.metadata.file_scope,
    intended_placement: value.plan.metadata.intended_placement,
  };
}

function verifyManifest(root) {
  const manifest = readJson(safePath(root, "package.json"));
  assert.equal(manifest.private, true, "fixture must remain private");
  assert.equal(manifest.devDependencies?.["@deftai/directive"], exactVersion, "exact 0.112.0 pin required");
  for (const name of ["directive-core", "directive-content", "directive-types"]) {
    assert.equal(manifest.overrides?.[`@deftai/${name}`], exactVersion, `exact 0.112.0 ${name} override required`);
  }
}

function verifyProjectDefinition(root) {
  const project = readJson(safePath(root, "xbrief/PROJECT-DEFINITION.xbrief.json"));
  assert.equal(project.xBRIEFInfo?.version, "0.8", "project definition must use xBRIEF 0.8");
  assert.equal(project.plan?.title, "Northstar Work Items Capstone", "project identity changed");
  assert.equal(project.plan?.["x-directive/policy"]?.allowDirectCommitsToMaster, false, "default-branch commits must remain disabled");
}

function commandResult(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", timeout: options.timeout ?? 60_000, ...options });
  if (result.error) throw result.error;
  assert.equal(result.signal, null, `${command} terminated by signal ${result.signal}`);
  return {
    command: [command, ...args].map((part) => String(part).replace(options.cwd ?? "", ".")).join(" "),
    exitCode: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

function requireSuccess(name, result) {
  assert.equal(result.exitCode, 0, `${name} failed (${result.exitCode}): ${result.stderr || result.stdout}`);
  return result;
}

function findExecutable(name) {
  const suffixes = process.platform === "win32" ? (process.env.PATHEXT ?? ".EXE;.CMD;.BAT").split(";") : [""];
  for (const directory of (process.env.PATH ?? "").split(delimiter).filter(Boolean)) {
    for (const suffix of suffixes) {
      for (const candidate of [join(directory, name + suffix.toLowerCase()), join(directory, name + suffix.toUpperCase())]) {
        if (existsSync(candidate)) return realpathSync(candidate);
      }
    }
  }
  throw new Error(`Required executable not found: ${name}`);
}

function withoutHostOverrides(overrides = {}) {
  const environment = Object.fromEntries(Object.entries(process.env).filter(([key]) => {
    const normalized = key.toLowerCase();
    return !normalized.startsWith("git_") && !normalized.startsWith("npm_config_") &&
      normalized !== "npm_token" && normalized !== "node_auth_token" && normalized !== "node_test_context" &&
      normalized !== "path";
  }));
  return { ...environment, ...overrides };
}

function isolatedEnv(root, sessionId = "capstone-lab-session") {
  const systemTools = process.platform === "win32"
    ? [
        dirname(findExecutable("git")),
        dirname(findExecutable("python")),
        dirname(process.env.ComSpec ?? join(process.env.SystemRoot ?? "C:\\Windows", "System32", "cmd.exe")),
      ]
    : ["/usr/bin", "/bin"];
  return withoutHostOverrides({
    PATH: [join(root, "node_modules/.bin"), join(root, ".lab-tools"), ...systemTools].join(delimiter),
    DEFT_SESSION_ID: sessionId,
    DEFT_SESSION_SLASH_VERB: "implement",
    DEFT_USER_PATH: join(dirname(root), "user-config", "USER.md"),
    NPM_CONFIG_USERCONFIG: join(root, ".npmrc"),
    NPM_CONFIG_GLOBALCONFIG: devNull,
    NPM_CONFIG_CACHE: join(root, ".npm-cache"),
    NPM_CONFIG_REGISTRY: "https://registry.npmjs.org/",
  });
}

function runTask(root, taskName, args = [], sessionId = "capstone-lab-session") {
  return commandResult(findExecutable("task"), ["--silent", taskName, ...(args.length ? ["--", ...args] : [])], {
    cwd: root,
    env: isolatedEnv(root, sessionId),
    timeout: 240_000,
  });
}

function runDirective(root, args, sessionId = "capstone-lab-session", environment = {}) {
  return commandResult(process.execPath, [join(root, "node_modules/@deftai/directive/dist/bin.js"), ...args], {
    cwd: root,
    env: { ...isolatedEnv(root, sessionId), ...environment },
    timeout: 240_000,
  });
}

function npmCliPath() {
  const candidates = [process.env.npm_execpath];
  const npmCommand = findExecutable("npm");
  if (process.platform === "win32") {
    candidates.push(join(dirname(npmCommand), "node_modules/npm/bin/npm-cli.js"));
    candidates.push(join(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js"));
  }
  return { npmCommand, npmCli: candidates.find((candidate) => candidate && existsSync(candidate)) };
}

function runNpm(root, args, options = {}) {
  const { npmCommand, npmCli } = npmCliPath();
  const command = npmCli ? process.execPath : npmCommand;
  const commandArgs = npmCli ? [npmCli, ...args] : args;
  const environment = isolatedEnv(root);
  if (options.bootstrap === true) environment.PATH = process.env.PATH ?? "";
  return commandResult(command, commandArgs, {
    cwd: root,
    env: environment,
    timeout: 240_000,
  });
}

function createLocalDirectiveShims(root) {
  const directory = safePath(root, ".lab-tools");
  mkdirSync(directory, { recursive: true });
  const entry = realpathSync(safePath(root, "node_modules/@deftai/directive/dist/bin.js"));
  const tools = new Map([
    ["node", realpathSync(process.execPath)],
    ["task", findExecutable("task")],
    ["npm", findExecutable("npm")],
    ["git", findExecutable("git")],
  ]);
  for (const optional of ["uv", "gh"]) {
    try {
      tools.set(optional, findExecutable(optional));
    } catch {
      // Optional tools do not widen this local, no-remote fixture.
    }
  }
  if (process.platform === "win32") {
    for (const [name, target] of tools) {
      assert.ok(!/[\r\n"%]/.test(target), `unsupported character in local ${name} launcher path`);
      writeFileSync(join(directory, name + ".cmd"), `@echo off\r\n"${target}" %*\r\n`, { flag: "wx" });
    }
    for (const name of ["deft", "directive"]) {
      assert.ok(!/[\r\n"%]/.test(process.execPath + entry), "unsupported character in local Directive launcher path");
      writeFileSync(join(directory, name + ".cmd"), `@echo off\r\n"${process.execPath}" "${entry}" %*\r\n`, { flag: "wx" });
    }
  } else {
    for (const [name, target] of [...tools, ["deft", entry], ["directive", entry]]) {
      symlinkSync(target, join(directory, name));
    }
  }
  return directory;
}

function updateMarker(root, changes) {
  const path = join(dirname(root), "lab-state.json");
  const marker = readJson(path);
  Object.assign(marker, changes);
  writeJson(path, marker);
  return marker;
}

function writeEvidence(root, name, value) {
  const path = join(dirname(root), "evidence", name);
  writeJson(path, value);
  return path;
}

function requireStage(marker, expected) {
  assert.equal(marker.stage, expected, `Stop: expected ${expected} stage; observed ${marker.stage}.`);
}

function mutableFiles(root) {
  return git(root, ["status", "--porcelain", "--untracked-files=all"])
    .replace(/\s+$/, "")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.slice(3))
    .sort();
}

function assertMutableFiles(root, expected, stage) {
  assert.deepEqual(mutableFiles(root), [...expected].sort(), `Stop: ${stage} has an unexpected mutable path.`);
}

function isWithin(parent, candidate) {
  const offset = relative(parent, candidate);
  return offset === "" || (!isAbsolute(offset) && offset !== ".." && !offset.startsWith(".." + sep));
}

function validateLauncher(input) {
  assertNoGitRedirection();
  const requestedCaller = resolve(input);
  let callerStat;
  try {
    callerStat = lstatSync(requestedCaller);
  } catch (error) {
    if (error.code === "ENOENT") assert.fail("Stop: create requires an existing launcher directory.");
    throw error;
  }
  assert.ok(!callerStat.isSymbolicLink(), "Stop: launcher itself must not be a symlink.");
  assert.ok(callerStat.isDirectory(), "Stop: create requires an existing launcher directory.");
  const caller = realpathSync(requestedCaller);
  assert.ok(!isWithin(courseRoot, caller), "Stop: run create from outside the training repository.");
  const temporaryRoot = realpathSync(tmpdir());
  assert.ok(caller !== temporaryRoot && isWithin(temporaryRoot, caller) && /^3ci-capstone-launch-[A-Za-z0-9-]{6,}$/.test(basename(caller)), "Stop: use a dedicated temporary launcher directory, not a broad workspace root.");
  assert.equal(git(caller, ["rev-parse", "--show-toplevel"], [0, 128]).trim(), "", "Stop: launcher must not be a Git repository or business workspace.");
  return caller;
}

function verifyStoryContract(root, marker, placement) {
  const lifecycle = ["proposed", "pending", "active", "completed", "cancelled"];
  const files = lifecycle.flatMap((folder) => readdirSync(safePath(root, `xbrief/${folder}`))
    .filter((name) => name.endsWith(".xbrief.json"))
    .map((name) => ({ folder, name })));
  assert.deepEqual(files, [{ folder: placement, name: storyFile }], "Stop: exactly one capstone story must exist in the expected lifecycle folder.");
  const value = readJson(safePath(root, `xbrief/${placement}/${storyFile}`));
  assert.equal(value.xBRIEFInfo?.version, "0.8", "Stop: capstone story must use xBRIEF 0.8.");
  assert.equal(value.plan?.status, placement === "active" ? "running" : placement, "Stop: capstone story lifecycle status does not match its folder.");
  assert.deepEqual(value.plan?.metadata?.file_scope, allowedProductFiles, "Stop: capstone story must allow only src/work-items.mjs.");
  assert.equal(digest(JSON.stringify(storyContract(value))), marker.storyContractDigest, "Stop: capstone story acceptance or scope changed.");
  return value;
}

function verifyInstalledGraph(root) {
  safePath(root, "node_modules");
  for (const name of ["directive", "directive-core", "directive-content", "directive-types"]) {
    const manifest = readJson(safePath(root, `node_modules/@deftai/${name}/package.json`));
    assert.equal(manifest.version, exactVersion, `${name} must resolve to 0.112.0`);
  }
  if (process.platform !== "win32") {
    const target = realpathSync(safePath(root, "node_modules/@deftai/directive/dist/bin.js"));
    assert.equal(realpathSync(join(root, "node_modules/.bin/directive")), target, "local Directive launcher must resolve inside this attempt");
  }
}

function verifyAttemptIdentity(input = process.cwd()) {
  assertNoGitRedirection();
  const root = resolve(input);
  const parent = dirname(root);
  const temporaryRoot = realpathSync(tmpdir());
  assert.ok(basename(root) === "repo" && /^3ci-directive-capstone-[A-Za-z0-9]{6}$/.test(basename(parent)) && dirname(parent) === temporaryRoot, "Stop: expected the unique OS temporary capstone repo.");
  assert.ok(!lstatSync(parent).isSymbolicLink() && !lstatSync(root).isSymbolicLink(), "Stop: capstone root is a symlink.");
  assert.equal(realpathSync(root), root, "Stop: capstone root is not canonical.");
  assert.equal(git(parent, ["rev-parse", "--show-toplevel"], [0, 128]).trim(), "", "Stop: temporary parent is inside another Git repository.");
  const marker = readJson(safePath(parent, "lab-state.json"));
  assert.ok(marker.lab === "capstone-end-to-end" && marker.root === root, "Stop: capstone marker mismatch.");
  assert.equal(digest(read(safePath(parent, "user-config/USER.md"))), marker.learnerUserDigest, "Stop: isolated learner preferences changed.");
  for (const path of [
    ".git", ".git/config", ".git/index", ".git/hooks", ".git/objects", ".git/refs", ".git/HEAD",
    ".gitattributes", ".gitignore", ".npmrc", "Taskfile.yml", "package.json", "capstone-lab.mjs",
    "safety.mjs", "scripts", "scripts/verify-evidence.mjs", "src", "src/cli.mjs", sourcePath,
    "test", testPath, "xbrief", "xbrief/PROJECT-DEFINITION.xbrief.json",
  ]) safePath(root, path);
  assert.ok(lstatSync(join(root, ".git")).isDirectory(), "Stop: expected a local .git directory.");
  for (const path of [".git", "scripts", "src", "test", "xbrief"]) assertPlainTree(root, path);
  const gitRoot = git(root, ["rev-parse", "--show-toplevel"]).trim();
  assert.ok(sameFileSystemEntry(root, gitRoot), "Stop: Git root differs from the capstone repo.");
  assert.equal(git(root, ["branch", "--show-current"]).trim(), "training/capstone", "Stop: expected training/capstone.");
  assert.equal(git(root, ["remote"]).trim(), "", "Stop: capstone must have no remote.");
  assert.equal(existsSync(join(root, ".git/hooks")), false, "Stop: private Git hooks are not allowed in the capstone attempt.");
  return { root, marker };
}

/** Verify canonical temp identity, immutable fixture content, exact pin, and one story. */
export function guardAttempt(input = process.cwd()) {
  const { root, marker } = verifyAttemptIdentity(input);
  verifyManifest(root);
  verifyProjectDefinition(root);
  assert.equal(digest(read(safePath(root, "xbrief/PROJECT-DEFINITION.xbrief.json"))), marker.projectDefinitionDigest, "Stop: project definition changed.");
  for (const [path, expected] of Object.entries(marker.controlTreeDigests ?? {})) {
    assert.equal(optionalTreeDigest(root, path), expected, `Stop: protected control tree changed: ${path}.`);
  }
  for (const [path, expected] of Object.entries(marker.controlFileDigests ?? {})) {
    assert.equal(optionalFileDigest(root, path), expected, `Stop: protected control file changed: ${path}.`);
  }
  for (const [path, expected] of Object.entries(marker.immutableDigests)) {
    assert.equal(digest(read(safePath(root, path))), expected, `Stop: immutable fixture file changed: ${path}.`);
  }
  for (const [path, expected] of Object.entries(marker.checkpointDigests ?? {})) {
    assert.equal(digest(read(safePath(root, path))), expected, `Stop: checkpoint file changed: ${path}.`);
  }
  const placement = stageOrder.indexOf(marker.stage) >= stageOrder.indexOf("SCOPED") ? "active" : "proposed";
  verifyStoryContract(root, marker, placement);
  if (existsSync(join(root, "node_modules"))) verifyInstalledGraph(root);
  if (existsSync(join(root, ".deft/core/VERSION"))) {
    assert.match(read(join(root, ".deft/core/VERSION")), /(?:ref|tag): 'v0\.112\.0'/, "Stop: Directive deposit must be 0.112.0.");
  }
  return root;
}

/** Create one unique no-remote OS-temporary fixture without installing packages. */
export function createAttempt(options = {}) {
  assert.ok(options && typeof options === "object" && !Array.isArray(options), "Stop: create options must be an object.");
  const callerRoot = validateLauncher(options.callerRoot ?? process.cwd());
  for (const path of ["PROJECT-DEFINITION.xbrief.json", ...fixtureFiles]) {
    assert.ok(existsSync(join(fixture, path)), "Run create from the original course fixture, not an edited attempt.");
  }
  const temporaryRoot = realpathSync(tmpdir());
  let parent;
  if (options.attemptParent !== undefined) {
    parent = resolve(options.attemptParent);
    assert.ok(!existsSync(parent), "Stop: attempt parent must not already exist; create never reuses a destination.");
    assert.ok(dirname(parent) === temporaryRoot && /^3ci-directive-capstone-[A-Za-z0-9]{6}$/.test(basename(parent)), "Stop: attempt parent must be one unique direct child of the OS temporary directory.");
    mkdirSync(parent);
  } else {
    parent = mkdtempSync(join(temporaryRoot, "3ci-directive-capstone-"));
  }
  const root = join(parent, "repo");
  for (const path of [
    "repo", "empty-template", "evidence", "user-config", "repo/scripts", "repo/src", "repo/test", "repo/xbrief",
    "repo/xbrief/proposed", "repo/xbrief/pending", "repo/xbrief/active", "repo/xbrief/completed", "repo/xbrief/cancelled",
  ]) mkdirSync(join(parent, path), { recursive: true });
  writeFileSync(join(parent, "user-config", "USER.md"), learnerPreferences, { flag: "wx" });
  for (const path of fixtureFiles) copyFileSync(join(fixture, path), safePath(root, path));
  copyFileSync(join(fixture, "PROJECT-DEFINITION.xbrief.json"), safePath(root, "xbrief/PROJECT-DEFINITION.xbrief.json"));
  writeFileSync(safePath(root, ".gitignore"), gitignore, { flag: "wx" });
  writeFileSync(safePath(root, ".gitattributes"), "*.json text eol=lf\n*.mjs text eol=lf\n*.yml text eol=lf\n", { flag: "wx" });
  writeFileSync(safePath(root, ".npmrc"), "registry=https://registry.npmjs.org/\naudit=false\nfund=false\nignore-scripts=true\n", { flag: "wx" });
  const proposedStory = story();
  writeJson(safePath(root, proposedStoryPath), proposedStory, { flag: "wx" });
  writeJson(join(parent, "lab-state.json"), {
    lab: "capstone-end-to-end",
    root,
    launcherRoot: callerRoot,
    allowedProductFiles,
    immutableDigests: Object.fromEntries(immutableFiles.map((path) => [path, digest(read(safePath(root, path)))])),
    checkpointDigests: {},
    storyContractDigest: digest(JSON.stringify(storyContract(proposedStory))),
    projectDefinitionDigest: digest(read(safePath(root, "xbrief/PROJECT-DEFINITION.xbrief.json"))),
    startingSourceDigest: digest(read(safePath(root, sourcePath))),
    testDigest: digest(read(safePath(root, testPath))),
    learnerUserDigest: digest(learnerPreferences),
    checkpoint: null,
    stage: "CREATED",
  }, { flag: "wx" });
  writeFileSync(join(parent, "evidence", "README.md"), "# Capstone retained evidence\n\nOrientation, lifecycle, readiness, red-green, focused, literal, aggregate, pre-PR, review, and closeout evidence is written here.\n", { flag: "wx" });
  git(root, ["init", "--template=" + join(parent, "empty-template")]);
  git(root, ["switch", "-c", "training/capstone"]);
  guardAttempt(root);
  return root;
}

/** Verify the exact installed CLI/core/content/types graph. */
export function verifyPin(root = process.cwd()) {
  guardAttempt(root);
  verifyInstalledGraph(root);
  return exactVersion;
}

/** Install the pinned release, deposit tasks, and create the clean fixture checkpoint. */
export function installAttempt(root = process.cwd()) {
  root = guardAttempt(root);
  const initial = verifyAttemptIdentity(root).marker;
  requireStage(initial, "CREATED");
  assert.ok(!existsSync(join(root, "node_modules")), "Stop: install requires a fresh attempt; use reset after a partial install.");
  requireSuccess("npm install", runNpm(root, ["install", "--userconfig", join(root, ".npmrc"), "--globalconfig", devNull, "--cache", join(root, ".npm-cache"), "--registry", "https://registry.npmjs.org/", "--ignore-scripts", "--no-audit", "--no-fund"], { bootstrap: true }));
  verifyInstalledGraph(root);
  createLocalDirectiveShims(root);
  requireSuccess("directive init", runDirective(
    root,
    ["init", "--yes", "--repo-root", root, "--json"],
    "capstone-lab-session",
    { DEFT_USER_PATH: join(dirname(root), "user-config") },
  ));
  assert.match(read(join(root, ".deft/core/VERSION")), /(?:ref|tag): 'v0\.112\.0'/, "installed content deposit must be 0.112.0");
  copyFileSync(join(fixture, "Taskfile.yml"), safePath(root, "Taskfile.yml"));
  copyFileSync(join(fixture, "PROJECT-DEFINITION.xbrief.json"), safePath(root, "xbrief/PROJECT-DEFINITION.xbrief.json"));
  const generatedLifecycleKeepFiles = ["proposed", "pending", "active", "completed", "cancelled"]
    .map((folder) => `xbrief/${folder}/.gitkeep`)
    .filter((path) => existsSync(safePath(root, path)));
  const tracked = [
    ".gitattributes", ".gitignore", ".npmrc", "Taskfile.yml", "package.json", "package-lock.json",
    "capstone-lab.mjs", "safety.mjs", "scripts/verify-evidence.mjs", "src/cli.mjs", sourcePath, testPath,
    "xbrief/PROJECT-DEFINITION.xbrief.json", proposedStoryPath, ...generatedLifecycleKeepFiles,
  ];
  git(root, ["add", "--", ...tracked]);
  git(root, ["-c", "user.name=3Ci Capstone Learner", "-c", "user.email=learner@example.invalid", "-c", "commit.gpgsign=false", "commit", "-m", "chore: checkpoint fictional Directive capstone"]);
  const checkpointDigests = Object.fromEntries([".gitattributes", ".gitignore", ".npmrc", "package-lock.json"].map((path) => [path, digest(read(safePath(root, path)))]));
  const marker = updateMarker(root, {
    checkpoint: git(root, ["rev-parse", "HEAD"]).trim(),
    checkpointDigests,
    controlTreeDigests: Object.fromEntries(controlTreePaths.map((path) => [path, optionalTreeDigest(root, path)])),
    controlFileDigests: Object.fromEntries(controlFilePaths.map((path) => [path, optionalFileDigest(root, path)])),
    stage: "CHECKPOINT",
  });
  assert.ok(marker.checkpoint, "Stop: checkpoint commit is missing.");
  assert.equal(git(root, ["status", "--porcelain", "--untracked-files=all"]).trim(), "", "Stop: install did not produce a clean checkpoint.");
  guardAttempt(root);
  return root;
}

/** Record current project, branch, remote, pin, scope, and clean-state orientation. */
export function recordOrientation(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "CHECKPOINT");
  assert.equal(git(root, ["status", "--porcelain", "--untracked-files=all"]).trim(), "", "Stop: orientation requires the clean checkpoint.");
  const version = requireSuccess("Directive version", runDirective(root, ["--version"]));
  assert.match(version.stdout, /@deftai\/directive-core@0\.112\.0/, "Stop: orientation observed the wrong Directive engine.");
  const evidence = {
    schema: "3ci.training.capstone.orientation-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "PASS",
    project: "Northstar Work Items Capstone",
    branch: git(root, ["branch", "--show-current"]).trim(),
    remote: git(root, ["remote"]).trim(),
    checkpoint: marker.checkpoint,
    proposedContract: proposedStoryPath,
    baseline: { package: "@deftai/directive", engine: exactVersion },
    version,
  };
  writeEvidence(root, "orientation.json", evidence);
  updateMarker(root, { stage: "ORIENTED" });
  return evidence;
}

/** Promote and activate exactly one proposed story, then checkpoint lifecycle state. */
export function activateScope(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "ORIENTED");
  assert.equal(git(root, ["status", "--porcelain", "--untracked-files=all"]).trim(), "", "Stop: activation requires the clean orientation checkpoint.");
  const promote = requireSuccess("scope promote", runTask(root, "deft:scope:promote", [proposedStoryPath]));
  const activate = requireSuccess("scope activate", runTask(root, "deft:scope:activate", [`xbrief/pending/${storyFile}`]));
  verifyStoryContract(root, marker, "active");
  git(root, ["add", "-A", "--", "xbrief"]);
  git(root, ["-c", "user.name=3Ci Capstone Learner", "-c", "user.email=learner@example.invalid", "-c", "commit.gpgsign=false", "commit", "-m", "chore: activate fictional capstone story"]);
  assert.equal(git(root, ["status", "--porcelain", "--untracked-files=all"]).trim(), "", "Stop: lifecycle activation did not produce a clean checkpoint.");
  const evidence = {
    schema: "3ci.training.capstone.scope-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "PASS",
    from: proposedStoryPath,
    activeContract: activeStoryPath,
    allowedProductFiles,
    promote,
    activate,
    checkpoint: git(root, ["rev-parse", "HEAD"]).trim(),
  };
  writeEvidence(root, "scope.json", evidence);
  updateMarker(root, { stage: "SCOPED", scopeCheckpoint: evidence.checkpoint });
  guardAttempt(root);
  return evidence;
}

/** Run session-start, gated ritual, story-ready, and active-xBRIEF preflight. */
export function recordReadiness(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "SCOPED");
  assert.equal(git(root, ["status", "--porcelain", "--untracked-files=all"]).trim(), "", "Stop: readiness requires a clean lifecycle checkpoint.");
  const sessionId = randomUUID();
  const sessionStart = requireSuccess("session start", runTask(root, "deft:session:start", [`--session-id=${sessionId}`], sessionId));
  const sessionRitual = requireSuccess("gated session ritual", runTask(root, "deft:verify:session-ritual", ["--tier=gated"], sessionId));
  const storyReady = requireSuccess("story ready", runDirective(root, ["verify:story-ready", "--vbrief-path", activeStoryPath, "--skip-routing"], sessionId));
  const activePreflight = requireSuccess("active xBRIEF preflight", runTask(root, "deft:xbrief:preflight", [activeStoryPath], sessionId));
  const evidence = {
    schema: "3ci.training.capstone.readiness-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "READY",
    checkpoint: marker.scopeCheckpoint,
    sessionId,
    activeContract: activeStoryPath,
    allowedProductFiles,
    sessionStart,
    sessionRitual,
    storyReady,
    activePreflight,
  };
  writeEvidence(root, "readiness.json", evidence);
  updateMarker(root, { stage: "READY", sessionId });
  return evidence;
}

/** Retain the intended supplied-test failure before product mutation. */
export function recordRed(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "READY");
  assert.equal(digest(read(safePath(root, sourcePath))), marker.startingSourceDigest, "Stop: source changed before red evidence.");
  assert.equal(digest(read(safePath(root, testPath))), marker.testDigest, "Stop: supplied test changed before red evidence.");
  assert.equal(git(root, ["status", "--porcelain", "--untracked-files=all"]).trim(), "", "Stop: red requires a clean pre-implementation checkpoint.");
  const focused = commandResult(process.execPath, ["--test", testPath], { cwd: root, env: isolatedEnv(root, marker.sessionId) });
  assert.equal(focused.exitCode, 1, "Stop: supplied focused tests must fail before implementation.");
  assert.match(focused.stdout + focused.stderr, /not implemented|Capture capstone evidence/, "Stop: focused failure does not describe the intended work-items behavior.");
  const evidence = {
    schema: "3ci.training.capstone.red-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "EXPECTED_FAILURE",
    changedFiles: [],
    testDigest: marker.testDigest,
    focused,
  };
  writeEvidence(root, "red.json", evidence);
  updateMarker(root, { stage: "RED", redTestDigest: marker.testDigest });
  return evidence;
}

/** Prove the one-file implementation passes while supplied tests remain frozen. */
export function recordGreen(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "RED");
  assertMutableFiles(root, allowedProductFiles, "green");
  assert.equal(digest(read(safePath(root, testPath))), marker.redTestDigest, "Stop: supplied test changed after red evidence.");
  const sourceDigest = digest(read(safePath(root, sourcePath)));
  assert.notEqual(sourceDigest, marker.startingSourceDigest, "Stop: green requires a source implementation.");
  const focused = requireSuccess("focused test", commandResult(process.execPath, ["--test", testPath], { cwd: root, env: isolatedEnv(root, marker.sessionId) }));
  const add = requireSuccess("add CLI", commandResult(process.execPath, ["src/cli.mjs", "add", "Capture capstone evidence"], { cwd: root, env: isolatedEnv(root, marker.sessionId) }));
  assert.deepEqual(JSON.parse(add.stdout), [{ id: "WI-001", title: "Capture capstone evidence", status: "open" }], "add CLI evidence is incorrect");
  const complete = requireSuccess("complete CLI", commandResult(process.execPath, ["src/cli.mjs", "complete", "WI-001", '[{"id":"WI-001","title":"Orient","status":"open"}]'], { cwd: root, env: isolatedEnv(root, marker.sessionId) }));
  assert.equal(JSON.parse(complete.stdout)[0].status, "done", "complete CLI evidence is incorrect");
  const evidence = {
    schema: "3ci.training.capstone.green-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "PASS",
    changedFiles: mutableFiles(root),
    testDigest: marker.redTestDigest,
    sourceDigest,
    focused,
    add,
    complete,
  };
  writeEvidence(root, "green.json", evidence);
  updateMarker(root, { stage: "GREEN", greenSourceDigest: sourceDigest });
  return evidence;
}

/** Run focused behavioral and whitespace checks without widening the diff. */
export function runFocusedChecks(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "GREEN");
  assertMutableFiles(root, allowedProductFiles, "focused checks");
  assert.equal(digest(read(safePath(root, sourcePath))), marker.greenSourceDigest, "Stop: source changed after green evidence.");
  const focused = requireSuccess("focused npm test", runNpm(root, ["run", "test:focused"]));
  const behavior = requireSuccess("behavior check", runNpm(root, ["run", "check:behavior"]));
  assert.deepEqual(JSON.parse(behavior.stdout.trim().split("\n").at(-1)), { total: 2, open: 1, done: 1 }, "summary behavior evidence is incorrect");
  const diffCheck = requireSuccess("git diff --check", commandResult(findExecutable("git"), ["--no-optional-locks", "-C", root, "diff", "--check"], { cwd: root, env: isolatedEnv(root, marker.sessionId) }));
  const evidence = {
    schema: "3ci.training.capstone.focused-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "PASS",
    focused,
    behavior,
    diffCheck,
  };
  writeEvidence(root, "focused.json", evidence);
  updateMarker(root, { stage: "FOCUSED" });
  return evidence;
}

/** Run the active story's literal acceptance separately from the aggregate gate. */
export function runLiteralAcceptance(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "FOCUSED");
  assertMutableFiles(root, allowedProductFiles, "literal acceptance");
  const literalAcceptance = requireSuccess("literal acceptance", runDirective(root, ["verify:ac", activeStoryPath], marker.sessionId));
  const evidence = {
    schema: "3ci.training.capstone.literal-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "PASS",
    literalAcceptance,
  };
  writeEvidence(root, "literal.json", evidence);
  updateMarker(root, { stage: "LITERAL" });
  return evidence;
}

/** Demonstrate that the aggregate reaches the missing review-evidence failure. */
export function runAggregateDiagnosis(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "LITERAL");
  assertMutableFiles(root, allowedProductFiles, "aggregate diagnosis");
  const aggregate = runTask(root, "check", [], marker.sessionId);
  const output = aggregate.stdout + aggregate.stderr;
  assert.notEqual(aggregate.exitCode, 0, "Stop: aggregate must expose the seeded review-evidence gap before closeout.");
  assert.match(output, /pre-PR review evidence is missing/, "Stop: aggregate did not reach the expected review-evidence failure.");
  const evidence = {
    schema: "3ci.training.capstone.aggregate-diagnosis-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "EXPECTED_FAILURE",
    firstFailingSubcheck: "review:evidence",
    output,
    aggregate,
  };
  writeEvidence(root, "aggregate-failure.json", evidence);
  updateMarker(root, { stage: "AGGREGATE_RED" });
  return evidence;
}

function duplicateProbe(root, marker) {
  return commandResult(process.execPath, [
    "src/cli.mjs",
    "add",
    "  review ONBOARDING  ",
    '[{"id":"WI-001","title":"Review onboarding","status":"open"}]',
  ], { cwd: root, env: isolatedEnv(root, marker.sessionId) });
}

/** Perform a zero-mutation review and classify the deterministic P1 finding. */
export function recordPrePrReview(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "AGGREGATE_RED");
  assertMutableFiles(root, allowedProductFiles, "pre-PR review");
  assert.equal(digest(read(safePath(root, sourcePath))), marker.greenSourceDigest, "Stop: source changed before the pre-PR review.");
  const before = git(root, ["diff", "HEAD", "--", ...allowedProductFiles]);
  const duplicate = duplicateProbe(root, marker);
  assert.equal(duplicate.exitCode, 0, "Stop: simulated P1 is already resolved; review must classify before editing.");
  const diffCheck = requireSuccess("pre-PR diff check", commandResult(findExecutable("git"), ["--no-optional-locks", "-C", root, "diff", "--check"], { cwd: root, env: isolatedEnv(root, marker.sessionId) }));
  const after = git(root, ["diff", "HEAD", "--", ...allowedProductFiles]);
  const findings = [{
    id: "CAP-P1-001",
    severity: "P1",
    surface: sourcePath,
    behavior: "addWorkItem accepts a title that duplicates an existing title after trimming and case folding",
    expected: "reject the duplicate without mutating the input collection",
  }];
  const evidence = {
    schema: "3ci.training.capstone.pre-pr-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "FINDING_RECORDED",
    findings,
    duplicate,
    diffCheck,
    diffDigestBefore: digest(before),
    diffDigestAfter: digest(after),
    diffUnchanged: before === after,
  };
  assert.equal(evidence.diffUnchanged, true, "Stop: pre-PR review changed the product diff.");
  writeEvidence(root, "pre-pr.json", evidence);
  updateMarker(root, { stage: "PREPR", prePrDiffDigest: evidence.diffDigestBefore });
  return evidence;
}

/** Verify the one-batch P1 fix and current-product re-review. */
export function verifyReviewResolution(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "PREPR");
  assertMutableFiles(root, allowedProductFiles, "review resolution");
  const sourceDigest = digest(read(safePath(root, sourcePath)));
  assert.notEqual(sourceDigest, marker.greenSourceDigest, "Stop: review resolution requires one scoped source change.");
  assert.equal(digest(read(safePath(root, testPath))), marker.redTestDigest, "Stop: supplied test changed during review resolution.");
  const duplicate = duplicateProbe(root, marker);
  assert.notEqual(duplicate.exitCode, 0, "Stop: duplicate-title P1 remains unresolved.");
  assert.match(duplicate.stdout + duplicate.stderr, /duplicates an existing work item/, "Stop: duplicate-title rejection is not observable.");
  const focused = requireSuccess("focused test after review fix", commandResult(process.execPath, ["--test", testPath], { cwd: root, env: isolatedEnv(root, marker.sessionId) }));
  const before = git(root, ["diff", "HEAD", "--", ...allowedProductFiles]);
  const diffCheck = requireSuccess("current product diff check", commandResult(findExecutable("git"), ["--no-optional-locks", "-C", root, "diff", "--check"], { cwd: root, env: isolatedEnv(root, marker.sessionId) }));
  const after = git(root, ["diff", "HEAD", "--", ...allowedProductFiles]);
  assert.equal(before, after, "Stop: current-head re-review changed the product diff.");
  const evidence = {
    schema: "3ci.training.capstone.review-resolution-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "PASS",
    findingsResolved: 1,
    currentHeadReview: "CLEAN",
    sourceDigest,
    duplicate,
    focused,
    diffCheck,
  };
  writeEvidence(root, "review-resolution.json", evidence);
  updateMarker(root, { stage: "REVIEWED", reviewedSourceDigest: sourceDigest });
  return evidence;
}

/** Run the repaired aggregate, checkpoint local work, and record precise state axes. */
export function closeAttempt(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "REVIEWED");
  assertMutableFiles(root, allowedProductFiles, "closeout");
  assert.equal(digest(read(safePath(root, sourcePath))), marker.reviewedSourceDigest, "Stop: source changed after current-product review.");
  const aggregate = requireSuccess("aggregate task check", runTask(root, "check", [], marker.sessionId));
  git(root, ["add", "--", ...allowedProductFiles]);
  git(root, ["-c", "user.name=3Ci Capstone Learner", "-c", "user.email=learner@example.invalid", "-c", "commit.gpgsign=false", "commit", "-m", "fix: complete fictional work-items behavior"]);
  assert.equal(git(root, ["status", "--porcelain", "--untracked-files=all"]).trim(), "", "Stop: closeout checkpoint is not clean.");
  const currentHeadGate = requireSuccess("aggregate task check on current head", runTask(root, "check", [], marker.sessionId));
  const evidence = {
    schema: "3ci.training.capstone.closeout-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "PASS",
    work: { status: "implemented", commit: git(root, ["rev-parse", "HEAD"]).trim() },
    ship: { status: "not_started", remote: "" },
    gate: { status: "local_pass", aggregate, currentHeadGate },
    deployment: { status: "not_started" },
    uat: { status: "not_started" },
    activeContract: activeStoryPath,
    proof_status: "n/a-no-remote-claim",
  };
  writeEvidence(root, "closeout.json", evidence);
  updateMarker(root, { stage: "COMPLETE", productCheckpoint: evidence.work.commit });
  guardAttempt(root);
  return evidence;
}

/** Create a unique fresh attempt while preserving the named failed attempt and evidence. */
export function resetAttempt(root = process.cwd()) {
  verifyAttemptIdentity(root);
  const launcher = mkdtempSync(join(realpathSync(tmpdir()), "3ci-capstone-launch-reset-"));
  return createAttempt({ callerRoot: launcher });
}

function assertNoUnexpectedRootLinks(root) {
  for (const entry of readdirSync(root)) {
    assert.ok(!lstatSync(join(root, entry)).isSymbolicLink(), `Stop: capstone root contains a symlink: ${entry}.`);
  }
}

/** Move one explicitly named guarded attempt and its evidence to a recoverable temp archive. */
export function archiveAttempt(root) {
  assert.equal(arguments.length, 1, archiveUsage);
  assert.ok(typeof root === "string" && isAbsolute(root) && resolve(root) === root, archiveUsage);
  verifyAttemptIdentity(root);
  assertNoUnexpectedRootLinks(root);
  const parent = dirname(root);
  const cwdFromParent = relative(parent, realpathSync(process.cwd()));
  assert.ok(isAbsolute(cwdFromParent) || cwdFromParent === ".." || cwdFromParent.startsWith(".." + sep), "Stop: caller and helper must leave the attempt parent before archive.");
  const temporaryRoot = dirname(parent);
  const archive = safePath(temporaryRoot, "3ci-directive-capstone-archive");
  if (!existsSync(archive)) mkdirSync(archive);
  const destination = safePath(archive, basename(parent));
  assert.ok(!existsSync(destination), "Stop: archive destination already exists.");
  renameSync(parent, destination);
  assert.ok(!existsSync(parent) && existsSync(join(destination, "repo")), "archive move did not complete");
  return destination;
}

/** Dispatch one documented capstone helper verb. */
export function main(args = process.argv.slice(2)) {
  const [verb, root] = args;
  if (verb === "create" && args.length === 1) return createAttempt();
  if (verb === "guard" && args.length === 2) return guardAttempt(root);
  if (verb === "install" && args.length === 2) return `OK: installed Directive ${verifyPin(installAttempt(root))}`;
  if (verb === "orient" && args.length === 2) return JSON.stringify(recordOrientation(root).finalStatus);
  if (verb === "activate" && args.length === 2) return JSON.stringify(activateScope(root).finalStatus);
  if (verb === "ready" && args.length === 2) return JSON.stringify(recordReadiness(root).finalStatus);
  if (verb === "red" && args.length === 2) return JSON.stringify(recordRed(root).finalStatus);
  if (verb === "green" && args.length === 2) return JSON.stringify(recordGreen(root).finalStatus);
  if (verb === "focused" && args.length === 2) return JSON.stringify(runFocusedChecks(root).finalStatus);
  if (verb === "literal" && args.length === 2) return JSON.stringify(runLiteralAcceptance(root).finalStatus);
  if (verb === "aggregate" && args.length === 2) return JSON.stringify(runAggregateDiagnosis(root).finalStatus);
  if (verb === "pre-pr" && args.length === 2) return JSON.stringify(recordPrePrReview(root).finalStatus);
  if (verb === "review" && args.length === 2) return JSON.stringify(verifyReviewResolution(root).finalStatus);
  if (verb === "close" && args.length === 2) return JSON.stringify(closeAttempt(root).finalStatus);
  if (verb === "reset" && args.length === 2) return resetAttempt(root);
  if (verb === "archive" && args.length === 2) return archiveAttempt(root);
  throw new Error("Use: create | guard <absolute-root> | install <absolute-root> | orient <absolute-root> | activate <absolute-root> | ready <absolute-root> | red <absolute-root> | green <absolute-root> | focused <absolute-root> | literal <absolute-root> | aggregate <absolute-root> | pre-pr <absolute-root> | review <absolute-root> | close <absolute-root> | reset <absolute-root> | archive <absolute-root>.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(main());
  } catch (error) {
    console.error("Capstone stopped: " + error.message);
    process.exitCode = 1;
  }
}
