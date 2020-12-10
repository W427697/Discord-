import React from 'react';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';

import * as globalConfig from '../../.storybook/preview';
import * as stories from './Button.stories';

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
