import type { ServerRenderer, Args, ArgTypes } from '@storybook/server';
import type { RenderContext } from '@storybook/types';
import { renderToCanvas as reactRenderToCanvas } from '@storybook/react/preview';
import { simulatePageLoad } from '@storybook/preview-api';

// Use Storybook's story ID by default, allow overrides with parameters.server.id?
// const fetchStoryHtml: FetchStoryHtmlType = async (url, id, params, storyContext) => {
//   console.log('fetchStoryHtml', url, id, params, storyContext);
//   const fetchUrl = new URL(url);
//   fetchUrl.search = new URLSearchParams({
//     ...storyContext.globals,
//     ...params,
//     _id: id || storyContext.id,
//   }).toString();
//   const response = await fetch(fetchUrl);
//   return response.text();
// };

const buildStoryArgs = (args: Args, argTypes: ArgTypes) => {
  const storyArgs = { ...args };

  Object.keys(argTypes).forEach((key: string) => {
    const argType = argTypes[key];
    const { control } = argType;
    const controlType = control && control.type.toLowerCase();
    const argValue = storyArgs[key];
    switch (controlType) {
      case 'date':
        // For cross framework & language support we pick a consistent representation of Dates as strings
        storyArgs[key] = new Date(argValue).toISOString();
        break;
      case 'object':
        // send objects as JSON strings
        storyArgs[key] = JSON.stringify(argValue);
        break;
      default:
    }
  });

  return storyArgs;
};

const appDir = false; // TODO AGAIN
export const renderToCanvas = !appDir
  ? reactRenderToCanvas
  : async (
      {
        id,
        // title,
        // name,
        showMain,
        // showError,
        // forceRemount,
        storyFn,
        storyContext,
        storyContext: { parameters, args, argTypes },
      }: RenderContext<ServerRenderer>,
      canvasElement: ServerRenderer['canvasElement']
    ) => {
      // Some addons wrap the storyFn so we need to call it even though Server doesn't need the answer
      storyFn();
      const storyArgs = buildStoryArgs(args, argTypes);

      const {
        server: { url, id: storyId, params },
      } = parameters;

      const fetchId = storyId || id;
      const storyParams = { ...params, ...storyArgs };
      const iframeUrl = `${url}/${fetchId}?${new URLSearchParams(storyParams).toString()}`;

      showMain();

      let iframe: any;
      if (canvasElement.children.length === 1 && canvasElement.children[0].nodeName === 'IFRAME') {
        iframe = canvasElement.children[0] as HTMLIFrameElement;
      } else {
        const iframeStyle = 'border: 0; min-width: 100vw; min-height: 100vh;';
        iframe = document.createElement('iframe');
        iframe.id = 'nextjs-iframe';
        iframe.setAttribute('style', iframeStyle);
        // eslint-disable-next-line no-param-reassign
        canvasElement.innerHTML = '';
        canvasElement.appendChild(iframe);
      }
      console.log('iframeUrl', iframeUrl);
      iframe.setAttribute('src', iframeUrl);

      // We need this so that "playing" render phase
      // waits unti the iframe content has actually loaded
      await new Promise((resolve) => iframe.addEventListener('load', resolve));

      // await iframeLoaded(iframe);

      simulatePageLoad(canvasElement);
    };
export default {
  parameters: {
    server: {
      // FIXME: how to set this dynamically?
      url: 'http://localhost:6006/nextjs-stories',
      // fetchStoryHtml,
    },
  },
};
