# Clean Code Review

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills)
standard) that enforces **Robert C. Martin's Clean Code principles**. The `SKILL.md` in this
folder is the single source of truth — the same file is exposed to any compatible tool via
discovery paths, no text rewriting required.

## What It Does

Given code to review, the skill guides the agent through:

- **Meaningful Names** — Names that reveal intent, avoid disinformation, are searchable
- **Small Functions** — Do one thing, one level of abstraction, few arguments
- **Comments** — Why, not what; legal, informative, warning, TODO
- **Error Handling** — Exceptions over return codes, no null returns/passes
- **Formatting** — Consistent style, reasonable file/line lengths
- **SOLID Principles** — SRP, OCP, LSP, ISP, DIP
- **TDD** — RED → GREEN → REFACTOR cycle, FIRST principles
- **Boy Scout Rule** — Leave code cleaner than you found it

## Install to a Target Project

```bash
# Install for one tool
bash install-skill.sh --tool claude --target /path/to/project

# Install for several tools at once
bash install-skill.sh --tool claude,codex,cursor --target /path/to/project

# Install only this skill
bash install-skill.sh --tool claude --target /path/to/project --id clean-code-review

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

> "Review this code for Clean Code violations"

or

> "Check if this module follows SOLID principles"

The agent recognizes the intent from the skill's `description` and applies Clean Code principles.

## Companion Skills

| Skill | Connection |
|-------|------------|
| `refactoring-catalog` | Fowler's catalog provides the techniques to fix Clean Code violations |
| `legacy-code-workshop` | Legacy Code techniques enable fixing violations by breaking dependencies |
| `pragmatic-development` | DRY and orthogonality are both Clean Code and Pragmatic principles |
| `software-metrics-quality` | Metrics quantify Clean Code violations (SOLID → CBO/LCOM, naming → MI) |
