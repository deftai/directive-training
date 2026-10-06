import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { assertTeachingBaselinePin } from "./teaching-baseline.mjs";

const readmePath = fileURLToPath(new URL("../README.md", import.meta.url));
const curriculumReadmePath = fileURLToPath(new URL("../curriculum/README.md", import.meta.url));
const packagePath = fileURLToPath(new URL("../package.json", import.meta.url));
// Git may check out text with CRLF; validate its content independently of that choice.
const readText = (path) => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readme = readText(readmePath);
const curriculumReadme = readText(curriculumReadmePath);
const packageJson = JSON.parse(readText(packagePath));
const openMarker = "<!-- deft:cold-start-bootstrap v1 (#2273) -->";
const closeMarker = "<!-- /deft:cold-start-bootstrap v1 -->";
const corporateMirrorUrl =
  "https://github.com/deftai/directive/blob/master/content/UPGRADING.md#corporate-or-mirrored-npm-registry";

const occurrences = (value, needle) => value.split(needle).length - 1;

assert.ok(readme.startsWith(openMarker), "the cold-start marker must begin at byte 0");
const directivePin = assertTeachingBaselinePin(packageJson, readme);
assert.equal(occurrences(readme, openMarker), 1, "the opening marker must appear exactly once");
assert.equal(occurrences(readme, closeMarker), 1, "the closing marker must appear exactly once");

const closeIndex = readme.indexOf(closeMarker);
const afterBlock = readme.slice(closeIndex + closeMarker.length);
assert.match(
  afterBlock,
  /^\n\n# directive-training(?:\n|$)/,
  "the project title must immediately follow the closing marker",
);

const block = readme.slice(0, closeIndex + closeMarker.length);
const audienceMatch = block.match(/^> \*\*Learners:\*\* .+$/m);
assert.ok(audienceMatch, "the cold-start block must contain a Learners-prefixed audience line");
const audienceLine = audienceMatch[0];
assert.match(audienceLine, /\bskip\b/i, "the Learners audience line must keep the skip-sentence identity");
assert.match(
  audienceLine,
  /disposable/i,
  "the Learners audience line must send learners to the disposable project-local path",
);
assert.match(
  audienceLine,
  /project-local/i,
  "the Learners audience line must name the project-local lab path",
);
const firstRungIndex = block.search(/^> 1\. /m);
assert.ok(firstRungIndex >= 0, "the cold-start ladder must contain rung 1");
assert.ok(
  block.indexOf(audienceLine) < firstRungIndex,
  "the Learners audience line must intercept before the doctor and global-install rungs",
);
const rungs = [...block.matchAll(/^> (\d+)\. /gm)].map((match) => Number(match[1]));
assert.deepEqual(rungs, [1, 2, 3, 4, 5, 6], "the ladder must contain ordered rungs 1 through 6");
assert.ok(block.includes(corporateMirrorUrl), "the corporate-mirror recovery link must be absolute");

const rungThree = block.match(/^> 3\. .*$/m)?.[0];
assert.ok(rungThree, "the cold-start ladder must contain rung 3");
const globalInstallCommands = [
  ...rungThree.matchAll(/`((?:npm i|pnpm add) -g @deftai\/directive(?:@[^\s`]+)?)`/g),
].map((match) => match[1]);
assert.deepEqual(
  globalInstallCommands,
  [
    `npm i -g @deftai/directive@${directivePin}`,
    `pnpm add -g @deftai/directive@${directivePin}`,
  ],
  `rung 3 global installs must use the committed Directive pin ${directivePin}`,
);

const markdownLinks = [...block.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
assert.ok(
  markdownLinks.every((destination) => /^[a-z][a-z\d+.-]*:/i.test(destination)),
  "the cold-start block must not contain relative Markdown links",
);

const cloneWarningLead = "**Opening your agent in the course clone.**";
const forbiddenRecoveryCommands = [
  "deft verify:hooks-installed --scope=agent --repair",
  "deft update",
  "directive init",
  "deft policy:disable-host-hooks",
  "deft session:ready",
];

function markdownSection(text, heading) {
  const marker = `## ${heading}\n`;
  const start = text.indexOf(marker);
  assert.ok(start >= 0, `missing heading: ${heading}`);
  const bodyStart = start + marker.length;
  const next = text.slice(bodyStart).search(/\n## /);
  return next === -1 ? text.slice(start) : text.slice(start, bodyStart + next);
}

function assertNoKillSwitch(text, label) {
  assert.doesNotMatch(
    text,
    /\.deft-directive-disable/,
    `${label} must not name the test kill switch`,
  );
}

function sentenceContaining(text, index) {
  let start = 0;
  for (const sep of [".", "!", "?"]) {
    const pos = text.lastIndexOf(sep, Math.max(0, index - 1));
    if (pos >= start) start = pos + 1;
  }
  const para = text.lastIndexOf("\n\n", index);
  if (para >= start) start = para + 2;
  let end = text.length;
  for (const sep of [".", "!", "?"]) {
    const pos = text.indexOf(sep, index);
    if (pos !== -1 && pos < end) end = pos;
  }
  const paraEnd = text.indexOf("\n\n", index);
  if (paraEnd !== -1 && paraEnd < end) end = paraEnd;
  return text.slice(start, end);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertCloneWarning(sectionText, label) {
  assert.match(sectionText, /\*\*Opening your agent in the course clone\.\*\*/, `${label} must carry the course-entry clone-hook warning`);
  assert.match(sectionText, /governed\s+Directive consumer/, `${label} must name this clone a governed Directive consumer`);
  assert.match(
    sectionText,
    /Opening a coding-agent host at the clone root loads\s+its tracked hooks/,
    `${label} must say opening the host loads tracked hooks`,
  );
  assert.match(
    sectionText,
    /Those hooks can deny writes, including notes outside\s+this tree/,
    `${label} must say those hooks can deny writes outside the clone`,
  );
  assert.match(sectionText, /open\s+the coding-agent host on `LAB_ROOT`/, `${label} must name LAB_ROOT as the coding-agent workspace`);
  assert.match(sectionText, /`DIRECTIVE_TRAINING_ROOT` is the\s+helper path only/, `${label} must name DIRECTIVE_TRAINING_ROOT as the helper path only`);
  assert.match(
    sectionText,
    /product-signal consent prompt is optional partner\s+signal/,
    `${label} must call product-signal consent optional partner signal`,
  );
  assert.match(sectionText, /not a course step/, `${label} must say the consent prompt is not a course step`);
  assert.match(sectionText, /you may skip it/, `${label} must tell learners they may skip the consent prompt`);
  assert.equal(occurrences(sectionText, cloneWarningLead), 1, `${label} must carry the warning once`);
  assertNoKillSwitch(sectionText, label);
}

function assertNamedOnlyAsForbidden(recovery, token) {
  assert.ok(recovery.includes(token), `Resume or recover must name ${token}`);
  const tokenRe = new RegExp(escapeRegExp(token), "g");
  const matches = [...recovery.matchAll(tokenRe)];
  assert.ok(matches.length > 0, `Resume or recover must keep ${token} in the recovery text`);
  const affirmativeRe = new RegExp(`\\b(?:run|use)\\s+\`?${escapeRegExp(token)}\`?(?:\\s+to\\s+recover)?`, "i");
  for (const match of matches) {
    const sentence = sentenceContaining(recovery, match.index);
    assert.match(sentence, /\bdo not\b/i, `${token} must appear only as forbidden recovery`);
    assert.doesNotMatch(sentence, affirmativeRe, `${token} must appear only as forbidden recovery`);
  }
}

function assertCloneRecovery(recovery) {
  assert.match(recovery, /If a clone-hook deny appears/, "Resume or recover must name the clone-hook deny recovery");
  assert.match(recovery, /leave the deny in place/, "recovery must leave the clone-hook deny in place");
  assert.match(recovery, /maintainer governance/, "recovery must treat the deny as maintainer governance");
  assert.match(recovery, /not a course step/, "recovery must say the deny is not a course step");
  assert.match(recovery, /paper or a personal untracked\s+note/, "recovery must keep paper or a personal untracked note");
  assert.match(recovery, /open\s+the coding-agent host on `LAB_ROOT`/, "recovery must open lab agents on LAB_ROOT");
  assert.match(
    recovery,
    /`DIRECTIVE_TRAINING_ROOT` only as the helper path/,
    "recovery must keep DIRECTIVE_TRAINING_ROOT as the helper path only",
  );
  assert.match(recovery, /Pin versus engine skew is expected/, "recovery must name pin/engine skew as expected");
  for (const command of forbiddenRecoveryCommands) {
    assertNamedOnlyAsForbidden(recovery, command);
  }
  assertNamedOnlyAsForbidden(recovery, "occupancy mint");
  assertNoKillSwitch(recovery, "Resume or recover");
}

const startHere = markdownSection(readme, "Start here");
const safetyBoundary = markdownSection(readme, "Safety boundary");
const resumeOrRecover = markdownSection(readme, "Resume or recover");
const audience = markdownSection(curriculumReadme, "Audience and prerequisites");

assert.match(startHere, /\]\(#safety-boundary\)/, "Start here must point at the Safety boundary warning");
assert.match(startHere, /\]\(#resume-or-recover\)/, "Start here must point at the Resume or recover path");
assert.ok(
  startHere.indexOf("](#safety-boundary)") < startHere.indexOf("Module 1"),
  "the Safety pointer must appear before module work",
);
assertCloneWarning(audience, "Audience and prerequisites");
assertCloneWarning(safetyBoundary, "Safety boundary");
assertCloneRecovery(resumeOrRecover);
assert.equal(
  audience.includes(cloneWarningLead),
  true,
  "the course-entry warning must remain on Audience and prerequisites",
);
assert.equal(
  safetyBoundary.includes(cloneWarningLead),
  true,
  "the course-entry warning must remain on Safety boundary",
);
assert.equal(
  resumeOrRecover.includes(cloneWarningLead),
  false,
  "the course-entry warning must not relocate into Resume or recover",
);

console.log("README cold-start bootstrap: ok");
