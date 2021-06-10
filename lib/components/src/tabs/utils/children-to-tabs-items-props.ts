import React, { Children, HTMLAttributes, ReactNode } from 'react';
import { IconsProps } from '../../icon/icon';
import { TabsMenuItem } from '../TabButtonMenu';
import { TabItemProps } from '../TabsItem';
import { TabChildRenderProps } from '../types';

export type ChildrenToTabsItemProps = {
  id: string;
  type: TabItemProps['type'];
  title: string | (() => string) | undefined;
  color: string | undefined;
  icon: IconsProps['icon'] | ReactNode | undefined;
  index: number;
  content: React.ReactNode | ((props: TabChildRenderProps) => React.ReactNode) | undefined;
  menu: TabsMenuItem[] | undefined;
  narrow: boolean | undefined;
  props: HTMLAttributes<HTMLButtonElement>;
};

export const childrenToTabsItemProps = (children: React.ReactNode) => {
  const list = Children.toArray(children).map(
    ({ props }: React.ReactElement<TabItemProps>, index) => {
      const {
        title,
        id,
        color,
        children: childrenOfChild,
        icon,
        type = 'content',
        menu,
        narrow,
        ...rest
      } = props;
      let content: TabItemProps['children'] = childrenOfChild;

      if (type === 'content') {
        content = Array.isArray(content) ? content[0] : content;
      } else {
        content = false;
      }

      const item: ChildrenToTabsItemProps = {
        title,
        index,
        id,
        narrow,
        color,
        content,
        icon,
        type,
        menu,
        props: rest || {},
      };

      return item;
    }
  );

  return list;
};
