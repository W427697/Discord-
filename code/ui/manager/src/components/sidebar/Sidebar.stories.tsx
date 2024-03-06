import React from 'react';

import type { IndexHash, State } from '@storybook/manager-api';
import { ManagerContext, types } from '@storybook/manager-api';
import type { StoryObj, Meta } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { Button, IconButton } from '@storybook/components';
import { FaceHappyIcon } from '@storybook/icons';
import { Sidebar, DEFAULT_REF_ID } from './Sidebar';
import { standardData as standardHeaderData } from './Heading.stories';
import { mockDataset } from './mockdata';
import type { RefType } from './types';
import { LayoutProvider } from '../layout/LayoutProvider';
import { IconSymbols } from './IconSymbols';

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const meta = {
  component: Sidebar,
  title: 'Sidebar/Sidebar',
  excludeStories: /.*Data$/,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (storyFn) => (
      <ManagerContext.Provider
        value={
          {
            state: {
              docsOptions: {
                defaultName: 'Docs',
                autodocs: 'tag',
                docsMode: false,
              },
            },
            api: {
              emit: () => {},
              on: () => {},
              off: () => {},
              getShortcutKeys: () => ({ search: ['control', 'shift', 's'] }),
            },
          } as any
        }
      >
        <LayoutProvider>
          <IconSymbols />
          {storyFn()}
        </LayoutProvider>
      </ManagerContext.Provider>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

const { menu } = standardHeaderData;
const index = mockDataset.withRoot as IndexHash;
const storyId = 'root-1-child-a2--grandchild-a1-1';

export const simpleData = { menu, index, storyId };
export const loadingData = { menu };

const refs: Record<string, RefType> = {
  optimized: {
    id: 'optimized',
    title: 'This is a ref',
    url: 'https://example.com',
    type: 'lazy',
    index,
    previewInitialized: true,
  },
};

// eslint-disable-next-line local-rules/no-uncategorized-errors
const indexError = new Error('Failed to load index');

const refsError = {
  optimized: {
    ...refs.optimized,
    index: undefined as IndexHash,
    indexError,
  },
};

const refsEmpty = {
  optimized: {
    ...refs.optimized,
    // type: 'auto-inject',
    index: {} as IndexHash,
  },
};

export const Simple: Story = {
  args: { previewInitialized: true },
  render: (args) => (
    <Sidebar
      {...args}
      menu={menu}
      extra={[]}
      index={index as any}
      storyId={storyId}
      refId={DEFAULT_REF_ID}
      refs={{}}
      status={{}}
    />
  ),
};

export const Loading: Story = {
  args: { previewInitialized: false },
  render: (args) => (
    <Sidebar
      {...args}
      menu={menu}
      extra={[]}
      storyId={storyId}
      refId={DEFAULT_REF_ID}
      refs={{}}
      status={{}}
    />
  ),
};

export const Empty: Story = {
  args: {
    previewInitialized: true,
  },
  render: (args) => (
    <Sidebar
      {...args}
      menu={menu}
      extra={[]}
      index={{}}
      storyId={storyId}
      refId={DEFAULT_REF_ID}
      refs={{}}
      status={{}}
    />
  ),
};

export const IndexError: Story = {
  args: {
    previewInitialized: true,
  },
  render: (args) => (
    <Sidebar
      {...args}
      indexError={indexError}
      extra={[]}
      menu={menu}
      storyId={storyId}
      refId={DEFAULT_REF_ID}
      refs={{}}
      status={{}}
    />
  ),
};

export const WithRefs: Story = {
  args: {
    previewInitialized: true,
  },
  render: (args) => (
    <Sidebar
      {...args}
      menu={menu}
      extra={[]}
      index={index as any}
      storyId={storyId}
      refId={DEFAULT_REF_ID}
      refs={refs}
      status={{}}
    />
  ),
};

export const LoadingWithRefs: Story = {
  args: {
    previewInitialized: false,
  },
  render: (args) => (
    <Sidebar
      {...args}
      menu={menu}
      extra={[]}
      storyId={storyId}
      refId={DEFAULT_REF_ID}
      refs={refs}
      status={{}}
    />
  ),
};

export const LoadingWithRefError: Story = {
  args: {
    previewInitialized: false,
  },
  render: (args) => (
    <Sidebar
      {...args}
      menu={menu}
      extra={[]}
      storyId={storyId}
      refId={DEFAULT_REF_ID}
      refs={refsError}
      status={{}}
    />
  ),
};

export const WithRefEmpty: Story = {
  args: {
    previewInitialized: true,
  },
  render: (args) => (
    <Sidebar
      {...args}
      menu={menu}
      extra={[]}
      index={{}}
      storyId={storyId}
      refId={DEFAULT_REF_ID}
      refs={refsEmpty}
      status={{}}
    />
  ),
};

export const StatusesCollapsed: Story = {
  args: {
    previewInitialized: true,
    status: Object.entries(index).reduce<State['status']>((acc, [id, item]) => {
      if (item.type !== 'story') {
        return acc;
      }

      if (item.name.includes('B')) {
        return {
          ...acc,
          [id]: {
            addonA: { status: 'warn', title: 'Addon A', description: 'We just wanted you to know' },
            addonB: { status: 'error', title: 'Addon B', description: 'This is a big deal!' },
          },
        };
      }
      return acc;
    }, {}),
  },
  render: (args) => (
    <Sidebar
      {...args}
      menu={menu}
      extra={[]}
      index={index as any}
      storyId={storyId}
      refId={DEFAULT_REF_ID}
      refs={{}}
    />
  ),
};

export const StatusesOpen: Story = {
  ...StatusesCollapsed,
  args: {
    ...StatusesCollapsed.args,
    status: Object.entries(index).reduce<State['status']>((acc, [id, item]) => {
      if (item.type !== 'story') {
        return acc;
      }

      return {
        ...acc,
        [id]: {
          addonA: { status: 'warn', title: 'Addon A', description: 'We just wanted you to know' },
          addonB: { status: 'error', title: 'Addon B', description: 'This is a big deal!' },
        },
      };
    }, {}),
  },
};

export const Searching: Story = {
  ...StatusesOpen,
  parameters: { theme: 'light', chromatic: { delay: 2200 } },
  play: async ({ canvasElement, step }) => {
    await step('wait 2000ms', () => wait(2000));
    const canvas = await within(canvasElement);
    const search = await canvas.findByPlaceholderText('Find components');
    userEvent.clear(search);
    userEvent.type(search, 'B2');
  },
};

export const Bottom: Story = {
  args: {
    previewInitialized: true,
  },
  parameters: { theme: 'light' },
  render: (args) => (
    <Sidebar
      {...args}
      menu={menu}
      extra={[]}
      index={index as any}
      storyId={storyId}
      refId={DEFAULT_REF_ID}
      refs={{}}
      status={{}}
      bottom={[
        {
          id: '1',
          type: types.experimental_SIDEBAR_BOTTOM,
          render: () => (
            <Button>
              <FaceHappyIcon />
              Custom addon A
            </Button>
          ),
        },
        {
          id: '2',
          type: types.experimental_SIDEBAR_BOTTOM,
          render: () => (
            <Button>
              {' '}
              <FaceHappyIcon />
              Custom addon B
            </Button>
          ),
        },
        {
          id: '3',
          type: types.experimental_SIDEBAR_BOTTOM,
          render: () => (
            <IconButton>
              {' '}
              <FaceHappyIcon />
            </IconButton>
          ),
        },
      ]}
    />
  ),
};

/**
 * Given the following sequence of events:
 * 1. Story is selected at the top of the sidebar
 * 2. The sidebar is scrolled to the bottom
 * 3. Some re-rendering happens because of a changed state/prop
 * The sidebar should remain scrolled to the bottom
 */
export const Scrolled: Story = {
  parameters: {
    // we need a very short viewport
    viewport: {
      defaultViewport: 'mobile1',
      defaultOrientation: 'landscape',
    },
  },
  render: (args) => {
    const [, setState] = React.useState(0);
    return (
      <>
        <button
          style={{ position: 'absolute', zIndex: 10 }}
          onClick={() => setState(() => Math.random())}
        >
          Change state
        </button>
        <Sidebar
          {...args}
          menu={menu}
          extra={[]}
          index={index as any}
          storyId="group-1--child-b1"
          refId={DEFAULT_REF_ID}
          refs={refs}
        />
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = await within(canvasElement);
    const scrollable = await canvasElement.querySelector('[data-radix-scroll-area-viewport]');
    await step('expand component', async () => {
      const componentNode = await canvas.queryAllByText('Child A2')[1];
      userEvent.click(componentNode);
    });
    await wait(100);
    await step('scroll to bottom', async () => {
      scrollable.scrollTo(0, scrollable.scrollHeight);
    });
    await step('toggle parent state', async () => {
      const button = await canvas.findByRole('button', { name: 'Change state' });
      button.click();
    });
    await wait(100);

    // expect the scrollable to be scrolled to the bottom
    expect(scrollable.scrollTop).toBe(scrollable.scrollHeight - scrollable.clientHeight);
  },
};
