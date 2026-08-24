---
name: legacy-code-workshop
description: >
  Apply Michael Feathers' techniques for working effectively with legacy code: characterization
  tests, dependency breaking (extract interface, parameterize constructor, factory injection,
  sprout method, wrap method), the Mikado method, and understanding dependencies before changing.
  Use when the user needs to change code without tests, add features to untested code, break
  dependencies for testability, or systematically approach large-scale refactoring of legacy systems.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [legacy-code, testing, dependency-breaking, mikado, feathers, characterization-tests, sprout, wrap]
---

# Legacy Code Workshop Skill

Applies Michael Feathers' techniques for safely changing code that has no tests. Legacy
code is simply code without tests — it cannot be safely refactored, changed, or extended
without verification. This skill provides the tools to add test coverage, break
dependencies, and make legacy code testable and maintainable.

## Use when

- The user needs to change code that has no tests
- Adding features to untested or poorly tested code
- Breaking dependencies to enable unit testing
- Systematically approaching large-scale refactoring
- The user mentions "legacy code," "untested code," "hard to test," "can't mock," or
  "need to add tests before changing"
- The user provides a codebase and asks how to safely modify it
- Preparing legacy code for modernization or migration

## Do not use when

- The code already has comprehensive tests (use refactoring-catalog instead)
- The user wants to rewrite from scratch (that's a rewrite, not legacy work)
- The request is purely about writing new features in well-tested code
- The user wants architectural advice only (not code-level changes)

---

## Core Definition

> "Legacy code is simply code without tests." — Michael Feathers

This definition has nothing to do with age, language, or when it was written. Code written
today without tests is immediately legacy code. Old code with comprehensive tests is not
legacy code. The problem isn't age — it's the lack of a safety net.

---

## Step 1: Write Characterization Tests

Before changing anything, capture what the code actually does.

### What Are Characterization Tests?

- Tests that document **existing behavior**, not desired behavior
- They don't prove code is correct — they prove you understand what it does
- Written before any refactoring begins
- Capture edge cases and "accidental" behavior that may be intentional

### How to Write Them

1. Examine the code under test
2. Write a test that exercises a specific behavior
3. Run the test and observe the output
4. Fill in the expected value (the actual output)
5. This becomes your characterization test

### Why They Matter

- Create a regression safety net
- Document the system's actual behavior
- Make hidden dependencies visible
- Allow safe refactoring

---

## Step 2: Break Dependencies

Legacy code is hard to test because of tight coupling. These techniques break those
dependencies to enable testing.

### 2.1 Extract Interface

**Problem:** Class depends on a concrete implementation.
**Solution:** Create an interface; depend on the interface, not the concrete class.

### 2.2 Parameterize Constructor

**Problem:** A class creates its dependencies internally.
**Solution:** Pass dependencies through the constructor.

### 2.3 Factory Injection

**Problem:** A class creates dependencies internally and you can't change the constructor.
**Solution:** Inject a factory that creates the dependencies.

### 2.4 Extract and Override

**Problem:** A class creates dependencies internally and you can't use injection.
**Solution:** Extract the creation to a method; override it in tests.

### 2.5 Primitivization

**Problem:** A class depends on a complex object that's hard to mock.
**Solution:** Replace the complex object with primitive values.

### 2.6 Adapter

**Problem:** A class depends on a third-party API that's hard to test.
**Solution:** Wrap the third-party API in an adapter with an interface.

### 2.7 Facade

**Problem:** A class depends on a complex subsystem.
**Solution:** Create a facade that simplifies the interface.

---

## Step 3: Add Behavior Safely

### Sprout Method

**When:** You need to add a small piece of functionality to a complex method that is
too risky to modify directly.

**How:**
1. Create a new method (the "sprout")
2. Write the new code in the sprout method
3. Write tests for the sprout method
4. Call the sprout method from the original method

**Benefits:** New code is tested in isolation without disturbing existing logic.

### Wrap Method

**When:** You need to add behavior before and/or after an existing method call but
can't modify the calling method.

**How:**
1. Create a new method that wraps the original
2. Add behavior before the original call
3. Call the original method
4. Add behavior after the original call
5. Replace calls to the original with calls to the wrapper

**Benefits:** Preserves original method behavior while allowing pre/post processing.

---

## Step 4: Large-Scale Refactoring (Mikado Method)

When you need to make a large change but discover many dependencies, use the Mikado
Method to avoid leaving code in a broken state.

### The Process

1. **State the goal:** What do you want to change?
2. **Try the change:** Make the change you want
3. **Run tests:** See what breaks
4. **Revert:** Undo the change
5. **Create a Mikado graph:** Document what needs to change first
6. **Work on dependencies:** Tackle each dependency one at a time
7. **Repeat:** Continue until all dependencies are resolved
8. **Apply the original change:** Now you can safely make your change

### Mikado Graph Example

```
Goal: Extract UserService from GodClass

Mikado Graph:
- Extract UserService
  - Need to extract UserRepository (dependency)
    - Need to extract DatabaseConnection (dependency)
      - Need to refactor ConnectionManager (dependency)
        - Need to add tests for ConnectionManager (dependency)
```

### Key Principles

- Never leave code in a broken state
- Provides a clear roadmap for refactoring
- Makes large changes manageable
- Reduces risk of introducing bugs

---

## Dependency Graph Techniques

Before changing code, understand its dependencies.

### Techniques

| Technique | Purpose |
|-----------|---------|
| **Call graphs** | Map which methods call which |
| **Dependency trees** | Show the hierarchy of dependencies |
| **Impact analysis** | Determine what changes when a method changes |
| **Find all usages** | Identify every place a method is called |
| **Hotspot analysis** | Identify code that changes frequently or has many dependencies |

### Questions to Ask

- What does this code depend on?
- What depends on this code?
- What happens if I change this?
- What tests exist for this code?
- What are the side effects of changing this?

---

## Pre-Delivery Checklist

Before declaring legacy code work complete:

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

---

## Gate Implications

Gate must **BLOCK** when:

- Code is changed without characterization tests
- Dependencies are not broken before testing
- Large changes are made without a Mikado graph
- Code is left in a broken state
- Tests don't cover the changed behavior
- New dependencies are introduced without justification

Gate may **WARN** when:

- Not all dependencies are fully broken (prioritize the critical ones)
- Some characterization tests are incomplete
- The Mikado graph is partial but covers the critical path
- Test coverage is improving but not yet comprehensive

---

## Evidence Required

A legacy code session should produce:

- Characterization test suite for existing behavior
- Dependency graph or analysis of the code being changed
- List of dependency-breaking techniques applied
- Mikado graph for large-scale changes
- Before/after code showing improvements
- Test results confirming nothing broke

---

## Related Skills

These skills work together with legacy code techniques. Use the `software-engineering-analyst` agent
to orchestrate them as an integrated system.

| Skill | Connection |
|-------|------------|
| `refactoring-catalog` | Once dependencies are broken and tests exist, Fowler's catalog provides refactoring techniques |
| `clean-code-review` | Clean Code principles define the goal state after fixing legacy code |
| `pragmatic-development` | Pragmatic practices (TDD, version control, testing) prevent code from becoming legacy |
| `software-metrics-quality` | Metrics quantify legacy code risk and track improvement after changes |

**Orchestrated by:** `software-engineering-analyst` agent

---

## Cross-Tool Compatibility

This skill follows the open **Agent Skills** standard — a `SKILL.md` folder that any
compatible tool discovers at a well-known path (e.g. `.claude/skills/`, `.codex/skills/`,
`.opencode/skills/`, `.cursor/skills/`, `.github/skills/`, `.kiro/skills/`,
`.gemini/skills/`, `.kilocode/skills/`). The `SKILL.md` above is the single source of
truth; it is installed unmodified into each tool.

To expose this skill to a target project, run the repo's `install-skill.sh`:

```bash
bash install-skill.sh --tool claude,codex,cursor,kilocode,opencode --target /path/to/project
bash install-skill.sh --tool claude --target /path/to/project --id legacy-code-workshop
bash install-skill.sh --list-tools
```

For tools that do not read `SKILL.md` natively, point them at `references/condensed.md`.
