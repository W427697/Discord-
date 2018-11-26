import React from 'react';
import addons from '@storybook/addons';
import CodeinjectorPanel from './CodeinjectorPanel';

addons.register('storybook/codeinjector', api => {
  const channel = addons.getChannel();
  addons.addPanel('storybook/codeinjector/panel', {
    title: 'Codeinjector',
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => <CodeinjectorPanel channel={channel} api={api} active={active} />,
  });
});
