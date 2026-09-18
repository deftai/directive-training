import assert from "node:assert/strict";
import { test } from "node:test";
import { greeting } from "../src/greeting.mjs";

test("greets a named teammate", () => {
  assert.equal(greeting("Ada"), "Hello, Ada!");
});

test("uses the teammate fallback for missing or blank input", () => {
  assert.equal(greeting(), "Hello, teammate!");
  assert.equal(greeting("   "), "Hello, teammate!");
});

test("rejects a non-string name", () => {
  assert.throws(() => greeting(42), /name must be a string/);
});

test("preserves 50 ordinary fictional names", () => {
  for (let index = 1; index <= 50; index += 1) {
    assert.equal(greeting(`Teammate ${index}`), `Hello, Teammate ${index}!`);
  }
});
