import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { courseModuleRow, markdownParts, moduleHeadings, section, solutionHeadings, verifyLinks } from "./verify-modules-4-5.mjs";

const module9 = "curriculum/modules/09-implementation-golden-path.md";
const lab9 = "labs/09-implementation-golden-path.md";
const solution9 = "solutions/lab-09-implementation-golden-path.md";
const scopeFilename = "2026-09-10-module-9-implementation-golden-path.xbrief.json";
const lifecycleStates = [
  { path: `xbrief/active/${scopeFilename}`, status: "running", folder: "active" },
  { path: `xbrief/completed/${scopeFilename}`, status: "completed", folder: "completed" },
];
const parentScope = "xbrief/proposed/2026-09-05-modules-9-11-implementation-gates-and-review.xbrief.json";
const proposal = "history/changes/module-9-curriculum/proposal.xbrief.json";
const fixtureFiles = [
  "labs/fixtures/09-implementation-golden-path/PROJECT-DEFINITION.xbrief.json",
  "labs/fixtures/09-implementation-golden-path/implementation-lab.mjs",
  "labs/fixtures/09-implementation-golden-path/package.json",
  "labs/fixtures/09-implementation-golden-path/safety.mjs",
  "labs/fixtures/09-implementation-golden-path/src/cli.mjs",
  "labs/fixtures/09-implementation-golden-path/src/greeting.mjs",
  "labs/fixtures/09-implementation-golden-path/test/greeting.test.mjs",
];
const requiredFiles = [
  module9, lab9, solution9, ...fixtureFiles,
  "README.md", "CHANGELOG.md", "curriculum/README.md", "labs/README.md",
  "solutions/README.md", "assessments/README.md", "maintainers/CURRICULUM-MAINTENANCE.md",
  "references/GLOSSARY.md", "references/QUICK-REFERENCE.md", "references/SOURCE-BASELINE.md",
  "references/SOURCE-NOTES.md", "package.json", "xbrief/PROJECT-DEFINITION.xbrief.json",
  parentScope, proposal, "scripts/implementation-lab.test.mjs",
];
const labHeadings = [
  "Lab record", "Goal and done condition", "Fictional scenario", "Environment and starting-state check",
  "Safety boundary", "Starting checkpoint", "Tasks", "Checkpoints", "Literal acceptance commands",
  "Evidence bundle", "Progressive hints", "Expected failures and recovery", "Reset to start", "Cleanup",
  "Explained solution", "Done statement",
];
const outcomes = ["O9.1", "O9.2", "O9.3", "O9.4", "O9.5"];
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

function requireModule9Link(content, label) {
  assert.match(content, /\]\([^)]*09-implementation-golden-path\.md(?:#[^)]*)?\)/, `${label} is missing Module 9 navigation`);
}

/** Read-only Module 9 lesson, fixture, evidence, and future-module boundary verifier. */
export function verifyModule9(root = fileURLToPath(new URL("../", import.meta.url))) {
  assert.equal(typeof root, "string", "repository root must be a path string");
  const presentLifecycleStates = lifecycleStates.filter(({ path }) => {
    const absolute = resolve(root, path);
    return existsSync(absolute) && statSync(absolute).isFile();
  });
  assert.equal(presentLifecycleStates.length, 1, "Module 9 must have exactly one active or completed lifecycle scope artifact");
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
    [module9, moduleHeadings, "Module record"],
    [lab9, labHeadings, "Lab record"],
    [solution9, solutionHeadings, "Solution record"],
  ]) {
    const body = content.get(path);
    assert.doesNotMatch(body, unfinished, `${path} contains an unfinished author marker`);
    const parts = markdownParts(body);
    parsed.set(path, parts);
    for (const heading of headings) assert.ok(section(parts.prose, heading).trim(), `${path} has an empty section: ${heading}`);
    exactBaseline(path, parts.prose, record);
    for (const label of ["Directive behavior", "3Ci policy", "Course guidance"]) {
      assert.ok(parts.prose.includes(`[${label}]`), `${path} is missing claim label: ${label}`);
    }
    verifyLinks(root, path, parts.prose);
  }

  const moduleProse = parsed.get(module9).prose;
  requireOutcomes(module9, moduleProse, ["Learning outcomes", "Completion evidence", "Self-assessment"]);
  assert.match(moduleProse, /^### Readiness before mutation\s*$/m, `${module9} has an incorrect readiness order`);
  for (const phrase of [
    "task deft:session:start", "task deft:verify:session-ritual", "directive verify:story-ready",
    "task deft:xbrief:preflight", "npm run test:focused", "git diff --check",
    "smallest coherent change", "behavioral evidence", "diff evidence",
  ]) assert.ok(moduleProse.includes(phrase), `${module9} is missing implementation guidance: ${phrase}`);
  assert.match(section(moduleProse, "Navigation"), /\]\(08-session-and-work-selection\.md\)/, "Module 9 must link back to Module 8");
  assert.match(section(moduleProse, "Navigation"), /\]\(10-testing-gates-and-evidence\.md\)/, "Module 9 must link forward to Module 10");

  const labProse = parsed.get(lab9).prose;
  assert.match(labProse, /unique OS-temporary repository with no remote/, `${lab9} is missing its temporary no-remote boundary`);
  assert.match(labProse, /Only `src\/greeting\.mjs` is mutable/, `${lab9} is missing its one-file product allowlist`);
  for (const verb of ["create", "install", "readiness", "verify", "reset", "archive"]) {
    assert.match(labProse, new RegExp(`implementation-lab\\.mjs ${verb}`), `${lab9} is missing helper verb: ${verb}`);
  }
  for (const path of ["readiness.json", "implementation.json"]) assert.ok(labProse.includes(path), `${lab9} is missing evidence artifact: ${path}`);

  const solutionProse = parsed.get(solution9).prose;
  requireOutcomes(solution9, solutionProse, ["Outcome map", "Acceptance evidence"]);
  assert.match(section(solutionProse, "Solution record"), /Hello, Ada!/, `${solution9} is missing named greeting evidence`);
  assert.match(section(solutionProse, "Solution record"), /src\/greeting\.mjs/, `${solution9} is missing diff evidence`);
  assert.match(solutionProse, /Hello, teammate!/, `${solution9} is missing fallback greeting evidence`);
  assert.match(solutionProse, /name must be a string/, `${solution9} is missing input-error behavior`);

  const course = content.get("curriculum/README.md");
  const module9Row = courseModuleRow(course, 9);
  assert.match(module9Row, /09-implementation-golden-path\.md/, "Module 9 course row must link the lesson");
  assert.doesNotMatch(module9Row, /\|\s*Planned\s*\|/i, "Module 9 must no longer be planned");
  const module10Row = courseModuleRow(course, 10);
  assert.match(module10Row, /10-testing-gates-and-evidence\.md/, "Module 10 course row must link the lesson");
  assert.doesNotMatch(module10Row, /\|\s*Planned\s*\|/i, "Module 10 must remain learner-ready");
  assert.match(courseModuleRow(course, 11), /\|\s*Planned\s*\|/i, "Module 11 must remain planned");
  for (const path of ["README.md", "curriculum/README.md", "labs/README.md", "solutions/README.md", "assessments/README.md"]) {
    requireModule9Link(content.get(path), path);
    verifyLinks(root, path, markdownParts(content.get(path)).prose);
  }

  for (const term of ["focused check", "behavioral evidence", "diff evidence", "implementation readiness"]) {
    assert.match(content.get("references/GLOSSARY.md"), new RegExp(term, "i"), `glossary is missing Module 9 term: ${term}`);
  }
  for (const phrase of ["directive verify:story-ready", "npm run test:focused", "git diff --check", "src/greeting.mjs"]) {
    assert.ok(content.get("references/QUICK-REFERENCE.md").includes(phrase), `quick reference is missing Module 9 guidance: ${phrase}`);
  }
  assert.match(content.get("references/SOURCE-BASELINE.md"), /^## Module 9 implementation-readiness validation\s*$/m, "source baseline is missing Module 9 validation");
  const notes = content.get("references/SOURCE-NOTES.md");
  assert.match(notes, /^## Module 9 source validation\s*$/m, "SOURCE-NOTES is missing the Module 9 source validation record");
  assert.doesNotMatch(notes, /module09-platform-proof:windows-powershell status=verified/, "Windows must remain candidate for Module 9");
  assert.doesNotMatch(notes, /module09-platform-proof:linux-bash status=verified/, "Linux must remain candidate for Module 9");
  for (const token of [
    "engine 0.114.0", "deposit 0.114.0", "exact 0.112.0 graph", "verify:story-ready",
    "module09-platform-proof:macos-zsh status=verified",
    "module09-platform-proof:linux-bash status=candidate",
    "module09-platform-proof:windows-powershell status=candidate",
  ]) assert.ok(notes.includes(token), `SOURCE-NOTES Module 9 evidence is missing: ${token}`);

  const fixturePackage = JSON.parse(content.get("labs/fixtures/09-implementation-golden-path/package.json"));
  assert.equal(fixturePackage.devDependencies?.["@deftai/directive"], "0.112.0", "Module 9 fixture must retain the exact Directive pin");
  for (const name of ["directive-core", "directive-content", "directive-types"]) {
    assert.equal(fixturePackage.overrides?.[`@deftai/${name}`], "0.112.0", `Module 9 fixture must pin ${name}`);
  }
  const helper = content.get("labs/fixtures/09-implementation-golden-path/implementation-lab.mjs");
  for (const invariant of ["realpathSync(tmpdir())", 'git(root, ["remote"])', 'const allowedProductFiles = ["src/greeting.mjs"]', 'finalStatus: "READY"', 'finalStatus: "PASS"']) {
    assert.ok(helper.includes(invariant), `Module 9 helper is missing guard invariant: ${invariant}`);
  }

  const project = JSON.parse(content.get("xbrief/PROJECT-DEFINITION.xbrief.json"));
  const projectItems = project.plan.items.filter((item) => item.id === "2026-09-10-module-9-implementation-golden-path");
  assert.equal(projectItems.length, 1, "PROJECT-DEFINITION must register Module 9 exactly once");
  const projectItem = projectItems[0];
  assert.equal(projectItem.status, lifecycleState.status, "PROJECT-DEFINITION Module 9 status must match its lifecycle scope");
  assert.equal(projectItem.metadata?.lifecycle_folder, lifecycleState.folder, "PROJECT-DEFINITION Module 9 folder must match its lifecycle scope");
  assert.equal(projectItem.metadata?.source_path, `${lifecycleState.folder}/${scopeFilename}`, "PROJECT-DEFINITION Module 9 source path must match its lifecycle scope");
  assert.equal(JSON.parse(content.get(lifecycleState.path)).plan?.status, lifecycleState.status, "Module 9 scope folder and status must agree");
  assert.equal(JSON.parse(content.get(parentScope)).plan?.status, "proposed", "Modules 9-11 parent phase remains proposed record state");
  assert.equal(JSON.parse(content.get(proposal)).plan?.status, "approved", "Module 9 change proposal must remain approved");

  const projectPackage = JSON.parse(content.get("package.json"));
  assert.equal(projectPackage.scripts?.["check:module-9"], "node scripts/verify-module-9.mjs", "package scripts must expose check:module-9");
  assert.equal(projectPackage.scripts?.["test:module-9"], "node --test scripts/implementation-lab.test.mjs scripts/verify-module-9.test.mjs", "package scripts must expose test:module-9");
  assert.equal(projectPackage.devDependencies?.["@deftai/directive"], "0.112.0", "training package must retain exact Directive pin");
  return { artifactCount: content.size };
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
