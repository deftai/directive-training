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
  "npm install @deftai/directive@0.119.5",
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
  assert.match(content, /0\.119\.5/, "Module 2 path must use the exact Directive pin");
  assert.match(content, /no[- ]remote/i, "Module 2 path must preserve the no-remote guard");
  assert.doesNotMatch(content, /doctor[^\n]*--repo-root/, "doctor must use the verified --project-root flag");
}
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
// The pinned 0.119.5 engine cannot emit `Missing directory: xbrief/`: that string is
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
// recommended action, and boundary verdict. The recommended action is host-global and
// pin-breaking, so it may only appear as quoted evidence.
assert.match(
  lab2,
  /canonical-vendored-npm-signpost[\s\S]{0,900}npm i -g @deftai\/directive@latest[\s\S]{0,400}directive migrate/i,
  "Lab 2 must quote the signpost message with its recommended npm install and migrate action",
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
assertTeachingBaselinePin(projectPackage, read("README.md"));
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
  "0.119.5",
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
    "@deftai/directive-content": "0.119.5",
    "@deftai/directive-core": "0.119.5",
    "@deftai/directive-types": "0.119.5",
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
  [...workflow.matchAll(/scripts\/assert-doctor-warning-set\.mjs/g)].length,
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
  "scripts/init-lab.test.mjs",
]) {
  assert.ok(
    workflow.includes('- "' + triggerPath + '"'),
    "platform workflow must re-run when the converted lab path changes: " + triggerPath,
  );
}

const sourceNotes = read("references/SOURCE-NOTES.md");
const sourceBaseline = read("references/SOURCE-BASELINE.md");
const releaseCommit = "75e7d33f114b0e2e67741257813c095e74d9668f";
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
    status: "verified",
    date: "2026-09-20",
    evidence: "baseline-upgrade-65-of-65",
  },
  "macOS/zsh must point to the current local 0.119.5 learner-path proof",
);
for (const platformId of ["linux-bash", "windows-pwsh7"]) {
  assert.deepEqual(
    platformProof.get(platformId),
    {
      status: "candidate",
      date: "2026-09-20",
      evidence: "not-run",
    },
    platformId + " must remain a candidate until a native 0.119.5 replay exists",
  );
}
assert.match(
  sourceBaseline,
  /Linux\/bash and Windows\/PowerShell remain candidates pending native replay/,
  "SOURCE-BASELINE must bound the current platform evidence",
);
assert.match(
  lab2,
  /(?:macOS\/zsh[^\n]*(?:verified|learner-ready)|(?:verified|learner-ready)[^\n]*macOS\/zsh)/i,
  "Lab 2 must match the verified macOS marker",
);
assert.match(
  lab2,
  /Linux\/bash[^\n]*candidate|candidate[^\n]*Linux\/bash/i,
  "Lab 2 must match the candidate Linux marker",
);
assert.match(
  lab2,
  /Windows\/PowerShell[^\n]*candidate|candidate[^\n]*Windows\/PowerShell/i,
  "Lab 2 must match the candidate Windows marker",
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
    /(?:verified[\s\S]{0,180}macOS\/zsh|macOS\/zsh[\s\S]{0,180}verified)/i,
    relativePath + " must label macOS/zsh as verified",
  );
  assert.match(
    content,
    /(?:candidate[\s\S]{0,180}Linux\/bash|Linux\/bash[\s\S]{0,180}candidate)/i,
    relativePath + " must label Linux/bash as a candidate",
  );
  assert.match(
    content,
    /(?:candidate[\s\S]{0,180}Windows\/PowerShell|Windows\/PowerShell[\s\S]{0,180}candidate)/i,
    relativePath + " must label Windows/PowerShell as a candidate",
  );
}
assert.match(
  sourceBaseline,
  /scope:record-approved-scope --help[\s\S]{0,260}documented `-- <xbrief-path>` form and the direct positional form both reach the operator-TTY authorization gate/,
  "SOURCE-BASELINE must record the current approved-scope separator behavior",
);
assert.match(
  sourceBaseline,
  /unpinned disposable no-remote `init --json` emitted parseable JSON and created the exact private package pin and 0\.119\.5 generation/,
  "SOURCE-BASELINE must record the successful current JSON init probe",
);
assert.doesNotMatch(
  sourceBaseline,
  /released command rejects that separator|Pass the xBRIEF path directly for 0\.119\.5/,
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
