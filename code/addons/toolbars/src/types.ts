import type { IconsProps } from '@storybook/components';
import type { InputType } from '@storybook/types';

export type ToolbarShortcutType = 'next' | 'previous' | 'reset';

export type ToolbarItemType = 'item' | 'reset';

export interface ToolbarShortcutConfig {
  label: string;
  keys: string[];
}

export type ToolbarShortcuts = Record<ToolbarShortcutType, ToolbarShortcutConfig>;

export interface ToolbarItem {
  value?: string;
  icon?: IconsProps['icon'];
  left?: string;
  right?: string;
  title?: string;
  hideIcon?: boolean;
  type?: ToolbarItemType;
}

interface NormalizedToolbarConfigBase {
  /** The label to show for this toolbar item */
  title?: string;
  /** Choose an icon to show for this toolbar item */
  icon: IconsProps['icon'];
  /** Set to true to prevent default update of icon to match any present selected items icon */
  preventDynamicIcon?: boolean;
  /** Change title based on selected value */
  dynamicTitle?: boolean;
}

interface NormalizedToolbarConfigItems extends NormalizedToolbarConfigBase {
  items: ToolbarItem[];
  shortcuts?: ToolbarShortcuts;
}

interface NormalizedToolbarConfigText extends NormalizedToolbarConfigBase {
  isSecret?: boolean;
}

export type NormalizedToolbarConfig = NormalizedToolbarConfigItems | NormalizedToolbarConfigText;

export type NormalizedToolbarArgType = InputType & {
  toolbar: NormalizedToolbarConfig;
};

type ToolbarConfigItems = NormalizedToolbarConfigItems & {
  items: string[] | ToolbarItem[];
};

type ToolbarConfigText = NormalizedToolbarConfigText;

export type ToolbarConfig = ToolbarConfigItems | ToolbarConfigText;

export type ToolbarArgTypeItems = InputType & {
  toolbar: ToolbarConfigText;
};

export type ToolbarArgTypeText = InputType & {
  toolbar: ToolbarConfigItems;
};

export type ToolbarArgType = ToolbarConfigItems | ToolbarConfigText;

export type ToolbarMenuProps = NormalizedToolbarConfigItems & { id: string };
