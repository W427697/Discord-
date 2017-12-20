# Extend the storybook babel configuration

Storybook uses [babel](https://babeljs.io) to transform javascript to what browser browser will be able to run.

We use [`babel-preset-env`](https://github.com/babel/babel/tree/master/packages/babel-preset-env) to automatically transpile less as browsers upgrade their support.

## What does our babel config look like:

:::CodeSwitcher
```js // babelrc.js | react
module.exports = {
  babelrc: false,
  presets: [
    [
      require.resolve('babel-preset-env'),
      {
        targets: {
          browsers: ['last 2 versions', 'safari >= 7'],
        },
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
      },
    ],
    require.resolve('babel-preset-stage-0'),
    require.resolve('babel-preset-react'),
  ],
  plugins: [
    require.resolve('babel-plugin-transform-regenerator'),
    [
      require.resolve('babel-plugin-transform-runtime'),
      {
        helpers: true,
        polyfill: true,
        regenerator: true,
      },
    ],
  ],
};
```
:::

## Why extend the babel configuration
You may opt for babel plugin to do some special transformation of your code in favor of webpack loaders.

One babel plugin we can highly recommend is [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-preval) or [babel-plugin-preval](https://github.com/kentcdodds/babel-plugin-macros).

> In fact, at some point we will likely add these to our default config.

## How to extend the babel config

By default, Storybook loads your root `.babelrc` file and load those configurations.
But sometimes some of those options may cause Storybook to throw errors.

In that case, you can provide a custom `.babelrc` just for Storybook.
For that, simply create a file called `.babelrc` file inside the Storybook config directory (by default, it's `.storybook`).

Then Storybook will load the Babel configuration **only from that file**.

> Currently we do not support loading the Babel config from the `package.json`.
