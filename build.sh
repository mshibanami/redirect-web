#!/bin/bash

cd "$(dirname "${BASH_SOURCE:-$0}")"

./docs/scripts/generate-rule-set-list.sh

rm -rf output
mkdir -p output/redirect-web
cp -R docs/* output/redirect-web
