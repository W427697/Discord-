import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { WithText } from '../../../../examples/official-storybook/stories/demo/button.stories';
import { renderStory } from '../../render';

it('renders a story', () => {
  render(renderStory(WithText));

  expect(screen.getByRole('button')).toHaveTextContent('Hello Button');
});
