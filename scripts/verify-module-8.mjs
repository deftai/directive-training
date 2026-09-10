import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { courseModuleRow, markdownParts, moduleHeadings, section, solutionHeadings, verifyLinks } from "./verify-modules-4-5.mjs";

const module8 = "curriculum/modules/08-session-and-work-selection.md";
const solution8 = "solutions/module-08-session-and-work-selection.md";
const scopeFilename = "2026-09-08-module-8-session-start-and-authorized-work-selection.xbrief.json";
const lifecycleStates = [
  { path: `xbrief/active/${scopeFilename}`, status: "running", folder: "active" },
  { path: `xbrief/completed/${scopeFilename}`, status: "completed", folder: "completed" },
];
const parentScope = "xbrief/proposed/2026-09-05-modules-6-8-work-lifecycle-and-sessions.xbrief.json";
const proposal = "history/changes/module-8-curriculum/proposal.xbrief.json";
const requiredFiles = [
  module8, solution8, "README.md", "CHANGELOG.md", "curriculum/README.md",
  "solutions/README.md", "assessments/README.md", "references/GLOSSARY.md",
  "references/QUICK-REFERENCE.md", "references/SOURCE-BASELINE.md",
  "references/SOURCE-NOTES.md", "package.json", "xbrief/PROJECT-DEFINITION.xbrief.json",
  parentScope, proposal,
];
const outcomes = ["O8.1", "O8.2", "O8.3", "O8.4"];
const unfinished = /\{\{[^}]+\}\}|\b(?:TODO|TBD|FIXME)\b|Authoring template/i;
const liveInstruction = /^(?:open|inspect|read|fetch|query) the live (?:GitHub )?(?:backlog|queue|cache|issue)/im;

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

function requireModule8Link(content, label) {
  assert.match(content, /\]\([^)]*08-session-and-work-selection\.md(?:#[^)]*)?\)/, `${label} is missing Module 8 navigation`);
}

/** Read-only Module 8 contract verifier. It never reads live backlog or cache state. */
export function verifyModule8(root = fileURLToPath(new URL("../", import.meta.url))) {
  assert.equal(typeof root, "string", "repository root must be a path string");
  const presentLifecycleStates = lifecycleStates.filter(({ path }) => {
    const absolute = resolve(root, path);
    return existsSync(absolute) && statSync(absolute).isFile();
  });
  assert.equal(
    presentLifecycleStates.length,
    1,
    "Module 8 must have exactly one active or completed lifecycle scope artifact",
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
    /^## Module 8 source validation\s*$/m,
    "SOURCE-NOTES is missing the Module 8 source validation record",
  );

  const parsed = new Map();
  for (const [path, headings, record] of [
    [module8, moduleHeadings, "Module record"],
    [solution8, solutionHeadings, "Solution record"],
  ]) {
    const body = content.get(path);
    assert.doesNotMatch(body, unfinished, `${path} contains an unfinished author marker`);
    assert.doesNotMatch(body, liveInstruction, `${path} contains a live project-state instruction`);
    const parts = markdownParts(body);
    parsed.set(path, parts);
    for (const heading of headings) assert.ok(section(parts.prose, heading).trim(), `${path} has an empty section: ${heading}`);
    exactBaseline(path, parts.prose, record);
    for (const label of ["Directive behavior", "3Ci policy", "Course guidance"]) {
      assert.ok(parts.prose.includes(`[${label}]`), `${path} is missing claim label: ${label}`);
    }
    verifyLinks(root, path, parts.prose);
  }
  requireOutcomes(module8, parsed.get(module8).prose, ["Learning outcomes", "Completion evidence", "Self-assessment"]);
  requireOutcomes(solution8, parsed.get(solution8).prose, ["Outcome map", "Acceptance evidence"]);

  const moduleProse = parsed.get(module8).prose;
  assert.match(moduleProse, /Orientation only\s*\|\s*Read-only/, `${module8} has an incorrect read-only posture mapping`);
  assert.match(moduleProse, /Do not inspect or select the ranked queue/, `${module8} is missing ordered-plan precedence`);
  assert.match(moduleProse, /plan is exhausted[^\n]*stop[^\n]*(?:operator target|queue selection)/i, `${module8} must fail closed when the ordered plan is exhausted`);
  for (const path of [".deft/plan-sequence.json", ".deft-cache/", "xbrief/.triage-cache/candidates.jsonl", "xbrief/pending/", "xbrief/active/"]) {
    assert.ok(moduleProse.includes(path), path === ".deft/plan-sequence.json"
      ? `${module8} is missing the canonical ordered-plan path`
      : `${module8} is missing canonical state path: ${path}`);
  }
  for (const term of [
    "session:start", "session:ready", "read-only", "mutation", "ordered plan",
    "ranked queue", "pending scope", "active scope", "audit log", "live implementation intent",
  ]) {
    assert.match(moduleProse, new RegExp(term.replace(":", "\\:"), "i"), `${module8} is missing session or selection concept: ${term}`);
  }
  for (const label of ["Case A", "Case B", "Case C", "Case D", "Snapshot 1", "Snapshot 2"]) {
    assert.ok(moduleProse.includes(label), `${module8} is missing fixed exercise state: ${label}`);
  }
  assert.match(moduleProse, /fixed fictional state/i, `${module8} must identify its fixed fictional state`);
  assert.match(moduleProse, /no\s+(?:live|real)\s+(?:GitHub\s+)?(?:backlog|cache|repository)/i, `${module8} must prohibit live project-state access`);
  assert.match(section(moduleProse, "Navigation"), /\]\(07-scope-lifecycle\.md\)/, "Module 8 must link back to Module 7");
  assert.match(section(moduleProse, "Navigation"), /\]\(\.\.\/README\.md\)/, "Module 8 must link to the course map");
  assert.match(section(moduleProse, "Navigation"), /Module 9[^\n]*planned/i, "Module 8 must identify Module 9 as planned");

  const solutionProse = parsed.get(solution8).prose;
  assert.match(solutionProse, /Historical record; no standing implementation authority/, `${solution8} has an incorrect completed-scope authority mapping`);
  assert.match(solutionProse, /active scope \+ live implementation intent/i, `${solution8} must preserve the implementation-authority conjunction`);
  assert.match(solutionProse, /plan is exhausted[^\n]*stop[^\n]*(?:operator target|queue selection)/i, `${solution8} must explain exhausted-plan recovery`);

  const course = content.get("curriculum/README.md");
  const module8Row = courseModuleRow(course, 8);
  assert.match(module8Row, /08-session-and-work-selection\.md/, "Module 8 course row must link the lesson");
  assert.doesNotMatch(module8Row, /\|\s*Planned\s*\|/i, "Module 8 must no longer be planned");
  assert.match(courseModuleRow(course, 9), /09-implementation-golden-path\.md/, "Module 9 course row must remain navigable");
  const module10Row = courseModuleRow(course, 10);
  assert.match(module10Row, /10-testing-gates-and-evidence\.md/, "Module 10 course row must link the lesson");
  assert.doesNotMatch(module10Row, /\|\s*Planned\s*\|/i, "Module 10 must remain learner-ready");
  for (const path of ["README.md", "curriculum/README.md", "solutions/README.md", "assessments/README.md"]) {
    requireModule8Link(content.get(path), path);
    verifyLinks(root, path, markdownParts(content.get(path)).prose);
  }

  for (const term of ["ordered plan", "ranked queue", "audit log", "session recovery"]) {
    assert.match(content.get("references/GLOSSARY.md"), new RegExp(term, "i"), `glossary is missing Module 8 term: ${term}`);
  }
  for (const phrase of ["deft session:start", "deft session:ready", "deft plan-sequence:current", "deft triage:queue", "deft triage:audit"]) {
    assert.match(content.get("references/QUICK-REFERENCE.md"), new RegExp(phrase.replace(/[.*+?^$\{\}()|[\]\\]/g, "\\$&"), "i"), `quick reference is missing Module 8 guidance: ${phrase}`);
  }
  assert.match(content.get("references/SOURCE-BASELINE.md"), /^## Module 8 session and work-selection validation\s*$/m, "source baseline is missing Module 8 session validation");
  const notes = content.get("references/SOURCE-NOTES.md");
  assert.match(notes, /^## Module 8 source validation\s*$/m, "SOURCE-NOTES is missing the Module 8 source validation record");
  for (const token of [
    "engine 0.114.0", "deposit 0.114.0", "explicit 0.112.0 runtime",
    "session:start --help", "plan-sequence:current --help", "triage:queue --help",
    ".deft/core/xbrief/schemas", ".deft/core/vbrief/schemas",
  ]) {
    assert.ok(notes.includes(token), `SOURCE-NOTES Module 8 evidence is missing: ${token}`);
  }

  const project = JSON.parse(content.get("xbrief/PROJECT-DEFINITION.xbrief.json"));
  const projectItems = project.plan.items.filter((item) => item.id === "2026-09-08-module-8-session-start-and-authorized-work-selection");
  assert.equal(projectItems.length, 1, "PROJECT-DEFINITION must register Module 8 exactly once");
  const projectItem = projectItems[0];
  assert.equal(projectItem.status, lifecycleState.status, "PROJECT-DEFINITION Module 8 status must match its lifecycle scope");
  assert.equal(projectItem.metadata?.lifecycle_folder, lifecycleState.folder, "PROJECT-DEFINITION Module 8 folder must match its lifecycle scope");
  assert.equal(projectItem.metadata?.source_path, `${lifecycleState.folder}/${scopeFilename}`, "PROJECT-DEFINITION Module 8 source path must match its lifecycle scope");
  assert.equal(JSON.parse(content.get(lifecycleState.path)).plan?.status, lifecycleState.status, "Module 8 scope folder and status must agree");
  assert.equal(JSON.parse(content.get(parentScope)).plan?.status, "proposed", "parent phase remains proposed record state");
  assert.equal(JSON.parse(content.get(proposal)).xBRIEFInfo?.version, "0.8", "Module 8 change proposal must use xBRIEF 0.8");

  const projectPackage = JSON.parse(content.get("package.json"));
  assert.equal(projectPackage.scripts?.["check:module-8"], "node scripts/verify-module-8.mjs", "package scripts must expose check:module-8");
  assert.equal(projectPackage.scripts?.["test:module-8"], "node --test scripts/verify-module-8.test.mjs", "package scripts must expose test:module-8");
  assert.equal(projectPackage.devDependencies?.["@deftai/directive"], "0.112.0", "training package must retain exact Directive pin");
  return { artifactCount: content.size };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { artifactCount } = verifyModule8(process.argv[2]);
    console.log(`Module 8 content contract: ok (${artifactCount} artifacts, 0 missing)`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
