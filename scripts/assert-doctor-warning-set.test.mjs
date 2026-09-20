import assert from "node:assert/strict";
import test from "node:test";

import { checkDoctorWarningSet } from "./assert-doctor-warning-set.mjs";

const WARN = "⚠ ";
const PASS = "✓ ";
const signpostMessage =
  "Canonical-vendored install (.deft/core/) is not yet npm-managed. Post-freeze upgrades run"
  + " via npm: install the engine with `npm i -g @deftai/directive@latest`, then run"
  + " `directive migrate` to stamp provenance.";

// The captured 0.119.5 replay recorded in references/SOURCE-NOTES.md, reduced to the rows the
// assertion reads.
const realCapture = [
  "Directive doctor (full)",
  `${PASS}Engine deposit: @deftai/directive-core@0.119.5`,
  `${PASS}Project-lifecycle: valid at /private/tmp/3ci-directive-module-02.ab12cd/attempt-02.ef34gh/xbrief`,
  `${WARN}canonical-vendored-npm-signpost: ${signpostMessage}`,
  `${WARN}System check completed with 1 warning(s).`,
  "",
].join("\n");

const replays = [
  {
    name: "real: the captured 0.119.5 replay passes",
    text: realCapture,
    expectProblem: null,
  },
  {
    name: "dead-string: the retired xbrief false negative is rejected",
    text: realCapture.replace(
      `${PASS}Project-lifecycle`,
      `${WARN}Missing directory: xbrief/ (lifecycle) at /tmp/x\n${PASS}Project-lifecycle`,
    ),
    expectProblem: /retired xbrief false negative/,
  },
  {
    name: "extra-warning: a second warning row is rejected",
    text: realCapture
      .replace(`${WARN}System check`, `${WARN}hook-runtime-executable: deft-hook is not executable.\n${WARN}System check`)
      .replace("with 1 warning", "with 2 warning"),
    expectProblem: /expected warning identities/,
  },
  {
    name: "no-warning: a clean run is rejected",
    text: realCapture
      .replace(`${WARN}canonical-vendored-npm-signpost: ${signpostMessage}\n`, "")
      .replace("with 1 warning", "with 0 warning"),
    expectProblem: /expected the summary to report 1 warning/,
  },
  {
    name: "renamed-check: a different warning id is rejected",
    text: realCapture.replace("canonical-vendored-npm-signpost", "canonical-vendored-npm-provenance"),
    expectProblem: /expected warning identities/,
  },
  {
    // The hole this assertion was tightened to close: the signpost is present in the output,
    // and exactly one warning is reported, but a different check emitted it.
    name: "misattributed: signpost passes while another check emits the sole warning",
    text: [
      "Directive doctor (full)",
      `${PASS}Project-lifecycle: valid at /tmp/lab/xbrief`,
      `${PASS}canonical-vendored-npm-signpost: Canonical-vendored install is npm-managed.`,
      `${WARN}hook-runtime-executable: deft-hook is not executable on this host.`,
      `${WARN}System check completed with 1 warning(s).`,
      "",
    ].join("\n"),
    expectProblem: /expected warning identities/,
  },
  {
    name: "signpost quoted in prose only is not a warning row",
    text: [
      "Directive doctor (full)",
      `${PASS}Project-lifecycle: valid at /tmp/lab/xbrief`,
      "  see canonical-vendored-npm-signpost in UPGRADING.md",
      `${WARN}hook-runtime-executable: deft-hook is not executable on this host.`,
      `${WARN}System check completed with 1 warning(s).`,
      "",
    ].join("\n"),
    expectProblem: /expected warning identities/,
  },
  {
    name: "missing project-lifecycle row is rejected",
    text: realCapture.replace(`${PASS}Project-lifecycle: valid at`, `${PASS}Project-lifecycle: missing at`),
    expectProblem: /valid project-lifecycle directory/,
  },
  {
    name: "no summary row is rejected",
    text: realCapture.replace(`${WARN}System check completed with 1 warning(s).\n`, ""),
    expectProblem: /exactly one doctor summary row/,
  },
  {
    name: "unmarked summary row cannot bind warning identity",
    text: realCapture.replace(`${WARN}System check`, "System check"),
    expectProblem: /no severity marker/,
  },
];

for (const replay of replays) {
  test(`doctor warning set replay -- ${replay.name}`, () => {
    const problems = checkDoctorWarningSet(replay.text);
    if (replay.expectProblem === null) {
      assert.deepEqual(problems, [], `expected a clean verdict, got ${JSON.stringify(problems)}`);
      return;
    }
    assert.ok(problems.length > 0, "expected the replay to be rejected");
    assert.ok(
      problems.some((problem) => replay.expectProblem.test(problem)),
      `expected a problem matching ${replay.expectProblem}, got ${JSON.stringify(problems)}`,
    );
  });
}

test("the expected warning set is compared as an exact identity set", () => {
  assert.deepEqual(checkDoctorWarningSet(realCapture, ["canonical-vendored-npm-signpost"]), []);
  const problems = checkDoctorWarningSet(realCapture, ["canonical-vendored-npm-signpost", "some-other-check"]);
  assert.ok(problems.some((problem) => /expected the summary to report 2 warning/.test(problem)));
});
