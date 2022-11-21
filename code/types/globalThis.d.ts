/* eslint-disable no-underscore-dangle, @typescript-eslint/naming-convention */

import type {
  BuilderOptions,
  CoreConfig,
  DocsOptions,
  Store_NormalizedStoriesSpecifierEntry,
  StorybookConfig,
  Renderer,
} from '@storybook/types';
import type { AddonStore } from '@storybook/addons';
import type { Channel } from '@storybook/channels';
import type { ClientApi, StoryStore } from '@storybook/client-api';
import type { PreviewWeb } from '@storybook/preview-web';

declare global {
  var CHANNEL_OPTIONS: CoreConfig['channelOptions'];
  var CONFIG_TYPE: BuilderOptions['configType'];
  var DOCS_OPTIONS: DocsOptions | undefined;
  var FEATURES: StorybookConfig['features'] | undefined;
  var FRAMEWORK_OPTIONS: any;
  var STORYBOOK_REACT_CLASSES: {};
  var STORYBOOK_ENV: string;
  var __STORYBOOK_ADDONS: AddonStore | undefined;
  var __STORYBOOK_ADDONS_CHANNEL__: Channel | undefined;
  var __STORYBOOK_CLIENT_API__: ClientApi<Renderer> | undefined;
  var __STORYBOOK_PREVIEW__: PreviewWeb<Renderer> | undefined;
  var __STORYBOOK_STORY_STORE__: StoryStore<Renderer> | undefined;
  var SERVER_CHANNEL_URL: string | undefined;
  var IS_STORYBOOK: true | undefined;
  var LOGLEVEL: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
  var PREVIEW_URL: string | undefined;
  var RELEASE_NOTES_DATA: string | undefined; // stringified ReleaseNotesData
  var VERSIONCHECK: string | undefined; // stringified VersionCheck
  var Components: {
    Button?: any;
    Pre?: any;
    Form?: any;
    Html?: any;
  };
  var STORIES: Array<
    Omit<Store_NormalizedStoriesSpecifierEntry, 'importPathMatcher'> & {
      importPathMatcher: string;
    }
  >;
}
