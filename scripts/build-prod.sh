#!/bin/bash

set -e

cd "$(dirname "${BASH_SOURCE:-$0}")/../"

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --environment) environment="$2"; shift ;;
    *) echo "Unknown environment passed: $1"; exit 1 ;;
  esac
  shift
done

if [ "$environment" = "github" ]; then
  BASE_PATH="/redirect-web/"
elif [ "$environment" = "cloudflare" ]; then
  BASE_PATH="/"
else
  echo "Unknown environment: $environment"
  exit 1
fi

rm -rf build

BASE_PATH=$BASE_PATH pnpm run build

cp -R library build/
