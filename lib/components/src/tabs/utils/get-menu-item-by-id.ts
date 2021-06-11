import { TabMenuItemProps } from '../TabMenuItem';

export const getMenuItemById = (id: string, list?: TabMenuItemProps[]) => {
  let menuItem: TabMenuItemProps;

  if (list) {
    list.some((item) => {
      let found = false;

      if (item.id === id) {
        menuItem = item;
        found = true;
      }

      return found;
    });
  }

  return menuItem;
};
