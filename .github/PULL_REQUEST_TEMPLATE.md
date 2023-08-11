<!--

Thank you for contributing to Storybook! Please submit all PRs to the `next` branch unless they are specific to the current release. Storybook maintainers cherry-pick bug and documentation fixes into the `main` branch as part of the release process, so you shouldn't need to worry about this. For additional guidance: https://storybook.js.org/docs/react/contribute/how-to-contribute

-->

## What I did

<!-- Briefly describe what your PR does -->

<!-- If your PR is related to an issue, provide the number(s) below; if it resolves multiple issues, be sure to break them up (e.g. "closes #1000, closes #1001"). -->

Closes #

## Checklist for Contributors

### Testing

<!-- Please check (put an "x" inside the "[ ]") the applicable items below to communicate how to test your changes -->

#### The changes in this PR are covered in the following automated tests:
- [ ] stories
- [ ] unit tests
- [ ] integration tests
- [ ] end-to-end tests

#### Manual testing

_This section is mandatory for all contributions. If you believe no manual test is necessary, please state so explicitly. Thanks!_

<!-- Please include the steps to test your changes here. For example:

1. Run a sandbox for template, e.g. `yarn task --task sandbox --start-from auto --template react-vite/default-ts`
2. Open Storybook in your browser
3. Access X story

-->

### Documentation

<!-- Please check (put an "x" inside the "[ ]") the applicable items below to indicate which documentation has been updated. -->

- [ ] Add or update documentation reflecting your changes
- [ ] If you are deprecating/removing a feature, make sure to update
      [MIGRATION.MD](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md)

## Checklist for Maintainers

- [ ] When this PR is ready for testing, make sure to add `ci:normal`, `ci:merged` or `ci:daily` GH label to it to run a specific set of sandboxes. The particular set of sandboxes can be found in `code/lib/cli/src/sandbox-templates.ts`
- [ ] Make sure this PR contains **one** of the labels below:
- `cleanup`: Minor cleanup style change. Will not show up in release changelog.
- `build`: Internal-facing build tooling & test updates. Will not show up in release changelog.
- `documentation`: Documentation **only** changes. Will not show up in release changelog.
- `maintenance`: User-facing maintenance tasks.
- `dependencies`: Upgrading (sometimes downgrading) dependencies.
- `BREAKING CHANGE`: Changes that break compatibility in some way with current major version.
- `feature request`: Introducing a new feature.
- `bug`: Internal changes that fixes incorrect behavior.
- `other`: Changes that don't fit in the above categories.

### 🦋 Canary release

<!-- CANARY_RELEASE_SECTION -->

This PR does not have a canary release associated. You can request a canary release of this pull request by mentioning the `@storybookjs/core` team here.

_core team members can create a canary release [here](https://github.com/storybookjs/storybook/actions/workflows/canary-release-pr.yml) or locally with `gh workflow run --repo storybookjs/storybook canary-release-pr.yml --field pr=<PR_NUMBER>`_

<!-- CANARY_RELEASE_SECTION -->
