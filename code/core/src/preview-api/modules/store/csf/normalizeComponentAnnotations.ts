import { sanitize } from '@storybook/csf';

import { normalizeInputTypes } from './normalizeInputTypes';
import type {
  ModuleExports,
  NormalizedComponentAnnotations,
} from '../../../../types/modules/story';
import type { Renderer } from '../../../../types/modules/csf';

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
