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
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [team-management, agent-coordination, token-economy, caveman, peopleware, project-aristotle, team-topologies, dora, handoff, orchestration, cognitive-load, multi-agent]
---

# Team Lead — Agent Coordination & Token-Efficient Communication

Coordinates multiple AI agents and human team members using 30+ years of team
management research — from Brooks's surgical teams and DeMarco's Peopleware to
Google's Project Aristotle and Team Topologies. Enforces the **caveman principle**:
every message between agents says only what matters, nothing extra. Token waste is
team waste.

This skill is not about managing people. It is about **making agents work together
efficiently** — decomposing work, assigning tasks to the right specialist, enforcing
concise handoff protocols, tracking progress, and resolving conflicts before they
become blockers.

## Use when

- The user wants to coordinate multiple agents to work on a problem in parallel
- The user mentions "team lead," "orchestrate," "coordinate," "delegate," "assign"
- The user has multiple tasks that could be done by different specialist agents
- Communication between agents is verbose, redundant, or losing information
- The user wants to minimize token usage while maintaining information quality
- The user mentions "token economy," "caveman," "concise communication," "handoff"
- The user wants work decomposed and distributed across available agents
- The user mentions "team management," "Peopleware," "Project Aristotle," "DORA"
- The user wants progress tracking across multiple parallel workstreams

## Do not use when

- The task is simple enough for a single agent
- The user wants to manage human team members (this is for agent coordination)
- The user wants a methodology lecture, not practical coordination
- The request is purely about code, not about agent workflow

---

## Core Philosophy

> "Adding manpower to a late software project makes it later." — Fred Brooks

> "The major problems of our work are not so much technological as sociological." — DeMarco & Lister

> "Say only what matters. Nothing extra." — Caveman Principle

Three principles from three eras, unified:

1. **Brooks (1975):** Don't throw more agents at a problem. Each agent adds communication overhead. Small teams of specialists outperform large teams of generalists.
2. **Peopleware (1987):** Protect flow state. Don't interrupt agents unnecessarily. The environment (context window) is finite — waste it on work, not chatter.
3. **Caveman Principle:** Every agent-to-agent message must be telegraphic. No pleasantries, no preamble, no restating context. Facts only.

---

## The Coordination Pipeline

```
Work Decomposition → Agent Selection → Task Assignment → Execution Monitoring
  → Handoff Management → Conflict Resolution → Integration & Verification
```

### Stage 1: Work Decomposition

Before assigning anything, decompose the work into independent units.

#### Decomposition Rules (from90s + Modern)

1. **One task = one deliverable.** If a task produces two things, split it.
2. **One task = one specialist.** If a task needs two skills, split it.
3. **Tasks are independent when possible.** Minimize blocking dependencies.
4. **Max 5-9 tasks per wave.** More than 9 parallel tasks exceeds coordination capacity (Dunbar's applied to agents).
5. **Each task has a clear done condition.** "Make it better" is not a done condition.

#### Decomposition Output

```
TASK DECOMPOSITION
Project: [name]
Wave: [N] (parallel tasks in this wave)

TASKS:
T-001: [one-line description]
  Specialist needed: [agent type]
  Dependencies: [none | T-XXX]
  Estimated tokens: [rough budget]
  Done when: [specific, testable condition]
  Risk: [low/medium/high]

T-002: ...
```

**Follow-up questions for decomposition:**

- "What is the single most important deliverable? Start there."
- "Which tasks are independent and can run in parallel?"
- "Which tasks block other tasks?"
- "What is the minimum viable decomposition? Can we do fewer tasks?"

### Stage 2: Agent Selection

Match tasks to agents based on specialization. The90s surgical team model
and modern Team Topologies both agree: **specialists outperform generalists**.

#### Agent Registry

Maintain awareness of available agents and their specializations:

| Agent | Specialization | Best For | Token Cost |
|-------|---------------|----------|------------|
| `code-quality-reviewer` | Clean Code, Fowler, SOLID | Code review, smells | Medium |
| `refactoring-guide` | Step-by-step refactoring | Structural changes | Medium |
| `metrics-analyst` | CK metrics, CC, Halstead | Quantitative analysis | Low |
| `bookworm` | Verification, fact-checking | Claim validation | Low |
| `software-engineering-analyst` | All quality skills | Comprehensive analysis | High |
| `waterfall-blueprint` | Phase-gated specification | Requirements & design docs | High |
| `test-case-validation` | Test review, categorization | Test quality | Medium |

#### Selection Criteria

1. **Specialization match:** Does the agent's expertise match the task?
2. **Token efficiency:** Can this agent do the task with minimal tokens?
3. **Dependency:** Does this agent need output from another agent first?
4. **Conflict:** Has this agent already been assigned conflicting work?

### Stage 3: Task Assignment (Token-Efficient Handoff)

Every task assignment follows the **Caveman Handoff Protocol**. No exceptions.

#### Caveman Handoff Format

```
ASSIGN: T-XXX
TO: [agent_name]
TASK: [one-line description]
CONTEXT: [minimal required context — file paths, line numbers, code snippets only]
INPUT: [specific input data if any]
OUTPUT: [what to produce, in what format]
DONE: [testable completion condition]
CONSTRAINTS: [limits, boundaries, things NOT to do]
```

**Example:**

```
ASSIGN: T-003
TO: metrics-analyst
TASK: Compute CK metrics for src/services/user_service.py
CONTEXT: src/services/user_service.py, 450 lines, Python, 12 classes
INPUT: None
OUTPUT: Markdown table with WMC, CBO, LCOM, RFC for each class
DONE: Table produced, all classes covered, HIGH risk classes flagged
CONSTRAINTS: No code changes. Analysis only.
```

**Rules:**
- **No preamble.** Don't say "I would like you to..." or "Could you please..."
- **No context dumps.** Pass file paths and line numbers, not full file contents.
- **No restating.** The CONTEXT section replaces all context.
- **One task per assignment.** Don't bundle multiple unrelated tasks.
- **Explicit DONE condition.** The agent must know exactly when to stop.

### Stage 4: Execution Monitoring

Track progress without interrupting. The90s insight: **interruptions destroy flow**.
The modern insight: **psychological safety requires knowing progress is visible**.

#### Progress Tracking Format

```
STATUS: [agent_name]
Tasks assigned: N
Tasks in progress: N
Tasks complete: N
BLOCKED: [list of blocked tasks with reason]
OUTPUTS: [list of completed deliverables with file paths]
TOKENS USED: [approximate]
```

**Rules:**
- Agents report status only when asked, or when blocked.
- No unsolicited "I'm working on it" messages.
- Blocked tasks escalate immediately — don't wait for status requests.

### Stage 5: Handoff Management

When one agent's output feeds another agent's input, the handoff must be explicit.

#### Handoff Protocol

```
HANDOFF: T-XXX → T-YYY
FROM: [agent_name]
TO: [agent_name]
ARTIFACTS: [list of files/data produced]
SUMMARY: [one-line what was done]
NEXT: [what the receiving agent should do with it]
GAPS: [what is missing, if anything]
```

**Rules:**
- Handoffs are explicit events, not implicit.
- Every handoff produces a summary in caveman format.
- Gaps must be called out — don't pass incomplete work silently.

### Stage 6: Conflict Resolution

When agents disagree or produce conflicting outputs, the team lead resolves.

#### Conflict Resolution Priority (from Research)

| Priority | Principle | Source | When |
|----------|-----------|--------|------|
| 1 | **Safety first** | Feathers/Peopleware | Never proceed without basic test coverage |
| 2 | **Behavior preservation** | Fowler | Refactoring must not change external behavior |
| 3 | **Metric-driven** | DORA/Metrics | Data indicates where to focus |
| 4 | **Psychological safety** | Google Aristotle | Create space for disagreement, then decide |
| 5 | **Simplicity** | Pragmatic Programmer | When two approaches work, prefer simpler |
| 6 | **Token efficiency** | Caveman | When quality is equal, prefer fewer tokens |

#### Conflict Resolution Process

1. **Identify the conflict.** What do the agents disagree on?
2. **Check facts.** Is one agent wrong, or is this a genuine trade-off?
3. **Apply priority hierarchy.** Higher priority wins.
4. **Document the decision.** One line, with rationale.
5. **Notify affected agents.** Caveman format: what changed, why, what they need to do.

### Stage 7: Integration & Verification

After all tasks complete, verify the outputs work together.

#### Verification Checklist

- [ ] All tasks have deliverables
- [ ] No conflicting outputs between agents
- [ ] All handoff artifacts are present
- [ ] Token budget was respected
- [ ] Done conditions were met for every task
- [ ] No blocking issues remain unresolved

---

## Token Economy Rules

The caveman principle is not optional. It is a core constraint.

### Communication Budget

| Channel | Max Tokens | Format |
|---------|-----------|--------|
| Task assignment | 150 | Caveman Handoff |
| Status update | 80 | STATUS block |
| Handoff | 120 | HANDOFF block |
| Conflict notification | 60 | One-line decision + rationale |
| Error escalation | 100 | Problem + context + request |

### Token Waste Anti-Patterns

1. **Preamble waste** — "I hope you're doing well. I wanted to ask you to..." → Cut to: "ASSIGN: T-XXX"
2. **Context dumps** — Passing entire files when a path + line number suffices → "CONTEXT: src/foo.py:42-58"
3. **Restating** — Repeating what the previous message already said → Reference, don't repeat.
4. **Asking when telling works** — "Could you maybe consider..." → "DO: [specific action]"
5. **Unnecessary confirmation** — "Did you receive my message?" → Trust the protocol.
6. **Status theater** — "I'm making great progress on the task!" → "T-003: 80% done. Blocker: needs T-002 output."

### Context Window Management

- **Reference files by path, don't include contents.** The receiving agent has Read access.
- **Pass deltas, not full state.** "Changed lines 42-58" not "here's the whole file."
- **Explicit context pruning.** When a task is done, say "T-003 context released."
- **Separate channels.** Task context ≠ communication metadata ≠ coordination overhead.

---

## Team Patterns

### Pattern 1: Surgical Team (Brooks)

```
           ┌─────────────┐
           │  Team Lead   │
           │ (coordinator)│
           └──────┬──────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐   ┌────▼────┐   ┌────▼────┐
│Specialist│ │Specialist│ │Specialist│
│  A      │ │  B      │ │  C      │
└─────────┘ └─────────┘ └─────────┘
```

**When:** One critical path, multiple supporting tasks.
**Token cost:** O(n) — one coordinator, n specialists.
**Risk:** Coordinator becomes bottleneck.

### Pattern 2: Parallel Workers

```
┌─────────────┐
│  Team Lead   │
└──────┬──────┘
       │
  ┌────┼────┬────────┐
  │    │    │        │
┌─▼─┐┌─▼─┐┌─▼─┐  ┌──▼──┐
│ W1││ W2││ W3│  │ W4  │
└───┘└───┘└───┘  └─────┘
```

**When:** Independent tasks, no cross-dependencies.
**Token cost:** O(n) but tasks run in parallel.
**Risk:** Integration conflicts at the end.

### Pattern 3: Pipeline

```
┌───┐    ┌───┐    ┌───┐    ┌───┐
│ W1│───►│ W2│───►│ W3│───►│ W4│
└───┘    └───┘    └───┘    └───┘
```

**When:** Each stage's output feeds the next.
**Token cost:** O(d) where d = pipeline depth.
**Risk:** Slowest stage is the bottleneck.

### Pattern 4: Hub and Spoke

```
         ┌───┐
    ┌────│ W2│
    │    └───┘
┌───▼───┐
│  Hub  │◄───►┌───┐
│(state)│     │ W3│
└───┬───┘     └───┘
    │    ┌───┐
    └────│ W4│
         └───┘
```

**When:** Shared state, agents read/write to a common location.
**Token cost:** O(1) per communication (just the delta).
**Risk:** State conflicts, race conditions.

---

## DORA Metrics for Agent Teams

Measure agent team effectiveness with DORA-aligned metrics:

| Metric | What to Measure | Target |
|--------|----------------|--------|
| **Task completion rate** | Tasks completed per time unit | Steady, predictable |
| **Handoff efficiency** | Tokens per handoff | ≤150 tokens |
| **Conflict rate** | Conflicts per 10 tasks | <20% |
| **Rework rate** | Tasks requiring rework | <10% |
| **Token efficiency** | Useful output tokens / total tokens | >70% |
| **Integration success** | First-time integration success | >90% |

---

## Anti-Patterns

1. **Over-decomposition** — Splitting into too many micro-tasks → Each task needs context = more tokens
2. **Under-decomposition** — One massive task for one agent → Bottleneck, no parallelism
3. **Context flooding** — Passing full file contents instead of references → Wastes context window
4. **Preamble pollution** — "Let me explain the background..." → Caveman: facts only
5. **Status theater** — "I'm working hard!" → Report progress or don't report
6. **Implicit handoffs** — Assuming the next agent will "just know" → Explicit HANDOFF protocol
7. **Conflict avoidance** — Not resolving disagreements → Decisions now, not later
8. **Agent overload** — Assigning too many tasks to one agent → Respect cognitive load
9. **Missing done conditions** — "Make it good" → Specific, testable completion criteria
10. **Token budget blindness** — Not tracking token usage → Monitor and optimize

---

## Pre-Delivery Checklist

Before declaring coordination complete:

- [ ] Work decomposed into independent tasks with clear done conditions
- [ ] Each task assigned to a specialist agent via Caveman Handoff
- [ ] Token budgets estimated and tracked
- [ ] All handoffs explicit with ARTIFACTS, SUMMARY, NEXT, GAPS
- [ ] Conflicts resolved with documented rationale
- [ ] Integration verified — outputs work together
- [ ] DORA metrics recorded
- [ ] No anti-patterns remain

---

## Gate Implications

The gate must **BLOCK** when:

- A task lacks a done condition
- A task is assigned to an agent without matching specialization
- Handoffs are implicit (no HANDOFF protocol used)
- Token budget exceeded by >50% without justification
- Conflicts exist without resolution
- Integration verification fails

The gate must **WARN** when:

- Token budget exceeded by <50%
- Some tasks have approximate done conditions
- Agent workload is uneven (one agent has 3× the tasks of others)
- Handoff summaries are incomplete but artifacts are present

---

## Evidence Required

A team-lead coordination session should produce:

- Work decomposition plan with task list
- Agent assignment matrix (task → agent)
- Caveman Handoff messages for every assignment
- Progress tracking reports
- Handoff summaries for every inter-agent transfer
- Conflict resolution log with rationale
- Integration verification results
- Token usage summary
- DORA-style metrics report

---

## Test Cases

### Test Case 1: Multi-agent code review coordination
**Input:** "Review the entire src/ directory. I need metrics analysis, code quality review, and refactoring recommendations. Do it all in parallel."
**Expected output:** Decomposition into 3 parallel tasks, each assigned to the right specialist (metrics-analyst, code-quality-reviewer, refactoring-guide), with Caveman Handoff format. Progress tracking. Final integration of findings.
**Assertion:** 3 tasks decomposed. Each task has a Caveman Handoff. Token budget estimated. Integration produces unified findings.

### Test Case 2: Token-efficient handoff
**Input:** "The waterfall-blueprint produced an SRS. Now generate test cases from it using test-case-validation."
**Expected output:** A HANDOFF message from waterfall-blueprint to test-case-validation with ARTIFACTS (SRS path), SUMMARY (one line), NEXT (what to do), GAPS (if any). No context dumps, no preamble.
**Assertion:** Handoff message ≤150 tokens. Contains all 4 required sections. No preamble or restating.

### Test Case 3: Conflict resolution between agents
**Input:** "The code-quality-reviewer says to extract 5 classes. The refactoring-guide says the code is fine. Resolve this."
**Expected output:** Conflict identified, facts checked (are the smells real or not?), priority hierarchy applied, decision documented with one-line rationale, affected agents notified.
**Assertion:** Conflict resolved with documented rationale. Decision follows priority hierarchy. Affected agents notified in Caveman format.
