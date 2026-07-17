# ai

Personal repository for all things AI — agents and reusable skills.

## Layout

```
.
├── agents/          # Custom agent definitions (Claude Code subagent format: <name>/<name>.md)
├── skills/          # Reusable skills following the open Agent Skills standard
├── install-skill.sh # Cross-platform installer (symlinks skills into target projects)
└── install-agent.sh # Cross-platform installer (symlinks agents into target projects)
```

## Skills

Skills follow the open [Agent Skills](https://github.com/agentskills/agentskills) standard:
each skill is a folder containing a `SKILL.md` (YAML frontmatter + Markdown instructions),
optionally with `references/`, `evals/`, and `scripts/`.

| Skill | Purpose |
|-------|---------|
| `skills/legacy-capability-extractor` | Extract a traceable business capability map from legacy codebases |
| `skills/backoffice-design` | Design and review enterprise backoffice / operator-console UIs (capability pages, list/detail workflows, and tech-agnostic UI/UX design patterns) |

### Install a skill into a project

```bash
bash install-skill.sh --tool claude,codex,cursor,kilocode,opencode --target /path/to/project
bash install-skill.sh --list-tools        # show supported tools and paths
bash install-skill.sh --tool claude --target /path/to/project --remove
```

Skills are exposed to each tool by symlinking the skill folder into the tool's discovery path
(e.g. `.claude/skills/`, `.codex/skills/`). No code generation or text rewriting is involved,
so a single canonical `SKILL.md` works across every compatible tool.

## Agents

Agent definitions live in `agents/` and follow the [Claude Code subagent format](agents/README.md)
(each agent is `<name>/<name>.md` with YAML frontmatter + a system-prompt body).

| Agent | Purpose |
|-------|---------|
| `agents/bookworm` | Hyper-skeptical reviewer that distrusts both others' claims and its own memory; verifies language/framework-specific facts against live sources (web, Context7 MCP, sigmap) before asserting them |

### Install an agent into a project

```bash
bash install-agent.sh --tool claude,opencode,kiro --target /path/to/project
bash install-agent.sh --list-tools        # show supported tools and paths
bash install-agent.sh --tool claude --target /path/to/project --remove
```

Agents are exposed to each tool by symlinking the agent file into the tool's agents discovery path
(e.g. `.claude/agents/`). `codex` and `cursor` have no native named-subagent directory, so they are
skipped with a warning — paste the agent body into the project `AGENTS.md` manually for those tools.

## Compatibility note

The modern way to make a skill work across platforms is the **discovery-path** mechanism, not
per-tool adapter files. Every compatible tool reads `SKILL.md` from a well-known directory; for
tools that only understand a project memory file, a condensed copy lives in each skill's
`references/condensed.md`.
