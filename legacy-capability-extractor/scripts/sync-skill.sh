#!/usr/bin/env bash
#
# sync-skill.sh — Convenience wrapper for the universal skill sync script.
#
# Usage:
#   ./scripts/sync-skill.sh [TARGET_DIR]
#   ./scripts/sync-skill.sh [TARGET_DIR] --tool cursor,copilot
#   ./scripts/sync-skill.sh [TARGET_DIR] --dry-run
#   ./scripts/sync-skill.sh [TARGET_DIR] --remove
#   ./scripts/sync-skill.sh --list-tools
#
# This delegates to skills/_shared/sync-skill.py which supports 16 AI coding tools.
# See: python3 skills/_shared/sync-skill.py --list-tools
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
SHARED_SCRIPT="$SKILL_DIR/../_shared/sync-skill.py"

# Resolve to absolute path
if [ ! -f "$SHARED_SCRIPT" ]; then
    echo "ERROR: Shared sync script not found at $SHARED_SCRIPT" >&2
    echo "Make sure skills/_shared/sync-skill.py exists." >&2
    exit 1
fi

# Default target is current directory
TARGET="${1:-.}"
shift 2>/dev/null || true

# If first arg is a flag (not a directory), reset target
if [[ "$TARGET" == --* ]]; then
    exec python3 "$SHARED_SCRIPT" "$SKILL_DIR" --target "." "$TARGET" "${@:-}"
fi

exec python3 "$SHARED_SCRIPT" "$SKILL_DIR" --target "$TARGET" "${@:-}"