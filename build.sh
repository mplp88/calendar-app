#!/usr/bin/env bash
rm -rf ./public/
mkdir public
cd calendar-app
npm run build
mv ./build/* ../public/