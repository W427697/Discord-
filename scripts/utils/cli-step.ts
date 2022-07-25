import { getCommand, OptionSpecifier, OptionValues } from './options';
import { exec } from '../../lib/cli/src/repro-generators/scripts';

const cliExecutable = require.resolve('../../lib/cli/bin/index.js');

export type CLIStep = {
  command: string;
  description: string;
  hasArgument?: boolean;
  icon: string;
  // It would be kind of great to be able to share these with `lib/cli/src/generate.ts`
  options: OptionSpecifier;
};

export async function executeCLIStep(
  cliStep: CLIStep,
  options: {
    argument?: string;
    optionValues?: OptionValues;
    cwd: string;
  }
) {
  if (cliStep.hasArgument && !options.argument)
    throw new Error(`Argument required for ${cliStep.command} command.`);

  const prefix = `node ${cliExecutable} ${cliStep.command}`;
  const command = getCommand(
    cliStep.hasArgument ? `${prefix} ${options.argument}` : prefix,
    cliStep.options,
    options.optionValues || {}
  );

  await exec(
    command,
    { cwd: options.cwd },
    {
      startMessage: `${cliStep.icon} ${cliStep.description}`,
      errorMessage: `🚨 ${cliStep.description} failed`,
    }
  );
}
