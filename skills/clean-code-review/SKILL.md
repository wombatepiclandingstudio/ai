---
name: clean-code-review
description: >
  Review and enforce Robert C. Martin's (Uncle Bob) Clean Code principles: meaningful names,
  small single-purpose functions, one level of abstraction, proper error handling, SOLID
  principles, TDD, and the boy scout rule. Use when reviewing code for quality, mentoring
  developers on clean practices, enforcing naming conventions, checking function size,
  validating SOLID compliance, or establishing team coding standards.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [clean-code, solid, tdd, naming, code-review, quality, uncle-bob, boy-scout]
---

# Clean Code Review Skill

Enforces Robert C. Martin's Clean Code principles — code that is easy to understand,
maintain, and modify. Clean code reads like well-written prose, tells a story, and
expresses intent clearly without requiring comments.

## Use when

- Reviewing code for quality and maintainability
- Mentoring developers on clean coding practices
- Enforcing naming conventions and code structure
- Checking function size, class cohesion, and SOLID compliance
- Establishing or auditing team coding standards
- The user mentions "clean code," "code quality," "SOLID," "naming," or "code review"
- Preparing code for production or code review

## Do not use when

- Writing code from scratch with no existing code to review
- The user wants performance optimization only (clean code is about readability, not speed)
- The request is purely architectural (use architecture skills instead)
- The user wants to add features without reviewing existing code quality

---

## Core Philosophy

> "The ratio of time spent reading vs. writing is well over 10 to 1. We are constantly
> reading old code as part of the effort to write new code. Making it easy to read makes
> it easier to write." — Robert C. Martin

---

## 1. Meaningful Names

Names should reveal intent. A name should tell you why it exists, what it does, and how
it's used.

### Rules

| Rule | Bad | Good |
|------|-----|------|
| Reveal intent | `d` | `elapsedTimeInDays` |
| Avoid disinformation | `hp`, `aix` for accounts | `accountPayable` |
| Make meaningful distinctions | `a1`, `a2`, `a3` | `source`, `destination`, `purpose` |
| Use pronounceable names | `hmwk` | `homework` |
| Use searchable names | `86400000` | `MILLISECONDS_PER_DAY` |
| No mental mapping | `l => ...` | `location => ...` |
| Avoid encoding | `strName`, `iCount` | `name`, `count` |
| Classes are nouns | — | `Customer`, `Invoice` |
| Methods are verbs | — | `postPayment`, `calculateInvoice` |
| Booleans read as questions | — | `isValid`, `hasPermission` |

### Anti-Patterns

- Single letter variables: `a`, `b`, `i` (except loop counters)
- Abbreviations: `mgr`, `cstm`, `req`
- Misleading names: `list`, `temp`, `data`
- Hungarian notation: `strName`, `iCount`
- Gratuitous context: `car.carMake` → `car.make`

---

## 2. Functions

Functions should be small, do one thing, and operate at a single level of abstraction.

### Rules

| Rule | Description |
|------|-------------|
| **Small** | Rarely exceed 20 lines |
| **Do one thing** | One reason to change |
| **One level of abstraction** | Higher-level calls lower-level, never mixed |
| **Few arguments** | Zero preferred, one or two OK, three or more is bad |
| **No flag parameters** | Don't use boolean flags to control behavior |
| **Start with verb** | `getAccount()`, `saveAccount()`, `deleteAccount()` |
| **No side effects** | Either return something OR have side effects, not both |
| **DRY** | No duplicate code |

### Command Query Separation

Functions should either do something or answer something, not both.

- Bad: `public void setSanitized(String sanitized)` — sets AND returns boolean
- Good: `public void sanitize(String value)` / `public boolean isSanitized()`

---

## 3. Comments

> "Don't comment bad code — rewrite it." — Brian W. Kernighan

### When NOT to Comment

- **Redundant comments** — `// increment counter` before `counter++`
- **Misleading comments** — comments that contradict code
- **Mandatory comments** — comments added just to follow a policy
- **API docs on internal code** — good naming is better

### When to Comment

| Type | Example |
|------|---------|
| **Legal** | Copyright and authorship notices |
| **Informative** | Why something is done this way |
| **Warning** | Consequences of code behavior |
| **TODO** | Things that need to be done (review periodically) |
| **Amplification** | `// Must be called before calcTax()` |

---

## 4. Error Handling

### Rules

| Rule | Description |
|------|-------------|
| **Use exceptions** | Not return codes |
| **Write try-catch-finally first** | Define what happens before how it fails |
| **Don't return null** | Return empty collections, arrays, or special values |
| **Don't pass null** | Avoid passing null as an argument |
| **Propagate properly** | Catch at the right level; don't swallow silently |
| **Exceptions are for exceptional cases** | Not for normal flow control |

---

## 5. Formatting

> "The purpose of formatting is to reveal the logical structure of the code."

### Rules

| Rule | Target |
|------|--------|
| **File length** | 300-500 lines ideally |
| **Line length** | < 120 characters |
| **Indentation** | 2 spaces (consistent) |
| **Blank lines** | Between functions, separating sections |
| **Whitespace** | Around operators and keywords |
| **Conformity** | Team follows consistent style guide |

---

## 6. Objects and Data Structures

> "Objects hide their data behind abstractions and expose functions. Data structures
> expose their data and have no significant functions."

### Law of Demeter

Objects should only talk to their immediate friends. Methods should only call methods on:

1. Itself
2. Objects passed as parameters
3. Objects created within the method
4. The object's direct component fields

Bad: `ctxt.getScratchDir().absolutePath()`

---

## 7. Unit Tests (TDD)

### The Three Laws of TDD

1. You may not write production code until you have written a failing unit test
2. You may not write more of a unit test than is sufficient to fail
3. You may not write more production code than is sufficient to pass the currently failing test

### The TDD Cycle

```
RED → GREEN → REFACTOR
Write Failing Test → Make Test Pass → Refactor
```

### FIRST Principles

| Principle | Description |
|-----------|-------------|
| **Fast** | Tests run quickly (milliseconds) |
| **Independent** | Tests don't depend on each other |
| **Repeatable** | Tests repeat in any environment |
| **Self-Validating** | Boolean result: pass or fail |
| **Timely** | Written at the right time (before production code) |

### Test Pattern: Arrange → Act → Assert

```java
// Arrange: Set up the test
// Act: Execute the behavior
// Assert: Verify the outcome
```

---

## 8. SOLID Principles

### S — Single Responsibility Principle

"A class should have only one reason to change."

- One class = one responsibility
- Easier to test, understand, and modify

### O — Open/Closed Principle

"Software entities should be open for extension, but closed for modification."

- Add functionality without changing existing code
- Use interfaces and abstractions

### L — Liskov Substitution Principle

"Subtypes must be substitutable for their base types without altering correctness."

- Subclasses must honor the "is-a" relationship
- Must not break the program when substituted

### I — Interface Segregation Principle

"Clients should not be forced to depend on interfaces they do not use."

- Keep interfaces small and focused
- Create role interfaces, not fat interfaces

### D — Dependency Inversion Principle

"High-level modules should not depend on low-level modules. Both should depend on abstractions."

- Depend on abstractions, not concretions
- Makes code flexible and testable

---

## 9. The Boy Scout Rule

> "Leave the code cleaner than you found it."

### Practice

- When you touch code, make it better
- Small, incremental improvements compound over time
- Rename confusing variables
- Extract confusing sections into well-named functions
- Remove dead code
- Add missing tests
- Simplify complex conditions

---

## 10. Immutability

> "If you don't need to change it, make it immutable."

### Rules

- Use `const` / `final` / `readonly` by default; only use mutable when mutation is the point
- Prefer pure functions (no side effects, same input → same output)
- Use immutable data structures (tuples, records, frozen objects) for shared state
- Avoid reassigning parameters; use local variables instead
- When mutation is necessary, make it explicit and contained in a single method

### Benefits

- Easier to reason about (no hidden state changes)
- Thread-safe by default
- Easier to test (no setup/teardown for shared state)
- Prevents a class of bugs (accidental mutation, race conditions)

---

## Test Coverage Strategy

### What to test

| Priority | What | Why |
|----------|------|-----|
| 1 | Business logic / domain rules | Highest value, most fragile |
| 2 | Edge cases and error paths | Where bugs hide |
| 3 | Integration points | Where systems break |
| 4 | UI components (critical paths) | User-facing behavior |
| 5 | Utility functions | Low risk, easy to test |

### Coverage targets

- **New code:** 80%+ coverage (measured by line/branch)
- **Existing code:** Don't lower the bar; improve incrementally
- **Critical paths:** 100% (payment, auth, data integrity)
- **Legacy code:** Characterization tests first, then improve

### FIRST principles reminder

- **Fast** — Tests run in milliseconds
- **Independent** — Tests don't depend on each other
- **Repeatable** — Same result every time
- **Self-Validating** — Boolean pass/fail
- **Timely** — Written at the right time (before or alongside production code)

---

## Pre-Delivery Checklist

Before declaring code clean:

- [ ] Names reveal intent and are searchable
- [ ] Functions are small (< 20 lines), do one thing, have few arguments
- [ ] One level of abstraction per function
- [ ] No duplicate code (DRY)
- [ ] Comments explain why, not what (or code is self-documenting)
- [ ] Error handling uses exceptions, not return codes
- [ ] No null returns or null arguments
- [ ] Formatting is consistent with team style guide
- [ ] Classes follow SRP (one reason to change)
- [ ] SOLID principles are followed
- [ ] Tests follow FIRST principles
- [ ] TDD cycle was followed (RED → GREEN → REFACTOR)
- [ ] Code is cleaner than when you found it (boy scout rule)

---

## Gate Implications

Gate must **BLOCK** when:

- Functions exceed 20 lines without justification
- Names don't reveal intent (single letters, abbreviations, misleading)
- Duplicate code exists without abstraction
- Classes have multiple responsibilities
- SOLID principles are violated
- Tests don't follow FIRST principles
- Null is returned or passed where avoidable
- Comments explain bad code instead of fixing it

Gate may **WARN** when:

- Some functions are slightly long but well-named and focused
- Comments are redundant but not harmful
- Formatting is slightly inconsistent but functionally correct
- Test coverage could be higher but core paths are covered

---

## Evidence Required

A review using this skill should produce:

- Code smell identification (naming, function size, duplication, etc.)
- SOLID principle compliance check
- TDD/FIRST compliance check
- Specific refactoring recommendations
- Before/after examples for key improvements

---

## Related Skills

These skills work together with clean code review. Use the `software-engineering-analyst` agent
to orchestrate them as an integrated system.

| Skill | Connection |
|-------|------------|
| `refactoring-catalog` | Fowler's catalog provides the techniques to fix Clean Code violations |
| `legacy-code-workshop` | Legacy Code techniques enable fixing violations by breaking dependencies |
| `pragmatic-development` | DRY and orthogonality are both Clean Code and Pragmatic principles |
| `software-metrics-quality` | Metrics quantify Clean Code violations (SOLID → CBO/LCOM, naming → MI) |

**Orchestrated by:** `software-engineering-analyst` agent


