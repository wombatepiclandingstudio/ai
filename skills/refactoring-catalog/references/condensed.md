# Refactoring Catalog — Condensed Reference

## Quick Routing

| Trigger | Action |
|---------|--------|
| "refactor," "clean up," "code smells" | Use this skill |
| Before/after adding a feature | Use this skill |
| During code review | Use this skill |
| Writing new code from scratch | Do NOT use (nothing to refactor) |
| No tests and won't write characterization tests | Do NOT use |
| Rewriting entire system | Not refactoring |
| Performance optimization | Refactoring preserves behavior only |

## Hard Rules

| # | Rule |
|---|------|
| HR-1 | Never refactor without tests |
| HR-2 | Behavior-preserving only |
| HR-3 | Small, incremental steps |
| HR-4 | Fix or revert if tests fail |
| HR-5 | Don't introduce new smells |
| HR-6 | Identify smell first (catalog lookup) |
| HR-7 | Automated detection before manual review |
| HR-8 | Characterization tests before refactoring untested code |

## Core Principle

**Refactoring Mechanics:**
1. Ensure tests exist
2. Make a small change
3. Run tests
4. Repeat
5. Clean up

**Rule of Three:** Refactor on the third duplication.

## Smell → Refactoring Lookup

| Smell | Refactoring |
|-------|-------------|
| Long Method | Extract Method |
| Large Class | Extract Class |
| Duplicate Code | Extract Method / Pull Up Method |
| Feature Envy | Move Method |
| Switch Statements | Replace Conditional with Polymorphism |
| Data Clumps | Extract Class |
| Long Parameter List | Introduce Parameter Object |
| Primitive Obsession | Replace Data Value with Object |
| Temporary Field | Extract Class |
| Message Chains | Hide Delegate |
| Middle Man | Remove Middle Man |
| Divergent Change | Extract Class |
| Shotgun Surgery | Move Method / Move Field |
| Parallel Inheritance | Move Method |
| Refused Bequest | Replace Inheritance with Delegation |
| Dead Code | Remove |
| Comments (bad code) | Fix the code |
| Speculative Generality | Inline Class / Remove |

## Catalog Categories

### Composing Methods
Extract Method, Inline Method, Extract Variable, Inline Temp, Replace Temp with Query, Split Temporary Variable, Remove Assignments to Parameters, Replace Method with Method Object, Substitute Algorithm

### Moving Features
Move Method, Move Field, Extract Class, Inline Class, Hide Delegate, Remove Middle Man, Introduce Foreign Method, Introduce Local Extension

### Organizing Data
Self Encapsulate Field, Replace Data Value with Object, Change Value to Reference, Change Reference to Value, Replace Array with Object, Replace Magic Number with Symbolic Constant, Encapsulate Field, Encapsulate Collection, Replace Type Code with Class/Subclasses/State/Strategy, Replace Subclass with Fields

### Simplifying Conditionals
Decompose Conditional, Consolidate Conditional Expression, Consolidate Duplicate Conditional Fragments, Remove Control Flag, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Null Object, Introduce Assertion

### Simplifying Method Calls
Rename Method, Add/Remove Parameter, Separate Query from Modifier, Parameterize Method, Replace Parameter with Explicit Methods, Preserve Whole Object, Replace Parameter with Method Call, Introduce Parameter Object, Remove Setting Method, Hide Method, Replace Constructor with Factory Method, Replace Error Code with Exception, Replace Exception with Test

### Generalization
Pull Up Field/Method/Constructor Body, Push Down Method/Field, Extract Subclass/Superclass/Interface, Collapse Hierarchy, Form Template Method, Replace Inheritance with Delegation, Replace Delegation with Inheritance

## Automated Smell Detection

| Smell | Tool | Threshold |
|-------|------|-----------|
| Long Method | `wc -l`, IDE | > 20 lines |
| Large Class | `wc -l`, LCOM | > 300 lines or LCOM > 10 |
| Duplicate Code | `jscpd`, `CPD`, `sonarqube` | > 5 line blocks |
| Deep Nesting | `radon`, `CodeClimate` | > 3 levels |
| Magic Numbers | `grep -n '[0-9]\{3,\}'` | > 2 digit literals |
| Long Params | AST analysis | > 3 parameters |
| Feature Envy | LCOM/CBO | Cross-class data usage |
| Dead Code | `deadcode`, `ts-prune` | Unused exports |

## Gate

| Gate | When |
|------|------|
| **BLOCK** | No tests, behavior changed, large risky changes, tests fail, new smells introduced |
| **WARN** | Not all smells addressed, more test coverage needed, part of incomplete larger plan |

## Checklist

- [ ] All tests pass
- [ ] No duplicate code introduced
- [ ] Names reveal intent
- [ ] Functions small, one thing
- [ ] One abstraction level per function
- [ ] Conditionals simplified
- [ ] No magic numbers
- [ ] Data encapsulated
- [ ] Single responsibility
- [ ] No feature envy
- [ ] Boy scout rule applied
