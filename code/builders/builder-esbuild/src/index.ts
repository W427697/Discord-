import { dirname, join, parse } from 'path';
import fs from 'fs-extra';
import { build as esbuild } from 'esbuild';
import { type EsbuildBuilder } from './types';
import { getOptions } from './build';

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any;

export * from './types';

export const build: EsbuildBuilder['build'] = async ({ options }) => {
  const esbuildOptions = await getOptions(options);
  const esbuildCompilation = esbuild(esbuildOptions);

  const previewResolvedDir = getAbsolutePath('@storybook/preview');
  const previewDirOrigin = join(previewResolvedDir, 'dist');
  const previewDirTarget = join(options.outputDir || '', `sb-preview`);

  const previewFiles = fs.copy(previewDirOrigin, previewDirTarget, {
    filter: (src) => {
      const { ext } = parse(src);
      if (ext) {
        return ext === '.js';
      }
      return true;
    },
  });

  const [out] = await Promise.all([esbuildCompilation, previewFiles]);

  return out;
};

export const corePresets = [join(__dirname, 'presets/preview-preset.js')];
