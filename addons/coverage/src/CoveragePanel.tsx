import React from 'react';
import { useChannel, useAddonState } from '@storybook/api';
import { StoryCoverage, ADDON_ID, EVENTS } from './shared';

interface CoverageProps {
  coverage: StoryCoverage;
}

const Coverage: React.FunctionComponent<CoverageProps> = ({ coverage }) => {
  return <div>{JSON.stringify(coverage, null, 2)}</div>;
};

export const CoveragePanel: React.FunctionComponent<{}> = () => {
  const [coverage, setCoverage] = useAddonState<StoryCoverage>(ADDON_ID, null);
  const emit = useChannel({
    [EVENTS.COVERAGE]: (coverage: StoryCoverage) => setCoverage(coverage),
  });
  // console.log('panel', { coverage });
  return coverage ? <Coverage coverage={coverage} /> : <div>No coverage</div>;
};
