'use client';

import type { PropsWithChildren } from 'react';
import React, { forwardRef } from 'react';
import { Preview } from './Preview';

export const Storybook = forwardRef(({ children }: PropsWithChildren<{}>, ref) => {
  return (
    <div id="storybook-root" ref={ref}>
      <Preview />

      {children}
    </div>
  );
});
