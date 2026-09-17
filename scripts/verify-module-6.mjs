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

const module6 = "curriculum/modules/06-creating-well-shaped-work.md";
const solution6 = "solutions/module-06-creating-well-shaped-work.md";
const module5 = "curriculum/modules/05-sources-versus-projections.md";
const requiredFiles = [
  module6,
  solution6,
  module5,
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

function exactBaseline(path, prose, recordHeading) {
  const record = section(prose, recordHeading);
  const baseline = record.match(/^\| Directive baseline\s*\|([^\n]+)$/m)?.[1];
  assert.ok(baseline?.includes("0.112.0"), `${path} must declare the exact Directive 0.112.0 baseline`);
  assert.deepEqual(
    [...new Set(baseline.match(/\b\d+\.\d+\.\d+\b/g))],
    ["0.112.0"],
    `${path} contains a stale baseline version`,
  );
}

function requireSectionOutcomes(path, prose, headings) {
  for (const heading of headings) {
    const body = section(prose, heading);
    for (const outcome of ["O6.1", "O6.2", "O6.3"]) {
      assert.match(body, new RegExp(`\\b${outcome.replace(".", "\\.")}\\b`), `${path} ${heading} is missing ${outcome}`);
    }
  }
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

  for (const term of ["vertical slice", "horizontal plan", "proposed scope"]) {
    assert.match(content.get("references/GLOSSARY.md"), new RegExp(term, "i"), `glossary is missing Module 6 term: ${term}`);
  }
  for (const phrase of ["bounded strategy choice", "User-visible outcome", "Dependency rationale", "Boundary rationale"]) {
    assert.match(content.get("references/QUICK-REFERENCE.md"), new RegExp(phrase, "i"), `quick reference is missing Module 6 guidance: ${phrase}`);
  }

  const baseline = content.get("references/SOURCE-BASELINE.md");
  assert.match(baseline, /0\.112\.0/, "source baseline must retain Directive 0.112.0");
  const notes = content.get("references/SOURCE-NOTES.md");
  assert.match(notes, /^## Module 6 (?:source validation|verification)\s*$/m, "SOURCE-NOTES is missing the Module 6 source validation record");
  assert.match(notes, /\b0\.112\.0\b/, "Module 6 source validation must name Directive 0.112.0");
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
  assert.equal(projectPackage.devDependencies?.["@deftai/directive"], "0.119.1", "the training package must retain the exact Directive pin");
  assert.equal(projectPackage.scripts?.["check:module-6"], "node scripts/verify-module-6.mjs", "package scripts must expose check:module-6");
  assert.equal(projectPackage.scripts?.["test:module-6"], "node --test scripts/verify-module-6.test.mjs", "package scripts must expose test:module-6");
  return { artifactCount: requiredFiles.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { artifactCount } = verifyModule6(process.argv[2]);
  console.log(`Module 6 content contract: ok (${artifactCount} artifacts, 0 missing)`);
}
