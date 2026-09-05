# Test Design Techniques

Reference guide for the black-box and white-box test design techniques used
by the test-case-validation skill. These are the systematic methods that90s-era
QA teams used to ensure test coverage was complete and defensible.

## Black-Box Techniques (Requirements-Based)

These techniques derive test cases from specifications, not code. They are
appropriate for all test levels (unit through acceptance).

### 1. Equivalence Partitioning (ECP)

**What:** Divides input data into classes (partitions) where all values in a
class are "equivalent" — testing one value from each class is sufficient.

**How:**
1. Identify all input parameters.
2. For each parameter, identify valid and invalid partitions.
3. Select one value from each partition as a test case.

**Example — Month input (valid range 1–12):**

| Partition | Range | Test Value |
|-----------|-------|------------|
| Valid | 1–12 | 6 |
| Invalid (low) | ≤0 | -1 |
| Invalid (high) | ≥13 | 13 |

**Example — Age field (0–150):**

| Partition | Range | Test Value |
|-----------|-------|------------|
| Valid | 0–150 | 25 |
| Invalid (low) | <0 | -5 |
| Invalid (high) | >150 | 200 |
| Boundary: minimum | 0 | 0 |
| Boundary: maximum | 150 | 150 |

**Rules:**
- One test per partition minimum.
- Consider output partitions too (not just input).
- Grey-box extension: if internal logic differs for sub-ranges, create
  additional partitions within the valid range.

**Limitation:** Not stand-alone. Must be supplemented by BVA.

### 2. Boundary Value Analysis (BVA)

**What:** Tests values at the edges of equivalence partitions — the most
common location for defects.

**How:**
1. For each boundary, test: just below, just on, just above.
2. Use the minimum increment for the data type (1 for integers, 0.01 for
   2-decimal decimals).

**Example — Month input (1–12):**

| Test | Value | Rationale |
|------|-------|-----------|
| Just below minimum | 0 | Off-by-one |
| Minimum | 1 | Boundary |
| Just above minimum | 2 | Inside |
| Just below maximum | 11 | Inside |
| Maximum | 12 | Boundary |
| Just above maximum | 13 | Off-by-one |

**Formal definition:** Given ordered equivalence classes C1, C2 with vectors
X1 ∈ C1 and X2 ∈ C2, the boundary values are the minimum and maximum values
of the adjacent classes.

**Rules:**
- Always combine with ECP — they are complementary, not alternatives.
- Test both endpoints of every range.
- Test minimum and maximum of every array/collection.
- Test first and last elements of ordered sequences.

### 3. Decision Table Testing

**What:** Creates a table mapping combinations of conditions to actions.
Captures complex business logic that is hard to express in test cases alone.

**How:**
1. List all conditions (rows of the table).
2. List all possible actions (rows of the table).
3. Create a column for every unique combination of condition values.
4. Map each combination to the correct action(s).

**Example — Login rules:**

| | Rule 1 | Rule 2 | Rule 3 | Rule 4 | Rule 5 |
|---|---|---|---|---|---|
| **Conditions** | | | | | |
| Username valid? | Y | Y | Y | N | Y |
| Password valid? | Y | N | Y | Y | N |
| Account locked? | N | N | Y | N | N |
| **Actions** | | | | | |
| Login success | X | | | | |
| Show "invalid password" | | X | | X | X |
| Show "account locked" | | | X | | |
| Show "invalid username" | | | | X | |

**Best for:** Multi-condition business rules, validation logic, access control,
pricing rules, workflow routing.

**Rules:**
- Every column = one test case.
- Every condition must be tested in both true and false states at least once.
- Every action must be triggered by at least one test case.
- Use "don't care" (—) for conditions that don't affect the action.

### 4. State Transition Testing

**What:** Models the system as a finite state machine. Tests every valid
transition and every invalid transition.

**How:**
1. Draw a state diagram (states + transitions).
2. For each valid transition: create a test case that triggers it.
3. For each state: create a test case that verifies the state exists.
4. For each invalid transition: create a test case that attempts it and
   verifies the system rejects it.

**Example — Order lifecycle:**

```
Created → Confirmed → Shipped → Delivered → Returned
   ↓          ↓           ↓          ↓
  Cancelled  Cancelled  (none)    (none)
```

Test cases:
- TC-001: Create order → verify state = Created
- TC-002: Confirm order → verify state = Confirmed
- TC-003: Ship order → verify state = Shipped
- TC-004: Deliver order → verify state = Delivered
- TC-005: Return order → verify state = Returned
- TC-006: Cancel order from Created → verify state = Cancelled
- TC-007: Cancel order from Shipped → verify rejection (invalid transition)
- TC-008: Ship order from Created → verify rejection (must confirm first)

**Best for:** Workflow systems, order processing, state machines, protocols,
UI navigation with distinct states.

### 5. Pairwise/Combinatorial Testing

**What:** Tests all pairwise combinations of input parameters instead of the
full combinatorial explosion. Most bugs are triggered by interactions of 2
parameters, not all simultaneously.

**How:**
1. List all parameters and their possible values.
2. Use an all-pairs algorithm or orthogonal array to generate the minimal
   test set that covers every pair of values for every pair of parameters.

**Example — Login form:**

| Parameter | Values |
|-----------|--------|
| Browser | Chrome, Firefox, Safari |
| OS | Windows, macOS |
| Language | English, Spanish, French |

Full combinatorial: 3 × 2 × 3 = 18 tests
Pairwise: ~9 tests (every pair of values covered)

**Rules:**
- Use when full combinatorial is too large (>20 tests).
- Pairwise catches ~70-80% of interaction bugs (excellent ROI).
- For safety-critical systems, consider 3-way or 4-way combinatorial.

### 6. Cause-Effect Graphing

**What:** Maps input conditions (causes) to output behaviors (effects)
using logical expressions. More structured than decision tables for
complex input combinations.

**How:**
1. List all causes (input conditions).
2. List all effects (output behaviors).
3. Create a Boolean logic graph connecting causes to effects.
4. Convert the graph to a decision table.
5. Derive test cases from the decision table.

**Best for:** Complex combinations where decision tables become unwieldy.
The graph makes the logical relationships explicit.

## White-Box Techniques (Code-Based)

These techniques derive test cases from code structure. They are primarily
appropriate for unit testing.

### 7. Statement Coverage

**What:** Ensure every line of code is executed at least once.

**Measurement:** (Lines executed / Total lines) × 100

**Target:** ≥80% for most systems, ≥100% for safety-critical.

**Limitation:** Does not ensure all branches are tested.

### 8. Branch Coverage (Decision Coverage)

**What:** Ensure every decision branch (true and false) is taken at least once.

**Measurement:** (Branches executed / Total branches) × 100

**Target:** ≥70% for most systems, ≥100% for safety-critical.

**Stronger than statement coverage** — a line may execute without its
decision being fully tested.

### 9. Path Coverage

**What:** Ensure every possible execution path through the code is exercised.

**Measurement:** (Paths executed / Total paths) × 100

**Target:** Often impractical for complex code (exponential paths). Partial
path coverage or basis path coverage is used instead.

**Strongest criterion** — path coverage implies branch coverage implies
statement coverage.

### 10. Modified Condition/Decision Coverage (MC/DC)

**What:** Each condition independently affects the decision outcome.
Required for safety-critical systems (DO-178B/C for avionics).

**Measurement:** For each condition, demonstrate that changing only that
condition changes the decision result.

**Example:** Decision: `if (A and B or C)`
- A=T, B=T, C=F → Decision=T
- A=F, B=T, C=F → Decision=F (A independently affects decision)
- A=T, B=T, C=F → Decision=T
- A=T, B=T, C=T → Decision=T (C independently affects decision)

## Technique Selection Guide

| Situation | Primary Technique(s) | Supplementary |
|-----------|---------------------|---------------|
| Input range or set of valid values | ECP | BVA |
| Boundary conditions | BVA | ECP |
| Complex business rules (3+ conditions) | Decision Table | ECP per condition |
| Stateful system | State Transition | ECP for state data |
| Many parameters with interactions | Pairwise/Combinatorial | ECP per parameter |
| Complex input logic | Cause-Effect Graphing | Decision Table |
| Known error-prone areas | Error Guessing | All of the above |
| Need to verify code execution | Statement/Branch/Path | Black-box first |
| Safety-critical system | MC/DC | Path + Branch + Statement |

## Rules for Technique Application

1. **Never use only one technique.** Combine ECP + BVA as a minimum for any
   input-based testing.
2. **ECP creates partitions; BVA tests boundaries.** They are complementary,
   not alternatives.
3. **Error guessing supplements formal techniques.** It does not replace them.
4. **Pairwise is for parameter interactions.** If parameters are independent,
   use ECP per parameter.
5. **State transition is for stateful systems only.** Stateless APIs don't need it.
6. **Coverage criteria are for white-box (unit) testing.** Black-box (system)
   testing uses requirement-based coverage.
7. **Each technique should produce test cases with complete preconditions,
   steps, and expected results.** Technique selection is only useful if the
   resulting test case is executable.
