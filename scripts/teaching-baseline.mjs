import assert from "node:assert/strict";

const declaration = /<!--\s*directive-training:teaching-baseline=(\d+\.\d+\.\d+)\s*-->/g;

/** Read the single stable Directive teaching-baseline marker from README content. */
export function declaredTeachingBaseline(readme) {
  const matches = [...readme.matchAll(declaration)];
  assert.equal(matches.length, 1, "README must contain exactly one Directive teaching-baseline marker");
  return matches[0][1];
}

/** Couple the root authoring pin to the learner-facing declaration. */
export function assertTeachingBaselinePin(packageJson, readme) {
  const expected = declaredTeachingBaseline(readme);
  assert.equal(
    packageJson.devDependencies?.["@deftai/directive"],
    expected,
    `package.json must pin @deftai/directive exactly to the declared teaching baseline ${expected}`,
  );
  return expected;
}
