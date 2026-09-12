import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, realpathSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const helpers = [
  "labs/fixtures/05-projection-drift-recovery/projection-lab.mjs",
  "labs/fixtures/07-scope-lifecycle/lifecycle-lab.mjs",
  "labs/fixtures/09-implementation-golden-path/implementation-lab.mjs",
  "labs/fixtures/10-testing-gates-and-evidence/gates-lab.mjs",
  "labs/fixtures/capstone-end-to-end/capstone-lab.mjs",
];

test("lab helper entry detection accepts alternate paths for the same file", () => {
  const aliasRoot = mkdtempSync(join(tmpdir(), "3ci-lab-helper-alias-"));

  for (const [index, relativePath] of helpers.entries()) {
    const helper = join(repositoryRoot, relativePath);
    const alias = join(aliasRoot, `${index}-${basename(helper)}`);
    symlinkSync(helper, alias);
    assert.notEqual(alias, realpathSync(alias), `${relativePath} test setup must use an alternate path`);

    const result = spawnSync(process.execPath, [alias, "entry-probe"], { encoding: "utf8" });
    assert.equal(result.status, 1, `${relativePath} must dispatch its CLI through an alternate path`);
    assert.notEqual(`${result.stdout}${result.stderr}`.trim(), "", `${relativePath} must not silently exit`);
    assert.match(result.stderr, /stopped:/i, `${relativePath} must report its rejected probe verb`);
  }
});
