import type { FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

export interface ScrollAreaProps {
  children?: React.ReactNode;
  horizontal?: boolean;
  vertical?: boolean;
  className?: string;
}

const ScrollAreaRoot = styled(ScrollAreaPrimitive.Root)({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  '--scrollbar-size': '6px',
});

const ScrollAreaViewport = styled(ScrollAreaPrimitive.Viewport)({
  width: '100%',
  height: '100%',
});

const ScrollAreaScrollbar = styled(ScrollAreaPrimitive.Scrollbar)({
  display: 'flex',
  userSelect: 'none', // ensures no selection
  touchAction: 'none', // disable browser handling of all panning and zooming gestures on touch devices
  background: 'transparent',
  transition: 'all 0.2s ease-out',
  marginRight: 8,
  marginTop: 8,
  borderRadius: 'var(--scrollbar-size)',

  '&[data-orientation="vertical"]': { width: 'var(--scrollbar-size)', height: 'calc(100% - 16px)' },
  '&[data-orientation="horizontal"]': { flexDirection: 'column', height: 'var(--scrollbar-size)' },
});

const ScrollAreaThumb = styled(ScrollAreaPrimitive.Thumb)(({ theme }) => ({
  flex: 1,
  background: theme.base === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
  borderRadius: 'var(--scrollbar-size)',
  position: 'relative',
  transition: 'background 0.2s ease-out',

  '&:hover': { background: theme.base === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' },

  /* increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html */
  '::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
}));

export const ScrollArea: FC<ScrollAreaProps> = ({
  children,
  horizontal = false,
  vertical = false,
}) => (
  <ScrollAreaRoot>
    <ScrollAreaViewport>{children}</ScrollAreaViewport>
    {horizontal && (
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    )}
    {vertical && (
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    )}
    {horizontal && vertical && <ScrollAreaPrimitive.Corner />}
  </ScrollAreaRoot>
);
