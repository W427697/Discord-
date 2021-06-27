import { ClientApi, StoryStore } from '@storybook/client-api';
import { Channel } from '@storybook/channels';
import root from 'window-or-global';

export type AugmentedWindow = {
  __STORYBOOK_CLIENT_API__?: ClientApi;
  __STORYBOOK_STORY_STORE__?: StoryStore;
  __STORYBOOK_ADDONS_CHANNEL__?: Channel;
  STORYBOOK_REACT_CLASSES: Record<string, unknown>;
  FEATURES: {
    previewCsfV3?: boolean;
  };
} & typeof root;
