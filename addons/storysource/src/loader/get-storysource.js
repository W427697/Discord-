import defaultOptions from './default-options';

import { extractComments, generateStorySource, generateAddsMap } from './generate-helpers';

function extendOptions(source, comments, filepath, options) {
  return {
    ...defaultOptions,
    ...options,
    source,
    comments,
    filepath,
  };
}

function getStoryData(source, filepath, options = {}) {
  const comments = extractComments(source, options.parser);

  const storySource = generateStorySource(extendOptions(source, comments, filepath, options));

  const addsMap = generateAddsMap(storySource, options.parser);

  let changed = false;
  if (Object.values(addsMap).length) {
    changed = true;
  }

  return {
    storySource,
    addsMap,
    changed,
  };
}

export default getStoryData;
