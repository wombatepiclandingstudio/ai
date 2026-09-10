# Clean Code Review — Condensed Reference

## Quick Routing

| Trigger | Action |
|---------|--------|
| Code quality / maintainability review | Use this skill |
| "clean code," "SOLID," "naming," "code review" | Use this skill |
| Writing from scratch with no code to review | Do NOT use |
| Performance optimization only | Do NOT use |
| Purely architectural request | Do NOT use |

## Hard Rules

| # | Rule |
|---|------|
| HR-1 | Never return null |
| HR-2 | Never pass null |
| HR-3 | No flag parameters |
| HR-4 | Don't comment bad code — rewrite it |
| HR-5 | Functions rarely exceed 20 lines |
| HR-6 | No single-letter variables except loop counters |
| HR-7 | No Hungarian notation or abbreviations |
| HR-8 | One level of abstraction per function |
| HR-9 | No side effects AND return values |
| HR-10 | Exceptions for exceptional cases only |
| HR-11 | No duplicate code |
| HR-12 | Never refactor without tests |

## Decision Tree

```
Reviewing code quality?
├── Names bad? → Meaningful Names rules
├── Functions too large? → Extract Method; SRP
├── Duplication? → Extract; DRY
├── Error handling wrong? → Exceptions, no null
├── SOLID violated? → Extract Class, interfaces
├── No tests? → Write tests; TDD cycle
└── Mutable state? → const/final/readonly; pure functions
```

## SOLID

| P | Rule |
|---|------|
| S | One class = one reason to change |
| O | Open for extension, closed for modification |
| L | Subtypes substitutable for base types |
| I | Clients depend only on interfaces they use |
| D | Depend on abstractions, not concretions |

## TDD Cycle

`RED → GREEN → REFACTOR`

**FIRST:** Fast, Independent, Repeatable, Self-Validating, Timely

## Test Coverage Targets

| Priority | What | Target |
|----------|------|--------|
| 1 | Business logic / domain rules | Highest priority |
| 2 | Edge cases and error paths | Where bugs hide |
| 3 | Integration points | Where systems break |
| New code | Line/branch coverage | 80%+ |
| Critical paths | Payment, auth, data integrity | 100% |

## Gate

| Gate | When |
|------|------|
| **BLOCK** | Functions >20 lines, bad names, duplication, SOLID violations, no FIRST tests, null returned/passed |
| **WARN** | Slightly long functions, redundant comments, inconsistent formatting, partial coverage |

## Checklist

- [ ] Names reveal intent
- [ ] Functions <20 lines, do one thing
- [ ] No duplication
- [ ] Comments explain why, not what
- [ ] Exceptions not return codes
- [ ] No null returns/arguments
- [ ] SOLID followed
- [ ] Tests follow FIRST
- [ ] TDD cycle followed
- [ ] Code cleaner than found
