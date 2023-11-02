# Storybook Test

The `@storybook/test` package contains utilities to be used to test your story in the `play` function.

## Installation

Install this addon by adding the `@storybook/test` dependency:

```sh
npm install -D @storybook/test
pnpm add -D @storybook/test
yarn add -D @storybook/test
```

## Usage

The test package exports an instrumented version `@vitest/spy`, `@vitest/expect` (based on `chai`), `@testing-library/dom` and `@testing-library/user-event`.
The instrumentation makes sure you can debug those methods in the addon-interactions panel.

```ts
import { Button } from './Button';
import { within, userEvent, expect, fn } from '@storybook/test';

export default {
  component: Button,
  args: {
    onClick: fn(),
  },
};

export const Demo = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    await expect(args.onClick).toHaveBeenCalled();
  },
};
```
