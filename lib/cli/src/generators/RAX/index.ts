import { getVersions, retrievePackageJson, writePackageJson } from '../../helpers';
import baseGenerator, { Generator } from '../generator';
import { StoryFormat } from '../../project_types';

const generator: Generator = async (npmOptions, options) => {
  const [latestRaxVersion] = await getVersions(npmOptions, 'rax');
  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  const raxVersion = packageJson.dependencies.rax || latestRaxVersion;

  // in case Rax project is not detected, `rax` package is not available either
  packageJson.dependencies.rax = packageJson.dependencies.rax || raxVersion;

  // these packages are required for Welcome story
  packageJson.dependencies['rax-image'] = packageJson.dependencies['rax-image'] || raxVersion;
  packageJson.dependencies['rax-link'] = packageJson.dependencies['rax-link'] || raxVersion;
  packageJson.dependencies['rax-text'] = packageJson.dependencies['rax-text'] || raxVersion;
  packageJson.dependencies['rax-view'] = packageJson.dependencies['rax-view'] || raxVersion;

  writePackageJson(packageJson);

  baseGenerator(npmOptions, options, 'rax', {
    dirname: options.storyFormat === StoryFormat.MDX ? __dirname : undefined,
    extraPackages: ['rax'],
  });
};

export default generator;
