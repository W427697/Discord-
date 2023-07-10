import { useStorybookState } from '@storybook/manager-api';
import type { FC } from 'react';
import React from 'react';

import { WhatsNewScreen } from './whats_new';

const WhatsNewPage: FC = () => {
  const state = useStorybookState();

  return <WhatsNewScreen whatsNewData={state.whatsNewData} />;
};

export { WhatsNewPage };
