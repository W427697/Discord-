import path, { join } from 'path';
import semver from 'semver';
import {
  checkForProjects,
  editAngularConfig,
  editStorybookTsConfig,
  getAngularAppTsConfigJson,
  getAngularAppTsConfigPath,
  getDefaultProjectName,
} from './angular-helpers';
import { writeFileAsJson, copyTemplate, readFileAsJson } from '../../helpers';
import { getCliDir } from '../../dirs';
import { baseGenerator } from '../baseGenerator';
import type { Generator } from '../types';
import { CoreBuilder } from '../../project_types';

function editAngularAppTsConfig() {
  const tsConfigJson = getAngularAppTsConfigJson();
  const glob = '**/*.stories.*';
  if (!tsConfigJson) {
    return;
  }

  const { exclude = [] } = tsConfigJson;
  if (exclude.includes(glob)) {
    return;
  }

  tsConfigJson.exclude = [...exclude, glob];
  writeFileAsJson(getAngularAppTsConfigPath(), tsConfigJson);
}

const generator: Generator = async (packageManager, npmOptions, options) => {
  checkForProjects();

  const angularVersion = semver.coerce(
    packageManager.retrievePackageJson().dependencies['@angular/core']
  )?.version;
  const isWebpack5 = semver.gte(angularVersion, '13.0.0');
  const updatedOptions = isWebpack5 ? { ...options, builder: CoreBuilder.Webpack5 } : options;

  await baseGenerator(
    packageManager,
    npmOptions,
    updatedOptions,
    'angular',
    {
      extraPackages: ['@compodoc/compodoc'],
      addScripts: false,
    },
    'angular'
  );

  const templateDir = join(getCliDir(), 'templates', 'angular');
  copyTemplate(templateDir);

  editAngularAppTsConfig();
  editStorybookTsConfig(path.resolve('./.storybook/tsconfig.json'));
  editAngularConfig();

  const angularJson = readFileAsJson('angular.json', true);
  const defaultProject = getDefaultProjectName(angularJson);
  packageManager.addScripts({
    storybook: `ng run ${defaultProject}:storybook`,
    'build-storybook': `ng run ${defaultProject}:build-storybook`,
  });
};

export default generator;
