import React, { useState } from 'react';
import { window } from 'global';
import { Icons, IconButton } from '@storybook/components';
import { PARAM_KEY, CoverageMap, CoverageItem, getCoverage } from './shared';

function coverageKey(kind: string): string {
  const parts = kind.split(/\||\/|\./);
  return parts[parts.length - 1].toLowerCase();
}

// enum Color {
//   LOW = '#fce1e5',
//   MED = '#fff4c2',
//   HIGH = '#e6f5d0',
// }
enum Color {
  HIGH = '#B4E095',
  MED = '#F0F775',
  LOW = '#F1C25B',
  VLOW = '#F97979',
}

function percent(covered: number, total: number) {
  if (total > 0) {
    const tmp = (1000 * 100 * covered) / total + 5;
    return Math.floor(tmp / 10) / 100;
  } else {
    return 100.0;
  }
}

function computeSimpleTotals(fileCoverage: any, property: any, mapProperty: any) {
  var stats = fileCoverage[property],
    map = mapProperty ? fileCoverage[mapProperty] : null,
    ret = { total: 0, covered: 0, skipped: 0 };

  Object.keys(stats).forEach(function(key) {
    var covered = !!stats[key],
      skipped = map && map[key].skip;
    ret.total += 1;
    if (covered || skipped) {
      ret.covered += 1;
    }
    if (!covered && skipped) {
      ret.skipped += 1;
    }
  });
  return percent(ret.covered, ret.total);
}

function compute(key: string, coverage: CoverageItem) {
  console.log(key, coverage);
  return computeSimpleTotals(coverage, 's', 'statementMap');
}

function getCoverageColor(kind: string, coverageMap: CoverageMap): string | null {
  const key = coverageKey(kind);
  const coverage = coverageMap[key];
  if (!coverage) return null;

  const val = compute(key, coverage);
  switch (true) {
    case val >= 90:
      return Color.HIGH;
    case val >= 60:
      return Color.MED;
    case val >= 40:
      return Color.LOW;
    default:
      return Color.VLOW;
  }
}

const getColor = (kind: string, parameters: any, active: boolean) => {
  const coverageMap = getCoverage();
  // console.log('parameters', parameters);
  return (active && kind && coverageMap && getCoverageColor(kind, coverageMap)) || 'transparent';
};

// const getYellow = (kind: string, active: boolean) => (active ? '#ffff00' : 'transparent');

export const Coverage: React.FunctionComponent<{}> = () => {
  const [active, setActive] = useState(false);
  const icon = active ? 'eye' : 'eyeclose';

  window.getKindColor = (kind: string, parameters: any) => getColor(kind, parameters, active);

  return (
    <IconButton
      key={PARAM_KEY}
      active={active}
      title="Story Coverage"
      onClick={() => setActive(!active)}
    >
      <Icons icon={icon} />
    </IconButton>
  );
};
