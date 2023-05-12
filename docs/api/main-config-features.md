---
title: 'config.features'
---

Type:

```ts
{
  argTypeTargetsV7?: boolean;
  buildStoriesJson?: boolean;
  legacyDecoratorFileOrder?: boolean;
  legacyMdx1?: boolean;
  storyStoreV7?: boolean;
}
```

Enables Storybook's additional features.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-features.js.mdx',
    'common/main-config-features.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## `config.features.buildStoriesJson`

Type: `boolean`

Generates a `stories.json` file to help story loading with the on-demand mode.

## `config.features.legacyDecoratorFileOrder`

Type: `boolean`

Apply decorators from preview.js before decorators from addons or frameworks

## `config.features.legacyMdx1`

Type: `boolean`

Enables support for MDX version 1 as a fallback. Requires [@storybook/mdx1-csf](https://github.com/storybookjs/mdx1-csf) to be installed.

## `config.features.storyStoreV7`

Type: `boolean`

Default: `true`

Opts out of [on-demand story loading](#on-demand-story-loading); loads all stories at build time.

## `config.features.argTypeTargetsV7` (EXPERIMENTAL)

Type: `boolean`

Filter args with a "target" on the type from the render function.

## On-demand story loading

As your Storybook grows, it gets challenging to load all of your stories performantly, slowing down the loading times and yielding a large bundle. Out of the box, Storybook loads your stories on demand rather than during boot-up to improve the performance of your Storybook. If you need to load all of your stories during boot-up, you can disable this feature by setting the `storyStoreV7` feature flag to `false` in your configuration as follows:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-on-demand-story-loading.js.mdx',
    'common/storybook-on-demand-story-loading.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Known limitations

Because of the way stories are currently indexed in Storybook, loading stories on demand with `storyStoreV7` has a couple of minor limitations at the moment:

- [CSF formats](../api/csf.md) from version 1 to version 3 are supported. The `storiesOf` construct is not.
- Custom [`storySort` functions](../writing-stories/naming-components-and-hierarchy.md#sorting-stories) receive more limited arguments.
