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

const module11 = "curriculum/modules/11-review-and-completion.md";
const solution11 = "solutions/module-11-review-and-completion.md";
const scopeFilename = "2026-09-11-module-11-review-and-completion.xbrief.json";
const lifecycleStates = [
  { path: `xbrief/active/${scopeFilename}`, status: "running", folder: "active" },
  { path: `xbrief/completed/${scopeFilename}`, status: "completed", folder: "completed" },
];
const parentScope = "xbrief/proposed/2026-09-05-modules-9-11-implementation-gates-and-review.xbrief.json";
const proposal = "history/changes/module-11-curriculum/proposal.xbrief.json";
const tasks = "history/changes/module-11-curriculum/tasks.xbrief.json";
const requiredFiles = [
  module11,
  solution11,
  "COST-ESTIMATE.md",
  "README.md",
  "CHANGELOG.md",
  "curriculum/README.md",
  "curriculum/capstone-end-to-end.md",
  "curriculum/modules/10-testing-gates-and-evidence.md",
  "labs/README.md",
  "solutions/README.md",
  "solutions/lab-10-testing-gates-and-evidence.md",
  "assessments/README.md",
  "maintainers/CURRICULUM-MAINTENANCE.md",
  "references/GLOSSARY.md",
  "references/QUICK-REFERENCE.md",
  "references/SOURCE-BASELINE.md",
  "references/SOURCE-NOTES.md",
  "package.json",
  "xbrief/PROJECT-DEFINITION.xbrief.json",
  parentScope,
  proposal,
  tasks,
];
const outcomes = ["O11.1", "O11.2", "O11.3", "O11.4"];
const unfinished = /\{\{[^}]+\}\}|\b(?:TODO|TBD|FIXME)\b|Authoring template/i;
const liveReviewDependencies = [
  /^\s*(?:[-*+]\s+|\d+\.\s+)?(?:(?:you\s+(?:must|need to|have to|are required to)|required to)\s+)?(?:open|inspect|query|fetch|connect to|wait for|use|request|require|run|check|poll)\s+(?:(?:the|a)\s+)?(?:live\s+)?(?:GitHub(?:\s+(?:PR|pull request|repository|CI))?|Greptile|review[- ]?bot|review service|CI(?:\s+run)?|repository|deployment(?:\s+(?:system|environment|run|record))?|UAT(?:\s+(?:system|environment|run|record))?|host automation)(?:\s|[.,;:]|$)/im,
  /^\s*(?:[-*+]\s+|\d+\.\s+)?(?:GitHub|Greptile|review[- ]?bot|review service|CI|repository|deployment(?:\s+(?:system|environment|run|record))?|UAT(?:\s+(?:system|environment|run|record))?|host automation)\s+(?:approval|review|signal|status|check|access|connection|run|record)\s+(?:is|are)\s+required\b/im,
];
const contradictoryReviewGuidance = [
  /^(?:(?:\s*[-*+]|\s*\d+\.)\s+)?(?:edit|fix|change)\b[^\n]*before\s+classifying\b/im,
  /^(?:(?:\s*[-*+]|\s*\d+\.)\s+)?(?:push|commit)\b[^\n]*(?:each|per)\s+finding\b/im,
  /^(?:(?:\s*[-*+]|\s*\d+\.)\s+)?(?:treat|call|classify)\b[^\n]*integration(?:-|\s)merge[^\n]*\bdelivered\b/im,
];
const deploymentInference = /^\s*(?:[-*+]\s+|\d+\.\s+)?infer\s+deployment\s+from\s+Git\s+state\b/im;
const uatInference = /^\s*(?:[-*+]\s+|\d+\.\s+)?infer\s+UAT\s+from\s+Git\s+state\b/im;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function subsection(prose, heading, label = heading) {
  const headingMatch = prose.match(new RegExp(`^###\\s+${escapeRegExp(heading)}\\s*$`, "m"));
  assert.ok(headingMatch, `${label} is missing`);
  const rest = prose.slice(headingMatch.index + headingMatch[0].length);
  const nextHeading = rest.search(/^#{2,3}\s+/m);
  return (nextHeading < 0 ? rest : rest.slice(0, nextHeading)).trim();
}

function tableRow(text, id, label, rowKind) {
  const rowPattern = new RegExp(`^\\|\\s*${escapeRegExp(id)}\\s*\\|`);
  const rows = text.split(/\r?\n/).filter((line) => rowPattern.test(line.trim()));
  assert.equal(rows.length, 1, `${label} must contain exactly one ${id} ${rowKind} row`);
  return rows[0].trim().slice(1, -1).split("|").map((cell) => cell.trim());
}

function requireOrdered(text, markers, label) {
  const indexes = markers.map((marker) => text.indexOf(marker));
  assert.ok(
    indexes.every((index) => index >= 0)
      && indexes.every((index, position) => position === 0 || index > indexes[position - 1]),
    `${label} is out of order`,
  );
}

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

function requireModule11Link(content, label) {
  assert.match(content, /\]\([^)]*11-review-and-completion\.md(?:#[^)]*)?\)/, `${label} is missing Module 11 navigation`);
}

/** Read-only verifier for the fixed-state Module 11 review and completion contract. */
export function verifyModule11(root = fileURLToPath(new URL("../", import.meta.url))) {
  assert.equal(typeof root, "string", "repository root must be a path string");
  const presentLifecycleStates = lifecycleStates.filter(({ path }) => {
    const absolute = resolve(root, path);
    return existsSync(absolute) && statSync(absolute).isFile();
  });
  assert.equal(
    presentLifecycleStates.length,
    1,
    "Module 11 must have exactly one active or completed lifecycle scope artifact",
  );
  const lifecycleState = presentLifecycleStates[0];

  const content = new Map();
  for (const path of [...requiredFiles, lifecycleState.path]) {
    const absolute = resolve(root, path);
    assert.ok(existsSync(absolute) && statSync(absolute).isFile(), `missing required artifact: ${path}`);
    const body = readFileSync(absolute, "utf8");
    assert.ok(body.trim(), `required artifact is empty: ${path}`);
    content.set(path, body);
  }
  assert.match(
    content.get("references/SOURCE-NOTES.md"),
    /^## Module 11 source validation\s*$/m,
    "SOURCE-NOTES is missing the Module 11 source validation record",
  );

  assert.ok(!existsSync(resolve(root, "labs/11-review-and-completion.md")), "Module 11 must remain command-free without a lab file");
  assert.ok(!existsSync(resolve(root, "labs/fixtures/11-review-and-completion")), "Module 11 must remain command-free without a fixture");

  const parsed = new Map();
  for (const [path, headings, record] of [
    [module11, moduleHeadings, "Module record"],
    [solution11, solutionHeadings, "Solution record"],
  ]) {
    const body = content.get(path);
    assert.doesNotMatch(body, unfinished, `${path} contains an unfinished author marker`);
    for (const pattern of liveReviewDependencies) {
      assert.doesNotMatch(body, pattern, `${path} contains a live review dependency`);
    }
    for (const pattern of contradictoryReviewGuidance) {
      assert.doesNotMatch(body, pattern, `${path} contains contradictory review guidance`);
    }
    assert.doesNotMatch(body, deploymentInference, `${path} contains a deployment inference`);
    assert.doesNotMatch(body, uatInference, `${path} contains a UAT inference`);
    const parts = markdownParts(body);
    parsed.set(path, parts);
    for (const heading of headings) assert.ok(section(parts.prose, heading).trim(), `${path} has an empty section: ${heading}`);
    exactBaseline(path, parts.prose, record);
    assert.doesNotMatch(parts.prose, /\b(?:Directive behavior|3Ci policy|Course guidance)\b/i, `${path} contains a removed claim label`);
    const executableBlocks = parts.blocks.filter(({ language }) => /^(?:sh|shell|bash|zsh|powershell|pwsh|console)$/.test(language));
    assert.equal(executableBlocks.length, 0, `${path} must remain a command-free exercise`);
    verifyLinks(root, path, parts.prose);
  }

  const moduleProse = parsed.get(module11).prose;
  requireOutcomes(module11, moduleProse, ["Learning outcomes", "Completion evidence", "Self-assessment"]);
  for (const heading of ["Learning outcomes", "Guided explanation"]) {
    assert.ok(
      section(moduleProse, heading).includes("Read -> Write -> Lint -> Diff -> Loop"),
      `${module11} has an incorrect pre-PR sequence in ${heading}`,
    );
  }
  requireOrdered(
    moduleProse,
    ["### Pre-PR record", "### H1 review evidence card", "### Review findings on H1", "## Exercise"],
    `${module11} review packet sequence`,
  );
  for (const phrase of [
    "fixed fictional packet",
    "Pass A",
    "Pass B",
    "zero-change",
    "current `task check` evidence",
    "Severity | Acceptance scope | Merge-blocking | Disposition | Evidence",
    "src/average.mjs",
    "test/average.test.mjs",
    "README.md",
    "docs/output-contract.md",
    "tmp/manual-output.txt",
    "H1",
    "H2",
  ]) assert.ok(moduleProse.includes(phrase), `${module11} is missing fixed review guidance: ${phrase}`);
  assert.ok(
    moduleProse.includes("Classify all four findings before proposing any edit."),
    `${module11} is missing the classification-before-editing rule`,
  );
  for (const finding of ["F1", "F2", "F3", "F4"]) {
    assert.match(moduleProse, new RegExp(`\\b${finding}\\b`), `${module11} is missing supplied finding ${finding}`);
  }
  for (const card of ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9"]) {
    assert.match(moduleProse, new RegExp(`\\b${card}\\b`), `${module11} is missing completion card ${card}`);
  }
  const exercise = section(moduleProse, "Exercise");
  const prePrWorksheet = subsection(exercise, "Worksheet A — pre-PR loop", "pre-PR worksheet");
  for (const pass of ["Pass A", "Pass B"]) {
    const cells = tableRow(prePrWorksheet, pass, "pre-PR worksheet", "decision");
    assert.equal(cells.length, 3, `pre-PR worksheet ${pass} row must have three cells`);
    assert.ok(cells.slice(1).every((cell) => cell === ""), `pre-PR worksheet ${pass} answers must remain blank`);
  }
  assert.match(moduleProse, /configured secret value/i, `${module11} must establish the supplied P0 impact`);
  assert.match(moduleProse, /value is redacted/i, `${module11} must keep the fictional secret value redacted`);
  assert.match(section(moduleProse, "Navigation"), /\]\(10-testing-gates-and-evidence\.md\)/, "Module 11 must link back to Module 10");
  assert.match(section(moduleProse, "Navigation"), /\]\(\.\.\/capstone-end-to-end\.md\)/, "Module 11 must link forward to the learner-ready capstone");
  assert.doesNotMatch(section(moduleProse, "Navigation"), /\b(?:planned|not learner-ready|not yet available)\b/i, "Module 11 capstone link must remain learner-ready");

  const solutionProse = parsed.get(solution11).prose;
  requireOutcomes(solution11, solutionProse, ["Outcome map", "Acceptance evidence"]);
  const workedApproach = section(solutionProse, "Worked approach");
  requireOrdered(
    workedApproach,
    ["### Pre-PR decision", "### Finding classification", "### One coherent H1-to-H2 batch", "### Completion classifications"],
    `${solution11} worked-answer sequence`,
  );
  const prePrDecision = subsection(workedApproach, "Pre-PR decision");
  const passA = tableRow(prePrDecision, "Pass A", "pre-PR decision", "decision");
  const passB = tableRow(prePrDecision, "Pass B", "pre-PR decision", "decision");
  assert.equal(passA.length, 3, "Pass A decision row must have three cells");
  assert.equal(passA[1], "Restart at Read", "Pass A must restart at Read");
  assert.ok(passA[2], "Pass A must cite restart evidence");
  assert.equal(passB.length, 3, "Pass B decision row must have three cells");
  assert.equal(passB[1], "Exit pre-PR", "Pass B must exit pre-PR");
  assert.ok(passB[2], "Pass B must cite exit evidence");

  const classificationTable = subsection(workedApproach, "Finding classification");
  assert.match(
    classificationTable,
    /^\| Finding \| Severity \| Acceptance scope \| Merge-blocking \| Disposition \| Evidence \|$/m,
    `${solution11} has an incorrect finding-classification header`,
  );
  const classifications = [
    {
      id: "F1",
      cells: ["F1", "P0", "In scope", "Yes", "Fix in current batch"],
      evidence: [/configured secret value/i, /REPORT_TOKEN/],
    },
    {
      id: "F2",
      cells: ["F2", "P1", "In scope", "Yes", "Fix in current batch"],
      evidence: [/documented output term/i, /disagrees across files/i],
    },
    {
      id: "F3",
      cells: ["F3", "P2", "In scope", "No", "Defer"],
      evidence: [/changed line in scoped source/i, /violates no acceptance behavior/i],
    },
    {
      id: "F4",
      cells: ["F4", "P2", "Out of scope", "No", "Separate scope"],
      evidence: [/CSV support/i, /outside the acceptance criteria/i],
    },
  ];
  for (const expected of classifications) {
    const cells = tableRow(classificationTable, expected.id, "finding classification", "classification");
    assert.equal(cells.length, 6, `${solution11} has an incorrect ${expected.id} classification`);
    assert.deepEqual(cells.slice(0, 5), expected.cells, `${solution11} has an incorrect ${expected.id} classification`);
    assert.ok(cells[5], `${solution11} has missing ${expected.id} evidence`);
    for (const pattern of expected.evidence) {
      assert.match(cells[5], pattern, `${solution11} has incorrect ${expected.id} evidence`);
    }
  }
  assert.equal(
    classificationTable.split(/\r?\n/).filter((line) => /^\|\s*F\d+\s*\|/.test(line)).length,
    4,
    `${solution11} must contain exactly four supplied finding rows`,
  );
  assert.ok(
    solutionProse.includes("one coherent batch, not one push per finding"),
    `${solution11} is missing coherent fix-batch guidance`,
  );
  for (const phrase of [
    "cross-file term search",
    "structured data",
    "A review of H1 is stale after H2 exists",
    "fresh review of H2",
    "one H2 commit and one push",
    "another coherent batch iteration",
  ]) assert.ok(solutionProse.includes(phrase), `${solution11} is missing current-head batch evidence: ${phrase}`);
  assert.match(
    solutionProse,
    /Do not push again while that\s+H2 review is in progress\./,
    `${solution11} is missing no-push-during-review guidance`,
  );

  const completionTable = subsection(workedApproach, "Completion classifications");
  assert.match(
    completionTable,
    /^\| Card \| Fixed evidence \| Git\/review\/delivery result \| Deployment axis \| UAT axis \| Missing evidence \|$/m,
    `${solution11} has an incorrect completion-classification header`,
  );
  const completionRows = [
    { id: "C1", evidence: /Local diff and acceptance evidence; no PR/, axes: ["Implemented", "Unknown", "Unknown"] },
    { id: "C2", evidence: /PR exists at H1; required checks and review are incomplete/, axes: ["PR-open; not merge-ready", "Unknown", "Unknown"] },
    { id: "C3", evidence: /H2 checks pass; only H1 was reviewed/, axes: ["Not merge-ready", "Unknown", "Unknown"] },
    { id: "C4", evidence: /H2 checks pass; fresh H2 review has zero unresolved P0 or P1 findings/, axes: ["Merge-ready", "Unknown", "Unknown"] },
    { id: "C5", evidence: /Merged to `develop`; delivery branch is `main`/, axes: ["Integration-merged; not delivered", "Unknown", "Unknown"] },
    { id: "C6", evidence: /Commit is reachable from `origin\/main`; lifecycle scope remains active/, axes: ["Reachable on delivery branch; not delivered", "Unknown", "Unknown"] },
    { id: "C7", evidence: /Commit is reachable from `origin\/main`; lifecycle closeout records delivered provenance/, axes: ["Delivered", "Unknown", "Unknown"] },
    { id: "C8", evidence: /C7 evidence plus a deployment record tying H2 to `training-staging`; no UAT evidence/, axes: ["Delivered", "Deployed in `training-staging`", "Unknown"] },
    { id: "C9", evidence: /C7 evidence plus an authorized UAT record for `training-staging`; no deployment record/, axes: ["Delivered", "Unknown", "UAT-verified in `training-staging`"] },
  ];
  for (const expected of completionRows) {
    const classification = expected.id === "C3"
      ? "stale-review classification"
      : expected.id === "C4"
        ? "merge-ready classification"
        : expected.id === "C5"
          ? "integration classification"
          : expected.id === "C6"
            ? "delivery classification"
            : expected.id === "C8"
              ? "completion axes"
              : "completion classification";
    const message = `${solution11} has an incorrect ${expected.id} ${classification}`;
    const cells = tableRow(completionTable, expected.id, "completion classifications", "completion");
    assert.equal(cells.length, 6, message);
    assert.match(cells[1], expected.evidence, message);
    assert.deepEqual(cells.slice(2, 5), expected.axes, message);
    assert.ok(cells[5], `${solution11} has missing ${expected.id} completion evidence`);
  }
  assert.equal(
    completionTable.split(/\r?\n/).filter((line) => /^\|\s*C\d+\s*\|/.test(line)).length,
    9,
    `${solution11} must contain exactly nine completion rows`,
  );
  assert.match(solutionProse, /Deployment is an independent evidence axis; Git delivery does not prove it\./, `${solution11} must separate deployment evidence`);
  assert.match(solutionProse, /UAT is an independent evidence axis; Git delivery does not prove it\./, `${solution11} must separate UAT evidence`);
  assert.match(
    section(solutionProse, "Continue"),
    /\]\(\.\.\/curriculum\/capstone-end-to-end\.md\)/,
    "Module 11 solution must continue to the learner-ready capstone",
  );

  const course = content.get("curriculum/README.md");
  const module11Row = courseModuleRow(course, 11);
  assert.match(
    module11Row,
    /\[PR, review, and actual completion\]\(modules\/11-review-and-completion\.md\)/,
    "Module 11 course row must link the lesson",
  );
  assert.match(module11Row, /\|\s*Learner-ready\b/i, "Module 11 course row must be learner-ready");
  assert.match(module11Row, /command-free/i, "Module 11 course row must identify the command-free exercise");
  const capstone = section(markdownParts(course).prose, "Capstone");
  assert.match(capstone, /learner-ready/i, "capstone must remain learner-ready");
  assert.match(capstone, /\]\(capstone-end-to-end\.md\)/, "course map must link the learner-ready capstone");
  assert.doesNotMatch(capstone, /\b(?:planned|not yet available|not learner-ready)\b/i, "capstone must remain learner-ready");

  for (const path of [
    "README.md",
    "curriculum/README.md",
    "curriculum/modules/10-testing-gates-and-evidence.md",
    "labs/README.md",
    "solutions/README.md",
    "solutions/lab-10-testing-gates-and-evidence.md",
    "assessments/README.md",
  ]) {
    requireModule11Link(content.get(path), path);
    verifyLinks(root, path, markdownParts(content.get(path)).prose);
  }
  assert.match(content.get("labs/README.md"), /Module 11[^\n]*command-free/i, "labs index must explain Module 11 has no lab fixture");

  for (const term of ["pre-PR review", "current-head review", "merge-ready", "delivery branch", "UAT-verified"]) {
    assert.match(content.get("references/GLOSSARY.md"), new RegExp(term, "i"), `glossary is missing Module 11 term: ${term}`);
  }
  for (const phrase of ["Read -> Write -> Lint -> Diff -> Loop", "classify all findings", "one coherent fix batch", "zero unresolved P0 or P1", "delivery-branch reachability"]) {
    assert.ok(content.get("references/QUICK-REFERENCE.md").includes(phrase), `quick reference is missing Module 11 guidance: ${phrase}`);
  }
  const baseline = content.get("references/SOURCE-BASELINE.md");
  assert.match(baseline, /^## Module 11 review-and-completion validation\s*$/m, "source baseline is missing Module 11 validation");
  const notes = content.get("references/SOURCE-NOTES.md");
  const authoringEnvironmentPatterns = [
    /default unqualified\s+shell CLI reported\s+engine 0\.114\.0/i,
    /Final\s+authoring gates explicitly selected the NVM-managed\s+CLI,\s+which reported engine\s+0\.116\.0,\s+to match/i,
    /to match the\s+current 0\.116\.0 deposit/i,
  ];
  const costScope = section(content.get("COST-ESTIMATE.md"), "Current scope — Module 11 and capstone (2026-09-10)");
  const releaseIdentity = section(baseline, "Release identity");
  const baselineModule11 = section(baseline, "Module 11 review-and-completion validation");
  const verificationContext = section(notes, "Verification context");
  const module11Notes = section(notes, "Module 11 source validation");
  for (const [label, source, learnerPinPattern] of [
    ["COST-ESTIMATE current Module 11 scope", costScope, /project remains pinned to Directive 0\.112\.0 for learner-facing claims/i],
    ["SOURCE-BASELINE release identity", releaseIdentity, /Consumer project pin[^\n]*@deftai\/directive: 0\.112\.0/i],
    ["SOURCE-BASELINE Module 11 validation", baselineModule11, /learner pin remains exactly 0\.112\.0/i],
    ["SOURCE-NOTES verification context", verificationContext, /Project direct pin:[^\n]*0\.112\.0/i],
    ["SOURCE-NOTES Module 11 validation", module11Notes, /learner baseline remains 0\.112\.0/i],
  ]) {
    assert.match(source, learnerPinPattern, `${label} is missing the Module 11 version-role distinction: learner pin 0.112.0`);
  }
  for (const [label, source] of [
    ["COST-ESTIMATE current Module 11 scope", costScope],
    ["SOURCE-NOTES verification context", verificationContext],
    ["SOURCE-NOTES Module 11 validation", module11Notes],
  ]) {
    for (const pattern of authoringEnvironmentPatterns) {
      assert.match(source, pattern, `${label} is missing the Module 11 version-role distinction: ${pattern}`);
    }
    assert.doesNotMatch(
      source,
      /authoring engine and deposit (?:were )?0\.116\.0/i,
      `${label} must not collapse the default CLI, selected CLI, and deposit versions`,
    );
  }
  for (const [label, source] of [
    ["SOURCE-BASELINE release identity", releaseIdentity],
    ["SOURCE-BASELINE Module 11 validation", baselineModule11],
  ]) {
    assert.match(source, /maintainer(?:-only)? (?:source notes|evidence)|maintainer source notes/i, `${label} must route authoring drift to maintainer notes`);
    assert.doesNotMatch(
      source,
      /(?:0\.113\.0|0\.114\.0|0\.116\.0|0\.117\.0)/,
      `${label} must keep authoring-runtime versions out of the learner baseline`,
    );
  }
  assert.match(releaseIdentity, /Historical learner proof at 0\.112\.0/, "SOURCE-BASELINE release identity must time-bound the learner package graph");
  assert.match(releaseIdentity, /historical Module 7 local binary/, "SOURCE-BASELINE release identity must time-bound the learner runtime report");

  for (const label of [
    "Historical learner-baseline executable context",
    "Historical learner-baseline installed package graph",
    "Historical learner-baseline deposit proof",
  ]) assert.ok(verificationContext.includes(label), `SOURCE-NOTES verification context is missing historical learner-baseline context: ${label}`);
  const historicalProbes = section(notes, "Historical 0.112.0 learner-baseline version and provenance probes");
  assert.match(historicalProbes, /not a\s+current authoring-environment report/i, "SOURCE-NOTES historical probes must be time-bounded");
  for (const pattern of [
    /@deftai\/directive: 0\.112\.0/,
    /@deftai\/directive-core@0\.112\.0/,
    /CLI package version 0\.112\.0/,
    /Deposit surfaces say 0\.112\.0/,
  ]) assert.match(historicalProbes, pattern, `SOURCE-NOTES historical learner-baseline value is missing: ${pattern}`);
  assert.doesNotMatch(historicalProbes, /0\.114\.0|0\.116\.0/, "SOURCE-NOTES historical learner-baseline probes must not contain current authoring versions");

  for (const pattern of liveReviewDependencies) {
    assert.doesNotMatch(module11Notes, pattern, "SOURCE-NOTES Module 11 record contains a live review dependency");
  }
  for (const token of [
    "learner baseline remains 0.112.0",
    "7fe1a285cda8c19ad468d4aa4ca9a8b2cd420808",
    "content/skills/deft-directive-pre-pr/SKILL.md",
    "f60a8eaee395cc65d550b95fab6da8348817de023c3f63accebfbdfc88eeea42",
    "content/skills/deft-directive-review-cycle/SKILL.md",
    "ff0337151f6f545999367df87a307c3892707df79ffdadeb06c6ef2c10f15082",
    "content/coding/review.md",
    "f00e769f61d6be1494294d334c30983b07716bcc41584524424069f7e0d3b8bf",
    "content/docs/directive-lifecycle.md",
    "14ea6bfd92cc8d49bdce173206f4d73670e24c87abdb0bf620b6bbe218799c52",
    "Greptile is disabled",
    "no live review bot",
  ]) assert.ok(module11Notes.includes(token), `SOURCE-NOTES Module 11 evidence is missing: ${token}`);

  assert.match(content.get("maintainers/CURRICULUM-MAINTENANCE.md"), /npm run check:module-11/, "maintenance contract is missing the Module 11 content check");
  assert.match(content.get("maintainers/CURRICULUM-MAINTENANCE.md"), /npm run test:module-11/, "maintenance contract is missing the Module 11 negative tests");
  assert.match(content.get("CHANGELOG.md"), /Module 11[^\n]*review/i, "CHANGELOG is missing the Module 11 delivery note");

  const project = JSON.parse(content.get("xbrief/PROJECT-DEFINITION.xbrief.json"));
  const projectItems = project.plan.items.filter((item) => item.id === "2026-09-11-module-11-review-and-completion");
  assert.equal(projectItems.length, 1, "PROJECT-DEFINITION must register Module 11 exactly once");
  const projectItem = projectItems[0];
  assert.equal(projectItem.status, lifecycleState.status, "PROJECT-DEFINITION Module 11 status must match its lifecycle scope");
  assert.equal(projectItem.metadata?.lifecycle_folder, lifecycleState.folder, "PROJECT-DEFINITION Module 11 folder must match its lifecycle scope");
  assert.equal(projectItem.metadata?.source_path, `${lifecycleState.folder}/${scopeFilename}`, "PROJECT-DEFINITION Module 11 source path must match its lifecycle scope");

  const scope = JSON.parse(content.get(lifecycleState.path));
  assert.equal(scope.plan?.status, lifecycleState.status, "Module 11 scope folder and status must agree");
  assert.deepEqual(
    scope.plan?.acceptance?.commands,
    ["npm run check:module-11", "npm run test:module-11", "directive verify:vbrief-conformance --project-root ."],
    "Module 11 literal acceptance commands changed",
  );
  const parent = JSON.parse(content.get(parentScope));
  assert.equal(parent.plan?.status, "proposed", "Modules 9-11 parent phase remains proposed record state");
  assert.ok(parent.plan?.references?.some(({ uri }) => uri === `${lifecycleState.folder}/${scopeFilename}`), "parent phase Module 11 reference must match lifecycle state");
  assert.equal(JSON.parse(content.get(proposal)).plan?.status, "approved", "Module 11 change proposal must remain approved");
  assert.equal(JSON.parse(content.get(tasks)).plan?.status, "approved", "Module 11 change tasks must remain approved");

  const projectPackage = JSON.parse(content.get("package.json"));
  assert.equal(projectPackage.scripts?.["check:module-11"], "node scripts/verify-module-11.mjs", "package scripts must expose check:module-11");
  assert.equal(projectPackage.scripts?.["test:module-11"], "node --test scripts/verify-module-11.test.mjs", "package scripts must expose test:module-11");
  assert.equal(projectPackage.devDependencies?.["@deftai/directive"], "0.112.0", "training package must retain exact Directive pin");
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
