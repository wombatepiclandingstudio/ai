# Legacy Code Business Capability Extraction

When you are asked to discover, identify, map, or extract business capabilities, business domains,
bounded contexts, or functional boundaries from a codebase, follow this structured 7-phase pipeline.

## When to Activate
The user asks to: map the architecture, find business domains in code, understand what a system
does at a business level, prepare for modernization, extract capabilities, find bounded contexts,
generate a domain model from source code, or assess modernization readiness.

## Pipeline Summary

### A1: Seed Candidates
Extract independent signals from 4-5 sources (adaptive — skip unavailable ones):
- **A1.1** Package/module structure analysis — business-named packages vs generic ones
- **A1.2** Database schema analysis (SKIP if no DB access) — table clusters via FK relationships
- **A1.3** Backend entry point analysis — REST controllers, message consumers, scheduled jobs. Group by business operation, not technical type.
- **A1.4** Frontend entry point analysis (SKIP if no frontend) — routes, pages, navigation
- **A1.5** Change coupling analysis (SKIP if no git) — co-changing files in git history
- **A1.6** Merge all signals → candidate list with HIGH/MEDIUM/LOW confidence ratings. Write `a1-candidates.md`.

### A2: Analyze Candidates
Assess each candidate on cohesion, coupling, boundary clarity. Assign one action per candidate:
- CONFIRM (real business capability), SPLIT (too broad), MERGE (same as another), DE-SCOPE (infrastructure/cross-cutting), INVESTIGATE (needs human review).
- Deployment boundaries do NOT define business capabilities. Write `a2-analysis.md`.

### A3: Verify Coverage
Ensure >90% of top-level packages are accounted for. Resolve orphans. Write `a3-coverage.md`.

### A4: Lock L1 Capabilities
Finalize Level 1 capability list. No further changes. Write `a4-l1-locked.md`.

### A5: L2 Sub-Capabilities
Break each L1 into 2-5 concrete operations with: description, key operations, code locations, entities owned, external dependencies. Write `a5-l2-per-capability.md`.

### A6: Domain Model
Consolidate hierarchy tree + detailed entries + cross-capability dependency map. Write `a6-domain-model.md`.

### A7: Industry Blueprint Comparison
Compare against BIAN (banking), TM Forum (telecom), APQC (cross-industry), ACORD (insurance), HL7 (healthcare). Code is source of truth. Write `a7-benchmark.md`.

## Critical Rules
- Technical layers (delivery channels, infrastructure, admin panels, auth/logging) are NOT business capabilities — de-scope them
- A microservice name does not define a capability — judge by business meaning
- Verify every cited file path, table name, and endpoint actually exists before promoting a candidate
- Run the pipeline at least twice with different AI tools/sessions and compare results