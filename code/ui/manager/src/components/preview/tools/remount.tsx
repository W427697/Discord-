import React from 'react';
import { IconButton } from '@storybook/components/experimental';
import { Consumer, types } from '@storybook/manager-api';
import type { Combo } from '@storybook/manager-api';
import { FORCE_REMOUNT } from '@storybook/core-events';
import type { Addon_BaseType } from '@storybook/types';

const menuMapper = ({ api, state }: Combo) => {
  const { storyId } = state;
  return {
    storyId,
    remount: () => api.emit(FORCE_REMOUNT, { storyId: state.storyId }),
    api,
  };
};

export const remountTool: Addon_BaseType = {
  title: 'remount',
  id: 'remount',
  type: types.TOOL,
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Consumer filter={menuMapper}>
      {({ remount, storyId }) => {
        const remountComponent = () => {
          if (!storyId) return;
          remount();
        };

        return (
          <IconButton
            key="remount"
            title="Remount component"
            icon="Sync"
            size="small"
            variant="ghost"
            onClickAnimation="rotate360"
            onClick={remountComponent}
            disabled={!storyId}
          />
        );
      }}
    </Consumer>
  ),
};
