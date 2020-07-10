import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Basic } from '../../../../examples/official-storybook/stories/addon-controls.stories';
import { renderStory } from '../../render';

it('renders a story', () => {
  render(renderStory(Basic));

  expect(screen.getByRole('button')).toHaveTextContent('basic');
});

it('renders a story with different args', () => {
  render(renderStory(Basic, { children: 'test content' }));

  expect(screen.getByRole('button')).toHaveTextContent('test content');
});
