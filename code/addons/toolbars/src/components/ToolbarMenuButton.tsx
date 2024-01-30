import type { FC, ReactNode } from 'react';
import React from 'react';
import { icons } from '@storybook/components';
import { IconButton, Icons } from '@storybook/components';
import { deprecate } from '@storybook/client-logger';
import type { IconType } from '../types';

interface ToolbarMenuButtonProps {
  active: boolean;
  title: string;
  icon?: IconType | ReactNode;
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
  // Check if icon is one of IconType
  function isIconType(ico: any): ico is IconType {
    const iconTypes: IconType[] = Object.keys(icons) as IconType[];
    return iconTypes.includes(ico);
  }

  if (isIconType(icon)) {
    const newComponent = icons[icon as IconType];
    deprecate(
      `Use of deprecated icon ${
        `(${icon})` || ''
      } in the Toolbars addon. Instead of using a string form the icon prop, please use the @storybook/icons component directly${
        newComponent ? ` like so: <${newComponent} />` : ''
      }.`
    );
  }

  return (
    <IconButton active={active} title={description} onClick={onClick}>
      {isIconType(icon) ? <Icons icon={icon} /> : icon}
      {title ? `\xa0${title}` : null}
    </IconButton>
  );
};
