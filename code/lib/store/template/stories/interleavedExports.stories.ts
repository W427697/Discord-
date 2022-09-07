import globalThis from 'global';

export default {
  component: globalThis.Components.Pre,
  args: { text: 'Check that stories are processed OK' },
};

export const Story1 = {};

// eslint-disable-next-line import/first, import/extensions, import/no-unresolved
import '../package.json';

export const Story2 = {};
