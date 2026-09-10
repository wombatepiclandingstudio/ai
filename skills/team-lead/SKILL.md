---
name: team-lead
description: >
  Coordinate multiple AI agents and human team members using proven team management
  principles from Peopleware, Google's Project Aristotle, Team Topologies, and DORA
  metrics. Enforces token-efficient communication (caveman principle: say only what
  matters), structured handoff protocols, and cognitive load management. Decomposes
  work, assigns tasks, resolves conflicts, tracks progress, and ensures every agent
  communicates in the most concise format possible. Use when orchestrating multiple
  agents, managing a team of specialists, coordinating parallel work, or when
  communication overhead is slowing down delivery.
---

**Scope:** Agent coordination only — not human team management. Covers work decomposition, specialist assignment, token-efficient handoffs, conflict resolution, and integration verification for multi-agent workflows.

# Section Zero: Core Concepts

> "Adding manpower to a late software project makes it later." — Fred Brooks (1975)

> "The major problems of our work are not so much technological as sociological." — DeMarco & Lister (1987)

> "Say only what matters. Nothing extra." — Caveman Principle

Three principles from three eras, unified:

1. **Brooks (1975):** Don't throw more agents at a problem. Each agent adds communication overhead. Small teams of specialists outperform large teams of generalists.
2. **Peopleware (1987):** Protect flow state. Don't interrupt agents unnecessarily. The environment (context window) is finite — waste it on work, not chatter.
3. **Caveman Principle:** Every agent-to-agent message must be telegraphic. No pleasantries, no preamble, no restating context. Facts only.

**Communication Budget:**

| Channel | Max Tokens | Format |
|---------|-----------|--------|
| Task assignment | 150 | Caveman Handoff |
| Status update | 80 | STATUS block |
| Handoff | 120 | HANDOFF block |
| Conflict notification | 60 | One-line decision + rationale |
| Error escalation | 100 | Problem + context + request |

**Token Waste Anti-Patterns:** preamble waste, context dumps, restating, asking when telling works, unnecessary confirmation, status theater.

**Context Window Management:** Reference files by path (not contents). Pass deltas, not full state. Explicit context pruning ("T-003 context released"). Separate channels: task context ≠ communication metadata ≠ coordination overhead.

---

# Section One: Routing Priority — When to Use

### Use When

- Multiple agents needed for parallel work
- Communication overhead is wasting tokens
- Tasks need decomposition and specialist assignment
- Inter-agent handoffs need structure
- Keywords: "team lead," "orchestrate," "coordinate," "delegate," "assign," "token economy," "caveman," "Peopleware," "DORA"

### Do Not Use When

- Task is simple enough for a single agent
- User wants to manage human team members (agent coordination only)
- Request is purely about code, not agent workflow
- User wants a methodology lecture, not practical coordination

---

# Section Two: Hard Rules

> **HR-1.** Every task assignment must use the Caveman Handoff Protocol format — no exceptions.

> **HR-2.** No preamble in agent-to-agent messages. Never say "I would like you to..." or "Could you please..."

> **HR-3.** Never pass full file contents in messages. Pass file paths and line numbers only.

> **HR-4.** Never restate context the receiving agent already has.

> **HR-5.** One task per assignment. Don't bundle multiple unrelated tasks into a single handoff.

> **HR-6.** Every task must have a specific, testable done condition. "Make it better" is not a done condition.

> **HR-7.** Handoffs are explicit events, not implicit. Every inter-agent transfer uses the HANDOFF protocol.

> **HR-8.** Gaps must be called out in handoffs — never pass incomplete work silently.

> **HR-9.** Agents report status only when asked, or when blocked. No unsolicited "I'm working on it" messages.

> **HR-10.** Max 5-9 parallel tasks per wave. More than 9 exceeds coordination capacity (Dunbar's applied to agents).

> **HR-11.** One task = one specialist. If a task needs two skills, split it.

> **HR-12.** Token budget exceeded >50% without justification is a BLOCK condition.

---

# Section Three: Decision Trees

### Agent Selection

```
Code review? → code-quality-reviewer
  ├── Needs refactoring? → + refactoring-guide
  └── Needs metrics? → + metrics-analyst
Specification/design? → waterfall-blueprint
Test quality? → test-case-validation
Fact-check? → bookworm
Comprehensive analysis? → software-engineering-analyst
```

### Conflict Resolution

```
Agent factually wrong? → Correct with facts
Genuine trade-off? → Apply priority hierarchy:
  1. Safety  2. Behavior preservation  3. Metrics
  4. Psychological safety  5. Simplicity  6. Token efficiency
Scope conflict? → Check done condition
Coordinator decides → Document rationale → Notify affected agents
```

### Error Recovery

```
Agent reports ERROR
├── Transient error (timeout, rate limit)? → Retry same agent
├── Specialization mismatch? → Reassign to correct specialist
├── Task too large? → Decompose into smaller pieces
└── Integration failure? → Isolate → Diagnose → Resolve → Re-verify
```

---

# Section Four: Pipeline — The Coordination Process

```
Work Decomposition → Agent Selection → Task Assignment → Execution Monitoring
  → Handoff Management → Conflict Resolution → Integration & Verification
```

## Stage 1: Work Decomposition

**Decomposition Rules:**

1. **One task = one deliverable.** If a task produces two things, split it.
2. **One task = one specialist.** If a task needs two skills, split it.
3. **Tasks are independent when possible.** Minimize blocking dependencies.
4. **Max 5-9 tasks per wave.** More than 9 parallel tasks exceeds coordination capacity.
5. **Each task has a clear done condition.** "Make it better" is not a done condition.

## Stage 2: Agent Selection

**Agent Registry:**

| Agent | Specialization | Best For | Token Cost |
|-------|---------------|----------|------------|
| `code-quality-reviewer` | Clean Code, Fowler, SOLID | Code review, smells | Medium |
| `refactoring-guide` | Step-by-step refactoring | Structural changes | Medium |
| `metrics-analyst` | CK metrics, CC, Halstead | Quantitative analysis | Low |
| `bookworm` | Verification, fact-checking | Claim validation | Low |
| `software-engineering-analyst` | All quality skills | Comprehensive analysis | High |
| `waterfall-blueprint` | Phase-gated specification | Requirements & design docs | High |
| `test-case-validation` | Test review, categorization | Test quality | Medium |

## Stage 3: Task Assignment (Caveman Handoff Protocol)

**Task Assignment (≤150 tokens):**

```
ASSIGN: T-XXX
TO: [agent_name]
TASK: [one-line description]
CONTEXT: [file paths, line numbers only]
INPUT: [specific input data if any]
OUTPUT: [what to produce, format]
DONE: [testable completion condition]
CONSTRAINTS: [limits, things NOT to do]
```

**Status Response (≤80 tokens):**

```
STATUS: T-XXX
STATE: [in_progress | done | blocked | cancelled]
OUTPUT: [file path or artifact path]
BLOCKED: [reason + what's needed]
```

**Handoff (≤120 tokens):**

```
HANDOFF: T-XXX → T-YYY
FROM: [agent_name]
TO: [agent_name]
ARTIFACTS: [file paths produced]
SUMMARY: [one line — what was done]
NEXT: [what the receiving agent should do]
GAPS: [what is missing, if anything]
```

**Conflict Notification (≤60 tokens):**

```
CONFLICT: T-XXX vs T-YYY
CLAIM_A: [output A in one line]
CLAIM_B: [output B in one line]
DECISION: [resolution in one line]
RATIONALE: [priority that drove the decision]
```

**Error Escalation (≤100 tokens):**

```
ERROR: T-XXX
AGENT: [agent_name]
PROBLEM: [what failed — one line]
CONTEXT: [file path + error]
REQUEST: [what you need to resolve]
```

## Stage 4: Execution Monitoring

**Progress Signals:**

| Signal | Meaning | Action |
|--------|---------|--------|
| No output | Agent is working | Wait |
| STATE: done | Task complete | Process handoff |
| STATE: blocked | Agent needs help | Escalate/resolve |
| STATE: cancelled | Task no longer needed | Reassign or close |

## Stage 5: Handoff Management

**Handoff Rules:**

1. Explicit, not implicit. Every handoff is a named event.
2. Complete artifacts. Don't pass incomplete work. If gaps exist, name them.
3. Minimal context. Pass paths and line numbers, not contents.
4. Clear next step. The receiving agent must know exactly what to do.
5. Gaps are called out. Never pass incomplete work silently.

## Stage 6: Conflict Resolution

**Conflict Types:**

| Type | Example | Resolution |
|------|---------|-----------|
| **Factual** | Agent A says X works, Agent B says it doesn't | Verify against source |
| **Approach** | Agent A suggests refactoring X, Agent B suggests Y | Apply priority hierarchy |
| **Scope** | Agent A thinks task is done, Agent B thinks more needed | Check done condition |
| **Priority** | Agent A says do X first, Agent B says do Y first | Coordinator decides |

**Priority Hierarchy:**

| Priority | Principle | Source | When |
|----------|-----------|--------|------|
| 1 | **Safety first** | Feathers/Peopleware | Never proceed without basic test coverage |
| 2 | **Behavior preservation** | Fowler | Refactoring must not change external behavior |
| 3 | **Metric-driven** | DORA/Metrics | Data indicates where to focus |
| 4 | **Psychological safety** | Google Aristotle | Create space for disagreement, then decide |
| 5 | **Simplicity** | Pragmatic Programmer | When two approaches work, prefer simpler |
| 6 | **Token efficiency** | Caveman | When quality is equal, prefer fewer tokens |

## Stage 7: Integration & Verification

**Verification Checklist:**

- [ ] All tasks have deliverables
- [ ] No conflicting outputs between agents
- [ ] All handoff artifacts are present
- [ ] Token budget was respected
- [ ] Done conditions were met for every task
- [ ] No blocking issues remain unresolved

---

# Section Five: Error Handling

| Error Type | Detection | Response | Escalation |
|-----------|-----------|----------|------------|
| Agent timeout | No response within window | Retry once, then reassign | After 2 retries → human |
| Specialization mismatch | Output doesn't meet requirements | Reassign to correct specialist | No specialist → decompose |
| Token budget exceeded | >50% over estimate | BLOCK. Require justification | Unjustifiable → human |
| Conflicting outputs | Contradictory results | Apply conflict hierarchy | Can't resolve → human |
| Integration failure | Outputs don't work together | Isolate, diagnose, fix, re-verify | Systemic → decompose differently |
| Missing handoff artifact | Expected file not produced | Request from producing agent | Can't produce → human |
| Blocked task | Agent cannot proceed | Identify blocker, resolve or escalate | Unresolved >2 steps → human |

---

# Section Six: Key Rules

### Team Patterns

| Pattern | When | Token Cost | Risk |
|---------|------|-----------|------|
| Surgical Team | One critical path + support | O(n) | Coordinator bottleneck |
| Parallel Workers | Independent tasks | O(n), parallel | Integration conflicts |
| Pipeline | Sequential stages | O(depth) | Slowest stage is bottleneck |
| Hub and Spoke | Shared state | O(1) per delta | State conflicts |

### DORA Metrics for Agent Teams

| Metric | Target |
|--------|--------|
| Task completion rate | Steady, predictable |
| Handoff efficiency | ≤150 tokens |
| Conflict rate | <20% |
| Rework rate | <10% |
| Token efficiency | >70% |
| Integration success | >90% |

### Anti-Patterns

1. **Over-decomposition** — too many micro-tasks → more tokens per task
2. **Under-decomposition** — one massive task → bottleneck, no parallelism
3. **Context flooding** — full file dumps → wastes context window
4. **Preamble pollution** — "Let me explain..." → Caveman: facts only
5. **Status theater** — "I'm working hard!" → Report progress or don't report
6. **Implicit handoffs** — "just know" → Explicit HANDOFF protocol
7. **Conflict avoidance** — decisions delayed → Decide now, not later
8. **Agent overload** — too many tasks per agent → Respect cognitive load
9. **Missing done conditions** — "make it good" → Specific, testable criteria
10. **Token budget blindness** — not tracking usage → Monitor and optimize

### Gate Conditions

**BLOCK when:**

- A task lacks a done condition
- A task assigned without specialization match
- Handoffs are implicit (no HANDOFF protocol used)
- Token budget exceeded >50% without justification
- Conflicts exist without resolution
- Integration verification fails

**WARN when:**

- Token budget exceeded <50%
- Some tasks have approximate done conditions
- Agent workload is uneven (one agent has 3× the tasks of others)
- Handoff summaries incomplete but artifacts present

---

# Section Seven: Evidence & Checklist

### Evidence Required

- Work decomposition plan with task list
- Agent assignment matrix (task → agent)
- Caveman Handoff messages for every assignment
- Progress tracking reports
- Handoff summaries for every inter-agent transfer
- Conflict resolution log with rationale
- Integration verification results
- Token usage summary
- DORA-style metrics report

### Pre-Delivery Checklist

- [ ] Work decomposed into independent tasks with clear done conditions
- [ ] Each task assigned to a specialist agent via Caveman Handoff
- [ ] Token budgets estimated and tracked
- [ ] All handoffs explicit with ARTIFACTS, SUMMARY, NEXT, GAPS
- [ ] Conflicts resolved with documented rationale
- [ ] Integration verified — outputs work together
- [ ] DORA metrics recorded
- [ ] No anti-patterns remain

---

# Reference Guides

| Reference | Description | Path |
|-----------|-------------|------|
| Token Economy | Detailed Caveman protocols, message formats, ROI calculations | `references/token-economy.md` |
| Team Patterns | 90s structures, modern patterns, psychological safety | `references/team-patterns.md` |
| Agent Coordination | Handoff protocols, delegation patterns, progress tracking, test cases | `references/agent-coordination.md` |
| Decomposition Templates | Task decomposition output format, follow-up questions | `references/decomposition-templates.md` |
