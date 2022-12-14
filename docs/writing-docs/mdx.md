---
title: 'MDX'
---

[MDX](https://mdxjs.com/) files mix Markdown and Javascript/JSX to create rich interactive documentation. You can use Markdown’s readable syntax (such as `# heading`) for your documentation, include stories defined in [Component Story Format (CSF)](../api/csf.md), and freely embed JSX component blocks at any point in the file. All at once.

In addition, you can write pure documentation pages in MDX and add them to Storybook alongside your stories.

![MDX simple example result](./mdx-hero.png)

<div class="aside">

Writing stories directly in MDX was deprecated in Storybook 7. Please reference the <LinkWithVersion version="6.5" href="./mdx.md">previous documentation</LinkWithVersion> for guidance on that feature.

</div>

## Basic example

Let's get started with an example, `Checkbox.mdx`, that combines Markdown with a single story

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/checkbox-story.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

This MDX file references a story file, Checkbox.stories.js, that is written in [Component Story Format (CSF)](../api/csf.md):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/checkbox-story-csf.js.mdx',
  ]}
  usesCsf3
  csf2Path="writing-docs/mdx#snippet-checkbox-story-csf"
/>

<!-- prettier-ignore-end -->

And here's how that's rendered in Storybook:

![MDX simple example result](./mdx-simple.png)

There’s a lot going on here. We're writing Markdown, we're writing JSX, and we're also defining and referencing Storybook stories that are drop-in compatible with the entire Storybook ecosystem.

Let’s break it down.

### MDX and CSF

The first thing you’ll notice is that your component docs consists of two files in two different formats: one for defining your stories, and the second one for documenting them. This split leverages the best qualities of each format:

- **CSF** is great for succinctly defining stories (component examples). If you use TypeScript, it also provides type safety and autocompletion.
- **MDX** is great for writing structured documentation and composing it with interactive JSX elements.

If you’re coming from an older version of Storybook, you might be accustomed to using MDX both for documentation AND for defining stories in the same `.stories.mdx` file. We’ve deprecated this functionality and plan to remove it in a future version of Storybook. We provide migration scripts to help you onto the new format.

### Anatomy of MDX

Assuming you’re already familiar with CSF, we can dissect the MDX side of things a bit further.

The document consists of a number of blocks separated by blank lines. Since MDX mixes a few different languages together, it uses those blank lines to help distinguish where one starts and the next begins. Failing to separate blocks by whitespace can cause (sometimes inscrutable) parse errors.

Going through the code blocks in sequence:

```jsx
{
  /* Checkbox.mdx */
}
```

Comments in MDX are JSX blocks that contain JS comments.

```jsx
import { Canvas, Meta, Story } from '@storybook/blocks';
import * as CheckboxStories from './Checkbox.stories';
```

Imports the components and stories that will be used in the JSX throughout the rest of the file.

```jsx
<Meta of={CheckboxStories} />
```

The `Meta` block defines where in the sidebar the document will be placed. In this case, it is placed alongside the Checkbox’s stories. By default, the docs sidebar node is titled `"Docs"`, but this can be customized by passing a `name` prop (e.g. `<Meta of={CheckboxStories} name="Info" />`). If you want to place a docs node at an arbitrary point in the navigation hierarchy, you can use the `title` prop (e.g. `<Meta title="path/to/node" />`).

```jsx
# Checkbox

With `MDX` we can compose Markdown documentation with
`Checkbox` stories and interactive controls.
```

MDX2 supports standard markdown ([”commonmark”](https://commonmark.org/)) by default, and can be extended to support [GitHub-flavored markdown (GFM)](https://github.github.com/gfm) and other other extensions (see [Breaking changes](#breaking-changes), below).

```jsx
<Canvas>
  <Story of={CheckboxStories.Unchecked} />
</Canvas>
```

Finally, MDX supports blocks of arbitrary JSX.

In this case, we are leveraging “Doc Blocks”, which is a library of documentation components that are designed to work with Storybook stories to do things like show your stories, your component APIs & controls for interacting with your components inside your documentation, among other utilities.

In addition to Doc Blocks, MDX can incorporate arbitrary React components, making it a very flexible documentation system. Suppose you want a stylized list of “dos and don’ts” for your component, you can use off-the-shelf components or write your own.

```jsx
<Guidelines>
  <Dos>
    - Use buttons for the main actions on your page - Identify the primary action and make that
    `primary`
  </Dos>
  <Donts>
    - Use a button when a link will do (e.g. for navigation only actions) - Use multiple primary
    buttons in a single UI state
  </Donts>
</Guidelines>
```

### Known limitations

- While MDX2 supports a variety of runtimes (React, Preact, Vue), Storybook’s implementation is React-only. That means that your documentation is rendered in React, while your stories are rendered in the runtime of your choice (React, Vue, Angular, Web-components, Svelte, etc.)

## Breaking changes

There are a lot of breaking changes if you’re moving from MDX1 to MDX2. As far as we know, all of these are due to changes in the MDX library itself, rather than changes to Storybook’s usage. Nevertheless, as an MDX user, you will probably need to update your MDX files as part of the upgrade. MDX has published their own [Migration guide](https://mdxjs.com/migrating/v2/#update-mdx-files). Here we try to summarize some of the key changes for Storybook users.

### Custom components apply differently

From the MDX migration guide:

> We now “sandbox” components, for lack of a better name. It means that when you pass a component for `h1`, it does get used for `# hi` but not for `<h1>hi</h1>`

This means that the first heading in the following example gets replaced, whereas the second heading does not. This doesn’t sound like a big change, but in practice is extremely disruptive and manifests itself in a variety of ways. Unfortunately, this cannot be automatically converted in a safe way.

```jsx
# some heading

<h1>another heading</h1>
```

### Lack of Github Flavored Markdown (GFM)

Also from the MDX migration guide:

> We turned off GFM features in MDX by default. GFM extends CommonMark to add autolink literals, footnotes, strikethrough, tables, and task lists. If you do want these features, you can use a plugin. How to do so is described in [our guide on GFM](https://mdxjs.com/guides/gfm/).

In Storybook, you can apply MDX options, including plugins, in the main configuration file:

```js
// .storybook/main.js
import remarkGfm from 'remark-gfm';

module.exports = {
  // ...
  addons: [
    // ...
    {
      name: '@storybook/addon-docs',
      options: {
        mdxCompileOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    },
  ],
};
```

### Automigration

We’ve created an automigration to make this easier, and are including things that we can fix automatically as we find them.

```jsx
npx storybook@next automigrate --fixId mdx1to2
```

<!-- We’ll be documenting the most disruptive changes that we can’t automigrate as they are reported by the community. So far, the list of top offenders include. -->

## Documentation-only MDX

MDX documents do not have to reference stories. If the `<Meta>` only has a `title` and no `of` prop, (for example, `<Meta title="Intro" />`) and if you use no `<Story>` blocks, that document will be considered "documentation-only" and appear differently in the sidebar navigation menu:

![MDX docs only story](./mdx-documentation-only.png)

### Creating a Changelog story

One common use case for documentation-only MDX is importing a project's `CHANGELOG.md`, so that users can easily refer to the CHANGELOG via a documentation node in Storybook.

First, ensure that `transcludeMarkdown` is set to `true` in `main.js`:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-enable-transcludemarkdown.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Then, import the markdown and treat the imported file as a component in the MDX file:

```mdx
import { Meta } from '@storybook/blocks';

import Changelog from '../CHANGELOG.md';

<Meta title="Changelog" />

<Changelog />
```

![Changelog markdown in an MDX story](./changelog-mdx-md-transcludemarkdown-optimized.png)

## Linking to other stories and pages

When writing MDX, you may want to provide links to other stories or documentation pages and sections. You can use the `path` query string.

Considering a story with ID `some--id`, this redirects to the **Docs** tab of the story:

```md
[Go to specific documentation page](?path=/docs/some--id)
```

This redirects to the **Canvas** tab of the story:

```md
[Go to specific story canvas](?path=/story/some--id)
```

You can also use anchors to target a specific section of a page:

```md
[Go to the conclusion of the documentation page](?path=/docs/some--id#conclusion)
```

<div class="aside">
💡 By applying this pattern with the Controls addon, all anchors will be ignored in Canvas based on how Storybook handles URLs to track the args values.
</div>

![MDX anchor example](./mdx-anchor.webp)

## Syntax highlighting

When writing your documentation with Storybook and MDX, you get syntax highlighting out of the box for a handful of popular languages (Javascript, Markdown, CSS, HTML, Typescript, GraphQL). For other formats, for instance, SCSS, you'll need to extend the syntax highlighter manually:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
   'common/my-component-with-custom-syntax-highlight.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">
💡 For a list of available languages, check <code>react-syntax-highlighter</code>'s <a href="https://github.com/react-syntax-highlighter/react-syntax-highlighter">documentation</a>.
</div>

Once you've updated your documentation, you'll see the code block properly highlighted. You can also apply the same principle to other unsupported formats (i.e., `diff`, `hbs`).

You can also update your [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering) and enable syntax highlighting globally. For example, to add support for SCSS, update your configuration to the following:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
   'common/storybook-preview-register-language-globally.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Write your documentation as you usually would, and your existing SCSS code blocks will automatically be highlighted when Storybook reloads. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
   'common/my-component-with-global-syntax-highlight.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->
