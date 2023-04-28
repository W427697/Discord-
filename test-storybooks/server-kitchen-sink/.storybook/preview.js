import { withLinks } from '@junk-temporary-prototypes/addon-links';

export const decorators = [withLinks];

const port = process.env.SERVER_PORT || 1337;

export const parameters = {
  docs: {
    story: { iframeHeight: '200px' },
  },
  server: {
    url: `http://localhost:${port}/storybook_preview`,
  },
};
