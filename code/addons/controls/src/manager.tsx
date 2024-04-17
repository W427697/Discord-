import React from 'react';
import { AddonPanel, Badge, Spaced } from '@storybook/components';
import { SAVE_STORY_REQUEST, SAVE_STORY_RESPONSE } from '@storybook/core-events';
import type { API } from '@storybook/manager-api';
import { addons, types, useArgTypes } from '@storybook/manager-api';
import { color } from '@storybook/theming';
import { ControlsPanel } from './ControlsPanel';
import { ADDON_ID, PARAM_KEY } from './constants';
import type { Args } from '@storybook/csf';

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

interface ResponseData {
  id: string;
  success: boolean;
  error?: string;
  payload?: any;
}

const requestResponse = (
  api: API,
  requestEvent: string,
  responseEvent: string,
  payload: any,
  timeout = 5000
) => {
  let timeoutId: NodeJS.Timeout;
  return new Promise((resolve, reject) => {
    const requestId = Math.random().toString(16).slice(2);
    const responseHandler = (response: ResponseData) => {
      if (response.id !== requestId) return;
      clearTimeout(timeoutId);
      api.off(responseEvent, responseHandler);
      if (response.success) resolve(response.payload);
      else reject(new Error(response.error));
    };

    api.emit(requestEvent, { id: requestId, payload });
    api.on(responseEvent, responseHandler);

    timeoutId = setTimeout(() => {
      api.off(responseEvent, responseHandler);
      reject(new Error('Timed out waiting for response'));
    }, timeout);
  });
};

addons.register(ADDON_ID, (api) => {
  const saveStory = async () => {
    const data = api.getCurrentStoryData();
    if (data.type !== 'story') throw new Error('Not a story');
    return requestResponse(api, SAVE_STORY_REQUEST, SAVE_STORY_RESPONSE, {
      // Only send updated args
      args: Object.entries(data.args || {}).reduce<Args>((acc, [key, value]) => {
        if (value !== data.initialArgs?.[key]) acc[key] = value;
        return acc;
      }, {}),
      csfId: data.id,
      importPath: data.importPath,
    });
  };

  const createStory = async (name: string) => {
    const data = api.getCurrentStoryData();
    if (data.type !== 'story') throw new Error('Not a story');
    return requestResponse(api, SAVE_STORY_REQUEST, SAVE_STORY_RESPONSE, {
      args: data.args,
      csfId: data.id,
      importPath: data.importPath,
      name,
    });
  };

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
          <ControlsPanel saveStory={saveStory} createStory={createStory} />
        </AddonPanel>
      );
    },
  });

  api.on(SAVE_STORY_RESPONSE, ({ success, payload }) => {
    if (!success) return;

    const { newStoryId, newStoryName, sourceStoryName } = payload;

    const data = api.getCurrentStoryData();
    if (data.type === 'story') api.resetStoryArgs(data);
    if (newStoryId) api.selectStory(newStoryId);

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
      onClick: ({ onDismiss }) => {
        onDismiss();
        if (newStoryId) api.selectStory(newStoryId);
      },
      icon: {
        name: 'passed',
        color: color.positive,
      },
    });
  });
});
