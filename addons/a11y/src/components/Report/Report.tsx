import React from 'react';
import { Placeholder, Accordion } from '@storybook/components';
import { Result } from 'axe-core';
import { ReportItem } from './ReportItem';
import { RuleType } from '../A11YPanel';

export interface ReportProps {
  items: Result[];
  empty: string;
  type: RuleType;
}

export const Report = ({ items, empty, type }: ReportProps) => (
  <Accordion narrow allowMultipleOpen lined indentBody>
    {items && items.length ? (
      items.map((item) => <ReportItem item={item} key={`${type}:${item.id}`} type={type} />)
    ) : (
      <Placeholder key="placeholder">{empty}</Placeholder>
    )}
  </Accordion>
);
