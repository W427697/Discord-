---
title: Mocking modules
---

Components can also depend on modules that are imported into the component file. These can be from external packages or internal to your project. When rendering those components in Storybook or testing them, you may want to mock those modules to control their behavior.

There are two primary approaches to mocking modules in Storybook. They both involve creating a mock file to replace the original module. The difference between the two approaches is how you import the mock file into your component.

For either approach, relative imports of the mocked module are not supported.

## Mock files

To mock a module, create a file with the same name and in the same directory as the module you want to mock. For example, to mock a module named `session`, create a file next to it named `session.mock.js|ts`, with a few characteristics:

- It must import the original module using a relative import.
  - Using a subpath or alias import would result in it importing itself.
- It should re-export all exports from the original module.
- It should use the `fn` utility to mock any necessary functionality from the original module.
- It should not introduce side effects that could affect other tests or components. Mock files should be isolated and only affect the module they are mocking.

Here's an example of a mock file for a module named `session`:

<!-- TODO: Snippetize -->

```ts
// lib/session.mock.ts
import { fn } from '@storybook/test';
import * as actual from './session';

export * from './session';
export const getUserFromSession = fn(actual.getUserFromSession);
```

### Mock files for external modules

You can't directly mock an external module like `uuid` or `node:fs`. Instead, you must wrap the module in you own module, which you can then mock like any other internal module. In this example, we wrap `uuid`:

```ts
// lib/uuid.ts
import { v4 } from 'uuid';

export const uuidv4 = v4;
```

And create a mock for the wrapper:

```ts
// lib/uuid.mock.ts
import { fn } from '@storybook/test';

import * as actual from './uuid';

export const uuidv4 = fn(actual.uuidv4);
```

## Subpath imports

The recommended method for mocking modules is to use [subpath imports](https://nodejs.org/api/packages.html#subpath-imports), a feature of Node packages that is supported by both [Vite](../builders/vite.md) and [Webpack](../builders/webpack.md).

To configure subpath imports, you define the `imports` property in your project's `package.json` file. This property maps the subpath to the actual file path. The example below configures subpath imports for four internal modules:

<!-- TODO: Snippetize -->

```json
// package.json
{
  "imports": {
    "#api": {
      "storybook": "./api.mock.ts",
      "default": "./api.ts"
    },
    "#app/actions": {
      "storybook": "./app/actions.mock.ts",
      "default": "./app/actions.ts"
    },
    "#lib/session": {
      "storybook": "./lib/session.mock.ts",
      "default": "./lib/session.ts"
    },
    "#lib/db": {
      "storybook": "./lib/db.mock.ts",
      "default": "./lib/db.ts"
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
// AuthButton.ts
import { getUserFromSession } from '#lib/session';

export const AuthButton = (props) => {
  const user = getUserFromSession();

  // ...
};
```

### Conditional imports

Note the `storybook` and `default` keys in each module's entry. The `storybook` key is used to import the mock file in Storybook, while the `default` key is used to import the original module in your project.

The Storybook environment will match the conditions `storybook` and `test`, so you can apply the same module mapping for both Storybook and your tests.

## Builder aliases

If your project is unable to use [subpath imports](#subpath-imports), you can configure your Storybook builder to alias the module to the mock file. This will instruct the builder to replace the module with the mock file when bundling your Storybook stories.

<!-- TODO: Snippetize -->

```ts
// .storybook/main.ts
viteFinal: async (config) => {
  if (config.resolve) {
    config.resolve.alias = {
      ...config.resolve?.alias,
      // 👇 External module
      'lodash': require.resolve('./lodash.mock'),
      // 👇 Internal modules
      '@/api': path.resolve(__dirname, "./api.mock.ts"),
      '@/app/actions': path.resolve(__dirname, "./app/actions.mock.ts"),
      '@/lib/session': path.resolve(__dirname, "./lib/session.mock.ts"),
      '@/lib/db': path.resolve(__dirname, "./lib/db.mock.ts"),
    }
  }

  return config;
},
```

```ts
// .storybook/main.ts
webpackFinal: async (config) => {
  if (config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      // 👇 External module
      'lodash': require.resolve('./lodash.mock'),
      // 👇 Internal modules
      '@/api$': path.resolve(__dirname, "./api.mock.ts"),
      '@/app/actions$': path.resolve(__dirname, "./app/actions.mock.ts"),
      '@/lib/session$': path.resolve(__dirname, "./lib/session.mock.ts"),
      '@/lib/db$': path.resolve(__dirname, "./lib/db.mock.ts"),
    }
  }

  return config;
},
```

## Using mocked modules in stories

When you use the `fn` utility to mock a module, you create full [Vitest mock functions](https://vitest.dev/api/mock.html) which have many useful methods. For example, you can use the [`mockReturnValue`](https://vitest.dev/api/mock.html#mockreturnvalue) method to set a return value for the mocked function or [`mockImplementation`](https://vitest.dev/api/mock.html#mockimplementation) to define a custom implementation.

Here, we define `beforeEach` on a story (which will run before the story is rendered) to set a mocked return value for the `getUserFromSession` function used by the Page component:

<!-- TODO: Snippetize -->

```ts
// Page.stories.ts|tsx
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
// NoteUI.stories.ts|tsx
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

### Setting up and cleaning up

You can use the asynchronous `beforeEach` function to perform any setup that you need before the story is rendered, eg. setting up mock behavior. It can be defined at the story, component (which will run for all stories in the file), or project (defined in `.storybook/preview.js|ts`, which will run for all stories in the project) level.

You can also return a cleanup function from `beforeEach` which will be called after your story unmounts. This is useful for tasks like unsubscribing observers, etc.

<Callout variant="info">

It is _not_ necessary to restore `fn()` mocks with the cleanup function, as Storybook will already do that automatically before rendering a story. See the [`parameters.test.restoreMocks` API](../api/parameters.md#restoremocks) for more information.

</Callout>

Here's an example of using the [`mockdate`](https://github.com/boblauer/MockDate) package to mock the Date and reset it when the story unmounts.

<!-- TODO: Snippetize -->

```ts
// Page.stories.ts|tsx
import { Meta, StoryObj } from '@storybook/react';
import MockDate from 'mockdate';

import { getUserFromSession } from '#api/session.mock';
import { Page } from './Page';

const meta: Meta<typeof Page> = {
  component: Page,
  // 👇 Set the current date for every story in the file
  async beforeEach() {
    MockDate.set('2024-02-14');

    // 👇 Reset the date after each test
    return () => {
      MockDate.reset();
    };
  },
};
export default meta;

type Story = StoryObj<typeof Page>;

export const Default: Story = {};
```
