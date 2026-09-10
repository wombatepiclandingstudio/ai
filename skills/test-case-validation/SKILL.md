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
---

Validates, reviews, categorizes, and improves test cases using the rigorous practices that 90s-era QA teams relied on before "just click around" became acceptable. This skill ensures every test case is necessary, correct, complete, and traceable — and that the test suite as a whole has no gaps, no overlaps, and no wasted effort.

## Section Zero: Core Concepts

> "Testing shows the presence of defects, not their absence." — Edsger Dijkstra (via ISTQB)

A test suite is only as good as its weakest test case. The 90s-era approach was not about running more tests — it was about running the **right** tests. Every test case had to justify its existence, trace to a requirement, use a systematic design technique, and be free from redundancy.

**Test Level Taxonomy:**

| Level | What | Who | Scope | When |
|-------|------|-----|-------|------|
| **Unit** | Individual function, method, class | Developer | Single module in isolation | During coding |
| **Integration** | Module-to-module interfaces, data flow | Developer/QA | Multiple modules combined | After unit tests pass |
| **System** | End-to-end business workflows | QA | Complete integrated system | After integration |
| **Acceptance** | Business requirements validation | Business users/stakeholders | System against business needs | Before deployment |

**Integration Sub-Types:** Top-down, Bottom-up, Sandwich, Big-bang.

**System Sub-Types:** Functional, Performance, Stress, Load, Volume, Security, Recovery, Configuration, Documentation, Usability, Regression, Smoke, Sanity.

**Acceptance Sub-Types:** Alpha, Beta, UAT, Contract, Regulatory.

**Test Case Quality Criteria (10 criteria):** Necessary, Complete, Correct, Consistent, Independent, Traceable, Verifiable, Feasible, Precise, Atomic.

See `references/test-taxonomy.md` for full IEEE 829 document structure.

## Section One: When to Use

- The user has test cases and wants them reviewed, validated, or improved
- The user mentions "test validation," "test review," "test overlap," "test coverage," "test categorization," "unit test," "integration test," "system test," "acceptance test"
- The user wants to know if their test suite covers all requirements
- The user wants to identify redundant or overlapping tests
- The user wants help deciding what to automate vs. test manually
- The user wants test cases designed using formal techniques (ECP, BVA, decision tables)
- The user has a requirements document and needs test cases generated from it
- The user mentions "IEEE 829," "test plan," "test design," "traceability matrix"
- The user wants to improve test case quality (completeness, correctness, independence)

## Section Two: Do Not Use

- The user wants to write test code (unit test framework code, not test cases)
- The user wants to run tests, not design/review them
- The user is asking about testing theory, not practical application
- The request is about deployment verification, not test case quality

## Section Three: Hard Rules

> **HR-1.** Level is determined by what is tested, not who tests it. A developer testing a single function is unit testing. A developer testing the full system is system testing.

> **HR-2.** If a test touches multiple modules through the UI, it is system-level, not integration. Integration tests verify module interfaces without the full stack.

> **HR-3.** Every test must have exactly one level. Tests that straddle levels indicate unclear scope — split them.

> **HR-4.** Regression tests inherit the level of the original test. A regression version of a unit test stays at unit level.

> **HR-5.** Never use only one test design technique. Combine ECP + BVA as a minimum for any input-based testing.

> **HR-6.** ECP creates the partitions; BVA tests the boundaries. They are complementary, not alternatives.

> **HR-7.** Every test case must trace to at least one requirement. Orphaned tests must be justified or removed.

> **HR-8.** Gate must BLOCK when requirements have zero test cases (0% coverage) or when overlap rate exceeds 30%.

## Section Four: Decision Trees

```
Test Level Classification
├── Does the test verify a single function/method/class in isolation?
│   └── Yes → UNIT
├── Does the test verify interfaces between modules without the full stack?
│   └── Yes → INTEGRATION
├── Does the test verify end-to-end business workflows through the UI?
│   └── Yes → SYSTEM
└── Does the test verify business requirements from a stakeholder perspective?
    └── Yes → ACCEPTANCE

Automation Decision
├── Is the test run ≥3 times per release cycle?
│   ├── Yes → Is the feature stable?
│   │   ├── Yes → AUTOMATE
│   │   └── No → REVIEW AFTER FIRST PASS
│   └── No → Is it subjective (usability, look-and-feel)?
│       ├── Yes → KEEP MANUAL
│       └── No → Is it high-risk and needs frequent verification?
│           ├── Yes → AUTOMATE
│           └── No → KEEP MANUAL

Overlap Classification
├── Same steps + same expected results + same requirement?
│   └── EXACT DUPLICATE → Remove one
├── Different steps + same requirement + same inputs + same expected result?
│   └── FUNCTIONAL DUPLICATE → Consolidate
├── Tests share steps but diverge at a branch point?
│   └── PARTIAL OVERLAP → Keep both, document divergence
└── Same requirement has 5+ tests all verifying same behavior?
    └── REDUNDANT COVERAGE → Consolidate to 2-3 (happy path + edge cases)
```

## Section Five: Pipeline

Six stages, each producing an intermediate artifact. Resume from last completed output if context breaks.

### Stage 0: Intake & Inventory

Collect all test artifacts. Parse structure: ID, name, requirement ID(s), level, type, preconditions, steps, expected results, actual results, pass/fail, priority. Flag missing fields. Produce Test Inventory Report.

### Stage 1: Categorization

Assign every test case to exactly one level and one or more types. Flag ambiguous categorization. Produce Categorization Report with level, type, and rationale for each test case.

**Follow-up:** Ask "For requirements with 5+ test cases, do the tests exercise different code paths or data, or are they duplicates?"

### Stage 2: Overlap Detection

Apply four methods: Traceability Matrix Analysis, Functional Overlap Detection, Code Path Overlap, Scenario Overlap. Classify every pair. Produce Overlap Report with classifications and recommendations.

See `references/overlap-detection.md` for detailed detection methods and classification criteria.

### Stage 3: Quality Validation

Validate every test case against 10 quality criteria. For each: PASS / CONDITIONAL / FAIL. Produce Validation Report with pass/conditional/fail per test case and per criterion.

### Stage 4: Design Technique Application

Generate new test cases for gaps using systematic techniques:

| Situation | Technique |
|-----------|-----------|
| Input range or valid values | **Equivalence Partitioning** |
| Boundary conditions | **Boundary Value Analysis** |
| Complex business rules with multiple conditions | **Decision Table Testing** |
| System with distinct states and transitions | **State Transition Testing** |
| Many input parameters with interactions | **Pairwise/Combinatorial Testing** |
| Known error-prone areas | **Error Guessing** |
| Need to verify code execution | **Statement/Branch/Path Coverage** |

See `references/design-techniques.md` for application rules and examples.

### Stage 5: Manual vs. Automation Decision

Produce Automation Recommendation: Automate (high ROI) / Keep Manual (low ROI or inappropriate) / Review After First Pass.

**Automate first:** Regression, Smoke, Data-driven, Performance/Load, API/Interface, Unit tests.
**Keep manual:** Usability, Exploratory, Ad-hoc, New feature first pass, Documentation review.

### Stage 6: Documentation & Reporting

Produce IEEE 829 test documentation: Master Test Plan (MTP), Level Test Design (LTD), Level Test Case (LTC), Level Test Procedure (LTPr), Level Test Report (LTR), Anomaly Reports, Bidirectional Requirements Traceability Matrix, Test Metrics Report.

## Section Six: Error Handling

| Condition | Action |
|-----------|--------|
| Requirements exist with zero test cases (0% coverage) | **BLOCK** |
| Test case traces to no requirement (orphaned test) | **BLOCK** |
| Test case has no expected results or vague expected results | **BLOCK** |
| Test cases have contradictory expected results for same scenario | **BLOCK** |
| Critical defects exist with no test cases | **BLOCK** |
| Traceability matrix has gaps in either direction | **BLOCK** |
| Test cannot be executed (missing environment, data, or tools) | **BLOCK** |
| Overlap rate exceeds 30% (massive redundancy) | **BLOCK** |
| Coverage is partial (non-critical requirements without tests) | **WARN** |
| Overlap rate is 10–30% (moderate redundancy) | **WARN** |
| Some test cases lack error/boundary/edge cases | **WARN** |
| Automation rate is below 60% for regression tests | **WARN** |
| Test priority assignment is incomplete | **WARN** |
| Some test cases have hidden dependencies | **WARN** |

## Section Seven: Key Rules

1. **Overlap detection is mandatory.** Never ship a test suite without quantifying redundancy.
2. **Quality criteria are non-negotiable.** All 10 criteria must pass for a test case to be considered complete.
3. **Design techniques are complementary.** ECP + BVA together, error guessing supplements but never replaces formal techniques.
4. **Automation is ROI-driven.** Automate high-frequency, stable, deterministic tests first.

**Anti-Patterns to Watch For:**

1. Vague expected results — "System works correctly" → Rewrite with specific values
2. Happy-path-only testing → Generate error, boundary, edge cases
3. Untestable requirements — "System is fast" → Quantify before writing tests
4. Test interdependence → Make each test self-contained
5. Orphaned test cases (no requirement) → Justify or remove
6. Orphaned requirements (no tests) → Add tests
7. Massive redundant test suites → Overlap detection, consolidate
8. Manual regression testing → Automate
9. Missing error handling tests → Add error conditions
10. Wrong test level → Recategorize
11. Non-atomic tests → Split into one thing per test case
12. Untestable expected results — "User is happy" → Rewrite as measurable outcome

## Section Eight: Evidence & Checklist

**Deliverables:**

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

**Checklist:**

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

## Reference Guides

| Guide | Location | Contents |
|-------|----------|----------|
| Test Taxonomy | `references/test-taxonomy.md` | IEEE 829 document structure, test level details |
| Overlap Detection | `references/overlap-detection.md` | Detection methods, classification criteria, report templates |
| Design Techniques | `references/design-techniques.md` | ECP, BVA, decision tables, state transitions — application rules and examples |
