import type {
  Addon_OptionsParameterV7,
  Addon_StorySortComparatorV7,
  Addon_StorySortObjectParameter,
  Addon_StorySortParameterV7,
} from '@storybook/types';

import { dedent } from 'ts-dedent';

const logger = console;

const unsupported = (unexpectedVar: string, isError: boolean) => {
  const message = dedent`
    Unexpected '${unexpectedVar}'. Parameter 'options.storySort' should be defined inline e.g.:

    export const parameters = {
      options: {
        storySort: <array | object | function>
      }
    }
  `;
  if (isError) {
    throw new Error(message);
  } else {
    logger.info(message);
  }
};

const isStorySortArray = (variable: any): variable is Array<any> => {
  return variable instanceof Array;
};

const isStorySortComparator = (variable: any): variable is Addon_StorySortComparatorV7 => {
  return variable instanceof Function;
};

const isStorySortObject = (variable: any): variable is Addon_StorySortObjectParameter => {
  return (
    typeof variable === 'object' &&
    (('method' in variable && typeof variable.method === 'string') ||
      ('order' in variable && variable.order instanceof Array) ||
      ('locales' in variable && typeof variable.locales === 'string') ||
      ('includeNames' in variable && typeof variable.includeNames === 'boolean'))
  );
};

export const getStorySortParameter = (preview: {
  parameters: { options: Addon_OptionsParameterV7 };
}): Addon_StorySortParameterV7 => {
  const { parameters } = preview;
  if (!parameters) return undefined;

  if (!(parameters instanceof Object) || parameters instanceof Array) {
    unsupported('parameters', true);
  }

  const { options } = parameters;
  if (!options) return undefined;
  if (!(options instanceof Object)) {
    unsupported('options', true);
  }

  const { storySort } = options;
  if (!storySort) return undefined;

  if (
    isStorySortArray(storySort) ||
    isStorySortComparator(storySort) ||
    isStorySortObject(storySort)
  ) {
    return storySort;
  }

  unsupported('storySort', true);
  return undefined;
};
