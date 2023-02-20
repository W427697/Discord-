---
title: 'Automatic documentation and Storybook'
---

Documentation is an essential part of modern UI development, as it serves as a reference for developers who may need to understand or integrate your components into their own projects. Well-written documentation can help to promote the project and make it more accessible to a broader audience. Overall, the importance of writing documentation cannot be overstated, as it is a key factor in the success of any project.

In Storybook, this workflow happens automatically. When you write stories for your components, you create living, interactive, sustainable documentation.

## How does documentation work in Storybook?

You start by writing a [**story**](../writing-stories/introduction) for your component to define the different states it can be in. Then generate the baseline **documentation** for your story via `tags`. Finally, customize the documentation with [MDX](./mdx.md) or optionally with Storybook's **Doc Blocks** to fully control how the content gets rendered.

## Setup automated documentation

To enable auto-generated documentation for your stories, you'll need to add the `tags` configuration property to the story's default export. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-story-auto-docs.js.mdx',
    'react/button-story-auto-docs.ts.mdx',
    'vue/button-story-auto-docs.js.mdx',
    'vue/button-story-auto-docs.ts.mdx',
    'angular/button-story-auto-docs.ts.mdx',
    'svelte/button-story-auto-docs.js.mdx',
    'web-components/button-story-auto-docs.js.mdx',
    'web-components/button-story-auto-docs.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<video autoPlay muted playsInline loop>
  <source
    src="storybook-button-auto-docs-optimized.mp4"
    type="video/mp4"
  />
</video>

Once the story loads, Storybook infers the relevant metadata (e.g., [`args`](../writing-stories/args.md), [`argTypes`](../api/argtypes.md), [`parameters`](../writing-stories/parameters.md)) and automatically generates a documentation page with this information positioned at the root-level of your component tree in the sidebar.

### Configure

By default, Storybook offers zero-config support for documentation and automatically sets up a documentation page for each story enabled via the `tags` configuration property. However, you can extend your Storybook configuration file (i.e., `.storybook/main.js|ts|cjs`) and provide additional options to control how documentation gets created. Listed below are the available options and examples of how to use them.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-auto-docs-full-config.js.mdx',
    'common/storybook-auto-docs-full-config.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

| Option        | Description                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `disable`     | Toggles support for all documentation pages <br/> `docs: { disable:true }`                                                           |
| `autodocs`    | Configures auto-generated documentation pages. Available options: `true`, `false`,`tags` (default) <br/> `docs: { autodocs: false }` |
| `defaultName` | Renames the auto-generated documentation page<br/> `docs: { defaultName: 'Documentation' }`                                          |

### Write a custom template

To replace the default documentation template used by Storybook, you can extend your UI configuration file (i.e., `.storybook/preview.js`) and introduce a `docs` [parameter](../writing-stories/parameters.md#global-parameters). This parameter accepts a `page` function that returns a React component, which you can use to generate the required template. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-auto-docs-custom-template-function.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

💡 Internally, Storybook uses a similar implementation to generate the default template. See the Doc Blocks API reference if you want to learn more about how Doc Blocks work.

</div>

Going over the code snippet in more detail. When Storybook starts up, it will override the default template with the custom one composed of the following:

1. A header with the component's metadata retrieved by the `Title`, `Subtitle`, and `Description` Doc Blocks.
2. The first story defined in the file via the `Primary` Doc Block with a handy set of UI controls to zoom in and out of the component.
3. An interactive table with all the relevant [`args`](../writing-stories/args.md) and [`argTypes`](../api/argtypes.md) defined in the story via the `Controls` Doc Block.
4. A overview of the remaining stories via the `Stories` Doc Block.

#### With MDX

However, you're not restricted to defining a function to generate the documentation template. The `docs` [parameter](../writing-stories/parameters.md#global-parameters) also accepts a reference to a template written in MDX, but this comes with a caveat, depending on where you place the file in your project, it may inadvertently get picked up by Storybook's auto-generated documentation. We recommend placing the file in a custom directory outside the `src` directory to avoid this issue. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-auto-docs-custom-template.js.mdx',
    'common/storybook-preview-auto-docs-template.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Nevertheless, not all projects are built by adopting a single convention. There may be some situations where the `src` directory is unavailable. In that case, you can customize the template by adding the [`Meta`](../api/doc-block-meta.md) Doc Block and supplying the `isTemplate` property to tell Storybook to treat this file as a documentation template. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-mdx-template-with-prop.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

💡 If you only need to override the documentation page for a single component, we recommend creating an MDX file and referencing it directly via the `<Meta of={} />` Doc Block.

</div>

## Setup custom documentation

Storybook provides support for MDX 2, an open standard markup language, combining two other ones: Markdown, which is used for formatting text, and JSX, which is used for rendering dynamic elements on a page. To enable custom documentation for your stories with this format, start by updating your Storybook configuration file (i.e., `.storybook/main.js|ts|cjs`).

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-auto-docs-main-mdx-config.js.mdx',
    'common/storybook-auto-docs-main-mdx-config.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Create an MDX file to add your custom documentation. Depending on how you want your documentation to render in the UI, you'll need to consider the following use cases.

### Using the `Meta` Doc Block

If you need to match the component documentation to an existing story, you can use the `Meta` Doc Block and configure it to control how the documentation gets rendered. Out of the box, it allows you to define a custom title or a reference to the story you need to document (i.e., via the `of` prop). For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-auto-docs-baseline-example.custom-title.mdx.mdx',
    'common/storybook-auto-docs-baseline-example.of-prop.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Using the File System

However, providing the `Meta` Doc Block may not be required for certain use cases, such as standalone pages or even as guidelines for testing your components. In that case, you can safely omit it. Storybook will instead rely on the file's physical location to place the documentation in the sidebar, overriding any pre-existent auto-generated documentation with your own. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-auto-docs-custom-file.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

💡 If you're overriding an existing auto-generated documentation page enabled via [`tags`](#setup-automated-docs) configuration property, we recommend removing it to avoid errors.

</div>

Once the custom MDX documentation is loaded, Storybook will infer the title and location using the same heuristic rules used to generate [auto-title stories](../configure/sidebar-and-urls.md#csf-30-auto-titles) and render it in the sidebar as a `Docs` entry.

### Fully control custom documentation

Documentation can be expensive to maintain and keep up to date when applied to every project component. To help simplify this process, Storybook provides a set of useful UI components (i.e., Doc Blocks) to help cover more advanced cases. If you need additional content, use them to help create your custom documentation.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-auto-docs-starter-example.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Working with multiple components

If you need to document multiple components in a single documentation page, you can reference them directly inside your MDX file. Internally, Storybook looks for the story metadata and composes it alongside your existing documentation. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-auto-docs-mdx-file.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Advanced configuration

### Customize the Docs Container

The Docs Container is the component that wraps up the documentation page. It's responsible for rendering the documentation page in Storybook's UI. You can customize it by creating your own component and updating your Storybook UI configuration file (i.e., `.storybook/preview.js`) to reference it.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-auto-docs-custom-docs-container.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Override the default theme

By default, Storybook provides two themes for the UI: `light` and `dark`. If you need to customize the theme used by the documentation to match the existing one, you can update your Storybook UI configuration file (i.e., `.storybook/preview.js`) and apply it.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-auto-docs-override-theme.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Working with custom MDX components

Out of the box, Storybook has a set of components that you can use to customize your documentation page. If you're working with a design system or component library and wish to add them to your documentation page, you can override the `MDXProvider` component inherited from `@mdx-js/react` with your own. However, there's a caveat to this, the component replacement will only have an impact if you're writing documentation using Markdown syntax (e.g., `#` for headings). Native HTML elements, such as `<h1>`, will not be replaced with your custom implementation.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-auto-docs-override-mdx-container.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

💡 This is not a Storybook issue but a breaking change introduced with MDX 2. For more information on this and other breaking changes, see our [MDX documentation](./mdx.md#breaking-changes).

</div>

## Troubleshooting

### The auto-generated documentation is not showing up in a monorepo setup

Out of the box, Storybook's AutoDocs feature is built to generate documentation for your stories automatically. Nevertheless, if you're working with a monorepo setup (e.g., [`Yarn Workspaces`](https://yarnpkg.com/features/workspaces), [`pnpm Workspaces`](https://pnpm.io/workspaces)), you may run into issues where part of the documentation may not be generated for you. To help you troubleshoot those issues, we've prepared some recommendations that might help you.

Update your import statements to reference the component directly instead of the package's root. For example:

<!-- prettier-ignore-start -->


<CodeSnippets
  paths={[
    'common/storybook-fix-imports-autodocs-monorepo.js.mdx',
    'common/storybook-fix-imports-autodocs-monorepo.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Additionally, if you're developing using TypeScript, you may need to update Storybook's configuration file (i.e., `.storybook/main.js|ts`) to include the following:

<!-- prettier-ignore-start -->


<CodeSnippets
  paths={[
    'common/storybook-main-fix-imports-autodocs-monorepo.js.mdx',
    'common/storybook-main-fix-imports-autodocs-monorepo.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

If you're still encountering issues, we recommend reaching out to the maintainers using the default communication channels (e.g., [Discord server](https://discord.com/channels/486522875931656193/570426522528382976), [GitHub issues](https://github.com/storybookjs/storybook/issues)).

#### Learn more about Storybook documentation

- AutoDocs for creating documentation for your stories
- [MDX](./mdx.md) for customizing your documentation
- [Publishing docs](./build-documentation.md) to automate the process of publishing your documentation
