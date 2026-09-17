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
  assert.equal(declaredTeachingBaseline(readme("0.119.2")), "0.119.2");
  assert.equal(assertTeachingBaselinePin(packageJson("0.119.2"), readme("0.119.2")), "0.119.2");
});

test("keeps the teaching-baseline gate stable when README prose changes", () => {
  const reworded = readme("0.119.2", "Use the pinned release throughout the course.");
  assert.equal(declaredTeachingBaseline(reworded), "0.119.2");
});

test("rejects the dc20d5e dual-pin content", () => {
  assert.throws(
    () => assertTeachingBaselinePin(packageJson("0.119.1"), readme("0.112.0")),
    /declared teaching baseline 0\.112\.0/,
  );
});

test("rejects missing or duplicate teaching-baseline markers", () => {
  assert.throws(() => declaredTeachingBaseline("# Course\n"), /exactly one/);
  assert.throws(() => declaredTeachingBaseline(readme("0.119.2") + readme("0.119.2")), /exactly one/);
  assert.throws(() => declaredTeachingBaseline(readme("0.119.2").replace(closeMarker, "")), /exactly one/);
  assert.throws(() => declaredTeachingBaseline(readme("0.119.2") + closeMarker), /exactly one/);
});

test("rejects reversed markers and anything except a visible exact release", () => {
  assert.throws(() => declaredTeachingBaseline(`${closeMarker}0.119.2${openMarker}`), /in order/);
  for (const version of ["", "^0.119.2", "0.119.2-beta", "<!-- 0.119.2 -->", "0.119.2 0.112.0"]) {
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
