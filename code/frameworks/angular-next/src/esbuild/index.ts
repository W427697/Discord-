import { dirname, join, parse } from 'path';
import fs from 'fs-extra';
import { getOptions } from '@storybook/builder-esbuild';
import { buildApplication, ApplicationBuilderOptions } from '@angular-devkit/build-angular';
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { Builder, Options } from '@storybook/types';
import { BuildOutputFile } from '@angular-devkit/build-angular/src/tools/esbuild/bundler-context';
import { getExtendBuildOptionPlugin } from './plugins/extend-build-options-plugin';

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any;

type BuilderOptions = Options & {
  applicationBuilderOptions: ApplicationBuilderOptions;
  builderContext: BuilderContext;
};

type AngularBuilder = Builder<{}, { toJson: () => Record<string, any> }, BuilderOptions>;

export const build: AngularBuilder['build'] = async ({ options }): Promise<any> => {
  const esbuildOptions = await getOptions(options);

  type Results = (BuilderOutput & {
    outputFiles?: BuildOutputFile[];
    assetFiles?: {
      source: string;
      destination: string;
    }[];
  })[];

  // eslint-disable-next-line no-async-promise-executor
  const result = new Promise<Results>(async (res) => {
    const results: Results = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const r of buildApplication(
      options.applicationBuilderOptions,
      options.builderContext,
      [...esbuildOptions.plugins, getExtendBuildOptionPlugin(esbuildOptions)]
    )) {
      results.push(r);
    }
    res(results);
  });

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

  const [out] = await Promise.all([result, previewFiles]);

  return out;
};

export const corePresets = [require.resolve('@storybook/builder-esbuild/presets/preview-preset')];
