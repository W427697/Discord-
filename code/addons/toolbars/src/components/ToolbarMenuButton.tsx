import type { FC } from 'react';
import React from 'react';
import { Icons, IconButton, type IconsProps } from '@junk-temporary-prototypes/components';

interface ToolbarMenuButtonProps {
  active: boolean;
  title: string;
  icon?: IconsProps['icon'];
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
      {icon && <Icons icon={icon} />}
      {title ? `\xa0${title}` : null}
    </IconButton>
  );
};
