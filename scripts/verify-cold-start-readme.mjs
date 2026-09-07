import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const readmePath = fileURLToPath(new URL("../README.md", import.meta.url));
const packagePath = fileURLToPath(new URL("../package.json", import.meta.url));
const readme = readFileSync(readmePath, "utf8");
const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
const openMarker = "<!-- deft:cold-start-bootstrap v1 (#2273) -->";
const closeMarker = "<!-- /deft:cold-start-bootstrap v1 -->";
const corporateMirrorUrl =
  "https://github.com/deftai/directive/blob/master/content/UPGRADING.md#corporate-or-mirrored-npm-registry";

const occurrences = (value, needle) => value.split(needle).length - 1;

assert.ok(readme.startsWith(openMarker), "the cold-start marker must begin at byte 0");
assert.equal(
  packageJson.devDependencies?.["@deftai/directive"],
  "0.112.0",
  "package.json must pin @deftai/directive exactly to 0.112.0",
);
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
const rungs = [...block.matchAll(/^> (\d+)\. /gm)].map((match) => Number(match[1]));
assert.deepEqual(rungs, [1, 2, 3, 4, 5, 6], "the ladder must contain ordered rungs 1 through 6");
assert.ok(block.includes(corporateMirrorUrl), "the corporate-mirror recovery link must be absolute");

const markdownLinks = [...block.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);
assert.ok(
  markdownLinks.every((destination) => /^[a-z][a-z\d+.-]*:/i.test(destination)),
  "the cold-start block must not contain relative Markdown links",
);

console.log("README cold-start bootstrap: ok");
