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

for lang in "${targetLangs[@]}"; do
  npx tsx scripts/text-file-translator.ts \
    --input docs \
    --excluded-input "**/privacy-policy.*" \
    --excluded-input "**/terms-of-use.*" \
    --source-lang en \
    --output-dir "i18n/$lang/docusaurus-plugin-content-docs/current" \
    --target-lang "$lang" \
    --model "$model"
done
