---
title: 'Portable stories'
---

TK - Intro

## composeStories

`composeStories` will process all stories from the component's stories you specify, compose args/decorators in all of them and return an object containing the composed stories.

If you use the composed story (e.g. Primary button), the component will render with the args that are passed in the story. However, you are free to pass any props on top of the component, and those props will override the default values passed in the story's args.

```tsx
// Button.test.ts|tsx
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { test, expect } from 'vitest';
// import all stories from the stories file
import * as stories from './Button.stories';

// Every component that is returned maps 1:1 with the stories,
// but they already contain all decorators from story level, meta level and project level.
const { Primary, Secondary } = composeStories(stories);

test('renders primary button with default args', () => {
  render(<Primary />);
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});

test('renders primary button with overriden props', () => {
  // You can override props and they will get merged with values from the Story's args
  render(<Primary>Hello world</Primary>);
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

### Type

<!-- prettier-ignore-start -->
```ts
(
  csfExports: CSF file exports,
  projectAnnotations?: ProjectAnnotations
) => Record<string, ComposedStoryFn>
```
<!-- prettier-ignore-end -->

### Parameters

#### `csfExports`

(**Required**)

Type: CSF file exports

Specifies which component's stories you want to compose. Pass the **full set of exports** from the CSF file (not the default export!).

#### `projectAnnotations`

Type: `ProjectAnnotation | ProjectAnnotation[]`

This parameter is provided for convenience. You should likely use [`setProjectAnnotations`](#setprojectannotations) instead. Details about the `ProjectAnnotation` type can be found in that function's [`projectAnnotations`](#projectannotations-2) parameter.

### Return

Type: `Record<string, ComposedStoryFn>`

An object where the keys are the names of the stories and the values are the composed stories.

Additionally, the composed story will have the following properties:

| Property   | Type                                       | Description                                 |
| ---------- | ------------------------------------------ | ------------------------------------------- |
| storyName  | `string`                                   | The story's name                            |
| args       | `Record<string, any>`                      | The story's args                            |
| argTypes   | `ArgType`                                  | The story's argTypes                        |
| id         | `string`                                   | The story's id                              |
| parameters | `Record<string, any>`                      | The story's parameters                      |
| load       | `() => Promise<void>`                      | Executes all the loaders for a given story  |
| play       | `(context) => Promise<void>  \| undefined` | Executes the play function of a given story |

## composeStory

You can use `composeStory` if you wish to compose a single story for a component.

```tsx
// Button.test.ts|tsx
import { render, screen } from '@testing-library/react';
import { composeStory } from '@storybook/react';
import { vi, test, expect } from 'vitest';
import meta, { Primary as PrimaryStory } from './Button.stories';

test('onclick handler is called', () => {
  // Returns a component that already contain all decorators from story level, meta level and global level.
  const Primary = composeStory(PrimaryStory, meta);

  const onClickSpy = vi.fn();
  render(<Primary onClick={onClickSpy} />);
  const buttonElement = screen.getByRole('button');
  buttonElement.click();
  expect(onClickSpy).toHaveBeenCalled();
});
```

### Type

<!-- prettier-ignore-start -->
```ts
(
  story: Story export,
  componentAnnotations: Meta,
  projectAnnotations?: ProjectAnnotations,
  exportsName?: string
) => ComposedStoryFn
```
<!-- prettier-ignore-end -->

### Parameters

#### `story`

(**Required**)

Type: `Story export`

Specifies which story you want to compose.

#### `componentAnnotations`

(**Required**)

Type: `Meta`

The default export from the stories file containing the [`story`](#story).

#### `projectAnnotations`

Type: `ProjectAnnotation | ProjectAnnotation[]`

This parameter is provided for convenience. You should likely use [`setProjectAnnotations`](#setprojectannotations) instead. Details about the `ProjectAnnotation` type can be found in that function's [`projectAnnotations`](#projectannotations-2) parameter.

#### `exportsName`

Type: `string`

TK - What is this?

### Return

Type: `ComposedStoryFn`

A single [composed story](#return).

## setProjectAnnotations

This API should be called once and before the tests run. This will make sure that whenever `composeStories` or `composeStory` are used, the project annotations are taken into account as well.

```ts
// setup-tests.ts
import { setProjectAnnotations } from '@storybook/react';
import * as frameworkAnnotations from '@storybook/nextjs/preview';
import * as addonAnnotations from 'my-addon/preview';
import * as previewAnnotations from './.storybook/preview';

setProjectAnnotations([previewAnnotations, frameworkAnnotations, addonAnnotations]);
```

### Type

```ts
(projectAnnotations: ProjectAnnotation | ProjectAnnotation[]) => void
```

### Parameters

#### `projectAnnotations`

(**Required**)

Type: `ProjectAnnotation | ProjectAnnotation[]`

TK - Describe annotations (maybe have a dedicated section at the bottom that this references?)
