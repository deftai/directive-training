import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readdirSync, readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const TARGET_OUTCOME_MAP = Object.freeze({
  "curriculum/modules/09-design-critique-arcs.md": Object.freeze(["O9.6", "O9.7", "O9.8", "O9.9"]),
  "curriculum/modules/10-implementation-golden-path.md": Object.freeze(["O10.5", "O10.6", "O10.7", "O10.8", "O10.9"]),
  "curriculum/modules/11-testing-gates-and-evidence.md": Object.freeze(["O11.5", "O11.6", "O11.7", "O11.8"]),
  "curriculum/modules/12-review-and-completion.md": Object.freeze(["O12.1", "O12.2", "O12.3", "O12.4"]),
});

const joined = (...parts) => parts.join("");
const opaqueParentId = joined("training.modules", "9-11");
const retainedParentFilename = joined("2026-09-05-modules-", "9-11-implementation-gates-and-review.xbrief.json");

const BASELINE_PATH = "references/module-numbering-migration-baseline.json";
const PROJECT_PATH = "xbrief/PROJECT-DEFINITION.xbrief.json";
const PARENT_PATH = `xbrief/proposed/${retainedParentFilename}`;
const CAPSTONE_PARENT_PATH = "xbrief/proposed/2026-09-05-disposable-end-to-end-capstone.xbrief.json";
const DECISION_PATH = "xbrief/decisions/2026-09-18-insert-a-new-current-module-9-design-critique-practicum-renumber.decision.json";
const ISSUE_PATH = "xbrief/active/2026-09-18-4-refactor-core-curriculum-to-add-required-module-7-on-directi.xbrief.json";
const EXPECTED_SOURCE_COMMIT = "40fa2753af025dc6a3c4bc62754246ae6fdfd6ea";
const ISSUE_TRANSCRIPT_COMMENT_IDS = Object.freeze([
  5707793958, 5707871635, 5707916641, 5707938532, 5707940177, 5707956318,
  5708038144, 5708042690, 5708056751, 5714259300, 5714373154, 5714388952,
  5714388957, 5714448902, 5714459720, 5714461821, 5722717365, 5722733342,
  5722902060, 5723000512, 5723121491, 5723136205, 5723239837, 5723345514,
  5723357272, 5723361540, 5723462717, 5723565166, 5723578353, 5723679318,
  5723809456, 5723828041, 5723881400, 5723967970, 5723988825, 5724031145,
  5724098121, 5724115509, 5724144139, 5724231488, 5724306174, 5724316071,
]);

export const EXPECTED_HISTORICAL_LINEAGE = Object.freeze({
  "scripts/verify-capstone.mjs": Object.freeze({
    approvedFileScope: Object.freeze([
      joined("curriculum/modules/11-", "review-and-completion.md"),
      joined("solutions/module-11-", "review-and-completion.md"),
    ]),
  }),
  "scripts/verify-module-10.mjs": Object.freeze({
    scopeFilename: joined("2026-09-10-module-", "9-implementation-golden-path.xbrief.json"),
    parentScope: `xbrief/proposed/${retainedParentFilename}`,
    proposal: joined("history/changes/module-", "9-curriculum/proposal.xbrief.json"),
    projectItemId: joined("2026-09-10-module-", "9-implementation-golden-path"),
  }),
  "scripts/verify-module-11.mjs": Object.freeze({
    scopeFilename: joined("2026-09-10-module-10-", "testing-gates-and-evidence.xbrief.json"),
    parentScope: `xbrief/proposed/${retainedParentFilename}`,
    proposal: joined("history/changes/module-10-", "curriculum/proposal.xbrief.json"),
    projectItemId: joined("2026-09-10-module-10-", "testing-gates-and-evidence"),
    acceptanceCommands: Object.freeze([
      joined("npm run check:module-", "10"),
      joined("npm run test:module-", "10"),
    ]),
  }),
  "scripts/verify-module-12.mjs": Object.freeze({
    scopeFilename: joined("2026-09-11-module-11-", "review-and-completion.xbrief.json"),
    parentScope: `xbrief/proposed/${retainedParentFilename}`,
    proposal: joined("history/changes/module-11-", "curriculum/proposal.xbrief.json"),
    tasks: joined("history/changes/module-11-", "curriculum/tasks.xbrief.json"),
    projectItemId: joined("2026-09-11-module-11-", "review-and-completion"),
    costEstimateHeading: joined("Prior scope \u2014 Module ", "11 and capstone (2026-09-10)"),
    changelogDeliveryPattern: Object.freeze({ raw: joined("/Module ", "11[^\\n]*review/i") }),
    acceptanceCommands: Object.freeze([
      joined("npm run check:module-", "11"),
      joined("npm run test:module-", "11"),
    ]),
  }),
  "scripts/verify-module-10.test.mjs": Object.freeze({
    scopeFilename: joined("2026-09-10-module-", "9-implementation-golden-path.xbrief.json"),
    projectScopeId: joined("2026-09-10-module-", "9-implementation-golden-path"),
    parentScope: `xbrief/proposed/${retainedParentFilename}`,
  }),
  "scripts/verify-module-11.test.mjs": Object.freeze({
    scopeFilename: joined("2026-09-10-module-10-", "testing-gates-and-evidence.xbrief.json"),
    projectScopeId: joined("2026-09-10-module-10-", "testing-gates-and-evidence"),
    parentScope: `xbrief/proposed/${retainedParentFilename}`,
  }),
  "scripts/verify-module-12.test.mjs": Object.freeze({
    scopeFilename: joined("2026-09-11-module-11-", "review-and-completion.xbrief.json"),
    projectScopeId: joined("2026-09-11-module-11-", "review-and-completion"),
    parentScope: `xbrief/proposed/${retainedParentFilename}`,
    costEstimateHeading: joined("## Prior scope \u2014 Module ", "11 and capstone (2026-09-10)"),
  }),
});

const STALE_PATTERNS = Object.freeze([
  ["former implementation outcomes", /\bO9\.[1-5]\b/g],
  ["former testing outcomes", /\bO10\.[1-4]\b/g],
  ["former review outcomes", /\bO11\.[1-4]\b/g],
  ["former implementation path", /\b09-implementation-golden-path\b/g],
  ["former testing path", /\b10-testing-gates-and-evidence\b/g],
  ["former review path", /\b11-review-and-completion\b/g],
  ["former change locator", /\bmodule-(?:9|10|11)-curriculum\b/g],
  ["former lab workflow", /\blabs-7-9-10-platform-validation\b/g],
  ["former implementation branch", /\btraining\/module-0?9\b/g],
  ["former implementation session", /\bmodule-0?9-lab-session\b/g],
  ["former implementation lab display", /\bLab\s+0?9\b(?:(?!\bLab\s+\d+\b)[^\r\n]){0,60}\b(?:implementation|golden path)\b/gi],
  ["opaque parent identity", /\btraining\.modules9-11(?:\.(?:implementation|gates|review))?\b/g],
  ["retained parent locator", /\bmodules-9-11-implementation-gates-and-review\b/g],
  ["former phase display", /\bModules?\s+9\s*(?:-|\u2013|through)\s*11\b/gi],
  ["former implementation display", /\bModule\s+9\b(?:(?!\bModule\s+\d+\b)[^\r\n]){0,60}\b(?:implementation|golden path)\b/gi],
  ["former testing display", /\bModule\s+10\b(?:(?!\bModule\s+\d+\b)[^\r\n]){0,60}\b(?:testing|gates?|evidence)\b/gi],
  ["former review display", /\bModule\s+11\b(?:(?!\bModule\s+\d+\b)[^\r\n]){0,60}\b(?:review|completion)\b/gi],
  ["former course count", /\b(?:eleven|11)\s+(?:core|required)\s+modules\b|\bModules\s+1\s*(?:-|\u2013|through)\s*11\b/gi],
]);

const HISTORICAL_TEXT_EXCEPTIONS = Object.freeze([
  ["ROADMAP.md", joined("- Module ", "11: PR, Review, and Actual Completion -- `[completed]`")],
  ["ROADMAP.md", joined("- Module ", "10: Testing, Gates, and Evidence -- `[completed]`")],
  ["ROADMAP.md", joined("- **#34** -- Module ", "9: The Implementation Golden Path -- `[completed]`")],
  ["ROADMAP.md", joined("- **#78** -- Complete native Windows learner paths for Labs 7, ", "9, and 10 -- `[completed]`")],
  ["ROADMAP.md", joined("- **#77** -- Labs 7/", "9/10 happy-path tests run unconditionally on unsupported Windows -- `[completed]`")],
  ["ROADMAP.md", joined("- **#66** -- Labs 7/", "9/10 Windows install fails with npm.cmd EINVAL instead of the documented not-learner-ready stop -- `[completed]`")],
  ["CHANGELOG.md", joined("Module ", "11, a command-free fixed-state pre-PR, review-finding")],
  ["CHANGELOG.md", joined("Module ", "10, a testing-and-gates lesson")],
  ["CHANGELOG.md", joined("Module ", "9, a readiness-before-mutation lesson, guarded disposable implementation lab")],
  ["CHANGELOG.md", joined("Modules ", "9\u201311")],
  ["COST-ESTIMATE.md", joined("Module ", "11 lesson, simulated review exercise")],
  ["COST-ESTIMATE.md", joined("Module\n", "11 lesson and simulated review")],
  ["COST-ESTIMATE.md", joined("Module ", "9 implementation")],
  ["COST-ESTIMATE.md", joined("/deft:directive:change module-", "9-curriculum")],
  ["COST-ESTIMATE.md", joined("Modules ", "9\u201311"), 2],
  [DECISION_PATH, joined("former Modules ", "9, 10, and 11")],
]);

const NEGATIVE_FIXTURE_EXCEPTIONS = Object.freeze({
  "scripts/verify-module-8.test.mjs": Object.freeze([
    Object.freeze({
      id: "old-module-9-path",
      value: joined("09-", "implementation-golden-path.md"),
      count: 1,
    }),
  ]),
  "scripts/verify-module-numbering-migration.test.mjs": Object.freeze([
    Object.freeze({
      id: "allowed-old-path",
      value: joined("09-", "implementation-golden-path"),
      count: 1,
    }),
    Object.freeze({
      id: "old-module-9-path",
      value: joined("09-", "implementation-golden-path.md"),
      count: 3,
    }),
    Object.freeze({
      id: "issue-unrelated-body-old-path",
      value: joined("Current path: 09-", "implementation-golden-path.md"),
      count: 1,
    }),
    Object.freeze({
      id: "issue-unrelated-narrative-old-outcome",
      value: joined("Current outcome O9", ".1"),
      count: 1,
    }),
    Object.freeze({
      id: "decision-why-winner-old-path",
      value: joined(" Current path: 09-", "implementation-golden-path.md."),
      count: 1,
    }),
  ]),
});

const SCAN_ROOTS = Object.freeze([
  ".github/workflows",
  "README.md",
  "CHANGELOG.md",
  "COST-ESTIMATE.md",
  "ROADMAP.md",
  "package.json",
  "assessments",
  "curriculum",
  "labs",
  "maintainers",
  "references",
  "scripts",
  "solutions",
  "templates",
  PROJECT_PATH,
  "xbrief/proposed",
  "xbrief/decisions",
  "xbrief/active",
]);

const posix = (value) => value.split(sep).join("/");
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function listFiles(root, relativePath) {
  const absolute = resolve(root, relativePath);
  if (!existsSync(absolute)) return [];
  const stat = lstatSync(absolute);
  if (stat.isSymbolicLink()) return [relativePath];
  if (stat.isFile()) return [relativePath];
  assert.ok(stat.isDirectory(), `unsupported protected path type: ${relativePath}`);
  return readdirSync(absolute, { withFileTypes: true })
    .flatMap((entry) => listFiles(root, posix(relative(root, resolve(absolute, entry.name)))))
    .sort();
}

export function sha256File(path) {
  return `sha256:${createHash("sha256").update(readFileSync(path)).digest("hex")}`;
}

function gitFileAtCommit(root, commit, path) {
  try {
    return execFileSync("git", ["show", `${commit}:${path}`], {
      cwd: root,
      encoding: null,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    assert.fail(`migration baseline source is unavailable: ${commit}:${path}`);
  }
}

function readJson(root, path) {
  return JSON.parse(readFileSync(resolve(root, path), "utf8"));
}

function expectedProtectedPaths(baseline, prefix) {
  return Object.keys(baseline.protectedFiles).filter((path) => path.startsWith(prefix)).sort();
}

export function verifyProtectedHistory(root, baseline = readJson(root, BASELINE_PATH), { enforceContractCounts = true } = {}) {
  assert.equal(baseline.schema, "directive-training.module-numbering-migration-baseline.v1", "migration baseline schema changed");
  assert.match(baseline.sourceCommit ?? "", /^[0-9a-f]{40}$/, "migration baseline requires a full source commit");
  assert.ok(baseline.protectedFiles && typeof baseline.protectedFiles === "object", "migration baseline requires protectedFiles");
  assert.ok(baseline.completedRegistryItems && typeof baseline.completedRegistryItems === "object", "migration baseline requires completedRegistryItems");

  if (enforceContractCounts) {
    assert.equal(baseline.sourceCommit, EXPECTED_SOURCE_COMMIT, "migration baseline source commit changed");
    assert.deepEqual(
      baseline.protectedSets?.completedXbriefs,
      { prefix: "xbrief/completed/", jsonCount: 28, sentinelCount: 1, fileCount: 29 },
      "completed xBRIEF protected-set counts changed",
    );
    assert.equal(baseline.protectedSets?.historicalRecords?.count, 22, "historical-record protected-set count changed");
    assert.equal(baseline.protectedSets?.approvedScopeRecords?.count, 26, "approved-scope protected-set count changed");
    assert.equal(Object.keys(baseline.protectedFiles).length, 77, "protected file manifest must contain exactly 77 entries");
    assert.equal(Object.keys(baseline.completedRegistryItems).length, 24, "completed registry baseline must contain exactly 24 entries");
  }

  for (const set of Object.values(baseline.protectedSets)) {
    const actual = listFiles(root, set.prefix).sort();
    const expected = expectedProtectedPaths(baseline, set.prefix);
    assert.deepEqual(actual, expected, `protected path set changed under ${set.prefix}`);
    const expectedCount = set.fileCount ?? set.count;
    if (expectedCount !== undefined) assert.equal(actual.length, expectedCount, `protected file count changed under ${set.prefix}`);
    if (set.jsonCount !== undefined) assert.equal(actual.filter((path) => path.endsWith(".json")).length, set.jsonCount, `protected JSON count changed under ${set.prefix}`);
    if (set.sentinelCount !== undefined) assert.equal(actual.filter((path) => !path.endsWith(".json")).length, set.sentinelCount, `protected sentinel count changed under ${set.prefix}`);
  }

  for (const [path, digest] of Object.entries(baseline.protectedFiles)) {
    assert.match(digest, /^sha256:[0-9a-f]{64}$/, `invalid protected digest: ${path}`);
    assert.ok(existsSync(resolve(root, path)), `protected file is missing: ${path}`);
    assert.equal(sha256File(resolve(root, path)), digest, `protected file bytes changed: ${path}`);
    if (enforceContractCounts) {
      const sourceDigest = `sha256:${createHash("sha256").update(gitFileAtCommit(root, baseline.sourceCommit, path)).digest("hex")}`;
      assert.equal(sourceDigest, digest, `protected manifest digest does not match ${baseline.sourceCommit}: ${path}`);
    }
  }

  const project = readJson(root, PROJECT_PATH);
  const completedItems = Object.fromEntries(
    (project.plan?.items ?? []).filter((item) => item.status === "completed").map((item) => [item.id, item]),
  );
  const sourceCompletedItems = enforceContractCounts
    ? Object.fromEntries(
      (JSON.parse(gitFileAtCommit(root, baseline.sourceCommit, PROJECT_PATH).toString("utf8")).plan?.items ?? [])
        .filter((item) => item.status === "completed")
        .map((item) => [item.id, item]),
    )
    : {};
  for (const [id, protectedItem] of Object.entries(baseline.completedRegistryItems)) {
    assert.ok(completedItems[id], `protected completed PROJECT-DEFINITION registry item is missing: ${id}`);
    assert.equal(
      canonicalJson(completedItems[id]),
      canonicalJson(protectedItem),
      `protected completed PROJECT-DEFINITION registry subtree changed: ${id}`,
    );
    if (enforceContractCounts) {
      assert.ok(sourceCompletedItems[id], `baseline completed registry item is absent at ${baseline.sourceCommit}: ${id}`);
      assert.equal(
        canonicalJson(sourceCompletedItems[id]),
        canonicalJson(protectedItem),
        `completed registry baseline does not match ${baseline.sourceCommit}: ${id}`,
      );
    }
  }
  return {
    protectedFileCount: Object.keys(baseline.protectedFiles).length,
    completedRegistryCount: Object.keys(baseline.completedRegistryItems).length,
  };
}

function section(markdown, heading) {
  const match = markdown.match(new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$`, "m"));
  assert.ok(match, `missing heading: ${heading}`);
  const rest = markdown.slice(match.index + match[0].length);
  const next = rest.search(/^##\s+/m);
  return next < 0 ? rest : rest.slice(0, next);
}

export function collectOutcomeOwners(root) {
  const moduleRoot = resolve(root, "curriculum/modules");
  assert.ok(existsSync(moduleRoot), "missing curriculum/modules");
  const owners = new Map();
  const byPath = new Map();
  for (const entry of readdirSync(moduleRoot, { withFileTypes: true })) {
    if (!entry.isFile() || !/^\d{2}-.*\.md$/.test(entry.name)) continue;
    const path = `curriculum/modules/${entry.name}`;
    const outcomes = [...section(readFileSync(resolve(root, path), "utf8"), "Learning outcomes").matchAll(/\bO\d+\.\d+\b/g)].map(([id]) => id);
    assert.equal(new Set(outcomes).size, outcomes.length, `${path} repeats an outcome in Learning outcomes`);
    byPath.set(path, outcomes);
    for (const id of outcomes) {
      const prior = owners.get(id);
      assert.ok(!prior, `current outcome ${id} is owned by both ${prior} and ${path}`);
      owners.set(id, path);
    }
  }
  return { owners, byPath };
}

export function verifyOutcomeOwnership(root, baseline = readJson(root, BASELINE_PATH)) {
  const { owners, byPath } = collectOutcomeOwners(root);
  const targets = Object.values(TARGET_OUTCOME_MAP).flat();
  assert.equal(new Set(targets).size, targets.length, "target outcome map contains a duplicate ID");
  for (const [path, expected] of Object.entries(TARGET_OUTCOME_MAP)) {
    assert.deepEqual(byPath.get(path), expected, `${path} has an incorrect current outcome set or order`);
  }
  const protectedCorpus = Object.keys(baseline.protectedFiles)
    .map((path) => readFileSync(resolve(root, path), "utf8"))
    .concat(Object.values(baseline.completedRegistryItems ?? {}).map(canonicalJson))
    .join("\n");
  for (const id of targets) {
    assert.doesNotMatch(protectedCorpus, new RegExp(`\\b${escapeRegExp(id)}\\b`), `current outcome ${id} collides with the protected historical corpus`);
    assert.ok(owners.has(id), `current outcome ${id} has no module owner`);
  }
  return { outcomeCount: owners.size, targetOutcomeCount: targets.length };
}

function findAll(text, literal) {
  const spans = [];
  for (let index = text.indexOf(literal); index >= 0; index = text.indexOf(literal, index + Math.max(literal.length, 1))) {
    spans.push({ start: index, end: index + literal.length });
  }
  return spans;
}

function objectLiteralRange(text, objectName) {
  const marker = new RegExp(`(?:const|export\\s+const)\\s+${escapeRegExp(objectName)}\\s*=\\s*Object\\.freeze\\(\\s*\\{`, "m").exec(text);
  assert.ok(marker, `missing ${objectName} object`);
  const open = text.indexOf("{", marker.index);
  let depth = 0;
  let quote;
  let escaped = false;
  for (let index = open; index < text.length; index += 1) {
    const char = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = undefined;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") quote = char;
    else if (char === "{") depth += 1;
    else if (char === "}" && --depth === 0) return { start: open, end: index + 1 };
  }
  assert.fail(`unclosed ${objectName} object`);
}

export function historicalLineageSpans(path, text, expectedByPath = EXPECTED_HISTORICAL_LINEAGE) {
  const expected = expectedByPath[path];
  if (!expected) return [];
  const range = objectLiteralRange(text, "historicalLineage");
  const body = text.slice(range.start, range.end);
  const spans = [];
  for (const [property, value] of Object.entries(expected)) {
    if (typeof value === "string") {
      const expression = new RegExp(`${escapeRegExp(property)}\\s*:\\s*(${escapeRegExp(JSON.stringify(value))})`, "g");
      const matches = [...body.matchAll(expression)];
      assert.equal(matches.length, 1, `${path} historicalLineage.${property} must equal its one exact historical value`);
      const local = matches[0].index + matches[0][0].lastIndexOf(matches[0][1]);
      spans.push({ start: range.start + local, end: range.start + local + matches[0][1].length });
      continue;
    }
    if (Array.isArray(value)) {
      const arrayMatch = new RegExp(`${escapeRegExp(property)}\\s*:\\s*\\[([\\s\\S]*?)\\]`, "g").exec(body);
      assert.ok(arrayMatch, `${path} historicalLineage.${property} array is missing`);
      const arrayStart = range.start + arrayMatch.index + arrayMatch[0].indexOf("[");
      const arrayBody = arrayMatch[0].slice(arrayMatch[0].indexOf("["));
      for (const literal of value) {
        const matches = findAll(arrayBody, JSON.stringify(literal));
        assert.equal(matches.length, 1, `${path} historicalLineage.${property} must contain its exact historical value once: ${literal}`);
        spans.push(...matches.map(({ start, end }) => ({ start: arrayStart + start, end: arrayStart + end })));
      }
      continue;
    }
    if (value?.raw) {
      const expression = new RegExp(`${escapeRegExp(property)}\\s*:\\s*(${escapeRegExp(value.raw)})`, "g");
      const matches = [...body.matchAll(expression)];
      assert.equal(matches.length, 1, `${path} historicalLineage.${property} must equal its exact historical expression`);
      const local = matches[0].index + matches[0][0].lastIndexOf(matches[0][1]);
      spans.push({ start: range.start + local, end: range.start + local + matches[0][1].length });
    }
  }
  return spans;
}

function maskSpans(text, spans) {
  const chars = [...text];
  for (const { start, end } of spans) {
    for (let index = start; index < end; index += 1) if (chars[index] !== "\n" && chars[index] !== "\r") chars[index] = " ";
  }
  return chars.join("");
}

function negativeFixtureSpans(path, text, exceptions = NEGATIVE_FIXTURE_EXCEPTIONS) {
  const spans = [];
  for (const { id, value, count = 1 } of exceptions[path] ?? []) {
    const call = `negativeFixture(${JSON.stringify(id)}, ${JSON.stringify(value)})`;
    const matches = findAll(text, call);
    assert.equal(matches.length, count, `${path} negative fixture occurrence count changed: ${id}`);
    const literal = JSON.stringify(value);
    const literalOffset = call.lastIndexOf(literal);
    for (const match of matches) {
      spans.push({ start: match.start + literalOffset, end: match.start + literalOffset + literal.length });
    }
  }
  return spans;
}

function exactTextExceptionSpans(path, text, exceptions = HISTORICAL_TEXT_EXCEPTIONS) {
  const spans = [];
  for (const [expectedPath, literal, expectedCount = 1] of exceptions) {
    if (expectedPath !== path) continue;
    const matches = findAll(text, literal);
    assert.equal(matches.length, expectedCount, `${path} historical exception occurrence count changed: ${literal}`);
    spans.push(...matches);
  }
  return spans;
}

/** Return every JSON string token with its exact structural path and key/value role. */
export function jsonStringTokens(text) {
  const tokens = [];
  let index = 0;
  const skipWhitespace = () => { while (/\s/.test(text[index] ?? "")) index += 1; };
  const readString = (path, kind) => {
    const start = index;
    index += 1;
    let escaped = false;
    while (index < text.length) {
      const char = text[index++];
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') break;
    }
    const value = JSON.parse(text.slice(start, index));
    const token = { start, end: index, value, path, kind };
    tokens.push(token);
    return token;
  };
  const readValue = (path) => {
    skipWhitespace();
    if (text[index] === '"') { readString(path, "value"); return; }
    if (text[index] === "{") {
      index += 1;
      skipWhitespace();
      while (text[index] !== "}") {
        const key = readString(path, "key");
        skipWhitespace();
        assert.equal(text[index++], ":", `invalid JSON object at offset ${index - 1}`);
        readValue([...path, key.value]);
        skipWhitespace();
        if (text[index] === ",") { index += 1; skipWhitespace(); continue; }
        assert.equal(text[index], "}", `invalid JSON object at offset ${index}`);
      }
      index += 1;
      return;
    }
    if (text[index] === "[") {
      index += 1;
      skipWhitespace();
      let itemIndex = 0;
      while (text[index] !== "]") {
        readValue([...path, itemIndex++]);
        skipWhitespace();
        if (text[index] === ",") { index += 1; skipWhitespace(); continue; }
        assert.equal(text[index], "]", `invalid JSON array at offset ${index}`);
      }
      index += 1;
      return;
    }
    const primitive = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(text.slice(index));
    assert.ok(primitive, `invalid JSON value at offset ${index}`);
    index += primitive[0].length;
  };
  readValue([]);
  skipWhitespace();
  assert.equal(index, text.length, `unexpected trailing JSON at offset ${index}`);
  return tokens;
}

const pathStartsWith = (path, prefix) => prefix.every((part, index) => path[index] === part);
const staleTokens = (tokens) => tokens.filter((token) => findStaleOccurrences(token.value).length > 0);

function exactLiteralSpansInToken(text, token, literal, expectedCount, label) {
  const raw = text.slice(token.start, token.end);
  const matches = findAll(raw, literal);
  assert.equal(matches.length, expectedCount, `${label} exact occurrence count changed: ${literal}`);
  return matches.map(({ start, end }) => ({ start: token.start + start, end: token.start + end }));
}

function semanticJsonSpans(path, text, baseline) {
  if (path === BASELINE_PATH) {
    const tokens = jsonStringTokens(text);
    return staleTokens(tokens.filter((token) => pathStartsWith(token.path, ["protectedFiles"])
      || pathStartsWith(token.path, ["completedRegistryItems"])));
  }
  if (path === ISSUE_PATH) {
    const tokens = jsonStringTokens(text);
    const issue = JSON.parse(text);
    const thread = issue.plan?.metadata?.issueCommentThread ?? [];
    assert.deepEqual(
      thread.map(({ id }) => id),
      ISSUE_TRANSCRIPT_COMMENT_IDS,
      `${ISSUE_PATH} transcript comment identities changed`,
    );
    const exactTranscriptPaths = new Set([
      "plan/narratives/Overview",
      "plan/items/4/title",
      "plan/items/5/title",
      "plan/acceptance/clauses/4/text",
      "plan/acceptance/clauses/5/text",
      ...ISSUE_TRANSCRIPT_COMMENT_IDS.map((_, index) => `plan/metadata/issueCommentThread/${index}/body`),
    ]);
    const spans = staleTokens(tokens.filter((token) => token.kind === "value"
      && exactTranscriptPaths.has(token.path.join("/"))));
    const decisionNarrative = tokens.find((token) => token.kind === "value"
      && token.path.join("/") === "plan/narratives/Decisions");
    assert.ok(decisionNarrative, `${ISSUE_PATH} is missing the structured decision projection`);
    spans.push(...exactLiteralSpansInToken(
      text,
      decisionNarrative,
      opaqueParentId,
      5,
      `${ISSUE_PATH} structured decision projection`,
    ));
    return spans;
  }
  if (path === PROJECT_PATH) {
    const tokens = jsonStringTokens(text);
    const project = JSON.parse(text);
    const completedIds = new Set(Object.keys(baseline.completedRegistryItems));
    const protectedIndexes = new Set((project.plan?.items ?? []).flatMap((item, itemIndex) => completedIds.has(item.id) ? [itemIndex] : []));
    const registryId = retainedParentFilename.replace(/\.xbrief\.json$/, "");
    const proposedIndex = (project.plan?.items ?? []).findIndex((item) => item.id === registryId);
    return staleTokens(tokens.filter((token) => token.kind === "value" && (
      (pathStartsWith(token.path, ["plan", "items"]) && protectedIndexes.has(token.path[2]))
      || (proposedIndex >= 0 && (
        token.path.join("/") === `plan/items/${proposedIndex}/id`
        || token.path.join("/") === `plan/items/${proposedIndex}/metadata/source_path`
      ))
    )));
  }
  if (path === PARENT_PATH) {
    const tokens = jsonStringTokens(text);
    const approved = new Set([
      "plan/id",
      "plan/items/0/id", "plan/items/1/id", "plan/items/2/id",
      "plan/references/0/uri", "plan/references/0/title",
      "plan/references/1/uri", "plan/references/1/title",
      "plan/references/2/uri", "plan/references/2/title",
    ]);
    return staleTokens(tokens.filter((token) => token.kind === "value" && approved.has(token.path.join("/"))));
  }
  if (path === CAPSTONE_PARENT_PATH) {
    const tokens = jsonStringTokens(text);
    return staleTokens(tokens.filter((token) => token.kind === "value"
      && token.path.join("/") === "plan/metadata/swarm/depends_on/0"));
  }
  if (path === DECISION_PATH) {
    const tokens = jsonStringTokens(text);
    const decision = tokens.find((token) => token.kind === "value" && token.path.join("/") === "decision");
    assert.ok(decision, `${DECISION_PATH} is missing decision text`);
    return exactLiteralSpansInToken(text, decision, opaqueParentId, 5, `${DECISION_PATH} lineage-key decision`);
  }
  return [];
}

export function findStaleOccurrences(text) {
  const findings = [];
  for (const [label, pattern] of STALE_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) findings.push({ label, value: match[0], index: match.index });
  }
  return findings.sort((left, right) => left.index - right.index || left.label.localeCompare(right.label));
}

function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

export function verifyStaleNumbering(root, {
  paths,
  historicalLineage = EXPECTED_HISTORICAL_LINEAGE,
  textExceptions = HISTORICAL_TEXT_EXCEPTIONS,
  negativeFixtures = NEGATIVE_FIXTURE_EXCEPTIONS,
  baseline = readJson(root, BASELINE_PATH),
} = {}) {
  const scanPaths = paths ?? [...new Set(SCAN_ROOTS.flatMap((path) => listFiles(root, path)))]
    .filter((path) => !path.startsWith("xbrief/completed/") && !path.startsWith("history/") && !path.startsWith(".deft/approved-scope/"));
  const findings = [];
  for (const path of scanPaths.sort()) {
    const absolute = resolve(root, path);
    if (!existsSync(absolute) || !lstatSync(absolute).isFile()) continue;
    const text = readFileSync(absolute, "utf8");
    const spans = [
      ...historicalLineageSpans(path, text, historicalLineage),
      ...negativeFixtureSpans(path, text, negativeFixtures),
      ...exactTextExceptionSpans(path, text, textExceptions),
      ...semanticJsonSpans(path, text, baseline),
    ];
    const masked = maskSpans(text, spans);
    for (const finding of findStaleOccurrences(masked)) findings.push({ ...finding, path, line: lineNumber(masked, finding.index) });
  }
  assert.deepEqual(findings, [], `non-allowlisted stale module numbering:\n${findings.map(({ path, line, label, value }) => `${path}:${line}: ${label}: ${value}`).join("\n")}`);
  return { scannedFileCount: scanPaths.length };
}

function assertExactObject(actual, expected, label) {
  assert.equal(canonicalJson(actual), canonicalJson(expected), `${label} changed`);
}

function parseCourseRows(course) {
  const rows = new Map();
  for (const line of course.split(/\r?\n/)) {
    const match = line.match(/^\|\s*(\d{2})\s*\|\s*(.*?)\s*\|\s*(\d+) min\s*\|/);
    if (match) {
      assert.ok(!rows.has(match[1]), `course map repeats Module ${match[1]}`);
      rows.set(match[1], { line, moduleCell: match[2], minutes: Number(match[3]) });
    }
  }
  return rows;
}

export function verifyLineageAndProjection(root) {
  const parent = readJson(root, PARENT_PATH);
  assert.equal(parent.xBRIEFInfo?.description, "Proposed curriculum scope for core Modules 10 through 12", "parent description must display Modules 10 through 12");
  assert.equal(parent.plan?.id, opaqueParentId, "opaque parent plan ID changed");
  assert.equal(parent.plan?.title, "Modules 10-12: Implementation, Gates, Review, and Closeout", "parent title must display Modules 10-12");
  assert.deepEqual(
    (parent.plan?.items ?? []).map(({ id, title }) => ({ id, title })),
    [
      { id: `${opaqueParentId}.implementation`, title: "Author Module 10 and the small test-backed implementation lab" },
      { id: `${opaqueParentId}.gates`, title: "Author Module 11 and red-green-refactor gate lab" },
      { id: `${opaqueParentId}.review`, title: "Author Module 12 and simulated review exercise" },
    ],
    "parent item identities or current display titles changed",
  );
  assert.deepEqual(
    parent.plan?.references,
    [
      { uri: joined("completed/2026-09-10-module-", "9-implementation-golden-path.xbrief.json"), type: "x-xbrief/plan", title: joined("Module ", "9: The Implementation Golden Path"), TrustLevel: "internal" },
      { uri: joined("completed/2026-09-10-module-10-", "testing-gates-and-evidence.xbrief.json"), type: "x-xbrief/plan", title: joined("Module ", "10: Testing, Gates, and Evidence"), TrustLevel: "internal" },
      { uri: joined("completed/2026-09-11-module-11-", "review-and-completion.xbrief.json"), type: "x-xbrief/plan", title: joined("Module ", "11: PR, Review, and Actual Completion"), TrustLevel: "internal" },
    ],
    "parent completed-child reference triples changed",
  );

  const capstone = readJson(root, CAPSTONE_PARENT_PATH);
  assert.deepEqual(capstone.plan?.metadata?.swarm?.depends_on, [opaqueParentId], "capstone must retain its single opaque parent dependency");

  const project = readJson(root, PROJECT_PATH);
  const registryId = retainedParentFilename.replace(/\.xbrief\.json$/, "");
  const entries = (project.plan?.items ?? []).filter(({ id }) => id === registryId);
  assert.equal(entries.length, 1, "PROJECT-DEFINITION must retain exactly one proposed parent registry entry");
  assert.equal(entries[0].title, "Modules 10-12: Implementation, Gates, Review, and Closeout", "PROJECT-DEFINITION proposed parent display is stale");
  assert.equal(entries[0].metadata?.source_path, `proposed/${retainedParentFilename}`, "PROJECT-DEFINITION proposed parent source path changed");
  assert.match(project.plan?.narratives?.CourseShape ?? "", /twelve core modules/i, "PROJECT-DEFINITION CourseShape must name twelve core modules");

  const roadmap = readFileSync(resolve(root, "ROADMAP.md"), "utf8");
  assert.match(roadmap, /^- Modules 10-12: Implementation, Gates, Review, and Closeout -- `\[proposed\]`$/m, "ROADMAP Proposed display is stale");
  for (const line of HISTORICAL_TEXT_EXCEPTIONS.filter(([path]) => path === "ROADMAP.md").map(([, line]) => line)) {
    assert.equal(findAll(roadmap, line).length, 1, `ROADMAP historical row changed: ${line}`);
  }

  const course = readFileSync(resolve(root, "curriculum/README.md"), "utf8");
  const rows = parseCourseRows(course);
  assert.deepEqual([...rows.keys()], Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0")), "course map must contain Modules 01 through 12 exactly once and in order");
  assert.equal(rows.get("09")?.minutes, 75, "Module 9 must be exactly 75 minutes");
  assert.match(rows.get("09")?.moduleCell ?? "", /\[Design-critique arcs and verified synthesis\]\(modules\/09-design-critique-arcs\.md\)/i, "Module 9 course row has the wrong identity");
  assert.match(rows.get("10")?.moduleCell ?? "", /\[The implementation golden path\]\(modules\/10-implementation-golden-path\.md\)/i, "Module 10 course row has the wrong identity");
  assert.match(rows.get("11")?.moduleCell ?? "", /\[Testing, gates, and evidence\]\(modules\/11-testing-gates-and-evidence\.md\)/i, "Module 11 course row has the wrong identity");
  assert.match(rows.get("12")?.moduleCell ?? "", /\[PR, review, and actual completion\]\(modules\/12-review-and-completion\.md\)/i, "Module 12 course row has the wrong identity");
  assert.equal([...rows.values()].reduce((sum, row) => sum + row.minutes, 0), 675, "core module duration must total exactly 675 minutes");
  assert.match(course, /675 minutes/i, "course prose must state the 675-minute module total");
  assert.match(course, /13\s*(?:hours?\s*15\s*minutes|h\s*15)/i, "course prose must state 13h15 including the capstone");

  const packageJson = readJson(root, "package.json");
  for (const moduleNumber of [9, 10, 11, 12]) {
    assert.equal(packageJson.scripts?.[`check:module-${moduleNumber}`], `node scripts/verify-module-${moduleNumber}.mjs`, `package check:module-${moduleNumber} route changed`);
    assert.match(packageJson.scripts?.[`test:module-${moduleNumber}`] ?? "", new RegExp(`verify-module-${moduleNumber}\\.test\\.mjs`), `package test:module-${moduleNumber} route is missing its verifier`);
  }
  assert.equal(packageJson.scripts?.["check:module-numbering"], "node scripts/verify-module-numbering-migration.mjs", "package migration-check route changed");
  assert.equal(packageJson.scripts?.["test:module-numbering"], "node --test scripts/verify-module-numbering-migration.test.mjs", "package migration-test route changed");
  assert.match(packageJson.scripts?.test ?? "", /verify-module-numbering-migration\.test\.mjs/, "aggregate package test omits the migration verifier");

  const workflowPath = ".github/workflows/labs-7-10-11-platform-validation.yml";
  const workflow = readFileSync(resolve(root, workflowPath), "utf8");
  assert.match(workflow, /^name:\s*labs-7-10-11-platform-validation\s*$/m, "platform workflow display name is stale");
  for (const filter of [
    workflowPath,
    "labs/10-implementation-golden-path.md",
    "labs/11-testing-gates-and-evidence.md",
    "labs/fixtures/10-implementation-golden-path/**",
    "labs/fixtures/11-testing-gates-and-evidence/**",
  ]) assert.ok(workflow.includes(`\"${filter}\"`), `platform workflow is missing the exact filter ${filter}`);
  for (const command of ["npm run test:module-10", "npm run test:module-11"]) {
    assert.ok(workflow.includes(command), `platform workflow is missing ${command}`);
  }

  const decision = readJson(root, DECISION_PATH);
  assert.match(decision.decision ?? "", /O9\.6-O9\.9[\s\S]*O10\.5-O10\.9[\s\S]*O11\.5-O11\.8[\s\S]*O12\.1-O12\.4/, "numbering decision is missing the outcome map");
  for (const id of [opaqueParentId, `${opaqueParentId}.implementation`, `${opaqueParentId}.gates`, `${opaqueParentId}.review`]) {
    assert.ok((decision.decision ?? "").includes(id), `numbering decision is missing retained lineage key ${id}`);
  }
  assert.match(decision.decision ?? "", /one-time pre-MVP exception/i, "numbering decision is missing the one-time pre-MVP boundary");
  return { moduleCount: rows.size, moduleMinutes: 675, totalMinutesWithCapstone: 795 };
}

/** Read-only cross-cutting verifier for issue #4's curriculum-number migration. */
export function verifyModuleNumberingMigration(root = fileURLToPath(new URL("../", import.meta.url))) {
  assert.equal(typeof root, "string", "repository root must be a path string");
  const baseline = readJson(root, BASELINE_PATH);
  const protectedResult = verifyProtectedHistory(root, baseline);
  const outcomeResult = verifyOutcomeOwnership(root, baseline);
  const staleResult = verifyStaleNumbering(root, { baseline });
  const lineageResult = verifyLineageAndProjection(root);
  return { ...protectedResult, ...outcomeResult, ...staleResult, ...lineageResult };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = verifyModuleNumberingMigration(process.argv[2]);
    console.log(`Module numbering migration contract: ok (${result.protectedFileCount} protected files, ${result.targetOutcomeCount} migrated outcomes, ${result.moduleMinutes} module minutes)`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
