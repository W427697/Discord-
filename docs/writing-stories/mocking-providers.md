---
title: Mocking providers
---

<!-- TODO: React & Solid only? -->

Components can receive data or configuration from context providers. For example, a styled component might access its theme from a ThemeProvider. To mock a provider, you can wrap your component in a [decorator](./decorators.md) that includes the necessary context.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/storybook-preview-with-styled-components-decorator.js.mdx',
    'react/storybook-preview-with-styled-components-decorator.ts.mdx',
    'solid/storybook-preview-with-styled-components-decorator.js.mdx',
    'solid/storybook-preview-with-styled-components-decorator.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Configuring the mock provider

When mocking a provider, it may be necessary to configure the provider to supply a different value for individual stories. For example, you might want to test a component with different themes or user roles.

One way to do this is to define the decorator for each story individually. But if you imagine a scenario where you wish to create stories for each of your components in both light and dark themes, this approach can quickly become cumbersome.

For a better way, with much less repetition, you can use the [decorator function's second "context" argument](./decorators.md#context-for-mocking) to access a story's [`parameters`](./parameters.md) and adjust the provided value. This way, you can define the provider once and adjust its value for each story.

For example, we can adjust the decorator from above to read from `parameters.theme` to determine which theme to provide:

<!-- TODO: Snippetize -->

```ts
// .storybook/preview.js
import React from 'react';
import { Preview } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

const preview: Preview = {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, { parameters }) => {
      // 👇 Make it configurable by reading the theme value from parameters
      const theme = parameters.theme || 'default';
      return (
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
```

Now, you can define a `theme` parameter in your stories to adjust the theme provided by the decorator:

<!-- TODO: Snippetize -->

```ts
// Button.stories.tsx
import { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

// Wrapped in default theme
export const Default: Story = {};

// Wrapped in dark theme
export const Dark: Story = {
  parameters: {
    theme: 'dark',
  },
};
```

This powerful approach allows you to provide any value (theme, user role, mock data, etc.) to your components in a way that is both flexible and maintainable.
