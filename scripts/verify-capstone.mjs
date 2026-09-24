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
import { assertTeachingBaselinePin } from "./teaching-baseline.mjs";

const curriculumPath = "curriculum/capstone-end-to-end.md";
const labPath = "labs/capstone-end-to-end.md";
const assessmentPath = "assessments/capstone-end-to-end.md";
const solutionPath = "solutions/capstone-end-to-end.md";
const module12Path = "curriculum/modules/12-review-and-completion.md";
const module12SolutionPath = "solutions/module-12-review-and-completion.md";
const parentScopePath = "xbrief/proposed/2026-09-05-disposable-end-to-end-capstone.xbrief.json";
const fixtureScopePath = "xbrief/completed/2026-09-11-capstone-guarded-disposable-fixture.xbrief.json";
const learningScopeFilename = "2026-09-11-capstone-solo-lifecycle-learning-experience.xbrief.json";
const decisionPath = "xbrief/decisions/2026-09-12-run-the-capstone-directive-proof-on-pinned-node-js-24-20-0-while.decision.json";
const fixtureHelperPath = "labs/fixtures/capstone-end-to-end/capstone-lab.mjs";
const fixtureTaskfilePath = "labs/fixtures/capstone-end-to-end/Taskfile.yml";
const fixturePackagePath = "labs/fixtures/capstone-end-to-end/package.json";
const fixtureTestPath = "labs/fixtures/capstone-end-to-end/test/work-items.test.mjs";
const workflowPath = ".github/workflows/capstone-platform-validation.yml";
const rehearsalPath = "scripts/capstone-lab.test.mjs";

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
// Immutable provenance from the protected capstone learning scope. Numbered
// paths in this list describe that historical approval, not the current course.
const historicalLineage = Object.freeze({
  approvedFileScope: [
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
  ],
});
const verifyCommands = [
  "npm run check:capstone",
  "npm run test:capstone",
  "npm run test:portability",
  "directive verify:vbrief-conformance --project-root .",
];
const capstoneCheckpointHeader = "| Card ID | Controlling fact | Route decision | Target revision | Bind readiness | Safe next action | Authority boundary |";
const designCritiqueChipCatalog = new Set([
  "design-critique:mechanism-shaped",
  "design-critique:in-progress",
  "design-critique:ingest-ready",
]);
const staticRequiredFiles = [
  "README.md",
  "CHANGELOG.md",
  "package.json",
  "curriculum/README.md",
  curriculumPath,
  module12Path,
  "labs/README.md",
  labPath,
  "assessments/README.md",
  assessmentPath,
  "solutions/README.md",
  solutionPath,
  module12SolutionPath,
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
  rehearsalPath,
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
// Pinned bounded-namespace contract for the capstone work-item identifier (#36).
const identifierBoundMessage = "next work-item id would exceed WI-999";
const identifierBoundThrow = 'throw new RangeError("' + identifierBoundMessage + '");';
// The guard is pinned as condition-plus-throw, so an ineffective condition
// (`if (false)`) around the right throw statement still fails the contract.
const identifierBoundGuard = /if \(highest >= 999\)\s*\{?\s*throw new RangeError\("next work-item id would exceed WI-999"\);/;
// Labs 2/5 first-statement pin: condition plus throw, so Write-Host still fails.
const windowsPowerShellVersionGuard =
  "if ($PSVersionTable.PSVersion -lt [version]'7.4') { throw 'PowerShell 7.4 or newer is required' }";

function readRequiredFiles(root, paths) {
  const values = new Map();
  for (const path of paths) {
    const absolute = resolve(root, path);
    assert.ok(existsSync(absolute) && statSync(absolute).isFile(), "missing required artifact: " + path);
    const body = readFileSync(absolute, "utf8").replace(/\r\n?/g, "\n");
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

function capstoneCheckpointRow(body, path) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const headers = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line === capstoneCheckpointHeader);
  assert.equal(headers.length, 1, path + " must contain the exact CAP.1 checkpoint header once");
  const headerIndex = headers[0].index;
  assert.match(lines[headerIndex + 1] ?? "", /^\|(?:\s*---\s*\|){7}$/, path + " checkpoint table is missing its seven-column divider");
  const row = lines.slice(headerIndex + 2, headerIndex + 5)
    .find((line) => /^\|\s*`?CAP-DC-01`?\s*\|/.test(line));
  assert.ok(row, path + " checkpoint table is missing the CAP-DC-01 row");
  const cells = row.slice(1, -1).split("|").map((cell) => cell.trim());
  assert.equal(cells.length, 7, path + " CAP-DC-01 row must have seven cells");
  assert.equal(cells[0].replaceAll("`", ""), "CAP-DC-01", path + " checkpoint card ID changed");
  assert.match(cells[1], /mechanism-shaped/i, path + " checkpoint must cite the mechanism-shaped controlling fact");
  assert.match(cells[1], /audit:cap-trust-boundary/, path + " checkpoint must cite the unresolved parent audit");
  assert.match(cells[1], /ingest-ready catalog chip/i, path + " checkpoint must preserve the ingest-ready catalog chip as supplied state");
  assert.match(cells[1], /no admitted completed-arc record/i, path + " checkpoint must cite the missing completed-arc record");
  assert.equal(cells[2].replaceAll("`", "").toLowerCase(), "route", path + " checkpoint route decision must be route");
  assert.equal(cells[3].replaceAll("`", ""), "CAP-DC-R1", path + " checkpoint target revision changed");
  assert.equal(cells[4].replaceAll("`", "").toLowerCase(), "not bind-ready", path + " checkpoint must remain not bind-ready");
  assert.match(cells[5], /independent audit[^|]*audit:cap-trust-boundary/i, path + " checkpoint safe action must require the named independent audit");
  assert.match(cells[5], /missing admitted completed-arc record/i, path + " checkpoint safe action must require the missing completed-arc record");
  assert.match(cells[6], /(?:chip|synthesis)[^|]*(?:neither|does not|do not|not)[^|]*activation[^|]*implementation/i, path + " checkpoint must deny activation and implementation authority to chip/synthesis state");
  return cells;
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

function teachingPlatformMarkers(baseline) {
  return [...baseline.matchAll(/teaching-platform-proof:([a-z0-9-]+) status=(verified|candidate) date=(\d{4}-\d{2}-\d{2}) evidence=([^\s\x60]+)/g)]
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
  const curriculum = content.get(curriculumPath);
  const assessment = content.get(assessmentPath);
  const solution = content.get(solutionPath);
  const courseMap = content.get("curriculum/README.md");
  const courseEntry = section(markdownParts(courseMap).prose, "Audience and prerequisites");
  assert.match(
    courseEntry,
    /resolvable Python interpreter[\s\S]{0,120}every supported operating system[\s\S]{0,80}before\s+Module 1/i,
    "course entry must require a resolvable Python interpreter on every supported operating system",
  );
  assert.match(
    courseEntry,
    /Labs 7, 10, 11, and the capstone require it/i,
    "course entry Python prerequisite must cover Labs 7, 10, 11, and the capstone",
  );
  assert.match(courseEntry, /helpers[\s\S]{0,80}construct an isolated `PATH`/, "course entry must explain the helper-isolated PATH requirement");
  assert.match(courseEntry, /Windows resolves `python`, `python3`, then\s+`py`/, "course entry must document the Windows Python lookup order");
  assert.match(courseEntry, /macOS and Linux resolve `python3`, then `python`/, "course entry must document the POSIX Python lookup order");
  assert.match(courseEntry, /presence-only[\s\S]{0,100}no minimum or exact[\s\S]{0,120}3\.13\.13[\s\S]{0,120}evidence, not a learner requirement/i, "course entry must separate Python presence from candidate evidence");
  assert.doesNotMatch(
    courseMap,
    /Python 3\.13\.13 or newer|(?:minimum|exact(?:ly)?|at least|required to use|must use)\s+Python(?:\s+version)?\s*3\.13\.13/i,
    "course entry must not impose a Python version floor or equality",
  );
  for (const path of [curriculumPath, assessmentPath, solutionPath]) {
    assert.doesNotMatch(content.get(path), /\bsynthesis\s+chip\b/i, path + " must use ingest-ready catalog chip vocabulary");
  }
  assert.match(
    section(parsed.get(solutionPath).prose, "Result summary"),
    /ingest-ready\s+catalog\s+chip\s+authorizes\s+nothing/i,
    "solution result summary must preserve the ingest-ready catalog chip authority boundary",
  );
  assert.equal(countToken(curriculum, capstoneCheckpointHeader), 1, curriculumPath + " must contain the exact CAP.1 checkpoint header once");
  capstoneCheckpointRow(assessment, assessmentPath);
  capstoneCheckpointRow(solution, solutionPath);
  const curriculumCap1 = section(parsed.get(curriculumPath).prose, "Guided explanation")
    .match(/### CAP\.1[^\n]*[\s\S]*?(?=### CAP\.2)/)?.[0] ?? "";
  for (const match of curriculumCap1.matchAll(/\bdesign-critique:[a-z0-9-]+\b/g)) {
    assert.ok(
      designCritiqueChipCatalog.has(match[0]),
      curriculumPath + " CAP.1 checkpoint contains unknown design-critique chip " + match[0],
    );
  }
  for (const token of [
    "CAP-DC-01",
    "CAP-DC-R1",
    "audit:cap-trust-boundary reading=asserted",
    "design-critique:ingest-ready",
    "not bind-ready",
    "completed-arc record",
  ]) assert.ok(curriculumCap1.includes(token), curriculumPath + " CAP.1 checkpoint is missing " + token);
  assert.match(curriculumCap1, /before `activate`[\s\S]*command-free/i, "CAP.1 checkpoint must be command-free and precede activation");
  assert.match(curriculumCap1, /neither\s+the\s+ingest-ready\s+catalog\s+chip\s+nor\s+a\s+proposed\s+synthesis\s+authorizes\s+activation\s+or\s+implementation/i, "CAP.1 checkpoint must separate catalog state from lifecycle authority");
  for (const path of [assessmentPath, solutionPath]) {
    assert.match(content.get(path), /command-free[\s\S]{0,240}CAP-DC-01|CAP-DC-01[\s\S]{0,240}command-free/i, path + " must keep the CAP.1 checkpoint command-free");
  }
  assert.match(curriculum, /Modules 1–12/, "capstone prerequisite must cover Modules 1–12");
  requireDirectLink(curriculum, "modules/12-review-and-completion.md", "capstone prerequisite");
  requireDirectLink(assessment, "../curriculum/modules/12-review-and-completion.md", "capstone assessment prerequisite");
  requireDirectLink(solution, "../curriculum/modules/12-review-and-completion.md", "capstone solution prerequisite");
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
  assert.match(cap1Task, /install[\s\S]*orient[\s\S]*CAP-DC-01[\s\S]*activate[\s\S]*ready/i, "CAP.1 assessment task must place the checkpoint before activation and end at readiness");
  assert.doesNotMatch(cap1Task, /red\.json|\brun\s+`red`/i, "CAP.1 assessment task must not absorb CAP.2 red evidence");
  assert.match(cap2Task, /run `red`[\s\S]*red\.json/, "CAP.2 assessment task must begin with retained red evidence");

  const progressiveHints = section(parsed.get(assessmentPath).prose, "Progressive hints");
  const cap1Hints = progressiveHints.match(/<summary>CAP\.1[^\n]*[\s\S]*?(?=<summary>CAP\.2)/)?.[0] ?? "";
  const cap2Hints = progressiveHints.match(/<summary>CAP\.2[^\n]*[\s\S]*?(?=<summary>CAP\.3)/)?.[0] ?? "";
  assert.match(cap1Hints, /orient -> CAP-DC-01 -> activate -> ready/, "CAP.1 hints must place the checkpoint before activation and end at readiness");
  assert.doesNotMatch(cap1Hints, /red\.json|-> red|meaningful red/i, "CAP.1 hints must not absorb CAP.2 red evidence");
  assert.match(cap2Hints, /red\.json/, "CAP.2 hints must include red.json");
  const labSafety = section(parsed.get(labPath).prose, "Safety boundary");
  assert.match(labSafety, /reset`? only while identity[\s\S]{0,120}new[\s\S]{0,40}safe launcher/i, "lab must use identity-sensitive reset recovery");

  const helper = content.get(fixtureHelperPath);
  const pythonResolverStart = helper.indexOf("export function findPythonExecutable(");
  const pythonResolverEnd = helper.indexOf("\n}", pythonResolverStart);
  assert.ok(pythonResolverStart >= 0 && pythonResolverEnd > pythonResolverStart, "capstone helper must expose its Python resolver");
  const pythonResolver = helper.slice(pythonResolverStart, pythonResolverEnd + 2);
  assert.ok(pythonResolver.includes('["python", "python3", "py"]'), "capstone helper Windows Python lookup order changed");
  assert.ok(pythonResolver.includes('["python3", "python"]'), "capstone helper POSIX Python lookup order changed");
  assert.match(pythonResolver, /options\.command[\s\S]*process\.env\.CAPSTONE_PYTHON/, "capstone helper must retain the preflight's concrete interpreter path");
  const isolatedEnvStart = helper.indexOf("function isolatedEnv(");
  const isolatedEnvEnd = helper.indexOf("\nfunction runTask", isolatedEnvStart);
  assert.ok(isolatedEnvStart >= 0 && isolatedEnvEnd > isolatedEnvStart, "capstone helper isolatedEnv contract is missing");
  const isolatedEnvSource = helper.slice(isolatedEnvStart, isolatedEnvEnd);
  assert.match(isolatedEnvSource, /const pythonExecutable = findPythonExecutable\(\);/, "capstone isolatedEnv must resolve Python before constructing PATH");
  assert.match(isolatedEnvSource, /process\.platform === "win32"[\s\S]*dirname\(pythonExecutable\)/, "capstone isolatedEnv must retain resolved Python on Windows");
  assert.match(isolatedEnvSource, /: \["\/usr\/bin", "\/bin"\];/, "capstone isolatedEnv must keep the host Python directory out of POSIX PATH");
  const shimStart = helper.indexOf("function createLocalDirectiveShims(");
  const shimEnd = helper.indexOf("\nfunction updateMarker", shimStart);
  assert.ok(shimStart >= 0 && shimEnd > shimStart, "capstone isolated-tool shim contract is missing");
  const shimSource = helper.slice(shimStart, shimEnd);
  assert.match(shimSource, /\["python", pythonExecutable\]/, "capstone isolated tools must include Python");
  assert.match(shimSource, /process\.platform !== "win32"[\s\S]*tools\.set\("python3", pythonExecutable\)/, "capstone POSIX isolated tools must bind python3 to the selected interpreter");
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
  assert.match(
    checkpointSection,
    /orient[\s\S]*CAP-DC-01[\s\S]*activate/i,
    "lab checkpoints must name the private CAP-DC-01 row between orient and activate",
  );
  assert.match(
    evidenceBundle,
    /CAP-DC-01[\s\S]{0,120}between `orient` and\s+`activate`/,
    "lab evidence bundle must name the private CAP-DC-01 row between orient and activate",
  );
  assert.doesNotMatch(
    content.get(labPath),
    /private curriculum (?:clone|repository)/,
    "capstone lab must not call the public course a private curriculum clone or repository",
  );
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
  const labLiteral = section(parsed.get(labPath).prose, "Literal acceptance commands");
  assert.ok(
    content.get(labPath).includes("The supplied focused tests and work-items CLI pass for add, complete, summary, invalid-input, and empty-collection cases without mutating input collections."),
    "capstone lab must quote the work-items verify:ac clause 1 text",
  );
  for (const phrase of [
    "0 verified, 1 unverifiable",
    "no artifact path bound",
    "quoted evidence, not a step to type",
    "literal.json.literalAcceptance.stdout",
    "closeout.json.gate.currentHeadGate.stdout",
    "[rung=derived]",
  ]) {
    assert.ok(content.get(labPath).includes(phrase), "capstone lab must lock the verify:ac PASS fragment: " + phrase);
  }
  assert.ok(labLiteral.includes("npm run test:focused") && labLiteral.includes("npm run check:behavior"), "literal acceptance must keep the two stored npm commands");
  const solutionPage = content.get(solutionPath);
  assert.ok(
    solutionPage.includes("The supplied focused tests and work-items CLI pass for add, complete, summary, invalid-input, and empty-collection cases without mutating input collections."),
    "capstone solution must classify the work-items verify:ac clause 1 fragment",
  );
  assert.ok(solutionPage.includes("no artifact path bound"), "capstone solution must classify unverifiable as no bound artifact path");

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
    "xbrief/active/2026-01-15-fictional-work-items.xbrief.json",
  ]) assert.ok(combinedCore.includes(token), "capstone evidence contract is missing " + token);
  assert.match(combinedCore, /red[\s\S]{0,500}helper exits? \x600\x60[\s\S]{0,200}nested focused[\s\S]{0,80}exit \x601\x60/i, "red wrapper and nested exit semantics are missing");
  assert.match(combinedCore, /aggregate[\s\S]{0,500}helper exits? \x600\x60[\s\S]{0,300}nested aggregate[\s\S]{0,100}nonzero/i, "aggregate wrapper and nested exit semantics are missing");
  assert.match(combinedCore, /currentHeadReview[\s\S]{0,300}(?:working-tree|current-product)[\s\S]{0,300}before\s+the\s+final\s+commit/i, "current-product review timing is missing");
  assert.match(combinedCore, /COMPLETE[\s\S]{0,300}(?:not Directive lifecycle completion|xBRIEF remains active\/running)/i, "helper completion must remain distinct from lifecycle completion");

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
  const assessmentManifest = section(parsed.get(assessmentPath).prose, "Required evidence manifest");
  assert.match(assessmentManifest, /CAP-DC-01[\s\S]*CAP-DC-R1[\s\S]*not bind-ready[\s\S]*independent[\s\S]*audit:cap-trust-boundary[\s\S]*missing admitted completed-arc record[\s\S]*activation[\s\S]*implementation/i, "assessment manifest is missing the complete CAP.1 checkpoint evidence");
  assert.match(section(parsed.get(assessmentPath).prose, "Written reasoning prompts"), /CAP-DC-01[\s\S]*ingest-ready catalog chip[\s\S]*not make `CAP-DC-R1` bind-ready[\s\S]*unresolved audit[\s\S]*missing[\s\S]*completed-arc record[\s\S]*activation[\s\S]*implementation/i, "assessment reasoning must test checkpoint authority boundaries");
  const stateCards = section(parsed.get(assessmentPath).prose, "State cards");
  for (let index = 1; index <= 8; index += 1) {
    const cardRows = [...stateCards.matchAll(new RegExp("^\\|\\s*S" + index + "\\s*\\|", "gm"))];
    assert.equal(cardRows.length, 1, "assessment must contain exactly one state card S" + index);
  }

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

  const rehearsal = content.get(rehearsalPath);
  // Bounded WI-NNN namespace (#36): every authored copy of addWorkItem must
  // refuse at WI-999 rather than emit WI-1000, with one pinned RangeError.
  assert.equal(
    countToken(solution, identifierBoundThrow),
    2,
    "solution must pin the WI-999 identifier bound in both worked addWorkItem implementations",
  );
  for (const [stage, worked] of [["green", greenWorked], ["reviewed", reviewedWorked]]) {
    const reduceIndex = worked.indexOf("const highest = items.reduce");
    const guard = identifierBoundGuard.exec(worked);
    const constructIndex = worked.indexOf('padStart(3, "0")');
    assert.ok(reduceIndex >= 0, stage + " implementation must calculate the highest suffix");
    assert.ok(guard, stage + " implementation must refuse on `highest >= 999`, not on an ineffective condition");
    assert.ok(guard.index > reduceIndex, stage + " implementation must pin the WI-999 identifier bound after the highest-suffix calculation");
    assert.ok(constructIndex > guard.index, stage + " implementation must pin the WI-999 identifier bound before constructing the new item");
  }
  const labTask1 = content.get(labPath).match(/### Task 1 —[\s\S]*?(?=\n### Task 2 —)/)?.[0] ?? "";
  assert.ok(labTask1, "lab is missing the Task 1 (CAP.1) stage");
  const task1Fences = [...labTask1.matchAll(/```sh\n([\s\S]*?)```/g)].map((match) => match[1]);
  assert.ok(task1Fences.length >= 2, "lab Task 1 must split orient from activate");
  for (const fence of task1Fences) {
    assert.ok(
      !(/\borient\b/.test(fence) && /\bactivate\b/.test(fence)),
      "lab Task 1 must not keep orient then activate in one fence",
    );
  }
  assert.match(task1Fences[0], /\borient\b/, "lab Task 1 first fence must run orient");
  assert.doesNotMatch(task1Fences[0], /\bactivate\b/, "lab Task 1 first fence must stop after orient");
  assert.match(task1Fences[1], /\bactivate\b/, "lab Task 1 second fence must run activate");
  assert.match(labTask1, /command-free/, "lab Task 1 pause must stay command-free");
  assert.match(labTask1, /CAP-DC-01/, "lab Task 1 pause must name CAP-DC-01");
  assert.match(labTask1, /\$CAPSTONE_ASSESSMENT_NOTE/, "lab Task 1 must write the private row into $CAPSTONE_ASSESSMENT_NOTE");
  assert.match(labTask1, /\$CapstoneAssessmentNote/, "lab Task 1 must write the private row into $CapstoneAssessmentNote");
  assert.match(labTask1, /fixture transition/, "lab Task 1 expected line must treat helper green as the fixture transition");
  const labTask2 = content.get(labPath).match(/### Task 2 —[\s\S]*?(?=\n### Task 3 —)/)?.[0] ?? "";
  assert.ok(labTask2, "lab is missing the Task 2 (CAP.2) stage");
  for (const token of ["`RangeError`", identifierBoundMessage, "even when lower identifiers are free"]) {
    assert.ok(labTask2.includes(token), "lab Task 2 green list must state the WI-999 identifier bound: " + token);
  }
  assert.ok(
    section(parsed.get(solutionPath).prose, "Valid alternatives").includes(identifierBoundMessage),
    "solution valid alternatives must keep the WI-999 identifier bound",
  );
  // Bounded WI-NNN namespace on the graded surface (#38): the assessment is
  // the only artifact an examinee reads, so CAP.2 must state the bound and its
  // refusal itself rather than point at the lab. Both windows are sentence-local
  // (`[^.!?]`), so tokens scattered across other sentences cannot satisfy them.
  const cap2Prose = cap2Task.replace(/\s+/g, " ");
  assert.match(
    cap2Prose,
    /`WI-000` through `WI-999` are legal existing identifiers[^.!?]{0,120}empty collection allocates `WI-001`/,
    "CAP.2 assessment task must state the legal WI-NNN namespace the learner implements",
  );
  assert.match(
    cap2Prose,
    new RegExp(
      "`RangeError` with the exact message `" +
        escapeRegExp(identifierBoundMessage) +
        "`[^.!?]{0,80}already holds `WI-999`[^.!?]{0,60}even when lower identifiers are free",
    ),
    "CAP.2 assessment task must name the WI-999 exhaustion refusal and its pinned RangeError message in one sentence",
  );
  const boundaryCase = content.get(fixtureTestPath).match(/test\("refuses to allocate past the bounded WI-999 identifier"[\s\S]*?\n\}\);/)?.[0] ?? "";
  assert.ok(boundaryCase, "supplied test must carry the focused WI-999 identifier bound case");
  assert.ok(boundaryCase.includes('{ id: "WI-999"'), "supplied WI-999 case must start from a collection whose maximum suffix is 999");
  assert.match(boundaryCase, /name: "RangeError"/, "supplied WI-999 case must assert the documented RangeError type");
  assert.ok(boundaryCase.includes('message: "' + identifierBoundMessage + '"'), "supplied WI-999 case must assert the pinned identifier bound message");
  assert.match(boundaryCase, /assert\.deepEqual\(existing,/, "supplied WI-999 case must prove the input collection is unchanged");
  assert.match(content.get(fixtureTestPath), /preserves 50 ordinary fictional work-item inputs/, "supplied suite must keep the 50-item ordinary-range test");
  const rehearsalGreen = rehearsal.match(/const greenImplementation = `([\s\S]*?)`\.trimStart\(\);/)?.[1] ?? "";
  assert.ok(rehearsalGreen, "capstone rehearsal is missing the green implementation string");
  const rehearsalReduce = rehearsalGreen.indexOf("const highest = items.reduce");
  const rehearsalGuard = identifierBoundGuard.exec(rehearsalGreen);
  assert.ok(rehearsalReduce >= 0, "rehearsal green implementation must calculate the highest suffix");
  assert.ok(rehearsalGuard, "rehearsal green implementation must refuse on `highest >= 999`, not on an ineffective condition");
  assert.ok(rehearsalGuard.index > rehearsalReduce, "rehearsal green implementation must pin the WI-999 bound after the reduce so the reviewed copy inherits it");
  assert.match(
    rehearsal,
    /const reviewedImplementation = greenImplementation\.replace\(\s*"const highest = items\.reduce",/,
    "rehearsal reviewed implementation must stay derived from the green string",
  );
  assert.equal(countToken(rehearsal, identifierBoundThrow), 1, "rehearsal must carry one authored WI-999 guard, not a second hand-written copy");
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
  assert.match(
    labEnvironment,
    /python_probe='import os, sys; print\(os\.path\.realpath\(sys\.executable\)\)'[\s\S]*if CAPSTONE_PYTHON="\$\(env python3 -c "\$python_probe"\)"[\s\S]*\[ -f "\$CAPSTONE_PYTHON" \][\s\S]*\[ -x "\$CAPSTONE_PYTHON" \][\s\S]*elif CAPSTONE_PYTHON="\$\(env python -c "\$python_probe"\)"[\s\S]*\[ -f "\$CAPSTONE_PYTHON" \][\s\S]*\[ -x "\$CAPSTONE_PYTHON" \][\s\S]*export CAPSTONE_PYTHON\s+"\$CAPSTONE_PYTHON" --version/,
    "capstone POSIX start must resolve one concrete interpreter in python3, python order",
  );
  assert.doesNotMatch(labEnvironment, /command -v python(?:3)?/, "capstone POSIX start must not admit shell functions");
  assert.match(labEnvironment, /@\("python", "python3", "py"\)[\s\S]*Get-Command/, "capstone Windows start must resolve python, python3, then py");
  assert.match(labEnvironment, /presence-only requirement[\s\S]*before constructing `isolatedEnv`/, "capstone lab must explain the isolatedEnv Python requirement");
  assert.match(labEnvironment, /3\.13\.13[\s\S]{0,100}candidate-environment evidence[\s\S]{0,100}not a minimum or exact learner version/, "capstone lab must keep Python 3.13.13 as candidate evidence only");
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
    new RegExp(escapeRegExp(windowsPowerShellVersionGuard)),
    "capstone Windows start must throw on PowerShell below 7.4",
  );
  const windowsStartFence = labEnvironment.match(/```powershell\r?\n([\s\S]*?)```/)?.[1] ?? "";
  assert.ok(
    windowsStartFence.startsWith(windowsPowerShellVersionGuard),
    "capstone Windows start must throw on PowerShell below 7.4 as the first statement",
  );
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
    /\/absolute\/path\/to\/directive-training/i,
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
  assertTeachingBaselinePin(packageJson, content.get("README.md"));
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
  assert.equal(fixturePackage.devDependencies?.["@deftai/directive"], "0.119.5", "fixture package must retain the exact Directive pin");
  for (const dependency of ["directive-core", "directive-content", "directive-types"]) {
    assert.equal(fixturePackage.overrides?.["@deftai/" + dependency], "0.119.5", "fixture package must retain exact " + dependency + " override");
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
  const baseline = content.get("references/SOURCE-BASELINE.md");
  const markers = teachingPlatformMarkers(baseline);
  assert.equal(countToken(baseline, "teaching-platform-proof:"), 3, "SOURCE-BASELINE contains a malformed or extra current platform proof marker");
  assert.deepEqual(
    markers,
    [
      { proof: "macos-zsh", status: "verified", date: "2026-09-20", evidence: "baseline-upgrade-65-of-65" },
      { proof: "linux-bash", status: "candidate", date: "2026-09-20", evidence: "not-run" },
      { proof: "windows-pwsh7", status: "candidate", date: "2026-09-20", evidence: "not-run" },
    ],
    "SOURCE-BASELINE current platform proof marker set is incorrect",
  );
  assert.ok(markers.filter(({ status }) => status === "verified").every(({ evidence }) => !/^(?:none|not-run|pending|unknown)$/.test(evidence)), "verified capstone platform proof must cite evidence");
  for (const token of [
    "8/8",
    "4f8ca7e36723e094ed1a19aa9593f01c0b798cdf",
    "1ad4c23f03498af745eec972e7c3f5a63b97d4b4",
  ]) assert.ok(notes.includes(token), "SOURCE-NOTES fixture provenance is missing " + token);
  assert.match(baseline, /^## Capstone end-to-end validation\s*$/m, "SOURCE-BASELINE is missing capstone validation");
  assert.match(notes, /^## Capstone source validation\s*$/m, "SOURCE-NOTES is missing capstone source validation");
  const baselineCapstone = section(markdownParts(baseline).prose, "Capstone end-to-end validation");
  const notesCapstone = section(markdownParts(notes).prose, "Capstone source validation");
  assert.match(baselineCapstone, /0\.119\.5/, "current capstone source record is missing learner pin");
  assert.match(notesCapstone, /0\.112\.0/, "historical capstone source record is missing its learner pin");
  for (const source of [baselineCapstone, notesCapstone]) assert.match(source, /Node\.js\s+20-compatible/, "capstone source record is missing application compatibility");
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
    module12Path,
    module12SolutionPath,
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
  for (let moduleNumber = 1; moduleNumber <= 12; moduleNumber += 1) {
    const row = courseModuleRow(course, moduleNumber);
    assert.match(row, /\|\s*Learner-ready\b/i, "Module " + moduleNumber + " course row must remain learner-ready");
    assert.doesNotMatch(row, /\b(?:planned|not yet available)\b/i, "Module " + moduleNumber + " course row is not implemented");
  }

  const navigationLinks = [
    ["README.md", "curriculum/capstone-end-to-end.md", "repository start"],
    ["curriculum/README.md", "capstone-end-to-end.md", "course map"],
    [module12Path, "../capstone-end-to-end.md", "Module 12"],
    [module12SolutionPath, "../curriculum/capstone-end-to-end.md", "Module 12 solution"],
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
    [curriculumPath, ["../labs/capstone-end-to-end.md", "../assessments/capstone-end-to-end.md", "../solutions/capstone-end-to-end.md", "modules/12-review-and-completion.md"]],
    [labPath, ["../curriculum/capstone-end-to-end.md", "../assessments/capstone-end-to-end.md", "../solutions/capstone-end-to-end.md"]],
    [assessmentPath, ["../curriculum/capstone-end-to-end.md", "../labs/capstone-end-to-end.md", "../solutions/capstone-end-to-end.md"]],
    [solutionPath, ["../curriculum/capstone-end-to-end.md", "../labs/capstone-end-to-end.md", "../assessments/capstone-end-to-end.md"]],
  ]) {
    for (const href of links) requireDirectLink(content.get(path), href, path);
  }
  for (const path of [
    "README.md",
    "curriculum/README.md",
    module12Path,
    module12SolutionPath,
    "labs/README.md",
    "assessments/README.md",
    "solutions/README.md",
    "maintainers/CURRICULUM-MAINTENANCE.md",
  ]) verifyLinks(root, path, markdownParts(content.get(path)).prose);

  const scope = JSON.parse(content.get(lifecycle.path));
  assert.equal(scope.plan?.id, "training.capstone.learning-experience", "capstone learning scope id changed");
  assert.equal(scope.plan?.status, lifecycle.status, "capstone learning scope folder and status disagree");
  assert.deepEqual(scope.plan?.metadata?.swarm?.file_scope, historicalLineage.approvedFileScope, "historical capstone approved file scope changed");
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
