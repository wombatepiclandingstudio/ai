# Agent Coordination Reference

Handoff protocols, delegation patterns, and inter-agent communication standards.

## Handoff Protocol

### When to Hand Off

A handoff occurs when:
- Agent A's output is Agent B's input
- A task's scope exceeds one agent's specialization
- A task needs verification by a different agent
- Work is parallelized and results need integration

### Handoff Rules

1. **Explicit, not implicit.** Every handoff is a named event with a message.
2. **Complete artifacts.** Don't pass incomplete work. If gaps exist, name them.
3. **Minimal context.** Pass paths and line numbers, not contents.
4. **Clear next step.** The receiving agent must know exactly what to do.
5. **Gaps are called out.** Never pass incomplete work silently.

### Handoff Message Format

```
HANDOFF: T-[NNN] → T-[MMM]
FROM: [agent_name]
TO: [agent_name]
ARTIFACTS: [file paths produced]
SUMMARY: [one line — what was done]
NEXT: [what the receiving agent should do]
GAPS: [what is missing, if anything]
```

### Example

```
HANDOFF: T-001 → T-002
FROM: metrics-analyst
TO: code-quality-reviewer
ARTIFACTS: reports/ck-metrics.md
SUMMARY: CK metrics computed. 3 classes HIGH risk: UserService(LCOM=35), OrderService(CBO=12), AuthModule(CC=28)
NEXT: Review HIGH-risk classes for smells and SOLID violations
GAPS: None
```

## Delegation Patterns

### Pattern 1: Direct Assignment

One coordinator assigns tasks directly to specialists.

```
Coordinator ──ASSIGN──► Specialist
Coordinator ◄──RESULT── Specialist
```

**When:** Simple tasks, clear specialization.
**Token cost:** Low.
**Risk:** Coordinator becomes bottleneck for many specialists.

### Pattern 2: Chain Delegation

Coordinator assigns to a sub-coordinator who delegates further.

```
Coordinator ──ASSIGN──► Sub-Coordinator ──ASSIGN──► Specialist
Coordinator ◄──RESULT── Sub-Coordinator ◄──RESULT── Specialist
```

**When:** Large tasks that need decomposition.
**Token cost:** Medium.
**Risk:** Information loss across layers.

### Pattern 3: Broadcast + Claim

Coordinator broadcasts a task; specialists claim what they can do.

```
Coordinator ──BROADCAST──► All Specialists
Specialist A ──CLAIM──► Coordinator
Specialist B ──CLAIM──► Coordinator
Coordinator ──CONFIRM──► Specialist A
Coordinator ──CONFIRM──► Specialist B
```

**When:** Task specialization is ambiguous; let agents self-select.
**Token cost:** Higher (broadcast + claims).
**Risk:** Some tasks may not be claimed.

### Pattern 4: Pipeline Handoff

Agents arranged in sequence; each passes output to the next.

```
Agent 1 ──HANDOFF──► Agent 2 ──HANDOFF──► Agent 3 ──RESULT──► Coordinator
```

**When:** Sequential processing (requirements → design → test).
**Token cost:** O(depth).
**Risk:** Slowest agent is the bottleneck.

## Conflict Resolution

### Conflict Types

| Type | Example | Resolution |
|------|---------|-----------|
| **Factual** | Agent A says X works, Agent B says it doesn't | Verify against source |
| **Approach** | Agent A suggests refactoring X, Agent B suggests Y | Apply priority hierarchy |
| **Scope** | Agent A thinks task is done, Agent B thinks more is needed | Check done condition |
| **Priority** | Agent A says do X first, Agent B says do Y first | Coordinator decides |

### Priority Hierarchy

When approaches conflict:
1. Safety (never proceed without tests)
2. Behavior preservation (refactoring doesn't change behavior)
3. Metrics (data drives decisions)
4. Simplicity (prefer simpler when equal)
5. Token efficiency (prefer fewer tokens when equal)

### Resolution Process

1. **Identify:** What do the agents disagree on?
2. **Check facts:** Is one wrong, or is this a genuine trade-off?
3. **Apply hierarchy:** Higher priority wins.
4. **Document:** One line, with rationale.
5. **Notify:** Caveman format to affected agents.

## Error Handling

### Agent Error

```
ERROR: T-[NNN]
AGENT: [agent_name]
PROBLEM: [what failed]
CONTEXT: [minimal context]
REQUEST: [what you need]
```

**Coordinator response options:**
1. **Retry:** Same task, same agent (if transient error)
2. **Reassign:** Same task, different agent (if specialization mismatch)
3. **Decompose:** Break task into smaller pieces
4. **Escalate:** Human intervention needed

### Integration Error

When agent outputs conflict or don't work together:

1. **Isolate:** Which outputs conflict?
2. **Diagnose:** Root cause (wrong assumption? missing context? protocol violation?)
3. **Resolve:** Apply conflict resolution
4. **Re-integrate:** Verify the fix works

## Progress Tracking

### Tracking Format

```
PROGRESS: [project_name]
Wave: [N]
Tasks total: [N]
Tasks complete: [N]
Tasks in progress: [N]
Tasks blocked: [N]
BLOCKED: [list with reasons]
TOKENS USED: [approximate]
```

### When to Check Progress

- After assigning a wave of tasks (wait for completion)
- When a blocking dependency is resolved
- When the user requests a status update
- **Not** every 5 minutes — respect flow state

### Progress Signals

| Signal | Meaning | Action |
|--------|---------|--------|
| No output | Agent is working | Wait |
| STATE: done | Task complete | Process handoff |
| STATE: blocked | Agent needs help | Escalate/resolve |
| STATE: cancelled | Task no longer needed | Reassign or close |

## Integration Verification

After all tasks complete, verify:

1. **All tasks have deliverables.** No missing outputs.
2. **No conflicting outputs.** Agents agree.
3. **All handoff artifacts present.** Nothing lost in transfer.
4. **Token budget respected.** No runaway costs.
5. **Done conditions met.** Every task met its testable condition.
6. **No blocking issues remain.** Everything unblocked.

### Verification Checklist

```
INTEGRATION: [project_name]
All tasks complete: [YES/NO]
Conflicts resolved: [YES/NO]
Handoff artifacts: [list]
Token budget: [estimated vs actual]
Done conditions: [list, each verified]
Remaining blockers: [list or NONE]
```
