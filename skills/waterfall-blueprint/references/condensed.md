# Waterfall Blueprint (condensed)

Condensed version of `SKILL.md` for tools that do not natively read the Agent Skills
`SKILL.md` format. Point your tool's memory/instructions file (e.g. `AGENTS.md`,
`CLAUDE.md`, `GEMINI.md`, `.windsurferules`) at this content. Canonical source: `SKILL.md`.

## Trigger Phrases

- "waterfall", "specification", "SRS", "design document", "blueprint"
- "requirements document", "formal specification", "phase-gate"
- "traceability matrix", "requirements tracing", "design review", "test plan"
- "IEEE 830", "IEEE 829", "IEEE 1016", "DOD-STD-2167A"
- "complete specification", "follow to the letter", "buildable spec"

## When to Use

- User has an idea or partial requirements and wants a complete, buildable specification
- User wants IEEE-standard documents (SRS, SDD, test plan) for a real project
- User wants interactive guidance through requirements elicitation with follow-up questions
- Starting a new project and wants thorough upfront specification before code

## Do Not Use When

- User wants to start coding immediately ("just build it", "skip the docs")
- User wants an agile/iterative approach
- User only wants a single document (this skill produces the full package)
- Project is a quick prototype or throwaway experiment

## Core Concepts

> "The payoff from quality planning... is very high. The single most important project failure cause is incomplete requirements." — Steve McConnell

**Seven-Phase Pipeline:**

```
Intake & Scoping → Requirements Elicitation → High-Level Design → Detailed Design
  → Implementation Planning → Test Planning → Deployment & Maintenance Planning
```

Each phase produces baselined documents and requires a formal gate review before proceeding.

**Configuration Management Baselines:**

| Baseline | Created When |
|----------|-------------|
| Functional Baseline | After SRS approval |
| Allocated Baseline | After SDD approval |
| Developmental Baseline | After DDS approval |
| Product Baseline | After testing |

**Bidirectional Traceability:** Business Need → SRS Requirement → SDD Module → DDS Spec → Test Case → Test Result.

## Pipeline

### Phase 0 — Intake & Scoping
Establish: project identity, business context, scope boundary (IN/OUT), stakeholder map, constraints, existing systems, success criteria. Produce one-page Project Context Document (PCD). Present to user for confirmation.

**Follow-up:** "Who is the primary user?", "Regulatory requirements?", "Target deployment?", "Integration points?", "Timeline?", "Sign-off authority?"

### Phase 1 — Requirements Elicitation & SRS (IEEE 830)
Work through 9 categories: Functional Requirements, External Interfaces, Performance, Database, Security, Safety, Quality Attributes, Assumptions, Constraints. Each requirement gets unique ID (FR-NNN) with: description, inputs, processing, outputs, pre/postconditions, error conditions, priority.

**Requirements quality:** necessary, unambiguous, complete, consistent, verifiable, traceable, modifiable, ranked.

**Follow-up strategy:** Drill down, enumerate, edge cases, quantified constraints, negatives, MoSCoW priorities, validation method.

### Phase 2 — High-Level Design / SDD (IEEE 1016)
Architecture decomposition, data flow (DFDs), data architecture (ERDs), interface design, technology selection (justified), risk identification. Module-to-requirement mapping must be 100%.

### Phase 3 — Detailed Design / DDS
For each module: purpose, inputs, outputs, algorithms (pseudocode), interface contracts, state diagrams, error handling, dependencies. Each spec is self-contained.

### Phase 4 — Implementation Planning
Coding standards, code review process (Fagan inspections), version control plan, build plan, developer assignments.

### Phase 5 — Test Planning (IEEE 829)
Test plan, test design, test case specs (traced to requirements), test procedures, entry/exit criteria. Cover: unit, integration, system, acceptance, performance, security, regression, usability.

### Phase 6 — Deployment & Maintenance
Deployment plan (with rollback), user documentation, maintenance plan, configuration management plan, quality assurance plan.

## Hard Rules

> **HR-1.** Never invent requirements. If not specified, ask.

> **HR-2.** Never stop asking until user says "that's complete" for each category.

> **HR-3.** Every requirement must have unique ID (FR-NNN) and be traceable.

> **HR-4.** Gate Review Report required at every phase transition. Even if user says "just move on," produce report and note skip as risk.

> **HR-5.** RTM updated at every gate review. 100% coverage mandatory.

> **HR-6.** No orphaned requirements or orphaned modules.

> **HR-7.** SRS must be technology-agnostic. Implementation details in SDD.

> **HR-8.** Changes to baselined documents require formal Change Request with impact analysis.

## Interactive Guidance Rules

1. Ask before assuming — never invent requirements
2. Drill down on vagueness — "fast" is not a requirement
3. Challenge contradictions — stop and resolve
4. Validate completeness — summarize and ask "what did I miss?"
5. Present progress — show generated documents for review
6. Record decisions — formal decisions with rationale
7. Flag risks — assumptions and unclear constraints
8. Never skip a gate — even if user says "just move on"

## Anti-Patterns

1. Vague requirements — "should be fast" → quantify
2. Implementation requirements — "use REST" → defer to design
3. Missing error conditions — add fallback behavior
4. Unbounded scope — "all file types" → enumerate
5. Missing acceptance criteria — add testable definitions
6. Orphaned requirements — ensure RTM coverage
7. Skipped gates — each gate catches defects early
8. Missing non-functional requirements — work all 9 categories
9. Premature design in requirements — keep SRS technology-agnostic
10. Incomplete traceability — every RTM row must be filled

## Gate (BLOCK)

- Requirements without unique IDs
- Unverifiable requirements (no test possible)
- RTM gaps (requirements not traced to design or test)
- Contradictory requirements
- Unquantified performance requirements
- Orphaned modules (design with no requirement)
- Orphaned requirements (requirement with no design)
- Incomplete DDS (missing algorithms, error handling, interfaces)
- Test plan not covering every SRS requirement
- Missing Gate Review Reports
- Missing rollback procedure in deployment plan
- Missing CM Plan baselines

## Gate (WARN)

- Approximate performance thresholds
- Deferred edge cases (with explicit decision)
- Incomplete non-critical module details
- Aspirational test automation targets
- Draft training materials
- Pending developer assignments
- Unvalidated assumptions
