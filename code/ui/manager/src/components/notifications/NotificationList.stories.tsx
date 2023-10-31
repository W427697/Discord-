import React from 'react';
import { LocationProvider } from '@storybook/router';
import type { Meta } from '@storybook/react';

import { NotificationList } from './NotificationList';
import * as itemStories from './NotificationItem.stories';

const meta = {
  component: NotificationList,
  title: 'Notifications/NotificationList',
  decorators: [
    (StoryFn) => (
      <LocationProvider>
        <StoryFn />
      </LocationProvider>
    ),

    (storyFn) => (
      <div style={{ width: '240px', margin: '1rem', position: 'relative', height: '100%' }}>
        {storyFn()}
      </div>
    ),
  ],
  excludeStories: /.*Data$/,
} satisfies Meta<typeof NotificationList>;

export default meta;

type ItemStories = typeof itemStories & { [key: string]: any };

const items = Array.from(Object.keys(itemStories as ItemStories))
  .filter((key) => !['default', '__namedExportsOrder'].includes(key))
  .map((key) => (itemStories as ItemStories)[key].args.notification);

console.log(items);

export const singleData = [items[0]];
export const allData = items;

function clearNotification() {}

export const Single = () => (
  <NotificationList notifications={singleData} clearNotification={clearNotification} />
);

export const All = () => (
  <NotificationList notifications={allData} clearNotification={clearNotification} />
);
