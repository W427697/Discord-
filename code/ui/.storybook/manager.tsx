import React from 'react';
import { addons, types, useArgs } from '@storybook/manager-api';
import startCase from 'lodash/startCase.js';
import { SAVE_STORY_REQUEST, SAVE_STORY_RESULT } from '@storybook/core-events';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CheckIcon, AlertIcon } from '@storybook/icons';

addons.setConfig({
  sidebar: {
    renderLabel: ({ name, type }) => (type === 'story' ? name : startCase(name)),
  },
});

interface RequestSaveStoryPayload {
  // The id of the request. It might be simply the story Title
  id: string;
  // The path of the Story
  importPath: string;
  // The updated list of set args
  args: Record<string, any>;
  // The exported name of the Story -> This information doesn't exist in the index.json yet.
  name?: string;
}

addons.register('my-addon', (api) => {
  api.on(SAVE_STORY_RESULT, (data) => {
    if (data.error) {
      api.addNotification({
        content: { headline: `Error saving story`, subHeadline: ` ${data.error}` },
        id: 'save-story-error',
        icon: <AlertIcon />,
      });
    } else {
      api.addNotification({
        content: { headline: `Story saved`, subHeadline: ` ${data.id}` },
        duration: 2000,
        icon: <CheckIcon />,
        id: 'save-story-success',
      });
    }
  });
  addons.add('my-addon/panel', {
    type: types.PANEL,
    title: 'My Addon',
    render: ({ active }) => {
      const [args] = useArgs();

      return active ? (
        <div>
          <button
            onClick={() => {
              const current = api.getCurrentStoryData();
              const payload: RequestSaveStoryPayload = {
                args,
                id: current.id,
                importPath: current.importPath,
                // name: 'StatelessWithCustomEmpty',
              };
              api.emit(SAVE_STORY_REQUEST, payload);
            }}
          >
            CLICK
          </button>
        </div>
      ) : null;
    },
  });
});
