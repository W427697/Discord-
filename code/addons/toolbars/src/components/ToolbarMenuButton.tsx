import type { FC } from 'react';
import React from 'react';
import type { Icon } from '@storybook/components/experimental';
import { IconButton, Button } from '@storybook/components/experimental';

interface ToolbarMenuButtonProps {
  active: boolean;
  title: string;
  icon?: Icon.Icons;
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
    <>
      {icon && !title && (
        <IconButton
          icon={icon}
          active={active}
          title={description}
          onClick={onClick}
          size="small"
          variant="ghost"
        >
          {title ? `\xa0${title}` : null}
        </IconButton>
      )}
      {icon && title && (
        <Button
          active={active}
          title={description}
          onClick={onClick}
          size="small"
          variant="ghost"
        >{`\xa0${title}`}</Button>
      )}
    </>
  );
};
