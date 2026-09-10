# Decomposition Templates Reference

Detailed templates for work decomposition, task assignment, and test cases.

## Task Decomposition Output

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

## Follow-Up Questions for Decomposition

- "What is the single most important deliverable? Start there."
- "Which tasks are independent and can run in parallel?"
- "Which tasks block other tasks?"
- "What is the minimum viable decomposition? Can we do fewer tasks?"

## Progress Tracking Format

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

## Integration Verification Format

```
INTEGRATION: [project_name]
All tasks complete: [YES/NO]
Conflicts resolved: [YES/NO]
Handoff artifacts: [list]
Token budget: [estimated vs actual]
Done conditions: [list, each verified]
Remaining blockers: [list or NONE]
```

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
