import { styled } from '@storybook/theming';
import { UseSelectGetItemPropsOptions } from 'downshift';
import React, { forwardRef, HTMLAttributes, memo, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { TabMenuItem, TabMenuItemProps } from './TabMenuItem';

export const defaultWidth = 220;

export type TabMenuProps = {
  highlightedIndex?: number;
  menu?: TabMenuItemProps[];
  menuRef?: React.RefObject<HTMLUListElement>;
  open?: boolean;
  selected: string;
  width?: number;
  x?: number;
  y?: number;
  getItemProps?: (options: UseSelectGetItemPropsOptions<TabMenuItemProps>) => any;
} & HTMLAttributes<HTMLUListElement>;

export const TabsMenu = memo(
  forwardRef(
    (
      {
        open,
        x,
        y,
        menu,
        getItemProps,
        menuRef,
        selected,
        highlightedIndex,
        width = defaultWidth,
        ...rest
      }: TabMenuProps,
      ref: RefObject<HTMLUListElement>
    ) => {
      return createPortal(
        <>
          <Wrapper
            isOpen={open}
            ref={menuRef || ref}
            {...rest}
            style={{ ...(rest.style || {}), left: x || 0, top: y || 0, width }}
          >
            {menu.length > 0 &&
              menu.map((item, index) => {
                const key = `${item.label || ''}-${index}`;

                return (
                  <TabMenuItem
                    highlighted={highlightedIndex === index}
                    key={key}
                    selected={selected === item.id}
                    {...item}
                    {...getItemProps({ refKey: 'menuItemRef', item, index })}
                  />
                );
              })}
          </Wrapper>
          <Triangle isOpen={open} left={x + width / 2 - 5} top={y} />
        </>,
        // eslint-disable-next-line no-undef
        document.getElementsByTagName('body')[0]
      );
    }
  )
);

type WrapperProps = {
  isOpen: boolean;
};

const Wrapper = styled.ul<WrapperProps>(({ theme, isOpen }) => ({
  // borderTop: `3px solid ${theme.color.secondary}`,
  backgroundColor: theme.background.content,
  borderRadius: theme.appBorderRadius,
  filter: 'drop-shadow(0px 5px 5px rgba(0,0,0,0.05)) drop-shadow(0 1px 3px rgba(0,0,0,0.1))',
  listStyle: 'none',
  margin: 0,
  maxHeight: '70vh',
  opacity: isOpen ? 1 : 0,
  outline: '0 none',
  overflowY: 'scroll',
  padding: 0,
  position: 'absolute',
  transform: `translateY(${isOpen ? '0px' : '6px'})`,
  transformOrigin: 'center',
  transition: `transform ${isOpen ? '250ms' : '175ms'} ease-in-out, opacity 250ms ease-in-out`,
  zIndex: 9999,
}));

interface TriangleProps {
  left: number;
  top: number;
  isOpen: boolean;
}

const Triangle = styled.div<TriangleProps>(({ isOpen, theme, left, top }) => ({
  position: 'absolute',
  left,
  top,
  zIndex: 9998,
  borderLeft: '5px solid transparent',
  borderRight: '5px solid transparent',
  borderBottom: `5px solid ${theme.color.secondary}`,
  opacity: isOpen ? 1 : 0,
  transform: `translateY(${isOpen ? '-11px' : '0px'})`,
  transition: `transform 500ms ease-in-out, opacity 250ms ease-in-out`,
}));
