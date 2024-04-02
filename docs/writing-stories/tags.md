---
title: 'Tags'
---

Tags allow you to control which stories are included in your Storybook.

## Default tags

By default, the following tags are available in your project:

- `dev`: Stories tagged with `dev` are rendered in the Storybook UI, but only in development mode. They do not appear in the sidebar in [production mode](../sharing/publish-storybook.md#build-storybook-as-a-static-web-application).
- `docs`: Stories tagged with `docs` are rendered in the Storybook UI, but only in the [docs page](../writing-docs/autodocs.md). They do not appear in the sidebar.
- `test`: Stories tagged with `test` are not rendered in the Storybook UI, in either development or production mode.

## Custom tags

You can define your own tags by adding them to the [`tags` property](../api/main-config-tags.md) in your `main.js|ts` file. For example:

```ts
// .storybook/main.ts
import { StorybookConfig } from '@storybook/<your-framework>';

const config: StorybookConfig = {
  // ...rest of config
  tags: {
    experimental: { description: 'Stories for experimental components or features' },
  },
};

export default config;
```

## Tagging stories

You tag stories by defining a `tags` array in the story or meta definitions:

```ts
// Button.stories.ts
import { Meta, StoryObj } from '@storybook/<your-framework>';

import { Button } from './Button';

const meta = {
  component: Button,
  // 👇 Stories in this file will only be included for development mode, not production
  tags: ['dev'],
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const InternalStory: Story = {
  /**
   * 👇 This story inherits the tags from `meta` and defines its own,
   *    making the applied tags `['dev', 'test']`.
   *    It will not be included in the UI, only for testing environments
   */
  tags: ['test'],
};
```

If you want to add tags to all stories in your project, you can apply them in your `preview.js|ts` file:

```ts
// .storybook/preview.ts
import { Preview } from '@storybook/<your-framework>';

const preview: Preview = {
  // ...rest of preview
  tags: ['dev'],
};

export default preview;
```

### Removing tags

To remove a tag from a story, prefix it with `!`. For example:

```ts
// Button.stories.ts
import { Meta, StoryObj } from '@storybook/<your-framework>';

import { Button } from './Button';

const meta = {
  component: Button,
  // 👇 Stories in this file will only be included for development mode, not production
  tags: ['dev'],
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const InternalStory: Story = {
  // 👇 Remove the inherited `dev` tag by using the `!` prefix
  tags: ['!dev'],
};
```
