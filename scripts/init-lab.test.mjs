import assert from "node:assert/strict";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { after, afterEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  acceptAttempt,
  archiveAttempt as archiveAttemptRaw,
  createAttempt as createAttemptRaw,
  diagnoseAttempt,
  governingEnv,
  guardAttempt,
  installAttempt,
  main,
  previewReclaim,
  reclaimArchives,
  recoveryNpmrc,
  resetAttempt as resetAttemptRaw,
  withoutHostNpmConfig,
} from "../labs/fixtures/02-disposable-initialization/init-lab.mjs";

const read = (path) => readFileSync(path, "utf8");
const courseRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const hostTemporaryRoot = realpathSync(tmpdir());
const suiteTemporaryRoot = realpathSync(mkdtempSync(join(hostTemporaryRoot, "3ci-module02-suite-")));
const originalTemporaryEnvironment = new Map(
  ["TEMP", "TMP", "TMPDIR"].map((key) => [key, process.env[key]]),
);
for (const key of originalTemporaryEnvironment.keys()) process.env[key] = suiteTemporaryRoot;
const archivedForCleanup = new Set();
const parentsForCleanup = new Set();

function createAttempt(...args) {
  const root = createAttemptRaw(...args);
  parentsForCleanup.add(dirname(root));
  return root;
}

function resetAttempt(...args) {
  const root = resetAttemptRaw(...args);
  parentsForCleanup.add(dirname(root));
  return root;
}

function archiveAttempt(...args) {
  const archived = archiveAttemptRaw(...args);
  archivedForCleanup.add(dirname(archived));
  return archived;
}

afterEach(() => {
  const remaining = [...archivedForCleanup].filter((path) => existsSync(path));
  if (remaining.length > 0) reclaimArchives(remaining, { confirmed: true });
  for (const parent of parentsForCleanup) rmSync(parent, { force: true, recursive: true });
  archivedForCleanup.clear();
  parentsForCleanup.clear();
});

after(() => {
  for (const [key, value] of originalTemporaryEnvironment) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  rmSync(suiteTemporaryRoot, { force: true, recursive: true });
});

/** Replace the first occurrence positionally; the fixture is spliced, never rewritten by pattern. */
const splice = (text, find, replacement) => {
  const index = text.indexOf(find);
  assert.notEqual(index, -1, "fixture splice target not found: " + find);
  return text.slice(0, index) + replacement + text.slice(index + find.length);
};

const withEnvironment = (values, body) => {
  const restore = new Map(Object.keys(values).map((key) => [key, process.env[key]]));
  Object.assign(process.env, values);
  try {
    return body();
  } finally {
    for (const [key, value] of restore) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
};

test("the governing child environment is the env -i caller base and nothing else", () => {
  const environment = withEnvironment(
    {
      DEFT_HOOKS_PREFER_GLOBAL: "1",
      GIT_DIR: "/somewhere/else/.git",
      npm_config_registry: "https://registry.northstar.invalid/",
      NPM_TOKEN: "fictional-token",
    },
    () => governingEnv(),
  );
  assert.equal(environment.PATH, process.env.PATH);
  for (const blocked of ["DEFT_HOOKS_PREFER_GLOBAL", "GIT_DIR", "npm_config_registry", "NPM_TOKEN"]) {
    assert.equal(Object.hasOwn(environment, blocked), false, blocked + " must not cross into a lab child");
  }
  if (process.platform !== "win32") {
    assert.deepEqual(Object.keys(environment).sort(), ["HOME", "PATH"]);
  }
});

test("the npm credential strip layers on the governing base rather than replacing it", () => {
  const stripped = withoutHostNpmConfig({
    PATH: "/usr/bin",
    HOME: "/home/learner",
    npm_config_registry: "https://registry.northstar.invalid/",
    NPM_CONFIG_USERCONFIG: "/home/learner/.npmrc",
    NPM_TOKEN: "fictional-token",
    NODE_AUTH_TOKEN: "fictional-token",
  });
  assert.deepEqual(stripped, { PATH: "/usr/bin", HOME: "/home/learner" });
  assert.deepEqual(withoutHostNpmConfig({ PATH: "/usr/bin" }, { PATH: "/lab/bin" }), { PATH: "/lab/bin" });
});

test("create produces a guarded no-remote attempt and records no caller shell state", () => {
  const root = createAttempt();
  assert.equal(guardAttempt(root), root);
  const marker = JSON.parse(read(join(dirname(root), "lab-state.json")));
  assert.equal(marker.lab, "module-02");
  assert.equal(marker.root, root);
  assert.deepEqual(
    Object.keys(marker).sort(),
    ["fixtureDigest", "lab", "root", "schema"],
    "lab-state.json must replay no caller shell state",
  );
  const markerText = read(join(dirname(root), "lab-state.json"));
  for (const forbidden of ["PATH", "npmUserconfig", "NPM_CONFIG_USERCONFIG"]) {
    assert.equal(markerText.includes(forbidden), false, "lab-state.json must not replay caller state: " + forbidden);
  }
  const manifest = JSON.parse(read(join(root, "package.json")));
  assert.equal(manifest.devDependencies["@deftai/directive"], "0.119.9");
  assert.equal(manifest.overrides["@deftai/directive-core"], "0.119.9");
  assert.equal(read(join(root, ".npmrc")).includes("registry=https://registry.npmjs.org/"), true);
  assert.equal(existsSync(join(dirname(root), "evidence.md")), true);
  archiveAttempt(root);
});

test("an empty, relative, reshaped, or stale root is a usage refusal, never a boundary stop", () => {
  const root = createAttempt();
  const stale = join(dirname(root), "attempt-99.zzzzzz");
  for (const supplied of ["", "   ", "labs/fixtures", "./attempt-01", stale, join(stale, "..") + "/", stale + "/.."]) {
    assert.throws(
      () => guardAttempt(supplied),
      (error) => {
        assert.match(error.message, /^Usage refusal: pass exactly one absolute attempt root/);
        assert.doesNotMatch(error.message, /Stop:/);
        return true;
      },
      "refused paste: " + JSON.stringify(supplied),
    );
  }
  for (const argv of [["guard"], ["polish", "/tmp/somewhere"], ["install", "/tmp/one", "/tmp/two"]]) {
    assert.throws(
      () => main(argv),
      (error) => {
        assert.match(error.message, /^Usage refusal: use create \| guard/);
        assert.doesNotMatch(error.message, /Stop:/);
        return true;
      },
      "refused argv: " + JSON.stringify(argv),
    );
  }
  archiveAttempt(root);
});

test("guard refuses the curriculum clone, a remote, and a changed pin without repairing them", () => {
  assert.throws(() => guardAttempt(courseRoot), /Stop: unsafe lab root/);
  const root = createAttempt();
  const config = join(root, ".git/config");
  const originalConfig = read(config);
  writeFileSync(config, originalConfig + '\n[remote "unexpected"]\n\turl = https://example.invalid/fictional.git\n');
  assert.throws(() => guardAttempt(root), /Stop: the disposable repository has a Git remote/);
  assert.match(read(config), /unexpected/);
  writeFileSync(config, originalConfig);
  const manifestPath = join(root, "package.json");
  const originalManifest = read(manifestPath);
  writeFileSync(manifestPath, splice(originalManifest, '"0.119.9"', '"0.119.3"'));
  assert.throws(() => guardAttempt(root), /Stop: the attempt fixture differs from the supplied course fixture/);
  assert.match(read(manifestPath), /0\.119\.3/);
  writeFileSync(manifestPath, originalManifest);
  assert.equal(guardAttempt(root), root);
  archiveAttempt(root);
});

test("reset preserves the failed attempt and seeds the next one in the same guarded parent", () => {
  const first = createAttempt();
  writeFileSync(join(dirname(first), "evidence.md"), "preserved failure\n");
  const second = resetAttempt(first);
  assert.notEqual(first, second);
  assert.equal(dirname(second), dirname(first));
  assert.match(second, /attempt-02\./);
  assert.equal(existsSync(join(first, "package.json")), true);
  assert.equal(read(join(dirname(first), "evidence.md")), "preserved failure\n");
  assert.equal(guardAttempt(second), second);
  const archived = archiveAttempt(second);
  assert.equal(existsSync(join(archived, "evidence.md")), true);
  assert.equal(existsSync(dirname(first)), false);
});

test("reset rolls back a helper-created sibling when seeding stops before Git initialization", () => {
  const first = createAttempt();
  const parent = dirname(first);
  const markerBefore = read(join(parent, "lab-state.json"));
  let incompleteRoot;

  assert.throws(
    () => resetAttemptRaw(first, {
      beforeGitInit(root) {
        incompleteRoot = root;
        assert.equal(existsSync(join(root, ".git")), false, "the fault seam must run before Git initialization");
        assert.equal(read(join(parent, "lab-state.json")), markerBefore, "the new root must not be published before Git initialization");
        const error = new Error("simulated ENOSPC before Git initialization");
        error.code = "ENOSPC";
        throw error;
      },
    }),
    (error) => error.code === "ENOSPC" && /simulated ENOSPC/.test(error.message),
  );

  assert.ok(incompleteRoot, "the fault seam must expose the exact helper-created sibling");
  assert.equal(existsSync(incompleteRoot), false, "reset must remove only the exact unpublished sibling");
  assert.equal(read(join(parent, "lab-state.json")), markerBefore, "a failed reset must preserve the last valid marker");
  assert.deepEqual(
    readdirSync(parent, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith("attempt-"))
      .map((entry) => entry.name),
    [basename(first)],
    "a failed reset must remove only its own incomplete sibling",
  );
  assert.equal(guardAttempt(first), first);
  assert.equal(existsSync(join(parent, "evidence.md")), true, "reset rollback must preserve retained evidence");

  const archiveRoot = dirname(archiveAttempt(first));
  assert.ok(previewReclaim().includes(archiveRoot), "the preserved installed attempt must remain reclaimable");
  reclaimArchives([archiveRoot], { confirmed: true });
  assert.equal(existsSync(archiveRoot), false, "confirmed reclaim must remove the archived prior attempt");
});

test("archive refuses to move the parent out from under the caller", () => {
  const root = createAttempt();
  const previous = process.cwd();
  process.chdir(root);
  try {
    assert.throws(() => archiveAttempt(root), /Stop: run archive from outside the attempt parent/);
  } finally {
    process.chdir(previous);
  }
  assert.equal(guardAttempt(root), root);
  archiveAttempt(root);
});

test("archive validates retained evidence before moving the Module 2 parent", () => {
  const root = createAttempt();
  const parent = dirname(root);
  const evidence = join(parent, "evidence.md");
  const retainedEvidence = join(parent, "evidence.retained.md");
  renameSync(evidence, retainedEvidence);

  assert.throws(() => archiveAttempt(root), /evidence note is missing/);
  assert.equal(existsSync(parent), true, "an evidence refusal must leave the live parent in place");
  assert.equal(guardAttempt(root), root, "an evidence refusal must preserve the valid printed root");

  renameSync(retainedEvidence, evidence);
  archiveAttempt(root);
});

test("reclaim previews without creating storage and deletes only a confirmed Module 2 archive", (t) => {
  const emptyTemporaryRoot = realpathSync(mkdtempSync(join(tmpdir(), "3ci-module02-reclaim-empty-")));
  t.after(() => rmSync(emptyTemporaryRoot, { force: true, recursive: true }));
  assert.deepEqual(previewReclaim(emptyTemporaryRoot), []);
  assert.equal(
    existsSync(join(emptyTemporaryRoot, "3ci-directive-module-02-archive.missing")),
    false,
    "preview must not create an archive destination",
  );

  const live = createAttempt();
  mkdirSync(join(live, ".npm-cache"));
  writeFileSync(join(live, ".npm-cache", "live.txt"), "keep\n");
  const retired = createAttempt();
  mkdirSync(join(retired, ".npm-cache"));
  writeFileSync(join(retired, ".npm-cache", "retired.txt"), "remove\n");
  const archiveRoot = dirname(archiveAttempt(retired));
  const invalidArchive = join(dirname(archiveRoot), "3ci-directive-module-02-archive.BAD001");
  mkdirSync(invalidArchive);

  assert.ok(previewReclaim().includes(archiveRoot));
  assert.equal(previewReclaim().includes(invalidArchive), false, "preview must skip an invalid matching archive without hiding valid targets");
  assert.throws(() => reclaimArchives([invalidArchive], { confirmed: true }), /archive destination/);
  rmSync(invalidArchive, { recursive: true });
  assert.match(main(["reclaim"]), /3ci-directive-module-02-archive\./);
  assert.throws(() => reclaimArchives([archiveRoot]), /explicit confirmation/);
  assert.throws(() => reclaimArchives([live], { confirmed: true }), /archive destination/);
  assert.throws(() => reclaimArchives([courseRoot], { confirmed: true }), /archive destination/);
  assert.equal(main(["reclaim", "--confirm", archiveRoot]), "reclaimed=" + archiveRoot);
  assert.equal(existsSync(archiveRoot), false);
  assert.equal(read(join(live, ".npm-cache", "live.txt")), "keep\n");

  const archiveOutput = main(["archive", live]);
  assert.match(archiveOutput, /^archived=/);
  const liveArchive = archiveOutput.slice("archived=".length);
  archivedForCleanup.add(dirname(liveArchive));
  const replacement = main(["reset", liveArchive]);
  parentsForCleanup.add(dirname(replacement));
  assert.equal(guardAttempt(replacement), replacement);
  const liveArchiveRoot = dirname(liveArchive);
  const archivedLiveCache = join(liveArchive, basename(live), ".npm-cache");
  assert.equal(read(join(archivedLiveCache, "live.txt")), "keep\n");
  reclaimArchives([liveArchiveRoot], { confirmed: true });
  assert.equal(existsSync(archivedLiveCache), false);
  reclaimArchives([dirname(archiveAttempt(replacement))], { confirmed: true });
});

test("the pinned learner path installs, diagnoses, and accepts from separate helper invocations", { timeout: 600_000 }, () => {
  const root = createAttempt();
  const installed = withEnvironment(
    {
      DEFT_HOOKS_PREFER_GLOBAL: "1",
      npm_config_registry: "https://registry.northstar.invalid/",
      npm_config_always_auth: "true",
    },
    () => installAttempt(root),
  );
  assert.equal(installed.root, root);
  assert.match(installed.commit, /^[0-9a-f]{40}$/);
  assert.ok(installed.trackable.includes("package-lock.json"));
  assert.equal(installed.toolchainHelpExit, 2);
  assert.equal(existsSync(join(dirname(root), "toolchain-help.txt")), true);

  const directiveLauncher = join(root, "node_modules/.bin/directive");
  const deftLauncher = join(root, "node_modules/.bin/deft");
  assert.equal(existsSync(directiveLauncher), true);
  assert.equal(existsSync(deftLauncher), true);
  assert.equal(JSON.parse(read(join(root, "node_modules/@deftai/directive-core/package.json"))).version, "0.119.9");

  const diagnosis = diagnoseAttempt(root);
  assert.deepEqual({ doctorExit: diagnosis.doctorExit, toolchainExit: diagnosis.toolchainExit }, { doctorExit: 0, toolchainExit: 0 });
  assert.match(read(diagnosis.doctorReport), /canonical-vendored-npm-signpost/);
  assert.equal(acceptAttempt(root), "PASS");

  const drill = recoveryNpmrc(root);
  assert.match(drill, /^npmrc=/m);
  assert.match(drill, /^registry=https?:\/\//m);
  assert.equal(dirname(drill.split("\n")[0].slice("npmrc=".length)), dirname(root));

  // A missing or non-executable project-local hook runtime must refuse before any spawn and must
  // never fall through to a host-global `deft`, even when one is installed on this machine.
  renameSync(deftLauncher, deftLauncher + ".preserved");
  assert.throws(
    () => acceptAttempt(root),
    (error) => {
      assert.match(error.message, /^Runtime refusal: the project-local binary is missing or not executable/);
      assert.doesNotMatch(error.message, /Stop:/);
      return true;
    },
  );
  renameSync(deftLauncher + ".preserved", deftLauncher);
  if (process.platform !== "win32") {
    // A present-but-non-executable launcher must fail the same way: existence is weaker than `test -x`.
    chmodSync(deftLauncher, 0o644);
    assert.throws(
      () => acceptAttempt(root),
      (error) => {
        assert.match(error.message, /^Runtime refusal: the project-local binary is missing or not executable/);
        assert.doesNotMatch(error.message, /Stop:/);
        return true;
      },
    );
    chmodSync(deftLauncher, 0o755);
  }
  assert.equal(acceptAttempt(root), "PASS");

  assert.throws(() => installAttempt(root), /Stop: install needs a fresh attempt/);
  const archived = archiveAttempt(root);
  assert.equal(existsSync(join(archived, "doctor-full.txt")), true);
  assert.equal(existsSync(dirname(root)), false);
});
