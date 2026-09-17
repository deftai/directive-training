import assert from "node:assert/strict";
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, renameSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { assertNoGitRedirection, assertPlainTree, git, safePath } from "./safety.mjs";

const fixture = dirname(fileURLToPath(import.meta.url));
const read = (path) => readFileSync(path, "utf8");
const sourcePath = "xbrief/PROJECT-DEFINITION.xbrief.json";
const mapPath = ".planning/codebase/MAP.md";
const finalPurpose = "Normalize and validate fictional stop codes.";
const sourceAttributes = "/xbrief/PROJECT-DEFINITION.xbrief.json text eol=lf\n";
const tracked = [".gitattributes", ".gitignore", ".npmrc", "package.json", "package-lock.json", "projection-lab.mjs", "safety.mjs", "src/stop-code.js", sourcePath];
const ignorePaths = ["node_modules/example", ".npm-cache/example", ".planning/codebase/MAP.md", ".deft/core/VERSION", ".deft/.cli/example", ".deft-cache/example", ".deft/ritual-state.json", "xbrief/.triage-cache/example", "USER.md", ".deft/USER.md"];
const archiveUsage = "Archive requires exactly one explicit absolute canonical lab root: archive <root>. Run the original course helper from outside the attempt parent.";

// cmd-shim@8.0.0, #!/usr/bin/env node, exact ../@deftai/directive/dist/bin.js target.
// Independently generated reference programs: scripts/fixtures/windows-directive-shims.json.
// A different npm format must be reviewed, not accepted by a substring match.
const windowsShimHashes = {
  "": "d98e2f6dad8e55bdd041ae5b984e7c391233496197d1d33dd0a591774b15a195",
  ".cmd": "d78eb4d2fe7eab9d7c5928da0bdbe12f77ee4c6a108f8a2805d544c0c096a02d",
  ".ps1": "877b80b65ff46fcf9ab44cb1f065e60a4ee1da82eaa2d93629e834d5f1ae39ef",
};

/**
 * Verify local launcher identity without executing it.
 * @param {string} root Canonical fixture root.
 * @param {string} platform Node platform; injectable for cross-platform contract tests.
 * @returns {void}
 * @throws {Error} If the target or launcher identity is missing, unsafe, or unrecognized.
 */
export function verifyLocalBinary(root, platform = process.platform) {
  safePath(root, "node_modules/.bin");
  const expected = safePath(root, "node_modules/@deftai/directive/dist/bin.js");
  assert.ok(lstatSync(expected).isFile(), "Stop: CLI target must be a regular file.");
  if (platform !== "win32") {
    assert.equal(realpathSync(join(root, "node_modules/.bin/directive")), expected, "Stop: local CLI link must resolve to this attempt's installed Directive.");
    return;
  }
  // npm shims prefer a colocated Node executable; cmd also searches the current directory.
  for (const folder of [root, join(root, "node_modules/.bin")]) {
    assert.ok(!readdirSync(folder).some((name) => /^node(?:\.|$)/i.test(name)), "Stop: local Node interpreter would shadow the configured runtime.");
  }
  for (const [suffix, hash] of Object.entries(windowsShimHashes)) {
    const launcher = safePath(root, "node_modules/.bin/directive" + suffix);
    assert.ok(lstatSync(launcher).isFile(), "Stop: CLI launcher must be a regular file.");
    const digest = createHash("sha256").update(read(launcher).replace(/\r\n/g, "\n")).digest("hex");
    assert.equal(digest, hash, "Stop: unrecognized npm shim directive" + suffix + "; preserve the attempt and report the npm version. Do not bypass launcher validation.");
  }
}

/** Create a new no-remote OS-temp fixture; return its root or throw without removing failed state. */
export function createAttempt() {
  assertNoGitRedirection();
  assert.ok(existsSync(join(fixture, "PROJECT-DEFINITION.xbrief.json")), "Run create from the original course fixture, not an edited attempt.");
  const temporaryRoot = realpathSync(tmpdir());
  assert.equal(git(temporaryRoot, ["rev-parse", "--show-toplevel"], [0, 128]).trim(), "", "Stop: temporary parent is inside another Git repository.");
  const parent = mkdtempSync(join(temporaryRoot, "3ci-directive-lab05-"));
  const root = join(parent, "repo");
  for (const path of ["repo", "empty-template", "repo/src", "repo/xbrief", "repo/.planning", "repo/.planning/codebase"]) mkdirSync(join(parent, path));
  for (const folder of ["proposed", "pending", "active", "completed", "cancelled"]) mkdirSync(join(root, "xbrief", folder));
  for (const [from, to] of [
    ["package.json", "package.json"], ["PROJECT-DEFINITION.xbrief.json", sourcePath],
    ["stop-code.js", "src/stop-code.js"], ["projection-lab.mjs", "projection-lab.mjs"], ["safety.mjs", "safety.mjs"],
  ]) writeFileSync(safePath(root, to), read(safePath(fixture, from)).replace(/\r\n/g, "\n"), { flag: "wx" });
  // Normalize the source in Git as well, including ordinary CRLF edits after checkpoint.
  writeFileSync(safePath(root, ".gitattributes"), sourceAttributes, { flag: "wx" });
  writeFileSync(safePath(root, ".gitignore"), "/node_modules/\n/.npm-cache/\n/.planning/\n/.deft/\n/.deft-cache/\n/xbrief/.triage-cache/\n/USER.md\n", { flag: "wx" });
  writeFileSync(safePath(root, ".npmrc"), "registry=https://registry.npmjs.org/\naudit=false\nfund=false\nignore-scripts=true\n", { flag: "wx" });
  const initialSource = JSON.parse(read(join(root, sourcePath)));
  writeFileSync(join(parent, "lab-state.json"), JSON.stringify({ lab: "module-05", root, initialSource }, null, 2) + "\n", { flag: "wx" });
  writeFileSync(join(parent, "evidence.md"), "# Lab 5 evidence\n\nRecord commands, exits, reasoning, reset, and archive paths here.\n", { flag: "wx" });
  git(root, ["init", "--template=" + join(parent, "empty-template")]);
  git(root, ["switch", "-c", "training/module-05"]);
  guardAttempt(root);
  return root;
}

/** Return the canonical lab root after identity, path, Git, and source-boundary checks; otherwise throw. */
export function guardAttempt(input = process.cwd()) {
  assertNoGitRedirection();
  const root = resolve(input);
  const parent = dirname(root);
  const temporaryRoot = realpathSync(tmpdir());
  assert.ok(basename(root) === "repo" && /^3ci-directive-lab05-[A-Za-z0-9]{6}$/.test(basename(parent)) && dirname(parent) === temporaryRoot, "Stop: expected the unique OS-temporary lab repo.");
  assert.ok(!lstatSync(parent).isSymbolicLink() && !lstatSync(root).isSymbolicLink(), "Stop: lab root is a symlink.");
  assert.equal(realpathSync(root), root, "Stop: lab root is not canonical.");
  assert.equal(git(parent, ["rev-parse", "--show-toplevel"], [0, 128]).trim(), "", "Stop: temporary parent is inside another Git repository.");
  const marker = JSON.parse(read(safePath(parent, "lab-state.json")));
  assert.ok(marker.lab === "module-05" && marker.root === root, "Stop: lab marker mismatch.");
  for (const path of [".git", ".git/config", ".git/index", ".git/hooks", ".git/objects", ".git/refs", ".git/HEAD", ".gitattributes", "xbrief/.gitattributes", ".gitignore", ".npmrc", "package.json", "package-lock.json", "projection-lab.mjs", "safety.mjs", "src/stop-code.js", sourcePath, mapPath, "node_modules", ".npm-cache"]) safePath(root, path);
  assert.ok(lstatSync(join(root, ".git")).isDirectory(), "Stop: expected a local .git directory.");
  assertPlainTree(root, ".git");
  assert.ok(lstatSync(join(root, ".gitattributes")).isFile(), "Stop: source attributes must be a regular file.");
  assert.equal(read(join(root, ".gitattributes")), sourceAttributes, "Stop: source attributes must retain the exact normalization rule.");
  const attributes = git(root, ["check-attr", "text", "eol", "whitespace", "--", sourcePath]);
  assert.equal(attributes, `${sourcePath}: text: set\n${sourcePath}: eol: lf\n${sourcePath}: whitespace: unspecified\n`, "Stop: source attributes must not be overridden or suppress whitespace checking.");
  const actual = JSON.parse(read(join(root, sourcePath)));
  const expected = marker.initialSource;
  const purpose = actual.plan?.architecture?.codeStructure?.modules?.[0]?.purpose;
  assert.ok(typeof purpose === "string" && purpose.trim(), "Stop: source purpose must be a nonempty string.");
  expected.plan.architecture.codeStructure.modules[0].purpose = purpose;
  assert.deepEqual(actual, expected, "Stop: only the source purpose may change; preserve authored globs and projection path.");
  assert.equal(realpathSync(git(root, ["rev-parse", "--show-toplevel"]).trim()), root, "Stop: Git root differs from the lab.");
  assert.equal(git(root, ["remote"]).trim(), "", "Stop: lab must have no remote.");
  // An installed or partial package tree must not evade identity checks by losing a launcher.
  if (existsSync(join(root, "node_modules"))) verifyLocalBinary(root);
  return root;
}

/** Check private manifest and installed CLI/core/content/types versions; return the exact pin or throw. */
export function verifyPin(root = process.cwd()) {
  guardAttempt(root);
  const manifest = JSON.parse(read(safePath(root, "package.json")));
  assert.equal(manifest.private, true, "fixture must remain private");
  assert.equal(manifest.devDependencies?.["@deftai/directive"], "0.119.2", "exact 0.119.2 pin required");
  for (const name of ["directive-core", "directive-content", "directive-types"]) assert.equal(manifest.overrides?.["@deftai/" + name], "0.119.2", "exact 0.119.2 overrides required");
  for (const name of ["directive", "directive-core", "directive-content", "directive-types"]) {
    const installed = JSON.parse(read(safePath(root, "node_modules/@deftai/" + name + "/package.json")));
    assert.equal(installed.version, "0.119.2", name + " must resolve to 0.119.2");
  }
  verifyLocalBinary(root);
  return "0.119.2";
}

/** Inspect ignores and stage only the declared fixture, then create a local tag; throw on any mismatch. */
export function checkpoint(root = process.cwd()) {
  guardAttempt(root);
  assert.equal(git(root, ["tag", "--list", "lab-05-start"]).trim(), "", "checkpoint already exists; use a fresh attempt");
  const staged = git(root, ["diff", "--cached", "--name-only"]).trim().split("\n").filter(Boolean);
  assert.ok(staged.every((path) => tracked.includes(path)), "unexpected staged data: stop and create a fresh attempt");
  const untracked = git(root, ["ls-files", "--others", "--exclude-standard"]).trim().split("\n").filter(Boolean);
  assert.ok(untracked.every((path) => tracked.includes(path)), "unexpected untracked data: preserve it and create a fresh attempt");
  for (const path of tracked) assert.ok(lstatSync(safePath(root, path)).isFile(), "missing checkpoint fixture: " + path);
  process.stderr.write(git(root, ["status", "--short"]));
  for (const path of ignorePaths) process.stderr.write(git(root, ["check-ignore", "-v", "--", path]));
  git(root, ["add", "--", ...tracked]);
  const accepted = git(root, ["diff", "--cached", "--name-only"]).trim().split("\n").sort();
  assert.deepEqual(accepted, [...tracked].sort(), "staged paths must exactly match the fixture allowlist");
  process.stderr.write(accepted.join("\n") + "\n");
  git(root, ["-c", "user.name=3Ci Lab Learner", "-c", "user.email=learner@example.invalid", "-c", "commit.gpgsign=false", "commit", "-m", "chore: checkpoint fictional projection lab"]);
  git(root, ["-c", "tag.gpgSign=false", "tag", "lab-05-start"]);
}

/** Append one clearly labeled simulated fault to a generated MAP; preserve source and reject repeats. */
export function injectDrift(root = process.cwd()) {
  guardAttempt(root);
  const path = safePath(root, mapPath);
  const map = read(path);
  assert.ok(map.includes("AUTO-GENERATED by task codebase:map"), "render a generated MAP first");
  assert.ok(!map.includes("SIMULATED DIRECT EDIT"), "drift already injected");
  writeFileSync(path, map + "\nSIMULATED DIRECT EDIT: this unsupported note has no source change.\n");
}

/** Check the exact source change, existing MAP content, and file boundary; freshness is a separate CLI gate. */
export function verifyResult(root = process.cwd()) {
  guardAttempt(root);
  const source = JSON.parse(read(safePath(root, sourcePath)));
  assert.equal(source.plan.architecture.codeStructure.modules[0].purpose, finalPurpose, "source purpose must describe the requested change");
  const expected = JSON.parse(git(root, ["show", "lab-05-start:" + sourcePath]));
  expected.plan.architecture.codeStructure.modules[0].purpose = finalPurpose;
  assert.deepEqual(source, expected, "only the source purpose may change");
  const changed = git(root, ["diff", "--name-only", "lab-05-start"]).trim().split("\n");
  assert.deepEqual(changed, [sourcePath], "only the source file may differ from the checkpoint; fixture changed");
  assert.equal(git(root, ["ls-files", "--others", "--exclude-standard"]).trim(), "", "unexpected untracked data outside ignored lab runtime");
  const map = read(safePath(root, mapPath));
  assert.ok(map.includes("AUTO-GENERATED by task codebase:map") && map.includes("DO NOT EDIT MANUALLY"), "MAP must exist with its generated banner");
  assert.ok(map.includes("Source of truth: xbrief/PROJECT-DEFINITION.xbrief.json") && map.includes("plan.architecture.codeStructure"), "MAP must name its source");
  const moduleRow = map.split("\n").find((line) => line.includes("stop-code") && line.startsWith("| "));
  assert.ok(moduleRow?.includes(finalPurpose) && moduleRow.includes("src/*.js") && moduleRow.endsWith("| 1 |"), "MAP must show the new purpose, bounded glob, and one matched source file");
  assert.ok(!map.includes("SIMULATED DIRECT EDIT") && !map.includes("directory-derived fallback"), "MAP must be regenerated from authored metadata");
  return true;
}

/**
 * Move one explicitly named guarded attempt and its evidence to the temp archive.
 * @param {string} root Absolute canonical lab root returned by createAttempt.
 * @returns {string} Archive destination containing the intact attempt and evidence.
 * @throws {Error} On unsafe identity, cwd inside the attempt parent, or an existing destination.
 */
export function archiveAttempt(root) {
  assert.equal(arguments.length, 1, archiveUsage);
  assert.ok(typeof root === "string" && isAbsolute(root) && resolve(root) === root, archiveUsage);
  guardAttempt(root);
  const parent = dirname(root);
  const cwdFromParent = relative(parent, realpathSync(process.cwd()));
  assert.ok(isAbsolute(cwdFromParent) || cwdFromParent === ".." || cwdFromParent.startsWith(".." + sep), "Stop: caller and helper must leave the attempt parent before archive; run the original course helper from outside " + parent + ".");
  const temporaryRoot = dirname(parent);
  const archive = safePath(temporaryRoot, "3ci-directive-lab-archive");
  if (!existsSync(archive)) mkdirSync(archive);
  const destination = safePath(archive, basename(parent));
  assert.ok(!existsSync(destination), "Stop: archive destination already exists.");
  // The exact parent includes repository, private evidence, and the lab marker.
  renameSync(parent, destination);
  assert.ok(!existsSync(parent) && existsSync(join(destination, "repo")), "archive move did not complete");
  return destination;
}

/** Dispatch one documented lab verb and return its message; throw on bad arguments or failed guards. */
export function main(args = process.argv.slice(2)) {
  if (args[0] === "archive") {
    assert.equal(args.length, 2, archiveUsage);
    return archiveAttempt(args[1]);
  }
  assert.equal(args.length, 1, "Use one verb: create, guard, verify-pin, checkpoint, inject-drift, verify-result. Archive uses: archive <absolute-canonical-lab-root>.");
  const [verb] = args;
  if (verb === "create") return createAttempt();
  if (verb === "guard") return guardAttempt();
  if (verb === "verify-pin") return "OK: CLI/core/content/types " + verifyPin();
  if (verb === "checkpoint") { checkpoint(); return "OK: lab-05-start checkpoint"; }
  if (verb === "inject-drift") { injectDrift(); return "OK: simulated MAP drift injected; source unchanged"; }
  if (verb === "verify-result") { verifyResult(); return "OK: source edit, existing MAP, and bounded diff"; }
  throw new Error("Unknown lab verb: " + verb);
}

if (process.argv[1] && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) {
  try {
    console.log(main());
  } catch (error) {
    console.error("Lab 5 stopped: " + error.message);
    process.exitCode = 1;
  }
}
