import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { verifyModule6 } from "./verify-module-6.mjs";

/**
 * Splice out the first literal occurrence of `search` by position. Fixture mutations never
 * go through string replacement, so no dollar-sign sequence in the replacement text can be
 * expanded, and a target that no longer exists fails loudly instead of silently no-opping.
 * @param {string} body Text to mutate.
 * @param {string} search Literal substring to remove.
 * @param {string} [replacement] Literal text to splice in.
 * @returns {string} The mutated text.
 */
function splice(body, search, replacement = "") {
  const at = body.indexOf(search);
  assert.notEqual(at, -1, `fixture mutation target not found: ${search}`);
  return body.slice(0, at) + replacement + body.slice(at + search.length);
}

/**
 * Positional `splice` applied to every occurrence of `search`.
 * @param {string} body Text to mutate.
 * @param {string} search Literal substring to remove.
 * @param {string} [replacement] Literal text to splice in.
 * @returns {string} The mutated text.
 */
function spliceAll(body, search, replacement = "") {
  const parts = body.split(search);
  assert.ok(parts.length > 1, `fixture mutation target not found: ${search}`);
  return parts.join(replacement);
}

const module6 = "curriculum/modules/06-creating-well-shaped-work.md";
const solution6 = "solutions/module-06-creating-well-shaped-work.md";
const module5 = "curriculum/modules/05-sources-versus-projections.md";
const module7 = "curriculum/modules/07-scope-lifecycle.md";
const lab7 = "labs/07-scope-lifecycle.md";
const lab7Solution = "solutions/lab-07-scope-lifecycle.md";
const moduleHeadings = [
  "Module record", "Learning outcomes", "Structural evidence for O6.2", "Starting-state check", "Why this matters",
  "Terminology", "Mental model", "Guided explanation", "Walkthrough", "Exercise",
  "Completion evidence", "Progressive hints", "Expected failures and recovery",
  "Common misconceptions", "Self-assessment", "Explained solution", "Navigation",
  "Official sources",
];
const solutionHeadings = [
  "Solution record", "Before you use this solution", "Result summary", "Outcome map",
  "Reasoning", "Worked approach", "Acceptance evidence", "Compare with your attempt",
  "Valid alternatives", "Expected failures and recovery",
  "Misconceptions exposed by this exercise", "Retry plan", "Reset and cleanup", "Sources",
  "Continue",
];
const outcomes = "O6.1 O6.2 O6.3 O6.4";

function document(headings, overrides = {}) {
  return `# Example\n\n${headings.map((heading) => {
    const content = overrides[heading] ?? `Inspect retained evidence for ${outcomes}.`;
    return `## ${heading}\n\n${content}\n`;
  }).join("\n")}`;
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "module6-contract-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, content) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  };
  const record = [
    "| Directive baseline | `@deftai/directive@0.119.5`, engine `@deftai/directive-core@0.119.5` |",
    "| Status | learner-ready draft; command-free |",
  ].join("\n");
  write(module6, document(moduleHeadings, {
    "Module record": record,
    "Learning outcomes": [
      "O6.1 and O6.3 and O6.4 are recorded here.",
      "",
      "- **O6.2 — Trace idea to proposed scope.** Record a bounded strategy choice, a testable specification statement, and a schema-0.8 proposed-scope artifact while preserving the boundary that a proposal is not implementation authority.",
    ].join("\n"),
    "Structural evidence for O6.2": [
      "The worksheet stays command-free. The structural check is an **adjacent practical lab",
      "step**: [Lab 7](../../labs/07-scope-lifecycle.md) Task 5 consumes the exact artifact.",
      "",
      "`directive xbrief:verify -- --format json --out <your artifact path> --style scope --project-root <lab root>`",
      "",
      "Retain the artifact **path**, the exact **command**, its **exit code**, and its **result**.",
      "",
      "`xbrief:preflight` and `doctor` are not the authoring-validity pass.",
      "",
      "| Surface | Proves | Does not prove |",
      "| --- | --- | --- |",
      "| `xbrief:verify` | Parse and lifecycle-record structure | The version, the status, or observability |",
      "| Module 6 comparison rubric | Bounded strategy, observable acceptance, traces, and the absence of implementation authority | That the file parses |",
      "",
      "A green structural result grants no promotion, no activation, and no implementation authority.",
      "",
      "Command choice, invocation, output interpretation, and recovery are not assessed here, so no outcome is added or recut.",
    ].join("\n"),
    "Starting-state check": "Pass: identify a horizontal plan. Recovery: review Module 5. " + outcomes,
    "Exercise": [
      "### Fictional scenario",
      "Northstar has fictional work only.",
      "### Your task",
      "Record a bounded strategy choice, a testable specification statement, and one vertical slice in a schema-0.8 proposed-scope artifact.",
      "Record two to five criteria under plan.items[].narrative.Acceptance with evidence and traces.",
      "### Evidence to keep",
      "Artifact | User-visible outcome | Exclusions | Literal inspection",
      "",
      "Create ordered independently verifiable slices.",
      "Order | Slice | Dependency rationale | Boundary rationale",
      "",
      "Complete the required mechanism-shaped routing matrix.",
      "Fact pattern ID | Controlling supplied fact | Disposition | Proposed mechanism revision | Safe next action",
      "--- | --- | --- | --- | ---",
      "M6-ROUTE-01, M6-NOROUTE-01, and M6-INSUFFICIENT-01 must resolve to route, no route, and insufficient evidence.",
      "All three rows are required and non-compensating.",
      "Every row identifies a scenario-specific controlling fact, disposition, and safe next action; the route row names the proposed mechanism revision.",
      "A row that merely repeats a disposition or gives a keyword-only answer does not pass.",
      "",
      "`xBRIEFInfo.version: 0.8`; `plan.status: proposed`.",
      "A proposal is reviewable candidate state, not implementation authority.",
      "### Exercise acceptance",
      outcomes,
    ].join("\n"),
    "Completion evidence": [
      "O6.1 and O6.3 and O6.4 keep their rows.",
      "",
      "| Outcome | Evidence to show | Passing condition |",
      "| --- | --- | --- |",
      "| O6.2 | Strategy decision and the Lab 7 Task 5 structural record naming the artifact path, the exact command, the exit code, and the result | `xbrief:verify` exits `0` against that exact artifact path. A green structural result grants no promotion, activation, or implementation authority. |",
    ].join("\n"),
    "Self-assessment": outcomes,
    "Explained solution": "Use the [explained solution](../../solutions/module-06-creating-well-shaped-work.md).",
    "Navigation": "Previous: [Module 5](05-sources-versus-projections.md). Next: [Module 7](07-scope-lifecycle.md); see the [course map](../README.md).",
    "Official sources": "See the [source baseline](../../references/SOURCE-BASELINE.md) and [Module 6 source validation](../../references/SOURCE-NOTES.md#module-6-source-validation).",
  }));
  write(solution6, document(solutionHeadings, {
    "Solution record": record,
    "Outcome map": outcomes,
    "Worked approach": [
      "Inspect this proposed-scope artifact.",
      "",
      "```json",
      "{",
      '  "xBRIEFInfo": { "version": "0.8" },',
      '  "plan": {',
      '    "title": "Preview one delayed route",',
      '    "status": "proposed",',
      '    "items": [',
      '      { "id": "criterion-1", "title": "Show the preview", "status": "proposed", "narrative": { "Acceptance": "Visible preview", "Traces": "fictional-idea" } },',
      '      { "id": "criterion-2", "title": "Preserve the boundary", "status": "proposed", "narrative": { "Acceptance": "Bounded exclusions", "Traces": "fictional-idea" } }',
      "    ]",
      "  }",
      "}",
      "```",
      "",
      "| Fact pattern ID | Controlling supplied fact | Disposition | Proposed mechanism revision | Safe next action |",
      "| --- | --- | --- | --- | --- |",
      "| M6-ROUTE-01 | NS-INGEST-R2 changes how untrusted issue text enters the agent envelope and how clearance is recognized. | route | `NS-INGEST-R2` | Preserve proposed state and route NS-INGEST-R2 to design critique before promotion, activation, or implementation. |",
      "| M6-NOROUTE-01 | The edit changes one error-message phrase while behavior, authority, parser inputs, and gates stay unchanged. | no route | Not applicable. | Continue through ordinary proposal review without inventing an arc. |",
      "| M6-INSUFFICIENT-01 | Make agent intake safer supplies no mechanism, target revision, or authority-boundary change. | insufficient evidence | Not applicable. | Request the missing mechanism and target evidence, then rerun the routing decision. |",
    ].join("\n"),
    "Acceptance evidence": [
      "O6.1 and O6.3 and O6.4 keep their rows.",
      "",
      "| Inspection | Required result | Worked evidence | Outcome |",
      "| --- | --- | --- | --- |",
      "| Structural conformance of the exact artifact | `xbrief:verify` exits `0` against the learner's artifact path, with path, command, exit code, and result retained | Step 2 structural record | O6.2 |",
    ].join("\n"),
    "Continue": "Continue to [Module 7](../curriculum/modules/07-scope-lifecycle.md) or review the [course map](../curriculum/README.md).",
    "Sources": "See the [source baseline](../references/SOURCE-BASELINE.md) and [Module 6 source validation](../references/SOURCE-NOTES.md#module-6-source-validation).",
  }));
  write(module5, "# Module 5\n\n## Navigation\n\nNext: [Module 6](06-creating-well-shaped-work.md).\n");
  write(lab7, [
    "# Lab 7",
    "",
    "## Tasks",
    "",
    "### Task 5 — Author and structurally verify your own proposed scope",
    "",
    "Consume the artifact from [Module 6](../curriculum/modules/06-creating-well-shaped-work.md) Part B.",
    "Both supplied scopes stay untouched; yours is a third record beside them.",
    "",
    "```sh",
    'authored="$first_root/xbrief/proposed/2026-01-15-your-proposed-scope.xbrief.json"',
    'authored_command="node $first_root/node_modules/.bin/directive xbrief:verify -- --format json --out $authored --style scope --project-root $first_root"',
    "set +e",
    'node "$first_root/node_modules/.bin/directive" xbrief:verify -- --format json --out "$authored" --style scope --project-root "$first_root" > "$evidence/authored-verify.txt" 2>&1',
    "authored_exit=$?",
    "set -e",
    `printf 'path=%s\\ncommand=%s\\nexit=%s\\n' "$authored" "$authored_command" "$authored_exit" >> "$evidence/authored-verify.txt"`,
    'test -f "$first_root/xbrief/completed/2026-01-15-fictional-delivery.xbrief.json"',
    'test -f "$first_root/xbrief/cancelled/2026-01-15-fictional-cancel.xbrief.json"',
    "```",
    "",
    "- `xbrief:verify` is not a lifecycle move. Do not promote or activate your scope.",
    "- `xbrief:preflight` and `doctor` are not the authoring-validity pass.",
    "- A green structural result grants no promotion, no activation, and no implementation authority.",
    "",
    "This step is supplied verbatim and adds no Lab 7 outcome.",
  ].join("\n"));
  write(lab7Solution, document(solutionHeadings, {
    "Solution record": record,
    "Result summary": [
      "Task 5 checked the scope authored in Module 6 Part B. It supplies adjacent Module 6 O6.2",
      "structural evidence and adds no Lab 7 outcome.",
    ].join("\n"),
    "Worked approach": [
      "### Step 5 — Verify the scope you authored (Task 5)",
      "",
      "- `xbrief:verify` is not a lifecycle move. Do not promote or activate your scope.",
      "- A green structural result grants no promotion, no activation, and no implementation authority.",
      "- `xbrief:preflight` and `doctor` are not the authoring-validity pass.",
      "- The structural result does not prove version `0.8`, proposed status, observable acceptance,",
      "  or traces.",
      "",
      "The long table stays in the [Module 6 structural record](module-06-creating-well-shaped-work.md#structural-record).",
    ].join("\n"),
    "Compare with your attempt": [
      "1. Did you record both the Task and engine exits?",
      "2. Does your Task 5 record carry all four retained fields — the artifact **path**, the exact",
      "   `xbrief:verify` **command**, the **exit code**, and the **result** line?",
      "",
      "A “no” on question 1 identifies the smallest Lab 7 outcome to retry. A “no” on question 2",
      "is not a Lab 7 outcome miss. Re-author the artifact against",
      "[Module 6](../curriculum/modules/06-creating-well-shaped-work.md) Part B in place, then rerun",
      "the same `xbrief:verify` command against the same path and retain both exit codes.",
    ].join("\n"),
    "Continue": "Continue to [Module 8](../curriculum/modules/08-session-and-work-selection.md).",
  }));
  write(module7, "# Module 7\n");
  write("README.md", "# Training\n\n2. Note the current teaching baseline: `@deftai/directive` <!-- directive-training:teaching-baseline -->0.119.5<!-- /directive-training:teaching-baseline --> with xBRIEF schema 0.8.\n\nContinue with [Module 6](curriculum/modules/06-creating-well-shaped-work.md).\n");
  write("curriculum/README.md", "# Course\n\n| Module | Status |\n| --- | --- |\n| [Module 6](modules/06-creating-well-shaped-work.md) | Learner-ready draft; command-free |\n| [Module 7](modules/07-scope-lifecycle.md) | Learner-ready draft |\n");
  write("assessments/README.md", "# Assessments\n\nUse [Module 6](../curriculum/modules/06-creating-well-shaped-work.md#self-assessment) to inspect the required route / no route / insufficient evidence matrix for O6.4.\n");
  write("solutions/README.md", "# Solutions\n\nUse the [Module 6 solution](module-06-creating-well-shaped-work.md).\n");
  write("references/GLOSSARY.md", "# Glossary\n\n## Vertical slice\n\nAn independently demoable, human-observable capability.\n\n## Horizontal plan\n\nWork grouped by component rather than outcome.\n\n## Proposed scope\n\nA reviewable candidate that grants no implementation authority.\n");
  write("references/QUICK-REFERENCE.md", "# Quick reference\n\n## Shape work\n\nRecord a bounded strategy choice, User-visible outcome, Dependency rationale, and Boundary rationale. Use the [Module 6 worksheet](../curriculum/modules/06-creating-well-shaped-work.md#exercise).\n");
  write("references/SOURCE-BASELINE.md", "# Source baseline\n\nExact training release: `@deftai/directive@0.119.5` and `@deftai/directive-core@0.119.5`. See [notes](SOURCE-NOTES.md#module-6-source-validation).\n");
  write("references/SOURCE-NOTES.md", [
    "# Source notes", "", "## Module 6 source validation", "",
    "Validated against Directive 0.119.5: `.deft/core/docs/directive-lifecycle.md`, `.deft/core/strategies/README.md`, `.deft/core/strategies/interview.md`, `.deft/core/skills/deft-directive-setup/SKILL.md`, `.deft/core/skills/deft-directive-decompose/SKILL.md`, `.deft/core/vbrief/vbrief.md`, `.deft/core/verification/verification.md`, `.deft/core/verification/plan-checking.md`, `.deft/core/glossary.md`, `.deft/core/skills/deft-directive-gh-slice/SKILL.md`, `.deft/core/commands.md`, and `.deft/core/main.md`.",
    "", "Recorded disagreements: deprecated command aliases, legacy vBRIEF wording, optional specification, approval does not immediately promote, dependency field scope, SPECIFICATION.md assumption, legacy plan paths, curated help omissions, and consumer task namespacing.",
  ].join("\n"));
  write("maintainers/CURRICULUM-MAINTENANCE.md", "# Maintenance\n\nRun `npm run check:module-6` and `node --test scripts/verify-module-6.test.mjs`.\n");
  write("xbrief/PROJECT-DEFINITION.xbrief.json", JSON.stringify({
    xBRIEFInfo: { version: "0.8" },
    plan: { items: [{ id: "module-7", title: "Module 7", status: "running", metadata: { lifecycle_folder: "active" } }] },
  }));
  write("package.json", JSON.stringify({
    private: true,
    scripts: {
      "check:module-6": "node scripts/verify-module-6.mjs",
      "test:module-6": "node --test scripts/verify-module-6.test.mjs",
    },
    devDependencies: { "@deftai/directive": "0.119.5" },
  }));
  return {
    root,
    write,
    change(path, transform) {
      write(path, transform(readFileSync(join(root, path), "utf8")));
    },
  };
}

test("accepts a complete command-free Module 6 contract", (t) => {
  assert.equal(verifyModule6(fixture(t).root).artifactCount, 16);
});

for (const [path, headings] of [[module6, moduleHeadings], [solution6, solutionHeadings]]) {
  for (const heading of headings) {
    test(`rejects missing ${heading} in ${path}`, (t) => {
      const files = fixture(t);
      files.change(path, (body) => splice(body, `## ${heading}`, "## Unrelated section"));
      assert.throws(() => verifyModule6(files.root), /missing heading/);
    });
  }
}

for (const [path, headings] of [
  [module6, ["Learning outcomes", "Exercise acceptance", "Completion evidence", "Self-assessment"]],
  [solution6, ["Outcome map", "Acceptance evidence"]],
]) {
  for (const heading of headings) {
    for (const outcome of ["O6.1", "O6.2", "O6.3", "O6.4"]) {
      test(`rejects ${outcome} missing from ${path} ${heading}`, (t) => {
        const files = fixture(t);
        files.change(path, (content) => {
          const marker = `## ${heading}`;
          const start = content.indexOf(marker);
          const next = content.indexOf("\n## ", start + marker.length);
          const end = next < 0 ? content.length : next;
          return content.slice(0, start) + splice(content.slice(start, end), outcome, `${outcome}-extra`) + content.slice(end);
        });
        assert.throws(() => verifyModule6(files.root), new RegExp(`${heading}.*${splice(outcome, ".", "\\.")}`));
      });
    }
  }
}

test("rejects a near-match routing disposition", (t) => {
  const files = fixture(t);
  files.change(module6, (content) => spliceAll(content, "insufficient evidence", "insufficient evidence-extra"));
  assert.throws(() => verifyModule6(files.root), /missing disposition insufficient evidence/);
});

for (const field of ["Artifact", "User-visible outcome", "Exclusions", "Literal inspection", "Dependency rationale", "Boundary rationale"]) {
  test(`rejects a missing exercise field: ${field}`, (t) => {
    const files = fixture(t);
    files.change(module6, (body) => splice(body, field, "Missing field"));
    assert.throws(() => verifyModule6(files.root), /exercise.*(?:field|rationale)/i);
  });
}

test("rejects a proposal that is not schema 0.8 proposed candidate state", (t) => {
  const files = fixture(t);
  files.change(module6, (body) => splice(body, "xBRIEFInfo.version: 0.8", "xBRIEFInfo.version: 0.6"));
  assert.throws(() => verifyModule6(files.root), /schema 0\.8|legacy xBRIEF/i);
  files.change(module6, (body) => splice(splice(body, "xBRIEFInfo.version: 0.6", "xBRIEFInfo.version: 0.8"), "plan.status: proposed", "plan.status: running"));
  assert.throws(() => verifyModule6(files.root), /proposed/);
});

test("rejects loss of the proposal authority boundary", (t) => {
  const files = fixture(t);
  files.change(module6, (body) => splice(body, "not implementation authority", "implementation authority"));
  assert.throws(() => verifyModule6(files.root), /authority boundary/);
});

test("rejects loss of the two-to-five acceptance-criteria contract", (t) => {
  const files = fixture(t);
  files.change(module6, (body) => splice(body, "two to five criteria", "one criterion"));
  assert.throws(() => verifyModule6(files.root), /two to five acceptance criteria/i);
});

test("rejects a missing O6.4 routing matrix", (t) => {
  const files = fixture(t);
  files.change(module6, (body) => splice(
    body,
    "Fact pattern ID | Controlling supplied fact | Disposition | Proposed mechanism revision | Safe next action",
    "Scenario summary",
  ));
  assert.throws(() => verifyModule6(files.root), /O6\.4 routing matrix/i);
});

test("rejects a presence-only O6.4 solution matrix", (t) => {
  const files = fixture(t);
  files.change(solution6, (body) => splice(
    body,
    "NS-INGEST-R2 changes how untrusted issue text enters the agent envelope and how clearance is recognized.",
    "untrusted issue text clearance",
  ));
  assert.throws(() => verifyModule6(files.root), /M6-ROUTE-01 controlling fact/i);
});

test("rejects keyword-only O6.4 actions", (t) => {
  const files = fixture(t);
  files.change(solution6, (body) => splice(
    body,
    "Preserve proposed state and route NS-INGEST-R2 to design critique before promotion, activation, or implementation.",
    "proposed route design critique promotion activation implementation",
  ));
  assert.throws(() => verifyModule6(files.root), /M6-ROUTE-01 safe next action/i);
});

test("rejects a route row without a proposed mechanism revision", (t) => {
  const files = fixture(t);
  files.change(solution6, (body) => splice(body, "| route | `NS-INGEST-R2` |", "| route | Not applicable. |"));
  assert.throws(() => verifyModule6(files.root), /M6-ROUTE-01 proposed mechanism revision/i);
});

test("rejects a redesign sentence in the proposed mechanism revision column", (t) => {
  const files = fixture(t);
  files.change(solution6, (body) => splice(
    body,
    "| route | `NS-INGEST-R2` |",
    "| route | Revise NS-INGEST-R2 so quoted source content stays evidence and only an admitted completed-arc record supplies clearance. |",
  ));
  assert.throws(() => verifyModule6(files.root), /M6-ROUTE-01 proposed mechanism revision/i);
});

test("rejects a route row whose revision cell names a different identifier", (t) => {
  const files = fixture(t);
  files.change(solution6, (body) => splice(body, "| route | `NS-INGEST-R2` |", "| route | `NS-INGEST-R3` |"));
  assert.throws(() => verifyModule6(files.root), /M6-ROUTE-01 proposed mechanism revision/i);
});

test("keeps `Not applicable.` as the non-route revision fill", (t) => {
  const files = fixture(t);
  assert.equal(verifyModule6(files.root).artifactCount, 16);
  files.change(solution6, (body) => splice(body, "| no route | Not applicable. |", "| no route | `NS-INGEST-R2` |"));
  assert.throws(() => verifyModule6(files.root), /M6-NOROUTE-01 must not invent a mechanism revision/i);
});

test("rejects a worked proposal with fewer than two traced acceptance items", (t) => {
  const files = fixture(t);
  files.change(solution6, (body) => splice(
    body,
    ',\n      { "id": "criterion-2", "title": "Preserve the boundary", "status": "proposed", "narrative": { "Acceptance": "Bounded exclusions", "Traces": "fictional-idea" } }',
  ));
  assert.throws(() => verifyModule6(files.root), /two to five traced acceptance items/i);
});

test("rejects a worked proposal without the required plan title", (t) => {
  const files = fixture(t);
  files.change(solution6, (body) => splice(body, '    "title": "Preview one delayed route",\n'));
  assert.throws(() => verifyModule6(files.root), /plan\.title/i);
});

for (const [field, fragment] of [
  ["title", '"title": "Show the preview", '],
  ["status", '"status": "proposed", '],
]) {
  test(`rejects a worked proposal item without required ${field}`, (t) => {
    const files = fixture(t);
    files.change(solution6, (body) => splice(body, fragment));
    assert.throws(() => verifyModule6(files.root), new RegExp(`item ${field}`, "i"));
  });
}

for (const [label, addition, pattern] of [
  ["missing", "[bad](missing.md)", /broken local link/],
  ["malformed", "[bad](bad%XX.md)", /malformed local link/],
  ["outside repository", "[bad](../../../)", /outside the repository/],
  ["bad fragment", "[bad](05-sources-versus-projections.md#absent)", /broken local heading link/],
  ["undefined reference", "[bad][missing]", /undefined reference link/],
]) {
  test(`rejects a ${label} local link`, (t) => {
    const files = fixture(t);
    files.change(module6, (body) => `${body}\n${addition}\n`);
    assert.throws(() => verifyModule6(files.root), pattern);
  });
}

test("rejects stale and ranged Directive pins", (t) => {
  const files = fixture(t);
  files.change(module6, (body) => spliceAll(body, "0.119.5", "0.111.0"));
  assert.throws(() => verifyModule6(files.root), /exact Directive 0\.119\.5 baseline/);
  files.change(module6, (body) => spliceAll(body, "0.111.0", "0.119.5"));
  files.change("package.json", (body) => splice(body, '"0.119.5"', '"^0.119.5"'));
  assert.throws(() => verifyModule6(files.root), /must pin @deftai\/directive exactly/);
});

test("requires durable Module 7 navigation without owning its lifecycle state", (t) => {
  const files = fixture(t);
  files.change(module6, (body) => splice(body, "[Module 7](07-scope-lifecycle.md)", "Module 7"));
  assert.throws(() => verifyModule6(files.root), /Module 7 navigation/);

  const solutionFiles = fixture(t);
  solutionFiles.change(solution6, (body) => splice(body, "[Module 7](../curriculum/modules/07-scope-lifecycle.md)", "Module 7"));
  assert.throws(() => verifyModule6(solutionFiles.root), /Module 7 navigation/);

  const mapFiles = fixture(t);
  mapFiles.change("curriculum/README.md", (body) => splice(body, "[Module 7](modules/07-scope-lifecycle.md)", "Module 7"));
  assert.throws(() => verifyModule6(mapFiles.root), /Module 7 course-map navigation/);
});

for (const marker of ["{{AUTHOR_TODO}}", "TODO: finish", "TBD", "FIXME"]) {
  test(`rejects unfinished marker ${marker}`, (t) => {
    const files = fixture(t);
    files.change(solution6, (body) => `${body}\n${marker}\n`);
    assert.throws(() => verifyModule6(files.root), /unfinished author marker/);
  });
}

for (const command of ["pwd", "git push origin main", "rm -rf /tmp/work", "gh pr create"]) {
  test(`rejects executable shell content: ${command}`, (t) => {
    const files = fixture(t);
    files.change(module6, (body) => `${body}\n\`\`\`sh\n${command}\n\`\`\`\n`);
    assert.throws(() => verifyModule6(files.root), /command-free.*shell/i);
  });
}

test("requires Module 6 navigation and maintenance surfaces", (t) => {
  const files = fixture(t);
  files.change("README.md", (body) => splice(body, "06-creating-well-shaped-work.md", "05-sources-versus-projections.md"));
  assert.throws(() => verifyModule6(files.root), /Module 6 navigation/);
  files.change("README.md", (body) => splice(body, "05-sources-versus-projections.md", "06-creating-well-shaped-work.md"));
  files.change("maintainers/CURRICULUM-MAINTENANCE.md", (body) => splice(body, "npm run check:module-6", "npm test"));
  assert.throws(() => verifyModule6(files.root), /maintenance.*check/i);
});

for (const [label, path, mutate, pattern] of [
  [
    "an O6.2 outcome stripped of its schema-0.8 artifact requirement",
    module6,
    (body) => splice(body, "a schema-0.8 proposed-scope artifact", "a short note"),
    /schema-0\.8 proposed-scope artifact outcome/,
  ],
  [
    "an O6.2 outcome stripped of its authority boundary",
    module6,
    (body) => splice(body, "proposal is not implementation authority", "proposal is reviewable"),
    /authority boundary in its outcome text/,
  ],
  [
    "an unnamed vehicle recut",
    module6,
    (body) => splice(body, "[Lab 7](../../labs/07-scope-lifecycle.md) Task 5", "a later lab"),
    /adjacent lab vehicle by link/,
  ],
  [
    "a structural check with no artifact path or project root",
    module6,
    (body) => splice(body, "`directive xbrief:verify -- --format json --out <your artifact path> --style scope --project-root <lab root>`", "`directive xbrief:verify`"),
    /exact command with its artifact path and project root/,
  ],
  [
    "a dropped exit code in the retained evidence",
    module6,
    (body) => splice(body, "its **exit code**, and", "and"),
    /must retain the exit code/,
  ],
  [
    "a dropped preflight and doctor refusal",
    module6,
    (body) => spliceAll(body, "`xbrief:preflight` and `doctor` are not the authoring-validity pass.", "Preflight is the authoring-validity pass."),
    /refuse xbrief:preflight and doctor/,
  ],
  [
    "merged evidence surfaces",
    module6,
    (body) => splice(body, "| Surface | Proves | Does not prove |", "| One combined surface |"),
    /evidence surfaces must be split/,
  ],
  [
    "a rubric that no longer proves the authority boundary",
    module6,
    (body) => splice(body, "| Module 6 comparison rubric | Bounded strategy, observable acceptance, traces, and the absence of implementation authority | That the file parses |", "| Module 6 comparison rubric | Prose similarity | That the file parses |"),
    /comparison rubric must keep strategy/,
  ],
  [
    "a structural result that grants lifecycle authority",
    module6,
    (body) => splice(body, "A green structural result grants no promotion, no activation, and no implementation authority.", "A green structural result clears the scope for promotion."),
    /must grant no promotion, activation, or implementation authority/,
  ],
  [
    "a silently added outcome",
    module6,
    (body) => splice(body, "so no outcome is added or recut", "so outcome O6.5 is added"),
    /whether a separate outcome was added or recut/,
  ],
  [
    "an O6.2 completion row without its exit code",
    module6,
    (body) => splice(body, "the exact command, the exit code, and the result", "the exact command and the result"),
    /completion evidence is missing the exit code/,
  ],
  [
    "an O6.2 completion row without a positive structural result",
    module6,
    (body) => splice(body, "`xbrief:verify` exits `0` against that exact artifact path.", "The artifact looks similar to the solution."),
    /missing a positive xbrief:verify exit/,
  ],
  [
    "a solution that keeps the retired static-only pass claim",
    solution6,
    (body) => `${body}\n\nRetry: O6.2 passes without any file mutation or executable claim.\n`,
    /retired static-only O6\.2 pass claim/,
  ],
  [
    "a solution without the structural conformance row",
    solution6,
    (body) => splice(body, "Structural conformance of the exact artifact", "Prose comparison"),
    /structural conformance of the exact artifact as O6\.2 evidence/,
  ],
  [
    "a lab without the adjacent authoring task",
    lab7,
    (body) => splice(body, "### Task 5 — Author and structurally verify your own proposed scope", "### Task 5 — Optional reading"),
    /adjacent authoring task that consumes the O6\.2 artifact/,
  ],
  [
    "a lab task that does not name the Module 6 artifact",
    lab7,
    (body) => splice(body, "[Module 6](../curriculum/modules/06-creating-well-shaped-work.md)", "an earlier module"),
    /must name the Module 6 artifact it consumes/,
  ],
  [
    "a lab that replaces a supplied scope instead of adding a third record",
    lab7,
    (body) => splice(body, "yours is a third record beside them", "replace one of them with yours"),
    /add the learner record beside them/,
  ],
  [
    "a lab that allows promotion of the authored scope",
    lab7,
    (body) => splice(body, "- `xbrief:verify` is not a lifecycle move. Do not promote or activate your scope.", "- Promote your scope next."),
    /refuse promotion and activation of the authored scope/,
  ],
  [
    "a lab that silently adds an outcome",
    lab7,
    (body) => splice(body, "adds no Lab 7 outcome", "adds outcome O7.5"),
    /must not silently create an outcome/,
  ],
  [
    "a structural check not bound to the learner-authored path",
    lab7,
    (body) => splice(body, '--out "$authored"', '--out "$first_root/xbrief/proposed/2026-01-15-fictional-delivery.xbrief.json"'),
    /against the exact learner-authored path/,
  ],
  [
    "a lab that drops the retained structural exit code",
    lab7,
    (body) => splice(body, "authored_exit=$?", "true"),
    /must retain the structural exit code/,
  ],
  [
    "a lab that removes one supplied scope",
    lab7,
    (body) => splice(body, 'test -f "$first_root/xbrief/cancelled/2026-01-15-fictional-cancel.xbrief.json"', "true"),
    /must keep its supplied scope record/,
  ],
  [
    "a lab that runs the structural check under errexit",
    lab7,
    (body) => splice(body, "set +e\n"),
    /must suspend errexit around the structural check/,
  ],
  [
    "a lab that never captures the exact structural command",
    lab7,
    (body) => splice(body, "--out $authored --style scope --project-root $first_root", "--help"),
    /must capture the exact structural command/,
  ],
  [
    "a lab that drops the command from its retained evidence record",
    lab7,
    (body) => splice(body, "command=%s\\n"),
    /must persist the exact structural command/,
  ],
  [
    "a Lab 7 solution comparison that never asks about Task 5",
    lab7Solution,
    (body) => splice(body, "2. Does your Task 5 record carry", "2. Does your record carry"),
    /comparison must ask a numbered Task 5 question/,
  ],
  [
    "a Lab 7 solution comparison that drops the artifact path",
    lab7Solution,
    (body) => splice(body, "the artifact **path**, the exact", "the exact"),
    /Task 5 comparison must compare the artifact path/,
  ],
  [
    "a Lab 7 solution comparison that drops the exact command",
    lab7Solution,
    (body) => splice(body, "`xbrief:verify` **command**", "`xbrief:verify` output"),
    /Task 5 comparison must compare the exact command/,
  ],
  [
    "a Lab 7 solution comparison that drops the exit code",
    lab7Solution,
    (body) => splice(body, "the **exit code**, and", "and"),
    /Task 5 comparison must compare the exit code/,
  ],
  [
    "a Lab 7 solution comparison that drops the result line",
    lab7Solution,
    (body) => splice(body, "the **result** line", "the summary line"),
    /Task 5 comparison must compare the result/,
  ],
  [
    "a Task 5 miss routed through the blanket Lab 7 outcome retry",
    lab7Solution,
    (body) => splice(
      body,
      "A “no” on question 1 identifies the smallest Lab 7 outcome to retry.",
      "Any “no” identifies the smallest outcome to retry.",
    ),
    /must not be routed through the blanket Lab 7 outcome retry/,
  ],
  [
    "a Task 5 miss that never reaches Module 6 Part B re-authoring",
    lab7Solution,
    (body) => splice(body, " Part B in place"),
    /must route to Module 6 Part B re-authoring/,
  ],
  [
    "a Task 5 miss that does not rerun the same command against the same path",
    lab7Solution,
    (body) => splice(
      body,
      "the same `xbrief:verify` command against the same path and retain both exit codes",
      "the command again",
    ),
    /rerun the same command against the same path and retain both exit codes/,
  ],
  [
    "a Lab 7 solution that silently gives Task 5 an outcome",
    lab7Solution,
    (body) => splice(body, "adds no Lab 7 outcome", "adds outcome O7.5"),
    /must state that Task 5 adds no Lab 7 outcome/,
  ],
  [
    "a Lab 7 solution that lets the authored scope be promoted",
    lab7Solution,
    (body) => splice(
      body,
      "- `xbrief:verify` is not a lifecycle move. Do not promote or activate your scope.",
      "- Promote your scope next.",
    ),
    /worked approach is missing the Task 5 boundary clause: verify is not a lifecycle move/,
  ],
  [
    "a Lab 7 solution that reads a green result as lifecycle authority",
    lab7Solution,
    (body) => splice(
      body,
      "- A green structural result grants no promotion, no activation, and no implementation authority.",
      "- A green structural result clears the scope for promotion.",
    ),
    /worked approach is missing the Task 5 boundary clause: a green result grants no promotion, activation, or implementation authority/,
  ],
  [
    "a Lab 7 solution that treats preflight as the authoring-validity pass",
    lab7Solution,
    (body) => splice(
      body,
      "- `xbrief:preflight` and `doctor` are not the authoring-validity pass.",
      "- Preflight is the authoring-validity pass.",
    ),
    /worked approach is missing the Task 5 boundary clause: preflight and doctor are not the authoring-validity pass/,
  ],
  [
    "a Lab 7 solution that reads exit 0 as a well-shaped verdict",
    lab7Solution,
    (body) => splice(
      body,
      "- The structural result does not prove version `0.8`, proposed status, observable acceptance,\n  or traces.",
      "- The structural result proves the whole record.",
    ),
    /worked approach is missing the Task 5 boundary clause: a green result does not prove version 0\.8/,
  ],
  [
    "a Lab 7 solution that drops the Module 6 structural-record cross-link",
    lab7Solution,
    (body) => splice(
      body,
      "[Module 6 structural record](module-06-creating-well-shaped-work.md#structural-record)",
      "Module 6 structural record",
    ),
    /worked approach must cross-link the Module 6 structural record with the sibling href/,
  ],
  [
    "a Module 6 cross-link written as a repository-root path",
    lab7Solution,
    (body) => splice(
      body,
      "](module-06-creating-well-shaped-work.md#structural-record)",
      "](solutions/module-06-creating-well-shaped-work.md#structural-record)",
    ),
    /must not use the repository-root path/,
  ],
]) {
  test(`rejects ${label}`, (t) => {
    const files = fixture(t);
    files.change(path, mutate);
    assert.throws(() => verifyModule6(files.root), pattern);
  });
}

// Relocation, not deletion: the required text still exists in the file, so only a
// section-scoped assertion catches it leaving the surface a learner reads at exit `0`.
for (const [label, moved, pattern] of [
  [
    "a Task 5 boundary clause moved out of the worked approach",
    "- The structural result does not prove version `0.8`, proposed status, observable acceptance,\n  or traces.",
    /worked approach is missing the Task 5 boundary clause: a green result does not prove version 0\.8/,
  ],
  [
    "a Module 6 cross-link moved out of the worked approach",
    "The long table stays in the [Module 6 structural record](module-06-creating-well-shaped-work.md#structural-record).",
    /worked approach must cross-link the Module 6 structural record with the sibling href/,
  ],
]) {
  test(`rejects ${label}`, (t) => {
    const files = fixture(t);
    files.change(lab7Solution, (body) => splice(
      splice(body, moved),
      "## Misconceptions exposed by this exercise\n\n",
      `## Misconceptions exposed by this exercise\n\n${moved}\n\n`,
    ));
    assert.throws(() => verifyModule6(files.root), pattern);
  });
}

test("requires the pinned Module 6 source-validation record", (t) => {
  const files = fixture(t);
  files.change("references/SOURCE-NOTES.md", (body) => splice(body, "## Module 6 source validation", "## Other notes"));
  assert.throws(() => verifyModule6(files.root), /source[- ]validation/);
});
