const { resolve } = require('path');
const rollup = require('rollup');

const rollupTypescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { babel } = require('@rollup/plugin-babel');

const externals = [
  '@storybook/addons',
  '@storybook/csf',
  '@storybook/theming',
  'core-js',
  'react-dom',
  'react',
];

async function buildESM() {
  const bundle = await rollup.rollup({
    input: resolve(__dirname, '../src/index.ts'),
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: true,
      }),
      commonjs(),
      json(),
      babel({ babelHelpers: 'inline' }),
      rollupTypescript({ lib: ['es5', 'es6', 'dom'], target: 'es5' }),
    ],
    external: externals,
  });

  const previewOutputOptions = {
    dir: resolve(__dirname, '../dist/esm'),
    format: 'es',
  };

  await bundle.generate(previewOutputOptions);
  await bundle.write(previewOutputOptions);
  await bundle.close();
}

async function buildModern() {
  const bundle = await rollup.rollup({
    input: resolve(__dirname, '../src/index.ts'),
    plugins: [
      nodeResolve({
        browser: true,
        preferBuiltins: true,
      }),
      commonjs(),
      json(),
      babel({
        babelHelpers: 'inline',
        presets: [
          [
            '@babel/preset-env',
            {
              shippedProposals: true,
              useBuiltIns: 'usage',
              corejs: '3',
              targets: { chrome: '79' },
            },
          ],
        ],
      }),
      rollupTypescript({ lib: ['es5', 'es6', 'dom'], target: 'es6' }),
    ],
    external: externals,
  });

  const previewOutputOptions = {
    dir: resolve(__dirname, '../dist/modern'),
    format: 'es',
  };

  await bundle.generate(previewOutputOptions);
  await bundle.write(previewOutputOptions);
  await bundle.close();
}

async function buildCJS() {
  const bundle = await rollup.rollup({
    input: resolve(__dirname, '../src/index.ts'),
    plugins: [
      nodeResolve({
        browser: false,
        preferBuiltins: true,
      }),
      commonjs(),
      json(),
      babel({ babelHelpers: 'inline' }),
      rollupTypescript({ lib: ['es5', 'es6', 'dom'], target: 'es5' }),
    ],
    external: externals,
  });

  const previewOutputOptions = {
    dir: resolve(__dirname, '../dist/cjs'),
    format: 'commonjs',
  };

  await bundle.generate(previewOutputOptions);
  await bundle.write(previewOutputOptions);
  await bundle.close();
}

async function run() {
  await buildESM();
  await buildCJS();
  await buildModern();
}

run().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
