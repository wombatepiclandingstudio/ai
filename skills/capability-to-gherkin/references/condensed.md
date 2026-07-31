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
exception, boundary, and cross-capability scenarios where meaningful.

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
  @capability @level2 @happy-path
  Scenario: <L2 Name> — happy path
    Given <preconditions>
    When <triggering event>
    Then <expected outcome>
```

### Stage 4 — Step Definition Mapping
Match Gherkin steps to existing step definitions. Generate stubs for new steps using the
project's BDD framework convention (Cucumber, SpecFlow, Behat). Use data tables for complex
inputs. Apply tags consistently: `@capability`, `@level1`, `@level2`, per-L2 tag.

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
- **Feature narrative** — every Feature must have As-a / I-want / So-that.
- **Tags** — `@capability`, `@level1`, `@level2`, plus a per-L2 tag.

## Anti-Patterns

1. **Technical language** — steps reference implementation details → rewrite in business terms
2. **Implementation scenarios** — scenarios describe *how* not *what* → focus on outcomes
3. **Missing narrative** — Feature lacks As-a/I-want/So-that → every Feature must state actor + value
4. **Giant scenarios** — one scenario tests everything → split into granular scenarios
5. **Duplicate scenarios** — same steps across Features → consolidate, use tags
6. **No OpenSpec linkage** — when OpenSpec is in use, specs must link to a proposal

## Pre-Delivery Checklist

- [ ] Every L1 capability has a `.feature` file
- [ ] Every L2 has at least one Scenario (happy path)
- [ ] Each Feature has As-a / I-want / So-that narrative
- [ ] Scenarios are in business language (no technical jargon)
- [ ] Each scenario has testable Given/When/Then
- [ ] Tags applied consistently (`@capability`, `@level1`, `@level2`, per-L2)
- [ ] Cross-capability dependencies reflected as Given preconditions
- [ ] No duplicate scenarios across Features
- [ ] If OpenSpec in use: `.feature` files in `specs/`, linked to a proposal
- [ ] Feature file syntax is valid
- [ ] Step definition stubs planned or matched

## Gate (BLOCK)

- L1 capability lacks a Feature file
- L2 capability has no Scenario
- Feature missing As-a/I-want/So-that narrative
- Scenarios contain technical jargon instead of business language
- Same scenario duplicated across Features
- OpenSpec in use but Gherkin not linked to a proposal
- Invalid Feature file syntax

## Gate (WARN)

- High-risk capability has no exception/boundary scenario
- Tags inconsistent across Features
- Step definition stubs not yet planned
- Low-confidence items in input included without flagging
