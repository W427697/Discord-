// @flow
import React from 'react';
import { getColorFromString } from '@ied/color';
import { version } from '@ied/color/package.json';
import { Helpers } from '../Categories';
import DocPage from '../../commons/DocPage';

const color = {
  name: 'Color',
  description: 'A helper that return a color by string',
  version,
  usage: `
  import { getColorFromString } from '@ied/color'

  const color = getColorFromString('Spiderman')
  `,
  component: (
    <div>
      <li style={{ color: getColorFromString('Spiderman') }}>Spiderman</li>
      <li style={{ color: getColorFromString('Iron man') }}>Iron man</li>
      <li style={{ color: getColorFromString('Batman') }}>Batman</li>
    </div>
  ),
  props: [
    { name: 'string', type: 'string', required: true },
    { name: 'saturation', type: 'number', required: false },
    { name: 'luminosity', type: 'number', required: false },
    { name: 'opacity', type: 'number', required: false },
  ],
};

export default Helpers.add('Color', () => <DocPage {...color} />);
