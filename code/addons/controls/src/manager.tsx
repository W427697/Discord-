import React from 'react';
import { AddonPanel, Badge, Spaced } from '@storybook/components';
import { SAVE_STORY_RESULT } from '@storybook/core-events';
import { addons, types, useArgTypes } from '@storybook/manager-api';
import { color } from '@storybook/theming';
import { ControlsPanel } from './ControlsPanel';
import { ADDON_ID, PARAM_KEY } from './constants';

function Title() {
  const rows = useArgTypes();
  const controlsCount = Object.values(rows).filter(
    (argType) => argType?.control && !argType?.table?.disable
  ).length;
  const suffix = controlsCount === 0 ? '' : <Badge status="neutral">{controlsCount}</Badge>;

  return (
    <div>
      <Spaced col={1}>
        <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>Controls</span>
        {suffix}
      </Spaced>
    </div>
  );
}

// It might take a little while for a new story to be available, so we retry a few times
const selectNewStory = (selectStory: (id: string) => void, storyId: string, attempt = 1) => {
  if (attempt > 5) return;
  try {
    selectStory(storyId);
  } catch (e) {
    setTimeout(() => selectNewStory(selectStory, storyId, attempt + 1), 500);
  }
};

addons.register(ADDON_ID, (api) => {
  addons.add(ADDON_ID, {
    title: Title,
    type: types.PANEL,
    paramKey: PARAM_KEY,
    render: ({ active }) => {
      if (!active || !api.getCurrentStoryData()) {
        return null;
      }
      return (
        <AddonPanel active={active}>
          <ControlsPanel />
        </AddonPanel>
      );
    },
  });

  api.on(
    SAVE_STORY_RESULT,
    ({ errorMessage, newStoryId, newStoryName, sourceFileName, sourceStoryName }) => {
      if (errorMessage) {
        api.addNotification({
          id: 'save-story-error',
          content: {
            headline: newStoryName ? 'Failed to add new story' : 'Failed to update story',
            subHeadline: newStoryName ? (
              <>
                Could not add story to <b>{sourceFileName}</b>. {errorMessage}
              </>
            ) : (
              <>
                Could not update story in <b>{sourceFileName}</b>. {errorMessage}
              </>
            ),
          },
          duration: 20_000,
          icon: {
            name: 'failed',
            color: color.negative,
          },
        });
        return;
      }

      if (newStoryId) {
        const data = api.getCurrentStoryData();
        if (data.type === 'story') api.resetStoryArgs(data);
        selectNewStory(api.selectStory, newStoryId);
      }

      api.addNotification({
        id: 'save-story-success',
        content: {
          headline: newStoryName ? 'Story created' : 'Story saved',
          subHeadline: newStoryName ? (
            <>
              Added story <b>{newStoryName}</b> based on <b>{sourceStoryName}</b>.
            </>
          ) : (
            <>
              Updated story <b>{sourceStoryName}</b>.
            </>
          ),
        },
        duration: 8_000,
        icon: {
          name: 'passed',
          color: color.positive,
        },
      });
    }
  );
});
