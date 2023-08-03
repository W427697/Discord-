import type { CSSProperties, FC } from 'react';
import { styled } from '@storybook/theming';
import React from 'react';

const Pane = styled.div({
  position: 'absolute',
  boxSizing: 'border-box',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
});

export const DesktopLeft: FC<{ hidden: boolean; position: CSSProperties }> = ({
  hidden = false,
  children,
  position = undefined,
  ...props
}) =>
  hidden ? null : (
    <Pane style={position} {...props}>
      {children}
    </Pane>
  );
