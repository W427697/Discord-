import React, { FC } from 'react';
import { TabButton, TabButtonProps } from './TabButton';
import { TabMenuButton, TabMenuButtonProps } from './TabMenuButton';
import { ChildrenToTabsItemProps } from './utils/children-to-tabs-items-props';

export type TabBarItemProps = {
  index: number;
  list: ChildrenToTabsItemProps[];
  previousSelectedIndex: number | undefined;
  selectedIndex: number | undefined;
} & TabButtonProps &
  ChildrenToTabsItemProps;

export const TabBarItem: FC<TabBarItemProps> = ({
  active,
  color: textColor,
  icon,
  id,
  menu,
  narrow,
  props: _props,
  title,
  type,
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
      menu,
    };
  }

  return type === 'menu' ? (
    <TabMenuButton {...tabMenuButtonProps} type={type} />
  ) : (
    <TabButton {...tabButtonProps} type={type} />
  );
};
