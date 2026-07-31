---
name: capability-to-gherkin
description: >
  Converts a business capability map (L1 capabilities and L2 sub-capabilities with
  descriptions, actors, and value statements) into executable Gherkin Features and
  Scenarios for behavior-driven development (BDD). Bridges enterprise architecture
  artifacts and automated test specifications. Use when you have a capability map
  (from legacy-capability-extractor or similar output) and need BDD specs; when the
  user asks to convert capabilities to Gherkin, Cucumber, or BDD tests; or when
  integrating capability analysis with an OpenSpec specification-driven workflow.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [bdd, gherkin, testing, specification, capabilities, openspec]
---

# Business Capability to Gherkin Converter

Transforms a structured business capability map into **executable Gherkin specifications**
(Features + Scenarios), creating a traceable bridge between enterprise architecture
artifacts and behavior-driven development (BDD) test suites.

This skill is designed to consume the output of the [legacy-capability-extractor](https://github.com/agentskills/agentskills)
skill — a two-level capability map with L1 capabilities, L2 sub-capabilities, descriptions,
actors, and business value statements — and render it as Gherkin `.feature` files that
Cucumber, SpecFlow, Behat, and other BDD runners can execute.

## Use when

- The user has a capability map (JSON, Markdown, or YAML) and asks to convert it to Gherkin
- The user mentions "Gherkin," "Cucumber," "BDD," "feature files," or "executable specifications"
  in the context of capability analysis
- The user wants to create BDD test scenarios from a legacy-code capability extraction
- OpenSpec is in the project and the user wants Gherkin files added to `specs/`
- The user asks: "turn these capabilities into tests," "generate BDD scenarios from the domain
  model," or "create executable specs from the capability map"

## Do not use when

- The user only wants a written report or diagram — not executable specifications
- There is no capability map or domain model available as input
- The request is about writing test code (step definitions, test runners) rather than
  specifications
- The user wants unit tests or integration tests (not Gherkin/BDD scenario specs)

---

## Prerequisites

1. **A capability map** — typically `a6-domain-model.md` from legacy-capability-extractor, or
   any document/JSON that lists L1 capabilities, their L2 sub-capabilities, descriptions,
   business actors, and value statements.
2. **Domain understanding** — familiarity with the business actors and the outcomes they seek.
   If actors are not explicit in the input, infer them from the capability descriptions or ask.
3. **OpenSpec (optional)** — if the project uses OpenSpec for specification-driven development,
   the Gherkin files can be placed into the OpenSpec `specs/` directory and linked from a
   proposal. If OpenSpec is absent, the skill generates `.feature` files directly.

## Input Formats

The skill accepts capability maps in any of these formats:

- **Markdown** — A hierarchical document with L1 capabilities as headings and L2 items as
  sub-headings or bullet lists (the legacy-capability-extractor `a6-domain-model.md` output).
- **JSON** — A structured object with `L1`, `L2`, `description`, `businessValue`, `actors`
  fields.
- **YAML** — Equivalent to JSON with YAML syntax.

If the input format is unspecified, assume Markdown — it is the most common and the format
produced by legacy-capability-extractor.

---

## Conversion Pipeline

The conversion follows a five-stage pipeline. Each stage produces an intermediate artifact
that feeds the next. If a context break occurs, resume from the last completed output.

```
Input Analysis → Feature Mapping → Scenario Generation → Step Definition Mapping → OpenSpec Integration
```

### Stage 1: Input Analysis

Read the capability map and extract structured data.

1. Parse the input (Markdown / JSON / YAML).
2. Identify capability levels: L1 (business capability), L2 (executable operation).
3. Extract for each capability: name, description, business value, associated actors, and
   relationships/dependencies to other capabilities.
4. If the input is from legacy-capability-extractor, also pull the cross-capability dependency
   map from `a6-domain-model.md` — these dependencies become `Given` preconditions that
   reference other features.

### Stage 2: Feature Mapping

Map capability elements to Gherkin structures using this transformation:

| Capability Element        | Gherkin Element            | Example                                        |
|---------------------------|----------------------------|------------------------------------------------|
| L1 Capability             | Feature                    | `Feature: Customer Management`                 |
| L2 Capability             | Scenario                   | `Scenario: Customer Registration`              |
| Capability description    | Feature description line   | `Manages all customer-related activities`       |
| Business actor            | "As a" in Feature          | `As a Customer Service Representative`         |
| Business value            | "So that" in Feature       | `So that we can provide personalized service`  |
| Preconditions             | `Given` steps              | `Given a customer exists in the system`         |
| Triggering events         | `When` steps               | `When the customer submits registration info`  |
| Expected outcomes         | `Then` steps               | `Then the customer should be added to the DB`   |
| Capability dependencies   | `Given` in Background      | `Given the Customer Management capability...`  |

**Rule:** L1 capabilities always become Features. Each L2 sub-capability becomes at least
one Scenario (plus additional scenarios for alternative and exception flows).

### Stage 3: Scenario Generation

For each L2 capability, generate scenarios using this template:

```gherkin
@capability @level2 @<l2-tag>
Feature: <L1 Capability Name>
  <L1 description>

  As a <business actor>
  I want to <L2 capability in business terms>
  So that <business value or outcome>

  Background:
    Given the system is in a valid initial state
    And standard test data is loaded

  @capability @level2 @happy-path
  Scenario: <L2 Capability Name> — happy path
    Given <preconditions from capability>
    When <triggering event>
    Then <expected outcome>
    And <additional verification>

  @capability @level2 @alternative
  Scenario: <L2 Capability Name> — alternative flow
    Given <alternative preconditions>
    When <alternative action>
    Then <alternative outcome>

  @capability @level2 @exception
  Scenario: <L2 Capability Name> — error case
    Given <error-triggering preconditions>
    When <invalid or failing action>
    Then <error is handled>
    And <system state is consistent>
```

#### Scenario types to generate

Generate **at least** a happy-path scenario for every L2. Add additional scenarios when the
capability description or dependencies suggest meaningful alternatives:

1. **Happy Path** — Standard successful execution of the capability.
2. **Alternative Flow** — A valid but different path (e.g., "customer updates profile via web
   portal" vs. "via mobile app").
3. **Exception / Error** — Error conditions, validation failures, and how the system handles them.
4. **Boundary / Edge** — Minimum, maximum, or threshold values (optional, for high-risk capabilities).
5. **Cross-Capability** — Scenarios that exercise dependencies between capabilities, if the
   capability map documents cross-capability relationships.

### Stage 4: Step Definition Mapping

After generating Feature files, plan the step definitions that will make them executable:

1. **Reuse existing steps** — If the project already has step definitions (stepdefs, step
   definitions), match Gherkin steps to existing step methods before creating new ones.
2. **Create new steps** — For steps that have no existing definition, generate stubs using the
   project's BDD framework convention (Cucumber `stepdefs.js`, SpecFlow `.cs`, Behat `FeatureContext`,
   etc.).
3. **Data tables** — Use Gherkin data tables for complex multi-field inputs rather than
   long `And` chains.
4. **Tags** — Apply tags consistently: `@capability`, `@level1`, `@level2`, plus a descriptive
   tag per L2 (e.g. `@registration`, `@profile-management`). Use `@openspec` when the feature
   originated from an OpenSpec proposal.

See `references/gherkin-reference.md` for the full Gherkin syntax guide and framework-specific
step-definition conventions.

### Stage 5: OpenSpec Integration (optional)

If OpenSpec is detected in the project (`openspec.yaml` or `.opspec/` directory present):

1. Create a new OpenSpec change: `/opsx:propose` with a title like "Add Gherkin specs for
   `<L1 Capability>`."
2. Place `.feature` files in the OpenSpec `specs/` directory.
3. Update `tasks.md` with implementation steps (step definition stubs, test data setup).
4. Link the feature files back to the original capability map in the proposal description.
5. When implementation is complete, archive the change with `/opsx:archive`.

If OpenSpec is **not** detected, generate `.feature` files into a `features/` or `specs/`
directory and report that OpenSpec integration was skipped.

See `references/openspec-integration.md` for the full workflow.

---

## Gherkin Conventions

Follow these conventions for all generated Gherkin:

- **Feature titles** — Use the L1 capability name verbatim. Keep it concise.
- **Feature descriptions** — Start with the capability description from the input. If
  business value is available, include it as a "So that" line.
- **Language** — Write in **business terms**, not implementation terms. Avoid framework,
  database, or class names in scenario steps.
- **One rule per scenario** — Each scenario should test one business rule or outcome.
- **Scenario names** — Descriptive but concise. Include the flow type ("happy path,"
  "error case") as a suffix.
- **Background** — Use for shared preconditions across ALL scenarios in a Feature. Do not
  put feature-specific setup here.
- **Data tables** — Use for complex multi-field inputs. Keep columns ordered logically
  (e.g., field name, type, valid value, invalid value).

---

## Anti-Patterns

### 1. Technical language in scenarios

**Symptom:** Steps reference database tables, class names, HTTP codes, or framework methods.
**Fix:** Rewrite in business terms. "Then the customer is saved to the database" becomes
"Then the customer should be able to log in."

### 2. Implementation details as scenarios

**Symptom:** Scenarios describe *how* the system works (API calls, UI clicks, SQL queries)
rather than *what* the system should do.
**Fix:** Focus on business outcomes. The system's internal mechanism should not appear in
the Feature.

### 3. Missing actor or business value

**Symptom:** A Feature has no "As a / I want / So that" narrative.
**Fix:** Every Feature must state who benefits, what they need, and why. If actors or value
are missing from the input, infer them from the capability description or flag for review.

### 4. One giant scenario per capability

**Symptom:** A single scenario tries to test the entire happy path AND all error cases.
**Fix:** Split into granular scenarios. One business rule → one scenario.

### 5. Duplicated scenarios across Features

**Symptom:** The same precondition/action/outcome appears in multiple Feature files.
**Fix:** Consolidate cross-capability scenarios into the most relevant Feature. Use tags to
indicate cross-cutting concerns rather than duplicating scenarios.

### 6. No OpenSpec linkage (when OpenSpec is in use)

**Symptom:** Gherkin files are generated but not linked to OpenSpec proposals.
**Fix:** Always create or update an OpenSpec change when the project uses OpenSpec. This
maintains the traceability chain from business capability → Gherkin spec → implementation.

---

## Pre-Delivery Checklist

Before declaring a capability-to-Gherkin conversion complete:

- [ ] Every L1 capability in the input has a corresponding `.feature` file
- [ ] Every L2 sub-capability has at least one Scenario (happy path)
- [ ] Each Feature includes the "As a / I want / So that" narrative with a real business actor
- [ ] Scenarios are written in business language (no technical implementation details)
- [ ] Each scenario has clear, testable Given/When/Then steps
- [ ] Tags are applied consistently (`@capability`, `@level1`, `@level2`, per-L2 tag)
- [ ] Cross-capability dependencies from the input are reflected as Given preconditions
- [ ] No duplicate scenarios exist across Features
- [ ] If OpenSpec is in use, `.feature` files are in `specs/` and linked to a proposal
- [ ] If OpenSpec is absent, `.feature` files are placed in a conventional `features/` directory
- [ ] Step definition stubs are planned (or existing steps are matched) for every step
- [ ] Feature file syntax validates (no missing colons, no orphaned steps)

---

## Gate Implications

The gate must **BLOCK** the conversion when:

- An L1 capability lacks a corresponding Feature file
- An L2 capability has no Scenario generated
- A Feature is missing the "As a / I want / So that" narrative
- Scenarios contain technical jargon (database names, class names, HTTP codes) instead of
  business language
- The same scenario appears duplicated across multiple Feature files
- OpenSpec is in use but Gherkin files are not linked to an OpenSpec proposal
- Feature file syntax is invalid (missing colons, mismatched indentation, orphaned steps)

The gate may **WARN** when:

- A high-risk capability has no exception/boundary scenario (happy path only)
- Tags use inconsistent naming across Features
- Step definition stubs are not yet planned (but Feature syntax is valid)
- The capability map had low-confidence items that were included without flagging

---

## Evidence Required

A conversion using this skill should produce:

- The generated `.feature` file(s) — one per L1 capability, with Scenarios per L2
- A mapping table showing which capability → which Feature/Scenario (traceability)
- A list of step definitions needed (new stubs vs. matched existing steps)
- If OpenSpec is in use: the OpenSpec proposal and the linkage between specs and tasks
- A validation report noting any missing capabilities, duplicates, or syntax issues

---

## Relationship to legacy-capability-extractor

This skill is designed as a **companion** to legacy-capability-extractor:

```
legacy-capability-extractor (A1–A7 pipeline) → a6-domain-model.md
                                                             ↓
                                          capability-to-gherkin (this skill)
                                                             ↓
                                          *.feature files (executable BDD specs)
```

The two skills share a `dependencies` relationship in metadata. When both are installed, an
agent analyzing legacy code can run the full pipeline: extract capabilities, then generate
executable specifications from the resulting domain model.

---

## Cross-Tool Compatibility

This skill follows the open **Agent Skills** standard — a `SKILL.md` folder that any
compatible tool discovers at a well-known path (e.g. `.claude/skills/`, `.codex/skills/`,
`.opencode/skills/`, `.cursor/skills/`, `.github/skills/`, `.kiro/skills/`, `.gemini/skills/`,
`.kilocode/skills/`). The `SKILL.md` above is the single source of truth; it is installed
unmodified into each tool.

To expose this skill to a target project, run the repo's `install-skill.sh` (it symlinks this
folder into the chosen tool's path):

```bash
bash install-skill.sh --tool claude,codex,cursor --target /path/to/project
bash install-skill.sh --tool claude --target /path/to/project --id capability-to-gherkin
bash install-skill.sh --list-tools
```

For tools that do not read `SKILL.md` natively (they only consume a project memory file such
as `AGENTS.md` / `CLAUDE.md` / `.windsurfrules`), point them at `references/condensed.md` —
a flattened copy of the pipeline, mapping rules, and checklist above. Full install details
and the progressive-disclosure model are in this folder's `README.md`.
