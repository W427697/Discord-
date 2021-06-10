import React, { FC } from 'react';
import { TabButton, TabButtonProps } from './TabButton';
import { TabChildRenderProps } from './types';
import { ChildrenToTabsItemProps } from './utils/children-to-tabs-items-props';

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
      selected: {
        id: list[selectedIndex] ? list[selectedIndex].id : undefined,
        color: list[selectedIndex] ? list[selectedIndex].color : undefined,
        index: list[selectedIndex] ? list[selectedIndex].index : undefined,
        content: list[selectedIndex] ? list[selectedIndex].content : undefined,
        icon: list[selectedIndex] ? list[selectedIndex].icon : undefined,
        type: list[selectedIndex] ? list[selectedIndex].type : undefined,
        props: list[selectedIndex] ? list[selectedIndex].props : undefined,
        ...(list[selectedIndex] ? list[selectedIndex] : {}),
      },
      previous: {
        id: list[previousSelectedIndex] ? list[previousSelectedIndex].id : undefined,
        color: list[previousSelectedIndex] ? list[previousSelectedIndex].color : undefined,
        index: list[previousSelectedIndex] ? list[previousSelectedIndex].index : undefined,
        content: list[previousSelectedIndex] ? list[previousSelectedIndex].content : undefined,
        icon: list[previousSelectedIndex] ? list[previousSelectedIndex].icon : undefined,
        type: list[previousSelectedIndex] ? list[previousSelectedIndex].type : undefined,
        props: list[previousSelectedIndex] ? list[previousSelectedIndex].props : undefined,
        ...(list[previousSelectedIndex] ? list[previousSelectedIndex] : {}),
      },
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
