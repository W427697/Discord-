import { Children } from 'react';
import { TabChildRenderProps, TabListChildProps } from './types';

export type ChildToListItem = {
  active: boolean;
  title: string | (() => string);
  id: string;
  color: string;
  content: React.ReactNode;
};

export const getChildIndexById = (id: string, list: ChildToListItem[]) => {
  let index: number | undefined;

  list.some((item, _index) => {
    const found = id === item.id;
    if (found) {
      index = _index;
    }

    return found;
  });

  return index;
};

export const childrenToList = (children: React.ReactNode, selected: string) => {
  const list: ChildToListItem[] = Children.toArray(children).map(
    (
      {
        props: { title, id, color, children: childrenOfChild },
      }: React.ReactElement<TabListChildProps>,
      index
    ) => {
      const active = selected ? id === selected : index === 0;
      const child = Array.isArray(childrenOfChild) ? childrenOfChild[0] : childrenOfChild;
      const childProps: TabChildRenderProps = {
        id: `${id}-content`,
        key: `${id}-content`,
        active,
        selected,
        index,
      };

      const content = typeof child === 'function' ? child(childProps) : child;

      return { active, title, id, color, content };
    }
  );

  return list;
};
