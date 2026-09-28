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
  runReadiness,
  verifyImplementation,
  verifyPin,
} from "../labs/fixtures/10-implementation-golden-path/implementation-lab.mjs";
import { git, safePath } from "../labs/fixtures/10-implementation-golden-path/safety.mjs";

const read = (path) => readFileSync(path, "utf8");
const hostTemporaryRoot = realpathSync(tmpdir());
const suiteTemporaryRoot = realpathSync(mkdtempSync(join(hostTemporaryRoot, "3ci-lab10-suite-")));
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

test("create produces a unique guarded no-remote Module 10 fixture", () => {
  const root = createAttempt();
  assert.equal(guardAttempt(root), root);
  assert.equal(git(root, ["remote"]).trim(), "");
  assert.equal(git(root, ["branch", "--show-current"]).trim(), "training/module-10");
  const story = JSON.parse(read(join(root, "xbrief/active/fictional-greeting.xbrief.json")));
  assert.equal(story.plan.status, "running");
  assert.deepEqual(story.plan.metadata.file_scope, ["src/greeting.mjs"]);
  const manifest = JSON.parse(read(join(root, "package.json")));
  assert.equal(manifest.devDependencies["@deftai/directive"], "0.119.9");
  assert.equal(manifest.overrides["@deftai/directive-core"], "0.119.9");
  archiveAttempt(root);
});

test("guard rejects the curriculum, a remote, and an altered exact pin", () => {
  const courseRoot = dirname(dirname(fileURLToPath(import.meta.url)));
  assert.throws(() => guardAttempt(courseRoot), /temporary lab/);
  const root = createAttempt();
  const configPath = join(root, ".git/config");
  const originalConfig = read(configPath);
  writeFileSync(configPath, `${originalConfig}\n[remote "unexpected"]\n\turl = https://example.invalid/fictional.git\n`);
  assert.throws(() => guardAttempt(root), /no remote/);
  writeFileSync(configPath, originalConfig);
  const packagePath = join(root, "package.json");
  const originalPackage = read(packagePath);
  writeFileSync(packagePath, originalPackage.replace('"0.119.9"', '"0.119.3"'));
  assert.throws(() => guardAttempt(root), /0\.119\.9/);
  writeFileSync(packagePath, originalPackage);
  archiveAttempt(root);
});

test("safePath rejects traversal, absolute paths, and Windows-like escapes", () => {
  const root = createAttempt();
  for (const path of ["", ".", "..", "../outside", "/tmp/outside", "x/../../outside", "x\\outside", "C:/outside"]) {
    assert.throws(() => safePath(root, path), /bounded relative path/);
  }
  archiveAttempt(root);
});

test("reset preserves a failed attempt and creates a clean replacement", () => {
  const first = createAttempt();
  writeFileSync(join(dirname(first), "evidence", "failure.txt"), "preserved failure\n");
  mkdirSync(join(first, "node_modules"));
  const second = resetAttempt(first);
  assert.notEqual(first, second);
  assert.equal(read(join(dirname(first), "evidence", "failure.txt")), "preserved failure\n");
  assert.equal(existsSync(join(first, "node_modules")), true);
  assert.equal(guardAttempt(second), second);
  archiveAttempt(first);
  archiveAttempt(second);
});

test("reclaim is preview-first and deletes a confirmed Module 10 archive without touching the live cache", (t) => {
  const emptyTemporaryRoot = realpathSync(mkdtempSync(join(tmpdir(), "3ci-lab10-reclaim-empty-")));
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

test("readiness must precede the one-file implementation and final evidence", { timeout: 180_000 }, () => {
  const root = createAttempt();
  installAttempt(root);
  assert.equal(verifyPin(root), "0.119.9");
  assert.throws(() => verifyImplementation(root), /readiness evidence/);

  const greetingPath = join(root, "src/greeting.mjs");
  const originalGreeting = read(greetingPath);
  writeFileSync(greetingPath, `${originalGreeting}\n// premature mutation\n`);
  assert.throws(() => runReadiness(root), /clean checkpoint/);
  writeFileSync(greetingPath, originalGreeting);

  const storyPath = join(root, "xbrief/active/fictional-greeting.xbrief.json");
  const originalStory = read(storyPath);
  writeFileSync(storyPath, originalStory.replace('"status": "running"', '"status": "pending"'));
  assert.throws(() => runReadiness(root), /active\/running/);
  writeFileSync(storyPath, originalStory);

  git(root, ["switch", "-c", "wrong-branch"]);
  assert.throws(() => runReadiness(root), /training\/module-10/);
  git(root, ["switch", "training/module-10"]);

  const readiness = runReadiness(root);
  assert.equal(readiness.finalStatus, "READY");
  assert.equal(readiness.steps.focusedTest.exitCode, 1);
  assert.equal(readiness.steps.sessionRitual.exitCode, 0);
  assert.equal(readiness.steps.storyReady.exitCode, 0);
  assert.equal(readiness.steps.activePreflight.exitCode, 0);

  const cliPath = join(root, "src/cli.mjs");
  const originalCli = read(cliPath);
  writeFileSync(cliPath, `${originalCli}\n// unrelated change\n`);
  assert.throws(() => verifyImplementation(root), /only src\/greeting\.mjs/);
  writeFileSync(cliPath, originalCli);

  const readinessPath = join(dirname(root), "evidence", "readiness.json");
  const originalReadiness = read(readinessPath);
  writeFileSync(readinessPath, originalReadiness.replace('"finalStatus": "READY"', '"finalStatus": "INCOMPLETE"'));
  assert.throws(() => verifyImplementation(root), /readiness evidence/);
  writeFileSync(readinessPath, originalReadiness);

  writeFileSync(greetingPath, [
    "export function greeting(name) {",
    '  if (arguments.length > 0 && typeof name !== "string") throw new TypeError("name must be a string");',
    '  const recipient = name?.trim() || "teammate";',
    '  return `Hello, ${recipient}!`;',
    "}",
    "",
  ].join("\n"));
  const evidence = verifyImplementation(root);
  assert.equal(evidence.finalStatus, "PASS");
  assert.deepEqual(evidence.diff.files, ["src/greeting.mjs"]);
  assert.equal(evidence.steps.focusedTest.exitCode, 0);
  assert.equal(evidence.steps.namedCli.stdout.trim(), "Hello, Ada!");
  assert.equal(evidence.steps.fallbackCli.stdout.trim(), "Hello, teammate!");
  assert.equal(evidence.steps.diffCheck.exitCode, 0);
  archiveAttempt(root);
});
