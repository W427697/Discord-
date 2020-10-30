import React from 'react';
import { render } from '@testing-library/react';
import { composeStory } from '@storybook/react';

import Meta, { Primary, Secondary } from './Button.stories';
import * as globalConfig from '../../.storybook/preview';

test('renders button', () => {
  const PrimaryComponent = composeStory(Meta, Primary, globalConfig);
  const { getByText } = render(<PrimaryComponent>Hello world</PrimaryComponent>);
  const buttonElement = getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});

test('renders secondary button with argsfirst false', () => {
  const SecondaryComponent = composeStory(Meta, Secondary, globalConfig);
  const { getByText } = render(<SecondaryComponent>Hello world</SecondaryComponent>);
  const buttonElement = getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
