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

## Use It

Open any supported AI coding tool in a project where the skill is installed and ask:

> "Extract the business capabilities from this codebase"

The agent recognizes the intent from the skill's `description` and follows the full 7-phase pipeline.
