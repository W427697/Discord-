import type { CSSProperties, FC, ReactNode } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';

const Pane = styled.div<{
  border?: 'left' | 'right' | 'top' | 'bottom';
  animate?: boolean;
  top?: boolean;
  hidden?: boolean;
  children: ReactNode;
}>(({ hidden, border, theme }) => ({
  position: 'absolute',
  boxSizing: 'border-box',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: hidden ? 0 : 1,
  borderLeft: border === 'left' ? `1px solid ${theme.appBorderColor}` : 'none',
  borderTop: border === 'top' ? `1px solid ${theme.appBorderColor}` : 'none',
}));

export const PanelContainer: FC<{
  hidden: boolean;
  position: CSSProperties;
  align: 'bottom' | 'right';
}> = ({ hidden = false, children, position = undefined, align = 'right', ...props }) => (
  <Pane style={position} hidden={hidden} {...props} border={align === 'bottom' ? 'top' : 'left'}>
    {children}
  </Pane>
);
