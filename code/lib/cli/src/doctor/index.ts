import chalk from 'chalk';
import boxen from 'boxen';
import { createWriteStream, move, remove } from 'fs-extra';
import dedent from 'ts-dedent';
import { join } from 'path';

import { JsPackageManagerFactory } from '@storybook/core-common';
import type { PackageManagerName } from '@storybook/core-common';
import { getStorybookData } from '../automigrate/helpers/mainConfigFile';
import { cleanLog } from '../automigrate/helpers/cleanLog';
import { getMismatchingVersionsWarnings } from './getMismatchingVersionsWarning';
import {
  getIncompatiblePackagesSummary,
  getIncompatibleStorybookPackages,
} from './getIncompatibleStorybookPackages';
import { getDuplicatedDepsWarnings } from './getDuplicatedDepsWarnings';

const logger = console;
const LOG_FILE_NAME = 'doctor-storybook.log';
const LOG_FILE_PATH = join(process.cwd(), LOG_FILE_NAME);
let TEMP_LOG_FILE_PATH = '';

const originalStdOutWrite = process.stdout.write.bind(process.stdout);
const originalStdErrWrite = process.stderr.write.bind(process.stdout);

const augmentLogsToFile = async () => {
  const { temporaryFile } = await import('tempy');
  TEMP_LOG_FILE_PATH = temporaryFile({ name: LOG_FILE_NAME });
  const logStream = createWriteStream(TEMP_LOG_FILE_PATH);

  process.stdout.write = (d: string) => {
    originalStdOutWrite(d);
    return logStream.write(cleanLog(d));
  };
  process.stderr.write = (d: string) => {
    return logStream.write(cleanLog(d));
  };
};

const cleanup = () => {
  process.stdout.write = originalStdOutWrite;
  process.stderr.write = originalStdErrWrite;
};

type DoctorOptions = {
  configDir?: string;
  packageManager?: PackageManagerName;
};

export const doctor = async ({
  configDir: userSpecifiedConfigDir,
  packageManager: pkgMgr,
}: DoctorOptions = {}) => {
  await augmentLogsToFile();

  let foundIssues = false;
  const logDiagnostic = (title: string, message: string) => {
    foundIssues = true;
    logger.info(
      boxen(message, {
        borderStyle: 'round',
        padding: 1,
        title,
        borderColor: '#F1618C',
      })
    );
  };

  logger.info('🩺 The doctor is checking the health of your Storybook..');

  const packageManager = JsPackageManagerFactory.getPackageManager({ force: pkgMgr });
  let storybookVersion;
  let mainConfig;

  try {
    const storybookData = await getStorybookData({
      configDir: userSpecifiedConfigDir,
      packageManager,
    });
    storybookVersion = storybookData.storybookVersion;
    mainConfig = storybookData.mainConfig;
  } catch (err: any) {
    if (err.message.includes('No configuration files have been found')) {
      logger.info(
        dedent`[Storybook doctor] Could not find or evaluate your Storybook main.js config directory at ${chalk.blue(
          userSpecifiedConfigDir || '.storybook'
        )} so the doctor command cannot proceed. You might be running this command in a monorepo or a non-standard project structure. If that is the case, please rerun this command by specifying the path to your Storybook config directory via the --config-dir option.`
      );
    }
    logger.info(dedent`[Storybook doctor] ❌ ${err.message}`);
    logger.info('Please fix the error and try again.');
  }

  if (!storybookVersion) {
    logger.info(dedent`
      [Storybook doctor] ❌ Unable to determine Storybook version so the command will not proceed.
      🤔 Are you running storybook doctor from your project directory? Please specify your Storybook config directory with the --config-dir flag.
      `);
    process.exit(1);
  }

  if (!mainConfig) {
    throw new Error('mainConfig is undefined');
  }

  const allDependencies = (await packageManager.getAllDependencies()) as Record<string, string>;

  const incompatibleStorybookPackagesList = await getIncompatibleStorybookPackages({
    currentStorybookVersion: storybookVersion,
  });
  const incompatiblePackagesMessage = getIncompatiblePackagesSummary(
    incompatibleStorybookPackagesList,
    storybookVersion
  );
  if (incompatiblePackagesMessage) {
    logDiagnostic('Incompatible packages found', incompatiblePackagesMessage);
  }

  const installationMetadata = await packageManager.findInstallations([
    '@storybook/*',
    'storybook',
  ]);

  // If we found incompatible packages, we let the users fix that first
  // If they run doctor again and there are still issues, we show the other warnings
  if (!incompatiblePackagesMessage) {
    const mismatchingVersionMessage = getMismatchingVersionsWarnings(
      installationMetadata,
      allDependencies
    );
    if (mismatchingVersionMessage) {
      logDiagnostic('Diagnostics', [mismatchingVersionMessage].join('\n\n-------\n\n'));
    } else {
      const list = installationMetadata
        ? getDuplicatedDepsWarnings(installationMetadata)
        : getDuplicatedDepsWarnings();
      if (Array.isArray(list) && list.length > 0) {
        logDiagnostic('Duplicated dependencies found', list?.join('\n'));
      }
    }
  }

  const commandMessage = `You can always recheck the health of your project by running:\n${chalk.cyan(
    'npx storybook doctor'
  )}`;
  logger.info();

  if (foundIssues) {
    logger.info(commandMessage);
    logger.info();

    logger.info(`Full logs are available in ${chalk.cyan(LOG_FILE_PATH)}`);

    await move(TEMP_LOG_FILE_PATH, join(process.cwd(), LOG_FILE_NAME), { overwrite: true });
  } else {
    logger.info(`🥳 Your Storybook project looks good!`);
    logger.info(commandMessage);
    await remove(TEMP_LOG_FILE_PATH);
  }
  logger.info();

  cleanup();
};
