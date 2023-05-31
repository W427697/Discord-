import { generateReleaseDescription, mapToTodoItems } from '../generate-pr-description';
import type { Change } from '../utils/get-changes';

describe('Generate PR Description', () => {
  describe('mapToTodoItems', () => {
    it('should return a string with the correct format', () => {
      const changes: Change[] = [
        {
          user: 'JReinhold',
          title: 'Some PR title for a bug',
          labels: ['bug', 'build', 'other label'],
          commit: 'abc123',
          pull: '42',
          links: {
            commit: '[abc123](https://github.com/storybookjs/storybook/commit/abc123)',
            pull: '[#42](https://github.com/storybookjs/storybook/pull/42)',
            user: '[@JReinhold](https://github.com/JReinhold)',
          },
        },
        {
          user: 'shilman',
          title: 'Some title for a direct commit',
          labels: null,
          commit: '22bb11',
          pull: null,
          links: {
            commit: '[22bb11](https://github.com/storybookjs/storybook/commit/22bb11)',
            pull: null,
            user: '[@shilman](https://github.com/shilman)',
          },
        },
        {
          user: 'shilman',
          title: 'Another PR title for docs',
          labels: ['another label', 'documentation'],
          commit: 'ddd222',
          pull: '11',
          links: {
            commit: '[ddd222](https://github.com/storybookjs/storybook/commit/ddd222)',
            pull: '[#11](https://github.com/storybookjs/storybook/pull/11)',
            user: '[@shilman](https://github.com/shilman)',
          },
        },
        {
          user: 'JReinhold',
          title: 'Some PR title for a new feature',
          labels: ['feature request', 'other label'],
          commit: 'wow1337',
          pull: '48',
          links: {
            commit: '[wow1337](https://github.com/storybookjs/storybook/commit/wow1337)',
            pull: '[#48](https://github.com/storybookjs/storybook/pull/48)',
            user: '[@JReinhold](https://github.com/JReinhold)',
          },
        },
        {
          user: 'JReinhold',
          title: 'Some PR title with a missing label',
          labels: ['incorrect label', 'other label'],
          commit: 'bad999',
          pull: '77',
          links: {
            commit: '[bad999](https://github.com/storybookjs/storybook/commit/bad999)',
            pull: '[#77](https://github.com/storybookjs/storybook/pull/77)',
            user: '[@JReinhold](https://github.com/JReinhold)',
          },
        },
      ];
      expect(mapToTodoItems(changes)).toMatchInlineSnapshot(`
        "- **🐛 Bug**: Some PR title for a bug [#42](https://github.com/storybookjs/storybook/pull/42)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Direct commit**: Some title for a direct commit [22bb11](https://github.com/storybookjs/storybook/commit/22bb11)
        	- [ ] The change is appropriate for the version bump
        - **📝 Documentation**: Another PR title for docs [#11](https://github.com/storybookjs/storybook/pull/11)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **✨ Feature Request**: Some PR title for a new feature [#48](https://github.com/storybookjs/storybook/pull/48)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Missing Label**: Some PR title with a missing label [#77](https://github.com/storybookjs/storybook/pull/77)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct"
      `);
    });
  });

  describe('generateReleaseDescription', () => {
    it('should return a string with the correct format', () => {
      const todoItems = `- **🐛 Bug**: Some PR title for a bug [#42](https://github.com/storybookjs/storybook/pull/42)
\t- [ ] The change is appropriate for the version bump
\t- [ ] The PR is labeled correctly
\t- [ ] The PR title is correct
- **⚠️ Direct commit**: Some title for a direct commit [22bb11](https://github.com/storybookjs/storybook/commit/22bb11)
\t- [ ] The change is appropriate for the version bump
- **📝 Documentation**: Another PR title for docs [#11](https://github.com/storybookjs/storybook/pull/11)
\t- [ ] The change is appropriate for the version bump
\t- [ ] The PR is labeled correctly
\t- [ ] The PR title is correct
- **✨ Feature Request**: Some PR title for a new feature [#48](https://github.com/storybookjs/storybook/pull/48)
\t- [ ] The change is appropriate for the version bump
\t- [ ] The PR is labeled correctly
\t- [ ] The PR title is correct
- **⚠️ Missing Label**: Some PR title with a missing label [#77](https://github.com/storybookjs/storybook/pull/77)
\t- [ ] The change is appropriate for the version bump
\t- [ ] The PR is labeled correctly
\t- [ ] The PR title is correct`;
      const changelogText = `## 7.1.0-alpha.11

- Some PR title for a bug [#42](https://github.com/storybookjs/storybook/pull/42), thanks [@JReinhold](https://github.com/JReinhold)
- Some PR title for a feature request [#48](https://github.com/storybookjs/storybook/pull/48), thanks [@JReinhold](https://github.com/JReinhold)`;
      expect(
        generateReleaseDescription({
          fromVersion: '7.1.0-alpha.10',
          toVersion: '7.1.0-alpha.11',
          todoItems,
          changelogText,
        })
      ).toMatchInlineSnapshot(`
        "This is an automated pull request that bumps the version from \`undefined\` to \`undefined\`.
        Once this pull request is merged, it will trigger a new release of version \`undefined\`.
        If you're not a core maintainer with permissions to release you can ignore this pull request.

        ## To do

        Before merging the PR, there are a few QA steps to go through:

        - [ ] Add the "freeze" label to this PR, to ensure it doesn't get automatically forced pushed by new changes.

        And for each change below:

        1. Ensure the change is appropriate for the version bump. E.g. patch release should only contain patches, not new or de-stabilizing features. If a change is not appropriate, revert the PR.
        2. Ensure the PR is labeled correctly with "BREAKING CHANGE", "feature request", "maintainance", "bug", "build" or "documentation".
        3. Ensure the PR title is correct, and follows the format "[Area]: [Summary]", e.g. *"React: Fix hooks in CSF3 render functions"*. If it is not correct, change the title in the PR.
            - Areas include: React, Vue, Core, Docs, Controls, etc.
            - First word of summary indicates the type: “Add”, “Fix”, “Upgrade”, etc.
            - The entire title should fit on a line

        This is a list of all the PRs merged and commits pushed directly to \`next\`, that will be part of this release:

        - **🐛 Bug**: Some PR title for a bug [#42](https://github.com/storybookjs/storybook/pull/42)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Direct commit**: Some title for a direct commit [22bb11](https://github.com/storybookjs/storybook/commit/22bb11)
        	- [ ] The change is appropriate for the version bump
        - **📝 Documentation**: Another PR title for docs [#11](https://github.com/storybookjs/storybook/pull/11)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **✨ Feature Request**: Some PR title for a new feature [#48](https://github.com/storybookjs/storybook/pull/48)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct
        - **⚠️ Missing Label**: Some PR title with a missing label [#77](https://github.com/storybookjs/storybook/pull/77)
        	- [ ] The change is appropriate for the version bump
        	- [ ] The PR is labeled correctly
        	- [ ] The PR title is correct

        If you needed to make any changes doing the above QA (change PR titles, revert PRs), manually trigger a re-generation of this PR with [this workflow](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/prepare-prerelease.yml) and wait for it to finish. It will wipe your progress in this to do, which is expected.

        When everything above is done:
        - [ ] Merge this PR
        - [ ] [Approve the publish workflow run](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/publish.yml)

        ---

        # Generated changelog

        ## 7.1.0-alpha.11

        - Some PR title for a bug [#42](https://github.com/storybookjs/storybook/pull/42), thanks [@ JReinhold](https://github.com/JReinhold)
        - Some PR title for a feature request [#48](https://github.com/storybookjs/storybook/pull/48), thanks [@ JReinhold](https://github.com/JReinhold)"
      `);
    });
  });
});
