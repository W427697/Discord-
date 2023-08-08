import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ManagerContext } from '@storybook/manager-api';
import { AboutScreen } from './about';

const meta = {
  component: AboutScreen,
  title: 'Settings/AboutScreen',
  decorators: [
    (Story) => (
      <ManagerContext.Provider
        value={
          {
            api: {
              getCurrentVersion: () => ({
                version: '7.2.2-alpha.0',
              }),
            },
          } as any
        }
      >
        <div
          style={{
            position: 'relative',
            height: '100vh',
            width: '100vw',
          }}
        >
          <Story />
        </div>
      </ManagerContext.Provider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AboutScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ur4kydUbRqdDyfoZWzdiIw/Storybook-app?type=design&node-id=9564-120444&mode=design&t=0TPINZFpwgFQFQeX-4',
    },
  },
};
