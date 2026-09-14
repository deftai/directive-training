import assert from "node:assert/strict";
import { test } from "node:test";
import { verifyWindowsSymlinkCapability } from "./verify-symlink-capability.mjs";

test("non-Windows platforms do not require a Windows symlink probe", () => {
  let probes = 0;
  const result = verifyWindowsSymlinkCapability({
    platform: "linux",
    probeSymlink: () => {
      probes += 1;
    },
  });

  assert.deepEqual(result, { required: false, checked: [] });
  assert.equal(probes, 0);
});

test("Windows requires successful file and directory symlink probes", () => {
  const checked = [];
  const result = verifyWindowsSymlinkCapability({
    platform: "win32",
    probeSymlink: (type) => checked.push(type),
  });

  assert.deepEqual(result, { required: true, checked: ["file", "dir"] });
  assert.deepEqual(checked, ["file", "dir"]);
});

for (const unavailableType of ["file", "dir"]) {
  test(`Windows ${unavailableType} symlink failure stops before safety assertions`, () => {
    const error = Object.assign(new Error("A required privilege is not held by the client"), { code: "EPERM" });

    assert.throws(
      () =>
        verifyWindowsSymlinkCapability({
          platform: "win32",
          probeSymlink: (type) => {
            if (type === unavailableType) throw error;
          },
        }),
      (failure) => {
        assert.match(failure.message, /Windows symlink capability preflight failed/);
        assert.match(failure.message, new RegExp(`${unavailableType} symlink`));
        assert.match(failure.message, /Full Windows safety sign-off is incomplete/);
        assert.match(failure.message, /linked-path safety assertions were not run, passed, or skipped/);
        assert.match(failure.message, /Developer Mode or an elevated shell/);
        assert.match(failure.message, /EPERM/);
        return true;
      },
    );
  });
}
