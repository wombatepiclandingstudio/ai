#Requires -Version 5.1
<#
.SYNOPSIS
    Cross-platform installer for the SKILLS in this repo (PowerShell edition).

.DESCRIPTION
    Skills are folders containing a SKILL.md (the open Agent Skills standard). Every
    compatible tool discovers skills by looking in a well-known directory. This script
    symlinks (or copies) each skill folder into a target project under that tool's path,
    so the same canonical SKILL.md is exposed to many tools with no text rewriting.

    Agent definitions live in agents/ and are installed by install-agent.ps1.

.PARAMETER Tool
    Comma-separated list of tool keys (e.g. "claude,codex,cursor"). See -ListTools.

.PARAMETER Target
    Target project directory to install into. Ignored when -Global is used.

.PARAMETER Global
    Install to the user's home directory so the skills apply across ALL projects
    (e.g. ~/.claude/skills, ~/.codex/skills, ~/.cursor/skills, ~/.cline/skills).

.PARAMETER Remove
    Remove previously installed links/copies instead of installing.

.PARAMETER Copy
    Copy files instead of creating symlinks (use when symlinks require admin rights).

.PARAMETER ListTools
    List supported tools and their discovery paths, then exit.

.EXAMPLE
    pwsh install-skill.ps1 -Tool claude -Target C:\projects\myapp
    pwsh install-skill.ps1 -Tool claude,codex,cursor -Target . -Copy
    pwsh install-skill.ps1 -Tool claude -Target . -Remove
    pwsh install-skill.ps1 -Tool claude,cursor,cline -Global
    pwsh install-skill.ps1 -ListTools
#>
[CmdletBinding(DefaultParameterSetName = 'Install')]
param(
    [string]   $Tool,
    [string]   $Target,
    [switch]   $Global,
    [switch]   $Remove,
    [switch]   $Copy,
    [switch]   $ListTools
)

$ErrorActionPreference = 'Stop'

$RepoRoot   = Split-Path -Parent $MyInvocation.MyCommand.Definition
$SkillsDir  = Join-Path $RepoRoot 'skills'

# Map a tool key to the relative skills path inside a target project.
$ToolPaths = @{
    claude   = '.claude/skills'
    codex    = '.codex/skills'
    opencode = '.opencode/skills'
    cursor   = '.cursor/skills'
    copilot  = '.github/skills'
    kiro     = '.kiro/skills'
    gemini   = '.gemini/skills'
    kilocode = '.kilocode/skills'
    kilo     = '.kilo/skills'
    roo      = '.roo/skills'
    cline    = '.clinerules'
    goose    = '.goose/skills'
    vscode   = '.github/skills'
}

function List-Tools {
    Write-Host 'Supported tools:'
    foreach ($k in $ToolPaths.Keys) {
        '{0,-10} -> {1}' -f $k, $ToolPaths[$k] | Write-Host
    }
}

function Usage {
    Write-Host 'Usage: pwsh install-skill.ps1 -Tool <key[,key...]> -Target <dir> [-Remove] [-Copy]'
    Write-Host '       pwsh install-skill.ps1 -ListTools'
    Write-Host ('Tool keys: ' + ($ToolPaths.Keys -join ','))
}

if ($ListTools) { List-Tools; exit 0 }

if (-not $Tool -and -not $Remove) { Usage; exit 1 }

# Global install: target is the user's home directory so skills apply across all projects.
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

foreach ($t in $Tools) {
    if (-not $ToolPaths.ContainsKey($t)) {
        Write-Warning "unknown tool '$t' (see -ListTools); skipping"
        continue
    }
    $relPath = $ToolPaths[$t]
    $dest     = Join-Path $Target $relPath

    if ($Remove) {
        if (Test-Path -LiteralPath $dest -PathType Container) {
            foreach ($skillDir in Get-ChildItem -LiteralPath $SkillsDir -Directory) {
                $link = Join-Path $dest $skillDir.Name
                if (Test-Path -LiteralPath $link) {
                    Remove-Item -LiteralPath $link -Recurse -Force
                    "removed $t`: $link" | Write-Host
                }
            }
        }
        continue
    }

    New-Item -ItemType Directory -Path $dest -Force | Out-Null
    foreach ($skillDir in Get-ChildItem -LiteralPath $SkillsDir -Directory) {
        $name = $skillDir.Name
        $link = Join-Path $dest $name
        if (Test-Path -LiteralPath $link) {
            "exists $t`: $link (skipping)" | Write-Host
            continue
        }
        if ($Copy) {
            Copy-Item -LiteralPath $skillDir.FullName -Destination $link -Recurse
            "copied $t`: $link -> $($skillDir.FullName)" | Write-Host
        } else {
            New-Item -ItemType SymbolicLink -Path $link -Target $skillDir.FullName | Out-Null
            "linked $t`: $link -> $($skillDir.FullName)" | Write-Host
        }
    }
}
