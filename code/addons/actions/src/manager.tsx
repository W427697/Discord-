import React, { useState } from 'react';
import { addons, types, useChannel } from '@storybook/manager-api';
import { STORY_CHANGED } from '@storybook/core-events';
import { Badge, Spaced } from '@storybook/components';
import ActionLogger from './containers/ActionLogger';
import { ADDON_ID, CLEAR_ID, EVENT_ID, PANEL_ID, PARAM_KEY } from './constants';

function Title() {
  const [count, setCount] = useState(0);

  useChannel({
    [EVENT_ID]: () => {
      setCount((c) => c + 1);
    },
    [STORY_CHANGED]: () => {
      setCount(0);
    },
    [CLEAR_ID]: () => {
      setCount(0);
    },
  });

  const suffix = count === 0 ? '' : <Badge status="neutral">{count}</Badge>;

  return (
    <div>
      <Spaced col={1}>
        <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>Actions</span>
        {suffix}
      </Spaced>
    </div>
  );
}

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    title: Title,
    type: types.PANEL,
    render: ({ active, key }) => <ActionLogger key={key} api={api} active={!!active} />,
    paramKey: PARAM_KEY,
  });
});
