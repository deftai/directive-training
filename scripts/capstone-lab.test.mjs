import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  archiveAttempt,
  createAttempt,
  guardAttempt,
  main,
  verifyPin,
} from "../labs/fixtures/capstone-end-to-end/capstone-lab.mjs";
import { assertNoGitRedirection, git, safePath, sameFileSystemEntry } from "../labs/fixtures/capstone-end-to-end/safety.mjs";
import {
  isDirectExecution,
  main as workItemsMain,
  runCli,
} from "../labs/fixtures/capstone-end-to-end/src/cli.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(path, "utf8");
const readEvidence = (root, name) => JSON.parse(read(join(dirname(root), "evidence", name)));

function makeLauncher(prefix = "3ci-capstone-launch-") {
  return mkdtempSync(join(tmpdir(), prefix));
}

test("CLI direct-entry detection uses a filesystem-safe file URL", () => {
  const entryPath = join(makeLauncher(), "work-items # direct.mjs");
  assert.equal(isDirectExecution(entryPath, pathToFileURL(entryPath).href), true);
  assert.equal(isDirectExecution(entryPath, pathToFileURL(entryPath + ".other").href), false);
});

test("fixture behavior check avoids shell-dependent argument quoting", () => {
  const manifest = JSON.parse(read(join(repositoryRoot, "labs/fixtures/capstone-end-to-end/package.json")));
  assert.equal(manifest.scripts["check:behavior"], "node src/cli.mjs check");
  assert.throws(() => workItemsMain(["check"]), /addWorkItem is not implemented/);
  assert.throws(() => workItemsMain(["check", "unexpected"]), /Use: add/);
});

test("CLI parses supported commands and reports invalid input", () => {
  assert.throws(() => workItemsMain(["add", "Capture evidence"]), /addWorkItem is not implemented/);
  assert.throws(
    () => workItemsMain(["complete", "WI-001", '[{"id":"WI-001","title":"Orient","status":"open"}]']),
    /completeWorkItem is not implemented/,
  );
  assert.deepEqual(workItemsMain(["summary", '[{"id":"WI-001","title":"Orient","status":"done"}]']), {
    total: 1,
    open: 0,
    done: 1,
  });
  assert.throws(() => workItemsMain(["summary", "not-json"]), /valid JSON/);
  assert.throws(() => workItemsMain(["summary", "{}"]), /contain an array/);
  assert.throws(() => workItemsMain(["summary", "[null]"]), /id must use WI-NNN/);
  assert.throws(() => workItemsMain(["summary", '[{"id":"bad","title":"Orient","status":"open"}]']), /id must use WI-NNN/);
  assert.throws(() => workItemsMain(["summary", '[{"id":"WI-001","title":" ","status":"open"}]']), /title must be nonempty/);
  assert.throws(() => workItemsMain(["summary", '[{"id":"WI-001","title":"Orient","status":"blocked"}]']), /status must be open or done/);
  assert.throws(() => workItemsMain(["add"]), /Use: add/);
  assert.throws(() => workItemsMain(["add", "Evidence", "[]", "extra"]), /Use: add/);
  assert.throws(() => workItemsMain(["complete"]), /Use: add/);
  assert.throws(() => workItemsMain(["summary", "[]", "extra"]), /Use: add/);
  assert.throws(() => workItemsMain(["unknown"]), /Use: add/);

  const stdout = [];
  const stderr = [];
  assert.equal(runCli(["summary", "[]"], { stdout: (value) => stdout.push(value), stderr: (value) => stderr.push(value) }), 0);
  assert.deepEqual(stdout, ['{"total":0,"open":0,"done":0}']);
  assert.deepEqual(stderr, []);
  assert.equal(runCli(["unknown"], { stdout: (value) => stdout.push(value), stderr: (value) => stderr.push(value) }), 1);
  assert.match(stderr[0], /Work-items CLI stopped: Use: add/);
});

const greenImplementation = `
function validateItems(items) {
  if (!Array.isArray(items)) throw new TypeError("items must be an array of work items");
  for (const item of items) {
    if (!item || !/^WI-\\d{3}$/.test(item.id)) throw new TypeError("work-item id must use WI-NNN");
    if (typeof item.title !== "string" || item.title.trim() === "") throw new TypeError("work-item title must be nonempty");
    if (!['open', 'done'].includes(item.status)) throw new TypeError("work-item status must be open or done");
  }
}

export function addWorkItem(items, title) {
  validateItems(items);
  if (typeof title !== "string" || title.trim() === "") throw new TypeError("title must be a nonempty title");
  const highest = items.reduce((value, item) => Math.max(value, Number(item.id.slice(3))), 0);
  return [...items, { id: \`WI-\${String(highest + 1).padStart(3, "0")}\`, title: title.trim(), status: "open" }];
}

export function completeWorkItem(items, id) {
  validateItems(items);
  if (typeof id !== "string" || !/^WI-\\d{3}$/.test(id)) throw new TypeError("id must use WI-NNN");
  if (!items.some((item) => item.id === id)) throw new RangeError(\`work item \${id} not found\`);
  return items.map((item) => item.id === id ? { ...item, status: "done" } : { ...item });
}

export function summarizeWorkItems(items) {
  validateItems(items);
  return { total: items.length, open: items.filter((item) => item.status === "open").length, done: items.filter((item) => item.status === "done").length };
}
`.trimStart();

const reviewedImplementation = greenImplementation.replace(
  "const highest = items.reduce",
  `const normalizedTitle = title.trim().toLocaleLowerCase("en-US");
  if (items.some((item) => item.title.trim().toLocaleLowerCase("en-US") === normalizedTitle)) {
    throw new RangeError("title duplicates an existing work item");
  }
  const highest = items.reduce`,
);

test("create produces one unique guarded no-remote capstone repository", () => {
  const root = createAttempt({ callerRoot: makeLauncher() });
  assert.equal(main(["guard", root]), root);
  assert.equal(git(root, ["remote"]).trim(), "");
  assert.equal(git(root, ["branch", "--show-current"]).trim(), "training/capstone");
  assert.equal(dirname(dirname(root)), realpathSync(tmpdir()));
  assert.equal(sameFileSystemEntry(root, realpathSync.native(root)), true);
  assert.equal(sameFileSystemEntry(root, dirname(root)), false);

  const manifest = JSON.parse(read(join(root, "package.json")));
  assert.equal(manifest.private, true);
  assert.equal(manifest.devDependencies["@deftai/directive"], "0.112.0");
  const proposed = JSON.parse(read(join(root, "xbrief/proposed/fictional-work-items.xbrief.json")));
  assert.equal(proposed.plan.status, "proposed");
  assert.deepEqual(proposed.plan.metadata.file_scope, ["src/work-items.mjs"]);

  const projectPath = join(root, "xbrief/PROJECT-DEFINITION.xbrief.json");
  const originalProject = read(projectPath);
  const changedProject = JSON.parse(originalProject);
  changedProject.plan.narratives.ProjectRules = "weakened";
  writeFileSync(projectPath, JSON.stringify(changedProject, null, 2) + "\n");
  assert.throws(() => guardAttempt(root), /project definition changed/);
  writeFileSync(projectPath, originalProject);

  const storyPath = join(root, "xbrief/proposed/fictional-work-items.xbrief.json");
  const originalStory = read(storyPath);
  const changedStory = JSON.parse(originalStory);
  changedStory.plan.acceptance.commands = [];
  writeFileSync(storyPath, JSON.stringify(changedStory, null, 2) + "\n");
  assert.throws(() => guardAttempt(root), /story acceptance or scope changed/);
  writeFileSync(storyPath, originalStory);

  const hooksPath = join(root, ".git/hooks");
  mkdirSync(hooksPath);
  writeFileSync(join(hooksPath, "unexpected.txt"), "not executable\n");
  assert.throws(() => guardAttempt(root), /private Git hooks/);
  renameSync(hooksPath, join(dirname(root), "evidence", "quarantined-hooks"));
  assert.equal(guardAttempt(root), root);
  archiveAttempt(root);

  const originalDirectory = process.cwd();
  let cliRoot;
  try {
    process.chdir(makeLauncher());
    cliRoot = main(["create"]);
  } finally {
    process.chdir(originalDirectory);
  }
  assert.equal(main(["guard", cliRoot]), cliRoot);
  main(["archive", cliRoot]);
  assert.throws(() => main(["unknown"]), /Use: create/);
});

test("creation and guards reject unsafe roots before product mutation", () => {
  const missingLauncher = join(tmpdir(), `3ci-capstone-launch-missing-${process.pid}-${Date.now()}`);
  assert.equal(existsSync(missingLauncher), false);
  assert.throws(() => createAttempt({ callerRoot: missingLauncher }), /existing launcher directory/);
  assert.throws(() => createAttempt({ callerRoot: repositoryRoot }), /outside the training repository/);
  assert.throws(() => createAttempt({ callerRoot: resolve(tmpdir()) }), /dedicated temporary launcher/);

  const linkedLauncherTarget = makeLauncher();
  const linkedLauncher = join(tmpdir(), `3ci-capstone-launch-link-${process.pid}-${Date.now()}`);
  symlinkSync(linkedLauncherTarget, linkedLauncher, process.platform === "win32" ? "junction" : "dir");
  assert.throws(() => createAttempt({ callerRoot: linkedLauncher }), /launcher itself must not be a symlink/);

  const gitLauncher = makeLauncher();
  git(gitLauncher, ["init"]);
  assert.throws(() => createAttempt({ callerRoot: gitLauncher }), /must not be a Git repository/);

  const reusedParent = join(makeLauncher(), "3ci-directive-capstone-reused");
  mkdirSync(reusedParent);
  assert.throws(() => createAttempt({ callerRoot: makeLauncher(), attemptParent: reusedParent }), /must not already exist/);
  assert.equal(existsSync(join(reusedParent, "repo")), false);

  const nestedParent = join(makeLauncher(), "3ci-directive-capstone-NEST01");
  assert.throws(() => createAttempt({ callerRoot: makeLauncher(), attemptParent: nestedParent }), /unique direct child/);
  assert.equal(existsSync(nestedParent), false);

  assert.throws(() => guardAttempt(repositoryRoot), /unique OS temporary capstone repo/);
  assert.throws(() => assertNoGitRedirection({ GIT_DIR: "/tmp/redirected" }), /GIT_DIR/);
});

test("safe paths reject traversal, absolute paths, links, and 50 malformed inputs", () => {
  const root = createAttempt({ callerRoot: makeLauncher() });
  for (const path of ["", ".", "..", "../outside", "/tmp/outside", "x/../../outside", "x\\outside", "C:/outside"]) {
    assert.throws(() => safePath(root, path), /bounded relative path/);
  }
  for (let index = 0; index < 50; index += 1) {
    assert.throws(() => safePath(root, `segment-${index}/../escape`), /bounded relative path/);
  }
  const outside = makeLauncher("3ci-capstone-outside-");
  symlinkSync(outside, join(root, "linked-outside"), process.platform === "win32" ? "junction" : "dir");
  assert.throws(() => safePath(root, "linked-outside/file.txt"), /symlink/);
  assert.throws(() => archiveAttempt(root), /contains a symlink/);
});

test("reset preserves the failed attempt and archive requires one exact root", () => {
  const first = createAttempt({ callerRoot: makeLauncher() });
  writeFileSync(join(dirname(first), "evidence", "failure.txt"), "preserved failure\n");
  const second = main(["reset", first]);

  assert.notEqual(first, second);
  assert.equal(read(join(dirname(first), "evidence", "failure.txt")), "preserved failure\n");
  assert.equal(guardAttempt(first), first);
  assert.equal(guardAttempt(second), second);
  assert.throws(() => archiveAttempt(), /one explicit absolute canonical capstone root/);
  main(["archive", first]);
  main(["archive", second]);
});

test("full rehearsal enforces ordered evidence through local closeout", { timeout: 600_000 }, () => {
  const root = createAttempt({ callerRoot: makeLauncher() });
  const lifecycleKeepPath = "xbrief/active/.gitkeep";
  writeFileSync(join(root, lifecycleKeepPath), "");
  assert.equal(main(["install", root]), "OK: installed Directive 0.112.0");
  assert.equal(git(root, ["ls-files", "--error-unmatch", lifecycleKeepPath]).trim(), lifecycleKeepPath);
  assert.equal(verifyPin(root), "0.112.0");
  assert.throws(() => main(["red", root]), /expected READY stage/);

  const toolProbe = join(root, ".lab-tools", "unexpected-tool");
  writeFileSync(toolProbe, "ignored control-plane mutation\n", { flag: "wx" });
  assert.throws(() => main(["orient", root]), /protected control tree changed: \.lab-tools/);
  renameSync(toolProbe, join(dirname(root), "evidence", "quarantined-tool"));

  const depositProbe = join(root, ".deft", "core", "unexpected-control-file");
  writeFileSync(depositProbe, "ignored deposit mutation\n", { flag: "wx" });
  assert.throws(() => main(["orient", root]), /protected control tree changed: \.deft\/core/);
  renameSync(depositProbe, join(dirname(root), "evidence", "quarantined-deposit-file"));

  assert.equal(main(["orient", root]), '"PASS"');

  const activationProbe = join(root, "unexpected-before-activation.txt");
  writeFileSync(activationProbe, "unexpected mutation\n", { flag: "wx" });
  assert.throws(() => main(["activate", root]), /clean orientation checkpoint/);
  assert.equal(existsSync(join(root, "xbrief/proposed/fictional-work-items.xbrief.json")), true);
  assert.equal(existsSync(join(root, "xbrief/active/fictional-work-items.xbrief.json")), false);
  renameSync(activationProbe, join(dirname(root), "evidence", "quarantined-activation-file"));

  assert.equal(main(["activate", root]), '"PASS"');
  assert.equal(main(["ready", root]), '"READY"');
  const readiness = readEvidence(root, "readiness.json");
  assert.equal(readiness.finalStatus, "READY");
  assert.equal(readiness.storyReady.exitCode, 0);
  assert.equal(readiness.activePreflight.exitCode, 0);

  assert.equal(main(["red", root]), '"EXPECTED_FAILURE"');
  const red = readEvidence(root, "red.json");
  assert.equal(red.finalStatus, "EXPECTED_FAILURE");
  assert.equal(red.focused.exitCode, 1);
  assert.match(red.focused.stdout + red.focused.stderr, /not implemented|Capture capstone evidence/);

  const sourcePath = join(root, "src/work-items.mjs");
  writeFileSync(sourcePath, greenImplementation);
  assert.equal(main(["green", root]), '"PASS"');
  assert.equal(main(["focused", root]), '"PASS"');
  assert.equal(main(["literal", root]), '"PASS"');

  assert.equal(main(["aggregate", root]), '"EXPECTED_FAILURE"');
  const aggregate = readEvidence(root, "aggregate-failure.json");
  assert.equal(aggregate.finalStatus, "EXPECTED_FAILURE");
  assert.equal(aggregate.firstFailingSubcheck, "review:evidence");
  assert.match(aggregate.output, /pre-PR review evidence is missing/);

  assert.equal(main(["pre-pr", root]), '"FINDING_RECORDED"');
  const review = readEvidence(root, "pre-pr.json");
  assert.equal(review.finalStatus, "FINDING_RECORDED");
  assert.equal(review.findings[0].severity, "P1");
  assert.equal(review.diffUnchanged, true);

  writeFileSync(sourcePath, reviewedImplementation);
  assert.equal(main(["review", root]), '"PASS"');
  const resolved = readEvidence(root, "review-resolution.json");
  assert.equal(resolved.finalStatus, "PASS");
  assert.equal(resolved.findingsResolved, 1);

  assert.equal(main(["close", root]), '"PASS"');
  const closed = readEvidence(root, "closeout.json");
  assert.equal(closed.finalStatus, "PASS");
  assert.equal(closed.work.status, "implemented");
  assert.equal(closed.ship.status, "not_started");
  assert.equal(closed.gate.status, "local_pass");
  assert.equal(closed.proof_status, "n/a-no-remote-claim");
  assert.equal(git(root, ["remote"]).trim(), "");
  main(["archive", root]);
});
