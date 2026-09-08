import assert from "node:assert/strict";
import { lstatSync, readdirSync, realpathSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

/** Refuse inherited Git location/config overrides; report names only, never their values. */
export function assertNoGitRedirection() {
  const blocked = Object.keys(process.env).filter((key) =>
    /^GIT_(DIR|WORK_TREE|INDEX_FILE|COMMON_DIR|OBJECT_DIRECTORY|ALTERNATE_OBJECT_DIRECTORIES|CONFIG.*|CEILING_DIRECTORIES|DISCOVERY_ACROSS_FILESYSTEM|NAMESPACE|SHALLOW_FILE|REPLACE_REF_BASE|EXTERNAL_DIFF)$/i.test(key),
  );
  assert.equal(blocked.length, 0, "Stop: inherited Git override(s): " + blocked.join(", ") + "; use a fresh terminal without repository redirection.");
}

// Child-only environment: caller Git overrides must not redirect the disposable repo.
/** Run Git in root without inherited GIT_* redirection; throw on timeout or an unexpected exit. */
export function git(root, args, accepted = [0]) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^GIT_/i.test(key)));
  const result = spawnSync("git", ["--no-optional-locks", "-c", "core.hooksPath=.git/hooks", "-c", "core.autocrlf=false", "-C", root, ...args], {
    env, encoding: "utf8", timeout: 30_000,
  });
  if (result.error) throw result.error;
  assert.ok(accepted.includes(result.status), "git " + args.join(" ") + " failed: " + result.stderr);
  return result.stdout;
}

// Every existing component below an already canonical root must be a real path.
// Missing suffixes are permitted for a subsequent bounded create operation.
/** Resolve a nonempty relative path; throw on traversal, links, or noncanonical existing parents. */
export function safePath(root, relativePath) {
  assert.ok(
    typeof relativePath === "string" && relativePath.length > 0 &&
      !isAbsolute(relativePath) && !relativePath.includes("\\") &&
      !relativePath.includes(":") && !relativePath.includes("\0") &&
      relativePath.split("/").every((part) => part !== "" && part !== "." && part !== ".."),
    "expected a bounded relative path",
  );
  let current = resolve(root);
  assert.equal(realpathSync(current), current, "root must be canonical");
  for (const part of relativePath.split("/")) {
    current = join(current, part);
    let stat;
    try {
      stat = lstatSync(current);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    assert.ok(!stat.isSymbolicLink(), "Stop: symlink at " + current);
    assert.equal(realpathSync(current), current, "Stop: path escaped through a symlink");
  }
  return current;
}

/** Inspect a bounded existing tree and throw if any descendant is a symlink. Does not modify it. */
export function assertPlainTree(root, relativePath) {
  const path = safePath(root, relativePath);
  if (!lstatSync(path).isDirectory()) return;
  for (const entry of readdirSync(path)) assertPlainTree(root, relativePath + "/" + entry);
}
