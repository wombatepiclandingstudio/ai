# Test Taxonomy & Automation Decisions

Reference for categorizing tests into the correct level and type, and for
deciding what to automate vs. keep manual.

## Test Level Taxonomy

### Level 1: Unit Testing

**What:** Tests the smallest independently testable entity — a function,
method, class, or module.

**Who writes:** Developers.

**Scope:** Single module in isolation. Dependencies are mocked or stubbed.

**When:** During coding, on every commit.

**Characteristics:**
- White-box: tester knows internal structure
- Fast execution (milliseconds)
- Run in developer's local environment
- No external dependencies (database, network, filesystem)
- Verifies isolated behavior against unit specifications

**Common mistakes:**
- Testing implementation details instead of behavior
- Mocking so much that the test proves nothing
- Writing tests that are too coupled to the code structure
- Skipping tests for "simple" code (simple code has bugs too)

### Level 2: Integration Testing

**What:** Tests how multiple modules work together — interfaces, data flow,
and communication between components.

**Who writes:** Developers and/or QA.

**Scope:** Multiple modules combined. Real interfaces, possibly stubbed
external dependencies.

**When:** After unit tests pass for the modules being integrated.

#### Sub-Types

| Strategy | How | When to Use | Pros | Cons |
|----------|-----|-------------|------|------|
| **Top-down** | Test from top modules, stub lower modules | Architecture-driven, UI-first validation | Early interface testing, logical flow visible | Stub development cost, lower-level defects found late |
| **Bottom-up** | Test from bottom modules, driver upper modules | Data-driven, database-first validation | Low-level defects found early | Driver development cost, top-level defects found late |
| **Sandwich** | Both top-down and bottom-up simultaneously | Large systems, parallel testing | Balanced coverage, faster | More complex to manage, more stubs/drivers |
| **Big-bang** | Integrate all modules at once, then test | Small systems, last resort | Simple to set up | Hard to isolate faults, system must be mostly complete |

**Key distinction from system testing:**
- Integration tests verify module interfaces and data flow between modules.
- Integration tests do NOT go through the full system stack (UI, middleware, database).
- If a test touches the UI to verify module interaction, it is system-level, not integration.

### Level 3: System Testing

**What:** End-to-end testing of the complete integrated system against
requirements.

**Who writes:** QA team.

**Scope:** Complete system, including UI, middleware, database, external
interfaces.

**When:** After integration testing completes.

#### Sub-Types

| Sub-Type | What | Risk if Skipped |
|----------|------|-----------------|
| **Functional** | Does the system do what the spec says | Wrong behavior ships |
| **Performance** | Response time, throughput under normal load | Slow system in production |
| **Stress** | Behavior under extreme load, breaking point | System crashes under peak |
| **Load** | Behavior under expected peak load | Performance degrades at scale |
| **Volume** | Large amounts of data | Data corruption, OOM |
| **Security** | Vulnerabilities, unauthorized access | Data breach, compliance |
| **Recovery** | Recovery after failure (crash, power loss) | Data loss, downtime |
| **Configuration** | Behavior across hardware/software configs | Breaks on specific envs |
| **Documentation** | Manuals match actual system behavior | User confusion, support burden |
| **Usability** | User experience evaluation | Poor adoption |
| **Regression** | Changes don't break existing functionality | Known features stop working |
| **Smoke** | Quick build verification — does it work at all? | Broken builds waste test time |
| **Sanity** | Focused verification after minor changes | Localized breakage missed |

### Level 4: Acceptance Testing

**What:** Business validation that the system meets its intended purpose.

**Who:** Business users, stakeholders, compliance officers.

**Scope:** System against business needs and contractual/regulatory criteria.

**When:** Before deployment, after system testing passes.

| Sub-Type | Who | Where | Purpose |
|----------|-----|-------|---------|
| **Alpha** | Internal staff / selected users | Developer's site | Early validation, catch major issues |
| **Beta** | Limited real users | User's site | Pre-release validation in real environment |
| **UAT** | Business users | Any | Business requirement verification |
| **Contract** | Contractual party | Any | Contractual acceptance criteria |
| **Regulatory** | Compliance officer | Any | Regulatory requirement verification |

## Cross-Cutting Test Types

These types apply across multiple levels:

| Type | Definition | Levels | Frequency |
|------|-----------|--------|-----------|
| **Regression** | Verify changes don't break existing | All | Every change |
| **Smoke** | Quick sanity — build works at all | System | Every build |
| **Sanity** | Focused post-change verification | System | After fixes |
| **Installation** | Verify install/uninstall works | System/Acceptance | Each release |

## Automation Decision Framework

### Decision Factors

| Factor | Automate | Keep Manual |
|--------|----------|-------------|
| **Frequency** | Run ≥3 times per release | Run once or rarely |
| **Stability** | Feature stable, unlikely to change | Feature new, evolving |
| **Determinism** | Clear pass/fail, no judgment | Subjective (usability, aesthetics) |
| **Data volume** | Large datasets, parameterized | Small, one-off |
| **Environment** | Stable, reproducible | Variable, hard to reproduce |
| **Time benefit** | Long-running, saves time | Quick, manual is faster |
| **Complexity** | Simple, repeatable steps | Complex exploratory scenarios |
| **Risk** | High-risk, needs frequent verification | Low-risk, occasional check |
| **ROI** | High manual cost × high frequency | Low manual cost or low frequency |

### Automation ROI Formula

```
ROI = (Manual cost per run × Number of runs) − (Automation development + Maintenance cost)
Break-even: When cumulative manual cost = automation cost
Typical break-even: 3–5 manual executions
```

### What to Automate (Priority Order)

| Priority | Category | Reason |
|----------|----------|--------|
| 1 | **Regression tests** | Repeated execution, deterministic, highest ROI |
| 2 | **Smoke tests** | Run every build, quick verification |
| 3 | **Data-driven tests** | Large parameter sets, tedious manual |
| 4 | **Performance/Load tests** | Impossible to do manually at scale |
| 5 | **API/Interface tests** | Stable interfaces, clear contracts |
| 6 | **Unit tests** | Developer-written, run on every commit |

### What to Keep Manual (Always)

| Category | Reason |
|----------|--------|
| **Usability testing** | Requires human judgment and perception |
| **Exploratory testing** | Simultaneous learning, design, and execution |
| **Ad-hoc testing** | Unstructured by nature |
| **New feature first pass** | Requirements still evolving, exploratory needed |
| **Documentation review** | Human comprehension and clarity judgment |
| **Accessibility testing (partial)** | Most needs human evaluation; some automated |

### What to Defer (Automate After Stabilization)

| Category | Reason |
|----------|--------|
| **New feature tests (first pass)** | Wait until feature is stable, then automate |
| **Edge cases (first pass)** | Design manually, automate after confirming they're needed |
| **Flaky tests** | Fix stability before automating |

### Automation Maintenance Cost

- 40–60% of total automation cost is maintenance.
- UI changes break capture-replay scripts.
- API changes break interface tests.
- Rule of thumb: budget 50% of initial automation cost annually for maintenance.
- ~50% of test automation initiatives fail to meet expectations due to
  unrealistic expectations, poor tool selection, or inadequate training.

### Test Automation Tools (Historical Context)

| Tool | Era | Type | Notes |
|------|-----|------|-------|
| WinRunner (Mercury) | 1992+ | Capture-replay, GUI | Industry leader; TSL scripting |
| TestDirector (Mercury) | 1992+ | Test management | Planning + execution + defects |
| Rational Robot | 1990s | Capture-replay | SQABasic scripting |
| SilkTest (Segue) | 1990s | Capture-replay | Enterprise GUI |
| LoadRunner (Mercury) | 1989+ | Performance | Load testing |
| JUnit | 1997 | Unit testing | xUnit revolution, open source |

## Categorization Rules

1. **Level = what is tested, not who tests it.** A developer testing the full
   system is doing system testing, not unit testing.
2. **Multi-module through UI = system-level.** Integration tests verify module
   interfaces without the full stack.
3. **Regression tests inherit the original test's level.** A regression version
   of a unit test stays at unit level.
4. **Every test must have exactly one level.** Straddling levels = unclear scope → split.
5. **Every test must have at least one type.** Functional is default; performance,
   security, etc. are additional types that may overlap.
6. **Smoke tests are system-level, regardless of who runs them.**
7. **Acceptance tests are the business user's responsibility.** Even if QA executes
   them, the test design and expected results come from business stakeholders.
