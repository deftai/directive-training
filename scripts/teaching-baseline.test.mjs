import assert from "node:assert/strict";
import test from "node:test";
import { assertTeachingBaselinePin, declaredTeachingBaseline } from "./teaching-baseline.mjs";

const readme = (version) => `# Course\n\n2. Note the current teaching baseline: \`@deftai/directive\` ${version}.\n`;
const packageJson = (version) => ({ devDependencies: { "@deftai/directive": version } });

test("derives the exact pin from the single README teaching declaration", () => {
  assert.equal(declaredTeachingBaseline(readme("0.119.2")), "0.119.2");
  assert.equal(assertTeachingBaselinePin(packageJson("0.119.2"), readme("0.119.2")), "0.119.2");
});

test("rejects the dc20d5e dual-pin content", () => {
  assert.throws(
    () => assertTeachingBaselinePin(packageJson("0.119.1"), readme("0.112.0")),
    /declared teaching baseline 0\.112\.0/,
  );
});

test("rejects missing or duplicate declarations", () => {
  assert.throws(() => declaredTeachingBaseline("# Course\n"), /exactly one/);
  assert.throws(() => declaredTeachingBaseline(readme("0.119.2") + readme("0.119.2")), /exactly one/);
});
