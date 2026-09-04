# Waterfall Blueprint — Complete Software Specification Generator

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills) standard) that transforms a vague idea or partial requirements into a **complete, buildable specification package** using the thorough, phase-gated approach from 1990s-era software engineering. The `SKILL.md` in this folder is the single source of truth — the same file is exposed to any compatible tool via discovery paths, no text rewriting required.

## The Problem

Teams that skip upfront specification pay for it later: ambiguous requirements lead to rework, scope creep leads to missed deadlines, and missing test plans lead to escaped defects. The90s waterfall wasn't bureaucratic overhead — it was risk elimination through completeness. But few teams today know how to produce that level of documentation, and even fewer have the time to figure it out from scratch.

## What It Does

Given a project idea, partial requirements, or a rough description, this skill runs a **seven-phase interactive pipeline** that produces a complete specification package:

| Phase | Output Document | Standard |
|-------|----------------|----------|
| Intake & Scoping | Project Context Document (PCD) | — |
| Requirements Elicitation | Software Requirements Specification (SRS) | IEEE 830-1998 |
| High-Level Design | Software Design Description (SDD) | IEEE 1016 |
| Detailed Design | Detailed Design Specifications (DDS) | IEEE 1016 |
| Implementation Planning | Implementation Plan | DOD-STD-2167A |
| Test Planning | Test Plan | IEEE 829 |
| Deployment & Maintenance | Deployment Plan, Maintenance Plan, CM Plan | CMM Level 3 |

The pipeline is **interactive, not autonomous**. The agent asks follow-up questions, drills down on vagueness, flags contradictions, and validates completeness at every gate before proceeding.

## What It Covers

- **Interactive requirements elicitation** — Systematic drill-down through 8 requirement categories (functional, interfaces, performance, database, security, safety, quality, constraints) with follow-up questions that leave no gap.
- **IEEE-standard document generation** — SRS (IEEE 830), SDD (IEEE 1016), DDS, Test Plan (IEEE 829) with complete section structures.
- **Bidirectional traceability** — Requirements Traceability Matrix (RTM) linking business needs → requirements → design modules → test cases.
- **Quality gates** — Formal gate reviews between every phase with checklists, findings, and go/no-go decisions.
- **Configuration management baselines** — Functional, Allocated, Developmental, and Product baselines identified and documented.
- **Anti-pattern detection** — Identifies 10 common specification anti-patterns (vague requirements, missing error conditions, unbounded scope, etc.).
- **CMM Level 3 practices** — Requirements management, configuration management, process and product quality assurance.

## Use It

Open any supported AI coding tool in a project where the skill is installed and ask:

> "I want to build a customer support ticketing system. Help me create a complete specification."

or

> "Generate an SRS for a document management system with user authentication and full-text search."

or

> "I have a partial requirements doc. Review it against IEEE 830 and fill in the gaps."

The agent recognizes the intent from the skill's `description` and follows the seven-phase pipeline interactively.

## Companion Skills

This skill pairs well with other skills in the collection:

- **capability-to-gherkin** — After the SRS is complete, convert capabilities into executable Gherkin test scenarios
- **backoffice-design** — Apply backoffice UX patterns during the design phases
- **pragmatic-development** — Apply pragmatic engineering practices during implementation planning
- **code-quality-review** — Reference clean code principles in the coding standards section
- **software-metrics-quality** — Collect and track software quality metrics in the QA plan

## Eval Scenarios

`evals/evals.json` defines scenarios covering:

1. **Full specification from vague idea** — Tests the agent's ability to elicit requirements through follow-up questions and produce a complete SRS with traceability.
2. **Contradiction detection** — Tests whether the agent flags contradictory requirements before proceeding to design.
3. **Anti-pattern detection** — Tests review of an existing spec for vague requirements, missing IDs, implementation leakage, and missing traceability.

## Credits

Standards and methodologies referenced by this skill:

- [IEEE 830-1998](https://standards.ieee.org/standard/830-1998.html) — Recommended Practice for Software Requirements Specifications
- [IEEE 1016-2009](https://standards.ieee.org/standard/1016-2009.html) — Standard for Information Technology — Systems Design — Software Design Descriptions
- [IEEE 829-2008](https://standards.ieee.org/standard/829-2008.html) — Standard for Software and System Test Documentation
- [DOD-STD-2167A](https://www.everyspec.com/DOD-STD/DOD-STD-2167A/) — Defense Systems Software Development
- [CMMI](https://cmmiinstitute.com/) — Capability Maturity Model Integration
- [ISO 9001:2015](https://www.iso.org/iso-9001-quality-management.html) — Quality Management Systems
- Steve McConnell, *Rapid Development* (1996) — Software estimation and planning
- Steve McConnell, *Code Complete* (1993/2004) — Construction practices
