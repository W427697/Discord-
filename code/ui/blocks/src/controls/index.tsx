import React, { ComponentProps, lazy, Suspense } from 'react';
import type { ColorControlProps } from './Color';

// eslint-disable-next-line import/no-cycle
export * from './types';

// eslint-disable-next-line import/no-cycle
export * from './Boolean';

export type ColorProps = ColorControlProps;

// eslint-disable-next-line import/no-cycle
const LazyColorControl = lazy(() => import('./Color'));

export const ColorControl = (props: ComponentProps<typeof LazyColorControl>) => (
  <Suspense fallback={<div />}>
    <LazyColorControl {...props} />
  </Suspense>
);

// eslint-disable-next-line import/no-cycle
export * from './Date';
// eslint-disable-next-line import/no-cycle
export * from './Number';
// eslint-disable-next-line import/no-cycle
export * from './options';
export * from './Object';
// eslint-disable-next-line import/no-cycle
export * from './Range';
// eslint-disable-next-line import/no-cycle
export * from './Text';
// eslint-disable-next-line import/no-cycle
export * from './Files';
