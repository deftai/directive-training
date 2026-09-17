import assert from "node:assert/strict";
import test from "node:test";
import { assertTeachingBaselinePin, declaredTeachingBaseline } from "./teaching-baseline.mjs";

const readme = (version, prose = `Learners use \`@deftai/directive\` ${version}.`) =>
  `# Course\n\n<!-- directive-training:teaching-baseline=${version} -->\n${prose}\n`;
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
});
