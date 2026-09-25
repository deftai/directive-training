import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, delimiter, dirname, join, resolve } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";
import { governingEnv, withoutHostNpmConfig } from "../labs/fixtures/02-disposable-initialization/init-lab.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const pin = "0.119.5";
const pinnedSpec = `@deftai/directive@${pin}`;
const nestedNames = ["directive-core", "directive-content", "directive-types"];
const workspace = mkdtempSync(join(tmpdir(), "directive-bootstrap-runtime-"));
const userconfig = join(workspace, "user.npmrc");
const globalconfig = join(workspace, "global.npmrc");
const cache = join(workspace, "cache");
const pinnedPrefix = join(workspace, "prefix-pinned");
const latestPrefix = join(workspace, "prefix-latest");

after(() => rmSync(workspace, { recursive: true, force: true }));

const packageJson = JSON.parse(readFileSync(join(repositoryRoot, "package.json"), "utf8"));
assert.match(
  packageJson.scripts["test:runtime"],
  /scripts\/directive-bootstrap-runtime\.test\.mjs/,
  "the sibling runtime module must be invoked from test:runtime",
);
assert.doesNotMatch(
  packageJson.scripts["test:content"] + packageJson.scripts["test:teaching-baseline"],
  /directive-bootstrap-runtime/,
  "the registry install must stay off test:content and teaching-baseline tests",
);

writeFileSync(userconfig, "registry=https://registry.npmjs.org/\naudit=false\nfund=false\nignore-scripts=true\n");
writeFileSync(globalconfig, "audit=false\nfund=false\n");

function isNpmExecPath(execPath) {
  if (typeof execPath !== "string" || execPath.length === 0) return false;
  const name = basename(execPath).toLowerCase();
  return name === "npm-cli.js" || name === "npm";
}

function npmCliScript() {
  const execPath = process.env.npm_execpath;
  if (isNpmExecPath(execPath) && existsSync(execPath)) {
    return execPath;
  }
  const searchRoots = [dirname(process.execPath), resolve(dirname(process.execPath), "..")];
  if (isNpmExecPath(execPath)) {
    searchRoots.unshift(dirname(execPath), resolve(dirname(execPath), ".."));
  }
  const pathValue = governingEnv().PATH;
  const suffixes = process.platform === "win32"
    ? ["", ...(process.env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD").split(";").filter(Boolean)]
    : [""];
  for (const directory of pathValue.split(delimiter).filter(Boolean)) {
    for (const suffix of suffixes) {
      const candidate = join(directory, "npm" + suffix);
      if (existsSync(candidate)) {
        searchRoots.push(dirname(candidate), resolve(dirname(candidate), ".."));
      }
    }
  }
  for (const searchRoot of searchRoots) {
    for (const relativePath of ["node_modules/npm/bin/npm-cli.js", "lib/node_modules/npm/bin/npm-cli.js"]) {
      const candidate = join(searchRoot, relativePath);
      if (existsSync(candidate)) return candidate;
    }
  }
  assert.fail("npm-cli.js is required for the isolated bootstrap observation");
}

function isolationFlags() {
  return [
    "--userconfig", userconfig,
    "--globalconfig", globalconfig,
    "--cache", cache,
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    "--loglevel", "error",
  ];
}

function runNpm(args, timeout = 60_000) {
  const result = spawnSync(process.execPath, [npmCliScript(), ...isolationFlags(), ...args], {
    cwd: workspace,
    encoding: "utf8",
    timeout,
    env: withoutHostNpmConfig(governingEnv()),
  });
  if (result.error) throw result.error;
  assert.equal(result.signal, null, `npm ${args[0]} terminated by signal ${result.signal}`);
  assert.equal(
    result.status,
    0,
    `npm ${args.join(" ")} failed (${result.status}): ${result.stderr}${result.stdout}`,
  );
  return result.stdout;
}

function parseNpmJson(stdout) {
  const text = stdout.trim();
  const start = text.search(/[\[{"]/);
  assert.ok(start >= 0, `npm JSON output is missing: ${stdout}`);
  return JSON.parse(text.slice(start));
}

const exactReleasePattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function isExactRelease(version) {
  return exactReleasePattern.test(String(version));
}

function parseRelease(version) {
  const match = exactReleasePattern.exec(String(version));
  assert.ok(match, `expected exact x.y.z version, got ${version}`);
  return match.slice(1).map(Number);
}

function isNewerCompatible(version) {
  if (!isExactRelease(version)) return false;
  const [major, minor, patch] = parseRelease(version);
  const [pinMajor, pinMinor, pinPatch] = parseRelease(pin);
  return major === pinMajor && minor === pinMinor && patch > pinPatch;
}

function rangeAllowsNewer(range) {
  const trimmed = String(range ?? "").trim();
  if (trimmed === pin) return false;
  return trimmed === `^${pin}` || trimmed.startsWith(`^${pin.split(".").slice(0, 2).join(".")}`);
}

function publishedVersions(name) {
  const raw = parseNpmJson(runNpm(["view", `@deftai/${name}`, "versions", "--json"]));
  return Array.isArray(raw) ? raw : [raw];
}

function nestedPackageVersion(fromDirectory, name) {
  let current = fromDirectory;
  while (true) {
    const candidate = join(current, "node_modules", "@deftai", name, "package.json");
    if (existsSync(candidate)) return JSON.parse(readFileSync(candidate, "utf8")).version;
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  assert.fail(`nested @deftai/${name} was not found from ${fromDirectory}`);
}

function nestedGraph(prefix) {
  const globalRoot = runNpm(["root", "-g", "--prefix", prefix]).trim();
  const cliRoot = join(globalRoot, "@deftai", "directive");
  const cliManifest = join(cliRoot, "package.json");
  assert.ok(existsSync(cliManifest), `installed CLI manifest missing at ${cliManifest}`);
  const versions = {
    directive: JSON.parse(readFileSync(cliManifest, "utf8")).version,
  };
  for (const name of nestedNames) versions[name] = nestedPackageVersion(cliRoot, name);
  return versions;
}

function newerCompatibleReleaseExists() {
  const dependencies = parseNpmJson(runNpm(["view", pinnedSpec, "dependencies", "--json"]));
  const ranged = ["directive-core", "directive-content"].filter((name) => rangeAllowsNewer(dependencies[`@deftai/${name}`]));
  if (ranged.length === 0) return false;
  for (const name of [...ranged, "directive-types"]) {
    if (publishedVersions(name).filter(isExactRelease).some(isNewerCompatible)) return true;
  }
  return false;
}

test("npm_execpath is accepted only when it names npm", () => {
  assert.equal(isNpmExecPath(join("node_modules", "npm", "bin", "npm-cli.js")), true);
  assert.equal(isNpmExecPath("/usr/bin/npm"), true);
  assert.equal(isNpmExecPath(join("pnpm", "bin", "pnpm.cjs")), false);
  assert.equal(isNpmExecPath("/usr/bin/pnpm"), false);
  assert.equal(isNpmExecPath(""), false);
});

test("prereleases are not treated as newer compatible releases", () => {
  assert.equal(isNewerCompatible("0.119.6-rc.1"), false);
  assert.equal(isNewerCompatible("0.119.6-alpha.0"), false);
  assert.equal(isExactRelease("0.119.6"), true);
  assert.equal(isExactRelease("0.119.6-rc.1"), false);
  assert.deepEqual(
    ["0.119.5", "0.119.6-rc.1", "0.119.7"].filter(isExactRelease).filter(isNewerCompatible),
    ["0.119.7"],
  );
});

test("isolated pinned global-prefix install characterizes mixed nested resolution", { timeout: 300_000 }, (t) => {
  if (!newerCompatibleReleaseExists()) {
    t.diagnostic("not-exercised: no newer compatible release exists in the caret range");
    t.skip("not-exercised");
    return;
  }
  runNpm(["install", "--global", "--prefix", pinnedPrefix, pinnedSpec], 300_000);
  const graph = nestedGraph(pinnedPrefix);
  t.diagnostic(`pinned nested graph: ${JSON.stringify(graph)}`);
  assert.equal(graph.directive, pin, "pinned install must select CLI 0.119.5");
  const nested = nestedNames.map((name) => graph[name]);
  assert.ok(
    nested.some((version) => version !== pin),
    `nested resolution should be mixed when a newer compatible release exists; observed ${JSON.stringify(graph)}`,
  );
});

test("unversioned global bootstrap is a separate latest-version observation", { timeout: 300_000 }, (t) => {
  runNpm(["install", "--global", "--prefix", latestPrefix, "@deftai/directive"], 300_000);
  const graph = nestedGraph(latestPrefix);
  t.diagnostic(`unversioned latest graph: ${JSON.stringify(graph)}`);
  for (const [name, version] of Object.entries(graph)) {
    parseRelease(version);
    t.diagnostic(`${name}@${version}`);
  }
});
