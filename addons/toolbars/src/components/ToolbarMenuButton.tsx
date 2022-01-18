import React, { ComponentProps, FC } from 'react';
import { Icons, IconButton } from '@storybook/components';

interface ToolbarMenuButtonProps {
  active: boolean;
  title: string;
  icon: ComponentProps<typeof Icons>['icon'] | '';
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
