import React, { Children, HTMLAttributes } from 'react';
import { TabItemProps, TabItemCore } from '../TabItem';

export type ChildrenToTabsItemProps = {
  props: HTMLAttributes<HTMLButtonElement>;
  index: number;
} & TabItemCore;

export const childrenToTabsItemProps = (node: React.ReactNode) => {
  const list = Children.toArray(node).map(({ props }: React.ReactElement<TabItemProps>, index) => {
    const {
      active,
      title,
      id,
      color,
      children: childrenOfChild,
      icon,
      type = 'content',
      menu,
      narrow,
      onMenuClose,
      onMenuItemSelect,
      onMenuOpen,
      ...rest
    } = props;
    let children: TabItemProps['children'] = childrenOfChild;

    if (type === 'content') {
      children = Array.isArray(children) ? children[0] : children;
    } else {
      children = false;
    }

    const item: ChildrenToTabsItemProps = {
      active,
      title,
      index,
      id,
      narrow,
      color,
      children,
      icon,
      type,
      menu,
      onMenuClose,
      onMenuItemSelect,
      onMenuOpen,
      props: rest || {},
    };

    return item;
  });

  return list;
};
