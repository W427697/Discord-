import React, { Suspense } from 'react';
import { RSC } from './RSC';

export default {
  component: RSC,
};

export const Default = {};

export const DisableRSC = {
  parameters: {
    nextjs: { rsc: false },
  },
};

export const Error = {
  render: () => {
    throw new Error('RSC Error');
  },
};
