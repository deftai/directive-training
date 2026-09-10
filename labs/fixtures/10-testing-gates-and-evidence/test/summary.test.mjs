import assert from "node:assert/strict";
import { test } from "node:test";
import { summarize } from "../src/summary.mjs";

test("reports count and total", () => {
  const ordinary = summarize([2, 4, 6]);
  assert.equal(ordinary.count, 3);
  assert.equal(ordinary.total, 12);
  const empty = summarize([]);
  assert.equal(empty.count, 0);
  assert.equal(empty.total, 0);
});

test("rejects invalid input", () => {
  assert.throws(() => summarize("2,4,6"), /array of finite numbers/);
  assert.throws(() => summarize([2, Number.NaN]), /array of finite numbers/);
});

test("preserves 50 ordinary fictional samples", () => {
  for (let index = 1; index <= 50; index += 1) {
    const result = summarize([index, index + 2]);
    assert.equal(result.count, 2);
    assert.equal(result.total, index * 2 + 2);
  }
});

// Add the average behavior test here during the red step.
