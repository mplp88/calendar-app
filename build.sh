#!/usr/bin/env bash
echo 'Deleting old public folder'
rm -rf ./public/
echo 'Creating new public folder'
mkdir public
cd calendar-app
echo 'Building React App'
npm run build
echo 'Moving compiled files to public folder'
mv ./build/* ../public/