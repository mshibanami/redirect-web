#!/bin/bash

cd "$(dirname "${BASH_SOURCE:-$0}")"

rm -rf output
mkdir -p output/redirect-web
cp -R docs/* output/redirect-web

mkdir -p output/redirect-web/new
cd docusaurus
npm install
npm run build

cp -R build/* ../output/redirect-web/new
