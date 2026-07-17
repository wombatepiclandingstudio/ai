# ai

Personal repository for all things AI — agents and reusable skills.

## Layout

```
.
├── agents/     # Custom agent definitions (prompts, configs, personas)
├── skills/     # Reusable skills following the open Agent Skills standard
└── install.sh  # Cross-platform installer (symlinks skills into target projects)
```

## Skills

Skills follow the open [Agent Skills](https://github.com/agentskills/agentskills) standard:
each skill is a folder containing a `SKILL.md` (YAML frontmatter + Markdown instructions),
optionally with `references/`, `evals/`, and `scripts/`.

| Skill | Purpose |
|-------|---------|
| `skills/legacy-capability-extractor` | Extract a traceable business capability map from legacy codebases |

### Install a skill into a project

```bash
bash install.sh --tool claude,codex,cursor,kilocode,opencode --target /path/to/project
bash install.sh --list-tools        # show supported tools and paths
bash install.sh --tool claude --target /path/to/project --remove
```

Skills are exposed to each tool by symlinking the skill folder into the tool's discovery path
(e.g. `.claude/skills/`, `.codex/skills/`). No code generation or text rewriting is involved,
so a single canonical `SKILL.md` works across every compatible tool.

## Agents

Agent definitions live in `agents/`. See [`agents/README.md`](agents/README.md) for the convention.

## Compatibility note

The modern way to make a skill work across platforms is the **discovery-path** mechanism, not
per-tool adapter files. Every compatible tool reads `SKILL.md` from a well-known directory; for
tools that only understand a project memory file, a condensed copy lives in each skill's
`references/condensed.md`.
