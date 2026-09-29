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
  resetAttempt as resetAttemptRaw,
  runLifecycle,
  verifyPin,
} from "../labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs";
import { git, safePath } from "../labs/fixtures/07-scope-lifecycle/safety.mjs";

const read = (path) => readFileSync(path, "utf8");
const hostTemporaryRoot = realpathSync(tmpdir());
const suiteTemporaryRoot = realpathSync(mkdtempSync(join(hostTemporaryRoot, "3ci-lab07-suite-")));
const originalTemporaryEnvironment = new Map(["TEMP", "TMP", "TMPDIR"].map((key) => [key, process.env[key]]));
for (const key of originalTemporaryEnvironment.keys()) process.env[key] = suiteTemporaryRoot;
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

test("Windows command path keeps the exact local install contract", () => {
  const root = createAttempt();
  assert.doesNotThrow(() => assertLearnerReadyPlatform("win32"));
  assert.equal(existsSync(join(root, "node_modules")), false);
  assert.equal(existsSync(join(root, ".npm-cache")), false);
  archiveAttempt(root);
});

test("create produces a unique guarded no-remote fixture with the exact manifest pin", () => {
  const root = createAttempt();
  assert.equal(guardAttempt(root), root);
  assert.equal(git(root, ["remote"]).trim(), "");
  assert.equal(git(root, ["branch", "--show-current"]).trim(), "training/module-07");
  const manifest = JSON.parse(read(join(root, "package.json")));
  assert.equal(manifest.devDependencies["@deftai/directive"], "0.119.11");
  assert.equal(manifest.overrides["@deftai/directive-core"], "0.119.11");
  archiveAttempt(root);
});

test("guard rejects the curriculum, a remote, and a changed pin without repairing them", () => {
  assert.throws(() => guardAttempt(new URL("../", import.meta.url).pathname), /temporary lab/);
  const root = createAttempt();
  const config = join(root, ".git/config");
  const originalConfig = read(config);
  writeFileSync(config, originalConfig + '\n[remote "unexpected"]\n\turl = https://example.invalid/fictional.git\n');
  assert.throws(() => guardAttempt(root), /no remote/);
  assert.match(read(config), /unexpected/);
  writeFileSync(config, originalConfig);
  const packagePath = join(root, "package.json");
  const originalPackage = read(packagePath);
  writeFileSync(packagePath, originalPackage.replace('"0.119.11"', '"0.119.3"'));
  assert.throws(() => guardAttempt(root), /0\.119\.11/);
  writeFileSync(packagePath, originalPackage);
  archiveAttempt(root);
});

test("safePath rejects traversal, absolute paths, and malformed Windows-like paths", () => {
  const root = createAttempt();
  for (const path of ["", ".", "..", "../outside", "/tmp/outside", "x/../../outside", "x\\outside", "C:/outside"]) {
    assert.throws(() => safePath(root, path), /bounded relative path/);
  }
  archiveAttempt(root);
});

test("reset creates a fresh attempt and preserves the failed attempt and its evidence", () => {
  const first = createAttempt();
  writeFileSync(join(dirname(first), "evidence", "failure.txt"), "preserved failure\n");
  const second = resetAttempt(first);
  assert.notEqual(first, second);
  assert.equal(read(join(dirname(first), "evidence", "failure.txt")), "preserved failure\n");
  assert.equal(guardAttempt(first), first);
  assert.equal(guardAttempt(second), second);
  archiveAttempt(first);
  archiveAttempt(second);
});

test("reclaim preview creates nothing and confirmed apply preserves the live Module 7 cache", (t) => {
  const emptyTemporaryRoot = realpathSync(mkdtempSync(join(tmpdir(), "3ci-lab07-reclaim-empty-")));
  t.after(() => rmSync(emptyTemporaryRoot, { force: true, recursive: true }));
  assert.deepEqual(previewReclaim(emptyTemporaryRoot), []);
  assert.equal(existsSync(join(emptyTemporaryRoot, "3ci-directive-lab-archive")), false);

  const live = createAttempt();
  mkdirSync(join(live, ".npm-cache"));
  writeFileSync(join(live, ".npm-cache", "live.txt"), "keep\n");
  const retired = createAttempt();
  mkdirSync(join(retired, ".npm-cache"));
  const archived = archiveAttempt(retired);
  const invalidArchive = join(dirname(archived), "3ci-directive-lab07-BAD001");
  mkdirSync(invalidArchive);

  assert.ok(previewReclaim().includes(archived));
  assert.equal(previewReclaim().includes(invalidArchive), false, "preview must skip an invalid matching archive without hiding valid targets");
  assert.throws(() => reclaimArchives([invalidArchive], { confirmed: true }), /archive destination/);
  rmSync(invalidArchive, { recursive: true });
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

test("reset and archive preserve a partial install without trusting a foreign target", () => {
  const partial = createAttempt();
  mkdirSync(join(partial, "node_modules"));
  assert.throws(() => guardAttempt(partial), /node_modules/);
  const fresh = resetAttempt(partial);
  assert.equal(guardAttempt(fresh), fresh);
  const archived = archiveAttempt(partial);
  assert.equal(existsSync(join(archived, "repo/node_modules")), true);
  archiveAttempt(fresh);

  const courseRoot = dirname(dirname(fileURLToPath(import.meta.url)));
  assert.throws(() => resetAttempt(courseRoot), /temporary lab/);
  assert.throws(() => archiveAttempt(courseRoot), /temporary lab/);
});

test("reset and archive retain the no-remote boundary", () => {
  const root = createAttempt();
  const config = join(root, ".git/config");
  const original = read(config);
  writeFileSync(config, original + '\n[remote "unexpected"]\n\turl = https://example.invalid/fictional.git\n');
  assert.throws(() => resetAttempt(root), /no remote/);
  assert.throws(() => archiveAttempt(root), /no remote/);
  writeFileSync(config, original);
  archiveAttempt(root);
});

test("reset preserves a drifted attempt and creates a clean replacement", () => {
  const drifted = createAttempt();
  const packagePath = join(drifted, "package.json");
  writeFileSync(packagePath, read(packagePath).replace('"0.119.11"', '"0.119.3"'));
  assert.throws(() => guardAttempt(drifted), /0\.119\.11/);
  const fresh = resetAttempt(drifted);
  assert.match(read(packagePath), /0\.119\.3/);
  assert.equal(guardAttempt(fresh), fresh);
  archiveAttempt(drifted);
  archiveAttempt(fresh);
});

test("run refuses missing live implementation intent before lifecycle mutation", () => {
  const root = createAttempt();
  assert.throws(() => runLifecycle(root), /--intent=implement/);
  assert.equal(existsSync(join(root, "xbrief/proposed/2026-01-15-fictional-delivery.xbrief.json")), true);
  archiveAttempt(root);
});

test("pinned task workflow records proposed failure, gated active success, completion, and cancellation", { timeout: 120_000 }, () => {
  const root = createAttempt();
  const inheritedNpmConfig = new Map([
    ["npm_config_registry", process.env.npm_config_registry],
    ["npm_config_always_auth", process.env.npm_config_always_auth],
  ]);
  process.env.npm_config_registry = "https://example.invalid/";
  process.env.npm_config_always_auth = "true";
  try {
    installAttempt(root);
  } finally {
    for (const [key, value] of inheritedNpmConfig) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
  assert.equal(verifyPin(root), "0.119.11");
  const evidence = runLifecycle(root, { intent: "implement" });
  assert.equal(evidence.baseline.engine, "0.119.11");
  assert.equal(evidence.steps.proposedDirectivePreflight.exitCode, 1);
  assert.notEqual(evidence.steps.proposedTaskPreflight.exitCode, 0);
  for (const name of ["promote", "activate", "cancel", "sessionStart", "sessionRitual", "activePreflight", "stampEvidence", "complete"]) {
    assert.equal(evidence.steps[name].exitCode, 0, `${name}: ${evidence.steps[name].stderr}`);
  }
  assert.deepEqual(evidence.final, {
    delivery: { folder: "completed", status: "completed" },
    cancellation: { folder: "cancelled", status: "cancelled" },
  });
  const evidenceRoot = join(dirname(root), "evidence");
  assert.equal(existsSync(join(evidenceRoot, "lifecycle-run.json")), true);
  const proposedEvidence = JSON.parse(read(join(evidenceRoot, "proposed-preflight.json")));
  assert.deepEqual(proposedEvidence.stateBeforePromotion, { folder: "proposed", status: "proposed" });
  assert.equal(git(root, ["remote"]).trim(), "");
  archiveAttempt(root);
});
