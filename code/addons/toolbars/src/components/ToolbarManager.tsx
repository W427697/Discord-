import type { FC } from 'react';
import React from 'react';
import { useGlobalTypes } from '@storybook/manager-api';
import { Separator } from '@storybook/components';
import { ToolbarMenuList } from './ToolbarMenuList';
import { normalizeArgType } from '../utils/normalize-toolbar-arg-type';
import type {
  NormalizedToolbarArgType,
  NormalizedToolbarArgTypeItems,
  NormalizedToolbarArgTypeText,
  ToolbarArgType,
} from '../types';
import { ToolbarTextInput } from './ToolbarTextInput';

/**
 * A smart component for handling manager-preview interactions.
 */
export const ToolbarManager: FC = () => {
  const globalTypes = useGlobalTypes();
  const globalIds = Object.keys(globalTypes).filter((id) => !!globalTypes[id].toolbar);

  if (!globalIds.length) {
    return null;
  }

  return (
    <>
      <Separator />
      {globalIds.map((id) => {
        const normalizedArgType = normalizeArgType(id, globalTypes[id] as ToolbarArgType);

        if (isNormalizedToolbarArgTypeItems(normalizedArgType)) {
          return <ToolbarTextInput key={id} id={id} {...normalizeArgType} />;
        }

        if (isNormalizedToolbarArgTypeText(normalizedArgType)) {
          return <ToolbarMenuList key={id} id={id} {...normalizedArgType} />;
        }

        return null;
      })}
    </>
  );
};

const isNormalizedToolbarArgTypeItems = (
  arg: NormalizedToolbarArgType
): arg is NormalizedToolbarArgTypeItems => arg.items != null;

const isNormalizedToolbarArgTypeText = (
  arg: NormalizedToolbarArgType
): arg is NormalizedToolbarArgTypeText => arg.items == null;
