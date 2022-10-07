import { generateI18nBrowserWebpackConfigFromContext } from '@angular-devkit/build-angular/src/utils/webpack-browser-config';
import {
  getCommonConfig,
  getStylesConfig,
  getDevServerConfig,
} from '@angular-devkit/build-angular/src/webpack/configs';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

import { JsonObject } from '@angular-devkit/core';
import { BuilderContext } from '@angular-devkit/architect';
import { filterOutStylingRules } from './utils/filter-out-styling-rules';

export const getWebpackConfig = async (
  baseConfig: any,
  { builderOptions, builderContext }: { builderOptions: JsonObject; builderContext: BuilderContext }
) => {
  /**
   * Get angular-cli Webpack config
   */
  const { config: cliConfig } = await generateI18nBrowserWebpackConfigFromContext(
    {
      // todo this field was missing according to its interface -> figure out what to do
      tsConfig: '',
      // Default options
      index: 'noop-index',
      main: 'noop-main',
      outputPath: 'noop-out',

      // Options provided by user
      ...builderOptions,

      // Fixed options
      optimization: false,
      namedChunks: false,
      progress: false,
      buildOptimizer: false,
      aot: false,
    },
    builderContext,
    (wco) => [
      getCommonConfig(wco),
      getStylesConfig(wco),
      // todo getTypeScriptConfig is not exported and probably always used getDevServerConfig. Check what to do
      // Previous code `getTypeScriptConfig ? getTypeScriptConfig(wco) : getDevServerConfig(wco),`
      getDevServerConfig(wco),
    ]
  );

  /**
   * Merge baseConfig Webpack with angular-cli Webpack
   */
  const entry = [
    ...baseConfig.entry,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // todo styles does not exists, probably always [] and a bug?
    ...(cliConfig.entry.styles ?? []),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // todo polyfills does not exists, probably always [] and a bug?
    ...(cliConfig.entry.polyfills ?? []),
  ];

  // Don't use storybooks styling rules because we have to use rules created by @angular-devkit/build-angular
  // because @angular-devkit/build-angular created rules have include/exclude for global style files.
  const rulesExcludingStyles = filterOutStylingRules(baseConfig);
  const module = {
    ...baseConfig.module,
    rules: [...cliConfig.module.rules, ...rulesExcludingStyles],
  };

  const plugins = [...(cliConfig.plugins ?? []), ...baseConfig.plugins];

  const resolve = {
    ...baseConfig.resolve,
    modules: Array.from(new Set([...baseConfig.resolve.modules, ...cliConfig.resolve.modules])),
    plugins: [
      new TsconfigPathsPlugin({
        // todo had to cast this to string but can be a different type as well. Figure out what to do
        configFile: builderOptions.tsConfig as string,
        mainFields: ['browser', 'module', 'main'],
      }),
    ],
  };

  return {
    ...baseConfig,
    entry,
    module,
    plugins,
    resolve,
    resolveLoader: cliConfig.resolveLoader,
  };
};
