# Metrics Reference — Software Metrics & Quality

## CK Object-Oriented Metrics

### WMC — Weighted Methods per Class
Sum of complexities of all methods: `WMC = Σ ci`
| Risk | Value |
|------|-------|
| Low | < 20 |
| Moderate | 20–40 |
| High | > 40 |

### DIT — Depth of Inheritance Tree
Max length from class to root: `DIT = max(length to root)`
| Risk | Value |
|------|-------|
| Low | ≤ 5 |
| Moderate | 5–7 |
| High | > 7 |

### NOC — Number of Children
Direct subclasses: `NOC = count(direct subclasses)`
| Risk | Value |
|------|-------|
| Low | ≤ 3 |
| Moderate | 3–6 |
| High | > 6 |

### CBO — Coupling Between Objects
Other classes referenced: `CBO = count(other classes referenced)`
| Risk | Value |
|------|-------|
| Low | ≤ 5 |
| Moderate | 5–9 |
| High | > 9 |

### RFC — Response For a Class
Methods that can execute in response to a message: `RFC = |R1| + |R2|`
| Risk | Value |
|------|-------|
| Low | ≤ 47 |
| Moderate | 47–75 |
| High | > 75 |

### LCOM — Lack of Cohesion of Methods
Dissimilarity of methods by shared instance variables: `LCOM = max(P - Q, 0)`
| Risk | Value |
|------|-------|
| Low | ≤ 10 |
| Moderate | 10–30 |
| High | > 30 |

## Cyclomatic Complexity (McCabe)

`M = E - N + 2P` (simplified: `M = D + 1` where D = decision points)

| Risk | Value | Meaning |
|------|-------|---------|
| Low | 1–10 | Simple, little risk |
| Moderate | 11–20 | More complex |
| High | 21–50 | Complex, high risk |
| Very High | > 50 | Untestable |

M = minimum test cases needed for branch coverage.

## Halstead Complexity Measures

| Metric | Formula | What It Measures |
|--------|---------|-----------------|
| η | η1 + η2 | Vocabulary size |
| N | N1 + N2 | Program length |
| V | N × log₂(η) | Information content |
| D | (η1/2) × (N2/η2) | Cognitive difficulty |
| E | D × V | Mental effort |
| B | E^(2/3) / 3000 | Predicted bugs |

## Maintainability Index

`MI = max(0, (171 - 5.2×ln(HV) - 0.23×CC - 16.2×ln(LOC)) × 100 / 171)`

| MI Value | Quality | Action |
|----------|---------|--------|
| ≥ 80 | High (green) | Maintain |
| 60–79 | Moderate (yellow) | Monitor |
| 20–59 | Low (orange) | Refactor |
| < 20 | Very low (red) | Immediate action |

## Fagan Code Inspection

6 phases: Planning → Overview → Preparation → Inspection Meeting → Rework → Follow-up

Roles: Moderator, Author, Reader, Inspector, Recorder

| Method | Defect Discovery Rate |
|--------|----------------------|
| Fagan Inspections | 60–65% |
| Informal Inspections | < 50% |
| Most Testing Methods | ~ 30% |

## ISO 9126 / ISO 25010

### ISO 9126 (6 characteristics)
Functionality, Reliability, Usability, Efficiency, Maintainability, Portability

### ISO 25010 (8 characteristics — successor)
Functional Suitability, Performance Efficiency, Compatibility, Usability, Reliability, Security, Maintainability, Portability

Quality chain: Internal Quality → External Quality → Quality-in-use
