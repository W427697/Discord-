---
title: 'config.babel'
---

<!-- TODO: Is `babel` or `babelDefault` the one we prefer? -->

Type: `(config: Babel.Config, options: Options) => Babel.Config | Promise<Babel.Config>`

Customize Storybook's [Babel](https://babeljs.io/) setup.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-babel.js.mdx',
    'common/main-config-babel.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## `Babel.Config`

See [Babel docs](https://babeljs.io/docs/options).

## `Options`

Type:

```ts
{
  // LoadOptions
  packageJson: PackageJson;
  outputDir?: string;
  configDir?: string;
  ignorePreview?: boolean;
  extendServer?: (server: http.Server) => void;
  // StorybookConfigOptions
  presets: Presets; // ???
  presetsList?: {
    name: string;
    preset: any;
    options: any;
  }[];
  // CLIOptions
  port?: number;
  ignorePreview?: boolean;
  previewUrl?: string;
  forceBuildPreview?: boolean;
  disableTelemetry?: boolean;
  enableCrashReports?: boolean;
  host?: string;
  configDir?: string;
  https?: boolean;
  sslCa?: string[];
  sslCert?: string;
  sslKey?: string;
  smokeTest?: boolean;
  managerCache?: boolean;
  open?: boolean;
  ci?: boolean;
  loglevel?: string;
  quiet?: boolean;
  versionUpdates?: boolean;
  releaseNotes?: boolean;
  docs?: boolean;
  debugWebpack?: boolean;
  webpackStatsJson?: string | boolean;
  outputDir?: string;
  // BuilderOptions
  configType?: 'DEVELOPMENT' | 'PRODUCTION';
  ignorePreview?: boolean;
  cache?: FileSystemCache;
  configDir: string;
  docsMode?: boolean;
  features?: StorybookConfig['features']; // See: config.features
  versionCheck?: {
    success: boolean;
    cached: boolean;
    data?: any;
    error?: any;
    time: number;
  };
  releaseNotesData?: {
    success: boolean;
    currentVersion: string;
    showOnFirstLaunch: boolean;
  };
  disableWebpackDefaults?: boolean;
  serverChannelUrl?: string;
}
```

<!--
TODO:
This feels like _a lot_. And we haven't actually documented any of these properties beyond their type.

The `Presets` type is quite complex:
https://github.com/storybookjs/storybook/blob/9d495a7c645331a798f67f7c548dec6ea4e1820f/code/lib/types/src/modules/core-common.ts#L61-L75

So is the `FileSystemCache` type, although that belongs to a third-party library we can reference: `file-system-cache`
-->
