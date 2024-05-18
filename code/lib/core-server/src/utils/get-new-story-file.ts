import type { Options } from '@storybook/core/dist/types';
import {
  extractProperRendererNameFromFramework,
  getFrameworkName,
  getProjectRoot,
  rendererPackages,
} from '@storybook/core/dist/common';
import path from 'node:path';
import fs from 'node:fs';
import { getTypeScriptTemplateForNewStoryFile } from './new-story-templates/typescript';
import { getJavaScriptTemplateForNewStoryFile } from './new-story-templates/javascript';
import type { CreateNewStoryRequestPayload } from '@storybook/core/dist/core-events';

export async function getNewStoryFile(
  {
    componentFilePath,
    componentExportName,
    componentIsDefaultExport,
    componentExportCount,
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

  const { storyFileName, isTypescript, storyFileExtension } = getStoryMetadata(componentFilePath);
  const storyFileNameWithExtension = `${storyFileName}.${storyFileExtension}`;
  const alternativeStoryFileNameWithExtension = `${basenameWithoutExtension}.${componentExportName}.stories.${storyFileExtension}`;

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

  const storyFilePath =
    doesStoryFileExist(path.join(cwd, dirname), storyFileName) && componentExportCount > 1
      ? path.join(cwd, dirname, alternativeStoryFileNameWithExtension)
      : path.join(cwd, dirname, storyFileNameWithExtension);

  return { storyFilePath, exportedStoryName, storyFileContent, dirname };
}

export const getStoryMetadata = (componentFilePath: string) => {
  const isTypescript = /\.(ts|tsx|mts|cts)$/.test(componentFilePath);
  const basename = path.basename(componentFilePath);
  const extension = path.extname(componentFilePath);
  const basenameWithoutExtension = basename.replace(extension, '');
  const storyFileExtension = isTypescript ? 'tsx' : 'jsx';
  return {
    storyFileName: `${basenameWithoutExtension}.stories`,
    storyFileExtension,
    isTypescript,
  };
};

export const doesStoryFileExist = (parentFolder: string, storyFileName: string) => {
  return (
    fs.existsSync(path.join(parentFolder, `${storyFileName}.ts`)) ||
    fs.existsSync(path.join(parentFolder, `${storyFileName}.tsx`)) ||
    fs.existsSync(path.join(parentFolder, `${storyFileName}.js`)) ||
    fs.existsSync(path.join(parentFolder, `${storyFileName}.jsx`))
  );
};
