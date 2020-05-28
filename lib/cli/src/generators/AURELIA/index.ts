import { writeFileAsJson, readFileAsJson } from '../../helpers';
import { StoryFormat } from '../../project_types';
import baseGenerator, { Generator } from '../generator';

function addStorybookExcludeGlobToTsConfig() {
  const tsConfigJson = readFileAsJson('tsconfig.json', true);
  const glob = '**/*.stories.ts';
  if (!tsConfigJson) {
    return;
  }

  const { exclude = [] } = tsConfigJson;
  if (exclude.includes(glob)) {
    return;
  }

  tsConfigJson.exclude = [...exclude, glob];
  writeFileAsJson('tsconfig.json', tsConfigJson);
}

const generator: Generator = async (npmOptions, options) => {
  addStorybookExcludeGlobToTsConfig();
  baseGenerator(npmOptions, options, 'aurelia', {
    dirname: options.storyFormat === StoryFormat.MDX ? __dirname : undefined,
    extraPackages: ['aurelia'],
  });
};

export default generator;
