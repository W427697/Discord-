import React, { FC, HTMLAttributes } from 'react';
import { TabProps } from '../types';
import { BaseTab } from './BaseTab';

type MenuTabProps = TabProps & HTMLAttributes<HTMLButtonElement>;

export const MenuTab: FC<MenuTabProps> = (props) => {
  const { label } = props;

  return <BaseTab {...props}>{label}</BaseTab>;
};
