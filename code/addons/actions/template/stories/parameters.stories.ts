import { global as globalThis } from '@junk-temporary-prototypes/global';
import { withActions } from '@junk-temporary-prototypes/addon-actions/decorator';

export default {
  component: globalThis.Components.Button,
  args: {
    label: 'Click Me!',
  },
  parameters: {
    chromatic: { disable: true },
  },
};

export const Basic = {
  parameters: {
    handles: [{ click: 'clicked', contextmenu: 'right clicked' }],
  },
  decorators: [withActions],
};
