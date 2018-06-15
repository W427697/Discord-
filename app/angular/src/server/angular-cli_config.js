import path from 'path';
import fs from 'fs';
import { logger } from '@storybook/node-logger';
import get from 'lodash.get';
import { isBuildAngularInstalled, normalizeAssetPatterns } from './angular-cli_utils';

export function getAngularJson(dirToSearch) {
  const fname = path.join(dirToSearch, 'angular.json');

  if (!fs.existsSync(fname)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(fname, 'utf8'));
}

export function getLibraryProjects(baseDir = process.cwd()) {
  const { projects } = getAngularJson(baseDir);

  if (!projects || !Object.keys(projects).length) {
    throw new Error('angular.json must have projects entry.');
  }

  return Object.keys(projects)
    .map(name => projects[name])
    .filter(project => project.projectType === 'library');
}

export function getProjectAliases(projects, baseDir = process.cwd()) {
  return projects
    .map(project => {
      let entryFile = 'src/public_api.ts';

      const projectFile = get(
        project,
        'architect.build.options.project',
        path.join(project.root, 'ng-package.json')
      );
      const ngPackageFile = path.resolve(baseDir, projectFile);
      const ngPackage = JSON.parse(fs.readFileSync(ngPackageFile, 'utf8'));
      const packageJson = JSON.parse(
        fs.readFileSync(path.resolve(baseDir, project.root, 'package.json'))
      );

      if (ngPackage.lib && ngPackage.lib.entryFile) {
        // eslint-disable-next-line prefer-destructuring
        entryFile = ngPackage.lib.entryFile;
      }

      return {
        alias: packageJson.name,
        file: path.resolve(path.dirname(ngPackageFile), entryFile),
      };
    })
    .reduce((aliases, { alias, file }) => ({ ...aliases, [alias]: file }), {});
}

export function getAngularCliWebpackConfigOptions(dirToSearch) {
  const { projects, defaultProject } = getAngularJson(dirToSearch);

  if (!projects || !Object.keys(projects).length) {
    throw new Error('angular.json must have projects entry.');
  }

  let project = projects[Object.keys(projects)[0]];

  if (defaultProject) {
    project = projects[defaultProject];
  }

  const { options: projectOptions } = project.architect.build;

  const normalizedAssets = normalizeAssetPatterns(
    projectOptions.assets,
    dirToSearch,
    project.sourceRoot
  );

  return {
    root: project.root,
    projectRoot: dirToSearch,
    supportES2015: false,
    tsConfig: {
      options: {},
      fileNames: [],
      errors: [],
    },
    tsConfigPath: path.resolve(dirToSearch, 'src/tsconfig.app.json'),
    buildOptions: {
      ...projectOptions,
      assets: normalizedAssets,
    },
  };
}

export function applyAngularCliWebpackConfig(baseConfig, cliWebpackConfigOptions) {
  if (!cliWebpackConfigOptions) return baseConfig;

  if (!isBuildAngularInstalled()) {
    logger.info('=> Using base config because @angular-devkit/build-angular is not installed.');
    return baseConfig;
  }

  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const ngcliConfigFactory = require('@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs');

  let cliCommonConfig;
  let cliStyleConfig;
  try {
    cliCommonConfig = ngcliConfigFactory.getCommonConfig(cliWebpackConfigOptions);
    cliStyleConfig = ngcliConfigFactory.getStylesConfig(cliWebpackConfigOptions);
  } catch (e) {
    logger.warn('=> Failed to get angular-cli webpack config.');
    return baseConfig;
  }
  logger.info('=> Get angular-cli webpack config.');

  const libraryProjects = getLibraryProjects();

  let projectAliases;

  if (libraryProjects.length) {
    logger.info(`=> Found ${libraryProjects.length} library project(s).`);

    projectAliases = getProjectAliases(libraryProjects);
  }

  // Don't use storybooks .css/.scss rules because we have to use rules created by @angular-devkit/build-angular
  // because @angular-devkit/build-angular created rules have include/exclude for global style files.
  const rulesExcludingStyles = baseConfig.module.rules.filter(
    rule =>
      !rule.test || (rule.test.toString() !== '/\\.css$/' && rule.test.toString() !== '/\\.scss$/')
  );

  // cliStyleConfig.entry adds global style files to the webpack context
  const entry = {
    ...baseConfig.entry,
    ...cliStyleConfig.entry,
  };

  const mod = {
    ...baseConfig.module,
    rules: [...cliStyleConfig.module.rules, ...rulesExcludingStyles],
  };

  // We use cliCommonConfig plugins to serve static assets files.
  const plugins = [...cliStyleConfig.plugins, ...cliCommonConfig.plugins, ...baseConfig.plugins];

  return {
    ...baseConfig,
    entry,
    module: mod,
    plugins,
    resolveLoader: cliCommonConfig.resolveLoader,
    resolve: {
      ...baseConfig.resolve,
      alias: {
        ...baseConfig.resolve.alias,
        ...projectAliases,
      },
    },
  };
}
