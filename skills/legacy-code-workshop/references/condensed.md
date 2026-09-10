# Legacy Code Workshop — Condensed Reference

## Quick Routing

| Trigger | Action |
|---------|--------|
| Changing code with no tests | Use this skill |
| "legacy code," "untested," "can't mock" | Use this skill |
| Code already has comprehensive tests | Use refactoring-catalog |
| Rewriting from scratch | Not legacy work |
| Architectural advice only | Not code-level changes |

## Hard Rules

| # | Rule |
|---|------|
| HR-1 | Characterize before changing |
| HR-2 | Never leave code broken |
| HR-3 | Break dependencies before testing |
| HR-4 | Mikado graph for large changes |
| HR-5 | Capture existing behavior as-is |
| HR-6 | No unjustified new dependencies |
| HR-7 | Work incrementally |
| HR-8 | Simplest technique first (decision tree) |

## Core Definition

> "Legacy code is simply code without tests." — Michael Feathers

## Dependency-Breaking Decision Tree

```
Can you change the constructor?
├── YES → Parameterize Constructor
└── NO → Can you change the class hierarchy?
    ├── YES → Extract Interface + Link by Contract
    └── NO → Can you override a method?
        ├── YES → Extract and Override
        └── NO → Can you inject a factory?
            ├── YES → Factory Injection
            └── NO → Can you wrap the dependency?
                ├── YES → Adapter or Facade
                └── NO → Can you replace with primitives?
                    ├── YES → Primitivization
                    └── NO → Sprout/Wrap Method
```

**Priority:** Parameterize Constructor and Extract Interface first. Adapter/Facade last resort.

## 4-Step Process

```
Step 1: Characterize → Step 2: Break Dependencies → Step 3: Add Safely → Step 4: Scale
```

### Step 1: Characterization Tests
- Document EXISTING behavior, not desired behavior
- Capture edge cases and "accidental" behavior
- Create regression safety net

### Step 2: Break Dependencies
| # | Technique | When |
|---|-----------|------|
| 2.1 | Extract Interface | Concrete implementation dependency |
| 2.2 | Parameterize Constructor | Class creates dependencies internally |
| 2.3 | Factory Injection | Can't change constructor |
| 2.4 | Extract and Override | Can't use injection |
| 2.5 | Primitivization | Complex object hard to mock |
| 2.6 | Adapter | Third-party API |
| 2.7 | Facade | Complex subsystem |

### Step 3: Safe Behavior Addition
| Pattern | When |
|---------|------|
| Sprout Method | Small functionality, complex method |
| Sprout Class | Substantial new functionality, has own state |
| Wrap Method | Pre/post behavior around existing call |

### Step 4: Mikado Method (Large Changes)
1. State goal → 2. Try change → 3. Run tests → 4. Revert → 5. Create graph → 6. Work dependencies → 7. Repeat → 8. Apply original change

## Error Recovery

| Error | Fix |
|-------|-----|
| Unexpected behavior in characterization test | Document as-is; don't "fix" yet |
| Technique fails | Revert; try next in decision tree |
| Circular dependency | Break with interface; re-evaluate graph |
| Code left broken | Revert immediately |

## Gate

| Gate | When |
|------|------|
| **BLOCK** | Changed without characterization tests, dependencies not broken, no Mikado graph for large changes, code broken, tests don't cover changes |
| **WARN** | Partial dependency breaking, incomplete characterization tests, partial Mikado graph |

## Checklist

- [ ] Characterization tests written
- [ ] Dependencies broken for testability
- [ ] New code in sprout/wrap methods, tested independently
- [ ] Mikado graph for large changes
- [ ] All existing tests pass
- [ ] No code broken
- [ ] Dependency graph documented
- [ ] Changes small and incremental
