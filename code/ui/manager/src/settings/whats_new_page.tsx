import type { FC } from 'react';
import React from 'react';
import { useStorybookState } from '../api';

import { WhatsNewScreen } from './whats_new';

const WhatsNewPage: FC = () => {
  const state = useStorybookState();

  return (
    <WhatsNewScreen
      url={state.whatsNewData?.status === 'SUCCESS' ? state.whatsNewData.url : undefined}
    />
  );
};

export { WhatsNewPage };
