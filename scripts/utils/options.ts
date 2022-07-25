/**
 * Use commander and prompts to gather a list of options for a script
 */

import prompts from 'prompts';
import type { PromptObject } from 'prompts';
import program from 'commander';
import type { Command } from 'commander';
import kebabCase from 'lodash/kebabCase';
import { raw } from 'express';

export type OptionId = string;
export type OptionValue = string | boolean;
export type BaseOption = {
  name: string;
  /**
   * By default the one-char version of the option key will be used as short flag. Override here,
   *   e.g. `shortFlag: 'c'`
   */
  shortFlag?: string;
};

export type BooleanOption = BaseOption & {
  /**
   * Does this option default true?
   */
  inverse?: boolean;
};

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

function shortFlag(key: OptionId, option: Option) {
  const inverse = !isStringOption(option) && option.inverse;
  const defaultShortFlag = inverse ? key.substring(0, 1).toUpperCase() : key.substring(0, 1);
  const shortFlag = option.shortFlag || defaultShortFlag;
  if (shortFlag.length !== 1) {
    throw new Error(
      `Invalid shortFlag for ${key}: '${shortFlag}', needs to be a single character (e.g. 's')`
    );
  }
  return shortFlag;
}

function longFlag(key: OptionId, option: Option) {
  const inverse = !isStringOption(option) && option.inverse;
  return inverse ? `no-${kebabCase(key)}` : kebabCase(key);
}

function optionFlags(key: OptionId, option: Option) {
  const base = `-${shortFlag(key, option)}, --${longFlag(key, option)}`;
  if (isStringOption(option)) {
    return `${base} <${key}>`;
  }
  return base;
}

function getRawOptions(command: Command, options: OptionSpecifier, argv: string[]): OptionValues {
  Object.entries(options)
    .reduce((acc, [key, option]) => {
      const flags = optionFlags(key, option);
      if (isStringOption(option) && option.multiple) {
        return acc.option(flags, option.name, (x, l) => [...l, x], []);
      }
      return acc.option(flags, option.name, isStringOption(option) ? undefined : !!option.inverse);
    }, command)
    .parse(argv);

  return command.opts();
}

function validateOptions(options: OptionSpecifier, values: OptionValues) {
  Object.entries(options).forEach(([key, option]) => {
    if (isStringOption(option)) {
      const toCheck: string[] = option.multiple
        ? (values[key] as string[])
        : [values[key] as string];
      const badValue = toCheck.find((value) => !option.values.includes(value));
      if (badValue)
        throw new Error(`Invalid option provided to --${longFlag(key, option)}: '${badValue}'`);
    }
  });
}

export function getOptions(command: Command, options: OptionSpecifier, argv: string[]) {
  const rawValues = getRawOptions(command, options, argv);
  validateOptions(options, rawValues);
  return rawValues;
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
        type: option.multiple ? 'autocompleteMultiselect' : 'select',
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
      initial: option.inverse,
      active: 'yes',
      inactive: 'no',
    };
  });

  const selection = await prompts(questions);
  return selection;
}

function getFlag(key: OptionId, option: Option, value: OptionValue | OptionValue[]) {
  if (isStringOption(option)) {
    if (value) {
      if (Array.isArray(value)) {
        return value.map((v) => `--${longFlag(key, option)} ${v}`).join(' ');
      }
      return `--${longFlag(key, option)} ${value}`;
    }
    return '';
  }
  const toggled = option.inverse ? !value : value;
  return toggled ? `--${longFlag(key, option)}` : '';
}

export function getCommand(prefix: string, options: OptionSpecifier, values: OptionValues) {
  const flags = Object.keys(options)
    .map((key) => getFlag(key, options[key], values[key]))
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
