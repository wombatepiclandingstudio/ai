# Refactoring Catalog

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills)
standard) that applies **Martin Fowler's refactoring catalog**. The `SKILL.md` in this folder is
the single source of truth — the same file is exposed to any compatible tool via discovery paths,
no text rewriting required.

## What It Does

Given code that needs restructuring, the skill guides the agent through:

- **Code Smell Detection** — Identify Bloaters, OO Abusers, Change Preventers, Dispensables, and Couplers
- **Refactoring Techniques** — Full catalog: Composing Methods, Moving Features, Organizing Data, Simplifying Conditionals, Simplifying Method Calls, Dealing with Generalization
- **Safe Refactoring Process** — Tests-first, small incremental steps, behavior preservation
- **When to Refactor** — Rule of Three, before/after features, during bug fixes, code review

## Use It

Open any supported AI coding tool in a project where the skill is installed and ask:

> "This method is too long — refactor it"

or

> "Identify code smells in this module and suggest refactorings"

The agent recognizes the intent from the skill's `description` and applies the appropriate
refactoring technique from Fowler's catalog.

## Companion Skills

| Skill | Connection |
|-------|------------|
| `clean-code-review` | Clean Code defines the goal state after refactoring — naming, functions, SOLID |
| `legacy-code-workshop` | Legacy Code techniques enable refactoring by breaking dependencies and adding tests |
| `pragmatic-development` | Pragmatic principles (DRY, orthogonality) are both causes and solutions for code smells |
| `software-metrics-quality` | Metrics tell you WHERE to refactor (high CC → Extract Method, high LCOM → Extract Class) |
