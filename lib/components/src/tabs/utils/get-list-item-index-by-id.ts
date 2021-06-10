import { ChildrenToTabsItemProps } from './children-to-tabs-items-props';

export const getListItemIndexById = (id: string, list?: ChildrenToTabsItemProps[]) => {
  let foundIndex: number;

  if (list) {
    list.some((item, index) => {
      let found = false;

      if (item.id === id) {
        foundIndex = index;
        found = true;
      }

      return found;
    });
  }

  return foundIndex;
};
