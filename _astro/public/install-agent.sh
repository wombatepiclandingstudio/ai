#!/usr/bin/env bash
#
# install-agent.sh — Cross-platform installer for the AGENTS in this repo.
#
# Agents are folders named after the agent, each containing an agent markdown file
# (Claude Code subagent format: YAML frontmatter with name/description/tools + a
# system-prompt body). Every compatible tool discovers agents by looking in a
# well-known directory. This script symlinks each agent file into a target project
# under that tool's agents path, so the same canonical agent file is exposed to many
# tools with no text rewriting.
#
# Skills (skills/<name>/SKILL.md) are installed by install-skill.sh, NOT this script.
#
# Usage:
#   bash install-agent.sh --tool claude --target /path/to/project
#   bash install-agent.sh --tool claude,codex,cursor --target /path/to/project
#   bash install-agent.sh --tool claude --target /path/to/project --remove
#   bash install-agent.sh --list-tools
#   bash install-agent.sh --tool claude,cline --global
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# When this script is downloaded standalone (e.g. from the site root) there is no
# agents/ directory next to it. In that case clone the repo into a temp dir so the
# canonical agent files can still be installed.
if [[ ! -d "$REPO_ROOT/agents" ]]; then
  CLONE_DIR="$(mktemp -d)"
  echo "Downloading agents from the repository into $CLONE_DIR ..."
  git clone --depth 1 https://github.com/wombatepiclandingstudio/ai "$CLONE_DIR" >/dev/null
  REPO_ROOT="$CLONE_DIR"
fi
AGENTS_DIR="$REPO_ROOT/agents"

# Map a tool key to the relative agents path inside a target project.
# Best-effort paths aligned with each tool's native agent discovery. Tools without a
# native named-subagent directory (codex, cursor) are listed in NO_AGENT_DIR so they get
# a clear, specific skip message pointing to manual AGENTS.md setup (see list_tools()).
declare -A TOOL_PATHS=(
  [claude]=".claude/agents"
  [opencode]=".opencode/agents"
  [copilot]=".github/agents"
  [kiro]=".kiro/agents"
  [gemini]=".gemini/agents"
  [kilocode]=".kilocode/agents"
  [kilo]=".kilo/agents"
  [roo]=".roo/agents"
  [cline]=".cline/agents"
  [goose]=".goose/agents"
  [vscode]=".github/agents"
)

# Map a tool key to its GLOBAL (user-home) agents path. Used when --global is passed.
# Verified 2026: claude ~/.claude/agents · opencode ~/.config/opencode/agents ·
#   kiro ~/.kiro/agents · gemini ~/.gemini/agents · kilo ~/.kilo/agents (legacy
#   ~/.kilocode/agents also read) · roo ~/.roo/agents · cline ~/.cline/agents ·
#   goose ~/.goose/agents. codex/cursor have NO native global named-subagent dir
#   (still skipped with the manual AGENTS.md hint). copilot/vscode read .github/agents
#   per project; --global best-effort installs under $HOME/.github/agents.
declare -A GLOBAL_PATHS=(
  [claude]=".claude/agents"
  [opencode]=".config/opencode/agents"
  [copilot]=".github/agents"
  [kiro]=".kiro/agents"
  [gemini]=".gemini/agents"
  [kilocode]=".kilocode/agents"
  [kilo]=".kilo/agents"
  [roo]=".roo/agents"
  [cline]=".cline/agents"
  [goose]=".goose/agents"
  [vscode]=".github/agents"
)
# Tools that have no native named-subagent directory (install skipped with guidance).
NO_AGENT_DIR=" codex cursor "

list_tools() {
  echo "Supported tools (named-subagent install):"
  for k in "${!TOOL_PATHS[@]}"; do
    printf "  %-10s -> %s\n" "$k" "${TOOL_PATHS[$k]}"
  done
  echo
  echo "Skipped (no native named-subagent directory — paste the agent body into AGENTS.md manually):"
  echo "  codex     (reads AGENTS.md at repo root)"
  echo "  cursor    (reads AGENTS.md / .cursor/rules at repo root)"
}

usage() {
  echo "Usage: bash install-agent.sh --tool <key[,key...]> --target <dir> [--remove] [--global]"
  echo "       bash install-agent.sh --list-tools"
  echo "Tool keys: $(IFS=,; echo "${!TOOL_PATHS[*]}")"
  echo "--global installs under \$HOME so agents apply to all projects."
}

# Resolve the agent markdown file inside an agent folder.
# Prefers <name>/<name>.md, else the first *.md found.
resolve_agent_file() {
  local dir="$1"
  local name
  name="$(basename "$dir")"
  if [[ -f "$dir/$name.md" ]]; then
    echo "$dir/$name.md"
    return
  fi
  local first
  first="$(ls "$dir"/*.md 2>/dev/null | head -n1)"
  if [[ -n "$first" ]]; then
    echo "$first"
    return
  fi
  echo ""
}

TOOLS=""
TARGET=""
REMOVE=0
GLOBAL=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --tool) TOOLS="${2:-}"; shift 2 ;;
    --target) TARGET="${2:-}"; shift 2 ;;
    --remove) REMOVE=1; shift ;;
    --global) GLOBAL=1; shift ;;
    --list-tools) list_tools; exit 0 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage; exit 1 ;;
  esac
done

[[ -z "$TOOLS" && $REMOVE -eq 0 ]] && { usage >&2; exit 1; }

if [[ $GLOBAL -eq 1 ]]; then
  [[ -z "$HOME" ]] && { echo "ERROR: --global requires HOME to be set" >&2; exit 1; }
  TARGET="$HOME"
  echo "Installing globally under $TARGET (all projects)"
else
  [[ -z "$TARGET" && $REMOVE -eq 0 ]] && { echo "ERROR: --target is required (or use --global)" >&2; exit 1; }
fi

if [[ $REMOVE -eq 0 ]]; then
  [[ -d "$TARGET" ]] || { echo "ERROR: target does not exist: $TARGET" >&2; exit 1; }
fi

IFS=',' read -ra TOOL_LIST <<< "$TOOLS"
for tool in "${TOOL_LIST[@]}"; do
  if [[ "$NO_AGENT_DIR" == *" $tool "* ]]; then
    echo "SKIP: '$tool' has no native named-subagent directory — paste the agent body into the project AGENTS.md manually." >&2
    continue
  fi
  if [[ $GLOBAL -eq 1 ]]; then
    path="${GLOBAL_PATHS[$tool]:-}"
    [[ -z "$path" ]] && { echo "WARN: unknown tool '$tool' (see --list-tools); skipping" >&2; continue; }
  else
    path="${TOOL_PATHS[$tool]:-}"
    [[ -z "$path" ]] && { echo "WARN: unknown tool '$tool' (see --list-tools); skipping" >&2; continue; }
  fi

  if [[ $REMOVE -eq 1 ]]; then
    for agent_dir in "$AGENTS_DIR"/*/; do
      name="$(basename "$agent_dir")"
      link="$TARGET/$path/$name"
      if [[ -e "$link" || -L "$link" ]]; then
        rm -f "$link"
        echo "removed $tool: $link"
      fi
    done
    continue
  fi

  dest="$TARGET/$path"
  mkdir -p "$dest"
  for agent_dir in "$AGENTS_DIR"/*/; do
    name="$(basename "$agent_dir")"
    src="$(resolve_agent_file "$agent_dir")"
    if [[ -z "$src" ]]; then
      echo "WARN: no agent markdown found in $agent_dir; skipping" >&2
      continue
    fi
    link="$dest/$name"
    if [[ -e "$link" || -L "$link" ]]; then
      echo "exists $tool: $link (skipping)"
    else
      ln -s "$src" "$link"
      echo "linked $tool: $link -> $src"
    fi
  done
done
