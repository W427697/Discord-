import React from 'react';
import {
  LayoutRouterContext,
  AppRouterContext,
  GlobalLayoutRouterContext,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {
  PathnameContext,
  SearchParamsContext,
} from 'next/dist/shared/lib/hooks-client-context.shared-runtime';
import type { FlightRouterState } from 'next/dist/server/app-render/types';
import type { RouteParams } from '../types';
// We need this import to be a singleton, and because it's used in multiple entrypoints
// both in ESM and CJS, importing it via the package name instead of having a local import
// is the only way to achieve it actually being a singleton
import { useRouter } from '@storybook/nextjs/navigation';

type AppRouterProviderProps = {
  routeParams: RouteParams;
};

const getParallelRoutes = (segmentsList: Array<string>): FlightRouterState => {
  const segment = segmentsList.shift();

  if (segment) {
    return [segment, { children: getParallelRoutes(segmentsList) }];
  }

  return [] as any;
};

export const AppRouterProvider: React.FC<React.PropsWithChildren<AppRouterProviderProps>> = ({
  children,
  routeParams,
}) => {
  const { pathname, query, segments = [] } = routeParams;

  const tree: FlightRouterState = [pathname, { children: getParallelRoutes([...segments]) }];

  // https://github.com/vercel/next.js/blob/canary/packages/next/src/client/components/app-router.tsx#L436
  return (
    <PathnameContext.Provider value={pathname}>
      <SearchParamsContext.Provider value={new URLSearchParams(query)}>
        <GlobalLayoutRouterContext.Provider
          value={{
            changeByServerResponse() {
              // NOOP
            },
            buildId: 'storybook',
            tree,
            focusAndScrollRef: {
              apply: false,
              hashFragment: null,
              segmentPaths: [tree],
              onlyHashChange: false,
            },
            nextUrl: pathname,
          }}
        >
          <AppRouterContext.Provider value={useRouter()}>
            <LayoutRouterContext.Provider
              value={{
                childNodes: new Map(),
                tree,
                url: pathname,
              }}
            >
              {children}
            </LayoutRouterContext.Provider>
          </AppRouterContext.Provider>
        </GlobalLayoutRouterContext.Provider>
      </SearchParamsContext.Provider>
    </PathnameContext.Provider>
  );
};
