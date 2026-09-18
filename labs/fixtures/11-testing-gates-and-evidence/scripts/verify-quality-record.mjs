import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const expectedQualityRecord = {
  schema: "3ci.training.module11.quality-record.v1",
  status: "COMPLETE",
  evidence: {
    red: "EXPECTED_FAILURE",
    green: "PASS",
    refactor: "PASS",
    literalAcceptance: "PASS",
    forwardCoverage: "PASS",
    firstFailingSubcheck: "quality:record",
    repair: "quality-record.json only",
    gateDefinitionsUnchanged: true,
  },
};

export function verifyQualityRecord(root = process.cwd()) {
  const record = JSON.parse(readFileSync(resolve(root, "quality-record.json"), "utf8"));
  assert.equal(record.status, "COMPLETE", "quality record is incomplete: expected status COMPLETE");
  assert.deepEqual(record, expectedQualityRecord, "quality record does not match the observed Module 11 evidence");
  return record;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    verifyQualityRecord();
    console.log("quality record: complete");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
