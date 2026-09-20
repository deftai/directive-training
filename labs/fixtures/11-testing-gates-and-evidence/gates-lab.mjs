import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
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
const read = (path) => readFileSync(path, "utf8");
const exactVersion = "0.119.5";
const storyFile = "fictional-summary.xbrief.json";
const storyPath = `xbrief/active/${storyFile}`;
const testPath = "test/summary.test.mjs";
const sourcePath = "src/summary.mjs";
const qualityPath = "quality-record.json";
const allowedWorkFiles = [qualityPath, sourcePath, testPath];
const immutableGateFiles = [
  "Taskfile.yml",
  "gates-lab.mjs",
  "package.json",
  "safety.mjs",
  "scripts/verify-quality-record.mjs",
  "xbrief/PROJECT-DEFINITION.xbrief.json",
];
const fixtureFiles = [
  "Taskfile.yml",
  "gates-lab.mjs",
  "package.json",
  qualityPath,
  "safety.mjs",
  "scripts/verify-quality-record.mjs",
  sourcePath,
  testPath,
];
const archiveUsage = "Archive requires one explicit absolute canonical lab root. Run the original course helper from outside the attempt parent.";
const gitignore = [
  "/node_modules/", "/.npm-cache/", "/.lab-tools/", "/.deft/", "/.deft-cache/",
  "/.agents/", "/.claude/", "/.codex/", "/.cursor/", "/.grok/", "/.github/",
  "/.githooks/", "/AGENTS.md", "/greptile.json", "/.prettierignore",
  "/xbrief/.deft-version", "/xbrief/.triage-cache/", "/xbrief/schemas/",
].join("\n") + "\n";

function digest(text) {
  return createHash("sha256").update(text.replace(/\r\n/g, "\n")).digest("hex");
}

function writeJson(path, value, options = {}) {
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", options);
}

function readJson(path) {
  return JSON.parse(read(path));
}

function story() {
  return {
    xBRIEFInfo: { version: "0.8", description: "Fictional Module 11 active numeric-summary story" },
    plan: {
      id: "northstar.testing.summary-average",
      title: "Add average to the fictional numeric summary",
      status: "running",
      narratives: {
        Description: "Add average behavior through one observable red-green-refactor cycle, then diagnose the aggregate gate without weakening it.",
        UserStory: "As a Northstar teammate, I want count, total, and average so that a small numeric sample is useful at a glance.",
        QualityGate: "Run literal acceptance before the aggregate task check; repair quality-record.json, never a gate definition.",
      },
      items: [
        {
          id: "northstar.testing.summary-average.behavior",
          title: "Return average with count and total",
          status: "pending",
          effort: "S",
          narrative: { Acceptance: "The focused test and numeric-summary CLI pass for an ordinary sample and an empty sample." },
        },
      ],
      acceptance: {
        commands: ["npm run test:focused", "npm run check:behavior"],
        none_stated: false,
        source_rung: "derived",
      },
      metadata: {
        kind: "story",
        file_scope: allowedWorkFiles,
        intended_placement: {
          schema: "deft.scope.intended_placement.v1",
          files: allowedWorkFiles,
          module_boundary: "One focused test, one numeric summary source, and one governed quality record",
        },
      },
    },
  };
}

function verifyManifest(root) {
  const manifest = readJson(safePath(root, "package.json"));
  assert.equal(manifest.private, true, "fixture must remain private");
  assert.equal(manifest.devDependencies?.["@deftai/directive"], exactVersion, "exact 0.119.5 pin required");
  for (const name of ["directive-core", "directive-content", "directive-types"]) {
    assert.equal(manifest.overrides?.[`@deftai/${name}`], exactVersion, `exact 0.119.5 ${name} override required`);
  }
}

function verifyActiveStory(root, marker) {
  const activeRoot = safePath(root, "xbrief/active");
  const activeFiles = readdirSync(activeRoot).filter((name) => name.endsWith(".xbrief.json"));
  assert.deepEqual(activeFiles, [storyFile], "Stop: exactly one story must be active/running.");
  const active = readJson(safePath(root, storyPath));
  assert.equal(active.xBRIEFInfo?.version, "0.8", "Stop: active story must use xBRIEF 0.8.");
  assert.equal(active.plan?.status, "running", "Stop: story must be active/running.");
  assert.deepEqual(active.plan?.metadata?.file_scope, allowedWorkFiles, "Stop: active story file scope changed.");
  assert.equal(digest(JSON.stringify(active.plan.acceptance)), marker.acceptanceDigest, "Stop: literal acceptance gate definition changed.");
  return active;
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
  for (const [name, target] of new Map([
    ["node", realpathSync(process.execPath)],
    ["task", findExecutable("task")],
    ["npm", findExecutable("npm")],
    ["git", findExecutable("git")],
    ["python", findPythonExecutable()],
    ["uv", findExecutable("uv")],
  ])) {
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
    return !normalized.startsWith("npm_config_") && normalized !== "npm_token" &&
      normalized !== "node_auth_token" && normalized !== "node_test_context";
  }));
  return { ...environment, ...overrides };
}

function runNpm(root, args) {
  const npmCommand = findExecutable("npm");
  const candidates = [process.env.npm_execpath, join(dirname(npmCommand), "node_modules/npm/bin/npm-cli.js"), join(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js")];
  const npmCli = candidates.find((candidate) => candidate && existsSync(candidate));
  return commandResult(npmCli ? process.execPath : npmCommand, npmCli ? [npmCli, ...args] : args, {
    cwd: root,
    env: withoutHostNpmConfig({
      NPM_CONFIG_USERCONFIG: join(root, ".npmrc"),
      NPM_CONFIG_GLOBALCONFIG: devNull,
      NPM_CONFIG_CACHE: join(root, ".npm-cache"),
      NPM_CONFIG_REGISTRY: "https://registry.npmjs.org/",
    }),
    timeout: 180_000,
  });
}

function runDirective(root, args) {
  return commandResult(process.execPath, [join(root, "node_modules/@deftai/directive/dist/bin.js"), ...args], {
    cwd: root,
    env: isolatedEnv(root),
    timeout: 180_000,
  });
}

function isolatedEnv(root) {
  const systemTools = process.platform === "win32"
    ? [dirname(findExecutable("git")), dirname(findPythonExecutable()), dirname(process.env.ComSpec ?? join(process.env.SystemRoot ?? "C:\\Windows", "System32", "cmd.exe"))]
    : ["/usr/bin", "/bin"];
  return {
    ...withoutHostNpmConfig(),
    PATH: [join(root, "node_modules/.bin"), join(root, ".lab-tools"), ...systemTools].join(delimiter),
    DEFT_SESSION_ID: "module-11-lab-session",
    DEFT_SESSION_SLASH_VERB: "implement",
    NPM_CONFIG_USERCONFIG: join(root, ".npmrc"),
    NPM_CONFIG_GLOBALCONFIG: devNull,
    NPM_CONFIG_CACHE: join(root, ".npm-cache"),
    NPM_CONFIG_REGISTRY: "https://registry.npmjs.org/",
  };
}

function runTask(root, taskName) {
  return commandResult(findExecutable("task"), ["--silent", taskName], {
    cwd: root,
    env: isolatedEnv(root),
    timeout: 180_000,
  });
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

function verifyInstalledGraph(root) {
  safePath(root, "node_modules");
  for (const name of ["directive", "directive-core", "directive-content", "directive-types"]) {
    const manifest = readJson(safePath(root, `node_modules/@deftai/${name}/package.json`));
    assert.equal(manifest.version, exactVersion, `${name} must resolve to 0.119.5`);
  }
  const target = realpathSync(safePath(root, "node_modules/@deftai/directive/dist/bin.js"));
  if (process.platform !== "win32") {
    assert.equal(realpathSync(join(root, "node_modules/.bin/directive")), target, "local Directive launcher must resolve inside this attempt");
  }
}

function verifyGateDefinitions(root, marker) {
  for (const [path, expected] of Object.entries(marker.immutableDigests)) {
    assert.equal(digest(read(safePath(root, path))), expected, `Stop: gate definition changed: ${path}.`);
  }
  for (const [path, expected] of Object.entries(marker.generatedGateDigests ?? {})) {
    assert.equal(digest(read(safePath(root, path))), expected, `Stop: generated gate definition changed: ${path}.`);
  }
  verifyActiveStory(root, marker);
  return true;
}

/** Create one unique no-remote OS-temporary fixture. No package install occurs here. */
export function createAttempt() {
  assertNoGitRedirection();
  for (const path of ["PROJECT-DEFINITION.xbrief.json", ...fixtureFiles]) {
    assert.ok(existsSync(join(fixture, path)), "Run create from the original course fixture, not an edited attempt.");
  }
  const temporaryRoot = realpathSync(tmpdir());
  assert.equal(git(temporaryRoot, ["rev-parse", "--show-toplevel"], [0, 128]).trim(), "", "Stop: temporary parent is inside another Git repository.");
  const parent = mkdtempSync(join(temporaryRoot, "3ci-directive-lab11-"));
  const root = join(parent, "repo");
  for (const path of [
    "repo", "empty-template", "evidence", "repo/scripts", "repo/src", "repo/test", "repo/xbrief",
    "repo/xbrief/proposed", "repo/xbrief/pending", "repo/xbrief/active", "repo/xbrief/completed", "repo/xbrief/cancelled",
  ]) mkdirSync(join(parent, path), { recursive: true });
  for (const path of fixtureFiles) copyFileSync(join(fixture, path), safePath(root, path));
  copyFileSync(join(fixture, "PROJECT-DEFINITION.xbrief.json"), safePath(root, "xbrief/PROJECT-DEFINITION.xbrief.json"));
  writeFileSync(safePath(root, ".gitignore"), gitignore, { flag: "wx" });
  writeFileSync(safePath(root, ".gitattributes"), "*.json text eol=lf\n*.mjs text eol=lf\n*.yml text eol=lf\n", { flag: "wx" });
  writeFileSync(safePath(root, ".npmrc"), "registry=https://registry.npmjs.org/\naudit=false\nfund=false\nignore-scripts=true\n", { flag: "wx" });
  const activeStory = story();
  writeJson(safePath(root, storyPath), activeStory, { flag: "wx" });
  writeJson(join(parent, "lab-state.json"), {
    lab: "module-11",
    root,
    allowedWorkFiles,
    immutableDigests: Object.fromEntries(immutableGateFiles.map((path) => [path, digest(read(safePath(root, path)))])),
    generatedGateDigests: {},
    acceptanceDigest: digest(JSON.stringify(activeStory.plan.acceptance)),
    startingDigests: {
      [testPath]: digest(read(safePath(root, testPath))),
      [sourcePath]: digest(read(safePath(root, sourcePath))),
      [qualityPath]: digest(read(safePath(root, qualityPath))),
    },
    checkpoint: null,
    stage: "CREATED",
  }, { flag: "wx" });
  writeFileSync(join(parent, "evidence", "README.md"), "# Module 11 retained evidence\n\nRed, green, refactor, literal, aggregate-failure, and final evidence are written here.\n", { flag: "wx" });
  git(root, ["init", "--template=" + join(parent, "empty-template")]);
  git(root, ["switch", "-c", "training/module-11"]);
  guardAttempt(root);
  return root;
}

/** Verify only the immutable target identity needed for reset or recoverable archive. */
function verifyAttemptIdentity(input = process.cwd()) {
  assertNoGitRedirection();
  const root = resolve(input);
  const parent = dirname(root);
  const temporaryRoot = realpathSync(tmpdir());
  assert.ok(basename(root) === "repo" && /^3ci-directive-lab11-[A-Za-z0-9]{6}$/.test(basename(parent)) && dirname(parent) === temporaryRoot, "Stop: expected the unique OS temporary lab repo for Module 11.");
  assert.ok(!lstatSync(parent).isSymbolicLink() && !lstatSync(root).isSymbolicLink(), "Stop: lab root is a symlink.");
  assert.equal(realpathSync(root), root, "Stop: lab root is not canonical.");
  assert.equal(git(parent, ["rev-parse", "--show-toplevel"], [0, 128]).trim(), "", "Stop: temporary parent is inside another Git repository.");
  const marker = readJson(safePath(parent, "lab-state.json"));
  assert.ok(marker.lab === "module-11" && marker.root === root, "Stop: lab marker mismatch.");
  for (const path of [".git", ".git/config", ".git/index", ".git/hooks", ".git/objects", ".git/refs", ".git/HEAD", ".gitattributes", ".gitignore", ".npmrc", "Taskfile.yml", "package.json", "src", "test", "scripts", "xbrief", "xbrief/PROJECT-DEFINITION.xbrief.json", storyPath]) safePath(root, path);
  assert.ok(lstatSync(join(root, ".git")).isDirectory(), "Stop: expected a local .git directory.");
  assertPlainTree(root, ".git");
  const gitRoot = git(root, ["rev-parse", "--show-toplevel"]).trim();
  assert.ok(sameFileSystemEntry(root, gitRoot), "Stop: Git root differs from the lab.");
  assert.equal(git(root, ["branch", "--show-current"]).trim(), "training/module-11", "Stop: expected training/module-11.");
  assert.equal(git(root, ["remote"]).trim(), "", "Stop: lab must have no remote.");
  return { root, marker };
}

/** Verify canonical temp identity, immutable gates, exact pin, and the active work scope. */
export function guardAttempt(input = process.cwd()) {
  const { root, marker } = verifyAttemptIdentity(input);
  verifyManifest(root);
  verifyGateDefinitions(root, marker);
  if (existsSync(join(root, "node_modules"))) verifyInstalledGraph(root);
  if (existsSync(join(root, ".deft/core/VERSION"))) {
    assert.match(read(join(root, ".deft/core/VERSION")), /(?:ref|tag): 'v0\.119\.5'/, "Stop: Directive deposit must be 0.119.5.");
  }
  return root;
}

/** Verify the exact installed CLI/core/content/types graph. */
export function verifyPin(root = process.cwd()) {
  guardAttempt(root);
  verifyInstalledGraph(root);
  return exactVersion;
}

/** Install the exact release, deposit its Task surface, and create the clean checkpoint. */
export function installAttempt(root = process.cwd(), platform = process.platform) {
  root = guardAttempt(root);
  assertLearnerReadyPlatform(platform);
  const initial = verifyAttemptIdentity(root).marker;
  requireStage(initial, "CREATED");
  assert.ok(!existsSync(join(root, "node_modules")), "Stop: install requires a fresh attempt; use reset after a partial install.");
  const install = runNpm(root, ["install", "--userconfig", join(root, ".npmrc"), "--globalconfig", devNull, "--cache", join(root, ".npm-cache"), "--registry", "https://registry.npmjs.org/", "--ignore-scripts", "--no-audit", "--no-fund"]);
  requireSuccess("npm install", install);
  verifyInstalledGraph(root);
  createIsolatedTools(root);
  requireSuccess("directive init", commandResult(process.execPath, [join(root, "node_modules/@deftai/directive/dist/bin.js"), "init", "--yes", "--repo-root", root, "--json"], {
    cwd: root,
    env: isolatedEnv(root),
    timeout: 180_000,
  }));
  assert.match(read(join(root, ".deft/core/VERSION")), /(?:ref|tag): 'v0\.119\.5'/, "installed content deposit must be 0.119.5");
  copyFileSync(join(fixture, "Taskfile.yml"), safePath(root, "Taskfile.yml"));
  writeFileSync(join(root, ".deft/USER.md"), "# User Preferences\n\n## Personal\n\n**Name**: Address the user as: **Learner**\n\n## Defaults\n\n**Coverage**: >=90% test coverage\n");
  const tracked = [
    ".gitattributes", ".gitignore", ".npmrc", "Taskfile.yml", "package.json", "package-lock.json",
    "gates-lab.mjs", qualityPath, "safety.mjs", "scripts/verify-quality-record.mjs", sourcePath, testPath,
    "xbrief/PROJECT-DEFINITION.xbrief.json", storyPath,
  ];
  git(root, ["add", "--", ...tracked]);
  git(root, ["-c", "user.name=3Ci Lab Learner", "-c", "user.email=learner@example.invalid", "-c", "commit.gpgsign=false", "commit", "-m", "chore: checkpoint fictional testing gates lab"]);
  const generatedGatePaths = ["package-lock.json", ".deft/core/Taskfile.yml", ".deft/core/tasks/verify.yml"].filter((path) => existsSync(join(root, path)));
  const marker = updateMarker(root, {
    checkpoint: git(root, ["rev-parse", "HEAD"]).trim(),
    stage: "CHECKPOINT",
    generatedGateDigests: Object.fromEntries(generatedGatePaths.map((path) => [path, digest(read(safePath(root, path)))])),
  });
  assert.ok(marker.checkpoint, "Stop: checkpoint commit is missing.");
  assert.equal(git(root, ["status", "--porcelain", "--untracked-files=all"]).trim(), "", "Stop: install did not produce a clean checkpoint.");
  guardAttempt(root);
  return root;
}

/** Retain the intended focused-test failure and freeze the test at that checkpoint. */
export function recordRed(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "CHECKPOINT");
  assertMutableFiles(root, [testPath], "red");
  assert.equal(digest(read(safePath(root, sourcePath))), marker.startingDigests[sourcePath], "Stop: source changed before red evidence.");
  assert.equal(digest(read(safePath(root, qualityPath))), marker.startingDigests[qualityPath], "Stop: quality record changed before aggregate diagnosis.");
  const focused = commandResult(process.execPath, ["--test", testPath], { cwd: root, env: isolatedEnv(root) });
  assert.equal(focused.exitCode, 1, "Stop: the focused test must fail at the red checkpoint.");
  assert.match(focused.stdout + focused.stderr, /average/, "Stop: the red failure must describe the intended average behavior.");
  const evidence = {
    schema: "3ci.training.module11.red-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "EXPECTED_FAILURE",
    checkpoint: marker.checkpoint,
    changedFiles: mutableFiles(root),
    testDigest: digest(read(safePath(root, testPath))),
    focused,
  };
  writeEvidence(root, "red.json", evidence);
  updateMarker(root, { stage: "RED", redTestDigest: evidence.testDigest });
  return evidence;
}

/** Prove the narrow source implementation passes while the red test stays frozen. */
export function recordGreen(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "RED");
  assertMutableFiles(root, [sourcePath, testPath], "green");
  assert.equal(digest(read(safePath(root, testPath))), marker.redTestDigest, "Stop: focused test changed after the red checkpoint.");
  assert.notEqual(digest(read(safePath(root, sourcePath))), marker.startingDigests[sourcePath], "Stop: green requires a source implementation.");
  assert.equal(digest(read(safePath(root, qualityPath))), marker.startingDigests[qualityPath], "Stop: quality record changed before aggregate diagnosis.");
  const focused = requireSuccess("focused test", commandResult(process.execPath, ["--test", testPath], { cwd: root, env: isolatedEnv(root) }));
  const cli = requireSuccess("numeric summary CLI", commandResult(process.execPath, [sourcePath, "2", "4", "6"], { cwd: root, env: isolatedEnv(root) }));
  assert.deepEqual(JSON.parse(cli.stdout), { count: 3, total: 12, average: 4 }, "green CLI behavior is incorrect");
  const evidence = {
    schema: "3ci.training.module11.green-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "PASS",
    changedFiles: mutableFiles(root),
    testDigest: marker.redTestDigest,
    sourceDigest: digest(read(safePath(root, sourcePath))),
    focused,
    cli,
  };
  writeEvidence(root, "green.json", evidence);
  updateMarker(root, { stage: "GREEN", greenSourceDigest: evidence.sourceDigest });
  return evidence;
}

/** Prove behavior remains green after an observable source refactor. */
export function recordRefactor(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "GREEN");
  assertMutableFiles(root, [sourcePath, testPath], "refactor");
  assert.equal(digest(read(safePath(root, testPath))), marker.redTestDigest, "Stop: focused test changed after the red checkpoint.");
  const sourceDigest = digest(read(safePath(root, sourcePath)));
  assert.notEqual(sourceDigest, marker.greenSourceDigest, "Stop: refactor requires an observable source-only change after green.");
  const focused = requireSuccess("focused test after refactor", commandResult(process.execPath, ["--test", testPath], { cwd: root, env: isolatedEnv(root) }));
  const cli = requireSuccess("numeric summary CLI after refactor", commandResult(process.execPath, [sourcePath, "2", "4", "6"], { cwd: root, env: isolatedEnv(root) }));
  assert.deepEqual(JSON.parse(cli.stdout), { count: 3, total: 12, average: 4 }, "refactor changed CLI behavior");
  const evidence = {
    schema: "3ci.training.module11.refactor-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "PASS",
    changedFiles: mutableFiles(root),
    testDigest: marker.redTestDigest,
    sourceDigest,
    focused,
    cli,
  };
  writeEvidence(root, "refactor.json", evidence);
  updateMarker(root, { stage: "REFACTOR", refactorSourceDigest: sourceDigest });
  return evidence;
}

/** Run literal acceptance and forward coverage separately before the aggregate gate. */
export function runLiteralAcceptance(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "REFACTOR");
  assertMutableFiles(root, [sourcePath, testPath], "literal acceptance");
  assert.equal(digest(read(safePath(root, testPath))), marker.redTestDigest, "Stop: focused test changed after the red checkpoint.");
  assert.equal(digest(read(safePath(root, sourcePath))), marker.refactorSourceDigest, "Stop: source changed after refactor evidence.");
  const literalAcceptance = requireSuccess("literal acceptance", runDirective(root, ["verify:ac", storyPath]));
  const forwardCoverage = requireSuccess("forward coverage", runDirective(root, ["verify:forward-coverage", "--project-root", ".", "--head"]));
  const evidence = {
    schema: "3ci.training.module11.literal-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "PASS",
    literalAcceptance,
    forwardCoverage,
    gateDefinitionsUnchanged: verifyGateDefinitions(root, marker),
  };
  writeEvidence(root, "literal.json", evidence);
  updateMarker(root, { stage: "LITERAL" });
  return evidence;
}

/** Demonstrate that the aggregate reaches and rejects the seeded quality record. */
export function runAggregate(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "LITERAL");
  assertMutableFiles(root, [sourcePath, testPath], "aggregate failure");
  assert.equal(digest(read(safePath(root, qualityPath))), marker.startingDigests[qualityPath], "Stop: preserve the seeded quality record until its aggregate failure is observed.");
  const aggregate = runTask(root, "check");
  const output = aggregate.stdout + aggregate.stderr;
  assert.notEqual(aggregate.exitCode, 0, "Stop: the seeded aggregate gate must fail before repair.");
  assert.match(output, /quality record is incomplete/, "Stop: aggregate did not reach the seeded quality-record failure.");
  const evidence = {
    schema: "3ci.training.module11.aggregate-failure-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "EXPECTED_FAILURE",
    firstFailingSubcheck: "quality:record",
    output,
    aggregate,
    gateDefinitionsUnchanged: verifyGateDefinitions(root, marker),
  };
  writeEvidence(root, "aggregate-failure.json", evidence);
  updateMarker(root, { stage: "AGGREGATE_RED" });
  return evidence;
}

/** Verify that only the governed record repaired the aggregate failure. */
export function verifyFinal(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  requireStage(marker, "AGGREGATE_RED");
  assertMutableFiles(root, allowedWorkFiles, "final verification");
  assert.equal(digest(read(safePath(root, testPath))), marker.redTestDigest, "Stop: focused test changed after the red checkpoint.");
  assert.equal(digest(read(safePath(root, sourcePath))), marker.refactorSourceDigest, "Stop: source changed after refactor evidence.");
  assert.notEqual(digest(read(safePath(root, qualityPath))), marker.startingDigests[qualityPath], "Stop: final verification requires the bounded quality-record repair.");
  const aggregate = requireSuccess("aggregate task check", runTask(root, "check"));
  const evidence = {
    schema: "3ci.training.module11.final-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "PASS",
    changedFiles: mutableFiles(root),
    aggregate,
    gateDefinitionsUnchanged: verifyGateDefinitions(root, marker),
  };
  writeEvidence(root, "final.json", evidence);
  updateMarker(root, { stage: "COMPLETE" });
  return evidence;
}

/** Create a unique fresh attempt while preserving the named failed attempt and evidence. */
export function resetAttempt(root = process.cwd()) {
  verifyAttemptIdentity(root);
  return createAttempt();
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
  const archive = safePath(temporaryRoot, "3ci-directive-lab-archive");
  if (!existsSync(archive)) mkdirSync(archive);
  const destination = safePath(archive, basename(parent));
  assert.ok(!existsSync(destination), "Stop: archive destination already exists.");
  renameSync(parent, destination);
  assert.ok(!existsSync(parent) && existsSync(join(destination, "repo")), "archive move did not complete");
  return destination;
}

/** Dispatch one documented CLI verb. */
export function main(args = process.argv.slice(2)) {
  const [verb, root] = args;
  if (verb === "create" && args.length === 1) return createAttempt();
  if (verb === "guard" && args.length === 2) return guardAttempt(root);
  if (verb === "install" && args.length === 2) return `OK: installed Directive ${verifyPin(installAttempt(root))}`;
  if (verb === "red" && args.length === 2) return JSON.stringify(recordRed(root).finalStatus);
  if (verb === "green" && args.length === 2) return JSON.stringify(recordGreen(root).finalStatus);
  if (verb === "refactor" && args.length === 2) return JSON.stringify(recordRefactor(root).finalStatus);
  if (verb === "literal" && args.length === 2) return JSON.stringify(runLiteralAcceptance(root).finalStatus);
  if (verb === "aggregate" && args.length === 2) return JSON.stringify(runAggregate(root).finalStatus);
  if (verb === "final" && args.length === 2) return JSON.stringify(verifyFinal(root).finalStatus);
  if (verb === "reset" && args.length === 2) return resetAttempt(root);
  if (verb === "archive" && args.length === 2) return archiveAttempt(root);
  throw new Error("Use: create | guard <absolute-root> | install <absolute-root> | red <absolute-root> | green <absolute-root> | refactor <absolute-root> | literal <absolute-root> | aggregate <absolute-root> | final <absolute-root> | reset <absolute-root> | archive <absolute-root>.");
}

if (process.argv[1] && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) {
  try {
    console.log(main());
  } catch (error) {
    console.error("Lab 11 stopped: " + error.message);
    process.exitCode = 1;
  }
}
