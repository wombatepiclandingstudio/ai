---
name: capability-to-gherkin
description: >
  Convert a business capability map into executable Gherkin BDD specifications.
  Paste a capability map (JSON, Markdown, or YAML) describing your business
  capabilities, actors, and value statements — get runnable .feature files with
  scenarios, data tables, verification steps, and cross-capability coverage.
  Includes triage of non-feature items (invariants, NFRs, deferred), regression
  scenarios from bug findings, and machine validation. Works with Cucumber,
  SpecFlow, and Behat.
---

**Scope:** This skill converts structured business capability maps into executable Gherkin BDD
specifications. It produces `.feature` files traceable to business capabilities. It does not write
step definitions, test runners, or test code — it produces specifications and plans for
step definition stubs.

# Business Capability to Gherkin Converter

## Zero — Core Concepts

Transforms a structured business capability map into executable Gherkin specifications
(Features + Scenarios), creating a traceable bridge between enterprise architecture artifacts
and behavior-driven development (BDD) test suites. Includes triage of non-feature capabilities
(invariants, NFRs, deferred items), regression scenarios from bug findings, and machine
validation of the generated Gherkin.

**Input formats accepted:** Markdown (hierarchical document), JSON (structured object), YAML.
If unspecified, assume Markdown (most common; format produced by legacy-capability-extractor).

**Prerequisites:**
1. A capability map — typically `a6-domain-model.md` from legacy-capability-extractor, or any
   document/JSON listing L1 capabilities, L2 sub-capabilities, descriptions, actors, and value
   statements.
2. Domain understanding — familiarity with business actors and outcomes. Infer actors from
   capability descriptions if not explicit.
3. Known findings (optional but valuable) — bug lists, HIGH-severity findings, incident history,
   or "dead code" notes. These become regression scenarios in Stage 3.
4. OpenSpec (optional) — if the project uses OpenSpec, place `.feature` files into `specs/`.

**Gherkin conventions:**
- Feature titles = L1 capability name. Keep concise.
- Feature descriptions = capability description + "So that" business value.
- One actor per Feature — split along actor seams if multiple personas appear.
- `Rule:` blocks (Gherkin 6) to group related scenarios.
- Language: business terms only. No framework, database, or class names.
- One rule per scenario — split composite scenarios into one per operation.
- Background: shared preconditions only. No feature-specific setup.
- Data tables for complex multi-field inputs. Ordered logically.
- Tags: every scenario carries `@capability`, `@level2`, per-L2 tag, and semantic flow-type tag.

## One — When to Use

- The user has a capability map (JSON, Markdown, or YAML) and asks to convert it to Gherkin
- The user mentions "Gherkin," "Cucumber," "BDD," "feature files," or "executable specifications"
  in the context of capability analysis
- The user wants to create BDD test scenarios from a legacy-code capability extraction
- OpenSpec is in the project and the user wants Gherkin files added to `specs/`
- The user asks: "turn these capabilities into tests," "generate BDD scenarios from the domain
  model," or "create executable specs from the capability map"

**Trigger phrases:** "convert capabilities to Gherkin", "turn capability map into BDD tests",
"generate Gherkin from capabilities", "create feature files from capability map", "Gherkin",
"Cucumber", "BDD", "feature files", "executable specifications", "OpenSpec"

**Do not use** when:
- The user only wants a written report or diagram — not executable specifications
- There is no capability map or domain model available as input
- The request is about writing test code (step definitions, test runners) rather than specifications
- The user wants unit tests or integration tests (not Gherkin/BDD scenario specs)

## Two — Hard Rules

> **HR-1.** Never generate scenarios from an undispositioned map. A scenario for a deferred or
> dead capability creates a false test obligation. Assign every L2 exactly one disposition
> (feature, invariant, nfr-doc, deferred+reason) before Stage 1.

> **HR-2.** Account for every L2. The traceability report must show a disposition for 100% of
> input items; nothing is silently dropped or silently converted.

> **HR-3.** A Feature carries exactly one business actor and one value proposition ("As a X /
> I want / So that"). Two "As a" personas in one Feature is an anti-pattern — split along
> actor seams with lineage tags back to the L1.

> **HR-4.** Split composite scenarios. One operation per Scenario. Never combine CRUD lifecycle
> into one Scenario — each step gets its own Given/When/Then.

> **HR-5.** Every state-changing Scenario must end with relevant `And` verification steps:
> audit log entry, visible state, cascade effects, response metadata.

> **HR-6.** For every dependency edge in the capability map's cross-capability section, produce
> at least one `@cross-capability` Scenario.

> **HR-7.** Use Scenario Outline with Examples for data-driven rules (rate limits, media types,
> PII types, settings, filters). Size by distinct business outcome: <3 rows questions the outline,
> >10 questions the split.

> **HR-8.** Bug findings from the map ride along as `@regression` scenarios. Pin the bug's
> business outcome as a requirement — stated as what the business observes, never as the broken
> implementation.

> **HR-9.** Invariants ship with their owner. An invariant dispositioned away from its owning
> feature is lost — bind it to the feature whose data it protects.

> **HR-10.** Machine validation (Stage 6) is mandatory. Two passes: parser validation and
> adversarial self-review. Self-graded checklists are not gates.

> **HR-11.** Business language only in scenario steps. No database names, class names, HTTP codes,
> or framework methods.

> **HR-12.** Exact-string coupling: exact codes/labels only appear where the string IS the
> business rule itself. Never pin audit codes, error codes, or UI copy that no decision has defined.

## Three — Decision Trees

```
Does the user have a capability map?
├── Yes → Is it in JSON/Markdown/YAML format?
│   ├── Yes → Run the 7-stage conversion pipeline
│   └── No → Ask for JSON, Markdown, or YAML format
├── No → Is there a legacy-codebase to extract from?
│   ├── Yes → Use legacy-capability-extractor first, then convert
│   └── No → Ask for a capability map or codebase path
```

```
Stage 0 Triage — for each L2 (and L1 without L2s):
├── Is it testable business behavior?
│   ├── Yes → Disposition: `feature` → proceeds to Feature/Scenario generation
│   └── No → Is it a rule that must hold (not a user action)?
│       ├── Yes → Disposition: `invariant` → merge as acceptance criteria into owning feature
│       └── No → Is it an architecture/data-layer/policy concern?
│           ├── Yes → Disposition: `nfr-doc` → document in traceability report, NOT a Feature
│           └── No → Is it out of scope by explicit decision?
│               ├── Yes → Disposition: `deferred(reason)` → no scenarios, record reason
│               └── No → Disposition: `INVESTIGATE` → flag for human review
```

```
Feature splitting decision:
├── Does the L1 have a single actor + single value seam?
│   ├── Yes → One Feature for the L1
│   └── No → Does it have multiple actor or rule seams?
│       ├── Yes → Split into sub-features: <l1>a-, <l1>b-…
│       │   └── Each with lineage tag back to the L1, one actor per Feature
│       └── No → Still one Feature, but verify no persona leakage
```

```
Scenario type selection (per L2):
├── Happy Path → mandatory for every feature-dispositioned L2
├── Alternative Flow → valid but different path
├── Exception / Error → error conditions, validation failures
├── Boundary / Edge → threshold values (for high-risk capabilities)
├── Cross-Capability → exercises dependency edges between capabilities
├── Security → authentication, authorization, PII handling
├── Concurrency → race conditions, rate-limit behavior
└── Regression → pins bug findings as acceptance criteria (@regression tag)
```

```
OpenSpec integration:
├── Is OpenSpec detected in the project?
│   ├── Yes → /opsx:propose, place .feature in specs/, update tasks.md, link back to capability map
│   │   └── /opsx:archive when implementation complete
│   └── No → Generate .feature files into features/ or specs/
│       └── Report that OpenSpec integration was skipped
```

## Four — Conversion Pipeline

The conversion follows a seven-stage pipeline. Each stage produces an intermediate artifact
that feeds the next. If a context break occurs, resume from the last completed output.

```
Triage & Disposition → Input Analysis → Feature Mapping → Scenario Generation →
Step Definition Planning → OpenSpec Integration → Validation & Self-Review
```

### Stage 0: Triage & Disposition (mandatory)

Real capability maps are not pure feature wishlists: they contain dead code, architecture
concerns posing as capabilities, cross-cutting invariants, and items deferred by earlier
decisions. **Never generate scenarios from an undispositioned map.**

| Disposition | Meaning | Handling |
|---|---|---|
| `feature` | Testable business behavior | Proceeds to Feature/Scenario generation |
| `invariant` | A rule that must hold, not a thing users do | Merged as acceptance criteria / named scenarios into the `feature` that owns that data |
| `nfr-doc` | Architecture, data-layer, or policy concern | Documented in traceability report; NOT a Feature |
| `deferred(reason)` | Out of scope by explicit decision | No scenarios; reason recorded in traceability report |

### Stage 1: Input Analysis

1. Parse the input (Markdown / JSON / YAML).
2. Identify capability levels: L1 (business capability), L2 (executable operation).
3. Extract for each: name, description, business value, actors, relationships/dependencies.
4. If input is from legacy-capability-extractor, pull cross-capability dependency map.

### Stage 2: Feature Mapping

| Capability Element | Gherkin Element |
|---|---|
| L1 Capability | Feature (or feature set if multi-seam) |
| L2 Capability | Scenario |
| Capability description | Feature description line |
| Business actor | "As a" in Feature |
| Business value | "So that" in Feature |
| Preconditions | `Given` steps |
| Triggering events | `When` steps |
| Expected outcomes | `Then` steps |
| Capability dependencies | `Given` in Background |

### Stage 3: Scenario Generation

For each `feature`-dispositioned L2, generate at minimum a happy-path scenario. Add additional
scenario types when dependencies suggest them. Use Scenario Outline + Examples for data-driven
capabilities. Standardized verification steps end every state-changing scenario.

### Stage 4: Step Definition Mapping

0. **Greenfield projects** — skip framework-specific stubs; group steps by harness need
   (auth/tenancy context, audit assertions, clock control, concurrency helpers, notification
   capture, report/export harness).
1. **Reuse existing steps** — match Gherkin steps to existing step methods before creating new.
2. **Create new steps** — stubs using project's BDD framework convention.
3. **Data tables** — for complex multi-field inputs rather than long `And` chains.
4. **Tags** — `@capability`, `@level1`, `@level2`, per-L2 tag, plus semantic tags from:
   `@happy-path`, `@alternative`, `@exception`, `@boundary`, `@cross-capability`,
   `@security`, `@concurrency`, `@regression`.

### Stage 5: OpenSpec Integration (optional)

If OpenSpec detected (`openspec.yaml` or `.opspec/` directory):
1. `/opsx:propose` with title "Add Gherkin specs for `<L1 Capability>`."
2. Place `.feature` files in OpenSpec `specs/` directory.
3. Update `tasks.md` with implementation steps.
4. Link feature files back to original capability map.
5. `/opsx:archive` when implementation complete.

If OpenSpec not detected, generate `.feature` files into `features/` or `specs/` directory.

### Stage 6: Machine Validation & Adversarial Self-Review (mandatory)

**Pass 1 — Machine validation.** Run generated files through a real Gherkin parser
(e.g. `@cucumber/gherkin` for Node, `gherkin-parser`/`behave` for other stacks).
Report: file count, scenario count, outline count, data-driven execution count, parse errors.
Malformed tables, broken indentation, orphaned steps must be fixed before delivery.

**Pass 2 — Adversarial self-review.** Re-read generated specs as a skeptic:
1. **Contradictory windows** — threshold/outline values contradict each other
2. **Invented attributes** — step references a field/type/enum the domain model does not have
3. **Uniquely observable outcomes** — every `Then` is a single checkable fact; OR cannot be asserted
4. **Exact-string coupling** — exact codes/labels where the string is not itself the business rule
5. **Vague assertions** — name no observable; rewrite as count/state assertion
6. **Persona leakage** — does any Feature quietly serve two actors?

Findings fixed in place; validation report records both passes' results.

## Five — Error Handling

| Error | Detection | Resolution |
|-------|-----------|------------|
| No capability map available | Input missing or empty | Ask for JSON/Markdown/YAML capability map |
| Undispositioned L2 items | Stage 0 not completed or incomplete | Run Stage 0 for all L2s; 100% coverage required |
| Deferred item has scenarios | Scenario generated for `deferred` disposition | Remove scenarios for deferred items |
| Invariant not bound to owner | Invariant dispositioned away from owning feature | Bind invariant to the feature whose data it protects |
| Missing Feature file | `feature`-dispositioned L1 lacks `.feature` file | Generate Feature file with proper narrative |
| Missing Scenario | `feature`-dispositioned L2 lacks Scenario | Generate at least happy-path Scenario |
| Two actors in one Feature | "As a X" and "As a Y" in same Feature | Split along actor seams; add lineage tags |
| Composite Scenario | Multiple operations in one Scenario (CRUD lifecycle) | Split into one Scenario per operation |
| Technical jargon in steps | DB names, class names, HTTP codes in Gherkin | Rewrite in business language |
| Missing verification steps | State-changing Scenario without `And` steps | Add audit log, visible state, cascade, metadata checks |
| Duplicate scenarios | Same steps across multiple Features | Consolidate; use tags for differentiation |
| Missing cross-capability | Dependency edge without `@cross-capability` Scenario | Add `@cross-capability` Scenario for each edge |
| Invalid Feature syntax | Missing colons, mismatched indentation, orphaned steps | Run parser validation; fix syntax errors |
| Machine validation skipped | Stage 6 not executed | Run both Pass 1 (parser) and Pass 2 (adversarial) |
| OR-shaped outcome | "rejected or waitlisted" in `Then` step | Pin the policy; assert one specific outcome |
| Vague assertion | "system state is consistent" with no observable | Rewrite as count/state assertion |
| Missing semantic tag | Scenario lacks `@happy-path`, `@exception`, etc. | Add appropriate semantic flow-type tag |
| OpenSpec not linked | OpenSpec present but `.feature` files not linked | Create proposal and link specs to tasks |
| Low-confidence items included | Input had low-confidence items not flagged | Flag in report with specific questions |

## Six — Key Rules

- **Split composite scenarios.** One operation per Scenario. Never combine CRUD lifecycle.
  A CRUD lifecycle becomes four independent Scenarios.
- **Data-driven capabilities** (rate limits, media types, PII types, setting keys, filter values)
  use `Scenario Outline` with `Examples:` tables. Size by distinct business outcome.
- **Standardized verification steps.** Every state-changing Scenario ends with relevant `And`
  steps: audit log entry (`recorded for the <event>`), visible state (`the <thing> should appear
  in the <view/list/feed>`), cascade effects, response metadata. Exact strings ONLY when the
  string itself is the business rule.
- **Regression scenarios.** Each meaningful bug finding becomes a named `@regression` scenario
  pinning the business outcome — stated as what the business observes, never as the broken
  implementation.
- **Cross-capability scenarios.** For every dependency edge, produce at least one
  `@cross-capability` Scenario.
- **`Rule:` grouping.** Use `Rule:` blocks to group related scenarios inside a Feature.
- **Tags consistency.** Every Scenario carries: `@capability`, `@level2`, per-L2 tag, and a
  semantic flow-type tag.

## Seven — Evidence & Checklist

**Pre-delivery checklist:**

- [ ] Every L2 has an explicit Stage 0 disposition (feature / invariant / nfr-doc / deferred+reason);
      100% accounted for in traceability report
- [ ] Every `feature`-dispositioned L1 has a corresponding `.feature` file; multi-seam L1s split
      with lineage, one actor per Feature
- [ ] Every `feature`-dispositioned L2 has at least one Scenario (happy path)
- [ ] Bug findings have `@regression` scenarios stating the business outcome
- [ ] Each Feature includes the "As a / I want / So that" narrative with a real business actor
- [ ] Scenarios are written in business language (no technical implementation details)
- [ ] Each scenario has clear, testable Given/When/Then steps
- [ ] **No composite scenarios exist** — each Scenario tests a single operation or business rule
- [ ] **Data-driven capabilities** use `Scenario Outline` + `Examples:` tables sized by outcome
- [ ] Every state-changing Scenario ends with verification `And` steps (audit log, visible state,
      cascade effects, response metadata)
- [ ] Machine validation ran (Stage 6 Pass 1): parser output reported, 0 parse errors
- [ ] Tags applied consistently (`@capability`, `@level1`, `@level2`, per-L2 tag, semantic flow-type)
- [ ] Every dependency edge in the cross-capability section has a `@cross-capability` Scenario
- [ ] Cross-capability dependencies from input are reflected as Given preconditions
- [ ] No duplicate scenarios exist across Features
- [ ] If OpenSpec in use: `.feature` files in `specs/`, linked to a proposal
- [ ] If OpenSpec absent: `.feature` files in conventional `features/` directory
- [ ] Step definition stubs planned (or existing steps matched) for every step
- [ ] Feature file syntax validates (no missing colons, no orphaned steps)

**Evidence required:**

- Stage 0 disposition table (every L2: feature / invariant / nfr-doc / deferred+reason);
- Generated `.feature` file(s) — one per single-actor Feature, with Scenarios per L2;
- Mapping table (capability → Feature/Scenario traceability), including sub-feature lineage;
- Bug-finding → `@regression` scenario mapping (when map carried findings);
- List of step definitions needed (new stubs vs. matched existing steps), or harness-need
  grouping for greenfield projects;
- Confirmation that no composite scenarios exist;
- Confirmation that data-driven capabilities use `Scenario Outline` + `Examples:` tables;
- Confirmation that every state-changing Scenario includes verification `And` steps;
- Confirmation that every cross-capability dependency edge has a `@cross-capability` Scenario;
- Stage 6 validation report: parser output (counts + 0 errors) and adversarial self-review
  findings with fixes;
- If OpenSpec in use: OpenSpec proposal and linkage between specs and tasks;
- Validation report noting any missing capabilities, duplicates, syntax issues, or gate violations.

**Gate implications — BLOCK when:**

- An L2 lacks an explicit Stage 0 disposition, or dispositions do not account for 100%
  of input items;
- A deferred item has scenarios generated for it;
- An invariant was dispositioned but not bound to an owning feature;
- A `feature`-dispositioned L1 lacks a corresponding Feature file;
- A `feature`-dispositioned L2 has no Scenario generated;
- A Feature is missing the "As a / I want / So that" narrative, or carries two personas;
- Scenarios contain technical jargon instead of business language;
- A composite Scenario tests multiple operations without being split;
- The same scenario appears duplicated across multiple Feature files;
- OpenSpec is in use but Gherkin files are not linked to an OpenSpec proposal;
- Feature file syntax is invalid or machine validation was not run;
- A dependency edge has no corresponding `@cross-capability` Scenario;
- A state-changing Scenario lacks verification `And` steps.

**Gate may WARN when:**

- An OR-shaped outcome appears in a `Then` step;
- A vague, non-observable assertion appears;
- Exact codes/labels are asserted where the string is not the business rule;
- A data-driven capability does not use `Scenario Outline` with `Examples:` tables;
- A Scenario Outline has < 3 or > ~10 data rows;
- A high-risk capability has no exception/boundary scenario;
- A bug finding has no corresponding `@regression` scenario;
- A scenario lacks a semantic flow-type tag;
- Tags use inconsistent naming across Features;
- Step definition stubs are not yet planned;
- Low-confidence items were included without flagging.

**Reference guides:**

| Reference | Description |
|-----------|-------------|
| `references/anti-patterns.md` | Full list of 14 anti-patterns with symptoms and fixes |
| `references/scenario-generation.md` | Templates, examples, and verification step patterns |
| `references/gherkin-reference.md` | Full Gherkin syntax guide and framework-specific step-definition conventions |
| `references/openspec-integration.md` | Full OpenSpec integration workflow |
| `references/condensed.md` | Condensed version for tools that don't read SKILL.md format |

## Test Cases

### Test Case 1: Basic capability map conversion
**Input:** A capability map with 2 L1 capabilities and 3 L2 sub-capabilities:
```json
{
  "capabilities": [
    {
      "name": "Customer Management",
      "description": "Manages customer lifecycle",
      "actors": ["Customer Service Rep"],
      "value": "Enable personalized service",
      "subcapabilities": [
        {"name": "Customer Registration", "description": "Register new customers"},
        {"name": "Profile Updates", "description": "Update customer information"}
      ]
    },
    {
      "name": "Order Processing",
      "description": "Handle order lifecycle",
      "actors": ["Fulfillment Team"],
      "value": "Ensure timely delivery",
      "subcapabilities": [
        {"name": "Order Creation", "description": "Create new orders"}
      ]
    }
  ]
}
```
**Expected output:** At least 2 `.feature` files with valid Gherkin syntax, each Feature containing "As a / I want / So that" narrative, at least one Scenario per L2, `@capability` and `@level2` tags, and `Given/When/Then` steps in business language.
**Assertion:** Every L2 has at least one Scenario. No technical jargon (database names, class names) in steps.

### Test Case 2: Triage of non-feature capabilities
**Input:** A capability map including an invariant ("stats read transactions, not plan templates") and a deferred item ("Gamification — deferred to Phase 3").
**Expected output:** A disposition table showing `invariant` and `deferred(reason)` dispositions. No Scenario generated for the deferred item. The invariant is documented as acceptance criteria in the owning Feature.
**Assertion:** 100% of L2 items have a disposition. No false test obligations for deferred items.

### Test Case 3: Cross-capability scenarios
**Input:** A capability map with a dependency: "Order Processing depends on Customer Management."
**Expected output:** At least one `@cross-capability` Scenario that exercises the dependency, with the dependent capability referenced in `Given` preconditions.
**Assertion:** Every dependency edge in the map has a corresponding `@cross-capability` Scenario.
