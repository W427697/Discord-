import type { FrameworkPlugin } from '@previewjs/core';
import { setupFrameworkPlugin } from '@previewjs/core';
import preactFrameworkPlugin from '@previewjs/plugin-preact';
import type { TypeAnalyzer } from '@previewjs/type-analyzer';
import { createTypeAnalyzer } from '@previewjs/type-analyzer';
import type { Reader } from '@previewjs/vfs';
import { createFileSystemReader } from '@previewjs/vfs';
import type { SBType } from '@storybook/types';
import type { PluginOptions } from '.';
import { convertToStorybook } from './conversion';

export const create = (options: Pick<PluginOptions, 'rootDir'>) => {
  const analyzer = {
    async analyze(fileName: string): Promise<{ name: string; args: SBType }[]> {
      const components = await frameworkPlugin.detectComponents(reader, typeAnalyzer, [fileName]);
      const results: { name: string; args: any }[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const component of components) {
        if (component.info.kind === 'story') {
          // eslint-disable-next-line no-await-in-loop
          const detectedType = (await component.info.associatedComponent?.analyze())?.propsType;
          if (detectedType) {
            results.push({
              name: component.name,
              args: convertToStorybook(detectedType),
            });
          }
        }
      }
      return results;
    },
  };

  let typeAnalyzer: TypeAnalyzer;
  let frameworkPlugin: FrameworkPlugin;
  let reader: Reader;

  const init = async () => {
    if (!reader) {
      reader = createFileSystemReader();
    }
    if (!typeAnalyzer) {
      typeAnalyzer = createTypeAnalyzer({
        rootDirPath: options.rootDir,
        reader,
      });
    }
    if (!frameworkPlugin) {
      frameworkPlugin = await setupFrameworkPlugin({
        rootDirPath: options.rootDir,
        frameworkPluginFactories: [preactFrameworkPlugin],
      });
    }
  };

  return { analyzer, init };
};
