declare module '@aw-web-design/x-default-browser';
declare module '@discoveryjs/json-ext';
declare module 'better-opn';
declare module 'lazy-universal-dotenv';
declare module 'open';
declare module 'pnp-webpack-plugin';
declare module 'watchpack';

declare var FEATURES:
  | {
      storyStoreV7?: boolean;
      storyStoreV7MdxErrors?: boolean;
      argTypeTargetsV7?: boolean;
      legacyMdx1?: boolean;
      legacyDecoratorFileOrder?: boolean;
    }
  | undefined;

declare var STORIES: any;
declare var DOCS_OPTIONS: any;
declare var telemetryContext: any;

// To enable user code to detect if it is running in Storybook
declare var IS_STORYBOOK: boolean;

declare var LOGLEVEL: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent' | undefined;
