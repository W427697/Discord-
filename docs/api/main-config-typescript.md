---
title: 'config.typescript'
---

Type:

```ts
{
  check?: boolean;
  checkOptions?: CheckOptions;
  skipBabel?: boolean;
  reactDocgen?: 'react-docgen' | 'react-docgen-typescript' | false;
  reactDocgenTypescriptOptions?: ReactDocgenTypescriptOptions;
}
```

Configures how Storybook handles [TypeScript files](../configure/typescript.md).

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-add-ts-config.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## `config.typescript.check`

Type: `boolean`

Optionally run [fork-ts-checker-webpack-plugin](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin).

## `config.typescript.checkOptions`

Type: `CheckOptions`

Options to pass to `fork-ts-checker-webpack-plugin`, if enabled. See [docs for available options](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/blob/v4.1.6/README.md#options).

## `config.typescript.skipBabel`

Type: `boolean`

Disable parsing of TypeScript files through babel.

## `config.typescript.reactDocgen`

Type: `'react-docgen' | 'react-docgen-typescript' | false`

Configure which library, if any, Storybook uses to parse React components, [react-docgen](https://github.com/reactjs/react-docgen) or [react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript). Set to `false` to disable parsing React components.

## `config.typescript.reactDocgenTypescriptOptions`

Type: `ReactDocgenTypescriptOptions`

Options to pass to react-docgen-typescript-plugin if react-docgen-typescript is enabled. See [docs for available options](https://github.com/hipstersmoothie/react-docgen-typescript-plugin).
