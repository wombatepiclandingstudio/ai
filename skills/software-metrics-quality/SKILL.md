---
name: software-metrics-quality
description: >
  Measure and improve software quality using industry-standard metrics. Analyze code
  complexity (cyclomatic complexity, CK metrics), maintainability (Halstead, MI),
  and structural quality (ISO 25010). Get a prioritized report with risk hotspots,
  quality gates, CI integration guidance, and language-specific considerations.
  Includes Fagan code inspection process and common pitfalls across refactoring,
  testing, design, code review, estimation, and architecture.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [metrics, quality, code-quality, complexity-analysis, maintainability, fagan, iso-25010, cyclomatic-complexity]
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

The Chidamber and Kemerer (CK) metrics suite measures class complexity, inheritance, coupling, and cohesion.

| Metric | What It Measures | Low Risk | Moderate | High Risk | Action |
|--------|-----------------|----------|----------|-----------|--------|
| **WMC** | Sum of method complexities | < 20 | 20–40 | > 40 | Split complex classes |
| **DIT** | Max inheritance depth | ≤ 5 | 5–7 | > 7 | Consider composition |
| **NOC** | Direct subclasses | ≤ 3 | 3–6 | > 6 | Class may be too general |
| **CBO** | Coupled classes | ≤ 5 | 5–9 | > 9 | Decouple with interfaces |
| **RFC** | Executable response set | ≤ 47 | 47–75 | > 75 | More test paths |
| **LCOM** | Method dissimilarity | ≤ 10 | 10–30 | > 30 | Extract focused classes |

See `references/metrics-reference.md` for formulas and derivation.

---

## 2. Cyclomatic Complexity (McCabe)

`M = D + 1` (D = decision points). M = minimum test cases for branch coverage.

| Risk | Value | Meaning |
|------|-------|---------|
| Low | 1–10 | Simple, little risk |
| Moderate | 11–20 | More complex |
| High | 21–50 | Complex, high risk |
| Very High | > 50 | Untestable |

---

## 3. Halstead Complexity Measures

Measures complexity via operators and operands. Key outputs: Volume (code size), Difficulty (cognitive load), Effort (mental effort), Predicted Bugs.

See `references/metrics-reference.md` for the 8 basic metrics and formulas.

---

## 4. Maintainability Index (MI)

`MI = max(0, (171 - 5.2×ln(HV) - 0.23×CC - 16.2×ln(LOC)) × 100 / 171)`

| MI Value | Quality | Action |
|----------|---------|--------|
| ≥ 80 | High (green) | Maintain |
| 60–79 | Moderate (yellow) | Monitor |
| 20–59 | Low (orange) | Refactor |
| < 20 | Very low (red) | Immediate action |

---

## 5. Fagan Code Inspection Process

Developed by Michael Fagan at IBM (1976). Formal defect discovery process finding 60-65% of defects.

**6 Phases:** Planning → Overview → Preparation → Inspection Meeting → Rework → Follow-up

**Roles:** Moderator (process coach), Author (performs rework), Reader (paraphrases code), Inspector (finds defects), Recorder (documents defects)

**Effectiveness:** Fagan Inspections find 60–65% of defects vs. < 50% for informal reviews vs. ~30% for most testing methods.

**Key Metrics:** Defect Density, Inspection Rate (optimal: 200-400 LOC/hour), Defect Detection Rate, First-pass Yield.

See `references/metrics-reference.md` for entry/exit criteria and detailed role responsibilities.

---

## 6. ISO 9126 / ISO 25010 Quality Model

**ISO 9126 (1991):** Functionality, Reliability, Usability, Efficiency, Maintainability, Portability

**ISO 25010 (2011 — successor):** Adds Security, Compatibility; expands Usability and Maintainability

**Quality Chain:** Internal Quality → External Quality → Quality-in-use

Map your analysis to these characteristics to ensure comprehensive quality assessment.

---

## 7. Common Pitfalls to Avoid

Check for anti-patterns across six categories:

- **Refactoring:** Without tests, big-bang, mixing features, ignoring smells, premature optimization
- **Testing:** Happy-path-only, brittle tests, ignoring non-functional, no regression strategy
- **Design:** God object, tight coupling, over-engineering, premature abstraction, copy-paste
- **Code Review:** Rubber-stamping, >400 LOC/hour, style over substance, personal attacks
- **Estimation:** Anchoring bias, single-point estimates, not learning from history
- **Architecture:** Premature optimization, over-architecture, technology-driven, distributed monolith

See `references/pitfalls.md` for detailed descriptions and prevention strategies.

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

## Test Cases

### Test Case 1: Cyclomatic complexity analysis
**Input:** A function with 3 nested if-statements, 2 while loops, and 1 switch with 4 cases.
**Expected output:** Cyclomatic complexity calculation: D = 3 (ifs) + 2 (whiles) + 4 (switch cases) = 9 decision points, M = 9 + 1 = 10. Risk classification: Low (1-10). Recommendation: acceptable complexity, but monitor if it grows.
**Assertion:** CC calculation is correct (M = 10). Risk level matches the threshold table (Low).

### Test Case 2: Maintainability Index calculation
**Input:** A file with 500 LOC, cyclomatic complexity of 25, and Halstead volume of 2000.
**Expected output:** MI calculation: MI = max(0, (171 - 5.2×ln(2000) - 0.23×25 - 16.2×ln(500)) × 100 / 171). Risk: Low MI (needs refactoring). Action: prioritize for refactoring.
**Assertion:** MI formula is applied correctly. Action matches the MI threshold table.

### Test Case 3: Pitfall detection
**Input:** A team that refactors code while simultaneously adding new features, tests only happy paths, and has no regression strategy.
**Expected output:** Identification of 3 pitfalls: (1) Refactoring + features simultaneously, (2) Testing only happy paths, (3) No regression strategy. Each with prevention recommendation.
**Assertion:** All 3 pitfalls are identified from the pitfalls reference. Each includes a specific prevention strategy.
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


