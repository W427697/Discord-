import { toId } from '@storybook/router';

export function renderBootstrapCode({ mainFileLocation, idsToFrameworks, story, kind }) {
  return `${mainFileLocation ? `import "..${mainFileLocation}"` : ''};
import addons from "@storybook/addons";
import Events from "@storybook/core-events";
import { toId } from "@storybook/router/utils";
import { forceReRender, addDecorator } from "${(idsToFrameworks || {})[
    toId(kind || 'a', story || 'a')
  ] || '@storybook/react'}";
import { document } from "global";
import React from "react";
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
));

addons.getChannel().emit(Events.SET_CURRENT_STORY, {
  storyId: toId("${kind}", "${story}")
});
const div1 = document.createElement("div");
div1.id = "error-stack";
const div2 = document.createElement("div");
div2.id = "error-message";
document.body.appendChild(div1);
document.body.appendChild(div2);
forceReRender();
`;
}
