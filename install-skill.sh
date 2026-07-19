#!/usr/bin/env bash
#
# install-skill.sh — Cross-platform installer for the SKILLS in this repo.
#
# Skills are folders containing a SKILL.md (the open Agent Skills standard). Every
# compatible tool discovers skills by looking in a well-known directory. This script
# symlinks (or copies) each skill folder into a target project under that tool's path,
# so the same canonical SKILL.md is exposed to many tools with no text rewriting.
#
# Agent definitions live in agents/ and are installed by install-agent.sh.
#
# Usage:
#   bash install-skill.sh --tool claude --target /path/to/project
#   bash install-skill.sh --tool claude,codex,cursor --target /path/to/project
#   bash install-skill.sh --tool claude --target /path/to/project --remove
#   bash install-skill.sh --list-tools
#   bash install-skill.sh --tool claude,cursor,cline --global
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$REPO_ROOT/skills"

# Map a tool key to the relative skills path inside a target project.
declare -A TOOL_PATHS=(
  [claude]=".claude/skills"
  [codex]=".codex/skills"
  [opencode]=".opencode/skills"
  [cursor]=".cursor/skills"
  [copilot]=".github/skills"
  [kiro]=".kiro/skills"
  [gemini]=".gemini/skills"
  [kilocode]=".kilocode/skills"
  [kilo]=".kilo/skills"
  [roo]=".roo/skills"
  [cline]=".clinerules"
  [goose]=".goose/skills"
  [vscode]=".github/skills"
)

list_tools() {
  echo "Supported tools:"
  for k in "${!TOOL_PATHS[@]}"; do
    printf "  %-10s -> %s\n" "$k" "${TOOL_PATHS[$k]}"
  done
}

usage() {
  echo "Usage: bash install-skill.sh --tool <key[,key...]> --target <dir> [--remove] [--global]"
  echo "       bash install-skill.sh --list-tools"
  echo "Tool keys: $(IFS=,; echo "${!TOOL_PATHS[*]}")"
  echo "--global installs under \$HOME so skills apply to all projects."
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
  path="${TOOL_PATHS[$tool]:-}"
  [[ -z "$path" ]] && { echo "WARN: unknown tool '$tool' (see --list-tools); skipping" >&2; continue; }

  if [[ $REMOVE -eq 1 ]]; then
    for skill_dir in "$SKILLS_DIR"/*/; do
      name="$(basename "$skill_dir")"
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
  for skill_dir in "$SKILLS_DIR"/*/; do
    name="$(basename "$skill_dir")"
    link="$dest/$name"
    if [[ -e "$link" || -L "$link" ]]; then
      echo "exists $tool: $link (skipping)"
    else
      ln -s "$skill_dir" "$link"
      echo "linked $tool: $link -> $skill_dir"
    fi
  done
done
