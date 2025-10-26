#!/usr/bin/env bash

cd "$(dirname "$0")/.."

readonly model="github-copilot/gpt-5-mini"
readonly allTargetLangs=(
  "bg"
  "cs"
  "da"
  "de"
  "el"
  "es"
  "et"
  "fi"
  "fr"
  "hu"
  "id"
  "it"
  "ja"
  "ko"
  "lt"
  "lv"
  "nl"
  "pl"
  "pt-br"
  "pt-pt"
  "ro"
  "ru"
  "sk"
  "sl"
  "sv"
  "tr"
  "uk"
  "zh-hans"
)

# Parse command-line arguments
targetLangs=()
ruleIds=()

while [[ $# -gt 0 ]]; do
  case $1 in
    --target-langs)
      shift
      while [[ $# -gt 0 && ! "$1" =~ ^-- ]]; do
        targetLangs+=("$1")
        shift
      done
      ;;
    --rule-ids)
      shift
      while [[ $# -gt 0 && ! "$1" =~ ^-- ]]; do
        ruleIds+=("$1")
        shift
      done
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--target-langs lang1 lang2 ...] [--rule-ids rule1 rule2 ...]"
      exit 1
      ;;
  esac
done

# Interactive mode if arguments not provided
if [ ${#targetLangs[@]} -eq 0 ]; then
  echo "Available languages: ${allTargetLangs[*]}"
  echo "Enter target languages (space-separated, or press Enter for all):"
  read -r input
  if [ -z "$input" ]; then
    targetLangs=("${allTargetLangs[@]}")
  else
    read -ra targetLangs <<< "$input"
  fi
fi

if [ ${#ruleIds[@]} -eq 0 ]; then
  echo "Enter rule IDs (space-separated, or press Enter for all):"
  read -r input
  if [ -n "$input" ]; then
    read -ra ruleIds <<< "$input"
  fi
fi

# Build the prompt
taskFilePath="$(pwd)/prompts/translate-library-i18n-messages-json.md"

for lang in "${targetLangs[@]}"; do
  promptText="Finish the task described in '$taskFilePath'. Target language: $lang"
  
  # Add rule IDs to prompt if specified
  if [ ${#ruleIds[@]} -gt 0 ]; then
    promptText="$promptText. Rule IDs: ${ruleIds[*]}"
  fi
  
  opencode run "$prompt" \
    --model "$model"
done
