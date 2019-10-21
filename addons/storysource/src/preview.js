import addons from '@storybook/addons';
import { getLocation } from '@storybook/source-loader/preview';
import { EVENT_ID } from './events';

function setStorySource(context, source, locationsMap) {
  const currentLocation = getLocation(context, locationsMap);

  addons.getChannel().emit(EVENT_ID, {
    source,
    currentLocation,
    locationsMap,
  });
}

export function withStorySource(source, locationsMap = {}) {
  return (storyFn, context) => {
    setStorySource(context, source, locationsMap);
    return storyFn();
  };
}
