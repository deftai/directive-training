import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { verifyModule10 } from "./verify-module-10.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const copyPaths = [
  "README.md", "CHANGELOG.md", "package.json", "curriculum", "labs", "solutions",
  "assessments", "maintainers", "references", "scripts", "templates", "history", "xbrief",
];
const scopeFilename = "2026-09-10-module-10-testing-gates-and-evidence.xbrief.json";
const projectScopeId = "2026-09-10-module-10-testing-gates-and-evidence";

function copiedRepository() {
  const root = mkdtempSync(join(tmpdir(), "module10-contract-test-"));
  for (const source of copyPaths) cpSync(join(repositoryRoot, source), join(root, source), { recursive: true });
  return root;
}

function changedCopy(path, transform) {
  const root = copiedRepository();
  const target = join(root, path);
  const before = readFileSync(target, "utf8");
  const after = transform(before);
  assert.notEqual(after, before, `negative mutation must change ${path}`);
  writeFileSync(target, after);
  return root;
}

function completedLifecycleCopy() {
  const root = copiedRepository();
  const activeScope = join(root, "xbrief", "active", scopeFilename);
  const completedScope = join(root, "xbrief", "completed", scopeFilename);
  if (existsSync(activeScope)) renameSync(activeScope, completedScope);
  const scope = JSON.parse(readFileSync(completedScope, "utf8"));
  scope.plan.status = "completed";
  for (const item of scope.plan.items) item.status = "completed";
  writeFileSync(completedScope, `${JSON.stringify(scope, null, 2)}\n`);

  const projectPath = join(root, "xbrief", "PROJECT-DEFINITION.xbrief.json");
  const project = JSON.parse(readFileSync(projectPath, "utf8"));
  const projectItem = project.plan.items.find((item) => item.id === projectScopeId);
  projectItem.status = "completed";
  projectItem.metadata.lifecycle_folder = "completed";
  projectItem.metadata.source_path = `completed/${scopeFilename}`;
  writeFileSync(projectPath, `${JSON.stringify(project, null, 2)}\n`);

  const parentPath = join(root, "xbrief", "proposed", "2026-09-05-modules-9-11-implementation-gates-and-review.xbrief.json");
  const parent = JSON.parse(readFileSync(parentPath, "utf8"));
  const reference = parent.plan.references.find(({ uri }) => uri.endsWith(scopeFilename));
  if (reference) reference.uri = `completed/${scopeFilename}`;
  writeFileSync(parentPath, `${JSON.stringify(parent, null, 2)}\n`);
  return root;
}

test("Module 10 content contract accepts active and completed lifecycle states", () => {
  assert.ok(verifyModule10(repositoryRoot).artifactCount > 25);
  assert.ok(verifyModule10(completedLifecycleCopy()).artifactCount > 25);
});

test("verifier rejects a stale or ranged learner baseline", () => {
  const root = changedCopy("curriculum/modules/10-testing-gates-and-evidence.md", (body) => body.replaceAll(
    "@deftai/directive@0.112.0",
    "@deftai/directive@0.112.0–0.114.0",
  ));
  assert.throws(() => verifyModule10(root), /stale or ranged Directive baseline/);
});

test("verifier rejects loss of the disposable no-remote boundary", () => {
  const root = changedCopy("labs/10-testing-gates-and-evidence.md", (body) => body.replace(
    "unique OS-temporary repository with no remote",
    "ordinary repository",
  ));
  assert.throws(() => verifyModule10(root), /temporary no-remote boundary/);
});

test("verifier rejects a broken red-green-refactor sequence", () => {
  const root = changedCopy("curriculum/modules/10-testing-gates-and-evidence.md", (body) => body.replaceAll(
    "`red -> green -> refactor`",
    "`green -> red -> refactor`",
  ));
  assert.throws(() => verifyModule10(root), /red-green-refactor order/);
});

test("verifier rejects gate weakening guidance", () => {
  const root = changedCopy("curriculum/modules/10-testing-gates-and-evidence.md", (body) => body.replace(
    "repair the work, not the gate",
    "adjust the gate until it passes",
  ));
  assert.throws(() => verifyModule10(root), /gate-integrity guidance/);
});

test("verifier rejects a reordered aggregate gate", () => {
  const root = changedCopy("labs/fixtures/10-testing-gates-and-evidence/Taskfile.yml", (body) => body.replace(
    "      - task: quality:record",
    "      - task: quality:record\n      - task: quality:record",
  ));
  assert.throws(() => verifyModule10(root), /aggregate gate order/);
});

test("verifier rejects a broken local navigation link", () => {
  const root = changedCopy("curriculum/modules/10-testing-gates-and-evidence.md", (body) => body.replace(
    "09-implementation-golden-path.md",
    "09-missing.md",
  ));
  assert.throws(() => verifyModule10(root), /broken local link/);
});

test("verifier rejects losing Module 10's forward link to Module 11", () => {
  const root = changedCopy("curriculum/modules/10-testing-gates-and-evidence.md", (body) => body.replace(
    "- Next: [Module 11 — PR, review, and actual completion](11-review-and-completion.md)",
    "- Next: Module 11 remains planned",
  ));
  assert.throws(() => verifyModule10(root), /link forward to Module 11/);
});

test("verifier rejects an unsupported platform marked verified", () => {
  const root = changedCopy("references/SOURCE-NOTES.md", (body) => body.replace(
    "module10-platform-proof:windows-powershell status=candidate",
    "module10-platform-proof:windows-powershell status=verified",
  ));
  assert.throws(() => verifyModule10(root), /Windows must remain candidate/);
});

test("verifier rejects Module 11 regressing to planned after release", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 11 | [PR, review, and actual completion](modules/11-review-and-completion.md) | 55 min | Learner-ready draft; command-free fixed-state exercise | Resolve simulated findings and classify completion evidence |",
    "| 11 | [PR, review, and actual completion](modules/11-review-and-completion.md) | 55 min | Planned | Resolve simulated findings and classify completion evidence |",
  ));
  assert.throws(() => verifyModule10(root), /Module 11 must remain learner-ready/);
});

test("verifier rejects Module 11 becoming unavailable under another label", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 11 | [PR, review, and actual completion](modules/11-review-and-completion.md) | 55 min | Learner-ready draft; command-free fixed-state exercise | Resolve simulated findings and classify completion evidence |",
    "| 11 | [PR, review, and actual completion](modules/11-review-and-completion.md) | 55 min | Not yet available | Resolve simulated findings and classify completion evidence |",
  ));
  assert.throws(() => verifyModule10(root), /Module 11 must remain learner-ready/);
});

test("verifier rejects a missing Module 10 outcome mapping", () => {
  const root = changedCopy("curriculum/modules/10-testing-gates-and-evidence.md", (body) => body.replaceAll("O10.4", "O10.X"));
  assert.throws(() => verifyModule10(root), /missing O10\.4/);
});

test("verifier rejects an altered exact fixture pin", () => {
  const root = changedCopy("labs/fixtures/10-testing-gates-and-evidence/package.json", (body) => body.replaceAll("0.112.0", "^0.112.0"));
  assert.throws(() => verifyModule10(root), /exact Directive pin/);
});
