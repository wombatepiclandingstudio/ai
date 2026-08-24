---
name: pragmatic-development
description: >
  Apply Andrew Hunt and David Thomas' Pragmatic Programmer principles: DRY, orthogonality,
  tracer bullets, breaking coupling, good-enough software, the debugging mindset, and the
  pragmatic starter kit (version control, testing, documentation). Use when establishing
  development practices, planning architecture, approaching new projects, breaking tight
  coupling, or applying pragmatic philosophy to software development decisions.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [pragmatic, dry, orthogonality, tracer-bullets, coupling, debugging, starter-kit, architecture]
---

# Pragmatic Development Skill

Applies Andrew Hunt and David Thomas' Pragmatic Programmer philosophy — a balanced
approach combining technical excellence with practical considerations. Good software
development is as much about people and processes as it is about technology.

## Use when

- Establishing development practices for a team or project
- Planning architecture for a new project
- Breaking tight coupling between components
- Applying pragmatic philosophy to development decisions
- The user mentions "pragmatic," "DRY," "orthogonal," "tracer bullets," "coupling,"
  "good enough," or "development practices"
- Starting a new project and need to establish foundation practices
- Reviewing whether a project follows pragmatic principles

## Do not use when

- The user wants specific refactoring techniques (use refactoring-catalog)
- The request is about code review for clean code (use clean-code-review)
- The user needs legacy code techniques (use legacy-code-workshop)
- The request is purely theoretical (not about practical application)

---

## Core Philosophy

> "Why should the poor user suffer because we don't have two keyboards?" — Pragmatic Programmer

The pragmatic philosophy emphasizes personal responsibility, continuous learning,
practicality, simplicity, adaptability, communication, and quality.

---

## 1. DRY (Don't Repeat Yourself)

> "Every piece of knowledge must have a single, unambiguous, authoritative
> representation within a system."

### Types of Duplication

| Type | Example | Solution |
|------|---------|----------|
| **Data duplication** | Same data in multiple places | Single source of truth, normalization |
| **Requirements duplication** | Same requirement documented multiple places | Single authoritative requirements doc |
| **Algorithm duplication** | Same logic in multiple places | Extract into shared functions/libraries |
| **Specification duplication** | Same interface in multiple places | Use contracts, interfaces, schemas |

### Practical Tips

- Use functions to encapsulate logic
- Create data abstractions
- Write self-documenting code
- Use metaprogramming when appropriate

---

## 2. Orthogonality

> "Reduce dependency between components. Two components are orthogonal if changing
> one does not affect the other."

### Benefits

- Easier to test individual components
- Components can be developed independently
- Easier to replace or upgrade components
- Reduces risk of changes propagating

### Techniques

- Design modules with clear, focused responsibilities
- Use interfaces and abstractions to decouple
- Avoid global variables and shared state
- Apply Single Responsibility Principle
- Use dependency injection

---

## 3. Tracer Bullets

> "Build a thin, end-to-end slice of the system that connects all layers to verify
> architecture and approach before full implementation."

### Why Tracer Bullets?

- Similar to tracer ammunition that shows where bullets are going
- Provides early feedback on architecture
- Reduces risk by validating assumptions early
- Creates a skeleton that can be fleshed out incrementally

### How to Use

- Build a minimal viable feature that touches all layers
- Get user feedback early
- Identify integration issues
- Prefer over Big Design Up Front (BDUF)

---

## 4. A Pencil is Better Than a Pen

> "Think through problems before diving into implementation."

### Practices

- Sketch designs on paper or whiteboard first
- Write pseudocode for complex algorithms
- Discuss approaches with colleagues before coding
- Create prototypes for risky approaches
- Use CRC cards for design

---

## 5. Stone Soup and Boiling Frogs

### Stone Soup

> "Start with something small that others can contribute to, building momentum."

- Don't ask permission; demonstrate value first
- Start with a working prototype
- Encourage others to contribute
- Build consensus through working software

### Boiling Frogs

> "Don't ignore gradually increasing problems."

- Technical debt accumulates gradually
- Small problems become big problems over time
- Regular refactoring prevents system degradation
- Monitor and address issues before crises

---

## 6. Good Enough Software

> "Software doesn't have to be perfect; it needs to be good enough for its purpose."

### Practice

- Define "good enough" criteria upfront
- Focus on what users actually need
- Use risk-based testing to prioritize
- Consider cost of delay vs. cost of defects
- Know when to stop polishing and ship

---

## 7. Breaking Coupling

### Techniques

| Technique | Description |
|-----------|-------------|
| **Use interfaces** | Program to interfaces, not implementations |
| **Dependency injection** | Pass dependencies rather than creating them |
| **Event-driven architecture** | Use events to decouple components |
| **Message passing** | Communicate through messages instead of direct calls |
| **Shared abstractions** | Use common interfaces for different implementations |

---

## 8. The Debugging Mindset

### Scientific Approach

1. **Reproduce:** Create a reliable test case
2. **Hypothesize:** Develop theories about the cause
3. **Test:** Verify hypotheses with experiments
4. **Fix:** Apply the minimal fix that addresses root cause
5. **Verify:** Confirm the fix works and doesn't introduce new issues
6. **Document:** Record what you learned

### Tips

- Use version control to isolate changes
- Debug in pairs for fresh perspectives
- Take breaks when stuck
- Use debugging tools effectively

---

## 9. Refactoring Along the Way

### When to Refactor

- When you need to understand code (refactor to understand)
- When adding a feature (clean up before/after)
- When fixing a bug (understand why it happened)
- During code review
- When you see code smells

### Common Smells

- Long methods
- Large classes
- Duplicated code
- Long parameter lists
- Feature envy
- Data clumps
- Primitive obsession
- Switch statements

---

## 10. Pragmatic Teams

### Key Principles

- Small, autonomous teams
- Quality is everyone's responsibility
- Communicate clearly and frequently
- Shared code ownership
- Pair programming on complex problems
- Regular retrospectives
- Knowledge sharing across team

---

## 11. The Pragmatic Starter Kit

### Version Control

- Always use version control
- Commit early, commit often
- Write meaningful commit messages
- Use branching strategies appropriate for your team
- Never commit generated files

### Automated Testing

- Unit tests for individual components
- Integration tests for component interactions
- Regression tests for existing functionality
- Performance tests for requirements
- Test early, test often
- Automate everything you can

### Documentation

- Document why, not what
- Keep documentation close to the code
- Use automated documentation tools
- Write for your audience
- Update documentation as code changes

---

## Pre-Delivery Checklist

Before declaring development practices established:

- [ ] DRY principle applied — no knowledge duplication
- [ ] Components are orthogonal — changes don't propagate
- [ ] Tracer bullet approach used for new features
- [ ] Design planned before coding (pencil before pen)
- [ ] Technical debt monitored and addressed (boiling frogs)
- [ ] "Good enough" criteria defined
- [ ] Coupling broken with interfaces and injection
- [ ] Debugging follows scientific method
- [ ] Refactoring is continuous (boy scout rule)
- [ ] Team practices established (shared ownership, retrospectives)
- [ ] Starter kit in place (version control, testing, documentation)

---

## Gate Implications

Gate must **BLOCK** when:

- Knowledge is duplicated across the system (DRY violation)
- Components are tightly coupled without interfaces
- No version control or testing infrastructure
- Design was not planned before implementation
- Technical debt is accumulating without tracking

Gate may **WARN** when:

- Some duplication exists but is documented and justified
- Coupling is moderate but manageable
- Testing coverage is improving but not comprehensive
- Documentation is partial but covers critical paths

---

## Evidence Required

A pragmatic development session should produce:

- DRY compliance check (knowledge duplication identified and resolved)
- Orthogonality analysis (component dependencies mapped)
- Tracer bullet implementation (end-to-end slice working)
- Design artifacts (sketches, CRC cards, pseudocode)
- Starter kit verification (VCS, tests, docs in place)

---

## Related Skills

These skills work together with pragmatic development. Use the `software-engineering-analyst` agent
to orchestrate them as an integrated system.

| Skill | Connection |
|-------|------------|
| `refactoring-catalog` | Continuous refactoring is a Pragmatic practice; Fowler's catalog provides the techniques |
| `clean-code-review` | Clean Code and Pragmatic Programmer share principles (DRY, boy scout rule, SRP) |
| `legacy-code-workshop` | Pragmatic practices (TDD, testing, version control) prevent code from becoming legacy |
| `software-metrics-quality` | Metrics quantify DRY violations, coupling, and the effectiveness of pragmatic practices |

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
bash install-skill.sh --tool claude --target /path/to/project --id pragmatic-development
bash install-skill.sh --list-tools
```

For tools that do not read `SKILL.md` natively, point them at `references/condensed.md`.
