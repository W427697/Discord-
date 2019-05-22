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

export function addStorySourceDecorator(story, storysourceContext) {
  const {
    __STORY__: source,
    __ADDS_MAP__: locationsMap = {},
    __MAIN_FILE_LOCATION__: mainFileLocation = '/index.js',
    __MODULE_DEPENDENCIES__: dependencies = [],
    __LOCAL_DEPENDENCIES__: localDependencies = {},
    __SOURCE_PREFIX__: prefix,
    __IDS_TO_FRAMEWORKS__: idsToFrameworks,
  } = storysourceContext;
  const decorated = function(context) {
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
    if (typeof story === 'function') {
      story();
    }
    return story;
  };
  decorated.storyData = (story || {}).storyData;
  decorated.title = (story || {}).title;
  return decorated;
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
