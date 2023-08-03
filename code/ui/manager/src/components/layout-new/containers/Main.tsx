import type { CSSProperties, FC } from 'react';
import React from 'react';
import { Pane } from './Pane';
import { Paper } from './Paper';

export const Main: FC<{ isFullscreen: boolean; position: CSSProperties }> = ({
  isFullscreen = false,
  children,
  position = undefined,
  ...props
}) => (
  <Pane style={position} top {...props} role="main">
    <Paper isFullscreen={isFullscreen}>{children}</Paper>
  </Pane>
);
