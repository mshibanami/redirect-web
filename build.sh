#!/bin/bash

set -e

cd "$(dirname "${BASH_SOURCE:-$0}")"

rm -rf build

npm install
npm run build

cp -R library build/

mkdir -p build/new
cd docusaurus
npm install
npm run build
cp -R build/* ../build/new
