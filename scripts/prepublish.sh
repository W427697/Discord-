#!/bin/bash

echo "> Start transpiling ES2015"
echo ""
rm -rf ./dist
./node_modules/.bin/babel --ignore __tests__ ./src --out-dir ./dist
echo ""
echo "> Complete transpiling ES2015"
