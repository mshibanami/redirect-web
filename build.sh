#!/bin/bash

set -e

cd "$(dirname "${BASH_SOURCE:-$0}")"

rm -rf output
mkdir -p output/

npm install
npm run build
cp -R build/* output

mkdir -p output/new
cd docusaurus
npm install
npm run build
cp -R build/* ../output/new
