---
id: 'custom-babel-config'
title: 'Custom Babel Config'
---

By default, Storybook uses your app's babel configuration.
But sometimes some of the options may cause Storybook to throw errors.

In that case, you can provide a custom `.babelrc` just for Storybook.
For that, simply create a file called `.babelrc` file inside the Storybook config directory (by default, it's `.storybook`).

Then Storybook will load the Babel configuration only from that file.

It can also be a `babel.config.js` file. In that case, you will be able to extend Storybook's default config (which supports Babel 7 only):

```
// .storybook/babel.config.js

module.exports = defaultConfig => ({
  ...defaultConfig,
  plugins: [
    ...defaultConfig.plugins,
    '@babel/plugin-proposal-optional-chaining'
  ],
});
```
