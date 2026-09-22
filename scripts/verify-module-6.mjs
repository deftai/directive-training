import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  courseModuleRow,
  markdownParts,
  moduleHeadings,
  section,
  solutionHeadings,
  verifyLinks,
} from "./verify-modules-4-5.mjs";
import { assertTeachingBaselinePin } from "./teaching-baseline.mjs";

const module6 = "curriculum/modules/06-creating-well-shaped-work.md";
const solution6 = "solutions/module-06-creating-well-shaped-work.md";
const module5 = "curriculum/modules/05-sources-versus-projections.md";
const lab7 = "labs/07-scope-lifecycle.md";
const lab7Solution = "solutions/lab-07-scope-lifecycle.md";
const suppliedScopes = [
  "2026-01-15-fictional-delivery.xbrief.json",
  "2026-01-15-fictional-cancel.xbrief.json",
];
const requiredFiles = [
  module6,
  solution6,
  module5,
  lab7,
  lab7Solution,
  "README.md",
  "curriculum/README.md",
  "assessments/README.md",
  "solutions/README.md",
  "references/GLOSSARY.md",
  "references/QUICK-REFERENCE.md",
  "references/SOURCE-BASELINE.md",
  "references/SOURCE-NOTES.md",
  "maintainers/CURRICULUM-MAINTENANCE.md",
  "xbrief/PROJECT-DEFINITION.xbrief.json",
  "package.json",
];
const unfinishedMarker = /\{\{[^}]+\}\}|\b(?:TODO|TBD|FIXME)\b|Authoring template/i;
const shellLanguage = /^(?:sh|shell|bash|zsh|powershell|pwsh|console)$/;
const sourcePaths = [
  ".deft/core/docs/directive-lifecycle.md",
  ".deft/core/strategies/README.md",
  ".deft/core/strategies/interview.md",
  ".deft/core/skills/deft-directive-setup/SKILL.md",
  ".deft/core/skills/deft-directive-decompose/SKILL.md",
  ".deft/core/vbrief/vbrief.md",
  ".deft/core/verification/verification.md",
  ".deft/core/verification/plan-checking.md",
  ".deft/core/glossary.md",
  ".deft/core/skills/deft-directive-gh-slice/SKILL.md",
  ".deft/core/commands.md",
  ".deft/core/main.md",
];
const outcomes = ["O6.1", "O6.2", "O6.3", "O6.4"];
const identifierTokens = (text) => text.match(/[A-Za-z0-9]+(?:[_.-][A-Za-z0-9]+)*/g) ?? [];
const hasExactIdentifier = (text, identifier) => identifierTokens(text).includes(identifier);
const hasExactPhrase = (text, phrase) => {
  const tokens = identifierTokens(text).map((token) => token.toLowerCase());
  const expected = identifierTokens(phrase).map((token) => token.toLowerCase());
  return tokens.some((_, index) => expected.every((token, offset) => tokens[index + offset] === token));
};

function tableCells(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function tableRows(body, expectedHeader, label) {
  const lines = body.split("\n");
  const headerIndex = lines.findIndex((line) => {
    if (!line.includes("|")) return false;
    return JSON.stringify(tableCells(line)) === JSON.stringify(expectedHeader);
  });
  assert.ok(headerIndex >= 0, `${label} is missing its required header`);
  const separator = tableCells(lines[headerIndex + 1] ?? "");
  assert.ok(
    separator.length === expectedHeader.length && separator.every((cell) => /^:?-{3,}:?$/.test(cell)),
    `${label} is missing its separator row`,
  );
  const rows = [];
  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.trim() || !line.includes("|")) break;
    rows.push(tableCells(line));
  }
  return rows;
}

function requireMeaningful(cell, label, minimumWords = 8) {
  assert.ok(
    cell.trim().split(/\s+/).filter(Boolean).length >= minimumWords,
    `${label} must be a scenario-specific explanation, not presence-only or keyword-only text`,
  );
}

function exactBaseline(path, prose, recordHeading) {
  const record = section(prose, recordHeading);
  const baseline = record.match(/^\| Directive baseline\s*\|([^\n]+)$/m)?.[1];
  assert.ok(baseline?.includes("0.119.5"), `${path} must declare the exact Directive 0.119.5 baseline`);
  assert.deepEqual(
    [...new Set(baseline.match(/\b\d+\.\d+\.\d+\b/g))],
    ["0.119.5"],
    `${path} contains a stale baseline version`,
  );
}

function requireSectionOutcomes(path, prose, headings) {
  for (const heading of headings) {
    const body = section(prose, heading);
    for (const outcome of outcomes) {
      assert.ok(hasExactIdentifier(body, outcome), `${path} ${heading} is missing ${outcome}`);
    }
  }
}

/**
 * Verify the O6.2 structural-evidence contract: O6.2 keeps its wording, its completion
 * evidence records a positive structural result over the exact learner-authored artifact,
 * the vehicle recut is named, and structural proof stays separate from the rubric.
 * @param {string} moduleProse Module 6 prose with code fences removed.
 * @param {string} solutionProse Module 6 solution prose with code fences removed.
 * @param {string} labProse Lab 7 prose with code fences removed.
 * @param {string} labCommands Joined Lab 7 shell blocks.
 * @returns {void}
 */
function requireStructuralEvidenceContract(moduleProse, solutionProse, labProse, labCommands, extra = {}) {
  const outcomesSection = section(moduleProse, "Learning outcomes");
  assert.match(
    outcomesSection,
    /O6\.2 — Trace idea to proposed scope[\s\S]{0,400}schema-0\.8 proposed-scope artifact/,
    "O6.2 must keep its shaping and schema-0.8 proposed-scope artifact outcome",
  );
  assert.match(
    outcomesSection,
    /proposal is not implementation authority/i,
    "O6.2 must keep the proposal authority boundary in its outcome text",
  );

  const structural = section(moduleProse, "Structural evidence for O6.2");
  assert.match(
    structural,
    /\]\([^)]*labs\/07-scope-lifecycle\.md(?:#[^)]*)?\)/,
    "the O6.2 structural-evidence section must name the adjacent lab vehicle by link",
  );
  assert.match(
    structural,
    /adjacent practical lab\s+step/i,
    "the vehicle recut must be named, not implied",
  );
  assert.match(
    structural,
    /command-free/i,
    "the vehicle recut must state whether Module 6's command-free contract changed",
  );
  assert.match(
    structural,
    /xbrief:verify[^\n]*--out[^\n]*--project-root/,
    "the structural check must name the exact command with its artifact path and project root",
  );
  for (const [pattern, label] of [
    [/\*\*path\*\*/i, "path"],
    [/\*\*command\*\*/i, "command"],
    [/\*\*exit code\*\*/i, "exit code"],
    [/\*\*result\*\*/i, "result"],
  ]) {
    assert.match(structural, pattern, `the O6.2 structural evidence must retain the ${label}`);
  }
  assert.match(
    structural,
    /`xbrief:preflight` and `doctor` are not the authoring-validity pass/,
    "the structural check must refuse xbrief:preflight and doctor as the authoring-validity pass",
  );
  assert.match(
    structural,
    /^\|?\s*Surface\s*\|\s*Proves\s*\|\s*Does not prove\s*\|?\s*$/im,
    "the O6.2 evidence surfaces must be split in a published table",
  );
  assert.match(
    structural,
    /Module 6 comparison rubric[^\n]*(?:strategy|acceptance)[^\n]*implementation authority/i,
    "the comparison rubric must keep strategy, observability, traces, and the authority boundary",
  );
  assert.match(
    structural,
    /green structural result\s+grants no promotion, no activation, and no implementation authority/i,
    "a green structural result must grant no promotion, activation, or implementation authority",
  );
  assert.match(
    structural,
    /no outcome is added or recut/i,
    "the module must state whether a separate outcome was added or recut",
  );
  assert.match(
    structural,
    /(?:command choice, invocation, output interpretation, and recovery are not assessed)/i,
    "the module must state the condition under which a separate outcome would be required",
  );

  const completion = section(moduleProse, "Completion evidence");
  const completionRow = completion.split("\n").find((line) => /^\|\s*O6\.2\s*\|/.test(line.trim()));
  assert.ok(completionRow, "Completion evidence must keep an O6.2 row");
  for (const [pattern, label] of [
    [/artifact path/i, "the artifact path"],
    [/command/i, "the command"],
    [/exit code/i, "the exit code"],
    [/result/i, "the result"],
    [/`xbrief:verify` exits `0`/, "a positive xbrief:verify exit"],
    [/grants no promotion, activation, or implementation authority/i, "the no-authority boundary"],
  ]) {
    assert.match(completionRow, pattern, `O6.2 completion evidence is missing ${label}`);
  }

  const solutionEvidence = section(solutionProse, "Acceptance evidence");
  assert.match(
    solutionEvidence,
    /Structural conformance of the exact artifact[^\n]*`xbrief:verify` exits `0`[^\n]*O6\.2/,
    "the solution must record structural conformance of the exact artifact as O6.2 evidence",
  );
  assert.doesNotMatch(
    solutionProse,
    /O6\.2 passes without any file mutation or executable claim/,
    "the solution must not keep the retired static-only O6.2 pass claim",
  );

  const labTasks = section(labProse, "Tasks");
  assert.match(
    labTasks,
    /### Task 5 — Author and structurally verify your own proposed scope/,
    "Lab 7 must carry the adjacent authoring task that consumes the O6.2 artifact",
  );
  assert.match(
    labTasks,
    /\]\([^)]*06-creating-well-shaped-work\.md(?:#[^)]*)?\)/,
    "the Lab 7 authoring task must name the Module 6 artifact it consumes",
  );
  assert.match(
    labTasks,
    /third record/i,
    "the Lab 7 authoring task must keep both supplied scopes and add the learner record beside them",
  );
  assert.match(
    labTasks,
    /`xbrief:verify` is not a lifecycle move\. Do not promote or activate your scope\./,
    "the Lab 7 authoring task must refuse promotion and activation of the authored scope",
  );
  assert.match(
    labTasks,
    /`xbrief:preflight` and `doctor` are not the authoring-validity pass/,
    "the Lab 7 authoring task must repeat the preflight and doctor refusal",
  );
  assert.match(
    labTasks,
    /grants no promotion, no activation, and no implementation authority/i,
    "the Lab 7 authoring task must state that a green structural result grants no authority",
  );
  assert.match(
    labTasks,
    /adds no Lab 7 outcome/i,
    "the Lab 7 authoring task must not silently create an outcome",
  );
  assert.match(
    labCommands,
    /xbrief:verify\s+--\s+--format json\s+--out\s+"\$authored"\s+--style scope\s+--project-root\s+"\$first_root"/,
    "Lab 7 must run the structural check against the exact learner-authored path inside the guarded root",
  );
  assert.match(labCommands, /authored_exit=\$\?/, "Lab 7 must retain the structural exit code");
  assert.match(
    labCommands,
    /set \+e\n(?:[^\n]*\n)*?authored_exit=\$\?\nset -e/,
    "Lab 7 must suspend errexit around the structural check so a failing exit code survives to be recorded",
  );
  assert.match(
    labCommands,
    /authored_command="[^"]*xbrief:verify[^"]*--out [^"]*--project-root [^"]*"/,
    "Lab 7 must capture the exact structural command, including its artifact path and project root",
  );
  assert.match(
    labCommands,
    /printf '[^']*command=%s[^']*'[^\n]*"\$authored_command"[^\n]*>>/,
    "Lab 7 must persist the exact structural command into the retained evidence record",
  );
  for (const supplied of suppliedScopes) {
    assert.ok(labCommands.includes(supplied), `Lab 7 must keep its supplied scope record: ${supplied}`);
  }
  const authoredBasename = "2026-01-15-your-proposed-scope.xbrief.json";
  const labFile = extra.labFile ?? "";
  const lab7SolutionProse = extra.lab7SolutionProse ?? "";
  for (const [label, text] of [
    ["Lab 7 unix authored assignment", labCommands],
    ["Lab 7 PowerShell $Authored", labFile],
    ["Lab 7 explained solution", lab7SolutionProse],
    ["Module 6 solution Artifact path", solutionProse],
  ]) {
    assert.ok(text.includes(authoredBasename), `${label} must use ${authoredBasename}`);
  }
  assert.match(
    labFile,
    /\$Authored = Join-Path \$LabRoot "xbrief\/proposed\/2026-01-15-your-proposed-scope\.xbrief\.json"/,
    "Lab 7 PowerShell $Authored must use the shared proposed-scope basename",
  );
  assert.doesNotMatch(
    solutionProse,
    /2026-01-15-northstar-delayed-route-preview\.xbrief\.json/,
    "Module 6 solution Artifact path must not keep the walkthrough filename",
  );
}

/**
 * Verify that the Lab 7 explained solution is the comparison surface for Task 5: its question
 * list compares the four retained structural fields, a Task 5 miss is repaired in place rather
 * than retried as a Lab 7 outcome, the adjacency is stated, and every Task 5 boundary clause the
 * lab publishes is restated where the learner reads a green result.
 * @param {string} prose Lab 7 explained-solution prose with code fences removed.
 * @returns {void}
 */
function requireLab7SolutionTask5Contract(prose) {
  const compare = section(prose, "Compare with your attempt");
  const worked = section(prose, "Worked approach");
  assert.match(
    compare,
    /^\s*\d+\.[^\n]*Task 5/m,
    "the Lab 7 solution comparison must ask a numbered Task 5 question, not only name the fields in surrounding prose",
  );
  for (const [pattern, label] of [
    [/\*\*path\*\*/i, "artifact path"],
    [/\*\*command\*\*/i, "exact command"],
    [/\*\*exit code\*\*/i, "exit code"],
    [/\*\*result\*\*/i, "result"],
  ]) {
    assert.match(compare, pattern, `the Lab 7 solution Task 5 comparison must compare the ${label}`);
  }
  assert.doesNotMatch(
    compare,
    /Any\s+[“"]no[”"]\s+identifies the smallest outcome to retry/,
    "a Task 5 miss must not be routed through the blanket Lab 7 outcome retry",
  );
  assert.match(
    compare,
    /Module 6[^\n]{0,160}Part B/,
    "a Task 5 miss must route to Module 6 Part B re-authoring",
  );
  assert.match(
    compare,
    /same `xbrief:verify` command against the same path and retain both exit codes/,
    "a Task 5 miss must rerun the same command against the same path and retain both exit codes",
  );
  assert.match(
    prose,
    /adds no Lab 7 outcome/,
    "the Lab 7 solution must state that Task 5 adds no Lab 7 outcome",
  );
  for (const [pattern, label] of [
    [
      /`xbrief:verify` is not a lifecycle move\. Do not promote or activate your scope\./,
      "verify is not a lifecycle move",
    ],
    [
      /A green structural result grants no promotion, no activation, and no implementation authority\./,
      "a green result grants no promotion, activation, or implementation authority",
    ],
    [
      /`xbrief:preflight` and `doctor` are not the authoring-validity pass\./,
      "preflight and doctor are not the authoring-validity pass",
    ],
    [
      /The structural result does not prove version `0\.8`, proposed status, observable acceptance,\s+or traces\./,
      "a green result does not prove version 0.8, proposed status, observable acceptance, or traces",
    ],
  ]) {
    assert.match(worked, pattern, `the Lab 7 solution worked approach is missing the Task 5 boundary clause: ${label}`);
  }
  assert.doesNotMatch(
    prose,
    /\]\(solutions\/module-06-creating-well-shaped-work\.md(?:#[^)]*)?\)/,
    "the Module 6 cross-link must not use the repository-root path, which does not resolve from solutions/",
  );
  assert.match(
    worked,
    /\]\(module-06-creating-well-shaped-work\.md#structural-record\)/,
    "the Lab 7 solution worked approach must cross-link the Module 6 structural record with the sibling href that resolves from solutions/",
  );
}

function requireModule6Link(content, label) {
  assert.match(content, /\]\([^)]*06-creating-well-shaped-work\.md(?:#[^)]*)?\)/, `${label} is missing Module 6 navigation`);
}

/**
 * Verify the command-free Module 6 curriculum contract without executing lesson content.
 * @param {string} root Absolute or relative path to the curriculum repository.
 * @returns {{artifactCount: number}} Number of required artifacts checked.
 */
export function verifyModule6(root = fileURLToPath(new URL("../", import.meta.url))) {
  assert.equal(typeof root, "string", "repository root must be a path string");
  const content = new Map();
  for (const path of requiredFiles) {
    const absolute = resolve(root, path);
    assert.ok(existsSync(absolute) && statSync(absolute).isFile(), `missing required artifact: ${path}`);
    const body = readFileSync(absolute, "utf8");
    assert.ok(body.trim(), `required artifact is empty: ${path}`);
    content.set(path, body);
  }

  const parsed = new Map();
  for (const [path, headings, recordHeading] of [
    [module6, moduleHeadings, "Module record"],
    [solution6, solutionHeadings, "Solution record"],
  ]) {
    const body = content.get(path);
    assert.doesNotMatch(body, unfinishedMarker, `${path} contains an unfinished author marker`);
    assert.doesNotMatch(body, /"(?:xBRIEFInfo|vBRIEFInfo)"\s*:\s*\{[^}]*"version"\s*:\s*"0\.6"/, `${path} teaches a legacy xBRIEF write envelope`);
    const parts = markdownParts(body);
    parsed.set(path, parts);
    for (const heading of headings) {
      assert.ok(section(parts.prose, heading).trim(), `${path} has an empty section: ${heading}`);
    }
    exactBaseline(path, parts.prose, recordHeading);
    assert.doesNotMatch(parts.prose, /\b(?:Directive behavior|3Ci policy|Course guidance)\b/i, `${path} contains a removed claim label`);
    assert.ok(!parts.blocks.some(({ language }) => shellLanguage.test(language)), `${path} is command-free and must not contain a shell code fence`);
    verifyLinks(root, path, parts.prose);
  }

  const labParts = markdownParts(content.get(lab7));
  const labCommands = labParts.blocks
    .filter(({ language }) => /^(?:sh|bash|zsh|console)$/.test(language))
    .map(({ content: block }) => block)
    .join("\n");

  const moduleProse = parsed.get(module6).prose;
  const solutionProse = parsed.get(solution6).prose;
  requireSectionOutcomes(module6, moduleProse, ["Learning outcomes", "Exercise acceptance", "Completion evidence", "Self-assessment"]);
  requireSectionOutcomes(solution6, solutionProse, ["Outcome map", "Acceptance evidence"]);

  const exercise = section(moduleProse, "Exercise");
  assert.match(
    exercise,
    /^\|?\s*Artifact\s*\|\s*User-visible outcome\s*\|\s*Exclusions\s*\|\s*Literal inspection\s*\|?\s*$/im,
    "Module 6 exercise is missing a required vertical-slice field",
  );
  assert.match(
    exercise,
    /^\|?\s*Order\s*\|\s*Slice\s*\|\s*Dependency rationale\s*\|\s*Boundary rationale\s*\|?\s*$/im,
    "Module 6 exercise is missing a required decomposition rationale",
  );
  assert.match(exercise, /xBRIEFInfo\.version[^\n]{0,20}\b0\.8\b/i, "Module 6 exercise must use schema 0.8");
  assert.match(exercise, /plan\.status[^\n]{0,20}\bproposed\b/i, "Module 6 exercise must keep plan.status proposed");
  assert.match(exercise, /(?:not|no|does not|cannot)\s+(?:grant\s+|provide\s+|create\s+)?implementation authority/i, "Module 6 exercise is missing the proposal authority boundary");
  assert.match(exercise, /bounded strategy choice/i, "Module 6 exercise must require a bounded strategy choice");
  assert.match(exercise, /testable(?:\/observable)? specification statement/i, "Module 6 exercise must require a testable specification statement");
  assert.match(exercise, /two to five (?:concrete )?(?:acceptance )?criteria[^\n]*plan\.items\[\]\.narrative\.Acceptance/i, "Module 6 exercise must require two to five acceptance criteria in plan.items[].narrative.Acceptance");
  assert.match(exercise, /proposed-scope artifact/i, "Module 6 exercise must require a proposed-scope artifact");
  assert.match(exercise, /ordered[^\n]{0,80}independently verifiable slices/i, "Module 6 exercise must require ordered independently verifiable slices");
  const routingHeader = [
    "Fact pattern ID",
    "Controlling supplied fact",
    "Disposition",
    "Proposed mechanism revision",
    "Safe next action",
  ];
  tableRows(exercise, routingHeader, "Module 6 O6.4 routing matrix");
  for (const id of ["M6-ROUTE-01", "M6-NOROUTE-01", "M6-INSUFFICIENT-01"]) {
    assert.ok(hasExactIdentifier(exercise, id), `Module 6 O6.4 is missing fixed fact pattern ${id}`);
  }
  for (const disposition of ["route", "no route", "insufficient evidence"]) {
    assert.ok(hasExactPhrase(exercise, disposition), `Module 6 O6.4 is missing disposition ${disposition}`);
  }
  for (const requirement of [
    /all three rows[^\n]{0,80}(?:required|non-compensating)/i,
    /scenario-specific controlling fact/i,
    /safe next action/i,
    /route[^\n]{0,100}proposed mechanism revision/i,
    /(?:merely repeats|keyword-only)/i,
  ]) {
    assert.match(exercise, requirement, "Module 6 O6.4 must publish the non-compensating semantic rubric");
  }

  const solutionRoutingRows = tableRows(
    section(solutionProse, "Worked approach"),
    routingHeader,
    "Module 6 solution O6.4 routing matrix",
  );
  assert.equal(solutionRoutingRows.length, 3, "Module 6 solution O6.4 routing matrix must contain exactly three rows");
  const solutionRouting = new Map(solutionRoutingRows.map((row) => [row[0], row]));
  assert.deepEqual([...solutionRouting.keys()].sort(), ["M6-INSUFFICIENT-01", "M6-NOROUTE-01", "M6-ROUTE-01"], "Module 6 solution O6.4 must answer each fixed fact pattern exactly once");

  const routeRow = solutionRouting.get("M6-ROUTE-01");
  assert.equal(routeRow?.[2], "route", "M6-ROUTE-01 disposition must be route");
  requireMeaningful(routeRow?.[1] ?? "", "M6-ROUTE-01 controlling fact", 11);
  assert.match(routeRow[1], /NS-INGEST-R2[^\n]*(?:untrusted|agent envelope)[^\n]*clearance|clearance[^\n]*(?:untrusted|agent envelope)[^\n]*NS-INGEST-R2/i, "M6-ROUTE-01 controlling fact must identify the authority and untrusted-input mechanism");
  assert.equal(
    routeRow[3].replaceAll("`", "").trim(),
    "NS-INGEST-R2",
    "M6-ROUTE-01 proposed mechanism revision must be the exact routed-target identifier NS-INGEST-R2, not a redesign sentence",
  );
  requireMeaningful(routeRow[4], "M6-ROUTE-01 safe next action", 11);
  for (const token of ["proposed", "design critique", "promotion", "activation", "implementation"]) {
    assert.ok(routeRow[4].toLowerCase().includes(token), `M6-ROUTE-01 safe next action must name ${token}`);
  }

  const noRouteRow = solutionRouting.get("M6-NOROUTE-01");
  assert.equal(noRouteRow?.[2], "no route", "M6-NOROUTE-01 disposition must be no route");
  requireMeaningful(noRouteRow?.[1] ?? "", "M6-NOROUTE-01 controlling fact", 10);
  assert.match(noRouteRow[1], /error-message phrase[^\n]*(?:behavior|authority)[^\n]*(?:unchanged|stay unchanged)/i, "M6-NOROUTE-01 controlling fact must identify the copy-only boundary");
  assert.match(noRouteRow[3], /^Not applicable\.?$/i, "M6-NOROUTE-01 must not invent a mechanism revision");
  requireMeaningful(noRouteRow[4], "M6-NOROUTE-01 safe next action", 8);
  assert.match(noRouteRow[4], /ordinary proposal review[^\n]*(?:without|no)[^\n]*arc/i, "M6-NOROUTE-01 safe next action must continue ordinary review without inventing an arc");

  const insufficientRow = solutionRouting.get("M6-INSUFFICIENT-01");
  assert.equal(insufficientRow?.[2], "insufficient evidence", "M6-INSUFFICIENT-01 disposition must be insufficient evidence");
  requireMeaningful(insufficientRow?.[1] ?? "", "M6-INSUFFICIENT-01 controlling fact", 9);
  assert.match(insufficientRow[1], /no mechanism[^\n]*target revision[^\n]*authority-boundary/i, "M6-INSUFFICIENT-01 controlling fact must name the missing evidence");
  assert.match(insufficientRow[3], /^Not applicable\.?$/i, "M6-INSUFFICIENT-01 must not invent a mechanism revision");
  requireMeaningful(insufficientRow[4], "M6-INSUFFICIENT-01 safe next action", 9);
  assert.match(insufficientRow[4], /(?:request|shape)[^\n]*missing mechanism[^\n]*(?:rerun|re-evaluat)/i, "M6-INSUFFICIENT-01 safe next action must gather evidence and rerun routing");

  const proposedExamples = parsed.get(solution6).blocks
    .filter(({ language }) => language === "json")
    .map(({ content: block }) => {
      try {
        return JSON.parse(block);
      } catch {
        assert.fail(`${solution6} contains malformed JSON in its worked approach`);
      }
    })
    .filter((example) => example?.xBRIEFInfo?.version === "0.8" && example?.plan?.status === "proposed");
  assert.equal(proposedExamples.length, 1, `${solution6} must contain one schema-0.8 proposed-scope example`);
  const proposedExample = proposedExamples[0];
  assert.ok(typeof proposedExample.plan.title === "string" && proposedExample.plan.title.trim(), `${solution6} worked proposal requires plan.title`);
  const acceptanceItems = proposedExample.plan.items;
  assert.ok(Array.isArray(acceptanceItems) && acceptanceItems.length >= 2 && acceptanceItems.length <= 5, `${solution6} must contain two to five traced acceptance items`);
  for (const item of acceptanceItems) {
    assert.ok(typeof item?.title === "string" && item.title.trim(), `${solution6} worked proposal item title is required`);
    assert.ok(typeof item?.status === "string" && item.status.trim(), `${solution6} worked proposal item status is required`);
    assert.ok(item?.narrative?.Acceptance?.trim() && item?.narrative?.Traces?.trim(), `${solution6} must contain two to five traced acceptance items`);
  }

  requireStructuralEvidenceContract(moduleProse, solutionProse, labParts.prose, labCommands, {
    labFile: content.get(lab7),
    lab7SolutionProse: markdownParts(content.get(lab7Solution)).prose,
  });
  requireLab7SolutionTask5Contract(markdownParts(content.get(lab7Solution)).prose);

  const module5Navigation = section(markdownParts(content.get(module5)).prose, "Navigation");
  requireModule6Link(module5Navigation, "Module 5 navigation");
  const module6Navigation = section(moduleProse, "Navigation");
  assert.match(module6Navigation, /\]\(05-sources-versus-projections\.md(?:#[^)]*)?\)/, "Module 6 navigation must link to Module 5");
  assert.match(module6Navigation, /\]\(\.\.\/README\.md(?:#[^)]*)?\)/, "Module 6 navigation must link to the course map");
  assert.match(module6Navigation, /\]\(07-scope-lifecycle\.md(?:#[^)]*)?\)/, "Module 6 must retain Module 7 navigation");
  assert.match(section(solutionProse, "Continue"), /\]\(\.\.\/curriculum\/modules\/07-scope-lifecycle\.md(?:#[^)]*)?\)/, "Module 6 solution must retain Module 7 navigation");

  const course = content.get("curriculum/README.md");
  const module6Row = course.split("\n").find((line) => line.includes("06-creating-well-shaped-work.md"));
  assert.ok(module6Row && !/\bplanned\b/i.test(module6Row), "Module 6 availability must identify learner-ready curriculum");
  const module7Row = courseModuleRow(course, 7);
  assert.match(module7Row, /07-scope-lifecycle\.md/, "Module 7 course-map navigation must link the lesson");
  assert.doesNotMatch(module7Row, /\|\s*Planned\s*\|/i, "Module 7 course-map navigation must not regress to an unavailable placeholder");
  verifyLinks(root, "curriculum/README.md", markdownParts(course).prose);
  for (const path of ["README.md", "assessments/README.md", "solutions/README.md"]) {
    requireModule6Link(content.get(path), `${path} navigation`);
    verifyLinks(root, path, markdownParts(content.get(path)).prose);
  }
  assert.match(content.get("assessments/README.md"), /\bO6\.4\b/, "assessment map must identify O6.4");
  assert.match(content.get("assessments/README.md"), /route[\s\S]{0,80}no route[\s\S]{0,80}insufficient evidence/i, "assessment map must describe the O6.4 routing artifact");

  const glossary = content.get("references/GLOSSARY.md").toLowerCase();
  for (const term of ["vertical slice", "horizontal plan", "proposed scope"]) {
    assert.ok(glossary.includes(term), `glossary is missing Module 6 term: ${term}`);
  }
  const quickReference = content.get("references/QUICK-REFERENCE.md").toLowerCase();
  for (const phrase of ["bounded strategy choice", "User-visible outcome", "Dependency rationale", "Boundary rationale"]) {
    assert.ok(quickReference.includes(phrase.toLowerCase()), `quick reference is missing Module 6 guidance: ${phrase}`);
  }

  const baseline = content.get("references/SOURCE-BASELINE.md");
  assert.match(baseline, /0\.119\.5/, "source baseline must retain Directive 0.119.5");
  const notes = content.get("references/SOURCE-NOTES.md");
  assert.match(notes, /^## Module 6 (?:source validation|verification)\s*$/m, "SOURCE-NOTES is missing the Module 6 source validation record");
  assert.match(notes, /\b0\.119\.5\b/, "Module 6 source validation must name Directive 0.119.5");
  assert.match(notes, /disagreement/i, "Module 6 source validation must record source disagreements");
  for (const path of sourcePaths) {
    assert.ok(notes.includes(path), `Module 6 source validation is missing pinned source: ${path}`);
  }

  assert.match(content.get("maintainers/CURRICULUM-MAINTENANCE.md"), /npm run check:module-6/, "maintenance contract is missing the Module 6 content check");
  assert.match(content.get("maintainers/CURRICULUM-MAINTENANCE.md"), /node --test scripts\/verify-module-6\.test\.mjs/, "maintenance contract is missing the Module 6 test check");

  const project = JSON.parse(content.get("xbrief/PROJECT-DEFINITION.xbrief.json"));
  assert.equal(project.xBRIEFInfo?.version, "0.8", "PROJECT-DEFINITION must retain xBRIEF 0.8");

  const projectPackage = JSON.parse(content.get("package.json"));
  assert.equal(projectPackage.private, true, "the training package must remain private");
  assertTeachingBaselinePin(projectPackage, content.get("README.md"));
  assert.equal(projectPackage.scripts?.["check:module-6"], "node scripts/verify-module-6.mjs", "package scripts must expose check:module-6");
  assert.equal(projectPackage.scripts?.["test:module-6"], "node --test scripts/verify-module-6.test.mjs", "package scripts must expose test:module-6");
  return { artifactCount: requiredFiles.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { artifactCount } = verifyModule6(process.argv[2]);
  console.log(`Module 6 content contract: ok (${artifactCount} artifacts, 0 missing)`);
}
