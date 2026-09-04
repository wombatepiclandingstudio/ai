# Review Checklists

Checklists for each quality gate in the waterfall-blueprint pipeline.
Use these during gate reviews to determine PASS / CONDITIONAL PASS / FAIL.

## Gate 0 — Intake & Scoping

### Must PASS
- [ ] Project name and version identified
- [ ] Business problem statement is clear and specific
- [ ] Scope boundary defined (IN scope and OUT of scope lists)
- [ ] At least one stakeholder role identified
- [ ] At least one constraint identified (technology, regulatory, schedule, budget)
- [ ] Success criteria are measurable

### May CONDITION
- [ ] Stakeholder list is incomplete (key roles not identified)
- [ ] Constraints are approximate (not final)
- [ ] Existing system integration details are pending
- [ ] Timeline is aspirational (not committed)

### Gate Output
- [ ] Project Context Document (PCD) produced
- [ ] PCD presented to user for confirmation
- [ ] User confirmed or requested changes

## Gate 1 — Requirements / SRS

### Must PASS
- [ ] Every functional requirement has a unique ID (FR-NNN)
- [ ] Every requirement is verifiable (test or inspection can prove it)
- [ ] No requirement contradicts another requirement
- [ ] Performance requirements are quantified (response time, throughput, concurrency)
- [ ] All 8 requirement categories are addressed (even if "not applicable" with rationale)
- [ ] Every requirement has a priority (Must / Should / Could / Won't)
- [ ] Every requirement has acceptance criteria
- [ ] Requirements Traceability Matrix (RTM) is complete (100% coverage)
- [ ] SRS follows IEEE 830 structure (all sections populated)
- [ ] Assumptions are documented with risk ratings
- [ ] Contradictions resolved (if any were found, user confirmed resolution)

### May CONDITION
- [ ] Some performance thresholds are approximate (not final numbers)
- [ ] Some edge cases are deferred (with explicit decision recorded)
- [ ] Non-functional requirements are partially quantified
- [ ] Some integration details are pending (external system specs not available)
- [ ] Database requirements are high-level (schema details in design phase)

### Anti-Pattern Check
- [ ] No vague requirements ("fast", "user-friendly", "scalable" without quantification)
- [ ] No implementation requirements (technology choices deferred to design)
- [ ] No unbounded scope ("all file types", "any user", "unlimited")
- [ ] No missing error conditions (every functional req has error handling)
- [ ] No missing acceptance criteria

### Gate Output
- [ ] SRS document produced following IEEE 830
- [ ] RTM with 100% forward coverage
- [ ] Gate Review Report produced with checklist results

## Gate 2 — High-Level Design / SDD

### Must PASS
- [ ] Architecture addresses all functional requirements (no requirement orphaned)
- [ ] Every SDD module traces to at least one SRS requirement
- [ ] Every SRS requirement traces to at least one SDD module
- [ ] Data architecture (ERD) is defined
- [ ] External interfaces are specified (protocol, format)
- [ ] Technology choices are justified (not just listed)
- [ ] Top 5 risks identified with mitigations
- [ ] SDD follows IEEE 1016 structure
- [ ] RTM updated with module mappings

### May CONDITION
- [ ] Some module responsibilities are approximate (pending detailed design)
- [ ] Technology choices pending final evaluation (spike results needed)
- [ ] UI wireframes are text descriptions only (no visual mockups)
- [ ] Performance architecture (caching, CDN, load balancing) is high-level

### Anti-Pattern Check
- [ ] No modules without SRS requirement traceability (orphaned modules)
- [ ] No SRS requirements without module traceability (orphaned requirements)
- [ ] No technology choices without justification
- [ ] No missing interface specifications

### Gate Output
- [ ] SDD document produced following IEEE 1016
- [ ] RTM updated with bidirectional coverage
- [ ] Gate Review Report produced

## Gate 3 — Detailed Design / DDS

### Must PASS
- [ ] Every module has a complete DDS (inputs, outputs, algorithms, error handling)
- [ ] Complex algorithms have pseudocode or structured English
- [ ] Interface contracts are complete (signatures, types, return values, error codes)
- [ ] Error conditions are defined for every module
- [ ] State diagrams exist for stateful modules
- [ ] Dependencies are documented (other modules, external libraries)
- [ ] RTM updated with DDS spec mappings

### May CONDITION
- [ ] Non-critical module details are incomplete (but documented as pending)
- [ ] Some algorithm details are approximate (pending implementation spike)
- [ ] Performance optimizations are noted but not detailed

### Anti-Pattern Check
- [ ] No module without algorithm specification
- [ ] No module without error handling specification
- [ ] No module without interface contract
- [ ] No undocumented dependencies

### Gate Output
- [ ] DDS produced for every module
- [ ] RTM updated
- [ ] Gate Review Report produced

## Gate 4 — Implementation Planning

### Must PASS
- [ ] Coding standards defined (naming, comments, complexity, forbidden constructs)
- [ ] Code review process defined (Fagan inspection or equivalent)
- [ ] Version control plan defined (branching, commit format, tags)
- [ ] Build plan defined (environment, compilation, dependencies)
- [ ] Technology stack confirmed (no open questions)

### May CONDITION
- [ ] Developer assignments pending
- [ ] CI/CD pipeline details pending (infrastructure not provisioned)
- [ ] Some coding standards are organizational defaults (not project-specific)

### Gate Output
- [ ] Implementation Plan document produced
- [ ] Gate Review Report produced

## Gate 5 — Test Planning

### Must PASS
- [ ] Every SRS requirement has at least one test case
- [ ] Test cases have unique IDs (TC-NNN) mapped to requirement IDs (FR-NNN)
- [ ] Entry criteria defined
- [ ] Exit criteria defined
- [ ] Test environment specified
- [ ] Test types identified (unit, integration, system, acceptance, performance, security)
- [ ] RTM shows 100% test coverage of requirements

### May CONDITION
- [ ] Test automation coverage target is aspirational
- [ ] Performance test parameters are approximate
- [ ] Security testing scope is high-level (pending vulnerability assessment)
- [ ] Usability testing participants not identified

### Anti-Pattern Check
- [ ] No requirement without test coverage
- [ ] No test case without pass/fail criteria
- [ ] No test case without expected result

### Gate Output
- [ ] IEEE 829 Test Plan produced
- [ ] RTM with 100% test coverage
- [ ] Gate Review Report produced

## Gate 6 — Deployment & Maintenance

### Must PASS
- [ ] Deployment procedure defined (step-by-step)
- [ ] Rollback procedure defined
- [ ] Configuration management plan produced
- [ ] Baselines identified (Functional, Allocated, Developmental, Product)
- [ ] Maintenance plan produced (defect tracking, release management)
- [ ] Quality assurance plan produced (process audits, metrics)

### May CONDITION
- [ ] Training materials are drafts
- [ ] User documentation is outline only
- [ ] Monitoring/alerting rules are high-level
- [ ] Disaster recovery procedures are draft

### Gate Output
- [ ] Deployment Plan produced
- [ ] Maintenance Plan produced
- [ ] CM Plan produced
- [ ] QA Plan produced
- [ ] Full specification package complete
- [ ] Final Gate Review Report produced
- [ ] Complete RTM (bidirectional, 100% coverage)

## Final Package Verification

Before declaring the specification complete, verify:

- [ ] All 7 documents produced (PCD, SRS, SDD, DDS, Impl Plan, Test Plan, Deploy Plan)
- [ ] All 3 supporting plans produced (CM Plan, QA Plan, Maintenance Plan)
- [ ] RTM is complete with bidirectional coverage (100%)
- [ ] Gate Review Reports exist for all 7 transitions (0→1, 1→2, 2→3, 3→4, 4→5, 5→6, final)
- [ ] Glossary is complete
- [ ] Decision log is complete (all user decisions recorded with rationale)
- [ ] Risk register is complete (all identified risks with mitigations)
- [ ] No anti-patterns remain unfixed
- [ ] All BLOCK conditions resolved
- [ ] All WARN conditions documented with rationale
