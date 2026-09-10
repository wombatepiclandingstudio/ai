# Team Lead (condensed)

Condensed version of `SKILL.md` for tools that do not natively read the Agent Skills `SKILL.md` format. Canonical source: `SKILL.md`.

## Trigger Phrases

- "team lead", "orchestrate", "coordinate", "delegate", "assign", "parallel agents"
- "token economy", "caveman", "concise communication", "handoff"
- "team management", "Peopleware", "Project Aristotle", "DORA", "Team Topologies"
- "decompose", "distribute", "multi-agent"

## When to Use

- Multiple agents needed for parallel work
- Communication overhead is wasting tokens
- Tasks need decomposition and specialist assignment
- Inter-agent handoffs need structure

## Do Not Use When

- Task is simple enough for one agent
- No agent coordination needed
- Request is about code, not agent workflow

## Section Zero: Core Concepts

1. **Brooks (1975):** Don't throw more agents at a problem. Each adds overhead. Small teams of specialists outperform generalists.
2. **Peopleware (1987):** Protect flow. Don't interrupt unnecessarily. Context windows are finite.
3. **Caveman Principle:** Say only what matters, nothing extra.

**Communication Budget:**

| Channel | Max Tokens |
|---------|-----------|
| Task assignment | 150 |
| Status update | 80 |
| Handoff | 120 |
| Conflict notification | 60 |
| Error escalation | 100 |

**Anti-Patterns (token waste):** preamble, context dumps, restating, confirmation asking, status theater.

## Section One: When to Use

See "When to Use" and "Do Not Use When" above.

## Section Two: Hard Rules

> **HR-1.** Every task assignment uses the Caveman Handoff Protocol — no exceptions.

> **HR-2.** No preamble in agent-to-agent messages.

> **HR-3.** Never pass full file contents. Use paths + line numbers.

> **HR-4.** Never restate context the other agent has.

> **HR-5.** One task per assignment.

> **HR-6.** Every task has a testable done condition.

> **HR-7.** Handoffs are explicit events, not implicit.

> **HR-8.** Gaps must be called out in handoffs.

> **HR-9.** Agents report status only when asked or blocked.

> **HR-10.** Max 5-9 parallel tasks per wave.

> **HR-11.** One task = one specialist.

> **HR-12.** Token budget >50% over without justification = BLOCK.

## Section Three: Decision Trees

### Agent Selection

```
Code review? → code-quality-reviewer
  ├── Needs refactoring? → + refactoring-guide
  └── Needs metrics? → + metrics-analyst
Specification/design? → waterfall-blueprint
Test quality? → test-case-validation
Fact-check? → bookworm
Comprehensive? → software-engineering-analyst
```

### Conflict Resolution

```
Agent factually wrong? → Correct with facts
Genuine trade-off? → Apply priority hierarchy:
  1. Safety  2. Behavior preservation  3. Metrics
  4. Psychological safety  5. Simplicity  6. Token efficiency
Scope conflict? → Check done condition
Coordinator decides → Document rationale → Notify
```

### Error Recovery

```
Transient error? → Retry same agent
Specialization mismatch? → Reassign
Task too large? → Decompose
Integration failure? → Isolate → Diagnose → Resolve → Re-verify
```

## Section Four: Pipeline

```
Work Decomposition → Agent Selection → Task Assignment → Execution Monitoring
  → Handoff Management → Conflict Resolution → Integration & Verification
```

### Caveman Handoff Formats

**Task Assignment (≤150 tokens):**
```
ASSIGN: T-XXX
TO: [agent]
TASK: [one line]
CONTEXT: [paths + line numbers]
OUTPUT: [what to produce, format]
DONE: [testable condition]
CONSTRAINTS: [limits]
```

**Handoff (≤120 tokens):**
```
HANDOFF: T-XXX → T-YYY
ARTIFACTS: [paths]
SUMMARY: [one line]
NEXT: [what to do]
GAPS: [what's missing]
```

**Error Escalation (≤100 tokens):**
```
ERROR: T-XXX
PROBLEM: [what failed]
CONTEXT: [minimal]
REQUEST: [what you need]
```

## Section Five: Error Handling

| Error | Response | Escalation |
|-------|----------|------------|
| Agent timeout | Retry → reassign | After 2 retries → human |
| Mismatch | Reassign to correct specialist | No specialist → decompose |
| Token overage | BLOCK, require justification | Unjustifiable → human |
| Conflicting outputs | Apply hierarchy | Can't resolve → human |
| Integration failure | Isolate, diagnose, fix | Systemic → decompose differently |

## Section Six: Key Rules

**Team Patterns:** Surgical Team (O(n)), Parallel Workers (O(n) parallel), Pipeline (O(depth)), Hub/Spoke (O(1) delta).

**Gate BLOCK:** missing done condition, no specialization match, implicit handoffs, >50% token overage, unresolved conflicts, failed integration.

**Gate WARN:** <50% token overage, approximate done conditions, uneven workload, incomplete handoff summaries.

## Section Seven: Evidence & Checklist

**Evidence:** decomposition plan, assignment matrix, handoff messages, progress reports, conflict log, integration results, token summary, DORA metrics.

**Checklist:** tasks decomposed with done conditions → specialists assigned via Caveman Handoff → tokens tracked → handoffs explicit → conflicts resolved → integration verified → DORA recorded → no anti-patterns.

## Agent Registry

| Agent | Specialization | Cost |
|-------|---------------|------|
| code-quality-reviewer | Clean Code, Fowler, SOLID | Medium |
| refactoring-guide | Step-by-step refactoring | Medium |
| metrics-analyst | CK metrics, CC, Halstead | Low |
| bookworm | Verification, fact-checking | Low |
| software-engineering-analyst | All quality skills | High |
| waterfall-blueprint | Phase-gated specification | High |
| test-case-validation | Test review, categorization | Medium |
