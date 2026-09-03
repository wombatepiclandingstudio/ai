---
name: refactoring-catalog
description: >
  Apply Martin Fowler's refactoring catalog to restructure existing code without changing
  external behavior. Use when the user asks to refactor, clean up, improve design, reduce
  technical debt, or restructure code; when code smells are identified; before adding features
  to messy code; or when applying the boy scout rule. Covers the full catalog: Composing
  Methods, Moving Features Between Objects, Organizing Data, Simplifying Conditional
  Expressions, Simplifying Method Calls, and Dealing with Generalization.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [refactoring, code-smells, clean-code, design, fowler, technical-debt, boy-scout]
---

# Refactoring Catalog Skill

Applies Martin Fowler's disciplined refactoring technique: a series of small,
behavior-preserving transformations that improve internal structure without changing
external behavior. Each refactoring is a named, proven technique with clear mechanics.

## Use when

- The user asks to refactor, clean up, or restructure existing code
- Code smells are identified (long methods, large classes, duplication, etc.)
- Before adding a feature to messy code — clean up first
- After adding a feature — improve the design you just worked with
- When fixing a bug — understand the code better while you're in there
- During code review — identify refactoring opportunities
- The user mentions "technical debt," "code smells," "clean code," or "design improvement"

## Do not use when

- The user is writing new code from scratch (no existing code to refactor)
- There are no tests and the user won't write characterization tests first
- The user wants to rewrite the entire system (that's a rewrite, not refactoring)
- The request is about performance optimization (refactoring preserves behavior, not improves performance)

---

## Core Principles

1. **Refactoring is behavior-preserving** — external behavior never changes
2. **Small, incremental steps** — each change is tiny and safe
3. **Tests are mandatory** — never refactor without a test suite
4. **Code smells are signals** — they tell you where to refactor
5. **The catalog is a vocabulary** — named techniques with proven mechanics
6. **Clean code is the goal** — obvious, minimal, no duplication, passes all tests
7. **Refactoring is continuous** — not a one-time activity; part of daily development

---

## When to Refactor

| Trigger | Action |
|---------|--------|
| **The Rule of Three** | When you find yourself doing the same thing three times, refactor |
| **Before adding a feature** | Clean up so the new feature is easier to add |
| **After adding a feature** | Refactor to improve the design you just worked with |
| **When fixing a bug** | Understand the code better; clean up while you're in there |
| **During code review** | Use the catalog to identify opportunities |
| **Technical debt accumulates** | When code becomes hard to understand or modify |

---

## Code Smells (When to Refactor)

### Bloaters
| Smell | Description | Primary Refactoring |
|-------|-------------|-------------------|
| **Long Method** | A method that does too much | Extract Method |
| **Large Class** | A class with too many fields/methods | Extract Class |
| **Primitive Obsession** | Using primitives instead of small objects | Replace Data Value with Object |
| **Long Parameter List** | Methods with too many parameters | Introduce Parameter Object |
| **Data Clumps** | Groups of fields that always appear together | Extract Class |

### Object-Orientation Abusers
| Smell | Description | Primary Refactoring |
|-------|-------------|-------------------|
| **Switch Statements** | Long chains of switch/if-else | Replace Conditional with Polymorphism |
| **Temporary Field** | Fields used only in certain circumstances | Extract Class |
| **Refused Bequest** | Subclass doesn't use inherited members | Replace Inheritance with Delegation |
| **Alternative Classes** | Classes that do the same thing but differently | Unify Interface |

### Change Preventers
| Smell | Description | Primary Refactoring |
|-------|-------------|-------------------|
| **Divergent Change** | One class changed for many different reasons | Extract Class |
| **Shotgun Surgery** | One change requires modifications in many classes | Move Method / Move Field |
| **Parallel Inheritance Hierarchies** | Subclassing one requires subclassing another | Move Method |

### Dispensables
| Smell | Description | Primary Refactoring |
|-------|-------------|-------------------|
| **Comments** | Comments that explain bad code | Fix the code, not the comment |
| **Duplicate Code** | Same structure in more than one place | Extract Method / Pull Up Method |
| **Lazy Class** | A class not doing enough to earn its keep | Inline Class |
| **Data Class** | Classes that only hold data | Move Method / Encapsulate Collection |
| **Dead Code** | Code never executed or reachable | Remove |
| **Speculative Generality** | Code created "just in case" | Inline Class / Remove |

### Couplers
| Smell | Description | Primary Refactoring |
|-------|-------------|-------------------|
| **Feature Envy** | A method uses data from another class more than its own | Move Method |
| **Inappropriate Intimacy** | Classes too dependent on each other's internals | Move Method / Hide Delegate |
| **Message Chains** | Navigating through multiple objects (`a.getB().getC()`) | Hide Delegate |
| **Middle Man** | A class that does nothing but delegate | Remove Middle Man |

---

## Refactoring Catalog

### Composing Methods

| Refactoring | Description | When to Use |
|-------------|-------------|-------------|
| **Extract Method** | Turn a code fragment into its own method with a descriptive name | Long method, unclear intent |
| **Inline Method** | Put the method's body into the callers and remove the method | Method body is as clear as the name |
| **Extract Variable** | Assign a complex expression to a named temporary variable | Complex expressions |
| **Inline Temp** | Use the variable expression everywhere instead of a temp | Temp is used once |
| **Replace Temp with Query** | Extract the expression into a method | Temp's value is used in multiple places |
| **Split Temporary Variable** | If a temp is assigned more than once, split into separate variables | Same temp for unrelated purposes |
| **Remove Assignments to Parameters** | Don't reassign parameters; use a local variable instead | Side-effect on parameters |
| **Replace Method with Method Object** | Turn a long method into its own object so locals become fields | Very long local variables |
| **Substitute Algorithm** | Replace the method body with a cleaner algorithm | Simpler way to express |

### Moving Features Between Objects

| Refactoring | Description | When to Use |
|-------------|-------------|-------------|
| **Move Method** | Move a method to the class where it's used most | Method used more in another class |
| **Move Field** | Move a field to the class where it's used most | Field used more in another class |
| **Extract Class** | Split a class doing work that should be two classes | Two responsibilities |
| **Inline Class** | Fold a class into another | Class isn't doing enough alone |
| **Hide Delegate** | Encapsulate delegation | Client shouldn't know about delegate |
| **Remove Middle Man** | Remove the middleman if a class just delegates everything | Too much delegation |
| **Introduce Foreign Method** | Create a method in a class that takes another class's instance | Adding behavior to third-party class |
| **Introduce Local Extension** | Create a subclass or wrapper to extend a class | Need to add methods to existing class |

### Organizing Data

| Refactoring | Description | When to Use |
|-------------|-------------|-------------|
| **Self Encapsulate Field** | Replace direct field access with getter/setter | Need to control access |
| **Replace Data Value with Object** | Turn a simple value into an object | Value with behavior needed |
| **Change Value to Reference** | Turn a value into a shared reference | Need shared identity |
| **Change Reference to Value** | Turn a reference into an immutable value | No shared identity needed |
| **Replace Array with Object** | Replace an array with an object with named fields | Array has different elements with meaning |
| **Replace Magic Number with Symbolic Constant** | Use named constants instead of literal numbers | Magic numbers in code |
| **Encapsulate Field** | Make a public field private with accessors | Public field needs control |
| **Encapsulate Collection** | Return read-only views of collections | Need to control collection access |
| **Replace Type Code with Class** | Replace type codes with a class | Type-safe alternatives needed |
| **Replace Type Code with Subclasses** | Replace type codes with polymorphic subclasses | Different behavior per type |
| **Replace Type Code with State/Strategy** | Replace type codes with state or strategy pattern | Type changes at runtime |
| **Replace Subclass with Fields** | Replace subclasses with fields in parent | Subclasses don't differ in behavior |

### Simplifying Conditional Expressions

| Refactoring | Description | When to Use |
|-------------|-------------|-------------|
| **Decompose Conditional** | Extract the condition into a method | Complex condition |
| **Consolidate Conditional Expression** | Combine several conditionals into one | Same result from different conditions |
| **Consolidate Duplicate Conditional Fragments** | Move duplicate code outside conditionals | Same code in if/else branches |
| **Remove Control Flag** | Replace control flag variable with break/return | Variable used to control flow |
| **Replace Nested Conditional with Guard Clauses** | Use early returns for special cases | Deep nesting |
| **Replace Conditional with Polymorphism** | Replace type-checking with polymorphism | Long switch/if-else on type |
| **Introduce Null Object** | Return a Null Object instead of null | Repeated null checks |
| **Introduce Assertion** | Add assertions to state invariants | Precondition/postcondition |

### Simplifying Method Calls

| Refactoring | Description | When to Use |
|-------------|-------------|-------------|
| **Rename Method** | Rename to clearly communicate purpose | Name doesn't reveal intent |
| **Add Parameter** | Add a parameter | Need more information |
| **Remove Parameter** | Remove unused parameter | Parameter no longer needed |
| **Separate Query from Modifier** | Split method into query and modifier | Method does two things |
| **Parameterize Method** | Merge methods that differ only in values | Similar methods with different parameters |
| **Replace Parameter with Explicit Methods** | Create separate methods instead of boolean parameter | Boolean flag controls behavior |
| **Preserve Whole Object** | Pass the whole object instead of extracted values | Many values from one object |
| **Replace Parameter with Method Call** | Call the object instead of passing value | Value derivable from another object |
| **Introduce Parameter Object** | Group parameters that always go together | Long parameter lists |
| **Remove Setting Method** | Remove setters for fields that shouldn't change | Field should be immutable |
| **Hide Method** | Make a method private | Method not needed by other classes |
| **Replace Constructor with Factory Method** | Use a factory for more expressive construction | Complex construction logic |
| **Replace Error Code with Exception** | Use exceptions instead of return codes | Error codes force coupling |
| **Replace Exception with Test** | Check before calling instead of catching | Caller should check first |

### Dealing with Generalization

| Refactoring | Description | When to Use |
|-------------|-------------|-------------|
| **Pull Up Field** | Move field to parent class | Same field in multiple subclasses |
| **Pull Up Method** | Move method to parent if identical in subclasses | Duplicate method in subclasses |
| **Pull Up Constructor Body** | Factor common constructor logic to parent | Duplicate constructor code |
| **Push Down Method** | Move method to subclass if only it needs it | Method only relevant in one subclass |
| **Push Down Field** | Move field to subclass if only it uses it | Field only relevant in one subclass |
| **Extract Subclass** | Create a subclass for a portion of a class | Part of a class has different responsibility |
| **Extract Superclass** | Create a parent for two similar classes | Common features across classes |
| **Extract Interface** | Create interface for shared operations | Multiple classes share method signatures |
| **Collapse Hierarchy** | Merge subclass and parent if no longer different | Subclass adds nothing |
| **Form Template Method** | Move invariant parts to parent, vary the rest | Subclasses differ only in steps |
| **Replace Inheritance with Delegation** | Use composition instead of inheritance | Subclass doesn't need inherited behavior |
| **Replace Delegation with Inheritance** | Use inheritance when delegation is excessive | Wrapper does nothing but delegate |

---

## Refactoring Mechanics

Every refactoring follows this process:

1. **Ensure tests exist** — characterize current behavior
2. **Make a small change** — one behavior-preserving transformation
3. **Run tests** — verify nothing broke
4. **Repeat** — make the next small change
5. **Clean up** — remove any intermediate artifacts

---

## Automated Smell Detection

Use tools to find smells before manual review:

| Smell | Tool/Technique | What to Look For |
|-------|---------------|------------------|
| Long Method | `wc -l` per function, IDE "method length" | Functions > 20 lines |
| Large Class | `wc -l` per class, LCOM metric | Classes > 300 lines or LCOM > 10 |
| Duplicate Code | `jscpd`, `CPD` (PMD), `sonarqube` | Copy-pasted blocks > 5 lines |
| Deep Nesting | `radon` (Python), `CodeClimate` | Nesting depth > 3 |
| Magic Numbers | `grep -n '[0-9]\{3,\}' src/` | Numeric literals > 2 digits |
| Long Parameter List | AST analysis, IDE inspection | Methods > 3 parameters |
| Feature Envy | LCOM/CBO metrics | Methods using another class's data more than own |
| Dead Code | `deadcode` (Python), `ts-prune` (TS) | Unused exports, unreachable code |

**Workflow:**
1. Run automated tools first (fast, comprehensive)
2. Prioritize findings by risk (high CC + high change frequency = fix first)
3. Apply refactoring catalog techniques to each prioritized smell
4. Verify with tests after each change

---

## Pre-Delivery Checklist

Before declaring a refactoring complete:

- [ ] All existing tests pass
- [ ] New tests added for any new behavior (if any)
- [ ] No duplicate code introduced
- [ ] Method names reveal intent
- [ ] Functions are small and do one thing
- [ ] One level of abstraction per function
- [ ] Conditionals are simplified (guard clauses, polymorphism)
- [ ] No magic numbers — all replaced with named constants
- [ ] Data is properly encapsulated
- [ ] Classes have single responsibility
- [ ] No feature envy — methods live with their data
- [ ] The boy scout rule applied — code is cleaner than before

---

## Gate Implications

Gate must **BLOCK** when:

- Refactoring is attempted without a test suite
- External behavior changes during refactoring
- Large, risky changes are made instead of small incremental steps
- Tests fail after a refactoring step and aren't fixed
- The refactoring introduces new code smells

Gate may **WARN** when:

- Not all identified code smells are addressed (prioritize)
- Some refactorings require more test coverage to proceed safely
- The refactoring is part of a larger plan that isn't yet complete

---

## Evidence Required

A refactoring using this skill should produce:

- A list of code smells identified
- The refactoring(s) applied from the catalog
- Before/after code showing the transformation
- Test results confirming behavior is preserved
- Any new tests written to support the refactoring

---

## Related Skills

These skills work together with refactoring. Use the `software-engineering-analyst` agent
to orchestrate them as an integrated system.

| Skill | Connection |
|-------|------------|
| `clean-code-review` | Clean Code defines the goal state after refactoring — naming, functions, SOLID |
| `legacy-code-workshop` | Legacy Code techniques enable refactoring by breaking dependencies and adding tests |
| `pragmatic-development` | Pragmatic principles (DRY, orthogonality) are both causes and solutions for code smells |
| `software-metrics-quality` | Metrics tell you WHERE to refactor (high CC → Extract Method, high LCOM → Extract Class) |

**Orchestrated by:** `software-engineering-analyst` agent


