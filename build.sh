#!/bin/bash

cd "$(dirname "${BASH_SOURCE:-$0}")"

rm -rf output
mkdir -p output/redirect-web
cp -R docs/* output/redirect-web
