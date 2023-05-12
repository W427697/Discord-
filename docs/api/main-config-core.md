---
title: 'config.core'
---

Type:

```ts
{
  builder?: string | { name: string; options?: BuilderOptions };
  channelOptions?: ChannelOptions;
  crossOriginIsolated?: boolean;
  disableProjectJson?: boolean;
  disableTelemetry?: boolean;
  disableWebpackDefaults?: boolean;
  enableCrashReports?: boolean;
  renderer?: RendererName;
}
```

Configures Storybook's internal features.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-core.js.mdx',
    'common/main-config-core.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## `config.core.builder`

Type:

```ts
| '@storybook/builder-vite' | '@storybook/builder-webpack5'
| {
    name: '@storybook/builder-vite' | '@storybook/builder-webpack5';
    options?: BuilderOptions;
  }
```

Configures Storybook's builder, [Vite](../builders/vite.md) or [Webpack](../builders/webpack.md).

## `config.core.channelOptions`

Type: `ChannelOptions`

<!-- TODO: No idea what this is for? -->

```ts
{
  allowRegExp: boolean;
  allowFunction: boolean;
  allowSymbol: boolean;
  allowDate: boolean;
  allowUndefined: boolean;
  allowClass: boolean;
  maxDepth: number;
  space: number | undefined;
  lazyEval: boolean;
}
```

## `config.core.crossOriginIsolated`

Type: `boolean`

Enable CORS headings to run document in a "secure context". See [SharedArrayBuffer security requirements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements)

This enables these headers in development-mode:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

## `config.core.disableProjectJson`

Type: `boolean`

Disables the generation of `project.json`, a file containing Storybook metadata

## `config.core.disableTelemetry`

Type: `boolean`

Disables Storybook's [telemetry collection](../configure/telemetry.md).

## `config.core.disableWebpackDefaults`

Type: `boolean`

Disables Storybook's default Webpack configuration.

## `config.core.enableCrashReports`

Type: `boolean`

Enable crash reports to be sent to Storybook [telemetry](../configure/telemetry.md).

## `config.core.renderer`

Type: `RendererName`

<!-- TOOD: Is this used? Should it be documented? -->
