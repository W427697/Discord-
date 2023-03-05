import type { ComponentProps } from 'react';
import React from 'react';
import { IconButton, Icons } from '@storybook/components';
import { Consumer } from '@storybook/manager-api';
import type { Addon, Combo } from '@storybook/manager-api';
import { styled } from '@storybook/theming';

interface AnimatedButtonProps {
  animating?: boolean;
}

const StyledAnimatedIconButton = styled(IconButton)<
  AnimatedButtonProps & ComponentProps<typeof IconButton>
>(({ theme, animating, disabled }) => ({
  opacity: disabled ? 0.5 : 1,
  svg: {
    animation: animating && `${theme.animation.rotate360} 1000ms ease-out`,
  },
}));

const menuMapper = ({ api, state }: Combo) => {
  const { storyId, remount } = state;
  const { isAnimating } = remount;
  return {
    storyId,
    remount: () => api.remount(),
    remountEnd: () => api.remountEnd(),
    isAnimating,
  };
};

export const remountTool: Addon = {
  title: 'remount',
  id: 'remount',
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Consumer filter={menuMapper}>
      {({ remount, storyId, remountEnd, isAnimating }) => {
        return (
          <StyledAnimatedIconButton
            key="remount"
            title="Remount component"
            onClick={remount}
            onAnimationEnd={remountEnd}
            animating={isAnimating}
            disabled={!storyId}
          >
            <Icons icon="sync" />
          </StyledAnimatedIconButton>
        );
      }}
    </Consumer>
  ),
};
