---
title: 'Stories for multiple components'
---

It's useful to write stories that [render two or more components](../writing-stories/index.md#stories-for-two-or-more-components) at once if those components are designed to work together. For example, `ButtonGroup` or `List` components. Here's an example with `List` and `ListItem` components:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/list-story-with-subcomponents.js.mdx',
    'react/list-story-with-subcomponents.ts.mdx',
    'angular/list-story-with-subcomponents.ts.mdx',
    'vue/list-story-with-sub-components.js.mdx',
    'vue/list-story-with-sub-components.ts.mdx',
    'web-components/list-story-with-subcomponents.js.mdx',
    'web-components/list-story-with-subcomponents.ts.mdx',
  ]}
  usesCsf3
  csf2Path="writing-stories/stories-for-multiple-components#snippet-list-story-with-subcomponents"
/>

<!-- prettier-ignore-end -->

Note that by adding a `subcomponents` property to the default export, we get an extra panel on the [ArgTypes](../writing-docs/doc-blocks.md#argtypes) and [Controls](../essentials/controls.md#) tables, listing the props of `ListItem`:

![Subcomponents in ArgTypes doc block](./doc-block-arg-types-subcomponents-for-list.png)

Subcomponents are only intended for documentation purposes and have some limitations:

1. The [argTypes](../api/arg-types.md) of subcomponents are [inferred (for the renderers that support that feature)](../api/arg-types.md#automatic-argtype-inference) and cannot be manually defined or overridden.
2. The table for each documented subcomponent does _not_ include [controls](../essentials/controls.md) to change the value of the props, because controls always apply to the main component's args.

Let's talk about some techniques you can use to mitigate the above, which are especially useful in more complicated situations.

## Reusing subcomponent stories

We can also reuse the stories of the `ListItem` subcomponent in `List` stories.

If the story to be reused is written in [CSF 2](../../../release-6-5/docs/api/csf.md), we can reuse it directly:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/reuse-story-csf2.js.mdx', 
    'react/reuse-story-csf2.ts.mdx',
    'vue/reuse-story-csf2.js.mdx',
    'vue/reuse-story-csf2.ts.mdx',
    'angular/reuse-story-csf2.ts.mdx',
    'web-components/reuse-story-csf2.js.mdx',
    'web-components/reuse-story-csf2.ts.mdx',
    'solid/reuse-story-csf2.js.mdx',
    'solid/reuse-story-csf2.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<If renderer={['react', 'vue', 'svelte']}>

If the story to be reused is written in [CSF 3](../api/csf.md), we can reuse it by composing it into a [portable story](../api/portable-stories-jest.md):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/reuse-story-portable.js.mdx',
    'react/reuse-story-portable.ts.mdx',
    'vue/reuse-story-portable.3.js.mdx',
    'vue/reuse-story-portable.3.ts.mdx',
  ]}
  usesCsf3
/>

<!-- prettier-ignore-end -->

<!-- END if react, vue, svelte -->
</If>

<If notRenderer={['react', 'vue', 'svelte']}>

If the story to be reused is written in [CSF 3](../api/csf.md) and defines a [`render` function](../api/csf.md#custom-render-functions), we can use that `render` function to reuse the story:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/reuse-story-render-function.ts.mdx',
    'web-components/reuse-story-render-function.js.mdx',
    'web-components/reuse-story-render-function.ts.mdx',
    'solid/reuse-story-render-function.js.mdx',
    'solid/reuse-story-render-function.ts.mdx',
  ]}
  usesCsf3
/>

<!-- prettier-ignore-end -->

<!-- END if not react, vue, svelte -->
</If>

By rendering the `Unchecked` story with its args, we are able to reuse the input data from the `ListItem` stories in the `List`.

However, we still aren’t using args to control the `ListItem` stories, which means we cannot change them with controls and we cannot reuse them in other, more complex component stories.

## Using children as an arg

One way we improve that situation is by pulling the rendered subcomponent out into a `children` arg:

<!-- TODO: Update this snippet, too -->

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/list-story-with-unchecked-children.js.mdx',
    'react/list-story-with-unchecked-children.ts.mdx',    
  ]}
  usesCsf3
  csf2Path="writing-stories/stories-for-multiple-components#snippet-list-story-with-unchecked-children"
/>

<!-- prettier-ignore-end -->

Now that `children` is an arg, we can potentially reuse it in another story.

However, there are some caveats when using this approach that you should be aware of.

The `children` `args` as any other arg needs to be JSON serializable. It means that you should:

- Avoid using empty values
- Use caution with components that include third party libraries

As they could lead into errors with your Storybook.

<Callout variant="info">

We're currently working on improving the overall experience for the children arg and allow you to edit children arg in a control and allow you to use other types of components in the near future. But for now you need to factor in this caveat when you're implementing your stories.

</Callout>

## Creating a Template Component

Another option that is more “data”-based is to create a special “story-generating” template component:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/list-story-template.js.mdx',
    'react/list-story-template.ts.mdx',
    'vue/list-story-template.3.js.mdx',
    'vue/list-story-template.3.ts.mdx',
    'angular/list-story-template.ts.mdx',
    'web-components/list-story-template.js.mdx',
    'web-components/list-story-template.ts.mdx',
    'solid/list-story-template.js.mdx',
    'solid/list-story-template.ts.mdx',
  ]}
  usesCsf3
  csf2Path="writing-stories/stories-for-multiple-components#snippet-list-story-template"
/>

<!-- prettier-ignore-end -->

This approach is a little more complex to setup, but it means you can more easily reuse the `args` to each story in a composite component. It also means that you can alter the args to the component with the Controls addon.
