import React, { FC, memo } from 'react';
import { TabButton, TabButtonProps } from './TabButton';
import { TabMenuButton, TabMenuButtonProps } from './TabMenuButton';
import { ChildrenToTabsItemProps } from './utils/children-to-tabs-items-props';

export type TabBarItemProps = {
  index: number;
  offsetX: number;
  list: ChildrenToTabsItemProps[];
  previousSelectedIndex: number | undefined;
  selectedIndex: number | undefined;
} & TabMenuButtonProps &
  ChildrenToTabsItemProps;

export const TabBarItem: FC<TabBarItemProps> = memo(
  ({
    active,
    color: textColor,
    icon,
    id,
    menu,
    narrow,
    props: _props,
    offsetX,
    title,
    type,
    onMenuItemSelect,
    onMenuOpen,
    onMenuClose,
  }) => {
    const tabButtonProps: TabButtonProps = {
      active,
      icon,
      id,
      label: title,
      narrow,
      textColor,
      ..._props,
    };

    let tabMenuButtonProps: TabMenuButtonProps = {
      ...tabButtonProps,
    };

    if (type === 'menu') {
      tabMenuButtonProps = {
        ...tabButtonProps,
        offsetX,
        onMenuItemSelect,
        onMenuOpen,
        onMenuClose,
        menu,
      };
    }

    return type === 'menu' ? (
      <TabMenuButton
        {...tabMenuButtonProps}
        style={{ ...(tabMenuButtonProps.style || {}), whiteSpace: 'nowrap' }}
        type={type}
      />
    ) : (
      <TabButton
        {...tabButtonProps}
        style={{ ...(tabButtonProps.style || {}), whiteSpace: 'nowrap' }}
        type={type}
      />
    );
  }
);
