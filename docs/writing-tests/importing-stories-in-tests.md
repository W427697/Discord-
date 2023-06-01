---
title: 'Import stories in tests'
---

Teams test a variety of UI characteristics using different tools. Each tool requires you to replicate the same component state over and over. That’s a maintenance headache. Ideally, you’d set up your tests in the same way and reuse that across tools.

Storybook enables you to isolate a component and capture all of its use cases in a `*.stories.js` file. Stories are standard JavaScript modules so they’re cross compatible with the whole JavaScript ecosystem. No API lock-in.

Stories are a practical starting point for UI testing. Import stories into tools like [Jest](https://jestjs.io/), [Testing Library](https://testing-library.com/), [Puppeteer](https://pptr.dev/), [Cypress](https://www.cypress.io/), and [Playwright](https://playwright.dev/) to save time and maintenance work.

## Setup the testing addon for your framework

Storybook has test addons for core frameworks React, Vue (2,3), and Angular. This allows you to reuse stories along with all of their mocks, dependencies, and context.

<!-- - [@storybook/testing-react](https://storybook.js.org/addons/@storybook/testing-react)
- [@storybook/testing-vue](https://storybook.js.org/addons/@storybook/testing-vue)
- [@storybook/testing-vue3](https://storybook.js.org/addons/@storybook/testing-vue3)
- [@storybook/testing-angular](https://storybook.js.org/addons/@storybook/testing-angular) -->

### Install the addon

Run the following command to add Storybook's testing addon into your environment:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-testing-addon-install.yarn.js.mdx',
    'common/storybook-testing-addon-install.npm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Optional configuration

If you've set up global decorators or parameters and you need to use them in your tests, add the following to your test configuration file:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/storybook-testing-addon-optional-config.js.mdx',
    'vue/storybook-testing-addon-optional-config.2.js.mdx',
    'vue/storybook-testing-addon-optional-config.3.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Update your test script to include the configuration file:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/storybook-testing-addon-optional-config-scripts.json.mdx',
    'vue/storybook-testing-addon-optional-config-scripts.json.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Write a test with Testing Library

[Testing Library](https://testing-library.com/) is a suite of helper libraries for browser-based interaction tests. With [Component Story Format](../api/csf.md), your stories are reusable with Testing Library. Each named export (story) is renderable within your testing setup.

For example, if you were working on a login component and wanted to test the invalid credentials scenario, here's how you could write your test:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/component-test-with-testing-library.js.mdx',
    'react/component-test-with-testing-library.ts.mdx',
    'vue/component-test-with-testing-library.js.mdx',
    'angular/component-test-with-testing-library.ts.mdx',
    'svelte/component-test-with-testing-library.js.mdx',
    'preact/component-test-with-testing-library.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

💡 You can use Testing Library out-of-the-box with [Storybook Interaction Testing](./interaction-testing.md).

</div>

Once the test runs, it loads the story and renders it. [Testing Library](https://testing-library.com/) then emulates the user's behavior and checks if the component state has updated.

### Configure

By default, Storybook offers a zero-config setup for React allowing you to run your stories as tests with Testing Library. However you can extend your test setup and include additional global decorators, parameters and other features by adding a cpmfiguration file. To do so, create a `setup.js|ts` file as follows:

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

### Run tests on a single story

To allow your tests to run on a single story, you can use the `composeStory` function from the appropriate framework or supported addon. However if you're relying on this method, we recommend that you supply the story metadata (e.g., the [`default export](../writing-stories/introduction.md#default-export)) to the `composeStory` function. This ensures that your tests are able to accurately determine correct information about the story. For example:

<!-- prettier-ignore-start -->
```js
// example goes here
```

<!-- prettier-ignore-end -->

### Combine stories into a single test

If you intend to test multiple stories in a single test, you can use the `composeStories` function from the appropriate framework or supported addon. The function will process every component story you've specified, including any [`args`](../writing-stories/args.md) or [`decorators`](../writing-stories/decorators.md) you've defined. For example:

<!-- prettier-ignore-start -->
```js
// example goes here
```

<!-- prettier-ignore-end -->

## End-to-end testing with Storybook

Storybook seamlessly integrates with additional testing frameworks like Cypress and Playwright to provide a comprehensive testing solution. By leveraging the Component Story Format (CSF), developers can write test cases that simulate user interactions and verify the behavior of individual components within the Storybook environment. This approach enables developers to thoroughly test their components' functionality, responsiveness, and visual appearance across different scenarios, resulting in more robust and reliable applications.

### With Cypress

[Cypress](https://www.cypress.io/) is an end-to-end testing framework. It enables you to test a complete instance of your application by simulating user behavior. With Component Story Format, your stories are reusable with Cypress. Each named export (in other words, a story) is renderable within your testing setup.

An example of an end-to-end test with Cypress and Storybook is testing a login component for the correct inputs. For example, if you had the following story:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/login-form-with-play-function.js.mdx',
    'react/login-form-with-play-function.ts.mdx',
    'angular/login-form-with-play-function.ts.mdx',
    'vue/login-form-with-play-function.js.mdx',
    'vue/login-form-with-play-function.ts.mdx',
    'web-components/login-form-with-play-function.js.mdx',
    'web-components/login-form-with-play-function.ts.mdx',
    'svelte/login-form-with-play-function.js.mdx',
  ]}
  usesCsf3
  csf2Path="writing-tests/importing-stories-in-tests#snippet-login-form-with-play-function"
/>

<!-- prettier-ignore-end -->

<div class="aside">
 💡 The play function contains small snippets of code that run after the story renders. It allows you to sequence interactions in stories.

</div>

With Cypress, you could write the following test:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/component-cypress-test.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

When Cypress runs your test, it loads Storybook's isolated iframe and checks if the inputs match the test values.

![Cypress running successfully](./cypress-success-run-tests-optimized.png)

### With Playwright

[Playwright](https://playwright.dev/) is a browser automation tool and end-to-end testing framework from Microsoft. It offers cross-browser automation, mobile testing with device emulation, and headless testing. With Component Story Format, your stories are reusable with Playwright. Each named export (in other words, a story) is renderable within your testing setup.

A real-life scenario of user flow testing with Playwright would be how to test a login form for validity. For example, if you had the following story already created:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/login-form-with-play-function.js.mdx',
    'react/login-form-with-play-function.ts.mdx',
    'angular/login-form-with-play-function.ts.mdx',
    'vue/login-form-with-play-function.js.mdx',
    'vue/login-form-with-play-function.ts.mdx',
    'web-components/login-form-with-play-function.js.mdx',
    'web-components/login-form-with-play-function.ts.mdx',
    'svelte/login-form-with-play-function.js.mdx',
  ]}
  usesCsf3
  csf2Path="writing-tests/importing-stories-in-tests#snippet-login-form-with-play-function"
/>

<!-- prettier-ignore-end -->

<div class="aside">
 💡 The play function contains small snippets of code that run after the story renders. It allows you to sequence interactions in stories.
</div>

With Playwright, you can write a test to check if the inputs are filled and match the story:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/component-playwright-test.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Once you execute Playwright, it opens a new browser window, loads Storybook's isolated iframe, asserts if the inputs contain the specified values, and displays the test results in the terminal.

---

## Troubleshooting

### Run tests in other frameworks

Storybook provides community led addons for other frameworks like [Vue 2](https://storybook.js.org/addons/@storybook/testing-vue), [Vue 3](https://storybook.js.org/addons/@storybook/testing-vue3) and [Angular](https://storybook.js.org/addons/@storybook/testing-angular). However these addons are still lacking support for the latest stable Storybook release. If you're interested in helping out, we recommend reaching out to the maintainers using the default communication channels (GitHub and [Discord server](https://discord.com/channels/486522875931656193/839297503446695956)).

#### Learn about other UI tests

- [Test runner](./test-runner.md) to automate test execution
- [Visual tests](./visual-testing.md) for appearance
- [Accessibility tests](./accessibility-testing.md) for accessibility
- [Interaction tests](./interaction-testing.md) for user behavior simulation
- [Coverage tests](./test-coverage.md) for measuring code coverage
- [Snapshot tests](./snapshot-testing.md) for rendering errors and warnings
- Import stories in other tests for other tools
