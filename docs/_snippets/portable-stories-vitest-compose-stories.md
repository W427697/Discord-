```tsx filename="Button.test.tsx" renderer="react" language="ts"
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';

// Import all stories and the component annotations from the stories file
import * as stories from './Button.stories';

// Every component that is returned maps 1:1 with the stories,
// but they already contain all annotations from story, meta, and project levels
const { Primary, Secondary } = composeStories(stories);

test('renders primary button with default args', () => {
  render(<Primary />);
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});

test('renders primary button with overridden props', () => {
  // You can override props and they will get merged with values from the story's args
  render(<Primary>Hello world</Primary>);
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

```ts filename="Button.test.ts" renderer="svelte" language="ts"
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { composeStories } from '@storybook/svelte';

// Import all stories and the component annotations from the stories file
import * as stories from './Button.stories';

// Every component that is returned maps 1:1 with the stories,
// but they already contain all annotations from story, meta, and project levels
const { Primary, Secondary } = composeStories(stories);

test('renders primary button with default args', () => {
  render(Primary.Component, Primary.props);
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});
```

```ts filename="Button.test.ts" renderer="vue" language="ts"
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { composeStories } from '@storybook/vue3';

// Import all stories and the component annotations from the stories file
import * as stories from './Button.stories';

// Every component that is returned maps 1:1 with the stories,
// but they already contain all annotations from story, meta, and project levels
const { Primary, Secondary } = composeStories(stories);

test('renders primary button with default args', () => {
  render(Primary);
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});

test('renders primary button with overridden props', () => {
  // You can override props and they will get merged with values from the story's args
  render(Primary, { props: { label: 'Hello world' } });
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

