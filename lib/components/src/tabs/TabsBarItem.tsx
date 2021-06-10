import React, { FC } from 'react';
import { TabButton, TabButtonProps } from './TabButton';
import { TabChildRenderProps } from './types';
import { ChildrenToTabsItemProps } from './utils/children-to-tabs-items-props';
import { createSelectedItem } from './utils/create-selected-item';

export type TabsBarItemProps = {
  index: number;
  selectedIndex: number | undefined;
  previousSelectedIndex: number | undefined;
  list: ChildrenToTabsItemProps[];
} & TabButtonProps &
  ChildrenToTabsItemProps;

export const TabsBarItem: FC<TabsBarItemProps> = ({
  title,
  id,
  active,
  color: textColor,
  icon,
  props: _props,
  type,
  content: _content,
  index,
  selectedIndex,
  previousSelectedIndex,
  list,
}) => {
  let props: TabButtonProps = {
    id,
    active,
    textColor,
    icon,
    label: title,
    ..._props,
  };

  let content = _content;

  if (type === 'menu' && typeof _content === 'function') {
    const contentProxy = _content as (renderProps: TabChildRenderProps) => React.ReactNode;

    content = contentProxy({
      id: `${id}-content`,
      key: `${id}-content`,
      active,
      index,
      selected: createSelectedItem(list, selectedIndex),
      previous: createSelectedItem(list, previousSelectedIndex),
    });
  }

  if (type === 'menu') {
    props = {
      ...props,
      children: content,
    };
  }

  return <TabButton {...props} type={type} />;
};
