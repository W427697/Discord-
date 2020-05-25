import React from 'react';
import { DocgenButton } from '../../components/DocgenButton';

export default {
  title: 'Addons/Docs/ArgsStory',
  component: DocgenButton,
  parameters: { chromatic: { disable: true } },
};

export const One = (args: any) => <DocgenButton {...args} />;
One.args = { label: 'One' };

export const Two = (args: any) => <DocgenButton {...args} />;
Two.args = { label: 'Two' };
