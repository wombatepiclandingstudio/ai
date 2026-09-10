---
name: clean-code-review
description: >
  Review code for Clean Code compliance: meaningful naming, small single-purpose
  functions, proper abstraction levels, SOLID principles, TDD patterns, and error
  handling. Paste code and get a structured review with specific violations identified,
  severity ratings, and before/after refactoring examples. Includes immutability
  principles, test coverage strategy, and the boy scout rule.
---

**Scope:** Enforces Robert C. Martin's Clean Code principles — code that is easy to understand, maintain, and modify. Clean code reads like well-written prose, tells a story, and expresses intent clearly without requiring comments.

---

## Zero — Core Concepts

> "The ratio of time spent reading vs. writing is well over 10 to 1. We are constantly reading old code as part of the effort to write new code. Making it easy to read makes it easier to write." — Robert C. Martin

**Pillars of Clean Code:**

| Pillar | Description |
|--------|-------------|
| **Meaningful Names** | Names reveal intent; avoid abbreviations, encoding, mental mapping |
| **Small Functions** | Rarely exceed 20 lines, do one thing, one level of abstraction |
| **Self-Documenting Code** | Code reads like prose; comments explain WHY, not WHAT |
| **SOLID Principles** | Five principles ensuring maintainable, flexible design |
| **TDD** | RED → GREEN → REFACTOR cycle; tests are mandatory |
| **Immutability** | Prefer `const`/`final`/`readonly`; pure functions by default |
| **Boy Scout Rule** | Leave the code cleaner than you found it |

**SOLID Summary:**

| Principle | Rule |
|-----------|------|
| **S — Single Responsibility** | One class = one reason to change |
| **O — Open/Closed** | Open for extension, closed for modification |
| **L — Liskov Substitution** | Subtypes substitutable without altering correctness |
| **I — Interface Segregation** | Clients depend only on interfaces they use |
| **D — Dependency Inversion** | Depend on abstractions, not concretions |

---

## One — When to Use

- Reviewing code for quality and maintainability
- Mentoring developers on clean coding practices
- Enforcing naming conventions and code structure
- Checking function size, class cohesion, and SOLID compliance
- Establishing or auditing team coding standards
- The user mentions "clean code," "code quality," "SOLID," "naming," or "code review"
- Preparing code for production or code review

**Do NOT use when:**

- Writing code from scratch with no existing code to review
- The user wants performance optimization only (clean code is about readability, not speed)
- The request is purely architectural (use architecture skills instead)
- The user wants to add features without reviewing existing code quality

---

## Two — Hard Prohibitions

> **HR-1.** Do NOT return `null` — return empty collections, arrays, or special values instead.

> **HR-2.** Do NOT pass `null` as an argument — avoid passing null wherever possible.

> **HR-3.** Do NOT use flag parameters — don't use boolean flags to control behavior.

> **HR-4.** Do NOT write comments that explain bad code — rewrite the code instead.

> **HR-5.** Do NOT allow functions to exceed 20 lines without justification.

> **HR-6.** Do NOT use single-letter variables except loop counters.

> **HR-7.** Do NOT use Hungarian notation (`strName`, `iCount`) or abbreviations (`mgr`, `cstm`).

> **HR-8.** Do NOT mix abstraction levels within a function — higher-level calls lower-level.

> **HR-9.** Do NOT have side effects AND return values from the same function — choose one.

> **HR-10.** Do NOT use exceptions for normal flow control — exceptions are for exceptional cases.

> **HR-11.** Do NOT allow duplicate code — extract and DRY it.

> **HR-12.** Do NOT refactor without a test suite in place.

---

## Three — Decision Tree: What to Review

```
Reviewing code quality?
├── Is this new code from scratch?
│   └── YES → Cannot review; suggest clean-code principles for writing
├── Does it have names to review?
│   ├── Single letters, abbreviations, misleading names?
│   │   └── FIX → Meaningful Names section (Section One rules)
│   └── Names look good → Continue
├── Are functions small and focused?
│   ├── Exceeds 20 lines or does multiple things?
│   │   └── FIX → Extract Method; apply SRP
│   └── Functions are clean → Continue
├── Is there duplication?
│   ├── Same logic in 2+ places?
│   │   └── FIX → Extract into shared function; DRY
│   └── No duplication → Continue
├── Is error handling correct?
│   ├── Returns null, swallows exceptions, uses return codes?
│   │   └── FIX → Use exceptions, no null returns, propagate properly
│   └── Error handling is clean → Continue
├── Are SOLID principles followed?
│   ├── Class has multiple responsibilities?
│   │   └── FIX → Extract Class; split by responsibility
│   ├── Clients depend on interfaces they don't use?
│   │   └── FIX → Interface Segregation
│   └── All SOLID principles OK → Continue
├── Are tests present and FIRST-compliant?
│   ├── No tests or tests violate FIRST?
│   │   └── FIX → Write tests; follow TDD cycle
│   └── Tests are good → Continue
└── Is immutability applied?
    ├── Mutable state without justification?
    │   └── FIX → Use const/final/readonly; pure functions
    └── All clear → Code is clean
```

---

## Four — Review Process

### Step 1: Scan for Code Smells

Run automated detection first, then manual review.

| Smell | Detection | Primary Fix |
|-------|-----------|-------------|
| **Long Method** | Functions > 20 lines | Extract Method |
| **Large Class** | Classes > 300 lines | Extract Class (SRP) |
| **Duplicate Code** | Same block in 2+ places | Extract Method / Pull Up |
| **Long Parameter List** | Methods > 3 parameters | Introduce Parameter Object |
| **Feature Envy** | Method uses another class's data more | Move Method |
| **Data Clumps** | Fields always appear together | Extract Class |
| **Switch Statements** | Long chains of switch/if-else | Replace Conditional with Polymorphism |
| **Dead Code** | Unreachable or unused code | Remove |

### Step 2: Check Naming

| Rule | Bad | Good |
|------|-----|------|
| Reveal intent | `d` | `elapsedTimeInDays` |
| Avoid disinformation | `hp`, `aix` for accounts | `accountPayable` |
| Meaningful distinctions | `a1`, `a2`, `a3` | `source`, `destination`, `purpose` |
| Pronounceable names | `hmwk` | `homework` |
| Searchable names | `86400000` | `MILLISECONDS_PER_DAY` |
| No mental mapping | `l => ...` | `location => ...` |
| Avoid encoding | `strName`, `iCount` | `name`, `count` |
| Classes are nouns | — | `Customer`, `Invoice` |
| Methods are verbs | — | `postPayment`, `calculateInvoice` |
| Booleans as questions | — | `isValid`, `hasPermission` |

### Step 3: Check Function Rules

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

**Command Query Separation:** Functions should either do something or answer something, not both.
- Bad: `public void setSanitized(String sanitized)` — sets AND returns boolean
- Good: `public void sanitize(String value)` / `public boolean isSanitized()`

### Step 4: Check Comments

**When NOT to Comment:**
- Redundant comments — `// increment counter` before `counter++`
- Misleading comments — comments that contradict code
- Mandatory comments — added just to follow a policy
- API docs on internal code — good naming is better

**When to Comment:**

| Type | Example |
|------|---------|
| **Legal** | Copyright and authorship notices |
| **Informative** | Why something is done this way |
| **Warning** | Consequences of code behavior |
| **TODO** | Things that need to be done (review periodically) |
| **Amplification** | `// Must be called before calcTax()` |

### Step 5: Check Formatting

> "The purpose of formatting is to reveal the logical structure of the code."

| Rule | Target |
|------|--------|
| **File length** | 300-500 lines ideally |
| **Line length** | < 120 characters |
| **Indentation** | 2 spaces (consistent) |
| **Blank lines** | Between functions, separating sections |
| **Whitespace** | Around operators and keywords |
| **Conformity** | Team follows consistent style guide |

### Step 6: Check Objects and Data Structures

> "Objects hide their data behind abstractions and expose functions. Data structures expose their data and have no significant functions."

**Law of Demeter:** Methods should only call methods on:
1. Itself
2. Objects passed as parameters
3. Objects created within the method
4. The object's direct component fields

Bad: `ctxt.getScratchDir().absolutePath()`

### Step 7: Check TDD Compliance

**The Three Laws of TDD:**
1. You may not write production code until you have written a failing unit test
2. You may not write more of a unit test than is sufficient to fail
3. You may not write more production code than is sufficient to pass the currently failing test

**The TDD Cycle:** `RED → GREEN → REFACTOR`

**FIRST Principles:**

| Principle | Description |
|-----------|-------------|
| **Fast** | Tests run quickly (milliseconds) |
| **Independent** | Tests don't depend on each other |
| **Repeatable** | Tests repeat in any environment |
| **Self-Validating** | Boolean result: pass or fail |
| **Timely** | Written at the right time (before production code) |

**Test Pattern:** Arrange → Act → Assert

### Step 8: Check Immutability

> "If you don't need to change it, make it immutable."

- Use `const` / `final` / `readonly` by default; only use mutable when mutation is the point
- Prefer pure functions (no side effects, same input → same output)
- Use immutable data structures (tuples, records, frozen objects) for shared state
- Avoid reassigning parameters; use local variables instead
- When mutation is necessary, make it explicit and contained in a single method

**Benefits:** Easier to reason about, thread-safe by default, easier to test, prevents accidental mutation and race conditions.

---

## Five — Error Handling

| Violation | Fix |
|-----------|-----|
| Returns `null` | Return empty collections, arrays, or special values |
| Passes `null` | Avoid passing null as an argument |
| Uses return codes | Use exceptions instead |
| Swallows exceptions | Catch at the right level; don't swallow silently |
| Exception in normal flow | Exceptions are for exceptional cases only |
| No try-catch-finally | Write try-catch-finally first — define what happens before how it fails |

---

## Six — Key Rules

| ID | Rule |
|----|------|
| **HR-1** | Never return null; return empty collections or special values |
| **HR-2** | Never pass null as an argument |
| **HR-3** | Never use flag parameters |
| **HR-4** | Never comment bad code — rewrite it |
| **HR-5** | Functions rarely exceed 20 lines |
| **HR-6** | No single-letter variables except loop counters |
| **HR-7** | No Hungarian notation or abbreviations |
| **HR-8** | One level of abstraction per function |
| **HR-9** | No side effects AND return values from same function |
| **HR-10** | Exceptions for exceptional cases only |
| **HR-11** | No duplicate code |
| **HR-12** | Never refactor without a test suite |
| **SRP** | One class = one reason to change |
| **OCP** | Open for extension, closed for modification |
| **LSP** | Subtypes substitutable for base types |
| **ISP** | Clients depend only on interfaces they use |
| **DIP** | Depend on abstractions, not concretions |
| **TDD** | RED → GREEN → REFACTOR; tests mandatory |
| **FIRST** | Fast, Independent, Repeatable, Self-Validating, Timely |
| **Immutable** | Use const/final/readonly by default |
| **Boy Scout** | Leave code cleaner than you found it |

---

## Seven — Evidence & Checklist

**Pre-Delivery Checklist:**

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

**Gate Implications:**

| Gate | Condition |
|------|-----------|
| **BLOCK** | Functions exceed 20 lines without justification |
| **BLOCK** | Names don't reveal intent (single letters, abbreviations, misleading) |
| **BLOCK** | Duplicate code exists without abstraction |
| **BLOCK** | Classes have multiple responsibilities |
| **BLOCK** | SOLID principles are violated |
| **BLOCK** | Tests don't follow FIRST principles |
| **BLOCK** | Null is returned or passed where avoidable |
| **BLOCK** | Comments explain bad code instead of fixing it |
| **WARN** | Some functions are slightly long but well-named and focused |
| **WARN** | Comments are redundant but not harmful |
| **WARN** | Formatting is slightly inconsistent but functionally correct |
| **WARN** | Test coverage could be higher but core paths are covered |

**Evidence Required:**

- Code smell identification (naming, function size, duplication, etc.)
- SOLID principle compliance check
- TDD/FIRST compliance check
- Specific refactoring recommendations
- Before/after examples for key improvements

---

## Reference Guides

| Topic | See |
|-------|-----|
| Fowler's refactoring techniques | `refactoring-catalog` skill |
| Breaking dependencies for testability | `legacy-code-workshop` skill |
| DRY and orthogonality principles | `pragmatic-development` skill |
| Metrics to quantify violations | `software-metrics-quality` skill |
| Detailed test cases and examples | `references/condensed.md` |
