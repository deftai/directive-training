import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function verifyEvidence(root = process.cwd()) {
  const evidenceRoot = join(dirname(resolve(root)), "evidence");
  const prePrPath = join(evidenceRoot, "pre-pr.json");
  assert.ok(existsSync(prePrPath), "pre-PR review evidence is missing; diagnose this aggregate failure before changing product code");
  const prePr = readJson(prePrPath);
  assert.equal(prePr.finalStatus, "FINDING_RECORDED", "pre-PR review must record the simulated finding");
  assert.equal(prePr.diffUnchanged, true, "pre-PR review must not mutate the product diff");
  assert.deepEqual(prePr.findings.map(({ id, severity }) => ({ id, severity })), [
    { id: "CAP-P1-001", severity: "P1" },
  ], "pre-PR review must classify the complete simulated finding set");

  const resolutionPath = join(evidenceRoot, "review-resolution.json");
  assert.ok(existsSync(resolutionPath), "simulated review resolution evidence is missing");
  const resolution = readJson(resolutionPath);
  assert.equal(resolution.finalStatus, "PASS", "simulated review resolution must pass");
  assert.equal(resolution.findingsResolved, 1, "exactly one P1 finding must be resolved");
  assert.equal(resolution.currentHeadReview, "CLEAN", "current product state must be re-reviewed after the fix");
  return { prePr, resolution };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    verifyEvidence();
    console.log("capstone review evidence: complete");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
