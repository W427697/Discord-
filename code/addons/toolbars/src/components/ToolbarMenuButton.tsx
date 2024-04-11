import type { FC } from 'react';
import React from 'react';
import { Icons, IconButton, type IconsProps } from '@storybook/components';

interface ToolbarMenuButtonProps {
  active: boolean;
  disabled?: boolean;
  title: string;
  icon?: IconsProps['icon'];
  description: string;
  onClick?: () => void;
}

// We can't remove the Icons component just yet because there's no way for now to import icons
// in the preview directly. Before having a better solution, we are going to keep the Icons component
// for now and remove the deprecated warning.

export const ToolbarMenuButton: FC<ToolbarMenuButtonProps> = ({
  active,
  disabled,
  title,
  icon,
  description,
  onClick,
}) => {
  return (
    <IconButton
      active={active}
      title={description}
      disabled={disabled}
      onClick={disabled ? () => {} : onClick}
    >
      {icon && <Icons icon={icon} __suppressDeprecationWarning={true} />}
      {title ? `\xa0${title}` : null}
    </IconButton>
  );
};
