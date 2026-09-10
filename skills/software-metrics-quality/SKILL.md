---
name: software-metrics-quality
description: >
  Measure and improve software quality using industry-standard metrics. Analyze code
  complexity (cyclomatic complexity, CK metrics), maintainability (Halstead, MI),
  and structural quality (ISO 25010). Get a prioritized report with risk hotspots,
  quality gates, CI integration guidance, and language-specific considerations.
  Includes Fagan code inspection process and common pitfalls across refactoring,
  testing, design, code review, estimation, and architecture.
---

Applies quantitative software engineering metrics and structured quality processes to evaluate, monitor, and improve software quality. Covers the CK metrics suite, complexity metrics, maintainability measurement, formal inspection processes, quality models, and common pitfalls to avoid.

## Section Zero: Core Concepts

The Chidamber and Kemerer (CK) metrics suite measures class complexity, inheritance, coupling, and cohesion across six dimensions: WMC, DIT, NOC, CBO, RFC, LCOM.

Cyclomatic complexity (McCabe): `M = D + 1` where D = decision points. M = minimum test cases for branch coverage.

Maintainability Index: `MI = max(0, (171 - 5.2×ln(HV) - 0.23×CC - 16.2×ln(LOC)) × 100 / 171)`

Halstead Complexity Measures: 8 basic metrics derived from operators and operands (Volume, Difficulty, Effort, Predicted Bugs, etc.).

Fagan Code Inspection: 6-phase formal defect discovery process finding 60–65% of defects. Roles: Moderator, Author, Reader, Inspector, Recorder.

ISO 25010 (successor to ISO 9126): Quality model with characteristics — Functionality, Reliability, Usability, Efficiency, Maintainability, Portability, Security, Compatibility. Quality Chain: Internal Quality → External Quality → Quality-in-use.

See `references/metrics-reference.md` for formulas, derivation, and threshold details.

## Section One: When to Use

- Measuring code complexity or maintainability
- Evaluating object-oriented design quality
- Planning or conducting code inspections
- Establishing quality standards or thresholds
- Assessing software against industry benchmarks
- The user mentions "metrics," "complexity," "maintainability," "CK metrics," "cyclomatic complexity," "Halstead," "Fagan inspection," "quality model," "ISO 9126," or "quality standards"

## Section Two: Do Not Use

- The user wants code review for clean code (use `clean-code-review`)
- The user wants refactoring guidance (use `refactoring-catalog`)
- The user wants legacy code techniques (use `legacy-code-workshop`)
- The request is purely about writing new features

## Section Three: Hard Rules

> **HR-1.** Cyclomatic complexity must be calculated using the decision-point formula (M = D + 1), not estimated by feel.

> **HR-2.** When any CK metric exceeds high-risk threshold, the gate must BLOCK with a specific remediation action, not a generic warning.

> **HR-3.** Every metric recommendation must include a concrete next step — never report a metric without an action.

> **HR-4.** Gate reviews must not be skipped even if the user requests it; document the skip as a risk.

> **HR-5.** Metrics must be reported per-class for CK, per-function for cyclomatic complexity, per-file for MI, and per-module for Halstead.

## Section Four: Decision Trees

```
Cyclomatic Complexity Assessment
├── M = D + 1 (count decision points)
├── M 1–10 → Low risk → Acceptable, monitor if growing
├── M 11–20 → Moderate risk → Flag for review, add test cases
├── M 21–50 → High risk → BLOCK, refactor required
└── M > 50 → Very high risk → BLOCK, immediate action, code is untestable

Maintainability Index Assessment
├── MI ≥ 80 → High (green) → Maintain
├── MI 60–79 → Moderate (yellow) → Monitor, schedule improvements
├── MI 20–59 → Low (orange) → BLOCK, prioritize for refactoring
└── MI < 20 → Very low (red) → BLOCK, immediate action required

CK Metric Risk Classification
├── WMC < 20 → Low | 20–40 → Moderate | > 40 → High → Split complex classes
├── DIT ≤ 5 → Low | 5–7 → Moderate | > 7 → High → Consider composition
├── NOC ≤ 3 → Low | 3–6 → Moderate | > 6 → High → Class may be too general
├── CBO ≤ 5 → Low | 5–9 → Moderate | > 9 → High → Decouple with interfaces
├── RFC ≤ 47 → Low | 47–75 → Moderate | > 75 → High → More test paths
└── LCOM ≤ 10 → Low | 10–30 → Moderate | > 30 → High → Extract focused classes
```

## Section Five: Pipeline

The analysis follows six stages:

1. **CK Metrics** — Calculate WMC, DIT, NOC, CBO, RFC, LCOM for all classes. Classify each against risk thresholds.
2. **Cyclomatic Complexity** — Measure M = D + 1 for every function. Classify risk level.
3. **Halstead Metrics** — Compute Volume, Difficulty, Effort, Predicted Bugs per module.
4. **Maintainability Index** — Calculate MI per file using the formula. Classify as green/yellow/orange/red.
5. **Fagan Inspection** — For high-risk code, conduct formal inspection with defined roles and entry/exit criteria.
6. **ISO Assessment** — Map analysis to ISO 9126/25010 quality characteristics for comprehensive coverage.

See `references/metrics-reference.md` for entry/exit criteria and detailed role responsibilities.

## Section Six: Error Handling

| Condition | Action |
|-----------|--------|
| Any CK metric exceeds high-risk threshold without justification | **BLOCK** |
| Cyclomatic complexity > 50 (untestable) | **BLOCK** |
| MI < 20 (very low maintainability) | **BLOCK** |
| Critical code has not been inspected | **BLOCK** |
| Common pitfalls are actively present | **BLOCK** |
| CK metrics at moderate risk levels | **WARN** |
| Cyclomatic complexity 21–50 (needs monitoring) | **WARN** |
| MI 20–59 (needs refactoring) | **WARN** |
| Some inspection phases skipped for non-critical code | **WARN** |

## Section Seven: Key Rules

1. **Metrics without action are noise.** Every reported metric must include a recommended next step.
2. **Thresholds are starting points.** Adjust based on context (critical system vs. internal tool).
3. **Fagan inspections are for high-risk code only.** Don't inspect everything — target the worst offenders first.
4. **Pitfalls are preventive.** Check for anti-patterns across six categories: Refactoring, Testing, Design, Code Review, Estimation, Architecture.

See `references/pitfalls.md` for detailed descriptions and prevention strategies.

## Section Eight: Evidence & Checklist

**Deliverables:**

- CK metrics report (WMC, DIT, NOC, CBO, RFC, LCOM per class)
- Cyclomatic complexity report (per function)
- Halstead metrics report (per module)
- Maintainability Index report (per file)
- ISO 9126/25010 quality assessment
- Pitfalls analysis with recommendations
- Prioritized action plan

**Checklist:**

- [ ] CK metrics calculated for all classes
- [ ] Cyclomatic complexity measured for all functions
- [ ] Halstead metrics computed where applicable
- [ ] Maintainability Index calculated per file
- [ ] Threshold violations identified and prioritized
- [ ] ISO 9126/25010 characteristics assessed
- [ ] Common pitfalls checked against current practices
- [ ] Recommendations prioritized by risk

---

## Reference Guides

| Guide | Location | Contents |
|-------|----------|----------|
| Metrics Reference | `references/metrics-reference.md` | Formulas, derivation, entry/exit criteria, role responsibilities |
| Pitfalls Reference | `references/pitfalls.md` | Detailed descriptions and prevention strategies for anti-patterns |
| Tools Reference | `references/tools.md` | SonarQube, NDepend, Checkstyle, CodeClimate, Understand, Visual Studio — metrics supported |
