import type { FC } from 'react';
import React from 'react';
import { useStorybookState } from '../api';

import { WhatsNewScreen } from './whats_new';

const WhatsNewPage: FC = () => {
  return <WhatsNewScreen />;
};

export { WhatsNewPage };
