import type { CSSProperties, FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';

export const Pane = styled.div({
  position: 'absolute',
  boxSizing: 'border-box',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 9,
});

export const Paper = styled.div<{ isFullscreen: boolean }>(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  ({ isFullscreen, theme }) =>
    isFullscreen
      ? {
          boxShadow: 'none',
          borderRadius: 0,
        }
      : {
          borderTopLeftRadius:
            theme.appBorderRadius === 0 ? theme.appBorderRadius : theme.appBorderRadius + 1,
          borderBottomLeftRadius:
            theme.appBorderRadius === 0 ? theme.appBorderRadius : theme.appBorderRadius + 1,
          overflow: 'hidden',
          boxShadow:
            theme.base === 'light'
              ? '0 1px 3px 1px rgba(0, 0, 0, 0.05), 0px 0 0px 1px rgba(0, 0, 0, 0.05)'
              : `0px 0 0px 1px ${theme.appBorderColor}`,
          transform: 'translateZ(0)',
        }
);

export const Main: FC<{ isFullscreen: boolean; position: CSSProperties }> = ({
  isFullscreen = false,
  children,
  position = undefined,
  ...props
}) => (
  <Pane style={position} {...props} role="main">
    <Paper isFullscreen={isFullscreen}>{children}</Paper>
  </Pane>
);
