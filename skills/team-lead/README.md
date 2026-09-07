# Team Lead — Agent Coordination & Token-Efficient Communication

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills) standard) that coordinates multiple AI agents using proven team management principles and enforcing the **caveman principle** for token-efficient communication. The `SKILL.md` in this folder is the single source of truth.

## The Problem

Multi-agent systems waste tokens on verbose communication. Agents restate context, use preamble, dump full file contents, and send status theater instead of real progress. The result: 10x token cost, context window exhaustion, and degraded output quality.

## What It Does

Given work that needs multiple specialists, this skill runs a **seven-stage coordination pipeline**:

| Stage | What | Output |
|-------|------|--------|
| Work Decomposition | Break into independent tasks | Task list with done conditions |
| Agent Selection | Match tasks to specialists | Assignment matrix |
| Task Assignment | Caveman Handoff protocol | ≤150-token assignments |
| Execution Monitoring | Progress tracking without interruption | Status reports |
| Handoff Management | Explicit inter-agent transfers | HANDOFF messages |
| Conflict Resolution | Priority-hierarchy decisions | Resolution log |
| Integration & Verification | Verify outputs work together | Unified results |

## What It Covers

- **Work decomposition** — Independent tasks, clear done conditions, dependency mapping.
- **Agent selection** — Specialist matching from an available agent registry.
- **Caveman Handoff Protocol** — Structured, ≤150-token task assignments with CONTEXT, OUTPUT, DONE, CONSTRAINTS.
- **Token economy** — Budgets per message type (80-150 tokens), anti-patterns for token waste.
- **Team patterns** — Surgical Team, Parallel Workers, Pipeline, Hub and Spoke.
- **DORA metrics** — Task completion rate, handoff efficiency, conflict rate, rework rate, token efficiency.
- **Conflict resolution** — 5-level priority hierarchy (Safety → Behavior → Metrics → Simplicity → Token Efficiency).

## Use It

> "Coordinate code-quality-reviewer, metrics-analyst, and refactoring-guide to review src/ in parallel"

> "Decompose this feature into tasks and assign to the right agents"

> "I need test cases generated and validated. What's the token-efficient way to do this?"

## Companion Skills

- **waterfall-blueprint** — Produces specifications that agent teams can work from
- **test-case-validation** — Validates test cases produced by the testing agent
- All quality skills in the agent registry are coordination targets

## Credits

- Fred Brooks, *The Mythical Man-Month* (1975/1995) — Surgical teams, Brooks's Law
- Tom DeMarco & Timothy Lister, *Peopleware* (1987) — Team jelling, flow state, environment
- Google Project Aristotle (2015) — Psychological safety, dependability, structure
- DORA State of DevOps Reports (2016-2025) — Four key metrics
- Skelton & Pais, *Team Topologies* (2019) — Four team types, three interaction modes
- Caveman Principle — Say only what matters, nothing extra
