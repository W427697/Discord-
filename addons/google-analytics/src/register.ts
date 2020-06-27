import { addons } from '@storybook/addons';
import { STORY_CHANGED, STORY_ERRORED, STORY_MISSING } from '@storybook/core-events';
import { PARAM_KEY, ADDON_ID } from './constants';
import { useParameter } from '@storybook/api';

import ReactGA from 'react-ga';

interface GoogleAnalyticsAddonParameter {
  reactGAId?: string | [];
  reactGAOptions?: {};
}

addons.register(ADDON_ID, (api: any) => {
  let { reactGAId, reactGAOptions } = api.getCurrentParameter<GoogleAnalyticsAddonParameter>(
    PARAM_KEY
  );

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
