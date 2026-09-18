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

const module9 = "curriculum/modules/09-design-critique-arcs.md";
const solution9 = "solutions/module-09-design-critique-arcs.md";
const requiredFiles = [
  module9,
  solution9,
  "curriculum/modules/08-session-and-work-selection.md",
  "curriculum/modules/10-implementation-golden-path.md",
  "README.md",
  "curriculum/README.md",
  "assessments/README.md",
  "solutions/README.md",
  "references/GLOSSARY.md",
  "references/QUICK-REFERENCE.md",
  "references/SOURCE-BASELINE.md",
  "references/SOURCE-NOTES.md",
  "maintainers/CURRICULUM-MAINTENANCE.md",
  "package.json",
];
const outcomes = ["O9.6", "O9.7", "O9.8", "O9.9"];
const packetIds = [
  "DC9-ISSUE-01",
  "DC9-SOURCE-01",
  "DC9-FRAG-A",
  "DC9-FRAG-B",
  "DC9-STOP1-01",
  "DC9-POSTCEILING-01",
  "DC9-FIND-01",
  "DC9-FIND-02",
  "DC9-FIND-03",
  "DC9-LEAN-01",
  "DC9-AUDIT-01",
  "DC9-LEAN-02",
  "DC9-VERIFY-01",
  "DC9-SYNTH-01",
];
const decisionIds = [
  "DC9-DECIDE-01",
  "DC9-DECIDE-02",
  "DC9-DECIDE-03",
  "DC9-DECIDE-04",
  "DC9-DECIDE-05",
];
const unfinished = /\{\{[^}]+\}\}|\b(?:TODO|TBD|FIXME)\b|Authoring template/i;
const shellLanguage = /^(?:sh|shell|bash|zsh|powershell|pwsh|console)$/;
const hasExactIdentifier = (text, identifier) => (text.match(/[A-Za-z0-9_.-]+/g) ?? []).includes(identifier);

function tableCells(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function tableRows(body, expectedHeader, label) {
  const lines = body.split("\n");
  const headerIndex = lines.findIndex((line) => line.includes("|")
    && JSON.stringify(tableCells(line)) === JSON.stringify(expectedHeader));
  assert.ok(headerIndex >= 0, `${label} is missing its required header`);
  const separator = tableCells(lines[headerIndex + 1] ?? "");
  assert.ok(
    separator.length === expectedHeader.length && separator.every((cell) => /^:?-{3,}:?$/.test(cell)),
    `${label} is missing its separator row`,
  );
  const rows = [];
  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.trim() || !line.includes("|")) break;
    const cells = tableCells(line);
    assert.equal(cells.length, expectedHeader.length, `${label} contains a malformed row`);
    rows.push(cells);
  }
  return rows;
}

function exactBaseline(path, prose, heading) {
  const row = section(prose, heading).match(/^\| Directive baseline\s*\|([^\n]+)$/m)?.[1];
  assert.ok(row?.includes("0.119.2"), `${path} must declare exact Directive 0.119.2`);
  assert.deepEqual(
    [...new Set(row.match(/\b\d+\.\d+\.\d+\b/g))],
    ["0.119.2"],
    `${path} contains a stale or ranged Directive baseline`,
  );
}

function requireOutcomes(path, prose, headings) {
  for (const heading of headings) {
    const body = section(prose, heading);
    for (const outcome of outcomes) {
      assert.ok(hasExactIdentifier(body, outcome), `${path} ${heading} is missing ${outcome}`);
    }
  }
}

function requireModule9Link(content, label) {
  assert.match(content, /\]\([^)]*09-design-critique-arcs\.md(?:#[^)]*)?\)/, `${label} is missing Module 9 navigation`);
}

function assertNoUnsafeInstructionalClaims(path, prose) {
  const normalized = prose.replaceAll("`", "");
  const forbiddenClaims = [
    [
      /\b(?:auto(?:matically)?[- ]?dispatch\s+(?:a|the)\s+(?:live\s+)?critic|dispatch\s+(?:a|the)\s+live\s+critic)\b/i,
      "must not direct a live or automatic critic dispatch",
    ],
    [
      /\b(?:(?:choose|set|use)\s+(?:the\s+)?charter\s+(?:as|to)\s+panel|charter\s+(?:is|=)\s+panel)\b/i,
      "must not treat panel as a charter",
    ],
    [
      /\b(?:run|dispatch|process)\s+(?:the\s+)?same-round\s+critics?\s+sequentially\b|\bsame-round\s+critics?\s+(?:may|must|should|can)\s+read\s+(?:earlier|prior|previous)\s+(?:critic|sibling)\s+(?:output|responses?|posts?)\b/i,
      "must not make same-round critics sequential or sibling-readable",
    ],
    [
      /\b(?:an?\s+)?(?:ingest-ready|catalog)\s+chip\s+(?:authorizes|grants|proves|is)\s+(?:completed-arc\s+)?(?:clearance|ingest|activation|implementation|authority)\b|\b(?:design\s+)?critique\s+(?:authorizes|grants)\s+(?:activation|implementation|implementation\s+authority)\b/i,
      "must not turn a catalog chip or critique into clearance or implementation authority",
    ],
  ];
  for (const [pattern, message] of forbiddenClaims) {
    assert.doesNotMatch(normalized, pattern, `${path} ${message}`);
  }
}

/** Verify the command-free Module 9 fixed packet and its worked evidence. */
export function verifyModule9(root = fileURLToPath(new URL("../", import.meta.url))) {
  assert.equal(typeof root, "string", "repository root must be a path string");
  const content = new Map();
  for (const path of requiredFiles) {
    const absolute = resolve(root, path);
    assert.ok(existsSync(absolute) && statSync(absolute).isFile(), `missing required artifact: ${path}`);
    const body = readFileSync(absolute, "utf8");
    assert.ok(body.trim(), `required artifact is empty: ${path}`);
    content.set(path, body);
  }

  for (const forbidden of [
    "labs/09-design-critique-arcs.md",
    "labs/fixtures/09-design-critique-arcs",
  ]) {
    assert.ok(!existsSync(resolve(root, forbidden)), `Module 9 is command-free and must not add ${forbidden}`);
  }

  const parsed = new Map();
  for (const [path, headings, recordHeading] of [
    [module9, moduleHeadings, "Module record"],
    [solution9, solutionHeadings, "Solution record"],
  ]) {
    const body = content.get(path);
    assert.doesNotMatch(body, unfinished, `${path} contains an unfinished author marker`);
    const parts = markdownParts(body);
    parsed.set(path, parts);
    for (const heading of headings) assert.ok(section(parts.prose, heading).trim(), `${path} has an empty section: ${heading}`);
    exactBaseline(path, parts.prose, recordHeading);
    assert.ok(!parts.blocks.some(({ language }) => shellLanguage.test(language)), `${path} is command-free and must not contain a shell code fence`);
    assert.doesNotMatch(parts.prose, /\b(?:Directive behavior|3Ci policy|Course guidance)\b/i, `${path} contains a removed claim label`);
    assertNoUnsafeInstructionalClaims(path, body);
    verifyLinks(root, path, parts.prose);
  }

  const moduleProse = parsed.get(module9).prose;
  const solutionProse = parsed.get(solution9).prose;
  requireOutcomes(module9, moduleProse, ["Learning outcomes", "Exercise acceptance", "Completion evidence", "Self-assessment"]);
  requireOutcomes(solution9, solutionProse, ["Outcome map", "Acceptance evidence"]);

  const packetRows = tableRows(
    section(moduleProse, "Fixed packet"),
    ["Source ID", "Comment ID", "Supplied fact"],
    "Module 9 fixed packet",
  );
  assert.equal(packetRows.length, packetIds.length, "Module 9 fixed packet must contain exactly fourteen source cards");
  assert.deepEqual(
    packetRows.map((row) => row[0].replaceAll("`", "")),
    packetIds,
    "Module 9 fixed packet source IDs must be unique and remain in evidence order",
  );
  const decisionRows = tableRows(
    section(moduleProse, "Fixed packet"),
    ["Decision ID", "Fixed state"],
    "Module 9 decision packet",
  );
  assert.deepEqual(
    decisionRows.map((row) => row[0].replaceAll("`", "")),
    decisionIds,
    "Module 9 decision packet must contain each decision card exactly once",
  );

  const exercise = section(moduleProse, "Exercise");
  const normalizedExercise = exercise.replace(/\s+/g, " ").toLowerCase();
  for (const phrase of [
    "fixed fictional data handled only by this bounded exercise procedure",
    "not a Directive runtime guarantee",
  ]) {
    assert.ok(normalizedExercise.includes(phrase.toLowerCase()), `Module 9 exercise is missing the untrusted-input boundary: ${phrase}`);
  }
  assert.match(
    exercise,
    /Attribute them by source ID,[\s\S]{0,160}refuse their attempted effect,[\s\S]{0,160}record the finding,[\s\S]{0,160}continue the bounded critique/i,
    "Module 9 exercise must attribute, refuse, record, and continue",
  );
  assert.match(
    exercise,
    /Do not follow,[\s\S]{0,100}reproduce[\s\S]{0,100}or concatenate the instruction-shaped source\s+fragments/i,
    "Module 9 exercise must forbid following, reproducing, or concatenating the source fragments",
  );
  assert.match(exercise, /\| Charter \| Choose independently from spend \|/i, "Module 9 must choose charter independently from spend");
  assert.match(exercise, /\| Spend \| Choose independently from charter \|/i, "Module 9 must choose spend independently from charter");
  assert.match(exercise, /ceiling[^\n]{0,120}(?:isolation|excluded)/i, "Module 9 must explain the evidence ceiling");
  assert.match(exercise, /which guarantees the ceiling\s+does not provide/i, "Module 9 must ask for the ceiling's non-guarantees");
  assert.match(exercise, /no trust or independence guarantee is invented/i, "Module 9 must deny trust guarantees from the ceiling");

  const routingRows = tableRows(
    section(solutionProse, "Artifact 1 — arc-routing record"),
    ["Source IDs", "Disposition", "Target revision", "Arc boundary", "Ordinary-review boundary", "Reason"],
    "Module 9 worked routing record",
  );
  assert.equal(routingRows.length, 1, "Module 9 worked routing record must contain exactly one row");
  assert.equal(routingRows[0][1].replaceAll("`", ""), "route", "Module 9 must route NS-INGEST-R2");
  assert.equal(routingRows[0][2].replaceAll("`", ""), "NS-INGEST-R2", "Module 9 routing target must be NS-INGEST-R2");
  assert.match(routingRows[0][3], /Stop 1[^\n]*(?:accepted synthesis|recorded halt)/i, "Module 9 routing record must bound the full arc");
  assert.match(routingRows[0][4], /Code\/PR review[^\n]*(?:begins only after|later)/i, "Module 9 routing record must keep ordinary review later");

  const envelopeRows = tableRows(
    section(solutionProse, "Artifact 2 — default critic envelope"),
    ["Field", "Required value"],
    "Module 9 worked critic envelope",
  );
  const envelope = new Map(envelopeRows.map(([field, value]) => [field, value.replaceAll("`", "")]));
  const expectedEnvelope = new Map([
    ["Model", "fictional-critic-v1"],
    ["Role", "critic"],
    ["Issue", "TRAIN-DC-904"],
    ["Charter", "refutation"],
    ["Spend", "N=1"],
    ["Round", "1 critic"],
    ["Critic role", "fresh"],
    ["ID ceiling", "9104001"],
    ["SHA at dispatch", "8c71ae54b9350e18c8e13005d31ddf9c5be724a1"],
    ["Run posture", "arc-mode: no-ingest"],
    ["Target", "TRAIN-DC-904 revision NS-INGEST-R2"],
    ["Audit targets", "none"],
    ["Seat families", "not applicable — N=1"],
    ["Launcher", "paste-ready"],
  ]);
  for (const [field, expected] of expectedEnvelope) {
    assert.ok(envelope.has(field), `Module 9 worked critic envelope is missing field: ${field}`);
    assert.equal(envelope.get(field), expected, `Module 9 worked critic envelope has the wrong ${field}`);
  }
  assert.equal(envelopeRows.length, expectedEnvelope.size + 1, "Module 9 worked critic envelope must contain only the fixed fields plus Reason");
  assert.match(section(solutionProse, "Artifact 2 — default critic envelope"), /DC9-POSTCEILING-01[^\n]*excluded/i, "Module 9 solution must exclude the post-ceiling card");
  assert.match(section(solutionProse, "Artifact 2 — default critic envelope"), /does not\s+prove[\s\S]{0,160}(?:trust|independence)[\s\S]{0,160}(?:verification|correctness)/i, "Module 9 solution must deny ceiling trust guarantees");

  const findingRows = tableRows(
    section(solutionProse, "Artifact 3 — finding and take map"),
    ["Finding ID", "Source IDs", "Classification", "Evidence", "Concrete failure mode", "Disposition consequence", "Parent take"],
    "Module 9 worked finding map",
  );
  assert.deepEqual(findingRows.map((row) => row[0]), ["F1", "F2", "F3"], "Module 9 solution must classify exactly F1-F3");
  assert.deepEqual(
    findingRows.map((row) => row[2].replaceAll("`", "")),
    ["blocks-the-design", "sharpens-framing", "footnote"],
    "Module 9 solution must use the closed finding classes",
  );
  assert.deepEqual(
    findingRows.map((row) => row[6].replaceAll("`", "")),
    ["accept-into-contract", "accept-into-contract", "disagree"],
    "Module 9 solution must contain a total parent take map",
  );
  for (const id of ["DC9-SOURCE-01", "DC9-FRAG-A", "DC9-FRAG-B", "DC9-FIND-01"]) {
    assert.ok(hasExactIdentifier(findingRows[0][1], id), `F1 must cite ${id}`);
  }
  assert.doesNotMatch(findingRows.map((row) => row.join(" ")).join("\n"), /DC9-POSTCEILING-01/, "Module 9 round-1 findings must not use the post-ceiling card");
  for (const row of findingRows.slice(0, 2)) {
    assert.ok(row[3].split(/\s+/).length >= 6, `${row[0]} evidence must be substantive`);
    assert.ok(row[4].split(/\s+/).length >= 8, `${row[0]} failure mode must be substantive`);
    assert.ok(row[5].split(/\s+/).length >= 7, `${row[0]} consequence must be substantive`);
  }

  const refusal = section(solutionProse, "Refusal and continuation record");
  for (const id of ["DC9-SOURCE-01", "DC9-FRAG-A", "DC9-FRAG-B"]) {
    assert.ok(hasExactIdentifier(refusal, id), `Module 9 refusal record must cite ${id}`);
  }
  assert.match(refusal, /Direct source:[^\n]*DC9-SOURCE-01[^\n]*refuse/i, "Module 9 refusal record must refuse the direct attempted effect");
  assert.match(refusal, /Compositional source:[\s\S]{0,180}refuse[\s\S]{0,80}aggregate attempted effect/i, "Module 9 refusal record must refuse the aggregate attempted effect");
  assert.match(refusal, /without reproducing or joining/i, "Module 9 refusal record must not concatenate the fragments");
  assert.match(refusal, /continue|evaluate F2 and F3/i, "Module 9 refusal record must continue the bounded critique");
  assert.match(refusal, /fixed\s+fictional packet[\s\S]{0,100}exercise procedure/i, "Module 9 refusal record must state the fixture inertness boundary");
  assert.match(refusal, /do\s+not\s+supply\s+a\s+general\s+runtime-neutralization\s+guarantee/i, "Module 9 refusal record must deny a Directive runtime guarantee");

  const audit = section(solutionProse, "Successor lean and audit record");
  assert.match(audit, /audit:trust-boundary/, "Module 9 solution must retain the parent audit marker");
  assert.match(audit, /reading=asserted[^\n]*independent clearance/i, "Module 9 solution must keep the parent premise unresolved before audit");
  assert.match(audit, /DC9-AUDIT-01/, "Module 9 solution must cite the independent audit response");

  const bindRows = tableRows(
    section(solutionProse, "Artifact 4 — bind-or-halt decisions"),
    ["Decision ID", "Next safe state", "Evidence", "Authority boundary"],
    "Module 9 worked bind-or-halt decisions",
  );
  assert.deepEqual(bindRows.map((row) => row[0].replaceAll("`", "")), decisionIds, "Module 9 solution must decide every fixed decision card");
  assert.deepEqual(
    bindRows.map((row) => row[1].replaceAll("`", "")),
    ["retry", "halt", "refuse synthesis", "verified synthesis", "not ingest-ready"],
    "Module 9 solution must distinguish retry, halt, synthesis refusal, verified synthesis, and later ingest",
  );
  assert.match(bindRows[3][3], /not ingest, activation, or implementation authority/i, "Verified synthesis must not become implementation authority");
  assert.match(bindRows[4][2], /catalog chip[^\n]*no admitted completed-arc record/i, "The chip-only card must remain not ingest-ready");

  const course = content.get("curriculum/README.md");
  const module9Row = courseModuleRow(course, 9);
  assert.match(module9Row, /09-design-critique-arcs\.md/, "Module 9 course row must link the design-critique lesson");
  assert.match(module9Row, /\|\s*75 min\s*\|/, "Module 9 course row must use the derived 75-minute duration");
  assert.match(module9Row, /command-free fixed-state/i, "Module 9 course row must identify the command-free practicum");
  for (const path of ["README.md", "curriculum/README.md", "assessments/README.md", "solutions/README.md"]) {
    requireModule9Link(content.get(path), path);
    verifyLinks(root, path, markdownParts(content.get(path)).prose);
  }
  assert.match(content.get("assessments/README.md"), /Module 9[^\n]*Design-critique[^\n]*O9\.6|O9\.6[^\n]*O9\.9/i, "assessment map must list the Module 9 evidence contract");
  assert.match(content.get("solutions/README.md"), /module-09-design-critique-arcs\.md[^\n]*command-free fixed-state practicum/i, "solution map must list the Module 9 solution and format");

  assert.match(section(markdownParts(content.get("curriculum/modules/08-session-and-work-selection.md")).prose, "Navigation"), /\]\(09-design-critique-arcs\.md\)/, "Module 8 must link forward to Module 9");
  assert.match(section(markdownParts(content.get("curriculum/modules/10-implementation-golden-path.md")).prose, "Navigation"), /\]\(09-design-critique-arcs\.md\)/, "Module 10 must link back to Module 9");
  assert.match(content.get("references/SOURCE-BASELINE.md"), /^## Module 9 design-critique validation\s*$/m, "source baseline is missing Module 9 design-critique validation");
  assert.match(content.get("references/SOURCE-NOTES.md"), /^## Module 9 design-critique source validation\s*$/m, "source notes are missing Module 9 design-critique validation");
  for (const term of ["design-critique arc", "input ceiling", "successor lean", "completed-arc record"]) {
    assert.match(content.get("references/GLOSSARY.md"), new RegExp(term, "i"), `glossary is missing Module 9 term: ${term}`);
  }
  assert.match(content.get("references/QUICK-REFERENCE.md"), /NS-INGEST-R2[\s\S]{0,500}9104001/, "quick reference is missing the fixed Module 9 routing and ceiling example");
  assert.match(content.get("maintainers/CURRICULUM-MAINTENANCE.md"), /npm run check:module-9/, "maintenance contract is missing the Module 9 content check");
  assert.match(content.get("maintainers/CURRICULUM-MAINTENANCE.md"), /npm run test:module-9/, "maintenance contract is missing the Module 9 test check");

  const projectPackage = JSON.parse(content.get("package.json"));
  assert.equal(projectPackage.private, true, "the training package must remain private");
  assertTeachingBaselinePin(projectPackage, content.get("README.md"));
  assert.equal(projectPackage.scripts?.["check:module-9"], "node scripts/verify-module-9.mjs", "package scripts must expose check:module-9");
  assert.equal(projectPackage.scripts?.["test:module-9"], "node --test scripts/verify-module-9.test.mjs", "package scripts must expose test:module-9");
  return { artifactCount: requiredFiles.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { artifactCount } = verifyModule9(process.argv[2]);
    console.log(`Module 9 content contract: ok (${artifactCount} artifacts, 0 missing)`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
