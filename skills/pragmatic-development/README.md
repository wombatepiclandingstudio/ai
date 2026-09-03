# Pragmatic Development

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills)
standard) that applies **Hunt & Thomas' Pragmatic Programmer** principles. The `SKILL.md` in this
folder is the single source of truth — the same file is exposed to any compatible tool via
discovery paths, no text rewriting required.

## What It Does

Given a development task, the skill guides the agent through pragmatic practices:

- **DRY** — Detect and eliminate knowledge duplication
- **Orthogonality** — Reduce coupling between components
- **Tracer Bullets** — Build thin end-to-end slices to validate architecture early
- **Good Enough Software** — Define and apply quality criteria
- **Breaking Coupling** — Interfaces, dependency injection, event-driven architecture
- **Debugging Mindset** — Scientific approach to diagnosing issues
- **Refactoring Along the Way** — Boy scout rule, continuous improvement
- **Pragmatic Starter Kit** — Version control, testing, documentation fundamentals

## Install to a Target Project

```bash
# Install for one tool
bash install-skill.sh --tool claude --target /path/to/project

# Install for several tools at once
bash install-skill.sh --tool claude,codex,cursor --target /path/to/project

# Install only this skill
bash install-skill.sh --tool claude --target /path/to/project --id pragmatic-development

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

> "Establish development practices for this new project"

or

> "Review this codebase for DRY violations and tight coupling"

The agent recognizes the intent from the skill's `description` and applies pragmatic principles.

## Companion Skills

| Skill | Connection |
|-------|------------|
| `refactoring-catalog` | Continuous refactoring is a Pragmatic practice; Fowler's catalog provides the techniques |
| `clean-code-review` | Clean Code and Pragmatic Programmer share principles (DRY, boy scout rule, SRP) |
| `legacy-code-workshop` | Pragmatic practices (TDD, testing, version control) prevent code from becoming legacy |
| `software-metrics-quality` | Metrics quantify DRY violations, coupling, and the effectiveness of pragmatic practices |
