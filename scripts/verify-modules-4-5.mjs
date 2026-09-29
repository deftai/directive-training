import assert from "node:assert/strict";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { assertTeachingBaselinePin } from "./teaching-baseline.mjs";

const module4 = "curriculum/modules/04-xbrief-as-durable-state.md";
const module5 = "curriculum/modules/05-sources-versus-projections.md";
const lab5 = "labs/05-projection-drift-recovery.md";
const lab5Helper = "labs/fixtures/05-projection-drift-recovery/projection-lab.mjs";
const solution4 = "solutions/module-04-xbrief-as-durable-state.md";
const solution5 = "solutions/lab-05-projection-drift-recovery.md";
export const moduleHeadings = Object.freeze(["Module record", "Learning outcomes", "Starting-state check", "Why this matters", "Terminology", "Mental model", "Guided explanation", "Walkthrough", "Exercise", "Completion evidence", "Progressive hints", "Expected failures and recovery", "Common misconceptions", "Self-assessment", "Explained solution", "Navigation", "Official sources"]);
const labHeadings = ["Lab record", "Goal and done condition", "Fictional scenario", "Environment and starting-state check", "Safety boundary", "Starting checkpoint", "Tasks", "Checkpoints", "Literal acceptance commands", "Evidence bundle", "Progressive hints", "Expected failures and recovery", "Reset to start", "Cleanup", "Explained solution", "Done statement"];
export const solutionHeadings = Object.freeze(["Solution record", "Before you use this solution", "Result summary", "Outcome map", "Reasoning", "Worked approach", "Acceptance evidence", "Compare with your attempt", "Valid alternatives", "Expected failures and recovery", "Misconceptions exposed by this exercise", "Retry plan", "Reset and cleanup", "Sources", "Continue"]);
const headingContracts = new Map([[module4, moduleHeadings], [module5, moduleHeadings], [lab5, labHeadings], [solution4, solutionHeadings], [solution5, solutionHeadings]]);
const requiredFiles = [...headingContracts.keys(), lab5Helper, "README.md", "curriculum/README.md", "references/SOURCE-BASELINE.md", "references/SOURCE-NOTES.md", "package.json"];
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

function declaredFunction(source, name, label) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `${label} must define ${name}`);
  const signature = /\)\s*\{/.exec(source.slice(start));
  assert.ok(signature, `${label} has a malformed ${name} declaration`);
  const open = start + signature.index + signature[0].lastIndexOf("{");
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    else if (source[index] === "}" && --depth === 0) return source.slice(start, index + 1);
  }
  assert.fail(`${label} has an unterminated ${name} declaration`);
}

function rawHeadingSection(markdown, heading) {
  const normalized = markdown.replace(/\r\n?/g, "\n");
  const headings = [...normalized.matchAll(/^(#{2,4}) (.+?)[ \t]*#*[ \t]*$/gm)];
  const start = headings.find((match) => match[2] === heading);
  assert.ok(start, `missing heading: ${heading}`);
  const level = start[1].length;
  const end = headings.find((match) => match.index > start.index && match[1].length <= level);
  return normalized.slice(start.index + start[0].length, end?.index ?? normalized.length);
}

/** Enforce the common read-only-preview and exact-confirmed-apply helper boundary. */
export function assertReclaimHelperContract(helper, {
  label,
  archiveDirectoryName,
  archivePrefix,
  archivedVerifier = "verifyArchivedAttempt",
  previewNeedsMissingContainerGuard = true,
}) {
  const preview = declaredFunction(helper, "previewReclaim", label);
  const reclaim = declaredFunction(helper, "reclaimArchives", label);
  const archivedIdentity = declaredFunction(helper, archivedVerifier, label);
  const archive = declaredFunction(helper, "archiveAttempt", label);
  const reset = declaredFunction(helper, "resetAttempt", label);

  assert.match(helper, new RegExp(escapeRegExp(archiveDirectoryName)), `${label} is missing its exact archive class`);
  assert.match(preview, new RegExp(`${escapeRegExp(archivePrefix)}|startsWith\\(archivePrefix\\)`), `${label} preview must filter its exact archive prefix`);
  assert.doesNotMatch(preview, /\b(?:mkdirSync|mkdtempSync)\s*\(/, `${label} reclaim preview must create no directories`);
  if (previewNeedsMissingContainerGuard) {
    assert.match(preview, /if \(!existsSync\(archiveRoot\)\) return \[\];/, `${label} preview must return empty without creating its archive container`);
  }

  assert.match(helper, /\bisAbsolute\([^)]*\)[\s\S]{0,160}\bresolve\([^)]*\)\s*===/, `${label} reclaim must require absolute canonical targets`);
  assert.match(helper, /\bisSymbolicLink\(\)/, `${label} reclaim must reject symlinks`);
  assert.match(helper, /\b(?:realpathSync|canonicalPath)\s*\(/, `${label} reclaim must recheck canonical identity`);
  assert.match(archivedIdentity, /marker\.lab/, `${label} reclaim must verify the archive marker lab identity`);
  assert.match(archivedIdentity, /marker\.root/, `${label} reclaim must verify the archive marker root identity`);
  assert.match(archivedIdentity, /\["remote"\]/, `${label} reclaim must reject archived repositories with remotes`);
  assert.match(archivedIdentity, /\.git/, `${label} reclaim must verify the archived Git identity`);

  assert.match(reclaim, /assert\.equal\(confirmed,\s*true\b/, `${label} reclaim apply requires explicit confirmation`);
  assert.match(reclaim, /new Set\(previewReclaim\(/, `${label} reclaim apply must use a fresh preview`);
  assert.match(reclaim, /previewed\.has\(target\)/, `${label} reclaim apply must accept only exact previewed targets`);
  assert.match(reclaim, /\bisAbsolute\(target\)[\s\S]{0,100}\bresolve\(target\)\s*===\s*target/, `${label} reclaim apply must reject relative or noncanonical targets`);
  const revalidate = reclaim.lastIndexOf(`${archivedVerifier}(target`);
  const remove = reclaim.indexOf("rmSync(target");
  assert.ok(revalidate >= 0 && remove > revalidate, `${label} reclaim apply must revalidate immediately before deletion`);
  assert.equal((helper.match(/\brmSync\s*\(/g) ?? []).length, 1, `${label} may delete only inside its validated reclaim apply`);
  assert.equal((reclaim.match(/\brmSync\s*\(/g) ?? []).length, 1, `${label} validated reclaim apply must own the sole deletion`);

  assert.match(archive, /renameSync\(parent,\s*(?:destination|archiveTarget)\)/, `${label} archive must remain a same-volume rename`);
  const resetValidation = reset.indexOf(`${archivedVerifier}(`);
  const resetCreate = reset.indexOf("createAttempt(");
  assert.ok(resetValidation >= 0 && resetCreate > resetValidation, `${label} reset must validate the post-archive destination before fresh-attempt reset creation`);
  assert.match(helper, /(?:verb|args\[0\])\s*===\s*"reclaim"[\s\S]{0,160}previewReclaim\(/, `${label} CLI must expose read-only reclaim preview`);
  assert.match(helper, /"--confirm"[\s\S]{0,180}reclaimArchives\([^;]+confirmed:\s*true/, `${label} CLI must expose exact confirmed reclaim apply`);
}

/** Enforce the learner-visible ENOSPC stop and reclaim-before-archive-before-reset route. */
export function assertEnospcLabContract(lab, {
  label,
  archiveClass,
  replacementVerb = "reset",
}) {
  const prose = markdownParts(lab).prose;
  const expectedFailures = section(prose, "Expected failures and recovery");
  assert.match(expectedFailures, /ENOSPC[\s\S]{0,100}no space left on device/i, `${label} must name ENOSPC and no-space-left`);
  assert.match(expectedFailures, /environment stop/i, `${label} must classify ENOSPC as an environment stop`);
  assert.match(
    expectedFailures,
    /(?:(?:Do not retry|remain blocked)[\s\S]{0,180}\bcreate\b[\s\S]{0,80}\breset\b[\s\S]{0,80}Route A[\s\S]{0,140}\breclaim\b|archive-reclaim[\s\S]{0,120}\bcreate\b[\s\S]{0,80}\breset\b[\s\S]{0,80}Route A[\s\S]{0,100}remain blocked until capacity returns)/i,
    `${label} ENOSPC recovery must block create, reset, and Route A until reclaim`,
  );
  assert.match(lab, /current attempt(?: parent)?[\s\S]{0,100}one (?:fresh |fully installed )?reset attempt(?: parent)?[\s\S]{0,100}npm\s+extraction\s+slack/i, `${label} must teach the per-environment peak-space recipe`);
  assert.match(lab, /no universal\s+20 GB floor/i, `${label} must not turn the reported 20 GB into a universal floor`);

  const recovery = rawHeadingSection(lab, "Disk-full recovery");
  assert.ok(recovery.includes(archiveClass), `${label} must name its exact archive destination class`);
  assert.match(recovery, /read-only[\s\S]{0,600}creates no archive directory[\s\S]{0,120}zero\s+(?:writable|free)\s+space/i, `${label} reclaim preview must be read-only and zero-space safe`);
  assert.match(recovery, /^\s*node [^\n]*\breclaim\s*$/m, `${label} must show the read-only reclaim preview command`);
  assert.match(recovery, /^\s*[^\n]*node [^\n]*\breclaim --confirm [^\n]+$/m, `${label} must show exact confirmed reclaim apply`);
  const confirmed = recovery.indexOf("reclaim --confirm");
  const afterConfirmed = recovery.slice(confirmed);
  const archive = afterConfirmed.search(/\barchive\b/);
  const replace = afterConfirmed.search(new RegExp(`\\b${escapeRegExp(replacementVerb)}\\b`));
  assert.ok(confirmed >= 0 && archive > 0 && replace > archive, `${label} disk-full recovery must reclaim, then archive, then ${replacementVerb}`);
  assert.match(recovery, /same-volume[\s\x60]*archive[\s\x60]*rename|same-volume[\s\S]{0,40}rename/i, `${label} must preserve archive as a same-volume rename`);
  const normalizedRecovery = recovery.toLowerCase().replace(/\s+/g, " ");
  for (const unsafe of ["live attempt", "curriculum clone", "remote-bearing repository", "symlink", "identity mismatch"]) {
    assert.ok(normalizedRecovery.includes(unsafe), `${label} reclaim must reject ${unsafe}`);
  }
  assert.match(recovery, /(?:only the confirmed[\s\S]{0,80}archive[\s\S]{0,100}(?:contained|local\s+npm)\s+cache|confirmed archive[\s\S]{0,80}(?:contained|local\s+npm)\s+cache only)/i, `${label} reclaim must delete only the confirmed archive and its cache`);
  assert.match(recovery, /live[\s\S]{0,80}cache[\s\S]{0,100}isolated[\s\S]{0,100}untouched|live cache remains isolated and untouched|does not touch the live failed attempt or its\s+cache/i, `${label} reclaim must preserve the live isolated cache`);
  assert.match(recovery, /(?:Never use|Do not introduce) a shared npm\s+cache/i, `${label} must not introduce a shared npm cache`);
  assert.match(recovery, /(?:(?:Never use|do not treat)[\s\S]{0,100}empty launcher\s+director(?:y|ies)[\s\S]{0,80}(?:remedy|recovery|workaround)|empty launcher\s+director(?:y|ies)[\s\S]{0,80}(?:not|no)[\s\S]{0,80}(?:remedy|recovery|workaround))/i, `${label} must reject empty-launcher cleanup as the remedy`);
}

/** Enforce the shared three-class capacity and independent-recovery guidance. */
export function assertDiskCapacityGuideContract(courseMap, labsGuide) {
  assert.match(
    courseMap,
    /current attempt[\s\S]{0,100}one fresh reset attempt[\s\S]{0,100}npm\s+extraction\s+slack/i,
    "course map must teach the per-environment peak-space recipe",
  );
  assert.match(courseMap, /(?:no universal|not substitute a universal)\s+20 GB floor/i, "course map must not teach a universal 20 GB floor");
  assert.match(
    courseMap,
    /ENOSPC[\s\S]{0,80}no space left on device[\s\S]{0,100}environment stop[\s\S]{0,120}\bcreate\b[\s\S]{0,80}\breset\b[\s\S]{0,80}Route A[\s\S]{0,100}blocked[\s\S]{0,100}reclaim/i,
    "course map must block create, reset, and Route A during an ENOSPC environment stop until reclaim",
  );
  assert.match(courseMap, /Each attempt keeps its\s+own npm cache[\s\S]{0,80}shared cache is outside/i, "course map must require attempt-local npm caches");

  for (const archiveClass of [
    "3ci-directive-module-02-archive.<unique>",
    "3ci-directive-lab-archive/",
    "3ci-directive-capstone-archive/",
  ]) {
    assert.ok(labsGuide.includes(archiveClass), `lab environment guide is missing archive class: ${archiveClass}`);
  }
  assert.match(labsGuide, /A helper never crosses these classes/i, "lab environment guide must keep the three archive classes disjoint");

  const capacity = rawHeadingSection(labsGuide, "Disk capacity and ENOSPC recovery");
  assert.match(capacity, /representative successful run[\s\S]{0,120}fully installed current attempt[\s\S]{0,120}one fully installed reset attempt/i, "lab environment guide must size from representative installed attempts");
  assert.match(capacity, /Before a first run[\s\S]{0,120}estimate[\s\S]{0,180}representative successful\s+run[\s\S]{0,180}same\s+environment/i, "lab environment guide must distinguish first-run estimation from measured capacity");
  assert.match(capacity, /matching record[\s\S]{0,260}(?:version|package graph)[\s\S]{0,260}(?:measured terms|three terms)/i, "a first-run record must carry enough applicability evidence to be actionable");
  assert.match(capacity, /no matching record[\s\S]{0,260}approved bootstrap[\s\S]{0,260}monitor/i, "the first-run guide must supply a safe bootstrap path when no matching record exists");
  assert.match(capacity, /no matching record[\s\S]{0,500}no approved bootstrap[\s\S]{0,160}environment-blocked/i, "the first-run guide must stop when neither evidence path is available");
  assert.match(capacity, /if \(-not \(Test-Path -LiteralPath \$Path\)\) \{ throw /, "PowerShell capacity measurement must reject a missing tree instead of counting it as zero");
  assert.match(capacity, /current attempt \+ one reset attempt \+ npm extraction slack/i, "lab environment guide is missing the exact peak-space recipe");
  assert.match(capacity, /no universal\s+20 GB minimum/i, "lab environment guide must reject a universal 20 GB minimum");
  assert.match(capacity, /ENOSPC[\s\S]{0,80}no space left on device[\s\S]{0,100}environment stop/i, "lab environment guide must classify ENOSPC as an environment stop");
  assert.match(capacity, /Do not retry[\s\S]{0,100}\bcreate\b[\s\S]{0,80}\breset\b[\s\S]{0,80}Route A[\s\S]{0,180}reclaim/i, "lab environment guide must block allocation until reclaim");
  assert.match(capacity, /^node <helper> reclaim\s*$/m, "lab environment guide must show read-only reclaim preview");
  assert.match(capacity, /^node <helper> reclaim --confirm <exact-older-archive-path-printed-by-preview>\s*$/m, "lab environment guide must show exact confirmed reclaim apply");
  assert.match(capacity, /read-only[\s\S]{0,80}creates no archive directory[\s\S]{0,120}no writable space/i, "lab environment guide must make preview zero-space safe");
  assert.match(capacity, /confirm only exact older archive destinations[\s\S]{0,180}revalidates immediately before deletion/i, "lab environment guide must constrain confirmed deletion to a fresh preview");
  const normalizedCapacity = capacity.toLowerCase().replace(/\s+/g, " ");
  for (const unsafe of ["live attempt", "curriculum clone", "repository with a remote", "symlink", "identity mismatch", "relative path", "another archive class"]) {
    assert.ok(normalizedCapacity.includes(unsafe), `lab environment guide reclaim must reject ${unsafe}`);
  }
  assert.match(capacity, /After capacity returns[\s\S]{0,120}archive the live failed parent[\s\S]{0,120}(?:reset|create)[\s\S]{0,80}fresh attempt/i, "lab environment guide must reclaim, archive, then replace the attempt");
  assert.match(capacity, /live failed parent[\s\S]{0,120}\bcreate\b[\s\S]{0,100}printed[\s\S]{0,80}repository root/i, "lab environment guide must identify an archivable failed parent by the printed create root");
  assert.match(capacity, /\bcreate\b[\s\S]{0,80}does not run package installation[\s\S]{0,140}later\s+`install`[\s\S]{0,180}package tree is partial/i, "lab environment guide must distinguish a partial install from create");
  assert.match(capacity, /create`? itself stops before[\s\S]{0,80}returning a root[\s\S]{0,220}reclaim a valid older archive[\s\S]{0,140}rerun[\s\S]{0,80}\bcreate\b/i, "lab environment guide must route an interrupted create without guessing a partial path");
  assert.match(capacity, /confirmed archive[\s\S]{0,80}contained cache only[\s\S]{0,100}never deletes a\s+live cache/i, "lab environment guide must bound deletion to the confirmed archive and its cache");
  assert.match(capacity, /Every npm cache remains attempt-local/i, "lab environment guide must prohibit shared npm caches");
  assert.match(capacity, /Empty launcher directories[\s\S]{0,100}not the primary remedy/i, "lab environment guide must reject empty-launcher cleanup as the remedy");

  const independent = rawHeadingSection(labsGuide, "Independent recovery order");
  const enospc = independent.indexOf("If the error is `ENOSPC`");
  const otherError = independent.indexOf("For any other error");
  const routeA = independent.indexOf("If non-ENOSPC state remains uncertain");
  assert.ok(enospc >= 0 && otherError > enospc && routeA > otherError, "independent recovery must route ENOSPC before ordinary Route A recovery");
  assert.match(independent, /read-only reclaim preview[\s\S]{0,100}exact older archive[\s\S]{0,120}archive the failed live parent[\s\S]{0,80}then reset/i, "independent recovery must reclaim an older archive, archive the live parent, then reset");
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
    assert.ok(baseline?.includes("0.119.11"), `${path} must declare the exact Directive 0.119.11 baseline`);
    assert.deepEqual([...new Set(baseline.match(/\b\d+\.\d+\.\d+\b/g))], ["0.119.11"], `${path} contains a stale baseline version`);
    assert.doesNotMatch(body, /"(?:xBRIEFInfo|vBRIEFInfo)"\s*:\s*\{[^}]*"version"\s*:\s*"0\.6"/, `${path} teaches a legacy xBRIEF write envelope`);
    assert.doesNotMatch(parts.prose, /\b(?:Directive behavior|3Ci policy|Course guidance)\b/i, `${path} contains a removed claim label`);
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
  assertEnospcLabContract(content.get(lab5), {
    label: "Lab 5",
    archiveClass: "3ci-directive-lab05-<unique>",
  });
  assertReclaimHelperContract(content.get(lab5Helper), {
    label: "Lab 5 helper",
    archiveDirectoryName: "3ci-directive-lab-archive",
    archivePrefix: "3ci-directive-lab05-",
  });
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
  const currentBaseline = content.get("references/SOURCE-BASELINE.md");
  for (const [platform, expected] of [["macos-zsh", "candidate"], ["linux-bash", "candidate"], ["windows-pwsh7", "candidate"]]) {
    const markers = [...currentBaseline.matchAll(new RegExp(`teaching-platform-proof:${platform} status=(verified|candidate) date=(\\d{4}-\\d{2}-\\d{2}) evidence=([^\\s\x60]+)`, "g"))];
    assert.equal(markers.length, 1, `SOURCE-BASELINE must contain exactly one current proof marker for ${platform}`);
    assert.equal(markers[0][1], expected, `${platform}: current platform status does not match the supported paths`);
    if (expected === "verified") assert.doesNotMatch(markers[0][3], /^(?:none|not-run|pending|unknown)$/, `Lab 5 ${platform} proof must cite actual evidence`);
  }
  const platformRecord = section(parsed.get(lab5).prose, "Lab record");
  assert.match(platformRecord, /fixture verified on Windows\/PowerShell/i, "Lab 5 must identify its verified Windows fixture");
  assert.match(platformRecord, /Candidate platforms[^\n]*macOS\/zsh[^\n]*Linux\/bash[^\n]*Windows\/PowerShell/i, "Lab 5 must identify all published walkthroughs as candidate paths");
  assert.doesNotMatch(platformRecord, /Candidate platforms[^\n]*verified/i, "Lab 5 candidate-platform row must not promote a walkthrough to verified");
  const powershellCommands = parsed.get(lab5).blocks.filter(({ language }) => /^(?:powershell|pwsh)$/.test(language)).map(({ content: block }) => block).join("\n");
  for (const verb of ["create", "guard", "verify-pin", "checkpoint", "inject-drift", "verify-result", "archive"]) {
    assert.match(powershellCommands, new RegExp(`projection-lab\\.mjs[^\\n]*\\b${verb}\\b`), `Lab 5 must provide a PowerShell command for helper verb ${verb}`);
  }
  for (const command of ["codebase:map", "verify:codebase-map-fresh"]) {
    assert.match(powershellCommands, new RegExp(`directive\\.cmd[^\\n]*\\b${command}\\b`), `Lab 5 must provide a PowerShell command for ${command}`);
  }
  assert.match(powershellCommands, /(?:npm\.cmd\s+install\b|spawnSync\("npm\.cmd", \["install")/, "Lab 5 must provide its isolated Windows npm install command");
  const doneStatement = section(parsed.get(lab5).prose, "Done statement");
  assert.match(doneStatement, /actual (?:operating system|OS)[^\n]*shell/i, "Lab 5 done statement must require the learner's actual OS and shell");
  assert.doesNotMatch(doneStatement, /completed[^\n]*recorded\s+macOS\//i, "Lab 5 done statement must not require macOS/zsh");
  for (const path of [lab5, solution5, module5]) {
    assert.match(parsed.get(path).prose, /Windows(?:\/PowerShell)?[\s\S]{0,180}verified|verified[\s\S]{0,180}Windows(?:\/PowerShell)?/i, `${path} must identify the verified Windows fixture`);
    assert.match(parsed.get(path).prose, /macOS(?:\/zsh)?[\s\S]{0,180}candidate|candidate[\s\S]{0,180}macOS(?:\/zsh)?/i, `${path} must keep macOS as a candidate`);
    assert.match(parsed.get(path).prose, /Linux[\s\S]{0,180}candidate|candidate[\s\S]{0,180}Linux/i, `${path} must keep Linux as a candidate`);
    assert.match(parsed.get(path).prose, /Windows[\s\S]{0,180}candidate|candidate[\s\S]{0,180}Windows/i, `${path} must keep Windows as a candidate`);
  }
  assert.match(section(parsed.get(module4).prose, "Navigation"), /\]\(05-sources-versus-projections\.md(?:#[^)]*)?\)/, "Module 4 must navigate to Module 5");
  assert.match(section(parsed.get(module5).prose, "Navigation"), /\]\(06-creating-well-shaped-work\.md(?:#[^)]*)?\)/, "Module 5 must navigate to Module 6");
  const course = content.get("curriculum/README.md");
  for (const [number, filename] of [[4, "04-xbrief-as-durable-state.md"], [5, "05-sources-versus-projections.md"], [6, "06-creating-well-shaped-work.md"]]) {
    const row = course.split("\n").find((line) => line.includes(filename));
    assert.ok(row && !/\b(?:planned|not yet available)\b/i.test(row), `Module ${number} availability must identify the completed curriculum`);
  }
  verifyLinks(root, "curriculum/README.md", markdownParts(course).prose);
  const projectPackage = JSON.parse(content.get("package.json"));
  assert.equal(projectPackage.private, true, "the training package must remain private");
  assertTeachingBaselinePin(projectPackage, content.get("README.md"));
  return { artifactCount: requiredFiles.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { artifactCount } = verifyModules45(process.argv[2]);
  console.log(`Modules 4-5 content contract: ok (${artifactCount} artifacts, 0 missing)`);
}
