# Backoffice Design

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills)
standard) for designing and reviewing enterprise **backoffice / operator-console** UIs. The
`SKILL.md` in this folder is the single source of truth — the same file is exposed to any compatible
tool via discovery paths, with no text rewriting required.

It combines two complementary sources, adapted to be **tech-agnostic**:

- **Structural backbone** — from the `backoffice-workflow-ux` skill: capability-page architecture,
  list/detail and task workflows, server-side filtering/pagination, role-aware navigation, resilient
  state handling, configuration UX, AI-assistant UX, and the backend-source-of-truth rule.
- **Design-pattern intelligence** — curated from the `ui-ux-pro-max` skill: a priority-ordered set
  of cross-cutting UI/UX disciplines (accessibility, touch, performance, layout, typography, color,
  animation, forms, navigation, charts). Ported as **patterns and checklists only** — the original
  search script and stack-specific data are intentionally omitted so the skill stays framework-neutral.

## What It Does

Given a request to build or review an internal / operator-facing UI, the skill instructs the agent to:

- Decompose the requirement into **one page per capability** behind a shared shell.
- Implement **list/detail** patterns with **server-side** filtering, sorting, and pagination for
  large datasets (no unbounded client-only lists).
- Provide **loading / empty / error / permission-denied / success** states for every critical flow.
- Build **configuration** and **AI-assistant** surfaces with the right boundaries (backend stays
  authoritative; AI does not silently mutate business state).
- Apply the **design-pattern table** and the detailed rules in `references/design-patterns.md`, plus
  the web-quality discipline (WCAG 2.2 accessibility, Core Web Vitals, security baseline) in
  `references/web-quality.md`, then run the pre-delivery checklists before declaring the UI done.

## What It Covers

- **Structure** — one capability page per route, shared shell, list/detail workflows, server-side
  filtering/pagination, role-aware navigation, resilient state handling, configuration UX,
  AI-assistant UX, and the backend-source-of-truth rule.
- **Design patterns** — 11 priority-ordered disciplines (accessibility, touch, performance, style,
  layout, typography/color, animation, forms, navigation, charts, security) summarized in `SKILL.md`
  and detailed in `references/design-patterns.md`.
- **Web quality** — accessibility to WCAG 2.2 AA, Core Web Vitals (LCP/INP/CLS) with budgets, and a
  security/robustness baseline (CSP, Trusted Types, SRI, semantic HTML, error handling), detailed in
  `references/web-quality.md`.

## Repository Layout

This repo is organized as:

```
.
├── agents/            # Agent definitions (custom agent prompts/configs)
├── skills/            # Reusable skills (open Agent Skills standard)
│   ├── legacy-capability-extractor/
│   └── backoffice-design/
│       ├── SKILL.md               # Canonical skill definition (source of truth)
│       ├── README.md              # This file
│       ├── evals/
│       │   └── evals.json         # Eval scenarios (build + review)
│       └── references/
│           ├── design-patterns.md # Structural UI/UX pattern rules + pre-delivery checklist
│           ├── web-quality.md      # WCAG 2.2, Core Web Vitals, security best-practices
│           └── condensed.md       # Fallback for tools that don't read SKILL.md
├── install.sh         # Cross-platform installer (symlinks skills into target projects)
└── README.md
```

## Install to a Target Project

Skills are discovered by tools at well-known paths. `install.sh` symlinks this skill folder
into a target project under the path each tool expects:

```bash
# Install for one tool
bash install.sh --tool claude --target /path/to/project

# Install for several tools at once
bash install.sh --tool claude,codex,cursor --target /path/to/project

# List supported tools and their install paths
bash install.sh --list-tools

# Uninstall
bash install.sh --tool claude --target /path/to/project --remove
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
tool's rules file. The condensed version carries the trigger phrases, the structural rules, and the
design-pattern priority table without the verbose rationale.

## Use It

Open any supported AI coding tool in a project where the skill is installed and ask:

> "Build an operator console for document ingestion: ingest, validate, archive, export, QA, settings."

or

> "Review this admin dashboard for UX and accessibility problems before we ship it."

The agent recognizes the intent from the skill's `description` and applies the capability-page
structure plus the design-pattern and web-quality disciplines.

## Eval Scenarios

`evals/evals.json` defines two scenarios:

1. **Build** — scaffold a multi-capability operator console; checks expect multiple capability pages
   (not one dashboard), server-side pagination, required states, a config page, an AI-assistant
   surface with no-silent-mutation, accessibility basics, performance budgets, and a security baseline.
2. **Review** — audit an existing admin dashboard; checks expect defects mapped to the
   design-pattern and web-quality disciplines (focus, contrast, hover-only, unbounded lists,
   color-only charts, CLS/INP regressions, missing CSP/SRI).

## Credits

Synthesized from three public skills:

- `backoffice-workflow-ux` (authenticfake/clike) — operational backoffice UX structure.
- `ui-ux-pro-max` (nextlevelbuilder/ui-ux-pro-max-skill) — UI/UX design-pattern intelligence,
  ported as curated patterns/checklists only (no search script, no stack-specific data) to keep the
  skill tech-agnostic.
- `web-quality-skills` (addyosmani/web-quality-skills, MIT) — accessibility (WCAG 2.2), performance &
  Core Web Vitals, and security best-practices, ported as framework-neutral principles into
  `references/web-quality.md`. SEO and the upstream CLI audit script were intentionally excluded as
  out of scope for internal tools / our "patterns only, no script" constraint.
