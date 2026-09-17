import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  archiveAttempt,
  checkpoint,
  createAttempt,
  guardAttempt,
  injectDrift,
  verifyLocalBinary,
  verifyPin,
} from "../labs/fixtures/05-projection-drift-recovery/projection-lab.mjs";

const read = (path) => readFileSync(path, "utf8");
const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const windowsShims = JSON.parse(read(new URL("./fixtures/windows-directive-shims.json", import.meta.url))).files;
const helpers = [
  "labs/fixtures/05-projection-drift-recovery/projection-lab.mjs",
  "labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs",
  "labs/fixtures/09-implementation-golden-path/implementation-lab.mjs",
  "labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs",
  "labs/fixtures/capstone-end-to-end/capstone-lab.mjs",
];

function fakeGraph(root) {
  for (const name of ["directive", "directive-core", "directive-content", "directive-types"]) {
    const directory = join(root, "node_modules", "@deftai", name);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "package.json"), JSON.stringify({ version: "0.119.2" }));
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

test("lab helper entry detection accepts alternate symbolic paths for the same file", () => {
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

test("Windows launcher and target symbolic links are rejected", () => {
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

test("projection guard rejects symbolic source ancestors", () => {
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

test("MAP symbolic link is refused before mutation reaches evidence", () => {
  const root = createAttempt();
  const outside = join(root, "../evidence.md");
  const original = read(outside);
  symlinkSync(outside, join(root, ".planning/codebase/MAP.md"));
  assert.throws(() => injectDrift(root), /symlink/);
  assert.equal(read(outside), original);
  renameSync(join(root, ".planning/codebase/MAP.md"), join(root, "map-link"));
  archiveAttempt(root);
});

test("verifyPin rejects a symbolic package graph", () => {
  const root = createAttempt();
  fakeGraph(root);
  assert.equal(verifyPin(root), "0.119.2");
  renameSync(join(root, "node_modules"), join(root, "node_modules-original"));
  symlinkSync(join(root, "node_modules-original"), join(root, "node_modules"), "dir");
  assert.throws(() => verifyPin(root), /symlink/);
  renameSync(join(root, "node_modules"), join(root, "node_modules-link"));
  renameSync(join(root, "node_modules-original"), join(root, "node_modules"));
  archiveAttempt(root);
});
