/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
declare module 'lazy-universal-dotenv';
declare module 'pnp-webpack-plugin';
declare module '@storybook/manager/paths';
declare module 'better-opn';
declare module 'open';
declare module '@aw-web-design/x-default-browser';

type Features = {
  storyStoreV7?: boolean;
  breakingChangesV7?: boolean;
  argTypeTargetsV7?: boolean;
};

var FEATURES: Features | undefined;

// ClientApi (and StoreStore) are really singletons. However they are not created until the
// relevant framework instantiates them via `start.js`. The good news is this happens right away.
var __STORYBOOK_CLIENTAPI_INSTANCE__: import('./modules/client-api/ClientApi').ClientApi<any>;
var __STORYBOOK_PREVIEWWEB_INSTANCE__: import('./modules/preview-web/PreviewWeb').PreviewWeb<any>;

// To enable user code to detect if it is running in Storybook
var IS_STORYBOOK: boolean;

var __STORYBOOK_CLIENT_API__: any;
var __STORYBOOK_ADDONS_CHANNEL__: any;
var __STORYBOOK_PREVIEW__: any;
var __STORYBOOK_STORY_STORE__: any;
var __STORYBOOK_ADDONS_PREVIEW: any;

declare module 'global' {
  export default globalThis;
}

declare module 'ansi-to-html';
declare class AnsiToHtml {
  constructor(options: { escapeHtml: boolean });

  toHtml: (ansi: string) => string;
}
