# Overlap Detection Reference

Detailed methods for detecting redundant, duplicate, and overlapping test cases.

## Why Overlap Matters

- **Execution waste:** Running 5 identical tests takes 5× the time of running 1.
- **False confidence:** "We have 500 tests" means nothing if 200 test the same thing.
- **Maintenance burden:** Every test needs updating when the system changes.
- **Signal dilution:** Redundant failures obscure real issues.
- **Resource waste:** Testers spending time on duplicates instead of exploring new areas.

## Detection Methods

### Method 1: Traceability Matrix Analysis

**How:**
1. Build a matrix: rows = requirements, columns = test cases.
2. Fill in which test cases trace to which requirements.
3. Analyze the matrix:

| Pattern | Finding | Action |
|---------|---------|--------|
| Requirement has 0 test cases | Coverage gap | ADD test cases |
| Requirement has 1 test case | Minimum coverage | REVIEW if sufficient |
| Requirement has 2-3 test cases | Normal | VERIFY different scenarios |
| Requirement has 5+ test cases | Potential redundancy | INVESTIGATE overlap |
| Test case traces to 0 requirements | Orphaned test | JUSTIFY or REMOVE |
| Test case traces to 1 requirement | Normal | VERIFY necessity |
| Test case traces to 3+ requirements | Cross-cutting | VERIFY not over-coupled |

**Thresholds:**
- >5 tests per requirement = investigate redundancy (unless requirement is
  complex with many scenarios).
- 0 tests per requirement = BLOCK.
- Tests tracing to 0 requirements = BLOCK (unjustified).

### Method 2: Functional Overlap Detection

Compare pairs of test cases that trace to the same requirement.

**Decision tree for each pair:**

```
Same requirement?
├── YES
│   ├── Same inputs?
│   │   ├── YES
│   │   │   ├── Same expected results?
│   │   │   │   ├── YES → EXACT DUPLICATE (remove one)
│   │   │   │   └── NO → CONFLICT (resolve contradiction)
│   │   │   └── Different expected results → VERIFY (may be valid if testing different aspects)
│   │   └── Different inputs?
│   │       ├── Same input partition → FUNCTIONAL DUPLICATE (consolidate)
│   │       └── Different input partition → VALID (keep both)
│   └── Different requirements?
│       └── CROSS-REQUIREMENT (verify not testing same thing)
└── NO
    ├── Same module/function?
    │   ├── Same code path → DUPLICATE (remove one)
    │   └── Different code path → VALID (keep both)
    └── Different module/function → NO OVERLAP (keep both)
```

### Method 3: Code Path Overlap (Automated/Unit Tests)

**How:**
1. Run both tests with code coverage enabled.
2. Compare the coverage reports.

| Coverage Comparison | Finding | Action |
|--------------------|---------|--------|
| Identical statement + branch coverage | Exact duplicate | Remove one |
| One test is a subset of the other | Redundant (the larger test covers everything) | Remove the smaller |
| Partial overlap, each has unique coverage | Partial overlap | Keep both, document unique coverage |
| No overlap in coverage | Independent | Keep both |

### Method 4: Scenario Overlap (System Tests)

**How:**
1. Identify the business workflow each test executes.
2. Compare workflows step by step.

| Comparison | Finding | Action |
|-----------|---------|--------|
| Same workflow, same data, same results | Duplicate | Remove one |
| Same workflow, different data, same results | Data variation | VALID if data partitions differ |
| Same workflow, different data, different results | Different scenario | KEEP both |
| Same workflow, same data, different results | Conflict | RESOLVE (one expected result is wrong) |
| Different workflows | Independent | KEEP both |

## Overlap Classifications

### Exact Duplicate
**Definition:** Two test cases with identical steps, identical expected results,
and identical requirement traceability.

**Action:** Remove one. Keep the one with better documentation, more complete
steps, or higher priority.

**Example:**
```
TC-001: Login with valid credentials
  Steps: 1. Navigate to login page  2. Enter valid username  3. Enter valid password  4. Click login
  Expected: Dashboard displayed
  Traces to: FR-001

TC-045: Successful login
  Steps: 1. Go to login  2. Type valid username  3. Type valid password  4. Press login button
  Expected: User sees dashboard
  Traces to: FR-001
→ REMOVE TC-045 (exact duplicate)
```

### Functional Duplicate
**Definition:** Two test cases trace to the same requirement and test the same
input range, but use different steps or wording. The functional intent is identical.

**Action:** Consolidate into one test case. Merge the best aspects of both
(complete steps from one, clear expected results from the other).

**Example:**
```
TC-002: Login with invalid password
  Steps: 1. Enter valid username  2. Enter wrong password  3. Click login
  Expected: Error message "Invalid credentials"
  Traces to: FR-002

TC-046: Failed login - wrong password
  Steps: 1. Navigate to login  2. Enter username  3. Enter incorrect password  4. Submit
  Expected: Error message displayed
  Traces to: FR-002
→ CONSOLIDATE: Merge into TC-002 with the more specific expected result
```

### Partial Overlap
**Definition:** Two test cases share some steps or test some of the same
behavior, but diverge at a branch point. Each tests something the other doesn't.

**Action:** Keep both. Document what makes each unique.

**Example:**
```
TC-003: Login with locked account
  Steps: 1. Enter valid username of locked account  2. Enter valid password  3. Click login
  Expected: Error "Account locked. Contact admin."
  Traces to: FR-003

TC-047: Login with expired password
  Steps: 1. Enter valid username  2. Enter expired password  3. Click login
  Expected: Error "Password expired. Please reset."
  Traces to: FR-003
→ KEEP BOTH: Different error conditions (locked vs. expired)
```

### Redundant Coverage
**Definition:** A requirement has 5+ test cases, and many verify the same
behavior with only minor variations that don't add meaningful coverage.

**Action:** Consolidate to 2-3 essential tests: happy path, most important
error case, and the most important edge case. Remove the rest.

**When 5+ tests is valid:**
- Requirement has 5+ distinct business scenarios
- Tests cover different user roles
- Tests cover different data partitions
- Tests cover different integration points

### No Overlap
**Definition:** Test cases verify different requirements or different code
paths. No redundancy detected.

**Action:** Keep all. No action needed.

## Overlap Report Template

```
OVERLAP ANALYSIS REPORT
=======================
Total test cases analyzed: [N]
Pairs analyzed: [N×(N-1)/2]

EXACT DUPLICATES: [X]
──────────────────
TC-[NNN] ↔ TC-[MMM]
  Requirement: [REQ-ID]
  Finding: [Same steps, same results]
  Recommendation: REMOVE TC-[MMM]

FUNCTIONAL DUPLICATES: [Y]
───────────────────────────
TC-[NNN] ↔ TC-[MMM]
  Requirement: [REQ-ID]
  Finding: [Same requirement, same input range, different wording]
  Recommendation: CONSOLIDATE into TC-[NNN]

PARTIAL OVERLAPS: [Z]
─────────────────────
TC-[NNN] ↔ TC-[MMM]
  Requirement: [REQ-ID]
  Finding: [Shared steps diverge at step N]
  Recommendation: KEEP BOTH — [what each tests that the other doesn't]

REDUNDANT COVERAGE: [W]
───────────────────────
Requirement [REQ-ID] has [N] test cases.
  Tests: TC-[list]
  Finding: [Many verify same behavior]
  Recommendation: Consolidate to [2-3] essential tests

COVERAGE GAPS: [V]
──────────────────
Requirement [REQ-ID] has 0 test cases.
  Recommendation: ADD test cases

UNJUSTIFIED TESTS: [U]
──────────────────────
TC-[NNN] traces to no requirement.
  Finding: [No requirement justification]
  Recommendation: JUSTIFY or REMOVE

SUMMARY
───────
Exact duplicates to remove: [X]
Functional duplicates to consolidate: [Y]
Redundant coverage to trim: [W]
Coverage gaps to fill: [V]
Unjustified tests to review: [U]
Net test cases after cleanup: [N - X - Y - W - V + U]
```

## Overlap Rate Calculation

```
Overlap Rate = (Exact Duplicates + Functional Duplicates) / Total Test Cases × 100

< 10%  → PASS (healthy test suite)
10-30% → WARN (moderate redundancy, consolidate)
> 30%  → BLOCK (massive redundancy, overhaul needed)
```
