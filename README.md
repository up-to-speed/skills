# Command Center Skills

Public skills published by [Command Center](https://commandcenter.ai). Usable from Claude Code (via the plugin marketplace) and Codex / any CLI agent (via `npx`).

| Skill | What it does | Status |
|---|---|---|
| `walkthrough` | Generate a Command Center walkthrough for the current diff and open it in the browser. | Available |

## Installation

### Claude Code

```
/plugin install up-to-speed/skills
```

(Repository will be transferred to `command-center-ai/skills`; GitHub redirects keep this URL working afterward.)

### Codex / any CLI agent

```
npm install -g @commandcenter/skills
```

…then point your agent at the executable name for the skill you want (currently `cc-walkthrough`). Or one-shot via `npx`:

```
npx -y @commandcenter/skills@latest cc-walkthrough --help
```

For Codex, add an `AGENTS.md` entry pointing at the same command.

## Requirements

Node ≥18.

That's it on the runner side. Everything else is preflighted at runtime — the runner detects the state of your machine and either fixes it or emits a structured `action-required` event telling you what to do:

| Precondition | What the runner does |
|---|---|
| Command Center installed | Launches the Electron app if present; otherwise tells you how to install it. |
| Backend reachable on `127.0.0.1:6112` | Polls `GET /health` after launch. |
| Signed in | Reads the session token; surfaces `not-logged-in` if missing or rejected. |
| A model provider configured | Calls `models.getAvailability`; surfaces `no-model` if not. |
| Current directory is a CC workspace | Calls `projects.findWorkspaceByPath`; surfaces `no-workspace` if not. |

## Output contract (for agent integrators)

Each skill's runner writes one JSON object per line to stdout. Fields:

| Field | Type | Meaning |
|---|---|---|
| `kind` | `"status" \| "result" \| "error" \| "action-required"` | Event class. |
| `code` | string enum | Stable identifier. Branch on this. |
| `message` | string | Human-readable. Already in the user's locale where it comes from the backend; English where the runner produced it. |
| `url` | string (optional) | Action target — open in browser, send to login flow, etc. |

For the `walkthrough` skill, the documented `code` values are:

`not-installed`, `not-running`, `not-logged-in`, `no-model`, `no-workspace`, `backend-too-old`, `quota`, `generation-failed`, `ok`, `unexpected`, `backend-error`.

Exit codes mirror the codes (see `skills/walkthrough/run.mjs` for the table) but `code` is the stable signal — do not parse exit codes.

## Versioning

This package follows semver. The `MIN_BACKEND_VERSION` constant in each skill's `run.mjs` is bumped whenever the skill starts depending on a new backend endpoint or field.

## License

MIT — see [LICENSE](./LICENSE).
