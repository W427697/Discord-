import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { List } from './List';
import { ListItem } from './ListItem';

const meta: Meta<typeof List> = {
  title: 'List',
  component: List,
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => {
    const [workingIndex, setWorkingIndex] = useState(1);

    return (
      <>
        <List>
          <ListItem key={1} isCompleted={workingIndex >= 1} nthItem={1}>
            Hello World
          </ListItem>
          <ListItem key={2} isCompleted={workingIndex >= 2} nthItem={2}>
            Bonjour le monde
          </ListItem>
          <ListItem key={3} isCompleted={workingIndex >= 3} nthItem={3}>
            你好, 世界
          </ListItem>
        </List>
        <br />
        <button type="button" onClick={() => setWorkingIndex(workingIndex + 1)}>
          Complete
        </button>
      </>
    );
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement);
    const button = canvas.getByText('Complete');
    const liEls = canvas.getAllByRole('listitem');

    expect(liEls[0].ariaLabel).toBe('complete');
    expect(liEls[1].ariaLabel).toBe('not complete');
    expect(liEls[2].ariaLabel).toBe('not complete');

    userEvent.click(button);

    expect(liEls[0].ariaLabel).toBe('complete');
    // change
    expect(liEls[1].ariaLabel).toBe('complete');
    expect(liEls[2].ariaLabel).toBe('not complete');
  },
};
