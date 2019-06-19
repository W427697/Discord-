import React from 'react';
import { API, Consumer, Combo } from '@storybook/api';
import { CoverageMap, PARAM_KEY } from './shared';
import { storyCoverage } from './storyCoverage';

interface CoveragePanelProps {
  active: boolean;
  api: API;
}

interface CoverageProps {
  coverageMap: CoverageMap;
}

const mapper = ({ state, api }: Combo): { value?: CoverageMap } => {
  return { value: api.getParameters(state.storyId, PARAM_KEY) };
};

const Coverage: React.FunctionComponent<CoverageProps> = ({ coverageMap }) => {
  const ROOT = '/Users/shilman/projects/storybookjs/storybook';
  const storyMap = {
    [`${ROOT}/lib/ui/src/components/layout/desktop`]: ['desktop--id'],
    [`${ROOT}/lib/ui/src/components/sidebar/Sidebar`]: ['sidebar--id'],
  };
  const cov = storyCoverage(coverageMap, storyMap);
  return <div>{JSON.stringify(cov, null, 2)}</div>;
};

export const CoveragePanel: React.FunctionComponent<CoveragePanelProps> = ({ active, api }) => {
  return (
    <Consumer filter={mapper}>
      {({ value: map }: { value?: CoverageMap }) =>
        map ? <Coverage coverageMap={map} /> : <div>No coverage</div>
      }
    </Consumer>
  );
};
