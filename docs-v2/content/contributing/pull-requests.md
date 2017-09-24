# Pull Requests (PRs)

We welcome your contributions. There are many ways you can help us.

## First Steps

-   Fix typos and add more [documentation](https://github.com/storybooks/storybook/labels/needs%20docs).
-   Try to fix some [bugs](https://github.com/storybooks/storybook/labels/bug).
-   Work on [API](https://github.com/storybooks/storybook/labels/enhancement%3A%20api), [Addons](https://github.com/storybooks/storybook/labels/enhancement%3A%20addons), [UI](https://github.com/storybooks/storybook/labels/enhancement%3A%20ui) or [Webpack](https://github.com/storybooks/storybook/labels/enhancement%3A%20webpack) use enhancements and new [features](https://github.com/storybooks/storybook/labels/feature%20request).
-   Add more [tests](https://codecov.io/gh/storybooks/storybook/tree/master/packages) (specially for the [UI](https://codecov.io/gh/storybooks/storybook/tree/master/packages/storybook-ui/src)).

Before you submit a new PR, make you to run `yarn test`. Do not submit a PR if tests are failing. If you need any help, create an issue and ask.

### Reviewing PRs

**As a PR submitter**, you should reference the issue if there is one, include a short description of what you contributed and, if it is a code change, instructions for how to manually test out the change. This is informally enforced by our [PR template](https://github.com/storybooks/storybook/blob/master/.github/PULL_REQUEST_TEMPLATE.md). If your PR is reviewed as only needing trivial changes (e.g. small typos etc), and you have commit access, then you can merge the PR after making those changes.

**As a PR reviewer**, you should read through the changes and comment on any potential problems. If you see something cool, a kind word never hurts either! Additionally, you should follow the testing instructions and manually test the changes. If the instructions are missing, unclear, or overly complex, feel free to request better instructions from the submitter. Unless the PR is tagged with the `do not merge` label, if you approve the review and there is no other required discussion or changes, you should also go ahead and merge the PR.
