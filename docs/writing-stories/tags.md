---
title: 'Tags'
---

Tags allow you to control which stories are included in your Storybook, enabling many different uses of the same total set of stories. For example, you can use tags to include/exclude tests from the [test runner](../writing-tests/test-runner.md#run-tests-for-a-subset-of-stories) or display [badges](https://storybook.js.org/addons/@geometricpanda/storybook-addon-badges/). For more complex use cases, see the [recipes](#recipes) section, below.

## Built-in tags

The following tags are available in every Storybook project:

| Tag        | Applied&nbsp;by&nbsp;default? | Description                                                                                                                                                                                                              |
| ---------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `autodocs` | No                            | Stories tagged with `autodocs` will be included in the [docs page](../writing-docs/autodocs.md). If a CSF file does not contain at least one story tagged with `autodocs`, that component will not generate a docs page. |
| `dev`      | Yes                           | Stories tagged with `dev` are rendered in Storybook's sidebar.                                                                                                                                                           |
| `test`     | Yes                           | Stories tagged with `test` do not currently affect Storybook's UI, but can be used to filter the [test runner](../writing-tests/test-runner.md#run-tests-for-a-subset-of-stories).                                       |

The `dev` and `test` tags are automatically, implicitly applied to every story in your Storybook project.

## Applying tags

A tag can be any string, either the [built-in tags](#built-in-tags) or custom tags of your own design. To apply tags to a story, assign an array of strings to the `tags` property. Tags may be applied at the project, component (meta), or story levels.

For example, to apply the `autodocs` tag to all stories in your project, you can use `.storybook/preview.js|ts`:

```ts
// .storybook/preview.ts
import type { Preview } from '@storybook/your-framework';

const preview: Preview = {
  // ...rest of preview
  /**
   * 👇 All stories in your project will have these tags applied:
   *    - autodocs
   *    - dev (implicit default)
   *    - test (implicit default)
   */
  tags: ['autodocs'],
};

export default preview;
```

Within a component stories file, you apply tags like so:

```ts
// Button.stories.ts
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta = {
  component: Button,
  /**
   * 👇 All stories in this file will have these tags applied:
   *    - autodocs
   *    - dev (implicit default, inherited from preview)
   *    - test (implicit default, inherited from preview)
   */
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ExperimentalFeatureStory: Story = {
  /**
   * 👇 This particular story will have these tags applied:
   *    - experimental
   *    - autodocs (inherited from meta)
   *    - dev (inherited from meta)
   *    - test (inherited from meta)
   */
  tags: ['experimental'],
};
```

## Removing tags

To remove a tag from a story, prefix it with `!`. For example, we can apply the `stable` tag to all stories in a file except one, which has the `experimental` tag:

```ts
// Button.stories.ts
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta = {
  component: Button,
  // 👇 Applies to all stories in this file
  tags: ['stable'],
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ExperimentalFeatureStory: Story = {
  /**
   * 👇 For this particular story, remove the inherited
   *    `stable` tag and apply the `experimental` tag
   */
  tags: ['!stable', 'experimental'],
};
```

<Callout variant="info">

Tags like `stable` and `experimental` work very well with an addon like [badges](https://storybook.js.org/addons/@geometricpanda/storybook-addon-badges/).

</Callout>

Tags can be removed for all stories in your project (in `.storybook/preview.js|ts`), all stories for a component (in the CSF file meta), or a single story (as above).

## Recipes

### Docs-only stories

It can sometimes be helpful to provide example stories for documentation purposes, but you want to keep the sidebar navigation more focused on stories useful for development. By enabling the `autodocs` tag and removing the `dev` tag, a story becomes docs-only: appearing only in the [docs page](../writing-docs/autodocs.md) and not in Storybook's sidebar.

```ts
// Button.stories.ts
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta = {
  component: Button,
  /**
   * 👇 All stories in this file will:
   *    - Be included in the docs page
   *    - Not appear in Storybook's sidebar
   */
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof Button>;
export default meta;
```

### Combo stories, still tested individually

For a component with many variants, like a Button, a grid of those variants all together can be a helpful way to visualize it. But you may wish to test the variants individually. You can accomplish this with tags like so:

```ts
// Button.stories.ts
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Variant1: Story = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
};

export const Variant2: Story = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
};

// ... etc.

export const Combo: Story = {
  // 👇 This story should not be tested
  tags: ['!test'],
  render: () => {
    // Variant1, Variant2, etc.
  },
};
```
