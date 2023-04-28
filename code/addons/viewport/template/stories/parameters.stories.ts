import { global as globalThis } from '@junk-temporary-prototypes/global';
import { MINIMAL_VIEWPORTS } from '@junk-temporary-prototypes/addon-viewport';

export default {
  component: globalThis.Components.Button,
  args: {
    label: 'Click Me!',
  },
  parameters: {
    viewport: {
      viewports: MINIMAL_VIEWPORTS,
    },
    chromatic: { disable: true },
  },
};

export const Basic = {
  parameters: {},
};

export const Selected = {
  parameters: {
    viewport: {
      defaultViewport: Object.keys(MINIMAL_VIEWPORTS)[0],
    },
  },
};

export const Orientation = {
  parameters: {
    viewport: {
      defaultViewport: Object.keys(MINIMAL_VIEWPORTS)[0],
      defaultOrientation: 'landscape',
    },
  },
};

export const Custom = {
  parameters: {
    viewport: {
      defaultViewport: 'phone',
      viewports: {
        phone: {
          name: 'Phone Width',
          styles: {
            height: '600px',
            width: '100vh',
          },
          type: 'mobile',
        },
      },
    },
  },
};

export const Disabled = {
  parameters: {
    viewport: { disable: true },
  },
};
