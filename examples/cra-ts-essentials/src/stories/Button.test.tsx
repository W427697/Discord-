import React from 'react';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';

import * as globalConfig from '../../.storybook/preview';
import * as stories from './Button.stories';

// Useful to extract information from stories types
// type T = typeof stories;
// function prop<T>(obj: T): {[K in keyof T]: T[K]} {
//   return obj;
// }
// const bar = prop(stories);

const { Primary, Secondary } = composeStories(stories, globalConfig);

test('renders primary button', () => {
  const { getByText } = render(<Primary>Hello world</Primary>);
  const buttonElement = getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});

test('renders secondary button with argsfirst false', () => {
  const { getByText } = render(<Secondary>Hello world</Secondary>);
  const buttonElement = getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
