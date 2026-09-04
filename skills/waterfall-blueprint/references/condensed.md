# Waterfall Blueprint (condensed)

This is a condensed version of `SKILL.md` for tools that do not natively read the Agent
Skills `SKILL.md` format. Point your tool's memory/instructions file (e.g. `AGENTS.md`,
`CLAUDE.md`, `GEMINI.md`, `.windsurferules`) at this content, or paste it into the relevant
rules file. The canonical source remains `SKILL.md`.

## Trigger Phrases

- "waterfall", "specification", "SRS", "design document", "blueprint"
- "requirements document", "formal specification", "phase-gate"
- "traceability matrix", "requirements tracing", "design review", "test plan"
- "IEEE 830", "IEEE 829", "IEEE 1016", "DOD-STD-2167A"
- "complete specification", "follow to the letter", "buildable spec"

## When to use

- User has an idea or partial requirements and wants a complete, buildable specification
- User wants IEEE-standard documents (SRS, SDD, test plan) for a real project
- User wants interactive guidance through requirements elicitation with follow-up questions
- Starting a new project and wants thorough upfront specification before code

## Do not use when

- User wants to start coding immediately ("just build it", "skip the docs")
- User wants an agile/iterative approach
- User only wants a single document (this skill produces the full package)
- Project is a quick prototype or throwaway experiment

## Seven-Phase Pipeline

```
Intake & Scoping → Requirements Elicitation → High-Level Design → Detailed Design
  → Implementation Planning → Test Planning → Deployment & Maintenance Planning
```

Each phase produces baselined documents and requires a formal gate review before proceeding.

### Phase 0 — Intake & Scoping
Produce a one-page Project Context Document (PCD): project name, business context, scope
boundary (IN/OUT), stakeholder map, constraints, existing systems, success criteria.
Present to user for confirmation before proceeding.

### Phase 1 — Requirements Elicitation & SRS (IEEE 830)
Work through 8 requirement categories systematically with follow-up questions:
1. Functional Requirements (FR-001, FR-002… — each with ID, description, inputs, processing,
   outputs, preconditions, postconditions, error conditions, priority)
2. External Interfaces (UI, API, hardware, software, communication)
3. Performance Requirements (response time, throughput, concurrency — quantified)
4. Database Requirements (entities, relationships, volume, growth)
5. Security Requirements (authn, authz, encryption, audit)
6. Safety Requirements (fail-safe, rollback, disaster recovery)
7. Quality Attributes (reliability/MTBF, availability/uptime%, maintainability, portability)
8. Assumptions and Constraints

**Requirements quality criteria** — every requirement must be: necessary, unambiguous, complete,
consistent, verifiable, traceable, modifiable, ranked.

**Follow-up question strategy:** Drill down on vagueness, enumerate lists, ask edge cases,
request quantified constraints, ask for negatives (what NOT to do), prioritize with MoSCoW,
ask how each requirement will be validated.

### Phase 2 — High-Level Design / SDD (IEEE 1016)
Architecture decomposition, data flow (DFDs), data architecture (ERDs), interface design,
technology selection (justified), risk identification. Every module traces to ≥1 SRS
requirement. Every SRS requirement traces to ≥1 module.

### Phase 3 — Detailed Design / DDS
For each module: purpose, inputs, outputs, algorithms (pseudocode), interface contracts,
state diagrams, error handling, dependencies. Each spec is self-contained.

### Phase 4 — Implementation Planning
Coding standards, code review process (Fagan inspections), version control plan, build plan.

### Phase 5 — Test Planning (IEEE 829)
Test plan, test design, test case specs (each traced to SRS requirement), test procedures,
entry/exit criteria. Cover: unit, integration, system, acceptance, performance, security,
regression, usability testing.

### Phase 6 — Deployment & Maintenance
Deployment plan (with rollback), user documentation, maintenance plan, configuration
management plan, quality assurance plan.

## Traceability

Bidirectional traceability: Business Need → SRS Requirement → SDD Module → DDS Spec →
Test Case → Test Result. The RTM must show 100% coverage at every gate.

## Configuration Management Baselines

| Baseline | Created When |
|----------|-------------|
| Functional Baseline | After SRS approval |
| Allocated Baseline | After SDD approval |
| Developmental Baseline | After DDS approval |
| Product Baseline | After testing |

## Quality Gates

Every phase transition requires a Gate Review Report with checklist, findings, and
go/no-go decision. The agent must not skip phases or merge gates.

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
8. Missing non-functional requirements — work all 8 categories
9. Premature design in requirements — keep SRS technology-agnostic
10. Incomplete traceability — every RTM row must be filled

## Gate (BLOCK)

- Requirements without unique IDs
- Unverifiable requirements (no test possible)
- RTM gaps (requirements not traced to design or test)
- Contradictory requirements
- Unquantified performance requirements
- Orphaned modules (design with no requirement)
- Incomplete DDS (missing algorithms, error handling, interfaces)
- Test plan not covering every SRS requirement
- Missing Gate Review Reports
- Missing rollback procedure in deployment plan

## Gate (WARN)

- Approximate performance thresholds
- Deferred edge cases (with explicit decision)
- Incomplete non-critical module details
- Aspirational test automation targets
- Draft training materials
- Pending developer assignments
- Unvalidated assumptions
