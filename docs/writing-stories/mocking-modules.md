---
title: Mocking modules
---

Components can also depend on modules that are imported into the component file. These can be from external packages or internal to your project. When rendering those components in Storybook or testing them, you may want to mock those modules to control their behavior.

There are two primary approaches to mocking modules in Storybook. They both involve creating a mock file to replace the original module. The difference between the two approaches is how you import the mock file into your component.

For either approach, relative imports of the mocked module are not supported.

### Mock files

To mock a module, create a file with the same name as the module you want to mock. For example, if you want to mock a module named `api`, create a file named `api.mock.js|ts` in the same directory as the original module. This file should match the exports of the original module but with fake data or behavior.

Here's an example of a mock file for a module named `api`:

```js
// api.mock.js
TK: Add snippet
```

<Callout variant="warning">

When creating a mock file, be careful not to introduce side effects that could affect other tests or components. Mock files should be isolated and only affect the component they are mocking.

Additionally, you must use absolute paths to import any dependencies in the mock file. Relative imports can cause issues when importing the mock file into your component.

</Callout>

### Subpath imports

The recommended method for mocking modules is to use [subpath imports](https://nodejs.org/api/packages.html#subpath-imports), a feature of Node packages that is supported by both [Vite](../builders/vite.md) and [Webpack](../builders/webpack.md).

To configure subpath imports, you define the `imports` property in your project's `package.json` file. This property maps the subpath to the actual file path. The example below configures subpath imports for the `api` and `prisma` internal modules:

TK: External module example?

```json
// package.json
{
  "imports": {
    "#api": {
      "storybook": "./api.mock.ts",
      "default": "./api.ts"
    },
    "#prisma/prisma": {
      "storybook": "./prisma/prisma.mock.ts",
      "default": "./prisma/prisma.ts"
    },
    "#*": ["./*", "./*.ts", "./*.tsx"]
  }
}
```

<Callout variant="info">

Each subpath must begin with `#`, to differentiate it from a regular module path. The `#*` entry is a catch-all that maps all subpaths to the root directory.

</Callout>

You can then update your component file to use the subpath import:

```ts
TK: Component snippet
```

#### Conditional imports

Note the `storybook` and `default` keys in each module's entry. The `storybook` key is used to import the mock file in Storybook, while the `default` key is used to import the original module in your project.

The Storybook environment will match the conditions `storybook` and `test`, so you can apply the same module mapping for both Storybook and your tests.

### Builder aliases

If your project is unable to use [subpath imports](#subpath-imports), you can configure your Storybook builder to alias the module to the mock file.

<!-- TODO: Vite version -->

```js
// .storybook/main.ts

webpackFinal: async (config) => {
  if (config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/headers': require.resolve('./next-headers'),
      '@/api/todo$': path.resolve(__dirname, './api/todo.mock.ts'),
    }
  }

  return config
},
```
