const svelte = require('svelte/compiler');
const babel = require('@babel/core');
const { transform: transformCsf } = require('./app/svelte/src/server/svelte-stories-loader');

const csfRegex = /\.stories\.svelte$/;

const isCsf = filename => csfRegex.test(filename);

const babelOptions = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'node >= 8',
      },
    ],
  ],
};

function processSvelte(src, filename) {
  const { js: compiled } = svelte.compile(src, { filename });

  // babel is required to avoid interop issues between ES5 and Svelte's ES2015
  // output (import/require default, classes...)
  const transpiled = babel.transformSync(compiled.code, babelOptions);

  if (isCsf(filename)) {
    // transformCsf expects CommonJS module, but that's OK: the babel phase
    // above will have done that for us
    return transformCsf(transpiled);
  }

  return transpiled;
}

exports.process = processSvelte;
