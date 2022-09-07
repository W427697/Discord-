/* eslint-disable import/first,import/no-duplicates */
import React from 'react';

export default {
  title: 'Core/Interleaved exports',
  parameters: { chromatic: { disable: true } },
};

import { Welcome } from '../../components/react-demo';

export const First = () => <Welcome showApp={() => {}} />;

import { Button } from '../../components/react-demo';

export const Second = () => <Button onClick={() => {}}>Second</Button>;
