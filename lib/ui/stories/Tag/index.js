// @flow
import React, { Fragment } from 'react';
import Tag from '@ied/tag';
import { version } from '@ied/tag/package.json';
import { action } from '@storybook/addon-actions';

import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

const tag = {
  name: 'Tag',
  description: 'A component that represents a tag',
  version,
  usage: `
import Tag from '@ied/tag'

<Tag label="Bookeeping" />
<Tag label="Bookeeping" withDot />
  `,
  component: (
    <Fragment>
      <Tag
        label="Bookeeping"
        onClick={() => {
          action('Tag clicked')('Clicked');
        }}
      />
      <Tag
        label="Bookeeping"
        withDot
        onClick={() => {
          action('Tag clicked')('Clicked');
        }}
      />
    </Fragment>
  ),
  props: [
    { name: 'label', type: 'string', required: true },
    { name: 'withDot', type: 'boolean', required: false },
    { name: 'onClick', type: 'function', required: false },
  ],
};

export default Elements.add('Tag', () => <DocPage {...tag} />);
