import React from 'react';
import { ComponentMeta, Story, ComponentStory } from '@storybook/react';
import TsButton from '../../components/TsButton';

const Meta: ComponentMeta<typeof TsButton> = {
  title: 'Other/Demo/TsButton',
  component: TsButton,
  decorators: [
    (StoryFn) => (
      <>
        <StoryFn />
      </>
    ),
  ],
};

export default Meta;

const Template: Story = (args) => <TsButton {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  type: 'default',
  children: 'basic',
};

const TypedTemplate: ComponentStory<typeof TsButton> = (args) => <TsButton {...args} />;

export const Typed = TypedTemplate.bind({});
Typed.args = {
  type: 'action',
  children: 'typed',
  foo: 'bar', // should be a type error?
};
