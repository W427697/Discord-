import React from 'react';
import type { ComponentMeta, ComponentStoryFn } from '@storybook/react';
import { Welcome } from './react-demo';

export default {
  title: 'Welcome',
  component: Welcome,
} as ComponentMeta<typeof Welcome>;

export const ToStorybook: ComponentStoryFn<typeof Welcome> = () => <Welcome showApp={() => {}} />;

ToStorybook.storyName = 'to Storybook';
