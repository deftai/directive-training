import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { archiveAttempt, createAttempt, guardAttempt } from "../labs/fixtures/05-projection-drift-recovery/projection-lab.mjs";

const fixture = fileURLToPath(new URL("../labs/fixtures/05-projection-drift-recovery/", import.meta.url));
const sourcePath = "xbrief/PROJECT-DEFINITION.xbrief.json";
const attributes = "/xbrief/PROJECT-DEFINITION.xbrief.json text eol=lf\n";
const copies = [
  ["package.json", "package.json"], ["PROJECT-DEFINITION.xbrief.json", sourcePath],
  ["stop-code.js", "src/stop-code.js"], ["projection-lab.mjs", "projection-lab.mjs"], ["safety.mjs", "safety.mjs"],
];
const read = (path) => readFileSync(path, "utf8");
const lf = (text) => text.replace(/\r\n/g, "\n");
function command(cwd, program, args) {
  const result = spawnSync(program, args, { cwd, encoding: "utf8", timeout: 30_000 });
  assert.ifError(result.error);
  return result;
}
function succeeds(cwd, program, args) {
  const result = command(cwd, program, args);
  assert.equal(result.status, 0, `${cwd}: ${program} ${args.join(" ")}\n${result.stdout}${result.stderr}`);
  return result.stdout;
}

for (const courseEol of ["LF", "CRLF"]) {
  for (const autocrlf of ["true", "false"]) {
    for (const editEol of ["LF", "CRLF"]) {
      test(`${courseEol} course, autocrlf=${autocrlf}, ${editEol} purpose edit passes plain Git whitespace checking`, () => {
        // Real external fixture copies exercise create without introducing test-only API options.
        const course = realpathSync(mkdtempSync(join(tmpdir(), "training-eol-fixture-")));
        const originals = new Map(copies.map(([from]) => [from, read(join(fixture, from))]));
        for (const [from, text] of originals) {
          writeFileSync(join(course, from), lf(text).replace(/\n/g, courseEol === "CRLF" ? "\r\n" : "\n"), { flag: "wx" });
        }
        const helper = join(course, "projection-lab.mjs");
        const root = succeeds(course, process.execPath, [helper, "create"]).trim();
        succeeds(root, "git", ["config", "--local", "core.autocrlf", autocrlf]);
        writeFileSync(join(root, "package-lock.json"), "{}\n", { flag: "wx" });
        // The helper checkpoint deliberately uses its existing core.autocrlf=false wrapper.
        succeeds(root, process.execPath, [helper, "checkpoint"]);
        const initialSource = read(join(root, sourcePath));
        const source = lf(initialSource);
        const edited = source.replace("Normalize fictional stop codes.", "Normalize and validate fictional stop codes.");
        assert.notEqual(edited, source);
        const writeEdit = (text) => writeFileSync(join(root, sourcePath), text.replace(/\n/g, editEol === "CRLF" ? "\r\n" : "\n"));
        writeEdit(edited);
        // Do not add a Git wrapper, -c setting, or whitespace suppression to this command.
        succeeds(root, "git", ["diff", "--check"]);
        assert.equal(succeeds(root, "git", ["diff", "--numstat"]).trim(), `1\t1\t${sourcePath}`);
        assert.equal(succeeds(root, "git", ["diff", "--name-only"]).trim(), sourcePath);
        assert.equal(succeeds(root, "git", ["show", "lab-05-start:" + sourcePath]), source);
        assert.equal(initialSource, source, "initial copied source must already be LF");
        assert.equal(read(join(root, ".gitattributes")), attributes);
        const expected = [".gitattributes", ".gitignore", ".npmrc", "package-lock.json", ...copies.map(([, to]) => to)].sort();
        assert.deepEqual(succeeds(root, "git", ["ls-files"]).trim().split("\n").sort(), expected);
        for (const [from, to] of copies) {
          assert.equal(read(join(fixture, from)), originals.get(from), "course source must not change");
          assert.equal(read(join(course, from)), lf(originals.get(from)).replace(/\n/g, courseEol === "CRLF" ? "\r\n" : "\n"));
          if (to !== sourcePath) assert.equal(read(join(root, to)), lf(originals.get(from)), "copied text must be LF without changing content");
        }
        assert.equal(guardAttempt(root), root);
        for (const trailing of [" ", "\t"]) {
          writeEdit(edited.replace(/("purpose": [^\n]+)\n/, "$1" + trailing + "\n"));
          assert.equal(guardAttempt(root), root, "valid purpose-only JSON keeps its source boundary");
          const rejected = command(root, "git", ["diff", "--check"]);
          assert.equal(rejected.status, 2, "real trailing space/tab must still fail plain Git");
          assert.match(rejected.stdout + rejected.stderr, /trailing whitespace/);
        }
        writeEdit(edited);
        succeeds(root, "git", ["diff", "--check"]);
        const evidence = read(join(dirname(root), "evidence.md"));
        const archived = succeeds(course, process.execPath, [helper, "archive", root]).trim();
        assert.equal(read(join(archived, "evidence.md")), evidence);
        assert.equal(lf(read(join(archived, "repo", sourcePath))), edited);
        // Both the external course copy and archived attempt remain available for diagnosis.
      });
    }
  }
}

test("guard rejects missing or tampered source normalization attributes and their overrides", () => {
  const root = createAttempt();
  const path = join(root, ".gitattributes");
  assert.equal(read(path), attributes);
  for (let index = 0; index < 50; index += 1) {
    writeFileSync(path, attributes + `# unexpected attribute edit ${index}\n`);
    assert.throws(() => guardAttempt(root), /attributes/);
    assert.equal(read(path), attributes + `# unexpected attribute edit ${index}\n`, "refusal must not rewrite the file");
  }
  writeFileSync(path, attributes);
  renameSync(path, join(dirname(root), "attributes-retained"));
  assert.throws(() => guardAttempt(root), /ENOENT/);
  mkdirSync(path);
  assert.throws(() => guardAttempt(root), /attributes.*regular file/);
  renameSync(path, join(dirname(root), "attribute-directory-retained"));
  renameSync(join(dirname(root), "attributes-retained"), path);
  mkdirSync(join(root, ".git/info"), { recursive: true });
  for (const [index, override] of ["-text", "eol=crlf", "whitespace=-blank-at-eol"].entries()) {
    const info = join(root, ".git/info/attributes");
    writeFileSync(info, sourcePath + " " + override + "\n", { flag: "wx" });
    assert.throws(() => guardAttempt(root), /attributes/);
    renameSync(info, join(dirname(root), `info-attributes-${index}-retained`));
  }
  const nested = join(root, "xbrief/.gitattributes");
  writeFileSync(nested, "*.json -text\n", { flag: "wx" });
  assert.throws(() => guardAttempt(root), /attributes/);
  renameSync(nested, join(dirname(root), "nested-attributes-retained"));
  assert.equal(guardAttempt(root), root);
  archiveAttempt(root);
});
