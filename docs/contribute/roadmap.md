---
title: 'Roadmap'
hideRendererSelector: true
---

The Storybook team maintains a [public roadmap](https://github.com/orgs/storybookjs/projects/20/views/1) in the form of a GitHub project. This page explains what's in the roadmap, how to interpret it, and how to contribute to it.

## What's in the roadmap?

Each card represents a Storybook project. The columns represent how larger changes make their way from idea to shipped feature. Projects typically start as an [Request for Comment (RFC)](./RFC.md), then evolve into a [tracking issue](https://github.com/storybookjs/storybook/issues?q=is%3Aissue++sort%3Aupdated-desc+label%3ATracking+) once the team has fully scoped what it entails. We ship a Storybook [minor version](https://semver.org/) every eight weeks, and a major version once per year, typically in Feb/Mar.

### Candidates

These cards are ideas on our radar that we are considering for the current major release. For example, if `8.0` is the most recent major version, these would be ideas for `8.x` or `9.0`. The ideas in this column are the fuzziest and may come and go depending on our priorities.

### Under consideration

These are projects being discussed for the next dev cycle. For example, if the most recent minor version is `8.1`, and we are currently working on `8.2`, the projects in this column would be under consideration for `8.3`. Unlike the candidates column, which can contain any idea, the projects under consideration must be documented with an [RFC](./RFC.md).

### In progress

These are projects that we are currently working on. There are two kinds of projects in this column:

1. **[Tracking issues](https://github.com/storybookjs/storybook/issues?q=is%3Aissue++sort%3Aupdated-desc+label%3ATracking+)**: Fully scoped projects expected to ship in the next minor release. For example, if the most recent minor is `8.1`, these should ship in `8.2`, eight weeks after `8.1`.
2. **Other projects**: Community projects facilitated by the core team and side projects. These don't have an ETA but we will push to have them ready as part of the current major. For example, if `8.0` is the most recent major version, these should ship in `8.x` or `9.0`.

### Done

These projects are completed, documented, and released. We follow a "fixed time, variable scope" policy for core projects, which means we scope a project into milestones to provide the most value to users as early as possible and cut scope if necessary to ship on time. If a feature has been scoped out of a project, we might try to fit it into a follow-up project, treat it as general maintenance work, or forget about it. Storybook is open source, so PR contributions are always welcome!

## Frequently asked questions

### When will project X be available?

This roadmap is an estimation, not a commitment. In general, every tracking issue "in progress" should be available in the next two months. Everything else on the board has a decent chance of getting into the next major release. For example, if `8.0` is the most recent major release, we will try to ship everything on the board as part of `8.x` or `9.0`. If we don't think a project is likely for the next major, we will kick it off the board.

### What about issue Y or discussion Z?

The Storybook core team and our community members continuously contribute bug fix bugs and smaller product improvements. The projects here are larger chunks of work. In some cases they may close out certain issues, and when possible we will call those out in the RFC or project tracking issue.

### How do I get something onto the board?

If there's a significant product improvement that you want to see, and there is currently an issue or an [RFC](./RFC.md) for it, upvote that issue/discussion, and comment on it with more information about your need or use case if it's not currently captured. If you don't see anything that's quite right, please feel free to [submit an RFC](https://github.com/storybookjs/storybook/discussions/new?category=rfc). We prioritize based on a combination of user/contributor interest (upvotes, comments, [Discord](https://discord.gg/storybook) conversations, etc.) and our own strategic ambitions for the project.
