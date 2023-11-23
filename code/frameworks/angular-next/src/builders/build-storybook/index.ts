import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
  targetFromTargetString,
} from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { sync as readUpSync } from 'read-pkg-up';

import { CLIOptions } from '@storybook/types';
import { getEnvConfig, versions } from '@storybook/cli';
import { addToGlobalContext } from '@storybook/telemetry';
import { ApplicationBuilderOptions } from '@angular-devkit/build-angular';
import { buildStaticStandalone, withTelemetry } from '@storybook/core-server';
import { sync as findUpSync } from 'find-up';

import {
  AssetPattern,
  StyleElement,
  StylePreprocessorOptions,
} from '@angular-devkit/build-angular/src/builders/browser/schema';
import { relative } from 'path';
import { StandaloneOptions } from '../utils/standalone-options';
import { errorSummary, printErrorDetails } from '../utils/error-handler';

addToGlobalContext('cliVersion', versions.storybook);

export type StorybookBuilderOptions = JsonObject &
  ApplicationBuilderOptions & {
    docs: boolean;
    browserTarget?: string;
  } & Pick<
    // makes sure the option exists
    CLIOptions,
    'outputDir' | 'configDir' | 'loglevel' | 'quiet' | 'disableTelemetry' | 'previewUrl'
  >;

export type StorybookBuilderOutput = JsonObject & BuilderOutput & { [key: string]: any };

type StandaloneBuildOptions = StandaloneOptions & { outputDir: string };

const commandBuilder = async (
  options: StorybookBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> => {
  getEnvConfig(options, {
    staticDir: 'SBCONFIG_STATIC_DIR',
    outputDir: 'SBCONFIG_OUTPUT_DIR',
    configDir: 'SBCONFIG_CONFIG_DIR',
  });

  const {
    docs,
    outputDir,
    configDir,
    browserTarget,
    loglevel,
    quiet,
    disableTelemetry,
    previewUrl,
    ...applicationBuilderOptions
  } = options;

  const standaloneOptions: StandaloneBuildOptions = {
    packageJson: readUpSync({ cwd: __dirname }).packageJson,
    configDir,
    ...(docs ? { docs } : {}),
    loglevel,
    outputDir,
    quiet,
    disableTelemetry,
    previewUrl,
    applicationBuilderOptions: await getBuilderOptions(
      context,
      applicationBuilderOptions,
      browserTarget,
      configDir,
      outputDir
    ),
    builderContext: context,
  };

  try {
    await withTelemetry(
      'build',
      {
        cliOptions: options,
        presetOptions: { ...standaloneOptions, corePresets: [], overridePresets: [] },
        printError: printErrorDetails,
      },
      () => buildStaticStandalone(standaloneOptions)
    );

    return { success: true };
  } catch (e) {
    return {
      success: false,
      message: errorSummary(e),
    };
  }
};

async function getBuilderOptions(
  builderContext: BuilderContext,
  applicationBuilderOptions: ApplicationBuilderOptions,
  angularBrowserTarget: string,
  configDir: string,
  outputDir: string
) {
  let browserTargetOptions: Partial<ApplicationBuilderOptions> = {};

  if (angularBrowserTarget) {
    const browserTarget = targetFromTargetString(angularBrowserTarget);
    // We don't want to build for a server platform. `ssr`, `prerender` and `server` are all server platform related and shouldn't be passed to the application builder
    const { ssr, prerender, server, ...targetOptions } = await builderContext.getTargetOptions(
      browserTarget
    );
    browserTargetOptions = targetOptions as typeof browserTargetOptions;
  }

  const nearestTsConfig = findUpSync('tsconfig.json', { cwd: configDir });
  const localTsConfig = nearestTsConfig ? relative(process.cwd(), nearestTsConfig) : undefined;

  const builderOptions: ApplicationBuilderOptions = {
    ...browserTargetOptions,
    ...applicationBuilderOptions,
    styles: applicationBuilderOptions.styles.length
      ? applicationBuilderOptions.styles
      : (browserTargetOptions.styles as StyleElement[]),
    assets: applicationBuilderOptions.assets.length
      ? applicationBuilderOptions.assets
      : (browserTargetOptions.assets as AssetPattern[]),
    stylePreprocessorOptions: applicationBuilderOptions.stylePreprocessorOptions.includePaths.length
      ? applicationBuilderOptions.stylePreprocessorOptions
      : (browserTargetOptions.stylePreprocessorOptions as StylePreprocessorOptions),
    // TODO: Optimize
    aot: false,
    outputPath: outputDir,
    allowedCommonJsDependencies: [
      ...(applicationBuilderOptions.allowedCommonJsDependencies ?? []),
      ...((browserTargetOptions.allowedCommonJsDependencies as string[]) ?? []),
      'memoizerific',
      'color-convert',
      'react',
      'react-dom',
      'lodash',
      'tocbot',
      'doctrine',
      'rxjs',
      'rxjs/operators',
    ],
    tsConfig:
      applicationBuilderOptions.tsConfig ??
      localTsConfig ??
      (browserTargetOptions.tsConfig as string),
  };

  return builderOptions;
}

export default createBuilder(commandBuilder);
