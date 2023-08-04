import type { CSSProperties, FC, ReactNode } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';

const Pane = styled.div<{
  hidden?: boolean;
  children: ReactNode;
}>(({ hidden }) => ({
  position: 'absolute',
  boxSizing: 'border-box',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 9,
  opacity: hidden ? 0 : 1,
}));

export const PreviewContainer: FC<{ hidden: boolean; position: CSSProperties }> = ({
  hidden = false,
  children,
  position = undefined,
  ...props
}) => (
  <Pane style={position} hidden={hidden} {...props}>
    {children}
  </Pane>
);
