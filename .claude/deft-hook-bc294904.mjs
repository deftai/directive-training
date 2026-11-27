#!/usr/bin/env node
/**
 * Directive host-hook outer (v261027 / #5994 / #6122 / #6201 / #6620 / #6740 / #7275).
 * Node built-ins only. Shared entry order: valid kill record → runtime missing
 * (admit exact project install on tool.before; else block) → spawn pin
 * hook-bin.js with the kill-switch reader flag.
 * A bare root flag file turns nothing off; it gets one warning.
 * Any failure on tool.before blocks the tool call in the host's own form.
 */
import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const GUIDANCE = "Directive can't run: @deftai/directive-runtime is not installed in this project. Run {install} in a terminal in this project. The exact project install named above is allowed through a shell tool at the project root; other agent tool calls stay blocked until that install succeeds.";
const NONDECISION = "Directive hooks: the hook could not reach a decision. Run directive doctor in this project to see the fix.";
const PIN_REL = "node_modules/@deftai/directive-runtime/dist/hook-bin.js";
const FLAG = ".deft-directive-disable";
const RECORD_REL = ".deft/authz/kill-switch.disable";
const SCHEMA_LINE = "schema=deft.kill-switch.v1";
const GIT_DIR_PREFIX = "gitDir=";
const READER_ARGS = ["--kill-switch-reader", "v1"];
const BARE_FLAG_WARNING = "Directive warning: root `.deft-directive-disable` is present, but a bare flag file turns nothing off (#6740). Enforcement stays on. To turn Directive off for this checkout, a person runs `deft kill-switch:on --confirm` at a terminal.";
const INVALID_WARNING = "Directive warning: `.deft/authz/kill-switch.disable` is not a valid kill record for this checkout ({reason}). Enforcement stays on. A person runs `deft kill-switch:on --confirm` at a terminal to write a new one, or `deft kill-switch:off --confirm` to remove it.";
const INVALID_WARNING_FLAG = "Directive warning: `.deft/authz/kill-switch.disable` is not a valid kill record for this checkout ({reason}). Enforcement stays on. The root `.deft-directive-disable` flag also turns nothing off. A person runs `deft kill-switch:on --confirm` at a terminal to write a new one, or `deft kill-switch:off --confirm` to remove it.";
const RECOVERY_COMMANDS = [["pnpm","install","--frozen-lockfile"],["npm","install"],["npm","ci"]];
const SHELL_TOOL_NAMES = ["shell","bash","bashtool","runterminalcommand","monitor","powershell"];
const SIMPLE_COMMAND = new RegExp("^[A-Za-z0-9@/._=-]+(?:[ \\t]+[A-Za-z0-9@/._=-]+)*$");
const RUN_DIR_FIELDS = ["workdir", "cwd", "working_directory", "workingDirectory"];

const here = dirname(fileURLToPath(import.meta.url));

function findProjectRoot(start) {
  let dir = resolve(start);
  for (;;) {
    if (existsSync(join(dir, "package.json")) || existsSync(join(dir, ".git"))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) return resolve(start, "../..");
    dir = parent;
  }
}

function parseArg(argv, name) {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === name && argv[i + 1]) return argv[i + 1];
    if (argv[i].startsWith(name + "=")) return argv[i].slice(name.length + 1);
  }
  return "";
}

function isRegularFile(path) {
  try {
    const lst = lstatSync(path);
    if (lst.isSymbolicLink()) return false;
    return lst.isFile();
  } catch {
    return false;
  }
}

/** git rev-parse --absolute-git-dir with trailing newlines removed, or "". */
function absoluteGitDir(root) {
  const r = spawnSync("git", ["-C", root, "rev-parse", "--absolute-git-dir"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  if (r.error || r.status !== 0 || typeof r.stdout !== "string") return "";
  return r.stdout.replace(/\n+$/, "");
}

/**
 * Kill record verdict (#6740): "absent", "valid", or an invalid reason. Exact
 * whole lines (CR removed, split on LF); the same contract as every other reader.
 */
function killRecordVerdict(root) {
  const path = join(root, RECORD_REL);
  let lst;
  try {
    lst = lstatSync(path);
  } catch {
    return "absent";
  }
  if (lst.isSymbolicLink() || !lst.isFile()) return "not-a-regular-file";
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return "unreadable";
  }
  const lines = text.replace(/\r/g, "").split("\n");
  if (!lines.includes(SCHEMA_LINE)) return "missing-schema-line";
  const gitDir = absoluteGitDir(root);
  if (gitDir.length === 0) return "git-dir-unresolved";
  if (!lines.includes(GIT_DIR_PREFIX + gitDir)) return "git-dir-mismatch";
  return "valid";
}

/** The one warning for a bare flag or an invalid record, or "". */
function killSwitchWarning(root, verdict) {
  const flag = isRegularFile(join(root, FLAG));
  if (verdict !== "absent") {
    return (flag ? INVALID_WARNING_FLAG : INVALID_WARNING).replace("{reason}", () => verdict);
  }
  return flag ? BARE_FLAG_WARNING : "";
}

/** The project install named in GUIDANCE, from the lockfile at root (AC9.12). */
function installCommand(root) {
  if (existsSync(join(root, "pnpm-lock.yaml"))) return "`pnpm install --frozen-lockfile`";
  if (existsSync(join(root, "package-lock.json"))) return "`npm install`";
  return "`npm install` (or `pnpm install --frozen-lockfile`)";
}

function quietAllow() {
  process.exit(0);
}

/**
 * The single failure exit (#6201). tool.before blocks: Claude/Codex/unknown
 * exit 2, Cursor and Grok one deny JSON on exit 0. Other events: Grok deny
 * JSON on exit 0, every other host stderr + exit 1 (no compaction or prompt
 * blocks, D-018).
 */
function blockToolCall(host, event, reason) {
  if (host === "grok") {
    process.stdout.write(JSON.stringify({ decision: "deny", reason }) + "\n");
    process.exit(0);
  }
  if (event === "tool.before" && host === "cursor") {
    process.stdout.write(
      JSON.stringify({ permission: "deny", user_message: reason, agent_message: reason }) + "\n",
    );
    process.exit(0);
  }
  process.stderr.write(reason + "\n");
  process.exit(event === "tool.before" ? 2 : 1);
}

function nonDecision(detail) {
  return NONDECISION + " (" + detail + ")";
}

/** Grok success output: empty, or exactly one object with decision allow|deny (#6166). */
function grokOutputIsDecision(text) {
  if (text.trim().length === 0) return true;
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return false;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return false;
  return parsed.decision === "allow" || parsed.decision === "deny";
}

function readStdinUtf8() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function asRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function firstString(values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }
  return null;
}

function toolInputOf(payload) {
  const input = asRecord(payload);
  if (input === null) return null;
  const toolCall = asRecord(input.tool_call) || asRecord(input.toolCall);
  return (
    asRecord(input.tool_input) ||
    asRecord(input.toolInput) ||
    asRecord(input.input) ||
    asRecord(input.arguments) ||
    (toolCall !== null ? asRecord(toolCall.arguments) : null)
  );
}

function hookToolName(payload) {
  const input = asRecord(payload);
  if (input === null) return null;
  const toolObject = asRecord(input.tool);
  const toolCall = asRecord(input.tool_call) || asRecord(input.toolCall);
  return (
    firstString([input.tool_name]) ||
    firstString([input.toolName]) ||
    (typeof input.tool === "string" ? firstString([input.tool]) : null) ||
    (toolObject !== null ? firstString([toolObject.name]) : null) ||
    (toolCall !== null ? firstString([toolCall.name]) : null)
  );
}

function hookShellCommand(payload) {
  const input = asRecord(payload);
  if (input === null) return null;
  const toolInput = toolInputOf(input);
  return firstString([
    toolInput !== null ? toolInput.command : null,
    toolInput !== null ? toolInput.cmd : null,
    toolInput !== null ? toolInput.shell_command : null,
    input.command,
    input.cmd,
  ]);
}

function normalizeToolName(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isShellToolName(name) {
  return SHELL_TOOL_NAMES.includes(normalizeToolName(name));
}

function matchRecoveryCommand(command) {
  if (command === null) return null;
  const trimmed = command.trim();
  if (!SIMPLE_COMMAND.test(trimmed)) return null;
  const tokens = trimmed.split(/[ \t]+/);
  for (const candidate of RECOVERY_COMMANDS) {
    if (
      candidate.length === tokens.length &&
      candidate.every((token, index) => token === tokens[index])
    ) {
      return candidate.join(" ");
    }
  }
  return null;
}

function rootsMatch(a, b) {
  try {
    return realpathSync(a) === realpathSync(b);
  } catch {
    return resolve(a) === resolve(b);
  }
}

/** Directories that prove where a shell tool call runs (#6313 / #7275). */
function shellRunDirectories(host, payload) {
  const input = asRecord(payload);
  if (input === null) return [];
  const toolInput = toolInputOf(input);
  if (toolInput !== null && toolInput !== input) {
    const present = RUN_DIR_FIELDS.filter((field) => field in toolInput);
    if (present.length > 0) {
      const values = present.map((field) => firstString([toolInput[field]]));
      return values.every((value) => value !== null) ? values : [];
    }
  }
  if (host === "codex") return [];
  const outer = firstString([input.cwd]);
  return outer === null ? [] : [outer];
}

/** Admit exact simple project-root installs when pin hook-bin is missing (#7275). */
function admitMissingPinInstall(host, event, projectRoot, payload) {
  if (event !== "tool.before") return false;
  const toolName = hookToolName(payload);
  if (toolName === null || !isShellToolName(toolName)) return false;
  if (matchRecoveryCommand(hookShellCommand(payload)) === null) return false;
  const runDirectories = shellRunDirectories(host, payload);
  return (
    runDirectories.length > 0 &&
    runDirectories.every((dir) => rootsMatch(dir, projectRoot))
  );
}

const root = findProjectRoot(here);
const argv = process.argv.slice(2);
const host = parseArg(argv, "--host");
const event = parseArg(argv, "--event");

const verdict = killRecordVerdict(root);
if (verdict === "valid") {
  quietAllow();
}

const pin = join(root, PIN_REL);
if (!existsSync(pin)) {
  const warning = killSwitchWarning(root, verdict);
  if (warning.length > 0) process.stderr.write(warning + "\n");
  // Read stdin only on the missing-pin branch (#7275); installed-pin keeps inherit.
  if (event === "tool.before") {
    const raw = readStdinUtf8();
    let payload = null;
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = null;
    }
    if (payload !== null && admitMissingPinInstall(host, event, root, payload)) {
      quietAllow();
    }
  }
  blockToolCall(host, event, GUIDANCE.replace("{install}", () => installCommand(root)));
}

const child = spawnSync(process.execPath, [pin, ...argv, ...READER_ARGS], {
  cwd: root,
  env: process.env,
  stdio: ["inherit", "pipe", "inherit"],
  maxBuffer: 16 * 1024 * 1024,
});
if (child.error) {
  blockToolCall(host, event, nonDecision("failed to run pin hook-bin: " + child.error.message));
}
if (child.status === null) {
  const signal = child.signal ? ", signal " + child.signal : "";
  blockToolCall(host, event, nonDecision("pin hook-bin ended without an exit status" + signal));
}
if (child.status !== 0) {
  blockToolCall(host, event, nonDecision("pin hook-bin exited " + child.status));
}
if (!Buffer.isBuffer(child.stdout)) {
  blockToolCall(host, event, nonDecision("pin hook-bin output was not captured"));
}
const text = child.stdout.toString("utf8");
if (host === "grok") {
  if (!grokOutputIsDecision(text)) {
    blockToolCall(host, event, nonDecision("pin hook-bin output is not one Grok decision"));
  }
  if (text.trim().length === 0) process.exit(0);
}
process.stdout.write(child.stdout);
