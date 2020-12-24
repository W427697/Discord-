import React from 'react';
import { render } from '@testing-library/react';
import { composeStories, composeStory } from '@storybook/react';

import * as globalConfig from '../../.storybook/preview';
import * as stories from './Button.stories';

// example with composeStories, returns an object with all stories composed with args/decorators
const { Primary } = composeStories(stories);

// example with composeStory, returns a single story composed with args/decorators
const Secondary = composeStory(stories.Secondary, stories.default, globalConfig);

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

// TODO: this would only work when composeStories returns type Story<Partial<Props>>
// eslint-disable-next-line jest/no-commented-out-tests
// test('reuses args from composeStories', () => {
//   const { getByText } = render(<Primary />);
//   const buttonElement = getByText(/foo/i);
//   expect(buttonElement).not.toBeNull();
// });

test('reuses args from composeStory', () => {
  const { getByText } = render(<Secondary />);
  const buttonElement = getByText(/Children coming from story args!/i);
  expect(buttonElement).not.toBeNull();
});

test('onclick handler is called', async () => {
  const onClickSpy = jest.fn();
  const { getByRole } = render(<Secondary onClick={onClickSpy} />);
  const buttonElement = getByRole('button');
  buttonElement.click();
  expect(onClickSpy).toHaveBeenCalled();
});
