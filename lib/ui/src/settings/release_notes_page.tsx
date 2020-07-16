import { useStorybookApi } from '@storybook/api';
import React, { FunctionComponent, useEffect, Fragment } from 'react';

import { ReleaseNotesScreen } from './release_notes';

const ReleaseNotesPage: FunctionComponent<{}> = () => {
  const api = useStorybookApi();

  useEffect(() => {
    api.setDidViewReleaseNotes();
  }, []);

  const version = api.releaseNotesVersion();

  return version ? (
    <ReleaseNotesScreen version={version} />
  ) : (
    <Fragment>Sorry, we don't know what version to load</Fragment>
  );
};

export { ReleaseNotesPage };
