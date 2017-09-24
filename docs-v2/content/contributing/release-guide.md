# Release Guide

This section is for Storybook maintainers who will be creating releases.

## Releases Overview

Each release is described by:

-   A version
-   A list of merged pull requests
-   Optionally, a short hand-written description

Thus, the current release sequence is as follows:

**NOTE: This is a work in progress. Don't try this unless you know what you're doing. We hope to automate this in CI, so this process is designed with that in mind.**

First, build the release:

```sh
# make sure you current with origin/master.
git checkout master
git status

# clean out extra files & build all the packages
# WARNING: destructive if you have extra files lying around!
yarn bootstrap --reset --all
```

From here there are different procedures for prerelease (e.g. alpha/beta/rc) and proper release.

> **NOTE:** the very first time you publish a scoped package (`@storybook/x`) you need to publish it by hand because the default for scoped packages is private, and we need to make our packages public. If you try to publish a package for the first time using our `lerna` publish script, `lerna` will crash halfway through and you'll be in a world of pain.

## For prerelease (no CHANGELOG):

```sh
# publish and tag the release
yarn run publish --concurrency 1 --npm-tag=alpha

# push the tags
git push --tags
```

## For full release (with CHANGELOG):

```sh
# publish but don't commit to git
yarn run publish --concurrency 1 --skip-git

# Update `CHANGELOG.md`
# - Edit PR titles/labels on github until output is good
# - Optionally, edit a handwritten description in `CHANGELOG.md`
yarn changelog

# tag the release and push `CHANGELOG.md` and tags
# FIXME: not end-to-end tested!
yarn github-release
```
