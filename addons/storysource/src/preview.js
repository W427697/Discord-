import addons from '@storybook/addons';
import { EVENT_ID } from './events';

const getLocation = (context, locationsMap) => locationsMap[context.id];

function setStorySource(context, source, locationsMap) {
  const currentLocation = getLocation(context, locationsMap);

  addons.getChannel().emit(EVENT_ID, {
    edition: { source },
    location: {
      currentLocation,
      locationsMap
    }
  });
}

export function withStorySource(source, locationsMap = {}) {
  return (storyFn, context) => {
    setStorySource(context, source, locationsMap);
    return storyFn();
  };
}
