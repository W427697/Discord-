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

export interface OnChangeProps {
  event: OnClickEvent;
  previous: ChildrenToTabsItemProps;
  selected: ChildrenToTabsItemProps;
}

export interface OnSelectProps {
  selected: ChildrenToTabsItemProps;
  event: OnClickEvent;
}

export type OnClickEvent = MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>;
