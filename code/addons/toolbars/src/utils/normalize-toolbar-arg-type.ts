import type {
  NormalizedToolbarArgType,
  ToolbarArgType,
  ToolbarArgTypeItems,
  ToolbarArgTypeText,
  ToolbarItem,
} from '../types';

const defaultItemValues: ToolbarItem = {
  type: 'item',
  value: '',
};

export const normalizeArgType = (
  key: string,
  argType: ToolbarArgType
): NormalizedToolbarArgType => {
  const base = {
    ...argType,
    name: argType.name || key,
    description: argType.description || key,
    toolbar: {
      ...argType.toolbar,
    },
  };

  if (isToolbarArgTypeText(argType)) {
    return {
      ...base,
      toolbar: {
        ...base.toolbar,
        isSecret: argType.toolbar.isSecret ?? false,
      },
    };
  }

  if (isToolbarArgTypeItems(argType)) {
    return {
      ...base,
      toolbar: {
        ...base.toolbar,
        items: argType.toolbar.items.map((_item) => {
          const item = typeof _item === 'string' ? { value: _item, title: _item } : _item;

          // Cater for the special type "reset" which will reset value and also icon
          // of toolbar button if any icon was present on toolbar to begin with
          if (item.type === 'reset' && argType.toolbar.icon) {
            item.icon = argType.toolbar.icon;
            item.hideIcon = true;
          }

          return { ...defaultItemValues, ...item };
        }),
      },
    };
  }

  throw new Error('Invalid toolbar config');
};

const isToolbarArgTypeItems = (arg: ToolbarArgType): arg is ToolbarArgTypeItems =>
  'items' in arg.toolbar;

const isToolbarArgTypeText = (arg: ToolbarArgType): arg is ToolbarArgTypeText =>
  !('items' in arg.toolbar);
