import React, { Children, HTMLAttributes, ReactNode } from 'react';
import { IconsProps } from '../../icon/icon';
import { TabItemProps } from '../TabsItem';
import { TabChildRenderProps } from '../types';

export type ChildrenToTabsItemProps = {
  title?: string | (() => string);
  id: string;
  color: string;
  index: number;
  content: React.ReactNode | ((props: TabChildRenderProps) => React.ReactNode);
  icon: IconsProps['icon'] | ReactNode | undefined;
  type: TabItemProps['type'];
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
        ...rest
      } = props;
      let content: TabItemProps['children'] = childrenOfChild;

      if (type === 'content') {
        content = Array.isArray(content) ? content[0] : content;
      } else if (type === 'button') {
        content = false;
      }

      const item: ChildrenToTabsItemProps = {
        title,
        index,
        id,
        color,
        content,
        icon,
        type,
        props: rest,
      };

      return item;
    }
  );

  return list;
};
