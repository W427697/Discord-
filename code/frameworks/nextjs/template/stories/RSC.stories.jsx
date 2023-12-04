import { RSC } from './RSC';

export default {
  component: RSC,
};

export const Default = {};

export const DisableRSC = {
  tags: ['test-skip'],
  parameters: {
    chromatic: { disable: true },
    nextjs: { rsc: false },
  },
};

export const Error = {
  tags: ['test-skip'],
  parameters: {
    chromatic: { disable: true },
  },
  render: () => {
    throw new Error('RSC Error');
  },
};
