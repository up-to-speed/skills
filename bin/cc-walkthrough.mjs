#!/usr/bin/env node
// Thin npx shim: forwards argv to the walkthrough skill's run.mjs.
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const runner = resolve(here, "..", "skills", "walkthrough", "run.mjs");

await import(runner);
