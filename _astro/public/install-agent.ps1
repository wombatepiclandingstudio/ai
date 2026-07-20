#Requires -Version 5.1
# DO NOT EDIT — synced from repo root by _astro/scripts/sync-installers.mjs.
# Edit the source at the repo root instead.
<#
.SYNOPSIS
    Cross-platform installer for the AGENTS in this repo (PowerShell edition).

.DESCRIPTION
    Agents are folders named after the agent, each containing an agent markdown file
    (Claude Code subagent format: YAML frontmatter with name/description/tools + a
    system-prompt body). This script symlinks each agent file into a target project
    under that tool's agents path, so the same canonical agent file is exposed to many
    tools with no text rewriting.

    Skills (skills/<name>/SKILL.md) are installed by install-skill.ps1, NOT this script.

.PARAMETER Tool
    Comma-separated list of tool keys (e.g. "claude,opencode"). See -ListTools.

.PARAMETER Target
    Target project directory to install into. Ignored when -Global is used.

.PARAMETER Global
    Install to the user's home directory so the agents apply across ALL projects
    (e.g. ~/.claude/agents, ~/.cline/agents). Note: codex and cursor have no
    native global named-subagent directory, so those keys still print a manual hint.

.PARAMETER Remove
    Remove previously installed links/copies instead of installing.

.PARAMETER Copy
    Copy files instead of creating symlinks (use when symlinks require admin rights).

.PARAMETER ListTools
    List supported tools and their discovery paths, then exit.

.PARAMETER Id
    Install only the agent folder agents/<name> (omit to install all agents).

.EXAMPLE
    pwsh install-agent.ps1 -Tool claude -Target C:\projects\myapp
    pwsh install-agent.ps1 -Tool claude,opencode,kiro -Target . -Copy
    pwsh install-agent.ps1 -Tool claude -Target . -Remove
    pwsh install-agent.ps1 -Tool claude,cline -Global
    pwsh install-agent.ps1 -Tool claude -Target . -Id my-agent
    pwsh install-agent.ps1 -ListTools
#>
[CmdletBinding(DefaultParameterSetName = 'Install')]
param(
    [string]   $Tool,
    [string]   $Target,
    [switch]   $Global,
    [switch]   $Remove,
    [switch]   $Copy,
    [switch]   $ListTools,
    [string]   $Id
)

$ErrorActionPreference = 'Stop'

$RepoRoot  = Split-Path -Parent $MyInvocation.MyCommand.Definition
# When this script is downloaded standalone (e.g. from the site root) there is no
# agents/ directory next to it. In that case clone the repo into a temp dir so the
# canonical agent files can still be installed.
if (-not (Test-Path (Join-Path $RepoRoot 'agents'))) {
    $CloneDir = Join-Path $env:TEMP ("ai-agents-" + [guid]::NewGuid().ToString('N'))
    Write-Host "Downloading agents from the repository into $CloneDir ..."
    git clone --depth 1 https://github.com/wombatepiclandingstudio/ai "$CloneDir" | Out-Null
    $RepoRoot = $CloneDir
}
$AgentsDir = Join-Path $RepoRoot 'agents'

# Map a tool key to the relative agents path inside a target project.
$ToolPaths = @{
    claude   = '.claude/agents'
    opencode = '.opencode/agents'
    copilot  = '.github/agents'
    kiro     = '.kiro/agents'
    gemini   = '.gemini/agents'
    kilocode = '.kilocode/agents'
    kilo     = '.kilo/agents'
    roo      = '.roo/agents'
    cline    = '.cline/agents'
    goose    = '.goose/agents'
    vscode   = '.github/agents'
}
# Map a tool key to its GLOBAL (user-home) agents path. Used when -Global is passed.
# Verified 2026: claude ~/.claude/agents * opencode ~/.config/opencode/agents *
#   kiro ~/.kiro/agents * gemini ~/.gemini/agents * kilo ~/.kilo/agents (legacy
#   ~/.kilocode/agents also read) * roo ~/.roo/agents * cline ~/.cline/agents *
#   goose ~/.goose/agents. codex/cursor have NO native global named-subagent dir
#   (still skipped with the manual AGENTS.md hint). copilot/vscode read .github/agents
#   per project; -Global best-effort installs under $HOME/.github/agents.
$GlobalPaths = @{
    claude   = '.claude/agents'
    opencode = '.config/opencode/agents'
    copilot  = '.github/agents'
    kiro     = '.kiro/agents'
    gemini   = '.gemini/agents'
    kilocode = '.kilocode/agents'
    kilo     = '.kilo/agents'
    roo      = '.roo/agents'
    cline    = '.cline/agents'
    goose    = '.goose/agents'
    vscode   = '.github/agents'
}
# Tools that have no native named-subagent directory (install skipped with guidance).
$NoAgentDir = @('codex', 'cursor')

function List-Tools {
    Write-Host 'Supported tools (named-subagent install):'
    foreach ($k in $ToolPaths.Keys) {
        '{0,-10} -> {1}' -f $k, $ToolPaths[$k] | Write-Host
    }
    Write-Host ''
    Write-Host 'Skipped (no native named-subagent directory - paste the agent body into AGENTS.md manually):'
    Write-Host '  codex     (reads AGENTS.md at repo root)'
    Write-Host '  cursor    (reads AGENTS.md / .cursor/rules at repo root)'
}

function Usage {
    Write-Host 'Usage: pwsh install-agent.ps1 -Tool <key[,key...]> -Target <dir> [-Remove] [-Copy] [-Id <name>]'
    Write-Host '       pwsh install-agent.ps1 -ListTools'
    Write-Host ('Tool keys: ' + ($ToolPaths.Keys -join ','))
    Write-Host '  -Id <name> installs only agents/<name> (default: all agents).'
}

function Resolve-AgentFile {
    param([string] $Dir)
    $name = Split-Path -Leaf $Dir
    $preferred = Join-Path $Dir "$name.md"
    if (Test-Path -LiteralPath $preferred) { return $preferred }
    $first = Get-ChildItem -LiteralPath $Dir -Filter *.md | Select-Object -First 1
    if ($first) { return $first.FullName }
    return ''
}

if ($ListTools) { List-Tools; exit 0 }

if (-not $Tool -and -not $Remove) { Usage; exit 1 }

# Global install: target is the user's home directory so agents apply across all projects.
if ($Global) {
    if (-not $env:HOME) {
        Write-Error 'ERROR: -Global requires the HOME environment variable to be set'
        exit 1
    }
    $Target = $env:HOME
    "Installing globally under $Target (all projects)" | Write-Host
} else {
    if (-not $Target -and -not $Remove) { Write-Error 'ERROR: -Target is required (or use -Global)'; exit 1 }
}

if (-not $Remove) {
    if (-not (Test-Path -LiteralPath $Target -PathType Container)) {
        Write-Error "ERROR: target does not exist: $Target"
        exit 1
    }
}

$Tools = $Tool -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ }

# Resolve the set of source agent folders. With -Id, install only that one folder.
if ($Id) {
    $src = Join-Path $AgentsDir $Id
    if (-not (Test-Path -LiteralPath $src -PathType Container)) {
        Write-Error "ERROR: no agent with id '$Id' (expected $src)"
        exit 1
    }
    $SourceDirs = @($src)
} else {
    $SourceDirs = Get-ChildItem -LiteralPath $AgentsDir -Directory
}

foreach ($t in $Tools) {
    if ($NoAgentDir -contains $t) {
        Write-Warning "'$t' has no native named-subagent directory - paste the agent body into the project AGENTS.md manually."
        continue
    }
    if ($Global) {
        if (-not $GlobalPaths.ContainsKey($t)) {
            Write-Warning "unknown tool '$t' (see -ListTools); skipping"
            continue
        }
        $relPath = $GlobalPaths[$t]
    } else {
        if (-not $ToolPaths.ContainsKey($t)) {
            Write-Warning "unknown tool '$t' (see -ListTools); skipping"
            continue
        }
        $relPath = $ToolPaths[$t]
    }
    $dest     = Join-Path $Target $relPath

    if ($Remove) {
        if (Test-Path -LiteralPath $dest -PathType Container) {
            foreach ($agentDir in $SourceDirs) {
                $link = Join-Path $dest $agentDir.Name
                if (Test-Path -LiteralPath $link) {
                    Remove-Item -LiteralPath $link -Recurse -Force
                    "removed $t`: $link" | Write-Host
                }
            }
        }
        continue
    }

    New-Item -ItemType Directory -Path $dest -Force | Out-Null
    foreach ($agentDir in $SourceDirs) {
        $name = $agentDir.Name
        $src  = Resolve-AgentFile -Dir $agentDir.FullName
        if (-not $src) {
            Write-Warning "no agent markdown found in $($agentDir.FullName); skipping"
            continue
        }
        $link = Join-Path $dest $name
        if (Test-Path -LiteralPath $link) {
            "exists $t`: $link (skipping)" | Write-Host
            continue
        }
        if ($Copy) {
            Copy-Item -LiteralPath $src -Destination $link
            "copied $t`: $link -> $src" | Write-Host
        } else {
            New-Item -ItemType SymbolicLink -Path $link -Target $src | Out-Null
            "linked $t`: $link -> $src" | Write-Host
        }
    }
}
