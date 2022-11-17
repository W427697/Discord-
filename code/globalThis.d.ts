/* eslint-disable no-underscore-dangle, @typescript-eslint/naming-convention */

import type {
  BuilderOptions,
  CoreConfig,
  DocsOptions,
  NormalizedStoriesSpecifier,
  StorybookConfig,
} from '@storybook/core-common';
import type { AddonStore, Channel } from '@storybook/addons';
import type { AnyFramework } from '@storybook/csf';
import type { ClientApi, StoryStore } from '@storybook/client-api';
import type { PreviewWeb } from 'lib/preview-web/src';

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
  var __STORYBOOK_CLIENT_API__: ClientApi<AnyFramework> | undefined;
  var __STORYBOOK_PREVIEW__: PreviewWeb<AnyFramework> | undefined;
  var __STORYBOOK_STORY_STORE__: StoryStore<AnyFramework> | undefined;
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
    Omit<NormalizedStoriesSpecifier, 'importPathMatcher'> & {
      importPathMatcher: string;
    }
  >;
}
