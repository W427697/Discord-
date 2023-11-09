import type { PropsWithChildren } from 'react';
import React from 'react';
import { Storybook } from './components/Storybook';

function Page({ children }: PropsWithChildren<{}>) {
  return <Storybook />;
}

export default Page;
