---
title: 'Snapshot tests'
---

Snapshot tests compare the rendered markup of every story against known baselines. It’s a way to identify markup changes that trigger rendering errors and warnings.

Storybook is a helpful tool for snapshot testing because every story is essentially a test specification. Any time you write or update a story, you get a snapshot test for free.

![Example Snapshot test](./snapshot-test.png)

## Migrating Tests

The Storyshots addon was the original testing solution for Storybook, offering a highly extensible API and a wide range of configuration options for testing. However, it was difficult to set up and maintain, and it needed to be compatible with the latest version of Storybook, which introduced some significant architectural changes. As a result, Storyhots is now officially deprecated, is no longer being maintained, and will be removed in the next major release of Storybook. We recommend following the migration guide we've prepared to help you during this transition period.

### Prerequisites

Before you begin the migration process, ensure that you have:

- A fully functional Storybook configured with one of the [suppported frameworks](../configure/frameworks.md) running the latest stable version (i.e., 7.6 or higher).
- Familiarity with your current Storybook and its testing setup.

### With the test-runner

Storybook test-runner turns all of your stories into executable tests. Powered by [Jest](https://jestjs.io/) and [Playwright](https://playwright.dev/). It's a standalone, framework-agnostic utility that runs parallel to your Storybook. It enables you to run multiple testing patterns in a multi-browser environment, including interaction testing with the [play function](./interaction-testing.md), DOM snapshot, and [accessibility testing](./accessibility-testing.md).

#### Setup

To get started with the migration process from the Storyshots addon to the test-runner, we recommend that you remove the Storyshots addon and similar packages (i.e., `storybook/addon-storyshots-puppeteer` ) from your project, including any related configuration files. Then, follow the test-runner's [setup instructions](./test-runner#setup) to install, configure and run it.

#### Extend your test coverage

The Storyshots addon offered a highly customizable testing solution, allowing users to extend testing coverage in various ways. However, the test-runner provides a similar experience but with a different API. Below, you will find additional examples of using the test-runner to achieve similar results as those you achieved with Storyshots.

#### Enable DOM snapshot testing with the test-runner

To enable DOM snapshot testing with the test-runner, you can extend the test-runner's configuration file and use the available [hooks](./test-runner.md#test-hook-api) and combine them with Playwright's built-in [`APIs`](https://playwright.dev/docs/test-snapshots) API to generate DOM snapshots for each story in your project. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-dom-snapshot-testing.js.mdx',
    'common/test-runner-dom-snapshot-testing.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info" icon="💡">

If you've set up DOM snapshot tests in your project with the test-runner and enabled the [`index.json` mode](./test-runner#indexjson-mode) via CLI flag, tests are generated in a temporary folder, and snapshots get stored alongside them. You'll need to extend the test-runner's configuration and provide a custom snapshot resolver to allow a different location for the snapshots. See the [Troubleshooting](#the-test-runner-does-not-generate-snapshot-files-in-the-expected-directory) section for more information.

</Callout>

#### Run image snapshot tests with the test-runner

By default, the test-runner provides you with the option to run multiple testing patterns (e.g., DOM snapshot testing, [accessibility](./accessibility-testing.md#a11y-config-with-the-test-runner)) with a minimal configuration. However, if you want, you can extend it to run visual regression testing alongside your other tests. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-image-snapshot-testing.js.mdx',
    'common/test-runner-image-snapshot-testing.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<IfRenderer renderer={['react', 'vue' ]}>

### With Portable Stories

Storybook provides a `composeStories` utility that helps convert stories from a story file into renderable elements that can be reused in your Node tests with JSDOM. It also allows you to apply other Storybook features that you have enabled in your project (e.g., [decorators](../writing-stories/decorators.md), [args](../writing-stories/args.md)), which allows your component to render correctly. This is what is known as portable stories.

#### Setup

We recommend you turn off your current storyshots tests to start the migration process. To do this, rename the configuration file (i.e., `storybook.test.ts|js` or similar) to `storybook.test.ts|js.old`. This will prevent the tests from being detected, as you'll create a new testing configuration file with the same name. By doing this, you'll be able to preserve your existing tests while transitioning to portable stories before removing the Storyshots addon from your project.

#### Import project-level annotations from Storybook

If you need project-level annotations (e.g., [decorators](../writing-stories/decorators.md), [args](../writing-stories/args.md), styles) enabled in your `./storybook/preview.js|ts` included in your tests, adjust your test set up file to import the annotations as follows:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/portable-stories-import-annotations.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info" icon="ℹ️">

If you're using Vue3, you must install the [`@storybook/testing-vue3`](https://storybook.js.org/addons/@storybook/testing-vue3) package to use the `setProjectAnnotations` API in your setup file and the `composeStories` API in your existing tests.

</Callout>

#### Configure the testing framework for portable stories

To help you migrate from Storyshots addon to Storybook's portable stories with the `composeStories` helper API, we've prepared examples to help you get started. Listed below are examples of two of the most popular testing frameworks: [Jest](https://jestjs.io/) and [Vitest](https://vitest.dev/). We recommend placing the code in a newly created `storybook.test.ts|js` file and adjusting the code accordingly, depending on your testing framework. Both examples below will:

- Import all story files based on a glob pattern
- Iterate over these files and use `composeStories` on each of their modules, resulting in a list of renderable components from each story
- Cycle through the stories, render them, and snapshot them

#### Vitest

If you're using [Vitest](https://vitest.dev/) as your testing framework, you can begin migrating your snapshot tests to Storybook's portable stories with the `composeStories` helper API by referring to the following example. You will need to modify the code in your `storybook.test.ts|js` file as follows:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/portable-stories-vitest-snapshot-test.js.mdx',
    'common/portable-stories-vitest-snapshot-test.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

When your test is executed with Vitest, it will generate a single snapshot file (i.e., `storybook.test.ts|js.snap`) with all the stories in your project. However, if you want to generate individual snapshot files, you can use Vitest's [`toMatchFileSnapshot`](https://vitest.dev/guide/snapshot.html#file-snapshots) API. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/portable-stories-vitest-multi-snapshot-test.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

#### Jest

If you're using Jest as your testing framework, you can begin migrating your snapshot tests to Storybook's portable stories with the `composeStories` helper API by referring to the following example. You will need to modify the code in your `storybook.test.ts|js` file as follows:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/portable-stories-jest-snapshot-test.js.mdx',
    'common/portable-stories-jest-snapshot-test.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

When your test is executed with Jest, it will generate a single snapshot file (i.e., `__snapshots__/storybook.test.ts|js.snap`) with all the stories in your project. However, if you want to generate individual snapshot files, you can use the [`jest-specific-snapshot`](https://github.com/igor-dv/jest-specific-snapshot) package. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/portable-stories-jest-multi-snapshot-test.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

#### Known limitations

If you opt to use portable stories in your tests, you'll have a single test file that can run in a JSDOM environment, rendering and snapshotting all your stories. However, as your project grows, you may run into the limitations you had with Storyshots previously:

- You are not testing against a real browser.
- You must mock many browser utilities (e.g., canvas, window APIs, etc).
- Your debugging experience will not be as good, given you can't access the browser as part of your tests.

Alternatively, you may want to consider migrating to the other available option for snapshot testing with Storybook: the [test-runner](#with-the-test-runner) for a more robust solution that runs tests against a real browser environment with [Playwright](https://playwright.dev/).

</IfRenderer>

## Set up Storyshots

(⛔️ Deprecated)

[Storyshots](https://storybook.js.org/addons/@storybook/addon-storyshots/) is a Storybook addon that enables snapshot testing, powered by [Jest](https://jestjs.io/docs/getting-started).

Run the following command to install Storyshots:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-addon-storyshots-install.yarn.js.mdx',
    'common/storybook-addon-storyshots-install.npm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="warning">

The Storyshots addon has been deprecated and will be removed in a future release of Storybook. See the [migration guide](#migrating-tests) for more information.

</Callout>

Add a test file to your environment with the following contents to configure Storyshots:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-storyshots-config.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info" icon="💡">

You can name the test file differently to suit your needs. Bear in mind that it requires to be picked up by Jest.

</Callout>

Run your first test. Storyshots will recognize your stories (based on [.storybook/main.js's setup](https://storybook.js.org/docs/react/configure/story-rendering)) and save them in the **snapshots** directory.

```shell
npm test storybook.test.js
```

![Successful snapshot tests](./storyshots-pass.png)

When you make changes to your components or stories, rerun the test to identify the changes to the rendered markup.

![Failing snapshots](./storyshots-fail.png)

If they're intentional, accept them as new baselines. If the changes are bugs, fix the underlying code, then rerun the snapshot tests.

### Configure the snapshot's directory

If your project has a custom setup for snapshot testing, you'll need to take additional steps to run Storyshots. You'll need to install both [@storybook/addon-storyshots-puppeteer](https://storybook.js.org/addons/@storybook/addon-storyshots-puppeteer) and [puppeteer](https://github.com/puppeteer/puppeteer):

```shell
# With npm
npm i -D @storybook/addon-storyshots-puppeteer puppeteer

# With yarn
yarn add @storybook/addon-storyshots-puppeteer puppeteer
```

Next, update your test file (for example, `storybook.test.js`) to the following:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-storyshots-custom-directory.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info" icon="💡">

Don't forget to replace your-custom-directory with your own.

</Callout>

When you run your tests, the snapshots will be available in your specified directory.

### Framework configuration

By default, Storyshots detects your project's framework. If you encounter a situation where this is not the case, you can adjust the configuration object and specify your framework. For example, if you wanted to configure the addon for a Vue 3 project:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-storyshots-custom-framework.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

These are the frameworks currently supported by Storyshots: `angular`, `html`, `preact`, `react`, `react-native`, `svelte`, `vue`, `vue3`, and `web-components`.

### Additional customization

Storyshots is highly customizable and includes options for various advanced use cases. You can read more in the [addon’s documentation](https://github.com/storybookjs/storybook/tree/master/addons/storyshots/storyshots-core#options).

---

## Troubleshooting

As running snapshot tests with Storybook and the test-runner can lead to some technical limitations that may prevent you from setting up or running your tests successfully, we've prepared a set of instructions to help you troubleshoot any issues you may encounter.

### The test-runner reports an error when running snapshot tests

If you're experiencing intermittent test failures with the test-runner, uncaught errors may occur when your tests run in the browser. These errors might not have been caught if you were using the Storyshots addons previously. The test-runner will, by default, consider these uncaught errors as failed tests. However, if these errors are expected, you can ignore them by enabling custom story tags in your stories and test-runner configuration files. For more information, please refer to the [test-runner documentation](./test-runner.md#experimental-filter-tests).

### The test-runner does not generate snapshot files in the expected directory

If you've configured the test-runner to run snapshot tests, you may notice that the paths and names of the snapshot files differ from those previously generated by the Storyshots addon. This is because the test-runner uses a different naming convention for snapshot files. Using a custom snapshot resolver, you can configure the test-runner to use the same naming convention you used previously.

Run the following command to generate a custom configuration file for the test-runner that you can use to configure Jest:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-eject-config.yarn.js.mdx',
    'common/test-runner-eject-config.npm.js.mdx',
    'common/test-runner-eject-config.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Update the file and enable the `snapshotResolver` option to use a custom snapshot resolver:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-config-snapshot-resolver.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Finally, create a `snapshot-resolver.js` file to implement a custom snapshot resolver:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-custom-snapshot-resolver.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### The format of the snapshot files is different from the ones generated by the Storyshots addon

By default, the test-runner uses [`jest-serializer-html`](https://github.com/algolia/jest-serializer-html) to serialize HTML snapshots. This may cause differences in formatting compared to your existing snapshots, even if you're using specific CSS-in-JS libraries like [Emotion](https://emotion.sh/docs/introduction) or Angular's `ng` attributes. However, you can configure the test-runner to use a custom snapshot serializer to solve this issue.

Run the following command to generate a custom configuration file for the test-runner that you can use to provide additional configuration options.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-eject-config.yarn.js.mdx',
    'common/test-runner-eject-config.npm.js.mdx',
    'common/test-runner-eject-config.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Update the file and enable the `snapshotSerializers` option to use a custom snapshot resolver. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-config-serializer.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Finally, create a `snapshot-serializer.js` file to implement a custom snapshot serializer:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-custom-snapshot-serializer.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

---

#### What’s the difference between snapshot tests and visual tests?

Visual tests capture images of stories and compare them against image baselines. Snapshot tests take DOM snapshots and compare them against DOM baselines. Visual tests are better suited for verifying appearance. Snapshot tests are useful for smoke testing and ensuring the DOM doesn’t change.

#### Learn about other UI tests

- [Test runner](./test-runner.md) to automate test execution
- [Visual tests](./visual-testing.md) for appearance
- [Accessibility tests](./accessibility-testing.md) for accessibility
- [Interaction tests](./interaction-testing.md) for user behavior simulation
- [Coverage tests](./test-coverage.md) for measuring code coverage
- Snapshot tests for rendering errors and warnings
- [End-to-end tests](./stories-in-end-to-end-tests.md) for simulating real user scenarios
- [Unit tests](./stories-in-unit-tests.md) for functionality
