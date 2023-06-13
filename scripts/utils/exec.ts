/* eslint-disable no-await-in-loop, no-restricted-syntax */
import chalk from 'chalk';
import * as cp from 'child_process';
import type { SpawnOptionsWithoutStdio } from 'child_process';

type Options = SpawnOptionsWithoutStdio;

const command = async (cmd: string, options: Options) => {
  return new Promise<void>((resolve, reject) => {
    const child = cp.spawn(cmd, options);
    const rejected = false;
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        if (rejected) {
          return;
        }
        reject(new Error(`Process exited with code: ${code}`));
      }
    });
  });
};

const logger = console;

type StepOptions = {
  startMessage?: string;
  errorMessage?: string;
  dryRun?: boolean;
  debug?: boolean;
  signal?: AbortSignal;
};

export const exec = async (
  cmd: string | string[],
  options: Options = {},
  { startMessage, errorMessage, dryRun, debug, signal }: StepOptions = {}
): Promise<void> => {
  // const execa = await getExeca();
  logger.info();
  if (startMessage) logger.info(startMessage);

  if (dryRun) {
    logger.info(`\n> ${cmd}\n`);
    return undefined;
  }

  const defaultOptions: Options = {
    shell: true,
    stdio: debug ? ('inherit' as Options['stdio']) : ('pipe' as Options['stdio']),
    signal,
  };
  let currentChild: Promise<void>;

  try {
    if (typeof cmd === 'string') {
      logger.debug(`> ${cmd}`);
      currentChild = command(cmd, { ...defaultOptions, ...options });
      await currentChild;
    } else {
      for (const subcommand of cmd) {
        logger.debug(`> ${subcommand}`);
        currentChild = command(subcommand, { ...defaultOptions, ...options });
        await currentChild;
      }
    }
  } catch (err) {
    if (!err.killed) {
      logger.error(chalk.red(`An error occurred while executing: \`${cmd}\``));
      logger.log(`${errorMessage}\n`);
    }

    throw err;
  }

  return undefined;
};
