import type { Options } from '@storybook/types';
import { getFrameworkName, getProjectRoot } from '@storybook/core-common';
import path from 'path';
import fs from 'fs';
import { getTypeScriptTemplateForNewStoryFile } from './new-story-templates/typescript';
import { getJavaScriptTemplateForNewStoryFile } from './new-story-templates/javascript';

interface Data {
  filepath: string;
  componentExportName: string;
  default: boolean;
}

export async function getNewStoryFile(
  { filepath, componentExportName, default: isDefault }: Data,
  options: Options
) {
  const isTypescript = /\.(ts|tsx|mts|cts)$/.test(filepath);
  const cwd = getProjectRoot();

  const frameworkPackage = await getFrameworkName(options);

  const basename = path.basename(filepath);
  const extension = path.extname(filepath);
  const basenameWithoutExtension = basename.replace(extension, '');
  const dirname = path.dirname(filepath);

  const storyFileExtension = isTypescript ? 'tsx' : 'jsx';
  const storyFileName = `${basenameWithoutExtension}.stories.${storyFileExtension}`;
  const alternativeStoryFileName = `${basenameWithoutExtension}.${componentExportName}.stories.${storyFileExtension}`;

  const exportedStoryName = 'Default';

  const storyFileContent = isTypescript
    ? getTypeScriptTemplateForNewStoryFile({
        basename: basenameWithoutExtension,
        componentExportName: componentExportName,
        default: isDefault,
        frameworkPackageName: frameworkPackage,
        exportedStoryName,
      })
    : getJavaScriptTemplateForNewStoryFile({
        basename: basenameWithoutExtension,
        componentExportName: componentExportName,
        default: isDefault,
        exportedStoryName,
      });

  const doesStoryFileExist = fs.existsSync(path.join(cwd, filepath));

  const storyFilePath = doesStoryFileExist
    ? path.join(cwd, dirname, alternativeStoryFileName)
    : path.join(cwd, dirname, storyFileName);

  return { storyFilePath, exportedStoryName, storyFileContent };
}
