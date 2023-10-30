import type { LoadedPreset, StorybookConfig } from '@storybook/types';
import { join } from 'path';

const hasDocs = (presetsList: LoadedPreset[]) => {
  return presetsList.some((preset: string | { name: string }) => {
    const presetName = typeof preset === 'string' ? preset : preset.name;
    return presetName.includes('@storybook/addon-docs');
  });
};

export const previewAnnotations: StorybookConfig['previewAnnotations'] = async (input, options) => {
  const { presetsList } = options;
  if (!presetsList) {
    return input;
  }
  const docsInList = hasDocs(presetsList);
  const result: string[] = [];

  return result
    .concat(input)
    .concat([join(__dirname, 'preview.mjs')])
    .concat(docsInList ? [join(__dirname, 'preview-docs.mjs')] : []);
};
