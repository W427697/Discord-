// @flow
import React, { Fragment } from 'react';
import Icon from '@ied/icon';
import { version } from '@ied/icon/package.json';
import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

const icon = {
  name: 'Icon',
  description: 'A component that represents a Icon',
  version,
  usage: `
import Icon from '@ied/icon'

<Icon>fingerprint</Icon>
  `,
  requirement: `
<!-- Add this to your 'index.html' -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  `,
  component: (
    <Fragment>
      <Icon style={{ fontSize: 32 }}>fingerprint</Icon>
    </Fragment>
  ),
  props: [{ name: 'children', type: 'string', required: true }],
};

export default Elements.add('Icon', () => <DocPage {...icon} />);
