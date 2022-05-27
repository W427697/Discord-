import type {
  CLIOptions,
  LoadOptions,
  BuilderOptions,
  Options,
  StorybookConfig,
} from '@storybook/core-common';
import { resolvePathInStorybookCache, loadAllPresets, cache } from '@storybook/core-common';
import prompts from 'prompts';
import global from 'global';

import path from 'path';
import { storybookDevServer } from './dev-server';
import { getReleaseNotesData, getReleaseNotesFailedState } from './utils/release-notes';
import { outputStats } from './utils/output-stats';
import { outputStartupInformation } from './utils/output-startup-information';
import { updateCheck } from './utils/update-check';
import { getServerPort, getServerChannelUrl } from './utils/server-address';
import { getBuilders } from './utils/get-builders';

export async function buildDevStandalone(options: CLIOptions & LoadOptions & BuilderOptions) {
  const { packageJson, versionUpdates, releaseNotes } = options;
  const { version, name = '' } = packageJson;

  // updateInfo and releaseNotesData are cached, so this is typically pretty fast
  const [port, versionCheck, releaseNotesData] = await Promise.all([
    getServerPort(options.port),
    versionUpdates
      ? updateCheck(version)
      : Promise.resolve({ success: false, data: {}, time: Date.now() }),
    releaseNotes
      ? getReleaseNotesData(version, cache)
      : Promise.resolve(getReleaseNotesFailedState(version)),
  ]);

  if (!options.ci && !options.smokeTest && options.port != null && port !== options.port) {
    const { shouldChangePort } = await prompts({
      type: 'confirm',
      initial: true,
      name: 'shouldChangePort',
      message: `Port ${options.port} is not available. Would you like to run Storybook on port ${port} instead?`,
    });
    if (!shouldChangePort) process.exit(1);
  }

  /* eslint-disable no-param-reassign */
  options.port = port;
  options.versionCheck = versionCheck;
  options.releaseNotesData = releaseNotesData;
  options.configType = 'DEVELOPMENT';
  options.configDir = path.resolve(options.configDir);
  options.outputDir = options.smokeTest
    ? resolvePathInStorybookCache('public')
    : path.resolve(options.outputDir || resolvePathInStorybookCache('public'));
  options.serverChannelUrl = getServerChannelUrl(port, options);
  /* eslint-enable no-param-reassign */

  console.time('loadAllPresets');
  let presets = loadAllPresets({
    corePresets: [],
    overridePresets: [],
    ...options,
  });
  console.timeEnd('loadAllPresets');

  const [previewBuilder, managerBuilder] = await getBuilders({ ...options, presets });
  console.time('loadAllPresets2');
  presets = loadAllPresets({
    corePresets: [
      require.resolve('./presets/common-preset'),
      ...managerBuilder.corePresets,
      ...previewBuilder.corePresets,
      require.resolve('./presets/babel-cache-preset'),
    ],
    overridePresets: previewBuilder.overridePresets,
    ...options,
  });
  console.timeEnd('loadAllPresets2');

  const features = await presets.apply<StorybookConfig['features']>('features');
  global.FEATURES = features;

  const fullOptions: Options = {
    ...options,
    presets,
    features,
  };

  const { address, networkAddress, managerResult, previewResult } = await storybookDevServer(
    fullOptions
  );

  const previewTotalTime = previewResult && previewResult.totalTime;
  const managerTotalTime = managerResult && managerResult.totalTime;

  const previewStats = previewResult && previewResult.stats;
  const managerStats = managerResult && managerResult.stats;

  if (options.webpackStatsJson) {
    const target = options.webpackStatsJson === true ? options.outputDir : options.webpackStatsJson;
    await outputStats(target, previewStats, managerStats);
  }

  if (options.smokeTest) {
    const warnings: Error[] = [];
    // @ts-ignore
    warnings.push(...((managerStats && managerStats.toJson().warnings) || []));
    // @ts-ignore
    warnings.push(...((managerStats && previewStats.toJson().warnings) || []));

    const problems = warnings
      .filter((warning) => !warning.message.includes(`export 'useInsertionEffect'`))
      .filter(
        (warning) => !warning.message.includes(`Conflicting values for 'process.env.NODE_ENV'`)
      );

    console.log(problems.map((p) => p.stack));
    process.exit(problems.length > 0 ? 1 : 0);
    return;
  }

  // Get package name and capitalize it e.g. @storybook/react -> React
  const packageName = name.split('@storybook/').length > 1 ? name.split('@storybook/')[1] : name;
  const frameworkName = packageName.charAt(0).toUpperCase() + packageName.slice(1);

  outputStartupInformation({
    updateInfo: versionCheck,
    version,
    name: frameworkName,
    address,
    networkAddress,
    managerTotalTime,
    previewTotalTime,
  });
}
