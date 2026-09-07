# Team Patterns Reference

Team management patterns from the 1990s through modern research, applied to
AI agent coordination.

## 90s Team Structures

### Chief Programmer Team (Mills, 1971)

```
           ┌─────────────┐
           │    Chief     │
           │  Programmer  │
           └──────┬──────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐   ┌────▼────┐   ┌────▼────┐
│Co-Pilot│   │Librarian│   │ Tester  │
└─────────┘ └─────────┘ └─────────┘
```

- One person has authority over all technical decisions
- Communication flows through the chief
- Reduces coordination overhead
- **Applied to agents:** One coordinator agent, specialist agents report to it

### Surgical Team (Brooks)

```
┌─────────────┐
│   Surgeon    │ ← does 40-60% of coding
│ (lead dev)   │
└──────┬──────┘
       │
  ┌────┼────┬────┬────┬────┐
  │    │    │    │    │    │
┌─▼─┐┌─▼─┐┌─▼─┐┌─▼─┐┌─▼─┐┌─▼─┐
│COP││ADM││ED ││TL ││TS ││TM │
└───┘└───┘┘───┘└───┘└───┘└───┘
```

Roles: Co-pilot, Administrator, Editor(s), Language Lawyer, Tester, Toolsmith
Total: 7-9 people with non-overlapping roles
**Applied to agents:** Lead agent does critical thinking; specialist agents do
focused work (metrics, review, verification)

### Democratic Team (Weinberg)

```
┌───┐   ┌───┐   ┌───┐
│ A │◄─►│ B │◄─►│ C │
└───┘   └───┘   └───┘
  ▲                 ▲
  └────────┬────────┘
         ┌───┐
         │ D │
         └───┘
```

- No single leader; decisions by consensus
- Works best for creative, exploratory work
- Slower decisions, higher satisfaction
- **Applied to agents:** Collaborative problem-solving where agents contribute equally

### Hierarchical Team

```
         ┌─────┐
         │ Mgr │
         └──┬──┘
       ┌────┼────┐
     ┌─▼──┐┌─▼──┐
     │Lead││Lead│
     └─┬──┘└─┬──┘
    ┌──┼──┐  ┌┼──┐
   ┌▼┐┌▼┐┌▼┐┌▼┐┌▼┐
   │D││D││D││D││D│
   └─┘└─┘└─┘└─┘└─┘
```

- Clear reporting lines
- Efficient for large, well-defined projects
- Risk: bureaucratic, slow
- **Applied to agents:** Coordinator → sub-coordinators → specialists

## Modern Team Patterns

### Two-Pizza Team (Amazon)

- 6-8 people max
- Small teams are more autonomous, accountable, faster
- **Applied to agents:** Max 5-9 agents per coordinator

### Dunbar's Number Applied

- 5 close relationships (inner circle)
- 15 good friends (team)
- 150 meaningful contacts (organization)
- **Applied to agents:** One coordinator can effectively manage ≤9 agents

### Team Topologies (Skelton & Pais)

| Type | Purpose | Size | Applied to Agents |
|------|---------|------|-------------------|
| Stream-aligned | Primary value delivery | 8-12 | Main work agents |
| Platform | Shared services | Varies | Utility agents (metrics, verification) |
| Enabling | Help others adopt | 3-5 | Temporary helper agents |
| Complicated-subsystem | Deep specialist work | 3-7 | Specialist agents |

**Interaction modes:**
1. Collaboration: High coordination, high innovation
2. X-as-a-Service: Low coupling, clear boundaries
3. Facilitating: Help others learn, then move on

### Google's Project Aristotle

Five dynamics of effective teams:
1. **Psychological safety** — Can we take risks without fear?
2. **Dependability** — Can we count on each other?
3. **Structure and clarity** — Are goals and roles clear?
4. **Meaning** — Is the work personally important?
5. **Impact** — Do we believe our work matters?

**Applied to agents:**
- Safety: Agents can report failures without blame
- Dependability: Agents deliver on time, every time
- Structure: Clear roles, clear handoffs
- Meaning: Every task has a purpose
- Impact: Every contribution matters

### DORA Metrics

| Metric | What | Target |
|--------|------|--------|
| Deployment Frequency | How often code ships | On-demand |
| Lead Time | Commit to production | <1 hour |
| Change Failure Rate | Deployments causing failures | <5% |
| MTTR | Recovery from failure | <1 hour |

**Applied to agents:**
- Task Completion Rate: Tasks done per time unit
- Handoff Efficiency: Tokens per handoff
- Conflict Rate: Conflicts per 10 tasks
- Rework Rate: Tasks requiring redo
- Token Efficiency: Useful output / total tokens

## Coordination Patterns for Agents

### Pattern 1: Surgical Team

```
           ┌─────────────┐
           │  Coordinator │
           └──────┬──────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐   ┌────▼────┐   ┌────▼────┐
│Spec A │   │ Spec B  │   │ Spec C  │
└───────┘   └─────────┘   └─────────┘
```

**When:** One critical path, multiple supporting tasks.
**Token cost:** O(n) — one coordinator, n specialists.
**Best for:** Code review, comprehensive analysis.

### Pattern 2: Parallel Workers

```
┌─────────────┐
│  Coordinator │
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
**Best for:** Multi-file refactoring, parallel testing.

### Pattern 3: Pipeline

```
┌───┐    ┌───┐    ┌───┐    ┌───┐
│ W1│───►│ W2│───►│ W3│───►│ W4│
└───┘    └───┘    └───┘    └───┘
```

**When:** Each stage's output feeds the next.
**Token cost:** O(d) where d = pipeline depth.
**Best for:** SRS → Design → Test → Deploy.

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
**Best for:** Multi-agent code editing, shared documentation.

## Psychological Safety for Agent Teams

Even though agents don't have feelings, the humans managing them need safety:

1. **Frame failures as learning.** "This agent produced wrong output — let's understand why."
2. **Don't blame the tool.** Understand the prompt, the context, the protocol.
3. **Encourage experimentation.** Try new agent combinations. Some will fail.
4. **Document failures.** Every failure is a lesson for future coordination.
5. **Celebrate successes.** Acknowledge when agent teams work well together.
