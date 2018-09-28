#!/bin/bash

# exit on error
set -e

# remove and recreate `cra-fixtures` directory
rm -rfd cra-fixtures
mkdir cra-fixtures
cd cra-fixtures

npm install expo-cli -g

echo "---------------------------------------------"
echo "create-react-app react-scripts-latest-fixture"
echo "---------------------------------------------"
../../node_modules/.bin/npx create-react-app react-scripts-latest-fixture
echo ""

echo "---------------------------------------------"
echo "expo init react-native-scripts-latest-fixture"
echo "---------------------------------------------"
../../node_modules/.bin/npx expo init --non-interactive react-native-scripts-latest-fixture
echo ""

cd ..
echo "------------------------------"
echo "./run_tests.sh -f cra-fixtures"
echo "------------------------------"
./run_tests.sh -f cra-fixtures
