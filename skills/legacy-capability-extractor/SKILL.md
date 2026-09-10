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
---

**Scope:** This skill extracts business capability maps from legacy codebases. It covers monolith
and microservice codebases, with or without database access. It does not perform code refactoring,
migration execution, or deployment — it produces a traceable capability map as its primary output.

# Legacy Code Business Capability Extractor

## Zero — Core Concepts

Run a structured pipeline that transforms scattered legacy code into a traceable, two-level
business capability map. The pipeline is resilient: if a data source is unavailable, skip it and
continue. Every step writes its output to a file so nothing is lost on context breaks.

**Analysis dimensions** (for each candidate):

1. **Cohesion** — Do files work together toward one business purpose?
2. **Coupling** — Dependencies on other candidates. Heavy bidirectional = merge candidate.
3. **Boundary clarity** — Clear interfaces? Fuzzy = boundary may be artificial.

**Candidate actions:**

| Action | When |
|--------|------|
| **CONFIRM** | High cohesion, clear boundaries, 2+ signals |
| **SPLIT** | Distinct business functions that should be separate |
| **MERGE** | Same business meaning; technical separation is deployment artifact |
| **DE-SCOPE** | Infrastructure, tooling, cross-cutting concern — not a business capability |
| **INVESTIGATE** | Insufficient evidence. Flag for human review |

**L2 Decomposition:** For each L1, identify 2–5 L2 sub-capabilities: distinct operations a team
could independently build, test, deploy, or migrate. Document per L2: description, key operations,
code location, key entities (OWNS/MANAGES/TRACKS), external dependencies, cross-capability dependencies.

**Domain Model:** The final `a6-domain-model.md` answers for every capability:
1. What exists — name and description
2. Where it lives — files, packages, endpoints
3. How it connects — dependencies on other capabilities and external services

**Industry Benchmarking:** Compare against industry frameworks (BIAN for banking, TM Forum for
telecom, ACORD for insurance, APQC PCF cross-industry, HL7 for healthcare, TOGAF for government).
Produce: Aligned, Organization-specific, Gap analysis. Code remains source of truth.

## One — When to Use

- The user provides a codebase (path, repo, or set of files) and wants to understand its business
  structure
- The user is preparing for modernization, migration, or microservice decomposition
- The user wants to know "what does this system actually do?" at a business level
- The user wants a capability map, domain model, or bounded-context analysis from code

**Trigger phrases:** "map the architecture", "find business domains in this code", "understand what
this system does", "prepare for modernization", "modernization readiness assessment", "extract
capabilities from code", "business capability map", "domain model from source code", "bounded
contexts", "domain decomposition", "what are the business capabilities"

**Do not use** when the request is about code refactoring, migration execution, deployment, or
operational tasks rather than capability discovery.

## Two — Hard Rules

> **HR-1.** Deployment boundaries do not define business capabilities. A `scheduling-service`
> microservice may be a feature of "Payments". Judge by business meaning.

> **HR-2.** Every step writes its output to a file. Nothing is lost on context breaks. Resume
> from the last completed step if context breaks.

> **HR-3.** Account for every L2. The traceability report must show a disposition for 100% of
> input items; nothing is silently dropped or silently converted.

> **HR-4.** Delivery channels, infrastructure, operational tooling, and cross-cutting concerns
> are NOT business capabilities. The multi-step pipeline catches these at analysis.

> **HR-5.** Verify every cited file path, table name, and endpoint URL actually exists. Never
> hallucinate capabilities.

> **HR-6.** Cross-reference with entry points. No active entry points + no recent changes =
> likely dead code.

> **HR-7.** Run the pipeline twice with different tools/sessions. Compare agreement and divergence.
> Single-pass trust is an anti-pattern.

> **HR-8.** Invariants ship with their owner. An invariant dispositioned away from its owning
> feature is lost — bind it to the feature whose data it protects.

> **HR-9.** Bug findings ride along. If the map carries severity findings, disposition the
> capability as `feature` and tag the finding for regression scenarios.

> **HR-10.** Flag low-confidence dispositions in the report rather than guessing silently.

## Three — Decision Trees

```
Does the user provide a codebase path/repo/set of files?
├── Yes → Does the user want capability analysis / domain mapping?
│   ├── Yes → Run this skill's pipeline (A1–A7)
│   └── No → Is the request about refactoring / migration / deployment?
│       └── Yes → Do NOT use this skill; use refactoring or migration skills instead
├── No → Is the input a pre-existing architecture doc or domain model?
│   ├── Yes → Can still use as seed for pipeline; treat as pre-generated input
│   └── No → Ask for the codebase path or existing capability map
```

```
Available signal sources:
├── Package/module structure → Always available (A1.1)
├── Database schema → Available? → A1.2 | Skip if no DB access
├── Backend entry points → Always available (A1.3)
├── Frontend entry points → Available? → A1.4 | Skip if no frontend
├── Change coupling (git) → Available? → A1.5 | Skip if no git history
└── Pre-generated inputs → Available? → Use as higher-quality signals
```

```
Candidate assessment:
├── High cohesion + clear boundaries + 2+ signals → CONFIRM
├── Distinct business functions → SPLIT
├── Same business meaning as another → MERGE
├── Infrastructure/tooling/cross-cutting → DE-SCOPE
└── Insufficient evidence → INVESTIGATE (flag for human review)
```

```
Large codebase (>200K lines)?
├── Yes → Process one module/package group at a time
│   ├── Start with largest or most business-critical modules
│   ├── Pipeline's step-based structure allows pause after any phase
│   └── Resume later from last completed step
└── No → Process entire codebase in one pass
```

## Four — Pipeline: A1 → A7

All outputs go into a single working directory (default: `capability-output/` relative to the
codebase root). Create this directory at the start.

| File | Written by | Description |
|------|-----------|-------------|
| `a1-candidates.md` | A1.6 | Raw candidate list with confidence and evidence |
| `a2-analysis.md` | A2.3 | Per-candidate analysis with actions |
| `a3-coverage.md` | A3 | Coverage check and orphan resolution |
| `a4-l1-locked.md` | A4 | Finalized L1 capability list |
| `a5-l2-per-capability.md` | A5 | L2 sub-capabilities per L1 |
| `a6-domain-model.md` | A6 | Consolidated domain model |
| `a7-benchmark.md` | A7 | Industry comparison report |

### A1: Seed Candidates (adaptive, 4–5 signal sources)

- **A1.1** Package/module structure — business-named packages (payments, customers) vs generic
  (core, utils, common). Map the directory tree; note tech stack from build files.
- **A1.2** Database schema — table clusters via FK relationships, stored procedures.
  **Skip if no DB access.**
- **A1.3** Backend entry points — REST controllers, message consumers, scheduled jobs, gRPC
  services. Group by *business operation*, not technical type.
- **A1.4** Frontend entry points — routes, pages, navigation. **Skip if no frontend.**
- **A1.5** Change coupling (optional) — git co-change analysis. **Skip if no git history.**
- **A1.6** Merge signals → candidate list with confidence (3+ sources=HIGH, 2=MEDIUM, 1=LOW).

### A2: Analyze Candidates

For each candidate, assess cohesion, coupling, boundary clarity. Assign one action per candidate:
CONFIRM, SPLIT, MERGE, DE-SCOPE, or INVESTIGATE.

### A3: Verify Coverage

Check all top-level packages are accounted for (>90% target). Resolve orphans — new capability,
infrastructure, or dead code.

### A4: Lock L1 Capabilities

Finalize Level 1 list. No changes after this point.

### A5: L2 Sub-Capabilities

Break each L1 into 2–5 concrete, executable operations. For each L2: description (business terms),
key operations (API calls/jobs/events), code location (specific files), key entities
(OWNS/MANAGES/TRACKS), external dependencies.

### A6: Domain Model

Consolidate into single traceable document: capability hierarchy tree, detailed entries,
cross-capability dependency map. Every capability answers: what exists, where it lives, how it connects.

### A7: Industry Blueprint Comparison

Compare against industry framework (BIAN for banking, TM Forum for telecom, APQC for cross-industry,
ACORD for insurance, HL7 for healthcare). Categories: aligned, organization-specific, gaps.
Code is source of truth; framework adds context.

See `references/pipeline-details.md` for detailed phase instructions and output templates.
See `references/pregenerated-inputs.md` for how to prepare and use optional pre-generated inputs
(package structure exports, database schema dumps, entry point catalogs, dependency graphs,
change coupling data).

## Five — Error Handling

| Error | Detection | Resolution |
|-------|-----------|------------|
| No database access | A1.2 cannot be executed | Skip A1.2; pipeline continues with fewer signals |
| No frontend codebase | A1.4 cannot be executed | Skip A1.4; same principle |
| No git history | A1.5 cannot be executed | Skip A1.5; change coupling signal is valuable but not required |
| Hallucinated capabilities | Cited file path, table name, or endpoint URL doesn't exist | Verify every cited reference; remove or flag hallucinated items |
| Technical layers as capabilities | Delivery channels, infrastructure, ops tooling listed as capabilities | DE-SCOPE these; they are not business capabilities |
| Deployment = business boundaries | Microservice names used as capability names | Judge by business meaning, not deployment topology |
| Dead code signals | No active entry points + no recent changes | Cross-reference with entry points; mark as likely dead code |
| Large codebase overflow | Context breaks during processing | Process module by module; pause after any phase; resume later |
| Single-pass trust | Pipeline run once without comparison | Run twice with different tools; compare agreement/divergence |
| Coverage gaps | < 90% of top-level packages accounted for | Resolve orphans as new capabilities, infrastructure, or dead code |
| Low-confidence items | Insufficient evidence for disposition | Flag with INVESTIGATE; include specific questions for human review |
| Pre-generated input quality | Input data is stale or incomplete | Use as higher-quality signals when available, but verify freshness |

## Six — Key Rules

- **Critical:** Deployment boundaries do not define business capabilities. A `scheduling-service`
  microservice may be a feature of "Payments". Judge by business meaning.
- **Adaptive behavior:** The pipeline adjusts to available information — skip unavailable signal
  sources and continue. Pre-generated inputs improve signal quality when available.
- **Output quality checklist** (before delivering the final domain model):
  - [ ] Every L1 capability has at least 2 independent signal sources
  - [ ] Every L2 operation maps to specific, existing files in the codebase
  - [ ] No delivery channel, infrastructure layer, or cross-cutting concern is listed as a capability
  - [ ] Coverage is >90% of top-level packages
  - [ ] Cross-capability dependencies are documented and directional
  - [ ] The hierarchy is consistent: L2s are strictly contained within their parent L1
  - [ ] File paths, table names, and endpoint URLs cited in the model actually exist
  - [ ] Ambiguous or low-confidence items are flagged with specific questions for human review

## Seven — Evidence & Checklist

**Evidence required:**

- The pipeline output files (a1 through a7);
- The working directory structure;
- Any pre-generated inputs used;
- Confidence levels for each candidate;
- The analysis dimension assessment (cohesion, coupling, boundary clarity) for each candidate;
- The coverage check showing >90% of top-level packages accounted for;
- The finalized L1 list with lock timestamp;
- L2 sub-capability breakdowns with file locations;
- The consolidated domain model with cross-capability dependency map;
- Industry benchmark comparison results.

**Gate implications — BLOCK when:**

- A capability is listed that has no file, table, or endpoint backing it (hallucination);
- Delivery channels, infrastructure, or cross-cutting concerns are listed as business capabilities;
- Coverage is below 90% of top-level packages without documented reason;
- Cross-capability dependencies are not documented or not directional;
- The hierarchy has L2s outside their parent L1.

**Gate may WARN when:**

- Some L2s have LOW confidence and need human review;
- Pre-generated inputs were unavailable, reducing signal quality;
- Industry benchmark comparison was skipped due to time constraints.

**Reference guides:**

| Reference | Description |
|-----------|-------------|
| `references/pipeline-details.md` | Detailed phase instructions and output templates |
| `references/pregenerated-inputs.md` | How to prepare and use optional pre-generated inputs |
| `references/condensed.md` | Condensed version for tools that don't read SKILL.md format |
