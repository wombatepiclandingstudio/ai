# Test Case Validation (condensed)

Condensed version of `SKILL.md` for tools that do not natively read the Agent Skills
`SKILL.md` format. Point your tool's memory/instructions file (e.g. `AGENTS.md`,
`CLAUDE.md`, `GEMINI.md`, `.windsurferules`) at this content. Canonical source: `SKILL.md`.

## Trigger Phrases

- "test validation", "test review", "test overlap", "test coverage", "test categorization"
- "unit test", "integration test", "system test", "acceptance test", "regression test"
- "IEEE 829", "test plan", "test design", "traceability matrix"
- "automate tests", "manual vs automated", "test design techniques"
- "equivalence partitioning", "boundary value analysis", "decision table testing"

## When to use

- User has test cases and wants them reviewed, validated, or improved
- User wants to know if test suite covers all requirements
- User wants to identify redundant or overlapping tests
- User wants help deciding what to automate vs. test manually
- User wants test cases designed using formal techniques

## Do not use when

- User wants to write test framework code (not test cases)
- User wants to run tests, not design/review them
- Request is about testing theory, not practical application

## Six-Stage Pipeline

```
Intake & Inventory → Categorization → Overlap Detection → Quality Validation
  → Design Technique Application → Documentation & Reporting
```

### Stage 0 — Intake & Inventory
Collect all test artifacts. Parse structure (ID, name, requirement trace, level, type,
preconditions, steps, expected results, priority). Produce Test Inventory Report.

### Stage 1 — Categorization
Assign every test case to exactly one level and one or more types:

**Levels:** Unit → Integration → System → Acceptance

| Level | What | Who | When |
|-------|------|-----|------|
| Unit | Single function/method/class | Developer | During coding |
| Integration | Module interfaces, data flow | Developer/QA | After unit tests |
| System | End-to-end workflows | QA | After integration |
| Acceptance | Business requirements | Business users | Before deployment |

**Integration sub-types:** Top-down, Bottom-up, Sandwich, Big-bang
**System sub-types:** Functional, Performance, Stress, Load, Volume, Security, Recovery, Configuration, Documentation, Usability, Regression, Smoke, Sanity
**Acceptance sub-types:** Alpha, Beta, UAT, Contract, Regulatory

**Rules:**
- Level = what is tested, not who tests it
- Multi-module via UI = system-level, not integration
- Regression tests inherit the original test's level
- Every test must have exactly one level and at least one type

### Stage 2 — Overlap Detection

**Methods:**
1. Traceability matrix analysis (requirements → tests, find gaps and excess)
2. Functional overlap (same requirement + same inputs + same results = duplicate)
3. Code path overlap (identical coverage = consolidate)
4. Scenario overlap (same workflow + same data = duplicate)

**Classifications:**
| Class | Action |
|-------|--------|
| Exact Duplicate | Remove one |
| Functional Duplicate | Consolidate |
| Partial Overlap | Keep both, document divergence |
| Redundant Coverage (5+ tests for same req) | Consolidate to 2-3 |
| No Overlap | Keep all |

Produce an Overlap Report with every pair classified and recommended action.

### Stage 3 — Quality Validation

Validate every test case against 10 criteria:

| Criterion | Definition |
|-----------|-----------|
| Necessary | Has clear purpose, no exact duplicate |
| Complete | Happy + error + edge cases covered |
| Correct | Tests the right thing with right inputs/results |
| Consistent | No contradictions with other tests |
| Independent | Can run in any order |
| Traceable | Maps to a specific requirement |
| Verifiable | Expected results are unambiguous and measurable |
| Feasible | Can be executed with available resources |
| Precise | Steps clear enough for any tester |
| Atomic | Tests one thing per test case |

Produce Validation Report: PASS / CONDITIONAL / FAIL per test case per criterion.

### Stage 4 — Design Technique Application

For gaps identified in Stage 3, generate new test cases using systematic techniques:

| Situation | Technique |
|-----------|-----------|
| Input range or valid values | Equivalence Partitioning |
| Boundary conditions | Boundary Value Analysis |
| Complex business rules | Decision Table Testing |
| Stateful system | State Transition Testing |
| Many parameters with interactions | Pairwise/Combinatorial |
| Known error-prone areas | Error Guessing |
| Need code execution verification | Statement/Branch/Path Coverage |

**Rules:** ECP + BVA always together. Error guessing supplements, never replaces,
formal techniques. Pairwise for parameter interactions only. State transition for
stateful systems only.

### Stage 5 — Manual vs. Automation Decision

| Factor | Automate | Keep Manual |
|--------|----------|-------------|
| Frequency | Run ≥3 times | Run once or rarely |
| Stability | Stable, unlikely to change | New, evolving |
| Determinism | Clear pass/fail | Subjective judgment |
| Data volume | Large, parameterized | Small, one-off |
| Time benefit | Long-running | Quick, manual faster |

**Automate first:** Regression, Smoke, Data-driven, Performance/Load, API/Interface, Unit tests
**Keep manual:** Usability, Exploratory, Ad-hoc, New feature first pass, Documentation review

### Stage 6 — Documentation (IEEE 829)

Produce:
- Master Test Plan (MTP) or Level Test Plan (LTP)
- Level Test Design (LTD)
- Level Test Case (LTC) specifications
- Level Test Procedure (LTPr)
- Level Test Report (LTR)
- Anomaly Reports
- Bidirectional Requirements Traceability Matrix
- Test Metrics Report

## Anti-Patterns

1. Vague expected results — "works correctly" → quantify
2. Happy-path-only testing → add error, boundary, edge cases
3. Untestable requirements — "fast" → quantify before testing
4. Test interdependence → make each test self-contained
5. Orphaned test cases (no requirement) → justify or remove
6. Orphaned requirements (no tests) → add tests
7. Massive redundant test suites → overlap detection, consolidate
8. Manual regression testing → automate
9. Missing error handling tests → add error conditions
10. Wrong test level → recategorize
11. Non-atomic tests → split
12. Untestable expected results → rewrite as measurable outcomes

## Gate (BLOCK)

- Requirements with zero test cases (0% coverage)
- Test cases tracing to no requirement (orphaned)
- No expected results or vague expected results
- Contradictory expected results for same scenario
- Critical defects with no test cases
- Traceability matrix gaps in either direction
- Test cannot be executed (missing environment/data/tools)
- Overlap rate >30%

## Gate (WARN)

- Partial coverage (non-critical requirements without tests)
- Overlap rate 10–30%
- Some tests lack error/boundary/edge cases
- Some non-specific expected results
- Automation rate <60% for regression
- Incomplete priority assignment
- Some hidden test dependencies
