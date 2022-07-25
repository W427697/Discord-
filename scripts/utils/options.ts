/**
 * Use commander and prompts to gather a list of options for a script
 */

import prompts from 'prompts';
import type { PromptObject } from 'prompts';
import program from 'commander';
import type { Command } from 'commander';

export type OptionId = string;
export type OptionValue = string | boolean;
export type BaseOption = {
  name: string;
  flags: string;
};

export type BooleanOption = BaseOption;

export type StringOption = BaseOption & {
  values: string[];
  multiple?: boolean;
  required?: boolean;
};

export type Option = BooleanOption | StringOption;

export type OptionSpecifier = Record<OptionId, Option>;
export type OptionValues = Record<OptionId, OptionValue | OptionValue[]>;

function isStringOption(option: Option): option is StringOption {
  return 'values' in option;
}

export function getOptions(
  command: Command,
  options: OptionSpecifier,
  argv: string[]
): OptionValues {
  Object.values(options)
    .reduce((acc, option) => {
      if (isStringOption(option) && option.multiple) {
        return acc.option(option.flags, option.name, (x, l) => [...l, x], []);
      }
      return acc.option(option.flags, option.name);
    }, command)
    .parse(argv);

  return command.opts();
}

export function areOptionsSatisfied(options: OptionSpecifier, values: OptionValues) {
  return !Object.entries(options)
    .filter(([, option]) => isStringOption(option) && option.required)
    .find(([key]) => !values[key]);
}

export async function promptOptions(
  options: OptionSpecifier,
  values: OptionValues
): Promise<OptionValues> {
  const questions = Object.entries(options).map(([key, option]): PromptObject => {
    if (isStringOption(option)) {
      const currentValue = values[key];
      return {
        type: option.multiple ? 'multiselect' : 'select',
        message: option.name,
        name: key,
        // warn: ' ',
        // pageSize: Object.keys(tasks).length + Object.keys(groups).length,
        choices: option.values.map((value) => ({
          title: value,
          value,
          selected:
            currentValue === value ||
            (Array.isArray(currentValue) && currentValue.includes?.(value)),
        })),
      };
    }
    return {
      type: 'toggle',
      message: option.name,
      name: key,
    };
  });

  const selection = await prompts(questions);
  return selection;
}

function getFlag(option: Option, value: OptionValue | OptionValue[]) {
  const longFlag = option.flags.split(' ').find((f) => f.startsWith('--'));
  if (isStringOption(option)) {
    if (value) {
      if (Array.isArray(value)) {
        return value.map((v) => `${longFlag} ${v}`).join(' ');
      }
      return `${longFlag} ${value}`;
    }
  }
  return value ? longFlag : '';
}

export function getCommand(prefix: string, options: OptionSpecifier, values: OptionValues) {
  const flags = Object.keys(options)
    .map((key) => getFlag(options[key], values[key]))
    .filter(Boolean);
  return `${prefix} ${flags.join(' ')}`;
}

export async function getOptionsOrPrompt(commandPrefix: string, options: OptionSpecifier) {
  const main = program.version('5.0.0');
  const cliValues = getOptions(main as any, options, process.argv);

  if (areOptionsSatisfied(options, cliValues)) {
    return cliValues;
  }

  const finalValues = await promptOptions(options, cliValues);

  const command = getCommand(commandPrefix, options, finalValues);
  console.log(`\nTo run this directly next time, use:\n  ${command}\n`);

  return finalValues;
}
