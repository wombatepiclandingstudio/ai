---
name: legacy-capability-extractor
description: >
  Extract a traceable business capability map from legacy codebases using a multi-step AI-assisted
  pipeline. Use this skill whenever the user asks to discover, identify, map, or extract business
  capabilities, business domains, or functional boundaries from code — even if they phrase it as
  "understand what this system does," "map the architecture," "find business domains in this code,"
  "prepare for modernization," "what are the bounded contexts," or "generate a domain model from
  source code." Also trigger when the user provides a codebase root path and asks for capability
  analysis, domain decomposition, or modernization readiness assessment. Covers both monolith and
  microservice codebases, with or without database access.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [architecture, modernization, domain-modeling, legacy]
---

# Legacy Code Business Capability Extractor

Run a structured pipeline that transforms scattered legacy code into a traceable, two-level
business capability map. The pipeline is resilient: if a data source is unavailable, skip it and
continue. Every step writes its output to a file so nothing is lost on context breaks.

## When to use this skill

- The user provides a codebase (path, repo, or set of files) and wants to understand its business
  structure
- The user is preparing for modernization, migration, or microservice decomposition
- The user wants to know "what does this system actually do?" at a business level
- The user wants a capability map, domain model, or bounded-context analysis from code

## Pipeline overview

The pipeline has 7 phases (A1–A7). Each phase reads one input, produces one output, feeds the next.
If context breaks, resume from the last completed step.

```
A1: Seed Candidates → A2: Analyze Candidates → A3: Verify Coverage →
A4: Lock L1 Capabilities → A5: L2 Sub-Capabilities → A6: Domain Model →
A7: Industry Blueprint Comparison
```

## Output files

All outputs go into a single working directory the user specifies (default: `capability-output/`
relative to the codebase root). Create this directory at the start.

| File | Written by | Description |
|------|-----------|-------------|
| `a1-candidates.md` | A1.6 | Raw candidate list with confidence and evidence |
| `a2-analysis.md` | A2.3 | Per-candidate analysis with actions |
| `a3-coverage.md` | A3 | Coverage check and orphan resolution |
| `a4-l1-locked.md` | A4 | Finalized L1 capability list |
| `a5-l2-per-capability.md` | A5 | L2 sub-capabilities per L1 |
| `a6-domain-model.md` | A6 | Consolidated domain model |
| `a7-benchmark.md` | A7 | Industry comparison report |

---

## Analysis Phase

For each candidate, assess three dimensions:

1. **Cohesion** — Do files work together toward one business purpose?
2. **Coupling** — Dependencies on other candidates. Heavy bidirectional = merge candidate.
3. **Boundary clarity** — Clear interfaces? Fuzzy = boundary may be artificial.

Assign one action per candidate:

| Action | When |
|--------|------|
| **CONFIRM** | High cohesion, clear boundaries, 2+ signals |
| **SPLIT** | Distinct business functions that should be separate |
| **MERGE** | Same business meaning; technical separation is deployment artifact |
| **DE-SCOPE** | Infrastructure, tooling, cross-cutting concern — not a business capability |
| **INVESTIGATE** | Insufficient evidence. Flag for human review |

**Critical:** Deployment boundaries do not define business capabilities. A `scheduling-service` microservice may be a feature of "Payments". Judge by business meaning.

## L2 Decomposition

For each L1, identify 2–5 L2 sub-capabilities: distinct operations a team could independently build, test, deploy, or migrate. Document per L2: description, key operations, code location, key entities (OWNS/MANAGES/TRACKS), external dependencies, cross-capability dependencies.

## Domain Model

The final `a6-domain-model.md` answers for every capability:
1. **What exists** — name and description
2. **Where it lives** — files, packages, endpoints
3. **How it connects** — dependencies on other capabilities and external services

## Industry Benchmarking

Compare against industry frameworks (BIAN for banking, TM Forum for telecom, ACORD for insurance, APQC PCF cross-industry, HL7 for healthcare, TOGAF for government). Produce: Aligned, Organization-specific, Gap analysis. Code remains source of truth.

See `references/pipeline-details.md` for detailed phase instructions and output templates.

---

## Anti-Patterns

1. **Technical layers as capabilities** — Delivery channels, infrastructure, operational tooling, cross-cutting concerns are NOT business capabilities. The multi-step pipeline catches these at analysis.
2. **Deployment ≠ business boundaries** — A microservice may implement a feature of another capability. Judge by business meaning.
3. **Single analysis pass** — Run the pipeline twice with different tools/sessions. Compare agreement and divergence.
4. **Hallucinated capabilities** — Verify every cited file path, table name, and endpoint URL actually exists.
5. **Dead code signals** — Cross-reference with entry points. No active entry points + no recent changes = likely dead code.

---

## Adaptive Behavior

The pipeline adjusts to available information:

- **No database access?** Skip A1.2. You'll have fewer signals but the pipeline still works.
- **No frontend?** Skip A1.4. Same principle.
- **No git history?** Skip A1.5. The change coupling signal is valuable but not required.
- **Pre-generated inputs available?** If the user provides an architecture document, a database
  schema export, a dependency graph from a tool like nDepend or ArchUnit, or entry point
  catalogs from IDE analyzers, use them as inputs to the relevant steps. These higher-quality
  signals reduce guesswork and improve accuracy.
- **Large codebase (>200K lines)?** Process one module/package group at a time. Start with the
  largest or most business-critical modules. The pipeline's step-based structure means you can
  pause after any phase and resume later.

## Pre-generated Input Guide

The pipeline accepts optional pre-generated inputs that improve signal quality. Read
`references/pregenerated-inputs.md` for details on how to prepare and use:
- Package structure exports (nDepend, SonarQube, ArchUnit)
- Database schema dumps (DDL, ERD tools)
- Entry point catalogs (Swagger/OpenAPI specs, IDE analyzers)
- Dependency graphs (import analysis, call graphs)
- Change coupling data (CodeScene, git mining scripts)

## Output Quality Checklist

Before delivering the final domain model, verify:

- [ ] Every L1 capability has at least 2 independent signal sources
- [ ] Every L2 operation maps to specific, existing files in the codebase
- [ ] No delivery channel, infrastructure layer, or cross-cutting concern is listed as a capability
- [ ] Coverage is >90% of top-level packages
- [ ] Cross-capability dependencies are documented and directional
- [ ] The hierarchy is consistent: L2s are strictly contained within their parent L1
- [ ] File paths, table names, and endpoint URLs cited in the model actually exist
- [ ] Ambiguous or low-confidence items are flagged with specific questions for human review

