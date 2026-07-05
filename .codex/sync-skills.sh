#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE_DIR="$REPO_ROOT/.codex/skills"
TARGET_ROOT="${CODEX_HOME:-$HOME/.codex}/skills"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Source skills directory not found: $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$TARGET_ROOT"

clean_mode="false"
if [[ "${1:-}" == "--clean" ]]; then
  clean_mode="true"
fi

copied=0

while IFS= read -r skill_dir; do
  skill_name="$(basename "$skill_dir")"
  target_dir="$TARGET_ROOT/$skill_name"

  mkdir -p "$(dirname "$target_dir")"
  rm -rf "$target_dir"
  cp -R "$skill_dir" "$target_dir"
  echo "Synced $skill_name -> $target_dir"
  copied=$((copied + 1))
done < <(find "$SOURCE_DIR" -mindepth 2 -maxdepth 2 -type d | sort)

if [[ "$clean_mode" == "true" ]]; then
  while IFS= read -r installed_dir; do
    skill_name="$(basename "$installed_dir")"

    if ! find "$SOURCE_DIR" -mindepth 2 -maxdepth 2 -type d -name "$skill_name" | grep -q .; then
      rm -rf "$installed_dir"
      echo "Removed $installed_dir"
    fi
  done < <(find "$TARGET_ROOT" -mindepth 1 -maxdepth 1 -type d ! -name '.system' | sort)
fi

echo "Finished syncing $copied skill(s) to $TARGET_ROOT."
echo "Restart Codex to pick up new skills."
