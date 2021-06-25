import { HTMLAttributes } from 'react';
import type { TabProps, TabPropKey } from '../types';

const tabPropKeys: TabPropKey[] = [
  'Icon',
  'color',
  'content',
  'icon',
  'id',
  'label',
  'menu',
  'narrow',
  'selected',
  'type',
  'active',
];

export const getTabProps = <T extends HTMLElement = HTMLButtonElement>(
  original: TabProps & HTMLAttributes<T>
) => {
  const tabProps: Record<string, any> = {};

  Object.keys(original).forEach((_key) => {
    const key = _key as keyof TabProps;
    if (tabPropKeys.includes(key)) {
      tabProps[key] = original[key];
    }
  });

  if (original.children && !original.content) {
    tabProps.content = tabProps.children;
  }

  return tabProps as TabProps;
};
