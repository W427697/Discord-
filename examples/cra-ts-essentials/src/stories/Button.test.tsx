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

test('reuses args from composed story', () => {
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

/**
 * FIXME: this would only work in typescript projects when composeStories returns type Story<Partial<Props>>.
 * It breaks now because Primary contains non-optional props.
 * */
// eslint-disable-next-line jest/no-commented-out-tests
// test('reuses args from composeStories', () => {
//   const { getByText } = render(<Primary />);
//   const buttonElement = getByText(/foo/i);
//   expect(buttonElement).not.toBeNull();
// });
