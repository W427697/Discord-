import execa, { Options } from 'execa';
import chalk from 'chalk';

const logger = console;

type StepOptions = {
  startMessage?: string;
  errorMessage?: string;
  dryRun?: boolean;
  debug?: boolean;
};

export const exec = async (
  command: string,
  options: Options = {},
  { startMessage, errorMessage, dryRun, debug }: StepOptions = {}
): Promise<void> => {
  logger.info();
  if (startMessage) logger.info(startMessage);

  if (dryRun) {
    logger.info(`\n> ${command}\n`);
    return undefined;
  }

  logger.debug(command);
  const defaultOptions: Options = {
    stdout: debug ? 'inherit' : 'ignore',
  };
  try {
    await execa.command(command, { ...defaultOptions, ...options });
  } catch (err) {
    logger.error(chalk.red(`An error occurred while executing: \`${command}\``));
    logger.log(errorMessage);
    throw err;
  }

  return undefined;
};
