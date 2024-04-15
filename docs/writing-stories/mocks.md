---
title: 'Mocking data and modules'
---

1. Intro
2. Providers
   1. Decorators
3. Network requests
   1. MSW
4. Modules
   1. Mock files
      1. Naming convention
      2. Cannot use subpath imports in a mocked file; must use relative
      3. Watch out for side effects
   2. Subpath imports
      1. Relative imports not supported
      2. Fallback to builder aliases
      3. Next.js callout
   3. Configuring mocks
      1. `fn.mock` and friends
      2. `beforeEach`

Components that rely on external data or modules can be difficult to use in isolation. Mocking is a way to replace these dependencies with fake data or modules that you control. This allows you to develop and test your components without worrying about the behavior or stability of the external dependencies.

Storybook provides different tools and techniques to help you mock data and modules.

<!-- TODO: React & Solid only? -->

## Providers

Components can receive data or configuration from context providers. For example, a styled component might access its theme from a ThemeProvider. To mock a provider, you can wrap your component in a [decorator](./decorators.md) that includes the necessary context.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/storybook-preview-with-styled-components-decorator.js.mdx',
    'react/storybook-preview-with-styled-components-decorator.ts.mdx',
    'solid/storybook-preview-with-styled-components-decorator.js.mdx',
    'solid/storybook-preview-with-styled-components-decorator.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<!-- TODO: Something about the `context` argument? -->

## Network requests

For components that make network requests (e.g. fetching data from a REST or GraphQL API), you can mock those requests using a tool like [Mock Service Worker (MSW)](https://mswjs.io/). MSW allows you to intercept requests made by your components and respond with fake data.

The MSW addon adds this functionality into Storybook, allowing you to mock API requests in your stories. Below is an overview of how to set up and use the addon.

<details>
<summary>Set up MSW in Storybook</summary>

First, run this command to install MSW:

<!-- TODO: Snippetize -->

```sh
npm install msw --save-dev
```

Next, install and register the MSW addon:

<!-- TODO: Snippetize -->

```sh
npx storybook@latest add msw-storybook-addon
```

Then, generate the service worker file necessary for MSW to work:

<!-- prettier-ignore-start -->

<!-- TODO: Rename files -->
<CodeSnippets
  paths={[
    'common/storybook-msw-generate.msw.js.mdx',
    'common/storybook-msw-generate.msw-pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<If renderer="angular">

<Callout variant="info" icon="💡">

Angular projects will likely need to adjust the command to save the mock service worker file in a different directory (e.g., `src`).

</Callout>

</If>

Initialize the addon and apply it to all stories with a [project-level loader](./loaders.md#global-loaders):

<!-- prettier-ignore-start -->

<!-- TODO: Update to use loader instead of decorator -->
<CodeSnippets
  paths={[
    'common/storybook-preview-register-msw-addon.js.mdx',
    'common/storybook-preview-register-msw-addon.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Finally, ensure the [`staticDirs`](../api/main-config-static-dirs.md) property in your Storybook configuration will include the generated service worker file:

<!-- prettier-ignore-start -->

<!-- TODO: Update comment to mention how the dir needs to match -->
<CodeSnippets
  paths={[
    'common/storybook-main-with-single-static-dir.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

</details>

Let's use an example of a document screen component that requests data from an API to demonstrate how to mock network requests in Storybook. The following snippets show an example implementation using `fetch` for a REST API and/or GraphQL:

<!-- prettier-ignore-start -->

<!-- TODO: Combine snippets fetch and GraphQL -->
<CodeSnippets
  paths={[
    'react/document-screen-fetch.js.mdx',
    'react/document-screen-fetch.ts.mdx',
    'vue/document-screen-fetch.3.js.mdx',
    'vue/document-screen-fetch.3.ts.mdx',
    'angular/document-screen-fetch.ts.mdx',
    'svelte/document-screen-fetch.js.mdx',
    'svelte/document-screen-fetch.ts.mdx',
    'web-components/document-screen-fetch.js.mdx',
    'solid/document-screen-fetch.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/document-screen-with-graphql.js.mdx',
    'react/document-screen-with-graphql.ts.mdx',
    'vue/document-screen-with-graphql.3.js.mdx',
    'vue/document-screen-with-graphql.3.ts.mdx',
    'angular/document-screen-with-graphql.ts.mdx',
    'svelte/document-screen-with-grapqhl.js.mdx',
    'svelte/document-screen-with-grapqhl.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info">

These examples use the [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/fetch) or GraphQL with [Apollo Client](https://www.apollographql.com/docs/) to make network requests. If you're using a different library (e.g. [`axios`](https://axios-http.com/), [URQL](https://formidable.com/open-source/urql/), or [React Query](https://react-query.tanstack.com/)), you can apply the same principles to mock network requests in Storybook.

</Callout>

### Mocking REST requests

To mock a REST request, you can use the `msw` library to intercept the request and respond with mock data. Here's an example showing two stories for the document screen component. They are each configured to use mock data: one that fetches data successfully and another that fails.

<!-- prettier-ignore-start -->

<!-- TODO: Update to use latest MSW -->
<CodeSnippets
  paths={[
    'common/documentscreen-story-msw-rest-request.js.mdx',
    'common/documentscreen-story-msw-rest-request.ts.mdx',
    'angular/documentscreen-story-msw-rest-request.ts.mdx',
    'web-components/documentscreen-story-msw-rest-request.js.mdx',
    'web-components/documentscreen-story-msw-rest-request.ts.mdx',
  ]}
  usesCsf3
  csf2Path="writing-stories/build-pages-with-storybook#snippet-documentscreen-story-msw-rest-request"
/>

<!-- prettier-ignore-end -->

Note how each story is configured with `parameters.msw` to define the request handlers for the mock server. Because it uses parameters in this way, it can also be configured at the [component](./parameters.md#component-parameters) or even [project](./parameters.md#global-parameters) level.

### Mocking GraphQL requests

In addition to mocking RESTful requests, the MSW addon can also mock GraphQL requests.

Here's an example showing two stories for the document screen component. They are each configured to use mock data: one that queries data successfully and another that fails.

<!-- prettier-ignore-start -->

<!-- TODO: Update to use latest MSW -->
<CodeSnippets
  paths={[
    'react/documentscreen-story-msw-graphql-query.js.mdx',
    'react/documentscreen-story-msw-graphql-query.ts.mdx',
    'vue/apollo-wrapper-component.with-mock-implementation.3.js.mdx',
    'vue/documentscreen-story-msw-graphql-query.js.mdx',
    'vue/documentscreen-story-msw-graphql-query.ts.mdx',
    'angular/apollo-module.mock-apollo-module.ts.mdx',
    'angular/documentscreen-story-msw-graphql-query.ts.mdx',
    'svelte/documentscreen-story-msw-graphql-query.js.mdx',
    'svelte/documentscreen-story-msw-graphql-query.ts.mdx',
    'svelte/apollo-wrapper-component.with-mock-implementation.js.mdx',
    'svelte/apollo-wrapper-component.with-mock-implementation.ts.mdx',
  ]}
  usesCsf3
  csf2Path="writing-stories/build-pages-with-storybook#snippet-documentscreen-story-msw-graphql-query"
/>

<!-- prettier-ignore-end -->

## Modules

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
