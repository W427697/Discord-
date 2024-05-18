import { sanitize } from '@storybook/csf';

import { normalizeInputTypes } from './normalizeInputTypes';
import type { ModuleExports, NormalizedComponentAnnotations } from '@storybook/core/dist/types';
import type { Renderer } from '@storybook/core/dist/types';

export function normalizeComponentAnnotations<TRenderer extends Renderer>(
  defaultExport: ModuleExports['default'],
  title: string = defaultExport.title,
  importPath?: string
): NormalizedComponentAnnotations<TRenderer> {
  const { id, argTypes } = defaultExport;
  return {
    id: sanitize(id || title),
    ...defaultExport,
    title,
    ...(argTypes && { argTypes: normalizeInputTypes(argTypes) }),
    parameters: {
      fileName: importPath,
      ...defaultExport.parameters,
    },
  };
}
