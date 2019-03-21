import addons from '@storybook/addons';
import { STORY_EVENT_ID } from './events';

const getLocation = (context, locationsMap) => locationsMap[context.id];

function setStorySource(
  context,
  source,
  locationsMap,
  mainFileLocation,
  dependencies,
  localDependencies,
  prefix,
  idsToFrameworks
) {
  const channel = addons.getChannel();
  const currentLocation = getLocation(context, locationsMap);

  channel.emit(STORY_EVENT_ID, {
    edition: {
      source,
      mainFileLocation,
      dependencies,
      localDependencies,
      prefix,
      idsToFrameworks,
    },
    story: {
      kind: context.kind,
      story: context.story,
    },
    location: {
      currentLocation,
      locationsMap,
    },
  });
}

export function withStorySource(
  source,
  locationsMap = {},
  mainFileLocation = '/index.js',
  dependencies = [],
  localDependencies = {},
  prefix,
  idsToFrameworks
) {
  return (story, context) => {
    setStorySource(
      context,
      source,
      locationsMap,
      mainFileLocation,
      dependencies,
      localDependencies,
      prefix,
      idsToFrameworks
    );
    return story();
  };
}
