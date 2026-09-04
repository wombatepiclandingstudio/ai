---
name: pragmatic-development
description: >
  Review and improve software development practices using proven pragmatic engineering
  principles. Covers DRY violation detection, orthogonality analysis, tracer bullet
  architecture, coupling-breaking techniques with decision criteria, the debugging
  mindset, and the pragmatic starter kit (version control, testing, documentation).
  Use when starting a new project, breaking tight coupling, establishing team
  development standards, or applying pragmatic philosophy to architecture decisions.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [pragmatic, dry, orthogonality, tracer-bullets, coupling, architecture, team-standards, debugging]
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

### DRY Violation Detection

Check for these patterns:
- **Copy-pasted blocks** — Same 5+ line block in 3+ places
- **Similar method signatures** — Methods with 80%+ identical parameter lists
- **Parallel hierarchies** — Two class hierarchies that mirror each other
- **Magic values** — Same string/number literal repeated (use named constants)
- **Boilerplate repetition** — Same setup/teardown code in multiple tests

**When to extract:** If you find yourself copying and pasting, that's duplication.
If the same value appears in 3+ places, name it. If the same logic appears in 2+ places,
extract it. If the same structure appears in 3+ places, abstract it.

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

### When to Use Which Technique

| Situation | Technique | Example |
|-----------|-----------|---------|
| Component A directly creates B | **Dependency injection** | Pass DB connection instead of creating it |
| Multiple implementations needed | **Use interfaces** | PaymentProcessor interface, Stripe/PayPal impls |
| Components need notification without direct calls | **Event-driven** | OrderPlaced event triggers inventory update |
| Cross-service communication | **Message passing** | RabbitMQ between Order and Shipping services |
| Multiple classes share similar behavior | **Shared abstractions** | Extract common base class or utility |

### Coupling Detection

Look for these signals:
- **God objects** — One class that knows about everything
- **Change ripple** — Changing one class requires changing 3+ others
- **Test difficulty** — Can't test a class without mocking 5+ dependencies
- **Feature envy** — Method uses another class's data more than its own
- **Shotgun surgery** — One feature change touches many unrelated files

### Pragmatic Spikes

When facing uncertainty about an approach, timebox a **spike**:
1. Define the question ("Can we use WebSocket for real-time updates?")
2. Set a time limit (2–4 hours max)
3. Build the narrowest possible prototype
4. Evaluate results against criteria
5. Document the decision and rationale
6. Throw away the spike code (it's exploration, not production)

**Rule:** A spike that grows beyond its time limit has not answered the question — it has
become a feature. Reset and scope down.

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

## Test Cases

### Test Case 1: DRY violation detection
**Input:** Code with three functions that each contain the same 10-line email validation regex and formatting logic.
**Expected output:** Identification of algorithm duplication (DRY violation), recommendation to extract into a shared `validateAndFormatEmail()` utility, with before/after code.
**Assertion:** Output identifies the specific duplication (3 copies of the same logic). Recommends extraction into a single function.

### Test Case 2: Coupling analysis
**Input:** A `ReportService` class that imports and directly uses 8 other classes (Database, Cache, EmailService, PdfGenerator, ExcelExporter, ChartLibrary, Logger, ConfigManager).
**Expected output:** Identification of high coupling (CBO = 8), analysis of which dependencies are essential vs. accidental, and recommendations to reduce coupling using interfaces, dependency injection, or event-driven patterns.
**Assertion:** Output identifies the coupling issue. Provides at least 2 specific decoupling recommendations with rationale.

### Test Case 3: Tracer bullet recommendation
**Input:** A request to build a new feature: "Add a reporting dashboard that pulls data from 3 APIs, processes it, and displays charts."
**Expected output:** Recommendation to build a tracer bullet first — a thin end-to-end slice that connects to one API, fetches raw data, and displays it in a simple table — before building the full dashboard.
**Assertion:** Output recommends tracer bullet approach. The proposed slice touches all layers (data → processing → display) but implements minimal functionality.
---

## Companion Skills

| Skill | Connection |
|-------|------------|
| `refactoring-catalog` | Continuous refactoring is a Pragmatic practice; Fowler's catalog provides the techniques |
| `clean-code-review` | Clean Code and Pragmatic Programmer share principles (DRY, boy scout rule, SRP) |
| `legacy-code-workshop` | Pragmatic practices (TDD, testing, version control) prevent code from becoming legacy |
| `software-metrics-quality` | Metrics quantify DRY violations, coupling, and the effectiveness of pragmatic practices |


