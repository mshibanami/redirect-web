#!/usr/bin/env bash

cd "$(dirname "$0")/.."

readonly model="gemini-3-flash-preview"
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
sourceFiles=""
overwrite_policy="ask" # default: ask, skip, overwrite

while [[ $# -gt 0 ]]; do
  case $1 in
    --target-langs)
      shift
      while [[ $# -gt 0 && ! "$1" =~ ^-- ]]; do
        targetLangs+=("$1")
        shift
      done
      ;;
    --source-files)
      shift
      while [[ $# -gt 0 && ! "$1" =~ ^-- ]]; do
        if [ -z "$sourceFiles" ]; then
          sourceFiles="$1"
        else
          sourceFiles="$sourceFiles $1"
        fi
        shift
      done
      ;;
    --overwrite)
      overwrite_policy="overwrite"
      shift
      ;;
    --skip-existing)
      overwrite_policy="skip"
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--target-langs lang1 lang2 ...] [--source-files file1 file2 ...] [--overwrite | --skip-existing]"
      exit 1
      ;;
  esac
done

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

if [ -z "$sourceFiles" ]; then
  echo "Enter source json files to translate (space-separated, or press Enter for all):"
  read -r input
  if [ -n "$input" ]; then
    sourceFiles="$input"
  fi
fi

if [[ "$overwrite_policy" == "ask" ]]; then
  echo "Overwrite existing files? [ask (default, confirm each) / skip (skip all) / overwrite (overwrite all)]:"
  read -r input
  case "$input" in
    skip) overwrite_policy="skip" ;;
    overwrite) overwrite_policy="overwrite" ;;
    *) overwrite_policy="ask" ;;
  esac
fi

function check_and_filter_files() {
  local lang=$1
  local src_files=()
  if [ -n "$2" ]; then
    read -ra src_files <<< "$2"
  else
    src_files=(i18n/en/*.json)
  fi
  
  local filtered=()

  for src in "${src_files[@]}"; do
    [ -e "$src" ] || continue
    local target="i18n/$lang/$(basename "$src")"
    
    if [[ -f "$target" ]] && [[ "$overwrite_policy" != "overwrite" ]]; then
      if [[ "$overwrite_policy" == "skip" ]]; then
        continue
      fi
      
      echo -n "[$lang] File $(basename "$src") already exists. Overwrite? [y/N/all/none]: "
      read -r answer < /dev/tty
      case "$answer" in
        all) overwrite_policy="overwrite" ; filtered+=("$src") ;;
        none) overwrite_policy="skip" ;;
        y|Y) filtered+=("$src") ;;
        *) continue ;;
      esac
    else
      filtered+=("$src")
    fi
  done
  echo "${filtered[*]}"
}

taskFilePath="$(pwd)/prompts/translate-i18n-json-files.md"

for lang in "${targetLangs[@]}"; do
  files_to_translate=$(check_and_filter_files "$lang" "$sourceFiles")
  
  if [ -z "$files_to_translate" ]; then
    echo "[$lang] No files to translate. Skipping..."
    continue
  fi

  (
    prompt="Finish the task described in \`$taskFilePath\`. Target language: $lang. Source files: $files_to_translate"
    
    echo "[Parallel] Starting translation for: $lang"
    gemini --model "$model" \
      --approval-mode yolo \
      --output-format text \
      --include-directories "${PWD}" \
      --prompt "$prompt"
    echo "[Parallel] Finished translation for: $lang"
  ) &

  if [[ $(jobs -r -p | wc -l) -ge 3 ]]; then
    wait -n
  fi
done

wait
