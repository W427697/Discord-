import React from 'react';
import { addons, types } from '@junk-temporary-prototypes/manager-api';

import { ADDON_ID } from './constants';
import { OutlineSelector } from './OutlineSelector';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Outline',
    id: 'outline',
    type: types.TOOL,
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => <OutlineSelector />,
  });
});
