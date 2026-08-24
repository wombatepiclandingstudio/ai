---
name: software-metrics-quality
description: >
  Apply software engineering metrics and quality processes: CK object-oriented metrics (WMC,
  DIT, NOC, CBO, RFC, LCOM), cyclomatic complexity, Halstead complexity measures, maintainability
  index, Fagan code inspection process, ISO 9126/25010 quality model, and common pitfalls to
  avoid. Use when measuring code complexity, evaluating maintainability, planning code inspections,
  establishing quality standards, or assessing software quality against industry benchmarks.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [metrics, quality, ck-metrics, cyclomatic-complexity, halstead, maintainability, fagan, iso-9126, iso-25010, inspection, pitfalls]
---

# Software Metrics & Quality Skill

Applies quantitative software engineering metrics and structured quality processes to
evaluate, monitor, and improve software quality. Covers the CK metrics suite, complexity
metrics, maintainability measurement, formal inspection processes, quality models, and
common pitfalls to avoid.

## Use when

- Measuring code complexity or maintainability
- Evaluating object-oriented design quality
- Planning or conducting code inspections
- Establishing quality standards or thresholds
- Assessing software against industry benchmarks
- The user mentions "metrics," "complexity," "maintainability," "CK metrics," "cyclomatic
  complexity," "Halstead," "Fagan inspection," "quality model," "ISO 9126," or "quality standards"

## Do not use when

- The user wants code review for clean code (use clean-code-review)
- The user wants refactoring guidance (use refactoring-catalog)
- The user wants legacy code techniques (use legacy-code-workshop)
- The request is purely about writing new features

---

## 1. CK Object-Oriented Metrics

The Chidamber and Kemerer (CK) metrics suite (1994) measures class complexity, inheritance,
coupling, and cohesion.

### WMC — Weighted Methods per Class

**What:** Sum of complexities of all methods in a class.

**Formula:**
```
WMC = Σ ci (i = 1 to n)
```
Where `ci` is the complexity of method `i` (often cyclomatic complexity), `n` is method count.

**Thresholds:**
| Risk | Value |
|------|-------|
| Low | WMC < 20 |
| Moderate | 20 ≤ WMC ≤ 40 |
| High | WMC > 40 |

**Action:** High WMC → class is complex, hard to maintain; split into multiple classes.

---

### DIT — Depth of Inheritance Tree

**What:** Maximum length from a class to the root of the inheritance tree.

**Formula:**
```
DIT = max(length from class to root)
```

**Thresholds:**
| Risk | Value |
|------|-------|
| Low | DIT ≤ 5 |
| Moderate | 5 < DIT ≤ 7 |
| High | DIT > 7 |

**Action:** Deep inheritance → harder to predict behavior; consider composition over inheritance.

---

### NOC — Number of Children

**What:** Immediate number of subclasses directly inheriting from a class.

**Formula:**
```
NOC = count(direct subclasses)
```

**Thresholds:**
| Risk | Value |
|------|-------|
| Low | NOC ≤ 3 |
| Moderate | 3 < NOC ≤ 6 |
| High | NOC > 6 |

**Action:** High NOC → class may be too general; increases testing complexity.

---

### CBO — Coupling Between Objects

**What:** Number of other classes to which a class is coupled (uses or is used by).

**Formula:**
```
CBO = count(other classes referenced)
```

**Thresholds:**
| Risk | Value |
|------|-------|
| Low | CBO ≤ 5 |
| Moderate | 5 < CBO ≤ 9 |
| High | CBO > 9 |

**Action:** High coupling → harder to maintain, test, and reuse; decouple with interfaces.

---

### RFC — Response For a Class

**What:** Number of methods that can be executed in response to a message (method set + methods potentially called).

**Formula:**
```
RFC = |R1| + |R2|
```
Where `R1` = methods defined in the class, `R2` = methods called by R1.

**Thresholds:**
| Risk | Value |
|------|-------|
| Low | RFC ≤ 47 |
| Moderate | 47 < RFC ≤ 75 |
| High | RFC > 75 |

**Action:** High RFC → more execution paths to test; increases testing effort.

---

### LCOM — Lack of Cohesion of Methods

**What:** Dissimilarity of methods in a class, measured by shared instance variables.

**Formula (LCOM1):**
```
LCOM = max(P - Q, 0)
```
Where `P` = method pairs that do NOT share instance variables, `Q` = pairs that share at least one.

**Thresholds:**
| Risk | Value |
|------|-------|
| Low | LCOM ≤ 10 |
| Moderate | 10 < LCOM ≤ 30 |
| High | LCOM > 30 |

**Action:** High LCOM → class doing too many unrelated things; refactor into focused classes.

---

## 2. Cyclomatic Complexity (McCabe)

Measures structural complexity by counting linearly independent paths through source code.

### Formulas

**Primary:**
```
M = E - N + 2P
```
Where `E` = edges, `N` = nodes, `P` = connected components (typically 1).

**Simplified (single function, P=1):**
```
M = E - N + 2
```

**Decision-point counting:**
```
M = D + 1
```
Where `D` = number of decision points (if, while, for, case, &&, ||, etc.).

### Thresholds

| Risk | Value | Meaning |
|------|-------|---------|
| Low | 1-10 | Simple, little risk |
| Moderate | 11-20 | More complex, moderate risk |
| High | 21-50 | Complex, high risk |
| Very High | >50 | Untestable, very high risk |

### Modified Cyclomatic Complexity

Count each Boolean operator (&&, ||) as a separate decision point for more accurate measurement.

### Key Insight

M = **minimum number of test cases** needed for branch coverage.

---

## 3. Halstead Complexity Measures

Measures complexity based on operators and operands in source code.

### The 8 Basic Metrics

| Metric | Name | Formula |
|--------|------|---------|
| η1 | Distinct operators | Direct count |
| η2 | Distinct operands | Direct count |
| N1 | Total operators | Direct count |
| N2 | Total operands | Direct count |
| η | Vocabulary | η1 + η2 |
| N | Program Length | N1 + N2 |
| V | Volume | N × log₂(η) |
| D | Difficulty | (η1/2) × (N2/η2) |
| E | Effort | D × V |
| T | Time Required | E / 18 seconds |
| B | Delivered Bugs | E^(2/3) / 3000 |

### What They Measure

- **Volume:** Code size/information content (bits to store)
- **Difficulty:** Cognitive difficulty to understand
- **Effort:** Mental effort required to implement
- **Bugs:** Predicted defects

### Key Relationships

- Difficulty × Volume = Effort
- Effort is proportional to predicted bugs
- Higher values = more complex, error-prone code

---

## 4. Maintainability Index (MI)

Combines cyclomatic complexity, Halstead volume, and lines of code into a single score.

### Formula (Coleman et al.)

```
MI = 171 - 5.2×ln(HV) - 0.23×CC - 16.2×ln(LOC)
```

### Normalized (Microsoft/SEI)

```
MI = max(0, (171 - 5.2×ln(HV) - 0.23×CC - 16.2×ln(LOC)) × 100 / 171)
```

### Thresholds

| MI Value | Quality | Action |
|----------|---------|--------|
| ≥ 80 | High (green) | Maintain |
| 60-79 | Moderate (yellow) | Monitor |
| 20-59 | Low (orange) | Refactor |
| < 20 | Very low (red) | Immediate action |

### SEI Maintainability Model

Uses 4 sub-characteristics:
1. **Understandability** — ease of comprehending the code
2. **Analyzability** — ease of diagnosing deficiencies
3. **Modifiability** — ease of modifying the code
4. **Testability** — ease of creating test criteria

---

## 5. Fagan Code Inspection Process

Developed by Michael Fagan at IBM (1976). Formal defect discovery process finding 60-65% of defects.

### The 6 Phases

| Phase | Description |
|-------|-------------|
| **1. Planning** | Prepare materials, assign roles, ensure entry criteria met |
| **2. Overview** | Author walks through code; group education on materials |
| **3. Preparation** | Individual review; each participant notes defects |
| **4. Inspection Meeting** | Reader paraphrases code; inspectors find defects; recorder documents |
| **5. Rework** | Author resolves defects; only author makes changes |
| **6. Follow-up** | Moderator verifies all defects corrected; no new defects introduced |

### Roles

| Role | Responsibilities |
|------|-----------------|
| **Moderator** | Process coach; ensures quality; verifies rework |
| **Author** | Wrote the code; answers questions; performs rework |
| **Reader** | Paraphrases code line by line during meeting |
| **Inspector** | Reviews from testing standpoint; finds defects |
| **Recorder** | Documents all defects; maintains defect log |

### Entry Criteria

- Code is complete and self-consistent
- Author has reviewed and is satisfied
- Supporting materials (standards, specs) available
- Materials distributed with sufficient preparation time

### Exit Criteria

- All identified defects corrected
- No new defects introduced during rework
- All defects classified and logged
- Metrics recorded
- Moderator confirms quality standard met

### Metrics Tracked

| Metric | Description |
|--------|-------------|
| **Defect Density** | Defects per KLOC or per page |
| **Inspection Rate** | LOC/hour (optimal: 200-400) |
| **Defect Detection Rate** | % of total defects found |
| **First-pass Yield** | % passing without re-inspection |

### Effectiveness

| Method | Defect Discovery Rate |
|--------|----------------------|
| Fagan Inspections | 60-65% |
| Informal Inspections | < 50% |
| Most Testing Methods | ~ 30% |

---

## 6. ISO 9126 / ISO 25010 Quality Model

### ISO 9126 (1991) — 6 Characteristics

| Characteristic | Definition | Sub-characteristics |
|---------------|------------|-------------------|
| **Functionality** | Functions satisfy stated needs | Suitability, Accuracy, Interoperability, Security |
| **Reliability** | Maintains performance under stated conditions | Maturity, Fault tolerance, Recoverability |
| **Usability** | Effort needed for use | Understandability, Learnability, Operability, Attractiveness |
| **Efficiency** | Performance vs. resources used | Time behaviour, Resource utilization |
| **Maintainability** | Effort needed for modifications | Analyzability, Changeability, Stability, Testability |
| **Portability** | Ability to be transferred | Adaptability, Installability, Co-existence, Replaceability |

### ISO 25010 (2011) — 8 Characteristics (Successor)

| Characteristic | Changes from 9126 |
|---------------|-------------------|
| **Functional Suitability** | Renamed; added Functional completeness |
| **Performance Efficiency** | Renamed; added Capacity |
| **Compatibility** | NEW; includes Co-existence + Interoperability |
| **Usability** | Added User error protection, Accessibility |
| **Reliability** | Added Availability |
| **Security** | NEW; Confidentiality, Integrity, Non-repudiation, Accountability, Authenticity |
| **Maintainability** | Added Modularity, Reusability |
| **Portability** | Co-existence moved to Compatibility |

### Quality Chain

```
Internal Quality → External Quality → Quality-in-use
```

- **Internal metrics:** Static measures (code complexity, size, structure)
- **External metrics:** Dynamic measures (performance, reliability)
- **Quality-in-use metrics:** Real operational conditions

---

## 7. Common Pitfalls to Avoid

### Refactoring Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| Refactoring without tests | No safety net for changes | Ensure test coverage first |
| Refactoring + features simultaneously | Mixing concerns makes debugging hard | Do one at a time |
| Big-bang refactoring | Rewriting entire systems at once | Incremental, small steps |
| Ignoring code smells | Tolerating "good enough" | Address smells on contact |
| Premature optimization | Optimizing while restructuring | Focus on clarity first |
| Not understanding original design | Changing without understanding why | Study before changing |

### Testing Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| Testing only happy paths | Missing edge cases | Test boundary conditions |
| Brittle tests | Tests coupled to implementation | Test behavior, not structure |
| Ignoring non-functional testing | Only functional correctness | Include performance, security |
| Manual repetitive testing | Slow feedback loops | Automate regression tests |
| No regression strategy | Assuming fixes don't break | Maintain regression suites |

### Design Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| God object | Single class doing everything | Apply SRP |
| Tight coupling | Direct dependencies everywhere | Use DI, interfaces |
| Over-engineering | Building for hypothetical futures | YAGNI |
| Premature abstraction | Abstracting before understanding | Let patterns emerge |
| Copy-paste programming | Duplicating code | Apply DRY |

### Code Review Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| Rubber-stamping | Approving without review | Take time to review |
| Too much code at once | >400 LOC/hour drops detection | Break into chunks |
| Style over substance | Debating formatting | Use formatters; focus on logic |
| Personal attacks | Making reviews hostile | Focus on code, not person |

### Estimation Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| Anchoring bias | First estimate dominates | Use multiple techniques |
| Optimism bias | Underestimating complexity | Add buffers |
| Single point estimates | One number, false precision | Use three-point estimates |
| Not learning from history | Repeating mistakes | Track actual vs. estimated |

### Architecture Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| Premature optimization | Optimizing before requirements | Profile first |
| Over-architecture | Elaborate frameworks for simple apps | Start simple |
| Technology-driven | Choosing tech before requirements | Let requirements drive |
| Distributed monolith | Microservices that must deploy together | Ensure independence |

---

## Pre-Delivery Checklist

Before declaring metrics analysis complete:

- [ ] CK metrics calculated for all classes
- [ ] Cyclomatic complexity measured for all functions
- [ ] Halstead metrics computed where applicable
- [ ] Maintainability Index calculated per file
- [ ] Threshold violations identified and prioritized
- [ ] ISO 9126/25010 characteristics assessed
- [ ] Common pitfalls checked against current practices
- [ ] Recommendations prioritized by risk

---

## Gate Implications

Gate must **BLOCK** when:

- Any CK metric exceeds high-risk threshold without justification
- Cyclomatic complexity > 50 (untestable)
- MI < 20 (very low maintainability)
- Critical code has not been inspected
- Common pitfalls are actively present

Gate may **WARN** when:

- CK metrics at moderate risk levels
- Cyclomatic complexity 21-50 (needs monitoring)
- MI 20-59 (needs refactoring)
- Some inspection phases skipped for non-critical code

---

## Evidence Required

A metrics analysis should produce:

- CK metrics report (WMC, DIT, NOC, CBO, RFC, LCOM per class)
- Cyclomatic complexity report (per function)
- Halstead metrics report (per module)
- Maintainability Index report (per file)
- ISO 9126/25010 quality assessment
- Pitfalls analysis with recommendations
- Prioritized action plan

---

## Tools

| Tool | Metrics Supported |
|------|------------------|
| SonarQube | CC, MI, CK (partial), Halstead |
| NDepend | CK, CC, MI, Halstead |
| Checkstyle | CC, CK (with plugins) |
| CodeClimate | CC, duplication, complexity |
| Understand | Full CK, CC, Halstead, MI |
| Visual Studio | MI, CC |

---

## Related Skills

These skills work together with software metrics. Use the `software-engineering-analyst` agent
to orchestrate them as an integrated system.

| Skill | Connection |
|-------|------------|
| `refactoring-catalog` | Metrics tell you WHERE to refactor; Fowler's catalog tells you HOW |
| `clean-code-review` | Clean Code violations manifest as poor metrics (SOLID → CBO/LCOM) |
| `legacy-code-workshop` | Metrics quantify legacy code risk; Feathers' techniques reduce that risk |
| `pragmatic-development` | Metrics track the effectiveness of Pragmatic practices (DRY, orthogonality) |

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
bash install-skill.sh --tool claude --target /path/to/project --id software-metrics-quality
bash install-skill.sh --list-tools
```

For tools that do not read `SKILL.md` natively, point them at `references/condensed.md`.
