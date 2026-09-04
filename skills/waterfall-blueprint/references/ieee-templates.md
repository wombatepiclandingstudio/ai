# IEEE Document Templates

Reference templates for the documents produced by the waterfall-blueprint skill.

## SRS Template (IEEE 830-1998)

```markdown
# Software Requirements Specification
## [Project Name] v[Version]

### 1. Introduction

#### 1.1 Purpose
[State the purpose of this SRS. Identify the intended readership.]

#### 1.2 Scope
[Identify the software product(s) to be produced. Include:
- Software name and version
- What the software will do
- What the software will NOT do (out of scope)]

#### 1.3 Definitions, Acronyms, Abbreviations
| Term | Definition |
|------|------------|
| [Term] | [Definition] |

#### 1.4 References
| Document | Version | Date | Source |
|----------|---------|------|--------|
| [Doc] | [Ver] | [Date] | [URL/path] |

#### 1.5 Overview
[Provide a brief description of the remaining sections of the SRS.]

### 2. Overall Description

#### 2.1 Product Perspective
[Context diagram showing the system and its external actors/systems.
Describe whether this is new development, enhancement, or replacement.]

#### 2.2 Product Functions
[High-level summary of major functions. Cross-reference to Section 3.]

#### 2.3 User Characteristics
[Describe the intended users: roles, skill levels, frequency of use.]

#### 2.4 Constraints
[Technology, regulatory, organizational, budgetary, schedule constraints.]

#### 2.5 Assumptions and Dependencies
[What must be true for the system to succeed? What external factors
affect the project?]

### 3. Specific Requirements

#### 3.1 External Interfaces

##### 3.1.1 User Interfaces
[For each UI: screen name, purpose, input fields, output fields,
navigation, error messages.]

##### 3.1.2 Hardware Interfaces
[For each hardware interface: device, protocol, data format, constraints.]

##### 3.1.3 Software Interfaces
[For each software interface: system name, API type, data format,
frequency, constraints.]

##### 3.1.4 Communication Interfaces
[For each communication interface: protocol, bandwidth, latency
requirements, security.]

#### 3.2 Functional Requirements

For each requirement:

**FR-[NNN] [Requirement Name]**
- **Description:** [What the system shall do]
- **Priority:** [Must / Should / Could / Won't]
- **Inputs:** [Data, events, triggers]
- **Processing:** [What the system does with the inputs]
- **Outputs:** [Data, events, state changes]
- **Preconditions:** [What must be true before this requirement executes]
- **Postconditions:** [What is true after this requirement executes]
- **Error Conditions:** [What happens when things go wrong]
- **Acceptance Criteria:** [How to verify this requirement is met]

#### 3.3 Performance Requirements
| Req ID | Metric | Target | Conditions |
|--------|--------|--------|------------|
| PR-001 | Response time | ≤ 200ms | 95th percentile, 1000 concurrent users |
| PR-002 | Throughput | ≥ 500 req/sec | Sustained load, average payload |
| PR-003 | Concurrent users | ≥ 5000 | Simultaneous sessions |
| PR-004 | Data volume | ≥ 10M records | Active dataset |

#### 3.4 Database Requirements
[Entities, relationships, volume, growth rate, retention, backup.]

#### 3.5 Security Requirements
| Req ID | Requirement | Standard |
|--------|-------------|----------|
| SR-001 | Authentication via OAuth 2.0 / SAML | OWASP Top 10 |
| SR-002 | Role-based access control (RBAC) | — |
| SR-003 | Data encryption at rest (AES-256) | PCI-DSS |
| SR-004 | Audit logging for all mutations | SOC 2 |
| SR-005 | Session timeout after 30 minutes | — |

#### 3.6 Safety Requirements
[Fail-safe behavior, data integrity, rollback, disaster recovery RTO/RPO.]

#### 3.7 Quality Attributes
| Attribute | Requirement | Measurement |
|-----------|-------------|-------------|
| Reliability | MTBF ≥ 720 hours | Monitoring |
| Availability | 99.9% uptime | Monitoring |
| Maintainability | Mean time to repair ≤ 4 hours | Incident tracking |
| Portability | Run on Linux, Windows, macOS | Build matrix |

### 4. Appendices

#### 4.1 Requirements Traceability Matrix
| Req ID | Business Need | SRS Section | SDD Module | DDS Spec | Test Cases | Status |
|--------|--------------|-------------|------------|----------|------------|--------|
| FR-001 | [Need] | 3.2.1 | [Module] | [Spec] | TC-001 | — |

#### 4.2 Glossary
| Term | Definition |
|------|------------|
| [Term] | [Definition] |
```

## SDD Template (IEEE 1016)

```markdown
# Software Design Description
## [Project Name] v[Version]

### 1. Introduction

#### 1.1 Purpose
#### 1.2 Scope
#### 1.3 Definitions
#### 1.4 References (SRS version, baselined date)

### 2. Architectural Description

#### 2.1 Architecture Overview
[Container diagram: major subsystems/services and their communication.]

#### 2.2 Module Decomposition
| Module | Responsibility | Interfaces | SRS Requirements |
|--------|---------------|------------|------------------|
| [Name] | [What it does] | [Input/Output] | FR-NNN, FR-NNN |

#### 2.3 Data Flow
[Describe or diagram how data moves through the system.
Identify processing sequences, transformations, storage points.]

#### 2.4 Control Flow
[Describe the control logic: event handling, state machines,
workflow orchestration.]

### 3. Data Design

#### 3.1 Entity-Relationship Diagrams
[ERD showing entities, relationships, cardinality.]

#### 3.2 Data Dictionary
| Entity | Attribute | Type | Constraints | Description |
|--------|-----------|------|-------------|-------------|
| [Entity] | [Attr] | [Type] | [PK/FK/NOT NULL/...] | [What it stores] |

#### 3.3 Database Schema
[CREATE TABLE statements or equivalent schema definitions.
Include indexes, constraints, partitions.]

#### 3.4 Data Migration Strategy
[If replacing an existing system: migration approach, mapping,
validation, rollback.]

### 4. Interface Design

#### 4.1 External Interfaces
| Interface | Type | Protocol | Format | SRS Reference |
|-----------|------|----------|--------|---------------|
| [Name] | REST API | HTTPS | JSON | IR-001 |

#### 4.2 Internal Interfaces
[Module-to-module communication: method calls, events, messages.]

#### 4.3 User Interface
[Wireframes or screen flow descriptions for each major screen.
Navigation, layout, key interactions.]

#### 4.4 Hardware Interfaces
[If applicable: device drivers, sensors, peripherals.]

### 5. Detailed Design Decisions

#### 5.1 Technology Stack
| Layer | Technology | Justification |
|-------|-----------|---------------|
| Language | [Lang] | [Why] |
| Framework | [FW] | [Why] |
| Database | [DB] | [Why] |
| Cache | [Cache] | [Why] |
| Queue | [Queue] | [Why] |

#### 5.2 Design Patterns Used
[Which patterns and where: Repository, Strategy, Observer, etc.]

#### 5.3 Error Handling Strategy
[Global error handling approach: exception types, logging,
user-facing messages, retry policies.]

#### 5.4 Security Architecture
[Authentication flow, authorization model, encryption strategy,
secret management.]

#### 5.5 Logging and Monitoring Strategy
[What gets logged, log levels, monitoring tools, alerting rules.]

### 6. Traceability

#### 6.1 Module-to-Requirement Mapping
| Module | SRS Requirements | Coverage |
|--------|-----------------|----------|
| [Name] | FR-NNN, FR-NNN | Complete |

#### 6.2 Interface-to-Requirement Mapping
| Interface | SRS Reference | Coverage |
|-----------|--------------|----------|
| [Name] | IR-NNN | Complete |

### 7. Risks and Mitigations
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk] | H/M/L | H/M/L | [Action] |
```

## Test Plan Template (IEEE 829)

```markdown
# Software Test Plan
## [Project Name] v[Version]

### 1. General
#### 1.1 Purpose
#### 1.2 References (SRS version, SDD version)
#### 1.3 Test Levels (unit, integration, system, acceptance)
#### 1.4 Test Types (functional, performance, security, usability, regression)

### 2. Test Environment
| Component | Specification |
|-----------|--------------|
| Hardware | [Specs] |
| OS | [Version] |
| Database | [Version, config] |
| Network | [Bandwidth, latency] |
| Tools | [Test runner, assertion lib, coverage tool] |

### 3. Test Items
| Item | SRS Reference | Test Level | Test Type |
|------|--------------|------------|-----------|
| [Feature] | FR-NNN | System | Functional |

### 4. Test Cases

For each test case:

**TC-[NNN] [Test Case Name]**
- **Requirement:** FR-[NNN]
- **Priority:** [High / Medium / Low]
- **Preconditions:** [What must be true before execution]
- **Test Steps:**
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
- **Test Data:** [Input values, fixtures]
- **Expected Result:** [What the system should produce/do]
- **Pass/Fail Criteria:** [Exact conditions for pass]
- **Postconditions:** [System state after test]

### 5. Entry Criteria
- [All requirements baselined]
- [Test environment provisioned]
- [Test data prepared]
- [Build deployed to test environment]

### 6. Exit Criteria
- [100% of High-priority test cases executed]
- [≥95% of Medium-priority test cases executed]
- [0 open Critical defects]
- [≤3 open Major defects]
- [All test cases documented with results]

### 7. Schedule
| Activity | Start | End | Resource |
|----------|-------|-----|----------|
| Test planning | [Date] | [Date] | [Who] |
| Test execution | [Date] | [Date] | [Who] |
| Defect resolution | [Date] | [Date] | [Who] |
| Regression testing | [Date] | [Date] | [Who] |

### 8. Risks
| Risk | Mitigation |
|------|------------|
| [Risk] | [Action] |
```

## Gate Review Report Template

```markdown
# Gate Review Report
## [Phase N] → [Phase N+1]

**Date:** [Date]
**Reviewer:** [Agent / Role]
**Documents Under Review:** [List]
**SRS Version:** [Version]
**Status:** PASS / CONDITIONAL PASS / FAIL

### Checklist Results

| # | Criterion | Result | Notes |
|---|-----------|--------|-------|
| 1 | [Criterion] | PASS/FAIL | [Notes] |

### Findings

| ID | Severity | Description | Resolution |
|----|----------|-------------|------------|
| F-001 | Critical/Major/Minor | [Description] | [How resolved] |

### Decision

**[PROCEED / HOLD / REWORK]**

**Rationale:** [Why this decision was made]

**Conditions (if CONDITIONAL PASS):**
- [What must be addressed and by when]

**Signatures:**
- Project Manager: ____________
- Chief Engineer: ____________
- QA Representative: ____________
```
