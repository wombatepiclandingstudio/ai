# Business Capability Extraction from Legacy Code

When the user asks to discover, identify, map, or extract business capabilities, business domains,
bounded contexts, or functional boundaries from a codebase, follow this structured pipeline.

## Trigger Phrases
- "map the architecture", "find business domains in this code", "understand what this system does"
- "prepare for modernization", "modernization readiness assessment"
- "extract capabilities from code", "business capability map", "domain model from source code"
- "bounded contexts", "domain decomposition", "what are the business capabilities"

## Pipeline: A1 → A7

### A1: Seed Candidates (4–5 signal sources, adaptive)
- **A1.1** Package/module structure — business-named packages (payments, customers) vs generic (core, utils, common). Map the directory tree; note tech stack from build files.
- **A1.2** Database schema — table clusters via FK relationships, stored procedures. **Skip if no DB access.**
- **A1.3** Backend entry points — REST controllers, message consumers, scheduled jobs, gRPC services. Group by *business operation*, not technical type. A PaymentController + RecurringPaymentJob = same "Payments" signal.
- **A1.4** Frontend entry points — routes, pages, navigation. **Skip if no frontend.**
- **A1.5** Change coupling (optional) — git co-change analysis. Files that change together implement the same feature. **Skip if no git history.**
- **A1.6** Merge signals → candidate list with confidence (3+ sources=HIGH, 2=MEDIUM, 1=LOW). Output: `a1-candidates.md`.

### A2: Analyze Candidates
For each candidate, assess **cohesion** (single purpose?), **coupling** (dependencies), **boundary clarity** (sharp interfaces?). Then assign one action:
- **CONFIRM** — real business capability (high cohesion, 2+ signals, clear boundaries)
- **SPLIT** — contains distinct functions that should separate
- **MERGE** — same business meaning as another; technical separation is deployment artifact
- **DE-SCOPE** — infrastructure, tooling, cross-cutting concern (NOT a business capability)
- **INVESTIGATE** — insufficient evidence, flag for human review

**Critical:** Deployment boundaries ≠ business boundaries. A `scheduling-service` microservice may be a feature of Payments, not a separate capability. Judge by business meaning.

### A3: Verify Coverage
Check all top-level packages are accounted for (>90% target). Resolve orphans — new capability, infrastructure, or dead code. Output: `a3-coverage.md`.

### A4: Lock L1 Capabilities
Finalize Level 1 list. No changes after this point. Output: `a4-l1-locked.md`.

### A5: L2 Sub-Capabilities
Break each L1 into 2–5 concrete, executable operations. For each L2: description (business terms), key operations (API calls/jobs/events), code location (specific files), key entities (OWNS/MANAGES/TRACKS), external dependencies. Output: `a5-l2-per-capability.md`.

### A6: Domain Model
Consolidate into single traceable document: capability hierarchy tree, detailed entries, cross-capability dependency map. Every capability answers: what exists, where it lives, how it connects. Output: `a6-domain-model.md`.

### A7: Industry Blueprint Comparison
Compare against industry framework (BIAN for banking, TM Forum for telecom, APQC for cross-industry, ACORD for insurance, HL7 for healthcare). Categories: aligned, organization-specific, gaps. Code is source of truth; framework adds context. Output: `a7-benchmark.md`.

## Anti-Patterns
1. **Technical layers as capabilities** — delivery channels, infrastructure, admin panels, logging/auth are NOT business capabilities
2. **Deployment ≠ business boundaries** — microservice names don't define capabilities
3. **Single-pass trust** — run at least twice with different tools; compare agreement/divergence
4. **Hallucinated capabilities** — verify every cited file path, table name, endpoint actually exists
5. **Dead code artifacts** — cross-reference with entry points and recent git changes

## Adaptive Behavior
- No DB? Skip A1.2. No frontend? Skip A1.4. No git? Skip A1.5. Pipeline continues.
- Pre-generated inputs (nDepend exports, OpenAPI specs, CodeScene data, DDL dumps) improve signal quality when available.
- Large codebase (>200K lines)? Process module by module; pause after any phase.