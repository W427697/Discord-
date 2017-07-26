import { window } from 'global';
import addons from '@storybook/addons';
import KnobManager from './KnobManager';
import { vueHandler } from './vue';
import { reactHandler } from './react';

const channel = addons.getChannel();
const manager = new KnobManager(channel);

const knob = (name, options) => manager.knob(name, options);

const text = (name, value) => manager.knob(name, { type: 'text', value });

const boolean = (name, value) => manager.knob(name, { type: 'boolean', value });

const number = (name, value, options = {}) => {
  const defaults = {
    range: false,
    min: 0,
    max: 10,
    step: 1,
  };

  const mergedOptions = { ...defaults, ...options };

  const finalOptions = {
    ...mergedOptions,
    type: 'number',
    value,
  };

  return manager.knob(name, finalOptions);
};

const color = (name, value) => manager.knob(name, { type: 'color', value });

const object = (name, value) => manager.knob(name, { type: 'object', value });

const select = (name, options, value) => manager.knob(name, { type: 'select', options, value });

const array = (name, value, separator = ',') =>
  manager.knob(name, { type: 'array', value, separator });

const date = (name, value = new Date()) => {
  const proxyValue = value ? value.getTime() : null;
  return manager.knob(name, { type: 'date', value: proxyValue });
};

const ReactDecorator = (storyFn, context) =>
  reactHandler(channel, manager.knobStore)(storyFn)(context);

const ReactDecoratorWithOptions = (options = {}) => (...args) => {
  channel.emit('addon:knobs:setOptions', options);

  return ReactDecorator(...args);
};

const wrapper = options => {
  if (options) channel.emit('addon:knobs:setOptions', options);

  switch (window.STORYBOOK_ENV) {
    case 'vue': {
      return vueHandler(channel, manager.knobStore);
    }
    case 'react': {
      return reactHandler(channel, manager.knobStore);
    }
    default: {
      return reactHandler(channel, manager.knobStore);
    }
  }
};

export { wrapper as with };
export { array, boolean, color, date, knob, object, number, select, text };

// legacy
export { ReactDecorator as withKnobs, ReactDecoratorWithOptions as withKnobsOptions };
