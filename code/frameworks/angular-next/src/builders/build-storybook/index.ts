import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { sync as readUpSync } from 'read-pkg-up';

import { CLIOptions } from '@storybook/types';
import { getEnvConfig, versions } from '@storybook/cli';
import { addToGlobalContext } from '@storybook/telemetry';
import { ApplicationBuilderOptions } from '@angular-devkit/build-angular';
import { buildStaticStandalone, withTelemetry } from '@storybook/core-server';

import { StandaloneOptions } from '../utils/standalone-options';
import { runCompodoc } from '../utils/run-compodoc';
import { errorSummary, printErrorDetails } from '../utils/error-handler';

addToGlobalContext('cliVersion', versions.storybook);

export type StorybookBuilderOptions = JsonObject & ApplicationBuilderOptions & {
  docs: boolean;
  browserTarget?: string;
  compodoc: boolean;
  compodocArgs: string[];
} & Pick<
    // makes sure the option exists
    CLIOptions,
    | 'outputDir'
    | 'configDir'
    | 'loglevel'
    | 'quiet'
    | 'disableTelemetry'
    | 'previewUrl'
  >;

export type StorybookBuilderOutput = JsonObject & BuilderOutput & { [key: string]: any };

type StandaloneBuildOptions = StandaloneOptions & { outputDir: string };

const commandBuilder = async (
  options: StorybookBuilderOptions,
  context: BuilderContext
): Promise<BuilderOutput> => {

  if(options.compodoc) {
    
    try {
      context.reportStatus(`Generating compodoc documentation`);
      // TODO: Get tsconfig from options
      // @ts-expect-error
      const stdout = runCompodoc({compodocArgs: options.compodocArgs, tsconfig: context}, context);
      context.logger.info(stdout);
    } catch(e) {
      context.logger.error(e);
      return {
        success: false,
        message: errorSummary(e)
      }
    }
  }

  getEnvConfig(options, {
    staticDir: 'SBCONFIG_STATIC_DIR',
    outputDir: 'SBCONFIG_OUTPUT_DIR',
    configDir: 'SBCONFIG_CONFIG_DIR',
  });

  const {
    docs,
    compodoc,
    compodocArgs,
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
    angularBrowserTarget: browserTarget,
    angularBuilderContext: context,
    angularBuilderOptions: applicationBuilderOptions,
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
    )
  
    return { success: true };
  } catch(e) {
    return {
      success: false,
      message: errorSummary(e)
    }
  }
  
};

export default createBuilder(commandBuilder);