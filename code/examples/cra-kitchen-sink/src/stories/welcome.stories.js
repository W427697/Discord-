import React from 'react';
import { Welcome } from '../components/react-demo';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const Story1 = () => <Welcome showApp={() => {}} />;
Story1.title = 'to Storybook';
