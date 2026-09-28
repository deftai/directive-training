import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  archiveAttempt as archiveAttemptRaw,
  assertLearnerReadyPlatform,
  createAttempt as createAttemptRaw,
  guardAttempt,
  installAttempt,
  main,
  previewReclaim,
  reclaimArchives,
  recordGreen,
  recordRed,
  recordRefactor,
  resetAttempt as resetAttemptRaw,
  runAggregate,
  runLiteralAcceptance,
  verifyFinal,
  verifyPin,
} from "../labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs";
import { git } from "../labs/fixtures/11-testing-gates-and-evidence/safety.mjs";

const archivedForCleanup = new Set();
const parentsForCleanup = new Set();
function createAttempt(...args) {
  const root = createAttemptRaw(...args);
  parentsForCleanup.add(dirname(root));
  return root;
}
function resetAttempt(...args) {
  const root = resetAttemptRaw(...args);
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
import { lab11RetainedLiteralStdoutTokens } from "./verify-module-11.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(path, "utf8");
const hostTemporaryRoot = realpathSync(tmpdir());
const suiteTemporaryRoot = realpathSync(mkdtempSync(join(hostTemporaryRoot, "3ci-lab11-suite-")));
const originalTemporaryEnvironment = new Map(["TEMP", "TMP", "TMPDIR"].map((key) => [key, process.env[key]]));
for (const key of originalTemporaryEnvironment.keys()) process.env[key] = suiteTemporaryRoot;

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
    schema: "3ci.training.module11.quality-record.v1",
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

test("create produces a unique guarded no-remote Module 11 fixture", () => {
  const root = createAttempt();
  assert.equal(guardAttempt(root), root);
  assert.equal(git(root, ["remote"]).trim(), "");
  assert.equal(git(root, ["branch", "--show-current"]).trim(), "training/module-11");
  assert.throws(() => guardAttempt(repositoryRoot), /unique OS temporary lab repo/);
});

test("guard rejects a remote, wrong branch, and gate-definition edits", () => {
  const remoteRoot = createAttempt();
  git(remoteRoot, ["remote", "add", "origin", "https://example.invalid/northstar.git"]);
  assert.throws(() => guardAttempt(remoteRoot), /must have no remote/);

  const branchRoot = createAttempt();
  git(branchRoot, ["switch", "-c", "wrong-branch"]);
  assert.throws(() => guardAttempt(branchRoot), /training\/module-11/);

  const gateRoot = createAttempt();
  writeFileSync(join(gateRoot, "Taskfile.yml"), `${read(join(gateRoot, "Taskfile.yml"))}\n# weakened\n`);
  assert.throws(() => guardAttempt(gateRoot), /gate definition changed/);
});

test("full lab retains ordered red-green-refactor and aggregate diagnosis evidence", { timeout: 300_000 }, () => {
  const root = installAttempt(createAttempt());
  assert.equal(verifyPin(root), "0.119.9");

  addAverageTest(root);
  assert.equal(recordRed(root).finalStatus, "EXPECTED_FAILURE");

  implementAverage(root);
  assert.equal(recordGreen(root).finalStatus, "PASS");

  refactorAverage(root);
  assert.equal(recordRefactor(root).finalStatus, "PASS");
  const literal = runLiteralAcceptance(root);
  assert.equal(literal.finalStatus, "PASS");
  const retained = JSON.parse(read(join(root, "..", "evidence", "literal.json")));
  assert.equal(retained.literalAcceptance.exitCode, 0);
  const stdout = retained.literalAcceptance.stdout;
  for (const token of lab11RetainedLiteralStdoutTokens) {
    assert.ok(stdout.includes(token), `literal.json.literalAcceptance.stdout missing ${token}`);
  }

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

test("reclaim previews at zero-allocation and removes only a confirmed Module 11 archive", (t) => {
  const emptyTemporaryRoot = realpathSync(mkdtempSync(join(tmpdir(), "3ci-lab11-reclaim-empty-")));
  t.after(() => rmSync(emptyTemporaryRoot, { force: true, recursive: true }));
  assert.deepEqual(previewReclaim(emptyTemporaryRoot), []);
  assert.equal(existsSync(join(emptyTemporaryRoot, "3ci-directive-lab-archive")), false);

  const live = createAttempt();
  mkdirSync(join(live, ".npm-cache"));
  writeFileSync(join(live, ".npm-cache", "live.txt"), "keep\n");
  const retired = createAttempt();
  mkdirSync(join(retired, ".npm-cache"));
  const archived = archiveAttempt(retired);

  assert.ok(previewReclaim().includes(archived));
  assert.ok(main(["reclaim"]).split(/\r?\n/).includes(archived));
  assert.throws(() => reclaimArchives([archived]), /explicit confirmation/);
  assert.throws(() => reclaimArchives([live], { confirmed: true }), /archive destination/);
  assert.equal(main(["reclaim", "--confirm", archived]), "reclaimed=" + archived);
  assert.equal(existsSync(archived), false);
  assert.equal(read(join(live, ".npm-cache", "live.txt")), "keep\n");

  const liveArchive = archiveAttempt(live);
  const replacement = resetAttempt(liveArchive);
  assert.equal(guardAttempt(replacement), replacement);
  assert.equal(read(join(liveArchive, "repo/.npm-cache/live.txt")), "keep\n");
  reclaimArchives([liveArchive], { confirmed: true });
  assert.equal(existsSync(join(liveArchive, "repo/.npm-cache")), false);
  reclaimArchives([archiveAttempt(replacement)], { confirmed: true });
});
