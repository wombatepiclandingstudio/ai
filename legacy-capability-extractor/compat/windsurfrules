# Legacy Code Business Capability Extraction

When asked to discover, identify, map, or extract business capabilities from a codebase, follow
this 7-phase pipeline. The pipeline is adaptive — skip unavailable data sources.

## When to Use
User asks to: map architecture, find business domains, understand what the system does,
prepare for modernization, extract capabilities, find bounded contexts, generate domain model.

## A1: Seed Candidates
- A1.1 Package structure — business names (payments, customers) = strong; generic (core, utils) = weak
- A1.2 DB schema (skip if no DB) — table clusters via foreign keys
- A1.3 Backend entry points — controllers, consumers, jobs. Group by business operation, not type.
- A1.4 Frontend (skip if none) — routes, pages, navigation
- A1.5 Change coupling (skip if no git) — co-changing files in history
- A1.6 Merge → candidates with HIGH/MEDIUM/LOW confidence. Output: a1-candidates.md

## A2: Analyze → Assign Action
CONFIRM (real capability) | SPLIT (too broad) | MERGE (same as another) |
DE-SCOPE (infrastructure, NOT a capability) | INVESTIGATE (needs review)
Output: a2-analysis.md

## A3: Coverage Check (>90% target) → a3-coverage.md
## A4: Lock L1 list → a4-l1-locked.md
## A5: L2 sub-capabilities (2-5 per L1, with file locations) → a5-l2-per-capability.md
## A6: Domain model (hierarchy + dependencies) → a6-domain-model.md
## A7: Industry comparison (BIAN/APQC/etc.) → a7-benchmark.md

## Rules
- Tech layers (channels, infra, admin, auth) are NOT capabilities
- Deployment boundaries ≠ business boundaries
- Verify every cited file/table/endpoint exists
- Run twice, compare results