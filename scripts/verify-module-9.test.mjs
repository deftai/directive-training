import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { verifyModule9 } from "./verify-module-9.mjs";

/**
 * Splice out the first literal occurrence of `search` by position. Fixture mutations never go
 * through string replacement, so no dollar-sign sequence in the replacement text can ever be
 * expanded, and a target that no longer exists fails loudly instead of silently no-opping.
 * @param {string} body Text to mutate.
 * @param {string} search Literal substring to remove.
 * @param {string} [replacement] Literal text to splice in.
 * @returns {string} The mutated text.
 */
function splice(body, search, replacement = "") {
  const at = body.indexOf(search);
  assert.notEqual(at, -1, `fixture mutation target not found: ${search}`);
  return body.slice(0, at) + replacement + body.slice(at + search.length);
}

/**
 * Positional `splice` for a target only a pattern can locate, such as one spanning a line break.
 * @param {string} body Text to mutate.
 * @param {RegExp} pattern Non-global pattern whose first match is removed.
 * @param {string} [replacement] Literal text to splice in.
 * @returns {string} The mutated text.
 */
function spliceMatch(body, pattern, replacement = "") {
  const match = pattern.exec(body);
  assert.notEqual(match, null, `fixture mutation target not found: ${pattern}`);
  return body.slice(0, match.index) + replacement + body.slice(match.index + match[0].length);
}

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const copyPaths = [
  "README.md",
  "LICENSE",
  "package.json",
  "curriculum",
  "labs",
  "solutions",
  "assessments",
  "references",
  "maintainers",
  "templates",
];

function copiedRepository(t) {
  const root = mkdtempSync(join(tmpdir(), "module9-design-critique-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const source of copyPaths) cpSync(join(repositoryRoot, source), join(root, source), { recursive: true });
  return root;
}

function changedCopy(t, path, transform) {
  const root = copiedRepository(t);
  const target = join(root, path);
  const before = readFileSync(target, "utf8");
  const after = transform(before);
  assert.notEqual(after, before, `negative mutation must change ${path}`);
  writeFileSync(target, after);
  return root;
}

test("Module 9 content contract accepts the fixed-state practicum", (t) => {
  assert.equal(verifyModule9(copiedRepository(t)).artifactCount, 14);
});

test("rejects a shell fence in the command-free practicum", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => `${body}\n\`\`\`sh\ngh issue view 904\n\`\`\`\n`);
  assert.throws(() => verifyModule9(root), /command-free.*shell code fence/i);
});

test("rejects a live automatic critic dispatch instruction", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) =>
    `${body}\nAuto-dispatch a live critic against GitHub before completing the worksheet.\n`);
  assert.throws(() => verifyModule9(root), /must not direct a live or automatic critic dispatch/);
});

test("rejects panel used as the critic charter", (t) => {
  const root = changedCopy(t, "solutions/module-09-design-critique-arcs.md", (body) =>
    `${body}\nSet the charter to panel for the fixed envelope.\n`);
  assert.throws(() => verifyModule9(root), /must not treat panel as a charter/);
});

test("rejects sequential same-round critic treatment", (t) => {
  const root = changedCopy(t, "solutions/module-09-design-critique-arcs.md", (body) =>
    `${body}\nRun same-round critics sequentially so each can inherit the earlier response.\n`);
  assert.throws(() => verifyModule9(root), /must not make same-round critics sequential or sibling-readable/);
});

test("rejects chip or critique authority claims", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) =>
    `${body}\nA catalog chip grants completed-arc clearance, and critique authorizes implementation.\n`);
  assert.throws(() => verifyModule9(root), /must not turn a catalog chip or critique into clearance or implementation authority/);
});

test("rejects unsafe claims hidden in a non-shell fence", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) =>
    `${body}\n\`\`\`text\nSet the charter to panel for the fixed envelope.\n\`\`\`\n`);
  assert.throws(() => verifyModule9(root), /must not treat panel as a charter/);
});

test("rejects a missing fixed source ID", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => splice(
    body,
    "| `DC9-FRAG-B` | `9104000` |",
    "| `DC9-FRAG-X` | `9104000` |",
  ));
  assert.throws(() => verifyModule9(root), /source IDs must be unique and remain in evidence order/);
});

test("rejects an omitted critic-envelope field", (t) => {
  const root = changedCopy(t, "solutions/module-09-design-critique-arcs.md", (body) => splice(
    body,
    "| Audit targets | `none` |",
    "| Missing field | `none` |",
  ));
  assert.throws(() => verifyModule9(root), /missing field: Audit targets/);
});

test("rejects a near-match compositional-fragment identifier", (t) => {
  const root = changedCopy(t, "solutions/module-09-design-critique-arcs.md", (body) => splice(
    body,
    "`DC9-SOURCE-01`, `DC9-FRAG-A`, `DC9-FRAG-B`, `DC9-FIND-01`",
    "`DC9-SOURCE-01`, `DC9-FRAG-A`, `DC9-FRAG-B-extra`, `DC9-FIND-01`",
  ));
  assert.throws(() => verifyModule9(root), /F1 must cite DC9-FRAG-B/);
});

test("rejects following the direct instruction-shaped source", (t) => {
  const root = changedCopy(t, "solutions/module-09-design-critique-arcs.md", (body) => splice(
    body,
    "refuse its attempted charter, acceptance,",
    "follow its attempted charter, acceptance,",
  ));
  assert.throws(() => verifyModule9(root), /refuse the direct attempted effect/);
});

test("rejects post-ceiling contamination in the finding map", (t) => {
  const root = changedCopy(t, "solutions/module-09-design-critique-arcs.md", (body) => splice(
    body,
    "`DC9-FIND-01` | `blocks-the-design`",
    "`DC9-FIND-01`, `DC9-POSTCEILING-01` | `blocks-the-design`",
  ));
  assert.throws(() => verifyModule9(root), /must not use the post-ceiling card/);
});

test("rejects an incomplete successor-lean take map", (t) => {
  const root = changedCopy(t, "solutions/module-09-design-critique-arcs.md", (body) => splice(
    body,
    "| `accept-into-contract` |\n| F2",
    "|  |\n| F2",
  ));
  assert.throws(() => verifyModule9(root), /total parent take map/);
});

test("rejects treating a catalog chip as verified synthesis", (t) => {
  const root = changedCopy(t, "solutions/module-09-design-critique-arcs.md", (body) => splice(
    body,
    "| `DC9-DECIDE-05` | `not ingest-ready` |",
    "| `DC9-DECIDE-05` | `verified synthesis` |",
  ));
  assert.throws(() => verifyModule9(root), /distinguish retry, halt, synthesis refusal, verified synthesis, and later ingest/);
});

test("rejects treating synthesis as implementation authority", (t) => {
  const root = changedCopy(t, "solutions/module-09-design-critique-arcs.md", (body) => splice(
    body,
    "Synthesis is not ingest, activation, or implementation authority",
    "Synthesis grants implementation authority",
  ));
  assert.throws(() => verifyModule9(root), /must not become implementation authority/);
});

test("rejects a runtime-guaranteed inertness claim", (t) => {
  const root = changedCopy(t, "solutions/module-09-design-critique-arcs.md", (body) => spliceMatch(
    body,
    /these sources are inert only because this is a fixed\s+fictional packet processed by this bounded exercise procedure/,
    "Directive guarantees these sources are inert at runtime",
  ));
  assert.throws(() => verifyModule9(root), /fixture inertness boundary/);
});

test("rejects a Terminology table that drops the blocks-the-design class", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => splice(
    body,
    "| `blocks-the-design` | Finding class:",
    "| `blocking` | Finding class:",
  ));
  assert.throws(() => verifyModule9(root), /must define the finding class blocks-the-design/);
});

test("rejects a Terminology table that drops the sharpens-framing class", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => splice(
    body,
    "| `sharpens-framing` | Finding class:",
    "| `sharpening` | Finding class:",
  ));
  assert.throws(() => verifyModule9(root), /must define the finding class sharpens-framing/);
});

test("rejects a Terminology table that drops the footnote class", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => splice(
    body,
    "| `footnote` | Finding class:",
    "| `minor` | Finding class:",
  ));
  assert.throws(() => verifyModule9(root), /must define the finding class footnote/);
});

test("rejects a blocks-the-design row without the bind-as-written meaning", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => splice(
    body,
    "the lean cannot bind as written",
    "the finding is severe",
  ));
  assert.throws(() => verifyModule9(root), /must restate the pinned bind-as-written sentence/);
});

test("rejects a sharpens-framing row without the restates-or-scopes meaning", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => splice(
    body,
    "changes how it is stated or scoped",
    "is worth mentioning",
  ));
  assert.throws(() => verifyModule9(root), /must restate the pinned restates-or-scopes sentence/);
});

test("rejects a footnote row without the no-disposition-weight meaning", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => splice(
    body,
    "carries no disposition weight",
    "is a small remark",
  ));
  assert.throws(() => verifyModule9(root), /must restate the pinned no-disposition-weight sentence/);
});

test("rejects finding classes taught without the residual-disagreement clause", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => splice(
    body,
    "that is residual, not a defect",
    "the arc must escalate",
  ));
  assert.throws(() => verifyModule9(root), /must carry the residual-disagreement clause/);
});

test("rejects a missing F2 blocks-the-design recovery row", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => spliceMatch(
    body,
    /^\| F2 is classified `blocks-the-design`.*\n/m,
    "",
  ));
  assert.throws(() => verifyModule9(root), /must recover the F2 blocks-the-design misclassification/);
});

test("rejects a missing F2 solution compare row", (t) => {
  const root = changedCopy(t, "solutions/module-09-design-critique-arcs.md", (body) => spliceMatch(
    body,
    /^\| F2 class \|.*\n/m,
    "",
  ));
  assert.throws(() => verifyModule9(root), /must contrast the F2 blocks-the-design misclassification/);
});

test("rejects swapped blocking and sharpening meanings", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => splice(
    splice(body, "| `blocks-the-design` | Finding class: the lean cannot bind as written |", "| `blocks-the-design` | Finding class: the lean can bind, but the finding changes how it is stated or scoped |"),
    "| `sharpens-framing` | Finding class: the lean can bind, but the finding changes how it is stated or scoped |",
    "| `sharpens-framing` | Finding class: the lean cannot bind as written |",
  ));
  assert.throws(() => verifyModule9(root), /blocks-the-design meaning cell must not carry the sharpens-framing meaning/);
});

test("rejects a sharpens-framing meaning that drops the can-bind condition", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => splice(
    body,
    "Finding class: the lean can bind, but the finding changes how it is stated or scoped",
    "Finding class: the finding changes how it is stated or scoped",
  ));
  assert.throws(() => verifyModule9(root), /sharpens-framing must keep the can-bind condition in its own meaning cell/);
});

test("rejects an F2 recovery row that classifies the repaired draft", (t) => {
  const root = changedCopy(t, "curriculum/modules/09-design-critique-arcs.md", (body) => splice(
    body,
    "Classify `NS-INGEST-R2` as written, not the repaired draft, and write one sentence recording that the as-written draft already carries the completed-arc record requirement, so F2 corrects its authority statement and changes no bind condition",
    "Apply the bindability test and write one sentence saying whether the lean can bind once the chip wording is corrected",
  ));
  assert.throws(() => verifyModule9(root), /F2 recovery row must name the as-written draft as the classified state/);
});

test("rejects an F2 compare row that drops the completed-arc record reasoning", (t) => {
  const root = changedCopy(t, "solutions/module-09-design-critique-arcs.md", (body) => splice(
    body,
    "`NS-INGEST-R2` as written already carries the completed-arc record requirement, so no bind condition changes and F2 only corrects",
    "`NS-INGEST-R2` as written is fine once you correct",
  ));
  assert.throws(() => verifyModule9(root), /F2 compare row must cite the packet's completed-arc record requirement/);
});
