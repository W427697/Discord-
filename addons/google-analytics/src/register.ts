import { addons } from '@storybook/addons';
import { STORY_CHANGED, STORY_ERRORED, STORY_MISSING } from '@storybook/core-events';

import ReactGA from 'react-ga';
import { PARAM_KEY, ADDON_ID } from './constants';

addons.register(ADDON_ID, (api: any) => {
  const { reactGAId, reactGAOptions } = api.getCurrentParameter(PARAM_KEY);

  ReactGA.initialize(reactGAId, reactGAOptions);

  api.on(STORY_CHANGED, () => {
    const { path } = api.getUrlState();
    ReactGA.pageview(path);
  });
  api.on(STORY_ERRORED, ({ description }: { description: string }) => {
    ReactGA.exception({
      description,
      fatal: true,
    });
  });
  api.on(STORY_MISSING, (id: string) => {
    ReactGA.exception({
      description: `attempted to render ${id}, but it is missing`,
      fatal: false,
    });
  });
});
