import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  accessSync,
  constants,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { devNull, tmpdir } from "node:os";
import { basename, delimiter, dirname, isAbsolute, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const fixtureDirectory = dirname(fileURLToPath(import.meta.url));
const courseRoot = resolve(fixtureDirectory, "../../..");
const exactVersion = "0.119.9";
const labId = "module-02";
const labBranch = "training/module-02";
const parentPrefix = "3ci-directive-module-02.";
const archivePrefix = "3ci-directive-module-02-archive.";
const parentPattern = /^3ci-directive-module-02\.[A-Za-z0-9]{6}$/;
const archivePattern = /^3ci-directive-module-02-archive\.[A-Za-z0-9]{6}$/;
const attemptPattern = /^attempt-\d{2}\.[A-Za-z0-9]{6}$/;
const checkpointSubject = "checkpoint: initialize fictional Directive consumer";
const defaultChildTimeout = 180_000;
const childTimeoutCeiling = 600_000;
const gitignoreText = "node_modules/\n/.npm-cache/\n/USER.md\n/.deft/USER.md\n";
const npmrcText = "registry=https://registry.npmjs.org/\naudit=false\nfund=false\nignore-scripts=true\n";

// Three refusal classes, deliberately worded so a learner can tell them apart at a glance.
// Only a safety-boundary failure ever says "Stop:"; a missing paste and a missing project-local
// runtime are ordinary setup problems and must never read as the lab boundary tripping.
const rootArgumentRefusal =
  "Usage refusal: pass exactly one absolute attempt root -- the single path `create` printed. " +
  "Nothing was inspected and no boundary check ran, so this is a missing or relative paste, not a boundary stop.";
const helperUsage =
  "Usage refusal: use create | guard <absolute-root> | install <absolute-root> | diagnose <absolute-root> | " +
  "accept <absolute-root> | reset <absolute-root> | archive <absolute-root> | reclaim [--confirm <absolute-archive>...] | recovery-npmrc <absolute-root>.";
const reclaimConfirmationRefusal =
  "Stop: reclaim apply requires explicit confirmation. Run reclaim to preview exact archive paths, then pass --confirm followed by only those paths.";
const reclaimTargetRefusal =
  "Stop: reclaim accepts only exact absolute canonical Module 2 archive destinations printed by the current preview.";
const runtimeRefusal = (path) =>
  "Runtime refusal: the project-local binary is missing or not executable at " +
  path +
  ". Install it inside this attempt; a host-global binary is never a substitute. " +
  "This is an install problem, not a boundary stop.";

const requiredTrackedPaths = [
  "AGENTS.md",
  "Taskfile.yml",
  ".deft/GENERATION.json",
  ".githooks/pre-commit",
  ".npmrc",
  "xbrief/PROJECT-DEFINITION.xbrief.json",
];

const ignoredProbePaths = [
  ".deft/core/VERSION",
  ".deft/.cli/example",
  ".deft-cache/example",
  ".deft/ritual-state.json",
  "xbrief/.triage-cache/candidates.jsonl",
  ".npm-cache/example",
  "USER.md",
  "node_modules/example",
];

const trackableAllowlist = [
  /^\.agents\//,
  /^\.claude\//,
  /^\.codex\//,
  /^\.cursor\//,
  /^\.deft\/GENERATION\.json$/,
  /^\.deft\/approved-scope\//,
  /^\.gitattributes$/,
  /^\.githooks\//,
  /^\.github\//,
  /^\.gitignore$/,
  /^\.grok\//,
  /^\.npmrc$/,
  /^\.prettierignore$/,
  /^AGENTS\.md$/,
  /^Taskfile\.yml$/,
  /^greptile\.json$/,
  /^package\.json$/,
  /^package-lock\.json$/,
  /^xbrief\//,
];

const readText = (path) => readFileSync(path, "utf8");
const readJson = (path) => JSON.parse(readText(path));
const normalizeEol = (text) => text.split("\r\n").join("\n");
const digest = (text) => createHash("sha256").update(normalizeEol(text)).digest("hex");
// Windows hands back 8.3 short names (RUNNER~1) from the temp directory and long names from
// `git rev-parse`, so every path this helper compares is canonicalized natively first.
const canonicalPath = (value) => realpathSync.native(value);
const lines = (text) => text.split("\n").map((line) => line.trim()).filter(Boolean);

/**
 * The governing child environment: `env -i PATH="$PATH" HOME="$HOME"` on macOS and Linux, so an
 * nvm-class `node` and `npm` stay reachable while host variables such as DEFT_HOOKS_PREFER_GLOBAL,
 * GIT_DIR and npm credential carriers cannot cross into a lab child. Windows needs a few more
 * process-bootstrap names before any executable can start; the list stays closed either way.
 */
export function governingEnv() {
  const allowed = process.platform === "win32"
    ? ["PATH", "HOME", "USERPROFILE", "HOMEDRIVE", "HOMEPATH", "SystemRoot", "SystemDrive", "windir", "COMSPEC", "PATHEXT", "TEMP", "TMP"]
    : ["PATH", "HOME"];
  const environment = {};
  for (const key of allowed) {
    const value = process.env[key];
    if (typeof value === "string" && value.length > 0) environment[key] = value;
  }
  assert.ok(environment.PATH, "Stop: the caller supplied no PATH; run the helper from a normal shell.");
  return environment;
}

/** Strip npm credential and configuration carriers on top of the governing base, never instead of it. */
export function withoutHostNpmConfig(base, overrides = {}) {
  const stripped = Object.fromEntries(
    Object.entries(base).filter(([key]) => {
      const normalized = key.toLowerCase();
      return !normalized.startsWith("npm_config_") && normalized !== "npm_token" && normalized !== "node_auth_token";
    }),
  );
  return { ...stripped, ...overrides };
}

function isExecutableFile(path) {
  try {
    if (lstatSync(path).isDirectory()) return false;
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function resolveOnPath(name, pathValue) {
  const suffixes = process.platform === "win32"
    ? ["", ...(process.env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD").split(";").filter(Boolean)]
    : [""];
  for (const directory of pathValue.split(delimiter).filter(Boolean)) {
    for (const suffix of suffixes) {
      const candidate = join(directory, name + suffix);
      if (isExecutableFile(candidate)) return candidate;
    }
  }
  return null;
}

function requireOnPath(name) {
  const found = resolveOnPath(name, governingEnv().PATH);
  assert.ok(found, runtimeRefusal(name + " (not found on the caller PATH)"));
  return found;
}

/** The lab's O2.2 proof surface: the explicit project-local launcher, checked for execute permission. */
function requireLocalLauncher(root, name) {
  const launcher = join(root, "node_modules/.bin", name);
  assert.ok(isExecutableFile(launcher), runtimeRefusal(launcher));
  if (process.platform === "win32") {
    const windowsLauncher = launcher + ".cmd";
    assert.ok(isExecutableFile(windowsLauncher), runtimeRefusal(windowsLauncher));
  }
  return launcher;
}

/**
 * Hook-runtime children run `.githooks/`, which must reach this attempt's Deft runtime and no other.
 * The local `node_modules/.bin` is prepended to the governing PATH, and the helper refuses before the
 * spawn when that local `deft` is absent or not executable rather than falling through to a global one.
 */
function hookRuntimeEnv(root) {
  requireLocalLauncher(root, "deft");
  const base = withoutHostNpmConfig(governingEnv());
  const hookPath = join(root, "node_modules/.bin") + delimiter + base.PATH;
  const resolved = resolveOnPath("deft", hookPath);
  assert.ok(
    resolved && resolved.startsWith(join(root, "node_modules/.bin") + sep),
    "Stop: deft does not resolve inside the disposable repository (" + resolved + ").",
  );
  return { ...base, PATH: hookPath };
}

function runChild(command, args, options = {}) {
  // A caller may ask for a longer wait than the default, but never past the ceiling: the spread
  // must not be able to lift the resource cap.
  const { timeout = defaultChildTimeout, ...rest } = options;
  const result = spawnSync(command, args, { encoding: "utf8", ...rest, timeout: Math.min(timeout, childTimeoutCeiling) });
  if (result.error) throw result.error;
  assert.equal(result.signal, null, "Stop: " + basename(command) + " terminated by signal " + result.signal + ".");
  return { exitCode: result.status, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function requireSuccess(label, result) {
  assert.equal(result.exitCode, 0, "Stop: " + label + " failed (" + result.exitCode + "): " + result.stderr + result.stdout);
  return result;
}

function runGitResult(cwd, args, options = {}) {
  const environment = options.hookRuntime ? hookRuntimeEnv(options.root) : withoutHostNpmConfig(governingEnv());
  return runChild(requireOnPath("git"), ["--no-optional-locks", "-C", cwd, ...args], { cwd, env: environment, timeout: 60_000 });
}

function runGit(cwd, args, options = {}) {
  return requireSuccess("git " + args.join(" "), runGitResult(cwd, args, options)).stdout;
}

/** Resolve npm's own CLI script so no shell, `.cmd` shim, or PATHEXT quoting is involved. */
function npmCliScript() {
  const searchRoots = [dirname(process.execPath), resolve(dirname(process.execPath), "..")];
  const npmLauncher = resolveOnPath("npm", governingEnv().PATH);
  if (npmLauncher) searchRoots.push(dirname(npmLauncher), resolve(dirname(npmLauncher), ".."));
  for (const searchRoot of searchRoots) {
    for (const relativePath of ["node_modules/npm/bin/npm-cli.js", "lib/node_modules/npm/bin/npm-cli.js"]) {
      const candidate = join(searchRoot, relativePath);
      if (existsSync(candidate)) return canonicalPath(candidate);
    }
  }
  assert.fail(runtimeRefusal("npm-cli.js (no npm installation found next to the caller node)"));
}

/**
 * Lab 2 keeps its own `--userconfig` / `--globalconfig` / `--cache` isolation flags on the env -i
 * child, so the public-registry lab config is selected rather than the host `~/.npmrc`.
 */
function runNpm(root, args, options = {}) {
  return runChild(process.execPath, [npmCliScript(), ...args], {
    cwd: root,
    env: withoutHostNpmConfig(governingEnv()),
    timeout: 300_000,
    ...options,
  });
}

/**
 * The Directive CLI registers and live-probes the agent hook runtime, so it is a hook-runtime
 * child: it runs with the printed root's `node_modules/.bin` first on the governing PATH, which
 * is the same precedence the lab proves with `test -x` and never a host-global fallback.
 */
function runDirective(root, args, options = {}) {
  requireLocalLauncher(root, "directive");
  return runChild(process.execPath, [join(root, "node_modules/@deftai/directive/dist/bin.js"), ...args], {
    cwd: root,
    env: hookRuntimeEnv(root),
    ...options,
  });
}

function isInside(parent, candidate) {
  return candidate === parent || candidate.startsWith(parent + sep);
}

function assertNotInsideGitRepository(startDirectory) {
  let current = startDirectory;
  while (true) {
    assert.ok(!existsSync(join(current, ".git")), "Stop: temporary parent is inside another Git repository.");
    const next = dirname(current);
    if (next === current) return;
    current = next;
  }
}

/**
 * Refuse an empty or relative attempt root before any `resolve` or `join` touches it, so a missing
 * paste can never be mistaken for the safety boundary rejecting a real path.
 */
function requireAbsoluteRootArgument(value) {
  assert.ok(typeof value === "string" && value.trim().length > 0, rootArgumentRefusal);
  assert.ok(isAbsolute(value), rootArgumentRefusal);
  return value;
}

function canonicalRoot(value) {
  const supplied = requireAbsoluteRootArgument(value);
  const root = resolve(supplied);
  // A reshaped or stale paste (trailing separator, `..`, a path that is simply not there) is still
  // a paste problem: nothing has been inspected yet, so it must not read as a boundary stop.
  assert.equal(root, supplied, rootArgumentRefusal);
  assert.ok(existsSync(root), rootArgumentRefusal);
  assert.equal(canonicalPath(root), root, "Stop: the attempt root resolves through a link.");
  return root;
}

function verifyManifestPin(root) {
  const manifest = readJson(join(root, "package.json"));
  assert.equal(manifest.private, true, "Stop: the fictional fixture must stay private.");
  assert.equal(manifest.devDependencies?.["@deftai/directive"], exactVersion, "Stop: the fixture must pin @deftai/directive " + exactVersion + ".");
  for (const name of ["@deftai/directive-content", "@deftai/directive-core", "@deftai/directive-types"]) {
    assert.equal(manifest.overrides?.[name], exactVersion, "Stop: the fixture must pin " + name + " " + exactVersion + ".");
  }
}

function verifyInstalledGraph(root) {
  for (const name of ["directive", "directive-content", "directive-core", "directive-types"]) {
    const manifest = readJson(join(root, "node_modules/@deftai/" + name + "/package.json"));
    assert.equal(manifest.version, exactVersion, "Stop: @deftai/" + name + " must resolve to " + exactVersion + ".");
  }
  requireLocalLauncher(root, "directive");
  requireLocalLauncher(root, "deft");
}

/** Create one unique no-remote temporary attempt and print the single absolute root every later fence uses. */
export function createAttempt() {
  const temporaryRoot = canonicalPath(tmpdir());
  assertNotInsideGitRepository(temporaryRoot);
  const parent = canonicalPath(mkdtempSync(join(temporaryRoot, parentPrefix)));
  writeFileSync(join(parent, "evidence.md"), "# Module 2 retained evidence\n\nWrite the chooser, anatomy table, and five-field recovery decision here.\n", { flag: "wx" });
  return seedAttempt(parent, "attempt-01.");
}

/**
 * Seed one attempt directory under an existing guarded parent. The marker records only what a later
 * fence must re-derive. Caller PATH and npm user configuration are deliberately absent: nothing about
 * the creating shell may be replayed into a later attempt.
 */
function seedAttempt(parent, attemptPrefix, { beforeGitInit } = {}) {
  assert.ok(beforeGitInit === undefined || typeof beforeGitInit === "function", "Stop: invalid attempt-seeding callback.");
  const fixture = join(fixtureDirectory, "package.json");
  assert.ok(existsSync(fixture), "Stop: run create from the original course fixture, not from an edited attempt.");
  const root = canonicalPath(mkdtempSync(join(parent, attemptPrefix)));
  const markerPath = join(parent, "lab-state.json");
  try {
    copyFileSync(fixture, join(root, "package.json"));
    writeFileSync(join(root, ".gitignore"), gitignoreText, { flag: "wx" });
    writeFileSync(join(root, ".npmrc"), npmrcText, { flag: "wx" });
    beforeGitInit?.(root);
    runGit(root, ["init", "--initial-branch=main"]);
    runGit(root, ["switch", "-c", labBranch]);
    verifyAttemptRepository(root);
    writeLabMarker(markerPath, root, fixture);
    return root;
  } catch (error) {
    try {
      rollbackIncompleteSeed(root, parent);
    } catch (rollbackError) {
      throw new AggregateError(
        [error, rollbackError],
        "Stop: reset rollback could not remove the incomplete attempt at " + root + ". Do not archive the parent until approved cleanup removes that exact path.",
      );
    }
    throw error;
  }
}

function rollbackIncompleteSeed(root, parent) {
  assert.equal(dirname(root), parent, "Stop: reset rollback escaped the guarded Module 2 parent.");
  assert.ok(attemptPattern.test(basename(root)), "Stop: reset rollback received an invalid attempt identity.");
  assert.ok(existsSync(root), "Stop: reset rollback could not find its incomplete attempt.");
  assert.ok(lstatSync(root).isDirectory() && !lstatSync(root).isSymbolicLink(), "Stop: reset rollback refuses a linked attempt.");
  assert.equal(canonicalPath(root), root, "Stop: reset rollback refuses a reshaped attempt path.");
  rmSync(root, { force: true, recursive: true });
  assert.equal(existsSync(root), false, "Stop: reset rollback did not remove its incomplete attempt.");
}

function writeFileAtomically(path, text) {
  const candidate = path + "." + randomUUID() + ".tmp";
  try {
    writeFileSync(candidate, text, { flag: "wx" });
    renameSync(candidate, path);
  } finally {
    if (existsSync(candidate)) unlinkSync(candidate);
  }
}

function writeLabMarker(markerPath, root, fixture) {
  writeFileAtomically(
    markerPath,
    JSON.stringify({ schema: "3ci.training.module02.lab-state.v1", lab: labId, root, fixtureDigest: digest(readText(fixture)) }, null, 2) + "\n",
  );
}

function readPlainMarker(parent) {
  const markerPath = join(parent, "lab-state.json");
  assert.ok(existsSync(markerPath), "Stop: the Module 2 lab marker is missing.");
  const markerStat = lstatSync(markerPath);
  assert.ok(markerStat.isFile() && !markerStat.isSymbolicLink(), "Stop: the Module 2 lab marker must be a plain file.");
  return readJson(markerPath);
}

function verifyPlainEvidence(parent) {
  const evidencePath = join(parent, "evidence.md");
  assert.ok(existsSync(evidencePath), "Stop: the Module 2 evidence note is missing.");
  const evidenceStat = lstatSync(evidencePath);
  assert.ok(evidenceStat.isFile() && !evidenceStat.isSymbolicLink(), "Stop: the Module 2 evidence note must be a plain file.");
  return evidencePath;
}

/** Verify the plain no-remote repository identity without consulting the parent's current marker. */
function verifyAttemptRepository(input) {
  const root = canonicalRoot(input);
  const parent = dirname(root);
  const temporaryRoot = canonicalPath(tmpdir());
  assert.ok(attemptPattern.test(basename(root)), "Stop: unsafe lab root: " + root + ".");
  assert.ok(
    parentPattern.test(basename(parent)) && dirname(parent) === temporaryRoot,
    "Stop: unsafe lab parent: " + parent + ".",
  );
  assert.ok(!lstatSync(parent).isSymbolicLink() && !lstatSync(root).isSymbolicLink(), "Stop: the lab parent or lab root is a symlink.");
  assert.ok(!isInside(courseRoot, root), "Stop: the lab is inside the curriculum clone.");
  assertNotInsideGitRepository(parent);
  assert.ok(existsSync(join(root, ".git")) && lstatSync(join(root, ".git")).isDirectory(), "Stop: .git is missing.");
  assert.equal(
    canonicalPath(runGit(root, ["rev-parse", "--show-toplevel"]).trim()),
    root,
    "Stop: Git root differs from the recorded lab root.",
  );
  assert.equal(runGit(root, ["remote"]).trim(), "", "Stop: the disposable repository has a Git remote.");
  assert.equal(runGit(root, ["branch", "--show-current"]).trim(), labBranch, "Stop: expected " + labBranch + ".");
  return { root, parent };
}

/** Verify only the immutable identity a reset or recoverable archive needs, without the pin or fixture digest. */
function verifyAttemptIdentity(input) {
  const { root, parent } = verifyAttemptRepository(input);
  const marker = readPlainMarker(parent);
  assert.ok(marker.lab === labId, "Stop: lab marker mismatch.");
  return { root, parent, marker };
}

/** Re-derive the whole boundary from disk: canonical temporary root, marker, no remote, lab branch, exact pin. */
export function guardAttempt(input) {
  const { root, marker } = verifyAttemptIdentity(input);
  assert.equal(marker.root, root, "Stop: lab marker mismatch.");
  assert.equal(digest(readText(join(root, "package.json"))), marker.fixtureDigest, "Stop: the attempt fixture differs from the supplied course fixture.");
  verifyManifestPin(root);
  return root;
}

/** Create the next attempt beside the preserved failed one, inside the same guarded parent. */
export function resetAttempt(input, seedOptions) {
  if (
    typeof input === "string" && isAbsolute(input) && resolve(input) === input &&
    basename(input) === "lab-parent" && archivePattern.test(basename(dirname(input)))
  ) {
    verifyArchivedModule02(dirname(input), canonicalPath(tmpdir()));
    return createAttempt();
  }
  const { parent } = verifyAttemptIdentity(input);
  const used = readdirSync(parent, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && attemptPattern.test(entry.name))
    .map((entry) => Number.parseInt(entry.name.slice("attempt-".length, "attempt-".length + 2), 10));
  const next = Math.max(0, ...used) + 1;
  assert.ok(next <= 99, "Stop: this guarded parent already holds 99 attempts; create a new parent.");
  return seedAttempt(parent, "attempt-" + String(next).padStart(2, "0") + ".", seedOptions);
}

/** Install the exact pin, prove the project-local launchers, initialize, inspect staging, and commit. */
export function installAttempt(input) {
  const root = guardAttempt(input);
  const parent = dirname(root);
  assert.ok(!existsSync(join(root, "node_modules")), "Stop: install needs a fresh attempt; create a new attempt after any partial install.");
  requireSuccess(
    "npm install",
    runNpm(root, [
      "install",
      "--userconfig", join(root, ".npmrc"),
      "--globalconfig", devNull,
      "--cache", join(root, ".npm-cache"),
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
    ]),
  );
  guardAttempt(root);
  verifyInstalledGraph(root);

  const version = requireSuccess("directive --version", runDirective(root, ["--version"]));
  assert.ok(version.stdout.includes("@deftai/directive-core@" + exactVersion), "Stop: wrong Directive version: " + version.stdout);
  assert.ok(version.stdout.includes("@deftai/directive@" + exactVersion), "Stop: wrong Directive package identity: " + version.stdout);
  for (const help of [["--help"], ["commands"], ["init", "--help"], ["update", "--help"], ["doctor", "--help"]]) {
    requireSuccess("directive " + help.join(" "), runDirective(root, help));
  }
  const toolchainHelp = runDirective(root, ["toolchain:check", "--help"]);
  assert.equal(toolchainHelp.exitCode, 2, "Stop: expected the known toolchain help exit 2; got " + toolchainHelp.exitCode + ".");
  const toolchainHelpText = toolchainHelp.stdout + toolchainHelp.stderr;
  assert.ok(toolchainHelpText.includes("unrecognized argument: --help"), "Stop: the expected " + exactVersion + " toolchain help diagnostic is missing.");
  writeFileSync(join(parent, "toolchain-help.txt"), toolchainHelpText);

  guardAttempt(root);
  requireSuccess("directive init", runDirective(root, ["init", "--yes", "--repo-root", "."]));
  guardAttempt(root);

  for (const relativePath of requiredTrackedPaths) {
    assert.ok(existsSync(join(root, relativePath)), "Stop: required initialized path is missing: " + relativePath + ".");
  }
  const generation = readJson(join(root, ".deft/GENERATION.json"));
  assert.equal(generation.contentVersion, exactVersion, "Stop: the deposit content version must be " + exactVersion + ".");
  assert.equal(generation.surfaces?.payload, exactVersion, "Stop: the deposit payload surface must be " + exactVersion + ".");
  assert.equal(readJson(join(root, "xbrief/PROJECT-DEFINITION.xbrief.json")).xBRIEFInfo?.version, "0.8", "Stop: the project definition must use xBRIEF schema 0.8.");
  assert.equal(runGit(root, ["config", "--get", "core.hooksPath"]).trim(), ".githooks", "Stop: unexpected Git hooks path.");
  for (const relativePath of ignoredProbePaths) {
    assert.equal(
      runGitResult(root, ["check-ignore", "-q", "--", relativePath]).exitCode,
      0,
      "Stop: expected an ignored path: " + relativePath + ".",
    );
  }

  const trackable = [...new Set([
    ...lines(runGit(root, ["diff", "--cached", "--name-only"])),
    ...lines(runGit(root, ["ls-files", "--others", "--exclude-standard"])),
  ])].sort();
  assert.ok(trackable.length > 0, "Stop: no trackable files found.");
  for (const relativePath of trackable) {
    assert.ok(
      trackableAllowlist.some((pattern) => pattern.test(relativePath)),
      "Stop: unexpected trackable path: " + relativePath + ". Preserve this attempt and reconcile it with the pinned baseline.",
    );
  }
  const trackableFile = join(parent, "trackable-files.txt");
  writeFileSync(trackableFile, trackable.join("\n") + "\n");
  runGit(root, ["add", "--pathspec-from-file=" + trackableFile]);
  for (const relativePath of requiredTrackedPaths) {
    assert.equal(
      runGitResult(root, ["ls-files", "--error-unmatch", "--", relativePath]).exitCode,
      0,
      "Stop: required initialized path is not staged: " + relativePath + ".",
    );
  }
  runGit(root, ["config", "user.name", "Northstar Training Learner"]);
  runGit(root, ["config", "user.email", "learner@northstar.invalid"]);
  // The fictional checkpoint must not depend on the learner's global signing setup; the installed
  // pre-commit hook still runs, which is the part this lab is teaching.
  runGit(root, ["-c", "commit.gpgsign=false", "commit", "-m", checkpointSubject], { hookRuntime: true, root });
  const commit = runGit(root, ["rev-parse", "HEAD"]).trim();
  assert.equal(runGit(root, ["log", "-1", "--format=%s"]).trim(), checkpointSubject, "Stop: the checkpoint subject is not exact.");
  guardAttempt(root);
  return { root, commit, trackable, toolchainHelpExit: toolchainHelp.exitCode };
}

/** Capture the two taught diagnostics and their exits without leaving the attempt boundary. */
export function diagnoseAttempt(input) {
  const root = guardAttempt(input);
  const parent = dirname(root);
  const doctor = runDirective(root, ["doctor", "--full", "--project-root", "."]);
  writeFileSync(join(parent, "doctor-full.txt"), doctor.stdout + doctor.stderr);
  const toolchain = runDirective(root, ["toolchain:check", "--consumer", "--project-root", "."]);
  writeFileSync(join(parent, "toolchain-consumer.txt"), toolchain.stdout + toolchain.stderr);
  guardAttempt(root);
  assert.equal(doctor.exitCode, 0, "Stop: doctor exited " + doctor.exitCode + "; keep the recorded exits and use recovery.");
  assert.equal(toolchain.exitCode, 0, "Stop: the consumer toolchain check exited " + toolchain.exitCode + "; keep the recorded exits and use recovery.");
  return { doctorExit: doctor.exitCode, toolchainExit: toolchain.exitCode, doctorReport: join(parent, "doctor-full.txt") };
}

/** Run the literal acceptance sequence against the recorded root and return PASS or throw. */
export function acceptAttempt(input) {
  const root = guardAttempt(input);
  verifyInstalledGraph(root);
  hookRuntimeEnv(root);
  assert.equal(runGit(root, ["config", "--get", "core.hooksPath"]).trim(), ".githooks", "Stop: unexpected Git hooks path.");
  const version = requireSuccess("directive --version", runDirective(root, ["--version"]));
  assert.ok(version.stdout.includes("@deftai/directive-core@" + exactVersion), "Stop: wrong Directive version: " + version.stdout);
  assert.ok(version.stdout.includes("@deftai/directive@" + exactVersion), "Stop: wrong Directive package identity: " + version.stdout);
  requireSuccess("doctor --full", runDirective(root, ["doctor", "--full", "--project-root", "."]));
  requireSuccess("toolchain:check --consumer", runDirective(root, ["toolchain:check", "--consumer", "--project-root", "."]));
  assert.equal(runGitResult(root, ["diff", "--quiet"]).exitCode, 0, "Stop: unstaged tracked changes remain.");
  assert.equal(runGitResult(root, ["diff", "--cached", "--quiet"]).exitCode, 0, "Stop: staged changes remain.");
  assert.equal(runGit(root, ["status", "--porcelain", "--untracked-files=all"]).trim(), "", "Stop: tracked or untracked changes remain.");
  assert.equal(runGitResult(root, ["check-ignore", "-q", "--", ".deft/core/VERSION"]).exitCode, 0, "Stop: the core deposit is not ignored.");
  assert.equal(runGit(root, ["branch", "--show-current"]).trim(), labBranch, "Stop: wrong lab branch.");
  assert.equal(runGit(root, ["remote"]).trim(), "", "Stop: the disposable repository has a Git remote.");
  return "PASS";
}

/** Move the exact lab parent into a new temporary archive and verify every archived attempt. */
export function archiveAttempt(input) {
  const { parent, marker } = verifyAttemptIdentity(input);
  const temporaryRoot = dirname(parent);
  assert.ok(!isInside(parent, canonicalPath(process.cwd())), "Stop: run archive from outside the attempt parent.");
  verifyPlainEvidence(parent);
  const attemptRoots = readdirSync(parent, { withFileTypes: true })
    .filter((entry) => attemptPattern.test(entry.name))
    .map((entry) => {
      assert.ok(entry.isDirectory() && !entry.isSymbolicLink(), "Stop: the Module 2 parent contains an invalid attempt entry: " + entry.name + ".");
      return verifyAttemptRepository(join(parent, entry.name)).root;
    });
  assert.ok(attemptRoots.length >= 1 && attemptRoots.includes(marker.root), "Stop: the Module 2 parent marker does not name a valid attempt.");
  const archiveRoot = canonicalPath(mkdtempSync(join(temporaryRoot, archivePrefix)));
  const archiveTarget = join(archiveRoot, "lab-parent");
  assert.ok(!existsSync(archiveTarget), "Stop: archive destination already exists.");
  renameSync(parent, archiveTarget);
  assert.ok(!existsSync(parent) && existsSync(archiveTarget), "Stop: the archive move did not complete.");
  verifyArchivedModule02(archiveRoot, temporaryRoot);
  return archiveTarget;
}

function canonicalReclaimRoot(input) {
  assert.ok(typeof input === "string" && isAbsolute(input) && resolve(input) === input, reclaimTargetRefusal);
  assert.ok(existsSync(input), reclaimTargetRefusal);
  assert.ok(!lstatSync(input).isSymbolicLink(), "Stop: reclaim archive path is a symlink: " + input + ".");
  assert.ok(lstatSync(input).isDirectory(), reclaimTargetRefusal);
  const canonical = canonicalPath(input);
  assert.equal(canonical, input, reclaimTargetRefusal);
  return canonical;
}

function verifyArchivedModule02(archiveRoot, temporaryRoot) {
  assert.ok(
    dirname(archiveRoot) === temporaryRoot && archivePattern.test(basename(archiveRoot)),
    reclaimTargetRefusal,
  );
  canonicalReclaimRoot(archiveRoot);
  const entries = readdirSync(archiveRoot, { withFileTypes: true });
  assert.deepEqual(entries.map((entry) => entry.name), ["lab-parent"], "Stop: Module 2 archive identity mismatch.");
  assert.ok(entries[0].isDirectory() && !entries[0].isSymbolicLink(), "Stop: Module 2 archived parent is a symlink.");
  const archivedParent = canonicalReclaimRoot(join(archiveRoot, "lab-parent"));
  const marker = readPlainMarker(archivedParent);
  assert.equal(marker.lab, labId, "Stop: Module 2 archive marker mismatch.");
  assert.ok(typeof marker.root === "string" && isAbsolute(marker.root) && resolve(marker.root) === marker.root, "Stop: Module 2 archive marker mismatch.");
  const originalParent = dirname(marker.root);
  assert.ok(
    dirname(originalParent) === temporaryRoot && parentPattern.test(basename(originalParent)) && attemptPattern.test(basename(marker.root)),
    "Stop: Module 2 archive marker mismatch.",
  );
  assert.equal(marker.root, join(originalParent, basename(marker.root)), "Stop: Module 2 archive marker mismatch.");
  assert.ok(existsSync(join(archivedParent, basename(marker.root))), "Stop: Module 2 archive marker root is not present in the archive.");
  assert.equal(basename(archivedParent), "lab-parent", "Stop: Module 2 archive identity mismatch.");
  let attemptCount = 0;
  for (const entry of readdirSync(archivedParent, { withFileTypes: true })) {
    if (!attemptPattern.test(entry.name)) continue;
    assert.ok(entry.isDirectory() && !entry.isSymbolicLink(), "Stop: Module 2 archived attempt is a symlink.");
    const archivedAttempt = canonicalReclaimRoot(join(archivedParent, entry.name));
    const gitDirectory = join(archivedAttempt, ".git");
    assert.ok(existsSync(gitDirectory) && lstatSync(gitDirectory).isDirectory() && !lstatSync(gitDirectory).isSymbolicLink(), "Stop: Module 2 archived attempt lacks a plain .git directory.");
    assert.equal(canonicalPath(runGit(archivedAttempt, ["rev-parse", "--show-toplevel"]).trim()), archivedAttempt, "Stop: archived Git root differs from the attempt path.");
    assert.equal(runGit(archivedAttempt, ["remote"]).trim(), "", "Stop: archived attempt has a remote: " + archivedAttempt + ".");
    assert.equal(runGit(archivedAttempt, ["branch", "--show-current"]).trim(), labBranch, "Stop: archived Module 2 attempt is on the wrong branch.");
    attemptCount += 1;
  }
  verifyPlainEvidence(archivedParent);
  assert.ok(attemptCount >= 1, "Stop: Module 2 archive identity mismatch.");
  return archiveRoot;
}

/** List exact existing Module 2 archive roots without creating any directory. */
export function previewReclaim(temporaryRoot = canonicalPath(tmpdir())) {
  temporaryRoot = canonicalReclaimRoot(temporaryRoot);
  return readdirSync(temporaryRoot, { withFileTypes: true })
    .filter((entry) => entry.name.startsWith(archivePrefix))
    .flatMap((entry) => {
      if (!entry.isDirectory() || entry.isSymbolicLink()) return [];
      try {
        return [verifyArchivedModule02(join(temporaryRoot, entry.name), temporaryRoot)];
      } catch {
        return [];
      }
    })
    .sort();
}

/** Delete only exact previewed Module 2 archives after an explicit confirmation token. */
export function reclaimArchives(targets, { confirmed = false, temporaryRoot = canonicalPath(tmpdir()) } = {}) {
  assert.equal(confirmed, true, reclaimConfirmationRefusal);
  assert.ok(Array.isArray(targets) && targets.length > 0 && new Set(targets).size === targets.length, reclaimTargetRefusal);
  temporaryRoot = canonicalReclaimRoot(temporaryRoot);
  const previewed = new Set(previewReclaim(temporaryRoot));
  for (const target of targets) {
    assert.ok(typeof target === "string" && isAbsolute(target) && resolve(target) === target && previewed.has(target), reclaimTargetRefusal);
  }
  for (const target of targets) {
    verifyArchivedModule02(target, temporaryRoot);
    rmSync(target, { recursive: true });
    assert.equal(existsSync(target), false, "Stop: reclaim did not remove the confirmed Module 2 archive: " + target + ".");
  }
  return [...targets];
}

/**
 * Task 4's optional registry drill. The npmrc parent is derived from the printed root as
 * `dirname(root)`, never from a caller variable, so the probe file stays beside the attempt.
 * The user config is empty on purpose: the printed registry is whatever route your organization
 * already approved, and no global npm state is edited to find it out.
 */
export function recoveryNpmrc(input) {
  const root = guardAttempt(input);
  const npmrcParent = dirname(root);
  const npmrcPath = join(npmrcParent, "npmrc-attempt-02." + randomUUID());
  writeFileSync(npmrcPath, "", { flag: "wx" });
  const probe = requireSuccess(
    "npm config get registry",
    runNpm(root, ["config", "get", "registry", "--userconfig", npmrcPath, "--cache", join(root, ".npm-cache")]),
  );
  return "npmrc=" + npmrcPath + "\nregistry=" + probe.stdout.trim();
}

/** Dispatch one documented verb. Every verb after create takes the one printed absolute root. */
export function main(args = process.argv.slice(2)) {
  const [verb, root] = args;
  if (verb === "reclaim" && args.length === 1) return previewReclaim().join("\n");
  if (verb === "reclaim" && args[1] === "--confirm" && args.length >= 3) {
    return reclaimArchives(args.slice(2), { confirmed: true }).map((path) => "reclaimed=" + path).join("\n");
  }
  if (verb === "create" && args.length === 1) return createAttempt();
  if (verb === "guard" && args.length === 2) return "module_02_guard=ready root=" + guardAttempt(root);
  if (verb === "install" && args.length === 2) return "module_02_install=ready commit=" + installAttempt(root).commit;
  if (verb === "diagnose" && args.length === 2) {
    const result = diagnoseAttempt(root);
    return "doctor_exit=" + result.doctorExit + " toolchain_exit=" + result.toolchainExit + "\ndoctor_report=" + result.doctorReport;
  }
  if (verb === "accept" && args.length === 2) return "module_02_accept=" + acceptAttempt(root);
  if (verb === "reset" && args.length === 2) return resetAttempt(root);
  if (verb === "archive" && args.length === 2) return "archived=" + archiveAttempt(root);
  if (verb === "recovery-npmrc" && args.length === 2) return recoveryNpmrc(root);
  throw new Error(helperUsage);
}

if (process.argv[1] && canonicalPath(resolve(process.argv[1])) === canonicalPath(fileURLToPath(import.meta.url))) {
  try {
    console.log(main());
  } catch (error) {
    console.error("lab-02: " + error.message);
    process.exitCode = 1;
  }
}
