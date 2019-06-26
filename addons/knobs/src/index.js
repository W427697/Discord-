import addons, { makeDecorator } from '@storybook/addons';

import { SET_OPTIONS } from './shared';

import { manager, registerKnobs } from './registerKnobs';

export function knob(name, optionsParam) {
  return manager.knob(name, optionsParam);
}

/**
 * TODO: Typescript would be really great here.
 * But overall A knob implementation function should conform to 3 maximum arguments.
  name, value, options !

  https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)
  https://stackoverflow.com/questions/174968/how-many-parameters-are-too-many#answer-175035

 * @param  {String} name - label to identify a knob
 * @param  {Any} value - value of the knob could be a callback
 * @param  {Object} options - value of the knob could be a callback
  * @param  {String|Number} options.groupId - (optional) knob grouping to allow same names but different groups / buckets.
  * @param  {Boolean} options.set - (optional) allows you to set a knob from the api allowing two way data updates
  *    Where set of true allows you to set / update the knob value. False will return the current knob value
  *    without setting (old default behavior).
  * 
  *    1st way component updates values from the knob itself
  *    2nd way outside updates from the api
  * 
  *    This allows knobs to not be mere just drivers of an interface (option 1). With option 2
  *    this allows knobs to report the current stories app state easily with no added JSX.
  * @param  {Object} options.options (optional)
 *
 */
export function text(name, value, { groupId, set } = {}) {
  return manager.knob(name, { type: 'text', value, groupId, set });
}

export function boolean(name, value, { groupId, set } = {}) {
  return manager.knob(name, { type: 'boolean', value, groupId, set });
}

export function number(name, value, { options = {}, groupId, set } = {}) {
  const rangeDefaults = {
    min: 0,
    max: 10,
    step: 1,
  };

  const mergedOptions = options.range
    ? {
        ...rangeDefaults,
        ...options,
      }
    : options;

  const finalOptions = {
    ...mergedOptions,
    type: 'number',
    value,
    groupId,
  };

  return manager.knob(name, finalOptions);
}

export function color(name, value, { groupId, set } = {}) {
  return manager.knob(name, { type: 'color', value, groupId, set });
}

export function object(name, value, { groupId, set } = {}) {
  return manager.knob(name, { type: 'object', value, groupId, set });
}

export function select(name, value, { options, groupId, set } = {}) {
  return manager.knob(name, { type: 'select', selectV2: true, options, value, groupId, set });
}

export function radios(name, value, { options, groupId, set } = {}) {
  return manager.knob(name, { type: 'radios', options, value, groupId, set });
}

export function array(name, value, { separator = ',', groupId, set } = {}) {
  return manager.knob(name, { type: 'array', value, separator, groupId, set });
}

export function date(name, value = new Date(), { groupId, set } = {}) {
  const proxyValue = value ? value.getTime() : null;
  return manager.knob(name, { type: 'date', value: proxyValue, groupId, set });
}

export function button(name, callback, { groupId, set } = {}) {
  return manager.knob(name, { type: 'button', callback, hideLabel: true, groupId, set });
}

export function files(name, value = [], { groupId, accept, set } = {}) {
  return manager.knob(name, { type: 'files', accept, value, groupId, set });
}

export function optionsKnob(name, value, { values, options, groupId, set } = {}) {
  return manager.knob(name, {
    type: 'options',
    options: values,
    value,
    optionsObj: options,
    groupId,
    set,
  });
}

const defaultOptions = {
  escapeHTML: true,
};

export const withKnobs = makeDecorator({
  name: 'withKnobs',
  parameterName: 'knobs',
  skipIfNoParametersOrOptions: false,
  allowDeprecatedUsage: true,
  wrapper: (getStory, context, { options, parameters }) => {
    const storyOptions = parameters || options;
    const allOptions = { ...defaultOptions, ...storyOptions };

    const channel = addons.getChannel();
    manager.setChannel(channel);
    manager.setOptions(allOptions);
    channel.emit(SET_OPTIONS, allOptions);

    registerKnobs();
    return getStory(context);
  },
});

export * from './shared';

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
