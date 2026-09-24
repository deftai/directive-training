import assert from "node:assert/strict";
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { verifyCapstone } from "./verify-capstone.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const copyPaths = [
  ".github",
  "CHANGELOG.md",
  "LICENSE",
  "README.md",
  "assessments",
  "curriculum",
  "labs",
  "maintainers",
  "package.json",
  "references",
  "scripts",
  "solutions",
  "templates",
  "xbrief",
];
const learningScope = "2026-09-11-capstone-solo-lifecycle-learning-experience.xbrief.json";
const parentScope = "xbrief/proposed/2026-09-05-disposable-end-to-end-capstone.xbrief.json";
const copiedRoots = new Set();

afterEach(() => {
  for (const root of copiedRoots) rmSync(root, { force: true, recursive: true });
  copiedRoots.clear();
});

function copiedRepository() {
  const root = mkdtempSync(join(tmpdir(), "capstone-content-contract-"));
  copiedRoots.add(root);
  for (const source of copyPaths) {
    const destination = join(root, source);
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(join(repositoryRoot, source), destination, { recursive: true });
  }
  return root;
}

function changedCopy(path, transform) {
  const root = copiedRepository();
  const target = join(root, path);
  const before = readFileSync(target, "utf8").replace(/\r\n/g, "\n");
  const after = transform(before);
  assert.notEqual(after, before, "negative mutation must change " + path);
  writeFileSync(target, after);
  return root;
}

function withoutFirst(body, snippet) {
  const index = body.indexOf(snippet);
  assert.ok(index >= 0, "mutation snippet must exist in the copied artifact");
  return body.slice(0, index) + body.slice(index + snippet.length);
}

function replaceFirst(body, snippet, replacement) {
  const index = body.indexOf(snippet);
  assert.ok(index >= 0, "mutation snippet must exist in the copied artifact");
  return body.slice(0, index) + replacement + body.slice(index + snippet.length);
}

function alternateLifecycleCopy() {
  const root = copiedRepository();
  const startsActive = existsSync(join(root, "xbrief", "active", learningScope));
  const sourceFolder = startsActive ? "active" : "completed";
  const targetFolder = startsActive ? "completed" : "active";
  const source = join(root, "xbrief", sourceFolder, learningScope);
  const target = join(root, "xbrief", targetFolder, learningScope);
  assert.ok(existsSync(source), "copied repository must contain one learning scope");
  renameSync(source, target);

  const scope = JSON.parse(readFileSync(target, "utf8"));
  scope.plan.status = targetFolder === "completed" ? "completed" : "running";
  for (const item of scope.plan.items) item.status = targetFolder === "completed" ? "completed" : "pending";
  writeFileSync(target, JSON.stringify(scope, null, 2) + "\n");

  const parentPath = join(root, parentScope);
  const parent = JSON.parse(readFileSync(parentPath, "utf8"));
  const reference = parent.plan.references.find(({ uri }) => uri.endsWith(learningScope));
  assert.ok(reference, "parent must reference the learning scope");
  reference.uri = targetFolder + "/" + learningScope;
  writeFileSync(parentPath, JSON.stringify(parent, null, 2) + "\n");
  return { root, lifecycle: targetFolder };
}

test("capstone content contract accepts active and completed lifecycle states", () => {
  assert.ok(verifyCapstone(repositoryRoot).artifactCount >= 30);
  const alternate = alternateLifecycleCopy();
  assert.equal(verifyCapstone(alternate.root).lifecycle, alternate.lifecycle);
});

test("capstone content contract accepts CRLF-authored Markdown", () => {
  const root = copiedRepository();
  const target = join(root, "labs", "capstone-end-to-end.md");
  const body = readFileSync(target, "utf8").replace(/\r?\n/g, "\r\n");
  writeFileSync(target, body);
  assert.ok(verifyCapstone(root).artifactCount >= 30);
});

test("verifier rejects one Task 1 fence of orient then activate", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) => replaceFirst(
    body,
    'node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" orient "$CAPSTONE_ROOT"\n```',
    'node "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" orient "$CAPSTONE_ROOT"\nnode "$COURSE_ROOT/labs/fixtures/capstone-end-to-end/capstone-lab.mjs" activate "$CAPSTONE_ROOT"\n```',
  ));
  assert.throws(() => verifyCapstone(root), /orient then activate in one fence/);
});

test("verifier rejects a missing assessment artifact", () => {
  const root = copiedRepository();
  renameSync(
    join(root, "assessments", "capstone-end-to-end.md"),
    join(root, "assessments", "capstone-missing.md"),
  );
  assert.throws(() => verifyCapstone(root), /missing required artifact/);
});

test("verifier rejects a course-entry prerequisite without a Python presence verdict", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    /- a resolvable Python[\s\S]*?;\n/,
    "- Python is optional;\n",
  ));
  assert.throws(() => verifyCapstone(root), /course entry must require a resolvable Python interpreter/);
});

for (const [lab, replacement] of [
  ["10", "Labs 7, 11, and the capstone require it"],
  ["11", "Labs 7, 10, and the capstone require it"],
]) {
  test(`verifier rejects a course-entry Python prerequisite that omits Lab ${lab}`, () => {
    const root = changedCopy("curriculum/README.md", (body) => body.replace(
      "Labs 7, 10, 11, and the capstone require it",
      replacement,
    ));
    assert.throws(
      () => verifyCapstone(root),
      /Python prerequisite must cover Labs 7, 10, 11, and the capstone/,
    );
  });
}

test("verifier rejects turning verified Python evidence into a learner version floor", () => {
  const root = changedCopy("curriculum/README.md", (body) =>
    body + "\nPython 3.13.13 or newer is required for every learner.\n");
  assert.throws(() => verifyCapstone(root), /must not impose a Python version floor or equality/);
});

test("verifier rejects a course-entry prerequisite without the isolated-PATH rationale", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "because their helpers\n  construct an isolated `PATH`",
    "as a general setup convention",
  ));
  assert.throws(() => verifyCapstone(root), /helper-isolated PATH requirement/);
});

test("verifier rejects a changed capstone Windows Python lookup order", () => {
  const root = changedCopy("labs/fixtures/capstone-end-to-end/capstone-lab.mjs", (body) => replaceFirst(
    body,
    '["python", "python3", "py"]',
    '["py", "python3", "python"]',
  ));
  assert.throws(() => verifyCapstone(root), /Windows Python lookup order changed/);
});

test("verifier rejects a changed capstone POSIX Python lookup order", () => {
  const root = changedCopy("labs/fixtures/capstone-end-to-end/capstone-lab.mjs", (body) => replaceFirst(
    body,
    '["python3", "python"]',
    '["python", "python3"]',
  ));
  assert.throws(() => verifyCapstone(root), /POSIX Python lookup order changed/);
});

test("verifier rejects a helper that drops the concrete preflight path", () => {
  const root = changedCopy("labs/fixtures/capstone-end-to-end/capstone-lab.mjs", (body) => replaceFirst(
    body,
    "process.env.CAPSTONE_PYTHON",
    "undefined",
  ));
  assert.throws(() => verifyCapstone(root), /retain the preflight's concrete interpreter path/);
});

test("verifier rejects a changed documented Windows Python lookup order", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) => replaceFirst(
    body,
    '@("python", "python3", "py")',
    '@("py", "python3", "python")',
  ));
  assert.throws(() => verifyCapstone(root), /Windows start must resolve python, python3, then py/);
});

test("verifier rejects a documented POSIX lookup that does not start with python3", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) => replaceFirst(
    body,
    "env python3 -c",
    "env python2 -c",
  ));
  assert.throws(() => verifyCapstone(root), /resolve one concrete interpreter in python3, python order/);
});

test("verifier rejects a capstone Python preflight that admits shell functions", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) => replaceFirst(
    body,
    "env python3 -c",
    "python3 -c",
  ));
  assert.throws(() => verifyCapstone(root), /resolve one concrete interpreter in python3, python order/);
});

test("verifier rejects a capstone preflight that changes the selected Python command", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) => replaceFirst(
    body,
    'CAPSTONE_PYTHON="$(env python3 -c',
    'CAPSTONE_PYTHON="$(env python -c',
  ));
  assert.throws(() => verifyCapstone(root), /resolve one concrete interpreter in python3, python order/);
});

test("POSIX env Python probing bypasses functions and unusable PATH entries", { skip: process.platform === "win32" }, (t) => {
  const root = mkdtempSync(join(tmpdir(), "capstone-python-probe-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  const blockedFileDirectory = join(root, "blocked-file");
  const blockedDirectory = join(root, "blocked-directory");
  const executableDirectory = join(root, "executable");
  for (const directory of [blockedFileDirectory, blockedDirectory, executableDirectory]) mkdirSync(directory);
  writeFileSync(join(blockedFileDirectory, "python3"), "not executable\n");
  chmodSync(join(blockedFileDirectory, "python3"), 0o644);
  mkdirSync(join(blockedDirectory, "python3"));
  const hostLookup = spawnSync("sh", ["-c", "command -v python3 || command -v python"], { encoding: "utf8" });
  assert.equal(hostLookup.status, 0, "the regression requires a host Python interpreter");
  symlinkSync(realpathSync(hostLookup.stdout.trim()), join(executableDirectory, "python3"));
  const env = {
    ...process.env,
    PATH: [blockedFileDirectory, blockedDirectory, executableDirectory, process.env.PATH ?? ""].join(delimiter),
  };
  const masked = spawnSync("sh", ["-c", "python3() { return 91; }; python3 --version"], { env });
  assert.equal(masked.status, 91, "the control must prove a shell function masks direct lookup");
  const external = spawnSync("sh", ["-c", "python3() { return 91; }; env python3 -c 'import os, sys; print(os.path.realpath(sys.executable))'"], { encoding: "utf8", env });
  assert.equal(external.status, 0, "env must bypass the function and skip unusable PATH candidates");
  assert.equal(realpathSync(external.stdout.trim()), realpathSync(hostLookup.stdout.trim()), "the probe must emit the concrete interpreter path");
});

test("verifier rejects a POSIX isolatedEnv that exposes the host Python directory", () => {
  const root = changedCopy("labs/fixtures/capstone-end-to-end/capstone-lab.mjs", (body) => replaceFirst(
    body,
    ': ["/usr/bin", "/bin"];',
    ': [dirname(findPythonExecutable()), "/usr/bin", "/bin"];',
  ));
  assert.throws(() => verifyCapstone(root), /keep the host Python directory out of POSIX PATH/);
});

test("verifier rejects an isolatedEnv that does not resolve Python before install", () => {
  const root = changedCopy("labs/fixtures/capstone-end-to-end/capstone-lab.mjs", (body) => replaceFirst(
    body,
    "const pythonExecutable = findPythonExecutable();",
    "const pythonExecutable = process.execPath;",
  ));
  assert.throws(() => verifyCapstone(root), /resolve Python before constructing PATH/);
});

test("verifier rejects POSIX shims that omit the selected python3 alias", () => {
  const root = changedCopy("labs/fixtures/capstone-end-to-end/capstone-lab.mjs", (body) => replaceFirst(
    body,
    'tools.set("python3", pythonExecutable)',
    'tools.set("python2", pythonExecutable)',
  ));
  assert.throws(() => verifyCapstone(root), /bind python3 to the selected interpreter/);
});

const windowsPowerShellVersionGuard =
  "if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required' }\n";
const fakeCourseRoot = "/absolute/path/to/directive-training";

for (const [title, transform, expected] of [
  [
    "a fake Windows course root instead of learner input",
    (body) => body
      .replace(/if \(\[string\]::IsNullOrWhiteSpace\(\$env:DIRECTIVE_TRAINING_ROOT\)\) \{[\s\S]*?\}\r?\n/, "")
      .replace(
        "$CourseRoot = [IO.Path]::GetFullPath($env:DIRECTIVE_TRAINING_ROOT).TrimEnd([IO.Path]::DirectorySeparatorChar)",
        '$CourseRoot = (Resolve-Path "' + fakeCourseRoot + '").Path',
      ),
    /DIRECTIVE_TRAINING_ROOT|fake absolute clone path/,
  ],
  [
    "a hardcoded fake clone path beside learner input",
    (body) => replaceFirst(
      body,
      "$CourseRoot = [IO.Path]::GetFullPath($env:DIRECTIVE_TRAINING_ROOT).TrimEnd([IO.Path]::DirectorySeparatorChar)",
      '$CourseRoot = [IO.Path]::GetFullPath($env:DIRECTIVE_TRAINING_ROOT).TrimEnd([IO.Path]::DirectorySeparatorChar)\n$CourseRoot = (Resolve-Path "' + fakeCourseRoot + '").Path',
    ),
    /fake absolute clone path/,
  ],
  [
    "a missing PowerShell 7.4 first-statement guard on the Windows start",
    (body) => withoutFirst(body, windowsPowerShellVersionGuard),
    /must throw on PowerShell below 7\.4/,
  ],
  [
    "a PowerShell 7.4 guard moved behind Windows start setup",
    (body) => replaceFirst(
      withoutFirst(body, windowsPowerShellVersionGuard),
      '$ErrorActionPreference = "Stop"\n',
      '$ErrorActionPreference = "Stop"\n' + windowsPowerShellVersionGuard,
    ),
    /first statement/,
  ],
  [
    "a non-throwing PowerShell 7.4 first-statement guard on the Windows start",
    (body) => replaceFirst(
      body,
      windowsPowerShellVersionGuard,
      "if ($PSVersionTable.PSVersion -lt [version]'7.4') { Write-Host 'unsupported' }\n",
    ),
    /must throw on PowerShell below 7\.4/,
  ],
]) {
  test("verifier rejects " + title, () => {
    const root = changedCopy("labs/capstone-end-to-end.md", transform);
    assert.throws(() => verifyCapstone(root), expected);
  });
}

test("verifier rejects a missing outcome mapping", () => {
  const root = changedCopy("assessments/capstone-end-to-end.md", (body) =>
    body.replace("| `CAP.3` — Review, classify, repair, and re-check the current product", "| Review outcome omitted"));
  assert.throws(() => verifyCapstone(root), /outcomes.*map.*CAP\.3/i);
});

test("verifier rejects red evidence assigned to CAP.1", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) =>
    body.replace(
      "| `CAP.1` | A command-free checkpoint routes `CAP-DC-R1` as not bind-ready without converting an ingest-ready catalog chip into authority; exact runtime observation, orientation, lifecycle activation, session ritual, story-ready, and preflight then establish mutation readiness for the separate fixture | `CAP-DC-01` row and runtime note, `orientation.json`, `scope.json`, `readiness.json` |",
      "| `CAP.1` | A command-free checkpoint routes `CAP-DC-R1` as not bind-ready without converting an ingest-ready catalog chip into authority; exact runtime observation, orientation, lifecycle activation, session ritual, story-ready, preflight, and red then establish mutation readiness for the separate fixture | `CAP-DC-01` row and runtime note, `orientation.json`, `scope.json`, `readiness.json`, `red.json` |",
    ));
  assert.throws(() => verifyCapstone(root), /assign red\.json to CAP\.2, not CAP\.1/);
});

test("verifier rejects CAP.1 hints that absorb red evidence", () => {
  const root = changedCopy("assessments/capstone-end-to-end.md", (body) =>
    body.replace(
      "Inspect the private `CAP-DC-01` row plus `orientation.json`, `scope.json`, and\n`readiness.json`. Do not edit helper evidence.",
      "Inspect the private `CAP-DC-01` row plus `orientation.json`, `scope.json`, `readiness.json`, and `red.json`. Do not edit helper evidence.",
    ));
  assert.throws(() => verifyCapstone(root), /CAP\.1 hints must not absorb CAP\.2 red evidence/);
});

test("verifier rejects an ingest-ready catalog chip treated as bind readiness", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) => body.replace(
    "| `CAP-DC-01` | The mechanism-shaped envelope change has unresolved `audit:cap-trust-boundary reading=asserted`, an ingest-ready catalog chip, and no admitted completed-arc record | `route` | `CAP-DC-R1` | `not bind-ready` |",
    "| `CAP-DC-01` | The mechanism-shaped envelope change has unresolved `audit:cap-trust-boundary reading=asserted`, an ingest-ready catalog chip, and no admitted completed-arc record | `route` | `CAP-DC-R1` | `bind-ready` |",
  ));
  assert.throws(() => verifyCapstone(root), /checkpoint must remain not bind-ready/);
});

test("verifier rejects an invented design-critique chip", () => {
  const root = changedCopy("curriculum/capstone-end-to-end.md", (body) => body.replace(
    "design-critique:ingest-ready",
    "design-critique:synthesis-ready",
  ));
  assert.throws(() => verifyCapstone(root), /unknown design-critique chip design-critique:synthesis-ready/);
});

test("verifier rejects synthesis-chip terminology in the solution summary", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) => body.replace(
    "The ingest-ready\ncatalog chip authorizes nothing.",
    "The synthesis\nchip authorizes nothing.",
  ));
  assert.throws(() => verifyCapstone(root), /must use ingest-ready catalog chip vocabulary/);
});

test("verifier rejects a checkpoint that omits the independent audit", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) => body.replace(
    "Obtain an independent audit of `audit:cap-trust-boundary` and require the missing admitted completed-arc record before later bind or ingest",
    "Accept the ingest-ready catalog chip and require the missing admitted completed-arc record before later bind or ingest",
  ));
  assert.throws(() => verifyCapstone(root), /safe action must require the named independent audit/);
});

test("verifier rejects a checkpoint that turns synthesis into implementation authority", () => {
  const root = changedCopy("assessments/capstone-end-to-end.md", (body) => body.replace(
    "The ingest-ready catalog chip and proposed synthesis authorize neither activation nor implementation",
    "The ingest-ready catalog chip and proposed synthesis authorize activation and implementation",
  ));
  assert.throws(() => verifyCapstone(root), /deny activation and implementation authority/);
});

test("verifier rejects unconditional reset recovery for invalid identity", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) =>
    body.replace(
      "Use failure-specific recovery; run `reset` only while identity\n  still passes. Otherwise preserve the invalid root and run `create` from a new\n  safe launcher.",
      "Use reset for every identity refusal.",
    ));
  assert.throws(() => verifyCapstone(root), /identity-sensitive reset recovery/);
});

test("verifier rejects unfinished solution markers", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) => body + "\nTODO: finish this answer.\n");
  assert.throws(() => verifyCapstone(root), /unfinished author marker/);
});

test("verifier rejects a broken Module 12 forward link", () => {
  const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) =>
    body.replace("../capstone-end-to-end.md", "../missing-capstone.md"));
  assert.throws(() => verifyCapstone(root), /broken local link|Module 12 must link directly/);
});

test("verifier rejects an executable remote mutation", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) =>
    body + "\n~~~sh\ngit -C \"$CAPSTONE_ROOT\" push origin training/capstone\n~~~\n");
  assert.throws(() => verifyCapstone(root), /forbidden executable command/);
});

test("verifier rejects reordered lifecycle stages", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) => body.replace(
    /^(\| `literal` \| `LITERAL`[^\n]*\n)(\| `aggregate` \| `AGGREGATE_RED`[^\n]*\n)/m,
    "$2$1",
  ));
  assert.throws(() => verifyCapstone(root), /stage order/);
});

test("verifier rejects an omitted checkpoint stage", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) =>
    body.replace(/^\| `install` \| `CHECKPOINT`.*\n/m, ""));
  assert.throws(() => verifyCapstone(root), /stage order|CHECKPOINT/);
});

test("verifier rejects an omitted evidence artifact", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) =>
    body.replace("literal.json`, `aggregate-failure.json`, `pre-pr.json", "literal.json`, `pre-pr.json"));
  assert.throws(() => verifyCapstone(root), /evidence bundle.*aggregate-failure\.json/i);
});

test("verifier rejects a missing reset and archive disposition note", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) =>
    body.replace(/Reset and\s+archive do not emit JSON\./, "No additional helper record is emitted."));
  assert.throws(() => verifyCapstone(root), /private disposition note/);
});

test("verifier rejects a weakened aggregate gate", () => {
  const root = changedCopy("labs/fixtures/capstone-end-to-end/Taskfile.yml", (body) =>
    body.replace("- task: review:evidence", "- echo review skipped"));
  assert.throws(() => verifyCapstone(root), /aggregate gate order/);
});

test("verifier rejects a live Greptile dependency", () => {
  const root = changedCopy("assessments/capstone-end-to-end.md", (body) =>
    body + "\nYou must request Greptile approval before completion.\n");
  assert.throws(() => verifyCapstone(root), /live review dependency/);
});

test("verifier rejects an unsupported verified platform", () => {
  const root = changedCopy("references/SOURCE-BASELINE.md", (body) =>
    body + "\n- `teaching-platform-proof:android status=verified date=2026-09-17 evidence=none`\n");
  assert.throws(() => verifyCapstone(root), /platform proof marker/);
});

test("verifier rejects a ranged learner pin", () => {
  const root = changedCopy("package.json", (body) =>
    body.replace('"@deftai/directive": "0.119.5"', '"@deftai/directive": "^0.119.5"'));
  assert.throws(() => verifyCapstone(root), /must pin @deftai\/directive exactly/);
});

test("verifier rejects an unavailable capstone index row", () => {
  const root = changedCopy("assessments/README.md", (body) =>
    body.replace(
      "| [Capstone — End-to-End Solo Directive Lifecycle](../curriculum/capstone-end-to-end.md) | [Capstone evidence assessment](capstone-end-to-end.md)",
      "| [Capstone — End-to-End Solo Directive Lifecycle](../curriculum/capstone-end-to-end.md) | Not yet available",
    ));
  assert.throws(() => verifyCapstone(root), /stale capstone availability|assessment index/);
});

test("verifier rejects reset that reuses an attempt root", () => {
  const root = changedCopy("assessments/capstone-end-to-end.md", (body) =>
    body.replaceAll("reset creates a distinct root", "reset reuses the same root"));
  assert.throws(() => verifyCapstone(root), /fresh reset contract/);
});

test("verifier rejects destructive archive guidance", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) =>
    body.replace("Archive is a recoverable move; it is not deletion.", "Archive deletes the attempt permanently."));
  assert.throws(() => verifyCapstone(root), /recoverable archive contract/);
});

test("verifier rejects a missing launcher disposition", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) =>
    body.replace("Archive leaves both launcher directories in place and empty because the\nnote remains in the separate notes directory; leave those empty directories to\nnormal OS-temporary cleanup.", "Archive cleanup is complete."));
  assert.throws(() => verifyCapstone(root), /launcher cleanup disposition/);
});

test("verifier rejects retaining the private note in a launcher", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) =>
    body.replace(
      "Its dedicated\nOS-temporary notes directory is outside both attempt parents, both the original\nand reset launcher directories",
      "It is in the original `CAPSTONE_LAUNCHER`, outside both attempt parents and the reset launcher directory",
    ));
  assert.throws(() => verifyCapstone(root), /separate private notes directory|keep the note outside both launcher directories|must not retain the note in a launcher directory/);
});

test("verifier rejects binding the assessment note to a launcher", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) =>
    body.replace(
      'export CAPSTONE_ASSESSMENT_NOTE="$CAPSTONE_NOTES_DIR/capstone-assessment-note.md"',
      'export CAPSTONE_ASSESSMENT_NOTE="$CAPSTONE_LAUNCHER/capstone-assessment-note.md"',
    ));
  assert.throws(() => verifyCapstone(root), /private note path: CAPSTONE_ASSESSMENT_NOTE/);
});

test("verifier rejects omission of retained runtime identity", () => {
  const root = changedCopy("assessments/capstone-end-to-end.md", (body) =>
    body.replace(/^\| `capstone-assessment-note\.md` — runtime observation .*\n/m, ""));
  assert.throws(() => verifyCapstone(root), /retained runtime identity evidence/);
});

test("verifier rejects overstating Node.js 20 execution", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) =>
    body.replace(
      "Node.js 20-compatible application source is a source-level design constraint, not a separate Node.js 20 execution claim",
      "Node.js 20-compatible application source was verified by a Node.js 20 execution",
    ));
  assert.throws(() => verifyCapstone(root), /unexecuted source constraint/);
});

test("verifier rejects an averaged rubric", () => {
  const root = changedCopy("assessments/capstone-end-to-end.md", (body) =>
    body.replace("no\nnumeric average is used", "a numeric average determines completion"));
  assert.throws(() => verifyCapstone(root), /non-compensating rubric/);
});

test("verifier rejects omission of the worked duplicate repair", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) =>
    body.replace('throw new RangeError("title duplicates an existing work item");', 'throw new RangeError("duplicate");'));
  assert.throws(() => verifyCapstone(root), /worked duplicate-title solution/);
});

test("verifier rejects a delivered local closeout claim", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) =>
    body.replace("work.status = implemented", "work.status = delivered"));
  assert.throws(() => verifyCapstone(root), /closeout state contract/);
});

test("verifier rejects capstone package-script drift", () => {
  const root = changedCopy("package.json", (body) => {
    const packageJson = JSON.parse(body);
    const before = packageJson.scripts["test:capstone"];
    packageJson.scripts["test:capstone"] = before.replace(" scripts/verify-capstone.test.mjs", "");
    assert.notEqual(packageJson.scripts["test:capstone"], before, "test:capstone mutation must change that exact script");
    return JSON.stringify(packageJson, null, 2) + "\n";
  });
  assert.throws(() => verifyCapstone(root), /test:capstone/);
});

test("verifier rejects a privileged preflight in ordinary portability validation", () => {
  const root = changedCopy("package.json", (body) => {
    const packageJson = JSON.parse(body);
    packageJson.scripts["test:portability"] =
      "node scripts/verify-symlink-capability.mjs && " + packageJson.scripts["test:portability"];
    return JSON.stringify(packageJson, null, 2) + "\n";
  });
  assert.throws(() => verifyCapstone(root), /test:portability/);
});

test("verifier rejects removal of dedicated linked-path safety validation", () => {
  const root = changedCopy("package.json", (body) => {
    const packageJson = JSON.parse(body);
    delete packageJson.scripts["test:linked-path-safety"];
    return JSON.stringify(packageJson, null, 2) + "\n";
  });
  assert.throws(() => verifyCapstone(root), /test:linked-path-safety/);
});

test("verifier rejects mutated fixture provenance", () => {
  const root = changedCopy("references/SOURCE-NOTES.md", (body) =>
    body.replace("4f8ca7e36723e094ed1a19aa9593f01c0b798cdf", "0000000000000000000000000000000000000000"));
  assert.throws(() => verifyCapstone(root), /fixture provenance/);
});

test("verifier rejects a source record without application compatibility", () => {
  const root = changedCopy("references/SOURCE-NOTES.md", (body) =>
    body.replace(
      "The fictional application source remains Node.js\n20-compatible as a source-level design constraint based on source review; no\nisolated Node.js 20 execution or workflow job is claimed.",
      "The fictional application source has no recorded compatibility boundary.",
    ));
  assert.throws(() => verifyCapstone(root), /source record is missing application compatibility/);
});

test("verifier rejects a broken capstone cross-link", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) =>
    body.replace("../assessments/capstone-end-to-end.md", "../assessments/missing.md"));
  assert.throws(() => verifyCapstone(root), /broken local link/);
});

test("verifier rejects removing the supplied WI-999 boundary case", () => {
  const root = changedCopy("labs/fixtures/capstone-end-to-end/test/work-items.test.mjs", (body) => {
    const start = body.indexOf('test("refuses to allocate past the bounded WI-999 identifier"');
    assert.ok(start >= 0, "supplied suite must carry the WI-999 boundary case");
    const end = body.indexOf("\n});\n\n", start);
    assert.ok(end > start, "WI-999 boundary case must be a complete test block");
    return body.slice(0, start) + body.slice(end + "\n});\n\n".length);
  });
  assert.throws(() => verifyCapstone(root), /focused WI-999 identifier bound case/);
});

test("verifier rejects a green rehearsal implementation without the WI-999 guard", () => {
  const root = changedCopy("scripts/capstone-lab.test.mjs", (body) =>
    withoutFirst(body, '  if (highest >= 999) throw new RangeError("next work-item id would exceed WI-999");\n'));
  assert.throws(() => verifyCapstone(root), /rehearsal green implementation must refuse on/);
});

test("verifier rejects a rehearsal guard hoisted above the reduce", () => {
  const guard = '  if (highest >= 999) throw new RangeError("next work-item id would exceed WI-999");\n';
  const reduce = "  const highest = items.reduce((value, item) => Math.max(value, Number(item.id.slice(3))), 0);\n";
  const root = changedCopy("scripts/capstone-lab.test.mjs", (body) =>
    replaceFirst(withoutFirst(body, guard), reduce, guard + reduce));
  assert.throws(() => verifyCapstone(root), /after the reduce so the reviewed copy inherits it/);
});

test("verifier rejects a worked green implementation that can emit WI-1000", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) =>
    withoutFirst(body, '  if (highest >= 999) {\n    throw new RangeError("next work-item id would exceed WI-999");\n  }\n'));
  assert.throws(() => verifyCapstone(root), /both worked addWorkItem implementations/);
});

test("verifier rejects a Task 2 green list that omits the identifier bound", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) =>
    withoutFirst(body, "- refuse to allocate outside the bounded `WI-NNN` namespace: `WI-000` through\n  `WI-999` are legal existing identifiers, an empty collection allocates\n  `WI-001`, and add throws `RangeError` with the exact message\n  `next work-item id would exceed WI-999` once the collection already holds\n  `WI-999`, even when lower identifiers are free;\n"));
  assert.throws(() => verifyCapstone(root), /lab Task 2 green list must state the WI-999 identifier bound/);
});

test("verifier rejects a CAP.2 assessment task that drops the exhaustion refusal", () => {
  const root = changedCopy("assessments/capstone-end-to-end.md", (body) =>
    withoutFirst(body, "and add throws\n`RangeError` with the exact message `next work-item id would exceed WI-999`\nonce the collection already holds `WI-999`, even when lower identifiers are\nfree. "));
  assert.throws(() => verifyCapstone(root), /CAP\.2 assessment task must name the WI-999 exhaustion refusal/);
});

test("verifier rejects a CAP.2 assessment task that drops the legal WI-NNN namespace", () => {
  const root = changedCopy("assessments/capstone-end-to-end.md", (body) =>
    withoutFirst(body, "`WI-000` through `WI-999` are legal\nexisting identifiers, an empty collection allocates `WI-001`, "));
  assert.throws(() => verifyCapstone(root), /CAP\.2 assessment task must state the legal WI-NNN namespace/);
});

// Non-vacuity guard: every token each pin names is still present in these
// mutations, only split into separate sentences. A token-presence assertion
// would pass them; the sentence-local pins must not, for every terminator.
for (const terminator of [".", "!", "?"]) {
  test("verifier rejects a CAP.2 exhaustion refusal split by '" + terminator + "'", () => {
    const root = changedCopy("assessments/capstone-end-to-end.md", (body) =>
      replaceFirst(
        body,
        "and add throws\n`RangeError` with the exact message `next work-item id would exceed WI-999`\nonce the collection already holds `WI-999`, even when lower identifiers are\nfree.",
        "and the lab names\n`RangeError`" + terminator + " The message is `next work-item id would exceed WI-999`" +
          terminator + " Refusal\nis monotonic even when lower identifiers are free.",
      ));
    assert.throws(() => verifyCapstone(root), /CAP\.2 assessment task must name the WI-999 exhaustion refusal/);
  });

  test("verifier rejects a CAP.2 namespace clause split by '" + terminator + "'", () => {
    const root = changedCopy("assessments/capstone-end-to-end.md", (body) =>
      replaceFirst(
        body,
        "`WI-000` through `WI-999` are legal\nexisting identifiers, an empty collection allocates `WI-001`,",
        "`WI-000` through `WI-999` are legal\nexisting identifiers" + terminator + " An empty collection allocates `WI-001`,",
      ));
    assert.throws(() => verifyCapstone(root), /CAP\.2 assessment task must state the legal WI-NNN namespace/);
  });
}

// Executable counterpart to the content contract: the verifier pins the guard as
// text, and these cases run the very bytes a learner compares against.
function workedListing(markdown, startHeading, endHeading) {
  const slice = markdown.slice(markdown.indexOf(startHeading), markdown.indexOf(endHeading));
  const listings = [...slice.matchAll(/~~~js\n([\s\S]*?)~~~/g)].map((match) => match[1]);
  assert.equal(listings.length, 1, startHeading + " must carry exactly one worked listing");
  return listings[0];
}

async function loadAuthoredImplementations() {
  const scratch = mkdtempSync(join(tmpdir(), "capstone-boundary-"));
  const solution = readFileSync(join(repositoryRoot, "solutions/capstone-end-to-end.md"), "utf8").replace(/\r\n/g, "\n");
  const rehearsalSource = readFileSync(join(repositoryRoot, "scripts/capstone-lab.test.mjs"), "utf8").replace(/\r\n/g, "\n");

  // Evaluate the rehearsal pair exactly as the runtime suite derives it, so the
  // derived reviewed copy is proved rather than assumed to inherit the guard.
  const pairTail = "  const highest = items.reduce`,\n);\n";
  const pairStart = rehearsalSource.indexOf("const greenImplementation = `");
  const pairEnd = rehearsalSource.indexOf(pairTail, pairStart);
  assert.ok(pairStart >= 0 && pairEnd > pairStart, "rehearsal implementation pair must be extractable");
  const pairPath = join(scratch, "pair.mjs");
  writeFileSync(
    pairPath,
    rehearsalSource.slice(pairStart, pairEnd + pairTail.length)
      + "\nexport { greenImplementation, reviewedImplementation };\n",
  );
  const pair = await import(pathToFileURL(pairPath).href);

  const named = [
    ["solution green listing", workedListing(solution, "### 3. Write the intentionally incomplete green implementation", "### 4."), false],
    ["solution reviewed listing", workedListing(solution, "### 6. Make the reviewed source-only repair", "### 7."), true],
    ["rehearsal greenImplementation", pair.greenImplementation, false],
    ["rehearsal reviewedImplementation", pair.reviewedImplementation, true],
  ];

  const loaded = [];
  for (const [label, source, rejectsDuplicates] of named) {
    const modulePath = join(scratch, "impl-" + loaded.length + ".mjs");
    writeFileSync(modulePath, source);
    loaded.push({ label, rejectsDuplicates, module: await import(pathToFileURL(modulePath).href) });
  }
  return loaded;
}

test("every authored addWorkItem refuses the WI-999 bound when executed", async () => {
  const implementations = await loadAuthoredImplementations();
  assert.equal(implementations.length, 4, "capstone must carry two worked listings and the derived rehearsal pair");

  for (const { label, module } of implementations) {
    const atBound = [{ id: "WI-999", title: "Last addressable work item", status: "open" }];
    assert.throws(
      () => module.addWorkItem(atBound, "One work item too many"),
      { name: "RangeError", message: "next work-item id would exceed WI-999" },
      label + " must refuse at WI-999",
    );
    assert.deepEqual(atBound, [{ id: "WI-999", title: "Last addressable work item", status: "open" }], label + " must not mutate the refused input");

    assert.throws(
      () => module.addWorkItem([
        { id: "WI-000", title: "Zeroth", status: "open" },
        { id: "WI-999", title: "Last", status: "open" },
      ], "One work item too many"),
      { name: "RangeError", message: "next work-item id would exceed WI-999" },
      label + " must refuse monotonically, not fill the free lower identifiers",
    );

    assert.equal(module.addWorkItem([{ id: "WI-998", title: "Still allocatable", status: "open" }], "Final").at(-1).id, "WI-999", label + " must still allocate WI-999");
    assert.equal(module.addWorkItem([], "First").at(-1).id, "WI-001", label + " must allocate WI-001 from empty");
    assert.equal(module.addWorkItem([{ id: "WI-000", title: "Zeroth", status: "open" }], "Next").at(-1).id, "WI-001", label + " must treat WI-000 as a legal existing identifier");

    let items = [];
    for (let index = 1; index <= 120; index += 1) items = module.addWorkItem(items, "Item " + index);
    assert.deepEqual(module.summarizeWorkItems(items), { total: 120, open: 120, done: 0 }, label + " must preserve ordinary allocation");
  }
});

test("the executed boundary proof keeps the CAP.3 seeded duplicate distinction", async () => {
  for (const { label, rejectsDuplicates, module } of await loadAuthoredImplementations()) {
    const seeded = [{ id: "WI-001", title: "Review onboarding", status: "open" }];
    if (rejectsDuplicates) {
      assert.throws(() => module.addWorkItem(seeded, "  review ONBOARDING  "), /duplicates an existing work item/, label + " must reject normalized duplicates");
    } else {
      assert.equal(module.addWorkItem(seeded, "  review ONBOARDING  ").length, 2, label + " must still expose the seeded duplicate defect");
    }
  }
});

test("verifier rejects an ineffective WI-999 guard condition", () => {
  const root = changedCopy("solutions/capstone-end-to-end.md", (body) => replaceFirst(body, "if (highest >= 999) {", "if (false) {"));
  assert.throws(() => verifyCapstone(root), /ineffective condition/);
});

test("verifier rejects an ineffective WI-999 guard condition in the rehearsal", () => {
  const root = changedCopy("scripts/capstone-lab.test.mjs", (body) => replaceFirst(body, "if (highest >= 999) throw", "if (false) throw"));
  assert.throws(() => verifyCapstone(root), /ineffective condition/);
});

test("verifier rejects reading the solution as completion evidence", () => {
  const root = changedCopy("assessments/capstone-end-to-end.md", (body) =>
    body.replace("Reading or copying the explained solution is not completion evidence.", "Reading the explained solution is completion evidence."));
  assert.throws(() => verifyCapstone(root), /solution reading is not evidence/);
});
