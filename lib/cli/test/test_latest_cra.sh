#!/bin/bash

# exit on error
set -e

# remove and recreate `cra-fixtures` directory
rm -rfd cra-fixtures
mkdir cra-fixtures
cd cra-fixtures

npm install expo-cli -g

../../node_modules/.bin/npx create-react-app react-scripts-latest-fixture

../../node_modules/.bin/npx expo init react-native-scripts-latest-fixture

cd ..
./run_tests.sh -f cra-fixtures
