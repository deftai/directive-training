import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { assertTeachingBaselinePin } from "./teaching-baseline.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));

const requiredFiles = [
  ".github/workflows/modules-2-3-platform-validation.yml",
  "README.md",
  "assessments/README.md",
  "curriculum/README.md",
  "curriculum/modules/01-what-directive-is.md",
  "curriculum/modules/02-installation-and-anatomy.md",
  "curriculum/modules/03-authority-and-context.md",
  "labs/02-disposable-initialization.md",
  "labs/fixtures/02-disposable-initialization/init-lab.mjs",
  "labs/fixtures/02-disposable-initialization/package.json",
  "labs/README.md",
  "package.json",
  "references/GLOSSARY.md",
  "references/QUICK-REFERENCE.md",
  "references/SOURCE-BASELINE.md",
  "references/SOURCE-NOTES.md",
  "solutions/README.md",
  "solutions/lab-02-disposable-initialization.md",
  "solutions/module-01-what-directive-is.md",
  "solutions/module-03-authority-and-context.md",
];

// Normalize at the read boundary so every content and local-heading check sees the same lines.
const readText = (path) => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const read = (relativePath) => readText(resolve(root, relativePath));
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Keep this verifier self-contained: the portability suite copies it without the later-module
// verifiers, so Module 2's reclaim contract cannot depend on verify-modules-4-5.mjs.
function markdownParts(content) {
  const prose = [];
  const blocks = [];
  let fence;
  for (const line of content.split(/\r?\n/)) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (!fence && marker) {
      fence = { marker: marker[1], language: marker[2].trim().toLowerCase(), lines: [] };
    } else if (fence && marker && marker[1][0] === fence.marker[0] && marker[1].length >= fence.marker.length && !marker[2].trim()) {
      blocks.push({ language: fence.language, content: fence.lines.join("\n") });
      fence = undefined;
    } else if (fence) {
      fence.lines.push(line);
    } else {
      prose.push(line);
    }
  }
  assert.ok(!fence, "unclosed Markdown code fence");
  return { prose: prose.join("\n"), blocks };
}

function headingSection(markdown, heading) {
  const normalized = markdown.replace(/\r\n?/g, "\n");
  const headings = [...normalized.matchAll(/^(#{2,4}) (.+?)[ \t]*#*[ \t]*$/gm)];
  const start = headings.find((match) => match[2] === heading);
  assert.ok(start, `missing heading: ${heading}`);
  const level = start[1].length;
  const end = headings.find((match) => match.index > start.index && match[1].length <= level);
  return normalized.slice(start.index + start[0].length, end?.index ?? normalized.length);
}

function declaredFunction(source, name, label) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `${label} must define ${name}`);
  const signature = /\)\s*\{/.exec(source.slice(start));
  assert.ok(signature, `${label} has a malformed ${name} declaration`);
  const open = start + signature.index + signature[0].lastIndexOf("{");
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    else if (source[index] === "}" && --depth === 0) return source.slice(start, index + 1);
  }
  assert.fail(`${label} has an unterminated ${name} declaration`);
}

function assertModule2ReclaimHelperContract(helper) {
  const label = "Lab 2 helper";
  const preview = declaredFunction(helper, "previewReclaim", label);
  const reclaim = declaredFunction(helper, "reclaimArchives", label);
  const archivedIdentity = declaredFunction(helper, "verifyArchivedModule02", label);
  const archive = declaredFunction(helper, "archiveAttempt", label);
  const reset = declaredFunction(helper, "resetAttempt", label);
  const rollback = declaredFunction(helper, "rollbackIncompleteSeed", label);

  assert.match(helper, /3ci-directive-module-02-archive\./, `${label} is missing its exact archive class`);
  assert.match(preview, /3ci-directive-module-02-archive\.|startsWith\(archivePrefix\)/, `${label} preview must filter its exact archive prefix`);
  assert.doesNotMatch(preview, /\b(?:mkdirSync|mkdtempSync)\s*\(/, `${label} reclaim preview must create no directories`);
  assert.match(helper, /\bisAbsolute\([^)]*\)[\s\S]{0,160}\bresolve\([^)]*\)\s*===/, `${label} reclaim must require absolute canonical targets`);
  assert.match(helper, /\bisSymbolicLink\(\)/, `${label} reclaim must reject symlinks`);
  assert.match(helper, /\b(?:realpathSync|canonicalPath)\s*\(/, `${label} reclaim must recheck canonical identity`);
  assert.match(archivedIdentity, /marker\.lab/, `${label} reclaim must verify the archive marker lab identity`);
  assert.match(archivedIdentity, /marker\.root/, `${label} reclaim must verify the archive marker root identity`);
  assert.match(archivedIdentity, /\["remote"\]/, `${label} reclaim must reject archived repositories with remotes`);
  assert.match(archivedIdentity, /\.git/, `${label} reclaim must verify the archived Git identity`);
  assert.match(reclaim, /assert\.equal\(confirmed,\s*true\b/, `${label} reclaim apply requires explicit confirmation`);
  assert.match(reclaim, /new Set\(previewReclaim\(/, `${label} reclaim apply must use a fresh preview`);
  assert.match(reclaim, /previewed\.has\(target\)/, `${label} reclaim apply must accept only exact previewed targets`);
  assert.match(reclaim, /\bisAbsolute\(target\)[\s\S]{0,100}\bresolve\(target\)\s*===\s*target/, `${label} reclaim apply must reject relative or noncanonical targets`);
  const revalidate = reclaim.lastIndexOf("verifyArchivedModule02(target");
  const remove = reclaim.indexOf("rmSync(target");
  assert.ok(revalidate >= 0 && remove > revalidate, `${label} reclaim apply must revalidate immediately before deletion`);
  assert.match(rollback, /dirname\(root\)[\s\S]{0,100}parent/, `${label} rollback must bind deletion to the captured direct parent`);
  assert.match(rollback, /attemptPattern\.test\(basename\(root\)\)/, `${label} rollback must require the helper-created attempt identity`);
  assert.match(rollback, /isDirectory\(\)[\s\S]{0,100}!lstatSync\(root\)\.isSymbolicLink\(\)/, `${label} rollback must require a plain non-linked directory`);
  assert.match(rollback, /canonicalPath\(root\)[\s\S]{0,60}root/, `${label} rollback must recheck the exact canonical root`);
  assert.match(rollback, /rmSync\(root,\s*\{\s*force:\s*true,\s*recursive:\s*true\s*\}\)/, `${label} rollback may remove only the exact unpublished root`);
  assert.equal((helper.match(/\brmSync\s*\(/g) ?? []).length, 2, `${label} may delete only an exact unpublished seed and a validated archive`);
  assert.equal((rollback.match(/\brmSync\s*\(/g) ?? []).length, 1, `${label} rollback must own exactly one bounded tree deletion`);
  assert.equal((reclaim.match(/\brmSync\s*\(/g) ?? []).length, 1, `${label} validated reclaim apply must own exactly one archive deletion`);
  assert.match(archive, /renameSync\(parent,\s*(?:destination|archiveTarget)\)/, `${label} archive must remain a same-volume rename`);
  const resetValidation = reset.indexOf("verifyArchivedModule02(");
  const resetCreate = reset.indexOf("createAttempt(");
  assert.ok(resetValidation >= 0 && resetCreate > resetValidation, `${label} reset must validate the post-archive destination before fresh-attempt reset creation`);
  assert.match(helper, /(?:verb|args\[0\])\s*===\s*"reclaim"[\s\S]{0,160}previewReclaim\(/, `${label} CLI must expose read-only reclaim preview`);
  assert.match(helper, /"--confirm"[\s\S]{0,180}reclaimArchives\([^;]+confirmed:\s*true/, `${label} CLI must expose exact confirmed reclaim apply`);
}

function assertModule2EnospcContract(lab) {
  const label = "Lab 2";
  const expectedFailures = headingSection(markdownParts(lab).prose, "Expected failures and recovery");
  assert.match(expectedFailures, /ENOSPC[\s\S]{0,100}no space left on device/i, `${label} must name ENOSPC and no-space-left`);
  assert.match(expectedFailures, /environment stop/i, `${label} must classify ENOSPC as an environment stop`);
  assert.match(
    expectedFailures,
    /(?:(?:Do not retry|remain blocked)[\s\S]{0,180}\bcreate\b[\s\S]{0,80}\breset\b[\s\S]{0,80}Route A[\s\S]{0,140}\breclaim\b|archive-reclaim[\s\S]{0,120}\bcreate\b[\s\S]{0,80}\breset\b[\s\S]{0,80}Route A[\s\S]{0,100}remain blocked until capacity returns)/i,
    `${label} ENOSPC recovery must block create, reset, and Route A until reclaim`,
  );
  assert.match(lab, /current attempt(?: parent)?[\s\S]{0,100}one (?:fresh |fully installed )?reset attempt(?: parent)?[\s\S]{0,100}npm\s+extraction\s+slack/i, `${label} must teach the per-environment peak-space recipe`);
  assert.match(lab, /no universal\s+20 GB floor/i, `${label} must not turn the reported 20 GB into a universal floor`);

  const recovery = headingSection(lab, "Disk-full recovery");
  assert.ok(recovery.includes("3ci-directive-module-02-archive.<unique>"), `${label} must name its exact archive destination class`);
  assert.match(recovery, /read-only[\s\S]{0,600}creates no archive directory[\s\S]{0,120}zero\s+(?:writable|free)\s+space/i, `${label} reclaim preview must be read-only and zero-space safe`);
  assert.match(recovery, /^\s*node [^\n]*\breclaim\s*$/m, `${label} must show the read-only reclaim preview command`);
  assert.match(recovery, /^\s*[^\n]*node [^\n]*\breclaim --confirm [^\n]+$/m, `${label} must show exact confirmed reclaim apply`);
  const confirmed = recovery.indexOf("reclaim --confirm");
  const afterConfirmed = recovery.slice(confirmed);
  const archive = afterConfirmed.search(/\barchive\b/);
  const reset = afterConfirmed.search(/\breset\b/);
  assert.ok(confirmed >= 0 && archive > 0 && reset > archive, `${label} disk-full recovery must reclaim, then archive, then reset`);
  assert.match(recovery, /same-volume[\s\x60]*archive[\s\x60]*rename|same-volume[\s\S]{0,40}rename/i, `${label} must preserve archive as a same-volume rename`);
  const normalizedRecovery = recovery.toLowerCase().replace(/\s+/g, " ");
  for (const unsafe of ["live attempt", "curriculum clone", "remote-bearing repository", "symlink", "identity mismatch"]) {
    assert.ok(normalizedRecovery.includes(unsafe), `${label} reclaim must reject ${unsafe}`);
  }
  assert.match(recovery, /(?:only the confirmed[\s\S]{0,80}archive[\s\S]{0,100}(?:contained|local\s+npm)\s+cache|confirmed archive[\s\S]{0,80}(?:contained|local\s+npm)\s+cache only)/i, `${label} reclaim must delete only the confirmed archive and its cache`);
  assert.match(recovery, /live[\s\S]{0,80}cache[\s\S]{0,100}isolated[\s\S]{0,100}untouched|live cache remains isolated and untouched|does not touch the live failed attempt or its\s+cache/i, `${label} reclaim must preserve the live isolated cache`);
  assert.match(recovery, /(?:Never use|Do not introduce) a shared npm\s+cache/i, `${label} must not introduce a shared npm cache`);
  assert.match(recovery, /(?:(?:Never use|do not treat)[\s\S]{0,100}empty launcher\s+director(?:y|ies)[\s\S]{0,80}(?:remedy|recovery|workaround)|empty launcher\s+director(?:y|ies)[\s\S]{0,80}(?:not|no)[\s\S]{0,80}(?:remedy|recovery|workaround))/i, `${label} must reject empty-launcher cleanup as the remedy`);
}

function assertDiskCapacityGuideContract(courseMap, labsGuide) {
  assert.match(courseMap, /current attempt[\s\S]{0,100}one fresh reset attempt[\s\S]{0,100}npm\s+extraction\s+slack/i, "course map must teach the per-environment peak-space recipe");
  assert.match(courseMap, /(?:no universal|not substitute a universal)\s+20 GB floor/i, "course map must not teach a universal 20 GB floor");
  assert.match(courseMap, /ENOSPC[\s\S]{0,80}no space left on device[\s\S]{0,100}environment stop[\s\S]{0,120}\bcreate\b[\s\S]{0,80}\breset\b[\s\S]{0,80}Route A[\s\S]{0,100}blocked[\s\S]{0,100}reclaim/i, "course map must block create, reset, and Route A during an ENOSPC environment stop until reclaim");
  assert.match(courseMap, /Each attempt keeps its\s+own npm cache[\s\S]{0,80}shared cache is outside/i, "course map must require attempt-local npm caches");
  for (const archiveClass of [
    "3ci-directive-module-02-archive.<unique>",
    "3ci-directive-lab-archive/",
    "3ci-directive-capstone-archive/",
  ]) {
    assert.ok(labsGuide.includes(archiveClass), `lab environment guide is missing archive class: ${archiveClass}`);
  }
  assert.match(labsGuide, /A helper never crosses these classes/i, "lab environment guide must keep the three archive classes disjoint");
  const capacity = headingSection(labsGuide, "Disk capacity and ENOSPC recovery");
  assert.match(capacity, /representative successful run[\s\S]{0,120}fully installed current attempt[\s\S]{0,120}one fully installed reset attempt/i, "lab environment guide must size from representative installed attempts");
  assert.match(capacity, /Before a first run[\s\S]{0,120}estimate[\s\S]{0,180}representative successful\s+run[\s\S]{0,180}same\s+environment/i, "lab environment guide must distinguish first-run estimation from measured capacity");
  assert.match(capacity, /matching record[\s\S]{0,260}(?:version|package graph)[\s\S]{0,260}(?:measured terms|three terms)/i, "a first-run record must carry enough applicability evidence to be actionable");
  assert.match(capacity, /no matching record[\s\S]{0,260}approved bootstrap[\s\S]{0,260}monitor/i, "the first-run guide must supply a safe bootstrap path when no matching record exists");
  assert.match(capacity, /no matching record[\s\S]{0,500}no approved bootstrap[\s\S]{0,160}environment-blocked/i, "the first-run guide must stop when neither evidence path is available");
  assert.match(capacity, /if \(-not \(Test-Path -LiteralPath \$Path\)\) \{ throw /, "PowerShell capacity measurement must reject a missing tree instead of counting it as zero");
  assert.match(capacity, /current attempt \+ one reset attempt \+ npm extraction slack/i, "lab environment guide is missing the exact peak-space recipe");
  assert.match(capacity, /no universal\s+20 GB minimum/i, "lab environment guide must reject a universal 20 GB minimum");
  assert.match(capacity, /ENOSPC[\s\S]{0,80}no space left on device[\s\S]{0,100}environment stop/i, "lab environment guide must classify ENOSPC as an environment stop");
  assert.match(capacity, /Do not retry[\s\S]{0,100}\bcreate\b[\s\S]{0,80}\breset\b[\s\S]{0,80}Route A[\s\S]{0,180}reclaim/i, "lab environment guide must block allocation until reclaim");
  assert.match(capacity, /^node <helper> reclaim\s*$/m, "lab environment guide must show read-only reclaim preview");
  assert.match(capacity, /^node <helper> reclaim --confirm <exact-older-archive-path-printed-by-preview>\s*$/m, "lab environment guide must show exact confirmed reclaim apply");
  assert.match(capacity, /read-only[\s\S]{0,80}creates no archive directory[\s\S]{0,120}no writable space/i, "lab environment guide must make preview zero-space safe");
  assert.match(capacity, /confirm only exact older archive destinations[\s\S]{0,180}revalidates immediately before deletion/i, "lab environment guide must constrain confirmed deletion to a fresh preview");
  const normalizedCapacity = capacity.toLowerCase().replace(/\s+/g, " ");
  for (const unsafe of ["live attempt", "curriculum clone", "repository with a remote", "symlink", "identity mismatch", "relative path", "another archive class"]) {
    assert.ok(normalizedCapacity.includes(unsafe), `lab environment guide reclaim must reject ${unsafe}`);
  }
  assert.match(capacity, /After capacity returns[\s\S]{0,120}archive the live failed parent[\s\S]{0,120}(?:reset|create)[\s\S]{0,80}fresh attempt/i, "lab environment guide must reclaim, archive, then replace the attempt");
  assert.match(capacity, /live failed parent[\s\S]{0,120}\bcreate\b[\s\S]{0,100}printed[\s\S]{0,80}repository root/i, "lab environment guide must identify an archivable failed parent by the printed create root");
  assert.match(capacity, /\bcreate\b[\s\S]{0,80}does not run package installation[\s\S]{0,140}later\s+`install`[\s\S]{0,180}package tree is partial/i, "lab environment guide must distinguish a partial install from create");
  assert.match(capacity, /create`? itself stops before[\s\S]{0,80}returning a root[\s\S]{0,220}reclaim a valid older archive[\s\S]{0,140}rerun[\s\S]{0,80}\bcreate\b/i, "lab environment guide must route an interrupted create without guessing a partial path");
  assert.match(capacity, /Module 2[\s\S]{0,100}reset sibling transactionally[\s\S]{0,180}exact unpublished[\s\S]{0,120}previous valid marker[\s\S]{0,180}previous root[\s\S]{0,80}archived and reclaimed/i, "Module 2 reset failure must preserve a reclaimable prior attempt");
  assert.match(capacity, /confirmed archive[\s\S]{0,80}contained cache only[\s\S]{0,100}never deletes a\s+live cache/i, "lab environment guide must bound deletion to the confirmed archive and its cache");
  assert.match(capacity, /Every npm cache remains attempt-local/i, "lab environment guide must prohibit shared npm caches");
  assert.match(capacity, /Empty launcher directories[\s\S]{0,100}not the primary remedy/i, "lab environment guide must reject empty-launcher cleanup as the remedy");
  const independent = headingSection(labsGuide, "Independent recovery order");
  const enospc = independent.indexOf("If the error is `ENOSPC`");
  const otherError = independent.indexOf("For any other error");
  const routeA = independent.indexOf("If non-ENOSPC state remains uncertain");
  assert.ok(enospc >= 0 && otherError > enospc && routeA > otherError, "independent recovery must route ENOSPC before ordinary Route A recovery");
  assert.match(independent, /read-only reclaim preview[\s\S]{0,100}exact older archive[\s\S]{0,120}archive the failed live parent[\s\S]{0,80}then reset/i, "independent recovery must reclaim an older archive, archive the live parent, then reset");
}

const courseMarkdownRoots = ["assessments", "curriculum", "labs", "maintainers", "references", "solutions", "templates"];
const courseSourceFiles = ["README.md", "xbrief/PROJECT-DEFINITION.xbrief.json"];
const collectMarkdown = (directory) => {
  for (const entry of readdirSync(resolve(root, directory), { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) collectMarkdown(path);
    else if (entry.isFile() && entry.name.endsWith(".md")) courseSourceFiles.push(path);
  }
};
for (const directory of courseMarkdownRoots) collectMarkdown(directory);

const claimLabel = /\b(?:Directive behavior|3Ci policy|Course guidance)\b/i;
for (const relativePath of courseSourceFiles) {
  assert.doesNotMatch(read(relativePath), claimLabel, `${relativePath} contains a removed claim label`);
}
for (const entry of readdirSync(resolve(root, "curriculum/modules"), { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
  const relativePath = `curriculum/modules/${entry.name}`;
  assert.doesNotMatch(read(relativePath), /\b3(?:\s|-)?ci\b/i, `${relativePath} contains organization-specific 3Ci language`);
}

for (const relativePath of requiredFiles) {
  const absolutePath = resolve(root, relativePath);
  assert.ok(existsSync(absolutePath), `missing required artifact: ${relativePath}`);
  assert.ok(statSync(absolutePath).size > 0, `required artifact is empty: ${relativePath}`);
}

const headingContracts = {
  "curriculum/modules/02-installation-and-anatomy.md": [
    "Module record",
    "Learning outcomes",
    "Starting-state check",
    "Why this matters",
    "Terminology",
    "Mental model",
    "Guided explanation",
    "Walkthrough",
    "Exercise",
    "Completion evidence",
    "Progressive hints",
    "Expected failures and recovery",
    "Common misconceptions",
    "Self-assessment",
    "Explained solution",
    "Navigation",
    "Official sources",
  ],
  "curriculum/modules/03-authority-and-context.md": [
    "Module record",
    "Learning outcomes",
    "Starting-state check",
    "Why this matters",
    "Terminology",
    "Mental model",
    "Guided explanation",
    "Walkthrough",
    "Exercise",
    "Completion evidence",
    "Progressive hints",
    "Expected failures and recovery",
    "Common misconceptions",
    "Self-assessment",
    "Explained solution",
    "Navigation",
    "Official sources",
  ],
  "labs/02-disposable-initialization.md": [
    "Lab record",
    "Goal and done condition",
    "Fictional scenario",
    "Environment and starting-state check",
    "Safety boundary",
    "Starting checkpoint",
    "Tasks",
    "Checkpoints",
    "Literal acceptance commands",
    "Evidence bundle",
    "Progressive hints",
    "Expected failures and recovery",
    "Reset to start",
    "Cleanup",
    "Explained solution",
    "Done statement",
  ],
  "solutions/lab-02-disposable-initialization.md": [
    "Solution record",
    "Before you use this solution",
    "Result summary",
    "Outcome map",
    "Reasoning",
    "Worked approach",
    "Acceptance evidence",
    "Compare with your attempt",
    "Valid alternatives",
    "Expected failures and recovery",
    "Misconceptions exposed by this exercise",
    "Retry plan",
    "Reset and cleanup",
    "Sources",
    "Continue",
  ],
  "solutions/module-03-authority-and-context.md": [
    "Solution record",
    "Before you use this solution",
    "Result summary",
    "Outcome map",
    "Reasoning",
    "Worked approach",
    "Acceptance evidence",
    "Compare with your attempt",
    "Valid alternatives",
    "Expected failures and recovery",
    "Misconceptions exposed by this exercise",
    "Retry plan",
    "Reset and cleanup",
    "Sources",
    "Continue",
  ],
};

for (const [relativePath, headings] of Object.entries(headingContracts)) {
  const content = read(relativePath);
  for (const heading of headings) {
    assert.match(
      content,
      new RegExp(`^#{2,4} ${escapeRegExp(heading)}(?:$|\\s)`, "m"),
      `${relativePath} is missing heading: ${heading}`,
    );
  }
}

const module2 = read("curriculum/modules/02-installation-and-anatomy.md");
const module3 = read("curriculum/modules/03-authority-and-context.md");
const lab2 = read("labs/02-disposable-initialization.md");
// Lab 2 runs through a course helper invoked in a fresh subprocess per fence
// (deftai/directive-training#18). The safety, pin, and npm-isolation guarantees that used to
// live in the lab's own shell functions now live in that helper, so the contract follows them
// there instead of relaxing them.
const initHelper = read("labs/fixtures/02-disposable-initialization/init-lab.mjs");
const lab2Solution = read("solutions/lab-02-disposable-initialization.md");
const module3Solution = read("solutions/module-03-authority-and-context.md");
const assessments = read("assessments/README.md");
const module1 = read("curriculum/modules/01-what-directive-is.md");
const module1Solution = read("solutions/module-01-what-directive-is.md");

assertDiskCapacityGuideContract(read("curriculum/README.md"), read("labs/README.md"));
assertModule2EnospcContract(lab2);
assertModule2ReclaimHelperContract(initHelper);

const executableFencePattern = /^\s*```(?:sh|bash|zsh|powershell|pwsh)\s*\n([\s\S]*?)^\s*```\s*$/gim;
// A learner-executable fence may never mutate host-global state, leave the course pin, or
// run the untaught provenance migration the doctor signpost recommends (#19). Those three
// live only as quoted evidence in non-executable fences.
//
// npm accepts its options before or after the subcommand, so neither the install verb nor the
// global flag may be anchored to a fixed position after `npm`: `npm --global install X` and
// `npm -g install X@latest` are the same mutation as `npm install -g X`. The fragments below
// are composed rather than inlined so each token boundary stays auditable, and the case table
// that follows exercises the guard against every supported variant.
const npmBinary = String.raw`npm(?:\.cmd)?`;
// One or more further whitespace-separated npm arguments.
const npmArguments = String.raw`[^\n]*?\s`;
const npmInstallVerb = String.raw`(?:i|in|install|add)(?=\s|$)`;
// `-g`, `--global` and `--location=global` as whole tokens. `--globalconfig` is a legitimate
// isolation flag in this lab; the trailing lookahead is what keeps it out of this set.
const npmGlobalFlag = String.raw`(?:--?g(?:lobal)?|--location[= ]global)(?=\s|$)`;
const npmLatestTag = String.raw`@latest(?=\s|$|["'\x60])`;
// An `env VAR=value` wrapper must not hide the command it runs.
const commandPrefix = String.raw`^\s*(?:&\s*)?(?:env(?:\s+-\S+)*(?:\s+\w+=\S*)*\s+)?`;

const forbiddenLearnerCommand = new RegExp(
  commandPrefix +
    "(?:" +
    [
      String.raw`git\s+(?:push\b|remote\s+(?:add|remove|rename|set-url)\b|reset\s+--hard\b|clean\b|checkout\s+--\b|branch\s+-D\b)`,
      String.raw`gh\s+(?!--version(?:\s|$))`,
      String.raw`npm\s+publish\b`,
      // host-global install, subcommand first: `npm install -g @deftai/directive`
      `${npmBinary}\\s+(?:${npmArguments})?${npmInstallVerb}${npmArguments}${npmGlobalFlag}`,
      // host-global install, option first: `npm --global install @deftai/directive`
      `${npmBinary}\\s+(?:${npmArguments})?${npmGlobalFlag}${npmArguments}${npmInstallVerb}`,
      // any install that leaves the course pin: `npm i @deftai/directive@latest`
      `${npmBinary}\\s+(?:${npmArguments})?${npmInstallVerb}[^\\n]*${npmLatestTag}`,
      String.raw`(?:directive|deft)\s+migrate\b`,
      String.raw`(?:directive|deft)\s+(?:deploy|publish|release)\b`,
      String.raw`rm\s+-(?:rf|fr)\b`,
      String.raw`Remove-Item\b`,
      String.raw`(?:del|rmdir)\s+\/s\b`,
    ].join("|") +
    ")",
  "im",
);

// Negative tests for the guard itself. Every supported host-global and off-pin variant must be
// rejected, and every command the lab legitimately runs must survive -- in particular the
// isolated `--globalconfig` installs, since `--global` is a prefix of `--globalconfig`.
for (const rejected of [
  "npm install -g @deftai/directive",
  "npm i -g @deftai/directive",
  "npm in -g @deftai/directive",
  "npm add -g @deftai/directive",
  "npm install --global @deftai/directive",
  "npm --global install @deftai/directive",
  "npm -g install @deftai/directive@latest",
  "npm --registry https://registry.npmjs.org/ --global install @deftai/directive",
  "npm install --location=global @deftai/directive",
  "npm.cmd install -g @deftai/directive",
  "npm.cmd --global install @deftai/directive",
  "& npm install -g @deftai/directive",
  "npm install @deftai/directive@latest",
  "npm i @deftai/directive@latest --ignore-scripts",
  'npm i "@deftai/directive@latest"',
  'env -i PATH="$PATH" npm install -g @deftai/directive',
  "  npm install -g @deftai/directive",
  "directive migrate",
  "deft migrate --project-root .",
  "npm publish",
  "git push origin training/module-02",
  'rm -rf "$lab_parent"',
]) {
  assert.match(rejected, forbiddenLearnerCommand, "the learner-command guard must reject: " + rejected);
}
for (const allowed of [
  'env -i PATH="$PATH" HOME="$HOME" npm install --userconfig "$lab_root/.npmrc" --globalconfig /dev/null --cache "$lab_root/.npm-cache" --ignore-scripts --no-audit --no-fund',
  "npm install --globalconfig /dev/null",
  "npm install --globalconfig NUL --userconfig .npmrc",
  "npm --globalconfig /dev/null install",
  "npm install --ignore-scripts --no-audit --no-fund",
  "npm install @deftai/directive@0.119.11",
  "npm ls @deftai/directive",
  "npm config get registry",
  "gh --version",
  "directive doctor --full --project-root .",
  "git status --porcelain --untracked-files=all",
]) {
  assert.doesNotMatch(allowed, forbiddenLearnerCommand, "the learner-command guard must allow: " + allowed);
}
for (const [relativePath, content] of [
  ["curriculum/modules/02-installation-and-anatomy.md", module2],
  ["curriculum/modules/03-authority-and-context.md", module3],
  ["labs/02-disposable-initialization.md", lab2],
  ["solutions/lab-02-disposable-initialization.md", lab2Solution],
  ["solutions/module-03-authority-and-context.md", module3Solution],
]) {
  for (const match of content.matchAll(executableFencePattern)) {
    assert.doesNotMatch(
      match[1],
      forbiddenLearnerCommand,
      relativePath + " contains a forbidden executable remote/publish/destructive command",
    );
  }
}

for (const [label, content, minimumLength] of [
  ["Module 2", module2, 9_000],
  ["Module 3", module3, 9_000],
  ["Lab 2", lab2, 15_000],
  ["Lab 2 solution", lab2Solution, 9_000],
  ["Module 3 solution", module3Solution, 8_000],
]) {
  assert.ok(content.length >= minimumLength, label + " is too short to be substantive");
}

for (const outcome of ["O2.1", "O2.2", "O2.3", "O2.4"]) {
  assert.ok(module2.includes(outcome), `Module 2 is missing ${outcome}`);
  assert.ok(lab2.includes(outcome), `Lab 2 is missing ${outcome}`);
  assert.ok(lab2Solution.includes(outcome), `Lab 2 solution is missing ${outcome}`);
}
for (const outcome of ["O3.1", "O3.2", "O3.3", "O3.4"]) {
  assert.ok(module3.includes(outcome), `Module 3 is missing ${outcome}`);
  assert.ok(module3Solution.includes(outcome), `Module 3 solution is missing ${outcome}`);
}

for (const [label, content] of [
  ["Module 2", module2],
  ["Module 3", module3],
]) {
  assert.match(content, /<details>[\s\S]*?<details>[\s\S]*?<details>/, `${label} needs three progressive hints`);
}

for (const content of [module2, lab2, lab2Solution]) {
  assert.match(content, /0\.119\.11/, "Module 2 path must use the exact Directive pin");
  assert.match(content, /no[- ]remote/i, "Module 2 path must preserve the no-remote guard");
  assert.doesNotMatch(content, /doctor[^\n]*--repo-root/, "doctor must use the verified --project-root flag");
}
assert.match(
  module2,
  /"overrides"[\s\S]*"@deftai\/directive-content": "0\.119\.11"[\s\S]*"@deftai\/directive-core": "0\.119\.11"[\s\S]*"@deftai\/directive-types": "0\.119\.11"/,
  "Module 2 must show the Lab 2 overrides that lock core, content, and types",
);
assert.match(
  module2,
  /CLI pin is availability|not the four-package graph/i,
  "Module 2 must not teach the CLI-only pin as the full-graph lock",
);
assert.match(lab2, /doctor --full --project-root \./, "Lab 2 must teach the verified doctor project-root flag");
for (const requiredSafetyPattern of [
  /\$PSNativeCommandUseErrorActionPreference = \$true/,
  /\$PSVersionTable\.PSVersion -lt \[version\]'7\.4'/,
  /status --porcelain --untracked-files=all/,
  /git ls-files --error-unmatch/,
  /core\.hooksPath|check-ignore/,
]) {
  assert.match(lab2, requiredSafetyPattern, "Lab 2 is missing a fail-closed safety or pin check");
}
for (const requiredHelperPattern of [
  /"rev-parse", "--show-toplevel"/,
  /Stop: temporary parent is inside another Git repository\./,
  /"status", "--porcelain", "--untracked-files=all"/,
  /attemptPattern\.test\(entry\.name\)/,
  /Stop: archived attempt has a remote/,
  /join\(parent, "evidence\.md"\)/,
  /join\(root, "node_modules\/\.bin"\)/,
  /resolveOnPath\("deft", hookPath\)/,
  /"ls-files", "--error-unmatch"/,
  /generation\.contentVersion/,
  /xBRIEFInfo\?\.version/,
  /"config", "--get", "core\.hooksPath"/,
  /devDependencies\?\.\["@deftai\/directive"\], exactVersion/,
]) {
  assert.match(initHelper, requiredHelperPattern, "the Lab 2 helper is missing a fail-closed safety or pin check");
}
for (const [relativePath, content] of [
  ["labs/02-disposable-initialization.md", lab2],
  ["labs/fixtures/02-disposable-initialization/init-lab.mjs", initHelper],
]) {
  assert.doesNotMatch(
    content,
    /git[^\n]*remote[^\n]*\|\|\s*true/,
    relativePath + " must not swallow a Git remote inspection failure",
  );
}

// #18: every fence after create runs in a fresh subprocess from the course-relative helper path
// plus the one printed absolute attempt root. No fence may reintroduce carried shell state.
assert.ok(
  [...lab2.matchAll(/node "\$helper" (?:create|guard|install|diagnose|accept|reset|archive|recovery-npmrc)\b/g)].length >= 8,
  "Lab 2 must drive every step through the course helper",
);
for (const carriedState of [
  "module_02_start()",
  "module_02_initialize()",
  "module_02_diagnose()",
  "module_02_accept()",
  "module_02_archive()",
  "module_02_restore_environment",
  'module_02_original_path="$PATH"',
  "$Module02OriginalPath = $env:PATH",
  "assert_no_remote()",
  "assert_lab_root()",
  "in the same terminal session",
  "in the same PowerShell session",
]) {
  assert.ok(
    !lab2.includes(carriedState),
    "Lab 2 must not carry live shell state between command blocks: " + carriedState,
  );
}
// Fence-level guards on the helper path, separate from the in-helper root refusal. Both refusal
// texts must stay distinguishable from a safety-boundary stop.
assert.match(lab2, /test -n "\$helper" \|\| \{ echo "Paste refusal:/, "Lab 2 fences must refuse an empty helper path");
assert.match(lab2, /test -f "\$helper" \|\| \{ echo "Paste refusal:/, "Lab 2 fences must refuse a missing helper file");
assert.match(
  initHelper,
  /Usage refusal: pass exactly one absolute attempt root[\s\S]{0,200}not a boundary stop/,
  "the helper must refuse an empty or relative root with text distinguishable from a boundary stop",
);
assert.match(
  initHelper,
  /function requireAbsoluteRootArgument\(value\) \{[\s\S]{0,400}isAbsolute\(value\)[\s\S]{0,200}return value;/,
  "the helper must refuse a non-absolute root before resolve or join touches it",
);
assert.match(
  initHelper,
  /Runtime refusal: the project-local binary is missing or not executable[\s\S]{0,240}not a boundary stop/,
  "the helper must refuse a missing project-local runtime with text distinguishable from a boundary stop",
);
// Learner-visible O2.2 proof stays the explicit project-local launcher paths.
for (const explicitProof of [
  'test -x "$lab_root/node_modules/.bin/directive"',
  'test -x "$lab_root/node_modules/.bin/deft"',
  '"$lab_root/node_modules/.bin/directive" --version',
]) {
  assert.ok(lab2.includes(explicitProof), "Lab 2 must keep the explicit project-local O2.2 proof: " + explicitProof);
}
// A missing printed-root paste is a usage problem, never "Stop if the root guard fails".
assert.doesNotMatch(
  lab2,
  /Stop if the root guard fails/,
  "Lab 2 must not describe a missing printed-root paste as a failed root guard",
);
for (const distinguishedRefusal of [
  "`Paste refusal: …`",
  "`lab-02: Usage refusal: …`",
  "`lab-02: Runtime refusal: …`",
  "`lab-02: Stop: …`",
]) {
  assert.ok(lab2.includes(distinguishedRefusal), "Lab 2 must name the refusal class: " + distinguishedRefusal);
}
assert.match(
  lab2,
  /A `Paste refusal:` or `Usage refusal:` is not a boundary stop/,
  "the Lab 2 safety boundary must separate a missing paste from a boundary stop",
);
assert.match(
  lab2,
  /\| Refusal class \|[^\n]*not a `Paste refusal` or a `Usage refusal`/,
  "the Task 4 fact table must classify the provided failure against the refusal classes",
);
assert.doesNotMatch(
  lab2,
  /git check-ignore -v PATH/,
  "Lab 2 must not leave an undefined learner-facing check-ignore placeholder",
);
for (const ignoredPath of [
  ".deft/core/VERSION",
  ".deft/.cli/example",
  ".deft-cache/example",
  ".deft/ritual-state.json",
  "xbrief/.triage-cache/candidates.jsonl",
  "USER.md",
]) {
  assert.ok(
    lab2.includes("git check-ignore -v -- " + ignoredPath),
    "Lab 2 must provide an explicit verbose ignore check for " + ignoredPath,
  );
}
// #97: name both USER.md doctor outcomes as skip/info, keep the no-open/no-copy
// boundary, and classify `.deft-cache/` as a later write, not Lab 2 doctor.
const lab2Task3 = headingSection(lab2, "Task 3 — Classify the repository anatomy");
const userMdFound = "USER.md resolved (<rung>): <path>";
const userMdAbsent = "USER.md: no USER.md found; using defaults (searched: ...)";
for (const [label, content] of [
  ["Lab 2", lab2],
  ["Lab 2 solution", lab2Solution],
]) {
  assert.ok(content.includes(userMdFound), label + " must name the found USER.md doctor string");
  assert.ok(content.includes(userMdAbsent), label + " must name the absent USER.md doctor string");
  assert.match(
    content,
    /skip\/info/,
    label + " must classify USER.md doctor lines as skip/info",
  );
  assert.match(
    content,
    /not as\s+warnings/,
    label + " must say USER.md doctor lines are not warnings",
  );
  assert.match(
    content,
    /do not open or copy USER\.md/i,
    label + " must forbid opening or copying USER.md",
  );
  assert.match(
    content,
    /resolved-versus-defaulted/,
    label + " must keep resolved-versus-defaulted as evidence",
  );
  assert.match(
    content,
    /do not copy the host path into `evidence\.md` or public posts/i,
    label + " must forbid copying the USER.md host path into evidence or public posts",
  );
  assert.match(
    content,
    /Do not add helper redaction of `doctor-full\.txt`/,
    label + " must keep doctor-full.txt unredacted",
  );
  assert.match(
    content,
    /Init installs the ignore rule for `\.deft-cache\/`/,
    label + " must state that init installs the .deft-cache/ ignore rule",
  );
  assert.match(
    content,
    /later cache,\s+queue, or session-event write/,
    label + " must state that .deft-cache/ appears on a later cache, queue, or session-event write",
  );
  assert.match(
    content,
    /Lab 2 doctor is not that write/,
    label + " must state that Lab 2 doctor does not create .deft-cache/",
  );
}
assert.doesNotMatch(
  lab2Task3,
  /do not resolve or copy/,
  "Lab 2 Task 3 must recut USER.md away from resolve-or-copy",
);
const inspectList = lab2Task3.match(/Inspect at least these paths:\s*```text\n([\s\S]*?)```/)?.[1] ?? "";
assert.match(
  inspectList,
  /^\.deft-cache\/$/m,
  "Lab 2 Task 3 must keep .deft-cache/ on the inspect list",
);
assert.doesNotMatch(
  inspectList,
  /xbrief\/\.triage-cache\//,
  "Lab 2 Task 3 must not replace the .deft-cache/ inspect path with xbrief/.triage-cache/",
);
assert.ok(
  lab2.includes("git check-ignore -v -- .deft-cache/example"),
  "Lab 2 must keep git check-ignore -v -- .deft-cache/example",
);
assert.doesNotMatch(
  initHelper,
  /redact/i,
  "the Lab 2 helper must not redact doctor-full.txt",
);

assert.match(
  module2,
  /\*\*O2\.1 — Choose the command and boundary\.\*\*[\s\S]{0,320}framework-maintainer/,
  "O2.1 must explicitly cover the consumer-versus-maintainer command boundary",
);
assert.match(
  module2,
  /5\. \*\*O2\.1:\*\* Name one consumer command surface and one maintainer-only surface/,
  "Module 2 self-assessment item 5 must map to O2.1",
);
assert.match(
  assessments,
  /Module 2 — Installation and Project Anatomy[^\n]*consumer\/maintainer boundary/,
  "The assessment index must name the Module 2 consumer/maintainer evidence",
);
assert.match(
  lab2Solution,
  /worked repository-boundary answer[\s\S]{0,240}`directive doctor`[\s\S]{0,240}disposable Northstar consumer repository[\s\S]{0,240}`task check:framework-source`[\s\S]{0,240}maintainer-only[\s\S]{0,240}`deftai\/directive` source checkout/i,
  "The Lab 2 solution must explain one concrete consumer surface and one maintainer-only surface",
);
assert.match(
  lab2Solution,
  /do not run or copy it into this training consumer lab/,
  "The Lab 2 solution must keep the do-not-run sentence for the maintainer-only example",
);
// #96: Module 2 is now the source of the named maintainer-only example. Keep Q5, O2.1
// inspection, and the Lab 2 done-condition on the concrete command, not a class name.
const module2Section3 = headingSection(module2, "3. Keep consumer and maintainer commands on their own sides");
assert.match(
  module2Section3,
  /`task check:framework-source`/,
  "Module 2 §3 must name the pinned maintainer-only example",
);
assert.match(
  module2Section3,
  /Taskfile\.yml[\s\S]{0,120}75e7d33f114b0e2e67741257813c095e74d9668f/,
  "Module 2 §3 must cite Taskfile.yml at 75e7d33f114b0e2e67741257813c095e74d9668f",
);
assert.match(
  module2Section3,
  /Do not run it[\s\S]{0,120}do not copy it into a consumer/i,
  "Module 2 §3 must forbid running or copying the pinned maintainer example in a consumer lab",
);
assert.match(
  headingSection(module2, "Official sources"),
  /Taskfile\.yml[\s\S]{0,280}75e7d33f114b0e2e67741257813c095e74d9668f/,
  "Module 2 Official sources must pin Taskfile.yml at 75e7d33f114b0e2e67741257813c095e74d9668f",
);
// #18 recut: the lab no longer mutates the caller's PATH or npm user configuration, so there is
// nothing to restore. The guarantee moved up a level -- the caller environment is never touched,
// and no caller state is replayed out of the marker into a later attempt.
assert.match(
  lab2,
  /Nothing has to be restored in your shell, because no block ever changed your `PATH` or your\s+npm user configuration\./,
  "Lab 2 cleanup must state that the caller environment was never changed",
);
assert.match(
  lab2,
  /deliberately records no caller `PATH` and no npm user\s+configuration/,
  "Lab 2 must state that the marker replays no caller shell state",
);
for (const requiredHelperEnvironmentRule of [
  'env -i PATH="$PATH" HOME="$HOME"',
  'normalized.startsWith("npm_config_")',
  'normalized !== "npm_token"',
  'normalized !== "node_auth_token"',
  "withoutHostNpmConfig(governingEnv())",
]) {
  assert.ok(
    initHelper.includes(requiredHelperEnvironmentRule),
    "the Lab 2 helper must govern child environments: " + requiredHelperEnvironmentRule,
  );
}
assert.match(
  initHelper,
  /const allowed = process\.platform === "win32"[\s\S]{0,400}: \["PATH", "HOME"\];/,
  "the Lab 2 helper must keep a closed caller-environment allowlist",
);
const markerLiteral = initHelper.match(/JSON\.stringify\(\{ (schema: "3ci\.training\.module02\.lab-state\.v1"[^}]*)\}/);
assert.ok(markerLiteral, "the Lab 2 helper must write a versioned lab-state marker");
assert.deepEqual(
  markerLiteral[1].split(",").map((field) => field.split(":")[0].trim()),
  ["schema", "lab", "root", "fixtureDigest"],
  "lab-state.json must record only the lab identity and fixture digest -- no caller PATH and no npm user configuration",
);
assert.doesNotMatch(
  lab2,
  /export DIRECTIVE_TRAINING_ROOT=["']\/absolute\/path|GetFullPath\(["']C:\\absolute\\path/i,
  "Lab 2 must not overwrite learner-supplied curriculum-root input with a placeholder",
);
assert.match(
  lab2,
  /DIRECTIVE_TRAINING_ROOT[^\n]{0,180}(?:must be set|Set DIRECTIVE_TRAINING_ROOT)/i,
  "Lab 2 must fail clearly when the learner has not supplied the curriculum root",
);
const windowsStartBlock = lab2.match(
  /### Windows\/PowerShell 7\.4\+[\s\S]*?```powershell\n([\s\S]*?)\n```/,
)?.[1] ?? "";
assert.match(
  windowsStartBlock,
  /module_02_start=ready/,
  "Lab 2 Windows start must emit the same ready signal as the Unix start",
);
assert.match(
  lab2,
  /LF will be replaced by CRLF[\s\S]{0,300}core\.autocrlf=true[\s\S]{0,500}(?:exit code|checkpoint)/i,
  "Lab 2 recovery must explain non-failing autocrlf checkpoint warnings",
);
const labsReadme = read("labs/README.md");
assert.doesNotMatch(
  lab2,
  /private curriculum (?:clone|repository)/,
  "Lab 2 must not call the public course a private curriculum clone or repository",
);
assert.doesNotMatch(
  labsReadme,
  /private curriculum (?:clone|repository)/,
  "labs/README.md must not call the public course a private curriculum clone or repository",
);
assert.match(
  lab2,
  /public `deftai\/directive-training` checkout is a valid\s+`DIRECTIVE_TRAINING_ROOT`/,
  "Lab 2 must say the public checkout is a valid DIRECTIVE_TRAINING_ROOT",
);
assert.match(
  lab2,
  /Do not point `LAB_ROOT` at the curriculum\s+checkout/,
  "Lab 2 must keep DIRECTIVE_TRAINING_ROOT apart from LAB_ROOT",
);
assert.match(
  lab2,
  /`accept` prints `module_02_accept=PASS` only after every row below holds/,
  "Lab 2 must keep the helper-PASS claim",
);
const helperPassSection = lab2.slice(
  lab2.indexOf("`accept` prints `module_02_accept=PASS`"),
  lab2.indexOf("## Evidence bundle"),
);
assert.ok(helperPassSection.includes("directive --version"), "helper-PASS command list must include version");
assert.ok(helperPassSection.includes("doctor --full --project-root ."), "helper-PASS command list must include doctor");
assert.ok(helperPassSection.includes("toolchain:check --consumer --project-root ."), "helper-PASS command list must include toolchain");
assert.ok(helperPassSection.includes("git diff --quiet"), "helper-PASS command list must include Git cleanliness");
assert.ok(helperPassSection.includes("git remote"), "helper-PASS command list must include empty remote");
assert.doesNotMatch(helperPassSection, /Written chooser/, "helper-PASS table must not list written chooser rows");
assert.doesNotMatch(helperPassSection, /Recovery decision drill/, "helper-PASS table must not list the recovery drill");
assert.match(
  lab2,
  /Module 2's inspection path for O2\.1, O2\.3, and O2\.4/,
  "written chooser/anatomy/recovery must stay on the Module 2 inspection path",
);
assert.match(
  lab2,
  /helper PASS does not attest them/,
  "Hint 3 must not attest written rows from helper PASS",
);
assert.match(
  lab2,
  /passed as `module_02_accept=PASS`/,
  "Done statement must treat helper PASS as the executable re-read",
);
const acceptAttempt = initHelper.match(/export function acceptAttempt[\s\S]*?\nexport function archiveAttempt/)?.[0] ?? "";
assert.ok(acceptAttempt.includes('return "PASS"'), "acceptAttempt must remain the executable PASS re-read");
assert.doesNotMatch(acceptAttempt, /evidence\.md/, "acceptAttempt must not become a token-presence gate on evidence.md");
const bannerPre = "Pre-cutover: none -- project is on the current vBRIEF document model.";
const bannerMig = "xBrief migration: none -- xbrief active, vbrief removed.";
for (const [label, content] of [
  ["Lab 2", lab2],
  ["Module 2", module2],
  ["Lab 2 solution", lab2Solution],
]) {
  assert.ok(content.includes(bannerPre), label + " must quote the pre-cutover banner");
  assert.ok(content.includes(bannerMig), label + " must quote the xBrief migration banner");
}
assert.match(lab2, /registry=https:\/\/registry\.npmjs\.org\//, "Lab 2 must show the public-registry npm config it writes");
assert.match(
  lab2,
  /npm install --userconfig <root>\/\.npmrc --globalconfig \/dev\/null --cache <root>\/\.npm-cache --ignore-scripts --no-audit --no-fund/,
  "Lab 2 must quote the isolated public-registry install the helper runs",
);
for (const npmIsolationPattern of [
  /registry=https:\/\/registry\.npmjs\.org\//,
  /"--userconfig", join\(root, "\.npmrc"\),/,
  /"--globalconfig", devNull,/,
  /"--cache", join\(root, "\.npm-cache"\),/,
]) {
  assert.match(initHelper, npmIsolationPattern, "the Lab 2 helper must isolate its normal public-registry npm install");
}
assert.match(lab2, /\?\? \.npmrc/, "Lab 2 starting status must include its public-registry npm config");
assert.match(initHelper, /\/\^\\\.npmrc\$\//, "the Lab 2 staging allowlist must include its npm config");
for (const [relativePath, content] of [
  ["curriculum/modules/01-what-directive-is.md", module1],
  ["solutions/module-01-what-directive-is.md", module1Solution],
]) {
  assert.match(
    content,
    /\| Last content update \| 2026-09-07 \|/,
    relativePath + " must date its navigation update",
  );
  assert.match(
    content,
    /\| Last verified \| 2026-09-07 \|/,
    relativePath + " must date its post-navigation verification",
  );
}
for (const requiredRecoveryPhrase of [
  "Task 4 — Trace the provided recovery case",
  "This is a deterministic decision drill",
  "the likely mechanism: registry authentication or configuration",
  "the next safe mutation",
  "the retry gate",
]) {
  assert.ok(
    lab2.includes(requiredRecoveryPhrase),
    "Lab 2 is missing deterministic recovery evidence: " + requiredRecoveryPhrase,
  );
}
for (const requiredRecoveryPhrase of [
  "Step 5 — Complete the recovery decision drill",
  "registry authentication or configuration",
  "Use only the organization's approved npm setup",
  "Leave the failed attempt intact",
  "Require the explicit project-local binary",
]) {
  assert.ok(
    lab2Solution.includes(requiredRecoveryPhrase),
    "Lab 2 solution is missing explained recovery evidence: " + requiredRecoveryPhrase,
  );
}
for (const [relativePath, content] of [
  ["labs/02-disposable-initialization.md", lab2],
  ["solutions/lab-02-disposable-initialization.md", lab2Solution],
]) {
  assert.doesNotMatch(
    content,
    /required hands-on recovery/i,
    relativePath + " must not require an accidental live failure",
  );
}

for (const requiredPhrase of [
  "directive --help",
  "directive commands",
  "directive init --help",
  "directive update --help",
  "directive doctor --help",
  "directive toolchain:check --help",
]) {
  assert.ok(module2.includes(requiredPhrase), `Module 2 is missing verified surface: ${requiredPhrase}`);
}
assert.match(
  module2,
  /codebase:map --help[\s\S]{0,220}(?:writes|renders)[\s\S]{0,80}MAP/i,
  "Module 2 must warn that command-specific help can write a MAP",
);
assert.match(
  module2,
  /verify:codebase-map-fresh --help[\s\S]{0,220}(?:runs|performs)[\s\S]{0,80}check/i,
  "Module 2 must warn that command-specific help can execute a verifier",
);
// The pinned 0.119.11 engine cannot emit `Missing directory: xbrief/`: that string is
// reserved for framework-content and engine-deposit rows, and the lifecycle row has its own
// wording. Teaching it -- even behind an "if it appears" hedge -- locks a false evidence
// lesson into the first executable lab, so the three learner files must teach the warning a
// pin-matched Lab 2 init really prints (deftai/directive-training#19).
for (const [relativePath, content] of [
  ["curriculum/modules/02-installation-and-anatomy.md", module2],
  ["labs/02-disposable-initialization.md", lab2],
  ["solutions/lab-02-disposable-initialization.md", lab2Solution],
]) {
  assert.doesNotMatch(
    content,
    /Missing directory: *`?xbrief/i,
    relativePath + " must not teach `Missing directory: xbrief/`; the pinned engine cannot emit it",
  );
  assert.doesNotMatch(
    content,
    /known false negative/i,
    relativePath + " must not label a doctor finding a known false negative without a pin-matched replay",
  );
  assert.ok(
    content.includes("canonical-vendored-npm-signpost"),
    relativePath + " must name the doctor check a pin-matched Lab 2 init actually prints",
  );
}

// Lab 2 Task 2 carries the live warning as a classification exercise: check id, message,
// recommended action, and boundary verdict. The 0.119.11 signpost recommends a one-time
// local `directive migrate` provenance stamp, so it may only appear as quoted evidence.
assert.match(
  lab2,
  /canonical-vendored-npm-signpost[\s\S]{0,900}directive migrate[\s\S]{0,400}stamp npm provenance/i,
  "Lab 2 must quote the signpost message with its recommended migrate action",
);
assert.doesNotMatch(
  lab2,
  /npm i -g @deftai\/directive@latest/,
  "Lab 2 must not teach the superseded host-global @latest signpost recommendation",
);
assert.match(
  lab2,
  /Signpost advisory: canonical-vendored-npm-signpost:/,
  "Lab 2 must quote the 0.119.11 signpost label before the stable warning identity",
);
assert.match(
  lab2,
  /Boundary verdict[\s\S]{0,400}outside/i,
  "Lab 2 must state the boundary verdict for the signpost recommendation",
);
assert.match(
  lab2Solution,
  /canonical-vendored-npm-signpost[\s\S]{0,900}outside/i,
  "the Lab 2 solution must classify the signpost recommendation as outside the lab boundary",
);
assert.match(
  lab2,
  /agent-hooks-live-probe[\s\S]{0,700}outside this lab/i,
  "Lab 2 must classify the Windows Restricted agent-hooks-live-probe finding",
);
assert.match(
  module2,
  /agent-hooks-live-probe[\s\S]{0,400}linux and macOS/i,
  "Module 2 must name the Windows Restricted agent-hooks-live-probe finding without forcing it onto linux/macos",
);
assert.match(
  lab2Solution,
  /agent-hooks-live-probe[\s\S]{0,900}outside/i,
  "the Lab 2 solution must classify the Windows Restricted agent-hooks-live-probe finding",
);
assert.doesNotMatch(
  lab2Solution,
  /npm i -g @deftai\/directive@latest/,
  "the Lab 2 solution must not teach the superseded host-global @latest signpost recommendation",
);

// O2.4 stays classify-and-boundary-judge of whatever appeared: no file may make a warning
// count the pass condition.
for (const [relativePath, content] of [
  ["labs/02-disposable-initialization.md", lab2],
  ["solutions/lab-02-disposable-initialization.md", lab2Solution],
]) {
  assert.doesNotMatch(
    content,
    /(?:one|two|three|1|2|3) warnings? (?:and|in the verified|recorded|expected)/i,
    relativePath + " must not make a warning count an acceptance criterion",
  );
}

for (const requiredPhrase of [
  "USER.md Personal",
  "PROJECT-DEFINITION",
  "USER.md Defaults",
  "deterministic",
  "live implementation intent",
  "lazy loading",
  "behavior rule",
  "product requirement",
]) {
  assert.ok(module3.includes(requiredPhrase), `Module 3 is missing authority concept: ${requiredPhrase}`);
}

const projectPackage = JSON.parse(read("package.json"));
assert.equal(projectPackage.private, true, "the training package must remain private");
const directivePin = assertTeachingBaselinePin(projectPackage, read("README.md"));
assert.equal(
  projectPackage.scripts?.["check:modules-2-3"],
  "node scripts/verify-modules-2-3.mjs",
  "package.json must expose the focused Modules 2-3 check",
);
assert.deepEqual(
  Object.keys(projectPackage.devDependencies ?? {}).sort(),
  ["@deftai/directive"],
  "this scope must not add an application or publishing dependency",
);
for (const dependencyField of ["dependencies", "optionalDependencies", "peerDependencies"]) {
  assert.ok(
    !projectPackage[dependencyField] || Object.keys(projectPackage[dependencyField]).length === 0,
    "this scope must not add " + dependencyField,
  );
}
for (const scriptName of Object.keys(projectPackage.scripts ?? {})) {
  assert.doesNotMatch(
    scriptName,
    /^(?:build|deploy|publish|release|serve|start|site)(?::|$)/,
    "this scope must not add an application or publishing script: " + scriptName,
  );
}

const fixture = JSON.parse(read("labs/fixtures/02-disposable-initialization/package.json"));
assert.equal(fixture.private, true, "the fictional lab fixture must be private");
assert.equal(
  fixture.devDependencies?.["@deftai/directive"],
  "0.119.11",
  "the lab fixture must pin @deftai/directive exactly",
);
assert.deepEqual(
  Object.keys(fixture.devDependencies ?? {}).sort(),
  ["@deftai/directive"],
  "the lab fixture must contain only the direct Directive development dependency",
);
assert.deepEqual(
  fixture.overrides,
  {
    "@deftai/directive-content": "0.119.11",
    "@deftai/directive-core": "0.119.11",
    "@deftai/directive-types": "0.119.11",
  },
  "the lab fixture must pin the complete Directive package graph",
);
for (const forbiddenField of ["dependencies", "scripts"]) {
  assert.ok(!fixture[forbiddenField], "the lab fixture must not define " + forbiddenField);
}

const workflow = read(".github/workflows/modules-2-3-platform-validation.yml");
// #18 recut: the three platform lanes no longer re-implement Lab 2's shell. They drive the same
// course helper the converted lab teaches, so the npm-isolation and doctor guarantees are proven
// on the one code path a learner actually runs. A lane that hand-rolls the install again drifts.
const proofIds = ["macos-zsh", "linux-bash", "windows-pwsh7"];
const proofOffsets = proofIds.map((proofId) => ({ proofId, start: workflow.indexOf("if: matrix.proof == '" + proofId + "'") }));
for (const { proofId, start } of proofOffsets) {
  assert.notEqual(start, -1, "platform workflow is missing the " + proofId + " proof step");
  const followingStarts = proofOffsets.map((entry) => entry.start).filter((offset) => offset > start);
  const step = workflow.slice(start, followingStarts.length > 0 ? Math.min(...followingStarts) : workflow.length);
  assert.ok(
    step.includes("labs/fixtures/02-disposable-initialization/init-lab.mjs"),
    proofId + " must run the lab through the course helper",
  );
  for (const verb of ["create", "guard", "reset", "install", "diagnose", "accept", "recovery-npmrc", "archive"]) {
    assert.match(
      step,
      new RegExp('(?:"\\$helper"|\\$helper)\\s+' + escapeRegExp(verb) + "\\b"),
      proofId + " must exercise the helper verb " + verb,
    );
  }
  assert.ok(
    step.includes("scripts/assert-doctor-warning-set.mjs"),
    proofId + " must assert the doctor warning set through the shared checker",
  );
  if (proofId === "windows-pwsh7") {
    assert.match(
      step,
      /--expected-id\s+canonical-vendored-npm-signpost/,
      "windows-pwsh7 must require the signpost warning identity",
    );
    assert.match(
      step,
      /--expected-id\s+agent-hooks-live-probe/,
      "windows-pwsh7 must require the Restricted agent-hooks-live-probe identity",
    );
  } else {
    assert.doesNotMatch(
      step,
      /--expected-id|agent-hooks-live-probe/,
      proofId + " must keep the default signpost-only warning set",
    );
  }
  assert.match(
    step,
    /Usage refusal/,
    proofId + " must prove that a missing printed root refuses as a usage problem",
  );
  assert.match(
    step,
    /must not read as a boundary stop/,
    proofId + " must prove that a missing printed root is not reported as a boundary stop",
  );
}
assert.doesNotMatch(
  workflow,
  /npm install|npm\.cmd/,
  "platform workflow must not re-implement the isolated install the helper owns",
);
assert.doesNotMatch(
  workflow,
  /NPM_CONFIG_USERCONFIG/,
  "platform workflow must not fall back to the old empty-userconfig recovery path",
);
// Every platform lane must capture doctor output and bind the emitted warning identity set
// through the one shared checker; a lane that re-inlines its own assertion drifts silently
// (deftai/directive-training#19).
assert.equal(
  [...workflow.slice(workflow.indexOf("\njobs:\n")).matchAll(/scripts\/assert-doctor-warning-set\.mjs/g)].length,
  3,
  "every platform job must assert the doctor warning set through the shared checker",
);
assert.doesNotMatch(
  workflow,
  /System check completed with/,
  "platform workflow must not re-inline the doctor warning assertion",
);
for (const [label, content] of [
  ["platform workflow", workflow],
  ["Module 2 solution", lab2Solution],
]) {
  assert.doesNotMatch(
    content,
    /0\.111\.0|0\\\.111\\\.0/,
    `${label} must not retain a stale executable 0.111.0 pin`,
  );
}
assert.doesNotMatch(
  workflow,
  /@deftai\/directive-core@0\\\.119\\\.9(?!\d)/,
  "platform workflow must not retain a leftover 0.119.9 current-pin assertion",
);
assert.match(
  workflow,
  /@deftai\/directive-core@0\\\.119\\\.11/,
  "windows-pwsh7 current-pin assertion must match the 0.119.11 teaching baseline",
);
assert.doesNotMatch(
  lab2,
  /0\\\.111\\\.0/,
  "Module 2 lab must not retain a stale escaped 0.111.0 command assertion",
);
const jobsSection = workflow.slice(workflow.indexOf("\njobs:\n") + "\njobs:\n".length);
assert.deepEqual(
  [...jobsSection.matchAll(/^ {2}([A-Za-z0-9_-]+):\s*$/gm)].map((match) => match[1]),
  ["disposable-consumer-proof"],
  "platform workflow must contain only the disposable proof job",
);
assert.deepEqual(
  [...workflow.matchAll(/^\s+- proof:\s*([A-Za-z0-9_-]+)\s*$/gm)].map((match) => match[1]),
  ["macos-zsh", "linux-bash", "windows-pwsh7"],
  "platform workflow must contain exactly the approved three proof targets",
);
const eventBlock = workflow.match(/^on:\n([\s\S]*?)(?=^permissions:)/m);
assert.ok(eventBlock, "platform workflow must declare events before permissions");
assert.deepEqual(
  [...eventBlock[1].matchAll(/^ {2}([A-Za-z0-9_-]+):/gm)].map((match) => match[1]),
  ["pull_request"],
  "platform workflow must run only for pull_request",
);
assert.doesNotMatch(workflow, /pull_request_target/, "platform workflow must not use pull_request_target");
assert.match(
  workflow,
  /^permissions:\n  contents: read$/m,
  "platform workflow must grant only read-only repository contents",
);
assert.equal(
  (workflow.match(/^permissions:/gm) ?? []).length,
  1,
  "platform workflow must define one top-level permissions block",
);
assert.match(
  workflow,
  /^env:\n  GH_NO_UPDATE_NOTIFIER: ["']1["']$/m,
  "platform workflow must disable the GitHub CLI update notifier for deterministic toolchain probes",
);
assert.doesNotMatch(
  workflow,
  /^\s+permissions\s*:/m,
  "platform workflow must not override permissions below the top level",
);
assert.doesNotMatch(workflow, /(?:^|\s)[\w-]+:\s*write(?:\s|$)/m, "platform workflow must not grant write permission");
assert.doesNotMatch(workflow, /write-all/i, "platform workflow must not grant write-all permission");
assert.doesNotMatch(workflow, /secrets\s*:/i, "platform workflow must not configure secrets");
assert.doesNotMatch(
  workflow,
  /\$\{\{[^}]*\bsecrets\b[^}]*\}\}/i,
  "platform workflow must not reference user-managed secrets",
);
assert.deepEqual(
  [...workflow.matchAll(/persist-credentials:\s*(true|false)/g)].map((match) => match[1]),
  ["false"],
  "checkout must declare persist-credentials: false exactly once",
);
for (const [platform, os, shell] of [
  ["macos-zsh", "macos-15", "zsh \\{0\\}"],
  ["linux-bash", "ubuntu-24\\.04", "bash"],
  ["windows-pwsh7", "windows-2022", "pwsh"],
]) {
  assert.match(
    workflow,
    new RegExp(
      "^\\s*- proof:\\s*" + escapeRegExp(platform) + "\\s*\\n\\s+os:\\s*" + os + "\\s*$",
      "m",
    ),
    platform + " must be paired with its intended matrix OS",
  );
  assert.match(
    workflow,
    new RegExp("if: matrix\\.proof == '" + escapeRegExp(platform) + "'\\n\\s+shell: " + shell),
    platform + " must be bound to its intended shell",
  );
}
assert.match(
  workflow,
  /node-version:\s*["']24\.20\.0["']/,
  "platform workflow must pin the Node.js version used by the recorded proof",
);
assert.doesNotMatch(workflow, /\bpnpm\b/i, "platform workflow must not imply unexecuted pnpm proof");
assert.ok(
  (workflow.match(/directive_path="\$local_bin\/directive"/g) ?? []).length >= 2,
  "both Unix jobs must invoke the explicit project-local Directive binary",
);
assert.equal(
  (workflow.match(/local_bin="\$lab_root\/node_modules\/\.bin"/g) ?? []).length,
  2,
  "both Unix jobs must put the disposable project-local binaries first on PATH",
);
assert.equal(
  (workflow.match(/test -x "\$local_bin\/deft"/g) ?? []).length,
  2,
  "both Unix jobs must prove the executable project-local Deft hook runtime",
);
// #18 recut: electing the local `deft` before the hook-runtime commit moved into the helper, so
// the guarantee is asserted where it now lives rather than duplicated in every platform lane.
assert.match(
  initHelper,
  /Stop: deft does not resolve inside the disposable repository/,
  "the helper must re-prove the local Deft hook runtime before a hook-runtime child",
);
assert.match(
  workflow,
  /Join-Path \$localBin "directive\.cmd"/,
  "the Windows job must invoke directive.cmd explicitly",
);
assert.match(
  workflow,
  /Join-Path \$localBin "deft\.cmd"/,
  "the Windows job must prove the project-local Deft hook runtime shim explicitly",
);
assert.match(
  workflow,
  /\$PSVersionTable\.PSVersion -lt \[version\]'7\.4'/,
  "the Windows job must require PowerShell 7.4 or newer",
);
assert.doesNotMatch(workflow, /npx\s+--no-install\s+directive/, "platform workflow must use the proven project-local Directive binary");
assert.doesNotMatch(workflow, /\bgit\s+push\b|\bgh\s+pr\b|\bnpm\s+publish\b|\bdirective\s+(?:deploy|publish|release)\b/i, "platform workflow must not mutate a remote or publish");
assert.doesNotMatch(
  workflow,
  /^\s*(?:&\s*)?(?:gh|curl|wget|Invoke-WebRequest|Invoke-RestMethod)\b/im,
  "platform workflow must not invoke a remote mutation-capable client",
);
assert.doesNotMatch(
  workflow,
  /\bgit\s+remote\s+(?:add|remove|rename|set-url|prune|update)\b/i,
  "platform workflow must not mutate Git remotes",
);
assert.deepEqual(
  [...workflow.matchAll(/uses:\s*([^\s#]+)/g)].map((match) => match[1]),
  [
    "actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0",
    "actions/setup-node@820762786026740c76f36085b0efc47a31fe5020",
  ],
  "platform workflow must use only the reviewed, immutable official actions",
);

// #18 recut: the full learner path is one helper away from every platform lane, so the tokens that
// prove it are asserted on the helper. The lanes are checked above for the complete verb sequence.
for (const token of [
  "toolchain:check", "--help",
  '"add", "--pathspec-from-file=" + trackableFile',
  '"commit", "-m", checkpointSubject',
  '"ls-files", "--error-unmatch"',
  "contentVersion",
  "xBRIEFInfo?.version",
  "core.hooksPath",
  '"status", "--porcelain", "--untracked-files=all"',
  "archiveAttempt",
]) {
  assert.ok(initHelper.includes(token), "the Lab 2 helper does not exercise the full learner path: " + token);
}
for (const triggerPath of [
  "labs/02-disposable-initialization.md",
  "labs/fixtures/02-disposable-initialization/**",
  "scripts/assert-doctor-warning-set.mjs",
  "scripts/init-lab.test.mjs",
]) {
  assert.ok(
    workflow.includes('- "' + triggerPath + '"'),
    "platform workflow must re-run when the converted lab path changes: " + triggerPath,
  );
}

const sourceNotes = read("references/SOURCE-NOTES.md");
assert.match(
  sourceNotes,
  /agent-hooks-live-probe[\s\S]{0,400}windows-pwsh7/i,
  "SOURCE-NOTES must bind agent-hooks-live-probe to the windows-pwsh7 expected set",
);
assert.doesNotMatch(
  sourceNotes,
  /windows-2022 captures remain the signpost-only/,
  "SOURCE-NOTES must not claim windows-pwsh7 CI is still signpost-only",
);
const sourceBaseline = read("references/SOURCE-BASELINE.md");
const nodeRuntimeContracts = [
  [
    "README.md",
    read("README.md"),
    new RegExp(`@deftai/directive@${directivePin.replaceAll(".", "\\.")}\` \\(Node ≥ 22 for this project`),
  ],
  [
    "curriculum/README.md",
    read("curriculum/README.md"),
    /Node\.js 22 or newer for the command-based core modules/,
  ],
  [
    "curriculum/modules/02-installation-and-anatomy.md",
    module2,
    /\*\*Pass:\*\* Node reports version 22 or newer/,
  ],
  [
    "labs/02-disposable-initialization.md",
    lab2,
    /Node\.js 22 or newer[\s\S]{0,900}\*\*Pass:\*\* every command exits 0 and Node reports 22 or newer/,
  ],
  [
    "solutions/lab-02-disposable-initialization.md",
    lab2Solution,
    /\| Node\.js 22\+ version other than the verified 24 line \| It satisfies this course's runtime floor \|/,
  ],
  [
    "references/SOURCE-BASELINE.md",
    sourceBaseline,
    /course requires Node\.js 22 or newer for the 0\.119\.11 consumer runtime/,
  ],
];
for (const [relativePath, content, expectedPrerequisite] of nodeRuntimeContracts) {
  assert.match(content, expectedPrerequisite, `${relativePath} must teach the Node.js 22 consumer floor`);
}
for (const [relativePath, content] of nodeRuntimeContracts.slice(0, -1)) {
  assert.doesNotMatch(
    content,
    /Node(?:\.js)?\s*(?:≥|>=)\s*20|Node\.js 20\+|Node\.js 20 or newer|Node reports (?:version )?20 or newer/,
    `${relativePath} must not retain the unsupported Node.js 20 consumer floor`,
  );
}
assert.match(
  sourceBaseline,
  /getting-started prose[\s\S]{0,120}Node 20\+[\s\S]{0,300}glob expansion source[\s\S]{0,180}globSync[\s\S]{0,180}added in 22\.0\.0/,
  "SOURCE-BASELINE must distinguish upstream Node 20 prose from the released Node 22 runtime floor",
);
assert.match(
  lab2Solution,
  /\| 0\.119\.5 init does not create the package pin \|/,
  "the Lab 2 solution table must name the leftover 0.119.5 pin-authorship misconception",
);
assert.match(
  lab2Solution,
  /init writes the exact CLI pin/,
  "the Lab 2 solution must state init-writes-CLI-pin",
);
assert.match(
  lab2Solution,
  /unpinned 0\.119\.11 probe[\s\S]{0,80}private exact CLI pin/,
  "the Lab 2 solution must keep the unpinned 0.119.11 init-pin observation",
);
assert.match(
  lab2Solution,
  /fixture copies `package\.json` before install to lock the four-package graph, not because init omits the pin/,
  "the Lab 2 solution must keep fixture pre-seed as graph-lock, not missing init behavior",
);
assert.match(
  lab2Solution,
  /`references\/SOURCE-BASELINE\.md` Modules 2–3 released disagreements and Module 2 §2/,
  "the Lab 2 solution must cite SOURCE-BASELINE Modules 2-3 and Module 2 §2",
);
assert.doesNotMatch(
  lab2Solution,
  /0\.119\.5 did not/,
  "the Lab 2 solution must not keep the obsolete 0.119.5 did-not init-pin claim",
);
assert.doesNotMatch(
  lab2Solution,
  /0\.119\.9 did not; the exact fixture pin preceded init/,
  "the Lab 2 solution must not retain the old pre-0.119.11 init-pin behavior",
);
const releaseCommit = "3e47fe5f1fb34438f4a17784eb82d71dd9af5970";
const normalizeReferenceId = (value) => value.trim().replace(/\s+/g, " ").toLowerCase();
const normalizeReferenceDestination = (value) =>
  value.startsWith("<") && value.endsWith(">") ? value.slice(1, -1) : value;
const parseReferenceDefinitions = (content, relativePath) => {
  const definitions = new Map();
  for (const match of content.matchAll(/^ {0,3}\[([^\]\n]+)\]:[ \t]*(<[^>\n]+>|\S+)(?:[ \t]+.*)?$/gm)) {
    const id = normalizeReferenceId(match[1]);
    assert.ok(!definitions.has(id), relativePath + " has a duplicate reference definition: " + id);
    definitions.set(id, normalizeReferenceDestination(match[2]));
  }
  return definitions;
};
const sourceDefinitions = parseReferenceDefinitions(sourceBaseline, "references/SOURCE-BASELINE.md");
for (const [label, destination] of sourceDefinitions) {
  if (!destination.startsWith("https://github.com/deftai/directive/blob/")) continue;
  assert.ok(
    destination.startsWith("https://github.com/deftai/directive/blob/" + releaseCommit + "/"),
    "SOURCE-BASELINE reference must use the pinned release commit: " + label,
  );
}
for (const [label, sourcePath] of Object.entries({
  "src-readme": "README.md",
  "src-category": "docs/CATEGORY.md",
  "src-concepts": "docs/CONCEPTS.md",
  "src-core-skill": "SKILL.md",
  "src-main": "main.md",
  "src-getting-started": "content/docs/getting-started.md",
  "src-references": "content/conventions/references.md",
  "src-lifecycle": "content/docs/directive-lifecycle.md",
  "src-commands": "content/commands.md",
  "src-strategies": "content/strategies/README.md",
  "skill-setup": "content/skills/deft-directive-setup/SKILL.md",
})) {
  const expected = "https://github.com/deftai/directive/blob/" + releaseCommit + "/" + sourcePath;
  assert.equal(
    sourceDefinitions.get(label),
    expected,
    "SOURCE-BASELINE has a missing, altered, or mutable source link: " + label,
  );
}
assert.doesNotMatch(
  sourceBaseline,
  /github\.com\/deftai\/directive\/blob\/(?:main|master)\//,
  "SOURCE-BASELINE must not cite a mutable default branch",
);
const platformProof = new Map();
for (const platformId of ["macos-zsh", "linux-bash", "windows-pwsh7"]) {
  const matches = [...sourceBaseline.matchAll(
    new RegExp(
      "^[-] \`teaching-platform-proof:" + escapeRegExp(platformId) +
        " status=(verified|candidate) date=(\\d{4}-\\d{2}-\\d{2}) evidence=(\\S+)\`$",
      "gm",
    ),
  )];
  assert.equal(matches.length, 1, "SOURCE-BASELINE must contain exactly one current proof marker for " + platformId);
  platformProof.set(platformId, {
    status: matches[0][1],
    date: matches[0][2],
    evidence: matches[0][3],
  });
}
assert.deepEqual(
  platformProof.get("macos-zsh"),
  {
    status: "candidate",
    date: "2026-09-29",
    evidence: "not-run-at-0.119.11",
  },
  "macOS/zsh must remain a candidate until a current 0.119.11 replay exists",
);
assert.deepEqual(platformProof.get("linux-bash"), {
  status: "candidate",
  date: "2026-09-29",
  evidence: "not-run-at-0.119.11",
}, "linux-bash must remain a candidate until a current 0.119.11 replay exists");
assert.deepEqual(platformProof.get("windows-pwsh7"), {
  status: "candidate",
  date: "2026-09-29",
  evidence: "baseline-upgrade-78-pass-8-skip-dedicated-linked-path-preflight-eperm",
}, "windows-pwsh7 must distinguish fixture evidence from full platform support");
assert.match(
  sourceBaseline,
  /separate `npm run test:linked-path-safety` command remains fail-closed[\s\S]{0,180}`EPERM`/,
  "SOURCE-BASELINE must bound the current platform evidence",
);
assert.match(
  lab2,
  /macOS\/zsh[^\n]*candidate/i,
  "Lab 2 must match the candidate macOS marker",
);
assert.match(
  lab2,
  /Linux\/bash[^\n]*candidate|candidate[^\n]*Linux\/bash/i,
  "Lab 2 must match the candidate Linux marker",
);
assert.match(
  lab2,
  /Windows\/PowerShell[^\n]*helper verified[^\n]*walkthrough candidate/i,
  "Lab 2 must distinguish the verified Windows helper from the candidate walkthrough",
);
for (const relativePath of [
  "README.md",
  "curriculum/README.md",
  "curriculum/modules/02-installation-and-anatomy.md",
  "labs/README.md",
  "labs/02-disposable-initialization.md",
  "solutions/README.md",
  "solutions/lab-02-disposable-initialization.md",
]) {
  const content = read(relativePath);
  assert.match(
    content,
    /(?:candidate[\s\S]{0,240}macOS\/zsh|macOS\/zsh[\s\S]{0,240}candidate)/i,
    relativePath + " must label macOS/zsh as a candidate",
  );
  assert.match(
    content,
    /(?:candidate[\s\S]{0,180}Linux\/bash|Linux\/bash[\s\S]{0,180}candidate)/i,
    relativePath + " must label Linux/bash as a candidate",
  );
  assert.match(
    content,
    /(?:verified[\s\S]{0,240}Windows(?:\/PowerShell)?|Windows(?:\/PowerShell)?[\s\S]{0,240}verified)/i,
    relativePath + " must label the Windows fixture as verified",
  );
  assert.match(
    content,
    /(?:candidate[\s\S]{0,240}Windows(?:\/PowerShell)?|Windows(?:\/PowerShell)?[\s\S]{0,240}candidate)/i,
    relativePath + " must label the published Windows walkthrough as a candidate",
  );
}
assert.match(
  sourceBaseline,
  /scope:record-approved-scope --help[\s\S]{0,260}documented `-- <xbrief-path>` form and the direct positional form both reach the operator-TTY authorization gate/,
  "SOURCE-BASELINE must record the current approved-scope separator behavior",
);
assert.match(
  sourceBaseline,
  /unpinned disposable no-remote `init --json` emitted parseable JSON and created the exact private package pin and 0\.119\.11 generation/,
  "SOURCE-BASELINE must record the successful current JSON init probe",
);
assert.doesNotMatch(
  sourceBaseline,
  /released command rejects that separator|Pass the xBRIEF path directly for 0\.119\.9/,
  "SOURCE-BASELINE must not retain the resolved 0.111.0 separator workaround",
);

const staleAvailabilityPatterns = [
  /Module 1 is the only learner-ready module/i,
  /Module 2[^\n]*not yet available/i,
  /Modules 2.?11[^\n]*not yet available/i,
  /02-installation-and-anatomy\.md\)\s*\|\s*60 min\s*\|\s*Planned/i,
  /03-authority-and-context\.md\)\s*\|\s*45 min\s*\|\s*Planned/i,
];
for (const relativePath of [
  "README.md",
  "curriculum/README.md",
  "curriculum/modules/01-what-directive-is.md",
  "labs/README.md",
  "assessments/README.md",
  "solutions/README.md",
  "solutions/module-01-what-directive-is.md",
]) {
  const content = read(relativePath);
  for (const pattern of staleAvailabilityPatterns) {
    assert.doesNotMatch(content, pattern, `${relativePath} contains a stale availability claim`);
  }
}

assert.match(
  read("curriculum/modules/01-what-directive-is.md"),
  /\[Module 2 — Installation and Project Anatomy\]\(02-installation-and-anatomy\.md\)/,
  "Module 1 must link directly to learner-ready Module 2",
);
assert.match(
  read("solutions/module-01-what-directive-is.md"),
  /\[Module 2 — Installation and Project Anatomy\]\(\.\.\/curriculum\/modules\/02-installation-and-anatomy\.md\)/,
  "Module 1 solution must link directly to learner-ready Module 2",
);

const markdownFiles = requiredFiles.filter((relativePath) => relativePath.endsWith(".md"));
const realRoot = realpathSync(root);
const markdownHeadingSlug = (heading) =>
  heading
    .toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const verifyLocalLink = (relativePath, destination) => {
  if (!destination || /^[a-z][a-z\d+.-]*:/i.test(destination)) return;
  const hashIndex = destination.indexOf("#");
  const encodedPath = hashIndex === -1 ? destination : destination.slice(0, hashIndex);
  const encodedFragment = hashIndex === -1 ? "" : destination.slice(hashIndex + 1);
  const pathPart = decodeURIComponent(encodedPath);
  const target = pathPart
    ? resolve(root, dirname(relativePath), pathPart)
    : resolve(root, relativePath);
  assert.ok(existsSync(target), relativePath + " has a broken local link: " + destination);
  const realTarget = realpathSync(target);
  const targetFromRoot = relative(realRoot, realTarget);
  assert.ok(
    targetFromRoot !== ".." &&
      !targetFromRoot.startsWith(".." + sep) &&
      !isAbsolute(targetFromRoot),
    relativePath + " has a local link outside the repository: " + destination,
  );
  if (!encodedFragment || !statSync(realTarget).isFile()) return;
  const fragment = decodeURIComponent(encodedFragment).toLowerCase();
  const headingSlugs = [...readText(realTarget).matchAll(/^#{1,6}\s+(.+)$/gm)]
    .map((match) => markdownHeadingSlug(match[1]));
  assert.ok(
    headingSlugs.includes(fragment),
    relativePath + " has a broken local heading link: " + destination,
  );
};

for (const relativePath of markdownFiles) {
  const content = read(relativePath);
  assert.doesNotMatch(content, /\{\{[^\n}]+\}\}/, relativePath + " contains an unresolved author marker");
  const proseContent = content.replace(/```[\s\S]*?```/g, "");
  const definitions = parseReferenceDefinitions(proseContent, relativePath);
  for (const match of proseContent.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    verifyLocalLink(relativePath, match[1].trim());
  }
  for (const destination of definitions.values()) {
    verifyLocalLink(relativePath, destination);
  }
  const proseWithoutDefinitions = proseContent.replace(
    /^ {0,3}\[[^\]\n]+\]:[ \t]*(?:<[^>\n]+>|\S+)(?:[ \t]+.*)?$/gm,
    "",
  );
  for (const match of proseWithoutDefinitions.matchAll(/\[([^\]\n]+)\]\[([^\]\n]*)\]/g)) {
    const referenceId = normalizeReferenceId(match[2] || match[1]);
    assert.ok(
      definitions.has(referenceId),
      relativePath + " uses an undefined reference link: " + referenceId,
    );
  }
}

console.log(`Modules 2-3 content contract: ok (${requiredFiles.length} artifacts, 0 missing)`);
