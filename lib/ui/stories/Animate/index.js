// @flow
import React, { Fragment } from 'react';
import Animate from '@ied/animate';
import { version } from '@ied/animate/package.json';
import { action } from '@storybook/addon-actions';
import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

const component = {
  name: 'Animate',
  description: 'A component that animate your component',
  version,
  requirement: `
<!-- If you use icon property, add this to your 'index.html' -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  `,
  usage: {
    code: `import Animate from '@ied/animate'

<Animate active><span style={{ fontSize: 30 }}>🦄</span></Animate>`,
  },
  component: (
    <Fragment>
      <Animate active>
        <span style={{ fontSize: 30 }}>🦄</span>
      </Animate>
    </Fragment>
  ),
  props: [
    { name: 'children', type: 'React.Node', required: true },
    { name: 'active', type: 'boolean', required: false },
  ],
};

export default Elements.add('Animate', () => <DocPage {...component} />);
