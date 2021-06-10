import React, { FC, forwardRef, HTMLAttributes, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { styled } from '@storybook/theming';
import { IconsProps } from '../icon/icon';

export type TabsMenuItem = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  label?: ReactNode;
  icon?: IconsProps['icon'];
};

export type TabsButtonMenu = {
  open?: boolean;
  menu?: TabsMenuItem[];
  left?: number;
  top?: number;
} & HTMLAttributes<HTMLDivElement>;

export const TabsButtonMenu = forwardRef(
  ({ open, left, top, menu, ...rest }: TabsButtonMenu, ref: RefObject<HTMLDivElement>) => {
    return open
      ? createPortal(
          <Wrapper ref={ref} open={open} left={left} top={top} {...rest}>
            {menu.length > 0 &&
              menu.map((item) => {
                return <div>{item.label}</div>;
              })}
          </Wrapper>,
          // eslint-disable-next-line no-undef
          document.getElementsByTagName('body')[0]
        )
      : null;
  }
);

type WrapperProps = {
  open: boolean;
  left: number;
  top: number;
};

const Wrapper = styled.div<WrapperProps>(({ theme, open, left, top }) => ({
  position: 'absolute',
  left,
  top,
  opacity: open ? 1 : 0,
  visibility: open ? 'visible' : 'hidden',
  backgroundColor: theme.background.content,
  boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  borderRadius: theme.appBorderRadius,
  zIndex: 9999,
  overflow: 'hidden',
  // borderTop: `3px solid ${theme.color.secondary}`,
  minWidth: 180,
}));
