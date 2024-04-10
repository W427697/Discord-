import React from 'react';
import { addons, types, useArgs } from '@storybook/manager-api';
import startCase from 'lodash/startCase.js';
import { add } from 'lodash';
import { SAVE_STORY_REQUEST } from '@storybook/core-events';
import { satisfies } from 'semver';

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
  name: string;
}

addons.register('my-addon', (api) => {
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
              console.log('CLICK');
              const payload: RequestSaveStoryPayload = {
                args,
                id: current.id,
                importPath: current.importPath,
                name: 'StatelessWithCustomEmpty',
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
