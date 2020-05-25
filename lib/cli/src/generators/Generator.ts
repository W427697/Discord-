import { NpmOptions } from '../NpmOptions';
import { StoryFormat, SupportedLanguage, SupportedFrameworks } from '../project_types';
import {
  retrievePackageJson,
  getVersionedPackages,
  writePackageJson,
  getBabelDependencies,
  installDependencies,
  copyTemplate,
  copyComponents,
} from '../helpers';
import configure from './configure';

export type GeneratorOptions = {
  language: SupportedLanguage;
  storyFormat: StoryFormat;
};

export type Generator = (npmOptions: NpmOptions, options: GeneratorOptions) => Promise<void>;

const generator = async (
  npmOptions: NpmOptions,
  { storyFormat, language }: GeneratorOptions,
  framework: SupportedFrameworks,
  extraPackages?: string[],
  extraAddons?: string[]
) => {
  const packages = [
    `@storybook/${framework}`,
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    ...extraPackages,
    ...extraAddons,
  ];
  const versionedPackages = await getVersionedPackages(npmOptions, ...packages);

  configure(extraAddons);
  copyComponents(framework, language);
  copyTemplate(__dirname, storyFormat);

  const packageJson = await retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(npmOptions, packageJson);

  installDependencies({ ...npmOptions, packageJson }, [...versionedPackages, ...babelDependencies]);
};

export default generator;
