// @flow
import React, { Fragment } from 'react';
import Popover from '@ied/popover';
import Badge from '@ied/badge';
import { version } from '@ied/popover/package.json';
import { action } from '@storybook/addon-actions';

import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';
import Example, { EX1, EX2 } from './Example';

const component = {
  name: 'Popover',
  description: 'A component that manages the popover',
  version,
  usage: [
    {
      title: 'Auto position',
      ...EX1,
    },
    {
      title: 'Set position',
      ...EX2,
    },
  ],
  component: <Example />,
  props: [
    { name: 'component', type: 'React$Node', required: true },
    { name: 'children', type: 'React$Node', required: true },
    {
      name: 'position',
      type: '{ left?: string, right?: string, top?: string, bottom?: string }',
      required: false,
    },
  ],
};

export default Elements.add('Popover', () => <DocPage {...component} material />);
