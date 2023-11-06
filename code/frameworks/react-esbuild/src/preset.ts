import type { PresetProperty } from '@storybook/types';
import { dirname, join } from 'path';

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any;

export const core: PresetProperty<'core', any> = {
  builder: getAbsolutePath('@storybook/builder-esbuild'),
  renderer: getAbsolutePath('@storybook/react'),
};
