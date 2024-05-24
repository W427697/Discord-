---
title: 'Test runner'
---

Storybook test runner turns all of your stories into executable tests. It is powered by [Jest](https://jestjs.io/) and [Playwright](https://playwright.dev/).

- For those [without a play function](../writing-stories/index.md): it verifies whether the story renders without any errors.
- For those [with a play function](../writing-stories/play-function.md): it also checks for errors in the play function and that all assertions passed.

These tests run in a live browser and can be executed via the [command line](#cli-options) or your [CI server](#set-up-ci-to-run-tests).

## Setup

The test-runner is a standalone, framework-agnostic utility that runs parallel to your Storybook. You will need to take some additional steps to set it up properly. Detailed below is our recommendation to configure and execute it.

Run the following command to install it.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-install.yarn.js.mdx',
    'common/test-runner-install.npm.js.mdx',
    'common/test-runner-install.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Update your `package.json` scripts and enable the test runner.

```json
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

Start your Storybook with:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/storybook-run-dev.with-builder.js.mdx',
    'common/storybook-run-dev.yarn.js.mdx',
    'common/storybook-run-dev.npm.js.mdx',
    'common/storybook-run-dev.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info" icon="💡">

Storybook's test runner requires either a locally running Storybook instance or a published Storybook to run all the existing tests.

</Callout>

Finally, open a new terminal window and run the test-runner with:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-execute.yarn.js.mdx',
    'common/test-runner-execute.npm.js.mdx',
    'common/test-runner-execute.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Configure

Test runner offers zero-config support for Storybook. However, you can run `test-storybook --eject` for more fine-grained control. It generates a `test-runner-jest.config.js` file at the root of your project, which you can modify. Additionally, you can extend the generated configuration file and provide [testEnvironmentOptions](https://github.com/playwright-community/jest-playwright#configuration) as the test runner also uses [jest-playwright](https://github.com/playwright-community/jest-playwright) under the hood.

### CLI Options

The test-runner is powered by [Jest](https://jestjs.io/) and accepts a subset of its [CLI options](https://jestjs.io/docs/cli) (for example, `--watch`, `--maxWorkers`).
If you're already using any of those flags in your project, you should be able to migrate them into Storybook's test-runner without any issues. Listed below are all the available flags and examples of using them.

| Options                         | Description                                                                                                                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--help`                        | Output usage information <br/>`test-storybook --help`                                                                                                                                                   |
| `-s`, `--index-json`            | Run in index json mode. Automatically detected (requires a compatible Storybook) <br/>`test-storybook --index-json`                                                                                     |
| `--no-index-json`               | Disables index json mode <br/>`test-storybook --no-index-json`                                                                                                                                          |
| `-c`, `--config-dir [dir-name]` | Directory where to load Storybook configurations from <br/>`test-storybook -c .storybook`                                                                                                               |
| `--watch`                       | Run in watch mode <br/>`test-storybook --watch`                                                                                                                                                         |
| `--watchAll`                    | Watch files for changes and rerun all tests when something changes.<br/>`test-storybook --watchAll`                                                                                                     |
| `--coverage`                    | Runs [coverage tests](./test-coverage.md) on your stories and components <br/> `test-storybook --coverage`                                                                                              |
| `--coverageDirectory`           | Directory where to write coverage report output <br/>`test-storybook --coverage --coverageDirectory coverage/ui/storybook`                                                                              |
| `--url`                         | Define the URL to run tests in. Useful for custom Storybook URLs <br/>`test-storybook --url http://the-storybook-url-here.com`                                                                          |
| `--browsers`                    | Define browsers to run tests in. One or multiple of: chromium, firefox, webkit <br/>`test-storybook --browsers firefox chromium`                                                                        |
| `--maxWorkers [amount]`         | Specifies the maximum number of workers the worker-pool will spawn for running tests <br/>`test-storybook --maxWorkers=2`                                                                               |
| `--testTimeout [amount]`        | Defines the maximum time in milliseconds that a test can run before it is automatically marked as failed. Useful for long-running tests <br/> `test-storybook --testTimeout=60000`                      |
| `--no-cache`                    | Disable the cache <br/>`test-storybook --no-cache`                                                                                                                                                      |
| `--clearCache`                  | Deletes the Jest cache directory and then exits without running tests <br/>`test-storybook --clearCache`                                                                                                |
| `--verbose`                     | Display individual test results with the test suite hierarchy <br/>`test-storybook --verbose`                                                                                                           |
| `-u`, `--updateSnapshot`        | Use this flag to re-record every snapshot that fails during this test run <br/>`test-storybook -u`                                                                                                      |
| `--eject`                       | Creates a local configuration file to override defaults of the test-runner <br/>`test-storybook --eject`                                                                                                |
| `--json`                        | Prints the test results in JSON. This mode will send all other test output and user messages to stderr. <br/>`test-storybook --json`                                                                    |
| `--outputFile`                  | Write test results to a file when the --json option is also specified. <br/>`test-storybook --json --outputFile results.json`                                                                           |
| `--junit`                       | Indicates that test information should be reported in a junit file. <br/>`test-storybook --**junit**`                                                                                                   |
| `--ci`                          | Instead of the regular behavior of storing a new snapshot automatically, it will fail the test and require Jest to be run with `--updateSnapshot`. <br/>`test-storybook --ci`                           |
| `--shard [index/count]`         | Requires CI. Splits the test suite execution into multiple machines <br/> `test-storybook --shard=1/8`                                                                                                  |
| `--failOnConsole`               | Makes tests fail on browser console errors<br/>`test-storybook --failOnConsole`                                                                                                                         |
| `--includeTags`                 | Experimental feature <br/>Defines a subset of stories to be tested if they match the enabled [tags](#experimental-filter-tests). <br/>`test-storybook --includeTags="test-only, pages"`                 |
| `--excludeTags`                 | Experimental feature <br/>Prevents stories from being tested if they match the provided [tags](#experimental-filter-tests). <br/>`test-storybook --excludeTags="no-tests, tokens"`                      |
| `--skipTags`                    | Experimental feature <br/>Configures the test runner to skip running tests for stories that match the provided [tags](#experimental-filter-tests). <br/>`test-storybook --skipTags="skip-test, layout"` |

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-execute-with-flags.yarn.js.mdx',
    'common/test-runner-execute-with-flags.npm.js.mdx',
    'common/test-runner-execute-with-flags.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Run tests against a deployed Storybook

By default, the test-runner assumes that you're running it against a locally served Storybook on port `6006`. If you want to define a target URL to run against deployed Storybooks, you can use the `--url` flag or set the `TARGET_URL` environment variable. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-execute-with-url.yarn.js.mdx',
    'common/test-runner-execute-with-url.npm.js.mdx',
    'common/test-runner-execute-with-url.pnpm.js.mdx',
    'common/test-runner-execute-with-url.env-var.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Set up CI to run tests

You can also configure the test-runner to run tests on a CI environment. Documented below are some recipes to help you get started.

### Run against deployed Storybooks via Github Actions deployment

If you're publishing your Storybook with services such as [Vercel](https://vercel.com/) or [Netlify](https://docs.netlify.com/site-deploys/notifications/#github-commit-statuses), they emit a `deployment_status` event in GitHub Actions. You can use it and set the `deployment_status.target_url` as the `TARGET_URL` environment variable. Here's how:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-with-deploy-event-workflow.yml.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info" icon="💡">

The published Storybook must be publicly available for this example to work. We recommend running the test server using the recipe [below](#run-against-non-deployed-storybooks) if it requires authentication.

</Callout>

### Run against non-deployed Storybooks

You can use your CI provider (for example, [GitHub Actions](https://github.com/features/actions), [GitLab Pipelines](https://docs.gitlab.com/ee/ci/pipelines/), [CircleCI](https://circleci.com/)) to build and run the test runner against your built Storybook. Here's a recipe that relies on third-party libraries, that is to say, [concurrently](https://www.npmjs.com/package/concurrently), [http-server](https://www.npmjs.com/package/http-server), and [wait-on](https://www.npmjs.com/package/wait-on) to build Storybook and run tests with the test-runner.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-local-build-workflow.yml.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info" icon="💡">

By default, Storybook outputs the [build](../sharing/publish-storybook.md#build-storybook-as-a-static-web-application) to the `storybook-static` directory. If you're using a different build directory, you'll need to adjust the recipe accordingly.

</Callout>

### What's the difference between Chromatic and Test runner?

The test-runner is a generic testing tool that can run locally or on CI and be configured or extended to run all kinds of tests.

[Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) is a cloud-based service that runs [visual](./visual-testing.md) and [interaction tests](./interaction-testing.md) (and soon accessibility tests) without setting up the test runner. It also syncs with your git provider and manages access control for private projects.

However, you might want to pair the test runner and Chromatic in some cases.

- Use it locally and Chromatic on your CI.
- Use Chromatic for visual and interaction tests and run other custom tests using the test runner.

## Advanced configuration

### Test hook API

The test-runner renders a story and executes its [play function](../writing-stories/play-function.md) if one exists. However, certain behaviors are impossible to achieve via the play function, which executes in the browser. For example, if you want the test-runner to take visual snapshots for you, this is possible via Playwright/Jest but must be executed in Node.

The test-runner exports test hooks that can be overridden globally to enable use cases like visual or DOM snapshots. These hooks give you access to the test lifecycle _before_ and _after_ the story is rendered.
Listed below are the available hooks and an overview of how to use them.

| Hook        | Description                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `prepare`   | Prepares the browser for tests<br/>`async prepare({ page, browserContext, testRunnerConfig }) {}`               |
| `setup`     | Executes once before all the tests run<br/>`setup() {}`                                                         |
| `preVisit`  | Executes before a story is initially visited and rendered in the browser<br/>`async preVisit(page, context) {}` |
| `postVisit` | Executes after the story is visited and fully rendered<br/>`async postVisit(page, context) {}`                  |

<Callout variant="info" icon="💡">

These test hooks are experimental and may be subject to breaking changes. We encourage you to test as much as possible within the story's [play function](../writing-stories/play-function.md).

</Callout>

To enable the hooks API, you'll need to add a new configuration file inside your Storybook directory and set them up as follows:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-hooks-example.js.mdx',
    'common/test-runner-hooks-example.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info" icon="💡">

Except for the `setup` function, all other functions run asynchronously. Both `preVisit` and `postVisit` functions include two additional arguments, a [Playwright page](https://playwright.dev/docs/pages) and a context object which contains the `id`, `title`, and the `name` of the story.

</Callout>

When the test-runner executes, your existing tests will go through the following lifecycle:

- The `setup` function is executed before all the tests run.
- The context object is generated containing the required information.
- Playwright navigates to the story's page.
- The `preVisit` function is executed.
- The story is rendered, and any existing `play` functions are executed.
- The `postVisit` function is executed.

### (Experimental) Filter tests

When you run the test-runner on Storybook, it tests every story by default. However, if you want to filter the tests, you can use the `tags` configuration option. Storybook originally introduced this feature to generate [automatic documentation](../writing-docs/autodocs.md) for stories. But it can be further extended to configure the test-runner to run tests according to the provided tags using a similar configuration option or via CLI flags (e.g., `--includeTags`, `--excludeTags`, `--skipTags`), only available with the latest stable release (`0.15` or higher). Listed below are the available options and an overview of how to use them.

| Option    | Description                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| `exclude` | Prevents stories if they match the provided tags from being tested.           |
| `include` | Defines a subset of stories only to be tested if they match the enabled tags. |
| `skip`    | Skips testing on stories if they match the provided tags.                     |

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-tags-config.js.mdx',
    'common/test-runner-tags-config.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info" icon="ℹ️">

Running tests with the CLI flags takes precedence over the options provided in the configuration file and will override the available options in the configuration file.

</Callout>

#### Disabling tests

If you want to prevent specific stories from being tested by the test-runner, you can configure your story with a custom tag, enable it to the test-runner configuration file or run the test-runner with the `--excludeTags` [CLI](#cli-options) flag and exclude them from testing. This is helpful when you want to exclude stories that are not yet ready for testing or are irrelevant to your tests. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-component-exclude-tags.story.js.mdx',
    'common/my-component-exclude-tags.story.ts.mdx',
    'common/test-runner-tags-exclude.config.js.mdx',
    'common/test-runner-tags-exclude.config.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

#### Run tests for a subset of stories

To allow the test-runner only to run tests on a specific story or subset of stories, you can configure the story with a custom tag, enable it in the test-runner configuration file or run the test-runner with the `--includeTags` [CLI](#cli-options) flag and include them in your tests. For example, if you wanted to run tests based on the `test-only` tag, you can adjust your configuration as follows:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-component-include-tags.story.js.mdx',
    'common/my-component-include-tags.story.ts.mdx',
    'common/test-runner-tags-include.config.js.mdx',
    'common/test-runner-tags-include.config.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info" icon="ℹ️">

Applying tags for the component's stories should either be done at the component level (using `meta`) or at the story level. Importing tags across stories is not supported in Storybook and won't work as intended.

</Callout>

#### Skip tests

If you want to skip running tests on a particular story or subset of stories, you can configure your story with a custom tag, enable it in the test-runner configuration file, or run the test-runner with the `--skipTags` [CLI](#cli-options) flag. Running tests with this option will cause the test-runner to ignore and flag them accordingly in the test results, indicating that the tests are temporarily disabled. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-component-skip-tags.story.js.mdx',
    'common/my-component-skip-tags.story.ts.mdx',
    'common/test-runner-tags-skip.config.js.mdx',
    'common/test-runner-tags-skip.config.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Authentication for deployed Storybooks

If you use a secure hosting provider that requires authentication to host your Storybook, you may need to set HTTP headers. This is mainly because of how the test runner checks the status of the instance and the index of its stories through fetch requests and Playwright. To do this, you can modify the test-runner configuration file to include the `getHttpHeaders` function. This function takes the URL of the fetch calls and page visits as input and returns an object containing the headers that need to be set.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-auth.js.mdx',
    'common/test-runner-auth.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Helpers

The test-runner exports a few helpers that can be used to make your tests more readable and maintainable by accessing Storybook's internals (e.g., `args`, `parameters`). Listed below are the available helpers and an overview of how to use them.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-helper-function.js.mdx',
    'common/test-runner-helper-function.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

#### Accessing story information with the test-runner

If you need to access information about the story, such as its parameters, the test-runner includes a helper function named `getStoryContext` that you can use to retrieve it. You can then use it to customize your tests further as needed. For example, if you need to configure Playwright's page [viewport size](https://playwright.dev/docs/api/class-page#page-set-viewport-size) to use the viewport size defined in the story's parameters, you can do so as follows:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-custom-page-viewport.js.mdx',
    'common/test-runner-custom-page-viewport.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

#### Working with assets

If you're running a specific set of tests (e.g., image snapshot testing), the test-runner provides a helper function named `waitForPageReady` that you can use to ensure the page is fully loaded and ready before running the test. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-waitpageready.js.mdx',
    'common/test-runner-waitpageready.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Index.json mode

The test-runner transforms your story files into tests when testing a local Storybook. For a remote Storybook, it uses the Storybook's [index.json](../configure/index.md#feature-flags) (formerly `stories.json`) file (a static index of all the stories) to run the tests.

#### Why?

Suppose you run into a situation where the local and remote Storybooks appear out of sync, or you might not even have access to the code. In that case, the `index.json` file is guaranteed to be the most accurate representation of the deployed Storybook you are testing. To test a local Storybook using this feature, use the `--index-json` flag as follows:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-with-index-json.yarn.js.mdx',
    'common/test-runner-with-index-json.npm.js.mdx',
    'common/test-runner-with-index-json.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info" icon="💡">

The `index.json` mode is not compatible with the watch mode.

</Callout>

If you need to disable it, use the `--no-index-json` flag:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/test-runner-no-index-json.yarn.js.mdx',
    'common/test-runner-no-index-json.npm.js.mdx',
    'common/test-runner-no-index-json.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

#### How do I check if my Storybook has a `index.json` file?

Index.json mode requires a `index.json` file. Open a browser window and navigate to your deployed Storybook instance (for example, `https://your-storybook-url-here.com/index.json`). You should see a JSON file that starts with a `"v": 3` key, immediately followed by another key called "stories", which contains a map of story IDs to JSON objects. If that is the case, your Storybook supports [index.json mode](../configure/index.md#feature-flags).

---

## Troubleshooting

### The test runner seems flaky and keeps timing out

If your tests time out with the following message:

```shell
Timeout - Async callback was not invoked within the 15000 ms timeout specified by jest.setTimeout
```

It might be that Playwright couldn't handle testing the number of stories you have in your project. Perhaps you have a large number of stories, or your CI environment has a really low RAM configuration. In such cases, you should limit the number of workers that run in parallel by adjusting your command as follows:

```json
{
  "scripts": {
    "test-storybook:ci": "yarn test-storybook --maxWorkers=2"
  }
}
```

### The error output in the CLI is too short

By default, the test runner truncates error outputs at 1000 characters, and you can check the full output directly in Storybook in the browser. However, if you want to change that limit, you can do so by setting the `DEBUG_PRINT_LIMIT` environment variable to a number of your choosing, for example, `DEBUG_PRINT_LIMIT=5000 yarn test-storybook`.

### Run the test runner in other CI environments

As the test runner is based on Playwright, you might need to use specific docker images or other configurations depending on your CI setup. In that case, you can refer to the [Playwright CI docs](https://playwright.dev/docs/ci) for more information.

### Tests filtered by tags are incorrectly executed

If you've enabled filtering tests with tags and provided similar tags to the `include` and `exclude` lists, the test-runner will execute the tests based on the `exclude` list and ignore the `include` list. To avoid this, make sure the tags provided to the `include` and `exclude` lists differ.

### The test runner doesn't support Yarn PnP out of the box

If you've enabled the test-runner in a project running on a newer version of Yarn with Plug'n'Play (PnP) enabled, the test-runner might not work as expected and may generate the following error when running tests:

```shell
PlaywrightError: jest-playwright-preset: Cannot find playwright package to use chromium
```

This is due to the test-runner using the community-maintained package [jest-playwright-preset](https://github.com/playwright-community/jest-playwright) that still needs to support this feature. To solve this, you can either switch the [`nodeLinker`](https://yarnpkg.com/features/linkers) setting to `node-modules` or install Playwright as a direct dependency in your project, followed by adding the browser binaries via the [`install`](https://playwright.dev/docs/browsers#install-browsers) command.

**Learn about other UI tests**

- Test runner to automate test execution
- [Visual tests](./visual-testing.md) for appearance
- [Accessibility tests](./accessibility-testing.md) for accessibility
- [Interaction tests](./interaction-testing.md) for user behavior simulation
- [Coverage tests](./test-coverage.md) for measuring code coverage
- [Snapshot tests](./snapshot-testing.md) for rendering errors and warnings
- [End-to-end tests](./stories-in-end-to-end-tests.md) for simulating real user scenarios
- [Unit tests](./stories-in-unit-tests.md) for functionality
