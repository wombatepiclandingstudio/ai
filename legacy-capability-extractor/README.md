# Legacy Code Business Capability Extractor

A portable, cross-tool AI coding agent skill that extracts a **traceable business capability map** from legacy codebases using a structured 7-phase pipeline. Drop this folder into any repo, run the sync script, and every major AI coding tool gains the ability to map business domains directly from source code.

## What It Does

Given a codebase path, the skill runs a multi-phase pipeline (A1–A7) that transforms scattered legacy code into a two-level business capability map:

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

## Evaluated Performance

Tested against 3 scenarios (Java monolith, Python API-only, Node.js microservices):

| Metric | With Skill | Without Skill (baseline) |
|--------|-----------|--------------------------|
| Pass rate | **100%** (3/3) | 59% (7/12 expectations met) |

## Quick Start

### 1. Add to your repo

Copy the entire `legacy-capability-extractor/` folder and the `_shared/` folder into your repo under a `skills/` directory:

```
your-repo/
├── skills/
│   ├── _shared/
│   │   └── sync-skill.py          # Universal sync script
│   └── legacy-capability-extractor/
│       ├── SKILL.md               # Canonical skill definition (source of truth)
│       ├── README.md
│       ├── compat/                # Pre-generated adapter files (optional — sync script regenerates these)
│       ├── evals/
│       │   └── evals.json
│       ├── references/
│       │   └── pregenerated-inputs.md
│       └── scripts/
│           └── sync-skill.sh      # Convenience bash wrapper
└── ... (your code)
```

### 2. Install to your codebase

```bash
# Install for ALL 16 supported tools at once
python3 skills/_shared/sync-skill.py skills/legacy-capability-extractor/ --target .

# Install for specific tools only
python3 skills/_shared/sync-skill.py skills/legacy-capability-extractor/ --target . --tool cursor,copilot,cline

# Preview what would be installed (no files written)
python3 skills/_shared/sync-skill.py skills/legacy-capability-extractor/ --target . --dry-run

# Remove this skill from all tool files
python3 skills/_shared/sync-skill.py skills/legacy-capability-extractor/ --target . --remove

# List all supported tools
python3 skills/_shared/sync-skill.py skills/legacy-capability-extractor/ --list-tools
```

### 3. Use it

Open any supported AI coding tool in your codebase and ask:

> "Extract the business capabilities from this codebase"

The agent will recognize the intent from the skill's trigger description and follow the full 7-phase pipeline.

## Supported Tools (16 total)

| Tier | Tool | What Gets Installed |
|------|------|---------------------|
| **A** (native SKILL.md) | Claude Code, Codex CLI, OpenCode | Full skill with on-demand loading via description trigger |
| **B** (MDC with globs) | Cursor | MDC rules file, activates when matching files are open |
| **C** (condensed rules) | CLAUDE.md, GitHub Copilot, Windsurf, Cline/RooCode, Gemini CLI, Kiro, JetBrains AI, Augment Code, Aider, Bolt.new, Lovable | ~30-line rules section, multi-skill safe |
| **D** (universal fallback) | AGENTS.md (Devin, Amazon Q, Zed AI, Replit AI, 60k+ projects) | Condensed rules section |

**Multi-skill safe:** Always-on rule files (`.windsurfrules`, `CLAUDE.md`, `AGENTS.md`, etc.) use HTML comment markers so multiple skills coexist without overwriting each other.

## How It Works

The `sync-skill.py` script reads `SKILL.md` (the source of truth) and generates tool-specific adapter files:

- **Tier A** tools natively support the SKILL.md format. They get the full skill with all references and scripts, loaded on-demand when the description matches the user's request
- **Tier B/C/D** tools get a condensed ~30-line version with trigger phrases and a pipeline summary — enough for the agent to recognize when to activate and follow the procedure
- The script is universal: it works with **any** skill that follows the SKILL.md format, not just this one

## Adding More Skills

This repo is designed for multi-skill growth. To add a new skill:

1. Create `skills/your-skill-name/SKILL.md` with YAML frontmatter (`name`, `description`) and the skill instructions
2. Optionally add `references/`, `scripts/`, `evals/` subdirectories
3. Run the sync script for each skill you want to install:

```bash
for skill in skills/*/SKILL.md; do
  python3 skills/_shared/sync-skill.py "$(dirname "$skill")" --target /path/to/codebase
done
```

Each skill accumulates in the shared rule files without conflicts.

## File Reference

```
legacy-capability-extractor/
├── SKILL.md                           # Source of truth — full 7-phase pipeline, anti-patterns, quality checklist
├── README.md                          # This file
├── compat/                            # Pre-generated tool adapters (regenerated by sync-skill.py)
│   ├── AGENTS.md                      # Devin, Amazon Q, Zed AI, Replit AI
│   ├── CLAUDE.md                      # Claude Code project rules
│   ├── GEMINI.md                      # Gemini CLI
│   ├── copilot-instructions.md        # GitHub Copilot
│   ├── windsurfrules                  # Windsurf
│   └── legacy-capability-extractor.mdc  # Cursor (with globs for on-demand activation)
├── evals/
│   └── evals.json                     # 3 eval scenarios (Java/Python/Node.js)
├── references/
│   └── pregenerated-inputs.md         # Guide for using nDepend, SonarQube, OpenAPI specs, etc.
└── scripts/
    └── sync-skill.sh                  # Bash convenience wrapper
```

## Credits

Based on the EPAM article "Using AI to Extract Business Capabilities from Legacy Code" with independent improvements: change coupling analysis (A1.5), hallucination validation, anti-pattern detection, and adaptive pipeline behavior. Evaluated at 100% vs 59% baseline pass rate.