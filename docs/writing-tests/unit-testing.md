---
title: 'Unit tests'
---

Teams test a variety of UI characteristics using different tools. Each tool requires you to replicate the same component state over and over. That’s a maintenance headache. Ideally, you’d set up your tests in the same way and reuse that across tools.

Storybook enables you to isolate a component and capture its use cases in a `*.stories.js|ts` file. Stories are standard JavaScript modules cross-compatible with the whole JavaScript ecosystem—no API lock-in.

Stories are a practical starting point for UI testing. Import stories into tools like [Jest](https://jestjs.io/), [Testing Library](https://testing-library.com/), [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/), to save time and maintenance work.

<IfRenderer renderer='vue'>

## Set up the testing addon

Write introduction here.

Run the following command to add Storybook's testing addon to your environment:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'vue/storybook-testing-library-install.yarn.js.mdx',
    'vue/storybook-testing-library-install.npm.js.mdx',
    'vue/storybook-testing-library-install.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

ℹ️ If you're using Storybook 7 or higher, the `@storybook/testing-vue3` addon is the only one we support. For Vue 2 users, refer to the [troubleshooting section](#troubleshooting) for additional guidance.

</div>

</IfRenderer>

## Write a test with Testing Library

[Testing Library](https://testing-library.com/) is a suite of helper libraries for browser-based interaction tests. With [Component Story Format](../api/csf.md), your stories are reusable with Testing Library. Each named export (story) is renderable within your testing setup. For example, if you were working on a login component and wanted to test the invalid credentials scenario, here's how you could write your test:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/component-test-with-testing-library.js.mdx',
    'react/component-test-with-testing-library.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

💡 You can use Testing Library out-of-the-box with [Storybook Interaction Testing](./interaction-testing.md).

</div>

Once the test runs, it loads the story and renders it. [Testing Library](https://testing-library.com/) then emulates the user's behavior and checks if the component state has been updated.

## Configure

By default, Storybook offers a zero-config setup for React and other frameworks via addons, allowing you to run your stories as tests with Testing Library. However, adding a configuration file can extend your test setup and include additional global [decorators](../writing-stories/decorators.md#global-decorators), [parameters](../writing-stories/parameters.md#global-parameters), and other features. To do so, create a `setup.js|ts` file as follows:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/storybook-testing-addon-optional-config.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Update your test script to include the configuration file:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/storybook-testing-addon-optional-config-scripts.json.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Override story properties

By default, the `setProjectAnnotations` function injects into your existing tests any global configuration you've defined in your Storybook instance (i.e., parameters, decorators in the `preview.js|ts` file). Nevertheless, this may cause unforeseen side effects for tests that are not intended to use these global configurations. To avoid this, you can override the global configurations by extending either the `composeStory` or `composeStories` functions to provide test-specific configurations. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/override-compose-story-test.compose-story.js.mdx',
    'react/override-compose-story-test.compose-story.ts.mdx',
    'react/override-compose-story-test.compose-stories.js.mdx',
    'react/override-compose-story-test.compose-stories.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Run tests on a single story

You can use the `composeStory` function from the appropriate framework or supported addon to allow your tests to run on a single story. However, if you're relying on this method, we recommend that you supply the story metadata (e.g., the [default export](../writing-stories/introduction.md#default-export)) to the `composeStory` function. This ensures that your tests can accurately determine the correct information about the story. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/single-story-test.js.mdx',
    'react/single-story-test.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Combine stories into a single test

If you intend to test multiple stories in a single test, use the `composeStories` function from the appropriate framework or supported addon. The function will process every component story you've specified, including any [`args`](../writing-stories/args.md) or [`decorators`](../writing-stories/decorators.md) you've defined. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/multiple-stories-test.js.mdx',
    'react/multiple-stories-test.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Troubleshooting

### Run tests in other frameworks

Storybook provides community-led addons for other frameworks like [Vue 2](https://storybook.js.org/addons/@storybook/testing-vue) and [Angular](https://storybook.js.org/addons/@storybook/testing-angular). However, these addons still lack support for the latest stable Storybook release. If you're interested in helping out, we recommend reaching out to the maintainers using the default communication channels (GitHub and [Discord server](https://discord.com/channels/486522875931656193/839297503446695956)).

### The args are not being passed to the test

The components returned by `composeStories` or `composeStory` not only can be rendered as React components but also come with the combined properties from the story, meta, and global configuration. This means that if you want to access args or parameters, for instance, you can do so:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/reuse-args-test.js.mdx',
    'react/reuse-args-test.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

#### Learn about other UI tests

- [Test runner](./test-runner.md) to automate test execution
- [Visual tests](./visual-testing.md) for appearance
- [Accessibility tests](./accessibility-testing.md) for accessibility
- [Interaction tests](./interaction-testing.md) for user behavior simulation
- [Coverage tests](./test-coverage.md) for measuring code coverage
- [Snapshot tests](./snapshot-testing.md) for rendering errors and warnings
- [End-to-end tests](./end-to-end-testing.md) for simulating real user scenarios
- Unit tests for functionality
