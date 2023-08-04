import type { FC } from 'react';
import React from 'react';

import type { Combo } from '@storybook/manager-api';
import { Consumer } from '@storybook/manager-api';

import NotificationList from './NotificationList';

const mapper = ({ state, api }: Combo) => {
  return {
    notifications: state.notifications,
    clearNotification: api.clearNotification,
  };
};

export const Notifications: FC<any> = (props) => (
  <Consumer filter={mapper}>
    {(fromState) => <NotificationList {...props} {...fromState} />}
  </Consumer>
);
