import assert from "node:assert/strict";
import { test } from "node:test";
import { addWorkItem, completeWorkItem, summarizeWorkItems } from "../src/work-items.mjs";

test("adds a work item without mutating the existing collection", () => {
  const existing = [{ id: "WI-002", title: "Review onboarding", status: "open" }];
  const result = addWorkItem(existing, "Capture capstone evidence");

  assert.deepEqual(existing, [{ id: "WI-002", title: "Review onboarding", status: "open" }]);
  assert.deepEqual(result, [
    { id: "WI-002", title: "Review onboarding", status: "open" },
    { id: "WI-003", title: "Capture capstone evidence", status: "open" },
  ]);
});

test("completes one named work item without mutating its input", () => {
  const existing = [
    { id: "WI-001", title: "Orient to the repository", status: "open" },
    { id: "WI-002", title: "Run focused checks", status: "open" },
  ];
  const result = completeWorkItem(existing, "WI-002");

  assert.equal(existing[1].status, "open");
  assert.deepEqual(result, [
    { id: "WI-001", title: "Orient to the repository", status: "open" },
    { id: "WI-002", title: "Run focused checks", status: "done" },
  ]);
});

test("summarizes open and completed work", () => {
  assert.deepEqual(summarizeWorkItems([
    { id: "WI-001", title: "Orient", status: "done" },
    { id: "WI-002", title: "Implement", status: "open" },
    { id: "WI-003", title: "Verify", status: "open" },
  ]), { total: 3, open: 2, done: 1 });
  assert.deepEqual(summarizeWorkItems([]), { total: 0, open: 0, done: 0 });
});

test("rejects malformed collections, titles, identifiers, and missing work items", () => {
  assert.throws(() => addWorkItem("not-an-array", "Evidence"), /array of work items/);
  assert.throws(() => addWorkItem([], "   "), /nonempty/);
  assert.throws(() => completeWorkItem([], "bad-id"), /WI-NNN/);
  assert.throws(() => completeWorkItem([], "WI-001"), /not found/);
  assert.throws(() => summarizeWorkItems([{ id: "WI-001", title: "Bad", status: "unknown" }]), /open or done/);
});

test("preserves 50 ordinary fictional work-item inputs", () => {
  let items = [];
  for (let index = 1; index <= 50; index += 1) {
    items = addWorkItem(items, `Fictional work item ${index}`);
    assert.equal(items.at(-1).id, `WI-${String(index).padStart(3, "0")}`);
  }
  assert.deepEqual(summarizeWorkItems(items), { total: 50, open: 50, done: 0 });
});
