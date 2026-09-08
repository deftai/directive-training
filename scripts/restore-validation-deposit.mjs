import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { assertNoGitRedirection, safePath } from "../labs/fixtures/05-projection-drift-recovery/safety.mjs";

const pin = "0.112.0";
const prefix = ".deft/core/";
const skills = ["deft-directive-build", "deft-directive-pre-pr", "deft-directive-review-cycle", "deft-directive-swarm"];
const required = ["main.md", "QUICK-START.md", "Taskfile.yml", "SKILL.md", "package.json", "VERSION", ".agents/skills/deft/SKILL.md", ...skills.flatMap((name) => [".agents/skills/" + name + "/SKILL.md", "skills/" + name + "/SKILL.md"])];

// Unlike disposable labs, this existing clone keeps its configured line-ending rules.
function inspectGit(root, args, accepted = [0]) {
  const result = spawnSync("git", ["--no-optional-locks", "-C", root, ...args], { encoding: "utf8", timeout: 30_000 });
  if (result.error) throw result.error;
  assert.ok(accepted.includes(result.status), "git " + args.join(" ") + " failed: " + result.stderr);
  return result.stdout;
}

/**
 * Materialize only an absent .deft/core from a pinned public init --headless manifest.
 * Run without concurrent writers. All input is validated before creating the deposit;
 * I/O failures retain partial files for inspection, and reruns refuse that deposit.
 * @param {string} projectRoot Canonical, clean Git worktree with the course's exact pin.
 * @param {string} manifestPath Existing external JSON emitted by the verified pinned CLI.
 * @returns {number} Number of restored payload files (root scaffold entries are ignored).
 * @throws {Error} On invalid input, unsafe state, existing deposit, or filesystem failure.
 */
export function restoreValidationDeposit(projectRoot, manifestPath) {
  assert.ok(typeof projectRoot === "string" && projectRoot.length > 0, "expected project root path");
  assert.ok(typeof manifestPath === "string" && manifestPath.length > 0, "expected external manifest path");
  assertNoGitRedirection();
  const root = resolve(projectRoot);
  const deft = safePath(root, ".deft");
  assert.ok(lstatSync(deft).isDirectory(), "expected existing .deft directory");
  const core = join(deft, "core");
  assert.equal(lstatSync(core, { throwIfNoEntry: false }), undefined, "Stop: .deft/core already exists; preserve it and report, do not overwrite it.");
  const pkg = JSON.parse(readFileSync(safePath(root, "package.json"), "utf8"));
  assert.ok(pkg?.private === true && pkg.devDependencies?.["@deftai/directive"] === pin, "expected private project with exact 0.112.0 pin");
  const generation = JSON.parse(readFileSync(safePath(root, ".deft/GENERATION.json"), "utf8"));
  assert.ok(generation?.schemaVersion === 1 && Number.isInteger(generation.generation) && generation.generation > 0 && generation.contentVersion === pin && ["payload", "templates", "skills", "docs"].every((key) => generation.surfaces?.[key] === pin) && generation.surfaces?.version === "v" + pin, "expected existing 0.112.0 GENERATION record; do not rewrite it");
  const source = resolve(manifestPath);
  assert.ok(lstatSync(source).isFile(), "expected ordinary external manifest file");
  const sourceRelative = relative(root, realpathSync(source));
  assert.ok(isAbsolute(sourceRelative) || sourceRelative === ".." || sourceRelative.startsWith(".." + sep), "manifest must be outside the project");
  const manifest = JSON.parse(readFileSync(source, "utf8"));
  assert.ok(manifest?.version === pin && Array.isArray(manifest.files), "expected 0.112.0 headless manifest");
  const nodes = new Map();
  const payload = new Map();
  for (const file of manifest.files) {
    assert.ok(typeof file?.path === "string", "expected manifest file path");
    if (!file.path.startsWith(prefix)) continue;
    const path = file.path.slice(prefix.length);
    const parts = path.split("/");
    assert.ok(parts.every((part) => part !== "" && part !== "." && part !== ".." && !/[<>:"\\|?*\u0000-\u001f\u007f]/u.test(part) && !/[ .]$/u.test(part) && !/^(con|prn|aux|nul|conin\$|conout\$|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/iu.test(part)), "unsafe Windows payload path: " + path);
    safePath(root, prefix + path);
    for (let i = 0; i < parts.length; i++) {
      const name = parts.slice(0, i + 1).join("/");
      const key = name.normalize("NFC").toLowerCase();
      const directory = i < parts.length - 1;
      const prior = nodes.get(key);
      assert.ok(prior === undefined || (prior.name === name && prior.directory && directory), "duplicate or file-directory collision: " + path);
      nodes.set(key, { name, directory });
    }
    assert.ok(typeof file.content === "string", "expected string payload content");
    assert.ok(file.encoding === "utf-8" || file.encoding === "base64", "unsupported payload encoding");
    const bytes = Buffer.from(file.content, file.encoding === "utf-8" ? "utf8" : "base64");
    assert.equal(bytes.toString(file.encoding === "utf-8" ? "utf8" : "base64"), file.content, "invalid or noncanonical payload content/base64");
    payload.set(path, bytes);
  }
  for (const path of required) assert.ok(payload.get(path)?.length > 0, "missing required payload file: " + path);
  const contentPackage = JSON.parse(payload.get("package.json").toString("utf8"));
  assert.ok(contentPackage?.name === "@deftai/directive-content" && contentPackage.version === pin, "content package version must match pin");
  const version = payload.get("VERSION").toString("utf8").replaceAll("\r\n", "\n");
  for (const [key, value] of Object.entries({ ref: "v" + pin, sha: pin, tag: "v" + pin, install_root: ".deft/core", fetched_by: "directive-init-headless" })) {
    const rows = version.split("\n").filter((line) => line.split(":")[0].trim() === key);
    assert.deepEqual(rows, [key + ": '" + value + "'"], "invalid or duplicate pinned VERSION field: " + key);
  }
  assert.equal(realpathSync(inspectGit(root, ["rev-parse", "--show-toplevel"]).trim()), root, "expected canonical Git project root");
  assert.equal(inspectGit(root, ["ls-files", "--", ".deft/core"]), "", "framework deposit must be untracked");
  assert.ok(inspectGit(root, ["check-ignore", "--", ".deft/core/.validation-probe"], [0, 1]).trim(), "framework deposit must be ignored");
  assert.equal(inspectGit(root, ["status", "--porcelain", "--untracked-files=all"]), "", "expected clean working tree and index");
  mkdirSync(safePath(root, ".deft/core")); // Exclusive creation: never reuse an existing deposit.
  for (const [path, bytes] of payload) {
    const target = safePath(root, prefix + path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(safePath(root, prefix + path), bytes, { flag: "wx" });
  }
  return payload.size;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    assert.equal(process.argv.length, 3, "Usage: node scripts/restore-validation-deposit.mjs <external-headless-manifest.json>");
    const count = restoreValidationDeposit(process.cwd(), process.argv[2]);
    console.log("Restored " + count + " files into .deft/core; authored project files were not changed.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
