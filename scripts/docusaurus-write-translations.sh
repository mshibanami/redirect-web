#!/usr/bin/env bash

cd "$(dirname "$0")/.."

npx docusaurus write-translations

declare -a ignored_code_json_patterns=(
  "^theme\\\\."
)
declare -a ignored_docs_json_patterns=(
  "^version\\\\.label$"
)
declare -a ignored_navbar_json_patterns=(
  "^title$"
)
declare -a ignored_footer_json_patterns=(
  "^copyright$"
  "^link\\\\.item\\\\.label\\\\.LinkedIn$"
  "^link\\\\.item\\\\.label\\\\.App Store$"
  "^link\\\\.item\\\\.label\\\\.GitHub$"
)

remove_keys_from_json() {
  local file="$1"
  shift
  local -a patterns=("$@")
  
  for pattern in "${patterns[@]}"; do
    jq "with_entries(select(.key | test(\"$pattern\") | not))" "$file" > tmp && mv tmp "$file"
  done
}
remove_keys_from_json "i18n/en/code.json" "${ignored_code_json_patterns[@]}"
remove_keys_from_json "i18n/en/docusaurus-plugin-content-docs/current.json" "${ignored_docs_json_patterns[@]}"
remove_keys_from_json "i18n/en/docusaurus-theme-classic/navbar.json" "${ignored_navbar_json_patterns[@]}"
remove_keys_from_json "i18n/en/docusaurus-theme-classic/footer.json" "${ignored_footer_json_patterns[@]}"
