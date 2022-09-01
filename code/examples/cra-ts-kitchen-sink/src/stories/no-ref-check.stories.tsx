import React, { Profiler } from 'react';
import { Button } from './Button';

export default {
  title: 'noRefCheck',
};

const Template = (args: any) => (
  <Profiler id="test" onRender={() => console.log('test-profiler')}>
    <Button {...args}>Button</Button>
  </Profiler>
);

export const Primary = Template.bind({});

Primary.args = {
  primary: true,
  onClick: () => console.log('test-button'),
};
