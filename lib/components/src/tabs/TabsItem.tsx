import React, { FC, ReactNode } from 'react';
import { IconsProps } from '../icon/icon';
import { TabsMenuItem } from './TabButtonMenu';
import { TabChildRenderProps } from './types';

export type TabItemProps = {
  id: string;
  title?: string | (() => string);
  color?: string;
  icon?: IconsProps['icon'] | ReactNode;
  children?: React.ReactNode | ((props: TabChildRenderProps) => React.ReactNode);
  type?: 'content' | 'button' | 'menu';
  narrow?: boolean;
  active?: boolean;
  menu?: TabsMenuItem[];
} & Omit<React.HTMLAttributes<HTMLButtonElement>, 'type' | 'title'>;

export const TabsItem: FC<TabItemProps> = (props) => {
  return <button {...props} type="button" title="" />;
};
