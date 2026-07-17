# Pre-Generated Input Guide

This document describes how to prepare and use pre-generated inputs to improve signal quality
in the capability extraction pipeline.

## Why Pre-Generated Inputs Help

The pipeline extracts signals from raw code. But specialized tools can produce higher-quality
signals with less noise. When available, these inputs reduce AI guesswork and improve accuracy.
They are never required — the pipeline works without them — but they make the output better.

## Package Structure Exports

### nDepend
Export the dependency matrix and metric views:
- **Dependency graph:** Shows which assemblies/namespaces depend on which.
- **Metric trend:** Package size, complexity, and coupling metrics over time.
- Use as input to A1.1 — replaces or supplements the manual package tree analysis.

### SonarQube
Export the project structure and dependency metrics:
- **Component tree:** Packages/modules with size and complexity measures.
- **Dependency matrix:** Inter-package dependency strengths.
- Use as input to A1.1.

### ArchUnit (Java)
If the project has ArchUnit tests, they encode architectural rules. Read these to understand
intended boundaries:
- `noClasses().that().resideInAPackage("..payment..").should().dependOnClassesThat()...`
- These rules reveal where the original architects intended boundaries.

## Database Schema Dumps

### DDL Exports
Provide the full DDL (CREATE TABLE, ALTER TABLE, foreign keys). This is the highest-quality
input for A1.2 because it includes explicit relationship information.

### ERD Tool Exports
Tools like pgAdmin, MySQL Workbench, DataGrip, or dbdiagram.io can export schema as:
- SQL DDL
- GraphML or DOT format (for visualization)
- JSON schema descriptions
Any of these work as input to A1.2.

### Migration Scripts
If no schema dump is available, the migration directory (Flyway, Liquibase, Prisma migrations)
serves as a chronological record of schema evolution. Read them in order — the evolution tells
you how the data model grew, which reveals business priorities over time.

## Entry Point Catalogs

### Swagger / OpenAPI Specs
An OpenAPI specification is the ideal input for A1.3. It provides:
- All endpoints with HTTP methods and paths
- Request/response schemas (revealing business entities)
- Grouping by tags (often aligns with business domains)
Read the spec file directly — no need to re-discover endpoints from code.

### API Gateway Configuration
If the system sits behind an API gateway (Kong, AWS API Gateway, NGINX), the route configuration
provides an authoritative list of exposed endpoints, including rate limits and authentication
requirements.

### IDE Analyzer Exports
JetBrains IDEs can export:
- **File structure:** Project view as a tree.
- **Usages:** Where each class/interface is used.
- **Call hierarchy:** Method-level call chains.

## Dependency Graphs

### Import Analysis
A simple import/dependency graph showing which packages import which. Can be generated with:
- **Java:** `jdeps` (JDK tool), or parsing import statements.
- **Python:** `pipdeptree`, `importlib` analysis.
- **JavaScript/TypeScript:** `madge`, `dependency-cruiser`.
- **Go:** `go mod graph`, `goda` for deeper analysis.
- **C#/.NET:** `dnSpy`, ILSpy, or Roslyn analyzers.

### Call Graphs
A call graph shows method-to-method invocation relationships. More precise than package-level
imports for understanding actual runtime dependencies. Tools:
- **Java:** Java Call Graph (JCG), Soot, WALA.
- **Python:** `pyan`, `pycg`.
- **JavaScript:** `esgraph`, `dependency-cruiser` with call-graph mode.

Use dependency and call graphs as supplementary input to A2.1 (deep candidate analysis) to
assess coupling between candidates more accurately than reading individual files.

## Change Coupling Data

### CodeScene
CodeScene's change coupling analysis identifies files that frequently change together in git
history. This is one of the strongest signals for business capability grouping — stronger than
static structure alone because it captures actual development activity patterns.

Export: Change coupling heatmap data or co-change frequency matrix.

### Git Mining Scripts
If CodeScene is not available, these git commands approximate change coupling:

```bash
# Files changed together (appear in same commits) in the last 6 months
git log --name-only --pretty=format: --since="6 months ago" | \
  awk '/^[^ ]/ { commit=$0; next } { print commit "|" $0 }' | \
  sort | \
  awk -F'|' '{ files[$2]=1; if (prev_commit == $1 && prev_file != "") { pair=prev_file"|" $2; pairs[pair]++ } prev_commit=$1; prev_file=$2 } END { for (p in pairs) if (pairs[p] > 2) print pairs[p], p }' | \
  sort -rn
```

Use as input to A1.5 (change coupling analysis).

## How to Reference Pre-Generated Inputs

When a pre-generated input is available, tell the user to place it in the working directory
(e.g., `capability-output/inputs/`) and reference it by filename. The pipeline step will read
it instead of (or in addition to) analyzing raw code.