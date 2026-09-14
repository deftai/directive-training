import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

/** Summarize one fictional numeric sample. Module 10 adds average behavior test-first. */
export function summarize(values) {
  if (!Array.isArray(values) || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError("values must be an array of finite numbers");
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return { count: values.length, total };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const values = process.argv.slice(2).map(Number);
  console.log(JSON.stringify(summarize(values)));
}
