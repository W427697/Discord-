import { Parameters } from './run-e2e';

export const angular: Parameters = {
  name: 'angular',
  version: 'latest',
  generator: [
    `yarn add @angular/cli@{{version}} --no-lockfile --non-interactive --silent --no-progress`,
    `npx ng new {{name}}-v{{version}} --routing=true --minimal=true --style=scss --skipInstall=true`,
  ].join(' && '),
};

// TODO: not working yet, help needed
export const ember: Parameters = {
  name: 'ember',
  version: 'latest',
  generator:
    'npx ember-cli@{{version}} new {{name}}-v{{version}} --skip-git --skip-npm --yarn --skip-bower',
  preBuildCommand: 'ember build',
};

export const html: Parameters = {
  name: 'html',
  version: 'latest',
  generator: ['cd {{name}}-v{{version}}', 'yarn init --yes'].join(' && '),
  autoDetect: false,
};

// TODO: broken
// export const marionette: Parameters = {
//   name: 'marionette',
//   version: 'latest',
//   generator: ['cd {{name}}-v{{version}}', 'yarn init --yes', 'yarn add backbone.marionette@{{version}}'].join(' && '),
// };

// TODO: not working on start-storybook
// help needed
// export const marko: Parameters = {
//   name: 'marko',
//   version: 'latest',
//   generator: 'npx marko-cli@{{version}} create {{name}}-v{{version}}',
//   ensureDir: false,
// };

// TODO: need to install meteor first
// export const meteor: Parameters = {
//   name: 'meteor',
//   version: 'latest',
//   generator: 'meteor create {{name}}-v{{version}} --minimal --react',
// };

export const mithril: Parameters = {
  name: 'mithril',
  version: 'latest',
  generator: ['cd {{name}}-v{{version}}', 'yarn init --yes', 'yarn add mithril@{{version}}'].join(
    ' && '
  ),
};

export const preact: Parameters = {
  name: 'preact',
  version: 'latest',
  generator:
    'npx preact-cli@{{version}} create preactjs-templates/default {{name}}-v{{version}} --yarn --install=false --git=false',
};

// export const rax: Parameters = {
//   name: 'rax',
//   version: 'latest',
//   generator: '',
// };

// export const react: Parameters = {
//   name: 'react',
//   version: 'latest',
//   generator: '',
// };

// export const reactNative: Parameters = {
//   name: 'reactNative',
//   version: 'latest',
//   generator: 'npx expo-cli init {{name}}-v{{version}} --template=bare-minimum --yarn',
// };

export const cra: Parameters = {
  name: 'cra',
  version: 'latest',
  generator: 'npx create-react-app@{{version}} {{name}}-v{{version}}',
};

// no cli
// export const riot: Parameters = {
//   name: 'riot',
//   version: 'latest',
//   generator: '',
// };

// export const sfcVue: Parameters = {
//   name: 'sfcVue',
//   version: 'latest',
//   generator: '',
// };

export const svelte: Parameters = {
  name: 'svelte',
  version: 'latest',
  generator: 'npx degit sveltejs/template {{name}}-v{{version}}',
};

export const vue: Parameters = {
  name: 'vue',
  version: 'latest',
  generator: `npx @vue/cli@{{version}} create {{name}}-v{{version}} --default --packageManager=yarn --no-git --force`,
};

// export const webComponents: Parameters = {
//   name: 'webComponents',
//   version: 'latest',
//   generator: '',
// };

// export const webpackReact: Parameters = {
//   name: 'webpackReact',
//   version: 'latest',
//   generator: '',
// };
