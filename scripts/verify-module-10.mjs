import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { courseModuleRow, markdownParts, moduleHeadings, section, solutionHeadings, verifyLinks } from "./verify-modules-4-5.mjs";
import { assertTeachingBaselinePin } from "./teaching-baseline.mjs";

const module10 = "curriculum/modules/10-implementation-golden-path.md";
const lab10 = "labs/10-implementation-golden-path.md";
const solution10 = "solutions/lab-10-implementation-golden-path.md";
const historicalLineage = Object.freeze({
  scopeFilename: "2026-09-10-module-9-implementation-golden-path.xbrief.json",
  parentScope: "xbrief/proposed/2026-09-05-modules-9-11-implementation-gates-and-review.xbrief.json",
  proposal: "history/changes/module-9-curriculum/proposal.xbrief.json",
  projectItemId: "2026-09-10-module-9-implementation-golden-path",
});
const { scopeFilename, parentScope, proposal } = historicalLineage;
const lifecycleStates = [
  { path: `xbrief/active/${scopeFilename}`, status: "running", folder: "active" },
  { path: `xbrief/completed/${scopeFilename}`, status: "completed", folder: "completed" },
];
const fixtureFiles = [
  "labs/fixtures/10-implementation-golden-path/PROJECT-DEFINITION.xbrief.json",
  "labs/fixtures/10-implementation-golden-path/implementation-lab.mjs",
  "labs/fixtures/10-implementation-golden-path/package.json",
  "labs/fixtures/10-implementation-golden-path/safety.mjs",
  "labs/fixtures/10-implementation-golden-path/src/cli.mjs",
  "labs/fixtures/10-implementation-golden-path/src/greeting.mjs",
  "labs/fixtures/10-implementation-golden-path/test/greeting.test.mjs",
];
const requiredFiles = [
  module10, lab10, solution10, ...fixtureFiles,
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
const outcomes = ["O10.5", "O10.6", "O10.7", "O10.8", "O10.9"];
const unfinished = /\{\{[^}]+\}\}|\b(?:TODO|TBD|FIXME)\b|Authoring template/i;

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
      assert.match(body, new RegExp(`\\b${outcome.replace(".", "\\.")}\\b`), `${path} ${heading} is missing ${outcome}`);
    }
  }
}

function requireModule10Link(content, label) {
  assert.match(content, /\]\([^)]*10-implementation-golden-path\.md(?:#[^)]*)?\)/, `${label} is missing Module 10 navigation`);
}

/** Read-only implementation lesson, fixture, evidence, and future-module boundary verifier. */
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
  assert.match(moduleProse, /^### Readiness before mutation\s*$/m, `${module10} has an incorrect readiness order`);
  for (const phrase of [
    "task deft:session:start", "task deft:verify:session-ritual", "directive verify:story-ready",
    "task deft:xbrief:preflight", "npm run test:focused", "git diff --check",
    "smallest coherent change", "behavioral evidence", "diff evidence",
  ]) assert.ok(moduleProse.includes(phrase), `${module10} is missing implementation guidance: ${phrase}`);
  assert.match(section(moduleProse, "Navigation"), /\]\(09-design-critique-arcs\.md\)/, "Module 10 must link back to Module 9");
  assert.match(section(moduleProse, "Navigation"), /\]\(11-testing-gates-and-evidence\.md\)/, "Module 10 must link forward to Module 11");

  const labProse = parsed.get(lab10).prose;
  assert.match(labProse, /unique OS-temporary repository with no remote/, `${lab10} is missing its temporary no-remote boundary`);
  assert.match(labProse, /Learner-ready on macOS\/zsh; Linux\/bash and Windows\/PowerShell remain candidates/, `${lab10} must retain the current platform boundary`);
  assert.match(labProse, /Only `src\/greeting\.mjs` is mutable/, `${lab10} is missing its one-file product allowlist`);
  for (const verb of ["create", "install", "readiness", "verify", "reset", "archive"]) {
    assert.match(labProse, new RegExp(`implementation-lab\\.mjs ${verb}`), `${lab10} is missing helper verb: ${verb}`);
  }
  for (const path of ["readiness.json", "implementation.json"]) assert.ok(labProse.includes(path), `${lab10} is missing evidence artifact: ${path}`);

  const solutionProse = parsed.get(solution10).prose;
  requireOutcomes(solution10, solutionProse, ["Outcome map", "Acceptance evidence"]);
  assert.match(section(solutionProse, "Solution record"), /Hello, Ada!/, `${solution10} is missing named greeting evidence`);
  assert.match(section(solutionProse, "Solution record"), /src\/greeting\.mjs/, `${solution10} is missing diff evidence`);
  assert.match(solutionProse, /Hello, teammate!/, `${solution10} is missing fallback greeting evidence`);
  assert.match(solutionProse, /name must be a string/, `${solution10} is missing input-error behavior`);

  const course = content.get("curriculum/README.md");
  const module10Row = courseModuleRow(course, 10);
  assert.match(module10Row, /10-implementation-golden-path\.md/, "Module 10 course row must link the lesson");
  assert.doesNotMatch(module10Row, /\|\s*Planned\s*\|/i, "Module 10 must no longer be planned");
  assert.match(module10Row, /verified on macOS\/zsh; Linux and Windows candidates/i, "Module 10 course row must retain the current platform boundary");
  const module11Row = courseModuleRow(course, 11);
  assert.match(module11Row, /11-testing-gates-and-evidence\.md/, "Module 11 course row must link the lesson");
  assert.doesNotMatch(module11Row, /\|\s*Planned\s*\|/i, "Module 11 must remain learner-ready");
  const module12Row = courseModuleRow(course, 12);
  assert.match(
    module12Row,
    /\[PR, review, and actual completion\]\(modules\/12-review-and-completion\.md\)/,
    "Module 12 course row must link the lesson",
  );
  assert.match(module12Row, /\|\s*Learner-ready\b/i, "Module 12 must remain learner-ready");
  for (const path of ["README.md", "curriculum/README.md", "labs/README.md", "solutions/README.md", "assessments/README.md"]) {
    requireModule10Link(content.get(path), path);
    verifyLinks(root, path, markdownParts(content.get(path)).prose);
  }
  assert.match(
    content.get("labs/README.md"),
    /^\| \[Lab 10[^\n]*\]\(10-implementation-golden-path\.md\) \| Learner-ready draft;[^\n]*macOS\/zsh; Linux and Windows candidates[^\n]*\|/m,
    "labs/README.md must list Lab 10 with the current platform boundary",
  );

  for (const term of ["focused check", "behavioral evidence", "diff evidence", "implementation readiness"]) {
    assert.match(content.get("references/GLOSSARY.md"), new RegExp(term, "i"), `glossary is missing Module 10 term: ${term}`);
  }
  for (const phrase of ["directive verify:story-ready", "npm run test:focused", "git diff --check", "src/greeting.mjs"]) {
    assert.ok(content.get("references/QUICK-REFERENCE.md").includes(phrase), `quick reference is missing Module 10 guidance: ${phrase}`);
  }
  assert.match(content.get("references/SOURCE-BASELINE.md"), /^## Module 10 implementation-readiness validation\s*$/m, "source baseline is missing Module 10 validation");
  const notes = content.get("references/SOURCE-NOTES.md");
  assert.match(notes, /^## Module 10 source validation\s*$/m, "SOURCE-NOTES is missing the Module 10 source validation record");
  const baseline = content.get("references/SOURCE-BASELINE.md");
  for (const [platform, expected] of [["macos-zsh", "verified"], ["linux-bash", "candidate"], ["windows-pwsh7", "candidate"]]) {
    assert.match(baseline, new RegExp(`teaching-platform-proof:${platform} status=${expected}`), `SOURCE-BASELINE Module 10 platform status is missing: ${platform}`);
  }
  for (const token of ["exact CLI/core/content/types 0.119.2 package graph", "verify:story-ready"]) assert.ok(baseline.includes(token), `SOURCE-BASELINE implementation evidence is missing: ${token}`);

  const fixturePackage = JSON.parse(content.get("labs/fixtures/10-implementation-golden-path/package.json"));
  assert.equal(fixturePackage.devDependencies?.["@deftai/directive"], "0.119.2", "Module 10 fixture must retain the exact Directive pin");
  for (const name of ["directive-core", "directive-content", "directive-types"]) {
    assert.equal(fixturePackage.overrides?.[`@deftai/${name}`], "0.119.2", `Module 10 fixture must pin ${name}`);
  }
  const helper = content.get("labs/fixtures/10-implementation-golden-path/implementation-lab.mjs");
  for (const invariant of ["realpathSync(tmpdir())", 'git(root, ["remote"])', 'const allowedProductFiles = ["src/greeting.mjs"]', 'finalStatus: "READY"', 'finalStatus: "PASS"']) {
    assert.ok(helper.includes(invariant), `Module 10 helper is missing guard invariant: ${invariant}`);
  }

  const project = JSON.parse(content.get("xbrief/PROJECT-DEFINITION.xbrief.json"));
  const projectItems = project.plan.items.filter((item) => item.id === historicalLineage.projectItemId);
  assert.equal(projectItems.length, 1, "PROJECT-DEFINITION must register Module 10 exactly once");
  const projectItem = projectItems[0];
  assert.equal(projectItem.status, lifecycleState.status, "PROJECT-DEFINITION Module 10 status must match its lifecycle scope");
  assert.equal(projectItem.metadata?.lifecycle_folder, lifecycleState.folder, "PROJECT-DEFINITION Module 10 folder must match its lifecycle scope");
  assert.equal(projectItem.metadata?.source_path, `${lifecycleState.folder}/${scopeFilename}`, "PROJECT-DEFINITION Module 10 source path must match its lifecycle scope");
  assert.equal(JSON.parse(content.get(lifecycleState.path)).plan?.status, lifecycleState.status, "Module 10 scope folder and status must agree");
  assert.equal(JSON.parse(content.get(parentScope)).plan?.status, "proposed", "Modules 10-12 parent phase remains proposed record state");
  assert.equal(JSON.parse(content.get(proposal)).plan?.status, "approved", "Module 10 change proposal must remain approved");

  const projectPackage = JSON.parse(content.get("package.json"));
  assert.equal(projectPackage.scripts?.["check:module-10"], "node scripts/verify-module-10.mjs", "package scripts must expose check:module-10");
  assert.equal(projectPackage.scripts?.["test:module-10"], "node --test scripts/implementation-lab.test.mjs scripts/verify-module-10.test.mjs", "package scripts must expose test:module-10");
  assertTeachingBaselinePin(projectPackage, content.get("README.md"));
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
