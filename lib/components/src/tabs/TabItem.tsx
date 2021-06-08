import React from 'react';

import type { FC } from 'react';
import type { TabChildRenderProps } from './utils';

export type TabItemProps = {
  id: string;
  title: string | (() => string);
  color?: string;
  children?: React.ReactNode | ((props: TabChildRenderProps) => React.ReactNode);
} & React.HTMLAttributes<HTMLDivElement>;

export const TabItem: FC<TabItemProps> = (props) => {
  return <div {...props} />;
};
