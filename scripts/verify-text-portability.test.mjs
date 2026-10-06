import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, posix } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const evidenceRoot = mkdtempSync(join(tmpdir(), "text-portability-test-"));
const workflowPath = ".github/workflows/modules-2-3-platform-validation.yml";
const coldStartVerifier = "scripts/verify-cold-start-readme.mjs";
const modulesVerifier = "scripts/verify-modules-2-3.mjs";
const teachingBaseline = "scripts/teaching-baseline.mjs";
const closeMarker = "<!-- /deft:cold-start-bootstrap v1 -->";
const learnerAudienceRe = /^> \*\*Learners:\*\* .+$/m;

// Keep the exact subprocess inputs and outputs available for cross-platform diagnosis.
after(() => console.log(`Text portability fixtures retained at ${evidenceRoot}`));

const readSource = (path) => readFileSync(join(repositoryRoot, path), "utf8").replace(/\r\n/g, "\n");
const coldStartFiles = new Map([
  ["README.md", readSource("README.md")],
  ["curriculum/README.md", readSource("curriculum/README.md")],
  ["package.json", readSource("package.json")],
  [coldStartVerifier, readSource(coldStartVerifier)],
  [teachingBaseline, readSource(teachingBaseline)],
]);
const cloneWarningLead = "**Opening your agent in the course clone.**";
const cloneWarningEnd = "and you may skip it.";
const cloneRecoveryLead = "If a clone-hook deny appears";
const cloneForbidLead = "Do not recover this clone with";
const cloneForbidEnd = "it is not a learner repair target.";
const directivePin = JSON.parse(coldStartFiles.get("package.json")).devDependencies["@deftai/directive"];
const expectedNpmGlobalInstall = `npm i -g @deftai/directive@${directivePin}`;
const expectedPnpmGlobalInstall = `pnpm add -g @deftai/directive@${directivePin}`;
const modulesFiles = new Map([
  ...coldStartFiles,
  ["LICENSE", readSource("LICENSE")],
  [modulesVerifier, readSource(modulesVerifier)],
  [workflowPath, readSource(workflowPath)],
  ["labs/fixtures/02-disposable-initialization/init-lab.mjs", readSource("labs/fixtures/02-disposable-initialization/init-lab.mjs")],
  ["labs/fixtures/02-disposable-initialization/package.json", readSource("labs/fixtures/02-disposable-initialization/package.json")],
  ["xbrief/PROJECT-DEFINITION.xbrief.json", readSource("xbrief/PROJECT-DEFINITION.xbrief.json")],
]);

function collectMarkdown(directory) {
  for (const entry of readdirSync(join(repositoryRoot, directory), { withFileTypes: true })) {
    const path = posix.join(directory, entry.name);
    if (entry.isDirectory()) collectMarkdown(path);
    else if (entry.isFile() && entry.name.endsWith(".md")) modulesFiles.set(path, readSource(path));
  }
}

// Copy authored content and link targets only; do not install or execute learner fixtures.
for (const directory of ["assessments", "curriculum", "labs", "maintainers", "references", "solutions", "templates"]) {
  collectMarkdown(directory);
}

function runVerifier(name, verifier, files, eol) {
  const root = join(evidenceRoot, name);
  for (const [path, text] of files) {
    const destination = join(root, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, text.replace(/\n/g, eol), { flag: "wx" });
  }
  const result = spawnSync(process.execPath, [join(root, verifier)], {
    cwd: root,
    encoding: "utf8",
    timeout: 10_000,
    maxBuffer: 1_000_000,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null, "verifier must exit normally");
  writeFileSync(join(root, "result.json"), JSON.stringify({
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  }, null, 2) + "\n", { flag: "wx" });
  return result;
}

function changed(files, path, transform) {
  assert.ok(files.has(path), `fixture must contain ${path}`);
  const original = files.get(path);
  const replacement = transform(original);
  assert.notEqual(replacement, original, `mutation must change ${path}`);
  return new Map([...files, [path, replacement]]);
}

function assertRejected(result, diagnostic) {
  assert.equal(result.status, 1, "invalid content must fail the verifier");
  assert.match(result.stderr, diagnostic);
}

function withPinnedGlobalInstalls(text) {
  return text
    .replace(/npm i -g @deftai\/directive(?:@[^\s`]+)?/, expectedNpmGlobalInstall)
    .replace(/pnpm add -g @deftai\/directive(?:@[^\s`]+)?/, expectedPnpmGlobalInstall);
}

function audienceLine(text) {
  const match = text.match(learnerAudienceRe);
  assert.ok(match, "fixture README must contain a Learners-prefixed audience line");
  return match[0];
}

function withoutAudienceLine(text) {
  return text.replace(/^> \*\*Learners:\*\* .+\n(?:>\n)?/m, "");
}

function extractInclusive(text, startNeedle, endNeedle) {
  const start = text.indexOf(startNeedle);
  assert.ok(start >= 0, `fixture must contain ${startNeedle}`);
  const end = text.indexOf(endNeedle, start);
  assert.ok(end >= 0, `fixture must contain ${endNeedle}`);
  return text.slice(start, end + endNeedle.length);
}

function withoutInclusive(text, startNeedle, endNeedle) {
  const block = extractInclusive(text, startNeedle, endNeedle);
  return text.replace(block, "").replace(/\n{3,}/g, "\n\n");
}

function relocateInclusive(text, startNeedle, endNeedle, heading) {
  const block = extractInclusive(text, startNeedle, endNeedle);
  const stripped = withoutInclusive(text, startNeedle, endNeedle);
  const marker = `## ${heading}\n\n`;
  assert.ok(stripped.includes(marker), `fixture must contain heading ${heading}`);
  return stripped.replace(marker, `${marker}${block}\n\n`);
}

function withoutWrappedSentence(text, lead) {
  const start = text.indexOf(lead);
  assert.ok(start >= 0, `fixture must contain ${lead}`);
  const period = text.indexOf(".", start);
  assert.ok(period >= 0, `fixture sentence must terminate: ${lead}`);
  let from = start;
  const to = period + 1;
  if (text.slice(from - 1, from) === " ") from -= 1;
  return (text.slice(0, from) + text.slice(to)).replace(/\n{3,}/g, "\n\n");
}

for (const [label, eol] of [["LF", "\n"], ["CRLF", "\r\n"]]) {
  test(`cold-start verifier accepts ${label} content`, () => {
    const result = runVerifier(`cold-start-valid-${label}`, coldStartVerifier, coldStartFiles, eol);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, "README cold-start bootstrap: ok\n");
  });

  test(`cold-start verifier rejects an unpinned npm global install with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) =>
      withPinnedGlobalInstalls(text).replace(expectedNpmGlobalInstall, "npm i -g @deftai/directive"));
    assertRejected(
      runVerifier(`cold-start-npm-unpinned-${label}`, coldStartVerifier, files, eol),
      /rung 3 global installs must use the committed Directive pin/,
    );
  });

  test(`cold-start verifier rejects a mismatched npm global install with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) =>
      withPinnedGlobalInstalls(text).replace(expectedNpmGlobalInstall, "npm i -g @deftai/directive@0.0.0"));
    assertRejected(
      runVerifier(`cold-start-npm-mismatch-${label}`, coldStartVerifier, files, eol),
      /rung 3 global installs must use the committed Directive pin/,
    );
  });

  test(`cold-start verifier rejects an unpinned pnpm global install with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) =>
      withPinnedGlobalInstalls(text).replace(expectedPnpmGlobalInstall, "pnpm add -g @deftai/directive"));
    assertRejected(
      runVerifier(`cold-start-pnpm-unpinned-${label}`, coldStartVerifier, files, eol),
      /rung 3 global installs must use the committed Directive pin/,
    );
  });

  test(`cold-start verifier rejects a mismatched pnpm global install with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) =>
      withPinnedGlobalInstalls(text).replace(expectedPnpmGlobalInstall, "pnpm add -g @deftai/directive@0.0.0"));
    assertRejected(
      runVerifier(`cold-start-pnpm-mismatch-${label}`, coldStartVerifier, files, eol),
      /rung 3 global installs must use the committed Directive pin/,
    );
  });

  test(`Modules 2-3 verifier accepts ${label} content, workflow, references, and headings`, () => {
    const result = runVerifier(`modules-valid-${label}`, modulesVerifier, modulesFiles, eol);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, "Modules 2-3 content contract: ok (20 artifacts, 0 missing)\n");
  });

  test(`cold-start verifier rejects separated title with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) => text.replace(closeMarker + "\n\n", closeMarker + "\n\n\n"));
    assertRejected(runVerifier(`cold-start-title-${label}`, coldStartVerifier, files, eol), /project title must immediately follow/);
  });

  test(`cold-start verifier rejects a missing Learners audience line with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", withoutAudienceLine);
    assertRejected(
      runVerifier(`cold-start-audience-missing-${label}`, coldStartVerifier, files, eol),
      /Learners-prefixed audience line/,
    );
  });

  test(`cold-start verifier rejects an after-title Learners skip with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) => {
      const line = audienceLine(text);
      const stripped = withoutAudienceLine(text);
      return stripped.replace(/(# directive-training\n)/, `$1\n${line.replace(/^> /, "")}\n`);
    });
    assertRejected(
      runVerifier(`cold-start-audience-after-title-${label}`, coldStartVerifier, files, eol),
      /Learners-prefixed audience line/,
    );
  });

  test(`cold-start verifier rejects a Learners line stripped of learner identity with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) => text.replace("**Learners:**", "**Note:**"));
    assertRejected(
      runVerifier(`cold-start-audience-identity-${label}`, coldStartVerifier, files, eol),
      /Learners-prefixed audience line/,
    );
  });

  test(`cold-start verifier rejects a missing Audience clone-hook warning with ${label}`, () => {
    const files = changed(coldStartFiles, "curriculum/README.md", (text) =>
      withoutInclusive(text, cloneWarningLead, cloneWarningEnd));
    assertRejected(
      runVerifier(`cold-start-audience-warning-missing-${label}`, coldStartVerifier, files, eol),
      /Audience and prerequisites must carry the course-entry clone-hook warning/,
    );
  });

  test(`cold-start verifier rejects a missing Safety clone-hook warning with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) =>
      withoutInclusive(text, cloneWarningLead, cloneWarningEnd));
    assertRejected(
      runVerifier(`cold-start-safety-warning-missing-${label}`, coldStartVerifier, files, eol),
      /Safety boundary must carry the course-entry clone-hook warning/,
    );
  });

  test(`cold-start verifier rejects a relocated Audience clone-hook warning with ${label}`, () => {
    const files = changed(coldStartFiles, "curriculum/README.md", (text) =>
      relocateInclusive(text, cloneWarningLead, cloneWarningEnd, "How to take the course"));
    assertRejected(
      runVerifier(`cold-start-audience-warning-relocated-${label}`, coldStartVerifier, files, eol),
      /Audience and prerequisites must carry the course-entry clone-hook warning/,
    );
  });

  test(`cold-start verifier rejects a relocated Resume recovery with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) =>
      relocateInclusive(text, cloneRecoveryLead, cloneForbidEnd, "Maintainers"));
    assertRejected(
      runVerifier(`cold-start-recovery-relocated-${label}`, coldStartVerifier, files, eol),
      /Resume or recover must name the clone-hook deny recovery/,
    );
  });

  test(`cold-start verifier rejects mutation-authorizing learner recovery with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) =>
      text.replace(
        cloneForbidLead,
        "Run `deft session:ready` to recover.\n\n" + cloneForbidLead,
      ));
    assertRejected(
      runVerifier(`cold-start-recovery-mutating-${label}`, coldStartVerifier, files, eol),
      /must appear only as forbidden recovery/,
    );
  });

  test(`cold-start verifier rejects same-paragraph affirmative recovery advice with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) =>
      text.replace(
        "or occupancy mint.",
        "or occupancy mint. Run `deft session:ready` to recover.",
      ));
    assertRejected(
      runVerifier(`cold-start-recovery-same-paragraph-${label}`, coldStartVerifier, files, eol),
      /must appear only as forbidden recovery/,
    );
  });

  test(`cold-start verifier rejects a Safety warning missing tracked-hook load with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) =>
      withoutWrappedSentence(text, "Opening a coding-agent host at the clone root loads"));
    assertRejected(
      runVerifier(`cold-start-safety-warning-hooks-load-${label}`, coldStartVerifier, files, eol),
      /Safety boundary must say opening the host loads tracked hooks/,
    );
  });

  test(`cold-start verifier rejects an Audience warning missing tracked-hook load with ${label}`, () => {
    const files = changed(coldStartFiles, "curriculum/README.md", (text) =>
      withoutWrappedSentence(text, "Opening a coding-agent host at the clone root loads"));
    assertRejected(
      runVerifier(`cold-start-audience-warning-hooks-load-${label}`, coldStartVerifier, files, eol),
      /Audience and prerequisites must say opening the host loads tracked hooks/,
    );
  });

  test(`cold-start verifier rejects a Safety warning missing outside-clone deny with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) =>
      withoutWrappedSentence(text, "Those hooks can deny writes, including notes outside"));
    assertRejected(
      runVerifier(`cold-start-safety-warning-deny-writes-${label}`, coldStartVerifier, files, eol),
      /Safety boundary must say those hooks can deny writes outside the clone/,
    );
  });

  test(`cold-start verifier rejects an Audience warning missing outside-clone deny with ${label}`, () => {
    const files = changed(coldStartFiles, "curriculum/README.md", (text) =>
      withoutWrappedSentence(text, "Those hooks can deny writes, including notes outside"));
    assertRejected(
      runVerifier(`cold-start-audience-warning-deny-writes-${label}`, coldStartVerifier, files, eol),
      /Audience and prerequisites must say those hooks can deny writes outside the clone/,
    );
  });

  test(`cold-start verifier rejects kill-switch learner recovery with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) =>
      text.replace(
        "a personal untracked\nnote.",
        "a personal untracked\nnote. Plant `.deft-directive-disable` in the clone root.",
      ));
    assertRejected(
      runVerifier(`cold-start-recovery-kill-switch-${label}`, coldStartVerifier, files, eol),
      /must not name the test kill switch/,
    );
  });

  test(`cold-start verifier rejects duplicate marker with ${label}`, () => {
    const files = changed(coldStartFiles, "README.md", (text) => text + "\n" + closeMarker + "\n");
    assertRejected(runVerifier(`cold-start-marker-${label}`, coldStartVerifier, files, eol), /closing marker must appear exactly once/);
  });

  test(`Modules 2-3 verifier rejects an extra workflow job with ${label}`, () => {
    const files = changed(modulesFiles, workflowPath, (text) => text + "\n  unexpected-job:\n    runs-on: ubuntu-24.04\n");
    assertRejected(runVerifier(`modules-job-${label}`, modulesVerifier, files, eol), /must contain only the disposable proof job/);
  });

  test(`Modules 2-3 verifier rejects an extra workflow event with ${label}`, () => {
    const files = changed(modulesFiles, workflowPath, (text) => text.replace("on:\n", "on:\n  push:\n"));
    assertRejected(runVerifier(`modules-event-${label}`, modulesVerifier, files, eol), /must run only for pull_request/);
  });

  test(`Modules 2-3 verifier rejects write permissions with ${label}`, () => {
    const files = changed(modulesFiles, workflowPath, (text) => text.replace("contents: read", "contents: write"));
    assertRejected(runVerifier(`modules-permissions-${label}`, modulesVerifier, files, eol), /must grant only read-only repository contents/);
  });

  test(`Modules 2-3 verifier rejects a leftover 0.119.9 windows-pwsh7 pin with ${label}`, () => {
    const files = changed(modulesFiles, workflowPath, (text) =>
      text.replace("@deftai/directive-core@0\\.119\\.11", "@deftai/directive-core@0\\.119\\.9"));
    assertRejected(
      runVerifier(`modules-pwsh7-pin-${label}`, modulesVerifier, files, eol),
      /leftover 0\.119\.9 current-pin/,
    );
  });

  test(`Modules 2-3 verifier rejects a broken heading link with ${label}`, () => {
    const files = changed(modulesFiles, "README.md", (text) => text + "\n[Missing heading](references/GLOSSARY.md#missing-portability-heading)\n");
    assertRejected(runVerifier(`modules-heading-${label}`, modulesVerifier, files, eol), /broken local heading link/);
  });

  test(`Modules 2-3 verifier rejects a reintroduced claim label with ${label}`, () => {
    const files = changed(modulesFiles, "templates/module-template.md", (text) => text + "\n[Directive behavior] Reintroduced label.\n");
    assertRejected(runVerifier(`modules-claim-label-${label}`, modulesVerifier, files, eol), /claim label/);
  });

  test(`Modules 2-3 verifier rejects organization-specific module language with ${label}`, () => {
    const files = changed(modulesFiles, "curriculum/modules/03-authority-and-context.md", (text) => text + "\n3Ci internal policy.\n");
    assertRejected(runVerifier(`modules-organization-language-${label}`, modulesVerifier, files, eol), /organization-specific/);
  });
}
