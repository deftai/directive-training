import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { verifyModule10 } from "./verify-module-10.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const copyPaths = [
  "README.md", "CHANGELOG.md", "LICENSE", "package.json", "curriculum", "labs", "solutions",
  "assessments", "maintainers", "references", "scripts", "templates", "history", "xbrief",
];
const historicalLineage = Object.freeze({
  scopeFilename: "2026-09-10-module-9-implementation-golden-path.xbrief.json",
  projectScopeId: "2026-09-10-module-9-implementation-golden-path",
  parentScope: "xbrief/proposed/2026-09-05-modules-9-11-implementation-gates-and-review.xbrief.json",
});
const { scopeFilename, projectScopeId } = historicalLineage;

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

  const parentPath = join(root, historicalLineage.parentScope);
  const parent = JSON.parse(readFileSync(parentPath, "utf8"));
  const reference = parent.plan.references.find(({ uri }) => uri.endsWith(scopeFilename));
  if (reference) reference.uri = `completed/${scopeFilename}`;
  writeFileSync(parentPath, `${JSON.stringify(parent, null, 2)}\n`);
  return root;
}

test("Module 10 content contract accepts the active repository", () => {
  const result = verifyModule10(repositoryRoot);
  assert.equal(result.artifactCount, 27);
});

test("Module 10 content contract accepts the completed lifecycle state", () => {
  const result = verifyModule10(completedLifecycleCopy());
  assert.equal(result.artifactCount, 27);
});

test("verifier rejects a stale or ranged learner baseline", () => {
  const root = changedCopy("curriculum/modules/10-implementation-golden-path.md", (body) => body.replace(
    "| Directive baseline | `@deftai/directive@0.119.5`, engine `@deftai/directive-core@0.119.5`; see the [source baseline](../../references/SOURCE-BASELINE.md) |",
    "| Directive baseline | `@deftai/directive@0.119.5–0.114.0`, engine `@deftai/directive-core@0.119.5`; see the [source baseline](../../references/SOURCE-BASELINE.md) |",
  ));
  assert.throws(() => verifyModule10(root), /stale or ranged Directive baseline/);
});

test("verifier rejects loss of the unique OS-temporary no-remote boundary", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => body.replace(
    "unique OS-temporary repository with no remote",
    "ordinary repository",
  ));
  assert.throws(() => verifyModule10(root), /temporary no-remote boundary/);
});

test("verifier rejects an expanded product allowlist", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => body.replaceAll(
    "Only `src/greeting.mjs` is mutable",
    "Application files are mutable",
  ));
  assert.throws(() => verifyModule10(root), /one-file product allowlist/);
});

test("verifier rejects missing readiness-before-mutation guidance", () => {
  const root = changedCopy("curriculum/modules/10-implementation-golden-path.md", (body) => body.replace(
    "Readiness before mutation",
    "Readiness Before Mutation",
  ));
  assert.throws(() => verifyModule10(root), /readiness order/);
});

test("verifier rejects missing behavioral evidence", () => {
  const root = changedCopy("solutions/lab-10-implementation-golden-path.md", (body) => body.replace(
    "Hello, Ada!",
    "Hello there!",
  ));
  assert.throws(() => verifyModule10(root), /named greeting evidence/);
});

test("verifier rejects missing diff evidence", () => {
  const root = changedCopy("solutions/lab-10-implementation-golden-path.md", (body) => body.replace(
    "src/greeting.mjs",
    "src/cli.mjs",
  ));
  assert.throws(() => verifyModule10(root), /diff evidence/);
});

test("verifier rejects a broken local navigation link", () => {
  const root = changedCopy("curriculum/modules/10-implementation-golden-path.md", (body) => body.replace(
    "09-design-critique-arcs.md",
    "09-missing.md",
  ));
  assert.throws(() => verifyModule10(root), /broken local link/);
});

test("verifier rejects promoting Windows without current native evidence", () => {
  const root = changedCopy("references/SOURCE-BASELINE.md", (body) => body.replace(
    "teaching-platform-proof:windows-pwsh7 status=candidate",
    "teaching-platform-proof:windows-pwsh7 status=verified",
  ));
  assert.throws(() => verifyModule10(root), /windows-pwsh7/);
});

test("verifier rejects a course index that drops candidate platforms", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 10 | [The implementation golden path](modules/10-implementation-golden-path.md) | 70 min | Learner-ready; lab verified on macOS/zsh; Linux and Windows candidates | Implement one test-backed active scope |",
    "| 10 | [The implementation golden path](modules/10-implementation-golden-path.md) | 70 min | Learner-ready; lab verified on macOS/zsh only | Implement one test-backed active scope |",
  ));
  assert.throws(() => verifyModule10(root), /current platform boundary/);
});

test("verifier rejects Module 11 regressing to planned after release", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 11 | [Testing, gates, and evidence](modules/11-testing-gates-and-evidence.md) | 65 min | Learner-ready; lab verified on macOS/zsh; Linux and Windows candidates | Red-green-refactor and diagnose a gate failure |",
    "| 11 | [Testing, gates, and evidence](modules/11-testing-gates-and-evidence.md) | 65 min | Planned | Red-green-refactor and diagnose a gate failure |",
  ));
  assert.throws(() => verifyModule10(root), /Module 11 must remain learner-ready/);
});

test("verifier rejects Module 12 regressing to planned after release", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 12 | [PR, review, and actual completion](modules/12-review-and-completion.md) | 55 min | Learner-ready; command-free fixed-state exercise | Resolve simulated findings and classify completion evidence |",
    "| 12 | [PR, review, and actual completion](modules/12-review-and-completion.md) | 55 min | Planned | Resolve simulated findings and classify completion evidence |",
  ));
  assert.throws(() => verifyModule10(root), /Module 12 must remain learner-ready/);
});

test("verifier rejects Module 12 becoming unavailable under another label", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 12 | [PR, review, and actual completion](modules/12-review-and-completion.md) | 55 min | Learner-ready; command-free fixed-state exercise | Resolve simulated findings and classify completion evidence |",
    "| 12 | [PR, review, and actual completion](modules/12-review-and-completion.md) | 55 min | Not yet available | Resolve simulated findings and classify completion evidence |",
  ));
  assert.throws(() => verifyModule10(root), /Module 12 must remain learner-ready/);
});

test("verifier rejects a missing Module 10 outcome mapping", () => {
  const root = changedCopy("curriculum/modules/10-implementation-golden-path.md", (body) => body.replaceAll("O10.9", "O10.X"));
  assert.throws(() => verifyModule10(root), /missing O10\.9/);
});

const lab10WindowsHeading = `### Windows/PowerShell 7.4+ ${"\u2014"} candidate pending native evidence`;

test("verifier rejects a zsh-only Lab 10 Environment section", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => body.replace(lab10WindowsHeading, "### Notes"));
  assert.throws(() => verifyModule10(root), /missing the Windows starting-state branch/);
});

test("verifier rejects an unbranched zsh lead on Lab 10", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => body.replace(
    "### macOS/zsh",
    "Use a dedicated zsh terminal\n\n### macOS/zsh",
  ));
  assert.throws(() => verifyModule10(root), /unbranched first instruction/);
});

test("verifier rejects a Lab 10 Windows starting-state branch that drops a tool check", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => body.replace("npm.cmd --version", "Write-Output 'npm skipped'"));
  assert.throws(() => verifyModule10(root), /missing tool check: npm/);
});

test("verifier rejects a Lab 10 Windows starting-state branch that drops the helper path", () => {
  const root = changedCopy(
    "labs/10-implementation-golden-path.md",
    (body) => body.replace(
      "Join-Path $CourseRoot 'labs/fixtures/10-implementation-golden-path/implementation-lab.mjs'",
      "Join-Path $CourseRoot 'labs/fixtures/10-implementation-golden-path/missing-helper.mjs'",
    ),
  );
  assert.throws(() => verifyModule10(root), /missing the helper path/);
});

test("verifier rejects a Lab 10 Windows starting-state branch that drops create", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => body.replace("node $Helper create", "node $Helper make"));
  assert.throws(() => verifyModule10(root), /missing create/);
});

test("verifier rejects a Lab 10 Windows starting-state branch that drops guard", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => {
    const start = body.indexOf(lab10WindowsHeading);
    const end = body.indexOf("## Safety boundary", start);
    const windows = body.slice(start, end).replaceAll("& node $Helper guard $LabRoot", "& node $Helper status $LabRoot");
    return body.slice(0, start) + windows + body.slice(end);
  });
  assert.throws(() => verifyModule10(root), /missing guard/);
});

test("verifier rejects a Lab 10 route that drops the ordered-task relationship", () => {
  const root = changedCopy(
    "labs/10-implementation-golden-path.md",
    (body) => body.replace("does not replace Tasks 1-3", "covers some commands"),
  );
  assert.throws(() => verifyModule10(root), /relates to the ordered tasks/);
});

test("verifier rejects relabeling the Lab 10 Native Windows route as the starting-state check", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => body.replace("candidate whole-lab path", "verified starting-state check"));
  assert.throws(() => verifyModule10(root), /must not relabel the Native Windows route/);
});

test("verifier rejects a Lab 10 Windows starting-state branch that drops the Python check", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => body.replace(
    `$PythonCommand = @('python', 'python3', 'py') | ForEach-Object {
    Get-Command $_ -CommandType Application -ErrorAction SilentlyContinue
  } | Select-Object -First 1
  if ($null -eq $PythonCommand) { throw 'Python is required for the Lab 10 isolated PATH.' }
  & $PythonCommand.Source --version
  `,
    "",
  ));
  assert.throws(() => verifyModule10(root), /must check Python as python, python3, then py/);
});

test("verifier rejects a Lab 10 Windows starting-state that checks Python after create", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => body.replace(
    `$PythonCommand = @('python', 'python3', 'py') | ForEach-Object {
    Get-Command $_ -CommandType Application -ErrorAction SilentlyContinue
  } | Select-Object -First 1
  if ($null -eq $PythonCommand) { throw 'Python is required for the Lab 10 isolated PATH.' }
  & $PythonCommand.Source --version
  $CourseRoot = (Resolve-Path -LiteralPath '.').Path
  $Helper = Join-Path $CourseRoot 'labs/fixtures/10-implementation-golden-path/implementation-lab.mjs'
  if (-not (Test-Path -LiteralPath $Helper -PathType Leaf)) { throw "Lab 10 starting-state helper not found: $Helper" }
  $LabRoot = ((& node $Helper create) | Out-String).Trim()`,
    `$CourseRoot = (Resolve-Path -LiteralPath '.').Path
  $Helper = Join-Path $CourseRoot 'labs/fixtures/10-implementation-golden-path/implementation-lab.mjs'
  if (-not (Test-Path -LiteralPath $Helper -PathType Leaf)) { throw "Lab 10 starting-state helper not found: $Helper" }
  $LabRoot = ((& node $Helper create) | Out-String).Trim()
  $PythonCommand = @('python', 'python3', 'py') | ForEach-Object {
    Get-Command $_ -CommandType Application -ErrorAction SilentlyContinue
  } | Select-Object -First 1
  if ($null -eq $PythonCommand) { throw 'Python is required for the Lab 10 isolated PATH.' }
  & $PythonCommand.Source --version`,
  ));
  assert.throws(() => verifyModule10(root), /must check Python before create/);
});

test("verifier rejects a Lab 10 Windows starting-state that guards after install", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => {
    const start = body.indexOf(lab10WindowsHeading);
    const end = body.indexOf("## Safety boundary", start);
    const windows = body.slice(start, end).replace(
      `& node $Helper guard $LabRoot
  if ($LASTEXITCODE -ne 0) { throw 'Lab 10 starting-state guard failed.' }
  if ((git -C $LabRoot branch --show-current | Out-String).Trim() -ne 'training/module-10') { throw 'expected training/module-10' }
  if ((git -C $LabRoot remote | Out-String).Trim()) { throw 'lab must have no remote' }
  & node $Helper install $LabRoot`,
      `if ((git -C $LabRoot branch --show-current | Out-String).Trim() -ne 'training/module-10') { throw 'expected training/module-10' }
  if ((git -C $LabRoot remote | Out-String).Trim()) { throw 'lab must have no remote' }
  & node $Helper install $LabRoot
  & node $Helper guard $LabRoot
  if ($LASTEXITCODE -ne 0) { throw 'Lab 10 starting-state guard failed.' }`,
    );
    return body.slice(0, start) + windows + body.slice(end);
  });
  assert.throws(() => verifyModule10(root), /create, then guard, then install/);
});

const lab10WindowsPause = `Stay in this PowerShell session so \`$LabRoot\` remains set. Edit only
\`Join-Path $LabRoot "src/greeting.mjs"\` as specified in Task 2. Then run the
Task 2 one-file status/diff checkpoint:

\`git -C $LabRoot status --short\`

\`git -C $LabRoot diff --name-only\`

Both views must name only \`src/greeting.mjs\`. Then paste Phase B.

**Phase B.** Verify, inspect evidence, reset, and archive using the retained
root.

\`\`\`powershell
`;

test("verifier rejects a Lab 10 Native Windows route that keeps readiness and verify in one fence", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => body.replace(
    `Write-Output $LabRoot
\`\`\`

${lab10WindowsPause}`,
    "Write-Output $LabRoot\n",
  ));
  assert.throws(() => verifyModule10(root), /must not share a PowerShell fence/);
});

test("verifier rejects a Lab 10 Native Windows route that separates readiness and verify with only a comment", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => body.replace(
    lab10WindowsPause,
    `<!-- Edit only (Join-Path $LabRoot "src/greeting.mjs") as specified in the implementation step. -->

\`\`\`powershell
`,
  ));
  assert.throws(() => verifyModule10(root), /must not separate readiness and verify with only a comment/);
});

test("verifier rejects a Lab 10 route that treats starting-state and whole-lab as a sequence", () => {
  const root = changedCopy("labs/10-implementation-golden-path.md", (body) => body.replace(
    "The Environment starting-state attempt and this Native Windows whole-lab route are\nalternative paths, not a sequence. Do not run both.",
    "After the Environment starting-state attempt, continue into this Native Windows whole-lab route.",
  ));
  assert.throws(() => verifyModule10(root), /alternative paths/);
});
