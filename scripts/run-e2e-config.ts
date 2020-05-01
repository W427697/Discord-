import { Parameters } from './run-e2e';

export const angular: Parameters = {
  name: 'angular',
  version: 'latest',
  generator: [
    `yarn add @angular/cli@{{version}} --no-lockfile --non-interactive --silent --no-progress`,
    `npx ng new {{name}}-v{{version}} --routing=true --minimal=true --style=scss --skipInstall=true`,
  ].join(' && '),
};

export const svelte: Parameters = {
  name: 'svelte',
  version: 'latest',
  generator: 'npx degit sveltejs/template {{name}}-v{{version}}',
  autoDetect: false,
};

export const vue: Parameters = {
  name: 'vue',
  version: 'latest',
  generator: `npx @vue/cli@{{version}} create {{name}}-v{{version}} --default --packageManager yarn --no-git --force`,
};
