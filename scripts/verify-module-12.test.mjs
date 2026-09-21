import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { verifyModule12 } from "./verify-module-12.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const copyPaths = [
  "README.md", "CHANGELOG.md", "COST-ESTIMATE.md", "LICENSE", "package.json", "curriculum", "labs", "solutions",
  "assessments", "maintainers", "references", "scripts", "templates", "history", "xbrief",
];
const historicalLineage = Object.freeze({
  scopeFilename: "2026-09-11-module-11-review-and-completion.xbrief.json",
  projectScopeId: "2026-09-11-module-11-review-and-completion",
  parentScope: "xbrief/proposed/2026-09-05-modules-9-11-implementation-gates-and-review.xbrief.json",
  costEstimateHeading: "## Prior scope — Module 11 and capstone (2026-09-10)",
});
const { scopeFilename, projectScopeId } = historicalLineage;

function copiedRepository() {
  const root = mkdtempSync(join(tmpdir(), "module12-contract-test-"));
  for (const source of copyPaths) cpSync(join(repositoryRoot, source), join(root, source), { recursive: true });
  return root;
}

function changedCopy(path, transform) {
  const root = copiedRepository();
  const target = join(root, path);
  const before = readFileSync(target, "utf8");
  const after = transform(before);
  assert.notEqual(after, before, `negative mutation must change ${path}`);
  writeFileSync(target, after);
  return root;
}

function replaceAfterHeading(body, heading, pattern, replacement) {
  const index = body.indexOf(heading);
  assert.ok(index >= 0, `negative mutation heading is missing: ${heading}`);
  return body.slice(0, index) + body.slice(index).replace(pattern, () => replacement);
}

// Splice the first anchor positionally so no replacement metacharacter is interpreted.
function splicedCopy(path, anchor, replacement) {
  return changedCopy(path, (body) => {
    const index = body.indexOf(anchor);
    assert.ok(index >= 0, `negative mutation anchor is missing in ${path}: ${anchor}`);
    return body.slice(0, index) + replacement + body.slice(index + anchor.length);
  });
}

function completedLifecycleCopy() {
  const root = copiedRepository();
  const activeScope = join(root, "xbrief", "active", scopeFilename);
  const completedScope = join(root, "xbrief", "completed", scopeFilename);
  if (existsSync(activeScope)) renameSync(activeScope, completedScope);
  assert.ok(existsSync(completedScope), "copied repository must contain the Module 12 scope");

  const scope = JSON.parse(readFileSync(completedScope, "utf8"));
  scope.plan.status = "completed";
  for (const item of scope.plan.items) item.status = "completed";
  writeFileSync(completedScope, `${JSON.stringify(scope, null, 2)}\n`);

  const projectPath = join(root, "xbrief", "PROJECT-DEFINITION.xbrief.json");
  const project = JSON.parse(readFileSync(projectPath, "utf8"));
  const projectItem = project.plan.items.find((item) => item.id === projectScopeId);
  projectItem.status = "completed";
  projectItem.metadata.lifecycle_folder = "completed";
  projectItem.metadata.source_path = `completed/${scopeFilename}`;
  writeFileSync(projectPath, `${JSON.stringify(project, null, 2)}\n`);

  const parentPath = join(root, historicalLineage.parentScope);
  const parent = JSON.parse(readFileSync(parentPath, "utf8"));
  const reference = parent.plan.references.find(({ uri }) => uri.endsWith(scopeFilename));
  reference.uri = `completed/${scopeFilename}`;
  writeFileSync(parentPath, `${JSON.stringify(parent, null, 2)}\n`);
  return root;
}

test("Module 12 content contract accepts active and completed lifecycle states", () => {
  assert.ok(verifyModule12(repositoryRoot).artifactCount > 20);
  assert.ok(verifyModule12(completedLifecycleCopy()).artifactCount > 20);
});

test("replaceAfterHeading keeps replacement metacharacters literal", () => {
  assert.equal(
    replaceAfterHeading("before\n## Target\nneedle\n", "## Target", "needle", "$&"),
    "before\n## Target\n$&\n",
  );
});

test("verifier rejects a near-match outcome identifier", () => {
  const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) => replaceAfterHeading(
    body,
    "## Learning outcomes",
    "O12.4",
    "O12.4-extra",
  ));
  assert.throws(() => verifyModule12(root), /Learning outcomes is missing O12\.4/);
});

test("verifier rejects an underscore-suffixed outcome identifier", () => {
  const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) => replaceAfterHeading(
    body,
    "## Learning outcomes",
    "O12.4",
    "O12.4_extra",
  ));
  assert.throws(() => verifyModule12(root), /Learning outcomes is missing O12\.4/);
});

test("verifier rejects a stale or ranged learner baseline", () => {
  const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) => body.replace(
    "| Directive baseline | 0.119.5 |",
    "| Directive baseline | 0.119.5-0.116.0 |",
  ));
  assert.throws(() => verifyModule12(root), /stale or ranged Directive baseline/);
});

test("verifier rejects a missing pre-PR decision worksheet", () => {
  const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) => body.replace(
    "### Worksheet A — pre-PR loop",
    "### Pre-PR answer omitted",
  ));
  assert.throws(() => verifyModule12(root), /pre-PR worksheet/);
});

test("verifier rejects a pre-PR worksheet misplaced outside the exercise", () => {
  const misplaced = [
    "### Worksheet A — pre-PR loop",
    "",
    "| Pass | Restart or exit? | Evidence for your decision |",
    "| --- | --- | --- |",
    "| Pass A |  |  |",
    "| Pass B |  |  |",
    "",
  ].join("\n");
  const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) => body
    .replace("### Worksheet A — pre-PR loop", "### Pre-PR answer omitted")
    .replace("## Exercise", () => `${misplaced}\n## Exercise`));
  assert.throws(() => verifyModule12(root), /pre-PR worksheet/);
});

test("verifier rejects a broken pre-PR phase order", () => {
  const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) => body.replace(
    "Read -> Write -> Lint -> Diff -> Loop",
    "Read -> Lint -> Write -> Diff -> Loop",
  ));
  assert.throws(() => verifyModule12(root), /pre-PR sequence/);
});

test("verifier rejects an incorrect Pass A exit answer", () => {
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    "| Pass A | Restart at Read |",
    "| Pass A | Exit pre-PR |",
  ));
  assert.throws(() => verifyModule12(root), /Pass A must restart/);
});

test("verifier rejects an unclassified supplied finding", () => {
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    "| F4 | P2 | Out of scope | No | Separate scope | CSV support is outside the acceptance criteria. |",
    "| F4 |  |  |  |  | CSV support is outside the acceptance criteria. |",
  ));
  assert.throws(() => verifyModule12(root), /F4 classification/);
});

test("verifier rejects downgrading the supplied P0 blocker", () => {
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    "| F1 | P0 | In scope | Yes | Fix in current batch |",
    "| F1 | P1 | In scope | Yes | Fix in current batch |",
  ));
  assert.throws(() => verifyModule12(root), /F1 classification/);
});

test("verifier rejects reducing the P0 impact to a field name only", () => {
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    "The public error exposes the configured secret value through REPORT_TOKEN.",
    "The public error exposes the fictional REPORT_TOKEN field name.",
  ));
  assert.throws(() => verifyModule12(root), /F1 evidence/);
});

test("verifier rejects turning the supplied P2 into a blocker", () => {
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    "| F3 | P2 | In scope | No | Defer |",
    "| F3 | P2 | In scope | Yes | Defer |",
  ));
  assert.throws(() => verifyModule12(root), /F3 classification/);
});

test("verifier rejects editing before all findings are classified", () => {
  const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) => body.replace(
    "Classify all four findings before proposing any edit.",
    "Propose edits while classification is still open.",
  ));
  assert.throws(() => verifyModule12(root), /classification-before-editing/);
});

test("verifier rejects one-push-per-finding guidance", () => {
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    "one coherent batch, not one push per finding",
    "one push per finding",
  ));
  assert.throws(() => verifyModule12(root), /coherent fix-batch guidance/);
});

test("verifier rejects expanding the current batch for an out-of-scope finding", () => {
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    "| F4 | P2 | Out of scope | No | Separate scope | CSV support is outside the acceptance criteria. |",
    "| F4 | P2 | Out of scope | No | Include in current batch | CSV support is outside the acceptance criteria. |",
  ));
  assert.throws(() => verifyModule12(root), /F4 classification/);
});

test("verifier rejects duplicate finding classifications", () => {
  const row = "| F4 | P2 | Out of scope | No | Separate scope | CSV support is outside the acceptance criteria. |";
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(row, `${row}\n${row}`));
  assert.throws(() => verifyModule12(root), /exactly one F4 classification row/);
});

test("verifier rejects an extra finding classification row", () => {
  const row = "| F4 | P2 | Out of scope | No | Separate scope | CSV support is outside the acceptance criteria. |";
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    row,
    `${row}\n| F5 | P2 | Out of scope | No | Separate scope | Unsupplied finding. |`,
  ));
  assert.throws(() => verifyModule12(root), /exactly four supplied finding rows/);
});

test("verifier rejects contradictory review guidance appended beside correct guidance", () => {
  for (const guidance of [
    "- Edit F1 before classifying F2-F4.",
    "- Push each finding separately.",
    "1. Push each finding separately.",
    "Push each finding separately.",
    "- Treat an integration merge as delivered.",
  ]) {
    const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) => `${body}\n${guidance}\n`);
    assert.throws(() => verifyModule12(root), /contradictory review guidance/);
  }
});

test("verifier rejects a stale review used for a merge-ready claim", () => {
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    "| C3 | H2 checks pass; only H1 was reviewed | Not merge-ready | Unknown | Unknown |",
    "| C3 | H2 checks pass; only H1 was reviewed | Merge-ready | Unknown | Unknown |",
  ));
  assert.throws(() => verifyModule12(root), /C3 stale-review classification/);
});

test("verifier rejects a merge-ready claim with an unresolved blocker", () => {
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    "fresh H2 review has zero unresolved P0 or P1 findings",
    "fresh H2 review has one unresolved P1 finding",
  ));
  assert.throws(() => verifyModule12(root), /C4 merge-ready classification/);
});

test("verifier rejects delivery without delivery-branch reachability and closeout", () => {
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    "| C6 | Commit is reachable from `origin/main`; lifecycle scope remains active | Reachable on delivery branch; not delivered | Unknown | Unknown |",
    "| C6 | Commit is reachable from `origin/main`; lifecycle scope remains active | Delivered | Unknown | Unknown |",
  ));
  assert.throws(() => verifyModule12(root), /C6 delivery classification/);
});

test("verifier rejects collapsing the completion evidence axes", () => {
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    "| C8 | C7 evidence plus a deployment record tying H2 to `training-staging`; no UAT evidence | Delivered | Deployed in `training-staging` | Unknown |",
    "| C8 | C7 evidence plus a deployment record tying H2 to `training-staging`; no UAT evidence | Delivered and deployed in `training-staging` |  | Unknown |",
  ));
  assert.throws(() => verifyModule12(root), /C8 completion axes/);
});

test("verifier rejects an extra completion-card row", () => {
  const row = "| C9 | C7 evidence plus an authorized UAT record for `training-staging`; no deployment record | Delivered | Unknown | UAT-verified in `training-staging` | Deployment record for the claimed environment |";
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    row,
    `${row}\n| C10 | No supplied evidence | Unknown | Unknown | Unknown | Supplied card |`,
  ));
  assert.throws(() => verifyModule12(root), /exactly nine completion rows/);
});

test("verifier rejects deployment inferred from Git state", () => {
  for (const guidance of ["Infer deployment from Git state.", "- Infer deployment from Git state."]) {
    const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => `${body}\n${guidance}\n`);
    assert.throws(() => verifyModule12(root), /deployment inference/);
  }
});

test("verifier rejects UAT inferred from Git state", () => {
  for (const guidance of ["Infer UAT from Git state.", "- Infer UAT from Git state."]) {
    const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => `${body}\n${guidance}\n`);
    assert.throws(() => verifyModule12(root), /UAT inference/);
  }
});

test("verifier rejects a Markdown-bullet Greptile dependency", () => {
  for (const guidance of [
    "- Use Greptile on the PR before continuing.",
    "- You must use Greptile on the PR before continuing.",
    "- Greptile approval is required.",
    "- Open the live UAT environment.",
    "- Run a live deployment.",
  ]) {
    const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) => `${body}\n${guidance}\n`);
    assert.throws(() => verifyModule12(root), /live review dependency/);
  }
});

test("verifier rejects a live review dependency in the Module 12 source record", () => {
  const root = changedCopy("references/SOURCE-NOTES.md", (body) => body.replace(
    "## Capstone source validation",
    "- Greptile approval is required.\n\n## Capstone source validation",
  ));
  assert.throws(() => verifyModule12(root), /live review dependency/);
});

test("verifier rejects executable shell blocks", () => {
  const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) => `${body}\n\`\`\`sh\ngit status\n\`\`\`\n`);
  assert.throws(() => verifyModule12(root), /command-free exercise/);
});

test("verifier rejects a Module 12 lab fixture", () => {
  const root = copiedRepository();
  const fixture = join(root, "labs", "fixtures", "12-review-and-completion");
  mkdirSync(fixture, { recursive: true });
  writeFileSync(join(fixture, "README.md"), "unexpected fixture\n");
  assert.throws(() => verifyModule12(root), /without a fixture/);
});

test("verifier rejects a broken local navigation link", () => {
  const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) => body.replace(
    "11-testing-gates-and-evidence.md",
    "10-missing.md",
  ));
  assert.throws(() => verifyModule12(root), /broken local link/);
});

test("verifier rejects a missing Module 12 source record", () => {
  const root = changedCopy("references/SOURCE-NOTES.md", (body) => body.replace(
    "## Module 12 source validation",
    "## Review source notes",
  ));
  assert.throws(() => verifyModule12(root), /Module 12 source validation/);
});

test("verifier separates current Module 12 roles from historical evidence", () => {
  for (const [path, heading, pattern] of [
    ["references/SOURCE-BASELINE.md", "## Release identity", /Consumer project pin[^\n]*@deftai\/directive: 0\.119\.5/i],
    ["references/SOURCE-BASELINE.md", "## Module 12 review-and-completion validation", /learner pin, authoring runtime, and deposit all resolve to 0\.119\.5/i],
    ["references/SOURCE-NOTES.md", "## Verification context", /Project direct pin:[^\n]*0\.119\.5/i],
  ]) {
    const root = changedCopy(path, (body) => replaceAfterHeading(body, heading, pattern, "current baseline role omitted"));
    assert.throws(() => verifyModule12(root), /current Module 12 baseline role/);
  }
  const currentAuthoring = changedCopy("references/SOURCE-NOTES.md", (body) => replaceAfterHeading(
    body,
    "## Verification context",
    /Current authoring context:[\s\S]{0,240}engine 0\.119\.5[\s\S]{0,240}content 0\.119\.5[\s\S]{0,240}v0\.119\.5/i,
    "Current authoring context omitted",
  ));
  assert.throws(() => verifyModule12(currentAuthoring), /aligned current authoring context/);

  for (const [path, heading, pattern] of [
    ["COST-ESTIMATE.md", historicalLineage.costEstimateHeading, /project remains pinned to Directive 0\.112\.0 for learner-facing claims/i],
    ["references/SOURCE-NOTES.md", "## Module 12 source validation", /learner baseline remains 0\.112\.0/i],
  ]) {
    const root = changedCopy(path, (body) => replaceAfterHeading(body, heading, pattern, "historical learner pin omitted"));
    assert.throws(() => verifyModule12(root), /preserve its historical learner baseline/);
  }

  for (const [path, heading] of [
    ["COST-ESTIMATE.md", historicalLineage.costEstimateHeading],
    ["references/SOURCE-NOTES.md", "## Module 12 source validation"],
  ]) {
    const root = changedCopy(path, (body) => replaceAfterHeading(
      body,
      heading,
      /default unqualified\s+shell CLI reported\s+engine 0\.114\.0/i,
      "historical authoring role omitted",
    ));
    assert.throws(() => verifyModule12(root), /historical authoring role/);
  }
});

test("verifier rejects authoring runtime versions in the learner baseline", () => {
  const root = changedCopy("references/SOURCE-BASELINE.md", (body) => body.replace(
    "maintainer-only source notes",
    "maintainer-only 0.117.0 source notes",
  ));
  assert.throws(() => verifyModule12(root), /historical authoring-runtime versions out of the current learner baseline/);
});

test("verifier rejects unbounded historical learner-baseline context", () => {
  const root = changedCopy("references/SOURCE-NOTES.md", (body) => body.replace(
    "Historical learner-baseline executable context",
    "Executed CLI",
  ));
  assert.throws(() => verifyModule12(root), /historical learner-baseline context/);
});

test("verifier rejects later authoring values substituted into historical probes", () => {
  for (const [before, after] of [
    ["@deftai/directive: 0.112.0", "@deftai/directive: 0.116.0"],
    ["@deftai/directive-core@0.112.0", "@deftai/directive-core@0.116.0"],
    ["CLI package version 0.112.0", "CLI package version 0.116.0"],
    ["Deposit surfaces say 0.112.0", "Deposit surfaces say 0.116.0"],
  ]) {
    const root = changedCopy("references/SOURCE-NOTES.md", (body) => replaceAfterHeading(
      body,
      "## Historical 0.112.0 learner-baseline version and provenance probes",
      before,
      after,
    ));
    assert.throws(() => verifyModule12(root), /historical learner-baseline/);
  }
});

test("verifier rejects regression to a planned capstone", () => {
  const root = changedCopy("curriculum/README.md", (body) => body.replace(
    "The learner-ready [two-hour capstone]",
    "The planned [two-hour capstone]",
  ));
  assert.throws(() => verifyModule12(root), /capstone must remain learner-ready/);
});

test("verifier rejects a missing Module 12 capstone forward link", () => {
  const root = changedCopy("curriculum/modules/12-review-and-completion.md", (body) => body.replace(
    "../capstone-end-to-end.md",
    "../README.md",
  ));
  assert.throws(() => verifyModule12(root), /link forward to the learner-ready capstone/);
});

test("verifier rejects a missing Module 12 solution capstone link", () => {
  const root = changedCopy("solutions/module-12-review-and-completion.md", (body) => body.replace(
    "../curriculum/capstone-end-to-end.md",
    "../curriculum/README.md",
  ));
  assert.throws(() => verifyModule12(root), /continue to the learner-ready capstone/);
});

test("verifier rejects an unlinked or unavailable Module 12 course row", () => {
  const linked = "| 12 | [PR, review, and actual completion](modules/12-review-and-completion.md) | 55 min | Learner-ready; command-free fixed-state exercise | Resolve simulated findings and classify completion evidence |";
  for (const replacement of [
    "| 12 | `PR, review, and actual completion (modules/12-review-and-completion.md)` | 55 min | Learner-ready; command-free fixed-state exercise | Resolve simulated findings and classify completion evidence |",
    "| 12 | [PR, review, and actual completion](modules/12-review-and-completion.md) | 55 min | Not yet available | Resolve simulated findings and classify completion evidence |",
  ]) {
    const root = changedCopy("curriculum/README.md", (body) => body.replace(linked, replacement));
    assert.throws(() => verifyModule12(root), /Module 12 course row/);
  }
});

test("verifier rejects an altered exact project pin", () => {
  const root = changedCopy("package.json", (body) => body.replace(
    '"@deftai/directive": "0.119.5"',
    '"@deftai/directive": "^0.119.5"',
  ));
  assert.throws(() => verifyModule12(root), /must pin @deftai\/directive exactly/);
});

test("verifier rejects an altered Module 12 package entry", () => {
  const root = changedCopy("package.json", (body) => body.replace(
    '"test:module-12": "node --test scripts/verify-module-12.test.mjs"',
    '"test:module-12": "node scripts/verify-module-12.test.mjs"',
  ));
  assert.throws(() => verifyModule12(root), /test:module-12/);
});

const module12Path = "curriculum/modules/12-review-and-completion.md";

test("verifier rejects dropping the verify:orphan-active mapping to C6", () => {
  const root = splicedCopy(module12Path, "`verify:orphan-active` decides **C6**", "`verify:orphan-active` decides a later card");
  assert.throws(() => verifyModule12(root), /map verify:orphan-active to completion card C6/);
});

test("verifier rejects dropping scope:complete as the C6 repair", () => {
  const root = splicedCopy(module12Path, "and its repair\nis `scope:complete`", "and it has no stated repair");
  assert.throws(() => verifyModule12(root), /name scope:complete as the C6 repair/);
});

test("verifier rejects dropping the tracked-delivery wording", () => {
  const root = splicedCopy(
    module12Path,
    "reachable from the delivery\nbranch and its closeout artifact is tracked there",
    "reachable from the delivery branch",
  );
  assert.throws(() => verifyModule12(root), /missing the tracked-delivery wording/);
});

test("verifier rejects leaving delivered provenance undefined for card C7", () => {
  const root = splicedCopy(
    module12Path,
    "**delivered provenance** names exactly that tracked",
    "delivered provenance loosely suggests some tracked",
  );
  assert.throws(() => verifyModule12(root), /define delivered provenance as tracked closeout/);
});

test("verifier rejects carding the untracked-closeout state against C7", () => {
  const root = splicedCopy(module12Path, "deliberately not one of the nine cards below", "the state card C7 below already carries");
  assert.throws(() => verifyModule12(root), /uncarded rather than contrast it with C7/);
});

test("verifier rejects dropping the lifecycle-pull-request repair", () => {
  const root = splicedCopy(module12Path, "Its repair is a\nlifecycle pull request", "It has no repair");
  assert.throws(() => verifyModule12(root), /lifecycle pull request as the untracked-closeout repair/);
});

test("verifier rejects dropping the untracked-closeout recovery row", () => {
  const root = splicedCopy(module12Path, "| A local closeout is called delivered |", "| A local closeout is enough |");
  assert.throws(() => verifyModule12(root), /recovery table is missing the untracked-closeout row/);
});

test("verifier rejects dropping the completed-means-landed misconception", () => {
  const root = splicedCopy(module12Path, "Completed means landed.", "Completion is landing.");
  assert.throws(() => verifyModule12(root), /completed-means-landed misconception/);
});
