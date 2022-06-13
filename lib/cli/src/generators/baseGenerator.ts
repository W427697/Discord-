import fse from 'fs-extra';
import dedent from 'ts-dedent';
import { NpmOptions } from '../NpmOptions';
import { SupportedLanguage, SupportedRenderers, Builder, CoreBuilder } from '../project_types';
import { getBabelDependencies, copyComponents } from '../helpers';
import { configure } from './configure';
import { getPackageDetails, JsPackageManager } from '../js-package-manager';
import { generateStorybookBabelConfigInCWD } from '../babel-config';
import packageVersions from '../versions';

export type GeneratorOptions = {
  language: SupportedLanguage;
  builder: Builder;
  linkable: boolean;
};

export interface FrameworkOptions {
  extraPackages?: string[];
  extraAddons?: string[];
  staticDir?: string;
  addScripts?: boolean;
  addComponents?: boolean;
  addBabel?: boolean;
  addESLint?: boolean;
  extraMain?: any;
  extensions?: string[];
  commonJs?: boolean;
}

export type Generator = (
  packageManager: JsPackageManager,
  npmOptions: NpmOptions,
  options: GeneratorOptions
) => Promise<void>;

const defaultOptions: FrameworkOptions = {
  extraPackages: [],
  extraAddons: [],
  staticDir: undefined,
  addScripts: true,
  addComponents: true,
  addBabel: true,
  addESLint: false,
  extraMain: undefined,
  extensions: undefined,
  commonJs: false,
};

const getBuilderDetails = (builder: string) => {
  const map = packageVersions as Record<string, string>;

  if (map[builder]) {
    return builder;
  }

  const builderPackage = `@storybook/${builder}`;
  if (map[builderPackage]) {
    return map[builderPackage];
  }

  return builder;
};

const getFrameworkDetails = (
  renderer: SupportedRenderers,
  builder: Builder
): {
  type: 'framework' | 'renderer';
  packages: string[];
  builder?: string;
  framework?: string;
  renderer?: string;
} => {
  const frameworkPackage = `@storybook/${renderer}-${builder}`;

  const frameworkPackagePath = `path.dirname(require.resolve(path.join('${frameworkPackage}', 'package.json')))`;
  const rendererPackage = `@storybook/${renderer}`;
  const rendererPackagePath = `path.dirname(require.resolve(path.join('${rendererPackage}', 'package.json')))`;
  const isKnownFramework = !!(packageVersions as Record<string, string>)[frameworkPackage];
  const isKnownRenderer = !!(packageVersions as Record<string, string>)[rendererPackage];

  const builderPackage = getBuilderDetails(builder);
  const builderPackagePath = `path.dirname(require.resolve(path.join('${builderPackage}', 'package.json')))`;

  if (renderer === 'angular') {
    return {
      packages: [rendererPackage],
      framework: rendererPackagePath,
      type: 'framework',
    };
  }

  if (isKnownFramework) {
    return {
      packages: [frameworkPackage],
      framework: frameworkPackagePath,
      type: 'framework',
    };
  }

  if (isKnownRenderer) {
    return {
      packages: [rendererPackage, builderPackage],
      builder: builderPackagePath,
      renderer: rendererPackagePath,
      type: 'renderer',
    };
  }

  throw new Error(
    `Could not find the framework (${frameworkPackage}) or renderer (${rendererPackage}) package`
  );
};

const stripVersions = (addons: string[]) => addons.map((addon) => getPackageDetails(addon)[0]);

const hasInteractiveStories = (framework: SupportedRenderers) =>
  ['react', 'angular', 'preact', 'svelte', 'vue', 'vue3', 'html'].includes(framework);

export async function baseGenerator(
  packageManager: JsPackageManager,
  npmOptions: NpmOptions,
  { language, builder = CoreBuilder.Webpack5 }: GeneratorOptions,
  renderer: SupportedRenderers,
  options: FrameworkOptions = defaultOptions
) {
  const {
    extraAddons: extraAddonPackages,
    extraPackages,
    staticDir,
    addScripts,
    addComponents,
    addBabel,
    addESLint,
    extraMain,
    extensions,
  } = {
    ...defaultOptions,
    ...options,
  };

  // added to main.js
  // make sure to update `canUsePrebuiltManager` in dev-server.js and build-manager-config/main.js when this list changes
  const addons = ['@storybook/addon-links', '@storybook/addon-essentials'];
  // added to package.json
  const addonPackages = [...addons, '@storybook/addon-actions'];

  if (hasInteractiveStories(renderer)) {
    addons.push('@storybook/addon-interactions');
    addonPackages.push('@storybook/addon-interactions', '@storybook/testing-library');
  }

  const yarn2ExtraPackages =
    packageManager.type === 'yarn2' ? ['@storybook/addon-docs', '@mdx-js/react@1.x.x'] : [];

  const files = await fse.readdir(process.cwd());

  const packageJson = packageManager.retrievePackageJson();
  const installedDependencies = new Set(
    Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies })
  );
  const {
    packages: frameworkPackages,
    type,
    // @ts-ignore
    renderer: rendererInclude,
    framework: frameworkInclude,
    builder: builderInclude,
  } = getFrameworkDetails(renderer, builder);

  // TODO: We need to start supporting this at some point
  if (type === 'renderer') {
    throw new Error(
      dedent`
        Sorry, for now, you can not do this, please use a framework such as @storybook/react-webpack5

        https://github.com/storybookjs/storybook/issues/18360
      `
    );
  }

  const packages = [
    'sb',
    ...frameworkPackages,
    ...addonPackages,
    ...extraPackages,
    ...extraAddonPackages,
    ...yarn2ExtraPackages,
  ]
    .filter(Boolean)
    .filter(
      (packageToInstall) => !installedDependencies.has(getPackageDetails(packageToInstall)[0])
    );

  const versionedPackages = await packageManager.getVersionedPackages(packages);

  const mainOptions =
    type !== 'framework'
      ? {
          core: {
            builder: builderInclude,
          },
          ...extraMain,
        }
      : extraMain;

  configure(renderer, {
    framework: { name: frameworkInclude, options: {} },
    addons: [...addons, ...stripVersions(extraAddonPackages)],
    extensions,
    commonJs: options.commonJs,
    ...mainOptions,
  });
  if (addComponents) {
    copyComponents(renderer, language);
  }

  // FIXME: temporary workaround for https://github.com/storybookjs/storybook/issues/17516
  if (frameworkPackages.includes('@storybook/builder-vite')) {
    const previewHead = dedent`
      <script>
        window.global = window;
      </script>
    `;
    await fse.writeFile(`.storybook/preview-head.html`, previewHead, { encoding: 'utf8' });
  }

  const babelDependencies = addBabel ? await getBabelDependencies(packageManager, packageJson) : [];
  const isNewFolder = !files.some(
    (fname) => fname.startsWith('.babel') || fname.startsWith('babel') || fname === 'package.json'
  );
  if (isNewFolder) {
    await generateStorybookBabelConfigInCWD();
  }
  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    ...versionedPackages,
    ...babelDependencies,
  ]);

  if (addScripts) {
    packageManager.addStorybookCommandInScripts({
      port: 6006,
      staticFolder: staticDir,
    });
  }

  if (addESLint) {
    packageManager.addESLintConfig();
  }
}
