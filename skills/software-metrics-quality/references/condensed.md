# Software Metrics & Quality (condensed)

Condensed version of `SKILL.md` for tools that do not natively read the Agent Skills
`SKILL.md` format. Point your tool's memory/instructions file (e.g. `AGENTS.md`,
`CLAUDE.md`, `GEMINI.md`, `.windsurferules`) at this content. Canonical source: `SKILL.md`.

## Trigger Phrases

- "metrics", "complexity", "maintainability", "CK metrics", "cyclomatic complexity"
- "Halstead", "Fagan inspection", "quality model", "ISO 9126", "quality standards"

## When to Use

- Measuring code complexity or maintainability
- Evaluating object-oriented design quality
- Planning or conducting code inspections
- Establishing quality standards or thresholds
- Assessing software against industry benchmarks

## Do Not Use When

- User wants code review for clean code (use `clean-code-review`)
- User wants refactoring guidance (use `refactoring-catalog`)
- User wants legacy code techniques (use `legacy-code-workshop`)
- Request is purely about writing new features

## Core Metrics

| Metric | Formula / Threshold | Action |
|--------|-------------------|--------|
| **CK: WMC** | < 20 Low, 20–40 Moderate, > 40 High | Split complex classes |
| **CK: DIT** | ≤ 5 Low, 5–7 Moderate, > 7 High | Consider composition |
| **CK: NOC** | ≤ 3 Low, 3–6 Moderate, > 6 High | Class may be too general |
| **CK: CBO** | ≤ 5 Low, 5–9 Moderate, > 9 High | Decouple with interfaces |
| **CK: RFC** | ≤ 47 Low, 47–75 Moderate, > 75 High | More test paths |
| **CK: LCOM** | ≤ 10 Low, 10–30 Moderate, > 30 High | Extract focused classes |
| **Cyclomatic CC** | M = D + 1; 1–10 Low, 11–20 Moderate, 21–50 High, > 50 Very High | Refactor at high risk |
| **MI** | ≥ 80 Green, 60–79 Yellow, 20–59 Orange, < 20 Red | Refactor below 60 |
| **Halstead** | Volume, Difficulty, Effort, Predicted Bugs per module | See `references/metrics-reference.md` |

## Fagan Inspection

6 Phases: Planning → Overview → Preparation → Inspection Meeting → Rework → Follow-up

Roles: Moderator, Author, Reader, Inspector, Recorder

Effectiveness: 60–65% defect detection vs. < 50% informal reviews vs. ~30% testing.

Optimal inspection rate: 200–400 LOC/hour.

## Pipeline

1. **CK Metrics** — WMC, DIT, NOC, CBO, RFC, LCOM per class
2. **Cyclomatic Complexity** — M = D + 1 per function
3. **Halstead Metrics** — Volume, Difficulty, Effort per module
4. **Maintainability Index** — MI per file
5. **Fagan Inspection** — Formal inspection for high-risk code
6. **ISO Assessment** — Map to ISO 9126/25010 quality characteristics

## Hard Rules

> **HR-1.** Cyclomatic complexity must be calculated using the decision-point formula (M = D + 1), not estimated.

> **HR-2.** When CK metric exceeds high-risk threshold, gate must BLOCK with specific remediation action.

> **HR-3.** Every metric recommendation must include a concrete next step.

> **HR-4.** Gate reviews must not be skipped; document skip as risk.

> **HR-5.** Report metrics per-class (CK), per-function (CC), per-file (MI), per-module (Halstead).

## Gate (BLOCK)

- Any CK metric exceeds high-risk threshold without justification
- Cyclomatic complexity > 50 (untestable)
- MI < 20 (very low maintainability)
- Critical code has not been inspected
- Common pitfalls are actively present

## Gate (WARN)

- CK metrics at moderate risk levels
- Cyclomatic complexity 21–50 (needs monitoring)
- MI 20–59 (needs refactoring)
- Some inspection phases skipped for non-critical code

## Checklist

- [ ] CK metrics calculated for all classes
- [ ] Cyclomatic complexity measured for all functions
- [ ] Halstead metrics computed where applicable
- [ ] Maintainability Index calculated per file
- [ ] Threshold violations identified and prioritized
- [ ] ISO 9126/25010 characteristics assessed
- [ ] Common pitfalls checked against current practices
- [ ] Recommendations prioritized by risk
