// @flow
import React from 'react';
import Pagination from '@ied/pagination';
import { version } from '@ied/pagination/package.json';
import { action } from '@storybook/addon-actions';

import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

const component = {
  name: 'Pagination',
  description: 'A component that manages the pagination',
  version,
  usage: `
import Pagination from '@ied/pagination'

<Pagination max={10} rowsPerPage={10} onChange={() => {}} defaultPage={1} />
  `,
  component: (
    <Pagination
      max={150}
      rowsPerPage={10}
      onChange={(page, rowsPerPage) => {
        console.log(page, rowsPerPage);

        action('Pagination change')('change', `page: ${page}`, `rowsPerPage: ${rowsPerPage}`);
      }}
      defaultPage={1}
    />
  ),
  props: [
    { name: 'max', type: 'number', required: true },
    { name: 'rowsPerPage', type: 'number', required: true },
    {
      name: 'onChange',
      type: '(pageState: number, rowsPerPage: number) => void',
      required: true,
    },
    { name: 'defaultPage', type: 'number', required: true },
    { name: 'range', type: 'Array<number>', required: false },
    { name: 'locale', type: 'string', required: false },
  ],
};

export default Elements.add('Pagination', () => <DocPage {...component} />);
