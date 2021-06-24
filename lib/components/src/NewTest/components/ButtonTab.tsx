import React, { FC, HTMLAttributes } from 'react';
import { TabProps } from '../types';
import { BaseTab } from './BaseTab';

type ButtonTabProps = TabProps & HTMLAttributes<HTMLButtonElement>;

export const ButtonTab: FC<ButtonTabProps> = (props) => {
  const { label } = props;

  return <BaseTab {...props}>{label}</BaseTab>;
};
