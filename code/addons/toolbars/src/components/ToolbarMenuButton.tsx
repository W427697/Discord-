import type { FC, ReactNode } from 'react';
import React from 'react';
import { IconButton } from '@storybook/components';

interface ToolbarMenuButtonProps {
  active: boolean;
  title: string;
  icon?: ReactNode;
  description: string;
  onClick?: () => void;
}

export const ToolbarMenuButton: FC<ToolbarMenuButtonProps> = ({
  active,
  title,
  icon,
  description,
  onClick,
}) => {
  return (
    <IconButton active={active} title={description} onClick={onClick}>
      {icon}
      {title ? `\xa0${title}` : null}
    </IconButton>
  );
};
