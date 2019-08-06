const svelte = require('svelte/compiler');
const babel = require('@babel/core');
const { transform: transformCsf } = require('./app/svelte/src/server/svelte-stories-loader');

const svelteRegex = /\.svelte$/;
const svelteStoriesRegex = /\.stories\.svelte$/;

const isSvelteStories = filename => svelteStoriesRegex.test(filename);

const isSvelte = filename => svelteRegex.test(filename);

const babelOptions = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'node >= 8',
      },
    ],
  ],
  plugins: [require.resolve('@babel/plugin-transform-classes')],
};

function processSvelte(src, filename) {
  // svelte internals are not transpiled, so they must be applied the same babel
  // transformation in order for classes to remain compatible
  if (!isSvelte(filename)) {
    return babel.transformSync(src, babelOptions);
  }

  const { js: compiled } = svelte.compile(src, { filename });

  // babel is required to avoid interop issues between ES5 and Svelte's ES2015
  // output (import/require default, classes...)
  const transpiled = babel.transformSync(compiled.code, babelOptions);

  if (isSvelteStories(filename)) {
    // transformCsf expects CommonJS module, but that's OK: the babel phase
    // above will have done that for us
    return transformCsf(transpiled);
  }

  return transpiled;
}

exports.process = processSvelte;
