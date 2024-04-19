import type { Options } from '@storybook/types';
import {
  extractProperRendererNameFromFramework,
  getFrameworkName,
  getProjectRoot,
  rendererPackages,
} from '@storybook/core-common';
import path from 'node:path';
import fs from 'node:fs';
import { getTypeScriptTemplateForNewStoryFile } from './new-story-templates/typescript';
import { getJavaScriptTemplateForNewStoryFile } from './new-story-templates/javascript';
import type { CreateNewStoryRequestPayload } from '@storybook/core-events';

export async function getNewStoryFile(
  {
    componentFilePath,
    componentExportName,
    componentIsDefaultExport,
  }: CreateNewStoryRequestPayload,
  options: Options
) {
  const cwd = getProjectRoot();

  const frameworkPackageName = await getFrameworkName(options);
  const rendererName = await extractProperRendererNameFromFramework(frameworkPackageName);
  const rendererPackage = Object.entries(rendererPackages).find(
    ([, value]) => value === rendererName
  )?.[0];

  const basename = path.basename(componentFilePath);
  const extension = path.extname(componentFilePath);
  const basenameWithoutExtension = basename.replace(extension, '');
  const dirname = path.dirname(componentFilePath);

  const { storyFileName, isTypescript } = getStoryMetadata(componentFilePath);
  const storyFileExtension = isTypescript ? 'tsx' : 'jsx';
  const alternativeStoryFileName = `${basenameWithoutExtension}.${componentExportName}.stories.${storyFileExtension}`;

  const exportedStoryName = 'Default';

  const storyFileContent =
    isTypescript && rendererPackage
      ? await getTypeScriptTemplateForNewStoryFile({
          basenameWithoutExtension,
          componentExportName,
          componentIsDefaultExport,
          rendererPackage,
          exportedStoryName,
        })
      : await getJavaScriptTemplateForNewStoryFile({
          basenameWithoutExtension,
          componentExportName,
          componentIsDefaultExport,
          exportedStoryName,
        });

  const doesStoryFileExist = fs.existsSync(path.join(cwd, storyFileName));

  const storyFilePath = doesStoryFileExist
    ? path.join(cwd, dirname, alternativeStoryFileName)
    : path.join(cwd, dirname, storyFileName);

  return { storyFilePath, exportedStoryName, storyFileContent };
}

export const getStoryMetadata = (componentFilePath: string) => {
  const isTypescript = /\.(ts|tsx|mts|cts)$/.test(componentFilePath);
  const basename = path.basename(componentFilePath);
  const extension = path.extname(componentFilePath);
  const basenameWithoutExtension = basename.replace(extension, '');
  const storyFileExtension = isTypescript ? 'tsx' : 'jsx';
  return {
    storyFileName: `${basenameWithoutExtension}.stories.${storyFileExtension}`,
    isTypescript,
  };
};
