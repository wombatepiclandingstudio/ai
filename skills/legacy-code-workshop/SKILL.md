---
name: legacy-code-workshop
description: >
  Safely modify legacy code that has no tests. Apply Michael Feathers' techniques:
  write characterization tests to document existing behavior, break dependencies for
  testability (extract interface, factory injection, sprout/wrap methods), and use
  the Mikado method for large-scale refactoring. Includes a dependency-breaking decision
  tree and sprout class technique. Paste untested code and get a step-by-step plan to
  change it safely.
---

**Scope:** Applies Michael Feathers' techniques for safely changing code that has no tests. Legacy code is simply code without tests — it cannot be safely refactored, changed, or extended without verification. This skill provides the tools to add test coverage, break dependencies, and make legacy code testable and maintainable.

---

## Zero — Core Concepts

> "Legacy code is simply code without tests." — Michael Feathers

This definition has nothing to do with age, language, or when it was written. Code written today without tests is immediately legacy code. Old code with comprehensive tests is not legacy code. The problem isn't age — it's the lack of a safety net.

**The Four-Step Process:**

```
Step 1: Characterize → Step 2: Break Dependencies → Step 3: Add Safely → Step 4: Scale
   │                    │                              │                   │
   │ Capture what       │ Enable testing               │ Sprout/Wrap       │ Mikado Method
   │ code ACTUALLY does │ via techniques               │ new behavior      │ for large changes
```

**Dependency-Breaking Techniques Summary:**

| # | Technique | When |
|---|-----------|------|
| 2.1 | Extract Interface | Class depends on concrete implementation |
| 2.2 | Parameterize Constructor | Class creates dependencies internally |
| 2.3 | Factory Injection | Can't change constructor |
| 2.4 | Extract and Override | Can't use injection |
| 2.5 | Primitivization | Complex object hard to mock |
| 2.6 | Adapter | Third-party API hard to test |
| 2.7 | Facade | Complex subsystem dependency |

**Safe Behavior-Addition Patterns:**

| Pattern | When |
|---------|------|
| **Sprout Method** | Small functionality added to complex method |
| **Sprout Class** | New functionality is substantial or has its own state |
| **Wrap Method** | Add behavior before/after existing method call |

---

## One — When to Use

- The user needs to change code that has no tests
- Adding features to untested or poorly tested code
- Breaking dependencies to enable unit testing
- Systematically approaching large-scale refactoring
- The user mentions "legacy code," "untested code," "hard to test," "can't mock," or "need to add tests before changing"
- The user provides a codebase and asks how to safely modify it
- Preparing legacy code for modernization or migration

**Do NOT use when:**

- The code already has comprehensive tests (use refactoring-catalog instead)
- The user wants to rewrite from scratch (that's a rewrite, not legacy work)
- The request is purely about writing new features in well-tested code
- The user wants architectural advice only (not code-level changes)

---

## Two — Hard Prohibitions

> **HR-1.** Do NOT change code without writing characterization tests first.

> **HR-2.** Do NOT leave code in a broken state — always revert if a step fails.

> **HR-3.** Do NOT skip dependency breaking before attempting to test.

> **HR-4.** Do NOT make large changes without a Mikado graph.

> **HR-5.** Do NOT assume existing behavior is correct — capture it as-is first.

> **HR-6.** Do NOT introduce new dependencies without justification.

> **HR-7.** Do NOT try to fix everything at once — work incrementally.

> **HR-8.** Do NOT skip the decision tree — use the simplest technique that works.

---

## Three — Decision Tree: Dependency Breaking

```
Can you change the constructor?
├── YES → Parameterize Constructor (2.2)
│         Pass dependencies through constructor
└── NO → Can you change the class hierarchy?
    ├── YES → Extract Interface (2.1) + Link by Contract
    │         Define interface for what you need; depend on that
    └── NO → Can you override a method?
        ├── YES → Extract and Override (2.4)
        │         Extract creation to method; override in tests
        └── NO → Can you inject a factory?
            ├── YES → Factory Injection (2.3)
            │         Inject factory that creates dependencies
            └── NO → Can you wrap the dependency?
                ├── YES → Adapter (2.6) or Facade (2.7)
                │         Wrap third-party API or complex subsystem
                └── NO → Can you replace with primitives?
                    ├── YES → Primitivization (2.5)
                    │         Replace complex object with primitive values
                    └── NO → Use Sprout Method/Wrap Method to
                             add behavior around the dependency
```

**Priority:** Try techniques that produce the most testable result with the least code change first. Parameterize Constructor and Extract Interface are usually best. Adapter and Facade are last resorts for third-party code you can't modify.

---

## Four — Process

### Step 1: Write Characterization Tests

Before changing anything, capture what the code actually does.

**What Are Characterization Tests?**
- Tests that document **existing behavior**, not desired behavior
- They don't prove code is correct — they prove you understand what it does
- Written before any refactoring begins
- Capture edge cases and "accidental" behavior that may be intentional

**How to Write Them:**
1. Examine the code under test
2. Write a test that exercises a specific behavior
3. Run the test and observe the output
4. Fill in the expected value (the actual output)
5. This becomes your characterization test

**Why They Matter:**
- Create a regression safety net
- Document the system's actual behavior
- Make hidden dependencies visible
- Allow safe refactoring

### Step 2: Break Dependencies

Use the decision tree (Section Three) to select the appropriate technique.

**Technique Details:**

| Technique | Problem | Solution |
|-----------|---------|----------|
| **Extract Interface** | Class depends on concrete implementation | Create interface; depend on interface, not concrete class |
| **Parameterize Constructor** | Class creates dependencies internally | Pass dependencies through the constructor |
| **Factory Injection** | Can't change constructor | Inject a factory that creates the dependencies |
| **Extract and Override** | Can't use injection | Extract creation to method; override in tests |
| **Primitivization** | Complex object hard to mock | Replace complex object with primitive values |
| **Adapter** | Third-party API hard to test | Wrap third-party API in adapter with interface |
| **Facade** | Complex subsystem dependency | Create facade that simplifies the interface |
| **Link by Contract** | Inheritance dependency, can't break easily | Define interface capturing what you need; depend on interface |

### Step 3: Add Behavior Safely

**Sprout Method:**
1. Create a new method (the "sprout")
2. Write the new code in the sprout method
3. Write tests for the sprout method
4. Call the sprout method from the original method

**Sprout Class:**
1. Create a new class for the new functionality
2. Write tests for the new class in isolation
3. Implement the new class
4. Create an instance of the new class from the original code
5. Delegate to the new class from the original method

Use when Sprout Method would create a method longer than ~20 lines.

**Wrap Method:**
1. Create a new method that wraps the original
2. Add behavior before the original call
3. Call the original method
4. Add behavior after the original call
5. Replace calls to the original with calls to the wrapper

### Step 4: Large-Scale Refactoring (Mikado Method)

When you need to make a large change but discover many dependencies, use the Mikado Method.

**The Process:**
1. **State the goal:** What do you want to change?
2. **Try the change:** Make the change you want
3. **Run tests:** See what breaks
4. **Revert:** Undo the change
5. **Create a Mikado graph:** Document what needs to change first
6. **Work on dependencies:** Tackle each dependency one at a time
7. **Repeat:** Continue until all dependencies are resolved
8. **Apply the original change:** Now you can safely make your change

**Mikado Graph Example:**
```
Goal: Extract UserService from GodClass

Mikado Graph:
- Extract UserService
  - Need to extract UserRepository (dependency)
    - Need to extract DatabaseConnection (dependency)
      - Need to refactor ConnectionManager (dependency)
        - Need to add tests for ConnectionManager (dependency)
```

**Key Principles:**
- Never leave code in a broken state
- Provides a clear roadmap for refactoring
- Makes large changes manageable
- Reduces risk of introducing bugs

### Dependency Graph Techniques

Before changing code, understand its dependencies.

| Technique | Purpose |
|-----------|---------|
| **Call graphs** | Map which methods call which |
| **Dependency trees** | Show the hierarchy of dependencies |
| **Impact analysis** | Determine what changes when a method changes |
| **Find all usages** | Identify every place a method is called |
| **Hotspot analysis** | Identify code that changes frequently or has many dependencies |

**Questions to Ask:**
- What does this code depend on?
- What depends on this code?
- What happens if I change this?
- What tests exist for this code?
- What are the side effects of changing this?

---

## Five — Error Handling

| Error | Recovery |
|-------|----------|
| Characterization test reveals unexpected behavior | Document the behavior; don't "fix" it yet — it may be intentional |
| Dependency-breaking technique fails | Revert; try the next technique in the decision tree |
| Mikado graph reveals circular dependency | Break the cycle with an interface; re-evaluate the graph |
| Code is left in broken state | Revert immediately; do not commit broken code |
| Tests don't cover changed behavior | Write characterization tests for the changed behavior first |
| New dependency introduced | Justify it or find an alternative; prefer reducing dependencies |

---

## Six — Key Rules

| ID | Rule |
|----|------|
| **HR-1** | Characterize before changing |
| **HR-2** | Never leave code broken |
| **HR-3** | Break dependencies before testing |
| **HR-4** | Mikado graph for large changes |
| **HR-5** | Capture existing behavior as-is |
| **HR-6** | No unjustified new dependencies |
| **HR-7** | Work incrementally |
| **HR-8** | Simplest technique first (decision tree) |
| **SPROUT** | New behavior in sprout methods, tested independently |
| **WRAP** | Wrap existing methods for pre/post behavior |
| **MIKADO** | Never leave code broken; graph dependencies first |

---

## Seven — Evidence & Checklist

**Pre-Delivery Checklist:**

- [ ] Characterization tests written for existing behavior
- [ ] Dependencies broken for testability
- [ ] New code is in sprout/wrap methods, tested independently
- [ ] Mikado graph created for large changes
- [ ] All existing tests pass
- [ ] No code left in a broken state
- [ ] Dependency graph understood and documented
- [ ] Tests cover the specific behaviors being changed
- [ ] Changes are small and incremental
- [ ] The code is now more testable than before

**Gate Implications:**

| Gate | Condition |
|------|-----------|
| **BLOCK** | Code is changed without characterization tests |
| **BLOCK** | Dependencies are not broken before testing |
| **BLOCK** | Large changes are made without a Mikado graph |
| **BLOCK** | Code is left in a broken state |
| **BLOCK** | Tests don't cover the changed behavior |
| **BLOCK** | New dependencies are introduced without justification |
| **WARN** | Not all dependencies are fully broken (prioritize the critical ones) |
| **WARN** | Some characterization tests are incomplete |
| **WARN** | The Mikado graph is partial but covers the critical path |
| **WARN** | Test coverage is improving but not yet comprehensive |

**Evidence Required:**

- Characterization test suite for existing behavior
- Dependency graph or analysis of the code being changed
- List of dependency-breaking techniques applied
- Mikado graph for large-scale changes
- Before/after code showing improvements
- Test results confirming nothing broke

---

## Reference Guides

| Topic | See |
|-------|-----|
| Fowler's refactoring techniques | `refactoring-catalog` skill |
| Clean Code principles for the goal state | `clean-code-review` skill |
| Pragmatic practices to prevent legacy code | `pragmatic-development` skill |
| Metrics to quantify legacy code risk | `software-metrics-quality` skill |
| Detailed test cases and examples | `references/condensed.md` |
