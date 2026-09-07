# Team Lead (condensed)

Condensed version of `SKILL.md` for tools that do not natively read the Agent Skills
`SKILL.md` format. Canonical source: `SKILL.md`.

## Trigger Phrases

- "team lead", "orchestrate", "coordinate", "delegate", "assign", "parallel agents"
- "token economy", "caveman", "concise communication", "handoff"
- "team management", "Peopleware", "Project Aristotle", "DORA", "Team Topologies"
- "decompose", "distribute", "multi-agent"

## When to use

- Multiple agents needed for parallel work
- Communication overhead is wasting tokens
- Tasks need decomposition and specialist assignment
- Inter-agent handoffs need structure

## Do not use when

- Task is simple enough for one agent
- No agent coordination needed
- Request is about code, not agent workflow

## Core Principles

1. **Brooks's Law:** Don't throw more agents at a problem. Each adds overhead.
2. **Peopleware:** Protect flow. Don't interrupt unnecessarily.
3. **Caveman Principle:** Say only what matters, nothing extra.

## Seven-Stage Pipeline

```
Work Decomposition → Agent Selection → Task Assignment → Execution Monitoring
  → Handoff Management → Conflict Resolution → Integration & Verification
```

## Caveman Handoff Protocol

### Task Assignment (≤150 tokens)
```
ASSIGN: T-XXX
TO: [agent]
TASK: [one line]
CONTEXT: [file paths + line numbers only]
OUTPUT: [what to produce, format]
DONE: [testable condition]
CONSTRAINTS: [limits]
```

### Status Response (≤80 tokens)
```
STATUS: T-XXX
STATE: [in_progress | done | blocked]
OUTPUT: [file path or artifact]
BLOCKED: [reason, if any]
```

### Handoff (≤120 tokens)
```
HANDOFF: T-XXX → T-YYY
ARTIFACTS: [paths]
SUMMARY: [one line]
NEXT: [what to do]
GAPS: [what's missing]
```

### Conflict Notification (≤60 tokens)
```
CONFLICT: T-XXX vs T-YYY
CLAIM_A: [output A]
CLAIM_B: [output B]
DECISION: [resolution]
RATIONALE: [one line]
```

### Error Escalation (≤100 tokens)
```
ERROR: T-XXX
PROBLEM: [what failed]
CONTEXT: [minimal]
REQUEST: [what you need]
```

## Token Economy Rules

- **Never** dump full file contents (reference paths)
- **Never** restate context the other agent has
- **Never** use preamble
- **Never** ask for confirmation when protocol suffices
- **Never** send "working on it" without progress data

## Conflict Resolution Priority

1. Safety (never proceed without tests)
2. Behavior preservation (refactoring doesn't change behavior)
3. Metrics (data drives decisions)
4. Simplicity (prefer simpler when equal)
5. Token efficiency (prefer fewer tokens when equal)

## Team Patterns

| Pattern | When | Token Cost |
|---------|------|-----------|
| Surgical Team | One critical path + support | O(n) |
| Parallel Workers | Independent tasks | O(n), parallel |
| Pipeline | Sequential stages | O(depth) |
| Hub and Spoke | Shared state | O(1) per delta |

## Agent Registry

| Agent | Specialization | Cost |
|-------|---------------|------|
| code-quality-reviewer | Clean Code, Fowler, SOLID | Medium |
| refactoring-guide | Step-by-step refactoring | Medium |
| metrics-analyst | CK metrics, CC, Halstead | Low |
| bookworm | Verification, fact-checking | Low |
| software-engineering-analyst | All quality skills | High |

## Anti-Patterns

1. Over-decomposition → too many micro-tasks
2. Under-decomposition → one massive task
3. Context flooding → full file dumps
4. Preamble pollution → "Let me explain..."
5. Status theater → "I'm working hard!"
6. Implicit handoffs → no HANDOFF protocol
7. Conflict avoidance → decisions delayed
8. Agent overload → too many tasks per agent
9. Missing done conditions → "make it good"
10. Token budget blindness → not tracking usage

## Gate (BLOCK)

- Task lacks done condition
- Task assigned without specialization match
- Implicit handoffs (no HANDOFF protocol)
- Token budget exceeded >50% without justification
- Conflicts unresolved
- Integration verification fails

## Gate (WARN)

- Token budget exceeded <50%
- Approximate done conditions
- Uneven agent workload
- Incomplete handoff summaries
