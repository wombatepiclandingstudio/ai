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
optionally with `references/`, `evals/`, and `scripts/`. Installation instructions live in
each skill's `README.md`, not in the `SKILL.md` (which stays focused on instructions).

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

### Install a skill into a project

```bash
bash install-skill.sh --tool claude,codex,cursor,kilocode,opencode --target /path/to/project
bash install-skill.sh --list-tools        # show supported tools and paths
bash install-skill.sh --tool claude --target /path/to/project --remove
bash install-skill.sh --tool claude --target /path/to/project --id backoffice-design   # install one skill
```

On Windows (PowerShell):

```powershell
pwsh install-skill.ps1 -Tool claude,codex,cursor,kilocode,opencode -Target C:\path\to\project
pwsh install-skill.ps1 -ListTools
pwsh install-skill.ps1 -Tool claude -Target . -Remove
pwsh install-skill.ps1 -Tool claude -Target . -Id backoffice-design   # install one skill
```

Pass `--id <name>` (Bash) or `-Id <name>` (PowerShell) to install a single skill folder
(`skills/<name>`); omit it to install all skills. An unknown id prints an error and exits.

Install to the user's home directory so the skills apply across **all** projects (e.g. `~/.claude/skills`, `~/.codex/skills`, `~/.cursor/skills`, `~/.cline/skills`):

```bash
bash install-skill.sh --tool claude,cursor,cline --global
```

```powershell
pwsh install-skill.ps1 -Tool claude,cursor,cline -Global
```

With `--global` / `-Global`, each tool's **global** (user-home) discovery dir is used, not the
project-relative one. The resolved global paths (verified against each tool's 2026 docs) are:

| Tool | Global skills dir |
|------|-------------------|
| claude | `~/.claude/skills` |
| codex | `~/.codex/skills` |
| opencode | `~/.config/opencode/skills` |
| cursor | `~/.cursor/skills` |
| kiro | `~/.kiro/skills` |
| gemini | `~/.gemini/skills` |
| kilo | `~/.kilo/skills` (legacy `~/.kilocode/skills` also read) |
| roo | `~/.roo/skills` |
| cline | `~/.cline/skills` |
| goose | `~/.goose/skills` |
| copilot / vscode | `~/.github/skills` (best-effort; these read `.github/skills` per project) |

Skills are exposed to each tool by symlinking the skill folder into the tool's discovery path
(e.g. `.claude/skills/`, `.codex/skills/`). No code generation or text rewriting is involved,
so a single canonical `SKILL.md` works across every compatible tool. On Windows, pass `-Copy` to
`install-skill.ps1` if symlink creation requires admin rights (it copies instead of linking).

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

### Install an agent into a project

```bash
bash install-agent.sh --tool claude,opencode,kiro --target /path/to/project
bash install-agent.sh --list-tools        # show supported tools and paths
bash install-agent.sh --tool claude --target /path/to/project --remove
bash install-agent.sh --tool claude --target /path/to/project --id bookworm   # install one agent
```

On Windows (PowerShell):

```powershell
pwsh install-agent.ps1 -Tool claude,opencode,kiro -Target C:\path\to\project
pwsh install-agent.ps1 -ListTools
pwsh install-agent.ps1 -Tool claude -Target . -Remove
pwsh install-agent.ps1 -Tool claude -Target . -Id bookworm   # install one agent
```

Pass `--id <name>` (Bash) or `-Id <name>` (PowerShell) to install a single agent folder
(`agents/<name>`); omit it to install all agents. An unknown id prints an error and exits.

Install to the user's home directory so the agents apply across **all** projects (e.g. `~/.claude/agents`, `~/.cline/agents`). `codex` and `cursor` have no native global named-subagent directory, so they still print a manual `AGENTS.md` hint:

```bash
bash install-agent.sh --tool claude,cline --global
```

```powershell
pwsh install-agent.ps1 -Tool claude,cline -Global
```

With `--global` / `-Global`, each tool's **global** (user-home) agents dir is used
(see the global-path table above, replacing `skills` with `agents`). `codex` and `cursor`
have no native global named-subagent directory, so they still print a manual `AGENTS.md` hint.

Agents are exposed to each tool by symlinking the agent file into the tool's agents discovery path
(e.g. `.claude/agents/`). `codex` and `cursor` have no native named-subagent directory, so they are
skipped with a warning — paste the agent body into the project `AGENTS.md` manually for those tools.
On Windows, pass `-Copy` to `install-agent.ps1` if symlink creation requires admin rights.

## Install without cloning

You don't need to clone this repo to install its skills or agents. Pipe the installer straight
from GitHub and tell it which tools to target (replace `main` with a tag/branch if you want a pinned
version):

```bash
# Skills (all)
curl -fsSL https://raw.githubusercontent.com/wombatepiclandingstudio/ai/main/install-skill.sh | bash -s -- --tool claude,codex,cursor,kilocode,opencode --target /path/to/project

# Skills (single)
curl -fsSL https://raw.githubusercontent.com/wombatepiclandingstudio/ai/main/install-skill.sh | bash -s -- --tool claude --target /path/to/project --id backoffice-design

# Agents
curl -fsSL https://raw.githubusercontent.com/wombatepiclandingstudio/ai/main/install-agent.sh | bash -s -- --tool claude,opencode,kiro --target /path/to/project
```

On Windows (PowerShell), download and run the `.ps1` installer:

```powershell
# Skills (all)
irm https://raw.githubusercontent.com/wombatepiclandingstudio/ai/main/install-skill.ps1 -OutFile install-skill.ps1
pwsh .\install-skill.ps1 -Tool claude,codex,cursor,kilocode,opencode -Target C:\path\to\project

# Skills (single)
irm https://raw.githubusercontent.com/wombatepiclandingstudio/ai/main/install-skill.ps1 -OutFile install-skill.ps1
pwsh .\install-skill.ps1 -Tool claude -Target . -Id backoffice-design

# Agents
irm https://raw.githubusercontent.com/wombatepiclandingstudio/ai/main/install-agent.ps1 -OutFile install-agent.ps1
pwsh .\install-agent.ps1 -Tool claude,opencode,kiro -Target C:\path\to\project
```

If you are working inside an AI coding agent itself, you can also use its **WebFetch** tool to read
the installer and apply it. For example, ask the agent:

> WebFetch https://raw.githubusercontent.com/wombatepiclandingstudio/ai/main/install-agent.sh and
> run it with --tool claude --target . to install the bookworm agent.

(Adjust the repo owner `wombatepiclandingstudio` and branch `main` to match this repository.)

## Compatibility note

The modern way to make a skill work across platforms is the **discovery-path** mechanism, not
per-tool adapter files. Every compatible tool reads `SKILL.md` from a well-known directory; for
tools that only understand a project memory file, a condensed copy lives in each skill's
`references/condensed.md`.
