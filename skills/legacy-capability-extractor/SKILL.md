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

## Phase A1: Seed Candidates

Extract independent signals from the codebase, then merge them into a candidate list.

### A1.1 Package/Module Structure Analysis

Read the top-level directory tree and key configuration files to identify how the code is organized.

**What to do:**

1. List the top-level source directories (e.g., `src/main/java/com/company/`). Use `LS` and `Glob`
   to map the package tree — do not read every file.
2. Identify naming patterns that signal business intent (e.g., `payments`, `customers`, `lending`)
   versus generic or ambiguous names (e.g., `common`, `utils`, `core`, `helpers`, `shared`).
3. Note the tech stack and framework from build files (`pom.xml`, `build.gradle`, `package.json`,
   `requirements.txt`, `go.mod`, etc.) — this shapes how you interpret later signals.
4. Record package-to-business-signal mapping.

**Strong signals:** Package names that directly name a business domain (orders, payments, customers,
inventory, claims). **Weak signals:** Technical or cross-cutting names (core, platform, shared,
infrastructure, config). **Ambiguous signals:** Names that could go either way (management,
services, processing, operations) — flag these for later resolution.

### A1.2 Database Schema Analysis

Skip this step entirely if no database access is available (no SQL files, no migration scripts,
no DB connection). Do not guess.

**What to do:**

1. Find DDL files: look for `.sql` migration files, `schema.sql`, `flyway/`, `liquibase/`,
   `prisma/schema.prisma`, `entity/` or `model/` directories with ORM annotations.
2. Identify table clusters — groups of tables that share name prefixes or foreign key
   relationships. A cluster like `customer_addresses`, `customer_phones`, `customer_documents`
   all pointing to `customers` signals one domain.
3. Look for stored procedures or views grouped by business area.
4. Map table clusters to potential business capabilities.

**Improvement over naive analysis:** Use foreign-key relationship density to identify natural
boundaries. Tables connected by many foreign keys likely belong to the same domain. Tables with
few or no FK connections may be cross-cutting (reference data, configuration) or orphans. If FK
metadata is incomplete, use naming conventions and column overlap (shared column names like
`customer_id` appearing across tables) as a weaker proxy.

### A1.3 Backend Entry Point Analysis

Identify what operations the system exposes to the outside world or to other components.

**What to do:**

1. Find entry point files: REST controllers (`@RestController`, `@Controller`, `@Path`),
   GraphQL resolvers, gRPC service definitions (`.proto` files), message consumers
   (`@KafkaListener`, `@RabbitListener`, `@SqsListener`), scheduled jobs (`@Scheduled`,
   `cron`), and CLI command definitions.
2. For each entry point, extract: HTTP method/path or event topic, handler method name, and
   the business noun it operates on.
3. Group entry points by the business operation they perform, NOT by their technical type.
   A `PaymentController`, a `RecurringPaymentJob`, and a `MoneyTransferConsumer` are evidence
   of the same "Payments" capability — not three separate ones.

**Output format per entry point:**
```
[TYPE] METHOD/PATH → HANDLER → BUSINESS_NOUN
e.g., [REST] POST /api/v1/payments → PaymentController.create() → payments
     [JOB]  @Scheduled(cron="0 0 * * *") → ReconcileJob.run() → payments
     [MSG]  payment.completed → PaymentEventHandler.handle() → payments
```

### A1.4 Frontend/UI Entry Point Analysis

Skip this step if the system has no frontend (API-only service, batch system, library). Do not
invent frontend routes that don't exist.

**What to do:**

1. Find route definitions, page components, navigation menus, and feature module directories.
2. Map user-facing pages/screens to the business operations they support.
3. Group by business operation (same rule as A1.3).

### A1.5 Change Coupling Analysis (Optional — if git history is available)

This is an additional signal source not in the original pipeline but highly valuable. Files that
change together in version control history typically implement the same business feature.

**What to do:**

1. Run `git log --name-only --pretty=format: --since="6 months ago" | sort | uniq -c | sort -rn`
   to get file change frequency.
2. Use `git log --name-only --pretty=format: -p | ...` patterns to identify files that
   frequently appear in the same commits (co-change groups).
3. Co-changing file groups that span packages are strong evidence of a shared business capability.
   If `PaymentService.java`, `PaymentRepository.java`, and `payment-styles.css` always change
   together, they reinforce the "Payments" signal.

If git history is unavailable or too large to process, skip this step.

### A1.6 Merge Signals and Format Candidate List

Combine all signals from A1.1–A1.5 into a unified candidate list.

**Merging rules:**

- A candidate appearing across 3+ signal sources: **HIGH** confidence.
- A candidate appearing in 2 signal sources: **MEDIUM** confidence.
- A candidate appearing in only 1 signal source: **LOW** confidence.
- If signals conflict (e.g., package structure says "management" is one thing, entry points say
  another), document the conflict — don't resolve it here.

**Output format (`a1-candidates.md`):**

```markdown
# Capability Candidates — [System Name]

## HIGH confidence (N candidates)
1. **[Name]** — Evidence: [package: X, entry points: Y, DB: Z, ...]
2. ...

## MEDIUM confidence (N candidates)
1. **[Name]** — Evidence: [package: X, entry points: Y] — Flag: [why not high]
2. ...

## LOW confidence (N candidates)
1. **[Name]** — Evidence: [single source] — Flag: [why weak]
2. ...

## Signal source summary
- Package structure: N packages analyzed, M business-significant
- Database schema: N tables in K clusters (or: skipped)
- Backend entry points: N endpoints across M controllers
- Frontend entry points: N routes (or: skipped)
- Change coupling: N co-change groups identified (or: skipped)
```

Typical output: 15–25 candidates for a 100K+ line codebase.

---

## Phase A2: Analyze Candidates

Examine each candidate to determine whether it represents a real business capability.

### A2.1 Deep Candidate Analysis

For each candidate from A1, assess three dimensions:

1. **Cohesion:** Do the files in this candidate's scope work together toward one business purpose?
   High cohesion supports capability status. Low cohesion (files doing unrelated things) suggests
   the candidate needs splitting.

2. **Coupling:** How much does this candidate depend on other candidates, and how much do others
   depend on it? Read key service/interface files (not every file) to identify import/dependency
   relationships. Heavy bidirectional coupling between two candidates suggests they should merge.

3. **Boundary clarity:** Are there clear interfaces (APIs, service contracts, event contracts)
   defining what this candidate does? Sharp boundaries support independence. Fuzzy boundaries
   (direct database access across candidates, shared mutable state) suggest the boundary is
   artificial and may need redrawing.

### A2.2 Action Determination

For each candidate, assign exactly one action:

| Action | When to use |
|--------|-------------|
| **CONFIRM** | High cohesion, clear boundaries, confirmed by 2+ signals. It's a real capability. |
| **SPLIT** | Contains genuinely distinct business functions that should be separate. |
| **MERGE** | Business meaning is the same as another candidate; technical separation is deployment artifact. |
| **DE-SCOPE** | Infrastructure, tooling, cross-cutting concern, or test harness — not a business capability. |
| **INVESTIGATE** | Insufficient evidence to decide. Flag for human review with specific questions. |

**Critical distinction:** Deployment boundaries do not define business capabilities. A
`scheduling-service` microservice is not necessarily a separate capability — it may be a feature
of "Payments" defined by an additional parameter (frequency). Judge by business meaning, not
technical packaging.

### A2.3 Consolidate Actions

Write all actions to `a2-analysis.md`:

```markdown
# Candidate Analysis

## Confirmed as L1 Capabilities
| # | Candidate | Confidence | Rationale |
|---|-----------|-----------|-----------|
| BC-001 | Customer Onboarding | HIGH | Cohesive package, 4 REST endpoints, owns 3 DB tables |

## Splits
| Original | Into | Reason |
|----------|------|--------|
| Deposits | Deposits - Personal, Deposits - Group | Different target audiences, separate DB schemas |

## Merges
| Candidates | Merged Into | Reason |
|-----------|-------------|--------|
| Payments - Scheduling, Payments - Domestic | Payments | Scheduling is a feature of payments, not a separate domain |

## De-scoped (Not Business Capabilities)
| Candidate | Reason |
|-----------|--------|
| Core Banking Integration | Infrastructure layer, provides connectivity not business function |
| Administration & Oversight | Operational tooling |

## Flagged for Investigation
| Candidate | Open Question |
|-----------|--------------|
| Gamification | No frontend routes found — is this feature active or deprecated? |
```

---

## Phase A3: Verify Coverage

Ensure no significant business function is missed.

### A3.1 Coverage Check

1. Take the list of all top-level packages/directories from A1.1.
2. For each, check whether it is accounted for in the confirmed or merged capabilities from A2.
3. Calculate coverage percentage: `(packages accounted for) / (total packages) * 100`.
4. Target: >90%. If below, investigate the uncovered packages.

### A3.2 Orphan Resolution

For each uncovered package:

1. Read its key files to understand what it does.
2. Determine: Is it a new capability not yet captured? Infrastructure? Dead code?
3. If it's a new capability, add it to the candidate list and analyze it (loop back to A2.1).
4. If infrastructure or dead code, document and exclude.

Write results to `a3-coverage.md`.

---

## Phase A4: Lock L1 Capabilities

Finalize the Level 1 capability list. This is the "what exists" view.

Write to `a4-l1-locked.md`:

```markdown
# L1 Business Capabilities — [System Name]

| ID | Capability | Description | Key Signals |
|----|-----------|-------------|-------------|
| BC-001 | Customer Onboarding | Orchestrates customer acquisition from registration through KYC | 4 endpoints, 3 tables, dedicated package |
| BC-002 | Account Management | ... | ... |
```

Lock this list. No further additions or changes at L1 after this point. L2 decomposition
happens in the next phase.

---

## Phase A5: L2 Sub-Capabilities

Break each L1 into concrete, executable business operations.

### A5.1 Scope L2 Candidates

For each L1 capability:

1. List the files, endpoints, and entities owned by this capability (from A2 evidence).
2. Identify distinct operations within the capability — things a team could independently
   build, test, deploy, or migrate.
3. Aim for 2–5 L2s per L1. More than 5 suggests the L1 may be too broad; fewer than 1
   means the L1 is already operational-level and should have been an L2.

### A5.2 Refine L2 Analysis

For each L2 candidate, document:

- **Description:** What this operation does in business terms (not technical terms).
- **Key Operations:** The specific API calls, jobs, or events it handles.
- **Code Location:** Specific files/packages that implement it.
- **Key Entities:** Database tables or domain objects it OWNS, MANAGES, or TRACKS.
- **External Dependencies:** Third-party services or other capabilities it depends on.

### A5.3 Lock L2 List

Write to `a5-l2-per-capability.md` with this structure per L1:

```markdown
## BC-001: Customer Onboarding (2 L2s)

### BC-001-01: Customer Registration & Account Provisioning
**Description:** Creates new customer records and provisions their primary accounts.

**Key Operations:**
- Create customer account (POST /api/v1/origination/customers)
- Validate email/phone uniqueness
- Register customer in core banking
- Provision primary current account

**Code Location:**
- `customers-origination-app/.../customersorigination/`

**Key Entities:**
- OWNS: Customer (customers table)
- CREATES: Person (persons table)
- PROVISIONS: Account (accounts table)

**External Dependencies:**
- Core Banking System (customer registration)
- Wise (international payments user creation)

**Cross-Capability Dependencies:**
- → BC-002 Account Management (provisions primary account)
- → BC-003 Customer Profile Management (creates Person entity)
```

---

## Phase A6: Generate Domain Model

Consolidate everything into a single traceable domain model document.

Write to `a6-domain-model.md`:

```markdown
# Domain Model — [System Name]

## Capability Hierarchy

[System Name]
├── BC-001: [L1 Name]
│   ├── BC-001-01: [L2 Name]
│   └── BC-001-02: [L2 Name]
├── BC-002: [L1 Name]
│   └── ...
└── ...

## Detailed Capability Entries

[Full detail from A5 for each capability]

## Cross-Capability Dependency Map

| From | To | Nature | Shared Entity |
|------|----|--------|---------------|
| BC-001-01 | BC-003 | Creates | Person |
```

The domain model answers three questions for every capability:
1. **What exists** — the capability name and description.
2. **Where it lives** — specific files, packages, endpoints.
3. **How it connects** — dependencies on other capabilities and external services.

This is the primary deliverable. The purpose of the capability map is not decoration — it's
to give teams a concrete boundary they can act on. "Payments spans 32 files across 2 packages,
owns 4 entities, exposes 8 endpoints" is a real boundary. That's what you hand to a team and say
"this is your migration slice."

---

## Phase A7: Industry Blueprint Comparison

Compare the code-derived model against an industry reference to add strategic context.

**Available reference frameworks by industry:**

| Industry | Framework | Notes |
|----------|-----------|-------|
| Banking / Financial Services | BIAN (Banking Industry Architecture Network) | v12.0; maps to DDD bounded contexts |
| Telecommunications | TM Forum | Digital-first reference architecture |
| Insurance | ACORD / BIAN extensions | Claims, underwriting, policy management |
| Cross-industry | APQC PCF (Process Classification Framework) | Generic capability taxonomy |
| Healthcare | HL7 / HIMSS | Clinical and administrative capabilities |
| Public Sector / Government | TOGAF with domain overlays | Varies by jurisdiction |

**What to do:**

1. Identify the relevant industry framework (ask the user if unclear).
2. Compare the code-derived capabilities against the framework's capability taxonomy.
3. Produce three categories:
   - **Aligned:** Capabilities present in both the code and the framework.
   - **Organization-specific:** Capabilities in the code but not in the framework (custom
     business logic, competitive differentiators).
   - **Gap analysis:** Capabilities in the framework but absent from the code. These drive
     targeted questions: Is this handled by an external system? A manual process? A genuine gap?

**Important:** The code remains the source of truth. The industry framework adds context — it
does not override what was found in the codebase.

Write to `a7-benchmark.md`.

---

## Anti-Patterns and Pitfalls

These are the most common ways capability extraction goes wrong. Avoid them.

### 1. Treating technical layers as business capabilities

Delivery channels (Mobile App, Web Portal), infrastructure layers (Core Banking Integration,
Message Bus), operational tooling (Admin Panel, Test Harness), and cross-cutting concerns
(Logging, Monitoring, Authentication) are NOT business capabilities. A single-pass LLM prompt
will frequently misclassify these because they have large code footprints and prominent
structures. The multi-step pipeline catches these at the A2 analysis stage.

### 2. Confusing deployment boundaries with business boundaries

A microservice called `scheduling-service` is not necessarily a separate capability. It may
implement a feature of "Payments" (scheduling is defined by a frequency parameter). Judge by
business meaning, not technical packaging.

### 3. Trusting a single analysis pass

Run the pipeline at least twice using different AI tools or sessions. Compare where they
agree (high confidence) and where they diverge (needs investigation). A half-right capability
map is more dangerous than a completely wrong one because it reads professionally and gets
nodded through.

### 4. Hallucinated capabilities

LLMs can fabricate capability names, package paths, or endpoint URLs that don't exist in the
actual codebase. For every candidate, verify that the cited evidence (file paths, table names,
endpoint URLs) actually exists before promoting it. This is why each step writes to files — it
creates an audit trail that can be spot-checked.

### 5. Ignoring dead code and legacy artifacts

Old features, deprecated APIs, and unused packages can generate phantom capability signals.
Cross-reference with entry point analysis (A1.3/A1.4) — if a package has no active entry points
and no recent git changes, it may be dead code.

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

---

## Cross-Tool Compatibility

This skill follows the open **Agent Skills** standard — a `SKILL.md` folder that any compatible
tool discovers at a well-known path (e.g. `.claude/skills/`, `.codex/skills/`, `.opencode/skills/`,
`.cursor/skills/`, `.github/skills/`, `.kiro/skills/`, `.gemini/skills/`, `.kilocode/skills/`). The
`SKILL.md` above is the single source of truth; it is installed unmodified into each tool.

To expose this skill to a target project, run the repo's `install.sh` (it symlinks this folder
into the chosen tool's path):

```bash
bash install.sh --tool claude,codex,cursor,kilocode,opencode --target /path/to/project
bash install.sh --list-tools          # show all supported tools and their paths
```

For tools that do not read `SKILL.md` natively (they only consume a project memory file such as
`AGENTS.md`/`CLAUDE.md`/`.windsurfrules`), point them at `references/condensed.md` — a flattened
copy of the pipeline above. Full install details and the progressive-disclosure model are in this
folder's `README.md`.