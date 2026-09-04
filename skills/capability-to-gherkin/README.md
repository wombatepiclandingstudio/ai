# Capability to Gherkin Converter

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills)
standard) that transforms a **business capability map** into **executable Gherkin specifications**
(Features + Scenarios) for behavior-driven development (BDD). The `SKILL.md` in this folder is
the single source of truth — the same file is exposed to any compatible tool via discovery paths,
no text rewriting required.

## The Problem

Teams that invest in extracting business capability maps from legacy code (via
[legacy-capability-extractor](https://github.com/agentskills/agentskills)) often end up with
excellent architectural documentation that never connects to automated testing. The capability
map lives in one tool, the BDD specs live in another, and the traceability link is lost.

## What It Does

Given a capability map (L1 capabilities + L2 sub-capabilities with descriptions, actors, and
business value statements), this skill runs a five-stage conversion pipeline that produces
executable Gherkin `.feature` files:

| Capability Element   | Gherkin Element    |
|----------------------|--------------------|
| L1 Capability        | Feature            |
| L2 Capability        | Scenario           |
| Description          | Feature description|
| Business actor       | "As a" narrative   |
| Business value       | "So that" statement|
| Preconditions        | `Given` steps      |
| Triggering events    | `When` steps       |
| Expected outcomes     | `Then` steps       |
| Capability dependencies | `Given` in Background |

The pipeline:

1. **Input Analysis** — Parses the capability map (Markdown / JSON / YAML), extracts L1/L2
   capabilities, actors, value statements, and cross-capability dependencies.
2. **Feature Mapping** — Maps each capability element to the corresponding Gherkin structure
   using the transformation table above.
3. **Scenario Generation** — Produces happy-path, alternative-flow, exception, boundary, and
   cross-capability scenarios per L2, all in business language.
4. **Step Definition Mapping** — Matches steps to existing definitions; generates stubs for
   new ones using the project's BDD framework convention.
5. **OpenSpec Integration** (optional) — If OpenSpec is in the project, places `.feature`
   files in `specs/` and links them to an `/opsx:propose` change.

## What It Covers

- **Capability → Gherkin mapping** — Systematic transformation from architectural artifacts to
  executable specifications, preserving traceability.
- **Scenario patterns** — Happy path, alternative flow, exception, boundary, and cross-capability
  scenarios.
- **Business language discipline** — Scenarios describe *what* the system should do, not *how*,
  with anti-patterns for technical jargon and implementation leakage.
- **OpenSpec integration** — Full workflow for `/opsx:propose`, `/opsx:apply`, `/opsx:verify`,
  `/opsx:archive` when OpenSpec is present.
- **Cross-tool compatibility** — The skill works across any Agent Skills-compatible tool.

## Use It

Open any supported AI coding tool in a project where the skill is installed and ask:

> "Convert the capability map in capability-output/a6-domain-model.md into Gherkin features"

or

> "Generate BDD test scenarios from the extracted business capabilities"

or (with OpenSpec in the project):

> "Create an OpenSpec proposal with Gherkin specs for the Customer Management capability"

The agent recognizes the intent from the skill's `description` and follows the five-stage
pipeline.

## Companion: legacy-capability-extractor

This skill is designed to consume the output of **legacy-capability-extractor**. When both
skills are installed in the same project, an agent can run the full workflow:

1. `legacy-capability-extractor` — analyzes legacy code, produces `a6-domain-model.md`
2. `capability-to-gherkin` — reads the domain model, produces `.feature` files

## Eval Scenarios

`evals/evals.json` defines scenarios covering:

1. **Convert** — Transform a capability map into Gherkin Features; checks for proper Feature/Scenario
   structure, business-language narrative, scenario coverage per L2, tags, and syntax validity.
2. **OpenSpec integration** — Generate Gherkin and create an OpenSpec proposal; checks for spec file
   placement in `specs/`, proposal linkage, and task creation.
3. **Review** — Audit generated Gherkin for anti-patterns; checks for technical jargon, missing
   actors, duplicate scenarios, and missing L2 coverage.

## Credits

Skills and documentation referenced by this skill:

- [Agent Skills specification](https://github.com/agentskills/agentskills) — the open standard
  this skill implements.
- [Cucumber Gherkin Reference](https://cucumber.io/docs/gherkin/reference) — official Gherkin
  syntax.
- [Behat Gherkin Guide](https://docs.behat.org/en/v2.5/guides/1.gherkin.html) — business-readable
  DSL documentation.
- [OpenSpec](https://openspec.dev) — specification-driven development workflow.
