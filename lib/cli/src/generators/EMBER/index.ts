import { baseGenerator, Generator } from '../generator';

const generator: Generator = async (npmOptions, options) => {
  baseGenerator(npmOptions, options, 'ember', {
    extraPackages: [
      // babel-plugin-ember-modules-api-polyfill is a peerDep of @storybook/ember
      'babel-plugin-ember-modules-api-polyfill',
      // babel-plugin-htmlbars-inline-precompile is a peerDep of @storybook/ember
      'babel-plugin-htmlbars-inline-precompile',
    ],
    staticDir: 'dist',
  });
};

export default generator;
