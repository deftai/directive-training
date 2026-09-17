import assert from "node:assert/strict";

const openMarker = "<!-- directive-training:teaching-baseline -->";
const closeMarker = "<!-- /directive-training:teaching-baseline -->";

/** Read the visible version between stable markers, independently of surrounding prose. */
export function declaredTeachingBaseline(readme) {
  assert.equal(readme.split(openMarker).length, 2, "README must contain exactly one Directive teaching-baseline opening marker");
  assert.equal(readme.split(closeMarker).length, 2, "README must contain exactly one Directive teaching-baseline closing marker");
  const start = readme.indexOf(openMarker) + openMarker.length;
  const end = readme.indexOf(closeMarker);
  assert.ok(end >= start, "teaching-baseline markers must enclose the visible version in order");
  const version = readme.slice(start, end).trim();
  assert.match(version, /^\d+\.\d+\.\d+$/, "teaching-baseline markers must enclose only the visible exact version");
  return version;
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
