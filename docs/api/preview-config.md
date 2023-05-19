---
title: 'Preview configuration'
---

The preview configuration defines the behavior and configuration of the Storybook preview, which renders your stories.

## `preview.js` or `preview.ts`

This configuration is defined in `.storybook/preview.js|ts`, which is located relative to the root of your project.

A typical preview configuration file looks like this:

<!-- prettier-ignore-start -->

<!-- TODO: Include more than what's installed with `init` (just some actions and controls parameters)? -->
<CodeSnippets
  paths={[
    'common/preview-config-typical.js.mdx',
    'common/preview-config-typical.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## preview

An object to configure Storybook's preview containing the following properties:

- [`args`](./preview-config-args.md)
- [`argTypes`](./preview-config-arg-types.md)
- [`decorators`](./preview-config-decorators.md)
- [`globals`](./preview-config-globals.md)
- [`globalTypes`](./preview-config-global-types.md)
- [`loaders`](./preview-config-loaders.md)
- [`parameters`](./preview-config-parameters.md)
- [`render`](./preview-config-render.md)
  <!-- TODO: Include these?  -->
  <!-- https://github.com/storybookjs/storybook/blob/next/code/lib/types/src/modules/story.ts#L38-L43 -->
  <!-- https://github.com/ComponentDriven/csf/blob/next/src/story.ts#L235-L245 -->
  <!-- - [`applyDecorators`](./preview-config-apply-decorators.md) -->
  <!-- - [`argsEnhancers`](./preview-config-args-enhancers.md) -->
  <!-- - [`argTypesEnhancers`](./preview-config-arg-types-enhancers.md) -->
  <!-- - [`renderToCanvas`](./preview-config-render-to-canvas.md) -->
  <!-- - [`renderToDOM`](./preview-config-render-to-dom.md) (deprecated) -->
  <!-- - [`runStep`](./preview-config-runStep.md) -->
