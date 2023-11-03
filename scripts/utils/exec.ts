/* eslint-disable no-await-in-loop, no-restricted-syntax */
import type { ExecaChildProcess, Options } from 'execa';
import chalk from 'chalk';
import { execa } from 'execa';

const logger = console;

type StepOptions = {
  startMessage?: string;
  errorMessage?: string;
  dryRun?: boolean;
  debug?: boolean;
  signal?: AbortSignal;
};

// Reimplementation of `execaCommand` to use `getExeca`
export const execaCommand = async (
  command: string,
  options: Options = {}
): Promise<ExecaChildProcess<string>> => {
  // We await here because execaCommand returns a promise, but that's not what the user expects
  // eslint-disable-next-line @typescript-eslint/return-await
  return await execa(command, {
    cleanup: true,
    ...options,
  });
};

export const exec = async (
  command: string | string[],
  options: Options = {},
  { startMessage, errorMessage, dryRun, debug, signal }: StepOptions = {}
): Promise<void> => {
  logger.info();
  if (startMessage) logger.info(startMessage);

  if (dryRun) {
    logger.info(`\n> ${command}\n`);
    return undefined;
  }

  const defaultOptions: Options = {
    shell: true,
    stdout: debug ? 'inherit' : 'pipe',
    stderr: debug ? 'inherit' : 'pipe',
    signal,
  };
  let currentChild: ExecaChildProcess<string>;

  try {
    if (typeof command === 'string') {
      logger.debug(`> ${command}`);
      currentChild = execa(command, { ...defaultOptions, ...options });
      await currentChild;
    } else {
      for (const subcommand of command) {
        logger.debug(`> ${subcommand}`);
        currentChild = execa(subcommand, { ...defaultOptions, ...options });
        await currentChild;
      }
    }
  } catch (err) {
    if (!(typeof err === 'object' && 'killed' in err && err.killed)) {
      logger.error(chalk.red(`An error occurred while executing: \`${command}\``));
      logger.log(`${errorMessage}\n`);
    }

    throw err;
  }

  return undefined;
};
