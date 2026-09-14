import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { courseModuleRow, markdownParts, moduleHeadings, section, solutionHeadings, verifyLinks } from "./verify-modules-4-5.mjs";

const module7 = "curriculum/modules/07-scope-lifecycle.md";
const lab7 = "labs/07-scope-lifecycle.md";
const solution7 = "solutions/lab-07-scope-lifecycle.md";
const helper = "labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs";
const safety = "labs/fixtures/07-scope-lifecycle/safety.mjs";
const fixturePackage = "labs/fixtures/07-scope-lifecycle/package.json";
const fixtureProject = "labs/fixtures/07-scope-lifecycle/PROJECT-DEFINITION.xbrief.json";
const scopeFilename = "2026-09-08-module-7-scope-lifecycle-and-implementation-authorization.xbrief.json";
const lifecycleStates = [
  { path: `xbrief/active/${scopeFilename}`, status: "running", folder: "active" },
  { path: `xbrief/completed/${scopeFilename}`, status: "completed", folder: "completed" },
];
const parentScope = "xbrief/proposed/2026-09-05-modules-6-8-work-lifecycle-and-sessions.xbrief.json";
const labHeadings = [
  "Lab record", "Goal and done condition", "Fictional scenario", "Environment and starting-state check",
  "Safety boundary", "Starting checkpoint", "Tasks", "Checkpoints", "Literal acceptance commands",
  "Evidence bundle", "Progressive hints", "Expected failures and recovery", "Reset to start", "Cleanup",
  "Explained solution", "Done statement",
];
const requiredFiles = [
  module7, lab7, solution7, helper, safety, fixturePackage, fixtureProject, "README.md", "CHANGELOG.md",
  "curriculum/README.md", "labs/README.md", "solutions/README.md", "assessments/README.md",
  "references/GLOSSARY.md", "references/QUICK-REFERENCE.md", "references/SOURCE-BASELINE.md",
  "references/SOURCE-NOTES.md", "package.json", "xbrief/PROJECT-DEFINITION.xbrief.json", parentScope,
];
const outcomes = ["O7.1", "O7.2", "O7.3", "O7.4"];
const unfinished = /\{\{[^}]+\}\}|\b(?:TODO|TBD|FIXME)\b|Authoring template/i;
const forbiddenShell = /\b(?:git\s+(?:push\b|remote\s+(?:add|remove|rename|set-url|prune|update)\b|reset\s+--hard\b|clean\b|branch\s+-D\b)|gh\s+(?:pr|issue|api|repo)\b|npm\s+publish\b|(?:directive|deft)\s+(?:deploy|publish|release)\b|rm\s+-[\w-]*r|Remove-Item\b|(?:del|rmdir)\s+\/s\b|curl\b|wget\b|Invoke-WebRequest\b|Invoke-RestMethod\b)/i;
const forbiddenFixture = /\bgit\s+push\b|\bgh\s+(?:pr|issue|api|repo)\b|\brmSync\s*\(|\bunlinkSync\s*\(/i;

function exactBaseline(path, prose, heading) {
  const row = section(prose, heading).match(/^\| Directive baseline\s*\|([^\n]+)$/m)?.[1];
  assert.ok(row?.includes("0.112.0"), `${path} must declare exact Directive 0.112.0`);
  assert.deepEqual([...new Set(row.match(/\b\d+\.\d+\.\d+\b/g))], ["0.112.0"], `${path} contains a stale or ranged Directive baseline`);
}

function requireOutcomes(path, prose, headings) {
  for (const heading of headings) {
    const body = section(prose, heading);
    for (const outcome of outcomes) assert.match(body, new RegExp(`\\b${outcome.replace(".", "\\.")}\\b`), `${path} ${heading} is missing ${outcome}`);
  }
}

function requireModule7Link(content, label) {
  assert.match(content, /\]\([^)]*07-scope-lifecycle\.md(?:#[^)]*)?\)/, `${label} is missing Module 7 navigation`);
}

/** Read-only Module 7 contract verifier. It never executes lesson commands or fixture code. */
export function verifyModule7(root = fileURLToPath(new URL("../", import.meta.url))) {
  assert.equal(typeof root, "string", "repository root must be a path string");
  const presentLifecycleStates = lifecycleStates.filter(({ path }) => {
    const absolute = resolve(root, path);
    return existsSync(absolute) && statSync(absolute).isFile();
  });
  assert.equal(
    presentLifecycleStates.length,
    1,
    "Module 7 must have exactly one active or completed lifecycle scope artifact",
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

  const parsed = new Map();
  for (const [path, headings, record] of [[module7, moduleHeadings, "Module record"], [lab7, labHeadings, "Lab record"], [solution7, solutionHeadings, "Solution record"]]) {
    const body = content.get(path);
    assert.doesNotMatch(body, unfinished, `${path} contains an unfinished author marker`);
    assert.doesNotMatch(body, /"(?:xBRIEFInfo|vBRIEFInfo)"\s*:\s*\{[^}]*"version"\s*:\s*"0\.6"/, `${path} teaches a legacy write envelope`);
    const parts = markdownParts(body);
    parsed.set(path, parts);
    for (const heading of headings) assert.ok(section(parts.prose, heading).trim(), `${path} has an empty section: ${heading}`);
    exactBaseline(path, parts.prose, record);
    assert.doesNotMatch(parts.prose, /\b(?:Directive behavior|3Ci policy|Course guidance)\b/i, `${path} contains a removed claim label`);
    for (const block of parts.blocks.filter(({ language }) => /^(?:sh|shell|bash|zsh|powershell|pwsh|console)$/.test(language))) {
      const commands = block.content.split("\n").filter((line) => !/^\s*#/.test(line)).join("\n");
      assert.doesNotMatch(commands, forbiddenShell, `${path} contains a forbidden remote or destructive command`);
    }
    verifyLinks(root, path, parts.prose);
  }
  requireOutcomes(module7, parsed.get(module7).prose, ["Learning outcomes", "Completion evidence", "Self-assessment"]);
  requireOutcomes(lab7, parsed.get(lab7).prose, ["Goal and done condition", "Literal acceptance commands", "Done statement"]);
  requireOutcomes(solution7, parsed.get(solution7).prose, ["Outcome map", "Acceptance evidence"]);

  const moduleProse = parsed.get(module7).prose;
  for (const term of ["proposed", "pending", "active", "running", "completed", "cancelled", "live implementation intent", "session ritual", "preflight"]) {
    assert.match(moduleProse, new RegExp(term, "i"), `${module7} is missing lifecycle or authority concept: ${term}`);
  }
  assert.match(section(moduleProse, "Navigation"), /\]\(06-creating-well-shaped-work\.md\)/, "Module 7 must link back to Module 6");
  assert.match(section(moduleProse, "Navigation"), /\]\(\.\.\/README\.md\)/, "Module 7 must link to the course map");
  assert.match(section(moduleProse, "Navigation"), /\]\(08-session-and-work-selection\.md\)/, "Module 7 must link to Module 8");

  const labBlocks = parsed.get(lab7).blocks.filter(({ language }) => /^(?:sh|bash|zsh|console)$/.test(language)).map(({ content: block }) => block).join("\n");
  assert.match(labBlocks, /helper="[^"\n]*lifecycle-lab\.mjs"/, `${lab7} must bind the supplied lifecycle helper`);
  for (const command of ["create", "install", "run", "reset", "archive"]) assert.match(labBlocks, new RegExp(`node\\s+"\\$helper"\\s+${command}\\b`), `${lab7} must include the ${command} helper command`);
  assert.match(labBlocks, /run[^\n]*--intent=implement/, `${lab7} run must carry explicit live implementation intent`);

  const helperBody = content.get(helper);
  const safetyBody = content.get(safety);
  assert.doesNotMatch(helperBody + "\n" + safetyBody, forbiddenFixture, "fixture contains a forbidden remote or destructive command");
  for (const token of ["mkdtempSync", "3ci-directive-lab07-", "assertNoGitRedirection", 'git(root, ["remote"])', "exact 0.112.0 pin required"]) assert.ok((helperBody + safetyBody).includes(token), `fixture is missing safety token: ${token}`);
  assert.match(safetyBody, /export function assertNoGitRedirection/, "fixture is missing the Git redirection guard");
  assert.match(safetyBody, /export function safePath/, "fixture is missing its path guard");
  for (const task of ["deft:scope:promote", "deft:scope:activate", "deft:scope:cancel", "deft:session:start", "deft:verify:session-ritual", "deft:xbrief:preflight", "deft:scope:complete"]) assert.ok(helperBody.includes(task), `fixture is missing Task transition: ${task}`);
  assert.match(helperBody, /proposedDirectivePreflight\.exitCode, 1/, "fixture must preserve exact pinned proposed-preflight exit 1");
  assert.match(helperBody, /return createAttempt\(\); \/\/ fresh-reset/, "fixture fresh-attempt reset must create a new root");
  assert.match(helperBody, /renameSync\(parent, destination\)/, "fixture cleanup must use recoverable exact-parent archive");
  const evidenceIndex = helperBody.indexOf("proposed-preflight.json");
  const promoteIndex = helperBody.indexOf('"deft:scope:promote"');
  const sessionIndex = helperBody.indexOf('"deft:session:start"');
  const activeIndex = helperBody.indexOf('"deft:xbrief:preflight"', sessionIndex);
  assert.ok(evidenceIndex >= 0 && evidenceIndex < promoteIndex, "failure evidence must be preserved before promotion");
  assert.ok(sessionIndex >= 0 && activeIndex > sessionIndex, "active preflight success must follow session gates");

  const fixtureManifest = JSON.parse(content.get(fixturePackage));
  assert.equal(fixtureManifest.private, true, "fixture package must remain private");
  assert.equal(fixtureManifest.devDependencies?.["@deftai/directive"], "0.112.0", "fixture must pin Directive exactly");
  for (const name of ["directive-core", "directive-content", "directive-types"]) assert.equal(fixtureManifest.overrides?.[`@deftai/${name}`], "0.112.0", `fixture must pin ${name} exactly`);
  assert.equal(JSON.parse(content.get(fixtureProject)).xBRIEFInfo?.version, "0.8", "fixture project must use xBRIEF 0.8");

  const notes = content.get("references/SOURCE-NOTES.md");
  assert.match(notes, /^## Module 7 (?:source validation|verification)\s*$/m, "SOURCE-NOTES is missing the Module 7 source validation record");
  for (const [platform, expected] of [["macos-zsh", "verified"], ["linux-bash", "candidate"], ["windows-pwsh7", "candidate"]]) {
    const matches = [...notes.matchAll(new RegExp(`lab07-platform-proof:${platform} status=(verified|candidate) date=(\\d{4}-\\d{2}-\\d{2}) evidence=([^\\s\x60]+)`, "g"))];
    assert.equal(matches.length, 1, `SOURCE-NOTES must contain exactly one Lab 7 proof marker for ${platform}`);
    assert.equal(matches[0][1], expected, `${platform}: unsupported Module 7 native claim`);
    if (expected === "verified") assert.doesNotMatch(matches[0][3], /^(?:none|not-run|pending|unknown)$/, `${platform}: verified status requires evidence`);
  }
  for (const path of [module7, lab7, solution7]) {
    for (const line of parsed.get(path).prose.split("\n").filter((line) => /Linux|Windows/i.test(line))) {
      assert.ok(/candidate|not (?:yet )?(?:verified|learner-ready)|unverified|no learner-ready|implemented|automated|independent learner/i.test(line), `${path} contains an unsupported native platform claim: ${line}`);
    }
  }

  const course = content.get("curriculum/README.md");
  const module7Row = courseModuleRow(course, 7);
  assert.match(module7Row, /07-scope-lifecycle\.md/, "Module 7 course row must link the lesson");
  assert.doesNotMatch(module7Row, /\|\s*Planned\s*\|/i, "Module 7 must no longer be planned");
  assert.match(courseModuleRow(course, 8), /08-session-and-work-selection\.md/, "Module 8 course row must retain its lesson link");
  for (const path of ["README.md", "curriculum/README.md", "labs/README.md", "solutions/README.md", "assessments/README.md"]) {
    requireModule7Link(content.get(path), path);
    verifyLinks(root, path, markdownParts(content.get(path)).prose);
  }
  const labsIndex = content.get("labs/README.md");
  assert.match(labsIndex, /^\| \[Lab 7[^\n]*\]\(07-scope-lifecycle\.md\) \| Learner-ready draft;[^\n]*macOS[^\n]*\|/m, "labs/README.md must list Lab 7 as learner-ready on its verified macOS path");
  assert.doesNotMatch(labsIndex, /Labs for Modules? 6(?:[–-]| through )11/, "labs/README.md must not classify Lab 7 inside an unavailable Modules 6–11 range");
  for (const term of ["promotion", "activation", "live implementation intent", "lifecycle evidence"]) assert.match(content.get("references/GLOSSARY.md"), new RegExp(term, "i"), `glossary is missing Module 7 term: ${term}`);
  for (const phrase of ["task deft:scope:promote", "task deft:scope:activate", "task deft:xbrief:preflight", "live implementation intent"]) assert.match(content.get("references/QUICK-REFERENCE.md"), new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `quick reference is missing Module 7 guidance: ${phrase}`);
  assert.match(content.get("references/SOURCE-BASELINE.md"), /^## Module 7 (?:source boundary|lifecycle validation)\s*$/m, "source baseline is missing Module 7 lifecycle validation");

  const project = JSON.parse(content.get("xbrief/PROJECT-DEFINITION.xbrief.json"));
  const projectItems = project.plan.items.filter((item) => item.id === "2026-09-08-module-7-scope-lifecycle-and-implementation-authorization");
  assert.equal(projectItems.length, 1, "PROJECT-DEFINITION must register Module 7 exactly once");
  const projectItem = projectItems[0];
  assert.equal(projectItem.status, lifecycleState.status, "PROJECT-DEFINITION Module 7 status must match its lifecycle scope");
  assert.equal(projectItem.metadata?.lifecycle_folder, lifecycleState.folder, "PROJECT-DEFINITION Module 7 folder must match its lifecycle scope");
  assert.equal(projectItem.metadata?.source_path, `${lifecycleState.folder}/${scopeFilename}`, "PROJECT-DEFINITION Module 7 source path must match its lifecycle scope");
  assert.equal(JSON.parse(content.get(lifecycleState.path)).plan?.status, lifecycleState.status, "Module 7 scope folder and status must agree");
  assert.equal(JSON.parse(content.get(parentScope)).plan?.status, "proposed", "parent phase remains proposed record state");

  const projectPackage = JSON.parse(content.get("package.json"));
  assert.equal(projectPackage.scripts?.["check:module-7"], "node scripts/verify-module-7.mjs", "package scripts must expose check:module-7");
  assert.equal(projectPackage.scripts?.["test:module-7"], "node --test scripts/lifecycle-lab.test.mjs scripts/verify-module-7.test.mjs", "package scripts must expose test:module-7");
  assert.equal(projectPackage.devDependencies?.["@deftai/directive"], "0.112.0", "training package must retain exact Directive pin");
  return { artifactCount: content.size };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { artifactCount } = verifyModule7(process.argv[2]);
    console.log(`Module 7 content contract: ok (${artifactCount} artifacts, 0 missing)`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
