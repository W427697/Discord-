import path from 'path';
import dedent from 'ts-dedent';
import { writeFile, existsSync } from 'fs-extra';
import { getAllPresets } from '@storybook/core-common';
import { logger } from '@storybook/node-logger';

import { viewLayers } from './view-layers';

export const getAnnotationsFileContent = (presets: string[], replaceEsmWithCjs?: boolean) => {
  const presetNames: string[] = [];
  const presetImports: string[] = [];

  let previewFile;
  const [firstImport] = presets.slice(-1);
  if (firstImport.indexOf('preview') !== -1) {
    previewFile = presets.pop();
  }

  const categorizedPresets = presets.map((preset) => {
    // if it's a storybook app like @storybook/react, then it's a framework preset
    const sbPackageName = preset.match(/@storybook\/\w+/)?.[0];
    const name = viewLayers[sbPackageName] ? 'frameworkPreset' : 'addonPreset';
    const presetPath = replaceEsmWithCjs ? preset.replace('/esm/', '/cjs/') : preset;
    return {
      name,
      path: presetPath.replace(/.*node_modules\//, ''),
    };
  });

  categorizedPresets.forEach((preset) => {
    const duplicatesCount = presetNames.filter((p) => p.startsWith(preset.name)).length;
    const finalName = `${preset.name}${duplicatesCount ? duplicatesCount + 1 : ''}`;

    presetNames.push(finalName);
    presetImports.push(`import * as ${finalName} from "${preset.path}";\n`);
  });

  if (previewFile) {
    // we add ./ to relative paths because they are not provided by default
    const previewPath = previewFile === 'preview' ? `./${previewFile}` : previewFile;

    presetNames.push('projectAnnotations');
    presetImports.push(`import * as projectAnnotations from "./${previewPath}";\n`);
  }

  return dedent`
    ${presetImports.join('')}
    export default [${presetNames.join(', ')}];
  `;
};

export async function writeAnnotationsFile({ configDir = '.storybook', cjs = false }) {
  try {
    logger.info(`=> Generating preset annotations file`);
    const presets = await getAllPresets(configDir);
    const annotationsFileContent = getAnnotationsFileContent(presets, cjs);
    const targetPath = path.join(configDir, 'annotations.js');

    if (existsSync(targetPath)) {
      logger.warn('=> File already exists! Please delete it and rerun this command.');
      process.exit(1);
    }

    await writeFile(targetPath, annotationsFileContent);
    logger.info(`=> Wrote annotations file to ${targetPath}`);
  } catch (error) {
    throw new Error(`Failed to generate presets file:\n${error.message}`);
  }
}
