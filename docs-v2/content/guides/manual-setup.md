# Manually adding Storybook to your project

You may have tried to add storybook to your project using [our CLI](/guides/setup/) but for some reason it failed or didn't detect your type of project.
Or perhaps you're just interested in what the CLI exactly does. This guide will take you step by step on how to add storybook to any project.

:::Test { chooseFramework: true }
:::

## About this guide
In this guide, we are trying to set up Storybook for your project, but every project is different. We've tried to write this guide in such a way it's framework-agnotic. Whenever you see `{framework}` in our examples or code, replace it with your [framework/app](/guides/understanding/#app-5) of choice.

Storybook has its own Webpack setup and a dev server, and we've tried to make it similar in setup to your prefered framework's CLI / default setup. 
Such as [Create React App](https://github.com/facebookincubator/create-react-app) for react projects and the [Vue CLI](https://github.com/vuejs/vue-cli) for Vue projects, but also allows you to configure as you want.

## Add storybook dependencies

First of all, you need to add a few storybook packages to your project's `package.json`. 
To do that, simply run:

:::Test { frameworkDependent: true }
```sh | react
npm i --save-dev @storybook/react @storybook/addons react react-dom
```
```sh | react-native
npm i --save-dev @storybook/react-native @storybook/addons react react-native
```
```sh | vue
npm i --save-dev @storybook/vue @storybook/addons vue vue-loader vue-template-compiler
```
```sh | angular
npm i --save-dev @storybook/angular @storybook/addons
```
:::

Sometimes there are some peerDependencies, we want you as a user to be in control of the version of that package. 
The commands above will add all the needed dependencies.

## Add npm scrips

Add the following NPM script to your `package.json` in order to start the storybook later in this guide:

```json
{
  "scripts": {
    "storybook": "start-storybook -p 9001 -c .storybook"
  }
}
```

You can choose another [port here](/docs/cli#start-storybook), or change the location of the [config folder](#create-the-config-directory-5).

## Create the config directory
We need a config directory to place all the storybook related configuration files.
In the future we'll possibly move towards a single configuration file, but for now there are a few, some are optional.

We've added a `-c` option to the above NPM script mentioning `.storybook` as the config directory, so you can place this configuration directory anywhere you want.

## Create the main config file
For the basic Storybook configuration file, you don't need to do much, but simply tell Storybook where to find stories.

To do that, simply create a file at `.storybook/config.js` with the following content:

:::Test { frameworkDependent: true }
```js // config.js | react
import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/index.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);
```
```js // config.js | vue
import { configure } from '@storybook/vue';

function loadStories() {
  require('../stories/index.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);
```
:::

That'll load stories in `../stories/index.js`.

Just like that, you can load stories from wherever you want to.

## Write your stories

Now you can write some stories inside the `../stories/index.js` file, like this:

:::Test { frameworkDependent: true }
```js // stories.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

storiesOf('Button', module)
  .add('with text', () => (
    <button onClick={action('clicked')}>Hello Button</button>
  ))
  .add('with some emoji', () => (
    <button onClick={action('clicked')}>😀 😎 👍 💯</button>
  ));
```
```js // stories.js | vue
import React from 'react';
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

storiesOf('Button', module)
  .add('with text', () => ({
    components: { MyButton },
    template: `<my-button @click="action">Hello Button</my-button>`,
    methods: { action: action('clicked') },
  }))
  .add('with some emoji', () => ({
    components: { MyButton },
    template: `<my-button @click="action">😀 😎 👍 💯</my-button>`,
    methods: { action: action('clicked') },
  }));
```
:::

A story is a single state of your component.
In the above case, there are two stories for the native button component:

1.  with text
2.  with some emoji

## Run your Storybook

Now everything is ready. Simply run your storybook with:

```sh
npm run storybook
```

Then you can see all your stories, like this:

![Basic stories](../static/basic-stories.png)

Now you can change components and write stories whenever you need to.
You'll get those changes into Storybook in a snap with the help of [Webpack's HMR API](https://webpack.js.org/concepts/hot-module-replacement/).
