import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { lab11RetainedLiteralStdoutTokens, verifyModule11 } from "./verify-module-11.mjs";

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
const lab11Path = "labs/11-testing-gates-and-evidence.md";
const createCommand = "node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs create";
const requiredVersionCommands = [
  "node --version",
  "npm --version",
  "git --version",
  "task --version",
  "uv --version",
];

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

function replaceLab11StartingStateFence(body, lines) {
  const heading = "## Environment and starting-state check";
  const sectionStart = body.indexOf(heading);
  assert.ok(sectionStart >= 0, "Lab 11 must retain its Environment and starting-state check");
  const nextHeading = body.indexOf("\n## ", sectionStart + heading.length);
  const sectionEnd = nextHeading >= 0 ? nextHeading : body.length;
  const before = body.slice(sectionStart, sectionEnd);
  const after = before.replace(
    /```sh\r?\n[\s\S]*?node labs\/fixtures\/11-testing-gates-and-evidence\/gates-lab\.mjs create\r?\n```/,
    `\`\`\`sh\n${lines.join("\n")}\n\`\`\``,
  );
  assert.notEqual(after, before, "Lab 11 starting-state fence must be replaceable in the test fixture");
  return `${body.slice(0, sectionStart)}${after}${body.slice(sectionEnd)}`;
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

for (const command of requiredVersionCommands) {
  test(`verifier rejects a starting-state fence missing ${command}`, () => {
    const root = changedCopy(lab11Path, (body) => replaceLab11StartingStateFence(
      body,
      ["set -eu", ...requiredVersionCommands.filter((candidate) => candidate !== command), createCommand],
    ));
    assert.throws(() => verifyModule11(root), /starting-state gate/);
  });
}

test("verifier rejects a starting-state fence that is not fail-closed", () => {
  const root = changedCopy(lab11Path, (body) => replaceLab11StartingStateFence(
    body,
    [...requiredVersionCommands, createCommand],
  ));
  assert.throws(() => verifyModule11(root), /fail-closed/);
});

test("verifier rejects disabling errexit after the fail-closed line", () => {
  const root = changedCopy(lab11Path, (body) => replaceLab11StartingStateFence(
    body,
    ["set -eu", "set +e", ...requiredVersionCommands, createCommand],
  ));
  assert.throws(() => verifyModule11(root), /exact fail-closed command prefix/);
});

test("verifier rejects create running before the required tool checks", () => {
  const root = changedCopy(lab11Path, (body) => replaceLab11StartingStateFence(
    body,
    ["set -eu", createCommand, ...requiredVersionCommands],
  ));
  assert.throws(() => verifyModule11(root), /before create/);
});

test("verifier rejects capturing create before the learner can copy its printed path", () => {
  const root = changedCopy(lab11Path, (body) => replaceLab11StartingStateFence(
    body,
    ["set -eu", ...requiredVersionCommands, `LAB11_ROOT="$(${createCommand})"`],
  ));
  assert.throws(() => verifyModule11(root), /print the create path/);
});

test("verifier rejects losing the separate LAB11_ROOT export fence", () => {
  const root = changedCopy(lab11Path, (body) => body.replace(
    'export LAB11_ROOT="/absolute/path/printed/by/the/helper"',
    'LAB11_ROOT="/absolute/path/printed/by/the/helper"',
  ));
  assert.throws(() => verifyModule11(root), /separate LAB11_ROOT export fence/);
});

test("verifier rejects Task or uv pins in the Lab 11 starting-state contract", () => {
  const root = changedCopy(lab11Path, (body) => body.replace(
    "Use Node.js 20 or later, npm, Git, Task, and `uv`.",
    "Use Node.js 20 or later, npm, Git, `Task` 3.50.0, and `uv` 0.11.10.",
  ));
  assert.throws(() => verifyModule11(root), /resolution checks only/);
});

for (const pinnedTool of [
  "Task version 3.50.0",
  "uv version 0.11.10",
  "Task >= 3.50.0",
  "uv ~0.11.10",
  "Task version: 3.50.0",
]) {
  test(`verifier rejects the natural-language pin ${pinnedTool}`, () => {
    const root = changedCopy(lab11Path, (body) => body.replace(
      "Use Node.js 20 or later, npm, Git, Task, and `uv`.",
      `Use Node.js 20 or later, npm, Git, Task, and \`uv\`; require ${pinnedTool}.`,
    ));
    assert.throws(() => verifyModule11(root), /resolution checks only/);
  });
}

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
  assert.throws(() => verifyModule11(root), /Task 4 field table completed column drifted|Task 4 completed quality-record example drifted/);
});

test("verifier rejects Task 4 table drift that still has tokens in the JSON example", () => {
  const root = changedCopy("labs/11-testing-gates-and-evidence.md", (body) => {
    const after = body.replace(
      "| `status` | `INCOMPLETE` | `COMPLETE` |",
      "| `status` | `INCOMPLETE` | `DONE` |",
    );
    assert.ok(after.includes('"status": "COMPLETE"'), "JSON example must still contain COMPLETE");
    return after;
  });
  assert.throws(() => verifyModule11(root), /Task 4 field table completed column drifted/);
});

test("verifier rejects Task 4 JSON example drift that still has tokens in the field table", () => {
  const root = changedCopy("labs/11-testing-gates-and-evidence.md", (body) => {
    const after = body.replace(
      '  "status": "COMPLETE",',
      '  "status": "DONE",',
    );
    assert.ok(
      after.includes("| `status` | `INCOMPLETE` | `COMPLETE` |"),
      "field table must still contain COMPLETE",
    );
    return after;
  });
  assert.throws(() => verifyModule11(root), /Task 4 completed quality-record example drifted/);
});

test("verifier accepts CRLF Lab 11 Task 4 markup", () => {
  const root = copiedRepository();
  const target = join(root, "labs/11-testing-gates-and-evidence.md");
  const lf = readFileSync(target, "utf8").replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  writeFileSync(target, lf.replaceAll("\n", "\r\n"));
  assert.ok(verifyModule11(root).artifactCount > 25);
});

const solution11Path = "solutions/lab-11-testing-gates-and-evidence.md";
const retainedFocusedCommand = "✓ npm run test:focused — exit 0 (expected 0)";
const retainedBehaviorCommand = "✓ npm run check:behavior — exit 0 (expected 0)";
const retainedBankedLine = lab11RetainedLiteralStdoutTokens.at(-1);

test("verifier rejects a Lab 11 Task 3 inspect fragment missing a retained stdout token", () => {
  const root = changedCopy(lab11Path, (body) => spliceOnce(
    lab11Lf(body),
    `  ${retainedFocusedCommand}\n`,
    "",
  ));
  assert.throws(() => verifyModule11(root), /inspect fragment must lock retained 0\.119\.5 stdout/);
});

test("verifier rejects an explained-solution inspect fragment missing a retained stdout token", () => {
  const root = changedCopy(solution11Path, (body) => spliceOnce(
    lab11Lf(body),
    `${retainedBankedLine}\n`,
    "",
  ));
  assert.throws(() => verifyModule11(root), /inspect fragment must lock retained 0\.119\.5 stdout/);
});

test("verifier rejects swapping or inserting between the two retained command lines", () => {
  const root = changedCopy(lab11Path, (body) => spliceOnce(
    lab11Lf(body),
    `  ${retainedFocusedCommand}\n  ${retainedBehaviorCommand}\n`,
    `  ${retainedBehaviorCommand}\n  extra command line\n  ${retainedFocusedCommand}\n`,
  ));
  assert.throws(() => verifyModule11(root), /contiguous ordered fragment/);
});

test("verifier rejects restoring clause-walk evidence in the Lab 11 Task 3 inspect fragment", () => {
  const root = changedCopy(lab11Path, (body) => spliceOnce(
    lab11Lf(body),
    "Literal acceptance-command gate passed (#3284/#3267): 2 command(s) run verbatim\n",
    "verify:ac clause walk (#3323): 0 verified, 1 unverifiable, 0 failed\nLiteral acceptance-command gate passed (#3284/#3267): 2 command(s) run verbatim\n",
  ));
  assert.throws(() => verifyModule11(root), /must not restore obsolete clause-walk evidence/);
});

test("verifier rejects restoring no-artifact-path evidence in the explained-solution inspect fragment", () => {
  const root = changedCopy(solution11Path, (body) => spliceOnce(
    lab11Lf(body),
    `  ${retainedFocusedCommand}\n`,
    "  [unverifiable] clause 1 @ (no path): sample — no artifact path bound\n  ✓ npm run test:focused — exit 0 (expected 0)\n",
  ));
  assert.throws(() => verifyModule11(root), /must not restore obsolete clause-walk evidence: no artifact path bound/);
});

test("verifier rejects teaching both stdout variants in Lab 11 Task 3", () => {
  const root = changedCopy(lab11Path, (body) => spliceOnce(
    lab11Lf(body),
    "Classify that fragment:",
    "Teach both observed variants. Classify that fragment:",
  ));
  assert.throws(() => verifyModule11(root), /one retained fixture fragment, not a dual-variant recut/);
});

test("verifier rejects dropping literal-acceptance classification from Lab 11 Task 3", () => {
  const root = changedCopy(lab11Path, (body) => spliceOnce(
    lab11Lf(body),
    "That is the literal-acceptance proof.",
    "That is the overall pass signal.",
  ));
  assert.throws(() => verifyModule11(root), /must classify retained 0\.119\.5 stdout: literal-acceptance proof/);
});

test("verifier rejects a missing Module 11 outcome mapping", () => {
  const root = changedCopy("curriculum/modules/11-testing-gates-and-evidence.md", (body) => body.replaceAll("O11.8", "O11.X"));
  assert.throws(() => verifyModule11(root), /missing O11\.8/);
});

test("verifier rejects an altered exact fixture pin", () => {
  const root = changedCopy("labs/fixtures/11-testing-gates-and-evidence/package.json", (body) => body.replaceAll("0.119.5", "^0.119.5"));
  assert.throws(() => verifyModule11(root), /exact Directive pin/);
});

function lab11Lf(body) {
  return body.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
}

function spliceOnce(haystack, needle, replacement) {
  const index = haystack.indexOf(needle);
  assert.ok(index >= 0, "mutation must match authored text");
  return `${haystack.slice(0, index)}${replacement}${haystack.slice(index + needle.length)}`;
}

function replaceLab11Windows(body, from, to) {
  const lf = lab11Lf(body);
  const after = spliceOnce(lf, from, to);
  assert.notEqual(after, lf, "Lab 11 Native Windows mutation must match the authored pause text");
  return after;
}

const lab11PauseTask1 = `Stay in this PowerShell session so \`$LabRoot\` remains set. Make only the Task 1
focused-test edit at \`Join-Path $LabRoot "test/summary.test.mjs"\`. Then paste
Phase B.

**Phase B.** Retain the meaningful red failure.

\`\`\`powershell
`;

const lab11PauseTask2 = `Stay in this PowerShell session so \`$LabRoot\` remains set. Change only
\`Join-Path $LabRoot "src/summary.mjs"\` as specified in Task 2: add average to
the returned object. Then paste Phase C.

**Phase C.** Retain green.

\`\`\`powershell
`;

const lab11PauseRefactor = `Stay in this PowerShell session so \`$LabRoot\` remains set. Change only
\`Join-Path $LabRoot "src/summary.mjs"\` again so \`count\` and \`average\` are named
locals, as specified in Task 2. Then paste Phase D. Do not run \`refactor\` on
the same source bytes that just passed \`green\`.

**Phase D.** Refactor, then run literal acceptance and the seeded aggregate
diagnosis.

\`\`\`powershell
`;

const lab11PauseTask4 = `Stay in this PowerShell session so \`$LabRoot\` remains set. Repair only
\`Join-Path $LabRoot "quality-record.json"\` from the Task 4 field table. Then
paste Phase E.

**Phase E.** Verify the unchanged aggregate, inspect evidence, reset, and
archive.

\`\`\`powershell
`;

const lab11WindowsPauses = [
  {
    name: "create and red",
    pause: lab11PauseTask1,
    comment: "<!-- Add only the specified average test, then retain the meaningful failure. -->\n\n```powershell\n",
  },
  {
    name: "red and green",
    pause: lab11PauseTask2,
    comment: "<!-- Implement the specified source behavior, then retain green. -->\n\n```powershell\n",
  },
  {
    name: "green and refactor",
    pause: lab11PauseRefactor,
    comment: "<!-- Source-only refactor after green. -->\n\n```powershell\n",
  },
  {
    name: "aggregate and final",
    pause: lab11PauseTask4,
    comment: "<!-- Repair only quality-record.json from retained evidence, then verify the unchanged aggregate. -->\n\n```powershell\n",
  },
];

test("verifier rejects a Lab 11 Native Windows route that keeps the required edits in one fence", () => {
  const root = changedCopy(lab11Path, (body) => {
    let after = lab11Lf(body);
    after = spliceOnce(
      after,
      `Write-Output $LabRoot\n\`\`\`\n\n${lab11PauseTask1}`,
      "Write-Output $LabRoot\n# Add only the specified average test, then retain the meaningful failure.\n",
    );
    after = spliceOnce(
      after,
      `& node $Helper red $LabRoot\n\`\`\`\n\n${lab11PauseTask2}`,
      "& node $Helper red $LabRoot\n# Implement the specified source behavior, then retain green.\n",
    );
    after = spliceOnce(
      after,
      `& node $Helper green $LabRoot\n\`\`\`\n\n${lab11PauseRefactor}`,
      "& node $Helper green $LabRoot\n# Source-only refactor after green.\n",
    );
    after = spliceOnce(
      after,
      `if ($LASTEXITCODE -ne 0 -or $Aggregate -notmatch "EXPECTED_FAILURE") { throw "The seeded quality-record diagnosis was not retained." }\n\`\`\`\n\n${lab11PauseTask4}`,
      "if ($LASTEXITCODE -ne 0 -or $Aggregate -notmatch \"EXPECTED_FAILURE\") { throw \"The seeded quality-record diagnosis was not retained.\" }\n# Repair only quality-record.json from retained evidence, then verify the unchanged aggregate.\n",
    );
    assert.notEqual(after, lab11Lf(body), "one-fence mutation must collapse the four Windows pauses");
    return after;
  });
  assert.throws(() => verifyModule11(root), /must not share a PowerShell fence/);
});

test("verifier rejects a Lab 11 Native Windows route that comments out the red invocation", () => {
  const root = changedCopy(lab11Path, (body) => replaceLab11Windows(
    body,
    "& node $Helper red $LabRoot\n",
    "# & node $Helper red $LabRoot\n",
  ));
  assert.throws(() => verifyModule11(root), /missing red/);
});

for (const { name, pause, comment } of lab11WindowsPauses) {
  test(`verifier rejects a Lab 11 Native Windows route that separates ${name} with only a comment`, () => {
    const root = changedCopy(lab11Path, (body) => replaceLab11Windows(body, pause, comment));
    assert.throws(() => verifyModule11(root), /only a comment/);
  });
}

test("verifier rejects Lab 11 pause instructions hidden in an HTML comment", () => {
  const root = changedCopy(lab11Path, (body) => replaceLab11Windows(
    body,
    lab11PauseTask1,
    `<!-- Make only the Task 1 focused-test edit at \`Join-Path $LabRoot "test/summary.test.mjs"\`. -->

\`\`\`powershell
`,
  ));
  assert.throws(() => verifyModule11(root), /only a comment|missing required handoff text/);
});

test("verifier rejects a Lab 11 Native Windows Read-Host pause inside a fence", () => {
  const root = changedCopy(lab11Path, (body) => replaceLab11Windows(
    body,
    "Write-Output $LabRoot\n",
    "Write-Output $LabRoot\n[void](Read-Host 'Press Enter after the Task 1 test edit')\n",
  ));
  assert.throws(() => verifyModule11(root), /must not use an in-fence prompt/);
});

test("verifier rejects a Lab 11 Native Windows helper pause verb", () => {
  const root = changedCopy(lab11Path, (body) => replaceLab11Windows(
    body,
    "Write-Output $LabRoot\n",
    "Write-Output $LabRoot\n& node $Helper pause $LabRoot\n",
  ));
  assert.throws(() => verifyModule11(root), /must not add a helper pause, resume, or wait verb/);
});

test("verifier rejects a later Lab 11 Windows phase that creates a new attempt", () => {
  const root = changedCopy(lab11Path, (body) => replaceLab11Windows(
    body,
    "& node $Helper refactor $LabRoot\n",
    "$LabRoot = ((& node $Helper create) | Out-String).Trim()\n& node $Helper refactor $LabRoot\n",
  ));
  assert.throws(() => verifyModule11(root), /reuse \$LabRoot rather than create a new attempt/);
});

test("verifier rejects dropping the post-green source-only handoff text", () => {
  const root = changedCopy(lab11Path, (body) => replaceLab11Windows(
    body,
    lab11PauseRefactor,
    `Stay in this PowerShell session so \`$LabRoot\` remains set. Continue when ready.

**Phase D.** Refactor, then run literal acceptance and the seeded aggregate
diagnosis.

\`\`\`powershell
`,
  ));
  assert.throws(() => verifyModule11(root), /missing required handoff text/);
});
