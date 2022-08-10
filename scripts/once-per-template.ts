/* eslint-disable no-restricted-syntax, no-await-in-loop */
import { Command } from 'commander';
import execa from 'execa';
import { resolve, join } from 'path';
import { getJunitXml } from 'junit-xml';
import { outputFile } from 'fs-extra';

import {
  getOptions,
  getCommand,
  getOptionsOrPrompt,
  createOptions,
  OptionValues,
} from './utils/options';
import type { OptionSpecifier } from './utils/options';
import { filterDataForCurrentCircleCINode } from './utils/concurrency';

import TEMPLATES from '../code/lib/cli/src/repro-templates';

const sandboxDir = resolve(__dirname, '../sandbox');
const logger = console;

export type Cadence = 'ci' | 'daily' | 'weekly';
export type Template = {
  name: string;
  script: string;
  cadence?: readonly Cadence[];
  skipScripts?: string[];
  // there are other fields but we don't use them here
};
export type TemplateKey = string;
export type Templates = Record<TemplateKey, Template>;

export const options = createOptions({
  step: {
    type: 'string',
    description: 'What type of step are you taking per template (for logging and test results)?',
  },
  cadence: {
    type: 'string',
    description: 'What cadence are we running on (i.e. which templates should we use)?',
    values: ['ci', 'daily', 'weekly'] as const,
    required: true,
  },
  script: {
    type: 'string',
    description: 'What command are we running?',
  },
  parallel: {
    type: 'boolean',
    description: 'Run commands in parallel?',
  },
  cd: {
    type: 'boolean',
    description: 'Change directory into sandbox?',
    inverse: true,
  },
  junit: {
    type: 'string',
    description: 'Report results to junit XML file at path',
  },
});

export function filterTemplates(templates: Templates, cadence: Cadence, scriptName: string) {
  const allTemplates = Object.entries(templates);
  const cadenceTemplates = allTemplates.filter(([, template]) =>
    template.cadence.includes(cadence)
  );
  const jobTemplates = cadenceTemplates.filter(([, t]) => !t.skipScripts?.includes(scriptName));
  return Object.fromEntries(filterDataForCurrentCircleCINode(jobTemplates));
}

export async function parseCommand(commandline: string) {
  const argv = commandline.split(' ');

  const [yarnOrNpx, scriptName] = argv;

  try {
    const { options: scriptOptions } = await import(`./${scriptName}`);

    const command = new Command(scriptName);
    const values = getOptions(command, scriptOptions as OptionSpecifier, [yarnOrNpx, ...argv]);

    return {
      scriptName,
      command: `yarn ${scriptName}`,
      options: scriptOptions,
      values,
    };
  } catch (err) {
    return {
      scriptName,
      command: commandline,
    };
  }
}

type RunResult = {
  template: TemplateKey;
  timestamp: Date;
  time: number;
  ok: boolean;
  output?: string;
  err?: Error;
};

async function runCommand(
  command: string | string[],
  execaOptions: execa.Options,
  { step, template }: { step: string; template: string }
): Promise<RunResult> {
  const timestamp = new Date();
  try {
    logger.log(`🏃  ${step} ${template}: Running ${command}`);

    const allOutput = [];
    if (typeof command === 'string') {
      logger.debug(`> ${command}`);
      const { all } = await execa.command(command, execaOptions);
      allOutput.push(all);
    } else {
      for (const subcommand of command) {
        logger.debug(`> ${subcommand}`);
        const { all } = await execa.command(subcommand, execaOptions);
        allOutput.push(all);
      }
    }

    logger.log(`✅ ${step} ${template}: Done.`);

    return {
      template,
      timestamp,
      time: (Date.now() - +timestamp) / 1000,
      ok: true,
      output: allOutput.join('\n'),
    };
  } catch (err) {
    logger.log(`❌ ${step} ${template}: Failed.`);
    logger.log(err);
    return { template, timestamp, time: (Date.now() - +timestamp) / 1000, ok: false, err };
  }
}

async function writeJunitXml(step: string, start: Date, results: RunResult[], path: string) {
  const junitXml = getJunitXml({
    time: (Date.now() - +start) / 1000,
    name: `${step} Templates`,
    suites: results.map(({ template, timestamp, time, ok, err, output }) => ({
      name: template,
      timestamp,
      time,
      testCases: [
        {
          name: `${step} ${template}`,
          assertions: 1,
          time,
          systemOut: output?.split('\n'),
          ...(!ok && {
            errors: [err],
          }),
        },
      ],
    })),
  });
  await outputFile(path, junitXml);
  logger.log(`Test results written to ${resolve(path)}`);
}

type CLIOptions = OptionValues<typeof options>;

export async function oncePerTemplate({
  step = 'Testing',
  cadence,
  parallel,
  cd,
  junit: junitPath,
  scriptName,
  templateCommand,
}: Omit<CLIOptions, 'script'> & {
  scriptName: string;
  templateCommand: (template: TemplateKey) =>
    | string
    | string[]
    | {
        command: string | string[];
        execaOptions?: execa.Options;
      };
}) {
  const templates = filterTemplates(TEMPLATES, cadence, scriptName);

  const start = new Date();
  const toAwait = [];
  for (const template of Object.keys(templates)) {
    const templateDir = template.replace('/', '-');
    const commandOrOptions = templateCommand(template);
    const { command, execaOptions: templateExecaOptions } =
      typeof commandOrOptions === 'string' || Array.isArray(commandOrOptions)
        ? { command: commandOrOptions, execaOptions: null }
        : commandOrOptions;

    const execaOptions = {
      shell: true,
      ...(cd && { cwd: join(sandboxDir, templateDir) }),
      ...templateExecaOptions,
    };

    if (parallel) {
      toAwait.push(runCommand(command, execaOptions, { step, template }));
    } else {
      toAwait.push(
        Promise.resolve(
          await runCommand(command, { stdio: 'inherit', ...execaOptions }, { step, template })
        )
      );
    }
  }

  const results = await Promise.all(toAwait);
  if (junitPath) {
    await writeJunitXml(step, start, results, junitPath);
  }

  const failed = results.find((result) => !result.ok);
  if (failed) throw failed.err;
}

async function run() {
  const { script: commandline, ...optionValues } = await getOptionsOrPrompt(
    'yarn once-per-template',
    options
  );
  const command = await parseCommand(commandline);
  return oncePerTemplate({
    ...optionValues,
    scriptName: command.scriptName,
    templateCommand: (template) => {
      if (command.options) {
        return getCommand(command.command, command.options, {
          ...command.values,
          template,
        });
      }

      return command.command;
    },
  });
}

if (require.main === module) {
  run().catch((err) => {
    logger.error('🚨 An error occurred when executing "once-per-template":');
    logger.error(err);
    process.exit(1);
  });
}
