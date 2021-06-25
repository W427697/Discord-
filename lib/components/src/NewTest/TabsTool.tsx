import { styled } from '@storybook/theming';
import React, { FC, HTMLAttributes, ReactNode } from 'react';
import { IconsProps } from '../icon/icon';
import { TabsButton, TabsButtonProps } from './TabsButton';

export const TabsTool: FC<TabsButtonProps> = ({ ...rest }) => {
  return <Wrapper data-sb-tabs-tool="true" {...rest} />;
};

const Wrapper = styled(TabsButton)({
  padding: '0',
  '&:focus, &:active': {
    borderBottomColor: 'transparent',
  },
});
