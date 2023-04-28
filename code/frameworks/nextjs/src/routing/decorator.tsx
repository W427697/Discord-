import * as React from 'react';
// this will be aliased by webpack at runtime (this is just for typing)
import type { action as originalAction } from '@junk-temporary-prototypes/addon-actions';
import type { Addon_StoryContext } from '@junk-temporary-prototypes/types';
import AppRouterProvider from './app-router-provider';

import PageRouterProvider from './page-router-provider';
import type { RouteParams, NextAppDirectory } from './types';

let action: typeof originalAction;

try {
  action = require('@junk-temporary-prototypes/addon-actions').action;
} catch {
  action = () => () => {};
}

const defaultRouterParams: RouteParams = {
  pathname: '/',
  query: {},
};

export const RouterDecorator = (
  Story: React.FC,
  { globals, parameters }: Addon_StoryContext
): React.ReactNode => {
  const nextAppDirectory =
    (parameters.nextjs?.appDirectory as NextAppDirectory | undefined) ?? false;

  if (nextAppDirectory) {
    return (
      <AppRouterProvider
        action={action}
        routeParams={{
          ...defaultRouterParams,
          ...parameters.nextjs?.navigation,
        }}
      >
        <Story />
      </AppRouterProvider>
    );
  }

  return (
    <PageRouterProvider
      action={action}
      globals={globals}
      routeParams={{
        ...defaultRouterParams,
        ...parameters.nextjs?.router,
      }}
    >
      <Story />
    </PageRouterProvider>
  );
};
