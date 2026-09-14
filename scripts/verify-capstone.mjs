import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  courseModuleRow,
  markdownParts,
  section,
  verifyLinks,
} from "./verify-modules-4-5.mjs";

const curriculumPath = "curriculum/capstone-end-to-end.md";
const labPath = "labs/capstone-end-to-end.md";
const assessmentPath = "assessments/capstone-end-to-end.md";
const solutionPath = "solutions/capstone-end-to-end.md";
const module11Path = "curriculum/modules/11-review-and-completion.md";
const module11SolutionPath = "solutions/module-11-review-and-completion.md";
const parentScopePath = "xbrief/proposed/2026-09-05-disposable-end-to-end-capstone.xbrief.json";
const fixtureScopePath = "xbrief/completed/2026-09-11-capstone-guarded-disposable-fixture.xbrief.json";
const learningScopeFilename = "2026-09-11-capstone-solo-lifecycle-learning-experience.xbrief.json";
const decisionPath = "xbrief/decisions/2026-09-12-run-the-capstone-directive-proof-on-pinned-node-js-24-20-0-while.decision.json";
const fixtureHelperPath = "labs/fixtures/capstone-end-to-end/capstone-lab.mjs";
const fixtureTaskfilePath = "labs/fixtures/capstone-end-to-end/Taskfile.yml";
const fixturePackagePath = "labs/fixtures/capstone-end-to-end/package.json";
const fixtureTestPath = "labs/fixtures/capstone-end-to-end/test/work-items.test.mjs";
const workflowPath = ".github/workflows/capstone-platform-validation.yml";

const stageOrder = [
  "CREATED",
  "CHECKPOINT",
  "ORIENTED",
  "SCOPED",
  "READY",
  "RED",
  "GREEN",
  "FOCUSED",
  "LITERAL",
  "AGGREGATE_RED",
  "PREPR",
  "REVIEWED",
  "COMPLETE",
];
const helperVerbs = [
  "create",
  "guard",
  "install",
  "orient",
  "activate",
  "ready",
  "red",
  "green",
  "focused",
  "literal",
  "aggregate",
  "pre-pr",
  "review",
  "close",
  "reset",
  "archive",
];
const evidenceFiles = [
  "orientation.json",
  "scope.json",
  "readiness.json",
  "red.json",
  "green.json",
  "focused.json",
  "literal.json",
  "aggregate-failure.json",
  "pre-pr.json",
  "review-resolution.json",
  "closeout.json",
];
const approvedFileScope = [
  "CHANGELOG.md",
  "README.md",
  "assessments/README.md",
  "assessments/capstone-end-to-end.md",
  "curriculum/README.md",
  "curriculum/capstone-end-to-end.md",
  "curriculum/modules/11-review-and-completion.md",
  "labs/README.md",
  "labs/capstone-end-to-end.md",
  "maintainers/CURRICULUM-MAINTENANCE.md",
  "package.json",
  "references/GLOSSARY.md",
  "references/QUICK-REFERENCE.md",
  "references/SOURCE-BASELINE.md",
  "references/SOURCE-NOTES.md",
  "scripts/verify-capstone.mjs",
  "scripts/verify-capstone.test.mjs",
  "scripts/verify-module-7.test.mjs",
  "scripts/verify-module-8.test.mjs",
  "scripts/verify-module-9.test.mjs",
  "scripts/verify-module-10.test.mjs",
  "scripts/verify-module-11.mjs",
  "scripts/verify-module-11.test.mjs",
  "solutions/README.md",
  "solutions/capstone-end-to-end.md",
  "solutions/module-11-review-and-completion.md",
];
const verifyCommands = [
  "npm run check:capstone",
  "npm run test:capstone",
  "npm run test:portability",
  "directive verify:vbrief-conformance --project-root .",
];
const staticRequiredFiles = [
  "README.md",
  "CHANGELOG.md",
  "package.json",
  "curriculum/README.md",
  curriculumPath,
  module11Path,
  "labs/README.md",
  labPath,
  "assessments/README.md",
  assessmentPath,
  "solutions/README.md",
  solutionPath,
  module11SolutionPath,
  "maintainers/CURRICULUM-MAINTENANCE.md",
  "references/GLOSSARY.md",
  "references/QUICK-REFERENCE.md",
  "references/SOURCE-BASELINE.md",
  "references/SOURCE-NOTES.md",
  "xbrief/PROJECT-DEFINITION.xbrief.json",
  parentScopePath,
  fixtureScopePath,
  decisionPath,
  fixtureHelperPath,
  fixtureTaskfilePath,
  fixturePackagePath,
  "labs/fixtures/capstone-end-to-end/PROJECT-DEFINITION.xbrief.json",
  "labs/fixtures/capstone-end-to-end/src/cli.mjs",
  "labs/fixtures/capstone-end-to-end/src/work-items.mjs",
  fixtureTestPath,
  "labs/fixtures/capstone-end-to-end/scripts/verify-evidence.mjs",
  "labs/fixtures/capstone-end-to-end/safety.mjs",
  workflowPath,
  "scripts/capstone-lab.test.mjs",
  "scripts/verify-capstone.mjs",
  "scripts/verify-capstone.test.mjs",
];
const headingContracts = new Map([
  [curriculumPath, [
    "Capstone record",
    "Learning outcomes",
    "Starting-state check",
    "Why this matters",
    "Terminology",
    "Mental model",
    "Guided explanation",
    "Walkthrough",
    "Exercise",
    "Completion evidence",
    "Progressive hints",
    "Expected failures and recovery",
    "Common misconceptions",
    "Self-assessment",
    "Explained solution",
    "Navigation",
    "Official sources",
  ]],
  [labPath, [
    "Lab record",
    "Goal and done condition",
    "Fictional scenario",
    "Environment and starting-state check",
    "Safety boundary",
    "Starting checkpoint",
    "Tasks",
    "Checkpoints",
    "Literal acceptance commands",
    "Evidence bundle",
    "Progressive hints",
    "Expected failures and recovery",
    "Reset to start",
    "Cleanup",
    "Explained solution",
    "Done statement",
    "Navigation",
  ]],
  [assessmentPath, [
    "Assessment record",
    "Purpose",
    "Outcomes and evidence map",
    "Preserve and avoid",
    "Assessment tasks",
    "Required evidence manifest",
    "Final literal checks",
    "State cards",
    "Written reasoning prompts",
    "Self-evaluation rubric",
    "Feedback and bounded recovery",
    "Progressive hints",
    "Retry, reset, and archive",
    "Completion statement",
    "Navigation",
  ]],
  [solutionPath, [
    "Solution record",
    "Before you use this solution",
    "Result summary",
    "Outcome map",
    "Reasoning",
    "Predicted evidence",
    "Worked approach",
    "Acceptance evidence",
    "Completion-state answer",
    "Compare with your attempt",
    "Valid alternatives",
    "Expected failures and recovery",
    "Misconceptions exposed",
    "Retry plan",
    "Reset and archive",
    "Sources",
    "Continue",
  ]],
]);
const executableLanguage = /^(?:sh|shell|bash|zsh|powershell|pwsh|console)$/;
const forbiddenCommand = /\b(?:git\s+(?:push\b|remote\s+(?:add|remove|rename|set-url|prune|update)\b|reset\s+--hard\b|clean\b|checkout\s+--(?:\s|$)|branch\s+-D\b|merge\b)|gh\s+(?!--version(?:\s|$))|npm\s+publish\b|(?:directive|deft)\s+(?:deploy|publish|release)\b|rm\s+-[\w-]*r[\w-]*\b|Remove-Item\b|(?:del|rmdir)\s+\/s\b|(?:curl|wget|Invoke-WebRequest|Invoke-RestMethod)\b)/i;
const staleAvailability = /capstone (?:remains|is) planned|planned two-hour capstone|still-planned capstone|keeping the capstone planned|capstone[^\n|]*\|\s*Not yet available/i;
const escapeRegExp = (value) => value.replace(/[\^$.*+?()[\]{}|\\]/g, "\\$&");

function readRequiredFiles(root, paths) {
  const values = new Map();
  for (const path of paths) {
    const absolute = resolve(root, path);
    assert.ok(existsSync(absolute) && statSync(absolute).isFile(), "missing required artifact: " + path);
    const body = readFileSync(absolute, "utf8");
    assert.ok(body.trim(), "required artifact is empty: " + path);
    values.set(path, body);
  }
  return values;
}

function countToken(text, token) {
  return [...text.matchAll(new RegExp(escapeRegExp(token), "g"))].length;
}

function requireOrdered(text, values, label, options = {}) {
  let previous = -1;
  for (const value of values) {
    const index = text.indexOf(value);
    assert.ok(index >= 0, label + " is missing " + value);
    assert.ok(index > previous, label + " has incorrect order at " + value);
    if (options.unique) {
      assert.equal(countToken(text, value), 1, label + " must contain exactly one " + value);
    }
    previous = index;
  }
}

function requireHeadings(path, prose, headings) {
  let previous = -1;
  for (const heading of headings) {
    const pattern = new RegExp("^## " + escapeRegExp(heading) + "\\s*$", "gm");
    const matches = [...prose.matchAll(pattern)];
    assert.equal(matches.length, 1, path + " must contain exactly one heading: " + heading);
    assert.ok(matches[0].index > previous, path + " has heading out of order: " + heading);
    assert.ok(section(prose, heading).trim(), path + " has an empty section: " + heading);
    previous = matches[0].index;
  }
}

function requireOutcomes(path, prose, heading, exact = false) {
  const body = section(prose, heading);
  for (let index = 1; index <= 4; index += 1) {
    const token = "CAP." + index;
    const count = [...body.matchAll(new RegExp("\\bCAP\\." + index + "\\b", "g"))].length;
    assert.ok(count >= 1, path + " " + heading.toLowerCase() + " is missing " + token);
    if (exact) assert.equal(count, 1, path + " " + heading.toLowerCase() + " must contain exactly one " + token);
  }
}

function requireDirectLink(body, href, label) {
  assert.ok(body.includes("](" + href + ")"), label + " must link directly to " + href);
}

function assertSafeExecutableBlocks(parts, path) {
  for (const block of parts.blocks.filter(({ language }) => executableLanguage.test(language))) {
    const commands = block.content.split(/\r?\n/).filter((line) => !/^\s*#/.test(line)).join("\n");
    assert.doesNotMatch(commands, forbiddenCommand, path + " contains a forbidden executable command");
    assert.doesNotMatch(
      commands,
      /\bgit(?:\s+(?:--[\w-]+(?:=\S+)?|-[A-Za-z]\s+(?:"[^"]*"|'[^']*'|\S+)))*\s+(?:push\b|remote\s+(?:add|remove|rename|set-url|prune|update)\b|reset\s+--hard\b|clean(?:\s|$)|checkout\s+--(?:\s|$)|branch\s+-D\b|merge(?=\s|$))/i,
      path + " contains a forbidden executable command",
    );
    assert.doesNotMatch(
      commands,
      /\bnpm(?:\s+--[\w-]+(?:=\S+|\s+(?:"[^"]*"|'[^']*'|\S+))?)*\s+publish\b/i,
      path + " contains a forbidden executable command",
    );
  }
}

function assertNoLiveDependency(prose, path) {
  const clauses = prose.replace(/\r?\n(?!\r?\n)/g, " ").split(/(?:\r?\n){2,}|[.;](?:\s|$)/);
  const service = "(?:Greptile|live review(?:er| service)?|instructor (?:approval|help|unlock))";
  for (const clause of clauses) {
    if (new RegExp("\\b(?:do not|does not|no|not|never|without)\\b.{0,100}\\b" + service, "i").test(clause)) continue;
    if (new RegExp("\\b" + service + "\\b.{0,60}\\b(?:optional|not required|not needed)\\b", "i").test(clause)) continue;
    assert.doesNotMatch(
      clause,
      new RegExp("\\b(?:must|shall|required to|requires?|wait for|obtain|request|use)\\b.{0,100}\\b" + service + "\\b|\\b" + service + "\\b.{0,60}\\b(?:is|are)?\\s*required\\b", "i"),
      path + " contains a live review dependency",
    );
  }
}

function taskCommands(taskfile, taskName) {
  const lines = taskfile.split(/\r?\n/);
  const start = lines.findIndex((line) => line === "  " + taskName + ":");
  assert.notEqual(start, -1, "fixture Taskfile is missing task: " + taskName);
  const relativeEnd = lines.slice(start + 1).findIndex((line) => /^  \S.*:\s*$/.test(line));
  const end = relativeEnd === -1 ? lines.length : start + relativeEnd + 1;
  const commands = lines.slice(start + 1, end)
    .filter((line) => /^\s{6}- /.test(line))
    .map((line) => line.trim().slice(2).trim());
  assert.ok(commands.length, "fixture Taskfile task has no commands: " + taskName);
  return commands;
}

function lifecycleState(root) {
  const candidates = [
    { folder: "active", status: "running" },
    { folder: "completed", status: "completed" },
  ].map((candidate) => ({
    ...candidate,
    path: "xbrief/" + candidate.folder + "/" + learningScopeFilename,
  })).filter(({ path }) => existsSync(resolve(root, path)));
  assert.equal(candidates.length, 1, "exactly one capstone learning scope lifecycle file is required");
  return candidates[0];
}

function capstonePlatformMarkers(notes) {
  return [...notes.matchAll(/capstone-platform-proof:([a-z0-9-]+) status=(verified|candidate) date=(\d{4}-\d{2}-\d{2}) evidence=([^\s\x60]+)/g)]
    .map((match) => ({ proof: match[1], status: match[2], date: match[3], evidence: match[4] }));
}

/**
 * Verify the learner-facing capstone content contract without executing any
 * Markdown command or mutating repository state.
 * @param {string} root Curriculum repository root.
 * @returns {{artifactCount: number, lifecycle: string}}
 */
export function verifyCapstone(root = fileURLToPath(new URL("../", import.meta.url))) {
  assert.equal(typeof root, "string", "repository root must be a path string");
  const lifecycle = lifecycleState(root);
  const content = readRequiredFiles(root, [...staticRequiredFiles, lifecycle.path]);

  const parsed = new Map();
  for (const [path, headings] of headingContracts) {
    const body = content.get(path);
    assert.doesNotMatch(body, /\{\{[^}]+\}\}|\b(?:TODO|TBD|FIXME)\b|Authoring template/i, path + " contains an unfinished author marker");
    const parts = markdownParts(body);
    parsed.set(path, parts);
    requireHeadings(path, parts.prose, headings);
    assert.doesNotMatch(parts.prose, /\b(?:Directive behavior|3Ci policy|Course guidance)\b/i, path + " contains a removed claim label");
    assertSafeExecutableBlocks(parts, path);
    assertNoLiveDependency(parts.prose, path);
    verifyLinks(root, path, parts.prose);
  }

  requireOutcomes(curriculumPath, parsed.get(curriculumPath).prose, "Learning outcomes");
  requireOutcomes(curriculumPath, parsed.get(curriculumPath).prose, "Completion evidence");
  requireOutcomes(curriculumPath, parsed.get(curriculumPath).prose, "Self-assessment");
  requireOutcomes(assessmentPath, parsed.get(assessmentPath).prose, "Outcomes and evidence map", true);
  requireOutcomes(solutionPath, parsed.get(solutionPath).prose, "Outcome map", true);
  for (const [path, heading] of [
    [assessmentPath, "Outcomes and evidence map"],
    [solutionPath, "Outcome map"],
  ]) {
    const outcomeMap = section(parsed.get(path).prose, heading);
    const cap1 = outcomeMap.split(/\r?\n/).find((line) => line.startsWith("| `CAP.1`"));
    const cap2 = outcomeMap.split(/\r?\n/).find((line) => line.startsWith("| `CAP.2`"));
    assert.ok(cap1 && cap2, path + " is missing CAP.1 or CAP.2 outcome rows");
    assert.doesNotMatch(cap1, /red\.json/, path + " must assign red.json to CAP.2, not CAP.1");
    assert.match(cap2, /red\.json/, path + " must assign red.json to CAP.2");
  }
  for (let index = 1; index <= 4; index += 1) {
    assert.match(
      parsed.get(assessmentPath).prose,
      new RegExp("^### Task " + index + "[^\\n]*CAP\\." + index, "m"),
      assessmentPath + " is missing the CAP." + index + " assessment task",
    );
  }
  const assessmentTasks = section(parsed.get(assessmentPath).prose, "Assessment tasks");
  const cap1Task = assessmentTasks.match(/### Task 1[^\n]*[\s\S]*?(?=### Task 2)/)?.[0] ?? "";
  const cap2Task = assessmentTasks.match(/### Task 2[^\n]*[\s\S]*?(?=### Task 3)/)?.[0] ?? "";
  assert.match(cap1Task, /install[\s\S]*orient[\s\S]*activate[\s\S]*ready/i, "CAP.1 assessment task must end at readiness");
  assert.doesNotMatch(cap1Task, /red\.json|\brun\s+`red`/i, "CAP.1 assessment task must not absorb CAP.2 red evidence");
  assert.match(cap2Task, /run `red`[\s\S]*red\.json/, "CAP.2 assessment task must begin with retained red evidence");

  const progressiveHints = section(parsed.get(assessmentPath).prose, "Progressive hints");
  const cap1Hints = progressiveHints.match(/<summary>CAP\.1[^\n]*[\s\S]*?(?=<summary>CAP\.2)/)?.[0] ?? "";
  const cap2Hints = progressiveHints.match(/<summary>CAP\.2[^\n]*[\s\S]*?(?=<summary>CAP\.3)/)?.[0] ?? "";
  assert.match(cap1Hints, /orient -> activate -> ready/, "CAP.1 hints must end at readiness");
  assert.doesNotMatch(cap1Hints, /red\.json|-> red|meaningful red/i, "CAP.1 hints must not absorb CAP.2 red evidence");
  assert.match(cap2Hints, /red\.json/, "CAP.2 hints must include red.json");
  const labSafety = section(parsed.get(labPath).prose, "Safety boundary");
  assert.match(labSafety, /reset`? only while identity[\s\S]{0,120}new[\s\S]{0,40}safe launcher/i, "lab must use identity-sensitive reset recovery");

  const helper = content.get(fixtureHelperPath);
  const helperStageBlock = helper.match(/const stageOrder = \[([\s\S]*?)\];/)?.[1];
  assert.ok(helperStageBlock, "fixture helper stage contract is missing");
  const helperStages = [...helperStageBlock.matchAll(/"([A-Z_]+)"/g)].map((match) => match[1]);
  assert.deepEqual(helperStages, stageOrder, "fixture helper stage order changed");
  const mainBlock = helper.match(/export function main\([\s\S]*?throw new Error/)?.[0] ?? "";
  const actualVerbs = [...mainBlock.matchAll(/verb === "([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(actualVerbs, helperVerbs, "fixture helper verb order changed");
  const helperEvidence = [...helper.matchAll(/writeEvidence\(root, "([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(helperEvidence, evidenceFiles, "fixture helper evidence order changed");

  const checkpointSection = section(parsed.get(labPath).prose, "Checkpoints");
  const documentedStages = [...checkpointSection.matchAll(/^\| \x60(?:create|install|orient|activate|ready|red|green|focused|literal|aggregate|pre-pr|review|close)\x60 \| \x60([A-Z_]+)\x60 \|/gm)]
    .map((match) => match[1]);
  assert.deepEqual(documentedStages, stageOrder, "capstone lab stage order is incomplete or reordered");
  for (const verb of helperVerbs) {
    assert.match(content.get(labPath), new RegExp("\\b" + escapeRegExp(verb) + "\\b"), "capstone lab is missing helper verb: " + verb);
  }

  const evidenceBundle = section(parsed.get(labPath).prose, "Evidence bundle");
  requireOrdered(evidenceBundle, evidenceFiles, "capstone lab evidence bundle", { unique: true });
  assert.match(checkpointSection, /CREATED[\s\S]*lab-state\.json/, "CREATED must use lab-state.json evidence");
  assert.match(checkpointSection, /CHECKPOINT[\s\S]*no separate install JSON/, "CHECKPOINT must not invent install JSON evidence");
  assert.match(evidenceBundle, /Reset\s+and\s+archive\s+do\s+not\s+emit\s+JSON/, "reset and archive must use a private disposition note");

  const taskfile = content.get(fixtureTaskfilePath);
  assert.deepEqual(
    taskCommands(taskfile, "check"),
    ["npm run test:focused", "task: literal", "task: forward-coverage", "task: review:evidence"],
    "fixture aggregate gate order changed",
  );
  const fixtureStorySource = helper.match(/acceptance:\s*\{[\s\S]*?commands:\s*\[([^\]]+)\]/)?.[1] ?? "";
  assert.deepEqual(
    [...fixtureStorySource.matchAll(/"([^"]+)"/g)].map((match) => match[1]),
    ["npm run test:focused", "npm run check:behavior"],
    "fixture literal acceptance commands changed",
  );
  for (const command of ["npm run test:focused", "npm run check:behavior"]) {
    assert.ok(section(parsed.get(labPath).prose, "Literal acceptance commands").includes(command), "lab literal acceptance is missing " + command);
  }

  const combinedCore = [content.get(curriculumPath), content.get(labPath), content.get(assessmentPath), content.get(solutionPath)].join("\n");
  for (const token of [
    "EXPECTED_FAILURE",
    "review:evidence",
    "FINDING_RECORDED",
    "CAP-P1-001",
    "diffUnchanged",
    "findingsResolved",
    "currentHeadReview",
    "CLEAN",
    "implemented",
    "local_pass",
    "not_started",
    "n/a-no-remote-claim",
    "xbrief/active/fictional-work-items.xbrief.json",
  ]) assert.ok(combinedCore.includes(token), "capstone evidence contract is missing " + token);
  assert.match(combinedCore, /red[\s\S]{0,500}helper exits? \x600\x60[\s\S]{0,200}nested focused[\s\S]{0,80}exit \x601\x60/i, "red wrapper and nested exit semantics are missing");
  assert.match(combinedCore, /aggregate[\s\S]{0,500}helper exits? \x600\x60[\s\S]{0,300}nested aggregate[\s\S]{0,100}nonzero/i, "aggregate wrapper and nested exit semantics are missing");
  assert.match(combinedCore, /currentHeadReview[\s\S]{0,300}(?:working-tree|current-product)[\s\S]{0,300}before\s+the\s+final\s+commit/i, "current-product review timing is missing");
  assert.match(combinedCore, /COMPLETE[\s\S]{0,300}(?:not Directive lifecycle completion|xBRIEF remains active\/running)/i, "helper completion must remain distinct from lifecycle completion");

  const assessment = content.get(assessmentPath);
  for (const result of ["Demonstrated", "Nearly demonstrated", "Not yet demonstrated", "Blocked by environment"]) {
    assert.ok(assessment.includes(result), "assessment rubric is missing " + result);
  }
  assert.match(assessment, /assessment is complete only when[\s\S]{0,160}each \*\*Demonstrated\*\*/i, "assessment is missing the every-outcome completion rule");
  assert.match(assessment, /non-compensating[\s\S]{0,400}no\s+numeric average is used/i, "assessment is missing the non-compensating rubric");
  assert.match(assessment, /reading[\s\S]{0,80}solution[\s\S]{0,80}(?:is not|cannot)\s+(?:completion )?evidence/i, "assessment must state that solution reading is not evidence");
  for (const state of ["implemented", "PR-open", "merge-ready", "delivered", "deployed", "UAT-verified"]) {
    assert.match(assessment, new RegExp(escapeRegExp(state), "i"), "assessment is missing completion state: " + state);
  }
  for (const evidence of evidenceFiles) {
    assert.ok(assessment.includes(evidence), "assessment evidence manifest is missing " + evidence);
  }
  const stateCards = section(parsed.get(assessmentPath).prose, "State cards");
  for (let index = 1; index <= 8; index += 1) {
    const cardRows = [...stateCards.matchAll(new RegExp("^\\|\\s*S" + index + "\\s*\\|", "gm"))];
    assert.equal(cardRows.length, 1, "assessment must contain exactly one state card S" + index);
  }

  const solution = content.get(solutionPath);
  for (const symbol of ["validateItems", "addWorkItem", "completeWorkItem", "summarizeWorkItems", "WI-", "reduce(", "...items", "toLocaleLowerCase", "CAP-P1-001"]) {
    assert.ok(solution.includes(symbol), "solution is missing worked implementation detail: " + symbol);
  }
  assert.ok(solution.includes('throw new RangeError("title duplicates an existing work item");'), "solution is missing the worked duplicate-title solution");
  assert.equal(countToken(solution, "export function addWorkItem"), 2, "solution must show both green and reviewed addWorkItem implementations");
  const greenWorked = solution.match(/### 3\. Write the intentionally incomplete green implementation([\s\S]*?)### 4\./)?.[1] ?? "";
  assert.ok(greenWorked, "solution is missing the green implementation stage");
  assert.doesNotMatch(greenWorked, /title duplicates an existing work item/, "green implementation must preserve the seeded review finding");
  const reviewedWorked = solution.match(/### 6\. Make the reviewed source-only repair([\s\S]*?)### 7\./)?.[1] ?? "";
  assert.match(reviewedWorked, /title duplicates an existing work item/, "reviewed implementation must reject normalized duplicates");
  for (const heading of ["Valid alternatives", "Expected failures and recovery", "Misconceptions exposed", "Retry plan", "Reset and archive"]) {
    assert.ok(section(parsed.get(solutionPath).prose, heading).trim(), "solution is missing required recovery section: " + heading);
  }
  assert.match(solution, /work\.status = implemented[\s\S]*ship\.status = not_started[\s\S]*gate\.status = local_pass[\s\S]*deployment\.status = not_started[\s\S]*uat\.status = not_started/, "solution closeout state contract is incorrect");

  assert.ok(assessment.includes("reset creates a distinct root"), "assessment is missing the fresh reset contract");
  assert.match(combinedCore, /reset[\s\S]{0,220}(?:new|fresh|different|distinct)[\s\S]{0,140}(?:CREATED|uninstalled)/i, "capstone is missing the fresh reset contract");
  assert.match(combinedCore, /reset[\s\S]{0,250}preserv(?:e|es|ing)[\s\S]{0,100}(?:old|completed|earlier)[\s\S]{0,80}(?:repository|attempt|evidence)/i, "capstone reset must preserve prior evidence");
  assert.ok(solution.includes("Archive is a recoverable move; it is not deletion."), "solution is missing the recoverable archive contract");
  assert.match(content.get(labPath), /archive the completed and reset roots separately/i, "lab must archive both explicitly named roots");
  assert.match(solution, /archive[\s\S]{0,80}leaves both launcher directories in place and empty/i, "solution is missing the launcher cleanup disposition");
  const labEnvironment = section(content.get(labPath), "Environment and starting-state check");
  for (const [pattern, label] of [
    [/export CAPSTONE_NOTES_DIR="\$\(mktemp -d /, "CAPSTONE_NOTES_DIR"],
    [/export CAPSTONE_ASSESSMENT_NOTE="\$CAPSTONE_NOTES_DIR\/capstone-assessment-note\.md"/, "CAPSTONE_ASSESSMENT_NOTE"],
    [/\$CapstoneNotesDir = Join-Path \(\[IO\.Path\]::GetTempPath\(\)\)/, "$CapstoneNotesDir"],
    [/\$CapstoneAssessmentNote = Join-Path \$CapstoneNotesDir "capstone-assessment-note\.md"/, "$CapstoneAssessmentNote"],
  ]) {
    assert.match(labEnvironment, pattern, "lab must establish the private note path: " + label);
  }
  assert.match(
    labEnvironment,
    /\[string\]::IsNullOrWhiteSpace\(\$env:DIRECTIVE_TRAINING_ROOT\)/,
    "capstone Windows start must reject a missing DIRECTIVE_TRAINING_ROOT",
  );
  assert.match(
    labEnvironment,
    /\$CourseRoot\s*=\s*\[IO\.Path\]::GetFullPath\(\$env:DIRECTIVE_TRAINING_ROOT\)/,
    "capstone Windows start must resolve DIRECTIVE_TRAINING_ROOT",
  );
  assert.doesNotMatch(
    labEnvironment,
    /C:\\absolute\\path\\to\\directive-training/i,
    "capstone Windows start must not contain a fake absolute clone path",
  );
  for (const path of [labPath, assessmentPath, solutionPath]) {
    const body = content.get(path);
    assert.match(body, /lab-state\.json\.launcherRoot/, path + " must record both launcher roots");
    assert.match(body, /both\s+(?:the\s+)?(?:original\s+and\s+reset\s+)?launcher\s+directories/i, path + " must account for both launcher directories");
    assert.ok(body.includes("capstone-assessment-note.md") || body.includes("CAPSTONE_ASSESSMENT_NOTE"), path + " must name the learner-authored assessment note");
    assert.match(body, /(?:dedicated|separate)[\s\S]{0,100}(?:OS-temporary\s+)?notes directory/i, path + " must use a separate private notes directory");
    assert.match(body, /outside[\s\S]{0,180}both[\s\S]{0,100}launcher directories/i, path + " must keep the note outside both launcher directories");
    assert.doesNotMatch(body, /in the original `CAPSTONE_LAUNCHER`/i, path + " must not retain the note in a launcher directory");
    assert.match(body, /notes directory locally only until assessment or approved[\s\S]{0,100}normal OS[\s-]*cleanup|approved private evidence-retention policy/i, path + " must state the private notes-directory disposition");
  }
  assert.match(assessment, /Evidence-chain checks[\s\S]{0,600}generatedAt[\s\S]{0,500}productCheckpoint/, "assessment is missing evidence-chain correlation checks");
  assert.match(assessment, /runtime observation[\s\S]{0,250}Node\.js 22 or newer[\s\S]{0,250}OS and shell[\s\S]{0,180}Task[\s\S]{0,80}uv/i, "assessment is missing retained runtime identity evidence");
  assert.match(
    content.get(labPath),
    /Number\(process\.versions\.node\.split\("\."\)\[0\]\)[\s\S]{0,120}major < 22/,
    "capstone lab must enforce the Node.js 22+ capability boundary",
  );
  assert.match(assessment, /classification timing is learner-authored and self-attested[\s\S]{0,180}helper[\s\S]{0,180}finding existed/i, "assessment must distinguish learner-attested classification timing from helper evidence");
  assert.match(combinedCore, /private[\s\S]{0,80}capstone-assessment-note\.md/i, "capstone is missing the reset/archive disposition note");

  const packageJson = JSON.parse(content.get("package.json"));
  assert.equal(packageJson.devDependencies?.["@deftai/directive"], "0.112.0", "training package must retain the exact Directive pin");
  assert.equal(packageJson.scripts?.["check:capstone"], "node scripts/verify-capstone.mjs", "package scripts must expose check:capstone");
  assert.equal(
    packageJson.scripts?.["test:capstone"],
    "node --test scripts/capstone-lab.test.mjs scripts/verify-capstone.test.mjs && node --check labs/fixtures/capstone-end-to-end/capstone-lab.mjs && git diff --check",
    "package scripts must expose the complete test:capstone contract",
  );
  assert.equal(packageJson.scripts?.["test:modules-4-5"], "node --test scripts/projection-lab.test.mjs scripts/projection-lab-eol.test.mjs scripts/windows-shim.test.mjs scripts/verify-modules-4-5.test.mjs", "test:modules-4-5 changed");
  assert.equal(packageJson.scripts?.["test:portability"], "node --test scripts/verify-symlink-capability.test.mjs scripts/linked-path-suite-boundary.test.mjs scripts/projection-lab-eol.test.mjs scripts/windows-shim.test.mjs scripts/verify-text-portability.test.mjs scripts/restore-validation-deposit.test.mjs", "test:portability changed");
  assert.equal(packageJson.scripts?.["test:linked-path-safety"], "node scripts/verify-symlink-capability.mjs && node --test scripts/linked-path-safety.test.mjs", "test:linked-path-safety changed");

  const fixturePackage = JSON.parse(content.get(fixturePackagePath));
  assert.equal(fixturePackage.devDependencies?.["@deftai/directive"], "0.112.0", "fixture package must retain the exact Directive pin");
  for (const dependency of ["directive-core", "directive-content", "directive-types"]) {
    assert.equal(fixturePackage.overrides?.["@deftai/" + dependency], "0.112.0", "fixture package must retain exact " + dependency + " override");
  }
  for (const path of [curriculumPath, labPath, assessmentPath, solutionPath]) {
    const body = content.get(path);
    assert.match(body, /Node\.js[\s\x60]*22 or newer/i, path + " must state the Node.js 22+ Directive runtime");
    assert.doesNotMatch(body, /(?:requires?|requirement|must use|reports?)\b[^\n]{0,100}(?:exactly\s+)?`?v?24\.20\.0`?/i, path + " must not require one Node.js patch release");
    assert.match(body, /Node\.js 20-compatible/, path + " must preserve Node.js 20-compatible application scope");
    assert.match(body, /Node\.js 20-compatible[\s\S]{0,180}source-level design constraint[\s\S]{0,180}(?:not|no)[\s\S]{0,100}(?:execution|run|runtime)/i, path + " must label Node.js 20 compatibility as an unexecuted source constraint");
  }
  const frozenFixtureTest = content.get(fixtureTestPath);
  assert.match(
    frozenFixtureTest,
    /assert\.throws\(\(\) => addWorkItem\(\[\], " {3}"\), \/nonempty\//,
    "capstone blank-title test must accept the fixture's nonempty-title phrasing",
  );
  assert.doesNotMatch(frozenFixtureTest, /\/nonempty title\//, "capstone blank-title test must not require reversed word order");
  const decision = JSON.parse(content.get(decisionPath));
  assert.equal(
    decision.decision,
    "Run the capstone Directive proof on pinned Node.js 24.20.0 while keeping the fictional application Node.js 20-compatible",
    "capstone runtime decision changed",
  );

  const workflow = content.get(workflowPath);
  for (const [proof, operatingSystem] of [
    ["macos-node24", "macos-15"],
    ["linux-node24", "ubuntu-24.04"],
    ["windows-node24", "windows-2022"],
  ]) {
    assert.match(workflow, new RegExp("- proof: " + proof + "\\s+os: " + escapeRegExp(operatingSystem)), "workflow is missing platform pair " + proof);
  }
  const workflowProofs = [...workflow.matchAll(/^\s*- proof: ([a-z0-9-]+)\s+os: ([^\s]+)/gm)]
    .map((match) => ({ proof: match[1], os: match[2] }));
  assert.deepEqual(workflowProofs, [
    { proof: "macos-node24", os: "macos-15" },
    { proof: "linux-node24", os: "ubuntu-24.04" },
    { proof: "windows-node24", os: "windows-2022" },
  ], "workflow platform matrix must contain exactly the three verified pairs");
  for (const token of [
    "contents: read",
    "persist-credentials: false",
    'node-version: "24.20.0"',
    'version: "0.11.10"',
    'python-version: "3.13.13"',
    'version: "3.50.0"',
    "run: node --test scripts/capstone-lab.test.mjs",
  ]) assert.ok(workflow.includes(token), "capstone platform workflow is missing " + token);
  assert.doesNotMatch(workflow, /contents:\s*write|persist-credentials:\s*true/, "capstone platform workflow grants unsafe repository credentials");
  assert.deepEqual(
    [...workflow.matchAll(/^\s+run:\s*(.+)$/gm)].map((match) => match[1].trim()),
    ["node --test scripts/capstone-lab.test.mjs"],
    "capstone platform workflow must run only the fixture suite",
  );

  const notes = content.get("references/SOURCE-NOTES.md");
  const markers = capstonePlatformMarkers(notes);
  assert.equal(countToken(notes, "capstone-platform-proof:"), 3, "SOURCE-NOTES contains a malformed or extra capstone platform proof marker");
  assert.deepEqual(
    markers,
    [
      { proof: "macos-node24", status: "verified", date: "2026-09-12", evidence: "gha-run-34676736925-job-103507813471" },
      { proof: "linux-node24", status: "verified", date: "2026-09-12", evidence: "gha-run-34676736925-job-103507813395" },
      { proof: "windows-node24", status: "verified", date: "2026-09-12", evidence: "gha-run-34676736925-job-103507813491" },
    ],
    "SOURCE-NOTES platform proof marker set is incorrect",
  );
  assert.ok(markers.every(({ evidence }) => !/^(?:none|not-run|pending|unknown)$/.test(evidence)), "verified capstone platform proof must cite evidence");
  for (const token of [
    "8/8",
    "4f8ca7e36723e094ed1a19aa9593f01c0b798cdf",
    "1ad4c23f03498af745eec972e7c3f5a63b97d4b4",
  ]) assert.ok(notes.includes(token), "SOURCE-NOTES fixture provenance is missing " + token);
  const baseline = content.get("references/SOURCE-BASELINE.md");
  assert.match(baseline, /^## Capstone end-to-end validation\s*$/m, "SOURCE-BASELINE is missing capstone validation");
  assert.match(notes, /^## Capstone source validation\s*$/m, "SOURCE-NOTES is missing capstone source validation");
  const baselineCapstone = section(markdownParts(baseline).prose, "Capstone end-to-end validation");
  const notesCapstone = section(markdownParts(notes).prose, "Capstone source validation");
  for (const source of [baselineCapstone, notesCapstone]) {
    assert.match(source, /0\.112\.0/, "capstone source record is missing learner pin");
    assert.match(source, /Node\.js\s+20-compatible/, "capstone source record is missing application compatibility");
  }
  assert.match(baselineCapstone, /Node\.js 22 or newer/i, "learner baseline must state the capability-based runtime");
  assert.match(notesCapstone, /24\.20\.0/, "maintainer source notes must retain the tested runtime");
  assert.doesNotMatch(
    baseline,
    /(?:0\.113\.0|0\.114\.0|0\.116\.0|0\.117\.0)/,
    "learner-facing SOURCE-BASELINE must not include authoring-runtime versions",
  );

  const currentAvailabilityPaths = [
    "README.md",
    "curriculum/README.md",
    module11Path,
    module11SolutionPath,
    "labs/README.md",
    "assessments/README.md",
    "solutions/README.md",
    "maintainers/CURRICULUM-MAINTENANCE.md",
    "references/SOURCE-NOTES.md",
  ];
  for (const path of currentAvailabilityPaths) {
    assert.doesNotMatch(content.get(path), staleAvailability, path + " contains stale capstone availability");
  }
  const unreleased = section(markdownParts(content.get("CHANGELOG.md")).prose, "[Unreleased]");
  assert.doesNotMatch(unreleased, staleAvailability, "CHANGELOG Unreleased contains stale capstone availability");

  const course = content.get("curriculum/README.md");
  for (let moduleNumber = 1; moduleNumber <= 11; moduleNumber += 1) {
    const row = courseModuleRow(course, moduleNumber);
    assert.match(row, /\|\s*Learner-ready\b/i, "Module " + moduleNumber + " course row must remain learner-ready");
    assert.doesNotMatch(row, /\b(?:planned|not yet available)\b/i, "Module " + moduleNumber + " course row is not implemented");
  }

  const navigationLinks = [
    ["README.md", "curriculum/capstone-end-to-end.md", "repository start"],
    ["curriculum/README.md", "capstone-end-to-end.md", "course map"],
    [module11Path, "../capstone-end-to-end.md", "Module 11"],
    [module11SolutionPath, "../curriculum/capstone-end-to-end.md", "Module 11 solution"],
    ["labs/README.md", "capstone-end-to-end.md", "lab index"],
    ["assessments/README.md", "capstone-end-to-end.md", "assessment index"],
    ["solutions/README.md", "capstone-end-to-end.md", "solution index"],
    ["maintainers/CURRICULUM-MAINTENANCE.md", "../curriculum/capstone-end-to-end.md", "maintenance guide"],
    ["references/GLOSSARY.md", "../curriculum/capstone-end-to-end.md", "glossary"],
    ["references/QUICK-REFERENCE.md", "../curriculum/capstone-end-to-end.md", "quick reference"],
    ["references/SOURCE-BASELINE.md", "../curriculum/capstone-end-to-end.md", "source baseline"],
    ["references/SOURCE-NOTES.md", "../curriculum/capstone-end-to-end.md", "source notes"],
    ["CHANGELOG.md", "curriculum/capstone-end-to-end.md", "changelog"],
  ];
  for (const [path, href, label] of navigationLinks) requireDirectLink(content.get(path), href, label);
  for (const [path, links] of [
    [curriculumPath, ["../labs/capstone-end-to-end.md", "../assessments/capstone-end-to-end.md", "../solutions/capstone-end-to-end.md", "modules/11-review-and-completion.md"]],
    [labPath, ["../curriculum/capstone-end-to-end.md", "../assessments/capstone-end-to-end.md", "../solutions/capstone-end-to-end.md"]],
    [assessmentPath, ["../curriculum/capstone-end-to-end.md", "../labs/capstone-end-to-end.md", "../solutions/capstone-end-to-end.md"]],
    [solutionPath, ["../curriculum/capstone-end-to-end.md", "../labs/capstone-end-to-end.md", "../assessments/capstone-end-to-end.md"]],
  ]) {
    for (const href of links) requireDirectLink(content.get(path), href, path);
  }
  for (const path of [
    "README.md",
    "curriculum/README.md",
    module11Path,
    module11SolutionPath,
    "labs/README.md",
    "assessments/README.md",
    "solutions/README.md",
    "maintainers/CURRICULUM-MAINTENANCE.md",
  ]) verifyLinks(root, path, markdownParts(content.get(path)).prose);

  const scope = JSON.parse(content.get(lifecycle.path));
  assert.equal(scope.plan?.id, "training.capstone.learning-experience", "capstone learning scope id changed");
  assert.equal(scope.plan?.status, lifecycle.status, "capstone learning scope folder and status disagree");
  assert.deepEqual(scope.plan?.metadata?.swarm?.file_scope, approvedFileScope, "capstone approved file scope changed");
  assert.deepEqual(scope.plan?.metadata?.swarm?.verify_commands, verifyCommands, "capstone focused verification commands changed");
  if (lifecycle.folder === "completed") {
    assert.ok(scope.plan.items.every(({ status }) => status === "completed"), "completed capstone scope items must be completed");
  }

  const parent = JSON.parse(content.get(parentScopePath));
  assert.equal(parent.plan?.id, "training.capstone", "parent capstone scope id changed");
  assert.equal(parent.plan?.status, "proposed", "parent capstone scope must remain proposed");
  assert.match(parent.plan?.narratives?.QualityGate ?? "", /aggregate merge chokepoint[\s\S]*literal acceptance/i, "parent capstone must keep literal acceptance separate from the aggregate gate");
  assert.deepEqual(parent.plan?.acceptance?.commands, ["directive verify:vbrief-conformance --project-root ."], "parent literal acceptance command changed");
  const learningReferences = parent.plan.references.filter(({ uri }) => uri.endsWith(learningScopeFilename));
  assert.equal(learningReferences.length, 1, "parent must reference the capstone learning scope exactly once");
  assert.equal(learningReferences[0].uri, lifecycle.folder + "/" + learningScopeFilename, "parent capstone learning reference disagrees with lifecycle state");
  const fixtureScope = JSON.parse(content.get(fixtureScopePath));
  assert.equal(fixtureScope.plan?.id, "training.capstone.fixture-runtime", "completed fixture scope id changed");
  assert.equal(fixtureScope.plan?.status, "completed", "capstone fixture scope must remain completed");
  assert.equal(parent.plan.references.filter(({ uri }) => uri === "completed/2026-09-11-capstone-guarded-disposable-fixture.xbrief.json").length, 1, "parent must retain exactly one completed fixture reference");

  return { artifactCount: content.size, lifecycle: lifecycle.folder };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = verifyCapstone(process.argv[2]);
    console.log("Capstone content contract: ok (" + result.artifactCount + " artifacts, 0 missing)");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
