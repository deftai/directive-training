function validateItems(items) {
  if (!Array.isArray(items)) throw new TypeError("items must be an array of work items");
  for (const item of items) {
    if (!item || !/^WI-\d{3}$/.test(item.id)) throw new TypeError("work-item id must use WI-NNN");
    if (typeof item.title !== "string" || item.title.trim() === "") throw new TypeError("work-item title must be nonempty");
    if (!["open", "done"].includes(item.status)) throw new TypeError("work-item status must be open or done");
  }
}

/** Add behavior is the learner's test-first capstone implementation. */
export function addWorkItem() {
  throw new Error("addWorkItem is not implemented; use the supplied focused test as the contract");
}

/** Completion behavior is the learner's test-first capstone implementation. */
export function completeWorkItem() {
  throw new Error("completeWorkItem is not implemented; use the supplied focused test as the contract");
}

export function summarizeWorkItems(items) {
  validateItems(items);
  return {
    total: items.length,
    open: items.filter((item) => item.status === "open").length,
    done: items.filter((item) => item.status === "done").length,
  };
}
