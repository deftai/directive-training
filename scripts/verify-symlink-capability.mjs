import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

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
      const errorCode = error instanceof Error ? (error.code ?? error.name) : "Error";
      const errorMessage = error instanceof Error ? error.message : String(error);
      const detail = errorMessage.startsWith(`${errorCode}: `)
        ? errorMessage
        : `${errorCode}: ${errorMessage}`;
      throw new Error(
        `Windows symlink capability preflight failed: ${type} symlink creation is unavailable (${detail}). ` +
          "Full Windows safety sign-off is incomplete; linked-path safety assertions were not run, passed, or skipped. " +
          "Re-run from an operator-approved symlink-capable session, such as Developer Mode or an elevated shell.",
        { cause: error },
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
    symlinkSync(target, link, type);
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
