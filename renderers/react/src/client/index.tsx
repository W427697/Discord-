import ReactDOM from 'react-dom';
import React from 'react';
import { registerRenderer, useEffect, useMemo } from '@storybook/client-api';
import { document } from 'global';

import './globals';
import render from './render';

export const register = (skipOuter?: boolean) =>
  registerRenderer({
    framework: 'react',
    inner: (Story, context) => <Story {...context} />,
    outer: skipOuter
      ? null
      : async (getStory, context) => {
          const node = useMemo(() => document.createElement('div'), [context.kind, context.name]);
          useEffect(() => () => ReactDOM.unmountComponentAtNode(node), [node]);
          await render(getStory(context), node, context);
          return node;
        },
  });

export { render };
