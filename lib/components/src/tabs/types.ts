import type { MouseEvent, KeyboardEvent } from 'react';
import type { ChildrenToTabsItemProps } from './utils/children-to-tabs-items-props';

export type TabChildRenderProps = {
  key: string;
  active: boolean;
  id: string;
  index: number;
  selected: ChildrenToTabsItemProps;
  previous: ChildrenToTabsItemProps;
};

export type OnClickEvent = MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>;
