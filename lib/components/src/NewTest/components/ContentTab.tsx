import React, { FC, HTMLAttributes } from 'react';
import { TabProps } from '../types';
import { BaseTab } from './BaseTab';

type ContentTabProps = TabProps & HTMLAttributes<HTMLButtonElement>;

export const ContentTab: FC<ContentTabProps> = (props) => {
  return <BaseTab {...props} />;
};
