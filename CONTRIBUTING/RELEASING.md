# Releasing <!-- omit in toc -->

> **Note**
> This document is only really relevant for any of the core team members that actually have permissions to release new versions of Storybook. Feel free to read it out of interest or to suggest changes, but as a regular contributor or maintainer you don't have to care about this.

## Table of Contents <!-- omit in toc -->

- [Introduction](#introduction)
- [How To Release](#how-to-release)
  - [Prereleases](#prereleases)
  - [Patch releases](#patch-releases)
  - [Manual Changes](#manual-changes)
- [Releasing Locally in Case of Emergency 🚨](#releasing-locally-in-case-of-emergency-)
- [Versioning Scenarios](#versioning-scenarios)
  - [Prereleases - `7.1.0-alpha.12` -\> `7.1.0-alpha.13`](#prereleases---710-alpha12---710-alpha13)
  - [Prerelease promotions - `7.1.0-alpha.13` -\> `7.1.0-beta.0`](#prerelease-promotions---710-alpha13---710-beta0)
  - [Minor/major releases - `7.1.0-rc.2` -\> `7.1.0` or `8.0.0-rc.3` -\> `8.0.0`](#minormajor-releases---710-rc2---710-or-800-rc3---800)
  - [Patch releases to stable - subset of `7.1.0-alpha.13` -\> `7.0.14`](#patch-releases-to-stable---subset-of-710-alpha13---7014)
  - [Patch releases to earlier versions - subset of `7.1.0-alpha.13` -\> `6.5.14`](#patch-releases-to-earlier-versions---subset-of-710-alpha13---6514)
- [FAQ](#faq)
  - [How do I make changes to the release scripts?](#how-do-i-make-changes-to-the-release-scripts)
  - [Why do I need to re-trigger workflows to update the changelog?](#why-do-i-need-to-re-trigger-workflows-to-update-the-changelog)
  - [Why are no release PRs being prepared?](#why-are-no-release-prs-being-prepared)

## Introduction

- what this document describes
-
- branches

## How To Release

### Prereleases

> **Note**
> This actually also covers how to promote a prerelease to stable. This is basically any other releases than backported patch releases

### Patch releases

All changes should already have been prereleased

### Manual Changes

## Releasing Locally in Case of Emergency 🚨

## Versioning Scenarios

There are five types of releases that will be handled somewhat differently, but following the overall same principles as described above.

### Prereleases - `7.1.0-alpha.12` -> `7.1.0-alpha.13`

These happen multiple times a week

1. A PR will automatically be opened from a fresh branch `version-from-7.1.0-alpha.16` to `next-release` on every push to `next`. If the PR is already open, it will be kept up-to-date with description changes and force pushing commits. This process can also be manually triggered if needed.
2. The PR will consist of:
   1. Version bumps in all `package.json`s and other files like `versions.ts`
   2. Changes to `CHANGELOG.md` generated as specced below
   3. Changes listed in the PR description, along with a checklist to go through manually
3. When we're ready to release, a Releaser will go through the check list:
   1. Freeze the PR by applying the "freeze" label on it, stopping any actions from modifying it further
   2. QA each PR that is part of the release:
      1. Is the changelog high quality - it's based on PR titles, which are usually bad.
      2. Change any PR titles necessary
      3. Check that each PR content is high quality, has it been tested, are we sure it's not a breaking change, etc.
      4. revert any bad PRs
   3. If necessary, manually trigger the workflow again, to reflect changes to PR titles and reverts (manual triggers should ignore the "freeze" label)
   4. Merge the PR to `next-release`
4. When the PR is merged, an action will:
   1. publish all packages
   2. create a GitHub Release
   3. tag the commit
   4. merge `next-release` back to `next`. If this causes a merge conflict, this will have to be done manually
5. ... the cycle starts over

### Prerelease promotions - `7.1.0-alpha.13` -> `7.1.0-beta.0`

These happen once every 1-2 months

Same process as above, except before merging, the Releaser manually triggers the Action with a "tag: beta" input, that will change versions from the proposed `7.1.0-alpha.14` to `7.1.0-beta.0`.

### Minor/major releases - `7.1.0-rc.2` -> `7.1.0` or `8.0.0-rc.3` -> `8.0.0`

These happen once every quarter

Same process as above, except before merging, the Releaser manually triggers the Action with a "tag: stable" input, that will change versions from the proposed `7.1.0-rc.3` to `7.1.0`. When the PR is merged, the action will do the usual publishing work, and **force merge `next` into `main`**. The following GitHub Action that triggers on a push to `next` will generate a release PR with `7.2.0-alpha.0`, to start the cycle over.

### Patch releases to stable - subset of `7.1.0-alpha.13` -> `7.0.14`

These happen roughly every second week

This process is a bit different from the above because it needs to merge to the `main` branch and not `next`, but the principle is the same.

1. Any PR to `next` that needs to be patched back to stable, needs to have a "patch" label
2. On pushes to `next`, an action check for any such PRs with the "patch" label
3. It will create a release branch (`version-from-7.0.11`) and PR similar to the one for prereleases, except that it targets `main`.
4. Each "patch" PR that it finds it will attempt to cherry-pick to the `version-from-7.0.11` branch
5. Sometimes it might cause merge conflicts, in which case the PR will be skipped
6. When all is done, the description for the release PR will contain a list of PRs that couldn't be cherry picked, for the Releaser to manually do that and solve any merge conflicts.
7. An important additional step for the Releaser is to check that all PRs are actually patches/fixes, and not new features, and that everything actually works, given that some cherry picked PRs could rely on functionality not yet found in stable.

When the PR has been merged to `main-release` by the Releaser, after the usual publishing steps, the action will also label all patched PRs with "picked" so they are ignored for the next patch release.

### Patch releases to earlier versions - subset of `7.1.0-alpha.13` -> `6.5.14`

These happen 2-3 times a year

Given that this happens so rarely on a case by case basis, I'm okay with this being a completely manual process. The only thing we then need to keep in mind, is that all these versioning and publishing scripts needs to be executable locally, outside of a GitHub Action.

## FAQ

### How do I make changes to the release scripts?

(patch script changes back to main, either manually or via the patching flow)

### Why do I need to re-trigger workflows to update the changelog?

### Why are no release PRs being prepared?
