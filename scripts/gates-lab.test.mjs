import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  archiveAttempt,
  assertLearnerReadyPlatform,
  createAttempt,
  guardAttempt,
  installAttempt,
  recordGreen,
  recordRed,
  recordRefactor,
  resetAttempt,
  runAggregate,
  runLiteralAcceptance,
  verifyFinal,
  verifyPin,
} from "../labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs";
import { git } from "../labs/fixtures/10-testing-gates-and-evidence/safety.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(path, "utf8");

test("Windows command path keeps the exact local install contract", () => {
  const root = createAttempt();
  assert.doesNotThrow(() => assertLearnerReadyPlatform("win32"));
  assert.equal(existsSync(join(root, "node_modules")), false);
  assert.equal(existsSync(join(root, ".npm-cache")), false);
  archiveAttempt(root);
});

function addAverageTest(root) {
  const path = join(root, "test/summary.test.mjs");
  const before = read(path);
  writeFileSync(path, before.replace(
    "// Add the average behavior test here during the red step.",
    `test("reports an average and handles an empty list", () => {
  assert.deepEqual(summarize([2, 4, 6]), { count: 3, total: 12, average: 4 });
  assert.deepEqual(summarize([]), { count: 0, total: 0, average: null });
});`,
  ));
}

function implementAverage(root) {
  const path = join(root, "src/summary.mjs");
  const before = read(path);
  writeFileSync(path, before.replace(
    "return { count: values.length, total };",
    "return { count: values.length, total, average: values.length === 0 ? null : total / values.length };",
  ));
}

function refactorAverage(root) {
  const path = join(root, "src/summary.mjs");
  const before = read(path);
  writeFileSync(path, before.replace(
    "return { count: values.length, total, average: values.length === 0 ? null : total / values.length };",
    "const count = values.length;\n  const average = count === 0 ? null : total / count;\n  return { count, total, average };",
  ));
}

function completeQualityRecord(root) {
  const path = join(root, "quality-record.json");
  writeFileSync(path, `${JSON.stringify({
    schema: "3ci.training.module10.quality-record.v1",
    status: "COMPLETE",
    evidence: {
      red: "EXPECTED_FAILURE",
      green: "PASS",
      refactor: "PASS",
      literalAcceptance: "PASS",
      forwardCoverage: "PASS",
      firstFailingSubcheck: "quality:record",
      repair: "quality-record.json only",
      gateDefinitionsUnchanged: true,
    },
  }, null, 2)}\n`);
}

test("create produces a unique guarded no-remote Module 10 fixture", () => {
  const root = createAttempt();
  assert.equal(guardAttempt(root), root);
  assert.equal(git(root, ["remote"]).trim(), "");
  assert.equal(git(root, ["branch", "--show-current"]).trim(), "training/module-10");
  assert.throws(() => guardAttempt(repositoryRoot), /unique OS temporary lab repo/);
});

test("guard rejects a remote, wrong branch, and gate-definition edits", () => {
  const remoteRoot = createAttempt();
  git(remoteRoot, ["remote", "add", "origin", "https://example.invalid/northstar.git"]);
  assert.throws(() => guardAttempt(remoteRoot), /must have no remote/);

  const branchRoot = createAttempt();
  git(branchRoot, ["switch", "-c", "wrong-branch"]);
  assert.throws(() => guardAttempt(branchRoot), /training\/module-10/);

  const gateRoot = createAttempt();
  writeFileSync(join(gateRoot, "Taskfile.yml"), `${read(join(gateRoot, "Taskfile.yml"))}\n# weakened\n`);
  assert.throws(() => guardAttempt(gateRoot), /gate definition changed/);
});

test("full lab retains ordered red-green-refactor and aggregate diagnosis evidence", { timeout: 300_000 }, () => {
  const root = installAttempt(createAttempt());
  assert.equal(verifyPin(root), "0.119.2");

  addAverageTest(root);
  assert.equal(recordRed(root).finalStatus, "EXPECTED_FAILURE");

  implementAverage(root);
  assert.equal(recordGreen(root).finalStatus, "PASS");

  refactorAverage(root);
  assert.equal(recordRefactor(root).finalStatus, "PASS");
  assert.equal(runLiteralAcceptance(root).finalStatus, "PASS");

  const failed = runAggregate(root);
  assert.equal(failed.finalStatus, "EXPECTED_FAILURE");
  assert.equal(failed.firstFailingSubcheck, "quality:record");
  assert.match(failed.output, /quality record is incomplete/);

  completeQualityRecord(root);
  const final = verifyFinal(root);
  assert.equal(final.finalStatus, "PASS");
  assert.deepEqual(final.changedFiles, ["quality-record.json", "src/summary.mjs", "test/summary.test.mjs"]);
  assert.equal(final.gateDefinitionsUnchanged, true);
});

test("green rejects a test changed after the red checkpoint", { timeout: 300_000 }, () => {
  const root = installAttempt(createAttempt());
  addAverageTest(root);
  recordRed(root);
  writeFileSync(join(root, "test/summary.test.mjs"), `${read(join(root, "test/summary.test.mjs"))}\n// changed after red\n`);
  implementAverage(root);
  assert.throws(() => recordGreen(root), /focused test changed after the red checkpoint/);
});

test("reset creates a new guarded attempt and archive requires one explicit root", () => {
  const first = createAttempt();
  const second = resetAttempt(first);
  assert.notEqual(second, first);
  assert.equal(guardAttempt(first), first);
  assert.equal(guardAttempt(second), second);
  assert.throws(() => archiveAttempt(), /explicit absolute canonical lab root/);
});
