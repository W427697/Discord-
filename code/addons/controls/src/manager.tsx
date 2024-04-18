import { stringify } from 'telejson';
import React from 'react';
import { dequal as deepEqual } from 'dequal';
import { AddonPanel, Badge, Spaced } from '@storybook/components';
import type {
  ResponseData,
  SaveStoryRequestPayload,
  SaveStoryResponsePayload,
} from '@storybook/core-events';
import {
  SAVE_STORY_REQUEST,
  SAVE_STORY_RESPONSE,
  experimental_requestResponse,
} from '@storybook/core-events';
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

const stringifyArgs = (args: Record<string, any>) =>
  stringify(args, {
    allowDate: true,
    allowFunction: true,
    allowUndefined: true,
    allowSymbol: true,
  });

addons.register(ADDON_ID, (api) => {
  const channel = addons.getChannel();

  const saveStory = async () => {
    const data = api.getCurrentStoryData();
    if (data.type !== 'story') throw new Error('Not a story');

    return experimental_requestResponse<SaveStoryResponsePayload>(
      channel,
      SAVE_STORY_REQUEST,
      SAVE_STORY_RESPONSE,
      {
        // Only send updated args
        args: stringifyArgs(
          Object.entries(data.args || {}).reduce<Args>((acc, [key, value]) => {
            if (!deepEqual(value, data.initialArgs?.[key])) acc[key] = value;
            return acc;
          }, {})
        ),
        csfId: data.id,
        importPath: data.importPath,
      } satisfies SaveStoryRequestPayload
    );
  };

  const createStory = async (name: string) => {
    const data = api.getCurrentStoryData();
    if (data.type !== 'story') throw new Error('Not a story');

    return experimental_requestResponse<SaveStoryResponsePayload>(
      channel,
      SAVE_STORY_REQUEST,
      SAVE_STORY_RESPONSE,
      {
        args: data.args && stringifyArgs(data.args),
        csfId: data.id,
        importPath: data.importPath,
        name,
      } satisfies SaveStoryRequestPayload
    );
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

  channel.on(
    SAVE_STORY_RESPONSE,
    ({ success, payload }: ResponseData<SaveStoryResponsePayload>) => {
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
    }
  );
});
