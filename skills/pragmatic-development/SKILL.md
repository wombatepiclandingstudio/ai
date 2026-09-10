---
name: pragmatic-development
description: >
  Review and improve software development practices using proven pragmatic engineering
  principles. Covers DRY violation detection, orthogonality analysis, tracer bullet
  architecture, coupling-breaking techniques with decision criteria, the debugging
  mindset, and the pragmatic starter kit (version control, testing, documentation).
  Use when starting a new project, breaking tight coupling, establishing team
  development standards, or applying pragmatic philosophy to architecture decisions.
---

**Scope:** Applies Andrew Hunt and David Thomas' Pragmatic Programmer philosophy — a balanced approach combining technical excellence with practical considerations. Good software development is as much about people and processes as it is about technology.

---

## Zero — Core Concepts

> "Why should the poor user suffer because we don't have two keyboards?" — Pragmatic Programmer

The pragmatic philosophy emphasizes personal responsibility, continuous learning, practicality, simplicity, adaptability, communication, and quality.

**Core Principles:**

| Principle | Description |
|-----------|-------------|
| **DRY** | Every piece of knowledge has a single, unambiguous, authoritative representation |
| **Orthogonality** | Reduce dependency between components; changes don't propagate |
| **Tracer Bullets** | Thin end-to-end slice validates architecture before full implementation |
| **Pencil Before Pen** | Think through problems before diving into implementation |
| **Stone Soup** | Start small, demonstrate value, build momentum |
| **Boiling Frogs** | Don't ignore gradually increasing problems |
| **Good Enough** | Software doesn't have to be perfect; it needs to be fit for purpose |
| **Decoupling** | Break coupling with interfaces, injection, events |
| **Debugging Mindset** | Scientific approach: reproduce, hypothesize, test, fix, verify |
| **Continuous Refactoring** | Clean up along the way; boy scout rule |
| **Pragmatic Teams** | Small, autonomous, shared ownership |

**Coupling-Breaking Techniques:**

| Situation | Technique |
|-----------|-----------|
| Component A directly creates B | Dependency injection |
| Multiple implementations needed | Use interfaces |
| Components need notification without direct calls | Event-driven |
| Cross-service communication | Message passing |
| Multiple classes share similar behavior | Shared abstractions |

---

## One — When to Use

- Establishing development practices for a team or project
- Planning architecture for a new project
- Breaking tight coupling between components
- Applying pragmatic philosophy to development decisions
- The user mentions "pragmatic," "DRY," "orthogonal," "tracer bullets," "coupling," "good enough," or "development practices"
- Starting a new project and need to establish foundation practices
- Reviewing whether a project follows pragmatic principles

**Do NOT use when:**

- The user wants specific refactoring techniques (use refactoring-catalog)
- The request is about code review for clean code (use clean-code-review)
- The user needs legacy code techniques (use legacy-code-workshop)
- The request is purely theoretical (not about practical application)

---

## Two — Hard Prohibitions

> **HR-1.** Do NOT duplicate knowledge across the system — DRY is non-negotiable.

> **HR-2.** Do NOT allow components to be tightly coupled without interfaces.

> **HR-3.** Do NOT start a project without version control, testing, and documentation (the Starter Kit).

> **HR-4.** Do NOT skip design before implementation — pencil before pen.

> **HR-5.** Do NOT ignore gradually increasing technical debt — boiling frogs.

> **HR-6.** Do NOT let spikes grow beyond their time limit — reset and scope down.

> **HR-7.** Do NOT aim for perfection — define "good enough" criteria upfront.

> **HR-8.** Do NOT ship without a tracer bullet approach for new features.

---

## Three — Decision Tree: Which Pragmatic Principle Applies

```
What situation are you facing?
├── Starting a new project?
│   └── USE → Tracer Bullets (Section One) + Starter Kit (Section Four)
│             Build thin end-to-end slice; establish VCS, tests, docs
├── Found duplicated logic or data?
│   └── USE → DRY (Section One)
│             Extract into single source of truth
├── Components tightly coupled?
│   ├── Can you inject dependencies?
│   │   └── YES → Dependency Injection
│   ├── Do you need multiple implementations?
│   │   └── YES → Interfaces
│   ├── Need notifications without direct calls?
│   │   └── YES → Event-driven / Message passing
│   └── None of the above?
│       └── USE → Orthogonality analysis (Section One)
│                 Design modules with clear, focused responsibilities
├── Uncertain about an approach?
│   └── USE → Pragmatic Spike (Section One)
│             Timebox 2-4 hours; build narrow prototype; evaluate; throw away
├── Gradual problem accumulating?
│   └── USE → Boiling Frogs (Section One)
│             Monitor, address before crises
├── Need to define "done"?
│   └── USE → Good Enough Software (Section One)
│             Define criteria upfront; focus on what users need
├── Debugging a problem?
│   └── USE → Debugging Mindset (Section Four)
│             Reproduce → Hypothesize → Test → Fix → Verify → Document
└── Adding features to existing code?
    └── USE → Continuous Refactoring (Section Four)
              Clean up before/after; boy scout rule
```

---

## Four — Process

### DRY (Don't Repeat Yourself)

> "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."

**Types of Duplication:**

| Type | Example | Solution |
|------|---------|----------|
| **Data duplication** | Same data in multiple places | Single source of truth, normalization |
| **Requirements duplication** | Same requirement documented multiple places | Single authoritative requirements doc |
| **Algorithm duplication** | Same logic in multiple places | Extract into shared functions/libraries |
| **Specification duplication** | Same interface in multiple places | Use contracts, interfaces, schemas |

**DRY Violation Detection:**
- **Copy-pasted blocks** — Same 5+ line block in 3+ places
- **Similar method signatures** — Methods with 80%+ identical parameter lists
- **Parallel hierarchies** — Two class hierarchies that mirror each other
- **Magic values** — Same string/number literal repeated (use named constants)
- **Boilerplate repetition** — Same setup/teardown code in multiple tests

**When to extract:** If you find yourself copying and pasting, that's duplication. If the same value appears in 3+ places, name it. If the same logic appears in 2+ places, extract it. If the same structure appears in 3+ places, abstract it.

### Orthogonality

> "Reduce dependency between components. Two components are orthogonal if changing one does not affect the other."

**Benefits:** Easier to test, independent development, easier replacement, reduced risk of change propagation.

**Techniques:** Clear focused responsibilities, interfaces and abstractions, no global variables/shared state, SRP, dependency injection.

### Tracer Bullets

> "Build a thin, end-to-end slice of the system that connects all layers to verify architecture and approach before full implementation."

**Why:** Provides early feedback, reduces risk, creates skeleton for incremental fleshing out.

**How:** Build minimal viable feature touching all layers, get user feedback early, identify integration issues, prefer over BDUF.

### A Pencil is Better Than a Pen

- Sketch designs on paper or whiteboard first
- Write pseudocode for complex algorithms
- Discuss approaches with colleagues before coding
- Create prototypes for risky approaches
- Use CRC cards for design

### Stone Soup and Boiling Frogs

**Stone Soup:** Start with something small that others can contribute to. Don't ask permission; demonstrate value first. Build consensus through working software.

**Boiling Frogs:** Don't ignore gradually increasing problems. Technical debt accumulates gradually. Regular refactoring prevents system degradation.

### Good Enough Software

> "Software doesn't have to be perfect; it needs to be good enough for its purpose."

Define "good enough" criteria upfront. Focus on what users actually need. Use risk-based testing to prioritize. Consider cost of delay vs. cost of defects. Know when to stop polishing and ship.

### Breaking Coupling

**Coupling Detection Signals:**
- **God objects** — One class that knows about everything
- **Change ripple** — Changing one class requires changing 3+ others
- **Test difficulty** — Can't test a class without mocking 5+ dependencies
- **Feature envy** — Method uses another class's data more than its own
- **Shotgun surgery** — One feature change touches many unrelated files

**Pragmatic Spikes:**
1. Define the question ("Can we use WebSocket for real-time updates?")
2. Set a time limit (2–4 hours max)
3. Build the narrowest possible prototype
4. Evaluate results against criteria
5. Document the decision and rationale
6. Throw away the spike code (it's exploration, not production)

**Rule:** A spike that grows beyond its time limit has not answered the question — it has become a feature. Reset and scope down.

### The Debugging Mindset

**Scientific Approach:**
1. **Reproduce:** Create a reliable test case
2. **Hypothesize:** Develop theories about the cause
3. **Test:** Verify hypotheses with experiments
4. **Fix:** Apply the minimal fix that addresses root cause
5. **Verify:** Confirm the fix works and doesn't introduce new issues
6. **Document:** Record what you learned

**Tips:** Use version control to isolate changes. Debug in pairs for fresh perspectives. Take breaks when stuck. Use debugging tools effectively.

### Refactoring Along the Way

**When to Refactor:** When you need to understand code, when adding a feature, when fixing a bug, during code review, when you see code smells.

**Common Smells:** Long methods, large classes, duplicated code, long parameter lists, feature envy, data clumps, primitive obsession, switch statements.

### Pragmatic Teams

- Small, autonomous teams
- Quality is everyone's responsibility
- Communicate clearly and frequently
- Shared code ownership
- Pair programming on complex problems
- Regular retrospectives
- Knowledge sharing across team

### The Pragmatic Starter Kit

**Version Control:** Always use version control. Commit early, commit often. Write meaningful commit messages. Use branching strategies appropriate for your team. Never commit generated files.

**Automated Testing:** Unit tests for individual components. Integration tests for component interactions. Regression tests for existing functionality. Performance tests for requirements. Test early, test often. Automate everything you can.

**Documentation:** Document why, not what. Keep documentation close to the code. Use automated documentation tools. Write for your audience. Update documentation as code changes.

---

## Five — Error Handling

| Error | Recovery |
|-------|----------|
| DRY violation found but extraction seems risky | Extract incrementally; test after each extraction |
| Spike exceeds time limit | Reset; the question was not answered; scope down further |
| Coupling too deep to break at once | Break the most critical dependencies first; use Mikado method for the rest |
| "Good enough" criteria unclear | Ask the user to define minimum acceptable quality |
| Technical debt accumulating faster than it's being paid down | Prioritize debt items by risk/impact; allocate fixed percentage of time |
| Team doesn't adopt pragmatic practices | Start with Stone Soup — demonstrate value, don't mandate |

---

## Six — Key Rules

| ID | Rule |
|----|------|
| **HR-1** | DRY is non-negotiable |
| **HR-2** | No tightly coupled components without interfaces |
| **HR-3** | Starter Kit mandatory (VCS, tests, docs) |
| **HR-4** | Pencil before pen — design first |
| **HR-5** | Address technical debt before crises |
| **HR-6** | Spikes timeboxed; throw away spike code |
| **HR-7** | Define "good enough" upfront |
| **HR-8** | Tracer bullets for new features |
| **DRY** | Single source of truth for every piece of knowledge |
| **ORTHO** | Components independent; changes don't propagate |
| **TRACER** | Thin end-to-end slice first |
| **SPIKE** | Timeboxed exploration; throw away code |
| **DEBUG** | Reproduce → Hypothesize → Test → Fix → Verify → Document |
| **STARTER** | VCS + Tests + Documentation always |

---

## Seven — Evidence & Checklist

**Pre-Delivery Checklist:**

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

**Gate Implications:**

| Gate | Condition |
|------|-----------|
| **BLOCK** | Knowledge is duplicated across the system (DRY violation) |
| **BLOCK** | Components are tightly coupled without interfaces |
| **BLOCK** | No version control or testing infrastructure |
| **BLOCK** | Design was not planned before implementation |
| **BLOCK** | Technical debt is accumulating without tracking |
| **WARN** | Some duplication exists but is documented and justified |
| **WARN** | Coupling is moderate but manageable |
| **WARN** | Testing coverage is improving but not comprehensive |
| **WARN** | Documentation is partial but covers critical paths |

**Evidence Required:**

- DRY compliance check (knowledge duplication identified and resolved)
- Orthogonality analysis (component dependencies mapped)
- Tracer bullet implementation (end-to-end slice working)
- Design artifacts (sketches, CRC cards, pseudocode)
- Starter kit verification (VCS, tests, docs in place)

---

## Reference Guides

| Topic | See |
|-------|-----|
| Fowler's refactoring techniques | `refactoring-catalog` skill |
| Clean Code principles | `clean-code-review` skill |
| Legacy code techniques | `legacy-code-workshop` skill |
| Metrics to quantify DRY violations, coupling | `software-metrics-quality` skill |
| Detailed test cases and examples | `references/condensed.md` |
