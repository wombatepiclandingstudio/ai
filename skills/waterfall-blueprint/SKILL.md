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
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [waterfall, specification, srs, sdd, requirements, design, testing, ieee-830, ieee-829, phase-gate, traceability, documentation, blueprint, legacy-methodology]
---

# Waterfall Blueprint — Complete Software Specification Generator

Transforms a vague idea or partial requirements into a **complete, buildable specification package** using the thorough, phase-gated approach that characterized 1990s-era software engineering. The output is a set of documents that a development team can follow to the letter — no ambiguity, no gaps, no "figure it out later."

This skill is not a methodology tutorial. It is an **interactive specification factory** that asks the right questions, fills the gaps, validates completeness at every gate, and produces documents conforming to IEEE 830 (SRS), IEEE 1016 (SDD), IEEE 829 (Test Documentation), and practices from DOD-STD-2167A, CMM Level 3, and ISO 9001 design control.

## Use when

- The user has an idea, partial requirements, or a rough description and wants a **complete specification** they can hand off for implementation
- The user mentions "waterfall," "specification," "SRS," "design document," "blueprint," "requirements document," "formal specification," or "phase-gate"
- The user wants to produce a document set that can be "followed to the letter" for a one-pass build
- The user needs IEEE-standard document templates filled in for a real project
- The user wants interactive guidance through requirements elicitation with follow-up questions
- The user mentions "traceability matrix," "requirements tracing," "design review," or "test plan"
- Starting a new project and wants thorough upfront specification before any code is written

## Do not use when

- The user wants to start coding immediately ("just build it," "skip the docs")
- The user wants an agile/iterative approach (no upfront spec)
- The user is asking about a methodology comparison or theoretical question
- The project is a quick prototype or throwaway experiment
- The user only wants a single document (e.g., just a test plan) — this skill produces the full package

---

## Core Philosophy

> "Thepayofffromqualityplanning...isveryhighThesinglemostimportantprojectfailurecauseisincomplete requirements." — Steve McConnell, *Rapid Development* (1996)

The90s waterfall was not bureaucratic overhead — it was **risk elimination through completeness**. Every document existed because an ambiguity found during implementation costs 50–200x more than the same ambiguity found during requirements. This skill restores that rigor: interactive elicitation, formal gates, traceability, and documents that leave nothing to interpretation.

---

## The Specification Pipeline

The pipeline has **seven phases**. Each phase produces a baselined document set and requires a formal gate review before the next phase begins. The agent must not skip phases or merge gates.

```
Intake & Scoping → Requirements Elicitation → High-Level Design → Detailed Design
  → Implementation Planning → Test Planning → Deployment & Maintenance Planning
```

### Phase 0: Intake & Scoping (mandatory first step)

Before asking any requirements questions, establish the project scope and context:

1. **Project identity** — Name, version, organization, author, date.
2. **Business context** — What problem does this solve? Who benefits? What is the cost of *not* building it?
3. **Scope boundary** — What is IN scope? What is explicitly OUT of scope? (The "out of scope" list prevents scope creep during elicitation.)
4. **Stakeholder map** — Who are the decision-makers, users, operators, maintainers? List names/roles.
5. **Constraints** — Technology stack mandates, regulatory requirements, deadline, budget, team size, integration requirements.
6. **Existing systems** — What does this integrate with? What does it replace? What must it coexist with?
7. **Success criteria** — How will we know the system works? What measurable outcomes define "done"?

**Gate 0 output:** A one-page Project Context Document (PCD). The agent must present this to the user for confirmation before proceeding to requirements.

**Follow-up questions for Phase 0:**

- "Who is the primary user of this system? Describe their daily workflow."
- "Are there regulatory or compliance requirements (HIPAA, PCI-DSS, SOX, GDPR, etc.)?"
- "What is the target deployment environment (cloud, on-prem, embedded, hybrid)?"
- "Are there existing systems this must integrate with? What are the interfaces?"
- "What is the timeline? Is there a hard deadline or regulatory date?"
- "Who has final sign-off authority on the specification?"

### Phase 1: Requirements Elicitation & SRS Generation

This is the most critical phase. The agent must be **thorough, persistent, and adversarial** — every ambiguity left unresolved here becomes a defect later.

#### 1.1 Elicitation Process

The agent must work through each requirements category systematically, asking follow-up questions until the category is complete. Do NOT accept vague statements — every requirement must be specific enough to design against and test against.

**Follow-up question strategy:**

- **Drill down:** "You said 'fast performance.' How fast? What is the maximum acceptable response time for this operation?"
- **Enumerate:** "You said 'support multiple payment methods.' List every payment method you need now and in the next 12 months."
- **Edge cases:** "What happens when [edge case]? What should the system do?"
- **Constraints:** "Is there a maximum number of concurrent users? Data volume? Storage limit?"
- **Negatives:** "What should the system NOT do? What is explicitly out of scope?"
- **Priorities:** "If you could only have three of these five features, which three?"
- **Validation:** "How will you verify this requirement is met? What test would prove it?"

**Never stop asking until the user explicitly says "that's complete" for each category.**

#### 1.2 Requirements Categories

Work through every category. If the user says "not applicable," record that as a formal decision (it may become relevant later).

| Category | What to Capture |
|----------|----------------|
| **Functional Requirements** | Every feature, operation, business rule, data transformation, workflow. Each gets a unique ID (FR-001, FR-002…). |
| **External Interfaces** | User interfaces (screens, reports, APIs), hardware interfaces, software interfaces, communication protocols. |
| **Performance Requirements** | Response time, throughput, concurrency, capacity, scalability targets. Quantified. |
| **Database Requirements** | Data entities, relationships, retention, volume, growth rate. |
| **Security Requirements** | Authentication, authorization, encryption, audit logging, compliance. |
| **Safety Requirements** | Fail-safe behavior, data integrity, rollback, disaster recovery. |
| **Quality Attributes** | Reliability (MTBF), availability (uptime %), maintainability, portability, usability. |
| **Assumptions** | What are we assuming to be true? Each assumption is a risk. |
| **Constraints** | Technology, regulatory, organizational, budgetary, schedule. |

#### 1.3 SRS Document Structure (IEEE 830-1998)

The agent must produce a Software Requirements Specification following this structure:

```
1. Introduction
   1.1 Purpose
   1.2 Scope
   1.3 Definitions, Acronyms, Abbreviations
   1.4 References
   1.5 Overview

2. Overall Description
   2.1 Product Perspective (context diagram)
   2.2 Product Functions (high-level summary)
   2.3 User Characteristics
   2.4 Constraints
   2.5 Assumptions and Dependencies

3. Specific Requirements
   3.1 External Interfaces (UI, API, hardware, software, communication)
   3.2 Functional Requirements (FR-001, FR-002… each with:
       - ID
       - Description
       - Inputs
       - Processing
       - Outputs
       - Preconditions
       - Postconditions
       - Error conditions
       - Priority (Must/Should/Could/Won't)
   3.3 Performance Requirements
   3.4 Database Requirements
   3.5 Security Requirements
   3.6 Safety Requirements
   3.7 Quality Attributes

4. Appendices
   4.1 Requirements Traceability Matrix (RTM)
   4.2 Glossary
   4.3 Analysis Model (data flow diagrams, entity-relationship diagrams)
```

**Requirements quality criteria (every requirement must be):**

| Criterion | Test |
|-----------|------|
| **Necessary** | Does it serve a business need? Can you justify its existence? |
| **Unambiguous** | Can two people read it and agree on meaning? |
| **Complete** | Does it cover all aspects of the feature? Are error conditions included? |
| **Consistent** | Does it contradict any other requirement? |
| **Verifiable** | Can you write a test that proves it is met? |
| **Traceable** | Does it have a unique ID that can be traced forward to design and test? |
| **Modifiable** | Is it structured so changes can be made without rewriting other requirements? |
| **Ranked** | Does it have a priority (MoSCoW or equivalent)? |

**Gate 1 output:** Complete SRS document with Requirements Traceability Matrix. The agent must run the quality criteria checklist against every requirement and report results.

### Phase 2: High-Level Design (Preliminary Design) — SDD Generation

Given the baselined SRS, produce a Software Design Description (IEEE 1016) that decomposes the system into modules and defines their interactions.

#### 2.1 Design Process

1. **Architecture decomposition** — Identify major modules/subsystems and their responsibilities.
2. **Data flow analysis** — How does data move through the system? Draw (or describe) Data Flow Diagrams (DFDs).
3. **Data architecture** — Entity-Relationship Diagrams (ERDs), data dictionaries, storage strategy.
4. **Interface design** — API contracts, UI wireframes/mockups (text descriptions), protocol definitions.
5. **Technology selection** — Languages, frameworks, databases, middleware. Justify each choice.
6. **Risk identification** — What are the top 5 technical risks? Mitigation strategies.

**Follow-up questions for Phase 2:**

- "What is the expected data volume at launch? At peak? Growth rate over 3 years?"
- "Are there specific technologies mandated by the organization?"
- "What are the integration points? REST APIs? Message queues? File transfers?"
- "What is the deployment topology (monolith, microservices, serverless, hybrid)?"
- "Are there non-functional requirements that constrain the architecture (latency, throughput, availability)?"

#### 2.2 SDD Document Structure (IEEE 1016)

```
1. Introduction
   1.1 Purpose
   1.2 Scope
   1.3 Definitions
   1.4 References (SRS version, baselined date)

2. Architectural Description
   2.1 Architecture Overview (context, container, component views)
   2.2 Module Decomposition (responsibilities, interfaces)
   2.3 Data Flow (DFDs, sequence diagrams)
   2.4 Control Flow

3. Data Design
   3.1 Entity-Relationship Diagrams
   3.2 Data Dictionary
   3.3 Database Schema (tables, indexes, constraints)
   3.4 Data Migration Strategy (if applicable)

4. Interface Design
   4.1 External Interfaces (APIs, protocols)
   4.2 Internal Interfaces (module-to-module)
   4.3 User Interface (wireframes, screen flow)
   4.4 Hardware Interfaces (if applicable)

5. Detailed Design Decisions
   5.1 Technology Stack (with justification)
   5.2 Design Patterns Used
   5.3 Error Handling Strategy
   5.4 Security Architecture
   5.5 Logging and Monitoring Strategy

6. Traceability
   6.1 Module-to-Requirement Mapping
   6.2 Interface-to-Requirement Mapping

7. Risks and Mitigations
```

**Gate 2 output:** Complete SDD with traceability back to SRS requirements. Every module must trace to at least one requirement. Every requirement must trace to at least one module (no orphaned requirements).

### Phase 3: Detailed Design — DDS Generation

Expand each module from Phase 2 into detailed specifications that a developer can implement without ambiguity.

#### 3.1 Detailed Design Process

For **each module**, produce:

1. **Module specification** — Purpose, inputs, outputs, algorithms, data structures.
2. **Pseudocode or structured English** — For complex algorithms. Not implementation code — the *logic* expressed clearly enough that any competent developer can implement it.
3. **Interface contracts** — Exact signatures, parameter types, return types, error codes.
4. **State diagrams** — For modules with stateful behavior.
5. **Error handling** — Every error condition, what the module should do, what the caller should expect.
6. **Dependencies** — Other modules, external libraries, services.

**Follow-up questions for Phase 3:**

- "For this module, what are the edge cases in the input data?"
- "What should happen if [external service] is unavailable?"
- "What are the validation rules for each input parameter?"
- "What is the expected range of data values?"
- "Are there concurrency concerns? Race conditions?"

**Gate 3 output:** Complete Detailed Design Specification (DDS) for every module. Each module spec must be self-contained — a developer should be able to implement it without referring to other modules (except through defined interfaces).

### Phase 4: Implementation Planning

Produce a development plan that specifies coding standards, code review process, version control, and build procedures.

#### 4.1 Implementation Planning Documents

1. **Coding Standards** — Naming conventions, comment requirements, maximum complexity, file structure, forbidden constructs.
2. **Code Review Process** — Fagan inspection checklist, reviewer roles, defect classification.
3. **Version Control Plan** — Branching strategy, commit message format, tag naming.
4. **Build Plan** — Build environment, compilation, dependency management, artifact naming.
5. **Developer Assignment** — Which modules to which developers (if known), estimated effort per module.

**Follow-up questions for Phase 4:**

- "What programming language(s) will be used?"
- "Are there existing coding standards in the organization?"
- "What is the code review process (peer review, Fagan inspection, pair programming)?"
- "What version control system is in use?"
- "What is the build/release process?"

**Gate 4 output:** Implementation Plan document. This bridges design and coding — it tells developers *how* to build, not just *what* to build.

### Phase 5: Test Planning

Produce a comprehensive test plan following IEEE 829, with test cases traced to requirements.

#### 5.1 Test Planning Documents

1. **Test Plan (IEEE 829)** — Scope, approach, resources, schedule, test environments, tools, risks.
2. **Test Design** — Test strategy per requirement type (functional, performance, security, usability).
3. **Test Case Specifications** — For every requirement:
   - Test case ID (mapped to requirement ID)
   - Preconditions
   - Test steps
   - Expected results
   - Pass/fail criteria
   - Priority
4. **Test Procedure** — Step-by-step execution instructions for each test case.
5. **Entry/Exit Criteria** — What must be true before testing starts? What must be true for testing to pass?

**Test types to cover:**

| Type | What | When |
|------|------|------|
| **Unit Testing** | Individual modules against their DDS specs | During coding |
| **Integration Testing** | Module interfaces, data flow between modules | After unit tests pass |
| **System Testing** | Complete system against SRS requirements | After integration |
| **Acceptance Testing** | System against business needs, user validation | Before deployment |
| **Performance Testing** | Response time, throughput, concurrency, stress | During system testing |
| **Security Testing** | Vulnerability assessment, penetration testing | During system testing |
| **Regression Testing** | Changes don't break existing functionality | After every change |
| **Usability Testing** | User experience evaluation | During system testing |

**Follow-up questions for Phase 5:**

- "What is the test environment (staging, production-like, sandbox)?"
- "Who performs testing (dedicated QA team, developers, end users)?"
- "What test automation tools are available?"
- "What is the acceptance criteria for each requirement?"
- "Are there regulatory testing requirements (HIPAA audit, PCI scan, etc.)?"

**Gate 5 output:** Complete IEEE 829 Test Plan with test cases traced 1:1 to SRS requirements. Every requirement must have at least one test case. The Requirements Traceability Matrix must show complete coverage.

### Phase 6: Deployment & Maintenance Planning

Produce deployment, operations, and maintenance plans.

#### 6.1 Deployment Documents

1. **Deployment Plan** — Installation procedure, configuration, data migration, rollback plan.
2. **User Documentation** — User manual, operator guide, training materials.
3. **Maintenance Plan** — Defect tracking, release management, update procedures.
4. **Configuration Management Plan** — Baselines, change control process, version control.
5. **Quality Assurance Plan** — Process audits, metrics collection, reporting.

**Follow-up questions for Phase 6:**

- "What is the deployment target (cloud provider, on-prem server, mobile app store)?"
- "Is there a data migration from an existing system?"
- "What is the rollback procedure if deployment fails?"
- "Who maintains the system post-deployment? What is the SLA?"
- "Are there monitoring/alerting requirements?"

**Gate 6 output:** Complete Deployment and Maintenance Plan. The full specification package is now complete.

---

## Document Traceability

Every document must maintain **bidirectional traceability**:

```
Business Need → SRS Requirement → SDD Module → DDS Module Spec → Test Case → Test Result
```

The Requirements Traceability Matrix (RTM) is the spine of the entire package:

| Req ID | Business Need | SRS Section | SDD Module | DDS Spec | Test Case IDs | Status |
|--------|--------------|-------------|------------|----------|---------------|--------|
| FR-001 | Customer registration | 3.2.1 | RegistrationSvc | reg-svc-spec.md | TC-001, TC-002 | Implemented |
| FR-002 | Password validation | 3.2.2 | AuthModule | auth-spec.md | TC-003, TC-004 | Implemented |

**Rules:**
- Every SRS requirement must appear in the RTM.
- Every SDD module must trace to at least one SRS requirement.
- Every DDS spec must trace to at least one SDD module.
- Every test case must trace to at least one SRS requirement.
- No orphaned requirements (requirement with no design) or orphaned modules (module with no requirement).
- The RTM must be updated at every gate review.

---

## Configuration Management Baselines

The90s waterfall placed each phase output under configuration control. The agent must identify these baselines:

| Baseline | Created When | Contents |
|----------|-------------|----------|
| **Functional Baseline** | After SRS approval | Approved SRS, RTM, Glossary |
| **Allocated Baseline** | After SDD approval | Approved SDD, updated RTM |
| **Developmental Baseline** | After DDS approval | Approved DDS, updated RTM |
| **Product Baseline** | After testing | Source code, test results, updated RTM, user docs |

**Change control:** Any change to a baselined document requires a formal Change Request (CR) with impact analysis. The agent must note this in the Configuration Management Plan but does not need to simulate the CCB process.

---

## Quality Gates

Every phase transition requires a formal gate review. The agent must produce a **Gate Review Report** at each transition:

### Gate Review Report Template

```
Gate Review: [Phase N] → [Phase N+1]
Date: [current date]
Reviewer: [agent acting as QA]
SRS Version: [version]
Status: PASS / CONDITIONAL PASS / FAIL

Findings:
1. [Finding ID] [Severity: Critical/Major/Minor] [Description] [Resolution]
2. ...

Checklist Results:
- [ ] All requirements have unique IDs
- [ ] All requirements are verifiable
- [ ] No contradictory requirements
- [ ] RTM is complete (100% coverage)
- [ ] Design traces to all requirements
- [ ] No orphaned modules
- [ ] Test cases trace to all requirements
- [ ] [Phase-specific checks]

Decision: PROCEED / HOLD / REWORK
```

### Gate Criteria by Phase

| Gate | Must PASS | May CONDITION |
|------|-----------|---------------|
| **Gate 0 (Intake)** | Project scope defined, stakeholders identified, success criteria stated | Constraints not fully quantified |
| **Gate 1 (SRS)** | All requirements have IDs, are verifiable, no contradictions, RTM complete | Performance thresholds approximate, some edge cases deferred |
| **Gate 2 (SDD)** | Architecture addresses all functional requirements, all modules trace to requirements | Technology choices pending final evaluation |
| **Gate 3 (DDS)** | Every module has complete spec, every algorithm has pseudocode, all error conditions defined | Non-critical module details deferred |
| **Gate 4 (Impl)** | Coding standards defined, review process established, build plan complete | Developer assignments pending |
| **Gate 5 (Test)** | Every requirement has test cases, entry/exit criteria defined, test environment specified | Test automation coverage target approximate |
| **Gate 6 (Deploy)** | Deployment procedure complete, rollback plan defined, maintenance plan established | Training materials draft |

---

## Interactive Guidance Rules

This skill is **interactive, not autonomous**. The agent must follow these rules:

1. **Ask before assuming.** Never invent requirements, constraints, or business rules. If the user hasn't specified it, ask.
2. **Drill down on vagueness.** "Support for reporting" is not a requirement. Ask: "What reports? What data? What format? What frequency? Who consumes them?"
3. **Challenge contradictions.** If requirement A contradicts requirement B, stop and ask the user to resolve.
4. **Validate completeness.** After each category, summarize what was captured and ask: "Is this complete? What did I miss?"
5. **Present progress.** After each phase, present the generated document and ask for review before proceeding.
6. **Record decisions.** When the user makes a choice, record it as a formal decision with rationale. Decisions are part of the specification.
7. **Flag risks.** When an assumption is made or a constraint is unclear, flag it as a risk in the document.
8. **Never skip a gate.** Even if the user says "just move on," the agent must produce the gate review report and note the skip as a risk.

---

## Anti-Patterns

1. **Vague requirements** — "The system should be fast" → Rewrite as: "95th percentile response time ≤ 200ms for operations X, Y, Z under N concurrent users."
2. **Implementation requirements** — "Use a REST API" → Rewrite as: "The system shall expose interfaces accessible over standard HTTP/HTTPS." (Let the design phase choose REST.)
3. **Missing error conditions** — A functional requirement without error handling → Add error conditions, fallback behavior, and user-facing messages.
4. **Unbounded scope** — "Support all file types" → Enumerate the supported types. "All" is not a specification.
5. **Missing acceptance criteria** — A requirement without a testable definition of "done" → Add quantified acceptance criteria.
6. **Orphaned requirements** — A requirement with no traceability to design or test → Ensure RTM coverage is 100%.
7. **Skipped gates** — Merging phases or skipping reviews → Each gate exists to catch defects early. Skipping a gate propagates defects forward.
8. **Missing non-functional requirements** — Performance, security, reliability omitted → Work through every category in the requirements table.
9. **Premature design in requirements** — Specifying implementation details in the SRS → Keep SRS technology-agnostic; defer to SDD.
10. **Incomplete traceability** — RTM has gaps → Every row must be filled. No requirement escapes tracing.

---

## Pre-Delivery Checklist

Before declaring the specification package complete:

- [ ] Project Context Document (PCD) produced and confirmed by user
- [ ] SRS follows IEEE 830 structure with all sections populated
- [ ] Every functional requirement has a unique ID (FR-NNN)
- [ ] Every requirement passes the quality criteria (necessary, unambiguous, complete, consistent, verifiable, traceable, modifiable, ranked)
- [ ] Performance requirements are quantified (response time, throughput, concurrency)
- [ ] External interfaces are fully specified (UI, API, hardware, software, communication)
- [ ] Security requirements are explicit (authn, authz, encryption, audit)
- [ ] Assumptions and constraints are documented with risk ratings
- [ ] Requirements Traceability Matrix (RTM) has 100% forward coverage
- [ ] SDD follows IEEE 1016 structure
- [ ] Every module traces to at least one SRS requirement
- [ ] Architecture addresses all functional and non-functional requirements
- [ ] Technology choices are justified
- [ ] Top risks are identified with mitigations
- [ ] DDS exists for every module with complete specs (inputs, outputs, algorithms, error handling)
- [ ] Coding standards and review process are defined
- [ ] IEEE 829 Test Plan is complete
- [ ] Every SRS requirement has at least one test case
- [ ] RTM has 100% bidirectional coverage (requirement ↔ design ↔ test)
- [ ] Deployment and rollback procedures are defined
- [ ] Configuration Management Plan identifies all baselines
- [ ] Gate Review Reports exist for every phase transition
- [ ] No anti-patterns from the anti-patterns list remain unfixed

---

## Gate Implications

The gate must **BLOCK** progression when:

- The SRS contains requirements without unique IDs
- A requirement is not verifiable (no test can prove it is met)
- The RTM has gaps (requirements not traced to design or test)
- A requirement contradicts another requirement
- Performance requirements are not quantified
- The SDD contains modules that do not trace to any SRS requirement (orphaned modules)
- The SRS contains requirements not traced to any SDD module (orphaned requirements)
- The DDS is incomplete for any module (missing algorithm specs, error handling, or interface contracts)
- The test plan does not cover every SRS requirement
- A Gate Review Report was not produced
- The Configuration Management Plan does not identify baselines
- The deployment plan lacks a rollback procedure

The gate must **WARN** when:

- Some performance thresholds are approximate (not final)
- Some edge cases are deferred to a future release (with explicit decision recorded)
- Non-critical module details are incomplete but documented
- Test automation coverage target is aspirational
- Training materials are drafts
- Developer assignments are pending
- Some assumptions are unvalidated

---

## Evidence Required

A waterfall-blueprint session should produce:

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

---

## Test Cases

### Test Case 1: Full specification from vague idea
**Input:** "I want to build a customer support ticketing system. Customers should be able to submit tickets, and agents should be able to respond and resolve them."
**Expected output:** The agent asks at least 10 follow-up questions covering: ticket categories, priority levels, SLA requirements, notification channels, integration with existing systems, user roles and permissions, reporting requirements, data retention, multi-channel support (email, phone, chat), and escalation rules. Produces a complete SRS with FR-NNN requirements, an SDD with module decomposition, test cases traced to requirements, and gate review reports.
**Assertion:** SRS has ≥20 functional requirements. Every requirement has an ID, priority, and is verifiable. RTM covers 100% of requirements. At least 3 gate review reports exist.

### Test Case 2: Contradiction detection
**Input:** A partial SRS where one requirement states "All data must be encrypted at rest" and another states "Data must be searchable by full-text content without decryption."
**Expected output:** The agent flags the contradiction during requirements elicitation and asks the user to resolve it before proceeding. Does not generate a design that tries to satisfy both contradictory requirements.
**Assertion:** The contradiction is identified. The agent presents the conflict and asks for resolution. No design document is produced until the contradiction is resolved.

### Test Case 3: Anti-pattern detection in existing spec
**Input:** An existing requirements document with vague requirements ("the system should be user-friendly"), missing IDs, no traceability matrix, and requirements that specify implementation details ("use PostgreSQL for the database").
**Expected output:** A review that identifies: vague requirements (anti-pattern 1), implementation in requirements (anti-pattern 2), missing IDs, missing RTM, and missing acceptance criteria. Produces rewritten requirements with specific, testable criteria.
**Assertion:** At least 4 anti-patterns identified. Each vague requirement is rewritten with quantified criteria. Implementation details are moved to the design phase.

---

## Companion Skills

| Skill | Connection |
|-------|------------|
| `capability-to-gherkin` | After SRS is complete, capabilities can be converted to executable Gherkin test scenarios |
| `backoffice-design` | SDD phase can reference backoffice design patterns for operator-facing UIs |
| `pragmatic-development` | Implementation phase applies pragmatic development practices (DRY, tracer bullets) |
| `code-quality-review` | Code review process in Implementation Plan references clean code principles |
| `software-metrics-quality` | QA Plan collects metrics aligned with software-metrics-quality skill |
