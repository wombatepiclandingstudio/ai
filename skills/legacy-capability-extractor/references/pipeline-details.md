# Pipeline Details — Legacy Capability Extractor

## Phase A1: Seed Candidates

Extract independent signals from the codebase, then merge them into a candidate list.

### A1.1 Package/Module Structure Analysis

Read the top-level directory tree and key configuration files to identify how the code is organized.

1. List the top-level source directories. Use `LS` and `Glob` to map the package tree — do not read every file.
2. Identify naming patterns that signal business intent (e.g., `payments`, `customers`, `lending`) versus generic names (e.g., `common`, `utils`, `core`).
3. Note the tech stack and framework from build files (`pom.xml`, `build.gradle`, `package.json`, `requirements.txt`, `go.mod`).
4. Record package-to-business-signal mapping.

**Signal strength:** Package names that directly name a business domain = strong. Technical/cross-cutting names = weak. Ambiguous names (management, services, operations) = flag for later.

### A1.2 Database Schema Analysis

Skip if no database access is available. Do not guess.

1. Find DDL files: `.sql` migrations, `schema.sql`, `flyway/`, `liquibase/`, `prisma/schema.prisma`, `entity/` or `model/` directories with ORM annotations.
2. Identify table clusters — groups sharing name prefixes or FK relationships.
3. Look for stored procedures or views grouped by business area.
4. Map table clusters to potential business capabilities.

Use FK relationship density to identify natural boundaries. Tables with many FKs likely belong to the same domain.

### A1.3 Backend Entry Point Analysis

1. Find entry point files: REST controllers, GraphQL resolvers, gRPC `.proto` files, message consumers, scheduled jobs, CLI commands.
2. For each, extract: HTTP method/path or event topic, handler method name, business noun.
3. Group by business operation, NOT by technical type.

```
[TYPE] METHOD/PATH → HANDLER → BUSINESS_NOUN
e.g., [REST] POST /api/v1/payments → PaymentController.create() → payments
     [JOB]  @Scheduled(cron="0 0 * * *") → ReconcileJob.run() → payments
```

### A1.4 Frontend/UI Entry Point Analysis

Skip if no frontend. Find route definitions, page components, navigation menus. Map to business operations.

### A1.5 Change Coupling Analysis (Optional — if git history is available)

Files that change together typically implement the same business feature.

1. `git log --name-only --pretty=format: --since="6 months ago" | sort | uniq -c | sort -rn`
2. Identify co-change groups spanning packages — strong evidence of shared capability.

### A1.6 Merge Signals and Format Candidate List

**Merging rules:**
- 3+ signal sources: **HIGH** confidence
- 2 signal sources: **MEDIUM** confidence
- 1 signal source: **LOW** confidence
- Conflicting signals: document, don't resolve

Typical output: 15–25 candidates for a 100K+ line codebase.

---

## Phase A2: Analyze Candidates

### A2.1 Deep Candidate Analysis

For each candidate, assess:
1. **Cohesion:** Do files work together toward one business purpose?
2. **Coupling:** Dependencies on other candidates. Heavy bidirectional = merge candidate.
3. **Boundary clarity:** Clear interfaces (APIs, contracts)? Fuzzy = boundary may be artificial.

### A2.2 Action Determination

| Action | When |
|--------|------|
| **CONFIRM** | High cohesion, clear boundaries, 2+ signals |
| **SPLIT** | Distinct business functions that should be separate |
| **MERGE** | Same business meaning; technical separation is deployment artifact |
| **DE-SCOPE** | Infrastructure, tooling, cross-cutting concern — not a business capability |
| **INVESTIGATE** | Insufficient evidence. Flag for human review |

**Critical:** Deployment boundaries do not define business capabilities. Judge by business meaning.

### A2.3 Consolidate Actions

Write to `a2-analysis.md` with sections: Confirmed, Splits, Merges, De-scoped, Flagged for Investigation.

---

## Phase A3: Verify Coverage

1. Take all top-level packages from A1.1
2. Check each is accounted for in confirmed/merged capabilities
3. Coverage target: >90%
4. For uncovered packages: new capability? Infrastructure? Dead code?

---

## Phase A4: Lock L1 Capabilities

Finalize the L1 list. No further additions after this point.

---

## Phase A5: L2 Sub-Capabilities

For each L1:
1. List files, endpoints, entities owned
2. Identify distinct operations (2–5 L2s per L1)
3. Document: description, key operations, code location, key entities, external dependencies, cross-capability dependencies

---

## Phase A6: Generate Domain Model

Consolidate into `a6-domain-model.md` with:
- Capability hierarchy (tree view)
- Detailed capability entries (from A5)
- Cross-capability dependency map

The domain model answers: What exists? Where does it live? How does it connect?

---

## Phase A7: Industry Blueprint Comparison

| Industry | Framework |
|----------|-----------|
| Banking / Financial Services | BIAN v12.0 |
| Telecommunications | TM Forum |
| Insurance | ACORD / BIAN extensions |
| Cross-industry | APQC PCF |
| Healthcare | HL7 / HIMSS |
| Public Sector / Government | TOGAF |

Compare code-derived capabilities against framework. Produce: Aligned, Organization-specific, Gap analysis.

Code remains source of truth. Framework adds context.
