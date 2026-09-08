import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { archiveAttempt, checkpoint, createAttempt, guardAttempt, injectDrift, main, verifyPin, verifyResult } from "../labs/fixtures/05-projection-drift-recovery/projection-lab.mjs";
import { git, safePath } from "../labs/fixtures/05-projection-drift-recovery/safety.mjs";

const read = (path) => readFileSync(path, "utf8");
const originalHelper = fileURLToPath(new URL("../labs/fixtures/05-projection-drift-recovery/projection-lab.mjs", import.meta.url));
const windowsShims = JSON.parse(read(new URL("./fixtures/windows-directive-shims.json", import.meta.url))).files;
function runCli(cwd, args, helper = originalHelper) {
  return spawnSync(process.execPath, [helper, ...args], { cwd, encoding: "utf8", timeout: 30_000 });
}
function prepared() {
  const root = createAttempt();
  writeFileSync(join(root, "package-lock.json"), "{}\n");
  checkpoint(root);
  return root;
}
function fakeGraph(root) {
  for (const name of ["directive", "directive-core", "directive-content", "directive-types"]) {
    const directory = join(root, "node_modules", "@deftai", name);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "package.json"), JSON.stringify({ version: "0.112.0" }));
  }
  mkdirSync(join(root, "node_modules/.bin"));
  mkdirSync(join(root, "node_modules/@deftai/directive/dist"));
  writeFileSync(join(root, "node_modules/@deftai/directive/dist/bin.js"), "// inert binary fixture\n");
  if (process.platform === "win32") {
    for (const [suffix, contents] of Object.entries(windowsShims)) {
      writeFileSync(join(root, "node_modules/.bin/directive" + suffix), contents);
    }
  } else {
    symlinkSync("../@deftai/directive/dist/bin.js", join(root, "node_modules/.bin/directive"));
  }
}
test("guard refuses an installed graph with missing launchers and a partial install", () => {
  const root = createAttempt();
  fakeGraph(root);
  assert.equal(guardAttempt(root), root);
  const suffixes = process.platform === "win32" ? Object.keys(windowsShims) : [""];
  for (const suffix of suffixes) {
    const launcher = join(root, "node_modules/.bin/directive" + suffix);
    renameSync(launcher, launcher + ".retained");
    assert.throws(() => guardAttempt(root), /ENOENT/);
  }
  for (const suffix of suffixes) {
    const launcher = join(root, "node_modules/.bin/directive" + suffix);
    renameSync(launcher + ".retained", launcher);
  }
  archiveAttempt(root);

  const partial = createAttempt();
  mkdirSync(join(partial, "node_modules"));
  assert.throws(() => guardAttempt(partial), /ENOENT/);
  renameSync(join(partial, "node_modules"), join(partial, "../partial-install-retained"));
  archiveAttempt(partial);
});
test("create guards a no-remote feature-branch repo; archive preserves sources", () => {
  const root = createAttempt();
  assert.equal(guardAttempt(root), root);
  assert.equal(git(root, ["remote"]).trim(), "");
  assert.equal(git(root, ["branch", "--show-current"]).trim(), "training/module-05");
  const source = read(join(root, "xbrief/PROJECT-DEFINITION.xbrief.json"));
  const marker = read(join(root, "../lab-state.json"));
  writeFileSync(join(root, "../evidence.md"), "retained archive proof\n");
  const previous = process.cwd();
  const archived = archiveAttempt(root);
  assert.equal(process.cwd(), previous);
  assert.equal(read(join(archived, "repo/xbrief/PROJECT-DEFINITION.xbrief.json")), source);
  assert.equal(read(join(archived, "lab-state.json")), marker);
  assert.equal(read(join(archived, "evidence.md")), "retained archive proof\n");
  assert.throws(() => guardAttempt(root), /ENOENT|no longer exists/);
});
test("fresh reset leaves earlier attempt and evidence intact", () => {
  const first = createAttempt();
  writeFileSync(join(first, "../evidence.md"), "failure evidence\n");
  const second = createAttempt();
  assert.notEqual(first, second);
  assert.equal(read(join(first, "../evidence.md")), "failure evidence\n");
  archiveAttempt(first);
  archiveAttempt(second);
});
test("guard rejects curriculum and arbitrary roots before writes", () => {
  assert.throws(() => guardAttempt(new URL("../", import.meta.url).pathname), /temporary lab/);
});
test("safePath rejects traversal, absolute paths, and 50 malformed inputs", () => {
  const root = createAttempt();
  for (let i = 0; i < 50; i += 1) assert.throws(() => safePath(root, "../outside-" + i), /relative path/);
  for (const path of ["", ".", "..", "/tmp/outside", "x/../../outside", "x\\outside", "C:/outside"]) {
    assert.throws(() => safePath(root, path), /relative path/);
  }
  archiveAttempt(root);
});
test("guard rejects unexpected remote without changing config", () => {
  const root = createAttempt();
  const path = join(root, ".git/config");
  const original = read(path);
  writeFileSync(path, original + '\n[remote "unexpected"]\n\turl = https://example.invalid/fictional.git\n');
  assert.throws(() => guardAttempt(root), /no remote/);
  assert.throws(() => archiveAttempt(root), /no remote/);
  assert.match(read(path), /unexpected/);
  writeFileSync(path, original);
  archiveAttempt(root);
});
test("guard rejects marker changes and symlinked source ancestors", () => {
  const root = createAttempt();
  const path = join(root, "../lab-state.json");
  const original = read(path);
  writeFileSync(path, original.replace('"module-05"', '"other-lab"'));
  assert.throws(() => guardAttempt(root), /marker/);
  writeFileSync(path, original);
  renameSync(join(root, "xbrief"), join(root, "xbrief-original"));
  symlinkSync(join(root, "xbrief-original"), join(root, "xbrief"), "dir");
  assert.throws(() => guardAttempt(root), /symlink/);
  assert.throws(() => archiveAttempt(root), /symlink/);
  renameSync(join(root, "xbrief"), join(root, "xbrief-link"));
  renameSync(join(root, "xbrief-original"), join(root, "xbrief"));
  const attributes = read(join(root, ".gitattributes"));
  renameSync(join(root, ".gitattributes"), join(root, "../attributes-original"));
  symlinkSync(join(root, "../attributes-original"), join(root, ".gitattributes"), "file");
  assert.throws(() => checkpoint(root), /symlink/);
  assert.throws(() => archiveAttempt(root), /symlink/);
  assert.equal(read(join(root, "../attributes-original")), attributes);
  renameSync(join(root, ".gitattributes"), join(root, "../attributes-link-retained"));
  renameSync(join(root, "../attributes-original"), join(root, ".gitattributes"));
  symlinkSync(join(root, ".gitattributes"), join(root, "xbrief/.gitattributes"), "file");
  assert.throws(() => guardAttempt(root), /symlink/);
  renameSync(join(root, "xbrief/.gitattributes"), join(root, "../nested-attributes-link-retained"));
  archiveAttempt(root);
});
test("MAP symlink is refused before a mutation can reach evidence", () => {
  const root = createAttempt();
  const outside = join(root, "../evidence.md");
  const original = read(outside);
  symlinkSync(outside, join(root, ".planning/codebase/MAP.md"));
  assert.throws(() => injectDrift(root), /symlink/);
  assert.equal(read(outside), original);
  renameSync(join(root, ".planning/codebase/MAP.md"), join(root, "map-link"));
  archiveAttempt(root);
});
test("verifyPin rejects missing, changed, and symlinked package graphs", () => {
  const root = createAttempt();
  assert.throws(() => verifyPin(root), /ENOENT/);
  fakeGraph(root);
  assert.equal(verifyPin(root), "0.112.0");
  const path = join(root, "node_modules/@deftai/directive-content/package.json");
  writeFileSync(path, '{"version":"0.113.0"}');
  assert.throws(() => verifyPin(root), /0.112.0/);
  writeFileSync(path, '{"version":"0.112.0"}');
  renameSync(join(root, "node_modules"), join(root, "node_modules-original"));
  symlinkSync(join(root, "node_modules-original"), join(root, "node_modules"), "dir");
  assert.throws(() => verifyPin(root), /symlink/);
  renameSync(join(root, "node_modules"), join(root, "node_modules-link"));
  renameSync(join(root, "node_modules-original"), join(root, "node_modules"));
  archiveAttempt(root);
});
test("checkpoint refuses unexpected staged data and stages only the allowlist", () => {
  const root = createAttempt();
  writeFileSync(join(root, "package-lock.json"), "{}\n");
  writeFileSync(join(root, "unexpected.txt"), "fictional extra\n");
  git(root, ["add", "--", "unexpected.txt"]);
  assert.throws(() => checkpoint(root), /unexpected staged/);
  git(root, ["rm", "--cached", "--", "unexpected.txt"]);
  assert.throws(() => checkpoint(root), /unexpected untracked/);
  renameSync(join(root, "unexpected.txt"), join(root, "../unexpected.txt"));
  git(root, ["config", "tag.gpgSign", "true"]);
  checkpoint(root);
  assert.equal(git(root, ["cat-file", "-t", "lab-05-start"]).trim(), "commit");
  assert.doesNotMatch(git(root, ["ls-files"]), /unexpected|node_modules|evidence|MAP.md/);
  assert.throws(() => checkpoint(root), /checkpoint already/);
  archiveAttempt(root);
});
test("injected projection drift preserves source and refuses a second injection", () => {
  const root = prepared();
  const source = read(join(root, "xbrief/PROJECT-DEFINITION.xbrief.json"));
  writeFileSync(join(root, ".planning/codebase/MAP.md"), "<!-- AUTO-GENERATED by task codebase:map -->\n");
  injectDrift(root);
  assert.equal(read(join(root, "xbrief/PROJECT-DEFINITION.xbrief.json")), source);
  assert.match(read(join(root, ".planning/codebase/MAP.md")), /SIMULATED DIRECT EDIT/);
  assert.throws(() => injectDrift(root), /already injected/);
  archiveAttempt(root);
});
test("result requires purpose change, meaningful existing MAP, and only permitted source diff", () => {
  const root = prepared();
  assert.throws(() => verifyResult(root), /purpose/);
  const path = join(root, "xbrief/PROJECT-DEFINITION.xbrief.json");
  const source = JSON.parse(read(path));
  source.plan.architecture.codeStructure.modules[0].purpose = "Normalize and validate fictional stop codes.";
  writeFileSync(path, JSON.stringify(source, null, 2) + "\n");
  assert.throws(() => verifyResult(root), /ENOENT/);
  const mapPath = join(root, ".planning/codebase/MAP.md");
  writeFileSync(mapPath, "unmarked output\n");
  assert.throws(() => verifyResult(root), /banner/);
  writeFileSync(mapPath, "<!-- AUTO-GENERATED by task codebase:map -- DO NOT EDIT MANUALLY -->\n<!-- Source of truth: xbrief/PROJECT-DEFINITION.xbrief.json plan.architecture.codeStructure -->\n| stop-code | Stop code | Normalize and validate fictional stop codes. | src/*.js | 1 |\n");
  assert.equal(verifyResult(root), true);
  writeFileSync(join(root, "extra.md"), "unexpected local data\n");
  assert.throws(() => verifyResult(root), /unexpected untracked/);
  renameSync(join(root, "extra.md"), join(root, "../extra.md"));
  writeFileSync(join(root, "src/stop-code.js"), "// unexpected edit\n");
  assert.throws(() => verifyResult(root), /only the source|fixture changed/);
  archiveAttempt(root);
});
test("command interface validates operands and routes guarded fixture actions", () => {
  assert.throws(() => main([]), /one verb/);
  assert.throws(() => main(["unknown"]), /Unknown lab verb/);
  const root = main(["create"]);
  const previous = process.cwd();
  try {
    process.chdir(root);
    assert.equal(main(["guard"]), root);
    fakeGraph(root);
    assert.match(main(["verify-pin"]), /CLI\/core\/content\/types 0.112.0/);
    writeFileSync(join(root, "package-lock.json"), "{}\n");
    assert.match(main(["checkpoint"]), /lab-05-start checkpoint/);
    writeFileSync(join(root, ".planning/codebase/MAP.md"), "<!-- AUTO-GENERATED by task codebase:map -->\n");
    assert.match(main(["inject-drift"]), /source unchanged/);
    assert.throws(() => main(["verify-result"]), /purpose/);
    assert.throws(() => main(["archive"]), /archive.*explicit.*absolute/i);
    assert.throws(() => main(["archive", root]), /caller and helper.*leave.*attempt parent/);
  } finally {
    process.chdir(previous);
  }
  assert.match(main(["archive", root]), /3ci-directive-lab-archive/);
});

test("archive rejects caller cwd anywhere in the attempt parent before moving evidence", () => {
  const root = createAttempt();
  const parent = dirname(root);
  const nested = join(parent, "private nested folder");
  mkdirSync(nested);
  const source = read(join(root, "xbrief/PROJECT-DEFINITION.xbrief.json"));
  const evidence = read(join(parent, "evidence.md"));
  const destination = join(dirname(parent), "3ci-directive-lab-archive", basename(parent));
  const previous = process.cwd();
  try {
    for (const cwd of [root, parent, join(root, "src"), nested]) {
      process.chdir(cwd);
      assert.throws(() => archiveAttempt(root), /caller and helper.*leave.*attempt parent/);
      assert.equal(process.cwd(), cwd);
      assert.equal(existsSync(destination), false);
      assert.equal(read(join(root, "xbrief/PROJECT-DEFINITION.xbrief.json")), source);
      assert.equal(read(join(parent, "evidence.md")), evidence);
    }
  } finally {
    process.chdir(previous);
  }
  archiveAttempt(root);
});

test("actual CLI requires an explicit canonical target and refuses cwd inside the attempt", () => {
  const root = createAttempt();
  const parent = dirname(root);
  const source = read(join(root, "xbrief/PROJECT-DEFINITION.xbrief.json"));
  for (const cwd of [root, parent, join(root, "src")]) {
    const result = runCli(cwd, ["archive", root]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /caller and helper.*leave.*attempt parent/);
    assert.equal(read(join(root, "xbrief/PROJECT-DEFINITION.xbrief.json")), source);
  }
  const oldInvocation = runCli(root, ["archive"], join(root, "projection-lab.mjs"));
  assert.equal(oldInvocation.status, 1);
  assert.match(oldInvocation.stderr, /archive.*explicit.*absolute/i);
  assert.equal(existsSync(root), true);
  const success = runCli(process.cwd(), ["archive", root]);
  assert.equal(success.status, 0, success.stderr);
  const archived = success.stdout.trim();
  assert.equal(existsSync(root), false);
  assert.equal(read(join(archived, "repo/xbrief/PROJECT-DEFINITION.xbrief.json")), source);
  assert.equal(existsSync(join(archived, "evidence.md")), true);
});

test("actual archive CLI handles an external helper path containing spaces", () => {
  const root = createAttempt();
  const holder = mkdtempSync(join(realpathSync(tmpdir()), "3ci-archive-helper-"));
  const folder = join(holder, "helper with spaces");
  mkdirSync(folder);
  for (const file of ["projection-lab.mjs", "safety.mjs"]) copyFileSync(join(dirname(originalHelper), file), join(folder, file));
  const result = runCli(folder, ["archive", root], join(folder, "projection-lab.mjs"));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(existsSync(join(result.stdout.trim(), "repo/package.json")), true);
  assert.equal(existsSync(join(folder, "projection-lab.mjs")), true);
});

test("archive rejects missing, extra, relative, noncanonical and foreign targets", () => {
  const root = createAttempt();
  const parent = dirname(root);
  assert.throws(() => archiveAttempt(), /explicit.*absolute.*canonical/);
  assert.throws(() => archiveAttempt(root, root), /explicit.*absolute.*canonical/);
  for (const value of [undefined, "", "repo", relative(process.cwd(), root), root + "/.", root + "/../repo"]) {
    assert.throws(() => archiveAttempt(value), /explicit.*absolute.*canonical/);
    assert.equal(existsSync(root), true);
  }
  for (let i = 0; i < 50; i++) {
    assert.throws(() => archiveAttempt("../foreign-archive-" + i), /explicit.*absolute.*canonical/);
  }
  assert.equal(existsSync(root), true);
  for (const args of [["archive"], ["archive", root, "extra"], ["archive", "repo"], ["archive", parent], ["archive", process.cwd()]]) {
    const result = runCli(process.cwd(), args);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /explicit.*absolute|temporary lab/);
    assert.equal(existsSync(root), true);
  }
  for (const verb of ["create", "guard", "verify-pin", "checkpoint", "inject-drift", "verify-result"]) {
    assert.throws(() => main([verb, root]), /one verb/);
  }
  archiveAttempt(root);
});

test("archive refuses an existing destination and preserves both source and destination", () => {
  const root = createAttempt();
  const parent = dirname(root);
  const archive = join(dirname(parent), "3ci-directive-lab-archive");
  mkdirSync(archive, { recursive: true });
  const destination = join(archive, basename(parent));
  mkdirSync(destination);
  writeFileSync(join(destination, "keep.txt"), "existing destination\n");
  const evidence = read(join(parent, "evidence.md"));
  assert.throws(() => archiveAttempt(root), /destination already exists/);
  assert.equal(read(join(parent, "evidence.md")), evidence);
  assert.equal(existsSync(join(root, "package.json")), true);
  assert.equal(read(join(destination, "keep.txt")), "existing destination\n");
});
test("guard rejects changed projection destinations and source globs", () => {
  const root = createAttempt();
  const path = join(root, "xbrief/PROJECT-DEFINITION.xbrief.json");
  const original = read(path);
  const source = JSON.parse(original);
  source.plan.architecture.codeStructure.modules[0].pathGlobs = ["**/*"];
  writeFileSync(path, JSON.stringify(source));
  assert.throws(() => guardAttempt(root), /preserve authored globs/);
  writeFileSync(path, original);
  archiveAttempt(root);
});
test("inherited Git redirection is rejected before creating or inspecting a lab", () => {
  const original = process.env.GIT_WORK_TREE;
  process.env.GIT_WORK_TREE = "/fictional/never-touch";
  try {
    assert.throws(() => createAttempt(), /inherited Git override.*GIT_WORK_TREE/);
    assert.throws(() => guardAttempt(), /inherited Git override.*GIT_WORK_TREE/);
  } finally {
    if (original === undefined) delete process.env.GIT_WORK_TREE;
    else process.env.GIT_WORK_TREE = original;
  }
});
