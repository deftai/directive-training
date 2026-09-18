import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  archiveAttempt,
  assertLearnerReadyPlatform,
  createAttempt,
  guardAttempt,
  installAttempt,
  resetAttempt,
  runReadiness,
  verifyImplementation,
  verifyPin,
} from "../labs/fixtures/10-implementation-golden-path/implementation-lab.mjs";
import { git, safePath } from "../labs/fixtures/10-implementation-golden-path/safety.mjs";

const read = (path) => readFileSync(path, "utf8");

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
  assert.equal(manifest.devDependencies["@deftai/directive"], "0.119.2");
  assert.equal(manifest.overrides["@deftai/directive-core"], "0.119.2");
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
  writeFileSync(packagePath, originalPackage.replace('"0.119.2"', '"0.119.3"'));
  assert.throws(() => guardAttempt(root), /0\.119\.2/);
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

test("readiness must precede the one-file implementation and final evidence", { timeout: 180_000 }, () => {
  const root = createAttempt();
  installAttempt(root);
  assert.equal(verifyPin(root), "0.119.2");
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
