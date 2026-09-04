# ai

Personal repository for all things AI — agents and reusable skills.

## Layout

```
.
├── agents/           # Custom agent definitions (Claude Code subagent format: <name>/<name>.md)
├── skills/           # Reusable skills following the open Agent Skills standard
├── install-skill.sh  # Bash installer — symlinks skills into target projects
├── install-agent.sh  # Bash installer — symlinks agents into target projects
├── install-skill.ps1 # PowerShell installer — same, for Windows (pwsh)
└── install-agent.ps1 # PowerShell installer — same, for Windows (pwsh)
```

## Skills

Skills follow the open [Agent Skills](https://github.com/agentskills/agentskills) standard:
each skill is a folder containing a `SKILL.md` (YAML frontmatter + Markdown instructions),
optionally with `references/`, `evals/`, and `scripts/`.

| Skill | Purpose |
|-------|---------|
| `skills/legacy-capability-extractor` | Extract a traceable business capability map from legacy codebases via a 7-phase multi-signal pipeline |
| `skills/capability-to-gherkin` | Convert business capability maps into executable Gherkin BDD specifications with triage and validation |
| `skills/backoffice-design` | Design enterprise backoffice UIs: capability pages, list/detail workflows, stepper/wizard, bulk ops, real-time status, and UI/UX design patterns |
| `skills/refactoring-catalog` | Apply Martin Fowler's refactoring catalog with automated smell detection and full catalog of named techniques |
| `skills/clean-code-review` | Enforce Clean Code principles: naming, functions, SOLID, TDD, immutability, test coverage strategy |
| `skills/legacy-code-workshop` | Apply Michael Feathers' legacy code techniques: characterization tests, dependency breaking with decision tree, sprout/wrap methods, Mikado |
| `skills/pragmatic-development` | Apply Pragmatic Programmer principles: DRY with detection guide, orthogonality, tracer bullets, coupling breaking with decision criteria |
| `skills/software-metrics-quality` | CK metrics, cyclomatic complexity, Halstead, maintainability index, Fagan inspection, ISO 25010 with CI integration guidance |

## Agents

Agent definitions live in `agents/` and follow the [Claude Code subagent format](agents/README.md)
(each agent is `<name>/<name>.md` with YAML frontmatter + a system-prompt body).

| Agent | Purpose |
|-------|---------|
| `agents/software-engineering-analyst` | **Primary orchestrator** — Unified analyst that integrates all quality skills with conflict resolution when skills disagree (metrics vs smells, safety vs speed, quality vs timeline) |
| `agents/bookworm` | Hyper-skeptical verifier that distrusts its own memory; verifies facts against live sources (Context7, web, sigmap) with confidence levels and fallback behavior when sources are unavailable |
| `agents/code-quality-reviewer` | Comprehensive reviewer combining Fowler, Uncle Bob, Feathers, and Pragmatic principles with prioritization framework and auto-fix categorization |
| `agents/refactoring-guide` | Step-by-step refactoring guide with stopping criteria, team workflow (branching, PRs, reviews), and refactoring metrics tracking |
| `agents/metrics-analyst` | Quantitative analyst with language-specific metric guidance, CI quality gate configuration, and ISO 25010 assessment |

## Install

```bash
# Skills — install into a project
bash install-skill.sh --tool claude,codex,cursor,kilocode,opencode --target /path/to/project
bash install-skill.sh --list-tools        # show supported tools and paths
bash install-skill.sh --tool claude --target /path/to/project --remove

# Agents — install into a project
bash install-agent.sh --tool claude,opencode,kiro --target /path/to/project
bash install-agent.sh --list-tools
bash install-agent.sh --tool claude --target /path/to/project --remove

# Global install (all projects)
bash install-skill.sh --tool claude,cursor,cline --global
bash install-agent.sh --tool claude,cline --global
```

On Windows (PowerShell): use `install-skill.ps1` / `install-agent.ps1` with the same flags.
Pass `-Copy` on Windows if symlink creation requires admin rights.

## Compatibility

Every compatible tool reads `SKILL.md` from a well-known directory (`.claude/skills/`,
`.codex/skills/`, `.opencode/skills/`, etc.). For tools that only understand a project
memory file (`AGENTS.md`, `CLAUDE.md`, `.windsurfrules`), a condensed copy lives in each
skill's `references/condensed.md`.
