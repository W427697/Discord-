<h1>Storybook Docs framework dev guide</h1>

Storybook Docs [provides basic support for all non-RN Storybook view layers](../README.md#framework-support) out of the box. However, some frameworks have been docs-optimized, adding features like automatic props table generation and inline story rendering. This document is a dev guide for optimizing a new framework in docs.

- [Framework-specific configuration](#framework-specific-configuration)
- [Arg tables](#arg-tables)
- [Component descriptions](#component-descriptions)
- [Inline story rendering](#inline-story-rendering)
- [Dynamic source rendering](#dynamic-source-rendering)
- [More resources](#more-resources)

## Framework-specific configuration

Your framework might need a framework-specific configuration. It could include adding extra Webpack loaders, global decorators, or story parameters.

Addon docs handle most of this customization through a [common preset](https://github.com/storybookjs/storybook/blob/next/addons/docs/src/frameworks/common/preset.ts), additionally extended by a framework-specific preset defined in Storybook's framework packages (i.e., `@storybook/react`).

For example, consider Storybook Docs for Vue, which needs [`vue-docgen-loader`](https://github.com/pocka/vue-docgen-loader) in its Webpack config, and also has custom extraction functions for [props tables](./props-tables.md) and [component descriptions](#component-descriptions).

For Webpack configuration, Docs for Vue defines [framework-preset-vue-docs.ts](https://github.com/storybookjs/storybook/blob/next/app/vue/src/server/framework-preset-vue-docs.ts), which follows the [preset](https://storybook.js.org/docs/vue/addons/writing-presets) file structure:

```ts
// app/vue/src/server/framework-preset-vue-docs.ts

import { Options } from '@storybook/core-common';
import { hasDocsOrControls } from '@storybook/docs-tools';

export function webpackFinal(webpackConfig: any = {}, options: Options) {
  if (!hasDocsOrControls(options)) return webpackConfig;

  let vueDocgenOptions = {};

  options.presetsList?.forEach((preset) => {
    if (preset.name.includes('addon-docs') && preset.options.vueDocgenOptions) {
      const appendableOptions = preset.options.vueDocgenOptions;
      vueDocgenOptions = {
        ...vueDocgenOptions,
        ...appendableOptions,
      };
    }
  });

  webpackConfig.module.rules.push({
    test: /\.vue$/,
    loader: require.resolve('vue-docgen-loader', { paths: [require.resolve('@storybook/vue')] }),
    enforce: 'post',
    options: {
      docgenOptions: {
        alias: webpackConfig.resolve.alias,
        ...vueDocgenOptions,
      },
    },
  });
  return webpackConfig;
}
```

This appends [`vue-docgen-loader`](https://github.com/pocka/vue-docgen-loader) to the existing configuration, which at this point will also include modifications made by the common preset.

For props tables and descriptions, both of which are described in more detail below, it defines a file [config.ts](https://github.com/storybookjs/storybook/blob/next/app/vue/src/client/docs/config.ts).

## Arg tables

Each framework can auto-generate ArgTables by exporting one or more `ArgType` enhancers, which extracts a component's properties into a standard data structure.

For example, with Vue, the extraction process and UI rendering are set up  in the following file:

```ts
// app/vue/src/client/docs/config.ts

import { extractComponentDescription, enhanceArgTypes } from '@storybook/docs-tools';
import { extractArgTypes } from './extractArgTypes';
import { prepareForInline } from './prepareForInline';
import { sourceDecorator } from './sourceDecorator';

export const parameters = {
  docs: {
    inlineStories: true,
    iframeHeight: 120,
    prepareForInline,
    extractArgTypes,
    extractComponentDescription,
  },
};

export const decorators = [sourceDecorator];

export const argTypesEnhancers = [enhanceArgTypes];
```

The `enhanceArgTypes` function takes a `StoryContext` (including the story unique identifier, parameters, args, argTypes, etc.), and returns an updated [`ArgTypes` object](https://github.com/storybookjs/storybook/blob/master/lib/addons/src/types.ts#L39-L48):

```ts
// lib/addons/src/types.ts

export interface ArgType {
  name?: string;
  description?: string;
  defaultValue?: any;
  addIf?: string;
  removeIf?: string;
  [key: string]: any;
}

export interface ArgTypes {
  [key: string]: ArgType;
}
```

For more information on what this generation looks like, see the [controls generation docs](https://github.com/storybookjs/storybook/blob/next/addons/controls/README.md#my-controls-arent-being-auto-generated-what-should-i-do).

For React and Vue, the extraction works as follows:

- A Webpack loader is added to the user's config via the preset
- The loader annotates the component with a field, `__docgenInfo`, which contains some metadata
- The view-layer specific `enhanceArgTypes` function translates that metadata into `ArgTypes`

For Angular, Web Components, and Ember, the extraction works as follows:

- Read JSON file in the user's `.storybook/preview.json` and story it into a global variable
- The view-layer specific `enhanceArgTypes` function translates that metadata into `ArgTypes`

However, you may want to implement this in another way for your framework.

## Component descriptions

Component descriptions are enabled by the `docs.extractComponentDescription` parameter, which extracts a component description (usually from source code comments) into a markdown string.

It follows the pattern of [Arg tables](#arg-tables) above; only it's even simpler because the function output is simply a string (or null if there is no description).

## Inline story rendering

Inline story rendering is another framework-specific optimization made possible by the `docs.prepareForInline` parameter.

Again let's look at how it's configured with Vue, starting with the configuration:

```ts
// app/vue/src/client/docs/config.ts

import { extractComponentDescription, enhanceArgTypes } from '@storybook/docs-tools';
import { extractArgTypes } from './extractArgTypes';
import { prepareForInline } from './prepareForInline';
import { sourceDecorator } from './sourceDecorator';

export const parameters = {
  docs: {
    inlineStories: true,
    iframeHeight: 120,
    prepareForInline,
    extractArgTypes,
    extractComponentDescription,
  },
};
```

And how it is implemented:

```ts
// app/vue/src/client/docs/prepareForInline.ts

import React from 'react';
import Vue from 'vue';
import type { StoryContext, PartialStoryFn } from '@storybook/csf';
import type { VueFramework } from '../preview/types-6-0';

const COMPONENT = 'STORYBOOK_COMPONENT';
const VALUES = 'STORYBOOK_VALUES';

export const prepareForInline = (
  storyFn: PartialStoryFn<VueFramework>,
  { args }: StoryContext<VueFramework>
) => {
  const component = storyFn();
  const el = React.useRef(null);

  React.useEffect(() => {
    const root = new Vue({
      el: el.current,
      data() {
        return {
          [COMPONENT]: component,
          [VALUES]: args,
        };
      },
      render(h) {
        const children = this[COMPONENT] ? [h(this[COMPONENT])] : undefined;
        return h('div', { attrs: { id: 'root' } }, children);
      },
    });
    return () => root.$destroy();
  });

  return React.createElement('div', null, React.createElement('div', { ref: el }));
};
```

The input is the story function and the story context (id, parameters, args, etc.), and the output is a React element because we render docs pages in React. Depending on the framework you're working you may rely on additional libraries that can help you streamline this workflow. 

## Dynamic source rendering


With the release of Storybook 6.0, we've improved how stories render with the [Source doc block](https://storybook.js.org/docs/react/writing-docs/doc-block-source). One of such improvements is the `dynamic` source type, which renders a snippet based on the output of the story function. 

This dynamic rendering is framework-specific, meaning it needs a custom implementation for each framework.

Let's take a look at the React framework implementation of `dynamic` snippets as a reference for implementing this feature in other frameworks:

```tsx
// app/react/src/client/docs/jsxDecorator.tsx

import React, { createElement, ReactElement } from 'react';

import { addons, useEffect } from '@storybook/addons';
import { StoryContext, ArgsStoryFn, PartialStoryFn } from '@storybook/csf';
import { SourceType, SNIPPET_RENDERED, getDocgenSection } from '@storybook/docs-tools';
import { ReactFramework } from '../preview/types-6-0';

export const jsxDecorator = (
  storyFn: PartialStoryFn<ReactFramework>,
  context: StoryContext<ReactFramework>
) => {
  const channel = addons.getChannel();
  const skip = skipJsxRender(context);
  const story = storyFn();

  let jsx = '';

  useEffect(() => {
    if (!skip) channel.emit(SNIPPET_RENDERED, (context || {}).id, jsx);
  });
  if (skip) {
    return story;
  }
  const options = {
    ...defaultOpts,
    ...(context?.parameters.jsx || {}),
  } as Required<JSXOptions>;
  const storyJsx = context?.parameters.docs?.source?.excludeDecorators
    ? (context.originalStoryFn as ArgsStoryFn<ReactFramework>)(context.args, context)
    : story;

  const sourceJsx = mdxToJsx(storyJsx);

  const rendered = renderJsx(sourceJsx, options);
  if (rendered) {
    jsx = applyTransformSource(rendered, options, context);
  }

  return story;
};
```

A few key points from the above snippet:

- The **renderJsx** function call is responsible for transforming the output of a story function into a string specific to the framework (i.e., React).
- The returned snippet string is emitted on Storybook's channel through **channel.emit()** and subsequently consumed up by the Source block for any given story, if it exists.

<div class="aside">
The code snippet above is only a fraction of the actual implementation. If you're interested, check out the full code <a href="https://github.com/storybookjs/storybook/blob/next/app/react/src/client/docs/jsxDecorator.tsx">here</a>.
</div>

Now we need a way to configure how it's displayed in the UI:

```tsx
// app/react/src/client/docs/config.ts

import { jsxDecorator } from './jsxDecorator';

export const decorators = [jsxDecorator];
```

This configures the `jsxDecorator` to be run on every story. 

<div class="aside">
If you're interested in learning more, check out the full implementation <a href="https://github.com/storybookjs/storybook/blob/next/app/react/src/client/docs/config.ts">here</a>.
</div>

## More resources

- References: [README](../README.md) / [DocsPage](docspage.md) / [MDX](mdx.md) / [FAQ](faq.md) / [Recipes](recipes.md) / [Theming](theming.md) / [Props](props-tables.md)
- Framework-specific docs: [React](../react/README.md) / [Vue](../vue/README.md) / [Angular](../angular/README.md) / [Web components](../web-components/README.md) / [Ember](../ember/README.md)
- Announcements: [Vision](https://medium.com/storybookjs/storybook-docs-sneak-peak-5be78445094a) / [DocsPage](https://medium.com/storybookjs/storybook-docspage-e185bc3622bf) / [MDX](https://medium.com/storybookjs/rich-docs-with-storybook-mdx-61bc145ae7bc) / [Framework support](https://medium.com/storybookjs/storybook-docs-for-new-frameworks-b1f6090ee0ea)
- Example: [Storybook Design System](https://github.com/storybookjs/design-system)
