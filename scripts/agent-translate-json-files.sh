#!/usr/bin/env bash

cd "$(dirname "$0")/.."

readonly model="gemini-2.5-flash"
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

while [[ $# -gt 0 ]]; do
  case $1 in
    --target-langs)
      shift
      while [[ $# -gt 0 && ! "$1" =~ ^-- ]]; do
        targetLangs+=("$1")
        shift
      done
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--target-langs lang1 lang2 ...]"
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

# Build the prompt
taskFilePath="$(pwd)/prompts/translate-i18n-json-files.md"

for lang in "${targetLangs[@]}"; do
  gemini --prompt "Finish the task described in '$taskFilePath'. Target language: $lang" \
    --yolo \
    --model "$model"
done
