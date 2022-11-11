/// <reference types="@types/jest" />;
/// <reference types="@testing-library/jest-dom" />;
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Canvas } from '../Canvas';
import { Story as StoryComponent } from '../Story';
import * as BooleanStories from '../../controls/Boolean.stories';

const meta: Meta<typeof Canvas> = {
  title: 'Blocks/Internal/Canvas',
  component: Canvas,
  parameters: {
    relativeCsfPaths: ['../controls/Boolean.stories'],
  },
  render: (args) => {
    return (
      <Canvas {...args}>
        <StoryComponent of={BooleanStories.Undefined} />
      </Canvas>
    );
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const expectAmountOfStoriesInSource =
  (amount: number): Story['play'] =>
  async ({ canvasElement }) => {
    // TODO: it's bad that we have to resort to querySelector here, our markup isn't very accessible

    // Arrange - find the story element
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const story = within(canvasElement.querySelector('.docs-story')!);

    // Act - click button to show code
    await userEvent.click(story.getByText('Show code'));

    // Arrange - find the story element
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const source = within(canvasElement.querySelector('pre')!);
    // Assert - check that the correct amount of stories' source is shown
    const booleanControlNodes = await source.findAllByText('BooleanControl');
    expect(booleanControlNodes).toHaveLength(amount);
  };

export const MultipleChildren: Story = {
  render: (args) => {
    return (
      <Canvas {...args}>
        <StoryComponent of={BooleanStories.True} />
        <StoryComponent of={BooleanStories.False} />
      </Canvas>
    );
  },
  play: expectAmountOfStoriesInSource(2),
};

export const MultipleChildrenColumns: Story = {
  args: {
    isColumn: true,
  },
  render: (args) => {
    return (
      <Canvas {...args}>
        <StoryComponent of={BooleanStories.True} />
        <StoryComponent of={BooleanStories.False} />
      </Canvas>
    );
  },
  play: expectAmountOfStoriesInSource(2),
};

export const MultipleChildrenThreeColumns: Story = {
  args: {
    columns: 3,
  },
  render: (args) => {
    return (
      <Canvas {...args}>
        <StoryComponent of={BooleanStories.True} />
        <StoryComponent of={BooleanStories.True} />
        <StoryComponent of={BooleanStories.True} />
        <StoryComponent of={BooleanStories.False} />
        <StoryComponent of={BooleanStories.False} />
        <StoryComponent of={BooleanStories.False} />
        <StoryComponent of={BooleanStories.Undefined} />
        <StoryComponent of={BooleanStories.Undefined} />
        <StoryComponent of={BooleanStories.Undefined} />
      </Canvas>
    );
  },
  play: expectAmountOfStoriesInSource(9),
};

export const MixedChildrenStories: Story = {
  args: { isColumn: true },
  render: (args) => {
    return (
      <Canvas {...args}>
        <h1>Headline for Boolean Controls true</h1>
        <StoryComponent of={BooleanStories.True} />
        <h1>Headline for Boolean Controls undefined</h1>
        <StoryComponent of={BooleanStories.Undefined} />
      </Canvas>
    );
  },
  play: async (args) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await expectAmountOfStoriesInSource(2)!(args);

    // Arrange - find canvas element
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const story = within(args.canvasElement.querySelector('.docs-story')!);
    // Assert - find two headlines
    expect(story.queryAllByText(/Headline for Boolean Controls/i)).toHaveLength(2);

    // Arrange - find source code element
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const source = within(args.canvasElement.querySelector('pre')!);

    // Assert - headlines are not in source code
    expect(source.queryByText(/Headline for Boolean Controls/i)).not.toBeInTheDocument();
  },
};
