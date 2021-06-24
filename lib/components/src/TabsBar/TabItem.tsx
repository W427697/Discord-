import React, { FC, ReactNode } from 'react';
import { IconsProps } from '../icon/icon';
import { TabMenuItemProps } from './TabMenuItem';
import { TabChildRenderProps } from './types';

export type TabItemCore = {
  id: string;
  active?: boolean;
  children?: React.ReactNode | ((props: TabChildRenderProps) => React.ReactNode);
  color?: string;
  icon?: IconsProps['icon'] | ReactNode;
  menu?: TabMenuItemProps[];
  narrow?: boolean;
  title?: string | (() => string);
  type?: 'content' | 'button' | 'menu';
  onMenuClose?: () => void;
  onMenuItemSelect?: (item: TabMenuItemProps) => void;
  onMenuOpen?: () => void;
};

export type TabItemProps = TabItemCore &
  Omit<React.HTMLAttributes<HTMLButtonElement>, 'type' | 'title'>;

export const TabItem: FC<TabItemProps> = (props) => {
  return <button {...props} type="button" title="" />;
};
