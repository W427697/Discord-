---
title: 'Main configuration'
---

The main configuration defines a Storybook project's behavior, including the location of stories, addons to use, feature flags, and other project-specific settings.

## `main.js` or `main.ts`

This configuration is defined in `.storybook/main.js|ts`, which is located relative to the root of your project.

A typical Storybook configuration file looks like this:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-typical.js.mdx',
    'common/main-config-typical.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## config

An object to configure Storybook containing the following properties:

- [`config.framework`](./main-config-framework.md) (required)
- [`config.stories`](./main-config-stories.md) (required)
- [`config.addons`](./main-config-addons.md)
- [`config.babel`](./main-config-babel.md)
- [`config.core`](./main-config-core.md)
- [`config.docs`](./main-config-docs.md)
- [`config.env`](./main-config-env.md)
- [`config.features`](./main-config-features.md)
- [`config.logLevel`](./main-config-log-level.md)
- [`config.previewAnnotations`](./main-config-preview-annotations.md)
- [`config.previewBody`](./main-config-preview-body.md)
- [`config.previewHead`](./main-config-preview-head.md)
- [`config.previewMainTemplate`](./main-config-preview-main-template.md)
- [`config.refs`](./main-config-refs.md)
- [`config.staticDirs`](./main-config-static-dirs.md)
- [`config.typescript`](./main-config-typescript.md)
- [`config.viteFinal`](./main-config-vite-final.md)
- [`config.webpackFinal`](./main-config-webpack-final.md)
- [`config.config`](./main-config-config.md) (deprecated)
