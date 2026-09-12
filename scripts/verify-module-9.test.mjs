import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { verifyModule9 } from "./verify-module-9.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const copyPaths = [
  "README.md", "CHANGELOG.md", "package.json", "curriculum", "labs", "solutions",
  "assessments", "maintainers", "references", "scripts", "templates", "history", "xbrief",
];
const scopeFilename = "2026-09-10-module-9-implementation-golden-path.xbrief.json";
const projectScopeId = "2026-09-10-module-9-implementation-golden-path";

function copiedRepository() {
  const root = mkdtempSync(join(tmpdir(), "module9-contract-test-"));
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

test("Module 9 content contract accepts the active repository", () => {
  const result = verifyModule9(repositoryRoot);
  assert.equal(result.artifactCount, 27);
});

test("Module 9 content contract accepts the completed lifecycle state", () => {
  const result = verifyModule9(completedLifecycleCopy());
  assert.equal(result.artifactCount, 27);
});

test("verifier rejects a stale or ranged learner baseline", () => {
  const root = changedCopy("curriculum/modules/09-implementation-golden-path.md", (body) => body.replace(
    "| Directive baseline | `@deftai/directive@0.112.0`, engine `@deftai/directive-core@0.112.0`; see the [source baseline](../../references/SOURCE-BASELINE.md) |",
    "| Directive baseline | `@deftai/directive@0.112.0–0.114.0`, engine `@deftai/directive-core@0.112.0`; see the [source baseline](../../references/SOURCE-BASELINE.md) |",
  ));
  assert.throws(() => verifyModule9(root), /stale or ranged Directive baseline/);
});

test("verifier rejects loss of the unique OS-temporary no-remote boundary", () => {
  const root = changedCopy("labs/09-implementation-golden-path.md", (body) => body.replace(
    "unique OS-temporary repository with no remote",
    "ordinary repository",
  ));
  assert.throws(() => verifyModule9(root), /temporary no-remote boundary/);
});

test("verifier rejects an expanded product allowlist", () => {
  const root = changedCopy("labs/09-implementation-golden-path.md", (body) => body.replaceAll(
    "Only `src/greeting.mjs` is mutable",
    "Application files are mutable",
  ));
  assert.throws(() => verifyModule9(root), /one-file product allowlist/);
});

test("verifier rejects missing readiness-before-mutation guidance", () => {
  const root = changedCopy("curriculum/modules/09-implementation-golden-path.md", (body) => body.replace(
    "Readiness before mutation",
    "Readiness Before Mutation",
  ));
  assert.throws(() => verifyModule9(root), /readiness order/);
});

test("verifier rejects missing behavioral evidence", () => {
  const root = changedCopy("solutions/lab-09-implementation-golden-path.md", (body) => body.replace(
    "Hello, Ada!",
    "Hello there!",
  ));
  assert.throws(() => verifyModule9(root), /named greeting evidence/);
});

test("verifier rejects missing diff evidence", () => {
  const root = changedCopy("solutions/lab-09-implementation-golden-path.md", (body) => body.replace(
    "src/greeting.mjs",
    "src/cli.mjs",
  ));
  assert.throws(() => verifyModule9(root), /diff evidence/);
});

test("verifier rejects a broken local navigation link", () => {
  const root = changedCopy("curriculum/modules/09-implementation-golden-path.md", (body) => body.replace(
    "08-session-and-work-selection.md",
    "08-missing.md",
  ));
  assert.throws(() => verifyModule9(root), /broken local link/);
});

test("verifier rejects an unsupported platform marked verified", () => {
  const root = changedCopy("references/SOURCE-NOTES.md", (body) => body.replace(
    "module09-platform-proof:windows-powershell status=candidate",
    "module09-platform-proof:windows-powershell status=verified",
  ));
  assert.throws(() => verifyModule9(root), /Windows must remain candidate/);
});

test("verifier rejects Module 10 regressing to planned after release", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 10 | [Testing, gates, and evidence](modules/10-testing-gates-and-evidence.md) | 65 min | Learner-ready; lab verified on macOS/zsh only | Red-green-refactor and diagnose a gate failure |",
    "| 10 | [Testing, gates, and evidence](modules/10-testing-gates-and-evidence.md) | 65 min | Planned | Red-green-refactor and diagnose a gate failure |",
  ));
  assert.throws(() => verifyModule9(root), /Module 10 must remain learner-ready/);
});

test("verifier rejects Module 11 regressing to planned after release", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 11 | [PR, review, and actual completion](modules/11-review-and-completion.md) | 55 min | Learner-ready; command-free fixed-state exercise | Resolve simulated findings and classify completion evidence |",
    "| 11 | [PR, review, and actual completion](modules/11-review-and-completion.md) | 55 min | Planned | Resolve simulated findings and classify completion evidence |",
  ));
  assert.throws(() => verifyModule9(root), /Module 11 must remain learner-ready/);
});

test("verifier rejects Module 11 becoming unavailable under another label", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 11 | [PR, review, and actual completion](modules/11-review-and-completion.md) | 55 min | Learner-ready; command-free fixed-state exercise | Resolve simulated findings and classify completion evidence |",
    "| 11 | [PR, review, and actual completion](modules/11-review-and-completion.md) | 55 min | Not yet available | Resolve simulated findings and classify completion evidence |",
  ));
  assert.throws(() => verifyModule9(root), /Module 11 must remain learner-ready/);
});

test("verifier rejects a missing Module 9 outcome mapping", () => {
  const root = changedCopy("curriculum/modules/09-implementation-golden-path.md", (body) => body.replaceAll("O9.5", "O9.X"));
  assert.throws(() => verifyModule9(root), /missing O9\.5/);
});
