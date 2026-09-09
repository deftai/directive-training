import assert from "node:assert/strict";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const module4 = "curriculum/modules/04-xbrief-as-durable-state.md";
const module5 = "curriculum/modules/05-sources-versus-projections.md";
const lab5 = "labs/05-projection-drift-recovery.md";
const solution4 = "solutions/module-04-xbrief-as-durable-state.md";
const solution5 = "solutions/lab-05-projection-drift-recovery.md";
export const moduleHeadings = Object.freeze(["Module record", "Learning outcomes", "Starting-state check", "Why this matters", "Terminology", "Mental model", "Guided explanation", "Walkthrough", "Exercise", "Completion evidence", "Progressive hints", "Expected failures and recovery", "Common misconceptions", "Self-assessment", "Explained solution", "Navigation", "Official sources"]);
const labHeadings = ["Lab record", "Goal and done condition", "Fictional scenario", "Environment and starting-state check", "Safety boundary", "Starting checkpoint", "Tasks", "Checkpoints", "Literal acceptance commands", "Evidence bundle", "Progressive hints", "Expected failures and recovery", "Reset to start", "Cleanup", "Explained solution", "Done statement"];
export const solutionHeadings = Object.freeze(["Solution record", "Before you use this solution", "Result summary", "Outcome map", "Reasoning", "Worked approach", "Acceptance evidence", "Compare with your attempt", "Valid alternatives", "Expected failures and recovery", "Misconceptions exposed by this exercise", "Retry plan", "Reset and cleanup", "Sources", "Continue"]);
const headingContracts = new Map([[module4, moduleHeadings], [module5, moduleHeadings], [lab5, labHeadings], [solution4, solutionHeadings], [solution5, solutionHeadings]]);
const requiredFiles = [...headingContracts.keys(), "curriculum/README.md", "references/SOURCE-NOTES.md", "package.json"];
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Parse fences linewise so headings and links shown as examples are not prose.
export function markdownParts(content) {
  const prose = [];
  const blocks = [];
  let fence;
  for (const line of content.split(/\r?\n/)) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (!fence && marker) {
      fence = { marker: marker[1], language: marker[2].trim().toLowerCase(), lines: [] };
    } else if (fence && marker && marker[1][0] === fence.marker[0] && marker[1].length >= fence.marker.length && !marker[2].trim()) {
      blocks.push({ language: fence.language, content: fence.lines.join("\n") });
      fence = undefined;
    } else if (fence) {
      fence.lines.push(line);
    } else {
      prose.push(line);
    }
  }
  assert.ok(!fence, "unclosed Markdown code fence");
  return { prose: prose.join("\n"), blocks };
}

export function section(prose, heading) {
  const headings = [...prose.matchAll(/^(#{2,4}) (.+?)[ \t]*#*[ \t]*$/gm)];
  const index = headings.findIndex((match) => match[2] === heading);
  assert.ok(index >= 0, `missing heading: ${heading}`);
  const start = headings[index];
  const end = headings.slice(index + 1).find((match) => match[1].length <= start[1].length);
  return prose.slice(start.index + start[0].length, end?.index ?? prose.length);
}

function headingSlugs(content) {
  const used = new Set();
  for (const match of markdownParts(content).prose.matchAll(/^#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/gm)) {
    const base = match[1].toLowerCase().replace(/[`*]/g, "").replace(/[^\p{L}\p{N}\s_-]/gu, "").trim().replace(/\s/g, "-");
    let slug = base;
    let suffix = 0;
    while (used.has(slug)) slug = `${base}-${++suffix}`;
    used.add(slug);
  }
  return used;
}

export function verifyLinks(root, path, prose) {
  const realRoot = realpathSync(root);
  const normalizeId = (id) => id.trim().replace(/\s+/g, " ").toLowerCase();
  const destinationPattern = /^(?:<([^>]+)>|(\S+?))(?:\s+["'][\s\S]*["'])?$/;
  const verify = (raw) => {
    const parsed = raw.trim().match(destinationPattern);
    assert.ok(parsed, `${path} has a malformed local link: ${raw}`);
    const destination = parsed[1] ?? parsed[2];
    if (/^[a-z][a-z\d+.-]*:/i.test(destination)) return;
    assert.ok(!destination.startsWith("//"), `${path} has a local link outside the repository: ${destination}`);
    const hash = destination.indexOf("#");
    const encodedPath = hash < 0 ? destination : destination.slice(0, hash);
    let targetPath;
    let fragment;
    try {
      targetPath = decodeURIComponent(encodedPath);
      fragment = hash < 0 ? "" : decodeURIComponent(destination.slice(hash + 1));
    } catch {
      assert.fail(`${path} has a malformed local link: ${destination}`);
    }
    const target = resolve(root, dirname(path), targetPath || path.split(/[\\/]/).at(-1));
    assert.ok(existsSync(target), `${path} has a broken local link: ${destination}`);
    const realTarget = realpathSync(target);
    const fromRoot = relative(realRoot, realTarget);
    assert.ok(fromRoot !== ".." && !fromRoot.startsWith(".." + sep) && !isAbsolute(fromRoot), `${path} has a local link outside the repository: ${destination}`);
    if (fragment && statSync(realTarget).isFile()) {
      assert.ok(headingSlugs(readFileSync(realTarget, "utf8")).has(fragment), `${path} has a broken local heading link: ${destination}`);
    }
  };
  const definitions = new Map();
  const definitionPattern = /^ {0,3}\[([^\]\n]+)\]:[ \t]*(.+)$/gm;
  for (const match of prose.matchAll(definitionPattern)) {
    const id = normalizeId(match[1]);
    assert.ok(!definitions.has(id), `${path} has a duplicate reference definition: ${id}`);
    definitions.set(id, match[2]);
    verify(match[2]);
  }
  const withoutDefinitions = prose.replace(definitionPattern, "");
  for (const match of withoutDefinitions.matchAll(/\[[^\]\n]*\]\((<[^>]+>|[^)]+)\s*\)/g)) verify(match[1]);
  for (const match of withoutDefinitions.matchAll(/\[([^\]\n]+)\]\[([^\]\n]*)\]/g)) {
    const id = normalizeId(match[2] || match[1]);
    assert.ok(definitions.has(id), `${path} uses an undefined reference link: ${id}`);
  }
}

export function courseModuleRow(course, moduleNumber) {
  const padded = String(moduleNumber).padStart(2, "0");
  const numericId = new RegExp(`^0?${moduleNumber}$`);
  const moduleLabel = new RegExp(`\\bModule\\s+0?${moduleNumber}\\b`, "i");
  const modulePath = new RegExp(`\\b${padded}-[^\\s|)]*\\.md\\b`, "i");
  const matches = course.split(/\r?\n/).filter((line) => {
    if (!/^\s*\|/.test(line)) return false;
    const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
    const identity = cells.slice(0, 2).join(" ");
    return numericId.test(cells[0] ?? "") || moduleLabel.test(identity) || modulePath.test(identity);
  });
  assert.equal(matches.length, 1, `course map must contain exactly one Module ${moduleNumber} row`);
  return matches[0];
}

const forbiddenCommand = /\b(?:git\s+(?:push\b|remote\s+(?:add|remove|rename|set-url|prune|update)\b|reset\s+--hard\b|clean\b|checkout\s+--(?:\s|$)|branch\s+-D\b)|gh\s+(?!--version(?:\s|$))|npm\s+publish\b|(?:directive|deft)\s+(?:deploy|publish|release)\b|rm\s+-[\w-]*r[\w-]*\b|Remove-Item\b|(?:del|rmdir)\s+\/s\b|(?:curl|wget|Invoke-WebRequest|Invoke-RestMethod)\b)/i;

/**
 * Read-only content check for Modules 4–5. Throws AssertionError (or a filesystem/
 * JSON parse error) on a failed contract; never executes commands from Markdown.
 * @param {string} root Absolute or relative path to the curriculum repository.
 * @returns {{artifactCount: number}} Number of required artifacts checked.
 */
export function verifyModules45(root = fileURLToPath(new URL("../", import.meta.url))) {
  assert.equal(typeof root, "string", "repository root must be a path string");
  const content = new Map();
  for (const path of requiredFiles) {
    const absolute = resolve(root, path);
    assert.ok(existsSync(absolute) && statSync(absolute).isFile(), `missing required artifact: ${path}`);
    const body = readFileSync(absolute, "utf8");
    assert.ok(body.trim(), `required artifact is empty: ${path}`);
    content.set(path, body);
  }
  const parsed = new Map();
  for (const [path, headings] of headingContracts) {
    const body = content.get(path);
    assert.doesNotMatch(body, /\{\{[^}]+\}\}|\b(?:TODO|TBD|FIXME)\b|Authoring template/i, `${path} contains an unfinished author marker`);
    const parts = markdownParts(body);
    parsed.set(path, parts);
    for (const heading of headings) {
      assert.match(parts.prose, new RegExp(`^## ${escapeRegExp(heading)}\\s*$`, "m"), `${path} is missing heading: ${heading}`);
      assert.ok(section(parts.prose, heading).trim(), `${path} has an empty section: ${heading}`);
    }
    const baseline = parts.prose.match(/^\| Directive baseline\s*\|([^\n]+)$/m)?.[1];
    assert.ok(baseline?.includes("0.112.0"), `${path} must declare the exact Directive 0.112.0 baseline`);
    assert.deepEqual([...new Set(baseline.match(/\b\d+\.\d+\.\d+\b/g))], ["0.112.0"], `${path} contains a stale baseline version`);
    assert.doesNotMatch(body, /"(?:xBRIEFInfo|vBRIEFInfo)"\s*:\s*\{[^}]*"version"\s*:\s*"0\.6"/, `${path} teaches a legacy xBRIEF write envelope`);
    for (const label of ["Directive behavior", "3Ci policy", "Course guidance"]) {
      assert.ok(parts.prose.includes(`[${label}]`), `${path} is missing claim label: ${label}`);
    }
    for (const block of parts.blocks.filter(({ language }) => /^(?:sh|shell|bash|zsh|powershell|pwsh|console)$/.test(language))) {
      const commands = block.content.split("\n").filter((line) => !/^\s*#/.test(line)).join("\n");
      assert.doesNotMatch(commands, forbiddenCommand, `${path} contains a forbidden executable remote/publish/destructive command`);
    }
    verifyLinks(root, path, parts.prose);
  }
  for (const [path, prefix, count, sections] of [
    [module4, "O4", 4, ["Learning outcomes", "Exercise acceptance", "Completion evidence"]],
    [module5, "O5", 3, ["Learning outcomes", "Exercise acceptance", "Completion evidence"]],
    [lab5, "O5", 3, ["Literal acceptance commands"]],
    [solution4, "O4", 4, ["Outcome map", "Acceptance evidence"]],
    [solution5, "O5", 3, ["Outcome map", "Acceptance evidence"]],
  ]) {
    for (const heading of sections) {
      const body = section(parsed.get(path).prose, heading);
      for (let index = 1; index <= count; index++) {
        assert.match(body, new RegExp(`\\b${prefix}\\.${index}\\b`), `${path} ${heading} is missing ${prefix}.${index}`);
      }
    }
  }
  const durable = content.get(module4);
  for (const concept of ["PROJECT-DEFINITION.xbrief.json", "specification.xbrief.json", "scope", "plan.xbrief.json", "continue.xbrief.json", "proposed/", "pending/", "active/", "completed/", "cancelled/", "chat"]) {
    assert.ok(durable.toLowerCase().includes(concept.toLowerCase()), `Module 4 is missing artifact/lifecycle concept: ${concept}`);
  }
  assert.match(durable, /xBRIEF[^\n]{0,20}\b0\.8\b/, "Module 4 must teach xBRIEF 0.8");
  for (const concept of ["plan.architecture.codeStructure", ".planning/codebase/MAP.md"]) {
    assert.ok(content.get(module5).includes(concept), `Module 5 is missing source/projection artifact: ${concept}`);
  }
  const labCommands = parsed.get(lab5).blocks.filter(({ language }) => /^(?:sh|bash|zsh|powershell|pwsh)$/.test(language)).flatMap(({ content: block }) => block.split("\n"));
  for (const [command, label] of [["codebase:map", "renderer"], ["verify:codebase-map-fresh", "freshness"]]) {
    assert.ok(labCommands.some((line) => new RegExp(`(?:^|\\s)${command}(?:\\s|$)`).test(line) && !/--help\b/.test(line) && !/^\s*#/.test(line)), `Lab 5 must run a literal ${label} command, not help alone`);
  }
  assert.ok(labCommands.some((line) => /projection-lab\.mjs\s+verify-result\b/.test(line)), "Lab 5 must verify MAP existence and content as well as freshness");
  const proofNotes = content.get("references/SOURCE-NOTES.md");
  for (const platform of ["macos-zsh", "linux-bash", "windows-pwsh7"]) {
    const markers = [...proofNotes.matchAll(new RegExp(`lab05-platform-proof:${platform} status=(verified|candidate) date=(\\d{4}-\\d{2}-\\d{2}) evidence=([^\\s\x60]+)`, "g"))];
    assert.equal(markers.length, 1, `SOURCE-NOTES must contain exactly one Lab 5 proof marker for ${platform}`);
    assert.equal(markers[0][1], platform === "macos-zsh" ? "verified" : "candidate", `${platform}: native Lab 5 proof is bounded to macOS/zsh in this scope`);
    if (platform === "macos-zsh") assert.doesNotMatch(markers[0][3], /^(?:none|not-run|pending|unknown)$/, "Lab 5 macOS proof must cite actual evidence");
  }
  const platformRecord = section(parsed.get(lab5).prose, "Lab record");
  assert.match(platformRecord, /macOS[^\n]*zsh/i, "Lab 5 must identify its verified macOS/zsh path");
  for (const path of [lab5, solution5, module5]) {
    for (const line of parsed.get(path).prose.split("\n").filter((line) => /Linux|Windows/i.test(line))) {
      const noNegation = line.replace(/\b(?:not|never)\s+(?:yet\s+)?(?:verified|tested|learner-ready)\b/gi, "untested");
      assert.ok(!/\b(?:verified|learner-ready)\b/i.test(noNegation) || /\b(?:candidate|untested|unverified|not claimed)\b/i.test(noNegation), `${path} contains an unsupported native Lab 5 claim: ${line}`);
    }
  }
  assert.match(section(parsed.get(module4).prose, "Navigation"), /\]\(05-sources-versus-projections\.md(?:#[^)]*)?\)/, "Module 4 must navigate to Module 5");
  assert.match(section(parsed.get(module5).prose, "Navigation"), /\]\(06-creating-well-shaped-work\.md(?:#[^)]*)?\)/, "Module 5 must navigate to Module 6");
  const course = content.get("curriculum/README.md");
  for (const [number, filename] of [[4, "04-xbrief-as-durable-state.md"], [5, "05-sources-versus-projections.md"], [6, "06-creating-well-shaped-work.md"]]) {
    const row = course.split("\n").find((line) => line.includes(filename));
    assert.ok(row && !/\b(?:planned|not yet available)\b/i.test(row), `Module ${number} availability must identify the completed curriculum`);
  }
  const module7Row = courseModuleRow(course, 7);
  assert.match(module7Row, /\|\s*Planned\s*\|/i, "Module 7 must remain planned in its course-map row");
  assert.doesNotMatch(module7Row, /\b(?:learner-ready|available|running)\b/i, "Module 7 course-map row must remain planned, not available");
  verifyLinks(root, "curriculum/README.md", markdownParts(course).prose);
  const projectPackage = JSON.parse(content.get("package.json"));
  assert.equal(projectPackage.private, true, "the training package must remain private");
  assert.equal(projectPackage.devDependencies?.["@deftai/directive"], "0.112.0", "the training package must retain the exact Directive pin");
  return { artifactCount: requiredFiles.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { artifactCount } = verifyModules45(process.argv[2]);
  console.log(`Modules 4-5 content contract: ok (${artifactCount} artifacts, 0 missing)`);
}
