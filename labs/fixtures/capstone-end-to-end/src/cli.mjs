import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { addWorkItem, completeWorkItem, summarizeWorkItems } from "./work-items.mjs";

const usage = "Use: add <title> [items-json] | complete <WI-NNN> [items-json] | summary [items-json] | check";

function parseItems(value = "[]") {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new TypeError("items-json must be valid JSON");
  }
  if (!Array.isArray(parsed)) throw new TypeError("items-json must contain an array");
  return parsed;
}

function checkBehavior() {
  const added = addWorkItem(addWorkItem([], "Orient"), "Implement");
  return summarizeWorkItems(completeWorkItem(added, "WI-001"));
}

export function main(args = process.argv.slice(2)) {
  const [verb, value, itemsJson] = args;
  if (verb === "check" && args.length === 1) return checkBehavior();
  if (verb === "add" && value && args.length <= 3) return addWorkItem(parseItems(itemsJson), value);
  if (verb === "complete" && value && args.length <= 3) return completeWorkItem(parseItems(itemsJson), value);
  if (verb === "summary" && args.length <= 2) return summarizeWorkItems(parseItems(value));
  throw new Error(usage);
}

export function isDirectExecution(entryPath = process.argv[1], moduleUrl = import.meta.url) {
  return Boolean(entryPath) && pathToFileURL(resolve(entryPath)).href === moduleUrl;
}

export function runCli(
  args = process.argv.slice(2),
  { stdout = console.log, stderr = console.error } = {},
) {
  try {
    stdout(JSON.stringify(main(args)));
    return 0;
  } catch (error) {
    stderr("Work-items CLI stopped: " + error.message);
    return 1;
  }
}

if (isDirectExecution()) process.exitCode = runCli();
