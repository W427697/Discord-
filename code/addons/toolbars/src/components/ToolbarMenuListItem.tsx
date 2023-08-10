import type { TooltipLinkListLink } from '@storybook/components';
import { Icon } from '@storybook/components/experimental';
import type { ToolbarItem } from '../types';

export type ToolbarMenuListItemProps = {
  currentValue: string;
  onClick: () => void;
} & ToolbarItem;

export const ToolbarMenuListItem = ({
  left,
  right,
  title,
  value,
  icon,
  hideIcon,
  onClick,
  currentValue,
}: ToolbarMenuListItemProps) => {
  const LocalIcon = icon && Icon[icon];

  const Item: TooltipLinkListLink = {
    id: value ?? '_reset',
    active: currentValue === value,
    right,
    title,
    left,
    onClick,
  };

  if (icon && !hideIcon) {
    Item.left = LocalIcon;
  }

  return Item;
};
