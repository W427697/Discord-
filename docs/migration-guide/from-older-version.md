---
title: 'Migration guide from Storybook 6.x to 8.0'
---

Storybook 8 focuses on performance and stability.

- 💨 [2-4x faster test builds](/blog/optimize-storybook-7-6/#2-4x-faster-builds-with-thetest-flag), [25-50% faster React docgen](/blog/optimize-storybook-7-6/#22x-faster-react-docgen), and [SWC support for Webpack projects](/blog/optimize-storybook-7-6/#using-webpack-enable-swc)
- ✨ Improved framework support: you no longer need to install React as a peer dependency when using a non-React renderer
- 🌐 [Support for React Server Components (RSC)](/blog/storybook-react-server-components/): our experimental solution renders async RSC in the browser and mocks Node code
- ➕ Much, much more

This guide is meant to help you **upgrade from Storybook 6.x to 8.0** successfully!

## Major breaking changes

The rest of this guide will help you upgrade successfully, either automatically or manually. But first, we’ve accumulated a lot of breaking changes in both [Storybook 7](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#70-breaking-changes) and [Storybook 8](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#from-version-7x-to-800). Here are the most impactful changes you should know about before you go further:

- [`framework` field is now mandatory](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#new-framework-api)
- [Start and build CLI binaries removed](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#start-storybook--build-storybook-binaries-removed)
- [`storiesOf` API has been removed](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#removal-of-storiesof-api)
- [`*.stories.mdx` format has been removed](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#dropping-support-for-storiesmdx-csf-in-mdx-format-and-mdx1-support)
- [Implicit actions (from `argTypesRegex`) can no longer be used during rendering (e.g. in a play function)](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#implicit-actions-can-not-be-used-during-rendering-for-example-in-the-play-function)
- [`react-docgen` (instead of `react-docgen-typescript`) is the default for component analysis](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#react-docgen-component-analysis-by-default)
- [Storyshots has been removed](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#storyshots-has-been-removed)
- [Addons API introduced in Storybook 7 is now required](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#new-addons-api)
- Ecosystem updates
  - [Webpack4 support discontinued](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#webpack4-support-discontinued)
  - [IE11 support discontinued](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#modern-browser-support)
  - [Node 18+ is now required](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#dropping-support-for-nodejs-16)
  - [Next.js 13.5+ is now required](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#require-nextjs-135-and-up)
  - [Vue 3+ is now required](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#require-vue-3-and-up)
  - [Angular 15+ is now required](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#require-angular-15-and-up)
  - [Svelte 4+ is now required](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#require-svelte-4-and-up)
  - [Yarn 1 is no longer supported](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#dropping-support-for-yarn-1)

If any of these changes apply to your project, please read through the linked migration notes before continuing.

If any of these new requirements or changes are blockers for your project, we recommend [migrating to Storybook 7](../../release-7-6/docs/migration-guide).

You may wish to read the full migration notes for [Storybook 6 to 7](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#from-version-65x-to-700) and [Storybook 7 to 8](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#from-version-7x-to-800) before migrating. Or you can follow the instructions below and we’ll try to take care of everything for you!

## Automatic upgrade

To upgrade your Storybook:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-upgrade.npm.js.mdx',
    'common/storybook-upgrade.pnpm.js.mdx',
    'common/storybook-upgrade.yarn.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

This will:

1. Determine that none of the [breaking changes](#major-breaking-changes) apply to your project
   - If they do, you will receive instructions on how to resolve them before continuing
2. Upgrade your Storybook dependencies to the latest version
3. Run a collection of _automigrations_, which will:
   - Check for common upgrade tasks
   - Explain the necessary changes with links to more information
   - Ask for approval, then perform the task on your behalf

## Manual migrations

In addition to the automated upgrades above, there are manual migrations that might be required to get Storybook 8 working in your project. We’ve tried to minimize this list to make it easier to upgrade. These include:

### Upgrade MDX1 to MDX3

Storybook 8 uses MDX3 by default for rendering [docs](./writing-docs/index.md). The upgrade from MDX1 to MDX3 is not fully automated, due to the large number of changes between versions (particularly v1 to v2). Fortunately, we have some tips to help make it a lot easier.

#### Automatically detect MDX2 errors with a CLI tool

If your project contains MDX files, run the following command before starting up Storybook:

```sh
npx @hipster/mdx2-issue-checker
```

This will go through every MDX file in the current working directory, and show you which files have errors:

![Terminal output of mdx2-issue-checker, showing errors found](./assets/mdx2-issue-checker-errors.png)

#### Fix MDX2 errors iteratively

The CLI only shows the first error per file, so you might need to run the checker iteratively. One way to streamline this process if you use VS Code is to:

1. Install the [MDX VS Code extension](https://marketplace.visualstudio.com/items?itemName=unifiedjs.vscode-mdx)
2. Enable experimental IntelliSense support for MDX files in your user settings: `"mdx.experimentalLanguageServer": true`

This shows the errors visually in your editor, which speeds things up a lot. Here's what it looks like to fix multiple errors in a file using the extension:

![MDX errors showing in VS Code](./assets/mdx-vs-code-extension-errors.gif)

### `storiesOf` to CSF

Storybook architecture focuses on performance and now needs statically analyzable code. For that reason, it does not work with `storiesOf`. We provide a codemod which, in most cases, should automatically make the code changes for you (make sure to update the glob to fit your files):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-migrate-stories-of-to-csf.npm.js.mdx',
    'common/storybook-migrate-stories-of-to-csf.pnpm.js.mdx',
    'common/storybook-migrate-stories-of-to-csf.yarn.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

This will transform your stories into [CSF 1](/blog/component-story-format/) stories, which are story functions that don't accept [args](../writing-stories/args.md). These are fully supported in Storybook 8, and will continue to be for the foreseeable future.

However, we recommend [writing all **new** stories in CSF 3](../writing-stories/index.md), which are story objects that are easier to write, reuse, and maintain.

### `storiesOf` to dynamically created stories

If you are using `storiesOf` for its ability to create stories dynamically, you can build your own "storiesOf" implementation by leveraging the new [(experimental) indexer API](../api/main-config-indexers). A proof of concept of such an implementation can be seen in [this StackBlitz demo](https://stackblitz.com/edit/github-h2rgfk?file=README.md). See the demo's README.md for a deeper explanation of the implementation.

## Troubleshooting

The automatic upgrade should get your Storybook into a working state. If you encounter an error running Storybook after upgrading, here’s what to do:

1. Try running the [`doctor` command](../api/cli-options.md#doctor) to check for common issues (such as duplicate dependencies, incompatible addons, or mismatched versions) and see suggestions for fixing them.
2. If you’re running `storybook` with the `dev` command, try using the `build` command instead. Sometimes `build` errors are more legible than `dev` errors!
3. Check [the full migration notes](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#from-version-7x-to-800), which contains an exhaustive list of noteworthy changes in Storybook 8. Many of these are already handled by automigrations when you upgrade, but not all are. It’s also possible that you’re experiencing a corner case that we’re not aware of.
4. Search [Storybook issues on GitHub](https://github.com/storybookjs/storybook/issues). If you’re seeing a problem, there’s a good chance other people are too. If so, upvote the issue, try out any workarounds described in the comments, and comment back if you have useful info to contribute.
5. If there’s no existing issue, you can [file one](https://github.com/storybookjs/storybook/issues/new/choose), ideally with a reproduction attached. We’ll be on top of Storybook 8 issues as we’re stabilizing the release.

If you prefer to debug yourself, here are a few useful things you can do to help narrow down the problem:

1. Try removing all addons that are not in the `@storybook` npm namespace (make sure you don't remove the `storybook` package). Community addons that work well with 7.x might not yet be compatible with 8.0, and this is the fastest way to isolate that possibility. If you find an addon that needs to be upgraded to work with Storybook 8, please post an issue on the addon’s repository, or better yet, a PR to upgrade it!
2. Another debugging technique is to bisect to older prerelease versions of Storybook to figure out which release broke your Storybook. For example, assuming that the current prerelease of Storybook is `8.0.0-beta.56`, you could set the version to `8.0.0-alpha.0` in your `package.json` and reinstall to verify that it still works (`alpha.0` should be nearly identical to `7.6.x`). If it works, you could then try `8.0.0-beta.0`, then `8.0.0-beta.28` and so forth. Once you’ve isolated the bad release, read through its [CHANGELOG](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md) entry and perhaps there’s a change that jumps out as the culprit. If you find the problem, please submit an issue or PR to the Storybook repo and we’ll do our best to take care of it quickly.

## Optional migrations

In addition to the automigrations and manual migrations above, there are also optional migrations that you should consider. These are things that we’ve deprecated in Storybook 8 (but remain backwards compatible), or best practices that should help you be more productive in the future.

These include:

### CSF 2 to CSF 3

There are [many good reasons](/blog/storybook-csf3-is-here/) to convert your stories from CSF 2 to CSF 3. We provide a codemod which, in most cases, should automatically make the code changes for you (make sure to update the glob to fit your files):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-migrate-csf-2-to-3.npm.js.mdx',
    'common/storybook-migrate-csf-2-to-3.pnpm.js.mdx',
    'common/storybook-migrate-csf-2-to-3.yarn.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->
