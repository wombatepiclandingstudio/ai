# Common Pitfalls — Software Metrics & Quality

## Refactoring Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| Refactoring without tests | No safety net for changes | Ensure test coverage first |
| Refactoring + features simultaneously | Mixing concerns makes debugging hard | Do one at a time |
| Big-bang refactoring | Rewriting entire systems at once | Incremental, small steps |
| Ignoring code smells | Tolerating "good enough" | Address smells on contact |
| Premature optimization | Optimizing while restructuring | Focus on clarity first |
| Not understanding original design | Changing without understanding why | Study before changing |

## Testing Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| Testing only happy paths | Missing edge cases | Test boundary conditions |
| Brittle tests | Tests coupled to implementation | Test behavior, not structure |
| Ignoring non-functional testing | Only functional correctness | Include performance, security |
| Manual repetitive testing | Slow feedback loops | Automate regression tests |
| No regression strategy | Assuming fixes don't break | Maintain regression suites |

## Design Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| God object | Single class doing everything | Apply SRP |
| Tight coupling | Direct dependencies everywhere | Use DI, interfaces |
| Over-engineering | Building for hypothetical futures | YAGNI |
| Premature abstraction | Abstracting before understanding | Let patterns emerge |
| Copy-paste programming | Duplicating code | Apply DRY |

## Code Review Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| Rubber-stamping | Approving without review | Take time to review |
| Too much code at once | >400 LOC/hour drops detection | Break into chunks |
| Style over substance | Debating formatting | Use formatters; focus on logic |
| Personal attacks | Making reviews hostile | Focus on code, not person |

## Estimation Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| Anchoring bias | First estimate dominates | Use multiple techniques |
| Optimism bias | Underestimating complexity | Add buffers |
| Single point estimates | One number, false precision | Use three-point estimates |
| Not learning from history | Repeating mistakes | Track actual vs. estimated |

## Architecture Pitfalls

| Pitfall | Description | Prevention |
|---------|-------------|------------|
| Premature optimization | Optimizing before requirements | Profile first |
| Over-architecture | Elaborate frameworks for simple apps | Start simple |
| Technology-driven | Choosing tech before requirements | Let requirements drive |
| Distributed monolith | Microservices that must deploy together | Ensure independence |
