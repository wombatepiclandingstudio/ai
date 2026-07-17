# agents

Custom AI agent definitions for this repository.

An **agent** here is a reusable persona/configuration — a system prompt, set of instructions,
and optionally allowed tools or skills — that can be loaded into a compatible coding agent
(Claude Code, Codex, OpenCode, Cursor, etc.).

## Convention

Each agent is a folder named after the agent, containing:

```
agents/
└── my-agent/
    ├── agent.md        # Required: name, description, and system prompt/instructions
    ├── skills/         # Optional: skills this agent can use (symlinks or copies)
    └── config.json     # Optional: tool/permission/provider config understood by the target runtime
```

`agent.md` frontmatter mirrors the Agent Skills standard for portability:

```markdown
---
name: my-agent
description: Short description of when to use this agent.
tools: [Read, Grep, Edit, Bash]
---

System prompt / instructions here.
```

## Relationship to skills

Agents *use* skills. Skills are reusable capabilities; agents are configurations that wire
those capabilities (plus a persona and tool permissions) to a task. Put general-purpose
procedures in `../skills/` and agent-specific orchestration here.
