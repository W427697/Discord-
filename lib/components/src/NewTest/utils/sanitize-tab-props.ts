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

export const sanitizeTabProps = <T extends HTMLElement = HTMLButtonElement>(
  original: TabProps & HTMLAttributes<T>
) => {
  const tabProps: Record<string, any> = {};
  const htmlProps: Record<string, any> = {};

  Object.keys(original).forEach((_key) => {
    const key = _key as keyof TabProps;
    if (tabPropKeys.includes(key)) {
      tabProps[key] = original[key];
    } else {
      htmlProps[key] = original[key];
    }
  });

  if (!original.type) {
    tabProps.type = 'content';
  }

  if (original.children && !original.content) {
    tabProps.content = tabProps.children;
  }

  return {
    tabProps: tabProps as TabProps,
    htmlProps: htmlProps as HTMLAttributes<T>,
  };
};
