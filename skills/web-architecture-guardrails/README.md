# Web Architecture Guardrails

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills)
standard) that enforces **web architecture integrity** when adding or modifying pages, components,
and routes. The `SKILL.md` in this folder is the single source of truth — the same file is
exposed to any compatible tool via discovery paths, no text rewriting required.

## The Problem

When an LLM adds a page or makes structural changes to a web project, it often copies the
shell (header, footer, sidebar, meta tags) into the new file instead of inheriting it from a
shared layout. Over time this fragments the project: pages diverge visually, navigation links
break or point to stale URLs, styles drift, and meta/SEO tags become inconsistent.

## What It Does

Given a request to add a page, route, or view — or to restructure layouts or navigation — the
skill enforces a **shared-layout-first** architecture and a **mandatory three-phase workflow**:

1. **Audit** — Identify the layout root, route registry, navigation source, style architecture,
   meta pattern, and base URL pattern before making any changes.
2. **Implement** — Create only page content (no shell), register as a child of the layout route,
   update the shared navigation, provide meta values, and use existing style/link conventions.
3. **Verify** — Check shell inheritance, navigation consistency, style consistency, meta presence,
   link integrity, and responsive behavior after the change.

## What It Covers

- **Layout integrity** — Single source of truth for the shell. Pages inherit, never duplicate.
- **Routing integrity** — Hierarchical routes under the layout. No standalone registrations.
- **Navigation consistency** — Single nav source. Updated once when pages are added.
- **Style architecture** — Global → scoped hierarchy. No global styles in page files.
- **Meta/SEO consistency** — Layout defines structure, pages provide values. No missing tags.
- **Link integrity** — Relative paths or base-aware utilities. Consistent trailing slashes.
- **Framework-specific guidance** — Concrete patterns for Astro, Next.js (App/Pages), Vue/Nuxt,
  SvelteKit, Angular, React SPA, and traditional server-rendered frameworks (Rails, Django, Laravel).

## Repository Layout

```
.
├── agents/            # Agent definitions (custom agent prompts/configs)
├── skills/            # Reusable skills (open Agent Skills standard)
│   └── web-architecture-guardrails/
│       ├── SKILL.md               # Canonical skill definition (source of truth)
│       ├── README.md              # This file
│       ├── evals/
│       │   └── evals.json         # Eval scenarios
│       └── references/
│           └── condensed.md       # Fallback for tools that don't read SKILL.md
├── install-skill.sh   # Cross-platform installer (symlinks skills into target projects)
└── README.md
```

## Install to a Target Project

Skills are discovered by tools at well-known paths. `install-skill.sh` symlinks this skill folder
into a target project under the path each tool expects:

```bash
# Install for one tool
bash install-skill.sh --tool claude --target /path/to/project

# Install for several tools at once
bash install-skill.sh --tool claude,codex,cursor --target /path/to/project

# List supported tools and their install paths
bash install-skill.sh --list-tools

# Uninstall
bash install-skill.sh --tool claude --target /path/to/project --remove
```

### Supported tools

| Tool | Installs into |
|------|---------------|
| Claude Code | `.claude/skills/` |
| OpenAI Codex | `.codex/skills/` |
| OpenCode | `.opencode/skills/` |
| Kilo Code | `.kilocode/skills/` |
| Cursor | `.cursor/skills/` |
| GitHub Copilot / VS Code | `.github/skills/` |
| Kiro (AWS) | `.kiro/skills/` |
| Gemini CLI | `.gemini/skills/` |
| Roo Code / Cline | `.roo/skills/` |
| Goose | `.goose/skills/` |

### Tools without native SKILL.md support

For agents that only read a project memory file (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`,
`.windsurfrules`, etc.), point them at `references/condensed.md` or paste its content into the
tool's rules file. The condensed version carries the trigger phrases, the structural rules, the
anti-pattern table, and the workflow without the verbose rationale and framework-specific detail.

## Use It

Open any supported AI coding tool in a project where the skill is installed and ask:

> "Add a /pricing page to the site"

or

> "The footer is missing on the new /blog page — fix it"

or

> "Review this project for architectural consistency before we add more pages"

The agent recognizes the intent from the skill's `description` and follows the audit → implement
→ verify workflow, refusing to ship pages that duplicate the shell or break navigation.

## Eval Scenarios

`evals/evals.json` defines two scenarios:

1. **Build** — Add a new page to an existing multi-page project. Expects: shared layout used
   (no shell duplication), route registered hierarchically, navigation updated, meta tags present,
   style consistency maintained, links use relative paths.
2. **Review** — Audit an existing project for architectural drift. Expects: identification of
   shell duplication, navigation inconsistencies, style drift, missing meta, broken links, and
   specific remediation steps.
