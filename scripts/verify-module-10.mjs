import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { courseModuleRow, markdownParts, moduleHeadings, section, solutionHeadings, verifyLinks } from "./verify-modules-4-5.mjs";

const module10 = "curriculum/modules/10-testing-gates-and-evidence.md";
const lab10 = "labs/10-testing-gates-and-evidence.md";
const solution10 = "solutions/lab-10-testing-gates-and-evidence.md";
const scopeFilename = "2026-09-10-module-10-testing-gates-and-evidence.xbrief.json";
const lifecycleStates = [
  { path: `xbrief/active/${scopeFilename}`, status: "running", folder: "active" },
  { path: `xbrief/completed/${scopeFilename}`, status: "completed", folder: "completed" },
];
const parentScope = "xbrief/proposed/2026-09-05-modules-9-11-implementation-gates-and-review.xbrief.json";
const proposal = "history/changes/module-10-curriculum/proposal.xbrief.json";
const fixtureFiles = [
  "labs/fixtures/10-testing-gates-and-evidence/PROJECT-DEFINITION.xbrief.json",
  "labs/fixtures/10-testing-gates-and-evidence/Taskfile.yml",
  "labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs",
  "labs/fixtures/10-testing-gates-and-evidence/package.json",
  "labs/fixtures/10-testing-gates-and-evidence/quality-record.json",
  "labs/fixtures/10-testing-gates-and-evidence/safety.mjs",
  "labs/fixtures/10-testing-gates-and-evidence/scripts/verify-quality-record.mjs",
  "labs/fixtures/10-testing-gates-and-evidence/src/summary.mjs",
  "labs/fixtures/10-testing-gates-and-evidence/test/summary.test.mjs",
];
const requiredFiles = [
  module10, lab10, solution10, ...fixtureFiles,
  "README.md", "CHANGELOG.md", "curriculum/README.md", "labs/README.md",
  "solutions/README.md", "assessments/README.md", "maintainers/CURRICULUM-MAINTENANCE.md",
  "references/GLOSSARY.md", "references/QUICK-REFERENCE.md", "references/SOURCE-BASELINE.md",
  "references/SOURCE-NOTES.md", "package.json", "xbrief/PROJECT-DEFINITION.xbrief.json",
  parentScope, proposal, "scripts/gates-lab.test.mjs",
];
const labHeadings = [
  "Lab record", "Goal and done condition", "Fictional scenario", "Environment and starting-state check",
  "Safety boundary", "Starting checkpoint", "Tasks", "Checkpoints", "Literal acceptance commands",
  "Evidence bundle", "Progressive hints", "Expected failures and recovery", "Reset to start", "Cleanup",
  "Explained solution", "Done statement",
];
const outcomes = ["O10.1", "O10.2", "O10.3", "O10.4"];
const unfinished = /\{\{[^}]+\}\}|\b(?:TODO|TBD|FIXME)\b|Authoring template/i;

function exactBaseline(path, prose, heading) {
  const row = section(prose, heading).match(/^\| Directive baseline\s*\|([^\n]+)$/m)?.[1];
  assert.ok(row?.includes("0.112.0"), `${path} must declare exact Directive 0.112.0`);
  assert.deepEqual(
    [...new Set(row.match(/\b\d+\.\d+\.\d+\b/g))],
    ["0.112.0"],
    `${path} contains a stale or ranged Directive baseline`,
  );
}

function requireOutcomes(path, prose, headings) {
  for (const heading of headings) {
    const body = section(prose, heading);
    for (const outcome of outcomes) {
      assert.match(body, new RegExp(`\\b${outcome.replace(".", "\\.")}\\b`), `${path} ${heading} is missing ${outcome}`);
    }
  }
}

function requireModule10Link(content, label) {
  assert.match(content, /\]\([^)]*10-testing-gates-and-evidence\.md(?:#[^)]*)?\)/, `${label} is missing Module 10 navigation`);
}

/** Read-only Module 10 lesson, fixture, gate-integrity, evidence, and future-module verifier. */
export function verifyModule10(root = fileURLToPath(new URL("../", import.meta.url))) {
  assert.equal(typeof root, "string", "repository root must be a path string");
  const presentLifecycleStates = lifecycleStates.filter(({ path }) => {
    const absolute = resolve(root, path);
    return existsSync(absolute) && statSync(absolute).isFile();
  });
  assert.equal(presentLifecycleStates.length, 1, "Module 10 must have exactly one active or completed lifecycle scope artifact");
  const lifecycleState = presentLifecycleStates[0];
  const content = new Map();
  for (const path of [...requiredFiles, lifecycleState.path]) {
    const absolute = resolve(root, path);
    assert.ok(existsSync(absolute) && statSync(absolute).isFile(), `missing required artifact: ${path}`);
    const body = readFileSync(absolute, "utf8");
    assert.ok(body.trim(), `required artifact is empty: ${path}`);
    content.set(path, body);
  }

  const parsed = new Map();
  for (const [path, headings, record] of [
    [module10, moduleHeadings, "Module record"],
    [lab10, labHeadings, "Lab record"],
    [solution10, solutionHeadings, "Solution record"],
  ]) {
    const body = content.get(path);
    assert.doesNotMatch(body, unfinished, `${path} contains an unfinished author marker`);
    const parts = markdownParts(body);
    parsed.set(path, parts);
    for (const heading of headings) assert.ok(section(parts.prose, heading).trim(), `${path} has an empty section: ${heading}`);
    exactBaseline(path, parts.prose, record);
    assert.doesNotMatch(parts.prose, /\b(?:Directive behavior|3Ci policy|Course guidance)\b/i, `${path} contains a removed claim label`);
    verifyLinks(root, path, parts.prose);
  }

  const moduleProse = parsed.get(module10).prose;
  requireOutcomes(module10, moduleProse, ["Learning outcomes", "Completion evidence", "Self-assessment"]);
  assert.ok(moduleProse.includes("`red -> green -> refactor`"), `${module10} has an incorrect red-green-refactor order`);
  for (const phrase of [
    "npm run test:focused", "task deft:verify:ac", "directive verify:forward-coverage --project-root .",
    "task check", "first failing subcheck", "repair the work, not the gate", "gate-definition hashes",
  ]) assert.ok(moduleProse.includes(phrase), `${module10} is missing gate-integrity guidance: ${phrase}`);
  assert.match(section(moduleProse, "Navigation"), /\]\(09-implementation-golden-path\.md\)/, "Module 10 must link back to Module 9");
  assert.match(section(moduleProse, "Navigation"), /\]\(11-review-and-completion\.md\)/, "Module 10 must link forward to Module 11");

  const labProse = parsed.get(lab10).prose;
  assert.match(labProse, /unique OS-temporary repository with no remote/, `${lab10} is missing its temporary no-remote boundary`);
  assert.match(labProse, /native Windows\/PowerShell learner paths/, `${lab10} must retain verified native Windows support`);
  for (const verb of ["create", "install", "red", "green", "refactor", "literal", "aggregate", "final", "reset", "archive"]) {
    assert.match(labProse, new RegExp(`gates-lab\\.mjs ${verb}`), `${lab10} is missing helper verb: ${verb}`);
  }
  for (const path of ["red.json", "green.json", "refactor.json", "literal.json", "aggregate-failure.json", "final.json"]) {
    assert.ok(labProse.includes(path), `${lab10} is missing evidence artifact: ${path}`);
  }

  const solutionProse = parsed.get(solution10).prose;
  requireOutcomes(solution10, solutionProse, ["Outcome map", "Acceptance evidence"]);
  for (const phrase of ["EXPECTED_FAILURE", "quality:record", "quality-record.json only", "gateDefinitionsUnchanged", "average: 4"]) {
    assert.ok(solutionProse.includes(phrase), `${solution10} is missing explained evidence: ${phrase}`);
  }

  const course = content.get("curriculum/README.md");
  const module10Row = courseModuleRow(course, 10);
  assert.match(module10Row, /10-testing-gates-and-evidence\.md/, "Module 10 course row must link the lesson");
  assert.doesNotMatch(module10Row, /\|\s*Planned\s*\|/i, "Module 10 must no longer be planned");
  assert.match(module10Row, /verified on macOS\/zsh and native Windows\/PowerShell/i, "Module 10 course row must retain verified native Windows support");
  const module11Row = courseModuleRow(course, 11);
  assert.match(
    module11Row,
    /\[PR, review, and actual completion\]\(modules\/11-review-and-completion\.md\)/,
    "Module 11 course row must link the lesson",
  );
  assert.match(module11Row, /\|\s*Learner-ready\b/i, "Module 11 must remain learner-ready");
  for (const path of ["README.md", "curriculum/README.md", "labs/README.md", "solutions/README.md", "assessments/README.md"]) {
    requireModule10Link(content.get(path), path);
    verifyLinks(root, path, markdownParts(content.get(path)).prose);
  }
  assert.match(
    content.get("labs/README.md"),
    /^\| \[Lab 10[^\n]*\]\(10-testing-gates-and-evidence\.md\) \| Learner-ready draft;[^\n]*macOS[^\n]*native Windows\/PowerShell[^\n]*\|/m,
    "labs/README.md must list Lab 10 as learner-ready on its verified macOS and native Windows paths",
  );

  for (const term of ["literal acceptance", "forward coverage", "aggregate gate", "gate integrity", "red-green-refactor"]) {
    assert.match(content.get("references/GLOSSARY.md"), new RegExp(term, "i"), `glossary is missing Module 10 term: ${term}`);
  }
  for (const phrase of ["task deft:verify:ac", "directive verify:forward-coverage --project-root .", "task check", "quality-record.json"]) {
    assert.ok(content.get("references/QUICK-REFERENCE.md").includes(phrase), `quick reference is missing Module 10 guidance: ${phrase}`);
  }
  assert.match(content.get("references/SOURCE-BASELINE.md"), /^## Module 10 testing-and-gates validation\s*$/m, "source baseline is missing Module 10 validation");
  const notes = content.get("references/SOURCE-NOTES.md");
  assert.match(notes, /^## Module 10 source validation\s*$/m, "SOURCE-NOTES is missing the Module 10 source validation record");
  assert.doesNotMatch(notes, /module10-platform-proof:linux-bash status=verified/, "Linux must remain candidate for Module 10");
  for (const token of [
    "engine 0.114.0", "deposit 0.114.0", "exact 0.112.0 graph", "verify:ac",
    "module10-platform-proof:macos-zsh status=verified",
    "module10-platform-proof:linux-bash status=candidate",
    "module10-platform-proof:windows-powershell status=verified date=2026-09-15 evidence=independent-native-pwsh-walkthrough",
  ]) assert.ok(notes.includes(token), `SOURCE-NOTES Module 10 evidence is missing: ${token}`);

  const fixturePackage = JSON.parse(content.get("labs/fixtures/10-testing-gates-and-evidence/package.json"));
  assert.equal(fixturePackage.devDependencies?.["@deftai/directive"], "0.112.0", "Module 10 fixture must retain the exact Directive pin");
  for (const name of ["directive-core", "directive-content", "directive-types"]) {
    assert.equal(fixturePackage.overrides?.[`@deftai/${name}`], "0.112.0", `Module 10 fixture must pin ${name}`);
  }
  assert.equal(fixturePackage.scripts?.["test:focused"], "node --test test/summary.test.mjs", "Module 10 fixture must expose the focused test");
  assert.equal(fixturePackage.scripts?.["check:behavior"], "node src/summary.mjs 2 4 6", "Module 10 fixture must expose the literal behavior check");

  const helper = content.get("labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs");
  for (const invariant of [
    "realpathSync(tmpdir())", 'git(root, ["remote"])', "const allowedWorkFiles = [qualityPath, sourcePath, testPath]",
    "redTestDigest", "greenSourceDigest", "refactorSourceDigest", 'firstFailingSubcheck: "quality:record"', "gateDefinitionsUnchanged",
  ]) assert.ok(helper.includes(invariant), `Module 10 helper is missing guard invariant: ${invariant}`);

  const taskfile = content.get("labs/fixtures/10-testing-gates-and-evidence/Taskfile.yml");
  const ordered = ["- npm run test:focused", "- task: literal", "- task: forward-coverage", "- task: quality:record"].map((line) => taskfile.indexOf(line));
  assert.ok(ordered.every((index) => index >= 0) && ordered.every((index, position) => position === 0 || index > ordered[position - 1]), "Module 10 aggregate gate order is incorrect");
  assert.equal((taskfile.match(/^\s+- task: quality:record$/gm) ?? []).length, 1, "Module 10 aggregate gate order must contain one quality-record subcheck");

  const project = JSON.parse(content.get("xbrief/PROJECT-DEFINITION.xbrief.json"));
  const projectItems = project.plan.items.filter((item) => item.id === "2026-09-10-module-10-testing-gates-and-evidence");
  assert.equal(projectItems.length, 1, "PROJECT-DEFINITION must register Module 10 exactly once");
  const projectItem = projectItems[0];
  assert.equal(projectItem.status, lifecycleState.status, "PROJECT-DEFINITION Module 10 status must match its lifecycle scope");
  assert.equal(projectItem.metadata?.lifecycle_folder, lifecycleState.folder, "PROJECT-DEFINITION Module 10 folder must match its lifecycle scope");
  assert.equal(projectItem.metadata?.source_path, `${lifecycleState.folder}/${scopeFilename}`, "PROJECT-DEFINITION Module 10 source path must match its lifecycle scope");
  const scope = JSON.parse(content.get(lifecycleState.path));
  assert.equal(scope.plan?.status, lifecycleState.status, "Module 10 scope folder and status must agree");
  assert.deepEqual(scope.plan?.acceptance?.commands, ["npm run check:module-10", "npm run test:module-10", "directive verify:vbrief-conformance --project-root ."], "Module 10 literal acceptance commands changed");
  assert.equal(JSON.parse(content.get(parentScope)).plan?.status, "proposed", "Modules 9-11 parent phase remains proposed record state");
  assert.equal(JSON.parse(content.get(proposal)).plan?.status, "approved", "Module 10 change proposal must remain approved");

  const projectPackage = JSON.parse(content.get("package.json"));
  assert.equal(projectPackage.scripts?.["check:module-10"], "node scripts/verify-module-10.mjs", "package scripts must expose check:module-10");
  assert.equal(projectPackage.scripts?.["test:module-10"], "node --test scripts/gates-lab.test.mjs scripts/verify-module-10.test.mjs", "package scripts must expose test:module-10");
  assert.equal(projectPackage.devDependencies?.["@deftai/directive"], "0.119.1", "training package must retain exact Directive pin");
  return { artifactCount: content.size };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { artifactCount } = verifyModule10(process.argv[2]);
    console.log(`Module 10 content contract: ok (${artifactCount} artifacts, 0 missing)`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
