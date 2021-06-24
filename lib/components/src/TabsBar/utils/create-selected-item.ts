import type { ChildrenToTabsItemProps } from './children-to-tabs-items-props';

export const createSelectedItem = (list: ChildrenToTabsItemProps[], index: number) => {
  return {
    id: list[index] ? list[index].id : undefined,
    color: list[index] ? list[index].color : undefined,
    index: list[index] ? list[index].index : undefined,
    children: list[index] ? list[index].children : undefined,
    icon: list[index] ? list[index].icon : undefined,
    type: list[index] ? list[index].type : undefined,
    props: list[index] ? list[index].props : undefined,
    menu: list[index] ? list[index].menu : undefined,
    narrow: list[index] ? list[index].narrow : undefined,
    title: list[index] ? list[index].title : undefined,
    ...(list[index] ? list[index] : {}),
  };
};
