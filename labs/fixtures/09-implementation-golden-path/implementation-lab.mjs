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
  readdirSync,
  realpathSync,
  renameSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { devNull, tmpdir } from "node:os";
import { basename, delimiter, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { assertNoGitRedirection, assertPlainTree, git, safePath } from "./safety.mjs";

const fixture = dirname(fileURLToPath(import.meta.url));
const read = (path) => readFileSync(path, "utf8");
const exactVersion = "0.112.0";
const storyFile = "fictional-greeting.xbrief.json";
const storyPath = `xbrief/active/${storyFile}`;
const allowedProductFiles = ["src/greeting.mjs"];
const archiveUsage = "Archive requires one explicit absolute canonical lab root. Run the original course helper from outside the attempt parent.";
const fixtureFiles = [
  "package.json",
  "implementation-lab.mjs",
  "safety.mjs",
  "src/cli.mjs",
  "src/greeting.mjs",
  "test/greeting.test.mjs",
];
const immutableFiles = fixtureFiles.filter((path) => !allowedProductFiles.includes(path));
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
    xBRIEFInfo: { version: "0.8", description: "Fictional Module 9 active greeting story" },
    plan: {
      id: "northstar.implementation.greeting",
      title: "Personalize the fictional greeting",
      status: "running",
      narratives: {
        Description: "Make the smallest coherent test-backed greeting change after current readiness passes.",
        UserStory: "As a Northstar teammate, I want a named greeting with a fallback so the CLI is friendly without requiring input.",
      },
      items: [
        {
          id: "northstar.implementation.greeting.behavior",
          title: "Return named and fallback greetings",
          status: "proposed",
          effort: "S",
          narrative: { Acceptance: "The focused test passes and the CLI prints Hello, Ada! or Hello, teammate!." },
        },
      ],
      acceptance: {
        commands: ["npm run test:focused", "git diff --check"],
        none_stated: false,
      },
      metadata: {
        kind: "story",
        file_scope: allowedProductFiles,
        intended_placement: {
          schema: "deft.scope.intended_placement.v1",
          files: allowedProductFiles,
          module_boundary: "One fictional greeting implementation file",
        },
      },
    },
  };
}

function verifyManifest(root) {
  const manifest = readJson(safePath(root, "package.json"));
  assert.equal(manifest.private, true, "fixture must remain private");
  assert.equal(manifest.devDependencies?.["@deftai/directive"], exactVersion, "exact 0.112.0 pin required");
  for (const name of ["directive-core", "directive-content", "directive-types"]) {
    assert.equal(manifest.overrides?.[`@deftai/${name}`], exactVersion, "exact 0.112.0 overrides required");
  }
}

function verifyActiveStory(root) {
  const activeRoot = safePath(root, "xbrief/active");
  const activeFiles = readdirSync(activeRoot).filter((name) => name.endsWith(".xbrief.json"));
  assert.deepEqual(activeFiles, [storyFile], "Stop: exactly one story must be active/running.");
  const active = readJson(safePath(root, storyPath));
  assert.equal(active.xBRIEFInfo?.version, "0.8", "Stop: active story must use xBRIEF 0.8.");
  assert.equal(active.plan?.status, "running", "Stop: story must be active/running.");
  assert.deepEqual(active.plan?.metadata?.file_scope, allowedProductFiles, "Stop: active story must allow only src/greeting.mjs.");
  return active;
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

/** Reject platforms without a learner-ready command path before installation mutates the attempt. */
export function assertLearnerReadyPlatform(platform = process.platform) {
  assert.notEqual(platform, "win32", "Native Windows/PowerShell is a candidate path and is not learner-ready in this release.");
}

function createIsolatedTools(root) {
  const directory = safePath(root, ".lab-tools");
  mkdirSync(directory, { recursive: true });
  const tools = new Map([
    ["node", realpathSync(process.execPath)],
    ["task", findExecutable("task")],
    ["npm", findExecutable("npm")],
    ["git", findExecutable("git")],
    ["uv", findExecutable("uv")],
  ]);
  try {
    tools.set("gh", findExecutable("gh"));
  } catch {
    // GitHub access is neither required nor used by this no-remote lab.
  }
  for (const [name, target] of tools) {
    const link = join(directory, name);
    if (!existsSync(link)) symlinkSync(target, link);
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

function isolatedEnv(root, sessionId = "") {
  return {
    ...withoutHostNpmConfig(),
    PATH: [join(root, "node_modules/.bin"), join(root, ".lab-tools"), "/usr/bin", "/bin"].join(delimiter),
    DEFT_SESSION_ID: sessionId,
    DEFT_SESSION_SLASH_VERB: "implement",
    NPM_CONFIG_USERCONFIG: join(root, ".npmrc"),
    NPM_CONFIG_GLOBALCONFIG: devNull,
    NPM_CONFIG_CACHE: join(root, ".npm-cache"),
    NPM_CONFIG_REGISTRY: "https://registry.npmjs.org/",
  };
}

function runTask(root, taskName, args = [], sessionId = "") {
  return commandResult(join(root, ".lab-tools", "task"), ["--silent", taskName, ...(args.length ? ["--", ...args] : [])], {
    cwd: root,
    env: isolatedEnv(root, sessionId),
    timeout: 120_000,
  });
}

/** Create one unique no-remote OS-temporary fixture. No package install occurs here. */
export function createAttempt() {
  assertNoGitRedirection();
  for (const path of ["PROJECT-DEFINITION.xbrief.json", ...fixtureFiles]) {
    assert.ok(existsSync(join(fixture, path)), "Run create from the original course fixture, not an edited attempt.");
  }
  const temporaryRoot = realpathSync(tmpdir());
  assert.equal(git(temporaryRoot, ["rev-parse", "--show-toplevel"], [0, 128]).trim(), "", "Stop: temporary parent is inside another Git repository.");
  const parent = mkdtempSync(join(temporaryRoot, "3ci-directive-lab09-"));
  const root = join(parent, "repo");
  for (const path of [
    "repo", "empty-template", "evidence", "repo/src", "repo/test", "repo/xbrief",
    "repo/xbrief/proposed", "repo/xbrief/pending", "repo/xbrief/active",
    "repo/xbrief/completed", "repo/xbrief/cancelled",
  ]) mkdirSync(join(parent, path), { recursive: true });
  for (const path of fixtureFiles) copyFileSync(join(fixture, path), safePath(root, path));
  copyFileSync(join(fixture, "PROJECT-DEFINITION.xbrief.json"), safePath(root, "xbrief/PROJECT-DEFINITION.xbrief.json"));
  writeFileSync(safePath(root, ".gitignore"), gitignore, { flag: "wx" });
  writeFileSync(safePath(root, ".gitattributes"), "*.json text eol=lf\n*.mjs text eol=lf\n", { flag: "wx" });
  writeFileSync(safePath(root, ".npmrc"), "registry=https://registry.npmjs.org/\naudit=false\nfund=false\nignore-scripts=true\n", { flag: "wx" });
  writeJson(safePath(root, storyPath), story(), { flag: "wx" });
  const immutableDigests = Object.fromEntries(immutableFiles.map((path) => [path, digest(read(join(fixture, path)))]));
  writeJson(join(parent, "lab-state.json"), {
    lab: "module-09",
    root,
    allowedProductFiles,
    immutableDigests,
    startingGreetingDigest: digest(read(join(fixture, "src/greeting.mjs"))),
    checkpoint: null,
  }, { flag: "wx" });
  writeFileSync(join(parent, "evidence", "README.md"), "# Module 9 retained evidence\n\nReadiness, expected failure, behavioral proof, and diff proof are written here.\n", { flag: "wx" });
  git(root, ["init", "--template=" + join(parent, "empty-template")]);
  git(root, ["switch", "-c", "training/module-09"]);
  guardAttempt(root);
  return root;
}

/** Verify only the immutable target identity needed for reset or recoverable archive. */
function verifyAttemptIdentity(input = process.cwd()) {
  assertNoGitRedirection();
  const root = resolve(input);
  const parent = dirname(root);
  const temporaryRoot = realpathSync(tmpdir());
  assert.ok(basename(root) === "repo" && /^3ci-directive-lab09-[A-Za-z0-9]{6}$/.test(basename(parent)) && dirname(parent) === temporaryRoot, "Stop: expected the unique OS temporary lab repo for Module 9.");
  assert.ok(!lstatSync(parent).isSymbolicLink() && !lstatSync(root).isSymbolicLink(), "Stop: lab root is a symlink.");
  assert.equal(realpathSync(root), root, "Stop: lab root is not canonical.");
  assert.equal(git(parent, ["rev-parse", "--show-toplevel"], [0, 128]).trim(), "", "Stop: temporary parent is inside another Git repository.");
  const marker = readJson(safePath(parent, "lab-state.json"));
  assert.ok(marker.lab === "module-09" && marker.root === root, "Stop: lab marker mismatch.");
  for (const path of [".git", ".git/config", ".git/index", ".git/hooks", ".git/objects", ".git/refs", ".git/HEAD", ".gitattributes", ".gitignore", ".npmrc", "package.json", "src", "test", "xbrief", "xbrief/PROJECT-DEFINITION.xbrief.json", storyPath]) safePath(root, path);
  assert.ok(lstatSync(join(root, ".git")).isDirectory(), "Stop: expected a local .git directory.");
  assertPlainTree(root, ".git");
  assert.equal(realpathSync(git(root, ["rev-parse", "--show-toplevel"]).trim()), root, "Stop: Git root differs from the lab.");
  assert.equal(git(root, ["branch", "--show-current"]).trim(), "training/module-09", "Stop: expected training/module-09.");
  assert.equal(git(root, ["remote"]).trim(), "", "Stop: lab must have no remote.");
  return { root, marker };
}

/** Verify canonical temp identity, immutable fixture content, exact pin, and the active one-file scope. */
export function guardAttempt(input = process.cwd()) {
  const { root, marker } = verifyAttemptIdentity(input);
  verifyManifest(root);
  for (const [path, expected] of Object.entries(marker.immutableDigests)) {
    assert.equal(digest(read(safePath(root, path))), expected, `Stop: only src/greeting.mjs may differ; ${path} changed.`);
  }
  verifyActiveStory(root);
  if (existsSync(join(root, "node_modules"))) verifyInstalledGraph(root);
  if (existsSync(join(root, ".deft/core/VERSION"))) assert.match(read(join(root, ".deft/core/VERSION")), /(?:ref|tag): 'v0\.112\.0'/, "Stop: Directive deposit must be 0.112.0.");
  return root;
}

function verifyInstalledGraph(root) {
  safePath(root, "node_modules");
  for (const name of ["directive", "directive-core", "directive-content", "directive-types"]) {
    const manifest = readJson(safePath(root, `node_modules/@deftai/${name}/package.json`));
    assert.equal(manifest.version, exactVersion, `${name} must resolve to 0.112.0`);
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

/** Install the exact release, deposit its Task surface, and create the clean named checkpoint. */
export function installAttempt(root = process.cwd(), platform = process.platform) {
  root = guardAttempt(root);
  assertLearnerReadyPlatform(platform);
  assert.ok(!existsSync(join(root, "node_modules")), "Stop: install requires a fresh attempt; use reset after any partial install.");
  const npm = findExecutable("npm");
  const install = commandResult(npm, ["install", "--userconfig", join(root, ".npmrc"), "--globalconfig", devNull, "--cache", join(root, ".npm-cache"), "--registry", "https://registry.npmjs.org/", "--ignore-scripts", "--no-audit", "--no-fund"], {
    cwd: root,
    env: withoutHostNpmConfig({
      NPM_CONFIG_USERCONFIG: join(root, ".npmrc"),
      NPM_CONFIG_GLOBALCONFIG: devNull,
      NPM_CONFIG_CACHE: join(root, ".npm-cache"),
      NPM_CONFIG_REGISTRY: "https://registry.npmjs.org/",
    }),
    timeout: 120_000,
  });
  requireSuccess("npm install", install);
  verifyInstalledGraph(root);
  const cli = join(root, "node_modules/.bin/directive");
  const init = commandResult(cli, ["init", "--yes", "--repo-root", root, "--json"], {
    cwd: root,
    env: withoutHostNpmConfig(),
    timeout: 120_000,
  });
  requireSuccess("directive init", init);
  assert.match(read(join(root, ".deft/core/VERSION")), /(?:ref|tag): 'v0\.112\.0'/, "installed content deposit must be 0.112.0");
  writeFileSync(join(root, ".deft/USER.md"), "# User Preferences\n\n## Personal\n\n**Name**: Address the user as: **Learner**\n\n## Defaults\n\n**Coverage**: >=90% test coverage\n");
  createIsolatedTools(root);
  const tracked = [
    ".gitattributes", ".gitignore", ".npmrc", "Taskfile.yml", "package.json", "package-lock.json",
    "implementation-lab.mjs", "safety.mjs", "src/cli.mjs", "src/greeting.mjs", "test/greeting.test.mjs",
    "xbrief/PROJECT-DEFINITION.xbrief.json", storyPath,
  ];
  git(root, ["add", "--", ...tracked]);
  git(root, ["-c", "user.name=3Ci Lab Learner", "-c", "user.email=learner@example.invalid", "-c", "commit.gpgsign=false", "commit", "-m", "chore: checkpoint fictional implementation lab"]);
  const markerPath = join(dirname(root), "lab-state.json");
  const marker = readJson(markerPath);
  marker.checkpoint = git(root, ["rev-parse", "HEAD"]).trim();
  writeJson(markerPath, marker);
  assert.equal(git(root, ["status", "--porcelain", "--untracked-files=all"]).trim(), "", "Stop: install did not produce a clean checkpoint.");
  guardAttempt(root);
  return root;
}

/** Prove clean current readiness and retain the expected focused-test failure before mutation. */
export function runReadiness(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  assert.ok(marker.checkpoint, "Stop: install the exact 0.112.0 graph and create the checkpoint first.");
  assert.equal(digest(read(safePath(root, "src/greeting.mjs"))), marker.startingGreetingDigest, "Stop: readiness requires the original greeting at the clean checkpoint.");
  assert.equal(git(root, ["status", "--porcelain", "--untracked-files=all"]).trim(), "", "Stop: readiness requires a clean checkpoint before product mutation.");
  const sessionId = randomUUID();
  const cli = join(root, "node_modules/.bin/directive");
  const steps = {};
  steps.sessionStart = requireSuccess("session start", runTask(root, "deft:session:start", [`--session-id=${sessionId}`], sessionId));
  steps.sessionRitual = requireSuccess("gated session ritual", runTask(root, "deft:verify:session-ritual", ["--tier=gated"], sessionId));
  steps.storyReady = requireSuccess("story ready", commandResult(cli, ["verify:story-ready", "--vbrief-path", storyPath, "--skip-routing"], {
    cwd: root,
    env: isolatedEnv(root, sessionId),
  }));
  steps.activePreflight = requireSuccess("active xBRIEF preflight", runTask(root, "deft:xbrief:preflight", [storyPath], sessionId));
  steps.focusedTest = commandResult(join(root, ".lab-tools/node"), ["--test", "test/greeting.test.mjs"], { cwd: root, env: isolatedEnv(root, sessionId) });
  assert.equal(steps.focusedTest.exitCode, 1, "Stop: supplied focused test must fail before implementation.");
  assert.match(steps.focusedTest.stdout + steps.focusedTest.stderr, /Hello, Ada!|name must be a string/, "Stop: focused failure does not describe the intended greeting behavior.");
  assert.equal(git(root, ["status", "--porcelain", "--untracked-files=all"]).trim(), "", "Stop: readiness checks changed tracked product state.");
  const evidence = {
    schema: "3ci.training.module09.readiness-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "READY",
    baseline: { package: "@deftai/directive", engine: exactVersion },
    checkpoint: marker.checkpoint,
    branch: "training/module-09",
    activeContract: storyPath,
    allowedProductFiles,
    remote: "",
    steps,
  };
  writeJson(join(dirname(root), "evidence", "readiness.json"), evidence);
  return evidence;
}

/** Verify the one-file implementation and retain behavioral plus diff evidence. */
export function verifyImplementation(root = process.cwd()) {
  root = guardAttempt(root);
  const { marker } = verifyAttemptIdentity(root);
  const readinessPath = join(dirname(root), "evidence", "readiness.json");
  assert.ok(existsSync(readinessPath), "Stop: readiness evidence is required before implementation.");
  const readiness = readJson(readinessPath);
  assert.ok(readiness.finalStatus === "READY" && readiness.checkpoint === marker.checkpoint, "Stop: valid readiness evidence is required before implementation.");
  const status = git(root, ["status", "--porcelain", "--untracked-files=all"]).replace(/\s+$/, "").split("\n").filter(Boolean);
  const statusFiles = status.map((line) => line.slice(3));
  assert.deepEqual(statusFiles, allowedProductFiles, "Stop: implementation may change only src/greeting.mjs.");
  const diffFiles = git(root, ["diff", "HEAD", "--name-only", "--"]).trim().split("\n").filter(Boolean);
  assert.deepEqual(diffFiles, allowedProductFiles, "Stop: diff evidence must contain only src/greeting.mjs.");
  const sessionId = randomUUID();
  const steps = {};
  steps.focusedTest = requireSuccess("focused test", commandResult(join(root, ".lab-tools/node"), ["--test", "test/greeting.test.mjs"], { cwd: root, env: isolatedEnv(root, sessionId) }));
  steps.namedCli = requireSuccess("named CLI", commandResult(join(root, ".lab-tools/node"), ["src/cli.mjs", "Ada"], { cwd: root, env: isolatedEnv(root, sessionId) }));
  assert.equal(steps.namedCli.stdout.trim(), "Hello, Ada!", "named greeting evidence is incorrect");
  steps.fallbackCli = requireSuccess("fallback CLI", commandResult(join(root, ".lab-tools/node"), ["src/cli.mjs"], { cwd: root, env: isolatedEnv(root, sessionId) }));
  assert.equal(steps.fallbackCli.stdout.trim(), "Hello, teammate!", "fallback greeting evidence is incorrect");
  steps.diffCheck = requireSuccess("git diff --check", commandResult(findExecutable("git"), ["--no-optional-locks", "-C", root, "diff", "--check"], { cwd: root, env: isolatedEnv(root, sessionId) }));
  const evidence = {
    schema: "3ci.training.module09.implementation-evidence.v1",
    generatedAt: new Date().toISOString(),
    finalStatus: "PASS",
    baseline: { package: "@deftai/directive", engine: exactVersion },
    readiness: { finalStatus: readiness.finalStatus, checkpoint: readiness.checkpoint },
    behavior: { named: steps.namedCli.stdout.trim(), fallback: steps.fallbackCli.stdout.trim() },
    diff: { files: diffFiles, status },
    steps,
  };
  writeJson(join(dirname(root), "evidence", "implementation.json"), evidence);
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
  if (verb === "readiness" && args.length === 2) return JSON.stringify(runReadiness(root).finalStatus);
  if (verb === "verify" && args.length === 2) return JSON.stringify(verifyImplementation(root).finalStatus);
  if (verb === "reset" && args.length === 2) return resetAttempt(root);
  if (verb === "archive" && args.length === 2) return archiveAttempt(root);
  throw new Error("Use: create | guard <absolute-root> | install <absolute-root> | readiness <absolute-root> | verify <absolute-root> | reset <absolute-root> | archive <absolute-root>.");
}

if (process.argv[1] && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) {
  try {
    console.log(main());
  } catch (error) {
    console.error("Lab 9 stopped: " + error.message);
    process.exitCode = 1;
  }
}
