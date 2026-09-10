# Pragmatic Development — Condensed Reference

## Quick Routing

| Trigger | Action |
|---------|--------|
| Establishing dev practices / team standards | Use this skill |
| "pragmatic," "DRY," "orthogonal," "tracer bullets" | Use this skill |
| Starting a new project | Use this skill |
| Specific refactoring techniques | Use refactoring-catalog |
| Code review for clean code | Use clean-code-review |
| Legacy code techniques | Use legacy-code-workshop |

## Hard Rules

| # | Rule |
|---|------|
| HR-1 | DRY is non-negotiable |
| HR-2 | No tightly coupled components without interfaces |
| HR-3 | Starter Kit mandatory (VCS, tests, docs) |
| HR-4 | Pencil before pen — design first |
| HR-5 | Address technical debt before crises |
| HR-6 | Spikes timeboxed; throw away spike code |
| HR-7 | Define "good enough" upfront |
| HR-8 | Tracer bullets for new features |

## Decision Tree

```
What situation?
├── New project? → Tracer Bullets + Starter Kit
├── Duplicated logic? → DRY
├── Tightly coupled?
│   ├── Can inject? → Dependency Injection
│   ├── Multiple impls? → Interfaces
│   ├── Notifications? → Event-driven
│   └── None above? → Orthogonality analysis
├── Uncertain approach? → Pragmatic Spike (2-4hrs)
├── Gradual problem? → Boiling Frogs
├── Need "done" criteria? → Good Enough Software
├── Debugging? → Scientific Method
└── Adding features? → Continuous Refactoring
```

## Core Principles

| Principle | Key Idea |
|-----------|----------|
| DRY | Single source of truth |
| Orthogonality | Changes don't propagate |
| Tracer Bullets | Thin end-to-end slice first |
| Pencil Before Pen | Think before coding |
| Stone Soup | Start small, demonstrate value |
| Boiling Frogs | Don't ignore gradual problems |
| Good Enough | Fit for purpose, not perfect |
| Spike | Timeboxed exploration (2-4hrs) |
| Debug | Reproduce → Hypothesize → Test → Fix → Verify |

## DRY Violation Detection

- Copy-pasted 5+ line blocks in 3+ places
- 80%+ identical parameter lists
- Parallel hierarchies
- Magic values (same literal in 3+ places)
- Boilerplate in multiple tests

## Coupling Detection

- God objects (one class knows everything)
- Change ripple (1 change → 3+ files)
- Test difficulty (mock 5+ dependencies)
- Feature envy (uses another class's data more)
- Shotgun surgery (1 feature → many files)

## Starter Kit

| Component | Requirements |
|-----------|-------------|
| **Version Control** | Always, commit early/often, meaningful messages |
| **Testing** | Unit, integration, regression, performance; automate all |
| **Documentation** | Why not what, close to code, update with changes |

## Spike Rules

1. Define the question
2. Time limit: 2–4 hours max
3. Build narrowest prototype
4. Evaluate against criteria
5. Document decision and rationale
6. Throw away spike code

**Rule:** Spike beyond time limit = it became a feature. Reset and scope down.

## Gate

| Gate | When |
|------|------|
| **BLOCK** | DRY violations, no interfaces on coupled components, no VCS/tests, no design before implementation, untracked tech debt |
| **WARN** | Documented duplication, moderate coupling, improving coverage, partial docs |

## Checklist

- [ ] DRY applied
- [ ] Components orthogonal
- [ ] Tracer bullet for new features
- [ ] Design planned before coding
- [ ] Tech debt monitored
- [ ] "Good enough" defined
- [ ] Coupling broken with interfaces
- [ ] Debugging follows scientific method
- [ ] Refactoring continuous
- [ ] Starter kit in place
