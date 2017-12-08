# Release Guide

## Releases Overview

This section is for Storybook maintainers who will be creating releases. It assumes:

-   yarn >= 1.0.0 (otherwise you should pass a `--` before command arguments)
-   you've yarn linked `pr-log` from <https://github.com/storybooks/pr-log/pull/2>

The current manual release sequence is as follows:

-   Generate a changelog and verify the release by hand
-   Push the changelog to master or the release branch
-   Clean, build, and publish the release
-   Cut and paste the changelog to the github release page, and mark it as a (pre-) release

This sequence applies to both releases and pre-releases, but differs slightly between the two.

> **NOTE**:
> This is a work in progress. Don't try this unless you know what you're doing. 
> We hope to automate this in CI, so this process is designed with that in mind.

## Prerelease:

```sh
# make sure you current with origin/master.
git checkout release/X.Y
git status

# generate changelog and edit as appropriate
# generates a Next section
yarn changelog Next

# Edit the changelog/PRs as needed, then commit
git commit -m "Updated changelog for vX.Y"

# clean build
yarn bootstrap --reset --core
```

> **NOTE**: 
> The very first time you publish a scoped package (`@storybook/x`) you need to publish it by hand.
> This is because the default for scoped packages is private, and we need to make our packages public. 
> If you try to publish a package for the first time using our `lerna` publish script, `lerna` will crash halfway through and you'll be in a world of pain. 😭

```sh
# publish and tag the release
npm run publish -- --concurrency 1 --npm-tag=alpha

# update the release page
open https://github.com/storybooks/storybook/releases
```

## Full release:

```sh
# make sure you current with origin/master.
git checkout master
git status

# generate changelog and edit as appropriate
# generates a vNext section
yarn changelog X.Y

# Edit the changelog/PRs as needed, then commit
git commit -m "Changelog for vX.Y"

# clean build
yarn bootstrap --reset --core

# publish and tag the release
npm run publish -- --concurrency 1

# update the release page
open https://github.com/storybooks/storybook/releases
```
