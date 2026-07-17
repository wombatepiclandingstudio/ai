# Legacy Code Business Capability Extractor

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills)
standard) that extracts a **traceable business capability map** from legacy codebases using a
structured 7-phase pipeline. The `SKILL.md` in this folder is the single source of truth — the
same file is exposed to any compatible tool via discovery paths, no text rewriting required.

## What It Does

Given a codebase path, the skill runs a multi-phase pipeline (A1–A7) that transforms scattered
legacy code into a two-level business capability map:

```
A1: Seed Candidates → A2: Analyze Candidates → A3: Verify Coverage →
A4: Lock L1 Capabilities → A5: L2 Sub-Capabilities → A6: Domain Model →
A7: Industry Blueprint Comparison
```

**Key features:**

- **Multi-signal analysis** — Merges evidence from package structure, database schema, backend/frontend entry points, and git change coupling
- **Resilient pipeline** — Skips unavailable data sources (no DB? no frontend? no git?) and continues. Every step writes to a file so nothing is lost on context breaks
- **Hallucination guard** — Every candidate must cite existing file paths, table names, or endpoint URLs. Anti-patterns section catches common failure modes
- **Industry benchmarking** — Compares code-derived capabilities against BIAN, TM Forum, ACORD, APQC PCF, HL7, or TOGAF frameworks
- **Adaptive depth** — Works on 5K-line modules or 200K+ line monoliths, with or without pre-generated tool inputs (nDepend, SonarQube, OpenAPI specs, etc.)

## Repository Layout

This repo is organized as:

```
.
├── agents/            # Agent definitions (custom agent prompts/configs)
├── skills/            # Reusable skills (open Agent Skills standard)
│   └── legacy-capability-extractor/
│       ├── SKILL.md               # Canonical skill definition (source of truth)
│       ├── README.md              # This file
│       ├── evals/
│       │   └── evals.json         # Eval scenarios
│       └── references/
│           ├── pregenerated-inputs.md
│           └── condensed.md       # Fallback for tools that don't read SKILL.md
├── install.sh         # Cross-platform installer (symlinks skills into target projects)
└── README.md
```

## Install to a Target Project

Skills are discovered by tools at well-known paths. `install.sh` symlinks this skill folder
into a target project under the path each tool expects:

```bash
# Install for one tool
bash install.sh --tool claude --target /path/to/project

# Install for several tools at once
bash install.sh --tool claude,codex,cursor --target /path/to/project

# List supported tools and their install paths
bash install.sh --list-tools

# Uninstall
bash install.sh --tool claude --target /path/to/project --remove
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
tool's rules file. The condensed version carries the trigger phrases and the full A1–A7
procedure without the verbose rationale.

## Use It

Open any supported AI coding tool in a project where the skill is installed and ask:

> "Extract the business capabilities from this codebase"

The agent recognizes the intent from the skill's `description` and follows the full 7-phase pipeline.

## Adding More Skills

1. Create `skills/your-skill-name/SKILL.md` with YAML frontmatter (`name`, `description`) and the skill instructions
2. Optionally add `references/`, `evals/`, `scripts/` subdirectories
3. Run `bash install.sh --tool <keys> --target <dir>` to expose it to your tools

## Evaluated Performance

Tested against 3 scenarios (Java monolith, Python API-only, Node.js microservices):

| Metric | With Skill | Without Skill (baseline) |
|--------|-----------|--------------------------|
| Pass rate | **100%** (3/3) | 59% (7/12 expectations met) |

## Credits

Based on the EPAM article "Using AI to Extract Business Capabilities from Legacy Code" with
independent improvements: change coupling analysis (A1.5), hallucination validation,
anti-pattern detection, and adaptive pipeline behavior. Evaluated at 100% vs 59% baseline
pass rate.
