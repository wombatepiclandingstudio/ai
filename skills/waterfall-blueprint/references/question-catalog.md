# Follow-Up Question Catalog

Categorized follow-up questions the agent should use during interactive requirements
elicitation. These are not exhaustive — adapt them to the specific project. The goal
is to leave no gap.

## Phase 0 — Intake & Scoping

### Business Context
- What problem does this solve? Who has the problem today?
- What is the cost of NOT building this? (Opportunity cost, manual effort, risk.)
- Who benefits from this system? Describe their daily workflow.
- What does success look like? How will we measure it?

### Scope
- What is IN scope for the first release?
- What is explicitly OUT of scope? (The "not now" list.)
- What features are planned for future releases?
- Are there any "must have" features that are non-negotiable?

### Stakeholders
- Who is the primary user? Describe their role, skill level, and daily tasks.
- Who are the decision-makers? Who has final sign-off authority?
- Who are the operators/maintainers? What is their technical level?
- Are there any regulatory stakeholders (auditors, compliance officers)?

### Constraints
- Is there a hard deadline? What happens if we miss it?
- What is the budget (people, tools, infrastructure)?
- Are there technology mandates (specific languages, platforms, cloud providers)?
- Are there regulatory requirements (HIPAA, PCI-DSS, SOX, GDPR, ADA)?

### Existing Systems
- What systems does this integrate with? What are the interfaces?
- What does this replace? What must it coexist with?
- Is there existing data that must be migrated?
- Are there existing APIs or services we must consume?

## Phase 1 — Requirements Elicitation

### Functional Requirements

For each feature or capability:

- What exactly should the system do? (Describe the behavior, not the implementation.)
- What are the inputs? Where do they come from? What format?
- What are the outputs? Where do they go? What format?
- What happens if the input is invalid? Missing? Corrupt?
- What happens if an external system is unavailable?
- What are the business rules? (Pricing, validation, authorization, scheduling.)
- What is the workflow? (Steps, approvals, escalations, notifications.)
- What is the expected data volume? Growth rate?
- Are there any integration points? (APIs, files, messages.)
- What is the priority? (Must / Should / Could / Won't.)

### External Interfaces

#### User Interfaces
- What screens/pages are needed? What goes on each one?
- What actions can the user take from each screen?
- What information is displayed on each screen?
- What are the navigation flows between screens?
- Are there different user roles with different views?
- What are the error messages? Warning messages? Success messages?
- What are the accessibility requirements? (WCAG level.)

#### API Interfaces
- What endpoints are needed? What does each one do?
- What is the request/response format?
- What authentication is required?
- What are the rate limits?
- What error codes and messages are returned?
- Is there versioning? Deprecation policy?

#### Software Interfaces
- What external systems does this call? What does it receive?
- What is the data format for each interface?
- What happens if the external system is down?
- Is there a fallback or retry mechanism?

### Performance Requirements

- What is the maximum acceptable response time for each operation?
- What is the expected throughput (requests per second)?
- How many concurrent users/sessions are expected?
- What is the data volume at launch? At peak? Growth rate?
- Are there batch operations? What is the expected batch size and duration?
- Are there time-of-day usage patterns (peak hours, end-of-month)?

### Database Requirements

- What entities/objects does the system manage?
- What are the relationships between entities?
- What is the expected data volume per entity?
- What is the data retention policy?
- What are the backup and recovery requirements?
- Is there an existing database schema to work with?

### Security Requirements

- How are users authenticated? (Password, SSO, MFA, OAuth, SAML?)
- How is authorization managed? (RBAC, ABAC, custom?)
- What data is sensitive? (PII, PHI, financial, credentials?)
- What encryption is required? (At rest, in transit, key management?)
- What audit logging is required? (Who did what, when, from where?)
- What compliance standards apply? (HIPAA, PCI-DSS, SOC 2, GDPR?)
- What are the session management rules? (Timeout, concurrent sessions?)

### Safety Requirements

- What happens if the system crashes mid-operation?
- What happens if data is partially written?
- What is the disaster recovery plan? (RTO, RPO.)
- What is the rollback procedure for each operation?
- What are the data integrity guarantees?

### Quality Attributes

- What is the required uptime? (99.9% = 8.76 hours downtime/year.)
- What is the acceptable mean time between failures (MTBF)?
- What is the acceptable mean time to repair (MTTR)?
- What is the expected system lifetime?
- What is the maintainability requirement? (Code coverage, documentation.)
- What are the portability requirements? (OS, browser, device support.)

### Assumptions

- What are we assuming to be true about the users?
- What are we assuming about the data?
- What are we assuming about the infrastructure?
- What are we assuming about the timeline?
- What are we assuming about other teams/services?

### Constraints

- What technology constraints exist?
- What organizational constraints exist?
- What regulatory constraints exist?
- What budget/schedule constraints exist?
- What team composition constraints exist?

## Phase 2 — High-Level Design

### Architecture

- What is the deployment topology? (Monolith, microservices, serverless, hybrid?)
- What are the major subsystems/modules?
- How do they communicate? (HTTP, gRPC, message queue, shared database?)
- What are the data flows between modules?
- What technology choices are being made and why?

### Data

- What is the data model? (Entities, relationships, cardinality.)
- What database technology is appropriate? (Relational, document, key-value, graph?)
- Is there a caching strategy? What data is cached?
- Is there a data warehouse or analytics requirement?

### Integration

- What external systems must we integrate with?
- What APIs do we consume? What APIs do we expose?
- What message formats are used? (JSON, XML, Protocol Buffers?)
- What is the error handling strategy for integrations?

### Risk

- What are the top 5 technical risks?
- What are the mitigation strategies?
- Are there any proof-of-concept needs? (Spikes.)

## Phase 3 — Detailed Design

### Per Module

- What is the module's responsibility? (Single Responsibility.)
- What are the inputs and outputs?
- What algorithms are used? (Pseudocode for complex ones.)
- What data structures are used?
- What error conditions can occur?
- How are errors handled? (Retry, fallback, fail, alert.)
- What state does the module maintain?
- What are the dependencies on other modules?
- What are the dependencies on external libraries/services?

## Phase 4 — Implementation Planning

### Process

- What programming language(s)?
- Are there existing coding standards?
- What code review process? (Peer review, Fagan inspection, pair programming?)
- What version control system? Branching strategy?
- What build system? CI/CD pipeline?
- What static analysis tools?

### Team

- What is the team size and composition?
- What are the skill sets needed?
- How will work be distributed across developers?
- What is the onboarding process for new team members?

## Phase 5 — Test Planning

### Strategy

- What test levels are used? (Unit, integration, system, acceptance?)
- What test automation tools are available?
- What is the target test coverage?
- Who performs testing? (QA team, developers, end users?)
- What is the test environment? (Production-like, sandbox, shared?)

### Acceptance

- What is the acceptance criteria for each requirement?
- Who signs off on acceptance testing?
- What is the UAT process?
- Are there regulatory testing requirements?

## Phase 6 — Deployment & Maintenance

### Deployment

- What is the deployment target? (Cloud provider, on-prem, app store?)
- What is the deployment process? (Manual, automated, staged?)
- What is the rollback procedure if deployment fails?
- Is there a data migration? What is the strategy?
- What is the cutover strategy? (Big bang, phased, parallel?)

### Operations

- Who maintains the system post-deployment?
- What is the SLA? (Response time, resolution time.)
- What monitoring and alerting is in place?
- What is the incident response process?

### Maintenance

- What is the release cadence?
- What is the patch management process?
- What is the end-of-life plan?
- What documentation is maintained?
