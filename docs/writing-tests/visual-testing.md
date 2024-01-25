---
title: 'Visual tests'
---

Visual tests catch bugs in UI appearance. It works by taking screenshots of every story and comparing them to previous versions to identify visual changes. This is ideal for verifying layout, color, size, and contrast. 

Storybook supports cross-browser visual testing natively using [Chromatic](https://www.chromatic.com/storybook/?ref=storybook_site), a cloud service made by the Storybook team. When you enable visual testing, every story is automatically turned into a test. This gives you instant feedback on UI bugs directly in Storybook.

<video autoPlay muted playsInline loop>
  <source
    src="component-visual-testing-optimized.mp4"
    type="video/mp4"
  />
</video>


### Install Visual Tests addon

Install the Visual Tests addon by running the following command. 

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/visual-test-addon-install.npx.js.mdx',
    'common/visual-test-addon-install.yarn.js.mdx',
    'common/visual-test-addon-install.pnpm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<Callout variant="info">

Storybook 7.4 or higher required. Read the [migration guide](../migration-guide.md) to upgrade your project.

</Callout>

### Enable visual tests

When you start Storybook, you'll see a new addon panel for "Visual Tests" where you can run tests and view results. 

![Visual Tests Addon enabled](./visual-tests-enable.png)

To enable visual testing, sign up to [Chromatic](https://www.chromatic.com/start?startWithSignup=true&ref=storybook_site) and create a project. This will give you access to a fleet of cloud browsers.

![Visual Tests Addon project selection](./visual-tests-project-selection.png)

Select a project from your project list to finish setup. If you're setting up the addon for the first time, the configuration files and necessary project identifiers will be added for you automatically. 

### Configure

Visual Tests addon includes configuration options covering most use cases by default. You can also fine-tune the addon configuration to match your project's requirements via the [`./chromatic.config.json`](https://www.chromatic.com/docs/cli#configuration) file. Below are the available options and examples of how to use them.

| Option            | Description                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `buildScriptName` | Optional. Defines the custom Storybook build script <br/> `options: { buildScriptName: 'deploy-storybook' }`                             |
| `debug`           | Optional. Output verbose debugging information to the console. <br/> `options: { debug: true }`                                          |
| `projectId`       | Automatically configured. Sets the value for the project identifier <br/> `options: { projectId: Project:64cbcde96f99841e8b007d75 }`     |
| `zip`             | Recommended for large projects. Configures the addon to deploy your Storybook to Chromatic as a zip file. <br/> `options: { zip: true }` |

```jsonc
// .storybook/chromatic.config.json
{
  "buildScriptName": "deploy-storybook",
  "debug": true,
  "projectId": "Project:64cbcde96f99841e8b007d75",
  "zip": true
}
```

### Run visual tests

Click the ▶️ Play button in the Storybook sidebar to run visual tests. This will send your stories to the cloud to snapshot and detect visual changes.

![Storybook running visual tests with the addon](./visual-tests-run-tests.png)


### Review changes

If there are visual changes in your stories, they will be 🟡 highlighted in the sidebar. Click the story and go to the "Visual Tests" addon panel to see which pixels changed.

If the changes are intentional, ✅ accept them as baselines locally. If the changes aren't intentional, fix the story and rerun the tests using the ▶️ Play button. 

![Confirm UI changes in Storybook](./visual-tests-accept-all.png)

When you finish accepting changes as baselines in the addon, you're ready to push the code to your remote repository. This will sync baselines to the cloud for anyone who checks out your branch. 

### Automate with CI

The addon is designed to be used in tandem with CI. We recommend using the addon to check for changes during development then running visual tests in CI as you get ready to merge to production. 

Changes you accept as baselines in the addon will get auto-accepted as baselines in CI so you don’t have to review twice.

Run `chromatic` in your CI jobs like so:

```
- run:
    command: npm run chromatic # run visual tests and publish Storybook
```

Learn how to configure visual tests in GitHub Actions, CircleCI and more [here](https://www.chromatic.com/docs/ci/#configure-ci).

#### PR checks 

Chromatic adds a ‘UI Tests’ check to your pull/merge requests. The badge shows errors or changes that need to be verified by your team. Require the check in GitHub, GitLab, or Bitbucket to prevent accidental UI bugs from being merged.

![PR badge for visual tests](./visual-tests-prbadge-test.png)

---

#### What’s the difference between visual tests and snapshot tests?

Snapshot tests compare the rendered markup of every story against known baselines. This means the test compares blobs of HTML and not what the user actually sees. Which in turn, can lead to an increase in false positives as code changes don’t always yield visual changes in the component.

**Learn about other UI tests**

- [Test runner](./test-runner.md) to automate test execution
- Visual tests for appearance
- [Accessibility tests](./accessibility-testing.md) for accessibility
- [Interaction tests](./interaction-testing.md) for user behavior simulation
- [Coverage tests](./test-coverage.md) for measuring code coverage
- [Snapshot tests](./snapshot-testing.md) for rendering errors and warnings
- [End-to-end tests](./stories-in-end-to-end-tests.md) for simulating real user scenarios
- [Unit tests](./stories-in-unit-tests.md) for functionality
