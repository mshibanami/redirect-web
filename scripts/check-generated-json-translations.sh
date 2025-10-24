#!/usr/bin/env bash

cd "$(dirname "$0")/.."

readonly baseLang="en"
readonly baseJsonFilePatterns=(
    "./library/rule-sets/*/i18n/${baseLang}/messages.json"
    "./i18n/${baseLang}/*.json"
    "./i18n/${baseLang}/**/*.json"
)

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

for lang in "${targetLangs[@]}"; do
    echo "[${lang}] Checking translations ..."
    for pattern in "${baseJsonFilePatterns[@]}"; do
        baseJsonFiles=($(find . -path "$pattern" | sort -V))
        
        for baseFile in "${baseJsonFiles[@]}"; do
            targetFile="${baseFile/"/$baseLang/"/"/$lang/"}"

            if [ -f "$targetFile" ]; then
                parseError=""
                baseKeysOutput=$(jq -r 'paths | map(tostring) | join(".")' "$baseFile" 2>&1)
                baseKeysStatus=$?
                targetKeysOutput=$(jq -r 'paths | map(tostring) | join(".")' "$targetFile" 2>&1)
                targetKeysStatus=$?
                
                if [ $baseKeysStatus -ne 0 ]; then
                    parseError="Base file parse error: $baseKeysOutput"
                fi
                if [ $targetKeysStatus -ne 0 ]; then
                    parseError="${parseError:+$parseError\n\n}Target file parse error: $targetKeysOutput"
                fi
                
                if [ -n "$parseError" ]; then
                    echo "$targetFile: ❌️ $parseError"
                else
                    baseKeys=$(echo "$baseKeysOutput" | sort -V)
                    targetKeys=$(echo "$targetKeysOutput" | sort -V)
                    diffOutput=$(diff <(echo "$baseKeys") <(echo "$targetKeys"))
                    if [ -n "$diffOutput" ]; then
                        echo "$targetFile: ❌️ diff error: $diffOutput"
                    fi
                fi
            else
                echo "$targetFile: ❌️ File does not exist."
            fi
        done
    done
    
    echo
done
