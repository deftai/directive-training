import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { courseModuleRow, markdownParts, moduleHeadings, section, solutionHeadings, verifyLinks } from "./verify-modules-4-5.mjs";
import { assertTeachingBaselinePin } from "./teaching-baseline.mjs";

const module11 = "curriculum/modules/11-testing-gates-and-evidence.md";
const lab11 = "labs/11-testing-gates-and-evidence.md";
const solution11 = "solutions/lab-11-testing-gates-and-evidence.md";
const historicalLineage = Object.freeze({
  scopeFilename: "2026-09-10-module-10-testing-gates-and-evidence.xbrief.json",
  parentScope: "xbrief/proposed/2026-09-05-modules-9-11-implementation-gates-and-review.xbrief.json",
  proposal: "history/changes/module-10-curriculum/proposal.xbrief.json",
  projectItemId: "2026-09-10-module-10-testing-gates-and-evidence",
  acceptanceCommands: [
    "npm run check:module-10",
    "npm run test:module-10",
    "directive verify:vbrief-conformance --project-root .",
  ],
});
const { scopeFilename, parentScope, proposal } = historicalLineage;
const lifecycleStates = [
  { path: `xbrief/active/${scopeFilename}`, status: "running", folder: "active" },
  { path: `xbrief/completed/${scopeFilename}`, status: "completed", folder: "completed" },
];
const fixtureFiles = [
  "labs/fixtures/11-testing-gates-and-evidence/PROJECT-DEFINITION.xbrief.json",
  "labs/fixtures/11-testing-gates-and-evidence/Taskfile.yml",
  "labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs",
  "labs/fixtures/11-testing-gates-and-evidence/package.json",
  "labs/fixtures/11-testing-gates-and-evidence/quality-record.json",
  "labs/fixtures/11-testing-gates-and-evidence/safety.mjs",
  "labs/fixtures/11-testing-gates-and-evidence/scripts/verify-quality-record.mjs",
  "labs/fixtures/11-testing-gates-and-evidence/src/summary.mjs",
  "labs/fixtures/11-testing-gates-and-evidence/test/summary.test.mjs",
];
const requiredFiles = [
  module11, lab11, solution11, ...fixtureFiles,
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
const outcomes = ["O11.5", "O11.6", "O11.7", "O11.8"];
const unfinished = /\{\{[^}]+\}\}|\b(?:TODO|TBD|FIXME)\b|Authoring template/i;

function exactBaseline(path, prose, heading) {
  const row = section(prose, heading).match(/^\| Directive baseline\s*\|([^\n]+)$/m)?.[1];
  assert.ok(row?.includes("0.119.5"), `${path} must declare exact Directive 0.119.5`);
  assert.deepEqual(
    [...new Set(row.match(/\b\d+\.\d+\.\d+\b/g))],
    ["0.119.5"],
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

function requireModule11Link(content, label) {
  assert.match(content, /\]\([^)]*11-testing-gates-and-evidence\.md(?:#[^)]*)?\)/, `${label} is missing Module 11 navigation`);
}

const expectedQualityRecord = Object.freeze({
  schema: "3ci.training.module11.quality-record.v1",
  status: "COMPLETE",
  evidence: Object.freeze({
    red: "EXPECTED_FAILURE",
    green: "PASS",
    refactor: "PASS",
    literalAcceptance: "PASS",
    forwardCoverage: "PASS",
    firstFailingSubcheck: "quality:record",
    repair: "quality-record.json only",
    gateDefinitionsUnchanged: true,
  }),
});
const expectedQualityRecordStarter = Object.freeze({
  status: "INCOMPLETE",
  evidence: Object.freeze({
    red: "",
    green: "",
    refactor: "",
    literalAcceptance: "",
    forwardCoverage: "",
    firstFailingSubcheck: "",
    repair: "",
    gateDefinitionsUnchanged: false,
  }),
});

function backtickCell(cell) {
  const match = cell.trim().match(/^`([^`]*)`$/);
  assert.ok(match, `Task 4 field table cell must be one backtick token: ${cell}`);
  return match[1];
}

function tableCellValue(cell) {
  const inner = backtickCell(cell);
  if (inner === '""') return "";
  if (inner === "true") return true;
  if (inner === "false") return false;
  return inner;
}

function assignQualityRecordField(record, field, value) {
  if (field === "status") {
    record.status = value;
    return;
  }
  const prefix = "evidence.";
  assert.ok(field.startsWith(prefix), `Task 4 field table has an unexpected field: ${field}`);
  record.evidence[field.slice(prefix.length)] = value;
}

function parseTask4QualityRecordTable(page) {
  const header = "| Field | Starter | Required completed value |";
  const headerIndex = page.indexOf(header);
  assert.ok(headerIndex >= 0, `${lab11} is missing the Task 4 quality-record field table header`);
  const lines = page.slice(headerIndex).split("\n");
  assert.match(lines[1] ?? "", /^\| --- \| --- \| --- \|$/, `${lab11} Task 4 field table is missing its separator row`);
  const starter = { evidence: {} };
  const completed = { evidence: {} };
  let rowCount = 0;
  for (const line of lines.slice(2)) {
    if (!line.startsWith("|")) break;
    const cells = line.split("|").slice(1, -1);
    assert.equal(cells.length, 3, `${lab11} Task 4 field table row must have three cells: ${line}`);
    const field = backtickCell(cells[0]);
    assignQualityRecordField(starter, field, tableCellValue(cells[1]));
    assignQualityRecordField(completed, field, tableCellValue(cells[2]));
    rowCount += 1;
  }
  assert.equal(rowCount, 9, `${lab11} Task 4 field table must publish nine closed field rows`);
  return { starter, completed };
}

function parseTask4QualityRecordExample(page) {
  const task4 = page.match(/### Task 4 —[\s\S]*?(?=\n## Checkpoints\n)/)?.[0] ?? "";
  assert.ok(task4, `${lab11} is missing the Task 4 stage`);
  const fence = task4.match(/```json\n([\s\S]*?)\n```/)?.[1];
  assert.ok(fence, `${lab11} is missing the Task 4 completed quality-record example`);
  return JSON.parse(fence);
}

/** Read-only Module 11 lesson, fixture, gate-integrity, evidence, and future-module verifier. */
export function verifyModule11(root = fileURLToPath(new URL("../", import.meta.url))) {
  assert.equal(typeof root, "string", "repository root must be a path string");
  const presentLifecycleStates = lifecycleStates.filter(({ path }) => {
    const absolute = resolve(root, path);
    return existsSync(absolute) && statSync(absolute).isFile();
  });
  assert.equal(presentLifecycleStates.length, 1, "Module 11 must have exactly one active or completed lifecycle scope artifact");
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
    [module11, moduleHeadings, "Module record"],
    [lab11, labHeadings, "Lab record"],
    [solution11, solutionHeadings, "Solution record"],
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

  const moduleProse = parsed.get(module11).prose;
  requireOutcomes(module11, moduleProse, ["Learning outcomes", "Completion evidence", "Self-assessment"]);
  assert.ok(moduleProse.includes("`red -> green -> refactor`"), `${module11} has an incorrect red-green-refactor order`);
  for (const phrase of [
    "npm run test:focused", "task deft:verify:ac", "directive verify:forward-coverage --project-root .",
    "task check", "first failing subcheck", "repair the work, not the gate", "gate-definition hashes",
  ]) assert.ok(moduleProse.includes(phrase), `${module11} is missing gate-integrity guidance: ${phrase}`);
  assert.match(section(moduleProse, "Navigation"), /\]\(10-implementation-golden-path\.md\)/, "Module 11 must link back to Module 10");
  assert.match(section(moduleProse, "Navigation"), /\]\(12-review-and-completion\.md\)/, "Module 11 must link forward to Module 12");

  const labProse = parsed.get(lab11).prose;
  assert.match(labProse, /unique OS-temporary repository with no remote/, `${lab11} is missing its temporary no-remote boundary`);
  assert.match(labProse, /macOS\/zsh; Linux\/bash and Windows\/PowerShell remain candidates/, `${lab11} must retain the current platform boundary`);
  for (const verb of ["create", "install", "red", "green", "refactor", "literal", "aggregate", "final", "reset", "archive"]) {
    assert.match(labProse, new RegExp(`gates-lab\\.mjs ${verb}`), `${lab11} is missing helper verb: ${verb}`);
  }
  for (const path of ["red.json", "green.json", "refactor.json", "literal.json", "aggregate-failure.json", "final.json"]) {
    assert.ok(labProse.includes(path), `${lab11} is missing evidence artifact: ${path}`);
  }
  const labPage = content.get(lab11);
  const tableRecords = parseTask4QualityRecordTable(labPage);
  assert.deepEqual(
    tableRecords.starter,
    expectedQualityRecordStarter,
    `${lab11} Task 4 field table starter column drifted`,
  );
  assert.deepEqual(
    tableRecords.completed,
    { status: expectedQualityRecord.status, evidence: { ...expectedQualityRecord.evidence } },
    `${lab11} Task 4 field table completed column drifted`,
  );
  assert.deepEqual(
    parseTask4QualityRecordExample(labPage),
    expectedQualityRecord,
    `${lab11} Task 4 completed quality-record example drifted`,
  );
  assert.ok(
    labPage.includes("The focused test and numeric-summary CLI pass for an ordinary sample and an empty sample."),
    `${lab11} must quote Lab 11 verify:ac clause 1 text`,
  );
  for (const phrase of [
    "0 verified, 1 unverifiable",
    "no artifact path bound",
    "quoted evidence, not a step to type",
    "literal.json.literalAcceptance.stdout",
    "[rung=derived]",
  ]) {
    assert.ok(labPage.includes(phrase), `${lab11} must lock the verify:ac PASS fragment: ${phrase}`);
  }

  const solutionProse = parsed.get(solution11).prose;
  requireOutcomes(solution11, solutionProse, ["Outcome map", "Acceptance evidence"]);
  for (const phrase of ["EXPECTED_FAILURE", "quality:record", "quality-record.json only", "gateDefinitionsUnchanged", "average: 4"]) {
    assert.ok(solutionProse.includes(phrase), `${solution11} is missing explained evidence: ${phrase}`);
  }
  const solutionPage = content.get(solution11);
  assert.ok(
    solutionPage.includes("The focused test and numeric-summary CLI pass for an ordinary sample and an empty sample."),
    `${solution11} must classify the Lab 11 verify:ac clause 1 fragment`,
  );
  assert.ok(solutionPage.includes("no artifact path bound"), `${solution11} must classify unverifiable as no bound artifact path`);

  const course = content.get("curriculum/README.md");
  const module11Row = courseModuleRow(course, 11);
  assert.match(module11Row, /11-testing-gates-and-evidence\.md/, "Module 11 course row must link the lesson");
  assert.doesNotMatch(module11Row, /\|\s*Planned\s*\|/i, "Module 11 must no longer be planned");
  assert.match(module11Row, /verified on macOS\/zsh; Linux and Windows candidates/i, "Module 11 course row must retain the current platform boundary");
  const module12Row = courseModuleRow(course, 12);
  assert.match(
    module12Row,
    /\[PR, review, and actual completion\]\(modules\/12-review-and-completion\.md\)/,
    "Module 12 course row must link the lesson",
  );
  assert.match(module12Row, /\|\s*Learner-ready\b/i, "Module 12 must remain learner-ready");
  for (const path of ["README.md", "curriculum/README.md", "labs/README.md", "solutions/README.md", "assessments/README.md"]) {
    requireModule11Link(content.get(path), path);
    verifyLinks(root, path, markdownParts(content.get(path)).prose);
  }
  assert.match(
    content.get("labs/README.md"),
    /^\| \[Lab 11[^\n]*\]\(11-testing-gates-and-evidence\.md\) \| Learner-ready draft;[^\n]*macOS\/zsh; Linux and Windows candidates[^\n]*\|/m,
    "labs/README.md must list Lab 11 with the current platform boundary",
  );

  for (const term of ["literal acceptance", "forward coverage", "aggregate gate", "gate integrity", "red-green-refactor"]) {
    assert.match(content.get("references/GLOSSARY.md"), new RegExp(term, "i"), `glossary is missing Module 11 term: ${term}`);
  }
  for (const phrase of ["task deft:verify:ac", "directive verify:forward-coverage --project-root .", "task check", "quality-record.json"]) {
    assert.ok(content.get("references/QUICK-REFERENCE.md").includes(phrase), `quick reference is missing Module 11 guidance: ${phrase}`);
  }
  assert.match(content.get("references/SOURCE-BASELINE.md"), /^## Module 11 testing-and-gates validation\s*$/m, "source baseline is missing Module 11 validation");
  const notes = content.get("references/SOURCE-NOTES.md");
  assert.match(notes, /^## Module 11 source validation\s*$/m, "SOURCE-NOTES is missing the Module 11 source validation record");
  const baseline = content.get("references/SOURCE-BASELINE.md");
  for (const [platform, expected] of [["macos-zsh", "verified"], ["linux-bash", "candidate"], ["windows-pwsh7", "candidate"]]) {
    assert.match(baseline, new RegExp(`teaching-platform-proof:${platform} status=${expected}`), `SOURCE-BASELINE Module 11 platform status is missing: ${platform}`);
  }
  for (const token of ["exact CLI/core/content/types 0.119.5 graph", "verify:ac"]) assert.ok(baseline.includes(token), `SOURCE-BASELINE Module 11 evidence is missing: ${token}`);

  const fixturePackage = JSON.parse(content.get("labs/fixtures/11-testing-gates-and-evidence/package.json"));
  assert.equal(fixturePackage.devDependencies?.["@deftai/directive"], "0.119.5", "Module 11 fixture must retain the exact Directive pin");
  for (const name of ["directive-core", "directive-content", "directive-types"]) {
    assert.equal(fixturePackage.overrides?.[`@deftai/${name}`], "0.119.5", `Module 11 fixture must pin ${name}`);
  }
  assert.equal(fixturePackage.scripts?.["test:focused"], "node --test test/summary.test.mjs", "Module 11 fixture must expose the focused test");
  assert.equal(fixturePackage.scripts?.["check:behavior"], "node src/summary.mjs 2 4 6", "Module 11 fixture must expose the literal behavior check");

  const helper = content.get("labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs");
  for (const invariant of [
    "realpathSync(tmpdir())", 'git(root, ["remote"])', "const allowedWorkFiles = [qualityPath, sourcePath, testPath]",
    "redTestDigest", "greenSourceDigest", "refactorSourceDigest", 'firstFailingSubcheck: "quality:record"', "gateDefinitionsUnchanged",
  ]) assert.ok(helper.includes(invariant), `Module 11 helper is missing guard invariant: ${invariant}`);

  const taskfile = content.get("labs/fixtures/11-testing-gates-and-evidence/Taskfile.yml");
  const ordered = ["- npm run test:focused", "- task: literal", "- task: forward-coverage", "- task: quality:record"].map((line) => taskfile.indexOf(line));
  assert.ok(ordered.every((index) => index >= 0) && ordered.every((index, position) => position === 0 || index > ordered[position - 1]), "Module 11 aggregate gate order is incorrect");
  assert.equal((taskfile.match(/^\s+- task: quality:record$/gm) ?? []).length, 1, "Module 11 aggregate gate order must contain one quality-record subcheck");

  const project = JSON.parse(content.get("xbrief/PROJECT-DEFINITION.xbrief.json"));
  const projectItems = project.plan.items.filter((item) => item.id === historicalLineage.projectItemId);
  assert.equal(projectItems.length, 1, "PROJECT-DEFINITION must register Module 11 exactly once");
  const projectItem = projectItems[0];
  assert.equal(projectItem.status, lifecycleState.status, "PROJECT-DEFINITION Module 11 status must match its lifecycle scope");
  assert.equal(projectItem.metadata?.lifecycle_folder, lifecycleState.folder, "PROJECT-DEFINITION Module 11 folder must match its lifecycle scope");
  assert.equal(projectItem.metadata?.source_path, `${lifecycleState.folder}/${scopeFilename}`, "PROJECT-DEFINITION Module 11 source path must match its lifecycle scope");
  const scope = JSON.parse(content.get(lifecycleState.path));
  assert.equal(scope.plan?.status, lifecycleState.status, "Module 11 scope folder and status must agree");
  assert.deepEqual(scope.plan?.acceptance?.commands, historicalLineage.acceptanceCommands, "Historical gate-module literal acceptance commands changed");
  assert.equal(JSON.parse(content.get(parentScope)).plan?.status, "proposed", "Modules 10-12 parent phase remains proposed record state");
  assert.equal(JSON.parse(content.get(proposal)).plan?.status, "approved", "Module 11 change proposal must remain approved");

  const projectPackage = JSON.parse(content.get("package.json"));
  assert.equal(projectPackage.scripts?.["check:module-11"], "node scripts/verify-module-11.mjs", "package scripts must expose check:module-11");
  assert.equal(projectPackage.scripts?.["test:module-11"], "node --test scripts/gates-lab.test.mjs scripts/verify-module-11.test.mjs", "package scripts must expose test:module-11");
  assertTeachingBaselinePin(projectPackage, content.get("README.md"));
  return { artifactCount: content.size };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { artifactCount } = verifyModule11(process.argv[2]);
    console.log(`Module 11 content contract: ok (${artifactCount} artifacts, 0 missing)`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
