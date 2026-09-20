// Shared assertion for the Modules 2-3 platform proofs: the pin-matched Lab 2 `directive
// doctor --full` run must emit exactly one warning, and that warning must be the
// `canonical-vendored-npm-signpost` provenance row (deftai/directive-training#19).
//
// Identity, not presence. An earlier revision only required the check id to appear somewhere
// in the output and separately required the summary to report one warning. A run where the
// signpost appeared in a passing or informational row while a different check emitted the
// sole warning satisfied both halves. This checker binds the id to an actual warning row and
// rejects any other warning identity.
//
// The warning marker (the leading severity glyph) is derived from the summary row rather than
// written here as a literal, so this file stays ASCII-only and no console or YAML encoding
// step can break the matcher on the Windows PowerShell lane.

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const EXPECTED_WARNING_IDS = ["canonical-vendored-npm-signpost"];

const ANSI = /\u001b\[[0-9;]*m/g;
const SUMMARY = /^(.*?)System check completed with (\d+) warning/;
const CHECK_ID = /^([A-Za-z0-9][A-Za-z0-9._-]*):\s/;

/**
 * @param {string} rawText captured `directive doctor --full` output
 * @param {string[]} expectedWarningIds the complete expected warning identity set
 * @returns {string[]} problems; empty means the warning set matched exactly
 */
export function checkDoctorWarningSet(rawText, expectedWarningIds = EXPECTED_WARNING_IDS) {
  const text = rawText.replace(ANSI, "").replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  const problems = [];

  // The pinned 0.119.5 engine cannot emit this row; seeing it means the dead string was
  // reintroduced somewhere upstream of the proof.
  if (/Missing directory: *`?xbrief\//.test(text)) {
    problems.push("doctor emitted the retired xbrief false negative");
  }

  const summaryIndexes = lines.flatMap((line, index) => (SUMMARY.test(line) ? [index] : []));
  if (summaryIndexes.length !== 1) {
    problems.push(`expected exactly one doctor summary row, got ${summaryIndexes.length}`);
    return problems;
  }

  const summaryIndex = summaryIndexes[0];
  const summary = lines[summaryIndex].match(SUMMARY);
  const reportedCount = Number(summary[2]);
  if (reportedCount !== expectedWarningIds.length) {
    problems.push(
      `expected the summary to report ${expectedWarningIds.length} warning(s), got ${reportedCount}`,
    );
  }

  // The summary row is itself a warning row, so its own severity prefix is the marker every
  // other warning row carries -- whatever byte sequence the host encoded that glyph as.
  const marker = summary[1];
  const isWarningRow = marker.trim().length > 0
    ? (line, index) => index !== summaryIndex && line.startsWith(marker)
    : (line, index) => index !== summaryIndex && CHECK_ID.test(line);
  if (marker.trim().length === 0) {
    problems.push("summary row carried no severity marker; falling back to check-id row shape");
  }

  const warningRows = lines.filter((line, index) => isWarningRow(line, index));
  const warningIds = warningRows.map((line) => {
    const remainder = line.slice(marker.length).trim();
    const identified = remainder.match(CHECK_ID);
    return identified ? identified[1] : remainder.slice(0, 80);
  });

  const observed = [...warningIds].sort();
  const expected = [...expectedWarningIds].sort();
  if (observed.length !== expected.length || observed.some((id, index) => id !== expected[index])) {
    problems.push(
      `expected warning identities ${JSON.stringify(expected)}, got ${JSON.stringify(observed)}`,
    );
  }

  if (!/Project-lifecycle: valid at /.test(text)) {
    problems.push("doctor did not report a valid project-lifecycle directory");
  }

  return problems;
}

const invokedDirectly = Boolean(process.argv[1]) && pathToFileURL(process.argv[1]).href === import.meta.url;
if (invokedDirectly) {
  const path = process.argv[2];
  if (!path) {
    console.error("usage: node scripts/assert-doctor-warning-set.mjs <captured-doctor-output>");
    process.exit(2);
  }
  const problems = checkDoctorWarningSet(readFileSync(path, "utf8"));
  if (problems.length) {
    for (const problem of problems) console.error(problem);
    process.exit(2);
  }
  console.log(`doctor warning set verified: exactly ${EXPECTED_WARNING_IDS.join(", ")}`);
}
