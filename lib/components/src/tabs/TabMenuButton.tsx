import { useSelect, UseSelectStateChange } from 'downshift';
import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import { TabButtonProps as BarButtonProps } from '../bar/button';
import { TabButton, TabButtonProps, TabButtonRect } from './TabButton';
import { defaultWidth as defaultTabsMenuWidth, TabsMenu } from './TabMenu';
import { TabMenuItemProps } from './TabMenuItem';
import { getMenuItemById } from './utils/get-menu-item-by-id';

export type TabMenuButtonProps = {
  menu?: TabMenuItemProps[];
  menuWidth?: number;
  open?: boolean;
  offsetX?: number;
  selected?: string;
  onMenuClose?: () => void;
  onMenuItemSelect?: (item: TabMenuItemProps) => void;
  onMenuOpen?: () => void;
} & TabButtonProps &
  BarButtonProps;

export const TabMenuButton: FC<TabMenuButtonProps> = memo(
  ({
    menu,
    menuWidth = defaultTabsMenuWidth,
    open,
    offsetX = 0,
    selected,
    onMenuClose,
    onMenuItemSelect,
    onMenuOpen,
    ...props
  }) => {
    const rectRef = useRef<TabButtonRect>({ width: 0, x: 0, y: 0, height: 0 });

    const handleMenuItemSelect = useCallback(
      ({ selectedItem }: UseSelectStateChange<TabMenuItemProps>) => {
        if (onMenuItemSelect) {
          onMenuItemSelect(selectedItem);
        }
      },
      [onMenuItemSelect]
    );

    const handleMenuOpenChange = useCallback(
      (changes: UseSelectStateChange<TabMenuItemProps>) => {
        if (changes.isOpen && onMenuOpen) {
          onMenuOpen();
        } else if (!changes.isOpen && onMenuClose) {
          onMenuClose();
        }
      },
      [onMenuClose, onMenuOpen]
    );

    const {
      highlightedIndex,
      isOpen,
      selectedItem,
      getItemProps,
      getLabelProps,
      getMenuProps,
      getToggleButtonProps,
    } = useSelect({
      items: menu,
      initialIsOpen: open,
      initialSelectedItem: getMenuItemById(selected, menu),
      onSelectedItemChange: handleMenuItemSelect,
      onIsOpenChange: handleMenuOpenChange,
    });

    return (
      <>
        <TabButton
          {...props}
          active={isOpen}
          LabelProps={getLabelProps()}
          onRectChange={(rect: TabButtonRect) => {
            rectRef.current = rect;
          }}
          {...getToggleButtonProps({ refKey: 'buttonRef' })}
        />
        <TabsMenu
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          x={rectRef.current.x - (menuWidth - rectRef.current.width) / 2 - offsetX}
          y={rectRef.current.y + 44}
          menu={menu}
          open={isOpen}
          width={menuWidth}
          selected={selectedItem && selectedItem.id ? selectedItem.id : undefined}
          {...getMenuProps({ refKey: 'menuRef' })}
        />
      </>
    );
  }
);
