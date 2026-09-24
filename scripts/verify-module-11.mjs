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

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function requireStartingStateGate(page) {
  const normalized = normalizeNewlines(page);
  const environment = normalized.match(/^## Environment and starting-state check\n[\s\S]*?(?=^## )/m)?.[0] ?? "";
  assert.ok(environment, `${lab11} is missing its Environment and starting-state check`);

  const fences = [...environment.matchAll(/```sh\n([\s\S]*?)\n```/g)];
  assert.ok(fences.length >= 2, `${lab11} must keep separate create and LAB11_ROOT export fences`);
  const gateLines = fences[0][1].split("\n").map((line) => line.trim()).filter(Boolean);
  assert.equal(gateLines[0], "set -eu", `${lab11} starting-state gate must be fail-closed with set -eu`);

  const createCommand = "node labs/fixtures/11-testing-gates-and-evidence/gates-lab.mjs create";
  const createIndex = gateLines.indexOf(createCommand);
  assert.ok(createIndex >= 0, `${lab11} starting-state gate must print the create path with the bare helper command`);
  let previousIndex = 0;
  for (const command of ["node --version", "npm --version", "git --version", "task --version", "uv --version"]) {
    const index = gateLines.indexOf(command);
    assert.ok(index > previousIndex && index < createIndex, `${lab11} starting-state gate must run ${command} in order before create`);
    previousIndex = index;
  }
  assert.deepEqual(
    gateLines.slice(0, 7),
    ["set -eu", "node --version", "npm --version", "git --version", "task --version", "uv --version", createCommand],
    `${lab11} starting-state gate must keep the exact fail-closed command prefix through create`,
  );
  assert.doesNotMatch(fences[0][1], /LAB11_ROOT\s*=/, `${lab11} create must print its path before the separate LAB11_ROOT copy step`);
  assert.ok(
    fences.slice(1).some((match) => match[1].includes('export LAB11_ROOT="/absolute/path/printed/by/the/helper"')),
    `${lab11} must keep the separate LAB11_ROOT export fence after create`,
  );
  assert.doesNotMatch(
    environment,
    /\b(?:Task|uv)\b`?\s+(?:(?:version\s*:\s*)|(?:version\s+)|(?:[~^<>=]+\s*))?v?\d+\.\d+(?:\.\d+)?|\b(?:supported\s+)?variance\b|^\|[^\n]*(?:Task|uv)[^\n]*\|$/im,
    `${lab11} starting-state commands are resolution checks only; do not add Task or uv pins or a variance table`,
  );
}

function exactHeadingSlice(body, heading, level) {
  const marker = `${"#".repeat(level)} ${heading}`;
  const lines = body.split(/\r?\n/);
  const start = lines.indexOf(marker);
  assert.ok(start >= 0, `missing heading: ${heading}`);
  let end = lines.length;
  let fence = null;
  for (let index = start + 1; index < lines.length; index += 1) {
    const fenceMark = lines[index].match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (!fence && fenceMark) {
      fence = fenceMark[1];
      continue;
    }
    if (fence && fenceMark && fenceMark[1][0] === fence[0] && fenceMark[1].length >= fence.length && !fenceMark[2].trim()) {
      fence = null;
      continue;
    }
    if (fence) continue;
    const match = /^(#{1,6}) /.exec(lines[index]);
    if (match && match[1].length <= level) {
      end = index;
      break;
    }
  }
  return lines.slice(start, end).join("\n");
}

function powershellText(markdown) {
  return markdownParts(markdown).blocks
    .filter(({ language }) => language === "powershell" || language === "pwsh")
    .map(({ content: block }) => block)
    .join("\n");
}

function powershellFenceSpans(markdown) {
  const lines = markdown.split(/\r?\n/);
  const spans = [];
  let fence = null;
  let start = -1;
  const body = [];
  for (let index = 0; index < lines.length; index += 1) {
    const marker = lines[index].match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (!fence && marker) {
      fence = { marker: marker[1], language: marker[2].trim().toLowerCase() };
      start = index;
      body.length = 0;
      continue;
    }
    if (fence && marker && marker[1][0] === fence.marker[0] && marker[1].length >= fence.marker.length && !marker[2].trim()) {
      if (fence.language === "powershell" || fence.language === "pwsh") {
        spans.push({ start, end: index, content: body.join("\n") });
      }
      fence = null;
      continue;
    }
    if (fence) body.push(lines[index]);
  }
  assert.ok(!fence, "unclosed Markdown code fence");
  return { lines, spans };
}

function stripHtmlComments(text) {
  let stripped = text;
  for (;;) {
    const start = stripped.indexOf("<!--");
    if (start === -1) {
      return stripped;
    }
    const end = stripped.indexOf("-->", start + 4);
    if (end === -1) {
      return stripped.slice(0, start);
    }
    stripped = `${stripped.slice(0, start)}${stripped.slice(end + 3)}`;
  }
}

function interFenceWithoutComments(text) {
  return stripHtmlComments(text).replace(/^\s*#.*$/gm, "").trim();
}

export const lab11RetainedLiteralStdoutTokens = Object.freeze([
  "verify:ac passed (#3284) [rung=derived]",
  "Literal acceptance-command gate passed (#3284/#3267): 2 command(s) run verbatim",
  "✓ npm run test:focused — exit 0 (expected 0)",
  "✓ npm run check:behavior — exit 0 (expected 0)",
  "AC-pass bank checkpoint required (finalize-on-green) (#3285)",
  "unbounded budget — dual-stop still applies; bank is optional discipline",
  "[deft ac-pass-banking] banked scope=northstar.testing.summary-average next=finalize_and_deepen had_surplus=true (#3285)",
]);

const lab11ObsoleteWalkPhrases = Object.freeze([
  "0 verified, 1 unverifiable",
  "verify:ac clause walk",
  "no artifact path bound",
]);

function textFence(section, path, label) {
  const fence = section.match(/```text\r?\n([\s\S]*?)\r?\n```/)?.[1];
  assert.ok(fence, `${path} is missing the ${label}`);
  return fence;
}

function requireRetainedLiteralInspectFragment(path, fragment) {
  for (const token of lab11RetainedLiteralStdoutTokens) {
    assert.ok(fragment.includes(token), `${path} inspect fragment must lock retained 0.119.5 stdout: ${token}`);
  }
  for (const phrase of lab11ObsoleteWalkPhrases) {
    assert.ok(
      !fragment.includes(phrase),
      `${path} inspect fragment must not restore obsolete clause-walk evidence: ${phrase}`,
    );
  }
}

function requireSingleRetainedLiteralClassification(path, sectionBody) {
  const normalized = sectionBody.replace(/\s+/g, " ");
  for (const phrase of [
    "literal-acceptance proof",
    "[rung=derived]",
    "AC-pass-bank dual-stop",
    "upstream 0.119.5 diagnostics",
  ]) {
    assert.ok(normalized.includes(phrase), `${path} must classify retained 0.119.5 stdout: ${phrase}`);
  }
  assert.doesNotMatch(
    sectionBody,
    /\bboth observed variants\b|\bWindows\/macOS\b|\bplatform-controlled(?: the)? variant\b|\bmacOS form\b|\bWindows form\b/i,
    `${path} must present one retained fixture fragment, not a dual-variant recut`,
  );
}

function executableCommandLines(content) {
  return content.split(/\r?\n/).flatMap((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return [];
    }
    const comment = trimmed.indexOf(" #");
    const executable = comment === -1 ? trimmed : trimmed.slice(0, comment).trimEnd();
    return executable ? [executable] : [];
  });
}

function helperCall(content, verb) {
  const token = `node $Helper ${verb}`;
  return executableCommandLines(content).some((line) => {
    const index = line.indexOf(token);
    if (index === -1) {
      return false;
    }
    const after = index + token.length;
    return after === line.length || /[^A-Za-z0-9_]/.test(line[after]);
  });
}

function fenceIndex(spans, verb) {
  return spans.findIndex((span) => helperCall(span.content, verb));
}

function forbidSharedFence(spans, left, right, message) {
  assert.ok(
    !spans.some((span) => helperCall(span.content, left) && helperCall(span.content, right)),
    message,
  );
}

function requireVisiblePause(routeLines, spans, fromVerb, toVerb, labPath, patterns) {
  const fromFence = fenceIndex(spans, fromVerb);
  const toFence = fenceIndex(spans, toVerb);
  assert.ok(fromFence >= 0, `${labPath} Native Windows route is missing ${fromVerb}`);
  assert.ok(toFence >= 0, `${labPath} Native Windows route is missing ${toVerb}`);
  assert.ok(
    fromFence < toFence,
    `${labPath} Native Windows ${fromVerb} must occur in an earlier fence than ${toVerb}`,
  );
  const between = routeLines.slice(spans[fromFence].end + 1, spans[toFence].start).join("\n");
  const visiblePause = interFenceWithoutComments(between);
  assert.ok(
    visiblePause,
    `${labPath} Native Windows route must not separate ${fromVerb} and ${toVerb} with only a comment`,
  );
  for (const pattern of patterns) {
    assert.match(
      visiblePause,
      pattern,
      `${labPath} pause between ${fromVerb} and ${toVerb} is missing required handoff text`,
    );
  }
}

/** Lab 11 Native Windows route must pause at Task 1, implement, refactor, and Task 4. */
function assertWindowsRoutePauses(labPath, body) {
  const route = exactHeadingSlice(body, "Native Windows PowerShell 7.4+ route", 2);
  const routeCode = powershellText(route);
  assert.match(routeCode, /node \$Helper create\b/, `${labPath} Native Windows route must remain a whole-lab script`);
  assert.match(routeCode, /\barchive\b/, `${labPath} Native Windows route must remain a whole-lab script`);
  assert.doesNotMatch(routeCode, /\bRead-Host\b/, `${labPath} Native Windows route must not use an in-fence prompt`);
  assert.doesNotMatch(
    routeCode,
    /node \$Helper (?:wait|pause|resume)\b/,
    `${labPath} Native Windows route must not add a helper pause, resume, or wait verb`,
  );
  const { lines: routeLines, spans: routeFences } = powershellFenceSpans(route);
  forbidSharedFence(
    routeFences,
    "create",
    "red",
    `${labPath} Native Windows create and red must not share a PowerShell fence`,
  );
  forbidSharedFence(
    routeFences,
    "red",
    "green",
    `${labPath} Native Windows red and green must not share a PowerShell fence`,
  );
  forbidSharedFence(
    routeFences,
    "green",
    "refactor",
    `${labPath} Native Windows green and refactor must not share a PowerShell fence`,
  );
  forbidSharedFence(
    routeFences,
    "aggregate",
    "final",
    `${labPath} Native Windows aggregate and final must not share a PowerShell fence`,
  );
  assert.ok(routeFences.length >= 5, `${labPath} Native Windows route must use at least five PowerShell fences`);
  const createFence = fenceIndex(routeFences, "create");
  const redFence = fenceIndex(routeFences, "red");
  const greenFence = fenceIndex(routeFences, "green");
  const refactorFence = fenceIndex(routeFences, "refactor");
  const literalFence = fenceIndex(routeFences, "literal");
  const aggregateFence = fenceIndex(routeFences, "aggregate");
  const finalFence = fenceIndex(routeFences, "final");
  const resetFence = fenceIndex(routeFences, "reset");
  const archiveFence = fenceIndex(routeFences, "archive");
  assert.ok(createFence >= 0, `${labPath} Native Windows route is missing create`);
  assert.ok(redFence >= 0, `${labPath} Native Windows route is missing red`);
  assert.ok(redFence > createFence, `${labPath} Native Windows red must occur in a later fence than create`);
  assert.ok(greenFence > redFence, `${labPath} Native Windows green must occur in a later fence than red`);
  assert.ok(refactorFence > greenFence, `${labPath} Native Windows refactor must occur in a later fence than green`);
  assert.ok(literalFence >= refactorFence, `${labPath} Native Windows literal must not precede refactor`);
  assert.ok(aggregateFence >= literalFence, `${labPath} Native Windows aggregate must not precede literal`);
  assert.ok(finalFence > aggregateFence, `${labPath} Native Windows final must occur in a later fence than aggregate`);
  assert.ok(resetFence >= finalFence, `${labPath} Native Windows reset must not precede final`);
  assert.ok(archiveFence >= resetFence, `${labPath} Native Windows archive must not precede reset`);
  const phaseA = routeFences[createFence].content;
  const install = phaseA.search(/node \$Helper install \$LabRoot/);
  const printedRoot = phaseA.search(/Write-Output \$LabRoot\b/);
  assert.ok(install >= 0, `${labPath} Phase A must install the unique first root`);
  assert.ok(printedRoot > install, `${labPath} Phase A must print $LabRoot after install`);
  assert.doesNotMatch(
    phaseA,
    /node \$Helper (?:red|green|refactor|literal|aggregate|final|reset|archive)\b/,
    `${labPath} Phase A must end before red`,
  );
  for (const [index, span] of routeFences.entries()) {
    if (index === createFence) continue;
    assert.doesNotMatch(
      span.content,
      /node \$Helper create\b/,
      `${labPath} later Native Windows phases must reuse $LabRoot rather than create a new attempt`,
    );
    assert.match(span.content, /\$LabRoot\b/, `${labPath} later Native Windows phases must reuse $LabRoot`);
  }
  requireVisiblePause(routeLines, routeFences, "create", "red", labPath, [
    /Join-Path \$LabRoot ["']test\/summary\.test\.mjs["']/,
    /Task 1/,
  ]);
  requireVisiblePause(routeLines, routeFences, "red", "green", labPath, [
    /Join-Path \$LabRoot ["']src\/summary\.mjs["']/,
    /Task 2/,
  ]);
  requireVisiblePause(routeLines, routeFences, "green", "refactor", labPath, [
    /Join-Path \$LabRoot ["']src\/summary\.mjs["']/,
    /named\s+locals?/,
    /source bytes/,
  ]);
  requireVisiblePause(routeLines, routeFences, "aggregate", "final", labPath, [
    /Join-Path \$LabRoot ["']quality-record\.json["']/,
    /Task 4/,
  ]);
}

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
  page = normalizeNewlines(page);
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
  page = normalizeNewlines(page);
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
  assert.doesNotMatch(
    labProse,
    /gates-lab\.mjs (?:wait|pause|resume)\b/,
    `${lab11} must not add a helper pause, resume, or wait verb`,
  );
  for (const path of ["red.json", "green.json", "refactor.json", "literal.json", "aggregate-failure.json", "final.json"]) {
    assert.ok(labProse.includes(path), `${lab11} is missing evidence artifact: ${path}`);
  }
  const labPage = content.get(lab11);
  requireStartingStateGate(labPage);
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
  const task3 = exactHeadingSlice(labPage, "Task 3 — Run literal and forward evidence", 3);
  requireRetainedLiteralInspectFragment(
    lab11,
    textFence(task3, lab11, "Task 3 quoted verify:ac PASS fragment"),
  );
  requireSingleRetainedLiteralClassification(lab11, task3);
  assert.ok(labPage.includes("quoted evidence, not a step to type"), `${lab11} must keep quoted-evidence guidance`);
  assert.ok(labPage.includes("literal.json.literalAcceptance.stdout"), `${lab11} must name the retained stdout field`);
  assertWindowsRoutePauses(lab11, labPage);

  const solutionProse = parsed.get(solution11).prose;
  requireOutcomes(solution11, solutionProse, ["Outcome map", "Acceptance evidence"]);
  for (const phrase of ["EXPECTED_FAILURE", "quality:record", "quality-record.json only", "gateDefinitionsUnchanged", "average: 4"]) {
    assert.ok(solutionProse.includes(phrase), `${solution11} is missing explained evidence: ${phrase}`);
  }
  const solutionPage = content.get(solution11);
  const step5 = exactHeadingSlice(solutionPage, "Step 5 — Run contract and coverage evidence", 3);
  requireRetainedLiteralInspectFragment(
    solution11,
    textFence(step5, solution11, "explained-solution quoted verify:ac PASS fragment"),
  );
  requireSingleRetainedLiteralClassification(solution11, step5);

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
