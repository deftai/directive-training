import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
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

function copiedRepository() {
  const root = mkdtempSync(join(tmpdir(), "capstone-content-contract-"));
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

test("verifier rejects a missing assessment artifact", () => {
  const root = copiedRepository();
  renameSync(
    join(root, "assessments", "capstone-end-to-end.md"),
    join(root, "assessments", "capstone-missing.md"),
  );
  assert.throws(() => verifyCapstone(root), /missing required artifact/);
});

test("verifier rejects a fake Windows course root instead of learner input", () => {
  const root = changedCopy("labs/capstone-end-to-end.md", (body) => body
    .replace(/if \(\[string\]::IsNullOrWhiteSpace\(\$env:DIRECTIVE_TRAINING_ROOT\)\) \{[\s\S]*?\}\r?\n/, "")
    .replace(
      "$CourseRoot = [IO.Path]::GetFullPath($env:DIRECTIVE_TRAINING_ROOT).TrimEnd([IO.Path]::DirectorySeparatorChar)",
      '$CourseRoot = (Resolve-Path "C:\\absolute\\path\\to\\directive-training").Path',
    ));
  assert.throws(() => verifyCapstone(root), /DIRECTIVE_TRAINING_ROOT|fake absolute clone path/);
});

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
    body.replace("Reset and archive\ndo not emit JSON.", "No additional helper record is emitted."));
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

test("verifier rejects reading the solution as completion evidence", () => {
  const root = changedCopy("assessments/capstone-end-to-end.md", (body) =>
    body.replace("Reading or copying the explained solution is not completion evidence.", "Reading the explained solution is completion evidence."));
  assert.throws(() => verifyCapstone(root), /solution reading is not evidence/);
});
