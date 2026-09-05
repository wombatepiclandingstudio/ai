---
name: test-case-validation
description: >
  Validate, review, and improve test cases using 1990s-era testing rigor. Categorizes
  tests into the correct level (unit, integration, system, acceptance), detects overlap
  and redundancy, validates completeness against requirements via traceability, and
  recommends design techniques (equivalence partitioning, boundary value analysis,
  decision tables, state transitions). Covers manual and automated testing with
  a decision framework for what to automate. Produces IEEE 829-compliant test
  documentation. Interactive: asks follow-up questions, walks through gaps,
  validates every assertion.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [testing, test-cases, validation, overlap-detection, categorization, unit-testing, integration-testing, system-testing, acceptance-testing, regression, ieee-829, automation, manual-testing, traceability, coverage, equivalence-partitioning, boundary-value-analysis]
---

# Test Case Validation Skill

Validates, reviews, categorizes, and improves test cases using the rigorous practices
that90s-era QA teams relied on before "just click around" became acceptable. This skill
ensures every test case is necessary, correct, complete, and traceable — and that the
test suite as a whole has no gaps, no overlaps, and no wasted effort.

This is not a testing tutorial. It is an **interactive test quality engine** that
categorizes tests into the correct level, detects redundancy and overlap, validates
completeness against requirements, recommends black-box and white-box design techniques,
and produces IEEE 829-compliant test documentation.

## Use when

- The user has test cases and wants them reviewed, validated, or improved
- The user mentions "test validation," "test review," "test overlap," "test coverage,"
  "test categorization," "unit test," "integration test," "system test," "acceptance test"
- The user wants to know if their test suite covers all requirements
- The user wants to identify redundant or overlapping tests
- The user wants help deciding what to automate vs. test manually
- The user wants test cases designed using formal techniques (ECP, BVA, decision tables)
- The user has a requirements document and needs test cases generated from it
- The user mentions "IEEE 829," "test plan," "test design," "traceability matrix"
- The user wants to improve test case quality (completeness, correctness, independence)

## Do not use when

- The user wants to write test code (unit test framework code, not test cases)
- The user wants to run tests, not design/review them
- The user is asking about testing theory, not practical application
- The request is about deployment verification, not test case quality

---

## Core Philosophy

> "Testing shows the presence of defects, not their absence." — Edsger Dijkstra (via ISTQB)

A test suite is only as good as its weakest test case. The90s-era approach to testing
was not about running more tests — it was about running the **right** tests. Every test
case had to justify its existence, trace to a requirement, use a systematic design
technique, and be free from redundancy. This skill restores that discipline.

---

## The Validation Pipeline

The pipeline has **six stages**. Each stage produces an intermediate artifact.
If a context break occurs, resume from the last completed output.

```
Intake & Inventory → Categorization → Overlap Detection → Quality Validation
  → Design Technique Application → Documentation & Reporting
```

### Stage 0: Intake & Inventory

Before validating anything, inventory what exists.

1. **Collect all test artifacts** — Test cases, test plans, test scripts, requirements
   documents, any existing traceability matrices.
2. **Parse test case structure** — For each test case, extract:
   - Test case ID
   - Name / Title
   - Requirement ID(s) it traces to (if any)
   - Test level (unit, integration, system, acceptance — if categorized)
   - Test type (functional, performance, security, regression, etc.)
   - Preconditions
   - Test steps
   - Expected results
   - Actual results (if executed)
   - Pass/fail status
   - Priority / Severity
3. **Identify gaps in test case structure** — Flag test cases missing any required field.
4. **Produce a Test Inventory Report** — Total count, categorized by level and type,
   completeness stats, fields with missing data.

**Follow-up questions for Stage 0:**

- "How many test cases do you have? Are they in a test management tool, spreadsheet, or code?"
- "Do you have a requirements document I can trace against?"
- "Have these test cases been executed? If so, what were the results?"
- "Are there known defects that these tests should cover?"
- "What is the test scope? (Full system, specific module, specific feature?)"

### Stage 1: Categorization

Categorize every test case into the correct level and type. Incorrect categorization
wastes resources — a unit-level question answered by a system test is expensive,
and a system-level question answered by a unit test is incomplete.

#### Test Level Taxonomy

| Level | What | Who | Scope | When |
|-------|------|-----|-------|------|
| **Unit** | Individual function, method, class | Developer | Single module in isolation | During coding |
| **Integration** | Module-to-module interfaces, data flow | Developer/QA | Multiple modules combined | After unit tests pass |
| **System** | End-to-end business workflows | QA | Complete integrated system | After integration |
| **Acceptance** | Business requirements validation | Business users/stakeholders | System against business needs | Before deployment |

#### Integration Sub-Types

| Sub-Type | Strategy | When to Use |
|----------|----------|-------------|
| **Top-down** | Test from top modules, stub lower | Architecture-driven, UI-first validation |
| **Bottom-up** | Test from bottom modules, driver upper | Data-driven, database-first validation |
| **Sandwich** | Both top-down and bottom-up | Large systems, parallel testing |
| **Big-bang** | Integrate all, then test | Small systems, last resort |

#### System Test Sub-Types

| Sub-Type | What | Risk if Skipped |
|----------|------|-----------------|
| **Functional** | Does it do what the spec says | Wrong behavior ships |
| **Performance** | Response time, throughput under load | Slow system in production |
| **Stress** | Behavior under extreme load | System crashes under peak |
| **Load** | Behavior under expected peak load | Performance degrades at scale |
| **Volume** | Large data amounts | Data corruption, out-of-memory |
| **Security** | Vulnerabilities, unauthorized access | Data breach, compliance failure |
| **Recovery** | Recovery after failure | Data loss, downtime |
| **Configuration** | Behavior across configs | Breaks on specific environments |
| **Documentation** | Manuals match system behavior | User confusion, support burden |
| **Usability** | User experience evaluation | Poor adoption, user frustration |
| **Regression** | Changes don't break existing | Known features stop working |
| **Smoke** | Quick build verification | Broken builds waste test time |
| **Sanity** | Focused post-change verification | Localized breakage missed |

#### Acceptance Sub-Types

| Sub-Type | Who | Where | Purpose |
|----------|-----|-------|---------|
| **Alpha** | Internal staff / selected users | Developer's site | Early validation |
| **Beta** | Limited users | User's site | Pre-release validation |
| **UAT** | Business users | Any | Business requirement verification |
| **Contract** | Contractual party | Any | Contractual criteria verification |
| **Regulatory** | Compliance officer | Any | Regulatory requirement verification |

#### Categorization Rules

1. **Level is determined by what is tested, not who tests it.** A developer testing
   a single function is unit testing. A developer testing the full system is system testing.
2. **If a test touches multiple modules through the UI, it is system-level**, not
   integration. Integration tests verify module interfaces without the full stack.
3. **Regression tests inherit the level of the original test.** A regression version
   of a unit test stays at unit level.
4. **Every test must have exactly one level.** Tests that straddle levels indicate
   unclear scope — split them.
5. **Every test must have at least one type.** Functional is the default, but
   performance, security, etc. are additional types that may overlap.

**Gate 1 output:** Complete categorization of all test cases with level, type, and
rationale for each. Flag any test case where categorization is ambiguous.

### Stage 2: Overlap Detection

Redundant tests waste execution time and create false confidence ("we have 500 tests"
means nothing if 200 test the same thing). The agent must systematically detect overlap.

#### Overlap Detection Methods

**Method 1: Traceability Matrix Analysis**
- Map every test case to its requirement(s).
- Requirements with many test cases → potential redundancy (investigate if tests
  exercise different paths or just duplicate the same path).
- Requirements with zero test cases → coverage gap.
- Test cases tracing to zero requirements → unjustified test (why does it exist?).

**Method 2: Functional Overlap Detection**
- Two test cases overlap if they:
  - Verify the same requirement with the same inputs → DUPLICATE (remove one)
  - Verify the same requirement with different inputs → VALID (keep both)
  - Verify the same requirement with different expected results → CONFLICT (resolve)
  - Test the same module/function but verify different requirements → VALID
  - Test the same module/function with the same inputs and expected results → DUPLICATE

**Method 3: Code Path Overlap (for automated/unit tests)**
- Two unit tests overlap if they produce identical code coverage.
- If both tests cover the same branches and statements, consolidate.
- If they cover different branches, both are necessary.

**Method 4: Scenario Overlap**
- Two system tests overlap if they execute the same business workflow
  end-to-end with the same data and expected outcomes.
- Different data = valid. Same data, different expected outcome = conflict.

#### Overlap Classification

| Classification | Definition | Action |
|----------------|-----------|--------|
| **Exact Duplicate** | Same steps, same expected results, same requirement | Remove one |
| **Functional Duplicate** | Different steps, same requirement, same input range, same expected result | Consolidate |
| **Partial Overlap** | Tests share some steps but diverge at a branch point | Keep both, document the divergence |
| **Redundant Coverage** | Same requirement has 5+ tests that all verify the same behavior | Consolidate to 2-3 (happy path + edge cases) |
| **No Overlap** | Tests verify different requirements or different code paths | Keep all |

#### Overlap Report

The agent must produce an Overlap Report:

```
Overlap Analysis Report
Total test cases: N
Analyzed pairs: N×(N-1)/2

Exact Duplicates Found: X
- TC-001 ↔ TC-045 (same steps, same results) → RECOMMEND: Remove TC-045

Functional Duplicates Found: Y
- TC-002 ↔ TC-046 (same requirement FR-003, same inputs) → RECOMMEND: Consolidate

Partial Overlaps Found: Z
- TC-003 ↔ TC-047 (diverge at step 3) → KEEP: Different error paths

Coverage Gaps: W
- FR-012 has no test cases → ADD: Create test case for FR-012

Unjustified Tests: V
- TC-099 traces to no requirement → REVIEW: Justify or remove
```

**Follow-up questions for Stage 2:**

- "For requirements with 5+ test cases, do the tests exercise different code paths
  or data, or are they duplicates?"
- "For TC-[NNN], what business scenario does this test that TC-[MMM] does not?"
- "Are there any test cases you keep for historical reasons but no longer need?"
- "For test cases with no requirement traceability, what is the business justification?"

**Gate 2 output:** Overlap Report with classifications and recommendations.
Every overlap has a recommendation (remove, consolidate, keep).

### Stage 3: Quality Validation

Validate every test case against the90s QA quality criteria. Each criterion
is a checklist item — the test case must pass all of them.

#### Test Case Quality Criteria

| Criterion | Definition | How to Validate |
|-----------|-----------|----------------|
| **Necessary** | Has a clear purpose; not redundant | Purpose statement exists; no exact duplicate |
| **Complete** | Covers the requirement fully (happy + error + edge) | Has preconditions, steps, expected results, error handling |
| **Correct** | Tests the right thing with right inputs/expected results | Peer review; expected results match requirement |
| **Consistent** | No contradictions with other test cases | No conflicting expected results for same scenario |
| **Independent** | Can run in any order; no hidden dependencies | No setup that requires another test to have run first |
| **Traceable** | Maps to a specific requirement | Requirement ID present; RTM updated |
| **Verifiable** | Expected results are unambiguous and measurable | Specific values, not "system works correctly" |
| **Feasible** | Can be executed with available resources | Environment, data, tools available |
| **Precise** | Steps are clear enough for any tester to execute | No ambiguity in steps; specific actions |
| **Atomic** | Tests one thing per test case | Single expected result per scenario (or clearly grouped) |

#### Validation Checklist

For each test case, the agent must evaluate:

- [ ] Has a unique ID
- [ ] Has a descriptive name/title
- [ ] Has a purpose statement (why does this test exist?)
- [ ] Traces to at least one requirement
- [ ] Has defined preconditions
- [ ] Has step-by-step execution instructions
- [ ] Has specific, measurable expected results
- [ ] Has error handling test cases (not just happy path)
- [ ] Has boundary value test cases (not just typical values)
- [ ] Has edge case test cases (empty, null, max, min, special characters)
- [ ] Can be executed independently (no hidden dependencies)
- [ ] Has priority assigned (High/Medium/Low)
- [ ] Has correct categorization (level + type)

#### Validation Report

The agent must produce a Validation Report:

```
Test Case Validation Report
Total test cases: N

PASS: X (Y%)
CONDITIONAL: Z (need clarification or minor fixes)
FAIL: W (critical issues)

Failing Criteria:
- Missing requirement traceability: [list]
- Missing expected results: [list]
- Vague expected results ("works correctly"): [list]
- Missing preconditions: [list]
- Hidden dependencies: [list]
- Not atomic (tests multiple things): [list]
- Missing error/edge cases: [list]
- Incorrect categorization: [list]
```

**Follow-up questions for Stage 3:**

- "For TC-[NNN], what is the expected result when [error condition]?"
- "Can TC-[NNN] be executed without TC-[NNN-1] having run first?"
- "What makes TC-[NNN] necessary if TC-[MMM] already exists?"
- "For requirement FR-NNN, is testing the happy path sufficient, or do you need
  error and boundary cases?"

**Gate 3 output:** Complete Validation Report with pass/conditional/fail per test case
and per criterion.

### Stage 4: Design Technique Application

For test cases that are incomplete, missing, or poorly designed, recommend
systematic test design techniques. For test suites that have gaps, generate
new test cases using the appropriate technique.

#### Technique Selection Guide

| Situation | Technique | Example |
|-----------|-----------|---------|
| Input range or set of valid values | **Equivalence Partitioning** | Month input 1–12: test one from [1,12], one ≤0, one ≥13 |
| Boundary conditions (min, max, just inside/outside) | **Boundary Value Analysis** | Range [1,12]: test 0, 1, 2, 11, 12, 13 |
| Complex business rules with multiple conditions | **Decision Table Testing** | Login: username valid/invalid × password valid/invalid × locked/not |
| System with distinct states and transitions | **State Transition Testing** | Order: created → confirmed → shipped → delivered |
| Many input parameters with interactions | **Pairwise/Combinatorial Testing** | Browser × OS × Screen size: pairwise instead of full matrix |
| Complex input combinations | **Cause-Effect Graphing** | Map conditions to logical expressions |
| Known error-prone areas | **Error Guessing** | Null inputs, empty strings, division by zero, overflow |
| Need to verify code execution | **Statement/Branch/Path Coverage** | Ensure every line/branch is exercised |

#### Technique Application Rules

1. **Never use only one technique.** Combine ECP + BVA as a minimum for any
   input-based testing. Add decision tables or state transitions for complex logic.
2. **ECP creates the partitions; BVA tests the boundaries.** They are complementary,
   not alternatives.
3. **Error guessing supplements formal techniques.** It does not replace them.
4. **Pairwise is for parameter interactions.** If parameters are independent,
   use ECP per parameter.
5. **State transition is for stateful systems only.** Stateless APIs don't need it.
6. **Coverage criteria are for white-box (unit) testing.** Black-box (system) testing
   uses requirement-based coverage, not code-based.

#### New Test Case Generation

When gaps are identified (missing error cases, missing boundary cases, missing
edge cases), the agent must generate new test cases:

1. **Identify the gap** — What requirement is uncovered? What scenario is missing?
2. **Select the technique** — Based on the technique selection guide.
3. **Generate the test case** — Complete with ID, steps, expected results, priority.
4. **Categorize** — Assign correct level and type.
5. **Add to RTM** — Trace to the requirement.

**Gate 4 output:** List of recommended new test cases with technique, rationale,
and categorization. Existing test cases updated where techniques revealed gaps.

### Stage 5: Manual vs. Automation Decision

Provide a framework for deciding what to automate and what to leave manual.

#### Automation Decision Matrix

| Factor | Automate | Leave Manual |
|--------|----------|--------------|
| **Frequency** | Run ≥3 times (regression, CI) | Run once or rarely |
| **Stability** | Feature is stable, unlikely to change | Feature is new, still evolving |
| **Determinism** | Clear expected results (pass/fail) | Subjective judgment (usability, look-and-feel) |
| **Data volume** | Large datasets, parameterized tests | Small, one-off data |
| **Environment** | Stable, reproducible environment | Variable, hard to reproduce |
| **Time** | Long-running, benefits from automation | Quick, manual is faster |
| **Complexity** | Simple, repeatable steps | Complex exploratory scenarios |
| **Risk** | High-risk, needs frequent verification | Low-risk, occasional check |
| **Cost** | High manual cost × high frequency = high ROI | Low manual cost or low frequency |

#### What to Automate (90s best practice)

| Category | Automate? | Reason |
|----------|-----------|--------|
| **Regression testing** | YES — highest priority | Repeated execution, deterministic |
| **Smoke testing** | YES | Quick build verification, run every build |
| **Data-driven tests** | YES | Large parameter sets, tedious manual |
| **Performance/Load** | YES | Impossible to do manually at scale |
| **API/Interface** | YES | Stable interfaces, clear contracts |
| **Unit tests** | YES | Developer-written, run on every commit |

#### What to Leave Manual (90s best practice)

| Category | Automate? | Reason |
|----------|-----------|--------|
| **Usability testing** | NO | Requires human judgment |
| **Exploratory testing** | NO | Simultaneous learning and testing |
| **Ad-hoc testing** | NO | Unstructured by nature |
| **New feature first pass** | NO | Requirements still evolving |
| **Documentation review** | NO | Human comprehension needed |
| **Accessibility testing** | PARTIAL | Some automated, most needs human review |
| **Edge cases (first pass)** | NO | Design them manually, automate after |

#### Automation Scope Recommendation

The agent must produce an Automation Recommendation:

```
Automation Recommendation

Automate (high ROI):
- TC-001 through TC-050: Regression suite, stable, deterministic
- TC-051 through TC-080: API tests, stable interfaces
- TC-081 through TC-100: Smoke tests, run every build

Keep Manual (low ROI or inappropriate):
- TC-101 through TC-130: Usability, requires human judgment
- TC-131 through TC-150: Exploratory, not repeatable

Review After First Pass:
- TC-151 through TC-180: New features, automate after stabilization
```

**Follow-up questions for Stage 5:**

- "Which test cases are run more than 3 times per release cycle?"
- "Which features are stable enough to automate?"
- "Do you have a test automation framework in place? Which one?"
- "What is the build/CI pipeline? How often are tests run?"
- "What is the budget for test automation tooling?"

**Gate 5 output:** Automation Recommendation with clear categories.

### Stage 6: Documentation & Reporting

Produce final documentation following IEEE 829 structure.

#### IEEE 829 Test Documentation

1. **Master Test Plan (MTP)** — Project-wide test strategy, scope, approach,
   resources, schedule, risks. Read `references/test-taxonomy.md` for the full
   IEEE 829 document structure.

2. **Level Test Design (LTD)** — Per test level: features to test, approach,
   test case identification, expected results, pass criteria.

3. **Level Test Case (LTC)** — Per test case: identifier, items, input/output
   specifications, environmental needs, special procedures.

4. **Level Test Procedure (LTPr)** — Per test case: purpose, prerequisites,
   step-by-step execution instructions, expected results, post-test actions.

5. **Level Test Report (LTR)** — Results summary: what was tested, what passed,
   what failed, defect summary, recommendations.

6. **Anomaly Reports** — For each defect found: identifier, description,
   incident type, detection phase, supporting evidence, impact, suggested resolution.

#### Traceability Matrix

Produce a complete bidirectional traceability matrix:

```
| Requirement | Description | Test Cases | Results | Defects | Coverage |
|-------------|-------------|------------|---------|---------|----------|
| FR-001      | User login  | TC-001, TC-002, TC-003 | Pass, Pass, Fail | DEF-045 | 100% |
| FR-002      | Password reset | TC-004, TC-005 | Pass, Pass | — | 100% |
| FR-003      | Session timeout | (none) | — | — | 0% GAP |
```

Rules:
- Every requirement must have ≥1 test case (forward coverage).
- Every test case must trace to ≥1 requirement (backward coverage).
- Every defect must trace to the test case that found it.
- 0% coverage = BLOCK. Partial coverage = WARN.

#### Test Metrics Report

Produce a metrics report:

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Requirements coverage | X% | 100% | PASS/WARN/BLOCK |
| Test case count | N | — | — |
| Tests per requirement | Avg | 2–5 | — |
| Overlap rate | X% | <10% | PASS/WARN |
| Automation rate | X% | ≥60% for regression | PASS/WARN |
| Pass rate | X% | ≥95% | PASS/WARN/BLOCK |
| Open critical defects | N | 0 | BLOCK if >0 |
| Open major defects | N | ≤3 | WARN if >3 |
| Statement coverage | X% | ≥80% | PASS/WARN |
| Branch coverage | X% | ≥70% | PASS/WARN |

**Gate 6 output:** Complete test documentation package: MTP, LTD, LTC, LTPr,
LTR, Traceability Matrix, Metrics Report.

---

## Anti-Patterns

1. **Vague expected results** — "System works correctly" → Rewrite as:
   "HTTP 200 returned, response body contains user_id field, session token issued."
2. **Happy-path-only testing** — No error, boundary, or edge cases → Generate
   using ECP + BVA + error guessing.
3. **Untestable requirements** — "System is fast" → Rewrite requirement with
   quantified performance criteria before writing tests.
4. **Test interdependence** — TC-002 requires TC-001 to have run first →
   Make each test self-contained with its own setup/teardown.
5. **Orphaned test cases** — Test case traces to no requirement → Justify or remove.
6. **Orphaned requirements** — Requirement has no test case → Add tests.
7. **Massive test suites with hidden redundancy** — 500 tests, 200 are duplicates →
   Run overlap detection, consolidate.
8. **Manual regression testing** — Re-running stable tests manually → Automate.
9. **Missing error handling tests** — Only happy path tested → Add error conditions.
10. **Wrong test level** — System test for a unit-level question → Recategorize.
11. **Non-atomic tests** — One test verifies three unrelated features → Split.
12. **Untestable expected results** — "User is happy" → Rewrite as measurable outcome.

---

## Pre-Delivery Checklist

Before declaring the test case review complete:

- [ ] All test cases inventoried (Stage 0 complete)
- [ ] Every test case categorized with correct level and type (Stage 1)
- [ ] Overlap analysis complete; every overlap classified and recommended (Stage 2)
- [ ] Every test case validated against quality criteria (Stage 3)
- [ ] Missing test cases identified and new ones generated using formal techniques (Stage 4)
- [ ] Manual vs. automation decision made for every test case (Stage 5)
- [ ] IEEE 829 documentation produced (Stage 6)
- [ ] Bidirectional traceability matrix complete (100% coverage)
- [ ] Test metrics report produced
- [ ] No anti-patterns remain unfixed
- [ ] Gate review report produced for the overall review

---

## Gate Implications

The gate must **BLOCK** when:

- Requirements exist with zero test cases (0% coverage)
- A test case traces to no requirement (orphaned test)
- A test case has no expected results or has vague expected results
- Test cases have contradictory expected results for the same scenario
- Critical defects exist with no test cases
- The traceability matrix has gaps in either direction
- A test case cannot be executed (missing environment, data, or tools)
- Overlap rate exceeds 30% (massive redundancy)

The gate must **WARN** when:

- Coverage is partial (some requirements without tests, but not critical ones)
- Overlap rate is 10–30% (moderate redundancy)
- Some test cases lack error/boundary/edge cases
- Some test cases have non-specific expected results but are otherwise complete
- Automation rate is below 60% for regression tests
- Test priority assignment is incomplete
- Some test cases have hidden dependencies

---

## Evidence Required

A test-case-validation session should produce:

- Test Inventory Report (count, completeness, structure gaps)
- Categorization Report (level + type for every test case)
- Overlap Report (duplicates, functional overlaps, partial overlaps, gaps)
- Validation Report (pass/conditional/fail per test case per criterion)
- Recommended new test cases (with technique, rationale, categorization)
- Automation Recommendation (automate / keep manual / review after first pass)
- IEEE 829 Test Plan (Master Test Plan or Level Test Plan)
- Bidirectional Requirements Traceability Matrix
- Test Metrics Report (coverage, pass rate, overlap rate, automation rate)
- Anomaly Report templates (for defects found during testing)
- Gate Review Report

---

## Test Cases

### Test Case 1: Overlap detection in a regression suite
**Input:** 200 test cases for a web application, traced to 50 requirements. Some
requirements have 8–10 test cases each. User suspects redundancy.
**Expected output:** The agent identifies exact duplicates (same steps, same results),
functional duplicates (same requirement, same inputs, different steps), and partial
overlaps. Produces an Overlap Report classifying every overlap pair and recommending
remove/consolidate/keep. Identifies which requirements are over-tested vs. under-tested.
**Assertion:** At least 3 overlap classifications identified (exact duplicate, functional
duplicate, partial overlap). Every overlap has a recommendation. Overlap rate is quantified.

### Test Case 2: Missing test design techniques
**Input:** A test suite for a login form with 5 test cases, all testing the happy path
(valid username + valid password). No error cases, no boundary cases, no edge cases.
**Expected output:** The agent identifies missing error handling tests (invalid username,
invalid password, empty fields, locked account), missing boundary tests (max length username,
special characters, SQL injection), and recommends generating them using ECP + BVA +
error guessing. Produces at least 10 new test cases covering these gaps.
**Assertion:** New test cases use at least 2 design techniques. Every new test case has
complete steps and expected results. Error conditions are covered.

### Test Case 3: Categorization and automation decision
**Input:** A mixed test suite where some unit tests are labeled as "integration tests,"
some system tests are labeled as "unit tests," and the user wants to know what to automate.
**Expected output:** The agent corrects categorization based on what is tested (not who
tests it), reassigns mislabeled tests, and produces an Automation Recommendation
separating tests into automate / keep manual / review-after-first-pass based on
frequency, stability, determinism, and ROI criteria.
**Assertion:** Every mislabeled test is re-categorized with rationale. Automation
recommendation covers all test cases with clear reasoning per category.
