import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const WINDOWS_SYMLINK_CAPABILITY_CODE = "ERR_WINDOWS_SYMLINK_CAPABILITY";

class WindowsSymlinkCapabilityFailure extends Error {
  constructor(type, cause) {
    super(`${type} symlink creation is unavailable`, { cause });
    this.name = "WindowsSymlinkCapabilityFailure";
    this.code = WINDOWS_SYMLINK_CAPABILITY_CODE;
  }
}

const isWindowsPrivilegeFailure = (error) =>
  error instanceof Error && error.code === "EPERM";

/**
 * Distinguish an expected Windows symlink privilege boundary from probe infrastructure errors.
 *
 * @param {unknown} error
 * @returns {boolean}
 */
export function isWindowsSymlinkCapabilityUnavailable(error) {
  const seen = new Set();
  let current = error;
  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    if (current.code === WINDOWS_SYMLINK_CAPABILITY_CODE) return true;
    current = current.cause;
  }
  return false;
}

/**
 * Verify the Windows capabilities required by linked-path safety tests.
 *
 * @param {{ platform?: string, probeSymlink?: (type: "file" | "dir") => void }} [options]
 * @returns {{ required: boolean, checked: Array<"file" | "dir"> }}
 * @throws {Error} When Windows cannot create either required symlink type.
 */
export function verifyWindowsSymlinkCapability({
  platform = process.platform,
  probeSymlink = probeNativeSymlink,
} = {}) {
  if (platform !== "win32") return { required: false, checked: [] };

  const checked = [];
  for (const type of ["file", "dir"]) {
    try {
      probeSymlink(type);
      checked.push(type);
    } catch (error) {
      // A supplied probe is a unit-test seam for the symlink operation itself. The native
      // probe tags only an EPERM thrown by symlinkSync, so temp-directory, file-I/O, and
      // cleanup failures remain ordinary test failures even when their own code is EPERM.
      const capabilityFailure = error instanceof WindowsSymlinkCapabilityFailure
        ? error
        : probeSymlink !== probeNativeSymlink && isWindowsPrivilegeFailure(error)
          ? new WindowsSymlinkCapabilityFailure(type, error)
          : null;
      if (!capabilityFailure) throw error;

      const cause = capabilityFailure.cause;
      const errorCode = cause instanceof Error ? (cause.code ?? cause.name) : "Error";
      const errorMessage = cause instanceof Error ? cause.message : String(cause);
      const detail = errorMessage.startsWith(`${errorCode}: `)
        ? errorMessage
        : `${errorCode}: ${errorMessage}`;
      throw new Error(
        `Windows symlink capability preflight failed: ${type} symlink creation is unavailable (${detail}). ` +
          "Full Windows safety sign-off is incomplete; linked-path safety assertions were not run, passed, or skipped. " +
          "Re-run from an operator-approved symlink-capable session, such as Developer Mode or an elevated shell.",
        { cause: capabilityFailure },
      );
    }
  }

  return { required: true, checked };
}

/** @param {"file" | "dir"} type */
function probeNativeSymlink(type) {
  const root = mkdtempSync(join(tmpdir(), "3ci-symlink-preflight-"));
  try {
    const target = join(root, `${type}-target`);
    const link = join(root, `${type}-link`);
    if (type === "file") writeFileSync(target, "symlink capability probe\n");
    else mkdirSync(target);
    try {
      symlinkSync(target, link, type);
    } catch (error) {
      if (isWindowsPrivilegeFailure(error)) {
        throw new WindowsSymlinkCapabilityFailure(type, error);
      }
      throw error;
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    verifyWindowsSymlinkCapability();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
