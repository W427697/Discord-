// @flow
import React from 'react';
import Thumb from '@ied/thumb';
import { version } from '@ied/thumb/package.json';
import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

const thumb = {
  name: 'Thumb',
  description: 'A component that represents a thumb',
  version,
  usage: `
import Thumb from '@ied/thumb'

<Thumb title="Clients" value="20" label="Due tasks" color="green" />`,
  component: <Thumb title="Clients" value="20" label="Due tasks" color="green" />,
  props: [
    { name: 'title', type: 'string', required: true },
    { name: 'value', type: 'string', required: true },
    { name: 'label', type: 'string', required: true },
    { name: 'color', type: 'string', required: false },
  ],
};

export default Elements.add('Thumb', () => <DocPage {...thumb} />);
