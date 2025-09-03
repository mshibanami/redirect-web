#!/usr/bin/env bash

readonly model="gemini-2.5-flash"
readonly sourceLang="ja"
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
  npx tsx scripts/chrome-i18n-json-translator.ts \
    --input "i18n/$sourceLang/**/*.json" \
    --output-dir "i18n/$lang" \
    --target-lang "$lang" \
    --source-lang "$sourceLang" \
    --model "$model" \
    --key-regex ".*"
done
