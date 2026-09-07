# Token Economy Reference

Detailed protocols for token-efficient agent-to-agent communication.

## The Problem

LLMs have finite context windows (4K-128K tokens). Every inter-agent message consumes
tokens that could be used for actual work. Verbose communication:
- Exhausts context windows faster
- Increases API cost 10-100x
- Degrades LLM performance (mixing task context with communication noise)
- Creates information overload (signal buried in noise)

## The Caveman Principle

> Say only what matters. Nothing extra.

This is not about being rude. It is about **respecting the finite resource** (context
window) that every agent shares. Every token spent on preamble is a token stolen from work.

### Before (Verbose)

```
Hi! I hope you're having a good day. I wanted to ask if you could possibly take a
look at the user service file that we've been working on. It seems like there might
be some issues with the complexity of some of the methods, and I think it would be
really helpful if you could analyze the cyclomatic complexity and let me know which
methods need attention. Thanks so much!
```
**Tokens: ~85**

### After (Caveman)

```
ASSIGN: T-003
TO: metrics-analyst
TASK: CC analysis for src/services/user_service.py
OUTPUT: Table: method, CC value, risk level
DONE: All methods covered, HIGH risk flagged
```
**Tokens: ~45** (47% reduction)

## Message Format Standards

### Task Assignment (Max 150 tokens)

```
ASSIGN: T-[NNN]
TO: [agent_name]
TASK: [one-line description — max 15 words]
CONTEXT: [file paths + line numbers — not contents]
INPUT: [specific input data, if any]
OUTPUT: [what to produce, exact format]
DONE: [testable completion condition]
CONSTRAINTS: [limits, boundaries, things NOT to do]
```

**Rules:**
- TASK is one line, max 15 words.
- CONTEXT uses paths + line numbers, never file contents.
- OUTPUT specifies exact format (Markdown table, JSON, etc.).
- DONE is testable — if you can't test it, rewrite it.
- CONSTRAINTS are explicit — "Don't change public API" not "be careful."

### Status Request (Max 30 tokens)

```
STATUS: T-[NNN]
```

That's it. The agent responds with a status update.

### Status Response (Max 80 tokens)

```
STATUS: T-[NNN]
STATE: [in_progress | done | blocked | cancelled]
OUTPUT: [file path or artifact path, if done]
PROGRESS: [percentage or checkpoint, if in_progress]
BLOCKED: [reason + what's needed, if blocked]
```

**Rules:**
- STATE is one word.
- OUTPUT is a path, not a description.
- BLOCKED includes what's needed to unblock.

### Handoff (Max 120 tokens)

```
HANDOFF: T-[NNN] → T-[MMM]
FROM: [agent_name]
TO: [agent_name]
ARTIFACTS: [file paths produced]
SUMMARY: [one line — what was done]
NEXT: [what the receiving agent should do]
GAPS: [what is missing, if anything]
```

**Rules:**
- SUMMARY is one line.
- GAPS is explicit — don't pass incomplete work silently.
- ARTIFACTS are paths, not contents.

### Conflict Notification (Max 60 tokens)

```
CONFLICT: T-[NNN] vs T-[MMM]
CLAIM_A: [agent A's output in one line]
CLAIM_B: [agent B's output in one line]
DECISION: [resolution in one line]
RATIONALE: [priority that drove the decision]
```

### Error Escalation (Max 100 tokens)

```
ERROR: T-[NNN]
AGENT: [agent_name]
PROBLEM: [what failed — one line]
CONTEXT: [minimal context — file path + error]
REQUEST: [what you need to resolve]
```

## Token Budget Table

| Message Type | Max Tokens | Purpose |
|-------------|-----------|---------|
| Task assignment | 150 | Assign work to an agent |
| Status request | 30 | Ask for progress |
| Status response | 80 | Report progress |
| Handoff | 120 | Transfer work between agents |
| Conflict notification | 60 | Resolve disagreement |
| Error escalation | 100 | Report and request help |
| **Total per round** | **~540** | **Assignment + status + handoff** |

## Context Window Management

### Reference, Don't Include

| Instead of | Use |
|-----------|-----|
| Full file contents (2000 tokens) | `src/foo.py:42-58` (5 tokens) |
| Full error log (500 tokens) | `Error at line 142: N+1 query` (8 tokens) |
| Complete API spec (3000 tokens) | `POST /api/users — returns User JSON` (10 tokens) |
| The entire test suite (5000 tokens) | `tests/test_user.py — 45 tests, 3 fail` (12 tokens) |

### Explicit Context Pruning

When a task completes, release its context:

```
CONTEXT RELEASED: T-[NNN]
```

This tells the coordinator that the context from that task can be dropped.

### Separate Channels

- **Task context:** File contents, code, data (Read tool)
- **Communication metadata:** ASSIGN, STATUS, HANDOFF (agent messages)
- **Coordination overhead:** Conflict resolution, integration (coordinator)

Don't mix these in a single message.

## Token Waste Anti-Patterns

### 1. Preamble Waste

**Bad:** "I would like to ask if you could possibly analyze..."
**Good:** "ASSIGN: T-003"
**Savings:** ~20 tokens per message

### 2. Context Dumps

**Bad:** [Entire 200-line file pasted into message]
**Good:** "CONTEXT: src/foo.py:142-155"
**Savings:** ~1900 tokens per message

### 3. Restating

**Bad:** "I see that you've analyzed the metrics and found that the cyclomatic complexity is high. Given that finding, I'd like you to..."
**Good:** "HIGH CC confirmed. Recommend Extract Method."
**Savings:** ~40 tokens per message

### 4. Status Theater

**Bad:** "I'm making great progress! I've been working very hard on this and I think I'm getting close to finishing."
**Good:** "STATUS: T-003\nSTATE: in_progress\nPROGRESS: 80%"
**Savings:** ~25 tokens per message

### 5. Confirmation Asking

**Bad:** "Did you receive my last message? Can you confirm you understand the task?"
**Good:** [Just send the task. The protocol is the contract.]
**Savings:** ~15 tokens per message

### 6. Thanking and Pleasantries

**Bad:** "Thank you so much for your excellent work on this! I really appreciate your help."
**Good:** [Just process the output. Gratitude is implied by the protocol.]
**Savings:** ~15 tokens per message

## ROI of Token Economy

**Scenario:** Agent team with 5 agents, 20 tasks, 3 handoffs per task.

| Approach | Tokens per task | Total tokens | Cost (@ $0.03/1K) |
|----------|----------------|--------------|---------------------|
| Verbose | ~800 | 16,000 | $0.48 |
| Caveman | ~350 | 7,000 | $0.21 |
| **Savings** | | | **56%** |

At scale (100 tasks, 10 agents): verbose = $2.40, caveman = $1.05. **$1.35 saved per cycle.**
At enterprise scale (1000 tasks/day): **$13.50/day, ~$400/month.**
