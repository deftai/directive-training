import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs, { lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, symlinkSync, writeFileSync } from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { mock, test } from "node:test";
import { restoreValidationDeposit } from "./restore-validation-deposit.mjs";

const retained = realpathSync(mkdtempSync(join(tmpdir(), "training-deposit-tests-")));
const cli = fileURLToPath(new URL("./restore-validation-deposit.mjs", import.meta.url));
const skills = ["deft-directive-build", "deft-directive-pre-pr", "deft-directive-review-cycle", "deft-directive-swarm"];
let sequence = 0;
console.log("Retained deposit restoration fixtures: " + retained);

function git(root, ...args) {
  const result = spawnSync("git", ["-C", root, ...args], { encoding: "utf8", env: Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^GIT_/i.test(key))) });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

function manifest() {
  const files = ["main.md", "QUICK-START.md", "Taskfile.yml", "SKILL.md", ".agents/skills/deft/SKILL.md", ...skills.flatMap((name) => [".agents/skills/" + name + "/SKILL.md", "skills/" + name + "/SKILL.md"])].map((path) => ({ path: ".deft/core/" + path, content: "# Pinned test content\n", encoding: "utf-8" }));
  files.push({ path: ".deft/core/package.json", content: JSON.stringify({ name: "@deftai/directive-content", version: "0.119.5" }), encoding: "utf-8" });
  files.push({ path: ".deft/core/VERSION", content: "ref: 'v0.119.5'\nsha: '0.119.5'\ntag: 'v0.119.5'\ninstall_root: '.deft/core'\nfetched_by: 'directive-init-headless'\n", encoding: "utf-8" });
  files.push({ path: "AGENTS.md", content: "Do not overwrite the course", encoding: "utf-8" });
  files.push({ path: "package.json", content: "Do not overwrite the course", encoding: "utf-8" });
  files.push({ path: "xbrief/active/.gitkeep", content: "Do not scaffold the course", encoding: "utf-8" });
  return { version: "0.119.5", files };
}

function fixture() {
  const holder = join(retained, String(++sequence));
  const root = join(holder, "course");
  mkdirSync(join(root, ".deft"), { recursive: true });
  writeFileSync(join(root, "package.json"), JSON.stringify({ private: true, devDependencies: { "@deftai/directive": "0.119.5" } }) + "\n");
  writeFileSync(join(root, "AGENTS.md"), "Authored course entry\r\n");
  writeFileSync(join(root, ".gitignore"), ".deft/core/\n");
  writeFileSync(join(root, ".deft/GENERATION.json"), JSON.stringify({ schemaVersion: 1, generation: 2, contentVersion: "0.119.5", surfaces: { payload: "0.119.5", version: "v0.119.5", templates: "0.119.5", skills: "0.119.5", docs: "0.119.5" } }) + "\n");
  git(root, "init", "--initial-branch=main");
  git(root, "config", "core.autocrlf", "false");
  git(root, "add", ".");
  git(root, "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "-c", "core.hooksPath=.git/hooks", "commit", "-m", "fixture");
  return { root, manifestPath: join(holder, "headless.json"), value: manifest() };
}

function save(entry) { writeFileSync(entry.manifestPath, JSON.stringify(entry.value)); }
function absent(root) { assert.equal(lstatSync(join(root, ".deft/core"), { throwIfNoEntry: false }), undefined); }
function reject(entry, pattern) {
  save(entry);
  assert.throws(() => restoreValidationDeposit(entry.root, entry.manifestPath), pattern);
  absent(entry.root);
}

test("restores only the absent payload, preserving LF, CRLF, binary bytes and all course state", () => {
  const entry = fixture();
  const original = new Map(["AGENTS.md", "package.json", ".deft/GENERATION.json"].map((path) => [path, readFileSync(join(entry.root, path))]));
  entry.value.files.push({ path: ".deft/core/data.txt", content: "text\r\nsecond\n", encoding: "utf-8" });
  entry.value.files.push({ path: ".deft/core/data.bin", content: "AP+Afg==", encoding: "base64" });
  save(entry);
  assert.equal(restoreValidationDeposit(entry.root, entry.manifestPath), entry.value.files.length - 3);
  assert.deepEqual(readFileSync(join(entry.root, ".deft/core/data.txt")), Buffer.from("text\r\nsecond\n"));
  assert.deepEqual(readFileSync(join(entry.root, ".deft/core/data.bin")), Buffer.from([0, 255, 128, 126]));
  assert.equal(readFileSync(join(entry.root, ".deft/core/main.md"))[0], 35);
  for (const [path, bytes] of original) assert.deepEqual(readFileSync(join(entry.root, path)), bytes);
  assert.equal(git(entry.root, "status", "--porcelain"), "");
  assert.equal(lstatSync(join(entry.root, "xbrief"), { throwIfNoEntry: false }), undefined);
});

test("refuses an existing deposit without overwriting its content", () => {
  const entry = fixture();
  mkdirSync(join(entry.root, ".deft/core"));
  writeFileSync(join(entry.root, ".deft/core/keep"), "preserved");
  save(entry);
  assert.throws(() => restoreValidationDeposit(entry.root, entry.manifestPath), /already exists/);
  assert.equal(readFileSync(join(entry.root, ".deft/core/keep"), "utf8"), "preserved");
});

test("respects a clean CRLF checkout's core.autocrlf setting", () => {
  const entry = fixture();
  git(entry.root, "config", "core.autocrlf", "true");
  git(entry.root, "add", "--renormalize", ".");
  git(entry.root, "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "-c", "core.hooksPath=.git/hooks", "commit", "-m", "normalize owned fixture index");
  assert.equal(git(entry.root, "status", "--porcelain"), "");
  save(entry);
  assert.equal(restoreValidationDeposit(entry.root, entry.manifestPath), 15);
  assert.equal(git(entry.root, "status", "--porcelain"), "");
  assert.equal(readFileSync(join(entry.root, "AGENTS.md"), "utf8"), "Authored course entry\r\n");
});

test("retains partial output after an I/O failure and refuses to reuse it", () => {
  const entry = fixture();
  save(entry);
  const write = fs.writeFileSync;
  const replacement = mock.method(fs, "writeFileSync", (path, ...args) => {
    if (path === join(entry.root, ".deft/core/QUICK-START.md")) throw new Error("injected write failure");
    return write(path, ...args);
  });
  syncBuiltinESMExports();
  try {
    assert.throws(() => restoreValidationDeposit(entry.root, entry.manifestPath), /injected write failure/);
  } finally {
    replacement.mock.restore();
    syncBuiltinESMExports();
  }
  assert.equal(readFileSync(join(entry.root, ".deft/core/main.md"), "utf8"), "# Pinned test content\n");
  assert.throws(() => restoreValidationDeposit(entry.root, entry.manifestPath), /already exists/);
  assert.equal(git(entry.root, "status", "--porcelain"), "");
});

test("rejects duplicate VERSION fields instead of accepting one matching line", () => {
  const entry = fixture();
  for (const field of ["tag", "ref", "install_root"]) {
    entry.value = manifest();
    entry.value.files.find((file) => file.path === ".deft/core/VERSION").content += "  " + field + ": 'wrong'\n";
    reject(entry, /VERSION/);
  }
});

test("refuses a dangling core junction and linked root or .deft directory", () => {
  const dangling = fixture();
  symlinkSync(join(retained, "does-not-exist"), join(dangling.root, ".deft/core"), "junction");
  save(dangling);
  assert.throws(() => restoreValidationDeposit(dangling.root, dangling.manifestPath), /symlink|already exists/);
  assert.equal(lstatSync(join(dangling.root, ".deft/core")).isSymbolicLink(), true);
  const linked = fixture();
  save(linked);
  const alias = join(retained, "linked-course");
  symlinkSync(linked.root, alias, "junction");
  assert.throws(() => restoreValidationDeposit(alias, linked.manifestPath), /canonical/);
  absent(linked.root);
  const parent = fixture();
  renameSync(join(parent.root, ".deft"), join(parent.root, "retained-deft"));
  symlinkSync(join(parent.root, "retained-deft"), join(parent.root, ".deft"), "junction");
  reject(parent, /symlink/);
});

test("rejects malformed manifests, mismatched versions and incomplete required payloads before writes", () => {
  const entry = fixture();
  for (const value of [null, {}, [], { version: "0.119.3", files: [] }, { version: "0.119.5", files: null }, { version: "0.119.5", files: [] }]) {
    entry.value = value;
    reject(entry, /manifest|required/);
  }
  for (const path of manifest().files.filter((file) => file.path.startsWith(".deft/core/")).map((file) => file.path)) {
    entry.value = manifest();
    entry.value.files = entry.value.files.filter((file) => file.path !== path);
    reject(entry, /required/);
  }
  for (const path of [".deft/core/package.json", ".deft/core/VERSION"]) {
    entry.value = manifest();
    const target = entry.value.files.find((file) => file.path === path);
    target.content = target.content.replaceAll("0.119.5", "0.119.3");
    reject(entry, /version|pin|VERSION/);
  }
  writeFileSync(entry.manifestPath, "not JSON");
  assert.throws(() => restoreValidationDeposit(entry.root, entry.manifestPath), /JSON/);
  absent(entry.root);
});

test("rejects unsafe Windows paths, malformed encodings and file-directory collisions before any write", () => {
  const entry = fixture();
  const paths = ["../outside", "dir/../../outside", "/absolute", "./same", "double//slash", "back\\slash", "C:drive", "space ", "dot.", "CON", "nul.txt", "LPT1", "COM¹.txt", "CONOUT$", "control\u0001", "wild?card", "bad*name", "a|b", "<tag>", "quote\""];
  for (let i = 0; i < 50; i++) paths.push("fuzz-" + i + "/../outside-" + i);
  for (const path of paths) {
    entry.value = manifest();
    entry.value.files.push({ path: ".deft/core/" + path, content: "unsafe", encoding: "utf-8" });
    reject(entry, /path|Windows/);
  }
  for (const fields of [{ encoding: "utf16" }, { content: 123 }, { content: "not base64!", encoding: "base64" }, { content: "YQ", encoding: "base64" }, { content: "YR==", encoding: "base64" }]) {
    entry.value = manifest();
    entry.value.files.push({ path: ".deft/core/example", content: "valid", encoding: "utf-8", ...fields });
    reject(entry, /encoding|content|base64/);
  }
  for (const paths of [["main.md", "MAIN.md"], ["dir/a", "DIR/b"], ["clash", "clash/file"], ["clash/file", "clash"], ["same", "same"]]) {
    entry.value = manifest();
    for (const path of paths) entry.value.files.push({ path: ".deft/core/" + path, content: "x", encoding: "utf-8" });
    reject(entry, /duplicate|collision/);
  }
});

test("refuses non-private or incorrectly pinned projects, malformed generation and dirty Git state", () => {
  for (const pkg of [{}, { private: false }, { private: true, devDependencies: { "@deftai/directive": "^0.119.5" } }]) {
    const entry = fixture();
    writeFileSync(join(entry.root, "package.json"), JSON.stringify(pkg));
    reject(entry, /private|pin/);
  }
  const generation = fixture();
  writeFileSync(join(generation.root, ".deft/GENERATION.json"), JSON.stringify({ contentVersion: "0.119.3" }));
  reject(generation, /GENERATION/);
  const dirty = fixture();
  writeFileSync(join(dirty.root, "new-note.txt"), "user work");
  reject(dirty, /clean/);
  assert.equal(readFileSync(join(dirty.root, "new-note.txt"), "utf8"), "user work");
  const staged = fixture();
  writeFileSync(join(staged.root, "new-note.txt"), "staged user work");
  git(staged.root, "add", "new-note.txt");
  reject(staged, /clean/);
});

test("refuses a non-repository root, missing .deft, nonignored deposit and internal manifest", () => {
  const plain = fixture();
  renameSync(join(plain.root, ".git"), join(plain.root, "retained-git"));
  reject(plain, /git .*failed/);
  const noDeft = fixture();
  renameSync(join(noDeft.root, ".deft"), join(noDeft.root, "retained-deft"));
  reject(noDeft, /ENOENT|directory/);
  const unignored = fixture();
  writeFileSync(join(unignored.root, ".gitignore"), "# no ignore\n");
  git(unignored.root, "add", ".gitignore");
  git(unignored.root, "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "-c", "core.hooksPath=.git/hooks", "commit", "-m", "remove ignore in owned test fixture");
  reject(unignored, /ignored/);
  const internal = fixture();
  internal.manifestPath = join(internal.root, "headless.json");
  reject(internal, /external|outside/);
});

test("CLI accepts one external manifest and reports failures with nonzero status", () => {
  const entry = fixture();
  save(entry);
  const run = (...args) => spawnSync(process.execPath, [cli, ...args], { cwd: entry.root, encoding: "utf8" });
  for (const args of [[], [entry.manifestPath, "extra"]]) {
    const result = run(...args);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Usage:/);
    absent(entry.root);
  }
  const result = run(entry.manifestPath);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Restored 15 files/);
  const again = run(entry.manifestPath);
  assert.equal(again.status, 1);
  assert.match(again.stderr, /already exists/);
});
