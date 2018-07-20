import deprecate from 'util-deprecate';

import addons, { makeDecorator } from '@storybook/addons';

import { manager, registerKnobs } from './registerKnobs';

export function knob(name, options) {
  return manager.knob(name, options);
}

export function text(name, value, groupId, { onChange } = {}) {
  return manager.knob(name, { type: 'text', value, groupId, onChange });
}

export function boolean(name, value, groupId, { onChange } = {}) {
  return manager.knob(name, { type: 'boolean', value, groupId, onChange });
}

export function number(name, value, options = {}, groupId) {
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

export function color(name, value, groupId, { onChange } = {}) {
  return manager.knob(name, { type: 'color', value, groupId, onChange });
}

export function object(name, value, groupId, { onChange } = {}) {
  return manager.knob(name, { type: 'object', value, groupId, onChange });
}

export function select(name, options, value, groupId, { onChange } = {}) {
  return manager.knob(name, { type: 'select', selectV2: true, options, value, groupId, onChange });
}

export function array(name, value, separator = ',', groupId, { onChange } = {}) {
  return manager.knob(name, { type: 'array', value, separator, groupId, onChange });
}

export function date(name, value = new Date(), groupId, { onChange } = {}) {
  const proxyValue = value ? value.getTime() : null;
  return manager.knob(name, { type: 'date', value: proxyValue, groupId, onChange });
}

export function button(name, callback, groupId, { onChange } = {}) {
  return manager.knob(name, { type: 'button', callback, hideLabel: true, groupId, onChange });
}

export function files(name, accept, value = [], { onChange } = {}) {
  return manager.knob(name, { type: 'files', accept, value, onChange });
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

    manager.setOptions(allOptions);
    const channel = addons.getChannel();
    manager.setChannel(channel);
    channel.emit('addon:knobs:setOptions', allOptions);

    registerKnobs();
    return getStory(context);
  },
});

export const withKnobsOptions = deprecate(
  withKnobs,
  'withKnobsOptions is deprecated. Instead, you can pass options into withKnobs(options) directly, or use the knobs parameter.'
);
