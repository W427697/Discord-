import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import type { PropsWithChildren } from 'react';
import React from 'react';
// We need this import to be a singleton, and because it's used in multiple entrypoints
// both in ESM and CJS, importing it via the package name instead of having a local import
// is the only way to achieve it actually being a singleton
import { useRouter } from '@storybook/nextjs/router';

export const PageRouterProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <RouterContext.Provider value={useRouter()}>{children}</RouterContext.Provider>
);
