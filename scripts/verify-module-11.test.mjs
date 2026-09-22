import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { verifyModule11 } from "./verify-module-11.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const copyPaths = [
  "README.md", "CHANGELOG.md", "LICENSE", "package.json", "curriculum", "labs", "solutions",
  "assessments", "maintainers", "references", "scripts", "templates", "history", "xbrief",
];
const historicalLineage = Object.freeze({
  scopeFilename: "2026-09-10-module-10-testing-gates-and-evidence.xbrief.json",
  projectScopeId: "2026-09-10-module-10-testing-gates-and-evidence",
  parentScope: "xbrief/proposed/2026-09-05-modules-9-11-implementation-gates-and-review.xbrief.json",
});
const { scopeFilename, projectScopeId } = historicalLineage;

function copiedRepository() {
  const root = mkdtempSync(join(tmpdir(), "module11-contract-test-"));
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

  const parentPath = join(root, historicalLineage.parentScope);
  const parent = JSON.parse(readFileSync(parentPath, "utf8"));
  const reference = parent.plan.references.find(({ uri }) => uri.endsWith(scopeFilename));
  if (reference) reference.uri = `completed/${scopeFilename}`;
  writeFileSync(parentPath, `${JSON.stringify(parent, null, 2)}\n`);
  return root;
}

test("Module 11 content contract accepts active and completed lifecycle states", () => {
  assert.ok(verifyModule11(repositoryRoot).artifactCount > 25);
  assert.ok(verifyModule11(completedLifecycleCopy()).artifactCount > 25);
});

test("verifier rejects a stale or ranged learner baseline", () => {
  const root = changedCopy("curriculum/modules/11-testing-gates-and-evidence.md", (body) => body.replaceAll(
    "@deftai/directive@0.119.5",
    "@deftai/directive@0.119.5–0.114.0",
  ));
  assert.throws(() => verifyModule11(root), /stale or ranged Directive baseline/);
});

test("verifier rejects loss of the disposable no-remote boundary", () => {
  const root = changedCopy("labs/11-testing-gates-and-evidence.md", (body) => body.replace(
    "unique OS-temporary repository with no remote",
    "ordinary repository",
  ));
  assert.throws(() => verifyModule11(root), /temporary no-remote boundary/);
});

test("verifier rejects a broken red-green-refactor sequence", () => {
  const root = changedCopy("curriculum/modules/11-testing-gates-and-evidence.md", (body) => body.replaceAll(
    "`red -> green -> refactor`",
    "`green -> red -> refactor`",
  ));
  assert.throws(() => verifyModule11(root), /red-green-refactor order/);
});

test("verifier rejects gate weakening guidance", () => {
  const root = changedCopy("curriculum/modules/11-testing-gates-and-evidence.md", (body) => body.replace(
    "repair the work, not the gate",
    "adjust the gate until it passes",
  ));
  assert.throws(() => verifyModule11(root), /gate-integrity guidance/);
});

test("verifier rejects a reordered aggregate gate", () => {
  const root = changedCopy("labs/fixtures/11-testing-gates-and-evidence/Taskfile.yml", (body) => body.replace(
    "      - task: quality:record",
    "      - task: quality:record\n      - task: quality:record",
  ));
  assert.throws(() => verifyModule11(root), /aggregate gate order/);
});

test("verifier rejects a broken local navigation link", () => {
  const root = changedCopy("curriculum/modules/11-testing-gates-and-evidence.md", (body) => body.replace(
    "10-implementation-golden-path.md",
    "09-missing.md",
  ));
  assert.throws(() => verifyModule11(root), /broken local link/);
});

test("verifier rejects losing Module 11's forward link to Module 12", () => {
  const root = changedCopy("curriculum/modules/11-testing-gates-and-evidence.md", (body) => body.replace(
    "- Next: [Module 12 — PR, review, and actual completion](12-review-and-completion.md)",
    "- Next: Module 12 remains planned",
  ));
  assert.throws(() => verifyModule11(root), /link forward to Module 12/);
});

test("verifier rejects promoting Windows without current native evidence", () => {
  const root = changedCopy("references/SOURCE-BASELINE.md", (body) => body.replace(
    "teaching-platform-proof:windows-pwsh7 status=candidate",
    "teaching-platform-proof:windows-pwsh7 status=verified",
  ));
  assert.throws(() => verifyModule11(root), /windows-pwsh7/);
});

test("verifier rejects a course index that drops candidate platforms", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 11 | [Testing, gates, and evidence](modules/11-testing-gates-and-evidence.md) | 65 min | Learner-ready; lab verified on macOS/zsh; Linux and Windows candidates | Red-green-refactor and diagnose a gate failure |",
    "| 11 | [Testing, gates, and evidence](modules/11-testing-gates-and-evidence.md) | 65 min | Learner-ready; lab verified on macOS/zsh only | Red-green-refactor and diagnose a gate failure |",
  ));
  assert.throws(() => verifyModule11(root), /current platform boundary/);
});

test("verifier rejects Module 12 regressing to planned after release", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 12 | [PR, review, and actual completion](modules/12-review-and-completion.md) | 55 min | Learner-ready; command-free fixed-state exercise | Resolve simulated findings and classify completion evidence |",
    "| 12 | [PR, review, and actual completion](modules/12-review-and-completion.md) | 55 min | Planned | Resolve simulated findings and classify completion evidence |",
  ));
  assert.throws(() => verifyModule11(root), /Module 12 must remain learner-ready/);
});

test("verifier rejects Module 12 becoming unavailable under another label", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 12 | [PR, review, and actual completion](modules/12-review-and-completion.md) | 55 min | Learner-ready; command-free fixed-state exercise | Resolve simulated findings and classify completion evidence |",
    "| 12 | [PR, review, and actual completion](modules/12-review-and-completion.md) | 55 min | Not yet available | Resolve simulated findings and classify completion evidence |",
  ));
  assert.throws(() => verifyModule11(root), /Module 12 must remain learner-ready/);
});

test("verifier rejects a lab page that omits quality-record completed tokens", () => {
  const root = changedCopy("labs/11-testing-gates-and-evidence.md", (body) => body.replaceAll(
    "quality-record.json only",
    "the quality file",
  ));
  assert.throws(() => verifyModule11(root), /quality-record token/);
});

test("verifier rejects a missing Module 11 outcome mapping", () => {
  const root = changedCopy("curriculum/modules/11-testing-gates-and-evidence.md", (body) => body.replaceAll("O11.8", "O11.X"));
  assert.throws(() => verifyModule11(root), /missing O11\.8/);
});

test("verifier rejects an altered exact fixture pin", () => {
  const root = changedCopy("labs/fixtures/11-testing-gates-and-evidence/package.json", (body) => body.replaceAll("0.119.5", "^0.119.5"));
  assert.throws(() => verifyModule11(root), /exact Directive pin/);
});
