#!/usr/bin/env bash

cd "$(dirname "$0")/.."

taskFilePath="$(pwd)/prompts/translate-docs.md"

gemini --prompt "Finish the task described in '$taskFilePath'. Target language: all languages in the i18n folder" \
  --yolo \
  --model gemini-2.5-flash \
  --debug
