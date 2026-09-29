import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { assertTeachingBaselinePin, declaredTeachingBaseline } from "./teaching-baseline.mjs";

const openMarker = "<!-- directive-training:teaching-baseline -->";
const closeMarker = "<!-- /directive-training:teaching-baseline -->";
const readme = (version, prose = "Learners use `@deftai/directive`") =>
  `# Course\n\n${prose} ${openMarker}${version}${closeMarker}.\n`;
const packageJson = (version) => ({ devDependencies: { "@deftai/directive": version } });

test("derives the exact pin from the single README teaching declaration", () => {
  assert.equal(declaredTeachingBaseline(readme("0.119.11")), "0.119.11");
  assert.equal(assertTeachingBaselinePin(packageJson("0.119.11"), readme("0.119.11")), "0.119.11");
});

test("keeps the teaching-baseline gate stable when README prose changes", () => {
  const reworded = readme("0.119.11", "Use the pinned release throughout the course.");
  assert.equal(declaredTeachingBaseline(reworded), "0.119.11");
});

test("rejects the dc20d5e dual-pin content", () => {
  assert.throws(
    () => assertTeachingBaselinePin(packageJson("0.119.1"), readme("0.112.0")),
    /declared teaching baseline 0\.112\.0/,
  );
});

test("rejects missing or duplicate teaching-baseline markers", () => {
  assert.throws(() => declaredTeachingBaseline("# Course\n"), /exactly one/);
  assert.throws(() => declaredTeachingBaseline(readme("0.119.11") + readme("0.119.11")), /exactly one/);
  assert.throws(() => declaredTeachingBaseline(readme("0.119.11").replace(closeMarker, "")), /exactly one/);
  assert.throws(() => declaredTeachingBaseline(readme("0.119.11") + closeMarker), /exactly one/);
});

test("rejects reversed markers and anything except a visible exact release", () => {
  assert.throws(() => declaredTeachingBaseline(`${closeMarker}0.119.11${openMarker}`), /in order/);
  for (const version of ["", "^0.119.11", "0.119.11-beta", "<!-- 0.119.11 -->", "0.119.11 0.112.0"]) {
    assert.throws(() => declaredTeachingBaseline(readme(version)), /only the visible exact version/);
  }
});

test("rejects learner-visible README drift while the package pin stays current", () => {
  const current = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  const version = assertTeachingBaselinePin(pkg, current);
  const stale = current.replace(`${openMarker}${version}${closeMarker}`, `${openMarker}0.0.0${closeMarker}`);
  assert.notEqual(stale, current);
  assert.throws(() => assertTeachingBaselinePin(pkg, stale), /declared teaching baseline 0\.0\.0/);
});

test("keeps the managed Cursor planning hooks exact", () => {
  const cursorHooks = JSON.parse(
    readFileSync(new URL("../.cursor/hooks.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(cursorHooks.hooks.beforeSubmitPrompt, [
    {
      command: "deft-hook --host cursor --event prompt.submit",
      timeout: 5,
    },
  ]);
  assert.deepEqual(cursorHooks.hooks.afterAgentResponse, [
    {
      command: "deft-hook --host cursor --event agent.response",
      timeout: 5,
    },
  ]);
});
