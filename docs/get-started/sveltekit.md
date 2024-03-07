---
title: Storybook for SvelteKit
---

export const SUPPORTED_RENDERER = 'svelte';

Storybook for SvelteKit is a [framework](../contribute/framework.md) that makes it easy to develop and test UI components in isolation for [SvelteKit](https://kit.svelte.dev/) applications. It includes:

- 🪄 Zero config
- 🧩 Easily mock many Kit modules
- 🔗 Automatic link handling
- 💫 and more!

<If notRenderer={SUPPORTED_RENDERER}>

<Callout variant="info">

Storybook for SvelteKit is only supported in [Svelte](?renderer=svelte) projects.

</Callout>

<!-- End non-supported renderers -->

</If>

<If renderer={SUPPORTED_RENDERER}>

## Requirements

- SvelteKit ≥ 1.0
- Storybook ≥ 7.0

## Getting started

### In a project without Storybook

Follow the prompts after running this command in your Sveltekit project's root directory:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
   'common/init-command.npx.js.mdx',
   'common/init-command.yarn.js.mdx',
   'common/init-command.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

[More on getting started with Storybook.](./install.md)

### In a project with Storybook

This framework is designed to work with Storybook 7+. If you’re not already using v7, upgrade with this command:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-upgrade.npm.js.mdx',
    'common/storybook-upgrade.pnpm.js.mdx',
    'common/storybook-upgrade.yarn.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

#### Automatic migration

When running the `upgrade` command above, you should get a prompt asking you to migrate to `@storybook/sveltekit`, which should handle everything for you. In case that auto-migration does not work for your project, refer to the manual migration below.

#### Manual migration

First, install the framework:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'svelte/sveltekit-install.npm.js.mdx',
    'svelte/sveltekit-install.pnpm.js.mdx',
    'svelte/sveltekit-install.yarn.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

Then, update your `.storybook/main.js|ts` to change the framework property:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'svelte/sveltekit-add-framework.js.mdx',
    'svelte/sveltekit-add-framework.ts.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

Finally, these packages are now either obsolete or part of `@storybook/sveltekit`, so you no longer need to depend on them directly. You can remove them (`npm uninstall`, `yarn remove`, `pnpm remove`) from your project:

- `@storybook/svelte-vite`
- `@storybook/svelte-webpack5`
- `storybook-builder-vite`
- `@storybook/builder-vite`

## Supported features

All Svelte language features are supported out of the box, as the Storybook framework uses the Svelte compiler directly.
However, SvelteKit has some [Kit-specific modules](https://kit.svelte.dev/docs/modules) that aren't supported. Here's a breakdown of what will and will not work within Storybook:

| Module                                                                             | Status                 | Note                                                                                                                                    |
| ---------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [`$app/environment`](https://kit.svelte.dev/docs/modules#$app-environment)         | ✅ Supported           | `version` is always empty in Storybook.                                                                                                 |
| [`$app/forms`](https://kit.svelte.dev/docs/modules#$app-forms)                     | ✅ Supported           | See [How to mock](#how-to-mock).                                                                                                        |
| [`$app/navigation`](https://kit.svelte.dev/docs/modules#$app-navigation)           | ✅ Supported           | See [How to mock](#how-to-mock).                                                                                                        |
| [`$app/paths`](https://kit.svelte.dev/docs/modules#$app-paths)                     | ✅ Supported           | Requires SvelteKit 1.4.0 or newer.                                                                                                      |
| [`$app/stores`](https://kit.svelte.dev/docs/modules#$app-stores)                   | ✅ Supported           | See [How to mock](#how-to-mock).                                                                                                        |
| [`$env/dynamic/public`](https://kit.svelte.dev/docs/modules#$env-dynamic-public)   | 🚧 Partially supported | Only supported in development mode. Storybook is built as a static app with no server-side API, so it cannot dynamically serve content. |
| [`$env/static/public`](https://kit.svelte.dev/docs/modules#$env-static-public)     | ✅ Supported           |                                                                                                                                         |
| [`$lib`](https://kit.svelte.dev/docs/modules#$lib)                                 | ✅ Supported           |                                                                                                                                         |
| [`@sveltejs/kit/*`](https://kit.svelte.dev/docs/modules#sveltejs-kit)              | ✅ Supported           |                                                                                                                                         |
| [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private) | ⛔ Not supported       | This is a server-side feature, and Storybook renders all components on the client.                                                      |
| [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private)   | ⛔ Not supported       | This is a server-side feature, and Storybook renders all components on the client.                                                      |
| [`$service-worker`](https://kit.svelte.dev/docs/modules#$service-worker)           | ⛔ Not supported       | This is a service worker feature, which does not apply to Storybook.                                                                    |

## How to mock

To mock a SvelteKit import you can define it within `parameters.sveltekit_experimental`:

```ts
// MyComponent.stories.svelte
export const MyStory = {
  parameters: {
    sveltekit_experimental: {
      stores: {
        page: {
          data: {
            test: 'passed',
          },
        },
        navigating: {
          route: {
            id: '/storybook',
          },
        },
        updated: true,
      },
    },
  },
};
```

The [available parameters](#parameters) are documented in the API section, below.

### Mocking links

The default link-handling behavior (e.g. when clicking an `<a href="..." />` element) is to log an action to the [Actions panel](../essentials/actions.md).

You can override this by assigning an object to `parameters.sveltekit_experimental.hrefs`, where the keys are strings representing an href and the values define your mock`. For example:

```ts
// MyComponent.stories.svelte
export const MyStory = {
  parameters: {
    sveltekit_experimental: {
      hrefs: {
        '/basic-href': (to, event) => {
          console.log(to, event);
        },
        '/root.*': {
          callback: (to, event) => {
            console.log(to, event);
          },
          asRegex: true,
        },
      },
    },
  },
};
```

## Writing native Svelte stories

Storybook provides a Svelte addon maintained by the community, enabling you to write stories for your Svelte components using the template syntax. You'll need to take some additional steps to enable this feature.

Run the following command to install the addon.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
   'svelte/svelte-csf-addon-install.yarn.js.mdx',
   'svelte/svelte-csf-addon-install.npm.js.mdx',
   'svelte/svelte-csf-addon-install.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info">

The community actively maintains the Svelte CSF addon but still lacks some features currently available in the official Storybook Svelte framework support. For more information, see [the addon's documentation](https://github.com/storybookjs/addon-svelte-csf).

</Callout>

## API

### Parameters

This framework contributes the following [parameters](../writing-stories/parameters.md) to Storybook, under the `sveltekit_experimental` namespace:

#### `forms`

Type: `{ enhance: TK }`

Provides mocks for the `$app/forms` module.

##### `forms.enhance`

Type: TK

A callback that will be called when a form with `use:enhance` is submitted.

#### `hrefs`

Type: `Record<[path: string], (to: string, event: TK) => void | { callback: (to: string, event: TK) => void, asRegex?: boolean }>`

If you have an `<a />` tag inside your code with the `href` attribute that matches one or more of the links defined (treated as regex based if the `asRegex` property is `true`) the corresponding `callback` will be called. If no matching `hrefs` are defined, an action will be logged to the [Actions panel](../essentials/actions.md). See [Mocking links](#mocking-links) for an example.

#### `navigation`

Type: TK

Provides mocks for the `$app/navigation` module.

##### `navigation.goto`

Type: TK

A callback that will be called whenever `goto` is called. If no function is provided, an action will be logged to the [Actions panel](../essentials/actions.md).

##### `navigation.pushState`

Type: TK

A callback that will be called whenever `pushState` is called. If no function is provided, an action will be logged to the [Actions panel](../essentials/actions.md).

##### `navigation.replaceState`

Type: TK

A callback that will be called whenever `replaceState` is called. If no function is provided, an action will be logged to the [Actions panel](../essentials/actions.md).

##### `navigation.invalidate`

Type: TK

A callback that will be called whenever `invalidate` is called. If no function is provided, an action will be logged to the [Actions panel](../essentials/actions.md).

##### `navigation.invalidateAll`

Type: TK

A callback that will be called whenever `invalidateAll` is called. If no function is provided, an action will be logged to the [Actions panel](../essentials/actions.md).

##### `navigation.afterNavigate`

Type: TK

An object that will be passed to the `afterNavigate` function, which will be invoked when the `onMount` event fires.

#### `stores`

Type: `{ navigating?: {}, page?: {}, updated?: boolean }`

Provides mocks for the `$app/stores` module.

##### `stores.navigating`

Type: TK

A partial version of the `navigating` store.

##### `stores.page`

Type: TK

A partial version of the `page` store.

##### `stores.updated`

Type: boolean

A boolean representing the value of `updated` (you can also access `stores.check()` which will be a no-op).

### Options

You can pass an options object for additional configuration if needed:

```js
// .storybook/main.js
import * as path from 'path';

export default {
  // ...
  framework: {
    name: '@storybook/sveltekit',
    options: {
      // ...
    },
  },
};
```

The available options are:

#### `builder`

Type: `Record<string, any>`

Configure options for the [framework's builder](../api/main-config-framework.md#optionsbuilder). For Sveltekit, available options can be found in the [Vite builder docs](../builders/vite.md).

## Troubleshooting

### Error when starting Storybook

When starting Storybook after upgrading to v7.0, it may quit with the following error:

```sh
ERR! SyntaxError: Identifier '__esbuild_register_import_meta_url__' has already been declared
```

This can occur when manually upgrading from 6.5 to 7.0. To resolve it, you'll need to remove the `svelteOptions` property in `.storybook/main.js`, as that is not supported (and no longer necessary) in Storybook 7+ with SvelteKit.

<!-- End supported renderers -->

</If>
