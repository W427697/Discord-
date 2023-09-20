import type { Meta, StoryObj } from '@storybook/react';
import { ManagerContext } from '@storybook/manager-api';
import React, { useEffect } from 'react';
import { within } from '@storybook/testing-library';
import { MobileAbout } from './MobileAbout';
import { MobileLayoutProvider, useMobileLayoutContext } from '../MobileLayoutProvider';

const MockOpenAbout = ({ children }: { children: any }) => {
  const { setMobileAboutOpen } = useMobileLayoutContext();
  useEffect(() => {
    setMobileAboutOpen(true);
  }, [setMobileAboutOpen]);
  return children;
};

const meta = {
  component: MobileAbout,
  title: 'Mobile/About',
  decorators: [
    (storyFn) => {
      const { setMobileAboutOpen } = useMobileLayoutContext();
      useEffect(() => {
        setMobileAboutOpen(true);
      }, [setMobileAboutOpen]);
      return storyFn();
    },
    (storyFn) => {
      return (
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
          <MobileLayoutProvider>
            <MockOpenAbout>{storyFn()}</MockOpenAbout>
          </MobileLayoutProvider>
        </ManagerContext.Provider>
      );
    },
  ],
} satisfies Meta<typeof MobileAbout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = {
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const closeButton = await within(canvasElement).getByTitle('Close about section');
    await closeButton.click();
  },
};
