import { useStorybookApi } from '@storybook/manager-api';
import type { FC } from 'react';
import React, { useEffect } from 'react';

import { ReleaseNotesScreen } from './ReleaseNotes';

const ReleaseNotesPage: FC = () => {
  const api = useStorybookApi();

  useEffect(() => {
    api.setDidViewReleaseNotes();
  }, []);

  const version = api.releaseNotesVersion();

  return <ReleaseNotesScreen version={version} />;
};

export { ReleaseNotesPage };
