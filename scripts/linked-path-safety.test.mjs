import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  archiveAttempt as archiveModule02Attempt,
  createAttempt as createModule02Attempt,
  reclaimArchives as reclaimModule02Archives,
} from "../labs/fixtures/02-disposable-initialization/init-lab.mjs";
import {
  archiveAttempt as archiveAttemptRaw,
  checkpoint,
  createAttempt as createAttemptRaw,
  guardAttempt,
  injectDrift,
  previewReclaim,
  reclaimArchives,
  verifyLocalBinary,
  verifyPin,
} from "../labs/fixtures/05-projection-drift-recovery/projection-lab.mjs";
import {
  isWindowsSymlinkCapabilityUnavailable,
  verifyWindowsSymlinkCapability,
} from "./verify-symlink-capability.mjs";

const read = (path) => readFileSync(path, "utf8");
const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const windowsShims = JSON.parse(read(new URL("./fixtures/windows-directive-shims.json", import.meta.url))).files;
const helpers = [
  "labs/fixtures/05-projection-drift-recovery/projection-lab.mjs",
  "labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs",
  "labs/fixtures/10-implementation-golden-path/implementation-lab.mjs",
  "labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs",
  "labs/fixtures/capstone-end-to-end/capstone-lab.mjs",
];
const hostTemporaryRoot = realpathSync(tmpdir());
const suiteTemporaryRoot = realpathSync(mkdtempSync(join(hostTemporaryRoot, "3ci-linked-path-suite-")));
const originalTemporaryEnvironment = new Map(["TEMP", "TMP", "TMPDIR"].map((key) => [key, process.env[key]]));
for (const key of originalTemporaryEnvironment.keys()) process.env[key] = suiteTemporaryRoot;
const archivedForCleanup = new Set();
const parentsForCleanup = new Set();

function createAttempt(...args) {
  const root = createAttemptRaw(...args);
  parentsForCleanup.add(dirname(root));
  return root;
}

function archiveAttempt(...args) {
  const archived = archiveAttemptRaw(...args);
  archivedForCleanup.add(archived);
  return archived;
}

after(() => {
  try {
    const remaining = [...archivedForCleanup].filter((path) => existsSync(path));
    if (remaining.length > 0) reclaimArchives(remaining, { confirmed: true });
    for (const parent of parentsForCleanup) rmSync(parent, { force: true, recursive: true });
  } finally {
    for (const [key, value] of originalTemporaryEnvironment) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    rmSync(suiteTemporaryRoot, { force: true, recursive: true });
  }
});

let capabilitySkipReason = null;
try {
  verifyWindowsSymlinkCapability();
} catch (error) {
  if (!isWindowsSymlinkCapabilityUnavailable(error)) throw error;
  capabilitySkipReason =
    "Windows symlink capability is unavailable (EPERM); " +
    "the dedicated npm run test:linked-path-safety command remains fail-closed.";
}

function linkedPathTest(name, assertion) {
  test(name, (t) => {
    if (capabilitySkipReason) {
      t.skip(capabilitySkipReason);
      return;
    }
    assertion();
  });
}

function fakeGraph(root) {
  for (const name of ["directive", "directive-core", "directive-content", "directive-types"]) {
    const directory = join(root, "node_modules", "@deftai", name);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "package.json"), JSON.stringify({ version: "0.119.11" }));
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

function windowsShimFixture() {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "training-linked-path-shim-")));
  mkdirSync(join(root, "node_modules/.bin"), { recursive: true });
  mkdirSync(join(root, "node_modules/@deftai/directive/dist"), { recursive: true });
  writeFileSync(join(root, "node_modules/@deftai/directive/dist/bin.js"), "#!/usr/bin/env node\n");
  for (const [suffix, text] of Object.entries(windowsShims)) {
    writeFileSync(join(root, "node_modules/.bin/directive" + suffix), text);
  }
  return root;
}

linkedPathTest("lab helper entry detection accepts alternate symbolic paths for the same file", () => {
  const aliasRoot = mkdtempSync(join(tmpdir(), "3ci-lab-helper-alias-"));
  for (const [index, relativePath] of helpers.entries()) {
    const helper = join(repositoryRoot, relativePath);
    const alias = join(aliasRoot, `${index}-${basename(helper)}`);
    symlinkSync(helper, alias);
    assert.notEqual(alias, realpathSync(alias), `${relativePath} setup must use an alternate path`);
    const result = spawnSync(process.execPath, [alias, "entry-probe"], { encoding: "utf8" });
    assert.equal(result.status, 1, `${relativePath} must dispatch through an alternate path`);
    assert.match(result.stderr, /stopped:/i, `${relativePath} must report its rejected probe verb`);
  }
});

linkedPathTest("Windows launcher and target symbolic links are rejected", () => {
  const root = windowsShimFixture();
  const launcher = join(root, "node_modules/.bin/directive.cmd");
  renameSync(launcher, launcher + ".retained");
  symlinkSync(launcher + ".retained", launcher);
  assert.throws(() => verifyLocalBinary(root, "win32"), /symlink/);

  const second = windowsShimFixture();
  const target = join(second, "node_modules/@deftai/directive/dist/bin.js");
  renameSync(target, target + ".retained");
  symlinkSync(target + ".retained", target);
  assert.throws(() => verifyLocalBinary(second, "win32"), /symlink/);
});

linkedPathTest("Module 2 archive rejects a linked marker before moving its live parent", () => {
  const root = createModule02Attempt();
  const parent = dirname(root);
  const marker = join(parent, "lab-state.json");
  const retainedMarker = join(parent, "lab-state.retained.json");
  renameSync(marker, retainedMarker);
  symlinkSync(retainedMarker, marker, "file");
  try {
    assert.throws(() => archiveModule02Attempt(root), /marker must be a plain file/);
    assert.equal(existsSync(parent), true, "a linked marker refusal must leave the live parent in place");
    assert.equal(existsSync(root), true, "a linked marker refusal must preserve the printed attempt");
  } finally {
    rmSync(marker, { force: true });
    renameSync(retainedMarker, marker);
  }
  const archivedParent = archiveModule02Attempt(root);
  reclaimModule02Archives([dirname(archivedParent)], { confirmed: true });
});

linkedPathTest("projection guard rejects symbolic source ancestors", () => {
  const root = createAttempt();
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

linkedPathTest("MAP symbolic link is refused before mutation reaches evidence", () => {
  const root = createAttempt();
  const outside = join(root, "../evidence.md");
  const original = read(outside);
  symlinkSync(outside, join(root, ".planning/codebase/MAP.md"));
  assert.throws(() => injectDrift(root), /symlink/);
  assert.equal(read(outside), original);
  renameSync(join(root, ".planning/codebase/MAP.md"), join(root, "map-link"));
  archiveAttempt(root);
});

linkedPathTest("verifyPin rejects a symbolic package graph", () => {
  const root = createAttempt();
  fakeGraph(root);
  assert.equal(verifyPin(root), "0.119.11");
  renameSync(join(root, "node_modules"), join(root, "node_modules-original"));
  symlinkSync(join(root, "node_modules-original"), join(root, "node_modules"), "dir");
  assert.throws(() => verifyPin(root), /symlink/);
  renameSync(join(root, "node_modules"), join(root, "node_modules-link"));
  renameSync(join(root, "node_modules-original"), join(root, "node_modules"));
  archiveAttempt(root);
});

linkedPathTest("reclaim revalidates archive candidates and their shared ancestor before deletion", () => {
  const root = createAttempt();
  const archived = archiveAttempt(root);
  assert.ok(previewReclaim().includes(archived));

  const retainedCandidate = archived + ".retained";
  renameSync(archived, retainedCandidate);
  symlinkSync(retainedCandidate, archived, process.platform === "win32" ? "junction" : "dir");
  try {
    assert.equal(previewReclaim().includes(archived), false, "preview must omit a linked archive candidate");
    assert.throws(() => reclaimArchives([archived], { confirmed: true }), /archive destination/);
    assert.equal(existsSync(retainedCandidate), true, "reclaim must not follow a swapped candidate link");
  } finally {
    rmSync(archived, { force: true });
    renameSync(retainedCandidate, archived);
  }

  const archiveRoot = join(archived, "..");
  const retainedArchiveRoot = archiveRoot + ".retained";
  renameSync(archiveRoot, retainedArchiveRoot);
  symlinkSync(retainedArchiveRoot, archiveRoot, process.platform === "win32" ? "junction" : "dir");
  try {
    assert.throws(() => previewReclaim(), /symlink|canonical/);
    assert.equal(existsSync(join(retainedArchiveRoot, basename(archived))), true, "ancestor-link refusal must preserve the archive");
  } finally {
    rmSync(archiveRoot, { force: true });
    renameSync(retainedArchiveRoot, archiveRoot);
  }

  reclaimArchives([archived], { confirmed: true });
});
