import globalThis from 'global';

export default {
  component: globalThis.Components.Button,
  args: {
    children: 'Click Me!',
  },
  parameters: {
    chromatic: { disable: true },
  },
};

export const Basic = {};

export const Violation = {
  args: {
    // empty on purpose to get a button with no text
    children: '',
  },
};

export const Checks = {
  parameters: {
    a11y: {
      config: {},
      options: {
        checks: {
          'color-contrast': { options: { noScroll: true } },
        },
        restoreScroll: true,
      },
    },
  },
};

export const Targetted = {
  parameters: {
    a11y: {
      element: 'button',
    },
  },
};

export const Blank = {
  parameters: {
    a11y: {
      config: {
        disableOtherRules: true,
        // @ts-ignore
        rules: [],
      },
      options: {},
    },
  },
};

export const Disabled = {
  parameters: {
    a11y: {
      disable: true,
    },
  },
};
