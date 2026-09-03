# Legacy Code Workshop

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills)
standard) that applies **Michael Feathers' techniques** for working effectively with legacy code.
The `SKILL.md` in this folder is the single source of truth — the same file is exposed to any
compatible tool via discovery paths, no text rewriting required.

## What It Does

Given untested or poorly tested code, the skill guides the agent through:

1. **Characterization Tests** — Document existing behavior before changing anything
2. **Dependency Breaking** — Extract Interface, Parameterize Constructor, Factory Injection, Extract and Override, Primitivization, Adapter, Facade
3. **Safe Behavior Addition** — Sprout Method, Sprout Class, Wrap Method
4. **Large-Scale Refactoring** — Mikado Method for navigating complex dependency graphs
5. **Dependency Analysis** — Call graphs, dependency trees, impact analysis, hotspot detection

## Install to a Target Project

```bash
# Install for one tool
bash install-skill.sh --tool claude --target /path/to/project

# Install for several tools at once
bash install-skill.sh --tool claude,codex,cursor --target /path/to/project

# Install only this skill
bash install-skill.sh --tool claude --target /path/to/project --id legacy-code-workshop

# List supported tools and their install paths
bash install-skill.sh --list-tools

# Uninstall
bash install-skill.sh --tool claude --target /path/to/project --remove
```

### Supported tools

| Tool | Installs into |
|------|---------------|
| Claude Code | `.claude/skills/` |
| OpenAI Codex | `.codex/skills/` |
| OpenCode | `.opencode/skills/` |
| Kilo Code | `.kilocode/skills/` |
| Cursor | `.cursor/skills/` |
| GitHub Copilot / VS Code | `.github/skills/` |
| Kiro (AWS) | `.kiro/skills/` |
| Gemini CLI | `.gemini/skills/` |
| Roo Code / Cline | `.roo/skills/` |
| Goose | `.goose/skills/` |

### Tools without native SKILL.md support

For agents that only read a project memory file (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`,
`.windsurfrules`, etc.), point them at `references/condensed.md` or paste its content into the
tool's rules file.

## Use It

Open any supported AI coding tool in a project where the skill is installed and ask:

> "This code has no tests — help me safely add a feature to it"

or

> "I need to refactor this GodClass but I don't know where to start"

The agent recognizes the intent from the skill's `description` and follows the characterization →
dependency-breaking → safe-change workflow.

## Companion Skills

| Skill | Connection |
|-------|------------|
| `refactoring-catalog` | Once dependencies are broken and tests exist, Fowler's catalog provides refactoring techniques |
| `clean-code-review` | Clean Code principles define the goal state after fixing legacy code |
| `pragmatic-development` | Pragmatic practices (TDD, version control, testing) prevent code from becoming legacy |
| `software-metrics-quality` | Metrics quantify legacy code risk and track improvement after changes |
