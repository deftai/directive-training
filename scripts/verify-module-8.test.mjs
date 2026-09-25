import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { verifyModule8 } from "./verify-module-8.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const copyPaths = [
  "README.md", "CHANGELOG.md", "LICENSE", "package.json", "curriculum", "labs", "solutions",
  "assessments", "maintainers", "references", "templates", "history", "xbrief",
];
const scopeFilename = "2026-09-08-module-8-session-start-and-authorized-work-selection.xbrief.json";
const projectScopeId = "2026-09-08-module-8-session-start-and-authorized-work-selection";
const negativeFixture = (_id, value) => value;

function copiedRepository() {
  const root = mkdtempSync(join(tmpdir(), "module8-contract-test-"));
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
  assert.ok(existsSync(completedScope), "copied repository must contain the Module 8 scope");

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

  const parentPath = join(root, "xbrief", "proposed", "2026-09-05-modules-6-8-work-lifecycle-and-sessions.xbrief.json");
  const parent = JSON.parse(readFileSync(parentPath, "utf8"));
  const scopeReference = parent.plan.references.find(({ uri }) => uri.endsWith(scopeFilename));
  scopeReference.uri = `completed/${scopeFilename}`;
  writeFileSync(parentPath, `${JSON.stringify(parent, null, 2)}\n`);
  return root;
}

test("Module 8 content contract accepts the active repository", () => {
  const result = verifyModule8(repositoryRoot);
  assert.equal(result.artifactCount, 16);
});

test("Module 8 content contract accepts the completed lifecycle state", () => {
  const result = verifyModule8(completedLifecycleCopy());
  assert.equal(result.artifactCount, 16);
});

test("verifier rejects a wrong read-only posture mapping", () => {
  const root = changedCopy("curriculum/modules/08-session-and-work-selection.md", (body) => body.replaceAll(
    "Orientation only | Read-only",
    "Orientation only | Mutation",
  ));
  assert.throws(() => verifyModule8(root), /read-only posture mapping/);
});

test("verifier rejects ranked-queue selection while an ordered plan is active", () => {
  const root = changedCopy("curriculum/modules/08-session-and-work-selection.md", (body) => body.replace(
    "Do not inspect or select the ranked queue",
    "Select the ranked queue",
  ));
  assert.throws(() => verifyModule8(root), /ordered-plan precedence/);
});

test("verifier rejects a completed scope presented as implementation authority", () => {
  const root = changedCopy("solutions/module-08-session-and-work-selection.md", (body) => body.replaceAll(
    "Historical record; no standing implementation authority",
    "Standing implementation authority",
  ));
  assert.throws(() => verifyModule8(root), /completed-scope authority/);
});

test("verifier rejects a noncanonical ordered-plan path", () => {
  const root = changedCopy("curriculum/modules/08-session-and-work-selection.md", (body) => body.replaceAll(
    ".deft/plan-sequence.json",
    ".deft/ordered-plan.json",
  ));
  assert.throws(() => verifyModule8(root), /canonical ordered-plan path/);
});

test("verifier rejects a broken local navigation link", () => {
  const root = changedCopy("curriculum/modules/08-session-and-work-selection.md", (body) => body.replace(
    "../README.md",
    "../missing-course-map.md",
  ));
  assert.throws(() => verifyModule8(root), /broken local link/);
});

test("verifier rejects a stale or ranged teaching baseline", () => {
  const root = changedCopy("solutions/module-08-session-and-work-selection.md", (body) => body.replace(
    "| Directive baseline | fixture-local 0.119.5 |",
    "| Directive baseline | fixture-local 0.119.5–0.114.0 |",
  ));
  assert.throws(() => verifyModule8(root), /stale or ranged Directive baseline/);
});

test("verifier rejects Module 10 regressing to planned after release", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 10 | [The implementation golden path](modules/10-implementation-golden-path.md) | 70 min | Learner-ready; lab verified on macOS/zsh; Linux and Windows candidates | Implement one test-backed active scope |",
    "| 10 | [The implementation golden path](modules/10-implementation-golden-path.md) | 70 min | Planned | Implement one test-backed active scope |",
  ));
  assert.throws(() => verifyModule8(root), /Module 10 must remain learner-ready/);
});

test("verifier rejects stale implementation navigation", () => {
  const root = changedCopy("curriculum/modules/08-session-and-work-selection.md", (body) => body.replace(
    "09-design-critique-arcs.md",
    negativeFixture("old-module-9-path", "09-implementation-golden-path.md"),
  ));
  assert.throws(() => verifyModule8(root), /Module 9 design critique|broken local link/);
});

test("verifier rejects missing Module 8 source validation evidence", () => {
  const root = changedCopy("references/SOURCE-NOTES.md", (body) => body.replace(
    "## Module 8 source validation",
    "## Session notes",
  ));
  assert.throws(() => verifyModule8(root), /Module 8 source validation/);
});

test("verifier rejects directions to inspect a live backlog", () => {
  const root = changedCopy("curriculum/modules/08-session-and-work-selection.md", (body) => `${body}\nOpen the live GitHub backlog.\n`);
  assert.throws(() => verifyModule8(root), /live project-state instruction/);
});
