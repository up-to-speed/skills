# Command Center Skills

Public skills for [Command Center](https://commandcenter.ai), usable from Claude Code and any CLI agent with Node ≥18.

| Skill | What it does |
|---|---|
| `walkthrough` | Generate a Command Center walkthrough for the current diff and open it in the browser. |

## Install

**Claude Code**

```
/plugin install up-to-speed/skills
```

**npx (Codex, terminal, anywhere with Node ≥18)**

```
npx -y @commandcenter/skills walkthrough
```

`npx @commandcenter/skills <skill> [args]` is the universal entry: the package ships one `skills` bin that dispatches to the named skill.

## License

MIT — see [LICENSE](./LICENSE).
