'use client';

import type { PropsWithChildren } from 'react';
import React, { useRef } from 'react';
import { Preview } from './Preview';

export const Storybook = ({ children }: PropsWithChildren<{}>) => {
  const ref = useRef(null); // To be used by the play fn?
  return (
    <div id="storybook-root" ref={ref}>
      <Preview />

      {children}
    </div>
  );
};
