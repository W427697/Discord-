import { NpmOptions } from '../NpmOptions';
import { StoryFormat, SupportedLanguage, SupportedFrameworks } from '../project_types';
import {
  retrievePackageJson,
  getVersionedPackages,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  copyComponents,
} from '../helpers';
import configure from './configure';

export type GeneratorOptions = {
  language: SupportedLanguage;
  storyFormat: StoryFormat;
};

export interface FrameworkOptions {
  extraPackages?: string[];
  extraAddons?: string[];
  staticDir?: string;
  addScripts?: boolean;
  addComponents?: boolean;
}

export type Generator = (npmOptions: NpmOptions, options: GeneratorOptions) => Promise<void>;

const defaultOptions: FrameworkOptions = {
  extraPackages: [],
  extraAddons: [],
  staticDir: undefined,
  addScripts: true,
  addComponents: true,
};
const generator = async (
  npmOptions: NpmOptions,
  { language }: GeneratorOptions,
  framework: SupportedFrameworks,
  options: FrameworkOptions = defaultOptions
) => {
  const { extraAddons, extraPackages, staticDir, addScripts, addComponents } = {
    ...defaultOptions,
    ...options,
  };

  const addons = [
    '@storybook/addon-links',
    // If angular add only `actions` because docs is buggy for now (https://github.com/storybookjs/storybook/issues/9103)
    // for others framework add `essentials` i.e. `actions`, `backgrounds`, `docs`, `viewport`
    framework !== 'angular' ? '@storybook/addon-essentials' : '@storybook/addon-actions',
  ];

  const packages = [`@storybook/${framework}`, ...addons, ...extraPackages, ...extraAddons].filter(
    Boolean
  );
  const versionedPackages = await getVersionedPackages(npmOptions, ...packages);

  configure([...addons, ...extraAddons]);
  if (addComponents) {
    copyComponents(framework, language);
  }

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  if (addScripts) {
    const staticParameter = staticDir ? `-s ${staticDir}` : '';
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.storybook = `start-storybook -p 6006 ${staticParameter}`.trim();
    packageJson.scripts['build-storybook'] = `build-storybook ${staticParameter}`.trim();
  }

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [...versionedPackages, ...babelDependencies]);
};

export default generator;
