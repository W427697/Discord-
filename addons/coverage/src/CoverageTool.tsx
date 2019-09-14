import React, { useState } from 'react';
import { window } from 'global';
import { Icons, IconButton } from '@storybook/components';
import { useChannel, useAddonState } from '@storybook/api';
import { SELECT_STORY } from '@storybook/core-events';

import {
  PARAM_KEY,
  EVENTS,
  CoverageMap,
  CoverageSummary,
  CoverageItem,
  setCoverageSummary,
  getCoverageSummary,
} from './shared';

const heatmap = ['#fecc5c', '#fd8d3c', '#f03b20', '#bd0026', '#bd0026', '#bd0026'].reverse();

function heatmapColor(val: number) {
  if (!val && val !== 0) {
    return null;
  }
  if (val === 100) {
    return '#74c476';
  }
  const idx = Math.floor(heatmap.length * (val / 100));
  return heatmap[idx];
}

const getColor = (storyId: string, active: boolean) => {
  const coverageSummary = getCoverageSummary();
  return active && storyId && coverageSummary && heatmapColor(coverageSummary[storyId]);
};

export const CoverageTool: React.FunctionComponent<{}> = () => {
  const [active, setActive] = useState(true);
  const icon = active ? 'eye' : 'eyeclose';

  window.getStoryColor = (storyId: string) => getColor(storyId, active);
  const emit = useChannel({
    [EVENTS.COVERAGE_SUMMARY]: (summary: CoverageSummary) => {
      setCoverageSummary(summary);
    },
  });
  return (
    <IconButton
      key={PARAM_KEY}
      active={active}
      title="Story Coverage"
      onClick={() => {
        setActive(!active);
        emit(SELECT_STORY, { kind: 'Coverage|Welcome', story: 'normal' });
      }}
    >
      <Icons icon={icon} />
    </IconButton>
  );
};
