import { Parameters } from './run-e2e';

export const angular: Parameters = {
  name: 'angular',
  version: 'latest',
  generator: [
    `yarn add @angular/cli@{{version}} --no-lockfile --non-interactive --silent --no-progress`,
    `npx ng new {{name}}-v{{version}} --routing=true --minimal=true --style=scss --skipInstall=true`,
  ].join(' && '),
};

export const ember: Parameters = {
  name: 'ember',
  version: 'latest',
  generator:
    'npx ember-cli@{{version}} help new {{name}}-v{{version}} --skip-git --skip-npm --yarn --skip-bower',
};

// export const html: Parameters = {
//   name: 'html',
//   version: 'latest',
//   generator: '',
// };

// export const marionette: Parameters = {
//   name: 'marionette',
//   version: 'latest',
//   generator: '',
// };

// export const marko: Parameters = {
//   name: 'marko',
//   version: 'latest',
//   generator: '',
// };

// export const meteor: Parameters = {
//   name: 'meteor',
//   version: 'latest',
//   generator: '',
// };

// export const mithrim: Parameters = {
//   name: 'mithril',
//   version: 'latest',
//   generator: '',
// };

export const preact: Parameters = {
  name: 'preact',
  version: 'latest',
  generator:
    'npx preact-cli create preactjs-templates/default {{name}}-v{{version}} --yarn --install=false --git=false --force',
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
//   generator: '',
// };

// export const reactScripts: Parameters = {
//   name: 'reactScripts',
//   version: 'latest',
//   generator: '',
// };

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
  autoDetect: false,
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
