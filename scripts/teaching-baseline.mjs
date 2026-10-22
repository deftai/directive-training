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

/** Preserve the README declaration independently of the authoring runtime. */
export function assertTeachingBaselinePin(packageJson, readme) {
  const expected = declaredTeachingBaseline(readme);
  assert.match(
    String(packageJson.devDependencies?.["@deftai/directive-runtime"] ?? ""),
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,
    "package.json must pin @deftai/directive-runtime exactly",
  );
  assert.equal(
    packageJson.directiveTraining?.readmeBaseline,
    expected,
    `package.json must preserve the declared teaching baseline ${expected}`,
  );
  return expected;
}
