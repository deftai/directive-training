import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import { verifyModule7 } from "./verify-module-7.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const copyPaths = [
  "README.md", "CHANGELOG.md", "LICENSE", "package.json", "curriculum", "labs", "solutions",
  "assessments", "maintainers", "references", "templates", "xbrief",
];
const scopeFilename = "2026-09-08-module-7-scope-lifecycle-and-implementation-authorization.xbrief.json";
const projectScopeId = "2026-09-08-module-7-scope-lifecycle-and-implementation-authorization";
const copiedRoots = new Set();

afterEach(() => {
  for (const root of copiedRoots) rmSync(root, { force: true, recursive: true });
  copiedRoots.clear();
});

function copiedRepository() {
  const root = mkdtempSync(join(tmpdir(), "module7-contract-test-"));
  copiedRoots.add(root);
  for (const source of copyPaths) cpSync(join(repositoryRoot, source), join(root, source), { recursive: true });
  return root;
}

function toLf(text) {
  return text.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
}

function changedCopy(path, transform) {
  const root = copiedRepository();
  const target = join(root, path);
  const before = toLf(readFileSync(target, "utf8"));
  const after = transform(before);
  assert.notEqual(after, before, `negative mutation must change ${path}`);
  writeFileSync(target, after);
  return root;
}

// Splice the first anchor positionally so no replacement metacharacter is interpreted.
function splicedCopy(path, anchor, replacement) {
  return changedCopy(path, (body) => {
    const index = body.indexOf(anchor);
    assert.ok(index >= 0, `negative mutation anchor is missing in ${path}: ${anchor}`);
    return body.slice(0, index) + replacement + body.slice(index + anchor.length);
  });
}

function activeLifecycleCopy() {
  const root = copiedRepository();
  const completedScope = join(root, "xbrief", "completed", scopeFilename);
  const activeScope = join(root, "xbrief", "active", scopeFilename);
  renameSync(completedScope, activeScope);

  const scope = JSON.parse(readFileSync(activeScope, "utf8"));
  scope.plan.status = "running";
  for (const item of scope.plan.items) item.status = "proposed";
  for (const field of ["completionProvenance", "deliveryDisposition", "handoffState", "lifecycleWrite", "completedAt", "completedSessionId"]) {
    delete scope.plan.metadata[field];
  }
  writeFileSync(activeScope, `${JSON.stringify(scope, null, 2)}\n`);

  const projectPath = join(root, "xbrief", "PROJECT-DEFINITION.xbrief.json");
  const project = JSON.parse(readFileSync(projectPath, "utf8"));
  const projectItem = project.plan.items.find((item) => item.id === projectScopeId);
  projectItem.status = "running";
  projectItem.metadata.lifecycle_folder = "active";
  projectItem.metadata.source_path = `active/${scopeFilename}`;
  writeFileSync(projectPath, `${JSON.stringify(project, null, 2)}\n`);

  const parentPath = join(root, "xbrief", "proposed", "2026-09-05-modules-6-8-work-lifecycle-and-sessions.xbrief.json");
  const parent = JSON.parse(readFileSync(parentPath, "utf8"));
  const scopeReference = parent.plan.references.find(({ uri }) => uri.endsWith(scopeFilename));
  scopeReference.uri = `active/${scopeFilename}`;
  writeFileSync(parentPath, `${JSON.stringify(parent, null, 2)}\n`);
  return root;
}

test("Module 7 content contract accepts the completed repository", () => {
  const result = verifyModule7(repositoryRoot);
  assert.equal(result.artifactCount, 21);
});

test("Module 7 content contract accepts the active implementation state", () => {
  const result = verifyModule7(activeLifecycleCopy());
  assert.equal(result.artifactCount, 21);
});

test("verifier rejects a lifecycle registry mismatch", () => {
  const root = changedCopy("xbrief/PROJECT-DEFINITION.xbrief.json", (body) => {
    const project = JSON.parse(body);
    const projectItem = project.plan.items.find((item) => item.id === projectScopeId);
    projectItem.status = "running";
    return `${JSON.stringify(project, null, 2)}\n`;
  });
  assert.throws(() => verifyModule7(root), /status must match its lifecycle scope/);
});

test("verifier rejects simultaneous active and completed lifecycle artifacts", () => {
  const root = copiedRepository();
  cpSync(
    join(root, "xbrief", "completed", scopeFilename),
    join(root, "xbrief", "active", scopeFilename),
  );
  assert.throws(() => verifyModule7(root), /exactly one active or completed lifecycle scope artifact/);
});

test("verifier rejects a weakened safety guard", () => {
  const root = changedCopy("labs/fixtures/07-scope-lifecycle/safety.mjs", (body) => body.replace("assertNoGitRedirection", "acceptGitRedirection"));
  assert.throws(() => verifyModule7(root), /Git redirection guard/);
});

test("verifier rejects missing transition outcome evidence", () => {
  const root = changedCopy("solutions/lab-07-scope-lifecycle.md", (body) => body.replaceAll("O7.3", "O7.3-extra"));
  assert.throws(() => verifyModule7(root), /O7\.3/);
});

test("verifier rejects a missing O6.4 prerequisite", () => {
  const root = changedCopy("curriculum/modules/07-scope-lifecycle.md", (body) => body.replace(
    "Bring the passing O6.4 routing matrix",
    "Optionally review the O6.4 routing matrix",
  ));
  assert.throws(() => verifyModule7(root), /passing O6\.4 routing matrix/);
});

test("verifier rejects a Lab 7 isolated-tools contract without Python", () => {
  const root = splicedCopy("labs/07-scope-lifecycle.md", "`git`, `python`, `uv`", "`git`, `uv`");
  assert.throws(() => verifyModule7(root), /isolated tools must include Python/);
});

test("verifier rejects a generic Directive rationale for the Python prerequisite", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "Do not treat Python as a generic\nprerequisite for Directive verification.",
    "Python is a generic prerequisite for Directive verification.",
  );
  assert.throws(() => verifyModule7(root), /distinguish helper-isolated PATH requirements/);
});

test("verifier rejects a Lab 7 Python preflight that does not mirror the helper PATH scan", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    'if [ -e "$python_candidate" ]; then',
    'if command -v "$python_name" >/dev/null 2>&1; then',
  );
  assert.throws(() => verifyModule7(root), /mirror the helper PATH scan and selected candidate/);
});

test("verifier rejects a Lab 7 preflight that changes the selected candidate", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    'python_command="$python_candidate"',
    "python_command=python",
  );
  assert.throws(() => verifyModule7(root), /mirror the helper PATH scan and selected candidate/);
});

test("verifier rejects a Lab 7 PATH scan that is not portable to zsh", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    'python_search=${python_search#*:}',
    "python_search=",
  );
  assert.throws(() => verifyModule7(root), /mirror the helper PATH scan and selected candidate/);
});

test("verifier rejects presence-only O6.4 admission", () => {
  const root = changedCopy("curriculum/modules/07-scope-lifecycle.md", (body) => body.replace(
    "presence-only, keyword-only, or incomplete",
    "missing entirely",
  ));
  assert.throws(() => verifyModule7(root), /superficial O6\.4 evidence/);
});

test("verifier rejects attributing mechanism-shaped judgment to Directive", () => {
  const root = changedCopy("curriculum/modules/07-scope-lifecycle.md", (body) => body.replace(
    "Directive 0.119.5 does not compute whether work\nis mechanism-shaped, and `scope:promote` is not fail-closed on that judgment.",
    "Directive 0.119.5 computes whether work\nis mechanism-shaped, and `scope:promote` is fail-closed on that judgment.",
  ));
  assert.throws(() => verifyModule7(root), /mechanism-shaped judgment to Directive/);
});

test("verifier rejects a broken local navigation link", () => {
  const root = changedCopy("curriculum/modules/07-scope-lifecycle.md", (body) => body.replace("../README.md", "../missing-course-map.md"));
  assert.throws(() => verifyModule7(root), /broken local link/);
});

test("verifier rejects an unavailable range that still includes Lab 7", () => {
  const root = changedCopy("labs/README.md", (body) => body.replace(
    "## Lab navigation",
    "Labs for Modules 6–11 and the capstone are not yet available.\n\n## Lab navigation",
  ));
  assert.throws(() => verifyModule7(root), /unavailable Modules 6–11 range/);
});

test("verifier rejects reset that reuses the failed root", () => {
  const root = changedCopy("labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs", (body) => body.replace("return createAttempt(); // fresh-reset", "return guardAttempt(root); // fresh-reset"));
  assert.throws(() => verifyModule7(root), /fresh-attempt reset/);
});

test("verifier rejects promoting Windows without current native evidence", () => {
  const root = changedCopy("references/SOURCE-BASELINE.md", (body) => body.replace(
    "teaching-platform-proof:windows-pwsh7 status=candidate",
    "teaching-platform-proof:windows-pwsh7 status=verified",
  ));
  assert.throws(() => verifyModule7(root), /windows-pwsh7/);
});

test("verifier rejects a course index that drops candidate platforms", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "| 07 | [Scope lifecycle and implementation authorization](modules/07-scope-lifecycle.md) | 65 min | Learner-ready; lab verified on macOS/zsh; Linux and Windows candidates | Fail, promote, activate, establish current readiness, complete, and cancel |",
    "| 07 | [Scope lifecycle and implementation authorization](modules/07-scope-lifecycle.md) | 65 min | Learner-ready; lab verified on macOS/zsh only | Fail, promote, activate, establish current readiness, complete, and cancel |",
  ));
  assert.throws(() => verifyModule7(root), /current platform boundaries/);
});

test("verifier rejects remote mutation text in executable fixture code", () => {
  const root = changedCopy("labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs", (body) => body + '\n// git push origin training/module-07\n');
  assert.throws(() => verifyModule7(root), /forbidden remote or destructive command/);
});

test("verifier rejects a Lab 7 Done pointer that drops the tracked-closeout gate", () => {
  const root = splicedCopy("labs/07-scope-lifecycle.md", "`verify:completed-tracked`", "a gate taught later");
  assert.throws(() => verifyModule7(root), /must name verify:completed-tracked/);
});

test("verifier rejects a Lab 7 Done pointer that claims tracked closeout", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "so it claims no\nleftover completion and no tracked closeout",
    "so it also proves leftover completion and tracked closeout",
  );
  assert.throws(() => verifyModule7(root), /claims no tracked closeout/);
});

test("verifier rejects leftover-completion verbs inside the Module 7 no-remote Task block", () => {
  const root = splicedCopy(
    "references/QUICK-REFERENCE.md",
    "task deft:scope:complete -- xbrief/active/<scope>.xbrief.json",
    "task deft:scope:complete -- xbrief/active/<scope>.xbrief.json\ntask deft:verify:completed-tracked",
  );
  assert.throws(() => verifyModule7(root), /out of every fenced command block/);
});

test("verifier rejects a runnable advanced swarm closer in the quick reference", () => {
  const root = splicedCopy(
    "references/QUICK-REFERENCE.md",
    "task deft:scope:cancel -- xbrief/proposed/<obsolete-scope>.xbrief.json",
    "task deft:scope:cancel -- xbrief/proposed/<obsolete-scope>.xbrief.json\ndeft swarm:finalize-cohort",
  );
  assert.throws(() => verifyModule7(root), /out of every fenced command block/);
});

test("verifier rejects a quick reference that drops the advanced swarm closer", () => {
  const root = splicedCopy(
    "references/QUICK-REFERENCE.md",
    "`swarm:finalize-cohort` is the advanced orchestration alternative",
    "A cohort sweep is the advanced orchestration alternative",
  );
  assert.throws(() => verifyModule7(root), /must name the advanced swarm closer/);
});

test("verifier rejects a quick reference that invokes the advanced swarm closer", () => {
  const root = splicedCopy("references/QUICK-REFERENCE.md", "this course never invokes it", "run it after every merge");
  assert.throws(() => verifyModule7(root), /named but not invoked/);
});

test("verifier rejects naming the advanced swarm closer more than once", () => {
  const root = splicedCopy(
    "references/QUICK-REFERENCE.md",
    "this course never invokes it",
    "this course never invokes it, and `swarm:finalize-cohort` stays parked",
  );
  assert.throws(() => verifyModule7(root), /exactly once/);
});

// Module 11 models the shipped-next-module link the same way: a "remains planned" claim is the
// negative for a lesson that exists in the tree.
test("verifier rejects a Lab 7 solution that still calls Module 8 planned", () => {
  const root = splicedCopy(
    "solutions/lab-07-scope-lifecycle.md",
    "[Module 8 — Session start and authorized work selection](../curriculum/modules/08-session-and-work-selection.md).",
    "Module 8 remains planned.",
  );
  assert.throws(() => verifyModule7(root), /must not claim that Module 8 is planned/);
});

test("verifier rejects the retired course-map fallback for a shipped Module 8", () => {
  const root = splicedCopy(
    "solutions/lab-07-scope-lifecycle.md",
    "The [course map](../curriculum/README.md) lists the rest of the path.",
    "Use the [course map](../curriculum/README.md) rather than assuming a future filename is ready.",
  );
  assert.throws(() => verifyModule7(root), /course-map fallback/);
});

test("verifier rejects a Lab 7 solution that drops the Module 8 lesson link", () => {
  const root = splicedCopy(
    "solutions/lab-07-scope-lifecycle.md",
    "[Module 8 — Session start and authorized work selection](../curriculum/modules/08-session-and-work-selection.md)",
    "Module 8",
  );
  assert.throws(() => verifyModule7(root), /must link the shipped Module 8 lesson/);
});

// Module 7 Navigation's own href is relative to curriculum/modules/, so copying it into the
// solution breaks the link rather than pointing at the shipped lesson.
test("verifier rejects the Module 7 Navigation href copied into the solution", () => {
  const root = splicedCopy(
    "solutions/lab-07-scope-lifecycle.md",
    "](../curriculum/modules/08-session-and-work-selection.md)",
    "](08-session-and-work-selection.md)",
  );
  assert.throws(() => verifyModule7(root), /broken local link/);
});

const lab7WindowsHeading = `### Windows/PowerShell 7.4+ ${"\u2014"} candidate pending native evidence`;

test("verifier rejects a zsh-only Lab 7 Environment section", () => {
  const root = splicedCopy("labs/07-scope-lifecycle.md", lab7WindowsHeading, "### Notes");
  assert.throws(() => verifyModule7(root), /missing the Windows starting-state branch/);
});

test("verifier rejects an unbranched zsh lead on Lab 7", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "### macOS/zsh",
    "Use a dedicated zsh terminal\n\n### macOS/zsh",
  );
  assert.throws(() => verifyModule7(root), /unbranched first instruction/);
});

test("verifier rejects a Lab 7 Windows starting-state branch that drops a tool check", () => {
  const root = splicedCopy("labs/07-scope-lifecycle.md", "npm.cmd --version", "Write-Output 'npm skipped'");
  assert.throws(() => verifyModule7(root), /missing tool check: npm/);
});

test("verifier rejects a Lab 7 Windows starting-state branch that drops the helper path", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "Join-Path $CourseRoot 'labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs'",
    "Join-Path $CourseRoot 'labs/fixtures/07-scope-lifecycle/missing-helper.mjs'",
  );
  assert.throws(() => verifyModule7(root), /missing the helper path/);
});

test("verifier rejects a Lab 7 Windows starting-state branch that drops create", () => {
  const root = splicedCopy("labs/07-scope-lifecycle.md", "node $Helper create", "node $Helper make");
  assert.throws(() => verifyModule7(root), /missing create/);
});

test("verifier rejects a Lab 7 Windows starting-state branch that drops guard", () => {
  const root = splicedCopy("labs/07-scope-lifecycle.md", "& node $Helper guard $LabRoot", "& node $Helper status $LabRoot");
  assert.throws(() => verifyModule7(root), /missing guard/);
});

test("verifier rejects a Lab 7 route that drops the ordered-task relationship", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "replaces the ordered helper commands in Tasks 1-4",
    "covers some commands",
  );
  assert.throws(() => verifyModule7(root), /relates to the ordered tasks/);
});

test("verifier rejects relabeling the Lab 7 Native Windows route as the starting-state check", () => {
  const root = splicedCopy("labs/07-scope-lifecycle.md", "candidate whole-lab path", "verified starting-state check");
  assert.throws(() => verifyModule7(root), /must not relabel the Native Windows route/);
});

test("verifier rejects a Lab 7 Windows starting-state that guards after install", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    `& node $Helper guard $LabRoot
  if ($LASTEXITCODE -ne 0) { throw 'Lab 7 starting-state guard failed.' }
  if ((git -C $LabRoot branch --show-current | Out-String).Trim() -ne 'training/module-07') { throw 'expected training/module-07' }
  if ((git -C $LabRoot remote | Out-String).Trim()) { throw 'lab must have no remote' }
  & node $Helper install $LabRoot`,
    `if ((git -C $LabRoot branch --show-current | Out-String).Trim() -ne 'training/module-07') { throw 'expected training/module-07' }
  if ((git -C $LabRoot remote | Out-String).Trim()) { throw 'lab must have no remote' }
  & node $Helper install $LabRoot
  & node $Helper guard $LabRoot
  if ($LASTEXITCODE -ne 0) { throw 'Lab 7 starting-state guard failed.' }`,
  );
  assert.throws(() => verifyModule7(root), /create, then guard, then install/);
});

test("verifier rejects a Lab 7 Native Windows Read-Host pause inside a fence", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "Write-Host $LabRoot\nWrite-Host $Authored\n",
    "Write-Host $LabRoot\nWrite-Host $Authored\n[void](Read-Host 'Press Enter after the Module 6 proposed-scope write')\n",
  );
  assert.throws(() => verifyModule7(root), /prose, not Read-Host/);
});

test("verifier rejects a Lab 7 Native Windows route that keeps Task 5 in one PowerShell fence", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "Write-Host $LabRoot\nWrite-Host $Authored\n```\n\nPause after Phase A.",
    "Write-Host $LabRoot\nWrite-Host $Authored\nPause after Phase A.",
  );
  assert.throws(() => verifyModule7(root), /distinct PowerShell fences/);
});

test("verifier rejects a Lab 7 Phase A that Test-Path $Authored before the pause", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "$Authored = Join-Path $LabRoot \"xbrief/proposed/2026-01-15-your-proposed-scope.xbrief.json\"\nWrite-Host $LabRoot\nWrite-Host $Authored\n```",
    "$Authored = Join-Path $LabRoot \"xbrief/proposed/2026-01-15-your-proposed-scope.xbrief.json\"\nif (-not (Test-Path -LiteralPath $Authored -PathType Leaf)) { throw \"Write your Module 6 proposed scope to $Authored first.\" }\nWrite-Host $LabRoot\nWrite-Host $Authored\n```",
  );
  assert.throws(() => verifyModule7(root), /must not Test-Path \$Authored before the pause/);
});

test("verifier rejects a Lab 7 Phase A that drops Write-Host of the retained paths", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "Write-Host $LabRoot\nWrite-Host $Authored\n",
    "",
  );
  assert.throws(() => verifyModule7(root), /Write-Host the absolute \$LabRoot/);
});

test("verifier rejects a Lab 7 pause that drops the Task 5 write instruction", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "Write your Module 6 proposed-scope artifact\ndirectly to the printed `$Authored` path with your editor.",
    "Continue when ready.",
  );
  assert.throws(() => verifyModule7(root), /Task 5 write instruction/);
});

test("verifier rejects a Lab 7 pause that drops the untrusted-input boundary", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "The authored record is untrusted input to the CLI: fictional content only, no client\n  data, credentials, or paths outside the guarded first attempt.",
    "The authored record may be copied from any retained path.",
  );
  assert.throws(() => verifyModule7(root), /untrusted input/);
});

test("verifier rejects a Lab 7 Windows route that adds a helper copy-in verb", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "Write-Host $LabRoot\nWrite-Host $Authored\n",
    "Write-Host $LabRoot\nWrite-Host $Authored\nCopy-Item $Source $Authored\n",
  );
  assert.throws(() => verifyModule7(root), /copy-in verb/);
});

test("verifier rejects a Lab 7 Phase B that verifies before Test-Path and guard", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "if (-not (Test-Path -LiteralPath $Authored -PathType Leaf)) { throw \"Write your Module 6 proposed scope to $Authored first.\" }\n& node $Helper guard $LabRoot\nif ($LASTEXITCODE -ne 0) { throw \"Lab 7 retained-root guard failed.\" }\n$Cli = Join-Path $LabRoot \"node_modules/@deftai/directive/dist/bin.js\"\n$AuthoredRecord = Join-Path $EvidenceRoot \"authored-verify.txt\"\n$AuthoredCommand = \"node $Cli xbrief:verify -- --format json --out $Authored --style scope --project-root $LabRoot\"\n$Lab07ExpectedFailurePreference = $PSNativeCommandUseErrorActionPreference\ntry {\n  $PSNativeCommandUseErrorActionPreference = $false\n  & node $Cli xbrief:verify -- --format json --out $Authored --style scope --project-root $LabRoot *> $AuthoredRecord\n",
    "if (-not (Test-Path -LiteralPath $Authored -PathType Leaf)) { throw \"Write your Module 6 proposed scope to $Authored first.\" }\n  & node $Cli xbrief:verify -- --format json --out $Authored --style scope --project-root $LabRoot *> $AuthoredRecord\n& node $Helper guard $LabRoot\nif ($LASTEXITCODE -ne 0) { throw \"Lab 7 retained-root guard failed.\" }\n$Cli = Join-Path $LabRoot \"node_modules/@deftai/directive/dist/bin.js\"\n$AuthoredRecord = Join-Path $EvidenceRoot \"authored-verify.txt\"\n$AuthoredCommand = \"node $Cli xbrief:verify -- --format json --out $Authored --style scope --project-root $LabRoot\"\n$Lab07ExpectedFailurePreference = $PSNativeCommandUseErrorActionPreference\ntry {\n  $PSNativeCommandUseErrorActionPreference = $false\n",
  );
  assert.throws(() => verifyModule7(root), /Phase B must guard, then verify, reset, and archive/);
});

test("verifier rejects a Lab 7 Phase B that ignores a failed first-root guard", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "& node $Helper guard $LabRoot\nif ($LASTEXITCODE -ne 0) { throw \"Lab 7 retained-root guard failed.\" }\n",
    "& node $Helper guard $LabRoot\n",
  );
  assert.throws(() => verifyModule7(root), /must stop on a failed first-root guard/);
});

test("verifier rejects a Lab 7 Phase B that keeps xbrief:verify only as command text", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "  & node $Cli xbrief:verify -- --format json --out $Authored --style scope --project-root $LabRoot *> $AuthoredRecord\n",
    "",
  );
  assert.throws(() => verifyModule7(root), /must structurally verify the authored record/);
});


test("verifier rejects a Lab 7 route that treats starting-state and whole-lab as a sequence", () => {
  const root = splicedCopy(
    "labs/07-scope-lifecycle.md",
    "The Environment starting-state attempt and this Native Windows whole-lab route are\nalternative paths, not a sequence. Do not run both.",
    "After the Environment starting-state attempt, continue into this Native Windows whole-lab route.",
  );
  assert.throws(() => verifyModule7(root), /alternative paths/);
});

test("verifier rejects a Lab 7 solution that drops the Module 7 self-assessment return", () => {
  const root = splicedCopy(
    "solutions/lab-07-scope-lifecycle.md",
    "Return to [Module 7](../curriculum/modules/07-scope-lifecycle.md) and complete its",
    "Return to Module 7 and complete its",
  );
  assert.throws(() => verifyModule7(root), /Continue must return the learner to Module 7/);
});

test("verifier rejects a quick reference that drops the leftover-completion repair", () => {
  const root = splicedCopy(
    "references/QUICK-REFERENCE.md",
    "The general repair\nfor a missing tracked artifact is a lifecycle pull request.",
    "There is no repair for a missing tracked artifact.",
  );
  assert.throws(() => verifyModule7(root), /lifecycle pull request as the general repair/);
});
