import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { courseModuleRow, markdownParts, moduleHeadings, section, solutionHeadings, verifyLinks } from "./verify-modules-4-5.mjs";
import { assertTeachingBaselinePin } from "./teaching-baseline.mjs";

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
const hasExactIdentifier = (text, identifier) => (text.match(/[A-Za-z0-9]+(?:[_.-][A-Za-z0-9]+)*/g) ?? []).includes(identifier);
const unfinished = /\{\{[^}]+\}\}|\b(?:TODO|TBD|FIXME)\b|Authoring template/i;
const forbiddenShell = /\b(?:git\s+(?:push\b|remote\s+(?:add|remove|rename|set-url|prune|update)\b|reset\s+--hard\b|clean\b|branch\s+-D\b)|gh\s+(?:pr|issue|api|repo)\b|npm\s+publish\b|(?:directive|deft)\s+(?:deploy|publish|release)\b|rm\s+-[\w-]*r|Remove-Item\b|(?:del|rmdir)\s+\/s\b|curl\b|wget\b|Invoke-WebRequest\b|Invoke-RestMethod\b)/i;
const forbiddenFixture = /\bgit\s+push\b|\bgh\s+(?:pr|issue|api|repo)\b|\brmSync\s*\(|\bunlinkSync\s*\(/i;

function exactBaseline(path, prose, heading) {
  const row = section(prose, heading).match(/^\| Directive baseline\s*\|([^\n]+)$/m)?.[1];
  assert.ok(row?.includes("0.119.5"), `${path} must declare exact Directive 0.119.5`);
  assert.deepEqual([...new Set(row.match(/\b\d+\.\d+\.\d+\b/g))], ["0.119.5"], `${path} contains a stale or ranged Directive baseline`);
}

function requireOutcomes(path, prose, headings) {
  for (const heading of headings) {
    const body = section(prose, heading);
    for (const outcome of outcomes) assert.ok(hasExactIdentifier(body, outcome), `${path} ${heading} is missing ${outcome}`);
  }
}

function requireModule7Link(content, label) {
  assert.match(content, /\]\([^)]*07-scope-lifecycle\.md(?:#[^)]*)?\)/, `${label} is missing Module 7 navigation`);
}

const EM_DASH = "\u2014";
const POSIX_STARTING_BRANCH = `macOS/zsh ${EM_DASH} verified locally; Linux/bash ${EM_DASH} candidate`;
const WINDOWS_STARTING_BRANCH = `Windows/PowerShell 7.4+ ${EM_DASH} candidate pending native evidence`;

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

function escapeHeading(heading) {
  return heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Labs 7 and 10 share this starting-state shape; Module 7 passes its own relationship. */
function assertWindowsStartingState(labPath, body, options) {
  const environment = exactHeadingSlice(body, "Environment and starting-state check", 2);
  const beforeBranch = environment.split(/^### /m)[0];
  assert.doesNotMatch(
    beforeBranch,
    /Use a dedicated zsh terminal/,
    `${labPath} must not leave "Use a dedicated zsh terminal" as the unbranched first instruction`,
  );
  assert.match(
    environment,
    new RegExp(`^### ${escapeHeading(POSIX_STARTING_BRANCH)}$`, "m"),
    `${labPath} Environment section must keep the macOS/zsh and Linux/bash sibling branch`,
  );
  assert.match(
    environment,
    new RegExp(`^### ${escapeHeading(WINDOWS_STARTING_BRANCH)}$`, "m"),
    `${labPath} Environment section is missing the Windows starting-state branch`,
  );
  assert.match(beforeBranch, /not verified preflight/, `${labPath} starting-state check must not promote a candidate platform to verified preflight`);
  assert.match(beforeBranch, /environment-blocked/, `${labPath} starting-state check must keep the environment-blocked stop`);
  const windows = exactHeadingSlice(environment, WINDOWS_STARTING_BRANCH, 3);
  const code = powershellText(windows);
  assert.ok(code.trim(), `${labPath} Windows starting-state branch is missing a PowerShell block`);
  for (const tool of ["node --version", "git --version", "task --version", "uv --version"]) {
    assert.ok(code.includes(tool), `${labPath} Windows starting-state branch is missing tool check: ${tool}`);
  }
  assert.match(code, /npm(?:\.cmd)? --version/, `${labPath} Windows starting-state branch is missing tool check: npm`);
  assert.ok(code.includes(options.helperPath), `${labPath} Windows starting-state branch is missing the helper path`);
  const create = code.search(/node \$Helper create\b/);
  const guard = code.search(/node \$Helper guard\b/);
  const install = code.search(/node \$Helper install\b/);
  assert.ok(create >= 0, `${labPath} Windows starting-state branch is missing create`);
  assert.ok(guard >= 0, `${labPath} Windows starting-state branch is missing guard`);
  assert.ok(install >= 0, `${labPath} Windows starting-state branch is missing install`);
  assert.ok(
    create < guard && guard < install,
    `${labPath} Windows starting-state must run create, then guard, then install`,
  );
  assert.doesNotMatch(code, /\barchive\b/, `${labPath} must not move the whole-lab route into the starting-state check`);
  if (options.pythonOrder) {
    const python = code.search(/@\('python', 'python3', 'py'\)/);
    assert.ok(python >= 0, `${labPath} Windows starting-state branch must check Python as python, python3, then py`);
    assert.ok(python < create, `${labPath} Windows starting-state must check Python before create`);
  }
  const route = exactHeadingSlice(body, "Native Windows PowerShell 7.4+ route", 2);
  assert.match(route, /^## Native Windows PowerShell 7\.4\+ route$/m, `${labPath} must keep the Native Windows heading as the candidate whole-lab path`);
  assert.doesNotMatch(route, /verified starting-state/i, `${labPath} must not relabel the Native Windows route as the verified starting-state check`);
  assert.match(route, /candidate whole-lab path/, `${labPath} must keep the Native Windows route as a candidate whole-lab path`);
  assert.match(route, /not verified preflight/, `${labPath} must not promote the compressed route to verified preflight`);
  assert.match(route, /environment-blocked/, `${labPath} compressed route must keep the environment-blocked stop`);
  assert.match(route, options.relationship, `${labPath} must state how the compressed route relates to the ordered tasks`);
  assert.match(route, /alternative paths/, `${labPath} must state that starting-state and the whole-lab route are alternative paths`);
  assert.match(route, /Do not run both/, `${labPath} must say not to run both Windows attempts`);
  const routeCode = powershellText(route);
  assert.match(routeCode, /node \$Helper create\b/, `${labPath} Native Windows route must remain a whole-lab script`);
  assert.match(routeCode, /\barchive\b/, `${labPath} Native Windows route must remain a whole-lab script`);
  const pause = routeCode.search(/Read-Host/);
  const authoredCheck = routeCode.search(/Test-Path -LiteralPath \$Authored/);
  assert.ok(pause >= 0, `${labPath} compressed Windows route must pause for the required learner edit`);
  assert.ok(authoredCheck >= 0 && pause < authoredCheck, `${labPath} compressed Windows route must pause before the authored-scope check`);
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
    assert.ok(moduleProse.toLowerCase().includes(term), `${module7} is missing lifecycle or authority concept: ${term}`);
  }
  const startingState = section(moduleProse, "Starting-state check");
  assert.match(startingState, /passing O6\.4 routing matrix/i, "Module 7 must require the passing O6.4 routing matrix before the lab");
  assert.match(startingState, /all three fixed rows/i, "Module 7 must require all three fixed O6.4 rows");
  for (const field of ["controlling supplied fact", "disposition", "safe next action"]) {
    assert.ok(startingState.toLowerCase().includes(field), `Module 7 O6.4 prerequisite is missing ${field}`);
  }
  assert.match(startingState, /route row names `NS-INGEST-R2`/i, "Module 7 must require the O6.4 target revision");
  assert.match(startingState, /required and non-compensating/i, "Module 7 must make the O6.4 prerequisite non-compensating");
  assert.match(startingState, /presence-only, keyword-only, or incomplete/i, "Module 7 must reject superficial O6.4 evidence");
  assert.match(startingState, /curricular and human-semantic/i, "Module 7 must identify the O6.4 hold as human-semantic");
  assert.match(startingState, /Directive 0\.119\.5 does not compute whether work\s+is mechanism-shaped/i, "Module 7 must not attribute mechanism-shaped judgment to Directive");
  assert.match(startingState, /`scope:promote` is not fail-closed on that judgment/i, "Module 7 must not present scope:promote as the routing boundary");
  assert.match(startingState, /does not claim that Directive enforced the\s+decision/i, "Module 7 must preserve the curricular enforcement boundary");
  assert.match(section(moduleProse, "Navigation"), /\]\(06-creating-well-shaped-work\.md\)/, "Module 7 must link back to Module 6");
  assert.match(section(moduleProse, "Navigation"), /\]\(\.\.\/README\.md\)/, "Module 7 must link to the course map");
  assert.match(section(moduleProse, "Navigation"), /\]\(08-session-and-work-selection\.md\)/, "Module 7 must link to Module 8");

  // The explained solution lives in solutions/, so the Module 7 Navigation href above does not
  // resolve from there. Its Continue section keeps the self-assessment return and must forward
  // the learner to the shipped Module 8 lesson through a solutions-relative href.
  const solutionProse = parsed.get(solution7).prose;
  const solutionContinue = section(solutionProse, "Continue");
  assert.doesNotMatch(
    solutionProse,
    /Module 8 remains planned/i,
    `${solution7} must not claim that Module 8 is planned`,
  );
  assert.doesNotMatch(
    solutionProse,
    /rather than assuming a future filename is ready/i,
    `${solution7} must not keep the course-map fallback that was written for an unshipped Module 8`,
  );
  assert.match(
    solutionContinue,
    /\]\(\.\.\/curriculum\/modules\/07-scope-lifecycle\.md(?:#[^)]*)?\)/,
    `${solution7} Continue must return the learner to Module 7 and its self-assessment`,
  );
  assert.match(
    solutionContinue,
    /\]\(\.\.\/curriculum\/modules\/08-session-and-work-selection\.md(?:#[^)]*)?\)/,
    `${solution7} Continue must link the shipped Module 8 lesson with the solutions-relative href`,
  );

  const labSafety = section(parsed.get(lab7).prose, "Safety boundary");
  const isolatedTools = labSafety.match(/The local Task environment[\s\S]*?No GitHub\s+operation is performed\./)?.[0] ?? "";
  assert.match(isolatedTools, /individually\s+resolved[^.]*`git`, `python`, `uv`/, "Lab 7 isolated tools must include Python");
  assert.match(isolatedTools, /`python3` then `python` on macOS\/Linux/, "Lab 7 must document the POSIX Python lookup order");
  assert.match(isolatedTools, /`python`, `python3`, then\s+`py` on Windows/, "Lab 7 must document the Windows Python lookup order");
  assert.match(isolatedTools, /presence only[\s\S]*does not compare a Python version/, "Lab 7 must keep Python presence-only");
  assert.match(
    isolatedTools,
    /Do not treat Python as a generic\s+prerequisite for Directive verification[\s\S]*Labs 7, 10, and 11 helpers\s+construct isolated `PATH`s[\s\S]*capstone\s+constructs `isolatedEnv`/,
    "Lab 7 must distinguish helper-isolated PATH requirements from a generic Directive prerequisite",
  );

  const labBlocks = parsed.get(lab7).blocks.filter(({ language }) => /^(?:sh|bash|zsh|console)$/.test(language)).map(({ content: block }) => block).join("\n");
  const pythonPreflightMessage = "Lab 7 Python preflight must mirror the helper PATH scan and selected candidate";
  assert.match(labBlocks, /for python_name in python3 python; do\s+python_search=\$PATH\s+while \[ -n "\$python_search" \]; do/, pythonPreflightMessage);
  assert.match(labBlocks, /case "\$python_search" in\s+\*:\*\)\s+python_directory=\$\{python_search%%:\*\}\s+python_search=\$\{python_search#\*:\}\s+;;\s+\*\)\s+python_directory=\$python_search\s+python_search=\s+;;\s+esac/, pythonPreflightMessage);
  assert.match(labBlocks, /\[ -n "\$python_directory" \] \|\| continue\s+python_candidate="\$python_directory\/\$python_name"\s+if \[ -e "\$python_candidate" \]; then\s+python_command="\$python_candidate"\s+break 2[\s\S]*"\$python_command" --version/, pythonPreflightMessage);
  assert.doesNotMatch(labBlocks, /command -v python(?:3)?/, "Lab 7 Python preflight must not use shell-only resolution");
  assert.match(labBlocks, /helper="[^"\n]*lifecycle-lab\.mjs"/, `${lab7} must bind the supplied lifecycle helper`);
  for (const command of ["create", "install", "run", "reset", "archive"]) assert.match(labBlocks, new RegExp(`node\\s+"\\$helper"\\s+${command}\\b`), `${lab7} must include the ${command} helper command`);
  assert.match(labBlocks, /run[^\n]*--intent=implement/, `${lab7} run must carry explicit live implementation intent`);

  const helperBody = content.get(helper);
  const safetyBody = content.get(safety);
  assert.doesNotMatch(helperBody + "\n" + safetyBody, forbiddenFixture, "fixture contains a forbidden remote or destructive command");
  for (const token of ["mkdtempSync", "3ci-directive-lab07-", "assertNoGitRedirection", 'git(root, ["remote"])', "exact 0.119.5 pin required"]) assert.ok((helperBody + safetyBody).includes(token), `fixture is missing safety token: ${token}`);
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
  assert.equal(fixtureManifest.devDependencies?.["@deftai/directive"], "0.119.5", "fixture must pin Directive exactly");
  for (const name of ["directive-core", "directive-content", "directive-types"]) assert.equal(fixtureManifest.overrides?.[`@deftai/${name}`], "0.119.5", `fixture must pin ${name} exactly`);
  assert.equal(JSON.parse(content.get(fixtureProject)).xBRIEFInfo?.version, "0.8", "fixture project must use xBRIEF 0.8");

  const notes = content.get("references/SOURCE-NOTES.md");
  assert.match(notes, /^## Module 7 (?:source validation|verification)\s*$/m, "SOURCE-NOTES is missing the Module 7 source validation record");
  const baseline = content.get("references/SOURCE-BASELINE.md");
  for (const [platform, expected] of [["macos-zsh", "verified"], ["linux-bash", "candidate"], ["windows-pwsh7", "candidate"]]) {
    const matches = [...baseline.matchAll(new RegExp(`teaching-platform-proof:${platform} status=(verified|candidate) date=(\\d{4}-\\d{2}-\\d{2}) evidence=([^\\s\x60]+)`, "g"))];
    assert.equal(matches.length, 1, `SOURCE-BASELINE must contain exactly one current proof marker for ${platform}`);
    assert.equal(matches[0][1], expected, `${platform}: unsupported current Module 7 platform claim`);
    if (expected === "verified") assert.doesNotMatch(matches[0][3], /^(?:none|not-run|pending|unknown)$/, `${platform}: verified status requires evidence`);
  }
  for (const path of [module7, lab7, solution7]) {
    assert.match(parsed.get(path).prose, /Linux[\s\S]{0,180}candidate|candidate[\s\S]{0,180}Linux/i, `${path} must keep Linux as a candidate`);
    assert.match(parsed.get(path).prose, /Windows[\s\S]{0,180}candidate|candidate[\s\S]{0,180}Windows/i, `${path} must keep Windows as a candidate`);
  }

  const course = content.get("curriculum/README.md");
  assert.match(course, /0\.119\.5 executable path is verified locally on[\s\S]{0,100}macOS\/zsh/i, "course overview must retain current macOS/zsh evidence");
  assert.match(course, /Linux\/bash and Windows\/PowerShell remain candidates/i, "course overview must keep Linux and Windows as candidates");
  const module7Row = courseModuleRow(course, 7);
  assert.match(module7Row, /07-scope-lifecycle\.md/, "Module 7 course row must link the lesson");
  assert.doesNotMatch(module7Row, /\|\s*Planned\s*\|/i, "Module 7 must no longer be planned");
  assert.match(module7Row, /verified on macOS\/zsh; Linux and Windows candidates/i, "Module 7 course row must retain current platform boundaries");
  assert.match(courseModuleRow(course, 8), /08-session-and-work-selection\.md/, "Module 8 course row must retain its lesson link");
  for (const path of ["README.md", "curriculum/README.md", "labs/README.md", "solutions/README.md", "assessments/README.md"]) {
    requireModule7Link(content.get(path), path);
    verifyLinks(root, path, markdownParts(content.get(path)).prose);
  }
  const labsIndex = content.get("labs/README.md");
  assert.match(labsIndex, /^\| \[Lab 7[^\n]*\]\(07-scope-lifecycle\.md\) \| Learner-ready draft;[^\n]*macOS\/zsh; Linux and Windows candidates[^\n]*\|/m, "labs/README.md must list Lab 7 with the current platform boundary");
  assert.doesNotMatch(labsIndex, /Labs for Modules? 6(?:[–-]| through )11/, "labs/README.md must not classify Lab 7 inside an unavailable Modules 6–11 range");
  for (const term of ["promotion", "activation", "live implementation intent", "lifecycle evidence"]) assert.match(content.get("references/GLOSSARY.md"), new RegExp(term, "i"), `glossary is missing Module 7 term: ${term}`);
  for (const phrase of ["task deft:scope:promote", "task deft:scope:activate", "task deft:xbrief:preflight", "live implementation intent"]) assert.match(content.get("references/QUICK-REFERENCE.md"), new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `quick reference is missing Module 7 guidance: ${phrase}`);
  assert.match(content.get("references/SOURCE-BASELINE.md"), /^## Module 7 (?:source boundary|lifecycle validation)\s*$/m, "source baseline is missing Module 7 lifecycle validation");

  // The lab ends at local closeout, so its Done statement must name the gate that decides tracked closeout.
  const labDone = section(parsed.get(lab7).prose, "Done statement");
  assert.ok(labDone.includes("`verify:completed-tracked`"), `${lab7} Done statement must name verify:completed-tracked as the tracked-closeout gate`);
  assert.match(labDone, /\]\([^)]*12-review-and-completion\.md(?:#[^)]*)?\)/, `${lab7} Done statement must forward-link Module 12 for tracked closeout`);
  assert.match(labDone, /claims no\s+leftover completion and no tracked closeout/, `${lab7} Done statement must state that this no-remote lab claims no tracked closeout`);
  assert.doesNotMatch(labDone, /swarm:finalize-cohort/, `${lab7} Done statement must keep cohort orchestration out of the lab sequence`);

  // Quick Reference sits outside the forbiddenShell loop above, so its leftover-completion block needs explicit assertions.
  const quickReference = content.get("references/QUICK-REFERENCE.md");
  const quickReferenceParts = markdownParts(quickReference);
  // Every command sequence on this surface is a `text` fence, including the Module 7 no-remote block,
  // so this scan is language-independent on purpose: a shell-language filter would miss the exact block
  // the contract protects. These verbs stay in prose on this reference, never inside a fence.
  const leftoverVerbs = /verify:orphan-active|verify:completed-tracked|swarm:finalize-cohort/;
  assert.ok(
    !quickReferenceParts.blocks.some(({ content: block }) => leftoverVerbs.test(block)),
    "quick reference must keep leftover-completion verbs in prose, out of every fenced command block, including the Module 7 no-remote sequence",
  );
  const leftoverBlock = section(quickReferenceParts.prose, "Leftover completion and tracked closeout");
  for (const verb of ["verify:orphan-active", "verify:completed-tracked"]) {
    assert.ok(leftoverBlock.includes(`\`${verb}\``), `quick reference leftover-completion block is missing ${verb}`);
  }
  assert.match(leftoverBlock, /no-remote/i, "quick reference leftover-completion block must keep its remote precondition");
  assert.match(leftoverBlock, /general repair[\s\S]{0,160}lifecycle pull request/i, "quick reference leftover-completion block must name a lifecycle pull request as the general repair");
  assert.ok(leftoverBlock.includes("`swarm:finalize-cohort`"), "quick reference leftover-completion block must name the advanced swarm closer");
  assert.match(leftoverBlock, /advanced orchestration/i, "quick reference must treat the advanced swarm closer as orchestration, not a learner step");
  assert.match(leftoverBlock, /never invokes it/i, "quick reference must keep the advanced swarm closer named but not invoked");
  assert.equal(
    (quickReference.match(/swarm:finalize-cohort/g) ?? []).length,
    1,
    "quick reference must name swarm:finalize-cohort exactly once",
  );

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
  assertTeachingBaselinePin(projectPackage, content.get("README.md"));
  assertWindowsStartingState(lab7, content.get(lab7), {
    helperPath: "labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs",
    pythonOrder: true,
    relationship: /replaces the ordered helper commands in Tasks 1-4[\s\S]*still write the Module 6 proposed-scope file/,
  });
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
