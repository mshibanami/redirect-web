#!/bin/bash

set -e

cd "$(dirname "${BASH_SOURCE:-$0}")"

rm -rf build

pnpm install
pnpm run build

cp -R library build/
