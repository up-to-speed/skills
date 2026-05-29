#!/usr/bin/env node
// Single-entry dispatcher for all published skills.
//
// `npx @commandcenter/skills <skill> [args]` lands here. We resolve <skill>
// against the marketplace manifest (single source of truth — same file
// Claude Code reads) and re-exec the matching run.mjs in-process.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const manifestPath = join(root, ".claude-plugin", "marketplace.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const skillById = Object.fromEntries(
  (manifest.skills ?? []).map((s) => [s.id, join(s.path, "run.mjs")]),
);

const argv = process.argv.slice(2);
const skill = argv[0];

if (!skill || skill === "--help" || skill === "-h") {
  const names = Object.keys(skillById).join(", ") || "(none)";
  process.stderr.write(
    `Usage: skills <skill> [args]\n\nAvailable: ${names}\n`,
  );
  process.exit(skill ? 0 : 1);
}

const relativePath = skillById[skill];
if (!relativePath) {
  process.stderr.write(
    `Unknown skill: ${skill}\nAvailable: ${Object.keys(skillById).join(", ") || "(none)"}\n`,
  );
  process.exit(2);
}

const absolutePath = join(root, relativePath);
if (!existsSync(absolutePath)) {
  process.stderr.write(`Skill runner not found at ${absolutePath}\n`);
  process.exit(2);
}

// Strip the skill name from argv so the runner sees its own args only.
process.argv = [process.argv[0], absolutePath, ...argv.slice(1)];
await import(pathToFileURL(absolutePath).href);
