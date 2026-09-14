import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(read("package.json"));

test("ordinary training commands do not require symbolic-link capability", () => {
  for (const name of ["test:modules-4-5", "test:portability"]) {
    const command = packageJson.scripts?.[name];
    assert.equal(typeof command, "string", `${name} must exist`);
    assert.doesNotMatch(
      command,
      /verify-symlink-capability\.mjs|linked-path-safety\.test\.mjs|lab-helper-entry\.test\.mjs/,
    );
  }
});

test("full linked-path safety has one explicit fail-closed command", () => {
  assert.equal(
    packageJson.scripts?.["test:linked-path-safety"],
    "node scripts/verify-symlink-capability.mjs && node --test scripts/linked-path-safety.test.mjs",
  );
});

test("Windows privilege-dependent symbolic-link fixtures live in the dedicated safety suite", () => {
  const dedicatedPath = new URL("./linked-path-safety.test.mjs", import.meta.url);
  assert.equal(existsSync(dedicatedPath), true, "dedicated linked-path safety suite must exist");

  assert.doesNotMatch(
    read("scripts/projection-lab.test.mjs"),
    /test\([^\n]*(?:symlinked source|MAP symlink|symlinked package)/,
    "projection attack fixtures must not remain in the ordinary suite",
  );
  assert.doesNotMatch(
    read("scripts/windows-shim.test.mjs"),
    /\bsymlinkSync\b/,
    "Windows shim tests must remain privilege-free",
  );

  const dedicated = read("scripts/linked-path-safety.test.mjs");
  for (const boundary of [
    "alternate symbolic paths",
    "Windows launcher and target",
    "source ancestors",
    "MAP",
    "package graph",
  ]) {
    assert.match(dedicated, new RegExp(boundary), `dedicated suite must cover ${boundary}`);
  }
});
