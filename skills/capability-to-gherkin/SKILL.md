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
  tags: [bdd, gherkin, testing, specification, capabilities, openspec, scenario-outline, data-tables, cross-capability]
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

  @capability @level2 @<l2-tag> @happy-path
  Scenario: <L2 Capability Name> — happy path
    Given <preconditions from capability>
    When <triggering event>
    Then <expected outcome>
    And <additional verification>

  @capability @level2 @<l2-tag> @exception
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
6. **Security** — Authentication, authorization, PII handling, and access control constraints.
7. **Concurrency** — Race conditions, simultaneous writes, and rate-limit behavior under load.

#### Split composite scenarios

**Never** combine multiple operations or business rules into a single Scenario. A composite
scenario that walks through an entire CRUD lifecycle (create → read → update → delete in one
Scenario) must be split into four independent Scenarios, each with its own Given/When/Then.
Composite scenarios obscure which operation failed when a test breaks, making failure isolation
and debugging difficult.

**Anti-pattern:**
```gherkin
Scenario: Customer lifecycle management
  Given a new customer is created
  And the customer's details are updated
  And the customer is archived
  Then all changes are reflected correctly   # which step failed?
```

**Correct:**
```gherkin
Scenario: Customer record creation
  Given no customer with that identifier exists
  When a new customer is registered
  Then the customer record should exist
  And an audit log entry should be created
  And the response metadata should include a creation timestamp

Scenario: Customer record update
  Given an existing customer record
  When the customer's details are updated
  Then the record should reflect the new values
  And the previous values should be preserved in the change history
```

#### Scenario Outline with Examples tables

Use `Scenario Outline` with `Examples:` tables whenever the same business rule applies across
multiple distinct data values. This is especially applicable for:
- **Rate limits** — requests-per-window thresholds
- **Media types** — accepted/rejected content types
- **PII types** — personal data classification handling
- **Setting keys** — configuration option validation
- **Filter values** — query filter acceptance behavior

Each row in the `Examples:` table is an independent test run. Keep columns descriptive with
business-meaningful names.

**Example — rate limits:**
```gherkin
@capability @level2 @api-rate-limiting @boundary
Scenario Outline: API request rate limit enforcement
  Given the rate limit window is "<window>"
  And "<request-count>" requests have already been made
  When the client sends one more request
  Then the response should be "<status>"
  And the response metadata should include a "Retry-After" header of "<retry-after>" seconds

  Examples:
    | window  | request-count | status      | retry-after |
    | 1 minute | 49           | 200 OK      | 0           |
    | 1 minute | 50           | 200 OK      | 0           |
    | 1 minute | 51           | 429 Too Many| 60          |
    | 1 minute | 100          | 429 Too Many| 60          |
```

#### Standardized verification steps

Every scenario that exercises a state change or side effect should end with consistent `And`
verification steps. Apply the subset relevant to the capability:

| Verification type   | Gherkin step pattern                                         | When to use                         |
|---------------------|--------------------------------------------------------------|-------------------------------------|
| Audit log entry     | `And an audit log entry should be created with "<action>"`   | Any write or state-changing action  |
| UI state confirmation | `And the UI should show "<expected-state>"`                  | UI-facing capabilities              |
| Cascade effects     | `And the downstream "<related-record>" should reflect the change` | When a change propagates to related entities |
| Response metadata   | `And the response metadata should include "<header>"`         | Any API-facing action               |

Use these as trailing `And` steps after the primary `Then` outcome. Do not omit them from
write operations — they are mandatory for any Scenario that mutates state.

**Example with all four verification types:**
```gherkin
@capability @level2 @order-fulfillment @happy-path
Scenario: Order shipment dispatch
  Given an order with status "ready_to_ship"
  When the fulfillment team marks it as shipped
  Then the order status should be "shipped"
  And an audit log entry should be created with "ORDER_SHIPPED"
  And the UI should show "Shipped — tracking <tracking-number>"
  And the downstream invoice should be marked as finalized
  And the response metadata should include an "X-Shipped-At" timestamp
```

#### Cross-capability scenarios

If the dependency map shows cross-capability relationships, generate scenarios that exercise
those dependencies. These scenarios should live in the most relevant Feature and reference the
dependent capability in their `Given` preconditions.

**Rule:** For every dependency edge in the capability map's dependency section, produce at
least one `@cross-capability` Scenario. If 10 cross-capability relationships exist, 10
cross-capability Scenarios must exist — not 2.

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
   originated from an OpenSpec proposal. Add semantic tags from this set based on the scenario
   type: `@happy-path`, `@alternative`, `@exception`, `@boundary`, `@cross-capability`,
   `@security`, `@concurrency`. These tags enable CI filtering (e.g. `@security` for
   penetration runs, `@concurrency` for load-aware suites, `@boundary` for nightly edge-case
   runs).

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
- **Split composite scenarios** — A scenario that performs multiple operations (e.g. a full
  CRUD lifecycle in one Scenario) must be split into one Scenario per operation. Each split
  scenario has its own Given/When/Then and ends with standardized verification steps. This
  gives better failure isolation and faster root-cause identification.
- **Scenario names** — Descriptive but concise. Include the flow type ("happy path,"
  "error case") as a suffix.
- **Background** — Use for shared preconditions across ALL scenarios in a Feature. Do not
  put feature-specific setup here.
- **Data tables** — Use for complex multi-field inputs. Keep columns ordered logically
  (e.g., field name, type, valid value, invalid value).
- **Scenario Outline with Examples** — Use `Scenario Outline:` + `Examples:` when the same
  scenario applies across multiple discrete data values. Target at least 10 scenarios per
  Feature for data-driven capabilities (rate limits, media types, PII classification, setting
  keys, filter values). Each row in the `Examples:` table is an independent test execution.
- **Standardized verification steps** — Every Scenario that mutates state must end with
  relevant `And` verification steps drawn from this set:
  - `And an audit log entry should be created with "<action>"`
  - `And the UI should show "<expected-state>"`
  - `And the downstream "<related-record>" should reflect the change`
  - `And the response metadata should include "<header>"`
- **Tags** — Every scenario carries `@capability`, `@level2`, a per-L2 descriptor tag, and a
  semantic flow-type tag from this set: `@happy-path`, `@alternative`, `@exception`,
  `@boundary`, `@cross-capability`, `@security`, `@concurrency`. These enable targeted CI
  execution (e.g. `cucumber --tags @security`).

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
**Fix:** Split into granular scenarios. One business rule → one scenario. A CRUD lifecycle
spawns four scenarios (create, read, update, delete), each with its own Given/When/Then and
standardized verification steps.

### 5. Composite scenario testing multiple operations

**Symptom:** A Scenario performs create → read → update → delete in one flow.
**Fix:** Split into one Scenario per operation. Each split scenario must have independent
preconditions and a clear single outcome. This gives better failure isolation in CI: when
the update step fails, only the update Scenario fails — not the entire lifecycle.

### 6. Missing standardized verification steps

**Symptom:** A write Scenario ends after the primary `Then` outcome with no audit, UI,
cascade, or metadata checks.
**Fix:** Every state-changing Scenario must end with relevant `And` verification steps from
this set: audit log entry, UI state confirmation, cascade effects, response metadata.

### 7. Insufficient data-driven coverage

**Symptom:** Only one scenario exists for a capability that varies by input (rate limits,
media types, PII types).
**Fix:** Use `Scenario Outline` with `Examples:` tables. Each distinct data value is a
separate test execution. Target at least 10 data-driven scenarios for variable-input
capabilities.

### 8. Under-tagged scenarios

**Symptom:** Scenarios carry only `@capability @level2` with no semantic flow-type tag.
**Fix:** Every Scenario must carry one of: `@happy-path`, `@alternative`, `@exception`,
`@boundary`, `@cross-capability`, `@security`, `@concurrency`. Tags enable CI to run
targeted subsets (e.g. `cucumber --tags @security` for pen-test runs).

### 9. Missing cross-capability scenarios

**Symptom:** The dependency map shows 10 cross-capability relationships but only 2 are
tested.
**Fix:** For each dependency edge in the capability map, generate at least one
`@cross-capability` Scenario. These live in the most relevant Feature and reference the
dependent capability in their `Given` preconditions.

### 10. No OpenSpec linkage (when OpenSpec is in use)

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
- [ ] **No composite scenarios exist** — each Scenario tests a single operation or business rule
- [ ] **Data-driven capabilities** (rate limits, media types, PII, settings, filters) use
      `Scenario Outline` with `Examples:` tables (target ≥10 data-driven scenarios where applicable)
- [ ] Every state-changing Scenario ends with relevant verification `And` steps:
      audit log, UI state, cascade effects, response metadata
- [ ] Tags are applied consistently (`@capability`, `@level1`, `@level2`, per-L2 tag, and a
      semantic flow-type tag from: `@happy-path`, `@alternative`, `@exception`, `@boundary`,
      `@cross-capability`, `@security`, `@concurrency`)
- [ ] Every dependency edge in the capability map's cross-capability section has a
      corresponding `@cross-capability` Scenario
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
- A composite Scenario tests multiple operations (CRUD lifecycle in one Scenario) without
  being split
- The same scenario appears duplicated across multiple Feature files
- OpenSpec is in use but Gherkin files are not linked to an OpenSpec proposal
- Feature file syntax is invalid (missing colons, mismatched indentation, orphaned steps)
- A dependency edge in the cross-capability dependency map has no corresponding
  `@cross-capability` Scenario
- A state-changing Scenario lacks standardized verification `And` steps (audit log, UI state,
  cascade effects, response metadata)

The gate must **WARN** when:

- A data-driven capability (rate limits, media types, PII types, setting keys, filter values)
  does not use `Scenario Outline` with `Examples:` tables
- A Scenario Outline has fewer than 3 data rows where more would improve coverage
- A high-risk capability has no exception/boundary scenario (happy path only)
- A scenario lacks one of the required semantic tags: `@happy-path`, `@alternative`,
  `@exception`, `@boundary`, `@cross-capability`, `@security`, `@concurrency`
- Tags use inconsistent naming across Features
- Step definition stubs are not yet planned (but Feature syntax is valid)
- The capability map had low-confidence items that were included without flagging

---

## Evidence Required

A conversion using this skill should produce:

- The generated `.feature` file(s) — one per L1 capability, with Scenarios per L2
- A mapping table showing which capability → which Feature/Scenario (traceability)
- A list of step definitions needed (new stubs vs. matched existing steps)
- Confirmation that no composite scenarios exist (each Scenario covers one operation/rule)
- Confirmation that data-driven capabilities use `Scenario Outline` + `Examples:` tables
- Confirmation that every state-changing Scenario includes verification `And` steps (audit log,
  UI state, cascade effects, response metadata)
- Confirmation that every cross-capability dependency edge from the dependency map has a
  corresponding `@cross-capability` Scenario
- If OpenSpec is in use: the OpenSpec proposal and the linkage between specs and tasks
- A validation report noting any missing capabilities, duplicates, syntax issues, or gate
  violations

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
