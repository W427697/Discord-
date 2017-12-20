# Extend the storybook webpack configuration

Storybook uses webpack to build, bundle, transform and Hot-Module-Reload. 
We have a pretty versatile webpack config, which should be very similar what the most popular boilerplate/cli of your [framework/app](/guides/understanding/#apps) uses. For example for react, our default webpack config is very similar to [CRA](https://github.com/facebookincubator/create-react-app)'s.

If you choose to extend our webpack config, we use a version that's stripped-down version to the bare-minimum of what storybook requires.
We do this so you do not have to remove them, adding them back is simple.

## Why extend the webpack configuration

Changing webpack configs is something you do, when you have no other option, if you components have some non-js import you'll either have to use webpack loaders or some babel transformers.

Storybook should be compatible with the latest major version of webpack, older versions may not work.

> **WARNING**: You can break either storybook or your app, or both when changing the webpack config.
> 
> Please be careful and test thoroughly if your setup works as expected after changing it.

## Create a `webpack.config.js` file

To extend storybook's webpack config all you need to do is create a (CommonJS) module in your storybook config folder (*usually `.storybook`*).

The filename should be `webpack.config.js` and the module should export either an object or a function.

## Extend mode

This is when the `webpack.config.js` exports an object. In this case we'll assume the object **is** a webpack configuration and we'll merge it into our config.

Our own config takes precedence over yours.

Here's an example (which adds a [loader](https://webpack.js.org/concepts/loaders/) for [sass/scss](http://sass-lang.com/) file):

```js // webpack.config.js
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
        include: path.resolve(__dirname, '../'),
      },
    ],
  },
};
```

For many use-cases this is enough control to add all you'd need, you can add [loaders](https://webpack.js.org/concepts/loaders/), [plugins](https://webpack.js.org/concepts/plugins/) and change [module resolution](https://webpack.js.org/concepts/module-resolution/).

This coverers almost all use-cases, but it there are use-cases where more control is needed.

## Full control mode

Sometimes, you will need to have full control over the webpack configuration.
Maybe you want to add different configurations for dev and production environments or you may need one of your loaders or plugins to run **before** storybook's or possibly replace or remove entirely.
That's where you can use our full control mode.

To enable that, you need to export a **function** from the `webpack.config.js` file.

Here's an example:

```js // webpack.config.js
const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  storybookBaseConfig.module.rules.push({
    test: /\.scss$/,
    loaders: ["style-loader", "css-loader", "sass-loader"],
    include: path.resolve(__dirname, '../')
  });

  // Return the altered config
  return storybookBaseConfig;
};
```

Storybook will use the config returned from the above function. 
So, try to edit the `storybookBaseConfig` with care. Make sure to preserve the following config options:

-   entry
-   output
-   first loader in the module.loaders (Babel loader for JS)

> **Warning**: removing too much, will likely cause storybook to no longer function.

## Full control mode + default

You may like to keep Storybook's default webpack config that you will no longer get when you extend it.

Using full control mode you can get the best of both worlds.
Add following content to the `webpack.config.js` in your Storybook config directory.

> We plan to expose our default webpack-config as it's own package in the future.

:::CodeSwitcher
```js // webpack.config.js | react
// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  // Extend it as you need.

  return config;
};
```
```js // webpack.config.js | vue
// load the default config generator.
const genDefaultConfig = require('@storybook/vue/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  // Extend it as you need.

  return config;
};
```
:::
