import React from 'react';
import { storiesOf } from '@storybook/react';

import About from './about';

const releases = [
  {
    version: '6.0.0-alpha.1',
    tag: 'alpha',
  },
  {
    version: '6.0.0-alpha.2',
    tag: 'alpha',
  },
  {
    version: '6.0.1-alpha.0',
    tag: 'alpha',
  },
  {
    version: '5.0.0-rc.0',
    tag: 'rc',
  },
  {
    version: '5.1.1',
    tag: 'latest',
  },
  {
    version: '5.0.0',
    tag: 'latest',
  },
  {
    version: '4.0.0',
    tag: 'latest',
  },
  {
    version: '4.1.0',
    tag: 'latest',
  },
  {
    version: '4.1.1',
    tag: 'latest',
  },
];

storiesOf('Sections|Settings/about', module)
  .add('latest up to date', () => <About version="5.1.1" tag="latest" releases={releases} />)
  .add('alpha up to date', () => <About version="6.0.1-alpha.0" tag="alpha" releases={releases} />)
  .add('major out of date', () => <About version="4.0.0" tag="latest" releases={releases} />)
  .add('minor major out of date', () => <About version="5.0.0" tag="latest" releases={releases} />)
  .add('patch major out of date', () => <About version="5.1.0" tag="latest" releases={releases} />)
  .add('alpha out of date', () => (
    <About version="6.0.0-alpha.1" tag="alpha" releases={releases} />
  ));
