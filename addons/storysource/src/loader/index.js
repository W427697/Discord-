import { readStory } from './dependencies-lookup/readAsObject';
import { getRidOfUselessFilePrefixes } from './dependencies-lookup/getRidOfUselessFilePrefixes';

function transform(inputSource) {
  return readStory(this, inputSource)
    .then(getRidOfUselessFilePrefixes)
    .then(
      ({
        prefix,
        resource,
        source,
        sourceJson,
        addsMap,
        dependencies,
        localDependencies,
        idsToFrameworks,
      }) => `
  export var withStorySource = require('@storybook/addon-storysource').withStorySource;
  export var __SOURCE_PREFIX__ = "${prefix}";
  export var __STORY__ = ${sourceJson};
  export var __ADDS_MAP__ = ${JSON.stringify(addsMap)};
  export var __MAIN_FILE_LOCATION__ = ${JSON.stringify(resource)};
  export var __MODULE_DEPENDENCIES__ = ${JSON.stringify(dependencies)};
  export var __LOCAL_DEPENDENCIES__ = ${JSON.stringify(localDependencies)};
  export var __IDS_TO_FRAMEWORKS__ = ${JSON.stringify(idsToFrameworks)};

  ${source}
  `
    );
}

export default transform;
