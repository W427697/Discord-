import { addons } from '@storybook/addons';
import { STORY_CHANGED, STORY_ERRORED, STORY_MISSING } from '@storybook/core-events';

import ReactGA, { Tracker } from 'react-ga';
import { PARAM_KEY, ADDON_ID } from './constants';
import DEFAULT_EVENT_MAPPING from './defaults';
import { AnalyticsAddonParameter, EventMap } from './types';
import { trackedEvents } from './utils';

addons.register(ADDON_ID, (api: any) => {
  const {
    reactGAId,
    reactGAOptions,
    events: userSpecifiedEvents = DEFAULT_EVENT_MAPPING,
  }: AnalyticsAddonParameter = api.getCurrentParameter(PARAM_KEY);

  // NOTE: interpolate default event mapping, with user specified event mapping
  const events: EventMap = { ...DEFAULT_EVENT_MAPPING, ...userSpecifiedEvents };

  // NOTE: returns a function that will check the provided key and return a boolean
  // denoting if we should track this event
  const isTrackedEvent = trackedEvents(events, api);

  // NOTE: Initialize ReactGA with user provided ReactGA options.
  if (typeof reactGAId === 'string') {
    ReactGA.initialize(reactGAId as string, reactGAOptions);
  } else {
    ReactGA.initialize(reactGAId as Tracker[], reactGAOptions);
  }

  api.on(STORY_CHANGED, (id: string) => {
    if (!isTrackedEvent(STORY_CHANGED, { id })) return;

    const { path } = api.getUrlState();
    ReactGA.pageview(path);
  });

  api.on(STORY_ERRORED, ({ title, description }: { title: string; description: string }) => {
    if (!isTrackedEvent(STORY_ERRORED, { title, description })) return;

    ReactGA.exception({
      description,
      fatal: true,
    });
  });

  api.on(STORY_MISSING, (id: string) => {
    if (!isTrackedEvent(STORY_ERRORED, { id })) return;

    ReactGA.exception({
      description: `attempted to render ${id}, but it is missing`,
      fatal: false,
    });
  });
});
