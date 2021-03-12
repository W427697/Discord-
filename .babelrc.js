const modules = process.env.BABEL_ESM === 'true' ? false : 'auto';

const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  ignore: [
    './lib/codemod/src/transforms/__testfixtures__',
    './lib/postinstall/src/__testfixtures__',
    './addons/docs/src/frameworks/angular/__testfixtures__',
  ],
  targets: isTest
    ? {
        node: 'current',
      }
    : 'defaults',
  assumptions: {
    noClassCalls: true,
    constantReexports: true,
    constantSuper: true,
    ignoreFunctionLength: true,
    ignoreToPrimitiveHint: true,
    privateFieldsAsProperties: true,
    setSpreadProperties: true,
    pureGetters: true,
    setPublicClassFields: true,
  },
  presets: [
    [
      '@babel/preset-env',
      {
        shippedProposals: true,
        useBuiltIns: 'usage',
        corejs: '3',
        modules,
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
    '@babel/preset-flow',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-transform-block-scoping',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-shorthand-properties',
    'babel-plugin-macros',
    ...(isTest
      ? [
          'babel-plugin-require-context-hook',
          'babel-plugin-dynamic-import-node',
          '@babel/plugin-transform-runtime',
        ]
      : []),
  ],
  overrides: [
    // packages that have react components of ours
    {
      test: ['./lib/components', './lib/ui'],
      plugins: [
        'babel-plugin-add-react-displayname',
        ['emotion', { sourceMap: false, autoLabel: true }],
      ],
    },

    // packages that will run in node
    {
      test: [
        './lib/node-logger',
        './lib/core',
        './lib/core-common',
        './lib/core-server',
        './lib/builder-webpack4',
        './lib/builder-webpack5',
        './lib/codemod',
        './addons/storyshots',
        '**/src/server/**',
        '**/src/bin/**',
      ],
      targets: {
        node: '10',
      },
      presets: [
        [
          '@babel/preset-env',
          {
            shippedProposals: true,
            useBuiltIns: 'usage',
            targets: {
              node: '10',
            },
            modules,
            corejs: '3',
          },
        ],
      ],
    },

    // odd edge-cases, like examples and template-files
    {
      test: './examples/vue-kitchen-sink',
      presets: ['@vue/babel-preset-jsx'],
    },
    {
      test: './addons/docs/src/frameworks/angular/__testfixtures__',
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-export-default-from', { loose: true }],
        ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
        ['@babel/plugin-proposal-optional-chaining', { loose: true }],
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        ['@babel/plugin-syntax-dynamic-import', { loose: true }],
      ],
    },
    {
      test: ['**/virtualModuleEntry.template.js'],
      presets: [
        [
          '@babel/preset-env',
          {
            shippedProposals: true,
            useBuiltIns: 'usage',
            targets: {
              node: '10',
            },
            corejs: '3',
            modules: false,
          },
        ],
      ],
    },
  ],
};
