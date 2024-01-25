import type { FC } from 'react';
import React, { useMemo } from 'react';
import { Icons, IconButton, type IconsProps } from '@storybook/components';
import type * as NewIcons from '@storybook/icons';

interface ToolbarMenuButtonProps {
  active: boolean;
  title: string;
  icon?: IconsProps['icon'] | (typeof NewIcons)[keyof typeof NewIcons];
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
  const Icon = useMemo<any>(() => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return <Icons icon={icon} />;
    }

    const NewIcon = icon;

    return <NewIcon />;
  }, [icon]);

  return (
    <IconButton active={active} title={description} onClick={onClick}>
      {Icon && <Icon />}
      {title ? `\xa0${title}` : null}
    </IconButton>
  );
};
