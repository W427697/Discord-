/**
 * Use commander and prompts to gather a list of options for a script
 */

import prompts from 'prompts';
import type { PromptObject } from 'prompts';
import program from 'commander';
import type { Command } from 'commander';
import kebabCase from 'lodash/kebabCase';

// Option types

export type OptionId = string;
export type BaseOption = {
  description?: string;
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
  required?: boolean;
};

export type StringArrayOption = BaseOption & {
  values: string[];
  multiple: true;
};

// StringArrayOption requires `multiple: true;` but unless you use `as const` an object with
// { multiple: true } will be inferred as `multiple: boolean;`
type StringArrayOptionMatch = Omit<StringArrayOption, 'multiple'> & { multiple: boolean };

export type Option = BooleanOption | StringOption | StringArrayOption;
export type MaybeOptionValue<TOption extends Option> = TOption extends StringArrayOptionMatch
  ? string[]
  : TOption extends StringOption
  ? string | undefined
  : TOption extends BooleanOption
  ? boolean
  : never;

// Note we use `required: boolean;` rather than `required: true` here for the same reason
// as `StringArrayOptionMatch` above. In both cases, the field should only ever be set to true
export type OptionValue<TOption extends Option> = TOption extends { required: boolean }
  ? string
  : MaybeOptionValue<TOption>;

export type OptionSpecifier = Record<OptionId, Option>;
export type MaybeOptionValues<TOptions extends OptionSpecifier> = {
  [TKey in keyof TOptions]: MaybeOptionValue<TOptions[TKey]>;
};

export type OptionValues<TOptions extends OptionSpecifier> = {
  [TKey in keyof TOptions]: OptionValue<TOptions[TKey]>;
};

export function isStringOption(option: Option): option is StringOption {
  return 'values' in option && !('multiple' in option);
}

export function isBooleanOption(option: Option): option is BooleanOption {
  return !('values' in option);
}

export function isStringArrayOption(option: Option): option is StringArrayOption {
  return 'values' in option && 'multiple' in option;
}

function shortFlag(key: OptionId, option: Option) {
  const inverse = isBooleanOption(option) && option.inverse;
  const defaultShortFlag = inverse ? key.substring(0, 1).toUpperCase() : key.substring(0, 1);
  const short = option.shortFlag || defaultShortFlag;
  if (short.length !== 1) {
    throw new Error(
      `Invalid shortFlag for ${key}: '${short}', needs to be a single character (e.g. 's')`
    );
  }
  return short;
}

function longFlag(key: OptionId, option: Option) {
  const inverse = isBooleanOption(option) && option.inverse;
  return inverse ? `no-${kebabCase(key)}` : kebabCase(key);
}

function optionFlags(key: OptionId, option: Option) {
  const base = `-${shortFlag(key, option)}, --${longFlag(key, option)}`;
  if (isStringOption(option) || isStringArrayOption(option)) {
    return `${base} <${key}>`;
  }
  return base;
}

export function getOptions<TOptions extends OptionSpecifier>(
  command: Command,
  options: TOptions,
  argv: string[]
): MaybeOptionValues<TOptions> {
  Object.entries(options)
    .reduce((acc, [key, option]) => {
      const flags = optionFlags(key, option);

      if (isBooleanOption(option)) return acc.option(flags, option.description, !!option.inverse);

      const checkStringValue = (raw: string) => {
        if (!option.values.includes(raw))
          throw new Error(`Unexpected value '${raw}' for option '${key}'`);
        return raw;
      };

      if (isStringOption(option))
        return acc.option(flags, option.description, (raw) => checkStringValue(raw));

      if (isStringArrayOption(option)) {
        return acc.option(
          flags,
          option.description,
          (raw, values) => [...values, checkStringValue(raw)],
          []
        );
      }

      throw new Error(`Unexpected option type '${key}'`);
    }, command)
    .parse(argv);

  // Note the code above guarantees the types as they come in, so we cast here.
  // Not sure there is an easier way to do this
  return command.opts() as MaybeOptionValues<TOptions>;
}

export function areOptionsSatisfied<TOptions extends OptionSpecifier>(
  options: TOptions,
  values: MaybeOptionValues<TOptions>
) {
  return !Object.entries(options)
    .filter(([, option]) => isStringOption(option) && option.required)
    .find(([key]) => !values[key]);
}

export async function promptOptions<TOptions extends OptionSpecifier>(
  options: TOptions,
  values: MaybeOptionValues<TOptions>
): Promise<OptionValues<TOptions>> {
  const questions = Object.entries(options).map(([key, option]): PromptObject => {
    if (!isBooleanOption(option)) {
      const currentValue = values[key];
      return {
        type: isStringArrayOption(option) ? 'autocompleteMultiselect' : 'select',
        message: option.description,
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
      message: option.description,
      name: key,
      initial: option.inverse,
      active: 'yes',
      inactive: 'no',
    };
  });

  const selection = await prompts(questions);
  // Again the structure of the questions guarantees we get responses of the type we need
  return selection as OptionValues<TOptions>;
}

function getFlag<TOption extends Option>(
  key: OptionId,
  option: TOption,
  value: OptionValue<TOption>
) {
  if (isBooleanOption(option)) {
    const toggled = option.inverse ? !value : value;
    return toggled ? `--${longFlag(key, option)}` : '';
  }

  if (isStringArrayOption(option)) {
    return value.map((v) => `--${longFlag(key, option)} ${v}`).join(' ');
  }

  if (isStringOption(option)) {
    if (value) {
      return `--${longFlag(key, option)} ${value}`;
    }
    return '';
  }

  throw new Error(`Unknown option type for '${key}'`);
}

export function getCommand<TOptions extends OptionSpecifier>(
  prefix: string,
  options: TOptions,
  values: OptionValues<TOptions>
) {
  const flags = Object.keys(options)
    .map((key) => getFlag(key, options[key], values[key]))
    .filter(Boolean);
  return `${prefix} ${flags.join(' ')}`;
}

export async function getOptionsOrPrompt<TOptions extends OptionSpecifier>(
  commandPrefix: string,
  options: TOptions
): Promise<OptionValues<TOptions>> {
  const main = program.version('5.0.0');
  const cliValues = getOptions(main as any, options, process.argv);

  if (areOptionsSatisfied(options, cliValues)) {
    // areOptionsSatisfied could be a type predicate but I'm not quite sure how to do it
    return cliValues as OptionValues<TOptions>;
  }

  const finalValues = await promptOptions(options, cliValues);

  const command = getCommand(commandPrefix, options, finalValues);
  console.log(`\nTo run this directly next time, use:\n  ${command}\n`);

  return finalValues;
}
