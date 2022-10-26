import React, { Fragment, FC } from 'react';
import { Placeholder } from '@storybook/components';
import { Result } from 'axe-core';
// eslint-disable-next-line import/no-cycle
import { Item } from './Item';
// eslint-disable-next-line import/no-cycle
import { RuleType } from '../A11YPanel';

export interface ReportProps {
  items: Result[];
  empty: string;
  type: RuleType;
}

export const Report: FC<ReportProps> = ({ items, empty, type }) => (
  <Fragment>
    {items && items.length ? (
      items.map((item) => <Item item={item} key={`${type}:${item.id}`} type={type} />)
    ) : (
      <Placeholder key="placeholder">{empty}</Placeholder>
    )}
  </Fragment>
);
