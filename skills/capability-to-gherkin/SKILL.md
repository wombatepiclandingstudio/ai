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
version: "1.2"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [bdd, gherkin, testing, specification, capabilities, openspec, scenario-outline, data-tables, cross-capability, triage, regression]
---

# Business Capability to Gherkin Converter

Transforms a structured business capability map into **executable Gherkin specifications**
(Features + Scenarios), creating a traceable bridge between enterprise architecture
  artifacts and behavior-driven development (BDD) test suites. Includes
  triage of non-feature capabilities (invariants, NFRs, deferred items),
  regression scenarios from bug findings, and machine validation of the
  generated Gherkin.

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
3. **Known findings (optional but valuable)** — bug lists, HIGH-severity findings, incident
   history, or "dead code" notes attached to the capability map. These become regression
   scenarios in Stage 3.
4. **OpenSpec (optional)** — if the project uses OpenSpec for specification-driven development,
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

The conversion follows a seven-stage pipeline. Each stage produces an intermediate artifact
that feeds the next. If a context break occurs, resume from the last completed output.

```
Triage & Disposition → Input Analysis → Feature Mapping → Scenario Generation → Step Definition Planning → OpenSpec Integration → Validation & Self-Review
```

### Stage 0: Triage & Disposition (mandatory)

Real capability maps are not pure feature wishlists: they contain dead code, architecture
concerns posing as capabilities, cross-cutting invariants, and items deferred by earlier
decisions. **Never generate scenarios from an undispositioned map** — a scenario for a
deferred or dead capability creates a false test obligation.

Assign every L2 (and any L1 without L2s) exactly one disposition before Stage 1:

| Disposition | Meaning | Handling |
|---|---|---|
| `feature` | Testable business behavior | Proceeds to Feature/Scenario generation |
| `invariant` | A rule that must hold, not a thing users do | Merged as acceptance criteria / named scenarios into the `feature` that owns that data (e.g. "stats read transactions, not plan templates") |
| `nfr-doc` | Architecture, data-layer, or policy concern | Documented in the traceability report; NOT a Feature (e.g. "role-enum layering policy", "timezone storage rule") |
| `deferred(reason)` | Out of scope by an explicit decision | No scenarios; the reason (owner decision, phase, version) is recorded in the traceability report |

Rules:

- **Account for every L2.** The traceability report must show a disposition for 100% of
  input items; nothing is silently dropped or silently converted.
- **Invariants ship with their owner.** An invariant dispositioned away from its owning
  feature is lost — bind it to the feature whose data it protects.
- **Bug findings ride along.** If the map carries severity findings (HIGH bugs, sync gaps,
  dead paths), disposition the capability as `feature` and tag the finding for Stage 3
  regression scenarios.
- Flag low-confidence dispositions in the report rather than guessing silently.

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
| L1 Capability             | Feature (or feature set if multi-seam) | `Feature: Customer Management`       |
| L2 Capability             | Scenario                   | `Scenario: Customer Registration`              |
| Capability description    | Feature description line   | `Manages all customer-related activities`       |
| Business actor            | "As a" in Feature          | `As a Customer Service Representative`         |
| Business value            | "So that" in Feature       | `So that we can provide personalized service`  |
| Preconditions             | `Given` steps              | `Given a customer exists in the system`         |
| Triggering events         | `When` steps               | `When the customer submits registration info`  |
| Expected outcomes         | `Then` steps               | `Then the customer should be added to the DB`   |
| Capability dependencies   | `Given` in Background      | `Given the Customer Management capability...`  |

**Rule:** A Feature carries exactly **one business actor and one value proposition**
("As a X / I want / So that"). An L1 with a single actor becomes one Feature. An L1
with multiple actor or rule seams (e.g. recurring generation vs. conflict prevention vs.
per-occurrence overrides) is split into sub-features — `<l1>a-`, `<l1>b-` … — each with a
lineage tag back to the L1. A Feature that needs two "As a" personas is an anti-pattern
(see Anti-Pattern 11). Each `feature`-dispositioned L2 becomes at least one Scenario
(plus additional scenarios for alternative and exception flows).

### Stage 3: Scenario Generation

For each L2 capability, generate at minimum a happy-path scenario. Add additional scenario
types when the capability description or dependencies suggest them:

1. **Happy Path** — Standard successful execution (mandatory for every L2)
2. **Alternative Flow** — Valid but different path
3. **Exception / Error** — Error conditions, validation failures
4. **Boundary / Edge** — Threshold values (for high-risk capabilities)
5. **Cross-Capability** — Exercises dependencies between capabilities
6. **Security** — Authentication, authorization, PII handling
7. **Concurrency** — Race conditions, rate-limit behavior
8. **Regression** — Pins bug findings as acceptance criteria (`@regression`)

**Key rules:**
- **Split composite scenarios.** One operation per Scenario. Never combine CRUD lifecycle
  into one Scenario — each step gets its own Given/When/Then. See `references/anti-patterns.md`
  for examples.
- **Use Scenario Outline with Examples** for data-driven rules (rate limits, media types,
  PII types, settings, filters). Size by distinct business outcome: <3 rows questions the
  outline, >10 questions the split.
- **Standardized verification steps.** Every state-changing Scenario must end with relevant
  `And` steps: audit log entry, visible state, cascade effects, response metadata.
  Use outcome-descriptive phrasing, not exact strings (unless the string IS the business rule).
- **Cross-capability scenarios.** For every dependency edge in the capability map, produce
  at least one `@cross-capability` Scenario.
- **One actor per Feature.** If a second "As a" persona appears, split the Feature.

See `references/scenario-generation.md` for templates, examples, and verification step patterns.
See `references/anti-patterns.md` for the full list of 14 anti-patterns to avoid.

### Stage 4: Step Definition Mapping

After generating Feature files, plan the step definitions that will make them executable:

0. **Greenfield projects (no runner, no existing step definitions)** — skip framework-specific
   stubs entirely; they are speculation. Instead, group the generated steps by **harness
   need** (auth/tenancy context, audit assertions, clock control, concurrency helpers,
   notification capture, report/export harness) so the team knows what test infrastructure
   to build when a runner is chosen. One generic step can often cover dozens of uses —
   design for that (e.g. a single audit assertion step parameterized by event).
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
   `@security`, `@concurrency`, `@regression`. These tags enable CI filtering (e.g. `@security` for
   penetration runs, `@concurrency` for load-aware suites, `@regression` for bug-pin suites).

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

### Stage 6: Machine Validation & Adversarial Self-Review (mandatory)

A checklist filled in by the same agent that wrote the specs is not a gate. Two passes,
both mandatory, before declaring the conversion complete:

**Pass 1 — Machine validation.** Run the generated files through a real Gherkin parser
(e.g. `@cucumber/gherkin` for Node, `gherkin-parser`/`behave` equivalents for other stacks)
and report the output: file count, scenario count, outline count, data-driven execution
count, parse errors. Malformed tables, broken indentation, and orphaned steps must be
fixed before delivery. Syntax validity is the floor, not the bar.

**Pass 2 — Adversarial self-review.** Re-read the generated specs as a skeptic and check:

1. **Contradictory windows** — do any threshold/outline values contradict each other
   (a "sent at 25 hours" row in a "within 24 hours" rule is an off-by-one)?
2. **Invented attributes** — does any step reference a field, type, or enum the domain
   model does not have?
3. **Uniquely observable outcomes** — is every `Then` a single checkable fact? An OR
   ("rejected or waitlisted") cannot be asserted; pin the policy.
4. **Exact-string coupling** — do exact codes/labels appear where the string is not
   itself the business rule?
5. **Vague assertions** — "system state is consistent" or "a spot becomes available"
   name no observable; rewrite as a count/state assertion.
6. **Persona leakage** — does any Feature quietly serve two actors?

Findings are fixed in place; the validation report records both passes' results.

---

## Gherkin Conventions

- **Feature titles** — Use the L1 capability name. Keep concise.
- **Feature descriptions** — Include capability description and "So that" business value.
- **One actor per Feature** — Split along actor seams if multiple personas appear.
- **`Rule:` grouping** — Use `Rule:` blocks (Gherkin 6) to group related scenarios.
- **Language** — Business terms only. No framework, database, or class names.
- **One rule per scenario** — Split composite scenarios into one per operation.
- **Background** — Shared preconditions only. No feature-specific setup.
- **Data tables** — For complex multi-field inputs. Ordered logically.
- **Tags** — Every scenario carries `@capability`, `@level2`, per-L2 tag, and a semantic
  tag: `@happy-path`, `@alternative`, `@exception`, `@boundary`, `@cross-capability`,
  `@security`, `@concurrency`, `@regression`.

---

## Anti-Patterns

See `references/anti-patterns.md` for the full list with symptoms and fixes. The most critical:

1. **Technical language** — Steps reference DB tables, class names, HTTP codes
2. **Composite scenarios** — Multiple operations in one Scenario (CRUD lifecycle)
3. **Missing verification steps** — Write scenarios without audit/state cascade/metadata checks
4. **Under-tagged scenarios** — Missing semantic flow-type tags
5. **Multi-persona Feature** — Two "As a" lines instead of splitting along actor seams
6. **OR-shaped outcomes** — "rejected or waitlisted" — pin the policy instead
7. **Skipping validation** — Delivering unparsed, unreviewed specs

---

## Pre-Delivery Checklist

Before declaring a capability-to-Gherkin conversion complete:

- [ ] Every L2 in the input has an explicit disposition (Stage 0) — feature, invariant,
      nfr-doc, or deferred(reason) — and 100% are accounted for in the traceability report
- [ ] Every `feature`-dispositioned L1 has a corresponding `.feature` file; multi-seam L1s
      split with lineage, one actor per Feature
- [ ] Every `feature`-dispositioned L2 has at least one Scenario (happy path)
- [ ] Bug findings from the map have `@regression` scenarios stating the business outcome
- [ ] Each Feature includes the "As a / I want / So that" narrative with a real business actor
- [ ] Scenarios are written in business language (no technical implementation details)
- [ ] Each scenario has clear, testable Given/When/Then steps
- [ ] **No composite scenarios exist** — each Scenario tests a single operation or business rule
- [ ] **Data-driven capabilities** (rate limits, media types, PII, settings, filters) use
      `Scenario Outline` with `Examples:` tables sized by distinct business outcome
- [ ] Every state-changing Scenario ends with relevant verification `And` steps:
      audit log, visible state, cascade effects, response metadata
- [ ] Machine validation ran (Stage 6 Pass 1): parser output reported, 0 parse errors
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

- An L2 lacks an explicit Stage 0 disposition, or dispositions do not account for 100%
  of input items
- A deferred item (D-decision, phase-out, owner decision) has scenarios generated for it
- An invariant was dispositioned but not bound to an owning feature
- A `feature`-dispositioned L1 lacks a corresponding Feature file
- A `feature`-dispositioned L2 has no Scenario generated
- A Feature is missing the "As a / I want / So that" narrative, or carries two personas
- Scenarios contain technical jargon (database names, class names, HTTP codes) instead of
  business language
- A composite Scenario tests multiple operations (CRUD lifecycle in one Scenario) without
  being split
- The same scenario appears duplicated across multiple Feature files
- OpenSpec is in use but Gherkin files are not linked to an OpenSpec proposal
- Feature file syntax is invalid (missing colons, mismatched indentation, orphaned steps)
  or machine validation was not run
- A dependency edge in the cross-capability dependency map has no corresponding
  `@cross-capability` Scenario
- A state-changing Scenario lacks standardized verification `And` steps (audit log, visible
  state, cascade effects, response metadata)

The gate must **WARN** when:

- An OR-shaped outcome appears in a `Then` step ("rejected or waitlisted")
- A vague, non-observable assertion appears ("system state is consistent")
- Exact codes or labels are asserted where the string is not itself the business rule
- A data-driven capability (rate limits, media types, PII types, setting keys, filter values)
  does not use `Scenario Outline` with `Examples:` tables
- A Scenario Outline has fewer than 3 data rows (question whether the rule is data-driven)
  or more than ~10 (question whether it is several rules)
- A high-risk capability has no exception/boundary scenario (happy path only)
- A bug finding in the map has no corresponding `@regression` scenario
- A scenario lacks one of the required semantic tags: `@happy-path`, `@alternative`,
  `@exception`, `@boundary`, `@cross-capability`, `@security`, `@concurrency`,
  `@regression`
- Tags use inconsistent naming across Features
- Step definition stubs are not yet planned (but Feature syntax is valid)
- The capability map had low-confidence items that were included without flagging

---

## Evidence Required

A conversion using this skill should produce:

- The Stage 0 disposition table (every L2: feature / invariant / nfr-doc / deferred+reason)
- The generated `.feature` file(s) — one per single-actor Feature, with Scenarios per L2
- A mapping table showing which capability → which Feature/Scenario (traceability), including
  sub-feature lineage back to the L1
- A bug-finding → `@regression` scenario mapping (when the map carried findings)
- A list of step definitions needed (new stubs vs. matched existing steps), or a
  harness-need grouping for greenfield projects
- Confirmation that no composite scenarios exist (each Scenario covers one operation/rule)
- Confirmation that data-driven capabilities use `Scenario Outline` + `Examples:` tables
- Confirmation that every state-changing Scenario includes verification `And` steps (audit log,
  visible state, cascade effects, response metadata)
- Confirmation that every cross-capability dependency edge from the dependency map has a
  corresponding `@cross-capability` Scenario
- The Stage 6 validation report: parser output (counts + 0 errors) and adversarial
  self-review findings with their fixes
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


