import React, { FunctionComponent } from 'react';
import { Placeholder, AccordionList } from '@storybook/components';
import { Result } from 'axe-core';
import { Item } from './Item';
import { RuleType } from '../A11YPanel';

export interface ReportProps {
  items: Result[];
  empty: string;
  type: RuleType;
}

export const Report: FunctionComponent<ReportProps> = ({ items, empty, type }) => (
  <AccordionList>
    {items && items.length ? (
      items.map((item) => <Item item={item} key={`${type}:${item.id}`} type={type} />)
    ) : (
      <Placeholder key="placeholder">{empty}</Placeholder>
    )}
  </AccordionList>
);
