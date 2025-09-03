#!/usr/bin/env bash

cd "$(dirname "$0")/.."

readonly model="gemini-2.5-flash"
readonly targetLangs=(
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

taskFilePath="$(pwd)/prompts/translate-docs.md"

for lang in "${targetLangs[@]}"; do
  gemini --prompt "Finish the task described in '$taskFilePath'. Target language: $lang" \
    --yolo \
    --model "$model"
done
