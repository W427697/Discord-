import type { PropsWithChildren } from 'react';
import React from 'react';
import { Storybook } from './components/Storybook';

function Layout({ children }: PropsWithChildren<{}>) {
  return <Storybook>{children}</Storybook>;
}

export default Layout;
