# Software Metrics & Quality

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills)
standard) that applies **quantitative software engineering metrics** and structured quality
processes. The `SKILL.md` in this folder is the single source of truth — the same file is
exposed to any compatible tool via discovery paths, no text rewriting required.

## What It Does

Given code to evaluate, the skill guides the agent through:

- **CK Object-Oriented Metrics** — WMC, DIT, NOC, CBO, RFC, LCOM for class-level quality
- **Cyclomatic Complexity** — McCabe's metric for function-level risk
- **Halstead Complexity Measures** — Operator/operand analysis for cognitive complexity
- **Maintainability Index** — Composite score combining CC, Halstead, and LOC
- **Fagan Code Inspection** — Formal 6-phase defect discovery process
- **ISO 9126/25010 Quality Model** — Structured quality characteristics assessment
- **Common Pitfalls** — Anti-patterns in refactoring, testing, design, review, estimation, architecture

## Install to a Target Project

```bash
# Install for one tool
bash install-skill.sh --tool claude --target /path/to/project

# Install for several tools at once
bash install-skill.sh --tool claude,codex,cursor --target /path/to/project

# Install only this skill
bash install-skill.sh --tool claude --target /path/to/project --id software-metrics-quality

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

> "Measure the cyclomatic complexity of this module"

or

> "Assess the maintainability of this codebase"

The agent recognizes the intent from the skill's `description` and applies the appropriate
metrics and quality assessment.

## Companion Skills

| Skill | Connection |
|-------|------------|
| `refactoring-catalog` | Metrics tell you WHERE to refactor; Fowler's catalog tells you HOW |
| `clean-code-review` | Clean Code violations manifest as poor metrics (SOLID → CBO/LCOM) |
| `legacy-code-workshop` | Metrics quantify legacy code risk; Feathers' techniques reduce that risk |
| `pragmatic-development` | Metrics track the effectiveness of Pragmatic practices (DRY, orthogonality) |
