import * as path from 'path';
import * as fs from 'fs';
import { pathExists } from 'fs-extra';
import * as jju from 'jju';

import { readFileAsJson, writeFileAsJson } from '../../helpers';

type TsConfig = {
  extends: string;
};

export function getAngularAppTsConfigPath() {
  const angularJson = readFileAsJson('angular.json', true);
  const defaultProject = getDefaultProjectName(angularJson);
  const tsConfigPath = angularJson.projects[defaultProject].architect.build.options.tsConfig;

  if (!tsConfigPath || !fs.existsSync(path.resolve(tsConfigPath))) {
    return false;
  }
  return tsConfigPath;
}

export function getAngularAppTsConfigJson() {
  const tsConfigPath = getAngularAppTsConfigPath();

  if (!tsConfigPath) {
    return false;
  }

  return readFileAsJson(tsConfigPath, true);
}

function setStorybookTsconfigExtendsPath(tsconfigJson: TsConfig) {
  const angularProjectTsConfigPath = getAngularAppTsConfigPath();
  const newTsconfigJson = { ...tsconfigJson };
  newTsconfigJson.extends = `../${angularProjectTsConfigPath}`;
  return newTsconfigJson;
}

export function editStorybookTsConfig(tsconfigPath: string) {
  let tsConfigJson;
  try {
    tsConfigJson = readFileAsJson(tsconfigPath);
  } catch (e) {
    if (e.name === 'SyntaxError' && e.message.indexOf('Unexpected token /') > -1) {
      throw new Error(`Comments are disallowed in ${tsconfigPath}`);
    }
    throw e;
  }
  tsConfigJson = setStorybookTsconfigExtendsPath(tsConfigJson);
  writeFileAsJson(tsconfigPath, tsConfigJson);
}

export function readAngularJsonSource() {
  const filePath = path.resolve('angular.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`angular.json file not found.`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

export function writeAngularJsonSource(source: string) {
  const filePath = path.resolve('angular.json');
  fs.writeFileSync(filePath, source, 'utf8');
}

export function editAngularConfig() {
  const angularJsonSource = readAngularJsonSource();
  const defaultProject = getDefaultProjectName(jju.parse(angularJsonSource));
  const modifiedSource = addBuilderToAngularJsonProject(angularJsonSource, defaultProject);
  writeAngularJsonSource(modifiedSource);
}

export function addBuilderToAngularJsonProject(angularJsonSource: string, projectName: string) {
  const angularJson = jju.parse(angularJsonSource);
  angularJson.projects[projectName].architect.storybook = {
    builder: '@storybook/angular:start-storybook',
    options: {
      browserTarget: `${projectName}:build`,
      port: 6006,
    },
  };
  angularJson.projects[projectName].architect['build-storybook'] = {
    builder: '@storybook/angular:build-storybook',
    options: {
      browserTarget: `${projectName}:build`,
    },
  };
  return jju.update(angularJsonSource, angularJson, { no_trailing_comma: true });
}

export function getDefaultProjectName(angularJson: any): string | undefined {
  const { defaultProject, projects } = angularJson;

  if (projects?.storybook) {
    return 'storybook';
  }

  if (defaultProject) {
    return defaultProject;
  }

  const firstProjectName = projects ? Object.keys(projects)[0] : undefined;
  if (firstProjectName) {
    return firstProjectName;
  }

  return undefined;
}

export function checkForProjects() {
  const { projects } = readFileAsJson('angular.json', true);

  if (!projects || Object.keys(projects).length === 0) {
    throw new Error(
      'Could not find a project in your Angular workspace. \nAdd a project and re-run the installation'
    );
  }
}

export async function getBaseTsConfigName() {
  return (await pathExists('./tsconfig.base.json')) ? 'tsconfig.base.json' : 'tsconfig.json';
}
