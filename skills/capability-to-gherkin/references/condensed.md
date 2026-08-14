# Business Capability to Gherkin (condensed)

This is a condensed version of `SKILL.md` for tools that do not natively read the Agent
Skills `SKILL.md` format. Point your tool's memory/instructions file (e.g. `AGENTS.md`,
`CLAUDE.md`, `GEMINI.md`, `.windsurferules`) at this content, or paste it into the relevant
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

### Stage 0 — Triage & Disposition (mandatory)
Real maps contain dead code, architecture concerns, invariants, and deferred items. Assign
every L2 exactly one disposition BEFORE generating anything:

| Disposition | Handling |
|---|---|
| `feature` | Proceeds to Feature/Scenario generation |
| `invariant` | Merged as acceptance criteria into the `feature` that owns that data |
| `nfr-doc` | Documented in the traceability report; NOT a Feature |
| `deferred(reason)` | No scenarios; reason recorded in the report |

100% of input items must be accounted for. Never generate scenarios for deferred/dead
capabilities — that creates false test obligations. Bug findings ride along as `@regression`
scenarios (Stage 3).

### Stage 1 — Input Analysis
Parse the capability map (Markdown/JSON/YAML). Extract L1/L2 capabilities, descriptions,
actors, value statements, and cross-capability dependencies.

### Stage 2 — Feature Mapping
| Capability Element | Gherkin Element |
|-------------------|-----------------|
| L1 Capability | Feature (or feature set if multi-seam) |
| L2 Capability | Scenario |
| Description | Feature description |
| Business actor | "As a" narrative |
| Business value | "So that" statement |
| Preconditions | `Given` steps |
| Triggering events | `When` steps |
| Expected outcomes | `Then` steps |
| Dependencies | `Given` in Background |

**One actor + one value per Feature.** An L1 with multiple actor/rule seams splits into
sub-features (`<l1>a-`, `<l1>b-` …) with lineage back to the L1. Two "As a" personas in one
Feature is an anti-pattern.

### Stage 3 — Scenario Generation
For each `feature`-dispositioned L2, generate at least a happy-path Scenario. Add
alternative-flow, exception, boundary, cross-capability, security, concurrency, and
regression scenarios where meaningful.

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
    And an audit log entry should be recorded for the <event>
    And the response metadata should include a timestamp
```

**Regression scenarios.** Each meaningful bug finding from the map becomes a named
`@regression` scenario pinning the bug's business outcome as a requirement — stated as what
the business observes, never as the broken implementation.

**Split composite scenarios.** Never combine multiple operations in one Scenario. A CRUD
lifecycle becomes four independent Scenarios (create, read, update, delete), each with its
own Given/When/Then.

**Use Scenario Outline + Examples tables** for data-driven capabilities (rate limits, media
types, PII types, setting keys, filter values). Size by outcome: one row per distinct
business outcome; <3 rows questions the outline, >10 questions the split. Never pad.

**Standardized verification steps (outcome-descriptive).** Every state-changing Scenario
ends with `And` steps drawn from: audit log entry (`recorded for the <event>`), visible
state (`the <thing> should appear in the <view/list/feed>`), cascade effects, response
metadata. Exact strings ONLY when the string itself is the business rule — never pin audit
codes, error codes, or UI copy that no decision has defined.

**Cross-capability scenarios.** For every dependency edge in the capability map's
cross-capability section, generate at least one `@cross-capability` Scenario.

**`Rule:` grouping.** Use `Rule:` blocks to group related scenarios inside a Feature.

**Tags.** Every Scenario carries: `@capability`, `@level2`, per-L2 tag, and a semantic
flow-type tag: `@happy-path`, `@alternative`, `@exception`, `@boundary`, `@cross-capability`,
`@security`, `@concurrency`, `@regression`.

### Stage 4 — Step Definition Mapping
If the project already has step definitions, match Gherkin steps to them and stub the rest
per the project's framework convention (Cucumber, SpecFlow, Behat). If greenfield (no
runner, no stepdefs), skip framework stubs — instead group steps by harness need
(auth/tenancy context, audit assertions, clock control, concurrency helpers, notification
capture, report/export harness). Use data tables for complex inputs. Apply tags consistently.

### Stage 5 — OpenSpec Integration (if OpenSpec present)
1. `/opsx:propose` — create a change proposal
2. Place `.feature` files in `specs/`
3. Update `tasks.md` with step-definition and test-data tasks
4. Link specs back to the original capability map
5. `/opsx:archive` when implementation is complete

If OpenSpec is **not** detected, generate `.feature` files into `features/` and report that
integration was skipped.

### Stage 6 — Machine Validation & Adversarial Self-Review (mandatory)
**Pass 1 — Machine validation.** Parse every generated file with a real Gherkin parser
(e.g. `@cucumber/gherkin`); report file/scenario/outline counts and parse errors. 0 errors
is the floor.

**Pass 2 — Adversarial self-review.** Re-read as a skeptic: (1) contradictory threshold
windows (off-by-ones between scenarios); (2) steps referencing fields/enums the domain
model lacks; (3) OR-shaped outcomes that cannot be asserted — pin the policy; (4) exact-string
coupling to unborn vocabularies; (5) vague assertions naming no observable; (6) persona
leakage (two actors in one Feature). Fix findings in place; record both passes in the
validation report.

## Gherkin Conventions

- **Language** — business terms only. No DB tables, class names, HTTP codes, or framework
  methods in scenario steps.
- **One rule per scenario** — each scenario tests one business outcome.
- **No composite scenarios** — split CRUD and multi-operation flows into one Scenario per
  operation.
- **Feature narrative** — every Feature has exactly one As-a / I-want / So-that.
- **Data tables / Scenario Outline** — use for variable-input capabilities; size rows by
  distinct business outcome.
- **Verification steps** — every state-changing Scenario ends with audit, visible-state,
  cascade, and/or metadata checks, phrased as outcomes.
- **Tags** — `@capability`, `@level1`, `@level2`, per-L2 tag, semantic flow-type tag.

## Anti-Patterns

1. **Technical language** — steps reference implementation details → rewrite in business terms
2. **Implementation scenarios** — scenarios describe *how* not *what* → focus on outcomes
3. **Missing narrative** — Feature lacks As-a/I-want/So-that → every Feature must state actor + value
4. **Composite scenarios** — multiple operations in one Scenario → split into one per operation
5. **Missing verification steps** — state-changing Scenario without audit/visible-state/cascade/metadata checks → add them
6. **Single-value for variable input** — one scenario for rate limits/media types → use Scenario Outline sized by outcome
7. **Duplicate scenarios** — same steps across Features → consolidate, use tags
8. **Missing cross-capability scenarios** — dependency edge without a corresponding `@cross-capability` Scenario → add one
9. **No OpenSpec linkage** — when OpenSpec is in use, specs must link to a proposal
10. **Multi-persona Feature** — two "As a" lines → split along actor seams with lineage
11. **OR-shaped outcome** — "rejected or waitlisted" cannot be asserted → pin the policy
12. **Exact-string coupling** — asserting codes/labels no decision defined → outcome-descriptive steps
13. **Skipping validation** — self-graded checklists are not gates → run Stage 6 both passes

## Pre-Delivery Checklist

- [ ] Every L2 has an explicit Stage 0 disposition; 100% accounted for in the report
- [ ] Every `feature`-dispositioned L1 has a `.feature` file; multi-seam L1s split with lineage, one actor per Feature
- [ ] Every `feature`-dispositioned L2 has at least one Scenario (happy path)
- [ ] Bug findings have `@regression` scenarios stating the business outcome
- [ ] Each Feature has exactly one As-a / I-want / So-that narrative
- [ ] Scenarios are in business language (no technical jargon)
- [ ] Each scenario has testable Given/When/Then
- [ ] **No composite scenarios** — each Scenario covers one operation/rule
- [ ] **Data-driven capabilities** use `Scenario Outline` + `Examples:` sized by outcome
- [ ] **State-changing Scenarios** include verification `And` steps (audit, visible state, cascade, metadata)
- [ ] Machine validation ran: parser output reported, 0 parse errors
- [ ] Tags applied consistently (`@capability`, `@level1`, `@level2`, per-L2, semantic flow-type)
- [ ] Every dependency edge in the cross-capability section has a `@cross-capability` Scenario
- [ ] If OpenSpec in use: `.feature` files in `specs/`, linked to a proposal
- [ ] Step definition stubs planned/matched, or harness-need grouping for greenfield

## Gate (BLOCK)

- An L2 lacks a Stage 0 disposition, or dispositions don't cover 100% of input
- A deferred item has scenarios generated for it
- An invariant was dispositioned but not bound to an owning feature
- `feature`-dispositioned L1 lacks a Feature file, or L2 lacks a Scenario
- Feature missing As-a/I-want/So-that narrative, or carries two personas
- Scenarios contain technical jargon instead of business language
- Composite Scenario tests multiple operations without being split
- Same scenario duplicated across Features
- Dependency edge with no corresponding `@cross-capability` Scenario
- State-changing Scenario lacks verification `And` steps
- OpenSpec in use but Gherkin not linked to a proposal
- Invalid Feature file syntax, or machine validation was not run

## Gate (WARN)

- An OR-shaped outcome appears in a `Then` step
- A vague, non-observable assertion appears ("system state is consistent")
- Exact codes/labels asserted where the string is not the business rule
- Data-driven capability does not use `Scenario Outline` with `Examples:`
- Scenario Outline has fewer than 3 rows (question the outline) or more than ~10 (question the split)
- High-risk capability has no exception/boundary scenario
- A bug finding in the map has no `@regression` scenario
- Scenario lacks a semantic flow-type tag (`@happy-path`, `@alternative`, `@exception`,
  `@boundary`, `@cross-capability`, `@security`, `@concurrency`, `@regression`)
- Tags inconsistent across Features
- Step definition stubs not yet planned
- Low-confidence items in input included without flagging
