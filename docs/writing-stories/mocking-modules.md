---
title: Mocking modules
---

Components can also depend on modules that are imported into the component file. These can be from external packages or internal to your project. When rendering those components in Storybook or testing them, you may want to mock those modules to control their behavior.

There are two primary approaches to mocking modules in Storybook. They both involve creating a mock file to replace the original module. The difference between the two approaches is how you import the mock file into your component.

For either approach, relative imports of the mocked module are not supported.

## Mock files

To mock a module, create a file with the same name and in the same directory as the module you want to mock. For example, to mock a module named `session`, create a file next to it named `session.mock.js|ts`, with a few characteristics:

- It should re-export all exports from the original module - using relative imports to import the original, as using a subpath or alias import would result in it importing itself.
- It should use the `fn` utility to mock any necessary functionality from the original module.
- It should not introduce side effects that could affect other tests or components. Mock files should be isolated and only affect the module they are mocking.

Here's an example of a mock file for a module named `session`:

```js
// session.mock.js
import { fn } from '@storybook/test';
import * as actual from './session';

export * from './session';
export const getUserFromSession = fn(actual.getUserFromSession);
```

## Subpath imports

The recommended method for mocking modules is to use [subpath imports](https://nodejs.org/api/packages.html#subpath-imports), a feature of Node packages that is supported by both [Vite](../builders/vite.md) and [Webpack](../builders/webpack.md).

To configure subpath imports, you define the `imports` property in your project's `package.json` file. This property maps the subpath to the actual file path. The example below configures subpath imports for the `api` and `prisma` internal modules:

TK: External module example?

```json
// package.json
{
  "imports": {
    "#api": {
      "storybook": "./api.mock.ts",
      "default": "./api.ts"
    },
    "#prisma/prisma": {
      "storybook": "./prisma/prisma.mock.ts",
      "default": "./prisma/prisma.ts"
    },
    "#*": ["./*", "./*.ts", "./*.tsx"]
  }
}
```

<Callout variant="info">

Each subpath must begin with `#`, to differentiate it from a regular module path. The `#*` entry is a catch-all that maps all subpaths to the root directory.

</Callout>

You can then update your component file to use the subpath import:

```ts
TK: Component snippet
```

### Conditional imports

Note the `storybook` and `default` keys in each module's entry. The `storybook` key is used to import the mock file in Storybook, while the `default` key is used to import the original module in your project.

The Storybook environment will match the conditions `storybook` and `test`, so you can apply the same module mapping for both Storybook and your tests.

## Builder aliases

If your project is unable to use [subpath imports](#subpath-imports), you can configure your Storybook builder to alias the module to the mock file. This will instruct the builder to replace the module with the mock file when bundling your Storybook stories.

````js
// .storybook/main.ts

viteFinal: async (config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        'lodash': require.resolve('./lodash.mock'),
        '@/api/todo': path.resolve(__dirname, './api/todo.mock.ts')
      }
    }
  }
},

```js
// .storybook/main.ts

webpackFinal: async (config) => {
  if (config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/headers': require.resolve('./next-headers'),
      '@/api/todo$': path.resolve(__dirname, './api/todo.mock.ts'),
    }
  }

  return config
},
````

<!-- OR? -->
<!-- prettier-ignore-start -->

<!-- <CodeSnippets
  paths={[
    'common/storybook-main-with-mock-decorator.js.mdx',
  ]}
/> -->

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

<!-- <CodeSnippets
  paths={[
    'common/storybook-preview-with-mock-decorator.js.mdx',
    'common/storybook-preview-with-mock-decorator.ts.mdx',
  ]}
/> -->

<!-- prettier-ignore-end -->

## Using mocked modules in stories

When you use the `fn` utility to mock a module, you create full [Vitest mock functions](https://vitest.dev/api/mock.html) which have many useful methods. For example, you can use the [`mockReturnValue`](https://vitest.dev/api/mock.html#mockreturnvalue) method to set a return value for the mocked function or [`mockImplementation`](https://vitest.dev/api/mock.html#mockimplementation) to define a custom implementation.

Here, we define `beforeEach` on a story (which will run before the story is rendered) to set a mocked return value for the `getUserFromSession` function used by the Page component:

<!-- TODO: Snippetize -->

```js
// Page.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { getUserFromSession } from '#api/session.mock';
import { Page } from './Page';

const meta: Meta<typeof Page> = {
  component: Page,
};
export default meta;

type Story = StoryObj<typeof Page>;

export const Default: Story = {
  async beforeEach() {
    // 👇 Set the return value for the getUserFromSession function
    getUserFromSession.mockReturnValue({ id: '1', name: 'Alice' });
  },
};
```

<Callout variant="info">

If you are [writing your stories in TypeScript](./typescript.md), you will need to import your mock modules using the full mocked file name to have the mocked function correctly typed in your stories. You do **not** need do this in your component files, that's what the [subpath import](#subpath-imports) or [builder alias](#builder-aliases) is for.

</Callout>

### Spying on mocked modules

The `fn` utility also spies on the original module's functions, which you can use to assert their behavior in your tests. For example, you can use [interaction tests](../writing-tests/interaction-testing.md) to verify that a function was called with specific arguments.

For example, this story checks that the `saveNote` function was called when the user clicks the save button:

<!-- TODO: Snippetize -->

```ts
// NoteUI.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import { saveNote } from '#app/actions.mock';
import { createNotes } from '#mocks/notes';
import NoteUI from './note-ui';

const meta = {
  title: 'Mocked/NoteUI',
  component: NoteUI,
} satisfies Meta<typeof NoteUI>;
export default meta;

type Story = StoryObj<typeof meta>;

const notes = createNotes();

export const SaveFlow: Story = {
  name: 'Save Flow ▶',
  args: {
    isEditing: true,
    note: notes[0],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const saveButton = canvas.getByRole('menuitem', { name: /done/i });
    await userEvent.click(saveButton);
    // 👇 This is the mock function, so you can assert its behavior
    await expect(saveNote).toHaveBeenCalled();
  },
};
```

### Shared setup and clearing mocks

You can use `beforeEach` at the component level to perform shared setup or clear the mocks between stories. This ensures that each test starts with a clean slate and is not affected by the mocks from previous stories.

<!-- TODO: Snippetize -->

```js
// Page.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { getUserFromSession } from '#api/session.mock';
import { Page } from './Page';

const meta: Meta<typeof Page> = {
  component: Page,
  async beforeEach() {
    // 👇 Do this for each story
    // TK
    // 👇 Clear the mock between stories
    getUserFromSession.mockClear();
  },
};
export default meta;

type Story = StoryObj<typeof Page>;

export const Default: Story = {
  // TK
};
```
