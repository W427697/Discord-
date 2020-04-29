import runTests, { Parameters } from './run-e2e';

const parameters: Parameters = {
  name: 'vue',
  version: 'latest',
  generator: `npx @vue/cli@{{version}} create {{name}}-v{{version}} --default --packageManager yarn --no-git --force`,
};

runTests(parameters);
