# Business Capability to Gherkin (condensed)

This is a condensed version of `SKILL.md` for tools that do not natively read the Agent
Skills `SKILL.md` format. Point your tool's memory/instructions file (e.g. `AGENTS.md`,
`CLAUDE.md`, `GEMINI.md`, `.windsurfrules`) at this content, or paste it into the relevant
rules file. The canonical source remains `SKILL.md`.

## Trigger Phrases

- "convert capabilities to Gherkin", "turn capability map into BDD tests"
- "generate Gherkin from capabilities", "create feature files from capability map"
- "Gherkin", "Cucumber", "BDD", "feature files", "executable specifications"
- "OpenSpec", "opsx:propose", "specification-driven development"

## When to use

- A capability map (from legacy-capability-extractor or similar) needs to become BDD specs
- The user wants executable specifications traceable to business capabilities
- OpenSpec is in the project and the user wants Gherkin specs in `specs/`

## Do not use when

- The user only wants a written report, not executable specs
- No capability map or domain model is available as input
- The request is about step definitions or test runners, not specifications

## Conversion Pipeline

### Stage 1 — Input Analysis
Parse the capability map (Markdown/JSON/YAML). Extract L1/L2 capabilities, descriptions,
actors, value statements, and cross-capability dependencies.

### Stage 2 — Feature Mapping
| Capability Element | Gherkin Element |
|-------------------|-----------------|
| L1 Capability | Feature |
| L2 Capability | Scenario |
| Description | Feature description |
| Business actor | "As a" narrative |
| Business value | "So that" statement |
| Preconditions | `Given` steps |
| Triggering events | `When` steps |
| Expected outcomes | `Then` steps |
| Dependencies | `Given` in Background |

### Stage 3 — Scenario Generation
For each L2 capability, generate at least a happy-path Scenario. Add alternative-flow,
exception, boundary, cross-capability, security, and concurrency scenarios where meaningful.

**Template:**
```gherkin
@capability @level2 @<tag>
Feature: <L1 Name>
  <L1 description>
  As a <actor>
  I want to <L2 in business terms>
  So that <business value>
  Background:
    Given the system is in a valid initial state
  @capability @level2 @<tag> @happy-path
  Scenario: <L2 Name> — happy path
    Given <preconditions>
    When <triggering event>
    Then <expected outcome>
    And <additional verification>
    And an audit log entry should be created with "<action>"
    And the response metadata should include a timestamp
```

**Split composite scenarios.** Never combine multiple operations in one Scenario. A CRUD
lifecycle becomes four independent Scenarios (create, read, update, delete), each with its
own Given/When/Then.

**Use Scenario Outline + Examples tables** for data-driven capabilities (rate limits, media
types, PII types, setting keys, filter values). Each row is an independent test execution.
Target ≥10 data-driven scenarios where applicable.

**Standardized verification steps.** Every state-changing Scenario ends with `And` steps drawn
from: audit log entry, UI state confirmation, cascade effects, response metadata.

**Cross-capability scenarios.** For every dependency edge in the capability map's
cross-capability section, generate at least one `@cross-capability` Scenario.

**Tags.** Every Scenario carries: `@capability`, `@level2`, per-L2 tag, and a semantic
flow-type tag: `@happy-path`, `@alternative`, `@exception`, `@boundary`, `@cross-capability`,
`@security`, `@concurrency`.

### Stage 4 — Step Definition Mapping
Match Gherkin steps to existing step definitions. Generate stubs for new steps using the
project's BDD framework convention (Cucumber, SpecFlow, Behat). Use data tables for complex
inputs. Apply tags consistently.

### Stage 5 — OpenSpec Integration (if OpenSpec present)
1. `/opsx:propose` — create a change proposal
2. Place `.feature` files in `specs/`
3. Update `tasks.md` with step-definition and test-data tasks
4. Link specs back to the original capability map
5. `/opsx:archive` when implementation is complete

If OpenSpec is **not** detected, generate `.feature` files into `features/` and report that
integration was skipped.

## Gherkin Conventions

- **Language** — business terms only. No DB tables, class names, HTTP codes, or framework
  methods in scenario steps.
- **One rule per scenario** — each scenario tests one business outcome.
- **No composite scenarios** — split CRUD and multi-operation flows into one Scenario per
  operation.
- **Feature narrative** — every Feature must have As-a / I-want / So-that.
- **Data tables / Scenario Outline** — use for variable-input capabilities (rate limits,
  media types, PII types, setting keys, filter values).
- **Verification steps** — every state-changing Scenario ends with audit log, UI state,
  cascade, and metadata checks.
- **Tags** — `@capability`, `@level1`, `@level2`, per-L2 tag, semantic flow-type tag.

## Anti-Patterns

1. **Technical language** — steps reference implementation details → rewrite in business terms
2. **Implementation scenarios** — scenarios describe *how* not *what* → focus on outcomes
3. **Missing narrative** — Feature lacks As-a/I-want/So-that → every Feature must state actor + value
4. **Composite scenarios** — multiple operations in one Scenario → split into one per operation
5. **Missing verification steps** — state-changing Scenario without audit/UI/cascade/metadata checks → add them
6. **Single-value for variable input** — one scenario for rate limits/media types → use Scenario Outline
7. **Duplicate scenarios** — same steps across Features → consolidate, use tags
8. **Missing cross-capability scenarios** — dependency edge without a corresponding `@cross-capability` Scenario → add one
9. **No OpenSpec linkage** — when OpenSpec is in use, specs must link to a proposal

## Pre-Delivery Checklist

- [ ] Every L1 capability has a `.feature` file
- [ ] Every L2 has at least one Scenario (happy path)
- [ ] Each Feature has As-a / I-want / So-that narrative
- [ ] Scenarios are in business language (no technical jargon)
- [ ] Each scenario has testable Given/When/Then
- [ ] **No composite scenarios** — each Scenario covers one operation/rule
- [ ] **Data-driven capabilities** use `Scenario Outline` + `Examples:` (target ≥10)
- [ ] **State-changing Scenarios** include verification `And` steps (audit, UI, cascade, metadata)
- [ ] Tags applied consistently (`@capability`, `@level1`, `@level2`, per-L2, semantic flow-type)
- [ ] Every dependency edge in the cross-capability section has a `@cross-capability` Scenario
- [ ] If OpenSpec in use: `.feature` files in `specs/`, linked to a proposal
- [ ] Feature file syntax is valid
- [ ] Step definition stubs planned or matched

## Gate (BLOCK)

- L1 capability lacks a Feature file
- L2 capability has no Scenario
- Feature missing As-a/I-want/So-that narrative
- Scenarios contain technical jargon instead of business language
- Composite Scenario tests multiple operations without being split
- Same scenario duplicated across Features
- Dependency edge with no corresponding `@cross-capability` Scenario
- State-changing Scenario lacks verification `And` steps
- OpenSpec in use but Gherkin not linked to a proposal
- Invalid Feature file syntax

## Gate (WARN)

- Data-driven capability does not use `Scenario Outline` with `Examples:`
- Scenario Outline has fewer than 3 data rows where more would improve coverage
- High-risk capability has no exception/boundary scenario
- Scenario lacks a semantic flow-type tag (`@happy-path`, `@alternative`, `@exception`,
  `@boundary`, `@cross-capability`, `@security`, `@concurrency`)
- Tags inconsistent across Features
- Step definition stubs not yet planned
- Low-confidence items in input included without flagging
