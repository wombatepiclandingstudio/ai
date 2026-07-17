# agents

Custom AI agent definitions for this repository.

An **agent** here is a reusable persona/configuration — a system prompt, set of instructions,
and optionally allowed tools or skills — that can be loaded into a compatible coding agent
(Claude Code, Codex, OpenCode, Cursor, etc.).

## Convention

We follow the **Claude Code subagent format** — the de-facto standard for named persona agents
(backed by the official Claude Code docs and the widest community adoption). An agent is a folder
named after the agent, containing one markdown file with YAML frontmatter plus a system-prompt body:

```
agents/
└── my-agent/
    ├── my-agent.md     # Required: YAML frontmatter (name, description, tools, …) + prompt body
    └── skills/         # Optional: skills this agent can use (symlinks or copies)
```

The markdown file is a Claude Code subagent definition. The filename (without `.md`) must match the
`name` field in the frontmatter. Supported frontmatter fields:

```markdown
---
name: my-agent
description: Short, specific description of when to use this agent.
tools: [Read, Grep, Glob, WebFetch, WebSearch, Bash]
model: sonnet
permissionMode: plan
---

System prompt / instructions here.
```

- `name` — kebab-case identifier; must match the filename.
- `description` — when the host agent should delegate to this agent (drives auto-routing).
- `tools` — allowlist of tools (omit to inherit all). For web-verifying agents include
  `WebFetch`/`WebSearch`/`Bash` so they can check external sources.
- `model` — optional (`sonnet`, `opus`, `haiku`, `inherit`).
- `permissionMode` — optional (`default`, `plan`, `acceptEdits`, `dontAsk`, `bypassPermissions`).

> Note: `AGENTS.md` is a *different* concept — a single project-level instruction file (a
> README-for-agents), not a named persona/subagent. Do not put a persona agent there.

## Installing agents

Use the repo's `install-agent.sh` (skills are installed separately by `install-skill.sh`):

```bash
bash install-agent.sh --tool claude --target /path/to/project
bash install-agent.sh --tool claude,opencode,kiro --target /path/to/project
bash install-agent.sh --tool claude --target /path/to/project --remove
bash install-agent.sh --list-tools
```

The script symlinks each `agents/<name>/<name>.md` into the target tool's agents directory.

### Tool-specific limitations

- **codex** and **cursor** have no native named-subagent directory. `install-agent.sh` skips them
  with a warning; paste the agent's markdown (frontmatter + body) into the project `AGENTS.md`
  manually for those tools.
- Other tools (claude, opencode, copilot, kiro, gemini, kilocode, kilo, roo, cline, goose, vscode)
  get a best-effort agents path and the symlink is created.

## Relationship to skills

Agents *use* skills. Skills are reusable capabilities; agents are configurations that wire
those capabilities (plus a persona and tool permissions) to a task. Put general-purpose
procedures in `../skills/` and agent-specific orchestration here.
