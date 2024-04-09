import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { useRouter } from './index';

export const PageRouterProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <RouterContext.Provider value={useRouter()}>{children}</RouterContext.Provider>
);
