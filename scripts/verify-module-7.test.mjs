import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { verifyModule7 } from "./verify-module-7.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const copyPaths = [
  "README.md", "CHANGELOG.md", "package.json", "curriculum", "labs", "solutions",
  "assessments", "maintainers", "references", "templates", "xbrief",
];

function changedCopy(path, transform) {
  const root = mkdtempSync(join(tmpdir(), "module7-contract-test-"));
  for (const source of copyPaths) cpSync(join(repositoryRoot, source), join(root, source), { recursive: true });
  const target = join(root, path);
  const before = readFileSync(target, "utf8");
  const after = transform(before);
  assert.notEqual(after, before, `negative mutation must change ${path}`);
  writeFileSync(target, after);
  return root;
}

test("Module 7 content contract accepts the repository", () => {
  const result = verifyModule7(repositoryRoot);
  assert.ok(result.artifactCount >= 18);
});

test("verifier rejects a weakened safety guard", () => {
  const root = changedCopy("labs/fixtures/07-scope-lifecycle/safety.mjs", (body) => body.replace("assertNoGitRedirection", "acceptGitRedirection"));
  assert.throws(() => verifyModule7(root), /Git redirection guard/);
});

test("verifier rejects missing transition outcome evidence", () => {
  const root = changedCopy("solutions/lab-07-scope-lifecycle.md", (body) => body.replaceAll("O7.3", "O7.X"));
  assert.throws(() => verifyModule7(root), /O7\.3/);
});

test("verifier rejects a broken local navigation link", () => {
  const root = changedCopy("curriculum/modules/07-scope-lifecycle.md", (body) => body.replace("../README.md", "../missing-course-map.md"));
  assert.throws(() => verifyModule7(root), /broken local link/);
});

test("verifier rejects an unavailable range that still includes Lab 7", () => {
  const root = changedCopy("labs/README.md", (body) => body.replace(
    "Labs for Module 6, Modules 8–11, and the capstone",
    "Labs for Modules 6–11 and the capstone",
  ));
  assert.throws(() => verifyModule7(root), /unavailable Modules 6–11 range/);
});

test("verifier rejects reset that reuses the failed root", () => {
  const root = changedCopy("labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs", (body) => body.replace("return createAttempt(); // fresh-reset", "return guardAttempt(root); // fresh-reset"));
  assert.throws(() => verifyModule7(root), /fresh-attempt reset/);
});

test("verifier rejects an unsupported Windows learner-ready claim", () => {
  const root = changedCopy("references/SOURCE-NOTES.md", (body) => body.replace("lab07-platform-proof:windows-pwsh7 status=candidate", "lab07-platform-proof:windows-pwsh7 status=verified"));
  assert.throws(() => verifyModule7(root), /windows-pwsh7/);
});

test("verifier rejects remote mutation text in executable fixture code", () => {
  const root = changedCopy("labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs", (body) => body + '\n// git push origin training/module-07\n');
  assert.throws(() => verifyModule7(root), /forbidden remote or destructive command/);
});
