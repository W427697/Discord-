import * as React from 'react';
import * as rawComponents from './typography/DocumentFormatting';
import { docsEscapeHatchFromId } from './docsEscapeHatch';

export * from './typography/DocumentFormatting';

export const components = Object.entries(rawComponents).reduce(
  (acc, [k, V]) => ({
    ...acc,
    [k.toLowerCase()]: ({ className, ...rest }: { className: string }) => {
      return <V {...rest} className={docsEscapeHatchFromId(k, className)} />;
    },
  }),
  {}
);
