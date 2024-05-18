import React from 'react';

import { ThemeProvider, themes, ensure } from '@storybook/core/dist/theming';
import type { Renderer } from '@storybook/core/dist/types';

import { DocsContext } from '../DocsContext';
import { ExternalPreview } from './ExternalPreview';

let preview: ExternalPreview<Renderer>;

export const ExternalDocsContainer: React.FC<
  React.PropsWithChildren<{ projectAnnotations: any }>
> = ({ projectAnnotations, children }) => {
  if (!preview) preview = new ExternalPreview(projectAnnotations);

  return (
    <DocsContext.Provider value={preview.docsContext()}>
      <ThemeProvider theme={ensure(themes.light)}>{children}</ThemeProvider>
    </DocsContext.Provider>
  );
};
