# Storybook for Solid <!-- omit in toc -->

## Requirements

- [Solid](https://www.solidjs.com/) >= 1.x
- [Storybook](https://storybook.js.org/) >= 7.x

## Getting Started

### In a project without Storybook

Follow the prompts after running this command in your SolidJs project's root directory:

```bash
npx storybook@next init
```

### In a project with Storybook

This framework is designed to work with Storybook 7. If you’re not already using v7, upgrade with this command:

```bash
npx storybook@next upgrade --prerelease
```

#### Manual migration

Install the framework:

```bash
yarn add --dev @storybook/solid-vite@next
```

Update your `main.js` to change the framework property:

```js
// .storybook/main.js
module.exports = {
  // ...
  framework: {
    // name: '@storybook/react-webpack5', // Remove this
    name: '@storybook/solid-vite', // Add this
    options: {},
  },
};
```
