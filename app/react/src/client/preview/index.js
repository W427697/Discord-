import React from 'react';
import { start } from '@storybook/core/client';

import render from './render';

// This is a total hack for a POC
export const el = React.createRef();

// start() normally renders immediately to #root
const { clientApi, configApi, forceReRender } = start(
  (context, force) => console.log(el.current) || (el.current && render(context, force, el.current))
);

export const {
  storiesOf,
  setAddon,
  addDecorator,
  addParameters,
  clearDecorators,
  getStorybook,
} = clientApi;

export const { configure } = configApi;
export { forceReRender };
