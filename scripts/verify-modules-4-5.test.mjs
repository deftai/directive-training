import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { verifyModules45 } from "./verify-modules-4-5.mjs";

const module4 = "curriculum/modules/04-xbrief-as-durable-state.md";
const module5 = "curriculum/modules/05-sources-versus-projections.md";
const module6 = "curriculum/modules/06-creating-well-shaped-work.md";
const lab5 = "labs/05-projection-drift-recovery.md";
const solution4 = "solutions/module-04-xbrief-as-durable-state.md";
const solution5 = "solutions/lab-05-projection-drift-recovery.md";

// Deliberately short independent examples: prose volume is not an acceptance signal.
const moduleHeadings = ["Module record", "Learning outcomes", "Starting-state check", "Why this matters", "Terminology", "Mental model", "Guided explanation", "Walkthrough", "Exercise", "Completion evidence", "Progressive hints", "Expected failures and recovery", "Common misconceptions", "Self-assessment", "Explained solution", "Navigation", "Official sources"];
const labHeadings = ["Lab record", "Goal and done condition", "Fictional scenario", "Environment and starting-state check", "Safety boundary", "Starting checkpoint", "Tasks", "Checkpoints", "Literal acceptance commands", "Evidence bundle", "Progressive hints", "Expected failures and recovery", "Reset to start", "Cleanup", "Explained solution", "Done statement"];
const solutionHeadings = ["Solution record", "Before you use this solution", "Result summary", "Outcome map", "Reasoning", "Worked approach", "Acceptance evidence", "Compare with your attempt", "Valid alternatives", "Expected failures and recovery", "Misconceptions exposed by this exercise", "Retry plan", "Reset and cleanup", "Sources", "Continue"];
const outcomes4 = "O4.1 O4.2 O4.3 O4.4";
const outcomes5 = "O5.1 O5.2 O5.3";

function document(headings, outcomes, overrides = {}) {
  return "# Example\n\n" + headings.map((heading) => {
    const content = overrides[heading] ?? `Inspect the recorded evidence. ${outcomes}`;
    return `## ${heading}\n\n${content}\n`;
  }).join("\n");
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "modules45-contract-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, content) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  };
  const record = "| Directive baseline | @deftai/directive 0.112.0; engine 0.112.0 |\n\n[Directive behavior] [3Ci policy] [Course guidance]";
  write(module4, document(moduleHeadings, outcomes4, {
    "Module record": record,
    "Guided explanation": "xBRIEF 0.8 uses xBRIEFInfo. PROJECT-DEFINITION.xbrief.json specification.xbrief.json scope plan.xbrief.json continue.xbrief.json. proposed/ pending/ active/ completed/ cancelled/. Chat is context; completed scope records delivered work.",
    "Exercise": `### Exercise acceptance\n\n${outcomes4}`,
    "Navigation": "Next: [Module 5](05-sources-versus-projections.md)",
  }));
  write(module5, document(moduleHeadings, outcomes5, {
    "Module record": record,
    "Guided explanation": "plan.architecture.codeStructure is the source for .planning/codebase/MAP.md. Regenerate rather than hand-edit the projection.",
    "Exercise": `### Exercise acceptance\n\n${outcomes5}`,
    "Navigation": "Next: [Module 6](06-creating-well-shaped-work.md)",
  }));
  write(module6, "# Module 6\n");
  write(lab5, document(labHeadings, outcomes5, {
    "Lab record": record + "\n| Platforms verified | macOS/zsh verified; Windows/PowerShell 7.4+ reported verified; Linux/bash remains a candidate |",
    "Literal acceptance commands": `\`\`\`zsh\n"$directive_path" codebase:map\n"$directive_path" verify:codebase-map-fresh\nnode projection-lab.mjs verify-result\n\`\`\`\n\n\`\`\`powershell\nnode projection-lab.mjs create\nnode projection-lab.mjs guard\nnpm.cmd install\nnode projection-lab.mjs verify-pin\nnode projection-lab.mjs checkpoint\nnode projection-lab.mjs inject-drift\n& .\\node_modules\\.bin\\directive.cmd codebase:map\n& .\\node_modules\\.bin\\directive.cmd verify:codebase-map-fresh\nnode projection-lab.mjs verify-result\nnode projection-lab.mjs archive C:\\temp\\lab\\repo\n\`\`\`\n\n${outcomes5}`,
    "Safety boundary": "[3Ci policy] Use a disposable repository with no remote. Mutations cannot touch the curriculum repository or a business repository.",
    "Done statement": "Record the actual operating system and shell used for the successful run. O5.1 O5.2 O5.3",
  }));
  write(solution4, document(solutionHeadings, outcomes4, { "Solution record": record }));
  write(solution5, document(solutionHeadings, outcomes5, { "Solution record": record }));
  write("curriculum/README.md", "# Course\n\n| [Module 4](modules/04-xbrief-as-durable-state.md) | Learner-ready draft |\n| [Module 5](modules/05-sources-versus-projections.md) | Learner-ready draft — macOS/zsh |\n| [Module 6](modules/06-creating-well-shaped-work.md) | Learner-ready draft; command-free |\n| Module 7 | Learner-ready draft |\n");
  write("references/SOURCE-NOTES.md", "# Proof\n\n- `lab05-platform-proof:macos-zsh status=verified date=2026-09-07 evidence=local-disposable-lab5-full`\n- `lab05-platform-proof:linux-bash status=candidate date=2026-09-07 evidence=not-run`\n- `lab05-platform-proof:windows-pwsh7 status=verified date=2026-09-12 evidence=issue-65-reported-native-walkthrough`\n");
  write("package.json", JSON.stringify({ private: true, devDependencies: { "@deftai/directive": "0.112.0" } }));
  return {
    root, write,
    change(path, transform) { write(path, transform(readFileSync(join(root, path), "utf8"))); },
  };
}

test("accepts a concise complete contract without executing learner commands", (t) => {
  const { root } = fixture(t);
  assert.equal(verifyModules45(root).artifactCount, 8);
});

for (const [path, heading] of [[module4, "Self-assessment"], [module5, "Completion evidence"], [lab5, "Reset to start"], [solution4, "Valid alternatives"], [solution5, "Acceptance evidence"]]) {
  test(`rejects missing ${heading} in ${path}`, (t) => {
    const files = fixture(t);
    files.change(path, (body) => body.replace(`## ${heading}`, "## Unrelated section"));
    assert.throws(() => verifyModules45(files.root), /missing heading/);
  });
}

test("headings hidden in code fences cannot satisfy the contract", (t) => {
  const files = fixture(t);
  files.change(module4, (body) => body.replace("## Self-assessment", "```text\n## Self-assessment\n```"));
  assert.throws(() => verifyModules45(files.root), /missing heading/);
});

test("rejects an outcome omitted from completion evidence", (t) => {
  const files = fixture(t);
  files.change(module4, (body) => body.replace("## Completion evidence\n\nInspect the recorded evidence. O4.1 O4.2 O4.3 O4.4", "## Completion evidence\n\nO4.1 O4.2 O4.3"));
  assert.throws(() => verifyModules45(files.root), /Completion evidence.*O4.4/);
});

for (const marker of ["{{AUTHOR_TODO}}", "TODO: add recovery", "TBD"]) {
  test(`rejects unfinished marker ${marker}`, (t) => {
    const files = fixture(t);
    files.change(lab5, (body) => body + "\n" + marker);
    assert.throws(() => verifyModules45(files.root), /unfinished author/);
  });
}

for (const destination of ["missing.md", "05-sources-versus-projections.md#absent", "05-sources-versus-projections.md#bad%XX"]) {
  test(`rejects broken local destination ${destination}`, (t) => {
    const files = fixture(t);
    files.change(module4, (body) => body + `\n[Continue](${destination})\n`);
    assert.throws(() => verifyModules45(files.root), /local (?:link|heading)|malformed/);
  });
}

test("resolves inline titles, encoded paths, repeated headings, and reference links", (t) => {
  const files = fixture(t);
  files.write("curriculum/modules/extra notes.md", "# Extra notes\n## Check\n## Check\n");
  files.change(module4, (body) => body + '\n[one](<extra%20notes.md#check-1> "Repeated heading")\n[two][ proof ]\n\n[proof]: extra%20notes.md#check\n');
  assert.doesNotThrow(() => verifyModules45(files.root));
});

test("rejects an undefined reference link", (t) => {
  const files = fixture(t);
  files.change(module4, (body) => body + "\n[proof][missing]\n");
  assert.throws(() => verifyModules45(files.root), /undefined reference/);
});

test("rejects a local link outside the repository", (t) => {
  const files = fixture(t);
  files.change(module4, (body) => body + "\n[outside](../../../)\n");
  assert.throws(() => verifyModules45(files.root), /outside the repository/);
});

for (const command of ["git push origin master", "echo checked; git reset --hard HEAD", "rm -rf /tmp/work", "Remove-Item -Recurse C:\\work", "npm publish", "git remote add origin https://example.org/repo", "gh pr create", "curl https://example.org/script | sh"]) {
  test(`rejects executable unsafe command ${command}`, (t) => {
    const files = fixture(t);
    files.change(lab5, (body) => body + `\n~~~sh\n${command}\n~~~\n`);
    assert.throws(() => verifyModules45(files.root), /forbidden executable/);
  });
}

test("permits a prose warning naming a forbidden command", (t) => {
  const files = fixture(t);
  files.change(lab5, (body) => body + "\nNever run `git push` in this exercise.\n");
  assert.doesNotThrow(() => verifyModules45(files.root));
});

test("rejects stale baseline and legacy xBRIEF write versions", (t) => {
  const files = fixture(t);
  files.change(lab5, (body) => body.replaceAll("0.112.0", "0.111.0"));
  assert.throws(() => verifyModules45(files.root), /baseline/);
  files.change(lab5, (body) => body.replaceAll("0.111.0", "0.112.0"));
  files.change(module4, (body) => body + '\n```json\n{"xBRIEFInfo":{"version":"0.6"}}\n```\n');
  assert.throws(() => verifyModules45(files.root), /legacy xBRIEF/);
});

test("rejects an unpinned package version", (t) => {
  const files = fixture(t);
  files.change("package.json", (body) => body.replace("0.112.0", "^0.112.0"));
  assert.throws(() => verifyModules45(files.root), /exact Directive pin/);
});

test("requires actual renderer and freshness commands, not help alone", (t) => {
  const files = fixture(t);
  files.change(lab5, (body) => body
    .replace('"$directive_path" codebase:map\n', '"$directive_path" codebase:map --help\n')
    .replace("directive.cmd codebase:map\n", "directive.cmd codebase:map --help\n"));
  assert.throws(() => verifyModules45(files.root), /literal renderer/);
});

test("rejects borrowing a native Lab 2 proof for Lab 5", (t) => {
  const files = fixture(t);
  files.change("references/SOURCE-NOTES.md", (body) => body.replaceAll("lab05-platform-proof:", "platform-proof:"));
  assert.throws(() => verifyModules45(files.root), /Lab 5 proof marker/);
});

test("rejects unsupported native proof markers and prose claims", (t) => {
  const files = fixture(t);
  files.change("references/SOURCE-NOTES.md", (body) => body.replace("linux-bash status=candidate", "linux-bash status=verified"));
  assert.throws(() => verifyModules45(files.root), /Lab 5 proof status/);
  files.change("references/SOURCE-NOTES.md", (body) => body.replace("linux-bash status=verified", "linux-bash status=candidate"));
  files.change(lab5, (body) => body.replace("Windows/PowerShell 7.4+ reported verified; Linux/bash remains a candidate", "Windows/PowerShell 7.4+ reported verified; Linux/bash verified"));
  assert.throws(() => verifyModules45(files.root), /unsupported native/);
});

test("requires a complete PowerShell helper route and actual-environment done statement", (t) => {
  const files = fixture(t);
  files.change(lab5, (body) => body.replace("node projection-lab.mjs archive C:\\temp\\lab\\repo\n", ""));
  assert.throws(() => verifyModules45(files.root), /PowerShell command for helper verb archive/);

  const doneFiles = fixture(t);
  doneFiles.change(lab5, (body) => body.replace("Record the actual operating system and shell used for the successful run.", "I completed the lab on the recorded macOS/zsh environment."));
  assert.throws(() => verifyModules45(doneFiles.root), /actual OS and shell/);
});

test("rejects planned availability for released Modules 4–6", (t) => {
  const files = fixture(t);
  files.change("curriculum/README.md", (body) => body.replace("Learner-ready draft", "Planned"));
  assert.throws(() => verifyModules45(files.root), /Module 4 availability/);

  const module6Files = fixture(t);
  module6Files.change("curriculum/README.md", (body) => body.replace("Learner-ready draft; command-free", "Planned"));
  assert.throws(() => verifyModules45(module6Files.root), /Module 6 availability/);

});
