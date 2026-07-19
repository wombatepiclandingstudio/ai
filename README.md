# ai

Personal repository for all things AI — reusable skills and custom agents, installable into many coding tools.

## What's inside

- **`skills/`** — reusable skills following the open [Agent Skills](https://github.com/agentskills/agentskills) standard (each is a folder with a `SKILL.md`).
- **`agents/`** — custom agent definitions in the [Claude Code subagent format](agents/README.md) (each is `<name>/<name>.md` with YAML frontmatter + a system-prompt body).
- **Installers** — `install-skill.sh` / `install-skill.ps1` (skills) and `install-agent.sh` / `install-agent.ps1` (agents), for bash and PowerShell.

The installers symlink (or copy) each item into a target tool's well-known discovery directory, so a single canonical file works across every compatible tool with no text rewriting.

## Install a skill

Into a project:

```bash
bash install-skill.sh --tool claude,codex,cursor,kilocode,opencode --target /path/to/project
bash install-skill.sh --list-tools        # show supported tools and paths
bash install-skill.sh --tool claude --target /path/to/project --remove
```

On Windows (PowerShell):

```powershell
pwsh install-skill.ps1 -Tool claude,codex,cursor,kilocode,opencode -Target C:\path\to\project
pwsh install-skill.ps1 -ListTools
pwsh install-skill.ps1 -Tool claude -Target . -Remove
```

Across **all** projects (into your home directory):

```bash
bash install-skill.sh --tool claude,cursor,cline --global
```

```powershell
pwsh install-skill.ps1 -Tool claude,cursor,cline -Global
```

On Windows, pass `-Copy` to the `.ps1` installer if symlink creation requires admin rights (it copies instead of linking).

## Install an agent

Into a project:

```bash
bash install-agent.sh --tool claude,opencode,kiro --target /path/to/project
bash install-agent.sh --list-tools        # show supported tools and paths
bash install-agent.sh --tool claude --target /path/to/project --remove
```

On Windows (PowerShell):

```powershell
pwsh install-agent.ps1 -Tool claude,opencode,kiro -Target C:\path\to\project
pwsh install-agent.ps1 -ListTools
pwsh install-agent.ps1 -Tool claude -Target . -Remove
```

Across **all** projects (into your home directory):

```bash
bash install-agent.sh --tool claude,cline --global
```

```powershell
pwsh install-agent.ps1 -Tool claude,cline -Global
```

On Windows, pass `-Copy` to the `.ps1` installer if symlink creation requires admin rights.

`codex` and `cursor` have no native global named-subagent directory — for those tools the installer still prints a hint to paste the agent body into the project `AGENTS.md` manually.

## Install without cloning

You don't need to clone this repo. Pipe the installer straight from GitHub and tell it which tools to target (replace `main` with a tag/branch to pin a version):

```bash
# Skills
curl -fsSL https://raw.githubusercontent.com/wombatepiclandingstudio/ai/main/install-skill.sh | bash -s -- --tool claude,codex,cursor,kilocode,opencode --target /path/to/project

# Agents
curl -fsSL https://raw.githubusercontent.com/wombatepiclandingstudio/ai/main/install-agent.sh | bash -s -- --tool claude,opencode,kiro --target /path/to/project
```

On Windows (PowerShell), download and run the `.ps1` installer:

```powershell
# Skills
irm https://raw.githubusercontent.com/wombatepiclandingstudio/ai/main/install-skill.ps1 -OutFile install-skill.ps1
pwsh .\install-skill.ps1 -Tool claude,codex,cursor,kilocode,opencode -Target C:\path\to\project

# Agents
irm https://raw.githubusercontent.com/wombatepiclandingstudio/ai/main/install-agent.ps1 -OutFile install-agent.ps1
pwsh .\install-agent.ps1 -Tool claude,opencode,kiro -Target C:\path\to\project
```

If you're working inside an AI coding agent itself, you can also use its **WebFetch** tool to read an installer and apply it — e.g. ask it to fetch `install-agent.sh` and run it with `--tool claude --target .`.

(Adjust the repo owner `wombatepiclandingstudio` and branch `main` to match this repository.)
