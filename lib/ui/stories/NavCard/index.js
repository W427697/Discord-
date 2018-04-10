// @flow
import React, { Fragment } from 'react';
import NavCard from '@ied/nav-card';
import { version } from '@ied/nav-card/package.json';
import { action } from '@storybook/addon-actions';

import { Elements } from '../Categories';
import DocPage from '../../commons/DocPage';

const component = {
  name: 'Nav-Card',
  description: 'A component that represents a NavCard',
  version,
  requirement: `
<!-- Add Material Icons font to your 'index.html' -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  `,
  usage: `
import NavCard from '@ied/nav-card'

<NavCard title="Informations" description="Update your profile" icon="person" />
`,
  component: (
    <NavCard
      title="Informations"
      description="Update your profile"
      icon="person"
      onClick={() => {
        action('NavCard')('Clicked');
      }}
    />
  ),
  props: [
    { name: 'title', type: 'string', required: true },
    { name: 'description', type: 'string', required: true },
    { name: 'icon', type: 'string', required: false },
    { name: 'onClick', type: 'MouseEvent => void', required: false },
  ],
};

export default Elements.add('NavCard', () => <DocPage {...component} />);
