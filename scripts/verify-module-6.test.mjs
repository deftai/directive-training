import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { verifyModule6 } from "./verify-module-6.mjs";

const module6 = "curriculum/modules/06-creating-well-shaped-work.md";
const solution6 = "solutions/module-06-creating-well-shaped-work.md";
const module5 = "curriculum/modules/05-sources-versus-projections.md";
const module7 = "curriculum/modules/07-scope-lifecycle.md";
const moduleHeadings = [
  "Module record", "Learning outcomes", "Starting-state check", "Why this matters",
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
const outcomes = "O6.1 O6.2 O6.3";

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
    "| Directive baseline | `@deftai/directive@0.112.0`, engine `@deftai/directive-core@0.112.0` |",
    "| Status | learner-ready draft; command-free |",
  ].join("\n");
  write(module6, document(moduleHeadings, {
    "Module record": record,
    "Learning outcomes": outcomes,
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
      "`xBRIEFInfo.version: 0.8`; `plan.status: proposed`.",
      "A proposal is reviewable candidate state, not implementation authority.",
      "### Exercise acceptance",
      outcomes,
    ].join("\n\n"),
    "Completion evidence": outcomes,
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
    ].join("\n"),
    "Acceptance evidence": outcomes,
    "Continue": "Continue to [Module 7](../curriculum/modules/07-scope-lifecycle.md) or review the [course map](../curriculum/README.md).",
    "Sources": "See the [source baseline](../references/SOURCE-BASELINE.md) and [Module 6 source validation](../references/SOURCE-NOTES.md#module-6-source-validation).",
  }));
  write(module5, "# Module 5\n\n## Navigation\n\nNext: [Module 6](06-creating-well-shaped-work.md).\n");
  write(module7, "# Module 7\n");
  write("README.md", "# Training\n\nContinue with [Module 6](curriculum/modules/06-creating-well-shaped-work.md).\n");
  write("curriculum/README.md", "# Course\n\n| Module | Status |\n| --- | --- |\n| [Module 6](modules/06-creating-well-shaped-work.md) | Learner-ready draft; command-free |\n| [Module 7](modules/07-scope-lifecycle.md) | Learner-ready draft |\n");
  write("assessments/README.md", "# Assessments\n\nUse [Module 6](../curriculum/modules/06-creating-well-shaped-work.md#self-assessment).\n");
  write("solutions/README.md", "# Solutions\n\nUse the [Module 6 solution](module-06-creating-well-shaped-work.md).\n");
  write("references/GLOSSARY.md", "# Glossary\n\n## Vertical slice\n\nAn independently demoable, human-observable capability.\n\n## Horizontal plan\n\nWork grouped by component rather than outcome.\n\n## Proposed scope\n\nA reviewable candidate that grants no implementation authority.\n");
  write("references/QUICK-REFERENCE.md", "# Quick reference\n\n## Shape work\n\nRecord a bounded strategy choice, User-visible outcome, Dependency rationale, and Boundary rationale. Use the [Module 6 worksheet](../curriculum/modules/06-creating-well-shaped-work.md#exercise).\n");
  write("references/SOURCE-BASELINE.md", "# Source baseline\n\nExact training release: `@deftai/directive@0.112.0` and `@deftai/directive-core@0.112.0`. See [notes](SOURCE-NOTES.md#module-6-source-validation).\n");
  write("references/SOURCE-NOTES.md", [
    "# Source notes", "", "## Module 6 source validation", "",
    "Validated against Directive 0.112.0: `.deft/core/docs/directive-lifecycle.md`, `.deft/core/strategies/README.md`, `.deft/core/strategies/interview.md`, `.deft/core/skills/deft-directive-setup/SKILL.md`, `.deft/core/skills/deft-directive-decompose/SKILL.md`, `.deft/core/vbrief/vbrief.md`, `.deft/core/verification/verification.md`, `.deft/core/verification/plan-checking.md`, `.deft/core/glossary.md`, `.deft/core/skills/deft-directive-gh-slice/SKILL.md`, `.deft/core/commands.md`, and `.deft/core/main.md`.",
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
    devDependencies: { "@deftai/directive": "0.119.1" },
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
  assert.equal(verifyModule6(fixture(t).root).artifactCount, 14);
});

for (const [path, headings] of [[module6, moduleHeadings], [solution6, solutionHeadings]]) {
  for (const heading of headings) {
    test(`rejects missing ${heading} in ${path}`, (t) => {
      const files = fixture(t);
      files.change(path, (body) => body.replace(`## ${heading}`, "## Unrelated section"));
      assert.throws(() => verifyModule6(files.root), /missing heading/);
    });
  }
}

for (const [path, headings] of [
  [module6, ["Learning outcomes", "Exercise acceptance", "Completion evidence", "Self-assessment"]],
  [solution6, ["Outcome map", "Acceptance evidence"]],
]) {
  for (const heading of headings) {
    for (const outcome of ["O6.1", "O6.2", "O6.3"]) {
      test(`rejects ${outcome} missing from ${path} ${heading}`, (t) => {
        const files = fixture(t);
        files.change(path, (content) => {
          const marker = `## ${heading}`;
          const start = content.indexOf(marker);
          const next = content.indexOf("\n## ", start + marker.length);
          const end = next < 0 ? content.length : next;
          return content.slice(0, start) + content.slice(start, end).replace(outcome, "O6.x") + content.slice(end);
        });
        assert.throws(() => verifyModule6(files.root), new RegExp(`${heading}.*${outcome.replace(".", "\\.")}`));
      });
    }
  }
}

for (const field of ["Artifact", "User-visible outcome", "Exclusions", "Literal inspection", "Dependency rationale", "Boundary rationale"]) {
  test(`rejects a missing exercise field: ${field}`, (t) => {
    const files = fixture(t);
    files.change(module6, (body) => body.replace(field, "Missing field"));
    assert.throws(() => verifyModule6(files.root), /exercise.*(?:field|rationale)/i);
  });
}

test("rejects a proposal that is not schema 0.8 proposed candidate state", (t) => {
  const files = fixture(t);
  files.change(module6, (body) => body.replace("xBRIEFInfo.version: 0.8", "xBRIEFInfo.version: 0.6"));
  assert.throws(() => verifyModule6(files.root), /schema 0\.8|legacy xBRIEF/i);
  files.change(module6, (body) => body.replace("xBRIEFInfo.version: 0.6", "xBRIEFInfo.version: 0.8").replace("plan.status: proposed", "plan.status: running"));
  assert.throws(() => verifyModule6(files.root), /proposed/);
});

test("rejects loss of the proposal authority boundary", (t) => {
  const files = fixture(t);
  files.change(module6, (body) => body.replace("not implementation authority", "implementation authority"));
  assert.throws(() => verifyModule6(files.root), /authority boundary/);
});

test("rejects loss of the two-to-five acceptance-criteria contract", (t) => {
  const files = fixture(t);
  files.change(module6, (body) => body.replace("two to five criteria", "one criterion"));
  assert.throws(() => verifyModule6(files.root), /two to five acceptance criteria/i);
});

test("rejects a worked proposal with fewer than two traced acceptance items", (t) => {
  const files = fixture(t);
  files.change(solution6, (body) => body.replace(
    ',\n      { "id": "criterion-2", "title": "Preserve the boundary", "status": "proposed", "narrative": { "Acceptance": "Bounded exclusions", "Traces": "fictional-idea" } }',
    "",
  ));
  assert.throws(() => verifyModule6(files.root), /two to five traced acceptance items/i);
});

test("rejects a worked proposal without the required plan title", (t) => {
  const files = fixture(t);
  files.change(solution6, (body) => body.replace('    "title": "Preview one delayed route",\n', ""));
  assert.throws(() => verifyModule6(files.root), /plan\.title/i);
});

for (const [field, fragment] of [
  ["title", '"title": "Show the preview", '],
  ["status", '"status": "proposed", '],
]) {
  test(`rejects a worked proposal item without required ${field}`, (t) => {
    const files = fixture(t);
    files.change(solution6, (body) => body.replace(fragment, ""));
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
  files.change(module6, (body) => body.replaceAll("0.112.0", "0.111.0"));
  assert.throws(() => verifyModule6(files.root), /exact Directive 0\.112\.0 baseline/);
  files.change(module6, (body) => body.replaceAll("0.111.0", "0.112.0"));
  files.change("package.json", (body) => body.replace('"0.119.1"', '"^0.119.1"'));
  assert.throws(() => verifyModule6(files.root), /exact Directive pin/);
});

test("requires durable Module 7 navigation without owning its lifecycle state", (t) => {
  const files = fixture(t);
  files.change(module6, (body) => body.replace("[Module 7](07-scope-lifecycle.md)", "Module 7"));
  assert.throws(() => verifyModule6(files.root), /Module 7 navigation/);

  const solutionFiles = fixture(t);
  solutionFiles.change(solution6, (body) => body.replace("[Module 7](../curriculum/modules/07-scope-lifecycle.md)", "Module 7"));
  assert.throws(() => verifyModule6(solutionFiles.root), /Module 7 navigation/);

  const mapFiles = fixture(t);
  mapFiles.change("curriculum/README.md", (body) => body.replace("[Module 7](modules/07-scope-lifecycle.md)", "Module 7"));
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
  files.change("README.md", (body) => body.replace("06-creating-well-shaped-work.md", "05-sources-versus-projections.md"));
  assert.throws(() => verifyModule6(files.root), /Module 6 navigation/);
  files.change("README.md", (body) => body.replace("05-sources-versus-projections.md", "06-creating-well-shaped-work.md"));
  files.change("maintainers/CURRICULUM-MAINTENANCE.md", (body) => body.replace("npm run check:module-6", "npm test"));
  assert.throws(() => verifyModule6(files.root), /maintenance.*check/i);
});

test("requires the pinned Module 6 source-validation record", (t) => {
  const files = fixture(t);
  files.change("references/SOURCE-NOTES.md", (body) => body.replace("## Module 6 source validation", "## Other notes"));
  assert.throws(() => verifyModule6(files.root), /source[- ]validation/);
});
