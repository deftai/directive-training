import assert from "node:assert/strict";

const declaration = /Note the current teaching baseline:\s*`@deftai\/directive`\s*(\d+\.\d+\.\d+)\b/g;

/** Read the single learner-facing Directive version declaration from README content. */
export function declaredTeachingBaseline(readme) {
  const matches = [...readme.matchAll(declaration)];
  assert.equal(matches.length, 1, "README must declare exactly one current Directive teaching baseline");
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
