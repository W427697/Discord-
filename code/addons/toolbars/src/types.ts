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
}

interface NormalizedToolbarConfigItems extends NormalizedToolbarConfigBase {
  items: ToolbarItem[];
  /** Bind keyboard shortcuts to navigate items */
  shortcuts?: ToolbarShortcuts;
  /** Set to true to prevent default update of icon to match any present selected items icon */
  preventDynamicIcon?: boolean;
  /** Change title based on selected value */
  dynamicTitle?: boolean;
}

interface NormalizedToolbarConfigText extends NormalizedToolbarConfigBase {
  /** Default value */
  defaultValue: string;
  /** Mask the value of the input like a password */
  isSecret: boolean;
}

export type NormalizedToolbarConfig = NormalizedToolbarConfigItems | NormalizedToolbarConfigText;

export type NormalizedToolbarArgTypeItems = InputType & {
  toolbar: NormalizedToolbarConfigItems;
};

export type NormalizedToolbarArgTypeText = InputType & {
  toolbar: NormalizedToolbarConfigText;
};

export type NormalizedToolbarArgType = NormalizedToolbarArgTypeItems | NormalizedToolbarArgTypeText;

type ToolbarConfigItems = NormalizedToolbarConfigItems & {
  items: string[] | ToolbarItem[];
};

type ToolbarConfigText = NormalizedToolbarConfigText & {
  isSecret?: boolean;
  defaultValue?: null | undefined | string;
};

export type ToolbarConfig = ToolbarConfigItems | ToolbarConfigText;

export type ToolbarArgTypeItems = InputType & {
  toolbar: ToolbarConfigText;
};

export type ToolbarArgTypeText = InputType & {
  toolbar: ToolbarConfigItems;
};

export type ToolbarArgType = ToolbarConfigItems | ToolbarConfigText;

export type ToolbarMenuProps = NormalizedToolbarConfigItems & { id: string };
