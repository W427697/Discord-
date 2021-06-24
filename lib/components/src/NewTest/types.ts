import type { ReactNode } from 'react';
import type { IconsProps } from '../icon/icon';

export type TabType = 'content' | 'button' | 'menu';

export type TabIconPosition = 'left' | 'right';

export type TabMenu = {
  id: string;
  Icon?: ReactNode;
  center?: ReactNode;
  highlighted?: boolean;
  icon?: IconsProps['icon'];
  iconPosition?: TabIconPosition;
  label?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  selected?: boolean;
};

export type TabProps = {
  id: string;
  Icon?: ReactNode;
  active?: boolean;
  color?: string;
  content?: ReactNode;
  icon?: IconsProps['icon'];
  label?: ReactNode;
  menu?: TabMenu[];
  narrow?: boolean;
  selected?: boolean;
  type?: TabType;
};

export type TabPropKey = keyof TabProps;
