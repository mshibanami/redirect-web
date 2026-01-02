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
  basePath="/redirect-web/"
  redirectionBaseUrl="https://redirectweb.net/"
elif [ "$environment" = "cloudflare" ]; then
  basePath="/"
else
  echo "Unknown environment: $environment"
  exit 1
fi

rm -rf build

BASE_PATH="$basePath" REDIRECTION_BASE_URL="$redirectionBaseUrl" pnpm run build

cp -R library build/
