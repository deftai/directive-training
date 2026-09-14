import assert from "node:assert/strict";
import { lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { verifyLocalBinary } from "../labs/fixtures/05-projection-drift-recovery/projection-lab.mjs";
import { assertNoGitRedirection } from "../labs/fixtures/05-projection-drift-recovery/safety.mjs";

const { files } = JSON.parse(readFileSync(new URL("./fixtures/windows-directive-shims.json", import.meta.url), "utf8"));
const retained = realpathSync(mkdtempSync(join(tmpdir(), "training-windows-shim-tests-")));
let sequence = 0;
console.log("Retained Windows shim test fixtures: " + retained);

function fixture(eol = "\n") {
  const root = join(retained, String(++sequence));
  mkdirSync(join(root, "node_modules/.bin"), { recursive: true });
  mkdirSync(join(root, "node_modules/@deftai/directive/dist"), { recursive: true });
  writeFileSync(join(root, "node_modules/@deftai/directive/dist/bin.js"), "#!/usr/bin/env node\n// inert test target\n");
  for (const [suffix, text] of Object.entries(files)) {
    writeFileSync(join(root, "node_modules/.bin/directive" + suffix), text.replaceAll("\n", eol));
  }
  return root;
}

for (const eol of ["\n", "\r\n"]) {
  test("accepts complete native npm shims with " + JSON.stringify(eol), () => {
    const root = fixture(eol);
    assert.equal(lstatSync(join(root, "node_modules/.bin/directive")).isSymbolicLink(), false);
    assert.doesNotThrow(() => verifyLocalBinary(root, "win32"));
  });
}

for (const suffix of Object.keys(files)) {
  test("rejects missing or directory launcher " + JSON.stringify(suffix), () => {
    const root = fixture();
    const launcher = join(root, "node_modules/.bin/directive" + suffix);
    renameSync(launcher, launcher + ".retained");
    assert.throws(() => verifyLocalBinary(root, "win32"), /ENOENT|shim|launcher/);
    mkdirSync(launcher);
    assert.throws(() => verifyLocalBinary(root, "win32"), /regular file|launcher/);
  });
  test("rejects tampering in whole launcher " + JSON.stringify(suffix), () => {
    const root = fixture();
    const launcher = join(root, "node_modules/.bin/directive" + suffix);
    const original = files[suffix];
    const variants = ["", "\ufeff" + original, original.trim(), original.replaceAll("directive", "outside"), original + "echo injected\n", original.replaceAll("node", "other")];
    for (let i = 0; i < 50; i++) variants.push(original.slice(0, i) + "X" + original.slice(i));
    for (const changed of variants) {
      writeFileSync(launcher, changed);
      assert.throws(() => verifyLocalBinary(root, "win32"), /unrecognized npm shim/);
    }
  });
}

test("requires an existing ordinary target file", () => {
  const root = fixture();
  const target = join(root, "node_modules/@deftai/directive/dist/bin.js");
  renameSync(target, target + ".retained");
  assert.throws(() => verifyLocalBinary(root, "win32"), /ENOENT/);
  mkdirSync(target);
  assert.throws(() => verifyLocalBinary(root, "win32"), /regular file/);
});

test("rejects local Node interpreter shadowing without deleting it", () => {
  for (const folder of ["", "node_modules/.bin"]) {
    for (const name of ["node", "node.exe", "NODE.EXE", "node.cmd", "node.ps1"]) {
      const root = fixture();
      const target = join(root, folder, name);
      writeFileSync(target, "inert shadow\n");
      assert.throws(() => verifyLocalBinary(root, "win32"), /local Node interpreter/);
      assert.equal(readFileSync(target, "utf8"), "inert shadow\n");
    }
  }
});

test("POSIX still rejects a regular Windows shim", () => {
  assert.throws(() => verifyLocalBinary(fixture(), "darwin"), /local CLI link/);
});

test("Git redirection names are rejected case-insensitively", () => {
  const key = "gIt_DiR";
  const previous = process.env[key];
  try {
    process.env[key] = "fictional-unused";
    assert.throws(() => assertNoGitRedirection(), /inherited Git override.*gIt_DiR/);
  } finally {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  }
});
