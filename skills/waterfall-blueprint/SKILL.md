---
name: waterfall-blueprint
description: >
  Generate a complete, phase-gated software specification package using 1990s-era
  waterfall methodology. Guides the user through interactive requirements elicitation,
  producing IEEE-standard documents (SRS, SDD, DDS, test plans, deployment plan) that
  can be followed to the letter for a one-pass build. Covers requirements analysis with
  follow-up questions, formal design reviews, traceability matrices, configuration
  management baselines, and quality gates. Draws from IEEE 830/829/1016, DOD-STD-2167A,
  CMM Level 3 practices, and ISO 9001 design control. Not a methodology lecture — an
  actionable specification generator with built-in validation at every gate.
---

Transforms a vague idea or partial requirements into a **complete, buildable specification package** using the thorough, phase-gated approach that characterized 1990s-era software engineering. The output is a set of documents that a development team can follow to the letter — no ambiguity, no gaps, no "figure it out later."

This skill is not a methodology tutorial. It is an **interactive specification factory** that asks the right questions, fills the gaps, validates completeness at every gate, and produces documents conforming to IEEE 830 (SRS), IEEE 1016 (SDD), IEEE 829 (Test Documentation), and practices from DOD-STD-2167A, CMM Level 3, and ISO 9001 design control.

## Section Zero: Core Concepts

> "The payoff from quality planning... is very high. The single most important project failure cause is incomplete requirements." — Steve McConnell, *Rapid Development* (1996)

The 90s waterfall was not bureaucratic overhead — it was **risk elimination through completeness**. Every document existed because an ambiguity found during implementation costs 50–200x more than the same ambiguity found during requirements.

**Seven-Phase Pipeline:**

```
Intake & Scoping → Requirements Elicitation → High-Level Design → Detailed Design
  → Implementation Planning → Test Planning → Deployment & Maintenance Planning
```

Each phase produces a baselined document set and requires a formal gate review before the next phase begins. The agent must not skip phases or merge gates.

**Configuration Management Baselines:**

| Baseline | Created When | Contents |
|----------|-------------|----------|
| **Functional Baseline** | After SRS approval | Approved SRS, RTM, Glossary |
| **Allocated Baseline** | After SDD approval | Approved SDD, updated RTM |
| **Developmental Baseline** | After DDS approval | Approved DDS, updated RTM |
| **Product Baseline** | After testing | Source code, test results, updated RTM, user docs |

**Bidirectional Traceability:** Business Need → SRS Requirement → SDD Module → DDS Spec → Test Case → Test Result.

## Section One: When to Use

- The user has an idea, partial requirements, or a rough description and wants a **complete specification** they can hand off for implementation
- The user mentions "waterfall," "specification," "SRS," "design document," "blueprint," "requirements document," "formal specification," or "phase-gate"
- The user wants to produce a document set that can be "followed to the letter" for a one-pass build
- The user needs IEEE-standard document templates filled in for a real project
- The user wants interactive guidance through requirements elicitation with follow-up questions
- The user mentions "traceability matrix," "requirements tracing," "design review," or "test plan"
- Starting a new project and wants thorough upfront specification before any code is written

## Section Two: Do Not Use

- The user wants to start coding immediately ("just build it," "skip the docs")
- The user wants an agile/iterative approach (no upfront spec)
- The user is asking about a methodology comparison or theoretical question
- The project is a quick prototype or throwaway experiment
- The user only wants a single document (e.g., just a test plan) — this skill produces the full package

## Section Three: Hard Rules

> **HR-1.** Never invent requirements, constraints, or business rules. If the user hasn't specified it, ask.

> **HR-2.** Never stop asking follow-up questions until the user explicitly says "that's complete" for each requirements category.

> **HR-3.** Every requirement must have a unique ID (FR-NNN) and be traceable forward to design and test.

> **HR-4.** Every phase transition requires a Gate Review Report. Even if the user says "just move on," produce the report and note the skip as a risk.

> **HR-5.** The Requirements Traceability Matrix (RTM) must be updated at every gate review. 100% coverage is mandatory.

> **HR-6.** No orphaned requirements (requirement with no design) or orphaned modules (module with no requirement) are permitted.

> **HR-7.** SRS must be technology-agnostic. Implementation details belong in SDD, not SRS.

> **HR-8.** Any change to a baselined document requires a formal Change Request (CR) with impact analysis.

## Section Four: Decision Trees

```
Requirement Quality Check
├── Is it necessary? (serves a business need)
│   └── No → Remove or justify
├── Is it unambiguous? (two people agree on meaning)
│   └── No → Rewrite with specific, quantified criteria
├── Is it complete? (covers all aspects including error conditions)
│   └── No → Add missing aspects
├── Is it consistent? (no contradiction with other requirements)
│   └── No → Flag contradiction, ask user to resolve
├── Is it verifiable? (can write a test that proves it is met)
│   └── No → Rewrite with measurable acceptance criteria
├── Is it traceable? (has unique ID, can trace to design and test)
│   └── No → Assign ID, add to RTM
├── Is it modifiable? (changes don't require rewriting other requirements)
│   └── No → Restructure for independence
└── Is it ranked? (has priority — MoSCoW or equivalent)
    └── No → Assign priority

Gate Review Decision
├── All critical criteria PASS?
│   ├── Yes → PROCEED to next phase
│   └── No → Are all failures non-critical (conditional)?
│       ├── Yes → CONDITIONAL PASS with documented conditions
│       └── No → FAIL → REWORK required before proceeding
```

## Section Five: Pipeline

### Phase 0: Intake & Scoping (mandatory first step)

Before asking any requirements questions, establish: project identity, business context, scope boundary (IN/OUT), stakeholder map, constraints, existing systems, success criteria. Present one-page Project Context Document (PCD) to user for confirmation.

**Follow-up:** "Who is the primary user?", "Regulatory requirements?", "Target deployment environment?", "Existing integration points?", "Timeline and deadlines?", "Sign-off authority?"

### Phase 1: Requirements Elicitation & SRS (IEEE 830)

Work through 9 categories systematically: Functional Requirements, External Interfaces, Performance Requirements, Database Requirements, Security Requirements, Safety Requirements, Quality Attributes, Assumptions, Constraints. Each requirement gets unique ID with: description, inputs, processing, outputs, preconditions, postconditions, error conditions, priority (Must/Should/Could/Won't).

**Follow-up strategy:** Drill down on vagueness, enumerate lists, ask edge cases, request quantified constraints, ask for negatives (what NOT to do), prioritize with MoSCoW, ask how each requirement will be validated.

**Gate 1 output:** Complete SRS with RTM. Run quality criteria checklist against every requirement.

### Phase 2: High-Level Design / SDD (IEEE 1016)

Architecture decomposition, data flow (DFDs), data architecture (ERDs), interface design, technology selection (justified), risk identification. Every module traces to ≥1 SRS requirement. Every SRS requirement traces to ≥1 module.

**Follow-up:** "Expected data volume?", "Mandated technologies?", "Integration points?", "Deployment topology?", "Non-functional constraints?"

### Phase 3: Detailed Design / DDS

For each module: purpose, inputs, outputs, algorithms (pseudocode), interface contracts, state diagrams, error handling, dependencies. Each spec is self-contained.

**Follow-up:** "Edge cases in input data?", "What if external service unavailable?", "Validation rules for inputs?", "Concurrency concerns?"

### Phase 4: Implementation Planning

Coding standards, code review process (Fagan inspections), version control plan, build plan, developer assignments.

### Phase 5: Test Planning (IEEE 829)

Test plan, test design, test case specs (each traced to SRS requirement), test procedures, entry/exit criteria. Cover: unit, integration, system, acceptance, performance, security, regression, usability testing.

**Follow-up:** "Test environment?", "Who performs testing?", "Automation tools?", "Acceptance criteria per requirement?", "Regulatory testing requirements?"

### Phase 6: Deployment & Maintenance

Deployment plan (with rollback), user documentation, maintenance plan, configuration management plan, quality assurance plan.

**Follow-up:** "Deployment target?", "Data migration?", "Rollback procedure?", "Post-deployment SLA?", "Monitoring/alerting requirements?"

## Section Six: Error Handling

| Condition | Action |
|-----------|--------|
| Requirements without unique IDs | **BLOCK** |
| Unverifiable requirements (no test possible) | **BLOCK** |
| RTM gaps (requirements not traced to design or test) | **BLOCK** |
| Contradictory requirements | **BLOCK** |
| Unquantified performance requirements | **BLOCK** |
| Orphaned modules (design with no requirement) | **BLOCK** |
| Orphaned requirements (requirement with no design) | **BLOCK** |
| Incomplete DDS (missing algorithms, error handling, interfaces) | **BLOCK** |
| Test plan not covering every SRS requirement | **BLOCK** |
| Missing Gate Review Reports | **BLOCK** |
| Missing rollback procedure in deployment plan | **BLOCK** |
| Missing Configuration Management Plan baselines | **BLOCK** |
| Approximate performance thresholds | **WARN** |
| Deferred edge cases (with explicit decision recorded) | **WARN** |
| Incomplete non-critical module details | **WARN** |
| Aspirational test automation targets | **WARN** |
| Draft training materials | **WARN** |
| Pending developer assignments | **WARN** |
| Unvalidated assumptions | **WARN** |

## Section Seven: Key Rules

1. **This skill is interactive, not autonomous.** Ask before assuming. Challenge contradictions. Validate completeness. Present progress. Record decisions. Flag risks. Never skip a gate.

2. **Anti-Patterns to Watch For:**
   - Vague requirements — "should be fast" → quantify
   - Implementation requirements — "use REST" → defer to design
   - Missing error conditions — add fallback behavior
   - Unbounded scope — "all file types" → enumerate
   - Missing acceptance criteria — add testable definitions
   - Orphaned requirements — ensure RTM coverage
   - Skipped gates — each gate catches defects early
   - Missing non-functional requirements — work all 9 categories
   - Premature design in requirements — keep SRS technology-agnostic
   - Incomplete traceability — every RTM row must be filled

## Section Eight: Evidence & Checklist

**Deliverables:**

- Project Context Document (PCD)
- Software Requirements Specification (SRS) following IEEE 830
- Requirements Traceability Matrix (RTM) with 100% coverage
- Software Design Description (SDD) following IEEE 1016
- Detailed Design Specifications (DDS) for every module
- Implementation Plan with coding standards and review process
- Test Plan following IEEE 829 with test cases traced to requirements
- Deployment Plan with rollback procedure
- Maintenance Plan
- Configuration Management Plan with baseline definitions
- Quality Assurance Plan
- Gate Review Reports for every phase transition
- Glossary of terms
- List of decisions with rationale
- Risk register with mitigations

**Checklist:**

- [ ] Project Context Document (PCD) produced and confirmed by user
- [ ] SRS follows IEEE 830 structure with all sections populated
- [ ] Every functional requirement has a unique ID (FR-NNN)
- [ ] Every requirement passes quality criteria (necessary, unambiguous, complete, consistent, verifiable, traceable, modifiable, ranked)
- [ ] Performance requirements are quantified
- [ ] External interfaces are fully specified
- [ ] Security requirements are explicit
- [ ] Assumptions and constraints documented with risk ratings
- [ ] RTM has 100% forward coverage
- [ ] SDD follows IEEE 1016 structure
- [ ] Every module traces to ≥1 SRS requirement
- [ ] Architecture addresses all functional and non-functional requirements
- [ ] Technology choices are justified
- [ ] Top risks identified with mitigations
- [ ] DDS exists for every module with complete specs
- [ ] Coding standards and review process defined
- [ ] IEEE 829 Test Plan complete
- [ ] Every SRS requirement has ≥1 test case
- [ ] RTM has 100% bidirectional coverage
- [ ] Deployment and rollback procedures defined
- [ ] Configuration Management Plan identifies all baselines
- [ ] Gate Review Reports exist for every phase transition
- [ ] No anti-patterns remain unfixed

---

## Reference Guides

| Guide | Location | Contents |
|-------|----------|----------|
| Question Catalog | `references/question-catalog.md` | Follow-up questions organized by phase |
| IEEE Templates | `references/ieee-templates.md` | SRS, SDD, DDS, test plan document templates |
| Review Checklists | `references/review-checklists.md` | Gate review checklists by phase |
