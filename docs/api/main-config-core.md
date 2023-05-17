---
title: 'core'
---

Parent: [main.js|ts configuration](./Overview.md)

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

## `builder`

Type:

```ts
| '@storybook/builder-vite' | '@storybook/builder-webpack5'
| {
    name: '@storybook/builder-vite' | '@storybook/builder-webpack5';
    options?: BuilderOptions;
  }
```

Configures Storybook's builder, [Vite](../builders/vite.md) or [Webpack](../builders/webpack.md).

## `channelOptions`

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

## `crossOriginIsolated`

Type: `boolean`

Enable CORS headings to run document in a "secure context". See [SharedArrayBuffer security requirements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements)

This enables these headers in development-mode:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

## `disableProjectJson`

Type: `boolean`

Disables the generation of `project.json`, a file containing Storybook metadata

## `disableTelemetry`

Type: `boolean`

Disables Storybook's [telemetry collection](../configure/telemetry.md).

## `disableWebpackDefaults`

Type: `boolean`

Disables Storybook's default Webpack configuration.

## `enableCrashReports`

Type: `boolean`

Enable crash reports to be sent to Storybook [telemetry](../configure/telemetry.md).

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-core-enable-crash-reports.js.mdx',
    'common/main-config-core-enable-crash-reports.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## `renderer`

Type: `RendererName`

<!-- TOOD: Is this used? Should it be documented? -->
