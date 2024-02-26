import React, { useState } from 'react';
import { IconButton } from '@storybook/components';
import { AddIcon, SyncIcon } from '@storybook/icons';
import { useStorybookApi, useChannel } from '@storybook/manager-api';
import type { LeafEntry } from '@storybook/manager-api';
import type { Args } from '@storybook/types';
import { dequal as deepEqual } from 'dequal';

import { SAVE_STORY, STORY_SAVED } from './constants';

const getSaveData = (entry: LeafEntry) => {
  if (entry?.type !== 'story') return undefined;

  const { args, initialArgs, name, title, importPath } = entry;

  if (!args || !initialArgs || deepEqual(args, initialArgs)) return undefined;

  const argsToSave = Object.entries(args).reduce((acc, [key, value]) => {
    const initialValue = initialArgs?.[key];
    if (!deepEqual(value, initialValue)) {
      acc[key] = value;
    }
    return acc;
  }, {} as Args);

  return {
    importPath,
    baseName: name,
    title,
    args: argsToSave,
  };
};

export const SaveButton = () => {
  const [saving, setSaving] = useState(false);
  const api = useStorybookApi();
  const emit = useChannel({
    [STORY_SAVED]: (story) => {
      api.clearNotification('saving');
      setSaving(false);
      api.selectStory(story.id);
    },
  });
  const storyData = api.getCurrentStoryData();

  const saveData = getSaveData(storyData);

  const Icon = saving ? SyncIcon : AddIcon;
  const disabled = saving || !saveData;

  return (
    <IconButton
      key="save"
      title="Save story"
      disabled={disabled}
      onClick={() => {
        const name = prompt('Enter a name for the saved story');
        if (name) {
          setSaving(true);
          api.addNotification({
            id: 'saving',
            content: { headline: 'Saving story' },
            link: '',
            icon: {
              name: 'sync',
            },
          });
          emit(SAVE_STORY, { ...saveData, name });
        }
      }}
    >
      <Icon />
    </IconButton>
  );
};
