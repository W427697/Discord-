// @flow
import React from 'react';
import { getRelativeDate, getDate } from '@ied/date';
import { version } from '@ied/date/package.json';
import { Helpers } from '../Categories';
import DocPage from '../../commons/DocPage';

const date = {
  name: 'Date',
  description: 'A helper that return a relative date',
  version,
  usage: [
    {
      title: 'GetRelativeDate',
      code: `import { getRelativeDate } from '@ied/date'

getRelativeDate(new Date('02/12/2018'), 'en')`,
      example: (
        <ul>
          <li>{getRelativeDate(new Date().setSeconds(-1), 'en')}</li>
          <li>{getRelativeDate(new Date().setMinutes(-1), 'en')}</li>
          <li>{getRelativeDate(new Date().setHours(-1), 'en')}</li>
          <li>{getRelativeDate(new Date().setHours(-24), 'en')}</li>
        </ul>
      ),
    },
    {
      title: 'GetDate',
      code: `import { getDate } from '@ied/date'

getDate(new Date('02/12/2018'), 'en')`,
      example: (
        <ul>
          <li>{getDate(new Date('02/12/2018'), 'en')}</li>
        </ul>
      ),
    },
  ],

  props: [
    { name: 'date', type: 'string | Date', required: true },
    { name: 'locale', type: 'string', required: true },
  ],
};

export default Helpers.add('Date', () => <DocPage {...date} material />);
