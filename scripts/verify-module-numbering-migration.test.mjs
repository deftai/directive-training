import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import test from "node:test";
import {
  TARGET_OUTCOME_MAP,
  canonicalJson,
  jsonStringTokens,
  sha256File,
  verifyLineageAndProjection,
  verifyModuleNumberingMigration,
  verifyOutcomeOwnership,
  verifyProtectedHistory,
  verifyStaleNumbering,
} from "./verify-module-numbering-migration.mjs";

const repositoryRoot = resolve(import.meta.dirname, "..");
const joined = (...parts) => parts.join("");

function withFixture(run) {
  const root = mkdtempSync(resolve(tmpdir(), "module-numbering-migration-"));
  const write = (path, value) => {
    const absolute = resolve(root, path);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`);
  };
  try { return run({ root, write }); } finally { rmSync(root, { recursive: true, force: true }); }
}

function baselineFixture(protectedFiles = {}, completedRegistryItems = {}) {
  return {
    schema: "directive-training.module-numbering-migration-baseline.v1",
    sourceCommit: "a".repeat(40),
    protectedSets: {},
    protectedFiles,
    completedRegistryItems,
  };
}

function negativeFixture(_id, value) {
  return value;
}

const allowedNegativeLiteral = negativeFixture("allowed-old-path", "09-implementation-golden-path");

test("canonical JSON and structural token paths are deterministic", () => {
  assert.equal(canonicalJson({ z: 1, a: [{ y: "v", x: true }] }), '{"a":[{"x":true,"y":"v"}],"z":1}');
  const tokens = jsonStringTokens('{"outer":[{"name":"value"}]}');
  assert.deepEqual(
    tokens.filter(({ kind }) => kind === "value").map(({ path, value }) => ({ path, value })),
    [{ path: ["outer", 0, "name"], value: "value" }],
  );
});

test("protected path sets, bytes, and completed-registry subtrees are exact", () => withFixture(({ root, write }) => {
  const completed = { id: "done", title: "Immutable", status: "completed" };
  const addedCompleted = { id: "newly-rendered", title: "Allowed addition", status: "completed" };
  write("history/record.json", { preserved: true });
  write("xbrief/PROJECT-DEFINITION.xbrief.json", { plan: { items: [completed, addedCompleted, { id: "open", status: "proposed" }] } });
  const protectedFiles = { "history/record.json": sha256File(resolve(root, "history/record.json")) };
  const baseline = baselineFixture(protectedFiles, { done: completed });
  baseline.protectedSets = { historicalRecords: { prefix: "history/", count: 1 } };

  assert.deepEqual(verifyProtectedHistory(root, baseline, { enforceContractCounts: false }), {
    protectedFileCount: 1,
    completedRegistryCount: 1,
  });

  write("history/record.json", { preserved: false });
  assert.throws(
    () => verifyProtectedHistory(root, baseline, { enforceContractCounts: false }),
    /protected file bytes changed/,
  );
  write("history/record.json", { preserved: true });

  write("xbrief/PROJECT-DEFINITION.xbrief.json", { plan: { items: [{ ...completed, title: "Rewritten" }, addedCompleted] } });
  assert.throws(
    () => verifyProtectedHistory(root, baseline, { enforceContractCounts: false }),
    /protected completed PROJECT-DEFINITION registry subtree changed/,
  );

  write("xbrief/PROJECT-DEFINITION.xbrief.json", { plan: { items: [addedCompleted] } });
  assert.throws(
    () => verifyProtectedHistory(root, baseline, { enforceContractCounts: false }),
    /protected completed PROJECT-DEFINITION registry item is missing/,
  );
  write("xbrief/PROJECT-DEFINITION.xbrief.json", { plan: { items: [completed, addedCompleted, { id: "open", status: "proposed" }] } });

  write("history/extra.json", { preserved: false });
  assert.throws(
    () => verifyProtectedHistory(root, baseline, { enforceContractCounts: false }),
    /protected path set changed/,
  );
}));

test("current outcomes have exact owners and cannot collide with protected history", () => withFixture(({ root, write }) => {
  for (const [path, outcomes] of Object.entries(TARGET_OUTCOME_MAP)) {
    write(path, `# Module\n\n## Learning outcomes\n\n${outcomes.map((id) => `- ${id}`).join("\n")}\n`);
  }
  write("history/record.md", "No current outcomes here.\n");
  const baseline = baselineFixture({ "history/record.md": "sha256:" + "0".repeat(64) });
  assert.equal(verifyOutcomeOwnership(root, baseline).targetOutcomeCount, 17);

  const duplicatePath = "curriculum/modules/10-implementation-golden-path.md";
  const duplicateSource = readFileSync(resolve(root, duplicatePath), "utf8");
  write(duplicatePath, `${duplicateSource}- ${TARGET_OUTCOME_MAP["curriculum/modules/09-design-critique-arcs.md"][0]}\n`);
  assert.throws(() => verifyOutcomeOwnership(root, baseline), /is owned by both/);
  write(duplicatePath, duplicateSource);

  write("history/record.md", `Historical collision: ${TARGET_OUTCOME_MAP["curriculum/modules/09-design-critique-arcs.md"][0]}\n`);
  assert.throws(() => verifyOutcomeOwnership(root, baseline), /collides with the protected historical corpus/);

  write("history/record.md", "No current outcomes here.\n");
  baseline.completedRegistryItems = {
    historical: { id: "historical", title: `Historical ${TARGET_OUTCOME_MAP["curriculum/modules/09-design-critique-arcs.md"][0]}` },
  };
  assert.throws(() => verifyOutcomeOwnership(root, baseline), /collides with the protected historical corpus/);
}));

test("historicalLineage permits only named values, not container laundering", () => withFixture(({ root, write }) => {
  const stalePath = joined("09-", "implementation-golden-path");
  const path = "scripts/fixture.mjs";
  const expected = { [path]: { scopeFilename: stalePath } };
  const baseline = baselineFixture();
  write(path, `const historicalLineage = Object.freeze({\n  scopeFilename: ${JSON.stringify(stalePath)},\n});\n`);
  verifyStaleNumbering(root, { paths: [path], historicalLineage: expected, textExceptions: [], baseline });

  write(path, `const historicalLineage = Object.freeze({\n  scopeFilename: ${JSON.stringify(stalePath)},\n  laundered: ${JSON.stringify(stalePath)},\n});\n`);
  assert.throws(
    () => verifyStaleNumbering(root, { paths: [path], historicalLineage: expected, textExceptions: [], baseline }),
    /non-allowlisted stale module numbering/,
  );
}));

test("a negative fixture allowance does not shield an adjacent occurrence", () => withFixture(({ root, write }) => {
  assert.equal(allowedNegativeLiteral, joined("09-", "implementation-golden-path"));
  const stalePath = joined("09-", "implementation-golden-path");
  const path = "scripts/verify-module-8.test.mjs";
  const baseline = baselineFixture();
  write(path, 'const allowed = negativeFixture("old-module-9-path", "09-implementation-golden-path.md");\n');
  verifyStaleNumbering(root, { paths: [path], historicalLineage: {}, textExceptions: [], baseline });

  write(path, `const allowed = negativeFixture("old-module-9-path", "09-implementation-golden-path.md");\nconst laundered = ${JSON.stringify(stalePath)};\n`);
  assert.throws(
    () => verifyStaleNumbering(root, { paths: [path], historicalLineage: {}, textExceptions: [], baseline }),
    /non-allowlisted stale module numbering/,
  );
}));

test("negativeFixture syntax cannot launder stale text in a production file", () => withFixture(({ root, write }) => {
  const path = "scripts/fixture.mjs";
  const baseline = baselineFixture();
  write(path, 'const hidden = negativeFixture("old-module-9-path", "09-implementation-golden-path.md");\n');
  assert.throws(
    () => verifyStaleNumbering(root, { paths: [path], historicalLineage: {}, textExceptions: [], baseline }),
    /non-allowlisted stale module numbering/,
  );
}));

test("former executable branch, session, and lab labels cannot return", () => withFixture(({ root, write }) => {
  const path = "labs/fixtures/current-lab/helper.mjs";
  const baseline = baselineFixture();
  const oldLabels = negativeFixture("old-executable-labels", joined(
    "branch training/module-", "9; session module-", "9-lab-session; Lab ", "9 implementation",
  ));
  write(path, oldLabels);
  assert.throws(
    () => verifyStaleNumbering(root, { paths: [path], historicalLineage: {}, textExceptions: [], baseline }),
    /former implementation branch[\s\S]*former implementation session[\s\S]*former implementation lab display/,
  );
}));

test("only exact issue-transcript paths receive transcript exemptions", () => withFixture(({ root, write }) => {
  const path = "xbrief/active/2026-09-18-4-refactor-core-curriculum-to-add-required-module-7-on-directi.xbrief.json";
  const baseline = baselineFixture();
  const issue = JSON.parse(readFileSync(resolve(repositoryRoot, path), "utf8"));
  write(path, issue);
  verifyStaleNumbering(root, { paths: [path], historicalLineage: {}, textExceptions: [], baseline });

  issue.plan.metadata.unrelated = { body: negativeFixture("issue-unrelated-body-old-path", "Current path: 09-implementation-golden-path.md") };
  issue.plan.narratives.Laundered = negativeFixture("issue-unrelated-narrative-old-outcome", "Current outcome O9.1");
  write(path, issue);
  assert.throws(
    () => verifyStaleNumbering(root, { paths: [path], historicalLineage: {}, textExceptions: [], baseline }),
    /non-allowlisted stale module numbering/,
  );
}));

test("structured-decision fields cannot launder unlisted stale assertions", () => withFixture(({ root, write }) => {
  const path = "xbrief/decisions/2026-09-18-insert-a-new-current-module-9-design-critique-practicum-renumber.decision.json";
  const baseline = baselineFixture();
  const decision = JSON.parse(readFileSync(resolve(repositoryRoot, path), "utf8"));
  write(path, decision);
  verifyStaleNumbering(root, { paths: [path], historicalLineage: {}, textExceptions: [], baseline });

  decision.whyWinner += negativeFixture("decision-why-winner-old-path", " Current path: 09-implementation-golden-path.md.");
  write(path, decision);
  assert.throws(
    () => verifyStaleNumbering(root, { paths: [path], historicalLineage: {}, textExceptions: [], baseline }),
    /non-allowlisted stale module numbering/,
  );
}));

test("project staleness review cannot create a new stale-number exemption", () => withFixture(({ root, write }) => {
  const path = "xbrief/PROJECT-DEFINITION.xbrief.json";
  const completedId = joined("2026-09-10-module-10-", "testing-gates-and-evidence");
  const completed = { id: completedId, title: "Historical completed scope", status: "completed" };
  const baseline = baselineFixture({}, { [completedId]: completed });
  write(path, {
    plan: {
      items: [completed],
      metadata: { staleness_review: { acknowledged_completed_scope_ids: [completedId] } },
    },
  });
  assert.throws(
    () => verifyStaleNumbering(root, { paths: [path], historicalLineage: {}, textExceptions: [], baseline }),
    /non-allowlisted stale module numbering/,
  );
}));

function writeLineageFixture(write) {
  const opaqueParentId = joined("training.modules", "9-11");
  const retainedFilename = joined("2026-09-05-modules-", "9-11-implementation-gates-and-review.xbrief.json");
  const registryId = retainedFilename.replace(/\.xbrief\.json$/, "");
  write(`xbrief/proposed/${retainedFilename}`, {
    xBRIEFInfo: { description: "Proposed curriculum scope for core Modules 10 through 12" },
    plan: {
      id: opaqueParentId,
      title: "Modules 10-12: Implementation, Gates, Review, and Closeout",
      items: [
        { id: `${opaqueParentId}.implementation`, title: "Author Module 10 and the small test-backed implementation lab" },
        { id: `${opaqueParentId}.gates`, title: "Author Module 11 and red-green-refactor gate lab" },
        { id: `${opaqueParentId}.review`, title: "Author Module 12 and simulated review exercise" },
      ],
      references: [
        { uri: joined("completed/2026-09-10-module-", "9-implementation-golden-path.xbrief.json"), type: "x-xbrief/plan", title: joined("Module ", "9: The Implementation Golden Path"), TrustLevel: "internal" },
        { uri: joined("completed/2026-09-10-module-10-", "testing-gates-and-evidence.xbrief.json"), type: "x-xbrief/plan", title: joined("Module ", "10: Testing, Gates, and Evidence"), TrustLevel: "internal" },
        { uri: joined("completed/2026-09-11-module-11-", "review-and-completion.xbrief.json"), type: "x-xbrief/plan", title: joined("Module ", "11: PR, Review, and Actual Completion"), TrustLevel: "internal" },
      ],
    },
  });
  write("xbrief/proposed/2026-09-05-disposable-end-to-end-capstone.xbrief.json", {
    plan: { metadata: { swarm: { depends_on: [opaqueParentId] } } },
  });
  write("xbrief/PROJECT-DEFINITION.xbrief.json", {
    plan: {
      narratives: { CourseShape: "Twelve core modules plus the capstone." },
      items: [{
        id: registryId,
        title: "Modules 10-12: Implementation, Gates, Review, and Closeout",
        metadata: { source_path: `proposed/${retainedFilename}` },
      }],
    },
  });
  write("ROADMAP.md", [
    "- Modules 10-12: Implementation, Gates, Review, and Closeout -- `[proposed]`",
    joined("- Module ", "11: PR, Review, and Actual Completion -- `[completed]`"),
    joined("- Module ", "10: Testing, Gates, and Evidence -- `[completed]`"),
    joined("- **#34** -- Module ", "9: The Implementation Golden Path -- `[completed]`"),
    joined("- **#78** -- Complete native Windows learner paths for Labs 7, ", "9, and 10 -- `[completed]`"),
    joined("- **#77** -- Labs 7/", "9/10 happy-path tests run unconditionally on unsupported Windows -- `[completed]`"),
    joined("- **#66** -- Labs 7/", "9/10 Windows install fails with npm.cmd EINVAL instead of the documented not-learner-ready stop -- `[completed]`"),
    "",
  ].join("\n"));
  const minutes = [60, 60, 60, 60, 60, 60, 60, 60, 75, 40, 40, 40];
  const names = {
    9: "[Design-critique arcs and verified synthesis](modules/09-design-critique-arcs.md)",
    10: "[The implementation golden path](modules/10-implementation-golden-path.md)",
    11: "[Testing, gates, and evidence](modules/11-testing-gates-and-evidence.md)",
    12: "[PR, review, and actual completion](modules/12-review-and-completion.md)",
  };
  const rows = minutes.map((value, index) => `| ${String(index + 1).padStart(2, "0")} | ${names[index + 1] ?? `Module ${index + 1}`} | ${value} min |`);
  write("curriculum/README.md", `# Course\n\n675 minutes across the modules; 13 hours 15 minutes including the capstone.\n\n${rows.join("\n")}\n`);
  write("package.json", {
    scripts: {
      test: "node --test scripts/verify-module-numbering-migration.test.mjs",
      "check:module-9": "node scripts/verify-module-9.mjs",
      "check:module-10": "node scripts/verify-module-10.mjs",
      "check:module-11": "node scripts/verify-module-11.mjs",
      "check:module-12": "node scripts/verify-module-12.mjs",
      "test:module-9": "node --test scripts/verify-module-9.test.mjs",
      "test:module-10": "node --test scripts/verify-module-10.test.mjs",
      "test:module-11": "node --test scripts/verify-module-11.test.mjs",
      "test:module-12": "node --test scripts/verify-module-12.test.mjs",
      "check:module-numbering": "node scripts/verify-module-numbering-migration.mjs",
      "test:module-numbering": "node --test scripts/verify-module-numbering-migration.test.mjs",
    },
  });
  const workflowPath = ".github/workflows/labs-7-10-11-platform-validation.yml";
  write(workflowPath, [
    "name: labs-7-10-11-platform-validation",
    "paths:",
    `  - \"${workflowPath}\"`,
    "  - \"labs/10-implementation-golden-path.md\"",
    "  - \"labs/11-testing-gates-and-evidence.md\"",
    "  - \"labs/fixtures/10-implementation-golden-path/**\"",
    "  - \"labs/fixtures/11-testing-gates-and-evidence/**\"",
    "run: |",
    "  npm run test:module-10",
    "  npm run test:module-11",
    "",
  ].join("\n"));
  write("xbrief/decisions/2026-09-18-insert-a-new-current-module-9-design-critique-practicum-renumber.decision.json", {
    decision: `Use O9.6-O9.9, then O10.5-O10.9, then O11.5-O11.8, then O12.1-O12.4. Retain ${opaqueParentId}, ${opaqueParentId}.implementation, ${opaqueParentId}.gates, and ${opaqueParentId}.review as a one-time pre-MVP exception.`,
  });
}

test("lineage, projections, module count, and 75/675/795-minute totals are retained", () => withFixture(({ root, write }) => {
  writeLineageFixture(write);
  assert.deepEqual(verifyLineageAndProjection(root), {
    moduleCount: 12,
    moduleMinutes: 675,
    totalMinutesWithCapstone: 795,
  });
  const coursePath = resolve(root, "curriculum/README.md");
  writeFileSync(coursePath, readFileSync(coursePath, "utf8").replace("| 09 | [Design-critique arcs and verified synthesis](modules/09-design-critique-arcs.md) | 75 min |", "| 09 | [Design-critique arcs and verified synthesis](modules/09-design-critique-arcs.md) | 74 min |"));
  assert.throws(() => verifyLineageAndProjection(root), /Module 9 must be exactly 75 minutes/);
}));

test("repository satisfies the final module-numbering migration contract", () => {
  verifyModuleNumberingMigration(repositoryRoot);
});
