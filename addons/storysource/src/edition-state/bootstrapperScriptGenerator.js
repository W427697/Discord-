import { getFrameworkName, readFrameworkOverrides } from './frameworkOverridesReader';

export function renderBootstrapCode({ mainFileLocation, idsToFrameworks, story, kind }) {
  const { theming, rootDiv } = readFrameworkOverrides({ idsToFrameworks, story, kind });
  const framework = getFrameworkName({ idsToFrameworks, story, kind }) || '@storybook/react';
  return `${mainFileLocation ? `import "..${mainFileLocation}"` : ''};
import addons from "@storybook/addons";
import Events from "@storybook/core-events";
import { toId } from "@storybook/router/utils";
import { forceReRender, addDecorator } from "${framework}";
import { document } from "global";
${
  !theming
    ? ''
    : `import React from "react";
import {
  Global,
  ThemeProvider,
  themes,
  createReset,
  convert
} from "@storybook/theming";

addDecorator(storyFn => (
  <ThemeProvider theme={convert(themes.light)}>
    <Global styles={createReset} />
    {storyFn()}
  </ThemeProvider>
));`
}

addons.getChannel().emit(Events.SET_CURRENT_STORY, {
  storyId: toId("${kind}", "${story}")
});
const div1 = document.createElement("div");
div1.id = "error-stack";
const div2 = document.createElement("div");
div2.id = "error-message";
${
  !rootDiv
    ? ''
    : `const div0 = document.createElement("div");
div0.id = "root";
document.body.appendChild(div0);`
}
document.body.appendChild(div1);
document.body.appendChild(div2);
forceReRender();
`;
}
