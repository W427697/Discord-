import type { CSSProperties, FC } from 'react';
import { styled } from '@storybook/theming';
import React from 'react';
import { BREAKPOINT } from './_constants';

interface SidebarContainerProps {
  hidden: boolean;
  position: CSSProperties;
}

const Pane = styled.div({
  position: 'absolute',
  boxSizing: 'border-box',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'none',

  [`@media (min-width: ${BREAKPOINT}px)`]: {
    display: 'block',
  },
});

export const SidebarContainer: FC<SidebarContainerProps> = ({
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
