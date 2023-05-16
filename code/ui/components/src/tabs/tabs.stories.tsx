import { expect } from '@storybook/jest';
import type { Key } from 'react';
import React, { Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { logger } from '@storybook/client-logger';
import type { Meta, StoryObj } from '@storybook/react';
import {
  within,
  fireEvent,
  waitFor,
  screen,
  getByText,
  userEvent,
} from '@storybook/testing-library';
import { Tabs, TabsState, TabWrapper } from './tabs';

const colours = Array.from(new Array(15), (val, index) => index).map((i) =>
  Math.floor((1 / 15) * i * 16777215)
    .toString(16)
    .padStart(6, '0')
);

interface FibonacciMap {
  [key: string]: number;
}

function fibonacci(num: number, memo?: FibonacciMap): number {
  /* eslint-disable no-param-reassign */
  if (!memo) {
    memo = {};
  }
  if (memo[num]) {
    return memo[num];
  }
  if (num <= 1) {
    return 1;
  }

  memo[num] = fibonacci(num - 1, memo) + fibonacci(num - 2, memo);
  return memo[num];
  /* eslint-enable no-param-reassign */
}

interface Panels {
  [key: string]: {
    title: string;
    color?: string;
    render: ({ active, key }: { active: boolean; key: Key }) => JSX.Element | undefined;
  };
}

const panels: Panels = {
  test1: {
    title: 'Tab title #1',
    render: ({ active, key }) =>
      active ? (
        <div id="test1" key={key}>
          CONTENT 1
        </div>
      ) : undefined,
  },
  test2: {
    title: 'Tab title #2',
    render: ({ active, key }) => (
      <div
        key={key}
        id="test2"
        style={{
          background: 'hotpink',
          minHeight: '100%',
          display: active ? 'block' : 'none',
        }}
      >
        CONTENT 2
      </div>
    ),
  },
  test3: {
    title: 'Tab title #3',
    render: ({ active, key }) =>
      active ? (
        <div id="test3" key={key}>
          {colours.map((colour, i) => (
            <div
              key={colour}
              style={{
                background: `#${colour}`,
                height: 30 + fibonacci(i + 5) / 10,
              }}
            />
          ))}
        </div>
      ) : undefined,
  },
  test4: {
    title: 'Tab title #4',
    render: ({ active, key }) =>
      active ? (
        <div key={key} id="test4">
          CONTENT 4
        </div>
      ) : undefined,
  },
  test5: {
    title: 'Tab title #5',
    render: ({ active, key }) =>
      active ? (
        <div key={key} id="test5">
          CONTENT 5
        </div>
      ) : undefined,
  },
  test6: {
    title: 'Tab title #6',
    render: ({ active, key }) => (
      <TabWrapper key={key} active={active} render={() => <div>CONTENT 6</div>} />
    ),
  },
};

const onSelect = action('onSelect');

const content = Object.entries(panels).map(([k, v]) => (
  <div key={k} id={k} title={v.title}>
    {v.render}
  </div>
));

export default {
  title: 'Tabs',
  decorators: [
    (story: any) => (
      <div
        style={{
          position: 'relative',
          height: 'calc(100vh - 20px)',
          width: 'calc(100vw - 20px)',
          margin: 10,
        }}
      >
        {story()}
      </div>
    ),
  ],
  args: {
    menuName: 'Addons',
  },
} satisfies Meta<typeof TabsState>;

type Story = StoryObj<typeof TabsState>;

export const StatefulStatic = {
  render: (args: any) => (
    <TabsState initial="test2" {...args}>
      <div id="test1" title="With a function">
        {({ active, selected }: { active: boolean; selected: string }) =>
          active ? <div>{selected} is selected</div> : null
        }
      </div>
      <div id="test2" title="With markup">
        <div>test2 is always active (but visually hidden)</div>
      </div>
    </TabsState>
  ),
} satisfies Story;

export const StatefulStaticWithSetButtonTextColors = {
  render: (args: any) => (
    <div>
      <TabsState initial="test2" {...args}>
        <div id="test1" title="With a function" color="#e00000">
          {({ active, selected }: { active: boolean; selected: string }) =>
            active ? <div>{selected} is selected</div> : null
          }
        </div>
        <div id="test2" title="With markup" color="green">
          <div>test2 is always active (but visually hidden)</div>
        </div>
      </TabsState>
    </div>
  ),
} satisfies Story;

export const StatefulStaticWithSetBackgroundColor = {
  render: (args: any) => (
    <div>
      <TabsState initial="test2" backgroundColor="rgba(0,0,0,.05)" {...args}>
        <div id="test1" title="With a function" color="#e00000">
          {({ active, selected }: { active: boolean; selected: string }) =>
            active ? <div>{selected} is selected</div> : null
          }
        </div>
        <div id="test2" title="With markup" color="green">
          <div>test2 is always active (but visually hidden)</div>
        </div>
      </TabsState>
    </div>
  ),
} satisfies Story;

const customViewports = {
  chromatic: {
    name: 'Chromatic',
    styles: {
      width: '380px',
      height: '963px',
    },
  },
};

export const StatefulDynamicWithOpenTooltip = {
  parameters: {
    viewport: {
      defaultViewport: 'chromatic',
      viewports: customViewports,
    },
    chromatic: { viewports: [380] },
  },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);

    await waitFor(async () => {
      await expect(canvas.getAllByRole('tab')).toHaveLength(3);
      await expect(canvas.getByRole('tab', { name: /Addons/ })).toBeInTheDocument();
    });

    const addonsTab = await canvas.findByRole('tab', { name: /Addons/ });

    await waitFor(async () => {
      const tooltip = await screen.queryByTestId('tooltip');

      if (!tooltip) {
        await userEvent.click(addonsTab);
      }

      if (!tooltip) {
        throw new Error('Tooltip not found');
      }
    });

    expect(screen.queryByTestId('tooltip')).toBeInTheDocument();
  },
  render: (args: any) => (
    <TabsState initial="test1" {...args}>
      {Object.entries(panels).map(([k, v]) => (
        <div key={k} id={k} title={v.title}>
          {v.render}
        </div>
      ))}
    </TabsState>
  ),
} satisfies Story;

export const StatefulDynamicWithSelectedAddon = {
  parameters: {
    viewport: {
      defaultViewport: 'chromatic',
      viewports: customViewports,
    },
    chromatic: { viewports: [380] },
  },
  play: async (context: any) => {
    await StatefulDynamicWithOpenTooltip.play(context);

    const popperContainer = screen.getByTestId('tooltip');
    const tab4 = getByText(popperContainer, 'Tab title #4', {});
    fireEvent(tab4, new MouseEvent('click', { bubbles: true }));
    await waitFor(() => screen.getByText('CONTENT 4'));

    // reopen the tooltip
    await StatefulDynamicWithOpenTooltip.play(context);
  },
  render: (args: any) => (
    <TabsState initial="test1" {...args}>
      {Object.entries(panels).map(([k, v]) => (
        <div key={k} id={k} title={v.title}>
          {v.render}
        </div>
      ))}
    </TabsState>
  ),
} satisfies Story;

export const StatefulNoInitial = {
  render: (args: any) => <TabsState {...args}>{content}</TabsState>,
} satisfies Story;

export const StatelessBordered = {
  render: (args: any) => (
    <Tabs
      bordered
      absolute={false}
      selected="test3"
      menuName="Addons"
      actions={{
        onSelect,
      }}
      {...args}
    >
      {content}
    </Tabs>
  ),
} satisfies Story;

export const StatelessWithTools = {
  render: (args: any) => (
    <Tabs
      selected="test3"
      menuName="Addons"
      actions={{
        onSelect,
      }}
      tools={
        <Fragment>
          <button type="button" onClick={() => logger.log('1')}>
            1
          </button>
          <button type="button" onClick={() => logger.log('2')}>
            2
          </button>
        </Fragment>
      }
      {...args}
    >
      {content}
    </Tabs>
  ),
} satisfies Story;

export const StatelessAbsolute = {
  render: (args: any) => (
    <Tabs
      absolute
      selected="test3"
      menuName="Addons"
      actions={{
        onSelect,
      }}
      {...args}
    >
      {content}
    </Tabs>
  ),
} satisfies Story;

export const StatelessAbsoluteBordered = {
  render: (args: any) => (
    <Tabs
      absolute
      bordered
      menuName="Addons"
      selected="test3"
      actions={{
        onSelect,
      }}
      {...args}
    >
      {content}
    </Tabs>
  ),
} satisfies Story;

export const StatelessEmpty = {
  render: (args: any) => (
    <Tabs
      actions={{
        onSelect,
      }}
      bordered
      menuName="Addons"
      absolute
      {...args}
    />
  ),
} satisfies Story;
