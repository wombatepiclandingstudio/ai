# Test Case Validation

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills) standard) that validates, reviews, categorizes, and improves test cases using the rigorous practices from 1990s-era QA engineering. The `SKILL.md` in this folder is the single source of truth — the same file is exposed to any compatible tool via discovery paths, no text rewriting required.

## The Problem

Test suites grow organically and rot silently. Duplicate tests waste execution time. Missing error cases leave defects in production. Tests labeled "unit" that actually exercise the full system waste developer time. Tests labeled "integration" that only touch one module miss interface defects. The90s approach to testing wasn't bureaucratic — it was about running the **right** tests, not just more tests.

## What It Does

Given a set of test cases (in any format), this skill runs a **six-stage validation pipeline** that ensures every test is necessary, correct, and traceable:

| Stage | What It Does | Output |
|-------|-------------|--------|
| **Intake & Inventory** | Parses and inventories all test artifacts | Test Inventory Report |
| **Categorization** | Assigns correct level (unit/integration/system/acceptance) and type | Categorization Report |
| **Overlap Detection** | Identifies duplicates, functional overlaps, partial overlaps, gaps | Overlap Report |
| **Quality Validation** | Validates against 10 quality criteria (necessary, complete, correct, consistent, independent, traceable, verifiable, feasible, precise, atomic) | Validation Report |
| **Design Techniques** | Applies ECP, BVA, decision tables, state transitions, error guessing to fill gaps | New test case recommendations |
| **Documentation** | Produces IEEE 829-compliant test documentation with traceability | MTP, LTD, LTC, LTPr, Traceability Matrix |

## What It Covers

- **Test categorization** — Correctly assigns every test to unit, integration, system, or acceptance level with sub-types (top-down/bottom-up integration, functional/performance/security system testing, alpha/beta/UAT acceptance).
- **Overlap detection** — Four detection methods (traceability matrix, functional overlap, code path overlap, scenario overlap) with five classification levels (exact duplicate, functional duplicate, partial overlap, redundant coverage, no overlap).
- **Quality validation** — Ten quality criteria per test case with pass/conditional/fail assessment.
- **Design technique application** — Equivalence Partitioning, Boundary Value Analysis, Decision Table Testing, State Transition Testing, Pairwise/Combinatorial Testing, Cause-Effect Graphing, Error Guessing, Code Coverage.
- **Manual vs. automation decision** — ROI-based framework for what to automate, what to keep manual, what to defer.
- **IEEE 829 compliance** — Master Test Plan, Level Test Design, Level Test Case, Level Test Procedure, Level Test Report, Anomaly Reports.
- **Bidirectional traceability** — Requirements ↔ Test Cases ↔ Defects with 100% coverage validation.
- **Test metrics** — Requirements coverage, overlap rate, automation rate, pass rate, defect density.

## Use It

Open any supported AI coding tool in a project where the skill is installed and ask:

> "Review my test cases for overlap and redundancy"

or

> "Validate this test suite against IEEE 829 and fill in the gaps"

or

> "I have 200 test cases. Categorize them and tell me what to automate"

or

> "Generate test cases for this requirements document using boundary value analysis"

The agent recognizes the intent from the skill's `description` and follows the six-stage pipeline.

## Companion Skills

- **waterfall-blueprint** — Generates the SRS and SDD that test cases should trace back to
- **capability-to-gherkin** — Converts capabilities to executable Gherkin scenarios that complement formal test cases
- **software-metrics-quality** — Provides quality metrics that feed test effectiveness analysis

## Eval Scenarios

`evals/evals.json` defines scenarios covering:

1. **Overlap detection** — Tests the agent's ability to identify exact duplicates, functional duplicates, and partial overlaps in a 200-test-case regression suite.
2. **Missing design techniques** — Tests whether the agent identifies happy-path-only testing and generates error/boundary/edge cases using ECP + BVA + error guessing.
3. **Categorization and automation** — Tests correction of mislabeled test levels and ROI-based automation recommendations.

## Credits

Standards and methodologies referenced by this skill:

- [IEEE 829-2008](https://standards.ieee.org/standard/829-2008.html) — Standard for Software and System Test Documentation
- [ISTQB Foundation Syllabus](https://www.istqb.org/) — International Software Testing Qualifications Board
- [BS7925-2](https://www.bsigroup.com/) — Software Component Testing Standard
- Glenford Myers, *The Art of Software Testing* (1979, revised 2011) — Foundational testing text
- Cem Kaner, *Lessons Learned in Software Testing* (2001) — Exploratory testing pioneer
- Lee Copeland, *A Practitioner's Guide to Software Test Design* (2004) — Test design techniques
