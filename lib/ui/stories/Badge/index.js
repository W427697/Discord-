// @flow
import React, { Fragment } from 'react';
import Badge from '@ied/badge';
import { version } from '@ied/badge/package.json';
import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

const badge = {
  name: 'Badge',
  description: 'A component that represents an user',
  version,
  requirement: `
<!-- If you use icon property, add this to your 'index.html' -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  `,
  usage: `import Badge from '@ied/badge'

<Badge firstName="Clark" lastName="Kent" />
<Badge firstName="Iron" lastName="Man" small />
<Badge icon="credit_card" />
<Badge small />
`,
  component: (
    <Fragment>
      <div style={{ margin: '0 5px' }}>
        <Badge firstName="Clark" lastName="Kent" />
      </div>
      <div style={{ margin: '0 5px' }}>
        <Badge firstName="Iron" lastName="Man" small />
      </div>
      <div style={{ margin: '0 5px' }}>
        <Badge icon="credit_card" />
      </div>
      <div style={{ margin: '0 5px' }}>
        <Badge small />
      </div>
    </Fragment>
  ),
  props: [
    { name: 'firstName', type: 'string', required: false },
    { name: 'lastName', type: 'string', required: false },
    { name: 'icon', type: 'string', required: false },
    { name: 'small', type: 'boolean', required: false },
  ],
};

export default Elements.add('Badge', () => <DocPage {...badge} />);
